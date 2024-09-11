import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Path from 'path-js'
import { ImgFile, TextureFile, MidiFile } from './core.js'

export const __root = new Path(dirname(decodeURIComponent(fileURLToPath(import.meta.url))), '../dist')
export { ImgFile, TextureFile, MidiFile }
