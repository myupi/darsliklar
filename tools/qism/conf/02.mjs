// Урок 2 «Заголовки и текст» двумя частями (tools/qism/build.mjs): часть 1 — заголовки h1–h6 и абзац p
// (s1, s3–s8 + вывод E1), часть 2 — b, i, своя страница и проверка (крючок H2 + s9–s15).
// Загадка про h6 разгадывается в E1: ученик в части 1 уже видел, что h1 самый крупный, а h6 самый мелкий
// (s3, s5). Страница в E1 и H2 — страница про кота из S1 (h1, абзац с жирным и курсивом, h2, абзац);
// в E1 первая реплика показывает её заголовок тегом h6 («как было»), дальше — h1.
// Чипы ролей — только h и p: b и i в части 1 не учили (в E1 жирное и курсивное слова только загораются как загадка).
const catPage = (blocks) => [
  ["  const mine = useMine2();\n", ''],
  ["  const bw = pick(C.s14.bword);\n  const blocks = [\n    { t: 'h1', parts: [mine.title], hl: curK === 'h' },\n    { t: 'p', parts: [{ b: bw }, ' ' + mine.text], hl: curK === 'p' ? true : curK === 'bi' ? 'b' : null }\n  ];\n", blocks],
  ['<PaperBrowser title={pick(UI.mySite)} cls="z2-br">', '<PaperBrowser title={pick(PAGE.title)} cls="z2-br">'],
  ["{['h', 'p', 'bi'].map((k) => (", "{['h', 'p'].map((k) => ("]
];

// E1: заголовок — h6 на первой реплике (загадка), дальше h1 (ключ другой — новый заголовок «падает» заново).
const e1Blocks = `  const rid = curK === 'riddle';
  const blocks = [
    { t: rid ? 'h6' : 'h1', k: rid ? 'hh6' : 'hh1', parts: [pick(PAGE.title)], hl: curK === 'h' || rid },
    { t: 'p', parts: pick(PAGE.p1), hl: curK === 'p' || curK === 'bi' ? true : null },
    { t: 'h2', parts: [pick(PAGE.h2)], hl: curK === 'h2' },
    { t: 'p', parts: pick(PAGE.p2), hl: curK === 'p' }
  ];
`;

// H2: страница та же, жирное и курсивное слово загораются по очереди.
const h2Blocks = `  const blocks = [
    { t: 'h1', parts: [pick(PAGE.title)], hl: curK === 'h' },
    { t: 'p', parts: pick(PAGE.p1), hl: curK === 'p' ? true : curK === 'b' ? 'b' : curK === 'i' ? 'i' : null },
    { t: 'h2', parts: [pick(PAGE.h2)] },
    { t: 'p', parts: pick(PAGE.p2), hl: curK === 'p' }
  ];
`;

// В E1 строка «h2» должна зажигать и чип заголовков.
const e1Edits = catPage(e1Blocks).concat([
  ["(curK === k ? ' is-on' : '')", "((curK === k || (k === 'h' && curK === 'h2')) ? ' is-on' : '')"]
]);

export default {
  dir: 'tools/zagolovki2',
  src: 'z2r.src.jsx',
  screens: 'z2r-screens.jsx',
  lessonId: 'html-02-zagolovki-i-tekst',
  slug: 'zagolovki-i-tekst',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "3-dars. Sarlavhalar va abzaslar", ru: "Урок 3. Заголовки и абзацы", en: "Lesson 3. Headings and paragraphs" },
    { uz: "4-dars. Qalin va qiya matn", ru: "Урок 4. Жирный и наклонный текст", en: "Lesson 4. Bold and italic text" }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'CHECK-1', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'PREDICT', Comp: S8 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's13b', code: 'LEVEL-4B', Comp: S13B },
  { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 'q1', code: 'CHECK-4', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // Часть 1: загадка задаётся как раньше, но «в этой части», а не «в этом уроке»; своей страницы в части 1 нет.
  s1Done: {
    uz: [["Bugun matnni shunday tartibga solishni o'rganasiz, keyin o'z sahifangizni yasaysiz.", "Bu darsda sarlavhalar va abzaslar yordamida matnni shunday tartibga solishni o'rganasiz."],
      ["dars oxirida yana so'rayman", "bu dars oxirida yana so'rayman"]],
    ru: [['Сегодня ты научишься так оформлять текст и сделаешь свою страницу.', 'В этом уроке ты научишься так оформлять текст с помощью заголовков и абзацев.'],
      ['в конце урока', 'в конце урока']],
    en: [['Today you’ll learn to shape text like this and make your own page.', 'In this lesson you’ll learn to shape text like this with headings and paragraphs.'],
      ['at the end of the lesson', 'at the end of the lesson']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Mushuk sahifasi: sarlavhalar va abzaslar', ru: 'Страница про кота: заголовки и абзацы', en: 'The cat page: headings and paragraphs' },
    next: { uz: "Keyingi dars: b, i va o'z sahifangiz", ru: 'Следующий урок: b, i и своя страница', en: 'Next lesson: b, i and your own page' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Voy, adashdim! Men asosiy sarlavhaga h6 tegini qo'ymoqchi edim, chunki olti katta son-ku. Mana, natijasi: sarlavha mitti bo'lib qoldi! Siz buni sarlavhalar bilan tanishganimizda o'zingiz ham ko'rgan edingiz: raqam o'lchamni emas, muhimlikni bildiradi, shuning uchun raqam qancha katta bo'lsa, sarlavha shuncha kichik bo'ladi.",
        ru: 'Ой, я ошибся! Я хотел поставить на главный заголовок h6, ведь шесть — большое число. Смотри, что вышло: заголовок стал совсем мелким! Ты и сам видел это, когда мы знакомились с заголовками: цифра — не размер, а важность, и чем больше цифра, тем мельче заголовок.',
        en: 'Oops, I was wrong! I wanted to put h6 on the main heading, because six is a big number. Look what happened: the heading turned tiny! You saw it yourself when we met the headings: the number isn’t the size but the importance, and the bigger the number, the smaller the heading.' } },
      { k: 'h', text: {
        uz: "Endi h6 o'rniga h1 tegini qo'yamiz. Ana, sarlavha sahifaning tepasida katta bo'lib turibdi! h1 eng katta sarlavha bo'ladi, demak, sahifaning asosiy sarlavhasi uchun aynan shu teg kerak.",
        ru: 'Теперь поставим h1. Вот это другое дело: заголовок крупный и стоит на самом верху! h1 самый крупный, поэтому главный заголовок страницы делают именно им.',
        en: 'Now let’s use h1. That’s more like it: a big heading right at the top! h1 is the biggest, so the main heading of a page always gets h1.' } },
      { k: 'h2', text: {
        uz: "Pastdagi sarlavhani ko'ryapsizmi? U bo'limning sarlavhasi, shuning uchun h2 tegida turibdi. U asosiy sarlavhadan kichikroq bo'ladi, lekin oddiy matndan baribir kattaroq.",
        ru: 'Заголовок ниже — это заголовок раздела, поэтому у него h2. Он мельче главного, но всё равно крупнее обычного текста.',
        en: 'The heading below is a section heading, so it gets h2. It’s smaller than the main one, but still bigger than plain text.' } },
      { k: 'p', text: {
        uz: "Matn esa abzaslarga bo'lingan, chunki har bir abzasni o'z p tegi o'rab turibdi. Brauzer abzaslarni bir-biridan ajratib, o'rtasida bo'sh joy qoldiradi.",
        ru: 'Дальше идёт текст. Он разделён на абзацы, потому что каждый абзац обёрнут в свой тег p. Поэтому браузер отделяет их друг от друга отступом.',
        en: 'Next comes the text. It’s split into paragraphs because each one is wrapped in its own p tag. That’s why the browser sets them apart with some space.' } },
      { k: null, text: {
        uz: "Qoyil! Siz sarlavhani yopishni ham, abzasni o'zingiz yig'ishni ham eplab oldingiz.",
        ru: 'Отлично! Заголовок закрыт, абзац собран — всё это ты сделал своими руками.',
        en: 'Awesome! The heading is closed and the paragraph is built, and you did all of it yourself.' } },
      { k: 'bi', text: {
        uz: "Lekin sahifada yana bir sir qoldi: abzasdagi «juda» so'zi qalin, «uxlashni» so'zi esa qiya yozilgan. Ularni qaysi teglar shunaqa qilgan, nima deb o'ylaysiz? Keyingi darsda topamiz, undan keyin o'z sahifangizni ham yasaymiz!",
        ru: 'Но на странице осталась ещё одна загадка: слово «очень» в абзаце жирное, а слово «спать» написано курсивом. Как думаешь, какие теги это делают? Узнаем на следующем уроке, а потом соберём и твою страницу!',
        en: 'But the page still has one more mystery: the word “really” in the paragraph is bold, and “sleep” is in italic. Which tags do you think do that? We’ll find out in the next lesson, and then we’ll build your own page too!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Qalin va qiya so'zlar", ru: 'Жирные и курсивные слова', en: 'Bold and italic words' },
    roles: true,
    say: [
      { k: 'h', text: {
        uz: "Salom! O'tgan darsda mushuk sahifasini tartibga keltirdik. Sarlavhalar uchun h1 tegidan h6 tegigacha oltita teg borligini bilib oldik, eng kattasi esa h1 ekan.",
        ru: 'Привет! На прошлом уроке мы навели порядок на странице про кота. Узнали, что тегов заголовков шесть, от h1 до h6, а самый крупный из них — h1.',
        en: 'Hi! In the last lesson we put the cat page in order. We learned there are six heading tags, from h1 to h6, and the biggest one is h1.' } },
      { k: 'p', text: {
        uz: "Matnni esa p tegi abzaslarga bo'lib berdi. Endi shu abzaslardan biriga yaqinroq qarang-chi.",
        ru: 'А текст на абзацы разделил тег p. Теперь присмотрись к одному из этих абзацев.',
        en: 'And the p tag split the text into paragraphs. Now take a closer look at one of those paragraphs.' } },
      { k: 'b', text: {
        uz: "Mana, «juda» so'zi qalin turibdi, ko'zga darrov tashlanyapti-ku!",
        ru: 'Смотри, слово «очень» стоит жирным, и оно сразу бросается в глаза!',
        en: 'See, the word “really” is bold, and it catches your eye right away!' } },
      { k: 'i', text: {
        uz: "«uxlashni» so'zi esa qiya. Sizningcha, faqat bitta so'zni qalin yoki qiya qilish mumkinmi, yoki butun abzas birdan o'zgarib ketadimi? Qani, ko'ramiz!",
        ru: 'А слово «спать» написано курсивом. Как думаешь, можно ли сделать жирным или курсивным только одно слово, или весь абзац изменится сразу? Давай посмотрим!',
        en: 'And the word “sleep” is in italic. What do you think: can we make just one word bold or italic, or will the whole paragraph change at once? Let’s see!' } }
    ]
  },
  e1Edits,
  h2Edits: catPage(h2Blocks)
};
