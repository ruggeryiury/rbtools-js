import axios, { AxiosError, type AxiosResponse } from 'axios'
import { Path, type PathLikeTypes } from 'path-js'
import { setDefaultOptions } from 'set-default-options'
import type { RequiredDeep } from 'type-fest'
import { DTAParserError, WrongDTATypeError } from '../errors'
import { calculateHashFromBuffer, depackDTA, detectBufferEncoding, genNumericSongID, getCompleteDTAMissingValues, isDTAFile, isURL, parseDTA, patchDTAEncodingFromDTAFileObject, sortDTA, stringifyDTA, type DTAContentParserFormatTypes, type DTAFile, type DTARecord, type DTAStringifyOptions, type PartialDTAFile, type SongEncoding, type SongSortingTypes } from '../lib'
import { createDTA, type SongDataCreationObject } from '../lib/dta/createDTA'

export type AllParsedDTATypes = PartialDTAFile | PartialDTAFile[]

/**
 * A class that represents the contents of a DTA file.
 *
 * The constructor accepts a parsed song object or an array of parsed song objects.
 * You can also automatically parse a DTA file (or DTA file contents) using the
 * following static methods: `fromBuffer()`, `fromFile()`, `fromURL()`.
 * - - - -
 */
export class DTAParser {
  // #region Default opts objects

  /**
   * Default options to stringify DTA file contents for complete DTAParser types.
   */
  static readonly completeDTADefaultOptions = {
    guitarCores: true,
    ignoreFakeSongs: false,
    placeCustomAttributes: true,
    placeRB3DXAttributes: true,
    sortBy: null,
    format: 'rb3_dlc',
    wiiMode: null,
    allSongsInline: false,
    useCustomSourceValues: true,
    autoGeneratePansAndVols: true,
  } as RequiredDeep<DTAStringifyOptions>

  /**
   * Default options to stringify DTA file contents for partial DTAParser types (with incomplete metadata).
   */
  static readonly partialDTADefaultOptions = {
    guitarCores: false,
    ignoreFakeSongs: false,
    placeCustomAttributes: false,
    placeRB3DXAttributes: true,
    sortBy: null,
    format: 'rb3_dlc',
    wiiMode: null,
    allSongsInline: false,
    useCustomSourceValues: false,
    autoGeneratePansAndVols: false,
  } as RequiredDeep<DTAStringifyOptions>

  // #region Static Constructors

  /**
   * Loads a DTA file buffer.
   * - - - -
   * @param {Buffer} buffer The buffer of the DTA file.
   * @param {DTAContentParserFormatTypes | undefined} type `OPTIONAL` The type of the DTA file contents. Some DTAs (like from updates, and official pre-RB3 DTA files) might need to set this as `'partial'`, since they might not have all the values expected to be recognized as a song on RB3's music library. Default is `'complete'`.
   * @returns {DTAParser}
   */
  static fromBuffer(buffer: Buffer, type: DTAContentParserFormatTypes = 'complete'): DTAParser {
    const enc = detectBufferEncoding(buffer)
    const contents = buffer.toString(enc)
    const depackedSongs = depackDTA(contents)
    if (type === 'complete') {
      const songs = depackedSongs.map((songContent) => Object.fromEntries(parseDTA(songContent, { format: type, omitUnusedValues: true, registerCores: false })) as DTARecord as DTAFile)
      return new DTAParser(songs, type)
    }
    const songs = depackedSongs.map((songContent) => Object.fromEntries(parseDTA(songContent, { format: type, omitUnusedValues: false, registerCores: true })) as DTARecord as PartialDTAFile)
    return new DTAParser(songs, type)
  }

  /**
   * Fetches a DTA file from the web.
   * - - - -
   * @param {string} url The URL of the DTA file.
   * @param {DTAContentParserFormatTypes | undefined} type `OPTIONAL` The type of the DTA file contents. Some DTAs (like from updates, and official pre-RB3 DTA files) might need to set this as `'partial'`, since they might not have all the values expected to be recognized as a song on RB3's music library. Default is `'complete'`.
   * @param {number} fetchTimeout `OPTIONAL` Sets the timeout of the data fetching process. Default is `5000` (5 seconds).
   * @returns {Promise<DTAParser>}
   */
  static async fromURL(url: string, type: DTAContentParserFormatTypes = 'complete', fetchTimeout = 5000): Promise<DTAParser> {
    if (!isURL(url)) throw new DTAParserError(`Provided URL "${url}" is not a valid URL.`)
    let dtaRes: AxiosResponse<ArrayBuffer>
    try {
      dtaRes = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer', timeout: fetchTimeout })
    } catch (err) {
      if (err instanceof AxiosError) throw new DTAParserError(err.message)
      else throw err
    }
    if (dtaRes.status !== 200) throw new DTAParserError(`URL returned with error with status ${dtaRes.status.toString()}.`)
    return DTAParser.fromBuffer(Buffer.from(dtaRes.data), type)
  }

  /**
   * Reads a DTA file.
   * - - - -
   * @param {PathLikeTypes} dtaFilePath The path of the DTA file.
   * @param {DTAContentParserFormatTypes | undefined} type `OPTIONAL` The type of the DTA file contents. Some DTAs (like from updates, and official pre-RB3 DTA files) might need to set this as `'partial'`, since they might not have all the values expected to be recognized as a song on RB3's music library. Default is `'complete'`.
   * @returns {Promise<DTAParser>}
   */
  static async fromFile(dtaFilePath: PathLikeTypes, type: DTAContentParserFormatTypes = 'complete'): Promise<DTAParser> {
    const path = Path.stringToPath(dtaFilePath)
    if (!Path.isValidPath(path.path)) throw new DTAParserError(`Provided argument "${path.path}" is not a path or the file does not exists`)
    const dtaBuffer = await path.readFile()
    return DTAParser.fromBuffer(dtaBuffer, type)
  }

  /**
   * Returns a SHA256 hash from a DTA file `Buffer`.
   * - - - -
   * @param {Buffer} dtaFileBuffer A `Buffer` object from a DTA file.
   * @returns {string}
   */
  static calculateHashFromBuffer(dtaFileBuffer: Buffer): string {
    let parsed: DTAParser
    try {
      parsed = DTAParser.fromBuffer(dtaFileBuffer)
    } catch (err) {
      if (err instanceof WrongDTATypeError) {
        parsed = DTAParser.fromBuffer(dtaFileBuffer, 'partial')
      } else throw err
    }

    parsed.sort('ID')
    return calculateHashFromBuffer(Buffer.from(parsed.toString()))
  }

  /**
   * Asynchronously reads and parses a DTA file and returns a SHA256 hash from it.
   * - - - -
   * @param {PathLikeTypes} dtaFilePath The path to a DTA file.
   * @returns {Promise<string>}
   */
  static async calculateHashFromFile(dtaFilePath: PathLikeTypes): Promise<string> {
    const dtaPath = Path.stringToPath(dtaFilePath)
    const dtaBuffer = await dtaPath.readFile()
    return DTAParser.calculateHashFromBuffer(dtaBuffer)
  }

  /**
   * Creates a complete `DTAFile` object from a song's data.
   * - - - -
   * @param {SongDataCreationObject} songdata An object with values of the song.
   * @returns {DTAFile}
   */
  static create(songdata: SongDataCreationObject): DTAFile {
    return createDTA(songdata)
  }

  /** An array with object that represents the contents of a DTA song entry. */
  songs: PartialDTAFile[] = []
  /** The type of the DTA file contents. */
  private type: DTAContentParserFormatTypes

  // #region Constructor

  /**
   * @param {AllParsedDTATypes} songs A parsed song object of an array of parsed song objects.
   * @param {DTAContentParserFormatTypes | undefined} type `OPTIONAL` The type of the DTA file contents. Some DTAs (like from updates, and official pre-RB3 DTA files) might need to set this as `'partial'`, since they might not have all the values expected to be recognized as a song on RB3's music library. Default is `'complete'`.
   */
  constructor(songs: AllParsedDTATypes, type: DTAContentParserFormatTypes = 'complete') {
    this.type = type
    const mustBeComplete = type === 'complete'
    if (mustBeComplete) {
      if (Array.isArray(songs)) {
        for (const song of songs) {
          if (!isDTAFile(song)) throw new WrongDTATypeError(`Song with ID "${song.id}" has missing information for a complete parsing type. Missing values: ${getCompleteDTAMissingValues(song).join(', ')}`)
        }
      } else {
        if (!isDTAFile(songs)) throw new WrongDTATypeError(`Song with ID "${songs.id}" has missing information for a complete parsing type. Missing values: ${getCompleteDTAMissingValues(songs).join(', ')}`)
      }
    }
    this.songs = Array.isArray(songs) ? songs : [songs]
  }

  /**
   * Returns the songs count of the collection.
   * - - - -
   * @returns {number}
   */
  length(): number {
    return this.songs.length
  }

  /**
   * Returns the type used for this DTA file to be parsed.
   * - - - -
   * @returns {DTAContentParserFormatTypes}
   */
  getType(): DTAContentParserFormatTypes {
    return this.type
  }

  /**
   * Returns all parsed song objects from the collection.
   * - - - -
   * @returns {PartialDTAFile[]}
   */
  toJSON(): PartialDTAFile[] {
    return this.songs
  }

  /**
   * Stringifies all songs from this class to `.dta` file contents.
   * - - - -
   * @param {DTAStringifyOptions} options `OPTIONAL` An object with values that changes the behavior of the stringify process.
   * @returns {string}
   */
  toString(options?: DTAStringifyOptions): string {
    const opts = setDefaultOptions<DTAStringifyOptions>(this.type === 'complete' ? DTAParser.completeDTADefaultOptions : DTAParser.partialDTADefaultOptions, options)
    return stringifyDTA(this.songs, this.type, opts)
  }

  /**
   * Adds a new song to the collection. This function only adds songs when the instantiated class type is `'complete'`.
   * - - - -
   * @param {DTAFile | DTAFile[]} songs A parsed song object of an array of parsed song objects.
   */
  addNewSongs(songs: DTAFile | DTAFile[]): void {
    if (this.type === 'complete') {
      if (Array.isArray(songs)) {
        this.songs.push(...songs)
        return
      }
      this.songs.push(songs)
    }
  }

  /**
   * Get the parsed song object based on its ID (shortname).
   * - - - -
   * @param {string} id The ID (shortname) of the song.
   * @returns {PartialDTAFile | undefined} Returns the found parsed song object or
   * `undefined` if no song is found.
   */
  getSongByID(id: string): PartialDTAFile | undefined {
    return this.songs.find((song) => String(song.id) === String(id))
  }

  /**
   * Applies updates to each song individually by providing a parsed song object, or an
   * array of parsed song objects that will update a song of the collection if the ID (shortname)
   * of the update objects matches a song ID (shortname) from the collection.
   * - - - -
   * @param {AllParsedDTATypes} updates A parsed song object of an array of parsed song objects with unique
   * text IDs that will update a song from the collection if the ID (shortname) of the update object matches
   * a song ID (shortname) from the collection.
   * @param {boolean} allowNewSongEntriesInjection If `true`, updates for songs that don't have an entry
   * created when the class is first instantiated will be placed. Default if `false`.
   *
   * Set this to `false` if you want to apply updates on any `DTAParser` class instantiated as `'partial'`
   * without adding new songs to it.
   * @returns {void}
   */
  applyUpdates(updates: AllParsedDTATypes, allowNewSongEntriesInjection = false): void {
    if (Array.isArray(updates)) {
      for (const update of updates) {
        const { id } = update
        const index = this.songs.findIndex((song) => String(song.id) === String(id))
        if (index === -1 && this.type === 'complete') continue
        else if (index === -1 && this.type === 'partial') {
          if (!allowNewSongEntriesInjection) continue
          else {
            this.songs.push(update)
            continue
          }
        } else {
          const newSongObject = { ...this.songs[index], ...update }
          this.songs[index] = newSongObject
        }
      }
    } else {
      const { id } = updates
      const index = this.songs.findIndex((song) => String(song.id) === String(id))
      if (index === -1 && this.type === 'complete') return
      else if (index === -1 && this.type === 'partial') {
        if (!allowNewSongEntriesInjection) return
        else {
          this.songs.push(updates)
          return
        }
      } else {
        const newSongObject = { ...this.songs[index], ...updates }
        this.songs[index] = newSongObject
      }
    }
  }

  /**
   * Updates a song contents based on its song ID (shortname).
   * - - - -
   * @param {string} id The unique shortname ID of the song you want to update.
   * @param {PartialDTAFile} update An object with updates values to be applied on the matched song of the collection.
   */
  applyUpdatesByID(id: string, update: PartialDTAFile): void {
    this.songs = this.songs.map((song) => {
      if (String(song.id) === String(id)) {
        return { ...song, ...update }
      }
      return song
    })
  }

  /**
   * Updates all songs from the collection with provided update values.
   * - - - -
   * @param {PartialDTAFile} update An object with updates values to be applied on each song of the collection.
   */
  applyUpdatesToAllSongs(update: PartialDTAFile): void {
    this.songs = this.songs.map((song) => ({ ...song, ...update }))
  }

  /**
   * Sorts all songs from the collection using several sorting methods.
   * - - - -
   * @param {SongSortingTypes} sortBy The sorting method type.
   */
  sort(sortBy: SongSortingTypes): void {
    this.songs = sortDTA(this.songs, sortBy)
  }

  /**
   * Saves all songs from the instantiated class collection to a DTA file.
   * - - - -
   * @param {PathLikeTypes} destPath The destination path of the new DTA file.
   * @param {DTAStringifyOptions | undefined} options `OPTIONAL` An object with values that changes the behavior of the stringify process.
   * @param {SongEncoding | undefined} encoding The encoding of the DTA file. Default is `utf8`.
   * @returns {Promise<Path>}
   */
  async saveToFile(destPath: PathLikeTypes, options?: DTAStringifyOptions, encoding: SongEncoding = 'utf8'): Promise<Path> {
    const dest = Path.stringToPath(destPath)
    const content = this.toString(options)
    return new Path(await dest.writeFile(content, encoding))
  }

  /**
   * Calculates a SHA256 hash of the songs included on this class instance.
   * - - - -
   * @returns {string}
   */
  calculateHash(): string {
    const dtaBuffer = Buffer.from(stringifyDTA(sortDTA(this.songs, 'ID'), this.type, this.type === 'complete' ? DTAParser.completeDTADefaultOptions : DTAParser.partialDTADefaultOptions))
    return calculateHashFromBuffer(dtaBuffer)
  }

  /**
   * Patches non-numerical song IDs to numerical ones, using specific CRC32 hashing method.
   *
   * [_See the original C# function on **GitHub Gist**_](https://gist.github.com/InvoxiPlayGames/f0de3ad707b1d42055c53f0fd1428f7f), coded by [Emma (InvoxiPlayGames)](https://gist.github.com/InvoxiPlayGames).
   */
  patchIDs(): void {
    this.songs = this.songs.map((song) => {
      if (song.song_id) {
        return { ...song, song_id: Math.abs(genNumericSongID(song.song_id)) }
      }
      return song
    })
  }

  /**
   * Patches the encoding values of each song. This method checks all string values
   * for non-ASCII compatible characters and sets each song's encoding correctly.
   */
  patchEncodings(): void {
    if (this.type === 'complete') {
      this.songs = this.songs.map((song) => {
        song.encoding = patchDTAEncodingFromDTAFileObject(song)
        return song
      })
    } else {
      this.songs = this.songs.map((song) => {
        song.encoding = patchDTAEncodingFromDTAFileObject(song)
        return song
      })
    }
  }
}
