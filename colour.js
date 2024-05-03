var styleElement = document.getElementsByTagName("style")[0];

styleElement.innerHTML = `
  @media (prefers-color-scheme: light) {
    body {
      background-color: white;
    }

    * {
      color: black;
    }
  }
`;

document.getElementById("red").addEventListener("mouseover", () => {
  document.getElementById("red").style.backgroundColor = "rgba(255, 0, 0, 0.5)";
});

document.getElementById("red").addEventListener("mouseleave", () => {
  document.getElementById("red").style.backgroundColor = "rgba(255, 0, 0, 0.25)";
});

document.getElementById("green").addEventListener("mouseover", () => {
  document.getElementById("green").style.backgroundColor = "rgba(0, 255, 0, 0.5)";
});

document.getElementById("green").addEventListener("mouseleave", () => {
  document.getElementById("green").style.backgroundColor = "rgba(0, 255, 0, 0.25)";
});

document.getElementById("purple").addEventListener("mouseover", () => {
  document.getElementById("purple").style.backgroundColor = "rgba(255, 0, 255, 0.5)";
});

document.getElementById("purple").addEventListener("mouseleave", () => {
  document.getElementById("purple").style.backgroundColor = "rgba(255, 0, 255, 0.25)";
});

function setColour(colour) {
  localStorage.setItem("colour", colour);

  location.href = ".";
}

setInterval(() => {
  if (window.innerWidth < window.innerHeight) {
    document.getElementById("red").style.borderBottomLeftRadius = "7.5px";
    document.getElementById("purple").style.borderBottomRightRadius = "24px";
    document.getElementById("blue").style.borderBottomLeftRadius = "24px";
  }
  
  else {
    document.getElementById("red").style.borderBottomLeftRadius = "24px";
    document.getElementById("purple").style.borderBottomRightRadius = "24px";
    document.getElementById("blue").style.borderBottomLeftRadius = "7.4px";
  }
});