import DTAParser, { type DTAParserExportTypes, type DTAParserOptions, type DTAParserReturnType } from 'dta-parser'
import { useDefaultOptions, detectBufferEncoding } from 'dta-parser/utils'
import Path from 'path-js'

/**
 * Reads and parses a DTA file or a folder with DTA files.
 * - - - -
 * @param {string} dtaFilePath The path of the DTA file.
 * @param {DTAParserOptions<RT>} options `OPTIONAL` An object that changes the behavior of the parsing process.
 * @returns {Promise<DTAParserReturnType<RT>>}
 */
export const readDTAFile = async <RT extends DTAParserExportTypes = undefined>(dtaFilePath: string, options?: DTAParserOptions<RT>): Promise<DTAParserReturnType<RT>> => {
  const opts = useDefaultOptions<DTAParserOptions<RT>, true>(
    {
      format: 'SongClass' as RT,
      sortBy: null,
      update: null,
      updateAll: null,
    },
    options
  )

  const src = new Path(Path.resolve(dtaFilePath))

  if (src.strictType() === 'file' && src.ext === '.dta') {
    const dtaFileBuffer = await src.readFile()
    const dtaFileEncoding = detectBufferEncoding(dtaFileBuffer)
    return DTAParser<RT>(dtaFileBuffer.toString(dtaFileEncoding), opts)
  } else if (src.strictType() === 'directory') {
    let allSongs = ''
    const dirContents = await src.readDir(true)
    for (const dir of dirContents) {
      const currPath = new Path(Path.resolve(dir))
      if (currPath.exists() && currPath.ext === '.dta') {
        const currFileBuffer = await currPath.readFile()
        const currFileEncoding = detectBufferEncoding(currFileBuffer)
        allSongs += currFileBuffer.toString(currFileEncoding)
      }
    }
    return DTAParser<RT>(allSongs, opts)
  } else throw new Error('ReadDTAFileError: Provided path is not a valid .dta file or a directory')
}
