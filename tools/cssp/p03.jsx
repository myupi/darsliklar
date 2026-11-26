// =============================================================================
// ===== ПРАКТИКА 3 · «Космос Коди» · к уроку 3 «Цвета» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта Коди про космос стёрся CSS: небо, планеты и звёзды стали чёрно-белыми.
// Ученик раскрашивает пять страниц тремя способами урока: заменить название цвета на тёмный вариант (blue →
// darkblue, ночное небо) → вписать цвет Марса hex-кодом из строки задания (палитра — в строке задания) → написать
// правило целиком через rgb: жёлтый фон Солнца из красного и зелёного лучей → починить две поломки урока (нет «#»,
// пять знаков; в дополнительной — опечатка в названии gren) → своя планета: цвет заголовка и фон, хотя бы один
// цвет кодом (hex или rgb), условия «готово» видны. hsl только назван в уроке — в практике его нет.
// Честно: rgb(300, 0, 0) браузер принимает (обрезает до 255), поэтому «число больше 255» ловит своя проверка
// задания (урок учил: от 0 до 255); rgb без запятых современный браузер тоже принимает — как поломку не берём.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-03p-cveta.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-03p-cveta',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "3-amaliyot. Kodining koinoti", ru: 'Практика 3. Космос Коди', en: 'Practice 3. Kodi’s space' }
};

// Страницы сайта про космос (тексты на языке урока).
const P3 = {
  home: L3("Kodining koinoti", 'Космос Коди', 'Kodi’s space'),
  home1: L3("Sayyoralar va yulduzlar haqida", 'О планетах и звёздах', 'About planets and stars'),
  home2: L3("Har kuni yangi sir", 'Каждый день новая тайна', 'A new secret every day'),
  night: L3("Tun osmoni", 'Ночное небо', 'Night sky'),
  night1: L3("Yulduzlar charaqlayapti", 'Звёзды сверкают', 'The stars are shining'),
  night2: L3("Bugun Oy to'lin", 'Сегодня полнолуние', 'Full moon tonight'),
  mars: L3("Mars", 'Марс', 'Mars'),
  mars1: L3("Qizil sayyora", 'Красная планета', 'The red planet'),
  mars2: L3("Unda chang bo'ronlari bo'ladi", 'На нём бывают пыльные бури', 'It has dust storms'),
  sun: L3("Quyosh", 'Солнце', 'The Sun'),
  sun1: L3("Bizga eng yaqin yulduz", 'Ближайшая к нам звезда', 'The star closest to us'),
  sun2: L3("U juda issiq", 'Оно очень горячее', 'It’s very hot'),
  earth: L3("Yer", 'Земля', 'Earth'),
  earth1: L3("Bizning uyimiz", 'Наш дом', 'Our home'),
  earth2: L3("Okeanlar va o'rmonlar sayyorasi", 'Планета океанов и лесов', 'A planet of oceans and forests'),
  mine: L3("Mening sayyoram", 'Моя планета', 'My planet'),
  mine1: L3("Bu yerda doim bahor", 'Здесь всегда весна', 'It’s always spring here'),
  mine2: L3("Mehmonga keling!", 'Прилетайте в гости!', 'Come and visit!')
};
const p3Page = (a, b, c) => (pk) => '<h1>' + pk(a) + '</h1><p>' + pk(b) + '</p><p>' + pk(c) + '</p>';

// Один ли это цвет — из списка подходящих (тёмно-синий: darkblue, navy, midnightblue).
const p3Any = (D, v, list) => list.some((c) => D.same(v, c));
// Число больше 255 в rgb( … ): браузер его молча обрежет, а урок учил — от 0 до 255.
const p3Big = (code) => {
  const re = /rgba?\s*\(([^)]*)\)/gi;
  let m;
  while ((m = re.exec(String(code || '')))) { if (m[1].split(/[\s,]+/).some((x) => /^\d+$/.test(x) && Number(x) > 255)) return true; }
  return false;
};
const p3Rgb = (code) => /rgb\s*\(/i.test(String(code || ''));
// Цвет записан кодом: hex после двоеточия или rgb( … ).
const p3Code = (code) => /:\s*(#[0-9a-f]{3,8}\b|rgb\s*\()/i.test(String(code || ''));
// Есть ли правило с этим селектором и свойством.
const p3Has = (D, sel, prop) => D.rules.some((r) => r.sel && r.sel.replace(/\s+/g, '').toLowerCase() === sel && r.style && !!r.style.getPropertyValue(prop).trim());

const PR = {
  next: L3("Fon", 'Фон', 'Background'),
  tabs: [
    { ico: 'star', c: '#7C5CFA', name: P3.night, file: 'tun.html' },
    { ico: 'rocket', c: '#E2553F', name: P3.mars, file: 'mars.html' },
    { ico: 'sun', c: '#F59E0B', name: P3.sun, file: 'quyosh.html' },
    { ico: 'leaf', c: '#0FA38E', name: P3.earth, file: 'yer.html' },
    { ico: 'palette', c: '#E44D8A', name: P3.mine, file: 'my.html' }
  ],
  hook: {
    page: p3Page(P3.home, P3.home1, P3.home2),
    css: ['  body { background-color: #0B1D51; }', '  h1 { color: gold; }', '  p { color: rgb(255, 255, 255); }']
  },
  ownPage: p3Page(P3.mine, P3.mine1, P3.mine2),
  ownDefault: 'h1 { color: #FFD54A; }\np { color: white; }\nbody { background-color: rgb(30, 20, 90); }',
  tasks: [
    // Т1 · заменить название цвета: ночное небо тёмно-синее (blue → darkblue; navy и midnightblue тоже тёмно-синие).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: 'body { background-color: blue; }', answer: 'body { background-color: darkblue; }',
      page: p3Page(P3.night, P3.night1, P3.night2), given: ['h1 { color: gold; }', 'p { color: white; }'],
      goal: (D) => (p3Any(D, D.cs('body', 'background-color'), ['darkblue', 'navy', 'midnightblue']) ? null : C.t1.no),
      sample: ['body { background-color: darkgreen; }'],
      drill: { single: true, code0: 'p { color: white; }', answer: 'p { color: lightblue; }',
        goal: (D) => (p3Any(D, D.cs('p', 'color'), ['lightblue', 'lightskyblue']) ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и hex-код в готовое правило: заголовок цвета Марса (код — в строке задания).
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: 'h1 {\n  \n}', answer: 'h1 {\n  color: #C1440E;\n}', syms: ['{', '}', ':', ';', '#'],
      page: p3Page(P3.mars, P3.mars1, P3.mars2), given: ['body { background-color: linen; }'],
      goal: (D) => (D.same(D.cs('h1', 'color'), '#C1440E') ? null : C.t2.no),
      sample: ['h1 {', '  color: #1E90FF;', '}'],
      drill: { code0: 'p {\n  \n}', answer: 'p {\n  color: #7F8C8D;\n}', goal: (D) => (D.same(D.cs('p', 'color'), '#7F8C8D') ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком через rgb: жёлтый фон Солнца — красный и зелёный лучи на полную.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: 'body {\n  background-color: rgb(255, 255, 0);\n}', syms: ['{', '}', ':', ';', '(', ')', ','],
      page: p3Page(P3.sun, P3.sun1, P3.sun2),
      goal: (D) => {
        if (p3Big(D.code)) return C.t3.big;
        if (!D.same(D.cs('body', 'background-color'), 'yellow')) return C.t3.no;
        if (!p3Rgb(D.code)) return C.t3.notRgb;
        return null;
      },
      sample: ['body {', '  background-color: rgb(0, 255, 255);', '}'],
      drill: { code0: '', answer: 'h1 { color: rgb(255, 0, 0); }',
        goal: (D) => {
          if (p3Big(D.code)) return C.t3.big;
          if (!D.same(D.cs('h1', 'color'), 'red')) return C.t3.drillNo;
          if (!p3Rgb(D.code)) return C.t3.notRgb;
          return null;
        } }
    }),
    // Т4 · починить два hex-кода: нет «#»; пять знаков вместо шести. Дополнительная — опечатка в названии (gren).
    (pk) => cpTask(4, {
      kind: 'fix', code0: 'h1 { color: 2E86DE; }\np { color: #27AE6; }', answer: 'h1 { color: #2E86DE; }\np { color: #27AE60; }',
      page: p3Page(P3.earth, P3.earth1, P3.earth2), syms: ['{', '}', ':', ';', '#'],
      goal: (D) => (D.same(D.cs('h1', 'color'), '#2E86DE') && D.same(D.cs('p', 'color'), '#27AE60') ? null : C.t4.no),
      sample: ['h1 { color: #8E44AD; }'],
      drill: { single: true, code0: 'h1 { color: gren; }', answer: 'h1 { color: green; }',
        goal: (D) => (D.same(D.cs('h1', 'color'), 'green') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя планета: цвет h1 и фон body; хотя бы один цвет кодом (hex или rgb); заголовок не сливается с фоном.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', syms: ['{', '}', ':', ';', '#', '(', ')', ','],
      answer: 'h1 { color: gold; }\np { color: rgb(255, 255, 255); }\nbody { background-color: #1B1464; }',
      page: p3Page(P3.mine, P3.mine1, P3.mine2),
      list: [
        { t: L3("h1 — rang", 'h1 — цвет', 'h1 — color'), ok: (D) => p3Has(D, 'h1', 'color') },
        { t: L3("body — fon", 'body — фон', 'body — background'), ok: (D) => p3Has(D, 'body', 'background-color') },
        { t: L3("kod bilan: # yoki rgb", 'кодом: # или rgb', 'as a code: # or rgb'), ok: (D) => p3Code(D.code) && D.decls() > 0 }
      ],
      goal: (D) => {
        if (p3Big(D.code)) return C.t3.big;
        if (!p3Has(D, 'h1', 'color')) return C.t5.needH1;
        if (!p3Has(D, 'body', 'background-color')) return C.t5.needBody;
        if (!p3Code(D.code)) return C.t5.needCode;
        if (D.same(D.cs('h1', 'color'), D.cs('body', 'background-color'))) return C.t5.same;
        return null;
      },
      sample: ['h1 { color: #FA4F28; }', 'p { color: white; }', 'body { background-color: rgb(20, 30, 80); }'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, no …; печатаются: eyebrow, ask, drill, roles, list.
// В речи нет кодов с «#»: код цвета — в строке задания (печатается), голос говорит «kod vazifa qatorida».
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining koinoti", 'Космос Коди', 'Kodi’s space'),
    say: L3("Salom! Mana, mening koinot haqidagi saytim. Qarang-chi: fon tungi osmondek to'q ko'k bo'lib turibdi, sarlavha oltindek yaltiraydi, matn esa oppoq. Bu ranglar uch xil usulda yozilgan: nomi bilan, hex kod bilan va rgb bilan. Saytimda beshta sahifa bor, bugun ularning hammasini yangilamoqchiman. Qani, «Yangilash» tugmasini bosing-chi!",
      'Привет! Это мой сайт про космос. Смотри: фон тёмно-синий, заголовок золотой, а текст белоснежный. Цвета записаны тремя способами: названием, hex-кодом и через rgb. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my website about space. Look: the background is dark blue, the heading is gold, and the text is snow-white. The colors are written in three ways: by name, with a hex code and with rgb. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy, qarang! Yangilayotganimda CSS kodi o'chib ketibdi. Koinotim bir zumda oq-qora bo'lib qoldi, tepadagi varaqlar ham o'chib qolibdi.", 'Ой! CSS-код стёрся. Космос стал чёрно-белым, а вкладки погасли.', 'Oh no! The CSS code got erased. Space went black and white, and the tabs went dark.'),
    done: L3("Xayriyatki, HTML joyida turibdi, faqat ranglar yo'qolibdi. O'tgan darsda rangni uch xil yozishni o'rgangan edik-ku: nomi bilan, palitradagi hex kod bilan va rgb ichidagi uchta nur bilan. Shu uch usul bilan koinotni qaytadan bo'yab chiqamiz: sahifalarni bittalab ochamiz, kodni esa siz yozasiz. Beshinchi sahifada o'zingizning sayyorangiz bo'ladi.",
      'HTML на месте, пропали только цвета. На прошлом уроке мы научились записывать цвет тремя способами: названием, hex-кодом из палитры и тремя лучами в rgb. Теперь раскрасим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, only the colors are gone. Last lesson we learned three ways to write a color: by name, with a hex code from the palette and with three lights in rgb. Now let’s color the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani bo'yaymiz: kodni siz yozasiz", 'Раскрасим пять страниц: код пишешь ты', 'Let’s color five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Tun osmoni", 'Ночное небо', 'Night sky'),
    say: L3("Koinot bo'ylab sayohatni tun osmonidan boshlaymiz. Qarang-chi, fon ko'k-u, lekin juda yorqin, xuddi kunduzgi osmondek. Tunda esa osmon ancha to'q bo'ladi. Esingizdami, rang nomining oldiga dark so'zi qo'shilsa, rang to'qroq chiqadi. Qani, qoidadagi rang nomini almashtirib ko'ring.",
      'Первая страница: ночное небо. Смотри, фон синий, но слишком яркий, как днём. Ночью небо темнее. Помнишь: если перед названием цвета стоит dark, цвет становится тёмным. Замени в правиле название цвета.',
      'The first page is the night sky. Look, the background is blue, but too bright, like in the daytime. At night the sky is darker. Remember: if dark comes before a color name, the color gets dark. Change the color name in the rule.'),
    ask: L3("Tun osmonini to'q ko'k qiling", 'Сделай ночное небо тёмно-синим', 'Make the night sky dark blue'),
    ok: L3("Ajoyib, endi haqiqiy tun bo'ldi! Osmon to'q ko'k tusga kirdi, yulduzlar esa unda yanada yorqin charaqlayapti.", 'Отлично! Вот теперь настоящая ночь: небо тёмно-синее, звёзды сверкают.', 'Great! Now it’s a real night: the sky is dark blue and the stars are shining.'),
    hints: [
      L3("Qoidaga bir qarang-chi: ikki nuqtadan keyin blue so'zi turibdi. Osmonni to'qroq qilish uchun uning oldiga qaysi so'zni qo'shamiz?", 'Посмотри на правило: после двоеточия стоит blue. Что добавить перед ним, чтобы он стал темнее?', 'Look at the rule: blue comes after the colon. What do we add in front to make it darker?'),
      L3("To'q ranglarning nomi dark so'zi bilan boshlanadi-ku. Demak, blue o'rniga darkblue yozamiz, o'rtasiga bo'sh joy qo'ymasdan.", 'Тёмный цвет начинается со слова dark. Вместо blue напиши darkblue, без пробела.', 'A dark color starts with the word dark. Instead of blue write darkblue, with no space.'),
      L3("Kod ostiga bitta namuna qo'yib qo'ydim: u fonni to'q yashil qilyapti. Siz ham xuddi shunday yozing, faqat yashil o'rniga bizga ko'k kerak: darkblue. Keyin «Tekshirish»ni bosing.", 'Образец под кодом делает фон тёмно-зелёным. Так же напиши darkblue для синего и нажми «Проверить».', 'The example under the code makes the background dark green. Write darkblue for blue the same way and tap Check.')
    ],
    no: L3("Osmon hali ham yorqin ko'rinyapti, to'q ko'k bo'lmadi. To'q ko'k inglizchada darkblue bo'ladi.", 'Небо пока не тёмно-синее. Тёмно-синий по-английски — darkblue.', 'The sky isn’t dark blue yet. Dark blue is darkblue.'),
    drill: L3("endi abzaslarni och ko'k qiling", 'теперь сделай абзацы светло-голубыми', 'now make the paragraphs light blue'),
    drillNo: L3("Abzaslar hali och ko'k tusga kirmadi. Och ranglarning nomi light so'zi bilan boshlanadi, demak, bizga lightblue kerak.", 'Абзацы пока не светло-голубые. Светлый цвет начинается с light: lightblue.', 'The paragraphs aren’t light blue yet. A light color starts with light: lightblue.')
  },
  t2: {
    eyebrow: L3("Mars", 'Марс', 'Mars'),
    say: L3("Tun tayyor, endi Marsga uchamiz! Marsning rangi o'ziga xos: oddiy qizil ham emas, to'q sariq ham emas. Bunaqa rangning nomi yo'q, shuning uchun uning kodini vazifa qatoriga yozib qo'ydim. Qani, sarlavhani Mars rangiga bo'yang: jingalak qavslar ichiga xususiyat bilan kodni yozing.",
      'Ночь готова! Теперь страница Марса. Цвет у Марса особенный: не просто красный и не оранжевый. Названия у такого цвета нет, поэтому его код я написал в строке задания. Покрась заголовок в цвет Марса: впиши в скобки свойство и код.',
      'The night is done! Now the Mars page. Mars has a special color: not plain red, not orange. A color like that has no name, so I wrote its code in the task line. Color the heading like Mars: write the property and the code inside the braces.'),
    ask: L3("Sarlavhani Mars rangiga bo'yang: #C1440E", 'Покрась заголовок в цвет Марса: #C1440E', 'Color the heading like Mars: #C1440E'),
    ok: L3("Barakalla! Sarlavha xuddi Marsning o'zidek qizarib turibdi. Ko'rdingizmi, hex kod aynan o'sha rangni berdi.", 'Огонь! Заголовок прямо как сам Марс. hex-код дал точно тот цвет.', 'Awesome! The heading looks just like Mars. The hex code gave exactly that color.'),
    hints: [
      L3("Matnning rangini qaysi xususiyat beradi, esingizdami? Qiymatiga esa vazifa qatoridagi kodni qo'yamiz.", 'Каким свойством задают цвет текста? А значением будет код из строки задания.', 'Which property sets the text color? The value is the code from the task line.'),
      L3("Bizga color xususiyati kerak. Undan keyin ikki nuqta qo'ying, so'ng panjara belgisi bilan oltita belgini yozing, oxirida esa nuqtali vergul tursin. Kodni vazifa qatoridan belgima-belgi ko'chiring.", 'Свойство — color. Потом двоеточие, решётка и шесть знаков, в конце точка с запятой. Перепиши код из строки задания знак в знак.', 'The property is color. Then a colon, a hash sign and six symbols, and a semicolon at the end. Copy the code from the task line symbol by symbol.'),
      L3("Pastga qarang-chi: kod ostida namuna paydo bo'ldi, u sarlavhani ko'k kod bilan bo'yayapti. Siz ham xuddi shunday yozing, faqat ko'k kod o'rniga Mars kodini qo'ying.", 'Образец под кодом красит заголовок синим кодом. Напиши так же, только с кодом Марса.', 'The example under the code colors the heading with a blue code. Write the same, only with the Mars code.')
    ],
    no: L3("Sarlavha boshqa rangga kirib qolibdi, Marsga o'xshamayapti. Kodni vazifa qatoridan yana bir bor aniq ko'chiring: panjara belgisi va oltita belgi.", 'Заголовок другого цвета. Перепиши код из строки задания точно: решётка и шесть знаков.', 'The heading is a different color. Copy the code from the task line exactly: a hash sign and six symbols.'),
    drill: L3("endi abzaslarni Mars toshlaridek kulrang qiling: #7F8C8D", 'теперь сделай абзацы серыми, как камни Марса: #7F8C8D', 'now make the paragraphs gray like Mars rocks: #7F8C8D'),
    drillNo: L3("Bu kulrang Mars toshlarinikidan boshqacha chiqdi. Kerakli kod vazifa qatorida turibdi, uni o'sha yerdan ko'chiring.", 'Абзацы пока не того серого цвета. Перепиши код из строки задания.', 'The paragraphs aren’t that gray yet. Copy the code from the task line.')
  },
  t3: {
    eyebrow: L3("Quyosh", 'Солнце', 'The Sun'),
    say: L3("Tun ham, Mars ham jonlandi! Endi Quyoshga yaqinlashamiz. Bu sahifada CSS kodi umuman yo'q ekan. Butun sahifaning foni sariq bo'lsin, lekin bu safar rangni rgb bilan yozamiz. Esingizdami, ekran har bir rangni uchta nurdan yig'adi. Xo'sh, qaysi nurlar qo'shilsa, sariq chiqadi? Qoidani boshidan oxirigacha o'zingiz yozib ko'ring.",
      'Две страницы горят! Третья: Солнце. Здесь кода нет совсем. Пусть фон всей страницы станет жёлтым, но на этот раз через rgb. Помнишь, экран собирает цвет из трёх лучей. Какие лучи вместе дают жёлтый? Напиши правило целиком, от начала до конца.',
      'Two pages are lit! The third is the Sun. There’s no code here at all. Let’s make the whole page background yellow, but this time with rgb. Remember, a screen builds a color from three lights. Which lights together make yellow? Write the whole rule yourself.'),
    ask: L3("Sahifa fonini rgb bilan sariq qiling", 'Сделай фон страницы жёлтым через rgb', 'Make the page background yellow with rgb'),
    ok: L3("Qoyil! Qizil bilan yashil nur birga yondi-yu, sahifa quyoshdek sap-sariq bo'lib charaqladi.", 'Вот это да! Красный и зелёный лучи зажглись вместе, и страница стала жёлтой, как солнце.', 'Wow! The red and green lights came on together, and the page turned sunny yellow.'),
    hints: [
      L3("Qoidada uchta qism bo'ladi: butun sahifa, fon xususiyati va rgb qiymati. rgb qavsining ichida esa uchta son turadi: qizil, yashil va ko'k nur uchun.", 'Правило — три части: вся страница, свойство фона и значение rgb. В rgb три числа: красный, зелёный и синий луч.', 'The rule has three parts: the whole page, the background property and an rgb value. rgb holds three numbers: the red, green and blue lights.'),
      L3("Sariq rang qizil bilan yashil nurdan chiqadi: ikkalasini ham ikki yuz ellik beshga qo'ying, ko'kini esa nolga. Selektor body bo'ladi, xususiyat esa background-color.", 'Жёлтый — это красный и зелёный лучи: оба по двести пятьдесят пять, а синий — ноль. Селектор body, свойство background-color.', 'Yellow is red and green light: both at two hundred fifty-five, and blue at zero. The selector is body, the property background-color.'),
      L3("Kodning tagida namuna turibdi: unda yashil bilan ko'k nur yoqilgan. Siz ham xuddi shunday qoida yozing, faqat bu safar qizil bilan yashilni yoqing.", 'Образец под кодом зажигает зелёный и синий лучи. Напиши такое же правило, только зажги красный и зелёный.', 'The example under the code turns on green and blue light. Write the same rule, only turn on red and green.')
    ],
    no: L3("Fon hali sariq tusga kirmadi. Sariq uchun qizil bilan yashil nur to'liq yonishi kerak, ko'k esa o'chiq turadi.", 'Фон пока не жёлтый. Для жёлтого красный и зелёный горят на полную, а синий выключен.', 'The background isn’t yellow yet. For yellow, red and green are on full and blue is off.'),
    notRgb: L3("Rangni topdingiz-ku! Lekin bu safar uni rgb bilan yozing: qavs ichida uchta son bo'lsin.", 'Цвет получился, но на этот раз запиши его через rgb: три числа в скобках.', 'The color is right, but this time write it with rgb: three numbers in brackets.'),
    big: L3("Shoshilmang, bunaqa katta son bo'lmaydi: eng kuchli nur ham ikki yuz ellik beshdan oshmaydi.", 'Такого большого числа не бывает: луч не горит сильнее двухсот пятидесяти пяти.', 'No number that big: a light can’t go above two hundred fifty-five.'),
    drill: L3("endi sarlavhani rgb bilan qizil qiling, qoidani o'zingiz yozing", 'теперь сделай заголовок красным через rgb, правило пиши с нуля', 'now make the heading red with rgb, write the rule yourself'),
    drillNo: L3("Sarlavha hali qizarmadi. Qizil uchun faqat birinchi nur to'liq yonadi, qolgan ikkitasi esa nolda turadi.", 'Заголовок пока не красный. Для красного на полную горит только первый луч, два других — ноль.', 'The heading isn’t red yet. For red, only the first light is on full; the other two are zero.')
  },
  t4: {
    eyebrow: L3("Yer", 'Земля', 'Earth'),
    say: L3("Quyosh ham porlab turibdi! Endi o'zimizning uyimiz, Yer sayyorasiga qaytamiz. Bu sahifada ranglarni palitradan shoshib ko'chirgan ekanman, ikkita kod buzilib qolibdi. Brauzer buzilgan kodni tanimaydi-yu, uni o'tkazib yuboradi. Ularni vazifa qatoridagi kodlar bilan solishtirib chiqing-da, ikkalasini ham tuzating.",
      'Три страницы готовы! Четвёртая: Земля. Здесь я в спешке переписывал цвета из палитры, и два кода сломались. Браузер сломанный код не узнаёт и выбрасывает. Сравни с кодами в строке задания и почини оба.',
      'Three pages are done! The fourth is Earth. I copied the colors from the palette in a hurry, and two codes broke. The browser doesn’t recognize a broken code and throws it away. Compare with the codes in the task line and fix both.'),
    ask: L3("Kodlarni tuzating: #2E86DE va #27AE60", 'Почини коды: #2E86DE и #27AE60', 'Fix the codes: #2E86DE and #27AE60'),
    ok: L3("Mana, tuzaldi! Sarlavha okeandek ko'k, abzaslar esa o'rmondek yam-yashil bo'ldi. Yerimiz yana o'z ranglariga qaytdi!", 'Есть, починено! Заголовок синий, как океан, абзацы зелёные, как лес: Земля снова в своих цветах.', 'Fixed it! The heading is ocean blue, the paragraphs are forest green: Earth is in its own colors again.'),
    hints: [
      L3("Har bir kodni vazifa qatoridagisi bilan solishtirib ko'ring-chi: boshida nima turibdi-yu, belgilar nechta ekan?", 'Сравни каждый код с кодом из строки задания: что стоит в начале? Сколько знаков?', 'Compare each code with the one in the task line: what’s at the start? How many symbols?'),
      L3("Birinchi kodning boshida panjara belgisi tushib qolibdi. Ikkinchisida esa beshta belgi qolibdi, chunki oxiridagi nol yo'qolgan.", 'В первом коде потерялась решётка. Во втором осталось пять знаков: нет последнего нуля.', 'The first code lost its hash sign. The second has only five symbols: the last zero is missing.'),
      L3("Endi kodning tagiga qarang: u yerda butun hex kod namunasi turibdi, panjara belgisi va oltita belgi. Ikkala kodni ham shunday qilib tuzating-da, «Tekshirish»ni bosing.", 'Образец под кодом — верный hex-код: решётка и шесть знаков. Сделай оба кода такими и нажми «Проверить».', 'The example under the code is a correct hex code: a hash sign and six symbols. Make both codes like that and tap Check.')
    ],
    no: L3("Kodlar ishlay boshladi, lekin ranglar boshqacha chiqyapti. Ularni vazifa qatoridagi kodlar bilan yana bir bor solishtirib ko'ring.", 'Коды работают, но цвета не те. Сверь их ещё раз с кодами в строке задания.', 'The codes work, but the colors are different. Compare them with the codes in the task line again.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Sarlavha hali yashil bo'lmadi. Rang nomini harfma-harf tekshirib ko'ring: u green deb yoziladi.", 'Заголовок пока не зелёный. Проверь название цвета буква за буквой: green.', 'The heading isn’t green yet. Check the color name letter by letter: green.')
  },
  t5: {
    eyebrow: L3("Mening sayyoram", 'Моя планета', 'My planet'),
    say: L3("Yer ham o'z ranglariga qaytdi, to'rtta sahifa tayyor! Endi koinotga o'zingizning sayyorangizni qo'shamiz: uni o'ylab toping-da, xohlagan rangingizga bo'yang. Sarlavhaga rang tanlang, sahifaga esa fon. Faqat bitta shartim bor: kamida bitta rangni kod bilan yozing, hex yoki rgb bilan. Qaysi shart bajarilgani oyna ostidagi ro'yxatda belgilanib boradi.",
      'Четыре страницы горят! Последняя — твоя: придумай свою планету и раскрась её. Выбери цвет заголовка и фон страницы. Одно условие: хотя бы один цвет запиши кодом, hex или rgb. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: invent your own planet and color it. Pick the heading color and the page background. One condition: write at least one color as a code, hex or rgb. Under the window you can see what’s done.'),
    ask: L3("Sayyorangizni bo'yang", 'Раскрась свою планету', 'Color your planet'),
    ok: L3("Ura! Koinotda yangi sayyora paydo bo'ldi, u o'zingiz tanlagan ranglarda porlayapti!", 'Ура! Твоя планета готова, и она сияет твоими цветами!', 'Hooray! Your planet is ready, shining in your own colors!'),
    hints: [
      L3("Ikkita qoidadan boshlang-chi: biri sarlavha uchun, ikkinchisi butun sahifa uchun bo'ladi.", 'Начни с двух правил: одно для заголовка, другое для всей страницы.', 'Start with two rules: one for the heading, one for the whole page.'),
      L3("h1 tegiga color xususiyatini, body tegiga esa background-color xususiyatini yozing. Ranglarni nomi bilan ham, hex kod yoki rgb bilan ham yozish mumkin, faqat bittasi kod bo'lsin.", 'Нужны h1 с color и body с background-color. Пиши цвет названием, hex-кодом или через rgb, но один — кодом.', 'You need h1 with color and body with background-color. Write colors by name, hex or rgb, but make one a code.'),
      L3("Kod ostidagi namunaga qarang: unda rangni yozishning uchala usuli ham bor. Undan nusxa olish shart emas, sayyorangiz uchun o'zingizga yoqqan ranglarni tanlang.", 'Образец под кодом — все три способа. Выбери свои цвета.', 'The example under the code uses all three ways. Pick your own colors.')
    ],
    needH1: L3("Sarlavhaning rangi hali berilmabdi. h1 tegi uchun qoida yozib, unga color xususiyatini qo'ying.", 'Нет правила для заголовка: напиши для h1 свойство color.', 'There’s no rule for the heading: write color for h1.'),
    needBody: L3("Sayyorangizning foni hali yo'q ekan. body tegi uchun qoida yozib, unga background-color qo'shing.", 'Нет правила для фона: напиши для body свойство background-color.', 'There’s no rule for the background: write background-color for body.'),
    needCode: L3("Hamma ranglar nomi bilan yozilibdi. Shartimiz esingizdami? Kamida bittasini kod bilan yozing, hex yoki rgb bilan.", 'Все цвета записаны названиями. Запиши один кодом: hex или rgb.', 'All the colors are written as names. Write one as a code: hex or rgb.'),
    same: L3("Voy, sarlavha fon bilan bir xil rangga kirib, ko'rinmay qolibdi! Ularga har xil rang tanlang.", 'Заголовок того же цвета, что и фон, — его не видно. Выбери разные цвета.', 'The heading is the same color as the background, so you can’t see it. Pick different colors.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Koinotimning beshala sahifasi ham yana rangga kirdi! Har bir rangni esa siz o'zingiz yozdingiz.", 'Все пять страниц космоса снова в цвете! И каждый цвет — твой.', 'All five space pages are colorful again! And every color is yours.') },
      { k: 'a', text: L3("Endi rangni nomi bilan yozishni bilasiz: dark qo'shsangiz, to'qroq chiqadi, light qo'shsangiz, ochroq.", 'Ты пишешь цвет названием: с dark — темнее, с light — светлее.', 'You write a color by name: dark makes it darker, light makes it lighter.') },
      { k: 'b', text: L3("Nomi yo'q aniq rang kerak bo'lsa, Mars sahifasidagidek hex kodni olasiz: panjara belgisi va oltita belgi.", 'Для точного цвета — hex-код: решётка и шесть знаков.', 'For an exact color, a hex code: a hash sign and six symbols.') },
      { k: 'c', text: L3("Quyoshni esa rgb bilan bo'yadingiz. rgb ichida uchta nur turadi: qizil, yashil va ko'k, har biri noldan ikki yuz ellik beshgacha yonadi.", 'А rgb — три луча: красный, зелёный и синий, каждый от нуля до двухсот пятидесяти пяти.', 'And rgb is three lights: red, green and blue, each from zero to two hundred fifty-five.') },
      { k: 'd', text: L3("Yer sahifasida buzilgan kodni ham topdingiz: tushib qolgan panjara belgisini ham, yetishmagan belgini ham.", 'И находишь сломанный код: потерянную решётку и недостающий знак.', 'And you find a broken code: a lost hash sign and a missing symbol.') },
      { k: null, text: L3("Keyingi darsda esa fon bilan ishlaymiz, sahifaga hatto rasm ham qo'yib ko'ramiz. Ko'rishguncha!", 'На следующем уроке поработаем с фоном: поставим на страницу даже картинку. До встречи!', 'Next lesson we’ll work with backgrounds: we’ll even put a picture on the page. See you!') }
    ],
    roles: {
      a: L3("nom: darkblue, lightblue", 'название: darkblue, lightblue', 'name: darkblue, lightblue'),
      b: L3("hex: # va 6 belgi", 'hex: # и 6 знаков', 'hex: # and 6 symbols'),
      c: L3("rgb: 0 dan 255 gacha", 'rgb: от 0 до 255', 'rgb: from 0 to 255'),
      d: L3("tuzatish: «#» va belgilar soni", 'починка: «#» и число знаков', 'fixing: “#” and the number of symbols')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
