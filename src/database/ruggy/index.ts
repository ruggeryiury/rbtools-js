import { SongsDTA } from 'dta-parser'
import { createMAGMAProjectObject, type MAGMAProject } from '../../lib.js'
import * as ruggy from './songs.js'

export const RuggyCustomsPaths = {
  songsFolder: 'C:/Users/Ruggery/Documents/Visual Studio Code/projects/ruggy-customs-projects/songs',
  magmaC3Folder: 'C:/Users/Ruggery/Desktop/Rock Band/Magma',
  destinationFolder: 'C:/Users/Ruggery/Desktop',
} as const

export const RuggyCustoms = {
  paintwar: createMAGMAProjectObject(ruggy.paintwar, {
    autogenTheme: 'SynthPop',
    hasAuthoredVenues: true,
    hasLipSyncFiles: true,
    releaseVer: 6,
    releasedAt: new Date('Aug 23, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  southparktheme: createMAGMAProjectObject(ruggy.southparktheme, {
    autogenTheme: 'PsychJamRock',
    hasAuthoredVenues: true,
    hasLipSyncFiles: true,
    releaseVer: 7,
    releasedAt: new Date('Sep 1, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  hideandseek: createMAGMAProjectObject(ruggy.hideandseek, {
    autogenTheme: 'SlowJam',
    hasAuthoredVenues: true,
    releaseVer: 3,
    releasedAt: new Date('Sep 4, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  cravoecanela: createMAGMAProjectObject(ruggy.cravoecanela, {
    autogenTheme: 'PsychJamRock',
    releaseVer: 3,
    releasedAt: new Date('Sep 17, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  deadwomb: createMAGMAProjectObject(ruggy.deadwomb, {
    autogenTheme: 'GaragePunkRock',
    releaseVer: 4,
    releasedAt: new Date('Sep 20, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  minuet: createMAGMAProjectObject(ruggy.minuet, {
    autogenTheme: 'SlowJam',
    releaseVer: 4,
    releasedAt: new Date('Oct 7, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  flourish: createMAGMAProjectObject(
    ruggy.flourish,
    {
      releaseVer: 4,
      releasedAt: new Date('Nov 17, 2017').toDateString(),
      updatedAt: new Date('Nov 7, 2023').toDateString(),
    },
    {
      id: ruggy.flourish.id,
      fake: true,
    }
  ),

  town: createMAGMAProjectObject(ruggy.town, {
    releaseVer: 4,
    releasedAt: new Date('Dec 4, 2017').toDateString(),
    updatedAt: new Date('Sep 14, 2024').toDateString(),
  }),

  onestop: createMAGMAProjectObject(
    ruggy.onestop,
    {
      releaseVer: 2,
      releasedAt: new Date('Dec 8, 2017').toDateString(),
      updatedAt: new Date('Nov 7, 2023').toDateString(),
    },
    {
      id: ruggy.onestop.id,
      fake: true,
    }
  ),

  canyon: createMAGMAProjectObject(
    ruggy.canyon,
    {
      releaseVer: 3,
      releasedAt: new Date('Dec 16, 2017').toDateString(),
      updatedAt: new Date('Nov 7, 2023').toDateString(),
    },
    {
      id: ruggy.canyon.id,
      fake: true,
    }
  ),

  passport: createMAGMAProjectObject(ruggy.passport, {
    releaseVer: 2,
    releasedAt: new Date('Dec 24, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  spacecadet: createMAGMAProjectObject(ruggy.spacecadet, {
    autogenTheme: 'PsychJamRock',
    releaseVer: 3,
    releasedAt: new Date('Dec 21, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  spacecadet2x: createMAGMAProjectObject(ruggy.spacecadet2x, {
    autogenTheme: 'PsychJamRock',
    double_kickWav: true,
    releaseVer: 3,
    releasedAt: new Date('Dec 21, 2017').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  breakingintocars: createMAGMAProjectObject(ruggy.breakingintocars, {
    hasLipSyncFiles: true,
    releaseVer: 3,
    releasedAt: new Date('Jan 11, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  aracaazul: createMAGMAProjectObject(ruggy.aracaazul, {
    hasLipSyncFiles: true,
    fakeHarm: 2,
    hasAuthoredVenues: true,
    releaseVer: 2,
    releasedAt: new Date('Jun 10, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  demon: createMAGMAProjectObject(ruggy.demon, {
    releaseVer: 2,
    releasedAt: new Date('Jun 14, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  cutmyfingersoff: createMAGMAProjectObject(ruggy.cutmyfingersoff, {
    releaseVer: 3,
    releasedAt: new Date('Jun 15, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  thefightisover: createMAGMAProjectObject(ruggy.thefightisover, {
    releaseVer: 3,
    releasedAt: new Date('Jun 15, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  anysecondnow: createMAGMAProjectObject(ruggy.anysecondnow, {
    hasLipSyncFiles: true,
    releaseVer: 2,
    releasedAt: new Date('Jul 18, 2022').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  congratulations: createMAGMAProjectObject(ruggy.congratulations, {
    releaseVer: 2,
    releasedAt: new Date('Jul 4, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  lightsinthesky: createMAGMAProjectObject(ruggy.lightsinthesky, {
    hasLipSyncFiles: true,
    releaseVer: 2,
    releasedAt: new Date('Aug 26, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  mothernature: createMAGMAProjectObject(ruggy.mothernature, {
    releaseVer: 2,
    releasedAt: new Date('Aug 28, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  mindmischief: createMAGMAProjectObject(ruggy.mindmischief, {
    releaseVer: 2,
    releasedAt: new Date('Dec 14, 2018').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  theradiant: createMAGMAProjectObject(ruggy.theradiant, {
    releaseVer: 2,
    releasedAt: new Date('Dec 5, 2019').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  whydidntyoustopme: createMAGMAProjectObject(ruggy.whydidntyoustopme, {
    hasLipSyncFiles: true,
    releaseVer: 2,
    releasedAt: new Date('Dec 5, 2019').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  thespaceinbetween: createMAGMAProjectObject(ruggy.thespaceinbetween, {
    hasLipSyncFiles: true,
    releaseVer: 2,
    releasedAt: new Date('Dec 5, 2019').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  sanguelatino: createMAGMAProjectObject(ruggy.sanguelatino, {
    hasLipSyncFiles: true,
    releaseVer: 2,
    releasedAt: new Date('Apr 10, 2020').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  robotsinthegarden: createMAGMAProjectObject(ruggy.robotsinthegarden, {
    hasLipSyncFiles: true,
    hasAuthoredVenues: true,
    releaseVer: 2,
    releasedAt: new Date('Nov 29, 2020').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  ponytail: createMAGMAProjectObject(ruggy.ponytail, {
    hasLipSyncFiles: true,
    hasAuthoredVenues: true,
    releaseVer: 2,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  beinfriends: createMAGMAProjectObject(ruggy.beinfriends, {
    releaseVer: 1,
    releasedAt: new Date('Jul 16, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  hippiebattle: createMAGMAProjectObject(ruggy.hippiebattle, {
    releaseVer: 1,
    releasedAt: new Date('Jul 16, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  patins: createMAGMAProjectObject(ruggy.patins, {
    hasLipSyncFiles: true,
    hasAuthoredVenues: true,
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  motherearth: createMAGMAProjectObject(ruggy.motherearth, {
    releaseVer: 1,
    releasedAt: new Date('Jul 16, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  pollyanna: createMAGMAProjectObject(ruggy.pollyanna, {
    releaseVer: 1,
    releasedAt: new Date('Jul 16, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  twinkle: createMAGMAProjectObject(ruggy.twinkle, {
    releaseVer: 1,
    releasedAt: new Date('Jul 16, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  tetodevidro: createMAGMAProjectObject(ruggy.tetodevidro, {
    hasLipSyncFiles: true,
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  lennastheme: createMAGMAProjectObject(ruggy.lennastheme, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  fateinhaze: createMAGMAProjectObject(ruggy.fateinhaze, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  royalpalace: createMAGMAProjectObject(ruggy.royalpalace, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  magicant: createMAGMAProjectObject(ruggy.magicant, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  smb2playersel: createMAGMAProjectObject(ruggy.smb2playersel, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  itstimetojump: createMAGMAProjectObject(ruggy.itstimetojump, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  wisdomoftheworld: createMAGMAProjectObject(ruggy.wisdomoftheworld, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  toweroflahja: createMAGMAProjectObject(ruggy.toweroflahja, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  myhome: createMAGMAProjectObject(ruggy.myhome, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  allthatineeded: createMAGMAProjectObject(ruggy.allthatineeded, {
    releaseVer: 1,
    releasedAt: new Date('Nov 7, 2023').toDateString(),
    updatedAt: new Date('Nov 7, 2023').toDateString(),
  }),

  polyesterjammy: createMAGMAProjectObject(ruggy.polyesterjammy, {
    releaseVer: 1,
    releasedAt: new Date('Apr 19, 2024').toDateString(),
    updatedAt: new Date('Apr 19, 2024').toDateString(),
  }),

  xnfrnfl: createMAGMAProjectObject(ruggy.xnfrnfl, {
    releaseVer: 1,
    releasedAt: new Date('Sep 14, 2024').toDateString(),
    updatedAt: new Date('Sep 14, 2024').toDateString(),
  }),

  humoresque: createMAGMAProjectObject(ruggy.humoresque, {
    releaseVer: 1,
    releasedAt: new Date('Sep 21, 2024').toDateString(),
    updatedAt: new Date('Sep 21, 2024').toDateString(),
  }),

  comoeuquero: createMAGMAProjectObject(
    ruggy.comoeuquero,
    {
      releaseVer: 1,
      releasedAt: new Date('Sep 21, 2024').toDateString(),
      updatedAt: new Date('Sep 21, 2024').toDateString(),
    },
    {
      id: ruggy.comoeuquero.id,
      fake: true,
    }
  ),

  mean: createMAGMAProjectObject(
    ruggy.mean,
    {
      releaseVer: 1,
      releasedAt: new Date('Apr 23, 2024').toDateString(),
      updatedAt: new Date('Apr 23, 2024').toDateString(),
    },
    {
      id: ruggy.mean.id,
      fake: true,
    }
  ),

  ruinus: createMAGMAProjectObject(
    ruggy.ruinus,
    {
      releaseVer: 1,
      releasedAt: new Date('Nov 7, 2023').toDateString(),
      updatedAt: new Date('Nov 7, 2023').toDateString(),
    },
    {
      id: ruggy.ruinus.id,
      fake: true,
    }
  ),

  burnished: createMAGMAProjectObject(
    ruggy.burnished,
    {
      releaseVer: 1,
      releasedAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    },
    {
      id: ruggy.burnished.id,
      fake: true,
    }
  ),
}

/**
 * Get all Ruggy Customs as an array with `MAGMAProject` objects.
 * - - - -
 * @returns {MAGMAProject[]}
 */
export const getRuggyCustoms = (): MAGMAProject[] => {
  const songsKeys = Object.keys(RuggyCustoms) as (keyof typeof RuggyCustoms)[]
  const allSongs: MAGMAProject[] = []
  for (const keys of songsKeys) {
    allSongs.push(RuggyCustoms[keys])
  }

  return allSongs
}

export const getRuggyCustomsID = (): string => {
  let s = ''
  const allSongs = new SongsDTA(getRuggyCustoms())
  allSongs.sort('Song ID')
  for (const song of allSongs.songs) {
    s += `${song.song_id.toString().slice(-4)} ${song.name}\n`
  }

  return s
}
