// Урок 9 курса CSS «Как элементы ведут себя на странице» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 17 и 18.
// Часть 1 «div и span: block, inline и none» — s1…s7 (div и span, блочные и строчные, display: block / inline / none) + вывод E1;
// часть 2 «inline-block и поломки display» — крючок H2 + s8…s15 (inline-block, поломки, w1, своё меню, q1, итог).
// Граница сдвинута против таблицы брифа: none учится на s5–s7 (часть 1), поэтому в названии части 2 его нет, а в названии части 1 есть.
//
// Загадка (width: 120px у ссылок — ждём равные кнопки) разгадывается тем, что строчный элемент width не принимает, а с
// display: inline-block принимает — это тема s8–s10 части 2 (на s2 ученик видел только то, что узкий div остаётся на своей
// строке). Поэтому riddleInE1: false: S1 части 1 загадку не загадывает (s1Riddle), её загадывает H2, разгадка — в S15 части 2.

const PGE = "site(pick, tease ? { hl: 'a', noP: true } : { page: 'box', hl: curK === 'blk' ? 'div' : curK === 'inl' ? 'span' : null })";

// Общее для E1 и H2: без «своего меню» (оно собирается в s14 части 2), чипы — только пройденное: block, inline, none.
const COMMON = [
  ["  const store = useStore();\n  const own = [store.get('myDisp') || 'inline-block', store.get('myW') || '100px', store.get('myBg') || 'gold'];\n", ''],
  ["{['blk', 'inl', 'ib', 'none'].map((k) => (", "{['blk', 'inl', 'none'].map((k) => ("]
];
const RIDDLE_OLD = "  const riddle = curK === 'riddle' || curK === 'riddle2';\n  const W = 'a { width: 120px; }';\n  const rows = curK === 'riddle' ? [W] : curK === 'riddle2' ? [W, 'a { display: inline-block; }'] : OWN.map((o, i) => 'a { ' + o.prop + ': ' + own[i] + '; }');\n";
const BR_OLD = "<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}><CssPage els={site(pick, { hl: riddle ? 'a' : null, noP: true })} rules={riddle ? withBase(rows) : cssParse(rows.join(' '))} insp={riddle} /></Br>";
const CODE_OLD = "<KzCode lines={rows.map((r, i) => cssL('r' + i, 0, r, { cls: riddle ? 'is-read' : '' }))} cls=\"kz-code-sm\" />";
// В окне кода — тусклая основа страницы, как на остальных экранах части 1.
const codeNew = (pg) => `<KzCode lines={baseL(${pg}).concat(rows.map((r, i) => cssL('r' + i + r, 1, r, { cls: riddle ? 'is-read' : '' })))} cls="kz-code-sm" />`;

export default {
  course: 'css',
  dir: 'tools/css9',
  src: 'c9.src.jsx',
  screens: 'c9-screens.jsx',
  lessonId: 'css-09-display',
  slug: 'display',
  riddleInE1: false,
  lessonTitleParts: [
    { uz: "17-dars. div va span: block, inline va none", ru: 'Урок 17. div и span: block, inline и none', en: 'Lesson 17. div and span: block, inline and none' },
    { uz: "18-dars. inline-block va display buzilganda", ru: 'Урок 18. inline-block и поломки display', en: 'Lesson 18. inline-block and broken display' }
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
  // Часть 1 не загадывает загадку про width: S1 кончается обещанием этой части (div и span, как они стоят на странице).
  s1Done: null,
  s1Riddle: {
    uz: "Bu darsda ikkita yangi teg bilan tanishamiz: div va span. Ikkalasi sahifada butunlay boshqacha turadi: biri butun qatorni band qiladi, ikkinchisi esa faqat o'z matnicha joy oladi. Nega shunday ekan? Buni birga aniqlaymiz.",
    ru: 'В этом уроке ты познакомишься с двумя новыми тегами: div и span. Ведут они себя на странице совсем по-разному: один занимает всю строку, другой — только место по своему тексту. Почему так? Сейчас разберёмся.',
    en: 'In this lesson you’ll meet two new tags: div and span. They behave very differently on a page: one takes the whole line, the other only the room its text needs. Why is that? Let’s find out.'
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Elementlar ikki guruhga bo'lindi", ru: 'Элементы разделились на две группы', en: 'Elements split into two groups' },
    next: { uz: "Keyingi dars: inline-block va buzilgan display", ru: 'Следующий урок: inline-block и поломки display', en: 'Next lesson: inline-block and broken display' },
    roles: true,
    say: [
      { k: 'blk', text: {
        uz: "Xo'sh, bu darsda sahifadagi hamma narsani ikki guruhga ajratdik. Birinchisi block elementlar: div, abzas va sarlavha. Ularning har biri butun qatorni band qiladi, shuning uchun hammasi ustma-ust, ustundek terilib turadi.",
        ru: 'Итак, в этом уроке мы разделили все элементы страницы на две группы. Первая — блочные, block: div, абзац и заголовок. Каждый занимает всю строку, поэтому они стоят друг под другом, как в столбик.',
        en: 'So in this lesson we split every element on the page into two groups. The first is block elements: div, paragraphs and headings. Each takes the whole line, so they stand one under another, like a column.' } },
      { k: 'inl', text: {
        uz: "Ikkinchi guruh inline elementlar bo'ladi: span va havola. Ular faqat o'z matnicha joy oladi, shuning uchun so'zlardek yonma-yon, bir qatorga tushaveradi.",
        ru: 'Вторая — строчные, inline: span и ссылка. Они занимают место только по своему тексту, поэтому стоят рядом, как слова в строке.',
        en: 'The second group is inline elements: span and links. They take only as much room as their text, so they sit side by side, like words in a line.' } },
      { k: 'none', text: {
        uz: "Bu ikki xil turishni display xususiyati belgilab beradi. Uning none qiymati esa elementni butunlay yashirib qo'yadi: sahifada o'rni ham qolmaydi.",
        ru: 'Как именно стоит элемент, решает свойство display. А его значение none прячет элемент совсем: на странице не остаётся даже места.',
        en: 'How an element stands is decided by the display property. And its value none hides the element completely: it doesn’t even leave room on the page.' } },
      { k: 'tease', text: {
        uz: "Lekin bitta narsa bu rasmga sig'mayapti: menyudagi havolalar hali ham mitti-mitti, ularni bir xil tugmalarga aylantirib bo'lmayapti. Nimadir mos kelmayapti!",
        ru: 'Но кое-что в эту картину не помещается: ссылки в моём меню всё ещё крошечные, и одинаковых кнопок из них не получается. Что-то не сходится!',
        en: 'But something doesn’t fit this picture: the links in my menu are still tiny, and I can’t make equal buttons out of them. Something doesn’t add up!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Hiyla: faqat width", ru: 'Хитрость: только width', en: 'The trick: only width' },
    roles: true,
    say: [
      { k: 'what', text: {
        uz: "Nima bo'larkin, agar menyudagi havolalarni yashirib qo'ysam? Qani, display none yozib ko'raman.",
        ru: 'А что будет, если спрятать ссылки меню? Попробую написать display none.',
        en: 'What happens if I hide the menu links? Let me try writing display none.' } },
      { k: 'hide', text: {
        uz: "Mana! Hammasi g'oyib bo'ldi, sahifada faqat sarlavha qoldi. O'tgan darsda none aynan shuni qilishini bilgan edik.",
        ru: 'Вот! Всё исчезло, на странице остался только заголовок. На прошлом уроке мы узнали, что none так и делает.',
        en: 'There! Everything disappeared, only the heading is left. In the last lesson we learned that none does exactly that.' } },
      { k: 'plan', text: {
        uz: "Endi havolalarni joyiga qaytaraman. Inspektorga qarang-chi: uchalasining kengligi uch xil, men esa ularni teng tugmalarga aylantirmoqchiman. Menda vaqtni tejaydigan bir hiyla bor: har bir havolaga faqat width yuz yigirma piksel beraman, boshqa hech narsa yozmayman. Hammasi teng bo'lib qolishi kerak-ku!",
        ru: 'Возвращаю ссылки на место. Смотри в Инспектор: ширина у всех трёх разная, а я хочу сделать из них одинаковые кнопки. У меня есть хитрость, чтобы сэкономить время: даю каждой ссылке только width сто двадцать пикселей и больше ничего не пишу. Все должны стать равными, разве нет?',
        en: 'I’m putting the links back. Look at the Inspector: all three widths are different, and I want equal buttons. I have a time-saving trick: I give each link only width one hundred twenty pixels and write nothing else. They should all become equal, right?' } },
      { k: 'think', text: {
        uz: "Siz nima deb o'ylaysiz, hiylam ishlaydimi? Javobni hozir aytmayman: dars oxirida Inspektorning o'zi hal qiladi.",
        ru: 'Как думаешь, моя хитрость сработает? Ответ пока не скажу: в конце урока его покажет сам Инспектор.',
        en: 'What do you think, will my trick work? I won’t say yet: at the end of the lesson the Inspector itself will show.' } }
    ]
  },
  e1Edits: COMMON.concat([
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"],
    [RIDDLE_OLD, `  const tease = curK === 'tease', riddle = false;
  const rows = curK === 'blk' ? ['div { display: block; }'] : curK === 'inl' ? ['span { display: inline; }'] : curK === 'none' ? ['div { display: none; }'] : [];
`],
    [BR_OLD, `<Br title={pick(C.site.title)} url="index.html"><CssPage els={${PGE}} rules={withBase(rows, tease ? 'site' : 'box')} insp={tease || curK === 'blk' || curK === 'inl'} /></Br>`],
    [CODE_OLD, codeNew("tease ? 'site' : 'box'")]
  ]),
  h2Edits: COMMON.concat([
    [RIDDLE_OLD, `  const tease = curK === 'plan' || curK === 'think', riddle = false;   // tease — «ссылки на месте»: подсвечены, Инспектор меряет
  const rows = curK === 'hide' ? ['a { display: none; }'] : [];
`],
    [BR_OLD, `<Br title={pick(C.site.title)} url="index.html"><CssPage els={site(pick, { hl: tease ? 'a' : null, noP: true })} rules={withBase(rows)} insp={tease} /></Br>`],
    [CODE_OLD, codeNew("'site'")]
  ])
};
