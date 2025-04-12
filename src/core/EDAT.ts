import { createHash } from 'node:crypto'
import { Path, type PathLikeTypes } from 'path-js'
import { ExecutableError, FileNotFoundError, UnknownFileFormatError } from '../errors'
import { RBTools } from '../index'
import { execPromise } from '../lib'

const ps3GameIDs = {
  rb2: 'BLUS30050',
  rb3: 'BLUS30463',
} as const

export type RockBandPS3ContentIDs = keyof typeof ps3GameIDs

/**
 * Class with static methods to deal with PS3 EDAT files.
 */
export class EDAT {
  /**
   * Generates a MD5 hash that decrypts Rock Band 3 `.edat` files based on the installed DLC folder name.
   * - - - -
   * @param {string} folderName The installed DLC folder name.
   * @returns {string}
   */
  static devklicFromFolderName(folderName: string): string {
    const key = `Ih38rtW1ng3r${folderName}10025250`
    return createHash('md5').update(key).digest('hex')
  }

  /**
   * Generate a default Content ID based on the given text.
   * - - - -
   * @param {string} text The custom text to place on the Content ID.
   * @param {RockBandPS3ContentIDs} game `OPTIONAL`. Default is `rb3`.
   * @returns {string}
   */
  static genDefaultContentID(text: string, game: RockBandPS3ContentIDs = 'rb3'): string {
    let contentID = `UP0002-${ps3GameIDs[game]}_00-`
    text = text.replace(/\s+/g, '').toUpperCase()
    if ((contentID + text).length > 36) {
      contentID += text
      contentID = contentID.slice(0, 36)
    } else if ((contentID + text).length < 36) {
      const diff = 36 - (contentID + text).length
      contentID += text
      for (let i = 0; i < diff; i++) {
        contentID += '0'
      }
    } else contentID += text

    return contentID
  }

  /**
   * Encrypts any file to EDAT.
   * - - - -
   * @param {PathLikeTypes} srcFile The path to the file to be encrypted.
   * @param {string} contentID The content ID. Must be 36 characters long. Ex.: `UP0002-BLUS30487_00-MYPACKAGELABEL00`
   * @param {string} devKLic A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`
   * @returns {Promise<string>}
   */
  static async encryptToEDAT(srcFile: PathLikeTypes, contentID: string, devKLic: string): Promise<string> {
    const moduleName = 'edattool.exe'
    const exePath = new Path(RBTools.getBinPath().path, moduleName)
    const src = Path.stringToPath(srcFile)
    const dest = Path.stringToPath(`${src.path}.edat`)
    const command = `${moduleName} encrypt -custom:${devKLic} ${contentID.slice(0, 36)} 00 00 00 "${src.path}" "${dest.path}"`
    const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
    if (stderr) throw new ExecutableError(stderr)
    return stdout
  }

  /**
   * Decrypts an EDAT file.
   * - - - -
   * @param {PathLikeTypes} srcFile The path to the EDAT file to be decrypted.
   * @param {string} devKLic A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`
   * @returns {Promise<string>}
   */
  static async decryptEDAT(srcFile: PathLikeTypes, devKLic: string): Promise<string> {
    const moduleName = 'edattool.exe'
    const exePath = new Path(RBTools.getBinPath().path, moduleName)
    const src = Path.stringToPath(srcFile)
    const dest = Path.stringToPath(src.path.replace('.edat', ''))
    const command = `${moduleName} decrypt -custom:${devKLic} "${src.path}" "${dest.path}"`
    const { stderr, stdout } = await execPromise(command, { cwd: exePath.root, windowsHide: true })
    if (stderr) throw new ExecutableError(stderr)
    return stdout
  }

  /**
   * Converts all EDAT files from a RPCS3 DLC folder.
   * - - - -
   * @param {PathLikeTypes} dlcFolder The folder you want to convert all EDAT files. The DLC folder name must be the one that the EDAT file were originally installed to work.
   * @returns {Promise<string>}
   */
  static async decryptRPCS3DLCFolder(dlcFolder: PathLikeTypes): Promise<string> {
    const dlc = Path.stringToPath(dlcFolder)
    if (dlc.type() !== 'directory') throw new FileNotFoundError(`Provided path "${dlc.path} is not a directory."`)
    const usrDirFolder = new Path(dlc.root)
    const eboot = new Path(usrDirFolder.path, 'EBOOT.BIN')
    if (!eboot.exists()) throw new FileNotFoundError(`Provided DLC folder path "${dlc.path}" is not on a valid RPCS3 DLC folder.`)
    const devKLic = EDAT.devklicFromFolderName(dlc.name)
    const songsFolder = new Path(dlc.path, './songs')
    const songsFolderContents = await songsFolder.readDir(true)
    let funcOutput = ''
    for (const song of songsFolderContents) {
      const s = new Path(song)
      const songName = s.name
      const songMidi = new Path(s.path, `${songName}.mid`)
      const songEDAT = new Path(s.path, `${songName}.mid.edat`)
      await songMidi.checkThenDeleteFile()
      const output = await EDAT.decryptEDAT(songEDAT.path, devKLic)
      funcOutput += `${output}\n`
    }
    return funcOutput
  }

  /**
   * Decrypts an EDAT file inside a RPCS3 DLC folder. The DLC folder name must be the one that the EDAT file were originally installed to work.
   * - - - -
   * @param {PathLikeTypes} edatFilePath The path to the EDAT file to be decrpted.
   * @returns {Promise<string>}
   */
  static async decryptEDATFromDLCFolder(edatFilePath: PathLikeTypes): Promise<string> {
    const edat = Path.stringToPath(edatFilePath)
    const midiFile = new Path(edat.changeFileName(edat.name.split('.')[0], '.mid'))
    if (!midiFile.exists()) if (!edat.exists()) throw new FileNotFoundError(`Provided path "${edat.path}" does not exists.`)
    if (edat.ext !== '.edat') throw new UnknownFileFormatError(`Provided path "${edat.path} is not an EDAT file."`)
    const edatDLCFolderName = new Path(edat.root, '../../').name
    const devKLic = EDAT.devklicFromFolderName(edatDLCFolderName)
    await midiFile.checkThenDeleteFile()
    const output = await EDAT.decryptEDAT(edat.path, devKLic)
    return output
  }

  /**
   * Checks if the provided EDAT file is encrypted.
   * - - - -
   * @param {PathLikeTypes} edatFilePath The path to the EDAT file to be decrpted.
   * @returns {Promise<boolean>}
   */
  static async isEncrypted(edatFilePath: PathLikeTypes): Promise<boolean> {
    const edat = Path.stringToPath(edatFilePath)
    const magic = (await edat.readFileOffset(0, 3)).toString('ascii')
    if (magic === 'NPD') return true
    else return false
  }
}
