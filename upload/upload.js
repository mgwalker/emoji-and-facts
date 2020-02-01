const fs = require('fs');
const https = require('https');
const qs = require('querystring');
const request = require('request');

const team = process.env.SLACK_TEAM;
const token = process.env.SLACK_TOKEN;

const sleep = async ms =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });

// const emoji = { zorro: require('../meta')['zorro'] };
const emoji = require('../meta');

const getEmoji = async () => {
  // return [];

  const bodyData = {
    token
  };

  const getPage = async (page = 1) =>
    new Promise(pageResolve => {
      bodyData.page = page;
      let body = qs.stringify(bodyData);
      const req = https.request(
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': body.length
          },
          host: `${team}.slack.com`,
          method: 'POST',
          path: '/api/emoji.adminList',
          port: 443
        },
        res => {
          let out = '';
          res.on('data', d => (out += d));
          res.on('end', () => {
            pageResolve(JSON.parse(out));
          });
        }
      );

      req.write(body);
      req.end();
    });

  let page = await getPage();
  const emoji = page.emoji;
  while (page.paging.pages !== page.paging.page) {
    await sleep(1.5e3);
    page = await getPage(page.paging.page + 1);
    emoji.push(...page.emoji);
  }

  return emoji;
};

const putAlias = async (alias, source) =>
  new Promise(resolve => {
    const body = qs.stringify({
      alias_for: source,
      mode: 'alias',
      name: alias,
      token
    });

    const req = https.request(
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': body.length
        },
        host: `${team}.slack.com`,
        method: 'POST',
        path: '/api/emoji.add',
        port: 443
      },
      res => {
        res.on('end', () => {
          resolve();
        });
      }
    );

    req.write(body);
    req.end();
  });

const putEmoji = async (name, file) =>
  new Promise(resolve => {
    const image = fs.createReadStream(`../${file}`);
    request.post(
      {
        url: `https://${team}.slack.com/api/emoji.add`,
        formData: {
          token,
          name,
          mode: 'data',
          image
        }
      },
      (err, _, body) => {
        console.log(body);
        console.log('done');
        resolve();
      }
    );
  });

getEmoji()
  .then(e => {
    console.log(`got ${e.length} existing emoji`);
    e.forEach(({ name }) => {
      delete emoji[name];
    });
  })
  .then(async () => {
    await Object.entries(emoji).reduce(
      (prev, [name, meta]) =>
        prev.then(async () => {
          console.log(`putting ${name} - ${meta.file}`);
          await putEmoji(name, meta.file);
          await sleep(2000);
        }),
      Promise.resolve()
    );
  });
