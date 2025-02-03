import type { RockshelfConfigFileObject } from './RockshelfConfigFile.js'

export interface AppInitObject extends RockshelfConfigFileObject {
  profileName: string
}