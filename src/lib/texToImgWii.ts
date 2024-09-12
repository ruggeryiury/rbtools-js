import Path from 'path-js'
import { WimgtDec } from '../bin.js'
import { ImgFile } from '../index.js'
import { getTPLHeader, stringToPath, type ArtworkImageFormatTypes } from '../lib.js'

export const texToImgWii = async (srcFile: string | Path, destPath: string | Path, toFormat: ArtworkImageFormatTypes) => {
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)
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
