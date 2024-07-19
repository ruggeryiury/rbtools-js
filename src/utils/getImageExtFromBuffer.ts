export type GetImageExtResults = 'jpg' | 'png' | 'webp' | 'bmp' | null

/**
 * Figures out the extension of the image by its Buffer.
 * - - - -
 * @param {Buffer} imageBuffer The image buffer.
 * @returns {GetImageExtResults}
 */
export const getImageExtFromBuffer = (
  imageBuffer: Buffer
): GetImageExtResults => {
  // Convert the ArrayBuffer to a Uint8Array
  const uintArray = new Uint8Array(imageBuffer)

  // Check the magic number to determine the file type
  if (uintArray.length < 12) {
    return null // Not enough data to determine the file type
  }

  // Extract the first few bytes for file type detection
  const header = uintArray.subarray(0, 12)

  // Check the header to determine the file type
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return 'jpg'
  } else if (
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47
  ) {
    return 'png'
  }

  // else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x38) {
  //   return "gif";
  // }
  else if (
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return 'webp'
  } else if (header[0] === 0x42 && header[1] === 0x4d) {
    return 'bmp'
  } else {
    return null // Unknown file type
  }
}
