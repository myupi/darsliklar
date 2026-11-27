// Практика 2 «Газета Коди» (заголовки и текст) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — h1–h6 и абзац p: хук S1 (публикация ломает газету, четыре страницы) + прежние т1–т3 (слова в h1, строка h2,
// два абзаца p) + новое т4 «найди заголовок не того уровня» (главный заголовок записан как h6 — мелкий; нажать строку и
// исправить на h1) + новый вывод E1 (четыре вкладки горят, загадка «цифра больше — заголовок мельче», интрига на часть 2).
// Часть 2 — b, i и своя статья: новый хук H2 («Выделить»: в объявлении слова становятся жирным и наклонным) + два новых
// задания (т1 слова жирным — b в готовом абзаце, т2 смесь: слово наклонным i и слово жирным b) + прежнее «найди и закрой
// незакрытый b» (т3, бывшее т4) + прежнее «своя статья» (т4, бывшее т5) + прежний вывод Fin с четырьмя вкладками.
// Целая практика: lessons/html/02p-zagolovki-i-tekst.jsx (tools/amaliyot2) — не меняется. Урок 2 — tools/qism/conf/02.mjs.
export default {
  dir: 'tools/amaliyot2',
  src: 'a2.src.jsx',
  screens: 'a2-screens.jsx',
  css: 'a2.css',
  slug: 'zagolovki-i-tekst',
  parts: [
    {
      title: { uz: "3-amaliyot. Kodi gazetasi: sarlavhalar", ru: "Практика 3. Газета Коди: заголовки", en: "Practice 3. Kodi’s newspaper: headings" },
      part: '02-p1.part.jsx',
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: T3 },
  { id: 't4', code: 'CHECK-1', Comp: V4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myText', 'myTab']"
    },
    {
      title: { uz: "4-amaliyot. Kodi gazetasi: muhim so'zlar", ru: "Практика 4. Газета Коди: важные слова", en: "Practice 4. Kodi’s newspaper: key words" },
      part: '02-p2.part.jsx',
      // Целая практика считает погоду четвёртой страницей (TABS[3]), свою статью — пятой (TABS[4]); во второй части вкладок
      // четыре: E'lonlar, Kitoblar, Ob-havo (TABS[2]), Mening maqolam (TABS[3]).
      edits: [
        ['TABS[3]', 'TABS[2]', 'all'],
        ['TABS[4]', 'TABS[3]', 'all'],
        ['cur={4} title=', 'cur={3} title='],
        ['if (st.at == null) return { ok: false, msg: C.t4.ask };', 'if (st.at == null) return { ok: false, msg: C.t3.ask };']
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: U1 },
  { id: 't2', code: 'LEVEL-2', Comp: U2 },
  { id: 't3', code: 'CHECK-1', Comp: U3 },
  { id: 't4', code: 'LEVEL-4', Comp: U4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myText', 'myTab']"
    }
  ]
};
