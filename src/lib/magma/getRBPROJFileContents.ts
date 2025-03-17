import { BinaryWriter, DTAIO, genAudioFileStructure, type DTAFile } from '../../lib'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MAGMAProjectData extends DTAFile {}

export const getRBPROJFileContents = (songdata: MAGMAProjectData): string => {
  const { allTracksCount, backing, bass, crowd, drum, guitar, keys, vocals } = genAudioFileStructure(songdata)
  const hasEnglish = songdata.languages ? (songdata.languages.findIndex((value) => value === 'english') > -1 ? true : false) : true
  const hasFrench = songdata.languages ? (songdata.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
  const hasItalian = songdata.languages ? (songdata.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
  const hasSpanish = songdata.languages ? (songdata.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
  const hasGerman = songdata.languages ? (songdata.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
  const hasJapanese = songdata.languages ? (songdata.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
  const io = new DTAIO(DTAIO.formatOptions.defaultMAGMA)
  io.addValue('project', {
    tool_version: '110411_A',
    project_version: 24,
    metadata: {
      song_name: songdata.name,
      artist_name: songdata.artist,
      genre: songdata.genre,
      sub_genre: songdata.sub_genre ?? 'subgenre_other',
      year_released: songdata.year_released,
      author: songdata.author ?? '',
      release_label: '',
      country: 'ugc_country_us',
      price: 80,
      track_number: songdata.album_track_number ?? 1,
      has_album: songdata.album_art,
    },
    gamedata: {
      preview_start_ms: songdata.preview[0],
      rank_guitar: songdata.rank_guitar ?? 0,
      rank_bass: songdata.rank_bass ?? 0,
      rank_drum: songdata.rank_drum ?? 0,
      rank_vocals: songdata.rank_vocals ?? 0,
      rank_keys: songdata.rank_keys ?? 0,
      rank_pro_keys: songdata.rank_real_keys ?? 0,
      rank_band: songdata.rank_band,
      vocal_scroll_speed: songdata.song_scroll_speed ?? 2300,
      anim_tempo: songdata.anim_tempo,
      vocal_gender: songdata.vocal_gender,
      vocal_percussion: songdata.bank === 'sfx/tambourine_bank.milo' ? 'tambourine' : 'tambourine',
      vocal_parts: songdata.vocal_parts,
      guide_pitch_volume: songdata.guide_pitch_volume ? DTAIO.useFloat(songdata.guide_pitch_volume, io.options.number) : DTAIO.useFloat(-3, io.options.number),
    },
    languages: {
      english: hasEnglish,
      french: hasFrench,
      italian: hasItalian,
      spanish: hasSpanish,
      german: hasGerman,
      japanese: hasJapanese,
    },
    destination_file: '',
    midi: {
      file: '',
      autogen_theme: 'ArenaRock.rbtheme',
    },
    dry_vox: {
      part0: {
        file: '',
        enabled: true,
      },
      part1: {
        file: '',
        enabled: true,
      },
      part2: {
        file: '',
        enabled: true,
      },
      tuning_offset_cents: songdata.tuning_offset_cents ? DTAIO.useFloat(songdata.tuning_offset_cents, io.options.number) : DTAIO.useFloat(0, io.options.number),
    },
    album_art: {
      file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\default.bmp',
    },
    tracks: {
      drum_layout: drum.drum_layout,
      drum_kit: {
        enabled: drum.kitEnabled,
        channels: drum.kitChannels,
        pan: DTAIO.useArray(
          drum.kitPan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          drum.kitVol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      drum_kick: {
        enabled: drum.kickEnabled,
        channels: drum.kickChannels,
        pan: DTAIO.useArray(
          drum.kickPan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          drum.kickVol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      drum_snare: {
        enabled: drum.snareEnabled,
        channels: drum.snareChannels,
        pan: DTAIO.useArray(
          drum.snarePan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          drum.snareVol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      bass: {
        enabled: bass.enabled,
        channels: bass.channels,
        pan: DTAIO.useArray(
          bass.pan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          bass.vol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      guitar: {
        enabled: guitar.enabled,
        channels: guitar.channels,
        pan: DTAIO.useArray(
          guitar.pan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          guitar.vol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      vocals: {
        enabled: vocals.enabled,
        channels: vocals.channels,
        pan: DTAIO.useArray(
          vocals.pan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          vocals.vol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      keys: {
        enabled: keys.enabled,
        channels: keys.channels,
        pan: DTAIO.useArray(
          keys.pan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          keys.vol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
      backing: {
        enabled: backing.enabled,
        channels: backing.channels,
        pan: DTAIO.useArray(
          backing.pan.map((pan) => DTAIO.useFloat(pan, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        vol: DTAIO.useArray(
          backing.vol.map((vol) => DTAIO.useFloat(vol, io.options.number)),
          { array: { parenthesisForValues: false, keyAndValueInline: 'true' } }
        ),
        file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
      },
    },
  })

  return io.toString()
}

export const getC3FileContents = (songdata: MAGMAProjectData): string => {
  const io = new BinaryWriter()

  return io.toBuffer().toString()
}
