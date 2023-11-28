function setOption(option, value) {
    localStorage.setItem(option, value);

    if (option == "kandinsky" && value == "enabled") {
        document.getElementById("kandinsky-title").innerText = "Kandinsky Engine enabled";

        document.getElementById("kandinsky").onclick = () => {
            setOption("kandinsky", "disabled");
        }
    }

    else if (option == "kandinsky" && value == "disabled") {
        document.getElementById("kandinsky-title").innerText = "Kandinsky Engine disabled";

        document.getElementById("kandinsky").onclick = () => {
            setOption("kandinsky", "enabled");
        }
    }

    if (option == "colour") {
        applyColour();
    }
}

function importSettings() {
    if (localStorage.getItem("kandinsky") == "enabled") {
        document.getElementById("kandinsky-title").innerText = "Kandinsky Engine enabled";

        document.getElementById("kandinsky").onclick = () => {
            setOption("kandinsky", "disabled");
        }
    }

    else if (localStorage.getItem("kandinsky") == "disabled") {
        document.getElementById("kandinsky-title").innerText = "Kandinsky Engine disabled";

        document.getElementById("kandinsky").onclick = () => {
            setOption("kandinsky", "enabled");
        }
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

            .card-flat-bottom {
                background-color: ${colour};
            }

            .card-interactive:hover {
                background-color: ${colour.replace("0.25", "0.5")};
            }

            button:not(.nochange-colour) {
                background-color: ${colour};
            }

            button.not(.nochange-colour):hover {
                background-color: ${colour.replace("0.25", "0.5")};
            }

            #settings:hover {
                background-color: ${colour.replace("0.25", "0.5")};
            }
        `;
    }

    console.log("Colour:", colour);
}


importSettings();
applyColour();