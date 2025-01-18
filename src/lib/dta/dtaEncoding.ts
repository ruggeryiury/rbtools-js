import { detectAll } from 'jschardet'
import type { PartialDTAFile, SongEncoding } from '../../lib.js'

/**
 * Figures out the encoding of a string of buffer for DTA file exporting.
 * - - - -
 * @param {string | Buffer} data The data you want to know the encoding type.
 * @returns {SongEncoding} The encoding of the Buffer (formatted to DTA file).
 */
export const detectBufferEncoding = (data: string | Buffer): SongEncoding => {
  let bufEnc: SongEncoding = 'latin1'
  const encodings = detectAll(data)
  for (const enc of encodings) {
    if (enc.encoding === 'ASCII' && enc.confidence === 1) break
    else if (enc.encoding.includes('windows-125') || (enc.encoding.includes('ISO-8859') && enc.confidence >= 0.96)) break
    else if (enc.encoding === 'UTF-8' && enc.confidence > 0.96) {
      bufEnc = 'utf8'
      break
    }
  }

  return bufEnc
}

/**
 * Tells if the string has specific Latin-1 characters compared to ASCII.
 * - - - -
 * @param {string} input The string to be evaluated.
 * @returns {boolean} A boolean value that tells if the string has specific Latin-1 characters compared to ASCII.
 */
export const containsLatin1SpecificChars = (input: string): boolean => {
  // Loop through each character in the string
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i)

    // Check if the character is within the Latin-1 specific range (128–255)
    if (charCode >= 128 && charCode <= 255) {
      return true
    }
  }
  return false
}

/**
 * Checks all string values in a parsed song or song updates object for specific Latin-1
 * characters compared to ASCII and returns the correct encoding to use.
 * - - - -
 * @param {PartialDTAFile} song The song you want to know the encoding type.
 * @returns {SongEncoding} The correct encoding for the song.
 */
export const patchDTAEncodingFromDTAFileObject = (song: PartialDTAFile): SongEncoding => {
  const { name, artist, album_name, pack_name, author, loading_phrase } = song
  let proof = false

  if (name && containsLatin1SpecificChars(name)) proof = true
  if (artist && containsLatin1SpecificChars(artist)) proof = true
  if (album_name && containsLatin1SpecificChars(album_name)) proof = true
  if (pack_name && containsLatin1SpecificChars(pack_name)) proof = true
  if (author && containsLatin1SpecificChars(author)) proof = true
  if (loading_phrase && containsLatin1SpecificChars(loading_phrase)) proof = true
  return proof ? 'utf8' : 'latin1'
}
