import { execSync } from 'child_process'
import Path, { type PathLikeTypes } from 'path-js'
import type { MOGGFileStatRawObject } from '../../core.js'
import { PythonExecutionError } from '../../errors.js'
import { RBTools } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the MOGG file.
 * - - - -
 * @param {PathLikeTypes} moggFilePath The path of the MOGG file.
 * @returns {Promise<MOGGFileStatRawObject>}
 */
export const moggFileStat = async (moggFilePath: PathLikeTypes): Promise<MOGGFileStatRawObject> => {
  const moduleName = 'mogg_file_stat.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(moggFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as MOGGFileStatRawObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the MOGG file.
 * - - - -
 * @param {PathLikeTypes} moggFilePath The path of the MOGG file.
 * @returns {MOGGFileStatRawObject}
 */
export const moggFileStatSync = (moggFilePath: PathLikeTypes): MOGGFileStatRawObject => {
  const moduleName = 'mogg_file_stat.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(moggFilePath)
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as MOGGFileStatRawObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
