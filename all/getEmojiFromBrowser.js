// Open emoji page in Slack, then run this in the dev console to get a JSON
// document of all the emoji. It may take a few seconds. Save it in the
// same directory as this script, as emoji.json. Then you can run the merge
// script to merge in the new emoji. Yay!

(async () => {
  const token = Array.from($('script[type="text/javascript"]:not([src])'))
    .filter(n => n.firstChild.textContent.indexOf('api_token') >= 0)[0]
    .firstChild.textContent.match(/"api_token":"([^"]+)"/)[1];

  const sleep = async ms =>
    new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    });

  const getPage = async (page = 1) => {
    const form = new FormData();
    form.append('token', token);
    form.append('page', page);

    const response = await fetch('/api/emoji.adminList', {
      body: form,
      method: 'post'
    });

    return response.json();
  };

  const blackout = document.createElement('div');
  blackout.setAttribute(
    'style',
    'position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; background-color: rgba(0, 0, 0, 0.3);'
  );
  document.body.appendChild(blackout);

  const banner = document.createElement('div');
  banner.setAttribute(
    'style',
    'position: fixed; top: 45vh; left: 30vw; width: 40vw; background: white; text-align: center; padding: 10vh;'
  );
  document.body.appendChild(banner);

  banner.innerText = 'Getting page 1...';
  let page = await getPage();
  const emoji = page.emoji;
  while (page.paging.pages !== page.paging.page) {
    await sleep(1.5e3);
    banner.innerText = `Getting page ${page.paging.page + 1} of ${
      page.paging.pages
    }...`;
    page = await getPage(page.paging.page + 1);
    emoji.push(...page.emoji);
  }

  banner.remove();
  blackout.remove();

  const anchor = document.createElement('a');
  anchor.setAttribute('download', 'emoji.json');
  anchor.setAttribute(
    'href',
    `data:application/json,${JSON.stringify(emoji, null, 2)}`
  );
  document.body.appendChild(anchor);
  await sleep(10);
  anchor.click();
  await sleep(10);
  anchor.remove();
})();
