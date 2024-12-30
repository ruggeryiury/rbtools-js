import Path, { type StringOrPath } from 'path-js'
import { moggDecrypt } from '../python.js'

/**
 * MOGGFile is a class that represents a multitrack OGG file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class MOGGFile {
  /** The path of the MOGG file. */
  path: Path

  /**
   * @param {StringOrPath} moggFilePath The path to the MOGG file.
   */
  constructor(moggFilePath: StringOrPath) {
    this.path = Path.stringToPath(moggFilePath)
  }

  /**
   * Asynchronously checks if a MOGG file is encrypted or not.
   * - - - -
   * @returns {Promise<boolean>}
   */
  async isEncrypted(): Promise<boolean> {
    const version = await this.path.readFileOffset(0, 1)
    return parseInt(version.toString('hex'), 16) !== 10
  }

  /**
   * Asynchronously decrypts a MOGG file and returns the new decrypted MOGG file path.
   *
   * If the provided MOGG file is already decrypted it will return the path of the MOGG file itself.
   * - - - -
   * @param {StringOrPath | undefined} destPath `OPTIONAL` The path of the new, decrypted MOGG file. If no provided argument, the name
   * of the new decrypted MOGG file will be the same of the encrypted one, with a `_decrypted` on the end.
   * @returns {Promise<Path>}
   */
  async decrypt(destPath?: StringOrPath): Promise<Path> {
    const isEncrypted = await this.isEncrypted()
    if (!isEncrypted) return this.path
    let dest = new Path(this.path.changeFileName(`${this.path.name}_decrypted`))
    if (destPath) dest = Path.stringToPath(destPath)

    return await moggDecrypt(this.path, dest)
  }
}
