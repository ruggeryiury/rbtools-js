import { setDefaultOptions } from 'set-default-options'
import type { AllParsedDTATypes } from '../../core'
import { DTAParser } from '../../index'
import { dtaLocale, DTASongContentIO, type DTAContentParserFormatTypes, type SongSortingTypes, type UnformattedPartialDTAFile } from '../../lib'

export type DTAStringifyFormats = 'rbn' | 'rb3_dlc' | 'rb2'

export interface DTAStringifyOptions {
  /**
   * If `true`, each song will occupy only one line of the document. Default is `false`.
   *
   * This parameter only works when stringifying `'partial'` DTA types.
   */
  allSongsInline?: boolean
  /**
   * Specify the generated type of the DTA. Default is `'rb3_dlc'`.
   */
  format?: DTAStringifyFormats
  /**
   * By setting this to `true`, it places ``1`` to the
   * guitar audio channels on `cores`. Default is `true`.
   */
  guitarCores?: boolean
  /**
   * Places C3 MAGMA-generated information as DTA comments. Default is `true`.
   */
  placeCustomAttributes?: boolean
  /**
   * Places information used on Rock Band 3 Deluxe, such as author name. Default is `true`.
   */
  placeRB3DXAttributes?: boolean
  /**
   * If `false`, fake songs won't be ignored from the generated DTA file contents. Default is `false`.
   */
  ignoreFakeSongs?: boolean
  /**
   * Changes the sorting of the songs. This property has no influence if you want to stringify a single song.
   */
  sortBy?: SongSortingTypes
  /**
   * An array with "songs updates" values to be placed as if statement for CUSTOMSOURCE.
   *
   * _This value only works on Rock Band 3 Deluxe and the default value will be used on the vanilla version of the game_.
   */
  customSource?: UnformattedPartialDTAFile[] | null
  /**
   * Generates `pans` and `vols` arrays for songs without these informations. Default is `true`.
   *
   * This parameter only works when stringifying `'complete'` DTA types.
   */
  autoGeneratePansAndVols?: boolean
  /**
   * Changes some properties to generate `.dta` file contents for Wii systems.
   */
  wiiMode?: {
    /**
     * The generation of the pack you want to build.
     */
    gen: 'sZAE' | 'sZBE' | 'sZCE' | 'sZDE' | 'sZEE' | 'sZFE' | 'sZGE' | 'sZHE' | 'sZJE' | 'sZKE'
    /**
     * The slot of the pack you want to build.
     *
     * Odd, positive numbers only.
     */
    slot: number
  } | null
}

/**
 * Converts a `DTAFile` object to DTA file contents.
 * - - - -
 * @param {AllParsedDTATypes} songs An object containing all songs to be stringified.
 * @param {DTAContentParserFormatTypes | undefined} type `OPTIONAL` The DTA type of the convertion. Default is `songs`.
 * @param {DTAStringifyOptions | undefined} options `OPTIONAL` An object with values that changes the behavior
 * of the DTA stringify process.
 * @returns {string} The generated DTA file contents.
 */
export const stringifyDTA = (songs: AllParsedDTATypes, type: DTAContentParserFormatTypes = 'complete', options?: DTAStringifyOptions): string => {
  const opts = setDefaultOptions<DTAStringifyOptions>(type === 'complete' ? DTAParser.completeDTADefaultOptions : DTAParser.partialDTADefaultOptions, options)

  const io = new DTASongContentIO(type, opts)
  if (Array.isArray(songs)) {
    songs.forEach((song) => {
      if (opts.ignoreFakeSongs && song.fake === true) return
      io.openNewSongRegistry(song.id)
      for (const key of dtaLocale.allKeys) {
        if (song[key] !== undefined) io.addValueToSong(song.id, key, song[key])
      }
    })

    return io.toString()
  }
  if (opts.ignoreFakeSongs && songs.fake === true) return ''
  io.openNewSongRegistry(songs.id)
  for (const key of dtaLocale.allKeys) {
    if (songs[key] !== undefined) io.addValueToSong(songs.id, key, songs[key])
  }
  return io.toString()
}
