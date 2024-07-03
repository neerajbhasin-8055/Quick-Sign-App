const colorPicker = document.getElementById("colorPicker");
const canvasColor = document.getElementById("canvasColor");
const canvas = document.getElementById("myCanvas");
const clearButton = document.getElementById("clear");
const saveButton = document.getElementById("save-download");
const fontPicker = document.getElementById("font-size");
const retrieveButton = document.getElementById('retrieve');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvasColor.addEventListener('change', (e) => {
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

fontPicker.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener('click', () => {
    ensureBackground();
    const dataUrl = canvas.toDataURL("image/png");
    localStorage.setItem('canvasContents', dataUrl);
    let link = document.createElement('a');
    link.download = 'my-canvas.png';
    link.href = dataUrl;
    link.click();
});

retrieveButton.addEventListener('click', () => {
    let savedCanvas = localStorage.getItem('canvasContents');
    if (savedCanvas) {
        let img = new Image();
        img.src = savedCanvas;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }
    }
});

function ensureBackground() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let isEmpty = true;
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] !== 0) {
            isEmpty = false;
            break;
        }
    }
    if (isEmpty) {
        ctx.fillStyle = canvasColor.value || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Conditionally add touch event listeners for small screens
if (window.matchMedia("(max-width: 768px)").matches) {
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
    }, false);

    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            ctx.stroke();
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
        }
    }, false);

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    }, false);
}