const bird = {};
bird.image = new Image();
bird.image.src = 'bird.png';

const birdSpeed = 1 / 3;

const gravity = 0.25;
const jumpDuration = 125;
let timeSinceLastJump = 0;
const spriteUpdateTime = 150;
let timeSinceLastSpriteUpdate = 0;
let degree = 0;

export function getBirdRect(ctx) {
  return {
    left: bird.dX,
    top: bird.dY,
    right: bird.dX + bird.dWidth,
    bottom: bird.dY + bird.dHeight
  };
};

export function resetBird(ctx) {
  timeSinceLastJump = 0;
  timeSinceLastSpriteUpdate = 0;
  degree = 0;
  const height = ctx.canvas.width * 0.085;
  bird.frameIndex = 0;
  bird.speed = 0;
  bird.jump = 4.75;
  // source image
  bird.sX = 0;
  bird.sY = 0;
  bird.sWidth = bird.image.width / 3;
  bird.sHeight = bird.image.height;
  // destination canvas
  bird.dX = ctx.canvas.width * 0.2;
  bird.dY = ctx.canvas.height / 3;
  bird.dWidth = height * 1.46;
  bird.dHeight = height;
}

export function drawBird(ctx, delta, frames, gameInProgress) {
  if (!gameInProgress) {
    bird.dY = bird.dY + Math.cos(frames * Math.PI / 180) * 0.5;
  } else {
    if (timeSinceLastJump < jumpDuration) {
      bird.speed -= gravity;
      bird.dY -= bird.speed;
    } else {
      bird.speed += gravity;
      bird.dY += bird.speed;
    }
    timeSinceLastJump += delta;
  }

  bird.dY = bird.dY + Math.cos(frames * Math.PI / 180) * 0.5;

  bird.sX = (bird.image.width / 3) * bird.frameIndex;

  ctx.save();
  ctx.translate(
    bird.dX + bird.dWidth / 2,
    bird.dY + bird.dHeight / 2,
  );

  ctx.rotate(degree * Math.PI / 180);
  ctx.drawImage(
    bird.image,
    bird.sX, bird.sY, bird.sWidth, bird.sHeight,
    -bird.dWidth / 2, -bird.dHeight / 2, bird.dWidth, bird.dHeight
  );

  ctx.restore();

  if (gameInProgress) {
    degree = (degree + 1) > 90 ? 90 : degree + 1;
  }
  if (timeSinceLastSpriteUpdate > spriteUpdateTime) {
    if (degree > 0) {
      bird.frameIndex = 1;
    } else {
      bird.frameIndex = (bird.frameIndex + 1) % 3;
      timeSinceLastSpriteUpdate = 0;
    }
  }
  timeSinceLastSpriteUpdate += delta;
};

const handleJump = () => {
  bird.speed = -bird.jump;
  degree = -25;
};


document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    handleJump();
  }
});

document.addEventListener('touchstart', handleJump);
