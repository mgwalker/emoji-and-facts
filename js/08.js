import EmojiBase from './EmojiBase.js';
import GiraffeFact from './GiraffeFact.js';
import { getEmoji } from './utils.js';

const TAG = 'embiggen-or-ensmallen-emaoji';

class EmbiggenOrEnsmallen extends EmojiBase {
  #context;
  #meta = {};
  #timer;

  constructor() {
    super();
  }

  connectedCallback() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'position: absolute; left:-1000rem;');
    document.body.append(canvas);
    this.#context = canvas.getContext('2d');
    this.draw();
    this.#timer = setInterval(this.draw.bind(this), 3_000);
  }

  disconnectedCallback() {
    clearInterval(this.#timer);
  }

  draw() {
    this.parentNode.querySelectorAll('div').forEach((node) => {
      node.remove();
      this.#context.clearRect(0, 0, 100, 100);
    });
    const { innerHeight, innerWidth } = window;

    const url = getEmoji();
    const image = new Image();

    image.onload = () => {
      const [imageWidth, imageHeight] = (() => {
        if (image.width > image.height) {
          const scaled = Math.min(24, image.width);
          return [scaled, scaled * (image.height / image.width)];
        }
        const scaled = Math.min(24, image.height);
        return [scaled * (image.width / image.height), scaled];
      })();

      this.#context.drawImage(image, 0, 0, imageWidth, imageHeight);
      this.#meta = {
        left: Math.round(Math.random() * innerWidth),
        top: Math.round(Math.random() * innerHeight),
      };

      const ratio = image.width / image.height;

      const [sqrWidth, sqrHeight] = (() => {
        if (ratio > 0) {
          const height = innerHeight / (Math.floor(Math.random() * 5) + 1);
          const width = ratio * height;
          return [width, height];
        }
        const width = innerWidth / (Math.floor(Math.random() * 5) + 1);
        const height = ratio * width;
        return [width, height];
      })();

      this.#meta.height = sqrHeight;
      this.#meta.width = sqrWidth;

      const PIXEL_SIZE = Math.floor(Math.random() * 30 + 15);

      const h = sqrHeight / PIXEL_SIZE;
      const w = sqrWidth / PIXEL_SIZE;

      this.#meta.top = Math.min(this.#meta.top, innerHeight - sqrHeight);
      this.#meta.left = Math.min(this.#meta.left, innerWidth - sqrWidth);

      for (let x = 0; x < PIXEL_SIZE; x += 1) {
        const left = this.#meta.left + w * x;
        for (let y = 0; y < PIXEL_SIZE; y += 1) {
          const top = this.#meta.top + h * y;

          const imgData = this.#context.getImageData(
            x * (imageWidth / PIXEL_SIZE),
            y * (imageHeight / PIXEL_SIZE),
            1,
            1,
          );
          const [r, g, b, a] = imgData.data;

          if (x === 0 && y === 0) {
            document.body.style.backgroundColor = `rgba(${r},${g},${b},${a})`;
          }

          const div = document.createElement('div');
          div.setAttribute(
            'style',
            `position: absolute; top: ${top}px; left: ${left}px; height: ${h}px; width: ${w}px; background: rgba(${r},${g},${b},${a})`,
          );
          this.parentNode.append(div);
        }
      }
    };
    image.src = url;
  }
}

customElements.define(TAG, EmbiggenOrEnsmallen);

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
    .append(document.createElement(TAG));
};
