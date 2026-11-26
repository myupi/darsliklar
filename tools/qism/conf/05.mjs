// Урок 5 «Изображения» двумя частями (tools/qism/build.mjs): часть 1 — img и src, alt, поломки и страница целиком
// (s1–s11 + вывод E1), часть 2 — картинка из интернета и своя картинка (крючок H2 + w1–w3, s12–s14, q1–q2, s15).
// Загадка (Коди написал картинке href вместо src) разгадывается в E1: на материале части 1 (img без src — пустое место).
// Граница — после s11 «Страница целиком»: s10 обещает «прочитаем всю страницу вместе», а H2 сразу ведёт к w1
// (вопрос «а если картинка на другом сайте?» → показ «картинка из интернета»).
//
// Что рисуют E1 и H2: в S15 непоказанная ветка — страница ученика (mine: своя картинка из s12–s13, её в части 1 ещё нет).
// Вместо неё — страница, которую ученик уже видел в части 1 (s1, s5, s11): рецепт плова, h1 + img osh.jpg + p.
// На реплике про alt файл «ломается» (osh.jgp, как в s5) — виден значок и текст alt; чипы ролей — только img, src, alt
// (https, «из интернета» — материал части 2).
const plovPage = [
  ["  const mine = useMine5();\n", ''],
  [": [{ t: 'h1', parts: pick(UI.mySite), k: 'h' }, { t: 'img', src: mine.pic, alt: mine.alt, k: 'i', hl: curK === 'img' || curK === 'src' }];",
    ": [{ t: 'h1', parts: pick(C.site.osh), k: 'h' }, { t: 'img', src: curK === 'alt' ? 'osh.jgp' : 'osh.jpg', alt: pick(C.s5.alt), k: 'i', hl: curK === 'img' || curK === 'src' || curK === 'alt' }, { t: 'p', parts: pick(C.site.oshText), k: 'p' }];"],
  ["<Br title={riddle ? pick(C.site.osh) : pick(UI.mySite)} url={riddle ? 'osh.html' : 'mening.html'}>", '<Br title={pick(C.site.osh)} url="osh.html">'],
  ["{['img', 'src', 'alt', 'web'].map((k) => (", "{['img', 'src', 'alt'].map((k) => ("]
];

export default {
  dir: 'tools/rasm5',
  src: 'z5.src.jsx',
  screens: 'z5-screens.jsx',
  lessonId: 'html-05-izobrazheniya',
  slug: 'izobrazheniya',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: '5-dars. 1-qism: img, src va alt', ru: 'Урок 5. Часть 1: img, src и alt', en: 'Lesson 5. Part 1: img, src and alt' },
    { uz: "5-dars. 2-qism: internetdagi rasm va o'z rasmingiz", ru: 'Урок 5. Часть 2: картинка из интернета и своя картинка', en: 'Lesson 5. Part 2: a picture from the internet and your own' }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 'w1', code: 'SHOW', Comp: W1 }, { id: 'w2', code: 'LEVEL-W', Comp: W2 }, { id: 'w3', code: 'CHECK-W', Comp: W3 },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-4B', Comp: S13 },
  { id: 's14', code: 'CHECK-4', Comp: S14 },
  { id: 'q1', code: 'CHECK-5', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // Часть 1: загадка задаётся как раньше, но «в этой части»; картинки из интернета — материал части 2, в обещании их нет.
  s1Done: {
    uz: [
      ["Bugungi darsdan keyin siz ham sahifaga rasm qo'ya olasiz: o'z faylingizdan ham, internetdagi saytdan ham.", "Bu qismda siz ham sahifaga rasm qo'yishni o'rganasiz."],
      ["Shoshilmayman, oldin rasm qo'yishni o'rganib olamiz.", "Shoshilmayman: oldin rasm qo'yishni o'rganib olamiz, javobni esa shu qism oxirida topamiz."]
    ],
    ru: [
      ['Сегодня ты научишься ставить такие картинки — и из своих файлов, и с сайта в интернете.', 'В этой части ты научишься ставить такие картинки.'],
      ['в конце урока', 'в конце этой части']
    ],
    en: [
      ['Today you’ll learn to put pictures like this on a page: from your own files and from a site on the internet.', 'In this part you’ll learn to put pictures like this on a page.'],
      ['at the end of the lesson', 'at the end of this part']
    ]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Osh sahifasi tayyor', ru: 'Страница плова готова', en: 'The plov page is ready' },
    next: { uz: "Keyingi qism: internetdagi rasm va o'z rasmingiz", ru: 'Следующая часть: картинка из интернета и своя картинка', en: 'Next part: a picture from the internet and your own' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Endi sirni yechamiz! Esingizdami, mehmon «rasm yo'q-ku» deb yozgan edi, men esa osh.jpg faylini rasmga href bilan yozgandim? Sahifaga qarang: sarlavha bilan yozuvning o'rtasi bo'm-bo'sh. Demak, mehmon haq ekan: img tegi href so'zini tushunmaydi, chunki href havolalar uchun, rasm faylini esa faqat src aytadi.",
        ru: 'Пора разгадать загадку! Помнишь, у картинки стоял href с файлом osh.jpg, и всё казалось верным? Смотри на страницу: между заголовком и текстом пусто. Тег img не знает слова href: оно нужно ссылкам, а файл картинки называет только src.',
        en: 'Time to solve the riddle! Remember, the picture had href with the file osh.jpg, and it all looked right? Look at the page: it’s empty between the heading and the text. The img tag doesn’t know the word href: it’s for links, and only src names the picture file.' } },
      { k: null, text: {
        uz: "Mehmonga uzr so'rab xat yozdim. Mana, sahifaning to'g'ri varianti: osh rasmi sarlavha bilan yozuvning o'rtasida turibdi!",
        ru: 'А вот страница, как надо: фото плова стоит между заголовком и текстом!',
        en: 'And here’s the page done right: the plov photo sits between the heading and the text!' } },
      { k: 'img', text: {
        uz: "Rasmni sahifaga img tegi qo'yadi. U kodda sarlavha bilan yozuvning o'rtasida turadi, rasm ham sahifada aynan shu yerda chiqdi.",
        ru: 'Картинку на страницу ставит тег img. В коде он стоит между заголовком и текстом, и фото появилось именно там.',
        en: 'The img tag puts the picture on the page. In the code it sits between the heading and the text, and that’s exactly where the photo appeared.' } },
      { k: 'src', text: {
        uz: "Qaysi rasm ekanini src atributi aytadi. Brauzer undagi osh.jpg nomini o'qib, shu faylni topadi. Nomda bitta harf adashsa, rasm chiqmaydi, chunki brauzer faylni harfma-harf qidiradi.",
        ru: 'Какой файл показать, говорит атрибут src. Браузер читает в нём имя osh.jpg и находит этот файл. Ошибёшься хоть в одной букве, и картинки не будет, ведь браузер ищет файл буква в букву.',
        en: 'The src attribute says which file to show. The browser reads the name osh.jpg in it and finds that file. One wrong letter and the picture won’t appear, because the browser looks for the file letter by letter.' } },
      { k: 'alt', text: {
        uz: "alt esa rasm ochilmasa ham, unda nima borligini so'z bilan aytib turadi. Mana, fayl buzilgan, lekin rasm o'rnida so'zlar turibdi: nima borligini baribir bilib turibmiz.",
        ru: 'А alt словами говорит, что на картинке, даже если фото не открылось. Смотри: файл сломан, а на месте фото остались эти слова.',
        en: 'And alt says in words what’s in the picture, even if the photo doesn’t open. Look: the file is broken, but these words are left where the photo was.' } },
      { k: null, text: {
        uz: "Hozircha rasmlarimiz hammasi o'zimizning fayllarimiz ichida yotibdi. Lekin quyosh rasmi bizda yo'q, u faqat internetda bor. Uni sahifamizga qanday olib kelamiz? Buni keyingi qismda ko'ramiz, keyin o'zingizning rasmingizni ham qo'yasiz!",
        ru: 'Пока все наши картинки лежат среди наших файлов. А вот картинки солнца у нас нет, она есть только в интернете. Как принести её на страницу? Узнаем в следующей части, а потом поставим и твою картинку!',
        en: 'So far all our pictures sit among our own files. But we don’t have a sun picture; it exists only on the internet. How do we bring it to the page? We’ll find out in the next part, and then put in your own picture too!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Rasm boshqa saytda tursa-chi?", ru: 'А если картинка на другом сайте?', en: 'What if the picture is on another site?' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Salom! O'tgan qismda osh sahifamizga rasm qo'ydik, rasm nega ba'zan chiqmay qolishini ham bilib oldik.",
        ru: 'Привет! В прошлой части мы поставили картинку на страницу плова и выяснили, почему картинки иногда не появляются.',
        en: 'Hi! In the last part we put a picture on the plov page and found out why pictures sometimes don’t show up.' } },
      { k: 'src', text: {
        uz: "Esingizdami, brauzer rasmni src ichidagi nom bo'yicha qidiradi? Nom bizning fayllarimizdan biriga mos kelsa, rasm chiqadi, bo'lmasa buzilgan rasm belgisi turadi.",
        ru: 'Помнишь, браузер ищет картинку по имени в src? Если имя совпало с одним из наших файлов, фото на месте, а если нет, видно значок сломанной картинки.',
        en: 'Remember, the browser looks for the picture by the name in src? If the name matches one of our files, the photo is there; if not, you see a broken picture icon.' } },
      { k: null, text: {
        uz: "Lekin hozirgacha rasm doim bizning fayllarimiz ichida yotgan edi. Nima deb o'ylaysiz, rasm boshqa saytda tursa, brauzer uni topa oladimi? Yoki src ichiga boshqacha narsa yozish kerakmi? Qani, ko'ramiz.",
        ru: 'Но до сих пор все картинки лежали среди наших файлов. Как думаешь, найдёт ли браузер картинку, которая лежит на другом сайте? Или в src нужно писать что-то другое? Давай посмотрим.',
        en: 'But so far every picture sat among our own files. What do you think, will the browser find a picture that lives on another site? Or should src hold something different? Let’s see.' } }
    ]
  },
  e1Edits: plovPage,
  h2Edits: plovPage
};
