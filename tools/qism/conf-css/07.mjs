// Урок 7 курса CSS «Box Model» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 13 и 14.
// Часть 1 «Padding и border» — s1…s7 + вывод E1 (заметка как коробка: padding 20px и рамка 3px dashed orange; разгадка про
// padding 30px; в конце — тизер про внешний слой);
// часть 2 «Margin и box-sizing» — крючок H2 (Коди измерил ширину: в коде 200, в Инспекторе 250) + s8…s15.
// Загадка «padding: 30px раздвинет заметки?» разгадывается материалом части 1 (padding — внутри, расстояние не меняется),
// поэтому её разгадка — в E1 (riddleInE1: true): первая реплика S15 части 2 убирается, S15 начинается с margin.
// Проверено: в экранах s2–s7 нет margin и box-sizing; margin мелькает только в s1 (превращение показывает все три свойства).

const noOwn = ["  const store = useStore();\n  const own = [store.get('myPad') || '16px', store.get('myBrd') || '3px dashed purple', store.get('myMar') || '20px'];\n", ''];
const BR = ["<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'p' : null })} rules={withBase(rows)} /></Br>",
  "<Br title={pick(C.site.title)} url=\"index.html\"><CssPage els={site(pick, { hl: 'p' })} rules={withBase(rows)} /></Br>"];
const ROLES = ["{['pad', 'mar', 'brd', 'bs'].map((k) => (", "{['pad', 'brd'].map((k) => ("];
const ROWS_OLD = "const rows = curK === 'riddle' ? ['p { padding: 30px; }'] : curK === 'riddle2' ? ['p { margin: 30px; }'] : OWN.map((o, i) => 'p { ' + o.prop + ': ' + own[i] + '; }');";

// E1: заметка из части 1 (padding 20px из s3, рамка из s6); на загадке — padding 30px, как в разгадке.
const E1_EDITS = [
  noOwn,
  ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"],
  ["  const riddle = curK === 'riddle' || curK === 'riddle2';\n", "  const riddle = curK === 'riddle';\n"],
  [ROWS_OLD, "const rows = riddle ? ['p { padding: 30px; }'] : ['p { padding: 20px; }', 'p { border: 3px dashed orange; }'];"],
  BR,
  ROLES
];

// H2: страница с ширинами из показа части 2 (width 200px, padding 20px, рамка 5px) — Инспектор называет заметку 250 в ширину.
const H2_EDITS = [
  noOwn,
  ["  const riddle = curK === 'riddle' || curK === 'riddle2';\n", "  const riddle = false;\n"],
  [ROWS_OLD, "const rows = ['p { width: 200px; }', 'p { padding: 20px; }', 'p { border: 5px solid orange; }'];"],
  BR,
  ROLES
];

export default {
  course: 'css',
  dir: 'tools/css7',
  src: 'c7.src.jsx',
  screens: 'c7-screens.jsx',
  lessonId: 'css-07-box-model',
  slug: 'box-model',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "13-dars. Ichki bo'shliq va chegara: padding, border", ru: 'Урок 13. Padding и border', en: 'Lesson 13. Padding and border' },
    { uz: "14-dars. Tashqi bo'shliq va quti kengligi: margin, box-sizing", ru: 'Урок 14. Margin и box-sizing', en: 'Lesson 14. Margin and box-sizing' }
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
  // Часть 1 учит padding и border (margin — в части 2): «каждый элемент как коробку» → «изнутри».
  s1Done: {
    uz: [["bugun ularni bezashni o'rganamiz.", "bu darsda ularni ichkaridan bezashni o'rganamiz: ichki bo'shliq va chegara bilan."]],
    ru: [['Сегодня ты научишься оформлять каждый элемент как коробку.', 'В этом уроке ты научишься оформлять коробку изнутри: отступом и рамкой.']],
    en: [['Today you’ll learn to style every element like a box.', 'In this lesson you’ll learn to style a box from the inside: with inner space and a frame.']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Eslatma qutiga aylandi', ru: 'Заметка стала коробкой', en: 'The note became a box' },
    next: { uz: "Keyingi dars: margin va box-sizing", ru: 'Следующий урок: margin и box-sizing', en: 'Next lesson: margin and box-sizing' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Qarang, eslatma haqiqiy qutiga o'xshab qoldi! O'rtada matn turibdi, uni yashil ichki bo'shliq o'rab olgan, eng tashqarida esa chegara devor bo'lib turibdi.",
        ru: 'Смотри, заметка стала настоящей коробкой! В середине текст, вокруг него зелёный внутренний отступ, а снаружи рамка, как стенка.',
        en: 'Look, the note turned into a real box! The text is in the middle, a green inner space wraps around it, and the frame stands outside like a wall.' } },
      { k: 'pad', text: {
        uz: "Ichki bo'shliqni padding beradi. U matnni qutining chetidan uzoqlashtiradi, fon esa bu joyga ham yoyiladi, shuning uchun eslatma semirib qoladi. Qiymatda sonning yonida px turishini ham unutmang.",
        ru: 'Внутренний отступ даёт padding. Он отодвигает текст от края коробки, а фон заходит и на это место, поэтому заметка становится толще. И не забывай про px рядом с числом.',
        en: 'The inner space comes from padding. It moves the text away from the edge of the box, and the background covers that room too, so the note gets thicker. And don’t forget px next to the number.' } },
      { k: 'brd', text: {
        uz: "Chegarani border chizadi. Unga uchta narsa kerak: qalinlik, chiziq turi va rang. Chiziq turini yozmasak, brauzer chegarani umuman chizmaydi.",
        ru: 'Рамку рисует border. Ей нужны три вещи: толщина, вид линии и цвет. Если не написать вид линии, браузер рамку вообще не нарисует.',
        en: 'The frame is drawn by border. It needs three things: thickness, line type and color. Without a line type the browser won’t draw the frame at all.' } },
      { k: 'riddle', text: {
        uz: "Mana, garovimizning javobi: padding o'ttiz piksel yozdim. Qarang-chi, eslatmalar semirdi, oralaridagi masofa esa o'sha-o'sha qoldi. Yutqazdim! Chunki padding joyni qutining ichida ochadi, qo'shnilarni nariga surmaydi.",
        ru: 'Вот и ответ на загадку: я написал padding тридцать пикселей. Смотри, заметки стали толще, а расстояние между ними осталось прежним. Я ошибся! Ведь padding даёт место внутри коробки и соседей не отодвигает.',
        en: 'Here’s the answer to our riddle: I wrote padding thirty pixels. Look, the notes got thicker, but the gap between them stayed the same. I was wrong! Because padding makes room inside the box and doesn’t push the neighbors away.' } },
      { k: null, text: {
        uz: "Eslatmalarni bir-biridan uzoqlashtiradigan narsa esa chegaradan tashqarida yashaydi. Uning nomi margin, uni darsning boshida bir ko'rgan edik. U qanday ishlashini keyingi darsda bilib olamiz.",
        ru: 'А то, что раздвигает заметки, живёт снаружи, за рамкой. Это margin, он мелькнул в самом начале. Как он работает, узнаем на следующем уроке.',
        en: 'But what pushes the notes apart lives outside, beyond the frame. It’s margin, which flashed by at the very start. We’ll see how it works in the next lesson.' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Inspektor boshqa son ko\'rsatdi', ru: 'Инспектор показал другое число', en: 'The Inspector shows another number' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Voy, men bir narsani o'lchab ko'rdim-u, hayron qoldim! Eslatmaning enini tekshirdim: kodda width ikki yuz piksel deb yozilgan, Inspektor esa ikki yuz ellikni ko'rsatyapti. Kim adashibdi ekan, men-mi yoki brauzer?",
        ru: 'Ой, я тут кое-что измерил и растерялся! Проверил ширину заметки: в коде написано width двести пикселей, а Инспектор показывает двести пятьдесят. Кто ошибся: я или браузер?',
        en: 'Oh, I measured something and got confused! I checked the width of the note: the code says width two hundred pixels, but the Inspector shows two hundred fifty. Who got it wrong, me or the browser?' } },
      { k: null, text: {
        uz: "Balki bunga o'tgan darsdagi padding bilan border aloqasi bordir? Hozircha ishonchim yo'q, shuning uchun bu sirni shu darsda tekshiramiz.",
        ru: 'Может, тут как-то замешаны padding и border с прошлого урока? Пока не уверен, так что проверим это на этом уроке.',
        en: 'Maybe padding and border from the last lesson have something to do with it? I’m not sure yet, so we’ll check it in this lesson.' } },
      { k: null, text: {
        uz: "Yana bitta ish bor: eslatmalar hamon bir-biriga yopishib turibdi. Ularni ajratadigan narsani ham shu darsda o'rganamiz. Reja shunday: oldin eslatmalarni ajratamiz, keyin o'lchov sirini hal qilamiz.",
        ru: 'Есть и ещё одно дело: заметки по-прежнему прилипли друг к другу. Что их разделит, мы тоже узнаем на этом уроке. План такой: сначала разделим заметки, потом разберёмся с загадкой измерений.',
        en: 'There’s one more job: the notes are still stuck to each other. We’ll find out what separates them in this lesson too. The plan is: first we separate the notes, then we sort out the measuring puzzle.' } }
    ]
  },
  e1Edits: E1_EDITS,
  h2Edits: H2_EDITS
};
