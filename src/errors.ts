/**
 * An error that occurs when a provided path resolves to a file
 * that does not exists on the file system.
 * - - - -
 */
export class FileNotFoundError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'FileNotFoundError'
    Error.captureStackTrace(this, FileNotFoundError)
    Object.setPrototypeOf(this, FileNotFoundError.prototype)
  }
}

/**
 * A generic error that's thrown by the `ImgFile` class.
 * - - - -
 */
export class ImgFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'ImgFileError'
    Error.captureStackTrace(this, ImgFileError)
    Object.setPrototypeOf(this, ImgFileError.prototype)
  }
}

/**
 * A generic error that's thrown by the `TextureFile` class.
 * - - - -
 */
export class TextureFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'TextureFileError'
    Error.captureStackTrace(this, TextureFileError)
    Object.setPrototypeOf(this, TextureFileError.prototype)
  }
}

/**
 * A generic error that's thrown by the `MIDIFile` class.
 * - - - -
 */
export class MIDIFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'MIDIFileError'
    Error.captureStackTrace(this, MIDIFileError)
    Object.setPrototypeOf(this, MIDIFileError.prototype)
  }
}

/**
 * A generic error that's thrown by the `STFSFile` class.
 * - - - -
 */
export class STFSFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'STFSFileError'
    Error.captureStackTrace(this, STFSFileError)
    Object.setPrototypeOf(this, STFSFileError.prototype)
  }
}

/**
 * A generic error that's thrown by the `MOGGFile` class.
 * - - - -
 */
export class MOGGFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'MOGGFileError'
    Error.captureStackTrace(this, MOGGFileError)
    Object.setPrototypeOf(this, MOGGFileError.prototype)
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
  constructor(message = '') {
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
  constructor(message = '') {
    super(message)
    this.name = 'FileConvertionError'
    Error.captureStackTrace(this, FileConvertionError)
    Object.setPrototypeOf(this, FileConvertionError.prototype)
  }
}

/**
 * An error that occurs when you use an executable and
 * it returns an error through `stderr`.
 * - - - -
 */
export class ExecutableError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'ExecutableError'
    Error.captureStackTrace(this, ExecutableError)
    Object.setPrototypeOf(this, ExecutableError.prototype)
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
  constructor(message = '') {
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
  constructor(message = '') {
    super(message)
    this.name = 'ValueError'
    Error.captureStackTrace(this, ValueError)
    Object.setPrototypeOf(this, ValueError.prototype)
  }
}

/**
 * A generic error that's thrown by the `OnyxCLI` class.
 * - - - -
 */
export class OnyxCLIError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'OnyxCLIError'
    Error.captureStackTrace(this, OnyxCLIError)
    Object.setPrototypeOf(this, OnyxCLIError.prototype)
  }
}

/**
 * An error that occurs when fetching an image from the internet.
 * - - - -
 */
export class ImageFetchingError extends Error {
  /**
   * The number of the error that was returned from the URL fetching.
   *
   * Non-valid URLs will return a code `500 INTERNAL SERVER ERROR`.
   */
  code: number
  /**
   * @param {string} message The message you want to display.
   * @param {number} code The error code. Default is `500 INTERNAL SERVER ERROR`
   */
  constructor(message = '', code = 500) {
    super(message)
    this.code = code
    this.name = 'ImageFetchingError'
    Error.captureStackTrace(this, ImageFetchingError)
    Object.setPrototypeOf(this, ImageFetchingError.prototype)
  }
}

/**
 * An error that occurs when fetching a request from RhythmVerse.
 * - - - -
 */
export class RhythmverseAPIFetchingError extends Error {
  /**
   * The number of the error that was returned from the URL fetching.
   *
   * Non-valid URLs will return a code `500 INTERNAL SERVER ERROR`.
   */
  code: number
  /**
   * @param {string} message The message you want to display.
   * @param {number} code The error code. Default is `500 INTERNAL SERVER ERROR`
   */
  constructor(message = '', code = 500) {
    super(message)
    this.code = code
    this.name = 'RhythmverseAPIFetchingError'
    Error.captureStackTrace(this, RhythmverseAPIFetchingError)
    Object.setPrototypeOf(this, RhythmverseAPIFetchingError.prototype)
  }
}

/**
 * A generic error that occurs throughout the `RBDTA-JS` package functionality.
 * - - - -
 */
export class RBDTAJSError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'RBDTAError'
    Error.captureStackTrace(this, RBDTAJSError)
    Object.setPrototypeOf(this, RBDTAJSError.prototype)
  }
}

/**
 * An error that occurs when a `DTAParser` class with type `complete` received incomplete parsed
 * song objects to parse (possibly a DTA with updates, not actually a `songs.dta` file). Set the `type`
 * parameter where you initialized the class instance to `partial` to work.
 * - - - -
 */
export class WrongDTATypeError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'WrongDTATypeError'
    Error.captureStackTrace(this, WrongDTATypeError)
    Object.setPrototypeOf(this, WrongDTATypeError.prototype)
  }
}

/**
 * A generic error that's thrown by the `BinaryWriter` class.
 * - - - -
 */
export class BinaryWriterError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'BinaryWriterError'
    Error.captureStackTrace(this, BinaryWriterError)
    Object.setPrototypeOf(this, BinaryWriterError.prototype)
  }
}

/**
 * A generic error that's thrown by the `BinaryWriter` class.
 * - - - -
 */
export class BinaryReaderError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'BinaryReaderError'
    Error.captureStackTrace(this, BinaryReaderError)
    Object.setPrototypeOf(this, BinaryReaderError.prototype)
  }
}

/**
 * A generic error that's thrown by the `PACKFile` class.
 * - - - -
 */
export class PACKFileError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'PACKFileError'
    Error.captureStackTrace(this, PACKFileError)
    Object.setPrototypeOf(this, PACKFileError.prototype)
  }
}

/**
 * An error that occurs when a value does not match any declarated map's key value.
 * - - - -
 */
export class UnknownMapValueError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'PACKFileError'
    Error.captureStackTrace(this, PACKFileError)
    Object.setPrototypeOf(this, PACKFileError.prototype)
  }
}

/**
 * A generic error that's thrown by the `DTAParser` class.
 * - - - -
 */
export class DTAParserError extends Error {
  /**
   * @param {string} message The message you want to display.
   */
  constructor(message = '') {
    super(message)
    this.name = 'DTAParserError'
    Error.captureStackTrace(this, DTAParserError)
    Object.setPrototypeOf(this, DTAParserError.prototype)
  }
}
