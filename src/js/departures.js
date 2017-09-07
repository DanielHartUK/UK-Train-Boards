var sIDs = []; // Array of service ids
var rowsPerPage = 27; // Number of rows to display on each page/screen
var pages = 5; // Number of pages
var departures = rowsPerPage * pages; // Number of departures to get
if(getQueryVariable("page")) {
  var page = getQueryVariable("page"); // Page to display
} else {
  var page = 1; // Page to display
}
var rows; // Row counter
var stationCode = getQueryVariable("station");
var responseError = false;
var x;
function getTrains(callback) {
  sIDs = [];
  rows = 0;
  var rowI = 0;
  $.get("php/getDepartures.php?station="+ stationCode +"&rows=" + departures, function(trainServices) {
  // $.get("assets/getDeparturesTest2.json", function(trainServices) {
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
            var serviceEntryHTML = '<div class="departureEntry" id="'+ sanID +'" data-serviceID="'+ service.serviceID +'" data-operator="'+ service.operator +'">';
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
    


    if(typeof callback === "function")
      callback();
  });
}
// Wait for time to be 10, 20, etc. seconds to start refreshing board, so pages are synced up if using mutliple displays
var sync = setInterval(function() {
  if(responseError === false && getSecs() % 10 === 0) {
    clearInterval(sync);
    setInterval(getTrains, 10000); // Refresh every 10 seconds
  } else if(responseError) {
    clearInterval(sync);
  }
}, 100)

// Get detailed departures
var departuresDetailed = new Object;
function getTrainsDetailed(callback) {
  $.get("php/getDeparturesDetailed.php?station="+ stationCode +"&rows=" + departures, function(trainServices) {
    $.each(trainServices, function(key, service) {
      departuresDetailed[sanitizeID(service.serviceID)] = service;
    })
    $.each(departuresDetailed, function(key) {
      if($('#' + key).length === 0) {
        delete departuresDetailed[key];
      }
    })
    if(typeof callback === "function") {
      callback();
    }
  });
}

function checkDepartures() {
  $('.departureEntry:not(.empty, .error)').each(function() {
    var departureTime = $(this).find('.std').text();
    var expectedTime = $(this).find('.etd').text();
    if(departureTime === getHM(5) && expectedTime == "On time") {
      var sID = $(this).attr('id');
      var platform = $(this).find('.platform').text();
      var destination = $(this).find('.destinationName').text();
      var operator = $(this).data('operator');
      if(typeof departuresDetailed[sID] != "undefined") {
        var callingPoints = "";
        var ia = 0;
        $.each(departuresDetailed[sID].subsequentCallingPoints, function(k, scp) {
          if(Array.isArray(scp)) { // Train splits
            $.each(scp, function (k, cpl) {
              var cplLength = cpl.callingPoint.length;
              var i = 0;
              $.each(cpl.callingPoint, function(k, cp) {
                if(i > 0 && i != cplLength - 1) {
                  callingPoints += ", ";
                } else if(i === cplLength - 1) {
                  callingPoints += ", and ";
                }
                callingPoints += cp.locationName;
                i++;
              });
              if(ia != scp.length - 1) {
                callingPoints += ", and ";
              }
              ia++;
            })
          } else if(Array.isArray(scp.callingPoint)) { // Many calling points
            var cpLength = scp.callingPoint.length;
            var i = 0;
            $.each(scp.callingPoint, function(k, cp) {
              if(i > 0 && i != cpLength - 1) {
                callingPoints += ", ";
              } else if(i === cpLength - 1) {
                callingPoints += ", and ";
              }
              callingPoints += cp.locationName;
              i++;
            });
          } else { // Destination only
            callingPoints += scp.callingPoint.locationName + " only.";
          }
        });
        speakService(platform, departureTime, operator, destination, callingPoints);
      } else {
        speakService(platform, departureTime, operator, destination, null);
      }
    }
  })
}

function speakService(platform, departureTime, operator, destination, callingPoints) {
  if(callingPoints != null) {
    text = "Platform " + platform + " for the " + departureTime + " " + operator + " service to " + destination + ", calling at: " + callingPoints;
  } else {
    text = "Platform " + platform + " for the " + departureTime + " " + operator + " service to " + destination;
  }
  speak(text, 1, 0.85, 0.8);
}

if(getQueryVariable("speak") === "true") {
  getTrains(function() { getTrainsDetailed( function() { checkDepartures() }) });
  setInterval(getTrainsDetailed, 60000);
  setInterval(checkDepartures, 60000);
} else {
  getTrains();
}


