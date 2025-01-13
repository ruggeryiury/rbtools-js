export const getKeyFromMapValue = <T extends object>(map: T, value: T[keyof T]): keyof T => {
  const keys = Object.keys(map) as (keyof T)[]

  for (const key of keys) {
    if (map[key] === value) return key
  }

  throw new TypeError(`Value "${String(value)}" does not exists on provided map object`)
}
