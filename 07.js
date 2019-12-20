const addDomNode = () => {
  const diameter = Math.floor(Math.random() * 170) + 24;
  const circumference = diameter * Math.PI;
  const degreesPerPixel = 360 / circumference;

  const speed = 3 + Math.floor(Math.random() * 20);

  const { innerHeight } = window;
  const top = Math.floor(Math.random() * innerHeight) - diameter / 2;

  const domEmoji = document.createElement('div');
  domEmoji.setAttribute('data-emoji', null);
  domEmoji.setAttribute('data-direction', null);
  domEmoji.setAttribute('data-speed', speed);
  domEmoji.setAttribute('dom-angle', 0);
  domEmoji.setAttribute('data-ratio', speed * degreesPerPixel);
  domEmoji.setAttribute(
    'style',
    `position: fixed; border: 4px solid black; border-radius: 100%; top: ${top}px; left: -${diameter}px; width: ${diameter}px; height: ${diameter}px; background: url(${getEmoji()}); background-size: contain; background-position: center center; background-repeat: no-repeat;`
  );
  document.body.appendChild(domEmoji);
};

const moveEmoji = () => {
  const { innerWidth } = window;

  Array.from(document.querySelectorAll('div[data-emoji]')).forEach(domEmoji => {
    const angle = +domEmoji.getAttribute('data-angle');
    const ratio = +domEmoji.getAttribute('data-ratio');
    const speed = +domEmoji.getAttribute('data-speed');
    const left = +domEmoji.style.left.replace('px', '');

    if (left > innerWidth) {
      domEmoji.remove();
      addDomNode();
      return;
    }

    domEmoji.setAttribute('data-angle', angle + ratio);

    domEmoji.style.left = `${left + speed}px`;
    domEmoji.style.transform = `rotate(${angle + ratio}deg)`;
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

  for (let i = 0; i < 50; i += 1) {
    addDomNode();
  }
  setInterval(moveEmoji, 50);
};
