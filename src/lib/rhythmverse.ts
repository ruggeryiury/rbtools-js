import type { PartialDTAFile } from '../lib'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const rhythmverseAPISourceURL = {
  all: 'https://rhythmverse.co/api/all/songfiles/list',
  rb3: 'https://rhythmverse.co/api/rb3/songfiles/list',
  rb3xbox: 'https://rhythmverse.co/api/rb3xbox/songfiles/list',
  rb3wii: 'https://rhythmverse.co/api/rb3wii/songfiles/list',
  rb3ps3: 'https://rhythmverse.co/api/rb3ps3/songfiles/list',
  wtde: 'https://rhythmverse.co/api/wtde/songfiles/list',
  tbrbxbox: 'https://rhythmverse.co/api/tbrbxbox/songfiles/list',
  yarg: 'https://rhythmverse.co/api/yarg/songfiles/list',
  rb2xbox: 'https://rhythmverse.co/api/rb2xbox/songfiles/list',
  ps: 'https://rhythmverse.co/api/ps/songfiles/list',
  chm: 'https://rhythmverse.co/api/chm/songfiles/list',
  gh3pc: 'https://rhythmverse.co/api/gh3pc/songfiles/list',
} as const

export const rhythmverseAPISourceSearchURL: Record<keyof typeof rhythmverseAPISourceURL, string> = {
  all: 'https://rhythmverse.co/api/all/songfiles/search/live',
  rb3: 'https://rhythmverse.co/api/rb3/songfiles/search/live',
  rb3xbox: 'https://rhythmverse.co/api/rb3xbox/songfiles/search/live',
  rb3wii: 'https://rhythmverse.co/api/rb3wii/songfiles/search/live',
  rb3ps3: 'https://rhythmverse.co/api/rb3ps3/songfiles/search/live',
  wtde: 'https://rhythmverse.co/api/wtde/songfiles/search/live',
  tbrbxbox: 'https://rhythmverse.co/api/tbrbxbox/songfiles/search/live',
  yarg: 'https://rhythmverse.co/api/yarg/songfiles/search/live',
  rb2xbox: 'https://rhythmverse.co/api/rb2xbox/songfiles/search/live',
  ps: 'https://rhythmverse.co/api/ps/songfiles/search/live',
  chm: 'https://rhythmverse.co/api/chm/songfiles/search/live',
  gh3pc: 'https://rhythmverse.co/api/gh3pc/songfiles/search/live',
}

export interface RhythmverseFetchingOptions {
  /** The game source of the fetched songs. Default is `rb3xbox`. */
  source?: keyof typeof rhythmverseAPISourceURL
  /** The sorting type. Default is `updateDate`. */
  sortBy?: 'updateDate' | 'title' | 'artist' | 'length' | 'author' | 'releaseDate' | 'downloads'
  /** The order of the sorting. Default is `asc`. */
  sortOrder?: 'asc' | 'desc'
  /** The pagination of the results based on the given `records` variable. Default is `1`. */
  page?: number
  /** The quantity of the records to be fetched. Default is `25`. */
  records?: number
  /** If `true`, the API will only fetch songs with all instruments charted. Default is `false`. */
  fullBand?: boolean
  /** If `true`, the API will only fetch songs with multitracks. Default is `false`. */
  multitrack?: boolean
  /** If `true`, the API will only fetch songs with pitched vocals. Default is `true`. */
  pitchedVocals?: boolean
}

export const rhythmverseOptsLocale = {
  artist: 'artist',
  asc: 'ASC',
  author: 'author',
  desc: 'DESC',
  downloads: 'downloads',
  length: 'length',
  releaseDate: 'release_date',
  title: 'title',
  updateDate: 'update_date',
} as const

export interface RawRhythmverseResponse {
  status: string
  data: {
    records: {
      total_available: number
      total_filtered: number
      returned: number
    }
    pagination: {
      start: number
      records: string
      page: string
    }
    songs:
      | {
          data: RhythmverseResSongData
          file: RhythmverseResSongFile
        }[]
      | false
  }
}

export interface RhythmverseResSongData {
  song_id: number
  member_id: number
  record_saved: number
  record_updated: number
  record_locked: number
  record_comments: number
  record_views: number
  song_length: number
  genre: string
  subgenre: string
  year: number
  album: string
  album_s: string
  album_track_number?: number
  decade: number
  artist: string
  artist_s: string
  artist_id: number
  title: string
  diff_drums: string
  diff_guitar: string
  diff_bass: string
  diff_vocals: string
  diff_keys: string
  diff_prokeys: string
  diff_proguitar: string
  diff_probass: string
  diff_band?: string
  master: number
  vocal_parts?: string
  gender?: string
  rating: string
  song_preview: any
  song_notes?: string
  downloads: number
  record_approved: number
  diff_rhythm: any
  diff_guitar_coop: any
  diff_drums_real_ps: any
  diff_keys_real_ps: any
  diff_dance: any
  diff_vocals_harm: any
  diff_guitarghl: any
  diff_bassghl: any
  genre_is_literal: number
  rank_drums: any
  rank_guitar: any
  rank_bass: any
  rank_vocals: any
  rank_keys: any
  rank_prokeys: any
  rank_probass: any
  rank_proguitar: any
  rank_guitar_coop: any
  rank_band: any
  album_art: string
  tiers: {
    songstiers_id?: number
    song_id?: number
    gameformat?: string
    diff_drums?: string
    diff_guitar?: string
    diff_bass?: string
    diff_vocals?: string
    diff_keys?: string
    diff_prokeys?: string
    diff_proguitar?: string
    diff_probass?: string
    diff_band?: string
    diff_dance: any
    diff_bassghl: any
    diff_guitarghl: any
    diff_keys_real_ps: any
    diff_drums_real_ps: any
    diff_vocals_harm: any
    diff_guitar_coop: any
    diff_rhythm: any
    rank_drums: any
    rank_guitar: any
    rank_bass: any
    rank_vocals: any
    rank_keys: any
    rank_prokeys: any
    rank_probass: any
    rank_proguitar: any
    rank_guitar_coop: any
    rank_band: any
  }
  genre_id: string
  record_id: string
}

export interface RhythmverseResSongFile {
  diff_drums: number
  diff_guitar: number
  diff_bass: number
  diff_vocals?: number
  diff_proguitar?: number
  diff_probass?: number
  diff_band: number
  rank_drums: number
  rank_guitar: number
  rank_bass: number
  rank_vocals: number
  rank_probass: number
  rank_proguitar: number
  rank_band: number
  file_id: string
  db_id: number
  user: string
  user_folder: string
  file_name: string
  giorno: string
  gameformat: string
  gamesource: string
  source: any
  group_id: any
  alt_versions?: {
    id: string
    title: string
    short_title: string
  }[]
  downloads: number
  deleted: number
  retired: number
  destroyed: number
  size: number
  utility: number
  unpitched: number
  audio_type: string
  tuning_offset_cents: string
  encoding: string
  has_reductions: string
  vocal_parts_authored?: string
  file_preview?: string
  file_notes?: string
  custom_id: string
  external_url?: string
  disc: string
  completeness?: number
  wip: any
  wip_date: string
  record_hidden: number
  release_date: string
  future_release_date: any
  delete_date: any
  retire_date: any
  pro_drums: number
  vocals_lyrics_only: number
  charter: any
  record_updated: string
  file_updated: string
  record_created: string
  file_artist: string
  file_artist_s: string
  file_title: string
  file_album: string
  file_album_s: string
  file_genre: string
  file_subgenre: any
  file_genre_is_literal: number
  file_year: number
  file_decade: number
  file_song_length: number
  file_album_track_number?: number
  filename: string
  upload_date: string
  off: number
  author: {
    member_id: number
    name: string
    account: string
    releases: number
    default_gameformat?: string
    shortname: string
    role: string
    author_class: any
    level: boolean
    confirmed: number
    source: number
    id: number
    dl_count: number
    public_profile_page: string
    songlist_url: string
    author_url: string
    author_url_full: string
    avatar_path: string
  }
  hidden: boolean
  game_completeness: number
  file_url: string
  file_url_full: string
  author_id: string
  comments: number
  update_date: any
  album_art: string
  file_genre_id: string
  difficulties: {
    drums: any
    guitar: any
    bass: any
    vocals: any
    keys: any
    prokeys: any
  }
  credits: any[]
  thanks: number
  download_url: string
  download_page_url: string
  download_page_url_full: string
  group: any
  song_length: number
  diff_keys?: number
  rank_keys?: number
  diff_prokeys?: number
  rank_prokeys?: number
}

export type ProcessedRhythmverseSongData = Omit<PartialDTAFile, 'id' | 'album_art'> & {
  /** The URL of the album artwork. */
  album_art: string
  /** The file name of the song. */
  file_name?: string
  /** The Rhythmverse URL of the song. */
  song_url: string
  /** The download URL of the song. */
  file_download_url: string
  /** A boolean value that tells if the song is hosted on Rhythmverse servers. */
  external_file_download: boolean
  /** The size of the song CON file. */
  file_size?: number
  /** The quantity of "thanks" to the song. */
  thanks: number
  /** The quantity of downloads of the song. */
  downloads: number
}

export interface ProcessRhythmverseObject {
  records: RawRhythmverseResponse['data']['records']
  pagination: RawRhythmverseResponse['data']['pagination']
  songs: ProcessedRhythmverseSongData[]
}
