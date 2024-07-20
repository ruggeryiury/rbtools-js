import Path from 'path-js'
import type { ArtworkInterpolationTypes, ArtworkSizeTypes } from '../artwork.js'
import { execPromise } from '../utils.js'

export interface ImageConverterMethodsObject {
  /**
   * The path to the Image Converter Python script.
   */
  imgConvPath: Path
  /**
   * The path to the NVIDIA Texture Tools compress executable.
   */
  nvCompressPath: Path
  /**
   * The path to the NVIDIA Texture Tools decompress executable.
   */
  nvDecompressPath: Path
  /**
   * The path to the Wiimms Image Tool executable.
   */
  wimgtPath: Path
  /**
   * Executes a python script to convert image files.
   * - - - -
   * @param {string} path The path of the source image file to be converted.
   * @param {string} dest The destination path of the converted image file.
   * @param {ArtworkSizeTypes | [ArtworkSizeTypes, ArtworkSizeTypes]} textureSize The size of the image file.
   * @param {ArtworkInterpolationTypes} interpolation The interpolation method to be used if rescaling.
   * @param {number | undefined} quality `OPTIONAL` The quality of the converted image file. Only used when converting to lossy formats, like JPEG and WEBP. Default is `100` (Highest quality).
   * @returns {Promise<string>} The destination path of the converted image file.
   */
  exec: (path: string, dest: string, textureSize: ArtworkSizeTypes | [ArtworkSizeTypes, ArtworkSizeTypes], interpolation: ArtworkInterpolationTypes, quality?: number) => Promise<string>
  /**
   * Executes the NVIDIA Texture Tools to encode a TGA image file to DDS texture file.
   * - - - -
   * @param {string} tgaPath The path of the TGA file to be converted.
   * @param {string} ddsPath The destination path of the generated DDS file.
   * @param {boolean | undefined} DTX5 `OPTIONAL` Uses DTX5 encoding on the NVIDIA encoding process. Default is `true`.
   * @returns {Promise<string>} The path of the generated DDS file.
   */
  nvCompress: (tgaPath: string, ddsPath: string, DTX5?: boolean) => Promise<string>
  /**
   * Executes the NVIDIA Texture Tools to decode a DDS file to TGA file.
   * - - - -
   * @param {string} ddsPath The path of the DDS file to be converted.
   * @returns {Promise<string>} The path of the generated TGA file.
   */
  nvDecompress: (ddsPath: string) => Promise<string>
  /**
   * Executes the Wiimms Image Tool to encode a PNG file to TPL texture file.
   * - - - -
   * @param {string} tempPngPath The path of the PNG file to be converted.
   * @param {string} tplPath The destination path of the generated TPL file.
   * @returns {Promise<string>} The path of the generated TPL file.
   */
  wimgtEncode: (tempPngPath: string, tplPath: string) => Promise<string>
  /**
   * Executes the Wiimms Image Tool to decode a TPL texture file to PNG file.
   * - - - -
   * @param {string} tempPngPath The path of the TPL file to be converted.
   * @param {string} tplPath The destination path of the generated PNG file.
   * @returns {Promise<string>} The path of the generated PNG file.
   */
  wimgtDecode: (tplPath: string, destPath: string) => Promise<string>
}
/**
 *
 */
export const imgConv: ImageConverterMethodsObject = {
  imgConvPath: new Path(Path.resolve(process.cwd(), `src/python/image_converter.py`)),

  nvCompressPath: new Path(Path.resolve(process.cwd(), 'src/bin/nvcompress.exe')),

  nvDecompressPath: new Path(Path.resolve(process.cwd(), 'src/bin/nvdecompress.exe')),

  wimgtPath: new Path(Path.resolve(process.cwd(), 'src/bin/wimgt.exe')),

  exec: async (path, dest, textureSize, interpolation, quality = 100): Promise<string> => {
    let width: ArtworkSizeTypes, height: ArtworkSizeTypes
    if (Array.isArray(textureSize)) {
      width = textureSize[0]
      height = textureSize[1]
    } else {
      width = textureSize
      height = textureSize
    }
    const command = `python ${imgConv.imgConvPath.fullname} "${path}" "${dest}" -x ${width.toString()} -y ${height.toString()} -i ${interpolation.toUpperCase()} -q ${quality.toString()}`
    const exec = await execPromise(command, {
      cwd: imgConv.imgConvPath.root,
      windowsHide: true,
    })
    if (exec.stderr) throw new Error(exec.stderr)
    if (exec.stdout.startsWith('ImageConverterError')) throw new Error(exec.stdout)
    return exec.stdout
  },

  nvCompress: async (tgaPath, ddsPath, DTX5 = true) => {
    const command = `${imgConv.nvCompressPath.fullname} -nomips -nocuda ${DTX5 ? ' -bc3' : ' -bc1'} "${tgaPath}" "${ddsPath}"`
    const exec = await execPromise(command, { cwd: imgConv.nvCompressPath.root, windowsHide: true })
    return exec.stdout
  },

  nvDecompress: async (ddsPath) => {
    const command = `${imgConv.nvDecompressPath.fullname} "${ddsPath}"`
    const exec = await execPromise(command, { cwd: imgConv.nvDecompressPath.root, windowsHide: true })
    return exec.stdout
  },

  wimgtEncode: async (tempPngPath, tplPath) => {
    const command = `${imgConv.wimgtPath.fullname} -d "${tplPath}" ENC -x TPL.CMPR "${tempPngPath}"`
    const exec = await execPromise(command, { cwd: imgConv.wimgtPath.root, windowsHide: true })
    return exec.stdout
  },

  wimgtDecode: async (tplPath, destPath) => {
    const command = `${imgConv.wimgtPath.fullname} -d "${destPath}" DEC -x TPL.CMPR "${tplPath}"`
    const exec = await execPromise(command, { cwd: imgConv.wimgtPath.root, windowsHide: true })
    return exec.stdout
  },
}
