/**
 * Converts a WebP image file buffer into a Base64 Data URL.
 * - - - -
 * @param {Buffer} image The image buffer in WebP format.
 * @returns {string} The Base64 encoded Data URL representing the WebP image.
 */
export const webpFileBufferToDataURL = (image: Buffer): string => {
  return `data:image/webp;base64,${image.toString('base64')}`
}
