// Практика 4 «Путешествие Коди» (ссылки и атрибуты) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — a, href и поломки ссылки: хук S1 (сохранение рвёт ссылки) + прежние т1 (имя файла в href), т2 (строка-ссылка
// на главную) + новое т3 (опечатка в имени файла: «samarkand.html» — «Файл не найден», починить) + прежнее т4 (найти a
// без href) + новый вывод E1. Четыре вкладки: Bosh sahifa, Toshkent, Xiva (новая вместо Samarqand), Buxoro.
// Часть 2 — сайты в интернете и своя ссылка: новый хук H2 (ссылка на Википедию без https — «Fayl topilmadi») + два новых
// задания (т1 полный адрес https://… в href, т2 дописать потерянное https:// в готовой строке) + прежнее т3 (абзац со
// ссылкой внутри, Samarqand) + прежнее «своё» (т4, бывшее т5) + прежний вывод Fin с новой речью.
// Целая практика: lessons/html/04p-ssylki-i-atributy.jsx (tools/amaliyot4) — не меняется. Урок 4 — tools/qism/conf/04.mjs.
export default {
  dir: 'tools/amaliyot4',
  src: 'a4.src.jsx',
  screens: 'a4-screens.jsx',
  css: 'a4.css',
  slug: 'ssylki-i-atributy',
  cssExtra: '04.part.css',
  parts: [
    {
      title: { uz: "7-amaliyot. Kodining sayohati: shaharlar", ru: "Практика 7. Путешествие Коди: города", en: "Practice 7. Kodi’s trip: cities" },
      part: '04-p1.part.jsx',
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: Z3 },
  { id: 't4', code: 'CHECK-1', Comp: V4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myText', 'myHref', 'myTab']"
    },
    {
      title: { uz: "8-amaliyot. Kodining sayohati: boshqa saytlar", ru: "Практика 8. Путешествие Коди: другие сайты", en: "Practice 8. Kodi’s trip: other websites" },
      part: '04-p2.part.jsx',
      edits: [
        // Целая практика считает свою страницу пятой вкладкой (TABS[4]); во второй части вкладок четыре — своя четвёртая.
        ['TABS[4]', 'TABS[3]', 'all'],
        ['cur={4} title=', 'cur={3} title='],
        // Свой экран (т4 — бывшее т5) красится правилами .a4-t5 (помощь и большой редактор), id остаётся t4.
        ["<Sheet cls={'a4-sheet a4-' + cfg.id + (v.big ? ' is-big' : '')}>", "<Sheet cls={'a4-sheet a4-' + (cfg.cls || cfg.id) + (v.big ? ' is-big' : '')}>"],
        // Сайты в интернете: адрес https://… открывает заглушку известного сайта, неизвестное имя — «Saytni ochib bo'lmadi».
        ["  return { title: pick(UI.nf), blocks:", "  const ext = a4ExtShown(nav.file, pick);\n  if (ext) return ext;\n  return { title: pick(UI.nf), blocks:"],
        // Ссылка на другой сайт — тоже ссылка: полный адрес с https:// принимается; имя сайта без https — своя причина.
        ["  if (SITE_FILES.indexOf(ln.href) < 0) return fillL(FB.fileNo, { got: ln.href });", "  if (SITE_FILES.indexOf(ln.href) < 0 && !a4WebOk(ln.href)) return a4HrefMiss(ln.href);"],
        ["t.attrs.href && SITE_FILES.indexOf(t.attrs.href) >= 0)", "t.attrs.href && (SITE_FILES.indexOf(t.attrs.href) >= 0 || a4WebOk(t.attrs.href)))"],
        // Вывод части 2: плашки a · имя файла · https · своя страница.
        ["['a', 'href', 'val', 'own'].map(", "['a', 'val', 'web', 'own'].map("],
        ["k === 'href' ? '#7C5CFA'", "k === 'web' ? '#7C5CFA'"],
        ["curK === 'a' || curK === 'href' || curK === 'val' ? find(/<a /) : null", "curK === 'a' || curK === 'val' || curK === 'web' ? find(/<a /) : null"]
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: Y1 },
  { id: 't2', code: 'LEVEL-2', Comp: Y2 },
  { id: 't3', code: 'LEVEL-3', Comp: T3 },
  { id: 't4', code: 'LEVEL-4', Comp: Y4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myText', 'myHref', 'myTab']"
    }
  ]
};
