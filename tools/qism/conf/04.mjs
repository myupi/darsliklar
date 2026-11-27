// Урок 4 «Ссылки и атрибуты» двумя частями (tools/qism/build.mjs): часть 1 — a и href, части атрибута, поломки ссылки
// (s1–s10 + вывод E1), часть 2 — свой сайт целиком, сайты в интернете, своя ссылка, проверка (крючок H2 + s11–s15).
// Загадка (Коди обернул «Мои игры» в a без href) разгадывается в E1: для разгадки хватает части 1 (в s2 Коди сам видит,
// что без адреса в окне ничего не меняется). В E1 и H2 вместо страницы с «своей» ссылкой (она собирается в части 2)
// рисуется главная страница сайта Коди, которую ученик уже видел в части 1 (s1, s4, s11-подобная): меню из двух ссылок,
// в режиме riddle — страница «как было», где «Мои игры» в a без href остаётся простым текстом.
const mainPage = [
  ["  const mine = useMine4();\n", ''],
  ["useNav('index.html', MINE_FILES)", "useNav('index.html', FILES)"],
  ["riddle ? { t: 'p', parts: [{ an: pick(C.site.games) }], k: 'r', hl: true } : { t: 'p', parts: [{ a: mine, href: 'mening.html', hl: curK === 'a' }], k: 'm', hl: curK === 'href' || curK === 'val' }] } : null;",
    "{ t: 'p', parts: [pick(C.site.hello)], k: 'p' }, { t: 'p', parts: [{ a: pick(C.site.osh), href: 'osh.html', hl: curK === 'a' }], k: 'l1', hl: curK === 'href' || curK === 'val' }, riddle ? { t: 'p', parts: [{ an: pick(C.site.games) }], k: 'r', hl: true } : { t: 'p', parts: [{ a: pick(C.site.games), href: 'oyinlar.html', hl: curK === 'a' }], k: 'l2', hl: curK === 'href' || curK === 'val' }] } : null;"],
  // Чипы ролей — только то, что учили в части 1: a, href, значение (https и сайты в интернете — часть 2).
  ["['a', 'href', 'val', 'web'].map(", "['a', 'href', 'val'].map("],
  ['<SiteBrowser nav={nav} override={page} mine={mine} live={!riddle} />', '<SiteBrowser nav={nav} override={page} live={!riddle} />']
];

export default {
  dir: 'tools/havola4',
  src: 'z4.src.jsx',
  screens: 'z4-screens.jsx',
  lessonId: 'html-04-ssylki-i-atributy',
  slug: 'ssylki-i-atributy',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "7-dars. Havolalar: a va href", ru: "Урок 7. Ссылки: a и href", en: "Lesson 7. Links: a and href" },
    { uz: "8-dars. Boshqa saytlarga havolalar", ru: "Урок 8. Ссылки на другие сайты", en: "Lesson 8. Links to other websites" }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's11', code: 'SHOW', Comp: S11 },
  { id: 'w1', code: 'SHOW', Comp: W1 }, { id: 'w2', code: 'LEVEL-W', Comp: W2 }, { id: 'w3', code: 'CHECK-W', Comp: W3 },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-4B', Comp: S13 },
  { id: 's14', code: 'CHECK-4', Comp: S14 },
  { id: 'q1', code: 'CHECK-5', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // Часть 1: загадка задаётся как раньше, но «в этой части», а не «сегодня … и на сайт в интернете».
  s1Done: {
    uz: [["Bunday havolalarni bugun o'zingiz yasaysiz: o'z sahifangizga ham, internetdagi saytlarga ham.", "Bu darsda bunday havolalarni yasashni o'rganamiz."]],
    ru: [['Сегодня ты научишься делать такие ссылки — и на свою страницу, и на сайт в интернете.', 'В этом уроке ты научишься делать такие ссылки.'], ['в конце урока', 'в конце урока']],
    en: [['Today you’ll learn to make links like these: to your own page and to a site on the internet.', 'In this lesson you’ll learn to make links like these.'], ['at the end of the lesson', 'at the end of the lesson']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Saytning sahifalari havolalar bilan bog'langan", ru: 'Страницы сайта связаны ссылками', en: 'The pages of the site are linked' },
    next: { uz: "Keyingi dars: o'z havolangiz va internetdagi saytlar", ru: 'Следующий урок: своя ссылка и сайты в интернете', en: 'Next lesson: your own link and sites on the internet' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Endi sirni ochamiz! Esingizdami, men «Mening o'yinlarim» so'zlarini a tegiga o'rab qo'yib, manzil yozmagan edim? Mana o'sha sahifa: so'zlar oddiy matn bo'lib turibdi, bosib bo'lmaydi. Brauzer aqlli bo'lsa ham, fikrimni o'qiy olmaydi-ku. Kitob haq ekan: href bo'lmasa, havola hech qayerga olib bormaydi.",
        ru: 'Пора разгадать загадку! Помнишь, слова «Мои игры» лежали в теге a, а адреса не было? Вот эта страница: слова остались обычным текстом, нажать их нельзя. Браузер умный, но мысли читать не умеет. Значит, без href тег a никуда не ведёт.',
        en: 'Time to solve the riddle! Remember, the words “My games” sat inside the a tag, but there was no address? Here’s that page: the words stayed plain text, and you can’t tap them. The browser is smart, but it can’t read minds. So without href, the a tag leads nowhere.' } },
      { k: null, text: {
        uz: "Mana, endi hamma havola jonlangan. Bittasini bosib ko'ring-chi, qaysi sahifa ochilarkin?",
        ru: 'Вот теперь все ссылки ожили. Нажми любую: какая страница откроется?',
        en: 'Now every link is alive. Tap one: which page will open?' } },
      { k: 'a', text: {
        uz: "Havolaning boshida a tegi turibdi. Aynan u so'zga «Bu havola», deb aytadi.",
        ru: 'В начале ссылки стоит тег a. Он говорит браузеру: это ссылка.',
        en: 'At the start of the link there’s the a tag. It tells the browser: this is a link.' } },
      { k: 'href', text: {
        uz: "Qayerga olib borishini esa href atributi aytadi. U havolaga manzil beradi.",
        ru: 'А куда ссылка ведёт, говорит атрибут href. Он даёт ссылке адрес.',
        en: 'And where the link goes is told by the href attribute. It gives the link an address.' } },
      { k: 'val', text: {
        uz: "Qo'shtirnoq ichida qiymat turadi, bizda u fayl nomi. Uni harfma-harf yozmasak, brauzer «Fayl topilmadi», deb javob beradi.",
        ru: 'В кавычках стоит значение, у нас это имя файла. Если написать его не буква в букву, браузер ответит: «Файл не найден».',
        en: 'In the quotes is the value, here the file name. If you don’t type it exactly, the browser answers: “File not found”.' } },
      { k: null, text: {
        uz: "Havola qayerda tugashini esa yopuvchi a tegi aytadi. Uni qo'ymasak, gapning qolgan qismi ham ko'k bo'lib ketadi-ku!",
        ru: 'А где ссылка заканчивается, показывает закрывающий тег a. Без него синим станет и остаток фразы.',
        en: 'And where the link ends is shown by the closing a tag. Without it, the rest of the sentence turns blue too.' } },
      { k: null, text: {
        uz: "Lekin hozircha havolalarimiz faqat o'z saytimizdagi fayllarga olib bordi. Nima deb o'ylaysiz, havola internetdagi boshqa saytga ham olib bora oladimi? Sizning o'z sahifangizga-chi? Keyingi darsda shuni aniqlaymiz!",
        ru: 'Но пока наши ссылки вели только на файлы нашего сайта. Как думаешь, может ли ссылка вести на другой сайт в интернете? А на твою собственную страницу? Выясним на следующем уроке!',
        en: 'But so far our links only led to files on our own site. Do you think a link can take you to another site on the internet? And to your own page? We’ll find out in the next lesson!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Havola qayerlarga olib boradi?", ru: 'Куда может вести ссылка?', en: 'Where can a link go?' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Salom! O'tgan darsda saytimizning sahifalarini havolalar bilan bog'ladik: a tegi havola yasaydi, href atributi esa qayerga borishini aytadi.",
        ru: 'Привет! На прошлом уроке мы связали страницы сайта ссылками: тег a делает ссылку, а атрибут href говорит, куда вести.',
        en: 'Hi! In the last lesson we linked the pages of the site: the a tag makes a link, and the href attribute says where it goes.' } },
      { k: 'val', text: {
        uz: "Qo'shtirnoq ichiga esa hozircha faqat o'z fayllarimizning nomini yozdik: osh.html va oyinlar.html. Brauzer ularni harfma-harf qidirib topdi.",
        ru: 'В кавычках у нас пока были только имена своих файлов: osh.html и oyinlar.html. Браузер искал их буква в букву.',
        en: 'So far the quotes held only the names of our own files: osh.html and oyinlar.html. The browser looked for them letter by letter.' } },
      { k: null, text: {
        uz: "Nima deb o'ylaysiz, fayl nomi o'rniga boshqa saytning manzilini yozsak, brauzer nima qiladi? Javobini birozdan keyin topamiz, oldin esa saytimizni bir aylanib chiqamiz. Ketdik!",
        ru: 'Как думаешь, что сделает браузер, если вместо имени файла написать адрес другого сайта? Ответ найдём чуть позже, а сначала пройдёмся по нашему сайту. Погнали!',
        en: 'What do you think the browser will do if we write another site’s address instead of a file name? We’ll find the answer soon, but first let’s walk around our site. Let’s go!' } }
    ]
  },
  e1Edits: mainPage,
  h2Edits: mainPage
};
