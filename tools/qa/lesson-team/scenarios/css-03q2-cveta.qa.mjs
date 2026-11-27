// Урок 3 курса CSS «Цвета», часть 2 (lessons/css/03q2-cveta.jsx; сборка node tools/qism/build.mjs 03 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
import BASE from './css-03-cveta.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

// Разгадка загадки (hex с маленькими буквами) перенесена в вывод части 1 — в s15 части 2 её нет.
const RIDDLE = "qa.expect(h1c(qa) === 'rgb(250, 79, 40)' && !!qa.q('.c3-cmp-r.is-ok'), 'разгадка: #fa4f28 — тот же цвет, «Совпадает»');";

export default qismPair(BASE, { k: 2, split: 7, file: 'css/03q2-cveta', title: 'Урок 3 курса CSS «Цвета», часть 2', patch: [{ step: 's15: вывод', from: RIDDLE, to: '' }] });
