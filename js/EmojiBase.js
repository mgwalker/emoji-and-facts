export default class EmojiBase extends HTMLElement {
  constructor(style) {
    super();

    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `<style>${style}</style><div></div>`;

    this.shadowRoot.appendChild(template.content);
  }
}
