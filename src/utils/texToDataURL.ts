import Path from 'path-js'
import { getDDSHeader, imgConv } from '../utils.js'

/**
 * Reads a `png_xbox` or `png_ps3` image file and returns a Base64-encoded DataURL string in lossless WEBP format.
 * - - - -
 * @param {string} src The path of the `png_xbox` or `png_ps3` file.
 * @returns {Promise<string>}
 */
export const texToDataURL = async (src: string): Promise<string> => {
  const xSrc = new Path(src)
  const srcBuffer = await xSrc.readFile()

  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const srcHeader = await getDDSHeader(Uint8Array.from(fullSrcHeader), Uint8Array.from(shortSrcHeader))
  console.log(srcHeader.format, srcHeader.width, srcHeader.height)

  const loop = (srcBuffer.length - 32) / 4
  const srcContents = srcBuffer.subarray(32)
  const dds = Buffer.alloc(srcHeader.data.length + srcContents.length)
  Buffer.from(srcHeader.data).copy(dds, 0)

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    srcContents.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = xSrc.ext.includes('ps3') ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    swappedBytes.copy(dds, x * 4 + srcHeader.data.length)
  }

  const dataURL = await imgConv.execBufferStrToDataURL(dds.toString('base64'))
  return dataURL
}
