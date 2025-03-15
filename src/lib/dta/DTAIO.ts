/* eslint-disable @typescript-eslint/no-explicit-any */
import { setDefaultOptions } from 'set-default-options'
import type { RequiredDeep } from 'type-fest'
import { dtaRenderBoolean, dtaRenderFloat, dtaRenderNumber, dtaRenderObject, dtaRenderString } from '../../lib'

export interface StringFormattingOptions {
  /** Default is `true`. */
  apostropheOnVariables?: boolean
  /** Default is `expanded`. */
  keyAndValueInline?: 'true' | 'false' | 'expanded'
  /** Default is `true`. */
  keyAndValueInlineVariable?: 'true' | 'false' | 'expanded'
}

export interface NumberFormattingOptions {
  /** Default is `2`. */
  floatMaxDecimals?: number
}

export interface BooleanFormattingOptions {
  /** Default is `number`. */
  type?: 'verbosed' | 'number'
}

export interface ObjectFormattingOptions {
  /** Default is `false`. */
  keyInline?: boolean
  /** Default is `false`. */
  valueInline?: boolean
}

export interface DTAIOStringifyOptions {
  /** Default is `true`. */
  apostropheOnKey?: boolean
  string?: Partial<StringFormattingOptions>
  number?: Partial<NumberFormattingOptions>
  boolean?: Partial<BooleanFormattingOptions>
  object?: Partial<ObjectFormattingOptions>
}

export type RenderingReturnArray = [string, number]

export class DTAIO {
  readonly defaultDTAFormattingOptions: RequiredDeep<DTAIOStringifyOptions> = {
    apostropheOnKey: true,
    string: {
      apostropheOnVariables: true,
      keyAndValueInline: 'expanded',
      keyAndValueInlineVariable: 'true',
    },
    number: {
      floatMaxDecimals: 2,
    },
    boolean: {
      type: 'number',
    },
    object: {
      keyInline: false,
      valueInline: false,
    },
  }
  private content: Record<string, any>
  private tab: number
  private opts: RequiredDeep<DTAIOStringifyOptions>
  constructor(formatOpts?: Partial<DTAIOStringifyOptions>) {
    this.content = {}
    this.tab = 0
    this.opts = setDefaultOptions<DTAIOStringifyOptions>(this.defaultDTAFormattingOptions, formatOpts as RequiredDeep<DTAIOStringifyOptions>)
  }

  addValue<T>(key: string, value: T): void {
    this.content[key] = value
  }

  toJSON<T extends Record<string, any>>(): T {
    return this.content as T
  }

  static selectDTARenderingOption(key: string, value: any, tabAmount: number, formatOpts: RequiredDeep<DTAIOStringifyOptions>): RenderingReturnArray {
    switch (typeof value) {
      case 'string':
        if (value.startsWith('@{float(') && value.endsWith(')}')) return dtaRenderFloat(key, value, tabAmount, formatOpts)
        return dtaRenderString(key, value, tabAmount, formatOpts)
      case 'number':
        return dtaRenderNumber(key, value, tabAmount, formatOpts)
      case 'boolean':
        return dtaRenderBoolean(key, value, tabAmount, formatOpts)
      case 'object':
      default:
        return dtaRenderObject(key, value, tabAmount, formatOpts)
    }
  }

  private deconstrObject(obj: Record<string, any>): string {
    let content = ''

    const objKeys = Object.keys(obj)
    for (const key of objKeys) {
      const [newContent, newTabValue] = DTAIO.selectDTARenderingOption(key, this.content[key], this.tab, this.opts)
      content += newContent
      this.tab = this.tab + newTabValue
    }

    return content
  }

  toString(): string {
    let content = ''
    content += this.deconstrObject(this.content)
    return content
  }
}
