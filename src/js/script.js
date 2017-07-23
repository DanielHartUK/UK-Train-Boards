function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
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