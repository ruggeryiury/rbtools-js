import { execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { ExecutableError } from '../../errors'
import { RBTools } from '../../index'

/**
 * Asynchronously executes the MakeMogg application.
 * - - - -
 * @param {FilePathLikeTypes} srcFile The path to the TPL file to be converted.
 * @param {FilePathLikeTypes} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const MakeMogg = async (srcFile: FilePathLikeTypes, destPath: FilePathLikeTypes): Promise<string> => {
  const moduleName = 'makemogg.exe'
  const exePath = FilePath.of(RBTools.bin.path, moduleName)
  const src = FilePath.of(pathLikeToString(srcFile))
  const dest = FilePath.of(pathLikeToString(destPath))

  const command = `${moduleName} "${src.path}" -m "${dest.path}"`
  const { stderr, stdout } = await execAsync(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
