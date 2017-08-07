// From: https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function getSecs() {
  return new Date().getSeconds();
}

function getHM(addMins) {
  return moment().add(addMins, 'm').format('H:mm')
}

$('.delayReason').each(function() {
  var text = $(this).text();
  var textArray = text.match(/\S[\s\S]{0,30}\S(?=\s|$)/g);

  var x = 0;
  var el = this;
  if(x + 1 == textArray.length) {
    $(el).text(textArray[x] + ".");
  } else {
    $(el).text(textArray[x] + "...");
  }  
  setInterval(function() {
    if((x + 1) == textArray.length) {
      x = 0;
    } else {
      x++;
    }
    if(x + 1 == textArray.length) {
      $(el).text(textArray[x] + ".");
    } else {
      $(el).text(textArray[x] + "...");
    }
  }, 4000);
});

function sanitizeID(id) {
  return id.replace(/[^a-zA-Z0-9]/g,'');
}


// From: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function speak(text, vol, rate, pitch) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.volume = vol;
  msg.rate = rate;
  msg.pitch = pitch;
  msg.lang = "en-UK";
  msg.onend = function() { console.log('finished')};
  window.speechSynthesis.speak(msg);
  console.log(msg);
}



