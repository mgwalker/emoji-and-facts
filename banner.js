(() => {
  let expanded = false;
  const header = document.querySelector('header');
  const button = document.querySelector('header button');
  const content = document.querySelector('.usa-banner__content');

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

    // usa-banner__header--expanded
  });
})();
