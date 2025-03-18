import { setDefaultOptions } from 'set-default-options'
import type { RequiredDeep } from 'type-fest'
import { BinaryWriter, DTAIO, quoteToSlashQ, tabNewLineFormatter, type ArrayValueObject, type BooleanFormattingOptions, type BooleanValueObject, type DTAIOAddValueTypes, type DTAIOFormattingOptions, type FloatValueObject, type NumberAndFloatFormattingOptions, type NumberValueObject, type ObjectValueObject, type StringFormattingOptions, type StringValueObject, type StringVariableFormattingOptions, type StringVariableValueObject } from '../../lib'

export const dtaRenderKey = (key: string, apostropheOnKey: boolean): string => {
  let content = ''
  if (apostropheOnKey) content += "'"
  content += isNaN(Number(key)) ? key : apostropheOnKey ? key : `'${key}'`
  if (apostropheOnKey) content += "'"
  return content
}

export const dtaRenderString = (key: string | null, value: StringValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: Required<StringFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const { apostropheOnKey, keyAndValueInline } = setDefaultOptions<Required<StringFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA.string, formatOptions)
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    if (keyAndValueInline === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    io.write(dtaRenderKey(key, apostropheOnKey))
    if (keyAndValueInline === true) io.write(' ')
    else io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
  }

  io.write('"')
  io.write(quoteToSlashQ(value.__value))
  io.write('"')

  if (key) {
    if (keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}`))
    io.write(tabNewLineFormatter('){n}'))
  }

  if (!internalIO) return io.toBuffer().toString()
}

export const dtaRenderVariable = (key: string | null, value: StringVariableValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: Required<StringVariableFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const { apostropheOnKey, keyAndValueInline, apostropheOnVariable } = setDefaultOptions<Required<StringVariableFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA.variable, formatOptions)
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    if (keyAndValueInline === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    io.write(dtaRenderKey(key, apostropheOnKey))
    if (keyAndValueInline === true) io.write(' ')
    else io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
  }

  if (apostropheOnVariable) io.write("'")
  io.write(quoteToSlashQ(value.__value))
  if (apostropheOnVariable) io.write("'")

  if (key) {
    if (keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}`))
    io.write(tabNewLineFormatter('){n}'))
  }

  if (!internalIO) return io.toBuffer().toString()
}

export const dtaRenderNumber = (key: string | null, value: NumberValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: Required<NumberAndFloatFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const { apostropheOnKey } = setDefaultOptions<Required<NumberAndFloatFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA.number, formatOptions)
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    io.write(dtaRenderKey(key, apostropheOnKey))
    io.write(' ')
  }
  io.write(value.__value.toFixed())
  if (key) io.write(tabNewLineFormatter('){n}'))

  if (!internalIO) return io.toBuffer().toString()
}

export const dtaRenderFloat = (key: string | null, value: FloatValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: Required<NumberAndFloatFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const { apostropheOnKey, floatMaxDecimals } = setDefaultOptions<Required<NumberAndFloatFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA.number, formatOptions)
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    io.write(dtaRenderKey(key, apostropheOnKey))
    io.write(' ')
  }
  io.write(value.__value.toFixed(floatMaxDecimals))
  if (key) io.write(tabNewLineFormatter('){n}'))

  if (!internalIO) return io.toBuffer().toString()
}

export const dtaRenderBoolean = (key: string | null, value: BooleanValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: Required<BooleanFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const { apostropheOnKey, type } = setDefaultOptions<Required<BooleanFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA.boolean, formatOptions)
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    io.write(dtaRenderKey(key, apostropheOnKey))
    io.write(' ')
  }
  io.write(type === 'verbosed' ? String(value.__value).toUpperCase() : Number(value.__value).toFixed())
  if (key) io.write(tabNewLineFormatter('){n}'))

  if (!internalIO) return io.toBuffer().toString()
}

export const dtaRenderObject = (key: string | null, value: ObjectValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: RequiredDeep<DTAIOFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const objValues = Object.keys(value.__value)
  const isObjectPopulated = objValues.length > 0
  const options = setDefaultOptions<RequiredDeep<DTAIOFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA, formatOptions)
  if (isObjectPopulated) {
    if (key) {
      if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
      io.write('(')
      if (options.object.keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
      io.write(dtaRenderKey(key, options.object.apostropheOnKey))
      if (options.object.keyAndValueInline !== true) io.write(tabNewLineFormatter(`{n}`))
    }

    for (const objKey of objValues) {
      const val = DTAIO.valueToObject(value.__value[objKey] as DTAIOAddValueTypes, options)

      switch (val.__type) {
        case 'string':
          dtaRenderString(objKey, val, tabAmount + 1, io, val.__options)
          break
        case 'str_var':
          dtaRenderVariable(objKey, val, tabAmount + 1, io, val.__options)
          break
        case 'number':
          dtaRenderNumber(objKey, val, tabAmount + 1, io, val.__options)
          break
        case 'float':
          dtaRenderFloat(objKey, val, tabAmount + 1, io, val.__options)
          break
        case 'boolean':
          dtaRenderBoolean(objKey, val, tabAmount + 1, io, val.__options)
          break
        case 'object':
          dtaRenderObject(objKey, val, tabAmount + 1, io, val.__options)
          break
        case 'array':
          dtaRenderArray(objKey, val, tabAmount + 1, io, val.__options)
      }
    }

    if (key) {
      if (options.object.keyAndValueInline === 'expanded' && !options.object.closeParenthesisInline) io.write(tabNewLineFormatter('{t}'.repeat(tabAmount)))
      else if (!options.object.closeParenthesisInline) io.write(tabNewLineFormatter(`{n}`))
      io.write(tabNewLineFormatter(`){n}`))
    }

    if (!internalIO) return io.toBuffer().toString()
  }
  return ''
}

export const dtaRenderArray = (key: string | null, value: ArrayValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: RequiredDeep<DTAIOFormattingOptions>): string | undefined => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const isArrayPopulated = value.__value.length > 0
  const options = setDefaultOptions<RequiredDeep<DTAIOFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA, formatOptions)

  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    io.write(dtaRenderKey(key, options.array.apostropheOnKey))
  }

  if (key) {
    io.write(tabNewLineFormatter(`){n}`))
  }

  if (!internalIO) return io.toBuffer().toString()
}
