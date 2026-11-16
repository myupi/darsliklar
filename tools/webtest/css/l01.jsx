// =============================================================================
// ТЕСТЫ К УРОКУ 1 КУРСА CSS «Что такое CSS и как он меняет сайт» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: CSS живёт в теге style; части правила (селектор, свойство, значение); селектор решает, что красится;
// «=» вместо «:» ломает правило; без «;» между свойствами не работает ни одно.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — код и/или честная страница (WqVis).
// =============================================================================
const SLUG = 'chto-takoe-css';
// Страница урока: style в head и тело — один и тот же текст для редактора и для честного браузера.
const c1Src = (css, body) => `<head>\n  <style>\n${css.split('\n').map((l) => '    ' + l).join('\n')}\n  </style>\n</head>\n<body>\n${body.split('\n').map((l) => '  ' + l).join('\n')}\n</body>`;
const QS = [
  { id: 'css-01t1', target: 'css-01', ptype: 'CSS', tag: 'style', correct: 2, mono: true,
    vis: () => <WqVis code={`<head>\n  <title>Kodi</title>\n  <___>\n    h1 { color: orange; }\n  </___>\n</head>`} mark={[3, 5]} />,
    uz: { ctx: "CSS qoidasi qaysidir teg ichida turishi kerak.", q: "Bo'sh joyga qaysi teg yoziladi?", opts: ['title', 'body', 'style', 'p'],
      ok: "To'ppa-to'g'ri! CSS qoidalari head ichidagi style tegida yashaydi.", hint: "Darsda qoida head ichida yangi teg bilan paydo bo'lgan edi. Esingizdami? title emas: u varaq nomini beradi.", alt: "Teg nomi bo'sh qolgan kod" },
    ru: { ctx: 'Правило CSS должно стоять внутри какого-то тега.', q: 'Какой тег пишется на пустое место?', opts: ['title', 'body', 'style', 'p'],
      ok: 'Верно! Правила CSS живут в теге style внутри head.', hint: 'В уроке правило появилось в head внутри нового тега. Помнишь какого? Не title: он даёт имя вкладке.', alt: 'Код с пустым именем тега' },
    en: { ctx: 'A CSS rule has to sit inside some tag.', q: 'Which tag goes in the empty spot?', opts: ['title', 'body', 'style', 'p'],
      ok: 'Right! CSS rules live in the style tag inside head.', hint: 'In the lesson the rule appeared in head inside a new tag. Remember which? Not title: it names the tab.', alt: 'Code with an empty tag name' } },
  { id: 'css-01t2', target: 'css-01', ptype: 'CSS', tag: 'qism', correct: 1,
    vis: () => <WqVis code={`p {\n  color: green;\n}`} file="style.css" mark={[2]} />,
    uz: { ctx: "Qoidaning ajratilgan qatoriga qarang.", q: "Bu qoidada color nima?", opts: ['Selektor', 'Xususiyat', 'Qiymat', 'Teg'],
      ok: "Qoyil! color — xususiyat: u nimani o'zgartirishni aytadi. green esa uning qiymati.", hint: "Ikki nuqtadan oldin nima turadi va keyin nima? Chapdagisi — nimani o'zgartiramiz, o'ngdagisi — qanday qilib.", alt: "p uchun yashil rang qoidasi" },
    ru: { ctx: 'Посмотри на выделенную строку правила.', q: 'Что такое color в этом правиле?', opts: ['Селектор', 'Свойство', 'Значение', 'Тег'],
      ok: 'Здорово! color — свойство: оно говорит, что меняем. А green — его значение.', hint: 'Что стоит до двоеточия, а что после? Слева — что меняем, справа — каким сделать.', alt: 'Правило зелёного цвета для p' },
    en: { ctx: 'Look at the highlighted line of the rule.', q: 'What is color in this rule?', opts: ['A selector', 'A property', 'A value', 'A tag'],
      ok: 'Nice work! color is the property: it says what to change. And green is its value.', hint: 'What stands before the colon and what after it? Left — what we change, right — what it becomes.', alt: 'A green colour rule for p' } },
  { id: 'css-01t3', target: 'css-01', ptype: 'CSS', tag: 'selektor', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={c1Src('___ { color: purple; }', `<h1>${T('Kodi kafesi', 'Кафе Коди', 'Kodi cafe')}</h1>\n<p>${T('Pitsa', 'Пицца', 'Pizza')}</p>\n<p>${T('Sharbat', 'Сок', 'Juice')}</p>`)} mark={[3]} />; },
    uz: { ctx: "Faqat abzaslar binafsha bo'lishi kerak, sarlavha esa yo'q.", q: "Bo'sh joyga qaysi selektor yoziladi?", opts: ['h1', 'body', 'purple', 'p'],
      ok: "Xuddi shunday! p selektori faqat abzaslarni tanlaydi. body bo'lsa, sarlavha ham binafsha bo'lib qolardi.", hint: "Selektor qaysi tegni bo'yashni aytadi. Abzaslar qaysi teg bilan yozilgan?", alt: "Selektori bo'sh qolgan qoida va sahifa kodi" },
    ru: { ctx: 'Фиолетовыми должны стать только абзацы, а заголовок — нет.', q: 'Какой селектор пишется на пустое место?', opts: ['h1', 'body', 'purple', 'p'],
      ok: 'Именно! Селектор p выбирает только абзацы. С body фиолетовым стал бы и заголовок.', hint: 'Селектор говорит, какой тег красить. Каким тегом написаны абзацы?', alt: 'Правило с пустым селектором и код страницы' },
    en: { ctx: 'Only the paragraphs should turn purple, not the heading.', q: 'Which selector goes in the empty spot?', opts: ['h1', 'body', 'purple', 'p'],
      ok: 'Exactly! The p selector picks only the paragraphs. With body, the heading would turn purple too.', hint: 'A selector says which tag to colour. Which tag are the paragraphs written with?', alt: 'A rule with an empty selector and the page code' } },
  { id: 'css-01t4', target: 'css-01', ptype: 'CSS', tag: 'buzuq', correct: 0,
    vis: (L) => { const T = aqL(L); const src = c1Src('h1 { color = orange; }', `<h1>${T('Kodi kafesi', 'Кафе Коди', 'Kodi cafe')}</h1>`); return <WqVis code={src} html={src} mark={[3]} />; },
    uz: { ctx: "Sarlavha to'q sariq bo'lishi kerak edi, lekin qora qoldi.", q: "Qoida nega ishlamayapti?", opts: ["= o'rniga ikki nuqta kerak", "orange qo'shtirnoqda bo'lishi kerak", "h1 oldidan nuqta kerak", "Qoida body ichida turishi kerak"],
      ok: "Ana, tuzoq shu yerda ekan! CSS kodida xususiyat va qiymat o'rtasida ikki nuqta turadi. «=» — HTML atributlari uchun.", hint: "color va orange o'rtasidagi belgiga qarang. CSS kodida u yerda qaysi belgi turadi?", alt: "Qora qolgan sarlavha va uning qoidasi" },
    ru: { ctx: 'Заголовок должен был стать оранжевым, но остался чёрным.', q: 'Почему правило не работает?', opts: ['Вместо = нужно двоеточие', 'orange нужно взять в кавычки', 'Перед h1 нужна точка', 'Правило должно стоять в body'],
      ok: 'Вот где ловушка! В CSS между свойством и значением стоит двоеточие. «=» — для атрибутов HTML.', hint: 'Посмотри на знак между color и orange. Какой знак стоит там в CSS?', alt: 'Чёрный заголовок и его правило' },
    en: { ctx: 'The heading should have turned orange, but it stayed black.', q: 'Why doesn’t the rule work?', opts: ['It needs a colon instead of =', 'orange must be in quotes', 'h1 needs a dot in front', 'The rule must be inside body'],
      ok: 'That’s the trap! In CSS a colon goes between the property and the value. “=” is for HTML attributes.', hint: 'Look at the sign between color and orange. Which sign goes there in CSS?', alt: 'A heading that stayed black and its rule' } },
  { id: 'css-01t5', target: 'css-01', ptype: 'CSS', tag: 'nuqtali-vergul', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const src = c1Src('h1 {\n  color: red\n  background-color: yellow;\n}', `<h1>${T('Kodi kafesi', 'Кафе Коди', 'Kodi cafe')}</h1>`); return <WqVis code={src} html={src} mark={[4]} />; },
    uz: { ctx: "Voy, qizil rang ham, sariq fon ham chiqmadi!", q: "4-qatorda qaysi belgi tushib qolibdi?", opts: [':', '}', '"', ';'],
      ok: "To'ppa-to'g'ri! red so'zidan keyin nuqtali vergul yo'q, shuning uchun brauzer ikkala xususiyatni ham tushunmadi.", hint: "Har bir xususiyat qaysi belgi bilan tugaydi? 4-qatorni 5-qator bilan solishtirib ko'ring.", alt: "Ikki xususiyatli qoida va oddiy sarlavha" },
    ru: { ctx: 'Ой, нет ни красного цвета, ни жёлтого фона!', q: 'Какой знак потерялся в строке 4?', opts: [':', '}', '"', ';'],
      ok: 'Верно! После red нет точки с запятой, поэтому браузер не понял ни одно из свойств.', hint: 'Каким знаком кончается каждое свойство? Сравни строку 4 со строкой 5.', alt: 'Правило с двумя свойствами и обычный заголовок' },
    en: { ctx: 'Oops, there is no red colour and no yellow background!', q: 'Which sign is missing on line 4?', opts: [':', '}', '"', ';'],
      ok: 'Right! There is no semicolon after red, so the browser understood neither property.', hint: 'Which sign ends each property? Compare line 4 with line 5.', alt: 'A rule with two properties and a plain heading' } }
];
