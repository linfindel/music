const mappings = {
  "flash": "enabled",
  "hybrid": "hybrid",
  "album": "disabled"
}

const mappingsReversed = {
  "enabled": "flash",
  "hybrid": "hybrid",
  "disabled": "album"
}

const preview = document.getElementById("preview");
const warning = document.getElementById("warning");
const buttons = {
  "flash": document.getElementById("flash"),
  "hybrid": document.getElementById("hybrid"),
  "album": document.getElementById("album")
};

function setMode(mode) {
  localStorage.setItem("kandinsky", mappings[mode]);

  preview.src = `screenshots/${mode}.mp4`;
  preview.alt = `A preview showing the ${mode} mode`;
  
  Object.values(buttons).forEach(button => button.style.backgroundColor = "rgba(0, 89, 255, 0.25)");

  buttons[mode].style.backgroundColor = "rgba(0, 89, 255, 0.5)";

  if (mode == "flash" || mode == "hybrid") {
    warning.style.display = "flex";
  }

  else {
    warning.style.display = "none";
  }
}

if (!localStorage.getItem("kandinsky")) {
  setMode("album");
}

else {
  setMode(mappingsReversed[localStorage.getItem("kandinsky")]);
}

function next() {
  if (localStorage.getItem("warn") != "true") {
    localStorage.setItem("warn", "true");
    localStorage.setItem("stop-effect", "disabled");
    location.href = "colour.html";
  }

  else {
    location.href = "settings.html";
  }
}

setInterval(() => {
  if (window.innerWidth < window.innerHeight) {
    document.getElementById("container").classList.remove("absolute-centre");
  }

  else {
    document.getElementById("container").classList.add("absolute-centre");
  }
});