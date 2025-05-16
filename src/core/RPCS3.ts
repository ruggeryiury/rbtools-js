import { DirPath, FilePath, isFile, pathLikeToDirPath, pathLikeToFilePath, pathLikeToString, type DirPathLikeTypes, type FilePathLikeTypes } from 'node-lib'
import { parse as parseYAMLBuffer } from 'yaml'
import type { DTAFile, PartialDTAFile } from '../lib.exports'
import { DTAParser } from './DTAParser'
import { RB3SaveData, type ParsedRB3SaveData } from './RB3SaveData'

export interface RPCS3ConstructorOptions {
  /** The path to RPCS3 `dev_hdd0` folder. */
  devhdd0Path: DirPathLikeTypes
  /** The path to RPCS3 executable. If not provided, it will be resolved to `../rpcs3.exe` from the provided `devhdd0Path` parameter. */
  rpcs3ExePath?: FilePathLikeTypes
}

export type RPCS3ClassJSONRepresentation = Record<keyof RPCS3ConstructorOptions, string>

export type SupportedRBGamesIDs =
  // Rock Band 2
  | 'BLUS30147'
  // Rock Band 3
  | 'BLUS30463'

export interface SupportedGamesStatsBase {
  /**
   * The path where the game is installed.
   */
  path: string
  /**
   * The name of the game.
   */
  name: string
  /**
   * The catalog ID of the game.
   */
  id: string
  /**
   * The path to the game save data file.
   */
  saveDataPath: string
  /**
   * Tells if the game has a save data file.
   */
  hasSaveData: boolean
  /**
   * Tells if the game has any update (official or MiloHax's Deluxe) installed.
   */
  hasUpdate: boolean
  /**
   * Tells if the game has any MiloHax Deluxe patch installed.
   */
  hasDeluxe: boolean
}

export type RockBand3SpecificStats = SupportedGamesStatsBase & {
  /**
   * The type of the update installed.
   */
  updateType: 'milohax_dx' | 'tu5' | 'unknown'
  deluxeVersion: string | null
  /**
   * Tells if the Teleport Glitch Patch is installed.
   */
  hasTeleportGlitchPatch: boolean
  /**
   * Tells if the High Memory Patch is installed.
   */
  hasHighMemoryPatch: boolean
}

export type RockBand2SpecificStats = SupportedGamesStatsBase & {
  /**
   * The type of the update installed.
   */
  updateType: 'milohax_dx' | 'tu2' | 'unknown'
}
export interface RPCS3GamesStats {
  /**
   * Information about Rock Band 3. If the value is `null`, it means that the user doesn't have Rock Band 3 installed.
   */
  BLUS30463?: RockBand3SpecificStats
  /**
   * Information about Rock Band 2. If the value is `null`, it means that the user doesn't have Rock Band 2 installed.
   */
  BLUS30147?: RockBand2SpecificStats
}

export interface InstalledSongPackagesStats {
  /** The path of the song package. */
  path: string
  /** The name of the package. */
  name: string
  /** A hash identifying the song package. */
  packHash: string
  /** The game this pack belongs to. */
  origin: 'pre_rb3' | 'rb3'
  /** Whether the package is an official one. */
  isOfficial: boolean
  /** List of songs included in the package. */
  songs: (DTAFile | PartialDTAFile)[]
}

export interface SongPackagesStats {
  /**
   * The quantity of packs installed on the Rock Band 3 DLC folder.
   */
  rb3PacksCount: number
  /**
   * The quantity of songs installed on the Rock Band 3 DLC folder.
   */
  rb3SongsCount: number
  /**
   * The quantity of packs installed on the Rock Band 1 DLC folder.
   */
  preRB3PacksCount: number
  /**
   * The quantity of songs installed on the Rock Band 1 DLC folder.
   */
  preRB3SongsCount: number
  /**
   * The quantity of packs installed that works on both all main Rock Band titles.
   */
  allPacksCount: number
  /**
   * The quantity of songs installed that works on both all main Rock Band titles.
   */
  allSongsCount: number
  /**
   * The quantity of packs installed that works on both all main Rock Band titles, including the 83 songs from Rock Band 3.
   */
  allSongsCountWithRB3Songs: number
  /**
   * An array with information about all song packages installed.
   */
  packs: InstalledSongPackagesStats[]
}

/**
 * A class for analyzing an RPCS3 emulator environment.
 * - - - -
 */
export class RPCS3 {
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
   * Checks if a package DTA file hash has known package data from the database, returning `false` if not.
   * - - - -
   * @param {string} packHash The hash of the package's DTA file.
   * @returns {Partial<InstalledSongPackagesStats> | false}
   */
  static checkHashForKnownPackages(packHash: string): Partial<InstalledSongPackagesStats> | false {
    switch (packHash) {
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
   * @param {string} packHash The hash of the package's DTA file.
   * @returns {void}
   */
  private static populatePackageMapWithKnownPackageData(packMap: Map<keyof InstalledSongPackagesStats, unknown>, packHash: string): void {
    const data = this.checkHashForKnownPackages(packHash)
    if (!data) return

    for (const keys of Object.keys(data) as (keyof Partial<InstalledSongPackagesStats>)[]) {
      packMap.set(keys, data[keys])
    }
  }

  /**
   * The path to RPCS3 `dev_hdd0` folder.
   */
  devhdd0Path: DirPath
  /**
   * The path to RPCS3 executable.
   */
  rpcs3ExePath: FilePath

  /**
   * @param {RPCS3ConstructorOptions} options An object with all paths of your RPCS3 emulator environment, or the RPCS3's `dev_hdd0` path as any directory path like type.
   */
  constructor(options: DirPathLikeTypes | RPCS3ConstructorOptions) {
    if ((typeof options === 'object' && 'path' in options) || options instanceof DirPath || typeof options === 'string') {
      this.devhdd0Path = pathLikeToDirPath(options)
      this.rpcs3ExePath = this.devhdd0Path.gotoFile('../rpcs3.exe')
    } else {
      this.devhdd0Path = pathLikeToDirPath(pathLikeToString(options.devhdd0Path))
      this.rpcs3ExePath = pathLikeToFilePath(pathLikeToString(options.rpcs3ExePath ?? this.devhdd0Path.gotoFile('../rpcs3.exe')))
    }

    if (!RPCS3.isDevHDD0PathValid(this.devhdd0Path)) throw new Error(`Provided path ${this.devhdd0Path.path} is not a valid RPCS3 dev_hdd0 folder.`)
    if (!RPCS3.isRPCS3ExePathValid(this.rpcs3ExePath)) throw new Error(`Provided path ${this.rpcs3ExePath.path} is not a valid RPCS3 executable path.`)
    const gamesYmlPath = this.rpcs3ExePath.gotoFile('config/games.yml')
    if (!gamesYmlPath.exists) throw new Error(`games.yml file not found on RPCS3's config folder. If you're just installed RPCS3, try to initialize it and find a PS3 game on the emulator first.`)
  }

  /**
   * Returns a JSON representation of this `RPCS3` class instance.
   * - - - -
   * @returns {RPCS3ClassJSONRepresentation}
   */
  getRPCS3Stats(): RPCS3ClassJSONRepresentation {
    return {
      devhdd0Path: this.devhdd0Path.path,
      rpcs3ExePath: this.rpcs3ExePath.path,
    }
  }

  /**
   * Returns an object with stats of each supported Rock Band game, if installed.
   * - - - -
   * @returns {Promise<RPCS3GamesStats>}
   */
  async getRockBandGamesStats(): Promise<RPCS3GamesStats> {
    const map = new Map<keyof RPCS3GamesStats, unknown>()
    const games = parseYAMLBuffer(await this.rpcs3ExePath.gotoFile('config/games.yml').read('utf8')) as Record<SupportedRBGamesIDs, string>

    if ('BLUS30463' in games) {
      const rb3 = new Map<keyof RockBand3SpecificStats, unknown>()
      const rb3GamePath = pathLikeToDirPath(games.BLUS30463)
      rb3.set('path', rb3GamePath.path)
      rb3.set('name', 'Rock Band 3')
      rb3.set('id', 'BLUS30463')

      const saveDataPath = this.devhdd0Path.gotoFile('home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT')
      rb3.set('saveDataPath', saveDataPath.path)
      rb3.set('hasSaveData', saveDataPath.exists)

      const gen = this.devhdd0Path.gotoDir('game/BLUS30463/USRDIR/gen')
      const hdr = gen.gotoFile('patch_ps3.hdr')
      const ark = gen.gotoFile('patch_ps3_0.ark')
      rb3.set('hasUpdate', gen.exists && hdr.exists && ark.exists)
      rb3.set('hasDeluxe', false)
      rb3.set('updateType', 'unknown')
      rb3.set('deluxeVersion', 'null')
      rb3.set('hasTeleportGlitchPatch', false)
      rb3.set('hasHighMemoryPatch', false)
      if (hdr.exists && ark.exists) {
        const arkStats = await ark.stat()
        const hdrStats = await hdr.stat()

        // Only RB3DX update can be bigger than 500mb
        if (arkStats.size > 0x1f400000) {
          rb3.set('hasDeluxe', true)
          rb3.set('updateType', 'milohax_dx')
          rb3.set('deluxeVersion', 'unknown')
        }

        // Title Update 5?
        else if (hdrStats.size === 0x8d69) rb3.set('updateType', 'tu5')
      }

      if (rb3GamePath.gotoFile('PS3_GAME/USRDIR/gen/main_ps3_vanilla.hdr').exists && rb3GamePath.gotoFile('PS3_GAME/USRDIR/gen/main_ps3_10.ark').exists) rb3.set('hasTeleportGlitchPatch', true)
      if (gen.gotoFile('../dx_high_memory.dta').exists) rb3.set('hasHighMemoryPatch', true)

      map.set('BLUS30463', Object.fromEntries(rb3.entries()))
    }

    if ('BLUS30147' in games) {
      const rb2 = new Map<keyof RockBand2SpecificStats, unknown>()
      const rb2GamePath = pathLikeToDirPath(games.BLUS30147)
      rb2.set('path', rb2GamePath.path)
      rb2.set('name', 'Rock Band 2')
      rb2.set('id', 'BLUS30147')

      const saveDataPath = this.devhdd0Path.gotoFile('home/00000001/savedata/BLUS30147-AUTOSAVE/RB2.SAV')
      rb2.set('saveDataPath', saveDataPath.path)
      rb2.set('hasSaveData', saveDataPath.exists)

      const gen = this.devhdd0Path.gotoDir('game/BLUS30147/USRDIR/gen')
      const hdr = gen.gotoFile('patch_ps3.hdr')
      const ark = gen.gotoFile('patch_ps3_0.ark')
      rb2.set('hasUpdate', gen.exists && hdr.exists && ark.exists)
      rb2.set('hasDeluxe', false)
      rb2.set('updateType', 'unknown')
      if (hdr.exists && ark.exists) {
        const arkStats = await ark.stat()
        const hdrStats = await hdr.stat()

        // Only RB2DX update can be bigger than 300mb
        if (arkStats.size > 0x12c00000) {
          rb2.set('hasDeluxe', true)
          rb2.set('updateType', 'milohax_dx')
        }

        // Title Update 2?
        else if (hdrStats.size === 0x5d85) rb2.set('updateType', 'tu2')
      }

      map.set('BLUS30147', Object.fromEntries(rb2.entries()))
    }

    return Object.fromEntries(map.entries()) as Record<keyof RPCS3GamesStats, unknown> as RPCS3GamesStats
  }

  /**
   * Returns an object containing information about all installed song packages.
   * - - - -
   * @returns {Promise<SongPackagesStats>}
   */
  async getSongPackages(): Promise<SongPackagesStats> {
    const packs: InstalledSongPackagesStats[] = []
    let rb3PacksCount = 0,
      rb3SongsCount = 0,
      preRB3PacksCount = 0,
      preRB3SongsCount = 0

    // TO-DO Adding Rock Band 3 On Disc songs
    const usrdir = this.devhdd0Path.gotoDir('game/BLUS30463/USRDIR')
    if (usrdir.exists) {
      const allPacks = (await usrdir.readDir(true))
        .map((entry) => (isFile(entry) ? FilePath.of(entry) : DirPath.of(entry)))
        .filter((entry) => entry instanceof DirPath && entry.name !== 'gen')
        .map((entry) => entry.gotoFile('songs/songs.dta'))

      for (const pack of allPacks) {
        if (pack.exists) {
          rb3PacksCount++
          const parsedData = await DTAParser.fromFile(pack)
          rb3SongsCount += parsedData.songs.length
          const packHash = parsedData.calculateHash()
          const packMap = new Map<keyof InstalledSongPackagesStats, unknown>()
          packMap.set('path', pack.path)
          packMap.set('name', pack.gotoDir('../').name)
          packMap.set('packHash', packHash)
          packMap.set('origin', 'rb3')
          packMap.set('isOfficial', false)
          packMap.set('songs', parsedData.toJSON())
          RPCS3.populatePackageMapWithKnownPackageData(packMap, packHash)
          packs.push(Object.fromEntries(packMap.entries()) as Record<keyof InstalledSongPackagesStats, unknown> as InstalledSongPackagesStats)
        }
      }
    }

    const usrdirPreRB3 = this.devhdd0Path.gotoDir('game/BLUS30050/USRDIR')
    if (usrdirPreRB3.exists) {
      const allPacks = (await usrdirPreRB3.readDir(true))
        .map((entry) => (isFile(entry) ? FilePath.of(entry) : DirPath.of(entry)))
        .filter((entry) => entry instanceof DirPath && entry.name !== 'gen')
        .map((entry) => entry.gotoFile('songs/songs.dta'))

      for (const pack of allPacks) {
        if (pack.exists) {
          preRB3PacksCount++
          const parsedData = await DTAParser.fromFile(pack, 'partial')
          preRB3SongsCount += parsedData.songs.length
          const packHash = parsedData.calculateHash()
          const packMap = new Map<keyof InstalledSongPackagesStats, unknown>()
          packMap.set('path', pack.path)
          packMap.set('name', pack.gotoDir('../').name)
          packMap.set('packHash', packHash)
          packMap.set('origin', 'pre_rb3')
          packMap.set('isOfficial', false)
          packMap.set('songs', parsedData.toJSON())
          RPCS3.populatePackageMapWithKnownPackageData(packMap, packHash)
          packs.push(Object.fromEntries(packMap.entries()) as Record<keyof InstalledSongPackagesStats, unknown> as InstalledSongPackagesStats)
        }
      }
    }

    return {
      rb3PacksCount,
      rb3SongsCount,
      preRB3PacksCount,
      preRB3SongsCount,
      allPacksCount: rb3PacksCount + preRB3PacksCount,
      allSongsCount: rb3SongsCount + preRB3SongsCount,
      allSongsCountWithRB3Songs: 83 + rb3SongsCount + preRB3SongsCount,
      packs,
    }
  }

  /**
   * Returns the parsed Rock Band 3 save data with profile name and all your scores. If no save data file is found, it will return `undefined`.
   * - - - -
   * @returns {Promise<ParsedRB3SaveData | undefined>}
   */
  async getRB3SaveData(): Promise<ParsedRB3SaveData | undefined> {
    const saveDataPath = this.devhdd0Path.gotoFile('home/00000001/savedata/BLUS30463-AUTOSAVE/SAVE.DAT')
    if (saveDataPath.exists) return await RB3SaveData.parseFromFile(saveDataPath)
  }
}
