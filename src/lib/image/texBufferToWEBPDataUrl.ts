import { Path, type PathLikeTypes } from 'path-js'
import { getDDSHeader, imgBufferToWEBPDataURL, webpDataURLPNGWii } from '../../lib'

/**
 * Returns a Base64-encoded Data URL `string` of a texture file.
 * - - - -
 * @param {PathLikeTypes} srcPath The texture file path.
 * @returns {Promise<string>} A Base64-encoded DataURL `string` of the texture file.
 */
export const texBufferToWEBPDataUrl = async (srcPath: PathLikeTypes): Promise<string> => {
  const src = Path.stringToPath(srcPath)
  if (src.ext === '.png_wii') return await webpDataURLPNGWii(src.path)

  const srcBuffer = await src.readFile()

  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const srcHeader = await getDDSHeader(fullSrcHeader, shortSrcHeader)

  const loop = (srcBuffer.length - 32) / 4
  const srcContents = srcBuffer.subarray(32)
  const dds = Buffer.alloc(srcHeader.data.length + srcContents.length)
  srcHeader.data.copy(dds, 0)

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    srcContents.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = src.ext === '.png_ps3' ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    swappedBytes.copy(dds, x * 4 + srcHeader.data.length)
  }

  return await imgBufferToWEBPDataURL(dds)
}
