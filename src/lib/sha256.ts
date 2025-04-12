import { createHash } from 'node:crypto'
import { Path, type PathLikeTypes } from 'path-js'

/**
 * Computes the SHA-256 hash of a buffer's contents.
 * - - - -
 * @param {Buffer} content The buffer whose contents are to be hashed.
 * @returns {string} The SHA-256 hash of the buffer in hexadecimal format.
 */
export const calculateHashFromBuffer = (content: Buffer): string => {
  const hash = createHash('sha256')
  hash.update(content)
  return hash.digest('hex')
}

/**
 * Asynchronously computes the SHA-256 hash of a file.
 * - - - -
 * @param {PathLikeTypes} filePath The path to a file.
 * @returns {string} The SHA-256 hash of the file in hexadecimal format.
 */
export const calculateHashFromFile = async (filePath: PathLikeTypes): Promise<string> => {
  const dtaPath = Path.stringToPath(filePath)
  const dtaBuffer = await dtaPath.readFile()
  return calculateHashFromBuffer(dtaBuffer)
}

/**
 * Synchronously computes the SHA-256 hash of a file.
 * - - - -
 * @param {PathLikeTypes} filePath The path to a file.
 * @returns {string} The SHA-256 hash of the file in hexadecimal format.
 */
export const calculateHashFromFileSync = (filePath: PathLikeTypes): string => {
  const dtaPath = Path.stringToPath(filePath)
  const dtaBuffer = dtaPath.readFileSync()
  return calculateHashFromBuffer(dtaBuffer)
}
