import Path from 'path-js'

export type DDSFormatTypes = 'DXT1' | 'DXT5' | 'NORMAL'
export type DDSHeaderTypes = 'UNKNOWN' | 'DXT1' | 'DXT5' | 'NORMAL_MAP'

/**
 * Builds the Harmonix texture file header based on its dimensions and image format.
 * - - - -
 * @param {DDSFormatTypes} format The format of the image.
 * @param {number} width The width of the image.
 * @param {number} height The height of the image.
 * @returns {number[]} A built Harmonix texture file header.
 */
export const buildDDSHeader = (format: DDSFormatTypes, width: number, height: number): number[] => {
  const dds = [0x44, 0x44, 0x53, 0x20, 0x7c, 0x00, 0x00, 0x00, 0x07, 0x10, 0x0a, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4e, 0x45, 0x4d, 0x4f, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x44, 0x58, 0x54, 0x35, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]

  switch (format.toLowerCase()) {
    case 'dxt1':
      dds[87] = 0x31
      break
    case 'dxt3':
      dds[87] = 0x33
      break
    case 'normal':
      dds[84] = 0x41
      dds[85] = 0x54
      dds[86] = 0x49
      dds[87] = 0x32
      break
  }

  switch (height) {
    case 8:
      dds[12] = 0x08
      dds[13] = 0x00
      break
    case 16:
      dds[12] = 0x10
      dds[13] = 0x00
      break
    case 32:
      dds[12] = 0x20
      dds[13] = 0x00
      break
    case 64:
      dds[12] = 0x40
      dds[13] = 0x00
      break
    case 128:
      dds[12] = 0x80
      dds[13] = 0x00
      break
    case 256:
      dds[13] = 0x01
      break
    case 1024:
      dds[13] = 0x04
      break
    case 2048:
      dds[13] = 0x08
      break
  }

  switch (width) {
    case 8:
      dds[16] = 0x08
      dds[17] = 0x00
      break
    case 16:
      dds[16] = 0x10
      dds[17] = 0x00
      break
    case 32:
      dds[16] = 0x20
      dds[17] = 0x00
      break
    case 64:
      dds[16] = 0x40
      dds[17] = 0x00
      break
    case 128:
      dds[16] = 0x80
      dds[17] = 0x00
      break
    case 256:
      dds[17] = 0x01
      break
    case 1024:
      dds[17] = 0x04
      break
    case 2048:
      dds[17] = 0x08
      break
  }

  if (width === height) {
    switch (width) {
      case 8:
        // No mipmaps at this size
        dds[0x1c] = 0x00
        break
      case 16:
        dds[0x1c] = 0x05
        break
      case 32:
        dds[0x1c] = 0x06
        break
      case 64:
        dds[0x1c] = 0x07
        break
      case 128:
        dds[0x1c] = 0x08
        break
      case 256:
        dds[0x1c] = 0x09
        break
      case 1024:
        dds[0x1c] = 0x0b
        break
      case 2048:
        dds[0x1c] = 0x0c
        break
    }
  }
  return dds
}

/**
 * Figures out and builds the right NVIDIA Texture file (`.dds`) to put on the Harmonix texture file.
 * - - - -
 * @param {Uint8Array} fullHeader First 16 bytes of the Harmonix texture file.
 * @param {Uint8Array} shortHeader Bytes 5-16 of the Harmonix texture file.
 *
 * _Some games have a bunch of headers for the same files. Bytes 5-16 has only the dimensions and image format._
 * @returns {Promise<Uint8Array>} A built Harmonix texture file header.
 */
export const getDDSHeader = async (fullHeader: Uint8Array, shortHeader: Uint8Array): Promise<Uint8Array> => {
  let header = buildDDSHeader('DXT1', 256, 256)
  const headerFolderPath = new Path(Path.resolve(process.cwd(), 'src/bin/headers'))
  const headerPaths = await headerFolderPath.readDir(true)
  let ddsFormat: DDSHeaderTypes = 'UNKNOWN'

  for (const headerPath of headerPaths) {
    const headerFilePath = new Path(headerPath)
    const headerName = headerFilePath.name
    const headerBytes = Uint8Array.from(await headerFilePath.readFile())
    if (headerBytes.toString() === fullHeader.toString() || headerBytes.toString() === shortHeader.toString()) {
      ddsFormat = 'DXT5'
      if (headerName.includes('dxt1')) ddsFormat = 'DXT1'
      else if (headerName.includes('normal')) ddsFormat = 'NORMAL_MAP'

      let index1 = headerName.indexOf('_') + 1
      let index2 = headerName.indexOf('x')
      const width = parseInt(headerName.substring(index1, index2))
      index1 = headerName.indexOf('_', index2)
      index2++
      const height = parseInt(headerName.substring(index2, index1))
      header = buildDDSHeader(ddsFormat.toLowerCase().replace('_map', '').toUpperCase() as DDSFormatTypes, width, height)
    }
  }

  return Uint8Array.from(header)
}
