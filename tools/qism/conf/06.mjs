// Урок 6 «Формы, часть 1: ввод данных» двумя частями (tools/qism/build.mjs): часть 1 — input и type (s1–s7 + вывод E1),
// часть 2 — placeholder, label и form (крючок H2 + s8–s14, q1, q2, s15).
// Загадка про placeholder и пароль требует материала части 2 (placeholder — лишь серая подсказка, прячет только type password):
// в части 1 она не загадывается (s1Riddle), её загадывает H2, а S15 части 2 разгадывает как раньше. Проверено: в экранах s1–s7
// нет placeholder, label и form — ни в репликах, ни в коде, ни на страницах.

const MINE = ["  const mine = useMine6();\n", ''];
const ROLES_MAP = ['{S15_ROLES.map((k) => (', "{['input', 'type'].map((k) => ("];
const ROLE_ON = ["curK === k || (riddle && k === 'type') ? ' is-on'", "curK === k ? ' is-on'"];

// Страница клуба — та же, что ученик видел в S1 (после «Превратить»): подписи с тремя полями.
const clubBlocks = (hlInput) => `{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.join), k: 'j' },
      { t: 'lab', cap: pick(s.capGame), f: { type: 'text', val: 'Minecraft' }, k: 'g', hl: ${hlInput ? "curK === 'input'" : 'false'} },
      { t: 'lab', cap: pick(s.capAge), f: { type: 'number', val: '12' }, k: 'a', hl: ${hlInput ? "curK === 'input' || curK === 'type'" : "curK === 'type'"} },
      { t: 'lab', cap: pick(s.capPass), f: { type: 'password', val: 'kodi2026' }, k: 'p', hl: ${hlInput ? "curK === 'input' || curK === 'type'" : "curK === 'type'"} }`;

// S15: страница ученика собирается только в конце части 2 — здесь вместо неё страница клуба из S1; чипы — только input и type.
const E1_EDITS = [
  MINE,
  ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"],
  [`  const riddle = curK === 'riddle';
  const blocks = riddle
    ? [{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'lab', cap: pick(s.capPass), f: { type: 'text', ph: pick(s.phPass), val: 'kodi2026' }, k: 'r', hl: true }]
    : [{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'lab', cap: mine.cap, f: { type: 'text', ph: mine.ph }, k: 'l1', hl: curK === 'input' || curK === 'placeholder', capHl: curK === 'label' },
      { t: 'lab', cap: pick(s.capPass), f: { type: 'password', val: 'kodi2026' }, k: 'l2', hl: curK === 'type' }];
`, `  const blocks = [${clubBlocks(true)}];
`],
  ["<Br title={riddle ? pick(s.club) : pick(UI.myForm)} url={riddle ? 'klub.html' : 'anketa.html'}><PageDoc blocks={blocks} key={riddle ? 'r' : 'm'} /></Br>",
    '<Br title={pick(s.club)} url="klub.html"><PageDoc blocks={blocks} /></Br>'],
  ROLES_MAP,
  ROLE_ON
];

// H2: загадка показывается страницей из разгадки (пароль без type password, внутри серое слово — но поле пока пустое, ответа нет);
// остальное время — страница клуба из части 1. Чипы — только input и type, на загадке не горит ни один.
const H2_EDITS = [
  MINE,
  ["f: { type: 'text', ph: pick(s.phPass), val: 'kodi2026' }, k: 'r', hl: true }]", "f: { type: 'text', ph: pick(s.phPass) }, k: 'r', hl: true }]"],
  ["{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'lab', cap: mine.cap, f: { type: 'text', ph: mine.ph }, k: 'l1', hl: curK === 'input' || curK === 'placeholder', capHl: curK === 'label' },\n      { t: 'lab', cap: pick(s.capPass), f: { type: 'password', val: 'kodi2026' }, k: 'l2', hl: curK === 'type' }];",
    `${clubBlocks(false)}];`],
  ['title={riddle ? pick(s.club) : pick(UI.myForm)} url={riddle ? \'klub.html\' : \'anketa.html\'}', 'title={pick(s.club)} url="klub.html"'],
  ROLES_MAP,
  ROLE_ON
];

export default {
  dir: 'tools/forma6',
  src: 'z6.src.jsx',
  screens: 'z6-screens.jsx',
  lessonId: 'html-06-formy-vvod',
  slug: 'formy-vvod',
  riddleInE1: false,
  lessonTitleParts: [
    { uz: "11-dars. Kiritish maydonlari: input va type", ru: "Урок 11. Поля ввода: input и type", en: "Lesson 11. Input fields: input and type" },
    { uz: "12-dars. Ishora va yozuv: placeholder va label", ru: "Урок 12. Подсказки и подписи: placeholder и label", en: "Lesson 12. Hints and labels: placeholder and label" }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-4B', Comp: S13 },
  { id: 's14', code: 'CHECK-4', Comp: S14 },
  { id: 'q1', code: 'CHECK-5', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // Часть 1 не загадывает загадку: S1 кончается обещанием этой части (про точки в пароле — она научит).
  s1Done: null,
  s1Riddle: {
    uz: "Bu darsda sahifaga shunday maydonlar qo'yishni va ularning turini tanlashni o'rganamiz. Parolning harflari nega nuqtaga aylanishini ham shu yerda bilib olasiz.",
    ru: 'В этом уроке ты научишься ставить на страницу такие поля и выбирать их вид. А ещё поймёшь, почему буквы пароля превращаются в точки.',
    en: 'In this lesson you’ll learn to put fields like these on a page and choose their kind. You’ll also find out why the letters of a password turn into dots.'
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Klub sahifasida uchta maydon bor", ru: 'На странице клуба три поля', en: 'The club page has three fields' },
    next: { uz: 'Keyingi dars: placeholder, label va form', ru: 'Следующий урок: placeholder, label и form', en: 'Next lesson: placeholder, label and form' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Qarang-chi, klub sahifasi jonlandi! Oldin unda faqat yozuvlar turardi, endi esa har bir yozuvning yonida o'zining maydoni bor.",
        ru: 'Смотри, страница клуба ожила! Раньше на ней были одни подписи, а теперь рядом с каждой есть своё поле.',
        en: 'Look, the club page came alive! It used to have only captions, and now every caption has its own field.' } },
      { k: 'input', text: {
        uz: "Bu maydonlarning hammasini bitta teg yasadi: input. U yopuvchi tegsiz yoziladi, ichiga esa kodning o'zi emas, sahifaga kirgan odam yozadi.",
        ru: 'Все эти поля сделал один тег: input. У него нет закрывающего тега, а внутри пишет не код, а тот, кто открыл страницу.',
        en: 'One tag made all these fields: input. It has no closing tag, and what goes inside isn’t written by the code but by the person who opens the page.' } },
      { k: 'type', text: {
        uz: "Maydonlar bir-biridan qanday farq qilishini type atributi hal qiladi. text bo'lsa, yozuv ochiq turadi. number bo'lsa, faqat son yoziladi. password bo'lsa, harflar nuqtalar ortiga yashirinadi.",
        ru: 'А чем поля отличаются друг от друга, решает атрибут type. С text текст виден. С number пишутся только числа. А с password буквы прячутся за точками.',
        en: 'What makes the fields different from each other is the type attribute. With text, the text is visible. With number, only numbers go in. With password, the letters hide behind dots.' } },
      { k: null, text: {
        uz: "Parol maydonini esa o'zingiz yig'dingiz: bo'laklarni to'g'ri tartibda qo'ydingiz. Yopuvchi tegga ham aldanmadingiz, chunki input uni kutmaydi.",
        ru: 'Поле для пароля собрано по порядку, и закрывающий тег никому не понадобился: у input его нет.',
        en: 'You built the password field yourself and put the pieces in order. And you didn’t fall for the extra closing tag, because input doesn’t need one.' } },
      { k: null, text: {
        uz: "Lekin bitta muammo qoldi. Sahifaga kirgan odam bo'sh maydonni ko'radi-yu, unga nima yozishni qayerdan bilsin? Keyingi darsda maydonning ichiga kichkina ishora qo'yamiz, yozuvni maydon bilan bog'laymiz va hammasini bitta anketaga yig'amiz!",
        ru: 'Но остался вопрос. Человек открывает страницу и видит пустое поле: откуда ему знать, что туда писать? На следующем уроке мы научим поле подсказывать, свяжем подпись с полем и соберём всё в одну анкету!',
        en: 'But one problem is left. A person opens the page and sees an empty field: how would they know what to type there? In the next lesson we’ll make the field give a hint, tie each caption to its field and gather everything into one form!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Parol maydonidagi sir', ru: 'Загадка про пароль', en: 'The password riddle' },
    roles: true,
    say: [
      { k: 'type', text: {
        uz: "Salom! O'tgan darsda klub sahifasiga maydonlar qo'ydik: input maydon yasadi, type esa uning turini tanladi. Parol maydonida harflar nuqtaga aylanganini esingizdami?",
        ru: 'Привет! На прошлом уроке мы поставили на страницу клуба поля: input делает поле, а type выбирает его вид. Помнишь, как в поле пароля буквы спрятались за точками?',
        en: 'Hi! Last time we put fields on the club page: input makes a field, and type chooses its kind. Remember how the letters in the password field hid behind dots?' } },
      { k: 'riddle', text: {
        uz: "Endi bitta sir bor. Kecha ukam so'radi: «Parol yozganda harflar nega nuqtaga aylanadi?» Men shoshilib javob berdim: parol maydonida placeholder bor, shuning uchun harflar nuqtaga aylanadi, dedim. Mana, o'sha sahifa: parol maydonining ichida «Parol» degan so'z turibdi.",
        ru: 'Теперь загадка. Я сделал поле для пароля на другой странице, добавил ему атрибут placeholder и написал в нём слово «Пароль». По-моему, теперь пароль сам спрячется за точками.',
        en: 'Now a riddle. On another page I made a password field, added the placeholder attribute to it and wrote the word “Password” in it. I think the password will now hide behind dots by itself.' } },
      { k: 'riddle', text: {
        uz: "Ukam jim qoldi-yu, o'zim tinchimay yuribman: haqiqatan ham shundaymi? Siz nima deb o'ylaysiz, parol endi nuqtalar ortiga yashirinadimi? O'tgan darsda nimalarni o'rganganingizni eslab ko'ring-chi!",
        ru: 'Ну как думаешь, я прав? Вспомни, чему мы научились на прошлом уроке.',
        en: 'So what do you think, am I right? Try to remember what we learned in the last lesson.' } },
      { k: 'riddle', text: {
        uz: "Javobni shu dars oxirida birga topamiz. Buning uchun placeholder nima ekanini, yozuvni maydon bilan qanday bog'lashni va hammasini bitta anketaga qanday yig'ishni o'rganamiz. Ketdik!",
        ru: 'Ответ найдём вместе в конце урока. Для этого узнаем, что такое placeholder, как связать подпись с полем и как собрать всё в одну анкету. Поехали!',
        en: 'We’ll find the answer together at the end of the lesson. First we’ll find out what placeholder is, how to tie a caption to a field and how to gather everything into one form. Let’s go!' } }
    ]
  },
  e1Edits: E1_EDITS,
  h2Edits: H2_EDITS
};
