import Path, { type StringOrPath } from 'path-js'
import type { TextureFileStatReturnObject } from '../../core.js'
import { getDDSHeader, getDDSHeaderSync } from '../../lib.js'

/**
 * Asynchronously returns an object with statistics of a PNG_XBOX/PNG_PS3 texture file.
 * - - - -
 * @param {StringOrPath} filePath The path of the PNG_XBOX/PNG_PS3 file.
 * @returns {Promise<TextureFileStatReturnObject>} An object with statistics of a PNG_XBOX/PNG_PS3 texture file
 */
export const pngXboxPs3TexStat = async (filePath: StringOrPath): Promise<TextureFileStatReturnObject> => {
  const srcPath = Path.stringToPath(filePath)

  const srcBuffer = await srcPath.readFile()
  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const { type, height, width } = await getDDSHeader(fullSrcHeader, shortSrcHeader)
  const ext = srcPath.ext.slice(1).toUpperCase()

  return { format: ext, type, height, width, size: [width, height], formatDesc: `${ext}: DDS Image file ${ext === 'PNG_XBOX' ? '(byte-swapped) ' : ''}with Harmonix header` }
}

/**
 * Synchronously returns an object with statistics of a PNG_XBOX/PNG_PS3 texture file.
 * - - - -
 * @param {StringOrPath} filePath The path of the PNG_XBOX/PNG_PS3 file.
 * @returns {TextureFileStatReturnObject} An object with statistics of a PNG_XBOX/PNG_PS3 texture file
 */
export const pngXboxPs3TexStatSync = (filePath: StringOrPath): TextureFileStatReturnObject => {
  const srcPath = Path.stringToPath(filePath)

  const srcBuffer = srcPath.readFileSync()
  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const { type, height, width } = getDDSHeaderSync(fullSrcHeader, shortSrcHeader)
  const ext = srcPath.ext.slice(1).toUpperCase()

  return { format: ext, type, height, width, size: [width, height], formatDesc: `${ext}: DDS Image file ${ext === 'PNG_XBOX' ? '(byte-swapped) ' : ''}with Harmonix header` }
}
