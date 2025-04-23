import { exec } from 'node:child_process'
import { promisify } from 'node:util'

/**
 * Promisified version of `child_process.exec()`.
 */
export const execPromise = promisify(exec)
