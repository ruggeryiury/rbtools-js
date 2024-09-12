import Path from 'path-js'
import { ImageHeaders, type TextureFileStatObject } from '../core.js'
import { UnknownFileFormatError } from '../errors.js'

/**
 * Asynchronously returns an object with statistics of a PNG_WII texture file.
 * - - - -
 * @param {Path | string} filePath The path of the PNG_WII file.
 * @returns {Promise<TextureFileStatObject>} An object with statistics of a PNG_WII texture file
 */
export const pngWiiStat = async (filePath: Path | string): Promise<TextureFileStatObject> => {
  let srcPath: Path

  if (filePath instanceof Path) srcPath = filePath
  else srcPath = new Path(filePath)

  const srcBuffer = await srcPath.readFile()
  const srcHeader = srcBuffer.subarray(0, 32)

  let width = 0
  let height = 0
  let type = ''

  const allHeaders = (Object.keys(ImageHeaders) as (keyof typeof ImageHeaders)[]).filter((header) => header.startsWith('WII'))

  for (const header of allHeaders) {
    if (srcHeader.toString() === Buffer.from(ImageHeaders[header]).toString()) {
      const [w, h] = header
        .slice(3)
        .split('_')[0]
        .split('x')
        .map((size) => Number(size))
      width = w
      height = h
      type = header.slice(3).split('_')[1] ?? 'NORMAL'
    }
  }

  if (width === 0 && height === 0 && !type) throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')

  return {
    format: 'PNG_WII',
    type,
    width,
    height,
    size: [width, height],
    formatDesc: `PNG_WII: TPL (Texture Pallete Library) file with Harmonix header`,
  }
}
