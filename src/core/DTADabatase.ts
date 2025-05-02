import { sortDTA, type DTAFile } from '../lib.exports'

/**
 * A class that acts as a DTA file database processor.
 * - - - -
 */
export class DTADatabase<T extends DTAFile> {
  /**
   * An array with all songs from the database.
   */
  readonly songs: T[]
  /**
   * @param {T[] | undefined} songs `OPTIONAL` An array with parsed songs to be added on the database,
   * or `undefined` if you want to add
   */
  constructor(songs?: T[]) {
    this.songs = songs ?? []
  }

  /**
   * Adds more songs to the database.
   * - - - -
   * @param {T[]} songs The songs to be added.
   */
  addSongs(...songs: T[]) {
    this.songs.push(...songs)
  }

  /**
   * Returns an array with all songs shortnames as `string`
   * - - - -
   * @returns {string[]}
   */
  get getAllSongsShortname(): string[] {
    return this.songs.map((song) => song.id)
  }

  /**
   * Returns a list of IDs used on all songs as `string`.
   * - - - -
   * @returns {string}
   */
  get getIDListString(): string {
    let output = ''
    const sortedSongs = sortDTA(this.songs, 'Song ID')

    for (const songs of sortedSongs) {
      output += `${String(songs.song_id).slice(-3)} ${songs.name}\n`
    }

    return output
  }

  /**
   * Get the parsed song object based on its ID (shortname).
   * - - - -
   * @param {string} id The ID (shortname) of the song.
   * @returns {DTAFile | undefined} Returns the found parsed song object or
   * `undefined` if no song is found.
   */
  getSongByID(id: string): DTAFile | undefined {
    return this.songs.find((song) => String(song.id) === String(id))
  }
}
