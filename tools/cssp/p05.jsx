// =============================================================================
// ===== ПРАКТИКА 5 · «Книжный клуб Коди» · к уроку 5 «Текст и шрифты» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта книжного клуба стёрся CSS: шрифт стал обычным, заголовок съехал к
// краю, под ссылкой снова черта. Ученик чинит пять страниц: размер заголовка (заменить число в готовом правиле) →
// стих по центру (вписать text-align в правило body) → шрифт всей страницы «как в редакторе кода» (правило целиком,
// monospace) → две поломки урока (font-size: 40 без px — загадка урока; centre вместо center) → своя страница книги:
// размер заголовка, шрифт и выравнивание. Дополнительные задачи: размер абзацев, подпись вправо, ссылка без черты,
// bolt вместо bold. «Courier New» без кавычек — не поломка: браузер такое имя принимает (CSS.supports), поэтому
// в практике его нет. 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-05p-tekst-i-shrifty.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-05p-tekst-i-shrifty',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "5-amaliyot. Kodining kitob klubi", ru: 'Практика 5. Книжный клуб Коди', en: 'Practice 5. Kodi’s book club' }
};

// Страницы клуба (тексты на языке урока, не звучат).
const P5 = {
  club: L3("Kitob klubi", 'Книжный клуб', 'Book club'),
  friday: L3("Har juma birga kitob o'qiymiz", 'Каждую пятницу читаем вместе', 'Every Friday we read together'),
  join: L3("Klubga a'zo bo'lish", 'Вступить в клуб', 'Join the club'),
  news: L3("Yangi kitoblar", 'Новинки', 'New books'),
  book1: L3("«Kichkina shahzoda», Ekzyuperi", '«Маленький принц», Экзюпери', '“The Little Prince”, Saint-Exupéry'),
  book2: L3("«Shum bola», G'afur G'ulom", '«Приключения Тома Сойера», Марк Твен', '“Tom Sawyer”, Mark Twain'),
  poems: L3("She'rlar", 'Стихи', 'Poems'),
  autumn: L3("Kuz", 'Осень', 'Autumn'),
  line1: L3("Barglar sarg'aydi,", 'Листья пожелтели,', 'The leaves turned gold,'),
  line2: L3("Salqin shamol esdi,", 'Подул прохладный ветер,', 'A cool wind began to blow,'),
  line3: L3("Kuz bog'imizga keldi.", 'Осень пришла в наш сад.', 'Autumn came to our garden.'),
  kodi: L3("Kodi", 'Коди', 'Kodi'),
  code: L3("Kod haqida", 'Книги про код', 'Coding books'),
  codeH: L3("Kod haqida kitoblar", 'Книги про код', 'Books about code'),
  py: L3("«Python bolalar uchun»", '«Python для детей»', '“Python for Kids”'),
  scratch: L3("«Scratch bilan o'yin yasaymiz»", '«Делаем игры в Scratch»', '“Making Games in Scratch”'),
  read: L3("Parchani o'qish", 'Читать отрывок', 'Read a sample'),
  meet: L3("Uchrashuv", 'Встреча', 'Meetup'),
  meetH: L3("Klub uchrashuvi", 'Встреча клуба', 'Club meetup'),
  when: L3("Juma kuni soat 16:00 da", 'В пятницу в 16:00', 'Friday at 4 pm'),
  where: L3("Kutubxonada, ikkinchi qavat", 'В библиотеке, второй этаж', 'At the library, second floor'),
  mine: L3("Mening kitobim", 'Моя книга', 'My book'),
  mine1: L3("Bu kitob dengiz sarguzashtlari haqida.", 'Эта книга о морских приключениях.', 'This book is about sea adventures.'),
  mine2: L3("Muallif: men", 'Автор: я', 'Author: me')
};
const p5Page = (h, ...ps) => (pk) => '<h1>' + pk(h) + '</h1>' + ps.map((x) => '<p>' + pk(x) + '</p>').join('');
const p5Poem = (pk) => '<h1>' + pk(P5.autumn) + '</h1><p>' + pk(P5.line1) + '</p><p>' + pk(P5.line2) + '</p><p>' + pk(P5.line3) + '</p><p class="author">' + pk(P5.kodi) + '</p>';
const p5Code = (pk) => '<h1>' + pk(P5.codeH) + '</h1><p>' + pk(P5.py) + '</p><p>' + pk(P5.scratch) + '</p><p><a href="#">' + pk(P5.read) + '</a></p>';
const p5Hook = (pk) => '<h1>' + pk(P5.club) + '</h1><p>' + pk(P5.friday) + '</p><p><a href="#">' + pk(P5.join) + '</a></p>';
// Проверки по правилам ученика: есть ли у селектора свойство; есть ли свойство хоть где-то.
const p5Sel = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const p5Has = (D, sel, prop) => D.rules.some((r) => r.sel && r.style && p5Sel(r.sel) === sel && !!r.style.getPropertyValue(prop).trim());
const p5Any = (D, prop) => D.rules.some((r) => r.style && !!r.style.getPropertyValue(prop).trim());
// Вычисленный размер в px с допуском: при ужатии страницы (zoom) браузер отдаёт «35.99px» вместо «36px».
const p5Is = (D, sel, prop, n) => Math.abs(parseFloat(D.cs(sel, prop)) - n) < 0.6;
const p5Mono = (f) => /monospace|courier|consolas|menlo|monaco|lucida console/i.test(String(f || ''));

const PR = {
  next: L3("Elementlar o'lchami", 'Размеры элементов', 'Element sizes'),
  tabs: [
    { ico: 'book', c: '#FA4F28', name: P5.news, file: 'new.html' },
    { ico: 'leaf', c: '#0FA38E', name: P5.poems, file: 'poems.html' },
    { ico: 'rocket', c: '#7C5CFA', name: P5.code, file: 'code.html' },
    { ico: 'pin', c: '#F59E0B', name: P5.meet, file: 'meetup.html' },
    { ico: 'heart', c: '#E44D8A', name: P5.mine, file: 'my.html' }
  ],
  hook: {
    page: p5Hook,
    css: ['  body { font-family: sans-serif; }', '  h1 { font-size: 40px; text-align: center; }', '  a { text-decoration: none; }']
  },
  ownPage: p5Page(P5.mine, P5.mine1, P5.mine2),
  ownDefault: 'h1 { font-size: 40px; text-align: center; }\nbody { font-family: sans-serif; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: заголовок снова крупный — 36px.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: 'h1 { font-size: 16px; }', answer: 'h1 { font-size: 36px; }',
      page: p5Page(P5.news, P5.book1, P5.book2),
      goal: (D) => (p5Is(D, 'h1', 'font-size', 36) ? null : C.t1.no),
      sample: ['p { font-size: 20px; }'],
      drill: { single: true, code0: 'p { font-size: 10px; }', answer: 'p { font-size: 18px; }',
        goal: (D) => (p5Is(D, 'p', 'font-size', 18) ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в готовое правило body: весь стих по центру.
    (pk) => cpTask(2, {
      kind: 'write-declaration', given: ['h1 { color: purple; }'], code0: 'body {\n  \n}', answer: 'body {\n  text-align: center;\n}',
      page: p5Poem,
      goal: (D) => {
        const h = D.cs('h1', 'text-align') === 'center', p = D.cs('p', 'text-align') === 'center';
        if (h && p) return null;
        return h || p ? C.t2.half : C.t2.no;
      },
      sample: ['h1 {', '  text-align: right;', '}'],
      drill: { code0: '.author {\n  \n}', answer: '.author {\n  text-align: right;\n}',
        goal: (D) => (D.cs('.author', 'text-align') === 'right' ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: шрифт всей страницы — как в редакторе кода (monospace).
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: 'body {\n  font-family: monospace;\n}',
      page: p5Code,
      goal: (D) => {
        const h = p5Mono(D.cs('h1', 'font-family')), p = p5Mono(D.cs('p', 'font-family'));
        if (h && p) return null;
        return h || p ? C.t3.half : C.t3.no;
      },
      sample: ['body {', '  font-family: sans-serif;', '}'],
      drill: { code0: '', answer: 'a { text-decoration: none; }',
        goal: (D) => (D.cs('a', 'text-decoration-line') === 'none' ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: число без px (загадка урока) и centre вместо center.
    (pk) => cpTask(4, {
      kind: 'fix', given: ['body { background-color: lavender; }'], code0: 'h1 { font-size: 40; }\np { text-align: centre; }',
      answer: 'h1 { font-size: 40px; }\np { text-align: center; }',
      page: p5Page(P5.meetH, P5.when, P5.where),
      goal: (D) => (p5Is(D, 'h1', 'font-size', 40) && D.cs('p', 'text-align') === 'center' ? null : C.t4.no),
      sample: ['h1 { font-size: 24px; }', 'p { text-align: right; }'],
      drill: { single: true, code0: 'p { font-weight: bolt; }', answer: 'p { font-weight: bold; }',
        goal: (D) => (Number(D.cs('p', 'font-weight')) >= 600 ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: размер заголовка, шрифт, выравнивание; заголовок крупнее текста.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: 'h1 { font-size: 40px; text-align: center; }\nbody { font-family: sans-serif; }',
      page: p5Page(P5.mine, P5.mine1, P5.mine2),
      list: [
        { t: L3("h1 font-size", 'h1 font-size', 'h1 font-size'), ok: (D) => p5Has(D, 'h1', 'font-size') },
        { t: L3("font-family", 'font-family', 'font-family'), ok: (D) => p5Any(D, 'font-family') },
        { t: L3("text-align", 'text-align', 'text-align'), ok: (D) => p5Any(D, 'text-align') }
      ],
      goal: (D) => {
        if (!p5Has(D, 'h1', 'font-size')) return C.t5.needSize;
        if (!p5Any(D, 'font-family')) return C.t5.needFont;
        if (!p5Any(D, 'text-align')) return C.t5.needAlign;
        if (parseFloat(D.cs('h1', 'font-size')) <= parseFloat(D.cs('p', 'font-size'))) return C.t5.small;
        return null;
      },
      sample: ['h1 { font-size: 30px; text-align: right; }', 'p { font-family: monospace; }'],
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
    eyebrow: L3("Kitob klubi", 'Книжный клуб', 'Book club'),
    say: L3("Salom! Mana, kitob klubimning sayti. Qarang-chi: shrift silliq, sarlavha katta bo'lib, qoq o'rtada turibdi, havolaning tagida esa chiziq yo'q. Bu chiroyning hammasini CSS qilgan. Klub saytida beshta sahifa bor, hozir ularni yangilab chiqaman. «Yangilash» tugmasini bosib yuboring-chi!",
      'Привет! Это сайт моего книжного клуба. Смотри: шрифт гладкий, заголовок крупный и стоит по центру, а под ссылкой нет черты. Всё это сделал CSS. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my book club’s website. Look: the font is smooth, the heading is big and centered, and there’s no line under the link. CSS did all of that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Ana xolos, CSS kodi o'chib ketibdi! Shrift oddiy bo'lib qoldi, sarlavha chetga qochib ketdi, havolaning tagida esa yana chiziq paydo bo'libdi.",
      'Ой! CSS-код стёрся. Шрифт стал обычным, заголовок съехал к краю, а под ссылкой снова появилась черта.',
      'Oh no! The CSS code got erased. The font went plain, the heading slid to the edge, and the line under the link came back.'),
    done: L3("Matnlar joyida turibdi, faqat ko'rinishi buzilibdi. O'tgan darsda matn bilan ishlashni o'rgangan edik: harf o'lchami, shrift, qalinlik, tagidagi chiziq va matnning joyi. Shularni eslab, klub sahifalarini bittalab tuzatib chiqamiz, kodni esa siz yozasiz. Beshinchi sahifaga o'zingizning kitobingizni joylaysiz.",
      'Тексты на месте, сломался только их вид. На прошлом уроке мы разобрали текст и шрифты: размер букв, шрифт, жирность, черту и выравнивание. Теперь починим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The texts are fine, only their look broke. Last lesson we learned text and fonts: letter size, font, boldness, lines and alignment. Now let’s fix the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tuzatamiz: kodni siz yozasiz", 'Починим пять страниц: код пишешь ты', 'Let’s fix five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Yangi kitoblar", 'Новинки', 'New books'),
    say: L3("Birinchi bo'lib yangi kitoblar sahifasini ochamiz. Voy, sarlavha shunchalik kichrayib qolibdiki, uni oddiy matndan ajratib bo'lmaydi! Qoidada o'n olti piksel turibdi. Sarlavha o'ttiz olti piksel bo'lsin: qoidadagi sonni almashtiring.",
      'Первая страница: новинки. Заголовок так съёжился, что его не отличить от обычного текста. В правиле стоит шестнадцать пикселей. Пусть заголовок будет тридцать шесть пикселей: замени в правиле число.',
      'The first page is new books. The heading shrank so much that it looks like normal text. The rule says sixteen pixels. Let’s make the heading thirty-six pixels: change the number in the rule.'),
    ask: L3("Sarlavhani 36 piksel qiling", 'Сделай заголовок 36 пикселей', 'Make the heading 36 pixels'),
    ok: L3("Ajoyib! Sarlavha yana o'zining katta holiga qaytdi, endi yangi kitoblar darrov ko'zga tashlanadi.", 'Отлично! Заголовок снова крупный, его сразу видно.', 'Great! The heading is big again, you spot it right away.'),
    hints: [
      L3("Qoidaga bir qarang-chi: ikki nuqtadan keyin son va ikkita harf turibdi. Harflarning o'lchamini aynan shu son beradi.", 'Посмотри на правило: после двоеточия стоит число и две буквы. Именно число задаёт размер букв.', 'Look at the rule: after the colon there’s a number and two letters. The number sets the letter size.'),
      L3("O'n oltini o'chiring-da, o'rniga o'ttiz olti yozing. px esa joyida qolsin, chunki usiz brauzer qiymatni tushunmaydi va o'tkazib yuboradi.", 'Сотри шестнадцать и напиши тридцать шесть. px оставь: без него браузер выбросит значение.', 'Erase sixteen and write thirty-six. Keep px: without it the browser throws the value away.'),
      L3("Kod ostiga namuna qo'ydim: unda abzaslar yigirma piksel bo'lyapti. Sarlavhaga ham xuddi shunday yozing, faqat yigirma o'rniga o'ttiz olti bo'lsin.", 'Образец под кодом делает абзацы размером двадцать пикселей. Для заголовка напиши так же, только тридцать шесть.', 'The example under the code makes paragraphs twenty pixels. Write the same for the heading, only with thirty-six.')
    ],
    no: L3("Sarlavha o'zgardi-ku, lekin o'lchami boshqacha chiqdi. Bizga roppa-rosa o'ttiz olti piksel kerak.", 'Заголовок изменился, но размер другой. Нужно тридцать шесть пикселей.', 'The heading changed, but the size is different. We need thirty-six pixels.'),
    drill: L3("endi abzaslarni 18 piksel qiling", 'теперь сделай абзацы 18 пикселей', 'now make the paragraphs 18 pixels'),
    drillNo: L3("Abzaslarning o'lchami hali boshqacha. Ular o'n sakkiz piksel bo'lishi kerak.", 'Абзацы пока другого размера. Нужно восемнадцать пикселей.', 'The paragraphs are a different size. We need eighteen pixels.')
  },
  t2: {
    eyebrow: L3("She'rlar", 'Стихи', 'Poems'),
    say: L3("Yangi kitoblar sahifasi tayyor! Endi she'rlarga o'tamiz. She'r odatda sahifaning o'rtasida turadi, bizniki esa chap chetga yopishib qolibdi. Qani, butun she'rni o'rtaga qo'ying: body qoidasining ichiga xususiyat bilan qiymatni yozing.",
      'Заголовок снова крупный! Теперь страница стихов. Стихи обычно стоят по центру, а наш прилип к левому краю. Поставь весь стих по центру: впиши в правило для body свойство и значение.',
      'The heading is big again! Now the poems page. Poems usually sit in the middle, but ours is stuck to the left edge. Center the whole poem: write a property and a value inside the body rule.'),
    ask: L3("Butun she'rni o'rtaga qo'ying", 'Поставь весь стих по центру', 'Center the whole poem'),
    ok: L3("Barakalla! She'r qoq o'rtaga kelib oldi, xuddi kitobdagidek chiroyli turibdi.", 'Огонь! Стих встал по центру, как в книге.', 'Awesome! The poem is centered, just like in a book.'),
    hints: [
      L3("Matnni chapga, o'rtaga yoki o'ngga qaysi xususiyat suradi, esingizdami? Darsda sarlavhani aynan shu bilan ko'chirgan edik.", 'Какое свойство ставит текст влево, по центру или вправо? На уроке мы так двигали заголовок.', 'Which property puts text on the left, in the middle or on the right? We moved the heading with it in the lesson.'),
      L3("Bu text-align xususiyati, o'rta esa inglizchada center bo'ladi. Ikki nuqtani ham, oxiridagi nuqtali vergulni ham unutmang.", 'Это text-align. Середина — это center. Не забудь двоеточие и точку с запятой в конце.', 'It’s text-align. The middle is center. Don’t forget the colon and the semicolon at the end.'),
      L3("Pastdagi namunaga qarang-chi: u sarlavhani o'ng tomonga surib qo'yyapti. body uchun ham xuddi shunday yozing, faqat o'ng o'rniga center bo'lsin.", 'Образец под кодом ставит заголовок вправо. Для body напиши так же, только с center.', 'The example under the code puts the heading on the right. Write the same for body, only with center.')
    ],
    no: L3("She'r hali o'rtaga kelmadi. CSS tilida o'rta center deyiladi.", 'Стих пока не по центру. В CSS середина — это center.', 'The poem isn’t centered yet. In CSS the middle is center.'),
    half: L3("Sahifaning bir qismi o'rtaga chiqdi-yu, hammasi emas. Butun sahifani esa body selektori tanlaydi.", 'По центру встала только часть страницы. Всю страницу выбирает селектор body.', 'Only part of the page is centered. The body selector picks the whole page.'),
    drill: L3("endi imzoni o'ngga qo'ying", 'теперь поставь подпись вправо', 'now put the signature on the right'),
    drillNo: L3("Imzo hali o'ng tomonga o'tmadi. O'ng tomon inglizchada right bo'ladi.", 'Подпись пока не справа. Вправо — это right.', 'The signature isn’t on the right yet. Use the value right.')
  },
  t3: {
    eyebrow: L3("Kod haqida", 'Книги про код', 'Coding books'),
    say: L3("She'r o'rtada, juda chiroyli chiqdi! Navbatdagi sahifada kod haqidagi kitoblar turibdi. Shu sahifa kod muharririga o'xshab tursa, zo'r bo'lardi-a? Lekin bu yerda hali birorta ham qoida yo'q. Butun sahifaning shriftini muharrirdagidek qiling: qoidani boshidan oxirigacha o'zingiz yozing.",
      'Стих по центру, красота! Третья страница: книги про код. Вот бы она была похожа на редактор кода! Здесь кода нет совсем. Сделай шрифт всей страницы как в редакторе: правило напиши целиком.',
      'The poem is centered, beautiful! The third page is books about code. Wouldn’t it be cool if it looked like a code editor? There’s no code here at all. Make the whole page’s font like the editor’s: write the whole rule yourself.'),
    ask: L3("Butun sahifa shriftini muharrirdagidek qiling", 'Сделай шрифт всей страницы как в редакторе кода', 'Make the page’s font like the code editor’s'),
    ok: L3("Qoyil! Sahifa xuddi kod muharririga o'xshab qoldi, endi bu kitoblar o'z joyini topdi.", 'Вот это да! Страница стала как редактор кода.', 'Wow! The page looks just like a code editor.'),
    hints: [
      L3("Har qanday qoida uchta bo'lakdan yig'iladi: nimani bezaymiz, qaysi xususiyat va qanaqa qiymat. Xo'sh, butun sahifani qaysi selektor tanlaydi?", 'Правило — это три части: что оформляем, какое свойство и какое значение. Какой селектор выбирает всю страницу?', 'A rule has three parts: what we style, which property and which value. Which selector picks the whole page?'),
      L3("Selektor body bo'ladi, xususiyat esa font-family. Muharrirdagi shriftda hamma harf bir xil kenglikda turadi, uning nomi monospace.", 'Селектор body, свойство font-family. В шрифте редактора все буквы одной ширины, он называется monospace.', 'The selector is body, the property font-family. In the editor’s font every letter is the same width, and it’s called monospace.'),
      L3("Kodning tagida namuna turibdi: u sahifaning shriftini silliq qilyapti. Siz ham xuddi shunday qoida yozing, faqat monospace bilan.", 'Образец под кодом делает шрифт страницы гладким. Напиши такое же правило, только с monospace.', 'The example under the code makes the page’s font smooth. Write the same rule, only with monospace.')
    ],
    no: L3("Shrift hali muharrirdagiga o'xshamayapti. Hamma harfi bir xil kenglikda turadigan shrift monospace deyiladi.", 'Шрифт пока не как в редакторе. Шрифт, где все буквы одной ширины, — это monospace.', 'The font isn’t like the editor’s yet. The font where every letter is the same width is monospace.'),
    half: L3("Shrift sahifaning bir qismida almashdi-yu, hammasida emas. Butun sahifani body selektori tanlaydi, qoidani shunga yozing.", 'Шрифт сменился только у части страницы. Всю страницу выбирает селектор body.', 'The font changed on only part of the page. The body selector picks the whole page.'),
    drill: L3("endi havola tagidagi chiziqni olib tashlang, qoidani o'zingiz yozing", 'теперь убери черту под ссылкой, правило пиши сам', 'now remove the line under the link, write the rule yourself'),
    drillNo: L3("Havolaning tagida hali chiziq turibdi. Uni text-decoration xususiyati none qiymati bilan olib tashlaydi, havolani esa a selektori tanlaydi.", 'Под ссылкой ещё есть черта. Её убирает text-decoration со значением none, а ссылку выбирает селектор a.', 'The link still has a line under it. text-decoration with the value none removes it, and the a selector picks the link.')
  },
  t4: {
    eyebrow: L3("Uchrashuv", 'Встреча', 'Meetup'),
    say: L3("Kod kitoblari ham tayyor, uchta sahifa bo'ldi! Endi klub uchrashuvi haqidagi e'longa o'tamiz. E'lonni uchrashuvga yugurib ketayotib yozgan edim, ikkita joyni buzib qo'yibman. Brauzer bunday qiymatlarni tushunmadi va ularni o'tkazib yubordi, shuning uchun sarlavha kattalashmadi, matn esa chetda qolib ketdi. Qani, ikkala buzilgan joyni topib, tuzatib qo'ying-chi.",
      'Три страницы готовы! Четвёртая: объявление о встрече клуба. Этот код я писал в спешке, и в нём две поломки. Браузер сломанные значения выбрасывает, поэтому заголовок не вырос, а текст остался у края. Найди и почини обе поломки.',
      'Three pages are done! The fourth is the club meetup announcement. I wrote this code in a hurry, and it has two broken spots. The browser throws broken values away, so the heading didn’t grow and the text stayed at the edge. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Buzilgan joylar tuzaldi, endi e'lon uchrashuvga tayyor.", 'Вот это да! Обе поломки найдены, объявление готово.', 'That’s it! Both broken spots are fixed, and the announcement is ready.'),
    hints: [
      L3("Har bir qiymatni darsdagidek tekshirib chiqing-chi: son yonida nima turishi kerak edi? So'z-chi, harfma-harf darsdagidek yozilganmi?", 'Проверь каждое значение, как на уроке: что должно стоять рядом с числом? А слово написано буква в букву, как на уроке?', 'Check each value like in the lesson: what goes next to a number? And is the word spelled letter by letter like in the lesson?'),
      L3("Birinchi qoidada qirq sonining yonida px yo'q, xuddi darsdagi blogimdagidek. Ikkinchisida centre yozilibdi, lekin CSS faqat center so'zini taniydi.", 'В первом правиле у сорока нет px. Во втором написано centre, а CSS знает только center.', 'In the first rule forty has no px. The second says centre, but CSS only knows center.'),
      L3("Ikkita ishlaydigan qoidani namuna qilib kod ostiga qo'ydim. Qiymatlaringizni ular bilan solishtirib tuzating-da, «Tekshirish»ni bosing.", 'Образец под кодом — два рабочих правила. Напиши значения так же и нажми «Проверить».', 'The example under the code has two working rules. Write the values the same way and tap Check.')
    ],
    no: L3("E'lon hali kerakli ko'rinishga kelmadi. Sarlavha qirq piksel bo'lishi, abzaslar esa o'rtada turishi kerak.", 'Страница пока не такая: заголовок должен быть сорок пикселей, а абзацы — по центру.', 'The page isn’t right yet: the heading should be forty pixels and the paragraphs centered.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Abzaslar hali qalin bo'lmadi. Qalin inglizchada bold bo'ladi, so'zning harflarini bittalab tekshirib ko'ring.", 'Абзацы пока не жирные. Жирный — это bold, проверь буквы в слове.', 'The paragraphs aren’t bold yet. Check the letters of the word bold.')
  },
  t5: {
    eyebrow: L3("Mening kitobim", 'Моя книга', 'My book'),
    say: L3("E'lon ham tayyor, to'rtta sahifa jonlandi! Oxirgi sahifa esa sizniki. O'zingizning kitobingizni o'ylab toping-da, uning sahifasini bezang: sarlavhaning o'lchamini, shriftni va matnning joyini o'zingiz tanlaysiz. Qiymatlar ham xohlaganingizcha bo'lsin. Qaysi shartni bajarganingizni oyna ostidagi ro'yxatdan ko'rib turasiz.",
      'Четыре страницы горят! Последняя — твоя. Придумай свою книгу и оформи её страницу: размер заголовка, шрифт и выравнивание текста. Значения выбирай любые. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours. Make up your own book and style its page: the heading size, the font and the text alignment. Pick the values yourself. Under the window you can see what’s done.'),
    ask: L3("Kitobingiz sahifasini bezang", 'Оформи страницу своей книги', 'Style your book’s page'),
    ok: L3("Ura! Kitobingizning sahifasi tayyor, endi klubimiz uni ham o'qiydi!", 'Ура! Страница твоей книги готова, и она такая, как ты хочешь!', 'Hooray! Your book’s page is ready, just the way you want it!'),
    hints: [
      L3("Oldin bitta qoidadan boshlang, masalan, sarlavhaning o'lchamidan. Keyin unga shrift bilan matnning joyini qo'shib borasiz.", 'Начни с одного правила, например с размера заголовка. Потом добавь шрифт и выравнивание.', 'Start with one rule, for example the heading size. Then add the font and the alignment.'),
      L3("h1 tegiga font-size kerak bo'ladi, body tegiga font-family, text-align esa istalgan tegga yozilaveradi.", 'Нужны font-size для h1, font-family для body и text-align для любого тега.', 'You need font-size for h1, font-family for body and text-align for any tag.'),
      L3("Kod ostidagi namunada qiymatlar boshqacha. Siz esa o'zingizga yoqqan o'lcham, shrift va tomonni tanlang.", 'Образец под кодом — с другими значениями. Выбери свой размер, шрифт и сторону.', 'The example under the code uses other values. Pick your own size, font and side.')
    ],
    needSize: L3("Sarlavhaning o'lchami hali berilmabdi. h1 tegiga font-size yozing.", 'Нет размера заголовка: напиши для h1 свойство font-size.', 'There’s no heading size: write font-size for h1.'),
    needFont: L3("Shrift hali tanlanmabdi. Masalan, body tegiga font-family yozib ko'ring.", 'Нет шрифта: напиши, например, для body свойство font-family.', 'There’s no font: write font-family, for example for body.'),
    needAlign: L3("Matn qayerda turishi hali aytilmabdi. Istalgan tegga text-align yozing, masalan, sarlavhaga.", 'Нет выравнивания: напиши text-align для любого тега, например для заголовка.', 'There’s no alignment: write text-align for any tag, for example the heading.'),
    small: L3("Voy, sarlavha oddiy matndan ham kichik bo'lib qolibdi! Uni kattaroq qiling, sarlavha doim ko'zga tashlanib tursin.", 'Заголовок получился мельче текста. Сделай его крупнее: заголовок должен бросаться в глаза.', 'The heading came out smaller than the text. Make it bigger: a heading should stand out.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kitob klubimning sayti yana ko'rkam bo'ldi! Beshala sahifani ham sizning CSS kodingiz bezadi.", 'Все пять страниц клуба снова красивые! И всё это сделал твой CSS.', 'All five club pages look great again! And your own CSS did all of it.') },
      { k: 'a', text: L3("Harflarning o'lchamini font-size beradi: unga son va yonida px kerak bo'ladi.", 'Размер букв задаёт font-size: число и px.', 'font-size sets the letter size: a number and px.') },
      { k: 'b', text: L3("Shriftni font-family tanlaydi: masalan, silliq sans-serif yoki kod kitoblari sahifasidagi monospace.", 'Шрифт выбирает font-family: например, гладкий sans-serif или monospace, как в редакторе.', 'font-family picks the font: for example, smooth sans-serif or monospace, like in the editor.') },
      { k: 'c', text: L3("text-align matnni o'rtaga yoki chetga suradi, font-weight uni qalin qiladi, text-decoration esa tagidagi chiziqni olib tashlaydi.", 'text-align ставит текст по центру или к краю, font-weight делает жирным, а text-decoration убирает черту.', 'text-align puts text in the middle or at an edge, font-weight makes it bold, and text-decoration removes the line.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topa olasiz: yonida px yo'q sonni ham, brauzer tanimaydigan centre so'zini ham.", 'И находишь поломки: число без px и слово centre, которого браузер не знает.', 'And you find broken spots: a number without px, and the word centre that the browser doesn’t know.') },
      { k: null, text: L3("Keyingi darsda elementlarning enini va bo'yini o'zgartirishni o'rganamiz. Ko'rishguncha!", 'На следующем уроке — размеры элементов: ширина и высота. До встречи!', 'Next lesson is element sizes: width and height. See you!') }
    ],
    roles: {
      a: L3("font-size: 36px", 'font-size: 36px', 'font-size: 36px'),
      b: L3("font-family: monospace", 'font-family: monospace', 'font-family: monospace'),
      c: L3("text-align, font-weight, text-decoration", 'text-align, font-weight, text-decoration', 'text-align, font-weight, text-decoration'),
      d: L3("tuzatish: px va center", 'починка: px и center', 'fixing: px and center')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
