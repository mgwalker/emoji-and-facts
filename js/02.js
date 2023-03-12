import EmojiBase from './EmojiBase.js';
import { getEmoji, oneOrTheOther } from './utils.js';

const TAG = 'an-emoji-going-straight-then-turning-90-degrees';

class RightAngleEmoji extends EmojiBase {
  constructor() {
    const { innerHeight, innerWidth } = window;
    let left = 0;
    let top = 0;
    let direction;

    if (oneOrTheOther()) {
      // Fixed vertical position, random horizontal position.
      top = oneOrTheOther() ? -32 : innerHeight;
      left = Math.round(Math.random() * innerWidth);
      direction = top < 0 ? 270 : 90;
    } else {
      // Fixed horizontal position, random vertical position.
      left = oneOrTheOther() ? -32 : innerWidth;
      top = Math.round(Math.random() * innerHeight);
      direction = left < 0 ? 0 : 180;
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
      moves: 0,
      speed: 2 + Math.floor(Math.random() * 9),
      top,
    };
    this.interval = setInterval(this.move.bind(this), 50);
  }

  move() {
    const { innerHeight, innerWidth } = window;
    const { direction, left, moves, speed, top } = this.meta;
    const element = this.shadowRoot.querySelector('div');

    if (left < -32 || left > innerWidth || top < -32 || top > innerHeight) {
      this.remove();
      RightAngleEmoji.add();
      clearInterval(this.interval);
      return;
    }

    const rad = (Math.PI * direction) / 180;

    const deltaX = speed * Math.cos(rad);
    const deltaY = -speed * Math.sin(rad);

    this.meta.left += deltaX;
    this.meta.top += deltaY;

    element.style.left = `${this.meta.left}px`;
    element.style.top = `${this.meta.top}px`;

    if (moves >= 50) {
      this.meta.direction = (direction + 90) % 360;
      this.meta.moves = 0;
    } else {
      this.meta.moves = moves + 1;
    }
  }

  static add() {
    document
      .getElementById('emoji-container')
      .append(document.createElement(TAG));
  }
}

customElements.define(TAG, RightAngleEmoji);

export default () => {
  for (let i = 0; i < 50; i += 1) {
    RightAngleEmoji.add();
  }
};
