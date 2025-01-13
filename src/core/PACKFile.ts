import Path, { type StringOrPath } from 'path-js'
import setDefaultOptions from 'set-default-options'
import { temporaryFile } from 'tempy'
import { SongsDTA } from '../core.js'
import { WrongDTATypeError } from '../errors.js'
import { BinaryReader, BinaryWriter, bufferConverter, bufferToSHA256Hash, detectBufferEncodingStrict, getKeyFromMapValue, imageConverter } from '../lib.js'
import { SongUpdatesDTA } from './SongUpdatesDTA.js'

export const packfileTypeMap = {
  0: 'customsPack',
  1: 'officialRB3',
} as const

export const dtaFileEncodingMap = {
  0: 'latin1',
  1: 'utf8',
} as const

export type PACKFileTypeOptions = (typeof packfileTypeMap)[keyof typeof packfileTypeMap]
export type PACKFileDTAEncodingOptions = (typeof dtaFileEncodingMap)[keyof typeof dtaFileEncodingMap]

export interface PACKFileCreationOptions {
  fileVersion: number
  packFileType: PACKFileTypeOptions
  dtaContent: StringOrPath | Buffer
  thumbnailContent: StringOrPath | Buffer
  packName: string
  packOriginalFolderName: string
}

export interface PACKFileContentsObject {
  magic: string
  fileVersion: number
  packFileType: PACKFileTypeOptions
  dtaEncoding: PACKFileDTAEncodingOptions
  dtaSize: number
  thumbnailSize: number
  dtaHash: string
  packName: string
  packOriginalFolderName: string
}

export class PACKFile {
  static async resolvePACKFileDTAContents(content: StringOrPath | Buffer) {
    const formatDTA = (originalDTABuffer: Buffer) => {
      try {
        const parsed = new SongsDTA(originalDTABuffer)
        parsed.sort('ID')
        return Buffer.from(parsed.stringify())
      } catch (err) {
        if (err instanceof WrongDTATypeError) {
          const parsed = new SongUpdatesDTA(originalDTABuffer)
          parsed.sort('ID')
          return Buffer.from(parsed.stringify())
        } else throw err
      }
    }
    let buffer: Buffer
    let enc: PACKFileDTAEncodingOptions
    let bufferSize: number
    let hash: string
    if (content instanceof Path) {
      buffer = await content.readFile()
      enc = detectBufferEncodingStrict(buffer)
      bufferSize = buffer.length
      hash = bufferToSHA256Hash(formatDTA(buffer))
    } else if (Buffer.isBuffer(content) && content.length > 0) {
      buffer = content
      enc = detectBufferEncodingStrict(buffer)
      bufferSize = buffer.length
      hash = bufferToSHA256Hash(formatDTA(buffer))
    } else if (Buffer.isBuffer(content) && content.length === 0) {
      buffer = content
      enc = 'latin1'
      bufferSize = 0
      hash = Buffer.alloc(0x20).fill(0).toString('hex')
    } else if (typeof content === 'object' && 'path' in content) {
      const dtaPath = Path.stringToPath(content)
      buffer = await dtaPath.readFile()
      enc = detectBufferEncodingStrict(buffer)
      bufferSize = buffer.length
      hash = bufferToSHA256Hash(formatDTA(buffer))
    } else if (typeof content === 'string' && Path.isValidPath(content)) {
      const dtaPath = Path.stringToPath(content)
      buffer = await dtaPath.readFile()
      enc = detectBufferEncodingStrict(buffer)
      bufferSize = buffer.length
      hash = bufferToSHA256Hash(formatDTA(buffer))
    } else {
      buffer = Buffer.from(content)
      enc = detectBufferEncodingStrict(buffer)
      bufferSize = buffer.length
      hash = bufferToSHA256Hash(formatDTA(buffer))
    }

    return {
      buffer,
      enc,
      bufferSize,
      hash,
    }
  }
  static async resolvePACKFileThumbnail(content: StringOrPath | Buffer) {
    const tempWebp = new Path(temporaryFile({ extension: '.webp' }))
    const webpImgOpts = { quality: 100, width: 256, height: 256 }
    let buffer: Buffer
    let bufferSize: number
    if (content instanceof Path) {
      await imageConverter(content, tempWebp, 'webp', webpImgOpts)
      buffer = await tempWebp.readFile()
      bufferSize = buffer.length
    } else if (Buffer.isBuffer(content) && content.length > 0) {
      await bufferConverter(content, tempWebp, 'webp', webpImgOpts)
      buffer = await tempWebp.readFile()
      bufferSize = buffer.length
    } else if (Buffer.isBuffer(content) && content.length === 0) {
      buffer = content
      bufferSize = 0
    } else if (typeof content === 'object' && 'path' in content) {
      const srcImgPath = Path.stringToPath(content)
      await imageConverter(srcImgPath, tempWebp, 'webp', webpImgOpts)
      buffer = await tempWebp.readFile()
      bufferSize = buffer.length
    } else if (typeof content === 'string' && Path.isValidPath(content)) {
      const srcImgPath = Path.stringToPath(content)
      await imageConverter(srcImgPath, tempWebp, 'webp', webpImgOpts)
      buffer = await tempWebp.readFile()
      bufferSize = buffer.length
    } else {
      await bufferConverter(Buffer.from(content), tempWebp, 'webp', webpImgOpts)
      buffer = await tempWebp.readFile()
      bufferSize = buffer.length
    }

    await tempWebp.checkThenDeleteFile()
    return {
      buffer,
      bufferSize,
    }
  }
  static async createPACKFile(destPath: StringOrPath, content: Partial<PACKFileCreationOptions>) {
    const data = setDefaultOptions<PACKFileCreationOptions>(
      {
        fileVersion: 1,
        packFileType: 'customsPack',
        dtaContent: Buffer.alloc(0),
        thumbnailContent: Buffer.alloc(0),
        packName: '',
        packOriginalFolderName: '',
      },
      content
    )
    const path = new Path(Path.stringToPath(destPath).changeFileExt('.pack'))
    const buf = new BinaryWriter()

    const packFileType = getKeyFromMapValue(packfileTypeMap, data.packFileType)
    const dta = await PACKFile.resolvePACKFileDTAContents(data.dtaContent)
    const thumbnail = await PACKFile.resolvePACKFileThumbnail(data.thumbnailContent)

    buf.writeASCII('PACK')
    buf.writeUInt8(data.fileVersion)
    buf.writeUInt16LE(packFileType)
    buf.writeUInt8(getKeyFromMapValue(dtaFileEncodingMap, dta.enc))
    buf.writeInt32LE(dta.bufferSize)
    buf.writeUInt32LE(thumbnail.bufferSize)
    buf.writeHex(dta.hash)
    buf.writeUTF8(data.packName, 0x40)
    buf.writeUTF8(data.packOriginalFolderName, 0x40)
    buf.write(dta.buffer)
    buf.write(thumbnail.buffer)
    await path.writeFile(buf.toBuffer())
  }

  static async readPACKFile(packFilePath: StringOrPath): Promise<PACKFileContentsObject> {
    const path = Path.stringToPath(packFilePath)
    const reader = await BinaryReader.loadFile(path)
    const magic = await reader.readASCII(0x04)
    const fileVersion = await reader.readUInt8()
    const packFileType = packfileTypeMap[(await reader.readUInt16LE()) as keyof typeof packFilePath]
    const dtaEncoding = dtaFileEncodingMap[(await reader.readUInt8()) as keyof typeof dtaFileEncodingMap]
    const dtaSize = await reader.readInt32LE()
    const thumbnailSize = await reader.readInt32LE()
    const dtaHash = (await reader.read(0x20)).toString('hex')
    const packName = await reader.readUTF8(0x40)
    const packOriginalFolderName = await reader.readUTF8(0x40)
    return {
      magic,
      fileVersion,
      packFileType,
      dtaEncoding,
      dtaSize,
      thumbnailSize,
      dtaHash,
      packName,
      packOriginalFolderName,
    }
  }
}
