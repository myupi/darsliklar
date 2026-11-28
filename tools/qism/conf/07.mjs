// Урок 7 «Формы, часть 2: выбор и отправка» двумя частями (tools/qism/build.mjs): часть 1 — select и option, textarea
// (s1–s7 + вывод E1), часть 2 — button и своя анкета (крючок H2 + s8–s15). Загадка (Коди написал игры внутри select
// без option) разгадывается в E1 на материале части 1: s2 (пустой список, пункты option), s3 (строка Shaxmat без имени тега
// в списке не появилась). В E1 и H2 рисуется клубная анкета из части 1 — список игр и большое поле «О себе»; кнопки на ней нет
// (кнопка — тема части 2), своей анкеты ученика нет (она собирается в части 2).
const clubForm = [
  // Нет «своей анкеты» (она собирается в части 2): E1 и H2 показывают анкету клуба из части 1.
  ["  const mine = useMine7();\n", ''],
  ['const games = pick(s.games).slice(0, 2);', 'const games = pick(s.games);'],
  ["{ t: 'h1', parts: pick(UI.myForm), k: 'h' }, { t: 'sel', opts: games.concat([mine.opt]), val: mine.opt, open: curK === 'option', hl: curK === 'select', k: 'm' },",
    "{ t: 'h1', parts: pick(s.club), k: 'h' }, { t: 'p', parts: pick(s.capGame), k: 'cg' }, { t: 'sel', opts: games, val: games[1], open: curK === 'option', hl: curK === 'select', k: 'm' },"],
  // Окно браузера — страница клуба, а не «Моя анкета».
  ["<Br title={riddle ? pick(s.club) : pick(UI.myForm)} url={riddle ? 'klub.html' : 'anketa.html'}>", '<Br title={pick(s.club)} url="klub.html">'],
  // Чипы ролей — только то, что учили в части 1 (button — часть 2).
  ['{S15_ROLES.map((k) => (', '{S15_ROLES.slice(0, 3).map((k) => (']
];
const pageTail = "{ t: 'ta', ph: pick(s.phAbout), hl: curK === 'textarea', k: 't' }, { t: 'btn', text: mine.btn, hl: curK === 'button', k: 'b' }];";

export default {
  dir: 'tools/forma7',
  src: 'z7.src.jsx',
  screens: 'z7-screens.jsx',
  lessonId: 'html-07-formy-vybor',
  slug: 'formy-vybor',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "13-dars. Tanlash ro'yxati va katta maydon", ru: "Урок 13. Список выбора и большое поле", en: "Lesson 13. A choice list and a big field" },
    { uz: "14-dars. Tugma va o'z anketangiz", ru: "Урок 14. Кнопка и своя анкета", en: "Lesson 14. A button and your own form" }
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
  // Часть 1: загадка задаётся как раньше, но «в этой части» (в части 1 — только список и большое поле, кнопка и своя анкета — в части 2).
  // По-узбекски в исходнике нет обещания «ответ найдём в конце» — добавлено (как в русском и английском), иначе E1 разгадывает то, что не обещали.
  s1Done: {
    uz: [["Bugun ro'yxat, katta maydon va tugma yasaymiz.", "Bu darsda ro'yxat va katta maydon yasaymiz."],
      ["Sizningcha, qaysi biri ro'yxatni chiqaradi?", "Sizningcha, qaysi biri ro'yxatni chiqaradi? Javobni shu dars oxirida birga topamiz."]],
    ru: [['Сегодня ты научишься делать такой список, большое поле и кнопку и сделаешь свою анкету.', 'В этом уроке ты научишься делать такой список и большое поле.'], ['в конце урока', 'в конце урока']],
    en: [['Today you’ll learn to make a list like this, a big field and a button, and you’ll make your own form.', 'In this lesson you’ll learn to make a list like this and a big field.'], ['at the end of the lesson', 'at the end of the lesson']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Anketa: ro'yxat va katta maydon", ru: 'Анкета: список и большое поле', en: 'The form: a list and a big field' },
    next: { uz: "Keyingi dars: button va o'z anketangiz", ru: 'Следующий урок: button и своя анкета', en: 'Next lesson: button and your own form' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Endi sirni ochamiz! Esingizdami, men o'yinlarni select ichiga shunchaki yozib qo'ygandim va ro'yxat uchta o'yin bilan to'ladi deb o'ylagandim? Mana, sahifaga qarang: ro'yxat bo'm-bo'sh turibdi! Shaxmat qatorida ham xuddi shunday bo'lgan edi-ku: tegning nomi bo'lmasa, brauzer qatorni variant deb bilmagan. Demak, yanglishibman: har bir variant o'zining option tegi ichida turishi shart.",
        ru: 'Раскроем загадку. Помнишь, я просто написал названия игр внутри select и думал, что список заполнится тремя играми? Смотри на страницу: список совсем пустой! С Шахматами было так же: без имени тега браузер не считал строку вариантом. Значит, я ошибся: каждый вариант должен стоять внутри option.',
        en: 'Time to solve the riddle. Remember, I just wrote the game names inside select and thought the list would fill up with three games? Look at the page: the list is completely empty! It was the same with Chess: without a tag name, the browser didn’t treat the line as a choice. So I was wrong: every choice has to sit inside its own option.' } },
      { k: null, text: {
        uz: "Mana, endi to'g'ri yozilgan anketa! Ro'yxat ham, katta maydon ham o'z joyida.",
        ru: 'А вот анкета, собранная правильно: и список, и большое поле на месте!',
        en: 'And here is the form put together the right way: the list and the big field are both in place!' } },
      { k: 'select', text: {
        uz: "Butun ro'yxatni select tegi yasaydi. Uni kichkina strelkasidan tanib olasiz: bossangiz, ro'yxat ochiladi.",
        ru: 'Весь список делает тег select. Его легко узнать по маленькой стрелке: нажми на неё, и список раскроется.',
        en: 'The whole list is made by the select tag. You can spot it by the little arrow: tap it, and the list opens.' } },
      { k: 'option', text: {
        uz: "Ro'yxatning har bir qatorini option tegi yasaydi. Variantlar kodda qaysi tartibda turgan bo'lsa, ro'yxatda ham shu tartibda chiqadi.",
        ru: 'Каждую строку списка делает option. Варианты идут в том порядке, в каком стоят в коде.',
        en: 'Each line of the list is made by option. The choices appear in the same order as in the code.' } },
      { k: 'textarea', text: {
        uz: "Uzun gap input tegiga sig'maydi-ku, shuning uchun katta maydonni textarea yasaydi. Uni yopuvchi teg bilan yozishni esdan chiqarmang.",
        ru: 'Длинное предложение не влезает в input, поэтому большое поле делает textarea. И не забывай про закрывающий тег.',
        en: 'A long sentence doesn’t fit in input, so the big field is made by textarea. And don’t forget its closing tag.' } },
      { k: null, text: {
        uz: "Lekin bitta narsa yetishmayapti: odam o'yinni tanladi, o'zi haqida yozdi, endi javobini nima bilan yuboradi? Buni keyingi darsda topamiz, undan keyin o'z anketangizni ham yig'amiz!",
        ru: 'Но кое-чего не хватает: человек выбрал игру, написал о себе, а чем отправить ответ? Это узнаем на следующем уроке, а потом соберём твою собственную анкету!',
        en: 'But something is still missing: a person picked a game and wrote about themselves, so what do they send the answer with? We’ll find out in the next lesson, and then build your own form!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Anketa hali tugmasiz', ru: 'Анкета пока без кнопки', en: 'The form has no button yet' },
    roles: true,
    say: [
      { k: 'select', text: {
        uz: "Salom! O'tgan darsda klub anketasini tuzatdik. Esingizdami, men o'yinlarni option tegisiz yozib adashgan edim? Endi har bir o'yin o'zining option tegi ichida turibdi, shuning uchun ro'yxat to'la.",
        ru: 'Привет! На прошлом уроке мы починили анкету клуба. Помнишь, я написал игры без option и ошибся? Теперь каждая игра стоит в своём option, и список заполнен.',
        en: 'Hi! In the last lesson we fixed the club form. Remember, I wrote the games without option and got it wrong? Now every game sits in its own option, and the list is full.' } },
      { k: 'textarea', text: {
        uz: "Uzun gap uchun esa textarea bilan katta maydon yasadik, endi hech narsa yashirinib qolmaydi.",
        ru: 'А для длинного рассказа о себе сделали большое поле textarea, и теперь ничего не прячется.',
        en: 'And for a long story about yourself we made a big textarea field, so nothing gets hidden any more.' } },
      { k: 'send', text: {
        uz: "Lekin pastga qarang-chi: o'yinni tanladik, gapni yozdik, endi nimani bosamiz? Hozircha hech narsa yo'q-ku!",
        ru: 'Но посмотри вниз: игру выбрали, рассказ написали, а что нажимать? Пока ничего нет!',
        en: 'But look down below: we picked the game, we wrote the story, so what do we tap? There’s nothing there yet!' } },
      { k: null, text: {
        uz: "Nima deb o'ylaysiz, anketani yuborish uchun unga nima kerak bo'larkin? Qani, ko'ramiz!",
        ru: 'Как думаешь, что нужно анкете, чтобы её можно было отправить? Давай посмотрим!',
        en: 'What do you think the form needs so that it can be sent? Let’s find out!' } }
    ]
  },
  // E1 — без кнопки (кнопка — часть 2). H2 — без кнопки, на её месте подсвечивается пустое место (реплика «send»).
  e1Edits: clubForm.concat([[pageTail, "{ t: 'p', parts: pick(s.capAbout), k: 'ca' }, { t: 'ta', val: pick(s.about), hl: curK === 'textarea', k: 't' }];"]]),
  h2Edits: clubForm.concat([[pageTail, "{ t: 'p', parts: pick(s.capAbout), k: 'ca' }, { t: 'ta', val: pick(s.about), hl: curK === 'textarea', k: 't' }, { t: 'none', hl: curK === 'send', k: 'n' }];"]])
};
