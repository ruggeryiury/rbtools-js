import { Path, type PathLikeTypes } from 'path-js'
import { setDefaultOptions } from 'set-default-options'
import { MissingRequiredValueError } from '../errors'
import { BinaryWriter, DTAIO, formatStringFromDTA, genAudioFileStructure, rankCalculator, type DTAFile, type MAGMAProjectSongData } from '../lib'

export interface MAGMAProjectOptionsObject {
  magmaPath?: string
  songsProjectRootFolderPath?: string
  destPath?: string
  songFolderName?: string
  dryVox1Name?: string
  dryVox2Name?: string
  dryVox3Name?: string
  albumArtName?: string
  albumArtNamePNG?: string
  kickWavName?: string
  kick2xWavName?: string
  snareWavName?: string
  drumKitWavName?: string
  drumsWavName?: string
  drums2xWavName?: string
  bassWavName?: string
  guitarWavName?: string
  vocalsWavName?: string
  keysWavName?: string
  backingWavName?: string
  crowdWavName?: string
  midiFileName?: string
  conFilePackageName?: string
  conFilePackageDesc?: string
}

export class MAGMAProject {
  song: DTAFile
  options: Required<MAGMAProjectOptionsObject>

  static readonly defaultMAGMAProjectOptions: Required<MAGMAProjectOptionsObject> = {
    magmaPath: '',
    songsProjectRootFolderPath: '',
    destPath: Path.resolve(process.env.USERPROFILE, 'Desktop/{{songname}}.rba'),
    songFolderName: '{{songname}}',
    albumArtName: 'gen/{{songname}}_keep_x256.bmp',
    albumArtNamePNG: 'gen/{{songname}}_keep.png',
    midiFileName: '{{songname}}.mid',
    dryVox1Name: 'gen/HARM1.wav',
    dryVox2Name: 'gen/HARM2.wav',
    dryVox3Name: 'gen/HARM3.wav',
    kickWavName: 'wav/kick.wav',
    kick2xWavName: 'wav/kick2x.wav',
    snareWavName: 'wav/snare.wav',
    drumKitWavName: 'wav/kit.wav',
    drumsWavName: 'wav/drums.wav',
    drums2xWavName: 'wav/drums.wav',
    bassWavName: 'wav/bass.wav',
    guitarWavName: 'wav/guitar.wav',
    vocalsWavName: 'wav/vocals.wav',
    keysWavName: 'wav/keys.wav',
    backingWavName: 'wav/backing.wav',
    crowdWavName: 'wav/crowd.wav',
    conFilePackageName: '{{title}} - {{artist}}',
    conFilePackageDesc: 'Created with Magma: C3 Roks Edition. For more great customs authoring tools, visit forums.customscreators.com',
  }

  static readonly defaultMAGMAProjectSongData: Required<MAGMAProjectSongData> = {
    autogen_theme: 'ArenaRock',
    release_ver: 1,
    released_date: new Date().toDateString(),
    update_date: new Date().toDateString(),
    lipsync: null,
    separate_2x_wav: true,
  }

  constructor(song: DTAFile, options?: MAGMAProjectOptionsObject) {
    this.song = song
    this.options = setDefaultOptions<Required<MAGMAProjectOptionsObject>>(MAGMAProject.defaultMAGMAProjectOptions, options)
  }

  checkAndMapOptionsPaths(magmaOpts: Required<MAGMAProjectSongData>) {
    let magmaPath: Path
    if (!process.env.MAGMA_PATH && !this.options.magmaPath) throw new MissingRequiredValueError('Required MAGMA Path not provided. You can either declare it on an .env file (using key value "MAGMA_PATH") or passing as a property on this instantiated class options parameter.')
    if (process.env.MAGMA_PATH) magmaPath = Path.stringToPath(process.env.MAGMA_PATH)
    else magmaPath = Path.stringToPath(this.options.magmaPath)

    let songsProjectRootFolderPath: Path
    if (!process.env.SONGS_PROJECT_ROOT_PATH && !this.options.songsProjectRootFolderPath) throw new MissingRequiredValueError('Required Songs project folder not provided. You can either declare it on an .env file (using key value "SONGS_PROJECT_ROOT_PATH") or passing as a property on this instantiated class options parameter.')
    if (process.env.SONGS_PROJECT_ROOT_PATH) songsProjectRootFolderPath = Path.stringToPath(process.env.SONGS_PROJECT_ROOT_PATH)
    else songsProjectRootFolderPath = Path.stringToPath(this.options.songsProjectRootFolderPath)

    const rbprojFilePath = new Path(new Path(formatStringFromDTA(this.song, this.options.destPath)).changeFileExt('.rbproj'))
    const c3FilePath = new Path(new Path(formatStringFromDTA(this.song, this.options.destPath)).changeFileExt('.c3'))

    const monoBlank = new Path(magmaPath.path, `audio/mono44.wav`)
    const stereoBlank = new Path(magmaPath.path, `audio/stereo44.wav`)
    const dryVoxBlank = new Path(magmaPath.path, `audio/blank_dryvox.wav`)
    const defaultMAGMAArt = new Path(magmaPath.path, `default.bmp`)

    let rbaFilePath = new Path(formatStringFromDTA(this.song, this.options.destPath))
    rbaFilePath = rbaFilePath.ext.endsWith('.rba') ? rbaFilePath : new Path(rbaFilePath.changeFileExt('.rba'))

    const songFolderPath = new Path(songsProjectRootFolderPath.path, formatStringFromDTA(this.song, this.options.songFolderName))

    const albumArtPath: Path | undefined = this.song.album_art ? new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.albumArtName)) : undefined
    const albumArtPathPNG = new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.albumArtNamePNG))

    const midiFilePath = new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.midiFileName))

    const dryVox1Path: Path | undefined = magmaOpts.lipsync !== null && this.song.vocal_parts > 0 ? new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.dryVox1Name)) : this.song.vocal_parts > 0 ? dryVoxBlank : undefined
    const dryVox2Path: Path | undefined = magmaOpts.lipsync === 2 || magmaOpts.lipsync === 3 ? new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.dryVox2Name)) : magmaOpts.lipsync !== null && this.song.vocal_parts > 1 ? new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.dryVox2Name)) : this.song.vocal_parts > 1 ? dryVoxBlank : undefined
    const dryVox3Path: Path | undefined = magmaOpts.lipsync === 3 ? new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.dryVox3Name)) : magmaOpts.lipsync !== null && this.song.vocal_parts > 2 ? new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.dryVox3Name)) : this.song.vocal_parts > 2 ? dryVoxBlank : undefined

    const backingWavPath = new Path(songFolderPath.path, formatStringFromDTA(this.song, this.options.backingWavName))

    return { magmaPath, songsProjectRootFolderPath, songFolderPath, monoBlank, stereoBlank, dryVoxBlank, midiFilePath, albumArtPath, albumArtPathPNG, rbaFilePath, dryVox1Path, dryVox2Path, dryVox3Path, backingWavPath, defaultMAGMAArt, rbprojFilePath, c3FilePath }
  }

  getMAGMAC3FileContents(): [string, string] {
    const songMAGMAOpts = setDefaultOptions(MAGMAProject.defaultMAGMAProjectSongData, this.song.magma)
    const { backing, bass, crowd, drum, guitar, keys, vocals } = genAudioFileStructure(this.song)
    const { albumArtPath, albumArtPathPNG, dryVox1Path, dryVox2Path, dryVox3Path, dryVoxBlank, magmaPath, midiFilePath, monoBlank, rbaFilePath, songFolderPath, songsProjectRootFolderPath, stereoBlank, backingWavPath } = this.checkAndMapOptionsPaths(songMAGMAOpts)

    const hasEnglish = this.song.languages ? (this.song.languages.findIndex((value) => value === 'english') > -1 ? true : false) : true
    const hasFrench = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasItalian = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasSpanish = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasGerman = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true
    const hasJapanese = this.song.languages ? (this.song.languages.findIndex((value) => value === 'french') > -1 ? true : false) : true

    const drumSolo = this.song.solo?.find((flags) => flags === 'drum') ? 'True' : 'False'
    const guitarSolo = this.song.solo?.find((flags) => flags === 'guitar') ? 'True' : 'False'
    const bassSolo = this.song.solo?.find((flags) => flags === 'bass') ? 'True' : 'False'
    const keysSolo = this.song.solo?.find((flags) => flags === 'keys') ? 'True' : 'False'
    const vocalsSolo = this.song.solo?.find((flags) => flags === 'vocal_percussion') ? 'True' : 'False'

    const rbprojFile = new DTAIO(DTAIO.formatOptions.defaultMAGMA)
    const c3File = new BinaryWriter()

    rbprojFile.addValue('project', {
      tool_version: '110411_A',
      project_version: 24,
      metadata: {
        song_name: DTAIO.useString(this.song.name),
        artist_name: this.song.artist,
        genre: this.song.genre,
        sub_genre: this.song.sub_genre ?? 'subgenre_other',
        year_released: this.song.year_released,
        album_name: this.song.album_name ? DTAIO.useString(this.song.album_name) : undefined,
        author: this.song.author ?? '',
        release_label: '',
        country: 'ugc_country_us',
        price: 80,
        track_number: this.song.album_track_number ?? 1,
        has_album: this.song.album_art,
      },
      gamedata: {
        preview_start_ms: this.song.preview[0],
        rank_guitar: this.song.rank_guitar ? rankCalculator('guitar', this.song.rank_guitar) + 1 : 1,
        rank_bass: this.song.rank_bass ? rankCalculator('bass', this.song.rank_bass) + 1 : 1,
        rank_drum: this.song.rank_drum ? rankCalculator('drum', this.song.rank_drum) + 1 : 1,
        rank_vocals: this.song.rank_vocals ? rankCalculator('vocals', this.song.rank_vocals) + 1 : 1,
        rank_keys: this.song.rank_keys ? rankCalculator('keys', this.song.rank_keys) + 1 : 1,
        rank_pro_keys: this.song.rank_real_keys ? rankCalculator('real_keys', this.song.rank_real_keys) + 1 : 1,
        rank_band: rankCalculator('band', this.song.rank_band) + 1,
        vocal_scroll_speed: this.song.song_scroll_speed ?? 2300,
        anim_tempo: this.song.anim_tempo,
        vocal_gender: this.song.vocal_gender,
        vocal_percussion: this.song.bank.slice(4, -10),
        vocal_parts: this.song.vocal_parts,
        guide_pitch_volume: this.song.guide_pitch_volume ? DTAIO.useFloat(this.song.guide_pitch_volume, rbprojFile.options.number) : DTAIO.useFloat(-3, rbprojFile.options.number),
      },
      languages: {
        english: hasEnglish,
        french: hasFrench,
        italian: hasItalian,
        spanish: hasSpanish,
        german: hasGerman,
        japanese: hasJapanese,
      },
      destination_file: rbaFilePath.path,
      midi: {
        file: midiFilePath.path,
        autogen_theme: `${songMAGMAOpts.autogen_theme}.rbtheme`,
      },
      dry_vox: {
        part0: {
          file: dryVox1Path?.path ?? '',
          enabled: this.song.vocal_parts > 0 ? true : false,
        },
        part1: {
          file: dryVox2Path?.path ?? '',
          enabled: songMAGMAOpts.lipsync === 2 || songMAGMAOpts.lipsync === 3 ? true : this.song.vocal_parts > 1 ? true : false,
        },
        part2: {
          file: dryVox3Path?.path ?? '',
          enabled: songMAGMAOpts.lipsync === 3 ? true : this.song.vocal_parts > 2 ? true : false,
        },
        tuning_offset_cents: this.song.tuning_offset_cents ? DTAIO.useFloat(this.song.tuning_offset_cents, rbprojFile.options.number) : DTAIO.useFloat(0, rbprojFile.options.number),
      },
      album_art: {
        file: albumArtPath?.path ?? '',
      },
      tracks: {
        drum_layout: drum.drum_layout,
        drum_kit: {
          enabled: drum.kitEnabled,
          channels: drum.kitChannels,
          pan: DTAIO.useArray(
            drum.kitPan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            drum.kitVol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        drum_kick: {
          enabled: drum.kickEnabled,
          channels: drum.kickChannels,
          pan: DTAIO.useArray(
            drum.kickPan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            drum.kickVol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        drum_snare: {
          enabled: drum.snareEnabled,
          channels: drum.snareChannels,
          pan: DTAIO.useArray(
            drum.snarePan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            drum.snareVol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        bass: {
          enabled: bass.enabled,
          channels: bass.channels,
          pan: DTAIO.useArray(
            bass.pan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            bass.vol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        guitar: {
          enabled: guitar.enabled,
          channels: guitar.channels,
          pan: DTAIO.useArray(
            guitar.pan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            guitar.vol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        vocals: {
          enabled: vocals.enabled,
          channels: vocals.channels,
          pan: DTAIO.useArray(
            vocals.pan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            vocals.vol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        keys: {
          enabled: keys.enabled,
          channels: keys.channels,
          pan: DTAIO.useArray(
            keys.pan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            keys.vol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: 'C:\\Users\\Ruggery\\Desktop\\Rock Band\\Magma\\audio\\stereo44.wav',
        },
        backing: {
          enabled: backing.enabled,
          channels: backing.channels,
          pan: DTAIO.useArray(
            backing.pan.map((pan) => DTAIO.useFloat(pan, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          vol: DTAIO.useArray(
            backing.vol.map((vol) => DTAIO.useFloat(vol, rbprojFile.options.number)),
            { array: { parenthesisForValues: false, keyAndValueInline: true } }
          ),
          file: backingWavPath.path,
        },
      },
    })

    c3File.write(`//Created by Magma: C3 Roks Edition v3.3.5\n//DO NOT EDIT MANUALLY\nSong=${this.song.name}\nArtist=${this.song.artist}\nAlbum=${this.song.album_name ? this.song.album_name : ''}\nCustomID=\nVersion=${songMAGMAOpts.release_ver.toString()}\nIsMaster=${this.song.master ? 'True' : 'False'}\nEncodingQuality=7\n${this.song.tracks_count[6] !== undefined ? `CrowdAudio=${stereoBlank.path}\nCrowdVol=${crowd.vol?.toString() ?? '-5'}\n` : ''}${this.song.year_recorded ? `ReRecordYear=${this.song.year_recorded.toString()}` : ''}2xBass=${this.song.double_kick ? 'True' : 'False'}\nRhythmKeys=${this.song.rhythm_on_keys ? 'True' : 'False'}\nRhythmBass=${this.song.rhythm_on_bass ? 'True' : 'False'}\nKaraoke=${this.song.karaoke ? 'True' : 'False'}\nMultitrack=${this.song.multitrack ? 'True' : 'False'}\nConvert=${this.song.convert ? 'True' : 'False'}\nExpertOnly=${this.song.expert_only ? 'True' : 'False'}\n`)

    if (this.song.rank_real_bass && this.song.real_bass_tuning) {
      c3File.write(`ProBassDiff=${this.song.rank_real_bass.toString()}\nProBassTuning4=(real_bass_tuning (${this.song.real_bass_tuning.join(' ')}))\n`)
    }

    if (this.song.rank_real_guitar && this.song.real_guitar_tuning) {
      c3File.write(`ProGuitarDiff=${this.song.rank_real_guitar.toString()}\nProGuitarTuning=(real_guitar_tuning (${this.song.real_guitar_tuning.join(' ')}))\n`)
    }

    c3File.write(`DisableProKeys=False\nTonicNote=${this.song.vocal_tonic_note?.toString() ?? '0'}\nTuningCents=${this.song.tuning_offset_cents?.toString() ?? '0'}\nSongRating=${this.song.rating.toString()}\nDrumKitSFX=${this.song.drum_bank === 'sfx/kit01_bank.milo' ? '0' : this.song.drum_bank === 'sfx/kit02_bank.milo' ? '1' : this.song.drum_bank === 'sfx/kit03_bank.milo' ? '2' : this.song.drum_bank === 'sfx/kit04_bank.milo' ? '3' : '4'}\nHopoTresholdIndex=${this.song.hopo_threshold === 90 ? '0' : this.song.hopo_threshold === 130 ? '1' : this.song.hopo_threshold === 170 ? '2' : this.song.hopo_threshold === 250 ? '3' : '2'}\n`)
    c3File.write(`MuteVol=${this.song.mute_volume?.toString() ?? '-96'}\nVocalMuteVol=${this.song.mute_volume_vocals?.toString() ?? '-12'}\nSoloDrums=${drumSolo}\nSoloGuitar=${guitarSolo}\nSoloBass=${bassSolo}\nSoloKeys=${keysSolo}\nSoloVocals=${vocalsSolo}\nSongPreview=${this.song.preview[0].toString()}\nCheckTempoMap=True\nWiiMode=False\nDoDrumMixEvents=True\nPackageDisplay=${this.song.artist} - ${this.song.name}\nPackageDescription=Created with Magma: C3 Roks Edition. For more great customs authoring tools, visit forums.customscreators.com\n`)
    c3File.write(`SongAlbumArt=${albumArtPathPNG.path}\nPackageThumb=\n${this.song.encoding === 'utf8' ? 'EncodeANSI=False\nEncodeUTF8=True' : 'EncodeANSI=True\nEncodeUTF8=False'}\nUseNumericID=True\nUniqueNumericID=${this.song.song_id.toString()}\nUniqueNumericID2X=\n\nTO DO List Begin\nToDo1=Verify the accuracy of all metadata,False,False\nToDo2=Grab official *.png_xbox art file if applicable,False,False\nToDo3=Chart reductions in all instruments,False,False\nToDo4=Add drum fills,False,False\nToDo5=Add overdrive for all instruments,False,False\nToDo6=Add overdrive for vocals,False,False\nToDo7=Create practice sessions [EVENTS],False,False\nToDo8=Draw sing-along notes in VENUE,False,False\nToDo9=Record dry vocals for lipsync,False,False\nToDo10=Render audio with RB limiter and count-in,False,False\nToDo12=Click to add new item...,False,False\nToDo13=Click to add new item...,False,False\nToDo14=Click to add new item...,False,False\nToDo15=Click to add new item...,False,False\nTO DO List End\n`)

    return [rbprojFile.toString(), c3File.toBuffer().toString()]
  }

  saveMAGMAC3FileContentsSync(): [Path, Path] {
    const [rbprojFile, c3File] = this.getMAGMAC3FileContents()
    const rbprojFilePath = new Path(new Path(formatStringFromDTA(this.song, this.options.destPath)).changeFileExt('.rbproj'))
    const c3FilePath = new Path(new Path(formatStringFromDTA(this.song, this.options.destPath)).changeFileExt('.c3'))

    rbprojFilePath.writeFileSync(rbprojFile, 'latin1')
    c3FilePath.writeFileSync(c3File)

    return [rbprojFilePath, c3FilePath]
  }
}
