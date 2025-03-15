import { Path, type PathLikeTypes } from 'path-js'
import { ImgFile } from '../../index'
import { getTPLHeader, WimgtDec, type ArtworkImageFormatTypes } from '../../lib'

/**
 * Asynchronously converts a PNG_WII texture file to any image format.
 * - - - -
 * @param {PathLikeTypes} srcFile The path of the texture file to want to convert.
 * @param {PathLikeTypes} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @returns {Promise<ImgFile>} A new instantiated `ImgFile` class pointing to the new converted image file.
 */
export const texToImgWii = async (srcFile: PathLikeTypes, destPath: PathLikeTypes, toFormat: ArtworkImageFormatTypes): Promise<ImgFile> => {
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)
  const destWithCorrectExt = new Path(dest.changeFileExt(toFormat))

  const tpl = new Path(src.changeFileExt('tpl'))

  await destWithCorrectExt.checkThenDeleteFile()
  await tpl.checkThenDeleteFile()

  const srcBuffer = await src.readFile()
  const srcHeader = await getTPLHeader(src)

  const tplStream = await tpl.createFileWriteStream()
  tplStream.stream.write(srcHeader.data)

  // 32 is the size of the texture file header we need to skip
  const srcContents = srcBuffer.subarray(32)
  tplStream.stream.write(srcContents)

  tplStream.stream.end()
  await tplStream.once

  try {
    await WimgtDec(tpl.path, destWithCorrectExt.path)
  } catch (err) {
    // Do nothing, WIMGT might has this find_fast_cwd error that keeps on appearing
    // but the file is coverted successfully...
  }

  await tpl.checkThenDeleteFile()
  return new ImgFile(destWithCorrectExt)
}
