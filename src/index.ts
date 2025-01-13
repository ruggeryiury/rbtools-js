import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Path from 'path-js'
import { EDATFile, ImageURL, ImgFile, MIDIFile, MOGGFile, MOGGMaker, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile } from './core.js'
import 'dotenv/config'

/**
 * The distribution folder path of the `RBToolsJS` package.
 */
export const __root = process.env.RBTOOLS_BINPATH ? new Path(process.env.RBTOOLS_BINPATH) : new Path(dirname(decodeURIComponent(fileURLToPath(import.meta.url))), Number(process.env.RBTOOLS_DEV) === 1 ? '../src' : '../dist')
export { EDATFile, ImageURL, ImgFile, MIDIFile, MOGGFile, MOGGMaker, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile }
export * from './errors.js'
