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
- [Rock Band Song Package File](#rock-band-song-package-file)
  - [File Header](#file-header)
  - [File Contents](#file-contents)
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

- Execute the `scripts/install_python_packages.py` script to install necessary Python packages:

```bash
python scripts/install_python_packages.py
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

  - `RBTOOLS_USESOURCE`: Setting this variable to `1` changes the root path of the package to use `src` rather than the `dist` folder. This value is only need in development when doing new scripts to avoid building and copying the scripts to the `dist` folder.
  - `RBTOOLS_BIN_PATH`: Changes the path used as the `bin` directory path for the module. Default is the module `dist/bin` (or `src/bin` if `RBTOOLS_USESOURCE` is set to 1) folder.
  - `MAGMA_PATH`: The path where you extracted MAGMA. This variable can be used by `MAGMAProject` class.
  - `SONGS_PROJECT_ROOT_PATH`: The path where you can find the project files for all your customs. This variable can be used by `MAGMAProject` class.

# Package resources

**_RBToolsJS_** comes with a few binary executables, such as:

- [NVIDIA Texture Tool](https://docs.nvidia.com/texture-tools/index.html)
- [Wiimms Image Tool](https://szs.wiimm.de/wimgt/)
- [MakeMogg](https://github.com/maxton/makemogg)
- EDATTool

Also, **_RBToolsJS_** uses modified Python scripts from:

- [TPL Module (from Wii.py)](https://github.com/DorkmasterFlek/Wii.py)
- [STFS Module (from py360)](https://github.com/valmyzk/py360)
- [MOGG Module (from moggulator)](https://github.com/LocalH/moggulator/tree/master)
- [Swap RB Art Bytes (from RB3DX Dependencies)]()

At last, **_RBToolsJS_** comes with a few special Node packages made by myself, such as:

- [Path-JS](https://github.com/ruggeryiury/path-js): A path utility suite that gathers several functions related to a specific path.
- [Set Default Options](https://github.com/ruggeryiury/set-default-options): Utility function to merge default options with user-defined ones.

# API

The main exports of this package consists on classes that represents a file type to be processed. All secondary methods used on these classes is also available to import from `rbtools/lib`.

_API DOCUMENTATION COMING SOON_

# Rock Band Song Package File

The Rock Band Song Package file is a proprietary file created to package a Rock Band 3 custom song. It was created as an alternative way to share a Rock Band song to any player/charter. The extension used for this file is `.rbsp`. The idea is to make a file where you can place all project files of a specific custom song, also with the ability to create CON files, PKG files, or writing a song directly into RPCS3's DLC folder for Rock Band 3 customs. The file might includes:

- The song's REAPER project.
- All audio files used on the project to create lipsync animations and original stems from the song.
- All files from the compiled custom: MOGG file, MILO file, MID file.
- The parsed DTA of the song as JSON.
- Project version and Markdown file as package description.

## File Header

The Rock Band Song Package file has a fixed header of `0x20` bytes.

| NAME                           | OFFSET | LENGTH | ENCODING TYPE | DESCRIPTION                                                                                                            |
| ------------------------------ | ------ | ------ | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| File Signature                 | `0x00` | `0x04` | `ascii`       | The file signature. Always `52 42 53 50` (RBSP).                                                                       |
| Package Version                | `0x04` | `0x01` | `uint8`       | The version of the song package.                                                                                       |
| Package Name Length            | `0x05` | `0x01` | `uint8`       | The length of the package name, up to 255 characters.                                                                  |
| Song Data Size                 | `0x06` | `0x02` | `uint16le`    | The length of the Song Data `base64` string.                                                                           |
| Markdown File Size&sup1;       | `0x08` | `0x04` | `uint32le`    | The length of the Markdown file implemented to the song package to be used as a versatile package description display. |
| MIDI File Size                 | `0x0C` | `0x04` | `uint32le`    | The length of the song's MIDI file.                                                                                    |
| Album Artwork Size&sup2;       | `0x10` | `0x04` | `uint32le`    | The length of the Album Artwork file.                                                                                  |
| REAPER Project File Size&sup1; | `0x14` | `0x04` | `uint32le`    | The length of the REAPER Project file.                                                                                 |
| Song MILO File Size&sup3;      | `0x18` | `0x04` | `uint32le`    | The length of the song's MILO file.                                                                                    |
| Song MOGG File Size&sup3;      | `0x1C` | `0x04` | `uint32le`    | The length of the song's MOGG file.                                                                                    |

1 &mdash; This file is optional for a RBSP file to have it. On the file header, zero bytes values means the file was not implemented.

2 &mdash; Album artwork is optional. If not used, it will have zero bytes on the file header but the `rock-band-song-packager` will display a placeholder image.

3 &mdash; Compiled song files are optional but highly recommended to be able to re-create CON and PKG files.

## File Contents

| NAME                | ENCODING TYPE                 | DESCRIPTION                     |
| ------------------- | ----------------------------- | ------------------------------- |
| Package Name        | `utf8`                        | The parsed song data.           |
| Song Data           | `base64` => `json`            | The parsed song data.           |
| Markdown            | `base64` => `utf8`            | The markdown file contents.     |
| MIDI File           | `compressed binary` => `midi` | The contents of the MIDI file.  |
| Album Artwork File  | `compressed binary` => `png`  | The album artwork of the song.  |
| REAPER Project File | `compressed binary` => `rpp`  | The REAPER project of the song. |
| Song MILO File      | `binary` => `milo`            | The MILO file of the song.      |
| Song MOGG File      | `binary` => `mogg`            | The MOGG file of the song.      |

# Special thanks

- [raphaelgoulart](https://github.com/raphaelgoulart): Close friend and always helping me in some sort.
- [Onyxite](https://github.com/mtolly): General helping and for the creation of [Onyx Toolkit](https://github.com/mtolly/onyx)!
- [TrojanNemo](https://github.com/trojannemo): General helping and for the creation of [Nautilus](https://github.com/trojannemo/Nautilus)!
- [LocalH](https://github.com/LocalH): General helping and providing me the [moggulator](https://github.com/LocalH/moggulator/tree/master) python script.
- [Emma](https://github.com/InvoxiPlayGames): General helping!

# More Rock Band related projects

- [My Customs Projects](https://github.com/ruggeryiury/ruggy-customs-projects): All my customs projects.
- [PRO Guitar/Bass Guide](https://ruggeryiury.github.io/proguitarbass-guide/): My famous PRO Guitar/Bass guide.
