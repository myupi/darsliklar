// =============================================================================
// ===== ПРАКТИКА 4 · «Выходной Коди» · к уроку 4 «Фон» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта про выходной Коди стёрся CSS: пропали футбольное поле на фоне и цветные
// полосы под заголовком и текстом. Ученик возвращает фон пяти страницам: заменить цвет фона заголовка (white →
// жёлтый) → вписать в правило с небом background-size: cover (картинка накрывает весь фон) → написать правило
// целиком: звёзды yulduz.png на фон body (маленькая картинка повторяется плиткой) → починить две поломки урока (нет
// url( ), «no repeat» с пробелом; в дополнительной — опечатка в имени файла maydn.jpg) → свой день: картинка фона,
// запасной цвет body и фон заголовка, условия «готово» видны (в первом — имена файлов).
// Картинки — те же файлы, что в уроке 4 (FILES в tools/css4/c4-screens.jsx, свои SVG): url("имя") каркас заменяет
// файлом из PR.files; чужое имя — картинки нет. Какая картинка на фоне — по цвету, который есть только в ней.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-04p-fon.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-04p-fon',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "4-amaliyot. Kodining dam olish kuni", ru: 'Практика 4. Выходной Коди', en: 'Practice 4. Kodi’s day off' }
};

// Файлы картинок — как в уроке 4 (свои SVG; имена — как у файлов сайта).
const p4Svg = (s) => 'data:image/svg+xml,' + encodeURIComponent(s);
const P4_FILES = {
  'maydon.jpg': p4Svg("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='130' viewBox='0 0 220 130'><rect width='220' height='130' fill='#3E9B4F'/><g fill='#4BAE5C'><rect x='0' width='22' height='130'/><rect x='44' width='22' height='130'/><rect x='88' width='22' height='130'/><rect x='132' width='22' height='130'/><rect x='176' width='22' height='130'/></g><g fill='none' stroke='#fff' stroke-width='2' opacity='.92'><rect x='6' y='6' width='208' height='118'/><line x1='110' y1='6' x2='110' y2='124'/><circle cx='110' cy='65' r='20'/><rect x='6' y='38' width='26' height='54'/><rect x='188' y='38' width='26' height='54'/></g><circle cx='110' cy='65' r='2.5' fill='#fff'/></svg>"),
  'osmon.jpg': p4Svg("<svg xmlns='http://www.w3.org/2000/svg' width='220' height='130' viewBox='0 0 220 130'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#5DB4F0'/><stop offset='1' stop-color='#D2EEFF'/></linearGradient></defs><rect width='220' height='130' fill='url(#g)'/><circle cx='178' cy='34' r='16' fill='#FFD54A'/><g fill='#fff'><ellipse cx='58' cy='46' rx='26' ry='10'/><ellipse cx='74' cy='39' rx='16' ry='11'/><ellipse cx='132' cy='90' rx='30' ry='10'/><ellipse cx='148' cy='83' rx='15' ry='10'/></g></svg>"),
  'futbol.png': p4Svg("<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'><circle cx='28' cy='28' r='15' fill='#fff' stroke='#1F2430' stroke-width='1.6'/><path d='M28 21.5l6.2 4.5-2.4 7.3h-7.6l-2.4-7.3z' fill='#1F2430'/><path d='M28 13v8.5M34.2 26l7.6-2.6M31.8 33.3l4.6 6.4M24.2 33.3l-4.6 6.4M21.8 26l-7.6-2.6' stroke='#1F2430' stroke-width='1.4' fill='none'/></svg>"),
  'yulduz.png': p4Svg("<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 40 40'><path d='M20 8.5l3.4 6.9 7.6 1.1-5.5 5.3 1.3 7.6L20 25.8l-6.8 3.6 1.3-7.6-5.5-5.3 7.6-1.1z' fill='#FFB020' stroke='#E08A00' stroke-width='1.2' stroke-linejoin='round'/></svg>")
};
// Цвет, который есть только в этой картинке: по нему видно, какой файл стоит на фоне (вычисленный background-image).
const P4_TOK = { 'maydon.jpg': '3E9B4F', 'osmon.jpg': '5DB4F0', 'futbol.png': '1F2430', 'yulduz.png': 'FFB020' };
const p4File = (D, sel) => { const v = D.cs(sel, 'background-image') || ''; return Object.keys(P4_TOK).find((k) => v.indexOf(P4_TOK[k]) >= 0) || null; };
const p4Any = (D, v, list) => list.some((c) => D.same(v, c));
// Фон покрашен (не прозрачный) — по вычисленному стилю: правил с одним селектором может быть несколько.
const p4Bg = (D, sel) => { const v = D.cs(sel, 'background-color'); return !!v && !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(v); };

// Страницы выходного (тексты на языке урока).
const P4 = {
  foot: L3("Shanba: futbol!", 'Суббота: футбол!', 'Saturday: football!'),
  foot1: L3("Soat o'nda maydonda", 'В десять на поле', 'At ten on the field'),
  foot2: L3("Hamma taklif qilinadi", 'Приглашаются все', 'Everyone is welcome'),
  sky: L3("Bugun havo ochiq", 'Сегодня ясно', 'Clear skies today'),
  sky1: L3("Quyosh chiqdi, shamol yo'q", 'Солнце вышло, ветра нет', 'The sun is out, no wind'),
  sky2: L3("Sayrga chiqamiz!", 'Идём гулять!', 'Let’s go for a walk!'),
  star: L3("Yulduzli tun", 'Звёздная ночь', 'Starry night'),
  star1: L3("Kechqurun yulduz sanaymiz", 'Вечером считаем звёзды', 'In the evening we count stars'),
  star2: L3("Nechtasini topasiz?", 'Сколько найдёшь?', 'How many can you find?'),
  ball: L3("Hovlida to'p o'yini", 'Игра в мяч во дворе', 'Ball game in the yard'),
  ball1: L3("Soat beshda boshlaymiz", 'Начинаем в пять', 'We start at five'),
  ball2: L3("To'pni unutmang!", 'Не забудь мяч!', 'Don’t forget the ball!'),
  mine: L3("Mening kunim", 'Мой день', 'My day'),
  mine1: L3("Ertalab: sport", 'Утром: спорт', 'Morning: sports'),
  mine2: L3("Kechqurun: do'stlar bilan o'yin", 'Вечером: игры с друзьями', 'Evening: games with friends')
};
const p4Page = (a, b, c) => (pk) => '<h1>' + pk(a) + '</h1><p>' + pk(b) + '</p><p>' + pk(c) + '</p>';
const P4_BALL = p4Page(P4.ball, P4.ball1, P4.ball2);

const PR = {
  next: L3("Matn va shriftlar", 'Текст и шрифты', 'Text and fonts'),
  files: P4_FILES,
  tabs: [
    { ico: 'ball', c: '#0FA38E', name: L3("Futbol", 'Футбол', 'Football'), file: 'futbol.html' },
    { ico: 'sun', c: '#F59E0B', name: L3("Ob-havo", 'Погода', 'Weather'), file: 'havo.html' },
    { ico: 'star', c: '#7C5CFA', name: P4.star, file: 'tun.html' },
    { ico: 'game', c: '#FA4F28', name: L3("To'p o'yini", 'Игра в мяч', 'Ball game'), file: 'oyin.html' },
    { ico: 'heart', c: '#E44D8A', name: P4.mine, file: 'my.html' }
  ],
  hook: {
    page: p4Page(P4.foot, P4.foot1, P4.foot2),
    css: ['  body {', '    background-image: url("maydon.jpg");', '    background-size: cover;', '  }', '  h1 { background-color: gold; }', '  p { background-color: white; }']
  },
  ownPage: p4Page(P4.mine, P4.mine1, P4.mine2),
  ownDefault: 'body {\n  background-image: url("osmon.jpg");\n  background-size: cover;\n  background-color: skyblue;\n}\nh1 { background-color: white; }',
  tasks: [
    // Т1 · заменить значение: фон заголовка снова жёлтый (поле на фоне body — готовые правила).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: 'h1 { background-color: white; }', answer: 'h1 { background-color: yellow; }',
      page: p4Page(P4.foot, P4.foot1, P4.foot2),
      given: ['body {', '  background-image: url("maydon.jpg");', '  background-size: cover;', '}', 'p { background-color: white; }'],
      goal: (D) => (p4Any(D, D.cs('h1', 'background-color'), ['gold', 'yellow']) ? null : C.t1.no),
      sample: ['p { background-color: lightblue; }'],
      drill: { single: true, code0: 'p { background-color: white; }', answer: 'p { background-color: lightgreen; }',
        goal: (D) => (D.same(D.cs('p', 'background-color'), 'lightgreen') ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение: небо накрывает весь фон (background-size: cover).
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: 'body {\n  background-image: url("osmon.jpg");\n  \n}',
      answer: 'body {\n  background-image: url("osmon.jpg");\n  background-size: cover;\n}',
      page: p4Page(P4.sky, P4.sky1, P4.sky2),
      goal: (D) => {
        if (p4File(D, 'body') !== 'osmon.jpg') return C.t2.noSky;
        const s = D.cs('body', 'background-size');
        if (s === 'cover') return null;
        return s === 'contain' ? C.t2.contain : C.t2.no;
      },
      sample: ['body {', '  background-image: url("maydon.jpg");', '  background-size: cover;', '}'],
      drill: { code0: 'h1 {\n  \n}', answer: 'h1 {\n  background-color: white;\n}',
        goal: (D) => (D.same(D.cs('h1', 'background-color'), 'white') ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: звёзды yulduz.png на фон body (тёмный цвет фона — готовое правило); плиткой — сами.
    (pk) => cpTask(3, {
      // body уже есть — картинка фона дописывается в него же, второго body нет (отзыв, 14.11.2026).
      kind: 'write-rule', code0: 'body {\n  background-color: midnightblue;\n  \n}',
      answer: 'body {\n  background-color: midnightblue;\n  background-image: url("yulduz.png");\n}', syms: ['{', '}', ':', ';', '(', ')', '"'],
      page: p4Page(P4.star, P4.star1, P4.star2),
      given: ['h1 { color: white; }', 'p { color: white; }'],
      goal: (D) => {
        const f = p4File(D, 'body');
        if (f === 'yulduz.png') return null;
        if (f) return C.t3.other;
        return /url\s*\(/i.test(D.code) ? C.t3.noFile : C.t3.noImg;
      },
      sample: ['body {', '  background-image: url("futbol.png");', '}'],
      drill: { code0: '', answer: 'body { background-image: url("osmon.jpg"); }',
        goal: (D) => (p4File(D, 'body') === 'osmon.jpg' ? null : C.t3.drillNo) }
    }),
    // Т4 · починить две поломки: нет url( ) и «no repeat» с пробелом — на фоне один мяч.
    // Дополнительная — опечатка в имени файла (maydn.jpg): своя страница с полем на весь фон.
    (pk) => cpTask(4, {
      kind: 'fix', code0: 'body {\n  background-image: "futbol.png";\n  background-repeat: no repeat;\n}',
      answer: 'body {\n  background-image: url("futbol.png");\n  background-repeat: no-repeat;\n}',
      page: P4_BALL, given: ['body { background-color: lightgreen; }'], syms: ['{', '}', ':', ';', '(', ')', '-'],
      goal: (D) => (p4File(D, 'body') === 'futbol.png' && D.cs('body', 'background-repeat') === 'no-repeat' ? null : C.t4.no),
      sample: ['body {', '  background-image: url("yulduz.png");', '  background-repeat: no-repeat;', '}'],
      drill: { single: true, page: P4_BALL, given: ['body { background-size: cover; }'],
        code0: 'body { background-image: url("maydn.jpg"); }', answer: 'body { background-image: url("maydon.jpg"); }',
        goal: (D) => (p4File(D, 'body') === 'maydon.jpg' ? null : C.t4.drillNo) }
    }),
    // Т5 · свой день: картинка фона body, запасной цвет body, фон заголовка.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '',
      answer: 'body {\n  background-image: url("osmon.jpg");\n  background-size: cover;\n  background-color: skyblue;\n}\nh1 { background-color: white; }',
      page: p4Page(P4.mine, P4.mine1, P4.mine2),
      list: [
        { t: L3("body — rasm: maydon.jpg, osmon.jpg, futbol.png, yulduz.png", 'body — картинка: maydon.jpg, osmon.jpg, futbol.png, yulduz.png', 'body — picture: maydon.jpg, osmon.jpg, futbol.png, yulduz.png'), ok: (D) => !!p4File(D, 'body') },
        { t: L3("body — zaxira rang", 'body — запасной цвет', 'body — backup color'), ok: (D) => p4Bg(D, 'body') },
        { t: L3("h1 — fon rangi", 'h1 — цвет фона', 'h1 — background color'), ok: (D) => p4Bg(D, 'h1') }
      ],
      goal: (D) => {
        if (!p4File(D, 'body')) return /url\s*\(/i.test(D.code) ? C.t5.noFile : C.t5.needImg;
        if (!p4Bg(D, 'body')) return C.t5.needColor;
        if (!p4Bg(D, 'h1')) return C.t5.needH1;
        return null;
      },
      sample: ['body {', '  background-image: url("maydon.jpg");', '  background-color: green;', '}', 'h1 { background-color: gold; }'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, no …; печатаются: eyebrow, ask, drill, roles, list.
// Имена файлов в речи — как в уроке 4 (yulduz.png); знаки — словами: «qavs», «qo'shtirnoq», «chiziqcha».
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining dam olish kuni", 'Выходной Коди', 'Kodi’s day off'),
    say: L3("Salom! Bu mening dam olish kunim haqidagi sayt. Qarang: orqada yashil futbol maydoni, sarlavha orqasida sariq fon, matn orqasida esa oq. Bularning hammasini fon xususiyatlari qildi. Saytda beshta sahifa bor. Hozir uni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт про мой выходной. Смотри: сзади зелёное футбольное поле, под заголовком жёлтый фон, а под текстом белый. Всё это сделали свойства фона. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is a website about my day off. Look: a green football field in the back, a yellow background behind the heading, and white behind the text. Background properties did all of that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Maydon ham, ranglar ham yo'qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Пропали и поле, и цвета, а вкладки погасли.', 'Oh no! The CSS code got erased. The field and the colors are gone, and the tabs went dark.'),
    done: L3("HTML joyida, faqat fon yo'q. O'tgan darsda fonni o'rgandik: background-color istalgan elementni bo'yaydi, background-image esa url bilan rasm qo'yadi. Endi beshta sahifani birma-bir bezaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, пропал только фон. На прошлом уроке мы разобрали фон: background-color красит любой элемент, а background-image ставит картинку через url. Теперь оформим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, only the background is gone. Last lesson we learned about backgrounds: background-color paints any element, and background-image puts in a picture with url. Now let’s style the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani bezaymiz: kodni siz yozasiz", 'Оформим пять страниц: код пишешь ты', 'Let’s style five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Futbol", 'Футбол', 'Football'),
    say: L3("Birinchi sahifa: futbol. Maydon joyida, lekin sarlavha orqasidagi fon oq bo'lib qolibdi. U oldingidek sariq bo'lsin: qoidadagi rang nomini almashtiring.",
      'Первая страница: футбол. Поле на месте, но фон под заголовком стал белым. Пусть он снова будет жёлтым: замени в правиле название цвета.',
      'The first page is football. The field is there, but the background behind the heading turned white. Let’s make it yellow again: change the color name in the rule.'),
    ask: L3("Sarlavha orqasini sariq qiling", 'Сделай фон заголовка жёлтым', 'Make the heading’s background yellow'),
    ok: L3("Ajoyib! Sarlavha orqasida yana sariq fon. Esingizda bo'lsin: background-color istalgan elementga ishlaydi.", 'Отлично! Под заголовком снова жёлтый фон. Запомни: background-color работает для любого элемента.', 'Great! The heading has a yellow background again. Remember: background-color works on any element.'),
    hints: [
      L3("Oxirgi qoidaga qarang: u sarlavha orqasini bo'yaydi. Ikki nuqtadan keyin qaysi rang turibdi?", 'Посмотри на последнее правило: оно красит фон заголовка. Какой цвет стоит после двоеточия?', 'Look at the last rule: it paints the heading’s background. Which color comes after the colon?'),
      L3("U yerda white turibdi. Sariq inglizchada yellow yoki gold. white so'zini o'chirib, sariqni yozing.", 'Там стоит white. Жёлтый по-английски — yellow или gold. Сотри white и напиши жёлтый.', 'It says white. Yellow is yellow or gold. Erase white and write the yellow one.'),
      L3("Namuna kod ostida: u abzaslar orqasini havorang qiladi. Xuddi shunday, sarlavha uchun yellow yozing va «Tekshirish»ni bosing.", 'Образец под кодом делает фон абзацев голубым. Так же напиши yellow для заголовка и нажми «Проверить».', 'The example under the code makes the paragraphs’ background light blue. Write yellow for the heading the same way and tap Check.')
    ],
    no: L3("Sarlavha orqasi hali sariq emas. Sariq inglizchada yellow yoki gold.", 'Фон заголовка пока не жёлтый. Жёлтый по-английски — yellow или gold.', 'The heading’s background isn’t yellow yet. Use yellow or gold.'),
    drill: L3("endi abzaslar orqasini och yashil qiling", 'теперь сделай фон абзацев светло-зелёным', 'now make the paragraphs’ background light green'),
    drillNo: L3("Abzaslar orqasi hali och yashil emas. Och yashil inglizchada lightgreen.", 'Фон абзацев пока не светло-зелёный. Светло-зелёный по-английски — lightgreen.', 'The paragraphs’ background isn’t light green yet. Use lightgreen.')
  },
  t2: {
    eyebrow: L3("Ob-havo", 'Погода', 'Weather'),
    say: L3("Futbol tayyor! Endi ob-havo sahifasi. Bu yerda fonga osmon rasmi qo'yilgan, lekin u kichkina va kafel kabi takrorlanib turibdi. Osmon bitta bo'lib, butun fonni qoplasin: qoidaga yana bitta xususiyat va qiymat yozing.",
      'Футбол готов! Теперь страница погоды. Здесь на фоне картинка неба, но она маленькая и повторяется плиткой. Пусть небо будет одно и накроет весь фон: допиши в правило ещё одно свойство и значение.',
      'Football is done! Now the weather page. There’s a sky picture on the background, but it’s small and repeats like tiles. Let’s make one sky that covers the whole background: add one more property and value to the rule.'),
    ask: L3("Osmon butun fonni qoplasin", 'Пусть небо накроет весь фон', 'Make the sky cover the whole background'),
    ok: L3("Zo'r! Osmon kattalashib, butun fonni qopladi. Havo zo'r, sayrga chiqsa bo'ladi!", 'Огонь! Небо выросло и накрыло весь фон. Погода отличная, можно гулять!', 'Awesome! The sky grew and covered the whole background. Great weather for a walk!'),
    hints: [
      L3("Rasmning o'lchami haqida o'ylang: uni kattalashtirib, butun fonga yoyadigan qiymat esingizdami?", 'Подумай о размере картинки: помнишь значение, которое растягивает её на весь фон?', 'Think about the picture’s size: remember the value that stretches it over the whole background?'),
      L3("Fon rasmining o'lchamini background-size beradi, butun fonni qoplash esa cover. Ularni ikki nuqta bilan yozing, oxirida nuqtali vergul.", 'Размер картинки фона задаёт background-size, а «накрыть весь фон» — это cover. Запиши их через двоеточие, в конце точка с запятой.', 'background-size sets the background picture’s size, and cover means cover the whole background. Write them with a colon and a semicolon at the end.'),
      L3("Namuna kod ostida: u maydon rasmini butun fonga yoyadi. Xuddi shu qatorni osmon qoidasiga qo'shing.", 'Образец под кодом растягивает картинку поля на весь фон. Добавь такую же строку в правило с небом.', 'The example under the code stretches the field picture over the whole background. Add the same line to the sky rule.')
    ],
    no: L3("Osmon hali butun fonni qoplamadi. Rasm o'lchamini background-size beradi, qiymati esa cover.", 'Небо пока не накрыло весь фон. Размер картинки задаёт background-size со значением cover.', 'The sky doesn’t cover the whole background yet. background-size sets the size, with the value cover.'),
    contain: L3("Rasm kattalashdi, lekin chetida bo'sh joy qoldi. Butun fonni qoplash uchun cover kerak.", 'Картинка выросла, но по краям осталось пустое место. Чтобы накрыть весь фон, нужен cover.', 'The picture grew, but there’s empty space at the edges. To cover the whole background, you need cover.'),
    noSky: L3("Osmon rasmi yo'qolib qoldi. Birinchi qatordagi rasmni o'chirmang, unga faqat yangi qator qo'shing.", 'Картинка неба пропала. Не стирай первую строку, только добавь новую.', 'The sky picture disappeared. Don’t erase the first line, just add a new one.'),
    drill: L3("endi sarlavha orqasini oq qiling", 'теперь сделай фон заголовка белым', 'now make the heading’s background white'),
    drillNo: L3("Sarlavha orqasi hali oq emas. Fon rangini background-color beradi, oq esa white.", 'Фон заголовка пока не белый. Цвет фона задаёт background-color, а белый — white.', 'The heading’s background isn’t white yet. background-color sets it, and white is white.')
  },
  t3: {
    eyebrow: L3("Yulduzli tun", 'Звёздная ночь', 'Starry night'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: yulduzli tun. Fon rangi bor, lekin yulduzlar yo'q. Butun sahifa foniga yulduzlarni qo'ying: ular yulduz.png faylida. body qoidasi bor, unga bitta qator qo'shing.",
      'Две страницы горят! Третья: звёздная ночь. Цвет фона есть, а звёзд нет. Поставь звёзды на фон всей страницы: они в файле yulduz.png. Правило body уже есть, допиши в него одну строку.',
      'Two pages are lit! The third is the starry night. There’s a background color, but no stars. Put stars on the whole page’s background: they’re in the file yulduz.png. The body rule is already there, add one line to it.'),
    ask: L3("Fonga yulduzlarni qo'ying: yulduz.png", 'Поставь звёзды на фон: yulduz.png', 'Put the stars on the background: yulduz.png'),
    ok: L3("Qoyil! Osmon yulduzlarga to'ldi. Kichik rasm o'zi takrorlanib, butun fonni egalladi.", 'Вот это да! Небо в звёздах. Маленькая картинка сама повторилась и заняла весь фон.', 'Wow! The sky is full of stars. The small picture repeated by itself and filled the whole background.'),
    hints: [
      L3("body qoidasi allaqachon bor. Uning ichiga yana bitta xususiyat qo'shiladi: fon rasmi va fayl nomi.", 'Правило body уже есть. В него добавляется ещё одно свойство: картинка фона и имя файла.', 'The body rule is already there. One more property goes inside it: the background picture and the file name.'),
      L3("Bo'sh qatorga background-image xususiyatini yozing. Qiymat url so'zi, keyin qavs ichida qo'shtirnoqda yulduz.png.", 'В пустую строку напиши свойство background-image. Значение — слово url, а в скобках yulduz.png в кавычках.', 'On the empty line, write the property background-image. The value is the word url with yulduz.png in quotes inside brackets.'),
      L3("Namuna kod ostida: u fonga to'p qo'yadi. Xuddi shunday qatorni body ichiga yozing, faqat yulduz.png bilan.", 'Образец под кодом ставит на фон мяч. Напиши такую же строку внутри body, только с yulduz.png.', 'The example under the code puts a ball on the background. Write the same line inside body, only with yulduz.png.')
    ],
    noImg: L3("Fonda rasm yo'q. Rasm uchun background-image kerak, qiymati esa url va qavs ichida fayl nomi.", 'На фоне нет картинки. Нужен background-image, а значение — url и имя файла в скобках.', 'There’s no picture on the background. You need background-image, with url and the file name in brackets.'),
    noFile: L3("Brauzer bunday faylni topmadi. Fayl nomini harfma-harf tekshiring: yulduz.png.", 'Браузер не нашёл такой файл. Проверь имя файла буква за буквой: yulduz.png.', 'The browser didn’t find that file. Check the file name letter by letter: yulduz.png.'),
    other: L3("Bu boshqa rasm. Yulduzlar yulduz.png faylida.", 'Это другая картинка. Звёзды — в файле yulduz.png.', 'That’s a different picture. The stars are in the file yulduz.png.'),
    drill: L3("endi fonga osmon rasmini qo'ying: osmon.jpg, qoidani o'zingiz yozing", 'теперь поставь на фон небо: osmon.jpg, правило пиши с нуля', 'now put the sky on the background: osmon.jpg, write the rule yourself'),
    drillNo: L3("Fonda hali osmon yo'q. Fayl nomi osmon.jpg, u url ichida qo'shtirnoqda turadi.", 'Неба на фоне пока нет. Файл называется osmon.jpg, он стоит в url в кавычках.', 'There’s no sky on the background yet. The file is osmon.jpg, in quotes inside url.')
  },
  t4: {
    eyebrow: L3("To'p o'yini", 'Игра в мяч', 'Ball game'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: to'p o'yini. Bu yerda fonda bitta to'p turishi kerak edi. Lekin kodni shoshib yozgan ekanman, unda ikkita joy buzilgan. Brauzer buzilgan yozuvni tashlab yuboradi, shuning uchun to'p yo'q. Ikkala joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: игра в мяч. Здесь на фоне должен быть один мяч. Но я писал код в спешке, и в нём две поломки. Браузер сломанные записи выбрасывает, поэтому мяча нет. Найди и почини обе.',
      'Three pages are done! The fourth is the ball game. There should be one ball on the background here. But I wrote the code in a hurry, and it has two broken spots. The browser throws broken entries away, so there’s no ball. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni tuzating: fonda bitta to'p", 'Почини две поломки: на фоне один мяч', 'Fix the two broken spots: one ball on the background'),
    ok: L3("Mana, tuzaldi! Fonda bitta to'p turibdi. O'yin boshlansin!", 'Есть, починено! На фоне один мяч. Игра начинается!', 'Fixed it! There’s one ball on the background. Let the game begin!'),
    hints: [
      L3("Rasm qanday yoziladi, esingizdami? Takrorlash qiymatiga ham qarang: u ikki so'zdan iborat, ular o'rtasida nima turadi?", 'Помнишь, как записывают картинку? И посмотри на значение повтора: оно из двух слов, что между ними?', 'Remember how a picture is written? And look at the repeat value: it’s two words; what goes between them?'),
      L3("Birinchi qatorda url so'zi va qavslar yo'q. Ikkinchisida no va repeat o'rtasida bo'sh joy turibdi, chiziqcha bo'lishi kerak.", 'В первой строке нет слова url и скобок. Во второй между no и repeat пробел, а нужен дефис.', 'The first line is missing the word url and the brackets. In the second there’s a space between no and repeat, but it needs a hyphen.'),
      L3("Namuna kod ostida: rasm va no-repeat to'g'ri yozilgan. Ikkala qatorni xuddi shunday qiling va «Tekshirish»ni bosing.", 'Образец под кодом — картинка и no-repeat записаны верно. Сделай обе строки так же и нажми «Проверить».', 'The example under the code has the picture and no-repeat written correctly. Make both lines the same way and tap Check.')
    ],
    no: L3("Yozuvlar ishlayapti, lekin fonda bitta to'p ko'rinmayapti. Rasm futbol.png, takrorlanmasligi uchun esa no-repeat kerak.", 'Записи работают, но на фоне не один мяч. Картинка — futbol.png, а чтобы не повторялась — no-repeat.', 'The entries work, but there isn’t one ball on the background. The picture is futbol.png, and no-repeat keeps it from repeating.'),
    drill: L3("endi maydon rasmini tuzating: fayl maydon.jpg", 'теперь почини картинку поля: файл maydon.jpg', 'now fix the field picture: the file is maydon.jpg'),
    drillNo: L3("Maydon hali ko'rinmayapti. Fayl nomini harfma-harf tekshiring: maydon.jpg.", 'Поля пока не видно. Проверь имя файла буква за буквой: maydon.jpg.', 'The field isn’t showing yet. Check the file name letter by letter: maydon.jpg.')
  },
  t5: {
    eyebrow: L3("Mening kunim", 'Мой день', 'My day'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z dam olish kuningiz sahifasi. Fonga istalgan rasmni qo'ying, unga zaxira rang ham bering, sarlavha orqasini esa o'zingiz bo'yang. Oyna ostida nima tayyorligi va fayllar nomi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: страница твоего выходного. Поставь на фон любую картинку, дай ей запасной цвет, а фон заголовка раскрась по-своему. Под окном видно, что уже готово, и имена файлов.',
      'Four pages are lit! The last one is yours: a page about your day off. Put any picture on the background, give it a backup color, and paint the heading’s background yourself. Under the window you can see what’s done and the file names.'),
    ask: L3("Kuningiz sahifasini bezang", 'Оформи страницу своего дня', 'Style your day’s page'),
    ok: L3("Ura! Sizning dam olish kuningiz tayyor, u o'z foningizda!", 'Ура! Твой выходной готов, и он на твоём собственном фоне!', 'Hooray! Your day off is ready, on your very own background!'),
    hints: [
      L3("body tegidan boshlang: unga rasm va zaxira rang kerak. Keyin sarlavha uchun alohida qoida yozing.", 'Начни с body: ему нужны картинка и запасной цвет. Потом напиши отдельное правило для заголовка.', 'Start with body: it needs a picture and a backup color. Then write a separate rule for the heading.'),
      L3("body ichida background-image bilan url va background-color yozing, h1 uchun esa background-color. Fayllar: maydon.jpg, osmon.jpg, futbol.png va yulduz.png.", 'В body напиши background-image с url и background-color, а для h1 — background-color. Файлы: maydon.jpg, osmon.jpg, futbol.png и yulduz.png.', 'In body write background-image with url and background-color, and for h1 background-color. Files: maydon.jpg, osmon.jpg, futbol.png and yulduz.png.'),
      L3("Namuna kod ostida: boshqa rasm va ranglar bilan. O'zingizga yoqqanini tanlang.", 'Образец под кодом — с другой картинкой и цветами. Выбери, что нравится тебе.', 'The example under the code uses another picture and colors. Pick what you like.')
    ],
    needImg: L3("Fonda rasm yo'q: body tegiga background-image yozing, qiymati url va fayl nomi.", 'На фоне нет картинки: напиши для body background-image, значение — url и имя файла.', 'No picture on the background: write background-image for body, with url and a file name.'),
    noFile: L3("Brauzer bunday faylni topmadi. Oyna ostidagi ro'yxatdan fayl nomini harfma-harf yozing.", 'Браузер не нашёл такой файл. Напиши имя из списка под окном буква в букву.', 'The browser didn’t find that file. Type a name from the list under the window letter by letter.'),
    needColor: L3("Zaxira rang yo'q: body tegiga background-color ham yozing. Rasm chiqmasa, shu rang ko'rinadi.", 'Нет запасного цвета: напиши для body ещё и background-color. Если картинки не будет, виден будет он.', 'No backup color: write background-color for body too. If the picture doesn’t show, that color will.'),
    needH1: L3("Sarlavha orqasi bo'yalmagan: h1 tegiga background-color yozing.", 'Фон заголовка не покрашен: напиши для h1 background-color.', 'The heading’s background isn’t painted: write background-color for h1.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Dam olish kunining beshta sahifasi ham tayyor! Har bir fonni siz o'zingiz yozdingiz.", 'Все пять страниц выходного готовы! Каждый фон — твоя работа.', 'All five pages of the day off are ready! Every background is your work.') },
      { k: 'a', text: L3("background-color istalgan elementning orqasini bo'yaydi: butun sahifani, sarlavhani yoki abzasni.", 'background-color красит фон любого элемента: всей страницы, заголовка или абзаца.', 'background-color paints the background of any element: the whole page, a heading or a paragraph.') },
      { k: 'b', text: L3("background-image fonga rasm qo'yadi: url va qavs ichida fayl nomi.", 'background-image ставит на фон картинку: url и имя файла в скобках.', 'background-image puts a picture on the background: url and the file name in brackets.') },
      { k: 'c', text: L3("no-repeat rasmni bitta qoldiradi, cover esa uni butun fonga yoyadi.", 'no-repeat оставляет одну картинку, а cover растягивает её на весь фон.', 'no-repeat leaves just one picture, and cover stretches it over the whole background.') },
      { k: 'd', text: L3("Buzilgan fonni ham tuzatasiz: url, fayl nomi va no-repeat ichidagi chiziqcha.", 'И чинишь сломанный фон: url, имя файла и дефис в no-repeat.', 'And you fix a broken background: url, the file name and the hyphen in no-repeat.') },
      { k: null, text: L3("Keyingi darsda matn va shriftlar bilan ishlaymiz. Ko'rishguncha!", 'На следующем уроке поработаем с текстом и шрифтами. До встречи!', 'Next lesson we’ll work with text and fonts. See you!') }
    ],
    roles: {
      a: L3("background-color: istalgan element", 'background-color: любой элемент', 'background-color: any element'),
      b: L3('background-image: url("…")', 'background-image: url("…")', 'background-image: url("…")'),
      c: L3("no-repeat va cover", 'no-repeat и cover', 'no-repeat and cover'),
      d: L3("tuzatish: url, fayl nomi, «-»", 'починка: url, имя файла, «-»', 'fixing: url, the file name, “-”')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
