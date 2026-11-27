// Урок 5 курса CSS «Текст и шрифты» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 9 и 10.
// Часть 1 «Размер и шрифт» — s1…s7 (font-size и px, font-family и запасной шрифт) + вывод E1 с разгадкой;
// часть 2 «Жирность, выравнивание и подчёркивание» — крючок H2 + s8…s15 (font-weight, text-decoration, text-align, поломки, свой блог).
// Загадка про «font-size: 40» без px разгадывается в E1: в s3 ученик сам вписывает 40px, а подсказка про голое число
// («браузер выбрасывает значение без px») звучит именно там. Проверено: в экранах s1–s7 нет font-weight, text-decoration и text-align.
//
// E1: начинается с хвалы за Courier New (ученик сам собрал «"Courier New", monospace» в s6), страница — блог с заголовком
// 40px и этим шрифтом; чипы ролей — только font-size и font-family; концовка — «осталось одно слово» (заголовок ещё слева).
// H2: воспоминание о Courier New, поворот — текст всё равно в беспорядке.

const STORE = ["  const store = useStore();\n  const ms = store.get('mySize') || '36px', mf = store.get('myFont') || 'sans-serif';\n", "  const ms = '40px', mf = '\"Courier New\", monospace';\n"];
const ELS = ["const els = riddle ? site(pick, { hl: 'h1' }) : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.p1), k: 'p1' }];", "const els = site(pick, { hl: riddle ? 'h1' : '' });"];
const BR = ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'];
const ROLES = ["{['size', 'weight', 'align'].map((k) => (", "{['size'].map((k) => ("];

// E1: первая реплика (хвала) — улыбка, разгадка — смущение (признаёт, что проиграл спор).
const e1Edits = [
  STORE,
  ["i === 0 ? 'embarrassed' : 'point'", "i === 1 ? 'embarrassed' : i === 0 ? 'smile' : 'point'"],
  ELS,
  BR,
  ROLES
];
const h2Edits = [STORE, ELS, BR, ROLES];

export default {
  course: 'css',
  dir: 'tools/css5',
  src: 'c5.src.jsx',
  screens: 'c5-screens.jsx',
  lessonId: 'css-05-tekst-i-shrifty',
  slug: 'tekst-i-shrifty',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "9-dars. O'lcham va shrift", ru: 'Урок 9. Размер и шрифт', en: 'Lesson 9. Size and font' },
    { uz: "10-dars. Qalinlik, tekislash va tagiga chiziq", ru: 'Урок 10. Жирность, выравнивание и подчёркивание', en: 'Lesson 10. Boldness, alignment and underline' }
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
  // Часть 1 учит двум свойствам из пяти: S1.done («пять свойств») обещал бы лишнее.
  s1Done: {
    uz: [["Bugun siz matnni bezaydigan beshta xususiyatni o'rganasiz.", "Bu darsda siz harflarning o'lchami bilan shriftini o'zgartirishni o'rganasiz. Chiziq va matnning joyi esa keyingi darsga qoladi."]],
    ru: [['Сегодня ты узнаешь пять свойств для текста.', 'В этом уроке ты научишься менять размер букв и шрифт. Черту и положение текста оставим на следующий урок.']],
    en: [['Today you’ll learn five properties for text.', 'In this lesson you’ll learn to change the size of the letters and the font. The line and the position of the text will wait for the next lesson.']]
  },
  e1: {
    eyebrow: { uz: 'Xulosa', ru: 'Итог', en: 'Summary' },
    ask: { uz: "O'lcham va shrift tayyor", ru: 'Размер и шрифт готовы', en: 'Size and font are done' },
    next: { uz: 'Keyingi dars: qalinlik, tekislash va tagiga chiziq', ru: 'Следующий урок: жирность, выравнивание и подчёркивание', en: 'Next lesson: boldness, alignment and underline' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Qarang-chi, Courier New shrifti blogimga qanday yarashibdi! Endi u haqiqiy kod muharririga o'xshab qoldi. Shrift qatorini o'zingiz tartib bilan yig'dingiz: nom, vergul, zaxira shrift. Qoyil!",
        ru: 'Смотри, как Courier New подошёл моему блогу! Теперь он похож на настоящий редактор кода. Строка со шрифтом собрана тобой по порядку: имя, запятая, запасной шрифт. Круто!',
        en: 'Look how well Courier New suits my blog! Now it looks like a real code editor. You put the font line together yourself, in order: the name, the comma, the backup font. Awesome!' } },
      { k: 'riddle', text: {
        uz: "Sarlavhadagi o'sha qirq soni yodingizdami? Men font-size yoniga faqat son yozgan edim. Mana natijasi: sarlavha kichkinaligicha qolibdi! Siz esa sonning yoniga px qo'ygan edingiz-ku. Demak, o'lchamga birlik kerak: birlik bo'lmasa, brauzer qoidani tushunmaydi va o'tkazib yuboradi. Bahsni men yutqazdim.",
        ru: 'Помнишь число сорок для заголовка? Я написал в font-size только число, и вот результат: заголовок остался маленьким! А у тебя рядом с числом стояло px, и заголовок вырос. Выходит, размеру нужна единица: без неё браузер не понимает правило и выбрасывает его. Спор я проиграл.',
        en: 'Remember the number forty for the heading? I wrote only the number in font-size, and here’s the result: the heading stayed small! You had px next to the number, and the heading grew. So a size needs a unit: without it the browser doesn’t understand the rule and throws it away. I lost that argument.' } },
      { k: 'size', text: {
        uz: "Bugun harflar uchun ikkita narsani o'rgandik: o'lcham va shrift. O'lcham uchun son va px yoziladi, shrift uchun esa nom va zaxira shrift.",
        ru: 'Мы научились двум вещам для букв: размеру и шрифту. Размер пишут числом и px, а шрифт задают именем и запасным шрифтом.',
        en: 'We learned two things for letters: the size and the font. A size is written as a number and px, and a font is given as a name and a backup font.' } },
      { k: null, text: {
        uz: "Lekin sarlavhamning joyi ko'zimga yoqmayapti: u hali ham chap chetga yopishib turibdi. Uni qoq o'rtaga olib chiqish uchun atigi bitta so'z qoldi. Qaysi so'z ekanini keyingi darsda bilib olasiz.",
        ru: 'Но посмотри на заголовок: он всё ещё прижат к левому краю. Чтобы поставить его по центру, осталось всего одно слово. Какое, узнаем на следующем уроке.',
        en: 'But look at the heading: it’s still pressed against the left edge. To put it in the center, just one word is left. Which one, we’ll find out in the next lesson.' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Matnni tartibga solamiz', ru: 'Наводим порядок в тексте', en: 'Tidying up the text' },
    ask: { uz: 'Matn hali tartibsiz', ru: 'Текст пока в беспорядке', en: 'The text still looks messy' },
    roles: true,
    say: [
      { k: 'size', text: {
        uz: "Courier New shrifti bilan blogim kod muharririga o'xshab qolgan edi, sarlavhasi ham kattakon bo'lib turardi. Esingizdami?",
        ru: 'Мой блог со шрифтом Courier New стал похож на редактор кода, а заголовок вырос до сорока пикселей. Помнишь?',
        en: 'With the Courier New font my blog started to look like a code editor, and the heading grew to forty pixels. Remember?' } },
      { k: null, text: {
        uz: "Lekin bitta narsa ko'zimga tashlandi: o'lcham ham joyida, shrift ham, matn esa baribir tartibsiz turibdi. Havola tagida chiziq bor, abzasdagi muhim so'zlar esa boshqalardan umuman ajralib turmaydi.",
        ru: 'Но кое-что бросилось мне в глаза: размер и шрифт в порядке, а текст всё равно в беспорядке. Под ссылкой черта, а важные слова в абзаце ничем не выделены.',
        en: 'But something caught my eye: the size and the font are fine, yet the text is still a mess. The link has a line under it, and the important words in the paragraph don’t stand out at all.' } },
      { k: null, text: {
        uz: "Men oldin so'zlarni qalin qilaman, keyin havola tagidagi chiziqni olib tashlayman, oxirida esa sarlavhani o'rtaga qo'yaman. Yordam berasizmi?",
        ru: 'Я сначала сделаю слова жирными, потом уберу черту под ссылкой, а в конце поставлю заголовок по центру. Поможешь?',
        en: 'First I’ll make the words bold, then I’ll remove the line under the link, and finally I’ll put the heading in the center. Will you help?' } }
    ]
  },
  e1Edits,
  h2Edits
};
