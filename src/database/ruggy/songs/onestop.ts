import { type DTAFileRecipe } from 'dta-parser/core'

export const onestop: DTAFileRecipe = {
  id: '7748onestop',
  name: 'Onestop',
  artist: 'David Yackley',
  master: true,
  song_id: 1774800009,
  songname: '7748onestop',
  tracks: {
    drum: { rank: 2, channels: 4 },
    bass: { rank: 4, real_rank: 4, channels: 2, tuning: [-4, -4, -4, -4] },
    guitar: { rank: 6, real_rank: 6, channels: 2, hasSolo: true },
    keys: { rank: 6, real_rank: 6, channels: 2, hasSolo: true },
    backing: 2,
  },
  preview: 30000,
  song_length: 249767,
  rank_band: 6,
  rating: 1,
  genre: {
    genre: 'Fusion',
    sub_genre: 'Fusion',
  },
  year_released: 1998,
  album: {
    hasArt: true,
  },
  author: 'Ruggy',
  multitrack: true,
  cat_ehm: true,
  pack_name: 'Windows .MID Pack 01',
  loading_phrase: '"Onestop" is a series of short songs that change into different genres every few bars, making it perfect for testing out soundcards and soundfonts in the old days.',
}
