import Path, { type PathJSONRepresentation, type StringOrPath } from 'path-js'
import { MIDIFileError } from '../errors.js'
import * as Py from '../python.js'

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

export interface MIDIFileJSONObject extends PathJSONRepresentation {
  /** The statistics of the MIDI file. */
  file: MIDIFileStatObject
}

/**
 * MIDIFile is a class that represents a MIDI file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.
 * - - - -
 */
export class MIDIFile {
  /** The path of the MIDI file. */
  path: Path

  /**
   * @param {StringOrPath} midiFilePath The path to the MIDI file.
   */
  constructor(midiFilePath: StringOrPath) {
    const path = Path.stringToPath(midiFilePath)
    this.path = path

    this.checkExistence()
  }

  /**
   * Checks if a path resolves to an existing MIDI file.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (!this.path.exists()) throw new MIDIFileError(`MIDI file "${this.path.path}" does not exists`)
    return true
  }

  /**
   * Returns a JSON object with statistics of the MIDI file.
   * - - - -
   * @returns {MIDIFileStatObject}
   */
  stat(): MIDIFileStatObject {
    this.checkExistence()
    return Py.midiFileStatSync(this.path.path)
  }

  /**
   * Returns a JSON representation of the MIDI file class.
   * - - - -
   * @returns {MIDIFileJSONObject}
   */
  toJSON(): MIDIFileJSONObject {
    return {
      ...this.path.toJSON(),
      file: this.stat(),
    }
  }
}
