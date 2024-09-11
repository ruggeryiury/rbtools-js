import Path from 'path-js'
import { ImageHeaders, type TextureFileStatObject } from '../core.js'

export const pngWiiStat = async (filePath: Path | string): Promise<TextureFileStatObject> => {
  let srcPath: Path

  if (filePath instanceof Path) srcPath = filePath
  else srcPath = new Path(filePath)

  const ext = 'PNG_WII'

  const srcBuffer = await srcPath.readFile()
  const srcHeader = srcBuffer.subarray(0, 32)

  let width = 0
  let height = 0
  let type = ''

  const allHeaders = (Object.keys(ImageHeaders) as (keyof typeof ImageHeaders)[]).filter((header) => header.startsWith('WII'))

  for (const header of allHeaders) {
    if (srcHeader.toString() === Buffer.from(ImageHeaders[header]).toString()) {
      const [w, h] = header
        .slice(3)
        .split('_')[0]
        .split('x')
        .map((size) => Number(size))
      width = w
      height = h
      type = header.slice(3).split('_')[1] ?? 'NORMAL'
    }
  }

  if (width === 0 && height === 0 && !type) throw new Error(`PngWiiStatError: File "${srcPath.path}" does not have a recognizable header.`)

  return {
    format: ext,
    type,
    width,
    height,
    size: [width, height],
    formatDesc: `${ext}: TPL (Texture Pallete Library) file with Harmonix header`,
  }
}
