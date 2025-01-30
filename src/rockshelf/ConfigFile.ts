import Path, { type PathLikeTypes } from 'path-js'
import setDefaultOptions from 'set-default-options'

export interface RockshelfConfigFileObject {
  /**
   * The path to the user's `dev_hdd0` folder.
   */
  devhdd0: string
}

/**
 * Class to handle Rockshelf's `config.json` files based on its path.
 * - - - -
 */
export class ConfigFile {
  /**
   * The path to the `config.json` file.
   */
  path: Path

  /**
   * Returns default config values that matches the `RockshelfConfigFileObject` interface structure.
   * - - - -
   * @returns {RockshelfConfigFileObject}
   */
  static getDefaultConfigValues(): RockshelfConfigFileObject {
    return {
      devhdd0: '',
    }
  }

  /**
   * @param {PathLikeTypes} configFilePath The path to the `config.json` file.
   */
  constructor(configFilePath: PathLikeTypes) {
    this.path = Path.stringToPath(configFilePath)
  }

  /**
   * Synchronously loads and parses a `config.json` file.
   * - - - -
   * @returns {RockshelfConfigFileObject} The `config.json` file parsed as an object.
   */
  loadSync(): RockshelfConfigFileObject {
    return this.path.readJSONFileSync<RockshelfConfigFileObject>()
  }

  /**
   * Asynchronously loads and parses a `config.json` file.
   * - - - -
   * @returns {RockshelfConfigFileObject} The `config.json` file parsed as an object.
   */
  async load(): Promise<RockshelfConfigFileObject> {
    return await this.path.readJSONFile<RockshelfConfigFileObject>()
  }

  /**
   * Synchronously overwrites the `config.json` with new config values.
   * - - - -
   * @param {Partial<RockshelfConfigFileObject>} content The new config values to be replaced on the config file.
   */
  saveSync(content: Partial<RockshelfConfigFileObject>): void {
    const old = this.loadSync()
    this.path.writeFileSync(JSON.stringify(setDefaultOptions<RockshelfConfigFileObject>(old, content)))
  }

  /**
   * Asynchronously overwrites the `config.json` with new config values.
   * - - - -
   * @param {Partial<RockshelfConfigFileObject>} content The new config values to be replaced on the config file.
   */
  async save(content: Partial<RockshelfConfigFileObject>): Promise<void> {
    const old = await this.load()
    await this.path.writeFile(JSON.stringify(setDefaultOptions<RockshelfConfigFileObject>(old, content)))
  }
}
