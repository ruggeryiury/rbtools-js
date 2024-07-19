import Path from 'path-js'

/**
 * Initiates the `temp` folder inside the `rbtools-js` package.
 * - - - -
 * @returns {Path} The path of the temporary folder.
 */
export const tempFolderInit = async (): Promise<Path> => {
  const temp = new Path(Path.resolve(process.cwd(), 'temp'))
  if (!temp.exists()) await temp.mkDir()

  return temp
}
