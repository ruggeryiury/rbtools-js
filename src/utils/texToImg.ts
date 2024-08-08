import Path from 'path-js'
import type { ArtworkSizeTypes } from '../artwork.js'
import { getDDSHeader, imgConv } from '../utils.js'

export interface TextureToImageReturnObject {
  path: string
  width: ArtworkSizeTypes | 8 | 16 | 32 | 64
  height: ArtworkSizeTypes | 8 | 16 | 32 | 64
}

export const texToImg = async (src: string, dest: string): Promise<TextureToImageReturnObject> => {
  const srcPath = new Path(Path.resolve(src))
  const destPath = new Path(Path.resolve(dest))

  const dds = new Path(srcPath.changeFileExt('dds'))
  const tga = new Path(srcPath.changeFileExt('tga'))

  if (destPath.exists()) await destPath.deleteFile()
  if (dds.exists()) await dds.deleteFile()
  if (tga.exists()) await tga.deleteFile()

  const srcBuffer = await srcPath.readFile()
  const ddsStream = await dds.createFileWriteStream()

  // 32 is the size of the texture file header we need to skip
  const loop = (srcBuffer.length - 32) / 4
  const srcContents = srcBuffer.subarray(32)

  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const srcHeader = await getDDSHeader(Uint8Array.from(fullSrcHeader), Uint8Array.from(shortSrcHeader))

  ddsStream.stream.write(srcHeader)

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    srcContents.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = srcPath.ext.includes('ps3') ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    ddsStream.stream.write(swappedBytes)
  }

  ddsStream.stream.end()
  await ddsStream.once

  const ddsBuffer = await dds.readFile()
  const ddsHeader = Uint8Array.from(ddsBuffer.subarray(0, 32))
  let ddsWidth: ArtworkSizeTypes | 8 | 16 | 32 | 64 = 256
  let ddsHeight: ArtworkSizeTypes | 8 | 16 | 32 | 64 = 256

  switch (
    ddsHeader[17] // Width byte
  ) {
    case 0x00:
      switch (ddsHeader[16]) {
          case 0x08:
            ddsWidth = 8
            break
          case 0x10:
            ddsWidth = 16
            break
          case 0x20:
            ddsWidth = 32
            break
          case 0x40:
            ddsWidth = 64
            break
        case 0x80:
          ddsWidth = 128
          break
      }
      break
    case 0x02:
      ddsWidth = 512
      break
    case 0x04:
      ddsWidth = 1024
      break
    case 0x08:
      ddsWidth = 2048
      break
  }
  switch (
    ddsHeader[13] // Height byte
  ) {
    case 0x00:
      switch (ddsHeader[12]) {
          case 0x08:
            ddsHeight = 8
            break
          case 0x10:
            ddsHeight = 16
            break
          case 0x20:
            ddsHeight = 32
            break
          case 0x40:
            ddsHeight = 64
            break
        case 0x80:
          ddsHeight = 128
          break
      }
      break
    case 0x02:
      ddsHeight = 512
      break
    case 0x04:
      ddsHeight = 1024
      break
    case 0x08:
      ddsHeight = 2048
      break
  }

  await imgConv.nvDecompress(dds.path)
  await imgConv.exec(tga.path, destPath.path, [ddsWidth, ddsHeight], 'bilinear')

  if (dds.exists()) await dds.deleteFile()
  if (tga.exists()) await tga.deleteFile()

  return {
    path: destPath.path,
    width: ddsWidth,
    height: ddsHeight,
  }
}
