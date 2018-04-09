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


// YouTube Player API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;
let ytReady = false;

function onYouTubeIframeAPIReady() {
  if(typeof YTID != 'undefined' && YTID != null) {
    player = new YT.Player('ytPlayer', {
      videoId: YTID,
      events: {
        'onReady': onPlayerReady
      }
    });
  }
}

let ytPlay = false;
function onPlayerReady(event) {
  ytReady = true;
  if(ytPlay) {
    player.playVideo();
  }
}

let ytVisible = false;
function startYT() {
  if(typeof YTID != 'undefined' && YTID != null) {
    $('.ytPlayerCont').show();
    rowsperpage = calcRows();
    ytVisible = true;
    ytPlay = true;
    if(ytReady)
      player.playVideo();
  }
}
function stopYT() {
  if(typeof YTID != 'undefined' && YTID != null && ytVisible) {
    $('.ytPlayerCont').hide();
    rowsperpage = calcRows();
    ytVisible = false;
    if(ytReady)
      player.pauseVideo();
  }
}
// End YouTube Player API


