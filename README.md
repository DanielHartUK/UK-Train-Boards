# UK Railway Stations Information Boards
This project plans to recreate passenger information boards used in UK railway stations. A PHP server is required (with PHP JSON and SOAP), as well as a [National Rail LDBWS token](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/).

## Known Issues
- No favicon is currently set.
- Error handling for no response, incorrect station, etc. has not yet been implemented.
- If a cancelled service is later reinstated, it may appear further down the board than where it should be if sorted chronilogically.
- Not all services have platform numbers, blame National Rail, not me.
- The platform text-to-speech callouts will probably not work if a train divides more than once, though I don't think this currently happens anywhere in the UK.
- Platform TTS callouts will currently only function for services which are on time 5 minutes from their scheduled departure.


## Notes
- The departure (and eventually arrival) board is designed for a 1080x1920 display. The boards can easilly be adapted for a shorter display by reducing the number of rows that are loaded.
- The New Rail Alphabet is a paid font and thus is not included in this repository. Since Rail Alphabet is based on Helvetica, purchasing this font is probably not neccesary unless you're exceptionally dedicated (It's quite expensive). 

## License
[MIT](https://github.com/DanielHartUK/UK-Railway-Stations-Information-Boards/blob/master/license.md)
