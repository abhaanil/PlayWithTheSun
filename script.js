// Get the grid container and the download button
const grid = document.getElementById('circleGrid');
const downloadBtn = document.getElementById('downloadBtn');
let isMouseDown = false;


const totalCircles = 100 * 50;

// Function to toggle circle color
function toggleCircleColor(circle) {
    circle.classList.toggle('active');
}

// Loop to create the circles
for (let i = 0; i < totalCircles; i++) {
    // Create a new div element for each circle
    const circle = document.createElement('div');
    circle.classList.add('circle');

    // Add click event listener to toggle color
    circle.addEventListener('click', function () {
        toggleCircleColor(circle);
    });

    // Add event listener for mouse over
    circle.addEventListener('mouseover', function () {
        if (isMouseDown) {
            toggleCircleColor(circle);
        }
    });

    // Append the circle to the grid container
    grid.appendChild(circle);
}

// Event listeners to track mouse down and up states
document.addEventListener('mousedown', function (event) {
    // Prevent interaction if the download button is clicked
    if (!downloadBtn.contains(event.target)) {
        isMouseDown = true;
    }
});

document.addEventListener('mouseup', function () {
    isMouseDown = false;
});

downloadBtn.addEventListener('click', function () {
    const circles = document.querySelectorAll('.circle');
    const columns = 100;
    const circleSize = 16;
    const gap = 0;

    let activeCircles = [];

    // Collect positions of active circles
    circles.forEach((circle, index) => {
        if (circle.classList.contains('active')) {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = col * (circleSize + gap);
            const y = row * (circleSize + gap);
            activeCircles.push({ x, y });
        }
    });

    // Exit if no active circles
    if (activeCircles.length === 0) return;

    // Calculate bounding box
    const minX = Math.min(...activeCircles.map(c => c.x));
    const minY = Math.min(...activeCircles.map(c => c.y));
    const maxX = Math.max(...activeCircles.map(c => c.x));
    const maxY = Math.max(...activeCircles.map(c => c.y));
    const padding = 5; // optional padding around the artwork

    const croppedWidth = maxX - minX + circleSize + padding * 2;
    const croppedHeight = maxY - minY + circleSize + padding * 2;

    // Create cropped canvas
    const canvas = document.createElement('canvas');
    canvas.width = croppedWidth;
    canvas.height = croppedHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw only active circles
    activeCircles.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(
            x - minX + padding + circleSize / 2,
            y - minY + padding + circleSize / 2,
            circleSize / 2,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = '#191919';
        ctx.fill();
    });

    // Download cropped PNG
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'play.png';
    link.click();
});

