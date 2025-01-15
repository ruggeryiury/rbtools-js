export const getKeyFromMapValue = <T extends object>(map: T, value: T[keyof T]): keyof T | null => {
  const keys = Object.keys(map) as (keyof T)[]

  for (const key of keys) {
    if (map[key] === value) return key
  }

  return null
}
