# UK Train Boards
This project plans to recreate passenger information boards used in UK railway stations as a desktop application for Mac, Windows, and Linux.

## Features
- Generate faithful recreations of passenger information boards from UK railway stations on your desktop! 

## Development
- Install dependencies: `npm install`
- Serve application: `npm run electron:serve`
- Build application: `npm run electron:build`

### Building on Raspberry Pi 4
`sudo apt-get install ruby-full`
`sudo gem install fpm`
`export USE_SYSTEM_FPM="true"`
`npm run electron:build -- --dir --linux --armv7l`

## License
[MIT](https://github.com/DanielHartUK/UK-Railway-Stations-Information-Boards/blob/master/license.md)
