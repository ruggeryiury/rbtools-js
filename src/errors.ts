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
    Error.captureStackTrace(this, this.constructor)
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
    Error.captureStackTrace(this, this.constructor)
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
    Error.captureStackTrace(this, this.constructor)
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
    Error.captureStackTrace(this, this.constructor)
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
    Error.captureStackTrace(this, this.constructor)
  }
}
