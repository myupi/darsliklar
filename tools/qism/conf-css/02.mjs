// Урок 2 курса CSS «Как выбрать элемент для стилизации» двумя частями (tools/qism/build.mjs 02 css): сквозные уроки 3 и 4.
// Итоговый экран урока — S12 (achievement), его тексты — C.s12.
// Часть 1 «Класс и id: как выбрать нужное» — s1…s7 (тег, class, id) + вывод E1 (разгадка про точку перед классом:
// точку ученик уже ставил сам в s2–s4, материала части 1 хватает);
// часть 2 «Класс или id: поломки и своя страница» — крючок H2 + k1…k3, s8…s10, w1, s11, q1, s12.
const common = [
  // Своего класса (store) в части 1 ещё нет: страница новостей Коди и правила, которые ученик уже писал.
  ["  const store = useStore();\n  const mc = store.get('myClass') || 'mening';\n", ''],
  ["const css = riddle ? 'muhim { color: red; }' : '.' + mc + ' { color: deeppink; }';", null],
  ["[{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.mine), cls: mc, k: 'm', hl: curK === 'cls' }]", null],
  ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'],
  ["lines={[cssL('r1', 0, css, { cls: riddle ? 'is-read' : '' }, riddle ? 'sel' : curK === 'cls' ? 'sel' : null)]}", null]
];
const fill = (list, vals) => {
  let i = 0;
  return list.map(([from, to]) => [from, to === null ? vals[i++] : to]);
};
const e1Edits = fill(common, [
  "const css = riddle ? 'muhim { color: red; }' : 'p { color: green; } .muhim { color: red; } #logo { color: orange; }';",
  "news(pick, { hId: 'logo', p2: 'muhim', hl: curK === 'cls' ? 'p2' : curK === 'id' ? 'h' : '' })",
  "lines={riddle ? [cssL('r1', 0, css, { cls: 'is-read' }, 'sel')] : ['p { color: green; }', '.muhim { color: red; }', '#logo { color: orange; }'].map((t, i) => cssL('r' + (i + 1), 0, t, null, ['tag', 'cls', 'id'][i] === curK ? 'sel' : null))}"
]).concat([
  // Первая реплика — «до и после» (улыбка), смущённая поза — на разгадке (она вторая).
  ["i === 0 ? 'embarrassed' : 'point'", "x.k === 'riddle' ? 'embarrassed' : i === 0 ? 'smile' : 'point'"]
]);
const h2Edits = fill(common, [
  // Сцена Коди: два одинаковых абзаца красные от правила p; нужен синий только второй — классом, потом id.
  "const css = riddle ? 'muhim { color: red; }' : 'p { color: red; }' + (curK === 'cls' ? ' .sport { color: blue; }' : curK === 'id' ? ' #xabar { color: blue; }' : '');",
  "news(pick, { p2: curK === 'cls' ? 'sport' : '', hl: 'p2' }).slice(1, 3).map((e, i) => (i === 1 && curK === 'id' ? Object.assign({}, e, { id: 'xabar' }) : e))",
  "lines={riddle ? [cssL('r1', 0, css, { cls: 'is-read' }, 'sel')] : ['p { color: red; }'].concat(curK === 'cls' ? ['.sport { color: blue; }'] : curK === 'id' ? ['#xabar { color: blue; }'] : []).map((t, i) => cssL('r' + (i + 1), 0, t, null, i === 1 ? 'sel' : null))}"
]).concat([
  // Крючок начинается без приветствия — со сцены: Коди показывает на абзацы, а не машет рукой.
  ["i === 0 ? 'hello' : i === c.say.length - 1", "i === 0 ? 'point' : i === c.say.length - 1"],
  // Загадка про точку теперь разгадана в выводе части 1: в тексте части 2 «в начале урока» → «в прошлом уроке» (узбекский),
  // а первая реплика вывода (после удаления разгадки) не должна начинаться с висящего «ham».
  ['function H2(', `{
  const fixUz = (o, f, t) => { if (!o.uz.includes(f)) throw new Error('qism: нет фрагмента: ' + f); o.uz = o.uz.replace(f, t); };
  fixUz(C.s9.say, "Bu dars boshidagi qoidamga", "Bu o'tgan darsdagi qoidamga");
  fixUz(C.q1.items[3].why, "Dars boshidagi qip-qizil sahifam", "O'tgan darsdagi qip-qizil sahifam");
  fixUz(C.s12.say[0].text, "Sizning abzasingiz ham ", "Mana, sizning abzasingiz ");
}
function H2(`]
]);

export default {
  course: 'css',
  dir: 'tools/css2',
  src: 'c2.src.jsx',
  screens: 'c2-screens.jsx',
  lessonId: 'css-02-selektory',
  slug: 'selektory',
  achievement: 'S12',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "3-dars. Class va id: kerakli elementni tanlash", ru: 'Урок 3. Класс и id: как выбрать нужное', en: 'Lesson 3. Class and id: picking what you need' },
    { uz: "4-dars. Class yoki id: buzilishlar va o'z sahifangiz", ru: 'Урок 4. Класс или id: поломки и своя страница', en: 'Lesson 4. Class or id: broken rules and your own page' }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 'k1', code: 'SHOW', Comp: K1 }, { id: 'k2', code: 'LEVEL-K', Comp: K2 }, { id: 'k3', code: 'CHECK-K', Comp: K3 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 'w1', code: 'LEVEL-W', Comp: W1 },
  { id: 's11', code: 'LEVEL-4', Comp: S11 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 's12', code: 'ACHIEVEMENT', Comp: S12 }` }
  ],
  // Часть 1 уже обещает «class и id» — в обеих частях это сходится: s1.done правок не требует.
  s1Done: null,
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Wrap-up' },
    ask: { uz: 'Sahifa endi rang-barang', ru: 'Страница стала разноцветной', en: 'The page is colorful now' },
    next: { uz: "Keyingi dars: class yoki id, buzilishlar va o'z sahifangiz", ru: 'Следующий урок: класс или id, поломки и своя страница', en: 'Next lesson: class or id, broken rules and your own page' },
    roles: true,
    say: [
      { k: 'tag', text: {
        uz: "Dars boshida p qoidasi hamma abzasni birdan qizil qilib yuborgan edi, esingizdami? Endi sahifaga qarang: sarlavha o'z rangida, muhim yangilik qizil, qolgan abzaslar esa yashil. Buni selektorlar qildi: ular har bir elementni alohida tanlab berdi!",
        ru: 'Помнишь, в начале урока правило для p сразу покрасило красным все абзацы? Теперь смотри на страницу: заголовок своего цвета, важная новость красная, а остальные абзацы зелёные. Это сделали селекторы: каждый выбрал свой элемент!',
        en: 'Remember, at the start of the lesson the p rule turned every paragraph red at once? Now look at the page: the heading has its own color, the important news is red, and the other paragraphs are green. Selectors did that: each one picked its own element!' } },
      { k: 'riddle', text: {
        uz: "Esingizdami, ichimda ikki ovoz bahslashgan edi? Mana o'sha qoida: unda muhim so'zining oldida nuqta yo'q, abzas esa bo'yalmay turibdi. Demak, «Nimadir yetishmayapti» degan ovoz haq chiqdi! Nuqtasiz brauzer muhim degan tegni qidiradi, bunday teg esa sahifada yo'q. Shuning uchun class nomining oldiga doim nuqta qo'yamiz.",
        ru: 'Помнишь, внутри меня спорили два голоса? Вот то самое правило: перед словом muhim нет точки, и абзац не покрасился. Значит, прав был голос «чего-то не хватает»! Без точки браузер ищет тег muhim, а такого тега на странице нет. Поэтому перед именем класса всегда ставим точку.',
        en: 'Remember, two voices argued inside me? Here’s that very rule: there’s no dot before muhim, and the paragraph stayed uncolored. So the voice saying “something’s missing” was right! Without the dot the browser looks for a tag called muhim, and there’s no such tag on the page. That’s why a class name always gets a dot.' } },
      { k: 'cls', text: {
        uz: "class bilan ikki joyga yozdik: HTML kodidagi class atributiga nom, CSS kodida esa o'sha nomning oldiga nuqta. Nom ikkala joyda bir xil bo'lsa, shu class berilgan hamma abzaslar bo'yaladi.",
        ru: 'С классом мы писали в двух местах: имя в атрибуте class в HTML и то же имя с точкой в CSS. Если имя совпадает, покрасятся все абзацы с этим классом.',
        en: 'With a class we wrote in two places: the name in the class attribute in HTML, and the same name with a dot in CSS. If the names match, every paragraph with that class gets colored.' } },
      { k: 'id', text: {
        uz: "id ham xuddi shunday ishlaydi, faqat nomning oldiga nuqta emas, panjara belgisi qo'yiladi. Uni sahifada faqat bitta elementga beramiz, masalan, sarlavhaga.",
        ru: 'id работает похоже, только перед именем ставим не точку, а решётку. И даём его на странице лишь одному элементу, например заголовку.',
        en: 'An id works in a similar way, but the name gets a hash sign instead of a dot. And it goes on only one element of the page, for example the heading.' } },
      { k: null, text: {
        uz: "Xo'sh, bitta savol: agar class nomida bitta harfni adashtirib qo'ysak-chi? Brauzer o'sha elementni baribir topadimi? Bunisini keyingi darsda tekshirib ko'ramiz.",
        ru: 'Ну а что, если в имени класса ошибиться на одну букву? Найдёт ли браузер тот же элемент? Это проверим на следующем уроке.',
        en: 'So what if we get one letter wrong in a class name? Will the browser still find the element? We’ll check that in the next lesson.' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Qaysi abzas?', ru: 'Какой абзац?', en: 'Which paragraph?' },
    ask: { uz: "Faqat bitta abzasni qanday bo'yaymiz?", ru: 'Как покрасить только один абзац?', en: 'How do we color just one paragraph?' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Mana, ikkita abzas: ikkalasi ham bir xil, chunki p qoidasi ularni birdan qizil qilib qo'ygan. Menga esa faqat ikkinchisi kerak, uni ko'k qilmoqchiman. Lekin p qoidasiga tegsam, ikkalasi ham o'zgarib ketadi-ku!",
        ru: 'Смотри, вот два абзаца: они одинаковые, ведь правило для p покрасило их красным сразу оба. А мне нужен синим только второй. Но если трогать правило p, изменятся оба!',
        en: 'Look, here are two paragraphs: they’re identical, because the p rule made both of them red at once. But I need only the second one blue. And if I touch the p rule, both will change!' } },
      { k: 'cls', text: {
        uz: "O'tgan darsda bunday paytlarda abzasga class berib, uni nuqta bilan tanlagan edik. Mana, ikkinchi abzasga sport degan class berdim-u, qoidani nuqta bilan yozdim. Qarang, faqat shu abzas ko'k bo'ldi!",
        ru: 'На прошлом уроке в таких случаях мы давали абзацу класс и выбирали его через точку. Вот я дал второму абзацу класс sport и написал правило с точкой. Смотри, посинел только он!',
        en: 'In the last lesson, in cases like this we gave a paragraph a class and picked it with a dot. Here I gave the second paragraph the class sport and wrote a rule with a dot. Look, only it turned blue!' } },
      { k: 'id', text: {
        uz: "Yana bir yo'li ham bor: id. Uni ham bitta abzasga berib, panjara belgisi bilan tanlasa bo'ladi. Natija xuddi shunday: ikkinchi abzas ko'k. Ikkalasi ham ishlayapti-ku, xo'sh, qaysi birini qachon tanlaymiz? Birga o'ylab ko'raylik-chi.",
        ru: 'Есть и второй путь: id. Его тоже можно дать одному абзацу и выбрать через решётку. Результат тот же: второй абзац синий. Работают оба, так что же и когда выбирать? Давай подумаем вместе.',
        en: 'There’s a second way too: id. You can give it to one paragraph and pick it with a hash sign. The result is the same: the second paragraph is blue. Both work, so which should we pick, and when? Let’s think it over together.' } }
    ]
  },
  e1Edits,
  h2Edits
};
