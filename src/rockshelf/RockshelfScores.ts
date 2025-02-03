import type { PathLikeTypes } from 'path-js'
import { RB3SaveFilePS3, type RB3InstrumentScores, type RB3ScoresObject } from '../rockshelf.js'
import type { RockshelfMainInstrumentsType } from '../rockshelf.js'

export interface RB3InstrumentScoresObject extends RB3InstrumentScores {
  /**
   * The title of the song.
   */
  name?: string
  /**
   * The artist of the song.
   */
  artist?: string
  /**
   * A numerical, unique number ID of the song.
   */
  song_id: number
  /**
   * The lighter rating given to this song.
   */
  lighterRating: number
  /**
   * The amount of times this song were played.
   */
  playCount: number
}

export class RockshelfScores {
  name: string
  scores: RB3ScoresObject[]
  length: number
  mostPlayedInstrument: RockshelfMainInstrumentsType

  constructor(userDataPath: PathLikeTypes) {
    const { profileName, scores } = new RB3SaveFilePS3(userDataPath).parseSaveFile()
    this.name = profileName
    this.scores = scores
    this.length = scores.length
    this.mostPlayedInstrument = this.getMostPlayedInstrument()
  }

  getMostPlayedInstrument(): RockshelfMainInstrumentsType {
    const scores = this.scores
    const results: RockshelfMainInstrumentsType[] = []
    for (const score of scores) {
      if (score.bass.topScore > 0) results.push('bass')
      if (score.drums.topScore > 0) results.push('drums')
      if (score.guitar.topScore > 0) results.push('guitar')
      if (score.vocals.topScore > 0) results.push('vocals')
      if (score.keys.topScore > 0) results.push('keys')
      if (score.proBass.topScore > 0) results.push('real_bass')
      if (score.proDrums.topScore > 0) results.push('real_drums')
      if (score.proGuitar.topScore > 0) results.push('real_guitar')
      if (score.proKeys.topScore > 0) results.push('real_keys')
      if (score.harmonies.topScore > 0) results.push('harmonies')
    }

    const mostFrequent = Array.from(new Set(results)).reduce((prev, curr) => (results.filter((el) => el === curr).length > results.filter((el) => el === prev).length ? curr : prev))

    return mostFrequent
  }

  filterByInstrument(instrument: RockshelfMainInstrumentsType | 'band') {
    const result = this.scores.map((score) => {
      const { song_id, lighterRating, playCount, name, artist, ...instruments } = score
      if (instruments[instrument as keyof typeof instruments].topScore === 0) return false
      const newScore = new Map()
      if (name) newScore.set('name', name)
      if (artist) newScore.set('artist', artist)
      newScore.set('song_id', song_id)
      newScore.set('lighterRating', lighterRating)
      newScore.set('playCount', playCount)
      const { percentEasy, percentExpert, percentHard, percentMedium, starsEasy, starsExpert, starsHard, starsMedium, topScore, topScoreDifficulty } = instruments[instrument as keyof typeof instruments]

      newScore.set('percentEasy', percentEasy)
      newScore.set('percentExpert', percentExpert)
      newScore.set('percentHard', percentHard)
      newScore.set('percentMedium', percentMedium)
      newScore.set('starsEasy', starsEasy)
      newScore.set('starsExpert', starsExpert)
      newScore.set('starsHard', starsHard)
      newScore.set('starsMedium', starsMedium)
      newScore.set('topScore', topScore)
      newScore.set('topScoreDifficulty', topScoreDifficulty)

      return Object.fromEntries(newScore) as RB3InstrumentScoresObject
    })

    return result.filter((score) => Boolean(score))
  }
}
