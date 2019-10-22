// getEmoji() is used externally and takes the full list of emoji
// as its first argument
let getEmoji = emojiArray => {
  getEmoji = () => emojiArray[Math.floor(Math.random() * emojiArray.length)];
};

const oneOrTheOther = () => !!Math.round(Math.random());

const moveDirection = {
  up: {
    left: () => 90 + Math.random() * 90,
    right: () => Math.random() * 90
  },
  down: {
    left: () => 180 + Math.random() * 90,
    right: () => 270 + Math.random() * 90
  }
};

const addDomNode = () => {
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

  const domEmoji = document.createElement('div');
  domEmoji.setAttribute('data-emoji', null);
  domEmoji.setAttribute('data-direction', direction);
  domEmoji.setAttribute('data-speed', 2 + Math.floor(Math.random() * 9));
  domEmoji.setAttribute(
    'style',
    `position: fixed; top: ${top}px; left: ${left}px; width: 32px; height: 32px; background: url(${getEmoji()}); background-size: contain; background-position: center center; background-repeat: no-repeat;`
  );
  document.body.appendChild(domEmoji);
};

const moveEmoji = () => {
  const { innerHeight, innerWidth } = window;

  Array.from(document.querySelectorAll('div[data-emoji]')).forEach(domEmoji => {
    const { left, top } = domEmoji.getBoundingClientRect();
    if (left < -32 || left > innerWidth || top < -32 || top > innerHeight) {
      domEmoji.remove();
      addDomNode();
      return;
    }

    const direction = +domEmoji.getAttribute('data-direction');
    const speed = +domEmoji.getAttribute('data-speed') || 1;

    if (Number.isNaN(direction)) {
      return;
    }

    const rad = (Math.PI * direction) / 180;

    const deltaX = speed * Math.cos(rad);
    const deltaY = -speed * Math.sin(rad);

    domEmoji.style.left = `${left + deltaX}px`;
    domEmoji.style.top = `${top + deltaY}px`;
  });
};

// Also required externally. No arguments.
const goEmoji = () => {
  for (let i = 0; i < 50; i += 1) {
    addDomNode();
  }
  setInterval(moveEmoji, 50);
};
