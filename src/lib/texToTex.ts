import Path, { type StringOrPath } from 'path-js'
import setDefaultOptions from 'set-default-options'
import type { ConvertTextureToTextureOptions } from '../core.js'
import { TextureFile } from '../index.js'
import { type ArtworkSizeTypes, type ArtworkTextureFormatTypes, texToImgWii } from '../lib.js'
import { swapRBArtBytes } from '../python.js'

/**
 * Asynchronously converts a texture file to any other texture file format.
 * - - - -
 * @param {StringOrPath} srcFile The path of the texture file to want to convert.
 * @param {StringOrPath} destPath The path of the new converted texture file.
 * @param {ArtworkTextureFormatTypes} toFormat The desired texture format of the new texture file.
 * @param {ConvertTextureToTextureOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new converted texture file.
 */
export const texToTex = async (srcFile: StringOrPath, destPath: StringOrPath, toFormat: ArtworkTextureFormatTypes, options?: ConvertTextureToTextureOptions): Promise<TextureFile> => {
  const { DTX5 } = setDefaultOptions<typeof options>(
    {
      DTX5: true,
    },
    options
  )

  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)
  const destWithCorrectExt = new Path(dest.changeFileExt(toFormat))
  const tempPng = new Path(src.changeFileName(`${src.name}_temp`, 'png'))

  if (src.ext === '.png_ps3' || src.ext === '.png_xbox') {
    return new TextureFile(await swapRBArtBytes(src, destWithCorrectExt))
  }

  const temp = await texToImgWii(src, tempPng, 'png')
  const { width } = temp.statSync()
  const newTex = await temp.convertToTexture(destWithCorrectExt, toFormat, { DTX5, textureSize: width as ArtworkSizeTypes })

  await temp.path.checkThenDeleteFile()
  return newTex
}
