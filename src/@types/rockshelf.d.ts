declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Setting this variable to `1` changes the root path of the package to use `src`
       * rather than the `dist` folder. This value is only need in development when
       * doing new scripts to avoid building and copying the scripts to the `dist` folder
       * every testing. Default is `0`.
       */
      RBTOOLS_USESOURCE?: string
      /**
       * Changes the path used as the `bin` directory path for the module.
       * Default is the module `dist/bin` (or `src/bin` if `RBTOOLS_USESOURCE` is
       * set to 1) folder.
       */
      RBTOOLS_BIN_PATH?: string
    }
  }
}

export {}
