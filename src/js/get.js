const STATIONCODE = getQueryVariable("station");
// let ROWSPERPAGE = 24; // Number of rows to display on each page/screen

const PAGES = 5; // Number of pages
const REFRESHTIME = 10; // Refresh every n seconds.
const TABLEELEMENT = "#departures";

/**
 * Returns the number of rows that can appear on screen
 *
 * @returns void
 */
function calcRows() {
  $(`${TABLEELEMENT} tbody`).append(`<tr class="tempRow"><td style="text-align: center;" colspan="4">&nbsp;</td></tr>`);
  let rowHeight = $('.tempRow').outerHeight();
  $('.tempRow').remove();
  return Math.floor(($('body').height() - $('.main').outerHeight()) / rowHeight);
}

const ROWSPERPAGE = calcRows();
const TOTALROWS = ROWSPERPAGE * PAGES; // Number of departures to get
let page;
if(getQueryVariable("page")) {
  page = getQueryVariable("page"); // Page to display
} else {
  page = 1; // Page to display
}

services = ""; // TODO LET THIS
let rowCounter = 0; // Row counter

let sIDs = []; // Array of service ids
let responseError = false;


/**
 * Fetch train services
 * @param {string} stationCode - the station code
 * @param {int} rows - the number of rows to return
 * @param {string} type - the type of query (departures, arrivals, departuresDetailed, arrivals detailed)
 * @param {callback} callback - the callback function
 *
 * @returns void
 */
function getTrains(stationCode, rows, type, callback) {
  if(typeof callback != "function") {
    console.error('No callback specified');
  } else {
    let url = `get/get.php?station=${stationCode}&rows=${rows}&type=${type}`;
    // let url = `assets/getDeparturesTest1.json`;
    $.get(url, (trainServices)=> {
      callback(trainServices);
    });
  }
}

let serviceIDs;
let parameterError;
function processTrains(response) {
  let servicesUpdated = false;
  serviceIDs = [];
  parameterError = true;  
  switch(response) {
    // Errors
    case "Invalid station code":
      setStatus('.status', -2, `Invalid station code. Codes should be three letters. To find a station code see: http://www.nationalrail.co.uk/stations_destinations/48541.aspx.`);
      return;
      break;
    case "No station code supplied":
      setStatus('.status', -2, `No station code supplied. Specify station code as URL parameter 'station'. Codes should be three letters. To find a station code see: http://www.nationalrail.co.uk/stations_destinations/48541.aspx.`);
      return;
      break;
    case "No type supplied":
      setStatus('.status', -2, `No type supplied. Specify board type as URL parameter 'type'. Acceptible values are departures or arrivals.`);
      return;
      break;
    case "No type and station code supplied":
      setStatus('.status', -2, `No type or station code supplied. Specify type and station code as URL parameters 'type' and 'station'. Acceptible values are departures or arrivals. To find a station code see: http://www.nationalrail.co.uk/stations_destinations/48541.aspx.`);
      return;
      break;
    case "Error":
      setStatus('.status', -2, `Something went wrong. This error message should never be seen. The problem lies in get/get.php.`);
      return;
      break;
    case 'No response':
    case null:
      parameterError = false;
      if(services != "" && services != null) 
        setStatus('.status', -1, `Disconnected. Check internet connection. Your token may be incorrect or rate limit has been exceeded.`);
      else
        setStatus('.status', -2, `Disconnected. Check internet connection. Your token may be incorrect or rate limit has been exceeded.`);
      break;
    // Assuming response is valid
    default:
      parameterError = false;
      setStatus('.status', 0, 'Connected.');
      response.GetStationBoardResult != null && response.GetStationBoardResult.generatedAt != null ? response.GetStationBoardResult.generatedAt = null: false;
      if(JSON.stringify(response) != JSON.stringify(services)) {
        services = response; // If changed, cache the response
        servicesUpdated = true;        
      }
      break;
  }
  $('.dataChanged').removeClass('dataChanged');

  if(services != "" && services != null && servicesUpdated === true) {
    rowCounter = 0;
    if(services.GetStationBoardResult != null) { // No services
      $(`${TABLEELEMENT} tbody`).empty();
      if(services.GetStationBoardResult.nrccMessages != null) {
        addEmptyRows(4);
        showNRCCNotices('Special Notice', services.GetStationBoardResult.nrccMessages.message);
      } else {
        addEmptyRows(ROWSPERPAGE / 2 - 1);
        $(`${TABLEELEMENT} tbody`).append(`<tr><td style="text-align: center;" colspan="4">Welcome to</td></tr>
                                          <tr><td style="text-align: center;" colspan="4">${services.GetStationBoardResult.locationName}</td></tr>`);
        rowCounter += 2;
      }
    } else {
      setPage(page, Math.ceil(services.length / ROWSPERPAGE));
      if(TYPE == 'departures') {
        for(i = ROWSPERPAGE * (page - 1); i < services.length && i < ROWSPERPAGE * page; i++) {
          var s = services[i];
          serviceIDs.push(sanitizeID(s.serviceID));
          processService(sanitizeID(s.serviceID), s.serviceType, s.std, s.destination.location, s.platform, s.etd);
        }
      } else if(TYPE == 'arrivals') {
        for(i = ROWSPERPAGE * (page - 1); i < services.length && i < ROWSPERPAGE * page; i++) {
          var s = services[i];
          serviceIDs.push(sanitizeID(s.serviceID));
          processService(sanitizeID(s.serviceID), s.serviceType, s.sta, s.origin.location, s.platform, s.eta);
        }
      }
      removeDeparted(true);
    }    
    addEmptyRows(ROWSPERPAGE - rowCounter);
  }
}

/**
 * Show special notices. Only compatible with nrccmessages.
 * @param {string} header - the header 
 * @param {string[]} notices - the notices to display (array optional for single notice)
 *
 * @returns void
 */
function showNRCCNotices(header, notices) {
  if(header != '') {
    $(`${TABLEELEMENT} tbody`).append(`<tr><td style="text-align: center;" colspan="4"><strong>${header}</strong></td></tr>
                                      <tr><td style="text-align: center;" colspan="4">======================================</td></tr>
                                      <tr><td style="text-align: center;" colspan="4">&nbsp;</td></tr>`);
    rowCounter += 3;
  }
  if(typeof notices != "string" && notices.length != null && notices.length > 1) {
    notices.forEach((notice)=> {
      showSingleNotice(splitString(removeATag(notice._), 50, true));
    });
  } else {
    showSingleNotice(splitString(removeATag(notices._), 50, true));
  }
}


/**
 * Show special notices.
 * @param {string} header - the header 
 * @param {string[]} notices - the notices to display (array optional for single notice)
 *
 * @returns void
 */
function showNotices(header, notices) {
  if(header != '') {
    $(`${TABLEELEMENT} tbody`).append(`<tr><td style="text-align: center;" colspan="4"><strong>${header}</strong></td></tr>
                                      <tr><td style="text-align: center;" colspan="4">======================================</td></tr>
                                      <tr><td style="text-align: center;" colspan="4">&nbsp;</td></tr>`);
    rowCounter += 3;
  }
  if(typeof notices != "string" && notices.length != null && notices.length > 1) {
    notices.forEach((notice)=> {
      showSingleNotice(splitString(removeATag(notice), 50, true));
    });
  } else {
    showSingleNotice(splitString(removeATag(notices), 50, true));
  }
}

/**
 * Show a single notice
 * @param {string[]} notice - the notice to display (array optional if notice is single line)
 *
 * @returns void
 */
function showSingleNotice(notice) {
  if(typeof notice === "string") {
    $(`${TABLEELEMENT} tbody`).append(`<tr><td colspan="4">&nbsp;</td></tr>
                                      <tr><td style="text-align: center;" colspan="4">${notice}</td></tr>`);
    rowCounter += 2;
  } else if(typeof notice === "object") {
    notice.forEach((line)=> {
      $(`${TABLEELEMENT} tbody`).append(`<tr><td style="text-align: center;" colspan="4">${line}</td></tr>`);
      rowCounter++;
    });
    $(`${TABLEELEMENT} tbody`).append(`<tr><td colspan="4">&nbsp;</td></tr>`);
    rowCounter++;
  }
}

/**
 * Add a service to the board
 * @param {string} id - the service id
 * @param {string} type - the service type (e.g. train, bus, ferry)
 * @param {string} time - the scheduled time
 * @param {string} destination - the notice to display (array optional if notice is single line)
 * @param {string} platform - the notice to display (array optional if notice is single line)
 * @param {string} expected - the notice to display (array optional if notice is single line)
 *
 * @returns void
 */
function processService(id, type, time, destination, platform, expected) {
  let via = "";
  if(destination.length != null && destination.length > 1) { // Mulitple destinations
    let tempDest = "";
    destination.forEach((dest) => {
      if(tempDest != "") {
        tempDest += " & ";
      }
      tempDest += dest.locationName;
    });
    destination = tempDest.replace('&', '&amp;');
  } else {
    if(destination.via != null) {
      via = destination.via;
    }
    destination = destination.locationName.replace('&', '&amp;');
  }
  if(platform == null && type != "train") {
    platform = type;
  } else if(platform == null) {
    platform = "";
  }
  if($(`#${id}`).length === 0) { // New 
    $(`${TABLEELEMENT} tbody`).append(`<tr id="${id}">
                                        <td headers="dTime" class="dTime">${time}</td>
                                        <td headers="dDest" class="dDest">${destination}</td>
                                        <td headers="dPlat" class="dPlat">${platform}</td>
                                        <td headers="dExp" class="dExp">${expected}</td>
                                      </tr>`);    
  } else { // Update existing
    $(`#${id} td.dTime`).html() != time ? $(`#${id} td.dTime`).html(time) : false;
    $(`#${id} td.dDest`).html() != destination ? $(`#${id} td.dDest`).html(destination).addClass('dataChanged') : false;
    $(`#${id} td.dPlat`).html() != platform ? $(`#${id} td.dPlat`).html(platform).addClass('dataChanged') : false;
    $(`#${id} td.dExp`).html() != expected ? $(`#${id} td.dExp`).html(expected) : false;    
  }  
  rowCounter++;
}

/**
 * Removes services that have left, and optionally empty rows
 * @param {bool} removeEmpty - set true to remove empty rows
 *
 * @returns void
 */
function removeDeparted() {
  $('.departures tbody tr').each((index, el)=> {
    if(serviceIDs.indexOf($(el).attr('id')) === -1) {      
      $(el).remove();
    }
  });
}

/**
 * Sets the page indicator
 * @param {int} currentPage - the current page number
 * @param {int} totalPages - the total number of pages
 *
 * @returns void
 */
function setPage(currentPage, totalPages) {
  $(`.page`).html(`Page <span class="page__number">${currentPage}</span> of <span class="page__number">${totalPages}</span>`)
}

/**
 * Set the status indicator
 * @param {string} el - the element to target
 * @param {string} code - the status code (-1: disconnected, 0: connected)
 * @param {string} reason - the error message to output
 *
 * @returns void
 */
let prevError;
function setStatus(el, code, reason) {
  if(prevError != code + reason) {
    prevError = code + reason;
    switch(code) {
      case -2:
        console.error(reason);
        removeModifierClasses(el);
        $(el).addClass('status--disconnected');
        addEmptyRows(4);
        reason = [reason, "See console for more details."];
        showNotices('Error', reason);
        addEmptyRows(ROWSPERPAGE - rowCounter);
        break;
      case -1:
        console.error(reason);
        removeModifierClasses(el);
        $(el).addClass('status--disconnected');
        break;
      case 0:
      default:
        removeModifierClasses(el);
        break;
    }
  }
}

/**
 * Adds the specified amount of empty rows to the table
 * @param {int} i - the number of rows to add
 *
 * @returns void
 */
function addEmptyRows(r) {
  if(r > 0) {
    for(let i = 0; i < r; i++) {
      $(`${TABLEELEMENT} tbody`).append(`<tr><td colspan="4">&nbsp;</td></tr>`);      
      rowCounter++;
    }
  }
}

/**
 * Removes A tags from a string, replacing it with the url domain, and all other tags.
 * @param {string} str - the string

 * @returns string
 */
function removeATag(str) {
  if(str.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)">([^"]*)<\/a>/gi) != null) {
    str = str.replace(/in (?=<a\s+(?:[^>]*?\s+)?href="([^"]*)">([^"]*)<\/a>)/gi, "at ");
    str = str.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)">([^"]*)<\/a>/gi, $(str.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)">([^"]*)<\/a>/gi)[0]).attr('href').match(/http:\/\/([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/gi)[0].replace("http://", ""));
  }
  if(str.match(/<[^>]*>/gi) != null) {
    str = str.replace(/<[^>]*>/g, "");
  }
  return str;
}

/**
 * Returns an array of the input string split into strings of a specified size
 * @param {string} str - the string to split
 * @param {int} chars - the size of output strings
 * @param {bool} full - set true to keep words whole, false to split at the character limit regardless of if in middle of a word.
 *
 * @returns string[]
 */
function splitString(str, chars, full) {
  let splits = [];
  str = str + " "; // Add space to the end so we don't need to check for other characters at the end of the string
  while(str.length > 0) {
    let trimmedString = str.substr(0, chars); // trim the string to the maximum length
    if(trimmedString.lastIndexOf(" ") != -1) {
      lastInd = trimmedString.lastIndexOf(" ");
    } else {
      lastInd = trimmedString.length - 1;
    }
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, lastInd))// re-trim if we are in the middle of a word
    if(trimmedString == "") {
      trimmedString = str;
    }
    str = str.replace(trimmedString, "");
    if(trimmedString != " ") {
      splits.push(trimmedString.trim());
    }
  }
  return splits;
}

getTrains(STATIONCODE, TOTALROWS, TYPE, processTrains);

let sync = setInterval(()=> {
  if(parameterError === false && (new Date).getSeconds() % 10 === 0) {
    clearInterval(sync);
    getTrains(STATIONCODE, TOTALROWS, TYPE, processTrains);
    setInterval(()=> {
      getTrains(STATIONCODE, TOTALROWS, TYPE, processTrains);
    }, 10000);
  } else if(parameterError) {
    clearInterval(sync);
  }
}, 50);
