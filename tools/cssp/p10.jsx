// =============================================================================
// ===== ПРАКТИКА 10 · «Космический сайт Коди» · к уроку 10 «Flexbox: расположение элементов» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении космического сайта стёрся CSS: карточки планет выпали из ряда и встали друг
// под другом, вкладки погасли. Ученик расставляет всё Flexbox: заменить block на flex у полки (div.javon) → вписать
// направление в готовое правило: обратный отсчёт 3, 2, 1 (row-reverse; дополнительная — column) → правило целиком:
// меню из ссылок-блоков (урок 9) в ряд — flex пишут родителю nav, а не ссылкам → починить две поломки урока
// (flexbox вместо flex, colum; звёзды — span, без flex стоят в строку, после починки — столбиком; дополнительная —
// flex у карточек-детей) → своя вселенная: полка flex,
// своё направление и цвет карточек (условия «готово» видны). Раскладка карточек — в стилях сайта (base).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-10p-flexbox-osi.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz», «yorliq» — вкладка); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-10p-flexbox-osi',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "10-amaliyot. Sayyoralar qatorda", ru: 'Практика 10. Планеты в ряд', en: 'Practice 10. Planets in a row' }
};

// Страницы космического сайта (тексты на языке урока).
const P10 = {
  title: L3("Kodining kosmik sayti", 'Космический сайт Коди', 'Kodi’s space site'),
  sys: L3("Quyosh tizimi", 'Солнечная система', 'Solar system'),
  start: L3("Start", 'Старт', 'Launch'),
  trip: L3("Sayohat", 'Путешествие', 'Journey'),
  stars: L3("Yulduzlar", 'Звёзды', 'Stars'),
  mine: L3("Mening koinotim", 'Моя вселенная', 'My universe'),
  merc: L3("Merkuriy", 'Меркурий', 'Mercury'),
  venus: L3("Venera", 'Венера', 'Venus'),
  earth: L3("Yer", 'Земля', 'Earth'),
  mars: L3("Mars", 'Марс', 'Mars'),
  moon: L3("Oy", 'Луна', 'Moon'),
  jup: L3("Yupiter", 'Юпитер', 'Jupiter'),
  sat: L3("Saturn", 'Сатурн', 'Saturn'),
  moons: L3("Mars yo'ldoshlari", 'Спутники Марса', 'Moons of Mars'),
  phobos: L3("Fobos", 'Фобос', 'Phobos'),
  deimos: L3("Deymos", 'Деймос', 'Deimos'),
  count: L3("Teskari sanoq", 'Обратный отсчёт', 'Countdown'),
  where: L3("Qayerga uchamiz?", 'Куда летим?', 'Where are we flying?'),
  pick: L3("Menyudan sayyorani tanlang.", 'Выбери планету в меню.', 'Pick a planet in the menu.'),
  contact: L3("Aloqa", 'Контакты', 'Contact'),
  help: L3("Yordam", 'Помощь', 'Help'),
  bright: L3("Eng yorqin yulduzlar", 'Самые яркие звёзды', 'Brightest stars'),
  s1: L3("1. Sirius", '1. Сириус', '1. Sirius'),
  s2: L3("2. Vega", '2. Вега', '2. Vega'),
  s3: L3("3. Kapella", '3. Капелла', '3. Capella'),
  planets: L3("Ulkan sayyoralar", 'Планеты-гиганты', 'Giant planets')
};
// Полка: родитель div.<cls> и дети div.karta.
const p10Shelf = (pk, cls, kids) => '<div class="' + cls + '">' + kids.map((k) => '<div class="karta">' + (typeof k === 'string' ? k : pk(k)) + '</div>').join('') + '</div>';
const p10Page = (title, kids, cls) => (pk) => '<h1>' + pk(title) + '</h1>' + p10Shelf(pk, cls || 'javon', kids);
// Звёзды — строчные span внутри полки: без flex стоят в строку, как слова (урок 9).
const p10Chips = (title, kids) => (pk) => '<h1>' + pk(title) + '</h1><div class="javon">' + kids.map((k) => '<span class="karta">' + pk(k) + '</span>').join(' ') + '</div>';
const p10Trip = (pk) => '<nav><a>' + pk(P10.earth) + '</a><a>' + pk(P10.moon) + '</a><a>' + pk(P10.mars) + '</a></nav><h1>' + pk(P10.where) + '</h1><p>' + pk(P10.pick) + '</p>';
const p10Foot = (pk) => '<h1>' + pk(P10.trip) + '</h1><p>' + pk(P10.pick) + '</p><footer><a>' + pk(P10.contact) + '</a><a>' + pk(P10.help) + '</a></footer>';

// Проверка цели: вычисленные display и flex-direction (как в DevTools); есть ли у селектора свойство в правилах ученика.
const p10D = (D, sel) => D.cs(sel, 'display');
const p10Dir = (D, sel) => D.cs(sel, 'flex-direction');
const p10Has = (D, sel, prop) => D.rules.some((r) => r.sel && r.style && cpNormSel(r.sel) === cpNormSel(sel) && !!r.style.getPropertyValue(prop));

const PR = {
  next: L3("Flexbox: tekislash", 'Flexbox: выравнивание', 'Flexbox: alignment'),
  // Сайт по умолчанию (не виден ученику): полка — светлая коробка с пунктиром (видно родителя), карточки — сиреневые
  // с отступами (как основа урока 10), ссылки меню — с фоном.
  base: 'h1{font-size:22px}.javon,.oylar,.qator{background-color:#F8FAFC;border:1px dashed #94A3B8;padding:4px;margin:6px 0}' +
    '.karta{background-color:lavender;margin:4px;padding:4px 10px}span.karta{padding:4px 6px;white-space:nowrap}nav a,footer a{background-color:lavender;color:#3B2A8F;margin:3px;padding:4px 12px}',
  tabs: [
    { ico: 'sun', c: '#F59E0B', name: P10.sys, file: 'quyosh.html' },
    { ico: 'rocket', c: '#FA4F28', name: P10.start, file: 'start.html' },
    { ico: 'pin', c: '#0FA38E', name: P10.trip, file: 'sayohat.html' },
    { ico: 'star', c: '#7C5CFA', name: P10.stars, file: 'yulduzlar.html' },
    { ico: 'palette', c: '#E44D8A', name: P10.mine, file: 'mening.html' }
  ],
  hook: {
    page: p10Page(P10.title, [P10.merc, P10.venus, P10.earth, P10.mars]),
    css: ['  .javon { display: flex; }', '  .karta { border-radius: 12px; }', '  h1 { color: navy; }']
  },
  ownPage: p10Page(P10.mine, [P10.earth, P10.mars, P10.sat]),
  ownDefault: '.javon {\n  display: flex;\n  flex-direction: column;\n}\n.karta { background-color: lightblue; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: block → flex, планеты в ряд.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.javon { display: block; }', answer: '.javon { display: flex; }',
      page: p10Page(P10.sys, [P10.merc, P10.venus, P10.earth]),
      goal: (D) => (p10D(D, '.javon') === 'flex' ? null : C.t1.no),
      sample: ['.qator { display: flex; }'],
      drill: { single: true, page: p10Page(P10.moons, [P10.phobos, P10.deimos], 'oylar'), code0: '.oylar { display: block; }', answer: '.oylar { display: flex; }',
        goal: (D) => (p10D(D, '.oylar') === 'flex' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в готовое правило: обратный отсчёт в ряд (row-reverse); дополнительная — столбик (column).
    (pk) => cpTask(2, {
      kind: 'write-declaration', given: ['.javon { display: flex; }'], code0: '.javon {\n  \n}', answer: '.javon {\n  flex-direction: row-reverse;\n}',
      page: p10Page(P10.count, ['1', '2', '3']),
      goal: (D) => {
        const d = p10Dir(D, '.javon');
        return d === 'row-reverse' ? null : d === 'column-reverse' ? C.t2.colRev : d === 'column' ? C.t2.col : C.t2.no;
      },
      sample: ['.qator {', '  flex-direction: row-reverse;', '}'],
      drill: { code0: '.javon {\n  \n}', answer: '.javon {\n  flex-direction: column;\n}',
        goal: (D) => (p10Dir(D, '.javon') === 'column' ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: ссылки-блоки (урок 9) в ряд — flex пишут родителю nav.
    (pk) => cpTask(3, {
      kind: 'write-rule', given: ['a { display: block; }'], code0: '', answer: 'nav { display: flex; }',
      page: p10Trip,
      htmlAid: (pk) => ['<nav>', '  <a>' + pk(P10.earth) + '</a> <a>' + pk(P10.moon) + '</a> <a>' + pk(P10.mars) + '</a>', '</nav>', '<h1>' + pk(P10.where) + '</h1>'],
      goal: (D) => {
        if (p10D(D, 'nav') !== 'flex') {
          const a = p10D(D, 'a');
          return a === 'flex' ? C.t3.child : (a === 'inline-block' || a === 'inline') ? C.t3.old : C.t3.no;
        }
        const d = p10Dir(D, 'nav');
        return d === 'row' ? null : d === 'row-reverse' ? C.t3.rev : C.t3.col;
      },
      sample: ['ul { display: flex; }'],
      drill: { page: p10Foot, code0: '', answer: 'footer { display: flex; }',
        htmlAid: (pk) => ['<p>' + pk(P10.pick) + '</p>', '<footer>', '  <a>' + pk(P10.contact) + '</a> <a>' + pk(P10.help) + '</a>', '</footer>'],
        goal: (D) => (p10D(D, 'footer') === 'flex' && p10Dir(D, 'footer') === 'row' ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: flexbox вместо flex и colum; дополнительная — flex у карточек-детей.
    // Звёзды — span: пока полка не flex, они стоят в строку; после починки — столбиком (разница видна).
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.javon {\n  display: flexbox;\n  flex-direction: colum;\n}',
      answer: '.javon {\n  display: flex;\n  flex-direction: column;\n}',
      page: p10Chips(P10.bright, [P10.s1, P10.s2, P10.s3]),
      goal: (D) => (p10D(D, '.javon') !== 'flex' ? C.t4.noFlex : p10Dir(D, '.javon') === 'column' ? null : C.t4.dir),
      sample: ['.ustun {', '  display: flex;', '  flex-direction: column;', '}'],
      drill: { single: true, page: p10Page(P10.planets, [P10.jup, P10.sat], 'qator'), code0: '.karta { display: flex; }', answer: '.qator { display: flex; }',
        htmlAid: (pk) => ['<div class="qator">', '  <div class="karta">' + pk(P10.jup) + '</div>', '  <div class="karta">' + pk(P10.sat) + '</div>', '</div>'],
        goal: (D) => (p10D(D, '.qator') === 'flex' ? null : C.t4.drillNo) }
    }),
    // Т5 · своя вселенная: полка flex, своё направление, цвет карточек.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '',
      answer: '.javon {\n  display: flex;\n  flex-direction: row-reverse;\n}\n.karta { background-color: gold; }',
      page: p10Page(P10.mine, [P10.earth, P10.mars, P10.sat]),
      list: [
        { t: L3(".javon: display flex", '.javon: display flex', '.javon: display flex'), ok: (D) => p10D(D, '.javon') === 'flex' },
        { t: L3(".javon: yo'nalish", '.javon: направление', '.javon: direction'), ok: (D) => p10Has(D, '.javon', 'flex-direction') },
        { t: L3(".karta: fon rangi", '.karta: цвет фона', '.karta: background color'), ok: (D) => p10Has(D, '.karta', 'background-color') }
      ],
      goal: (D) => {
        if (p10D(D, '.javon') !== 'flex') return p10D(D, '.karta') === 'flex' ? C.t5.child : C.t5.needFlex;
        if (!p10Has(D, '.javon', 'flex-direction')) return C.t5.needDir;
        if (!p10Has(D, '.karta', 'background-color')) return C.t5.needBg;
        return null;
      },
      sample: ['.javon {', '  display: flex;', '  flex-direction: column-reverse;', '}', '.karta { background-color: pink; }'],
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
    eyebrow: L3("Kosmik sayt", 'Космический сайт', 'Space site'),
    say: L3("Salom! Bu mening kosmik saytim. Qarang: sayyoralar kartochkalari javonda bir qatorga tizilib turibdi, xuddi koinot xaritasidagidek. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это мой космический сайт. Смотри: карточки планет выстроились на полке в ряд, как на карте космоса. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my space website. Look: the planet cards are lined up in a row on the shelf, like on a space map. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Kartochkalar qatordan chiqib, bir-birining ostiga tushib qoldi. Yorliqlar ham o'chdi.",
      'Ой! CSS-код стёрся. Карточки выпали из ряда и встали друг под другом. И вкладки погасли.',
      'Oh no! The CSS code got erased. The cards fell out of the row and stacked up. The tabs went dark too.'),
    done: L3("HTML joyida: javon ham, uning ichidagi kartochkalar ham turibdi. O'tgan darsda Flexbox bilan tanishdik: display flex ota qutiga yoziladi, flex-direction esa yo'nalishni beradi. Endi beshta sahifani birma-bir tiklaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizning koinotingiz bo'ladi.",
      'HTML на месте: и полка, и карточки в ней. На прошлом уроке мы познакомились с Flexbox: display flex пишут коробке-родителю, а flex-direction задаёт направление. Теперь вернём пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей вселенной.',
      'The HTML is fine: the shelf and the cards inside it are there. Last lesson we met Flexbox: display flex goes on the parent box, and flex-direction sets the direction. Now let’s bring back the five pages one by one, and you’ll write the code. The fifth page will be your own universe.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tiklaymiz: kodni siz yozasiz", 'Вернём пять страниц: код пишешь ты', 'Let’s bring back five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Quyosh tizimi", 'Солнечная система', 'Solar system'),
    say: L3("Birinchi sahifa: Quyosh tizimi. Javon qoidasida display block turibdi, shuning uchun sayyoralar ustma-ust. Ular bir qatorga tizilsin: qoidadagi qiymatni almashtiring.",
      'Первая страница: Солнечная система. В правиле полки стоит display block, поэтому планеты стоят друг под другом. Пусть они выстроятся в ряд: замени значение в правиле.',
      'The first page is the solar system. The shelf rule says display block, so the planets are stacked. Let them line up in a row: change the value in the rule.'),
    ask: L3("Sayyoralarni bir qatorga tering", 'Поставь планеты в ряд', 'Line the planets up in a row'),
    ok: L3("Ajoyib! Sayyoralar bir qatorga tizildi, xuddi orbitadagidek!", 'Отлично! Планеты выстроились в ряд, прямо как на орбите!', 'Great! The planets lined up in a row, just like in orbit!'),
    hints: [
      L3("Qaysi qiymat ota qutini moslashuvchan qiladi va bolalarni qatorga teradi?", 'Какое значение делает коробку-родителя гибкой и ставит детей в ряд?', 'Which value makes the parent box flexible and lines the children up in a row?'),
      L3("Bu flex. block so'zini o'chirib, flex deb yozing. Esingizda bo'lsin: flexbox emas, faqat flex.", 'Это flex. Сотри block и напиши flex. Помни: не flexbox, а просто flex.', 'It’s flex. Erase block and write flex. Remember: not flexbox, just flex.'),
      L3("Namuna kod ostida: u boshqa qutini flex qiladi. Javon uchun ham xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом делает flex другую коробку. Для полки напиши так же и нажми «Проверить».', 'The example under the code makes another box flex. Write the same for the shelf and tap Check.')
    ],
    no: L3("Sayyoralar hali ustma-ust turibdi. Javonga flex qiymati kerak.", 'Планеты всё ещё друг под другом. Полке нужно значение flex.', 'The planets are still stacked. The shelf needs the value flex.'),
    drill: L3("endi Mars yo'ldoshlarini ham qatorga tering", 'теперь поставь в ряд и спутники Марса', 'now line up the moons of Mars too'),
    drillNo: L3("Yo'ldoshlar hali ustma-ust. Ularning ota qutisiga ham flex kerak.", 'Спутники всё ещё друг под другом. Их коробке-родителю тоже нужен flex.', 'The moons are still stacked. Their parent box needs flex too.')
  },
  t2: {
    eyebrow: L3("Start", 'Старт', 'Launch'),
    say: L3("Quyosh tizimi tayyor! Endi raketa starti. Teskari sanoq kerak: uch, ikki, bir. Lekin kartochkalar bir, ikki, uch tartibida turibdi. HTML kodni o'zgartirmasdan ularni teskari qatorga qo'ying: bo'sh qoidaga yo'nalishni yozing.",
      'Солнечная система готова! Теперь старт ракеты. Нужен обратный отсчёт: три, два, один. Но карточки стоят по порядку: один, два, три. Не трогая HTML, поставь их в обратный ряд: впиши в пустое правило направление.',
      'The solar system is done! Now the rocket launch. We need a countdown: three, two, one. But the cards stand in order: one, two, three. Without touching the HTML, put them in a reversed row: write the direction in the empty rule.'),
    ask: L3("Qatorda teskari sanoq bo'lsin: 3, 2, 1", 'Сделай обратный отсчёт в ряд: 3, 2, 1', 'Make a countdown in a row: 3, 2, 1'),
    ok: L3("Uch, ikki, bir, start! Asosiy o'q endi o'ngdan chapga ketadi, raketa esa uchishga tayyor!", 'Три, два, один, пуск! Главная ось теперь идёт справа налево, а ракета готова к полёту!', 'Three, two, one, liftoff! The main axis now runs right to left, and the rocket is ready to fly!'),
    hints: [
      L3("Yo'nalishni qaysi xususiyat beradi? Qator teskari bo'lishi uchun qaysi so'z qo'shiladi?", 'Какое свойство задаёт направление? Какое слово делает ряд обратным?', 'Which property sets the direction? Which word makes a row reversed?'),
      L3("Xususiyat flex-direction. Qator row, teskari esa reverse: ular chiziqcha bilan qo'shib yoziladi.", 'Свойство flex-direction. Ряд — row, обратный — reverse: их пишут вместе через чёрточку.', 'The property is flex-direction. A row is row, reversed is reverse: they’re joined with a dash.'),
      L3("Namuna kod ostida: u boshqa qutini teskari qatorga qo'yadi. Javon uchun ham xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом ставит в обратный ряд другую коробку. Для полки напиши так же и нажми «Проверить».', 'The example under the code puts another box in a reversed row. Write the same for the shelf and tap Check.')
    ],
    no: L3("Tartib hali bir, ikki, uch. Teskari qator kerak.", 'Порядок пока один, два, три. Нужен обратный ряд.', 'The order is still one, two, three. We need a reversed row.'),
    col: L3("Kartochkalar ustun bo'lib qoldi. Bizga qator kerak, faqat teskari.", 'Карточки встали столбиком. А нужен ряд, только обратный.', 'The cards became a column. We need a row, just reversed.'),
    colRev: L3("Sanoq to'g'ri, lekin ustunda. Bizga qator kerak: column emas, row.", 'Отсчёт верный, но столбиком. А нужен ряд: не column, а row.', 'The countdown is right, but it’s a column. We need a row: row, not column.'),
    drill: L3("endi kartochkalarni ustun qilib qo'ying", 'теперь поставь карточки столбиком', 'now put the cards in a column'),
    drillNo: L3("Kartochkalar hali ustunda emas. Tepadan pastga ustun uchun column kerak.", 'Карточки пока не столбиком. Для столбика сверху вниз нужен column.', 'The cards aren’t in a column yet. For a top-to-bottom column you need column.')
  },
  t3: {
    eyebrow: L3("Sayohat", 'Путешествие', 'Journey'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: sayohat. Bu yerda menyu bor, lekin havolalar block, shuning uchun ustma-ust turibdi. Ular bir qatorga tizilsin. Qoidani o'zingiz yozing, faqat oldin o'ylab ko'ring: flex kimga yoziladi?",
      'Две страницы горят! Третья: путешествие. Здесь есть меню, но ссылки — block, поэтому стоят друг под другом. Пусть они выстроятся в ряд. Правило напиши своими руками, только сначала подумай: кому пишут flex?',
      'Two pages are lit! The third is the journey. There’s a menu here, but the links are block, so they’re stacked. Let them line up in a row. Write the rule yourself, but first think: who gets flex?'),
    ask: L3("Menyu havolalarini bir qatorga tering", 'Поставь ссылки меню в ряд', 'Line up the menu links in a row'),
    ok: L3("Zo'r! Menyu bir qatorda: havolalar ota qutining buyrug'iga bo'ysundi.", 'Огонь! Меню в одну строку: ссылки послушались коробку-родителя.', 'Awesome! The menu is in one row: the links followed their parent box.'),
    hints: [
      L3("HTML kodga qarang: havolalar qaysi teg ichida turibdi? Aynan u ota quti.", 'Посмотри в HTML-код: внутри какого тега лежат ссылки? Это и есть коробка-родитель.', 'Look at the HTML code: which tag are the links inside? That’s the parent box.'),
      L3("Havolalar nav ichida. Selektor nav, xususiyat display, qiymati flex.", 'Ссылки лежат в nav. Селектор nav, свойство display, значение flex.', 'The links are inside nav. The selector is nav, the property is display, the value is flex.'),
      L3("Namuna kod ostida: u ro'yxatni flex qiladi. nav uchun ham xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом делает flex список. Для nav напиши так же и нажми «Проверить».', 'The example under the code makes a list flex. Write the same for nav and tap Check.')
    ],
    no: L3("Havolalar hali ustma-ust. Ular yashaydigan ota qutini toping va unga flex bering.", 'Ссылки всё ещё друг под другом. Найди коробку-родителя, в которой они лежат, и дай ей flex.', 'The links are still stacked. Find the parent box they live in and give it flex.'),
    child: L3("Flex havolalarning o'ziga yozildi, ular esa bolalar. Flex ota qutiga yoziladi: havolalarni o'rab turgan nav tegiga.", 'flex написан самим ссылкам, а они — дети. flex пишут родителю: тегу nav, в котором лежат ссылки.', 'flex went on the links themselves, and they’re the children. flex goes on the parent: the nav tag that holds the links.'),
    old: L3("Havolalar yonma-yon bo'ldi, lekin bu o'tgan darsning usuli. Bugun Flexbox: ota qutiga flex bering.", 'Ссылки встали рядом, но это способ прошлого урока. Сегодня Flexbox: дай родителю flex.', 'The links are side by side, but that’s last lesson’s way. Today it’s Flexbox: give the parent flex.'),
    col: L3("nav flex bo'ldi, lekin havolalar ustunda. Qator uchun column kerak emas.", 'nav стал flex, но ссылки стоят столбиком. Для ряда column не нужен.', 'nav is flex now, but the links are in a column. A row doesn’t need column.'),
    rev: L3("Qator teskari bo'lib qoldi. Oddiy qator uchun reverse kerak emas.", 'Ряд получился обратным. Для обычного ряда reverse не нужен.', 'The row came out reversed. A normal row doesn’t need reverse.'),
    drill: L3("endi pastdagi havolalarni ham qatorga tering", 'теперь поставь в ряд и ссылки внизу', 'now line up the links at the bottom too'),
    drillNo: L3("Pastdagi havolalar hali ustma-ust. Ular footer ichida turibdi: unga flex bering.", 'Ссылки внизу всё ещё друг под другом. Они лежат в footer: дай ему flex.', 'The bottom links are still stacked. They’re inside footer: give it flex.')
  },
  t4: {
    eyebrow: L3("Yulduzlar", 'Звёзды', 'Stars'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: eng yorqin yulduzlar. Telefonda ular o'rinlari bo'yicha ustun bo'lib turishi kerak. Men javonga flex va ustun yozdim, lekin shoshib, ikkita joyni buzib qo'yibman. Shuning uchun yulduzlar hamon yonma-yon turibdi. Ikkala buzilgan joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: самые яркие звёзды. На телефоне они должны стоять столбиком, по местам. Я написал полке flex и столбик, но в спешке сломал два места. Поэтому звёзды так и стоят рядом. Найди и почини обе поломки.',
      'Three pages are done! The fourth is the brightest stars. On a phone they should stand in a column, in order of their places. I gave the shelf flex and a column, but in a hurry I broke two spots. That’s why the stars still sit side by side. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana, tuzaldi! Yulduzlar ustun bo'lib turibdi: asosiy o'q endi tepadan pastga ketadi.", 'Вот, починено! Звёзды стоят столбиком: главная ось теперь идёт сверху вниз.', 'There, it’s fixed! The stars stand in a column: the main axis now runs top to bottom.'),
    hints: [
      L3("Ikkala qiymatni darsdagi so'zlar bilan solishtiring: ular harfma-harf bir xilmi?", 'Сравни оба значения со словами из урока: совпадают буква в букву?', 'Compare both values with the words from the lesson: do they match letter for letter?'),
      L3("display uchun flexbox degan qiymat yo'q, faqat flex bor. column so'zida esa oxirgi harf tushib qolgan.", 'У display нет значения flexbox, есть просто flex. А в слове column потерялась последняя буква.', 'display has no value flexbox, just flex. And the word column is missing its last letter.'),
      L3("Namuna kod ostida: flex va ustun bilan to'g'ri qoida. Xuddi shunday tuzating va Tekshirishni bosing.", 'Образец под кодом — верное правило с flex и столбиком. Почини так же и нажми «Проверить».', 'The example under the code is a correct rule with flex and a column. Fix yours the same way and tap Check.')
    ],
    noFlex: L3("Javon hali flex emas, yo'nalish esa faqat flex qutida ishlaydi.", 'Полка ещё не flex, а направление работает только во flex-коробке.', 'The shelf isn’t flex yet, and the direction only works in a flex box.'),
    dir: L3("Javon flex bo'ldi, lekin yulduzlar hali ustunda emas. Tepadan pastga ustun uchun column kerak.", 'Полка стала flex, но звёзды ещё не столбиком. Для столбика сверху вниз нужен column.', 'The shelf is flex, but the stars aren’t in a column yet. A top-to-bottom column needs column.'),
    drill: L3("endi ulkan sayyoralar qoidasini tuzating", 'теперь почини правило для планет-гигантов', 'now fix the rule for the giant planets'),
    drillNo: L3("Sayyoralar hali qatorga tizilmadi: flex bolalarga yozilgan. Uni ota qutiga yozing, uning klassi qator.", 'Планеты всё ещё не в ряд: flex написан детям. Напиши его родителю, его класс — qator.', 'The planets still aren’t in a row: flex went on the children. Write it on the parent, its class is qator.')
  },
  t5: {
    eyebrow: L3("Mening koinotim", 'Моя вселенная', 'My universe'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z koinotingiz. Javonni flex qiling, sayyoralar qaysi tomonga tizilishini o'zingiz tanlang va kartochkalarga fon rangi bering. Javonning klassi javon, kartochkalarniki esa karta. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: собственная вселенная. Сделай полку flex, выбери, куда выстроятся планеты, и дай карточкам цвет фона. Класс полки — javon, а у карточек — karta. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: your own universe. Make the shelf flex, choose which way the planets line up, and give the cards a background color. The shelf’s class is javon, and the cards’ is karta. Under the window you can see what’s done.'),
    ask: L3("Javonni flex qiling, yo'nalish va rang tanlang", 'Сделай полку flex, выбери направление и цвет', 'Make the shelf flex, pick a direction and a color'),
    ok: L3("Ura! Sizning koinotingiz tayyor, sayyoralar siz tanlagan tomonga tizildi!", 'Ура! Твоя вселенная готова, планеты выстроились в выбранную тобой сторону!', 'Hooray! Your universe is ready, and the planets lined up the way you chose!'),
    hints: [
      L3("Ikkita qoida kerak: biri javon uchun, biri kartochkalar uchun.", 'Нужны два правила: одно для полки, другое для карточек.', 'You need two rules: one for the shelf, one for the cards.'),
      L3("Javonga display flex va flex-direction: row, column yoki ularning teskarisi. Kartochkalarga esa background-color.", 'Полке — display flex и flex-direction: row, column или обратные. А карточкам — background-color.', 'The shelf gets display flex and flex-direction: row, column or their reverses. The cards get background-color.'),
      L3("Namuna kod ostida: boshqa qiymatlar bilan ikkita qoida. O'zingiz yoqtirgan yo'nalish va rangni tanlang.", 'Образец под кодом — два правила с другими значениями. Выбери своё направление и цвет.', 'The example under the code has two rules with other values. Pick your own direction and color.')
    ],
    needFlex: L3("Javon hali flex emas: javon klassiga display flex yozing.", 'Полка пока не flex: напиши для класса javon display flex.', 'The shelf isn’t flex yet: write display flex for the javon class.'),
    child: L3("flex kartochkalarga yozildi, lekin u ota qutiga yoziladi: bu javon.", 'flex написан карточкам, а его пишут родителю — полке.', 'flex went on the cards, but it goes on the parent: the shelf.'),
    needDir: L3("Yo'nalishni tanlang: javonga flex-direction yozing.", 'Выбери направление: напиши полке flex-direction.', 'Pick a direction: write flex-direction for the shelf.'),
    needBg: L3("Kartochkalarga rang bering: karta klassiga background-color yozing.", 'Дай карточкам цвет: напиши для класса karta background-color.', 'Give the cards a color: write background-color for the karta class.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kosmik saytning beshta sahifasi ham yana tartibli! Sayyoralar va yulduzlarni siz yozgan Flexbox joy-joyiga qo'ydi.", 'Все пять страниц космического сайта снова в порядке! Планеты и звёзды расставил Flexbox, написанный твоими руками.', 'All five pages of the space site are in order again! The Flexbox you wrote put the planets and stars in place.') },
      { k: 'a', text: L3("display flex ota qutiga yoziladi, bolalari esa qatorga tiziladi.", 'display flex пишут коробке-родителю, и её дети встают в ряд.', 'display flex goes on the parent box, and its children line up in a row.') },
      { k: 'b', text: L3("flex-direction yo'nalishni beradi: row qator, column ustun, reverse esa teskari tartib.", 'flex-direction задаёт направление: row — ряд, column — столбик, а reverse — обратный порядок.', 'flex-direction sets the direction: row is a row, column is a column, and reverse flips the order.') },
      { k: 'c', text: L3("Asosiy o'q shu yo'nalish bo'yicha ketadi, ko'ndalang o'q esa unga tik turadi.", 'Главная ось идёт по этому направлению, а поперечная — поперёк неё.', 'The main axis follows that direction, and the cross axis runs across it.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: flexbox degan qiymat, column so'zida tushib qolgan harf va bolalarga yozilgan flex.", 'И находишь поломки: значение flexbox, потерянную букву в column и flex у детей.', 'And you find broken spots: the value flexbox, a missing letter in column and flex on the children.') },
      { k: null, text: L3("Keyingi darsda kartochkalarni o'qlar bo'ylab tekislashni o'rganamiz: o'rtaga, chetlarga va bir-biridan bo'shliq bilan. Ko'rishguncha!", 'На следующем уроке научимся выравнивать карточки по осям: по центру, по краям и с промежутками. До встречи!', 'Next lesson we’ll learn to align the cards along the axes: to the center, to the edges and with gaps. See you!') }
    ],
    roles: {
      a: L3("display: flex — ota qutiga", 'display: flex — родителю', 'display: flex — on the parent'),
      b: L3("flex-direction: row, column, reverse", 'flex-direction: row, column, reverse', 'flex-direction: row, column, reverse'),
      c: L3("asosiy va ko'ndalang o'q", 'главная и поперечная ось', 'main and cross axis'),
      d: L3("tuzatish: flex, column, flex otaga", 'починка: flex, column, flex родителю', 'fixing: flex, column, flex on the parent')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
