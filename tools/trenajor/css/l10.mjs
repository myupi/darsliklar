// =============================================================================
// БАНК ТРЕНАЖЁРА CSS · урок 10 «Flexbox: расположение элементов» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard)
// + 3 «впиши ответ» (q12–q14). Игровые: q15–q16 «собери», q17 «найди ошибку», q18 «нажми на странице».
// Проверяем: display: flex пишут коробке-родителю (не детям, не li, а ul); без flex-direction — row, слева направо;
// flex действует только на детей, не на внуков; row-reverse — первый справа; главная ось — куда выстраиваются дети,
// поперечная — поперёк (reverse её не разворачивает); дети тянутся по поперечной оси (в column — по ширине);
// flex-direction без display: flex и у детей не работает; опечатка colum.
// Ситуации тестов курса (tools/webtest/css/l10.jsx) не повторяются. Формат — FORMAT.md. Апостроф в узбекском — ASCII «'».
// Словарь урока: ota quti, bolalar, javon, kartochka, qator, ustun, yo'nalish, asosiy o'q, ko'ndalang o'q, cho'zilish.
// =============================================================================

// Основа страниц (невидима ученику): полка и карточки — чтобы раскладка читалась и в уменьшенном окне.
const SHELF = '.javon{background:#FFF1EC;border:2px dashed #FDBA74;padding:6px}'
  + '.karta{background:#FA4F28;color:#fff;font:bold 15px Arial;padding:8px 10px;margin:3px;border-radius:8px}';
const cards = (cls, a, b, c) => `<div class="${cls}">\n  <div class="karta">${a}</div>\n  <div class="karta">${b}</div>\n  <div class="karta">${c}</div>\n</div>`;

export default [
  {
    id: 'css_l10_q01',
    difficulty: 'easy',
    tags: ['display', 'flex'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: ".koinot qutisida uchta sayyora bor: uchta div. Qutiga faqat display: flex yozildi.",
      q: 'Sayyoralar qanday tiziladi?',
      opts: ["Qatorga, chapdan o'ngga", 'Ustunga, tepadan pastga', "Qatorga, o'ngdan chapga", 'Ustunga, pastdan tepaga'],
      why: "Ota qutiga display: flex yozilsa, bolalar qatorga tiziladi. flex-direction yozilmagan bo'lsa, u odatda row bo'ladi, ya'ni chapdan o'ngga.",
    },
    ru: {
      ctx: 'В коробке .koinot три планеты — три div. Коробке написали только display: flex.',
      q: 'Как выстроятся планеты?',
      opts: ['В ряд, слева направо', 'Столбиком, сверху вниз', 'В ряд, справа налево', 'Столбиком, снизу вверх'],
      why: 'Когда коробке-родителю пишут display: flex, дети встают в ряд. Если flex-direction не написан, он по умолчанию row — слева направо.',
    },
    en: {
      ctx: 'The .koinot box holds three planets, three divs. The box only got display: flex.',
      q: 'How will the planets line up?',
      opts: ['In a row, left to right', 'In a column, top to bottom', 'In a row, right to left', 'In a column, bottom to top'],
      why: 'When the parent box gets display: flex, the children line up in a row. Without flex-direction it’s row by default: left to right.',
    },
  },
  {
    id: 'css_l10_q02',
    difficulty: 'easy',
    tags: ['flex', 'parent'],
    mono: true,
    sort: false,
    vis: {
      html: {
        uz: '<ul>\n  <li>Bosh sahifa</li>\n  <li>Smenalar</li>\n  <li>Aloqa</li>\n</ul>',
        ru: '<ul>\n  <li>Главная</li>\n  <li>Смены</li>\n  <li>Контакты</li>\n</ul>',
        en: '<ul>\n  <li>Home</li>\n  <li>Sessions</li>\n  <li>Contact</li>\n</ul>',
      },
      base: 'ul{background:#FFF1EC;border:2px dashed #FDBA74;padding:6px 6px 6px 28px;margin:0}'
        + 'li{background:#FFE4D6;padding:5px 8px;margin:3px;border-radius:6px}',
    },
    uz: {
      ctx: "Lager saytining menyusi ustun bo'lib turibdi. Bandlar qatorga tizilishi kerak.",
      q: 'Qaysi qoida ularni qatorga qo\'yadi?',
      opts: ['ul { display: flex; }', 'li { display: flex; }', 'li { flex-direction: row; }', 'ul { display: row; }'],
      why: "display: flex bolalarni o'rab turgan ota qutiga yoziladi. li bandlari ul ichida turibdi, demak qoida ul tegiga yoziladi.",
    },
    ru: {
      ctx: 'Меню сайта лагеря стоит столбиком. Пункты должны встать в ряд.',
      q: 'Какое правило поставит их в ряд?',
      opts: ['ul { display: flex; }', 'li { display: flex; }', 'li { flex-direction: row; }', 'ul { display: row; }'],
      why: 'display: flex пишут коробке-родителю, которая обнимает детей. Пункты li лежат внутри ul — значит, правило пишут для ul.',
    },
    en: {
      ctx: 'The camp site menu stands in a column. The items must line up in a row.',
      q: 'Which rule puts them in a row?',
      opts: ['ul { display: flex; }', 'li { display: flex; }', 'li { flex-direction: row; }', 'ul { display: row; }'],
      why: 'display: flex goes on the parent box that holds the children. The li items sit inside ul, so the rule is written for ul.',
    },
  },
  {
    id: 'css_l10_q03',
    difficulty: 'easy',
    tags: ['main-axis'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Flex qutida to'q sariq strelka bor: bu asosiy o'q.",
      q: "Asosiy o'q nimani ko'rsatadi?",
      opts: ['Bolalar qaysi tomonga tizilishini', "Bolalar qaysi tomonga cho'zilishini", 'Qutining eng uzun tomonini', 'Sahifa qayerda tugashini'],
      why: "Asosiy o'q flex-direction bo'yicha ketadi: bolalar shu tomonga navbat bilan tiziladi. Cho'zilish esa ko'ndalang o'q bo'ylab bo'ladi.",
    },
    ru: {
      ctx: 'У flex-коробки есть оранжевая стрелка — главная ось.',
      q: 'Что показывает главная ось?',
      opts: ['Куда выстраиваются дети', 'Куда вытягиваются дети', 'Где у коробки длинная сторона', 'Где заканчивается страница'],
      why: 'Главная ось идёт по flex-direction: в эту сторону дети выстраиваются друг за другом. А вытягиваются они по поперечной оси.',
    },
    en: {
      ctx: 'A flex box has an orange arrow: the main axis.',
      q: 'What does the main axis show?',
      opts: ['Which way the children line up', 'Which way the children stretch', 'Where the box’s long side is', 'Where the page ends'],
      why: 'The main axis follows flex-direction: the children line up one after another that way. They stretch along the cross axis instead.',
    },
  },
  {
    id: 'css_l10_q04',
    difficulty: 'easy',
    tags: ['row-reverse'],
    mono: false,
    sort: false,
    vis: { css: '.sayyoralar {\n  display: flex;\n  flex-direction: row-reverse;\n}' },
    uz: {
      ctx: 'HTML kodida sayyoralar shu tartibda: Merkuriy, Venera, Yer.',
      q: "Qaysi sayyora o'ng chetda turadi?",
      opts: ['Merkuriy', 'Yer', 'Venera', 'Hech biri: ular ustun bo\'ladi'],
      why: "row-reverse — teskari qator: birinchi bola o'ng chetga turadi, qolganlari undan chapga. HTML kodida birinchi Merkuriy.",
    },
    ru: {
      ctx: 'В HTML планеты идут так: Меркурий, Венера, Земля.',
      q: 'Какая планета окажется у правого края?',
      opts: ['Меркурий', 'Земля', 'Венера', 'Никакая: встанут столбиком'],
      why: 'row-reverse — ряд наоборот: первый ребёнок встаёт у правого края, остальные — левее. В HTML первым идёт Меркурий.',
    },
    en: {
      ctx: 'In the HTML the planets go like this: Mercury, Venus, Earth.',
      q: 'Which planet ends up at the right edge?',
      opts: ['Mercury', 'Earth', 'Venus', 'None: they form a column'],
      why: 'row-reverse is a reversed row: the first child stands at the right edge, the others to its left. Mercury comes first in the HTML.',
    },
  },
  {
    id: 'css_l10_q05',
    difficulty: 'medium',
    tags: ['flex', 'parent'],
    mono: false,
    sort: false,
    vis: {
      css: '.karta {\n  display: flex;\n}',
      html: {
        uz: cards('javon', 'Gitara', 'Baraban', 'Pianino'),
        ru: cards('javon', 'Гитара', 'Барабан', 'Пианино'),
        en: cards('javon', 'Guitar', 'Drums', 'Piano'),
      },
      base: SHELF,
    },
    uz: {
      ctx: "Musiqa do'koni: Kodi har bir kartochkaga display: flex yozdi, lekin ular qatorga tizilmadi.",
      q: "Nega kartochkalar ustun bo'lib qoldi?",
      opts: ['flex bolalarga yozilgan, javonga emas', 'flex-direction: row yozilmagan', 'display: flexbox yozish kerak edi', 'Kartochkalar juda keng'],
      why: "display: flex ota qutiga yoziladi, shunda uning bolalari qatorga tiziladi. Bu yerda flex kartochkalarning o'ziga yozilgan, javon esa oddiy blok bo'lib qolgan.",
    },
    ru: {
      ctx: 'Музыкальный магазин: Коди написал display: flex каждой карточке, но они не встали в ряд.',
      q: 'Почему карточки остались столбиком?',
      opts: ['flex написан детям, а не полке', 'Не написан flex-direction: row', 'Нужно было display: flexbox', 'Карточки слишком широкие'],
      why: 'display: flex пишут коробке-родителю, тогда её дети встают в ряд. Здесь flex написан самим карточкам, а полка осталась обычным блоком.',
    },
    en: {
      ctx: 'A music shop: Kodi wrote display: flex on every card, but they didn’t line up in a row.',
      q: 'Why did the cards stay in a column?',
      opts: ['flex is on the children, not the shelf', 'flex-direction: row is missing', 'It should be display: flexbox', 'The cards are too wide'],
      why: 'display: flex goes on the parent box, and then its children line up in a row. Here flex is on the cards themselves, and the shelf stayed a plain block.',
    },
  },
  {
    id: 'css_l10_q06',
    difficulty: 'medium',
    tags: ['flex-direction', 'display'],
    mono: false,
    sort: false,
    vis: {
      css: '.start {\n  flex-direction: row;\n}',
      html: {
        uz: '<div class="start">\n  <div class="raketa">Raketa 1</div>\n  <div class="raketa">Raketa 2</div>\n  <div class="raketa">Raketa 3</div>\n</div>',
        ru: '<div class="start">\n  <div class="raketa">Ракета 1</div>\n  <div class="raketa">Ракета 2</div>\n  <div class="raketa">Ракета 3</div>\n</div>',
        en: '<div class="start">\n  <div class="raketa">Rocket 1</div>\n  <div class="raketa">Rocket 2</div>\n  <div class="raketa">Rocket 3</div>\n</div>',
      },
      base: '.start{background:#EEF2FF;border:2px dashed #A5B4FC;padding:6px}'
        + '.raketa{background:#6366F1;color:#fff;font:bold 15px Arial;padding:8px 10px;margin:3px;border-radius:8px}',
    },
    uz: {
      ctx: "Uchta raketa start maydonida qatorga tizilishi kerak edi, lekin ustma-ust turibdi.",
      q: 'Nega flex-direction ishlamadi?',
      opts: ["Maydonga display: flex yozilmagan", 'row emas, column kerak edi', 'row raketalarga yoziladi', "Maydonning balandligi yetmaydi"],
      why: "flex-direction faqat flex qutida ishlaydi. display: flex yozilmagan bo'lsa, quti oddiy blok bo'lib qoladi va yo'nalishni eshitmaydi.",
    },
    ru: {
      ctx: 'Три ракеты на стартовой площадке должны были встать в ряд, а стоят друг под другом.',
      q: 'Почему flex-direction не сработал?',
      opts: ['Площадке не написан display: flex', 'Нужно column, а не row', 'row пишут самим ракетам', 'Площадке не хватает высоты'],
      why: 'flex-direction работает только во flex-коробке. Без display: flex площадка остаётся обычным блоком и направление не слушает.',
    },
    en: {
      ctx: 'Three rockets on the launch pad were supposed to line up in a row, but they’re stacked.',
      q: 'Why didn’t flex-direction work?',
      opts: ['The pad has no display: flex', 'It needs column, not row', 'row goes on the rockets', 'The pad isn’t tall enough'],
      why: 'flex-direction only works in a flex box. Without display: flex the pad stays a plain block and ignores the direction.',
    },
  },
  {
    id: 'css_l10_q07',
    difficulty: 'medium',
    tags: ['cross-axis', 'row-reverse'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Javonda flex-direction: row-reverse, ya'ni asosiy o'q o'ngdan chapga ketadi.",
      q: "Ko'ndalang o'q qaysi tomonga qaraydi?",
      opts: ['Tepadan pastga ↓', "Chapdan o'ngga →", 'Pastdan tepaga ↑', "O'ngdan chapga ←"],
      why: "reverse faqat asosiy o'qni teskari qiladi. Ko'ndalang o'q qatorga ko'ndalang ketadi va oddiy row bo'lgandagidek tepadan pastga qaraydi.",
    },
    ru: {
      ctx: 'У полки flex-direction: row-reverse — главная ось идёт справа налево.',
      q: 'Куда смотрит поперечная ось?',
      opts: ['Сверху вниз ↓', 'Слева направо →', 'Снизу вверх ↑', 'Справа налево ←'],
      why: 'reverse разворачивает только главную ось. Поперечная идёт поперёк ряда и смотрит сверху вниз — так же, как у обычного row.',
    },
    en: {
      ctx: 'The shelf has flex-direction: row-reverse, so the main axis runs right to left.',
      q: 'Which way does the cross axis point?',
      opts: ['Top to bottom ↓', 'Left to right →', 'Bottom to top ↑', 'Right to left ←'],
      why: 'reverse only flips the main axis. The cross axis runs across the row and points top to bottom, just like with a plain row.',
    },
  },
  {
    id: 'css_l10_q08',
    difficulty: 'medium',
    tags: ['flex-direction', 'main-axis'],
    mono: true,
    sort: false,
    vis: null,
    uz: {
      ctx: "Javonning asosiy o'qi pastdan tepaga qaraydi ↑.",
      q: 'Javonda qaysi flex-direction turibdi?',
      opts: ['column-reverse', 'column', 'row-reverse', 'row'],
      why: "Tepadan pastga — column, teskarisi, ya'ni pastdan tepaga — column-reverse. row va row-reverse esa bolalarni qatorga qo'yadi.",
    },
    ru: {
      ctx: 'Главная ось полки смотрит снизу вверх ↑.',
      q: 'Какой flex-direction у полки?',
      opts: ['column-reverse', 'column', 'row-reverse', 'row'],
      why: 'Сверху вниз — column, а наоборот, снизу вверх, — column-reverse. row и row-reverse ставят детей в ряд.',
    },
    en: {
      ctx: 'The shelf’s main axis points from bottom to top ↑.',
      q: 'Which flex-direction does the shelf have?',
      opts: ['column-reverse', 'column', 'row-reverse', 'row'],
      why: 'Top to bottom is column, and the reverse, bottom to top, is column-reverse. row and row-reverse put the children in a row.',
    },
  },
  {
    id: 'css_l10_q09',
    difficulty: 'medium',
    tags: ['flex', 'children'],
    mono: false,
    sort: false,
    vis: { css: '.javon {\n  display: flex;\n}' },
    uz: {
      ctx: "Javonda hayvon kartochkalari bor. Har bir kartochkada rasm, uning ostida esa p tegida nomi.",
      q: 'Kartochka ichidagi rasm va nom endi qanday turadi?',
      opts: ['Avvalgidek, biri ostida biri', 'Ular ham qatorga tiziladi', "Nom rasmning chap tomoniga o'tadi", "Ikkalasi javon bo'ylab cho'ziladi"],
      why: "display: flex faqat javonning bolalariga, ya'ni kartochkalarga ta'sir qiladi. Rasm va nom kartochkaning bolalari, javonniki emas, shuning uchun joyida qoladi.",
    },
    ru: {
      ctx: 'На полке карточки зверей. В каждой карточке картинка, а под ней название (p).',
      q: 'Как теперь стоят картинка и название внутри карточки?',
      opts: ['Как раньше, одно под другим', 'Тоже встали в ряд', 'Название ушло левее картинки', 'Оба растянулись по всей полке'],
      why: 'display: flex действует только на детей полки — на карточки. Картинка и название — дети карточки, а не полки, поэтому они остались на месте.',
    },
    en: {
      ctx: 'The shelf holds animal cards. Each card has a picture with its name (p) under it.',
      q: 'How do the picture and the name inside a card stand now?',
      opts: ['As before, one under the other', 'They line up in a row too', 'The name moves left of the picture', 'Both stretch across the shelf'],
      why: 'display: flex only affects the shelf’s children, the cards. The picture and the name are the card’s children, not the shelf’s, so they stay put.',
    },
  },
  {
    id: 'css_l10_q10',
    difficulty: 'hard',
    tags: ['cross-axis', 'stretch'],
    mono: false,
    sort: false,
    vis: {
      css: 'nav {\n  display: flex;\n  flex-direction: column;\n}',
      html: '<nav>\n  <a href="pop.html">Pop</a>\n  <a href="rok.html">Rock</a>\n  <a href="jazz.html">Jazz</a>\n</nav>',
      base: 'nav{width:220px;background:#F5F3FF;border:2px dashed #C4B5FD;padding:6px}'
        + 'a{background:#FA4F28;color:#fff;font:bold 15px Arial;text-decoration:none;padding:6px 10px;margin:3px;border-radius:6px}',
    },
    uz: {
      ctx: "Musiqa sayti: menyu havolalari ustun bo'lib turdi va menyuning butun eniga cho'zildi.",
      q: "Nega havolalar eniga cho'zildi?",
      opts: ["Ular ko'ndalang o'q bo'ylab cho'ziladi", 'column havolalarni abzasga aylantiradi', 'Havolalarga width yozilgan', "Asosiy o'q bolalarni cho'zadi"],
      why: "Ustunda ko'ndalang o'q chapdan o'ngga ketadi. Flex qutining bolalari shu o'q bo'ylab o'zi cho'ziladi, shuning uchun havolalar menyuning butun enini egalladi.",
    },
    ru: {
      ctx: 'Музыкальный сайт: ссылки меню встали столбиком и вытянулись во всю ширину меню.',
      q: 'Почему ссылки вытянулись по ширине?',
      opts: ['Они тянутся по поперечной оси', 'column превращает ссылки в абзацы', 'Ссылкам написан width', 'Главная ось растягивает детей'],
      why: 'В столбике поперечная ось идёт слева направо. Вдоль неё дети flex-коробки сами вытягиваются, поэтому ссылки заняли всю ширину меню.',
    },
    en: {
      ctx: 'A music site: the menu links stand in a column and stretched to the menu’s full width.',
      q: 'Why did the links stretch sideways?',
      opts: ['They stretch along the cross axis', 'column turns links into paragraphs', 'The links have a width', 'The main axis stretches children'],
      why: 'In a column the cross axis runs left to right. Flex children stretch along it by themselves, so the links took the menu’s full width.',
    },
  },
  {
    id: 'css_l10_q11',
    difficulty: 'hard',
    tags: ['flex-direction', 'parent'],
    mono: false,
    sort: false,
    vis: {
      css: '.javon {\n  display: flex;\n}\n.karta {\n  flex-direction: column;\n}',
      html: {
        uz: cards('javon', 'Komediya', 'Ertak', 'Kosmos'),
        ru: cards('javon', 'Комедия', 'Сказка', 'Космос'),
        en: cards('javon', 'Comedy', 'Fairy tale', 'Space'),
      },
      base: SHELF,
    },
    uz: {
      ctx: "Kino afishalari ustun bo'lib turishi kerak. Kodi kartochkalarga flex-direction: column yozdi.",
      q: 'Nega afishalar qatorda qoldi?',
      opts: ["Yo'nalish ham javonga yoziladi", 'Kartochkalarga display: flex kerak', 'column qator yasaydi, ustun emas', 'flex-direction faqat row bilan ishlaydi'],
      why: "flex-direction ham display: flex kabi ota qutiga yoziladi va bolalarning yo'nalishini beradi. Kartochkalarning o'zi flex quti emas, shuning uchun bu qoida hech narsa qilmaydi.",
    },
    ru: {
      ctx: 'Афиши кино должны стоять столбиком. Коди написал карточкам flex-direction: column.',
      q: 'Почему афиши остались в ряд?',
      opts: ['Направление тоже пишут полке', 'Карточкам нужен display: flex', 'column ставит в ряд, а не столбиком', 'flex-direction работает только с row'],
      why: 'flex-direction, как и display: flex, пишут коробке-родителю: он задаёт направление её детям. Сами карточки не flex-коробки, поэтому правило ничего не делает.',
    },
    en: {
      ctx: 'The movie posters should stand in a column. Kodi gave the cards flex-direction: column.',
      q: 'Why did the posters stay in a row?',
      opts: ['The direction goes on the shelf too', 'The cards need display: flex', 'column makes a row, not a column', 'flex-direction only works with row'],
      why: 'Like display: flex, flex-direction goes on the parent box and sets its children’s direction. The cards themselves aren’t flex boxes, so the rule does nothing.',
    },
  },
  // ---- «Впиши ответ» (type: 'input') ----
  {
    id: 'css_l10_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['display', 'flex'],
    mono: true,
    answer: ['flex'],
    vis: {
      css: '.oyinlar {\n  display: ___;\n}',
      html: {
        uz: cards('oyinlar', 'Poyga', 'Labirint', 'Shaxmat'),
        ru: cards('oyinlar', 'Гонки', 'Лабиринт', 'Шахматы'),
        en: cards('oyinlar', 'Racing', 'Maze', 'Chess'),
      },
      base: '.oyinlar{background:#ECFDF5;border:2px dashed #6EE7B7;padding:6px}'
        + '.karta{background:#059669;color:#fff;font:bold 15px Arial;padding:8px 10px;margin:3px;border-radius:8px}',
    },
    uz: {
      ctx: "O'yinlar do'koni: o'yin kartochkalari ustma-ust turibdi. Ular qatorga tizilsin.",
      q: "Bo'sh joyga display qiymatini yozing.",
      why: "flex qiymati qutini moslashuvchan qiladi: uning bolalari bir qatorga tiziladi. Flexbox — usulning nomi, qiymat esa qisqa: flex.",
    },
    ru: {
      ctx: 'Магазин игр: карточки игр стоят друг под другом. Они должны встать в ряд.',
      q: 'Впиши на пустое место значение display.',
      why: 'Значение flex делает коробку гибкой: её дети встают в ряд. Flexbox — название способа, а значение короче: flex.',
    },
    en: {
      ctx: 'A game shop: the game cards are stacked. They should line up in a row.',
      q: 'Type the display value in the empty spot.',
      why: 'The value flex makes the box flexible: its children line up in a row. Flexbox is the name of the technique, and the value is shorter: flex.',
    },
  },
  {
    id: 'css_l10_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['row-reverse'],
    mono: true,
    answer: ['row-reverse'],
    vis: {
      css: '.qator {\n  display: flex;\n  flex-direction: ___;\n}',
      html: '<div class="qator">\n  <div class="joy">1</div>\n  <div class="joy">2</div>\n  <div class="joy">3</div>\n  <div class="joy">4</div>\n</div>',
      base: '.qator{background:#FEF2F2;border:2px dashed #FCA5A5;padding:6px}'
        + '.joy{width:36px;height:32px;line-height:32px;text-align:center;background:#DC2626;color:#fff;font:bold 15px Arial;margin:3px;border-radius:10px 10px 4px 4px}',
      goal: '.qator { display: flex; flex-direction: row-reverse; }',
    },
    uz: {
      ctx: "Kinoteatrda o'rindiqlar o'ngdan sanaladi: 1-o'rindiq o'ng devor yonida.",
      q: "Rasmdagidek bo'lishi uchun flex-direction qiymatini yozing.",
      why: "Bu qator, lekin birinchi o'rindiq o'ngda. Demak row-reverse: o'rindiqlar o'ngdan chapga tiziladi.",
    },
    ru: {
      ctx: 'В кинотеатре места считают справа: место 1 — у правой стены.',
      q: 'Впиши значение flex-direction, чтобы стало как на картинке.',
      why: 'Это ряд, но первое место справа. Значит, row-reverse: места выстраиваются справа налево.',
    },
    en: {
      ctx: 'In the cinema seats are counted from the right: seat 1 is by the right wall.',
      q: 'Type the flex-direction value to make it look like the picture.',
      why: 'It’s a row, but the first seat is on the right. So it’s row-reverse: the seats line up from right to left.',
    },
  },
  {
    id: 'css_l10_q14',
    type: 'input',
    difficulty: 'medium',
    tags: ['flex-direction'],
    mono: true,
    answer: ['flex-direction'],
    vis: { css: '.raketalar {\n  display: flex;\n  ___: column-reverse;\n}' },
    uz: {
      ctx: "Raketalar ustun bo'lib tursin, birinchisi esa pastda, startda.",
      q: "Yo'nalishni beradigan xususiyat nomini yozing.",
      why: "Yo'nalishni flex-direction beradi: row, column va ularning teskarisi. column-reverse ustunni pastdan tepaga quradi.",
    },
    ru: {
      ctx: 'Ракеты должны стоять столбиком, а первая — внизу, на старте.',
      q: 'Впиши имя свойства, которое задаёт направление.',
      why: 'Направление задаёт flex-direction: row, column и их обратные варианты. column-reverse строит столбик снизу вверх.',
    },
    en: {
      ctx: 'The rockets should stand in a column, with the first one at the bottom, on the launch pad.',
      q: 'Type the name of the property that sets the direction.',
      why: 'The direction is set by flex-direction: row, column and their reversed versions. column-reverse builds the column from the bottom up.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'css_l10_q15',
    type: 'build',
    difficulty: 'easy',
    tags: ['flex-direction', 'column'],
    pieces: ['flex-direction', ': ', 'column', ';'],
    extra: ['colum', 'row'],
    vis: { css: 'nav {\n  display: flex;\n  ___\n}' },
    uz: {
      ctx: "Kafe saytining menyusi qatorda turibdi. Havolalar ustun bo'lib tursin.",
      q: "Bo'laklarni tartib bilan bosib, yo'nalishni yig'ing",
      why: "Yo'nalishni flex-direction beradi, ustun esa column, oxirida n harfi bilan. row qatorni qoldiradi, colum so'zini esa brauzer tanimaydi.",
    },
    ru: {
      ctx: 'Меню сайта кафе стоит в ряд. Ссылки должны встать столбиком.',
      q: 'Нажимай кусочки по порядку и собери направление',
      why: 'Направление задаёт flex-direction, а столбик — column, с буквой n на конце. row оставит ряд, а слово colum браузер не знает.',
    },
    en: {
      ctx: 'The café site menu stands in a row. The links should form a column.',
      q: 'Tap the pieces in order to build the direction',
      why: 'The direction is set by flex-direction, and a column is column, with an n at the end. row keeps the row, and the browser doesn’t know colum.',
    },
  },
  {
    id: 'css_l10_q16',
    type: 'build',
    difficulty: 'medium',
    tags: ['flex', 'parent'],
    pieces: ['.javon', ' {'],
    extra: ['.karta', 'javon', '#javon'],
    vis: { css: '___\n  display: flex;\n}' },
    uz: {
      ctx: "Kartochkalar javon klassli quti ichida turibdi. Ular qatorga tizilsin.",
      q: "Bo'laklarni bosib, qoidaning boshini yig'ing",
      why: "display: flex kartochkalarga emas, ularni o'rab turgan javonga yoziladi. class selektori nuqta bilan boshlanadi: .javon. # belgisi esa id uchun.",
    },
    ru: {
      ctx: 'Карточки лежат в коробке с классом javon. Они должны встать в ряд.',
      q: 'Нажимай кусочки и собери начало правила',
      why: 'display: flex пишут не карточкам, а полке, которая их обнимает. Селектор класса начинается с точки: .javon. Знак # — для id.',
    },
    en: {
      ctx: 'The cards sit in a box with the class javon. They should line up in a row.',
      q: 'Tap the pieces to build the start of the rule',
      why: 'display: flex goes not on the cards but on the shelf that holds them. A class selector starts with a dot: .javon. The # sign is for id.',
    },
  },
  {
    id: 'css_l10_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['flex-direction', 'column'],
    line: 3,
    vis: {
      css: 'nav {\n  display: flex;\n  flex-direction: colum;\n}\na { padding: 6px; }',
      html: {
        uz: '<nav>\n  <a href="jamoa.html">Jamoa</a>\n  <a href="oyin.html">O\'yinlar</a>\n  <a href="chipta.html">Chiptalar</a>\n</nav>',
        ru: '<nav>\n  <a href="jamoa.html">Команда</a>\n  <a href="oyin.html">Матчи</a>\n  <a href="chipta.html">Билеты</a>\n</nav>',
        en: '<nav>\n  <a href="jamoa.html">Team</a>\n  <a href="oyin.html">Matches</a>\n  <a href="chipta.html">Tickets</a>\n</nav>',
      },
      base: 'nav{background:#ECFDF5;border:2px dashed #6EE7B7;padding:6px}'
        + 'a{background:#059669;color:#fff;font:bold 15px Arial;text-decoration:none;margin:3px;border-radius:6px}',
    },
    uz: {
      ctx: "Futbol klubi menyusi ustun bo'lib turishi kerak, lekin havolalar yonma-yon turibdi.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "3-qatorda column so'zidan n harfi tushib qolgan. Brauzer colum so'zini tanimaydi va bu yozuvni tashlab yuboradi, shuning uchun havolalar yonma-yon qoldi.",
    },
    ru: {
      ctx: 'Меню футбольного клуба должно стоять столбиком, а ссылки стоят рядом.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 3 у слова column пропала буква n. Браузер не знает слово colum и выбрасывает эту строку, поэтому ссылки остались в ряд.',
    },
    en: {
      ctx: 'The football club menu should stand in a column, but the links sit side by side.',
      q: 'Which line has the mistake? Tap that line',
      why: 'On line 3 the word column lost its n. The browser doesn’t know colum and throws the line away, so the links stayed in a row.',
    },
  },
  {
    id: 'css_l10_q18',
    type: 'tap',
    difficulty: 'medium',
    tags: ['flex-direction', 'column'],
    answer: 'col',
    vis: {
      css: '.sevimli {\n  display: flex;\n  flex-direction: column;\n}',
      html: '<div class="p r" data-t="row">\n  <div class="k">1</div><div class="k">2</div><div class="k">3</div>\n</div>\n'
        + '<div class="p cr" data-t="colrev">\n  <div class="k">1</div><div class="k">2</div><div class="k">3</div>\n</div>\n'
        + '<div class="p sevimli" data-t="col">\n  <div class="k">1</div><div class="k">2</div><div class="k">3</div>\n</div>\n'
        + '<div class="p rr" data-t="rowrev">\n  <div class="k">1</div><div class="k">2</div><div class="k">3</div>\n</div>',
      base: 'body{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}'
        + '.p{width:136px;background:#FFF1EC;border:2px dashed #FDBA74;padding:4px}'
        + '.k{background:#FA4F28;color:#fff;font:bold 14px Arial;text-align:center;padding:4px 9px;margin:3px;border-radius:6px}'
        + '.r{display:flex}.rr{display:flex;flex-direction:row-reverse}.cr{display:flex;flex-direction:column-reverse}',
    },
    uz: {
      ctx: "Sahifada to'rtta javon bor. Shu qoida ulardan bittasiga yozilgan.",
      q: 'Bu qoida qaysi javonga yozilgan? Ustiga bosing',
      why: "column — ustun, birinchisi tepada: 1, 2, 3 tepadan pastga. column-reverse ham ustun, lekin unda birinchisi pastda turadi.",
    },
    ru: {
      ctx: 'На странице четыре полки. Это правило написано одной из них.',
      q: 'Какой полке написано это правило? Нажми на неё',
      why: 'column — столбик, первая карточка наверху: 1, 2, 3 сверху вниз. column-reverse тоже столбик, но первая там внизу.',
    },
    en: {
      ctx: 'The page has four shelves. This rule is written for one of them.',
      q: 'Which shelf has this rule? Tap it',
      why: 'column is a column with the first card on top: 1, 2, 3 from top to bottom. column-reverse is a column too, but there the first one is at the bottom.',
    },
  },
];
