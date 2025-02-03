import type { RockshelfConfigFileObject } from './RockshelfConfigFile.js'

export interface AppInitObject extends RockshelfConfigFileObject {
  /**
   * The profile name of the RB3 save data.
   */
  profileName: string
}
