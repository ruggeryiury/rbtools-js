import Path from 'path-js'
import type { ImgFileStatReturnObject, MidiFileStatObject } from './core.js'
import { decodeFileURL, execPromise } from './lib.js'

const __filename = decodeFileURL(import.meta.url)
const __dirname = new Path(__filename).root

export const imgFileStat = async (filePath: string): Promise<ImgFileStatReturnObject> => {
  const moduleName = 'img_file_stat.py'
  const pyPath = new Path(Path.resolve(__dirname, `./python/${moduleName}`))
  const xFile = new Path(filePath)
  const command = `python ${moduleName} "${xFile.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return JSON.parse(stdout) as ImgFileStatReturnObject
}

export const midiFileStat = async (filePath: string): Promise<MidiFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(Path.resolve(__dirname, `./python/${moduleName}`))
  const xFile = new Path(filePath)
  const command = `python ${moduleName} "${xFile.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new Error(stderr)

  return JSON.parse(stdout) as MidiFileStatObject
}
