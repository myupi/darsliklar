// Урок 16 курса CSS «Адаптивность», часть 2 (lessons/css/16q2-adaptivnost.jsx; сборка node tools/qism/build.mjs 16 css, 27.11.2026):
// шаги и ветки целого урока, разделённые по частям (html-qism.lib.mjs); часть 1 — s1…s7 + вывод e1, часть 2 — крючок h2 + s8…s15.
// Загадка про порядок правил (@media в самом верху) загадывается в крючке h2 и разгадывается в s15 этой же части — патч не нужен.
import BASE from './css-16-adaptivnost.qa.mjs';
import { qismPair } from './html-qism.lib.mjs';

export default qismPair(BASE, { k: 2, split: 7, file: 'css/16q2-adaptivnost', title: 'Урок 16 курса CSS «Адаптивность», часть 2' });
