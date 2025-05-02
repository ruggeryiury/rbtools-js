import { FilePath, type PathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { setDefaultOptions } from 'set-default-options'
import { temporaryFile } from 'tempy'
import { TextureFile, type ConvertToTextureOptions } from '../../core.exports'
import { FileConvertionError } from '../../errors'
import { WimgtEnc, imageConverter, imageHeaders } from '../../lib.exports'
/**
 * Asynchronously converts an image file to PNG_WII texture file format.
 * - - - -
 * @param {PathLikeTypes} srcFile The path of the image to want to convert.
 * @param {PathLikeTypes} destPath The path of the new converted texture file.
 * @param {Omit<ConvertToTextureOptions, 'DTX5' | 'textureSize'>} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new converted texture file.
 */
export const imgToTexWii = async (srcFile: PathLikeTypes, destPath: PathLikeTypes, options?: Omit<ConvertToTextureOptions, 'DTX5' | 'textureSize'>): Promise<TextureFile> => {
  const { interpolation } = setDefaultOptions<NonNullable<typeof options>>(
    {
      interpolation: 'bilinear',
    },
    options
  )
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath)).changeFileExt('png_wii')

  if (src.ext === dest.ext) throw new FileConvertionError('Source and destination file has the same texture format')

  const png = FilePath.of(temporaryFile({ extension: '.png' }))
  const tpl = FilePath.of(temporaryFile({ extension: '.tpl' }))

  await dest.delete()
  await png.delete()
  await tpl.delete()

  await imageConverter(src.path, png.path, 'png', { width: 256, height: 256, interpolation, quality: 100 })
  try {
    await WimgtEnc(png.path, tpl.path)
  } catch (err) {
    // Do nothing, WIMGT might has this find_fast_cwd error that keeps on appearing
    // but the file is coverted successfully...
  }

  await png.delete()

  const tplBytes = await tpl.read()
  const destStream = await dest.createWriteStream()

  // 64 is the size of the TPL file header we need to skip
  const loop = (tplBytes.length - 64) / 4
  const tplBytesWOHeader = tplBytes.subarray(64)
  destStream.stream.write(Buffer.from(imageHeaders.WII256x256))

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    tplBytesWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    destStream.stream.write(newBuffer)
  }

  destStream.stream.end()
  await destStream.once

  await tpl.delete()
  return new TextureFile(dest)
}
