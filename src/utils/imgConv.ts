import Path from 'path-js'
import type { ArtworkInterpolationTypes, ArtworkSizeTypes } from '../artwork.js'
import { getRBToolsJSPath } from '../index.js'
import { execPromise } from '../utils.js'

export interface ImageConverterMethodsObject {
  /**
   * The path to the Image Converter Python script.
   */
  imgConvPath: Path
  /**
   * The path to the Image Converter to Base64-encoded DataURL Python script .
   */
  imgConvDataURLBase64Path: Path
  /**
   * The path to the Get Image Size Python script.
   */
  imgConvGetImageSizePath: Path
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
   * @param {string} src The path of the source image file to be converted.
   * @param {string} dest The destination path of the converted image file.
   * @param {ArtworkSizeTypes | 8 | 16 | 32 | 64 | [ArtworkSizeTypes | 8 | 16 | 32 | 64, ArtworkSizeTypes | 8 | 16 | 32 | 64]} textureSize The size of the image file.
   * @param {ArtworkInterpolationTypes} interpolation The interpolation method to be used if rescaling.
   * @param {number | undefined} quality `OPTIONAL` The quality of the converted image file. Only used when converting to lossy formats, like JPEG and WEBP. Default is `100` (Highest quality).
   * @returns {Promise<string>} The destination path of the converted image file.
   */
  exec: (src: string, dest: string, textureSize: ArtworkSizeTypes | 8 | 16 | 32 | 64 | [ArtworkSizeTypes | 8 | 16 | 32 | 64, ArtworkSizeTypes | 8 | 16 | 32 | 64], interpolation: ArtworkInterpolationTypes, quality?: number) => Promise<string>
  /**
   * Executes a python script to convert image files to a Base64-encoded DataURL string in WEBP format.
   * - - - -
   * @param {string} src The path of the source image file to be converted.
   * @param {ArtworkSizeTypes | 8 | 16 | 32 | 64 | [ArtworkSizeTypes | 8 | 16 | 32 | 64, ArtworkSizeTypes | 8 | 16 | 32 | 64]} textureSize The size of the image file.
   * @param {ArtworkInterpolationTypes} interpolation The interpolation method to be used if rescaling.
   * @param {number | undefined} quality `OPTIONAL` The quality of the converted image file. Only used when converting to lossy formats, like JPEG and WEBP. Default is `90`.
   * @returns {Promise<string>} A Base64-encoded DataURL string of the image in WEBP format.
   */
  execDataURLBase64: (src: string, textureSize: ArtworkSizeTypes | [ArtworkSizeTypes, ArtworkSizeTypes], interpolation: ArtworkInterpolationTypes, quality?: number) => Promise<string>
  /**
   * Executes a python script to check any image file width and height.
   * - - - -
   * @param {string} src The path of the source image file to be checked.
   * @returns {Promise<[number,number]>} An array with the width and height of the image
   */
  execGetImageSize: (src: string) => Promise<[number, number]>
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
 * An object with methods that redirects to every external script or CLI used on the module.
 */
export const imgConv: ImageConverterMethodsObject = {
  imgConvPath: new Path(Path.resolve(getRBToolsJSPath(), 'python/image_converter.py')),

  imgConvDataURLBase64Path: new Path(Path.resolve(getRBToolsJSPath(), 'python/image_converter_dataurl_base64.py')),

  imgConvGetImageSizePath: new Path(Path.resolve(getRBToolsJSPath(), 'python/get_image_size.py')),

  nvCompressPath: new Path(Path.resolve(getRBToolsJSPath(), 'bin/nvcompress.exe')),

  nvDecompressPath: new Path(Path.resolve(getRBToolsJSPath(), 'bin/nvdecompress.exe')),

  wimgtPath: new Path(Path.resolve(getRBToolsJSPath(), 'bin/wimgt.exe')),

  exec: async (src, dest, textureSize, interpolation, quality = 100): Promise<string> => {
    if (quality <= 0 || quality > 100) throw new Error(`ImageConverterError: The quality of the file must be a number between 1 and 100 (Given quality "${quality.toString()}")`)
    let width: ArtworkSizeTypes | 8 | 16 | 32 | 64, height: ArtworkSizeTypes | 8 | 16 | 32 | 64
    if (Array.isArray(textureSize)) {
      width = textureSize[0]
      height = textureSize[1]
    } else {
      width = textureSize
      height = textureSize
    }
    const command = `python "${imgConv.imgConvPath.fullname}" "${src}" "${dest}" -x ${width.toString()} -y ${height.toString()} -i ${interpolation.toUpperCase()} -q ${quality.toString()}`
    const exec = await execPromise(command, {
      cwd: imgConv.imgConvPath.root,
      windowsHide: true,
    })
    if (exec.stderr) throw new Error(exec.stderr)
    if (exec.stdout.startsWith('ImageConverterError')) throw new Error(exec.stdout)
    return dest
  },

  execDataURLBase64: async (src, textureSize, interpolation, quality = 90) => {
    if (quality <= 0 || quality > 100) throw new Error(`ImageConverterError: The quality of the file must be a number between 1 and 100 (Given quality "${quality.toString()}")`)
    let width: ArtworkSizeTypes, height: ArtworkSizeTypes
    if (Array.isArray(textureSize)) {
      width = textureSize[0]
      height = textureSize[1]
    } else {
      width = textureSize
      height = textureSize
    }
    const command = `python "${imgConv.imgConvDataURLBase64Path.fullname}" "${src}" -x ${width.toString()} -y ${height.toString()} -i ${interpolation.toUpperCase()} -q ${quality.toString()}`
    const exec = await execPromise(command, {
      cwd: imgConv.imgConvPath.root,
      windowsHide: true,
    })
    if (exec.stderr) throw new Error(exec.stderr)
    if (exec.stdout.startsWith('ImageConverterError')) throw new Error(exec.stdout)
    return exec.stdout
  },

  execGetImageSize: async (src) => {
    const command = `python "${imgConv.imgConvGetImageSizePath.path}" "${src}"`
    const exec = await execPromise(command, {
      cwd: imgConv.imgConvPath.root,
      windowsHide: true,
    })
    return JSON.parse(exec.stdout) as [number, number]
  },

  nvCompress: async (tgaPath, ddsPath, DTX5 = true) => {
    const command = `"${imgConv.nvCompressPath.fullname}" -nomips -nocuda ${DTX5 ? ' -bc3' : ' -bc1'} "${tgaPath}" "${ddsPath}"`
    const exec = await execPromise(command, { cwd: imgConv.nvCompressPath.root, windowsHide: true })
    return exec.stdout
  },

  nvDecompress: async (ddsPath) => {
    const command = `"${imgConv.nvDecompressPath.fullname}" "${ddsPath}"`
    const exec = await execPromise(command, { cwd: imgConv.nvDecompressPath.root, windowsHide: true })
    return exec.stdout
  },

  wimgtEncode: async (tempPngPath, tplPath) => {
    const command = `"${imgConv.wimgtPath.fullname}" -d "${tplPath}" ENC -x TPL.CMPR "${tempPngPath}"`
    const exec = await execPromise(command, { cwd: imgConv.wimgtPath.root, windowsHide: true })
    return exec.stdout
  },

  wimgtDecode: async (tplPath, destPath) => {
    const command = `"${imgConv.wimgtPath.fullname}" -d "${destPath}" DEC -x TPL.CMPR "${tplPath}"`
    const exec = await execPromise(command, { cwd: imgConv.wimgtPath.root, windowsHide: true })
    return exec.stdout
  },
}
