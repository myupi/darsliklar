// =============================================================================
// ТЕСТЫ К УРОКУ 2 КУРСА HTML «Заголовки и текст» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: цифра больше — заголовок меньше; перенос строки в коде абзаца не делает; забытый </b> делает жирным
// всё дальше; b — жирный, i — наклонный; закрывающий тег без «/» ломает страницу.
// Словарь урока 2: sarlavha, abzas, qalin, qiya. Апостроф — только ASCII «'». Верные ответы — на разных местах.
// =============================================================================
const SLUG = 'zagolovki-i-tekst';
const QS = [
  { id: 'html-02t1', target: 'html-02', ptype: 'HTML', tag: 'h1-h6', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<body>\n  <h4>${T('Futbol', 'Футбол', 'Football')}</h4>\n  <h2>${T('Shaxmat', 'Шахматы', 'Chess')}</h2>\n  <h6>${T('Suzish', 'Плавание', 'Swimming')}</h6>\n</body>`} />; },
    uz: { ctx: "Kodda uchta sarlavha bor.", q: "Brauzerda qaysi sarlavha eng katta chiqadi?", opts: ['h6', 'h4', 'h2', 'Uchalasi bir xil'],
      ok: "To'ppa-to'g'ri! Raqam qancha kichik bo'lsa, sarlavha shuncha katta bo'ladi. Bu yerda eng kichik raqam h2 tegida.", hint: "Esingizdami: h1 eng katta, h6 eng kichkina. Raqam kattalashgani sari sarlavha nima bo'ladi?", alt: "Uchta sarlavhali kod" },
    ru: { ctx: 'В коде три заголовка.', q: 'Какой заголовок в браузере будет самым крупным?', opts: ['h6', 'h4', 'h2', 'Все три одинаковые'],
      ok: 'Верно! Чем меньше цифра, тем крупнее заголовок. Здесь самая маленькая цифра у h2.', hint: 'Помнишь: h1 самый крупный, h6 самый мелкий. Что происходит с заголовком, когда цифра растёт?', alt: 'Код с тремя заголовками' },
    en: { ctx: 'The code has three headings.', q: 'Which heading will be the biggest in the browser?', opts: ['h6', 'h4', 'h2', 'All three are the same'],
      ok: 'Right! The smaller the number, the bigger the heading. Here h2 has the smallest number.', hint: 'Remember: h1 is the biggest, h6 is the smallest. What happens to a heading as the number grows?', alt: 'Code with three headings' } },
  { id: 'html-02t2', target: 'html-02', ptype: 'HTML', tag: 'p', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<body>\n  <p>${T("Mushuklar uxlashni yaxshi ko'radi.", 'Кошки любят спать.', 'Cats love to sleep.')}\n  ${T('Ular kuniga 16 soat uxlaydi.', 'Они спят 16 часов в день.', 'They sleep 16 hours a day.')}</p>\n</body>`} mark={[2, 3]} />; },
    uz: { ctx: "Matn kodda ikki qatorga yozilgan.", q: "Brauzerda nechta abzas chiqadi?", opts: ['Bitta', 'Ikkita', 'Uchta', 'Birorta ham chiqmaydi'],
      ok: "Qoyil! Kodda yangi qatorga o'tish hali yangi abzas boshlandi degani emas. Abzasni faqat p tegi qila oladi, bu yerda esa p bitta.", hint: "Nechta <p> tegi ochilyapti? Brauzer kod qatorlarini bir-biriga yopishtirib o'qiydi.", alt: "Bitta p tegi ikki qatorga yozilgan kod" },
    ru: { ctx: 'Текст в коде написан в две строки.', q: 'Сколько абзацев покажет браузер?', opts: ['Один', 'Два', 'Три', 'Ни одного'],
      ok: 'Здорово! Новая строка в коде — ещё не новый абзац. Абзац делает только тег p, а он здесь один.', hint: 'Сколько тегов <p> открывается? Браузер склеивает строки кода.', alt: 'Код: один тег p на двух строках' },
    en: { ctx: 'The text is written on two lines of code.', q: 'How many paragraphs will the browser show?', opts: ['One', 'Two', 'Three', 'None'],
      ok: 'Nice work! A new line in the code isn’t a new paragraph. Only the p tag makes a paragraph, and there is just one here.', hint: 'How many <p> tags are opened? The browser glues lines of code together.', alt: 'Code: one p tag on two lines' } },
  { id: 'html-02t3', target: 'html-02', ptype: 'HTML', tag: 'b', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const a = `<p>${T('Bugun havo <b>issiq.', 'Сегодня <b>жарко.', 'Today it is <b>hot.')}</p>`; const b = `<p>${T('Biz parkka boramiz.', 'Мы идём в парк.', 'We are going to the park.')}</p>`; return <WqVis code={`<body>\n  ${a}\n  ${b}\n</body>`} mark={[2]} html={`${a}\n${b}`} />; },
    uz: { ctx: "Voy, ikkinchi abzas ham qalin bo'lib qolibdi!", q: "Kodda nima tushib qolibdi?", opts: ['</p>', '<p>', '<i>', '</b>'],
      ok: "Xuddi shunday! b tegi yopilmagan, shuning uchun brauzer keyingi hamma matnni qalin qilib ketdi.", hint: "Qalinlik qayerdan boshlanyapti-yu, qayerda tugashi kerak edi? Qaysi teg ochilgan, lekin yopilmagan?", alt: "Ikki abzasi ham qalin sahifa" },
    ru: { ctx: 'Ой, второй абзац тоже стал жирным!', q: 'Что потерялось в коде?', opts: ['</p>', '<p>', '<i>', '</b>'],
      ok: 'Именно! Тег b не закрыт, поэтому браузер сделал жирным весь текст дальше.', hint: 'Где жирный начинается и где должен был закончиться? Какой тег открыт, но не закрыт?', alt: 'Страница, где оба абзаца жирные' },
    en: { ctx: 'Oops, the second paragraph turned bold too!', q: 'What is missing in the code?', opts: ['</p>', '<p>', '<i>', '</b>'],
      ok: 'Exactly! The b tag isn’t closed, so the browser made all the following text bold.', hint: 'Where does the bold start, and where should it have ended? Which tag is opened but not closed?', alt: 'A page where both paragraphs are bold' } },
  { id: 'html-02t4', target: 'html-02', ptype: 'HTML', tag: 'i', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const s = T('Bugun juda', 'Сегодня очень', 'It is very'); const w = T('issiq', 'жарко', 'hot'); return <WqVis code={`<p>${s} <___>${w}</___>!</p>`} html={`<p>${s} <i>${w}</i>!</p>`} />; },
    uz: { ctx: "Brauzerda bitta so'z qiya bo'lib chiqdi.", q: "Bo'sh joylarga qaysi teg yozilgan?", opts: ['b', 'i', 'p', 'h1'],
      ok: "Juda zo'r! i tegi italic so'zidan olingan, ya'ni qiya degani. b esa so'zni qalin qiladi.", hint: "So'z qalinmi yoki qiyshaygan? Qaysi teg harflarni qiya qiladi?", alt: "Bitta so'zi qiya abzas" },
    ru: { ctx: 'В браузере одно слово стало наклонным.', q: 'Какой тег написан на пустых местах?', opts: ['b', 'i', 'p', 'h1'],
      ok: 'Отлично! Тег i — от слова italic, то есть курсив. А b делает слово жирным.', hint: 'Слово жирное или наклонное? Какой тег наклоняет буквы?', alt: 'Абзац с одним наклонным словом' },
    en: { ctx: 'In the browser one word turned slanted.', q: 'Which tag is written in the empty spots?', opts: ['b', 'i', 'p', 'h1'],
      ok: 'Great! The i tag comes from italic, meaning slanted. And b makes a word bold.', hint: 'Is the word bold or slanted? Which tag slants the letters?', alt: 'A paragraph with one slanted word' } },
  { id: 'html-02t5', target: 'html-02', ptype: 'HTML', tag: 'yopuvchi', correct: 2,
    vis: (L) => { const T = aqL(L); const h = T('Mening itim', 'Моя собака', 'My dog'); const p = T("Uning ismi Reks.", 'Её зовут Рекс.', 'His name is Rex.'); return <WqVis code={`<body>\n  <h1>${h}<h1>\n  <p>${p}</p>\n</body>`} html={`<h1>${h}<h1>\n<p>${p}</p>`} />; },
    uz: { ctx: "Abzas ham sarlavhadek katta bo'lib qolibdi.", q: "Qaysi qatorda tuzoq bor?", opts: ['1-qatorda', '3-qatorda', '2-qatorda', '4-qatorda'],
      ok: "To'ppa-to'g'ri! 2-qatorda yopuvchi tegda qiya chiziq tushib qolibdi: <h1> ikkinchi marta ochilib qoldi.", hint: "Har bir yopuvchi tegda qiya chiziq bo'lishi kerak. Qaysi qatorda u yo'q ekan?", alt: "Sarlavha ham, abzas ham katta chiqqan sahifa" },
    ru: { ctx: 'Абзац тоже стал большим, как заголовок.', q: 'В какой строке ловушка?', opts: ['В строке 1', 'В строке 3', 'В строке 2', 'В строке 4'],
      ok: 'Верно! В строке 2 у закрывающего тега нет косой черты: <h1> открылся второй раз.', hint: 'У каждого закрывающего тега должна быть косая черта. В какой строке её нет?', alt: 'Страница, где и заголовок, и абзац крупные' },
    en: { ctx: 'The paragraph turned big, like a heading.', q: 'Which line has the trap?', opts: ['Line 1', 'Line 3', 'Line 2', 'Line 4'],
      ok: 'Right! On line 2 the closing tag has no slash: <h1> opened a second time.', hint: 'Every closing tag needs a slash. Which line is missing it?', alt: 'A page where both the heading and the paragraph are big' } }
];
