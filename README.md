<div align=center>
<img src='https://raw.githubusercontent.com/ruggeryiury/rbtools-js/master/assets/header.webp' alt='RBToolsJS: Package Header Image'>
</div>

<div align=center>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' width='30px' title='JavaScript'/>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' width='30px' title='TypeScript'/>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' width='30px' title='Python' />
</div>

<div align=center>
<img src='https://img.shields.io/github/last-commit/ruggeryiury/rbtools-js?color=%23DDD&style=for-the-badge' /> <img src='https://img.shields.io/github/repo-size/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/issues/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/package-json/v/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/license/ruggeryiury/rbtools-js?style=for-the-badge' />
</div>

- [About](#about)
- [API](#api)
  - [`ImgFile()` class](#imgfile-class)
    - [`.stat()`](#stat)
    - [`.toJSON()`](#tojson)
    - [`.convertToTexture()`](#converttotexture)
    - [`.convertToImage()`](#converttoimage)
    - [`.dataURL()`](#dataurl)
- [Special thanks](#special-thanks)
- [More Rock Band related projects](#more-rock-band-related-projects)

# About

**_RBToolsJS_** is a highly-typed NodeJS module with methods to manipulate several Rock Band game files, joining several functions that might help you processing these files. **_RBToolsJS_** also uses _Python scripts_ to manipulate many kinds of files, like image and texture files.

# API

## `ImgFile()` class

ImgFile is a class that represents an image file. It is initalized passing a path as an argument, pointing the path to the image file to be processed.

- Parameters:
  - **_imageFilePath_** `string | Path`: The path to the image file

```ts
import { ImgFile } from 'rbtools-js'

const image = new ImgFile('path/to/image.png')
```

### `.stat()`

Returns a JSON object with statistics of the image file.

- Returns: `ImgFileStatReturnObject`

### `.toJSON()`

Returns a JSON representation of the image file class.

- Returns: `ImgFileJSONObject`

### `.convertToTexture()`

Asynchronously converts this image file to a texture file.

- Parameters:

  - **_destPath_** `string | Path`: The path of the new converted texture file.
  - **_toFormat_** `ArtworkTextureFormatTypes` The desired texture format of the new texture file.
  - **_options ?_** `ConvertToTextureOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<TextureFile>` A new instantiated `TextureFile` class pointing to the new converted texture file.

### `.convertToImage()`

Asynchronously converts this image file to any other image file format.

- Parameters:

  - **_destPath_** `string | Path`: The path of the new converted image file.
  - **_toFormat_** `ArtworkimageFormatTypes` The desired image format of the new image file.
  - **_options ?_** `ConvertToImageOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<ImgFile>` A new instantiated `ImgFile` class pointing to the new converted image file.

### `.dataURL()`

Asynchronously returns a Base64-encoded DataURL `string` of the image file.

- Parameters:

  - **_options ?_** `ConvertToWEBPDataURLOptions` An object with values that changes the behavior of the converting process.

- Returns: `Promise<string>` A Base64-encoded DataURL `string` of the image file.

# Special thanks

- [Onyxite](https://github.com/mtolly): General helping and for the creation of [Onyx Toolkit](https://github.com/mtolly/onyx)!
- [TrojanNemo](https://github.com/trojannemo): General helping and for the creation of [Nautilus](https://github.com/trojannemo/Nautilus)!
- [Emma](https://github.com/InvoxiPlayGames): General helping.
- [raphaelgoulart](https://github.com/raphaelgoulart): Close friend and always helping me in some sort.

# More Rock Band related projects

- [DTA Parser](https://github.com/ruggeryiury/dta-parser): A highly-typed `.dta` file parser.
- [My Customs Projects](https://github.com/ruggeryiury/ruggy-customs-projects): All my customs projects.
- [C3 Library Patch](https://github.com/ruggeryiury/c3-library-patch): A metadata patch for many released customs.
- [PRO Guitar/Bass Guide](https://ruggeryiury.github.io/proguitarbass-guide/): My famous PRO Guitar/Bass guide.
