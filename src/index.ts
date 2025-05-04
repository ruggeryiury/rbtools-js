import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DirPath, FilePath, exists } from 'node-lib'
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
   * @returns {DirPath}
   */
  static get root(): DirPath {
    return new DirPath(dirname(decodeURIComponent(fileURLToPath(import.meta.url))), process.env.RBTOOLS_USESOURCE === '1' ? '../src' : '../dist')
  }
  /**
   * Gets the `dist/bin` path of the module.
   * - - - -
   * @returns {DirPath}
   */
  static get bin(): DirPath {
    if (process.env.RBTOOLS_BIN_PATH) {
      if (!exists(process.env.RBTOOLS_BIN_PATH)) throw new ReferenceError(`Provided path ${process.env.RBTOOLS_BIN_PATH} (as env variable RBTOOLS_BIN_PATH) does not exists.`)
      return new DirPath(process.env.RBTOOLS_BIN_PATH)
    }
    return new DirPath(RBTools.root.path, 'bin')
  }
  /**
   * Gets the `dist/bin/python` path of the module.
   * - - - -
   * @returns {DirPath}
   */
  static get python(): DirPath {
    return new DirPath(RBTools.bin.path, 'python')
  }
  /**
   * Gets the `dist/bin/headers` path of the module.
   * - - - -
   * @returns {DirPath}
   */
  static get imgHeaders(): DirPath {
    return new DirPath(RBTools.bin.path, 'headers')
  }
  /**
   * Gets the `dist/bin/dta` path of the module.
   * - - - -
   * @param {string[]} paths Paths to resolve from the DTA folder.
   * @returns {FilePath}
   */
  static getDTAPath(...paths: string[]): FilePath {
    return new FilePath(RBTools.bin.path, 'dta', ...paths)
  }
}

export * from './core.exports'
export * from './lib.exports'
export * from './errors'
