/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    ONYX_CLI_PATH?: string
    NAUTILLUS_PATH?: string
  }
}
