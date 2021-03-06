const oneOrTheOther = () => !!Math.round(Math.random());

const createEmoji = () => {
  const { innerHeight, innerWidth } = window;
  let left = 0;
  let top = 0;
  let direction;

  if (oneOrTheOther()) {
    // Fixed vertical position, random horizontal position.
    top = oneOrTheOther() ? -32 : innerHeight;
    left = Math.round(Math.random() * innerWidth);
    direction = top < 0 ? 270 : 90;
  } else {
    // Fixed horizontal position, random vertical position.
    left = oneOrTheOther() ? -32 : innerWidth;
    top = Math.round(Math.random() * innerHeight);
    direction = left < 0 ? 0 : 180;
  }

  return {
    direction,
    left,
    moves: 0,
    speed: 2 + Math.floor(Math.random() * 9),
    style: {
      background: `url(${getEmoji()})`,
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
      height: '32px',
      left: `${left}px`,
      position: 'fixed',
      top: `${top}px`,
      width: '32px',
    },
    top,
  };
};

const moveEmoji = () => {
  const { innerHeight, innerWidth } = window;

  appState.emoji.forEach((emoji, index) => {
    const { direction, left, moves, speed, top } = emoji;
    if (left < -32 || left > innerWidth || top < -32 || top > innerHeight) {
      appState.emoji.splice(index, 1, createEmoji());
      return;
    }

    const rad = (Math.PI * direction) / 180;

    const deltaX = speed * Math.cos(rad);
    const deltaY = -speed * Math.sin(rad);

    emoji.left += deltaX;
    emoji.top += deltaY;

    emoji.style.left = `${emoji.left}px`;
    emoji.style.top = `${emoji.top}px`;

    if (moves >= 50) {
      emoji.direction += ((oneOrTheOther() ? -1 : 1) * 90) % 360;
      emoji.moves = 0;
    } else {
      emoji.moves += 1;
    }
  });
};

// Also required externally. No arguments.
const goEmoji = () => {
  [...Array(50)].forEach(() => {
    appState.emoji.push(createEmoji());
  });
  setInterval(moveEmoji, 50);
};
