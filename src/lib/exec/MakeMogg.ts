import Path, { type StringOrPath } from 'path-js'
import { ExecutableError } from '../../errors.js'
import { __root } from '../../index.js'
import { execPromise } from '../execPromise.js'

/**
 * Asynchronously executes the MakeMogg application.
 * - - - -
 * @param {StringOrPath} srcFile The path to the TPL file to be converted.
 * @param {StringOrPath} destPath The path to the new converted TPL file.
 * @returns {Promise<string>}
 */
export const MakeMogg = async (srcFile: StringOrPath, destPath: StringOrPath): Promise<string> => {
  const moduleName = 'makemogg.exe'
  const exePath = new Path(__root, `./bin/${moduleName}`)
  const src = Path.stringToPath(srcFile)
  const dest = Path.stringToPath(destPath)

  const command = `${moduleName} "${src.path}" -m "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
  if (stderr) throw new ExecutableError(stderr)
  return stdout
}
