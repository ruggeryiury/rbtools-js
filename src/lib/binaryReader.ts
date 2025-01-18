import type { FileHandle } from 'fs/promises'
import Path, { type PathLikeTypes } from 'path-js'
import { FileNotFoundError, BinaryReaderError } from '../errors.js'

export class BinaryReader {
  path?: Path
  handler?: FileHandle
  buffer?: Buffer
  protected offset: number

  static async loadFile(filePath: PathLikeTypes) {
    const path = Path.stringToPath(filePath)
    const handler = await path.openFile()
    return new BinaryReader(path, handler)
  }

  static loadBuffer(buffer: Buffer) {
    return new BinaryReader('', buffer)
  }

  private checkExistence(): boolean {
    if (this.buffer) {
      return true
    } else if (this.path && this.handler) {
      const fileExists = this.path.exists()
      const fileType = this.path.type()
      if (!fileExists) throw new FileNotFoundError(`Binary file "${this.path.path}" does not exists`)
      if (fileType === 'directory') throw new TypeError(`Provided path "${this.path.path}" resolves to a directiory`)
      return true
    }
    throw new BinaryReaderError('Internal function error')
  }

  private constructor(path: PathLikeTypes, handlerOrBuffer: FileHandle | Buffer) {
    if (path instanceof Path) this.path = path
    else this.path = Path.stringToPath(path)

    if (Buffer.isBuffer(handlerOrBuffer)) this.buffer = handlerOrBuffer
    else this.handler = handlerOrBuffer
    this.offset = 0
  }

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

  padding(allocSize: number): void {
    this.offset += allocSize
  }

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

  getOffset(): number {
    return this.offset
  }

  seek(alloc: number): void {
    this.offset = alloc
  }

  async close(): Promise<void> {
    if (this.handler) {
      await this.handler.close()
      return
    }
  }

  async length(): Promise<number> {
    if (this.path && this.handler) {
      const { buffer } = await this.handler.read()
      return buffer.length
    }
    throw new BinaryReaderError('Internal function error')
  }
}
