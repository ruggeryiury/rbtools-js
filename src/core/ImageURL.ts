import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'
import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import type { ImgFile } from '../core.js'
import { isURL, stringToPath, type ArtworkImageFormatTypes } from '../lib.js'
import { bufferConverter, type ImageConverterOptions } from '../python.js'

export class ImageURL {
  url: string
  buf = Buffer.alloc(0)
  private __isFetched = false
  constructor(url: string) {
    if (!isURL(url)) throw new Error(`Provided link "${url}" is not a valid URL`)
    this.url = url
  }

  async fetch(fetchTimeout = 5000): Promise<ImageURL> {
    if (!this.url) throw new Error('not this.url you *uck')
    let imgRes: AxiosResponse<ArrayBuffer>
    try {
      imgRes = await axios.get<ArrayBuffer>(this.url, {
        responseType: 'arraybuffer',
        timeout: fetchTimeout,
      })
    } catch (err) {
      if (err instanceof AxiosError) throw new Error(`fetchOrConvertArtworkError ${err.code ? `(${err.code})` : ''} : ${err.message}.`)
      throw err
    }
    if (imgRes.status !== 200) throw new Error(`fetchOrConvertArtworkError: URL returned with error with status ${imgRes.status.toString()}.`)
    this.buf = Buffer.from(imgRes.data)
    this.__isFetched = true
    return this
  }

  async exportToImage(destPath: string | Path, toFormat: ArtworkImageFormatTypes = 'png', options?: ImageConverterOptions): Promise<ImgFile> {
    if (this.buf.length === 0) await this.fetch()
    const opts = useDefaultOptions<NonNullable<typeof options>, true>(
      {
        height: 256,
        width: 256,
        interpolation: 'bilinear',
        quality: 100,
      },
      options
    )
    if (!this.__isFetched) throw new Error('')
    if (this.buf.length === 0) throw new Error('file terminated')
    const dest = stringToPath(destPath)

    const image = await bufferConverter(this.buf, dest.changeFileExt(toFormat), toFormat, opts)
    this.buf = Buffer.alloc(0)

    return image
  }
}
