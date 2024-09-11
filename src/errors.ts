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