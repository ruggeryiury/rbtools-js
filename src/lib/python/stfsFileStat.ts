import { execSync } from 'child_process'
import Path, { type StringOrPath } from 'path-js'
import type { STFSFileStatRawObject } from '../../core.js'
import { PythonExecutionError } from '../../errors.js'
import { __root } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the CON file.
 * - - - -
 * @param {StringOrPath} stfsFilePath The path of the CON file.
 * @returns {Promise<STFSFileStatRawObject>}
 */
export const stfsFileStat = async (stfsFilePath: StringOrPath): Promise<STFSFileStatRawObject> => {
  const moduleName = 'stfs_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = Path.stringToPath(stfsFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as STFSFileStatRawObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the CON file.
 * - - - -
 * @param {StringOrPath} stfsFilePath The path of the CON file.
 * @returns {STFSFileStatRawObject}
 */
export const stfsFileStatSync = (stfsFilePath: StringOrPath): STFSFileStatRawObject => {
  const moduleName = 'stfs_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = Path.stringToPath(stfsFilePath)
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as STFSFileStatRawObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
