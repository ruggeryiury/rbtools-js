import Path, { type PathLikeTypes } from 'path-js'
import { ExecutableError } from '../../errors.js'
import { RBTools } from '../../index.js'
import { execPromise } from '../execPromise.js'

/**
 * Asynchronously executes the MakeMogg application.
 * - - - -
 * @param {PathLikeTypes} srcFile The path to the TPL file to be converted.
 * @param {PathLikeTypes} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const MakeMogg = async (srcFile: PathLikeTypes, destPath: PathLikeTypes): Promise<string> => {
  const moduleName = 'makemogg.exe'
  const exePath = new Path(RBTools.getBinPath().path, moduleName)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} "${src.path}" -m "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
