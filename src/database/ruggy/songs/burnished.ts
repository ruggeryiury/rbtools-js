import { type DTAFileRecipe } from 'dta-parser/core'

export const burnished: DTAFileRecipe = {
  id: '7748burnished',
  name: 'Burnished',
  artist: 'White Denim',
  master: true,
  song_id: 1774800050,
  songname: '7748burnished',
  tracks: {
    drum: { rank: 3, channels: 2 },
    bass: { rank: 2, real_rank: 2, channels: 2 },
    guitar: { rank: 3, real_rank: 3, channels: 2 },
    vocals: { rank: 1, channels: 2, vocal_parts: 2 },
    backing: 2,
  },
  preview: 43930,
  song_length: 163363,
  rank_band: 2,
  rating: 1,
  genre: { genre: 'Indie Rock', sub_genre: 'Indie Rock' },
  year_released: 2011,
  album: {
    hasArt: true,
    name: 'D',
    track_number: 2,
  },
  key: 'D',
  multitrack: true,
  cat_ehm: true,
  author: 'Ruggy',
}
