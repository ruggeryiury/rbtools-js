import { fileURLToPath } from 'node:url'
import Path from 'path-js'

export * from './database.js'
export * from './dta.js'
export * from './magma.js'
export * from './utils.js'

/**
 * Returns the path of the `src` folder (in development), or the `dist` folder (in production)
 * - - - -
 * @returns {string} The root of the package as string.
 */
export const getRBToolsJSPath = (): string => {
  return new Path(Path.resolve(decodeURIComponent(fileURLToPath(import.meta.url)), '../')).path
}
