/**
 * Normalizes a string by removing diacritical marks (accents) 
 * and converting accented characters to their non-accented equivalents.
 * - - - -
 * @param {string} str The input string to normalize.
 * @returns {string} The normalized string with accents removed.
 */
export const normalizeString = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}