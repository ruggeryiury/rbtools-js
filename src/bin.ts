import Path from 'path-js'
import { BinaryExecutionError } from './errors.js'
import { execPromise, stringToPath } from './lib.js'
import { __root } from './index.js'

/**
 * Asynchronously executes the NVIDIA Texture Tools.
 *
 * _NVIDIA Texture Tools converts any image file format to DDS image files._
 * - - - -
 * @param {string | Path} srcFile The path to the image file to be converted.
 * @param {string | Path} destPath The path to the new converted DDS file.
 * @param {boolean} DTX5 `OPTIONAL` Uses DTX5 encoding. Default is `true`.
 * @returns {Promise<string>}
 */
export const NVCompress = async (srcFile: string | Path, destPath: string | Path, DTX5 = true): Promise<string> => {
  const moduleName = 'nvcompress.exe'
  const binPath = new Path(__root.path, `./bin/${moduleName}`)
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)

  const command = `${moduleName} -nomips -nocuda ${DTX5 ? ' -bc3' : ' -bc1'} "${src.path}" "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: binPath.root, windowsHide: true })
  if (stderr) throw new BinaryExecutionError(stderr)
  return stdout
}

/**
 * Asynchronously executes the Wiimms Image Tool encoder.
 * - - - -
 * @param {string | Path} srcFile The path to the image file to be converted.
 * @param {string | Path} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const WimgtEnc = async (srcFile: string | Path, destPath: string | Path): Promise<string> => {
  const moduleName = 'wimgt.exe'
  const binPath = new Path(__root.path, `./bin/${moduleName}`)
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)

  const command = `${moduleName} -d "${dest.path}" ENC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: binPath.root, windowsHide: true })
  if (stderr) throw new BinaryExecutionError(stderr)
  return stdout
}

/**
 * Asynchronously executes the Wiimms Image Tool decoder.
 * - - - -
 * @param {string | Path} srcFile The path to the TPL file to be converted.
 * @param {string | Path} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const WimgtDec = async (srcFile: string | Path, destPath: string | Path): Promise<string> => {
  const moduleName = 'wimgt.exe'
  const binPath = new Path(__root.path, `./bin/${moduleName}`)
  const src = stringToPath(srcFile)
  const dest = stringToPath(destPath)

  const command = `${moduleName} -d "${dest.path}" DEC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: binPath.root, windowsHide: true })
  if (stderr) throw new BinaryExecutionError(stderr)
  return stdout
}
