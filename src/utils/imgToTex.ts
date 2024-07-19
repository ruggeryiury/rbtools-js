import Path from 'path-js'
import type { FetchOrConvertOptions } from '../artwork.js'
import { imgConv, imageHeaders } from '../utils.js'

/**
 * Converts an image file to game texture files.
 * - - - -
 * @param {string} src The path of the image file to be converted.
 * @param {string} dest The destination path of the generated texture file.
 * @param {Required<FetchOrConvertOptions>} options An object with values that changes the behavior of the converting process.
 * @returns {Promise<string>} The path of the generated texture file.
 */
export const imgToTex = async (src: string, dest: string, options: Required<FetchOrConvertOptions>): Promise<string> => {
  const { DTX5, format, interpolation, textureSize } = options

  const srcPath = new Path(Path.resolve(src))
  const destPath = new Path(Path.resolve(dest))

  const tga = new Path(srcPath.changeFileExt('tga'))
  const dds = new Path(srcPath.changeFileExt('dds'))

  if (destPath.exists()) await destPath.deleteFile()
  if (tga.exists()) await tga.deleteFile()
  if (dds.exists()) await dds.deleteFile()

  await imgConv.exec(srcPath.path, tga.path, textureSize, interpolation)
  await imgConv.nvCompress(tga.path, dds.path, DTX5)

  if (tga.exists()) await tga.deleteFile()

  let headerUsed: number[] | Uint8Array = DTX5 ? imageHeaders['512pDTX5'] : imageHeaders['512pDTX1']
  switch (textureSize) {
    case 256:
      headerUsed = DTX5 ? imageHeaders['256pDTX5'] : imageHeaders['256pDTX1']
      break
    case 1024:
      headerUsed = DTX5 ? imageHeaders['1024pDTX5'] : imageHeaders['1024pDTX1']
      break
    case 2048:
      headerUsed = DTX5 ? imageHeaders['2048pDTX5'] : imageHeaders['2048pDTX1']
      break
  }

  headerUsed = Uint8Array.from(headerUsed)

  const ddsBuffer = await dds.readFile()
  const destStream = await destPath.createFileWriteStream()

  // 128 is the size of the DDS file header we need to skip
  // 4 for byte swapping
  const loop = (ddsBuffer.length - 128) / 4
  const ddsBufferWOHeader = ddsBuffer.subarray(128)

  // Write the right header for the texture
  destStream.stream.write(headerUsed)

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    ddsBufferWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = format === 'png_ps3' ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    destStream.stream.write(swappedBytes)
  }

  destStream.stream.end()
  await destStream.once

  if (dds.exists()) await dds.deleteFile()

  return destPath.path
}
