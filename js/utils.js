const emoji = await fetch('emoji.json').then((response) => response.json());

export const oneOrTheOther = () => !!Math.round(Math.random());

export const getEmoji = () => {
  return emoji[Math.floor(Math.random() * emoji.length)];
};

export const moveDirection = {
  up: {
    left: () => 90 + Math.random() * 90,
    right: () => Math.random() * 90,
  },
  down: {
    left: () => 180 + Math.random() * 90,
    right: () => 270 + Math.random() * 90,
  },
};
