import Path from 'path-js'

export interface TempFolderInitReturnObject {
  path: string
}
export const tempFolderInit = async () => {
  const temp = new Path(Path.resolve(process.cwd(), 'temp'))
  if (!temp.exists()) await temp.mkDir()

  return {
    path: temp.path,
  }
}
