setInterval(() => {
  if (localStorage.getItem("debug") == "enabled") {
    document.getElementById("debug-icon").innerText = "check_box";
    document.getElementById("debug-text").innerText = "Debug enabled";

    document.getElementById("debug-options").style.display = "flex";
  }
  
  else {
    document.getElementById("debug-icon").innerText = "check_box_outline_blank";
    document.getElementById("debug-text").innerText = "Debug disabled";

    document.getElementById("debug-options").style.display = "none";
  }

  if (localStorage.getItem("debug-color-makeup") == "enabled" || !localStorage.getItem("debug-color-makeup")) {
    document.getElementById("makeup-icon").innerText = "check_box";
    document.getElementById("makeup-text").innerText = "Color makeup enabled";
  }
  
  else {
    document.getElementById("makeup-icon").innerText = "check_box_outline_blank";
    document.getElementById("makeup-text").innerText = "Color makeup disabled";
  }

  if (localStorage.getItem("debug-compare") == "enabled" || !localStorage.getItem("debug-compare")) {
    document.getElementById("compare-icon").innerText = "check_box";
    document.getElementById("compare-text").innerText = "Color comparison enabled";
  }
  
  else {
    document.getElementById("compare-icon").innerText = "check_box_outline_blank";
    document.getElementById("compare-text").innerText = "Color comparison disabled";
  }
});

var color = localStorage.getItem("color");

if (color) {
  var styleElement = document.getElementsByTagName("style")[0];

  styleElement.innerHTML += `
    nav {
      background-color: ${color};
    }

    button {
      background-color: ${color};
    }

    button:hover {
      background-color: ${color.replace("0.25", "0.5")};
    }

    #back:hover, #debug:hover, #makeup:hover, #compare:hover {
      background-color: ${color.replace("0.25", "0.5")};
    }
  `;

  document.getElementById("back").addEventListener("mouseover", () => {
    document.getElementById("back").style.backgroundColor = color.replace("0.25", "0.5");
  });

  document.getElementById("back").addEventListener("mouseleave", () => {
    document.getElementById("back").style.backgroundColor = "";
  });
}

function toggle(option) {
  if (localStorage.getItem(option) == "disabled") {
    localStorage.setItem(option, "enabled");
  }

  else if (localStorage.getItem(option) == "enabled" || !localStorage.getItem(option)) {
    localStorage.setItem(option, "disabled");
  }

  else {
    localStorage.setItem(option, "enabled");
  }
}