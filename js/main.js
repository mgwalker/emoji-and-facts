import './GiraffeFact.js';

const scripts = ['01', '02', '03', '04', '05', '06', '07'];
const script = scripts[Math.floor(Math.random() * scripts.length)];

import(`./${script}.js`).then((m) => m.default());
