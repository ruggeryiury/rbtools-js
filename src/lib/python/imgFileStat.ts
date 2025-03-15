import { execSync } from 'node:child_process'
import { Path, type PathLikeTypes } from 'path-js'
import type { ImgFileStatReturnObject } from '../../core'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../execPromise'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the image file.
 * - - - -
 * @param {PathLikeTypes} imageFilePath The path of the image file.
 * @returns {Promise<ImgFileStatReturnObject>}
 */
export const imgFileStat = async (imageFilePath: PathLikeTypes): Promise<ImgFileStatReturnObject> => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(imageFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as ImgFileStatReturnObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the image file.
 * - - - -
 * @param {PathLikeTypes} imageFilePath The path of the image file.
 * @returns {ImgFileStatReturnObject}
 */
export const imgFileStatSync = (imageFilePath: PathLikeTypes): ImgFileStatReturnObject => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(imageFilePath)
  const command = `python ${moduleName} "${src.path}"`
  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as ImgFileStatReturnObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
