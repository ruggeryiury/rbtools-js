import Path, { type PathLikeTypes } from 'path-js'
import { PythonExecutionError } from '../../errors.js'
import { RBTools } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously extracts the CON file contents and returns the folder path where all contents were extracted.
 * - - - -
 * @param {PathLikeTypes} stfsFilePath The path of the CON file.
 * @param {PathLikeTypes} destPath The folder path where you want the files to be extracted to.
 * @returns {Promise<Path>}
 */
export const stfsExtract = async (stfsFilePath: PathLikeTypes, destPath: PathLikeTypes): Promise<Path> => {
  const moduleName = 'stfs_extract.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(stfsFilePath)
  const dest = Path.stringToPath(destPath)

  if (dest.exists()) await dest.deleteDir()
  await dest.mkDir()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}

/**
 * Python script: Asynchronously extracts all files from a CON file on the root directory of the
 * destination path and returns the folder path where all contents were extracted.
 * - - - -
 * @param {PathLikeTypes} stfsFilePath The path of the CON file.
 * @param {PathLikeTypes} destPath The folder path where you want the files to be extracted to.
 * @returns {Promise<Path>}
 */
export const stfsExtractAllFiles = async (stfsFilePath: PathLikeTypes, destPath: PathLikeTypes): Promise<Path> => {
  const moduleName = 'stfs_extract_all_files.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(stfsFilePath)
  const dest = Path.stringToPath(destPath)

  if (dest.exists()) await dest.deleteDir()
  await dest.mkDir()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
