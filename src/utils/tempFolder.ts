import Path from 'path-js'
import { decodeFileURL } from '../utils.js'

const __filename = decodeFileURL(import.meta.url)
const __dirname = new Path(__filename).root
/**
 * Initiates a temporary folder inside the `rbtools-js` package, or uses another temp folder given as argument.
 * - - - -
 * @param {string | null | undefined} tempPath The temp folder you want to use.
 * @returns {Path} The path of the temporary folder.
 */
export const tempFolderInit = async (tempPath?: string | null): Promise<Path> => {
  const temp = new Path(typeof tempPath === 'string' ? Path.resolve(tempPath) : Path.resolve(__dirname, '../../temp'))
  if (!temp.exists()) await temp.mkDir()

  return temp
}
