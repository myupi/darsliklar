// Урок 2 курса HTML «Заголовки и текст», часть 2 (lessons/html/02q2-zagolovki-i-tekst.jsx; сборка tools/qism/build.mjs, 26.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); в части 1 — первые 7 экранов целого урока + вывод e1,
// в части 2 — крючок h2 + остальные экраны.
import BASE from './html-02-zagolovki-i-tekst.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

export default qismPair(BASE, { k: 2, split: 7, file: 'html/02q2-zagolovki-i-tekst', title: 'Урок 2 курса HTML «Заголовки и текст», часть 2' });
