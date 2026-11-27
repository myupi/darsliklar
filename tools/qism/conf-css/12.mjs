// Урок 12 курса CSS «Позиционирование» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 23 и 24.
// Часть 1 «relative и absolute» — s1…s7 + вывод E1 (разгадка про якорь: без relative у карточки метка улетает в угол страницы);
// часть 2 «fixed, отступы и поломки» — крючок H2 (длинный дневник, «поедем вниз») + s8…s15.
// Разгадка — в E1 (riddleInE1: true): её материал (absolute и якорь) целиком в части 1 (s5–s6). В S15 части 2 убираются обе
// реплики разгадки (riddle и riddle2): сборщик режет одну, вторую убирает правка h2Edits.
const rowsEdit = [
  "  const mine = OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + own[i] + '; }');\n  const rows = curK === 'riddle' ? [BADGE] : curK === 'riddle2' ? [REL, BADGE] : mine;   // в коде — свои строки ученика\n  const pageRules = riddle ? rows : OWN_GIVEN.concat(mine);   // на странице — и якорь с absolute\n"
];
const noOwn = ["  const store = useStore();\n  const own = [store.get('myTop') || '8px', store.get('myRight') || '8px', store.get('myBg') || 'gold'];\n", ''];
const brLine = "<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'belgi' : null })} rules={withBase(pageRules, 'card')} insp={riddle} /></Br>";
const chips = ["{['rel', 'abs', 'anchor', 'fix'].map((k) => (", "{['rel', 'abs', 'anchor'].map((k) => ("];

export default {
  s15Drop: ['riddle2'],   // вторая половина разгадки — тоже в выводе части 1
  course: 'css',
  dir: 'tools/css12',
  src: 'c12.src.jsx',
  screens: 'c12-screens.jsx',
  lessonId: 'css-12-pozicionirovanie',
  slug: 'pozicionirovanie',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: '23-dars. relative va absolute', ru: 'Урок 23. relative и absolute', en: 'Lesson 23. relative and absolute' },
    { uz: '24-dars. fixed, masofalar va nosozliklar', ru: 'Урок 24. fixed, отступы и поломки', en: 'Lesson 24. fixed, offsets and bugs' }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'CHECK-4', Comp: S13 },
  { id: 'w1', code: 'LEVEL-W', Comp: W1 },
  { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // В S1 части 1 («Dars oxirida uni sinab ko'ramiz») правок нет: в крючке только relative и absolute, fixed не упоминается.
  s1Done: null,
  e1: {
    eyebrow: { uz: "Joyiga o'tirdi", ru: 'Встала на место', en: 'In its place' },
    ask: { uz: "Belgi kartochka burchagida", ru: 'Метка в углу карточки', en: 'The badge is in the card’s corner' },
    next: { uz: 'Keyingi dars: fixed, masofalar va nosozliklar', ru: 'Следующий урок: fixed, отступы и поломки', en: 'Next lesson: fixed, offsets and bugs' },
    roles: true,
    say: [
      { k: 'riddle2', text: {
        uz: "Ana, belgi joyiga o'tirdi: kartochkaning tepa o'ng burchagida turibdi! Dars boshidagi hiylam esingizdami? Kartochkaga tegmay, faqat belgining o'ziga absolute yozsam ham u kartochka burchagiga chiqadi, deb o'ylagandim. Endi javobini bilamiz: yo'q, chiqmaydi. Hozir kartochkadagi relative qatorini olib tashlab, buni o'zingiz ko'rasiz.",
        ru: 'Смотри, метка встала на место: она в правом верхнем углу карточки! Помнишь мою задумку в начале урока? Я думал, что если написать absolute только метке и ничего не писать карточке, метка всё равно окажется в углу карточки. Теперь знаем ответ: нет, не окажется. Сейчас уберу у карточки строку с relative, и ты сам увидишь.',
        en: 'Look, the badge is in its place: the top right corner of the card! Remember my idea from the start of the lesson? I thought that if I wrote absolute only on the badge and nothing on the card, the badge would still land in the card’s corner. Now we know the answer: no, it won’t. I’ll remove the card’s relative line, and you’ll see it yourself.' } },
      { k: 'riddle', text: {
        uz: "Mana, relative qatori yo'q, belgi esa butun sahifaning burchagiga uchib ketdi! Men adashgan ekanman: belgini ushlab turadigan langar yo'q edi, shuning uchun u sahifaga yopishib oldi.",
        ru: 'Вот: строки с relative нет, и метка улетела в угол всей страницы! Я ошибся. Метку некому было держать, якоря нет, поэтому она прицепилась к странице.',
        en: 'There: no relative line, and the badge flew to the corner of the whole page! I was wrong. Nothing held the badge, there was no anchor, so it clung to the page.' } },
      { k: 'rel', text: {
        uz: "Eslaylik: relative bilan element o'z joyidan siljiydi, eski joyi esa bo'sh qoladi. top uni pastga, left esa o'ngga suradi.",
        ru: 'Вспомним: с relative элемент сдвигается от своего места, а прежнее место остаётся пустым. top толкает вниз, left — вправо.',
        en: 'Let’s recall: with relative an element moves from its own place and the old place stays empty. top pushes it down, left pushes it right.' } },
      { k: 'abs', text: {
        uz: "absolute esa elementni oqimdan chiqarib, burchakka qo'yadi, qo'shnilar uning joyini darrov egallab oladi.",
        ru: 'А absolute выводит элемент из потока и ставит в угол, соседи сразу занимают его место.',
        en: 'And absolute takes an element out of the flow and puts it in a corner, and the neighbors take its place right away.' } },
      { k: 'anchor', text: {
        uz: "Qaysi burchakka borishini esa langar hal qiladi: bu position yozilgan ota quti, masalan, relative yozilgan kartochka.",
        ru: 'А в какой именно угол — решает якорь: родитель с position, например карточка с relative.',
        en: 'And which corner it is decided by the anchor: a parent with position, for example the card with relative.' } },
      { k: null, text: {
        uz: "Hozircha hamma narsa sahifa bilan birga turibdi. Endi bitta savol: uzun sahifani pastga aylantirsak, belgi nima qiladi? Kartochka bilan birga ketadimi yoki oynada qolib ketadimi?",
        ru: 'Пока всё стоит вместе со страницей. А теперь вопрос: если прокрутить длинную страницу вниз, что сделает метка? Уедет вместе с карточкой или останется в окне?',
        en: 'So far everything stands together with the page. Now a question: if we scroll a long page down, what will the badge do? Will it go away with the card or stay in the window?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Pastga tushamiz', ru: 'Едем вниз', en: 'Scrolling down' },
    ask: { uz: "Kundalikning eng oxiridamiz", ru: 'Мы в самом конце дневника', en: 'We’re at the very end of the diary' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Endi pastga tushamiz! Mana, mening kundaligim: yozuvlar shunchalik ko'pki, aylantirib-aylantirib eng oxiriga yetib keldik. «Yuqoriga» tugmasi ham mana shu yerda ekan.",
        ru: 'А теперь поедем вниз! Вот мой дневник: записей так много, что мы прокрутили его до самого конца. Кнопка «Наверх» нашлась здесь.',
        en: 'Now let’s scroll down! Here’s my diary: so many entries that we scrolled all the way to the end. The To top button turned up right here.' } },
      { k: 'anchor', text: {
        uz: "Belgi kartochkaga bog'langan edi-ku: kartochka ketsa, belgi ham u bilan birga ketadi. Bu tugmaga esa hech kim bog'lanmagan, u oddiy matn qatori kabi eng pastda turibdi.",
        ru: 'Метка держалась за карточку: уедет карточка, уедет и метка. А эту кнопку никто не держит, она стоит в самом низу, как обычная строка текста.',
        en: 'The badge held on to the card: the card goes, the badge goes with it. Nothing holds this button, it stands at the very bottom like an ordinary line of text.' } },
      { k: null, text: {
        uz: "Men esa sahifani qancha aylantirmay, tugma doim ko'z oldimda turishini xohlayman. Sizningcha, buni qaysi position uddalay oladi?",
        ru: 'А я хочу, чтобы кнопка была у меня перед глазами, как ни прокручивай страницу. Как думаешь, какой position с этим справится?',
        en: 'And I want the button to stay in front of my eyes however far I scroll. What do you think, which position can pull that off?' } }
    ]
  },
  e1Edits: [noOwn, [rowsEdit[0], "  const rows = curK === 'riddle' ? [BADGE] : [REL, BADGE];   // без якоря — в угол страницы, с якорем — в угол карточки\n  const pageRules = rows;\n"],
    [brLine, "<Br title={pick(C.site.title)} url=\"index.html\"><CssPage els={site(pick, { hl: curK === 'rel' || curK === 'anchor' ? 'karta' : 'belgi' })} rules={withBase(pageRules, 'card')} insp={riddle} /></Br>"],
    chips,
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'wonder' : i === 1 ? 'embarrassed' : 'point'"]],
  h2Edits: [noOwn, [rowsEdit[0], '  const rows = BASES.long;   // в коде — основа страницы дневника\n'],
    [brLine, '<Br title={pick(C.long.title)} url="kundalik.html" short><CssPage els={site(pick, { hl: \'tugma\', page: \'long\' })} rules={withBase([], \'long\')} insp={false} scroll={1} /></Br>'],
    chips,
    ["i === 0 ? 'hello' : ", '']]
};
