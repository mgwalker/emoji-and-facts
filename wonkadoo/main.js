import fs from "node:fs/promises";
import path from "path";
import throttle from "@mgwalker/promise-throttle";
import { config } from "dotenv";

config();

const {
  BEARER_TOKEN,
  EMOJI_PACK_AVATAR_URL,
  EMOJI_PACK_BASENAME,
  EMOJI_PACK_URL_PATH,
  SERVER_URL,
} = process.env;

const UPLOAD_URL = `${SERVER_URL}/media/v3/upload?filename=`;
const EMOJI_PUT_URL = `${SERVER_URL}/${EMOJI_PACK_URL_PATH}/${EMOJI_PACK_BASENAME}%20`;

export const exists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const sleep = async (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

let urls;

const upload = async ({ name, file }) => {
  process.stdout.write(name);
  const uploadUrl = `${UPLOAD_URL}${path.basename(file)}`;
  const fileBuffer = await fs.readFile(`../${file}`);

  const { content_uri: emojiUri } = await fetch(uploadUrl, {
    method: "POST",
    body: fileBuffer.buffer,
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  }).then((response) => response.json());

  urls[name] = { url: emojiUri };
  await fs.writeFile(`./emoji-urls.json`, JSON.stringify(urls, null, 2));

  process.stdout.write("...done\n");

  await sleep(1_000);
};

const getEmojiURLs = async () => {
  if (await exists("./emoji-urls.json")) {
    urls = JSON.parse(await fs.readFile("./emoji-urls.json"));
  } else {
    urls = {};
  }
};

const uploadNewEmoji = async () => {
  await getEmojiURLs();
  const known = new Set(Object.keys(urls));

  const newEmoji = Object.values(JSON.parse(await fs.readFile("../meta.json")))
    .map(({ aliases: [name], file }) => ({ name, file }))
    .filter(({ name }) => !known.has(name));

  await throttle(newEmoji, upload, 1);
};

const createEmojiPacks = async () => {
  let index = 1;
  let start = 0;
  let end = 1006;

  const allEmoji = JSON.parse(await fs.readFile("./emoji-urls.json"));
  const allKeys = Object.keys(allEmoji);
  const count = Object.keys(allEmoji).length;

  while (start < count) {
    const filename = `emoji-pack-${index}.json`;
    const newPack = !(await exists(filename));

    const keys = allKeys.slice(start, end);
    const pack = {
      images: {},
      pack: {
        avatar_url: EMOJI_PACK_AVATAR_URL,
        display_name: `${EMOJI_PACK_BASENAME} ${index}`,
      },
    };
    keys.forEach((key) => {
      pack.images[key] = allEmoji[key];
    });

    await fs.writeFile(filename, JSON.stringify(pack, null, 2));

    if (newPack) {
      console.log(
        `In matrix, create a new emoji pack called "${EMOJI_PACK_BASENAME} ${index}" and then re-run this script`,
      );
    } else {
      console.log(`Updating pack ${EMOJI_PACK_BASENAME} ${index}`);
      await fetch(`${EMOJI_PUT_URL}${index}`, {
        method: "PUT",
        body: JSON.stringify(pack),
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });
      await sleep(500);
    }

    index += 1;
    start = end;
    end += 500;
  }
};

uploadNewEmoji().then(() => createEmojiPacks());
