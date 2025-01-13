import { execSync } from 'node:child_process'
import Path, { type StringOrPath } from 'path-js'
import type { ImgFileStatReturnObject } from '../../core.js'
import { PythonExecutionError } from '../../errors.js'
import { __root } from '../../index.js'
import { execPromise } from '../execPromise.js'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the image file.
 * - - - -
 * @param {StringOrPath} imageFilePath The path of the image file.
 * @returns {Promise<ImgFileStatReturnObject>}
 */
export const imgFileStat = async (imageFilePath: StringOrPath): Promise<ImgFileStatReturnObject> => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(__root, `./python/${moduleName}`)
  const src = Path.stringToPath(imageFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as ImgFileStatReturnObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the image file.
 * - - - -
 * @param {StringOrPath} imageFilePath The path of the image file.
 * @returns {ImgFileStatReturnObject}
 */
export const imgFileStatSync = (imageFilePath: StringOrPath): ImgFileStatReturnObject => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(__root, `./python/${moduleName}`)
  const src = Path.stringToPath(imageFilePath)
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as ImgFileStatReturnObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
