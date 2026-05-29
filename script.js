let isEraserModeActive = false;
let currentTool;
let currentColour;


// Fire init method once DOM content loaded
document.addEventListener('DOMContentLoaded', init)


/**
 * Initialise the grid and listeners used for detecting user's mouse input.
 */
function init() {
    initialiseCanvas();
    initialiseTools();
}

/**
 * The canvas size defaults to 300px x 150px which determines the number of pixels in the drawing surface.
 *
 * CSS is used to dynamically size the appearance of the canvas on the page.
 *
 * This creates a mismatch that needs to be realigned.
 *
 * @param canvas element to be resized.
 */
function resizeCanvas(canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function initialiseCanvas() {
    const canvas = document.getElementById('canvas');
    resizeCanvas(canvas);

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];

        if (currentTool.supportsColor) {
            currentTool.colour = getCurrentColour();
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) {
            return;
        }

        const {offsetX, offsetY} = e;
        // Draw line FROM last position TO current position
        currentTool.draw(ctx, lastX, lastY, offsetX, offsetY);
        [lastX, lastY] = [offsetX, offsetY];
    });

    canvas.addEventListener('mouseup', e => {
        isDrawing = false;

        // draw a dot if user has clicked without moving mouse
        if (lastX === e.offsetX && lastY === e.offsetY) {
            currentTool.draw(ctx, lastX, lastY, lastX, lastY);
        }
    });


    window.addEventListener('resize', () => {
        const imageUrl = canvas.toDataURL();

        resizeCanvas(canvas);

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        img.src = imageUrl;
    });
}


function initialiseTools() {
    currentTool = tools['pen'];

    document.getElementById('pen-button').addEventListener('click', () => {
        setCurrentTool('pen');
    });

    document.getElementById('eraser-button').addEventListener('click', () => {
        setCurrentTool('eraser');
    });


    document.getElementById('trash-button').addEventListener('click', () => {
        if (confirm("Would you like to clear the canvas?")) {
            canvas.width = canvas.width; // shortcut to clear canvas
        }
    })
}


function getCurrentColour() {
    return document.getElementById('color-picker').value;
}

const tools = {
    pen: {
        name: 'pen',
        cursor: `url('pen-icon.png') 0 24, auto`,
        colour: "#000",
        supportsColor: true,

        draw(ctx, x, y, prevX, prevY) {
            ctx.strokeStyle = this.colour;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    },
    eraser: {
        name: 'eraser',
        cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><rect width="15" height="15" fill="white" stroke="black" stroke-width="1"/></svg>') 0 0, auto`,
        supportsColor: false,

        draw(ctx, x, y, prevX, prevY) {
            ctx.clearRect(x, y, 15, 15);
        }
    }
};


function setCurrentTool(toolName) {
    currentTool = tools[toolName];
    document.getElementById('canvas').style.cursor = currentTool.cursor;
}