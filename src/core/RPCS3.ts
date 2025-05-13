import { DirPath, execAsync, FilePath, isFile, pathLikeToDirPath, pathLikeToFilePath, pathLikeToString, resolve, type DirPathLikeTypes, type FilePathLikeTypes } from 'node-lib'
import { parse } from 'yaml'
import { DTAParser, ImgFile, RB3SaveData, RBTools, type ParsedRB3SaveData } from '../core.exports'
import type { DTAFile, PartialDTAFile } from '../lib.exports'

export interface RockBand3GameStats {
  /** Path to the game installation. */
  path: string | null
  /** Game title. */
  name: string
  /** Game ID (BLUS30463). */
  id: string
  /** Whether the game is installed. */
  isInstalled: boolean
  /** Full path to the save data file. */
  saveDataPath: string
  /** Whether save data exists. */
  hasSaveData: boolean
  /** Parsed save data (if available). */
  saveData?: ParsedRB3SaveData
  /** Whether a patch/update is installed. */
  hasUpdate: boolean
  /** Whether the RB3DX is installed. */
  hasDeluxe: boolean
  /** Type of update (`'rb3dx'`, `'tu5'`, or `'unknown'`). */
  updateType: 'rb3dx' | 'tu5' | 'unknown'
  /** Last modified date of the update/ark file in ISO string. */
  lastUpdated?: string
  /** Whether the Teleporting Glitch patch is installed. */
  isTeleportingGlitchPatchInstalled: boolean
  /** Whether the High Memory patch is installed. */
  isHighMemoryPatchInstalled: boolean
  /** The amount of packs installed on the game. */
  packsCount: number
  /** The amount of songs installed on the game. */
  songsCount: number
  /** The amount of songs installed on the game, including the 83 songs from the base game. */
  songsCountIncludingRB3Songs: number
}

export interface RockBand2GameStats {
  /** Path to the game installation. */
  path: string | null
  /** Game title. */
  name: string
  /** Game ID (BLUS30147). */
  id: string
  /** Whether the game is installed. */
  isInstalled: boolean
  /** Full path to the save data file. */
  saveDataPath: string
  /** Whether save data exists. */
  hasSaveData: boolean
  /** Whether a patch/update is installed. */
  hasUpdate: boolean
  /** Whether RB2DX is installed. */
  hasDeluxe: boolean
  /** Type of update (`'rb2dx'`, `'tu2'`, or `'unknown'`). */
  updateType: 'rb2dx' | 'tu2' | 'unknown'
  /** The amount of packs installed on the game. */
  packsCount: number
  /** The amount of songs installed on the game. */
  songsCount: number
}

export interface InstalledSongPackagesStats {
  /** The path of the song package. */
  path: string | null
  /** The name of the package. */
  name: string
  /** A hash identifying the song package. */
  hash: string
  /** The game this pack belongs to. */
  origin: 'rb1' | 'rb3'
  /** Whether the package is an official one. */
  isOfficial: boolean
  /** List of songs included in the package. */
  songs: (DTAFile | PartialDTAFile)[]
  /** Optional base64-encoded image preview. */
  dataURL?: string
}

export interface RPCS3Stats {
  /** The path to your RPCS3 `dev_hdd0` folder. */
  devhdd0Path: string
  /** The path to your RPCS3 executable file. */
  rpcs3ExePath: string
  /** Rock Band 3 game stats. */
  rb3: RockBand3GameStats
  /** Rock Band 2 game stats. */
  rb2: RockBand2GameStats
  /** Installed DLC and song packs. */
  packs: InstalledSongPackagesStats
  /** The amount of packs installed on all games. */
  packsCount: number
  /** The amount of songs installed on all games. */
  songsCount: number
  /** The amount of songs installed on the game, including the 83 songs from the base game. */
  songsCountIncludingRB3Songs: number
}

export interface RPCS3StatsOptions {
  /** The path to your RPCS3 `dev_hdd0` folder. */
  devhdd0Path: DirPathLikeTypes
  /** The path to your RPCS3 executable file. If not provided, it will be resolved to `../rpcs3.exe` from the provided `devhdd0Path` parameter. */
  rpcs3ExePath?: FilePathLikeTypes
}

export interface RB3ShortcutCreationOptions {
  /** The path to the new shortcut file. */
  fileShortcutPath: FilePathLikeTypes
  /** The path to your RPCS3 executable file. */
  rpcs3ExePath: FilePathLikeTypes
}

export type PackageInfoFromHashObject = Partial<InstalledSongPackagesStats>

/**
 * A class for analyzing and interacting with Rock Band game data in an RPCS3 environment.
 * - - - -
 */
export class RPCS3 {
  /**
   * Checks if a package DTA file hash has known package data from the database, returning `false` if not.
   * - - - -
   * @param {string} hash The hash of the package's DTA file.
   * @returns {PackageInfoFromHashObject | false}
   */
  static checkHashForKnownPackages(hash: string): PackageInfoFromHashObject | false {
    switch (hash) {
      // Rock Band (Export)
      case 'af0f6d4fa8a5abfcc4226bb7040af04837cc22e644b905e2e04c561360313d02':
        return { name: 'Rock Band (Export)', isOfficial: true }

      // Rock Band 2 (Export)
      case '77d80c436f289a6d09bb68dfc4cfe7567b0c99c0fcec1870823ec93be7b7a89f':
        return { name: 'Rock Band 2 (Export)', isOfficial: true }

      // LEGO Rock Band (Export)
      case '6bad37e2f03ffe3cde7cbd4de3ebb580d61e1b50dadac59093583abe7a807540':
        return { name: 'LEGO Rock Band (Export)', isOfficial: true }

      // Rock Band 4 (On-Disc songs)
      case '50a42083300c3134561c5bd708f8e6a04406d79d4b0535a4cfd247a180374868':
        return { name: 'Rock Band 4 (On Disc)', isOfficial: true }
      default:
        return false
    }
  }

  /**
   * Checks if there's known package information from the internal package database from `hash` and populates a `packMap` with the data, if any.
   * - - - -
   * @param {Map<keyof InstalledSongPackagesStats, unknown>} packMap The map with the package data.
   * @param {string} hash The hash of the package's DTA file.
   * @returns {void}
   */
  private static populatePackageMapWithKnownPackageData(packMap: Map<keyof InstalledSongPackagesStats, unknown>, hash: string): void {
    const data = this.checkHashForKnownPackages(hash)
    if (!data) return

    for (const keys of Object.keys(data) as (keyof PackageInfoFromHashObject)[]) {
      packMap.set(keys, data[keys])
    }
  }

  /**
   * Checks whether the provided `dev_hdd0` path contains valid RPCS3 folders and files.
   * - - - -
   * @param {DirPathLikeTypes} devHDD0Path The path to the `dev_hdd0` folder.
   * @returns {boolean}
   */
  static isDevHDD0PathValid(devHDD0Path: DirPathLikeTypes): boolean {
    const devhdd0 = pathLikeToDirPath(devHDD0Path)
    const game = devhdd0.gotoDir('game')
    if (!game.exists) return false
    const home = devhdd0.gotoDir('home')
    if (!home.exists) return false

    return true
  }

  /**
   * Checks whether the provided `rpcs3.exe` path contains valid RPCS3 files.
   * - - - -
   * @param {FilePathLikeTypes} exeFilePath The path to the `rpcs3.exe` folder.
   * @returns {boolean}
   */
  static isRPCS3ExePathValid(exeFilePath: FilePathLikeTypes): boolean {
    const exe = pathLikeToFilePath(exeFilePath)
    if (exe.fullname !== 'rpcs3.exe') return false
    const dxcompiler = exe.gotoFile('dxcompiler.dll')
    if (!dxcompiler.exists) return false
    const avcodec61 = exe.gotoFile('avcodec-61.dll')
    if (!avcodec61.exists) return false
    const gamesConfig = exe.gotoFile('config/games.yml')
    if (!gamesConfig.exists) return false

    return true
  }

  /**
   * Scans and returns statistics from RPCS3 emulator, installed Rock Band games and packs.
   * - - - -
   * @param {RPCS3StatsOptions} options An object with paths of your RPCS3 files and folders.
   * @returns {Promise<RPCS3Stats>} A structured `RPCS3Stats` object with emulator, game and packs data.
   */
  static async stat(options: RPCS3StatsOptions): Promise<RPCS3Stats> {
    const { devhdd0Path, rpcs3ExePath }: Record<keyof RPCS3StatsOptions, string> = {
      devhdd0Path: pathLikeToString(options.devhdd0Path),
      rpcs3ExePath: pathLikeToString(options.rpcs3ExePath ?? pathLikeToDirPath(options.devhdd0Path).gotoFile('../rpcs3.exe')),
    }
    const devhdd0 = pathLikeToDirPath(devhdd0Path)
    const rpcs3Exe = pathLikeToFilePath(rpcs3ExePath)
    if (!this.isDevHDD0PathValid(devhdd0)) throw new Error(`Provided path ${devhdd0.path} is not a valid RPCS3 dev_hdd0 folder.`)
    if (!this.isRPCS3ExePathValid(rpcs3Exe)) throw new Error(`Provided path ${rpcs3Exe.path} is not a valid RPCS3 executable path.`)
    const gamesYmlPath = rpcs3Exe.gotoFile('config/games.yml')
    const gamesYml = parse(await gamesYmlPath.read('utf-8')) as Record<'BLUS30147' | 'BLUS30463', string | undefined>
    const map = new Map<keyof RPCS3Stats, unknown>()
    map.set('devhdd0Path', devhdd0.path)
    map.set('rpcs3ExePath', rpcs3Exe.path)

    // Rock Band 3
    const rb3 = new Map<keyof RockBand3GameStats, unknown>()
    const rb3GamePath = gamesYml.BLUS30463 ? pathLikeToDirPath(gamesYml.BLUS30463) : null
    const saveDataPath = devhdd0.gotoFile('home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT')
    rb3.set('path', rb3GamePath ? rb3GamePath.path : null)
    rb3.set('name', 'Rock Band 3')
    rb3.set('id', 'BLUS30463')
    rb3.set('isInstalled', rb3GamePath?.exists ?? false)
    rb3.set('saveDataPath', saveDataPath.path)
    rb3.set('hasSaveData', saveDataPath.exists)
    if (saveDataPath.exists) rb3.set('saveData', await RB3SaveData.parseFromFile(saveDataPath))

    const gen = devhdd0.gotoDir('game/BLUS30463/USRDIR/gen')
    const hdr = gen.gotoFile('patch_ps3.hdr')
    const ark = gen.gotoFile('patch_ps3_0.ark')
    rb3.set('hasUpdate', gen.exists && hdr.exists && ark.exists)
    rb3.set('hasDeluxe', false)
    rb3.set('updateType', 'unknown')
    if (hdr.exists && ark.exists) {
      const hdrStats = await hdr.stat()
      const arkStats = await ark.stat()

      // Is Deluxe, only it is bigger than 500mb
      if (arkStats.size > 0x1f400000) {
        rb3.set('hasDeluxe', true)
        rb3.set('updateType', 'rb3dx')
      }

      // Is TU5
      else if (hdrStats.size === 0x8d69) rb3.set('updateType', 'tu5')
      else rb3.set('updateType', 'unknown')
      rb3.set('lastUpdated', arkStats.mtime.toISOString())
    }

    rb3.set('isTeleportingGlitchPatchInstalled', rb3GamePath?.gotoFile('PS3_GAME/USRDIR/gen/main_ps3_vanilla.hdr').exists && rb3GamePath.gotoFile('PS3_GAME/USRDIR/gen/main_ps3_10.ark').exists)
    rb3.set('isHighMemoryPatchInstalled', gen.gotoFile('../dx_high_memory.dta').exists)

    // Rock Band 2
    const rb2 = new Map<keyof RockBand2GameStats, unknown>()
    const rb2GamePath = gamesYml.BLUS30147 ? pathLikeToDirPath(gamesYml.BLUS30147) : null
    const saveDataPathRB2 = devhdd0.gotoDir('home/00000001/savedata/BLUS30147-AUTOSAVE/RB2.SAV')
    rb2.set('path', rb2GamePath ? rb2GamePath.path : null)
    rb2.set('name', 'Rock Band 2')
    rb2.set('id', 'BLUS30147')
    rb2.set('isInstalled', rb2GamePath?.exists ?? false)
    rb2.set('saveDataPath', saveDataPathRB2.path)
    rb2.set('hasSaveData', saveDataPathRB2.exists)

    const genRB2 = devhdd0.gotoDir('game/BLUS30147/USRDIR/gen')
    const hdrRB2 = genRB2.gotoFile('patch_ps3.hdr')
    const arkRB2 = genRB2.gotoFile('patch_ps3_0.ark')
    rb2.set('hasUpdate', genRB2.exists && hdrRB2.exists && arkRB2.exists)
    rb2.set('hasDeluxe', false)
    rb2.set('updateType', 'unknown')
    if (hdrRB2.exists && arkRB2.exists) {
      const hdrStats = await hdrRB2.stat()
      const arkStats = await arkRB2.stat()

      // Is Deluxe, only it is bigger than 500mb
      if (arkStats.size > 0x12c00000) {
        rb2.set('hasDeluxe', true)
        rb2.set('updateType', 'rb2dx')
      }

      // Is TU2
      else if (hdrStats.size === 0x5d85) rb2.set('updateType', 'tu2')
      else rb2.set('updateType', 'unknown')
    }

    const packs: InstalledSongPackagesStats[] = []
    let rb3PacksCount = 0,
      rb3SongsCount = 0,
      rb2PacksCount = 0,
      rb2SongsCount = 0
    const usrdir = devhdd0.gotoDir('game/BLUS30463/USRDIR')
    if (usrdir.exists) {
      for (const pack of (await usrdir.readDir(true)).map((path) => (isFile(path) ? FilePath.of(path) : DirPath.of(path))).filter((path) => path instanceof DirPath && path.name !== 'gen')) {
        rb3PacksCount++
        const parsed = await DTAParser.fromFile(pack.gotoFile('songs/songs.dta'))
        rb3SongsCount += parsed.songs.length
        const hash = parsed.calculateHash()
        const packMap = new Map<keyof InstalledSongPackagesStats, unknown>()
        packMap.set('path', pack.path)
        packMap.set('name', pack.name)
        packMap.set('hash', hash)
        packMap.set('origin', 'rb3')
        packMap.set('isOfficial', false)
        packMap.set('songs', parsed.songs)
        const thumbnail = pack.gotoFile('folder.jpg')
        if (thumbnail.exists) {
          const img = new ImgFile(thumbnail)
          const imgDataURL = await img.toDataURL()
          packMap.set('dataURL', imgDataURL)
        }
        this.populatePackageMapWithKnownPackageData(packMap, hash)
        packs.push(Object.fromEntries(packMap.entries()) as Record<keyof InstalledSongPackagesStats, unknown> as InstalledSongPackagesStats)
      }
    }

    const usrdirRB1 = devhdd0.gotoDir('game/BLUS30050/USRDIR')
    if (usrdirRB1.exists) {
      for (const pack of (await usrdirRB1.readDir(true)).map((path) => (isFile(path) ? FilePath.of(path) : DirPath.of(path))).filter((path) => path instanceof DirPath && path.name !== 'gen')) {
        rb2PacksCount++
        const parsed = await DTAParser.fromFile(pack.gotoFile('songs/songs.dta'), 'partial')
        rb2SongsCount += parsed.songs.length
        const hash = parsed.calculateHash()
        const packMap = new Map<keyof InstalledSongPackagesStats, unknown>()
        packMap.set('path', pack.path)
        packMap.set('name', pack.name)
        packMap.set('hash', hash)
        packMap.set('origin', 'rb1')
        packMap.set('isOfficial', false)
        packMap.set('songs', parsed.songs)
        const thumbnail = pack.gotoFile('folder.jpg')
        if (thumbnail.exists) {
          const img = new ImgFile(thumbnail)
          const imgDataURL = await img.toDataURL()
          packMap.set('dataURL', imgDataURL)
        }
        this.populatePackageMapWithKnownPackageData(packMap, hash)
        packs.push(Object.fromEntries(packMap.entries()) as Record<keyof InstalledSongPackagesStats, unknown> as InstalledSongPackagesStats)
      }
    }
    rb3.set('packsCount', rb3PacksCount)
    rb3.set('songsCount', rb3SongsCount)
    rb3.set('songsCountIncludingRB3Songs', rb3SongsCount + 83)
    map.set('rb3', Object.fromEntries(rb3.entries()))
    rb2.set('packsCount', rb2PacksCount)
    rb2.set('songsCount', rb2SongsCount)
    map.set('rb2', Object.fromEntries(rb2.entries()))
    map.set('packs', packs)
    map.set('packsCount', rb3PacksCount + rb2PacksCount)
    map.set('songsCount', rb3SongsCount + rb2SongsCount)
    map.set('songsCountIncludingRB3Songs', rb3SongsCount + rb2SongsCount + 83)
    return Object.fromEntries(map.entries()) as Record<keyof RPCS3Stats, unknown> as RPCS3Stats
  }

  /**
   * Creates a Rock Band 3 shortcut.
   * - - - -
   * @param {RB3ShortcutCreationOptions} options An object with paths of your RPCS3 files and folders.
   * @returns {Promise<void>}
   */
  static async createRB3Shortcut(options: RB3ShortcutCreationOptions): Promise<void> {
    const rpcs3ExePath = pathLikeToFilePath(options.rpcs3ExePath)
    const fileShortcutPath = pathLikeToFilePath(options.fileShortcutPath).changeFileExt('.lnk')
    const iconPath = pathLikeToFilePath(resolve(RBTools.bin.path, 'icon/rb3.ico'))
    const psCommand = `
    $WshShell = New-Object -ComObject WScript.Shell;
    $Shortcut = $WshShell.CreateShortcut("${fileShortcutPath.path}");
    $Shortcut.TargetPath = "${rpcs3ExePath.path}";
    $Shortcut.Arguments = "--no-gui %RPCS3_GAMEID%:BLUS30463";
    $Shortcut.IconLocation = "${iconPath.path}";
    $Shortcut.Description = "Rock Band 3";
    $Shortcut.WorkingDirectory = "${rpcs3ExePath.root}";
    $Shortcut.Save();
    `
      .trim()
      .replace(/\n/g, ' ')

    await execAsync(`powershell -NoProfile -Command "${psCommand.replace(/"/g, '\\"')}"`)
  }
}
