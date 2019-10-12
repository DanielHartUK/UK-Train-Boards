# UK Railway Stations Information Boards
This project plans to recreate passenger information boards used in UK railway stations.

## Requirements
- PHP Server (with PHP JSON and SOAP) or Docker and Docker Compose
- Composer
- NPM
- a [National Rail LDBWS token](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/).

## Getting Started
You'll need a PHP server with SOAP to run this project. You can use a PHP server you already have configured, simply take the `app/` directory, and serve the `public` directory.

Alternatively, you can use Docker. Assuming you already have Docker and Docker Compose installed, open the root of the project in a terminal, then run `docker-compose build` followed by `docker-compose up`. Then open `localhost:10080` in your browser.

Rename the `.env.example` file in `app/` to `.env`, add your LDBWS token.

Open `app/` in a terminal, and run the following:
 - `composer install`
 - `npm install`
 - `php artisan key:generate`
 - `npm run production`
 
 And you should be good to go!

## Introducing Version 3!
Here we go again! It's time to rewrite this, again! This time it's in Vue.js and Laravel!

### Why Laravel? 
Why not! Sure, it's probably a bit overkill for this but it also makes things a tonne easier. 

### Why do you keep rebuilding this? V2 was perfectly fine!
It was. This project doesn't need to be rebuilt every year and yet here we are. This project has become more of a demonstration of where my abilities are at. It allows me to use the stuff that I've learnt over the past year, as well as experiment with things that I haven't had the chance to up until now (CSS Grid, for example.)

As you might've guessed, I spent the last year learning Laravel and Vue.js.

### Additions
- It's written in Laravel and Vue.js
- TBC

### Removals
- TBC

### Known Issues
- TBC

### Notes
- TBC

## License
[MIT](https://github.com/DanielHartUK/UK-Railway-Stations-Information-Boards/blob/master/license.md)
