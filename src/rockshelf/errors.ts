import setDefaultOptions from 'set-default-options'

export type RockshelfErrorTypes = 'error' | 'warning' | 'none'

export interface RockshelfErrorOptions {
  /**
   * The type of the error.
   */
  type?: RockshelfErrorTypes
  /**
   * An default message of the error (in English).
   */
  message: string
  /**
   * The key code of the error used in i18n translations.
   */
  code: string
  /**
   * An object with values which will interpolate with the translated text.
   */
  values?: Record<string, string>
}

export interface RockshelfErrorJSONRepresentation {
  /**
   * The type of the error.
   */
  type: RockshelfErrorTypes
  /**
   * The key code of the error used in i18n translations.
   */
  code: string
  /**
   * An object with values which will interpolate with the translated text.
   */
  values: Record<string, string>
}

/**
 * This class formats errors to be parsed and displayed on the renderer process.
 * - - - -
 */
export class RockshelfError extends Error {
  /**
   * The key code of the error used in i18n translations.
   */
  code: string
  /**
   * An object with values which will interpolate with the translated text.
   */
  values: Record<string, string>
  /**
   * The type of the error.
   */
  type: RockshelfErrorTypes

  /**
   * @param {RockshelfErrorOptions} options An object with the data of the error.
   */
  constructor(options: RockshelfErrorOptions) {
    const { code, message, type, values } = setDefaultOptions<RockshelfErrorOptions>({ code: '', message: '', type: 'error', values: {} }, options)
    super(message)
    this.name = 'RockshelfError'
    this.code = code
    this.values = values
    this.type = type
    Error.captureStackTrace(this, RockshelfError)
    Object.setPrototypeOf(this, RockshelfError.prototype)
  }

  /**
   * Returns a JSON representation of the error, formatted to the renderer process.
   * - - - -
   * @returns {RockshelfErrorJSONRepresentation}
   */
  toJSON(): RockshelfErrorJSONRepresentation {
    return {
      code: this.code,
      values: this.values,
      type: this.type,
    }
  }
}
