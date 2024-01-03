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
let audioElement;
let audioSource;
let fileName;
var customTitles = JSON.parse(localStorage.getItem("custom-titles")) || {};

function setupAnalysis() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
	
    // Create an analyzer node to analyze the audio
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    // Connect the audio source to the analyzer
    audioElement = document.getElementById('audio');
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
	    // Get frequency data
	    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
	
	    // Function to calculate the average value in a frequency range
	    function getAverageValue(startIndex, endIndex) {
	        analyser.getByteFrequencyData(frequencyData);
	        let sum = 0;
	        for (let i = startIndex; i <= endIndex; i++) {
	            sum += frequencyData[i];
	        }
	        return sum / (endIndex - startIndex + 1);
	    }
        
	    // Get volume for low, mid, and high frequencies
	    var lowFrequencyVolume = getAverageValue(0, 30);
	    var midFrequencyVolume = getAverageValue(31, 120);
	    var highFrequencyVolume = getAverageValue(121, 255);

        // Calculate the general volume based on the RMS value
        let rms = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            rms += frequencyData[i] * frequencyData[i];
        }
        rms = Math.sqrt(rms / frequencyData.length);
        const generalVolume = rms;

        // Map the general volume to the alpha value (range 0.1 to 1)
        const alpha = 0.1 + (generalVolume / 255) * 0.9;

        if (localStorage.getItem("debug") == "enabled") { 
            document.getElementById("a-value").style.height = `${alpha * 100}%`;
            document.getElementById("a-text").innerText = Math.round(alpha * 10) / 10;
        }

	    // Map the volumes to a range of 0 to 255
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

        // Adjust the ranges
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

            document.getElementById("r-value").style.height = `${(midVolume + 100) / 255 * 100}px`;
            document.getElementById("g-value").style.height = `${highVolume / 255 * 100}px`;
            document.getElementById("b-value").style.height = `${(lowVolume - 100) / 255 * 100}px`;

            var r = Math.round((midVolume * 2) / 255 * 100);

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

            var b = Math.round((lowVolume / 2) / 255 * 100);

            if (b < 10) {
                b = `00${b}`;
            }

            else if (b < 100) {
                b = `0${b}`;
            }

            document.getElementById("r-text").innerText = r;
            document.getElementById("g-text").innerText = g;
            document.getElementById("b-text").innerText = b;
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
    // Check if the input is a valid RGBA string
    const rgbaRegex = /^rgba\((\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*),\s*([\d.]+)\)$/;
  
    if (!rgbaRegex.test(rgba)) {
      return null; // Invalid input
    }
  
    // Extract RGBA values
    const [, r, g, b, a] = rgba.match(rgbaRegex);
  
    // Convert the values to hexadecimal and ensure they have two digits
    const toHex = (value) => {
      const intValue = Math.round(parseFloat(value));
      const hex = intValue.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);
  
    // Convert the alpha value to a hexadecimal value (between 00 and FF)
    const alpha = Math.round(parseFloat(a) * 255);
    const hexA = toHex(alpha);
  
    // Construct the hexadecimal color string
    const hexColor = `#${hexR}${hexG}${hexB}${hexA}`;
  
    return hexColor;
  }

// Function to change the skew variable
function changeSkew(newSkew) {
    skew = newSkew;
}

function uploadFile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/mp3, audio/wav, audio/ogg';
    input.onchange = () => {
        let file = input.files[0]; // Get the first selected file
        if (file) {
            fileName = file.name;

            let lastDotIndex = fileName.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                fileName = fileName.substring(0, lastDotIndex); // Extract the string before the last '.'
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

                    // Update the progress element with the percentage loaded
                    document.getElementById("title").innerText = `${percentLoaded.toFixed(2)}%`;
                    document.title = `${percentLoaded.toFixed(2)}% | Music Player`;

                    if (percentLoaded == 100) {
                        document.getElementById("title").innerText = "Analysing...";
                        document.title = "Analysing... | Music Player";
                    }
                }
            };

            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };
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

        // Add styles to change background color based on the retrieved color
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
    document.getElementById("audio").onpause = "";
    document.getElementById("glow").remove();
}

if (localStorage.getItem("colour") == null) {
    localStorage.setItem("colour", "rgba(255, 0, 0, 0.25)");
    location.reload();
}

if (screen.width < screen.height) {
    document.getElementById("action-row").style.justifyContent = "center";
}

function play() {
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

// Add event listeners for mouseover and mouseout on the progress bar
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
    tooltip.style.top = `${progressContainer.offsetTop - 16}px`; // 1rem above the progress bar
    tooltip.style.left = `${event.pageX - progressContainer.getBoundingClientRect().left}px`; // Adjust horizontal position relative to the progress bar
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

    console.log("Debug disabled");
}

else {
    document.getElementById("debug-card").style.opacity = "1";

    console.log("Debug enabled");
}