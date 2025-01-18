import type { LiteralUnion } from 'type-fest'
import { dtaLocale, type AnimTempoNumbers, type BandFailCue, type DrumBank, type ExtraAuthoringFlags, type PercussionBank, type SoloFlags, type SongEncoding, type SongGameOrigin, type SongGenre, type SongKey, type SongRating, type SongScrollSpeed, type SongSubGenre, type SongTonality, type VocalGender, type VocalParts } from '../../lib.js'

export type DTATracksCountArray = [number, number, number, number, number, number, number?]

/**
 * A parsed song object with all its contents.
 */
export interface DTAFile {
  /**
   * An unique shortname ID of the song.
   */
  id: string
  /**
   * The song's title.
   */
  name: string
  /**
   * The song's artist/band.
   */
  artist: string
  /**
   * Tells if the song is a master recording.
   */
  master: boolean
  /**
   * If `true`, the song won't appear on the song library. Default is `false`.
   */
  fake?: boolean
  /**
   * A numerical, unique number ID of the song, used as an ID for saving scores. Might be a string ID as well (but scores won't be saved on these songs).
   */
  song_id: number | string
  upgrade_version?: number
  /**
   * The filename used inside the song's CON file structure.
   */
  songname: string
  /**
   * An array with the tracks count of all instruments, backing, and crowd channels.
   */
  tracks_count: DTATracksCountArray
  /**
   * Tracks panning information of all audio channels.
   */
  pans?: number[]
  /**
   * Volume information of all audio channels.
   */
  vols?: number[]
  cores?: number[]
  /**
   * The quantity of vocal parts of the song.
   */
  vocal_parts: VocalParts
  /**
   * This controls the volume reduction of a stem when the player misses notes/fails out.
   * Number value is in decibels. Default is `-96`.
   *
   * If your song has "fake" stems produced by frequency banding, you can use this to make the game mute the stems less harshly when players make mistakes or fail, in order to prevent the overall sound from becoming too deadened.
   */
  mute_volume?: number
  /**
   * This controls the volume reduction of the vocal stem if the vocalist fails. Default is `-12`.
   */
  mute_volume_vocals?: number
  /**
   * Default is `170`.
   */
  hopo_threshold?: number
  /**
   * The audio cue type of the vocal percussion. Default is `sfx/tambourine_bank.milo` (Tambourine).
   */
  bank: PercussionBank
  /**
   * The audio cue type of the drums on Drum Fills/Freestyle Mode. Default is `sfx/kit01_bank.milo` (Hard Rock Kit).
   */
  drum_bank: DrumBank
  /**
   * The song animation's speed. Default is `32` (Normal).
   */
  anim_tempo: AnimTempoNumbers
  band_fail_cue?: BandFailCue
  /**
   * The speed of the vocal track. Default is `2300` (Normal).
   */
  song_scroll_speed?: SongScrollSpeed
  /**
   * An array with start and end of the preview, in milliseconds
   */
  preview: [number, number]
  /**
   * The length of the song, in milliseconds.
   */
  song_length: number
  /**
   * The song's band ranking number.
   */
  rank_band: number
  /**
   * The song's drums ranking number. This rank is shared with PRO Drums as well.
   */
  rank_drum?: number
  /**
   * The song's bass ranking number.
   */
  rank_bass?: number
  /**
   * The song's guitar ranking number.
   */
  rank_guitar?: number
  /**
   * The song's vocals ranking number. This rank is shared with Harmonies as well.
   */
  rank_vocals?: number
  /**
   * The song's keys ranking number.
   */
  rank_keys?: number
  /**
   * The song's PRO Bass ranking number.
   */
  rank_real_bass?: number
  /**
   * The song's PRO Guitar ranking number.
   */
  rank_real_guitar?: number
  /**
   * The song's PRO Keys ranking number.
   */
  rank_real_keys?: number
  /**
   * An array specifying which instrument parts has solo sessions.
   */
  solo?: SoloFlags[]
  /**
   * Adjusts the entire song's vocal chart up or down by cents. Default is `0`.
   */
  tuning_offset_cents?: number
  /**
   * The volume of the vocal guide pitch on the vocal practice menu. Default is `-3`.
   */
  guide_pitch_volume?: number
  /**
   * The encoding of the song file DTA values. Default is `latin1`.
   *
   * Songs with any characters with accents on the DTA must set the encoding to `utf8`.
   */
  encoding?: SongEncoding
  /**
   * The version of the song's MILO file.
   */
  format?: number
  version?: number
  /**
   * The game origin of the song.
   *
   * All customs are compiled on MAGMA using `ugc_plus`.
   */
  game_origin: SongGameOrigin
  /**
   * The song's rating.
   */
  rating: SongRating
  /**
   * The song's genre.
   */
  genre: SongGenre
  /**
   * The song's sub-genre.
   */
  sub_genre?: SongSubGenre
  /**
   * The gender of the lead vocalist.
   */
  vocal_gender: VocalGender
  /**
   * The song's release year.
   */
  year_released: number
  /**
   * The song's recorded year.
   *
   * This is used on re-recordings or alternative versions of
   * the song.
   */
  year_recorded?: number
  /**
   * Tells if the song has an album artwork file to be displayed.
   */
  album_art: boolean
  /**
   * The name of the song's album.
   */
  album_name?: string
  /**
   * The song's track number on the album.
   */
  album_track_number?: number
  /**
   * The vocal tonic note of the song. This changes the HUD on the vocal tracks based on the given note.
   *
   * If `song_key` is not specified, it'll be used as song key in general, changing the accident symbol on
   * PRO Guitar/Bass parts and showing the song key on PRO Keys trainers based on it.
   */
  vocal_tonic_note?: SongKey
  /**
   * The song tonality of the song.
   *
   * Values can be `0` (Major tonality) or `1` (Minor tonality).
   */
  song_tonality?: SongTonality
  /**
   * Specific parameter to override the `vocal_tonic_note` on PRO Guitar/Bass/Keys parts.
   */
  song_key?: SongKey
  /**
   * An array with the tuning of all 6 strings of the PRO Guitar part.
   */
  real_guitar_tuning?: [number, number, number, number, number, number]
  /**
   * An array with the tuning of all 4 strings of the PRO Bass part.
   */
  real_bass_tuning?: [number, number, number, number]
  /**
   * An array with flags about the existence of an MIDI file with any track update for the song inside the game's file structure.
   *
   * Rock Band 3 uses this flag to update several pre-RB3 DLCs songs and exports.
   */
  extra_authoring?: ExtraAuthoringFlags[]
  /**
   * If `true`, the game will load both album art and MILO file from the game patch file system.
   */
  alternate_path?: boolean
  context?: number
  /**
   * The name of the song's pack.
   */
  pack_name?: string
  base_points?: number
  /**
   * The loading phrase that will appear on the loading screen.
   *
   * _This value only works on Rock Band 3 Deluxe_.
   */
  loading_phrase?: string
  /**
   * The PRO Guitar/Bass chart author(s).
   *
   * _This value only works on Rock Band 3 Deluxe_.
   */
  strings_author?: string
  /**
   * The Basic Keys and PRO Keys chart author(s).
   *
   * _This value only works on Rock Band 3 Deluxe_.
   */
  keys_author?: string
  /**
   * The chart author(s) of the song.
   *
   * _This value only works on Rock Band 3 Deluxe_.
   */
  author?: string
  /**
   * An array with the languages of the song.
   */
  languages?: string[]
  /**
   * Tells if the song has separate vocal and backing stems.
   */
  karaoke?: boolean
  /**
   * Tells if the song has separate audio stems.
   */
  multitrack?: boolean
  /**
   * Tells if the song is a 2x Kick Pedal song.
   */
  double_kick?: boolean
  /**
   * Tells if the song is a conversion from another game.
   */
  convert?: boolean
  /**
   * Tells if the song has rhythm guitar charted on the Keys track.
   */
  rhythm_on_keys?: boolean
  /**
   * Tells if the song has rhythm guitar charted on the Bass track.
   */
  rhythm_on_bass?: boolean
  /**
   * Tells if the song has EMH autogenerated by CAT.
   */
  cat_ehm?: boolean
  /**
   * Tells if the song only has Expert difficulty charted.
   */
  expert_only?: boolean
}

export type PartialDTAFile = Partial<DTAFile> & {
  /**
   * An unique shortname ID of the song.
   */
  id: string
}

export type DTAFileWithIndex = DTAFile & {
  /**
   * The index of the song related to the original array.
   */
  index: number
}

export type AcceptedUnformattedDTAKeys = 'game_origin' | 'genre' | 'sub_genre'

export type UnformattedDTAFile = Omit<DTAFile, AcceptedUnformattedDTAKeys> & {
  /**
   * The game origin of the song.
   *
   * All customs are compiled on MAGMA using `ugc_plus`.
   */
  game_origin: LiteralUnion<SongGameOrigin, string>
  /**
   * The song's genre.
   */
  genre: LiteralUnion<SongGenre, string>
  /**
   * The song's sub-genre.
   */
  sub_genre?: LiteralUnion<SongSubGenre, string>
}

export type UnformattedPartialDTAFile = Omit<PartialDTAFile, AcceptedUnformattedDTAKeys> & {
  /**
   * The game origin of the song.
   *
   * All customs are compiled on MAGMA using `ugc_plus`.
   */
  game_origin?: LiteralUnion<SongGameOrigin, string>
  /**
   * The song's genre.
   */
  genre?: LiteralUnion<SongGenre, string>
  /**
   * The song's sub-genre.
   */
  sub_genre?: LiteralUnion<SongSubGenre, string>
}

/**
 * Type with all available keys from a DTA File.
 */
export type DTAFileKeys = keyof DTAFile

export type AnyDTAType = DTAFile | PartialDTAFile
export type AnyDTATypeArray = DTAFile[] | PartialDTAFile[]
export type DTASelfReturnType<T> = T

/**
 * A `Map` class with `DTAFile` keys and values.
 */
export type DTAMap = Map<keyof DTAFile, unknown>
export type DTARecord = Record<keyof DTAFile, unknown>

/**
 * Generates an empty `DTAFile` object with default values.
 * - - - -
 * @returns {DTAFile} An empty `DTAFile` object with default values.
 */
export const dtaDefault = (): DTAFile => {
  const defaultDTA: DTAFile = {
    id: '',
    name: '',
    artist: '',
    master: false,
    song_id: 0,
    songname: '',
    tracks_count: [0, 0, 0, 0, 0, 0],
    pans: [],
    vols: [],
    vocal_parts: 0,
    bank: 'sfx/tambourine_bank.milo',
    drum_bank: 'sfx/kit01_bank.milo',
    anim_tempo: 32,
    preview: [0, 0],
    song_length: 0,
    rank_band: 1,
    game_origin: 'ugc_plus',
    rating: 4,
    genre: 'other',
    sub_genre: 'subgenre_other',
    vocal_gender: 'male',
    year_released: new Date().getFullYear(),
    album_art: false,
    album_name: '',
  }

  const newDefault = new Map() as DTAMap
  for (const key of Object.keys(defaultDTA) as DTAFileKeys[]) {
    newDefault.set(key, defaultDTA[key])
  }
  return Object.fromEntries(newDefault) as DTARecord as DTAFile
}

/**
 * Converts a DTAFile `Map` class to a `DTAFile` object, sorting all key values to match common `.dta` file structure.
 * - - - -
 * @param {DTAMap} song A `Map` class with `DTAFile` keys and values.
 * @returns {DTAMap} A `Map` class with `DTAFile` keys and values.
 */
export const sortDTAMap = (song: DTAMap): DTAMap => {
  const sortedDTA = new Map() as DTAMap

  for (const key of dtaLocale.allKeys) {
    if (song.has(key)) {
      sortedDTA.set(key, song.get(key))
    }
  }

  return sortedDTA
}
