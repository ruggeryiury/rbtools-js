import { capitalizeFirstLetter, quoteToSlashQ, type AnimTempoNumbers, type AudioTracksCountObject, type DTAFile, type DTAStringifyFormats, type PartialDTAFile } from '../../lib'

/**
 * Adds tabs at the beginning of each line on a string.
 * - - - -
 * @param {string} text The text to be processed.
 * @param {number} tab The amount of times the tab character will be repeated. Default is `1`.
 * @returns {string} The new formatted string.
 */
export const addTabToAllLines = (text: string, tab = 1): string => {
  const newText = text
    .split('\n')
    .slice(0, -1)
    .map((t) => `${'\t'.repeat(tab)}${t}`)
    .join('\n')
  return `${newText}\n`
}

/**
 * Replaces `{n}` to new line characters and `{t}` to tab characters on a string.
 * - - - -
 * @param {string} text The text to be processed.
 * @returns {string} The new formatted string.
 */
export const tabNewLineFormatter = (text: string): string => {
  return text.replace(/\{n\}/g, '\n').replace(/\{t\}/g, '\t')
}

/**
 * Renders an opener to any kind of DTA object.
 * - - - -
 * @param {string} name The name of the object.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderSongEntryOpen = (name: string, format: DTAStringifyFormats): string => {
  if (format === 'rbn') return tabNewLineFormatter(`({n}{t}'${name}'{n}`)
  const newName = isNaN(Number(name)) ? name : `'${name}'`
  return tabNewLineFormatter(`(${newName}{n}`)
}

/**
 * Renders a key with values on quotes, with quotes changing to `\q` (code symbol on DTA files).
 * - - - -
 * @param {string} key The key of the value.
 * @param {string} value The text to be placed as value.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderStringOnQuotesValue = (key: string, value: string, format: DTAStringifyFormats): string => {
  if (format === 'rbn') return tabNewLineFormatter(`({n}{t}'${key}'{n}{t}"${quoteToSlashQ(value)}"{n}){n}`)
  return tabNewLineFormatter(`(${key} "${quoteToSlashQ(value)}"){n}`)
}

/**
 * Renders a key with a boolean value.
 * - - - -
 * @param {string} key The key of the value.
 * @param {boolean} value The text to be placed as value.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderBooleanValue = (key: string, value: boolean, format: DTAStringifyFormats): string => {
  const keyValueNum = value ? '1' : '0'
  if (format === 'rbn') return tabNewLineFormatter(`('${key}' ${keyValueNum}){n}`)
  const keyValue = value ? 'TRUE' : 'FALSE'
  return tabNewLineFormatter(`(${key} ${keyValue}){n}`)
}

/**
 * Renders a key with code strings or numbers values.
 * - - - -
 * @param {string} key The key of the value.
 * @param {string | number} value The text to be placed as value.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderNumberOrStringValue = (key: string, value: string | number, format: DTAStringifyFormats): string => {
  const numberValue = Number(value)
  if (typeof value === 'number' && !isNaN(numberValue)) {
    // <-- Number
    if (format === 'rbn') return tabNewLineFormatter(`('${key}' ${numberValue.toFixed()}){n}`)
    return tabNewLineFormatter(`(${key} ${numberValue.toFixed()}){n}`)
  }

  if (format === 'rbn') return tabNewLineFormatter(`('${key}' ${value.toString()}){n}`)
  return tabNewLineFormatter(`(${key} ${value.toString()}){n}`)
}

/**
 * Renders a key as array values.
 * - - - -
 * @param {string} key The key of the value.
 * @param {unknown[]} value The text to be placed as value.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @param {boolean} inlineValues If `true`, the items of the array will be placed on the same line of the key on the DTA. Default is `false`.
 * @param {boolean} valueOnParenthesis If `true`, the items of the array will be placed inside parenthesis. Default is `true`.
 * @returns {string} The new formatted string.
 */
export const renderArray = (key: string, value: unknown[], format: DTAStringifyFormats, inlineValues = false, valueOnParenthesis = true): string => {
  const templateIn = valueOnParenthesis ? '(' : ''
  const templateOut = valueOnParenthesis ? ')' : ''
  if (!inlineValues) {
    if (format === 'rbn') return tabNewLineFormatter(`({n}{t}'${key}'{n}{t}${templateIn}${value.join(' ')}${templateOut}{n}){n}`)
    return tabNewLineFormatter(`(${key} ${templateIn}${value.join(' ')}${templateOut}){n}`)
  }
  if (format === 'rbn') return tabNewLineFormatter(`('${key}' ${templateIn}${value.join(' ')}${templateOut}){n}`)
  return tabNewLineFormatter(`(${key} ${templateIn}${value.join(' ')}${templateOut}){n}`)
}

/**
 * Renders a closing to any kind of DTA object.
 * - - - -
 * @returns {string} The new formatted string.
 */
export const renderSongEntryClose = () => {
  return tabNewLineFormatter(`){n}`)
}

/**
 * Renders default drums cue lines.
 * - - - -
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderDrumsCue = (format: DTAStringifyFormats): string => {
  if (format === 'rbn') return tabNewLineFormatter(`({n}{t}'drum_solo'{n}{t}({n}{t}{t}'seqs'{n}{t}{t}('kick.cue' 'snare.cue' 'tom1.cue' 'tom2.cue' 'crash.cue'){n}{t}){n}){n}({n}{t}'drum_freestyle'{n}{t}({n}{t}{t}'seqs'{n}{t}{t}('kick.cue' 'snare.cue' 'hat.cue' 'ride.cue' 'crash.cue'){n}{t}){n}){n}`)
  return tabNewLineFormatter(`(drum_solo{n}{t}(seqs (kick.cue snare.cue tom1.cue tom2.cue crash.cue)){n}){n}(drum_freestyle{n}{t}(seqs (kick.cue snare.cue hat.cue ride.cue crash.cue)){n}){n}`)
}

/**
 * Renders tracks information of the song.
 * - - - -
 * @param {PartialDTAFile} song A parsed song object
 * @param {AudioTracksCountObject} tracks An object with information about each track of the song.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderTrackMap = (song: DTAFile, tracks: AudioTracksCountObject, format: DTAStringifyFormats): string => {
  let content = ''
  if (format === 'rbn') {
    content += tabNewLineFormatter(`({n}{t}'tracks'{n}{t}({n}`)
    for (const track of Object.keys(tracks) as (keyof AudioTracksCountObject)[]) {
      if (track === 'backing' || track === 'crowd' || track === 'allTracksCount') break
      else {
        const trackChannels = tracks[track]
        if (trackChannels) content += addTabToAllLines(tabNewLineFormatter(`({n}{t}'${track}'{n}{t}(${trackChannels.join(' ')}){n}){n}`), 2)
      }
    }
    content += tabNewLineFormatter(`{t}){n}){n}`)
  } else {
    let i = 0
    const tracksCount = (Object.keys(tracks) as (keyof AudioTracksCountObject)[]).filter((key) => key !== 'allTracksCount' && key !== 'backing' && key !== 'crowd' && tracks[key]).length - 3
    if (tracksCount === 0) content += tabNewLineFormatter(`(tracks (`)
    else content += tabNewLineFormatter(`(tracks{n}{t}(`)
    for (const track of Object.keys(tracks) as (keyof AudioTracksCountObject)[]) {
      if (track === 'backing' || track === 'crowd' || track === 'allTracksCount') break
      else {
        const trackChannels = tracks[track]
        if (trackChannels) {
          if (i === 0 && i !== tracksCount - 1) {
            content += tabNewLineFormatter(`(${track} ${trackChannels.length === 1 ? trackChannels[0].toFixed() : `(${trackChannels.join(' ')})`}){n}`)
          } else if (i === 0 && i === tracksCount - 1) {
            content += tabNewLineFormatter(`(${track} ${trackChannels.length === 1 ? trackChannels[0].toFixed() : `(${trackChannels.join(' ')})`})`)
          } else if (i === tracksCount - 1) {
            content += tabNewLineFormatter(`{t} (${track} ${trackChannels.length === 1 ? trackChannels[0].toFixed() : `(${trackChannels.join(' ')})`})`)
          } else {
            content += tabNewLineFormatter(`{t} (${track} ${trackChannels.length === 1 ? trackChannels[0].toFixed() : `(${trackChannels.join(' ')})`}){n}`)
          }
          i++
        }
      }
    }
    if (tracksCount === 0) content += tabNewLineFormatter(`)){n}`)
    else content += tabNewLineFormatter(`){n}){n}`)
  }

  return content
}

/**
 * Render specific animation tempo values.
 * - - - -
 * @param {AnimTempoNumbers} animTempo The animation tempo of the song.
 * @param {DTAStringifyFormats} format The format of the DTA text you want to render.
 * @returns {string} The new formatted string.
 */
export const renderAnimTempo = (animTempo: AnimTempoNumbers, format: DTAStringifyFormats): string => {
  if (format === 'rbn') return renderNumberOrStringValue('anim_tempo', animTempo, format)
  return renderNumberOrStringValue('anim_tempo', animTempo === 16 ? 'kTempoSlow' : animTempo === 32 ? 'kTempoMedium' : 'kTempoFast', format)
}

/**
 * Renders custom attributes of a song.
 * - - - -
 * @param {PartialDTAFile} song An objects with all values from the song.
 * @returns {string} The new formatted string.
 */
export const renderCustomAttributes = (song: PartialDTAFile): string => {
  let content = ''
  content += '{n};DO NOT EDIT THE FOLLOWING LINES MANUALLY{n};Created using Magma: Rok On Edition v4.0.2{n}'
  content += `;Song authored by ${song.author ?? 'Unknown Charter'}{n}`
  content += `;Song=${song.name ?? ''}{n}`
  if (!song.languages || song.languages.length === 0) content += `;Language(s)=English,{n}`
  else content += `;Language(s)=${song.languages.join(', ')},{n}`

  const karaoke = song.multitrack === 'karaoke'
  content += `;Karaoke=${karaoke ? '1' : '0'}{n}`

  const multitrack = song.multitrack === 'full'
  content += `;Multitrack=${multitrack ? '1' : '0'}{n}`

  const diyStems = song.multitrack === 'diy_stems'
  content += `;DIYStems=${diyStems ? '1' : '0'}{n}`

  const partial = song.multitrack === 'partial'
  content += `;PartialMultitrack=${partial ? '1' : '0'}{n}`

  content += `;UnpitchedVocals=${song.unpitchedVocals ? '1' : '0'}{n}`
  content += `;Convert=${song.convert ? '1' : '0'}{n}`
  content += `;2xBass=${song.doubleKick ? '1' : '0'}{n}`

  const rhythmKeys = song.rhythmOn === 'keys'
  content += `;RhythmKeys=${rhythmKeys ? '1' : '0'}{n}`
  const rhythmBass = song.rhythmOn === 'bass'
  content += `;RhythmBass=${rhythmBass ? '1' : '0'}{n}`

  const CATemh = song.emh === 'cat'
  content += `;CATemh=${CATemh ? '1' : '0'}{n}`
  const expertOnly = song.emh === 'expert_only'
  content += `;ExpertOnly=${expertOnly ? '1' : '0'}{n}`

  return tabNewLineFormatter(content)
}

/**
 * Renders if statements to values.
 * - - - -
 * @param {string} statement The statement to be evaluated.
 * @param {string} validStatementValue The value that will be used if the given statement is true.
 * @param {string} elseValue The value that will be used if the given statement is false.
 * @returns {string} The new formatted string.
 */
export const renderIfDef = (statement: string, validStatementValue: string, elseValue: string): string => {
  return `#ifdef ${statement} ${validStatementValue} #else ${elseValue} #endif`
}
