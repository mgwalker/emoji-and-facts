let emojiSize = 0;

const frameLoop = () => {
  const imgs = Array.from(document.querySelectorAll('[data-frames]'));
  imgs.forEach(img => {
    const imgFrames = +img.getAttribute('data-frames');
    const flips = +img.getAttribute('data-flip');

    const flipping = imgFrames === 0;

    if (flipping) {
      img.setAttribute('class', 'flip');
      img.setAttribute('data-flip', flips - 1);

      if (flips === 2) {
        img.setAttribute(
          'style',
          `width: ${emojiSize}px; height: ${emojiSize}px; background: url(${getEmoji()}); background-size: contain; background-position: center center; background-repeat: no-repeat;`
        );
      } else if (flips === 0) {
        img.setAttribute('class', '');
        img.setAttribute('data-flip', 4);
        img.setAttribute('data-frames', 15 + Math.floor(Math.random() * 25));
      }
    } else {
      img.setAttribute('data-frames', imgFrames - 1);
    }
  });
};

// Also required externally. No arguments.
const goEmoji = () => {
  emojiSize = Math.floor(window.innerWidth / 20);
  const area = window.innerHeight * window.innerWidth;
  const emojiCount = 20 + area / (emojiSize * emojiSize);

  const facts = document.getElementById('giraffe_fact');
  facts.setAttribute(
    'style',
    'text-shadow: -1px -1px 0px black, -1px 1px 0px black, 1px -1px 0px black, 1px 1px 0px black, 0 0 20px black; color: white;'
  );

  document.body.setAttribute('style', 'overflow-y: hidden;');

  addCSSRule(
    '.img_grid { display: flex; flex-wrap: wrap; justify-content: space-around; overflow-y: hidden; }'
  );
  addCSSRule(
    `@keyframes img-flip {
      0% {
        transform: rotateY(0deg);
      }

      50% {
        transform: rotateY(90deg);
      }

      100% {
        transform: rotateY(0deg);
      }
    }`
  );
  addCSSRule(
    'div.flip { animation-name: img-flip; animation-duration: 400ms; }'
  );

  const grid = document.createElement('div');
  grid.setAttribute('class', 'img_grid');
  document.body.appendChild(grid);

  for (let i = 0; i < emojiCount; i++) {
    const imgContainer = document.createElement('div');
    imgContainer.setAttribute(
      'style',
      `width: ${emojiSize}px; height: ${emojiSize}px; background: url(${getEmoji()}); background-size: contain; background-position: center center; background-repeat: no-repeat;`
    );
    imgContainer.setAttribute('src', getEmoji());
    imgContainer.setAttribute(
      'data-frames',
      15 + Math.floor(Math.random() * 25)
    );
    imgContainer.setAttribute('data-flip', 4);

    grid.appendChild(imgContainer);
  }

  setInterval(frameLoop, 100);
};
