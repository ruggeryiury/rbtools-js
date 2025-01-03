import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Path from 'path-js'
import { EDATFile, ImageURL, ImgFile, MIDIFile, MOGGFile, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile } from './core.js'
import 'dotenv/config'

/**
 * The distribution folder path of the `RBToolsJS` package.
 */
export const __root = new Path(dirname(decodeURIComponent(fileURLToPath(import.meta.url))), Number(process.env.RBTOOLS_DEV) === 1 ? '../src' : '../dist')
export { EDATFile, ImageURL, ImgFile, MIDIFile, MOGGFile, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile }
