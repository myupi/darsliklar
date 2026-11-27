// Урок 8 курса CSS «Красивые карточки» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 15 и 16.
// Часть 1 «Скруглённые углы и тени» — s1…s7 (радиус и тень) + вывод E1 (разгадка про border-radius 100px: таблетка, а не круг);
// часть 2 «Границы по сторонам и поломки карточек» — крючок H2 + s8…s15 (border-left/top/…, поломки, w1, своя карточка, q1, итог).
//
// Загадка (Коди даёт широкой карточке border-radius 100px и ждёт круг) — про border-radius и квадратную коробку со 50%
// (ширина и высота — урок 6): материала части 1 хватает, поэтому она разгадывается в E1 (riddleInE1: true). В S15 части 2
// сборщик убирает первую реплику (таблетка), а вторую (riddle2 — круг из квадрата и 50%) — h2Edits: E1 уже показал круг
// целиком, и в S15 она висела бы первой репликой и повторяла E1 (сборщику не хватает поля «убрать реплики S15 части 2»).
// Что в части 1 видел ученик: «Превратить» на s1 (радиус, тень, полоса слева), радиус (s2–s4), тень (s5–s7) — страницы E1 и H2
// показывают именно это; border-left — тема части 2 (в E1 он звучит вопросом, в H2 — один раз как «ещё одно украшение»).

const R16 = "p { border-radius: 16px; }";
const SH = "p { box-shadow: 0px 6px 16px silver; }";

// Общие правки кода, выведенного из S15 (E1 и H2): без «своей карточки» (она собирается только в s14 части 2), чипы — rad и shd.
const COMMON = [
  ["  const store = useStore();\n  const own = [store.get('myRad') || '16px', store.get('myShd') || '0px 6px 16px silver', store.get('myLeft') || '6px solid purple'];\n", ''],
  ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'],
  // В окне кода — тусклая основа, как на остальных экранах части 1.
  ["<KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls=\"kz-code-sm\" />",
    "<KzCode lines={baseL().concat(rows.map((r, i) => cssL('r' + i + r, 1, r, { cls: riddle ? 'is-read' : '' })))} cls=\"kz-code-sm\" />"],
  ["{['rad', 'shd', 'side', 'circ'].map((k) => (", "{['rad', 'shd'].map((k) => ("]
];

const ROWS_OLD = "  const rows = curK === 'riddle' ? ['p { border-radius: 100px; }'] : curK === 'riddle2' ? ['p { width: 100px; height: 100px; border-radius: 50%; }'] : OWN.map((o, i) => 'p { ' + o.prop + ': ' + own[i] + '; }');\n";
const STRIPE = "p { border-left: 6px solid orange; }";

export default {
  course: 'css',
  dir: 'tools/css8',
  src: 'c8.src.jsx',
  screens: 'c8-screens.jsx',
  lessonId: 'css-08-kartochki',
  slug: 'kartochki',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "15-dars. Yumaloq burchaklar va soyalar", ru: 'Урок 15. Скруглённые углы и тени', en: 'Lesson 15. Rounded corners and shadows' },
    { uz: "16-dars. Bir tomondagi chiziq va buzilgan kartochkalar", ru: 'Урок 16. Границы по сторонам и поломки карточек', en: 'Lesson 16. Borders on each side and broken cards' }
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
  // Часть 1 учит радиус и тень; полоса слева, которую ученик видел на s1, — тема следующего урока.
  s1Done: {
    uz: [["Ana shunday kartochkalarni bugun o'zingiz yasaysiz.", "Bu darsda burchaklarni yumaloqlashni va soya berishni o'rganasiz, chap tomondagi chiziqni esa keyingi darsda chizamiz."]],
    ru: [['Сегодня ты научишься делать красивые карточки.', 'В этом уроке ты научишься скруглять углы и давать карточке тень, а полосу слева мы нарисуем на следующем.']],
    en: [['Today you’ll learn to make beautiful cards.', 'In this lesson you’ll learn to round corners and add a shadow, and we’ll draw the stripe on the left next lesson.']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Burchak ham, soya ham tayyor", ru: 'Углы и тень готовы', en: 'Corners and shadow are done' },
    next: { uz: "Keyingi dars: bir tomondagi chiziq va buzilgan kartochkalar", ru: 'Следующий урок: границы по сторонам и поломки карточек', en: 'Next lesson: borders on each side and broken cards' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Qoyil, burchaklaringiz juda yumshoq chiqdi! Endi o'z rejamni sinab ko'raman: border-radius yuz piksel. Voy, kartochka doira emas, tabletka bo'lib qoldi! Esingizdami, ellik pikselda ham shunday edi. Kartochka keng-ku, shuning uchun faqat chetlari yumaloqlanadi, son qancha katta bo'lmasin.",
        ru: 'Отлично, мягкие углы у тебя получились! Теперь проверю свой план: border-radius сто пикселей. Ой, это не круг, а таблетка! Помнишь, при пятидесяти пикселях было так же? Карточка широкая, поэтому скруглились только края, как бы велико ни было число.',
        en: 'Nice, your corners came out really soft! Now let me test my plan: border-radius one hundred pixels. Oops, it’s not a circle, it’s a pill! Remember, fifty pixels looked the same? The card is wide, so only the ends get round, however big the number.' } },
      { k: 'riddle2', text: {
        uz: "Xo'sh, doirani qanday yasaymiz? Buning uchun quti kvadrat bo'lishi kerak: eni bilan bo'yi bir xil, masalan, yuz piksel. Keyin border-radius qiymatini ellik foiz qilamiz. Mana, endi tangadek dumaloq!",
        ru: 'Как же всё-таки получить круг? Коробка должна быть квадратной: ширина и высота одинаковые, например сто пикселей. А border-radius — пятьдесят процентов. Вот теперь круглая, как монета!',
        en: 'So how do we get a circle? The box has to be square: the same width and height, say one hundred pixels. And border-radius is fifty percent. There, now it’s round like a coin!' } },
      { k: 'rad', text: {
        uz: "Bu darsda ikkita bezakni o'rgandik. Birinchisi border-radius bo'ldi: u burchaklarni yumaloqlaydi, son qancha katta bo'lsa, burchak shuncha yumaloq bo'ladi.",
        ru: 'В этом уроке мы освоили две вещи. Первая — border-radius: он скругляет углы, и чем больше число, тем круглее угол.',
        en: 'In this lesson we learned two decorations. The first is border-radius: it rounds the corners, and the bigger the number, the rounder the corner.' } },
      { k: 'shd', text: {
        uz: "Ikkinchisi box-shadow bo'ldi. Uning qiymatida to'rtta bo'lak bor: o'ngga qancha, pastga qancha, xiraligi va rangi. Hammasi bo'sh joy bilan ajratiladi, vergul qo'yilmaydi.",
        ru: 'Вторая — box-shadow. В её значении четыре части: вправо, вниз, размытие и цвет. Они разделяются пробелами, запятых нет.',
        en: 'The second is box-shadow. Its value has four parts: right, down, blur and color. They’re separated by spaces, with no commas.' } },
      { k: 'stripe', text: {
        uz: "Lekin birinchi ekrandagi kartochka esingizdami? Uning chap tomonida to'q sariq chiziq ham bor edi-ku! Nima deb o'ylaysiz, shunday chiziqni faqat bitta tomonga chizish mumkinmi yoki u doim to'rttala tomonga birdan chiqaveradimi?",
        ru: 'А теперь вспомни карточку с первого экрана: слева у неё была оранжевая полоса! Как думаешь, можно ли дать линию только одной стороне, или она всегда появляется со всех четырёх сразу?',
        en: 'Now think back to the card on the first screen: it had an orange stripe on the left! What do you think, can a line go on just one side, or does it always show up on all four at once?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Kartochkaga chiziq yetishmayapti", ru: 'Карточке не хватает линии', en: 'The card needs a line' },
    roles: true,
    say: [
      { k: 'sharp', text: {
        uz: "Voy, bu kartochkani qo'lga olish uchun qo'lqop kerak bo'ladi! Burchaklari shunchalik o'tkirki, barmoqqa sanchilib ketishi hech gap emas.",
        ru: 'Ой, чтобы взять эту карточку в руки, нужны перчатки! Углы такие острые, что можно уколоть палец.',
        en: 'Whoa, you’d need gloves to pick up this card! The corners are so sharp you could prick a finger.' } },
      { k: 'rad', text: {
        uz: "Yaxshiyamki, o'tgan darsda buning davosini topgandik: border-radius burchaklarni yumaloqladi. Mana, endi qo'rqmay ushlasa bo'ladi.",
        ru: 'К счастью, на прошлом уроке мы нашли лекарство: border-radius скруглил углы. Теперь её можно брать без страха.',
        en: 'Luckily, in the last lesson we found the cure: border-radius rounded the corners. Now you can pick it up without fear.' } },
      { k: 'shd', text: {
        uz: "box-shadow esa kartochkani sahifadan sal ko'tarib qo'ydi: pastida yumshoq soya turibdi, kartochka xuddi havoda suzib yurgandek.",
        ru: 'А box-shadow приподнял карточку над страницей: снизу мягкая тень, и карточка будто парит.',
        en: 'And box-shadow lifted the card above the page: a soft shadow underneath, and the card seems to float.' } },
      { k: 'line', text: {
        uz: "Lekin o'tgan darsning boshida kartochkamning chap tomonida to'q sariq chiziq ham bor edi. Bugun uni o'zimiz chizamiz, ustiga kartochkalar qanday buzilishini ham ko'ramiz.",
        ru: 'Но в начале прошлого урока у карточки была ещё и оранжевая полоса слева. Сегодня мы нарисуем её сами, а заодно посмотрим, как карточки ломаются.',
        en: 'But at the start of the last lesson the card also had an orange stripe on the left. Today we’ll draw it ourselves, and also see how cards break.' } }
    ]
  },
  e1Edits: COMMON.concat([
    [ROWS_OLD, `  const rows = curK === 'riddle' ? ['p { border-radius: 100px; }'] : curK === 'riddle2' ? ['p { width: 100px; height: 100px; border-radius: 50%; }'] : curK === 'rad' ? ['${R16}'] : curK === 'shd' ? ['${R16}', '${SH}'] : ['${R16}', '${SH}', '${STRIPE}'];\n`]
  ]),
  // E1 уже разгадал загадку целиком (таблетка и круг): вторая реплика разгадки в S15 части 2 не нужна (первую убирает riddleInE1).
  s15Drop: ['riddle2'],
  h2Edits: [].concat(COMMON, [
    [ROWS_OLD, `  const rows = curK === 'sharp' ? [] : curK === 'rad' ? ['${R16}'] : ['${R16}', '${SH}'];   // «line»: полосы слева ещё нет — её рисуют в этом уроке\n`]
  ])
};
