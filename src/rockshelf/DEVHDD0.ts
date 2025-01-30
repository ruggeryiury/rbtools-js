import Path, { type PathLikeTypes } from 'path-js'

export interface DEVHDD0PathsObject {
  rb2dlcPath: Path
  rb2dlc: Path[]
  rb3dlcPath: Path
  rb3dlc: Path[]
  rb3eboot: Path
  rb3Save: Path
}

export class DEVHDD0 {
  static isValidDEVHDD0Folder(devhdd0Path: PathLikeTypes): boolean {
    const path = Path.stringToPath(devhdd0Path)
    const rb3dlc = new Path(Path.resolve(path.path, 'game/BLUS30463/USRDIR'))
    const rb3eboot = new Path(Path.resolve(rb3dlc.path, 'EBOOT.BIN'))
    if (rb3dlc.exists() && rb3eboot.exists()) return true
    return false
  }
  path: Path
  constructor(devhdd0Path: PathLikeTypes) {
    this.path = Path.stringToPath(devhdd0Path)
    if (DEVHDD0.isValidDEVHDD0Folder(this.path)) return
    else throw new Error(`Provided path "${this.path.path}" is not a valid dev_hdd0 folder.`)
  }
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
  getBasePaths(): DEVHDD0PathsObject {
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
}
