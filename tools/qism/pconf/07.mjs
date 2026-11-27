// Практика 7 «Лагерь Коди» (формы, часть 2: выбор и отправка) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — select, option и textarea: прежний хук S1 (с новым текстом), t1 option в строке (прежнее), t2 input → textarea
// (новое), t3 select с тремя option (прежнее), t4 слово без option (прежнее, дополнительная задача заменена) + новый вывод E1.
// Часть 2 — button и своя анкета: новый хук H2 («Saqlash» стирает кнопку), t1 строка button (прежнее), t2 textarea и
// button (новое), t3 найти строку, проглотившую кнопку (незакрытый textarea; новое основное, прежняя дополнительная
// задача становится его дополнительной) и прежнее «своё» (t4, бывшее t5) + прежний вывод Fin с новой речью.
// Целая практика: lessons/html/07p-formy-vybor.jsx (tools/amaliyot7) — не меняется. Урок 7 — tools/qism/conf/07.mjs.
export default {
  dir: 'tools/amaliyot7',
  src: 'a7.src.jsx',
  screens: 'a7-screens.jsx',
  css: 'a7.css',
  slug: 'formy-vybor',
  parts: [
    {
      title: { uz: "13-amaliyot. Kodi lageri: tanlash va katta maydon", ru: "Практика 13. Лагерь Коди: выбор и большое поле", en: "Practice 13. Kodi’s camp: choices and a big field" },
      part: '07-p1.part.jsx',
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: V2 },
  { id: 't3', code: 'LEVEL-3', Comp: V3 },
  { id: 't4', code: 'CHECK-1', Comp: V4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3', 'myCode', 'myHead', 'myOpts', 'myBtn', 'myTab'], t4: ['t4']"
    },
    {
      title: { uz: "14-amaliyot. Kodi lageri: tugma va anketa", ru: "Практика 14. Лагерь Коди: кнопка и анкета", en: "Practice 14. Kodi’s camp: a button and a form" },
      part: '07-p2.part.jsx',
      // Целая практика считает свою анкету пятой страницей (TABS[4]); во второй части вкладок четыре — своя четвёртая.
      // Класс листа — по cfg.css (если задан): у задания 4 стили «своей анкеты» (a7-t5), у кнопки — a7-t2, у блока — a7-t3.
      edits: [
        ['TABS[4]', 'TABS[3]', 'all'],
        ['cur={4} title=', 'cur={3} title='],
        ["'a7-sheet a7-' + cfg.id + (v.big", "'a7-sheet a7-' + (cfg.css || cfg.id) + (v.big"]
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: W1 },
  { id: 't2', code: 'LEVEL-2', Comp: W2 },
  { id: 't3', code: 'CHECK-1', Comp: W3 },
  { id: 't4', code: 'LEVEL-4', Comp: W4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myOpts', 'myBtn', 'myTab']"
    }
  ]
};
