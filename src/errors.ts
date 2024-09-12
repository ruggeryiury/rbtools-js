/**
 * An error that occurs when a provided path resolves to a file
 * that does not exists on the file system.
 * - - - -
 */
export class FileNotFoundError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'FileNotFoundError'
    Error.captureStackTrace(this, FileNotFoundError)
    Object.setPrototypeOf(this, FileNotFoundError.prototype)
  }
}

/**
 * An error that generically occurs using the `ImgFile` class.
 * - - - -
 */
export class ImgFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'ImgFileError'
    Error.captureStackTrace(this, ImgFileError)
    Object.setPrototypeOf(this, ImgFileError.prototype)
  }
}

/**
 * An error that generically occurs using the `TextureFile` class.
 * - - - -
 */
export class TextureFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'TextureFileError'
    Error.captureStackTrace(this, TextureFileError)
    Object.setPrototypeOf(this, TextureFileError.prototype)
  }
}

/**
 * An error that occurs when a function logic tries to process a file
 * which format is not recognizable/compatible.
 * - - - -
 */
export class UnknownFileFormatError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'UnknownFileFormatError'
    Error.captureStackTrace(this, UnknownFileFormatError)
    Object.setPrototypeOf(this, UnknownFileFormatError.prototype)
  }
}

/**
 * An error that generally occurs when a function logic tries to process a file
 * which provided arguments are mistakenly provided.
 * - - - -
 */
export class FileConvertionError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'FileConvertionError'
    Error.captureStackTrace(this, FileConvertionError)
    Object.setPrototypeOf(this, FileConvertionError.prototype)
  }
}

/**
 * An error that occurs when you executes a binary executable and
 * it returns an error through `stderr`.
 * - - - -
 */
export class BinaryExecutionError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'BinaryExecutionError'
    Error.captureStackTrace(this, BinaryExecutionError)
    Object.setPrototypeOf(this, BinaryExecutionError.prototype)
  }
}

/**
 * An error that occurs when you executes a python script and
 * it returns an error.
 * - - - -
 */
export class PythonExecutionError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'PythonExecutionError'
    Error.captureStackTrace(this, PythonExecutionError)
    Object.setPrototypeOf(this, PythonExecutionError.prototype)
  }
}

/**
 * An error that occurs when any user provided argument does not pass validation.
 * - - - -
 */
export class ValueError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message: string) {
    super(message)
    this.name = 'ValueError'
    Error.captureStackTrace(this, ValueError)
    Object.setPrototypeOf(this, ValueError.prototype)
  }
}
