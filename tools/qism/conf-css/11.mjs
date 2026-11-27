// Урок 11 курса CSS «Flexbox: выравнивание» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 21 и 22.
// Часть 1 «justify-content и align-items» — s1…s7 (оси выравнивания) + вывод E1 (разгадка: justify-content: center
// в ряду ставит по центру слева направо, сверху вниз — align-items; вопрос «а если карточек шесть» (шесть карточек покажет s8));
// часть 2 «gap, flex-wrap и поломки» — крючок H2 (тесный ряд: карточки слиплись и просят места) + s8…s15.
// Разгадка в E1 (riddleInE1): она целиком на материале части 1; в S15 части 2 убираются обе её реплики (riddle и riddle2) —
// вторая правится в h2Edits (сборщик убирает только первую), первая оставшаяся реплика S15 («Bu esa sizning javoningiz…»)
// получает зачин «Mana,».
const commonEdits = [
  ["  const store = useStore();\n  const own = [store.get('myJ') || 'space-between', store.get('myA') || 'center', store.get('myGap') || '12px'];\n", ''],
  ["<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}>", '<Br title={pick(C.site.title)} url="index.html">'],
  ["{['jc', 'ai', 'gap', 'wrap'].map((k) => (", "{['jc', 'ai'].map((k) => ("]
];
const ROWS = "const rows = curK === 'riddle' ? [J('center')] : curK === 'riddle2' ? [A('center')] : OWN.map((o, i) => o.sel + ' { ' + o.prop + ': ' + own[i] + '; }');";

// Разгадка загадки — в выводе части 1: из итога части 2 уходят обе её реплики (riddleInE1 убирает первую, s15Drop — вторую),
// а следующая реплика получает зачин «Mana,» и больше не висит в начале экрана.
const textFixes = [
  ["Bu esa sizning javoningiz, o'zingiz tanlagan qiymatlar bilan tekislangan!", "Mana, bu esa sizning javoningiz, o'zingiz tanlagan qiymatlar bilan tekislangan!"]
];

export default {
  s15Drop: ['riddle2'],
  textFixes,
  course: 'css',
  dir: 'tools/css11',
  src: 'c11.src.jsx',
  screens: 'c11-screens.jsx',
  lessonId: 'css-11-flexbox-vyravnivanie',
  slug: 'flexbox-vyravnivanie',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: '21-dars. justify-content va align-items', ru: 'Урок 21. justify-content и align-items', en: 'Lesson 21. justify-content and align-items' },
    { uz: '22-dars. gap, flex-wrap va buzilgan qoidalar', ru: 'Урок 22. gap, flex-wrap и поломки', en: 'Lesson 22. gap, flex-wrap and broken rules' }
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
  // Часть 1: в s1 показаны три свойства, а в этом уроке — два; gap остаётся на следующий урок.
  s1Done: {
    uz: [["Bugun siz ham flex qutidagi narsalarni xuddi shunday tekislashni o'rganasiz.", "Bu darsda ulardan ikkitasini o'rganamiz: biri asosiy o'q bo'ylab, ikkinchisi ko'ndalang o'q bo'ylab tekislaydi. Bo'sh joy qo'yadigani esa keyingi darsda."]],
    ru: [['Сегодня ты научишься выравнивать элементы во flex-коробке.', 'В этом уроке ты научишься двум видам выравнивания: по главной оси и по поперечной. А промежутки между карточками оставим на следующий урок.']],
    en: [['Today you’ll learn to align elements in a flex box.', 'In this lesson you’ll learn two kinds of alignment: along the main axis and along the cross axis. The gaps between the cards can wait for the next lesson.']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Javon tartibga tushdi', ru: 'Полка в порядке', en: 'The shelf is tidy' },
    next: { uz: 'Keyingi dars: gap, flex-wrap va buzilgan qoidalar', ru: 'Следующий урок: gap, flex-wrap и поломки', en: 'Next lesson: gap, flex-wrap and broken rules' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Qoyil, javon endi juda tartibli turibdi! Dars boshidagi bahsimiz esingizdami? Men kartochkalarni tepadan pastga o'rtaga qo'ymoqchi bo'lib, justify-content center yozgan edim. Mana, natijasi: ular chapdan o'ngga o'rtaga keldi, tepadan pastga esa joyida qoldi. Adashgan ekanman!",
        ru: 'Здорово, полка теперь в полном порядке! Помнишь наш спор? Чтобы поставить карточки посередине сверху вниз, я написал justify-content center. Смотри: они встали посередине слева направо, а сверху вниз остались на месте. Я ошибся!',
        en: 'Great, the shelf is in perfect order now! Remember our argument? To center the cards top to bottom, I wrote justify-content center. Look: they centered left to right, but stayed in place top to bottom. I was wrong!' } },
      { k: 'riddle2', text: {
        uz: "Tepadan pastga o'rtaga qo'yish uchun esa align-items center kerak ekan. Mana, kartochkalar javon balandligining o'rtasidan joy oldi: tepasida ham, pastida ham bir xil joy qoldi.",
        ru: 'А чтобы поставить посередине сверху вниз, нужен был align-items center. Вот: карточки встали посередине по высоте, сверху и снизу места поровну.',
        en: 'To center them top to bottom, I needed align-items center. There: the cards sit in the middle of the shelf’s height, with equal room above and below.' } },
      { k: 'jc', text: {
        uz: "Demak, justify-content kartochkalarni asosiy o'q bo'ylab suradi. Qatorda bu o'q chapdan o'ngga ketadi, shuning uchun kartochkalar chapga-o'ngga ko'chadi.",
        ru: 'Значит, justify-content двигает карточки по главной оси. В ряду она идёт слева направо, поэтому карточки смещаются влево и вправо.',
        en: 'So justify-content moves the cards along the main axis. In a row it runs left to right, so the cards shift left and right.' } },
      { k: 'ai', text: {
        uz: "align-items esa kartochkalarni ko'ndalang o'q bo'ylab suradi. Qatorda bu o'q tepadan pastga ketadi, shuning uchun kartochkalar tepaga, o'rtaga yoki pastga ko'chadi.",
        ru: 'А align-items двигает их по поперечной оси. В ряду она идёт сверху вниз, поэтому карточки смещаются вверх, в середину или вниз.',
        en: 'And align-items moves them along the cross axis. In a row it runs top to bottom, so the cards shift up, to the middle or down.' } },
      { k: null, text: {
        uz: "Lekin javonga yana uchta kartochka qo'shsam-chi? Oltita kartochka bir qatorga qanday sig'arkin, sizningcha? Bir-biriga yopishib qolmaydimi?",
        ru: 'А что, если я добавлю на полку ещё три карточки? Как думаешь, как шесть карточек поместятся в один ряд? Не слипнутся ли?',
        en: 'But what if I add three more cards to the shelf? How do you think six cards will fit in one row? Won’t they stick together?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Tiqilinch', ru: 'Тесный ряд', en: 'A crowded row' },
    ask: { uz: 'Kartochkalarga nima yetishmayapti?', ru: 'Чего не хватает карточкам?', en: 'What do the cards need?' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Qarang, bu qator tiqilib qolibdi! Kartochkalar bir-biriga yopishib turibdi, go'yo «Bizga joy bering!» deb so'rayotgandek. Sizningcha, ularga nima kerak?",
        ru: 'Смотри, этот ряд совсем тесный! Карточки прижались друг к другу, будто просят: «Дайте нам место!» Как думаешь, что им нужно?',
        en: 'Look, this row is really crowded! The cards are pressed against each other, as if asking: “Give us some room!” What do you think they need?' } },
      { k: null, text: {
        uz: "justify-content bilan align-items kartochkalarni javonda surib qo'yadi, lekin oralariga bo'sh joy qo'ya olmaydi. Buning uchun boshqa xususiyat kerak. Uni topsak, qator yengil nafas oladi.",
        ru: 'justify-content и align-items двигают карточки по полке, но не ставят промежутки между ними. Для этого нужно другое свойство. Найдём его, и ряду сразу станет легче дышать.',
        en: 'justify-content and align-items move the cards around the shelf, but they don’t put gaps between them. That takes a different property. Once we find it, the row can breathe easier.' } }
    ]
  },
  e1Edits: commonEdits.concat([
    [ROWS, "const rows = curK === 'riddle' ? [J('center')] : curK === 'riddle2' ? [A('center')] : curK === 'jc' ? [J('space-between')] : curK === 'ai' ? [A('flex-end')] : [J('center'), A('center')];"],
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"]
  ]),
  h2Edits: commonEdits.concat([
    [ROWS, 'const rows = BASES.shelf;'],
    ["pose: i === 0 ? 'hello' :", "pose: i === 0 ? 'wonder' :"],
  ])
};
