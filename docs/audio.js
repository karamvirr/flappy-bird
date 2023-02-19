const parsePromise = (promise, name) => {
  if (promise !== undefined) {
    promise.then(_ => {
      // Autoplay started!
    }).catch(error => {
      // Autoplay was prevented.
      console.log(`failed to play ${name} audio.`);
    });
  }
};

export function playFlapAudio() {
  const promise = new Audio('audio/flap.mp3').play();
  parsePromise(promise, 'flap');
};


export function playGameOverAudio() {
  const promise = new Audio('audio/game_over.mp3').play();
  parsePromise(promise, 'game over');
};


export function playPointIncrementAudio() {
  const promise = new Audio('audio/point.mp3').play();
  parsePromise(promise, 'point increment');
};
