// =============================================================================
// ТЕСТЫ К УРОКУ 2 «Тело страницы: body» (часть 2 урока «Структура HTML-документа», 27.11.2026) — 5 вопросов.
// Тема части: body, порядок документа. Вопросы 1 (пустое место body) и 4 (строка для видимого текста) — прежние
// из l01.jsx, 2, 3 и 5 (DOCTYPE) — новые. Верные ответы: C, B, D, B, A. Апостроф — только ASCII «'».
// =============================================================================
const SLUG = 'struktura-dokumenta';
const QS = [
  { id: 'html-01q2t1', target: 'html-01q2', ptype: 'HTML', tag: 'body', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n  </head>\n  ___\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`} mark={[5]} />; },
    uz: { ctx: "Bitta qator tushib qolibdi.", q: "Bo'sh joyga qaysi teg yoziladi?", opts: ['</head>', '<title>', '<body>', '<html>'],
      ok: "Xuddi shunday! head yopildi, endi body ochiladi: sahifada ko'rinadigan hamma narsa shu yerda yashaydi.", hint: "Pastda </body> turibdi. U yopuvchi teg, demak tepada uning ochuvchi tegi bo'lishi kerak.", alt: "Bitta qatori bo'sh kod" },
    ru: { ctx: 'Одна строка потерялась.', q: 'Какой тег пишется на пустое место?', opts: ['</head>', '<title>', '<body>', '<html>'],
      ok: 'Именно! head закрыт, теперь открывается body: всё, что видно на странице, живёт здесь.', hint: 'Ниже стоит </body>. Это закрывающий тег, значит, выше нужен его открывающий.', alt: 'Код с пустой строкой' },
    en: { ctx: 'One line has gone missing.', q: 'Which tag goes in the empty spot?', opts: ['</head>', '<title>', '<body>', '<html>'],
      ok: 'Exactly! head is closed, now body opens: everything you see on the page lives here.', hint: 'Below there is </body>. It is a closing tag, so its opening tag must be above.', alt: 'Code with an empty line' } },
  { id: 'html-01q2t2', target: 'html-01q2', ptype: 'HTML', tag: 'body', correct: 1,
    vis: (L) => { const T = aqL(L); const t = T('Robotlar', 'Роботы', 'Robots'); const h = T('Salom!', 'Привет!', 'Hello!'); return <WqVis
      code={`<html>\n  <head>\n    <title>${t}</title>\n  </head>\n  <body>\n    ${h}\n  </body>\n</html>`}
      mark={[3, 6]}
      html={`<html><head><title>${t}</title></head><body>${h}</body></html>`} />; },
    uz: { ctx: "Kod va uning natijasiga qarang.", q: "«Salom!» matni qayerda ko'rinadi?", opts: ["Faqat brauzer varag'ida", 'Sahifaning oynasida', 'Ham varaqda, ham oynada', "Hech qayerda ko'rinmaydi"],
      ok: "To'ppa-to'g'ri! Matn body ichida turibdi, body ichidagi hamma narsa esa oynada chiqadi.", hint: "«Salom!» qaysi ikki teg o'rtasida turibdi? Shu tegdagi matn qayerda chiqishini eslang.", alt: "Kod va brauzer oynasi" },
    ru: { ctx: 'Посмотри на код и на результат.', q: 'Где виден текст «Привет!»?', opts: ['Только на вкладке браузера', 'В окне страницы', 'И на вкладке, и в окне', 'Нигде не виден'],
      ok: 'Верно! Текст лежит в body, а всё, что в body, показывается в окне.', hint: 'Между какими двумя тегами стоит «Привет!»? Вспомни, где показывается текст из этого тега.', alt: 'Код и окно браузера' },
    en: { ctx: 'Look at the code and its result.', q: 'Where is the text “Hello!” visible?', opts: ['Only on the browser tab', 'In the page window', 'On the tab and in the window', 'Nowhere'],
      ok: 'Right! The text is in body, and everything in body shows up in the window.', hint: 'Which two tags is “Hello!” between? Remember where text from that tag shows up.', alt: 'Code and a browser window' } },
  { id: 'html-01q2t3', target: 'html-01q2', ptype: 'HTML', tag: 'body', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n  </head>\n  <body>\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`} mark={[4, 5]} />; },
    uz: { ctx: "Belgilangan qatorlarga qarang: ular qanday turibdi?", q: "head va body bir-biriga nisbatan qanday turadi?", opts: ['body head ichida turadi', 'head body ichida turadi', 'Ikkalasi html dan tashqarida', 'head va body ketma-ket'],
      ok: "Qoyil! Oldin head yopiladi, keyin body ochiladi: ular bir-birining ichida emas, birin-ketin turadi.", hint: "head qaysi qatorda yopilyapti va body qaysi qatorda ochilyapti? Qaysi biri oldin keladi?", alt: "Ikkita qatori ajratilgan kod" },
    ru: { ctx: 'Посмотри на выделенные строки: как они стоят?', q: 'Как head и body стоят друг относительно друга?', opts: ['body стоит внутри head', 'head стоит внутри body', 'Оба снаружи html', 'head и body друг за другом'],
      ok: 'Здорово! Сначала head закрывается, потом открывается body: они не внутри друг друга, а идут по очереди.', hint: 'В какой строке закрывается head и в какой открывается body? Что идёт раньше?', alt: 'Код с двумя выделенными строками' },
    en: { ctx: 'Look at the highlighted lines: how are they placed?', q: 'How are head and body placed relative to each other?', opts: ['body is inside head', 'head is inside body', 'Both are outside html', 'head and body one after another'],
      ok: 'Nice work! head closes first, then body opens: they aren’t inside each other, they go one after another.', hint: 'On which line does head close and on which does body open? Which comes first?', alt: 'Code with two highlighted lines' } },
  { id: 'html-01q2t4', target: 'html-01q2', ptype: 'HTML', tag: 'body', correct: 1,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n\n  </head>\n  <body>\n\n  </body>\n</html>\n`} mark={[4, 7]} />; },
    uz: { ctx: "Kodi «Mening sahifam» degan matnni qo'shmoqchi. U sahifada ko'rinishi kerak.", q: "Uni qaysi qatorga yozamiz?", opts: ['4-qatorga', '7-qatorga', '1-qatorga', '9-qatordan keyin'],
      ok: "To'ppa-to'g'ri! Sahifada ko'rinadigan hamma narsa body ichida yashaydi, 7-qator esa aynan body ichida.", hint: "Sahifada ko'rinadigan matn qaysi tegning ichida turadi: head yoki body? O'sha teg qaysi qatorlarda?", alt: "Ikkita bo'sh qatori bor kod" },
    ru: { ctx: 'Коди хочет добавить текст «Моя страница». Его должно быть видно на странице.', q: 'В какую строку его написать?', opts: ['В строку 4', 'В строку 7', 'В строку 1', 'После строки 9'],
      ok: 'Верно! Всё, что видно на странице, живёт внутри body, а строка 7 как раз внутри body.', hint: 'Внутри какого тега живёт видимый текст: head или body? В каких он строках?', alt: 'Код с двумя пустыми строками' },
    en: { ctx: 'Kodi wants to add the text “My page”. It must be visible on the page.', q: 'Which line should it go on?', opts: ['Line 4', 'Line 7', 'Line 1', 'After line 9'],
      ok: 'Right! Everything you see on the page lives inside body, and line 7 is right inside body.', hint: 'Inside which tag does visible text live: head or body? Which lines is it on?', alt: 'Code with two empty lines' } },
  { id: 'html-01q2t5', target: 'html-01q2', ptype: 'HTML', tag: 'html', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<!DOCTYPE html>\n<html>\n  <head>\n    <title>${T('Kodi', 'Коди', 'Kodi')}</title>\n  </head>\n  <body>\n    ${T('Salom!', 'Привет!', 'Hello!')}\n  </body>\n</html>`} mark={[1]} />; },
    uz: { ctx: "Birinchi qator — <!DOCTYPE html>.", q: "Bu qatorni yopish kerakmi?", opts: ["Yo'q, uning jufti yo'q", "Ha, oxirida </!DOCTYPE> yoziladi", 'Ha, html tegi bilan birga yopiladi', "Ha, uni body yopib qo'yadi"],
      ok: "Xuddi shunday! U brauzerga «Bu HTML sahifa» deydi, uning yopuvchi jufti yo'q, shuning uchun yopish shart emas.", hint: "Ochuvchi va yopuvchi teg juft bo'ladi. Bu qatorning juftini kodda ko'ryapsizmi?", alt: "Birinchi qatori ajratilgan kod" },
    ru: { ctx: 'Первая строка — <!DOCTYPE html>.', q: 'Нужно ли закрывать эту строку?', opts: ['Нет, у неё нет пары', 'Да, в конце пишут </!DOCTYPE>', 'Да, она закрывается вместе с html', 'Да, её закрывает body'],
      ok: 'Именно! Она говорит браузеру «Это HTML-страница», закрывающей пары у неё нет, поэтому закрывать не нужно.', hint: 'Открывающий и закрывающий теги идут парой. Видишь в коде пару для этой строки?', alt: 'Код с выделенной первой строкой' },
    en: { ctx: 'The first line is <!DOCTYPE html>.', q: 'Does this line need to be closed?', opts: ['No, it has no pair', 'Yes, </!DOCTYPE> goes at the end', 'Yes, it closes together with html', 'Yes, body closes it'],
      ok: 'Exactly! It tells the browser “This is an HTML page”, it has no closing pair, so there is nothing to close.', hint: 'An opening and a closing tag come as a pair. Can you see a pair for this line in the code?', alt: 'Code with the first line highlighted' } }
];
