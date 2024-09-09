import { fileURLToPath } from 'node:url'

/**
 * Returns a decoded URL-encoded path.
 * - - - -
 * @param {string} url The URL-encoded of any folder/file.
 * @returns {string}
 */
export const decodeFileURL = (url: string): string => {
  return decodeURIComponent(fileURLToPath(url))
}
