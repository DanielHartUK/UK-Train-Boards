# UK Railway Stations Information Boards
This project plans to recreate passenger information boards used in UK railway stations. A PHP server is required (with PHP JSON and SOAP), as well as a [National Rail LDBWS token](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/).

# Introducing Version 2!

## Additions
- A redeveloped design! Featuring a better font (see below). bigger text, dot matrix backgrounds (on larger screens), and responsive design.
- A brand new font! The project now uses a [custom dot matrix font](https://github.com/DanielHartUK/Dot-Matrix-Typeface) painstakingly modelled on one (yes, there are many) of the 'fonts' used on real UK dot matrix departure boards.
- Data 'caching' and better errors! If the board loses internet connection then the last data received will be displayed until connection is restored.
- Comments! Code is now (mostly) commented, and (mostly) commented properly!
- More flexible code! PHP and JS scripts for getting and displaying data for all types of board are now combined into single files (get.php, get.js). Before, each type of board would have its own PHP and JS files, which were more or less duplicates. Code is now also more modular, to make future maintenance easier.

## Removals
- Detailed depatures board has not been reimplemented in V2. If you require this then stick to the V1 branch of this project. 
- Text-to-speech platform callouts have been removed.

## Known Issues
- If a cancelled service is later reinstated, it may appear further down the board than where it should be if sorted chronologically.
- The line-height of the font and dot matrix background can have some odd bugs on smaller screens, so these screens will use a solid row background.
- Services may be sorted incorrectly if services that are scheduled for before and after midnight are displayed at the same time and services are of different types.

## Notes
- The boards are designed for a 1080x1920 display, although they should adapt to any screen size (a reload may be required).
- The New Rail Alphabet is a paid font and thus is not included in this repository. Since Rail Alphabet is based on Helvetica, purchasing this font is probably not neccesary unless you're exceptionally dedicated (It's quite expensive). 

## License
[MIT](https://github.com/DanielHartUK/UK-Railway-Stations-Information-Boards/blob/master/license.md)
