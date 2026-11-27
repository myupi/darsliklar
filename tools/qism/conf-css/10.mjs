// Урок 10 курса CSS «Flexbox: расположение элементов» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 19 и 20.
// Часть 1 «Включаем flex: направление» — s1…s7 (flex родителю, flex-direction) + вывод E1 (разгадка: flex у карточек
// не ставит их в ряд, у родителя — ставит; тизер про вторую стрелку); часть 2 «Главная и поперечная оси» — крючок H2
// (угадать, куда уйдёт первая карточка при row-reverse) + s8…s15 (оси, поломки, своя полка, итог).
// Разгадка в E1 (riddleInE1): она держится на материале части 1 (flex у родителя), а в S15 части 2 убираются обе её
// реплики (riddle и riddle2) — вторая правится в h2Edits (сборщик убирает только первую), первая оставшаяся реплика
// S15 («Bu esa sizning javoningiz…») получает зачин «Mana,».
const rows = (to) => [
  ["const rows = curK === 'riddle' ? ['.karta { display: flex; }'] : curK === 'riddle2' ? [F] : [F].concat(OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + own[i] + '; }'));", to]
];
const commonEdits = [
  ["  const store = useStore();\n  const own = [store.get('myDir') || 'row', store.get('myBg') || 'gold', store.get('myPad') || '12px'];\n", ''],
  ["<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}>", '<Br title={pick(C.site.title)} url="index.html">'],
  ["rules={riddle ? withBase(rows) : cssParse(rows.join(' '))}", 'rules={withBase(rows)}'],
  ["{['flex', 'dir', 'main', 'cross'].map((k) => (", "{['flex', 'dir'].map((k) => ("]
];

// Разгадка загадки — в выводе части 1: из итога части 2 уходят обе её реплики (riddleInE1 убирает первую, s15Drop — вторую),
// а следующая реплика получает зачин «Mana,» и больше не висит в начале экрана.
const textFixes = [
  ["Bu esa sizning javoningiz, undagi hamma qiymatni o'zingiz tanlagansiz!", "Mana, bu esa sizning javoningiz, undagi hamma qiymatni o'zingiz tanlagansiz!"]
];

export default {
  s15Drop: ['riddle2'],
  textFixes,
  course: 'css',
  dir: 'tools/css10',
  src: 'c10.src.jsx',
  screens: 'c10-screens.jsx',
  lessonId: 'css-10-flexbox-osi',
  slug: 'flexbox-osi',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "19-dars. Qutiga flex beramiz: yo'nalish", ru: 'Урок 19. Включаем flex: направление', en: 'Lesson 19. Turning on flex: direction' },
    { uz: "20-dars. Asosiy va ko'ndalang o'qlar", ru: 'Урок 20. Главная и поперечная оси', en: 'Lesson 20. Main and cross axes' }
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
  // s1.done части 1 не правится: в части 1 ученик и правда учится ставить элементы и в ряд, и в столбик.
  s1Done: null,
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Endi ular qatorda turibdi', ru: 'Теперь они стоят в ряд', en: 'Now they stand in a row' },
    next: { uz: "Keyingi dars: Asosiy va ko'ndalang o'qlar", ru: 'Следующий урок: Главная и поперечная оси', en: 'Next lesson: Main and cross axes' },
    roles: true,
    say: [
      { k: 'riddle2', text: {
        uz: "Mana, endi kartochkalar yonma-yon, bir qatorda turibdi! Esingizdami, dars boshida eski kodimda display flex har bir kartochkaning o'ziga yozilgan edi? Keling, o'sha kodni yana ishga tushirib ko'ramiz.",
        ru: 'Смотри, теперь карточки стоят в ряд! А помнишь, в начале урока в моём старом коде display flex был написан каждой карточке? Давай запустим этот код ещё раз.',
        en: 'Look, now the cards stand in a row! Remember, at the start of the lesson my old code had display flex written on every single card? Let’s run that code again.' } },
      { k: 'riddle', text: {
        uz: "Natijaga qarang: kartochkalar baribir biri ostida biri turibdi! Men adashgan ekanman. Kartochkaga yozilgan flex faqat uning ichidagi matnni tizadi, kartochkalarning o'zini emas.",
        ru: 'Смотри, что вышло: карточки всё равно стоят друг под другом! Я ошибся. Flex, написанный карточке, расставляет только то, что внутри неё, а не сами карточки.',
        en: 'Look what happened: the cards still stand one under another! I was wrong. Flex written on a card arranges only what’s inside it, not the cards themselves.' } },
      { k: 'flex', text: {
        uz: "Kartochkalarni qatorga terish uchun esa flex ularning otasiga yoziladi. Bizda ota javonning o'zi. Shunda bolalar o'zlari yonma-yon tizilib oladi.",
        ru: 'А чтобы поставить карточки в ряд, flex пишут их родителю, то есть самой полке. Тогда дети сами встают рядом.',
        en: 'To put the cards in a row, flex goes on their parent, the shelf itself. Then the children line up side by side on their own.' } },
      { k: 'dir', text: {
        uz: "Qaysi tomonga tizilish kerakligini flex-direction hal qiladi: row kartochkalarni qatorga, column ustunga teradi, reverse qo'shilsa ikkalasi ham teskari bo'ladi.",
        ru: 'В какую сторону выстраиваться, решает flex-direction: row ставит в ряд, column — столбиком, а reverse разворачивает оба в обратную сторону.',
        en: 'Which way to line up is decided by flex-direction: row makes a row, column makes a column, and reverse flips either one.' } },
      { k: null, text: {
        uz: "Endi javonim ham qatorda, ham ustunda tura oladi. Lekin javonning yonidagi ikkita strelkaga qarang-chi: biri to'q sariq, ikkinchisi binafsha. Hozircha biz faqat to'q sariq strelka haqida gaplashdik, binafshasi esa jim turibdi. U nimani ko'rsatarkin? Javobi keyingi darsda.",
        ru: 'Теперь моя полка умеет стоять и в ряд, и столбиком. Но посмотри на две стрелки рядом с ней: одна оранжевая, другая фиолетовая. Пока мы говорили только про оранжевую, а фиолетовая молчит. Что она показывает? Ответ — на следующем уроке.',
        en: 'Now my shelf can stand both in a row and in a column. But look at the two arrows next to it: one orange, one purple. So far we’ve talked only about the orange one, and the purple one stays quiet. What does it show? The answer is in the next lesson.' } }
    ]
  },
  h2: {
    eyebrow: { uz: "Yo'nalish o'yini", ru: 'Угадай направление', en: 'Guess the direction' },
    ask: { uz: 'Birinchi kartochka qayerga ketadi?', ru: 'Куда уйдёт первая карточка?', en: 'Where will the first card go?' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Sizdan bitta iltimosim bor: topib bering-chi! Javonimda kartochkalar qatorda turibdi. Endi flex-direction xususiyatiga row-reverse deb yozaman. Sizningcha, birinchi kartochka qaysi tomonga o'tadi: chapgami yoki o'nggami?",
        ru: 'У меня к тебе просьба: угадай! Карточки на полке стоят в ряд. Сейчас я напишу в flex-direction значение row-reverse. Как думаешь, в какую сторону уйдёт первая карточка: налево или направо?',
        en: 'I have a favor to ask: guess! The cards on the shelf stand in a row. Now I’ll put row-reverse into flex-direction. Which way do you think the first card will go: left or right?' } },
      { k: 'dir', text: {
        uz: "Voy, qarang: birinchi kartochka eng o'ngga o'tib oldi, hammasi o'ngdan chapga tizildi! Javon tagidagi to'q sariq strelka ham shu tomonga burildi. Binafsha strelka-chi? U joyida turibdi.",
        ru: 'Смотри: первая карточка перебралась вправо, все выстроились справа налево! Оранжевая стрелка под полкой тоже развернулась. А вот фиолетовая стоит на месте.',
        en: 'Look: the first card moved to the far right and everything lined up from right to left! The orange arrow under the shelf turned around too. But the purple one stayed put.' } },
      { k: 'dir', text: {
        uz: "Demak, ikki strelka bir xil emas ekan: biri yo'nalish bilan birga o'zgaradi, ikkinchisi esa joyida qoladi. Ular nimani bildiradi? Hozir ikkalasini ham tanib olamiz.",
        ru: 'Выходит, стрелки не одинаковые: одна меняется вместе с направлением, другая остаётся. Что они означают? Сейчас узнаем обе.',
        en: 'So the two arrows are not the same: one changes with the direction, the other stays. What do they mean? Let’s get to know both.' } }
    ]
  },
  e1Edits: commonEdits.concat([
    ...rows("const rows = curK === 'riddle' ? ['.karta { display: flex; }'] : curK === 'dir' ? [F, '.javon { flex-direction: column; }'] : [F];"),
    ["i === 0 ? 'embarrassed' : 'point'", "x.k === 'riddle' ? 'embarrassed' : i === 0 ? 'smile' : 'point'"]
  ]),
  h2Edits: commonEdits.concat([
    ...rows("const rows = curK === 'dir' ? [F, '.javon { flex-direction: row-reverse; }'] : [F];"),
    ["dir: 'column'", "dir: 'row-reverse'"],
    ["pose: i === 0 ? 'hello' :", "pose: i === 0 ? 'curious' :"],
  ])
};
