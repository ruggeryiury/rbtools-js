import { spawn } from 'child_process'
import { execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { setDefaultOptions } from 'set-default-options'
import type { ConvertToWEBPDataURLOptions } from '../../core.exports'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'
import { type ArtworkInterpolationTypes, type ArtworkImageFormatTypes, getTPLHeader, imgFileStat } from '../../lib.exports'

export interface ImageConverterOptions {
  /** The width of the converted image file. Default is `256`. */
  width?: number
  /** The height of the converted image file. Default is `256`. */
  height?: number
  /** The interpolation of the output file in case of scaling. Default if `'bilinear'` (Bilinear). */
  interpolation?: ArtworkInterpolationTypes
  /** The quality ratio of the image on lossy codecs (like JPEG). Default is `100` (Lossless on WEBP). */
  quality?: number
}

/**
 * Python script: Asynchronously converts an image file `Buffer` to an image file.
 * - - - -
 * @param {Buffer} buf The buffer of the image file.
 * @param {FilePathLikeTypes} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes | undefined} toFormat The desired image format of the new image file. Default is `'png'`.
 * @param {ImageConverterOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<FilePath>}
 */
export const bufferConverter = async (buf: Buffer, destPath: FilePathLikeTypes, toFormat: ArtworkImageFormatTypes = 'png', options?: ImageConverterOptions): Promise<FilePath> => {
  const opts = setDefaultOptions<NonNullable<typeof options>>(
    {
      height: 256,
      width: 256,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )

  const dest = FilePath.of(pathLikeToString(destPath))
  return new Promise<FilePath>((resolve, reject) => {
    const moduleName = `buffer_converter.py`
    const pyPath = FilePath.of(RBTools.python.path, moduleName)
    const process = spawn('python', [moduleName], { cwd: pyPath.root, windowsHide: true })
    const base64Str = buf.toString('base64')

    let stderrData = ''

    process.stderr.on('data', (data: Buffer) => {
      stderrData += data.toString()
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve(dest)
      } else if (code === null) {
        reject(new PythonExecutionError(`Python script exited with unknown code: ${stderrData}`))
      } else {
        reject(new PythonExecutionError(`Python script exited with code ${code.toString()}: ${stderrData}`))
      }
    })

    process.stdin.write(JSON.stringify({ buf: base64Str, dest: dest.changeFileExt(toFormat).path, width: opts.width, height: opts.height, interpolation: opts.interpolation.toUpperCase(), quality: opts.quality }))
    process.stdin.end() // Close stdin to signal that the input is complete
  })
}

/**
 * Python script: Asynchronously converts an image file to any other image file format.
 *
 * If no _options_ argument is given, the image converter will return a 256x256 pixels size image file.
 * - - - -
 * @param {FilePathLikeTypes} srcFile The path of the image to want to convert.
 * @param {FilePathLikeTypes} destPath The path of the new converted image file.
 * @param {ArtworkImageFormatTypes} toFormat The desired image format of the new image file.
 * @param {ImageConverterOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<FilePath>}
 */
export const imageConverter = async (srcFile: FilePathLikeTypes, destPath: FilePathLikeTypes, toFormat: ArtworkImageFormatTypes, options?: ImageConverterOptions): Promise<FilePath> => {
  const opts = setDefaultOptions<NonNullable<typeof options>>(
    {
      height: 256,
      width: 256,
      interpolation: 'bilinear',
      quality: 100,
    },
    options
  )
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))
  await dest.delete()

  const moduleName = 'image_converter.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const command = `python ${moduleName} "${src.path}" "${dest.changeFileExt(toFormat).path}" -x ${opts.width.toString()} -y ${opts.height.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}

/**
 * Python script: Asynchronously returns a Base64-encoded DataURL `string` of the image file.
 * - - - -
 * @param {FilePathLikeTypes} srcFile The path to the image file.
 * @param {ConvertToWEBPDataURLOptions} options `OPTIONAL` An object with values that changes the behavior of the converting process.
 * @returns {Promise<string>}
 */
export const webpDataURL = async (srcFile: FilePathLikeTypes, options?: ConvertToWEBPDataURLOptions): Promise<string> => {
  const opts = setDefaultOptions<NonNullable<typeof options>>(
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

  const src = FilePath.of(pathLikeToString(srcFile))
  const moduleName = 'webp_data_url.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const command = `python ${moduleName} "${src.path}" -x ${usedWidth.toString()} -y ${usedHeight.toString()} -i ${opts.interpolation.toUpperCase()} -q ${opts.quality.toString()}`
  const { stdout, stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
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
    const pyPath = FilePath.of(RBTools.python.path, moduleName)
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
 * @param {FilePathLikeTypes} srcFile The path of the PNG_WII file.
 * @returns {Promise<string>}
 */
export const webpDataURLPNGWii = async (srcFile: FilePathLikeTypes): Promise<string> => {
  const src = FilePath.of(pathLikeToString(srcFile))
  const usedHeader = await getTPLHeader(src)
  const base64Header = usedHeader.data.toString('base64')
  const moduleName = 'webp_data_url_pngwii.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const command = `python ${moduleName} "${src.path}" -tpl "${base64Header}"`
  const { stdout, stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)
  const [, dataurl] = stdout.split('\r\n')
  return dataurl
}
