import Path, { type PathLikeTypes } from 'path-js'
import { OnyxCLIError } from '../errors.js'
import { execPromise } from '../lib.js'

export type OnyxCLIOperators = 'import' | 'build' | 'web-player' | 'reaper' | 'pro-keys-hanging' | 'stfs' | 'mogg' | 'encrypt-mogg-rb1' | 'u8' | 'milo' | 'encrypt-gh-fsb' | 'fsb' | 'pak' | 'pkg' | 'edat' | 'port-gh-ps3' | 'extract' | 'unwrap' | 'midi-text' | 'midi-merge' | 'bin-to-dta' | 'dta-to-bin'
export type STFSGameTypes = 'rb3' | 'rb2' | 'gh2'

/**
 * Use Onyx CLI features as an JavaScript API.
 */
export class OnyxCLI {
  /**
   * The path to the Onyx CLI executable.
   */
  path: Path

  /**
   * @param {PathLikeTypes} onyxCliPath The path to the Onyx CLI executable.
   */
  constructor(onyxCliPath: PathLikeTypes) {
    const path = Path.stringToPath(onyxCliPath)
    this.path = path

    this.checkOnyxCLIIntegrity()
  }

  private checkOnyxCLIIntegrity(): void {
    if (!this.path.exists()) throw new OnyxCLIError(`No Onyx CLI executable found on provided path "${this.path.path}"`)
  }

  /**
   * Displays the help command on Onyx CLI.
   * - - - -
   * @param {OnyxCLIOperators} command `OPTIONAL` Displays general helping if no argument is provided.
   * @returns {string} The help text.
   */
  async help(command?: OnyxCLIOperators): Promise<string> {
    const cmd = `"${this.path.path}"${command ? ` ${command}` : ''} --help`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  /**
   * Compile a folder's contents into an Xbox 360 STFS file (CON file).
   * - - - -
   * @param {PathLikeTypes} srcFolder The path to the folder with contents to the CON file.
   * @param {PathLikeTypes} destFile The path to the new CON file.
   * @param {STFSGameTypes} game `OPTIONAL`. Change the game that the CON file will be created for. Default is `'rb3'`.
   * @returns {Promise<string>} The printable text from the child process.
   */
  async stfs(srcFolder: PathLikeTypes, destFile: PathLikeTypes, game: STFSGameTypes = 'rb3'): Promise<string> {
    const src = Path.stringToPath(srcFolder)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt(''))
    const cmd = `"${this.path.path}" stfs "${src.path}" --to ${dest.path} --game ${game}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  /**
   * Compile a folder's contents into a PS3 `.pkg` file.
   * - - - -
   * @param {PathLikeTypes} srcFolder The path to the folder with contents to the `.pkg` file.
   * @param {PathLikeTypes} destFile The path to the new `.pkg` file.
   * @param {string} contentID The content ID. Must be 36 characters long. Ex.: `UP0006-BLUS30050_00-RBSTILLALCCF005D`
   * @returns {Promise<string>} The printable text from the child process.
   */
  async pkg(srcFolder: PathLikeTypes, destFile: PathLikeTypes, contentID: string): Promise<string> {
    const src = Path.stringToPath(srcFolder)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt('pkg'))
    const cmd = `"${this.path.path}" pkg ${contentID} "${src.path}" --to ${dest.path}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  /**
   * Encrypt a file into a PS3 `.edat` file.
   * - - - -
   * @param {PathLikeTypes} srcFile The path to the file to be encrypted.
   * @param {PathLikeTypes} destFile The path to the new `.edat` file.
   * @param {string} contentID The content ID. Must be 36 characters long. Ex.: `UP0002-BLUS30487_00-MYPACKAGELABEL`
   * @param {string} klic A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`
   * @returns {Promise<string>} The printable text from the child process.
   */
  async edat(srcFile: PathLikeTypes, destFile: PathLikeTypes, contentID: string, klic: string): Promise<string> {
    const src = Path.stringToPath(srcFile)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt('edat'))
    const cmd = `"${this.path.path}" edat ${contentID} ${klic} "${src.path}" --to ${dest.path}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }
}
