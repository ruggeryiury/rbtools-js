import { Path, type PathLikeTypes } from 'path-js'
import { ExecutableError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../execPromise'

/**
 * Asynchronously executes the Wiimms Image Tool decoder.
 * - - - -
 * @param {PathLikeTypes} srcFile The path to the TPL file to be converted.
 * @param {PathLikeTypes} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const WimgtDec = async (srcFile: PathLikeTypes, destPath: PathLikeTypes): Promise<string> => {
  const moduleName = 'wimgt.exe'
  const exePath = new Path(RBTools.getBinPath().path, moduleName)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} -d "${dest.path}" DEC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
