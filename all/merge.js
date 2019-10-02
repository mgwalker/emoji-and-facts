const cp = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Expects imgcat in order to work:
// brew install imgcat
// and a terminal that supports it

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
  new Promise(resolve => {
    console.log(`Here's a new emoji called "${emoji.name}":`);
    cp.execSync(`curl -s ${emoji.url} | imgcat`, {
      stdio: [null, process.stdout]
    });

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
    fs.readdir('../emoji', (err, files) => {
      const meta = files.reduce((o, filename) => {
        const emoji = all.find(e => e.filename === filename);
        if (!emoji) {
          return {
            ...o,
            [path.basename(filename)]: {
              aliases: path.basename(filename),
              file: `emoji/${filename}`
            }
          };
        }
        return {
          ...o,
          [emoji.name]: {
            aliases: emoji.synonyms || [emoji.name],
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

// Holding place: the metadata file generated above breaks the grid tooltips,
// but I haven't looked into it yet so here's some stuff to drop into a REPL
// to fix it.
// --------------
// const oldmeta = require('./meta.json');
// fs.writeFileSync(
//   './newMeta.json',
//   JSON.stringify(
//     Object.entries(oldmeta).reduce((o, [name, meta]) => {
//       if (meta.aliases.length) {
//         return { ...o, [name]: meta };
//       } else {
//         return { ...o, [name]: { ...meta, aliases: [name] } };
//       }
//     }, {}),
//     null,
//     2
//   ),
//   { encoding: 'utf-8' }
// );
