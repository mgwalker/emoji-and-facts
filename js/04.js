import EmojiBase from './EmojiBase.js';
import { getEmoji, moveDirection, oneOrTheOther } from './utils.js';

const TAG = 'wiggly-waggly-emoji';

class WiggleWaggleEmoji extends EmojiBase {
  constructor() {
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

    super(`
div {
  background: url(${getEmoji()});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  height: 32px;
  left: ${left}px;
  position: fixed;
  top: ${top}px;
  width: 32px;
}`);

    this.meta = {
      direction,
      left,
      speed: 5 + Math.floor(Math.random() * 9),
      top,
    };
    this.interval = setInterval(this.move.bind(this), 50);
  }

  move() {
    const { innerHeight, innerWidth } = window;
    const { direction, left, speed, top, trend } = this.meta;

    if (left < -32 || left > innerWidth || top < -32 || top > innerHeight) {
      this.remove();
      WiggleWaggleEmoji.add();
      clearInterval(this.interval);
      return;
    }

    const element = this.shadowRoot.querySelector('div');

    const rad = (Math.PI * direction) / 180;

    const deltaX = speed * Math.cos(rad);
    const deltaY = -speed * Math.sin(rad);

    this.meta.left += deltaX;
    this.meta.top += deltaY;
    this.meta.direction += Math.random() * 20 * (trend || 1);
    if (Math.random() < 0.2) {
      this.meta.trend = -(trend || 1);
    }

    element.style.left = `${this.meta.left}px`;
    element.style.top = `${this.meta.top}px`;
  }

  static add() {
    document
      .getElementById('emoji-container')
      .appendChild(document.createElement(TAG));
  }
}

customElements.define(TAG, WiggleWaggleEmoji);

export default () => {
  for (let i = 0; i < 50; i += 1) {
    WiggleWaggleEmoji.add();
  }
};
