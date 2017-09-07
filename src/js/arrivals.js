var sIDs = []; // Array of service ids
var rowsPerPage = 27; // Number of rows to display on each page/screen
if(getQueryVariable("page")) {
  var pages = getQueryVariable("pages"); // Number of pages to fetch
} else {
  var pages = 1; // Number of pages to fetch
}
var departures = rowsPerPage * pages; // Number of departures to get
if(getQueryVariable("page")) {
  var page = getQueryVariable("page"); // Page to display
} else {
  var page = 1; // Page to display
}
var rows; // Row counter
var stationCode = getQueryVariable("station");
var responseError = false;
function getTrains() {
  sIDs = [];
  rows = 0;
  var rowI = 0;
  $.get("php/getArrivals.php?station="+ stationCode +"&rows=" + departures, function(trainServices) {
    $('.departureEntry.error, .departureEntry.noDepartures').remove();
    if(trainServices === "No response") {
      rows += 3;
      responseError = true;
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="errorMessage">No reponse recieved.</p></div></div>');
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="errorMessage">Check station code is correct</p></div></div>');
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="errorMessage">and rate limit is not exceeded.</p></div></div>');
    } else if(trainServices.GetStationBoardResult != null) {
      rows += 9;
      if($('.noDepartures').length === 0) {
        for(i = 0; i < 7; i++) {
          $('.departuresList').append('<div class="departureEntry noDepartures"><div class="departureRow"><p class="errorMessage centre"></p></div></div>');
        }
        $('.departuresList').append('<div class="departureEntry noDepartures"><div class="departureRow"><p class="errorMessage centre">Welcome to</p></div></div>');
        $('.departuresList').append('<div class="departureEntry noDepartures"><div class="departureRow"><p class="errorMessage centre">' + trainServices.GetStationBoardResult.locationName + '</p></div></div>');      }
    } else if(trainServices.length > 0) {
      $.each(trainServices, function(key, service) {
        rowI++;
        if(rowI <= rowsPerPage * (page - 1)) {
          // Do nothing
        } else if (rowI > rowsPerPage * page) {
          return false; // Exit each loop
        } else {
          var sanID = sanitizeID(service.serviceID);
          rows++;
          sIDs.push(service.serviceID);
          if($('#' + sanID).length === 0) { 
            var serviceEntryHTML = '<div class="departureEntry" id="'+ sanID +'" data-serviceID="'+ service.serviceID +'">';
            serviceEntryHTML += '<div class="departureRow">';
            serviceEntryHTML += '<p class="std">';
            if(service.sta != null) {
              serviceEntryHTML += service.sta;
            }
            serviceEntryHTML += '</p>'; // Close std
            serviceEntryHTML += '<p class="destinationName">';
            if(service.origin.location != null) {
              if(service.origin.location.length > 1) {
                var i = 0;
                $.each(service.origin.location, function(key, value) {
                  if(i != 0)
                    serviceEntryHTML += " &amp; ";
                  serviceEntryHTML += '<a href="?station=' + value.crs + '">' + value.locationName + '</a>';
                  i++;
                });  
              } else {
                serviceEntryHTML += '<a href="?station=' + service.origin.location.crs + '">' + service.origin.location.locationName + '</a>';
              }
            }
            serviceEntryHTML += '</p>'; // Close destinationName
            serviceEntryHTML += '<p class="platform">';
            if(service.serviceType != 'train') {
              serviceEntryHTML += service.serviceType;
            } else if(service.platform != null) {
              serviceEntryHTML += service.platform;
            }
            serviceEntryHTML += '</p>';// Close platform
            serviceEntryHTML += '<p class="etd">';
            if(service.eta != null) {
              serviceEntryHTML += service.eta;
            }
            serviceEntryHTML += '</p>'; // Close etd
            serviceEntryHTML += '</div>'; // Close departureRow
            
            serviceEntryHTML += '</div>'; // Close departureEntry
            $('.departuresList').append(serviceEntryHTML);
          } else {
            // Check for updates to a departure
            var r = $('#' + sanID);
            var newHTML = "";
  
            // Check destination
            if(service.origin.location != null) {
              newHTML = "";
              if(service.origin.location.length > 1) {
                var i = 0;
                $.each(service.origin.location, function(key, value) {
                  if(i != 0)
                    newHTML += " &amp; ";
                  newHTML += '<a href="?station=' + value.crs + '">' + value.locationName + '</a>';
                  i++;
                });  
              } else {
                newHTML += '<a href="?station=' + service.origin.location.crs + '">' + service.origin.location.locationName + '</a>';
              }
            }
            if($(r).find('.destinationName').html() != newHTML.replace(" & ", " &amp; ")) {
              $(r).find('.destinationName').html(newHTML).addClass('departureUpdated'); 
            }
  
            // Check platform
            newHTML = "";
            if(service.serviceType != 'train') {
              newHTML = service.serviceType;
            } else if(service.platform != null) {
              newHTML = service.platform;
            }
            if($(r).find('.platform').html() != newHTML) {
              $(r).find('.platform').html(newHTML).addClass('departureUpdated'); 
            }
  
            // Check expected
            newHTML = "";
            if(service.eta != null) {
              newHTML = service.eta;
            }
            if($(r).find('.etd').html() != newHTML) {
              $(r).find('.etd').html(newHTML); 
            }
          }
        }
      });
      var actualPages = Math.ceil(trainServices.length / rowsPerPage);
      $('.page').text("Page " + page + " of " + actualPages);
    }
    $.each($('.departureEntry:not(.empty, .error, .noDepartures)'), function(i, e) {
      var dataID = $(e)[0].dataset.serviceid; 
      if(dataID != NaN && sIDs.indexOf(dataID) === -1) {
        e.remove();
      }  
    })
    // Add empty rows if needed
    $('.departureEntry.empty').remove();
    while(rows < rowsPerPage) {
      $('.departuresList').append('<div class="departureEntry empty"><div class="departureRow"><p class="delayReason">&nbsp;</p></div></div>');
      rows++;
    }
    while(rows > rowsPerPage) {
      if($('.departureEntry.empty').length > 0)
        $('.departuresList').find('.departureEntry.empty')[0].remove();
      rows--;
    }
  });
}
getTrains();
// Wait for time to be 10, 20, etc. seconds to start refreshing board, so pages are synced up if using mutliple displays
var sync = setInterval(function() {
  if(responseError === false && getSecs() % 10 === 0) {
    clearInterval(sync);
    setInterval(getTrains, 10000); // Refresh every 10 seconds
  } else if(responseError) {
    clearInterval(sync);
  }
}, 100);