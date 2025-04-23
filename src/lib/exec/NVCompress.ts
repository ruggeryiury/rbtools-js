import { FilePath, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import { ExecutableError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../utils/execPromise'

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
  const exePath = FilePath.of(RBTools.bin.path, moduleName)
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))

  const command = `${moduleName} -nocuda ${mipMap ? '' : '-nomips'} ${DTX5 ? ' -bc3' : ' -bc1'} "${src.path}" "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
