import Path, { type PathLikeTypes } from 'path-js'
import setDefaultOptions from 'set-default-options'

export type RockshelfMainInstrumentsType = 'guitar' | 'bass' | 'drums' | 'vocals' | 'keys' | 'real_drums' | 'real_guitar' | 'real_bass' | 'real_keys' | 'harmonies'

export interface RockshelfConfigFileObject {
  /**
   * The path to the user's `dev_hdd0` folder.
   */
  devhdd0: string
  /**
   * The main instrument used by the player.
   */
  mainInstrument: RockshelfMainInstrumentsType
}

/**
 * Class to handle Rockshelf's `config.json` files based on its path.
 * - - - -
 */
export class RockshelfConfigFile {
  /**
   * The path to the `config.json` file.
   */
  path: Path
  /**
   * The actual configuration fiile stored into memory.
   */
  content: RockshelfConfigFileObject

  /**
   * Returns default config values that matches the `RockshelfConfigFileObject` interface structure.
   * - - - -
   * @returns {RockshelfConfigFileObject}
   */
  static getDefaultConfigValues(): RockshelfConfigFileObject {
    return {
      devhdd0: '',
      mainInstrument: 'guitar',
    }
  }

  /**
   * @param {PathLikeTypes} configFilePath The path to the `config.json` file.
   */
  constructor(configFilePath: PathLikeTypes) {
    this.path = Path.stringToPath(configFilePath)
    if (this.path.exists()) this.content = this.path.readJSONFileSync<RockshelfConfigFileObject>()
    else this.content = RockshelfConfigFile.getDefaultConfigValues()
  }

  /**
   * Synchronously reloads `this.content` with the actual `config.json` file contents.
   * - - - -
   * @returns {RockshelfConfigFileObject} The `config.json` file parsed as an object.
   */
  reloadFileSync(): RockshelfConfigFileObject {
    if (this.path.exists()) {
      const content = this.path.readJSONFileSync<RockshelfConfigFileObject>()
      this.content = content
      return content
    }
    this.content = RockshelfConfigFile.getDefaultConfigValues()
    return this.content
  }

  /**
   * Asynchronously reloads `this.content` with the actual `config.json` file contents.
   * - - - -
   * @returns {RockshelfConfigFileObject} The `config.json` file parsed as an object.
   */
  async reloadFile(): Promise<RockshelfConfigFileObject> {
    if (this.path.exists()) {
      const content = await this.path.readJSONFile<RockshelfConfigFileObject>()
      this.content = content
      return content
    }
    this.content = RockshelfConfigFile.getDefaultConfigValues()
    return this.content
  }

  /**
   * Synchronously overwrites `this.content`, saving the new config values into `config.json` file.
   * - - - -
   * @param {Partial<RockshelfConfigFileObject>} content The new config values to be replaced on the config file.
   */
  saveSync(content: Partial<RockshelfConfigFileObject>): void {
    const old = this.reloadFileSync()
    const newContent = setDefaultOptions<RockshelfConfigFileObject>(old, content)
    this.content = newContent
    this.path.writeFileSync(JSON.stringify(newContent))
  }

  /**
   * Asynchronously overwrites the `config.json` with new config values.
   * - - - -
   * @param {Partial<RockshelfConfigFileObject>} content The new config values to be replaced on the config file.
   */
  async save(content: Partial<RockshelfConfigFileObject>): Promise<void> {
    const old = await this.reloadFile()
    const newContent = setDefaultOptions<RockshelfConfigFileObject>(old, content)
    this.content = newContent
    await this.path.writeFile(JSON.stringify(newContent))
  }
}
