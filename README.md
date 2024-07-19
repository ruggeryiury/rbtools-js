<div align=center>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' width='30px' title='JavaScript'/>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' width='30px' title='TypeScript'/>
<img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' width='30px' title='Python' />
</div>

<div align=center>
<img src='https://img.shields.io/github/last-commit/ruggeryiury/rbtools-js?color=%23DDD&style=for-the-badge' /> <img src='https://img.shields.io/github/repo-size/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/issues/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/package-json/v/ruggeryiury/rbtools-js?style=for-the-badge' /> <img src='https://img.shields.io/github/license/ruggeryiury/rbtools-js?style=for-the-badge' />
</div>

- [About](#about)
- [Features](#features)
- [Requirements](#requirements)
- [Optional (but useful, and maybe required on later versions)](#optional-but-useful-and-maybe-required-on-later-versions)
- [Special thanks](#special-thanks)
- [More Rock Band related projects](#more-rock-band-related-projects)

# About

**_RBToolsJS_** is a highly-typed NodeJS module with methods to manipulate several Rock Band 3 game files, joining several functions that I found useful in some way and helps me on my custom creation process in some way.

**_RBToolsJS_** also uses _Python_ to manipulate specific files, such as game texture files.

# Features

With **_RBToolsJS_** you can:

- Create, parse, and export `.dta` (Rock Band song metadata) files. (powered by my [DTA Parser](https://github.com/ruggeryiury/dta-parser) module).
- Create `.rbproj`/`.c3` (MAGMA project) files based on `.dta` file "recipes".

**_RBToolsJS_** are still in development, but certain fucntions are going to be available on next commits:

- Create and convert `.png_xbox`, `.png_ps3`, and `.png_wii` (Game texture) files.

# Requirements

- [Python v3](https://www.python.org/downloads/): _RBToolsJS_ uses Python scripts on the background of several methods, such as image convertion/fetching, and create multitrack `.ogg` files.
- [PIP](https://pypi.org/project/pip/): Used to install and manage installed Python packages. Some methods uses external python packages, such as:

  - [Pillow](https://pypi.org/project/pillow/): To manipulate image files.
  - [pydub](https://pypi.org/project/pydub/): To manipulate audio files.

- [MAGMA C3](https://rhythmgamingworld.com/wp-content/uploads/2024/05/MagmaC3v335.zip): Necessary to generate MAGMA files.

# Optional (but useful, and maybe required on later versions)

- [Onyx CLI](https://github.com/mtolly/onyx): The command line interface version of the famous Oxynite toolkit to manipulate several Rock Band game files directly with JavaScript. You can find it on `Releases`.

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
