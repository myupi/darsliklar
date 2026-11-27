// Практика 1 «Пять вкладок Коди» двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — тег, head и title: хук S1 (сбой гасит четыре вкладки) + прежние т1 (слово в title) и т2 (строка title) +
// новые т3 (написать head вокруг готовой строки title) и т4 (найти и исправить опечатку «titel») + новый вывод E1.
// Часть 2 — body и порядок документа: новый хук H2 («Добавить текст») + прежнее т3 (блок body, теперь т1) + новое т2
// (название и текст перепутаны: title — вкладка, body — окно) + прежнее т4 (незакрытый title, теперь т3: «вкладка съела
// страницу», экран S14 урока) + прежнее «своё» (т5, теперь т4) + прежний вывод Fin с четырьмя вкладками.
// Целая практика: lessons/html/01p-struktura-dokumenta.jsx (tools/amaliyot1) — не меняется.
// Части урока 1 — tools/redaktor28/build-qism.mjs (не tools/qism/conf: у урока 1 свой сборщик частей).
export default {
  dir: 'tools/amaliyot1',
  src: 'a1.src.jsx',
  screens: 'a1-screens.jsx',
  css: 'a1.css',
  slug: 'struktura-dokumenta',
  parts: [
    {
      title: { uz: "1-amaliyot. Kodining varaqlari", ru: "Практика 1. Вкладки Коди", en: "Practice 1. Kodi’s tabs" },
      part: '01-p1.part.jsx',
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: V3 },
  { id: 't4', code: 'CHECK-1', Comp: V4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myTitle', 'myText']"
    },
    {
      title: { uz: "2-amaliyot. Kodining oynalari", ru: "Практика 2. Окна Коди", en: "Practice 2. Kodi’s windows" },
      part: '01-p2.part.jsx',
      // Целая практика считает свою страницу пятой вкладкой (индекс 4); во второй части вкладок четыре — своя четвёртая.
      edits: [
        ['const name = i === 4 ?', 'const name = i === 3 ?'],
        ['cur={4} title={title}', 'cur={3} title={title}']
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: W1 },
  { id: 't2', code: 'LEVEL-2', Comp: W2 },
  { id: 't3', code: 'CHECK-1', Comp: W3 },
  { id: 't4', code: 'LEVEL-4', Comp: W4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myTitle', 'myText']"
    }
  ]
};
