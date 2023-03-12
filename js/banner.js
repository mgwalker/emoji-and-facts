class Banner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
<style type="text/css">
  .site-banner {
    font-size: 0.81rem;
    padding-bottom: 0;
    line-height: 1.6;
    background-color: #1b1b1b;
    font-family: Public Sans Web, -apple-system, BlinkMacSystemFont,
      Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji,
      Segoe UI Emoji, Segoe UI Symbol;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 10;
  }

  .site-banner .usa-banner__header {
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    min-height: 0;
    font-size: 0.75rem;
    font-weight: 400;
    position: relative;
    color: #fff;
    z-index: 10;
  }

  .site-banner .usa-banner__inner {
    align-items: center;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-left: auto;
    margin-right: auto;
    max-width: none;
    display: flex !important;
    flex-wrap: wrap !important;
  }

  .grid-col-auto {
    flex: 0 1 auto !important;
    width: auto !important;
    max-width: 100% !important;
    max-width: 100% !important;
  }

  .tablet:grid-col-auto {
    flex: 0 1 auto !important;
    width: auto !important;
    max-width: 100% !important;
  }

  .grid-col-fill {
    flex: 1 1 0% !important;
    min-width: 1px;
  }

  .usa-banner__header-text {
    margin-bottom: 0;
    margin-top: 0;
    font-size: 0.75rem;
    line-height: 1.2;
    color: #fff;
  }

  .site-banner .usa-banner__header-action {
    display: none;
    color: #adadad;
    line-height: 1.2;
    margin-bottom: 0;
    margin-top: 2px;
    text-decoration: underline;
  }

  .site-banner .usa-banner__button[aria-expanded='false'],
  .site-banner .usa-banner__button[aria-expanded='true'] {
    background-image: none;
    color: #adadad;
    bottom: auto;
    left: auto;
    right: auto;
    top: auto;
    display: inline;
    margin-left: 0.5rem;
    position: relative;
    -webkit-font-smoothing: inherit;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    font-weight: 400;
    margin: 0;
    text-align: left;
    vertical-align: baseline;
    font-size: 0.75rem;
    height: auto;
    line-height: 1.2;
    padding: 0;
    text-decoration: none;
    width: auto;
    background-repeat: no-repeat;
    background-size: 1.5rem;
    background-position: right 1.25rem center;
    cursor: pointer;
    -webkit-appearance: button;
    text-transform: none;
    overflow: visible;
    font-family: inherit;
  }

  .site-banner .usa-banner__button-text {
    position: static;
    display: inline;
    left: -999em;
    right: auto;
    text-decoration: underline;
  }

  .site-banner .usa-banner__button:after {
    position: absolute;
    content: '⌄';
    color: rgb(112, 178, 249);
    font-weight: 800;
    font-size: 1.3em;
    top: -0.37em;
    padding-left: 0.2em;
  }

  .site-banner .usa-banner__button[aria-expanded='true']:after {
    content: '⌃';
    font-size: 1em;
    top: 0;
  }

  .usa-banner__content {
    color: white;
    font-size: 2em;
    padding: 0 2em;
    font-weight: bold;
  }
</style>

<section
  class="usa-banner site-banner"
  aria-label="Not at all an official government website,,"
>
  <div class="usa-accordion">
    <header class="usa-banner__header">
      <div class="usa-banner__inner">
        <div class="grid-col-auto">🦒</div>
        <div class="grid-col-fill tablet:grid-col-auto">
          <p class="usa-banner__header-text">
            Not at all an official website of the United States government
          </p>
          <p class="usa-banner__header-action" aria-hidden="true">
            Here’s how you know
          </p>
        </div>
        <button
          type="button"
          class="usa-accordion__button usa-banner__button"
          aria-expanded="false"
          aria-controls="gov-banner"
        >
          <span class="usa-banner__button-text">Here’s how you know</span>
        </button>
      </div>
    </header>
    <div
      class="usa-banner__content usa-accordion__content"
      id="gov-banner"
      hidden=""
    >
      You know it's not a real government website because we straight-up
      told you so.
    </div>
  </div>
</section>
    `;

    this.shadowRoot.appendChild(template.content);

    let expanded = false;
    const header = this.shadowRoot.querySelector('header');
    const button = this.shadowRoot.querySelector('header button');
    const content = this.shadowRoot.querySelector('.usa-banner__content');

    button.addEventListener('click', () => {
      expanded = !expanded;
      button.setAttribute('aria-expanded', `${expanded ? 'true' : 'false'}`);

      if (expanded) {
        header.setAttribute(
          'class',
          header.getAttribute('class') + ' usa-banner__header--expanded'
        );
        content.removeAttribute('hidden');
      } else {
        header.setAttribute(
          'class',
          header
            .getAttribute('class')
            .replace('usa-banner__header--expanded', '')
            .trim()
        );
        content.setAttribute('hidden', '');
      }
    });
  }
}

customElements.define('not-gov-banner', Banner);
