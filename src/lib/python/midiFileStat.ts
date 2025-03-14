import { execSync } from 'child_process'
import { Path, type PathLikeTypes } from 'path-js'
import type { MIDIFileStatObject } from '../../core'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../execPromise'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {PathLikeTypes} midiFilePath The path of the MIDI file.
 * @returns {Promise<MIDIFileStatObject>}
 */
export const midiFileStat = async (midiFilePath: PathLikeTypes): Promise<MIDIFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(midiFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as MIDIFileStatObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {PathLikeTypes} midiFilePath The path of the MIDI file.
 * @returns {MIDIFileStatObject}
 */
export const midiFileStatSync = (midiFilePath: PathLikeTypes): MIDIFileStatObject => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const src = Path.stringToPath(midiFilePath)
  const command = `python ${moduleName} "${src.path}"`

  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as MIDIFileStatObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
