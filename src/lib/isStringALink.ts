/**
 * Checks if a string is a link.
 * - - - -
 * @param {string} value The string you want to evaluate.
 * @returns {boolean} A boolean value that tells if the provided string is a link or not.
 */
export const isStringALink = (value: string): boolean => value.startsWith('http') || value.startsWith('https')
