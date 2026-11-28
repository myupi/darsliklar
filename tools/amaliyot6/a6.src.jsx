// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 6 — «Анкеты Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot6/build.mjs → lessons/html/06p-formy-vvod.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 6 · «Анкеты Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на основе практики 05p — tools/amaliyot5). Коди открыл на сайте кружки — футбол,
// шахматы, робототехника, рисование — и для каждого сделал анкету записи. При сохранении анкеты сломались:
// где-то пароль виден всем, где-то пропали поля. Ученик чинит анкеты по одной и сам пишет код: вид поля
// в type → строка input с type и placeholder → label с подписью и полем внутри → найти поле пароля,
// которое Коди «спрятал» через placeholder (загадка урока 6) → своя анкета: h1, form, два поля в label.
// Карта — вкладки браузера, как в 01p–05p. 7 слайдов: крючок · пять заданий · вывод. Сценарий —
// docs/scenarij-06p-formy-vvod.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a6-screens.jsx) находит теги, атрибуты и текст, страницу рисует
//     React. Браузер честный, как в уроке 6: password — точки; number — только цифры и стрелки; text и
//     незнакомый type — видно, что написано; placeholder — серая подсказка, пока поле пустое; label —
//     подпись и поле в одну строку; form на странице не видна; у input нет закрывающего тега.
//   · То, что написал посетитель (имя, пароль), в коде не появляется — как в уроке 6.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; maydon, yozuv, kulrang ishora,
//     anketa, maydon turi — как в уроке 6. В речи input, type, placeholder, label, form, text, password,
//     number — по-английски. Символов (= " /) в звучащих фразах нет. RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-06p-formy-vvod',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '6-amaliyot. Kodining anketalari',
    ru: 'Практика 6. Анкеты Коди',
    en: 'Practice 6. Kodi’s forms'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  check: L3("Tekshirish", 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  editor: L3("Kod muharriri", 'Редактор кода', 'Code editor'),
  keys: L3("Belgilar", 'Символы', 'Symbols'),
  save: L3("Saqlash", 'Сохранить', 'Save'),
  drill: L3("Qo'shimcha", 'Ещё разок', 'Bonus'),
  sample: L3("Namuna", 'Образец', 'Example'),
  workReady: L3("Ish tayyor", 'Работа готова', 'Work is ready'),
  nextLesson: L3("Keyingi dars", 'Следующий урок', 'Next lesson'),
  next: L3("Formalar, 2-qism", 'Формы, часть 2', 'Forms, part 2'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga maydon turining o'zini yozing, xolos: qo'shtirnoq bilan burchakli qavslar kodda allaqachon turibdi.", 'Здесь нужен только вид поля: без кавычек и уголков.', 'Only the field type here: no quotes or angle brackets.'),
  types: L3("Maydon turlari", 'Виды полей', 'Field types'),
  tyText: L3("ko'rinadi", 'видно', 'visible'),
  tyPass: L3("nuqtalar", 'точки', 'dots'),
  tyNum: L3("faqat son", 'только число', 'numbers only'),
  bpH1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'),
  bpForm: L3("anketa", 'анкета', 'form'),
  bpText: L3("yozuv, maydon va placeholder", 'подпись, поле и placeholder', 'caption, field and placeholder'),
  bpPass: L3("yozuv va parol maydoni", 'подпись и поле пароля', 'caption and password field'),
  given: L3("bor", 'уже есть', 'already there'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening anketam", 'Моя анкета', 'My form'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// КРУЖКИ — названия страниц; подписи полей; серые подсказки; что написали посетители (в коде этого нет).
// ─────────────────────────────────────────────────────────────────────────────
const CLUB = {
  futbol: L3("Futbol", 'Футбол', 'Football'),
  shaxmat: L3("Shaxmat", 'Шахматы', 'Chess'),
  robot: L3("Robototexnika", 'Робототехника', 'Robotics'),
  rasm: L3("Rasm chizish", 'Рисование', 'Drawing'),
  musiqa: L3("Musiqa", 'Музыка', 'Music'),
  suzish: L3("Suzish", 'Плавание', 'Swimming')
};
const CAP = {
  name: L3("Ism:", 'Имя:', 'Name:'),
  pass: L3("Parol:", 'Пароль:', 'Password:'),
  age: L3("Yosh:", 'Возраст:', 'Age:')
};
const PH = {
  name: L3("Ismingiz", 'Твоё имя', 'Your name'),
  age: L3("Yoshingiz", 'Твой возраст', 'Your age'),
  pass: L3("Parol", 'Пароль', 'Password'),
  game: L3("Masalan, Minecraft", 'Например, Minecraft', 'For example, Minecraft')
};
// Что набрали посетители в полях анкеты (в коде этого нет — пишет посетитель).
const VIS = { name: 'Ali', pass: 'gol2026', pass2: 'rasm2026', age: '12' };
// ПЯТЬ ВКЛАДОК — объекты карты: файл страницы, значок, цвет. Пятая — своя анкета ученика.
const TABS = [
  { id: 'futbol', file: 'futbol.html', ico: 'ball', c: '#FA4F28', name: CLUB.futbol },
  { id: 'shaxmat', file: 'shaxmat.html', ico: 'crown', c: '#7C5CFA', name: CLUB.shaxmat },
  { id: 'robot', file: 'robot.html', ico: 'gear', c: '#0FA38E', name: CLUB.robot },
  { id: 'rasm', file: 'rasm.html', ico: 'heart', c: '#F59E0B', name: CLUB.rasm },
  { id: 'mine', file: 'anketa.html', ico: 'star', c: '#E44D26', name: L3("Mening anketam", 'Моя анкета', 'My form') }
];
const XTRA = {
  ownH: L3("Mening klubim", 'Мой клуб', 'My club'),
  ownCap: L3("Sevimli o'yin:", 'Любимая игра:', 'Favorite game:')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {attr} — атрибут.
// В звучащих узбекских фразах нет тире и символов (= " /): движок делает из тире точку.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Bu yerda hali anketa yo'q, kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu chiziq teskari qiyshayib qolibdi: «\\». Yopuvchi tegga o'ngga qiyshaygan «/» yoziladi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("Teg «>» belgisiz tugabdi: \u2063«{bad}»\u2064.", 'В конце тега не хватает уголка «>»: \u2063«{bad}»\u2064.', 'This tag is missing the bracket “>” at the end: \u2063“{bad}”\u2064.'),
  noLt: L3("Qarang-chi, bu tegning boshida «<» yo'q ekan: \u2063«{bad}»\u2064. Teg doim chap burchakli qavsdan boshlanadi.", 'Тег начинается с уголка «<», а здесь его нет: \u2063«{bad}»\u2064.', 'A tag starts with the bracket “<”, but it’s missing here: \u2063“{bad}”\u2064.'),
  typo: L3("Brauzer bu so'zni tushunmadi: \u2063«{bad}»\u2064. «{near}» deb yozmoqchi edingizmi?", 'Такого тега нет: \u2063«{bad}»\u2064. Может быть, «{near}»?', 'There’s no such tag: \u2063“{bad}”\u2064. Did you mean “{near}”?'),
  unknown: L3("Anketamizda bunday teg uchramaydi: \u2063«{bad}»\u2064. Maydon qo'yish uchun input tegi kerak.", 'Такого тега в нашей анкете нет: \u2063«{bad}»\u2064. Для поля у нас есть тег input.', 'Our form has no such tag: \u2063“{bad}”\u2064. For a field we have the input tag.'),
  noLevel: L3("Bunday sarlavha tegi yo'q: \u2063«{bad}»\u2064. Sarlavhalar h1 tegidan h6 tegigacha bo'ladi, xolos.", 'Такого заголовка нет: \u2063«{bad}»\u2064. Заголовки бывают от h1 до h6.', 'There’s no such heading: \u2063“{bad}”\u2064. Headings go from h1 to h6.'),
  emptyTag: L3("Qavslar o'rtasida teg nomi bo'lishi kerak: ichiga nom yozing.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Bu yerda faqat body ichi sizniki: sahifaning qolgani tayyor.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body ikki marta kerak emas: u allaqachon tepada ochilib, pastda yopilgan. O'rtasiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  hasForm: L3("form teglari allaqachon turibdi: biri tepada, biri pastda. Maydonni ularning o'rtasiga yozing.", 'form уже есть: сверху и снизу. Пиши внутри него.', 'form is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Bu matn ochuvchi {tag} tegisiz qolgan. Uni matndan oldin yozing.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeStray: L3("Yopuvchi \u2063{got}\u2064 tegi bor-u, uni ochuvchi teg yo'q. Oldin ochuvchi tegini yozing, keyin yoping.", 'Это закрывающий тег \u2063{got}\u2064, но открывающего тега нет.', 'That’s the closing \u2063{got}\u2064 tag, but it was never opened.'),
  wrongOpen: L3("Bu joyga {tag} tegi yozilishi kerak edi, siz yozgan teg esa boshqa narsani bildiradi: \u2063{got}\u2064.", 'Здесь нужен тег {tag}, другой не подойдёт: \u2063{got}\u2064.', 'You need the {tag} tag here, not another one: \u2063{got}\u2064.'),
  needText: L3("{tag} tegining ichi bo'sh qolibdi. Unga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» tushib qolibdi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} qismi yopilmay qolibdi. Uning oxiriga yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmagan, anketaning pastki qismi ham sarlavhaga aylanib ketdi. Sarlavhadan keyin yopuvchi {tag} tegini qo'ying.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  extra: L3("Oxirida ortiqcha narsa qolib ketibdi: \u2063{got}\u2064.", 'В конце осталось лишнее: \u2063{got}\u2064.', 'There’s something extra at the end: \u2063{got}\u2064.'),
  short: L3("Matn juda qisqa. Kamida ikkita harf bo'lsa, brauzer uni ko'rsatadi.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} yopilmay qolgan ekan. Ajratilgan so'zlardan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Yopuvchi {tag} tegi turibdi-yu, {tag} hali ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("Hech bo'lmasa bitta so'zni {tag} ichiga yozing.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  h1First: L3("Anketaning birinchi qatori sarlavha bo'ladi: tepaga h1 tegini qo'ying.", 'Страница начинается с заголовка: в самом верху напиши h1.', 'The page starts with a heading: write h1 at the very top.'),
  mainH1: L3("Anketaning asosiy sarlavhasiga h1 tegi kerak, boshqasi emas: \u2063{got}\u2064.", 'Для главного заголовка нужен h1, другой не подойдёт: \u2063{got}\u2064.', 'The main heading needs h1, not another tag: \u2063{got}\u2064.'),
  oneH1: L3("Sahifada h1 tegi faqat bitta bo'ladi, ortiqchasini olib tashlang.", 'h1 на странице один.', 'A page has just one h1.'),
  aOpen: L3("a tegi yopilmay qolibdi, havola anketaning pastiga ham cho'zilibdi. Havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт: после слов ссылки напиши закрывающий тег a.', 'a isn’t closed: add the closing a tag after the link words.'),
  // Атрибуты (уроки 4–6).
  noQuote: L3("{attr} qiymati qo'shtirnoqsiz qolib ketibdi. Qiymatni qo'shtirnoq ichiga yozing.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("Teng belgisi tushib qolgan: {attr} so'zidan keyin u turishi kerak, keyin esa qo'shtirnoqli qiymat.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("Brauzer bunday atributni bilmaydi: \u2063«{bad}»\u2064. {tag} tegining atributlari esa mana bular: {list}.", 'Такого атрибута нет: \u2063«{bad}»\u2064. У тега {tag} бывают {list}.', 'There’s no such attribute: \u2063“{bad}”\u2064. The {tag} tag has {list}.'),
  attrNone: L3("Bu {tag} tegi atributsiz yoziladi, u yerdagi atributni olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  // Поля (урок 6).
  inputClose: L3("input tegining jufti yo'q, u yopilmaydi. Yopuvchi input tegini olib tashlang.", 'input не закрывается: закрывающий тег input не нужен, убери его.', 'input doesn’t close: the closing input tag isn’t needed, remove it.'),
  emptyType: L3("type qiymati bo'sh qolibdi, shuning uchun brauzer oddiy maydon chiqarib qo'ydi. Qo'shtirnoq ichiga maydon turini yozing.", 'type пустой, поэтому браузер сделал обычное поле. Впиши в кавычки вид поля.', 'type is empty, so the browser made a plain field. Type the field type in the quotes.'),
  noType: L3("Bu input tegida type yo'q ekan, shuning uchun maydon oddiyligicha qoldi. input tegiga type atributini qo'shing.", 'У этого тега input нет type, поэтому поле осталось обычным. Добавь type в тег input.', 'This input tag has no type, so the field stayed plain. Add type to the input tag.'),
  typeNo: L3("Bunday maydon turi yo'q: \u2063«{got}»\u2064, shuning uchun brauzer uni tushunmadi va oddiy maydon chiqardi. Bizda uchta tur bor: text, password va number.", 'Такого вида поля нет: \u2063«{got}»\u2064. Поэтому браузер сделал обычное поле. У нас есть text, password и number.', 'There’s no such field type: \u2063“{got}”\u2064. That’s why the browser made a plain field. We have text, password and number.'),
  passVisible: L3("text turida parol hammaga ochiq ko'rinib turadi. Uni nuqtalar ortiga faqat password yashira oladi.", 'Это вид text: пароль виден всем. Спрятать пароль за точками может password.', 'That’s the text type: everyone can see the password. password hides it behind dots.'),
  typeOther: L3("Maydon boshqa turda chiqdi: \u2063{got}\u2064. Bu yerga esa {want} kerak.", 'Это другой вид: \u2063{got}\u2064. А здесь нужен {want}.', 'That’s a different type: \u2063{got}\u2064. This one needs {want}.'),
  noPh: L3("Bu maydonda placeholder yo'q ekan, shuning uchun kulrang ishora ham chiqmadi. input tegiga placeholder atributini qo'shing.", 'Нет placeholder, поэтому в поле нет серой подсказки. Добавь placeholder в тег input.', 'There’s no placeholder, so the field has no grey hint. Add placeholder to the input tag.'),
  phOther: L3("Kulrang ishora boshqacha chiqibdi. placeholder ichiga «{want}» deb yozing.", 'Подсказка другая: в placeholder напиши «{want}».', 'The hint is different: write “{want}” in placeholder.'),
  needInput: L3("Bu yerga maydon kerak, u esa hali yo'q. input tegini yozing.", 'Здесь нужно поле: напиши тег input.', 'You need a field here: write the input tag.'),
  oneInput: L3("Bu qatorda faqat bitta maydon turishi kerak.", 'В этой строке одно поле.', 'There’s one field in this line.'),
  needLabel: L3("Yozuv bilan maydon label ichida birga yashaydi. Tartibi shunday: ochuvchi label, yozuv, input, keyin yopuvchi label.", 'Подпись и поле живут вместе внутри label: открывающий label, подпись, input и закрывающий label.', 'The caption and the field live together inside label: the opening label, the caption, input and the closing label.'),
  capInP: L3("p ichidagi yozuv maydonga bog'lanmaydi, uni bossangiz ham maydon tanlanmaydi. Yozuvni label ichiga yozing, maydon ham o'sha yerda tursin.", 'Подпись в p не связана с полем. Пиши подпись внутри label, и поле — там же.', 'A caption in p isn’t tied to the field. Write the caption inside label, with the field right there.'),
  labelNoCap: L3("label ichida maydon bor-u, yozuv yo'q. Maydonning oldiga yozuv qo'shing.", 'Внутри label перед полем должна быть подпись.', 'Inside label, put a caption before the field.'),
  capOther: L3("Bu yerda boshqa yozuv kerak edi: label ichiga «{want}» deb yozing.", 'Подпись другая: напиши в label «{want}».', 'The caption is different: write “{want}” in label.'),
  labelNoInput: L3("Yozuv bor-u, maydon yo'q. input tegini yozuvdan keyin, yopuvchi label tegidan oldin yozing.", 'Подпись есть, а поля нет. После подписи, перед закрывающим label, напиши тег input.', 'There’s a caption but no field. After the caption, before the closing label, write the input tag.'),
  inputOut: L3("Maydon label tegining tashqarisida qolib ketibdi. input tegini yopuvchi label tegidan oldinga ko'chiring.", 'Поле осталось снаружи label. Перенеси input перед закрывающим label.', 'The field ended up outside label. Move input before the closing label.'),
  keepLine: L3("Yozuvga tegmang, u to'g'ri turibdi. Faqat maydon turini tuzating.", 'Пусть подпись останется прежней: поправь только вид поля.', 'Keep the caption as it was: just fix the field type.'),
  needForm: L3("Sarlavha tayyor bo'ldi! Endi anketaning o'zini yozing: oldin ochuvchi form tegi, ichida maydonlar, oxirida yopuvchi form tegi.", 'Заголовок готов! Теперь анкета: открывающий тег form, внутри поля, в конце закрывающий form.', 'The heading is ready! Now the form: the opening form tag, the fields inside, the closing form tag at the end.'),
  inForm: L3("Maydonlar faqat form ichida yashaydi, anketa ularni shu yerda yig'adi. Ularni ikkita form tegining o'rtasiga yozing.", 'Поля живут внутри form. Пиши их между открывающим и закрывающим form.', 'Fields live inside form. Write them between the opening and closing form tags.'),
  twoFields: L3("Anketangizga ikkita maydon kerak: biri oddiy, biri parol uchun. Ularning har biri o'z label tegida tursin.", 'В анкете пусть будет два поля: обычное и для пароля. Каждое — в своём label.', 'Let the form have two fields: a plain one and one for a password. Each in its own label.'),
  needPh: L3("Oz qoldi! Oddiy maydonga placeholder atributini qo'shing, shunda unda kulrang ishora chiqadi.", 'Почти готово! Добавь обычному полю серую подсказку — атрибут placeholder.', 'Almost done! Add a grey hint to the plain field: the placeholder attribute.'),
  needPass: L3("Parol uchun maydon hali yo'q. Ikkinchi maydonni password turiga aylantiring.", 'Поля для пароля пока нет. Дай второму полю вид password.', 'There’s no password field yet. Give the second field the password type.'),
  next: L3("Endi {tag} qismini ham yozib qo'ying.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("To'garaklar", 'Кружки', 'Clubs'),
    say: L3("Onam telefon qildi: «Bolam, to'garaklaring qani?» Mana, saytimda to'rttasi bor: futbol, shaxmat, robototexnika va rasm chizish. Har birining anketasi bor, futbolniki esa parolni nuqtalar ortiga yashirib turibdi. Onamga ko'rsatishdan oldin yangi nusxani joyiga qo'yamiz: «Saqlash»ni bosing.",
      'Привет! Я открыл на сайте кружки: футбол, шахматы, робототехника и рисование. Для каждого сделал анкету записи. Смотри, в анкете футбола пароль спрятан за точками. Осталось сохранить сайт. Нажми «Сохранить».',
      'Hi! I opened clubs on my site: football, chess, robotics and drawing. I made a sign-up form for each one. Look, in the football form the password is hidden behind dots. Now I just need to save the site. Tap “Save”.'),
    broke: L3("Onamning xabari keldi: «Parolim ko'rinib qoldi!» Qarang: futbol anketasida maydon turi o'chib ketibdi, parol hammaning ko'z oldida turibdi. Onamning kompyuterida eski nusxa ochilgan ekan. Parolning siri qolmadi-ku!",
      'Ой! При сохранении анкеты сломались. В анкете футбола стёрся вид поля, и теперь пароль виден всем!',
      'Oh no! The forms broke while saving. In the football form the field type got erased, and now everyone can see the password!'),
    done: L3("Parolni qaytarib yashirish bitta so'zning ishi. Futboldan boshlab, to'rtta anketani ketma-ket tuzatamiz: input, type, placeholder va label bilan. Beshinchi to'garak esa sizniki: uni o'zingiz ochasiz.",
      'На прошлом уроке мы познакомились с полями: input, type, placeholder и label. Теперь с этими знаниями починим четыре анкеты по одной. Код пишешь ты, а я рядом. А пятая анкета будет твоей!',
      'Last lesson we met fields: input, type, placeholder and label. Now let’s use that to fix four forms one by one. You write the code, and I’ll be right here. And the fifth form will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("To'rtta anketani tuzatamiz — kodni o'zingiz yozasiz", 'Починим четыре анкеты — код пишешь ты', 'Let’s fix four forms — you write the code')
  },
  t1: {
    eyebrow: L3("Futbol", 'Футбол', 'Football'),
    say: L3("Futboldan boshlaymiz. Parol maydoniga qarang: type qiymati bo'm-bo'sh qolibdi. Qiymat bo'lmasa, brauzer uni oddiy maydon deb o'ylaydi. Ana, shuning uchun parol hammaga ochiq ko'rinib turibdi. Qo'shtirnoq ichiga parolni yashiradigan maydon turini yozing.",
      'Первая анкета: футбол. У поля пароля значение type осталось пустым. Без значения браузер считает поле обычным. Вот пароль и виден всем. Впиши в кавычки вид поля, который прячет пароль.',
      'The first form is football. The password field’s type value is empty. Without a value the browser treats the field as a plain one. That’s why everyone can see the password. Type the field type that hides the password in the quotes.'),
    ask: L3("type ichiga yozing: password", 'Впиши в type: password', 'Type in type: password'),
    ok: L3("Parol yana nuqtalar ortiga bekinib oldi, futbolchilarning sirini endi yondagi hech kim ko'rmaydi! Faqat esda tuting: darsda parol misol uchun, haqiqiy parolingizni hech qayerga yozmang.", 'Отлично! Пароль снова спрятался за точками! Только помни: в уроке пароль для примера, настоящий пароль никуда не вводи.', 'Great! The password is hidden behind dots again! Just remember: in the lesson the password is only an example, never type your real password anywhere.'),
    hints: [
      L3("Maydon qanaqa bo'lishini brauzerga type aytadi. Parol qatoridagi bo'sh qo'shtirnoqni ko'ryapsizmi?", 'Каким будет поле, говорит type. Найди пустые кавычки.', 'type says what the field is like. Find the empty quotes.'),
      L3("Bo'sh qo'shtirnoqqa uchta so'zdan biri yoziladi: text, password yoki number. Qaysi biri harflarni nuqtaga aylantiradi?", 'Видов три: text, password и number. Какой из них показывает точки? Посмотри на список рядом.', 'There are three types: text, password and number. Which one shows dots? Look at the list next to it.'),
      L3("Yosh maydonining type qiymati number, sonlar uchun. Parol maydoniga esa boshqa so'z yoziladi, uni yoningizdagi ro'yxatdan topasiz.", 'Например, поле возраста пишут так. А ты впиши password.', 'For example, an age field is written like this. You type password.')
    ],
    drill: L3("Endi yosh maydoni: type ichiga number yozing", 'Теперь поле возраста: впиши в type number', 'Now the age field: type number in type')
  },
  t2: {
    eyebrow: L3("Shaxmat", 'Шахматы', 'Chess'),
    say: L3("Futbolchilarning paroli endi nuqtalar ortida. Endi shaxmatchilar navbati. Bu anketada Ism degan yozuv bor-u, uning maydoni butunlay o'chib ketibdi. Maydon qanaqa bo'lishini type aytadi, kulrang ishorani esa placeholder yozadi. Qani, ikkalasini bitta input qatoriga yig'ib yozing-chi. input tegini yopmaysiz: u yolg'iz yuradi.",
      'Футбол готов, теперь шахматы. В этой анкете подпись «Имя» есть, а строка с полем стёрлась целиком. Напиши в пустой строке всё поле: тег input, в type — text, а в placeholder — серая подсказка. Помнишь, input не закрывается.',
      'Football is done, now chess. This form has the name caption, but the field line got erased completely. Write the whole field in the empty row: the input tag, text in type, and a grey hint in placeholder. Remember, input doesn’t close.'),
    ask: L3("input qatori: type «text», placeholder «Ismingiz»", 'Строка input: type «text», placeholder «Твоё имя»', 'input line: type “text”, placeholder “Your name”'),
    ok: L3("Ism maydoni qaytdi, ichida Ismingiz degan kulrang ishora ham turibdi. Shaxmatchilar endi ismini yoza oladi.", 'Вот это да! Вся строка — твоими руками, и в поле появилась серая подсказка!', 'Wow! You wrote the whole line, and the grey hint showed up in the field!'),
    hints: [
      L3("Maydonni input tegi chiqaradi. Bu maydonga ikkita atribut kerak: type va placeholder.", 'Поле пишут в теге input. Ему нужны два атрибута: type и placeholder.', 'A field goes in the input tag. It needs two attributes: type and placeholder.'),
      L3("type ichiga maydon turini, placeholder ichiga esa kulrang ishorani yozasiz. Har bir qiymat o'z qo'shtirnog'ida turadi.", 'В type — вид поля, а в placeholder — серая подсказка. Каждое значение в кавычках.', 'type holds the field type, and placeholder holds the grey hint. Each value goes in quotes.'),
      L3("Sevimli o'yin maydoni ham xuddi shu ikki atribut bilan yozilgan: type va placeholder. Ism uchun faqat kulrang ishora o'zgaradi.", 'Вот строка поля для игры. Напиши так же, только для имени.', 'Here’s the line for a game field. Write yours the same way, just for the name.')
    ],
    drill: L3("Endi yosh: type «number», placeholder «Yoshingiz»", 'Теперь возраст: type «number», placeholder «Твой возраст»', 'Now age: type “number”, placeholder “Your age”')
  },
  t3: {
    eyebrow: L3("Robototexnika", 'Робототехника', 'Robotics'),
    say: L3("Shaxmat ham tayyor, endi robototexnika anketasi! Yosh haqidagi savol butunlay yo'qolibdi. Uni label bilan yozing: ochuvchi label, Yosh degan yozuv, keyin son uchun maydon, oxirida yopuvchi label. Nega aynan label? Yozuvning o'zini bossangiz ham maydon yozishga tayyor bo'ladi.",
      'Две анкеты готовы! Третья: робототехника. Здесь пропал целиком вопрос про возраст. Напиши его через label: открывающий label, подпись «Возраст:», потом поле для числа и закрывающий label. Тогда нажатие на подпись выберет поле.',
      'Two forms are done! The third is robotics. The age question vanished here completely. Write it with label: the opening label, the caption “Age:”, then a field for a number and the closing label. Then tapping the caption will select the field.'),
    ask: L3("label «Yosh:» va ichida input, type «number»", 'label «Возраст:», а внутри input с type «number»', 'label “Age:” with input inside, type “number”'),
    ok: L3("Yozuv bilan maydon bir qatorda turibdi, ularni label bog'lab turibdi. Sinab ko'ring: Yosh so'zini bossangiz, maydon yozishga tayyor.", 'Огонь! Подпись и поле в одной строке и связаны друг с другом!', 'Awesome! The caption and the field are on one line and tied together!'),
    hints: [
      L3("Hammasi label tegining ichida bo'lishi kerak. Oldin ochuvchi label, oxirida yopuvchi label keladi, yozuv bilan maydon esa ularning o'rtasida turadi.", 'Сначала открывающий label, в конце закрывающий. И подпись, и поле — между ними.', 'First the opening label, the closing label at the end. Both the caption and the field go between them.'),
      L3("Yozuvdan keyin input tegini qo'ying, type ichiga number yozing. Shunda maydonga faqat son yozish mumkin bo'ladi.", 'После подписи — тег input, в type — number. Тогда в поле пишется только число.', 'After the caption comes the input tag with number in type. Then only a number can be typed in the field.'),
      L3("Parol uchun yozilgan label bilan yoshniki bir xil tuzilgan. Nimasi farq qiladi? Yozuv bilan maydon turi.", 'Вот label для пароля. Напиши так же, только для возраста.', 'Here’s a label for a password. Write yours the same way, just for age.')
    ],
    drill: L3("Endi parol: label «Parol:» va ichida input, type «password»", 'Теперь пароль: label «Пароль:», а внутри input с type «password»', 'Now a password: label “Password:” with input inside, type “password”')
  },
  t4: {
    eyebrow: L3("Rasm chizish", 'Рисование', 'Drawing'),
    say: L3("Uchta anketa joyiga tushdi, qoldi rasm chizish. Bu anketadagi parol maydoniga placeholder ichida Parol deb yozib, yashirdim deb o'ylagandim. Lekin qarang: bola parolini yozgan zahoti harflari ko'rinib qoldi! Men qaysi qatorda adashganman, topa olasizmi? O'sha qatorni bosing.",
      'Три анкеты готовы! Четвёртая: рисование. Тут я сам прятал пароль: написал в placeholder слово «Пароль». Но смотри: гость написал пароль, и его видно всем. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three forms are done! The fourth is drawing. Here I hid the password myself: I wrote “Password” in placeholder. But look, a visitor typed a password and everyone can see it. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Mana u! placeholder bor-yo'g'i kulrang ishora, u hech narsani yashirmaydi. Maydon turi esa text bo'lib qolgan, shuning uchun parol ko'rinib turibdi. text o'rniga password deb yozing.",
      'Нашлась! placeholder — только серая подсказка, он ничего не прячет. А вид поля здесь text, поэтому пароль виден. Напиши password вместо text.',
      'Found it! placeholder is only a grey hint, it doesn’t hide anything. And the field type here is text, so the password shows. Write password instead of text.'),
    ok: L3("Sir yana sir bo'lib qoldi! Demak, parolni placeholder emas, faqat password yashiradi.", 'Ура, заработало! Пароль спрятался за точками. Поломка найдена, как у настоящего программиста!', 'Yes, it works! The password is hidden behind dots. You found the bug like a real developer!'),
    why: {
      0: L3("Bu body qatori, parolga uning aloqasi yo'q. Parol qaysi maydonda ekanini qidiring.", 'Здесь открывается body, строка в порядке. Посмотри на поле пароля.', 'body opens here, this line is fine. Look at the password field.'),
      1: L3("Sarlavha o'qilib turibdi, demak, h1 butun. Parolni boshqa joydan izlang.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("form tegi shu yerda anketani ochadi, unda parol yashirinmagan. Pastroqqa tushing.", 'Здесь начинается анкета, строка в порядке.', 'The form starts here, this line is fine.'),
      3: L3("Ismni hamma ko'rsa ham bo'laveradi, bu maydon o'z joyida. Parol-chi? Bir qator pastga tushib qarang.", 'Имя можно видеть всем, это поле в порядке. А где пароль? Посмотри на строку ниже.', 'Everyone can see a name, this field is fine. Where’s the password? Look one line down.'),
      5: L3("Anketa shu yerda tugaydi. Parol nega ko'rinib turibdi ekan? Bir qator tepaga qarang.", 'Здесь закрывается анкета. Почему пароль виден? Посмотри на строку выше.', 'The form closes here. Why is the password showing? Look one line up.'),
      6: L3("Sahifa shu yerda tugaydi, parol esa undan tepada ochiq turibdi. Tepaga qarang.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Parolning harflari ochiq ko'rinyapti. Anketadagi qaysi maydon parol uchun ekan?", 'Пароль виден. Какое поле — для пароля?', 'The password shows. Which field is for the password?'),
      L3("Endi o'sha maydonning qatorini toping-da, type ichida nima yozilganiga qarang.", 'Посмотри на строку поля пароля: что стоит в type?', 'Look at the password field line: what’s in type?'),
      L3("Parol maydonining type qiymati password bo'lishi kerak. Sizning buzilgan maydoningizda esa nima yozilgan, solishtirib ko'ring.", 'Вот правильное поле пароля. Напиши и ты password вместо text.', 'Here’s a proper password field. Write password instead of text too.')
    ],
    drill: L3("Bu anketada ham bitta qator buzilgan, uni toping", 'Здесь то же самое: найди сломанную строку и почини', 'Same thing here: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening anketam", 'Моя анкета', 'My form'),
    say: L3("To'rtala anketa ishlayapti! O'z to'garagingiz bo'lsa, u nima haqida bo'lardi? Beshinchi anketa o'sha to'garak uchun. Oldin h1 tegida to'garagingizning nomini yozing: anketa nomsiz bo'lmaydi. Keyin form tegini oching, uning ichiga ikkita label qo'ying: birinchisida kulrang ishorali oddiy maydon, ikkinchisida parol maydoni.",
      'Четыре анкеты горят! Теперь пятая: твоя анкета. Здесь есть только body. Придумай свой кружок. В самом верху заголовок в теге h1. Потом внутри form два label: в первом обычное поле с серой подсказкой, во втором поле пароля.',
      'Four forms are lit! Now the fifth: your form. There’s only body here. Make up your own club. At the very top, a heading in the h1 tag. Then two labels inside form: a plain field with a grey hint in the first, and a password field in the second.'),
    ask: L3("body ichiga: h1, form va ikkita label", 'В body: h1, form и два label', 'Inside body: h1, form and two labels'),
    ok: L3("Anketangizda sarlavha ham, kulrang ishorali maydon ham, yashirin parol ham bor. Endi to'garagingizga a'zolar yozilishi mumkin!", 'Это было мощно! В твоей анкете есть заголовок, поле с серой подсказкой и пароль!', 'That was awesome! Your form has a heading, a field with a grey hint and a password!'),
    hints: [
      L3("Yonidagi chizma tartibni ko'rsatib turibdi: oldin h1, keyin form, uning ichida esa ikkita label.", 'Посмотри на схему: сначала h1, потом form, а в нём два label.', 'Look at the plan: first h1, then form, with two labels inside it.'),
      L3("Birinchi label ichiga yozuv va text turidagi maydonni yozing, maydonga placeholder ham qo'shing. Ikkinchi label ichida esa yozuv va password turidagi maydon tursin.", 'В первом label — подпись и поле с type text и placeholder. Во втором — подпись и поле с type password.', 'The first label has a caption and a field with type text and a placeholder. The second has a caption and a field with type password.'),
      L3("Mening to'garagimning anketasida nechta label bor? Ikkita. Sizniki ham ikkita bo'lsin: oddiy maydon bilan parol.", 'Вот анкета клуба. Напиши так же, только про свой кружок.', 'Here’s a club form. Write yours the same way, about your own club.')
    ]
  },
  drill: {
    say: L3("To'garaklarga yozilish davom etyapti, yana bitta anketa kerak: bu gal maydoni boshqa. O'zingiz tuzib ko'ring.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Ana, bu qoidani endi qo'lingiz ham eslab qoldi!", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Endi to'garaklarimizning hammasi o'quvchilarini kutib turibdi, parollar esa yana sir saqlaydi!", 'Смотри, все пять анкет готовы, и все поля работают!', 'Look, all five forms are ready, and every field works!') },
      { k: 'input', text: L3("Har bir maydonni input tegi yasadi. Uni yopish shart emas: input yolg'iz yashaydi, uning jufti yo'q.", 'Поле ставит тег input, и он не закрывается.', 'The input tag puts a field on the page, and input doesn’t close.') },
      { k: 'type', text: L3("Maydonning turini type tanladi. Rasm chizish anketasida o'zingiz ko'rdingiz: parolni placeholder emas, faqat password yashira oladi.", 'type выбирал вид поля: пароль прячет только password, а не placeholder.', 'type chose the field type: only password hides a password, not placeholder.') },
      { k: 'placeholder', text: L3("Kulrang ishora nima edi? Placeholder: u maydon bo'sh turganda ko'rinib turadi.", 'placeholder показывал серую подсказку в пустом поле.', 'placeholder showed a grey hint in an empty field.') },
      { k: 'label', text: L3("label esa yozuv bilan maydonni qo'shib qo'ydi, shuning uchun anketa bolalarga qulay bo'ldi.", 'А label связывал подпись с полем.', 'And label tied the caption to the field.') },
      { k: 'own', text: L3("Saytda endi sizning to'garagingiz ham bor, anketasi bilan birga! Bolalar ro'yxatdan tanlashi va anketani yuborishi uchun yana nima kerak ekan, o'ylab ko'ring.", 'А в конце — твоя собственная анкета. Это было мощно! На следующем уроке научимся выбору из списка и кнопке отправки.', 'And at the end you made your own form. That was awesome! Next lesson we’ll learn choosing from a list and the send button.') }
    ],
    roles: {
      input: L3("input — maydon", 'input — поле', 'input — field'),
      type: L3("type — maydon turi", 'type — вид поля', 'type — field type'),
      placeholder: L3("placeholder — kulrang ishora", 'placeholder — серая подсказка', 'placeholder — grey hint'),
      label: L3("label — maydon yozuvi", 'label — подпись поля', 'label — field caption'),
      own: L3("O'z anketamni yasadim", 'Своя анкета', 'I made my own form')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { input: 1, type: 1, placeholder: 1, label: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a6-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a6.css@*/
`;
