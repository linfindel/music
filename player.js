var jsmediatags = window.jsmediatags;

let skew = localStorage.getItem("colour");

if (skew == "rgba(0, 89, 255, 0.25)") {
  skew = "blue";

  document.getElementById("progress-container").style.backgroundColor = "rgba(0, 89, 255, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(0, 89, 255, 1)";

  if (localStorage.getItem("debug") == "enabled") {
    document.getElementById("low-freq").style.backgroundColor = "rgba(0, 0, 255, 0.25)";
    document.getElementById("medium-freq").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
    document.getElementById("high-freq").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
  }
}

else if (skew == "rgba(255, 0, 0, 0.25)") {
  skew = "red";

  document.getElementById("progress-container").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(255, 0, 0, 1)";

  if (localStorage.getItem("debug") == "enabled") {
    document.getElementById("low-freq").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
    document.getElementById("medium-freq").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
    document.getElementById("high-freq").style.backgroundColor = "rgba(0, 0, 255, 0.25)"
  }
}

else if (skew == "rgba(0, 255, 0, 0.25)") {
  skew = "green";

  document.getElementById("progress-container").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(0, 255, 0, 1)";

  if (localStorage.getItem("debug") == "enabled") {
    document.getElementById("low-freq").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
    document.getElementById("medium-freq").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
    document.getElementById("high-freq").style.backgroundColor = "rgba(0, 0, 255, 0.25)";
  }
}

else if (skew == "rgba(255, 0, 255, 0.25)") {
  skew = "purple";

  document.getElementById("progress-container").style.backgroundColor = "rgba(255, 0, 255, 0.25)";
  document.getElementById("progress-bar").style.backgroundColor = "rgba(255, 0, 255, 1)";

  if (localStorage.getItem("debug") == "enabled") {
    document.getElementById("low-freq").style.backgroundColor = "rgba(0, 0, 255, 0.25)";
    document.getElementById("medium-freq").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
    document.getElementById("high-freq").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
  }
}

let analysisInterval, setupComplete, audioContext, analyser, audioSource, fileName, biquadFilter, base64, medianColor, image, artist, lastRGBA, globalAccent, rgbColour, selectedColour, rgbSelectedColour, rgbaSelectedColour, lowFrequencies, midFrequencies, highFrequencies, cooldown;

let audioElement = document.getElementById('audio');
audioElement.preservesPitch = false;
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

    if (localStorage.getItem("debug") == "enabled" && !cooldown) {
      lowFrequencies = [];
      midFrequencies = [];
      highFrequencies = [];

      document.getElementById("low-freq").innerHTML = "";
      document.getElementById("medium-freq").innerHTML = "";
      document.getElementById("high-freq").innerHTML = "";

      for (let i = 0; i < 30; i += 5) {
        lowFrequencies[i] = getAverageValue(i, i + 5);

        const freqBar = document.createElement("div");
        freqBar.id = `low-freq-value-${i}`;
        freqBar.style.position = "relative";
        freqBar.style.width = "16.666666667%";

        document.getElementById("low-freq").appendChild(freqBar);
      }

      for (let i = 0; i < 90; i += 5) {
        midFrequencies[i] = getAverageValue(i + 30, i + 35);

        const freqBar = document.createElement("div");
        freqBar.id = `medium-freq-value-${i}`;
        freqBar.style.position = "relative";
        freqBar.style.width = "5.555555556%";

        document.getElementById("medium-freq").appendChild(freqBar);
      }

      for (let i = 0; i < 135; i += 5) {
        highFrequencies[i] = getAverageValue(i + 120, i + 125);

        const freqBar = document.createElement("div");
        freqBar.id = `high-freq-value-${i}`;
        freqBar.style.position = "relative";
        freqBar.style.width = "3.703703704%";

        document.getElementById("high-freq").appendChild(freqBar);
      }

      const meanBarLow = document.createElement("div");
      meanBarLow.id = "low-freq-mean";
      meanBarLow.style.position = "absolute";
      meanBarLow.style.width = "100%";
      meanBarLow.style.height = "0.2rem";
      meanBarLow.style.bottom = "0";
      meanBarLow.style.zIndex = "1";
      meanBarLow.style.backdropFilter = "saturate(20)";

      document.getElementById("low-freq").appendChild(meanBarLow);

      const meanBarMid = document.createElement("div");
      meanBarMid.id = "medium-freq-mean";
      meanBarMid.style.position = "absolute";
      meanBarMid.style.width = "100%";
      meanBarMid.style.height = "0.2rem";
      meanBarMid.style.bottom = "0";
      meanBarMid.style.zIndex = "1";
      meanBarMid.style.backdropFilter = "saturate(20)";

      document.getElementById("medium-freq").appendChild(meanBarMid);

      const meanBarHigh = document.createElement("div");
      meanBarHigh.id = "high-freq-mean";
      meanBarHigh.style.position = "absolute";
      meanBarHigh.style.width = "100%";
      meanBarHigh.style.height = "0.2rem";
      meanBarHigh.style.bottom = "0";
      meanBarHigh.style.zIndex = "1";
      meanBarHigh.style.backdropFilter = "saturate(20)";

      document.getElementById("high-freq").appendChild(meanBarHigh);

      startCooldown();
    }

    let rms = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      rms += frequencyData[i] * frequencyData[i];
    }

    rms = Math.sqrt(rms / frequencyData.length);
    const generalVolume = rms;

    const alpha = 0.1 + (generalVolume / 255) * 0.9;

    if (localStorage.getItem("debug") == "enabled") { 
      document.getElementById("a-value").style.height = `${alpha * 100}%`;
      document.getElementById("a-text").innerText = alpha.toFixed(2);
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

    if (localStorage.getItem("debug") == "enabled") {
      document.getElementById("low-freq-mean").style.bottom = `${lowVolume / 255 * 100}%`;
      document.getElementById("medium-freq-mean").style.bottom = `${midVolume / 255 * 100}%`;
      document.getElementById("high-freq-mean").style.bottom = `${highVolume / 255 * 100}%`;
    }

    var rgba;
    var rgb;

    if (skew == "blue") {
      rgba = `rgba(${highVolume}, ${midVolume}, ${lowVolume}, ${alpha})`;
      rgb = `rgb(${highVolume}, ${midVolume}, ${lowVolume})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${highVolume / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${midVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${lowVolume / 255 * 100}px`;

        for (let i = 0; i < 30; i += 5) {
          document.getElementById(`low-freq-value-${i}`).style.height = `${lowFrequencies[i] / 255 * 100}%`;
          document.getElementById(`low-freq-value-${i}`).style.backgroundColor = "rgba(0, 0, 255, 0.5)";
        }

        for (let i = 0; i < 90; i += 5) {
          document.getElementById(`medium-freq-value-${i}`).style.height = `${midFrequencies[i] / 255 * 100}%`;
          document.getElementById(`medium-freq-value-${i}`).style.backgroundColor = "rgba(0, 255, 0, 0.5)";
        }

        for (let i = 0; i < 135; i += 5) {
          document.getElementById(`high-freq-value-${i}`).style.height = `${highFrequencies[i] / 255 * 100}%`;
          document.getElementById(`high-freq-value-${i}`).style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        }

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
      rgb = `rgb(${midVolume}, ${lowVolume}, ${highVolume})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${midVolume / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${lowVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${highVolume / 255 * 100}px`;

        for (let i = 0; i < 30; i += 5) {
          document.getElementById(`low-freq-value-${i}`).style.height = `${lowFrequencies[i] / 255 * 100}%`;
          document.getElementById(`low-freq-value-${i}`).style.backgroundColor = "rgba(0, 255, 0, 0.5)";
        }

        for (let i = 0; i < 90; i += 5) {
          document.getElementById(`medium-freq-value-${i}`).style.height = `${midFrequencies[i] / 255 * 100}%`;
          document.getElementById(`medium-freq-value-${i}`).style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        }

        for (let i = 0; i < 135; i += 5) {
          document.getElementById(`high-freq-value-${i}`).style.height = `${highFrequencies[i] / 255 * 100}%`;
          document.getElementById(`high-freq-value-${i}`).style.backgroundColor = "rgba(0, 0, 255, 0.5)";
        }

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
      rgb = `rgba(${lowVolume}, ${midVolume}, ${highVolume})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${lowVolume / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${midVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${highVolume / 255 * 100}px`;

        for (let i = 0; i < 30; i += 5) {
          document.getElementById(`low-freq-value-${i}`).style.height = `${lowFrequencies[i] / 255 * 100}%`;
          document.getElementById(`low-freq-value-${i}`).style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        }

        for (let i = 0; i < 90; i += 5) {
          document.getElementById(`medium-freq-value-${i}`).style.height = `${midFrequencies[i] / 255 * 100}%`;
          document.getElementById(`medium-freq-value-${i}`).style.backgroundColor = "rgba(0, 255, 0, 0.5)";
        }

        for (let i = 0; i < 135; i += 5) {
          document.getElementById(`high-freq-value-${i}`).style.height = `${highFrequencies[i] / 255 * 100}%`;
          document.getElementById(`high-freq-value-${i}`).style.backgroundColor = "rgba(0, 0, 255, 0.5)";
        }

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
      rgb = `rgb(${midVolume + 100}, ${highVolume}, ${lowVolume - 100})`;

      if (localStorage.getItem("debug") == "enabled") {
        document.getElementById("r-value").style.height = `${(midVolume + 100) / 255 * 100}px`;
        document.getElementById("g-value").style.height = `${highVolume / 255 * 100}px`;
        document.getElementById("b-value").style.height = `${(lowVolume - 100) / 255 * 100}px`;

        for (let i = 0; i < 30; i += 5) {
          document.getElementById(`low-freq-value-${i}`).style.height = `${lowFrequencies[i] / 255 * 100}%`;
          document.getElementById(`low-freq-value-${i}`).style.backgroundColor = "rgba(0, 0, 255, 0.5)";
        }

        for (let i = 0; i < 90; i += 5) {
          document.getElementById(`medium-freq-value-${i}`).style.height = `${midFrequencies[i] / 255 * 100}%`;
          document.getElementById(`medium-freq-value-${i}`).style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        }

        for (let i = 0; i < 135; i += 5) {
          document.getElementById(`high-freq-value-${i}`).style.height = `${highFrequencies[i] / 255 * 100}%`;
          document.getElementById(`high-freq-value-${i}`).style.backgroundColor = "rgba(0, 255, 0, 0.5)";
        }

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

    if (localStorage.getItem("kandinsky") == "enabled" || localStorage.getItem("kandinsky") == "circle") {
      document.getElementById("phantom").style.backgroundColor = rgba;

      if (!document.getElementById("phantom").style.backgroundColor.includes("0, 0, 0")) {
        document.getElementById("rgb").style.backgroundColor = rgb;
        document.getElementById("rgba").style.backgroundColor = rgba;

        document.getElementById("navbar").style.backgroundColor = rgba;

        document.getElementById("upload1").style.backgroundColor = rgba;
        document.getElementById("upload2").style.backgroundColor = rgba;
        document.getElementById("settings").style.backgroundColor = rgba;

        document.getElementById("play").style.backgroundColor = rgba;
        document.getElementById("stop").style.backgroundColor = rgba;
        document.getElementById("repeat").style.backgroundColor = rgba;

        document.getElementById("tooltip").style.backgroundColor = rgba;
        document.getElementById("progress-container").style.backgroundColor = rgba;
        document.getElementById("progress-bar").style.backgroundColor = rgba.replace("0.25", "1");

        if (localStorage.getItem("kandinsky") == "enabled") {
         document.getElementById("glow").style.boxShadow = `0px 0px ${generalVolume * 75}px ${generalVolume}px ${rgba}`;
        }
      }
    }

    if (localStorage.getItem("kandinsky") == "hybrid" || localStorage.getItem("kandinsky") == "disabled") {
      selectedColour = globalAccent || medianColor;
      rgbSelectedColour = hexToRgb(selectedColour);
      rgbaSelectedColour = `rgba(${rgbSelectedColour.r}, ${rgbSelectedColour.g}, ${rgbSelectedColour.b}, ${alpha}`;
    }

    if (localStorage.getItem("kandinsky") == "hybrid") {
      document.getElementById("cover-art").style.boxShadow = `0px 0px ${generalVolume + 100}px ${generalVolume - 100}px ${selectedColour}`;

      document.getElementById("navbar").style.backgroundColor = rgbaSelectedColour;

      document.getElementById("upload1").style.backgroundColor = rgbaSelectedColour;
      document.getElementById("upload2").style.backgroundColor = rgbaSelectedColour;
      document.getElementById("settings").style.backgroundColor = rgbaSelectedColour;

      document.getElementById("play").style.backgroundColor = rgbaSelectedColour;
      document.getElementById("stop").style.backgroundColor = rgbaSelectedColour;
      document.getElementById("repeat").style.backgroundColor = rgbaSelectedColour;

      document.getElementById("tooltip").style.backgroundColor = rgbaSelectedColour;
      document.getElementById("progress-container").style.backgroundColor = rgbaSelectedColour;
      document.getElementById("progress-bar").style.backgroundColor = selectedColour;

      document.getElementById("r-value").style.height = `${rgbSelectedColour.r / 255 * 100}px`;
      document.getElementById("g-value").style.height = `${rgbSelectedColour.g / 255 * 100}px`;
      document.getElementById("b-value").style.height = `${rgbSelectedColour.b / 255 * 100}px`
      
      if (rgbSelectedColour.r < 0) {
        rgbSelectedColour.r = "000";
      }

      else if (rgbSelectedColour.r < 10) {
        rgbSelectedColour.r = `00${rgbSelectedColour.r}`;
      }

      else if (rgbSelectedColour.r < 100) {
        rgbSelectedColour.r = `0${rgbSelectedColour.r}`;
      };



      if (rgbSelectedColour.g < 0) {
        rgbSelectedColour.g = "000";
      }

      else if (rgbSelectedColour.g < 10) {
        rgbSelectedColour.g = `00${rgbSelectedColour.g}`;
      }

      else if (rgbSelectedColour.g < 100) {
        rgbSelectedColour.g = `0${rgbSelectedColour.g}`;
      };



      if (rgbSelectedColour.b < 0) {
        rgbSelectedColour.b = "000";
      }

      else if (rgbSelectedColour.b < 10) {
        rgbSelectedColour.b = `00${rgbSelectedColour.b}`;
      }

      else if (rgbSelectedColour.b < 100) {
        rgbSelectedColour.b = `0${rgbSelectedColour.b}`;
      };

      document.getElementById("r-text").innerText = rgbSelectedColour.r;
      document.getElementById("g-text").innerText = rgbSelectedColour.g;
      document.getElementById("b-text").innerText = rgbSelectedColour.b;

      document.getElementById("rgb").style.backgroundColor = selectedColour;
      document.getElementById("rgba").style.backgroundColor = rgbaSelectedColour;
    }

    if (localStorage.getItem("kandinsky") == "circle") {
      document.getElementById("circle").style.border = `5px solid ${rgb}`;
      document.getElementById("circle").style.boxShadow = `0px 0px ${generalVolume}px 5px ${rgb}, 0px 0px 0px ${generalVolume - 100}px ${rgb}`;
    }

    if (localStorage.getItem("kandinsky") == "disabled") {
      document.getElementById("r-value").style.height = `${rgbSelectedColour.r / 255 * 100}px`;
      document.getElementById("g-value").style.height = `${rgbSelectedColour.g / 255 * 100}px`;
      document.getElementById("b-value").style.height = `${rgbSelectedColour.b / 255 * 100}px`;
      document.getElementById("a-value").style.height = `${rgbSelectedColour.b / 255 * 100}px`;

      document.getElementById("r-text").innerText = rgbSelectedColour.r;
      document.getElementById("g-text").innerText = rgbSelectedColour.g;
      document.getElementById("b-text").innerText = rgbSelectedColour.b;
      document.getElementById("a-text").innerText = "0.25";

      document.getElementById("rgb").style.backgroundColor = selectedColour;
      document.getElementById("rgba").style.backgroundColor = `rgba(${rgbSelectedColour.r}, ${rgbSelectedColour.g}, ${rgbSelectedColour.b}, 0.25)`;
    }
  });
}

function stopAnalysis() {
  clearInterval(analysisInterval);
}

function startCooldown() {
  cooldown = true;

  setTimeout(() => {
    cooldown = false;
  }, 25);
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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

  if (navigator.userAgent.toLowerCase().includes('firefox')) {
    input.accept = 'audio/*';  
  }

  else {
    input.accept = 'audio/mp3, audio/wav, audio/ogg';
  }

  input.onchange = () => {
    globalAccent = null;

    let file = input.files[0];
    if (file) {
      jsmediatags.read(file, {
        onSuccess: function(tag) {
          image = tag.tags.picture;
          artist = tag.tags.artist;
          if (image) {
            var base64String = "";

            for (var i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
            }
            
            base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
          
            if (localStorage.getItem("kandinsky") == "disabled" || localStorage.getItem("kandinsky") == "hybrid") {
              document.getElementById('cover-art').src = base64;
              document.getElementById('cover-art').style.display = "flex";

              generateMaterialDesignPalette(base64, (error, palette) => {
                if (error) {
                  console.error(error);

                  const imgElement = document.getElementById('cover-art');
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                
                  canvas.width = imgElement.width;
                  canvas.height = imgElement.height;
                
                  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
                
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const pixels = imageData.data;
                
                  const pixelColors = [];
                    
                  for (let i = 0; i < pixels.length; i += 4) {
                    const red = pixels[i];
                    const green = pixels[i + 1];
                    const blue = pixels[i + 2];
                
                    const color = `rgb(${red}, ${green}, ${blue})`;
                    pixelColors.push(color);
                  }
                
                  const totalCount = pixelColors.length;

                  pixelColors.sort();
                  const medianColorIndex = Math.floor(totalCount / 2);
                  medianColor = pixelColors[medianColorIndex];

                  let rgbValues = medianColor.match(/\d+/g).map(Number);

                  if (window.getComputedStyle(document.body).backgroundColor == "rgb(0, 0, 0)" && (rgbValues[0] < 50 && rgbValues[1] < 50 && rgbValues[2] < 50)) {
                    rgbValues[0] = 50;
                    rgbValues[1] = 50;
                    rgbValues[2] = 50;

                    console.error("Median colour is black, falling back on rgba(50, 50, 50, 0.25)...");
                  }

                  else if (window.getComputedStyle(document.body).backgroundColor == "rgb(255, 255, 255)" && (rgbValues[0] > 205 && rgbValues[1] > 205 && rgbValues[2] > 205)) {
                    rgbValues[0] = 205;
                    rgbValues[1] = 205;
                    rgbValues[2] = 205;

                    console.error("Median colour is white, falling back on rgba(205, 205, 205, 0.25)...");
                  }

                  medianColor = "#";

                  for (let i = 0; i < 3; i++) {
                    let hexPart = rgbValues[i].toString(16);
                    medianColor += hexPart.length == 1 ? "0" + hexPart : hexPart;
                  }
                }

                if (palette) {
                  globalAccent = palette.accent;

                  document.getElementById("cover-art").style.boxShadow = `0px 0px 25vw 0px ${generateRGBA(palette.accent, 0.5)}`;

                  document.getElementById("navbar").style.backgroundColor = generateRGBA(palette.accent, 0.25);

                  document.getElementById("settings").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("upload1").style.backgroundColor = generateRGBA(palette.accent, 0.25);
                  document.getElementById("upload2").style.backgroundColor = generateRGBA(palette.accent, 0.25);

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

                else {
                  document.getElementById("cover-art").style.boxShadow = `0px 0px 25vw 0px ${generateRGBA(medianColor, 0.5)}`;

                  document.getElementById("navbar").style.backgroundColor = generateRGBA(medianColor, 0.25);

                  document.getElementById("settings").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  document.getElementById("upload1").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  document.getElementById("upload2").style.backgroundColor = generateRGBA(medianColor, 0.25);

                  document.getElementById("tooltip").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  document.getElementById("progress-container").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  document.getElementById("progress-bar").style.backgroundColor = medianColor;

                  document.getElementById("play").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  document.getElementById("stop").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  document.getElementById("repeat").style.backgroundColor = generateRGBA(medianColor, 0.25);

                  document.getElementById("settings").addEventListener("mouseover", () => {
                    document.getElementById("settings").style.backgroundColor = generateRGBA(medianColor, 0.5);
                  })

                  document.getElementById("settings").addEventListener("mouseout", () => {
                    document.getElementById("settings").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  })

                  document.getElementById("upload1").addEventListener("mouseover", () => {
                    document.getElementById("upload1").style.backgroundColor = generateRGBA(medianColor, 0.5);
                  })

                  document.getElementById("upload1").addEventListener("mouseout", () => {
                    document.getElementById("upload1").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  })

                  document.getElementById("upload2").addEventListener("mouseover", () => {
                    document.getElementById("upload2").style.backgroundColor = generateRGBA(medianColor, 0.5);
                  })

                  document.getElementById("upload2").addEventListener("mouseout", () => {
                    document.getElementById("upload2").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  })

                  document.getElementById("play").addEventListener("mouseover", () => {
                    document.getElementById("play").style.backgroundColor = generateRGBA(medianColor, 0.5);
                  })

                  document.getElementById("play").addEventListener("mouseout", () => {
                    document.getElementById("play").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  })

                  document.getElementById("stop").addEventListener("mouseover", () => {
                    document.getElementById("stop").style.backgroundColor = generateRGBA(medianColor, 0.5);
                  })

                  document.getElementById("stop").addEventListener("mouseout", () => {
                    document.getElementById("stop").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  })

                  document.getElementById("repeat").addEventListener("mouseover", () => {
                    document.getElementById("repeat").style.backgroundColor = generateRGBA(medianColor, 0.5);
                  })

                  document.getElementById("repeat").addEventListener("mouseout", () => {
                    document.getElementById("repeat").style.backgroundColor = generateRGBA(medianColor, 0.25);
                  })
                }
              });
            }

            var link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = base64;
          }
        },
        onError: function(error) {
          console.error('Error reading tags: ', error.type, error.info);
        }
      });

      fileName = file.name;

      let lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        fileName = fileName.substring(0, lastDotIndex);
      }

      while (fileName.includes("_")) {
        fileName = fileName.replace("_", " ");
      }

      if (localStorage.getItem("numbering") == "enabled") {
        if (localStorage.getItem("custom-regex")) {
          let customRegex = localStorage.getItem("custom-regex");

          while (customRegex.includes("/")) {
            customRegex = customRegex.replace("/", "");
          }

          customRegex = RegExp(customRegex);

          fileName = fileName.replace(customRegex, '');
        }

        else {
          fileName = fileName.replace(/^\d+ - /, '');
        }
      }

      document.getElementById("title").innerText = "Loading...";
      document.title = `Loading... - Music Player`;

      let reader = new FileReader();
      reader.onload = function (e) {
        if (localStorage.getItem("kandinsky") == "circle") {
          document.getElementById("circle").style.animation = "none";
        }

        let fileURL = e.target.result;

        document.getElementById("audio").src = fileURL;
        document.getElementById("audio").play();

        document.getElementById("audio").addEventListener("loadedmetadata", () => {
        document.getElementById("title").style.cursor = "pointer";

        document.getElementById("title").style.transition = "0.5s ease";
        document.getElementById("title").style.opacity = "0";
      
        setTimeout(() => {
          document.getElementById("title").innerText = fileName;
          document.getElementById("title").style.opacity = "1";

          document.getElementById("title").contentEditable = "true";
          document.getElementById("title").style.outline = "none";
        }, 500);

        document.title = `${fileName} - Music Player`;

        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: fileName,
            artist: artist,
            artwork: [{ src: base64 }],
          });
        }

        if (customTitles[fileName]) {
          document.getElementById("title").innerText = customTitles[fileName];
          document.title = `${customTitles[fileName]} - Music Player`;
        }
      });
    };

    reader.onprogress = function (e) {
      if (e.lengthComputable) {
        let percentLoaded = (e.loaded / e.total) * 100;

        document.getElementById("title").innerText = `${percentLoaded.toFixed(2)}%`;
        document.title = `${percentLoaded.toFixed(2)}% - Music Player`;

        if (percentLoaded == 100) {
          document.getElementById("title").innerText = "Analysing...";
          document.title = "Analysing... - Music Player";
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
    document.title = `Loading... - Music Player`;

    document.getElementById("audio").addEventListener("loadedmetadata", () => {
      document.getElementById("title").innerText = "Music Player";
      document.title = "Music Player";
    });
  }
}

function applyColour() {
  var colour = localStorage.getItem("colour");

  if (!colour) {
    location.href = "mode.html";
  }

  rgbColour = rgbaToHex(colour).slice(0, -2);

  if (localStorage.getItem("debug") == "enabled") {
    let rgbSeparatedValues = hexToRgb(rgbColour);
    
    document.getElementById("r-value").style.height = `${rgbSeparatedValues.r / 255 * 100}px`;
    document.getElementById("g-value").style.height = `${rgbSeparatedValues.g / 255 * 100}px`;
    document.getElementById("b-value").style.height = `${rgbSeparatedValues.b / 255 * 100}px`
    document.getElementById("a-value").style.height = `${rgbSeparatedValues.b / 255 * 100}px`

    document.getElementById("r-text").innerText = rgbSeparatedValues.r;
    document.getElementById("g-text").innerText = rgbSeparatedValues.g;
    document.getElementById("b-text").innerText = rgbSeparatedValues.b;
    document.getElementById("a-text").innerText = 0.25;

    document.getElementById("rgb").style.backgroundColor = colour.replace("0.25", "1");
    document.getElementById("rgba").style.backgroundColor = colour;
  }

  if (colour) {
    var styleElement = document.getElementsByTagName("style")[0];

    styleElement.innerHTML += `
      nav {
        background-color: ${colour};
      }

      .card, .card-flat-right, .card-flat-left {
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

      #settings:hover, #upload1:hover, #upload2:hover, #play:hover, #stop:hover, #repeat:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      .glow {
        box-shadow: 0px 0px 200px 100px ${colour};
      }

      .circle {
        animation: circle 1.5s ease infinite alternate;

        border: 5px solid ${rgbColour};
        border-radius: 100%;

        box-shadow: 0px 0px 50px 5px ${rgbColour}, 0px 0px 0px 5px ${rgbColour};

        transition: 0.05s ease;

        width: 10vw;
        height: 10vw;
      }

      @keyframes circle {
        0% {
          box-shadow: 0px 0px 125px 5px ${rgbColour}, 0px 0px 0px 25px ${rgbColour}77;
        }

        100% {
          box-shadow: 0px 0px 25px 5px ${rgbColour}, 0px 0px 0px 12.5px ${rgbColour}77;
        }
      }
    `;
  }
}

applyColour();

if (localStorage.getItem("kandinsky") == "circle") {
  const circle = document.createElement("div");
  circle.className = "circle absolute-centre";
  circle.id = "circle";
  document.body.appendChild(circle);
}

if (localStorage.getItem("colour") == null) {
  localStorage.setItem("colour", "rgba(255, 0, 0, 0.25)");
  location.reload();
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

  if (biquadFilter && localStorage.getItem("stop-effect") == "enabled") {
    audioSource.connect(biquadFilter);
    biquadFilter.connect(audioContext.destination);
  }

  document.getElementById("title").style.transition = "0.5s ease";
  document.getElementById("title").style.opacity = "0";

  setTimeout(() => {
    document.getElementById("title").innerText = "Music Player";
    document.getElementById("title").style.opacity = "1";
  }, 500);

  document.getElementById("controls").style.transition = "1s ease";
  document.getElementById("controls").style.opacity = "0";

  document.getElementById("navbar").style.transition = "1s ease"
  document.getElementById("settings").style.transition = "1s ease";
  document.getElementById("upload1").style.transition = "1s ease";
  document.getElementById("upload2").style.transition = "1s ease";

  document.getElementById("navbar").style.backgroundColor = localStorage.getItem("colour");
  document.getElementById("settings").style.backgroundColor = localStorage.getItem("colour");
  document.getElementById("upload1").style.backgroundColor = localStorage.getItem("colour");
  document.getElementById("upload2").style.backgroundColor = localStorage.getItem("colour");

  if (document.getElementById("glow")) {
    document.getElementById("glow").style.transition = "1s ease";
    document.getElementById("glow").style.width = "75vw";
    document.getElementById("glow").style.boxShadow = `0px 0px 200px 100px ${localStorage.getItem("colour")}`;
  }

  if (document.getElementById("circle")) {
    document.getElementById("circle").style.transition = "1s ease";
    document.getElementById("circle").style.border = `5px solid ${rgbColour}`;
    document.getElementById("circle").style.boxShadow = `0px 0px 125px 5px ${rgbColour}, 0px 0px 0px 25px ${rgbColour}77`;
  }

  document.getElementById("cover-art").style.transition = "1s ease";
  document.getElementById("cover-art").style.opacity = "0";

  var volume = 1;

  setInterval(() => {
    audioElement.volume = volume;
    volume -= 0.01;
  }, 10);

  if (localStorage.getItem("stop-effect") == "enabled") {
    var speed = 1;

    setInterval(() => {
      audioElement.playbackRate = speed;
      speed -= 0.01;
    }, 10);
  }

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

  else {
    document.getElementById("progress-bar").style.width = "0%";
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
  location.href = "mode.html";
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

setInterval(() => {
  if (document.activeElement != document.getElementById("title")) {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    
    else if (document.selection) {
      document.selection.empty();
    }
  }

  if (window.innerHeight > window.innerWidth) {
    document.getElementById('cover-art').style.width = "30vh";
    document.getElementById('cover-art').style.height = "30vh";
  }

  else {
    document.getElementById('cover-art').style.width = "25vw";
    document.getElementById('cover-art').style.height = "25vw";
  }
});

if (localStorage.getItem("kandinsky") == "enabled" || localStorage.getItem("kandinsky") == "circle") {
  document.getElementById("progress-bar").style.transition = "0.2s ease";
  document.getElementById("progress-bar").style.filter = "brightness(2)";
}

else {
  document.getElementById("progress-bar").style.transition = "0.25s ease";
}

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
    
  tooltip.style.opacity = "1";
  tooltip.style.top = `${progressContainer.offsetTop - 16}px`;
  tooltip.style.left = `${event.pageX - progressContainer.getBoundingClientRect().left}px`;
  tooltip.textContent = formattedTime;
}

function hideTooltip() {
  tooltip.style.opacity = "0";
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
  document.getElementById("debug-card").style.display = "none";
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
    if (audioElement.src) {
      stop();

      setTimeout(() => {
        location.href = "settings.html";
      }, 1000);
    }

    else {
      location.href = "settings.html";
    }
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
      try {
        const palette = {
          accent: swatches.Vibrant.getHex(),
          primaryDark: swatches.DarkVibrant.getHex(),
          primaryLight: swatches.LightVibrant.getHex(),
          primary: swatches.Muted.getHex(),
        };

        callback(null, palette);
      }

      catch {
        callback("Dynamic colour not found, falling back on median...", null);
      }
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

if (localStorage.getItem("debug-colour-makeup") == "disabled") {
  document.getElementById("makeup").style.display = "none";
}

if (localStorage.getItem("debug-compare") == "disabled") {
  document.getElementById("comparison").style.display = "none";
}

if (localStorage.getItem("debug-freq") == "disabled") {
  document.getElementById("freq").style.display = "none";
}