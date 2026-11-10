// =============================================================================
// ===== ПРАКТИКА 8 · «Магазин игр Коди» · к уроку 8 «Красивые карточки» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта магазина игр стёрся CSS: карточки игр стали простыми белыми
// прямоугольниками, вкладки погасли. Ученик возвращает карточкам красоту сам: заменить число в border-radius →
// вписать тень только снизу (box-shadow, первое число — ноль) → правило целиком: полоса слева только у хита
// (#id из урока 2 + border-left) → починить две поломки урока (радиус без px, тень с запятыми; дополнительная —
// полоса без вида линии) → своя карточка: углы, тень, полоса с одной стороны (условия «готово» видны).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-08p-kartochki.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz», «yorliq» — вкладка); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-08p-kartochki',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "8-amaliyot. Kodining o'yinlar do'koni", ru: 'Практика 8. Магазин игр Коди', en: 'Practice 8. Kodi’s game store' }
};

// Страницы магазина (тексты на языке урока).
const P8 = {
  news: L3("Yangi o'yinlar", 'Новинки', 'New games'),
  sport: L3("Sport o'yinlari", 'Спорт', 'Sports games'),
  hits: L3("Xitlar", 'Хиты', 'Hits'),
  sale: L3("Chegirmalar", 'Скидки', 'Sale'),
  mine: L3("Mening o'yinim", 'Моя игра', 'My game'),
  race: L3("Kosmik poyga", 'Космические гонки', 'Space race'),
  city: L3("Robotlar shahri", 'Город роботов', 'Robot city'),
  foot: L3("Futbol 3D", 'Футбол 3D', 'Football 3D'),
  ball: L3("Basketbol", 'Баскетбол', 'Basketball'),
  chess: L3("Shaxmat ustasi", 'Мастер шахмат', 'Chess master'),
  robo: L3("Robo-futbol", 'Робофутбол', 'Robo football'),
  p10: L3("10 000 so'm", '10 000 сумов', '10,000 sum'),
  p12: L3("12 000 so'm", '12 000 сумов', '12,000 sum'),
  p18: L3("18 000 so'm", '18 000 сумов', '18,000 sum'),
  p20: L3("20 000 so'm", '20 000 сумов', '20,000 sum'),
  p25: L3("25 000 so'm", '25 000 сумов', '25,000 sum'),
  p30: L3("30 000 so'm", '30 000 сумов', '30,000 sum'),
  banner: L3("Yangi o'yin chiqdi!", 'Вышла новая игра!', 'A new game is out!'),
  magic: L3("Sehrli o'rmon", 'Волшебный лес', 'Magic forest'),
  soon: L3("Tez kunda chiqadi!", 'Скоро выйдет!', 'Coming soon!')
};
// Карточка игры: название жирным и цена; id — для хита.
const p8Card = (pk, name, price, id) => '<div class="karta"' + (id ? ' id="' + id + '"' : '') + '><b>' + pk(name) + '</b> · ' + pk(price) + '</div>';
const p8Page = (title, cards) => (pk) => '<h1>' + pk(title) + '</h1>' + cards.map((c) => p8Card(pk, c[0], c[1], c[2])).join('');
const p8Banner = (pk) => '<h1>' + pk(P8.news) + '</h1><div class="banner">' + pk(P8.banner) + '</div>';
const p8Own = (pk) => '<h1>' + pk(P8.mine) + '</h1><div class="karta"><b>' + pk(P8.magic) + '</b> · ' + pk(P8.soon) + '</div>';

// Проверка цели по готовой странице (вычисленные стили — как в DevTools).
// Тень: { x, y, blur, color } первой тени или null (тени нет).
function p8Sh(D, sel) {
  const v = D.cs(sel, 'box-shadow');
  if (!v || v === 'none') return null;
  const first = v.split(/,(?![^(]*\))/)[0];
  const n = (first.match(/-?\d+(\.\d+)?px/g) || []).map(parseFloat);
  const color = (first.match(/rgba?\([^)]*\)|#[0-9a-f]+/i) || [''])[0];
  return { x: n[0] || 0, y: n[1] || 0, blur: n[2] || 0, color };
}
const P8_SIDES = ['top', 'right', 'bottom', 'left'];
const p8On = (D, el, side) => { const cs = D.win.getComputedStyle(el); return cs.getPropertyValue('border-' + side + '-style') !== 'none' && parseFloat(cs.getPropertyValue('border-' + side + '-width')) > 0; };
const p8Sides = (D, sel) => { const el = D.q(sel); return el ? P8_SIDES.filter((s) => p8On(D, el, s)) : []; };
const p8Rad = (D, sel) => D.cs(sel, 'border-top-left-radius');

const PR = {
  next: L3("Elementlar sahifada qanday turadi", 'Как элементы ведут себя на странице', 'How elements behave on a page'),
  // Сайт по умолчанию: белая страница, сиреневые карточки с отступами (уроки 4 и 7, как в уроке 8) — тень видна.
  base: 'h1{font-size:26px}.karta{background-color:lavender;padding:8px 12px;margin:10px 6px}' +
    '.banner{background-color:#FFEDD5;padding:12px;margin:10px 6px;font-weight:bold}',
  tabs: [
    { ico: 'game', c: '#7C5CFA', name: P8.news, file: 'yangi.html' },
    { ico: 'ball', c: '#0FA38E', name: P8.sport, file: 'sport.html' },
    { ico: 'star', c: '#F59E0B', name: P8.hits, file: 'xitlar.html' },
    { ico: 'cart', c: '#FA4F28', name: P8.sale, file: 'chegirma.html' },
    { ico: 'heart', c: '#E44D8A', name: P8.mine, file: 'mening.html' }
  ],
  hook: {
    page: p8Page(P8.news, [[P8.race, P8.p25], [P8.city, P8.p30]]),
    css: ['  .karta {', '    border-radius: 16px;', '    box-shadow: 0px 6px 12px silver;', '    border-left: 6px solid orange;', '  }']
  },
  ownPage: p8Own,
  ownDefault: '.karta {\n  border-radius: 16px;\n  box-shadow: 0px 6px 12px silver;\n  border-left: 6px solid purple;\n}',
  tasks: [
    // Т1 · заменить значение в готовом правиле: углы карточек круглые, 16px.
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.karta { border-radius: 0px; }', answer: '.karta { border-radius: 16px; }',
      page: p8Page(P8.news, [[P8.race, P8.p25], [P8.city, P8.p30]]),
      goal: (D) => { const r = p8Rad(D, '.karta'); return r === '16px' ? null : r === '0px' ? C.t1.no : C.t1.other; },
      sample: ['p { border-radius: 8px; }'],
      drill: { single: true, page: p8Banner, given: [], code0: '.banner { border-radius: 0px; }', answer: '.banner { border-radius: 24px; }',
        goal: (D) => (p8Rad(D, '.banner') === '24px' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в пустое правило: тень только снизу (первое число — ноль, второе — больше нуля).
    (pk) => cpTask(2, {
      kind: 'write-declaration', given: ['.karta { border-radius: 16px; }'], code0: '.karta {\n  \n}', answer: '.karta {\n  box-shadow: 0px 6px 12px gray;\n}',
      page: p8Page(P8.sport, [[P8.foot, P8.p20], [P8.ball, P8.p18]]),
      goal: (D) => { const s = p8Sh(D, '.karta'); return !s ? C.t2.no : s.y <= 0 ? C.t2.up : s.x !== 0 ? C.t2.side : null; },
      sample: ['h1 {', '  box-shadow: 0px 4px 8px silver;', '}'],
      drill: { page: p8Banner, given: [], code0: '.banner {\n  \n}', answer: '.banner {\n  box-shadow: 0px 8px 16px silver;\n}',
        goal: (D) => { const s = p8Sh(D, '.banner'); return s && s.x === 0 && s.y > 0 ? null : C.t2.drillNo; } }
    }),
    // Т3 · правило целиком: полоса слева только у хита (селектор #xit — урок 2, border-left — урок 8).
    (pk) => cpTask(3, {
      kind: 'write-rule', given: ['.karta { border-radius: 16px; }'], code0: '', answer: '#xit {\n  border-left: 6px solid orange;\n}',
      syms: ['{', '}', ':', ';', '#'],
      page: p8Page(P8.hits, [[P8.foot, P8.p20], [P8.race, P8.p25, 'xit'], [P8.chess, P8.p12]]),
      htmlAid: (pk) => ['<h1>' + pk(P8.hits) + '</h1>', '<div class="karta">' + pk(P8.foot) + '</div>', '<div class="karta" id="xit">' + pk(P8.race) + '</div>',
        '<div class="karta">' + pk(P8.chess) + '</div>'],
      goal: (D) => {
        if (D.qa('.karta:not(#xit)').some((el) => p8On(D, el, 'left'))) return C.t3.many;
        const s = p8Sides(D, '#xit');
        if (s.length === 4) return C.t3.all;
        if (s.indexOf('left') < 0) return C.t3.noLine;
        if (!D.same(D.cs('#xit', 'border-left-color'), 'orange')) return C.t3.color;
        return null;
      },
      sample: ['#yangi {', '  border-left: 6px solid purple;', '}'],
      drill: { code0: '', answer: 'h1 { border-bottom: 3px solid orange; }',
        goal: (D) => { const s = p8Sides(D, 'h1'); return s.length === 1 && s[0] === 'bottom' && D.same(D.cs('h1', 'border-bottom-color'), 'orange') ? null : C.t3.drillNo; } }
    }),
    // Т4 · найти и починить две поломки урока: радиус без px и тень с запятыми; дополнительная — полоса без вида линии.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.karta {\n  border-radius: 12;\n  box-shadow: 0px, 6px, 12px, gray;\n}',
      answer: '.karta {\n  border-radius: 12px;\n  box-shadow: 0px 6px 12px gray;\n}',
      page: p8Page(P8.sale, [[P8.robo, P8.p10], [P8.chess, P8.p12]]),
      goal: (D) => { const s = p8Sh(D, '.karta'); return p8Rad(D, '.karta') === '12px' && s && s.x === 0 && s.y === 6 && s.blur === 12 && D.same(s.color, 'gray') ? null : C.t4.no; },
      sample: ['.kub {', '  border-radius: 20px;', '  box-shadow: 0px 4px 8px silver;', '}'],
      drill: { single: true, code0: '.karta { border-left: 6px orange; }', answer: '.karta { border-left: 6px solid orange; }',
        goal: (D) => (p8Sides(D, '.karta').indexOf('left') >= 0 && D.same(D.cs('.karta', 'border-left-color'), 'orange') ? null : C.t4.drillNo) }
    }),
    // Т5 · своя карточка: углы, тень, полоса с одной стороны — значения любые настоящие.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '',
      answer: '.karta {\n  border-radius: 16px;\n  box-shadow: 0px 6px 12px silver;\n  border-left: 6px solid purple;\n}',
      page: p8Own,
      list: [
        { t: L3("border-radius — burchaklar", 'border-radius — углы', 'border-radius — corners'), ok: (D) => p8Rad(D, '.karta') !== '0px' },
        { t: L3("box-shadow — soya", 'box-shadow — тень', 'box-shadow — shadow'), ok: (D) => !!p8Sh(D, '.karta') },
        { t: L3("bitta tomonda chiziq", 'полоса с одной стороны', 'a stripe on one side'), ok: (D) => { const n = p8Sides(D, '.karta').length; return n > 0 && n < 4; } }
      ],
      goal: (D) => {
        if (p8Rad(D, '.karta') === '0px') return C.t5.needRad;
        if (!p8Sh(D, '.karta')) return C.t5.needShadow;
        const n = p8Sides(D, '.karta').length;
        if (!n) return /border-(top|right|bottom|left)\s*:/i.test(D.code) ? C.t5.noStyle : C.t5.needSide;
        if (n === 4) return C.t5.allSides;
        return null;
      },
      sample: ['.karta {', '  border-radius: 24px;', '  box-shadow: 0px 8px 16px gray;', '  border-top: 4px solid teal;', '}'],
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
    eyebrow: L3("O'yinlar do'koni", 'Магазин игр', 'Game store'),
    say: L3("Salom! Bu mening o'yinlar do'konimning sayti. Qarang, kartochkalar qanday chiroyli: burchaklari yumaloq, ostida yumshoq soya, chap tomonida to'q sariq chiziq. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего магазина игр. Смотри, какие красивые карточки: круглые углы, мягкая тень снизу, оранжевая полоса слева. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my game store’s website. Look how nice the cards are: round corners, a soft shadow below, an orange stripe on the left. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Kartochkalar oddiy oq to'rtburchaklarga aylanib qoldi, yorliqlar ham o'chdi.",
      'Ой! CSS-код стёрся. Карточки превратились в простые белые прямоугольники, а вкладки погасли.',
      'Oh no! The CSS code got erased. The cards turned into plain white rectangles, and the tabs went dark.'),
    done: L3("HTML joyida, kartochkalar ham turibdi, faqat bezak yo'q. O'tgan darsda kartochkalarni bezashni o'rgandik: yumaloq burchaklar, soya va bir tomondagi chiziq. Endi beshta sahifani birma-bir tiklaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifada o'z o'yiningizning kartochkasi bo'ladi.",
      'HTML на месте, карточки тоже, пропало только оформление. На прошлом уроке мы научились украшать карточки: круглые углы, тень и полоса с одной стороны. Теперь вернём пять страниц по одной, а код будешь писать ты. На пятой странице будет карточка твоей игры.',
      'The HTML is fine and the cards are there, only the styling is gone. Last lesson we learned to decorate cards: round corners, a shadow and a stripe on one side. Now let’s bring back the five pages one by one, and you’ll write the code. The fifth page will have your own game’s card.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tiklaymiz: kodni siz yozasiz", 'Вернём пять страниц: код пишешь ты', 'Let’s bring back five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Yangi o'yinlar", 'Новинки', 'New games'),
    say: L3("Birinchi sahifa: yangi o'yinlar. Bu yerda bitta qoida qolgan, lekin burchaklar o'tkir, chunki unda nol piksel turibdi. Kartochkalarning burchagi o'n olti piksel yumaloq bo'lsin: qoidadagi sonni almashtiring.",
      'Первая страница: новинки. Здесь осталось одно правило, но углы острые, потому что в нём ноль пикселей. Пусть углы карточек скруглятся на шестнадцать пикселей: замени в правиле число.',
      'The first page is new games. One rule is left here, but the corners are sharp, because it says zero pixels. Let’s round the card corners by sixteen pixels: change the number in the rule.'),
    ask: L3("Kartochka burchaklarini 16px yumaloqlang", 'Скругли углы карточек на 16px', 'Round the card corners by 16px'),
    ok: L3("Ajoyib! Burchaklar yumshoq bo'ldi, yangi o'yinlar sahifasi jonlandi!", 'Отлично! Углы стали мягкими, страница новинок ожила!', 'Great! The corners got soft, and the new games page is back to life!'),
    hints: [
      L3("Qoidaga qarang: border-radius xususiyatidan keyin qanday son turibdi? Aynan u burchakni yumaloqlaydi.", 'Посмотри на правило: какое число стоит после border-radius? Именно оно скругляет угол.', 'Look at the rule: what number comes after border-radius? That’s what rounds the corner.'),
      L3("Hozir u nol piksel. Uni o'n olti qiling, px esa joyida qolsin.", 'Сейчас там ноль пикселей. Сделай шестнадцать, а px пусть останется.', 'Right now it’s zero pixels. Make it sixteen, and keep the px.'),
      L3("Namuna kod ostida: u abzas burchaklarini sakkiz piksel yumaloqlaydi. Xuddi shunday, kartochka uchun o'n olti yozing va Tekshirishni bosing.", 'Образец под кодом скругляет углы абзаца на восемь пикселей. Так же напиши шестнадцать для карточек и нажми «Проверить».', 'The example under the code rounds a paragraph’s corners by eight pixels. Write sixteen for the cards the same way and tap Check.')
    ],
    no: L3("Burchaklar hali o'tkir. Nol o'rniga o'n olti piksel yozing.", 'Углы всё ещё острые. Вместо нуля напиши шестнадцать пикселей.', 'The corners are still sharp. Write sixteen pixels instead of zero.'),
    other: L3("Burchaklar yumaloqlandi, lekin boshqacha. O'n olti piksel kerak.", 'Углы скруглились, но не так. Нужно шестнадцать пикселей.', 'The corners got round, but not like that. We need sixteen pixels.'),
    drill: L3("endi banner burchaklarini 24px yumaloqlang", 'теперь скругли углы баннера на 24px', 'now round the banner’s corners by 24px'),
    drillNo: L3("Banner burchaklari hali boshqacha. Yigirma to'rt piksel kerak.", 'Углы баннера пока не те. Нужно двадцать четыре пикселя.', 'The banner corners aren’t right yet. We need twenty-four pixels.')
  },
  t2: {
    eyebrow: L3("Sport o'yinlari", 'Спорт', 'Sports games'),
    say: L3("Yangi o'yinlar tayyor! Endi sport sahifasi. Burchaklar yumaloq, lekin kartochkalar fonga yopishib qolgandek. Ularga soya bering, faqat u pastga tushsin: bo'sh qoidaga xususiyat va qiymatni yozing.",
      'Новинки готовы! Теперь страница спорта. Углы круглые, но карточки будто прилипли к фону. Дай им тень, и пусть она падает только вниз: впиши в пустое правило свойство и значение.',
      'New games are done! Now the sports page. The corners are round, but the cards look stuck to the background. Give them a shadow that falls only down: write a property and a value in the empty rule.'),
    ask: L3("Kartochkalarga faqat pastga tushadigan soya bering", 'Дай карточкам тень только снизу', 'Give the cards a shadow only below'),
    ok: L3("Zo'r! Kartochkalar fondan ko'tarilib turgandek. Sport sahifasi tayyor!", 'Огонь! Карточки будто приподнялись над фоном. Страница спорта готова!', 'Awesome! The cards seem to float above the background. The sports page is ready!'),
    hints: [
      L3("Soya qaysi xususiyat bilan beriladi? Uning qiymatida to'rtta qism bor, esingizdami?", 'Каким свойством задают тень? В её значении четыре части, помнишь?', 'Which property sets a shadow? Its value has four parts, remember?'),
      L3("Bu box-shadow. Birinchi son o'ngga siljitadi, u nol bo'lsin. Ikkinchisi pastga, masalan olti piksel. Keyin xiralik va rang keladi.", 'Это box-shadow. Первое число сдвигает вправо, пусть будет ноль. Второе — вниз, например шесть пикселей. Потом размытие и цвет.', 'It’s box-shadow. The first number moves it right, make it zero. The second moves it down, like six pixels. Then come the blur and the color.'),
      L3("Namuna kod ostida: u sarlavhaga faqat pastki soya beradi. Kartochkalar uchun ham xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом даёт заголовку тень только снизу. Для карточек напиши так же и нажми «Проверить».', 'The example under the code gives the heading a shadow only below. Write the same for the cards and tap Check.')
    ],
    no: L3("Kartochkalarda hali soya yo'q. Soyani box-shadow beradi.", 'У карточек пока нет тени. Тень задаёт box-shadow.', 'The cards have no shadow yet. box-shadow sets the shadow.'),
    side: L3("Soya yon tomonga ham siljidi. Birinchi son o'ngga siljitadi: soya faqat pastda bo'lishi uchun u nol bo'lsin.", 'Тень ушла и вбок. Первое число сдвигает вправо: чтобы тень была только снизу, оно должно быть ноль.', 'The shadow moved sideways too. The first number moves it right: for a shadow only below, make it zero.'),
    up: L3("Soya pastga tushmayapti. Ikkinchi son pastga siljitadi: u noldan katta bo'lsin.", 'Тень не опускается вниз. Второе число сдвигает вниз: оно должно быть больше нуля.', 'The shadow doesn’t go down. The second number moves it down: make it bigger than zero.'),
    drill: L3("endi bannerga ham faqat pastki soya bering", 'теперь дай и баннеру тень только снизу', 'now give the banner a shadow only below too'),
    drillNo: L3("Bannerda hali pastki soya yo'q. Birinchi son nol, ikkinchisi esa noldan katta bo'lsin.", 'У баннера пока нет тени снизу. Первое число — ноль, а второе — больше нуля.', 'The banner has no shadow below yet. The first number is zero, and the second is bigger than zero.')
  },
  t3: {
    eyebrow: L3("Xitlar", 'Хиты', 'Hits'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: xitlar. Bu yerda uchta o'yin bor, lekin eng mashhuri bittasi. Uni chap tomondagi to'q sariq chiziq bilan belgilang, qoidani esa boshidan oxirigacha o'zingiz yozing. Diqqat qiling: xitning o'z id atributi bor, u HTML kodda ko'rinib turibdi.",
      'Две страницы горят! Третья: хиты. Здесь три игры, но самая популярная — одна. Отметь её оранжевой полосой слева, а правило напиши целиком. Обрати внимание: у хита свой id, он виден в HTML-коде.',
      'Two pages are lit! The third is hits. There are three games here, but only one is the most popular. Mark it with an orange stripe on the left, and write the whole rule yourself. Notice: the hit has its own id, you can see it in the HTML code.'),
    ask: L3("Faqat xitni chapdan to'q sariq chiziq bilan belgilang", 'Отметь только хит оранжевой полосой слева', 'Mark only the hit with an orange stripe on the left'),
    ok: L3("Mana bu xit! Endi uni darrov ko'rasiz. Xitlar sahifasi ham tayyor.", 'Вот это хит! Теперь его видно сразу. Страница хитов тоже готова.', 'Now that’s a hit! You can spot it right away. The hits page is ready too.'),
    hints: [
      L3("Oldin selektor: faqat xitni qaysi nom tanlaydi? HTML kodga qarang. Keyin bitta tomon uchun xususiyat kerak.", 'Сначала селектор: какое имя выбирает только хит? Посмотри в HTML-код. Потом нужно свойство для одной стороны.', 'First the selector: which name picks only the hit? Look at the HTML code. Then you need a property for one side.'),
      L3("Selektor xit, oldida panjara belgisi. Xususiyat border-left, qiymatida uch qism: qalinlik, chiziq turi va rang, masalan olti piksel, solid va orange.", 'Селектор xit, перед ним решётка. Свойство border-left, в значении три части: толщина, вид линии и цвет, например шесть пикселей, solid и orange.', 'The selector is xit with a hash sign before it. The property is border-left, and its value has three parts: thickness, line style and color, like six pixels, solid and orange.'),
      L3("Namuna kod ostida: u boshqa o'yinni binafsha chiziq bilan belgilaydi. Xit uchun ham xuddi shunday yozing, faqat orange bilan.", 'Образец под кодом отмечает другую игру фиолетовой полосой. Для хита напиши так же, только с orange.', 'The example under the code marks another game with a purple stripe. Write the same for the hit, only with orange.')
    ],
    many: L3("Chiziq hamma kartochkada chiqdi. Bizga faqat xit kerak: selektorga uning id atributini yozing.", 'Полоса появилась у всех карточек. А нужна только у хита: возьми в селектор его id.', 'The stripe appeared on every card. We need only the hit: use its id as the selector.'),
    all: L3("Chiziq xitning hamma tomonida. border hamma tomonga chizadi, chap tomon uchun esa border-left kerak.", 'Линия у хита со всех сторон. border рисует со всех сторон, а для левой нужен border-left.', 'The line is on every side of the hit. border draws on all sides, but the left side needs border-left.'),
    noLine: L3("Xitda hali chap chiziq yo'q. Chiziq ko'rinishi uchun border-left qiymatida qalinlik, chiziq turi va rang bo'ladi.", 'У хита пока нет полосы слева. Чтобы линия была видна, в значении border-left нужны толщина, вид линии и цвет.', 'The hit has no stripe on the left yet. For the line to show, the border-left value needs a thickness, a line style and a color.'),
    color: L3("Chiziq bor, lekin to'q sariq emas. To'q sariq inglizchada orange.", 'Полоса есть, но не оранжевая. Оранжевый по-английски — orange.', 'The stripe is there, but it isn’t orange. Use the word orange.'),
    drill: L3("endi sarlavha ostiga to'q sariq chiziq chizing", 'теперь подчеркни заголовок оранжевой линией снизу', 'now underline the heading with an orange line'),
    drillNo: L3("Sarlavha ostida hali to'q sariq chiziq yo'q. Pastki tomon border-bottom bo'ladi, selektor esa h1.", 'Под заголовком пока нет оранжевой линии. Нижняя сторона — это border-bottom, а селектор — h1.', 'There’s no orange line under the heading yet. The bottom side is border-bottom, and the selector is h1.')
  },
  t4: {
    eyebrow: L3("Chegirmalar", 'Скидки', 'Sale'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: chegirmalar. Bu kodni men shoshib yozgan edim, unda ikkita joy buzilgan. Brauzer buzilgan qiymatlarni tashlab yuboradi, shuning uchun burchaklar o'tkir, soya esa yo'q. Ikkala buzilgan joyni toping va tuzating, sonlarni esa o'zgartirmang.",
      'Три страницы готовы! Четвёртая: скидки. Этот код я писал в спешке, и в нём две поломки. Браузер сломанные значения выбрасывает, поэтому углы острые, а тени нет. Найди и почини обе поломки, а числа не меняй.',
      'Three pages are done! The fourth is the sale. I wrote this code in a hurry, and it has two broken spots. The browser throws broken values away, so the corners are sharp and there’s no shadow. Find and fix both, but don’t change the numbers.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana, tuzaldi! Burchaklar yumaloq, soya joyida. Chegirmalar sahifasi ham yondi.", 'Вот, починено! Углы круглые, тень на месте. Страница скидок тоже горит.', 'There, it’s fixed! Round corners, the shadow is back. The sale page is lit too.'),
    hints: [
      L3("Darsdagi qoidalar bilan solishtiring: son yonida nima bo'lishi kerak? Soya qismlari nima bilan ajratiladi?", 'Сравни с правилами из урока: что должно стоять рядом с числом? Чем разделяют части тени?', 'Compare with the rules from the lesson: what goes next to a number? What separates the parts of a shadow?'),
      L3("border-radius qiymatida o'n ikkidan keyin px yo'q. box-shadow qiymatida esa vergullar ortiqcha: qismlar faqat bo'sh joy bilan ajratiladi.", 'В значении border-radius после двенадцати нет px. А в значении box-shadow лишние запятые: части разделяют только пробелами.', 'In the border-radius value there’s no px after twelve. And the box-shadow value has extra commas: the parts are separated only by spaces.'),
      L3("Namuna kod ostida: px bilan va vergulsiz to'g'ri qoida. Xuddi shunday tuzating va Tekshirishni bosing.", 'Образец под кодом — верное правило: с px и без запятых. Почини так же и нажми «Проверить».', 'The example under the code is a correct rule: with px and without commas. Fix yours the same way and tap Check.')
    ],
    no: L3("Yozuv to'g'ri, lekin sonlar boshqa. Sonlarni o'zgartirmang: burchak o'n ikki piksel, soya nol, olti, o'n ikki va gray.", 'Запись верная, но числа другие. Не меняй числа: углы двенадцать пикселей, тень ноль, шесть, двенадцать и gray.', 'The writing is fine, but the numbers changed. Keep the numbers: corners twelve pixels, shadow zero, six, twelve and gray.'),
    drill: L3("endi kartochkalardagi chap chiziqni tuzating", 'теперь почини полосу слева у карточек', 'now fix the stripe on the left of the cards'),
    drillNo: L3("Chap chiziq hali ko'rinmayapti, chunki unda chiziq turi yo'q. Qalinlik va rang o'rtasiga solid qo'ying.", 'Полосы слева всё ещё не видно, потому что у неё нет вида линии. Поставь solid между толщиной и цветом.', 'The left stripe still doesn’t show, because it has no line style. Put solid between the thickness and the color.')
  },
  t5: {
    eyebrow: L3("Mening o'yinim", 'Моя игра', 'My game'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: bu sizning o'yiningiz kartochkasi. Uni o'zingizcha bezang: burchaklarni yumaloqlang, soya bering va bir tomoniga chiziq qo'ying. Kartochkaning klassi tanish: karta. Qiymatlarni istalganicha tanlang, oyna ostida esa nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: это карточка твоей игры. Укрась её по-своему: скругли углы, дай тень и проведи полосу с одной стороны. Класс карточки знакомый: karta. Значения выбирай любые, а под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: it’s your game’s card. Decorate it your way: round the corners, add a shadow and draw a stripe on one side. The card’s class is the familiar karta. Pick any values, and under the window you can see what’s done.'),
    ask: L3("Kartochkangizni bezang: burchak, soya, chiziq", 'Укрась свою карточку: углы, тень, полоса', 'Decorate your card: corners, shadow, stripe'),
    ok: L3("Ura! O'yiningiz kartochkasi tayyor, xuddi haqiqiy do'kondagidek!", 'Ура! Карточка твоей игры готова, прямо как в настоящем магазине!', 'Hooray! Your game’s card is ready, just like in a real store!'),
    hints: [
      L3("Bitta qoidadan boshlang: selektor karta, oldida nuqta. Qavslar ichiga uchta xususiyat yozasiz.", 'Начни с одного правила: селектор karta, перед ним точка. В скобках будут три свойства.', 'Start with one rule: the selector is karta with a dot before it. Three properties go inside the braces.'),
      L3("Uchta xususiyat kerak: border-radius, box-shadow va bitta tomon uchun, masalan border-left. Har biridan keyin nuqtali vergul qo'ying.", 'Нужны три свойства: border-radius, box-shadow и одна сторона, например border-left. После каждого ставь точку с запятой.', 'You need three properties: border-radius, box-shadow and one side, for example border-left. Put a semicolon after each.'),
      L3("Namuna kod ostida: boshqa qiymatlar bilan uchta xususiyat. O'zingizga yoqqan qiymatlarni tanlang.", 'Образец под кодом — три свойства с другими значениями. Выбери свои.', 'The example under the code has three properties with other values. Pick your own.')
    ],
    needRad: L3("Burchaklar hali o'tkir: border-radius yozing, son va px.", 'Углы пока острые: напиши border-radius, число и px.', 'The corners are still sharp: write border-radius, a number and px.'),
    needShadow: L3("Kartochkada hali soya yo'q: box-shadow yozing.", 'У карточки пока нет тени: напиши box-shadow.', 'The card has no shadow yet: write box-shadow.'),
    needSide: L3("Bir tomonda chiziq yo'q: masalan, border-left yozing.", 'Нет полосы с одной стороны: напиши, например, border-left.', 'There’s no stripe on one side: write, for example, border-left.'),
    noStyle: L3("Chiziq yozildi, lekin ko'rinmayapti, chunki unda chiziq turi yo'q. solid, dashed yoki dotted qo'shing.", 'Полоса записана, но её не видно, потому что нет вида линии. Добавь solid, dashed или dotted.', 'The stripe is written, but it doesn’t show, because there’s no line style. Add solid, dashed or dotted.'),
    allSides: L3("Chiziq to'rtala tomonda. Bizga bitta tomon kerak: border o'rniga, masalan, border-left yozing.", 'Линия со всех четырёх сторон. А нужна одна сторона: вместо border напиши, например, border-left.', 'The line is on all four sides. We need just one side: instead of border, write, for example, border-left.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Do'konning beshta sahifasi ham yana chiroyli! Kartochkalarni esa siz o'zingiz yozgan CSS bezadi.", 'Все пять страниц магазина снова красивые! А карточки украсил CSS, написанный твоими руками.', 'All five store pages look great again! And the CSS you wrote yourself decorated the cards.') },
      { k: 'a', text: L3("border-radius burchaklarni yumaloqlaydi: son qancha katta bo'lsa, burchak shuncha yumaloq.", 'border-radius скругляет углы: чем больше число, тем круглее угол.', 'border-radius rounds the corners: the bigger the number, the rounder the corner.') },
      { k: 'b', text: L3("box-shadow soya beradi: o'ngga, pastga, xiralik va rang. Faqat pastki soya uchun birinchi son nol bo'ladi.", 'box-shadow даёт тень: вправо, вниз, размытие и цвет. Для тени только снизу первое число — ноль.', 'box-shadow gives a shadow: right, down, blur and color. For a shadow only below, the first number is zero.') },
      { k: 'c', text: L3("border-left va boshqa tomonlar chiziqni bitta tomonga chizadi, id esa uni faqat bitta kartochkaga beradi.", 'border-left и другие стороны рисуют линию с одной стороны, а id даёт её только одной карточке.', 'border-left and the other sides draw a line on one side, and an id gives it to just one card.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: unutilgan px, soyadagi vergullar va chiziq turisiz chiziq.", 'И находишь поломки: забытый px, запятые в тени и полосу без вида линии.', 'And you find broken spots: a forgotten px, commas in a shadow and a stripe with no line style.') },
      { k: null, text: L3("Keyingi darsda elementlar sahifada qanday turishini o'rganamiz: ba'zilari butun qatorni egallaydi, ba'zilari esa yonma-yon turadi. Ko'rishguncha!", 'На следующем уроке узнаем, как элементы ведут себя на странице: одни занимают всю строку, а другие стоят рядом. До встречи!', 'Next lesson we’ll learn how elements behave on a page: some take the whole line, others sit side by side. See you!') }
    ],
    roles: {
      a: L3("border-radius — burchaklar", 'border-radius — углы', 'border-radius — corners'),
      b: L3("box-shadow: o'ngga, pastga, xiralik, rang", 'box-shadow: вправо, вниз, размытие, цвет', 'box-shadow: right, down, blur, color'),
      c: L3("border-left — bitta tomon", 'border-left — одна сторона', 'border-left — one side'),
      d: L3("tuzatish: px, vergulsiz, solid", 'починка: px, без запятых, solid', 'fixing: px, no commas, solid')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
