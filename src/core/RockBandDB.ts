import { FilePath, type FilePathLikeTypes } from 'node-lib'
import { pathLikeToString, resolve } from 'node-lib'
import { DTAParser, RBTools } from '../index'
import type { PartialDTAFile } from '../lib.exports'

/**
 * A class with static methods that fetches information about official and unofficial Rock Band songs.
 */
export class RockBandDB {
  /**
   * Asynchronously creates a minified `dx_updates.json` file inside `src/bin/dta` folder. This JSON file
   * holds the data about the Rock Band 3 Deluxe official songs updates for quick data
   * fetching without having to parse all the updates DTA files all over again.
   * - - - -
   * @param {FilePathLikeTypes} dxSongUpdatesFolder `OPTIONAL` The folder of the Rock Band 3 Deluxe
   * patch that has all the updates DTA to be read. If not provided, the function will try
   * to find these files on `src/bin/dta` folder.
   * @returns {PartialDTAFile[]}
   */
  static async createUpdatesJSONFile(dxSongUpdatesFolder?: FilePathLikeTypes): Promise<PartialDTAFile[]> {
    const dtaPath = dxSongUpdatesFolder ? FilePath.of(pathLikeToString(dxSongUpdatesFolder)) : RBTools.getDTAPath()
    const updates = FilePath.of(dtaPath.path, 'dx_updates.json')

    const vanillaStrings = await DTAParser.fromFile(resolve(dtaPath.path, 'vanilla_strings.dta'), 'partial')
    const officialAdditionalMetadata = await DTAParser.fromFile(resolve(dtaPath.path, 'official_additional_metadata.dta'), 'partial')
    const unofficialAdditionalMetadata = await DTAParser.fromFile(resolve(dtaPath.path, 'unofficial_additional_metadata.dta'), 'partial')
    const metadataUpdates = await DTAParser.fromFile(resolve(dtaPath.path, 'metadata_updates.dta'), 'partial')
    const harmsAndUpdates = await DTAParser.fromFile(resolve(dtaPath.path, 'harms_and_updates.dta'), 'partial')
    const rbhpKeys = await DTAParser.fromFile(resolve(dtaPath.path, 'rbhp_keys.dta'), 'partial')
    const rbhpStrings = await DTAParser.fromFile(resolve(dtaPath.path, 'rbhp_strings.dta'), 'partial')
    const rb3PlusStrings = await DTAParser.fromFile(resolve(dtaPath.path, 'rb3_plus_strings.dta'), 'partial')
    const combinedStringsAndKeys = await DTAParser.fromFile(resolve(dtaPath.path, 'combined_strings_and_keys.dta'), 'partial')
    const rb3PlusKeys = await DTAParser.fromFile(resolve(dtaPath.path, 'rb3_plus_keys.dta'), 'partial')
    const vanilla = await DTAParser.fromFile(resolve(dtaPath.path, 'vanilla.dta'), 'partial')
    const otherUpgrades = await DTAParser.fromFile(resolve(dtaPath.path, 'other_upgrades.dta'), 'partial')
    const loadingPhrases = await DTAParser.fromFile(resolve(dtaPath.path, 'loading_phrases.dta'), 'partial')

    vanillaStrings.applyUpdates(officialAdditionalMetadata.songs)
    vanillaStrings.applyUpdates(unofficialAdditionalMetadata.songs)
    vanillaStrings.applyUpdates(metadataUpdates.songs)
    vanillaStrings.applyUpdates(harmsAndUpdates.songs)
    vanillaStrings.applyUpdates(rbhpKeys.songs)
    vanillaStrings.applyUpdates(rbhpStrings.songs)
    vanillaStrings.applyUpdates(rb3PlusStrings.songs)
    vanillaStrings.applyUpdates(combinedStringsAndKeys.songs)
    vanillaStrings.applyUpdates(rb3PlusKeys.songs)
    vanillaStrings.applyUpdates(vanilla.songs)
    vanillaStrings.applyUpdates(otherUpgrades.songs)
    vanillaStrings.applyUpdates(loadingPhrases.songs)

    await updates.write(JSON.stringify(vanillaStrings.songs))
    return vanillaStrings.songs
  }

  /**
   * Asynchronously loads all Rock Band 3 Deluxe updates data from the database.
   * - - - -
   * @returns {Promise<PartialDTAFile[]>}
   */
  static async loadDXUpdates(): Promise<PartialDTAFile[]> {
    const dtaPath = RBTools.getDTAPath()
    const updates = FilePath.of(dtaPath.path, 'dx_updates.json')
    return (await updates.readJSON()) as PartialDTAFile[]
  }
}
