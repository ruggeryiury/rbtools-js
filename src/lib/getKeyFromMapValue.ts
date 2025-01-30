/* eslint-disable jsdoc/valid-types */

/**
 * Returns the key from a provided `value` as string that exists inside an `map`.
 *
 * Returns `null` if the value does not matches on any key.
 * - - - -
 * @param {T} map The object with keys and values.
 * @param {T[keyof T]} value A value that exists on provided map.
 * @returns {keyof T | null}
 */
export const getKeyFromMapValue = <T extends object>(map: T, value: T[keyof T]): keyof T | null => {
  const keys = Object.keys(map) as (keyof T)[]

  for (const key of keys) {
    if (map[key] === value) return key
  }

  return null
}
