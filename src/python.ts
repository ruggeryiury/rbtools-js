import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { ImgFile, type ImgFileStatReturnObject, type MidiFileStatObject } from './core.js'
import { decodeFileURL, execPromise, stringToPath, type ArtworkImageFormatTypes, type ArtworkInterpolationTypes } from './lib.js'

const __filename = decodeFileURL(import.meta.url)
const __dirname = new Path(__filename).root

export const ImgFileStat = async (filePath: string): Promise<ImgFileStatReturnObject> => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(Path.resolve(__dirname, `./python/${moduleName}`))
  const xFile = new Path(filePath)
  const command = `python ${moduleName} "${xFile.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return JSON.parse(stdout) as ImgFileStatReturnObject
}

export const MIDIFileStat = async (filePath: string): Promise<MidiFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(Path.resolve(__dirname, `./python/${moduleName}`))
  const xFile = new Path(filePath)
  const command = `python ${moduleName} "${xFile.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return JSON.parse(stdout) as MidiFileStatObject
}

export interface ImageConverterOptions {
  toFormat?: ArtworkImageFormatTypes
  width?: number
  height?: number
  interpolation?: ArtworkInterpolationTypes
  quality?: number
}
export const ImageConverter = async (srcPath: string, destPath: string, options?: ImageConverterOptions) => {
  const opts = useDefaultOptions<ImageConverterOptions, true>(
    {
      toFormat: 'png',
      height: 256,
      width: 256,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )
  const src = stringToPath(srcPath)
  const dest = stringToPath(destPath)
  const moduleName = 'image_converter.py'
  const pyPath = new Path(Path.resolve(__dirname, `./python/${moduleName}`))
  const command = `python ${moduleName} "${src.path}" "${dest.changeFileExt(opts.toFormat)}" -x ${opts.width.toString()} -y ${opts.height.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return new ImgFile(dest)
}
