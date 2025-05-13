import { DirPath, execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'

/**
 * Python script: Asynchronously extracts the CON file contents and returns the folder path where all contents were extracted.
 * - - - -
 * @param {FilePathLikeTypes} stfsFilePath The path of the CON file.
 * @param {FilePathLikeTypes} destPath The folder path where you want the files to be extracted to.
 * @returns {Promise<DirPath>}
 */
export const stfsExtract = async (stfsFilePath: FilePathLikeTypes, destPath: FilePathLikeTypes): Promise<DirPath> => {
  const moduleName = 'stfs_extract.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(stfsFilePath))
  const dest = DirPath.of(pathLikeToString(destPath))

  if (dest.exists) await dest.deleteDir()
  await dest.mkDir()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}

/**
 * Python script: Asynchronously extracts all files from a CON file on the root directory of the
 * destination path and returns the folder path where all contents were extracted.
 * - - - -
 * @param {FilePathLikeTypes} stfsFilePath The path of the CON file.
 * @param {FilePathLikeTypes} destPath The folder path where you want the files to be extracted to.
 * @returns {Promise<DirPath>}
 */
export const stfsExtractAllFiles = async (stfsFilePath: FilePathLikeTypes, destPath: FilePathLikeTypes): Promise<DirPath> => {
  const moduleName = 'stfs_extract_all_files.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(stfsFilePath))
  const dest = DirPath.of(pathLikeToString(destPath))

  if (dest.exists) await dest.deleteDir()
  await dest.mkDir()

  const command = `python ${moduleName} "${src.path}" "${dest.path}"`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
