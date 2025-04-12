import { bandAverageRankCalculator, channelsCountToPanArray, rankValuesToDTARankSystem, sortDTAMap, type DTAFile, type DTAMap, type DTARecord, type PartialDTAFile } from '../../lib'
import type { BandRankingNames, BandRankingNumbers, VocalPartsNames, VocalParts, SongGenreNames, SoloFlags } from './dtaLocale'

export type DrumTracksTypes = 2 | 'Stereo Else' | 3 | 'Mono Kick + Stereo Else' | 4 | 'Mono Kick + Mono Snare + Stereo Else' | 5 | 'Mono Kick + Stereo Snare + Stereo Else' | 6 | 'Stereo Kick + Stereo Snare + Stereo Else'

export type InstrumentChannelsTypes = 'Mono' | 'Stereo' | 1 | 2

export type PansVolsDrumsInformation<T extends DrumTracksTypes> = T extends 2 | 'Stereo Else' ? [number, number] : T extends 3 | 'Mono Kick + Stereo Else' ? [number, number, number] : T extends 4 | 'Mono Kick + Mono Snare + Stereo Else' ? [number, number, number, number] : T extends 5 | 'Mono Kick + Stereo Snare + Stereo Else' ? [number, number, number, number, number] : T extends 6 | 'Stereo Kick + Stereo Snare + Stereo Else' ? [number, number, number, number, number, number] : never

export type PansVolsInformation<T extends InstrumentChannelsTypes> = T extends 1 | 'Mono' ? [number] : T extends 2 | 'Stereo' ? [number, number] : never

export interface DrumUpdateOptions<T extends DrumTracksTypes> {
  /**
   * The quantity of channels for the drum part.
   *
   * Valid values are:
   * - `Stereo Else` (or `2`)
   * - `Mono Kick + Stereo Else` (or `3`)
   * - `Mono Kick + Mono Snare + Stereo Else` (or `4`)
   * - `Mono Kick + Stereo Snare + Stereo Else` (or `5`)
   * - `Stereo Kick + Stereo Snare + Stereo Else` (or `6`)
   */
  channels: T
  /**
   * The ranking of the instrument.
   */
  rank: BandRankingNames | BandRankingNumbers
  /**
   * Set to `true` if the instrument has solo sessions.
   */
  hasSolo?: boolean
  /**
   * Custom panning information. If not specified, mono tracks will have centered
   * `0.0` panning, and stereo tracks will be `-1.0` (for the left track) and `1.0` (for the right track).
   */
  pans?: PansVolsDrumsInformation<T>
  /**
   * Custom volume information. If not specified, all tracks from the insturment
   * will have no volume change (`0.0`).
   */
  vols?: PansVolsDrumsInformation<T>
}

export interface BassUpdateOptions<T extends InstrumentChannelsTypes> {
  /**
   * The quantity of channels for the instrument.
   *
   * Valid values are:
   * - `Mono` (or `1`)
   * - `Stereo` (or `2`)
   */
  channels: T
  /**
   * The ranking of the instrument.
   */
  rank: BandRankingNames | BandRankingNumbers
  /**
   * Set to `true` if the instrument has solo sessions.
   */
  hasSolo?: boolean
  /**
   * The ranking of the PRO Bass part.
   */
  rankPRO?: BandRankingNames | BandRankingNumbers
  /**
   * An array with the tuning of all 4 strings of the PRO Bass part.
   *
   * If the PRO Bass rank is specified, it will use E Standard `[0, 0, 0, 0]` as default.
   */
  tuning?: [number, number, number, number]
  /**
   * Custom panning information. If not specified, mono tracks will have centered
   * `0.0` panning, and stereo tracks will be `-1.0` (for the left track) and `1.0` (for the right track).
   */
  pans?: PansVolsInformation<T>
  /**
   * Custom volume information. If not specified, all tracks from the insturment
   * will have no volume change (`0.0`).
   */
  vols?: PansVolsInformation<T>
}

export interface GuitarUpdateOptions<T extends InstrumentChannelsTypes> {
  /**
   * The quantity of channels for the instrument.
   *
   * Valid values are:
   * - `Mono` (or `1`)
   * - `Stereo` (or `2`)
   */
  channels: T
  /**
   * The ranking of the instrument.
   */
  rank: BandRankingNames | BandRankingNumbers
  /**
   * Set to `true` if the instrument has solo sessions.
   */
  hasSolo?: boolean
  /**
   * The ranking of the PRO Guitar part.
   */
  rankPRO?: BandRankingNames | BandRankingNumbers
  /**
   * An array with the tuning of all 6 strings of the PRO Guitar part.
   *
   * If the PRO Guitar rank is specified, it will use E Standard `[0, 0, 0, 0, 0, 0]` as default.
   */
  tuning?: [number, number, number, number, number, number]
  /**
   * Custom panning information. If not specified, mono tracks will have centered
   * `0.0` panning, and stereo tracks will be `-1.0` (for the left track) and `1.0` (for the right track).
   */
  pans?: PansVolsInformation<T>
  /**
   * Custom volume information. If not specified, all tracks from the insturment
   * will have no volume change (`0.0`).
   */
  vols?: PansVolsInformation<T>
}

export interface VocalsUpdateOptions<T extends InstrumentChannelsTypes> {
  /**
   * The quantity of channels for the instrument.
   *
   * Valid values are:
   * - `Mono` (or `1`)
   * - `Stereo` (or `2`)
   */
  channels: T
  /**
   * The ranking of the instrument.
   */
  rank: BandRankingNames | BandRankingNumbers
  /**
   * Set to `true` if the instrument has solo sessions.
   */
  hasSolo?: boolean
  /**
   * The quantity of vocal parts of the song.
   */
  vocalParts: Exclude<VocalPartsNames, 'No Vocals'> | Exclude<VocalParts, 0>
  /**
   * Custom panning information. If not specified, mono tracks will have centered
   * `0.0` panning, and stereo tracks will be `-1.0` (for the left track) and `1.0` (for the right track).
   */
  pans?: PansVolsInformation<T>
  /**
   * Custom volume information. If not specified, all tracks from the insturment
   * will have no volume change (`0.0`).
   */
  vols?: PansVolsInformation<T>
}

export interface KeysUpdateOptions<T extends InstrumentChannelsTypes> {
  /**
   * The quantity of channels for the instrument.
   *
   * Valid values are:
   * - `Mono` (or `1`)
   * - `Stereo` (or `2`)
   */
  channels: T
  /**
   * The ranking of the instrument.
   */
  rank: BandRankingNames | BandRankingNumbers
  /**
   * Set to `true` if the instrument has solo sessions.
   */
  hasSolo?: boolean
  /**
   * The ranking of the PRO Keys part.
   */
  rankPRO?: BandRankingNames | BandRankingNumbers
  /**
   * Custom panning information. If not specified, mono tracks will have centered
   * `0.0` panning, and stereo tracks will be `-1.0` (for the left track) and `1.0` (for the right track).
   */
  pans?: PansVolsInformation<T>
  /**
   * Custom volume information. If not specified, all tracks from the insturment
   * will have no volume change (`0.0`).
   */
  vols?: PansVolsInformation<T>
}

export interface BackingUpdateOptions<T extends InstrumentChannelsTypes> {
  /**
   * The quantity of channels for the drum part.
   *
   * Valid values are:
   * - `Mono` (or `1`)
   * - `Stereo` (or `2`)
   */
  channels: T
  /**
   * Custom panning information. If not specified, mono tracks will have centered
   * `0.0` panning, and stereo tracks will be `-1.0` (for the left track) and `1.0` (for the right track).
   */
  pans?: PansVolsInformation<T>
  /**
   * Custom volume information. If not specified, all tracks from the insturment
   * will have no volume change (`0.0`).
   */
  vols?: PansVolsInformation<T>
}

export type DrumUpdateOptionsTypes = {
  [P in DrumTracksTypes]: DrumUpdateOptions<P>
}[DrumTracksTypes]
export type BassUpdateOptionsTypes = {
  [P in InstrumentChannelsTypes]: BassUpdateOptions<P>
}[InstrumentChannelsTypes]
export type GuitarUpdateOptionsTypes = {
  [P in InstrumentChannelsTypes]: GuitarUpdateOptions<P>
}[InstrumentChannelsTypes]
export type VocalsUpdateOptionsTypes = {
  [P in InstrumentChannelsTypes]: VocalsUpdateOptions<P>
}[InstrumentChannelsTypes]
export type KeysUpdateOptionsTypes = {
  [P in InstrumentChannelsTypes]: KeysUpdateOptions<P>
}[InstrumentChannelsTypes]
export type BackingUpdateOptionsTypes = {
  [P in InstrumentChannelsTypes]: BackingUpdateOptions<P>
}[InstrumentChannelsTypes]

export type SongKeyMajorValues = 'C' | 'C Major' | 'C#' | 'Db' | 'C# Major' | 'Db Major' | 'D' | 'D Major' | 'D#' | 'Eb' | 'D# Major' | 'Eb Major' | 'E' | 'E Major' | 'F' | 'F Major' | 'F#' | 'Gb' | 'F# Major' | 'Gb Major' | 'G' | 'G Major' | 'G#' | 'Ab' | 'G# Major' | 'Ab Major' | 'A' | 'A Major' | 'A#' | 'Bb' | 'A# Major' | 'Bb Major' | 'B' | 'B Major'

export type SongKeyMinorValues = 'Cm' | 'C Minor' | 'C#m' | 'Dbm' | 'C# Minor' | 'Db Minor' | 'Dm' | 'D Minor' | 'D#m' | 'Ebm' | 'D# Minor' | 'Eb Minor' | 'Em' | 'E Minor' | 'Fm' | 'F Minor' | 'F#m' | 'Gbm' | 'F# Minor' | 'Gb Minor' | 'Gm' | 'G Minor' | 'G#m' | 'Abm' | 'G# Minor' | 'Ab Minor' | 'Am' | 'A Minor' | 'A#m' | 'Bbm' | 'A# Minor' | 'Bb Minor' | 'Bm' | 'B Minor'

export type TrainerKeyOverrideValues = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'

export interface SongKeyUpdateOptions {
  key: SongKeyMajorValues | SongKeyMinorValues
  trainer_key_override?: TrainerKeyOverrideValues
}

export interface GenreUpdateOptions<G extends SongGenreNames> {
  /**
   * The song's genre.
   */
  genre: G
  /**
   * The song's sub-genre.
   */
  sub_genre?: SubGenreUpdateValues<G>
}

export type SongGenreUpdateOptions = {
  [P in SongGenreNames]: GenreUpdateOptions<P>
}[SongGenreNames]

export type SubGenreUpdateValues<G extends SongGenreNames> = G extends 'Classical' | 'Classic Rock' | 'Emo' | 'Fusion' | 'Grunge' | 'Inspirational' | 'J-Rock' | 'Latin' | 'Novelty' | 'Nu-Metal' | 'Southern Rock' | 'World' ? G : G extends 'Alternative' ? 'Alternative' | 'College' | 'Other' : G extends 'Blues' ? 'Acoustic' | 'Chicago' | 'Classic' | 'Contemporary' | 'Country' | 'Delta' | 'Electric' | 'Other' : G extends 'Country' ? 'Alternative' | 'Bluegrass' | 'Contemporary' | 'Honky Tonk' | 'Outlaw' | 'Traditional Folk' | 'Other' : G extends 'Glam' ? 'Glam' | 'Goth' | 'Other' : G extends 'Hip-Hop/Rap' ? 'Alternative Rap' | 'Gangsta' | 'Hardcore Rap' | 'Hip Hop' | 'Old School Hip Hop' | 'Rap' | 'Trip Hop' | 'Underground Rap' | 'Other' : G extends 'Indie Rock' ? 'Indie Rock' | 'Lo-fi' | 'Math Rock' | 'Noise' | 'Post Rock' | 'Shoegazing' | 'Other' : G extends 'Jazz' ? 'Acid Jazz' | 'Contemporary' | 'Experimental' | 'Ragtime' | 'Smooth' | 'Other' : G extends 'Metal' ? 'Alternative' | 'Black' | 'Core' | 'Death' | 'Hair' | 'Industrial' | 'Metal' | 'Power' | 'Prog' | 'Speed' | 'Thrash' | 'Other' : G extends 'New Wave' ? 'Dark Wave' | 'Electroclash' | 'New Wave' | 'Synthpop' | 'Other' : G extends 'Pop/Dance/Electronic' ? 'Ambient' | 'Breakbeat' | 'Chiptune' | 'Dance' | 'Downtempo' | 'Dub' | 'Drum and Bass' | 'Electronica' | 'Garage' | 'Hardcore Dance' | 'House' | 'Industrial' | 'Techno' | 'Trance' | 'Other' : G extends 'Pop-Rock' ? 'Contemporary' | 'Pop' | 'Soft Rock' | 'Teen' | 'Other' : G extends 'Prog' ? 'Prog Rock' : G extends 'Punk' ? 'Alternative' | 'Classic' | 'Dance Punk' | 'Garage' | 'Hardcore' | 'Pop' | 'Other' : G extends 'R&B/Soul/Funk' ? 'Disco' | 'Funk' | 'Motown' | 'Rhythm and Blues' | 'Soul' | 'Other' : G extends 'Reggae/Ska' ? 'Reggae' | 'Ska' | 'Other' : G extends 'Rock' ? 'Arena' | 'Blues' | 'Folk Rock' | 'Garage' | 'Hard Rock' | 'Psychedelic' | 'Rock' | 'Rockabilly' | 'Rock and Roll' | 'Surf' | 'Other' : G extends 'Other' ? 'A capella' | 'Acoustic' | 'Contemporary Folk' | 'Experimental' | 'Oldies' | 'Other' : never

export interface SongTracksData {
  /**
   * An unique shortname ID of the song. The same ID will be placed on shortname value as well.
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
   * Tells if the song is a master recording. Default is `true`.
   */
  master?: boolean
  /**
   * A numerical, unique number ID of the song, used as an ID for saving scores. Might be a string ID as well (but scores won't be saved on these songs).
   */
  song_id: number | string
  genre?: SongGenreUpdateOptions
  backingTracksCount?: InstrumentChannelsTypes | BackingUpdateOptionsTypes
  /**
   * An object specifying the structure of the drum part.
   */
  drum?: DrumUpdateOptionsTypes
  /**
   * An object specifying the structure of the bass part.
   */
  bass?: BassUpdateOptionsTypes
  /**
   * An object specifying the structure of the guitar part.
   */
  guitar?: GuitarUpdateOptionsTypes
  /**
   * An object specifying the structure of the vocals part.
   */
  vocals?: VocalsUpdateOptionsTypes
  /**
   * An object specifying the structure of the keys part.
   */
  keys?: KeysUpdateOptionsTypes
  /**
   * The quantity of channels for the backing track. Can be either `Mono` or `Stereo`. Default is `Stereo`.
   */
  bandRank?: BandRankingNumbers
  /**
   * Tells if the song has crowd channels.
   *
   * If `true`, crowd channels will be placed as stereo tracks with `0dB` volume.
   *
   * If it's a `number`, you can specify the volume of both crowd tracks
   *
   * if it's an `array`, you can specify the volume of each crowd tracks.
   *
   * Crowd channels are always stereo.
   */
  hasCrowdChannels?: true | [number, number] | number
}

export interface TrackStructureDataObject extends Omit<PartialDTAFile, 'id'> {
  tracks_count: DTAFile['tracks_count']
  vocal_parts: DTAFile['vocal_parts']
  rank_band: DTAFile['rank_band']
}

export const genTrackStructRecipe = (data: SongTracksData): DTAFile => {
  const map = new Map() as DTAMap

  const { backingTracksCount, drum, bandRank, bass, guitar, hasCrowdChannels, keys, vocals, genre, id, master, artist, name, song_id } = data

  map.set('id', id)
  map.set('name', name)
  map.set('artist', artist)
  map.set('song_id', song_id)
  map.set('songname', id)

  if (typeof master === 'boolean') map.set('master', master)
  else map.set('master', true)

  if (genre) {
    const { genre: g, sub_genre } = genre
    map.set('genre', g)
    if (sub_genre) map.set('sub_genre', sub_genre)
  }

  const tracksCount = [0, 0, 0, 0, 0, 0]
  let pans: number[] = []
  let vols: number[] = []
  const solo: SoloFlags[] = []
  let instrumentCount = 0
  let gtrTuning: number[] = [0, 0, 0, 0, 0, 0]
  let bassTuning: number[] = [0, 0, 0, 0]

  const drumT = drum ? channelsCountToPanArray(drum.channels).length : 0
  const bassT = bass ? channelsCountToPanArray(bass.channels).length : 0
  const guitarT = guitar ? channelsCountToPanArray(guitar.channels).length : 0
  const vocalsT = vocals ? channelsCountToPanArray(vocals.channels).length : 0
  const keysT = keys ? channelsCountToPanArray(keys.channels).length : 0
  const backingT = backingTracksCount ? channelsCountToPanArray(typeof backingTracksCount === 'object' ? backingTracksCount.channels : backingTracksCount).length : 2

  map.set('tracks_count', [drumT, bassT, guitarT, vocalsT, keysT, backingT])

  let drumR = 0,
    bassR = 0,
    guitarR = 0,
    vocalsR = 0,
    keysR = 0,
    real_guitarR = 0,
    real_bassR = 0,
    real_keysR = 0

  if (drum) {
    instrumentCount++

    drumR = rankValuesToDTARankSystem('drum', drum.rank)
    map.set('rank_drum', drumR)

    channelsCountToPanArray(drum.channels).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })

    if (drum.pans) {
      pans = pans.slice(0, drum.pans.length * -1)
      drum.pans.forEach((pan) => pans.push(pan))
    }

    if (drum.vols) {
      vols = vols.slice(0, drum.vols.length * -1)
      drum.vols.forEach((pan) => vols.push(pan))
    }

    if (drum.hasSolo) solo.push('drum')
  }

  if (bass) {
    instrumentCount++

    bassR = rankValuesToDTARankSystem('bass', bass.rank)
    real_bassR = rankValuesToDTARankSystem('real_bass', bass.rankPRO ?? -1)
    map.set('rank_bass', bassR)
    map.set('rank_real_bass', real_bassR)

    if (real_bassR > 0) {
      if (bass.tuning) bassTuning = bass.tuning
      map.set('real_bass_tuning', bassTuning)
    }

    channelsCountToPanArray(bass.channels).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })

    if (bass.pans) {
      pans = pans.slice(0, bass.pans.length * -1)
      bass.pans.forEach((pan) => pans.push(pan))
    }

    if (bass.vols) {
      vols = vols.slice(0, bass.vols.length * -1)
      bass.vols.forEach((pan) => vols.push(pan))
    }

    if (bass.hasSolo) solo.push('bass')
  }

  if (guitar) {
    instrumentCount++

    guitarR = rankValuesToDTARankSystem('guitar', guitar.rank)
    real_guitarR = rankValuesToDTARankSystem('real_guitar', guitar.rankPRO ?? -1)
    map.set('rank_guitar', guitarR)
    map.set('rank_real_guitar', real_guitarR)

    if (real_guitarR > 0) {
      if (guitar.tuning) gtrTuning = guitar.tuning
      map.set('real_guitar_tuning', gtrTuning)
    }

    channelsCountToPanArray(guitar.channels).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })

    if (guitar.pans) {
      pans = pans.slice(0, guitar.pans.length * -1)
      guitar.pans.forEach((pan) => pans.push(pan))
    }

    if (guitar.vols) {
      vols = vols.slice(0, guitar.vols.length * -1)
      guitar.vols.forEach((pan) => vols.push(pan))
    }

    if (guitar.hasSolo) solo.push('guitar')
  }

  if (vocals) {
    instrumentCount++

    vocalsR = rankValuesToDTARankSystem('vocals', vocals.rank)
    map.set('rank_vocals', vocalsR)

    map.set('vocal_parts', typeof vocals.vocalParts === 'number' ? vocals.vocalParts : vocals.vocalParts === 'Solo Vocals' ? 1 : vocals.vocalParts === '2-Part Harmonies' ? 2 : 3)

    channelsCountToPanArray(vocals.channels).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })

    if (vocals.pans) {
      pans = pans.slice(0, vocals.pans.length * -1)
      vocals.pans.forEach((pan) => pans.push(pan))
    }

    if (vocals.vols) {
      vols = vols.slice(0, vocals.vols.length * -1)
      vocals.vols.forEach((pan) => vols.push(pan))
    }

    if (vocals.hasSolo) solo.push('vocal_percussion')
  }

  if (keys) {
    instrumentCount++

    keysR = rankValuesToDTARankSystem('keys', keys.rank)
    real_keysR = rankValuesToDTARankSystem('real_keys', keys.rankPRO ?? -1)
    map.set('rank_keys', keysR)
    map.set('rank_real_keys', real_keysR)

    channelsCountToPanArray(keys.channels).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })

    if (keys.pans) {
      pans = pans.slice(0, keys.pans.length * -1)
      keys.pans.forEach((pan) => pans.push(pan))
    }

    if (keys.vols) {
      vols = vols.slice(0, keys.vols.length * -1)
      keys.vols.forEach((pan) => vols.push(pan))
    }

    if (keys.hasSolo) solo.push('keys')
  }

  if (!backingTracksCount) {
    // Do nothing
  } else if (typeof backingTracksCount === 'object') {
    channelsCountToPanArray(backingTracksCount.channels).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })

    if (backingTracksCount.pans) {
      pans = pans.slice(0, backingTracksCount.pans.length * -1)
      backingTracksCount.pans.forEach((pan) => pans.push(pan))
    }

    if (backingTracksCount.vols) {
      vols = vols.slice(0, backingTracksCount.vols.length * -1)
      backingTracksCount.vols.forEach((pan) => vols.push(pan))
    }
  } else {
    channelsCountToPanArray(backingTracksCount).forEach((pan) => {
      pans.push(pan)
      vols.push(0)
    })
  }

  if (hasCrowdChannels) {
    tracksCount.push(2)
    pans.push(-2.5, 2.5)
    if (hasCrowdChannels === true) vols.push(0, 0)
    else if (typeof hasCrowdChannels === 'number') vols.push(hasCrowdChannels)
    else {
      const [leftC, rightC] = hasCrowdChannels
      vols.push(leftC)
      vols.push(rightC)
    }
  }

  if (bandRank) map.set('rank_band', rankValuesToDTARankSystem('band', bandRank))
  else map.set('rank_band', bandAverageRankCalculator(guitarR + bassR + drumR + keysR + vocalsR, instrumentCount))

  map.set('pans', pans)
  map.set('vols', vols)
  if (solo.length > 0) map.set('solo', solo)

  return Object.fromEntries(sortDTAMap(map).entries()) as DTARecord as DTAFile
}
