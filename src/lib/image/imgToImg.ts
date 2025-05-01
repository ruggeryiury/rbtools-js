import { FilePath, type PathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { setDefaultOptions } from 'set-default-options'
import { type ConvertToImageOptions, ImgFile } from '../../core'
import { ValueError, FileConvertionError } from '../../errors'
import { imgFileStat, imageConverter, type ArtworkImageFormatTypes } from '../../lib'

/**
 * Asynchronously converts an image file to any other image file format.
 * - - - -
 * @param {PathLikeTypes} srcFile The path of the image to want to convert.
 * @param {PathLikeTypes} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @param {ConvertToImageOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new converted image file.
 */
export const imgToImg = async (srcFile: PathLikeTypes, destPath: PathLikeTypes, toFormat: ArtworkImageFormatTypes, options?: ConvertToImageOptions): Promise<ImgFile> => {
  const { height, interpolation, quality, width } = setDefaultOptions<typeof options>(
    {
      height: null,
      width: null,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )

  if (quality < 1 || quality > 100) throw new ValueError(`Quality value must be a number value from 1 to 100, given ${quality.toString()}.`)

  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))
  const destWithCorrectExt = dest.changeFileExt(toFormat)

  if (src.ext === destWithCorrectExt.ext && src.name === destWithCorrectExt.name) throw new FileConvertionError('Source and destination file has the same file name and extension')

  await destWithCorrectExt.delete()

  const { width: srcWidth, height: srcHeight } = await imgFileStat(src.path)

  let usedWidth: number
  let usedHeight: number
  if (width !== null) usedWidth = width
  else usedWidth = srcWidth
  if (height !== null) usedHeight = height
  else usedHeight = srcHeight

  await imageConverter(src.path, destWithCorrectExt.path, toFormat, { height: usedHeight, width: usedWidth, interpolation, quality })
  return new ImgFile(destWithCorrectExt)
}
