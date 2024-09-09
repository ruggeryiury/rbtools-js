import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { NVCompress } from '../bin.js'
import { ImageHeaders, TextureFile, type ConvertToTextureOptions } from '../core.js'
import { ifExistsThenDelete, type ArtworkTextureFormatTypes } from '../lib.js'
import { ImageConverter } from '../python.js'
import { stringToPath } from './stringToPath.js'

export const imgToTexXboxPs3 = async (srcPath: string | Path, destPath: string | Path, format: ArtworkTextureFormatTypes, options?: ConvertToTextureOptions) => {
  const { DTX5, interpolation, textureSize } = useDefaultOptions<ConvertToTextureOptions, true>(
    {
      DTX5: true,
      interpolation: 'bilinear',
      textureSize: 256,
    },
    options
  )
  const src = stringToPath(srcPath)
  const dest = new Path(stringToPath(destPath).changeFileName(stringToPath(destPath).name.endsWith('_keep') ? stringToPath(destPath).name : `${stringToPath(destPath).name}_keep`, format))

  const tga = new Path(src.changeFileExt('tga'))
  const dds = new Path(src.changeFileExt('dds'))

  await ifExistsThenDelete(dest)
  await ifExistsThenDelete(tga)
  await ifExistsThenDelete(dds)

  await ImageConverter(src.path, tga.path, {
    width: textureSize,
    height: textureSize,
    interpolation,
    quality: 100,
    toFormat: 'tga',
  })

  await NVCompress(tga.path, dds.path, DTX5)
  await ifExistsThenDelete(tga)

  const headerName = `${textureSize.toString()}p${DTX5 ? 'DTX5' : 'DTX1'}` as keyof typeof ImageHeaders
  const header = ImageHeaders[headerName] as readonly number[] | undefined
  if (header === undefined) throw new Error(`ImgToTexXboxPs3Error: No header found for texture file of name "${headerName}"`)
  const headerBuffer = Buffer.from(header)

  const ddsBuffer = await dds.readFile()
  const destStream = await dest.createFileWriteStream()

  // 128 is the size of the DDS file header we need to skip
  // 4 for byte swapping
  const loop = (ddsBuffer.length - 128) / 4
  const ddsBufferWOHeader = ddsBuffer.subarray(128)

  destStream.stream.write(headerBuffer)
  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    ddsBufferWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = format === 'png_ps3' ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    destStream.stream.write(swappedBytes)
  }

  destStream.stream.end()
  await destStream.once

  await ifExistsThenDelete(dds)
  return new TextureFile(dest)
}
