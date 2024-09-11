import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { WimgtEnc } from '../bin.js'
import { ImageHeaders, TextureFile, type ConvertToTextureOptions } from '../core.js'
import { stringToPath } from '../lib.js'
import { ImageConverter } from '../python.js'

export const imgToTexWii = async (srcPath: string | Path, destPath: string | Path, options?: Omit<ConvertToTextureOptions, 'DTX5' | 'textureSize'>) => {
  const { interpolation } = useDefaultOptions<NonNullable<typeof options>, true>(
    {
      interpolation: 'bilinear',
    },
    options
  )
  const src = stringToPath(srcPath)
  const dest = stringToPath(destPath)

  const png = new Path(src.changeFileName(`${src.name}_temp`, 'png'))
  const tpl = new Path(src.changeFileExt('tpl'))

  await dest.checkThenDeleteFile()
  await png.checkThenDeleteFile()
  await tpl.checkThenDeleteFile()

  await ImageConverter(src.path, png.path, { width: 256, height: 256, interpolation, quality: 100, toFormat: 'png' })
  try {
    await WimgtEnc(png.path, tpl.path)
  } catch (err) {
    // Do nothing, WIMGT has this find_fast_cwd error that keeps on sending but the file is coverted successfully...
  }

  await png.checkThenDeleteFile()

  const tplBytes = await tpl.readFile()
  const destStream = await dest.createFileWriteStream()

  // 64 is the size of the TPL file header we need to skip
  const loop = (tplBytes.length - 64) / 4
  const tplBytesWOHeader = tplBytes.subarray(64)
  destStream.stream.write(Buffer.from(ImageHeaders.WII256x256))

  for (let x = 0; x <= loop; x++) {
    const newBuffer = Buffer.alloc(4)
    tplBytesWOHeader.copy(newBuffer, 0, x * 4, x * 4 + 4)
    destStream.stream.write(newBuffer)
  }

  destStream.stream.end()
  await destStream.once

  await tpl.checkThenDeleteFile()
  return new TextureFile(dest)
}
