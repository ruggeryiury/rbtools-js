/**
 * Checks if a string is a link.
 * - - - -
 * @param {string} value The string you want to evaluate.
 * @returns {boolean}
 */
export const isStringALink = (value: string): boolean => value.startsWith('http') || value.startsWith('https')
