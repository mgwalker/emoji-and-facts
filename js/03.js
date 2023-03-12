import EmojiBase from './EmojiBase.js';
import { getEmoji } from './utils.js';

const TAG = 'emoji-falling-from-the-top-of-the-world';

class RainingEmoji extends EmojiBase {
  constructor() {
    const { innerWidth } = window;

    // Fixed vertical position, random horizontal position.
    const left = Math.round(Math.random() * innerWidth);
    const speed = 2 + Math.floor(Math.random() * 19);
    const top = -32;

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

    this.meta = { speed, top };
    this.interval = setInterval(this.move.bind(this), 50);
  }

  move() {
    const { innerHeight } = window;
    const { speed, top } = this.meta;

    if (top > innerHeight) {
      this.remove();
      RainingEmoji.add();
      clearInterval(this.interval);
      return;
    }

    const element = this.shadowRoot.querySelector('div');
    this.meta.top += speed;
    element.style.top = `${this.meta.top}px`;
  }

  static add() {
    document
      .getElementById('emoji-container')
      .append(document.createElement(TAG));
  }
}

customElements.define(TAG, RainingEmoji);

export default () => {
  for (let i = 0; i < 50; i += 1) {
    RainingEmoji.add();
  }
};
