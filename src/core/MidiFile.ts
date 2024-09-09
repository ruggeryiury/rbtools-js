import Path from 'path-js'
import { midiFileStat } from '../python.js'

export interface MidiFileStatObject {
  format: string
  charset: string
  midiType: number
  ticksPerBeat: number
  formatDesc: string
  tracks: string[]
}
export class MidiFile {
  path: Path
  constructor(path: Path | string) {
    if (path instanceof Path) {
      if (!path.exists()) throw new Error(`MidiFileError: File "${path.path}" does not exists`)

      this.path = path
      return
    }

    const p = new Path(path)
    if (!p.exists()) throw new Error(`MidiFileError: File "${p.path}" does not exists`)

    this.path = p
  }

  private checkExistence() {
    if (!this.path.exists()) throw new Error(`ImgFileNotFoundError: Texture file "${this.path.path}" does not exists`)
  }

  async stat(): Promise<MidiFileStatObject> {
    this.checkExistence()
    return midiFileStat(this.path.path)
  }
}
