import Path, { type PathLikeTypes } from 'path-js'
import { PythonExecutionError } from '../../errors.js'
import { RBTools } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously swaps the bytes of `PNG_XBOX` or `PNG_PS3` texture files.
 * - - - -
 * @param {PathLikeTypes} srcPath The path of the texture file you want to swap its bytes.
 * @param {PathLikeTypes} destPath The destination path of the new texture file.
 * @returns {Promise<Path>}
 */
export const swapRBArtBytes = async (srcPath: PathLikeTypes, destPath: PathLikeTypes): Promise<Path> => {
  const moduleName = 'swap_rb_art_bytes.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(srcPath)
  const dest = Path.stringToPath(destPath)
  await dest.checkThenDeleteFile()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
