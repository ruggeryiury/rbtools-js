import { FilePath, pathLikeToString, type FilePathJSONRepresentation, type PathLikeTypes } from 'node-lib'
import { setDefaultOptions } from 'set-default-options'
import { FileNotFoundError, ImgFileError } from '../errors'
import { imgFileStat, imgFileStatSync, imgToImg, imgToTexWii, imgToTexXboxPs3, webpDataURL, type ArtworkImageFormatTypes, type ArtworkInterpolationTypes, type ArtworkSizeTypes, type ArtworkTextureFormatTypes } from '../lib.exports'
import type { TextureFile } from './TextureFile'

export interface ImgFileStatReturnObject {
  /** The format of the image file. */
  format: string
  /** The width of the image file. */
  width: number
  /** The height of the image file. */
  height: number
  /** An array with the image file's width and height. */
  size: [number, number]
  /** A description to the image file format. */
  formatDesc: string
  /** The color mode of the image file. */
  imageMode: string
}

export interface ImgFileJSONObject extends FilePathJSONRepresentation {
  /** The statistics of the image file. */
  file: ImgFileStatReturnObject
}

export interface ConvertToTextureOptions {
  /**
   * The size of the generated image file. Default is `256`.
   *
   * The property has no influence when converting to `.png_wii`, because
   * the Wii system only uses `256`.
   */
  textureSize?: ArtworkSizeTypes
  /** Uses DTX5 encoding on the NVIDIA encoding process. Default is `true`. */
  DTX5?: boolean
  /** The interpolation of the output file in case of scaling. Default if `'bilinear'` (Bilinear). */
  interpolation?: ArtworkInterpolationTypes
}

export interface ConvertToImageOptions {
  /** The width of the generated image file. If `null`, the generated image file will have the same width of the source image file. Default is `null`. */
  width?: number | null
  /** The height of the generated image file. If `null`, the generated image file will have the same height of the source image file. Default is `null`. */
  height?: number | null
  /** The interpolation of the output file in case of any scaling method. Default if `'bilinear'` (Bilinear). */
  interpolation?: ArtworkInterpolationTypes
  /** The quality ratio of the image on lossy codecs (like JPEG). Default is `100` (Lossless on WEBP). */
  quality?: number
}

export interface ConvertToWEBPDataURLOptions {
  /** The width of the generated image Data URL. If `null`, the generated image file will have the same width of the source image file. Default is `null`. */
  width?: number | null
  /** The height of the generated image Data URL. If `null`, the generated image file will have the same height of the source image file. Default is `null`. */
  height?: number | null
  /** The interpolation of the output file in case of any scaling method. Default if `'bilinear'` (Bilinear). */
  interpolation?: ArtworkInterpolationTypes
  /** The quality ratio of the image. Default is `100` (Lossless on WEBP). */
  quality?: number
}

/**
 * ImgFile is a class that represents an image file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class ImgFile {
  /** The path of the image file */
  path: FilePath

  /**
   * Checks if a path resolves to an existing image file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists) throw new FileNotFoundError(`Texture file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * @param {PathLikeTypes} imageFilePath The path to the image file.
   */
  constructor(imageFilePath: PathLikeTypes) {
    this.path = FilePath.of(pathLikeToString(imageFilePath))
    this.checkExistence()

    if (this.path.ext === '.png_xbox' || this.path.ext === '.png_ps3' || this.path.ext === '.png_wii') throw new ImgFileError(`Tired to load a ${this.path.ext.slice(1).toUpperCase()} file on an "ImgFile()" class, try to use the "TextureFile()" class instead`)
    if (this.path.ext !== '.png' && this.path.ext !== '.bmp' && this.path.ext !== '.jpg' && this.path.ext !== '.webp' && this.path.ext !== '.tga') throw new ImgFileError(`Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, for image format is not compatible for this module. Compatible image formats are: "jpg", "webp", "png", "bmp", "tga"`)
  }

  /**
   * Returns a JSON object with statistics of the image file.
   * - - - -
   * @returns {ImgFileStatReturnObject}
   */
  statSync(): ImgFileStatReturnObject {
    this.checkExistence()
    return imgFileStatSync(this.path.path)
  }

  /**
   * Asynchronously returns a JSON object with statistics of the image file.
   * - - - -
   * @returns {Promise<ImgFileStatReturnObject>}
   */
  async stat(): Promise<ImgFileStatReturnObject> {
    this.checkExistence()
    return await imgFileStat(this.path.path)
  }

  /**
   * Returns a JSON representation of the image file class.
   * - - - -
   * @returns {ImgFileJSONObject}
   */
  toJSONSync(): ImgFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.statSync(),
    }
  }

  /**
   * Asynchronously returns a JSON representation of the image file class.
   * - - - -
   * @returns {Promise<ImgFileJSONObject>}
   */
  async toJSON(): Promise<ImgFileJSONObject> {
    return {
      ...this.path.toJSON(),
      file: await this.stat(),
    }
  }

  /**
   * Asynchronously converts this image file to a texture file.
   * - - - -
   * @param {PathLikeTypes} destPath The path of the new texture file.
   * @param {ArtworkTextureFormatTypes} toFormat The desired texture format of the new texture file.
   * @param {ConvertToTextureOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
   * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new texture file.
   */
  async convertToTexture(destPath: PathLikeTypes, toFormat: ArtworkTextureFormatTypes, options?: ConvertToTextureOptions): Promise<TextureFile> {
    const opts = setDefaultOptions<NonNullable<typeof options>>(
      {
        DTX5: true,
        interpolation: 'bilinear',
        textureSize: 256,
      },
      options
    )
    const unformattedDestPath = FilePath.of(pathLikeToString(destPath))
    const dest = unformattedDestPath.changeFileName(unformattedDestPath.name.endsWith('_keep') ? unformattedDestPath.name : `${unformattedDestPath.name}_keep`, toFormat)

    if (toFormat === 'png_wii') {
      return await imgToTexWii(this.path, dest, { interpolation: opts.interpolation })
    }
    return await imgToTexXboxPs3(this.path, dest, toFormat, opts)
  }

  /**
   * Asynchronously converts this image file to any other image file format.
   * - - - -
   * @param {PathLikeTypes} destPath The path of the new image file.
   * @param {ArtworkTextureFormatTypes} toFormat The desired image format of the new image file.
   * @param {ConvertToImageOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
   * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new image file.
   */
  async convertToImage(destPath: PathLikeTypes, toFormat: ArtworkImageFormatTypes, options?: ConvertToImageOptions): Promise<ImgFile> {
    const opts = setDefaultOptions<NonNullable<typeof options>>(
      {
        height: null,
        width: null,
        interpolation: 'bilinear',
        quality: 100,
      },
      options
    )
    const unformattedDestPath = FilePath.of(pathLikeToString(destPath))
    const dest = unformattedDestPath.changeFileExt(toFormat)
    return await imgToImg(this.path, dest, toFormat, opts)
  }

  /**
   * Asynchronously returns a Base64-encoded DataURL `string` of the image file.
   * - - - -
   * @param {ConvertToWEBPDataURLOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
   * @returns {Promise<string>} A Base64-encoded DataURL `string` of the image file.
   */
  async toDataURL(options?: ConvertToWEBPDataURLOptions): Promise<string> {
    const opts = setDefaultOptions<NonNullable<typeof options>>(
      {
        width: null,
        height: null,
        interpolation: 'bilinear',
        quality: 100,
      },
      options
    )
    return await webpDataURL(this.path.path, opts)
  }
}
