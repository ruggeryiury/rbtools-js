import Path, { type PathLikeTypes } from 'path-js'
import { DTAParser, RBTools } from '../index.js'
import type { PartialDTAFile } from '../lib.js'

export class RockBandDB {
  static async createUpdatesJSONFile(): Promise<void> {
    const dtaPath = RBTools.getDTAPath()
    const updates = new Path(Path.resolve(dtaPath.path, 'updates.json'))

    const vanilla_strings = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'vanilla_strings.dta'), 'partial')
    const official_additional_metadata = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'official_additional_metadata.dta'), 'partial')
    const unofficial_additional_metadata = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'unofficial_additional_metadata.dta'), 'partial')
    const metadata_updates = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'metadata_updates.dta'), 'partial')
    const harms_and_updates = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'harms_and_updates.dta'), 'partial')
    const rbhp_keys = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'rbhp_keys.dta'), 'partial')
    const rbhp_strings = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'rbhp_strings.dta'), 'partial')
    const rb3_plus_strings = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'rb3_plus_strings.dta'), 'partial')
    const combined_strings_and_keys = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'combined_strings_and_keys.dta'), 'partial')
    const rb3_plus_keys = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'rb3_plus_keys.dta'), 'partial')
    const vanilla = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'vanilla.dta'), 'partial')
    const other_upgrades = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'other_upgrades.dta'), 'partial')
    const loading_phrases = await DTAParser.fromFile(Path.resolve(dtaPath.path, 'loading_phrases.dta'), 'partial')

    vanilla_strings.applyUpdates(official_additional_metadata.songs)
    vanilla_strings.applyUpdates(unofficial_additional_metadata.songs)
    vanilla_strings.applyUpdates(metadata_updates.songs)
    vanilla_strings.applyUpdates(harms_and_updates.songs)
    vanilla_strings.applyUpdates(rbhp_keys.songs)
    vanilla_strings.applyUpdates(rbhp_strings.songs)
    vanilla_strings.applyUpdates(rb3_plus_strings.songs)
    vanilla_strings.applyUpdates(combined_strings_and_keys.songs)
    vanilla_strings.applyUpdates(rb3_plus_keys.songs)
    vanilla_strings.applyUpdates(vanilla.songs)
    vanilla_strings.applyUpdates(other_upgrades.songs)
    vanilla_strings.applyUpdates(loading_phrases.songs)

    await updates.writeFile(JSON.stringify(vanilla_strings.songs))
  }
  static async loadInternalDB() {
    const dtaPath = RBTools.getDTAPath()
    const rb3 = new DTAParser(await new Path(Path.resolve(dtaPath.path, 'rb3.json')).readJSONFile<PartialDTAFile[]>())
    const updates = await new Path(Path.resolve(dtaPath.path, 'updates.json')).readJSONFile<PartialDTAFile[]>()

    const songs: DTAParser[] = []
    songs.push(rb3)

    const parsedSongs: PartialDTAFile[] = []
    for (const song of songs) {
      song.applyUpdates(updates)
      parsedSongs.push(...song.songs)
    }

    return parsedSongs
  }

  static async loadExternalDB(devhdd0Path: PathLikeTypes) {}
}
