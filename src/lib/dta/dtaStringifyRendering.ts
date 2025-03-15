/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequiredDeep } from 'type-fest'
import { BinaryWriter, DTAIO, type DTAIOStringifyOptions, type RenderingReturnArray, quoteToSlashQ, tabNewLineFormatter } from '../../lib'

export const dtaRenderString = (key: string, value: string, tabAmount: number, formatOpts: RequiredDeep<DTAIOStringifyOptions>): RenderingReturnArray => {
  const {
    apostropheOnKey,
    string: { apostropheOnVariables, keyAndValueInline, keyAndValueInlineVariable },
  } = formatOpts
  const io = new BinaryWriter()
  const isFirstCharANumber = !isNaN(Number(value[0]))
  const isValueANumber = !isNaN(Number(value))
  const isVarType = value.split(' ').length === 1 && value.toLowerCase() === value && !isValueANumber
  // console.log('key: %s\nvalue: %s\nisFirstCharANumber: %d\nisVarType: %d\nisANumber: %d\n', key, value, Number(isFirstCharANumber), Number(isVarType), Number(isValueANumber))

  if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
  io.write('(')

  if (!isVarType) {
    if (keyAndValueInline === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    if (apostropheOnKey) io.write("'")
    io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
    if (apostropheOnKey) io.write("'")
    if (keyAndValueInline === 'true') io.write(' ')
    else io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
  } else {
    if (isFirstCharANumber && keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    else if (keyAndValueInlineVariable === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    if (apostropheOnKey) io.write("'")
    io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
    if (apostropheOnKey) io.write("'")
    if (isFirstCharANumber && keyAndValueInline === 'true') io.write(' ')
    else if (isFirstCharANumber) io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    else if (keyAndValueInlineVariable === 'true') io.write(' ')
    else io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
  }

  if (!isVarType) {
    io.write(`"${quoteToSlashQ(value)}"`)
    if (keyAndValueInline === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}`))
    }
  } else {
    if (apostropheOnVariables && !isFirstCharANumber) io.write("'")
    else if (apostropheOnVariables && isFirstCharANumber) io.write('"')
    else if (!apostropheOnVariables && isFirstCharANumber) io.write('"')
    io.write(quoteToSlashQ(value))
    if (apostropheOnVariables && !isFirstCharANumber) io.write("'")
    else if (apostropheOnVariables && isFirstCharANumber) io.write('"')
    else if (!apostropheOnVariables && isFirstCharANumber) io.write('"')
    if (isFirstCharANumber && keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}`))
    else if (keyAndValueInlineVariable === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}`))
    }
  }
  io.write(tabNewLineFormatter('){n}'))

  return [io.toBuffer().toString(), tabAmount]
}
export const dtaRenderNumber = (key: string, value: number, tabAmount: number, formatOpts: RequiredDeep<DTAIOStringifyOptions>): RenderingReturnArray => {
  const {
    apostropheOnKey,
    number: { floatMaxDecimals },
  } = formatOpts
  const io = new BinaryWriter()
  const isInteger = Number.isInteger(value)
  if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
  if (isInteger) {
    io.write('(')
    if (apostropheOnKey) io.write("'")
    io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
    if (apostropheOnKey) io.write("'")
    io.write(` ${value.toFixed()}`)
    io.write(tabNewLineFormatter('){n}'))

    return [io.toBuffer().toString('utf8'), tabAmount]
  }
  io.write('(')
  if (apostropheOnKey) io.write("'")
  io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
  if (apostropheOnKey) io.write("'")
  io.write(` ${value.toFixed(floatMaxDecimals)}`)
  io.write(tabNewLineFormatter('){n}'))

  return [io.toBuffer().toString('utf8'), tabAmount]
}
export const dtaRenderFloat = (key: string, value: string, tabAmount: number, formatOpts: RequiredDeep<DTAIOStringifyOptions>): RenderingReturnArray => {
  const {
    apostropheOnKey,
    number: { floatMaxDecimals },
  } = formatOpts
  const io = new BinaryWriter()
  if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
  const formattedValue = Number(value.slice(8, -2)).toFixed(floatMaxDecimals)
  io.write('(')
  if (apostropheOnKey) io.write("'")
  io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
  if (apostropheOnKey) io.write("'")
  io.write(` ${formattedValue}`)
  io.write(tabNewLineFormatter('){n}'))

  return [io.toBuffer().toString('utf8'), tabAmount]
}

export const dtaRenderBoolean = (key: string, value: boolean, tabAmount: number, formatOpts: RequiredDeep<DTAIOStringifyOptions>): RenderingReturnArray => {
  const {
    apostropheOnKey,
    boolean: { type },
  } = formatOpts
  const io = new BinaryWriter()
  if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
  io.write('(')
  if (apostropheOnKey) io.write("'")
  io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
  if (apostropheOnKey) io.write("'")
  io.write(' ')
  if (type === 'verbosed') io.write(String(value).toUpperCase())
  else io.write(Number(value).toFixed())
  io.write(tabNewLineFormatter('){n}'))

  return [io.toBuffer().toString(), tabAmount]
}

export const dtaRenderObject = (key: string, value: any, tabAmount: number, formatOpts: RequiredDeep<DTAIOStringifyOptions>): RenderingReturnArray => {
  const {
    apostropheOnKey,
    object: { keyInline },
  } = formatOpts
  const io = new BinaryWriter()

  if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
  io.write(`(`)
  if (!keyInline) io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
  if (apostropheOnKey) io.write("'")
  io.write(isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`)
  if (apostropheOnKey) io.write("'")
  io.write(tabNewLineFormatter(`{n}`))

  for (const objectKey of Object.keys(value as Record<string, any>)) {
    const objKeyValue = (value as Record<string, any>)[objectKey]
    io.write(DTAIO.selectDTARenderingOption(objectKey, objKeyValue, tabAmount + 1, formatOpts)[0])
  }

  io.write(tabNewLineFormatter(`${'{t}'.repeat(tabAmount)}){n}`))

  return [io.toBuffer().toString(), tabAmount]
}
