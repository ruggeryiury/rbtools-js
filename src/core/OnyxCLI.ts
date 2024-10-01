import Path, { type StringOrPath } from 'path-js'
import { OnyxCLIError } from '../errors.js'
import { execPromise } from '../lib.js'
import 'dotenv/config.js'

export type OnyxCLIOperators = 'import' | 'build' | 'web-player' | 'reaper' | 'pro-keys-hanging' | 'stfs' | 'mogg' | 'encrypt-mogg-rb1' | 'u8' | 'milo' | 'encrypt-gh-fsb' | 'fsb' | 'pak' | 'pkg' | 'edat' | 'port-gh-ps3' | 'extract' | 'unwrap' | 'midi-text' | 'midi-merge' | 'bin-to-dta' | 'dta-to-bin'
export type STFSGameTypes = 'rb3' | 'rb2' | 'gh2'

/**
 * Use Onyx CLI features as an API.
 */
export class OnyxCLI {
  static checkOnyxCLIIntegrity(): Path {
    if (!process.env.ONYX_CLI_PATH) throw new OnyxCLIError('No path for Onyx CLI executable was provided on the project\'s environment. Please, provide a path using the "ONYX_PATH" key')

    const onyxPath = new Path(process.env.ONYX_CLI_PATH)
    if (!onyxPath.exists()) throw new OnyxCLIError(`No Onyx CLI executable found on provided path "${onyxPath.path}"`)
    return onyxPath
  }

  /**
   * Displays the help command on Onyx CLI.
   * - - - -
   * @param {OnyxCLIOperators} command `OPTIONAL` Displays general helping if no argument is provided.
   * @returns {string} The help text.
   */
  static async help(command?: OnyxCLIOperators): Promise<string> {
    const onyx = this.checkOnyxCLIIntegrity()
    const cmd = `"${onyx.path}"${command ? ` ${command}` : ''} --help`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  /**
   * Compile a folder's contents into an Xbox 360 STFS file (CON file).
   * - - - -
   * @param {StringOrPath} srcFolder The path to the folder with contents to the CON file.
   * @param {StringOrPath} destFile The path to the new CON file.
   * @param {STFSGameTypes} game `OPTIONAL`. Change the game that the CON file will be created for. Default is `'rb3'`.
   * @returns {Promise<string>} The printable text from the child process.
   */
  static async stfs(srcFolder: StringOrPath, destFile: StringOrPath, game: STFSGameTypes = 'rb3'): Promise<string> {
    const onyx = this.checkOnyxCLIIntegrity()
    const src = Path.stringToPath(srcFolder)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt(''))
    const cmd = `"${onyx.path}" stfs "${src.path}" --to ${dest.path} --game ${game}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  /**
   * Compile a folder's contents into a PS3 `.pkg` file.
   * - - - -
   * @param {StringOrPath} srcFolder The path to the folder with contents to the `.pkg` file.
   * @param {StringOrPath} destFile The path to the new `.pkg` file.
   * @param {string} contentID The content ID. Must be 36 characters long. Ex.: `UP0006-BLUS30050_00-RBSTILLALCCF005D`
   * @returns {Promise<string>} The printable text from the child process.
   */
  static async pkg(srcFolder: StringOrPath, destFile: StringOrPath, contentID: string): Promise<string> {
    const onyx = this.checkOnyxCLIIntegrity()
    const src = Path.stringToPath(srcFolder)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt('pkg'))
    const cmd = `"${onyx.path}" pkg ${contentID} "${src.path}" --to ${dest.path}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  /**
   * Encrypt a file into a PS3 `.edat` file.
   * - - - -
   * @param {StringOrPath} srcFile The path to the file to be encrypted.
   * @param {StringOrPath} destFile The path to the new `.edat` file.
   * @param {string} contentID The content ID. Must be 36 characters long. Ex.: `UP0002-BLUS30487_00-MYPACKAGELABEL`
   * @param {string} klic A 16-byte hex string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`
   * @returns {Promise<string>} The printable text from the child process.
   */
  static async edat(srcFile: StringOrPath, destFile: StringOrPath, contentID: string, klic: string): Promise<string> {
    const onyx = this.checkOnyxCLIIntegrity()
    const src = Path.stringToPath(srcFile)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt('edat'))
    const cmd = `"${onyx.path}" edat ${contentID} ${klic} "${src.path}" --to ${dest.path}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }
}
