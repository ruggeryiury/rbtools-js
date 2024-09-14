import { useDefaultOptions } from 'dta-parser/lib'
import Path, { type PathJSONRepresentation } from 'path-js'
import { TextureFileError } from '../errors.js'
import { ImgFile } from '../index.js'
import { stringToPath, pngWiiStatSync, pngXboxPs3TexStatSync, type ArtworkTextureFormatTypes, texToTex, type ArtworkImageFormatTypes, texToImgWii, texToImgXboxPs3, texBufferToWEBPDataUrl } from '../lib.js'

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

export interface TextureFileJSONObject extends PathJSONRepresentation {
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
  path: Path

  /**
   * Checks if a path resolves to an existing image file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists()) throw new Error(`TextureFileNotFoundError: Texture file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * @param {string} textureFilePath The path to the texture file.
   */
  constructor(textureFilePath: string | Path) {
    this.path = stringToPath(textureFilePath)
    this.checkExistence()

    if (this.path.ext === '.png' || this.path.ext === '.bmp' || this.path.ext === '.jpg' || this.path.ext === '.webp' || this.path.ext === '.tga') throw new TextureFileError(`Tired to load a ${this.path.ext.slice(1).toUpperCase()} file on an "TextureFile()" class, try to use the "ImgFile()" class instead`)
    if (this.path.ext !== '.png_xbox' && this.path.ext !== '.png_ps3' && this.path.ext !== '.png_wii') throw new TextureFileError(`Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, for texture format is not compatible for this module. Compatible image formats are: "png_xbox", "png_ps3", "png_wii"`)
  }

  /**
   * Returns a JSON object with statistics of the texture file.
   * - - - -
   * @returns {TextureFileStatReturnObject}
   */
  stat(): TextureFileStatReturnObject {
    this.checkExistence()
    if (this.path.ext === '.png_wii') return pngWiiStatSync(this.path)
    else return pngXboxPs3TexStatSync(this.path)
  }

  /**
   * Returns a JSON representation of the texture file class.
   * - - - -
   * @returns {TextureFileJSONObject}
   */
  toJSON(): TextureFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.stat(),
    }
  }

  /**
   * Asynchronously converts this texture file to any other texture file format.
   * - - - -
   * @param {string | Path} destPath The path of the new texture file.
   * @param {ArtworkTextureFormatTypes} toFormat The desired image format of the image file.
   * @param {ConvertTextureToTextureOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
   * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new texture file.
   */
  async convertToTexture(destPath: string | Path, toFormat: ArtworkTextureFormatTypes, options?: ConvertTextureToTextureOptions): Promise<TextureFile> {
    const opts = useDefaultOptions<NonNullable<typeof options>>(
      {
        DTX5: true,
      },
      options
    )
    const unformattedDestPath = stringToPath(destPath)
    const dest = new Path(unformattedDestPath.changeFileName(unformattedDestPath.changeFileName(unformattedDestPath.name.endsWith('_keep') ? unformattedDestPath.name.slice(0, -5) : unformattedDestPath.name, toFormat)))
    return await texToTex(this.path, dest, toFormat, opts)
  }

  /**
   * Asynchronously converts this texture file to an image file.
   * - - - -
   * @param {string | Path} destPath The path of the new image file.
   * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
   * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new image file.
   */
  async convertToImage(destPath: string | Path, toFormat: ArtworkImageFormatTypes): Promise<ImgFile> {
    const unformattedDestPath = stringToPath(destPath)
    const dest = new Path(unformattedDestPath.changeFileExt(toFormat))
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
