import type { FileHandle } from 'fs/promises'
import Path, { type PathLikeTypes } from 'path-js'
import { FileNotFoundError, BinaryReaderError } from '../errors.js'

/**
 * A class to read binary files.
 */
export class BinaryReader {
  /**
   * The path of the binary file that will be read. This is `undefined` when you initialize this class instance using the static `loadBuffer()` method.
   */
  path?: Path
  /**
   * The handler of the file that will be read. This is `undefined` when you initialize this class instance using the static `loadBuffer()` method.
   */
  handler?: FileHandle
  /**
   * The buffer that will be read. This is `undefined` when you initialize this class instance using the static `loadFile()` method.
   */
  buffer?: Buffer
  /**
   * The byte offset that all read methods will use.
   */
  protected offset: number

  /**
   * Asynchronously opens a `FileHandle` to a specific file path and use it to read bytes throughout this initialized class instance.
   * - - - -
   * @param {PathLikeTypes} filePath The path of any binary file.
   * @returns {Promise<BinaryReader>}
   */
  static async loadFile(filePath: PathLikeTypes): Promise<BinaryReader> {
    const path = Path.stringToPath(filePath)
    const handler = await path.openFile()
    return new BinaryReader(path, handler)
  }

  /**
   * Uses a provided `Buffer` object to read its bytes throughout this initialized class instance.
   * - - - -
   * @param {Buffer} buffer The buffer that the class will use to read bytes.
   * @returns {BinaryReader}
   */
  static loadBuffer(buffer: Buffer): BinaryReader {
    return new BinaryReader('', buffer)
  }

  /**
   * Checks the existence of the file on the provided path. `BinaryReader` classes that uses `Buffer` objects will always
   * returns `true`.
   * - - - -
   * @returns {boolean}
   */
  private checkExistence(): boolean {
    if (this.buffer) {
      return true
    } else if (this.path && this.handler) {
      const fileExists = this.path.exists()
      const fileType = this.path.type()
      if (!fileExists) throw new FileNotFoundError(`Binary file "${this.path.path}" does not exists`)
      if (fileType === 'directory') throw new TypeError(`Provided path "${this.path.path}" resolves to a directiory, not a file`)
      return true
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Creates a `BinaryReader` class instance.
   * - - - -
   * @param {PathLikeTypes} path The path of any binary file to be read.
   * @param {FileHandle | Buffer} handlerOrBuffer A `FileHandle` or `Buffer` object that will be stored on this class instance.
   */
  private constructor(path: PathLikeTypes, handlerOrBuffer: FileHandle | Buffer) {
    if (path instanceof Path) this.path = path
    else this.path = Path.stringToPath(path)

    if (Buffer.isBuffer(handlerOrBuffer)) this.buffer = handlerOrBuffer
    else this.handler = handlerOrBuffer
    this.offset = 0
  }

  /**
   * Asynchronously reads the binary file and returns its contents as `Buffer`.
   * - - - -
   * @param {number | undefined} allocSize The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<Buffer>}
   */
  async read(allocSize?: number): Promise<Buffer> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize !== undefined) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf
      }
      const { buffer } = await this.handler.read({ offset: this.offset, length: allocSize })
      this.offset = 0
      return buffer
    } else if (this.buffer) {
      if (allocSize !== undefined) {
        const buf = this.buffer.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf
      }
      const buffer = this.buffer.subarray(this.offset)
      this.offset = 0
      return buffer
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads the binary file and returns ASCII-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} allocSize The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readASCII(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize !== undefined) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf.toString('ascii').replaceAll('\x00', '')
      }
      const { buffer } = await this.handler.read({ position: this.offset, length: allocSize })
      this.offset += 0
      return buffer.toString('ascii').replaceAll('\x00', '')
    } else if (this.buffer) {
      if (allocSize !== undefined) {
        const buf = this.buffer.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('ascii').replaceAll('\x00', '')
      }
      const buffer = this.buffer.subarray(this.offset)
      this.offset = 0
      return buffer.toString('ascii').replaceAll('\x00', '')
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads the binary file and returns Latin1-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} allocSize The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readLatin1(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf.toString('latin1').replaceAll('\x00', '')
      }
      const { buffer } = await this.handler.read({ position: this.offset, length: allocSize })
      this.offset += 0
      return buffer.toString('latin1').replaceAll('\x00', '')
    } else if (this.buffer) {
      if (allocSize !== undefined) {
        const buf = this.buffer.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('latin1').replaceAll('\x00', '')
      }
      const buffer = this.buffer.subarray(this.offset)
      this.offset = 0
      return buffer.toString('latin1').replaceAll('\x00', '')
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads the binary file and returns UTF8-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} allocSize The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readUTF8(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf.toString('utf8').replaceAll('\x00', '')
      }
      const { buffer } = await this.handler.read({ position: this.offset, length: allocSize })
      this.offset += 0
      return buffer.toString('utf8').replace('\x00', '')
    } else if (this.buffer) {
      if (allocSize !== undefined) {
        const buf = this.buffer.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('utf8').replaceAll('\x00', '')
      }
      const buffer = this.buffer.subarray(this.offset)
      this.offset = 0
      return buffer.toString('utf8').replaceAll('\x00', '')
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads the binary file and returns HEX-decoded contents as `string`.
   * - - - -
   * @param {number | undefined} allocSize The allocation size of the desired bytes. If `undefined`, the reader will
   * return all bytes from the file, starting by the class `offset` value.
   * @returns {Promise<string>}
   */
  async readHex(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf.toString('hex').replaceAll('\x00', '')
      }
      const { buffer } = await this.handler.read({ position: this.offset, length: allocSize })
      this.offset += 0
      return buffer.toString('hex').replace('\x00', '')
    } else if (this.buffer) {
      if (allocSize !== undefined) {
        const buf = this.buffer.subarray(this.offset, this.offset + allocSize)
        this.offset += allocSize
        return buf.toString('hex').replaceAll('\x00', '')
      }
      const buffer = this.buffer.subarray(this.offset)
      this.offset = 0
      return buffer.toString('hex').replaceAll('\x00', '')
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Increments the `offset` value of this class by provided `allocSize` bytes.
   * - - - -
   * @param {number} allocSize The allocation size to be incremented.
   * @returns {void}
   */
  padding(allocSize: number): void {
    this.offset += allocSize
  }

  /**
   * Asynchronously reads an unsigned 8-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt8(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(1)
      await this.handler.read({ buffer: buf, position: this.offset, length: 1 })
      this.offset++
      return buf.readUInt8()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 1)
      this.offset++
      return buffer.readUInt8()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads an unsigned, little-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt16LE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(2)
      await this.handler.read({ buffer: buf, position: this.offset, length: 2 })
      this.offset += 2
      return buf.readUInt16LE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt16LE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads an unsigned, big-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt16BE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(2)
      await this.handler.read({ buffer: buf, position: this.offset, length: 2 })
      this.offset += 2
      return buf.readUInt16BE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt16BE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads an unsigned, little-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt32LE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(4)
      await this.handler.read({ buffer: buf, position: this.offset, length: 4 })
      this.offset += 4
      return buf.readUInt32LE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32LE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads an unsigned, big-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readUInt32BE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(4)
      await this.handler.read({ buffer: buf, position: this.offset, length: 4 })
      this.offset += 4
      return buf.readUInt32BE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32BE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads a signed 8-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt8(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(1)
      await this.handler.read({ buffer: buf, position: this.offset, length: 1 })
      this.offset++
      return buf.readInt8()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 1)
      this.offset++
      return buffer.readInt8()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads a signed, little-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt16LE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(2)
      await this.handler.read({ buffer: buf, position: this.offset, length: 2 })
      this.offset += 2
      return buf.readInt16LE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readInt16LE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads a signed, big-endian 16-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt16BE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(2)
      await this.handler.read({ buffer: buf, position: this.offset, length: 2 })
      this.offset += 2
      return buf.readInt16BE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt16BE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads a signed, little-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt32LE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(4)
      await this.handler.read({ buffer: buf, position: this.offset, length: 4 })
      this.offset += 4
      return buf.readInt32LE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 4)
      this.offset += 4
      return buffer.readUInt32LE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Asynchronously reads a signed, big-endian 32-bit integer.
   * - - - -
   * @returns {Promise<number>}
   */
  async readInt32BE(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(4)
      await this.handler.read({ buffer: buf, position: this.offset, length: 4 })
      this.offset += 4
      return buf.readInt32BE()
    } else if (this.buffer) {
      const buffer = this.buffer.subarray(this.offset, this.offset + 2)
      this.offset += 2
      return buffer.readUInt32BE()
    }
    throw new BinaryReaderError('Internal function error')
  }

  /**
   * Returns the byte offset used on this class.
   * - - - -
   * @returns {number}
   */
  getOffset(): number {
    return this.offset
  }

  /**
   * Changes the byte offset used on this class.
   * - - - -
   * @param {number} offset The new byte offset.
   * @returns {void}
   */
  seek(offset: number): void {
    this.offset = offset
  }

  /**
   * Closes the `FileHandle` used on this class.
   * - - - -
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    if (this.handler) {
      await this.handler.close()
      return
    }
  }

  /**
   * Asynchronously reads all data from the file/buffer object and return its length.
   * - - - -
   * @returns {Promise<number>}
   */
  async length(): Promise<number> {
    if (this.path && this.handler) {
      const { buffer } = await this.handler.read()
      return buffer.length
    }
    throw new BinaryReaderError('Internal function error')
  }
}
