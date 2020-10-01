console.log('%c👀', 'font-size: 96px; text-shadow: 2px 2px 5px black;');
console.log('%chi there', 'font-family: sans-serif; font-size: 10px;');

const appState = {
  emoji: [],
  giraffeFact: '',
};

const app = new Vue({
  el: '#everything',
  data: appState,
});

const addCSSRule = (rule) => {
  const sheet = document.getElementById('styles').sheet;
  const index = sheet.cssRules.length;
  sheet.insertRule(rule, index);
};

let getEmoji = (emojiArray) => {
  getEmoji = () => emojiArray[Math.floor(Math.random() * emojiArray.length)];
};

const goGiraffes = (facts) => {
  appState.giraffeFact = facts[Math.round(Math.random() * facts.length)];
  setInterval(() => {
    appState.giraffeFact = facts[Math.round(Math.random() * facts.length)];
  }, 10000);
};

const requestedScript = +window.location.hash.replace('#', '');

const scriptCount = 7;
const script =
  requestedScript > 0 && requestedScript <= scriptCount
    ? requestedScript
    : Math.floor(Math.random() * scriptCount + 1);
const moverScript = document.createElement('script');
moverScript.setAttribute('type', 'text/javascript');
document.body.appendChild(moverScript);
moverScript.addEventListener('load', () => {
  fetch('emoji.json')
    .then((response) => response.json())
    .then((emoji) => {
      getEmoji(emoji);
      goEmoji();
    });

  fetch('https://api.github.com/repos/18F/18f-bot-facts/contents/giraffes.json')
    .then((response) => {
      return response.json();
    })
    .then((facts) => {
      goGiraffes(JSON.parse(atob(facts.content.replace('\\n', ''))));
    });
});
moverScript.setAttribute('src', `${script < 10 ? '0' : ''}${script}.js`);
