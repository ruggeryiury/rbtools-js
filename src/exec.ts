import Path, { type StringOrPath } from 'path-js'
import { ExecutableError } from './errors.js'
import { execPromise } from './lib.js'
import { __root } from './index.js'

/**
 * Asynchronously executes the NVIDIA Texture Tools.
 *
 * _NVIDIA Texture Tools converts any image file format to DDS image files._
 * - - - -
 * @param {StringOrPath} srcFile The path to the image file to be converted.
 * @param {StringOrPath} destPath The path to the new converted DDS file.
 * @param {boolean} DTX5 `OPTIONAL` Uses DTX5 encoding. Default is `true`.
 * @param {boolean} mipMap `OPTIONAL` Uses MipMap on the DDS texture (needed for album artworks). Default is `true`.
 * @returns {Promise<string>}
 */
export const NVCompress = async (srcFile: StringOrPath, destPath: StringOrPath, DTX5 = true, mipMap = true): Promise<string> => {
  const moduleName = 'nvcompress.exe'
  const exePath = new Path(__root, `./bin/${moduleName}`)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} -nocuda ${mipMap ? '' : '-nomips'} ${DTX5 ? ' -bc3' : ' -bc1'} "${src.path}" "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}

/**
 * Asynchronously executes the Wiimms Image Tool encoder.
 * - - - -
 * @param {StringOrPath} srcFile The path to the image file to be converted.
 * @param {StringOrPath} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const WimgtEnc = async (srcFile: StringOrPath, destPath: StringOrPath): Promise<string> => {
  const moduleName = 'wimgt.exe'
  const exePath = new Path(__root, `./bin/${moduleName}`)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} -d "${dest.path}" ENC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}

/**
 * Asynchronously executes the Wiimms Image Tool decoder.
 * - - - -
 * @param {StringOrPath} srcFile The path to the TPL file to be converted.
 * @param {StringOrPath} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const WimgtDec = async (srcFile: StringOrPath, destPath: StringOrPath): Promise<string> => {
  const moduleName = 'wimgt.exe'
  const exePath = new Path(__root, `./bin/${moduleName}`)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} -d "${dest.path}" DEC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}

/**
 * Asynchronously executes the MakeMogg application.
 * - - - -
 * @param {StringOrPath} srcFile The path to the TPL file to be converted.
 * @param {StringOrPath} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const MakeMogg = async (srcFile: StringOrPath, destPath: StringOrPath): Promise<string> => {
  const moduleName = 'makemogg.exe'
  const exePath = new Path(__root, `./bin/${moduleName}`)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} "${src.path}" -m "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
