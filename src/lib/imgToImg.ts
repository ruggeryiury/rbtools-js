import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { ImgFile, type ConvertToImageOptions } from '../core.js'
import { stringToPath, type ArtworkImageFormatTypes } from '../lib.js'
import { ImageConverter, ImgFileStat } from '../python.js'

export const imgToImg = async (srcFile: string | Path, destPath: string | Path, toFormat: ArtworkImageFormatTypes, options?: ConvertToImageOptions) => {
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
  const { width: srcWidth, height: srcHeight } = await ImgFileStat(src.path)

  let usedWidth: number
  let usedHeight: number
  if (width !== null) usedWidth = width
  else usedWidth = srcWidth
  if (height !== null) usedHeight = height
  else usedHeight = srcHeight

  await ImageConverter(src.path, dest.path, { height: usedHeight, width: usedWidth, interpolation, quality, toFormat })
  return new ImgFile(dest)
}
