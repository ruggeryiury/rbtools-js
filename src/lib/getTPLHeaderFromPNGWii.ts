import { ImageHeaders, type TextureFileStatObject } from '../core.js'

export const getTPLHeaderFromPNGWii = (pngWiiStat: TextureFileStatObject): readonly number[] | undefined => {
  const { width, height, type } = pngWiiStat
  const headerKey = `TPL${width.toString()}x${height.toString()}${type === 'NORMAL' ? '' : `_${type}`}`
  if (headerKey in ImageHeaders) return ImageHeaders[headerKey as keyof typeof ImageHeaders]
}
