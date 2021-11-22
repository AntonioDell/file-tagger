# File tagger

⚠️ DISCLAIMER ⚠️
This project is experimental.
You are highly discouraged to use the functionality on important files/directories.
I am not liable for any data loss that may happen on your system.

Based on the amazing work of the [Vite-Test repository](https://github.com/gorgc/vite-test).
This is mainly an exercise to get started with Vue 3 + Electron + Typescript and also solve the use case of tagging files on the client by storing them besides the original files in hidden .meta files.
Feel free to do what ever you like with the code 😃

## Usage

Upon starting you have to select a root directory in the config page.
All files underneath this root directory will get recursively considered for tagging by the application.

See all tags on each file in the page "All files".
Add new tags for each untagged file in the "Untagged files" page.
Tags for a file `/home/user/test.pdf` will be stored in `/home/user/.test.pdf.meta`.

Remove all created tag files (`.meta` files only, the original files are not affected) by using the `Remove all tags` button in the config page.

## Development

Run dev server with `yarn electron:dev`

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Build

Run `yarn app:build` to create an AppImage.

The project uses [electron-builder](https://www.electron.build/) to build.
As of today only a linux AppImage build is supported.
Feel free to add further build targets by extending the `package.json` as described in the electron-builder documentation.
