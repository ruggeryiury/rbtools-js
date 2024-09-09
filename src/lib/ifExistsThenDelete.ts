import Path from 'path-js'

export const ifExistsThenDelete = async (path: Path): Promise<Path> => {
  if (path.exists()) await path.deleteFile()
  return path
}
