import Path from 'path-js'
import type { ConvertToTextureOptions } from '../core.js'
import { type ArtworkTextureFormatTypes, stringToPath } from '../lib.js'

export const texToTex = async (srcFile: string | Path, destPath: string | Path, toFormat: ArtworkTextureFormatTypes, options: Pick<ConvertToTextureOptions, 'DTX5'>) => {}
