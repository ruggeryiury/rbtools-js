import Path, { type PathLikeTypes } from 'path-js'
import { RockshelfError } from '../rockshelf.js'

export interface DevHDD0PathsObject {
  /**
   * Path to `game/BLUS30050/USRDIR`.
   */
  rb2dlcPath: Path
  /**
   * An array with paths of all packs installed on `game/BLUS30050/USRDIR`.
   */
  rb2dlc: Path[]
  /**
   * Path to `game/BLUS30463/USRDIR`.
   */
  rb3dlcPath: Path
  /**
   * An array with paths of all packs installed on `game/BLUS30463/USRDIR`.
   */
  rb3dlc: Path[]
  /**
   * Path to `game/BLUS30463/USRDIR/EBOOT.BIN` file.
   */
  rb3eboot: Path
  /**
   * Path to `home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT` file.
   */
  rb3Save: Path
}

/**
 * A class to validate and parse information of the Rock Band game folders. inside a `dev_hdd0` folder.
 * - - - -
 */
export class DevHDD0 {
  /**
   * A static method that checks if a given `dev_hdd0` folder has all the Rock Band files needed to read all data.
   * - - - -
   * @param {PathLikeTypes} devhdd0Path The path to the user's `dev_hdd0` folder.
   * @returns {boolean}
   */
  static isValid(devhdd0Path: PathLikeTypes): boolean {
    const path = Path.stringToPath(devhdd0Path)
    const rb3dlc = new Path(Path.resolve(path.path, 'game/BLUS30463/USRDIR'))
    const rb3eboot = new Path(Path.resolve(rb3dlc.path, 'EBOOT.BIN'))
    const rb3save = new Path(Path.resolve(path.path, 'home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT'))
    if (rb3dlc.exists() && rb3eboot.exists() && rb3save.exists()) return true
    return false
  }

  /**
   * The path to the `dev_hdd0` folder.
   */
  path: Path

  /**
   * @param {PathLikeTypes} devhdd0Path The path to the user's `dev_hdd0` folder.
   */
  constructor(devhdd0Path: PathLikeTypes) {
    this.path = Path.stringToPath(devhdd0Path)
    if (this.isValid()) return
    else throw new RockshelfError({ message: `Provided path "${this.path.path}" is not a valid dev_hdd0 folder.`, code: 'error_devhdd0_invalid', values: { devhdd0Path: this.path.path } })
  }

  /**
   * Filters non-pack folders and unrelated files from a `USRDIR` folder.
   * - - - -
   * @param {PathLikeTypes} usrdir The path to the `USRDIR` folder.
   * @returns {Path[]}
   */
  private filterDLCFoldersFromUSRDIR(usrdir: PathLikeTypes): Path[] {
    const path = Path.stringToPath(usrdir)
    const contents = path.readDirSync(true)
    return contents
      .filter((con) => {
        const content = Path.stringToPath(con)
        if (content.fullname === 'gen') return false
        if (content.type() === 'file') return false
        if (!new Path(Path.resolve(content.path, './songs/songs.dta')).exists()) return false
        else return con
      })
      .map((con) => new Path(con))
  }

  /**
   * Returns an object with values of all paths to all important Rock Band files.
   * - - - -
   * @returns {DevHDD0PathsObject}
   */
  getBasePaths(): DevHDD0PathsObject {
    const rb2dlc: Path[] = []
    const rb3dlc: Path[] = []

    const rb2dlcPath = new Path(Path.resolve(this.path.path, 'game/BLUS30050/USRDIR'))
    const rb3dlcPath = new Path(Path.resolve(this.path.path, 'game/BLUS30463/USRDIR'))

    rb2dlc.push(...this.filterDLCFoldersFromUSRDIR(rb2dlcPath))
    rb3dlc.push(...this.filterDLCFoldersFromUSRDIR(rb3dlcPath))

    return {
      rb2dlcPath,
      rb2dlc,
      rb3dlcPath,
      rb3dlc,
      rb3eboot: new Path(Path.resolve(rb3dlcPath.path, 'EBOOT.BIN')),
      rb3Save: new Path(Path.resolve(this.path.path, 'home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT')),
    }
  }
  /**
   * Checks if the provided `dev_hdd0` folder for this class instance has all the Rock Band files needed to read all data.
   * - - - -
   * @returns {boolean}
   */
  isValid(): boolean {
    const path = Path.stringToPath(this.path)
    const rb3dlc = new Path(Path.resolve(path.path, 'game/BLUS30463/USRDIR'))
    const rb3eboot = new Path(Path.resolve(rb3dlc.path, 'EBOOT.BIN'))
    if (rb3dlc.exists() && rb3eboot.exists()) return true
    return false
  }
}
