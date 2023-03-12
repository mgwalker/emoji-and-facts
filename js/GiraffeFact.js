const facts = fetch(
  'https://api.github.com/repos/18F/18f-bot-facts/contents/giraffes.json'
)
  .then((response) => response.json())
  .then((ghr) => JSON.parse(atob(ghr.content.replace('\\n', ''))));

let singleton = null;

export default class GiraffeFact extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
<style type="text/css">
  #container {
    align-items: center;
    display: flex;
    height: 100vh;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
  }

  #fact {
    font-family: sans-serif;
    font-size: 48px;
    font-weight: bold;
    padding: 0 30px;
    text-align: center;
  }
</style>
<div id="container">
  <div id="fact"></div>
</div>
`;
    this.shadowRoot.appendChild(template.content);
    setInterval(this.changeFact.bind(this), 10_000);
    singleton = this;
    this.changeFact();
  }

  async changeFact() {
    const list = await facts;

    const element = this.shadowRoot.getElementById('fact');
    element.innerText = list[Math.floor(Math.random() * list.length)];
  }

  static setTextStyle(style) {
    if (!singleton) {
      return;
    }

    const sheet = singleton.shadowRoot.querySelector('style').sheet;
    sheet.insertRule(`#fact { ${style} }`);
  }
}

customElements.define('giraffe-facts', GiraffeFact);
