import Path, { type StringOrPath } from 'path-js'
import setDefaultOptions from 'set-default-options'
import zod from 'zod'
import { ImgFile, type ConvertToImageOptions } from '../core.js'
import { FileConvertionError, ValueError } from '../errors.js'
import { type ArtworkImageFormatTypes } from '../lib.js'
import { imageConverter, imgFileStat } from '../python.js'

/**
 * Asynchronously converts an image file to any other image file format.
 * - - - -
 * @param {StringOrPath} srcFile The path of the image to want to convert.
 * @param {StringOrPath} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @param {ConvertToImageOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new converted image file.
 */
export const imgToImg = async (srcFile: StringOrPath, destPath: StringOrPath, toFormat: ArtworkImageFormatTypes, options?: ConvertToImageOptions): Promise<ImgFile> => {
  const { height, interpolation, quality, width } = setDefaultOptions<typeof options>(
    {
      height: null,
      width: null,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )

  const qualitySchema = zod.number().min(1).max(100)
  try {
    qualitySchema.parse(quality)
  } catch (err) {
    throw new ValueError(`Quality value must be a number value from 1 to 100, given ${quality.toString()}.`)
  }

  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)
  const destWithCorrectExt = new Path(dest.changeFileExt(toFormat))

  if (src.ext === destWithCorrectExt.ext && src.name === destWithCorrectExt.name) throw new FileConvertionError('Source and destination file has the same file name and extension')

  await destWithCorrectExt.checkThenDeleteFile()

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
