import { execSync } from 'child_process'
import Path, { type StringOrPath } from 'path-js'
import type { MOGGFileStatRawObject } from '../../core.js'
import { PythonExecutionError } from '../../errors.js'
import { __root } from '../../index.js'
import { execPromise } from '../../lib.js'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the MOGG file.
 * - - - -
 * @param {StringOrPath} moggFilePath The path of the MOGG file.
 * @returns {Promise<MOGGFileStatRawObject>}
 */
export const moggFileStat = async (moggFilePath: StringOrPath): Promise<MOGGFileStatRawObject> => {
  const moduleName = 'mogg_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = Path.stringToPath(moggFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as MOGGFileStatRawObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the MOGG file.
 * - - - -
 * @param {StringOrPath} moggFilePath The path of the MOGG file.
 * @returns {MOGGFileStatRawObject}
 */
export const moggFileStatSync = (moggFilePath: StringOrPath): MOGGFileStatRawObject => {
  const moduleName = 'mogg_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = Path.stringToPath(moggFilePath)
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as MOGGFileStatRawObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
