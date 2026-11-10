// =============================================================================
// ===== ПРАКТИКА 9 · «Кинотеатр Коди» · к уроку 9 «Как элементы ведут себя на странице» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (09.11.2026). При обновлении сайта кинотеатра стёрся CSS: кнопки меню стали крошечными и разными,
// надоедливая реклама снова вылезла, вкладки погасли. Ученик возвращает порядок свойством display: заменить
// значение — спрятать рекламу (none) → вписать display в готовое правило: метки span одной ширины (width на
// строчный элемент не действует — нужен inline-block) → правило целиком: каждое блюдо буфета на своей строке
// (.class из урока 2 + block) → починить две поломки урока («inline block» без чёрточки, hidden вместо none) →
// своя страница: меню из кнопок одной ширины своего цвета и спрятанная реклама (условия «готово» видны).
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-09p-display.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz», «yorliq» — вкладка); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'css-09p-display',
  module: 'css-m1-osnovy',
  lessonTitle: { uz: "9-amaliyot. Kinoteatr tugmalari", ru: 'Практика 9. Кнопки кинотеатра', en: 'Practice 9. Cinema buttons' }
};

// Страницы кинотеатра (тексты на языке урока).
const P9 = {
  title: L3("Kodining kinoteatri", 'Кинотеатр Коди', 'Kodi’s cinema'),
  afisha: L3("Afisha", 'Афиша', 'Showtimes'),
  janr: L3("Janrlar", 'Жанры', 'Genres'),
  bufet: L3("Bufet", 'Буфет', 'Snack bar'),
  chipta: L3("Chiptalar", 'Билеты', 'Tickets'),
  mine: L3("Mening kinoteatrim", 'Мой кинотеатр', 'My cinema'),
  ad: L3("REKLAMA! 100 ta popkorn oling!", 'РЕКЛАМА! Купи 100 попкорнов!', 'AD! Buy 100 popcorns!'),
  films: L3("Bugun: «Kosmos sirlari» va «Dinozavrlar»", 'Сегодня: «Тайны космоса» и «Динозавры»', 'Today: “Space secrets” and “Dinosaurs”'),
  sub: L3("Yangiliklarga obuna bo'ling!", 'Подпишись на новости!', 'Subscribe to our news!'),
  comedy: L3("Komediya", 'Комедия', 'Comedy'),
  cartoon: L3("Multfilm", 'Мультик', 'Cartoon'),
  scifi: L3("Fantastika", 'Фантастика', 'Sci-fi'),
  genresP: L3("Bugungi janrlar:", 'Жанры дня:', 'Today’s genres:'),
  today: L3("Bugun:", 'Сегодня:', 'Today:'),
  popcorn: L3("Popkorn", 'Попкорн', 'Popcorn'),
  juice: L3("Sharbat", 'Сок', 'Juice'),
  ice: L3("Muzqaymoq", 'Мороженое', 'Ice cream'),
  hallsH: L3("Zallar", 'Залы', 'Halls'),
  halls: L3("Zallar:", 'Залы:', 'Halls:'),
  big: L3("Katta zal", 'Большой зал', 'Big hall'),
  small: L3("Kichik zal", 'Малый зал', 'Small hall'),
  pick: L3("Seansni tanlang:", 'Выбери сеанс:', 'Pick a showtime:'),
  welcome: L3("Xush kelibsiz!", 'Добро пожаловать!', 'Welcome!')
};
const P9_TIMES = ['10:00', '14:00', '18:00'];
const p9Menu = (pk) => '<nav><a>' + pk(P9.afisha) + '</a> <a>' + pk(P9.janr) + '</a> <a>' + pk(P9.bufet) + '</a></nav>';
const p9Hook = (pk) => '<h1>' + pk(P9.title) + '</h1>' + p9Menu(pk) + '<div class="reklama">' + pk(P9.ad) + '</div><p>' + pk(P9.films) + '</p>';
const p9Afisha = (pk) => '<h1>' + pk(P9.afisha) + '</h1><div class="reklama">' + pk(P9.ad) + '</div><p>' + pk(P9.films) + '</p>';
const p9Sub = (pk) => '<h1>' + pk(P9.afisha) + '</h1><div class="xabar">' + pk(P9.sub) + '</div><p>' + pk(P9.films) + '</p>';
const p9Genres = (pk) => '<h1>' + pk(P9.janr) + '</h1><p>' + pk(P9.genresP) + '</p><p><span class="janr">' + pk(P9.comedy) + '</span> <span class="janr">' +
  pk(P9.cartoon) + '</span> <span class="janr">' + pk(P9.scifi) + '</span></p>';
const p9Times = (cls) => (pk) => '<h1>' + pk(P9.chipta) + '</h1><p>' + pk(P9.pick) + '</p><p>' + P9_TIMES.map((t) => '<a class="' + cls + '">' + t + '</a>').join(' ') + '</p>';
const p9Bufet = (pk) => '<h1>' + pk(P9.bufet) + '</h1><p>' + pk(P9.today) + ' <span class="taom">' + pk(P9.popcorn) + '</span> <span class="taom">' + pk(P9.juice) +
  '</span> <span class="taom">' + pk(P9.ice) + '</span></p>';
const p9Halls = (pk) => '<h1>' + pk(P9.hallsH) + '</h1><p>' + pk(P9.halls) + ' <span class="zal">' + pk(P9.big) + '</span> <span class="zal">' + pk(P9.small) + '</span></p>';
const p9Tickets = (pk) => p9Times('knopka')(pk) + '<div class="reklama">' + pk(P9.ad) + '</div>';
const p9Own = (pk) => '<h1>' + pk(P9.mine) + '</h1>' + p9Menu(pk) + '<div class="reklama">' + pk(P9.ad) + '</div><p>' + pk(P9.welcome) + '</p>';

// Проверка цели: вычисленный display (как в DevTools) и есть ли в правилах ученика свойство у селектора.
const p9D = (D, sel) => D.cs(sel, 'display');
const p9All = (D, sel, v) => { const els = D.qa(sel); return els.length > 0 && els.every((el) => D.win.getComputedStyle(el).display === v); };
const p9Has = (D, sel, prop) => D.rules.some((r) => r.sel && r.style && cpNormSel(r.sel) === cpNormSel(sel) && !!r.style.getPropertyValue(prop));

const PR = {
  next: L3("Flexbox: elementlarni joylashtirish", 'Flexbox: расположение элементов', 'Flexbox: arranging elements'),
  // Сайт по умолчанию: ссылки и метки с фоном (как кнопки), шумная реклама, окно подписки, блюда с фоном — чтобы
  // было видно, где строчный элемент, а где блок.
  base: 'h1{font-size:26px}a{background-color:lavender;color:#3B2A8F;padding:4px 2px;text-align:center}' +
    '.reklama{background-color:#FFE4E6;color:crimson;padding:8px;font-weight:bold;text-align:center;margin:6px 0}' +
    '.xabar{background-color:#E0F2FE;border:2px solid #0284C7;padding:8px;text-align:center;margin:6px 0}' +
    '.janr{background-color:gold;padding:4px 0;text-align:center;font-size:15px}.taom,.zal{background-color:lightyellow;padding:2px 6px}',
  tabs: [
    { ico: 'film', c: '#7C5CFA', name: P9.afisha, file: 'afisha.html' },
    { ico: 'star', c: '#F59E0B', name: P9.janr, file: 'janrlar.html' },
    { ico: 'cup', c: '#0FA38E', name: P9.bufet, file: 'bufet.html' },
    { ico: 'cart', c: '#FA4F28', name: P9.chipta, file: 'chiptalar.html' },
    { ico: 'heart', c: '#E44D8A', name: P9.mine, file: 'mening.html' }
  ],
  hook: {
    page: p9Hook,
    css: ['  a {', '    display: inline-block;', '    width: 80px;', '  }', '  .reklama { display: none; }']
  },
  ownPage: p9Own,
  ownDefault: 'a {\n  display: inline-block;\n  width: 80px;\n  background-color: lightblue;\n}\n.reklama { display: none; }',
  tasks: [
    // Т1 · заменить значение в готовом правиле: спрятать рекламу (none).
    (pk) => cpTask(1, {
      kind: 'change-value', single: true, code0: '.reklama { display: block; }', answer: '.reklama { display: none; }',
      page: p9Afisha,
      goal: (D) => (p9D(D, '.reklama') === 'none' ? null : C.t1.no),
      sample: ['p { display: none; }'],
      drill: { single: true, page: p9Sub, code0: '.xabar { display: block; }', answer: '.xabar { display: none; }',
        goal: (D) => (p9D(D, '.xabar') === 'none' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать свойство и значение в готовое правило: width на строчный span не действует — нужен inline-block.
    (pk) => cpTask(2, {
      kind: 'write-declaration', given: ['.janr { width: 80px; }'], code0: '.janr {\n  \n}', answer: '.janr {\n  display: inline-block;\n}',
      page: p9Genres,
      goal: (D, st) => {
        if (p9All(D, '.janr', 'inline-block')) return null;
        const d = p9D(D, '.janr');
        if (d === 'block') return C.t2.block;
        if (d === 'none') return C.t2.none;
        if (d === 'inline' && /display\s*:/i.test(st.code)) return C.t2.inline;
        return C.t2.no;
      },
      sample: ['.belgi {', '  display: inline-block;', '}'],
      drill: { page: p9Times('vaqt'), given: ['.vaqt { width: 70px; }'], code0: '.vaqt {\n  \n}', answer: '.vaqt {\n  display: inline-block;\n}',
        goal: (D) => (p9All(D, '.vaqt', 'inline-block') ? null : C.t2.drillNo) }
    }),
    // Т3 · правило целиком: каждое блюдо на своей строке (.class из урока 2 + block).
    (pk) => cpTask(3, {
      kind: 'write-rule', code0: '', answer: '.taom { display: block; }',
      page: p9Bufet,
      htmlAid: (pk) => ['<h1>' + pk(P9.bufet) + '</h1>', '<p>' + pk(P9.today), '  <span class="taom">' + pk(P9.popcorn) + '</span>',
        '  <span class="taom">' + pk(P9.juice) + '</span> …</p>'],
      goal: (D) => {
        if (p9All(D, '.taom', 'block')) return null;
        const d = p9D(D, '.taom');
        if (d === 'none') return C.t3.none;
        if (d === 'inline-block') return C.t3.ib;
        return C.t3.no;
      },
      sample: ['.nomi { display: block; }'],
      drill: { page: p9Halls, code0: '', answer: '.zal { display: block; }',
        htmlAid: (pk) => ['<h1>' + pk(P9.hallsH) + '</h1>', '<p>' + pk(P9.halls), '  <span class="zal">' + pk(P9.big) + '</span>', '  <span class="zal">' + pk(P9.small) + '</span></p>'],
        goal: (D) => (p9All(D, '.zal', 'block') ? null : C.t3.drillNo) }
    }),
    // Т4 · найти и починить две поломки урока: «inline block» без чёрточки и hidden вместо none.
    (pk) => cpTask(4, {
      kind: 'fix', code0: '.knopka {\n  display: inline block;\n  width: 80px;\n}\n.reklama { display: hidden; }',
      answer: '.knopka {\n  display: inline-block;\n  width: 80px;\n}\n.reklama { display: none; }',
      page: p9Tickets,
      goal: (D) => (!p9All(D, '.knopka', 'inline-block') ? C.t4.btn : p9D(D, '.reklama') !== 'none' ? C.t4.ad : null),
      sample: ['.tugma { display: inline-block; }', '.banner { display: none; }'],
      drill: { single: true, page: p9Sub, code0: '.xabar { display: hidden; }', answer: '.xabar { display: none; }',
        goal: (D) => (p9D(D, '.xabar') === 'none' ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: меню из кнопок одной ширины своего цвета, реклама спрятана.
    (pk, store) => cpTask(5, {
      kind: 'own-page', big: true, code0: '',
      answer: 'a {\n  display: inline-block;\n  width: 80px;\n  background-color: gold;\n}\n.reklama { display: none; }',
      page: p9Own,
      list: [
        { t: L3("a: inline-block va width", 'a: inline-block и width', 'a: inline-block and width'), ok: (D) => p9D(D, 'a') === 'inline-block' && p9Has(D, 'a', 'width') },
        { t: L3("a: fon rangi", 'a: цвет фона', 'a: background color'), ok: (D) => p9Has(D, 'a', 'background-color') },
        { t: L3(".reklama: yashirin", '.reklama: спрятана', '.reklama: hidden'), ok: (D) => p9D(D, '.reklama') === 'none' }
      ],
      goal: (D) => {
        const d = p9D(D, 'a');
        if (d === 'none') return C.t5.gone;
        if (d === 'block') return C.t5.block;
        if (d !== 'inline-block') return C.t5.needIb;
        if (!p9Has(D, 'a', 'width')) return C.t5.needW;
        if (!p9Has(D, 'a', 'background-color')) return C.t5.needBg;
        if (p9D(D, '.reklama') !== 'none') return C.t5.needAd;
        return null;
      },
      sample: ['a {', '  display: inline-block;', '  width: 90px;', '  background-color: pink;', '}', '.reklama { display: none; }'],
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
    eyebrow: L3("Kinoteatr", 'Кинотеатр', 'Cinema'),
    say: L3("Salom! Bu mening kinoteatrimning sayti. Qarang: menyu tugmalari bir xil kenglikda yonma-yon turibdi, zerikarli reklama esa yashirilgan. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт моего кинотеатра. Смотри: кнопки меню одной ширины стоят рядом, а надоедливая реклама спрятана. На сайте пять страниц. Сейчас я его обновлю, нажми «Обновить».',
      'Hi! This is my cinema’s website. Look: the menu buttons are the same width and stand side by side, and the annoying ad is hidden. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! CSS kodi o'chib ketdi. Tugmalar kichkina va har xil bo'lib qoldi, reklama esa yana chiqib keldi. Yorliqlar ham o'chdi.",
      'Ой! CSS-код стёрся. Кнопки стали крошечными и разными, а реклама снова вылезла. И вкладки погасли.',
      'Oh no! The CSS code got erased. The buttons became tiny and uneven, and the ad popped up again. The tabs went dark too.'),
    done: L3("HTML joyida, faqat elementlar o'z odatiga qaytdi. O'tgan darsda display xususiyatini o'rgandik: block, inline, inline-block va none. Endi beshta sahifani birma-bir tiklaymiz, kodni esa o'zingiz yozasiz. Beshinchi sahifa sizning kinoteatringiz bo'ladi.",
      'HTML на месте, просто элементы вернулись к своему обычному поведению. На прошлом уроке мы изучили свойство display: block, inline, inline-block и none. Теперь вернём пять страниц по одной, а код будешь писать ты. Пятая страница будет твоим кинотеатром.',
      'The HTML is fine, the elements just went back to their usual behavior. Last lesson we learned the display property: block, inline, inline-block and none. Now let’s bring back the five pages one by one, and you’ll write the code. The fifth page will be your own cinema.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tiklaymiz: kodni siz yozasiz", 'Вернём пять страниц: код пишешь ты', 'Let’s bring back five pages: you write the code')
  },
  t1: {
    eyebrow: L3("Afisha", 'Афиша', 'Showtimes'),
    say: L3("Birinchi sahifa: afisha. Qarang, katta reklama filmlarni to'sib turibdi! Qoidada display block yozilgan, shuning uchun u ko'rinib turibdi. Reklamani sahifadan yashiring: qoidadagi qiymatni almashtiring.",
      'Первая страница: афиша. Смотри, огромная реклама загораживает фильмы! В правиле написано display block, поэтому её видно. Спрячь рекламу со страницы: замени значение в правиле.',
      'The first page is the showtimes. Look, a huge ad is blocking the movies! The rule says display block, so it shows. Hide the ad from the page: change the value in the rule.'),
    ask: L3("Reklamani yashiring", 'Спрячь рекламу', 'Hide the ad'),
    ok: L3("Ajoyib! Reklama g'oyib bo'ldi, uning joyi ham qolmadi. Endi filmlar ko'rinib turibdi!", 'Отлично! Реклама исчезла, и даже места от неё не осталось. Теперь фильмы видно!', 'Great! The ad vanished and left no gap. Now the movies are visible!'),
    hints: [
      L3("display uchun qaysi qiymat elementni umuman ko'rsatmaydi? Esingizdami?", 'Какое значение display совсем не показывает элемент? Помнишь?', 'Which display value doesn’t show an element at all? Remember?'),
      L3("Bu none, inglizchada «hech narsa» degani. block so'zini o'chirib, none deb yozing.", 'Это none, по-английски «ничего». Сотри block и напиши none.', 'It’s none, which means nothing. Erase block and write none.'),
      L3("Namuna kod ostida: u abzasni yashiradi. Xuddi shunday, reklama uchun none yozing va Tekshirishni bosing.", 'Образец под кодом прячет абзац. Так же напиши none для рекламы и нажми «Проверить».', 'The example under the code hides a paragraph. Write none for the ad the same way and tap Check.')
    ],
    no: L3("Reklama hali ko'rinib turibdi. Bizga uni butunlay yashiradigan so'z kerak.", 'Реклама всё ещё видна. Нужно слово, которое прячет её совсем.', 'The ad is still visible. We need the word that hides it completely.'),
    drill: L3("endi obuna xabarini ham yashiring", 'теперь спрячь и плашку подписки', 'now hide the subscribe box too'),
    drillNo: L3("Obuna xabari hali ko'rinib turibdi. Yashirish uchun none kerak.", 'Плашка подписки всё ещё видна. Чтобы спрятать, нужно none.', 'The subscribe box is still visible. To hide it, you need none.')
  },
  t2: {
    eyebrow: L3("Janrlar", 'Жанры', 'Genres'),
    say: L3("Afisha tayyor! Endi janrlar sahifasi. Har bir janr span tegida, ularga kenglik ham berilgan: sakson piksel. Lekin qarang, belgilar baribir har xil! Ular yonma-yon qolsin va bir xil kenglikda bo'lsin: bo'sh qoidaga xususiyat va qiymatni yozing.",
      'Афиша готова! Теперь страница жанров. Каждый жанр в теге span, им даже дали ширину: восемьдесят пикселей. Но смотри, метки всё равно разные! Пусть они стоят рядом и станут одной ширины: впиши в пустое правило свойство и значение.',
      'The showtimes are ready! Now the genres page. Each genre is in a span tag, and they even got a width: eighty pixels. But look, the labels are still different! Keep them side by side and make them the same width: write a property and a value in the empty rule.'),
    ask: L3("Janr belgilarini bir xil kenglikda qiling", 'Сделай метки жанров одной ширины', 'Make the genre labels the same width'),
    ok: L3("Zo'r! Belgilar teng va yonma-yon turibdi. Endi width ishlayapti!", 'Огонь! Метки одинаковые и стоят рядом. Теперь width работает!', 'Awesome! The labels are equal and side by side. Now width works!'),
    hints: [
      L3("Nimaga width ishlamayapti? span qaysi turdagi element: block yoki inline?", 'Почему width не работает? span — какой элемент: block или inline?', 'Why doesn’t width work? What kind of element is span: block or inline?'),
      L3("span inline element, width unga ishlamaydi. display uchun yonma-yon turadigan va o'lchamni oladigan qiymat kerak: ikki so'z chiziqcha bilan.", 'span — строчный элемент, width на него не действует. Для display нужно значение, которое стоит рядом и принимает размер: два слова через чёрточку.', 'span is an inline element, so width doesn’t work on it. display needs a value that sits side by side and accepts a size: two words joined by a dash.'),
      L3("Namuna kod ostida: u boshqa belgilarni shunday qiladi. Janrlar uchun ham xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом делает так другие метки. Для жанров напиши так же и нажми «Проверить».', 'The example under the code does this for other labels. Write the same for the genres and tap Check.')
    ],
    no: L3("Belgilar hali har xil: width inline elementga ishlamaydi. display uchun qiymat yozing.", 'Метки всё ещё разные: width на строчный элемент не действует. Впиши значение для display.', 'The labels are still different: width doesn’t work on an inline element. Type a value for display.'),
    block: L3("Kenglik ishladi, lekin belgilar ustma-ust bo'lib qoldi. Ular yonma-yon turishi kerak.", 'Ширина заработала, но метки встали друг под другом. А нужно рядом.', 'The width works, but the labels stacked up. They need to be side by side.'),
    inline: L3("inline bilan width ishlamaydi, belgilar har xilligicha qoldi.", 'С inline ширина не работает, метки так и остались разными.', 'With inline, width doesn’t work, so the labels stayed different.'),
    none: L3("none bilan belgilar umuman yo'qoldi. Ular ko'rinib tursin.", 'С none метки совсем пропали. Пусть они будут видны.', 'With none the labels disappeared. Keep them visible.'),
    drill: L3("endi seans tugmalarini ham bir xil kenglikda qiling", 'теперь сделай одной ширины и кнопки сеансов', 'now make the showtime buttons the same width too'),
    drillNo: L3("Seans tugmalari hali har xil. Yonma-yon va kenglik bilan turish uchun inline-block kerak.", 'Кнопки сеансов пока разные. Чтобы стоять рядом и с шириной, нужен inline-block.', 'The showtime buttons are still uneven. To sit side by side with a width, you need inline-block.')
  },
  t3: {
    eyebrow: L3("Bufet", 'Буфет', 'Snack bar'),
    say: L3("Ikkita sahifa yondi! Uchinchisi: bufet. Taomlar span teglarida, shuning uchun hammasi bitta qatorga tiqilib qolgan. Har bir taom o'z qatorida tursin. Qoidani boshidan oxirigacha o'zingiz yozing: taomlarning klassi HTML kodda ko'rinib turibdi.",
      'Две страницы горят! Третья: буфет. Блюда лежат в тегах span, поэтому все столпились в одной строке. Пусть каждое блюдо стоит на своей строке. Правило напиши целиком: класс блюд виден в HTML-коде.',
      'Two pages are lit! The third is the snack bar. The items are in span tags, so they’re all crammed into one line. Let each item stand on its own line. Write the whole rule yourself: the items’ class is in the HTML code.'),
    ask: L3("Har bir taom o'z qatorida tursin", 'Поставь каждое блюдо на свою строку', 'Put each item on its own line'),
    ok: L3("Mana! Har bir taom o'z qatorida, menyuni o'qish qulay bo'ldi.", 'Вот! Каждое блюдо на своей строке, меню стало удобно читать.', 'There! Each item is on its own line, and the menu is easy to read now.'),
    hints: [
      L3("Oldin selektor: taomlarning klassi qanday? Keyin o'ylab ko'ring: qaysi elementlar doim yangi qatordan boshlanadi?", 'Сначала селектор: какой класс у блюд? Потом подумай: какие элементы всегда начинаются с новой строки?', 'First the selector: what class do the items have? Then think: which elements always start on a new line?'),
      L3("Selektor taom, oldida nuqta. Xususiyat display, qiymati block: u quti kabi butun qatorni oladi.", 'Селектор taom, перед ним точка. Свойство display, значение block: он, как коробка, занимает всю строку.', 'The selector is taom with a dot before it. The property is display, the value is block: like a box, it takes the whole line.'),
      L3("Namuna kod ostida: u boshqa narsalarni shunday qiladi. Taomlar uchun ham xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом делает так другие вещи. Для блюд напиши так же и нажми «Проверить».', 'The example under the code does this for other things. Write the same for the items and tap Check.')
    ],
    no: L3("Taomlar hali bitta qatorda turibdi. Har biri yangi qatordan boshlanishi uchun block kerak.", 'Блюда всё ещё в одной строке. Чтобы каждое начиналось с новой строки, нужен block.', 'The items are still on one line. For each to start on a new line, you need block.'),
    ib: L3("inline-block bilan taomlar yonma-yon qoladi. Bizga har biri o'z qatorida kerak.", 'С inline-block блюда остаются рядом. А нужно каждое на своей строке.', 'With inline-block the items stay side by side. We need each one on its own line.'),
    none: L3("none bilan taomlar yo'qoldi. Ular ko'rinib tursin, faqat har biri o'z qatorida.", 'С none блюда пропали. Пусть будут видны, просто каждое на своей строке.', 'With none the items disappeared. Keep them visible, just each on its own line.'),
    drill: L3("endi har bir zalni ham o'z qatoriga qo'ying", 'теперь поставь на свою строку и каждый зал', 'now put each hall on its own line too'),
    drillNo: L3("Zallar hali bitta qatorda. Ularning klassi zal, qiymati esa block.", 'Залы всё ещё в одной строке. Их класс — zal, а значение — block.', 'The halls are still on one line. Their class is zal, and the value is block.')
  },
  t4: {
    eyebrow: L3("Chiptalar", 'Билеты', 'Tickets'),
    say: L3("Uchta sahifa tayyor! To'rtinchisi: chiptalar. Bu kodni men shoshib yozgan edim, unda ikkita joy buzilgan. Brauzer tanimagan qiymatlarni tashlab yuboradi, shuning uchun seans tugmalari har xil, reklama esa yana ko'rinib turibdi. Ikkala buzilgan joyni toping va tuzating.",
      'Три страницы готовы! Четвёртая: билеты. Этот код я писал в спешке, и в нём две поломки. Браузер незнакомые значения выбрасывает, поэтому кнопки сеансов разные, а реклама снова видна. Найди и почини обе поломки.',
      'Three pages are done! The fourth is tickets. I wrote this code in a hurry, and it has two broken spots. The browser throws away values it doesn’t know, so the showtime buttons are uneven and the ad is showing again. Find and fix both.'),
    ask: L3("Ikkita buzilgan joyni toping va tuzating", 'Найди и почини две поломки', 'Find and fix the two broken spots'),
    ok: L3("Mana, tuzaldi! Tugmalar teng, reklama yashirindi. Chiptalar sahifasi ham yondi.", 'Вот, починено! Кнопки одинаковые, реклама спрятана. Страница билетов тоже горит.', 'There, it’s fixed! The buttons are equal and the ad is hidden. The tickets page is lit too.'),
    hints: [
      L3("Har bir qiymatni darsdagi so'zlar bilan solishtiring: ular harfma-harf bir xilmi? display uchun hidden degan so'z bormi?", 'Сравни каждое значение со словами из урока: совпадают буква в букву? Есть ли у display слово hidden?', 'Compare each value with the words from the lesson: do they match letter for letter? Does display have the word hidden?'),
      L3("Birinchi qoidada inline va block o'rtasida bo'sh joy emas, chiziqcha bo'ladi. Ikkinchisida elementni hidden emas, faqat none yashira oladi.", 'В первом правиле между inline и block нужна чёрточка, а не пробел. Во втором прятать умеет не hidden, а только none.', 'In the first rule, inline and block are joined by a dash, not a space. In the second, only none can hide an element, not hidden.'),
      L3("Namuna kod ostida: ikkita to'g'ri qoida. Qiymatlarni xuddi shunday yozing va Tekshirishni bosing.", 'Образец под кодом — два верных правила. Напиши значения так же и нажми «Проверить».', 'The example under the code has two correct rules. Write the values the same way and tap Check.')
    ],
    btn: L3("Seans tugmalari hali har xil. Ularga yonma-yon turadigan va kenglikni oladigan qiymat kerak: inline-block.", 'Кнопки сеансов всё ещё разные. Им нужно значение, которое стоит рядом и берёт ширину: inline-block.', 'The showtime buttons are still uneven. They need a value that sits side by side and takes a width: inline-block.'),
    ad: L3("Reklama hali ko'rinib turibdi. Uni faqat none yashira oladi.", 'Реклама всё ещё видна. Спрятать её умеет только none.', 'The ad is still visible. Only none can hide it.'),
    drill: L3("endi obuna xabarini yashiradigan qoidani tuzating", 'теперь почини правило, которое прячет плашку подписки', 'now fix the rule that hides the subscribe box'),
    drillNo: L3("Obuna xabari hali ko'rinib turibdi. display uchun hidden degan so'z yo'q, none kerak.", 'Плашка подписки всё ещё видна. У display нет слова hidden, нужно none.', 'The subscribe box is still visible. display has no word hidden, you need none.')
  },
  t5: {
    eyebrow: L3("Mening kinoteatrim", 'Мой кинотеатр', 'My cinema'),
    say: L3("To'rtta sahifa yonib turibdi! Oxirgisi sizniki: o'z kinoteatringizning bosh sahifasi. Menyu havolalarini bir xil kenglikdagi tugmalar qiling va ularga o'zingiz yoqtirgan fon rangini bering. Reklamani esa yashiring, uning klassi reklama. Oyna ostida nima tayyorligi ko'rinib turadi.",
      'Четыре страницы горят! Последняя — твоя: главная страница твоего кинотеатра. Сделай ссылки меню кнопками одной ширины и дай им фон любимого цвета. А рекламу спрячь, её класс — reklama. Под окном видно, что уже готово.',
      'Four pages are lit! The last one is yours: the home page of your own cinema. Turn the menu links into buttons of the same width and give them your favorite background color. And hide the ad, its class is reklama. Under the window you can see what’s done.'),
    ask: L3("Menyuni tugmalar qiling, reklamani yashiring", 'Сделай меню из кнопок и спрячь рекламу', 'Make a button menu and hide the ad'),
    ok: L3("Ura! Kinoteatringiz sayti tayyor: tugmalar teng, reklama yo'q!", 'Ура! Сайт твоего кинотеатра готов: кнопки ровные, рекламы нет!', 'Hooray! Your cinema’s website is ready: neat buttons and no ads!'),
    hints: [
      L3("Ikkita qoida kerak: biri havolalar uchun, biri reklama uchun. Havolalar a teglari, reklamaning klassi esa reklama.", 'Нужны два правила: одно для ссылок, другое для рекламы. Ссылки — это теги a, а класс рекламы — reklama.', 'You need two rules: one for the links, one for the ad. The links are a tags, and the ad’s class is reklama.'),
      L3("Havolalar uchun selektor a: display inline-block, width va background-color. Reklama uchun selektor reklama, oldida nuqta, qiymati esa none.", 'Для ссылок селектор a: display inline-block, width и background-color. Для рекламы селектор reklama с точкой, а значение — none.', 'For the links, the selector is a: display inline-block, width and background-color. For the ad, the selector is reklama with a dot, and the value is none.'),
      L3("Namuna kod ostida: boshqa qiymatlar bilan ikkita qoida. O'zingizga yoqqan kenglik va rangni tanlang.", 'Образец под кодом — два правила с другими значениями. Выбери свою ширину и цвет.', 'The example under the code has two rules with other values. Pick your own width and color.')
    ],
    gone: L3("none bilan menyu yo'qoldi. Havolalar ko'rinib tursin: inline-block yozing.", 'С none меню пропало. Ссылки должны быть видны: напиши inline-block.', 'With none the menu disappeared. The links should be visible: write inline-block.'),
    block: L3("Tugmalar ustma-ust bo'lib qoldi. Ular yonma-yon tursin: inline-block yozing.", 'Кнопки встали друг под другом. Пусть стоят рядом: напиши inline-block.', 'The buttons stacked up. Let them sit side by side: write inline-block.'),
    needIb: L3("Havolalar hali inline, ularga kenglik ishlamaydi. Havolalar uchun display inline-block yozing.", 'Ссылки пока строчные, ширина на них не действует. Напиши для ссылок display inline-block.', 'The links are still inline, so width doesn’t work on them. Write display inline-block for the links.'),
    needW: L3("Tugmalar hali har xil: havolalarga width yozing, son va px.", 'Кнопки пока разные: напиши для ссылок width, число и px.', 'The buttons are still uneven: write width for the links, a number and px.'),
    needBg: L3("Tugmalarga o'z rangingizni bering: background-color yozing.", 'Дай кнопкам свой цвет: напиши background-color.', 'Give the buttons your own color: write background-color.'),
    needAd: L3("Reklama hali ko'rinib turibdi: reklama klassiga display none yozing.", 'Реклама всё ещё видна: напиши для класса reklama display none.', 'The ad is still visible: write display none for the reklama class.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Kinoteatrning beshta sahifasi ham yana tartibli! Hammasini siz yozgan display qildi.", 'Все пять страниц кинотеатра снова в порядке! Всё это сделал display, написанный твоими руками.', 'All five cinema pages are in order again! The display code you wrote did all of it.') },
      { k: 'a', text: L3("block elementni yangi qatorga qo'yadi: u quti kabi butun qatorni egallaydi.", 'block ставит элемент на новую строку: он, как коробка, занимает всю строку.', 'block puts an element on a new line: like a box, it takes the whole line.') },
      { k: 'b', text: L3("inline-block yonma-yon turadi va kenglikni ham oladi. Oddiy inline elementga esa width ishlamaydi.", 'inline-block стоит рядом и принимает ширину. А на обычный строчный элемент width не действует.', 'inline-block sits side by side and accepts a width. But width doesn’t work on a plain inline element.') },
      { k: 'c', text: L3("none elementni butunlay yashiradi, joyini ham qoldirmaydi.", 'none прячет элемент совсем, даже места не оставляет.', 'none hides an element completely, without leaving any space.') },
      { k: 'd', text: L3("Buzilgan joylarni ham topasiz: chiziqchasiz yozilgan inline block va display bilmaydigan hidden so'zi.", 'И находишь поломки: inline block без чёрточки и hidden, которого у display нет.', 'And you find broken spots: inline block without a dash, and hidden, which display doesn’t have.') },
      { k: null, text: L3("Keyingi darsda Flexbox bilan tanishamiz: u elementlarni qatorga yoki ustunga juda oson teradi. Ko'rishguncha!", 'На следующем уроке познакомимся с Flexbox: он очень легко ставит элементы в ряд или в столбик. До встречи!', 'Next lesson we’ll meet Flexbox: it lines elements up in a row or a column very easily. See you!') }
    ],
    roles: {
      a: L3("block — yangi qatordan", 'block — с новой строки', 'block — on a new line'),
      b: L3("inline-block — yonma-yon va width", 'inline-block — рядом и с width', 'inline-block — side by side, with width'),
      c: L3("none — yashirin", 'none — спрятан', 'none — hidden'),
      d: L3("tuzatish: inline-block, none", 'починка: inline-block, none', 'fixing: inline-block, none')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};
