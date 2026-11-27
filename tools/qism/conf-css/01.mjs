// Урок 1 курса CSS «Что такое CSS и как он меняет сайт» двумя частями (tools/qism/build.mjs 01 css): сквозные уроки 1 и 2.
// Часть 1 «Подключаем CSS: тег style и правило» — s1…s7 + вывод E1 (разгадка про «=» вместо «:» — материала части 1 хватает:
// правило из селектора, свойства, двоеточия и значения ученик уже собрал сам в s5–s7);
// часть 2 «Селектор и поломки в CSS» — крючок H2 + s8…s15 (селектор, поломки, правило целиком, своя страница).
const common = [
  // Своих цветов (store) в части 1 ещё нет: страница Коди и правила, которые ученик уже видел (h1 — orange, p — green).
  ["  const store = useStore();\n  const mc = store.get('myColor') || 'purple', mb = store.get('myBg') || 'lavender';\n", ''],
  ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"']
];
const e1Edits = common.concat([
  ["const blocks = riddle ? siteBlocks(pick, 'h1').slice(0, 2) : [{ t: 'h1', text: pick(UI.mySite), k: 'h', hl: curK === 'sel' }, { t: 'p', text: pick(C.site.hello), k: 'p' }];",
    "const blocks = riddle ? siteBlocks(pick, 'h1').slice(0, 2) : siteBlocks(pick, '');"],
  ["const css = riddle ? 'h1 { color = orange; }' : 'h1 { color: ' + mc + '; } body { background-color: ' + mb + '; }';",
    "const css = riddle ? 'h1 { color = orange; }' : 'h1 { color: orange; } p { color: green; }';"],
  ["'h1 { color: ' + mc + '; }', { cls: riddle ? 'is-read' : '' }", "'h1 { color: orange; }', { cls: riddle ? 'is-read' : '' }"],
  ["[cssL('r2', 0, 'body { background-color: ' + mb + '; }')]", "[cssL('r2', 0, 'p { color: green; }', null, curK === 'sel' ? 'sel' : curK === 'prop' ? ['prop', 'val'] : null)]"]
]);
const h2Edits = common.concat([
  ["const blocks = riddle ? siteBlocks(pick, 'h1').slice(0, 2) : [{ t: 'h1', text: pick(UI.mySite), k: 'h', hl: curK === 'sel' }, { t: 'p', text: pick(C.site.hello), k: 'p' }];",
    "const blocks = riddle ? siteBlocks(pick, 'h1').slice(0, 2) : siteBlocks(pick, curK === 'sel' ? 'p' : '');"],
  // Ошибка Коди: абзацы хотел зелёными, а в селекторе написал h1 — позеленел заголовок.
  ["const css = riddle ? 'h1 { color = orange; }' : 'h1 { color: ' + mc + '; } body { background-color: ' + mb + '; }';",
    "const css = riddle ? 'h1 { color = orange; }' : 'h1 { color: green; }';"],
  ["'h1 { color: ' + mc + '; }', { cls: riddle ? 'is-read' : '' }", "'h1 { color: green; }', { cls: riddle ? 'is-read' : '' }"],
  [".concat(riddle ? [] : [cssL('r2', 0, 'body { background-color: ' + mb + '; }')])", ''],
  // Загадка про «=» теперь разгадана в выводе части 1: в s11 «в начале урока» → «в прошлом уроке» (только узбекский текст).
  // Крючок начинается без приветствия — с промаха Коди: смущённая поза вместо «привет».
  ["i === 0 ? 'hello' : i === c.say.length - 1", "i === 0 ? 'embarrassed' : i === c.say.length - 1"],
  ['function H2(', "{ const f = 'dars boshidagi mening qatorim'; if (!C.s11.sayEq.uz.includes(f)) throw new Error('qism: нет фрагмента в s11.sayEq'); C.s11.sayEq.uz = C.s11.sayEq.uz.replace(f, \"o'tgan darsdagi mening qatorim\"); }\nfunction H2("]
]);

export default {
  course: 'css',
  dir: 'tools/css1',
  src: 'c1.src.jsx',
  screens: 'c1-screens.jsx',
  lessonId: 'css-01-chto-takoe-css',
  slug: 'chto-takoe-css',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "1-dars. Sahifaga CSS ulaymiz: style tegi va qoida", ru: 'Урок 1. Подключаем CSS: тег style и правило', en: 'Lesson 1. Connecting CSS: the style tag and a rule' },
    { uz: "2-dars. Selektor va buzilgan CSS qoidalari", ru: 'Урок 2. Селектор и поломки в CSS', en: 'Lesson 2. The selector and broken CSS' }
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
  // Часть 1: своей страницы ученика (цвета заголовка и фона) здесь ещё нет — она в части 2.
  s1Done: {
    uz: [["Bugun CSS nima ekanini bilib olasiz, o'z sahifangizni ham ranglarga bo'yaysiz.", "Bu darsda CSS nima ekanini bilib olasiz va o'zingizning birinchi qoidangizni yozasiz."]],
    ru: [['Сегодня ты узнаешь, что такое CSS, и раскрасишь свою страницу.', 'В этом уроке ты узнаешь, что такое CSS, и напишешь своё первое правило.']],
    en: [['Today you’ll find out what CSS is and color your own page.', 'In this lesson you’ll find out what CSS is and write your first rule.']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Birinchi qoidangiz tayyor', ru: 'Твоё первое правило готово', en: 'Your first rule is ready' },
    next: { uz: 'Keyingi dars: selektor va buzilgan CSS qoidalari', ru: 'Следующий урок: селектор и поломки в CSS', en: 'Next lesson: the selector and broken CSS' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Ura, birinchi haqiqiy CSS qoidangiz tayyor! Bahsimiz esingizdami? Mana mening qatorim: sarlavhaga color teng orange deb yozgan edim, sarlavha esa haliyam qop-qora. Sababini endi o'zingiz ham bilasiz: xususiyat bilan qiymat o'rtasida ikki nuqta turadi, tenglik belgisi esa HTML atributlari uchun. Brauzer qoidamni tushunmadi va o'tkazib yubordi. Bahsda men yutqazdim!",
        ru: 'Ура, твоё первое настоящее правило CSS готово! Помнишь наш спор? Вот моя строка: для h1 я написал color равно orange, а заголовок всё равно чёрный. Причину ты уже знаешь: между свойством и значением стоит двоеточие, а «равно» — для атрибутов HTML. Браузер не понял моё правило и пропустил его. В споре я проиграл!',
        en: 'Hooray, your first real CSS rule is done! Remember our argument? Here’s my line: I wrote color equals orange for h1, and the heading is still black. You already know why: a colon goes between the property and the value, and the equals sign is for HTML attributes. The browser didn’t understand my rule and skipped it. I lost the bet!' } },
      { k: 'style', text: {
        uz: "Sahifada nima borligini HTML aytadi, uning qanday ko'rinishini esa CSS. Bu ikkisini aralashtirib yubormaymiz: CSS kodi head ichidagi style tegida yashaydi, xuddi title kabi.",
        ru: 'Что есть на странице, говорит HTML, а как это выглядит — CSS. Мы их не путаем: код CSS живёт в теге style внутри head, как и title.',
        en: 'HTML says what’s on the page, and CSS says how it looks. We don’t mix them up: CSS code lives in the style tag inside head, just like title.' } },
      { k: 'sel', text: {
        uz: "Qoidaning boshida selektor turadi: u qaysi tegni bezashni tanlaydi. Biz h1 tegini ham, p tegini ham tanladik, shuning uchun sarlavha ham, abzaslar ham rangga kirdi.",
        ru: 'В начале правила стоит селектор: он выбирает, какой тег оформить. Мы выбрали и h1, и p, поэтому раскрасились и заголовок, и абзацы.',
        en: 'A rule starts with the selector: it picks which tag to style. We picked both h1 and p, so the heading and the paragraphs got colored.' } },
      { k: 'prop', text: {
        uz: "Jingalak qavs ichida xususiyat bilan qiymat turadi. Ular o'rtasida ikki nuqta bo'ladi, oxirida esa nuqtali vergul. Brauzer qoidani aynan shu belgilarga qarab o'qiydi.",
        ru: 'Внутри фигурных скобок — свойство и значение. Между ними двоеточие, а в конце точка с запятой. Браузер читает правило именно по этим знакам.',
        en: 'Inside the curly braces sit the property and the value. A colon goes between them, and a semicolon at the end. The browser reads the rule by exactly these signs.' } },
      { k: null, text: {
        uz: "Sizga bitta savolim bor: hozir p qoidasi abzaslarni bo'yadi. Javobini keyingi darsda birga topamiz, hozircha o'ylab ko'ring-chi: o'sha qoida sarlavhani ham bo'yaydimi?",
        ru: 'У меня к тебе вопрос: сейчас правило для p покрасило абзацы. Ответ найдём вместе на следующем уроке, а пока подумай: покрасит ли оно и заголовок?',
        en: 'I have a question for you: the rule for p just colored the paragraphs. We’ll find the answer together next lesson, but for now think: will it color the heading too?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Qoida adashdi', ru: 'Правило промахнулось', en: 'The rule missed' },
    ask: { uz: "Abzaslar nega bo'yalmadi", ru: 'Почему абзацы не покрасились', en: 'Why the paragraphs stayed black' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Voy, mana, yana adashibman! Abzaslarimni yashil qilmoqchi edim-u, qoidaga h1 deb yozib qo'yibman. Qarang, sarlavha yashil bo'lib ketdi, abzaslar esa hamon qop-qora.",
        ru: 'Ой, вот я и промазал! Хотел покрасить абзацы в зелёный, а в правиле написал h1. Смотри: заголовок позеленел, а абзацы как были чёрными, так и остались.',
        en: 'Oops, I missed again! I wanted to color the paragraphs green, but I wrote h1 in the rule. Look: the heading turned green, and the paragraphs are still black.' } },
      { k: 'prop', text: {
        uz: "Qoidani qayta-qayta o'qib chiqdim, lekin qayerda adashganimni topolmadim: xususiyat ham, qiymat ham, ikki nuqta ham, nuqtali vergul ham joyida turibdi. Adashgan joyim qayerda yashiringan ekan?",
        ru: 'Я перечитал правило несколько раз и ошибки не нашёл: свойство, значение, двоеточие и точка с запятой на месте. Где же она прячется?',
        en: 'I read the rule again and again and found no mistake: the property, the value, the colon and the semicolon are all in place. So where is the mistake hiding?' } },
      { k: 'sel', text: {
        uz: "Qoidaning eng boshida qaysi bo'lak turardi, esingizdami? U qaysi tegni bezashni tanlardi-ku! Menga yordam bering-chi, sababini birga topamiz.",
        ru: 'Помнишь, какая часть стоит в самом начале правила? Она ведь выбирает, какой тег оформить! Помоги мне, пожалуйста, вместе найдём причину.',
        en: 'Remember which part sits at the very start of a rule? It picks which tag to style! Please help me, let’s find the reason together.' } }
    ]
  },
  e1Edits,
  h2Edits
};
