# UK Railway Stations Information Boards
[![Build Status](https://travis-ci.org/DanielHartUK/UK-Railway-Stations-Information-Boards.svg?branch=V3)](https://travis-ci.org/DanielHartUK/UK-Railway-Stations-Information-Boards)

This project plans to recreate passenger information boards used in UK railway stations.

## Requirements
- PHP Server (with PHP JSON and SOAP) or Docker and Docker Compose
- a [National Rail LDBWS token](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/).

## Getting Started
Rename the `.env.example` file in `app/` to `.env`, add your LDBWS token.

You'll need a PHP server with SOAP to run this project. You can use a PHP server you already have configured, simply take the `app/` directory, and serve the `public` directory. You'll need to install composer dependencies and generate a app key by running `php artisan key:generate` in `app/`.

Alternatively, you can use Docker. Assuming you already have Docker and Docker Compose installed, open the root of the project in a terminal, then run `docker-compose build` followed by `docker-compose up`. Then open `localhost:10080` in your browser.

Open the project in a terminal, and run the following:
- `docker-compose exec laravel php artisan key:generate`
 
And you should be good to go! Open up `http://localhost:10080` in your browser.

**Note**: if you get a permissions error when running artisan commands, or encounter a 500 error when trying to load the site in a browser, run `docker-compose exec laravel chown -R www-data:www-data /var/www`.
 
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

## Sponsorship
I don't need money so if you like this project and want to say thanks with the gift of money give it to dogs instead. Seriously, [help the good boys find a home](https://donate.battersea.org.uk/appeals/default/).

## License
[MIT](https://github.com/DanielHartUK/UK-Railway-Stations-Information-Boards/blob/master/license.md)
