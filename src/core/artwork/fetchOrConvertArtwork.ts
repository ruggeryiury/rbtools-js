import { randomBytes } from 'node:crypto'
import { useDefaultOptions } from 'dta-parser/utils'
import Path from 'path-js'
import { execPromise, isStringALink, tempFolderInit } from '../../utils.js'

export type ArtworkSizeTypes = 256 | 512 | 1024 | 2048
export type ArtworkImageFormatTypes = 'png' | 'bmp' | 'jpg' | 'webp'
export type ArtworkTextureFormatTypes = 'png_xbox' | 'png_ps3' | 'png_wii'
export type ArtworkInterpolationTypes = 'nearest' | 'box' | 'bilinear' | 'hamming' | 'bicubic' | 'lanczos'

export interface FetchOrConvertOptions {
  /**
   * Default is `png`.
   */
  format?: ArtworkImageFormatTypes | ArtworkTextureFormatTypes
  /**
   * Default is `512`.
   */
  textureSize?: ArtworkSizeTypes
  /**
   * Default is `bilinear` (Bilinear).
   */
  interpolation?: ArtworkInterpolationTypes
}

export const fetchOrConvertArtwork = async (pathOrURL: string, dest: string, options?: FetchOrConvertOptions): Promise<Path> => {
  const { textureSize, interpolation, format } = useDefaultOptions<FetchOrConvertOptions, true>({ format: 'png', textureSize: 512, interpolation: 'bilinear' }, options)

  const { path: tempFolder } = await tempFolderInit()
  let deleteOriginalPath = false

  if (format === 'png_ps3' || format === 'png_wii' || format === 'png_xbox') {
    const newPath = new Path(Path.resolve(dest))
    dest = new Path(newPath.changeFileName(newPath.name.endsWith('_keep') ? newPath.name : `${newPath.name}_keep`, format)).path
  } else {
    dest = new Path(Path.resolve(dest)).changeFileExt(format)
  }

  if (isStringALink(pathOrURL)) {
    deleteOriginalPath = true
    const imageResponse = await fetch(pathOrURL, { method: 'GET' })
    if (!imageResponse.ok) throw new Error(`fetchArtworkToPng: URL returned with error with status ${imageResponse.status.toString()}.`)
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    const tempFetchedImagePath = new Path(Path.resolve(tempFolder, `${randomBytes(16).toString('hex')}.tmp`))
    console.log('temp: ', tempFetchedImagePath.path)
    if (tempFetchedImagePath.exists()) await tempFetchedImagePath.deleteFile()
    await tempFetchedImagePath.writeFile(imageBuffer)
    pathOrURL = tempFetchedImagePath.path
  }

  const imageConvScriptPath = new Path(Path.resolve(process.cwd(), `src/python/image_converter.py`))

  const command = `python ${imageConvScriptPath.fullname} "${pathOrURL}" "${dest}" -x ${textureSize.toString()} -y ${textureSize.toString()} -i ${interpolation}`
  const exec = await execPromise(command, {
    cwd: imageConvScriptPath.root,
    windowsHide: true,
  })
  if (exec.stdout.startsWith('ImageConverterError')) throw new Error(exec.stdout)
  if (deleteOriginalPath) {
    const origPath = new Path(pathOrURL)
    if (origPath.exists()) await origPath.deleteFile()
  }
  return new Path(dest)
}
