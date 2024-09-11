import Path from "path-js"

export const texToImgXboxPs3 = (srcFile: string | Path, destPath: string | Path) => {
  // const srcPath = new Path(Path.resolve(src))
  // const destPath = new Path(Path.resolve(dest))

  // const dds = new Path(srcPath.changeFileExt('dds'))

  // if (destPath.exists()) await destPath.deleteFile()
  // if (dds.exists()) await dds.deleteFile()

  // const srcBuffer = await srcPath.readFile()
  // const ddsStream = await dds.createFileWriteStream()

  // // 32 is the size of the texture file header we need to skip
  // const loop = (srcBuffer.length - 32) / 4
  // const srcContents = srcBuffer.subarray(32)

  // const fullSrcHeader = Buffer.alloc(16)
  // const shortSrcHeader = Buffer.alloc(11)

  // srcBuffer.copy(fullSrcHeader, 0, 0, 16)
  // srcBuffer.copy(shortSrcHeader, 0, 5, 11)

  // const srcHeader = await getDDSHeader(Uint8Array.from(fullSrcHeader), Uint8Array.from(shortSrcHeader))
  // ddsStream.stream.write(srcHeader.data)

  // for (let x = 0; x <= loop; x++) {
  //   const newBuffer = Buffer.alloc(4)
  //   srcContents.copy(newBuffer, 0, x * 4, x * 4 + 4)
  //   const swappedBytes = srcPath.ext.includes('ps3') ? newBuffer : Buffer.from([newBuffer[1], newBuffer[0], newBuffer[3], newBuffer[2]])
  //   ddsStream.stream.write(swappedBytes)
  // }

  // ddsStream.stream.end()
  // await ddsStream.once

  // await imgConv.exec(dds.path, destPath.path, [srcHeader.width, srcHeader.height], 'bilinear')

  // if (dds.exists()) await dds.deleteFile()

  // return {
  //   path: destPath.path,
  //   width: srcHeader.width,
  //   height: srcHeader.height,
  //   size: [srcHeader.width, srcHeader.height]
  // }
}