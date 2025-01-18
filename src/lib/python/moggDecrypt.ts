import Path, { type PathLikeTypes } from 'path-js'
import { PythonExecutionError } from '../../errors.js'
import { RBTools } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously decrypts a MOGG file and returns the new decrypted MOGG file path.
 * - - - -
 * @param {PathLikeTypes} moggFilePath The path of the MOGG file.
 * @param {PathLikeTypes} destPath The new decrypted MOGG file path
 * @returns {Promise<Path>}
 */
export const moggDecrypt = async (moggFilePath: PathLikeTypes, destPath: PathLikeTypes): Promise<Path> => {
  const moduleName = 'mogg_decrypt.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(moggFilePath)
  const dest = Path.stringToPath(destPath)
  await dest.checkThenDeleteFile()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
