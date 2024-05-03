var colour = localStorage.getItem("colour");

if (colour) {
  var styleElement = document.getElementsByTagName("style")[0];

  styleElement.innerHTML += `
    @media (prefers-color-scheme: dark) {
      nav {
        background-color: ${colour};
      }
  
      button, .card {
        background-color: ${colour};
      }
  
      button:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }
  
      #back:hover {
        background-color: ${colour.replace("0.25", "0.5")};
      }
    }

    @media (prefers-color-scheme: light) {
      body {
        background-color: white;
      }

      * {
        color: black;
      }

      nav {
        background-color: ${colour.replace(0.25, 0.5)};
      }
  
      button, .card {
        background-color: ${colour.replace(0.25, 0.5)};
      }
  
      button:hover {
        background-color: ${colour.replace(0.25, 0.5)};
        filter: brightness(0.5);
      }
  
      #back:hover {
        background-color: ${colour.replace(0.25, 0.5)};
        filter: brightness(0.5);
      }
    }
  `;

  document.getElementById("back").addEventListener("mouseover", () => {
    document.getElementById("back").style.backgroundColor = colour.replace("0.25", "0.5");
  });

  document.getElementById("back").addEventListener("mouseleave", () => {
    document.getElementById("back").style.backgroundColor = "";
  });

  document.getElementById("custom-regex").style.backgroundColor = colour;

  document.getElementById("custom-regex").addEventListener("mouseover", () => {
    document.getElementById("custom-regex").style.backgroundColor = colour.replace("0.25", "0.5");
  });

  document.getElementById("custom-regex").addEventListener("mouseleave", () => {
    document.getElementById("custom-regex").style.backgroundColor = colour;
  });

  document.getElementById("filename").style.backgroundColor = colour;

  document.getElementById("filename").addEventListener("mouseover", () => {
    document.getElementById("filename").style.backgroundColor = colour.replace("0.25", "0.5");
  });

  document.getElementById("filename").addEventListener("mouseleave", () => {
    document.getElementById("filename").style.backgroundColor = colour;
  });
}

document.getElementById("filename").value = localStorage.getItem("filename");
document.getElementById("custom-regex").value = localStorage.getItem("custom-regex");

setInterval(() => {
  let customRegex = localStorage.getItem("custom-regex");

  while (customRegex.includes("/")) {
    customRegex = customRegex.replace("/", "");
  }

  customRegex = RegExp(customRegex);

  document.getElementById("result").innerText = localStorage.getItem("filename").replace(customRegex, '');
});