if(getQueryVariable("screen")) {
  var screen = getQueryVariable("screen"); // Page to display
} else {
  var screen = 1; // Page to display
}
var responseError = false;
var stationCode = getQueryVariable("station"); // Station
var r;
var altNames; 
var maxRows = 17;
var calRows;
var trainSplits = [];
$.get("assets/alternativeStationNames.json", function(result) { altNames = result.alternativeNames; });
function getTrains(callback) {
  $.get("php/getDeparturesDetailed.php?station="+ stationCode, function(trainServices) {
  //$.get("assets/getDeparturesDetailedTest1.json", function(trainServices) {
    trainSplits = [];
    r = trainServices;
    //console.log(trainServices);
    $('.departureEntry.error, .departureEntry.noDepartures').remove();
    if(trainServices === "No response") {
      rows += 3;
      responseError = true;
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="errorMessage">No reponse recieved.</p></div></div>');
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="errorMessage">Check station code is correct</p></div></div>');
      $('.departuresList').append('<div class="departureEntry error"><div class="departureRow"><p class="errorMessage">and rate limit is not exceeded.</p></div></div>');
    } else if(trainServices === "No departures") {
      rows++;
      if($('.noDepartures').length === 0) {
        $('.departuresList').append('<div class="departureEntry noDepartures"><div class="departureRow"><p class="errorMessage centre">No departures</p></div></div>');
      }
    } else if(trainServices.length > 0) {
      $('.main').removeClass('changed');
      service = trainServices[screen - 1];

      if($('.main').attr('id') != sanitizeID(service.serviceID)) { // Change
        $('.main').attr('id', sanitizeID(service.serviceID)).addClass('changed');
        callback = scrollServiceInfo;
      } 

      $('.departuresList .departureTime').html(service.std);
      $('.departuresList .departureTimeEstimated').html(service.etd);
      if(service.platform != null && service.platform != "TBC") {
        $('.departuresList .platform').html("Plat " + service.platform);
        $('.headingRight.timePlat').addClass('animate');
      } else {
        $('.departuresList .platform').html("");
        $('.headingRight.timePlat').removeClass('animate');
      }

      if(service.destination.location != null) {
        destinationName = "";
        if(service.destination.location.length > 1) {
          var i = 0;
          $.each(service.destination.location, function(key, value) {
            if(i != 0)
              destinationName += " &amp; ";
            destinationName += value.locationName;
            i++;
          });  
        } else {
          if(altNames[service.destination.location.crs] != null) {
            destinationName += altNames[service.destination.location.crs];
          } else {
            destinationName += service.destination.location.locationName;
          }
        }
      }
      if($('.departuresList .destinationName').data('name') != destinationName) {
        $('.departuresList .destinationName').data('name', destinationName);
        clearInterval(aDN);
        splitDestName(destinationName);
        //$('.departuresList .destinationName').html(destinationName).addClass('departureUpdated');
      } else {
        //$('.departuresList .destinationName').removeClass('departureUpdated');
      }
      $('.calling .departureEntry').remove();
      calRows = 0;
      if(Array.isArray(service.subsequentCallingPoints.callingPointList)) {
        $.each(service.subsequentCallingPoints.callingPointList, function(key, value) {
          calRows = 0;
          callingPoints(value.callingPoint)
        });
      } else {
        callingPoints(service.subsequentCallingPoints.callingPointList.callingPoint)
      }
      callingListAnimation();
      //cLA = setInterval(callingListAnimation, 5000);

      var serviceInfoHTML = "";
      if(isVowel(service.operator[0])) {
        serviceInfoHTML += 'An ';
      } else {
        serviceInfoHTML += 'A ';
      }
      serviceInfoHTML +=  service.operator + ' service.';
      if(trainSplits.length > 0) {
        serviceInfoHTML += " This service divides at ";
        var l = trainSplits.length;
        $.each(trainSplits, function(key, value) { 
          serviceInfoHTML += value;
          if(key + 1 != l) {
            serviceInfoHTML += " ";
          } 
        });
        serviceInfoHTML += ".";
      }
      $('.departuresList .serviceInformation').html(serviceInfoHTML);
    }
    if(typeof callback === "function")
      callback();
  });
}

function callingPoints(callingPoint) {
  if(Array.isArray(callingPoint)) {
    var l = callingPoint.length;
    $.each(callingPoint, function(key, value) {
      calRows++;
      if($('#' + value.crs + sanitizeID(value.st)).length === 0) {
        var callingHTML = "";
        callingHTML += '<div class="departureEntry '+ (key+1) +'" id="' + value.crs + sanitizeID(value.st) + '"><div class="callingRow">';
        callingHTML += '<p class="callingLocation">';
        if(calRows === l)
          callingHTML += "& ";
        if(altNames[value.crs] != null) {
          callingHTML += altNames[value.crs];
        } else {
          callingHTML += value.locationName;
        }
        callingHTML += '</p>';
  
        if(value.et == "On time") {
          callingHTML += '<p class="callingTime">(' + value.st + ')</p>';
        } else if (value.et != "Delayed") {
          callingHTML += '<p class="callingTime">(' + value.et + ')</p>';
        }
        callingHTML += '</div></div>';
        $('.departuresList .calling').append(callingHTML);
      } else {
        // Assume train splits here since calling point and same time have already appeared
        trainSplits.push(value.locationName);
      }
    })
  } else {
    var value = callingPoint;
    if($('#' + value.crs + sanitizeID(value.st)).length === 0) {
      var callingHTML = "";
      callingHTML += '<div class="departureEntry" id="' + value.crs + sanitizeID(value.st) + '"><div class="callingRow">';
      if(altNames[value.crs] != null) {
        callingHTML += '<p class="callingLocation">' + altNames[value.crs] + '</p>';
      } else {
        callingHTML += '<p class="callingLocation">' + value.locationName + '</p>';
      }
      if(value.et == "On time") {
        callingHTML += '<p class="callingTime">(' + value.st + ')</p>';
      } else {
        callingHTML += '<p class="callingTime">(' + value.et + ')</p>';
      }
      callingHTML += '</div></div>';
      $('.departuresList .calling').append(callingHTML);
    }
    calRows++;
  }
}

function scrollServiceInfo() {
  console.log('ssi')
  var el = $('.serviceInformation');
  var elWidth = el.outerWidth();
  if(elWidth > el.parent().width()) {
    var el = $('.serviceInformation');
    el.css('left', '1000px');
    scrollAnimation(el, 0.2, scrollServiceInfo);
  } else {
    el.css('transition', '').css('left', '0');
  }
}

// Animate destination name if it cannot fit on one line
var aDN;
var aniDestI = 1;
function splitDestName(destName) {
  var x = splitString(20, destName);
  var destHTML = "";
  $.each(x, function(k, v) {
    destHTML += "<p>" + v + "</p>";
  });
  $('.departuresList .destinationName').html(destHTML);
  if(x.length > 1) {
    aDN = setInterval(animateDestName, 5000);
  }
}

function animateDestName() {
  if(aniDestI > $('.departuresList .destinationName p').length) {
    aniDestI = 1;
  } 
  $('.departuresList .destinationName p').hide();
  $('.departuresList .destinationName p:nth-child(' + aniDestI + ')').show();
  aniDestI++;
};

// Animate calling point list
var cLA;
var cPage = 1;
var calRowsVisible;
function callingListAnimation() {
  var callingRows = $('.calling .departureEntry:not(.empty)').length;
  if(callingRows > maxRows) {
    $('.callingPage').text('Page ' + cPage + ' of ' + Math.ceil(callingRows/maxRows));
    $('.calling .departureEntry').addClass('hidden');
    $('.calling .departureEntry:gt('+ ((maxRows)*(cPage-1)) +'), .calling .departureEntry:eq('+ ((maxRows)*(cPage-1)) +')').removeClass('hidden');
    $('.calling .departureEntry:gt('+ (((maxRows)*cPage)-1) +')').addClass('hidden');
    cPage++;
    if(cPage > Math.ceil(callingRows/maxRows)) {
      cPage = 1;
    }
  } else {
    cPage = 1;
    $('.callingPage').text('Page ' + cPage + ' of ' + Math.ceil(callingRows/maxRows))
  }
  calRowsVisible = $('.calling .departureEntry:not(.hidden)').length;
  while(calRowsVisible < maxRows) {
    $('.departuresList .calling').append('<div class="departureEntry empty"><div class="callingRow"><p>&nbsp;</p></div></div>');
    calRowsVisible++;
  }
}

// Wait for time to be 10, 20, etc. seconds to start refreshing board, so pages are synced up if using mutliple displays
var sync = setInterval(function() {
  if(responseError === false && getSecs() % 10 === 0) {
    clearInterval(sync);
    setInterval(getTrains, 10000); // Refresh every 10 seconds
  } else if(responseError) {
    clearInterval(sync);
  }
}, 100);

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
/*
function speakService(platform, departureTime, operator, destination, callingPoints) {
  if(callingPoints != null) {
    text = "Platform " + platform + " for the " + departureTime + " " + operator + " service to " + destination + ", calling at: " + callingPoints;
  } else {
    text = "Platform " + platform + " for the " + departureTime + " " + operator + " service to " + destination;
  }
  speak(text, 1, 0.85, 0.8);
}*/

if(getQueryVariable("speak") === "true") {
  getTrains(function() { scrollServiceInfo(); getTrainsDetailed( function() { checkDepartures() }) });
  setInterval(getTrainsDetailed, 60000);
  setInterval(checkDepartures, 60000);
} else {
  getTrains(scrollServiceInfo);
}


