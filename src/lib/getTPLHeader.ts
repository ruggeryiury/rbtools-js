import Path from 'path-js'
import { ImageHeaders } from '../core.js'
import { FileNotFoundError, UnknownFileFormatError } from '../errors.js'
import { pngWiiStat, stringToPath } from '../lib.js'

/**
 * Asynchronously builds the right Texture Pallete Library (`.tpl`) header to put on the PNG_WII texture file.
 * - - - -
 * @param {string | Path} pngWiiPath The path of the PNG_WII file.
 * @returns {Promise<Uint8Array>} The header data as `Uint8Array`.
 */
export const getTPLHeader = async (pngWiiPath: string | Path): Promise<Uint8Array> => {
  const src = stringToPath(pngWiiPath)
  if (!src.exists()) throw new FileNotFoundError('Provided file path does not exists.')
  if (src.type() === 'file' && src.ext === '.png_wii') {
    const { width, height, type } = await pngWiiStat(src)
    const headerKey = `TPL${width.toString()}x${height.toString()}${type === 'NORMAL' ? '' : `_${type}`}`
    if (headerKey in ImageHeaders) return Uint8Array.from(ImageHeaders[headerKey as keyof typeof ImageHeaders])
    else throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
  }

  throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
}
