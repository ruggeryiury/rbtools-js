import Path from 'path-js'
import { pngWiiStat, pngXboxPs3TexStat } from '../lib.js'

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
  constructor(path: Path | string) {
    if (path instanceof Path) {
      if (!path.exists()) throw new Error(`ImgTexFileError: File "${path.path}" does not exists`)

      if (path.ext !== '.png_xbox' && path.ext !== '.png_ps3' && path.ext !== '.png_wii') throw new Error(`Tired to load a ${path.ext.slice(1).toUpperCase()} file, use TextureFile() instead`)

      this.path = path
      return
    }

    const p = new Path(path)
    if (!p.exists()) throw new Error(`ImgTexFileError: File "${p.path}" does not exists`)

    if (p.ext.includes('.png_')) throw new Error(`Tired to load a ${p.ext.slice(1).toUpperCase()} file, use TexFile() instead`)

    this.path = p
  }
  
  private checkExistence() {
    if (!this.path.exists()) throw new Error(`TextureFileNotFoundError: Texture file "${this.path.path}" does not exists`)
  }

  async stat(): Promise<TextureFileStatObject> {
    this.checkExistence()
    if (this.path.ext === '.png_wii') return pngWiiStat(this.path)
    else return await pngXboxPs3TexStat(this.path)
  }
}
