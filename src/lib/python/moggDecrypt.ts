import { FilePath, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../../lib'

/**
 * Python script: Asynchronously decrypts a MOGG file and returns the new decrypted MOGG file path.
 * - - - -
 * @param {PathLikeTypes} moggFilePath The path of the MOGG file.
 * @param {PathLikeTypes} destPath The new decrypted MOGG file path
 * @returns {Promise<Path>}
 */
export const moggDecrypt = async (moggFilePath: PathLikeTypes, destPath: PathLikeTypes): Promise<FilePath> => {
  const moduleName = 'mogg_decrypt.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(moggFilePath))
  const dest = FilePath.of(pathLikeToString(destPath))
  await dest.delete()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
