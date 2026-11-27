// Урок 15 курса CSS «CSS-анимации» двумя частями (tools/qism/build.mjs 15 css): сквозные уроки 29 и 30.
// Часть 1 «@keyframes: кадры и повторы» — s1…s7 + вывод E1 (разгадка: «Sakra» ≠ «sakra», имена различают регистр);
// часть 2 «animation: скорость, направление и поломки» — крючок H2 (кубик застыл) + s8…s15.
// Разрез — после второй тройки: s2–s4 (план и запуск, transition или animation), s5–s7 (кадры в процентах, сколько раз).
// В таблице части 2 стояло «animation: время и повтор», но время и повторы (число, infinite) учит часть 1 (s2, s5, s7);
// во второй части — linear, alternate и поломки, поэтому названия уточнены.
// Загадка решается в части 1: в s3 (причина «Aylan → регистр») регистр имени уже звучит, для разгадки хватает
// @keyframes sakra и animation с именем (серая строка полосы объясняется в самой разгадке).

// В E1 и H2 показывается игра Коди из части 1, а не «своя анимация» части 2 (s14).
const COMMON = [
  ["  const store = useStore();\n  const own = [store.get('myTo') || 'scale(1.3)', store.get('myDur') || '1s', store.get('myCount') || 'infinite'];\n", ''],
  ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"']
];

// Ссылки на «прошлый/второй урок» и обещание «в конце урока», ставшие неверными после деления; зачин первой реплики итога части 2 (uz).
const textFixes = [
  ["Aslida bu kubik joyidan qimirlamaydi. Nega shunday, buni dars oxirida birga ko'ramiz.", "Aslida bu kubik joyidan qimirlamaydi: CSS uchun Sakra bilan sakra ikki xil nom, shuning uchun brauzer rejani topa olmaydi."],
  ["как имена классов во втором уроке", "как имена классов в уроке про селекторы"],
  ["like the class names in lesson two", "like the class names in the selectors lesson"],
  ["Animatsiyada ham, xuddi o'tgan darsdagidek, tezlikni tanlasa bo'ladi.", "Animatsiyada ham, transition kabi, tezlikni tanlasa bo'ladi."],
  ["Endi nomni xuddi keyframes qatoridagidek, kichik harflar bilan yozamiz. Mana, kubik darrov sakray boshladi!", "Esingizdami, nomni Sakra deb katta harf bilan yozgan edim? Endi uni xuddi keyframes qatoridagidek, kichik harflar bilan yozamiz. Mana, kubik darrov sakray boshladi!"]
];

export default {
  textFixes,
  course: 'css',
  dir: 'tools/css15',
  src: 'c15.src.jsx',
  screens: 'c15-screens.jsx',
  lessonId: 'css-15-animacii',
  slug: 'animacii',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "29-dars. @keyframes: kadrlar va takrorlash", ru: 'Урок 29. @keyframes: кадры и повторы', en: 'Lesson 29. @keyframes: frames and repeats' },
    { uz: "30-dars. animation: tezlik, yo'nalish va buzilgan kod", ru: 'Урок 30. animation: скорость, направление и поломки', en: 'Lesson 30. animation: speed, direction and broken code' }
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
  // S1.done не называет часть: «Bugun siz ham … o'rganasiz» + загадка про Sakra, «dars oxirida» — верно для части 1.
  s1Done: null,
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "Kubik o'zi sakrayapti", ru: 'Кубик прыгает сам', en: 'The cube jumps by itself' },
    next: { uz: "Keyingi dars: tezlik, yo'nalish va buzilgan kod", ru: 'Следующий урок: скорость, направление и поломки', en: 'Next lesson: speed, direction and broken code' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Yurib ketdi! Kubigimiz endi hech kimni kutmasdan o'zi sakrayapti, sichqonchaning ham keragi yo'q.",
        ru: 'Поехали! Кубик теперь прыгает сам, никого не ждёт, и мышка ему не нужна.',
        en: 'Off it goes! The cube now jumps by itself, waits for nobody, and doesn’t need the mouse.' } },
      { k: 'riddle', text: {
        uz: "Esingizdami, ichimdagi ikki Kodi bahslashgan edi: biri «Sakra bilan sakra baribir bir xil, kubik sakraydi» degan edi. Mana natija: kubik turibdi, vaqt chizig'ida esa nom kulrang. Kulrang degani, brauzer bunday nomli reja topolmadi. Ikkinchi Kodi haq chiqdi: CSS uchun katta va kichik harf boshqa-boshqa narsa ekan.",
        ru: 'Помнишь, я написал имя в animation с большой буквы: Sakra вместо sakra? Я думал, что это одно и то же слово. Смотри: кубик стоит, а на полосе имя серое. Серое значит, что браузер не нашёл такой план. Я ошибся: для CSS большие и маленькие буквы — разные.',
        en: 'Remember, I wrote the name in animation with a capital letter: Sakra instead of sakra? I thought it was the same word. Look: the cube is still, and the name on the bar is grey. Grey means the browser found no such plan. I was wrong: to CSS, capital and small letters are different.' } },
      { k: 'kf', text: {
        uz: "Xo'sh, kubikni aslida nima yurgizdi? Birinchisi keyframes: kubik harakatning boshida, o'rtasida va oxirida qayerda turishini yozib qo'yadigan reja. Kadrlarni from va to bilan ham yozsa bo'ladi, foizlar bilan ham.",
        ru: 'Что же на самом деле двигает кубик? Первое — keyframes: план, где кубик в начале, в середине и в конце движения. Кадры можно писать и через from и to, и в процентах.',
        en: 'So what really moves the cube? First, keyframes: a plan of where the cube is at the start, the middle and the end. Frames can be written with from and to, or in percent.' } },
      { k: 'anim', text: {
        uz: "Ikkinchisi animation: u rejani nomi bo'yicha topib, kubikka ulaydi va qancha davom etishini aytadi. Sichqonchani kutmaydi, transition esa sichqoncha kelganda ishlaydi.",
        ru: 'Второе — animation: она находит план по имени, подключает его к кубику и задаёт время. Мышку она не ждёт, в отличие от transition.',
        en: 'Second, animation: it finds the plan by name, connects it to the cube and sets the time. It doesn’t wait for the mouse, unlike transition.' } },
      { k: 'name', text: {
        uz: "Rejaning nomi esa ikki joyda harfma-harf bir xil bo'lishi kerak. Bahsimiz aynan shu haqda edi: bitta katta harf ham nomni boshqa nomga aylantiradi.",
        ru: 'А имя плана должно совпадать в двух местах буква в букву. Наша загадка была именно про это: одна большая буква — и имя уже другое.',
        en: 'And the plan’s name must match in both places letter for letter. Our riddle was exactly about that: one capital letter, and it’s already a different name.' } },
      { k: 'count', text: {
        uz: "Takrorlash esa oxirida yoziladi: son bo'lsa, kubik shuncha marta sakrab to'xtaydi, infinite bo'lsa, to'xtamaydi. Cheksiz sakrayotgan kubikni bir kuzating-chi: u har safar bir xil yuryaptimi? Menga u boshida va oxirida sal sekinlashgandek tuyuldi. Sizga-chi?",
        ru: 'А повторы пишут в конце: число — столько раз и остановится, infinite — без конца. Понаблюдай за кубиком, который прыгает бесконечно: он каждый раз двигается одинаково? Мне показалось, что в начале и в конце он чуть притормаживает. А тебе?',
        en: 'And the repeats go at the end: a number means that many times and then it stops, infinite means endless. Watch a cube that jumps endlessly: does it move the same way every time? To me it seemed to slow down a bit at the start and the end. What about you?' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Kubik muzlab qoldi', ru: 'Кубик застыл', en: 'The cube froze' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Voy, kubik yana muzlab qoldi-ku! Bu safar uni cheksiz aylantirmoqchi edim: aylanish rejasini ham yozdim, animation qatorini ham qo'shdim. Mana kod, mana kubik: qimirlamayapti.",
        ru: 'Ой, кубик опять застыл! В этот раз я хотел, чтобы он крутился без конца: написал план вращения и добавил animation. Вот код, вот кубик: не двигается.',
        en: 'Oops, the cube froze again! This time I wanted it to spin endlessly: I wrote the spinning plan and added animation. Here’s the code, here’s the cube: it isn’t moving.' } },
      { k: 'anim', text: {
        uz: "Rejaning nomi to'g'ri yozilgan, katta-kichik harflari ham joyida, infinite ham turibdi. Lekin animation qatorida nimadir tushib qolibdi. Qaysi so'z yo'q ekan, topa olasizmi?",
        ru: 'Имя плана написано верно, большие и маленькие буквы на месте, infinite тоже есть. Но в строке animation чего-то не хватает. Найдёшь, чего?',
        en: 'The plan’s name is right, the capital and small letters are in place, and infinite is there. But something is missing from the animation line. Can you find what?' } },
      { k: null, text: {
        uz: "Javobini hozir aytmayman, o'zingiz o'ylab ko'ring. Oldin kubikni boshqarishning yana ikkita usulini o'rganamiz: tezlikni va yo'nalishni. Keyin esa buzilgan rejalarni bittalab topib, tuzatamiz.",
        ru: 'Ответ сейчас не скажу, подумай сам. Сначала разберём ещё два способа управлять кубиком: скорость и направление. А потом найдём сломанные места и починим их.',
        en: 'I won’t give the answer right now, think about it. First we’ll learn two more ways to control the cube: speed and direction. After that we’ll hunt down the broken spots and fix them.' } }
    ]
  },
  e1Edits: COMMON.concat([
    ["i === 0 ? 'embarrassed' : 'point'", "i === 0 ? 'smile' : 'point'"],
    ["curK === 'riddle2' ? [SAKRA3, AN('sakra 1s infinite')] : ownRules(own);", "curK === 'kf' ? [SAKRA3] : [SAKRA3, AN('sakra 1s infinite')];"]
  ]),
  h2Edits: COMMON.concat([
    ["i === 0 ? 'hello' :", "i === 0 ? 'embarrassed' :"],
    ["const rows = curK === 'riddle' ? [SAKRA3, AN('Sakra 1s infinite')] : curK === 'riddle2' ? [SAKRA3, AN('sakra 1s infinite')] : ownRules(own);",
      "const rows = [AYLAN, AN('aylan infinite')];"]
  ])
};
