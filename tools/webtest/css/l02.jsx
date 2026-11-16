// =============================================================================
// ТЕСТЫ К УРОКУ 2 КУРСА CSS «Как выбрать элемент для стилизации» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: class выбирается через точку; id — через «#»; селектор тега красит все такие теги;
// имя класса — буква в букву (Sport ≠ sport); class — для многих, id — для одного.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — код и/или честная страница (WqVis).
// =============================================================================
const SLUG = 'selektory';
// Страница урока: style в head и тело — один и тот же текст для редактора и для честного браузера.
const c2Src = (css, body) => `<head>\n  <style>\n${css.split('\n').map((l) => '    ' + l).join('\n')}\n  </style>\n</head>\n<body>\n${body.split('\n').map((l) => '  ' + l).join('\n')}\n</body>`;
// Короткая запись — только style и теги (для вопросов с длинными вариантами: на маленьком телефоне место нужно странице).
const c2Mini = (css, body) => `<style>\n${css.split('\n').map((l) => '  ' + l).join('\n')}\n</style>\n${body}`;
const QS = [
  { id: 'css-02t1', target: 'css-02', ptype: 'CSS', tag: 'class', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={c2Src('___ { color: red; }', `<p>${T('Bugun dars bor', 'Сегодня есть урок', 'There is a lesson today')}</p>\n<p class="muhim">${T('Ertaga imtihon!', 'Завтра экзамен!', 'Exam tomorrow!')}</p>`)} mark={[3]} />; },
    uz: { ctx: "Faqat class=\"muhim\" bo'lgan abzas qizil bo'lishi kerak.", q: "Bo'sh joyga qaysi selektor yoziladi?", opts: ['muhim', '#muhim', '.muhim', 'p'],
      ok: "Xuddi shunday! Class selektori nuqta bilan boshlanadi: .muhim faqat shu class berilgan abzasni tanlaydi.", hint: "p hamma abzaslarni bo'yaydi. Class nomi oldidan qaysi belgi turadi: nuqtami yoki panjara belgisimi?", alt: "Selektori bo'sh qolgan qoida va ikki abzas" },
    ru: { ctx: 'Красным должен стать только абзац с class="muhim".', q: 'Какой селектор пишется на пустое место?', opts: ['muhim', '#muhim', '.muhim', 'p'],
      ok: 'Именно! Селектор класса начинается с точки: .muhim выбирает только абзац с этим классом.', hint: 'p покрасит все абзацы. Какой знак ставится перед именем класса: точка или решётка?', alt: 'Правило с пустым селектором и два абзаца' },
    en: { ctx: 'Only the paragraph with class="muhim" should turn red.', q: 'Which selector goes in the empty spot?', opts: ['muhim', '#muhim', '.muhim', 'p'],
      ok: 'Exactly! A class selector starts with a dot: .muhim picks only the paragraph with that class.', hint: 'p would colour every paragraph. Which sign goes before a class name: a dot or a hash?', alt: 'A rule with an empty selector and two paragraphs' } },
  { id: 'css-02t2', target: 'css-02', ptype: 'CSS', tag: 'id', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<h1 id="logo">${T('Kodi kinoteatri', 'Кинотеатр Коди', 'Kodi cinema')}</h1>\n<p>${T('Bugungi kinolar', 'Фильмы сегодня', 'Today’s films')}</p>`} mark={[1]} />; },
    uz: { ctx: "Sarlavhada id atributi bor. Uni CSS kodida tanlaymiz.", q: "Qaysi selektor shu sarlavhani tanlaydi?", opts: ['.logo', '#logo', 'logo', 'id=logo'],
      ok: "Qoyil! id selektori panjara belgisi bilan yoziladi: #logo. Nuqta esa class uchun.", hint: "HTML kodida id turibdi, class emas. CSS kodida id nomi oldidan qaysi belgi qo'yiladi?", alt: "id=\"logo\" bo'lgan sarlavha kodi" },
    ru: { ctx: 'У заголовка есть id. Выберем его в CSS.', q: 'Какой селектор выберет этот заголовок?', opts: ['.logo', '#logo', 'logo', 'id=logo'],
      ok: 'Здорово! Селектор id пишется с решёткой: #logo. А точка — для класса.', hint: 'В HTML стоит id, а не class. Какой знак ставится в CSS перед именем id?', alt: 'Код заголовка с id="logo"' },
    en: { ctx: 'The heading has an id. Let’s select it in CSS.', q: 'Which selector picks this heading?', opts: ['.logo', '#logo', 'logo', 'id=logo'],
      ok: 'Nice work! An id selector is written with a hash: #logo. The dot is for classes.', hint: 'The HTML has an id, not a class. Which sign goes before an id name in CSS?', alt: 'Code of a heading with id="logo"' } },
  { id: 'css-02t3', target: 'css-02', ptype: 'CSS', tag: 'teg', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis code={c2Src('p { color: blue; }', `<h1>${T('Sport', 'Спорт', 'Sport')}</h1>\n<p>${T('Futbol', 'Футбол', 'Football')}</p>\n<p>${T('Basketbol', 'Баскетбол', 'Basketball')}</p>\n<p>${T('Tennis', 'Теннис', 'Tennis')}</p>`)} mark={[3]} />; },
    uz: { ctx: "Sahifada bitta sarlavha va uchta abzas bor.", q: "Bu qoida nechta elementni ko'k qiladi?", opts: ['Faqat birinchi abzasni', 'Hech birini', 'Sarlavhani ham, abzaslarni ham', 'Uchala abzasni'],
      ok: "To'ppa-to'g'ri! Teg selektori p sahifadagi hamma abzaslarni tanlaydi, sarlavha esa h1.", hint: "p selektori nechta p tegini topadi: bittasini yoki hammasini? Sarlavha qaysi teg bilan yozilgan?", alt: "p uchun ko'k qoida va sahifa kodi" },
    ru: { ctx: 'На странице один заголовок и три абзаца.', q: 'Сколько элементов это правило сделает синими?', opts: ['Только первый абзац', 'Ни одного', 'И заголовок, и абзацы', 'Все три абзаца'],
      ok: 'Верно! Селектор тега p выбирает все абзацы на странице, а заголовок — это h1.', hint: 'Сколько тегов p найдёт селектор p: один или все? Каким тегом написан заголовок?', alt: 'Синее правило для p и код страницы' },
    en: { ctx: 'The page has one heading and three paragraphs.', q: 'How many elements will this rule turn blue?', opts: ['Only the first paragraph', 'None of them', 'The heading and the paragraphs', 'All three paragraphs'],
      ok: 'Right! The tag selector p picks every paragraph on the page, and the heading is an h1.', hint: 'How many p tags will the p selector find: one or all? Which tag is the heading written with?', alt: 'A blue rule for p and the page code' } },
  { id: 'css-02t4', target: 'css-02', ptype: 'CSS', tag: 'buzuq', correct: 0,
    vis: (L) => { const T = aqL(L); const src = c2Mini('.Sport { color: blue; }', `<p class="sport">${T('Futbol', 'Футбол', 'Football')}</p>\n<p class="sport">${T('Tennis', 'Теннис', 'Tennis')}</p>`); return <WqVis code={src} html={src} mark={[2, 4, 5]} />; },
    uz: { ctx: "Ikkala abzas ko'k bo'lishi kerak edi, lekin qora qoldi.", q: "Qoida nega ishlamayapti?", opts: ['Nomlar bir xil emas: Sport va sport', "Nuqta o'rniga panjara belgisi kerak", 'Bitta class ikki abzasda ishlamaydi', "color o'rniga background-color kerak"],
      ok: "Ana, tuzoq shu yerda ekan! Class nomi harfi-harfiga mos kelishi kerak: katta S bilan Sport — boshqa nom.", hint: "CSS dagi nomni HTML kodidagi nom bilan solishtiring. Birinchi harflariga qarang.", alt: "Qora qolgan ikki abzas va ularning qoidasi" },
    ru: { ctx: 'Оба абзаца должны были стать синими, но остались чёрными.', q: 'Почему правило не работает?', opts: ['Разные имена: Sport и sport', 'Нужна решётка вместо точки', 'Класс не бывает на двух абзацах', 'Нужен background-color'],
      ok: 'Вот где ловушка! Имя класса должно совпадать буква в букву: Sport с большой S — другое имя.', hint: 'Сравни имя в CSS с именем в HTML. Посмотри на первые буквы.', alt: 'Два чёрных абзаца и их правило' },
    en: { ctx: 'Both paragraphs should have turned blue, but they stayed black.', q: 'Why doesn’t the rule work?', opts: ['The names differ: Sport, sport', 'It needs # instead of a dot', 'A class can’t be on two paragraphs', 'It needs background-color'],
      ok: 'That’s the trap! A class name must match letter for letter: Sport with a capital S is a different name.', hint: 'Compare the name in CSS with the name in HTML. Look at the first letters.', alt: 'Two black paragraphs and their rule' } },
  { id: 'css-02t5', target: 'css-02', ptype: 'CSS', tag: 'class-yoki-id', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<p ___>${T('Futbol', 'Футбол', 'Football')}</p>\n<p ___>${T('Basketbol', 'Баскетбол', 'Basketball')}</p>\n<p ___>${T('Tennis', 'Теннис', 'Tennis')}</p>`} mark={[1, 2, 3]} />; },
    uz: { ctx: "Uchta sport yangiligi bir xil ko'k bo'lishi kerak.", q: "Ularga nima beramiz?", opts: ["Hammasiga bir xil id", "Har biriga boshqa class", "Hammasiga bir xil class", "Faqat birinchisiga id"],
      ok: "Juda zo'r! Bitta class ko'p elementda bo'lishi mumkin, xuddi jamoa formasi kabi. id esa sahifada bitta bo'ladi.", hint: "id — pasport raqami kabi: sahifada bittagina. Bir nechta elementga bir xil narsa kerak bo'lsa-chi?", alt: "Uchta abzas, atributi bo'sh" },
    ru: { ctx: 'Три спортивные новости должны быть одинаково синими.', q: 'Что мы им дадим?', opts: ['Всем один и тот же id', 'Каждой свой class', 'Всем один и тот же class', 'id только первой'],
      ok: 'Отлично! Один класс может стоять на многих элементах, как форма команды. А id на странице один.', hint: 'id — как номер паспорта: на странице только один. А если одно и то же нужно нескольким?', alt: 'Три абзаца с пустым атрибутом' },
    en: { ctx: 'Three sport news items should all be the same blue.', q: 'What do we give them?', opts: ['The same id to all', 'A different class to each', 'The same class to all', 'An id to the first only'],
      ok: 'Great! One class can sit on many elements, like a team uniform. An id is only one per page.', hint: 'An id is like a passport number: only one per page. What if several things need the same?', alt: 'Three paragraphs with an empty attribute' } }
];
