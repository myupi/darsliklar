// Практика 6 «Анкеты Коди» (формы, часть 1) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — input и type: хук S1 (страница без label и form) + прежнее задание 1 (вписать значение type) + три новых
// (K2 дописать атрибут type целиком, K3 написать строку input с type, K4 найти опечатку в значении type и исправить) +
// новый вывод E1. Часть 2 — placeholder, label и form: новый хук H2 («Saqlash» — подсказки пропали, подписи отлетели от
// полей) + четыре прежних задания (бывшие т2–т5 → т1–т4: строка input с type и placeholder, label, найти поле пароля
// со «спрятанным» через placeholder паролем, своя анкета) + прежний вывод Fin с новой речью.
// Целая практика: lessons/html/06p-formy-vvod.jsx (tools/amaliyot6) — не меняется. Урок 6 — tools/qism/conf/06.mjs.
export default {
  dir: 'tools/amaliyot6',
  src: 'a6.src.jsx',
  screens: 'a6-screens.jsx',
  css: 'a6.css',
  slug: 'formy-vvod',
  cssExtra: '06.part.css',
  // Класс листа задания — cfg.cls, если он есть (иначе id): у части 1 свои классы k1…k4, у части 2 — классы прежних заданий.
  edits: [
    ["'a6-sheet a6-' + cfg.id + (v.big", "'a6-sheet a6-' + (cfg.cls || cfg.id) + (v.big"]
  ],
  parts: [
    {
      title: { uz: "11-amaliyot. Kodi anketalari: maydonlar", ru: "Практика 11. Анкеты Коди: поля", en: "Practice 11. Kodi’s forms: fields" },
      part: '06-p1.part.jsx',
      // Хук части 1: страница без label и form (как в части 1 урока) — подпись в p, поле input на своей строке.
      edits: [
        ["'  ' + a6Label(pick(CAP.name), a6Input('text')), '  ' + a6Label(pick(CAP.pass), a6Input(broke ? '' : 'password')), '</form>'];",
          "p1Cap(pick(CAP.name)), a6Input('text'), p1Cap(pick(CAP.pass)), a6Input(broke ? '' : 'password')];"],
        ["const lines = ['<h1>' + club + '</h1>', '<form>', p1Cap(", "const lines = ['<h1>' + club + '</h1>', p1Cap("],
        ['mark={broke ? 3 : null}', 'mark={broke ? 4 : null}'],
        // На странице пять блоков (заголовок, две подписи, два поля): на телефоне окно выше (06.part.css, .a6-five).
        ['<Sheet cls="a6-sheet a6-s1">', '<Sheet cls="a6-sheet a6-s1 a6-five">']
      ],
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: K1 },
  { id: 't2', code: 'LEVEL-2', Comp: K2 },
  { id: 't3', code: 'LEVEL-3', Comp: K3 },
  { id: 't4', code: 'CHECK-1', Comp: K4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myFields', 'myTab']"
    },
    {
      title: { uz: "12-amaliyot. Kodi anketalari: ishora va yozuv", ru: "Практика 12. Анкеты Коди: подсказки и подписи", en: "Practice 12. Kodi’s forms: hints and labels" },
      part: '06-p2.part.jsx',
      // Целая практика считает свою анкету пятой страницей (TABS[4]); во второй части вкладок четыре — своя четвёртая.
      // Тексты находки лежат под ключом t3 (прежний t4); класс листа — по прежнему номеру (cfg.cls в part-файле), чтобы работали
      // CSS-правила прежних заданий; вывод — плашки placeholder · label · form · type · own.
      edits: [
        ['TABS[4]', 'TABS[3]', 'all'],
        ['cur={4} title=', 'cur={3} title='],
        ['{ ok: false, msg: C.t4.ask }', '{ ok: false, msg: C.t3.ask }'],
        ["{['input', 'type', 'placeholder', 'label', 'own'].map((k) => (", "{['placeholder', 'label', 'form', 'type', 'own'].map((k) => ("],
        ["label: '#F59E0B', own: '#E44D26' };", "label: '#F59E0B', own: '#E44D26', form: '#DB2777' };"],
        ["curK === 'label' ? find(/<label>/) : null;", "curK === 'label' ? find(/<label>/) : curK === 'form' ? find(/<form>/) : null;"]
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: Q1 },
  { id: 't2', code: 'LEVEL-2', Comp: Q2 },
  { id: 't3', code: 'CHECK-1', Comp: Q3 },
  { id: 't4', code: 'LEVEL-4', Comp: Q4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myFields', 'myTab']"
    }
  ]
};
