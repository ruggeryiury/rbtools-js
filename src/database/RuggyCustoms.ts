import { DTAParser } from '../core'
import { sortDTA, type DTAFile } from '../lib'

export class RuggyCustoms {
  static readonly songs: DTAFile[] = [
    DTAParser.create({
      id: '7748paintwar',
      name: 'Paint War',
      artist: 'Dream Avenue',
      albumName: 'Our Shared Universes',
      albumTrackNumber: 4,
      songID: 1774800001,
      genre: {
        genre: 'Pop/Dance/Electronic',
        subGenre: 'Chiptune',
      },
      backingTracksCount: 2,
      bandRank: 3,
      guitar: {
        channels: 2,
        rank: 2,
        rankPRO: 2,
      },
      bass: {
        channels: 2,
        rank: 0,
        rankPRO: 0,
      },
      drum: {
        channels: 2,
        rank: 2,
      },
      keys: {
        channels: 2,
        rank: 2,
        rankPRO: 2,
      },
      rating: 'Family Friendly',
      bandFailCue: 'Vintage',
      preview: [42914, 72914],
      songLength: 119205,
      yearReleased: 2018,
      songKey: 'A',
      author: 'Ruggy',
      multitrack: 'full',
      customsource: {
        game_origin: 'ruggy',
        genre: 'chiptune',
      },
    }),

    DTAParser.create({
      id: '7748tempoperdido',
      name: 'Tempo Perdido',
      artist: 'Legião Urbana',
      albumName: 'Dois',
      albumTrackNumber: 6,
      songID: 1774800052,
      genre: {
        genre: 'New Wave',
        subGenre: 'New Wave',
      },
      backingTracksCount: 2,
      bandRank: 3,
      drum: {
        channels: 5,
        rank: 4,
        vols: [-4, -3, -3, 0, 0],
      },
      bass: {
        channels: 1,
        rank: 2,
        rankPRO: 2,
      },
      guitar: {
        channels: 2,
        rank: 4,
      },
      vocals: {
        channels: 2,
        rank: 2,
        vocalParts: 1,
        hasSolo: true,
      },
      rating: 'Family Friendly',
      bank: 'Hand Clap',
      animTempo: 'Fast (over 160bpm)',
      bandFailCue: 'Vintage',
      preview: [22490, 52490],
      songLength: 235725,
      yearReleased: 1986,
      songKey: 'Em',
      author: 'Ruggy, Nero143',
      stringsAuthor: 'Ruggy',
      multitrack: 'diy_stems',
      emh: 'cat',
      customsource: {
        game_origin: 'ruggy',
      },
      magma: {
        hasLipsyncFiles: null,
      },
    }),
  ]

  /**
   * Returns an array with all songs shortnames as `string`
   * - - - -
   * @returns {string[]}
   */
  static get getAllSongsShortname(): string[] {
    return this.songs.map((song) => song.id)
  }

  /**
   * Returns a list of IDs used on all songs as `string`.
   * - - - -
   * @returns {string}
   */
  static get getIDListString(): string {
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
  static getSongByID(id: string): DTAFile | undefined {
    return this.songs.find((song) => String(song.id) === String(id))
  }
}
