import { FilePath, type PathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { FileNotFoundError, UnknownFileFormatError } from '../../errors'
import { pngWiiStat, pngWiiStatSync, type ArtworkSizeTypes, imageHeaders } from '../../lib'

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
 * @param {PathLikeTypes} pngWiiPath The path of the PNG_WII file.
 * @returns {Promise<TPLHeaderParserObject>} An object with the header data and values.
 */
export const getTPLHeader = async (pngWiiPath: PathLikeTypes): Promise<TPLHeaderParserObject> => {
  const src = FilePath.of(pathLikeToString(pngWiiPath))
  if (!src.exists) throw new FileNotFoundError('Provided file path does not exists.')
  if (src.ext === '.png_wii') {
    const { width, height, type } = await pngWiiStat(src)
    const headerKey = `TPL${width.toString()}x${height.toString()}${type === 'NORMAL' ? '' : `_${type}`}`
    if (headerKey in imageHeaders)
      return {
        type: type as TPLFormatTypes,
        width: width as ArtworkSizeTypes,
        height: height as ArtworkSizeTypes,
        data: Buffer.from(imageHeaders[headerKey as keyof typeof imageHeaders]),
      }
    else throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
  }

  throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
}

/**
 * Synchronously builds the right Texture Pallete Library (`.tpl`) header to put on the PNG_WII texture file.
 * - - - -
 * @param {PathLikeTypes} pngWiiPath The path of the PNG_WII file.
 * @returns {TPLHeaderParserObject} An object with the header data and values.
 */
export const getTPLHeaderSync = (pngWiiPath: PathLikeTypes): TPLHeaderParserObject => {
  const src = FilePath.of(pathLikeToString(pngWiiPath))
  if (!src.exists) throw new FileNotFoundError('Provided file path does not exists.')
  if (src.ext === '.png_wii') {
    const { width, height, type } = pngWiiStatSync(src)
    const headerKey = `TPL${width.toString()}x${height.toString()}${type === 'NORMAL' ? '' : `_${type}`}`
    if (headerKey in imageHeaders)
      return {
        type: type as TPLFormatTypes,
        width: width as ArtworkSizeTypes,
        height: height as ArtworkSizeTypes,
        data: Buffer.from(imageHeaders[headerKey as keyof typeof imageHeaders]),
      }
    else throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
  }

  throw new UnknownFileFormatError('Provided file path is not recognizable as a PNG_WII file.')
}
