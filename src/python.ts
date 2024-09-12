import { execSync, spawn } from 'node:child_process'
import { useDefaultOptions } from 'dta-parser/lib'
import Path from 'path-js'
import { ImgFile, type ConvertToWEBPDataURLOptions, type ImgFileStatReturnObject, type MidiFileStatObject } from './core.js'
import { PythonExecutionError } from './errors.js'
import { execPromise, getTPLHeader, stringToPath, type ArtworkImageFormatTypes, type ArtworkInterpolationTypes } from './lib.js'
import { __root } from './index.js'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the image file.
 * - - - -
 * @param {string | Path} imageFilePath The path of the image file.
 * @returns {Promise<ImgFileStatReturnObject>}
 */
export const imgFileStat = async (imageFilePath: string | Path): Promise<ImgFileStatReturnObject> => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = stringToPath(imageFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as ImgFileStatReturnObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the image file.
 * - - - -
 * @param {string | Path} imageFilePath The path of the image file.
 * @returns {ImgFileStatReturnObject}
 */
export const imgFileStatSync = (imageFilePath: string | Path): ImgFileStatReturnObject => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = stringToPath(imageFilePath)
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as ImgFileStatReturnObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {string | Path} midiFilePath The path of the MIDI file.
 * @returns {Promise<ImgFileStatReturnObject>}
 */
export const midiFileStat = async (midiFilePath: string | Path): Promise<MidiFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = stringToPath(midiFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as MidiFileStatObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {string | Path} midiFilePath The path of the MIDI file.
 * @returns {MidiFileStatObject}
 */
export const midiFileStatSync = (midiFilePath: string | Path): MidiFileStatObject => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = stringToPath(midiFilePath)
  const command = `python ${moduleName} "${src.path}"`

  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as MidiFileStatObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}

export interface ImageConverterOptions {
  width?: number
  height?: number
  interpolation?: ArtworkInterpolationTypes
  quality?: number
}

/**
 * Python script: Asynchronously converts an image file to any other image file format.
 * - - - -
 * @param {string | Path} srcFile The path of the image to want to convert.
 * @param {string | Path} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @param {ImageConverterOptions | undefined} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<ImgFile>}
 */
export const imageConverter = async (srcFile: string | Path, destPath: string | Path, toFormat: ArtworkImageFormatTypes, options?: ImageConverterOptions): Promise<ImgFile> => {
  const opts = useDefaultOptions<NonNullable<typeof options>, true>(
    {
      height: 256,
      width: 256,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)
  const moduleName = 'image_converter.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const command = `python ${moduleName} "${src.path}" "${dest.changeFileExt(toFormat)}" -x ${opts.width.toString()} -y ${opts.height.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return new ImgFile(dest)
}

/**
 * Python script: Asynchronously returns a Base64-encoded DataURL `string` of the image file.
 * - - - -
 * @param {string | Path} srcFile The path to the image file.
 * @param {ConvertToWEBPDataURLOptions | undefined} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<string>}
 */
export const webpDataURL = async (srcFile: string | Path, options?: ConvertToWEBPDataURLOptions): Promise<string> => {
  const opts = useDefaultOptions<NonNullable<typeof options>, true>(
    {
      width: null,
      height: null,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )

  const { width: srcWidth, height: srcHeight } = await imgFileStat(srcFile)

  let usedWidth: number
  let usedHeight: number
  if (opts.width !== null) usedWidth = opts.width
  else usedWidth = srcWidth
  if (opts.height !== null) usedHeight = opts.height
  else usedHeight = srcHeight

  const src = stringToPath(srcFile)
  const moduleName = 'webp_data_url.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const command = `python ${moduleName} "${src.path}" -x ${usedWidth.toString()} -y ${usedHeight.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stdout, stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return stdout
}

/**
 * Python script: Asynchronously converts an image file `Buffer` to a Base64-encoded
 * Data URL `string` of the image.
 * - - - -
 * @param {Buffer} buf The buffer of the image file.
 * @returns {Promise<string>}
 */
export const imgBufferToWEBPDataURL = async (buf: Buffer): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const moduleName = 'img_buffer_to_webp_data_url.py'
    const pyPath = new Path(__root.path, `./python/${moduleName}`)
    const process = spawn('python', [moduleName], { cwd: pyPath.root, windowsHide: true })
    const base64Str = buf.toString('base64')

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
        const [dataurl] = stdoutData.split('\r\n')
        resolve(dataurl)
      } else if (code === null) {
        reject(new PythonExecutionError(`Python script exited with unknown code: ${stderrData}`))
      } else {
        reject(new PythonExecutionError(`Python script exited with code ${code.toString()}: ${stderrData}`))
      }
    })

    // Write the base64 image to the Python process via stdin
    process.stdin.write(base64Str)
    process.stdin.end() // Close stdin to signal that the input is complete
  })
}

/**
 * Python script: Asynchronously converts an PNG_WII texture file to a Base64-encoded
 * Data URL `string` of the texture file.
 * - - - -
 * @param {string | Path} srcFile The path of the PNG_WII file.
 * @returns {Promise<string>}
 */
export const webpDataURLPNGWii = async (srcFile: string | Path): Promise<string> => {
  const src = stringToPath(srcFile)
  const usedHeader = await getTPLHeader(src)
  const base64Header = usedHeader.data.toString('base64')
  const moduleName = 'webp_data_url_pngwii.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const command = `python ${moduleName} "${src.path}" -tpl "${base64Header}"`
  const { stdout, stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)
  const [, dataurl] = stdout.split('\r\n')
  return dataurl
}
