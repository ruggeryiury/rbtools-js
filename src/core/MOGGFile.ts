import { FilePath } from 'node-lib'
import { pathLikeToString, type FilePathJSONRepresentation, type PathLikeTypes } from 'node-lib'
import { MOGGFileError } from '../errors'
import { moggDecrypt, moggFileStat, moggFileStatSync } from '../lib'

export interface MOGGFileStatRawObject {
  /** The version of the MOGG encryption. */
  version: number
  /** A boolean value that tells if the MOGG file is encrypted. */
  is_encrypted: boolean
  /** The sample rate of the MOGG file. */
  sample_rate: number
  /** The quantity of channels of the MOGG file. */
  channels: number
  /** The duration of the MOGG file in milliseconds. */
  duration_ms: number
  /** The duration of the MOGG file in a formatted string. */
  duration: string
  /** The bitrate of the MOGG file. */
  bit_rate: number
  /** The size of the MOGG file in bytes. */
  size_bytes: number
  /** The size of the MOGG file in a formatted string. */
  size: string
}

export type MOGGFileStatObject = Omit<MOGGFileStatRawObject, 'is_encrypted' | 'sample_rate' | 'duration_ms' | 'bit_rate' | 'size_bytes'> & {
  /** A boolean value that tells if the MOGG file is encrypted. */
  isEncrypted: boolean
  /** The sample rate of the MOGG file. */
  sampleRate: number
  /** The duration of the MOGG file in milliseconds. */
  durationMS: number
  /** The bitrate of the MOGG file. */
  bitRate: number
  /** The size of the MOGG file in bytes. */
  sizeBytes: number
}

export interface MOGGFileJSONObject extends FilePathJSONRepresentation {
  /** The statistics of the MIDI file. */
  file: MOGGFileStatObject
}

/**
 * MOGGFile is a class that represents a multitrack OGG file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class MOGGFile {
  /** The path of the MOGG file. */
  path: FilePath

  /**
   * @param {PathLikeTypes} moggFilePath The path to the MOGG file.
   */
  constructor(moggFilePath: PathLikeTypes) {
    this.path = FilePath.of(pathLikeToString(moggFilePath))
  }

  /**
   * Checks if a path resolves to an existing MOGG file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists) throw new MOGGFileError(`MOGG file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * Asynchronously checks the encryption version of the MOGG file.
   * - - - -
   * @returns {Promise<number>}
   */
  async encryptionVersion(): Promise<number> {
    this.checkExistence()
    const version = await this.path.readOffset(0, 1)
    return parseInt(version.toString('hex'), 16)
  }

  /**
   * Asynchronously checks if a MOGG file is encrypted or not.
   * - - - -
   * @returns {Promise<boolean>}
   */
  async isEncrypted(): Promise<boolean> {
    return (await this.encryptionVersion()) !== 10
  }

  /**
   * Asynchronously returns a JSON object with statistics of the MOGG file.
   * - - - -
   * @returns {Promise<MOGGFileStatObject>}
   */
  async stat(): Promise<MOGGFileStatObject> {
    this.checkExistence()
    const { bit_rate: bitRate, channels, duration, duration_ms: durationMS, is_encrypted: isEncrypted, sample_rate: sampleRate, size, size_bytes: sizeBytes, version } = await moggFileStat(this.path)
    return {
      version,
      isEncrypted,
      sampleRate,
      channels,
      durationMS,
      duration,
      bitRate,
      sizeBytes,
      size,
    }
  }

  /**
   * Returns a JSON object with statistics of the MOGG file.
   * - - - -
   * @returns {MOGGFileStatObject}
   */
  statSync(): MOGGFileStatObject {
    this.checkExistence()
    const { bit_rate: bitRate, channels, duration, duration_ms: durationMS, is_encrypted: isEncrypted, sample_rate: sampleRate, size, size_bytes: sizeBytes, version } = moggFileStatSync(this.path)
    return {
      version,
      isEncrypted,
      sampleRate,
      channels,
      durationMS,
      duration,
      bitRate,
      sizeBytes,
      size,
    }
  }

  /**
   * Returns a JSON representation of the MOGG file class.
   * - - - -
   * @returns {MOGGFileJSONObject}
   */
  toJSONSync(): MOGGFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.statSync(),
    }
  }

  /**
   * Asynchronously returns a JSON representation of the MOGG file class.
   * - - - -
   * @returns {Promise<MOGGFileJSONObject>}
   */
  async toJSON(): Promise<MOGGFileJSONObject> {
    return {
      ...this.path.toJSON(),
      file: await this.stat(),
    }
  }

  /**
   * Asynchronously decrypts a MOGG file and returns the new decrypted MOGG file path.
   *
   * If the provided MOGG file is already decrypted it will return the path of the MOGG file itself.
   * - - - -
   * @param {PathLikeTypes | undefined} destPath `OPTIONAL` The path of the new, decrypted MOGG file. If no provided argument, the name
   * of the new decrypted MOGG file will be the same of the encrypted one, with a `_decrypted` on the end.
   * @returns {Promise<MOGGFile>}
   */
  async decrypt(destPath?: PathLikeTypes): Promise<MOGGFile> {
    this.checkExistence()
    const isEncrypted = await this.isEncrypted()
    if (!isEncrypted) return this
    let dest = this.path.changeFileName(`${this.path.name}_decrypted`)
    if (destPath) dest = FilePath.of(pathLikeToString(destPath))

    return new MOGGFile(await moggDecrypt(this.path, dest))
  }
}
