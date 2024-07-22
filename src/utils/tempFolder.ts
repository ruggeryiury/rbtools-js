import Path from 'path-js'
import { getRBToolsJSPath } from '../index.js'

/**
 * Initiates the `temp` folder inside the `rbtools-js` package.
 * - - - -
 * @returns {Path} The path of the temporary folder.
 */
export const tempFolderInit = async (): Promise<Path> => {
  const temp = new Path(Path.resolve(getRBToolsJSPath(), '../temp'))
  if (!temp.exists()) await temp.mkDir()

  return temp
}
