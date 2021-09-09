const fs = require('fs');
const https = require('https');
const qs = require('querystring');
const request = require('request');

const team = process.env.SLACK_TEAM;
const token = process.env.SLACK_TOKEN;

const cookie =
  'd-s=1625786867; b=.d9jou05996csdhogsdzp9w0mk; ssb_instance_id=ac2611a9-cc3d-527b-b951-ce89fda76809; OptanonConsent=isIABGlobal=false&datestamp=Thu+Jul+08+2021+18%3A27%3A46+GMT-0500+(Central+Daylight+Time)&version=6.12.0&hosts=&consentId=57390766-b284-4cf7-8ec1-08c0eff1b56b&interactionCount=1&landingPath=NotLandingPage&groups=C0004%3A0%2CC0002%3A1%2CC0003%3A1%2CC0001%3A1&AwaitingReconsent=false; ec=enQtMjI1MjAxMzY2MzkzOS1hNGQxNjAyNmM4NGNmYzNkYmVlMzkxOTI4Y2M3ZWZhZGFlODhiZGUyZjg2YzUxODYwNzNjYTgwODY3MTU5MDZl; d=GvHoTHEoY0IJW4YcAtpw5EL6DUo5nuhzU2GFwADJi5HT0zUwq49BRnlH5fFTS4HzuSFJxLVXnhHffiYM4ahfXO8HHoyv%2BfEAZSb6Ta9zIVH780JHRlvS5RubyCjmDQEuqyMjGVLpSMYT0F2FJfuYomWj7AXrXlAI7CJORBFkrhn7KNQPdub8AX1h4w%3D%3D; lc=1625786867; shown_download_ssb_modal=1; x=d9jou05996csdhogsdzp9w0mk.1625786855';

const sleep = async (ms) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// const emoji = { zorro: require('../meta')['zorro'] };
const emoji = require('../meta');

const getEmoji = async () => {
  // return [{ name: 'ohno' }];

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
        console.log(body);
        console.log('done');
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
    await Object.entries(emoji).reduce(
      (prev, [name, meta]) =>
        prev.then(async () => {
          console.log(`putting ${name} - ${meta.file}`);
          await putEmoji(name, meta.file);
          await sleep(2500);
        }),
      Promise.resolve()
    );
  });
