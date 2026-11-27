// Урок 14 курса CSS «Плавные эффекты» двумя частями (tools/qism/build.mjs 14 css): сквозные уроки 27 и 28.
// Часть 1 «transition: время и свойства» — s1…s7 + вывод E1 (разгадка: transition в :hover уходит вместе с мышкой);
// часть 2 «s и ms, linear и ease, поломки» — крючок H2 (быстро и медленно) + s8…s15.
// Разрез — после второй тройки (время s2–s4, свойство s5–s7). Загадка про transition внутри :hover решается в части 1:
// для разгадки хватает transition со свойством и временем (правило `.tugma { transition … }` ученик видит в каждом задании
// s3/s6), а «увидишь в конце урока» из w1 части 2 остаётся верным — тот же показ (правило самой кнопки) там снова в s15.

// В E1 и H2 показывается игра Коди из части 1, а не «своя кнопка» части 2 (s14); чипы — только пройденное.
const COMMON = [
  ["  const store = useStore();\n  const own = [store.get('myTf') || 'scale(1.2)', store.get('myDur') || '0.3s', store.get('myFn') || 'ease'];\n", ''],
  ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'],
  // «ms» — тема части 2: подпись чипа «время» без него
  ['<span translate="no">{pick(c.roles[k])}</span>',
    `<span translate="no">{pick(k === 'time' ? L3("vaqt: soniya, s", 'время: секунды, s', 'time: seconds, s') : c.roles[k])}</span>`]
];

// Зачин первой реплики итога части 2 после удаления разгадки (uz).
const textFixes = [
  ["Endi transition qatorini tugmaning o'z qoidasiga ko'chiramiz.", "Esingizdami, transition qatorini hover qoidasining ichiga yozgan edim? Endi uni tugmaning o'z qoidasiga ko'chiramiz."]
];

export default {
  textFixes,
  course: 'css',
  dir: 'tools/css14',
  src: 'c14.src.jsx',
  screens: 'c14-screens.jsx',
  lessonId: 'css-14-transition',
  slug: 'transition',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "27-dars. transition: vaqt va xususiyat", ru: 'Урок 27. transition: время и свойства', en: 'Lesson 27. transition: time and properties' },
    { uz: "28-dars. s va ms, linear va ease, buzilgan kod", ru: 'Урок 28. s и ms, linear и ease, поломки', en: 'Lesson 28. s and ms, linear and ease, broken code' }
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
  // S1.done не называет часть: «Bugun siz ham tugmalarni … silliq qilishni o'rganasiz» + загадка «dars oxirida» — верно для части 1.
  s1Done: null,
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Tugma endi silliq', ru: 'Кнопка теперь плавная', en: 'The button is smooth now' },
    next: { uz: 'Keyingi dars: ms, linear va ease', ru: 'Следующий урок: ms, linear и ease', en: 'Next lesson: ms, linear and ease' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Mana, tugma silliq o'syapti! Garovimiz esingizdami? Men transition qatorini hover qoidasining ichiga yozgan edim. Qarang: tugma kattalashganda silliq, lekin sichqoncha ketishi bilan birdaniga sakrab qaytyapti! Garovni men yutqazdim. Sababi shuki, sichqoncha ketishi bilan hover qoidasi o'chib qoladi, transition ham u bilan birga ketadi.",
        ru: 'Смотри, кнопка плавно растёт! Помнишь мою загадку? Я написал transition внутри правила с hover и думал, что плавно будет в обе стороны. Смотри: растёт плавно, а когда мышка уходит, кнопка прыгает обратно сразу! Я ошибся. Как только мышка уходит, правило с hover выключается, и transition уходит вместе с ним.',
        en: 'Look, the button grows smoothly! Remember my riddle? I put transition inside the hover rule and thought it would be smooth both ways. Look: it grows smoothly, but when the mouse leaves, the button jumps back at once! I was wrong. As soon as the mouse leaves, the hover rule switches off, and transition goes with it.' } },
      { k: 'place', text: {
        uz: "Sizning transition qatoringiz esa tugmaning o'z qoidasida turibdi. U sichqoncha kelsa ham, ketsa ham ishlab turadi, shuning uchun sizning tugmangiz ikki tomonga ham silliq.",
        ru: 'А в твоей кнопке transition стоит в её собственном правиле. Оно действует всегда: мышка приходит или уходит — кнопка плавная в обе стороны.',
        en: 'But in your button, transition sits in its own rule. That rule is always on, so the button is smooth both when the mouse comes and when it leaves.' } },
      { k: 'tr', text: {
        uz: "transition qatorida ikkita narsa bor: qaysi xususiyat silliq o'zgaradi va bu qancha davom etadi. Ikkalasini ham yozishni endi bilasiz-ku!",
        ru: 'В строке transition две вещи: какое свойство меняется плавно и сколько это длится. Обе ты уже умеешь писать.',
        en: 'A transition line holds two things: which property changes smoothly and how long it takes. You already know how to write both.' } },
      { k: 'prop', text: {
        uz: "Xususiyatning nomi aniq yozilishi kerak: transform tugmaning o'lchamini silliq qiladi, background-color esa fonini. Nomi yozilmagan narsa sakrayveradi. Hammasi silliq bo'lsin desak, all deb yozamiz.",
        ru: 'Свойство называют по имени: transform делает плавным размер кнопки, background-color — фон. То, что не названо, по-прежнему прыгает. А если нужно всё, пишут all.',
        en: 'A property is named exactly: transform makes the button’s size smooth, background-color makes the background smooth. Whatever isn’t named still jumps. And if you want everything smooth, you write all.' } },
      { k: 'time', text: {
        uz: "Vaqtni soniyada yozdik: qancha qisqa bo'lsa, tugma shuncha tez o'zgaradi. Endi bitta savol: shu vaqt ichida tugma qanday yuradi, boshidan oxirigacha bir tekisdami yoki oldin sekin, keyin tez? Sizningcha-chi?",
        ru: 'Время мы писали в секундах: чем меньше, тем быстрее меняется кнопка. А теперь вопрос: пока идёт это время, кнопка двигается ровно или сначала медленно, потом быстро? Как думаешь?',
        en: 'We wrote the time in seconds: the shorter it is, the faster the button changes. Now a question: during that time, does the button move evenly, or slowly at first and then fast? What do you think?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Tugma: sekin va tez', ru: 'Кнопка: медленная и быстрая', en: 'The button: slow and fast' },
    roles: true,
    say: [
      { k: 'time', text: {
        uz: "Keling, sekin tugmani tez tugma bilan solishtiramiz. Oldin sekini: u butun bir soniyada o'syapti. Qarang, qanchalik shoshilmayapti: sichqoncha allaqachon kelib bo'ldi, tugma esa endi-endi kattalasha boshladi.",
        ru: 'Давай сравним медленную кнопку и быструю. Сначала медленная: она растёт целую секунду. Смотри, как неторопливо: мышка давно наехала, а кнопка только-только начинает расти.',
        en: 'Let’s compare a slow button and a fast one. First the slow one: it takes a whole second to grow. See how unhurried it is: the mouse is long there, and the button is only just starting to grow.' } },
      { k: 'time', text: {
        uz: "Endi tezi: nol butun o'ndan uch soniya. Bu tugma chaqqon, lekin baribir sakramayapti, silliq o'syapti. O'yin tugmasiga mana shunisi mos, chunki o'yinchi kutib o'tirmaydi. Sekini esa tantanali menyuda chiroyli turardi.",
        ru: 'А теперь быстрая: ноль целых три десятых секунды. Она проворная, но всё равно без прыжка. Для игры подходит именно такая: игрок не станет ждать. А медленная смотрелась бы в торжественном меню.',
        en: 'Now the fast one: zero point three seconds. It’s quick, but still smooth, with no jump. This one suits a game, because a player won’t wait. The slow one would look nice in a fancy menu.' } },
      { k: null, text: {
        uz: "Vaqt chizig'iga ham bir qarang-chi: u ham bir tekis to'lmayapti. Boshida sekin, o'rtada tez, oxirida yana sekin. Demak, tez yoki sekin bo'lishidan tashqari, tugmaning yurishida yana nimadir bor ekan. Hozir shuni aniqlaymiz.",
        ru: 'Посмотри теперь на полосу: она тоже заполняется не ровно. В начале медленно, в середине быстро, в конце снова медленно. Значит, кроме «быстро» и «медленно», в движении кнопки есть что-то ещё. Сейчас разберёмся.',
        en: 'Now look at the bar: it doesn’t fill evenly either. Slow at the start, fast in the middle, slow again at the end. So besides fast and slow, there’s something else in how the button moves. Let’s work it out.' } }
    ]
  },
  e1Edits: COMMON.concat([
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"],
    ["curK === 'riddle2' ? [H_TF, TR('transform 0.6s')] : ownRules(own);", "curK === 'prop' ? [H_TF, H_BG, TR('all 0.5s')] : [H_TF, TR('transform 0.5s')];"],
    ["time: '0.3s · 300ms'", "time: '0.5s'"]
  ]),
  h2Edits: COMMON.concat([
    ["i === 0 ? 'hello' :", "i === 0 ? 'explain' :"],
    ["  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;\n",
      "  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;\n  const curI = c.say.findIndex((x) => x.text === speaker.text);\n"],
    ["const riddle = curK === 'riddle' || curK === 'riddle2';", 'const riddle = false;'],
    ["const rows = curK === 'riddle' ? [H_TF, '.tugma:hover { transition: transform 0.6s; }'] : curK === 'riddle2' ? [H_TF, TR('transform 0.6s')] : ownRules(own);",
      "const rows = curI === 0 ? [H_TF, TR('transform 1s')] : [H_TF, TR('transform 0.3s')];"],
    ["time: '0.3s · 300ms'", "time: '1s · 0.3s'"]
  ])
};
