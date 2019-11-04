const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Works best in iTerm 2.9 or higher, but whatever!

const draw = (() => {
  const fallback = async () => {
    console.log(`(Can't draw emoji - need iTerm 2.9 or higher!)`);
  };

  if (process.env.TERM_PROGRAM !== 'iTerm.app') {
    return fallback;
  }
  const version = process.env.TERM_PROGRAM_VERSION;
  if (version) {
    const bits = version.split('.').map(Number);
    if (bits[0] < 2) {
      return fallback;
    }
    if (bits[0] === 2 && bits[1] < 9) {
      return fallback;
    }
  }

  return async url =>
    new Promise(resolve => {
      const esc = '\u001B]1337;File=inline=1:';
      const bel = `\u0007`;

      let img = '';
      https.get(url, res => {
        res.setEncoding('base64');

        res.on('data', d => {
          img += d;
        });

        res.on('end', a => {
          console.log(`${esc}${img}${bel}`);
          resolve();
        });
      });
    });
})();

// Get the list of emoji to be excluded
const ignore = require('./ignore.json');

// Get the complete list of emoji, as presented
const all = require('./emoji.json')
  // Add the eventual filename as a property
  .map(e => ({ ...e, filename: `${e.name}${path.extname(e.url)}` }))
  // Remove aliases
  .filter(e => e.is_alias === 0);

const newEmoji = all
  // Remove the emoji that we already know we don't want to publish
  .filter(e => !ignore.includes(e.filename))
  // Remove the emoji that are already part of the repo
  .filter(e => !fs.existsSync(`../emoji/${e.filename}`));

// Prompt the user about whether to keep a particular emoji
const shouldKeep = async emoji =>
  new Promise(async resolve => {
    console.log(`Here's a new emoji called "${emoji.name}":`);
    await draw(emoji.url);

    readline.question('Do you want to keep this one? [y/N] ', yn => {
      resolve(/^y/i.test(yn));
    });
  });

// Download an emoji
const download = async emoji =>
  new Promise(resolve => {
    const file = fs.createWriteStream(`../emoji/${emoji.filename}`);
    https
      .get(emoji.url, function(res) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('download succeeded');
          resolve();
        });
      })
      .on('error', function(e) {
        file.close();
        fs.unlink(`../emoji/${emoji.filename}`);
        console.log('download failed');
        resolve();
      });
  });

const promptAboutAllTheEmoji = async () => {
  let index = 0;
  while (index < newEmoji.length) {
    if (index > 0) {
      console.log('\n═════════════════════════════════════════════════\n');
    }

    const emoji = newEmoji[index];
    const keep = await shouldKeep(emoji);

    if (keep) {
      // If they want to keep it, download it.
      console.log('...downloading');
      await download(emoji);
    } else {
      // Otherwise push it to the ignore pile
      ignore.push(emoji.filename);
    }

    index += 1;
  }
};

// Build the flat list of emoji files, based on what's currently on the
// filesystem. This list is used to power the simple landing page.
const buildEmojiList = async () =>
  new Promise(resolve => {
    fs.readdir('../emoji', (err, files) => {
      fs.writeFileSync(
        '../emoji.json',
        JSON.stringify(files.map(f => `emoji/${f}`), null, '  ')
      );
      resolve();
    });
  });

// Build a bit more metadata. This one is used to build the grid page
// and needs to include aliases and everything for tooltips.
const buildEmojiMetadata = async () =>
  new Promise(resolve => {
    fs.readdir('../emoji', (_, files) => {
      const meta = files.reduce((o, filename) => {
        // We found an emoji file that's not in the metadata list.
        // So we'll just make stuff up, based on the filename.
        const emoji = all.find(e => e.filename === filename);
        if (!emoji) {
          return {
            ...o,
            [path.basename(filename)]: {
              aliases: [path.basename(filename)],
              file: `emoji/${filename}`
            }
          };
        }

        return {
          ...o,
          [emoji.name]: {
            // For emoji with no aliases, Slack sets the synonyms property
            // to an empty array. For emoji WITH alises, the synonyms property
            // is an array of all aliases INCLUDING the base emoji. That is
            // bizarrely inconsistent, so we'll change the behavior: our
            // aliases list will always include the base emoji, whether it
            // has other aliases or not.
            aliases: emoji.synonyms.length ? emoji.synonyms : [emoji.name],
            file: `emoji/${filename}`
          }
        };
      }, {});
      fs.writeFileSync('../meta.json', JSON.stringify(meta, null, 2));
      resolve();
    });
  });

promptAboutAllTheEmoji()
  .then(async () => {
    fs.writeFileSync('ignore.json', JSON.stringify(ignore, null, 2));
    readline.close();

    await buildEmojiList();
    await buildEmojiMetadata();
  })
  .catch(e => {
    console.log(e);
    readline.close();
  });
