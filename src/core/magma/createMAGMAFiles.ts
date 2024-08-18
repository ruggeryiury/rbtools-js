import { createDTA, type DTAFileExpanded, type DTAFileRecipe, extendDTAFile, type ExtendNewValuesOnlyObject, type UpdateDataOptions } from 'dta-parser/core'
import { useDefaultOptions, genAudioFileStructure, genTabs as t, rankCalculator as r } from 'dta-parser/utils'
import Path from 'path-js'

/**
 * Creates a `MAGMAProject` object, extending a parsed song object (`DTAFile`).
 * - - - -
 * @param {DTAFileRecipe} songValues The parsed song you want to inserts specific MAGMA information.
 * @param {ExtendNewValuesOnlyObject<MAGMAProject>} magmaValues The new MAGMA information.
 * @param {UpdateDataOptions | undefined} update An object with values to update any default `DTAFile` value.
 * @returns {MAGMAProject}
 */
export const createMAGMAProjectObject = (songValues: DTAFileRecipe, magmaValues: ExtendNewValuesOnlyObject<MAGMAProject>, update?: UpdateDataOptions): MAGMAProject => extendDTAFile<MAGMAProject>(createDTA(songValues, true), magmaValues, update)

export type AutogenValues = 'Default' | 'AggressiveMetal' | 'ArenaRock' | 'DarkHeavyRock' | 'DustyVintage' | 'EdgyProgRock' | 'FeelGoodPopRock' | 'GaragePunkRock' | 'PsychJamRock' | 'SlowJam' | 'SynthPop'

export interface MAGMAFileValues {
  /**
   * Sets the autogen option when generating the song's MAGMA file. Default is `ArenaRock` (Arena Rock template).
   */
  autogenTheme: AutogenValues
  /**
   * The date when the custom was originally released.
   */
  releasedAt: string
  /**
   * The date when the custom was updated.
   */
  updatedAt: string
  /**
   * Default is `1`.
   */
  releaseVer: number
  /**
   * Tells if the custom has vocals lipsync files. Default is `false`.
   */
  hasLipSyncFiles: boolean
  /**
   * Tells if the custom has authored venues. Default is `false`.
   */
  hasAuthoredVenues: boolean
  /**
   * If `true`, the kick drum stems path on MAGMA will use `kick2x.wav` rather than `kick.wav`,
   * and customs with a single stereo stem for drums will use `drums2x.wav` rather than `drums.wav`.
   *
   * This is useful if you managed to have a mix excluding the double kicks.
   */
  doubleKickWav: boolean
  /**
   * This can be used on solo vocals or 2-part harmonies songs to force MAGMA
   * to compile lipsync for unused harmonies fields.
   *
   * You must compile the song with fake HARM2/HARM3 tracks on the MIDI, and
   * replacing the MIDI file of the generated CON file.
   */
  fakeHarm: 2 | 3
}

/**
 * An extension of the basic `DTAFile` type.
 */
export type MAGMAProject = DTAFileExpanded<Partial<MAGMAFileValues>>

export interface CreateMAGMAFilesOptions {
  /**
   * Changes the version on the generated `.c3` file to use the
   * `releaseVer` value from a `MAGMAProject` object. Default is `true`.
   */
  useLatestVersion?: boolean
}

export interface CreateMAGMAFilesPaths {
  /**
   * The path of the generated `.rbproj` file.
   */
  rbproj: string
  /**
   * The path of the generated `.c3` file.
   */
  c3: string
  /**
   * The path of the generated `.rba`/CON file that will be compiled on MAGMA
   * if successfully compiled.
   */
  rba: string
}

/**
 * Creates MAGMA files from a `MAGMAProject` object.
 * - - - -
 * @param {MAGMAProject} song An object that extends a `DTAFile` object with specific MAGMA values.
 * @param {string} songsFolderPath d
 * @param {string} MAGMAC3Path d
 * @param {string} destPath f
 * @param {CreateMAGMAFilesOptions | undefined} options `OPTIONAL` An object that changes the behavior of the MAGMA files creation process.
 *
 * All paths needed to create MAGMA files are placed on this object.
 * @returns {Promise<CreateMAGMAFilesPaths>} An object with the paths of all generated files.
 */
export const createMAGMAFiles = async (song: MAGMAProject, songsFolderPath: string, MAGMAC3Path: string, destPath: string, options?: CreateMAGMAFilesOptions): Promise<CreateMAGMAFilesPaths> => {
  const opts = useDefaultOptions<CreateMAGMAFilesOptions, true>(
    {
      useLatestVersion: true,
    },
    options
  )

  const { useLatestVersion } = opts

  const songsPath = new Path(Path.resolve(songsFolderPath))
  const magmaC3Path = new Path(Path.resolve(MAGMAC3Path))
  const dest = new Path(Path.resolve(destPath))

  const songnameFolder = Path.resolve(songsPath.path, song.doubleKick ? song.songname.slice(0, -2) : song.songname)
  const { songname } = song

  const RBPROJFilePath = new Path(Path.resolve(dest.path, `${songname}.rbproj`))
  const C3FilePath = new Path(Path.resolve(dest.path, `${songname}.c3`))

  let output = ''
  const MonoBlank = new Path(Path.resolve(magmaC3Path.path, `audio/mono44.wav`))
  const StereoBlank = new Path(Path.resolve(magmaC3Path.path, `audio/stereo44.wav`))
  const DryVox = new Path(Path.resolve(magmaC3Path.path, `audio/blank_dryvox.wav`))

  const RBAPath = new Path(Path.resolve(dest.path, `${song.songname}.rba`))
  const MIDIFilePath = new Path(Path.resolve(songnameFolder, `${songname}.mid`))

  const DV0Path = song.hasLipSyncFiles ? (song.vocal_parts > 0 ? Path.resolve(songnameFolder, 'magma/HARM1.wav') : '') : song.vocal_parts > 0 ? DryVox.path : ''

  const DV1Path = song.hasLipSyncFiles ? (song.fakeHarm === 2 || song.fakeHarm === 3 ? Path.resolve(songnameFolder, 'magma/HARM2.wav') : song.vocal_parts > 1 ? Path.resolve(songnameFolder, 'magma/HARM2.wav') : '') : song.vocal_parts > 1 ? DryVox.path : ''

  const DV2Path = song.hasLipSyncFiles ? (song.fakeHarm === 3 ? Path.resolve(songnameFolder, 'magma/HARM3.wav') : song.vocal_parts > 2 ? Path.resolve(songnameFolder, 'magma/HARM3.wav') : '') : song.vocal_parts > 2 ? DryVox.path : ''

  const AlbumArtPath = song.album_art ? Path.resolve(songnameFolder, `magma/${songname}_keep_x256.bmp`) : ''

  const KickWavPath = song.multitrack ? (song.tracks_count[0] > 2 ? Path.resolve(songnameFolder, `wav/${song.doubleKick && song.doubleKickWav ? 'kick2x' : 'kick'}.wav`) : '') : song.tracks_count[0] > 2 ? MonoBlank.path : song.tracks_count[0] > 5 ? StereoBlank.path : ''

  const SnareWavPath = song.multitrack ? (song.tracks_count[0] > 3 ? Path.resolve(songnameFolder, `wav/snare.wav`) : '') : song.tracks_count[0] > 3 ? MonoBlank.path : song.tracks_count[0] > 4 ? StereoBlank.path : ''

  const DrumKitWavPath = song.multitrack ? (song.tracks_count[0] === 2 ? Path.resolve(songnameFolder, `wav/${song.doubleKick && song.doubleKickWav ? 'drums2x' : 'drums'}.wav`) : song.tracks_count[0] > 2 ? Path.resolve(songnameFolder, 'wav/kit.wav') : '') : song.tracks_count[0] > 0 ? StereoBlank.path : ''

  const BassWavPath = song.multitrack ? (song.tracks_count[1] !== 0 ? Path.resolve(songnameFolder, 'wav/bass.wav') : '') : song.tracks_count[1] === 1 ? MonoBlank.path : song.tracks_count[1] === 2 ? StereoBlank.path : ''

  const GuitarWavPath = song.multitrack ? (song.tracks_count[2] !== 0 ? Path.resolve(songnameFolder, 'wav/guitar.wav') : '') : song.tracks_count[2] === 1 ? MonoBlank.path : song.tracks_count[2] === 2 ? StereoBlank.path : ''

  const VocalsWavPath = song.multitrack ? (song.tracks_count[3] !== 0 ? Path.resolve(songnameFolder, 'wav/vocals.wav') : '') : song.tracks_count[3] === 1 ? MonoBlank.path : song.tracks_count[3] === 2 ? StereoBlank.path : ''

  const KeysWavPath = song.multitrack ? (song.tracks_count[4] !== 0 ? Path.resolve(songnameFolder, 'wav/keys.wav') : '') : song.tracks_count[4] === 1 ? MonoBlank.path : song.tracks_count[4] === 2 ? StereoBlank.path : ''

  const BackingWavPath = Path.resolve(songnameFolder, 'wav/backing.wav')

  output += `(`
  output += `${t(1, 'start')}'project'`
  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'tool_version'`
  output += `${t(2, 'start')}"110411_A"`
  output += `${t(1, 'start')})`
  output += `${t(1, 'start')}('project_version' 24)`

  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'metadata'`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'song_name'`
  output += `${t(3, 'start')}"${song.name.replace(/"/g, ' ')}"`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'artist_name'`
  output += `${t(3, 'start')}"${song.artist.replace(/"/g, ' ')}"`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}('genre' '${song.genre}')`
  output += `${t(2, 'start')}('sub_genre' '${song.sub_genre ?? 'subgenre_other'}')`
  output += `${t(2, 'start')}('year_released' ${song.year_released.toString()})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'album_name'`
  output += `${t(3, 'start')}"${song.album_name ? song.album_name.replace(/"/g, ' ') : ''}"`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'author'`
  output += `${t(3, 'start')}"${song.author ? song.author.replace(/"/g, ' ') : ''}"`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'release_label'`
  output += `${t(3, 'start')}""`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}('country' 'ugc_country_us')`
  output += `${t(2, 'start')}('price' 80)`
  output += `${t(2, 'start')}('track_number' ${song.album_track_number?.toString() ?? '1'})`
  output += `${t(2, 'start')}('has_album' ${song.album_name ? '1' : '0'})`

  const rank_guitar = r('guitar', song.rank_guitar) + 1 === 0 ? 1 : r('guitar', song.rank_guitar) + 1
  const rank_bass = r('bass', song.rank_bass) + 1 === 0 ? 1 : r('bass', song.rank_bass) + 1
  const rank_drum = r('drum', song.rank_drum) + 1 === 0 ? 1 : r('drum', song.rank_drum) + 1
  const rank_vocals = r('vocals', song.rank_vocals) + 1 === 0 ? 1 : r('vocals', song.rank_vocals) + 1
  const rank_keys = r('keys', song.rank_keys) + 1 === 0 ? 1 : r('keys', song.rank_keys) + 1
  const rank_real_keys = r('real_keys', song.rank_real_keys) + 1 === 0 ? 1 : r('real_keys', song.rank_real_keys) + 1
  const rank_band = r('band', song.rank_band) + 1 === 0 ? 1 : r('band', song.rank_band) + 1

  output += `${t(1, 'start')})`
  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'gamedata'`
  output += `${t(2, 'start')}('preview_start_ms' ${song.preview[0].toString()})`
  output += `${t(2, 'start')}('rank_guitar' ${rank_guitar.toString()})`
  output += `${t(2, 'start')}('rank_bass' ${rank_bass.toString()})`
  output += `${t(2, 'start')}('rank_drum' ${rank_drum.toString()})`
  output += `${t(2, 'start')}('rank_vocals' ${rank_vocals.toString()})`
  output += `${t(2, 'start')}('rank_keys' ${rank_keys.toString()})`
  output += `${t(2, 'start')}('rank_pro_keys' ${rank_real_keys.toString()})`
  output += `${t(2, 'start')}('rank_band' ${rank_band.toString()})`
  output += `${t(2, 'start')}('vocal_scroll_speed' ${song.song_scroll_speed?.toString() ?? '2300'})`
  output += `${t(2, 'start')}('anim_tempo' ${song.anim_tempo.toString()})`
  output += `${t(2, 'start')}('vocal_gender' ${song.vocal_gender})`
  output += `${t(2, 'start')}('vocal_percussion' '${song.bank.slice(4, -10)}')`
  output += `${t(2, 'start')}('vocal_parts' ${song.fakeHarm?.toString() ?? song.vocal_parts.toString()})`
  output += `${t(2, 'start')}('guide_pitch_volume' ${song.guide_pitch_volume ? song.guide_pitch_volume.toFixed(2) : '-3.00'})`

  output += `${t(1, 'start')})`
  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'languages'`
  output += `${t(2, 'start')}('english' 1)`
  output += `${t(2, 'start')}('french' 0)`
  output += `${t(2, 'start')}('italian' 0)`
  output += `${t(2, 'start')}('spanish' 0)`
  output += `${t(2, 'start')}('german' 0)`
  output += `${t(2, 'start')}('japanese' 0)`

  output += `${t(1, 'start')})`
  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'destination_file'`
  output += `${t(2, 'start')}"${RBAPath.path}"`
  output += `${t(1, 'start')})`

  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'midi'`
  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'file'`
  output += `${t(3, 'start')}"${MIDIFilePath.path}"`
  output += `${t(2, 'start')})`
  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'autogen_theme'`
  output += `${t(3, 'start')}"${song.autogenTheme ? `${song.autogenTheme}.rbtheme` : 'ArenaRock.rbtheme'}"`
  output += `${t(2, 'start')})`
  output += `${t(1, 'start')})`

  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'dry_vox'`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'part0'`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${DV0Path}"`
  output += `${t(3, 'start')})`
  output += `${t(3, 'start')}('enabled' ${song.vocal_parts > 0 ? '1' : '0'})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'part1'`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${DV1Path}"`
  output += `${t(3, 'start')})`
  output += `${t(3, 'start')}('enabled' ${song.fakeHarm === 2 || song.fakeHarm === 3 ? '1' : song.vocal_parts > 1 ? '1' : '0'})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'part2'`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${DV2Path}"`
  output += `${t(3, 'start')})`
  output += `${t(3, 'start')}('enabled' ${song.fakeHarm === 3 ? '1' : song.vocal_parts > 2 ? '1' : '0'})`
  output += `${t(2, 'start')})`
  output += `${t(2, 'start')}('tuning_offset_cents' ${song.tuning_offset_cents ? song.tuning_offset_cents.toFixed(2) : '0.00'})`
  output += `${t(1, 'start')})`

  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'album_art'`
  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'file'`
  output += `${t(3, 'start')}"${AlbumArtPath}"`
  output += `${t(2, 'start')})`
  output += `${t(1, 'start')})`

  const panvol = genAudioFileStructure(song)

  output += `${t(1, 'start')}(`
  output += `${t(2, 'start')}'tracks'`
  output += `${t(2, 'start')}('drum_layout' '${panvol.drum.channels === 0 || panvol.drum.channels === 2 ? 'drum_layout_kit' : panvol.drum.channels === 3 ? 'drum_layout_kit_kick' : 'drum_layout_kit_kick_snare'}')`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'drum_kit'`
  output += `${t(3, 'start')}('enabled' ${panvol.drum.kitEnabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.drum.kitChannels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.drum.kitPan.map((pan) => pan.toFixed(2)).join(' ')})`
  output += `${t(3, 'start')}('vol' ${panvol.drum.kitVol.map((vol) => vol.toFixed(2)).join(' ')})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${DrumKitWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'drum_kick'`
  output += `${t(3, 'start')}('enabled' ${panvol.drum.kickEnabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.drum.kickChannels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.drum.kickEnabled ? panvol.drum.kickPan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.drum.kickEnabled ? panvol.drum.kickVol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${KickWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'drum_snare'`
  output += `${t(3, 'start')}('enabled' ${panvol.drum.snareEnabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.drum.snareChannels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.drum.snareEnabled ? panvol.drum.snarePan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.drum.snareEnabled ? panvol.drum.snareVol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${SnareWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'bass'`
  output += `${t(3, 'start')}('enabled' ${panvol.bass.enabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.bass.channels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.bass.enabled ? panvol.bass.pan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.bass.enabled ? panvol.bass.vol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${BassWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'guitar'`
  output += `${t(3, 'start')}('enabled' ${panvol.guitar.enabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.guitar.channels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.guitar.enabled ? panvol.guitar.pan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.guitar.enabled ? panvol.guitar.vol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${GuitarWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'vocals'`
  output += `${t(3, 'start')}('enabled' ${panvol.vocals.enabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.vocals.channels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.vocals.enabled ? panvol.vocals.pan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.vocals.enabled ? panvol.vocals.vol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${VocalsWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'keys'`
  output += `${t(3, 'start')}('enabled' ${panvol.keys.enabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.keys.channels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.keys.enabled ? panvol.keys.pan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.keys.enabled ? panvol.keys.vol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${KeysWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`

  output += `${t(2, 'start')}(`
  output += `${t(3, 'start')}'backing'`
  output += `${t(3, 'start')}('enabled' ${panvol.backing.enabled ? '1' : '0'})`
  output += `${t(3, 'start')}('channels' ${panvol.backing.channels.toString()})`
  output += `${t(3, 'start')}('pan' ${panvol.backing.enabled ? panvol.backing.pan.map((pan) => pan.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}('vol' ${panvol.backing.enabled ? panvol.backing.vol.map((vol) => vol.toFixed(2)).join(' ') : '0.00'})`
  output += `${t(3, 'start')}(`
  output += `${t(4, 'start')}'file'`
  output += `${t(4, 'start')}"${BackingWavPath}"`
  output += `${t(3, 'start')})`
  output += `${t(2, 'start')})`
  output += `${t(1, 'start')})`
  output += `${t(0, 'start')})`

  let c3out = `\\\\Created by Magma: C3 Roks Edition v3.3.5\n\\\\DO NOT EDIT MANUALLY\nSong=${song.name}\nArtist=${song.artist}\nAlbum=${song.album_name ? song.album_name : ''}\nCustomID=\nVersion=${!useLatestVersion ? '1' : song.releaseVer ? song.releaseVer.toString() : '1'}\nIsMaster=${song.master ? 'True' : 'False'}\nEncodingQuality=7\n${song.tracks_count[6] !== undefined ? `CrowdAudio=${StereoBlank.path}\nCrowdVol=${panvol.crowd.vol?.toString() ?? '-5'}\n` : ''}${song.year_recorded ? `ReRecordYear=${song.year_recorded.toString()}` : ''}2xBass=${song.doubleKick ? 'True' : 'False'}\nRhythmKeys=${song.rhythmOnKeys ? 'True' : 'False'}\nRhythmBass=${song.rhythmOnBass ? 'True' : 'False'}\nKaraoke=${song.karaoke ? 'True' : 'False'}\nMultitrack=${song.multitrack ? 'True' : 'False'}\nConvert=${song.convert ? 'True' : 'False'}\nExpertOnly=${song.expertOnly ? 'True' : 'False'}\n`

  if (song.rank_real_bass && song.real_bass_tuning) {
    c3out += `ProBassDiff=${song.rank_real_bass.toString()}\nProBassTuning4=(real_bass_tuning (${song.real_bass_tuning.join(' ')}))\n`
  }

  if (song.rank_real_guitar && song.real_guitar_tuning) {
    c3out += `ProGuitarDiff=${song.rank_real_guitar.toString()}\nProGuitarTuning=(real_guitar_tuning (${song.real_guitar_tuning.join(' ')}))\n`
  }

  c3out += `DisableProKeys=False\nTonicNote=${song.vocal_tonic_note?.toString() ?? '0'}\nTuningCents=${song.tuning_offset_cents?.toString() ?? '0'}\nSongRating=${song.rating.toString()}\nDrumKitSFX=${song.drum_bank === 'sfx/kit01_bank.milo' ? '0' : song.drum_bank === 'sfx/kit02_bank.milo' ? '1' : song.drum_bank === 'sfx/kit03_bank.milo' ? '2' : song.drum_bank === 'sfx/kit04_bank.milo' ? '3' : '4'}\nHopoTresholdIndex=${song.hopo_threshold === 90 ? '0' : song.hopo_threshold === 130 ? '1' : song.hopo_threshold === 170 ? '2' : song.hopo_threshold === 250 ? '3' : '2'}\n`

  const drumSolo = song.solo?.find((flags) => flags === 'drum') ? 'True' : 'False'
  const guitarSolo = song.solo?.find((flags) => flags === 'guitar') ? 'True' : 'False'
  const bassSolo = song.solo?.find((flags) => flags === 'bass') ? 'True' : 'False'
  const keysSolo = song.solo?.find((flags) => flags === 'keys') ? 'True' : 'False'
  const vocalsSolo = song.solo?.find((flags) => flags === 'vocal_percussion') ? 'True' : 'False'

  c3out += `MuteVol=${song.mute_volume?.toString() ?? '-96'}\nVocalMuteVol=${song.mute_volume_vocals?.toString() ?? '-12'}\nSoloDrums=${drumSolo}\nSoloGuitar=${guitarSolo}\nSoloBass=${bassSolo}\nSoloKeys=${keysSolo}\nSoloVocals=${vocalsSolo}\nSongPreview=${song.preview[0].toString()}\nCheckTempoMap=True\nWiiMode=False\nDoDrumMixEvents=True\nPackageDisplay=${song.artist} - ${song.name}\nPackageDescription=Created with Magma: C3 Roks Edition. For more great customs authoring tools, visit forums.customscreators.com\nSongAlbumArt=${Path.resolve(songnameFolder, `magma/${songname}_keep.png`)}\nPackageThumb=\n${song.encoding === 'utf8' ? 'EncodeANSI=False\nEncodeUTF8=True' : 'EncodeANSI=True\nEncodeUTF8=False'}\nUseNumericID=True\nUniqueNumericID=${song.song_id.toString()}\nUniqueNumericID2X=\n\nTO DO List Begin\nToDo1=Verify the accuracy of all metadata,False,False\nToDo2=Grab official *.png_xbox art file if applicable,False,False\nToDo3=Chart reductions in all instruments,False,False\nToDo4=Add drum fills,False,False\nToDo5=Add overdrive for all instruments,False,False\nToDo6=Add overdrive for vocals,False,False\nToDo7=Create practice sessions [EVENTS],False,False\nToDo8=Draw sing-along notes in VENUE,False,False\nToDo9=Record dry vocals for lipsync,False,False\nToDo10=Render audio with RB limiter and count-in,False,False\nToDo12=Click to add new item...,False,False\nToDo13=Click to add new item...,False,False\nToDo14=Click to add new item...,False,False\nToDo15=Click to add new item...,False,False\nTO DO List End\n`

  await RBPROJFilePath.writeFile(output, 'ascii')
  await C3FilePath.writeFile(c3out, 'ascii')

  return {
    rbproj: RBPROJFilePath.path,
    c3: C3FilePath.path,
    rba: RBAPath.path,
  }
}
