var jsmediatags = window.jsmediatags;

let skew = localStorage.getItem("colour");

if (skew == "rgba(0, 89, 255, 0.25)") {
  skew = "blue";

  document.getElementById("progress-container").style.backgroundColor = "rgba(0, 89, 255, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(0, 89, 255, 1)";
}

else if (skew == "rgba(255, 0, 0, 0.25)") {
  skew = "red";

  document.getElementById("progress-container").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(255, 0, 0, 1)";
}

else if (skew == "rgba(0, 255, 0, 0.25)") {
  skew = "green";

  document.getElementById("progress-container").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(0, 255, 0, 1)";
}

else if (skew == "rgba(255, 0, 255, 0.25)") {
  skew = "purple";

  document.getElementById("progress-container").style.backgroundColor = "rgba(255, 0, 255, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(255, 0, 255, 1)";
}

let analysisInterval;
let setupComplete;
let audioContext;
let analyser;
let audioElement = document.getElementById('audio');
audioElement.preservesPitch = false;
let audioSource;
let fileName;
let biquadFilter;
var customTitles = JSON.parse(localStorage.getItem("custom-titles")) || {};

function setupAnalysis() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  biquadFilter = audioContext.createBiquadFilter();
  biquadFilter.type = "lowpass";
  biquadFilter.frequency.value = 7500;
	
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  audioSource = audioContext.createMediaElementSource(audioElement);
  audioSource.connect(analyser);
  audioSource.connect(audioContext.destination);

  setupComplete = true;
}

function analyse() {
  if (!setupComplete) {
    setupAnalysis();
  }

  analysisInterval = setInterval(() => {
	  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
	
	  function getAverageValue(startIndex, endIndex) {
	    analyser.getByteFrequencyData(frequencyData);
	    let sum = 0;
	    for (let i = startIndex; i <= endIndex; i++) {
	      sum += frequencyData[i];
	    }
	  
      return sum / (endIndex - startIndex + 1);
	  }

	  var lowFrequencyVolume = getAverageValue(0, 30);
	  var midFrequencyVolume = getAverageValue(31, 120);
	  var highFrequencyVolume = getAverageValue(121, 255);

    let rms = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      rms += frequencyData[i] * frequencyData[i];
    }

    rms = Math.sqrt(rms / frequencyData.length);
    const generalVolume = rms;

    const alpha = 0.1 + (generalVolume / 255) * 0.9;

    if (localStorage.getItem("debug") == "enabled") { 
      document.getElementById("a-value").style.height = `${alpha * 100}%`;
      document.getElementById("a-text").innerText = Math.round(alpha * 10) / 10;
    }

	  const mapTo255 = (value) => (value / 255) * 255;
	
	  let lowVolume = mapTo255(lowFrequencyVolume);
	  let midVolume = mapTo255(midFrequencyVolume);
	  let highVolume = mapTo255(highFrequencyVolume);

    if (isNaN(lowVolume)) {
      lowVolume = 0;
    }

    if (isNaN(midVolume)) {
      midVolume = 0;
    }

    if (isNaN(highVolume)) {
      highVolume = 0;
    }

    lowVolume = Math.min(255, lowVolume);
    midVolume = Math.min(255, midVolume);
    highVolume = Math.min(255, highVolume);

    var rgba;

    if (skew == "blue") {
      rgba = `rgba(${highVolume}, ${midVolume}, ${lowVolume}, ${alpha})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${highVolume / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${midVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${lowVolume / 255 * 100}px`;

        var r = Math.round(highVolume / 255 * 100);

        if (r < 10) {
          r = `00${r}`;
        }

        else if (r < 100) {
          r = `0${r}`;
        }

        var g = Math.round(midVolume / 255 * 100);

        if (g < 10) {
          g = `00${g}`;
        }

        else if (g < 100) {
          g = `0${g}`;
        }

        var b = Math.round(lowVolume / 255 * 100);

        if (b < 10) {
          b = `00${b}`;
        }

        else if (r < 100) {
          b = `0${b}`;
        }

        document.getElementById("r-text").innerText = r;
        document.getElementById("g-text").innerText = g;
        document.getElementById("b-text").innerText = b;
      }
    }

    else if (skew == "green") {
      rgba = `rgba(${midVolume}, ${lowVolume}, ${highVolume}, ${alpha})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${midVolume / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${lowVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${highVolume / 255 * 100}px`;

        var r = Math.round(midVolume / 255 * 100);

        if (r < 10) {
          r = `00${r}`;
        }

        else if (r < 100) {
          r = `0${r}`;
        }

        var g = Math.round(lowVolume / 255 * 100);

        if (g < 10) {
          g = `00${g}`;
        }

        else if (g < 100) {
          g = `0${g}`;
        }

        var b = Math.round(highVolume / 255 * 100);

        if (b < 10) {
          b = `00${b}`;
        }

        else if (r < 100) {
          b = `0${b}`;
        }

        document.getElementById("r-text").innerText = r;
        document.getElementById("g-text").innerText = g;
        document.getElementById("b-text").innerText = b;
      }
    }

    else if (skew == "red") {
      rgba = `rgba(${lowVolume}, ${midVolume}, ${highVolume}, ${alpha})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${lowVolume / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${midVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${highVolume / 255 * 100}px`;

        var r = Math.round(lowVolume / 255 * 100);

        if (r < 10) {
          r = `00${r}`;
        }

        else if (r < 100) {
          r = `0${r}`;
        }

        var g = Math.round(midVolume / 255 * 100);

        if (g < 10) {
          g = `00${g}`;
        }

        else if (g < 100) {
          g = `0${g}`;
        }

        var b = Math.round(highVolume / 255 * 100);

        if (b < 10) {
          b = `00${b}`;
        }

        else if (r < 100) {
          b = `0${b}`;
        }

        document.getElementById("r-text").innerText = r;
        document.getElementById("g-text").innerText = g;
        document.getElementById("b-text").innerText = b;
      }
    }

    else if (skew == "purple") {
      rgba = `rgba(${midVolume + 100}, ${highVolume}, ${lowVolume - 100}, ${alpha})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${(midVolume + 100) / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${highVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${(lowVolume - 100) / 255 * 100}px`;

        var r = Math.round((midVolume + 100) / 255 * 100);

        if (r < 10) {
          r = `00${r}`;
        }

        else if (r < 100) {
          r = `0${r}`;
        }

        var g = Math.round(highVolume / 255 * 100);

        if (g < 10) {
          g = `00${g}`;
        }

        else if (g < 100) {
          g = `0${g}`;
        }

        var b = Math.round((lowVolume - 100) / 255 * 100);

        if (b < 0) {
          b = "000";
        }

        else if (b < 10) {
          b = `00${b}`;
        }

        else if (b < 100) {
          b = `0${b}`;
        }

        document.getElementById("r-text").innerText = r;
        document.getElementById("g-text").innerText = g;
        document.getElementById("b-text").innerText = b;
      }
    }

    document.getElementById("navbar").style.backgroundColor = rgba;

    document.getElementById("upload1").style.backgroundColor = rgba;
    document.getElementById("upload2").style.backgroundColor = rgba;
    document.getElementById("settings").style.backgroundColor = rgba;
    document.getElementById("about").style.backgroundColor = rgba;

    document.getElementById("play").style.backgroundColor = rgba;
    document.getElementById("stop").style.backgroundColor = rgba;
    document.getElementById("repeat").style.backgroundColor = rgba;

    document.getElementById("tooltip").style.backgroundColor = rgba;
    document.getElementById("progress-container").style.backgroundColor = rgba;
    document.getElementById("progress-bar").style.backgroundColor = rgba.replace("0.25", "1");

    document.getElementById("glow").style.boxShadow = `0px 0px ${generalVolume * 75}px ${generalVolume}px ${rgba}`;
  });
}

function stopAnalysis() {
  clearInterval(analysisInterval);
}

function rgbaToHex(rgba) {
  const rgbaRegex = /^rgba\((\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*),\s*([\d.]+)\)$/;

  if (!rgbaRegex.test(rgba)) {
    return null;
  }
  
  const [, r, g, b, a] = rgba.match(rgbaRegex);
  
  const toHex = (value) => {
    const intValue = Math.round(parseFloat(value));
    const hex = intValue.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  const hexR = toHex(r);
  const hexG = toHex(g);
  const hexB = toHex(b);
  
  const alpha = Math.round(parseFloat(a) * 255);
  const hexA = toHex(alpha);
  
  const hexColour = `#${hexR}${hexG}${hexB}${hexA}`;
  
  return hexColour;
}

function changeSkew(newSkew) {
  skew = newSkew;
}

function uploadFile() {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/mp3, audio/wav, audio/ogg';
  input.onchange = () => {
    let file = input.files[0];
    if (file) {
      if (localStorage.getItem("kandinsky") == "disabled") {
        jsmediatags.read(file, {
          onSuccess: function(tag) {
            var image = tag.tags.picture;
            if (image) {
              var base64String = "";

              for (var i = 0; i < image.data.length; i++) {
                base64String += String.fromCharCode(image.data[i]);
              }
              
              var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
            
              document.getElementById('cover-art').src = base64;
              document.getElementById('cover-art').style.display = "flex";

              generateMaterialDesignPalette(base64, (error, palette) => {
                if (error) {
                  console.error(error);
                }

                else {
                  document.getElementById("navbar").style.backgroundColor = generateRGBA(palette.accent, 0.25);

                  document.getElementById("settings").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("upload1").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("upload2").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("about").style.backgroundColor = generateRGBA(palette.accent, 0.25);

                  document.getElementById("tooltip").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("progress-container").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("progress-bar").style.backgroundColor = palette.accent;

                  document.getElementById("play").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("stop").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("repeat").style.backgroundColor = generateRGBA(palette.accent, 0.25);

                  document.getElementById("settings").addEventListener("mouseover", () => {
                    document.getElementById("settings").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("settings").addEventListener("mouseout", () => {
                    document.getElementById("settings").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })

                  document.getElementById("upload1").addEventListener("mouseover", () => {
                    document.getElementById("upload1").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("upload1").addEventListener("mouseout", () => {
                    document.getElementById("upload1").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })

                  document.getElementById("upload2").addEventListener("mouseover", () => {
                    document.getElementById("upload2").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("upload2").addEventListener("mouseout", () => {
                    document.getElementById("upload2").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })

                  document.getElementById("about").addEventListener("mouseover", () => {
                    document.getElementById("about").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("about").addEventListener("mouseout", () => {
                    document.getElementById("about").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })

                  document.getElementById("play").addEventListener("mouseover", () => {
                    document.getElementById("play").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("play").addEventListener("mouseout", () => {
                    document.getElementById("play").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })

                  document.getElementById("stop").addEventListener("mouseover", () => {
                    document.getElementById("stop").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("stop").addEventListener("mouseout", () => {
                    document.getElementById("stop").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })

                  document.getElementById("repeat").addEventListener("mouseover", () => {
                    document.getElementById("repeat").style.backgroundColor = generateRGBA(palette.accent, 0.5);
                  })

                  document.getElementById("repeat").addEventListener("mouseout", () => {
                    document.getElementById("repeat").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  })
                }
              });
            }
          },
          onError: function(error) {
            console.error('Error reading tags: ', error.type, error.info);
          }
        });
      }

      fileName = file.name;

      let lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        fileName = fileName.substring(0, lastDotIndex);
      }

      while (fileName.includes("_")) {
        fileName = fileName.replace("_", " ");
      }

      document.getElementById("title").innerText = "Loading...";
      document.title = `Loading... | Music Player`;

      let reader = new FileReader();
      reader.onload = function (e) {
        let fileURL = e.target.result;

        document.getElementById("audio").src = fileURL;
        document.getElementById("audio").play();

        document.getElementById("audio").addEventListener("loadedmetadata", () => {
        document.getElementById("title").style.cursor = "url('https://linfindel.github.io/nadircss/cursors/link-select.cur'), auto";

        document.getElementById("title").innerText = fileName;
        document.title = `${fileName} | Music Player`;

        document.getElementById("title").contentEditable = "true";

        if (customTitles[fileName]) {
          document.getElementById("title").innerText = customTitles[fileName];
        }
      });
    };

    reader.onprogress = function (e) {
      if (e.lengthComputable) {
        let percentLoaded = (e.loaded / e.total) * 100;

        document.getElementById("title").innerText = `${percentLoaded.toFixed(2)}%`;
        document.title = `${percentLoaded.toFixed(2)}% | Music Player`;

        if (percentLoaded == 100) {
          document.getElementById("title").innerText = "Analysing...";
          document.title = "Analysing... | Music Player";
        }
      }
    };

    reader.readAsDataURL(file);
  }};
  input.click();
}

function uploadLink() {
  var url = prompt("URL:");

  if (url.includes("https://www.youtube.com") || url.includes("https://music.youtube.com") || url.includes("https://youtu.be")) {
    alert("Downloading or streaming from YouTube is against YouTube Terms of Service. Use a file URL instead.");
  }

  else {
    document.getElementById("audio").src = url;
    document.getElementById("audio").play();

    document.getElementById("title").innerText = "Loading...";
    document.title = `Loading... | Music Player`;

    document.getElementById("audio").addEventListener("loadedmetadata", () => {
      document.getElementById("title").innerText = "Music Player";
      document.title = "Music Player";
    });
  }
}

function applyColour() {
  var colour = localStorage.getItem("colour");

  if (colour) {
    var styleElement = document.getElementsByTagName("style")[0];

    styleElement.innerHTML += `
      .navbar {
        background-color: ${colour};
      }

      .card {
        background-color: ${colour};
      }

      .interactive:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      button:not(.nochange-colour) {
        background-color: ${colour};
      }

      button.not(.nochange-colour):hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      #settings:hover, #upload1:hover, #upload2:hover, #about:hover, #play:hover, #stop:hover, #repeat:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      .glow {
        box-shadow: 0px 0px 200px 100px ${colour};
      }
    `;
  }
}

applyColour();

if (localStorage.getItem("kandinsky") == "disabled") {
  document.getElementById("audio").onplay = "";
  document.getElementById("glow").remove();
}

if (localStorage.getItem("colour") == null) {
  localStorage.setItem("colour", "rgba(255, 0, 0, 0.25)");
  location.reload();
}

if (screen.width < screen.height) {
  document.getElementById("action-row").style.justifyContent = "center";
}

if (screen.width < screen.height && localStorage.getItem("kandinsky") == "disabled") {
  document.getElementById("about").remove();
}

function play() {
  if (audioElement.src) {
    if (audioElement.paused) {
      audioElement.play();
  
      document.getElementById("play-icon").innerText = "pause_circle";
      document.getElementById("play-text").innerText = "Pause";
  
      document.getElementById("play").style.width = "";
    }
  
    else {
      audioElement.pause();
  
      document.getElementById("play-icon").innerText = "play_circle";
      document.getElementById("play-text").innerText = "Play";
  
      document.getElementById("play").style.width = "6.75rem";
    }
  }
}

function stop() {
  stopAnalysis();

  audioSource.connect(biquadFilter);
  biquadFilter.connect(audioContext.destination);

  document.getElementById("controls").style.transition = "1s ease";
  document.getElementById("controls").style.opacity = "0";

  document.getElementById("navbar").style.transition = "1s ease";
  document.getElementById("navbar").style.backgroundColor = localStorage.getItem("colour");

  document.getElementById("settings").style.transition = "1s ease";
  document.getElementById("settings").style.backgroundColor = localStorage.getItem("colour");
  
  document.getElementById("upload1").style.transition = "1s ease";
  document.getElementById("upload1").style.backgroundColor = localStorage.getItem("colour");
  
  document.getElementById("upload2").style.transition = "1s ease";
  document.getElementById("upload2").style.backgroundColor = localStorage.getItem("colour");
  
  document.getElementById("about").style.transition = "1s ease";
  document.getElementById("about").style.backgroundColor = localStorage.getItem("colour");

  if (document.getElementById("glow")) {
    document.getElementById("glow").style.transition = "1s ease";
    document.getElementById("glow").style.width = "50vw";
    document.getElementById("glow").style.boxShadow = `0px 0px 200px 100px ${localStorage.getItem("colour")}`;
  }

  document.getElementById("cover-art").style.transition = "1s ease";
  document.getElementById("cover-art").style.opacity = "0";

  var volume = 1;

  setInterval(() => {
    audioElement.volume = volume;
    volume -= 0.01;
  }, 10);

  var speed = 1;

  setInterval(() => {
    audioElement.playbackRate = speed;
    speed -= 0.01;
  }, 10);

  setTimeout(() => {
    location.reload();
  }, 1000);
}

function repeat() {
  if (document.getElementById("audio").loop == true) {
    document.getElementById("audio").loop = false;

    document.getElementById("repeat-icon").innerText = "step";
    document.getElementById("repeat-text").innerText = "Repeat off";
  }

  else {
    document.getElementById("audio").loop = true;

    document.getElementById("repeat-icon").innerText = "repeat";
    document.getElementById("repeat-text").innerText = "Repeat on";
  }
}

const durationInterval = setInterval(() => {
  var duration = document.getElementById("audio").duration;

  if (duration) {
    var currentTime = document.getElementById("audio").currentTime;
        
    var percent = `${(currentTime / duration) * 100}%`;

    document.getElementById("progress-bar").style.width = percent;
  }
});

document.getElementById("audio").addEventListener("play", () => {
  document.getElementById("controls").style.opacity = "1";
  document.getElementById("controls").style.pointerEvents = "all";
});

function updateProgressClick(event) {
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.getElementById("progress-container");
  const offsetX = event.clientX - progressContainer.getBoundingClientRect().left;
  const percentage = (offsetX / progressContainer.offsetWidth) * 100;

  progressBar.style.width = `${percentage}%`;
  const newTime = (percentage / 100) * document.getElementById("audio").duration;
  document.getElementById("audio").currentTime = newTime;
}

document.getElementById("progress-container").addEventListener("click", updateProgressClick);

if (localStorage.getItem("warn") != "true") {
  location.href = "warning.html";
}

setInterval(() => {
  try {
    if (audioElement.paused) {
      document.getElementById("play-icon").innerText = "play_circle";
      document.getElementById("play-text").innerText = "Play";

      document.getElementById("play").style.width = "6.75rem";
    }

    else {
      document.getElementById("play-icon").innerText = "pause_circle";
      document.getElementById("play-text").innerText = "Pause";

      document.getElementById("play").style.width = "";
    }
  }

  catch {
    // Audio playback has not started
  }
}, 100);

document.getElementById("title").addEventListener("input", () => {
  var customTitles = JSON.parse(localStorage.getItem("custom-titles")) || {};

  var originalFileName = fileName;
  var newTitle = document.getElementById("title").innerText;

  document.title = `${newTitle} | Music Player`;

  customTitles[originalFileName] = newTitle;
  localStorage.setItem("custom-titles", JSON.stringify(customTitles));
});

const progressContainer = document.getElementById("progress-container");
const tooltip = document.getElementById("tooltip");

progressContainer.addEventListener("mousemove", showTooltip);
progressContainer.addEventListener("mouseout", hideTooltip);

function showTooltip(event) {
  const duration = document.getElementById("audio").duration;
  const offsetX = event.clientX - progressContainer.getBoundingClientRect().left;
  const percentage = (offsetX / progressContainer.offsetWidth) * 100;
  const currentTime = (percentage / 100) * duration;

  const formattedTime = formatTime(currentTime);
    
  tooltip.style.display = "block";
  tooltip.style.top = `${progressContainer.offsetTop - 16}px`;
  tooltip.style.left = `${event.pageX - progressContainer.getBoundingClientRect().left}px`;
  tooltip.textContent = formattedTime;
}

function hideTooltip() {
  tooltip.style.display = "none";
}

function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedHours = hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
  const formattedMinutes = `${minutes.toString().padStart(2, "0")}:`;
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return hours > 0 ? `${formattedHours}${formattedMinutes}${formattedSeconds}` : `${formattedMinutes}${formattedSeconds}`;
}

if (localStorage.getItem("debug") == "disabled" || !localStorage.getItem("debug")) {
  document.getElementById("debug-card").remove();
}

else {
  document.getElementById("debug-card").style.opacity = "1";
}

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.key = e.key.toLowerCase();

  const notEditingTitle = document.activeElement != document.getElementById("title");
  const audioDuration = document.getElementById("audio").duration;

  if(e.key == " " && notEditingTitle){
    play();
  }

  else if (e.key == "r" && notEditingTitle) {
    repeat();
  }

  else if (e.key == "s" && notEditingTitle) {
    if (document.getElementById("audio").src) {
      stop();
    }
  }

  else if ((e.key == "0" || e.key == "Home") && notEditingTitle) {
    document.getElementById("audio").currentTime = "0";
  }

  else if ((e.key > 0 && e.key < 9) && notEditingTitle) {
    document.getElementById("audio").currentTime = Number(`0.${e.key}`) * audioDuration;
  }

  else if ((e.key == "9" || e.key == "End") && notEditingTitle) {
    document.getElementById("audio").currentTime = audioDuration;
  }

  else if (e.key == "o" && notEditingTitle) {
    location.href = "settings.html";
  }

  else if (e.key == "u" && notEditingTitle) {
    uploadFile();
  }

  else if (e.key == "l" && notEditingTitle) {
    uploadLink();
  }

  else if (e.key == "ArrowRight" && notEditingTitle) {
    document.getElementById("audio").currentTime++;
  }

  else if (e.key == "ArrowLeft" && notEditingTitle) {
    document.getElementById("audio").currentTime--;
  }

  else {
    return;
  }

  document.activeElement.blur();
});

function generateMaterialDesignPalette(imageURL, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  
  img.onload = function () {
    const vibrant = new Vibrant(img);
    const swatches = vibrant.swatches();
  
    if (swatches) {
      const palette = {
        accent: swatches.Vibrant.getHex(),
        primaryDark: swatches.DarkVibrant.getHex(),
        primaryLight: swatches.LightVibrant.getHex(),
        primary: swatches.Muted.getHex(),
      };
  
      callback(null, palette);
    }
        
    else {
      callback("Failed to generate swatches", null);
    }
  };
  
  img.src = imageURL;
}

function generateRGBA(hex, alpha) {
  hex = hex.replace(/^#/, '');

  const bigint = parseInt(hex, 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}