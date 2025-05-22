import { BinaryReader, createHash, numberToHexString, padHexToLength, pathLikeToString, type FilePathLikeTypes } from 'node-lib'
import { DTAParser } from '..'
import { PkgXorSha1Counter, calculateAesAlignedOffsetAndSize, type CalculatedAesOffsetAndSizeObject, type PartialDTAFile } from '../lib.exports'

export interface PKGHeaderData {
  /**
   * The file signature.
   *
   * Always `[0x7F 0x50 0x4B 0x47]` " PKG" for Rock Band 3 Song Package.
   */
  magic: string
  /**
   * `[0x80 0x00]` for finalized (retail), `[0x00 0x00]` for non finalized (debug).
   *
   * Always `[0x00 0x00]` for Rock Band 3 Song Package.
   */
  resivion: number
  pkgType: number
  pkgPlatform: string
  metadataOffset: number
  metadataCount: number
  headerSize: number
  itemCount: number
  totalSize: number
  dataOffset: number
  dataSize: number
  contentID: string
  cidTitle1: string
  cidTitle2: string
  digest: string
  dataRIV: string
  metadataSize: number
  keyIndex: number
  pkgDebug: boolean
  paramSFO: string
  debugXorIV: string
  metadata: PKGMetadata[]
  // aesCtr: PkgAesCtrCounter[]
  xorCtr: PkgXorSha1Counter
}

export interface PKGMetadata {
  typeDesc: string
  value:
    | {
        type: string
        data: number[]
      }
    | number
  size?: number
  hexSize?: number
  binSize?: number
  pkgSize?: number
  revision?: string
  version?: string
  unknownBytes?: Buffer
}

export interface PKGItemEntriesData {
  offset: number
  size: number
  entriesSize: number
  namesOffset: number
  namesSize: number
  sha256: string
  fileOffset: number
  fileOffsetEnd: number
  dlcFolderName: string
  items: PKGItemEntriesMap[]
}

export interface PKGItemEntriesMap {
  name: string
  itemNameOffset: number
  itemNameSize: number
  itemDataOffset: number
  itemDataSize: number
  itemAlign: CalculatedAesOffsetAndSizeObject
  flags: number
  isFile: boolean
  isDir: boolean
}

export interface PKGData {
  pkgFilePath: string | null
  header: PKGHeaderData
  entries: PKGItemEntriesData
  sfo: SFOData
}

export interface SFODataObject {
  /**
   * The key name of the entry.
   */
  keyName: string
  data: string
  keyOffset: number
  paramFormat: 'utf8special' | 'utf8' | 'uint32'
  paramLength: number
  paramMaxLength: number
  dataOffset: number
}

export interface SFOData {
  /**
   * The semantic version of the file.
   */
  version: string
  /**
   * The start offset of the key table.
   */
  keyTableStartOffset: number
  /**
   * The start offset of the data table.
   */
  dataTableStartOffset: number
  /**
   * The amount of entries of the SFO file.
   */
  tableEntriesCount: number
  /**
   * The data of the entries of the SFO file.
   */
  data: SFODataObject[]
}

export class PKGFile {
  /**
   * An array with keys that acts as an IV for AES decryption.
   *
   * Not used on this script at all, but kept on this script.
   */
  private static readonly pkgContentKeys = [
    {
      key: Buffer.from('Lntx18nJoU6jIh8YiCi4+A==', 'base64'),
      desc: 'PS3',
    },
    {
      key: Buffer.from('B/LGgpC1DSwzgY1wm2DmKw==', 'base64'),
      desc: 'PSX/PSP',
    },
    {
      key: Buffer.from('4xpwyc4d1yvzwGIpY/Lsyw==', 'base64'),
      desc: 'PSV',
      derive: true,
    },
    {
      key: Buffer.from('QjrKOivVZJ+Whqutb9iAHw==', 'base64'),
      desc: 'PSV Livearea',
      derive: true,
    },
    {
      key: Buffer.from('rwf9WWUlJ7rxM4lmixfZ6g==', 'base64'),
      desc: 'PSM',
      derive: true,
    },
  ] as const

  /**
   * Parses the information of a `PARAM.SFO` file buffer.
   * - - - -
   * @param {Buffer | BinaryReader} bufferOrReader A `Buffer` of the SFO file or a `BinaryReader` class instantiated to a SFO file.
   * @param {FilePathLikeTypes} [file] `OPTIONAL` The path to the corresponding SFO file that you've working on. This parameter is only used when passing a `BinaryReader` argument to work upon.
   * @returns {Promise<SFOData>}
   */
  static async parseSFOBuffer(bufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes): Promise<SFOData> {
    let reader: BinaryReader
    if (Buffer.isBuffer(bufferOrReader)) reader = BinaryReader.fromBuffer(bufferOrReader)
    else if (file && bufferOrReader instanceof BinaryReader) reader = bufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read PS3 SFO file or buffer.`)

    const magic = await reader.readHex(4)
    if (magic !== '0x00505346') throw new Error(file ? `Provided file "${pathLikeToString(file)}" has invalid PS3 SFO file signature.` : 'Provided buffer has invalid PS3 SFO file buffer signature.')
    let version = ''
    version += `${(await reader.readUInt8()).toString()}.`
    version += (await reader.readUInt8()).toString()
    reader.padding(0x02)
    const keyTableStartOffset = await reader.readUInt32LE()
    const dataTableStartOffset = await reader.readUInt32LE()
    const tableEntriesCount = await reader.readUInt32LE()
    const data: SFODataObject[] = []

    for (let i = 0; i < tableEntriesCount; i++) {
      const keyName = ''
      const keyOffset = await reader.readUInt16LE()
      reader.padding(0x01)
      let paramFormat: SFODataObject['paramFormat'] = 'utf8special'
      switch (await reader.readUInt8()) {
        case 0:
          break
        case 2:
          paramFormat = 'utf8'
          break
        case 4:
          paramFormat = 'uint32'
          break
      }
      const paramLength = await reader.readUInt32LE()
      const paramMaxLength = await reader.readUInt32LE()
      const dataOffset = await reader.readUInt32LE()

      data.push({
        keyName,
        data: '',
        keyOffset,
        paramFormat,
        paramLength,
        paramMaxLength,
        dataOffset,
      })
    }

    let i = 0
    let readKeyBytes = 0
    for (const entry of data) {
      const keyOffset = keyTableStartOffset + entry.keyOffset
      let keyLength = 0
      if (i === data.length - 1) keyLength = dataTableStartOffset - keyOffset
      else keyLength = data[i + 1].keyOffset - readKeyBytes
      reader.seek(keyOffset)
      const keyName = await reader.readUTF8(keyLength)
      readKeyBytes += keyLength
      data[i] = { ...entry, keyName }
      i++
    }

    i = 0
    let readDataBytes = 0
    for (const entry of data) {
      const dataOffset = dataTableStartOffset + entry.dataOffset
      let dataLength = 0
      if (i === data.length - 1) dataLength = reader.size - dataOffset
      else dataLength = data[i + 1].dataOffset - readDataBytes
      reader.seek(dataOffset)
      let entryData
      reader.seek(dataOffset)
      switch (entry.paramFormat) {
        case 'utf8':
        case 'utf8special':
          entryData = await reader.readUTF8(dataLength)
          break
        case 'uint32':
          entryData = padHexToLength(numberToHexString(await reader.readUInt32LE()))
          break
      }
      readDataBytes += dataLength
      data[i] = { ...entry, data: entryData }
      i++
    }

    await reader.close()
    return {
      version,
      keyTableStartOffset,
      dataTableStartOffset,
      tableEntriesCount,
      data,
    }
  }

  /**
   * Parses the information of a `PARAM.SFO` file.
   * - - - -
   * @param {FilePathLikeTypes} sfoFilePath A path to a `PARAM.SFO` file to be parsed.
   * @returns {Promise<SFOData>}
   */
  static async parseSFOFromFile(sfoFilePath: FilePathLikeTypes): Promise<SFOData> {
    const reader = await BinaryReader.fromFile(sfoFilePath)
    return await this.parseSFOBuffer(reader, sfoFilePath)
  }

  /**
   * Parses a PKG file header.
   * - - - -
   * @param {Buffer | BinaryReader} bufferOrReader A `Buffer` of the PKG file or a `BinaryReader` class instantiated to a PKG file.
   * @param {FilePathLikeTypes} [file] `OPTIONAL` The path to the corresponding PKG file that you've working on. This parameter is only used when passing a `BinaryReader` argument to work upon. Not passing a `file` parameter when an instantiated `BinaryReader` is provided as `bufferOrReader` will throw an Error.
   * @returns {PKGHeaderData}
   */
  static async parsePKGHeader(bufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes): Promise<PKGHeaderData> {
    let reader: BinaryReader
    if (Buffer.isBuffer(bufferOrReader)) reader = BinaryReader.fromBuffer(bufferOrReader)
    else if (file && bufferOrReader instanceof BinaryReader) reader = bufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read Rock Band 3 PKG file or buffer.`)

    // Header
    const magic = await reader.readHex(4)
    if (magic !== '0x7f504b47') throw new Error(file ? `Provided file "${pathLikeToString(file)}" has invalid PS3 PKG file signature.` : 'Provided buffer has invalid PS3 PKG file buffer signature.')
    const resivion = await reader.readUInt16LE()
    const pkgDebug = resivion === 0
    const pkgType = await reader.readUInt16BE()
    const pkgPlatform = pkgType === 1 ? 'PS3' : pkgType === 2 ? 'PSP/PSVita' : 'Unknown'
    if (pkgPlatform !== 'PS3') {
      await reader.close()
      throw new Error(file ? `Provided file "${pathLikeToString(file)}" is not a PS3 PKG file.` : 'Provided buffer  is not a PS3 PKG file buffer.')
    }
    const metadataOffset = await reader.readUInt32BE()
    const metadataCount = await reader.readUInt32BE()
    const headerSize = await reader.readUInt32BE()
    const itemCount = await reader.readUInt32BE()
    const totalSize = Number(await reader.readUInt64BE())
    const dataOffset = Number(await reader.readUInt64BE())
    const dataSize = Number(await reader.readUInt64BE())
    const contentID = await reader.readUTF8(0x30)
    const digest = await reader.readHex(0x10, false)
    const dataRIV = await reader.readHex(0x10, false)
    let metadataSize = 0

    // Metadata
    reader.seek(metadataOffset)
    const metadata: PKGMetadata[] = []

    for (let i = 0; i < metadataCount; i++) {
      const metadataMap = new Map<keyof PKGMetadata, unknown>()
      const metadataEntryType = await reader.readUInt32BE()
      const metadataEntrySize = await reader.readInt32BE()
      const tempBytes = await reader.read(metadataEntrySize)

      // (1) DRM Type
      // (2) Content Type
      if (metadataEntryType === 1 || metadataEntryType === 2) {
        if (metadataEntryType === 1) metadataMap.set('typeDesc', 'DRM Type')
        else metadataMap.set('typeDesc', 'Content Type')
        metadataMap.set('value', tempBytes.readUInt32BE())
        metadataMap.set('size', 4)
        metadataMap.set('hexSize', 2 + 4 * 2)
        metadataMap.set('binSize', 2 + 4 * 8)
        if (metadataEntrySize > 4) metadataMap.set('unknownBytes', tempBytes.subarray(0x04))
      }

      // (5) MAKE_PACKAGE_NPDRM Revision + Package Version
      else if (metadataEntryType === 5) {
        metadataMap.set('typeDesc', 'MAKE_PACKAGE_NPDRM Revision + Package Version')
        const tempBytesReader = BinaryReader.fromBuffer(tempBytes)
        metadataMap.set('value', await tempBytesReader.read())
        let revision = ''
        let pkgVersion = ''
        await tempBytesReader.close()
        revision += await tempBytesReader.readHex(1, false)
        revision += await tempBytesReader.readHex(1, false)
        pkgVersion += await tempBytesReader.readHex(1, false)
        pkgVersion += `.${await tempBytesReader.readHex(1, false)}`
        metadataMap.set('revision', revision)
        metadataMap.set('version', pkgVersion)
      }

      // (6) TitleID (when size 0xc) (otherwise Version + App Version)
      else if (metadataEntryType === 6 && metadataEntrySize === 0x0c) {
        metadataMap.set('typeDesc', 'Title ID')
        const tempBytesReader = BinaryReader.fromBuffer(tempBytes)
        metadataMap.set('value', await tempBytesReader.readUTF8())
        await tempBytesReader.close()
      }

      // (10) Install Directory
      else if (metadataEntryType === 10) {
        metadataMap.set('typeDesc', 'Install Directory')
        const tempBytesReader = BinaryReader.fromBuffer(tempBytes)
        tempBytesReader.seek(8)
        metadataMap.set('value', await tempBytesReader.readUTF8())
        await tempBytesReader.close()
        metadataMap.set('unknownBytes', tempBytes.subarray(0, 8))
      } else {
        metadataMap.set('typeDesc', metadataEntryType === 3 ? 'Package Type/Flags' : metadataEntryType === 4 ? 'Package Size' : metadataEntryType === 6 ? 'Version + App Version' : metadataEntryType === 7 ? 'QA Digest' : metadataEntryType === 5 ? 'MAKE_PACKAGE_NPDRM Revision' : 'Unknown')
        const tempBytesReader = BinaryReader.fromBuffer(tempBytes)
        const value = await tempBytesReader.read()
        metadataMap.set('value', value)
        await tempBytesReader.close()

        if (metadataEntryType === 4) metadataMap.set('pkgSize', value.readBigUint64BE())
      }

      metadataSize = reader.getOffset - metadataOffset

      metadata.push(Object.fromEntries(metadataMap.entries()) as Record<keyof PKGMetadata, unknown> as PKGMetadata)
    }

    // Content keys
    const keyIndex = 0
    const paramSFO = 'PARAM.SFO'

    const debugXorIV = Buffer.alloc(0x40)
    const digestBuf = Buffer.from(digest, 'hex')
    digestBuf.subarray(0x00, 0x08).copy(debugXorIV, 0x00)
    digestBuf.subarray(0x00, 0x08).copy(debugXorIV, 0x08)
    digestBuf.subarray(0x08, 0x10).copy(debugXorIV, 0x10)
    digestBuf.subarray(0x08, 0x10).copy(debugXorIV, 0x18)
    const xorCtr = new PkgXorSha1Counter(debugXorIV)

    const map = new Map<keyof PKGHeaderData, unknown>()
    map.set('magic', magic)
    map.set('resivion', resivion)
    map.set('pkgType', pkgType)
    map.set('pkgPlatform', pkgPlatform)
    map.set('metadataOffset', metadataOffset)
    map.set('metadataCount', metadataCount)
    map.set('headerSize', headerSize)
    map.set('itemCount', itemCount)
    map.set('totalSize', totalSize)
    map.set('dataOffset', dataOffset)
    map.set('dataSize', dataSize)
    map.set('contentID', contentID)
    map.set('cidTitle1', contentID.slice(7, 16))
    map.set('cidTitle2', contentID.slice(20))
    map.set('digest', digest)
    map.set('dataRIV', dataRIV)
    map.set('metadataSize', metadataSize)
    map.set('keyIndex', keyIndex)
    map.set('pkgDebug', pkgDebug)
    map.set('paramSFO', paramSFO)
    map.set('debugXorIV', debugXorIV.toString('hex'))
    map.set('metadata', metadata)
    map.set('xorCtr', xorCtr)

    return Object.fromEntries(map.entries()) as Record<keyof PKGHeaderData, unknown> as PKGHeaderData
  }

  /**
   * Parses the item entries of a PKG file.
   * - - - -
   * @param {PKGHeaderData} header An object with parsed information of the header from the PKG file.
   * @param {Buffer | BinaryReader} bufferOrReader A `Buffer` of the PKG file or a `BinaryReader` class instantiated to a PKG file.
   * @param {FilePathLikeTypes} [file] `OPTIONAL` The path to the corresponding PKG file that you've working on. This parameter is only used when passing a `BinaryReader` argument to work upon.
   * @returns {Promise<PKGItemEntriesData>}
   */
  static async parsePKGItemEntries(header: PKGHeaderData, bufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes): Promise<PKGItemEntriesData> {
    let reader: BinaryReader
    if (Buffer.isBuffer(bufferOrReader)) reader = BinaryReader.fromBuffer(bufferOrReader)
    else if (file && bufferOrReader instanceof BinaryReader) reader = bufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read Rock Band 3 PKG file or buffer.`)

    const itemEntrySize = 32
    const offset = 0
    let size = header.itemCount * itemEntrySize
    const entriesSize = header.itemCount * itemEntrySize
    let align = calculateAesAlignedOffsetAndSize(offset, size)

    reader.seek(header.dataOffset + align.offset)

    let encryptedData = await reader.read(align.size)
    let decryptedData = header.xorCtr.decrypt(align.offset, encryptedData)

    const itemEntries: PKGItemEntriesMap[] = []
    let offset2 = align.offsetDelta
    let namesOffset: number | null = null
    let nameOffsetEnd: number | null = null
    let itemNameSizeMax = 0

    for (let i = 0; i < header.itemCount; i++) {
      const entryMap = new Map<keyof PKGItemEntriesMap, unknown>()
      const itemEntryReader = BinaryReader.fromBuffer(decryptedData.subarray(offset2, offset2 + itemEntrySize))
      const itemNameOffset = await itemEntryReader.readUInt32BE()
      const itemNameSize = await itemEntryReader.readUInt32BE()
      const itemDataOffset = Number(await itemEntryReader.readUInt64BE())
      const itemDataSize = Number(await itemEntryReader.readUInt64BE())
      const flags = await itemEntryReader.readUInt32BE()
      entryMap.set('name', '')
      entryMap.set('itemNameOffset', itemNameOffset)
      entryMap.set('itemNameSize', itemNameSize)
      entryMap.set('itemDataOffset', itemDataOffset)
      entryMap.set('itemDataSize', itemDataSize)
      entryMap.set('flags', flags)

      const itemAlign = calculateAesAlignedOffsetAndSize(header.dataOffset, header.dataSize)
      if (itemAlign.offsetDelta > 0) throw new Error(`PKG Item Entries Parsing Error: Unaligned encrypted offset ${numberToHexString(header.dataOffset)} - ${numberToHexString(itemAlign.offsetDelta)} = ${numberToHexString(itemAlign.offset)} (+${numberToHexString(header.dataOffset)}) for item #${i.toString()}.`)

      const itemFlags = flags & 0xff

      if (itemFlags == 4 || itemFlags === 18) {
        entryMap.set('isFile', false)
        entryMap.set('isDir', true)
      } else {
        entryMap.set('isFile', true)
        entryMap.set('isDir', false)
      }

      if (itemNameSize > 0) {
        if (namesOffset === null || itemNameOffset < namesOffset) namesOffset = itemNameOffset
        if (nameOffsetEnd === null || itemNameOffset >= nameOffsetEnd) nameOffsetEnd = itemNameOffset + itemNameSize
        if (itemNameSize > itemNameSizeMax) itemNameSizeMax = itemNameSize
      }

      offset2 += itemEntrySize

      await itemEntryReader.close()
      itemEntries.push(Object.fromEntries(entryMap.entries()) as Record<keyof PKGItemEntriesMap, unknown> as PKGItemEntriesMap)
    }

    if (nameOffsetEnd === null || namesOffset === null) throw new Error('PKG Item Entries Parsing Error: Name offset and its end can remain null after iterating through PKG file entries.')

    const namesSize = nameOffsetEnd - namesOffset

    if (namesOffset < entriesSize) throw new Error(`PKG Item Entries Parsing Error: Item Names with offset ${numberToHexString(namesOffset)} are INTERLEAVED with the Item Entries of size ${numberToHexString(entriesSize)}.`)
    else if (namesOffset > entriesSize) throw new Error(`PKG Item Entries Parsing Error: Item Names with offset ${numberToHexString(namesOffset)} are not directly following the Item Entries with size ${numberToHexString(entriesSize)}.`)

    let readSize = namesOffset + namesSize
    if (readSize > size) {
      size = readSize
      align = calculateAesAlignedOffsetAndSize(offset, size)
      const readOffset = align.offset + encryptedData.length
      readSize = align.size - encryptedData.length
      reader.seek(header.dataOffset + readOffset)

      encryptedData = Buffer.concat([encryptedData, await reader.read(readSize)])
      decryptedData = Buffer.concat([decryptedData, encryptedData.subarray(decryptedData.length)])
    } else throw new Error('PKG Item Entries Parsing Error: Read size of names from file entries if smaller than the provided size of buffer.')

    let dlcFolderName = ''
    let i = 0
    for (const entry of itemEntries) {
      const thisIndex = i
      i++
      if (entry.itemNameSize <= 0) continue
      offset2 = offset + entry.itemNameOffset
      const itemAlign = calculateAesAlignedOffsetAndSize(offset2, entry.itemDataSize)
      entry.itemAlign = itemAlign
      if (itemAlign.offsetDelta > 0) throw new Error(`PKG Item Entries Parsing Error: Unaligned encrypted offset ${numberToHexString(offset2)} - ${numberToHexString(itemAlign.offsetDelta)} = ${numberToHexString(itemAlign.offset)} (+${header.dataOffset.toString()}) for item #${thisIndex.toString()}.`)
      offset2 = itemAlign.offset - align.offset
      const decryptXor = header.xorCtr.decrypt(itemAlign.offset, encryptedData.subarray(offset2, offset2 + itemAlign.size))
      decryptXor.copy(decryptedData, offset2)
      const decryptedName = decryptedData.subarray(offset2 + itemAlign.offsetDelta, offset2 + itemAlign.offsetDelta + entry.itemNameSize)
      const decryptedNameReader = BinaryReader.fromBuffer(decryptedName)
      entry.name = await decryptedNameReader.readUTF8()

      const nameSplit = entry.name.split('/')
      if (nameSplit.length > 1 && nameSplit[0] === 'USRDIR') dlcFolderName = nameSplit[1]
      await decryptedNameReader.close()
    }

    const sha256 = createHash(decryptedData)
    const fileOffset = header.dataOffset + offset
    const fileOffsetEnd = fileOffset + size

    const map = new Map<keyof PKGItemEntriesData, unknown>()
    map.set('offset', offset)
    map.set('size', size)
    map.set('entriesSize', entriesSize)
    map.set('namesOffset', namesOffset)
    map.set('namesSize', namesSize)
    map.set('sha256', sha256)
    map.set('fileOffset', fileOffset)
    map.set('fileOffsetEnd', fileOffsetEnd)
    map.set('dlcFolderName', dlcFolderName)
    map.set('items', itemEntries)

    return Object.fromEntries(map.entries()) as Record<keyof PKGItemEntriesData, unknown> as PKGItemEntriesData
  }

  /**
   * Process and decrypt the item entries of the PKG file and returns their Buffers in an array.
   * - - - -
   * @param {PKGHeaderData} pkgFileHeader An object with parsed information of the header from the PKG file.
   * @param {PKGItemEntriesData} pkgFileEntries An object with parsed information of the entries from the PKG file.
   * @param {Buffer | BinaryReader} bufferOrReader A `Buffer` of the PKG file or a `BinaryReader` class instantiated to a PKG file.
   * @param {FilePathLikeTypes} [file] `OPTIONAL` The path to the corresponding PKG file that you've working on. This parameter is only used when passing a `BinaryReader` argument to work upon.
   * @param {string | RegExp} [pathPattern] `OPTIONAL` A pattern.
   * @returns {Promise<Buffer[]>}
   */
  static async processPKGItemEntries(pkgFileHeader: PKGHeaderData, pkgFileEntries: PKGItemEntriesData, bufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes, pathPattern?: string | RegExp): Promise<Buffer[]> {
    let reader: BinaryReader
    if (Buffer.isBuffer(bufferOrReader)) reader = BinaryReader.fromBuffer(bufferOrReader)
    else if (file && bufferOrReader instanceof BinaryReader) reader = bufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read Rock Band 3 PKG file or buffer.`)
    reader.seek(0)
    let itemDataUsage = 0

    const decryptedBytes: Buffer[] = []

    const pattern = pathPattern ? new RegExp(pathPattern) : null
    if (pkgFileEntries.items.length > 0) {
      for (const entry of pkgFileEntries.items) {
        if (pattern && !pattern.test(entry.name)) continue
        const size = entry.itemDataSize
        const align = calculateAesAlignedOffsetAndSize(entry.itemDataOffset, size)
        let dataOffset = align.offset
        let fileOffset = pkgFileHeader.dataOffset + dataOffset
        let restSize = align.size

        let encBytes: Buffer
        let decBytes: Buffer
        // const blockDataOffset = align.offsetDelta
        // let blockDataSizeDelta = 0
        let blockSize = 0
        while (restSize > 0) {
          if (itemDataUsage > 0) blockSize = itemDataUsage
          else blockSize = Math.min(restSize, (Math.floor(Math.random() * (100 - 50 + 1)) + 50) * 0x100000)

          // if (restSize <= blockSize) blockDataSizeDelta = align.sizeDelta - align.offsetDelta
          // const blockDataSize = blockSize - blockDataOffset - blockDataSizeDelta

          reader.seek(fileOffset)
          encBytes = await reader.read(blockSize)
          decBytes = pkgFileHeader.xorCtr.decrypt(dataOffset, encBytes)
          restSize -= blockSize
          fileOffset += blockSize
          dataOffset += blockSize
          itemDataUsage = 0

          const decBytesReader = BinaryReader.fromBuffer(decBytes)
          const content = await decBytesReader.read()
          await decBytesReader.close()
          decryptedBytes.push(content)
        }
      }
    }
    return decryptedBytes
  }

  static async parseFromBuffer(pkgFileBufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes): Promise<PKGData> {
    let reader: BinaryReader
    if (Buffer.isBuffer(pkgFileBufferOrReader)) reader = BinaryReader.fromBuffer(pkgFileBufferOrReader)
    else if (file && pkgFileBufferOrReader instanceof BinaryReader) reader = pkgFileBufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read Rock Band 3 PKG file or buffer.`)
    const header = await this.parsePKGHeader(reader, file)
    const entries = await this.parsePKGItemEntries(header, reader, file)
    const sfoArray = await this.processPKGItemEntries(header, entries, reader, file, /\.(sfo|SFO)$/)
    if (sfoArray.length === 0) throw new Error(`No SFO file was found on ${file ? `provided PKG path "${pathLikeToString(file)}".` : 'provided PKG file buffer.'}`)
    const sfo = await this.parseSFOBuffer(sfoArray[0])
    await reader.close()
    return {
      pkgFilePath: null,
      header,
      entries,
      sfo,
    }
  }

  static async parseFromFile(pkgFilePath: FilePathLikeTypes): Promise<PKGData> {
    const reader = await BinaryReader.fromFile(pkgFilePath)
    return await this.parseFromBuffer(reader, pkgFilePath)
  }

  static async getSongsDTAFromPKGBuffer(pkgFileBufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes): Promise<PartialDTAFile[]> {
    let reader: BinaryReader
    if (Buffer.isBuffer(pkgFileBufferOrReader)) reader = BinaryReader.fromBuffer(pkgFileBufferOrReader)
    else if (file && pkgFileBufferOrReader instanceof BinaryReader) reader = pkgFileBufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read Rock Band 3 PKG file or buffer.`)

    const header = await this.parsePKGHeader(reader, file)
    const entries = await this.parsePKGItemEntries(header, reader, file)
    const dtaArray = await this.processPKGItemEntries(header, entries, reader, file, /\.(dta|DTA)$/)
    if (dtaArray.length === 0) throw new Error(`No DTA file was found on ${file ? `provided PKG path "${pathLikeToString(file)}".` : 'provided PKG file buffer.'}`)
    const dtaFile = DTAParser.fromBuffer(dtaArray[0])
    await reader.close()
    return dtaFile.songs
  }

  static async getSongsDTAFromPKGFile(pkgFilePath: FilePathLikeTypes): Promise<PartialDTAFile[]> {
    const reader = await BinaryReader.fromFile(pkgFilePath)
    return await this.getSongsDTAFromPKGBuffer(reader, pkgFilePath)
  }

  static async calculateHashFromBuffer(pkgFileBufferOrReader: Buffer | BinaryReader, file?: FilePathLikeTypes): Promise<string> {
    let reader: BinaryReader
    if (Buffer.isBuffer(pkgFileBufferOrReader)) reader = BinaryReader.fromBuffer(pkgFileBufferOrReader)
    else if (file && pkgFileBufferOrReader instanceof BinaryReader) reader = pkgFileBufferOrReader
    else throw new Error(`Invalid argument pairs for "bufferOrReader" and "file" provided while trying to read Rock Band 3 PKG file or buffer.`)

    const header = await this.parsePKGHeader(reader, file)
    const entries = await this.parsePKGItemEntries(header, reader, file)
    const dtaArray = await this.processPKGItemEntries(header, entries, reader, file, /\.(dta|DTA)$/)
    if (dtaArray.length === 0) throw new Error(`No DTA file was found on ${file ? `provided PKG path "${pathLikeToString(file)}".` : 'provided PKG file buffer.'}`)
    const dtaFileHash = DTAParser.fromBuffer(dtaArray[0]).calculateHash()

    let i = 0
    let contentHash = ''
    for (const item of entries.items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))) {
      if (item.isDir || !item.name.startsWith('USRDIR')) continue
      const thisIndex = i
      i++
      contentHash += `${thisIndex.toString()} ${item.name} ${item.itemDataSize.toString()}\n`
    }

    await reader.close()
    return dtaFileHash + createHash(contentHash)
  }

  static async calculateHashFromFile(pkgFilePath: FilePathLikeTypes): Promise<string> {
    const reader = await BinaryReader.fromFile(pkgFilePath)
    return await this.calculateHashFromBuffer(reader, pkgFilePath)
  }
}
