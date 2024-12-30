import Path, { type PathJSONRepresentation, type StringOrPath } from 'path-js'
import { SongsDTA, SongUpdatesDTA } from 'rbdta-js'
import { STFSFileError } from '../errors.js'
import { stfsExtract, stfsFileStatSync } from '../python.js'

export interface STFSFileStatRawReturnObject {
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

export type STFSFileStatReturnObject = Omit<STFSFileStatRawReturnObject, 'dta' | 'upgrades'> & {
  /** The contents of the package's DTA file. */
  dta?: SongsDTA
  /** The contents of the package's upgrades DTA file. */
  upgrades?: SongUpdatesDTA
  /** A boolean value that tells if the package has two or more songs. */
  isPack: boolean
  /** A boolean value that tells if the package has PRO Guitar/Bass upgrades. */
  hasUpgrades: boolean
}

export interface STFSFileJSONObject extends PathJSONRepresentation {
  /** The statistics of the CON file. */
  file: STFSFileStatReturnObject
}

/**
 * STFSFile is a class that represents a Xbox CON file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class STFSFile {
  /** The path of the CON file. */
  path: Path

  /**
   * @param {StringOrPath} stfsFilePath The path to the CON file.
   */
  constructor(stfsFilePath: StringOrPath) {
    const path = Path.stringToPath(stfsFilePath)
    this.path = path

    this.checkExistence()
  }

  /**
   * Checks if a path resolves to an existing CON file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists()) throw new STFSFileError(`MIDI file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * Returns a JSON object with statistics of the CON file.
   * - - - -
   * @returns {STFSFileStatReturnObject}
   */
  stat(): STFSFileStatReturnObject {
    this.checkExistence()
    const stat = stfsFileStatSync(this.path.path)
    let isPack = false
    const hasUpgrades = stat.files.includes('/songs_upgrades/upgrades.dta')

    let dta: SongsDTA | undefined
    if (stat.dta) dta = new SongsDTA(stat.dta)
    if (dta && dta.songs.length > 1) isPack = true

    let upgrades: SongUpdatesDTA | undefined
    if (stat.upgrades) upgrades = new SongUpdatesDTA(stat.upgrades)

    return { ...stat, dta, upgrades, isPack, hasUpgrades }
  }

  /**
   * Returns a JSON representation of the STFS file class.
   * - - - -
   * @returns {STFSFileJSONObject}
   */
  toJSON(): STFSFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.stat(),
    }
  }

  /**
   * Asynchronously extract all files from a CON file and returns the folder path where all contents was extracted.
   * - - - -
   * @param {StringOrPath} destPath The folder path where you want the files to be extracted to.
   * @returns {Promise<string>}
   */
  async extract(destPath: StringOrPath): Promise<Path> {
    return await stfsExtract(this.path.path, destPath)
  }
}
