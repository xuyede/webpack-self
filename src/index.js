import text from './module.js';
import './index.scss';

const oH1 = document.createElement('h1');
oH1.innerHTML = 'Hello ' + text;
document.body.appendChild(oH1);
