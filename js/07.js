import EmojiBase from './EmojiBase.js';
import { getEmoji, oneOrTheOther } from './utils.js';

const TAG = 'wheelie-emoji-go-brrrr';

class WheelEmoji extends EmojiBase {
  constructor() {
    const diameter = Math.floor(Math.random() * 170) + 24;
    const circumference = diameter * Math.PI;
    const degreesPerPixel = 360 / circumference;

    const speed = 3 + Math.floor(Math.random() * 20);

    const { innerHeight } = window;
    const top = Math.floor(Math.random() * innerHeight) - diameter / 2;

    super(`
div {
  background: url(${getEmoji()});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 100%;
  height: ${diameter}px;
  left: -${diameter}px;
  position: fixed;
  top: ${top}px;
  width: ${diameter}px;
}`);

    this.meta = {
      angle: 0,
      left: -diameter,
      ratio: speed * degreesPerPixel,
      speed,
    };
    this.interval = setInterval(this.move.bind(this), 50);
  }

  move() {
    const { innerWidth } = window;
    const { angle, left, ratio, speed } = this.meta;

    if (left > innerWidth) {
      this.remove();
      WheelEmoji.add();
      clearInterval(this.interval);
      return;
    }

    this.meta.angle += ratio;
    this.meta.left += speed;

    const element = this.shadowRoot.querySelector('div');
    element.style.left = `${this.meta.left}px`;
    element.style.transform = `rotate(${this.meta.angle}deg)`;
  }

  static add() {
    document
      .getElementById('emoji-container')
      .append(document.createElement(TAG));
  }
}

customElements.define(TAG, WheelEmoji);

export default () => {
  for (let i = 0; i < 50; i += 1) {
    WheelEmoji.add();
  }
};
