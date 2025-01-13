import { BinaryWriterError } from '../errors.js'

/** A class to create simple binary files. */
export class BinaryWriter {
  /** An array with `Buffer` objects that will be the content of the new binary file. */
  contents: Buffer[]
  constructor() {
    this.contents = []
  }

  /**
   * Formats a number by adding dots as thousands separators.
   * - - - -
   * @param {number} value The number to be formatted (can be positive or negative).
   * @returns {string} The formatted number as a string.
   */
  private formarNumberWithDots(value: number): string {
    if (!Number.isFinite(value)) throw new TypeError('Input must be a finite number')

    const isNegative = value < 0
    const absoluteValue = Math.abs(value)

    const formatted = absoluteValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return isNegative ? `-${formatted}` : formatted
  }

  /**
   * Writes raw `Buffer` values on the binary file.
   * - - - -
   * @param {Buffer} value The `Buffer` object to be added to the binary file.
   * @returns {void}
   */
  write(value: Buffer): void {
    this.contents.push(value)
  }

  /**
   * Writes any kind of text on the binary file encoded as ASCII.
   * - - - -
   * @param {string} value The string to be added to the binary file.
   * @param {number | undefined} allocSize `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeASCII(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'ascii')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'ascii'))
    return
  }

  /**
   * Writes any kind of text on the binary file encoded as Latin1.
   * - - - -
   * @param {string} value The string to be added to the binary file.
   * @param {number | undefined} allocSize `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeLatin1(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'ascii')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'ascii'))
    return
  }

  /**
   * Writes any kind of text on the binary file encoded as UTF-8.
   * - - - -
   * @param {string} value The string to be added to the binary file.
   * @param {number | undefined} allocSize `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeUTF8(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'utf8')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'utf8'))
    return
  }

  /**
   * Writes any kind of HEX string text on the binary file as bytes.
   * - - - -
   * @param {string} value The HEX string to be added to the binary file.
   * @param {number | undefined} allocSize `OPTIONAL` The allocation size of the string. If not specified,
   * the `Buffer` will have the same size of the string on its encoding method.
   * @returns {void}
   */
  writeHex(value: string, allocSize?: number): void {
    if (allocSize) {
      const buf = Buffer.alloc(allocSize)
      buf.write(value, 'hex')
      this.contents.push(buf)
      return
    }
    this.contents.push(Buffer.from(value, 'hex'))
    return
  }

  /**
   * Writes a padding-like `Buffer` filled with specific value.
   * - - - -
   * @param {number} paddingSize The size of the padding.
   * @param {number} fill `OPTIONAL` The value you want to fill the padding. Default is `0`.
   */
  writePadding(paddingSize: number, fill = 0): void {
    const buf = Buffer.alloc(paddingSize).fill(fill)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 8-bit value on the binary file.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt8(value: number): void {
    if (value < 0 || value > 255) throw new BinaryWriterError(`Value must be between 0 and 255, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(1)
    buf.writeUIntLE(value, 0, 1)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 16-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt16LE(value: number): void {
    if (value < 0 || value > 65535) throw new BinaryWriterError(`Value must be between 0 and 65.535, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeUIntLE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 16-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt16BE(value: number): void {
    if (value < 0 || value > 65535) throw new BinaryWriterError(`Value must be between 0 and 65.535, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeUIntBE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 32-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt32LE(value: number): void {
    if (value < 0 || value > 4294967295) throw new BinaryWriterError(`Value must be between 0 and 4.294.967.295, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeUIntLE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Writes an unsigned 32-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeUInt32BE(value: number): void {
    if (value < 0 || value > 4294967295) throw new BinaryWriterError(`Value must be between 0 and 4.294.967.295, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeUIntBE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 8-bit value on the binary file.
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt8(value: number): void {
    if (value < -128 || value > 127) throw new BinaryWriterError(`Value must be between -128 and 127, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(1)
    buf.writeIntLE(value, 0, 1)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 16-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt16LE(value: number): void {
    if (value < -32768 || value > 32767) throw new BinaryWriterError(`Value must be between -32.768 and 32.767, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeIntLE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 16-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt16BE(value: number): void {
    if (value < -32768 || value > 32767) throw new BinaryWriterError(`Value must be between -32.768 and 32.767, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(2)
    buf.writeIntBE(value, 0, 2)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 32-bit value on the binary file (little endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt32LE(value: number): void {
    if (value < -2147483648 || value > 2147483647) throw new BinaryWriterError(`Value must be between -2.147.483.648 and 2.147.483.647, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeIntLE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Writes a signed 32-bit value on the binary file (big endian mode).
   * - - - -
   * @param {number} value The number to be added to the binary file.
   * @returns {void}
   */
  writeInt32BE(value: number): void {
    if (value < -2147483648 || value > 2147483647) throw new BinaryWriterError(`Value must be between -2.147.483.648 and 2.147.483.647, provided ${this.formarNumberWithDots(value)}.`)
    const buf = Buffer.alloc(4)
    buf.writeIntBE(value, 0, 4)
    this.contents.push(buf)
  }

  /**
   * Creates a new `Buffer` object with all contents joined.
   * - - - -
   * @returns {Buffer}
   */
  toBuffer(): Buffer {
    const bufferLength = this.length()
    const buffer = Buffer.alloc(bufferLength)
    let offset = 0
    for (const content of this.contents) {
      for (const contentByte of content) {
        buffer.writeUInt8(contentByte, offset++)
      }
    }

    return buffer
  }

  /**
   * Returns the length of the new binary file so far.
   * - - - -
   * @returns {number}
   */
  length(): number {
    const bufferLength = this.contents.reduce((prev, curr) => {
      return prev + curr.length
    }, 0)
    return bufferLength
  }
}
