import EmojiBase from './EmojiBase.js';
import { getEmoji, moveDirection, oneOrTheOther } from './utils.js';

const TAG = 'an-emoji-moving-in-a-line';

class MoveInALine extends EmojiBase {
  constructor() {
    const { innerHeight, innerWidth } = window;
    const meta = {
      direction: () => {},
      left: 0,
      speed: 2 + Math.floor(Math.random() * 9),
      top: 0,
    };

    if (oneOrTheOther()) {
      // Fixed vertical position, random horizontal position.
      meta.top = oneOrTheOther() ? -32 : innerHeight;
      meta.left = Math.round(Math.random() * innerWidth);
    } else {
      // Fixed horizontal position, random vertical position.
      meta.left = oneOrTheOther() ? -32 : innerWidth;
      meta.top = Math.round(Math.random() * innerHeight);
    }

    if (meta.top < innerHeight / 2.0) {
      meta.direction = moveDirection.down;
    } else {
      meta.direction = moveDirection.up;
    }

    if (meta.left < innerWidth / 2.0) {
      meta.direction = meta.direction.right();
    } else {
      meta.direction = meta.direction.left();
    }

    const url = getEmoji();

    super(`
div {
  background: url(${url});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  height: 32px;
  left: ${meta.left}px;
  position: fixed;
  top: ${meta.top}px;
  width: 32px;
}
`);

    this.meta = meta;
    this.interval = setInterval(this.move.bind(this), 50);
  }

  move() {
    const { innerHeight, innerWidth } = window;
    const { direction, left, speed, top } = this.meta;
    const element = this.shadowRoot.querySelector('div');

    if (left < -32 || left > innerWidth || top < -32 || top > innerHeight) {
      this.remove();
      MoveInALine.add();
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
  }

  static add() {
    document
      .getElementById('emoji-container')
      .append(document.createElement(TAG));
  }
}

customElements.define(TAG, MoveInALine);

export default () => {
  for (let i = 0; i < 50; i += 1) {
    MoveInALine.add();
  }
};
