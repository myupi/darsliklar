// Урок 8 «Структура настоящего сайта» двумя частями (tools/qism/build.mjs): часть 1 — header, main, footer и nav
// (s1–s7 + вывод E1), часть 2 — section и свой сайт (крючок H2 + s8–s14, итоговая проверка q1/q2, s15).
// Загадка (Коди обернул верх в header и ждёт, что он сам станет цветным) разгадывается в E1: хватает части 1 —
// ученик уже видел, что header страницу не меняет, а рамки рисует Инспектор.
//
// В E1 и H2 вместо «своего сайта» (он собирается в части 2) — сайт Коди, тот же, что в s1–s7: header, nav, main
// и footer без разделов section (их ещё не учили). Чипы ролей — без section.
const kodiPage = [
  ["  const mine = useMine8();\n", ''],
  [`            <Br title={riddle ? pick(s.title) : pick(s.myTitle)} url={riddle ? 'index.html' : 'mening.html'}>
              {riddle ? <SitePage cfg={FULL} /> : <SitePage cfg={FULL} own={mine} insp hl={curK === 'section' ? 'section1' : curK} />}
            </Br>`,
  `            <Br title={pick(s.title)} url="index.html">
              <SitePage cfg={{ header: true, nav: true, main: true, sec: 0, footer: true }} insp={!riddle} hl={curK} />
            </Br>`],
  ['{S15_ROLES.map((k) => (', "{S15_ROLES.filter((k) => k !== 'section').map((k) => ("]
];

export default {
  dir: 'tools/sayt8',
  src: 'z8.src.jsx',
  screens: 'z8-screens.jsx',
  lessonId: 'html-08-struktura-sajta',
  slug: 'struktura-sajta',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "8-dars. 1-qism: header, main, footer va nav", ru: 'Урок 8. Часть 1: header, main, footer и nav', en: 'Lesson 8. Part 1: header, main, footer and nav' },
    { uz: "8-dars. 2-qism: section va o'z saytingiz", ru: 'Урок 8. Часть 2: section и свой сайт', en: 'Lesson 8. Part 2: section and your own site' }
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
  // Часть 1: загадка задаётся как раньше, но «в этой части», а не «на уроке» (в узбекской версии «Сегодня…» нет).
  s1Done: {
    uz: [["Buni dars oxirida o'sha saytni ochib tekshiramiz.", "Buni shu qism oxirida o'sha saytni ochib tekshiramiz."]],
    ru: [['Сегодня ты научишься делить сайт на такие части и сделаешь части своего сайта.', 'В этой части ты научишься делить сайт на header, nav, main и footer.'], ['в конце урока', 'в конце этой части']],
    en: [['Today you’ll learn to split a site into parts like these, and you’ll make the parts of your own site.', 'In this part you’ll learn to split a site into header, nav, main and footer.'], ['at the end of the lesson', 'at the end of this part']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Kodining saytiga qarang", ru: 'Посмотри на сайт Коди', en: 'Look at Kodi’s site' },
    next: { uz: "Keyingi qism: section va o'z saytingiz", ru: 'Следующая часть: section и свой сайт', en: 'Next part: section and your own site' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Endi sirni ochamiz! Esingizdami, tepani header tegiga o'rasam, sayt boshi o'zi rangli bo'lib qoladi, deb o'ylagan edim? Mana, o'sha saytni ochdim: tepa header ichida turibdi, lekin hech qanday rang paydo bo'lmabdi. Demak, men yanglishgan ekanman!",
        ru: 'Пора разгадать загадку! Помнишь, мне казалось: если обернуть верх сайта в header, он сам станет цветным? Вот тот самый сайт: верх лежит в header, а цвета нет. Выходит, мне только показалось!',
        en: 'Time to solve the riddle! Remember, I thought that wrapping the top of the site in header would make it colorful by itself? Here’s that very site: the top is inside header, but there’s no color at all. So I was wrong!' } },
      { k: 'riddle', text: {
        uz: "Chunki header bor-yo'g'i «Bu sayt boshi», deb aytib turadi. Rangni esa brauzer o'zi bermaydi, uni kodga alohida yozish kerak. Buni CSS qiladi, u bilan keyingi kursda tanishasiz.",
        ru: 'Всё потому, что header только называет часть: это верх сайта. Цвет он не даёт, его нужно записать в коде отдельно. Этим занимается CSS, а с ним ты познакомишься в следующем курсе.',
        en: 'That’s because header only names the part: it says this is the top of the site. It doesn’t add color; you have to write that in the code separately. That’s the job of CSS, which you’ll meet in the next course.' } },
      { k: 'header', text: {
        uz: "Mana, endi Inspektorni yoqamiz-da, sayt qismlarini birga eslab chiqamiz. Tepada header turibdi: u sayt boshini o'rab turadi, ichida sarlavha bilan menyu bor.",
        ru: 'Теперь включим Инспектор и вспомним части сайта. Наверху header: он оборачивает верх сайта, внутри заголовок и меню.',
        en: 'Now let’s turn on the Inspector and recall the parts of the site. At the top is header: it wraps the top of the site, with the heading and the menu inside.' } },
      { k: 'nav', text: {
        uz: "Menyuni nav tegi o'rab turadi, u header ichida yashaydi. Faqat head bilan adashtirmang: head ko'rinmas ma'lumotlar uchun kerak, header esa sahifaning ko'rinadigan boshi.",
        ru: 'Меню оборачивает тег nav, и он стоит внутри header. Только не путай его с head: head нужен для невидимых сведений о странице, а header для видимого верха.',
        en: 'The menu is wrapped by the nav tag, and it sits inside header. Just don’t mix it up with head: head holds invisible information about the page, while header is the visible top.' } },
      { k: 'main', text: {
        uz: "O'rtada main turibdi: u sahifaning eng muhim qismini o'rab turadi. Esingizdami, sahifada main faqat bitta bo'ladi.",
        ru: 'Посередине main: он оборачивает самое важное на странице. Помнишь, main на странице бывает только один.',
        en: 'In the middle is main: it wraps the most important part of the page. Remember, a page has only one main.' } },
      { k: 'footer', text: {
        uz: "Eng pastda footer turibdi: u sayt oxirini bildiradi. Odatda unga yil bilan saytning nomi yoziladi.",
        ru: 'Внизу footer: он обозначает низ сайта. Обычно там пишут год и название сайта.',
        en: 'At the bottom is footer: it marks the bottom of the site. Usually it holds the year and the site’s name.' } },
      { k: 'main', text: {
        uz: "Lekin bitta narsa menga tinchlik bermayapti: main ichida o'yinlar bilan retseptlar bir joyda aralash yotibdi-ku. Ularni bir-biridan qanday ajratamiz? Buni keyingi qismda bilib olamiz, undan keyin o'z saytingizni ham yasaymiz!",
        ru: 'Но одна вещь не даёт мне покоя: внутри main игры и рецепты лежат вперемешку! Как их разделить? Узнаем в следующей части, а потом соберём твой собственный сайт!',
        en: 'But one thing keeps bugging me: inside main the games and the recipes are all mixed together! How do we separate them? We’ll find out in the next part, and then we’ll build your own site!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: "Bitta ramka, ikki mavzu", ru: 'Одна рамка, две темы', en: 'One frame, two topics' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Salom! Esingizdami, saytimning kodi bir uyum bo'lib yotgan edi? Biz uni qismlarga ajratdik: tepada header, ichida nav, o'rtada main, pastda footer. Sahifa o'zgarmadi, qismlarni faqat Inspektor ramkaga olib ko'rsatdi.",
        ru: 'Привет! Помнишь, код моего сайта лежал одной кучей? Мы разложили его по частям: наверху header, в нём nav, посередине main, внизу footer. Страница не изменилась, а части показал Инспектор.',
        en: 'Hi! Remember, the code of my site was one big pile? We split it into parts: header at the top with nav inside it, main in the middle and footer at the bottom. The page didn’t change; the Inspector showed us the parts.' } },
      { k: 'main', text: {
        uz: "Endi o'rtadagi katta ramkaga qarang-chi. Unda o'yinlar ham bor, retseptlar ham, mavzulari esa butunlay boshqa-boshqa. Ular bitta ramkada aralashib turibdi!",
        ru: 'Теперь посмотри на большую рамку посередине. Там и игры, и рецепты, а темы совсем разные. И всё это в одной рамке!',
        en: 'Now look at the big frame in the middle. It has games and recipes, and the topics are completely different. And it’s all in one frame!' } },
      { k: null, text: {
        uz: "Sizningcha, ularni qanday ajratsak bo'ladi? Qani, bir o'ylab ko'ring. Hozir birga topamiz. Ketdik!",
        ru: 'Как думаешь, как их можно разделить? Подумай немного. Сейчас найдём ответ вместе. Поехали!',
        en: 'How do you think we could separate them? Have a think. Let’s find out together. Here we go!' } }
    ]
  },
  e1Edits: kodiPage,
  h2Edits: kodiPage
};
