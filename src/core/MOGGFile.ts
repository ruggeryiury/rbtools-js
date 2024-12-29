import Path, { type StringOrPath } from 'path-js'

export class MOGGFile {
  path: Path

  constructor(moggFilePath: StringOrPath) {
    this.path = Path.stringToPath(moggFilePath)
  }

  async isEncrypted(): Promise<boolean> {
    const version = await this.path.readFileOffset(0, 1)
    return parseInt(version.toString('hex'), 16) !== 10
  }
}
