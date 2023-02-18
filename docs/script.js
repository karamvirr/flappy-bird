import { drawBird, resetBird, getBirdRect } from './bird.js';
import { drawPipes, resetPipes, getLeadingPipeRect } from './pipe.js';
import { playGameOverAudio } from './audio.js';

const canvas = document.querySelector('canvas');
const { width, height } = canvas.getBoundingClientRect();
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

const foregroundSpeed = 2;

let score = 0;
let bestScore = 0;

let frames = 0;
let lastDrawTime = null;
let gameInProgress = false;

const background = {};
background.image = new Image();
background.image.src = 'img/background.png';
background.offsetX = 0;

const foreground = {};
foreground.image = new Image();
foreground.image.src = 'img/foreground.png';
foreground.offsetX = 0;

// timeSinceOrigin - milliseconds
const draw = (timeSinceOrigin) => {
  frames++;
  if (!lastDrawTime) {
    lastDrawTime = timeSinceOrigin;
    window.requestAnimationFrame(draw);
    return;
  }
  const delta = timeSinceOrigin - lastDrawTime;
  drawBackground();
  drawBird(ctx, delta, frames, gameInProgress);
  score = drawPipes(ctx, delta, gameInProgress, foregroundSpeed);
  bestScore = Math.max(bestScore, score);
  drawForeground();
  writeScoreText();

  if (gameOver()) {
    handleLose();
  } else {
    lastDrawTime = timeSinceOrigin;
    window.requestAnimationFrame(draw);
  }
};

const writeScoreText = () => {
  if (score && bestScore) {
    ctx.font = '18pt Arial';
    ctx.fillStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeText(`Score: ${score}`, canvas.width * 0.05, canvas.height * 0.9);
    ctx.strokeText(`Best: ${bestScore}`, canvas.width * 0.05, canvas.height * 0.95);
  }
};

const gameOver = () => {
  const bird = getBirdRect(ctx);
  const pipe = getLeadingPipeRect(ctx);
  if (bird && pipe) {

    if (bird.right >= pipe.top.left && bird.left <= pipe.top.right) {
      if (bird.top <= pipe.top.bottom) {
        return true;
      }
      if (bird.bottom >= pipe.bottom.top) {
        return true;
      }
    }
  }
  return bird.bottom >= canvas.height * 0.8;
};

const handleLose = () => {
  playGameOverAudio();
  setTimeout(() => {
    stop();
    resetBird(ctx);
    resetPipes(ctx);
    window.requestAnimationFrame(draw);
  }, 750);
};

const drawBackground = () => {
  for (let i = 0; i < Math.ceil(canvas.width / background.image.width) + 1; i++) {
    ctx.drawImage(
      background.image,
      background.offsetX + i * background.image.width,
      0,
      background.image.width,
      canvas.height
    );
  }
  background.offsetX -= foregroundSpeed / 10;
  if (background.offsetX <= -background.image.width) {
    background.offsetX = 0;
  }
};

const drawForeground = () => {
  for (let i = 0; i < Math.ceil(canvas.width / foreground.image.width) + 1; i++) {
    ctx.drawImage(
      foreground.image,
      foreground.offsetX + i * foreground.image.width,
      canvas.height * 0.8,
      foreground.image.width,
      canvas.height * 0.2
    );
  }
  foreground.offsetX -= foregroundSpeed;
  if (foreground.offsetX <= -foreground.image.width) {
    foreground.offsetX = 0;
  }
};

const start = () => {
  gameInProgress = true;
};

const stop = () => {
  gameInProgress = false;
  document.addEventListener('keypress', start, { once: true });
  document.addEventListener('touchstart', start, { once: true });
};

resetBird(ctx);
window.requestAnimationFrame(draw);

document.addEventListener('keypress', start, { once: true });
document.addEventListener('touchstart', start, { once: true });
