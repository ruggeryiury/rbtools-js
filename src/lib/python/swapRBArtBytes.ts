import { FilePath, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../../lib'

/**
 * Python script: Asynchronously swaps the bytes of `PNG_XBOX` or `PNG_PS3` texture files.
 * - - - -
 * @param {PathLikeTypes} srcPath The path of the texture file you want to swap its bytes.
 * @param {PathLikeTypes} destPath The destination path of the new texture file.
 * @returns {Promise<Path>}
 */
export const swapRBArtBytes = async (srcPath: PathLikeTypes, destPath: PathLikeTypes): Promise<FilePath> => {
  const moduleName = 'swap_rb_art_bytes.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(srcPath))
  const dest = FilePath.of(pathLikeToString(destPath))
  await dest.delete()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
