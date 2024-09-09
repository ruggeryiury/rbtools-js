import Path from 'path-js'
import type { TextureFileStatObject } from '../core.js'
import { getDDSHeader } from '../lib.js'

export const pngXboxPs3TexStat = async (filePath: Path | string): Promise<TextureFileStatObject> => {
  let srcPath: Path

  if (filePath instanceof Path) srcPath = filePath
  else srcPath = new Path(filePath)

  const srcBuffer = await srcPath.readFile()
  const fullSrcHeader = Buffer.alloc(16)
  const shortSrcHeader = Buffer.alloc(11)

  srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  const { format, height, width } = await getDDSHeader(Uint8Array.from(fullSrcHeader), Uint8Array.from(shortSrcHeader))
  const ext = srcPath.ext.slice(1).toUpperCase()

  return { format: ext, type: format, height, width, size: [width, height], formatDesc: `${ext}: DDS Image file ${ext === 'PNG_XBOX' ? '(byte-swapped)' : ''} with Harmonix header` }
}
