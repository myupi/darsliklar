// Урок 6 курса CSS «Размеры элементов», часть 2 (lessons/css/06q2-razmery.jsx; сборка node tools/qism/build.mjs 06 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
import BASE from './css-06-razmery.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

// Загадка про height: 30px загадана в конце вывода части 1, а разгадывается в s15 части 2 (опирается на высоту): шаг s15 ничего не проверяет в разгадке — patch не нужен.

export default qismPair(BASE, { k: 2, split: 7, file: 'css/06q2-razmery', title: 'Урок 6 курса CSS «Размеры элементов», часть 2' });
