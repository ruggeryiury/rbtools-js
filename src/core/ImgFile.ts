import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { imgToImg, imgToTexWii, imgToTexXboxPs3, stringToPath, type ArtworkImageFormatTypes, type ArtworkInterpolationTypes, type ArtworkSizeTypes, type ArtworkTextureFormatTypes } from '../lib.js'
import { ImgFileStat, WEBPDataURL } from '../python.js'

export interface ImgFileStatReturnObject {
  format: string
  width: number
  height: number
  size: [number, number]
  formatDesc: string
  imageMode: string
  isAnimated: boolean
}
// export interface ConvertToImageOptions {}

export interface ConvertToTextureOptions {
  /**
   * The size of the generated image file. Default is `256`.
   *
   * The property has no influence when converting to `.png_wii`, because
   * the Wii system only uses `256`. It also has no influence when converting
   * from texture files.
   */
  textureSize?: ArtworkSizeTypes
  /**
   * Uses DTX5 encoding on the NVIDIA encoding process. Default is `true`.
   */
  DTX5?: boolean
  /**
   * The interpolation of the output file in case of scaling. Default if `'bilinear'` (Bilinear).
   */
  interpolation?: ArtworkInterpolationTypes
}

export interface ConvertToImageOptions {
  width?: number | null
  height?: number | null
  /**
   * The interpolation of the output file in case of scaling. Default if `'bilinear'` (Bilinear).
   */
  interpolation?: ArtworkInterpolationTypes
  quality?: number
}

export interface ConvertToWEBPDataURLOptions {
  width?: number | null
  height?: number | null
  interpolation?: ArtworkInterpolationTypes
  quality?: number
}

export class ImgFile {
  path: Path

  private checkExistence() {
    if (!this.path.exists()) throw new Error(`ImgFileNotFoundError: Texture file "${this.path.path}" does not exists`)
    return true
  }

  constructor(path: Path | string) {
    this.path = stringToPath(path)
    this.checkExistence()
    if (!this.path.exists()) throw new Error(`ImgFileError: Image file "${this.path.path}" does not exists`)

    // if (this.path.ext.includes('.png_')) throw new Error(`ImgFileError: Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, use TextureFile() class instead`)
    if (this.path.ext === '.png_xbox' || this.path.ext === '.png_ps3' || this.path.ext === '.png_wii') throw new Error(`ImgFileError: Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, use TextureFile() class instead`)
    if (this.path.ext !== '.png' && this.path.ext !== '.bmp' && this.path.ext !== '.jpg' && this.path.ext !== '.webp' && this.path.ext !== '.tga') throw new Error(`ImgFileError: Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, for image format is not compatible for this module. Compatible image formats are: "jpg", "webp", "png", "bmp", "tga"`)
  }

  async stat(): Promise<ImgFileStatReturnObject> {
    this.checkExistence()
    return await ImgFileStat(this.path.path)
  }

  async toJSON() {
    return {
      ...this.path.toJSON(),
      file: await this.stat(),
    }
  }

  async convertToTexture(destPath: string | Path, toFormat: ArtworkTextureFormatTypes = 'png_xbox', options?: ConvertToTextureOptions) {
    const opts = useDefaultOptions<NonNullable<typeof options>, true>(
      {
        DTX5: true,
        interpolation: 'bilinear',
        textureSize: 256,
      },
      options
    )
    const unformattedDestPath = stringToPath(destPath)
    const dest = new Path(unformattedDestPath.changeFileName(unformattedDestPath.name.endsWith('_keep') ? unformattedDestPath.name : `${unformattedDestPath.name}_keep`, toFormat))

    if (toFormat === 'png_wii') {
      return imgToTexWii(this.path, dest, { interpolation: opts.interpolation })
    }
    return imgToTexXboxPs3(this.path, dest, toFormat, opts)
  }

  async convertToImage(destPath: string | Path, toFormat: ArtworkImageFormatTypes, options?: ConvertToImageOptions) {
    const opts = useDefaultOptions<NonNullable<typeof options>, true>(
      {
        height: null,
        width: null,
        interpolation: 'bilinear',
        quality: 100,
      },
      options
    )
    const unformattedDestPath = stringToPath(destPath)
    const dest = new Path(unformattedDestPath.changeFileName(null, toFormat))
    return imgToImg(this.path, dest, toFormat, opts)
  }

  async dataURL(options?: ConvertToWEBPDataURLOptions) {
    const opts = useDefaultOptions<ConvertToWEBPDataURLOptions, true>(
      {
        width: null,
        height: null,
        interpolation: 'bilinear',
        quality: 100,
      },
      options
    )
    return await WEBPDataURL(this.path.path, opts)
  }
}
