/**
 * Detects if the path has a valid extension and adds the given extension if it doesn't.
 * - - - -
 * @param {string} path The path you want to normalize.
 * @param {string} extension The extension you want to put into the path.
 * @returns {string}
 */
export const normalizeExtensionOnPath = (path: string, extension: string): string => path.endsWith(`.${extension}`) ? path : `${path}.${extension}`
