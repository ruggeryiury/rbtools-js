import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

/**
 * Encrypts a Buffer using AES-256-CBC.
 * - - - -
 * @param {Buffer} buffer The data to encrypt
 * @param {Buffer} key A 32-byte (256-bit) encryption key
 * @param {Buffer} iv A 16-byte initialization vector (IV)
 * @returns {Buffer} The encrypted Buffer
 */
export const encryptBufferAES256CBC = (buffer: Buffer, key: Buffer, iv: Buffer = randomBytes(16)): Buffer => {
  const cipher = createCipheriv('aes-256-cbc', key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

/**
 * Decrypts a Buffer that was encrypted with AES-256-CBC.
 * - - - -
 * @param {Buffer} encryptedBuffer The encrypted data.
 * @param {Buffer} key The 32-byte (256-bit) encryption key used for encryption.
 * @param {Buffer} iv The 16-byte initialization vector (IV) used for encryption.
 * @returns {Buffer} The decrypted Buffer.
 */
export const decryptBufferAES256CBC = (encryptedBuffer: Buffer, key: Buffer, iv: Buffer): Buffer => {
  const decipher = createDecipheriv('aes-256-cbc', key, iv)
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
}
