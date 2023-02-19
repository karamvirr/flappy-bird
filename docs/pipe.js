import { playPointIncrementAudio } from './audio.js';

let pipes = [];
const pipeInterval = 1850;
let holeHeight = null;
let timeSinceLastPipe = 0;
let passedPipeCount = 0;

const fillerPipe = new Image();
fillerPipe.src = 'img/pipe-filler.png';

export function resetPipes() {
  pipes = [];
  timeSinceLastPipe = 0;
  passedPipeCount = 0;
};

export function getLeadingPipeRect(ctx) {
  const filtered = pipes.filter((pipe) => !pipe.passed);
  if (filtered[0]) {
    const pipe = filtered[0]
    return {
      top: {
        left: pipe.dX,
        top: 0,
        right: pipe.dX + ctx.canvas.width * 0.15,
        bottom: pipe.holeTop
      },
      bottom: {
        left: pipe.dX,
        top: pipe.holeTop + holeHeight,
        right: pipe.dX + ctx.canvas.width * 0.15,
        bottom: ctx.canvas.height
      }
    };
  }
  return null;
};

export function drawPipes(ctx, delta, gameInProgress, speed) {
  if (gameInProgress) {
    if (timeSinceLastPipe > pipeInterval) {
      pipes.push(createPipe(ctx));
      timeSinceLastPipe = 0;
    }
    timeSinceLastPipe += delta;

    pipes.forEach((pipe) => {
      if (pipe.dX + ctx.canvas.width * 0.15  < ctx.canvas.width * 0.2 && !pipe.passed) {
        playPointIncrementAudio();
        pipe.passed = true;
        passedPipeCount++;
      }
      ctx.drawImage(
        fillerPipe,
        pipe.dX,
        0,
        ctx.canvas.width * 0.15,
        pipe.holeTop
      );
      ctx.drawImage(
        fillerPipe,
        pipe.dX,
        pipe.holeTop + holeHeight,
        ctx.canvas.width * 0.15,
        ctx.canvas.height
      );
      ctx.drawImage(
        pipe.images.top,
        pipe.dX,
        pipe.holeTop - pipe.images.top.height,
        ctx.canvas.width * 0.15,
        pipe.images.top.height
      );
      ctx.drawImage(
        pipe.images.bottom,
        pipe.dX,
        pipe.holeTop + holeHeight,
        ctx.canvas.width * 0.15,
        pipe.images.bottom.height
      );
      pipe.dX -= speed;
    });
    pipes = pipes.filter((pipe) => {
      return pipe.dX + ctx.canvas.width * 0.15 > 0;
    });
  }
  return passedPipeCount;
}

const createPipe = (ctx) => {
  if (!holeHeight) {
    holeHeight = ctx.canvas.width * 0.275;
  }
  const pipe = {};
  pipe.passed = false;
  pipe.images = {};
  pipe.images.top = new Image();
  pipe.images.top.src = 'img/pipe-top.png';
  pipe.images.bottom = new Image();
  pipe.images.bottom.src = 'img/pipe-bottom.png';
  pipe.dX = ctx.canvas.width;
  pipe.holeTop = getRandomValue(
    ctx.canvas.height * 0.15, ctx.canvas.height * 0.8 - holeHeight * 1.5
  );
  return pipe;
};

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
