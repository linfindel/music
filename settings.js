function setOption(option, value) {
  localStorage.setItem(option, value);

  if (option == "kandinsky") {
    document.getElementById("kandinsky-title").innerText = `Kandinsky Engine ${value}`;
  }

  if (option == "kandinsky" && value == "enabled") {
    document.getElementById("kandinsky").onclick = () => {
      setOption("kandinsky", "disabled");
    }
  }

  else if (option == "kandinsky" && value == "disabled") {
    document.getElementById("kandinsky").onclick = () => {
      setOption("kandinsky", "enabled");
    }
  }

  if (option == "stop-effect") {
    document.getElementById("stop-title").innerText = `Lowpass stop effect ${value}`;
  }

  if (option == "stop-effect" && value == "enabled") {
    document.getElementById("stop").onclick = () => {
      setOption("stop-effect", "disabled");
    }
  }

  else if (option == "stop-effect" && value == "disabled") {
    document.getElementById("stop").onclick = () => {
      setOption("stop-effect", "enabled");
    }
  }

  if (option == "numbering" && value == "enabled") {
    document.getElementById("numbering-title").innerText = "Removing title numbering";

    document.getElementById("numbering").onclick = () => {
      setOption("numbering", "disabled");
    }

    document.getElementById("custom-regex").style.display = "flex";
  }

  else if (option == "numbering" && value == "disabled") {
    document.getElementById("numbering-title").innerText = "Retaining title numbering";

    document.getElementById("numbering").onclick = () => {
      setOption("numbering", "enabled");
    }

    document.getElementById("custom-regex").style.display = "none";
  }

  if (option == "colour") {
    applyColour();
  }
}

function importSettings() {
  document.getElementById("kandinsky-title").innerText = `Kandinsky Engine ${localStorage.getItem("kandinsky") || "enabled"}`;

  if (localStorage.getItem("kandinsky") == "enabled") {
    document.getElementById("kandinsky").onclick = () => {
      setOption("kandinsky", "disabled");
    }
  }

  else if (localStorage.getItem("kandinsky") == "disabled") {
    document.getElementById("kandinsky").onclick = () => {
      setOption("kandinsky", "enabled");
    }
  }

  document.getElementById("stop-title").innerText = `Lowpass stop effect ${localStorage.getItem("stop-effect")}`;

  if (localStorage.getItem("stop-effect") == "enabled") {
    document.getElementById("stop").onclick = () => {
      setOption("stop-effect", "disabled");
    }
  }

  else if (localStorage.getItem("stop-effect") == "disabled") {
    document.getElementById("stop").onclick = () => {
      setOption("stop-effect", "enabled");
    }
  }

  if (localStorage.getItem("numbering") == "enabled") {
    document.getElementById("numbering-title").innerText = "Removing title numbering";

    document.getElementById("numbering").onclick = () => {
      setOption("numbering", "disabled");
    }

    document.getElementById("custom-regex").style.display = "flex";
  }

  else if (localStorage.getItem("numbering") == "disabled" || !localStorage.getItem("numbering")) {
    document.getElementById("numbering-title").innerText = "Retaining title numbering";

    document.getElementById("numbering").onclick = () => {
      setOption("numbering", "enabled");
    }

    document.getElementById("custom-regex").style.display = "none";
  }
}

function applyColour() {
  var colour = localStorage.getItem("colour");

  if (colour) {
    var styleElement = document.getElementsByTagName("style")[0];

    styleElement.innerHTML += `
      nav {
        background-color: ${colour};
      }

      .card, .card-flat-bottom, .card-flat, .card-flat-top, .card-flat-bottom-left-alt, .card-flat-bottom-right-alt {
        background-color: ${colour};
      }

      .card-interactive:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      .about:hover, .reset:hover, .debug:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      button:not(.nochange-colour) {
        background-color: ${colour};
      }

      button.not(.nochange-colour):hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }

      #settings:hover, #custom-regex:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }
    `;

    document.getElementById("about1").addEventListener("mouseover", () => {
      document.getElementById("about1").style.backgroundColor = colour.replace("0.25", "0.5");
    });

    document.getElementById("about1").addEventListener("mouseleave", () => {
      document.getElementById("about1").style.backgroundColor = "";
    });

    document.getElementById("about2").addEventListener("mouseover", () => {
      document.getElementById("about2").style.backgroundColor = colour.replace("0.25", "0.5");
    });

    document.getElementById("about2").addEventListener("mouseleave", () => {
      document.getElementById("about2").style.backgroundColor = "";
    });

    document.getElementById("reset").addEventListener("mouseover", () => {
      document.getElementById("reset").style.backgroundColor = colour.replace("0.25", "0.5");
    });

    document.getElementById("reset").addEventListener("mouseleave", () => {
      document.getElementById("reset").style.backgroundColor = "";
    });

    try {
      document.getElementById("debug").addEventListener("mouseover", () => {
        document.getElementById("debug").style.backgroundColor = colour.replace("0.25", "0.5");
      });
  
      document.getElementById("debug").addEventListener("mouseleave", () => {
        document.getElementById("debug").style.backgroundColor = "";
      });
    }

    catch {
      
    }
  }
}

document.getElementById("purple").addEventListener("mouseover", () => {
  document.getElementById("purple").style.backgroundColor = "rgba(255, 0, 255, 0.5)";
});

document.getElementById("purple").addEventListener("mouseleave", () => {
  document.getElementById("purple").style.backgroundColor = "rgba(255, 0, 255, 0.25)";
});

if (screen.width < screen.height) {
  document.getElementById("debug").remove();
  localStorage.setItem("debug", "disabled");

  document.getElementById("keyboard-shortcuts").remove();
}

setInterval(() => {
  if (window.innerWidth < window.innerHeight) {
    document.getElementById("red").style.borderBottomLeftRadius = "7.5px";
    document.getElementById("purple").style.borderBottomLeftRadius = "24px";
  }

  else {
    document.getElementById("red").style.borderBottomLeftRadius = "24px";
    document.getElementById("purple").style.borderBottomLeftRadius = "7.5px";
  }
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  e.key = e.key.toLowerCase();

  if (e.key == "h") {
    location.href = ".";
  }
});

importSettings();
applyColour();

const username = 'linfindel';
const repo = 'music';

fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=1`)
  .then(response => {
    const totalCount = response.headers.get('Link').match(/page=(\d+)>; rel="last"/)[1] / 100;
    return response.json().then(data => {
      const latestCommitMessage = data[0].commit.message;

      document.getElementById("version").innerText = `Version ${totalCount.toFixed(2)} Release Notes`;
      document.getElementById("whats-new").innerText = latestCommitMessage;

      document.getElementById("about-card").style.opacity = "1";
      document.getElementById("about-card").style.pointerEvents = "all";
    });
})
.catch(error => console.error('Error fetching data:', error));