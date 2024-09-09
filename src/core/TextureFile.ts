import Path from 'path-js'
import { pngWiiStat, pngXboxPs3TexStat, stringToPath } from '../lib.js'

export interface TextureFileStatObject {
  format: string
  type: string
  width: number
  height: number
  size: [number, number]
  formatDesc: string
}

export class TextureFile {
  path: Path

  private checkExistence() {
    if (!this.path.exists()) throw new Error(`TextureFileNotFoundError: Texture file "${this.path.path}" does not exists`)
    return true
  }
  constructor(path: Path | string) {
    this.path = stringToPath(path)
    this.checkExistence()
    if (this.path.ext !== '.png_xbox' && this.path.ext !== '.png_ps3' && this.path.ext !== '.png_wii') `TextureFileError: Tired to load a ${this.path.ext.slice(1).toUpperCase()} file, for texture format is not compatible for this module. Compatible image formats are: "png_xbox", "png_ps3", "png_wii"`
  }

  async stat(): Promise<TextureFileStatObject> {
    this.checkExistence()
    if (this.path.ext === '.png_wii') return pngWiiStat(this.path)
    else return await pngXboxPs3TexStat(this.path)
  }

  async toJSON() {
    return {
      ...this.path.toJSON(),
      stat: await this.stat(),
    }
  }
}
