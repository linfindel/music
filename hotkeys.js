var colour = localStorage.getItem("colour");

if (colour) {
  var styleElement = document.getElementsByTagName("style")[0];

  styleElement.innerHTML += `
    nav, button, .card-flat-bottom, .card-flat, .card-flat-bottom-left-alt, .card-flat-bottom-right-alt {
      background-color: ${colour};
    }

    #settings:hover {
      background-color: ${colour.replace("0.25", "0.5")};
    }
  `;
}