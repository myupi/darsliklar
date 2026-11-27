// Практика 8 «Сайт школы Коди» (части сайта) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — header, main, footer и nav (тема части 1 урока): хук S1 (сохранение стирает имя main; четыре страницы,
//   а не пять) + т1 имя тега main + НОВОЕ т2 написать footer целиком + т3 строка nav со ссылкой (бывшее т2)
//   + т4 найти верх, обёрнутый в head вместо header (прежнее т4) + новый вывод E1.
// Часть 2 — section и свой сайт: новый хук H2 («Новая тема»: две темы в одной рамке) + НОВОЕ т1 разложить две темы
//   по section + т2 section с h2 и абзацем (бывшее т3) + НОВОЕ т3 найти незакрытый section (рамка второго раздела
//   легла внутрь первого) + т4 свой сайт (бывшее т5) + прежний вывод Fin с четырьмя вкладками и новой речью.
// Целая практика: lessons/html/08p-struktura-sajta.jsx (tools/amaliyot8) — не меняется. Урок 8 — tools/qism/conf/08.mjs.
// Раздел «section» в части 1 ещё не изучен: в т1, хуке и подписях «частей сайта» части 1 его нет (правки P.edits).
export default {
  dir: 'tools/amaliyot8',
  src: 'a8.src.jsx',
  screens: 'a8-screens.jsx',
  css: 'a8.css',
  slug: 'struktura-sajta',
  cssExtra: '08.part.css',
  // Общие правки обеих частей: у вкладок новый порядок — адреса страниц новостей и кружков записаны по имени файла;
  // класс листа берётся из cfg.cls (CSS старых заданий t1…t5 держится на прежних номерах); свой сайт — четвёртая вкладка.
  edits: [
    ["url: d.pg === 'news' ? TABS[1].file : 'galereya.html'", "url: d.pg === 'news' ? 'yangiliklar.html' : 'galereya.html'"],
    ["url: d.pg === 'clubs' ? TABS[2].file : 'sport.html'", "url: d.pg === 'clubs' ? 'togaraklar.html' : 'sport.html'"],
    ["'a8-sheet a8-' + cfg.id +", "'a8-sheet a8-' + (cfg.cls || cfg.id) +"],
    ['TABS[4]', 'TABS[3]', 'all'],
    ['cur={4} title=', 'cur={3} title=']
  ],
  parts: [
    {
      title: { uz: "15-amaliyot. Kodi maktabi sayti: qismlar", ru: "Практика 15. Сайт школы Коди: части", en: "Practice 15. Kodi’s school site: parts" },
      part: '08-p1.part.jsx',
      // В части 1 раздела section ещё нет: страница крючка и задания 1 — header, main с абзацем, footer; подписи частей — без section.
      edits: [
        ["'  ' + a8Wrap('section', a8Wrap('h2', pick(TXT.welcome))), '</main>'", "'  ' + a8Wrap('p', pick(TXT.welcomeP)), '</main>'"],
        ["const sec = a8Wrap('section', a8Wrap('h2', x.pick(TXT.welcome)));", "const sec = a8Wrap('p', x.pick(TXT.welcomeP));"],
        ["{['header', 'nav', 'main', 'section', 'footer'].map((t) => (", "{['header', 'nav', 'main', 'footer'].map((t) => ("]
      ],
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: W2 },
  { id: 't3', code: 'LEVEL-3', Comp: W3 },
  { id: 't4', code: 'CHECK-1', Comp: W4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'mySecs', 'myFoot', 'myTab']"
    },
    {
      title: { uz: "16-amaliyot. Kodi maktabi sayti: bo'limlar", ru: "Практика 16. Сайт школы Коди: разделы", en: "Practice 16. Kodi’s school site: sections" },
      part: '08-p2.part.jsx',
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: X1 },
  { id: 't2', code: 'LEVEL-2', Comp: X2 },
  { id: 't3', code: 'CHECK-1', Comp: X3 },
  { id: 't4', code: 'LEVEL-4', Comp: X4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'mySecs', 'myFoot', 'myTab']"
    }
  ]
};
