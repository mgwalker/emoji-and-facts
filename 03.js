// getEmoji() is used externally and takes the full list of emoji
// as its first argument
let getEmoji = emojiArray => {
  getEmoji = () => emojiArray[Math.floor(Math.random() * emojiArray.length)];
};

const addDomNode = () => {
  const { innerWidth } = window;

  // Fixed vertical position, random horizontal position.
  const left = Math.round(Math.random() * innerWidth);

  const domEmoji = document.createElement('div');
  domEmoji.setAttribute('data-emoji', null);
  domEmoji.setAttribute('data-speed', 2 + Math.floor(Math.random() * 19));
  domEmoji.setAttribute(
    'style',
    `position: fixed; top: -32px; left: ${left}px; width: 32px; height: 32px; background: url(${getEmoji()}); background-size: contain; background-position: center center; background-repeat: no-repeat;`
  );
  document.body.appendChild(domEmoji);
};

const moveEmoji = () => {
  const { innerHeight, innerWidth } = window;

  Array.from(document.querySelectorAll('div[data-emoji]')).forEach(domEmoji => {
    const { top } = domEmoji.getBoundingClientRect();
    if (top > innerHeight) {
      domEmoji.remove();
      addDomNode();
      return;
    }

    const speed = +domEmoji.getAttribute('data-speed') || 1;

    domEmoji.style.top = `${top + speed}px`;
  });
};

// Also required externally. No arguments.
const goEmoji = () => {
  for (let i = 0; i < 150; i += 1) {
    addDomNode();
  }
  setInterval(moveEmoji, 50);
};
