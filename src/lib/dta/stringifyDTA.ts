import setDefaultOptions from 'set-default-options'
import { RBDTAJSError } from '../../errors.js'
import { addTabToAllLines, depackDTA, dtaLocale, genTracksCountArray, isDTAFile, renderAnimTempo, renderArray, renderBooleanValue, renderCustomAttributes, renderDrumsCue, renderIfDef, renderNumberOrStringValue, renderSongEntryClose, renderSongEntryOpen, renderStringOnQuotesValue, renderTrackMap, sortDTA, type DTAMap, type PartialDTAFile, type SongSortingTypes, type UnformattedPartialDTAFile } from '../../lib.js'

export class DTAString {
  /**
   * An object containing all songs that will be stringified when calling the `DTAStringIO.finish()` method.
   */
  content: Record<string, DTAMap | undefined>
  /**
   * An object with values that changes the behavior of the DTA stringify process.
   */
  private opts: Required<DTAStringifyOptions>
  /**
   * The DTA type of the generated string. With this, the stringify process can keep track of
   * which values are needed to perform a song or song updates, throwing specific errors
   * when necessary values are not found on the stringify process for any specific type.
   */
  type: DTAStringifyTypes
  constructor(type: DTAStringifyTypes, opts: Required<DTAStringifyOptions>) {
    this.content = {}
    this.type = type
    this.opts = opts
  }

  /**
   * Creates an empty map entry for a song.
   * - - - -
   * @param {string} id The unique string ID of the song.
   * @returns {DTAMap} A `Map` object that holds all registered values of a song.
   */
  private createDefaultEntry(id: string): DTAMap {
    const newMap = new Map() as DTAMap
    newMap.set('id', id)
    return newMap
  }

  /**
   * Registers any song on the class content.
   * - - - -
   * @param {string} id The unique string ID of the song.
   * @returns {void}
   */
  openNewSongRegistry(id: string): void {
    if (!this.content[id]) this.content[id] = this.createDefaultEntry(id)
  }

  /**
   * Registers any value on a song map.
   * - - - -
   * @param {string} id The unique string ID of the song.
   * @param {T} key The name of the key you want to register.
   * @param {PartialDTAFile[T]} value The key value.
   * @returns {void}
   */
  addValueToSong<T extends keyof PartialDTAFile>(id: string, key: T, value: PartialDTAFile[T]): void {
    const content = this.content[id]
    if (content) {
      if (key !== 'id') content.set(key, value)
      else return
    }
  }

  /**
   * Generates the contents of the DTA file to string.
   * - - - -
   * @returns {string}
   */
  toString(): string {
    let content = ''

    const allSongsID = Object.keys(this.content)
    let allSongs: PartialDTAFile[] = []

    // <-- Grad all IDs from the class' content and push all songs
    //     as generic objects
    for (const id of allSongsID) {
      const song = this.content[id]
      if (song !== undefined) allSongs.push(Object.fromEntries(song) as PartialDTAFile)
    }

    // <-- Sorts all songs
    allSongs = sortDTA(allSongs, this.opts.sortBy)

    // <-- Loop through each song object...
    for (const song of allSongs) {
      // <-- This will ignore fake songs
      if (this.opts.ignoreFakeSongs && song.fake === true) break

      // <-- Basic object check to assert stringify type
      if (this.type === 'songs' && !isDTAFile(song)) throw new RBDTAJSError('Tried to stringify a complete song with incomplete information required for a song to work in-game.')

      const allValuesKeys = Object.keys(song) as (keyof PartialDTAFile)[]

      const tracks = song.tracks_count ? genTracksCountArray(song.tracks_count) : undefined

      content += renderSongEntryOpen(song.id, this.opts.format)

      const customSource = this.opts.customSource?.find((csSong) => csSong.id === song.id)

      let hasSongSpecific = false
      let hasAnyRank = false
      for (const key of allValuesKeys) {
        if (key === 'songname' || key === 'tracks_count' || key === 'pans' || key === 'vols' || key === 'cores' || key === 'vocal_parts' || key === 'mute_volume' || key === 'mute_volume_vocals' || key === 'hopo_threshold') {
          hasSongSpecific = true
        } else if (key === 'rank_drum' || key === 'rank_guitar' || key === 'rank_bass' || key === 'rank_vocals' || key === 'rank_keys' || key === 'rank_real_keys' || key === 'rank_real_guitar' || key === 'rank_real_bass' || key === 'rank_band') {
          hasAnyRank = true
        } else continue
      }

      const format = this.opts.format
      if (song.name !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('name', song.name, format))
      if (song.artist !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('artist', song.artist, format))
      if (song.fake !== undefined) content += addTabToAllLines(renderBooleanValue('fake', song.fake, format))
      if (song.master !== undefined) content += addTabToAllLines(renderBooleanValue('master', song.master, format))
      if (song.song_id !== undefined) content += addTabToAllLines(renderNumberOrStringValue('song_id', song.song_id, format))
      if (song.upgrade_version !== undefined) content += addTabToAllLines(renderNumberOrStringValue('upgrade_version', song.upgrade_version, format))

      if (hasSongSpecific) {
        content += addTabToAllLines(renderSongEntryOpen('song', format))
        if (song.songname !== undefined) {
          if (this.opts.wiiMode !== null) {
            if (this.opts.wiiMode.slot % 2 === 0) throw new RBDTAJSError(`Provided Wii mode slot number is not an odd positive number. Given number: ${this.opts.wiiMode.slot.toString()}`)
            content += addTabToAllLines(renderStringOnQuotesValue('name', `dlc/${this.opts.wiiMode.gen}/${this.opts.wiiMode.slot.toString().padStart(3, '0')}/content/songs/${song.songname}/${song.songname}`, format), 2)
          } else content += addTabToAllLines(renderStringOnQuotesValue('name', `songs/${song.songname}/${song.songname}`, format), 2)
        }
        if (song.tracks_count !== undefined && tracks) {
          if (format === 'rbn' && this.type === 'songs') content += addTabToAllLines(renderArray('tracks_count', song.tracks_count, format), 2)
          content += addTabToAllLines(renderTrackMap(tracks, format), 2)
        }
        if (!song.pans && this.type === 'songs' && tracks && this.opts.autoGeneratePansAndVols) {
          content += addTabToAllLines(
            renderArray(
              'pans',
              tracks.defaultPans.map((pan) => String(pan.toFixed(format === 'rbn' ? 2 : 1))),
              format
            ),
            2
          )
        } else if (song.pans !== undefined)
          content += addTabToAllLines(
            renderArray(
              'pans',
              song.pans.map((pan) => String(pan.toFixed(format === 'rbn' ? 2 : 1))),
              format
            ),
            2
          )

        if (!song.vols && this.type === 'songs' && tracks && this.opts.autoGeneratePansAndVols) {
          content += addTabToAllLines(
            renderArray(
              'vols',
              tracks.defaultVols.map((pan) => String(pan.toFixed(format === 'rbn' ? 2 : 1))),
              format
            ),
            2
          )
        } else if (song.vols !== undefined)
          content += addTabToAllLines(
            renderArray(
              'vols',
              song.vols.map((vol) => String(vol.toFixed(format === 'rbn' ? 2 : 1))),
              format
            ),
            2
          )
        if (this.type === 'songs' && song.tracks_count && tracks) {
          const coresArray = Array<number>(tracks.allTracksCount).fill(-1)
          const coresArrayGtr = coresArray.map((core, coreI) => {
            if (tracks.guitar?.includes(coreI)) return 1
            return -1
          })
          content += addTabToAllLines(renderArray('cores', this.opts.guitarCores ? coresArrayGtr : coresArray, format), 2)
        }

        if (song.vocal_parts !== undefined) content += addTabToAllLines(renderNumberOrStringValue('vocal_parts', song.vocal_parts, format), 2)
        if (this.type === 'songs') content += addTabToAllLines(renderDrumsCue(format), 2)

        if (song.mute_volume !== undefined) content += addTabToAllLines(renderNumberOrStringValue('mute_volume', song.mute_volume, format), 2)
        if (song.mute_volume_vocals !== undefined) content += addTabToAllLines(renderNumberOrStringValue('mute_volume_vocals', song.mute_volume_vocals, format), 2)
        if (song.hopo_threshold !== undefined) content += addTabToAllLines(renderNumberOrStringValue('hopo_threshold', song.hopo_threshold, format), 2)
        content += addTabToAllLines(renderSongEntryClose())
      }

      if (song.song_scroll_speed !== undefined) content += addTabToAllLines(renderNumberOrStringValue('song_scroll_speed', song.song_scroll_speed, format))
      if (song.bank !== undefined) content += addTabToAllLines(renderNumberOrStringValue('bank', song.bank, format))
      if (song.drum_bank !== undefined) content += addTabToAllLines(renderNumberOrStringValue('drum_bank', song.drum_bank, format))
      if (song.anim_tempo !== undefined) content += addTabToAllLines(renderAnimTempo(song.anim_tempo, format))
      if (song.band_fail_cue !== undefined) content += addTabToAllLines(renderNumberOrStringValue('band_fail_cue', song.band_fail_cue, format))
      if (song.preview !== undefined) content += addTabToAllLines(renderArray('preview', song.preview, format, true, false))
      if (song.song_length !== undefined) content += addTabToAllLines(renderNumberOrStringValue('song_length', song.song_length, format))

      if (hasAnyRank) {
        content += addTabToAllLines(renderSongEntryOpen('rank', format))
        if (song.rank_drum !== undefined && song.rank_drum !== 0) content += addTabToAllLines(renderNumberOrStringValue('drum', song.rank_drum, format), 2)
        if (song.rank_guitar !== undefined && song.rank_guitar !== 0) content += addTabToAllLines(renderNumberOrStringValue('guitar', song.rank_guitar, format), 2)
        if (song.rank_bass !== undefined && song.rank_bass !== 0) content += addTabToAllLines(renderNumberOrStringValue('bass', song.rank_bass, format), 2)
        if (song.rank_vocals !== undefined && song.rank_vocals !== 0) content += addTabToAllLines(renderNumberOrStringValue('vocals', song.rank_vocals, format), 2)
        if (song.rank_keys !== undefined && song.rank_keys !== 0) content += addTabToAllLines(renderNumberOrStringValue('keys', song.rank_keys, format), 2)
        if (song.rank_real_keys !== undefined && song.rank_real_keys !== 0) content += addTabToAllLines(renderNumberOrStringValue('real_keys', song.rank_real_keys, format), 2)
        if (song.rank_real_guitar !== undefined && song.rank_real_guitar !== 0) content += addTabToAllLines(renderNumberOrStringValue('real_guitar', song.rank_real_guitar, format), 2)
        if (song.rank_real_bass !== undefined && song.rank_real_bass !== 0) content += addTabToAllLines(renderNumberOrStringValue('real_bass', song.rank_real_bass, format), 2)
        if (song.rank_band !== undefined && song.rank_band !== 0) content += addTabToAllLines(renderNumberOrStringValue('band', song.rank_band, format), 2)

        content += addTabToAllLines(renderSongEntryClose())
      }

      if (song.solo !== undefined) content += addTabToAllLines(renderArray('solo', song.solo, format, true, true))

      if (song.genre !== undefined) {
        const genre = customSource?.genre ? renderIfDef('CUSTOMSOURCE', customSource.genre, song.genre) : song.genre
        content += addTabToAllLines(renderNumberOrStringValue('genre', genre, format))
      }

      if (song.sub_genre !== undefined) {
        const subGenre = customSource?.sub_genre ? renderIfDef('CUSTOMSOURCE', customSource.sub_genre, song.sub_genre) : song.sub_genre
        content += addTabToAllLines(renderNumberOrStringValue('sub_genre', subGenre, format))
      }

      if (song.vocal_gender !== undefined) content += addTabToAllLines(renderNumberOrStringValue('vocal_gender', song.vocal_gender, format))
      if (song.format !== undefined) content += addTabToAllLines(renderNumberOrStringValue('format', song.format, format))
      if (song.version !== undefined) content += addTabToAllLines(renderNumberOrStringValue('version', song.version, format))
      if (song.album_art !== undefined) content += addTabToAllLines(renderBooleanValue('album_art', song.album_art, format))
      if (song.album_name !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('album_name', song.album_name, format))
      if (song.album_track_number !== undefined) content += addTabToAllLines(renderNumberOrStringValue('album_track_number', song.album_track_number, format))
      if (song.year_released !== undefined) content += addTabToAllLines(renderNumberOrStringValue('year_released', song.year_released, format))
      if (song.year_recorded !== undefined) content += addTabToAllLines(renderNumberOrStringValue('year_recorded', song.year_recorded, format))
      if (song.rating !== undefined) content += addTabToAllLines(renderNumberOrStringValue('rating', song.rating, format))
      if (song.tuning_offset_cents !== undefined) content += addTabToAllLines(renderNumberOrStringValue('tuning_offset_cents', song.tuning_offset_cents, format))
      if (song.guide_pitch_volume !== undefined) content += addTabToAllLines(renderNumberOrStringValue('guide_pitch_volume', String(song.guide_pitch_volume.toFixed(1)), format))

      if (song.game_origin !== undefined) {
        const gameOrigin = customSource?.game_origin ? renderIfDef('CUSTOMSOURCE', customSource.game_origin, song.game_origin) : song.game_origin
        content += addTabToAllLines(renderNumberOrStringValue('game_origin', gameOrigin, format))
      }

      if (song.encoding !== undefined) content += addTabToAllLines(renderNumberOrStringValue('encoding', song.encoding, format))
      if (song.vocal_tonic_note !== undefined) content += addTabToAllLines(renderNumberOrStringValue('vocal_tonic_note', song.vocal_tonic_note, format))
      if (song.song_tonality !== undefined) content += addTabToAllLines(renderNumberOrStringValue('song_tonality', song.song_tonality, format))
      if (song.song_key !== undefined) content += addTabToAllLines(renderNumberOrStringValue('song_key', song.song_key, format))
      if (song.real_guitar_tuning !== undefined) content += addTabToAllLines(renderArray('real_guitar_tuning', song.real_guitar_tuning, format, true, true))
      if (song.real_bass_tuning !== undefined) content += addTabToAllLines(renderArray('real_bass_tuning', song.real_bass_tuning, format, true, true))
      if (song.alternate_path !== undefined) content += addTabToAllLines(renderBooleanValue('alternate_path', song.alternate_path, format))
      if (song.base_points !== undefined) content += addTabToAllLines(renderNumberOrStringValue('base_points', song.base_points, format))
      if (song.extra_authoring !== undefined) content += addTabToAllLines(renderArray('extra_authoring', song.extra_authoring, format, true, true))
      if (this.opts.placeRB3DXAttributes) {
        if (song.author !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('author', song.author, format))
        if (song.strings_author !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('strings_author', song.strings_author, format))
        if (song.keys_author !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('keys_author', song.keys_author, format))
        if (song.loading_phrase !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('loading_phrase', song.loading_phrase, format))
      }
      if (song.pack_name !== undefined) content += addTabToAllLines(renderStringOnQuotesValue('pack_name', song.pack_name, format))

      if (this.type === 'songs' && this.opts.placeCustomAttributes) content += renderCustomAttributes(song)

      content += renderSongEntryClose()
    }
    if (this.type === 'songs_updates' && this.opts.allSongsInline) {
      const separatedContent = depackDTA(content)
        .map((s) =>
          s.split('\n').map((val) => {
            if (val.endsWith(') )')) return val.replace(/\) \)/, '))')
            return val
          })
        )
        .join('\n')
        .split('\n')
        .map((s) => s.slice(0, -2) + ')')
        .join('\n')

      console.log(separatedContent)
      content = separatedContent
    }
    return content
  }
}

export type DTAStringifyTypes = 'songs' | 'songs_updates'
export type StringGeneratorTypes = 'localeString' | 'string' | 'number' | 'numberOrLocaleString' | 'boolean' | 'array'
export type StringGeneratorValueType<T extends StringGeneratorTypes> = T extends 'localeString' ? string : T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : T extends 'numberOrLocaleString' ? number | string : (string | number)[]
export type DTAStringifyFormats = 'rbn' | 'rb3_dlc' | 'rb2'

export interface DTAStringifyOptions {
  /**
   * If `true`, each song will occupy only one line of the document. Default is `false`.
   *
   * This parameter only works when stringifying songs updates.
   */
  allSongsInline?: boolean
  /**
   * Specify the generated type of the DTA. Default is `'rbn'`.
   */
  format?: DTAStringifyFormats
  /**
   * By setting this to `true`, it places 1 to the
   * guitar audio channels on `cores`. Default is `false`.
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
   * If `false`, fake songs won't be ignored from the generated DTA file contents. Default is `true`.
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
   * Generates `pans` and `vols` arrays for songs without these informations.
   *
   * This parameter only takes effect using `'songs'` on the `type` parameter of the stringify function.
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
 * @param {PartialDTAFile | PartialDTAFile[]} songs An object containing all songs to be stringified.
 * @param {DTAStringifyTypes | undefined} type `OPTIONAL` The DTA type of the convertion. Default is `songs`.
 * @param {DTAStringifyOptions | undefined} options `OPTIONAL` An object with values that changes the behavior
 * of the DTA stringify process.
 * @returns {string} The generated DTA file contents.
 */
export const stringifyDTA = (songs: PartialDTAFile | PartialDTAFile[], type: DTAStringifyTypes = 'songs', options?: DTAStringifyOptions): string => {
  const opts = setDefaultOptions<DTAStringifyOptions>(
    {
      guitarCores: false,
      ignoreFakeSongs: false,
      placeCustomAttributes: true,
      placeRB3DXAttributes: true,
      sortBy: null,
      format: 'rbn',
      wiiMode: null,
      allSongsInline: false,
      customSource: null,
      autoGeneratePansAndVols: false,
    },
    options
  )

  const io = new DTAString(type, opts)
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
