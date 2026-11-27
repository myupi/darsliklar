// Практика 3 «Праздник Коди» (списки) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — ul, li и ol: хук S1 (сохранение ломает списки) + прежние т1–т4 + новый вывод E1.
// Часть 2 — ul или ol и свой список: новый хук H2 («Перемешать») + три новых задания (t1 поменять ul на ol,
// t2 обернуть пункты списком по смыслу, t3 найти пункт без li) + прежнее «своё» (t4, бывшее t5) + прежний вывод Fin.
// Целая практика: lessons/html/03p-spiski.jsx (tools/amaliyot3) — не меняется. Урок 3 — tools/qism/conf/03.mjs.
export default {
  dir: 'tools/amaliyot3',
  src: 'a3.src.jsx',
  screens: 'a3-screens.jsx',
  css: 'a3.css',
  slug: 'spiski',
  cssExtra: '03.part.css',
  parts: [
    {
      title: { uz: "5-amaliyot. Kodining bayrami: menyu va qadamlar", ru: "Практика 5. Праздник Коди: меню и шаги", en: "Practice 5. Kodi’s party: menus and steps" },
      part: '03-p1.part.jsx',
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: T3 },
  { id: 't4', code: 'CHECK-1', Comp: V4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myItems', 'myTab']"
    },
    {
      title: { uz: "6-amaliyot. Kodining bayrami: dastur va sovg'alar", ru: "Практика 6. Праздник Коди: программа и подарки", en: "Practice 6. Kodi’s party: schedule and gifts" },
      part: '03-p2.part.jsx',
      // Целая практика считает свой список пятой страницей (TABS[4]); во второй части вкладок четыре — своя четвёртая.
      edits: [
        ['TABS[4]', 'TABS[3]', 'all'],
        ['cur={4} title=', 'cur={3} title=']
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: U1 },
  { id: 't2', code: 'LEVEL-2', Comp: U2 },
  { id: 't3', code: 'CHECK-1', Comp: U3 },
  { id: 't4', code: 'LEVEL-4', Comp: U4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myItems', 'myTab']"
    }
  ]
};
