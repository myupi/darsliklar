// =============================================================================
// ===== ПРАКТИКА 7 · «Кинотеатр Коди» · к уроку 7 «Box Model» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). На сайте кинотеатра Коди стёрлись отступы и рамки: текст прилип к краям, рамка пропала,
// блоки почти касаются. Цвета сайта остались (PR.base — оформление «по умолчанию», ученику не видно). Ученик чинит
// пять страниц: внутренний отступ афиши (заменить 2px на 12px) → билет шириной с линейку (вписать box-sizing:
// border-box в правило; width, padding и рамка билета — готовые правила над полем) → рамка из чёрточек у отзывов
// (правило целиком, border: толщина, dashed, цвет) → две поломки урока (рамка без вида линии; padding вместо margin —
// загадка урока) → своя афиша: padding, border, margin. Дополнительные задачи: отступ 20px, VIP-билет, сплошная
// рамка заголовка, padding без px. 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-07p-box-model.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-07p-box-model',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "7-amaliyot. Kinoteatrni ta'mirlash", ru: 'Практика 7. Ремонт кинотеатра', en: 'Practice 7. Cinema repair' }
};

// Страницы кинотеатра (тексты на языке урока, не звучат).
const P7 = {
  cinema: L3("Kodining kinoteatri", 'Кинотеатр Коди', 'Kodi’s cinema'),
  today: L3("Bugun: «Robot va yulduzlar»", 'Сегодня: «Робот и звёзды»', 'Today: “The Robot and the Stars”'),
  start: L3("Boshlanishi soat 18:00 da", 'Начало в 18:00', 'Starts at 6 pm'),
  afisha: L3("Afisha", 'Афиша', 'Showtimes'),
  film1: L3("«Robot va yulduzlar», 10:00", '«Робот и звёзды», 10:00', '“The Robot and the Stars”, 10:00'),
  film2: L3("«Dengiz siri», 14:00", '«Тайна моря», 14:00', '“The Sea Secret”, 14:00'),
  tickets: L3("Chiptalar", 'Билеты', 'Tickets'),
  seat: L3("5-qator, 12-o'rin", 'Ряд 5, место 12', 'Row 5, seat 12'),
  vip: L3("VIP chipta", 'VIP-билет', 'VIP ticket'),
  vipSeat: L3("1-qator, 1-o'rin", 'Ряд 1, место 1', 'Row 1, seat 1'),
  reviews: L3("Fikrlar", 'Отзывы', 'Reviews'),
  rev1: L3("Juda qiziq multfilm!", 'Очень интересный мультфильм!', 'A really fun cartoon!'),
  rev2: L3("Robot menga yoqdi.", 'Мне понравился робот.', 'I liked the robot.'),
  bar: L3("Bufet", 'Буфет', 'Snack bar'),
  popcorn: L3("Popkorn: 15 000 so'm", 'Попкорн: 15 000 сумов', 'Popcorn: 15,000 sum'),
  juice: L3("Sharbat: 8 000 so'm", 'Сок: 8 000 сумов', 'Juice: 8,000 sum'),
  mine: L3("Mening kinoteatrim", 'Мой кинотеатр', 'My cinema'),
  mine1: L3("Bugun sevimli multfilmim! Chiptalar bepul.", 'Сегодня мой любимый мультфильм! Билеты бесплатно.', 'Today it’s my favorite cartoon! Tickets are free.')
};
// Оформление сайта «по умолчанию»: цвета и шрифт; отступов и рамок нет — их задаёт ученик. Линейка — 200px.
const P7_BASE = 'body{margin:6px 10px;font-family:sans-serif;background-color:#FFFBF5}h1{font-size:24px;color:#9A3412}' +
  'p{background-color:#FEF3C7;color:#78350F}' +
  '.ruler{width:200px;height:16px;background-color:#38BDF8;color:#fff;font-size:11px;line-height:16px;text-align:center}' +
  '.ticket{background-color:#EDE9FE;color:#4C1D95}.card{background-color:#DCFCE7;color:#14532D}.menu{background-color:#fff}';
const p7Page = (h, ...ps) => (pk) => '<h1>' + pk(h) + '</h1>' + ps.map((x) => '<p>' + pk(x) + '</p>').join('');
const p7Ticket = (pk) => '<h1>' + pk(P7.tickets) + '</h1><div class="ruler">200px</div><div class="ticket">' + pk(P7.seat) + '</div>';
const p7Vip = (pk) => '<h1>' + pk(P7.vip) + '</h1><div class="ruler">200px</div><div class="card">' + pk(P7.vipSeat) + '</div>';
const p7Menu = (pk) => '<h1>' + pk(P7.bar) + '</h1><div class="menu"><p>' + pk(P7.popcorn) + '</p><p>' + pk(P7.juice) + '</p></div>';
// Вычисленный размер в px с допуском (при ужатии страницы браузер отдаёт дробные px); есть ли свойство в правилах;
// видна ли рамка (у неё есть вид линии); ширина всей коробки.
const p7Is = (D, sel, prop, n) => Math.abs(parseFloat(D.cs(sel, prop)) - n) < 0.6;
const p7Any = (D, prop) => D.rules.some((r) => r.style && !!r.style.getPropertyValue(prop).trim());
const p7Line = (D, sel) => { const s = D.cs(sel, 'border-top-style'); return !!s && s !== 'none' && s !== 'hidden'; };
const p7W = (D, sel) => { const e = D.q(sel); return e ? e.offsetWidth : 0; };
// Ширина как у линейки и держит её box-sizing.
const p7Ruler = (D, sel, no, other) => {
  const w200 = Math.abs(p7W(D, sel) - 200) < 1.5;
  if (w200 && D.cs(sel, 'box-sizing') === 'border-box') return null;
  return w200 ? other : no;
};

const PR = {
  next: L3("Chiroyli kartochkalar", 'Красивые карточки', 'Beautiful cards'),
  base: P7_BASE,
  tabs: [
    { ico: 'film', c: '#FA4F28', name: P7.afisha, file: 'showtimes.html' },
    { ico: 'star', c: '#7C5CFA', name: P7.tickets, file: 'tickets.html' },
    { ico: 'heart', c: '#E44D8A', name: P7.reviews, file: 'reviews.html' },
    { ico: 'cup', c: '#F59E0B', name: P7.bar, file: 'snacks.html' },
    { ico: 'palette', c: '#0FA38E', name: P7.mine, file: 'my.html' }
  ],
  hook: {
    page: p7Page(P7.cinema, P7.today, P7.start),
    css: ['  h1 { border: 3px solid orange; }', '  p { padding: 10px; margin: 10px; }']
  },
  ownPage: p7Page(P7.mine, P7.mine1),
  ownDefault: 'p { padding: 12px; border: 2px solid teal; margin: 16px; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: внутренний отступ афиши 2px → 12px.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: 'p { padding: 2px; }', answer: 'p { padding: 12px; }',
      page: p7Page(P7.afisha, P7.film1, P7.film2),
      goal: (D) => {
        if (p7Is(D, 'p', 'padding-top', 12)) return null;
        if (parseFloat(D.cs('p', 'padding-top')) < 4 && parseFloat(D.cs('p', 'margin-top')) > 8) return C.t1.margin;
        return C.t1.no;
      },
      sample: ['h1 { padding: 10px; }'],
      drill: { single: true, code0: 'p { padding: 2px; }', answer: 'p { padding: 20px; }',
        goal: (D) => (p7Is(D, 'p', 'padding-top', 20) ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в готовое правило: билет шириной с линейку (box-sizing: border-box).
    (pk) => cpTask(2, {
      kind: 'write-declaration', given: ['.ticket {', '  width: 200px;', '  padding: 20px;', '  border: 4px dashed purple;', '}'],
      code0: '.ticket {\n  \n}', answer: '.ticket {\n  box-sizing: border-box;\n}',
      page: p7Ticket,
      goal: (D) => p7Ruler(D, '.ticket', C.t2.no, C.t2.other),
      sample: ['.box {', '  box-sizing: border-box;', '}'],
      drill: { page: p7Vip, given: ['.card {', '  width: 200px;', '  padding: 10px;', '  border: 6px solid gold;', '}'],
        code0: '.card {\n  \n}', answer: '.card {\n  box-sizing: border-box;\n}',
        goal: (D) => p7Ruler(D, '.card', C.t2.drillNo, C.t2.drillNo) }
    }),
    // Т3 · правило целиком: рамка из чёрточек у каждого отзыва (border: толщина, dashed, цвет).
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: 'p {\n  border: 2px dashed gray;\n}',
      page: p7Page(P7.reviews, P7.rev1, P7.rev2),
      goal: (D) => {
        const st = D.cs('p', 'border-top-style');
        if (st === 'dashed') return null;
        if (p7Line(D, 'p')) return C.t3.notDashed;
        return /border/i.test(D.code) ? C.t3.noLine : C.t3.no;
      },
      sample: ['h1 {', '  border: 3px dotted green;', '}'],
      drill: { code0: '', answer: 'h1 { border: 3px solid black; }',
        goal: (D) => (D.cs('h1', 'border-top-style') === 'solid' ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: рамка без вида линии и padding вместо margin (загадка урока).
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.menu { border: 3px orange; }\np { padding: 20px; }',
      answer: '.menu { border: 3px solid orange; }\np { margin: 20px; }',
      page: p7Menu,
      goal: (D) => {
        if (!p7Line(D, '.menu')) return /border/i.test(D.code) ? C.t4.noLine : C.t4.noFrame;
        if (parseFloat(D.cs('p', 'padding-top')) > 8) return C.t4.fat;
        if (parseFloat(D.cs('p', 'margin-top')) < 15) return C.t4.close;
        return null;
      },
      sample: ['.box { border: 2px solid gray; }', 'h1 { margin: 10px; }'],
      drill: { single: true, code0: 'p { padding: 12; }', answer: 'p { padding: 12px; }',
        goal: (D) => (p7Is(D, 'p', 'padding-top', 12) ? null : C.t4.drillNo) }
    }),
    // Т5 · своя афиша: padding, border (видна) и margin — значения любые.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: 'p { padding: 12px; border: 2px solid teal; margin: 16px; }',
      page: p7Page(P7.mine, P7.mine1),
      list: [
        { t: L3("padding", 'padding', 'padding'), ok: (D) => p7Any(D, 'padding-top') },
        { t: L3("border", 'border', 'border'), ok: (D) => p7Line(D, 'p') || p7Line(D, 'h1') },
        { t: L3("margin", 'margin', 'margin'), ok: (D) => p7Any(D, 'margin-top') }
      ],
      goal: (D) => {
        if (!p7Any(D, 'padding-top')) return C.t5.needPad;
        if (!p7Line(D, 'p') && !p7Line(D, 'h1')) return /border/i.test(D.code) ? C.t5.noLine : C.t5.needBorder;
        if (!p7Any(D, 'margin-top')) return C.t5.needMargin;
        return null;
      },
      sample: ['h1 {', '  padding: 8px;', '  border: 3px dotted crimson;', '  margin: 30px;', '}'],
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
    say: L3("Salom! Bu mening kinoteatrimning sayti. Qarang: sarlavha ramkada turibdi, matn chetga yopishmagan, bloklar esa bir-biridan uzoqda. Bularning hammasini CSS qilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кинотеатра. Смотри: заголовок в рамке, текст не прилипает к краям, а блоки стоят на расстоянии друг от друга. Всё это сделал CSS. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my cinema’s website. Look: the heading has a frame, the text doesn’t stick to the edges, and the blocks stand apart. CSS did all of that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Bo'shliqlar va ramkalar o'chib ketibdi. Ramka yo'qoldi, matn chetga yopishib qoldi, bloklar esa bir-biriga tegay deb turibdi.",
      'Ой! Отступы и рамки стёрлись. Рамка пропала, текст прилип к краю, а блоки почти касаются друг друга.',
      'Oh no! The spacing and borders got erased. The frame is gone, the text is stuck to the edge, and the blocks almost touch.'),
    done: L3("Ranglar joyida, faqat qutilar buzildi. O'tgan darsda har bir element quti ekanini bilib oldik: padding, border, margin va box-sizing. Endi beshta sahifani birma-bir tuzatamiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'Цвета на месте, сломались только коробки. На прошлом уроке мы узнали, что каждый элемент — коробка: padding, border, margin и box-sizing. Теперь починим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The colors are fine, only the boxes broke. Last lesson we learned that every element is a box: padding, border, margin and box-sizing. Now let’s fix the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tuzatamiz: kodni siz yozasiz", 'Починим пять страниц: код пишешь ты', 'Let’s fix five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Afisha", 'Афиша', 'Showtimes'),
    say: L3("Birinchi sahifa: afisha. Qarang, filmlarning nomlari sariq qutining chetiga yopishib qolibdi. Qoidada ichki bo'shliq bor-yo'g'i ikki piksel. Uni o'n ikki piksel qiling: qoidadagi sonni almashtiring.",
      'Первая страница: афиша. Смотри, названия фильмов прилипли к краю жёлтой коробки. В правиле внутренний отступ всего два пикселя. Сделай его двенадцать пикселей: замени в правиле число.',
      'The first page is the showtimes. Look, the movie titles are stuck to the edge of the yellow box. The rule’s inner space is only two pixels. Make it twelve pixels: change the number in the rule.'),
    ask: L3("Matnni chetdan 12 pikselga uzoqlashtiring", 'Отодвинь текст от края на 12 пикселей', 'Move the text 12 pixels away from the edge'),
    ok: L3("Ajoyib! Matn endi chetga yopishmaydi, afishani o'qish oson.", 'Отлично! Текст больше не прилипает к краю, афишу легко читать.', 'Great! The text doesn’t stick to the edge anymore, the showtimes are easy to read.'),
    hints: [
      L3("Qoidaga qarang: padding qutining ichida joy beradi. Uning qiymati qancha?", 'Посмотри на правило: padding даёт место внутри коробки. Какое у него значение?', 'Look at the rule: padding gives room inside the box. What’s its value?'),
      L3("Ikkini o'chirib, o'n ikki yozing. px qolsin: usiz brauzer qiymatni tashlab yuboradi.", 'Сотри два и напиши двенадцать. px оставь: без него браузер выбросит значение.', 'Erase two and write twelve. Keep px: without it the browser throws the value away.'),
      L3("Namuna kod ostida: u sarlavhaga o'n piksel ichki bo'shliq beradi. Xuddi shunday yozing, faqat o'n ikki bilan.", 'Образец под кодом даёт заголовку внутренний отступ десять пикселей. Напиши так же, только двенадцать.', 'The example under the code gives the heading ten pixels of inner space. Write the same, only with twelve.')
    ],
    no: L3("Ichki bo'shliq boshqa. Bizga o'n ikki piksel kerak.", 'Внутренний отступ другой. Нужно двенадцать пикселей.', 'The inner space is different. We need twelve pixels.'),
    margin: L3("Butun quti siljidi, matn esa hamon chetda. Ichkarida joyni margin emas, padding beradi.", 'Сдвинулась вся коробка, а текст всё так же у края. Место внутри даёт padding, а не margin.', 'The whole box moved, but the text is still at the edge. padding gives room inside, not margin.'),
    drill: L3("endi ichki bo'shliqni yanada kattaroq qiling: 20 piksel", 'теперь сделай внутренний отступ ещё больше: 20 пикселей', 'now make the inner space even bigger: 20 pixels'),
    drillNo: L3("Ichki bo'shliq hali boshqa. Bizga yigirma piksel kerak.", 'Внутренний отступ пока другой. Нужно двадцать пикселей.', 'The inner space is still different. We need twenty pixels.')
  },
  t2: {
    eyebrow: L3("Chiptalar", 'Билеты', 'Tickets'),
    say: L3("Afisha tayyor! Endi chiptalar. Qarang: tepada ko'k chizg'ich, u roppa-rosa ikki yuz piksel. Chiptaning width qiymati ham ikki yuz, lekin u chizg'ichdan kengroq chiqdi. Chunki padding va ramka kenglikka qo'shiladi. Chiptani chizg'ichdek qiling: qoidaga xususiyat va qiymatni yozing.",
      'Афиша готова! Теперь билеты. Смотри: сверху синяя линейка, она ровно двести пикселей. У билета width тоже двести, но он вышел шире линейки. Потому что padding и рамка прибавляются к ширине. Сделай билет как линейка: впиши в правило свойство и значение.',
      'The showtimes are done! Now the tickets. Look: there’s a blue ruler on top, exactly two hundred pixels. The ticket’s width is also two hundred, but it came out wider than the ruler. That’s because padding and the border are added to the width. Make the ticket as wide as the ruler: write a property and a value inside the rule.'),
    ask: L3("Chiptani chizg'ichdek kenglikda qiling", 'Сделай билет шириной с линейку', 'Make the ticket as wide as the ruler'),
    ok: L3("Zo'r! Chipta chizg'ich bilan roppa-rosa bir xil. Ichkaridagi joy esa o'zi torroq bo'ldi.", 'Огонь! Билет ровно с линейку. А место внутри само стало уже.', 'Awesome! The ticket is exactly as wide as the ruler. And the room inside got narrower by itself.'),
    hints: [
      L3("Darsda qaysi xususiyat qutini width qiymatidagi kenglikda ushlab turardi? Ramka va padding bilan birga.", 'Какое свойство на уроке держало коробку той ширины, что написана в width, вместе с рамкой и padding?', 'Which property in the lesson kept the box at the width written in width, frame and padding included?'),
      L3("Bu box-sizing, qiymati esa border-box. Ikki nuqta va nuqtali vergulni unutmang.", 'Это box-sizing, а значение — border-box. Не забудь двоеточие и точку с запятой.', 'It’s box-sizing, and the value is border-box. Don’t forget the colon and the semicolon.'),
      L3("Namuna kod ostida: u boshqa qutining kengligini ushlab turadi. Chipta uchun ham xuddi shunday yozing.", 'Образец под кодом держит ширину другой коробки. Напиши так же для билета.', 'The example under the code keeps another box’s width. Write the same for the ticket.')
    ],
    no: L3("Chipta hali chizg'ichdan keng. padding va ramka kenglikka qo'shilyapti: buni box-sizing to'xtatadi.", 'Билет всё ещё шире линейки. padding и рамка прибавляются к ширине: это меняет box-sizing.', 'The ticket is still wider than the ruler. padding and the border are added to the width: box-sizing changes that.'),
    other: L3("Chipta chizg'ichdek bo'ldi, lekin boshqacha yo'l bilan. Ramka va padding qolsin, kenglikni esa box-sizing ushlab tursin.", 'Билет стал с линейку, но другим путём. Пусть рамка и padding остаются, а ширину держит box-sizing.', 'The ticket matches the ruler, but in a different way. Keep the border and padding, and let box-sizing hold the width.'),
    drill: L3("endi VIP chiptani ham chizg'ichdek qiling", 'теперь сделай с линейку и VIP-билет', 'now make the VIP ticket as wide as the ruler too'),
    drillNo: L3("VIP chipta hali chizg'ichdan keng. Unga ham box-sizing border-box kerak.", 'VIP-билет пока шире линейки. Ему тоже нужен box-sizing border-box.', 'The VIP ticket is still wider than the ruler. It needs box-sizing border-box too.')
  },
  t3: {
    eyebrow: L3("Fikrlar", 'Отзывы', 'Reviews'),
    say: L3("Chiptalar tayyor! Uchinchi sahifa: tomoshabinlarning fikrlari. Har bir fikr chiziqchalardan iborat ramkada tursa, chiroyli bo'lardi-ya? Bu yerda kod umuman yo'q, qoidani boshidan oxirigacha o'zingiz yozing.",
      'Билеты готовы! Третья страница: отзывы зрителей. Вот бы каждый отзыв был в рамке из чёрточек, правда, красиво? Здесь кода нет совсем, напиши правило целиком.',
      'The tickets are done! The third page is the viewers’ reviews. Wouldn’t it look nice if each review had a frame made of dashes? There’s no code here at all, write the whole rule yourself.'),
    ask: L3("Har bir fikrni chiziqchali ramkaga oling", 'Обведи каждый отзыв рамкой из чёрточек', 'Put a dashed frame around each review'),
    ok: L3("Qoyil! Har bir fikr endi chiroyli ramkada.", 'Вот это да! Каждый отзыв теперь в красивой рамке.', 'Wow! Every review now has a nice frame.'),
    hints: [
      L3("Qoida uch qismdan iborat: nimani bezaymiz, qaysi xususiyat va qanday qiymat. Ramka qiymati ham uch qismli: qalinlik, chiziq turi va rang.", 'Правило — три части: что оформляем, какое свойство и какое значение. У значения рамки тоже три части: толщина, вид линии и цвет.', 'A rule has three parts: what we style, which property and which value. A border’s value has three parts too: thickness, line type and color.'),
      L3("Selektor p, xususiyat border. Chiziqchalar dashed deyiladi: masalan, ikki piksel, dashed va gray.", 'Селектор p, свойство border. Чёрточки называются dashed: например, два пикселя, dashed и gray.', 'The selector is p, the property border. Dashes are called dashed: for example, two pixels, dashed and gray.'),
      L3("Namuna kod ostida: u sarlavhani nuqtali ramkaga oladi. Xuddi shunday qoida yozing, faqat p uchun va dashed bilan.", 'Образец под кодом обводит заголовок рамкой из точек. Напиши такое же правило, только для p и с dashed.', 'The example under the code puts a dotted frame around the heading. Write the same rule, only for p and with dashed.')
    ],
    no: L3("Fikrlar atrofida hali ramka yo'q. Ramkani border chizadi: qalinlik, chiziq turi va rang.", 'Вокруг отзывов пока нет рамки. Рамку рисует border: толщина, вид линии и цвет.', 'There’s no frame around the reviews yet. border draws it: thickness, line type and color.'),
    noLine: L3("Ramka ko'rinmayapti: unda chiziq turi yo'q. Chiziqchalar dashed deyiladi.", 'Рамки не видно: у неё нет вида линии. Чёрточки — это dashed.', 'The frame doesn’t show: it has no line type. Dashes are dashed.'),
    notDashed: L3("Ramka bor, lekin chiziqchalardan emas. Chiziqchalar dashed deyiladi.", 'Рамка есть, но не из чёрточек. Чёрточки — это dashed.', 'There’s a frame, but it isn’t made of dashes. Dashes are dashed.'),
    drill: L3("endi sarlavhani yaxlit ramkaga oling, qoidani o'zingiz yozing", 'теперь обведи заголовок сплошной рамкой, правило пиши сам', 'now put a solid frame around the heading, write the rule yourself'),
    drillNo: L3("Sarlavha atrofida hali yaxlit ramka yo'q. Yaxlit chiziq solid deyiladi.", 'Вокруг заголовка пока нет сплошной рамки. Сплошная линия — это solid.', 'There’s no solid frame around the heading yet. A solid line is solid.')
  },
  t4: {
    eyebrow: L3("Bufet", 'Буфет', 'Snack bar'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: bufet menyusi. Men menyuni ramkaga olib, taomlarni bir-biridan uzoqlashtirmoqchi edim. Lekin ramka chiqmadi. Taomlar semirib ketdi, oralig'i esa o'zgarmadi. Kodda ikkita joy buzilgan, ikkalasini toping va tuzating.",
      'Три страницы готовы! Четвёртая: меню буфета. Я хотел обвести меню рамкой и раздвинуть пункты. Но рамка не появилась. Пункты растолстели, а расстояние между ними не изменилось. В коде две поломки, найди и почини обе.',
      'Three pages are done! The fourth is the snack bar menu. I wanted to put a frame around the menu and move the items apart. But the frame didn’t show up. The items got fat, and the gap between them didn’t change. The code has two broken spots, find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Menyu ramkada, taomlar esa bir-biridan uzoqda.", 'Вот это да! Меню в рамке, а пункты стоят на расстоянии.', 'That’s it! The menu has a frame, and the items stand apart.'),
    hints: [
      L3("Ramka qiymatida uchala qism bormi? Taomlarni uzoqlashtirish uchun qaysi bo'shliq kerak: ichkimi yoki tashqi?", 'В значении рамки есть все три части? А чтобы раздвинуть пункты, какой нужен отступ: внутренний или внешний?', 'Does the border’s value have all three parts? And to move the items apart, which space do you need: inner or outer?'),
      L3("border qiymatida chiziq turi yo'q, masalan solid. Taomlarni esa padding emas, margin uzoqlashtiradi.", 'В border нет вида линии, например solid. А раздвигает пункты margin, а не padding.', 'border has no line type, like solid. And margin moves the items apart, not padding.'),
      L3("Namuna kod ostida: ishlaydigan ramka va tashqi bo'shliq. Xuddi shunday tuzating va Tekshirishni bosing.", 'Образец под кодом — рабочая рамка и внешний отступ. Почини так же и нажми «Проверить».', 'The example under the code has a working border and outer space. Fix yours the same way and tap Check.')
    ],
    noLine: L3("Menyu atrofida hali ramka yo'q: border qiymatida chiziq turi yetishmayapti. Masalan, solid.", 'Рамки вокруг меню пока нет: в border не хватает вида линии. Например, solid.', 'There’s no frame around the menu yet: border is missing a line type. For example, solid.'),
    noFrame: L3("Menyu atrofida ramka yo'q: border yozing, unda qalinlik, chiziq turi va rang bo'lsin.", 'Вокруг меню нет рамки: напиши border с толщиной, видом линии и цветом.', 'There’s no frame around the menu: write border with a thickness, a line type and a color.'),
    fat: L3("Ramka chiqdi! Lekin taomlar hali semiz: padding ichkarida joy beradi. Qo'shnilarni margin uzoqlashtiradi.", 'Рамка появилась! Но пункты всё ещё толстые: padding даёт место внутри. Раздвигает соседей margin.', 'The frame is there! But the items are still fat: padding gives room inside. margin pushes the neighbours away.'),
    close: L3("Taomlar ozg'inlashdi, lekin hali bir-biriga yaqin. Ularni margin bilan uzoqlashtiring, masalan yigirma piksel.", 'Пункты похудели, но всё ещё близко друг к другу. Раздвинь их margin, например двадцать пикселей.', 'The items slimmed down, but they’re still close together. Move them apart with margin, for example twenty pixels.'),
    drill: L3("yana bitta qoidani tuzating", 'почини ещё одно правило', 'fix one more rule'),
    drillNo: L3("Taomlarda ichki bo'shliq hali yo'q. Son yonida px bo'lishi kerak.", 'Внутреннего отступа у пунктов пока нет. Рядом с числом нужен px.', 'The items have no inner space yet. A number needs px next to it.')
  },
  t5: {
    eyebrow: L3("Mening kinoteatrim", 'Мой кинотеатр', 'My cinema'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z kinoteatringizning e'lonini bezang. Matnga ichki bo'shliq, atrofiga ramka va tashqi bo'shliq bering. Qiymatlarni o'zingiz tanlang. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: оформи объявление своего кинотеатра. Дай тексту внутренний отступ, рамку и внешний отступ. Значения выбирай любые. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: style your own cinema’s announcement. Give the text inner space, a frame and outer space. Pick the values yourself. Under the window you can see what’s done.'),
    ask: L3("E'lonni bezang: padding, border, margin", 'Оформи объявление: padding, border, margin', 'Style the announcement: padding, border, margin'),
    ok: L3("Ura! Kinoteatringiz e'loni tayyor, u chiroyli qutida!", 'Ура! Объявление твоего кинотеатра готово, и оно в красивой коробке!', 'Hooray! Your cinema’s announcement is ready, in a nice box!'),
    hints: [
      L3("Bitta xususiyatdan boshlang, masalan ichki bo'shliqdan. Keyin ramka va tashqi bo'shliqni qo'shing.", 'Начни с одного свойства, например с внутреннего отступа. Потом добавь рамку и внешний отступ.', 'Start with one property, for example the inner space. Then add the frame and the outer space.'),
      L3("p uchun padding, border va margin kerak. Ramkada chiziq turini unutmang.", 'Для p нужны padding, border и margin. В рамке не забудь вид линии.', 'For p you need padding, border and margin. Don’t forget the line type in the border.'),
      L3("Namuna kod ostida: boshqa qiymatlar bilan. O'zingizga yoqqan qiymatlarni tanlang.", 'Образец под кодом — с другими значениями. Выбери свои.', 'The example under the code uses other values. Pick your own.')
    ],
    needPad: L3("Ichki bo'shliq yo'q: p uchun padding yozing.", 'Нет внутреннего отступа: напиши для p свойство padding.', 'There’s no inner space: write padding for p.'),
    needBorder: L3("Ramka yo'q: border yozing, unda qalinlik, chiziq turi va rang bo'lsin.", 'Нет рамки: напиши border с толщиной, видом линии и цветом.', 'There’s no frame: write border with a thickness, a line type and a color.'),
    noLine: L3("Ramka ko'rinmayapti: unda chiziq turi yo'q. Masalan, solid yoki dashed qo'shing.", 'Рамки не видно: у неё нет вида линии. Добавь, например, solid или dashed.', 'The frame doesn’t show: it has no line type. Add solid or dashed, for example.'),
    needMargin: L3("Tashqi bo'shliq yo'q: margin yozing.", 'Нет внешнего отступа: напиши margin.', 'There’s no outer space: write margin.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kinoteatrning beshta sahifasi ham tayyor! Har bir element chiroyli qutiga aylandi, bularning hammasini sizning CSS kodingiz qildi.", 'Все пять страниц кинотеатра готовы! Каждый элемент стал аккуратной коробкой, и всё это сделал твой CSS.', 'All five cinema pages are ready! Every element became a neat box, and your own CSS did all of it.') },
      { k: 'a', text: L3("padding ichki bo'shliq: matn chetdan uzoqlashadi, fon esa kattalashadi.", 'padding — внутренний отступ: текст отходит от края, а фон растёт.', 'padding is the inner space: the text moves away from the edge, and the background grows.') },
      { k: 'b', text: L3("border uchun uchta qism kerak: qalinlik, chiziq turi va rang. Turi bo'lmasa, ramka chizilmaydi.", 'Для border нужны три части: толщина, вид линии и цвет. Без вида линии рамки нет.', 'border needs three parts: thickness, line type and color. Without a line type there’s no frame.') },
      { k: 'c', text: L3("margin tashqi bo'shliq: u qo'shnilarni nari suradi, fon esa o'zgarmaydi.", 'margin — внешний отступ: он отодвигает соседей, а фон не меняется.', 'margin is the outer space: it pushes the neighbours away, and the background stays the same.') },
      { k: 'd', text: L3("box-sizing border-box esa qutini width qiymatidagi kenglikda ushlab turadi.", 'А box-sizing border-box держит коробку той ширины, что написана в width.', 'And box-sizing border-box keeps the box the width written in width.') },
      { k: null, text: L3("Keyingi darsda kartochkalarni yanada chiroyli qilamiz: burchaklarni yumaloqlaymiz va soya beramiz. Ko'rishguncha!", 'На следующем уроке сделаем карточки ещё красивее: скруглим углы и добавим тень. До встречи!', 'Next lesson we’ll make cards even prettier: round the corners and add a shadow. See you!') }
    ],
    roles: {
      a: L3("padding — ichki", 'padding — внутри', 'padding — inside'),
      b: L3("border: 3px solid", 'border: 3px solid', 'border: 3px solid'),
      c: L3("margin — tashqi", 'margin — снаружи', 'margin — outside'),
      d: L3("box-sizing: border-box", 'box-sizing: border-box', 'box-sizing: border-box')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
