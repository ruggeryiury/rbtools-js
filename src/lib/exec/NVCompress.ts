import { Path, type PathLikeTypes } from 'path-js'
import { ExecutableError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../execPromise'

/**
 * Asynchronously executes the NVIDIA Texture Tools.
 *
 * _NVIDIA Texture Tools converts any image file format to DDS image files._
 * - - - -
 * @param {PathLikeTypes} srcFile The path to the image file to be converted.
 * @param {PathLikeTypes} destPath The path to the new converted DDS file.
 * @param {boolean} DTX5 `OPTIONAL` Uses DTX5 encoding. Default is `true`.
 * @param {boolean} mipMap `OPTIONAL` Uses MipMap on the DDS texture (needed for album artworks). Default is `true`.
 * @returns {Promise<string>}
 */
export const NVCompress = async (srcFile: PathLikeTypes, destPath: PathLikeTypes, DTX5 = true, mipMap = true): Promise<string> => {
  const moduleName = 'nvcompress.exe'
  const exePath = new Path(RBTools.getBinPath().path, moduleName)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} -nocuda ${mipMap ? '' : '-nomips'} ${DTX5 ? ' -bc3' : ' -bc1'} "${src.path}" "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
