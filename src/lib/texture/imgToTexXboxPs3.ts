import { Path, type PathLikeTypes } from 'path-js'
import { setDefaultOptions } from 'set-default-options'
import { TextureFile, type ConvertToTextureOptions } from '../../core'
import { FileConvertionError, UnknownFileFormatError } from '../../errors'
import { NVCompress, imageConverter, type ArtworkTextureFormatTypes, imageHeaders } from '../../lib'

/**
 * Asynchronously converts an image file to PNG_XBOX/PNG_PS3 texture file format.
 * - - - -
 * @param {PathLikeTypes} srcFile The path of the image to want to convert.
 * @param {PathLikeTypes} destPath The path of the new converted texture file.
 * @param {ArtworkTextureFormatTypes} toFormat The desired image format of the new texture file.
 * @param {ConvertToTextureOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<TextureFile>} A new instantiated `TextureFile` class pointing to the new converted texture file.
 */
export const imgToTexXboxPs3 = async (srcFile: PathLikeTypes, destPath: PathLikeTypes, toFormat: ArtworkTextureFormatTypes, options?: ConvertToTextureOptions): Promise<TextureFile> => {
  const { DTX5, interpolation, textureSize } = setDefaultOptions<typeof options>(
    {
      DTX5: true,
      interpolation: 'bilinear',
      textureSize: 256,
    },
    options
  )
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)
  const destWithCorrectExt = new Path(dest.changeFileExt(toFormat))

  if (src.ext === destWithCorrectExt.ext) throw new FileConvertionError('Source and destination file has the same file extension')

  const tga = new Path(src.changeFileExt('tga'))
  const dds = new Path(src.changeFileExt('dds'))

  await destWithCorrectExt.checkThenDeleteFile()
  await tga.checkThenDeleteFile()
  await dds.checkThenDeleteFile()

  await imageConverter(src.path, tga.path, 'tga', {
    width: textureSize,
    height: textureSize,
    interpolation,
    quality: 100,
  })

  await NVCompress(tga.path, dds.path, DTX5)
  await tga.checkThenDeleteFile()

  const headerName = `${textureSize.toString()}p${DTX5 ? 'DTX5' : 'DTX1'}` as keyof typeof imageHeaders
  const header = imageHeaders[headerName] as readonly number[] | undefined
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
