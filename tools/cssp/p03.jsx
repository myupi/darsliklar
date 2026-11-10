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
    say: L3("Salom! Bu mening koinot haqidagi saytim. Qarang: fon to'q ko'k, sarlavha oltin rangda, matn esa oppoq. Ranglar uch xil usulda yozilgan: nomi bilan, hex kod bilan va rgb bilan. Saytda beshta sahifa bor. Hozir uni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это мой сайт про космос. Смотри: фон тёмно-синий, заголовок золотой, а текст белоснежный. Цвета записаны тремя способами: названием, hex-кодом и через rgb. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my website about space. Look: the background is dark blue, the heading is gold, and the text is snow-white. The colors are written in three ways: by name, with a hex code and with rgb. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Koinot oq-qora bo'lib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Космос стал чёрно-белым, а вкладки погасли.', 'Oh no! The CSS code got erased. Space went black and white, and the tabs went dark.'),
    done: L3("HTML joyida, faqat ranglar yo'q. O'tgan darsda rangni uch usulda yozishni o'rgandik: nomi bilan, palitradagi hex kod bilan va rgb ichidagi uchta nur bilan. Endi beshta sahifani birma-bir bo'yaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, пропали только цвета. На прошлом уроке мы научились записывать цвет тремя способами: названием, hex-кодом из палитры и тремя лучами в rgb. Теперь раскрасим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, only the colors are gone. Last lesson we learned three ways to write a color: by name, with a hex code from the palette and with three lights in rgb. Now let’s color the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani bo'yaymiz: kodni siz yozasiz", 'Раскрасим пять страниц: код пишешь ты', 'Let’s color five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Tun osmoni", 'Ночное небо', 'Night sky'),
    say: L3("Birinchi sahifa: tun osmoni. Qarang, fon ko'k, lekin juda yorqin, xuddi kunduzgidek. Tunda osmon to'qroq bo'ladi. Esingizdami, rang nomi oldida dark so'zi bo'lsa, rang to'q bo'ladi. Qoidadagi rang nomini almashtiring.",
      'Первая страница: ночное небо. Смотри, фон синий, но слишком яркий, как днём. Ночью небо темнее. Помнишь: если перед названием цвета стоит dark, цвет становится тёмным. Замени в правиле название цвета.',
      'The first page is the night sky. Look, the background is blue, but too bright, like in the daytime. At night the sky is darker. Remember: if dark comes before a color name, the color gets dark. Change the color name in the rule.'),
    ask: L3("Tun osmonini to'q ko'k qiling", 'Сделай ночное небо тёмно-синим', 'Make the night sky dark blue'),
    ok: L3("Ajoyib! Endi haqiqiy tun: osmon to'q ko'k, yulduzlar charaqlayapti.", 'Отлично! Вот теперь настоящая ночь: небо тёмно-синее, звёзды сверкают.', 'Great! Now it’s a real night: the sky is dark blue and the stars are shining.'),
    hints: [
      L3("Qoidaga qarang: ikki nuqtadan keyin blue turibdi. Uni to'qroq qilish uchun oldiga nima qo'shamiz?", 'Посмотри на правило: после двоеточия стоит blue. Что добавить перед ним, чтобы он стал темнее?', 'Look at the rule: blue comes after the colon. What do we add in front to make it darker?'),
      L3("To'q rang dark so'zi bilan boshlanadi. blue o'rniga darkblue deb yozing, bo'sh joysiz.", 'Тёмный цвет начинается со слова dark. Вместо blue напиши darkblue, без пробела.', 'A dark color starts with the word dark. Instead of blue write darkblue, with no space.'),
      L3("Namuna kod ostida: u fonni to'q yashil qiladi. Xuddi shunday, ko'k uchun darkblue yozing va «Tekshirish»ni bosing.", 'Образец под кодом делает фон тёмно-зелёным. Так же напиши darkblue для синего и нажми «Проверить».', 'The example under the code makes the background dark green. Write darkblue for blue the same way and tap Check.')
    ],
    no: L3("Osmon hali to'q ko'k emas. To'q ko'k inglizchada darkblue.", 'Небо пока не тёмно-синее. Тёмно-синий по-английски — darkblue.', 'The sky isn’t dark blue yet. Dark blue is darkblue.'),
    drill: L3("endi abzaslarni och ko'k qiling", 'теперь сделай абзацы светло-голубыми', 'now make the paragraphs light blue'),
    drillNo: L3("Abzaslar hali och ko'k emas. Och rang light so'zi bilan boshlanadi: lightblue.", 'Абзацы пока не светло-голубые. Светлый цвет начинается с light: lightblue.', 'The paragraphs aren’t light blue yet. A light color starts with light: lightblue.')
  },
  t2: {
    eyebrow: L3("Mars", 'Марс', 'Mars'),
    say: L3("Tun tayyor! Endi Mars sahifasi. Marsning rangi o'ziga xos: oddiy qizil ham emas, to'q sariq ham emas. Bunday rangning nomi yo'q, shuning uchun uning kodini vazifa qatoriga yozib qo'ydim. Sarlavhani Mars rangiga bo'yang: qavslar ichiga xususiyat va kodni yozing.",
      'Ночь готова! Теперь страница Марса. Цвет у Марса особенный: не просто красный и не оранжевый. Названия у такого цвета нет, поэтому его код я написал в строке задания. Покрась заголовок в цвет Марса: впиши в скобки свойство и код.',
      'The night is done! Now the Mars page. Mars has a special color: not plain red, not orange. A color like that has no name, so I wrote its code in the task line. Color the heading like Mars: write the property and the code inside the braces.'),
    ask: L3("Sarlavhani Mars rangiga bo'yang: #C1440E", 'Покрась заголовок в цвет Марса: #C1440E', 'Color the heading like Mars: #C1440E'),
    ok: L3("Zo'r! Sarlavha xuddi Marsning o'zidek. hex kod aynan o'sha rangni berdi.", 'Огонь! Заголовок прямо как сам Марс. hex-код дал точно тот цвет.', 'Awesome! The heading looks just like Mars. The hex code gave exactly that color.'),
    hints: [
      L3("Matn rangi qaysi xususiyat bilan beriladi? Qiymat esa vazifa qatoridagi kod bo'ladi.", 'Каким свойством задают цвет текста? А значением будет код из строки задания.', 'Which property sets the text color? The value is the code from the task line.'),
      L3("Xususiyat color. Keyin ikki nuqta, panjara belgisi va oltita belgi keladi, oxirida nuqtali vergul. Kodni vazifa qatoridan harfma-harf ko'chiring.", 'Свойство — color. Потом двоеточие, решётка и шесть знаков, в конце точка с запятой. Перепиши код из строки задания знак в знак.', 'The property is color. Then a colon, a hash sign and six symbols, and a semicolon at the end. Copy the code from the task line symbol by symbol.'),
      L3("Namuna kod ostida: u sarlavhani ko'k kod bilan bo'yaydi. Xuddi shunday yozing, faqat Mars kodi bilan.", 'Образец под кодом красит заголовок синим кодом. Напиши так же, только с кодом Марса.', 'The example under the code colors the heading with a blue code. Write the same, only with the Mars code.')
    ],
    no: L3("Sarlavha boshqa rangda. Kodni vazifa qatoridan aniq ko'chiring: panjara belgisi va oltita belgi.", 'Заголовок другого цвета. Перепиши код из строки задания точно: решётка и шесть знаков.', 'The heading is a different color. Copy the code from the task line exactly: a hash sign and six symbols.'),
    drill: L3("endi abzaslarni Mars toshlaridek kulrang qiling: #7F8C8D", 'теперь сделай абзацы серыми, как камни Марса: #7F8C8D', 'now make the paragraphs gray like Mars rocks: #7F8C8D'),
    drillNo: L3("Abzaslar hali o'sha kulrang emas. Kodni vazifa qatoridan ko'chiring.", 'Абзацы пока не того серого цвета. Перепиши код из строки задания.', 'The paragraphs aren’t that gray yet. Copy the code from the task line.')
  },
  t3: {
    eyebrow: L3("Quyosh", 'Солнце', 'The Sun'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: Quyosh. Bu yerda kod umuman yo'q. Butun sahifa foni sariq bo'lsin, lekin bu safar rgb bilan. Esingizdami, ekran rangni uchta nurdan yig'adi. Qaysi nurlar qo'shilsa, sariq chiqadi? Qoidani boshidan oxirigacha o'zingiz yozing.",
      'Две страницы горят! Третья: Солнце. Здесь кода нет совсем. Пусть фон всей страницы станет жёлтым, но на этот раз через rgb. Помнишь, экран собирает цвет из трёх лучей. Какие лучи вместе дают жёлтый? Напиши правило целиком, от начала до конца.',
      'Two pages are lit! The third is the Sun. There’s no code here at all. Let’s make the whole page background yellow, but this time with rgb. Remember, a screen builds a color from three lights. Which lights together make yellow? Write the whole rule yourself.'),
    ask: L3("Sahifa fonini rgb bilan sariq qiling", 'Сделай фон страницы жёлтым через rgb', 'Make the page background yellow with rgb'),
    ok: L3("Qoyil! Qizil va yashil nur birga yondi, sahifa quyoshdek sariq bo'ldi.", 'Вот это да! Красный и зелёный лучи зажглись вместе, и страница стала жёлтой, как солнце.', 'Wow! The red and green lights came on together, and the page turned sunny yellow.'),
    hints: [
      L3("Qoida uch qismdan iborat: butun sahifa, fon xususiyati va rgb qiymati. rgb ichida uchta son bor: qizil, yashil va ko'k nur.", 'Правило — три части: вся страница, свойство фона и значение rgb. В rgb три числа: красный, зелёный и синий луч.', 'The rule has three parts: the whole page, the background property and an rgb value. rgb holds three numbers: the red, green and blue lights.'),
      L3("Sariq rang qizil va yashil nurdan chiqadi: ikkalasi ham ikki yuz ellik besh bo'ladi, ko'k esa nol. Selektor body, xususiyat background-color.", 'Жёлтый — это красный и зелёный лучи: оба по двести пятьдесят пять, а синий — ноль. Селектор body, свойство background-color.', 'Yellow is red and green light: both at two hundred fifty-five, and blue at zero. The selector is body, the property background-color.'),
      L3("Namuna kod ostida: u yashil va ko'k nurni yoqadi. Xuddi shunday qoida yozing, faqat qizil va yashil nurni yoqing.", 'Образец под кодом зажигает зелёный и синий лучи. Напиши такое же правило, только зажги красный и зелёный.', 'The example under the code turns on green and blue light. Write the same rule, only turn on red and green.')
    ],
    no: L3("Fon hali sariq emas. Sariq uchun qizil va yashil nur to'liq yonadi, ko'k esa o'chiq turadi.", 'Фон пока не жёлтый. Для жёлтого красный и зелёный горят на полную, а синий выключен.', 'The background isn’t yellow yet. For yellow, red and green are on full and blue is off.'),
    notRgb: L3("Rang to'g'ri chiqdi, lekin bu safar uni rgb bilan yozing: qavs ichida uchta son.", 'Цвет получился, но на этот раз запиши его через rgb: три числа в скобках.', 'The color is right, but this time write it with rgb: three numbers in brackets.'),
    big: L3("Bunday katta son bo'lmaydi: nur ikki yuz ellik beshdan ko'p yonmaydi.", 'Такого большого числа не бывает: луч не горит сильнее двухсот пятидесяти пяти.', 'No number that big: a light can’t go above two hundred fifty-five.'),
    drill: L3("endi sarlavhani rgb bilan qizil qiling, qoidani o'zingiz yozing", 'теперь сделай заголовок красным через rgb, правило пиши с нуля', 'now make the heading red with rgb, write the rule yourself'),
    drillNo: L3("Sarlavha hali qizil emas. Qizil uchun faqat birinchi nur to'liq yonadi, qolgan ikkitasi nol.", 'Заголовок пока не красный. Для красного на полную горит только первый луч, два других — ноль.', 'The heading isn’t red yet. For red, only the first light is on full; the other two are zero.')
  },
  t4: {
    eyebrow: L3("Yer", 'Земля', 'Earth'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: Yer. Bu yerda men ranglarni palitradan shoshib ko'chirgan edim, ikkita kod buzilib qolibdi. Brauzer buzilgan kodni tanimaydi va tashlab yuboradi. Vazifa qatoridagi kodlar bilan solishtiring va ikkalasini tuzating.",
      'Три страницы готовы! Четвёртая: Земля. Здесь я в спешке переписывал цвета из палитры, и два кода сломались. Браузер сломанный код не узнаёт и выбрасывает. Сравни с кодами в строке задания и почини оба.',
      'Three pages are done! The fourth is Earth. I copied the colors from the palette in a hurry, and two codes broke. The browser doesn’t recognize a broken code and throws it away. Compare with the codes in the task line and fix both.'),
    ask: L3("Kodlarni tuzating: #2E86DE va #27AE60", 'Почини коды: #2E86DE и #27AE60', 'Fix the codes: #2E86DE and #27AE60'),
    ok: L3("Mana, tuzaldi! Sarlavha okeandek ko'k, abzaslar o'rmondek yashil: Yer yana o'z ranglarida.", 'Есть, починено! Заголовок синий, как океан, абзацы зелёные, как лес: Земля снова в своих цветах.', 'Fixed it! The heading is ocean blue, the paragraphs are forest green: Earth is in its own colors again.'),
    hints: [
      L3("Har bir kodni vazifa qatoridagisi bilan solishtiring: boshida nima turibdi? Nechta belgi bor?", 'Сравни каждый код с кодом из строки задания: что стоит в начале? Сколько знаков?', 'Compare each code with the one in the task line: what’s at the start? How many symbols?'),
      L3("Birinchi kodda panjara belgisi tushib qolibdi. Ikkinchisida beshta belgi qolgan: oxirgi nol yo'q.", 'В первом коде потерялась решётка. Во втором осталось пять знаков: нет последнего нуля.', 'The first code lost its hash sign. The second has only five symbols: the last zero is missing.'),
      L3("Namuna kod ostida: to'g'ri hex kod, panjara belgisi va oltita belgi. Ikkala kodni shunday qiling va «Tekshirish»ni bosing.", 'Образец под кодом — верный hex-код: решётка и шесть знаков. Сделай оба кода такими и нажми «Проверить».', 'The example under the code is a correct hex code: a hash sign and six symbols. Make both codes like that and tap Check.')
    ],
    no: L3("Kodlar ishlayapti, lekin ranglar boshqa. Ularni vazifa qatoridagi kodlar bilan yana solishtiring.", 'Коды работают, но цвета не те. Сверь их ещё раз с кодами в строке задания.', 'The codes work, but the colors are different. Compare them with the codes in the task line again.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Sarlavha hali yashil emas. Rang nomini harfma-harf tekshiring: green.", 'Заголовок пока не зелёный. Проверь название цвета буква за буквой: green.', 'The heading isn’t green yet. Check the color name letter by letter: green.')
  },
  t5: {
    eyebrow: L3("Mening sayyoram", 'Моя планета', 'My planet'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z sayyorangizni o'ylab toping va bo'yang. Sarlavha rangi va sahifa fonini tanlang. Bitta shart bor: kamida bitta rang kod bilan yozilsin, hex yoki rgb. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: придумай свою планету и раскрась её. Выбери цвет заголовка и фон страницы. Одно условие: хотя бы один цвет запиши кодом, hex или rgb. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: invent your own planet and color it. Pick the heading color and the page background. One condition: write at least one color as a code, hex or rgb. Under the window you can see what’s done.'),
    ask: L3("Sayyorangizni bo'yang", 'Раскрась свою планету', 'Color your planet'),
    ok: L3("Ura! Sizning sayyorangiz tayyor, u o'z ranglaringizda porlayapti!", 'Ура! Твоя планета готова, и она сияет твоими цветами!', 'Hooray! Your planet is ready, shining in your own colors!'),
    hints: [
      L3("Ikkita qoidadan boshlang: biri sarlavha uchun, biri butun sahifa uchun.", 'Начни с двух правил: одно для заголовка, другое для всей страницы.', 'Start with two rules: one for the heading, one for the whole page.'),
      L3("h1 uchun color, body uchun background-color kerak. Rangni nomi bilan, hex kod bilan yoki rgb bilan yozing, lekin bittasi kod bo'lsin.", 'Нужны h1 с color и body с background-color. Пиши цвет названием, hex-кодом или через rgb, но один — кодом.', 'You need h1 with color and body with background-color. Write colors by name, hex or rgb, but make one a code.'),
      L3("Namuna kod ostida: uchala usul ham bor. O'zingizga yoqqan ranglarni tanlang.", 'Образец под кодом — все три способа. Выбери свои цвета.', 'The example under the code uses all three ways. Pick your own colors.')
    ],
    needH1: L3("Sarlavha uchun qoida yo'q: h1 tegiga color yozing.", 'Нет правила для заголовка: напиши для h1 свойство color.', 'There’s no rule for the heading: write color for h1.'),
    needBody: L3("Sahifa foni uchun qoida yo'q: body tegiga background-color yozing.", 'Нет правила для фона: напиши для body свойство background-color.', 'There’s no rule for the background: write background-color for body.'),
    needCode: L3("Hamma ranglar nomi bilan yozilgan. Bittasini kod bilan yozing: hex yoki rgb.", 'Все цвета записаны названиями. Запиши один кодом: hex или rgb.', 'All the colors are written as names. Write one as a code: hex or rgb.'),
    same: L3("Sarlavha fon bilan bir xil rangda, u ko'rinmay qoldi. Boshqa-boshqa rang tanlang.", 'Заголовок того же цвета, что и фон, — его не видно. Выбери разные цвета.', 'The heading is the same color as the background, so you can’t see it. Pick different colors.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Koinotning beshta sahifasi ham yana rangli! Va har bir rangni siz o'zingiz yozdingiz.", 'Все пять страниц космоса снова в цвете! И каждый цвет — твой.', 'All five space pages are colorful again! And every color is yours.') },
      { k: 'a', text: L3("Rangni nomi bilan yozasiz: dark bilan to'qroq, light bilan ochroq.", 'Ты пишешь цвет названием: с dark — темнее, с light — светлее.', 'You write a color by name: dark makes it darker, light makes it lighter.') },
      { k: 'b', text: L3("Aniq rang uchun hex kod: panjara belgisi va oltita belgi.", 'Для точного цвета — hex-код: решётка и шесть знаков.', 'For an exact color, a hex code: a hash sign and six symbols.') },
      { k: 'c', text: L3("rgb esa uchta nur: qizil, yashil va ko'k, har biri noldan ikki yuz ellik beshgacha.", 'А rgb — три луча: красный, зелёный и синий, каждый от нуля до двухсот пятидесяти пяти.', 'And rgb is three lights: red, green and blue, each from zero to two hundred fifty-five.') },
      { k: 'd', text: L3("Buzilgan kodni ham topasiz: tushib qolgan panjara belgisini va yetmagan belgini.", 'И находишь сломанный код: потерянную решётку и недостающий знак.', 'And you find a broken code: a lost hash sign and a missing symbol.') },
      { k: null, text: L3("Keyingi darsda fon bilan ishlaymiz: sahifaga hatto rasm qo'yamiz. Ko'rishguncha!", 'На следующем уроке поработаем с фоном: поставим на страницу даже картинку. До встречи!', 'Next lesson we’ll work with backgrounds: we’ll even put a picture on the page. See you!') }
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
