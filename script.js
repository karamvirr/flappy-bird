const canvas = document.querySelector('canvas');
const { width, height } = canvas.getBoundingClientRect();
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

const frames = 0;
const foregroundSpeed = 2;

let lastDrawTime = null;

const background = {};
background.image = new Image();
background.image.src = 'background.png';
background.xOffset = 0;

const foreground = {};
foreground.image = new Image();
foreground.image.src = 'foreground.png';
foreground.xOffset = 0;

// timeSinceOrigin - milliseconds
const draw = (timeSinceOrigin) => {
  if (!lastDrawTime) {
    lastDrawTime = timeSinceOrigin;
    window.requestAnimationFrame(draw);
    return;
  }
  const delta = timeSinceOrigin - lastDrawTime;
  drawBackground();
  drawForeground();

  lastDrawTime = timeSinceOrigin;
  window.requestAnimationFrame(draw);
};

const drawBackground = () => {
  for (let i = 0; i < Math.ceil(canvas.width / background.image.width) + 1; i++) {
    ctx.drawImage(
      background.image,
      background.xOffset + i * background.image.width,
      0,
      background.image.width,
      canvas.height
    );
  }
  background.xOffset -= foregroundSpeed / 10;
  if (background.xOffset <= -background.image.width) {
    background.xOffset = 0;
  }
};

const drawForeground = () => {
  for (let i = 0; i < Math.ceil(canvas.width / foreground.image.width) + 1; i++) {
    ctx.drawImage(
      foreground.image,
      foreground.xOffset + i * foreground.image.width,
      canvas.height * 0.8,
      foreground.image.width,
      canvas.height * 0.2
    );
  }
  foreground.xOffset -= foregroundSpeed;
  if (foreground.xOffset <= -foreground.image.width) {
    foreground.xOffset = 0;
  }
};

window.requestAnimationFrame(draw);
