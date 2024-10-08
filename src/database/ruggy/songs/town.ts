import { type DTAFileRecipe } from 'dta-parser/core'

export const town: DTAFileRecipe = {
  id: '7748town',
  name: 'Town',
  artist: 'Nathan Grigg',
  master: true,
  song_id: 1774800008,
  songname: '7748town',
  tracks: {
    drum: { rank: 4, channels: 4 },
    bass: { rank: 4, real_rank: 4, channels: 1 },
    guitar: { rank: 5, real_rank: 4, channels: 2, hasSolo: true },
    keys: { rank: 6, real_rank: 6, channels: 2, hasSolo: true },
    backing: 2,
  },
  preview: 9000,
  song_length: 83000,
  rank_band: 5,
  rating: 1,
  genre: {
    genre: 'Fusion',
    sub_genre: 'Fusion',
  },
  year_released: 1998,
  album: {
    hasArt: true,
  },
  key: 'B',
  author: 'Ruggy',
  multitrack: true,
  cat_ehm: true,
  pack_name: 'Windows .MID Pack 01',
}
