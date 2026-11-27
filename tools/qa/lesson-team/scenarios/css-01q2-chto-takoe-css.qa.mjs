// Урок 1 курса CSS «Что такое CSS», часть 2 (lessons/css/01q2-chto-takoe-css.jsx; сборка node tools/qism/build.mjs 01 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
// Разгадка «=» вместо «:» перенесена в вывод части 1; в s15 части 2 её нет (шаг s15 целого урока её не проверяет — patch не нужен).
import BASE from './css-01-chto-takoe-css.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

export default qismPair(BASE, { k: 2, split: 7, file: 'css/01q2-chto-takoe-css', title: 'Урок 1 курса CSS «Что такое CSS», часть 2' });
