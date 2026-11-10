// =============================================================================
// ===== ПРАКТИКА 6 · «Игра Коди» · к уроку 6 «Размеры элементов» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). На сайте игры Коди стёрлись размеры: полоска загрузки и кнопка растянулись на всё окно.
// Цвета сайта остались (PR.base — оформление «по умолчанию», ученику не видно), ученик возвращает размеры:
// полоска загрузки наполовину (заменить 10% на 50%) → кнопка шириной 150px (вписать width в правило) → герой —
// квадрат 100×100 (правило целиком, width и height) → две поломки урока (пробел в «160 px», число без px) → свой
// уровень: полоска в процентах, герой с width и height, кнопка в пикселях. Дополнительные задачи: полоска до конца,
// высота кнопки, ширина полоски здоровья, монетка с % вместо px. Картинок-файлов нет: всё — блоки div с цветом
// фона. 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-06p-razmery.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-06p-razmery',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "6-amaliyot. Kodining o'yini", ru: 'Практика 6. Игра Коди', en: 'Practice 6. Kodi’s game' }
};

// Страницы сайта игры (тексты на языке урока, не звучат).
const P6 = {
  game: L3("Kodi va yulduzlar", 'Коди и звёзды', 'Kodi and the stars'),
  loading: L3("O'yin yuklanmoqda…", 'Игра загружается…', 'The game is loading…'),
  load: L3("Yuklanish", 'Загрузка', 'Loading'),
  play: L3("O'ynash", 'Играть', 'Play'),
  btn: L3("Tugma", 'Кнопка', 'Button'),
  ready: L3("Xo'sh, o'ynaymizmi?", 'Ну что, играем?', 'Ready to play?'),
  hero: L3("Qahramon", 'Герой', 'Hero'),
  power: L3("Kuch: 10", 'Сила: 10', 'Power: 10'),
  shop: L3("Do'kon", 'Магазин', 'Shop'),
  sword: L3("Sehrli qilich: 50 tanga", 'Волшебный меч: 50 монет', 'Magic sword: 50 coins'),
  wallet: L3("Hamyonda:", 'В кошельке:', 'In the wallet:'),
  mine: L3("Mening darajam", 'Мой уровень', 'My level')
};
// Оформление сайта «по умолчанию» (цвета, шрифт; размеров нет — их задаёт ученик). Высота полосок — здесь,
// чтобы пустые блоки были видны.
const P6_BASE = 'body{margin:6px 10px;font-family:sans-serif;background-color:#F5F3FF}h1{font-size:22px;color:#4C1D95}' +
  '.track{background-color:#DDD6FE}.bar{height:18px;background-color:#22C55E}' +
  '.btn{background-color:#FA4F28;color:#fff;text-align:center;font-weight:bold}' +
  '.hero{background-color:#7C5CFA;color:#fff;font-size:28px;font-weight:bold;text-align:center}' +
  '.hp{height:12px;background-color:#EF4444}.card{background-color:#FEF3C7;color:#78350F}' +
  '.coin{background-color:#FACC15;color:#78350F;text-align:center;font-weight:bold}';
const p6Load = (pk) => '<h1>' + pk(P6.game) + '</h1><p>' + pk(P6.loading) + '</p><div class="track"><div class="bar"></div></div>';
const p6Btn = (pk) => '<h1>' + pk(P6.ready) + '</h1><div class="btn">' + pk(P6.play) + '</div>';
const p6Hero = (pk) => '<h1>' + pk(P6.hero) + '</h1><div class="hero">K</div><p>' + pk(P6.power) + '</p><div class="hp"></div>';
const p6Shop = (pk) => '<h1>' + pk(P6.shop) + '</h1><div class="card">' + pk(P6.sword) + '</div><p>' + pk(P6.wallet) + '</p><div class="coin">50</div>';
const p6Mine = (pk) => '<h1>' + pk(P6.mine) + '</h1><div class="hero">K</div><p></p><div class="track"><div class="bar"></div></div><p></p><div class="btn">' + pk(P6.play) + '</div>';
const p6Hook = (pk) => '<h1>' + pk(P6.game) + '</h1><p>' + pk(P6.loading) + '</p><div class="track"><div class="bar"></div></div><p></p><div class="btn">' + pk(P6.play) + '</div>';
// Значение свойства в последнем правиле ученика с этим селектором; доля заполнения полоски.
const p6Sel = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
const p6Last = (D, sel, prop) => {
  let v = '';
  D.rules.forEach((r) => { if (r.sel && r.style && p6Sel(r.sel) === sel) { const x = r.style.getPropertyValue(prop).trim(); if (x) v = x; } });
  return v;
};
const p6Ratio = (D) => { const b = D.q('.bar'), t = D.q('.track'); return b && t && t.clientWidth ? b.offsetWidth / t.clientWidth : 0; };
const p6Pct = (v) => /%$/.test(v);
// Вычисленный размер в px с допуском: при ужатии страницы (zoom) браузер отдаёт «159.984px» вместо «160px».
const p6Is = (D, sel, prop, n) => Math.abs(parseFloat(D.cs(sel, prop)) - n) < 0.6;
const p6Px = (v) => /px$/.test(v);

const PR = {
  next: L3('Box Model', 'Box Model', 'Box Model'),
  base: P6_BASE,
  tabs: [
    { ico: 'rocket', c: '#22C55E', name: P6.load, file: 'loading.html' },
    { ico: 'game', c: '#FA4F28', name: P6.btn, file: 'button.html' },
    { ico: 'star', c: '#7C5CFA', name: P6.hero, file: 'hero.html' },
    { ico: 'cart', c: '#F59E0B', name: P6.shop, file: 'shop.html' },
    { ico: 'sun', c: '#E44D8A', name: P6.mine, file: 'my.html' }
  ],
  hook: {
    page: p6Hook,
    css: ['  .track { width: 80%; }', '  .bar { width: 60%; }', '  .btn { width: 140px; height: 44px; }']
  },
  ownPage: p6Mine,
  ownDefault: '.bar { width: 70%; }\n.hero { width: 50px; height: 50px; }\n.btn { width: 160px; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: полоска загрузки — наполовину (10% → 50%).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.bar { width: 10%; }', answer: '.bar { width: 50%; }',
      page: p6Load,
      goal: (D) => {
        const v = p6Last(D, '.bar', 'width');
        if (p6Pct(v) && Math.abs(p6Ratio(D) - 0.5) < 0.02) return null;
        return p6Px(v) ? C.t1.px : C.t1.no;
      },
      sample: ['.bar { width: 25%; }'],
      drill: { single: true, code0: '.bar { width: 10%; }', answer: '.bar { width: 100%; }',
        goal: (D) => (p6Ratio(D) > 0.98 ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в готовое правило: кнопка шириной 150px.
    (pk) => cpTask(2, {
      kind: 'write-declaration', code0: '.btn {\n  \n}', answer: '.btn {\n  width: 150px;\n}',
      page: p6Btn,
      goal: (D) => (p6Is(D, '.btn', 'width', 150) ? null : p6Pct(p6Last(D, '.btn', 'width')) ? C.t2.pct : C.t2.no),
      sample: ['h1 {', '  width: 200px;', '}'],
      drill: { code0: '.btn {\n  \n}', answer: '.btn {\n  height: 50px;\n}',
        goal: (D) => (p6Is(D, '.btn', 'height', 50) ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: герой — квадрат 100×100 (width и height).
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.hero {\n  width: 100px;\n  height: 100px;\n}',
      page: p6Hero,
      htmlAid: (pk) => ['<h1>' + pk(P6.hero) + '</h1>', '<div class="hero">K</div>', '<p>' + pk(P6.power) + '</p>', '<div class="hp"></div>'],
      goal: (D) => {
        const w = p6Is(D, '.hero', 'width', 100), h = p6Is(D, '.hero', 'height', 100);
        if (w && h) return null;
        if (w) return C.t3.needH;
        if (h) return C.t3.needW;
        return C.t3.no;
      },
      sample: ['.box {', '  width: 60px;', '  height: 80px;', '}'],
      drill: { code0: '', answer: '.hp { width: 80px; }',
        goal: (D) => (p6Is(D, '.hp', 'width', 80) ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: пробел в «160 px» и число без px.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.card { width: 160 px; height: 90; }', answer: '.card { width: 160px; height: 90px; }',
      page: p6Shop,
      goal: (D) => (p6Is(D, '.card', 'width', 160) && p6Is(D, '.card', 'height', 90) ? null : C.t4.no),
      sample: ['.box { width: 120px; height: 60px; }'],
      drill: { single: true, code0: '.coin { width: 40%; height: 40px; }', answer: '.coin { width: 40px; height: 40px; }',
        goal: (D) => (p6Is(D, '.coin', 'width', 40) && p6Is(D, '.coin', 'height', 40) ? null : C.t4.drillNo) }
    }),
    // Т5 · свой уровень: полоска в процентах, герой с width и height, кнопка в пикселях.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '', answer: '.bar { width: 70%; }\n.hero { width: 50px; height: 50px; }\n.btn { width: 160px; }',
      page: p6Mine,
      list: [
        { t: L3(".bar: foiz", '.bar: %', '.bar: %'), ok: (D) => { const v = p6Last(D, '.bar', 'width'); return p6Pct(v) && parseFloat(v) <= 100; } },
        { t: L3(".hero: 2 o'lcham", '.hero: 2 размера', '.hero: 2 sizes'), ok: (D) => !!p6Last(D, '.hero', 'width') && !!p6Last(D, '.hero', 'height') },
        { t: L3(".btn: px", '.btn: px', '.btn: px'), ok: (D) => p6Px(p6Last(D, '.btn', 'width')) }
      ],
      goal: (D) => {
        const bar = p6Last(D, '.bar', 'width'), bw = p6Last(D, '.btn', 'width');
        if (!bar) return C.t5.needBar;
        if (!p6Pct(bar)) return C.t5.barPx;
        if (parseFloat(bar) > 100) return C.t5.over;
        if (!p6Last(D, '.hero', 'width') || !p6Last(D, '.hero', 'height')) return C.t5.needHero;
        if (!bw) return C.t5.needBtn;
        if (!p6Px(bw)) return C.t5.btnPct;
        return null;
      },
      sample: ['.bar { width: 40%; }', '.hero { width: 60px; height: 80px; }', '.btn { width: 200px; }'],
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
    eyebrow: L3("Kodining o'yini", 'Игра Коди', 'Kodi’s game'),
    say: L3("Salom! Men o'yin yasadim, mana uning sayti. Qarang: yuklanish chizig'i chiroyli to'lib boryapti, tugma esa ixcham va ko'zga tashlanadi. Hamma o'lchamlarni CSS bergan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Я сделал игру, а вот её сайт. Смотри: полоска загрузки аккуратно заполняется, а кнопка компактная и заметная. Все размеры задал CSS. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! I made a game, and here’s its website. Look: the loading bar fills up neatly, and the button is compact and easy to spot. CSS set all the sizes. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! O'lchamlar o'chib ketibdi. Yuklanish chizig'i ham, tugma ham butun oyna bo'ylab cho'zilib ketibdi.",
      'Ой! Размеры стёрлись. И полоска, и кнопка растянулись на всё окно.',
      'Oh no! The sizes got erased. The bar and the button both stretched across the whole window.'),
    done: L3("Ranglar joyida, faqat o'lchamlar yo'qoldi. O'tgan darsda width va height xususiyatlarini o'rgandik: pikselda va foizda. Endi beshta sahifani birma-bir tuzatamiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizniki bo'ladi.",
      'Цвета на месте, пропали только размеры. На прошлом уроке мы разобрали width и height: в пикселях и в процентах. Теперь починим пять страниц по одной, а код будешь писать ты. Пятая страница будет твоей.',
      'The colors are fine, only the sizes are gone. Last lesson we learned width and height: in pixels and in percent. Now let’s fix the five pages one by one, and you’ll write the code. The fifth page will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tuzatamiz: kodni siz yozasiz", 'Починим пять страниц: код пишешь ты', 'Let’s fix five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Yuklanish", 'Загрузка', 'Loading'),
    say: L3("Birinchi sahifa: o'yin yuklanishi. Chiziq zo'rg'a ko'rinyapti, u bor-yo'g'i o'n foizga to'lgan. Uni yarmigacha to'ldiring: qoidadagi qiymatni almashtiring.",
      'Первая страница: загрузка игры. Полоску еле видно, она заполнена всего на десять процентов. Заполни её наполовину: замени в правиле значение.',
      'The first page is the game loading. The bar is barely visible, it’s only ten percent full. Fill it halfway: change the value in the rule.'),
    ask: L3("Chiziqni yarmigacha to'ldiring", 'Заполни полоску наполовину', 'Fill the bar halfway'),
    ok: L3("Ajoyib! Chiziq roppa-rosa yarmigacha to'ldi.", 'Отлично! Полоска заполнена ровно наполовину.', 'Great! The bar is exactly half full.'),
    hints: [
      L3("Qoidaga qarang: chiziqning kengligi nimada yozilgan, pikseldami yoki foizdami?", 'Посмотри на правило: в чём записана ширина полоски, в пикселях или в процентах?', 'Look at the rule: what is the bar’s width written in, pixels or percent?'),
      L3("Foiz butunning bir qismi: yuz foiz bu hammasi, yarmi esa ellik foiz. O'nni o'chirib, ellik yozing.", 'Проценты — часть целого: сто процентов — всё, а половина — пятьдесят. Сотри десять и напиши пятьдесят.', 'Percent is a part of the whole: one hundred percent is all of it, and half is fifty. Erase ten and write fifty.'),
      L3("Namuna kod ostida: u chiziqni chorak qismigacha to'ldiradi. Xuddi shunday yozing, faqat ellik foiz bilan.", 'Образец под кодом заполняет полоску на четверть. Напиши так же, только пятьдесят процентов.', 'The example under the code fills the bar a quarter of the way. Write the same, only with fifty percent.')
    ],
    no: L3("Chiziq yarmigacha to'lmadi. Yarmi degani ellik foiz.", 'Полоска заполнена не наполовину. Половина — это пятьдесят процентов.', 'The bar isn’t half full. Half is fifty percent.'),
    px: L3("Bu piksel. Yarmini esa foiz bilan yozamiz: ellik foiz.", 'Это пиксели. А половину пишут в процентах: пятьдесят процентов.', 'Those are pixels. Half is written in percent: fifty percent.'),
    drill: L3("endi chiziqni oxirigacha to'ldiring", 'теперь заполни полоску до конца', 'now fill the bar all the way'),
    drillNo: L3("Chiziq hali oxirigacha to'lmadi. Hammasi degani yuz foiz.", 'Полоска ещё не заполнена до конца. Всё целиком — это сто процентов.', 'The bar isn’t full yet. All of it is one hundred percent.')
  },
  t2: {
    eyebrow: L3("Tugma", 'Кнопка', 'Button'),
    say: L3("Chiziq to'ldi! Endi «O'ynash» tugmasi. U butun oyna bo'ylab cho'zilib yotibdi, bunaqasi tugmaga umuman o'xshamaydi. Tugmaning kengligi bir yuz ellik piksel bo'lsin: qoidaning ichiga xususiyat va qiymatni yozing.",
      'Полоска заполнена! Теперь кнопка «Играть». Она растянулась на всё окно и на кнопку совсем не похожа. Пусть ширина кнопки будет сто пятьдесят пикселей: впиши в правило свойство и значение.',
      'The bar is full! Now the “Play” button. It’s stretched across the whole window and doesn’t look like a button at all. Let’s make the button one hundred fifty pixels wide: write a property and a value inside the rule.'),
    ask: L3("Tugmani 150 piksel kenglikda qiling", 'Сделай кнопку шириной 150 пикселей', 'Make the button 150 pixels wide'),
    ok: L3("Zo'r! Endi bu haqiqiy tugma, uni bosgingiz keladi.", 'Огонь! Теперь это настоящая кнопка, на неё хочется нажать.', 'Awesome! Now it’s a real button, you want to press it.'),
    hints: [
      L3("Kenglikni qaysi xususiyat beradi? Kenglik inglizchada nima deyiladi?", 'Какое свойство задаёт ширину? Как «ширина» по-английски?', 'Which property sets the width? What’s the English word for it?'),
      L3("Kenglikni width beradi. Keyin ikki nuqta, son va px, oxirida nuqtali vergul.", 'Ширину задаёт width. Потом двоеточие, число и px, в конце точка с запятой.', 'width sets the width. Then a colon, the number and px, and a semicolon at the end.'),
      L3("Namuna kod ostida: u sarlavhani ikki yuz piksel kenglikda qiladi. Tugma uchun ham xuddi shunday yozing, faqat bir yuz ellik bilan.", 'Образец под кодом делает заголовок шириной двести пикселей. Для кнопки напиши так же, только сто пятьдесят.', 'The example under the code makes the heading two hundred pixels wide. Write the same for the button, only one hundred fifty.')
    ],
    no: L3("Tugmaning kengligi boshqa. Bizga bir yuz ellik piksel kerak.", 'Ширина кнопки другая. Нужно сто пятьдесят пикселей.', 'The button’s width is different. We need one hundred fifty pixels.'),
    pct: L3("Bu foiz: bunday tugma oyna bilan birga o'zgarib turadi. Tugmaga piksel kerak, bir yuz ellik piksel.", 'Это проценты: такая кнопка будет меняться вместе с окном. Кнопке нужны пиксели, сто пятьдесят.', 'That’s percent: a button like that changes with the window. The button needs pixels, one hundred fifty.'),
    drill: L3("endi tugmani balandroq qiling: 50 piksel", 'теперь сделай кнопку выше: 50 пикселей', 'now make the button taller: 50 pixels'),
    drillNo: L3("Tugmaning balandligi boshqa. Balandlikni height beradi, bizga ellik piksel kerak.", 'Высота кнопки другая. Высоту задаёт height, нужно пятьдесят пикселей.', 'The button’s height is different. height sets it, and we need fifty pixels.')
  },
  t3: {
    eyebrow: L3("Qahramon", 'Герой', 'Hero'),
    say: L3("Tugma tayyor! Uchinchi sahifa: o'yin qahramoni. Hozir u uzun chiziqqa o'xshab qolibdi. Qahramon kvadrat bo'lsin: kengligi ham, balandligi ham yuz piksel. Bu yerda kod umuman yo'q, qoidani boshidan oxirigacha o'zingiz yozing. Qahramonning class nomi hero.",
      'Кнопка готова! Третья страница: герой игры. Сейчас он похож на длинную полосу. Пусть герой станет квадратом: и ширина, и высота по сто пикселей. Здесь кода нет совсем, напиши правило целиком. Класс героя называется hero.',
      'The button is ready! The third page is the game’s hero. Right now he looks like a long stripe. Let’s make the hero a square: both width and height one hundred pixels. There’s no code here at all, write the whole rule yourself. The hero’s class is called hero.'),
    ask: L3("Qahramonni 100 ga 100 pikselli kvadrat qiling", 'Сделай героя квадратом 100 на 100 пикселей', 'Make the hero a 100 by 100 pixel square'),
    ok: L3("Qoyil! Qahramon kvadrat bo'ldi, endi u o'yinga tayyor.", 'Вот это да! Герой стал квадратом и готов к игре.', 'Wow! The hero is a square and ready to play.'),
    hints: [
      L3("Qoida uch qismdan iborat: nimani bezaymiz, qaysi xususiyat va qanday qiymat. Bu safar ikkita xususiyat kerak: kenglik va balandlik.", 'Правило — это три части: что оформляем, какое свойство и какое значение. В этот раз свойств два: ширина и высота.', 'A rule has three parts: what we style, which property and which value. This time there are two properties: width and height.'),
      L3("Selektor nuqta va hero so'zi, xususiyatlar width va height, ikkalasi ham yuz piksel.", 'Селектор — точка и слово hero, свойства width и height, оба по сто пикселей.', 'The selector is a dot and the word hero. The properties are width and height, both one hundred pixels.'),
      L3("Namuna kod ostida: u boshqa qutini oltmishga sakson qiladi. Xuddi shunday qoida yozing, faqat ikkalasiga yuz piksel.", 'Образец под кодом делает другую коробку шестьдесят на восемьдесят. Напиши такое же правило, только оба по сто пикселей.', 'The example under the code makes another box sixty by eighty. Write the same kind of rule, only both one hundred pixels.')
    ],
    no: L3("Qahramon hali kvadrat emas. Kengligi ham, balandligi ham yuz piksel bo'lishi kerak.", 'Герой пока не квадрат. И ширина, и высота должны быть по сто пикселей.', 'The hero isn’t a square yet. Both width and height should be one hundred pixels.'),
    needH: L3("Kenglik joyida, lekin balandlik boshqa. Kvadratga ikkalasi kerak: height ham yozing.", 'Ширина на месте, а высота другая. Квадрату нужны обе: допиши height.', 'The width is right, but the height isn’t. A square needs both: add height.'),
    needW: L3("Balandlik joyida, lekin kenglik boshqa. Kvadratga ikkalasi kerak: width ham yozing.", 'Высота на месте, а ширина другая. Квадрату нужны обе: допиши width.', 'The height is right, but the width isn’t. A square needs both: add width.'),
    drill: L3("endi jon chizig'ini 80 piksel kenglikda qiling, qoidani o'zingiz yozing", 'теперь сделай полоску здоровья шириной 80 пикселей, правило пиши сам', 'now make the health bar 80 pixels wide, write the rule yourself'),
    drillNo: L3("Jon chizig'ining kengligi boshqa. Uning class nomi hp, bizga sakson piksel kerak.", 'Ширина полоски здоровья другая. Её класс hp, нужно восемьдесят пикселей.', 'The health bar’s width is different. Its class is hp, and we need eighty pixels.')
  },
  t4: {
    eyebrow: L3("Do'kon", 'Магазин', 'Shop'),
    say: L3("Qahramon tayyor! To'rtinchi sahifa: do'kon. Mahsulot kartochkasini men shoshib yozgan edim, unda ikkita joy buzilgan. Brauzer buzilgan qiymatni tashlab yuboradi, shuning uchun kartochka butun oyna bo'ylab cho'zilib qoldi. Ikkala buzilgan joyni toping va tuzating.",
      'Герой готов! Четвёртая страница: магазин. Карточку товара я писал в спешке, и в ней две поломки. Браузер сломанные значения выбрасывает, поэтому карточка растянулась на всё окно. Найди и почини обе поломки.',
      'The hero is ready! The fourth page is the shop. I wrote the item card in a hurry, and it has two broken spots. The browser throws broken values away, so the card stretched across the whole window. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana bu ish! Kartochka ixcham bo'ldi, do'kon ochildi.", 'Вот это да! Карточка стала аккуратной, магазин открыт.', 'That’s it! The card is neat, and the shop is open.'),
    hints: [
      L3("Har bir qiymatni darsdagidek tekshiring: son va px qanday yoziladi? Ular o'rtasida nima turibdi?", 'Проверь каждое значение, как на уроке: как пишутся число и px? Что стоит между ними?', 'Check each value like in the lesson: how are the number and px written? What’s between them?'),
      L3("width qiymatida son va px o'rtasida bo'sh joy bor. height qiymatida esa px umuman yo'q.", 'В width между числом и px стоит пробел. А в height px нет совсем.', 'In width there’s a space between the number and px. And height has no px at all.'),
      L3("Namuna kod ostida: ishlaydigan qoida. Qiymatlarni xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом — рабочее правило. Напиши значения так же и нажми «Проверить».', 'The example under the code is a working rule. Write the values the same way and tap Check.')
    ],
    no: L3("Kartochka hali kerakli o'lchamda emas: kengligi bir yuz oltmish, balandligi to'qson piksel bo'lishi kerak.", 'Карточка пока не того размера: ширина должна быть сто шестьдесят, а высота девяносто пикселей.', 'The card isn’t the right size yet: it should be one hundred sixty wide and ninety pixels tall.'),
    drill: L3("endi tangani tuzating: u kvadrat bo'lishi kerak", 'теперь почини монетку: она должна быть квадратной', 'now fix the coin: it should be square'),
    drillNo: L3("Tanga hali kvadrat emas. Foiz uni oyna bo'ylab cho'zadi, bizga qirq piksel kerak.", 'Монетка пока не квадратная. Проценты растягивают её по окну, а нужно сорок пикселей.', 'The coin isn’t square yet. Percent stretches it with the window, and we need forty pixels.')
  },
  t5: {
    eyebrow: L3("Mening darajam", 'Мой уровень', 'My level'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z darajangizni yasang. Yuklanish chizig'ini foizda to'ldiring, qahramonga kenglik va balandlik bering, tugmaga esa pikselda kenglik bering. Qiymatlarni o'zingiz tanlang. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: собери свой уровень. Заполни полоску в процентах, дай герою ширину и высоту, а кнопке — ширину в пикселях. Значения выбирай любые. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: build your own level. Fill the bar in percent, give the hero a width and a height, and give the button a width in pixels. Pick the values yourself. Under the window you can see what’s done.'),
    ask: L3("Darajangizni yasang: uchta qoida", 'Собери свой уровень: три правила', 'Build your level: three rules'),
    ok: L3("Ura! Darajangiz tayyor, hamma narsa o'z o'lchamida!", 'Ура! Твой уровень готов, у всего свой размер!', 'Hooray! Your level is ready, everything has its own size!'),
    hints: [
      L3("Bittadan boshlang, masalan yuklanish chizig'idan. Keyin qahramon va tugmani qo'shing.", 'Начни с одного правила, например с полоски. Потом добавь героя и кнопку.', 'Start with one rule, for example the bar. Then add the hero and the button.'),
      L3("Uchta qoida kerak: bar uchun foizda width, hero uchun width va height, btn uchun pikselda width.", 'Нужны три правила: для bar ширина в процентах, для hero width и height, для btn ширина в пикселях.', 'You need three rules: width in percent for bar, width and height for hero, width in pixels for btn.'),
      L3("Namuna kod ostida: boshqa qiymatlar bilan. O'zingizga yoqqan o'lchamlarni tanlang.", 'Образец под кодом — с другими значениями. Выбери свои размеры.', 'The example under the code uses other values. Pick your own sizes.')
    ],
    needBar: L3("Yuklanish chizig'i uchun qoida yo'q: bar uchun foizda width yozing.", 'Нет правила для полоски: напиши для bar ширину в процентах.', 'There’s no rule for the bar: write a width in percent for bar.'),
    barPx: L3("Yuklanish chizig'i pikselda yozilgan. Uni foizda yozing, xuddi yuklanishdagidek.", 'Ширина полоски записана в пикселях. Запиши её в процентах, как у загрузки.', 'The bar’s width is in pixels. Write it in percent, like the loading bar.'),
    over: L3("Chiziq yo'lakdan chiqib ketdi: yuz foizdan ko'pi bo'lmaydi.", 'Полоска вылезла за дорожку: больше ста процентов не бывает.', 'The bar went past its track: there’s nothing more than one hundred percent.'),
    needHero: L3("Qahramonga kenglik ham, balandlik ham kerak: hero uchun width va height yozing.", 'Герою нужны и ширина, и высота: напиши для hero width и height.', 'The hero needs both a width and a height: write width and height for hero.'),
    needBtn: L3("Tugma uchun qoida yo'q: btn uchun width yozing.", 'Нет правила для кнопки: напиши для btn ширину.', 'There’s no rule for the button: write a width for btn.'),
    btnPct: L3("Tugmaning kengligi foizda. Tugmaga piksel kerak, masalan bir yuz oltmish piksel.", 'Ширина кнопки в процентах. Кнопке нужны пиксели, например сто шестьдесят.', 'The button’s width is in percent. The button needs pixels, for example one hundred sixty.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Beshta sahifa ham yana o'z o'lchamida! Bularning hammasini sizning CSS kodingiz qildi.", 'Все пять страниц снова нужного размера! И всё это сделал твой CSS.', 'All five pages are the right size again! And your own CSS did all of it.') },
      { k: 'a', text: L3("width kenglikni, height esa balandlikni beradi.", 'width задаёт ширину, а height — высоту.', 'width sets the width, and height sets the height.') },
      { k: 'b', text: L3("Piksel o'zgarmaydi, foiz esa butunning bir qismi: ellik foiz yarmi, yuz foiz hammasi.", 'Пиксели не меняются, а проценты — часть целого: пятьдесят процентов — половина, сто — всё.', 'Pixels don’t change, and percent is a part of the whole: fifty percent is half, one hundred is all.') },
      { k: 'c', text: L3("Kvadrat uchun ikkalasi kerak: kenglik ham, balandlik ham.", 'Для квадрата нужны обе: и ширина, и высота.', 'A square needs both: the width and the height.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: px yozilmagan son va son bilan px o'rtasidagi bo'sh joy.", 'И находишь поломки: число без px и пробел между числом и px.', 'And you find broken spots: a number without px and a space between the number and px.') },
      { k: null, text: L3("Keyingi darsda Box Model: elementlar ichidagi va atrofidagi bo'shliqlar hamda ramkalar. Ko'rishguncha!", 'На следующем уроке — Box Model: отступы внутри и вокруг элементов и рамки. До встречи!', 'Next lesson is the Box Model: space inside and around elements, and borders. See you!') }
    ],
    roles: {
      a: L3("width, height", 'width, height', 'width, height'),
      b: L3("px va foiz", 'px и %', 'px and %'),
      c: L3("kvadrat: width va height", 'квадрат: width и height', 'square: width and height'),
      d: L3("tuzatish: px, bo'sh joysiz", 'починка: px без пробела', 'fixing: px, no space')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
