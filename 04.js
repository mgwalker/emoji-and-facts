const oneOrTheOther = () => !!Math.round(Math.random());

const moveDirection = {
  up: {
    left: () => 90 + Math.random() * 90,
    right: () => Math.random() * 90,
  },
  down: {
    left: () => 180 + Math.random() * 90,
    right: () => 270 + Math.random() * 90,
  },
};

const createEmoji = () => {
  const { innerHeight, innerWidth } = window;
  let left = 0;
  let top = 0;
  let direction = moveDirection;

  if (oneOrTheOther()) {
    // Fixed vertical position, random horizontal position.
    top = oneOrTheOther() ? -32 : innerHeight;
    left = Math.round(Math.random() * innerWidth);
  } else {
    // Fixed horizontal position, random vertical position.
    left = oneOrTheOther() ? -32 : innerWidth;
    top = Math.round(Math.random() * innerHeight);
  }

  if (top < innerHeight / 2.0) {
    direction = direction.down;
  } else {
    direction = direction.up;
  }

  if (left < innerWidth / 2.0) {
    direction = direction.right();
  } else {
    direction = direction.left();
  }

  return {
    direction,
    left,
    speed: 5 + Math.floor(Math.random() * 9),
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
    const { direction, left, speed, top, trend } = emoji;
    if (left < -32 || left > innerWidth || top < -32 || top > innerHeight) {
      appState.emoji.splice(index, 1, createEmoji());
      return;
    }

    const rad = (Math.PI * direction) / 180;

    const deltaX = speed * Math.cos(rad);
    const deltaY = -speed * Math.sin(rad);

    emoji.left += deltaX;
    emoji.top += deltaY;
    emoji.direction += Math.random() * 20 * (trend || 1);
    if (Math.random() < 0.2) {
      emoji.trend = -(trend || 1);
    }

    emoji.style.left = `${emoji.left}px`;
    emoji.style.top = `${emoji.top}px`;
  });
};

// Also required externally. No arguments.
const goEmoji = () => {
  [...Array(50)].forEach(() => {
    appState.emoji.push(createEmoji());
  });
  setInterval(moveEmoji, 50);
};
