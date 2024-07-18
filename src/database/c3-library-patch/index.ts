import { stringifySongUpdates, type SongUpdateObject } from 'dta-parser/core'
import { detectBufferEncoding } from 'dta-parser/utils'
import type { LibraryStringifyReturnObject } from '../../database.js'

export const C3LibraryPatch: SongUpdateObject = {
  // ABBA ____________________________________________________________________
  dancingqueenv12: {
    // Dancing Queen
    key: 'A',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  UM_DYMKKEYSrb3con: {
    // Does Your Mother Know
    key: 'G',
    rating: 'Supervision Recommended',
  },
  GimmeX3: {
    // Gimme! Gimme! Gimme! (A Man After Midnight)
    key: 'Dm',
    album: {
      hasArt: true,
      name: 'Greatest Hits Vol. 2',
      track_number: 1,
    },
  },
  KnowMeKnowYou: {
    // Knowing Me, Knowing You
    key: 'D',
  },
  layallyourlove: {
    // Lay All Your Love on Me
    key: 'Dm',
  },
  drbsMammaMiav4: {
    // Mamma Mia
    key: 'D',
  },
  ABBAMoney: {
    // Money, Money, Money
    rating: 'Supervision Recommended',
    key: 'Am',
  },
  AbbaSOS: {
    // SOS
    key: 'F',
  },
  supertrouper_sky: {
    // Super Trouper
    key: 'C',
  },
  'AbbaTakeaChancev#': {
    // Take a Chance on Me
    key: 'B',
    rating: 'Supervision Recommended',
  },
  ud_waterloo: {
    // Waterloo
    key: 'D',
  },
  winnertakesitall_abba: {
    // The Winner Takes It All
    key: 'F#',
  },

  // Adele ____________________________________________________________________
  A_Hello_PVH: {
    // Hello
    key: 'Fm',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Soul',
    },
  },
  esp_adele_ritdeepv2: {
    // Rolling in the Deep
    key: 'Cm',
  },
  'Adele_SendMyLovev#': {
    // Send My Love (To Your New Lover)
    key: 'F#m',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Soul',
    },
  },
  'Adele_SetFireToTheRainv#_': {
    // Set Fire to the Rain
    key: 'Dm',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Soul',
    },
  },
  SkyfallMrMetv1: {
    // Skyfall
    artist: 'Adele',
    album: {
      hasArt: true,
      name: 'Skyfall',
      track_number: 1,
    },
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Soul',
    },
    key: 'Cm',
  },
  esp_adele_someonelikev4: {
    // Someone Like You
    key: 'A',
  },

  // American Football ____________________________________________________________________
  AF_NeverMeant: {
    // Never Meant
    key: 'C',
    album: {
      name: 'American Football I',
    },
  },
  fugg_silhouettes: {
    // Silhouettes
    key: 'Dm',
    album: {
      name: 'American Football III',
    },
  },
  AmfoUncomfortably: {
    // Uncomfortably Numb
    name: 'Uncomfortably Numb (ft. Hayley Williams)',
    key: 'Ab',
    album: {
      name: 'American Football III',
    },
  },

  // Amy Winehouse ____________________________________________________________________
  BacktoBlack: {
    // Back to Black
    key: 'Dm',
  },
  AW_LoveIsaLosingGame_V1_r: {
    // Love Is a Losing Game
    key: 'C',
  },
  TDOTrOwnJIM: {
    // Tears Dry On Their Own
    key: 'E',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Soul',
    },
  },
  YouKnowImNoGood: {
    // You Know I'm No Good
    key: 'Dm',
  },

  // Anamanaguchi ____________________________________________________________________
  sots_anotherwinterv9: {
    // Another Winter
    key: 'A',
  },
  o467461234_makiyasushibox: {
    // Maki Ya/Sushi Box
    album: {
      name: 'Scott Pilgrim vs. the World: The Game (Original Videogame Soundtrack)',
    },
  },
  o486812559_meow_anamanaguc: {
    // Meow
    key: 'F',
  },
  sots_promnightv8: {
    // Prom Night
    key: 'E',
  },

  // Animal Collective ____________________________________________________________________
  mygirlsv1: {
    album: { track_number: 2 },
    key: 'C',
  },

  // Arcade Fire ____________________________________________________________________
  awfulsound: {
    // Awful Sound (Oh Eurydice)
    key: 'F#m',
    rating: 'Family Friendly',
  },
  crownoflove: {
    // Crown of Love
    key: 'Eb',
    rating: 'Family Friendly',
  },
  everythingnow: {
    // Everything Now
    rating: 'Family Friendly',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
    key: 'C',
  },
  FBE: {
    // Flashbulb Eyes
    key: 'Am',
    rating: 'Family Friendly',
  },
  inthebackseat: {
    // In the Backseat
    key: 'D',
    rating: 'Supervision Recommended',
  },
  intervention: {
    // Intervention
    key: 'C',
    rating: 'Supervision Recommended',
  },
  keepthecar_af: {
    // Keep the Car Running
    key: 'D',
  },
  lightning_af: {
    // The Lightning I, II
    rating: 'Family Friendly',
    key: 'A',
  },
  1649900159: {
    // My Body Is A Cage
    name: 'My Body is a Cage',
    key: 'Gm',
  },
  'neigh1v#': {
    // Neighborhood #1 (Tunnels)
    key: 'F',
  },
  laika: {
    // Neighborhood #2 (Laika)
    key: 'Bm',
  },
  'ArcadeFire-PowerOutv#_rb3': {
    // Neighborhood #3 (Power Out)
    key: 'Dm',
  },
  kam_af_ncg2_CON: {
    // No Cars Go
    key: 'Db',
  },
  putyourmoneyonme: {
    // Put Your Money On Me
    key: 'G',
    rating: 'Family Friendly',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },
  readytostart_af: {
    // Ready to Start

    // The song is using the same shortname as Suburban War.
    key: 'A',
    rating: 'Supervision Recommended',
  },
  RebellionLiesv2: {
    // Rebellion (Lies)
    key: 'Bb',
  },
  REFLv9: {
    //Reflektor
    key: 'Bm',
    rating: 'Family Friendly',
  },
  'AF-Sprawl_2v#': {
    // Sprawl II (Mountains Beyond Mountains)
    key: 'Eb',
  },
  suburbanwar: {
    // Suburban War
    key: 'F',
    rating: 'Family Friendly',
  },
  'ArcadeFire-TheSuburbs_rb3': {
    // The Suburbs
    key: 'D',
  },
  kam_af_wu2_CON: {
    // Wake Up
    key: 'C',
  },
  wexistv11: {
    // We Exist
    key: 'F#m',
    rating: 'Family Friendly',
  },
  windowsill: {
    // Windowsill
    key: 'G',
  },

  // Arctic Monkeys ____________________________________________________________________
  505: {
    // 505
    key: 'Am',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },
  AllMyOwnStuntsMGMv0_rb3co: {
    // All My Own Stunts
    key: 'Bm',
  },
  klop_thebadthing: {
    // The Bad Thing
    key: 'Em',
  },
  Brianstormv9: {
    // Brianstorm
    key: 'Fm',
  },
  BrickByBrickMGMv0: {
    // Brick by Brick
    key: 'Em',
  },
  acertainromance: {
    // A Certain Romance
    key: 'B',
  },
  Cornerstone: {
    // Cornerstone
    key: 'A',
    rating: 'Family Friendly',
  },
  AMCryinLightning: {
    // Crying Lightning (UngratefulDead version)
    key: 'Am',
    rating: 'Family Friendly',
  },
  klop_cryinglightning: {
    // Crying Lightning (Kloporte version)
    key: 'Am',
  },
  klop_disfordangerous_rb3c: {
    // D is for Dangerous
    key: 'Cm',
  },
  DanceLittleLiarMGMv0_rb3c: {
    // Dance Little Liar
    key: 'C#m',
  },
  DangerousAnimalsMGMv0_rb3: {
    // Dangerous Animals
    key: 'Gm',
  },
  DoIWannaKnowv3: {
    // Do I Wanna Know?
    key: 'Gm',
    rating: 'Supervision Recommended',
  },
  domeafavour: {
    // Do Me a Favour
    name: 'Do Me a Favour',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
    rating: 'Mature Content',
    key: 'F#m',
  },
  klop_dontsitdown2: {
    // Don't Sit Down 'Cause I've Moved Your Chair (Rhythm Version)
    album: { name: 'Suck it and See' },
    key: 'Dm',
    rating: 'Supervision Recommended',
  },
  Fireandthethud: {
    // Fire and the Thud
    key: 'Bm',
    rating: 'Supervision Recommended',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },
  fromtheritztotherubble_rb: {
    // From the Ritz to the Rubble
    name: 'From the Ritz to the Rubble',
    key: 'Bm',
    rating: 'Family Friendly',
  },
  TheHellCatSpangled1: {
    // The Hellcat Spangled Shalalala
    name: 'The Hellcat Spangled Shalalala',
    key: 'B',
    rating: 'Mature Content',
  },
  am_dancefloor: {
    // I Bet You Look Good on the Dancefloor (Rex Voluntas version)
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
    key: 'F#m',
    rating: 'Supervision Recommended',
  },
  IBetYouLookGoodOnTheDance: {
    // I Bet You Look Good on the Dancefloor (Ghostbyob version)
    key: 'F#m',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },
  IfYouveFound: {
    // If You've Found This, It's Probably Too Late
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
    rating: 'Supervision Recommended',
    key: 'Am',
  },
  klop_thejewellershands: {
    // The Jeweller's Hands
    key: 'Cm',
  },
  lbtlco: {
    // Leave Before The Lights Come On
    key: 'C',
    rating: 'Family Friendly',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },
  LibraryPicturesMGMv3_rb3c: {
    // Library Pictures
    key: 'C#m',
    rating: 'Mature Content',
  },
  mardybum: {
    // Mardy Bum
    key: 'D',
    rating: 'Supervision Recommended',
  },
  MyPropellerMGMv0: {
    // My Propeller
    key: 'Em',
  },
  OnePointPMGM_F: {
    // One Point Perspective
    key: 'Eb',
  },
  klop_prettyvisitors_fb_rb: {
    // Pretty Visitors (Kloporte version)
    key: 'F#m',
    rating: 'Supervision Recommended',
  },
  prettyvisitorsfish: {
    // Pretty Visitors (Sr. Dedos Rapidos version)
    key: 'F#m',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },
  RecklessSerenadeMGMv0_rb3: {
    // Reckless Serenade
    key: 'D',
  },
  ShesThunderStorms2: {
    // She's Thunderstorms
    name: "She's Thunderstorms",
    key: 'G',
  },
  SuckItAndSeeMGMv0: {
    // Suck it and See
    key: 'E',
  },
  sots_teddypickerv4: {
    // Teddy Picker
    key: 'Am',
  },
  ThatsWhereYoureWMGMv1_rb3: {
    // That's Where You're Wrong
    key: 'E',
  },
  TheredBetterBAMBMGMv0_rb3: {
    // There'd Better Be a Mirrorball
    key: 'Eb',
  },
  klop_thishouseisacircus_r: {
    // This House is a Circus
    name: 'This House is a Circus',
    key: 'Bm',
  },
  AMHotelCasino: {
    // Tranquility Base Hotel & Casino
    key: 'Am',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
    rating: 'Supervision Recommended',
  },
  klop_whenthesungoesdown_r: {
    // When the Sun Goes Down
    key: 'B',
  },
  WYOCMWYH: {
    // Why'd You Only Call Me When You're High?
    key: 'F#m',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Indie Rock',
    },
  },

  // Ariana Grande ____________________________________________________________________
  BreakFree: {
    // Break Free
    key: 'Gm',
  },
  breathin: {
    // Breathin
    key: 'Fm',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  GodisawomanJIM: {
    // God is a Woman
    key: 'D#m',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  AGIntoYou: {
    // Into You (Ultimate_MANG0 version)
    key: 'F#m',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
    rating: 'Family Friendly',
  },
  fugg_intoYou1x: {
    // Into You (FUGGNUTZ version)
    key: 'F#m',
  },
  fugg_intoYouPS31x: {
    // Into You (FUGGNUTZ PS3 version)
    key: 'F#m',
  },
  fugg_intoYou2x: {
    // Into You (2x Bass Pedal version) (FUGGNUTZ version)
    key: 'F#m',
  },
  fugg_intoYouPS32x: {
    // Into You (2x Bass Pedal version) (FUGGNUTZ PS3 version)
    key: 'F#m',
  },
  OneLastTime: {
    // One Last Time
    key: 'Ab',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  problem: {
    // Problem (ft. Iggy Azalea)
    name: 'Problem (ft. Iggy Azalea)',
    key: 'G#m',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
    vocal_gender: 'Female',
  },
  AG_STM: {
    key: 'G',
    vocal_gender: 'Female',
  },

  // Avril Lavigne ____________________________________________________________________
  AL4Real: {
    // 4 Real
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    key: 'C',
    rating: 'Family Friendly',
  },
  Alice: {
    // Alice (Qweflol version)
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
    vocal_gender: 'Female',
  },
  ALAliceExtended: {
    // Alice (Extended Version) (Ultimate_MANG0 version)
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALAlone: {
    // Alone
    key: 'A',
    rating: 'Family Friendly',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
  },
  ALAnythingbutOrdinary_rb3: {
    // Anything but Ordinary
    key: 'C',
    rating: 'Supervision Recommended',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
  },
  ALBestDamnThingV5: {
    // The Best Damn Thing
    key: 'D',
    rating: 'Supervision Recommended',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
  },
  o563466780_biteme_avrillav: {
    // Bite Me
    album: {
      name: 'Love Sux (Deluxe)',
      track_number: 3,
    },
    key: 'Eb',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  ALBlackStar: {
    // Black Star
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  Complicated: {
    // Complicated
    key: 'F',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALContagious: {
    // Contagious
    key: 'Db',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Supervision Recommended',
  },
  ALDarlin: {
    // Darlin
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALEverbodyHurts: {
    // Everbody Hurts
    key: 'Bb',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALEverythingBackV2: {
    // Everything Back But You
    key: 'E',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  ALGirlfriendV4: {
    // Girlfriend
    key: 'D',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  ALGoodbye: {
    // Goodbye (Ultimate_MANG0 version)
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  Goodbye: {
    // Goodbye (Qweflol version)
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  o142591279_hewasnt_avrilla: {
    // He Wasn't
    key: 'D',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  htnguV2: {
    // Here's to Never Growing Up
    key: 'F',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
  },
  o504803015_herestonevergro: {
    // Here's to Never Growing Up (Audio Revamp)
    key: 'F',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
  },
  ALHotV3: {
    // Hot
    key: 'Ab',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  AvrLavHot: {
    // Hot
    key: 'Ab',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALICanDoBetterV3: {
    // I Can Do Better
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  ALDontHaveToTry: {
    // I Don't Have To Try
    key: 'B',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  ALILoveYou: {
    // I Love You
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALIWillBeV4: {
    // I Will Be
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  o375585180_imamess_avrilla: {
    // I'm a Mess
    name: "I'm a Mess (ft. YUNGBLUD)",
    artist: 'Avril Lavigne',
    album: {
      name: 'Love Sux (Deluxe)',
      track_number: 13,
    },
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    key: 'Db',
    rating: 'Supervision Recommended',
  },
  ALImwithYou: {
    // I'm with You
    key: 'A',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALInnocenceV2: {
    // Innocence
    key: 'E',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALKeepHoldingOn: {
    // Keep Holding On
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALLosingGrip: {
    // Losing Grip
    key: 'G#m',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALMobile: {
    // Mobile
    key: 'A',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALMyWorld: {
    // My World
    key: 'Db',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALNaked: {
    // Naked
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALNobodysFool: {
    // Nobody's Fool (Ultimate_MANG0 version)
    key: 'E',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  AvrilNobodysFool: {
    // Nobody's Fool (Nudles version)
    key: 'E',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  Nobodyshome: {
    // Nobody's Home
    key: 'Em',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALNotEnough: {
    // Not Enough
    key: 'D',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALOneofThoseGirls: {
    // One of Those Girls
    key: 'Db',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALPush: {
    // Push
    key: 'Bb',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALRememberWhen: {
    // Remember When
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALRunawayV3: {
    // Runaway
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALSmile: {
    // Smile
    key: 'F#m',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  Smile: {
    // Smile
    key: 'F#m',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },
  ALStopStandingThereV2_rb3: {
    // Stop Standing There
    key: 'C',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  o303704460_tellmeitsover_a: {
    // Tell Me It's Over
    key: 'A',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALThingsIllNeverSayV3_rb3: {
    // Things I'll Never Say
    key: 'D',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALTomorrowV2: {
    // Tomorrow
    key: 'A',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALTooMuchtoAskV3: {
    // Too Much to Ask
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  ALUnwantedV2: {
    // Unwanted
    key: 'Em',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Family Friendly',
  },
  WhattheHell: {
    // What the Hell
    key: 'A',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Supervision Recommended',
  },
  ALWhenYoureGoneV2: {
    // When You're Gone (Ultimate_MANG0 version)
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Supervision Recommended',
  },
  whenyouregoneTRUCE: {
    // When You're Gone (Truce version)
    key: 'G',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Supervision Recommended',
  },
  ALWishYouHereV2: {
    // Wish You Were Here
    key: 'E',
    genre: {
      genre: 'Pop-Rock',
      sub_genre: 'Pop',
    },
    rating: 'Mature Content',
  },

  // Bag Raiders ____________________________________________________________________
  SheepQueen_ShootingStars_: {
    // Shooting Stars
    key: 'E',
  },

  // Beach House ____________________________________________________________________
  NSYmyth: {
    // Myth
    key: 'Eb',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Shoegazing',
    },
    vocal_gender: 'Female',
  },
  beach_hospace_song: {
    // Space Song
    key: 'Eb',
  },

  // Beyoncé ____________________________________________________________________
  Demsingleladies: {
    // Single Ladies (Put a Ring on It)
    artist: 'Beyoncé',
    rating: 'Family Friendly',
    key: 'E',
  },
  Crazyinlove: {
    // Crazy In Love (ft. JAY Z)
    name: 'Crazy in Love (ft. JAY-Z)',
    rating: 'Family Friendly',
    key: 'Gm',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },

  // Billie Eilish ____________________________________________________________________
  fugg_badGuy: {
    // bad guy
    key: 'Gm',
    album: {
      name: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
    },
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
  },
  dingo_everythingiwantedv0: {
    // everything i wanted
    key: 'F#m',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Downtempo',
    },
    album: {
      name: 'everything i wanted',
      track_number: 1,
    },
  },
  o563817712: {
    // Happier Than Ever
    key: 'C',
    rating: 'Mature Content',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Downtempo',
    },
  },
  o486606900_idontwannabeyou: {
    // idontwannabeyouanymore
    key: 'G',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Downtempo',
    },
    rating: 'Family Friendly',
  },
  '1649900369': {
    // No Time To Die
    key: 'Em',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Downtempo',
    },
  },
  o487420672_oxytocin_billie: {
    // Oxytocin
    key: 'Gm',
    rating: 'Supervision Recommended',
  },

  // Björk ____________________________________________________________________
  ArmyOfMe: {
    // Army Of Me
    key: 'Cm',
  },
  SheepQueen_BTSensuality_r: {
    // Big Time Sensuality
    key: 'D#m',
  },
  SheepQ_Bjor_HumaBeha_rb3c: {
    // Human Behaviour
    key: 'Am',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
  },

  // Blank Banshee ____________________________________________________________________
  bbanshee_pregnant: {
    // Teen Pregnancy
    key: 'Dm',
  },

  // Bon Iver ____________________________________________________________________
  '715creeks': {
    // 715 - CREEKS
    key: 'Ab',
    rating: 'Supervision Recommended',
  },
  Ollie_Holocene: {
    // Holocene
    key: 'Db',
    genre: {
      genre: 'Indie Rock',
      sub_genre: 'Post Rock',
    },
  },

  // Brad Sucks ____________________________________________________________________
  BS_BadAttraction: {
    // Bad Attraction
    key: 'Em',
  },
  BS_BadSign: {
    // Bad Sign
    key: 'Eb',
  },
  BS_Borderline: {
    // Borderline
    key: 'Em',
  },
  BS_CertainDeath: {
    // Certain Death
    key: 'D',
  },
  BS_Dirtbag: {
    // Dirtbag
    key: 'F#m',
  },
  BS_DroppingOutOfSchool_rb: {
    // Dropping Out of School
    name: 'Dropping Out of School',
    key: 'Dm',
  },
  BS_FakeIt: {
    // Fake It
    key: 'Gm',
  },
  BS_FixingMyBrain: {
    // Fixing My Brain
    key: 'D',
  },
  BS_Gasoline: {
    // Gasoline
    key: 'E',
  },
  BS_IThinkIStartedTrend_rb: {
    // I Think I Started a Trend
    key: 'F',
  },
  BS_LookFeelYearsYounger_r: {
    // Look and Feel Years Younger
    key: 'Gm',
  },
  MakingMeNervous: {
    // Making Me Nervous
    key: 'Dm',
  },
  BS_NeverGetOut: {
    // Never Get Out
    key: 'C#m',
  },
  BS_OutOfIt: {
    // Out of It
    key: 'D',
  },
  BS_Overreacting: {
    // Overreacting
    key: 'A',
  },
  BS_SickAsADog: {
    // Sick as a Dog
    key: 'Am',
  },
  BS_TheresSomethingWrong_r: {
    // There's Something Wrong
    key: 'D',
  },
  BS_TimeTakeOutTrash_rb3co: {
    // Time to Take Out the Trash
    key: 'A',
  },
  BS_TotalBreakdown: {
    // Total Breakdown
    key: 'Bb',
  },
  BS_UnderstoodByYourDad_rb: {
    // Understood by Your Dad
    key: 'C#m',
  },
  BS_WorkOutFine: {
    // Work Out Fine
    key: 'Ab',
  },
  BS_YoureNotGoingAnywhere_: {
    // You're Not Going Anywhere
    key: 'C',
  },

  // Britney Spears
  babyonemoretimev1: {
    // ...Baby One More Time
    key: 'Cm',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  'Brit_Crim_v#': {
    // Criminal
    key: 'G',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  EMailMyHeart: {
    // E-Mail My Heart
    key: 'C',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  BritneySpearsHoldItAgains: {
    // Hold It Against Me
    key: 'Cm',
    rating: 'Supervision Recommended',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  Lucky: {
    // Lucky
    key: 'Db',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  oohlala: {
    // Ooh La La
    key: 'F#',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  BS_OIDIA: {
    // Oops!... I Did It Again
    key: 'C#m',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  'M12O_TillTheWorldEndsv#_r': {
    // Till The World Ends
    key: 'Eb',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  toxicv10: {
    // Toxic
    key: 'Cm',
    rating: 'Supervision Recommended',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },
  'M12OBSWmnzrv#': {
    // Womanizer
    key: 'C#m',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Dance',
    },
  },

  // C418 ____________________________________________________________________
  NoSoyYuriMinecraft: {
    // Minecraft
    key: 'F#',
  },
  NoSoyYuriStal: {
    // Stal
    key: 'Dm',
  },
  NoSoyYuriWetHands: {
    // Wet Hands
    key: 'A',
  },

  // Daft Punk
  DPAerodynamic: {
    // Aerodynamic
    key: 'Bm',
    author: 'Nightmare Lyre',
  },
  DPAroundTheWorld: {
    // Around The World
    key: 'Am',
    author: 'Nightmare Lyre',
  },
  DPDaFunkLive: {
    // Da Funk / Daftendirekt (Live)
    key: 'Gm',
    author: 'Nightmare Lyre',
  },
  DPDigitalLove: {
    // Digital Love
    key: 'A',
    author: 'Nightmare Lyre',
  },
  DPDoingItRight: {
    // Doin' It Right (ft. Panda Bear)
    key: 'Ebm',
    author: 'Nightmare Lyre',
  },
  DPFaceToFace: {
    // Face to Face (ft. Todd Edwards)
    key: 'G#m',
    author: 'Nightmare Lyre',
  },
  fragmentsoftimev1: {
    // Fragments of Time (ft. Todd Edwards)
    name: 'Fragments of Time (ft. Todd Edwards)',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Disco',
    },
    key: 'C',
    author: 'egead',
  },
  DPGetLucky1x: {
    // Get Lucky (ft. Pharrell Williams)
    key: 'F#m',
    author: 'Nightmare Lyre / TrojanNemo',
  },
  DPGetLucky2x: {
    // Get Lucky (ft. Pharrell Williams)
    key: 'F#m',
    author: 'Nightmare Lyre / TrojanNemo',
  },
  dpgivelifetomusic: {
    // Give Life Back to Music
    key: 'Am',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Disco',
    },
    rating: 'Family Friendly',
    author: 'Ultimate_MANG0',
  },
  DPHarderBetter: {
    // Harder, Better, Faster, Stronger
    key: 'F#m',
    author: 'Nightmare Lyre / TrojanNemo',
  },
  ic: {
    // Instant Crush (ft. Julian Casablancas)
    name: 'Instant Crush (ft. Julian Casablancas)',
    key: 'Bbm',
    genre: {
      genre: 'R&B/Soul/Funk',
      sub_genre: 'Disco',
    },
    author: 'Saul1616',
  },
  DPOneMoreTime: {
    // One More Time
    key: 'D',
    author: 'Nightmare Lyre / TrojanNemo',
  },
  loseyourself34: {
    // Lose Yourself to Dance (ft. Pharrell Williams)
    name: 'Lose Yourself to Dance (ft. Pharrell Williams)',
    key: 'Bbm',
    author: 'veritasisacerbus',
  },
  o255841196_robotrock_daftp: {
    // Robot Rock
    key: 'Dm',
    rating: 'Family Friendly',
    encoding: 'latin1',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Techno',
    },
    author: 'veritasisacerbus / GeeForce11',
  },
  robotrockug: {
    // Robot Rock
    key: 'Dm',
    rating: 'Family Friendly',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Techno',
    },
    author: 'veritasisacerbus',
  },
  sheepqueen_humanafter: {
    // Human After All
    key: 'Bm',
    rating: 'Family Friendly',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Techno',
    },
    author: 'TheSheepQueen',
  },
  somethingaboutC3: {
    // Something About You
    key: 'Dm',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Downtempo',
    },
    author: 'MiltoniusPrime / Nightmare Lyre'
  },
  touchv1: {
    // Touch (ft. Paul Williams)
    name: 'Touch (ft. Paul Williams)',
    key: 'F#m',
    author: 'egead',
  },

  // Daughter ____________________________________________________________________
  newways: {
    key: 'D',
    author: 'Suburbia'
  },

  // David Bowie ____________________________________________________________________
  alwayscrashing: {
    // Always Crashing in the Same Car
    key: 'C',
    genre: {
      genre: 'Rock',
      sub_genre: 'Rock and Roll'
    },
    rating: 'Supervision Recommended'
  },
  bemywife: {
    // Be My Wife
    key: 'Am',
    genre: {
      genre: 'Rock',
      sub_genre: 'Rock and Roll'
    },
    rating: 'Family Friendly'
  },
  bowiejeangeniev1: {
    // The Jean Genie
    key: 'E'
  },
  bowiesoullovev2: {
    // Soul Love
    genre: {
      genre: 'Glam',
      sub_genre: 'Glam'
    },
    rating: 'Supervision Recommended'
  },
  breakingglass: {
    // Breaking Glass
    rating: 'Supervision Recommended',
    key: 'A',
    genre: {
      genre: 'Rock',
      sub_genre: 'Rock and Roll'
    },
  },
  ch_girl_190216a: {
    // China Girl
    genre: {
      genre: 'Glam',
      sub_genre: 'Glam'
    },
    album: {
      name: 'Let\'s Dance'
    },
    key: 'G',
    rating: 'Supervision Recommended'
  },
  changes_v1: {
    // Changes
    key: 'C'
  },
  cut_blackstar: {
    // Blackstar
    key: 'B',
    genre: {
      genre: 'Rock',
      sub_genre: 'Other'
    }
  },
  dancinginthestreet_v1: {
    // Dancing in the Street
    key: 'B',
    album: {
      name: 'Dancing in the Street'
    }
  },
  davidbowieashestoashesv7: {
    // Ashes to Ashes
    key: 'Db'
  },
  davidbowieprettythingsv3: {
    // Oh! You Pretty Things
    key: 'F#'
  },
  davidbowiestarman: {
    // Starman
    key: 'F'
  },
  dbowieallthemadmen: {
    // All The Madmen
    key: 'E',
  },
  fiveyears: {
    // Five Years
    key: 'G',
    rating: 'Family Friendly'
  },
  goldenyears: {
    // Golden Years
    key: 'F#'
  },
  heroesoriginal_07sep2018: {
    // Heroes (Original Version)
    key: 'D'
  },
  ImAfraidOfAmericans_V11x: {
    // I'm Afraid of Americans (V1 Mix) (ft. Nine Inch Nails)
    name: 'I\'m Afraid of Americans (V1 Mix) (ft. Nine Inch Nails)',
    album: {
      track_number: 8
    },
    key: 'Bb'
  },
  ImAfraidOfAmericans_V12x: {
    // I'm Afraid of Americans (V1 Mix) (ft. Nine Inch Nails) (2x Bass Pedal)
    name: 'I\'m Afraid of Americans (V1 Mix) (ft. Nine Inch Nails) (2x Bass Pedal)',
    album: {
      track_number: 8
    },
    key: 'Bb'
  },
  lazarus: {
    // Lazarus
    key: 'Am',
    rating: 'Supervision Recommended',
    genre: {
      genre: 'Rock',
      sub_genre: 'Other'
    }
  },
  newcareerinnewtown: {
    // A New Career In a New Town
    key: 'C',
    genre: {
      genre: 'Glam',
      sub_genre: 'Glam'
    },
    rating: 'Family Friendly'
  },
  noplan: {
    // No Plan
    key: 'D',
    rating: 'Family Friendly',
    album: {
      name: 'No Plan EP',
      track_number: 2
    },
    year_released: 2017,
  },

  // Depeche Mode ____________________________________________________________________
  o24823057_barrelofagun_dep: {
    // Barrel of a Gun
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
    key: 'E',
  },
  behindthewheel_dm: {
    // Behind the Wheel
    key: 'Dm',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
    rating: 'Supervision Recommended',
  },
  o246657559_brokenlivestudi: {
    // Broken (Live Studio Session)
    key: 'Fm',
    rating: 'Family Friendly',
    album: {
      name: 'Delta Machine (Live Studio Session)',
    },
  },
  EnjoytheSilence_pro: {
    // Enjoy the Silence
    key: 'Eb',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
  },
  SheepQueen_EnjoySilence04: {
    // Enjoy The Silence (Reinterpreted) (ft. Mike Shinoda)
    name: 'Enjoy the Silence (Reinterpreted) (ft. Mike Shinoda)',
    key: 'Eb',
  },
  o29972202_ghostsagain_depe: {
    // Ghost Again
    key: 'A',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
  },
  1649900104: {
    // Heroes
    key: 'D',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
  },
  1649900182: {
    // Home
    key: 'Ab',
  },
  ud_ifeelyou: {
    // I Feel You
    key: 'Am',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
  },
  1547711256: {
    // John the Revelator
    name: 'John the Revelator',
    key: 'G#m',
    album: { name: 'Playing the Angel' },
  },
  far_justcantgetenough_rb3: {
    // Just Can't Get Enough
    key: 'G',
  },
  1649900260: {
    // Martyr
    key: 'G#m',
  },
  1649900350: {
    // Precious
    key: 'D#m',
    album: { name: 'Playing the Angel' },
  },
  1649900112: {
    // A Question of Time
    key: 'Gm',
  },
  1547707683: {
    // Shake the Disease
    name: 'Shake the Disease',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
    key: 'F',
  },
  o571833423_stripped_depec: {
    // Stripped
    key: 'Dm',
    genre: {
      genre: 'Pop/Dance/Electronic',
      sub_genre: 'Electronica',
    },
    rating: 'Supervision Recommended',
  },
  1547700699: {
    // Suffer Well
    key: 'Em',
    album: { name: 'Playing the Angel' },
  },
  1649900105: {
    // Wrong
    key: 'Bm',
  },

  // Troye Sivan ____________________________________________________________________
  DanceToThisJIM: {
    name: 'Dance to This (ft. Ariana Grande)',
  },

  // will.i.am
  ScreamAndShout: {
    // Scream & Shout (ft. Britney Spears)
    key: 'Dm',
  },
}

export const stringifyC3LibraryPatch = (): LibraryStringifyReturnObject => {
  const content = stringifySongUpdates(C3LibraryPatch, { inline: true })
  const enc = detectBufferEncoding(content)

  return {
    content,
    enc,
  }
}
