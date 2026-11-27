// =============================================================================
// ТЕСТЫ К УРОКУ 1 «Теги, head и title» (часть 1 урока «Структура HTML-документа», 27.11.2026) — 5 вопросов.
// Тема части: тег, html, head, title. Вопросы 2, 3 (html), 5 (title) — прежние из l01.jsx, 1 и 4 — новые.
// Верные ответы: C, A, D, B, D. Апостроф — только ASCII «'»; вкладка — «brauzer varag'i».
// =============================================================================
const SLUG = 'struktura-dokumenta';
const QS = [
  { id: 'html-01q1t1', target: 'html-01q1', ptype: 'HTML', tag: 'teg', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi sahifasi', 'Страница Коди', 'Kodi page')} ___\n  </head>\n</html>`} mark={[3]} />; },
    uz: { ctx: "Kodi sahifaga nom yozdi, lekin qatorning oxiri tushib qolibdi.", q: "Bo'sh joyga qaysi teg yoziladi?", opts: ['<title>', '<\\title>', '</title>', '<title/>'],
      ok: "Xuddi shunday! Yopuvchi tegda qiya chiziq birinchi qavsdan keyin, so'zdan oldin turadi.", hint: "Tepada <title> ochilgan. Uni tugatadigan yopuvchi tegda qiya chiziq qayerda turishini eslang.", alt: "Oxiri tushib qolgan title qatori" },
    ru: { ctx: 'Коди написал название страницы, но конец строки потерялся.', q: 'Какой тег пишется на пустое место?', opts: ['<title>', '<\\title>', '</title>', '<title/>'],
      ok: 'Именно! В закрывающем теге косая черта стоит после первой скобки, перед словом.', hint: 'Вверху открыт <title>. Вспомни, где у закрывающего тега стоит косая черта.', alt: 'Строка title без конца' },
    en: { ctx: 'Kodi wrote the page name, but the end of the line went missing.', q: 'Which tag goes in the empty spot?', opts: ['<title>', '<\\title>', '</title>', '<title/>'],
      ok: 'Exactly! In a closing tag the slash comes after the first bracket, before the word.', hint: 'The <title> tag is open above. Remember where the slash goes in a closing tag.', alt: 'A title line with no ending' } },
  { id: 'html-01q1t2', target: 'html-01q1', ptype: 'HTML', tag: 'html', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n  </head>\n  <body>\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`} mark={[1, 8]} />; },
    uz: { ctx: "Birinchi va oxirgi qatorga qarang.", q: "Qaysi teg butun sahifani quchoqlab turadi?", opts: ['html', 'head', 'body', 'title'],
      ok: "Qoyil! html tegi eng boshida ochiladi va eng oxirida yopiladi: head ham, body ham uning ichida.", hint: "Qaysi teg birinchi qatorda ochilib, oxirgi qatorda yopilyapti?", alt: "Birinchi va oxirgi qatori ajratilgan kod" },
    ru: { ctx: 'Посмотри на первую и последнюю строку.', q: 'Какой тег обнимает всю страницу?', opts: ['html', 'head', 'body', 'title'],
      ok: 'Здорово! html открывается в самом начале и закрывается в самом конце: и head, и body — внутри него.', hint: 'Какой тег открывается в первой строке и закрывается в последней?', alt: 'Код с выделенными первой и последней строкой' },
    en: { ctx: 'Look at the first and the last line.', q: 'Which tag wraps the whole page?', opts: ['html', 'head', 'body', 'title'],
      ok: 'Nice work! html opens at the very start and closes at the very end: both head and body are inside it.', hint: 'Which tag opens on the first line and closes on the last one?', alt: 'Code with the first and last lines highlighted' } },
  { id: 'html-01q1t3', target: 'html-01q1', ptype: 'HTML', tag: 'head', correct: 3,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Коди' : 'Kodi'} text={L === 'ru' ? '«Хочу записать информацию о странице, например её название. Но чтобы в окне её не было видно!»' : L === 'en' ? '“I want to write information about the page, such as its name. But it shouldn’t show in the window!”' : "«Sahifa haqidagi ma'lumotni yozib qo'ymoqchiman, masalan, uning nomini. Lekin u oynada ko'rinmasin!»"} />,
    uz: { ctx: "Kodi sahifa haqidagi ma'lumotni yashirib qo'ymoqchi.", q: "Buni qayerga yozish kerak?", opts: ['body ichida', "html tashqarisida", "oynaning o'zida", 'head ichida'],
      ok: "Xuddi shunday! head ichida sahifa haqidagi ma'lumotlar turadi, ular oynada ko'rinmaydi.", hint: "Oynada nima ko'rinsa, hammasi bitta joyda yashaydi. Ma'lumotlar esa sahifaning «boshida» turadi.", alt: "Kodining xabari" },
    ru: { ctx: 'Коди хочет спрятать информацию о странице.', q: 'Куда это нужно записать?', opts: ['Внутрь body', 'Снаружи html', 'Прямо в окно', 'Внутрь head'],
      ok: 'Именно! В head лежит информация о странице, и в окне её не видно.', hint: 'Всё, что видно в окне, живёт в одном месте. А информация лежит в «голове» страницы.', alt: 'Сообщение Коди' },
    en: { ctx: 'Kodi wants to hide information about the page.', q: 'Where should it be written?', opts: ['Inside body', 'Outside html', 'Right in the window', 'Inside head'],
      ok: 'Exactly! head holds information about the page, and it isn’t visible in the window.', hint: 'Everything you see in the window lives in one place. The information sits in the page’s “head”.', alt: 'A message from Kodi' } },
  { id: 'html-01q1t4', target: 'html-01q1', ptype: 'HTML', tag: 'title', correct: 1,
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
  { id: 'html-01q1t5', target: 'html-01q1', ptype: 'HTML', tag: 'title', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const t = T('Kodi sahifasi', 'Страница Коди', 'Kodi page'); const h = T('Salom!', 'Привет!', 'Hello!'); return <WqVis
      code={`<html>\n  <head>\n    <title>${t}\n  </head>\n  <body>\n    ${h}\n  </body>\n</html>`} mark={[3]}
      html={`<html><head><title>${t}\n  </head>\n  <body>\n    ${h}\n  </body>\n</html>`} />; },
    uz: { ctx: "Voy, sahifa bo'm-bo'sh qolibdi, varaqda esa butun kod turibdi!", q: "Kodda nima tushib qolibdi?", opts: ['</body>', '<html>', '<head>', '</title>'],
      ok: "Ana, tuzoq shu yerda ekan! title yopilmagan, shuning uchun brauzer qolgan hamma kodni sahifaning nomi deb o'yladi.", hint: "Brauzer varag'iga qarang: nom qayerda tugashi kerak edi? Qaysi teg ochilgan-u, lekin yopilmagan?", alt: "Bo'sh sahifa va varaqda uzun yozuv" },
    ru: { ctx: 'Ой, страница пустая, а на вкладке — весь код!', q: 'Что потерялось в коде?', opts: ['</body>', '<html>', '<head>', '</title>'],
      ok: 'Вот где ловушка! title не закрыт, поэтому браузер решил, что весь остальной код — это название страницы.', hint: 'Посмотри на вкладку: где должно было кончиться название? Какой тег открыт, но не закрыт?', alt: 'Пустая страница и длинная надпись на вкладке' },
    en: { ctx: 'Oops, the page is empty, and the tab shows all the code!', q: 'What is missing in the code?', opts: ['</body>', '<html>', '<head>', '</title>'],
      ok: 'That’s the trap! title isn’t closed, so the browser thought all the remaining code was the page name.', hint: 'Look at the tab: where should the name have ended? Which tag is opened but never closed?', alt: 'An empty page and a long label on the tab' } }
];
