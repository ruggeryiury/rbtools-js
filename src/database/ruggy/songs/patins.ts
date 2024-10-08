import { type DTAFileRecipe } from 'dta-parser/core'

export const patins: DTAFileRecipe = {
  id: '7748patins',
  name: 'Patins',
  artist: 'CSS',
  master: true,
  song_id: 1774800032,
  songname: '7748patins',
  tracks: {
    drum: { rank: 1, channels: 2 },
    bass: { rank: 0, real_rank: 0, channels: 1 },
    guitar: { rank: 3, real_rank: 2, channels: 1 },
    vocals: { rank: 1, channels: 1, vocal_parts: 2, hasSolo: true },
    backing: 2,
  },
  preview: 44569,
  song_length: 135401,
  rank_band: 1,
  rating: 1,
  genre: { genre: 'Indie Rock', sub_genre: 'Indie Rock' },
  vocal_gender: 'Female',
  year_released: 2006,
  album: {
    hasArt: true,
    name: 'Cansei de Ser Sexy (International Release)',
    track_number: 2,
  },
  key: 'G',
  cat_ehm: true,
  author: 'Ruggy',
  loading_phrase: 'The name of the band (Cansei de Ser Sexy) was taken from a reported quote by Beyoncé, who allegedly declared that she was "tired of being sexy".',
}
