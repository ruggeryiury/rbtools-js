import { execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'

/**
 * Python script: Asynchronously swaps the bytes of `PNG_XBOX` or `PNG_PS3` texture files.
 * - - - -
 * @param {FilePathLikeTypes} srcPath The path of the texture file you want to swap its bytes.
 * @param {FilePathLikeTypes} destPath The destination path of the new texture file.
 * @returns {Promise<FilePath>}
 */
export const swapRBArtBytes = async (srcPath: FilePathLikeTypes, destPath: FilePathLikeTypes): Promise<FilePath> => {
  const moduleName = 'swap_rb_art_bytes.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(srcPath))
  const dest = FilePath.of(pathLikeToString(destPath))
  await dest.delete()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
