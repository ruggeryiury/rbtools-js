import { createHash } from 'node:crypto'

/**
 * Class with static methods to deal with PS3 EDAT files.
 */
export class EDAT {
  /**
   * Generates a MD5 hash that decrypts `.mid.edat` files based on the installed DLC folder name.
   * - - - -
   * @param {string} folderName The installed DLC folder name.
   * @returns {string}
   */
  static DEVKLICFromFolderName(folderName: string): string {
    const key = `Ih38rtW1ng3r${folderName}10025250`
    return createHash('md5').update(key).digest('hex')
  }
}
