const createEmoji = () => {
  const { innerWidth } = window;

  // Fixed vertical position, random horizontal position.
  const left = Math.round(Math.random() * innerWidth);

  return {
    speed: 2 + Math.floor(Math.random() * 19),
    style: {
      position: 'fixed',
      top: `32px`,
      left: `${left}px`,
      width: '32px',
      height: '32px',
      background: `url(${getEmoji()})`,
      'background-size': 'contain',
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
    },
    top: -32,
  };
};

const moveEmoji = () => {
  const { innerHeight } = window;

  appState.emoji.forEach((emoji, index) => {
    const { speed, top } = emoji;
    if (top > innerHeight) {
      appState.emoji.splice(index, 1, createEmoji());
      return;
    }

    emoji.top += speed;
    emoji.style.top = `${emoji.top}px`;
  });
};

// Also required externally. No arguments.
const goEmoji = () => {
  [...Array(150)].forEach(() => {
    appState.emoji.push(createEmoji());
  });
  setInterval(moveEmoji, 50);
};
