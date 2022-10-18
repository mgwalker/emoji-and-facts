const createEmoji = () => {
  const diameter = Math.floor(Math.random() * 170) + 24;
  const circumference = diameter * Math.PI;
  const degreesPerPixel = 360 / circumference;

  const speed = 3 + Math.floor(Math.random() * 20);

  const { innerHeight } = window;
  const top = Math.floor(Math.random() * innerHeight) - diameter / 2;

  return {
    angle: 0,
    left: -diameter,
    ratio: speed * degreesPerPixel,
    speed,
    style: {
      background: `url(${getEmoji()})`,
      'background-position': 'center center',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
      'border-radius': '100%',
      height: `${diameter}px`,
      left: `${-diameter}px`,
      position: 'fixed',
      top: `${top}px`,
      width: `${diameter}px`,
    },
  };
};

const moveEmoji = () => {
  const { innerWidth } = window;

  appState.emoji.forEach((emoji, index) => {
    const { left, ratio, speed } = emoji;

    if (left > innerWidth) {
      appState.emoji.splice(index, 1, createEmoji());
      return;
    }

    emoji.angle += ratio;
    emoji.left += speed;

    emoji.style.left = `${emoji.left}px`;
    emoji.style.transform = `rotate(${emoji.angle}deg)`;
  });
};

const goEmoji = () => {
  const facts = document.getElementById('giraffe_fact');
  facts.setAttribute(
    'style',
    `text-shadow: -1px -1px 0px black,
                  -1px 1px 0px black,
                   1px -1px 0px black,
                   1px 1px 0px black,
                   0 0 20px black;
    color: white;`
  );

  [...Array(50)].forEach(() => {
    appState.emoji.push(createEmoji());
  });
  setInterval(moveEmoji, 50);
};
