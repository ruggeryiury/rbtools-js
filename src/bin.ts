import Path from 'path-js'
import { execPromise, stringToPath } from './lib.js'
import { __root } from './index.js'

export const NVCompress = async (srcPath: string | Path, destPath: string | Path, DTX5 = true) => {
  const moduleName = 'nvcompress.exe'
  const binPath = new Path(Path.resolve(__root.path, `./bin/${moduleName}`))
  const src = stringToPath(srcPath)
  const dest = stringToPath(destPath)

  const command = `${moduleName} -nomips -nocuda ${DTX5 ? ' -bc3' : ' -bc1'} "${src.path}" "${dest.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: binPath.root, windowsHide: true })
  if (stderr) throw new Error(stderr)
  return stdout
}

export const WimgtEnc = async (srcPath: string | Path, destPath: string | Path) => {
  const moduleName = 'wimgt.exe'
  const binPath = new Path(Path.resolve(__root.path, `./bin/${moduleName}`))
  const src = stringToPath(srcPath)
  const dest = stringToPath(destPath)

  const command = `${moduleName} -d "${dest.path}" ENC -x TPL.CMPR "${src.path}"`
  const { stderr, stdout } = await execPromise(command, { cwd: binPath.root, windowsHide: true })
  if (stderr) throw new Error(stderr)
  return stdout
}
