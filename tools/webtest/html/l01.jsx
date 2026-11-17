// =============================================================================
// ТЕСТЫ К УРОКУ 1 КУРСА HTML «Структура HTML-документа» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: title виден на вкладке, а не на странице; после head идёт body; html обнимает всю страницу;
// незакрытый title съедает страницу; видимый текст живёт в body.
// Словарь урока 1 (тексты заказчика 28.10.2026): вкладка — «brauzer varag'i». Апостроф — только ASCII «'».
// Только теги урока 1 (html, head, body, title): текст в body — просто текст, без p и h1 (их проходят в уроке 2;
// заказчик, 17.11.2026). Верные ответы стоят на разных местах. Картинка — код в редакторе и/или честная страница (WqVis).
// =============================================================================
const SLUG = 'struktura-dokumenta';
const QS = [
  { id: 'html-01t1', target: 'html-01', ptype: 'HTML', tag: 'title', correct: 1,
    vis: (L) => { const T = aqL(L); return <WqVis
      code={`<html>\n  <head>\n    <title>${T('Kodi sahifasi', 'Страница Коди', 'Kodi page')}</title>\n  </head>\n  <body>\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`}
      mark={[3]}
      html={`<html><head><title>${T('Kodi sahifasi', 'Страница Коди', 'Kodi page')}</title></head><body>${T('Salom!', 'Привет!', 'Hello!')}</body></html>`} />; },
    uz: { ctx: "Kod va uning natijasiga qarang.", q: "title tegidagi matn qayerda ko'rinadi?", opts: ["Sahifaning o'rtasida, katta harflar bilan", "Brauzer varag'ida", 'Sahifaning eng pastida', "Hech qayerda ko'rinmaydi"],
      ok: "To'ppa-to'g'ri! title sahifaning nomini beradi, u esa brauzer varag'ida chiqadi.", hint: "Oynaning eng tepasiga qarang: «Kodi sahifasi» yozuvi qayerda turibdi?", alt: "Kod va brauzer oynasi" },
    ru: { ctx: 'Посмотри на код и на результат.', q: 'Где виден текст из тега title?', opts: ['В середине страницы, крупными буквами', 'На вкладке браузера', 'В самом низу страницы', 'Нигде не виден'],
      ok: 'Верно! title — это название страницы, и оно появляется на вкладке браузера.', hint: 'Посмотри на самый верх окна: где написано «Страница Коди»?', alt: 'Код и окно браузера' },
    en: { ctx: 'Look at the code and its result.', q: 'Where does the text from the title tag show up?', opts: ['In the middle of the page, in big letters', 'On the browser tab', 'At the very bottom of the page', 'Nowhere'],
      ok: 'Right! title is the page name, and it shows up on the browser tab.', hint: 'Look at the very top of the window: where does “Kodi page” appear?', alt: 'Code and a browser window' } },
  { id: 'html-01t2', target: 'html-01', ptype: 'HTML', tag: 'body', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n  </head>\n  ___\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`} mark={[5]} />; },
    uz: { ctx: "Bitta qator tushib qolibdi.", q: "Bo'sh joyga qaysi teg yoziladi?", opts: ['</head>', '<title>', '<body>', '<html>'],
      ok: "Xuddi shunday! head yopildi, endi body ochiladi: sahifada ko'rinadigan hamma narsa shu yerda yashaydi.", hint: "Pastda </body> turibdi. U yopuvchi teg, demak tepada uning ochuvchi tegi bo'lishi kerak.", alt: "Bitta qatori bo'sh kod" },
    ru: { ctx: 'Одна строка потерялась.', q: 'Какой тег пишется на пустое место?', opts: ['</head>', '<title>', '<body>', '<html>'],
      ok: 'Именно! head закрыт, теперь открывается body: всё, что видно на странице, живёт здесь.', hint: 'Ниже стоит </body>. Это закрывающий тег, значит, выше нужен его открывающий.', alt: 'Код с пустой строкой' },
    en: { ctx: 'One line has gone missing.', q: 'Which tag goes in the empty spot?', opts: ['</head>', '<title>', '<body>', '<html>'],
      ok: 'Exactly! head is closed, now body opens: everything you see on the page lives here.', hint: 'Below there is </body>. It is a closing tag, so its opening tag must be above.', alt: 'Code with an empty line' } },
  { id: 'html-01t3', target: 'html-01', ptype: 'HTML', tag: 'html', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n  </head>\n  <body>\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`} mark={[1, 8]} />; },
    uz: { ctx: "Birinchi va oxirgi qatorga qarang.", q: "Qaysi teg butun sahifani quchoqlab turadi?", opts: ['html', 'head', 'body', 'title'],
      ok: "Qoyil! html tegi eng boshida ochiladi va eng oxirida yopiladi: head ham, body ham uning ichida.", hint: "Qaysi teg birinchi qatorda ochilib, oxirgi qatorda yopilyapti?", alt: "Birinchi va oxirgi qatori ajratilgan kod" },
    ru: { ctx: 'Посмотри на первую и последнюю строку.', q: 'Какой тег обнимает всю страницу?', opts: ['html', 'head', 'body', 'title'],
      ok: 'Здорово! html открывается в самом начале и закрывается в самом конце: и head, и body — внутри него.', hint: 'Какой тег открывается в первой строке и закрывается в последней?', alt: 'Код с выделенными первой и последней строкой' },
    en: { ctx: 'Look at the first and the last line.', q: 'Which tag wraps the whole page?', opts: ['html', 'head', 'body', 'title'],
      ok: 'Nice work! html opens at the very start and closes at the very end: both head and body are inside it.', hint: 'Which tag opens on the first line and closes on the last one?', alt: 'Code with the first and last lines highlighted' } },
  { id: 'html-01t4', target: 'html-01', ptype: 'HTML', tag: 'title', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const t = T('Kodi sahifasi', 'Страница Коди', 'Kodi page'); const h = T('Salom!', 'Привет!', 'Hello!'); return <WqVis
      code={`<html>\n  <head>\n    <title>${t}\n  </head>\n  <body>\n    ${h}\n  </body>\n</html>`} mark={[3]}
      html={`<html><head><title>${t}\n  </head>\n  <body>\n    ${h}\n  </body>\n</html>`} />; },
    uz: { ctx: "Voy, sahifa bo'm-bo'sh qolibdi, varaqda esa butun kod turibdi!", q: "Kodda nima tushib qolibdi?", opts: ['</body>', '<html>', '<head>', '</title>'],
      ok: "Ana, tuzoq shu yerda ekan! title yopilmagan, shuning uchun brauzer qolgan hamma kodni sahifaning nomi deb o'yladi.", hint: "Brauzer varag'iga qarang: nom qayerda tugashi kerak edi? Qaysi teg ochilgan-u, lekin yopilmagan?", alt: "Bo'sh sahifa va varaqda uzun yozuv" },
    ru: { ctx: 'Ой, страница пустая, а на вкладке — весь код!', q: 'Что потерялось в коде?', opts: ['</body>', '<html>', '<head>', '</title>'],
      ok: 'Вот где ловушка! title не закрыт, поэтому браузер решил, что весь остальной код — это название страницы.', hint: 'Посмотри на вкладку: где должно было кончиться название? Какой тег открыт, но не закрыт?', alt: 'Пустая страница и длинная надпись на вкладке' },
    en: { ctx: 'Oops, the page is empty, and the tab shows all the code!', q: 'What is missing in the code?', opts: ['</body>', '<html>', '<head>', '</title>'],
      ok: 'That’s the trap! title isn’t closed, so the browser thought all the remaining code was the page name.', hint: 'Look at the tab: where should the name have ended? Which tag is opened but never closed?', alt: 'An empty page and a long label on the tab' } },
  { id: 'html-01t5', target: 'html-01', ptype: 'HTML', tag: 'body', correct: 1,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n\n  </head>\n  <body>\n\n  </body>\n</html>\n`} mark={[4, 7]} />; },
    uz: { ctx: "Kodi «Mening sahifam» degan matnni qo'shmoqchi. U sahifada ko'rinishi kerak.", q: "Uni qaysi qatorga yozamiz?", opts: ['4-qatorga', '7-qatorga', '1-qatorga', '9-qatordan keyin'],
      ok: "To'ppa-to'g'ri! Sahifada ko'rinadigan hamma narsa body ichida yashaydi, 7-qator esa aynan body ichida.", hint: "Sahifada ko'rinadigan matn qaysi tegning ichida turadi: head yoki body? O'sha teg qaysi qatorlarda?", alt: "Ikkita bo'sh qatori bor kod" },
    ru: { ctx: 'Коди хочет добавить текст «Моя страница». Его должно быть видно на странице.', q: 'В какую строку его написать?', opts: ['В строку 4', 'В строку 7', 'В строку 1', 'После строки 9'],
      ok: 'Верно! Всё, что видно на странице, живёт внутри body, а строка 7 как раз внутри body.', hint: 'Внутри какого тега живёт видимый текст: head или body? В каких он строках?', alt: 'Код с двумя пустыми строками' },
    en: { ctx: 'Kodi wants to add the text “My page”. It must be visible on the page.', q: 'Which line should it go on?', opts: ['Line 4', 'Line 7', 'Line 1', 'After line 9'],
      ok: 'Right! Everything you see on the page lives inside body, and line 7 is right inside body.', hint: 'Inside which tag does visible text live: head or body? Which lines is it on?', alt: 'Code with two empty lines' } }
];
