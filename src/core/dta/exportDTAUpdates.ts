import { type SongUpdateObject, stringifySongUpdates } from 'dta-parser/core'
import { useDefaultOptions } from 'dta-parser/utils'
import Path from 'path-js'

export interface ExportDTAUpdatesOptions {
  /**
   * If `true`, each song update values will be writen in one line. Default is `true`.
   */
  inline?: boolean
}

/**
 * Exports `SongUpdateObject` to a DTA file.
 * - - - -
 * @param {SongUpdateObject} content An object with values that updates a specific song based on its ID.
 * @param {string} destinationPath The destination path of the DTA update file.
 * @param {ExportDTAUpdatesOptions | undefined} options `OPTIONAL`An object that changes the behavior of the exporting process.
 * @returns {Promise<string>} The path of the created DTA file.
 */
export const exportDTAUpdates = async (content: SongUpdateObject, destinationPath: string, options?: ExportDTAUpdatesOptions): Promise<string> => {
  const { inline } = useDefaultOptions<ExportDTAUpdatesOptions, true>(
    {
      inline: true,
    },
    options
  )

  const destPath = new Path(new Path(Path.resolve(destinationPath)).changeFileExt('dta'))

  if (destPath.exists()) await destPath.deleteFile()

  const updateContents = stringifySongUpdates(content, { inline })
  await destPath.writeFile(updateContents, 'latin1')

  return destPath.path
}
