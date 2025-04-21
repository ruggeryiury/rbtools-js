import { FilePath, type FilePathJSONRepresentation, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import { setDefaultOptions } from 'set-default-options'
import { TextureFileError } from '../errors'
import { ImgFile } from '../index'
import { pngWiiStatSync, pngXboxPs3TexStatSync, type ArtworkTextureFormatTypes, texToTex, type ArtworkImageFormatTypes, texToImgWii, texToImgXboxPs3, texBufferToWEBPDataUrl, pngXboxPs3TexStat, pngWiiStat } from '../lib'

export interface TextureFileStatReturnObject {
  /** The format of the texture file. */
  format: string
  /** The type of the encoding method of the texture file. */
  type: string
  /** The width of the texture file. */
  width: number
  /** The height of the texture file. */
  height: number
  /** An array with the texture file's width and height. */
  size: [number, number]
  /** A description to the texture file format. */
  formatDesc: string
}

export interface TextureFileJSONObject extends FilePathJSONRepresentation {
  /** The statistics of the image file. */
  file: TextureFileStatReturnObject
}

export interface ConvertTextureToTextureOptions {
  /**
   * Uses DTX5 encoding on the NVIDIA encoding process. Default is `true`.
   *
   * _DTX5 encoding is only used when converting to PNG_XBOX or PNG_PS3 files, having no influence when converting to PNG_WII._
   *
   */
  DTX5?: boolean
}

/**
 * TextureFile is a class that represents a texture file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class TextureFile {
  /** The path of the texture file */
  path: FilePath

  /**
   * Checks if a path resolves to an existing image file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists) throw new Error(`TextureFileNotFoundError: Texture file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * @param {string} textureFilePath The path to the texture file.
   */
  constructor(textureFilePath: PathLikeTypes) {
    this.path = FilePath.of(pathLikeToString(textureFilePath))
    this.checkExistence()

    if (this.path.ext === '.png' || this.path.ext === '.bmp' || this.path.ext === '.jpg' || this.path.ext === '.webp' || this.path.ext === '.tga') throw new TextureFileError(`Tired to load a ${this.path.ext.slice(1).toUpperCase()} file on an "TextureFile()" class, try to use the "ImgFile()" class instead`)
    if (this.path.ext !== '.png_xbox' && this.path.ext !== '.png_ps3' && this.path.ext !== '.png_wii') throw new TextureFileError(`Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, for texture format is not compatible for this module. Compatible image formats are: "png_xbox", "png_ps3", "png_wii"`)
  }

  /**
   * Asynchronously returns a JSON object with statistics of the texture file.
   * - - - -
   * @returns {Promise<TextureFileStatReturnObject>}
   */
  async stat(): Promise<TextureFileStatReturnObject> {
    this.checkExistence()
    if (this.path.ext === '.png_wii') return pngWiiStat(this.path)
    else return pngXboxPs3TexStat(this.path)
  }

  /**
   * Returns a JSON object with statistics of the texture file.
   * - - - -
   * @returns {TextureFileStatReturnObject}
   */
  statSync(): TextureFileStatReturnObject {
    this.checkExistence()
    if (this.path.ext === '.png_wii') return pngWiiStatSync(this.path)
    else return pngXboxPs3TexStatSync(this.path)
  }

  /**
   * Returns a JSON representation of the texture file class.
   * - - - -
   * @returns {TextureFileJSONObject}
   */
  toJSONSync(): TextureFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.statSync(),
    }
  }

  /**
   * Asynchronously returns a JSON representation of the texture file class.
   * - - - -
   * @returns {Promise<TextureFileJSONObject>}
   */
  async toJSON(): Promise<TextureFileJSONObject> {
    return {
      ...this.path.toJSON(),
      file: await this.stat(),
    }
  }

  /**
   * Asynchronously converts this texture file to any other texture file format.
   * - - - -
   * @param {PathLikeTypes} destPath The path of the new texture file.
   * @param {ArtworkTextureFormatTypes} toFormat The desired image format of the image file.
   * @param {ConvertTextureToTextureOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
   * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new texture file.
   */
  async convertToTexture(destPath: PathLikeTypes, toFormat: ArtworkTextureFormatTypes, options?: ConvertTextureToTextureOptions): Promise<TextureFile> {
    const opts = setDefaultOptions<typeof options>(
      {
        DTX5: true,
      },
      options
    )
    const unformattedDestPath = FilePath.of(pathLikeToString(destPath))
    const dest = unformattedDestPath.changeFileName(unformattedDestPath.name.endsWith('_keep') ? unformattedDestPath.name : `${unformattedDestPath.name}_keep`, toFormat)
    return await texToTex(this.path, dest, toFormat, opts)
  }

  /**
   * Asynchronously converts this texture file to an image file.
   * - - - -
   * @param {PathLikeTypes} destPath The path of the new image file.
   * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
   * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new image file.
   */
  async convertToImage(destPath: PathLikeTypes, toFormat: ArtworkImageFormatTypes): Promise<ImgFile> {
    const dest = FilePath.of(pathLikeToString(destPath)).changeFileExt(toFormat)
    if (this.path.ext === '.png_wii') return await texToImgWii(this.path, dest, toFormat)
    return await texToImgXboxPs3(this.path, dest, toFormat)
  }

  /**
   * Asynchronously returns a Base64-encoded DataURL `string` of the texture file.
   * - - - -
   * @returns {Promise<string>} A Base64-encoded DataURL `string` of the texture file.
   */
  async toDataURL(): Promise<string> {
    return await texBufferToWEBPDataUrl(this.path)
  }
}
