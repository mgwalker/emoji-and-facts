const frameLoop = () => {
  const emojis = Array.from(document.querySelectorAll('[data-frames]'));
  emojis.forEach(emoji => {
    const imgFrames = +emoji.getAttribute('data-frames');
    const flips = +emoji.getAttribute('data-flip');

    const flipping = imgFrames === 0;

    if (flipping) {
      emoji.setAttribute('class', 'img flip');
      emoji.setAttribute('data-flip', flips - 1);

      if (flips === 2) {
        emoji.setAttribute('style', `background-image: url(${getEmoji()});`);
      } else if (flips === 0) {
        emoji.setAttribute('class', 'img');
        emoji.setAttribute('data-flip', 4);
        emoji.setAttribute('data-frames', 15 + Math.floor(Math.random() * 25));
      }
    } else {
      emoji.setAttribute('data-frames', imgFrames - 1);
    }
  });
};

// Required externally. No arguments.
const goEmoji = () => {
  const numberOfEmojiPerRow = 10;
  const emojiSize = Math.floor(window.innerWidth / numberOfEmojiPerRow);
  const area = window.innerHeight * window.innerWidth;

  // Throw in an extra row's worth of emoji to account for rounding, so
  // that we cover the entire vertical space.
  const emojiCount = numberOfEmojiPerRow + area / (emojiSize * emojiSize);

  // But don't allow scrolling. Just cut those extra emoji off.
  document.body.setAttribute('style', 'overflow-y: hidden;');

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

  addCSSRule(
    `.img_grid {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        overflow-y: hidden;
      }`
  );
  addCSSRule(
    `.img_grid .img {
      width: ${emojiSize}px;
      height: ${emojiSize}px;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }`
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
    `div.flip {
      animation-name: img-flip;
      animation-duration: 400ms;
    }`
  );

  const grid = document.createElement('div');
  grid.setAttribute('class', 'img_grid');
  document.body.appendChild(grid);

  for (let i = 0; i < emojiCount; i++) {
    const emoji = document.createElement('div');
    emoji.setAttribute('class', 'img');
    emoji.setAttribute('style', `background-image: url(${getEmoji()});`);
    emoji.setAttribute('data-frames', 15 + Math.floor(Math.random() * 25));
    emoji.setAttribute('data-flip', 4);

    grid.appendChild(emoji);
  }

  setInterval(frameLoop, 100);
};
