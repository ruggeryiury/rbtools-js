import Path from 'path-js'
import setDefaultOptions from 'set-default-options'
import { RBDTAJSError, WrongDTATypeError } from '../errors.js'
import { detectBufferEncoding, isDTAFile, isURL, genNumericSongID, checkSongEncoding, depackDTA, parseDTA, sortDTA, stringifyDTA, type DTAFile, type DTARecord, type DTAStringifyOptions, type PartialDTAFile, type SongSortingTypes } from '../lib.js'

export type SongConstructorContentTypes = string | Buffer | DTAFile | DTAFile[] | Path
export type SongStringifyOptions = Pick<DTAStringifyOptions, 'format' | 'guitarCores' | 'placeCustomAttributes' | 'placeRB3DXAttributes' | 'sortBy' | 'wiiMode' | 'ignoreFakeSongs' | 'customSource' | 'autoGeneratePansAndVols'>

/**
 * A class that represents the contents of a `songs.dta` file.
 * - - - -
 */
export class SongsDTA {
  /** An array with object that represents the contents of a DTA song entry. */
  songs: DTAFile[] = []

  // #region Constructor
  /**
   * @param {SongConstructorContentTypes} content A path to a `songs.dta` file (as `string` or an instantiated [`Path`](https://github.com/ruggeryiury/path-js) class), the contents of a DTA file (as `string`), a `Buffer` object of a DTA file, a parsed `DTAFile` object, or an array of parsed `DTAFile` objects.
   */
  constructor(content: SongConstructorContentTypes) {
    let str = ''
    let isAnyObject = false
    if (content instanceof Path) {
      if (!content.exists()) throw new RBDTAJSError(`Provided path "${content.path}" does not exists.`)
      const buf = content.readFileSync()
      const enc = detectBufferEncoding(buf)
      str = buf.toString(enc)
    } else if (typeof content === 'string') {
      if (Path.isValidPath(content)) {
        const path = Path.stringToPath(content)
        if (!path.exists()) throw new RBDTAJSError(`Provided path "${path.path}" does not exists.`)
        const buf = path.readFileSync()
        const enc = detectBufferEncoding(buf)
        str = buf.toString(enc)
      } else {
        str = content
      }
    } else if (Array.isArray(content)) {
      isAnyObject = true
      for (const song of content) {
        if (isDTAFile(song)) this.songs.push(song)
        else throw new WrongDTATypeError('Tried to parse songs with complete information but all necessary values were not found. Try using "SongsUpdatesDTA" class instead.')
      }
    } else if (Buffer.isBuffer(content)) {
      const enc = detectBufferEncoding(content)
      str = content.toString(enc)
    } else if (isDTAFile(content)) {
      isAnyObject = true
      this.songs.push(content)
    } else throw new RBDTAJSError('Tried to parse songs but the provided argument does not match any of the available DTA file types.')

    if (isAnyObject && !str) return

    const depackedSongs = depackDTA(str)
    this.songs = depackedSongs.map((songContent) => Object.fromEntries(parseDTA(songContent, { format: 'complete', omitUnusedValues: true, registerCores: false })) as DTARecord as DTAFile)
  }

  // #region Static Methods
  /**
   * Asynchronously fetches a `songs.dta` file from an URL.
   * - - - -
   * @param {string} url The URL of the `.dta` file.
   * @returns {Promise<SongsDTA>} A new instantiated `SongsDTA` class.
   */
  static async fromURL(url: string): Promise<SongsDTA> {
    if (!isURL(url)) throw new RBDTAJSError(`Provided URL "${url}" is not a valid URL.`)

    try {
      const response = await fetch(url)

      if (!response.ok) throw new RBDTAJSError(`Provided URL "${url}" is not a valid URL.`)

      const data = await response.arrayBuffer()
      return new SongsDTA(Buffer.from(data))
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  // #region Class Methods

  /**
   * Returns a specific song contents based on its song ID (shortname). If no song if found, it will returns as `undefined`.
   * - - - -
   * @param {string} id The unique shortname ID of the song you want to fetch.
   * @returns {DTAFile | undefined}
   */
  getSongByID(id: string): DTAFile | undefined {
    return this.songs.find((song) => String(song.id) === String(id))
  }

  /**
   * Patches non-numerical song IDs to numerical ones, using specific CRC32 hashing method.
   *
   * [_See the original C# function on **GitHub Gist**_](https://gist.github.com/InvoxiPlayGames/f0de3ad707b1d42055c53f0fd1428f7f), coded by [Emma (InvoxiPlayGames)](https://gist.github.com/InvoxiPlayGames).
   */
  patchSongIDs(): void {
    this.songs = this.songs.map((song) => ({ ...song, song_id: Math.abs(genNumericSongID(song.song_id)) }))
  }

  /**
   * Patches the encoding values of each song.
   */
  patchEncodings(): void {
    this.songs = this.songs.map((song) => {
      song.encoding = checkSongEncoding(song)
      return song
    })
  }

  /**
   * Updates a song contents based on its song ID (shortname).
   * - - - -
   * @param {string} id The unique shortname ID of the song you want to update.
   * @param {PartialDTAFile} update An object with updates values to be applied on the `DTAFile` song entry.
   */
  update(id: string, update: PartialDTAFile): void {
    this.songs = this.songs.map((song) => {
      if (String(song.id) === String(id)) {
        return { ...song, ...update }
      }
      return song
    })
  }

  /**
   * Updates all songs with provided update values.
   * - - - -
   * @param {PartialDTAFile} update An object with updates values to be applied on each `DTAFile` song entry.
   */
  updateAll(update: PartialDTAFile): void {
    this.songs = this.songs.map((song) => ({ ...song, ...update }))
  }

  /**
   * Sorts all songs entries using several sorting methods.
   * - - - -
   * @param {SongSortingTypes} sortBy The sorting method type.
   */
  sort(sortBy: SongSortingTypes): void {
    this.songs = sortDTA(this.songs, sortBy)
  }

  /**
   * Stringifies all songs from this class to `.dta` file contents.
   * - - - -
   * @param {SongStringifyOptions} options `OPTIONAL` An object with values that changes the behavior of the stringify process.
   * @returns {string}
   */
  stringify(options?: SongStringifyOptions): string {
    const opts = setDefaultOptions<SongStringifyOptions>(
      {
        format: 'rbn',
        guitarCores: false,
        placeCustomAttributes: true,
        placeRB3DXAttributes: true,
        sortBy: null,
        wiiMode: null,
        ignoreFakeSongs: true,
        customSource: null,
        autoGeneratePansAndVols: true,
      },
      options
    )
    return stringifyDTA(this.songs, 'songs', opts)
  }

  /**
   * Returns a JSON representation of the DTA File class.
   * - - - -
   * @returns {DTAFile[]}
   */
  toJSON(): DTAFile[] {
    return this.songs
  }
}
