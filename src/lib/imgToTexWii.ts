import Path, { type StringOrPath } from 'path-js'
import setDefaultOptions from 'set-default-options'
import { ImageHeaders, TextureFile, type ConvertToTextureOptions } from '../core.js'
import { FileConvertionError } from '../errors.js'
import { WimgtEnc } from '../exec.js'
import { imageConverter } from '../python.js'

/**
 * Asynchronously converts an image file to PNG_WII texture file format.
 * - - - -
 * @param {StringOrPath} srcFile The path of the image to want to convert.
 * @param {StringOrPath} destPath The path of the new converted texture file.
 * @param {Omit<ConvertToTextureOptions, 'DTX5' | 'textureSize'>} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new converted texture file.
 */
export const imgToTexWii = async (srcFile: StringOrPath, destPath: StringOrPath, options?: Omit<ConvertToTextureOptions, 'DTX5' | 'textureSize'>): Promise<TextureFile> => {
  const { interpolation } = setDefaultOptions<typeof options>(
    {
      interpolation: 'bilinear',
    },
    options
  )
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)
  const destWithCorrectExt = new Path(dest.changeFileExt('png_wii'))

  if (src.ext === destWithCorrectExt.ext) throw new FileConvertionError('Source and destination file has the same file extension')

  const png = new Path(src.changeFileName(`${src.name}_temp`, 'png'))
  const tpl = new Path(src.changeFileExt('tpl'))

  await destWithCorrectExt.checkThenDeleteFile()
  await png.checkThenDeleteFile()
  await tpl.checkThenDeleteFile()

  await imageConverter(src.path, png.path, 'png', { width: 256, height: 256, interpolation, quality: 100 })
  try {
    await WimgtEnc(png.path, tpl.path)
  } catch (err) {
    // Do nothing, WIMGT might has this find_fast_cwd error that keeps on appearing
    // but the file is coverted successfully...
  }

  await png.checkThenDeleteFile()

  const tplBytes = await tpl.readFile()
  const destStream = await destWithCorrectExt.createFileWriteStream()

  // 64 is the size of the TPL file header we need to skip
  const loop = (tplBytes.length - 64) / 4
  const tplBytesWOHeader = tplBytes.subarray(64)
  destStream.stream.write(Buffer.from(ImageHeaders.WII256x256))

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    tplBytesWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    destStream.stream.write(newBuffer)
  }

  destStream.stream.end()
  await destStream.once

  await tpl.checkThenDeleteFile()
  return new TextureFile(destWithCorrectExt)
}
