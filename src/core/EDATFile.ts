import { createHash } from 'node:crypto'
import Path, { type StringOrPath } from 'path-js'
import { ExecutableError, FileNotFoundError, UnknownFileFormatError } from '../errors.js'
import { __root } from '../index.js'
import { execPromise } from '../lib.js'

/**
 * Class with static methods to deal with PS3 EDAT files.
 */
export class EDATFile {
  /**
   * Generates a MD5 hash that decrypts `.edat` files based on the installed DLC folder name.
   * - - - -
   * @param {string} folderName The installed DLC folder name.
   * @returns {string}
   */
  static devklicFromFolderName(folderName: string): string {
    const key = `Ih38rtW1ng3r${folderName}10025250`
    return createHash('md5').update(key).digest('hex')
  }

  /**
   * Encrypts any file to EDAT.
   * - - - -
   * @param {StringOrPath} srcFile The path to the file to be encrypted.
   * @param {StringOrPath} destFile The path to the new encrypted EDAT file.
   * @param {string} contentID The content ID. Must be 36 characters long. Ex.: `UP0002-BLUS30487_00-MYPACKAGELABEL`
   * @param {string} devKLic A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`
   * @returns {Promise<string>}
   */
  static async encryptToEDAT(srcFile: StringOrPath, destFile: StringOrPath, contentID: string, devKLic: string): Promise<string> {
    const moduleName = 'edattool.exe'
    const exePath = new Path(__root, `./bin`)
    const src = Path.stringToPath(srcFile)
    const dest = Path.stringToPath(destFile)
    const command = `${moduleName} encrypt -custom:${devKLic} ${contentID} 00 00 00 "${src.path}" "${dest.changeFileName(dest.fullname, '.edat')}"`
    const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
    if (stderr) throw new ExecutableError(stderr)
    return stdout
  }

  /**
   * Decrypts any file to EDAT.
   * - - - -
   * @param {StringOrPath} srcFile The path to the EDAT file to be decrypted.
   * @param {StringOrPath} destFile The path to the decrypted file.
   * @param {string} devKLic A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`
   * @returns {Promise<string>}
   */
  static async decryptEDAT(srcFile: StringOrPath, destFile: StringOrPath, devKLic: string): Promise<string> {
    const moduleName = 'edattool.exe'
    const exePath = new Path(__root, `./bin/${moduleName}`)
    const src = Path.stringToPath(srcFile)
    const dest = Path.stringToPath(destFile)
    const command = `${moduleName} decrypt -custom:${devKLic} "${src.path}" "${dest.path}"`
    const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
    if (stderr) throw new ExecutableError(stderr)
    return stdout
  }

  /**
   * Converts all EDAT files from a RPCS3 DLC folder.
   * - - - -
   * @param {StringOrPath} dlcFolder The folder you want to convert all EDAT files. The DLC folder name must be the one that the EDAT file were originally installed to work.
   * @returns {Promise<string>}
   */
  static async decryptRPCS3DLCFolder(dlcFolder: StringOrPath): Promise<string> {
    const dlc = Path.stringToPath(dlcFolder)
    if (dlc.type() !== 'directory') throw new FileNotFoundError(`Provided path "${dlc.path} is not a directory."`)
    const usrDirFolder = new Path(dlc.root)
    const eboot = new Path(usrDirFolder.path, 'EBOOT.BIN')
    if (!eboot.exists()) throw new FileNotFoundError(`Provided DLC folder path "${dlc.path}" is not on a valid RPCS3 DLC folder.`)
    const devKLic = EDATFile.devklicFromFolderName(dlc.name)
    const songsFolder = new Path(dlc.path, './songs')
    const songsFolderContents = await songsFolder.readDir(true)
    let funcOutput = ''
    for (const song of songsFolderContents) {
      const s = new Path(song)
      const songName = s.name
      const songMidi = new Path(s.path, `${songName}.mid`)
      const songEDAT = new Path(s.path, `${songName}.mid.edat`)
      await songMidi.checkThenDeleteFile()
      const output = await EDATFile.decryptEDAT(songEDAT.path, songMidi.path, devKLic)
      funcOutput += `${output}\n`
    }
    return funcOutput
  }

  /**
   * Decrypts an EDAT file inside a RPCS3 DLC folder. The DLC folder name must be the one that the EDAT file were originally installed to work.
   * - - - -
   * @param {StringOrPath} edatFilePath The path to the EDAT file to be decrpted.
   * @returns {Promise<string>}
   */
  static async decryptEDATFromDLCFolder(edatFilePath: StringOrPath): Promise<string> {
    const edat = Path.stringToPath(edatFilePath)
    const midiFile = new Path(edat.changeFileName(edat.name.split('.')[0], '.mid'))
    if (!midiFile.exists()) if (!edat.exists()) throw new FileNotFoundError(`Provided path "${edat.path}" does not exists.`)
    if (edat.ext !== '.edat') throw new UnknownFileFormatError(`Provided path "${edat.path} is not an EDAT file."`)
    const edatDLCFolderName = new Path(edat.root, '../../').name
    const devKLic = EDATFile.devklicFromFolderName(edatDLCFolderName)
    await midiFile.checkThenDeleteFile()
    const output = await EDATFile.decryptEDAT(edat.path, midiFile.path, devKLic)
    return output
  }
}
