// Урок 3 курса CSS «Цвета» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 5 и 6.
// Часть 1 «Цвет текста: названия и hex» — s1…s7 + вывод E1 (разгадка про большие и маленькие буквы в hex);
// часть 2 «rgb, hsl и своя палитра» — крючок H2 + s8…s15.
const pageEdits = [
  ["  const store = useStore();\n  const mc = store.get('myColor') || '#7C3AED', mb = store.get('myBg') || 'hsl(260, 100%, 95%)';\n", ''],
  ["const rows = riddle ? ['h1 { color: #fa4f28; }'] : ['h1 { color: ' + mc + '; }', 'body { background-color: ' + mb + '; }'];",
    "const rows = riddle ? ['h1 { color: #fa4f28; }'] : ['h1 { color: #FA4F28; }'];"],
  ["const els = riddle ? site(pick, { hl: true, short: true }) : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.hello), k: 'p1' }];",
    "const els = site(pick, { hl: true, short: true });"],
  ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'],
  ['{riddle ? <LogoMatch color="#fa4f28" /> : null}', "<LogoMatch color={riddle ? '#fa4f28' : '#FA4F28'} />"],
  ["{['name', 'hex', 'rgb', 'hsl'].map((k) => (", "{['name', 'hex', 'rgb'].map((k) => ("]
];

export default {
  course: 'css',
  dir: 'tools/css3',
  src: 'c3.src.jsx',
  screens: 'c3-screens.jsx',
  lessonId: 'css-03-cveta',
  slug: 'cveta',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "5-dars. Matn rangi: nomlar va hex", ru: 'Урок 5. Цвет текста: названия и hex', en: 'Lesson 5. Text color: names and hex' },
    { uz: "6-dars. rgb, hsl va o'z ranglaringiz", ru: 'Урок 6. rgb, hsl и своя палитра', en: 'Lesson 6. rgb, hsl and your own palette' }
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
  // Часть 1: в этом уроке — два способа записи цвета (названия и hex); rgb — в следующем.
  s1Done: {
    uz: [["Bugun siz rangni uch xil usulda yozishni o'rganasiz: nomi bilan, hex kod bilan va rgb bilan.", "Bu darsda siz rangni ikki xil usulda yozishni o'rganasiz: nomi bilan va hex kod bilan."]],
    ru: [['Сегодня ты научишься записывать цвет тремя способами: названием, hex-кодом и через rgb.', 'В этом уроке ты научишься записывать цвет двумя способами: названием и hex-кодом.']],
    en: [['Today you’ll learn three ways to write a color: by name, with a hex code and with rgb.', 'In this lesson you’ll learn two ways to write a color: by name and with a hex code.']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: 'Logotip rangi mos tushdi', ru: 'Цвет логотипа совпал', en: 'The logo color matched' },
    next: { uz: "Keyingi dars: rgb, hsl va o'z ranglaringiz", ru: 'Следующий урок: rgb, hsl и свои цвета', en: 'Next lesson: rgb, hsl and your own colors' },
    roles: true,
    say: [
      { k: 'riddle', text: {
        uz: "Keling, bahsimizni hal qilamiz. Esingizdami, logotip kodini kichik harflar bilan yozgan edim? Mana natija: logotip yonida «Bir xil!» degan yozuv turibdi. Demak, rang buzilmabdi: hex kodda harf katta bo'ladimi, kichikmi, baribir.",
        ru: 'Давай решим наш спор. Помнишь, я записал код логотипа маленькими буквами и думал, что цвет сломается? Смотри: «Совпадает!». Выходит, цвет не изменился: в hex-коде большие и маленькие буквы значат одно и то же.',
        en: 'Let’s settle our argument. Remember, I wrote the logo code in small letters and thought the color would break? Look: “A match!”. So the color didn’t change: in a hex code, big and small letters mean the same thing.' } },
      { k: 'name', text: {
        uz: "Bugun rangni ikki usulda yozdik. Birinchisi: nomi bilan, masalan, red, blue, green. Oson, lekin nomlar unchalik ko'p emas.",
        ru: 'Мы научились записывать цвет двумя способами. Первый — названием: red, blue, green. Просто, но названий не так много.',
        en: 'We learned two ways to write a color. The first is by name: red, blue, green. Simple, but there aren’t that many names.' } },
      { k: 'hex', text: {
        uz: "Ikkinchisi hex kod bo'ldi: panjara belgisi va oltita belgi. Aynan shu bilan logotipdagi rangni aniq topdik.",
        ru: 'Второй — hex-код: решётка и шесть знаков. Именно им мы точно попали в цвет логотипа.',
        en: 'The second is a hex code: a hash sign and six symbols. That’s how we hit the logo color exactly.' } },
      { k: 'rgb', text: {
        uz: "Lekin bitta savol menga tinchlik bermayapti: hex kodda nega aynan oltita belgi bor? Aslida ular uchta juft, har bir juft bitta nurning kuchini aytadi. Qaysi nurlar ekan? Buni keyingi darsda bilib olamiz!",
        ru: 'Но меня мучает один вопрос: почему в hex-коде именно шесть знаков? На самом деле это три пары, и каждая пара говорит о силе одного луча. Какие это лучи? Узнаем на следующем уроке!',
        en: 'But one question keeps bugging me: why are there exactly six symbols in a hex code? They are really three pairs, and each pair tells the strength of one light. Which lights? We’ll find out in the next lesson!' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Davom etamiz', ru: 'Продолжаем', en: 'Let’s continue' },
    ask: { uz: 'Rang uchta nurdan', ru: 'Цвет из трёх лучей', en: 'A color from three lights' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Salom! O'tgan darsda rangni ikki usulda yozdik: nomi bilan va hex kod bilan. Logotipdagi rangni aynan hex kod berdi.",
        ru: 'Привет! На прошлом уроке мы записали цвет двумя способами: названием и hex-кодом. Цвет логотипа получился именно hex-кодом.',
        en: 'Hi! In the last lesson we wrote a color in two ways: by name and with a hex code. The logo color came out exactly with a hex code.' } },
      { k: 'hex', text: {
        uz: "Hex kodning oltita belgisiga yaxshilab qarang-chi: ular uchta juft. Har bir juft bitta nur. Qaysi uchta nur ekanini bilasizmi?",
        ru: 'Присмотрись к шести знакам hex-кода: это три пары. Каждая пара — один луч. Знаешь, какие это три луча?',
        en: 'Look closely at the six symbols of a hex code: they are three pairs. Each pair is one light. Do you know which three lights?' } },
      { k: 'rgb', text: {
        uz: "Qizil, yashil va ko'k. Ekran barcha ranglarni shu uch nurdan yig'adi. Nima deb o'ylaysiz, qizil bilan yashil nurni to'liq yoqsak, qanday rang chiqadi? Qani, sinab ko'ramiz!",
        ru: 'Красный, зелёный и синий. Экран собирает все цвета из этих трёх лучей. Как думаешь, какой цвет получится, если красный и зелёный включить на полную? Давай проверим!',
        en: 'Red, green and blue. A screen builds every color from these three lights. What do you think, which color will we get if we turn red and green on fully? Let’s check!' } }
    ]
  },
  e1Edits: pageEdits,
  h2Edits: pageEdits
};
