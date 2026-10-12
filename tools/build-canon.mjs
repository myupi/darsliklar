// Сборка канона курса «HTML» v1 из эталонных уроков.
//
//   node tools/build-canon.mjs
//
// Канон собирается строками из эталона Курса 0 (lessons/_reference) плюс части
// из canon/html/*.part.jsx. Ни одна строка эталона не перепечатывается руками:
// так канон гарантированно совпадает с источником. Результат —
// canon/html/canon-v1.jsx; его дословно копирует каждый урок курса.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8').split('\n');

const K0 = read('lessons/_reference/02-kurs0-urok-01.jsx');            // Курс 0, урок 1
const part = (name) => readFileSync(root + 'canon/html/' + name, 'utf8').replace(/\n+$/, '\n').split('\n');

// Строки a..b включительно (нумерация с 1, как в редакторе).
const take = (src, a, b) => src.slice(a - 1, b);

// Контрольные строки: если эталон поменяли, границы разделов уехали —
// сборка останавливается, а не собирает канон из обрывков.
const expect = (src, n, start, label) => {
  const line = src[n - 1] || '';
  if (!line.startsWith(start)) {
    throw new Error(`Граница «${label}» уехала: строка ${n} = ${JSON.stringify(line.slice(0, 60))}`);
  }
};
expect(K0, 40, '// 1. ДИЗАЙН-ТОКЕНЫ', 'К0 токены');
expect(K0, 76, '};', 'К0 конец T');
expect(K0, 111, '// СИСТЕМА ДВИЖЕНИЯ', 'К0 система движения');
expect(K0, 300, '};', 'К0 конец POSES');
expect(K0, 302, '// Голос один', 'К0 голос');
expect(K0, 307, 'const VOICE = ', 'К0 конец голоса');
expect(K0, 489, '// 3. ЯЗЫК', 'К0 язык');
expect(K0, 522, '// 4. ВРЕМЯ И ТЕКСТ ДЛЯ ОЗВУЧКИ', 'К0 текст для озвучки');
expect(K0, 678, 'function useAudioEngine(ttsApiBase, lang) {', 'К0 озвучка');
expect(K0, 1152, '}', 'К0 конец spokenOf');
expect(K0, 1155, '// 6. SFX', 'К0 звуки');
expect(K0, 1210, '// 7. ЖУРНАЛ', 'К0 журнал');
expect(K0, 1240, 'const safeStorage = (() => {', 'К0 хранилище');
expect(K0, 1248, '})();', 'К0 конец хранилища');
expect(K0, 1339, '// 8. РЕЧЬ ПЕРСОНАЖА', 'К0 речь');
expect(K0, 3313, '}', 'К0 конец корня');
expect(K0, 3342, '// ========================  К А Н О Н  ·  М Е Х А Н И К И', 'К0 механики');
expect(K0, 5117, '}', 'К0 конец библиотеки');
expect(K0, 5818, '// ===============  К А Н О Н  ·  П Р А В К И', 'К0 правки вёрстки');
expect(K0, 5920, '`;', 'К0 конец CANON_UI_CSS');
expect(K0, 7361, '// Оформление экранов, которые есть в КАЖДОМ уроке', 'К0 CSS экранов');
expect(K0, 8115, 'const CANON_SCREEN_CSS =', 'К0 конец CSS экранов');

const sections8to17 = take(K0, 1338, 3313);
if (sections8to17.indexOf('  const audio = useAudioEngine(ttsApiBase, lang);') < 0) {
  throw new Error('Не найден вызов useAudioEngine(ttsApiBase, lang) в корне Курса 0');
}

const out = [
  ...part('header.part.jsx'),
  "import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useLayoutEffect } from 'react';",
  '',
  ...take(K0, 39, 76),            // 1. токены
  '',
  ...part('hero-head.part.jsx'),  // 2. герой: шапка раздела и цвета
  ...take(K0, 110, 300),          //    система движения Курса 0 — дословно
  '',
  ...take(K0, 302, 307),          //    голос героя (Курс 0)
  ...part('hero-tail.part.jsx'),  //    имя и рисунок Коди
  ...take(K0, 488, 520),          // 3. язык
  ...take(K0, 521, 1153),         // 4–5. текст для озвучки и движок озвучки
                                  //      с ttsApiBase (Курс 0) — дословно
  ...take(K0, 1154, 1207),        // 6. звуки (Курс 0)
  '',
  ...take(K0, 1209, 1239),        // 7. журнал и стор …
  '// СКЛЕЙКА: прогресс живёт в памяти до конца урока (бриф, «Контракт с',
  '// платформой»): localStorage уроку не нужен. Без хранилища все операции',
  '// useProgress становятся пустыми — так же, как в приватном режиме браузера.',
  'const safeStorage = null;',
  ...take(K0, 1249, 1336),        //    … остаток раздела 7
  ...sections8to17,               // 8–17: речь, рассказ, гейты, похвала, каркас, иконки,
                                  //       подсказки, лесенка, выбор, коуч-марк, CSS_BASE, корень
  '',
  ...take(K0, 3341, 5117),        // механики и библиотека заданий (обе части)
  '',
  ...take(K0, 5817, 5920),        // правки вёрстки — CANON_UI_CSS
  '',
  ...take(K0, 7361, 8115),        // оформление типовых экранов — CANON_SCREEN_CSS
  ''
];

// ЦВЕТ КУРСА (заказчик, 12.10.2026): интерфейс — #FF4F28 вместо голубого
// Курса 0. Меняются только токены ui / blue и голубые rgba в стилях канона.
let text = out.join('\n');
const swap = (from, to) => {
  if (text.indexOf(from) < 0) throw new Error('Не найдено для замены цвета: ' + from);
  text = text.split(from).join(to);
};
swap("  ui: '#1E88E5',", "  // КУРС HTML: интерфейс — #FF4F28 (заказчик, 12.10.2026), а не голубой.\n  ui: '#FF4F28',");
swap("  uiSoft: '#E3F2FD',", "  uiSoft: '#FFE8E1',");
swap("  uiDk: '#1565C0',", "  uiDk: '#B94127',");
swap("  blue: '#2B7FD4',", "  blue: '#EF6A4A',");
swap("  blueSoft: '#E4F0FB',", "  blueSoft: '#FFEDE6',");
swap("  blueDk: '#1F63A8',", "  blueDk: '#B94127',");
// Свечения: голубые тени Курса 0 рассчитаны на холодный цвет. Тот же
// оранжевый при той же прозрачности светится вдвое ярче — поэтому прозрачность
// всех свечений интерфейса умножена на 0.65 (нормализация 12.10.2026).
if (!/rgba\(30,136,229,/.test(text)) throw new Error('Не найдены голубые свечения');
text = text.replace(/rgba\(30,136,229,\s*([0-9.]+)\)/g,
  (m, a) => 'rgba(255,79,40,' + String(+(parseFloat(a) * 0.65).toFixed(2)).replace(/^0\./, '.') + ')');
// Нормализация (12.10.2026): цвета текста выровнены по светлоте OKLCH (L≈0.52)
// и насыщенности — ни один не кричит и не проваливается в чёрный; контраст
// каждого на белом — от 5.2:1. Подсказка остаётся жёлтым каналом,
// но её подписи на светло-жёлтом фоне у Курса 0 читались с контрастом 2.8.
swap("  hint: '#C08A12',", "  hint: '#8D5E00',");
swap('#64B5F6', '#FF8A65');

// РУБАШКА ЗАКРЫТОЙ КАРТОЧКИ (дизайн-ревью 12.10.2026). У Курса 0 рубашка —
// полосы «цвет интерфейса + голубой #42A5F5»: на оранжевом курсе это шумная
// сине-оранжевая карамель. Новая рубашка — тихая: тёплая бумага в точку, белый
// значок «?» и метка </> в углу. Нейтральная намеренно: оранжевым светится
// только карточка, о которой герой говорит сейчас, — так видна иерархия
// «закрыта / читается / открыта».
swap(`.tour-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px;
  background: repeating-linear-gradient(135deg, \${T.ui} 0 14px, #42A5F5 14px 28px); }
.tour-back i { display: grid; place-items: center; width: clamp(34px, 7dvh, 48px); aspect-ratio: 1;
  border-radius: 50%; background: rgba(255,255,255,.92); color: \${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal; }`,
`/* Рубашка курса HTML: тёплая бумага в точку (как пиксели экрана Коди), белый
   значок «?» и метка </> в углу. Оранжевый здесь только в знаке вопроса: цветом
   светится карточка, которую читают сейчас. Значок дышит — карточка ждёт, а не
   выключена; у соседних карточек дыхание идёт со сдвигом. */
.tour-back { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 16px; overflow: hidden;
  background:
    radial-gradient(rgba(\${T.shadowBase},.13) 1.3px, transparent 1.9px) 0 0 / 14px 14px,
    linear-gradient(160deg, #FDFCFA 0%, #F1EEE8 100%);
  box-shadow: inset 0 0 0 1.5px rgba(\${T.shadowBase},.08); }
.tour-back::after { content: '</>'; position: absolute; right: 10px; bottom: 8px;
  font: 800 12px/1 'JetBrains Mono', ui-monospace, monospace; color: \${T.ink3}; }
.tour-back i { display: grid; place-items: center; width: clamp(38px, 7.5dvh, 52px); aspect-ratio: 1;
  border-radius: 50%; background: \${T.paper}; color: \${T.uiDk};
  font-size: clamp(20px, 4dvh, 28px); font-weight: 900; line-height: 1; font-style: normal;
  box-shadow: 0 2px 0 rgba(\${T.shadowBase},0.06), 0 8px 18px -10px rgba(\${T.shadowBase},.45),
    inset 0 0 0 2px rgba(255,79,40,.14);
  animation: backBreath 2.8s ease-in-out infinite; }
.tour-card:nth-child(2) .tour-back i { animation-delay: .45s; }
.tour-card:nth-child(3) .tour-back i { animation-delay: .9s; }
.tour-card:nth-child(4) .tour-back i { animation-delay: 1.35s; }
@keyframes backBreath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
@media (prefers-reduced-motion: reduce) { .tour-back i { animation: none; } }`);

writeFileSync(root + 'canon/html/canon-v1.jsx', text);
console.log('canon/html/canon-v1.jsx —', out.length, 'строк');
