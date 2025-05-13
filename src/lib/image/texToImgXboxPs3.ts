import { FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { ImgFile } from '../../index'
import { getDDSHeader, imageConverter, type ArtworkImageFormatTypes } from '../../lib.exports'

/**
 * Asynchronously converts a PNG_XBOX or PNG_PS3 texture file to any image format.
 * - - - -
 * @param {FilePathLikeTypes} srcFile The path of the texture file to want to convert.
 * @param {FilePathLikeTypes} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new converted image file.
 */
export const texToImgXboxPs3 = async (srcFile: FilePathLikeTypes, destPath: FilePathLikeTypes, toFormat: ArtworkImageFormatTypes): Promise<ImgFile> => {
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))
  const destWithCorrectExt = dest.changeFileExt(toFormat)
  const dds = src.changeFileExt('dds')

  await destWithCorrectExt.delete()
  await dds.delete()

  const srcBuffer = await src.read()
  const ddsStream = await dds.createWriteStream()

  // 32 is the size of the texture file header we need to skip
  const loop = (srcBuffer.length - 32) / 4
  const srcContents = srcBuffer.subarray(32)

  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const srcHeader = await getDDSHeader(fullSrcHeader, shortSrcHeader)
  ddsStream.stream.write(srcHeader.data)

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    srcContents.copy(newBuffer, 0, x * 4, x * 4 + 4)
    const swappedBytes = src.ext === '.png_ps3' ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
    ddsStream.stream.write(swappedBytes)
  }

  ddsStream.stream.end()
  await ddsStream.once

  await imageConverter(dds.path, destWithCorrectExt.path, toFormat, { width: srcHeader.width, height: srcHeader.height })

  await dds.delete()
  return new ImgFile(destWithCorrectExt)
}
