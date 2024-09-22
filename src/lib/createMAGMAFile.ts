import { createDTAFileFromRecipe, extendDTAFile, type DTAFileExpanded, type DTAFileRecipe, type DTAUpdateOptions, type ExtendNewValuesOnlyObject } from 'dta-parser/core'

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
  double_kickWav: boolean
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

export const createMAGMAProjectObject = (songValues: DTAFileRecipe, magmaValues: ExtendNewValuesOnlyObject<MAGMAProject>, update?: DTAUpdateOptions): MAGMAProject => {
  return extendDTAFile<MAGMAProject>(createDTAFileFromRecipe('complete', songValues), magmaValues, update)
}

// export const createMAGMAFile = () => {}
