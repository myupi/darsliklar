// Практика 5 «Зоопарк Коди» (img, src, alt) двумя частями (tools/qism/build-prac.mjs, 27.11.2026).
// Часть 1 — img, src и alt: прежний хук S1 (четыре страницы) + прежние т1 (имя файла в src), т2 (строка img) +
// новое т3 «опечатка в имени файла» (Toshbaqa, поле с готовым неверным именем) + прежнее т4 (href вместо src) + новый вывод E1.
// Часть 2 — картинка из интернета и своя страница: новый хук H2 («Открыть папку») + новые t1 (полный адрес картинки
// в src, поле в строке) и t2 (найти адрес без https и починить) + прежнее т3 (картинка и абзац, жираф) + прежнее «своё»
// (t4, бывшее т5; картинка из нашей папки или с kodi.uz) + прежний вывод Fin с новой речью.
// Целая практика: lessons/html/05p-izobrazheniya.jsx (tools/amaliyot5) — не меняется. Урок 5 — tools/qism/conf/05.mjs.
export default {
  dir: 'tools/amaliyot5',
  src: 'a5.src.jsx',
  screens: 'a5-screens.jsx',
  css: 'a5.css',
  slug: 'izobrazheniya',
  cssExtra: '05.part.css',
  parts: [
    {
      title: { uz: "9-amaliyot. Kodining hayvonot bog'i: rasmlar", ru: "Практика 9. Зоопарк Коди: фото зверей", en: "Practice 9. Kodi’s zoo: animal photos" },
      part: '05-p1.part.jsx',
      screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 't3', code: 'LEVEL-3', Comp: V3 },
  { id: 't4', code: 'CHECK-1', Comp: V4 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }`,
      reset: "s1: ['s1'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myText', 'mySrc', 'myAlt', 'myTab']"
    },
    {
      title: { uz: "10-amaliyot. Kodining hayvonot bog'i: internetdagi rasmlar", ru: "Практика 10. Зоопарк Коди: фото из интернета", en: "Practice 10. Kodi’s zoo: photos from the web" },
      part: '05-p2.part.jsx',
      // Целая практика считает свою страницу пятой (TABS[4]); во второй части вкладок четыре — своя четвёртая.
      // Картинка с kodi.uz (полный адрес с https) рисуется честно; без https — значок сломанной картинки.
      edits: [
        ['TABS[4]', 'TABS[3]', 'all'],
        ['cur={4} title=', 'cur={3} title='],
        ['const Pic = src ? A5_PICS[src] : null;', 'const Pic = src ? (A5_PICS[src] || a5WebPic(src)) : null;']
      ],
      screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 't1', code: 'LEVEL-1', Comp: W1 },
  { id: 't2', code: 'LEVEL-2', Comp: W2 },
  { id: 't3', code: 'LEVEL-3', Comp: T3 },
  { id: 't4', code: 'LEVEL-4', Comp: W4 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }`,
      reset: "h2: ['h2'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4', 'myCode', 'myHead', 'myText', 'mySrc', 'myAlt', 'myTab']"
    }
  ]
};
