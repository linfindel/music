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

            .about:hover {
                background-color: ${colour.replace("0.25", "0.5")};
            }

            .reset:hover {
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

        document.getElementById("about1").addEventListener("mouseover", () => {
            document.getElementById("about1").style.backgroundColor = colour.replace("0.25", "0.5");
        });

        document.getElementById("about1").addEventListener("mouseleave", () => {
            document.getElementById("about1").style.backgroundColor = colour;
        });

        document.getElementById("about2").addEventListener("mouseover", () => {
            document.getElementById("about2").style.backgroundColor = colour.replace("0.25", "0.5");
        });

        document.getElementById("about2").addEventListener("mouseleave", () => {
            document.getElementById("about2").style.backgroundColor = colour;
        });

        document.getElementById("reset").addEventListener("mouseover", () => {
            document.getElementById("reset").style.backgroundColor = colour.replace("0.25", "0.5");
        });

        document.getElementById("reset").addEventListener("mouseleave", () => {
            document.getElementById("reset").style.backgroundColor = colour;
        });
    }

    console.log("Colour:", colour);
}

document.getElementById("purple").addEventListener("mouseover", () => {
    document.getElementById("purple").style.backgroundColor = "rgba(255, 0, 255, 0.5)";
});

document.getElementById("purple").addEventListener("mouseleave", () => {
    document.getElementById("purple").style.backgroundColor = "rgba(255, 0, 255, 0.25)";
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
        console.log(`Total commit count: ${totalCount}`);
        console.log(`Latest commit message: ${latestCommitMessage}`);
        
        document.getElementById("version").innerText = `Version ${totalCount} Release Notes`;
        document.getElementById("whats-new").innerText = latestCommitMessage;

        document.getElementById("about-card").style.opacity = "1";
        document.getElementById("about-card").style.pointerEvents = "all";
    });
})
.catch(error => console.error('Error fetching data:', error));