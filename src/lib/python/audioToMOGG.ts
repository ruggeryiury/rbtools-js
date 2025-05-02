import { execAsync, FilePath, type PathLikeTypes } from 'node-lib'
import { pathLikeToString } from 'node-lib'
import { PythonExecutionError, ValueError } from '../../errors'
import { RBTools } from '../../index'

export const audioToMOGG = async (audioFiles: PathLikeTypes[], destPath: PathLikeTypes, quality = 3) => {
  const moduleName = 'audio_to_mogg.py'
  const pyPath = FilePath.of(RBTools.python.path, moduleName)
  const dest = FilePath.of(pathLikeToString(destPath))
  await dest.delete()

  if (quality < 1 || quality > 10) throw new ValueError(`MOGG quality must be between 1 and 10, got ${quality.toString()}`)

  let audioFileInput = ''
  for (const file of audioFiles) {
    audioFileInput += `"${FilePath.of(pathLikeToString(file)).path}" `
  }
  const command = `python ${moduleName} ${audioFileInput} -o "${dest.path}" -q ${quality.toString()}`
  const { stderr } = await execAsync(command, { windowsHide: true, cwd: pyPath.root })
  if (stderr) throw new PythonExecutionError(stderr)

  return dest
}
