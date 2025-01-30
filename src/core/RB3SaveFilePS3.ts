import type { PathLikeTypes } from 'path-js'
import Path from 'path-js'
import { RB3SaveFileError, UnknownFileFormatError } from '../errors.js'

export type RB3SaveFilePlatformTypes = 'xbox' | 'ps3' | 'wii'

export type RB3ScoresObjectKeys = 'songID' | 'lighterRating' | 'playCount'

export interface RB3ScoresInstrumentScores {
  /**
   * The top score of the song on the instrument.
   */
  topScore: number
  /**
   * The difficulty that the top score were earned.
   */
  topScoreDifficulty: number
  /**
   * The stars earned on Easy difficulty.
   */
  starsEasy: number
  /**
   * The percentage achieved on Easy difficulty.
   */
  percentEasy: number
  /**
   * The stars earned on Medium difficulty.
   */
  starsMedium: number
  /**
   * The percentage achieved on Medium difficulty.
   */
  percentMedium: number
  /**
   * The stars earned on Hard difficulty.
   */
  starsHard: number
  /**
   * The percentage achieved on Hard difficulty.
   */
  percentHard: number
  /**
   * The stars earned on Expert difficulty.
   */
  starsExpert: number
  /**
   * The percentage achieved on Expert difficulty.
   */
  percentExpert: number
}

export interface RB3ScoresObject {
  /**
   * A numerical, unique number ID of the song.
   */
  songID: number
  /**
   * The lighter rating given to this song.
   */
  lighterRating: number
  /**
   * The amount of times this song were played.
   */
  playCount: number
  /**
   * An object with scores for Drums.
   */
  drums: RB3ScoresInstrumentScores
  /**
   * An object with scores for Bass.
   */
  bass: RB3ScoresInstrumentScores
  /**
   * An object with scores for Guitar.
   */
  guitar: RB3ScoresInstrumentScores
  /**
   * An object with scores for Solo Vocals.
   */
  vocals: RB3ScoresInstrumentScores
  /**
   * An object with scores for Harmonies.
   */
  harms: RB3ScoresInstrumentScores
  /**
   * An object with scores for Keys.
   */
  keys: RB3ScoresInstrumentScores
  /**
   * An object with scores for PRO Drums.
   */
  proDrums: RB3ScoresInstrumentScores
  /**
   * An object with scores for PRO Guitar.
   */
  proGuitar: RB3ScoresInstrumentScores
  /**
   * An object with scores for PRO Bass.
   */
  proBass: RB3ScoresInstrumentScores
  /**
   * An object with scores for PRO Keys.
   */
  proKeys: RB3ScoresInstrumentScores
  /**
   * An object with scores for Band.
   */
  band: RB3ScoresInstrumentScores
}

export interface RB3ScoresContents {
  /**
   * The profile name.
   */
  profileName: string
  /**
   * An array with all played songs scores.
   */
  scores: RB3ScoresObject[]
}

/**
 * A class that parses decrypted PS3 Rock Band 3 save data files.
 *
 * _NOTE: The implementation of this class and its methods are focused on properly reading_
 * _decrypted PS3 save files. Not save file editing and rewriting were implemented_
 * _on this code. If you try to read a XBox or Wii save file will return a `RB3SaveFileError`._
 * - - - -
 */
export class RB3SaveFilePS3 {
  private dtbXOR(key: number): number {
    let val = (((key - Math.floor(key / 0x1f31d) * 0x1f31d) * 0x41a7) >>> 0) - ((Math.floor(key / 0x1f31d) * 0xb14) >>> 0)
    if (val <= 0) val = (val - 0x80000000 - 1) >>> 0
    return val
  }

  private newDTBCrypt(input: Buffer): Buffer {
    let key = input.readUInt32LE(0)
    const outSize = input.length - 4
    const output = Buffer.alloc(outSize)
    for (let i = 0; i < outSize; i++) {
      key = this.dtbXOR(key)
      output[i] = (input[i + 4] & 0xff) ^ (key & 0xff)
    }
    return output
  }

  /**
   * Gets and decrypts score list bytes from a Rock Band 3 save data file.
   * - - - -
   * @returns {Buffer[]}
   */
  private getScoresListBytes(): Buffer[] {
    let start = 0
    if (this.platform === 'xbox') start = 0x2c7123
    else if (this.platform === 'ps3') start = 0x2c7197
    const encryptedScoresBlock = this.buffer.subarray(start, start + 0x15b33c)
    let decryptedScoresBlock = this.newDTBCrypt(encryptedScoresBlock)

    const xboxPS3UnknownBytes = Buffer.alloc(0x84)
    decryptedScoresBlock.copy(xboxPS3UnknownBytes, 0, 0x15b2b4, 0x15b2b4 + 0x84)
    decryptedScoresBlock = decryptedScoresBlock.subarray(4)

    const scores: Buffer[] = []
    for (let i = 0; i < decryptedScoresBlock.length; i++) {
      const test = decryptedScoresBlock.readUInt32LE(i * 0x1da)

      if (test === 0 || i === 0xbb8) {
        if (i === 0xbb8) {
          console.warn('More than 3000 songs were detected, but only 2999 can be stored. Only displaying the first 2999 songs')
        }
        break
      }
      const score = Buffer.alloc(0x1da)
      decryptedScoresBlock.copy(score, 0, i * 0x1da, i * 0x1da + 0x1da)
      scores.push(score)
    }

    return scores
  }

  /**
   * Removes the duplicated ID bytes from a decrypted score list bytes and returns
   * - - - -
   * @param {Buffer} input The score list bytes to remove the duplicated ID from.
   * @returns {Buffer}
   */
  private removeDupeID0x04(input: Buffer): Buffer {
    // Get the first 4 bytes
    const first = input.subarray(0, 4)

    // Skip the 4 bytes at index 4 and get the rest
    const second = input.subarray(8)

    // Concatenate the two parts into a new Buffer
    const output = Buffer.concat([first, second])

    return output
  }

  /**
   * Parses a decrypted score list bytes to object.
   * - - - -
   * @param {Buffer} input The score list bytes to be parsed.
   * @param {boolean} isWiiScore A boolean value that flags if the score are being parsed from Wii save data file.
   * @returns {RB3ScoresObject}
   */
  private bytesToScore(input: Buffer, isWiiScore: boolean): RB3ScoresObject {
    const score = new Map()
    score.set('song_id', input.readUInt32LE(0x00))
    if (!isWiiScore) {
      score.set('song_id', input.readUInt32LE(0x04))
      input = this.removeDupeID0x04(input)
    }
    score.set('lighterRating', input[0x06])
    score.set('playCount', input.readInt32LE(0x0b))

    // Drums
    const drums = new Map()
    drums.set('topScore', input.readInt32LE(0x3f))
    drums.set('topScoreDifficulty', input[0x43])
    drums.set('starsEasy', input[0x44])
    drums.set('percentEasy', input[0x45])
    drums.set('starsMedium', input[0x4c])
    drums.set('percentMedium', input[0x4d])
    drums.set('starsHard', input[0x54])
    drums.set('percentHard', input[0x55])
    drums.set('starsExpert', input[0x5c])
    drums.set('percentExpert', input[0x5d])
    score.set('drums', Object.fromEntries(drums))

    // Bass
    const bass = new Map()
    bass.set('topScore', input.readInt32LE(0x64))
    bass.set('topScoreDifficulty', input[0x68])
    bass.set('starsEasy', input[0x69])
    bass.set('percentEasy', input[0x6a])
    bass.set('starsMedium', input[0x71])
    bass.set('percentMedium', input[0x72])
    bass.set('starsHard', input[0x79])
    bass.set('percentHard', input[0x7a])
    bass.set('starsExpert', input[0x81])
    bass.set('percentExpert', input[0x82])
    score.set('bass', Object.fromEntries(bass))

    // Guitar
    const guitar = new Map()
    guitar.set('topScore', input.readInt32LE(0x89))
    guitar.set('topScoreDifficulty', input[0x8d])
    guitar.set('starsEasy', input[0x8e])
    guitar.set('percentEasy', input[0x8f])
    guitar.set('starsMedium', input[0x96])
    guitar.set('percentMedium', input[0x97])
    guitar.set('starsHard', input[0x9e])
    guitar.set('percentHard', input[0x9f])
    guitar.set('starsExpert', input[0xa6])
    guitar.set('percentExpert', input[0xa7])
    score.set('guitar', Object.fromEntries(guitar))

    // Vocals
    const vocals = new Map()
    vocals.set('topScore', input.readInt32LE(0xae))
    vocals.set('topScoreDifficulty', input[0xb2])
    vocals.set('starsEasy', input[0xb3])
    vocals.set('percentEasy', input[0xb4])
    vocals.set('starsMedium', input[0xbb])
    vocals.set('percentMedium', input[0xbc])
    vocals.set('starsHard', input[0xc3])
    vocals.set('percentHard', input[0xc4])
    vocals.set('starsExpert', input[0xcb])
    vocals.set('percentExpert', input[0xcc])
    score.set('vocals', Object.fromEntries(vocals))

    // Harmonies
    const harms = new Map()
    harms.set('topScore', input.readInt32LE(0xd3))
    harms.set('topScoreDifficulty', input[0xd7])
    harms.set('starsEasy', input[0xd8])
    harms.set('percentEasy', input[0xd9])
    harms.set('starsMedium', input[0xe0])
    harms.set('percentMedium', input[0xe1])
    harms.set('starsHard', input[0xe8])
    harms.set('percentHard', input[0xe9])
    harms.set('starsExpert', input[0xf0])
    harms.set('percentExpert', input[0xf1])
    score.set('harms', Object.fromEntries(harms))

    // Keys
    const keys = new Map()
    keys.set('topScore', input.readInt32LE(0xf8))
    keys.set('topScoreDifficulty', input[0xfc])
    keys.set('starsEasy', input[0xfd])
    keys.set('percentEasy', input[0xfe])
    keys.set('starsMedium', input[0x105])
    keys.set('percentMedium', input[0x106])
    keys.set('starsHard', input[0x10d])
    keys.set('percentHard', input[0x10e])
    keys.set('starsExpert', input[0x115])
    keys.set('percentExpert', input[0x116])
    score.set('keys', Object.fromEntries(keys))

    // PRO Drums
    const proDrums = new Map()
    proDrums.set('topScore', input.readInt32LE(0x11d))
    proDrums.set('topScoreDifficulty', input[0x121])
    proDrums.set('starsEasy', input[0x122])
    proDrums.set('percentEasy', input[0x123])
    proDrums.set('starsMedium', input[0x12a])
    proDrums.set('percentMedium', input[0x12b])
    proDrums.set('starsHard', input[0x132])
    proDrums.set('percentHard', input[0x133])
    proDrums.set('starsExpert', input[0x13a])
    proDrums.set('percentExpert', input[0x13b])
    score.set('proDrums', Object.fromEntries(proDrums))

    // PRO Guitar
    const proGuitar = new Map()
    proGuitar.set('topScore', input.readInt32LE(0x142))
    proGuitar.set('topScoreDifficulty', input[0x146])
    proGuitar.set('starsEasy', input[0x147])
    proGuitar.set('percentEasy', input[0x148])
    proGuitar.set('starsMedium', input[0x14f])
    proGuitar.set('percentMedium', input[0x150])
    proGuitar.set('starsHard', input[0x157])
    proGuitar.set('percentHard', input[0x158])
    proGuitar.set('starsExpert', input[0x15f])
    proGuitar.set('percentExpert', input[0x160])
    score.set('proGuitar', Object.fromEntries(proGuitar))

    // PRO Bass
    const proBass = new Map()
    proBass.set('topScore', input.readInt32LE(0x167))
    proBass.set('topScoreDifficulty', input[0x16b])
    proBass.set('starsEasy', input[0x16c])
    proBass.set('percentEasy', input[0x16d])
    proBass.set('starsMedium', input[0x174])
    proBass.set('percentMedium', input[0x175])
    proBass.set('starsHard', input[0x17c])
    proBass.set('percentHard', input[0x17d])
    proBass.set('starsExpert', input[0x184])
    proBass.set('percentExpert', input[0x185])
    score.set('proBass', Object.fromEntries(proBass))

    // PRO Keys
    const proKeys = new Map()
    proKeys.set('topScore', input.readInt32LE(0x18c))
    proKeys.set('topScoreDifficulty', input[0x190])
    proKeys.set('starsEasy', input[0x191])
    proKeys.set('percentEasy', input[0x192])
    proKeys.set('starsMedium', input[0x199])
    proKeys.set('percentMedium', input[0x19a])
    proKeys.set('starsHard', input[0x1a1])
    proKeys.set('percentHard', input[0x1a2])
    proKeys.set('starsExpert', input[0x1a9])
    proKeys.set('percentExpert', input[0x1aa])
    score.set('proKeys', Object.fromEntries(proKeys))

    // Band
    const band = new Map()
    band.set('topScore', input.readInt32LE(0x1b1))
    band.set('topScoreDifficulty', input[0x1b5])
    band.set('starsEasy', input[0x1b6])
    band.set('percentEasy', input[0x1b7])
    band.set('starsMedium', input[0x1be])
    band.set('percentMedium', input[0x1bf])
    band.set('starsHard', input[0x1c6])
    band.set('percentHard', input[0x1c7])
    band.set('starsExpert', input[0x1ce])
    band.set('percentExpert', input[0x1cf])
    score.set('band', Object.fromEntries(band))

    return Object.fromEntries(score) as RB3ScoresObject
  }

  /**
   * Iterates through every decrypted score list bytes and parses one by one.
   * - - - -
   * @param {Buffer[]} inputList An array of decrypted scores list as `Buffer`.
   * @returns {RB3ScoresObject[]}
   */
  private getScoresList(inputList: Buffer[]): RB3ScoresObject[] {
    const scoreList: RB3ScoresObject[] = []
    if (inputList.length === 0) return scoreList
    let isWiiScore = false
    if (inputList[0].length === 0x1d6) isWiiScore = true
    for (const input of inputList) {
      const score = this.bytesToScore(input, isWiiScore)
      scoreList.push(score)
    }
    return scoreList
  }

  /**
   * The path to the Rock Band 3 save file.
   */
  path: Path
  /**
   * The Rock Band 3 save file buffer.
   */
  buffer: Buffer
  /**
   * The platform of the Rock Band 3 save file.
   */
  platform: RB3SaveFilePlatformTypes

  /**
   * @param {PathLikeTypes} saveFilePath The path to the Rock Band 3 save file.
   */
  constructor(saveFilePath: PathLikeTypes) {
    this.path = Path.stringToPath(saveFilePath)
    if (this.path.ext.toLowerCase() !== '.dat') throw new UnknownFileFormatError('Only Wii "band3.dat", Xbox 360 "save.dat", and decrypted PS3 "SAVE.DAT" files are supported.')
    this.buffer = this.path.readFileSync()

    if (this.buffer.length === 0xc00000) {
      throw new RB3SaveFileError('Tried to read a Wii save file, but this class only supports decrypted PS3 .dat files.')
      // this.platform = 'wii'
    } else if (this.buffer.length === 0x43a929) {
      throw new RB3SaveFileError('Tried to read a Xbox 360 save file, but this class only supports decrypted PS3 .dat files.')
      // this.platform = 'xbox'
    } else if (this.buffer.length === 0x43a99d) this.platform = 'ps3'
    else if (this.buffer.length === 0x43a99c) throw new RB3SaveFileError('Tried to read a PS3 save file, but the provided file is not a Title Update 5 save file. This class only supports PS3 TU5 save files.')
    else throw new UnknownFileFormatError(`Provided file "${this.path.path}" is not supported.`)
  }

  /**
   * Returns the username of the save data file.
   * - - - -
   * @returns {string}
   */
  getXboxPS3BandName(): string {
    const startOffset = this.platform === 'ps3' ? 0x43a7e7 : 0x43a773
    let output = ''
    for (let i = 0; i < 0x2e; i++) {
      const start = startOffset + (i >>> 0)
      const end = start + 1
      const c = this.buffer.subarray(start, end).toString('ascii')
      if (c !== '\u0000') output += c
      else return output
    }

    return output
  }

  /**
   * Parses the Rock Band 3 save file data, returning an object will all scores.
   * - - - -
   * @returns {RB3ScoresContents}
   */
  parseSaveFile(): RB3ScoresContents {
    // Get the decrypted bytes of all scores
    const scoresListBytes = this.getScoresListBytes()

    // Convert bytes to array of parsed scores objects
    const scoresList = this.getScoresList(scoresListBytes)

    // Get profile name
    let profileName = ''
    if (this.platform !== 'wii') profileName = this.getXboxPS3BandName()
    else profileName = ''
    return {
      profileName,
      scores: scoresList,
    }
  }
}
