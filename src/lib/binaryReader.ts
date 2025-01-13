import type { FileHandle } from 'fs/promises'
import Path, { type StringOrPath } from 'path-js'
import { FileNotFoundError, BinaryReaderError } from '../errors.js'

export class BinaryReader {
  path?: Path
  handler?: FileHandle
  protected offset: number

  static async loadFile(binaryFilePath: StringOrPath) {
    const path = Path.stringToPath(binaryFilePath)
    const handler = await path.openFile()
    return new BinaryReader(path, handler)
  }

  private checkExistence(): boolean {
    if (this.path && this.handler) {
      const fileExists = this.path.exists()
      const fileType = this.path.type()
      if (!fileExists) throw new FileNotFoundError(`Binary file "${this.path.path}" does not exists`)
      if (fileType === 'directory') throw new TypeError(`Provided path "${this.path.path}" resolves to a directiory`)
      return true
    }
    throw new BinaryReaderError('Internal function error')
  }

  private constructor(path: Path, handler: FileHandle) {
    this.path = path
    this.handler = handler
    this.offset = 0
  }

  async read(allocSize?: number): Promise<Buffer> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf
      }
      const { buffer } = await this.handler.read({ offset: this.offset, length: allocSize })
      this.offset = 0
      return buffer
    }
    throw new BinaryReaderError('Internal function error')
  }

  async readASCII(allocSize?: number): Promise<string> {
    this.checkExistence()
    if (this.path && this.handler) {
      if (allocSize) {
        const buf = Buffer.alloc(allocSize)
        await this.handler.read({ buffer: buf, position: this.offset, length: allocSize })
        this.offset += allocSize
        return buf.toString('ascii').replaceAll('\x00', '')
      }
      const { buffer } = await this.handler.read({ position: this.offset, length: allocSize })
      this.offset += 0
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
      await this.handler.read({ buffer: buf, position: this.offset++, length: 1 })
      return buf.readUInt8()
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
    }
    throw new BinaryReaderError('Internal function error')
  }

  async readInt8(): Promise<number> {
    this.checkExistence()
    if (this.path && this.handler) {
      const buf = Buffer.alloc(1)
      await this.handler.read({ buffer: buf, position: this.offset++, length: 1 })
      return buf.readInt8()
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
    }
    throw new BinaryReaderError('Internal function error')
  }

  async length(): Promise<number> {
    if (this.path && this.handler) {
      const { buffer } = await this.handler.read()
      return buffer.length
    }
    throw new BinaryReaderError('Internal function error')
  }
}
