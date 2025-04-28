const grid = document.getElementById('circleGrid');
const downloadBtn = document.getElementById('downloadBtn');
const colorButtons = document.querySelectorAll('.colorBtn');
const randomColorBtn = document.getElementById('randomColorBtn');
const hiddenColorInput = document.getElementById('hiddenColorInput');

let isMouseDown = false;
let currentColor = '#191919';

const totalCircles = 100 * 50;

// Create the grid
for (let i = 0; i < totalCircles; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.dataset.active = "false"; // default inactive
    circle.dataset.color = ""; // stores which color

    circle.addEventListener('click', () => {
        toggleCircle(circle);
    });

    circle.addEventListener('mouseover', () => {
        if (isMouseDown) {
            toggleCircle(circle);
        }
    });

    grid.appendChild(circle);
}

// Set mouse tracking
document.addEventListener('mousedown', (e) => {
    if (!downloadBtn.contains(e.target)) {
        isMouseDown = true;
    }
});
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Regular color buttons
colorButtons.forEach(button => {
    if (button.id !== "colorPickerBtn") {
        button.addEventListener('click', () => {
            currentColor = button.getAttribute('data-color');
        });
    }
});

// When user picks a color manually
hiddenColorInput.addEventListener('input', (event) => {
    const selectedColor = event.target.value;
    currentColor = selectedColor;
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    colorPickerBtn.style.backgroundColor = selectedColor;
});

// Toggle function
function toggleCircle(circle) {
    const active = circle.dataset.active === "true";
    const circleColor = circle.dataset.color;

    if (!active) {
        circle.style.backgroundColor = currentColor;
        circle.dataset.active = "true";
        circle.dataset.color = currentColor;
    } else {
        if (circleColor === currentColor) {
            circle.style.backgroundColor = '#f3f3f3';
            circle.dataset.active = "false";
            circle.dataset.color = "";
        } else {
            circle.style.backgroundColor = currentColor;
            circle.dataset.color = currentColor;
        }
    }
}

// Download as SVG instead of PNG
downloadBtn.addEventListener('click', () => {
    const circles = document.querySelectorAll('.circle');
    const columns = 100;
    const circleSize = 16;
    const gap = 0;

    let activeCircles = [];

    circles.forEach((circle, index) => {
        if (circle.dataset.active === "true") {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = col * (circleSize + gap);
            const y = row * (circleSize + gap);
            activeCircles.push({ x, y, color: circle.style.backgroundColor });
        }
    });

    if (activeCircles.length === 0) return;

    const minX = Math.min(...activeCircles.map(c => c.x));
    const minY = Math.min(...activeCircles.map(c => c.y));
    const maxX = Math.max(...activeCircles.map(c => c.x));
    const maxY = Math.max(...activeCircles.map(c => c.y));
    const padding = 5;

    const croppedWidth = maxX - minX + circleSize + padding * 2;
    const croppedHeight = maxY - minY + circleSize + padding * 2;

    // Create SVG content
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${croppedWidth}" height="${croppedHeight}" viewBox="0 0 ${croppedWidth} ${croppedHeight}">`;

    activeCircles.forEach(({ x, y, color }) => {
        const adjustedX = x - minX + padding + circleSize / 2;
        const adjustedY = y - minY + padding + circleSize / 2;
        const radius = circleSize / 2;

        svgContent += `<circle cx="${adjustedX}" cy="${adjustedY}" r="${radius}" fill="${color}" />`;
    });

    svgContent += `</svg>`;

    // Trigger SVG download
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'play.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
});
