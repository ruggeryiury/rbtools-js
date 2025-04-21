import { execSync } from 'child_process'
import { FilePath, type PathLikeTypes } from 'path-js'
import { pathLikeToString } from 'path-js/lib'
import type { STFSFileStatRawObject } from '../../core'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../../lib'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the CON file.
 * - - - -
 * @param {PathLikeTypes} stfsFilePath The path of the CON file.
 * @returns {Promise<STFSFileStatRawObject>}
 */
export const stfsFileStat = async (stfsFilePath: PathLikeTypes): Promise<STFSFileStatRawObject> => {
  const moduleName = 'stfs_file_stat.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(stfsFilePath))
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as STFSFileStatRawObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the CON file.
 * - - - -
 * @param {PathLikeTypes} stfsFilePath The path of the CON file.
 * @returns {STFSFileStatRawObject}
 */
export const stfsFileStatSync = (stfsFilePath: PathLikeTypes): STFSFileStatRawObject => {
  const moduleName = 'stfs_file_stat.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(stfsFilePath))
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as STFSFileStatRawObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
