import Path from 'path-js'
import type { FetchOrConvertOptions } from '../artwork.js'
import { imageHeaders } from './imageHeaders.js'
import { imgConv } from './imgConv.js'

/**
 * Specific function that converts an image file to Wii game texture file.
 * - - - -
 * @param {string} src The path of the image file to be converted.
 * @param {string} dest The destination path of the generated texture file.
 * @param {Required<FetchOrConvertOptions>} options An object with values that changes the behavior of the converting process.
 * @returns {Promise<string>} The path of the generated texture file.
 */
export const imgToTexWii = async (src: string, dest: string, options: Required<FetchOrConvertOptions>): Promise<string> => {
  const { interpolation, textureSize } = options

  const srcPath = new Path(Path.resolve(src))
  const destPath = new Path(Path.resolve(dest))

  const tempPng = new Path(srcPath.changeFileName(`${srcPath.name}_temp`, 'png'))
  const tpl = new Path(srcPath.changeFileExt('tpl'))

  if (tempPng.exists()) await tempPng.deleteFile()
  if (tpl.exists()) await tpl.deleteFile()
  if (destPath.exists()) await destPath.deleteFile()

  await imgConv.exec(srcPath.path, tempPng.path, textureSize, interpolation)
  console.log(tempPng.path, tpl.path)
  await imgConv.wimgtEncode(tempPng.path, tpl.path)

  if (tempPng.exists()) await tempPng.deleteFile()

  const tplBytes = await tpl.readFile()
  const destStream = await destPath.createFileWriteStream()

  // 64 is the size of the TPL file header we need to skip
  const loop = (tplBytes.length - 64) / 4
  const tplBytesWOHeader = tplBytes.subarray(64)
  destStream.stream.write(Uint8Array.from(imageHeaders.WII256x256))

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    tplBytesWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    destStream.stream.write(newBuffer)
  }

  destStream.stream.end()
  await destStream.once

  if (tpl.exists()) await tpl.deleteFile()

  return destPath.path
}
