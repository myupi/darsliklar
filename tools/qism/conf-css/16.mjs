// Урок 16 курса CSS «Адаптивность» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 31 и 32.
// Часть 1 «px и % на телефоне, @media» — s1…s7 + вывод E1 (баннер в процентах, @media с условием; вопрос «что скрыть?»);
// часть 2 «Скрытие на телефоне и порядок правил» — крючок H2 (загадка про @media в самом верху) + s8…s15.
// Загадка про порядок правил: её разгадка («побеждает то, что ниже») опирается на материал второй половины — в части 1
// нет ни одного слова про порядок и «ниже/выше». Поэтому в части 1 её не загадывают (s1Riddle), загадывает H2,
// а S15 части 2 разгадывает как раньше (riddleInE1: false).

const UNUSED_OWN = ["  const store = useStore();\n  const own = [store.get('myBp') || '600px', store.get('myBn') || 'gold', store.get('myKa') || 'white'];\n", ''];
const ROLES = ["{['pct', 'mq', 'cond', 'order'].map((k) => (", "{['pct', 'mq', 'cond'].map((k) => ("];
const TITLE = ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'];

// S15 собирает страницу ученика (граница, цвета) в конце части 2 — здесь вместо неё сайт из части 1:
// баннер в процентах и @media с карточками столбиком. Чипы — только пройденное: проценты, @media, условие.
// В выводе первая картинка — компьютер (800), дальше — телефон (360).
const E1_EDITS = [
  UNUSED_OWN,
  ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"],
  ["const rows = curK === 'riddle' ? [MQ_FIT, BN_PX] : curK === 'riddle2' ? [BN_PX, MQ_FIT] : [BN_PCT].concat(ownRules(own));", 'const rows = [BN_PCT, MQ_COL];'],
  TITLE,
  ['rules={withBase(rows)} vw={360}', "rules={withBase(rows)} vw={curK === 'pc' ? 800 : 360}"],
  ROLES
];

// H2: загадка показывается кодом «media наверху, 700px ниже» на странице-компьютере (там всё помещается — ответа нет);
// остальное время — сайт из части 1 на телефоне. Чипы — только проценты, @media и условие; на загадке не горит ни один.
const H2_EDITS = [
  UNUSED_OWN,
  ["i === 0 ? 'hello' : i === c.say.length - 1 ? 'curious' : 'wonder'", "i === 0 ? 'think' : i === c.say.length - 1 ? 'curious' : 'wonder'"],
  ["const rows = curK === 'riddle' ? [MQ_FIT, BN_PX] : curK === 'riddle2' ? [BN_PX, MQ_FIT] : [BN_PCT].concat(ownRules(own));", "const rows = curK === 'riddle' ? [MQ_FIT, BN_PX] : [BN_PCT, MQ_COL];"],
  TITLE,
  ['rules={withBase(rows)} vw={360}', "rules={withBase(rows)} vw={curK === 'riddle' ? 800 : 360}"],
  ROLES
];

// Ссылки на «девятый урок» (display): после деления номера сквозные — называем тему.
const textFixes = [
  ["Esingizdami, to'qqizinchi darsda none narsalarni yashirgan edi?", "Esingizdami, display darsida none narsalarni yashirgan edi?"],
  ["To'qqizinchi darsda narsalarni qaysi so'z bilan yashirgan edik, esingizdami?", "Display darsida narsalarni qaysi so'z bilan yashirgan edik, esingizdami?"],
  ['Вспомни слово «спрятать» из девятого урока.', 'Вспомни слово «спрятать» из урока про display.'],
  ['Remember the word for hiding from lesson nine.', 'Remember the word for hiding from the display lesson.']
];

export default {
  textFixes,
  course: 'css',
  dir: 'tools/css16',
  src: 'c16.src.jsx',
  screens: 'c16-screens.jsx',
  lessonId: 'css-16-adaptivnost',
  slug: 'adaptivnost',
  riddleInE1: false,
  lessonTitleParts: [
    { uz: "31-dars. Telefonda px, foiz va @media", ru: 'Урок 31. px и % на телефоне, @media', en: 'Lesson 31. px and % on a phone, @media' },
    { uz: "32-dars. Telefonda yashirish va qoidalar tartibi", ru: 'Урок 32. Скрытие на телефоне и порядок правил', en: 'Lesson 32. Hiding on a phone and rule order' }
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
  // Часть 1 не загадывает загадку: S1 кончается обещанием этой части (проценты и @media), про порядок правил — ни слова.
  s1Done: null,
  s1Riddle: {
    uz: "Endi o'zingiz ham saytni ekranga moslashtirishni o'rganasiz: bannerni foizga o'tkazasiz, kartalar uchun esa telefonga alohida qoida yozasiz. Oldin bannerdan boshlaymiz.",
    ru: 'Сейчас ты сам научишься подстраивать сайт под экран: переведёшь баннер на проценты и напишешь отдельное правило для карточек на телефоне. Начнём с баннера.',
    en: 'Now you’ll learn to fit a site to a screen yourself: switch the banner to percent and write a separate rule for the cards on a phone. We’ll start with the banner.'
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Sayt ikkala ekranga mos", ru: 'Сайт подходит обоим экранам', en: 'The site fits both screens' },
    next: { uz: "Keyingi dars: telefonda yashirish va qoidalar tartibi", ru: 'Следующий урок: скрытие на телефоне и порядок правил', en: 'Next lesson: hiding on a phone and rule order' },
    roles: true,
    say: [
      { k: 'pc', text: {
        uz: "Mana, bitta sayt, ikkita ekran! Oldin kompyuterga qarang: banner butun eniga cho'zilgan, uchta karta esa qatorda yonma-yon turibdi.",
        ru: 'Вот один сайт и два экрана! Сначала посмотри на компьютер: баннер растянут на всю ширину, три карточки стоят в ряд.',
        en: 'Here’s one site and two screens! First, the computer: the banner stretches the full width and the three cards sit in a row.' } },
      { k: 'pct', text: {
        uz: "Endi o'sha sayt telefonda ochildi. Qarang-chi, banner bu safar ekrandan chiqib ketmadi-ku! Buni foiz qildi: kodda yetti yuz piksel emas, yuz foiz turibdi, shuning uchun oyna qancha keng bo'lsa, banner ham shuncha keng bo'ladi.",
        ru: 'А вот тот же сайт на телефоне. Смотри, баннер на этот раз не вылез за экран! Это сделали проценты: в коде не семьсот пикселей, а сто процентов, поэтому баннер такой же широкий, как окно.',
        en: 'And here’s the same site on a phone. Look, this time the banner didn’t stick out of the screen! Percent did it: the code says a hundred percent instead of seven hundred pixels, so the banner is as wide as the window.' } },
      { k: 'mq', text: {
        uz: "Kartalarni esa media qoidasi ustma-ust qo'ydi. U faqat tor oynada ishlaydi, kompyuterda esa uxlab yotadi, shuning uchun u yerda kartalar qatorda qolgan.",
        ru: 'А карточки поставило друг под другом правило media. Оно работает только в узком окне, а на компьютере спит, поэтому там карточки остались в ряду.',
        en: 'And the cards were stacked by a media rule. It works only in a narrow window and sleeps on a computer, which is why the cards stayed in a row there.' } },
      { k: 'cond', text: {
        uz: "Qoida qachon ishlashini shart aytadi. Qavs ichida max-width olti yuz piksel turibdi, ya'ni «oyna olti yuz pikseldan keng bo'lmasa» degani.",
        ru: 'Когда правилу работать, говорит условие. В скобках max-width шестьсот пикселей, то есть «если окно не шире шестисот пикселей».',
        en: 'The condition tells the rule when to work. In brackets it says max-width six hundred pixels, meaning if the window is no wider than six hundred pixels.' } },
      { k: null, text: {
        uz: "Lekin telefonning ekrani juda kichkina-ku! Sizningcha, sahifadagi nimani yashirsak, qolgan narsalarga joy ko'payadi?",
        ru: 'Но экран телефона совсем маленький. Как думаешь, что на странице можно спрятать, чтобы остальному стало просторнее?',
        en: 'But a phone screen is really small. What do you think we could hide on the page to give the rest more room?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Yangi garov', ru: 'Новая загадка', en: 'A new riddle' },
    ask: { uz: "Media qoidasi eng tepada", ru: 'Правило media в самом верху', en: 'The media rule at the very top' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Sizga bir savol: bitta narsa haqida ikkita qator gapirsa, oxirgi so'z qaysi qatorniki bo'ladi? Mana, bannerning eni haqida ikki qator bor. Birinchisi media ichida turibdi va yuz foiz deydi, ikkinchisi esa yetti yuz piksel deydi.",
        ru: 'Вопрос: если про одну вещь в коде говорят две строки, чья строка скажет последнее слово? Вот две строки про ширину баннера. Одна лежит внутри media и говорит «сто процентов», другая говорит «семьсот пикселей».',
        en: 'A question: if two lines of code talk about the same thing, whose line has the last word? Here are two lines about the banner’s width. One sits inside media and says a hundred percent, the other says seven hundred pixels.' } },
      { k: 'riddle', text: {
        uz: "Keling, garov o'ynaymiz. Men media qoidasini kodning eng tepasiga, oddiy qoidadan oldin yozdim. Menimcha, qoidaning joyi muhim emas: telefonda banner baribir ekranga sig'adi. Kompyuterda hammasi joyida turibdi-ku. Siz nima deb o'ylaysiz, men haqmanmi?",
        ru: 'Спорим? Я поставил правило media в самом верху, до обычного. По-моему, место не важно: на телефоне баннер всё равно поместится в экран. На компьютере же всё хорошо. Как думаешь, я прав?',
        en: 'Want a bet? I put the media rule at the very top, before the ordinary one. I think the place doesn’t matter: on a phone the banner will still fit the screen. On a computer everything looks fine. What do you think, am I right?' } },
      { k: 'pct', text: {
        uz: "Javobni dars oxirida birga topamiz. Hozircha o'tgan darsdagi saytga qaytaylik: u yerda foiz bannerni telefon ekraniga roppa-rosa sig'dirgan edi.",
        ru: 'Ответ найдём вместе в конце урока. А пока вернёмся к сайту с прошлого урока: там проценты сделали баннер ровно по экрану телефона.',
        en: 'We’ll find the answer together at the end of the lesson. For now, let’s go back to the site from last time: there, percent made the banner fit the phone screen exactly.' } },
      { k: 'mq', text: {
        uz: "Media qoidasi esa kartalarni ustma-ust qo'ygan edi. Bu darsda unga yangi ish beramiz: telefonda ortiqcha narsani yashirish. Shundan keyin garovning javobi ham ravshan bo'ladi.",
        ru: 'А правило media поставило карточки друг под другом. Теперь у него появится новая работа: прятать на телефоне лишнее. После этого ответ на загадку станет понятнее.',
        en: 'And a media rule stacked the cards. Now it gets a new job: hiding extras on a phone. After that, the answer to the riddle will be clearer.' } }
    ]
  },
  e1Edits: E1_EDITS,
  h2Edits: H2_EDITS
};
