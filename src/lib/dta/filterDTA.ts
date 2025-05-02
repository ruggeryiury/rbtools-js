import { setDefaultOptions } from 'set-default-options'
import { dtaLocale, formatStringFromDTA, omitLeadingArticle, rankCalculator, sortDTA, type DTAFile, type DTAFileKeys, type DTAFileWithIndex, type InstrRankingNumbers, type DTAInstrumentTypes } from '../../lib.exports'

/**
 * Adds literal indexes as values to each song from a collection.
 * - - - -
 * @param {DTAFile[]} songs The collection of songs you want to add indexes to.
 * @returns {DTAFileWithIndex[]} The song collection with injected indexes.
 */
export const addIndexToDTAFileList = (songs: DTAFile[]): DTAFileWithIndex[] => {
  return songs.map((song, i) => {
    return {
      ...song,
      index: i,
    }
  })
}

/**
 * Apply filters that is not related to the order of the songs.
 * - - - -
 * @param {DTAFileWithIndex[]} allSongsWithIndex The collection of songs you want to apply filters to.
 * @param {Required<SongFilterOptions>} options An object to change the behavior of the filtering process and results.
 * @returns {DTAFileWithIndex[]} An array with songs filtered based on the provided filtering options.
 */
export const applyGeneralFilters = (allSongsWithIndex: DTAFileWithIndex[], options: Required<SongFilterOptions>): DTAFileWithIndex[] => {
  const { keysSupport, proGtrBassSupport } = options
  return allSongsWithIndex.filter((song) => {
    let passed = true

    if (proGtrBassSupport !== null) {
      if (proGtrBassSupport) {
        if (!song.rank_real_guitar || !song.rank_real_bass) passed = false
      } else {
        if (song.rank_real_guitar ?? song.rank_real_bass) passed = false
      }
    }

    if (keysSupport !== null) {
      if (keysSupport) {
        if (!song.rank_keys || !song.rank_real_keys) passed = false
      } else {
        if (song.rank_keys ?? song.rank_keys) passed = false
      }
    }

    if (passed) return song
    else return false
  })
}

export interface SongFilterOptions {
  /**
   * Default is `null` (disabled).
   */
  keysSupport?: boolean | null
  /**
   * Default is `null` (disabled).
   */
  proGtrBassSupport?: boolean | null
}

export interface SongFilterHeaderObject {
  /**
   * An unique ID of the filter option.
   */
  id: string
  /**
   * The name of the filter option.
   */
  name: string
  /**
   * An array with indexes that points to actual songs from the original array of songs.
   */
  songs: number[]
  /**
   * The quantity of songs of the filter option.
   */
  count: number
}

export interface SongFilteringResultsObject {
  /**
   * The sorting type.
   */
  sortedBy: string
  /**
   * An array with headers from the provided sorting type.
   */
  headers: SongFilterHeaderObject[]
}

// #region Title
export const filterSongsByTitle = (songs: DTAFile[], options?: SongFilterOptions): SongFilteringResultsObject => {
  const opts = setDefaultOptions<SongFilterOptions>(
    {
      keysSupport: null,
      proGtrBassSupport: null,
    },
    options
  )
  const allSongsWithIndex = addIndexToDTAFileList(songs)
  const allSongsFiltered = applyGeneralFilters(allSongsWithIndex, opts)

  const headers: SongFilterHeaderObject[] = []

  const localeNames = Object.keys(dtaLocale.name) as (keyof typeof dtaLocale.name)[]

  for (const key of localeNames) {
    const newHeader = {
      id: dtaLocale.name[key],
      name: key,
      songs: [],
      count: 0,
    } as SongFilterHeaderObject
    headers.push(newHeader)
  }

  const sortedSongs = sortDTA(allSongsFiltered, 'Song Title')

  for (const song of sortedSongs) {
    const name = formatStringFromDTA(song, '{{title.omit}}', 'id')
    const char = name.slice(0, 1).toUpperCase() as (typeof localeNames)[number]
    const charIndex = localeNames.includes(char) ? localeNames.indexOf(char) : 0
    const { songs: songlist } = headers[charIndex]
    songlist.push(song.index)
  }

  return {
    sortedBy: 'title',
    headers: headers.map((header) => ({ ...header, count: header.songs.length })).filter((song) => song.songs.length > 0),
  }
}

// #region Genre
export const filterSongsByGenre = (songs: DTAFile[], options?: SongFilterOptions): SongFilteringResultsObject => {
  const opts = setDefaultOptions<SongFilterOptions>(
    {
      keysSupport: null,
      proGtrBassSupport: null,
    },
    options
  )
  const allSongsWithIndex = addIndexToDTAFileList(songs)
  const allSongsFiltered = applyGeneralFilters(allSongsWithIndex, opts)

  const headers: SongFilterHeaderObject[] = []

  const localeGenres = Object.keys(dtaLocale.genre) as (keyof typeof dtaLocale.genre)[]

  for (const key of localeGenres) {
    const newHeader = {
      id: key,
      name: dtaLocale.genre[key],
      songs: [],
      count: 0,
    } as SongFilterHeaderObject
    headers.push(newHeader)
  }

  const sortedSongs = sortDTA(allSongsFiltered, 'Song Title')

  for (const song of sortedSongs) {
    const genreIndex = localeGenres.indexOf(song.genre)
    const { songs: songlist } = headers[genreIndex]
    songlist.push(song.index)
  }
  return {
    sortedBy: 'genre',
    headers: headers.map((header) => ({ ...header, count: header.songs.length })).filter((song) => song.songs.length > 0),
  }
}

export interface SongFilterWithInstrOptions extends SongFilterOptions {
  /**
   * The instrument you want the difficulties to be based from. Default is `'band'` (Band difficulty).
   */
  instrument?: DTAInstrumentTypes
}

// #region Song Diff
export const filterSongsBySongDifficulty = (songs: DTAFile[], options?: SongFilterWithInstrOptions): SongFilteringResultsObject => {
  const opts = setDefaultOptions<SongFilterWithInstrOptions>(
    {
      keysSupport: null,
      proGtrBassSupport: null,
      instrument: 'band',
    },
    options
  )

  const { instrument } = opts
  const allSongsWithIndex = addIndexToDTAFileList(songs)
  const allSongsFiltered = applyGeneralFilters(allSongsWithIndex, opts)

  const headers: SongFilterHeaderObject[] = []

  const localeRank = [0, 1, 2, 3, 4, 5, 6, -1] as InstrRankingNumbers[]

  for (const key of localeRank) {
    const newHeader = {
      id: `rank_${instrument}_${dtaLocale.rankName[key].toLowerCase()}`,
      name: dtaLocale.rankName[key],
      songs: [],
      count: 0,
    } as SongFilterHeaderObject
    headers.push(newHeader)
  }

  const sortedSongs = sortDTA(allSongsFiltered, 'Song Title')

  for (const song of sortedSongs) {
    const diffKey = `rank_${instrument}` as DTAFileKeys
    const diff = song[diffKey] as number | undefined
    const rank = rankCalculator(instrument, diff)
    const index = localeRank.indexOf(rank)
    const { songs: songlist } = headers[index]
    songlist.push(song.index)
  }
  return {
    sortedBy: 'song_difficulty',
    headers: headers.map((header) => ({ ...header, count: header.songs.length })).filter((song) => song.songs.length > 0),
  }
}

// #region Author
export const filterSongsByAuthor = (songs: DTAFile[], options?: SongFilterOptions): SongFilteringResultsObject => {
  const opts = setDefaultOptions<SongFilterOptions>(
    {
      keysSupport: null,
      proGtrBassSupport: null,
    },
    options
  )
  const allSongsWithIndex = addIndexToDTAFileList(songs)
  const allSongsFiltered = applyGeneralFilters(allSongsWithIndex, opts)

  const headers: SongFilterHeaderObject[] = []

  const allAuthors = Array.from(new Set(songs.map((song) => song.author ?? 'Unknown Charter')))

  for (const author of allAuthors) {
    const newHeader = {
      id: formatStringFromDTA(null, author, 'id'),
      name: author,
      songs: [],
      count: 0,
    } as SongFilterHeaderObject
    headers.push(newHeader)
  }

  const sortedSongs = sortDTA(allSongsFiltered, 'Song Title')

  for (const song of sortedSongs) {
    const authorName = song.author === undefined || !song.author ? 'Unknown Charter' : song.author
    const authorIndex = allAuthors.includes(authorName) ? allAuthors.indexOf(authorName) : 0
    const { songs: songlist } = headers[authorIndex]
    songlist.push(song.index)
  }
  return {
    sortedBy: 'author',
    headers: headers
      .map((header) => ({ ...header, count: header.songs.length }))
      .filter((song) => song.songs.length > 0)
      .sort((a, b) => {
        if (a.id > b.id) return 1
        else if (a.id < b.id) return -1
        return 0
      }),
  }
}

//#region Year Released
export const filterSongsByYearReleased = (songs: DTAFile[], options?: SongFilterOptions): SongFilteringResultsObject => {
  const opts = setDefaultOptions<SongFilterOptions>(
    {
      keysSupport: null,
      proGtrBassSupport: null,
    },
    options
  )
  const allSongsWithIndex = addIndexToDTAFileList(songs)
  const allSongsFiltered = applyGeneralFilters(allSongsWithIndex, opts)

  const headers: SongFilterHeaderObject[] = []

  const allYears = Array.from(new Set(songs.map((song) => song.year_released))).sort((a, b) => {
    if (a > b) return 1
    else if (a < b) return -1
    return 0
  })

  for (const years of allYears) {
    const newHeader = {
      id: `year_released_${years.toString()}`,
      name: years.toString(),
      songs: [],
      count: 0,
    } as SongFilterHeaderObject
    headers.push(newHeader)
  }

  const sortedSongs = sortDTA(allSongsFiltered, 'Song Title')

  for (const song of sortedSongs) {
    const songYear = song.year_released
    const yearIndex = allYears.indexOf(songYear)
    const { songs: songlist } = headers[yearIndex]
    songlist.push(song.index)
  }

  return {
    sortedBy: 'year_released',
    headers: headers.map((header) => ({
      ...header,
      count: header.songs.length,
    })),
  }
}

export interface ArtistFilterHeaderObject extends SongFilterHeaderObject {
  /**
   * An array with the contents of the given filter option.
   */
  albums: SongFilterHeaderObject[]
}

export interface SongFilterWithAlbumThresholdOptions extends SongFilterOptions {
  /**
   * You can specify the amount of songs an album must have to generate a unique album header for it. Default is `3`.
   */
  albumQuantityThreshold?: number
}

export interface ArtistFilteringResultsObject {
  /**
   * The sorting type.
   */
  sortedBy: string
  /**
   * An array with headers from the provided sorting type.
   */
  headers: ArtistFilterHeaderObject[]
}

// #region Artist
export const filterSongsByArtist = (songs: DTAFile[], options?: SongFilterWithAlbumThresholdOptions): ArtistFilteringResultsObject => {
  const opts = setDefaultOptions<SongFilterWithAlbumThresholdOptions>(
    {
      albumQuantityThreshold: 3,
      keysSupport: null,
      proGtrBassSupport: null,
    },
    options
  )

  const { albumQuantityThreshold } = opts
  const allSongsWithIndex = addIndexToDTAFileList(songs)
  const allSongsFiltered = applyGeneralFilters(allSongsWithIndex, opts)

  const headers: ArtistFilterHeaderObject[] = []
  const sortedSongs = sortDTA(allSongsFiltered, 'Song Title')
  const allArtists = Array.from(new Set(sortedSongs.map((song) => song.artist))).sort((a, b): number => {
    if (formatStringFromDTA(null, omitLeadingArticle(a), 'id_with_space') > formatStringFromDTA(null, omitLeadingArticle(b), 'id_with_space')) return 1
    else if (formatStringFromDTA(null, omitLeadingArticle(a), 'id_with_space') < formatStringFromDTA(null, omitLeadingArticle(b), 'id_with_space')) return -1
    return 0
  })

  for (const artist of allArtists) {
    headers.push({
      id: formatStringFromDTA(null, artist, 'id'),
      name: artist,
      songs: [],
      albums: [],
      count: 0,
    })
  }

  for (const header of headers) {
    let noAlbumSpecifiedCount = 0
    const allSongsFromArtist = sortedSongs.filter((song) => formatStringFromDTA(song, '{{artist}}', 'id') === header.id)
    header.count = allSongsFromArtist.length
    const allArtistAlbums = Array.from(new Set(allSongsFromArtist.map((song) => song.album_name))).sort((a, b): number => {
      if (a && b && formatStringFromDTA(null, omitLeadingArticle(a), 'id_with_space') > formatStringFromDTA(null, omitLeadingArticle(b), 'id_with_space')) return 1
      else if (a && b && formatStringFromDTA(null, omitLeadingArticle(a), 'id_with_space') < formatStringFromDTA(null, omitLeadingArticle(b), 'id_with_space')) return -1
      return 0
    })

    for (const album of allArtistAlbums) {
      const allTracksFromAlbum = allSongsFromArtist.filter((song) => song.album_name?.toLowerCase() === album?.toLowerCase())
      if (allTracksFromAlbum.length >= albumQuantityThreshold) {
        header.albums.push({
          id: album ? `album_${header.id}_${formatStringFromDTA(null, album, 'id')}` : `album_${header.id}_${formatStringFromDTA(null, 'No Album Specified', 'id')}_${noAlbumSpecifiedCount.toString()}`,
          name: album ?? 'No Album Specified',
          songs: allTracksFromAlbum
            .map((track) => track)
            .sort((a, b): number => {
              if (a.album_track_number && b.album_track_number && a.album_track_number > b.album_track_number) return 1
              else if (a.album_track_number && b.album_track_number && a.album_track_number < b.album_track_number) return -1
              return 0
            })
            .map((track) => track.index),
          count: allTracksFromAlbum.length,
        })
        if (!album) noAlbumSpecifiedCount++
      } else header.songs.push(...sortDTA(allTracksFromAlbum, 'Song Title').map((song) => song.index))
    }
  }

  return {
    sortedBy: 'artist',
    headers,
  }
}
