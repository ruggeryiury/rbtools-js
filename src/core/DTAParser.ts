import axios, { AxiosError, type AxiosResponse } from 'axios'
import Path, { type PathLikeTypes } from 'path-js'
import { DTAParserError } from '../errors.js'
import { depackDTA, detectBufferEncoding, isURL, parseDTA, type DTAContentParserFormatTypes, type DTAFile, type DTARecord, type DTAStringifyOptions, type PartialDTAFile } from '../lib.js'

export type AllParsedDTATypes = PartialDTAFile | PartialDTAFile[]

/**
 * A class that represents the contents of a DTA file.
 *
 * The constructor accepts
 *
 * You can also automatically parse a DTA file (or DTA file contents) using the following static methods: `fromBuffer()`, `fromFile()`, `fromURL()`.
 *
 * It parses `songs.dta` files by default, but you can parse `songs_upgrades.dta` files, and metadata update DTA files
 * using `'partial'` as second argument for these static constructor callers.
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
    customSource: null,
    autoGeneratePansAndVols: true,
  } as Required<DTAStringifyOptions>

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
    customSource: null,
    autoGeneratePansAndVols: false,
  } as Required<DTAStringifyOptions>

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

  /** An array with object that represents the contents of a DTA song entry. */
  songs: PartialDTAFile[]
  /** The type of the DTA file contents. */
  type: DTAContentParserFormatTypes

  // #region Constructor

  /**
   * @param {AllParsedDTATypes} songs A parsed song object of an array of parsed song objects.
   * @param {DTAContentParserFormatTypes} type The type of the DTA file contents.
   */
  private constructor(songs: AllParsedDTATypes, type: DTAContentParserFormatTypes) {
    this.songs = Array.isArray(songs) ? songs : [songs]
    this.type = type
  }
}
