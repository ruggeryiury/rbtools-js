import { execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'

/**
 * Python script: Asynchronously decrypts a MOGG file and returns the new decrypted MOGG file path.
 * - - - -
 * @param {FilePathLikeTypes} moggFilePath The path of the MOGG file.
 * @param {FilePathLikeTypes} destPath The new decrypted MOGG file path
 * @returns {Promise<FilePath>}
 */
export const moggDecrypt = async (moggFilePath: FilePathLikeTypes, destPath: FilePathLikeTypes): Promise<FilePath> => {
  const moduleName = 'mogg_decrypt.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(moggFilePath))
  const dest = FilePath.of(pathLikeToString(destPath))
  await dest.delete()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
