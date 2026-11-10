// =============================================================================
// ===== ПРАКТИКА 11 · «Кинотеатр Коди» · к уроку 11 «Flexbox: выравнивание» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта кинотеатра Коди стёрся CSS: афиши свалились друг под друга, вкладки
// погасли. Ученик наводит порядок на пяти страницах сам: заменить flex-start на center (афиши в середину) → вписать
// align-items: flex-end в пустое правило (угощения на дно полки) → правило целиком с display: flex урока 10 и
// space-between (время сеансов от края до края) → починить две поломки урока (centre, gap без px) → своя полка из
// шести жанров: justify-content, gap и flex-wrap: wrap, условия «готово» видны.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-11p-flexbox-vyravnivanie.md.
// Полка всегда flex в готовых правилах (given); вид карточек и фона полки — в base (не видно ученику).
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-11p-flexbox-vyravnivanie',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "11-amaliyot. Afisha javonlari", ru: 'Практика 11. Полки с афишами', en: 'Practice 11. Poster shelves' }
};

// Страницы кинотеатра (тексты на языке урока).
const P11 = {
  afisha: L3("Afisha", 'Афиша', 'Now showing'),
  f1: L3("Koinot", 'Космос', 'Space'),
  f2: L3("Dinozavrlar", 'Динозавры', 'Dinosaurs'),
  f3: L3("Robotlar", 'Роботы', 'Robots'),
  bufet: L3("Bufet", 'Буфет', 'Snack bar'),
  b1: L3("Popkorn", 'Попкорн', 'Popcorn'),
  b2: L3("Sharbat", 'Сок', 'Juice'),
  b3: L3("Muzqaymoq", 'Мороженое', 'Ice cream'),
  seans: L3("Seanslar", 'Сеансы', 'Showtimes'),
  multfilm: L3("Multfilmlar", 'Мультфильмы', 'Cartoons'),
  m1: L3("Mushuk", 'Кот', 'The Cat'),
  m2: L3("Ayiqcha", 'Медвежонок', 'Little Bear'),
  m3: L3("Ari", 'Пчела', 'The Bee'),
  mine: L3("Mening filmlarim", 'Мои фильмы', 'My films'),
  g1: L3("Komediya", 'Комедия', 'Comedy'),
  g2: L3("Fantastika", 'Фантастика', 'Sci-fi'),
  g3: L3("Sarguzasht", 'Приключения', 'Adventure'),
  g4: L3("Sport", 'Спорт', 'Sports'),
  g5: L3("Multfilm", 'Мультфильм', 'Cartoon'),
  g6: L3("Detektiv", 'Детектив', 'Mystery')
};
const p11Shelf = (title, items) => (pk) => '<h1>' + pk(title) + '</h1><div class="javon">' + items.map((x) => '<div class="karta">' + pk(x) + '</div>').join('') + '</div>';
const p11Afisha = p11Shelf(P11.afisha, [P11.f1, P11.f2, P11.f3]);
const p11Times = (pk) => '<h1>' + pk(P11.seans) + '</h1><div class="vaqtlar">' +
  ['10:00', '14:00', '18:00'].map((t) => '<div class="vaqt">' + t + '</div>').join('') + '</div>';
const p11Mine = p11Shelf(P11.mine, [P11.g1, P11.g2, P11.g3, P11.g4, P11.g5, P11.g6]);
// Готовые правила полки (видны тусклыми): полка уже flex — урок 10.
const P11_SHELF = '.javon { display: flex; height: 90px; }';

const PR = {
  next: L3("Pozitsiyalash", 'Позиционирование', 'Positioning'),
  // Вид сайта «по умолчанию» (ученику не виден): серая полка, шрифт и отступы карточек.
  base: '.javon,.vaqtlar{background-color:#F1F3F4;border-radius:10px}' +
    '.karta,.vaqt{font-family:Arial,Helvetica,sans-serif;font-size:15px;padding:8px 10px;border-radius:8px;text-align:center}',
  tabs: [
    { ico: 'film', c: '#FA4F28', name: P11.afisha, file: 'afisha.html' },
    { ico: 'cup', c: '#F59E0B', name: P11.bufet, file: 'bufet.html' },
    { ico: 'sun', c: '#0FA38E', name: P11.seans, file: 'seans.html' },
    { ico: 'star', c: '#7C5CFA', name: P11.multfilm, file: 'multfilm.html' },
    { ico: 'heart', c: '#E44D8A', name: P11.mine, file: 'my.html' }
  ],
  hook: {
    page: p11Afisha,
    css: ['  .javon {', '    display: flex;', '    justify-content: center;', '    align-items: center;', '    gap: 12px;', '    height: 90px;', '  }',
      '  .karta { background-color: gold; }']
  },
  ownPage: p11Mine,
  ownGiven: ['.javon { display: flex; }', '.karta { width: 100px; background-color: pink; }'],
  ownDefault: '.javon {\n  justify-content: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}',
  tasks: [
    // Т1 · заменить значение в готовом правиле: афиши в середину полки (flex-start → center).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.javon { justify-content: flex-start; }', answer: '.javon { justify-content: center; }',
      page: p11Afisha, given: [P11_SHELF, '.karta { background-color: gold; }'],
      goal: (D) => {
        if (D.cs('.javon', 'justify-content') === 'center') return null;
        if (D.cs('.javon', 'align-items') === 'center') return C.t1.axis;
        return C.t1.no;
      },
      sample: ['.menyu { justify-content: flex-end; }'],
      drill: { single: true, code0: '.javon { justify-content: flex-start; }', answer: '.javon { justify-content: flex-end; }',
        goal: (D) => (D.cs('.javon', 'justify-content') === 'flex-end' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в пустое правило: угощения на дно полки (align-items: flex-end).
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: '.javon {\n  \n}', answer: '.javon {\n  align-items: flex-end;\n}',
      page: p11Shelf(P11.bufet, [P11.b1, P11.b2, P11.b3]), given: ['.javon { display: flex; height: 110px; }', '.karta { background-color: lightpink; }'],
      goal: (D) => {
        const a = D.cs('.javon', 'align-items');
        if (a === 'flex-end' || a === 'end') return null;
        if (D.cs('.javon', 'justify-content') !== 'normal') return C.t2.axis;
        return C.t2.no;
      },
      sample: ['.menyu {', '  align-items: center;', '}'],
      drill: { code0: '.javon {\n  \n}', answer: '.javon {\n  align-items: flex-start;\n}',
        goal: (D) => (/^(flex-start|start)$/.test(D.cs('.javon', 'align-items')) ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком (урок 10 + урок 11): время сеансов в ряд и от края до края.
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.vaqtlar {\n  display: flex;\n  justify-content: space-between;\n}',
      page: p11Times, given: ['.vaqt { background-color: lightgreen; }'],
      htmlAid: () => ['<div class="vaqtlar">', '  <div class="vaqt">10:00</div> …', '</div>'],
      goal: (D) => {
        if (D.cs('.vaqtlar', 'display') !== 'flex') return D.cs('.vaqt', 'display') === 'flex' ? C.t3.item : C.t3.noFlex;
        const j = D.cs('.vaqtlar', 'justify-content');
        if (j === 'space-between') return null;
        return j === 'normal' || j === 'flex-start' ? C.t3.spread : C.t3.other;
      },
      sample: ['.menyu {', '  display: flex;', '  justify-content: center;', '}'],
      drill: { code0: '', answer: '.javon {\n  display: flex;\n  justify-content: center;\n}',
        page: p11Afisha, given: ['.karta { background-color: gold; }'],
        htmlAid: () => ['<div class="javon">', '  <div class="karta">…</div> …', '</div>'],
        goal: (D) => (D.cs('.javon', 'display') === 'flex' && D.cs('.javon', 'justify-content') === 'center' ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: британское centre и gap без px.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.javon {\n  justify-content: centre;\n  gap: 20;\n}', answer: '.javon {\n  justify-content: center;\n  gap: 20px;\n}',
      page: p11Shelf(P11.multfilm, [P11.m1, P11.m2, P11.m3]), given: [P11_SHELF, '.karta { background-color: plum; }'],
      goal: (D) => (D.cs('.javon', 'justify-content') === 'center' && D.cs('.javon', 'column-gap') === '20px' ? null : C.t4.no),
      sample: ['.menyu {', '  justify-content: flex-end;', '  gap: 8px;', '}'],
      drill: { single: true, code0: '.javon { align-items: middle; }', answer: '.javon { align-items: center; }',
        goal: (D) => (D.cs('.javon', 'align-items') === 'center' ? null : C.t4.drillNo) }
    }),
    // Т5 · своя полка: шесть жанров — justify-content (любое), gap и flex-wrap: wrap.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: '.javon {\n  justify-content: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}',
      page: p11Mine, given: ['.javon { display: flex; }', '.karta { width: 100px; background-color: pink; }'],
      list: [
        { t: L3("justify-content — istalgan", 'justify-content — любое', 'justify-content — any'), ok: (D) => D.cs('.javon', 'justify-content') !== 'normal' },
        { t: L3("gap — oraliq", 'gap — промежуток', 'gap — the gaps'), ok: (D) => D.cs('.javon', 'column-gap') !== 'normal' },
        { t: L3("flex-wrap: wrap", 'flex-wrap: wrap', 'flex-wrap: wrap'), ok: (D) => /^wrap/.test(D.cs('.javon', 'flex-wrap')) }
      ],
      goal: (D) => {
        if (D.cs('.javon', 'justify-content') === 'normal') return C.t5.needJ;
        if (D.cs('.javon', 'column-gap') === 'normal') return C.t5.needGap;
        if (!/^wrap/.test(D.cs('.javon', 'flex-wrap'))) return C.t5.needWrap;
        return null;
      },
      sample: ['.javon {', '  justify-content: space-between;', '  gap: 6px;', '  flex-wrap: wrap;', '}'],
      onSolved: (st) => store.set('myCss', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы цели, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// Реплики сцеплены в одну историю: каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodining kinoteatri", 'Кинотеатр Коди', 'Kodi’s cinema'),
    say: L3("Salom! Bu mening kinoteatrimning sayti. Qarang: afishalar javonning qoq o'rtasida, oralarida bo'shliq bilan turibdi. Bu tartibni Flexbox qilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кинотеатра. Смотри: афиши стоят ровно в середине полки, с промежутками. Этот порядок навёл Flexbox. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my cinema’s website. Look: the posters stand right in the middle of the shelf, with gaps between them. Flexbox put them in order. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Afishalar bir-birining tagiga tushib qoldi, varaqlar esa o'chdi.", 'Ой! CSS-код стёрся. Афиши свалились друг под друга, а вкладки погасли.', 'Oh no! The CSS code got erased. The posters fell one under another, and the tabs went dark.'),
    done: L3("HTML joyida, faqat tartib yo'q. O'tgan darsda flex qutida tekislashni o'rgandik: justify-content, align-items, gap va flex-wrap. Endi beshta sahifada tartib o'rnatamiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'HTML на месте, пропал только порядок. На прошлом уроке мы научились выравнивать во flex-коробке: justify-content, align-items, gap и flex-wrap. Теперь наведём порядок на пяти страницах, а код будешь писать ты. Пятая страница будет твоей.',
      'The HTML is fine, only the order is gone. Last lesson we learned to align things in a flex box: justify-content, align-items, gap and flex-wrap. Now let’s put five pages in order, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifada tartib o'rnatamiz", 'Наведём порядок на пяти страницах', 'Let’s put five pages in order')
  },
  t1: {
    eyebrow: L3("Afisha", 'Афиша', 'Now showing'),
    say: L3("Birinchi sahifa: afisha. Javon allaqachon flex, lekin qarang: kartochkalar chap chetga siqilib qolgan. Bu yerda bitta qoida qolgan, unda justify-content flex-start turibdi. Afishalar javonning o'rtasida tursin: qiymatni almashtiring.",
      'Первая страница: афиша. Полка уже flex, но смотри: карточки прижались к левому краю. Здесь осталось одно правило, в нём justify-content flex-start. Пусть афиши стоят в середине полки: замени значение.',
      'The first page is the poster board. The shelf is already flex, but look: the cards are squeezed to the left edge. One rule is left here, with justify-content flex-start. Let’s put the posters in the middle of the shelf: change the value.'),
    ask: L3("Afishalarni javonning o'rtasiga qo'ying", 'Поставь афиши в середину полки', 'Put the posters in the middle of the shelf'),
    ok: L3("Zo'r! Afishalar javonning qoq o'rtasida turibdi.", 'Огонь! Афиши стоят ровно в середине полки.', 'Awesome! The posters stand right in the middle of the shelf.'),
    hints: [
      L3("Qoidaga qarang: flex-start kartochkalarni boshiga qo'yadi. O'rta inglizcha qanday bo'ladi?", 'Посмотри на правило: flex-start ставит карточки в начало. Как по-английски середина?', 'Look at the rule: flex-start puts the cards at the start. What’s the English word for the middle?'),
      L3("O'rta center bo'ladi. flex-start so'zini o'chirib, center deb yozing.", 'Середина — center. Сотри flex-start и напиши center.', 'The middle is center. Erase flex-start and write center.'),
      L3("Namuna kod ostida: u menyuni oxiriga suradi. Xuddi shunday, javon uchun center yozing va «Tekshirish»ni bosing.", 'Образец под кодом сдвигает меню в конец. Так же напиши center для полки и нажми «Проверить».', 'The example under the code moves a menu to the end. Write center for the shelf the same way and tap Check.')
    ],
    no: L3("Kartochkalar siljidi, lekin o'rtaga emas. O'rta inglizcha center bo'ladi.", 'Карточки сдвинулись, но не в середину. Середина — center.', 'The cards moved, but not to the middle. The middle is center.'),
    axis: L3("Kartochkalar tepadan pastga o'rtaga keldi, lekin chapdan o'ngga hali chetda turibdi. Chapdan o'ngga asosiy o'q bo'ladi, uni justify-content tekislaydi.", 'Карточки встали посередине сверху вниз, но слева направо всё ещё у края. Слева направо — главная ось, её выравнивает justify-content.', 'The cards are centered top to bottom, but left to right they’re still at the edge. Left to right is the main axis, and justify-content aligns it.'),
    drill: L3("endi kartochkalarni o'ng chetga suring", 'теперь прижми карточки к правому краю', 'now push the cards to the right edge'),
    drillNo: L3("Kartochkalar hali o'ng chetda emas. Asosiy o'qning oxiri flex-end bo'ladi.", 'Карточки пока не у правого края. Конец главной оси — flex-end.', 'The cards aren’t at the right edge yet. The end of the main axis is flex-end.')
  },
  t2: {
    eyebrow: L3("Bufet", 'Буфет', 'Snack bar'),
    say: L3("Afisha tayyor! Endi bufet. Bu javonda kartochkalar butun balandlik bo'ylab cho'zilib ketgan. Haqiqiy vitrinada esa narsalar javonning tagida turadi-ku. Bo'sh qoidaga xususiyat va qiymatni yozing: kartochkalar pastga tushsin.",
      'Афиша готова! Теперь буфет. На этой полке карточки растянулись на всю высоту. А на настоящей витрине вещи стоят на дне полки. Впиши в пустое правило свойство и значение: пусть карточки опустятся вниз.',
      'The poster board is done! Now the snack bar. On this shelf the cards are stretched to the full height. But in a real display case, things stand at the bottom of the shelf. Write a property and a value in the empty rule: let the cards drop to the bottom.'),
    ask: L3("Kartochkalarni javon tagiga tushiring", 'Опусти карточки на дно полки', 'Move the cards to the bottom of the shelf'),
    ok: L3("Barakalla! Popkorn ham, sharbat ham javonning tagida turibdi.", 'Молодец! И попкорн, и сок стоят на дне полки.', 'Well done! The popcorn and the juice stand at the bottom of the shelf.'),
    hints: [
      L3("Qatorda tepadan pastga qaysi o'q bo'ladi: asosiymi yoki ko'ndalangmi? O'sha o'qni qaysi xususiyat tekislaydi?", 'В ряду сверху вниз — это какая ось: главная или поперечная? Какое свойство выравнивает по ней?', 'In a row, top to bottom is which axis: main or cross? Which property aligns along it?'),
      L3("Ko'ndalang o'qni align-items tekislaydi. Past esa o'qning oxiri, ya'ni flex-end degani.", 'Поперечную ось выравнивает align-items. А низ — это конец оси, то есть flex-end.', 'align-items aligns along the cross axis. The bottom is the end of the axis, that is, flex-end.'),
      L3("Namuna kod ostida: u kartochkalarni o'rtaga qo'yadi. Xuddi shunday yozing, faqat flex-end bilan.", 'Образец под кодом ставит карточки посередине. Напиши так же, только с flex-end.', 'The example under the code puts the cards in the middle. Write the same, only with flex-end.')
    ],
    no: L3("Kartochkalar hali javonning tagida emas. Past bu ko'ndalang o'qning oxiri, ya'ni flex-end degani.", 'Карточки пока не на дне полки. Низ — это конец поперечной оси, то есть flex-end.', 'The cards aren’t at the bottom yet. The bottom is the end of the cross axis, that is, flex-end.'),
    axis: L3("Qarang: kartochkalar javon bo'ylab siljidi, bu asosiy o'q. Pastga tushirish uchun ko'ndalang o'q kerak, uni align-items tekislaydi.", 'Смотри: карточки поехали вдоль полки, это главная ось. Чтобы опустить их вниз, нужна поперечная ось: её выравнивает align-items.', 'Look: the cards moved along the shelf, that’s the main axis. To drop them down you need the cross axis, and align-items aligns it.'),
    drill: L3("endi kartochkalarni javonning tepasiga ko'taring", 'теперь подними карточки к верху полки', 'now lift the cards to the top of the shelf'),
    drillNo: L3("Kartochkalar hali tepada emas. Ko'ndalang o'qning boshi flex-start bo'ladi.", 'Карточки пока не наверху. Начало поперечной оси — flex-start.', 'The cards aren’t at the top yet. The start of the cross axis is flex-start.')
  },
  t3: {
    eyebrow: L3("Seanslar", 'Сеансы', 'Showtimes'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: seanslar. Bu yerda kod umuman yo'q, shuning uchun vaqtlar bir-birining tagida turibdi. Ular bitta qatorga tizilsin va chap hamda o'ng chetlarga tarqalsin. Qoidani o'zingiz yozing: qutining nomi HTML kodda, brauzer ostida turibdi.",
      'Две страницы горят! Третья: сеансы. Здесь кода нет совсем, поэтому время стоит столбиком. Пусть оно встанет в один ряд и разойдётся к левому и правому краю. Напиши правило: имя коробки — в HTML-коде под браузером.',
      'Two pages are lit! The third is showtimes. There’s no code here at all, so the times are stacked in a column. Let them line up in one row and spread to the left and right edges. Write the rule yourself: the box’s name is in the HTML code under the browser.'),
    ask: L3("Vaqtlarni qatorga tizing va chetlarga tarqating", 'Выстрой время в ряд и разнеси по краям', 'Line up the times and spread them to the edges'),
    ok: L3("Voy, xuddi haqiqiy kinoteatr saytidagidek! Seanslar bir qatorda, chetdan chetgacha.", 'Ого, прямо как на сайте настоящего кинотеатра! Сеансы в один ряд, от края до края.', 'Wow, just like a real cinema website! The showtimes are in one row, edge to edge.'),
    hints: [
      L3("Ikki ish kerak: oldin quti flex bo'lsin, keyin vaqtlar asosiy o'q bo'ylab chetlarga tarqalsin.", 'Нужны два дела: сначала коробка становится flex, потом время расходится по главной оси к краям.', 'Two things are needed: first the box becomes flex, then the times spread along the main axis to the edges.'),
      L3("Selektor vaqtlar klassi bo'ladi. Ichida ikkita xususiyat: display flex va justify-content space-between.", 'Селектор — класс vaqtlar. Внутри два свойства: display flex и justify-content space-between.', 'The selector is the vaqtlar class. Inside, two properties: display flex and justify-content space-between.'),
      L3("Namuna kod ostida: u menyuni o'rtaga qo'yadi. Xuddi shunday qoida yozing, faqat vaqtlar uchun va space-between bilan.", 'Образец под кодом ставит меню в середину. Напиши такое же правило, только для vaqtlar и с space-between.', 'The example under the code centers a menu. Write the same rule, only for vaqtlar and with space-between.')
    ],
    noFlex: L3("Vaqtlar hali ustun bo'lib turibdi. Oldin qutini flex qiling: display flex.", 'Время пока стоит столбиком. Сначала сделай коробку flex: display flex.', 'The times are still in a column. First make the box flex: display flex.'),
    item: L3("Qarang: display flex vaqtlarning o'ziga yozilgan. Uni vaqtlar turgan qutiga, vaqtlar klassiga yozamiz.", 'Смотри: display flex написан самому времени. А его пишут коробке, в которой время лежит, то есть классу vaqtlar.', 'Look: display flex is on the times themselves. It goes on the box that holds them, that is, the vaqtlar class.'),
    spread: L3("Vaqtlar qatorga tizildi, lekin chap chetga yig'ilib qoldi. Ularni chetlarga tarqating: space-between.", 'Время встало в ряд, но собралось у левого края. Разнеси его по краям: space-between.', 'The times are in a row, but they gathered at the left edge. Spread them to the edges: space-between.'),
    other: L3("Vaqtlar qatorda, lekin chetdan chetgacha emas. Chetlarga tarqatadigan qiymat space-between bo'ladi.", 'Время в ряд, но не от края до края. По краям разносит space-between.', 'The times are in a row, but not edge to edge. space-between spreads them to the edges.'),
    drill: L3("endi afishalarni ham qatorga tizing va o'rtaga qo'ying", 'теперь выстрой в ряд афиши и поставь их в середину', 'now line up the posters in a row and put them in the middle'),
    drillNo: L3("Afishalar hali qatorda o'rtada emas. javon klassiga display flex va justify-content center kerak.", 'Афиши пока не в ряд посередине. Классу javon нужны display flex и justify-content center.', 'The posters aren’t in a centered row yet. The javon class needs display flex and justify-content center.')
  },
  t4: {
    eyebrow: L3("Multfilmlar", 'Мультфильмы', 'Cartoons'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: multfilmlar. Bu kodni men shoshib yozgan edim. Kartochkalar o'rtada, oralarida yigirma piksel bo'lishi kerak edi, lekin ular chapda yopishib qolgan. Kodda ikkita joy buzilgan: ularni toping va tuzating.",
      'Три страницы готовы! Четвёртая: мультфильмы. Этот код я писал в спешке. Карточки должны были стоять в середине, с промежутками двадцать пикселей, а они слиплись слева. В коде две поломки: найди и почини их.',
      'Three pages are done! The fourth is cartoons. I wrote this code in a hurry. The cards were supposed to be in the middle with twenty-pixel gaps, but they’re stuck together on the left. There are two broken spots in the code: find and fix them.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Ikkalasi tuzaldi: kartochkalar o'rtada, oralarida bo'shliq bor.", 'Вот это да! Обе починены: карточки в середине, между ними промежутки.', 'That’s it! Both are fixed: the cards are in the middle with gaps between them.'),
    hints: [
      L3("Har bir so'zni harfma-harf tekshiring. Son yonida esa nima turishi kerak edi?", 'Проверь каждое слово по буквам. А что должно стоять рядом с числом?', 'Check every word letter by letter. And what should go next to the number?'),
      L3("centre britancha yozilgan, CSS esa faqat amerikacha center so'zini taniydi. Yigirma sonidan keyin px yo'q.", 'centre написано по-британски, а CSS знает только американское center. А после двадцати нет px.', 'centre is the British spelling, but CSS only knows the American center. And there’s no px after twenty.'),
      L3("Namuna kod ostida: to'g'ri yozilgan qoida. So'zni va px birligini xuddi shunday yozing va «Tekshirish»ni bosing.", 'Образец под кодом — верно записанное правило. Напиши слово и px так же и нажми «Проверить».', 'The example under the code is a correctly written rule. Write the word and px the same way and tap Check.')
    ],
    no: L3("Kod ishlayapti, lekin javon boshqacha. Kartochkalar o'rtada tursin, oralarida yigirma piksel bo'lsin.", 'Код работает, но полка не та. Карточки — в середине, промежутки — двадцать пикселей.', 'The code works, but the shelf isn’t right. The cards go in the middle with twenty-pixel gaps.'),
    drill: L3("yana bitta qoidani tuzating: kartochkalar tepadan pastga o'rtada tursin", 'почини ещё одно правило: карточки посередине по высоте', 'fix one more rule: the cards in the middle top to bottom'),
    drillNo: L3("Kartochkalar hali tepadan pastga o'rtada emas. CSS tilida o'rta center bo'ladi.", 'Карточки пока не посередине по высоте. В CSS середина — center.', 'The cards aren’t in the middle top to bottom yet. In CSS the middle is center.')
  },
  t5: {
    eyebrow: L3("Mening filmlarim", 'Мои фильмы', 'My films'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: sevimli janrlaringiz javoni. Oltita kartochka bitta qatorga sig'mayapti va siqilib qolgan. Javonni o'zingiz tekislang: kartochkalarni joylang, oraliq qo'ying va sig'maganlarini yangi qatorga o'tkazing. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: полка любимых жанров. Шесть карточек не помещаются в один ряд и сжались. Выровняй полку: расставь карточки, поставь промежутки и перенеси то, что не поместилось, на новую строку. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: a shelf of your favorite genres. Six cards don’t fit in one row and got squeezed. Align the shelf yourself: place the cards, add gaps, and move what doesn’t fit to a new line. Under the window you can see what’s done.'),
    ask: L3("Javoningizni tekislang: uchta shart", 'Выровняй свою полку: три условия', 'Align your shelf: three conditions'),
    ok: L3("Ura! Sizning javoningiz tayyor, hammasi joy-joyida!", 'Ура! Твоя полка готова, всё по местам!', 'Hooray! Your shelf is ready, everything is in its place!'),
    hints: [
      L3("javon klassiga bitta qoida yozing, ichida uchta xususiyat bo'ladi.", 'Напиши одно правило для класса javon, внутри будут три свойства.', 'Write one rule for the javon class with three properties inside.'),
      L3("justify-content uchun istalgan qiymat, gap uchun son va px, flex-wrap uchun esa wrap.", 'Для justify-content — любое значение, для gap — число и px, а для flex-wrap — wrap.', 'Any value for justify-content, a number and px for gap, and wrap for flex-wrap.'),
      L3("Namuna kod ostida: boshqa qiymatli qoida. O'zingizga yoqqan qiymatlarni tanlang.", 'Образец под кодом — правило с другими значениями. Выбери свои значения.', 'The example under the code is a rule with other values. Pick your own values.')
    ],
    needJ: L3("Kartochkalar hali boshida turibdi. justify-content uchun qiymat yozing, masalan center.", 'Карточки пока стоят в начале. Впиши значение для justify-content, например center.', 'The cards still stand at the start. Write a value for justify-content, for example center.'),
    needGap: L3("Kartochkalar o'rtasida bo'shliq yo'q. gap uchun son va px yozing.", 'Между карточками нет промежутков. Напиши для gap число и px.', 'There are no gaps between the cards. Write a number and px for gap.'),
    needWrap: L3("Kartochkalar hali bitta qatorda siqilib turibdi. Sig'maganlari yangi qatorga o'tsin: flex-wrap wrap.", 'Карточки всё ещё сжаты в один ряд. Пусть то, что не помещается, переходит на новую строку: flex-wrap wrap.', 'The cards are still squeezed in one row. Let what doesn’t fit move to a new line: flex-wrap wrap.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kinoteatrning beshta sahifasi ham yana tartibda! Bu tartibni siz o'zingiz yozgan CSS qildi.", 'Все пять страниц кинотеатра снова в порядке! И этот порядок навёл CSS, написанный твоими руками.', 'All five cinema pages are in order again! And the CSS you wrote yourself did it.') },
      { k: 'a', text: L3("justify-content bilan kartochkalarni asosiy o'q bo'ylab joylaysiz: boshiga, o'rtaga, oxiriga yoki chetlarga.", 'С justify-content ты расставляешь карточки по главной оси: в начало, в середину, в конец или по краям.', 'With justify-content you place cards along the main axis: at the start, the middle, the end, or the edges.') },
      { k: 'b', text: L3("align-items bilan esa ko'ndalang o'q bo'ylab: tepaga, o'rtaga yoki pastga.", 'А с align-items — по поперечной оси: наверх, в середину или вниз.', 'And with align-items, along the cross axis: to the top, the middle or the bottom.') },
      { k: 'c', text: L3("gap oraliq qo'yadi, flex-wrap esa sig'maganlarni yangi qatorga o'tkazadi.", 'gap ставит промежутки, а flex-wrap переносит то, что не поместилось, на новую строку.', 'gap adds gaps, and flex-wrap moves what doesn’t fit to a new line.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: britancha centre, CSS tilida yo'q middle va px qo'yilmagan son.", 'И находишь поломки: британское centre, несуществующее в CSS middle и число без px.', 'And you find broken spots: the British centre, middle that CSS doesn’t know, and a number without px.') },
      { k: null, text: L3("Keyingi darsda pozitsiyalashni o'rganamiz: elementni sahifaning istalgan joyiga, masalan kartochkaning burchagiga qo'yamiz. Ko'rishguncha!", 'На следующем уроке — позиционирование: поставим элемент в любое место страницы, например в угол карточки. До встречи!', 'Next lesson is positioning: we’ll put an element anywhere on the page, for example in a card’s corner. See you!') }
    ],
    roles: {
      a: L3("justify-content — asosiy o'q", 'justify-content — главная ось', 'justify-content — main axis'),
      b: L3("align-items — ko'ndalang o'q", 'align-items — поперечная ось', 'align-items — cross axis'),
      c: L3("gap va flex-wrap", 'gap и flex-wrap', 'gap and flex-wrap'),
      d: L3("tuzatish: centre, middle, px", 'починка: centre, middle, px', 'fixing: centre, middle, px')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
