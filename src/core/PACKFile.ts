import Path, { type PathLikeTypes } from 'path-js'
import setDefaultOptions from 'set-default-options'
import { temporaryFile } from 'tempy'
import { DTAParser } from '../core.js'
import { PACKFileError, UnknownFileFormatError, UnknownMapValueError } from '../errors.js'
import { BinaryReader, BinaryWriter, bufferConverter, bufferSHA256Hash, detectBufferEncoding, getKeyFromMapValue, imageConverter, type ImageConverterOptions } from '../lib.js'

// #region Maps

export const packfileTypeMap = {
  /** This pack is a customs pack, created by any DLC processor program. */
  0: 'customs_pack',
  /** This pack is an official song pack, installed on the Rock Band 3 DLC folder. */
  1: 'official_rb3',
  /** This pack is an official song pack, installed on the Rock Band 2 DLC folder. */
  2: 'official_rb2',
} as const

export const dtaFileEncodingMap = {
  /** Latin-1 encoding. */
  0: 'latin1',
  /** UTF-8 encoding. */
  1: 'utf8',
} as const

export const patchesMap = {
  /**
   * This pack had its DTA file altered from the original one.
   *
   * Any patch applied to the DTA file set this byte to `0x01`.
   */
  0: 'processed',
  /**
   * All custom songs had their `game_origin` value to `custom`.
   */
  1: 'game_origin_patch',
  /**
   * Ssongs without a numberic song ID were fixed.
   */
  2: 'numeric_song_id_patch',
  /**
   * Songs with wrong encoding information were fixed.
   */
  3: 'encoding_patch',
  /**
   * Songs with artworks discrepancies were fixed.
   */
  4: 'artwork_patch',
  /**
   * Songs with missing/wrong metadata were fixed.
   */
  5: 'metadata_patch',
} as const

// #region Map Types

export type PACKFileTypeOptions = (typeof packfileTypeMap)[keyof typeof packfileTypeMap]
export type PACKFileDTAEncodingOptions = (typeof dtaFileEncodingMap)[keyof typeof dtaFileEncodingMap]
export type PACKFilePatchesTypeOptions = (typeof patchesMap)[keyof typeof patchesMap]

// #region Interfaces
export interface PACKFileCreationOptions {
  /**
   * The version of the PACK file.
   */
  fileVersion: number
  /**
   * The PACK file type.
   */
  packFileType: PACKFileTypeOptions
  /**
   * An array with patches that was implemented on the pack.
   */
  patches: PACKFilePatchesTypeOptions[]
  /**
   * The DTA file to be appended to the PACK file.
   * - A path to a DTA file as an instantiated `Path` class.
   * - A `Path` class JSON representation object.
   * - A `Buffer`, empty or not (empty buffers will return a default empty values to write).
   * - A path to a DTA file as `string`.
   */
  dta: PathLikeTypes | Buffer
  /**
   * The thumbnail file to be apprended to the PACK file.
   * - A path to an image file as an instantiated `Path` class.
   * - A `Path` class JSON representation object.
   * - A `Buffer`, empty or not (empty buffers will return a default empty values to write).
   * - A path to an image file as `string`.
   */
  thumbnail: PathLikeTypes | Buffer
  /**
   * The name of the pack.
   */
  packName: string
  /**
   * The original folder name of pack.
   */
  folderName: string
}

export interface PACKFileContentsObject {
  /** The magic of the file. Always bytes `50 41 43 4B` (PACK) */
  magic: string
  /** The version of the PACK file. */
  fileVersion: number
  packFileType: PACKFileTypeOptions
  dtaEncoding: PACKFileDTAEncodingOptions
  dtaSize: number
  thumbnailSize: number
  dtaHash: string
  patches: PACKFilePatchesTypeOptions[]
  packName: string
  folderName: string
  dta: Buffer
  thumbnail: Buffer
}

export interface DTAFileContentsData {
  /** The buffer of the DTA file. */
  buffer: Buffer
  /** The encoding of the DTA file buffer. */
  enc: PACKFileDTAEncodingOptions
  /** The length of the DTA file buffer. */
  bufferSize: number
  /** An unique SHA-256 of the DTA file buffer. */
  hash: string
}

export interface ThumbnailFileContentsData {
  /** The buffer of the thumbnail image file. */
  buffer: Buffer
  /** The length of the thumbnail image file buffer. */
  bufferSize: number
}

// #region PACKFile

/** Class with static methods to deal with Songshelf PACK files. */
export class PACKFile {
  /**
   * Returns all the data needed for DTA injections on a PACK file.
   * - - - -
   * @param {PathLikeTypes | Buffer} content The contents of a DTA file, that can be:
   * - A path to a DTA file as an instantiated `Path` class.
   * - A `Path` class JSON representation object.
   * - A `Buffer`, empty or not (empty buffers will return a default empty values to write).
   * - A path to a DTA file as `string`.
   * @returns {Promise<DTAFileContentsData>}
   */
  static async getDTAContentsDataFromPACKFile(content: PathLikeTypes | Buffer): Promise<DTAFileContentsData> {
    let buffer: Buffer
    let enc: PACKFileDTAEncodingOptions
    let bufferSize: number
    let hash: string
    if (Buffer.isBuffer(content)) {
      // Buffer object, empty or not.
      if (content.length === 0) {
        // Empty buffer, will have default empty values
        buffer = content
        enc = 'latin1'
        bufferSize = 0
        hash = Buffer.alloc(0x20).fill(0).toString('hex')
      } else {
        // Non-empty buffer
        buffer = content
        enc = detectBufferEncoding(buffer)
        bufferSize = buffer.length
        hash = bufferSHA256Hash(DTAParser.formatDTABufferToCalculateHash(buffer))
      }
    } else {
      if (content instanceof Path) {
        // Instantianted Path class
        buffer = await content.readFile()
        enc = detectBufferEncoding(buffer)
        bufferSize = buffer.length
        hash = bufferSHA256Hash(DTAParser.formatDTABufferToCalculateHash(buffer))
      } else if (typeof content === 'object' && 'path' in content) {
        // Path class JSON representation
        buffer = await new Path(content.path).readFile()
        enc = detectBufferEncoding(buffer)
        bufferSize = buffer.length
        hash = bufferSHA256Hash(DTAParser.formatDTABufferToCalculateHash(buffer))
      } else {
        // String (can be only a valid path, decoded string are not recommended)
        if (Path.isValidPath(content)) {
          buffer = await new Path(content).readFile()
          enc = detectBufferEncoding(buffer)
          bufferSize = buffer.length
          hash = bufferSHA256Hash(DTAParser.formatDTABufferToCalculateHash(buffer))
        } else throw new PACKFileError(`DTA file on path "${content}" does not exists`)
      }
    }

    return {
      buffer,
      enc,
      bufferSize,
      hash,
    }
  }

  /**
   * Returns all the data needed for thumbnail injections on a PACK file.
   * - - - -
   * @param {PathLikeTypes | Buffer} content The contents of an image file, that can be:
   * - A path to an image file as an instantiated `Path` class.
   * - A `Path` class JSON representation object.
   * - A `Buffer`, empty or not (empty buffers will return a default empty values to write).
   * - A path to an image file as `string`.
   * @returns {Promise<ThumbnailFileContentsData>}
   */
  static async getThumbnailContentsDataFromPACKFile(content: PathLikeTypes | Buffer): Promise<ThumbnailFileContentsData> {
    const tempWebp = new Path(temporaryFile({ extension: '.webp' }))
    const webpImgOpts: ImageConverterOptions = { quality: 100, width: 256, height: 256, interpolation: 'lanczos' }
    let buffer: Buffer
    let bufferSize: number
    if (Buffer.isBuffer(content)) {
      // Buffer object, empty or not
      if (content.length === 0) {
        // Empty buffer, will have default empty values
        buffer = content
        bufferSize = 0
      } else {
        // Non-empty buffer
        await bufferConverter(content, tempWebp, 'webp', webpImgOpts)
        buffer = await tempWebp.readFile()
        bufferSize = buffer.length
      }
    } else {
      if (content instanceof Path) {
        // Instantianted Path class
        await imageConverter(content, tempWebp, 'webp', webpImgOpts)
        buffer = await tempWebp.readFile()
        bufferSize = buffer.length
      } else if (typeof content === 'object' && 'path' in content) {
        // Path class JSON representation
        await imageConverter(Path.stringToPath(content), tempWebp, 'webp', webpImgOpts)
        buffer = await tempWebp.readFile()
        bufferSize = buffer.length
      } else {
        // String (can be a valid path, decoded content will return an error)
        if (Path.isValidPath(content)) {
          await imageConverter(Path.stringToPath(content), tempWebp, 'webp', webpImgOpts)
          buffer = await tempWebp.readFile()
          bufferSize = buffer.length
        } else throw new PACKFileError(`Thumbnail image on path "${content}" does not exists`)
      }
    }

    await tempWebp.checkThenDeleteFile()
    return {
      buffer,
      bufferSize,
    }
  }

  /**
   * Parses the patches bytes and returns an array with the enabled patches.
   * - - - -
   * @param {Buffer} patchesBytes The patches bytes portion of a PACK file
   * @returns {PACKFilePatchesTypeOptions[]}
   */
  static parsePatchesBytes(patchesBytes: Buffer): PACKFilePatchesTypeOptions[] {
    const patches: PACKFilePatchesTypeOptions[] = []
    let i = 0
    for (const byte of patchesBytes) {
      const value = Boolean(byte)
      if (value) {
        patches.push(patchesMap[i++ as keyof typeof patchesMap])
      }
    }

    return patches
  }

  /**
   * Asynchronously creates a PACK file based on the provided arguments.
   * - - - -
   * @param {Partial<PACKFileCreationOptions>} content An object with data to write to the PACK file.
   * @param {PathLikeTypes | undefined} destPath The path that the PACK file will be written.
   * @returns {Promise<void>}
   */
  static async writeFile(content: Partial<PACKFileCreationOptions>, destPath?: PathLikeTypes): Promise<Buffer> {
    const data = setDefaultOptions<PACKFileCreationOptions>(
      {
        fileVersion: 1,
        packFileType: 'customs_pack',
        patches: [],
        dta: Buffer.alloc(0),
        thumbnail: Buffer.alloc(0),
        packName: '',
        folderName: '',
      },
      content
    )
    const path = destPath ? new Path(Path.stringToPath(destPath).changeFileExt('.pack')) : null
    const buf = new BinaryWriter()

    const packFileType = getKeyFromMapValue(packfileTypeMap, data.packFileType)
    if (!packFileType) throw new UnknownMapValueError(`'${data.packFileType}' is an invalid value for PACK file type.`)
    const dta = await PACKFile.getDTAContentsDataFromPACKFile(data.dta)
    const packFileDTAEnc = getKeyFromMapValue(dtaFileEncodingMap, dta.enc)
    if (!packFileDTAEnc) throw new UnknownMapValueError(`'${dta.enc}' is an invalid value for DTA file encoding.`)
    const thumbnail = await PACKFile.getThumbnailContentsDataFromPACKFile(data.thumbnail)
    const patchesCount = Object.keys(patchesMap).length

    // Write magic
    buf.writeASCII('PACK')

    // Write file version
    buf.writeUInt8(data.fileVersion)

    // Write pack file type
    buf.writeUInt8(packFileType)

    // Write patches row length
    buf.writeUInt8(patchesCount)

    // Write DTA file encoding
    buf.writeUInt8(packFileDTAEnc)

    // Write DTA size
    buf.writeInt32LE(dta.bufferSize)

    // Write thumbnail size
    buf.writeUInt32LE(thumbnail.bufferSize)

    // Write DTA hash
    buf.writeHex(dta.hash)

    // Write DTA patches
    if (data.patches.length === 0) buf.writePadding(patchesCount, 0)
    else {
      const patchesBuffer = Buffer.alloc(patchesCount).fill(0)
      for (const patch of data.patches) {
        const patchValue = getKeyFromMapValue(patchesMap, patch)
        if (patchValue) {
          patchesBuffer[patchValue] = 0x01
          continue
        }
        throw new UnknownMapValueError(`'${patch}' is not an invalid value for patches.`)
      }

      buf.write(patchesBuffer)
    }

    // Write pack name
    buf.writeUTF8(data.packName, 0x40)

    // Write original folder name
    buf.writeUTF8(data.folderName, 0x40)

    // Write DTA
    buf.write(dta.buffer)

    // Write thumbnail
    buf.write(thumbnail.buffer)

    const packBuffer = buf.toBuffer()

    // Save
    if (path) await path.writeFile(packBuffer)

    return packBuffer
  }

  /**
   * Asynchronously reads and parses a PACK file.
   * - - - -
   * @param {PathLikeTypes} packFilePath The path to be PACK file to be read.
   * @returns {Promise<PACKFileContentsObject>}
   */
  static async readFile(packFilePath: PathLikeTypes): Promise<PACKFileContentsObject> {
    const path = Path.stringToPath(packFilePath)
    const reader = await BinaryReader.loadFile(path)
    const magic = await reader.readASCII(0x04)
    if (magic !== 'PACK') throw new UnknownFileFormatError('File is not recognizable as a PACK file')
    const fileVersion = await reader.readUInt8()
    const packFileType = packfileTypeMap[(await reader.readUInt8()) as keyof typeof packfileTypeMap]
    const patchesCount = await reader.readUInt8()
    const dtaEncoding = dtaFileEncodingMap[(await reader.readUInt8()) as keyof typeof dtaFileEncodingMap]
    const dtaSize = await reader.readInt32LE()
    const thumbnailSize = await reader.readInt32LE()
    const dtaHash = (await reader.read(0x20)).toString('hex')
    const patches = PACKFile.parsePatchesBytes(await reader.read(patchesCount))
    const packName = await reader.readUTF8(0x40)
    const folderName = await reader.readUTF8(0x40)
    const dta = await reader.read(dtaSize)
    const thumbnail = await reader.read(thumbnailSize)
    await reader.close()
    return {
      magic,
      fileVersion,
      packFileType,
      dtaEncoding,
      dtaSize,
      thumbnailSize,
      dtaHash,
      patches,
      packName,
      folderName,
      dta,
      thumbnail,
    }
  }

  /**
   * Asynchronously reads and parses a PACK file `Buffer` object.
   * - - - -
   * @param {Buffer} packFileBuffer The buffer of the PACK file.
   * @returns {Promise<PACKFileContentsObject>}
   */
  static async readBuffer(packFileBuffer: Buffer): Promise<PACKFileContentsObject> {
    const reader = BinaryReader.loadBuffer(packFileBuffer)
    const magic = await reader.readASCII(0x04)
    if (magic !== 'PACK') throw new UnknownFileFormatError('File is not recognizable as a PACK file')
    const fileVersion = await reader.readUInt8()
    const packFileType = packfileTypeMap[(await reader.readUInt8()) as keyof typeof packfileTypeMap]
    const patchesCount = await reader.readUInt8()
    const dtaEncoding = dtaFileEncodingMap[(await reader.readUInt8()) as keyof typeof dtaFileEncodingMap]
    const dtaSize = await reader.readInt32LE()
    const thumbnailSize = await reader.readInt32LE()
    const dtaHash = (await reader.read(0x20)).toString('hex')
    const patches = PACKFile.parsePatchesBytes(await reader.read(patchesCount))

    const packName = await reader.readUTF8(0x40)
    const folderName = await reader.readUTF8(0x40)
    const dta = await reader.read(dtaSize)
    const thumbnail = await reader.read(thumbnailSize)
    await reader.close()
    return {
      magic,
      fileVersion,
      packFileType,
      dtaEncoding,
      dtaSize,
      thumbnailSize,
      dtaHash,
      patches,
      packName,
      folderName,
      dta,
      thumbnail,
    }
  }

  // static async rewriteFile(srcFilePath: PathLikeTypes, newContents: Partial<PACKFileCreationOptions>, destFilePath?: PathLikeTypes): Promise<Buffer> {
  //   const src = Path.stringToPath(srcFilePath)
  //   const srcData = await PACKFile.readFile(src)
  //   const newCon = setDefaultOptions<PACKFileCreationOptions>(
  //     {
  //       ...srcData,
  //     },
  //     newContents
  //   )
  //   const destBuffer = await PACKFile.writeFile(newCon, destFilePath)
  //   return destBuffer
  // }
}
