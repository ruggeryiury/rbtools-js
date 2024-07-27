import { randomBytes } from 'node:crypto'
import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useDefaultOptions } from 'dta-parser/utils'
import Path from 'path-js'
import { isStringALink, tempFolderInit, imgConv, imgToTex, imgToTexWii, texToImg, texToImgWii } from '../../utils.js'

export type ArtworkSizeTypes = 128 | 256 | 512 | 1024 | 2048
export type ArtworkImageFormatTypes = 'png' | 'bmp' | 'jpg' | 'webp'
export type ArtworkTextureFormatTypes = 'png_xbox' | 'png_ps3' | 'png_wii'
export type ArtworkInterpolationTypes = 'nearest' | 'box' | 'bilinear' | 'hamming' | 'bicubic' | 'lanczos'

export interface FetchOrConvertOptions {
  /**
   * The output format of the desired image file. Default is `png`.
   */
  format?: ArtworkImageFormatTypes | ArtworkTextureFormatTypes
  /**
   * The size of the generated image file. Default is `512`.
   *
   * The property has no influence when converting to `.png_wii`, because
   * the Wii system only uses `256`. It also has no influence when converting
   * from texture files.
   */
  textureSize?: ArtworkSizeTypes
  /**
   * The interpolation of the output file in case of scaling. Default if `'bilinear'` (Bilinear).
   */
  interpolation?: ArtworkInterpolationTypes
  /**
   * The quality of the output image file. Only used when converting to lossy formats, like JPEG and WEBP. Default is `100` (Highest quality).
   */
  quality?: number
  /**
   * Uses DTX5 encoding on the NVIDIA encoding process. Default is `true`.
   */
  DTX5?: boolean
  /**
   * Delete the original source file. Default is `false`.
   */
  deleteOriginal?: boolean
  /**
   * Sets a custom timeout (in milliseconds) for artwork fetching. Default is `5000` (5 seconds).
   */
  fetchTimeout?: number
}

/**
 * Fetches or converts any image or game texture file to any format provided on the `options` parameter.
 * - - - -
 * @param {string} pathOrURL A path to an image or game texture, or an URL path to an image.
 * @param {string} dest The destination path of the converted image file.
 * @param {FetchOrConvertOptions | undefined} options `OPTIONAL` An object that changes the behavior of the convertion process.
 * @returns {Promise<string>} The path of the converted file as string.
 */
export const fetchOrConvertArtwork = async (pathOrURL: string, dest: string, options?: FetchOrConvertOptions): Promise<string> => {
  const opts = useDefaultOptions<FetchOrConvertOptions, true>(
    {
      deleteOriginal: false,
      DTX5: true,
      format: 'png',
      interpolation: 'bilinear',
      quality: 100,
      textureSize: 512,
      fetchTimeout: 5000
    },
    options
  )

  const { deleteOriginal, format, interpolation, quality, textureSize, fetchTimeout } = opts

  const tempFolder = await tempFolderInit()
  const tempFiles: Path[] = []

  let path: Path, destPath: Path

  if (isStringALink(pathOrURL)) {
    let imgRes: AxiosResponse<ArrayBuffer>
    try {
      imgRes = await axios.get<ArrayBuffer>(pathOrURL, {
        responseType: 'arraybuffer',
        timeout: fetchTimeout,
      })
    } catch (err) {
      if (err instanceof AxiosError) throw new Error(`fetchOrConvertArtworkError ${err.code ? `(${err.code})` : ''} : ${err.message}.`)
      throw err
    }
    if (imgRes.status !== 200) throw new Error(`fetchOrConvertArtworkError: URL returned with error with status ${imgRes.status.toString()}.`)
    const imgBuffer = Buffer.from(imgRes.data)

    const tempFetchPath = new Path(Path.resolve(tempFolder.path, `${randomBytes(16).toString('hex')}.tmp`))
    if (tempFetchPath.exists()) await tempFetchPath.deleteFile()
    await tempFetchPath.writeFile(imgBuffer)

    const pngTempPath = new Path(tempFetchPath.changeFileExt('png'))
    if (pngTempPath.exists()) await pngTempPath.deleteFile()
    await imgConv.exec(tempFetchPath.path, pngTempPath.path, textureSize, interpolation, quality)
    tempFiles.push(tempFetchPath)
    if (format === 'png') {
      const newDestPath = new Path(Path.resolve(dest)).changeFileExt(format)
      await pngTempPath.renameFile(newDestPath)

      for (const tempFile of tempFiles) {
        if (tempFile.exists()) await tempFile.deleteFile()
      }

      return newDestPath
    }
    path = pngTempPath
  } else {
    path = new Path(Path.resolve(pathOrURL))
  }

  if (format === 'png_ps3' || format === 'png_wii' || format === 'png_xbox') {
    const newDestPath = new Path(Path.resolve(dest))
    destPath = new Path(newDestPath.changeFileName(newDestPath.name.endsWith('_keep') ? newDestPath.name : `${newDestPath.name}_keep`, format))
  } else {
    const newDestPath = new Path(Path.resolve(dest)).changeFileExt(format)
    destPath = new Path(newDestPath)
  }

  const srcExt = path.ext.slice(1) as ArtworkImageFormatTypes | ArtworkTextureFormatTypes

  if (srcExt === format) throw new Error('fetchOrConvertArtworkError: Desired format is the same of the source file.')

  if (srcExt === 'bmp' || srcExt === 'jpg' || srcExt === 'png' || srcExt === 'webp') {
    if (format === 'bmp' || format === 'jpg' || format === 'png' || format === 'webp') await imgConv.exec(path.path, destPath.path, textureSize, interpolation, quality)
    else if (format === 'png_wii')
      await imgToTexWii(path.path, destPath.path, {
        ...opts,
        textureSize: 256,
      })
    else await imgToTex(path.path, destPath.path, opts)
  } else {
    const tempPngPath = new Path(Path.resolve(tempFolder.path, `${randomBytes(16).toString('hex')}.png`))
    if (srcExt === 'png_wii') {
      const { width: srcWidth, height: srcHeight } = await texToImgWii(path.path, tempPngPath.path)
      if (format === 'png') await tempPngPath.renameFile(destPath.changeFileName(destPath.name.endsWith('_keep') ? destPath.name.slice(0, -5) : destPath.name))
      else {
        await imgConv.exec(tempPngPath.path, destPath.changeFileName(destPath.name.endsWith('_keep') ? destPath.name.slice(0, -5) : destPath.name), [srcWidth, srcHeight], 'bilinear', quality)
        tempFiles.push(tempPngPath)
      }
    } else {
      const { width: srcWidth, height: srcHeight } = await texToImg(path.path, tempPngPath.path)
      if (format === 'png') await tempPngPath.renameFile(destPath.changeFileName(destPath.name.endsWith('_keep') ? destPath.name.slice(0, -5) : destPath.name))
      else {
        await imgConv.exec(tempPngPath.path, destPath.changeFileName(destPath.name.endsWith('_keep') ? destPath.name.slice(0, -5) : destPath.name), [srcWidth, srcHeight], 'bilinear', quality)
        tempFiles.push(tempPngPath)
      }
    }
  }

  for (const tempFile of tempFiles) {
    if (tempFile.exists()) await tempFile.deleteFile()
  }

  if (deleteOriginal) {
    if (path.exists()) await path.deleteFile()
  }

  return destPath.path
}
