import Path, { type StringOrPath } from 'path-js'
import { OnyxCLIError } from '../errors.js'
import { execPromise } from '../lib.js'
import 'dotenv/config.js'

export type OnyxCLIOperators = 'import' | 'build' | 'web-player' | 'reaper' | 'pro-keys-hanging' | 'stfs' | 'mogg' | 'encrypt-mogg-rb1' | 'u8' | 'milo' | 'encrypt-gh-fsb' | 'fsb' | 'pak' | 'pkg' | 'edat' | 'port-gh-ps3' | 'extract' | 'unwrap' | 'midi-text' | 'midi-merge' | 'bin-to-dta' | 'dta-to-bin'

export class OnyxCLI {
  private static checkOnyxPathIntegrity() {
    if (!process.env.ONYX_PATH) throw new OnyxCLIError('No path for Onyx CLI executable was provided on the project\'s environment. Please, provide a path using the "ONYX_PATH" key')
  }

  static async help(command?: OnyxCLIOperators) {
    this.checkOnyxPathIntegrity()
    const cmd = `"${Path.resolve(process.env.ONYX_PATH)}"${command ? ` ${command}` : ''} --help`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  static async stfs(srcFolder: StringOrPath, destFile: StringOrPath, game: 'rb3' | 'rb2' | 'gh2' = 'rb3') {
    this.checkOnyxPathIntegrity()

    const src = Path.stringToPath(srcFolder)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt(''))
    const cmd = `"${Path.resolve(process.env.ONYX_PATH)}" stfs "${src.path}" --to ${dest.path} --game ${game}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  static async pkg(srcFolder: StringOrPath, destFile: StringOrPath, contentID: string) {
    this.checkOnyxPathIntegrity()

    const src = Path.stringToPath(srcFolder)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt('pkg'))
    const cmd = `"${Path.resolve(process.env.ONYX_PATH)}" pkg ${contentID} "${src.path}" --to ${dest.path}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }

  static async edat(srcFile: StringOrPath, destFile: StringOrPath, contentID: string, klic: string) {
    this.checkOnyxPathIntegrity()

    const src = Path.stringToPath(srcFile)
    const dest = new Path(Path.stringToPath(destFile).changeFileExt('edat'))
    const cmd = `"${Path.resolve(process.env.ONYX_PATH)}" edat ${contentID} ${klic} "${src.path}" --to ${dest.path}`
    const { stderr, stdout } = await execPromise(cmd, { windowsHide: true })
    if (stderr) throw new Error(stderr)
    return stdout
  }
}
