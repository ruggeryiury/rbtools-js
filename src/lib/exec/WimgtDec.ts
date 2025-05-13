import { execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { ExecutableError } from '../../errors'
import { RBTools } from '../../index'

/**
 * Asynchronously executes the Wiimms Image Tool decoder.
 * - - - -
 * @param {FilePathLikeTypes} srcFile The path to the TPL file to be converted.
 * @param {FilePathLikeTypes} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const WimgtDec = async (srcFile: FilePathLikeTypes, destPath: FilePathLikeTypes): Promise<string> => {
  const moduleName = 'wimgt.exe'
  const exePath = FilePath.of(RBTools.bin.path, moduleName)
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))

  const command = `${moduleName} -d "${dest.path}" DEC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execAsync(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
