import GiraffeFact from './GiraffeFact.js';
import EmojiBase from './EmojiBase.js';
import { getEmoji } from './utils.js';

const numberOfEmojiPerRow = 10;

class EmojiGridEmoji extends HTMLElement {
  static get TAG() {
    return 'flippy-spinny-emoji';
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const emojiSize = Math.floor(window.innerWidth / numberOfEmojiPerRow);

    const template = document.createElement('template');
    template.innerHTML = `
<style type="text/css">
.img {
  background-image: url(${getEmoji()});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  height: ${emojiSize}px;
  width: ${emojiSize}px;
}
@keyframes img-flip {
  0% {
    transform: rotateY(0deg);
  }

  50% {
    transform: rotateY(90deg);
  }

  100% {
    transform: rotateY(0deg);
  }
}
div.flip {
  animation-name: img-flip;
  animation-duration: 400ms;
}
</style>
<div class="img"></div>`;
    this.shadowRoot.appendChild(template.content);

    this.meta = {
      flip: 4,
      frames: 15 + Math.floor(Math.random() * 25),
    };

    setInterval(this.flip.bind(this), 100);
  }

  flip() {
    const { flip, frames } = this.meta;
    const element = this.shadowRoot.querySelector('div.img');

    const flipping = frames === 0;

    if (flipping) {
      element.setAttribute('class', 'img flip');
      this.meta.flip -= 1;

      if (flip === 2) {
        element.setAttribute('style', `background-image: url(${getEmoji()});`);
      } else if (flip === 0) {
        element.setAttribute('class', 'img');
        this.meta.flip = 4;
        this.meta.frames = 15 + Math.floor(Math.random() * 25);
      }
    } else {
      this.meta.frames -= 1;
    }
  }
}

class SpinnyFlippyEmojiGrid extends HTMLElement {
  static get TAG() {
    return 'spinny-flippy-emoji-grid';
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const emojiSize = Math.floor(window.innerWidth / numberOfEmojiPerRow);
    const area = window.innerHeight * window.innerWidth;

    // Throw in an extra row's worth of emoji to account for rounding, so
    // that we cover the entire vertical space.
    const emojiCount = numberOfEmojiPerRow + area / (emojiSize * emojiSize);

    // But don't allow scrolling. Just cut those extra emoji off.
    document.body.setAttribute('style', 'overflow-y: hidden;');

    const template = document.createElement('template');
    template.innerHTML = `
<style type="text/css">
  #img_grid {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    overflow-y: hidden;
  }
  #img_grid .img {
    width: ${emojiSize}px;
    height: ${emojiSize}px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }
</style>
<div id="img_grid">
</div>`;

    this.shadowRoot.appendChild(template.content);

    const grid = this.shadowRoot.getElementById('img_grid');
    for (let i = 0; i < emojiCount; i += 1) {
      grid.appendChild(document.createElement(EmojiGridEmoji.TAG));
    }
  }
}

customElements.define(SpinnyFlippyEmojiGrid.TAG, SpinnyFlippyEmojiGrid);
customElements.define(EmojiGridEmoji.TAG, EmojiGridEmoji);

export default () => {
  GiraffeFact.setTextStyle(`
  text-shadow: -1px -1px  0px black,
               -1px  1px  0px black,
                1px -1px  0px black,
                1px  1px  0px black,
                  0    0 20px black;
      color: white;
  `);

  document
    .getElementById('emoji-container')
    .appendChild(document.createElement(SpinnyFlippyEmojiGrid.TAG));
};
