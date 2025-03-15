import axios, { AxiosError } from 'axios'
import { setDefaultOptions } from 'set-default-options'
import { RhythmverseAPIFetchingError } from '../errors'
import { normalizeString, rhythmverseAPISourceSearchURL, rhythmverseAPISourceURL, rhythmverseOptsLocale, type PartialDTAFile, type ProcessedRhythmverseSongData, type ProcessRhythmverseObject, type RawRhythmverseResponse, type RhythmverseFetchingOptions } from '../lib'

/** A class with static methods to fetch songs from Rhythmverse database. */
export class RhythmverseAPI {
  /**
   * Asynchronously searchs a text through the Rhythmverse database.
   * - - - -
   * @param {string} text The text you want to be used as searching parameter.
   * @param {RhythmverseFetchingOptions | undefined} options `OPTIONAL` An object that changes the behavior of the fetching process.
   * @returns {Promise<RawRhythmverseResponse>}
   */
  static async searchText(text: string, options?: RhythmverseFetchingOptions): Promise<RawRhythmverseResponse> {
    const opts = setDefaultOptions<RhythmverseFetchingOptions>(
      {
        source: 'rb3xbox',
        sortBy: 'updateDate',
        sortOrder: 'asc',
        page: 1,
        records: 25,
        fullBand: false,
        multitrack: false,
        pitchedVocals: true,
      },
      options
    )

    const reqURL: string = rhythmverseAPISourceSearchURL[opts.source]

    const urlParams: Record<string, string> = {
      'sort[0][sort_by]': rhythmverseOptsLocale[opts.sortBy],
      'sort[0][sort_order]': rhythmverseOptsLocale[opts.sortOrder],
      text,
      page: opts.page.toString(),
      records: opts.records.toString(),
      data_type: 'full',
    }

    if (opts.fullBand) urlParams.fullband = 'true'
    if (opts.multitrack) urlParams.audio = 'full'
    if (opts.pitchedVocals) urlParams.vocals = 'pitched'

    if (opts.sortBy === 'updateDate') urlParams['sort[0][sort_order]'] = 'DESC'

    const reqData = new URLSearchParams(urlParams).toString()
    const reqHeaders = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }

    try {
      const res = await axios.post<RawRhythmverseResponse>(reqURL, reqData, {
        headers: reqHeaders,
      })

      return res.data
    } catch (err) {
      if (err instanceof AxiosError) throw new RhythmverseAPIFetchingError(err.message, err.status)
      else if (err instanceof Error) throw new RhythmverseAPIFetchingError(err.message)
      else throw err
    }
  }
  /**
   * Asynchronously searchs an artist/band through the Rhythmverse database.
   * - - - -
   * @param {string} artist The text you want to be used as searching parameter.
   * @param {RhythmverseFetchingOptions | undefined} options `OPTIONAL` An object that changes the behavior of the fetching process.
   * @returns {Promise<RawRhythmverseResponse>}
   */
  static async searchArtist(artist: string, options?: RhythmverseFetchingOptions): Promise<RawRhythmverseResponse> {
    const opts = setDefaultOptions<RhythmverseFetchingOptions>(
      {
        source: 'rb3xbox',
        sortBy: 'updateDate',
        sortOrder: 'asc',
        page: 1,
        records: 25,
        fullBand: true,
        multitrack: false,
        pitchedVocals: true,
      },
      options
    )

    const reqURL: string = rhythmverseAPISourceURL[opts.source]

    const urlParams: Record<string, string> = {
      'sort[0][sort_by]': rhythmverseOptsLocale[opts.sortBy],
      'sort[0][sort_order]': rhythmverseOptsLocale[opts.sortOrder],
      artist: normalizeString(artist).replace(/\s+/g, '-').toLowerCase(),
      page: opts.page.toString(),
      records: opts.records.toString(),
      data_type: 'full',
    }

    if (opts.fullBand) urlParams.fullband = 'true'
    if (opts.multitrack) urlParams.audio = 'full'
    if (opts.pitchedVocals) urlParams.vocals = 'pitched'

    if (opts.sortBy === 'updateDate') urlParams['sort[0][sort_order]'] = 'DESC'

    const reqData = new URLSearchParams(urlParams).toString()
    const reqHeaders = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }

    try {
      const res = await axios.post<RawRhythmverseResponse>(reqURL, reqData, {
        headers: reqHeaders,
      })

      return res.data
    } catch (err) {
      if (err instanceof AxiosError) throw new RhythmverseAPIFetchingError(err.message, err.status)
      else if (err instanceof Error) throw new RhythmverseAPIFetchingError(err.message)
      else throw err
    }
  }

  static processData(data: RawRhythmverseResponse): ProcessRhythmverseObject {
    const { pagination, records, songs } = data.data

    const allSongs: ProcessedRhythmverseSongData[] = []
    if (songs !== false) {
      for (const song of songs) {
        allSongs.push({
          name: song.data.title,
          artist: song.data.artist,
          master: Boolean(song.data.master),
          song_id: song.file.custom_id,
          vocal_parts: Number(song.data.vocal_parts) as PartialDTAFile['vocal_parts'],
          song_length: song.data.song_length * 1000,
          rank_band: song.file.diff_band === -1 ? 0 : song.file.diff_band,
          rank_drum: song.file.diff_drums === -1 ? 0 : song.file.diff_drums,
          rank_bass: song.file.diff_bass === -1 ? 0 : song.file.diff_bass,
          rank_guitar: song.file.diff_guitar === -1 ? 0 : song.file.diff_guitar,
          rank_vocals: song.file.diff_vocals === -1 ? 0 : song.file.diff_vocals,
          rank_keys: song.file.diff_keys === -1 ? 0 : song.file.diff_keys,
          rank_real_bass: song.file.diff_probass === -1 ? 0 : song.file.diff_probass,
          rank_real_guitar: song.file.diff_proguitar === -1 ? 0 : song.file.diff_proguitar,
          rank_real_keys: song.file.diff_prokeys === -1 ? 0 : song.file.diff_prokeys,
          // rank_band: rankCalculator('band', song.file.diff_band),
          // rank_drum: rankCalculator('drum', song.file.diff_drums),
          // rank_bass: rankCalculator('bass', song.file.diff_bass),
          // rank_guitar: rankCalculator('guitar', song.file.diff_guitar),
          // rank_vocals: rankCalculator('vocals', song.file.diff_vocals),
          // rank_keys: rankCalculator('keys', song.file.diff_keys),
          // rank_real_bass: rankCalculator('real_bass', song.file.diff_probass),
          // rank_real_guitar: rankCalculator('real_guitar', song.file.diff_proguitar),
          // rank_real_keys: rankCalculator('real_keys', song.file.diff_prokeys),
          tuning_offset_cents: Number(song.file.tuning_offset_cents),
          encoding: song.file.encoding as PartialDTAFile['encoding'],
          rating: song.data.rating === 'ff' ? 1 : song.data.rating === 'sr' ? 2 : song.data.rating === 'mc' ? 3 : 4,
          genre: song.file.file_genre_id as PartialDTAFile['genre'],
          vocal_gender: (song.data.gender as PartialDTAFile['vocal_gender']) ?? 'male',
          year_released: song.data.year,
          album_art: `https://rhythmverse.co${song.file.album_art}`,
          album_name: song.data.album,
          album_track_number: song.data.album_track_number ?? 1,
          author: song.file.author.name,
          multitrack: song.file.audio_type === 'full',

          // Non-DTA values relative
          file_name: song.file.file_name === 'file' ? undefined : song.file.file_name,
          song_url: song.file.file_url_full,
          file_download_url: !song.file.download_url.startsWith('/download_file/') ? song.file.download_url : `https://rhythmverse.co${song.file.download_url}`,
          external_file_download: !song.file.download_url.startsWith('/download_file/'),
          file_size: song.file.size ? song.file.size : undefined,
          thanks: song.file.thanks,
          downloads: song.file.downloads,
        })
      }
    }

    return {
      pagination,
      records,
      songs: allSongs,
    }
  }
}
