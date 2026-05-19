let DEFAULT_GRID_SIZE = 16
let currentGridSize = DEFAULT_GRID_SIZE;
let isMouseDown = false;
let isEraserModeActive = false;

create(DEFAULT_GRID_SIZE); // create default 16x16 grid on initial load

/**
 * Clears all the child div elements in the grid-container to create a blank slate.
 *
 * Then prompts the user to input a grid size.
 */
function setGridSize() {
    document.getElementById("grid-container").replaceChildren();
    currentGridSize = parseInt(prompt("Please enter desired square grid size:"));
    create(currentGridSize);
}

/**
 * Redraw the previous grid resetting the users drawing.
 */
function redrawPreviousGrid() {
    document.getElementById("grid-container").replaceChildren();
    create(currentGridSize);
}

function fillDiv(div) {
    if (isEraserModeActive) {
        div.style.backgroundColor = "";
    } else {
        div.style.backgroundColor = "cyan";
    }
}


/**
 * Create a square div grid of size n x n (where squareGridSize = n)
 * @param squareGridSize
 */
function create(squareGridSize) {
    const container = document.getElementById("grid-container");
    const itemWidth = (100 / squareGridSize) + "%";

    // Set CSS variable on container
    container.style.setProperty("--item-width", itemWidth);

    for (let i = 1; i <= squareGridSize; i++) {
        for (let j = 1; j <= squareGridSize; j++) {
            const div = document.createElement("div");
            container.appendChild(div);

            div.addEventListener("mousedown", (event) => {
                if (event.button === 0) {
                    isMouseDown = true;
                    fillDiv(div);
                }
            });

            div.addEventListener("mouseover", () => {
                if (isMouseDown) {
                    fillDiv(div);
                }
            });
        }
    }
}


function toggleDrawMode() {
    isEraserModeActive = !isEraserModeActive;

    if (isEraserModeActive) {
        document.getElementById("grid-container").style.cursor = "url('bomb-icon.png'), auto";
    } else {
        document.getElementById("grid-container").style.cursor = "auto";
    }

    document.getElementById("eraser-button").textContent = isEraserModeActive ? "Eraser Mode" : "Draw Mode";
}


document.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        isMouseDown = false;
    }
});