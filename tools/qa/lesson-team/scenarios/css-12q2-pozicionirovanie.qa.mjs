// Урок 12 курса CSS «Позиционирование», часть 2 (lessons/css/12q2-pozicionirovanie.jsx; сборка node tools/qism/build.mjs 12 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
import BASE from './css-12-pozicionirovanie.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

// Разгадка (метка без якоря улетает в угол страницы) перенесена в вывод части 1; шаг s15 целого урока её не проверяет — patch не нужен.
export default qismPair(BASE, { k: 2, split: 7, file: 'css/12q2-pozicionirovanie', title: 'Урок 12 курса CSS «Позиционирование», часть 2' });
