// Урок 9 курса CSS «Как элементы ведут себя на странице», часть 1 (lessons/css/09q1-display.jsx; сборка node tools/qism/build.mjs 09 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
// Загадка про width у ссылок в части 1 не загадывается: её загадывает крючок h2 части 2, разгадка — в s15 части 2.
import BASE from './css-09-display.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

export default qismPair(BASE, { k: 1, split: 7, file: 'css/09q1-display', title: 'Урок 9 курса CSS «Как элементы ведут себя на странице», часть 1' });
