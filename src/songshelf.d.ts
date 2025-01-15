declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RBTOOLS_DEV?: string
    }
  }
}

export {}
