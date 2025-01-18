import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Path from 'path-js'
import { EDAT, ImageURL, ImgFile, MIDIFile, MOGGFile, MOGGMaker, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile } from './core.js'

/**
 * The distribution folder path of the `RBToolsJS` package.
 */
export const __root = new Path(dirname(decodeURIComponent(fileURLToPath(import.meta.url))), '../dist')
export { EDAT, ImageURL, ImgFile, MIDIFile, MOGGFile, MOGGMaker, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile }
export * from './errors.js'
