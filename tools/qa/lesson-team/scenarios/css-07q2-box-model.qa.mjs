// Урок 7 курса CSS «Box Model», часть 2 (lessons/css/07q2-box-model.jsx; сборка node tools/qism/build.mjs 07 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
import BASE from './css-07-box-model.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

// Разгадка про padding: 30px перенесена в вывод части 1 — в s15 части 2 она начинается с margin; шаг s15 целого урока ждёт только «Завершить».

export default qismPair(BASE, { k: 2, split: 7, file: 'css/07q2-box-model', title: 'Урок 7 курса CSS «Box Model», часть 2' });
