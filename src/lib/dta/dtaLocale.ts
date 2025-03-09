import type { LiteralUnion } from 'type-fest'

/**
 * An object that holds information of many values used in a DTA file.
 */
export const dtaLocale = {
  allKeys: ['id', 'name', 'artist', 'fake', 'master', 'context', 'song_id', 'upgrade_version', 'songname', 'tracks_count', 'pans', 'vols', 'cores', 'vocal_parts', 'mute_volume', 'mute_volume_vocals', 'hopo_threshold', 'song_scroll_speed', 'bank', 'drum_bank', 'anim_tempo', 'band_fail_cue', 'preview', 'song_length', 'rank_drum', 'rank_guitar', 'rank_bass', 'rank_vocals', 'rank_keys', 'rank_real_keys', 'rank_real_guitar', 'rank_real_bass', 'rank_band', 'solo', 'genre', 'sub_genre', 'vocal_gender', 'format', 'version', 'album_art', 'album_name', 'album_track_number', 'year_released', 'year_recorded', 'rating', 'tuning_offset_cents', 'guide_pitch_volume', 'game_origin', 'encoding', 'vocal_tonic_note', 'song_tonality', 'song_key', 'real_guitar_tuning', 'real_bass_tuning', 'alternate_path', 'base_points', 'extra_authoring', 'author', 'strings_author', 'keys_author', 'loading_phrase', 'pack_name', 'languages', 'karaoke', 'multitrack', 'convert', 'double_kick', 'rhythm_on_keys', 'rhythm_on_bass', 'cat_ehm', 'expert_only'],
  name: {
    '123': '123',
    A: 'a',
    B: 'b',
    C: 'c',
    D: 'd',
    E: 'e',
    F: 'f',
    G: 'g',
    H: 'h',
    I: 'i',
    J: 'j',
    K: 'k',
    L: 'l',
    M: 'm',
    N: 'n',
    O: 'o',
    P: 'p',
    Q: 'q',
    R: 'r',
    S: 's',
    T: 't',
    U: 'u',
    V: 'v',
    W: 'w',
    X: 'x',
    Y: 'y',
    Z: 'z',
  },
  animTempo: {
    16: 'Slow',
    32: 'Medium',
    64: 'Fast',
  },
  animTempoStrings: {
    kTempoSlow: 'Slow',
    kTempoMedium: 'Medium',
    kTempoFast: 'Fast',
  },
  bandFailCue: {
    'band_fail_rock.cue': 'Rock',
    'band_fail_vintage.cue': 'Vintage',
    'band_fail_heavy.cue': 'Heavy',
    'band_fail_electro.cue': 'Electro',
    'band_fail_rock_keys.cue': 'Rock (Keys)',
    'band_fail_vintage_keys.cue': 'Vintage (Keys)',
    'band_fail_heavy_keys.cue': 'Heavy (Keys)',
    'band_fail_electro_keys.cue': 'Electro (Keys)',
  },
  percussionBank: {
    'sfx/tambourine_bank.milo': 'Tambourine',
    'sfx/cowbell_bank.milo': 'Cowbell',
    'sfx/handclap_bank.milo': 'Hand Clap',
    'sfx/cowbell3_bank.milo': 'Cowbell (Alternate)',
  },
  drumBank: {
    'sfx/kit01_bank.milo': 'Hard Rock Kit',
    'sfx/kit02_bank.milo': 'Arena Kit',
    'sfx/kit03_bank.milo': 'Vintage Kit',
    'sfx/kit04_bank.milo': 'Trashy Kit',
    'sfx/kit05_bank.milo': 'Electronic Kit',
  },
  genre: {
    alternative: 'Alternative',
    blues: 'Blues',
    classical: 'Classical',
    classicrock: 'Classic Rock',
    country: 'Country',
    emo: 'Emo',
    fusion: 'Fusion',
    glam: 'Glam',
    grunge: 'Grunge',
    hiphoprap: 'Hip-Hop/Rap',
    indierock: 'Indie Rock',
    inspirational: 'Inspirational',
    jazz: 'Jazz',
    jrock: 'J-Rock',
    latin: 'Latin',
    metal: 'Metal',
    new_wave: 'New Wave',
    novelty: 'Novelty',
    numetal: 'Nu-Metal',
    popdanceelectronic: 'Pop/Dance/Electronic',
    poprock: 'Pop-Rock',
    prog: 'Prog',
    punk: 'Punk',
    rbsoulfunk: 'R&B/Soul/Funk',
    reggaeska: 'Reggae/Ska',
    rock: 'Rock',
    southernrock: 'Southern Rock',
    world: 'World',
    other: 'Other',
  },
  subGenre: {
    subgenre_alternative: 'Alternative',
    subgenre_college: 'College',
    subgenre_other: 'Other',
    subgenre_acoustic: 'Acoustic',
    subgenre_chicago: 'Chicago',
    subgenre_classic: 'Classic',
    subgenre_contemporary: 'Contemporary',
    subgenre_country: 'Country',
    subgenre_delta: 'Delta',
    subgenre_electric: 'Electric',
    subgenre_classical: 'Classical',
    subgenre_classicrock: 'Classic Rock',
    subgenre_bluegrass: 'Bluegrass',
    subgenre_honkytonk: 'Honky Tonk',
    subgenre_outlaw: 'Outlaw',
    subgenre_traditionalfolk: 'Traditional Folk',
    subgenre_emo: 'Emo',
    subgenre_fusion: 'Fusion',
    subgenre_glam: 'Glam',
    subgenre_goth: 'Goth',
    subgenre_grunge: 'Grunge',
    subgenre_alternativerap: 'Alternative Rap',
    subgenre_gangsta: 'Gangsta',
    subgenre_hardcorerap: 'Hardcore Rap',
    subgenre_hiphop: 'Hip Hop',
    subgenre_oldschoolhiphop: 'Old School Hip Hop',
    subgenre_rap: 'Rap',
    subgenre_triphop: 'Trip Hop',
    subgenre_undergroundrap: 'Underground Rap',
    subgenre_indierock: 'Indie Rock',
    subgenre_lofi: 'Lo-fi',
    subgenre_mathrock: 'Math Rock',
    subgenre_noise: 'Noise',
    subgenre_postrock: 'Post Rock',
    subgenre_shoegazing: 'Shoegazing',
    subgenre_inspirational: 'Inspirational',
    subgenre_acidjazz: 'Acid Jazz',
    subgenre_experimental: 'Experimental',
    subgenre_ragtime: 'Ragtime',
    subgenre_smooth: 'Smooth',
    subgenre_jrock: 'J-Rock',
    subgenre_latin: 'Latin',
    subgenre_black: 'Black',
    subgenre_core: 'Core',
    subgenre_death: 'Death',
    subgenre_hair: 'Hair',
    subgenre_industrial: 'Industrial',
    subgenre_metal: 'Metal',
    subgenre_power: 'Power',
    subgenre_prog: 'Prog',
    subgenre_speed: 'Speed',
    subgenre_thrash: 'Thrash',
    subgenre_darkwave: 'Dark Wave',
    subgenre_electroclash: 'Electroclash',
    subgenre_new_wave: 'New Wave',
    subgenre_synth: 'Synthpop',
    subgenre_novelty: 'Novelty',
    subgenre_numetal: 'Nu-Metal',
    subgenre_ambient: 'Ambient',
    subgenre_breakbeat: 'Breakbeat',
    subgenre_chiptune: 'Chiptune',
    subgenre_dance: 'Dance',
    subgenre_downtempo: 'Downtempo',
    subgenre_dub: 'Dub',
    subgenre_drumandbass: 'Drum and Bass',
    subgenre_electronica: 'Electronica',
    subgenre_garage: 'Garage',
    subgenre_hardcoredance: 'Hardcore Dance',
    subgenre_house: 'House',
    subgenre_techno: 'Techno',
    subgenre_trance: 'Trance',
    subgenre_pop: 'Pop',
    subgenre_softrock: 'Soft Rock',
    subgenre_teen: 'Teen',
    subgenre_progrock: 'Prog Rock',
    subgenre_dancepunk: 'Dance Punk',
    subgenre_hardcore: 'Hardcore',
    subgenre_disco: 'Disco',
    subgenre_funk: 'Funk',
    subgenre_motown: 'Motown',
    subgenre_rhythmandblues: 'Rhythm and Blues',
    subgenre_soul: 'Soul',
    subgenre_reggae: 'Reggae',
    subgenre_ska: 'Ska',
    subgenre_arena: 'Arena',
    subgenre_blues: 'Blues',
    subgenre_folkrock: 'Folk Rock',
    subgenre_hardrock: 'Hard Rock',
    subgenre_psychadelic: 'Psychedelic',
    subgenre_rock: 'Rock',
    subgenre_rockabilly: 'Rockabilly',
    subgenre_rockandroll: 'Rock and Roll',
    subgenre_surf: 'Surf',
    subgenre_southernrock: 'Southern Rock',
    subgenre_world: 'World',
    subgenre_acapella: 'A capella',
    subgenre_contemporaryfolk: 'Contemporary Folk',
    subgenre_oldies: 'Oldies',
  },
  instruments: {
    band: 'Band',
    bass: 'Bass',
    drums: 'Drums',
    guitar: 'Guitar',
    keys: 'Keys',
    real_drums: 'PRO Drums',
    real_bass: 'PRO Bass',
    real_guitar: 'PRO Guitar',
    real_keys: 'PRO Keys',
    vocals: 'Solo Vocals',
    harmonies: 'Harmonies',
  },
  rating: {
    1: 'Family Friendly',
    2: 'Supervision Recommended',
    3: 'Mature Content',
    4: 'No Rating',
  },
  songScrollSpeed: {
    1700: 'Crazy',
    1850: 'Faster',
    2000: 'Fast',
    2150: 'Medium Fast',
    2300: 'Normal',
    2450: 'Medium Slow',
    2600: 'Slow',
    2750: 'Slower',
    3000: 'Comatose',
  },
  vocalGender: {
    male: 'Male',
    female: 'Female',
  },
  vocalParts: {
    0: 'No Vocals',
    1: 'Solo Vocals',
    2: '2-Part Harmonies',
    3: '3-Part Harmonies',
  },
  rankName: {
    '-1': 'No Part',
    0: 'Warmup',
    1: 'Apprentice',
    2: 'Solid',
    3: 'Moderate',
    4: 'Challenging',
    5: 'Nightmare',
    6: 'Impossible',
  },
  rankDots: {
    '-1': 'No Part',
    0: 'Zero Dots',
    1: 'One Dot',
    2: 'Two Dots',
    3: 'Three Dots',
    4: 'Four Dots',
    5: 'Five Dots',
    6: 'Devil Dots',
  },
  solo: {
    drum: 'Drums',
    bass: 'Bass',
    guitar: 'Guitar',
    keys: 'Keys',
    vocal_percussion: 'Vocal Percussion',
  },
  extraAuthoring: {
    disc_update: 'Disc Update',
    pearljam: 'Pearl Jam',
    greenday: 'Green Day',
  },
  encoding: {
    latin1: 'Latin-1',
    utf8: 'UTF-8',
  },
  gameOrigin: {
    rb1: 'Rock Band 1',
    rb1_dlc: 'Rock Band 1 DLC',
    rb2: 'Rock Band 2',
    rb2_dlc: 'Rock Band 2 DLC',
    rb3: 'Rock Band 3',
    rb3_dlc: 'Rock Band 3 DLC',
    lego: 'LEGO Rock Band',
    greenday: 'Green Day: Rock Band',
    ugc: 'User-generated content/Rock Band Network',
    ugc_plus: 'User-generated content/Rock Band Network 2.0',
  },
  songKey: {
    0: 'C',
    1: 'Db',
    2: 'D',
    3: 'Eb',
    4: 'E',
    5: 'F',
    6: 'F#',
    7: 'G',
    8: 'Ab',
    9: 'A',
    10: 'Bb',
    11: 'B',
  },
  songTonality: {
    0: 'Major',
    1: 'Minor',
  },
  sortingType: {
    name: 'Song Title',
    artist: 'Artist',
    artist_and_name: 'Artist, Song Title',
    artist_set: 'Artist, Year Released, Album Name, Album Track Number',
    id: 'ID',
    song_id: 'Song ID',
  },
} as const

export type SongTitleOptionsUppercaseNames = keyof typeof dtaLocale.name
export type SongTitleOptionsLowercaseNames = (typeof dtaLocale.name)[SongTitleOptionsUppercaseNames]

export type ExtractNumbers<T> = T extends number ? T : never
export type ExtractStrings<T> = T extends string ? T : never
export type StringNumToNum<T> = T extends '-1' ? -1 : T

export type AnimTempo = keyof typeof dtaLocale.animTempo | keyof typeof dtaLocale.animTempoStrings
export type AnimTempoStrings = ExtractStrings<AnimTempo>
export type AnimTempoNumbers = ExtractNumbers<AnimTempo>
export type AnimTempoNames = (typeof dtaLocale.animTempo)[AnimTempoNumbers]

export type BandFailCue = keyof typeof dtaLocale.bandFailCue
export type BandFailCueNames = (typeof dtaLocale.bandFailCue)[BandFailCue]

export type PercussionBank = keyof typeof dtaLocale.percussionBank
export type PercussionBankNames = (typeof dtaLocale.percussionBank)[PercussionBank]

export type DrumBank = keyof typeof dtaLocale.drumBank
export type DrumBankNames = (typeof dtaLocale.drumBank)[DrumBank]

export type SongGenre = keyof typeof dtaLocale.genre
export type SongGenreNames = (typeof dtaLocale.genre)[SongGenre]

export type SongRating = keyof typeof dtaLocale.rating
export type SongRatingNames = (typeof dtaLocale.rating)[SongRating]

export type SongScrollSpeed = keyof typeof dtaLocale.songScrollSpeed
export type SongScrollSpeedNames = (typeof dtaLocale.songScrollSpeed)[SongScrollSpeed]

export type SongSubGenre = keyof typeof dtaLocale.subGenre
export type SongSubGenreNames = (typeof dtaLocale.subGenre)[SongSubGenre]

export type VocalGender = keyof typeof dtaLocale.vocalGender
export type VocalGenderNames = (typeof dtaLocale.vocalGender)[VocalGender]

export type VocalParts = keyof typeof dtaLocale.vocalParts
export type VocalPartsNames = (typeof dtaLocale.vocalParts)[VocalParts]

export type SongKey = keyof typeof dtaLocale.songKey
export type SongTonality = keyof typeof dtaLocale.songTonality

export type InstrRankingNumbers = StringNumToNum<keyof typeof dtaLocale.rankName>
export type InstrRankingNames = (typeof dtaLocale.rankName)[InstrRankingNumbers]
export type InstrRankingNamesAsDots = (typeof dtaLocale.rankDots)[InstrRankingNumbers]

export type BandRankingNumbers = Exclude<InstrRankingNumbers, -1>
export type BandRankingNames = (typeof dtaLocale.rankName)[BandRankingNumbers]
export type BandRankingNamesAsDots = (typeof dtaLocale.rankDots)[BandRankingNumbers]

export type SoloFlags = keyof typeof dtaLocale.solo
export type SoloFlagsNames = (typeof dtaLocale.solo)[SoloFlags]

export type ExtraAuthoringFlags = keyof typeof dtaLocale.extraAuthoring
export type ExtraAuthoringFlagsNames = (typeof dtaLocale.extraAuthoring)[ExtraAuthoringFlags]

export type SongEncoding = keyof typeof dtaLocale.encoding
export type SongEncodingNames = (typeof dtaLocale.encoding)[SongEncoding]

export type SongGameOrigin = keyof typeof dtaLocale.gameOrigin
export type SongGameOriginNames = (typeof dtaLocale.gameOrigin)[SongGameOrigin]

export type SongSortingTypes = (typeof dtaLocale.sortingType)[keyof typeof dtaLocale.sortingType] | null

export type InstrumentTypes = keyof typeof dtaLocale.instruments
export type InstrumentNames = (typeof dtaLocale.instruments)[keyof typeof dtaLocale.instruments]

export type LocaleKeyToValueTypes = Exclude<keyof typeof dtaLocale, 'allKeys' | 'sortingType'>

/**
 * Searchs for values in the locale type based on the type and the key of the value, returning the provided
 * key if the value is not found of the provided type.
 * - - - -
 * @param {LocaleKeyToValueTypes} type The type of the key value where it's going to be searched from.
 * @param {LiteralUnion<keyof (typeof dtaLocale)[T], string | number>} key The key of the value you want to search for.
 * @returns {string} The value or the provided key, if the value is not found on the locale object.
 */
export const localeKeyToValue = <T extends LocaleKeyToValueTypes>(type: T, key: LiteralUnion<keyof (typeof dtaLocale)[T], string | number>): string => {
  if (key.toString() in dtaLocale[type]) return dtaLocale[type][key.toString() as keyof (typeof dtaLocale)[typeof type]] as string
  return key.toString()
}
