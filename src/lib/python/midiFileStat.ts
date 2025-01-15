import { execSync } from 'child_process'
import Path, { type StringOrPath } from 'path-js'
import type { MIDIFileStatObject } from '../../core.js'
import { PythonExecutionError } from '../../errors.js'
import { __root } from '../../index.js'
import { execPromise } from '../execPromise.js'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {StringOrPath} midiFilePath The path of the MIDI file.
 * @returns {Promise<MIDIFileStatReturnObject>}
 */
export const midiFileStat = async (midiFilePath: StringOrPath): Promise<MIDIFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = Path.stringToPath(midiFilePath)
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as MIDIFileStatObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {StringOrPath} midiFilePath The path of the MIDI file.
 * @returns {MIDIFileStatObject}
 */
export const midiFileStatSync = (midiFilePath: StringOrPath): MIDIFileStatObject => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = new Path(__root.path, `./python/${moduleName}`)
  const src = Path.stringToPath(midiFilePath)
  const command = `python ${moduleName} "${src.path}"`

  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as MIDIFileStatObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
