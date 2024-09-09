import Path from 'path-js'
import type { ArtworkImageFormatTypes, ArtworkInterpolationTypes, ArtworkTextureFormatTypes } from '../lib.js'
import { imgFileStat } from '../python.js'

export interface ImgFileStatReturnObject {
  format: string
  width: number
  height: number
  size: [number, number]
  formatDesc: string
  imageMode: string
  isAnimated: boolean
}

export interface ConvertToImageOptions {

}

export interface ConvertToTextureOptions {
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
  constructor(path: Path | string) {
    if (path instanceof Path) {
      if (!path.exists()) throw new Error(`ImgFileError: File "${path.path}" does not exists`)

      if (path.ext.includes('.png_')) throw new Error(`ImgFileError: Tired to load a ${path.ext.slice(1).toUpperCase()} file, use TexFile() instead`)

      this.path = path
      return
    }

    const p = new Path(path)
    if (!p.exists()) throw new Error(`ImgFileError: File "${p.path}" does not exists`)

    if (p.ext.includes('.png_')) throw new Error(`ImgFileError: Tired to load a ${p.ext.slice(1).toUpperCase()} file, use TextureFile() instead`)

    this.path = p
  }

  private checkExistence() {
    if (!this.path.exists()) throw new Error(`ImgFileNotFoundError: Texture file "${this.path.path}" does not exists`)
  }

  async stat(): Promise<ImgFileStatReturnObject> {
    this.checkExistence()
    return await imgFileStat(this.path.path)
  }

  async convertToTexture(to: ArtworkTextureFormatTypes, options?: ConvertToTextureOptions) {

  }
}
