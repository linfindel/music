let skew = localStorage.getItem("colour");

if (skew == "rgba(0, 89, 255, 0.25)") {
    skew = "blue";
}

else if (skew == "rgba(255, 0, 0, 0.25)") {
    skew = "red";
}

else if (skew == "rgba(0, 255, 0, 0.25)") {
    skew = "green";
}

let analysisInterval;
let setupComplete;
let audioContext;
let analyser;
let audioElement;
let audioSource;

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

        if (lowVolume == 0 && midVolume == 0 && highVolume == 0) {
            lowVolume = 0;
            midVolume = 89;
            highVolume = 255;
        }
	
	    console.log('Low Frequency Volume:', lowVolume);
	    console.log('Mid Frequency Volume:', midVolume);
	    console.log('High Frequency Volume:', highVolume);
        console.log('General Volume:', generalVolume);
        console.log('Skew:', skew);

        var rgba;

        if (skew == "blue") {
            rgba = `rgba(${highVolume}, ${midVolume}, ${lowVolume}, ${alpha})`;
        }

        else if (skew == "green") {
            rgba = `rgba(${midVolume}, ${lowVolume}, ${highVolume}, ${alpha})`;
        }

        else if (skew == "red") {
            rgba = `rgba(${lowVolume}, ${midVolume}, ${highVolume}, ${alpha})`;
        }

        console.log("RGBA:", rgba);

        document.getElementById("navbar").style.backgroundColor = rgba;

        document.getElementById("upload1").style.backgroundColor = rgba;
        document.getElementById("upload2").style.backgroundColor = rgba;
        document.getElementById("settings").style.backgroundColor = rgba;
        document.getElementById("about").style.backgroundColor = rgba;

        document.getElementById("glow").style.boxShadow = `0px 0px ${generalVolume * 75}px ${generalVolume}px ${rgba}`;
    }, 0);
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
    input.onchange = () => {
        let file = input.files[0]; // Get the first selected file
        if (file) {
            var fileName = file.name;
            fileName = fileName.split('.').slice(0, -1).join('.');
            
            while (fileName.includes("_")) {
                fileName = fileName.replace("_", " ");
            }

            document.getElementById("title").innerText = fileName;
            document.title = `${fileName} | Music Player`;

            let reader = new FileReader();
            reader.onload = function (e) {
                let fileURL = e.target.result;
                console.log(fileURL);

                document.getElementById("audio").src = fileURL;
                document.getElementById("audio").play();
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };
    input.click();
}

function uploadLink() {
    var url = prompt("URL:");

    document.getElementById("audio").src = url;
    document.getElementById("audio").play();
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

            #settings:hover, #upload1:hover, #upload2:hover, #about:hover {
                background-color: ${colour.replace("0.25", "0.5")};
            }

            .glow {
                box-shadow: 0px 0px 200px 100px ${colour};
            }
        `;
    }

    console.log("Colour:", colour);
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