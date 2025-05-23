import { setDefaultOptions } from 'set-default-options'
import type { DTAFile } from '../../lib.exports'

/**
 * Normalizes a string by removing diacritical marks (accents)
 * and converting accented characters to their non-accented equivalents.
 * - - - -
 * @param {string} str The input string to normalize.
 * @returns {string} The normalized string with accents removed.
 */
export const normalizeString = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const articles = ['a', 'an', 'the'] as const

/**
 * Removes the leading article from a string, if any.
 * - - - -
 * @param {string} text The text you want to be processed.
 * @returns {string} The text processed.
 */
export const omitLeadingArticle = (text: string): string => {
  const words = text.split(' ')
  const firstWord = words[0]
  const hasLeadingArticle = articles.includes(firstWord.toLowerCase() as (typeof articles)[number])
  if (hasLeadingArticle) {
    return words.slice(1).join(' ')
  }

  return words.join(' ')
}

/**
 * Puts the leading article at the end to the string, separated with a comma, if any.
 * - - - -
 * @param {string} text The text you want to be processed.
 * @returns {string} The text processed.
 */
export const leadingArticleToTrailing = (text: string): string => {
  const words = text.split(' ')
  const firstWord = words[0]
  const hasLeadingArticle = articles.includes(firstWord.toLowerCase() as (typeof articles)[number])
  if (hasLeadingArticle) {
    return `${words.slice(1).join(' ')}, ${firstWord}`
  }

  return words.join(' ')
}

/**
 * Replaces quote character (`"`) to slash Q (`\q`).
 *
 * Slash Q replaces the quote character on a DTA File.
 * - - - -
 * @param {string} text The text you want to be processed.
 * @returns {string} The text processed.
 */
export const quoteToSlashQ = (text: string): string => text.replace(/\\/g, '\\\\').replace(/"/g, '\\q')

/**
 * Replaces slash Q (`\q`) to quote character (`"`).
 *
 * Slash Q replaces the quote character on a DTA File.
 * - - - -
 * @param {string} text The text you want to be processed.
 * @returns {string} The text processed.
 */
export const slashQToQuote = (text: string): string => text.replace(/\\\\/g, '\\').replace(/\\q/g, '"')

export interface StringFormatterOptions {
  /**
   * Removes all characters but characters and numbers. Default is `false`.
   */
  azNumOnly?: boolean
  /**
   * Forces lowercase/uppercase characters. Default is `null`.
   */
  forceCase?: 'lower' | 'upper' | null
  /**
   * Replace non-ASCII characters to ASCII replacements. Default is `false`.
   */
  normalizeNFD?: boolean
  /**
   * Remove all spaces. Default is `false`.
   */
  removeSpaces?: boolean
  /**
   * Removes the leading and trailing white space and line terminator characters from a string. Default is `false`.
   */
  trim?: boolean
}

export type StringFormatterSpecificOptionTypes = 'id' | 'id_with_space'

/**
 * Formats a string with the provided configuration.
 * - - - -
 * @param {DTAFile | null} song The song you want to fetch the values flagged on the
 * formatted string as a `DTAFile` object.
 *
 * If the provided argument is `null`, the function will ignore any formatting values
 * that relies on the `DTAFile` object and it will process the string only with the
 * configuration that is placed on the `options` object, acting as a simple string
 * formatter rather than rely on a `DTAFile` object.
 * @param {string} format The formatted string.
 * @param {StringFormatterOptions | StringFormatterSpecificOptionTypes | undefined} options `OPTIONAL` An object that changes the behavior of the formatting process.
 * @returns {string} The string with format flags replaced to actual values from the provided `DTAFile` object.
 */
export const formatStringFromDTA = (song: DTAFile | null, format: string, options?: StringFormatterOptions | StringFormatterSpecificOptionTypes): string => {
  if (options === 'id')
    options = {
      azNumOnly: true,
      forceCase: 'lower',
      normalizeNFD: true,
      removeSpaces: true,
      trim: true,
    }
  else if (options === 'id_with_space')
    options = {
      azNumOnly: true,
      forceCase: 'lower',
      normalizeNFD: true,
      removeSpaces: false,
      trim: true,
    }

  const { azNumOnly, forceCase, normalizeNFD, removeSpaces, trim } = setDefaultOptions<StringFormatterOptions>(
    {
      azNumOnly: false,
      forceCase: null,
      normalizeNFD: false,
      removeSpaces: false,
      trim: false,
    },
    options
  )

  let newText = format

  if (song) {
    const valuesThatAreUnique = ['name', 'artist', 'album_name']
    const allSongKeys = Object.keys(song) as (keyof typeof song)[]
    for (const songKey of allSongKeys) {
      if (valuesThatAreUnique.includes(songKey)) continue
      if (!song[songKey]) continue
      newText = newText.replace(new RegExp(`{{${songKey}}}`, 'g'), song[songKey] as string)
    }

    for (const uniqueKeys of valuesThatAreUnique) {
      if (!song[uniqueKeys as keyof typeof song]) continue
      newText = newText.replace(new RegExp(`{{${uniqueKeys}}}`, 'g'), song[uniqueKeys as keyof typeof song] as string)
      newText = newText.replace(new RegExp(`{{${uniqueKeys}.emit}}`, 'g'), song[uniqueKeys as keyof typeof song] as string)
      newText = newText.replace(new RegExp(`{{${uniqueKeys}.omit}}`, 'g'), omitLeadingArticle(song[uniqueKeys as keyof typeof song] as string))
      newText = newText.replace(new RegExp(`{{${uniqueKeys}.trailing}}`, 'g'), leadingArticleToTrailing(song[uniqueKeys as keyof typeof song] as string))
    }

    newText = newText.replace(new RegExp(`{{title}}`, 'g'), song.name)
    newText = newText.replace(new RegExp(`{{title.emit}}`, 'g'), song.name)
    newText = newText.replace(new RegExp(`{{title.omit}}`, 'g'), omitLeadingArticle(song.name))
    newText = newText.replace(new RegExp(`{{title.trailing}}`, 'g'), leadingArticleToTrailing(song.name))
  }
  if (normalizeNFD) newText = newText.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (azNumOnly) newText = newText.replace(/[^a-zA-Z0-9]/g, '')
  if (removeSpaces) newText = newText.replace(/ /g, '')
  if (trim) newText = newText.trim()

  switch (forceCase) {
    case 'lower':
      newText = newText.toLowerCase()
      break
    case 'upper':
      newText = newText.toUpperCase()
      break
    default:
      break
  }

  return newText
}
