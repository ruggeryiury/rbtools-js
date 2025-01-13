import type { DTAFile, PartialDTAFile } from '../lib.js'

export type DTASongObjectTypes = DTAFile | DTAFile[] | PartialDTAFile | PartialDTAFile[] | Buffer

/**
 * Type guard function to check through all known parsed song types if the provided parsed song
 * is a `DTAFile` object.
 * - - - -
 * @param {unknown} song Any type of parsed song object or class.
 * @returns {boolean} A boolean value that tells the provided parsed song is a `DTAFile` object.
 */
export const isDTAFile = (song: unknown): song is DTAFile => {
  return !Array.isArray(song) && typeof song === 'object' && song !== null && 'name' in song && 'artist' in song && 'id' in song && 'tracks_count' in song && 'preview' in song && 'vocal_parts' in song && 'bank' in song && 'anim_tempo' in song && 'rank_band' in song && 'game_origin' in song && 'rating' in song && 'genre' in song && 'vocal_gender' in song && 'year_released' in song && 'format' in song && 'version' in song && 'encoding' in song
}
