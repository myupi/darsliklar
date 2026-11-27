// Урок 6 курса CSS «Размеры элементов» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 11 и 12.
// Часть 1 «Ширина в px и в процентах» — s1…s7 + вывод E1 (фото 200px, абзац 50%; в конце — загадка про height: 30px);
// часть 2 «Высота, фото и поломки размеров» — крючок H2 (жалоба клиента про низкий заголовок) + s8…s15.
// Загадка (длинному абзацу дали height: 30px — спрячется ли лишний текст) опирается на высоту, а её учит часть 2:
// разгадка остаётся в S15 части 2 (riddleInE1: false). В части 1 S1 кончается обещанием урока (s1Riddle), а саму загадку
// Коди загадывает в конце вывода E1; в E1 страница с height: 30px не показывается — она выдала бы ответ.
// Проверено: в экранах s1–s7 нет настоящей работы с height (только имя в s1 и «высота подстроится сама» у фото).

const ELS_OLD = "const els = riddle ? site(pick, { long: true, hl: 'p' }) : [{ t: 'img', text: pick(C.site.photo), k: 'i' }, { t: 'p', text: pick(C.site.p1), k: 'p1' }];";

// Страница, которую ученик видел в части 1: заголовок, фото 200px (s3) и абзац 50% (s6). Чипы — только то, что пройдено.
const pageEdits = [
  ["  const store = useStore();\n  const mi = store.get('myImgW') || '160px', mp = store.get('myPW') || '70%';\n", ''],
  ["  const riddle = curK === 'riddle';\n", "  const riddle = false;\n"],
  ["const rows = riddle ? ['img { width: 100px; }', 'p { height: 30px; }'] : ['img { width: ' + mi + '; }', 'p { width: ' + mp + '; }'];",
    "const rows = ['img { width: 200px; }', 'p { width: 50%; }'];"],
  ["const ex = { wh: 'width', unit: '50%', img: '150px' };", "const ex = { unit: '50%', img: '200px' };"],
  ["<Br title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}>", '<Br title={pick(C.site.title)} url="index.html">'],
  ["{['wh', 'unit', 'img'].map((k) => (", "{['unit', 'img'].map((k) => ("]
];

export default {
  course: 'css',
  dir: 'tools/css6',
  src: 'c6.src.jsx',
  screens: 'c6-screens.jsx',
  lessonId: 'css-06-razmery',
  slug: 'razmery',
  riddleInE1: false,
  lessonTitleParts: [
    { uz: "11-dars. Kenglik: piksel va foiz", ru: 'Урок 11. Ширина в px и в процентах', en: 'Lesson 11. Width in px and in percent' },
    { uz: "12-dars. Balandlik, surat va buzilgan o'lchamlar", ru: 'Урок 12. Высота, фото и поломки размеров', en: 'Lesson 12. Height, photos and broken sizes' }
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
  // Часть 1 не загадывает загадку в S1: ученик узнаёт, чему научится в этом уроке (ширина в px и в %); загадка — в конце E1.
  s1Done: null,
  s1Riddle: {
    uz: "Bu darsda suratni ham, abzasni ham o'zimiz xohlagan kenglikka keltirishni o'rganasiz. Oldin pikselda yozamiz, keyin foizda. Ikkalasining farqini esa o'z ko'zingiz bilan ko'rasiz.",
    ru: 'На этом уроке ты научишься делать и фото, и абзац такой ширины, какая нужна. Сначала запишем ширину в пикселях, потом в процентах. А разницу между ними увидишь своими глазами.',
    en: 'In this lesson you’ll learn to make both the photo and the paragraph exactly as wide as you want. First we’ll write the width in pixels, then in percent. And you’ll see the difference between them with your own eyes.'
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Surat va abzasning kengligi', ru: 'Ширина фото и абзаца', en: 'Photo and paragraph width' },
    next: { uz: "Keyingi dars: balandlik, surat va buzilgan o'lchamlar", ru: 'Следующий урок: высота, фото и поломки размеров', en: 'Next lesson: height, photos and broken sizes' },
    roles: true,
    say: [
      { k: 'img', text: {
        uz: "Xo'sh, qancha bo'ldi ekan? Inspektorga bir qarang-chi: tog' surati ikki yuz piksel keng, balandligi esa yuz yigirma besh. Balandlikni biz yozmadik-ku, uni brauzer o'zi hisoblab qo'ydi.",
        ru: 'Ну что, сколько получилось? Посмотри на Инспектор: фото в ширину двести пикселей, а в высоту сто двадцать пять. Высоту мы не писали, её сам посчитал браузер.',
        en: 'So, how big did it come out? Look at the Inspector: the photo is two hundred pixels wide and one hundred twenty-five tall. We never wrote the height; the browser worked it out.' } },
      { k: 'unit', text: {
        uz: "Kenglikni ikki usulda yozdik. Piksel o'zgarmaydi: oyna torayganda ham ikki yuz piksel ikki yuzligicha qoladi. Foiz esa oyna bilan birga o'zgaradi: abzas oyna qanday bo'lmasin, uning yarmini oladi.",
        ru: 'Ширину мы записали двумя способами. Пиксели не меняются: двести пикселей остаются двумястами, даже когда окно сужается. А проценты меняются вместе с окном: абзац занимает половину окна, какое бы оно ни было.',
        en: 'We wrote the width in two ways. Pixels don’t change: two hundred pixels stay two hundred even when the window narrows. Percent changes with the window: the paragraph takes half of the window, whatever size it is.' } },
      { k: null, text: {
        uz: "Demak, suratni ham, abzasni ham kerakli kenglikka keltira olamiz. Lekin sahifada kenglikdan boshqa o'lcham ham bor: balandlik.",
        ru: 'Значит, и фото, и абзац мы можем сделать нужной ширины. Но у страницы есть и другой размер, кроме ширины: высота.',
        en: 'So we can make both the photo and the paragraph as wide as we need. But a page has another size besides width: height.' } },
      { k: null, text: {
        uz: "Mana sizga topishmoq. Sayohat haqidagi uzun abzasimga height o'ttiz piksel berdim. Matn sig'masa, ikki xil bo'lishi mumkin: yashirinib qoladi yoki abzasdan tashqariga chiqib ketadi. Men birinchisiga ishonaman. Siz qaysi biriga ovoz berasiz? Matn qayerga ketganini keyingi darsning oxirida sahifaning o'zida ko'ramiz.",
        ru: 'Вот тебе загадка. Я дал длинному абзацу про путешествие height тридцать пикселей. Если текст не влезет, возможны два варианта: он спрячется или вылезет за абзац. Я верю в первый. А ты за какой? Куда делся текст, увидим на самой странице в конце следующего урока.',
        en: 'Here’s a riddle for you. I gave my long paragraph about the trip height thirty pixels. If the text doesn’t fit, there are two options: it hides, or it spills out of the paragraph. I bet on the first. Which one do you vote for? We’ll see where the text went on the page itself at the end of the next lesson.' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Mijozdan xabar', ru: 'Сообщение от клиента', en: 'A message from a client' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Mijozdan xabar keldi! U shunday yozibdi: «Sayohat sahifangizdagi sarlavha juda past, deyarli ko'rinmayapti. Uni balandroq qilsa bo'ladimi?»",
        ru: 'Пришло сообщение от клиента! Он пишет: «Заголовок на вашей странице про путешествие совсем низкий, его почти не видно. Можно сделать его выше?»',
        en: 'A message from a client! They write: “The heading on your trip page is very low, you can barely see it. Could you make it taller?”' } },
      { k: 'unit', text: {
        uz: "Kenglik bilan ish yurishib ketdi: suratni pikselda, abzasni foizda yozdik. Lekin balandlikni hali bir marta ham o'zgartirmadik.",
        ru: 'С шириной у нас всё получается: фото записали в пикселях, абзац в процентах. А вот высоту мы пока ни разу не меняли.',
        en: 'Width is going well: we set the photo in pixels and the paragraph in percent. But we haven’t changed the height even once yet.' } },
      { k: null, text: {
        uz: "Esingizdami, o'ttiz piksellik topishmoq ham javobini kutib turibdi. Shunday kelishamiz: oldin mijozning iltimosini bajarib, balandlikni o'rganamiz, topishmoqni esa dars oxirida hal qilamiz.",
        ru: 'Помнишь, загадка про тридцать пикселей тоже ждёт ответа. Договоримся так: сначала выполним просьбу клиента и разберёмся с высотой, а загадку решим в конце урока.',
        en: 'Remember, the riddle about thirty pixels is still waiting for an answer. Let’s agree like this: first we’ll do the client’s request and figure out height, and we’ll solve the riddle at the end of the lesson.' } }
    ]
  },
  // E1: подсветка фото на словах про фото и абзаца на словах про px и % (Инспектор показывает размеры подсвеченного).
  e1Edits: pageEdits.concat([
    [ELS_OLD, "const els = site(pick, { hl: curK === 'img' ? 'img' : curK === 'unit' ? 'p' : null });"],
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"]
  ]),
  // H2: на жалобе клиента горит заголовок (его просят сделать выше), на словах про ширину — абзац.
  h2Edits: pageEdits.concat([
    [ELS_OLD, "const els = site(pick, { hl: curK === 'unit' ? 'p' : 'h1' });"]
  ])
};
