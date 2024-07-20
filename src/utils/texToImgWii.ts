import Path from 'path-js'
import type { ArtworkSizeTypes } from '../artwork.js'
import { imageHeaders, imgConv, type TextureToImageReturnObject } from '../utils.js'

export const texToImgWii = async (src: string, dest: string): Promise<TextureToImageReturnObject> => {
  const srcPath = new Path(Path.resolve(src))
  const destPath = new Path(Path.resolve(dest))

  const tpl = new Path(srcPath.changeFileExt('tpl'))

  if (tpl.exists()) await tpl.deleteFile()

  const srcBuffer = await srcPath.readFile()

  let textureSize: ArtworkSizeTypes = 256,
    tplHeader: number[]

  // 32 is the size of the texture file header we need to skip
  const srcHeader = srcBuffer.subarray(0, 32)

  if (Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII128x128_RGBA32).toString()) {
    tplHeader = imageHeaders.TPL128x128_RGBA32
    textureSize = 128
  } else if (Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII256x256).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII256x256_B).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII256x256_C8).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII256x256_UNKNOWN).toString()) {
    tplHeader = imageHeaders.TPL256x256
    textureSize = 256
  } else if (Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII128x128).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII128x128_PMA).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII128x128_UNKNOWN).toString()) {
    tplHeader = imageHeaders.TPL128x128
    textureSize = 128
  }
  // else if (Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII64x64).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII64x64_PMA).toString() || Uint8Array.from(srcHeader).toString() === Uint8Array.from(imageHeaders.WII64x64_UNKNOWN).toString()) {
  // tplHeader = imageHeaders.TPL64x64
  // textureSize = 64
  // }
  else throw new Error(`fetchOrConvertArtworkError: File on path "${srcPath.path}" doesn't have a recognizable album artwork header. Try to use Nautilus to convert this file.`)

  const tplStream = await tpl.createFileWriteStream()
  tplStream.stream.write(Buffer.from(tplHeader))

  const srcContents = srcBuffer.subarray(32)
  tplStream.stream.write(srcContents)

  tplStream.stream.end()
  await tplStream.once

  await imgConv.wimgtDecode(tpl.path, destPath.path)

  if (tpl.exists()) await tpl.deleteFile()

  return {
    path: destPath.path,
    width: textureSize,
    height: textureSize,
  }
}
