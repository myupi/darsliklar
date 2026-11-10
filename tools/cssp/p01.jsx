// =============================================================================
// ===== ПРАКТИКА 1 · «Кафе Коди» · к уроку 1 «Что такое CSS и как он меняет сайт» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта кафе Коди стёрся CSS: страницы стали чёрно-белыми, вкладки погасли.
// Ученик оформляет пять страниц по одной и сам пишет CSS: заменить цвет в готовом правиле → вписать свойство и
// значение в пустое правило → написать правило целиком (фон body) → починить две поломки урока («=» вместо «:»,
// нет «;» между свойствами) → своя страница: три правила (h1, p, body), условия «готово» видны.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-01p-chto-takoe-css.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-01p-chto-takoe-css',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "1-amaliyot. Kodining kafesi", ru: 'Практика 1. Кафе Коди', en: 'Practice 1. Kodi’s café' }
};

// Страницы кафе (тексты на языке урока).
const P1 = {
  menu: L3("Menyu", 'Меню', 'Menu'),
  soup: L3("Mastava — 18 000 so'm", 'Суп — 18 000 сумов', 'Soup — 18,000 sum'),
  plov: L3("Palov — 25 000 so'm", 'Плов — 25 000 сумов', 'Plov — 25,000 sum'),
  drinks: L3("Ichimliklar", 'Напитки', 'Drinks'),
  tea: L3("Ko'k choy", 'Зелёный чай', 'Green tea'),
  juice: L3("Olma sharbati", 'Яблочный сок', 'Apple juice'),
  sweets: L3("Shirinliklar", 'Десерты', 'Desserts'),
  cake: L3("Shokoladli tort", 'Шоколадный торт', 'Chocolate cake'),
  ice: L3("Muzqaymoq", 'Мороженое', 'Ice cream'),
  contacts: L3("Aloqa", 'Контакты', 'Contacts'),
  addr: L3("Toshkent, Navoiy ko'chasi, 7", 'Ташкент, улица Навои, 7', 'Tashkent, Navoi street, 7'),
  hours: L3("Har kuni 9:00 dan 21:00 gacha", 'Каждый день с 9:00 до 21:00', 'Every day from 9:00 to 21:00'),
  mine: L3("Mening kafem", 'Моё кафе', 'My café'),
  mine1: L3("Bugun hamma uchun bepul choy!", 'Сегодня чай для всех бесплатно!', 'Free tea for everyone today!'),
  mine2: L3("Kutib qolamiz!", 'Ждём в гости!', 'Come and visit!')
};
const p1Page = (a, b, c) => (pk) => '<h1>' + pk(a) + '</h1><p>' + pk(b) + '</p><p>' + pk(c) + '</p>';

const PR = {
  next: L3("Selektorlar", 'Селекторы', 'Selectors'),
  tabs: [
    { ico: 'cup', c: '#FA4F28', name: P1.menu, file: 'menu.html' },
    { ico: 'leaf', c: '#0FA38E', name: P1.drinks, file: 'drinks.html' },
    { ico: 'heart', c: '#E44D8A', name: P1.sweets, file: 'sweets.html' },
    { ico: 'mail', c: '#7C5CFA', name: P1.contacts, file: 'contacts.html' },
    { ico: 'star', c: '#F59E0B', name: P1.mine, file: 'my.html' }
  ],
  hook: {
    page: p1Page(P1.menu, P1.soup, P1.plov),
    css: ['  body { background-color: lightyellow; }', '  h1 { color: orange; }', '  p { color: brown; }']
  },
  ownPage: p1Page(P1.mine, P1.mine1, P1.mine2),
  ownDefault: 'h1 { color: teal; }\np { color: navy; }\nbody { background-color: lavender; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: заголовок снова оранжевый.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: 'h1 { color: black; }', answer: 'h1 { color: orange; }',
      page: p1Page(P1.menu, P1.soup, P1.plov),
      goal: (D) => (D.same(D.cs('h1', 'color'), 'orange') ? null : C.t1.no),
      sample: ['p { color: blue; }'],
      drill: { single: true, code0: 'p { color: black; }', answer: 'p { color: green; }',
        goal: (D) => (D.same(D.cs('p', 'color'), 'green') ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в пустое правило: абзацы зелёные.
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: 'p {\n  \n}', answer: 'p {\n  color: green;\n}',
      page: p1Page(P1.drinks, P1.tea, P1.juice),
      goal: (D) => (D.same(D.cs('p', 'color'), 'green') ? null : C.t2.no),
      sample: ['h1 {', '  color: blue;', '}'],
      drill: { code0: 'h1 {\n  \n}', answer: 'h1 {\n  color: purple;\n}', goal: (D) => (D.same(D.cs('h1', 'color'), 'purple') ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: фон всей страницы розовый (селектор body — из урока).
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: 'body {\n  background-color: pink;\n}',
      page: p1Page(P1.sweets, P1.cake, P1.ice),
      goal: (D) => (D.same(D.cs('body', 'background-color'), 'pink') ? null : C.t3.no),
      sample: ['body {', '  background-color: lightblue;', '}'],
      drill: { code0: '', answer: 'p { color: brown; }', goal: (D) => (D.same(D.cs('p', 'color'), 'brown') ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: «=» вместо «:» и нет «;» между свойствами.
    (pk) => cpTask(4, {
      kind: 'fix', code0: 'h1 { color = purple; }\np { color: gray background-color: lightyellow; }',
      answer: 'h1 { color: purple; }\np { color: gray; background-color: lightyellow; }',
      page: p1Page(P1.contacts, P1.addr, P1.hours),
      goal: (D) => (D.same(D.cs('h1', 'color'), 'purple') && D.same(D.cs('p', 'color'), 'gray') && D.same(D.cs('p', 'background-color'), 'lightyellow') ? null : C.t4.no),
      sample: ['p { color: blue; background-color: white; }'],
      drill: { single: true, code0: 'h1 { color navy; }', answer: 'h1 { color: navy; }', goal: (D) => (D.same(D.cs('h1', 'color'), 'navy') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: три правила — цвет h1, цвет p, фон body; заголовок не сливается с фоном.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: 'h1 { color: teal; }\np { color: navy; }\nbody { background-color: lavender; }',
      page: p1Page(P1.mine, P1.mine1, P1.mine2),
      list: [
        { t: L3("h1 — rang", 'h1 — цвет', 'h1 — color'), ok: (D) => !!D.val('h1', 'color') },
        { t: L3("p — rang", 'p — цвет', 'p — color'), ok: (D) => !!D.val('p', 'color') },
        { t: L3("body — fon", 'body — фон', 'body — background'), ok: (D) => !!D.val('body', 'background-color') }
      ],
      goal: (D) => {
        if (!D.val('h1', 'color')) return C.t5.needH1;
        if (!D.val('p', 'color')) return C.t5.needP;
        if (!D.val('body', 'background-color')) return C.t5.needBody;
        if (D.same(D.cs('h1', 'color'), D.cs('body', 'background-color'))) return C.t5.same;
        return null;
      },
      sample: ['h1 { color: crimson; }', 'p { color: darkgreen; }', 'body { background-color: lightcyan; }'],
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
    eyebrow: L3("Kodining kafesi", 'Кафе Коди', 'Kodi’s café'),
    say: L3("Salom! Bu mening kafemning sayti. Qarang, qanday chiroyli: iliq fon, rangli sarlavha va matn. Bularning hammasini CSS qilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кафе. Смотри, как красиво: тёплый фон, цветной заголовок и текст. Всё это сделал CSS. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my café’s website. Look how nice it is: a warm background, a colorful heading and text. CSS did all of that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Sahifa oq-qora bo'lib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Страница стала чёрно-белой, а вкладки погасли.', 'Oh no! The CSS code got erased. The page went black and white, and the tabs went dark.'),
    done: L3("HTML joyida, matnlar ham turibdi, faqat bezak yo'q. O'tgan darsda CSS qoidasini o'rgandik: selektor, xususiyat va qiymat. Endi beshta sahifani birma-bir bezaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, тексты тоже, пропало только оформление. На прошлом уроке мы разобрали правило CSS: селектор, свойство и значение. Теперь оформим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine and the texts are there, only the styling is gone. Last lesson we learned a CSS rule: selector, property and value. Now let’s style the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani bezaymiz — kodni siz yozasiz", 'Оформим пять страниц — код пишешь ты', 'Let’s style five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Menyu", 'Меню', 'Menu'),
    say: L3("Birinchi sahifa: menyu. Bu yerda bitta qoida qolgan, u sarlavhani qora qiladi. Sarlavha avvalgidek to'q sariq bo'lsin: qoidadagi rang nomini almashtiring.",
      'Первая страница: меню. Здесь осталось одно правило, оно красит заголовок в чёрный. Пусть заголовок снова станет оранжевым: замени в правиле название цвета.',
      'The first page is the menu. One rule is left here, and it makes the heading black. Let’s make the heading orange again: change the color name in the rule.'),
    ask: L3("Sarlavhani to'q sariq qiling", 'Сделай заголовок оранжевым', 'Make the heading orange'),
    ok: L3("Ajoyib! Sarlavha yana to'q sariq. Menyu jonlandi!", 'Отлично! Заголовок снова оранжевый. Меню ожило!', 'Great! The heading is orange again. The menu is back to life!'),
    hints: [
      L3("Qoidaga qarang: ikki nuqtadan keyin qaysi so'z turibdi? Aynan u rangni beradi.", 'Посмотри на правило: какое слово стоит после двоеточия? Именно оно задаёт цвет.', 'Look at the rule: which word comes after the colon? That’s the one that sets the color.'),
      L3("Bu rang nomi. To'q sariq inglizchada orange. black so'zini o'chirib, orange deb yozing.", 'Это название цвета. Оранжевый по-английски — orange. Сотри black и напиши orange.', 'That’s the color name. Erase black and write orange.'),
      L3("Namuna kod ostida: u abzaslarni ko'k qiladi. Xuddi shunday, sarlavha uchun orange yozing va Tekshirishni bosing.", 'Образец под кодом красит абзацы в синий. Так же напиши orange для заголовка и нажми «Проверить».', 'The example under the code makes paragraphs blue. Write orange for the heading the same way and tap Check.')
    ],
    no: L3("Sarlavha bo'yaldi, lekin to'q sariq emas. To'q sariq inglizchada orange.", 'Заголовок покрасился, но не в оранжевый. Оранжевый по-английски — orange.', 'The heading changed color, but it isn’t orange. Use the word orange.'),
    drill: L3("endi abzaslarni yashil qiling", 'теперь сделай абзацы зелёными', 'now make the paragraphs green'),
    drillNo: L3("Abzaslar hali yashil emas. Yashil inglizchada green.", 'Абзацы пока не зелёные. Зелёный по-английски — green.', 'The paragraphs aren’t green yet. Use the word green.')
  },
  t2: {
    eyebrow: L3("Ichimliklar", 'Напитки', 'Drinks'),
    say: L3("Menyu tayyor! Endi ichimliklar sahifasi. Bu yerda qoida bor, lekin ichi bo'sh: jingalak qavslar o'rtasida hech narsa yo'q. Abzaslar yashil bo'lsin: qavslar ichiga xususiyat va qiymatni yozing.",
      'Меню готово! Теперь страница напитков. Здесь есть правило, но оно пустое: между фигурными скобками ничего нет. Пусть абзацы станут зелёными: впиши в скобки свойство и значение.',
      'The menu is done! Now the drinks page. There’s a rule here, but it’s empty: nothing between the curly braces. Let’s make the paragraphs green: write a property and a value inside the braces.'),
    ask: L3("Abzaslarni yashil qiling: qavslar ichiga yozing", 'Сделай абзацы зелёными: пиши внутри скобок', 'Make the paragraphs green: write inside the braces'),
    ok: L3("Zo'r! Abzaslar yashil bo'ldi. Ichimliklar sahifasi tayyor!", 'Огонь! Абзацы стали зелёными. Страница напитков готова!', 'Awesome! The paragraphs are green. The drinks page is ready!'),
    hints: [
      L3("Matn rangi qaysi xususiyat bilan beriladi? Menyu sahifasidagi qoida esingizdami?", 'Каким свойством задают цвет текста? Вспомни правило со страницы меню.', 'Which property sets the text color? Remember the rule on the menu page.'),
      L3("Matn rangini color beradi. Keyin ikki nuqta, rang nomi va nuqtali vergul keladi. Yashil inglizchada green.", 'Цвет текста задаёт color. Потом двоеточие, название цвета и точка с запятой. Зелёный по-английски — green.', 'color sets the text color. Then a colon, the color name and a semicolon. Green is green.'),
      L3("Namuna kod ostida: u sarlavhani ko'k qiladi. Abzaslar uchun ham xuddi shunday yozing, faqat green bilan.", 'Образец под кодом красит заголовок в синий. Для абзацев напиши так же, только с green.', 'The example under the code makes the heading blue. Write the same for the paragraphs, only with green.')
    ],
    no: L3("Abzaslar hali yashil emas. Qavslar ichida color va green bo'lishi kerak.", 'Абзацы пока не зелёные. Внутри скобок нужны color и green.', 'The paragraphs aren’t green yet. Inside the braces you need color and green.'),
    drill: L3("endi sarlavhani binafsha qiling", 'теперь сделай заголовок фиолетовым', 'now make the heading purple'),
    drillNo: L3("Sarlavha hali binafsha emas. Binafsha inglizchada purple.", 'Заголовок пока не фиолетовый. Фиолетовый по-английски — purple.', 'The heading isn’t purple yet. Use the word purple.')
  },
  t3: {
    eyebrow: L3("Shirinliklar", 'Десерты', 'Desserts'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: shirinliklar. Bu yerda kod umuman yo'q. Butun sahifaning foni pushti bo'lsin: qoidani boshidan oxirigacha o'zingiz yozing. Esingizdami, butun sahifa body selektori bilan tanlanadi.",
      'Две страницы горят! Третья: десерты. Здесь кода нет совсем. Пусть фон всей страницы станет розовым: напиши правило целиком. Помнишь, вся страница выбирается селектором body.',
      'Two pages are lit! The third is desserts. There’s no code here at all. Let’s make the whole page background pink: write the whole rule yourself. Remember, the whole page is picked with the body selector.'),
    ask: L3("Butun sahifa fonini pushti qiling", 'Сделай фон всей страницы розовым', 'Make the whole page background pink'),
    ok: L3("Voy, qanday shirin! Sahifa pushti rangga kirdi.", 'Ого, как вкусно! Страница стала розовой.', 'Wow, how sweet! The page turned pink.'),
    hints: [
      L3("Qoida uch qismdan iborat: nimani bezaymiz, qaysi xususiyat va qanday qiymat.", 'Правило — это три части: что оформляем, какое свойство и какое значение.', 'A rule has three parts: what we style, which property and which value.'),
      L3("Selektor body, xususiyat background-color, qiymat esa pink. Xususiyat va qiymat jingalak qavslar ichida turadi.", 'Селектор body, свойство background-color, значение pink. Свойство и значение стоят в фигурных скобках.', 'The selector is body, the property background-color and the value pink. The property and value go inside curly braces.'),
      L3("Namuna kod ostida: u fonni havorang qiladi. Xuddi shunday qoida yozing, faqat pink bilan.", 'Образец под кодом делает фон голубым. Напиши такое же правило, только с pink.', 'The example under the code makes the background light blue. Write the same rule, only with pink.')
    ],
    no: L3("Sahifa foni hali pushti emas. Fonni background-color beradi, pushti esa pink.", 'Фон страницы пока не розовый. Фон задаёт background-color, а розовый — это pink.', 'The page background isn’t pink yet. background-color sets the background, and pink is pink.'),
    drill: L3("endi abzaslar rangini jigarrang qiling, qoidani o'zingiz yozing", 'теперь сделай абзацы коричневыми, правило пиши сам', 'now make the paragraphs brown, write the rule yourself'),
    drillNo: L3("Abzaslar hali jigarrang emas. Jigarrang inglizchada brown, abzaslar esa p selektori bilan tanlanadi.", 'Абзацы пока не коричневые. Коричневый по-английски — brown, а абзацы выбирает селектор p.', 'The paragraphs aren’t brown yet. Use brown, and the p selector picks paragraphs.')
  },
  t4: {
    eyebrow: L3("Aloqa", 'Контакты', 'Contacts'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: aloqa. Bu kodni men shoshib yozgan edim, unda ikkita joy buzilgan. Brauzer buzilgan yozuvni tashlab yuboradi, shuning uchun ranglar yo'q. Ikkala buzilgan joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: контакты. Этот код я писал в спешке, и в нём две поломки. Браузер сломанные записи выбрасывает, поэтому цветов нет. Найди и почини обе поломки.',
      'Three pages are done! The fourth is contacts. I wrote this code in a hurry, and it has two broken spots. The browser throws broken entries away, so there are no colors. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Ikkala buzilgan joy topildi, aloqa sahifasi yana rangli.", 'Вот это да! Обе поломки найдены, контакты снова в цвете.', 'That’s it! Both broken spots are fixed, and the contacts page is colorful again.'),
    hints: [
      L3("Belgilarni darsdagi qoida bilan solishtiring: xususiyat va qiymat o'rtasida nima turadi? Qiymatdan keyin-chi?", 'Сравни знаки с правилом из урока: что стоит между свойством и значением? А после значения?', 'Compare the signs with the rule from the lesson: what goes between the property and the value? And after the value?'),
      L3("Birinchi qoidada ikki nuqta o'rniga teng belgisi turibdi. Ikkinchisida gray so'zidan keyin nuqtali vergul yo'q.", 'В первом правиле вместо двоеточия стоит «равно». Во втором после gray нет точки с запятой.', 'In the first rule there’s an equals sign instead of a colon. In the second there’s no semicolon after gray.'),
      L3("Namuna kod ostida: ikki xususiyatli to'g'ri qoida. Belgilarni xuddi shunday qo'ying va Tekshirishni bosing.", 'Образец под кодом — верное правило с двумя свойствами. Поставь знаки так же и нажми «Проверить».', 'The example under the code is a correct rule with two properties. Put the signs the same way and tap Check.')
    ],
    no: L3("Belgilar joyida, lekin ranglar boshqa. Sarlavha purple, abzas gray, foni lightyellow bo'lishi kerak.", 'Знаки на месте, но цвета не те. Заголовок — purple, абзац — gray, его фон — lightyellow.', 'The signs are fine, but the colors are different. The heading is purple, the paragraph gray on lightyellow.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Sarlavha hali to'q ko'k emas. color va navy o'rtasidagi belgiga qarang.", 'Заголовок пока не тёмно-синий. Посмотри на знак между color и navy.', 'The heading isn’t navy yet. Look at the sign between color and navy.')
  },
  t5: {
    eyebrow: L3("Mening kafem", 'Моё кафе', 'My café'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki. O'z kafengizni o'ylab toping va sahifasini bo'yang: sarlavha rangi, abzaslar rangi va butun sahifa foni. Ranglarni istalganicha tanlang, brauzer biladiganlarini. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя. Придумай своё кафе и раскрась его страницу: цвет заголовка, цвет абзацев и фон всей страницы. Цвета выбирай любые, какие знает браузер. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours. Make up your own café and color its page: the heading color, the paragraph color and the whole page background. Pick any colors the browser knows. Under the window you can see what’s done.'),
    ask: L3("Sahifangizni bo'yang: uchta qoida", 'Раскрась свою страницу: три правила', 'Color your page: three rules'),
    ok: L3("Ura! Sizning kafengiz tayyor, u o'z ranglaringizda!", 'Ура! Твоё кафе готово, и оно в твоих цветах!', 'Hooray! Your café is ready, in your own colors!'),
    hints: [
      L3("Bitta qoidadan boshlang, masalan sarlavha uchun. Keyin yana ikkitasini qo'shing.", 'Начни с одного правила, например для заголовка. Потом добавь ещё два.', 'Start with one rule, for example for the heading. Then add two more.'),
      L3("Uchta qoida kerak: h1 uchun color, p uchun color va body uchun background-color.", 'Нужны три правила: h1 с color, p с color и body с background-color.', 'You need three rules: h1 with color, p with color and body with background-color.'),
      L3("Namuna kod ostida: boshqa ranglardagi uchta qoida. O'zingizga yoqqan ranglarni tanlang.", 'Образец под кодом — три правила с другими цветами. Выбери свои цвета.', 'The example under the code has three rules in other colors. Pick your own colors.')
    ],
    needH1: L3("Sarlavha uchun qoida yo'q: h1 tegiga color yozing.", 'Нет правила для заголовка: напиши для h1 свойство color.', 'There’s no rule for the heading: write color for h1.'),
    needP: L3("Abzaslar uchun qoida yo'q: p tegiga color yozing.", 'Нет правила для абзацев: напиши для p свойство color.', 'There’s no rule for the paragraphs: write color for p.'),
    needBody: L3("Sahifa foni uchun qoida yo'q: body tegiga background-color yozing.", 'Нет правила для фона: напиши для body свойство background-color.', 'There’s no rule for the background: write background-color for body.'),
    same: L3("Sarlavha fon bilan bir xil rangda, u ko'rinmay qoldi. Boshqa-boshqa rang tanlang.", 'Заголовок того же цвета, что и фон, — его не видно. Выбери разные цвета.', 'The heading is the same color as the background, so you can’t see it. Pick different colors.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kafening beshta sahifasi ham yana rangli! Va bularning hammasini siz o'zingiz yozgan CSS qildi.", 'Все пять страниц кафе снова в цвете! И всё это сделал CSS, написанный твоими руками.', 'All five café pages are colorful again! And the CSS you wrote yourself did all of it.') },
      { k: 'a', text: L3("Siz qoida yozasiz: selektor, jingalak qavslar, xususiyat, ikki nuqta, qiymat va nuqtali vergul.", 'Ты пишешь правило: селектор, фигурные скобки, свойство, двоеточие, значение и точку с запятой.', 'You write a rule: a selector, curly braces, a property, a colon, a value and a semicolon.') },
      { k: 'b', text: L3("Nimani bezashni tanlaysiz: h1, p yoki butun sahifa body.", 'Выбираешь, что оформить: h1, p или всю страницу body.', 'You choose what to style: h1, p or the whole page, body.') },
      { k: 'c', text: L3("color va background-color xususiyatlarini bilasiz.", 'Знаешь свойства color и background-color.', 'You know the color and background-color properties.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: ikki nuqta o'rnidagi teng belgisini va unutilgan nuqtali vergulni.", 'И находишь поломки: «равно» вместо двоеточия и забытую точку с запятой.', 'And you find broken spots: an equals sign instead of a colon, and a forgotten semicolon.') },
      { k: null, text: L3("Keyingi darsda selektorlarni o'rganamiz: hamma abzaslarni emas, faqat keraklisini tanlashni. Ko'rishguncha!", 'На следующем уроке — селекторы: научимся выбирать не все абзацы сразу, а только нужный. До встречи!', 'Next lesson is selectors: we’ll learn to pick not all paragraphs at once, but just the one we need. See you!') }
    ],
    roles: {
      a: L3("qoida: selektor { xususiyat: qiymat; }", 'правило: селектор { свойство: значение; }', 'rule: selector { property: value; }'),
      b: L3("h1, p, body", 'h1, p, body', 'h1, p, body'),
      c: L3("color va background-color", 'color и background-color', 'color and background-color'),
      d: L3("tuzatish: «:» va «;»", 'починка: «:» и «;»', 'fixing: “:” and “;”')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
