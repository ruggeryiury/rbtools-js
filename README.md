<div align=center>
<img src='https://raw.githubusercontent.com/ruggeryiury/rbtools-js/master/assets/header.webp' alt='RBToolsJS: Package Header Image'>
</div>

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
  - [`EDAT` class](#edat-class)
    - [`KLICFromFolderName()`](#klicfromfoldername)
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

- Config your environment file: Create a `env` file in the root of where you downloaded/cloned this repository and put these values:

  - `ONYX_PATH`: The path to Onyx CLI and it is used on the Onyx CLI API. You can download it [here](https://github.com/mtolly/onyx/releases).

So, your `env` file should look like this:

```text
ONYX_PATH="C:/path/to/onyx_cli/onyx.exe"
```

# Package resources

**_RBToolsJS_** comes with a few binary executables, such as:

- [NVIDIA Texture Tool](https://docs.nvidia.com/texture-tools/index.html)
- [WIMGT: Wiimms Image Tool](https://szs.wiimm.de/wimgt/)
- [MakeMogg](https://github.com/maxton/makemogg)

Also, **_RBToolsJS_** uses modified Python scripts from:

- [TPL Module (from Wii.py)](https://github.com/DorkmasterFlek/Wii.py)
- [STFS Module (from py360)](https://github.com/valmyzk/py360)

At last, **_RBToolsJS_** comes with a few special Node packages, such as:

- [Path-JS](https://github.com/ruggeryiury/path-js): A path utility suite that gathers several functions related to a specific path.
- [DTAParser](https://github.com/ruggeryiury/dta-parser): A Rock Band song metadata file parser written in Javascript.

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

## `EDAT` class

`EDAT` is a class with static methods to deal with PS3 EDAT files.

### `KLICFromFolderName()`

Generates a MD5 hash that decrypts `.mid.edat` files based on the installed DLC folder name.

- Parameters:

  - **_folderName_** `string` The installed DLC folder name.

- Returns: `string`

```ts
import { EDAT } from 'rbtools-js'

const folderName = 'foldername'
console.log(EDAT.KLICFromFolderName(folderName))
```

# Special thanks

- [Onyxite](https://github.com/mtolly): General helping and for the creation of [Onyx Toolkit](https://github.com/mtolly/onyx)!
- [TrojanNemo](https://github.com/trojannemo): General helping and for the creation of [Nautilus](https://github.com/trojannemo/Nautilus)!
- [Emma](https://github.com/InvoxiPlayGames): General helping.
- [raphaelgoulart](https://github.com/raphaelgoulart): Close friend and always helping me in some sort.

# More Rock Band related projects

- [DTA Parser](https://github.com/ruggeryiury/dta-parser): A highly-typed `dta` file parser.
- [My Customs Projects](https://github.com/ruggeryiury/ruggy-customs-projects): All my customs projects.
- [PRO Guitar/Bass Guide](https://ruggeryiury.github.io/proguitarbass-guide/): My famous PRO Guitar/Bass guide.
