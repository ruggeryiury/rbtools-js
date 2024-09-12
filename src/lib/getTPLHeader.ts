import Path from 'path-js'
import { ImageHeaders } from '../core.js'
import { FileNotFoundError, UnknownFileFormatError } from '../errors.js'
import { pngWiiStat, pngWiiStatSync, stringToPath, type ArtworkSizeTypes } from '../lib.js'

export type TPLFormatTypes = 'RGBA32' | 'NORMAL'
export interface TPLHeaderParserObject {
  /** The encoding type of the DDS file. */
  type: TPLFormatTypes
  /** The width of the DDS file. */
  width: ArtworkSizeTypes
  /** The height of the DDS file. */
  height: ArtworkSizeTypes
  /** The header data as buffer. */
  data: Buffer
}

/**
 * Asynchronously builds the right Texture Pallete Library (`.tpl`) header to put on the PNG_WII texture file.
 * - - - -
 * @param {string | Path} pngWiiPath The path of the PNG_WII file.
 * @returns {Promise<TPLHeaderParserObject>} An object with the header data and values.
 */
export const getTPLHeader = async (pngWiiPath: string | Path): Promise<TPLHeaderParserObject> => {
  const src = stringToPath(pngWiiPath)
  if (!src.exists()) throw new FileNotFoundError('Provided file path does not exists.')
  if (src.type() === 'file' && src.ext === '.png_wii') {
    const { width, height, type } = await pngWiiStat(src)
    const headerKey = `TPL${width.toString()}x${height.toString()}${type === 'NORMAL' ? '' : `_${type}`}`
    if (headerKey in ImageHeaders)
      return {
        type: type as TPLFormatTypes,
        width: width as ArtworkSizeTypes,
        height: height as ArtworkSizeTypes,
        data: Buffer.from(ImageHeaders[headerKey as keyof typeof ImageHeaders]),
      }
    else throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
  }

  throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
}

/**
 * Synchronously builds the right Texture Pallete Library (`.tpl`) header to put on the PNG_WII texture file.
 * - - - -
 * @param {string | Path} pngWiiPath The path of the PNG_WII file.
 * @returns {TPLHeaderParserObject} An object with the header data and values.
 */
export const getTPLHeaderSync = (pngWiiPath: string | Path): TPLHeaderParserObject => {
  const src = stringToPath(pngWiiPath)
  if (!src.exists()) throw new FileNotFoundError('Provided file path does not exists.')
  if (src.type() === 'file' && src.ext === '.png_wii') {
    const { width, height, type } = pngWiiStatSync(src)
    const headerKey = `TPL${width.toString()}x${height.toString()}${type === 'NORMAL' ? '' : `_${type}`}`
    if (headerKey in ImageHeaders)
      return {
        type: type as TPLFormatTypes,
        width: width as ArtworkSizeTypes,
        height: height as ArtworkSizeTypes,
        data: Buffer.from(ImageHeaders[headerKey as keyof typeof ImageHeaders]),
      }
    else throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
  }

  throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
}
