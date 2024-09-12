import Path from 'path-js'

/**
 * Utility function that evaluates path-like variables to an instantiated `Path` class.
 * - - - -
 * @param {string | Path} path Any path as string or an instantiated `Path` class.
 * @returns {Path} An instantiated `Path` class.
 */
export const stringToPath = (path: string | Path): Path => {
  if (path instanceof Path) return path
  else return new Path(path)
}
