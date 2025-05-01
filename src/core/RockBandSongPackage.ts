import { BinaryReader, BinaryWriter, DirPath, ensurePathIsDir, FilePath, isAbsolute, pathLikeToFilePath, pathLikeToString, resolve, type PathLikeTypes } from 'node-lib'
import { setDefaultOptions } from 'set-default-options'
import { MOGGFile } from '..'
import { compressWithBrotli, decompressBrotli, formatStringFromDTA, type DTAFile } from '../lib'

export interface RockBandSongPackageOptions {
  projectVersion?: number
  projectFolder: PathLikeTypes
  projectName?: string
  midiFile?: string
  pngArtwork?: string
  reaperProj?: string
  miloFile?: string
  moggFile?: string
}

export class RockBandSongPackage {
  static async createBuffer(song: DTAFile, options: RockBandSongPackageOptions): Promise<Buffer> {
    const writer = new BinaryWriter()
    const opts = setDefaultOptions({ projectVersion: 1, projectFolder: '', projectName: '{{title}} - {{artist}}', midiFile: '{{id}}.mid', reaperProj: '{{id}}.rpp', pngArtwork: 'gen/{{id}}_keep.png', miloFile: 'gen/{{id}}.milo_xbox', moggFile: '{{id}}.mogg' }, options)
    const projectFolderPath = formatStringFromDTA(song, pathLikeToString(opts.projectFolder))
    ensurePathIsDir(projectFolderPath)
    const projectFolder = DirPath.of(projectFolderPath)

    // Magic
    writer.writeASCII('RBSP')

    // Song project version
    writer.writeUInt8(opts.projectVersion)

    // Project name size
    const projectName = formatStringFromDTA(song, opts.projectName)
    writer.writeUInt8(projectName.length)

    // Song data size
    const songData = Buffer.from(JSON.stringify(song)).toString('base64')
    writer.writeUInt32LE(songData.length)

    // MIDI file Size
    const midiFormat = formatStringFromDTA(song, opts.midiFile)
    const midiPath = FilePath.of(!isAbsolute(midiFormat) ? resolve(projectFolder.path, formatStringFromDTA(song, opts.midiFile)) : resolve(midiFormat))
    if (!midiPath.exists) throw new Error(`Provided MIDI file ${midiPath.path} does not exists.`)
    if (midiPath.ext !== '.mid') throw new Error(`Provided path ${midiPath.path} is not a valid MIDI file.`)

    const midiContents = await midiPath.read()
    const midi = await compressWithBrotli(midiContents)
    writer.writeUInt32LE(midi.length)

    // Album artwork file size
    let pngArtworkBuffer = Buffer.alloc(0)
    const pngFormat = formatStringFromDTA(song, opts.pngArtwork)
    const pngArtworkPath = FilePath.of(!isAbsolute(pngFormat) ? resolve(projectFolder.path, pngFormat) : resolve(pngFormat))
    if (!pngArtworkPath.exists) {
      // Do nothing, maybe use default image?
    } else {
      if (pngArtworkPath.ext !== '.png') throw new Error(`Provided path ${pngArtworkPath.path} is not a valid PNG file.`)
      pngArtworkBuffer = await pngArtworkPath.read()
    }

    writer.writeUInt32LE(pngArtworkBuffer.length)

    // REAPER project file size
    let reaperProjBuffer = Buffer.alloc(0)
    const reaperFormat = formatStringFromDTA(song, opts.reaperProj)
    const reaperProjPath = FilePath.of(!isAbsolute(reaperFormat) ? resolve(projectFolder.path, reaperFormat) : resolve(reaperFormat))
    if (!reaperProjPath.exists) {
      // Do nothing
    } else {
      if (reaperProjPath.ext !== '.rpp') throw new Error(`Provided path ${pngArtworkPath.path} is not a valid REAPER Project file.`)
      const reaperProjContents = await reaperProjPath.read()
      reaperProjBuffer = await compressWithBrotli(reaperProjContents)
    }

    writer.writeUInt32LE(reaperProjBuffer.length)

    // MILO file size
    let miloFileBuffer = Buffer.alloc(0)
    const miloFormat = formatStringFromDTA(song, opts.miloFile)
    const miloFilePath = FilePath.of(!isAbsolute(miloFormat) ? resolve(projectFolder.path, midiFormat) : resolve(miloFormat))
    if (!miloFilePath.exists) {
      // Do nothing
    } else {
      if (miloFilePath.ext !== '.milo_xbox' && miloFilePath.ext !== '.milo_ps3') throw new Error(`Provided path ${miloFilePath.path} is not a valid MILO file.`)
      const miloFileContents = await miloFilePath.read()
      miloFileBuffer = await compressWithBrotli(miloFileContents)
    }

    writer.writeUInt32LE(miloFileBuffer.length)

    // MOGG file size
    let moggFileBuffer = Buffer.alloc(0)
    let tempMogg: FilePath | null = null
    const moggFormat = formatStringFromDTA(song, opts.moggFile)
    const moggFilePath = FilePath.of(!isAbsolute(moggFormat) ? resolve(projectFolder.path, moggFormat) : resolve(moggFormat))
    if (!moggFilePath.exists) {
      // Do nothing
    } else {
      if (moggFilePath.ext !== '.mogg') throw new Error(`Provided path ${moggFilePath.path} is not a valid MOGG file.`)
      const mogg = new MOGGFile(moggFilePath)
      if (await mogg.isEncrypted()) {
        const decMogg = await mogg.decrypt()
        tempMogg = decMogg.path
        moggFileBuffer = await decMogg.path.read()
      } else {
        moggFileBuffer = await moggFilePath.read()
      }
      if (tempMogg) await tempMogg.delete()
    }

    writer.writeUInt32LE(moggFileBuffer.length)

    // Project name
    writer.writeUTF8(projectName)

    // Song data
    writer.write(songData)

    // MIDI file
    writer.write(midi)

    // Album artwork
    writer.write(pngArtworkBuffer)

    if (reaperProjBuffer.length > 0) writer.write(reaperProjBuffer)

    if (miloFileBuffer.length > 0) writer.write(miloFileBuffer)

    if (moggFileBuffer.length > 0) writer.write(moggFileBuffer)

    return writer.toBuffer()
  }

  static async createFile(song: DTAFile, destPath: PathLikeTypes, options: RockBandSongPackageOptions): Promise<FilePath> {
    const dest = pathLikeToFilePath(destPath).changeFileExt('.bin')
    await dest.delete()
    return dest.write(await this.createBuffer(song, options))
  }

  static async parseHeaderBuffer(buffer: Buffer | BinaryReader, file?: PathLikeTypes) {
    let filePath: FilePath | undefined
    if (file) filePath = pathLikeToFilePath(file)
    let reader: BinaryReader
    if (Buffer.isBuffer(buffer)) reader = BinaryReader.fromBuffer(buffer)
    if (file && buffer instanceof BinaryReader) reader = buffer
    else throw new Error('Unimplemented Exception.')

    if ((await reader.readASCII(4)) !== 'RBSP') {
      if (filePath && file) throw new Error(`Provided file ${filePath.path} has invalid signature.`)
      throw new Error(`Provided buffer has invalid signature.`)
    }
    const version = await reader.readUInt8()
    const projectNameSize = await reader.readUInt8()
    const songDataSize = await reader.readUInt32LE()
    const midiFileSize = await reader.readUInt32LE()
    const albumArtworkSize = await reader.readUInt32LE()
    const reaperProjSize = await reader.readUInt32LE()
    const miloFileSize = await reader.readUInt32LE()
    const moggFileSize = await reader.readUInt32LE()
    const projectName = await reader.readUTF8(projectNameSize)
    const songData = JSON.parse(Buffer.from((await reader.read(songDataSize)).toString(), 'base64').toString()) as DTAFile

    return {
      version,
      projectNameSize,
      songDataSize,
      midiFileSize,
      albumArtworkSize,
      reaperProjSize,
      miloFileSize,
      moggFileSize,
      projectName,
      songData,
    }
  }

  static async parseHeaderFile(filePath: PathLikeTypes) {
    const path = pathLikeToFilePath(filePath)
    const reader = await BinaryReader.fromFile(filePath)
    const header = await this.parseHeaderBuffer(reader, path)
    await reader.close()
    return header
  }

  static async parseBuffer(buffer: Buffer | BinaryReader, file?: PathLikeTypes) {
    let filePath: FilePath | undefined
    if (file) filePath = pathLikeToFilePath(file)
    let reader: BinaryReader
    if (Buffer.isBuffer(buffer)) reader = BinaryReader.fromBuffer(buffer)
    if (file && buffer instanceof BinaryReader) reader = buffer
    else throw new Error('Unimplemented Exception.')

    const header = await this.parseHeaderBuffer(reader, file)
    const contents = new Map<string, Buffer>()
    contents.set('midiFile', await decompressBrotli(await reader.read(header.midiFileSize)))
    if (header.albumArtworkSize > 0) contents.set('albumArtwork', await reader.read(header.albumArtworkSize))
    if (header.reaperProjSize > 0) contents.set('reaperProj', await decompressBrotli(await reader.read(header.reaperProjSize)))
    if (header.miloFileSize > 0) contents.set('miloFile', await decompressBrotli(await reader.read(header.miloFileSize)))
    if (header.moggFileSize > 0) contents.set('moggFile', await reader.read(header.moggFileSize))

    await reader.close()

    return {
      header,
      contents: Object.fromEntries(contents.entries()),
    }
  }

  static async parseFile(filePath: PathLikeTypes) {
    const path = pathLikeToFilePath(filePath)
    const reader = await BinaryReader.fromFile(filePath)
    return await this.parseBuffer(reader, path)
  }
}
