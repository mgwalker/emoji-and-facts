// Open emoji page in Slack, then run this in the dev console to get a JSON
// document of all the emoji. It may take a while. Save it in the
// same directory as this script, as emoji.json. Then you can run the merge
// script to merge in the new emoji. Yay!
(async () => {
  const sleep = async (ms) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });

  const blackout = document.createElement('div');
  blackout.setAttribute(
    'style',
    'position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; background-color: rgba(0, 0, 0, 0.3); z-index: 5000;'
  );
  document.body.appendChild(blackout);

  const banner = document.createElement('div');
  banner.setAttribute(
    'style',
    'position: fixed; top: 45vh; left: 30vw; width: 40vw; background: white; text-align: center; padding: 10vh; z-index: 5001;'
  );
  document.body.appendChild(banner);

  banner.innerText = 'Getting emoji... hang tight';

  document.querySelector('button[aria-label="Emoji"]').click();
  await sleep(1_000);

  const container = document.querySelector('#emoji-picker-list');
  container.scrollTo(0, 7_000);
  await sleep(3_000);
  let lastTop = -1;

  const emojis = new Map();

  while (container.scrollTop != lastTop) {
    Array.from(document.querySelectorAll('#emoji-picker-list img.c-emoji'))
      .filter((node) => !/standard-emoji/.test(node.src))
      .forEach((node) =>
        emojis.set(node.src, node.getAttribute('data-stringify-emoji'))
      );

    banner.innerText = `Found ${emojis.size} custom emoji...`;

    lastTop = container.scrollTop;
    container.scrollBy(0, 128);
    await sleep(1000);

    if (container.scrollTop === lastTop) {
      container.scrollBy(0, 128);
      await sleep(10_000);
    }
  }

  banner.remove();
  blackout.remove();

  const anchor = document.createElement('a');
  anchor.setAttribute('download', 'emoji.json');
  anchor.setAttribute(
    'href',
    `data:application/json,${JSON.stringify(
      Array.from(emojis)
        .map(([key, value]) => ({ name: value, url: key }))
        .sort(({ name: a }, { name: b }) => {
          if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          return 0;
        })
    )}`
  );

  document.body.appendChild(anchor);
  await sleep(10);
  anchor.click();
  await sleep(10);
  anchor.remove();
})();
