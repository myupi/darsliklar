// Урок 2 курса CSS «Как выбрать элемент для стилизации», часть 2 (lessons/css/02q2-selektory.jsx; сборка tools/qism/build.mjs 02 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + k1…k3, s8…s12.
// Разгадка загадки (без точки браузер ищет тег muhim) перенесена в вывод части 1; шаг s12 целого урока её не проверяет — patch не нужен.
import BASE from './css-02-selektory.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

export default qismPair(BASE, { k: 2, split: 7, file: 'css/02q2-selektory', title: 'Урок 2 курса CSS «Селекторы», часть 2' });
