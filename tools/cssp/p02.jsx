// =============================================================================
// ===== ПРАКТИКА 2 · «Кинотеатр Коди» · к уроку 2 «Как выбрать элемент для стилизации» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта кинотеатра Коди стёрся CSS: классы и id в HTML остались, а цвета
// пропали. Ученик оформляет пять страниц и каждый раз выбирает нужные элементы: заменить селектор p на класс
// (только новинки) → вписать цвет в правило по id (хит недели) → написать правило для класса целиком (вечерние
// сеансы) → починить два селектора урока (нет точки; имя класса с большой буквы, а в HTML — с маленькой; в
// дополнительной — нет решётки у id) → своя страница: три правила (#id, .class, body), условия «готово» видны.
// HTML страницы — справкой под браузером (htmlAid), имена классов и id видны сразу.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-02p-selektory.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-02p-selektory',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "2-amaliyot. Kodining kinoteatri", ru: 'Практика 2. Кинотеатр Коди', en: 'Practice 2. Kodi’s cinema' }
};

// Страницы кинотеатра (тексты на языке урока; имена классов и id — одинаковые во всех языках).
const P2 = {
  cinema: L3("Kodi kinosi", 'Кино Коди', 'Kodi Cinema'),
  afisha: L3("Afisha", 'Афиша', 'Now showing'),
  kosmos: L3("Yangi: Kosmos", 'Новинка: Космос', 'New: Space'),
  dengiz: L3("Dengiz sirlari", 'Тайны моря', 'Sea Secrets'),
  robot: L3("Yangi: Robot do'st", 'Новинка: Друг-робот', 'New: Robot Friend'),
  mushuk: L3("Multfilm: Mushukcha", 'Мультфильм: Котёнок', 'Cartoon: Kitten'),
  week: L3("Hafta filmlari", 'Фильмы недели', 'Films of the week'),
  hit: L3("Hafta xiti: Kosmos", 'Хит недели: Космос', 'Hit of the week: Space'),
  seans: L3("Seanslar", 'Сеансы', 'Showtimes'),
  s10: L3("10:00 Robot do'st", '10:00 Друг-робот', '10:00 Robot Friend'),
  s18: L3("18:00 Kosmos", '18:00 Космос', '18:00 Space'),
  s20: L3("20:00 Dengiz sirlari", '20:00 Тайны моря', '20:00 Sea Secrets'),
  kassa: L3("Kassa soat 9 da ochiladi", 'Касса открывается в 9', 'The box office opens at 9'),
  tickets: L3("Chiptalar", 'Билеты', 'Tickets'),
  big: L3("Kattalar uchun: 30 000 so'm", 'Взрослый: 30 000 сумов', 'Adult: 30,000 sum'),
  kid: L3("Bolalar uchun: 20 000 so'm", 'Детский: 20 000 сумов', 'Child: 20,000 sum'),
  sale: L3("Chorshanba kuni chegirma!", 'По средам скидка!', 'Discount on Wednesdays!'),
  mine: L3("Mening filmim", 'Мой фильм', 'My film'),
  hero: L3("Bosh rol: kichkina robot", 'Главная роль: робот', 'Lead role: a robot'),
  friend: L3("Ikkinchi rol: mushuk", 'Вторая роль: кот', 'Second role: a cat'),
  genre: L3("Janri: sarguzasht", 'Жанр: приключения', 'Genre: adventure')
};
// Страница из строк [тег, атрибуты, текст]: page — тело страницы, aid — те же строки справкой (HTML страницы).
const p2Row = (pk, r) => '<' + r[0] + (r[1] ? ' ' + r[1] : '') + '>' + pk(r[2]) + '</' + r[0] + '>';
const p2Make = (rows) => ({ page: (pk) => rows.map((r) => p2Row(pk, r)).join(''), aid: (pk) => rows.map((r) => p2Row(pk, r)) });
const P2_HOOK = p2Make([['h1', 'id="logo"', P2.cinema], ['p', 'class="yangi"', P2.kosmos], ['p', '', P2.dengiz], ['p', 'class="yangi"', P2.robot]]);
const P2_AFISHA = p2Make([['h1', '', P2.afisha], ['p', 'class="yangi"', P2.kosmos], ['p', '', P2.dengiz], ['p', 'class="yangi"', P2.robot], ['p', 'class="multik"', P2.mushuk]]);
const P2_HIT = p2Make([['h1', 'id="bosh"', P2.week], ['p', 'id="hit"', P2.hit], ['p', '', P2.dengiz], ['p', '', P2.mushuk]]);
const P2_SEANS = p2Make([['h1', '', P2.seans], ['p', 'class="ertalab"', P2.s10], ['p', 'class="kech"', P2.s18],
  ['p', 'class="kech"', P2.s20], ['p', '', P2.kassa]]);
const P2_TICKETS = p2Make([['h1', 'id="kassa"', P2.tickets], ['p', 'class="narx"', P2.big], ['p', 'class="narx"', P2.kid], ['p', 'class="chegirma"', P2.sale]]);
const P2_MINE = p2Make([['h1', 'id="nom"', P2.mine], ['p', 'class="rol"', P2.hero], ['p', 'class="rol"', P2.friend], ['p', '', P2.genre]]);

// Цвет у всех выбранных элементов (и что они вообще есть) / ни у одного — по вычисленным стилям, как в DevTools.
const p2All = (D, sel, c) => { const a = D.qa(sel); return a.length > 0 && a.every((e) => D.same(D.win.getComputedStyle(e).color, c)); };
const p2None = (D, sel, c) => D.qa(sel).every((e) => !D.same(D.win.getComputedStyle(e).color, c));
// Есть ли правило с этим селектором и свойством (правил с одним селектором может быть несколько).
const p2Has = (D, sel, prop) => D.rules.some((r) => r.sel && r.sel.replace(/\s+/g, '').toLowerCase() === sel && r.style && !!r.style.getPropertyValue(prop).trim());

const PR = {
  next: L3("Ranglar", 'Цвета', 'Colors'),
  tabs: [
    { ico: 'film', c: '#FA4F28', name: P2.afisha, file: 'afisha.html' },
    { ico: 'star', c: '#F59E0B', name: L3("Hafta xiti", 'Хит недели', 'Hit of the week'), file: 'hit.html' },
    { ico: 'sun', c: '#0FA38E', name: P2.seans, file: 'seanslar.html' },
    { ico: 'cart', c: '#7C5CFA', name: P2.tickets, file: 'chiptalar.html' },
    { ico: 'heart', c: '#E44D8A', name: P2.mine, file: 'my.html' }
  ],
  hook: {
    page: P2_HOOK.page,
    css: ['  #logo { color: orange; }', '  .yangi { color: red; }', '  body { background-color: lightyellow; }']
  },
  ownPage: P2_MINE.page,
  ownDefault: '#nom { color: crimson; }\n.rol { color: navy; }\nbody { background-color: lightyellow; }',
  tasks: [
    // Т1 · заменить селектор в готовом правиле: красные только новинки (p → .yangi).
    (pk) => cpTask(1, {
      kind: 'change-selector', single: true, code0: 'p { color: red; }', answer: '.yangi { color: red; }',
      page: P2_AFISHA.page, htmlAid: P2_AFISHA.aid, syms: ['{', '}', ':', ';', '.'],
      goal: (D) => {
        if (!p2All(D, '.yangi', 'red')) return C.t1.noRed;
        if (!p2None(D, 'p:not(.yangi)', 'red')) return C.t1.no;
        return null;
      },
      sample: ['.sport { color: blue; }'],
      drill: { single: true, code0: 'p { color: green; }', answer: '.multik { color: green; }',
        goal: (D) => (p2All(D, '.multik', 'green') && p2None(D, 'p:not(.multik)', 'green') ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в правило по id: хит недели оранжевый.
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: '#hit {\n  \n}', answer: '#hit {\n  color: orange;\n}',
      page: P2_HIT.page, htmlAid: P2_HIT.aid,
      goal: (D) => (p2All(D, '#hit', 'orange') ? null : C.t2.no),
      sample: ['#logo {', '  color: blue;', '}'],
      drill: { code0: '#bosh {\n  \n}', answer: '#bosh {\n  color: purple;\n}', goal: (D) => (p2All(D, '#bosh', 'purple') ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком по классу: вечерние сеансы синие, остальные — нет.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.kech {\n  color: blue;\n}',
      page: P2_SEANS.page, htmlAid: P2_SEANS.aid,
      goal: (D) => {
        if (!p2All(D, '.kech', 'blue')) return C.t3.no;
        if (!p2None(D, 'p:not(.kech)', 'blue')) return C.t3.tooMany;
        return null;
      },
      sample: ['.sport {', '  color: green;', '}'],
      drill: { code0: '', answer: '.ertalab { color: green; }',
        goal: (D) => (p2All(D, '.ertalab', 'green') && p2None(D, 'p:not(.ertalab)', 'green') ? null : C.t3.drillNo) }
    }),
    // Т4 · починить два селектора: нет точки; Chegirma с большой буквы (в HTML — chegirma). Дополнительная — нет «#».
    (pk) => cpTask(4, {
      kind: 'fix', code0: 'narx { color: green; }\n.Chegirma { color: red; }',
      answer: '.narx { color: green; }\n.chegirma { color: red; }',
      page: P2_TICKETS.page, htmlAid: P2_TICKETS.aid, syms: ['{', '}', ':', ';', '.', '#'],
      goal: (D) => (p2All(D, '.narx', 'green') && p2All(D, '.chegirma', 'red') ? null : C.t4.no),
      sample: ['.sport { color: blue; }', '#logo { color: orange; }'],
      drill: { single: true, code0: 'kassa { color: purple; }', answer: '#kassa { color: purple; }',
        goal: (D) => (p2All(D, '#kassa', 'purple') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: заголовок через #id, роли через .class, фон body; заголовок не сливается с фоном.
    // Имена id и класса — в условиях «готово» (справки HTML нет: на телефоне экран с ней не влезал).
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '',
      answer: '#nom { color: teal; }\n.rol { color: purple; }\nbody { background-color: lavender; }',
      page: P2_MINE.page,
      list: [
        { t: L3("#nom — rang", '#nom — цвет', '#nom — color'), ok: (D) => p2Has(D, '#nom', 'color') },
        { t: L3(".rol — rang", '.rol — цвет', '.rol — color'), ok: (D) => p2Has(D, '.rol', 'color') },
        { t: L3("body — fon", 'body — фон', 'body — background'), ok: (D) => p2Has(D, 'body', 'background-color') }
      ],
      goal: (D) => {
        if (!p2Has(D, '#nom', 'color')) return C.t5.needId;
        if (!p2Has(D, '.rol', 'color')) return C.t5.needCls;
        if (!p2Has(D, 'body', 'background-color')) return C.t5.needBody;
        if (D.same(D.cs('#nom', 'color'), D.cs('body', 'background-color'))) return C.t5.same;
        return null;
      },
      sample: ['#nom { color: crimson; }', '.rol { color: darkgreen; }', 'body { background-color: lightcyan; }'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, no …; печатаются: eyebrow, ask, roles, list.
// Реплики сцеплены в одну историю: каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining kinoteatri", 'Кинотеатр Коди', 'Kodi’s cinema'),
    say: L3("Salom! Bu mening kinoteatrimning sayti. Qarang: kinoteatr nomi to'q sariq, yangi filmlar esa qizil rangda. Buni CSS qildi: bir qoida id orqali nomni tanlaydi, boshqasi class orqali yangi filmlarni. Saytda beshta sahifa bor. Hozir uni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кинотеатра. Смотри: название оранжевое, а новинки красные. Это сделал CSS: одно правило выбирает название по id, другое выбирает новинки по классу. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my cinema’s website. Look: the name is orange, and the new films are red. CSS did that: one rule picks the name by its id, another picks the new films by their class. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Hamma matn qora bo'lib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Весь текст стал чёрным, а вкладки погасли.', 'Oh no! The CSS code got erased. All the text went black, and the tabs went dark.'),
    done: L3("HTML joyida, class va id ham turibdi, faqat CSS yo'q. O'tgan darsda kerakli elementni tanlashni o'rgandik: class nuqta bilan, id esa panjara belgisi bilan tanlanadi. Endi beshta sahifani birma-bir bezaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, классы и id тоже, пропал только CSS. На прошлом уроке мы научились выбирать нужный элемент: класс выбирают с точкой, а id — с решёткой. Теперь оформим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, and the classes and ids are still there; only the CSS is gone. Last lesson we learned to pick the element we need: a class is picked with a dot, and an id with a hash sign. Now let’s style the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani bezaymiz: kodni siz yozasiz", 'Оформим пять страниц: код пишешь ты', 'Let’s style five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Afisha", 'Афиша', 'Now showing'),
    say: L3("Birinchi sahifa: afisha. Bu yerda bitta qoida qolgan, u hamma abzaslarni qizil qiladi. Lekin qizil faqat yangi filmlar bo'lishi kerak. HTML kodiga qarang: yangi filmlarda yangi degan class bor. Qoidadagi selektorni almashtiring.",
      'Первая страница: афиша. Здесь осталось одно правило, и оно красит в красный все абзацы. А красными должны быть только новинки. Посмотри в HTML: у новинок есть класс yangi. Замени в правиле селектор.',
      'The first page is the listings. One rule is left here, and it makes every paragraph red. But only the new films should be red. Look at the HTML: the new films have the class yangi. Change the selector in the rule.'),
    ask: L3("Faqat yangi filmlarni qizil qiling", 'Сделай красными только новинки', 'Make only the new films red'),
    ok: L3("Ajoyib! Endi faqat yangi filmlar qizil. Afisha jonlandi!", 'Отлично! Теперь красные только новинки. Афиша ожила!', 'Great! Now only the new films are red. The listings are back to life!'),
    hints: [
      L3("HTML kodiga qarang: yangi filmlarning abzaslarida qanday class bor?", 'Посмотри в HTML: какой класс у абзацев с новинками?', 'Look at the HTML: what class do the new-film paragraphs have?'),
      L3("Ularning classi yangi. CSS kodida class nomidan oldin nuqta turadi. p o'rniga nuqta va yangi so'zini yozing.", 'Их класс — yangi. В CSS перед именем класса ставят точку. Вместо p напиши точку и yangi.', 'Their class is yangi. In CSS a dot goes before a class name. Instead of p, write a dot and yangi.'),
      L3("Namuna kod ostida: u sport classli elementlarni ko'k qiladi. Xuddi shunday yozing, faqat yangi classi uchun, va «Tekshirish»ni bosing.", 'Образец под кодом красит в синий элементы с классом sport. Напиши так же, только для класса yangi, и нажми «Проверить».', 'The example under the code makes elements with the class sport blue. Write the same for the class yangi and tap Check.')
    ],
    no: L3("Qizil faqat yangi filmlar emas, boshqa abzaslar ham qizil bo'lib qoldi. Faqat yangi classli abzaslarni tanlang.", 'Красные не только новинки, другие абзацы тоже. Выбери только абзацы с классом yangi.', 'Not only the new films are red; other paragraphs are too. Pick only the paragraphs with the class yangi.'),
    noRed: L3("Yangi filmlar hali qizil emas. Rang qolsin, faqat selektorni almashtiring.", 'Новинки пока не красные. Цвет оставь, поменяй только селектор.', 'The new films aren’t red yet. Keep the color, change only the selector.'),
    drill: L3("endi faqat multfilmni yashil qiling", 'теперь сделай зелёным только мультфильм', 'now make only the cartoon green'),
    drillNo: L3("Yashil faqat multfilm bo'lishi kerak. HTML kodiga qarang: uning classi multik.", 'Зелёным должен быть только мультфильм. Посмотри в HTML: его класс — multik.', 'Only the cartoon should be green. Look at the HTML: its class is multik.')
  },
  t2: {
    eyebrow: L3("Hafta xiti", 'Хит недели', 'Hit of the week'),
    say: L3("Afisha tayyor! Endi hafta xiti sahifasi. Bu yerda id bo'yicha qoida bor: panjara belgisi va hit. Lekin qavslar ichi bo'm-bo'sh. Hafta xiti to'q sariq bo'lsin: qavslar ichiga xususiyat va qiymatni yozing.",
      'Афиша готова! Теперь страница хита недели. Здесь есть правило по id: решётка и hit. Но внутри скобок пусто. Пусть хит недели станет оранжевым: впиши в скобки свойство и значение.',
      'The listings are done! Now the hit-of-the-week page. There’s a rule by id here: a hash sign and hit. But it’s empty inside the braces. Let’s make the hit of the week orange: write a property and a value inside the braces.'),
    ask: L3("Hafta xitini to'q sariq qiling", 'Сделай хит недели оранжевым', 'Make the hit of the week orange'),
    ok: L3("Zo'r! Hafta xiti to'q sariq bo'ldi. id bitta elementni aniq topdi.", 'Огонь! Хит недели стал оранжевым. id точно нашёл один элемент.', 'Awesome! The hit of the week is orange. The id found exactly one element.'),
    hints: [
      L3("HTML kodiga qarang: hit degan id qaysi abzasda turibdi? Endi unga rang kerak.", 'Посмотри в HTML: у какого абзаца id hit? Теперь ему нужен цвет.', 'Look at the HTML: which paragraph has the id hit? Now it needs a color.'),
      L3("Matn rangini color beradi. Keyin ikki nuqta, rang nomi va nuqtali vergul keladi. To'q sariq inglizchada orange.", 'Цвет текста задаёт color. Потом двоеточие, название цвета и точка с запятой. Оранжевый по-английски — orange.', 'color sets the text color. Then a colon, the color name and a semicolon. Use orange.'),
      L3("Namuna kod ostida: u id bo'yicha sarlavhani ko'k qiladi. Qavslar ichiga xuddi shunday yozing, faqat orange bilan.", 'Образец под кодом красит заголовок по id в синий. Впиши в скобки так же, только с orange.', 'The example under the code makes a heading blue by its id. Write the same inside the braces, only with orange.')
    ],
    no: L3("Hafta xiti hali to'q sariq emas. Qavslar ichida color va orange bo'lishi kerak.", 'Хит недели пока не оранжевый. Внутри скобок нужны color и orange.', 'The hit of the week isn’t orange yet. Inside the braces you need color and orange.'),
    drill: L3("endi sarlavhani binafsha qiling", 'теперь сделай заголовок фиолетовым', 'now make the heading purple'),
    drillNo: L3("Sarlavha hali binafsha emas. Binafsha inglizchada purple.", 'Заголовок пока не фиолетовый. Фиолетовый по-английски — purple.', 'The heading isn’t purple yet. Use the word purple.')
  },
  t3: {
    eyebrow: L3("Seanslar", 'Сеансы', 'Showtimes'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: seanslar. Bu yerda kod umuman yo'q. Kechki seanslar ko'k bo'lsin: qoidani boshidan oxirigacha o'zingiz yozing. HTML kodiga qarang: kechki seanslarda kech degan class bor.",
      'Две страницы горят! Третья: сеансы. Здесь кода нет совсем. Пусть вечерние сеансы станут синими: напиши правило целиком, от начала до конца. Посмотри в HTML: у вечерних сеансов класс kech.',
      'Two pages are lit! The third is showtimes. There’s no code here at all. Let’s make the evening shows blue: write the whole rule yourself. Look at the HTML: the evening shows have the class kech.'),
    ask: L3("Kechki seanslarni ko'k qiling", 'Сделай вечерние сеансы синими', 'Make the evening shows blue'),
    ok: L3("Qoyil! Faqat kechki seanslar ko'k bo'ldi. Bitta class ikkita abzasni birdaniga tanladi.", 'Вот это да! Синими стали только вечерние сеансы. Один класс выбрал сразу два абзаца.', 'Wow! Only the evening shows turned blue. One class picked two paragraphs at once.'),
    hints: [
      L3("Qoida uch qismdan iborat: nimani tanlaymiz, qaysi xususiyat va qanday qiymat. Kechki seanslarning classi qanday?", 'Правило — это три части: что выбираем, какое свойство и какое значение. Какой класс у вечерних сеансов?', 'A rule has three parts: what we pick, which property and which value. What class do the evening shows have?'),
      L3("Selektor nuqta va kech, xususiyat color, qiymat esa blue. Xususiyat va qiymat jingalak qavslar ichida turadi.", 'Селектор — точка и kech, свойство color, значение blue. Свойство и значение стоят в фигурных скобках.', 'The selector is a dot and kech, the property is color, the value is blue. The property and value go inside curly braces.'),
      L3("Namuna kod ostida: u boshqa classni yashil qiladi. Xuddi shunday qoida yozing, faqat kech classi va blue bilan.", 'Образец под кодом красит в зелёный другой класс. Напиши такое же правило, только для класса kech и с blue.', 'The example under the code makes another class green. Write the same rule, only for the class kech and with blue.')
    ],
    no: L3("Kechki seanslar hali ko'k emas. Ularning classi kech, ko'k esa blue.", 'Вечерние сеансы пока не синие. Их класс — kech, а синий — blue.', 'The evening shows aren’t blue yet. Their class is kech, and the color is blue.'),
    tooMany: L3("Ko'k faqat kechki seanslar bo'lishi kerak, boshqa abzaslar ham bo'yalib qoldi. Hamma abzaslarni emas, faqat kech classini tanlang.", 'Синими должны быть только вечерние сеансы, а покрасились и другие абзацы. Выбери не все абзацы, а только класс kech.', 'Only the evening shows should be blue, but other paragraphs got colored too. Pick not all paragraphs, only the class kech.'),
    drill: L3("endi ertalabki seanslarni yashil qiling, qoidani o'zingiz yozing", 'теперь сделай утренние сеансы зелёными, правило пиши с нуля', 'now make the morning shows green, write the rule yourself'),
    drillNo: L3("Yashil faqat ertalabki seanslar bo'lishi kerak. HTML kodiga qarang: ularning classi ertalab.", 'Зелёными должны быть только утренние сеансы. Посмотри в HTML: их класс — ertalab.', 'Only the morning shows should be green. Look at the HTML: their class is ertalab.')
  },
  t4: {
    eyebrow: L3("Chiptalar", 'Билеты', 'Tickets'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: chiptalar. Bu kodni men shoshib yozgan edim, unda ikkita joy buzilgan. Selektorlar sahifadan hech narsani topmayapti, shuning uchun ranglar yo'q. HTML kodi bilan solishtiring va ikkala joyni tuzating.",
      'Три страницы готовы! Четвёртая: билеты. Этот код я писал в спешке, и в нём две поломки. Селекторы ничего не находят на странице, поэтому цветов нет. Сверь с HTML и почини обе.',
      'Three pages are done! The fourth is tickets. I wrote this code in a hurry, and it has two broken spots. The selectors find nothing on the page, so there are no colors. Compare with the HTML and fix both.'),
    ask: L3("Ikkita buzilgan selektorni tuzating", 'Почини два сломанных селектора', 'Fix the two broken selectors'),
    ok: L3("Mana, tuzaldi! Ikkala selektor ham o'z elementini topdi: narxlar yashil, chegirma qizil.", 'Есть, починено! Оба селектора нашли свои элементы: цены зелёные, скидка красная.', 'Fixed it! Both selectors found their elements: the prices are green, the discount is red.'),
    hints: [
      L3("Har bir selektorni HTML kodi bilan solishtiring: class nomidan oldin nima turishi kerak? Nom harfma-harf bir xilmi?", 'Сравни каждый селектор с HTML: что должно стоять перед именем класса? Имя совпадает буква в букву?', 'Compare each selector with the HTML: what goes before a class name? Does the name match letter for letter?'),
      L3("Birinchi qoidada narx so'zidan oldin nuqta yo'q. Ikkinchisida Chegirma katta harf bilan yozilgan, HTML kodida esa kichik harf bilan.", 'В первом правиле перед narx нет точки. Во втором Chegirma написано с большой буквы, а в HTML — с маленькой.', 'In the first rule there’s no dot before narx. In the second, Chegirma starts with a capital letter, but in the HTML it’s lowercase.'),
      L3("Namuna kod ostida: to'g'ri class va id selektorlari. Nuqtani qo'ying, harfni HTML kodidagidek qiling va «Tekshirish»ni bosing.", 'Образец под кодом — верные селекторы класса и id. Поставь точку, сделай букву как в HTML и нажми «Проверить».', 'The example under the code has correct class and id selectors. Add the dot, make the letter match the HTML and tap Check.')
    ],
    no: L3("Selektorlar elementlarni topdi, lekin ranglar boshqa. Narxlar green, chegirma esa red bo'lishi kerak.", 'Селекторы нашли элементы, но цвета не те. Цены — green, скидка — red.', 'The selectors found the elements, but the colors are different. Prices should be green, the discount red.'),
    drill: L3("yana bitta selektorni tuzating", 'почини ещё один селектор', 'fix one more selector'),
    drillNo: L3("Sarlavha hali binafsha emas. HTML kodiga qarang: sarlavhada class emas, id turibdi. id nomidan oldin panjara belgisi bo'ladi.", 'Заголовок пока не фиолетовый. Посмотри в HTML: у заголовка не класс, а id. Перед именем id ставят решётку.', 'The heading isn’t purple yet. Look at the HTML: the heading has an id, not a class. A hash sign goes before an id name.')
  },
  t5: {
    eyebrow: L3("Mening filmim", 'Мой фильм', 'My film'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z filmingiz sahifasi. Uchta narsani bezang: sarlavhani nom degan id orqali, rollarni rol degan class orqali, butun sahifa fonini esa body orqali. Ranglarni o'zingiz tanlang. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: страница твоего фильма. Оформи три вещи: заголовок через id nom, роли через класс rol, а фон всей страницы через body. Цвета выбирай любые. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: your own film’s page. Style three things: the heading by the id nom, the roles by the class rol, and the whole page background with body. Pick the colors yourself. Under the window you can see what’s done.'),
    ask: L3("Filmingizni bezang: uchta qoida", 'Оформи свой фильм: три правила', 'Style your film: three rules'),
    ok: L3("Ura! Filmingiz sahifasi tayyor, u o'z ranglaringizda!", 'Ура! Страница твоего фильма готова, и она в твоих цветах!', 'Hooray! Your film’s page is ready, in your own colors!'),
    hints: [
      L3("Oyna ostidagi shartlarga qarang: sarlavhaning id nomi nom, rollarning class nomi esa rol. id uchun qaysi belgi kerak, class uchun-chi?", 'Посмотри на условия под окном: имя id у заголовка — nom, а имя класса у ролей — rol. Какой знак нужен для id, а какой для класса?', 'Look at the conditions under the window: the heading’s id name is nom, and the roles’ class name is rol. Which sign does an id need, and which a class?'),
      L3("Uchta qoida kerak: panjara belgisi va nom uchun color, nuqta va rol uchun color, body uchun esa background-color.", 'Нужны три правила: решётка и nom с color, точка и rol с color, а body с background-color.', 'You need three rules: a hash sign and nom with color, a dot and rol with color, and body with background-color.'),
      L3("Namuna kod ostida: boshqa ranglardagi uchta qoida. O'zingizga yoqqan ranglarni tanlang.", 'Образец под кодом — три правила с другими цветами. Выбери свои цвета.', 'The example under the code has three rules in other colors. Pick your own colors.')
    ],
    needId: L3("Sarlavha uchun qoida yo'q. Uni id orqali tanlang: panjara belgisi va nom, ichida esa color.", 'Нет правила для заголовка. Выбери его по id: решётка и nom, а внутри — color.', 'There’s no rule for the heading. Pick it by its id: a hash sign and nom, with color inside.'),
    needCls: L3("Rollar uchun qoida yo'q. Ularni class orqali tanlang: nuqta va rol, ichida esa color.", 'Нет правила для ролей. Выбери их по классу: точка и rol, а внутри — color.', 'There’s no rule for the roles. Pick them by their class: a dot and rol, with color inside.'),
    needBody: L3("Sahifa foni uchun qoida yo'q: body tegiga background-color yozing.", 'Нет правила для фона: напиши для body свойство background-color.', 'There’s no rule for the background: write background-color for body.'),
    same: L3("Sarlavha fon bilan bir xil rangda, u ko'rinmay qoldi. Boshqa-boshqa rang tanlang.", 'Заголовок того же цвета, что и фон, — его не видно. Выбери разные цвета.', 'The heading is the same color as the background, so you can’t see it. Pick different colors.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kinoteatrning beshta sahifasi ham yana rangli! Har bir rang o'z elementini topdi, chunki selektorlarni siz yozdingiz.", 'Все пять страниц кинотеатра снова в цвете! Каждый цвет нашёл свой элемент, потому что селекторы — твоя работа.', 'All five cinema pages are colorful again! Every color found its element, because the selectors are your work.') },
      { k: 'a', text: L3("Teg selektori shu tegdagi hamma elementlarni tanlaydi.", 'Селектор тега выбирает все элементы с этим тегом.', 'A tag selector picks every element with that tag.') },
      { k: 'b', text: L3("class selektori nuqta bilan yoziladi va shu classli hamma elementlarni tanlaydi.", 'Селектор класса пишут с точкой, он выбирает все элементы с этим классом.', 'A class selector is written with a dot and picks every element with that class.') },
      { k: 'c', text: L3("id selektori panjara belgisi bilan yoziladi va bitta elementni tanlaydi.", 'Селектор id пишут с решёткой, он выбирает один элемент.', 'An id selector is written with a hash sign and picks one element.') },
      { k: 'd', text: L3("Selektor ishlamasa, uni HTML kodi bilan solishtirasiz: nuqta, panjara belgisi va nomning har bir harfi.", 'А если селектор не работает, сверяешь его с HTML: точка, решётка и каждая буква имени.', 'And if a selector doesn’t work, you compare it with the HTML: the dot, the hash sign and every letter of the name.') },
      { k: null, text: L3("Keyingi darsda ranglarni chuqurroq o'rganamiz: rangni yozishning yangi usullarini ko'rasiz. Ko'rishguncha!", 'На следующем уроке разберёмся с цветами глубже: узнаешь новые способы записать цвет. До встречи!', 'Next lesson we’ll dig deeper into colors: you’ll learn new ways to write a color. See you!') }
    ],
    roles: {
      a: L3("p — hamma p teglari", 'p — все теги p', 'p — every p tag'),
      b: L3(".class — guruh", '.class — группа', '.class — a group'),
      c: L3("#id — bitta element", '#id — один элемент', '#id — one element'),
      d: L3("tuzatish: «.», «#» va nom", 'починка: «.», «#» и имя', 'fixing: “.”, “#” and the name')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
