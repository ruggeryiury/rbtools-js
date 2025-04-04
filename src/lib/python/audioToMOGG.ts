import { Path, type PathLikeTypes } from 'path-js'
import { PythonExecutionError, ValueError } from '../../errors'
import { RBTools } from '../../index'
import { execPromise } from '../execPromise'

export const audioToMOGG = async (audioFiles: PathLikeTypes[], destPath: PathLikeTypes, quality = 3) => {
  const moduleName = 'audio_to_mogg.py'
  const pyPath = new Path(RBTools.getPythonScriptsPath().path, moduleName)
  const dest = Path.stringToPath(destPath)
  await dest.checkThenDeleteFile()

  if (quality < 1 || quality > 10) throw new ValueError(`MOGG quality must be between 1 and 10, got ${quality.toString()}`)

  let audioFileInput = ''
  for (const file of audioFiles) {
    audioFileInput += `"${Path.stringToPath(file).path}" `
  }
  const command = `python ${moduleName} ${audioFileInput} -o "${dest.path}" -q ${quality.toString()}`
  const { stderr } = await execPromise(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
