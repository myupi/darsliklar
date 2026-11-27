// =============================================================================
// ТЕСТЫ К УРОКУ 3 КУРСА HTML (сквозной номер; старый урок 2, часть 1) «Sarlavhalar va abzaslar» / «Заголовки и абзацы» (27.11.2026) —
// 5 вопросов, по файлу на вопрос. Темы части: h1–h6 (чем больше цифра, тем мельче; h1 — главный, h2 — разделы), закрывающий тег
// с косой чертой, абзац p (перенос строки в коде абзаца не делает; абзац делает только p). Жирного и наклонного текста здесь ещё нет.
// Прежние вопросы 02t1 (h2 крупнее всех), 02t2 (один p на двух строках), 02t5 (нет «/» в </h1>) + новые 2 (роли h1/h2, что делает абзац).
// Словарь урока: sarlavha, abzas. Апостроф — только ASCII «'». Верные ответы: C, B, A, C, D.
// =============================================================================
const SLUG = 'zagolovki-i-tekst';
const QS = [
  { id: 'html-02q1t1', target: 'html-02q1', ptype: 'HTML', tag: 'h1-h6', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<body>\n  <h4>${T('Futbol', 'Футбол', 'Football')}</h4>\n  <h2>${T('Shaxmat', 'Шахматы', 'Chess')}</h2>\n  <h6>${T('Suzish', 'Плавание', 'Swimming')}</h6>\n</body>`} />; },
    uz: { ctx: "Kodda uchta sarlavha bor.", q: "Brauzerda qaysi sarlavha eng katta chiqadi?", opts: ['h6', 'h4', 'h2', 'Uchalasi bir xil'],
      ok: "To'ppa-to'g'ri! Raqam qancha kichik bo'lsa, sarlavha shuncha katta bo'ladi. Bu yerda eng kichik raqam h2 tegida.", hint: "Esingizdami: h1 eng katta, h6 eng kichkina. Raqam kattalashgani sari sarlavha nima bo'ladi?", alt: "Uchta sarlavhali kod" },
    ru: { ctx: 'В коде три заголовка.', q: 'Какой заголовок в браузере будет самым крупным?', opts: ['h6', 'h4', 'h2', 'Все три одинаковые'],
      ok: 'Верно! Чем меньше цифра, тем крупнее заголовок. Здесь самая маленькая цифра у h2.', hint: 'Помнишь: h1 самый крупный, h6 самый мелкий. Что происходит с заголовком, когда цифра растёт?', alt: 'Код с тремя заголовками' },
    en: { ctx: 'The code has three headings.', q: 'Which heading will be the biggest in the browser?', opts: ['h6', 'h4', 'h2', 'All three are the same'],
      ok: 'Right! The smaller the number, the bigger the heading. Here h2 has the smallest number.', hint: 'Remember: h1 is the biggest, h6 is the smallest. What happens to a heading as the number grows?', alt: 'Code with three headings' } },
  { id: 'html-02q1t2', target: 'html-02q1', ptype: 'HTML', tag: 'h1-h2', correct: 1,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Друг' : L === 'en' ? 'Friend' : "Do'stim"} text={L === 'ru' ? '«Мне на странице нужен самый крупный главный заголовок, а под ним заголовки разделов — помельче».' : L === 'en' ? '“My page needs one biggest main heading, and under it section headings that are a bit smaller.”' : "«Sahifamda hammadan katta bosh sarlavha kerak, uning ostida esa bo'limlar sarlavhalari — ular kichikroq bo'lsin»."} />,
    uz: { ctx: "Do'stingiz sahifa yozmoqda.", q: "Do'stingiz qaysi teglarni tanlashi kerak?", opts: ["Bosh sarlavhaga ham, bo'limlarga ham h1", "Bosh sarlavhaga h1, bo'limlarga h2", "Bosh sarlavhaga h2, bo'limlarga h1", "Bosh sarlavhaga h6, bo'limlarga h1"],
      ok: "Aynan shu! Bosh sarlavha bitta bo'ladi va u h1. Bo'limlar sarlavhasi uchun esa h2 ishlatiladi.", hint: "Esingizdami: sahifada h1 bitta bo'ladi. U qaysi sarlavha uchun? Qolganlari-chi?", alt: "Do'stning sarlavhalar haqidagi xabari" },
    ru: { ctx: 'Друг делает страницу.', q: 'Какие теги ему выбрать?', opts: ['И главному, и разделам h1', 'Главному h1, разделам h2', 'Главному h2, разделам h1', 'Главному h6, разделам h1'],
      ok: 'Именно так! Главный заголовок один, и это h1. Для разделов берут h2.', hint: 'Помнишь: h1 на странице один. Для какого заголовка он? А для остальных?', alt: 'Сообщение друга про заголовки' },
    en: { ctx: 'A friend is building a page.', q: 'Which tags should they pick?', opts: ['h1 for both main and sections', 'h1 for main, h2 for sections', 'h2 for main, h1 for sections', 'h6 for main, h1 for sections'],
      ok: 'Exactly! There is one main heading, and it is h1. Sections get h2.', hint: 'Remember: a page has one h1. Which heading is it for? And the rest?', alt: 'A friend’s message about headings' } },
  { id: 'html-02q1t3', target: 'html-02q1', ptype: 'HTML', tag: 'p', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<body>\n  <p>${T("Mushuklar uxlashni yaxshi ko'radi.", 'Кошки любят спать.', 'Cats love to sleep.')}\n  ${T('Ular kuniga 16 soat uxlaydi.', 'Они спят 16 часов в день.', 'They sleep 16 hours a day.')}</p>\n</body>`} mark={[2, 3]} />; },
    uz: { ctx: "Matn kodda ikki qatorga yozilgan.", q: "Brauzerda nechta abzas chiqadi?", opts: ['Bitta', 'Ikkita', 'Uchta', 'Birorta ham chiqmaydi'],
      ok: "Qoyil! Kodda yangi qatorga o'tish hali yangi abzas boshlandi degani emas. Abzasni faqat p tegi qila oladi, bu yerda esa p bitta.", hint: "Nechta <p> tegi ochilyapti? Brauzer kod qatorlarini bir-biriga yopishtirib o'qiydi.", alt: "Bitta p tegi ikki qatorga yozilgan kod" },
    ru: { ctx: 'Текст в коде написан в две строки.', q: 'Сколько абзацев покажет браузер?', opts: ['Один', 'Два', 'Три', 'Ни одного'],
      ok: 'Здорово! Новая строка в коде — ещё не новый абзац. Абзац делает только тег p, а он здесь один.', hint: 'Сколько тегов <p> открывается? Браузер склеивает строки кода.', alt: 'Код: один тег p на двух строках' },
    en: { ctx: 'The text is written on two lines of code.', q: 'How many paragraphs will the browser show?', opts: ['One', 'Two', 'Three', 'None'],
      ok: 'Nice work! A new line in the code isn’t a new paragraph. Only the p tag makes a paragraph, and there is just one here.', hint: 'How many <p> tags are opened? The browser glues lines of code together.', alt: 'Code: one p tag on two lines' } },
  { id: 'html-02q1t4', target: 'html-02q1', ptype: 'HTML', tag: 'yopuvchi', correct: 2,
    vis: (L) => { const T = aqL(L); const h = T('Mening itim', 'Моя собака', 'My dog'); const p = T("Uning ismi Reks.", 'Её зовут Рекс.', 'His name is Rex.'); return <WqVis code={`<body>\n  <h1>${h}<h1>\n  <p>${p}</p>\n</body>`} html={`<h1>${h}<h1>\n<p>${p}</p>`} />; },
    uz: { ctx: "Abzas ham sarlavhadek katta bo'lib qolibdi.", q: "Qaysi qatorda tuzoq bor?", opts: ['1-qatorda', '3-qatorda', '2-qatorda', '4-qatorda'],
      ok: "To'ppa-to'g'ri! 2-qatorda yopuvchi tegda qiya chiziq tushib qolibdi: <h1> ikkinchi marta ochilib qoldi.", hint: "Har bir yopuvchi tegda qiya chiziq bo'lishi kerak. Qaysi qatorda u yo'q ekan?", alt: "Sarlavha ham, abzas ham katta chiqqan sahifa" },
    ru: { ctx: 'Абзац тоже стал большим, как заголовок.', q: 'В какой строке ловушка?', opts: ['В строке 1', 'В строке 3', 'В строке 2', 'В строке 4'],
      ok: 'Верно! В строке 2 у закрывающего тега нет косой черты: <h1> открылся второй раз.', hint: 'У каждого закрывающего тега должна быть косая черта. В какой строке её нет?', alt: 'Страница, где и заголовок, и абзац крупные' },
    en: { ctx: 'The paragraph turned big, like a heading.', q: 'Which line has the trap?', opts: ['Line 1', 'Line 3', 'Line 2', 'Line 4'],
      ok: 'Right! On line 2 the closing tag has no slash: <h1> opened a second time.', hint: 'Every closing tag needs a slash. Which line is missing it?', alt: 'A page where both the heading and the paragraph are big' } },
  { id: 'html-02q1t5', target: 'html-02q1', ptype: 'HTML', tag: 'p', correct: 3,
    vis: (L) => { const T = aqL(L); const a = T("Mening mushugim kun bo'yi uxlaydi.", 'Мой кот спит весь день.', 'My cat sleeps all day.'); const b = T("Kechqurun esa o'ynaydi.", 'Вечером он играет.', 'In the evening he plays.'); return <WqVis code={`<body>\n  ${a}\n  ${b}\n</body>`} mark={[2, 3]} html={`${a}\n${b}`} />; },
    uz: { ctx: "Brauzerda ikkala gap bir abzasga yopishib qolgan.", q: "Har bir gap abzas bo'lishi uchun nima qilamiz?", opts: ["Orasiga bo'sh qator qo'yamiz", "Har bir gapni h1 ichiga olamiz", "Orasiga ko'p probel qo'yamiz", "Har bir gapni p ichiga olamiz"],
      ok: "Mana shu! Abzasni faqat p tegi qiladi. Har bir gap o'z p tegiga tushsa, alohida abzas bo'ladi.", hint: "Brauzer kodda qator tashlanishini ham, bo'sh qatorni ham sezmaydi. Abzasni yaratish uchun qaysi teg bor edi?", alt: "Teglarsiz yozilgan uchta gap" },
    ru: { ctx: 'Предложения слиплись в один кусок.', q: 'Как сделать каждое предложение абзацем?', opts: ['Поставить пустую строку', 'Взять каждое в тег h1', 'Добавить много пробелов', 'Взять каждое в тег p'],
      ok: 'Вот так! Абзац делает только тег p. Каждое предложение в своём p становится отдельным абзацем.', hint: 'Браузер не замечает ни переносов строк, ни пустых строк в коде. Какой тег создаёт абзац?', alt: 'Три предложения без тегов' },
    en: { ctx: 'The sentences are stuck together.', q: 'How do we make each sentence a paragraph?', opts: ['Add a blank line between', 'Wrap each in an h1 tag', 'Add many spaces between', 'Wrap each in a p tag'],
      ok: 'That’s it! Only the p tag makes a paragraph. Each sentence in its own p becomes a separate paragraph.', hint: 'The browser notices neither line breaks nor blank lines in code. Which tag creates a paragraph?', alt: 'Three sentences without tags' } }
];
