import { createHash } from 'node:crypto'

/**
 * Computes the SHA-256 hash of a buffer's contents.
 * - - - -
 * @param {Buffer} content The buffer whose contents are to be hashed.
 * @returns {string} The SHA-256 hash of the buffer in hexadecimal format.
 */
export const bufferSHA256Hash = (content: Buffer): string => {
  const hash = createHash('sha256')
  hash.update(content)
  return hash.digest('hex')
}
