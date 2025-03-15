import type { DTAMap, UnformattedPartialDTAFile } from '../../lib'

/**
 * Removes if statements from common values that generally uses if statements (Game Origin, Genre, and Sub-Genre).
 * - - - -
 * @param {DTAMap} song The unformatted DTA file map.
 * @returns {DTAMap} The DTA file map with only the values that works in vanilla game.
 */
export const customSourceIfdefDeconstructor = (song: DTAMap): DTAMap => {
  const gameOrigin = song.get('game_origin') as UnformattedPartialDTAFile['game_origin']
  const genre = song.get('genre') as UnformattedPartialDTAFile['genre']
  const subGenre = song.get('sub_genre') as UnformattedPartialDTAFile['sub_genre']

  if (gameOrigin && gameOrigin.startsWith('#ifdef')) song.set('game_origin', gameOrigin.split(' ')[4])
  if (genre && genre.startsWith('#ifdef')) song.set('genre', genre.split(' ')[4])
  if (subGenre && subGenre.startsWith('#ifdef')) song.set('sub_genre', subGenre.split(' ')[4])

  return song
}
