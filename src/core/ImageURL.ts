import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'
import Path, { type StringOrPath } from 'path-js'
import setDefaultOptions from 'set-default-options'
import { ImgFile } from '../core.js'
import { ImageFetchingError } from '../errors.js'
import { bufferConverter, isURL, type ArtworkImageFormatTypes, type ImageConverterOptions } from '../lib.js'

/**
 * ImageURL is a class that represents an image file URL. It is initalized passing an image URL as an argument.
 * - - - -
 */
export class ImageURL {
  /** The URL of the image. */
  url: string
  /** The buffer of the fetched image. */
  buf = Buffer.alloc(0)

  /**
   * @param {string} url The URL of the image.
   */
  constructor(url: string) {
    if (!isURL(url)) throw new ImageFetchingError(`Provided link "${url}" is not a valid URL`)
    this.url = url
  }

  /**
   * Fetches the image URL that is stored in this class' instance and store it into memory.
   * - - - -
   * @param {number} fetchTimeout `OPTIONAL` Sets the timeout of the fetching process. Default is `5000` (5 seconds).
   * @returns {Promise<void>}
   */
  private async fetchURL(fetchTimeout = 5000): Promise<void> {
    if (!this.url) throw new ImageFetchingError('Provided URL is not a valid URL.')
    let imgRes: AxiosResponse<ArrayBuffer>
    try {
      imgRes = await axios.get<ArrayBuffer>(this.url, {
        responseType: 'arraybuffer',
        timeout: fetchTimeout,
      })
    } catch (err) {
      if (err instanceof AxiosError) throw new ImageFetchingError(err.message, err.status)
      throw err
    }
    if (imgRes.status !== 200) throw new ImageFetchingError(`URL returned with error with status ${imgRes.status.toString()}.`, imgRes.status)
    this.buf = Buffer.from(imgRes.data)
  }

  /**
   * Asynchronously fetches and download the image, converting to a new image file.
   * - - - -
   * @param {StringOrPath} destPath The path of the new image file.
   * @param {ArtworkImageFormatTypes} toFormat `OPTIONAL` The desired image format of the new image file. Default is `'png'`.
   * @param {ImageConverterOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
   * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new converted image file.
   */
  async download(destPath: StringOrPath, toFormat: ArtworkImageFormatTypes = 'png', options?: ImageConverterOptions): Promise<ImgFile> {
    if (this.buf.length === 0) await this.fetchURL()
    const opts = setDefaultOptions<ImageConverterOptions>(
      {
        height: 256,
        width: 256,
        interpolation: 'bilinear',
        quality: 100,
      },
      options
    )
    if (this.buf.length === 0) throw new ImageFetchingError('Fetched image has no bytes')
    const dest = Path.stringToPath(destPath)

    const image = await bufferConverter(this.buf, dest.changeFileExt(toFormat), toFormat, opts)
    this.buf = Buffer.alloc(0)

    return new ImgFile(image)
  }
}
