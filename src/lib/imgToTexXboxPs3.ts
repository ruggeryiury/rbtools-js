import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { NVCompress } from '../bin.js'
import { ImageHeaders, TextureFile, type ConvertToTextureOptions } from '../core.js'
import { FileConvertionError, UnknownFileFormatError } from '../errors.js'
import { type ArtworkTextureFormatTypes } from '../lib.js'
import * as Py from '../python.js'
import { stringToPath } from './stringToPath.js'

/**
 * Asynchronously converts an image file to PNG_XBOX/PNG_PS3 texture file format.
 * - - - -
 * @param {string | Path} srcFile The path of the image to want to convert.
 * @param {string | Path} destPath The path of the new converted texture file.
 * @param {ArtworkTextureFormatTypes} toFormat The desired image format of the new texture file.
 * @param {ConvertToTextureOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new converted texture file.
 */
export const imgToTexXboxPs3 = async (srcFile: string | Path, destPath: string | Path, toFormat: ArtworkTextureFormatTypes, options?: ConvertToTextureOptions): Promise<TextureFile> => {
  const { DTX5, interpolation, textureSize } = useDefaultOptions<NonNullable<typeof options>, true>(
    {
      DTX5: true,
      interpolation: 'bilinear',
      textureSize: 256,
    },
    options
  )
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)
  const destWithCorrectExt = new Path(dest.changeFileExt(toFormat))

  if (src.ext === destWithCorrectExt.ext) throw new FileConvertionError('Source and destination file has the same file extension')

  const tga = new Path(src.changeFileExt('tga'))
  const dds = new Path(src.changeFileExt('dds'))

  await destWithCorrectExt.checkThenDeleteFile()
  await tga.checkThenDeleteFile()
  await dds.checkThenDeleteFile()

  await Py.imageConverter(src.path, tga.path, 'tga', {
    width: textureSize,
    height: textureSize,
    interpolation,
    quality: 100,
  })

  await NVCompress(tga.path, dds.path, DTX5)
  await tga.checkThenDeleteFile()

  const headerName = `${textureSize.toString()}p${DTX5 ? 'DTX5' : 'DTX1'}` as keyof typeof ImageHeaders
  const header = ImageHeaders[headerName] as readonly number[] | undefined
  if (header === undefined) throw new UnknownFileFormatError('Provided file path is not recognizable as a DDS file.')
  const headerBuffer = Buffer.from(header)

  const ddsBuffer = await dds.readFile()
  const destStream = await destWithCorrectExt.createFileWriteStream()

  // 128 is the size of the DDS file header we need to skip
  // 4 for byte swapping
  const loop = (ddsBuffer.length - 128) / 4
  const ddsBufferWOHeader = ddsBuffer.subarray(128)

  destStream.stream.write(headerBuffer)
  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    ddsBufferWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = toFormat === 'png_ps3' ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    destStream.stream.write(swappedBytes)
  }

  destStream.stream.end()
  await destStream.once

  await dds.checkThenDeleteFile()
  return new TextureFile(destWithCorrectExt)
}
