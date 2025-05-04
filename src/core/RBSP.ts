import { BinaryReader, BinaryWriter, compressWithBrotli, decompressBrotli, DirPath, ensurePathIsDir, FilePath, formatNumberWithDots, isAbsolute, pathLikeToFilePath, pathLikeToString, resolve, type PathLikeTypes } from 'node-lib'
import { setDefaultOptions } from 'set-default-options'
import type { RequiredDeep } from 'type-fest'
import { formatStringFromDTA, type DTAFile } from '../lib.exports'
import { MOGGFile } from './MOGGFile'

export interface RockBandSongPackageOptionsObject {
  /**
   * The path where all (or most of the project files) is found. With this you can use relative paths on all the other option parameters and they will be resolved from this path.
   */
  packageFolder: string
  /**
   * The package version to append to the RBSP file. Default is `1`.
   */
  version?: number
  /**
   * The name of package. Default is `'[Song title] - [Song artist/band]'`.
   */
  packageName?: string
  /**
   * The path of the Markdown file to append to the RBSP file. Default is `null` (no file).
   */
  markdownFile?: string | null
  /**
   * The path of the MIDI file to append to the RBSP file. Default is `'[Package folder]/[Song shortname].mid'`.
   */
  midiFile: string
  /**
   * The path of the album artwork file to append to the RBSP file. Default is `null`.
   */
  albumArtworkFile?: string | null
  /**
   * The path of the REAPER project file to append to the RBSP file. Default is `null` (no file).
   */
  reaperProjFile?: string | null
  /**
   * The path of the song's MILO file to append to the RBSP file. Default is `null` (no file).
   */
  miloFile?: string | null
  /**
   * The path of the song's MOGG file to append to the RBSP file. Default is `null` (no file).
   */
  moggFile?: string | null
}

export interface RockBandSongPackageHeader {
  /**
   * The version of the song package.
   */
  version: number
  /**
   * The length of the package name.
   */
  packageNameLength: number
  /**
   * The size of the song data Base64 string.
   */
  songDataSize: number
  /**
   * The size of the markdown file Base64 string.
   */
  markdownFileSize: number
  /**
   * The size of the MIDI file of the song, compressed using Brotli.
   */
  midiFileSize: number
  /**
   * The size of the album artwork of the song, compressed using Brotli.
   */
  albumArtworkSize: number
  /**
   * The size of the REAPER Project of the song, compressed using Brotli.
   */
  reaperProjFileSize: number
  /**
   * The size of the MILO file of the song.
   */
  miloFileSize: number
  /**
   * The size of the MOGG file of the song.
   */
  moggFileSize: number
}

export interface RockBandSongPackageParsedObject extends RockBandSongPackageHeader {
  /**
   * The package name.
   */
  name: string
  /**
   * The song data.
   */
  data: DTAFile
  /**
   * The markdown file content.
   */
  markdown?: string
  /**
   * The song's MIDI file buffer.
   */
  midi: Buffer
  /**
   * The song's album artwork buffer.
   */
  albumArt?: Buffer
  /**
   * The song's REAPER file buffer.
   */
  reaper?: Buffer
  /**
   * The song's MILO file buffer.
   */
  milo?: Buffer
  /**
   * The song's MOGG file buffer.
   */
  mogg?: Buffer
}

/**
 * A class with static methods to create and parse Rock Band Song Package files.
 * - - - -
 */
export class RockBandSongPackage {
  /**
   * Iterates through every key of `opts` and format all `string` values with values from `song`, if necessary.
   * - - - -
   * @param {DTAFile} song A parsed song data object.
   * @param {RequiredDeep<RockBandSongPackageOptionsObject>} opts The options object to format its string values.
   * @returns {RequiredDeep<RockBandSongPackageOptionsObject>}
   */
  private static formatStringFromCreateOptionsObject(song: DTAFile, opts: RequiredDeep<RockBandSongPackageOptionsObject>): RequiredDeep<RockBandSongPackageOptionsObject> {
    const newOpts = new Map<keyof RequiredDeep<RockBandSongPackageOptionsObject>, RockBandSongPackageOptionsObject[keyof RockBandSongPackageOptionsObject]>()

    for (const key of Object.keys(opts) as (keyof RequiredDeep<RockBandSongPackageOptionsObject>)[]) {
      const value = opts[key]
      if (typeof value !== 'string') {
        newOpts.set(key, value)
        continue
      }
      newOpts.set(key, formatStringFromDTA(song, value))
      continue
    }

    return Object.fromEntries(newOpts.entries()) as RequiredDeep<RockBandSongPackageOptionsObject>
  }

  /**
   * Creates a new Rock Band Song Package file buffer.
   * - - - -
   * @param {DTAFile} song A parsed song data object.
   * @param {RockBandSongPackageOptionsObject} options An object that changes the contents of the new RBSP file.
   * @returns {Promise<Buffer>} The Buffer of the new RBSP file.
   */
  static async createBuffer(song: DTAFile, options: RockBandSongPackageOptionsObject): Promise<Buffer> {
    const writer = new BinaryWriter()
    const opts = this.formatStringFromCreateOptionsObject(
      song,
      setDefaultOptions(
        {
          packageFolder: '',
          version: 1,
          packageName: '{{title}} - {{artist}}',
          markdownFile: null,
          midiFile: '{{id}}.mid',
          albumArtworkFile: null,
          reaperProjFile: null,
          miloFile: null,
          moggFile: null,
        },
        options
      )
    )

    const packageFolderPath = formatStringFromDTA(song, pathLikeToString(opts.packageFolder))
    ensurePathIsDir(packageFolderPath)
    const packageFolder = DirPath.of(packageFolderPath)

    const songDataBuffer = Buffer.from(JSON.stringify(song)).toString('base64')

    if (opts.version > 0xff) throw new Error(`The package version can't be greater than 255. Provided value: ${opts.version.toString()}.`)
    if (opts.packageName.length > 0xff) throw new Error(`The package name can't be greater than 255 characters. Provided value: ${opts.version.toString()}.`)
    if (songDataBuffer.length > 0xffff) throw new Error(`The package song data Base64 string is bigger than the maximum value compatible to the RBSP file.`)

    // File signature
    writer.writeASCII('RBSP')
    // Package version
    writer.writeUInt8(opts.version)
    // Package name length
    writer.writeUInt8(opts.packageName.length)
    // Song data size
    writer.writeUInt16LE(songDataBuffer.length)

    // Markdown file size
    let markdownFileBuffer = ''
    if (opts.markdownFile) {
      const readmePath = FilePath.of(!isAbsolute(opts.markdownFile) ? resolve(packageFolder.path, opts.markdownFile) : resolve(opts.markdownFile))
      if (!readmePath.exists) throw new Error(`Provided Markdown file ${readmePath.path} does not exists.`)
      if (readmePath.ext !== '.md') throw new Error(`Provided file ${readmePath.path} is not a valid Markdown file.`)
      if (readmePath.statSync().size > 0x100000) throw new Error(`Provided Markdown file ${readmePath.path} is larger than 1MB. Provide a smaller Markdown file to append to the RBSP file.`)

      markdownFileBuffer = (await readmePath.read()).toString('base64')
      if (markdownFileBuffer.length > 0xffffff) throw new Error(`The package markdown Base64 string is bigger than the maximum value compatible to the RBSP file.`)
    }
    writer.writeUInt24LE(markdownFileBuffer.length)

    // MIDI file size
    const midiPath = FilePath.of(!isAbsolute(opts.midiFile) ? resolve(packageFolder.path, opts.midiFile) : resolve(opts.midiFile))
    if (!midiPath.exists) throw new Error(`Provided MIDI file ${midiPath.path} does not exists.`)
    if (midiPath.ext !== '.mid') throw new Error(`Provided file ${midiPath.path} is not a valid MIDI file.`)
    if (midiPath.statSync().size > 0x100000) throw new Error(`Provided MIDI file ${midiPath.path} is larger than 1MB. Provide a smaller MIDI file to append to the RBSP file.`)

    const midiContents = await midiPath.read()
    const midiBuffer = await compressWithBrotli(midiContents)
    const midiLength = midiBuffer.length
    writer.writeUInt24LE(midiLength)

    // Album artwork file size
    let albumArtworkBuffer = Buffer.alloc(0)
    if (opts.albumArtworkFile) {
      const albumArtworkPath = FilePath.of(!isAbsolute(opts.albumArtworkFile) ? resolve(packageFolder.path, opts.albumArtworkFile) : resolve(opts.albumArtworkFile))
      if (!albumArtworkPath.exists) throw new Error(`Provided album artwork file ${albumArtworkPath.path} does not exists.`)
      if (albumArtworkPath.ext !== '.png') throw new Error(`Provided file ${albumArtworkPath.path} is not a valid album artwork file.`)
      if (albumArtworkPath.statSync().size > 0x200000) throw new Error(`Provided album artwork file ${albumArtworkPath.path} is larger than 2MB. Provide a smaller REAPER Project file to append to the RBSP file.`)

      const albumArtworkContents = await albumArtworkPath.read()
      albumArtworkBuffer = await compressWithBrotli(albumArtworkContents)
    }
    writer.writeUInt24LE(albumArtworkBuffer.length)

    // REAPER project file size
    let reaperProjBuffer = Buffer.alloc(0)
    if (opts.reaperProjFile) {
      const reaperProjPath = FilePath.of(!isAbsolute(opts.reaperProjFile) ? resolve(packageFolder.path, opts.reaperProjFile) : resolve(opts.reaperProjFile))
      if (!reaperProjPath.exists) throw new Error(`Provided REAPER Project file ${reaperProjPath.path} does not exists.`)
      if (reaperProjPath.ext !== '.rpp') throw new Error(`Provided file ${reaperProjPath.path} is not a valid REAPER Project file.`)
      if (reaperProjPath.statSync().size > 0x400000) throw new Error(`Provided REAPER Project file ${reaperProjPath.path} is larger than 4MB. Provide a smaller REAPER Project file to append to the RBSP file.`)

      const reaperProjContents = await reaperProjPath.read()
      reaperProjBuffer = await compressWithBrotli(reaperProjContents)
    }
    writer.writeUInt24LE(reaperProjBuffer.length)

    // Song MILO file size
    let miloFileBuffer = Buffer.alloc(0)
    if (opts.miloFile) {
      const miloFilePath = FilePath.of(!isAbsolute(opts.miloFile) ? resolve(packageFolder.path, opts.miloFile) : resolve(opts.miloFile))
      if (!miloFilePath.exists) throw new Error(`Provided MILO file ${miloFilePath.path} does not exists.`)
      if (miloFilePath.ext !== '.milo_ps3' && miloFilePath.ext !== '.milo_xbox') throw new Error(`Provided file ${miloFilePath.path} is not a valid MILO file.`)
      if (miloFilePath.statSync().size > 0xffffff) throw new Error(`Provided MILO file ${miloFilePath.path} is larger than 16MB. Provide a smaller MILO file to append to the RBSP file.`)

      miloFileBuffer = await miloFilePath.read()
    }
    writer.writeUInt24LE(miloFileBuffer.length)

    // Song MOGG file size
    let moggFileBuffer = Buffer.alloc(0)
    let tempMogg: MOGGFile | undefined
    if (opts.moggFile) {
      const moggFilePath = FilePath.of(!isAbsolute(opts.moggFile) ? resolve(packageFolder.path, opts.moggFile) : resolve(opts.moggFile))

      if (!moggFilePath.exists) throw new Error(`Provided MOGG file ${moggFilePath.path} does not exists.`)
      if (moggFilePath.ext !== '.mogg') throw new Error(`Provided file ${moggFilePath.path} is not a valid MOGG file.`)

      const mogg = new MOGGFile(moggFilePath)
      if (await mogg.isEncrypted()) {
        const decMogg = await mogg.decrypt()
        tempMogg = decMogg
        moggFileBuffer = await decMogg.path.read()
      } else {
        moggFileBuffer = await mogg.path.read()
      }

      if (tempMogg) await tempMogg.path.delete()
    }
    writer.writeUInt32LE(moggFileBuffer.length)

    writer.writeUTF8(opts.packageName)
    writer.write(songDataBuffer)
    if (markdownFileBuffer.length > 0) writer.write(markdownFileBuffer)
    writer.write(midiBuffer)
    if (albumArtworkBuffer.length > 0) writer.write(albumArtworkBuffer)
    if (reaperProjBuffer.length > 0) writer.write(reaperProjBuffer)
    if (miloFileBuffer.length > 0) writer.write(miloFileBuffer)
    if (moggFileBuffer.length > 0) writer.write(moggFileBuffer)

    return writer.toBuffer()
  }

  /**
   * Parses the header of a Rock Song Package File buffer.
   * - - - -
   * @param {Buffer | BinaryReader} bufferOrReader A `Buffer` of the RBSP file or a `BinaryReader` class instantiated to a RBSP file.
   * @param {PathLikeTypes | undefined} [file] `OPTIONAL` The path to the corresponding RBSP file that you've working on. This parameter is only used when passing a `BinaryReader` argument to work upon.
   * @returns {Promise<RockBandSongPackageHeader>} An object with all information found on the RBSP file header.
   */
  static async parseBufferHeader(bufferOrReader: Buffer | BinaryReader, file?: PathLikeTypes): Promise<RockBandSongPackageHeader> {
    let filePath: FilePath | undefined
    if (file) filePath = pathLikeToFilePath(file)

    let reader: BinaryReader
    if (Buffer.isBuffer(bufferOrReader)) reader = BinaryReader.fromBuffer(bufferOrReader)
    else if (file && bufferOrReader instanceof BinaryReader) reader = bufferOrReader
    else throw new Error('Unimplemented Exception.')

    if ((await reader.readASCII(4)) === 'ASCII') {
      if (filePath) throw new Error(`Provided file ${filePath.path} has invalid signature.`)
      throw new Error(`Provided RBSP file buffer has invalid signature.`)
    }
    const map = new Map<keyof RockBandSongPackageHeader, any>()

    map.set('version', await reader.readUInt8())
    map.set('packageNameLength', await reader.readUInt8())
    map.set('songDataSize', await reader.readUInt16LE())
    map.set('markdownFileSize', await reader.readUInt24LE())
    map.set('midiFileSize', await reader.readUInt24LE())
    map.set('albumArtworkSize', await reader.readUInt24LE())
    map.set('reaperProjFileSize', await reader.readUInt24LE())
    map.set('miloFileSize', await reader.readUInt24LE())
    map.set('moggFileSize', await reader.readUInt32LE())

    return Object.fromEntries(map.entries()) as RockBandSongPackageHeader
  }

  /**
   * Parses a Rock Song Package File buffer header and its contents.
   * - - - -
   * @param {Buffer | BinaryReader} bufferOrReader A `Buffer` of the RBSP file or a `BinaryReader` class instantiated to a RBSP file.
   * @param {PathLikeTypes | undefined} [file] `OPTIONAL` The path to the corresponding RBSP file that you've working on. This parameter is only used when passing a `BinaryReader` argument to work upon.
   * @returns {Promise<RockBandSongPackageParsedObject>} An object with all parsed data from the RBSP file.
   */
  static async parseBuffer(bufferOrReader: Buffer | BinaryReader, file?: PathLikeTypes): Promise<RockBandSongPackageParsedObject> {
    let reader: BinaryReader
    if (Buffer.isBuffer(bufferOrReader)) reader = BinaryReader.fromBuffer(bufferOrReader)
    else if (file && bufferOrReader instanceof BinaryReader) reader = bufferOrReader
    else throw new Error('Unimplemented Exception.')

    const header = await this.parseBufferHeader(reader, file)
    const contents = new Map<keyof RockBandSongPackageParsedObject, any>()
    contents.set('name', await reader.readUTF8(header.packageNameLength))
    contents.set('data', JSON.parse(Buffer.from(await reader.readString(header.songDataSize), 'base64').toString()))
    if (header.markdownFileSize) contents.set('markdown', Buffer.from(await reader.readString(header.songDataSize), 'base64').toString())
    contents.set('midi', await decompressBrotli(await reader.read(header.midiFileSize)))
    if (header.albumArtworkSize) contents.set('albumArt', await decompressBrotli(await reader.read(header.albumArtworkSize)))
    if (header.reaperProjFileSize) contents.set('reaper', await decompressBrotli(await reader.read(header.reaperProjFileSize)))
    if (header.miloFileSize) contents.set('milo', await reader.read(header.miloFileSize))
    if (header.moggFileSize) contents.set('mogg', await reader.read(header.moggFileSize))

    await reader.close()

    return {
      ...header,
      ...Object.fromEntries(contents.entries()),
    } as RockBandSongPackageParsedObject
  }

  /**
   * Creates a new Rock Band Song Package file.
   * - - - -
   * @param {PathLikeTypes} destPath The destination path of the new RBSP file.
   * @param {DTAFile} song A parsed song data object.
   * @param {RockBandSongPackageOptionsObject} options An object that changes the contents of the new RBSP file.
   * @returns {Promise<FilePath>} A `FilePath` class pointing to the new RBSP file.
   */
  static async createFile(destPath: PathLikeTypes, song: DTAFile, options: RockBandSongPackageOptionsObject): Promise<FilePath> {
    const dest = pathLikeToFilePath(destPath)
    const buf = await this.createBuffer(song, options)
    return await dest.write(buf)
  }

  /**
   * Parses the header of a Rock Song Package File.
   * - - - -
   * @param {PathLikeTypes} srcPath The path to a RBSP file.
   * @returns {Promise<RockBandSongPackageHeader>} An object with all information found on the RBSP file header.
   */
  static async parseFileHeader(srcPath: PathLikeTypes): Promise<RockBandSongPackageHeader> {
    const reader = await BinaryReader.fromFile(srcPath)
    const header = await this.parseBufferHeader(reader, srcPath)
    await reader.close()
    return header
  }

  /**
   * Parses a Rock Song Package File header and its contents.
   * - - - -
   * @param {PathLikeTypes} srcPath The path to a RBSP file.
   * @returns {Promise<RockBandSongPackageParsedObject>} An object with all parsed data from the RBSP file.
   */
  static async parseFile(srcPath: PathLikeTypes): Promise<RockBandSongPackageParsedObject> {
    const reader = await BinaryReader.fromFile(srcPath)
    const content = await this.parseBuffer(reader, srcPath)
    return content
  }
}
