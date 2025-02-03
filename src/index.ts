import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Path from 'path-js'
import { DTAParser, EDAT, ImageURL, ImgFile, MIDIFile, MOGGFile, MOGGMaker, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile } from './core.js'
import 'dotenv/config'

/**
 * A class with static methods that resolves all the paths used by the module
 * - - - -
 */
export class RBTools {
  /**
   * Gets the root path of the module.
   *
   * Defaults to built `dist` folder unless a `RBTOOLS_USESOURCE` variable environment is set to `1`
   * that sets the folder to `src`.
   * - - - -
   * @returns {Path}
   */
  static root(): Path {
    return new Path(dirname(decodeURIComponent(fileURLToPath(import.meta.url))), process.env.RBTOOLS_USESOURCE === '1' ? '../src' : '../dist')
  }
  /**
   * Gets the `dist/bin` path of the module.
   * - - - -
   * @returns {Path}
   */
  static getBinPath(): Path {
    if (process.env.RBTOOLS_BIN_PATH && Path.isValidPath(process.env.RBTOOLS_BIN_PATH)) return new Path(process.env.RBTOOLS_BIN_PATH)
    return new Path(RBTools.root().path, 'bin')
  }
  /**
   * Gets the `dist/bin/python` path of the module.
   * - - - -
   * @returns {Path}
   */
  static getPythonScriptsPath(): Path {
    return new Path(RBTools.getBinPath().path, 'python')
  }
  /**
   * Gets the `dist/bin/headers` path of the module.
   * - - - -
   * @returns {Path}
   */
  static getImageHeadersPath(): Path {
    return new Path(RBTools.getBinPath().path, 'headers')
  }
  /**
   * Gets the `dist/bin/dta` path of the module.
   * - - - -
   * @returns {Path}
   */
  static getDTAPath(): Path {
    return new Path(RBTools.getBinPath().path, 'dta')
  }
}

export { DTAParser, EDAT, ImageURL, ImgFile, MIDIFile, MOGGFile, MOGGMaker, OnyxCLI, RhythmverseAPI, STFSFile, TextureFile }
export * from './errors.js'
