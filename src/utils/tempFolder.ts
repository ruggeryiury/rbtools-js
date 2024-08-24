import Path from 'path-js'
import { decodeFileURL } from '../utils.js'

const __filename = decodeFileURL(import.meta.url)
const __dirname = new Path(__filename).root
/**
 * Initiates the `temp` folder inside the `rbtools-js` package.
 * - - - -
 * @returns {Path} The path of the temporary folder.
 */
export const tempFolderInit = async (): Promise<Path> => {
  const temp = new Path(Path.resolve(__dirname, '../../temp'))
  if (!temp.exists()) await temp.mkDir()

  return temp
}
