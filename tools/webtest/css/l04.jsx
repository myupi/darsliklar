// =============================================================================
// ТЕСТЫ К УРОКУ 4 КУРСА CSS «Фон» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: background-color красит фон за элементом, а не буквы; картинка фона — только через url("файл");
// маленькая картинка повторяется плиткой — no-repeat через дефис; cover — на весь фон; картинки нет — виден запасной цвет.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — код и/или честная страница (WqVis);
// файлы фона — из WQ_FILES (yulduz.png, tog.png), другое имя — картинки нет (честно).
// =============================================================================
const SLUG = 'fon';
// Короткая страница: style и теги — один и тот же текст для редактора и для честного браузера.
const c4Mini = (css, body) => `<style>\n${css.split('\n').map((l) => '  ' + l).join('\n')}\n</style>\n${body}`;
const QS = [
  { id: 'css-04t1', target: 'css-04', ptype: 'CSS', tag: 'background-color', correct: 1,
    vis: (L) => { const T = aqL(L); const src = c4Mini('h1 { background-color: yellow; }', `<h1>${T('Futbol klubi', 'Футбольный клуб', 'Football club')}</h1>\n<p>${T('Har shanba o\'yin bor.', 'Игра каждую субботу.', 'A match every Saturday.')}</p>`); return <WqVis code={src} html={src} mark={[2]} />; },
    uz: { ctx: "Kod va uning natijasiga qarang.", q: "background-color nimani bo'yadi?", opts: ['Sarlavha harflarini', 'Sarlavha orqasidagi fonni', 'Butun sahifani', 'Faqat abzasni'],
      ok: "To'ppa-to'g'ri! background-color harflar orqasidagi fonni bo'yaydi. Harflar rangini esa color beradi.", hint: "Sariq rang qayerda ko'rinyapti: harflarning o'zidami yoki ularning orqasidami? Qaysi selektor yozilgan?", alt: "Sariq fonli sarlavha va qoida" },
    ru: { ctx: 'Посмотри на код и на результат.', q: 'Что покрасил background-color?', opts: ['Буквы заголовка', 'Фон за заголовком', 'Всю страницу', 'Только абзац'],
      ok: 'Верно! background-color красит фон за буквами. А цвет самих букв задаёт color.', hint: 'Где виден жёлтый: на самих буквах или за ними? Какой селектор написан?', alt: 'Заголовок с жёлтым фоном и правило' },
    en: { ctx: 'Look at the code and its result.', q: 'What did background-color paint?', opts: ['The heading letters', 'The background behind the heading', 'The whole page', 'Only the paragraph'],
      ok: 'Right! background-color paints the background behind the letters. The letter colour comes from color.', hint: 'Where is the yellow: on the letters themselves or behind them? Which selector is written?', alt: 'A heading with a yellow background and the rule' } },
  { id: 'css-04t2', target: 'css-04', ptype: 'CSS', tag: 'url', correct: 3, mono: true,
    vis: () => <WqVis code={`body {\n  background-image: ___;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Sahifa fonida fon.png rasmi turishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['"fon.png"', 'src="fon.png"', 'url(fon)', 'url("fon.png")'],
      ok: "Qoyil! Fon rasmi url so'zi va qavslar ichida yoziladi, fayl nomi esa to'liq, .png bilan birga.", hint: "src — HTML kodidagi img uchun edi. CSS kodida fayl nomini qaysi so'z va qavslar o'rab turadi? Nom to'liqmi?", alt: "Fon rasmi bo'sh qolgan body qoidasi" },
    ru: { ctx: 'На фоне страницы должна быть картинка fon.png.', q: 'Что пишется на пустое место?', opts: ['"fon.png"', 'src="fon.png"', 'url(fon)', 'url("fon.png")'],
      ok: 'Здорово! Картинка фона пишется внутри слова url и скобок, а имя файла — полностью, вместе с .png.', hint: 'src был для img в HTML. Какое слово со скобками обнимает имя файла в CSS? Имя полное?', alt: 'Правило body с пустой картинкой фона' },
    en: { ctx: 'The picture fon.png should be on the page background.', q: 'What goes in the empty spot?', opts: ['"fon.png"', 'src="fon.png"', 'url(fon)', 'url("fon.png")'],
      ok: 'Nice work! A background picture goes inside the word url and brackets, with the full file name, .png included.', hint: 'src was for img in HTML. Which word with brackets wraps the file name in CSS? Is the name complete?', alt: 'A body rule with an empty background picture' } },
  { id: 'css-04t3', target: 'css-04', ptype: 'CSS', tag: 'no-repeat', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); const src = c4Mini('body {\n  background-image: url("yulduz.png");\n}', `<h1>${T('Tungi osmon', 'Ночное небо', 'Night sky')}</h1>`); return <WqVis code={src} html={src} mark={[3]} />; },
    uz: { ctx: "Voy, yulduzlar kafel kabi takrorlanib ketdi! Yulduz bitta bo'lishi kerak.", q: "Qoidaga qaysi qatorni qo'shamiz?", opts: ['background-repeat: no-repeat;', 'background-repeat: no repeat;', 'background-size: no-repeat;', 'background-repeat: one;'],
      ok: "Juda zo'r! no-repeat chiziqcha bilan yoziladi va background-repeat xususiyatiga beriladi.", hint: "Takrorlanishni qaysi xususiyat boshqaradi? Qiymatdagi ikki so'z o'rtasida nima turadi: bo'sh joymi yoki chiziqchami?", alt: "Takrorlanayotgan yulduzli fon" },
    ru: { ctx: 'Ой, звёзды повторились плиткой! Звезда должна быть одна.', q: 'Какую строку добавим в правило?', opts: ['background-repeat: no-repeat;', 'background-repeat: no repeat;', 'background-size: no-repeat;', 'background-repeat: one;'],
      ok: 'Отлично! no-repeat пишется через дефис и даётся свойству background-repeat.', hint: 'Какое свойство управляет повтором? Что стоит между двумя словами значения: пробел или дефис?', alt: 'Фон со звёздами, повторёнными плиткой' },
    en: { ctx: 'Oops, the stars repeat like tiles! There should be just one star.', q: 'Which line do we add to the rule?', opts: ['background-repeat: no-repeat;', 'background-repeat: no repeat;', 'background-size: no-repeat;', 'background-repeat: one;'],
      ok: 'Great! no-repeat is written with a dash and goes to the background-repeat property.', hint: 'Which property controls repeating? What goes between the two words of the value: a space or a dash?', alt: 'A background with stars repeated like tiles' } },
  { id: 'css-04t4', target: 'css-04', ptype: 'CSS', tag: 'cover', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`body {\n  background-image: url("tog.png");\n  background-repeat: no-repeat;\n  background-size: ___;\n}`} file="style.css" mark={[4]} />; },
    uz: { ctx: "Tog' rasmi bitta, lekin yon tomoni va pasti bo'sh qolyapti. U butun fonni egallashi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['repeat', 'full', 'cover', 'no-repeat'],
      ok: "Xuddi shunday! cover rasmni kattalashtirib, butun fonni qoplaydi.", hint: "Rasmning o'lchamini qaysi xususiyat beradi? Darsda «butun fonni yopib qo'y» degan so'z qanday edi?", alt: "Fon o'lchami bo'sh qolgan body qoidasi" },
    ru: { ctx: 'Картинка гор одна, но сбоку и снизу пусто. Она должна занять весь фон.', q: 'Что пишется на пустое место?', opts: ['repeat', 'full', 'cover', 'no-repeat'],
      ok: 'Именно! cover увеличивает картинку, и она закрывает весь фон.', hint: 'Это свойство размера картинки. Каким словом в уроке мы «накрывали» весь фон?', alt: 'Правило body с пустым размером фона' },
    en: { ctx: 'There is one mountain picture, but the side and bottom are empty. It should fill the whole background.', q: 'What goes in the empty spot?', opts: ['repeat', 'full', 'cover', 'no-repeat'],
      ok: 'Exactly! cover enlarges the picture so it covers the whole background.', hint: 'This property sets the picture size. Which word in the lesson “covered” the whole background?', alt: 'A body rule with an empty background size' } },
  { id: 'css-04t5', target: 'css-04', ptype: 'CSS', tag: 'zaxira', correct: 2,
    vis: (L) => { const T = aqL(L); const src = c4Mini('body {\n  background-image: url("tog.jpg");\n  background-color: green;\n}', `<h1>${T('Tog\'lar', 'Горы', 'Mountains')}</h1>`); return <WqVis code={src} html={src} mark={[3]} />; },
    uz: { ctx: "Papkada tog.png bor, lekin sahifada faqat yashil rang.", q: "Nega shunday bo'ldi?", opts: ['background-color rasmni yopdi', "Rasm faqat h1 tegida ishlaydi", "Fayl nomi boshqa, rasm topilmadi", "url so'zi ortiqcha"],
      ok: "To'ppa-to'g'ri! Kodda tog.jpg, papkada esa tog.png. Rasm topilmasa, brauzer zaxira rangni ko'rsatadi: uni background-color beradi.", hint: "Kodda yozilgan fayl nomini papkadagi nom bilan harfma-harf solishtiring. Oxiriga qarang.", alt: "Yashil fonli sahifa va qoida" },
    ru: { ctx: 'В папке есть tog.png, а на странице только зелёный.', q: 'Почему так вышло?', opts: ['background-color закрыл картинку', 'Картинка работает только у h1', 'Имя файла другое, картинки нет', 'Слово url лишнее'],
      ok: 'Верно! В коде tog.jpg, а в папке tog.png. Если картинки нет, браузер показывает запасной цвет — background-color.', hint: 'Сравни имя файла в коде с именем в папке буква в букву. Посмотри на конец.', alt: 'Страница с зелёным фоном и правило' },
    en: { ctx: 'The folder has tog.png, but the page is just green.', q: 'Why did that happen?', opts: ['background-color hid the picture', 'Pictures only work on h1', 'Wrong file name, so no picture', 'The word url is extra'],
      ok: 'Right! The code says tog.jpg, but the folder has tog.png. With no picture, the browser shows the backup colour — background-color.', hint: 'Compare the file name in the code with the one in the folder, letter by letter. Look at the end.', alt: 'A page with a green background and the rule' } }
];
