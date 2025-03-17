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
  const { apostropheOnKey, keyAndValueInline } = formatOptions ?? DTAIO.formatOptions.defaultMAGMA.string
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    if (keyAndValueInline === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    io.write(dtaRenderKey(key, apostropheOnKey))
    if (keyAndValueInline === 'true') io.write(' ')
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
  const { apostropheOnKey, keyAndValueInline, apostropheOnVariable } = formatOptions ?? DTAIO.formatOptions.defaultMAGMA.variable
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    if (keyAndValueInline === 'expanded') {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    io.write(dtaRenderKey(key, apostropheOnKey))
    if (keyAndValueInline === 'true') io.write(' ')
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
  const { apostropheOnKey } = formatOptions ?? DTAIO.formatOptions.defaultMAGMA.number
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
  const { apostropheOnKey, floatMaxDecimals } = formatOptions ?? DTAIO.formatOptions.defaultMAGMA.number
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
  const { apostropheOnKey, type } = formatOptions ?? DTAIO.formatOptions.defaultMAGMA.boolean
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

export const dtaRenderObject = (key: string | null, value: ObjectValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: RequiredDeep<DTAIOFormattingOptions>) => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const options = formatOptions ?? DTAIO.formatOptions.defaultMAGMA
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    if (options.object.keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    io.write(dtaRenderKey(key, options.object.apostropheOnKey))
    io.write(tabNewLineFormatter(`{n}`))
  }

  for (const objKey of Object.keys(value.__value)) {
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
    if (options.object.keyAndValueInline === 'expanded') io.write(tabNewLineFormatter('{t}'.repeat(tabAmount)))
    io.write(tabNewLineFormatter(`){n}`))
  }

  if (!internalIO) return io.toBuffer().toString()
}

export const dtaRenderArray = (key: string | null, value: ArrayValueObject, tabAmount: number, io?: BinaryWriter | null, formatOptions?: RequiredDeep<DTAIOFormattingOptions>) => {
  const internalIO = io !== undefined && io !== null
  io = io ?? new BinaryWriter()
  const isArrayPopulated = value.__value.length > 0
  const options = setDefaultOptions<RequiredDeep<DTAIOFormattingOptions>>(DTAIO.formatOptions.defaultMAGMA, formatOptions)
  if (key) {
    if (tabAmount > 0) io.write('\t'.repeat(tabAmount))
    io.write('(')
    if (options.array.keyAndValueInline === 'expanded' && isArrayPopulated) {
      io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    }
    io.write(dtaRenderKey(key, options.array.apostropheOnKey))
    if (options.array.keyAndValueInline === 'true' && isArrayPopulated) io.write(' ')
    else if (!isArrayPopulated) io.write('')
    else io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    if (isArrayPopulated && options.array.parenthesisForValues) io.write('(')
  }

  for (let listObjIndex = 0; listObjIndex < value.__value.length; listObjIndex++) {
    const listObj = value.__value[listObjIndex]
    const listObjVal = DTAIO.valueToObject(listObj, formatOptions)
    if (listObjVal.__type === 'string') {
      const val = dtaRenderString(null, listObjVal, 0, null, setDefaultOptions(options.string, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    } else if (listObjVal.__type === 'str_var') {
      const val = dtaRenderVariable(null, listObjVal, 0, null, setDefaultOptions(options.variable, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    } else if (listObjVal.__type === 'number') {
      const val = dtaRenderNumber(null, listObjVal, 0, null, setDefaultOptions(options.number, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    } else if (listObjVal.__type === 'float') {
      const val = dtaRenderFloat(null, listObjVal, 0, null, setDefaultOptions(options.number, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    } else if (listObjVal.__type === 'boolean') {
      const val = dtaRenderBoolean(null, listObjVal, 0, null, setDefaultOptions(options.boolean, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    } else if (listObjVal.__type === 'object') {
      const val = dtaRenderObject(null, listObjVal, 0, null, setDefaultOptions(options, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    } else {
      const val = dtaRenderArray(null, listObjVal, 0, null, setDefaultOptions(options, listObjVal.__options))
      if (val) io.write(val)
      if (value.__value.length !== listObjIndex + 1) io.write(' ')
    }
  }

  if (key) {
    if (isArrayPopulated && options.array.parenthesisForValues) io.write(')')
    if (options.array.keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}){n}`))
    else io.write(tabNewLineFormatter(`){n}`))
  }

  if (!internalIO) return io.toBuffer().toString()
}
