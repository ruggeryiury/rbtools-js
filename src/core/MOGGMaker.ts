import { ExifTool } from 'exiftool-vendored'
import Path, { type StringOrPath } from 'path-js'
import { MOGGFileError } from '../errors.js'
import { MakeMogg } from '../exec.js'
import { audioToMOGG } from '../python.js'
import { MOGGFile } from './MOGGFile.js'

export type MOGGFileQualityLevels = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** A class to create a MOGG file from audio files. */
export class MOGGMaker {
  /** An array with paths of the audio files to be placed on the MOGG file. */
  private tracks: StringOrPath[]
  /** The quality level of the MOGG file. Default is `3`. */
  private quality: MOGGFileQualityLevels
  /** The channels count of the MOGG file. */
  private channelsCount: number
  /** The duration of the MOGG file. */
  private audioDuration: number
  /** The sample rate of the MOGG file. */
  private audioSampleRate: number
  /** An instantiated class of `ExifTool` class to fetch all audio's data. */
  private exiftool: ExifTool

  /**
   * @param {string[]} paths The paths of the audio files that will be placed on the MOGG file.
   */
  constructor(...paths: StringOrPath[]) {
    this.tracks = [...paths]
    this.quality = 3
    this.channelsCount = 0
    this.audioDuration = 0
    this.audioSampleRate = 0
    this.exiftool = new ExifTool({})
  }

  /**
   * Returns the channels count of the MOGG file.
   * - - - -
   * @returns {number}
   */
  channels(): number {
    return this.channelsCount
  }

  /**
   * Sets the quality level of the MOGG file.
   * @param {MOGGFileQualityLevels} quality The quality level.
   */
  setQuality(quality: MOGGFileQualityLevels): void {
    this.quality = quality
  }

  /**
   * Asynchonously adds a new audio track to the MOGG file.
   * - - - -
   * @param {StringOrPath} audioFilePath The path to the audio track that will be added to the MOGG file.
   */
  async addTrack(audioFilePath: StringOrPath): Promise<void> {
    const path = Path.stringToPath(audioFilePath)
    const data = await this.exiftool.read(path.path)

    const { NumChannels, Duration, SampleRate, FileTypeExtension } = data
    if (!NumChannels || !Duration || !SampleRate || !FileTypeExtension) throw new MOGGFileError(`Provided file "${path.path}" is not a compatible audio file`)
    if (this.audioDuration === 0) this.audioDuration = Duration
    else if (this.audioDuration !== Duration) {
      await this.exiftool.end()
      throw new MOGGFileError(`Provided file "${path.path}" doesn't have the same duration from the first audio file added to this class\n\nClass audio duration: ${this.audioDuration.toString()}\nProvided file duration: ${Duration.toString()}`)
    }

    if (this.audioSampleRate === 0) this.audioSampleRate = SampleRate
    if (this.audioSampleRate !== SampleRate) {
      await this.exiftool.end()
      throw new MOGGFileError(`Provided file "${path.path}" doesn't have the same sample rate from the first audio file added to this class\n\nClass sample rate: ${this.audioSampleRate.toString()}\nProvided file sample rate: ${SampleRate.toString()}`)
    }

    this.tracks.push(path)
  }

  /**
   * Asynchonously creates the MOGG file and returns a new `MOGGFile` class pointing to the new MOGG file.
   * - - - -
   * @param {StringOrPath} destPath The path to the new MOGG file to be created.
   * @returns {Promise<MOGGFile>}
   */
  async create(destPath: StringOrPath): Promise<MOGGFile> {
    destPath = Path.stringToPath(Path.stringToPath(destPath).changeFileExt('.ogg'))
    const newMoggFile = Path.stringToPath(destPath).changeFileExt('.mogg')
    await this.exiftool.end()
    await audioToMOGG(this.tracks, Path.stringToPath(destPath))
    await MakeMogg(destPath, newMoggFile)
    await destPath.checkThenDeleteFile()
    return new MOGGFile(newMoggFile)
  }
}
