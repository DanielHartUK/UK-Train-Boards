# UK Railway Stations Information Boards
This project plans to recreate passenger information boards used in UK railway stations. A PHP server is required, as well as a [National Rail LDBWS token](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/).

## Known Issues
- No favicon is currently set.
- Error handling for no response, incorrect station, etc. has not yet been implemented.
- If a cancelled service is later reinstated, it may appear further down the board than where it should be if sorted chronilogically.
- Not all services have platform numbers, this is more common at stations like Euston. This isn't a issue with this project, rather that information not being available in National Rail's feed for some reason that I'm yet to discover.


## Notes
- The New Rail Alphabet is a paid font and thus is not included in this repository. Since Rail Alphabet is based on Helvetica, purchasing this font is probably not neccesary unless you're exceptionally dedicated (It's quite expensive). 