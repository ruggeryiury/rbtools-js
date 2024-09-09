import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { imgToTexWii, imgToTexXboxPs3, stringToPath, type ArtworkInterpolationTypes, type ArtworkSizeTypes, type ArtworkTextureFormatTypes } from '../lib.js'
import { ImgFileStat } from '../python.js'

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

    if (this.path.ext.includes('.png_')) throw new Error(`ImgFileError: Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, use TexFile() instead`)
    if (this.path.ext !== '.png' && this.path.ext !== '.bmp' && this.path.ext !== 'jpg' && this.path.ext !== 'webp') throw new Error(`ImgFileError: Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, for image format is not compatible for this module. Compatible image formats are: "jpg", "webp", "png", "bmp"`)
  }

  async stat(): Promise<ImgFileStatReturnObject> {
    this.checkExistence()
    return await ImgFileStat(this.path.path)
  }

  async toJSON() {
    return {
      ...this.path.toJSON(),
      stat: await this.stat(),
    }
  }

  async convertToTexture(destPath: string | Path, toFormat: ArtworkTextureFormatTypes = 'png_xbox', options?: ConvertToTextureOptions) {
    const dest = stringToPath(destPath)
    const { DTX5, interpolation, textureSize } = useDefaultOptions<NonNullable<typeof options>, true>(
      {
        DTX5: true,
        interpolation: 'bilinear',
        textureSize: 256,
      },
      options
    )

    if (toFormat === 'png_wii') {
      return imgToTexWii(this.path, dest, { interpolation })
    }

    return imgToTexXboxPs3(this.path, dest, toFormat, { DTX5, interpolation, textureSize })
  }
}
