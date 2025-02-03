import type { DTAFile, DTAFileKeys, PartialDTAFile } from './dtaMethods.js'

/**
 * Type guard function to check through all known parsed song types if the provided parsed song
 * is a `DTAFile` object.
 * - - - -
 * @param {unknown} song Any type of parsed song object or class.
 * @returns {boolean} A boolean value that tells the provided parsed song is a `DTAFile` object.
 */
export const isDTAFile = (song: unknown): song is DTAFile => {
  return !Array.isArray(song) && typeof song === 'object' && song !== null && 'name' in song && 'artist' in song && 'id' in song && 'tracks_count' in song && 'song_id' in song && 'preview' in song && 'vocal_parts' in song && 'bank' in song && 'anim_tempo' in song && 'rank_band' in song && 'game_origin' in song && 'rating' in song && 'genre' in song && 'vocal_gender' in song && 'year_released' in song && 'format' in song && 'version' in song
}

/**
 * Gets all the missing values of a partial parsed song object and returns them as array.
 * - - - -
 * @param {PartialDTAFile} song A parsed song object.
 * @returns {DTAFileKeys[]}
 */
export const getCompleteDTAMissingValues = (song: PartialDTAFile): DTAFileKeys[] => {
  const missingValues: DTAFileKeys[] = []
  let hasName = false,
    hasArtist = false,
    hasID = false,
    hasTracksCount = false,
    hasSongID = false,
    hasPreview = false,
    hasVocalParts = false,
    hasBank = false,
    hasAnimTempo = false,
    hasRankBand = false,
    hasGameOrigin = false,
    hasRating = false,
    hasGenre = false,
    hasVocalGender = false,
    hasYearReleased = false,
    hasFormat = false,
    hasVersion = false
  // hasEncoding = false

  const allKeys = Object.keys(song) as DTAFileKeys[]

  for (const key of allKeys) {
    if (key === 'name') hasName = true
    if (key === 'artist') hasArtist = true
    if (key === 'id') hasID = true
    if (key === 'tracks_count') hasTracksCount = true
    if (key === 'song_id') hasSongID = true
    if (key === 'preview') hasPreview = true
    if (key === 'vocal_parts') hasVocalParts = true
    if (key === 'bank') hasBank = true
    if (key === 'anim_tempo') hasAnimTempo = true
    if (key === 'rank_band') hasRankBand = true
    if (key === 'game_origin') hasGameOrigin = true
    if (key === 'rating') hasRating = true
    if (key === 'genre') hasGenre = true
    if (key === 'vocal_gender') hasVocalGender = true
    if (key === 'year_released') hasYearReleased = true
    if (key === 'format') hasFormat = true
    if (key === 'version') hasVersion = true
    // if (key === 'encoding') hasEncoding = true
  }

  if (!hasName) missingValues.push('name')
  if (!hasArtist) missingValues.push('artist')
  if (!hasID) missingValues.push('id')
  if (!hasTracksCount) missingValues.push('tracks_count')
  if (!hasSongID) missingValues.push('song_id')
  if (!hasPreview) missingValues.push('preview')
  if (!hasVocalParts) missingValues.push('vocal_parts')
  if (!hasBank) missingValues.push('bank')
  if (!hasAnimTempo) missingValues.push('anim_tempo')
  if (!hasRankBand) missingValues.push('rank_band')
  if (!hasGameOrigin) missingValues.push('game_origin')
  if (!hasRating) missingValues.push('rating')
  if (!hasGenre) missingValues.push('genre')
  if (!hasVocalGender) missingValues.push('vocal_gender')
  if (!hasYearReleased) missingValues.push('year_released')
  if (!hasFormat) missingValues.push('format')
  if (!hasVersion) missingValues.push('version')
  // if (!hasEncoding) missingValues.push('encoding')

  return missingValues
}
