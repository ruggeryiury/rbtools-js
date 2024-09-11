import { spawn } from 'node:child_process'
import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { ImgFile, type ConvertToWEBPDataURLOptions, type ImgFileStatReturnObject, type MidiFileStatObject } from './core.js'
import { execPromise, stringToPath, type ArtworkImageFormatTypes, type ArtworkInterpolationTypes } from './lib.js'
import { __root } from './index.js'

export const ImgFileStat = async (filePath: string): Promise<ImgFileStatReturnObject> => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(Path.resolve(__root.path, `./python/${moduleName}`))
  const xFile = new Path(filePath)
  const command = `python ${moduleName} "${xFile.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return JSON.parse(stdout) as ImgFileStatReturnObject
}

export const MIDIFileStat = async (filePath: string): Promise<MidiFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(Path.resolve(__root.path, `./python/${moduleName}`))
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
  const pyPath = new Path(Path.resolve(__root.path, `./python/${moduleName}`))
  const command = `python ${moduleName} "${src.path}" "${dest.changeFileExt(opts.toFormat)}" -x ${opts.width.toString()} -y ${opts.height.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return new ImgFile(dest)
}

export const WEBPDataURL = async (srcPath: string, options?: ConvertToWEBPDataURLOptions) => {
  const opts = useDefaultOptions<ConvertToWEBPDataURLOptions, true>(
    {
      width: null,
      height: null,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )

  const { width: srcWidth, height: srcHeight } = await ImgFileStat(srcPath)

  let usedWidth: number
  let usedHeight: number
  if (opts.width !== null) usedWidth = opts.width
  else usedWidth = srcWidth
  if (opts.height !== null) usedHeight = opts.height
  else usedHeight = srcHeight

  const src = stringToPath(srcPath)
  const moduleName = 'webp_data_url.py'
  const pyPath = new Path(Path.resolve(__root.path, `./python/${moduleName}`))
  const command = `python ${moduleName} "${src.path}" -x ${usedWidth.toString()} -y ${usedHeight.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stdout, stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return stdout
}

export const BufferToWEBPDataURL = async (base64Str: string) => {
  return new Promise((resolve, reject) => {
    const moduleName = 'buffer_to_webp_data_url.py'
    const pyPath = new Path(Path.resolve(__root.path, `./python/${moduleName}`))
    const process = spawn('python', [moduleName], { cwd: pyPath.root, windowsHide: true })

    let stdoutData = ''
    let stderrData = ''

    process.stdout.on('data', (data: Buffer) => {
      stdoutData += data.toString()
    })

    process.stderr.on('data', (data: Buffer) => {
      stderrData += data.toString()
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdoutData)
      } else if (code === null) {
        reject(new Error(`Python script exited with unknown code: ${stderrData}`))
      } else {
        reject(new Error(`Python script exited with code ${code.toString()}: ${stderrData}`))
      }
    })

    // Write the base64 image to the Python process via stdin
    process.stdin.write(base64Str)
    process.stdin.end() // Close stdin to signal that the input is complete
  })
}

export const WEBPDataURLPNGWii = async (srcPath: string, base64Header: string) => {
  const src = stringToPath(srcPath)
  const moduleName = 'webp_data_url_pngwii.py'
  const pyPath = new Path(Path.resolve(__root.path, `./python/${moduleName}`))
  const command = `python ${moduleName} "${src.path}" -tpl "${base64Header}"`
  const { stdout, stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return stdout
}
