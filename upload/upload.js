const fs = require('fs');
const https = require('https');
const qs = require('querystring');
const request = require('request');

const team = process.env.SLACK_TEAM;
const token = process.env.SLACK_TOKEN;

const cookie = require('./cookie');

const sleep = async (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

const emoji = require('../meta');
const skip = require('./skip.json');

const nameCleanupRegex = /\.[a-z]+$/i;
Object.entries(emoji).forEach(([name, meta]) => {
  const clean = name.replace(nameCleanupRegex, '');
  delete emoji[name];

  if (!skip.includes(clean)) {
    emoji[clean] = meta;

    meta.aliases = meta.aliases.map((alias) =>
      alias.replace(nameCleanupRegex, '')
    );
  }
});

const getEmoji = async () => {
  const bodyData = {
    token,
  };

  const getPage = async (page = 1) =>
    new Promise((pageResolve) => {
      bodyData.page = page;
      let body = qs.stringify(bodyData);
      const req = https.request(
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': body.length,
            Cookie: cookie,
          },
          host: `${team}.slack.com`,
          method: 'POST',
          path: '/api/emoji.adminList',
          port: 443,
        },
        (res) => {
          let out = '';
          res.on('data', (d) => (out += d));
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
  new Promise((resolve) => {
    const body = qs.stringify({
      alias_for: source,
      mode: 'alias',
      name: alias,
      token,
    });

    const req = https.request(
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': body.length,
        },
        host: `${team}.slack.com`,
        method: 'POST',
        path: '/api/emoji.add',
        port: 443,
      },
      (res) => {
        res.on('end', () => {
          resolve();
        });
      }
    );

    req.write(body);
    req.end();
  });

const putEmoji = async (name, file) =>
  new Promise((resolve) => {
    const image = fs.createReadStream(`../${file}`);
    request.post(
      {
        url: `https://${team}.slack.com/api/emoji.add`,
        headers: {
          Cookie: cookie,
        },
        formData: {
          token,
          name,
          mode: 'data',
          image,
          _x_reason: 'customize-emoji-add',
          _x_mode: 'online',
        },
      },
      (err, _, body) => {
        const b = JSON.parse(body);
        if (b && b.error) {
          switch (b.error) {
            case 'error_name_taken':
            case 'error_name_taken_i18n':
              console.log('add to skip');
              skip.push(name);
              break;
          }
          console.log(b);
        }
        resolve();
      }
    );
  });

getEmoji()
  .then((e) => {
    console.log(`got ${e.length} existing emoji`);
    e.forEach(({ name }) => {
      delete emoji[name];
    });
    console.log(`${Object.entries(emoji).length} new emoji`);
  })
  .then(async () => {
    const entries = Object.entries(emoji);
    const count = entries.length;
    await entries.reduce(
      (prev, [name, meta], i) =>
        prev.then(async () => {
          console.log(`[${i} of ${count}] putting ${name} - ${meta.file}`);
          await putEmoji(name, meta.file);
          await sleep(2500);
        }),
      Promise.resolve()
    );
  })
  .then(async () => {
    console.log('write new skip file');
    fs.writeFileSync('skip.json', JSON.stringify(skip, null, 2));
  });
