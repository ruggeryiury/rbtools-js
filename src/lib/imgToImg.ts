import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { ImgFile, type ConvertToImageOptions } from '../core.js'
import { stringToPath, type ArtworkImageFormatTypes } from '../lib.js'
import * as Py from '../python.js'

/**
 * Asynchronously converts an image file to any other image file format.
 * - - - -
 * @param {string | Path} srcFile The path of the image to want to convert.
 * @param {string | Path} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @param {ConvertToImageOptions | undefined} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new converted image file.
 */
export const imgToImg = async (srcFile: string | Path, destPath: string | Path, toFormat: ArtworkImageFormatTypes, options?: ConvertToImageOptions): Promise<ImgFile> => {
  const { height, interpolation, quality, width } = useDefaultOptions<NonNullable<typeof options>, true>(
    {
      height: null,
      width: null,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)
  const { width: srcWidth, height: srcHeight } = await Py.imgFileStat(src.path)

  let usedWidth: number
  let usedHeight: number
  if (width !== null) usedWidth = width
  else usedWidth = srcWidth
  if (height !== null) usedHeight = height
  else usedHeight = srcHeight

  await Py.imageConverter(src.path, dest.path, toFormat, { height: usedHeight, width: usedWidth, interpolation, quality })
  return new ImgFile(dest)
}
