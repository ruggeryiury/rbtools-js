import { FilePath, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import { type TextureFileStatReturnObject } from '../../core'
import { UnknownFileFormatError } from '../../errors'
import { imageHeaders } from '../../lib'

/**
 * Asynchronously returns an object with statistics of a PNG_WII texture file.
 * - - - -
 * @param {PathLikeTypes} filePath The path of the PNG_WII file.
 * @returns {Promise<TextureFileStatReturnObject>} An object with statistics of a PNG_WII texture file
 */
export const pngWiiStat = async (filePath: PathLikeTypes): Promise<TextureFileStatReturnObject> => {
  const srcPath = FilePath.of(pathLikeToString(filePath))

  const srcBuffer = await srcPath.read()
  const srcHeader = srcBuffer.subarray(0, 32)

  let width = 0
  let height = 0
  let type = ''

  const allHeaders = (Object.keys(imageHeaders) as (keyof typeof imageHeaders)[]).filter((header) => header.startsWith('WII'))

  for (const header of allHeaders) {
    if (srcHeader.toString() === Buffer.from(imageHeaders[header]).toString()) {
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

/**
 * Synchronously returns an object with statistics of a PNG_WII texture file.
 * - - - -
 * @param {PathLikeTypes} filePath The path of the PNG_WII file.
 * @returns {TextureFileStatReturnObject} An object with statistics of a PNG_WII texture file
 */
export const pngWiiStatSync = (filePath: PathLikeTypes): TextureFileStatReturnObject => {
  const srcPath = FilePath.of(pathLikeToString(filePath))

  const srcBuffer = srcPath.readSync()
  const srcHeader = srcBuffer.subarray(0, 32)

  let width = 0
  let height = 0
  let type = ''

  const allHeaders = (Object.keys(imageHeaders) as (keyof typeof imageHeaders)[]).filter((header) => header.startsWith('WII'))

  for (const header of allHeaders) {
    if (srcHeader.toString() === Buffer.from(imageHeaders[header]).toString()) {
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
