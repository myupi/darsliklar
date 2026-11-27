// Урок 13 курса CSS «Hover и transform» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 25 и 26.
// Часть 1 «:hover и transform» — s1…s7 + вывод E1 (hover под мышкой, scale / rotate / translate; по отдельности);
// часть 2 «Hover и transform вместе, cursor» — крючок H2 (кнопка, которая прыгает сама) + s8…s15.
// Загадка (пробел в `.tugma :hover`) — во второй части (riddleInE1: false): её суть — как записывается селектор с :hover, а
// впервые записывать его ученик начинает в w1 (часть 2; там и подсказка «Напиши их слитно… узнаешь в конце урока»).
// Крючок S1 части 1 загадку не загадывает (s1Riddle), её загадывает H2; разгадка — в S15 части 2 без изменений.
const noOwn = ["  const store = useStore();\n  const own = [store.get('myBg') || 'gold', store.get('myTf') || 'scale(1.1)', store.get('myCur') || 'pointer'];\n", ''];
const riddleRows = "  const riddle = curK === 'riddle' || curK === 'riddle2';\n  const rows = curK === 'riddle' ? ['.tugma :hover { background-color: orange; }'] : curK === 'riddle2' ? ['.tugma:hover { background-color: orange; }'] : OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + own[i] + '; }');\n";
const brLine = "<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'tugma' : null })} rules={withBase(rows)} insp={riddle} hover={HV} mouse /></Br>";
const chips = ["{['hover', 'tf', 'cur', 'space'].map((k) => (", "{['hover', 'tf'].map((k) => ("];

export default {
  course: 'css',
  dir: 'tools/css13',
  src: 'c13.src.jsx',
  screens: 'c13-screens.jsx',
  lessonId: 'css-13-hover-transform',
  slug: 'hover-transform',
  riddleInE1: false,
  lessonTitleParts: [
    { uz: '25-dars. :hover va transform', ru: 'Урок 25. :hover и transform', en: 'Lesson 25. :hover and transform' },
    { uz: '26-dars. Hover va transform birga, cursor', ru: 'Урок 26. Hover и transform вместе, cursor', en: 'Lesson 26. Hover and transform together, cursor' }
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
  // Крючок части 1 без загадки: про указатель-руку (cursor) — «в следующем уроке».
  s1Riddle: {
    uz: "Bugun siz ham tugmalarni shunday jonlantirishni o'rganasiz: oldin sichqoncha ustida ishlaydigan qoidani yozamiz, keyin tugmani kattalashtirish, burish va surishni ko'ramiz. Ko'rsatkichni qo'lga aylantirishni esa keyingi darsda o'rganamiz.",
    ru: 'Сегодня ты тоже научишься оживлять кнопки. Сначала напишем правило, которое работает под мышкой, потом посмотрим, как увеличить, повернуть и сдвинуть кнопку. А как превратить указатель в руку, узнаем на следующем уроке.',
    en: 'Today you’ll learn to bring buttons to life like this too. First we’ll write a rule that works under the mouse, then see how to make a button bigger, turn it and move it. How to turn the pointer into a hand, we’ll learn in the next lesson.'
  },
  e1: {
    eyebrow: { uz: 'Sichqoncha ustida', ru: 'Под мышкой', en: 'Under the mouse' },
    ask: { uz: 'Tugma sichqonchaga javob beryapti', ru: 'Кнопка откликается на мышку', en: 'The button reacts to the mouse' },
    next: { uz: 'Keyingi dars: hover va transform birga, cursor', ru: 'Следующий урок: hover и transform вместе, cursor', en: 'Next lesson: hover and transform together, cursor' },
    roles: true,
    say: [
      { k: 'hover', text: {
        uz: "Mana, sichqoncha tugma ustida turibdi, qarang, tugma unga qanday javob qaytaryapti! Fon oltin rangga kirdi, Inspektor esa hover belgisini ko'rsatib turibdi. Qoida doim ishlamaydi: faqat sichqoncha kelganda, telefonda esa barmoq tekkanda.",
        ru: 'Смотри, мышка над кнопкой, и как она откликается! Фон стал золотым, а Инспектор помечает это меткой hover. Правило работает не всегда: только когда мышка над кнопкой, а на телефоне — при касании.',
        en: 'Look, the mouse is over the button, and see how it responds! The background turned gold, and the Inspector marks it with a hover tag. The rule doesn’t work all the time: only while the mouse is over the button, and on a phone, on a tap.' } },
      { k: 'tf', text: {
        uz: "Ikkinchi qoidada hover yo'q, shuning uchun u doim ishlaydi. Bu transform: scale bir yarim tugmani bir yarim barobar kattalashtirdi, ostidagi abzas esa joyidan jilmadi. rotate tugmani buradi, translate esa suradi.",
        ru: 'У второго правила нет hover, поэтому оно работает всегда. Это transform: scale полтора увеличил кнопку в полтора раза, а абзац под ней остался на месте. rotate поворачивает кнопку, translate сдвигает.',
        en: 'The second rule has no hover, so it works all the time. That’s transform: scale one and a half made the button one and a half times bigger, while the paragraph below stayed put. rotate turns the button, translate moves it.' } },
      { k: null, text: {
        uz: "Hozircha ular alohida ishladi: hover rangni, transform esa shaklni o'zgartirdi. Sizningcha, ikkalasini birlashtirsak nima bo'ladi? Masalan, tugma faqat sichqoncha ustiga kelganda burilib qolsa-chi?",
        ru: 'Пока они работали по отдельности: hover менял цвет, а transform — форму. Как думаешь, что будет, если объединить их? Например, пусть кнопка поворачивается только под мышкой.',
        en: 'So far they worked separately: hover changed the color, transform changed the shape. What do you think happens if we combine them? Say, the button turns only under the mouse.' } }
    ]
  },
  h2: {
    eyebrow: { uz: "O'zi sakraydigan tugma", ru: 'Кнопка, которая прыгает', en: 'A button that jumps' },
    ask: { uz: "Tugma o'zi o'ngga ketdi", ru: 'Кнопка сама уехала вправо', en: 'The button moved right on its own' },
    roles: true,
    say: [
      { k: 'tf', text: {
        uz: "Ana, tugmaga qarang: u o'zi o'ngga sakrab ketibdi! Men sichqonchani yaqinlashtirmadim ham, hech narsani bosmadim. Gap shundaki, transform oddiy qoidaga yozilsa, doim ishlaydi: sichqoncha bormi, yo'qmi, baribir.",
        ru: 'Смотри, кнопка сама ускакала вправо! Я даже мышку не подводил и ничего не нажимал. Дело в том, что transform в обычном правиле работает всегда: есть мышка или нет.',
        en: 'Look, the button jumped to the right all by itself! I didn’t bring the mouse near it or press anything. The thing is, transform in a plain rule works all the time, mouse or no mouse.' } },
      { k: 'hover', text: {
        uz: "Men esa tugma faqat sichqoncha kelganda sakrasin, deb xohlagandim. Buning uchun transform bilan hover bitta qoidada birga ishlashi kerak. Buni hozir o'rganamiz. Lekin oldin eski bir kodni ko'rsatay.",
        ru: 'А я хотел, чтобы кнопка прыгала только когда подводишь мышку. Для этого transform и hover должны работать в одном правиле. Этому мы сейчас и научимся. Но сначала покажу один старый код.',
        en: 'And I wanted the button to jump only when the mouse arrives. For that, transform and hover have to work in one rule. We’ll learn that right now. But first let me show you some old code.' } },
      { k: 'riddle', text: {
        uz: "Eski papkamdan bir kod topib oldim: unda tugma bilan hover o'rtasida bitta bo'sh joy turibdi. Menimcha, bo'sh joy hech narsani buzmaydi, aksincha, kod chiroyliroq ko'rinadi. Siz nima deysiz, shu kod bilan tugma jonlanadimi? Dars oxirida o'sha kodni ishga tushirib ko'ramiz.",
        ru: 'В старой папке я нашёл код: между кнопкой и hover там стоит пробел. По-моему, пробел ничего не ломает, даже наоборот: так код красивее. Как думаешь, оживёт ли кнопка с этим кодом? Ответ найдём вместе в конце урока.',
        en: 'In my old folder I found some code: there’s a space between the button and hover. I think a space breaks nothing, it even makes the code look nicer. What do you think, will the button come alive with this code? We’ll find the answer together at the end of the lesson.' } }
    ]
  },
  e1Edits: [noOwn,
    [riddleRows, "  const riddle = curK === 'hover';   // «Инспектор» с меткой :hover и подсветка строки — пока речь про hover\n  const rows = curK === 'hover' ? ['.tugma:hover { background-color: gold; }'] : ['.tugma:hover { background-color: gold; }', '.tugma { transform: scale(1.5); }'];\n"],
    [brLine, "<Br title={pick(C.site.title)} url=\"index.html\"><CssPage els={site(pick, { hl: 'tugma' })} rules={withBase(rows)} insp={riddle} hover={HV} mouse /></Br>"],
    chips,
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'wonder' : 'point'"]],
  h2Edits: [noOwn,
    [riddleRows, "  const riddle = curK === 'riddle';\n  const rows = curK === 'riddle' ? ['.tugma :hover { background-color: orange; }'] : ['.tugma { transform: translate(40px, 10px); }'];   // кнопка прыгает сама: transform без hover\n"],
    [brLine, "<Br title={pick(C.site.title)} url=\"index.html\"><CssPage els={site(pick, { hl: 'tugma' })} rules={withBase(rows)} insp={riddle} /></Br>"],
    chips,
    ["i === 0 ? 'hello' : ", '']]
};
