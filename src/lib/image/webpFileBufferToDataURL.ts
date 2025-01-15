/**
 * Converts a WebP image file buffer into a Base64 Data URL.
 * - - - -
 * @param {Buffer} image The image buffer in WebP format.
 * @returns {string} The Base64 encoded Data URL representing the WebP image.
 * @example
 * const fs = require('fs');
 * const buffer = fs.readFileSync('image.webp');
 * const dataURL = webpFileBufferToDataURL(buffer);
 * console.log(dataURL); // Outputs: data:image/webp;base64,...
 */
export const webpFileBufferToDataURL = (image: Buffer): string => {
  return `data:image/webp;base64,${image.toString('base64')}`
}
