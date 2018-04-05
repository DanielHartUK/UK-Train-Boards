/**
 * Updates the clock.
 * @param {string} el - the HTML element to display the clock
 * @returns void
 */
function startClock(el) {
  let TODAY = new Date();
  let h = tagify('span', TODAY.getHours().toString().padStart(2, "0"), 'clock__number');
  let m = tagify('span', TODAY.getMinutes().toString().padStart(2, "0"), 'clock__number');
  let s = tagify('span', TODAY.getSeconds().toString().padStart(2, "0"), 'clock__number');
  $(el).html(`<span class="clock__group"> ${h} </span>:<span class="clock__group"> ${m} </span>:<span class="clock__group clock__group--small"> ${s} </span`);
  setTimeout(() => {startClock(el)}, 500);
}

/**
 * Wraps a HTML tag around each character in a string.
 * @param {string} tag - the HTML tag string
 * @param {string} str - the input string
 * @param {string} cl - the class name
 * @param {string[]} ignore - characters to not wrap with the tag
 *
 * @returns {sting} the string with tags
 */
function tagify(tag, str, cl, ignore) {
  let r = "";
  for (let i = 0; i < str.length; i++) {
    if(ignore == null || ignore.charAt(str.charAt(i)) != -1) {
      let clStr;
      if(cl != null) {
        clStr = `class="${cl}"`;
      } else {
        clStr = ``;
      }
      r = r + `<${tag} ${clStr}> ${str.charAt(i)} </${tag}>`;
    } else {
      r = r + str.charAt(i);
    }
  }
  return r;
}

/**
 * Get a url parameter value
 * @param {string} variable - the url parameter
 *
 * @returns {sting} the paramater value
 */
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

/**
 * Remove all BEM modofier classes from an element
 * @param {string} el - the element to target
 *
 * @returns void
 */
function removeModifierClasses(el) {
  $(el).removeClass((index, className) => {
    return (className.match (/\w+--\w+/g) || []).join(' ');
  });
}

/**
 * Returns a random letter from A-z
 *
 * @returns string
 */
function randomLetter() {
    var chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr( Math.floor(Math.random() * 62), 1);
}

/**
 * Returns a valid HTML ID from an inputted string
 * @param {string} id - the input string
 *
 * @returns string
 */
function sanitizeID(id) {
  return id.replace(/^[^a-zA-Z]|[^a-zA-Z0-9-_:.]/g, '');
}
/*

$('.delayReason').each(() => {
  var text = $(this).text();
  var textArray = text.match(/\S[\s\S]{0,30}\S(?=\s|$)/g);

  var x = 0;
  var el = this;
  if(x + 1 == textArray.length) {
    $(el).text(textArray[x] + ".");
  } else {
    $(el).text(textArray[x] + "...");
  }  
  setInterval(() => {
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



function scrollAnimation(el, speed, callback) {
  var elWidth = el.outerWidth();
  if(elWidth > el.parent().width()) {
    var aniTime = elWidth/(speed * 1000);
    el.css('transition', aniTime + 's linear 0s').css('left', '-' + elWidth + 'px');
    setTimeout(() => {
      el.css('transition', '').css('left', el.parent().width() + 'px');
      if(typeof callback === "function") {
        callback();
      }
    }, aniTime * 1000)
  } else {
    el.css('transition', '').css('left', '0');
  }
}

function isVowel(letter) {
  letter = letter.toLowerCase();
  return letter === "a" || letter === "e" || letter === "i" || letter === "o" || letter === "u";
}
// From: https://stackoverflow.com/a/6632771
function splitString(len, input) {
  var curr = len;
  var prev = 0;
  output = [];
  while (input[curr]) {
    if (input[curr++] == ' ') {
      output.push(input.substring(prev,curr));
      prev = curr;
      curr += len;
    }
  }
  output.push(input.substr(prev));
  return output;
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
*/


