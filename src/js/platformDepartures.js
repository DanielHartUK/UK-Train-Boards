var sIDs = []; // Array of service ids
var stationCode = getQueryVariable("station");
var platform = getQueryVariable("platform").toUpperCase();
var futureDepartures = getQueryVariable("futDep");
var showTime = getQueryVariable("time");
if(getQueryVariable("rows") != null && parseInt(getQueryVariable("rows")) < 4) {
  var rows = parseInt(getQueryVariable("rows"));
} else {
  var rows = 3;
}
var responseError = false;
var r, nextRow, calling;
var wipeHTML = '<div class="wipe"></div>';

if(futureDepartures === "true") {
  $(".platformBoard").addClass('futDep');
}
if(showTime === "true") {
  $(".time").show();
}

function getTrains(callback) {
  sIDs = [];
  //$.get("php/getDeparturesPlatform.php?station="+ stationCode, function(trainServices) {
  $.get("assets/getDeparturesPlatformTest1.json", function(trainServices) {
    $('.departureEntry.error, .departureEntry.noDepartures').remove();
    if(trainServices === "No response") {
      responseError = true;
    } else if(trainServices.GetStationBoardResult != null) {
      if($('.noDepartures').length === 0) {
        
      }
    } else if(trainServices[platform].length > 0) {
      if(trainServices[platform][0] != null) {
        var service = trainServices[platform][0];
        r = service;
        if($('.platformBoard .row:nth-child(1)').attr('id') != sanitizeID(service.serviceID)) {
          console.log('s changed')
        }

        $('.platformBoard .row:nth-child(1)').html(wipeHTML + departureHTML(service, 1)).attr('id', sanitizeID(service.serviceID));
        if(service.subsequentCallingPoints != null) {
          var rowHTML = '<p class="callingTitle">Calling at: </p><div class="callingListCont"><p>';
          var callingHTML = "";
          if(Array.isArray(service.subsequentCallingPoints.callingPointList)) {
            var l = service.subsequentCallingPoints.callingPointList.length;
            $.each(service.subsequentCallingPoints.callingPointList, function(key, value) {
              callingHTML += callingPoints(value.callingPoint);
              if(key != l-1) {
                callingHTML += ", ";
              }
            });
          } else {
            callingHTML += callingPoints(service.subsequentCallingPoints.callingPointList.callingPoint);
          }
          rowHTML += callingHTML;
          rowHTML += "</p></div>";

          if($('.platformBoard .row:nth-child(2) div p').html() != callingHTML) {
            $('.platformBoard .row:nth-child(2)').html(wipeHTML + rowHTML);
          }
          calling = true;
        } else {
          //$('.platformBoard .row:nth-child(2)').html("");
          calling = false;
        }
        if(futureDepartures === "true") {
          if (calling) {
            nextRow = 3;
          } else {
            nextRow = 2;
          }
          if(trainServices[platform][1] != null && ((calling && rows === 3) || !calling)) {
            $('.platformBoard .row:nth-child(' + nextRow + ')').html(wipeHTML + departureHTML(trainServices[platform][1], 2)).attr('id', sanitizeID(trainServices[platform][1].serviceID));
            nextRow++;
          }
          if(trainServices[platform][2] != null && !calling && rows === 3) {
            $('.platformBoard .row:nth-child(' + nextRow + ')').html(wipeHTML + departureHTML(trainServices[platform][2], 3)).attr('id', sanitizeID(trainServices[platform][2].serviceID));
            nextRow++;
          }
        }
      } else {
        // No departures from this platform
        console.log('no dep');
      }
    }
    
    if(typeof callback === "function") 
      callback();
  });
}

function departureHTML(service, num) {
  var rowHTML = "";
  if(futureDepartures === "true") {
    rowHTML += '<p class="depNo">';
    if(num === 1) {
      rowHTML += '1st';
    } else if(num === 2) {
      rowHTML += '2nd';
    } else if(num === 3) {
      rowHTML += '3rd';
    } else {
      rowHTML += num+'th';
    }
    rowHTML += '</p>';
  }
  rowHTML += '<p class="std">';
  if(service.std != null) {
    rowHTML += service.std;
  }
  rowHTML += '</p>'; // Close std
  rowHTML += '<p class="destinationName">';
  if(service.destination.location != null) {
    if(service.destination.location.length > 1) {
      var i = 0;
      $.each(service.destination.location, function(key, value) {
        if(i != 0)
          rowHTML += " &amp; ";
        rowHTML += value.locationName;
        i++;
      });  
    } else {
      rowHTML += service.destination.location.locationName;
    }
  }
  rowHTML += '</p>'; // Close destinationName
  rowHTML += '<p class="etd">';
  if(service.etd != null) {
    rowHTML += service.etd;
  }
  rowHTML += '</p>'; // Close etd
  return rowHTML;
}

function callingPoints(callingPoint) {
  var output = "";
  if(Array.isArray(callingPoint)) {
    var l = callingPoint.length;
    $.each(callingPoint, function(key, value) {
      if(key === l-1) {
        output += ", and ";
      } else if(key > 0) {
        output += ", ";
      }
      output += value.locationName;
    })
  } else {
    var value = callingPoint;
    output += value.locationName;
  }
  return output;
}

function scrollCalling() {
  var el = $('.callingListCont p');
  var elWidth = el.outerWidth();
  if(elWidth > el.parent().width()) {
    el.css('left', '1510px');
    scrollAnimation(el, 0.2, scrollCalling);
  } else {
    el.css('transition', '').css('left', '0');
  }
}

// Wait for time to be 10, 20, etc. seconds to start refreshing board, so pages are synced up if using multiple displays
var sync = setInterval(function() {
  if(responseError === false && getSecs() % 10 === 0) {
    clearInterval(sync);
    //setInterval(getTrains, 10000); // Refresh every 10 seconds
  } else if(responseError) {
    clearInterval(sync);
  }
}, 100)

getTrains(scrollCalling);