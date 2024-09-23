import type SongsDTA from 'dta-parser'

export interface ReadSTFSFileRawReturnObject {
  /** The name of the package. */
  name: string
  /** The description of the package. */
  desc: string
  /** An array with all files included on the CON file. */
  files: string[]
  /** The contents of the package's DTA file. */
  dta: string
}

export type ReadSTFSFileReturnObject = Omit<ReadSTFSFileRawReturnObject, 'dta'> & {
  /** The contents of the package's DTA file. */
  dta: SongsDTA
}

export class STFSFile {}
