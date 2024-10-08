import { type DTAFileRecipe } from 'dta-parser/core'

export const motherearth: DTAFileRecipe = {
  id: '7748motherearth',
  name: 'Mother Earth',
  artist: 'Keiichi Suzuki & Hirokazu Tanaka',
  master: true,
  song_id: 1774800033,
  songname: '7748motherearth',
  tracks: {
    drum: { rank: 0, channels: 2 },
    bass: { rank: 1, real_rank: 1, channels: 1 },
    guitar: { rank: 2, real_rank: 2, channels: 1, pans: [-0.2] },
    keys: { rank: 0, real_rank: 0, channels: 1, pans: [0.2] },
    backing: 2,
  },
  anim_tempo: 16,
  preview: 18668,
  song_length: 119477,
  rank_band: 0,
  rating: 1,
  genre: { genre: 'Pop/Dance/Electronic', sub_genre: 'Chiptune' },
  year_released: 1989,
  album: {
    hasArt: true,
    name: 'MOTHER (Original Soundtrack)',
    track_number: 1,
  },
  key: 'G',
  multitrack: true,
  author: 'Ruggy',
  pack_name: 'MOTHER Pack 01',
}
