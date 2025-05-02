import { FilePath } from 'node-lib'
import { pathLikeToString, type FilePathJSONRepresentation, type PathLikeTypes } from 'node-lib'
import { MIDIFileError } from '../errors'
import { midiFileStat, midiFileStatSync } from '../lib.exports'

export interface MIDIFileStatObject {
  /** The charset of the MIDI file. */
  charset: string
  /** The MIDI file type. */
  midiType: number
  /** The ticks per beat of the MIDI file. */
  ticksPerBeat: number
  /** An array with the name of all available tracks on the MIDI file. */
  tracks: string[]
}

export interface MIDIFileJSONObject extends FilePathJSONRepresentation {
  /** The statistics of the MIDI file. */
  file: MIDIFileStatObject
}

/**
 * MIDIFile is a class that represents a MIDI file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class MIDIFile {
  /** The path of the MIDI file. */
  path: FilePath

  /**
   * @param {PathLikeTypes} midiFilePath The path to the MIDI file.
   */
  constructor(midiFilePath: PathLikeTypes) {
    this.path = FilePath.of(pathLikeToString(midiFilePath))

    this.checkExistence()
  }

  /**
   * Checks if a path resolves to an existing MIDI file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists) throw new MIDIFileError(`MIDI file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * Returns a JSON object with statistics of the MIDI file.
   * - - - -
   * @returns {MIDIFileStatObject}
   */
  statSync(): MIDIFileStatObject {
    this.checkExistence()
    return midiFileStatSync(this.path.path)
  }

  /**
   * Asynchronously returns a JSON object with statistics of the MIDI file.
   * - - - -
   * @returns {Promise<MIDIFileStatObject>}
   */
  async stat(): Promise<MIDIFileStatObject> {
    this.checkExistence()
    return await midiFileStat(this.path.path)
  }

  /**
   * Returns a JSON representation of the MIDI file class.
   * - - - -
   * @returns {MIDIFileJSONObject}
   */
  toJSONSync(): MIDIFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.statSync(),
    }
  }

  /**
   * Asynchronously returns a JSON representation of the MIDI file class.
   * - - - -
   * @returns {Promise<MIDIFileJSONObject>}
   */
  async toJSON(): Promise<MIDIFileJSONObject> {
    return {
      ...this.path.toJSON(),
      file: await this.stat(),
    }
  }
}
