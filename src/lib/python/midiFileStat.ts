import { execSync } from 'child_process'
import { execAsync, FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import type { MIDIFileStatObject } from '../../core.exports'
import { PythonExecutionError } from '../../errors'
import { RBTools } from '../../index'

/**
 * Python script: Asynchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {FilePathLikeTypes} midiFilePath The path of the MIDI file.
 * @returns {Promise<MIDIFileStatObject>}
 */
export const midiFileStat = async (midiFilePath: FilePathLikeTypes): Promise<MIDIFileStatObject> => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(midiFilePath))
  const command = `python ${moduleName} "${src.path}"`
  const { stderr, stdout } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return JSON.parse(stdout) as MIDIFileStatObject
}

/**
 * Python script: Synchronously prints a JSON object with the statistics of the MIDI file.
 * - - - -
 * @param {FilePathLikeTypes} midiFilePath The path of the MIDI file.
 * @returns {MIDIFileStatObject}
 */
export const midiFileStatSync = (midiFilePath: FilePathLikeTypes): MIDIFileStatObject => {
  const moduleName = 'midi_file_stat.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const src = FilePath.of(pathLikeToString(midiFilePath))
  const command = `python ${moduleName} "${src.path}"`

  try {
    return JSON.parse(execSync(command, { windowsHide: true, cwd: pyPath.root }).toString()) as MIDIFileStatObject
  } catch (err) {
    if (err instanceof Error) throw new PythonExecutionError(err.message)
    else throw err
  }
}
