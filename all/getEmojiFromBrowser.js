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

  let page = await getPage();
  const emoji = page.emoji;
  while (page.paging.pages !== page.paging.page) {
    await sleep(3000);
    page = await getPage(page.paging.page + 1);
    emoji.push(...page.emoji);
  }

  window.open(`data:application/json,${JSON.stringify(emoji, null, 2)}`);
})();
