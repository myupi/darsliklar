// Урок 4 курса CSS «Фон» двумя частями (tools/qism/build.mjs <NN> css): сквозные уроки 7 и 8.
// Часть 1 «Цвет и картинка на фоне» — s1…s7 (фон элемента, background-image и url) + вывод E1 с разгадкой;
// часть 2 «Повтор, размер и поломки фона» — крючок H2 + s8…s15 (no-repeat, cover, поломки, свой фон).
// Загадка про «background-image: "maydon.jpg"» без url( ) разгадывается в E1: материала части 1 хватает — в s5 показан
// url и имя файла в кавычках, в s6 ученик сам собирает url("osmon.jpg"). В части 2 те же поломки разбираются на s11–s13,
// а s12 («я опять забыл url») без вопросов продолжает E1. Проверено: в экранах s1–s7 нет no-repeat, cover и запасного цвета.
//
// E1: до разгадки — вопрос ученику про любимый фон (по заданию), страница — то, что ученик собрал: голубое небо на фоне
// страницы и белая полоса под заголовком; чипы ролей — только background-color и background-image.
// H2: наблюдение «небо не сплошное» (картинка osmon.jpg из s6 — маленькая и сама повторяется), без белой полосы.

const SKY = "  const mi = 'osmon.jpg', mh = 'white';\n";
const STORE = ["  const store = useStore();\n  const mi = store.get('myImg') || 'osmon.jpg', mh = store.get('myHeadBg') || 'white';\n", SKY];
const ELS = ["const els = riddle ? site(pick) : [{ t: 'h1', text: pick(UI.mySite), k: 'h' }, { t: 'p', text: pick(C.site.p2), k: 'p1' }];", 'const els = site(pick);'];
const BR = ["title={riddle ? pick(C.site.title) : pick(UI.mySite)} url={riddle ? 'index.html' : 'mening.html'}", 'title={pick(C.site.title)} url="index.html"'];
const ROLES = ["{['color', 'image', 'repeat'].map((k) => (", "{['color', 'image'].map((k) => ("];

// E1: первая реплика (вопрос про фон) — улыбка, разгадка — смущение (признаёт ошибку).
const e1Edits = [
  STORE,
  ["i === 0 ? 'embarrassed' : 'point'", "i === 1 ? 'embarrassed' : i === 0 ? 'smile' : 'point'"],
  ELS,
  BR,
  ROLES
];
// H2: только небо (osmon.jpg) без полосы под заголовком — «странно, оно не сплошное».
const h2Edits = [
  STORE,
  ["'body { background-image: url(\"' + mi + '\"); } h1 { background-color: ' + mh + '; }';", "'body { background-image: url(\"' + mi + '\"); }';"],
  [".concat([cssL('h', 1, 'h1 { background-color: ' + mh + '; }')]);", ';'],
  ELS,
  BR,
  ROLES
];

// S15 части 2 после удаления разгадки открывается репликой «Bu esa…» — без опоры; начало переписано (uz).
const textFixes = [
  ["Bu esa sizning sahifangiz: foni ham, sarlavhasining rangi ham o'zingizniki!", "Mana sizning sahifangiz: foni ham, sarlavhasining rangi ham o'zingizniki!".replace('sarlavhasining', 'sarlavhaning')]
];

export default {
  textFixes,
  course: 'css',
  dir: 'tools/css4',
  src: 'c4.src.jsx',
  screens: 'c4-screens.jsx',
  lessonId: 'css-04-fon',
  slug: 'fon',
  riddleInE1: true,
  lessonTitleParts: [
    { uz: "7-dars. Fonda rang va rasm", ru: 'Урок 7. Цвет и картинка на фоне', en: 'Lesson 7. Color and picture on the background' },
    { uz: "8-dars. Takrorlanish, o'lcham va fon xatolari", ru: 'Урок 8. Повтор, размер и поломки фона', en: 'Lesson 8. Repeat, size and background bugs' }
  ],
  parts: [
    { screens: `{ id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 'e1', code: 'ACHIEVEMENT', Comp: E1 }` },
    { screens: `{ id: 'h2', code: 'HOOK', Comp: H2 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 },
  { id: 's8b', code: 'SHOW', Comp: S8B }, { id: 's9b', code: 'LEVEL-3B', Comp: S9B }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 }, { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'CHECK-4', Comp: S13 },
  { id: 'w1', code: 'LEVEL-W', Comp: W1 },
  { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }` }
  ],
  // S1.done уже обещает именно то, что в части 1: «rang ham, rasm ham» — правок нет.
  s1Done: null,
  e1: {
    eyebrow: { uz: 'Ikki xil fon', ru: 'Два вида фона', en: 'Two kinds of background' },
    ask: { uz: 'Fon: rang ham, rasm ham', ru: 'Фон: цвет и картинка', en: 'Background: color and picture' },
    next: { uz: "Keyingi dars: takrorlanish, o'lcham va fon xatolari", ru: 'Следующий урок: повтор, размер и поломки фона', en: 'Next lesson: repeat, size and background bugs' },
    roles: true,
    say: [
      { k: null, text: {
        uz: "Ayting-chi, bugun qaysi fon sizga ko'proq yoqdi: tekis rangmi yoki rasmmi? Menga ikkalasi ham yoqdi: sarlavhaning orqasida oppoq chiziq turibdi, sahifaning orqasida esa moviy osmon.",
        ru: 'Скажи-ка, какой фон тебе понравился больше: цветной или с картинкой? Мне нравятся оба: за заголовком белая полоса, а за страницей голубое небо.',
        en: 'Tell me, which background did you like more: a plain color or a picture? I like both: a white strip behind the heading and a blue sky behind the page.' } },
      { k: 'riddle', text: {
        uz: "Mana o'sha kodim! Maydon uchun qo'shtirnoq ichida faqat fayl nomini yozgan edim. Sahifaga qarang-chi: maydon yo'q, fon oppoq! Siz osmonni yig'ganda url so'zi bilan qavslarni qo'ygan edingiz-ku. Mening kodimda ular yo'q, shuning uchun brauzer yozuvni tushunmaydi va o'tkazib yuboradi. Demak, men adashgan ekanman.",
        ru: 'Вот мой старый код! Для поля я записал в кавычках только имя файла. Посмотри на страницу: поля нет, фон белый! В твоём коде с небом были слово url и скобки, а в моём их нет. Поэтому браузер не понимает запись и выбрасывает её. Выходит, я ошибся.',
        en: 'Here’s my old code! For the field I wrote only the file name in quotes. Look at the page: no field, and the background is white! Your sky code had the word url and brackets, and mine has neither. So the browser doesn’t understand the line and throws it away. Turns out I was wrong.' } },
      { k: 'color', text: {
        uz: "Bugun fonning ikki turi bilan tanishdik. Birinchisi rang: background-color qaysi selektorga yozilsa, o'sha elementning orqasini bo'yaydi. body bo'lsa butun sahifani, h1 bo'lsa sarlavhani.",
        ru: 'Сегодня мы познакомились с двумя видами фона. Первый — цвет: background-color красит фон того элемента, для которого он написан. Для body — всю страницу, для h1 — заголовок.',
        en: 'Today we met two kinds of background. The first is color: background-color paints the background of whatever element it’s written for. For body, the whole page; for h1, the heading.' } },
      { k: 'image', text: {
        uz: "Ikkinchisi rasm: background-image faylni url orqali oladi. Kichkina rasm o'zi takrorlanib, butun fonni to'ldirib tashlaydi, yulduzchalarim ham shunday qilgan edi-ku. Takrorlanishni to'xtatish ham, rasmni butun sahifaga yoyish ham mumkin. Qanday qilib, keyingi darsda bilib olasiz.",
        ru: 'Второй — картинка: background-image берёт файл через url. Маленькая картинка повторяется сама и заполняет весь фон, мои звёздочки сделали именно так! Повтор можно остановить, а картинку можно растянуть на всю страницу. Как это сделать, узнаем на следующем уроке.',
        en: 'The second is a picture: background-image takes a file through url. A small picture repeats by itself and fills the whole background, and my little stars did exactly that! You can stop the repeating, or stretch a picture over the whole page. We’ll learn how in the next lesson.' } }
    ]
  },
  h2: {
    eyebrow: { uz: 'Bitta katta osmon', ru: 'Одно большое небо', en: 'One big sky' },
    ask: { uz: "Osmon bo'laklarga bo'lingan", ru: 'Небо разбито на кусочки', en: 'The sky is in pieces' },
    roles: true,
    say: [
      { k: 'image', text: {
        uz: "G'alati-ku: osmon bir butun emas! Qarang-chi, bitta kichkina rasm qayta-qayta terilgan, quyosh ham, bulutlar ham har joyda takrorlanyapti.",
        ru: 'Странно: небо какое-то не сплошное! Смотри, одна маленькая картинка повторяется снова и снова: и солнце, и облака.',
        en: 'Strange: the sky isn’t one piece! Look, one small picture repeats again and again, the sun and the clouds too.' } },
      { k: null, text: {
        uz: "Yulduzchalar bilan ham shunday bo'lgan edi: kichkina rasm o'zi takrorlanib ketadi. Menga esa bitta katta osmon kerak, butun sahifaga yoyilgani. Sizningcha, buni qanday qilsa bo'ladi?",
        ru: 'Со звёздочками было так же: маленькая картинка повторяется сама. А мне нужно одно большое небо на всю страницу. Как думаешь, как этого добиться?',
        en: 'It was the same with the stars: a small picture repeats by itself. But I need one big sky across the whole page. What do you think, how can we do that?' } },
      { k: null, text: {
        uz: "Yordam bering-chi, birga topamiz! Oldin rasmni bittagina qoldirishni o'rganamiz, keyin uni butun sahifaga yoyamiz. Rasm chiqmay qolsa nima qilishni ham ko'rib chiqamiz.",
        ru: 'Помоги мне разобраться! Сначала научимся оставлять картинку одной, потом растянем её на всю страницу, а ещё посмотрим, что делать, если картинка не появилась.',
        en: 'Help me figure it out! First we’ll learn to keep just one picture, then we’ll stretch it over the whole page, and we’ll also see what to do when the picture doesn’t show up.' } }
    ]
  },
  e1Edits,
  h2Edits
};
