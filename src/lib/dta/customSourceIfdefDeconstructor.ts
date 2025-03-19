import type { DTAMap, CustomSourceValuesObject } from '../../lib'

/**
 * Removes if statements from common values that generally uses if statements (Game Origin, Genre, and Sub-Genre).
 * - - - -
 * @param {DTAMap} song The unformatted DTA file map.
 * @returns {DTAMap} The DTA file map with only the values that works in vanilla game.
 */
export const customSourceIfdefDeconstructor = (song: DTAMap): DTAMap => {
  const gameOrigin = song.get('game_origin') as CustomSourceValuesObject['game_origin']
  const genre = song.get('genre') as CustomSourceValuesObject['genre']
  const subGenre = song.get('sub_genre') as CustomSourceValuesObject['sub_genre']

  let hasAnyCustomSource = false
  const customSource = new Map<keyof CustomSourceValuesObject, string>()

  if (gameOrigin && gameOrigin.startsWith('#ifdef')) {
    const split = gameOrigin.split(' ')
    song.set('game_origin', split[4])
    customSource.set('game_origin', split[2])
    hasAnyCustomSource = true
  }
  if (genre && genre.startsWith('#ifdef')) {
    const split = genre.split(' ')
    song.set('genre', split[4])
    customSource.set('genre', split[2])
    hasAnyCustomSource = true
  }
  if (subGenre && subGenre.startsWith('#ifdef')) {
    const split = subGenre.split(' ')
    song.set('sub_genre', split[4])
    customSource.set('sub_genre', split[2])
    hasAnyCustomSource = true
  }

  if (hasAnyCustomSource) song.set('customsource', Object.fromEntries(customSource))

  return song
}
