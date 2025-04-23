import { BinaryWriter } from 'binary-rw'
import { setDefaultOptions } from 'set-default-options'
import type { RequiredDeep } from 'type-fest'
import { DTAIO, quoteToSlashQ, tabNewLineFormatter, type ArrayValueObject, type BooleanFormattingOptions, type BooleanValueObject, type DTAIOAddValueTypes, type DTAIOFormattingOptions, type FloatValueObject, type NumberAndFloatFormattingOptions, type NumberValueObject, type ObjectValueObject, type StringFormattingOptions, type StringValueObject, type StringVariableFormattingOptions, type StringVariableValueObject } from '../../lib'

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

    let objKeyIndex = 0
    for (const objKey of objValues) {
      const val = DTAIO.valueToObject(value.__value[objKey] as DTAIOAddValueTypes, options)

      if (val.__type === 'string') {
        const content = dtaRenderString(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      } else if (val.__type === 'str_var') {
        const content = dtaRenderVariable(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      } else if (val.__type === 'number') {
        const content = dtaRenderNumber(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      } else if (val.__type === 'float') {
        const content = dtaRenderFloat(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      } else if (val.__type === 'boolean') {
        const content = dtaRenderBoolean(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      } else if (val.__type === 'object') {
        const content = dtaRenderObject(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      } else if (val.__type === 'array') {
        const content = dtaRenderArray(objKey, val, tabAmount + 1, null, val.__options)
        if (content) io.write(content.slice(0, -1))
      }

      objKeyIndex++
      if (objKeyIndex !== objValues.length) {
        io.write('\n')
      } else if (!options.object.closeParenthesisInline) io.write('\n')
    }

    if (key) {
      if (!options.object.closeParenthesisInline) io.write(tabNewLineFormatter('{t}'.repeat(tabAmount)))
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

    if (options.array.keyAndValueInline === 'expanded' && isArrayPopulated) io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))

    io.write(dtaRenderKey(key, options.array.apostropheOnKey))

    if (!isArrayPopulated) io.write('')
    else if (options.array.keyAndValueInline === true) io.write(' ')
    else io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))

    if (isArrayPopulated) {
      if (options.array.parenthesisForValues) {
        io.write('(')
        if (options.array.keyAndValueInline === 'expanded' && !options.array.openParenthesisInline) io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 2)}`))
      }
    }
  }

  for (let listObjIndex = 0; listObjIndex < value.__value.length; listObjIndex++) {
    const listObj = value.__value[listObjIndex]
    const listObjVal = DTAIO.valueToObject(listObj, formatOptions)
    if (listObjVal.__type === 'string') {
      const val = dtaRenderString(null, listObjVal, tabAmount, null, setDefaultOptions(options.string, listObjVal.__options))
      if (val) io.write(val)
    } else if (listObjVal.__type === 'str_var') {
      const val = dtaRenderVariable(null, listObjVal, tabAmount, null, setDefaultOptions(options.variable, listObjVal.__options))
      if (val) io.write(val)
    } else if (listObjVal.__type === 'number') {
      const val = dtaRenderNumber(null, listObjVal, tabAmount, null, setDefaultOptions(options.number, listObjVal.__options))
      if (val) io.write(val)
    } else if (listObjVal.__type === 'float') {
      const val = dtaRenderFloat(null, listObjVal, tabAmount, null, setDefaultOptions(options.number, listObjVal.__options))
      if (val) io.write(val)
    } else if (listObjVal.__type === 'boolean') {
      const val = dtaRenderBoolean(null, listObjVal, tabAmount, null, setDefaultOptions(options.boolean, listObjVal.__options))
      if (val) io.write(val)
    } else if (listObjVal.__type === 'object') {
      const val = dtaRenderObject(null, listObjVal, tabAmount, null, setDefaultOptions(options, listObjVal.__options))
      if (val) {
        const formattedVal = val
          .split('\n')
          .filter((str) => Boolean(str))
          .map((str, strIndex) => {
            if (strIndex === 0) {
              return `${tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 2)}`)}${str.slice(1)}`
            } else if (strIndex !== val.split('\n').length - 1) return `${tabNewLineFormatter('{t}'.repeat(tabAmount + 2))}${str.slice(1)}`
            else return `${tabNewLineFormatter('{t}'.repeat(tabAmount + 2))}${str.slice(1)}`
          })
          .filter((str) => Boolean(str))
          .join('\n')
          .split('\n')
          .filter((str) => Boolean(str))
          .join('\n')
        io.write(`\n${formattedVal}`)
      }
      if (value.__value.length === listObjIndex + 1) io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
    } else if (listObjVal.__type === 'array') {
      const val = dtaRenderArray(null, listObjVal, tabAmount, null, setDefaultOptions(options, listObjVal.__options))
      if (val) io.write(val)
    }
    if (value.__value.length !== listObjIndex + 1) io.write(' ')
  }

  if (key) {
    if (isArrayPopulated) {
      if (options.array.parenthesisForValues) {
        if (options.array.keyAndValueInline === 'expanded' && !options.array.closeParenthesisInline) io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount + 1)}`))
        io.write(')')
      }
      if (options.array.keyAndValueInline === 'expanded') io.write(tabNewLineFormatter(`{n}${'{t}'.repeat(tabAmount)}`))
    }

    io.write(tabNewLineFormatter(`){n}`))
  }

  if (!internalIO) return io.toBuffer().toString()
}
