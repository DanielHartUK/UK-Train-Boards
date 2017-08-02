var sIDs = []; // Array of service ids
var rowsPerPage = 27; // Number of rows to display on each page/screen
var pages = 4; // Number of pages
var departures = rowsPerPage * pages; // Number of departures to get
var page = getQueryVariable("page"); // Page to display
var rows; // Row counter
var stationCode = getQueryVariable("station");
function getTrains() {
  sIDs = [];
  rows = 0;
  var rowI = 0;
  $.get("src/php/getDepartures.php?station="+ stationCode +"&rows=" + departures, function(trainServices) {
    if(trainServices.length > 0) {
      $.each(trainServices, function(key, service) {
        rowI++;
        if(rowI <= rowsPerPage * (page - 1)) {
          
        } else if (rowI > rowsPerPage * page) {
          return false;
        } else {
          var sanID = sanitizeID(service.serviceID);
          rows++;
          sIDs.push(service.serviceID);
          if($('#' + sanID).length === 0) { 
            var serviceEntryHTML = '<div class="departureEntry" id="'+ sanID +'" data-serviceID="'+ service.serviceID +'">';
            serviceEntryHTML += '<div class="departureRow">';
            serviceEntryHTML += '<p class="std">';
            if(service.std != null) {
              serviceEntryHTML += service.std;
            }
            serviceEntryHTML += '</p>'; // Close std
            serviceEntryHTML += '<p class="destinationName">';
            if(service.destination.location != null) {
              if(service.destination.location.length > 1) {
                var i = 0;
                $.each(service.destination.location, function(key, value) {
                  if(i != 0)
                    serviceEntryHTML += " &amp; ";
                  serviceEntryHTML += '<a href="?station=' + value.crs + '">' + value.locationName + '</a>';
                  i++;
                });  
              } else {
                serviceEntryHTML += '<a href="?station=' + service.destination.location.crs + '">' + service.destination.location.locationName + '</a>';
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
            if(service.etd != null) {
              serviceEntryHTML += service.etd;
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
            if(service.destination.location != null) {
              newHTML = "";
              if(service.destination.location.length > 1) {
                var i = 0;
                $.each(service.destination.location, function(key, value) {
                  if(i != 0)
                    newHTML += " &amp; ";
                  newHTML += '<a href="?station=' + value.crs + '">' + value.locationName + '</a>';
                  i++;
                });  
              } else {
                newHTML += '<a href="?station=' + service.destination.location.crs + '">' + service.destination.location.locationName + '</a>';
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
            if(service.etd != null) {
              newHTML = service.etd;
            }
            if($(r).find('.etd').html() != newHTML) {
              $(r).find('.etd').html(newHTML); 
            }
          }
        }
      });
    } else {
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="delayReason">Station not specified or incorrect</p></div></div>');
    }
    $.each($('.departureEntry:not(.empty, .error)'), function(i, e) {
      var dataID = $(e)[0].dataset.serviceid; 
      if(dataID != NaN && sIDs.indexOf(dataID) === -1) {
        e.remove();
        console.log('removed');
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
// Sync
var sync = setInterval(function() {
  if(getSecs() % 10 === 0) {
    clearInterval(sync);
    console.log("sync")
    setInterval(getTrains, 10000); // Refresh every 10 seconds
  }
}, 100)

$(document).ready(function() {
  $('.page').text("Page " + page + " of " + pages);
});




