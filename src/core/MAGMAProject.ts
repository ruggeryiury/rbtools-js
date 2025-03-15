import { DTAIO, genAudioFileStructure, type DTAFile } from '../lib'

export interface MAGMAProjectData extends DTAFile {}

export class MAGMAProject {
  song: MAGMAProjectData
  constructor(song: MAGMAProjectData) {
    this.song = song
  }

  getRBPROJFileContents(): string {
    const { allTracksCount, backing, bass, crowd, drum, guitar, keys, vocals } = genAudioFileStructure(this.song)
    const hasEnglish = this.song.languages ? (this.song.languages.findIndex((value) => value === 'english') > -1 ? true : false) : true
    const hasFrench = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasItalian = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasSpanish = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasGerman = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasJapanese = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const io = new DTAIO()
    io.addValue('project', {
      tool_version: '110411_A',
      project_version: 24,
      metadata: {
        song_name: this.song.name,
        artist_name: this.song.artist,
        genre: this.song.genre,
        sub_genre: this.song.sub_genre ?? 'subgenre_other',
        year_released: this.song.year_released,
        author: this.song.author ?? '',
        release_label: '',
        country: 'ugc_country_us',
        price: 80,
        track_number: this.song.album_track_number ?? 1,
        has_album: this.song.album_art,
      },
      gamedata: {
        preview_start_ms: this.song.preview[0],
        rank_guitar: this.song.rank_guitar ?? 0,
        rank_bass: this.song.rank_bass ?? 0,
        rank_drum: this.song.rank_drum ?? 0,
        rank_vocals: this.song.rank_vocals ?? 0,
        rank_keys: this.song.rank_keys ?? 0,
        rank_pro_keys: this.song.rank_real_keys ?? 0,
        rank_band: this.song.rank_band,
        vocal_scroll_speed: this.song.song_scroll_speed ?? 2300,
        anim_tempo: this.song.anim_tempo,
        vocal_gender: this.song.vocal_gender,
        vocal_percussion: this.song.bank === 'sfx/tambourine_bank.milo' ? 'tambourine' : 'tambourine',
        vocal_parts: this.song.vocal_parts,
        guide_pitch_volume: this.song.guide_pitch_volume ? `@{float(${this.song.guide_pitch_volume.toFixed(2)})}` : '@{float(-3.00)}',
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
        tuning_offset_cents: this.song.tuning_offset_cents ? `@{float(${this.song.tuning_offset_cents.toFixed(2)})}` : '@{float(0.00)}',
      },
      album_art: {
        file: 'C:\\\\Users\\\\Ruggery\\\\Desktop\\\\Rock Band\\\\Magma\\\\default.bmp',
      },
      tracks: {
        drum_layout: drum.drum_layout,
        drum_kit: {
          enabled: drum.enabled,
          channels: drum.channels,
          pan: drum.pan,
          vol: drum.vol,
          file: 'C:\\\\Users\\\\Ruggery\\\\Desktop\\\\Rock Band\\\\Magma\\\\audio\\\\stereo44.wav',
        },
      },
    })

    return io.toString()
  }
}
