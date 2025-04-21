import { DirPath, FilePath, type FilePathJSONRepresentation, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import { STFSFileError, WrongDTATypeError } from '../errors'
import { DTAParser } from '../index'
import { detectBufferEncoding, stfsExtract, stfsExtractAllFiles, stfsFileStat, stfsFileStatSync } from '../lib'

export interface STFSFileStatRawObject {
  /** The name of the package. */
  name: string
  /** The description of the package. */
  desc: string
  /** An array with all files included on the CON file. */
  files: string[]
  /** The contents of the package's DTA file. */
  dta?: string
  /** The contents of the package's upgrades DTA file. */
  upgrades?: string
}

export type STFSFileStatObject = Omit<STFSFileStatRawObject, 'dta' | 'upgrades'> & {
  /** The contents of the package's DTA file. */
  dta?: DTAParser
  /** The contents of the package's upgrades DTA file. */
  upgrades?: DTAParser
  /** A boolean value that tells if the package has two or more songs. */
  isPack: boolean
  /** A boolean value that tells if the package has PRO Guitar/Bass upgrades. */
  hasUpgrades: boolean
}

export interface STFSFileJSONObject extends FilePathJSONRepresentation {
  /** The statistics of the CON file. */
  file: STFSFileStatObject
}

/**
 * STFSFile is a class that represents a Xbox CON file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class STFSFile {
  /** The path of the CON file. */
  path: FilePath

  /**
   * @param {PathLikeTypes} stfsFilePath The path to the CON file.
   */
  constructor(stfsFilePath: PathLikeTypes) {
    const path = FilePath.of(pathLikeToString(stfsFilePath))
    this.path = path

    this.checkExistence()
  }

  /**
   * Checks if a path resolves to an existing CON file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists) throw new STFSFileError(`Xbox CON file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * Asynchronously returns a JSON object with statistics of the CON file.
   * - - - -
   * @returns {Promise<STFSFileStatObject>}
   */
  async stat(): Promise<STFSFileStatObject> {
    this.checkExistence()
    const stat = await stfsFileStat(this.path.path)
    let isPack = false
    const hasUpgrades = stat.files.includes('/songs_upgrades/upgrades.dta')

    let dta: DTAParser | undefined
    let upgrades: DTAParser | undefined
    if (stat.dta) {
      const enc = detectBufferEncoding(stat.dta)
      try {
        dta = DTAParser.fromBuffer(Buffer.from(stat.dta, enc))
      } catch (err) {
        if (err instanceof WrongDTATypeError) dta = DTAParser.fromBuffer(Buffer.from(stat.dta, enc), 'partial')
        else throw err
      }
    }
    if (dta && dta.songs.length > 1) isPack = true

    if (stat.upgrades) {
      const enc = detectBufferEncoding(stat.upgrades)
      upgrades = DTAParser.fromBuffer(Buffer.from(stat.upgrades, enc))
    }

    return { ...stat, dta, upgrades, isPack, hasUpgrades }
  }

  /**
   * Returns a JSON object with statistics of the CON file.
   * - - - -
   * @returns {STFSFileStatObject}
   */
  statSync(): STFSFileStatObject {
    this.checkExistence()
    const stat = stfsFileStatSync(this.path.path)
    let isPack = false
    const hasUpgrades = stat.files.includes('/songs_upgrades/upgrades.dta')

    let dta: DTAParser | undefined
    let upgrades: DTAParser | undefined
    if (stat.dta) {
      const enc = detectBufferEncoding(stat.dta)
      try {
        dta = DTAParser.fromBuffer(Buffer.from(stat.dta, enc))
      } catch (err) {
        if (err instanceof WrongDTATypeError) dta = DTAParser.fromBuffer(Buffer.from(stat.dta, enc), 'partial')
        else throw err
      }
    }
    if (dta && dta.songs.length > 1) isPack = true

    if (stat.upgrades) {
      const enc = detectBufferEncoding(stat.upgrades)
      upgrades = DTAParser.fromBuffer(Buffer.from(stat.upgrades, enc))
    }

    return { ...stat, dta, upgrades, isPack, hasUpgrades }
  }

  /**
   * Returns a JSON representation of the STFS file class.
   * - - - -
   * @returns {STFSFileJSONObject}
   */
  toJSONSync(): STFSFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.statSync(),
    }
  }

  /**
   * Asynchronously returns a JSON representation of the STFS file class.
   * - - - -
   * @returns {Promise<STFSFileJSONObject>}
   */
  async toJSON(): Promise<STFSFileJSONObject> {
    return {
      ...this.path.toJSON(),
      file: await this.stat(),
    }
  }

  /**
   * Asynchronously extracts the CON file contents and returns the folder path where all contents were extracted.
   * - - - -
   * @param {PathLikeTypes} destPath The folder path where you want the files to be extracted to.
   * @returns {Promise<DirPath>}
   */
  async extract(destPath: PathLikeTypes): Promise<DirPath> {
    return await stfsExtract(this.path, destPath)
  }

  /**
   * Asynchronously extracts all files from a CON file on the root directory of the destination path and returns
   * the folder path where all contents were extracted.
   * - - - -
   * @param {PathLikeTypes} destPath The folder path where you want the files to be extracted to.
   * @returns {Promise<DirPath>}
   */
  async extractAllFiles(destPath: PathLikeTypes): Promise<DirPath> {
    return await stfsExtractAllFiles(this.path, destPath)
  }
}
