import './GiraffeFact.js';

const scripts = ['01', '02', '03', '04', '05', '06', '07', '08'];
const script = scripts[Math.floor(Math.random() * scripts.length)];

if (document.location.hash) {
  const target = document.location.hash.slice(1);
  if (scripts.includes(target)) {
    import(`./${target}.js`).then((m) => m.default());
  }
} else {
  import(`./${script}.js`).then((m) => m.default());
}
