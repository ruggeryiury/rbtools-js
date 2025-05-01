import { FilePath, type PathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { ExecutableError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../utils/execPromise'

/**
 * Asynchronously executes the MakeMogg application.
 * - - - -
 * @param {PathLikeTypes} srcFile The path to the TPL file to be converted.
 * @param {PathLikeTypes} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const MakeMogg = async (srcFile: PathLikeTypes, destPath: PathLikeTypes): Promise<string> => {
  const moduleName = 'makemogg.exe'
  const exePath = FilePath.of(RBTools.bin.path, moduleName)
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))

  const command = `${moduleName} "${src.path}" -m "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
