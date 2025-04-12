/**
 * Initializes a CRC32 table for the class instance.
 */
export class RB3ESongID {
  /**
   * The CRC32 table initialized for this class.
   */
  private crc32Table: Uint32Array

  constructor() {
    this.crc32Table = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      this.crc32Table[i] = this.crc32ForByte(i)
    }
  }

  // Public domain CRC32 algorithm

  /**
   * Generates a CRC32 value for a single byte.
   * - - - -
   * @param {number} r The input byte as an unsigned 32-bit integer.
   * @returns {number} The CRC32 value for the byte.
   */
  private crc32ForByte(r: number): number {
    for (let j = 0; j < 8; j++) {
      r = ((r & 1) === 1 ? 0 : 0xedb88320) ^ (r >>> 1)
    }
    return r ^ 0xff000000
  }

  /**
   * Computes the CRC32 checksum for the given data.
   * - - - -
   * @param {Uint8Array<ArrayBufferLike>} data A Uint8Array representing the input data.
   * @returns {number} The CRC32 checksum as an unsigned 32-bit integer.
   */
  private crc32(data: Uint8Array): number {
    let crc = 0
    for (const byte of data) {
      crc = this.crc32Table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
    }
    return crc >>> 0 // Ensure unsigned
  }

  /**
   * Converts a shortname to a song ID using a CRC32 checksum and additional transformations.
   * - - - -
   * @param {string} shortname The input shortname as a string.
   * @returns {number} The computed song ID as an unsigned 32-bit integer.
   */
  shortnameToSongID(shortname: string): number {
    // Convert the string to a UTF-8 byte array
    const encoder = new TextEncoder()
    const buffer = encoder.encode(shortname)

    // Run a CRC32 sum over the whole length of the string
    let checksum = this.crc32(buffer)

    // Adjust the checksum to reduce collision risks
    checksum %= 9999999
    checksum += 2130000000

    return checksum >>> 0 // Ensure the result is unsigned
  }
}

/**
 * Generates a numberic song ID based on any non-numeric string. If the given value is
 * already a number, it will simply return the provided ID.
 *
 * [_See the original C# function on **GitHub Gist**_](https://gist.github.com/InvoxiPlayGames/f0de3ad707b1d42055c53f0fd1428f7f), coded by [Emma (InvoxiPlayGames)](https://gist.github.com/InvoxiPlayGames).
 * - - - -
 * @param {string | number} id Any song ID as `string` or `number`.
 * @returns {number} The generated numeric ID.
 */
export const genNumericSongID = (id: string | number): number => {
  if (typeof id === 'number' || !isNaN(Number(id))) return Number(id)
  const crc32 = new RB3ESongID()
  return crc32.shortnameToSongID(id)
}
