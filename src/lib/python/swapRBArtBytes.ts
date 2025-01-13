import Path, { type StringOrPath } from 'path-js'
import { PythonExecutionError } from '../../errors.js'
import { __root } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously swaps the bytes of `PNG_XBOX` or `PNG_PS3` texture files.
 * - - - -
 * @param {StringOrPath} srcPath The path of the texture file you want to swap its bytes.
 * @param {StringOrPath} destPath The destination path of the new texture file.
 * @returns {Promise<Path>}
 */
export const swapRBArtBytes = async (srcPath: StringOrPath, destPath: StringOrPath): Promise<Path> => {
  const moduleName = 'swap_rb_art_bytes.py'
  const pyPath = new Path(__root, `./python/${moduleName}`)
  const src = Path.stringToPath(srcPath)
  const dest = Path.stringToPath(destPath)
  await dest.checkThenDeleteFile()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
