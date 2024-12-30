<div align=center>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' width='30px' title='JavaScript'/>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' width='30px' title='TypeScript'/>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg' width='30px' title='NodeJS'>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' width='30px' title='Python' />
</div>

<div align=center>
<img src='https://img.shields.io/github/last-commit/ruggeryiury/rbtools-js?color=%23DDD&style=for-the-badge' /> <img src='https://img.shields.io/github/repo-size/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/issues/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/package-json/v/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/license/ruggeryiury/rbtools-js?style=for-the-badge' />
</div>

- [About](#about)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Installation steps](#installation-steps)
- [Package resources](#package-resources)
- [API](#api)
  - [`ImgFile` class](#imgfile-class)
    - [Class properties](#class-properties)
    - [`stat()`](#stat)
    - [`toJSON()`](#tojson)
    - [`convertToTexture()`](#converttotexture)
    - [`convertToImage()`](#converttoimage)
    - [`toDataURL()`](#todataurl)
  - [`TextureFile` class](#texturefile-class)
    - [Class properties](#class-properties-1)
    - [`stat()`](#stat-1)
    - [`toJSON()`](#tojson-1)
    - [`convertToTexture()`](#converttotexture-1)
    - [`convertToImage()`](#converttoimage-1)
    - [`toDataURL()`](#todataurl-1)
  - [`ImageURL` class](#imageurl-class)
    - [Class properties](#class-properties-2)
    - [`download()`](#download)
  - [`EDATFile` class](#edatfile-class)
    - [`devklicFromFolderName()`](#devklicfromfoldername)
    - [`encryptToEDAT()`](#encrypttoedat)
    - [`decryptEDAT()`](#decryptedat)
    - [`decryptRPCS3DLCFolder()`](#decryptrpcs3dlcfolder)
    - [`decryptEDATFromDLCFolder()`](#decryptedatfromdlcfolder)
  - [`STFSFile` class](#stfsfile-class)
    - [Class properties](#class-properties-3)
    - [`stat()`](#stat-2)
    - [`toJSON()`](#tojson-2)
    - [`extract()`](#extract)
- [Special thanks](#special-thanks)
- [More Rock Band related projects](#more-rock-band-related-projects)

# About

**_RBToolsJS_** is a highly-typed NodeJS module with methods to manipulate several Rock Band game files, joining several functions that might help you processing these files. **_RBToolsJS_** also uses _Python scripts_ to manipulate many kinds of files, like image and texture files.

# Installation

## Requirements

- [NodeJS](https://nodejs.org/en/download)
- [Python v3 & PIP](https://www.python.org/downloads/): **_RBToolsJS_** uses _Python scripts_ to manipulate many kinds of files, like image and texture files.

## Installation steps

Follow the steps below to install and set up the project on your local machine:

- Install Python v3 with PIP.

- Execute the `/install_python_packages.py` script to install necessary Python packages:

```bash
python install_python_packages.py
```

- Clone the repository: If you have `git` installed, se the following command to clone the repository to your local machine:

```bash
git clone https://github.com/ruggeryiury/rbtools-js.git
```

- Install project dependencies: Navigate to the project directory and install the necessary packages by running:

```bash
npm install
```

_Make sure that the `packages` folder are in the project's root folder to install all packages correctly. The reason for this is because there are some packages that is made by me and they're not uploaded to the NPM server, existing only locally._

- Config your environment file (OPTIONAL): Create a `env` file in the root of where you downloaded/cloned this repository and put these values:

  - `RBTOOLS_DEV`: Setting this variable to `1` changes the root path of the package to use `src` rather than the `dist` folder. This value is only need in development when doing new scripts to avoid building and copying the scripts to the `dist` folder.

So, your `env` file should look like this:

```text
RBTOOLS_DEV="C:/path/to/onyx_cli/onyx.exe"
```

# Package resources

**_RBToolsJS_** comes with a few binary executables, such as:

- [NVIDIA Texture Tool](https://docs.nvidia.com/texture-tools/index.html)
- [WIMGT: Wiimms Image Tool](https://szs.wiimm.de/wimgt/)
- [MakeMogg](https://github.com/maxton/makemogg)

Also, **_RBToolsJS_** uses modified Python scripts from:

- [TPL Module (from Wii.py)](https://github.com/DorkmasterFlek/Wii.py)
- [STFS Module (from py360)](https://github.com/valmyzk/py360)
- [MOGG Module (from moggulator)](https://github.com/LocalH/moggulator/tree/master)

At last, **_RBToolsJS_** comes with a few special Node packages, such as:

- [Path-JS](https://github.com/ruggeryiury/path-js): A path utility suite that gathers several functions related to a specific path.
- [RBDTA-JS](https://github.com/ruggeryiury/rbdta-js): A Rock Band song metadata file parser written in Javascript.
- [Set Default Options](https://github.com/ruggeryiury/set-default-options): Utility function to merge default options with user-defined ones.

# API

The main exports of this package consists on classes that represents a file type to be processed. All secondary methods used on these classes is also available to import from `rbtools/lib`

## `ImgFile` class

`ImgFile` is a class that represents an image file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.

- Parameters:
  - **_imageFilePath_** `StringOrPath`: The path to the image file.

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')
```

### Class properties

- **_path_** `Path` The path of the image file.

### `stat()`

Returns a JSON object with statistics of the image file.

- Returns: `ImgFileStatReturnObject`

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')

// Get the width and height of the image file
const { width, height } = image.stat()
console.log(`Image width: ${width.toString()}`)
console.log(`Image height: ${height.toString()}`)
```

### `toJSON()`

Returns a JSON representation of the image file class.

- Returns: `ImgFileJSONObject`

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')

// Get the path, width, and height of the image file
const {
  path,
  file: { width, height },
} = image.toJSON()

console.log(`Image path: ${path}`)
console.log(`Image width: ${width.toString()}`)
console.log(`Image height: ${height.toString()}`)
```

### `convertToTexture()`

Asynchronously converts this image file to a texture file.

- Parameters:

  - **_destPath_** `StringOrPath`: The path of the new texture file.
  - **_toFormat_** `ArtworkTextureFormatTypes` The desired texture format of the new texture file.
  - **_options ?_** `ConvertToTextureOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<TextureFile>` A new instantiated `TextureFile` class pointing to the new texture file.

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')
const newImage = await image.convertToTexture('path/to/new/texture.png_xbox', 'png_xbox', { textureSize: 256 })
```

### `convertToImage()`

Asynchronously converts this image file to any other image file format.

- Parameters:

  - **_destPath_** `StringOrPath`: The path of the new converted image file.
  - **_toFormat_** `ArtworkImageFormatTypes` The desired image format of the new image file.
  - **_options ?_** `ConvertToImageOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<ImgFile>` A new instantiated `ImgFile` class pointing to the new converted image file.

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')
const newImage = await image.convertToImage(
  'path/to/new/image.bmp',
  'bmp',
  // You can choose the new converted image width and height
  // though this options object.
  { width: 512, height: 512 }
)
```

### `toDataURL()`

Asynchronously returns a Base64-encoded DataURL `string` of the image file.

- Parameters:

  - **_options ?_** `ConvertToWEBPDataURLOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<string>` A Base64-encoded DataURL `string` of the image file.

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')
const imageDataURL = await image.toDataURL()
```

## `TextureFile` class

`TextureFile` is a class that represents a texture file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.

- Parameters:
  - **_textureFilePath_** `StringOrPath`: The path to the texture file.

```ts
import { TextureFile } from 'rbtools-js'

const tex = new TextureFile('path/to/texture.png_xbox')
```

### Class properties

- **_path_** `Path` The path of the texture file.

### `stat()`

Returns a JSON object with statistics of the texture file.

- Returns: `TextureFileStatReturnObject`

```ts
import { TextureFile } from 'rbtools-js'

const tex = new TextureFile('path/to/texture.png_xbox')

// Get the width and height of the texture file
const { width, height } = tex.stat()
console.log(`Texture width: ${width.toString()}`)
console.log(`Texture height: ${height.toString()}`)
```

### `toJSON()`

Returns a JSON representation of the texture file class.

- Returns: `TextureFileJSONObject`

```ts
import { TextureFile } from 'rbtools-js'

const tex = new TextureFile('path/to/texture.png_xbox')

// Get the path, width, and height of the texture file
const {
  path,
  file: { width, height },
} = tex.toJSON()

console.log(`Texture path: ${path}`)
console.log(`Texture width: ${width.toString()}`)
console.log(`Texture height: ${height.toString()}`)
```

### `convertToTexture()`

Asynchronously converts this texture file to any other texture file format.

- Parameters:

  - **_destPath_** `StringOrPath`: The path of the new texture file.
  - **_toFormat_** `ArtworkTextureFormatTypes` The desired image format of the image file.
  - **_options ?_** `ConvertToTextureOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<TextureFile>` A new instantiated `TextureFile` class pointing to the new texture file.

```ts
import { TextureFile } from 'rbtools-js'

const tex = new TextureFile('path/to/texture.png_xbox')
const newTex = await tex.convertToTexture('path/to/new/texture.png_wii', 'png_wii')
```

### `convertToImage()`

Asynchronously converts this texture file to an image file.

- Parameters:

  - **_destPath_** `StringOrPath`: The path of the new image file.
  - **_toFormat_** `ArtworkImageFormatTypes` The desired image format of the new image file.

- Returns: `Promise<ImgFile>` A new instantiated `ImgFile` class pointing to the new image file.

```ts
import { TextureFile } from 'rbtools-js'

const tex = new TextureFile('path/to/texture.png_xbox')
const newTex = await tex.convertToImage('path/to/new/image.png', 'png')
```

### `toDataURL()`

Asynchronously returns a Base64-encoded DataURL `string` of the texture file.

- Parameters:

  - **_options ?_** `ConvertToWEBPDataURLOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<string>` A Base64-encoded DataURL `string` of the texture file.

```ts
import { TextureFile } from 'rbtools-js'

const tex = new TextureFile('path/to/texture.png_xbox')
const texDataURL = await tex.toDataURL()
```

## `ImageURL` class

`ImageURL` is a class that represents an image file URL. It is initalized passing an image URL as an argument.

- Parameters:
  - **_url_** `string`: The URL of the image.

```ts
import { ImageURL } from 'rbtools-js'

const imageURL = new ImageURL('https://image.com/image.png')
```

### Class properties

- **_url_** `string` The URL of the image.
- **_buf_** `Buffer` The buffer of the fetched image.

### `download()`

Asynchronously fetches and download the image, converting to a new image file.

- Parameters:

  - **_destPath_** `StringOrPath`: The path of the new image file.
  - **_toFormat ?_** `ArtworkImageFormatTypes` The desired image format of the new image file. Default is `'png'`
  - **_options ?_** `ImageConverterOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<ImgFile>` A new instantiated `ImgFile` class pointing to the new image file.

```ts
import { ImageURL } from 'rbtools-js'

const imageURL = new ImageURL('https://image.com/image.png')
const imgFile = await imageURL.download(
  'path/to/downloaded/image.jpg',

  // If you want to convert the image to any format,
  // provide the format as second argument:
  'jpg',

  // You can tweak the converting process through this
  // options argument:
  {
    width: 512,
    height: 512,
    quality: 100,
  }
)
```

## `EDATFile` class

`EDATFile` is a class with static methods to deal with PS3 EDAT files.

### `devklicFromFolderName()`

Generates a MD5 hash that decrypts `.mid.edat` files based on the installed DLC folder name.

- Parameters:

  - **_folderName_** `string` The installed DLC folder name.

- Returns: `string`

```ts
import { EDAT } from 'rbtools-js'

const folderName = 'foldername'
console.log(EDAT.devklicFromFolderName(folderName))
```

### `encryptToEDAT()`

Encrypts any file to EDAT.

- Parameters:

  - **_srcFile_** `StringOrPath` The path to the file to be encrypted.
  - **_destFile_** `StringOrPath` The path to the new encrypted EDAT file.
  - **_contentID_** `string` The content ID. Must be 36 characters long. Ex.: `UP0002-BLUS30487_00-MYPACKAGELABEL`
  - **_devKLic_** `string` A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`

- Returns: `Promise<string>`

```ts
import { EDAT } from 'rbtools-js'

const src = 'path/to/unencrypted/midiFile.mid'
const dest = 'path/to/encrypted/midiFile.mid.edat'
const contentID = 'UP0002-BLUS30487_00-RBTOOLSJSEXAMP'
const devKLic = EDAT.KLICFromFolderName('dlcfoldername')

await EDAT.encryptToEDAT(src, dest, contentID, devKLic)
```

### `decryptEDAT()`

Decrypts any file to EDAT.

- Parameters:

  - **_srcFile_** `StringOrPath` The path to the EDAT file to be decrypted.
  - **_destFile_** `StringOrPath` The path to the decrypted file.
  - **_devKLic_** `string` A 16-byte HEX string (32 chars). Ex.: `d7f3f90a1f012d844ca557e08ee42391`

- Returns: `Promise<string>`

```ts
import { EDAT } from 'rbtools-js'

const src = 'path/to/encrypted/midiFile.mid.edat'
const dest = 'path/to/unencrypted/midiFile.mid'
const devKLic = EDAT.KLICFromFolderName('dlcfoldername')

await EDAT.decryptEDAT(src, dest, devKLic)
```

### `decryptRPCS3DLCFolder()`

Converts all EDAT files from a RPCS3 DLC folder. The DLC folder name must be the one that the EDAT file were originally installed to work.

- Parameters:

  - **_dlcFolder_** `StringOrPath` The folder you want to convert all EDAT files.

- Returns: `Promise<string>`

```ts
import { EDAT } from 'rbtools-js'

const dlcFolder = 'path/to/rpcs3/dlc/folder'
await EDAT.decryptRPCS3DLCFolder(dlcFolder)
```

### `decryptEDATFromDLCFolder()`

Decrypts an EDAT file inside a RPCS3 DLC folder. The DLC folder name must be the one that the EDAT file were originally installed to work.

- Parameters:

  - **_edatFilePath_** `StringOrPath` The path to the EDAT file to be decrpted.

- Returns: `Promise<string>`

```ts
import { EDAT } from 'rbtools-js'

const edatFilePath = 'path/to/encrypted/midiFile.mid.edat'
await EDAT.decryptEDATFromDLCFolder(edatFilePath)
```

## `STFSFile` class

`STFSFile` is a class that represents a Xbox CON file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.

- Parameters:
  - **_stfsFilePath_** `StringOrPath`: The path to the image file.

```ts
import { STFSFile } from 'rbtools-js'

const stfs = new STFSFile('path/to/song_rb3con')
```

### Class properties

- **_path_** `Path` The path of the CON file.

### `stat()`

Returns a JSON object with statistics of the CON file.

- Returns: `STFSFileStatReturnObject`

```ts
import { STFSFile } from 'rbtools-js'

const stfs = new STFSFile('path/to/song_rb3con')

// Checks if the CON file is a pack of songs
const { isPack } = stfs.stat()
console.log(isPack)
```

### `toJSON()`

Returns a JSON representation of the STFS file class.

- Returns: `STFSFileJSONObject`

```ts
import { STFSFile } from 'rbtools-js'

const stfs = new STFSFile('path/to/song_rb3con')

// Get the path and if the CON file is a pack
const {
  path,
  file: { isPack },
} = tex.toJSON()

console.log(`CON file path: ${path}`)
console.log(`CON file is pack: ${isPack.toString()}`)
```

### `extract()`

Asynchronously extract all files from a CON file and returns the folder path where all contents was extracted.

- Parameters:

  - **_destPath_** `StringOrPath` The folder path where you want the files to be extracted to.

- Returns: `Promise<string>`

```ts
import { STFSFile } from 'rbtools-js'

const stfs = new STFSFile('path/to/song_rb3con')
const destPath = new Path('path/to/a/directory')

await stfs.extract(destPath)
```

# Special thanks

- [raphaelgoulart](https://github.com/raphaelgoulart): Close friend and always helping me in some sort.
- [Onyxite](https://github.com/mtolly): General helping and for the creation of [Onyx Toolkit](https://github.com/mtolly/onyx)!
- [TrojanNemo](https://github.com/trojannemo): General helping and for the creation of [Nautilus](https://github.com/trojannemo/Nautilus)!
- [LocalH](https://github.com/LocalH): General helping and providing me the [moggulator](https://github.com/LocalH/moggulator/tree/master) python script.
- [Emma](https://github.com/InvoxiPlayGames): General helping!

# More Rock Band related projects

- [RBDTA-JS](https://github.com/ruggeryiury/rbdta-js): A Rock Band song metadata file parser written in Javascript.
- [My Customs Projects](https://github.com/ruggeryiury/ruggy-customs-projects): All my customs projects.
- [PRO Guitar/Bass Guide](https://ruggeryiury.github.io/proguitarbass-guide/): My famous PRO Guitar/Bass guide.
