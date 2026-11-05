// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 7 — «Лагерь Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot7/build.mjs → lessons/html/07p-formy-vybor.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 7 · «Лагерь Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на основе практики 06p — tools/amaliyot6). Коди сделал сайт летнего лагеря: смена,
// запись, спорт, отзывы — на каждой странице анкета. При сохранении анкеты сломались. Ученик чинит их по одной
// и сам пишет код: имя тега option у пункта списка → строка кнопки button → select с тремя option → найти
// слово в select без option (загадка урока 7; в дополнительной задаче — незакрытый textarea) → своя анкета:
// h1, form, select, textarea, button. Карта — вкладки браузера, как в 01p–06p. 7 слайдов: крючок · пять
// заданий · вывод. Сценарий — docs/scenarij-07p-formy-vybor.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a7-screens.jsx) находит теги, атрибуты и текст, страницу рисует
//     React. Браузер честный, как в уроке 7: select — поле со стрелкой и раскрытый список под ним (в Chrome
//     список всплывает; здесь — панель под полем); текст в select без option в список не попадает; textarea —
//     большое поле, текст между тегами — внутри поля, без </textarea> всё, что дальше, стало текстом в поле;
//     button — серая кнопка, надпись между тегами.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; ochiladigan ro'yxat, variant, katta
//     maydon, tugma — как в уроке 7. В речи select, option, textarea, button — по-английски. Символов
//     (= " /) в звучащих фразах нет. RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-07p-formy-vybor',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '7-amaliyot. Kodining lageri',
    ru: 'Практика 7. Лагерь Коди',
    en: 'Practice 7. Kodi’s camp'
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
  next: L3("Haqiqiy sayt tuzilishi", 'Структура настоящего сайта', 'Structure of a real site'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga faqat teg nomini yozing: burchakli qavslar kerak emas.", 'Здесь нужно только имя тега: без уголков.', 'Only the tag name here: no angle brackets.'),
  parts: L3("Anketa qismlari", 'Части анкеты', 'Form parts'),
  bpH1: L3("asosiy sarlavha", 'главный заголовок', 'main heading'),
  bpForm: L3("anketa", 'анкета', 'form'),
  bpSel: L3("ro'yxat, kamida ikkita option", 'список, хотя бы два option', 'a list, at least two options'),
  bpTa: L3("katta maydon, yopuvchi teg bilan", 'большое поле, с закрывающим тегом', 'a big field, with a closing tag'),
  bpBtn: L3("tugma, yozuvi teglar o'rtasida", 'кнопка, надпись между тегами', 'a button, its text between the tags'),
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
// ЛАГЕРЬ — названия страниц, подписи, пункты списков, надписи кнопок, подсказки больших полей.
// ─────────────────────────────────────────────────────────────────────────────
const PG = {
  smena: L3("Smena", 'Смена', 'Shift'),
  ovqat: L3("Ovqat", 'Еда', 'Food'),
  yozilish: L3("Yozilish", 'Запись', 'Sign-up'),
  profil: L3("Profil", 'Профиль', 'Profile'),
  sport: L3("Sport", 'Спорт', 'Sport'),
  sayohat: L3("Sayohat", 'Экскурсия', 'Trip'),
  fikr: L3("Fikrlar", 'Отзывы', 'Reviews'),
  savol: L3("Savollar", 'Вопросы', 'Questions')
};
const CAP = {
  oy: L3("Oy:", 'Месяц:', 'Month:'),
  taom: L3("Taom:", 'Блюдо:', 'Dish:'),
  name: L3("Ism:", 'Имя:', 'Name:'),
  baho: L3("Baho:", 'Оценка:', 'Rating:')
};
const OPT = {
  oy: L3(['Iyun', 'Iyul', 'Avgust'], ['Июнь', 'Июль', 'Август'], ['June', 'July', 'August']),
  taom: L3(['Palov', "Sho'rva", 'Manti'], ['Плов', 'Суп', 'Манты'], ['Plov', 'Soup', 'Manti']),
  sport: L3(['Futbol', 'Suzish', 'Shaxmat'], ['Футбол', 'Плавание', 'Шахматы'], ['Football', 'Swimming', 'Chess']),
  sayohat: L3(['Muzey', "Bog'", "Tog'"], ['Музей', 'Парк', 'Горы'], ['Museum', 'Park', 'Mountains']),
  baho: L3(["Juda zo'r", 'Yaxshi'], ['Отлично', 'Хорошо'], ['Great', 'Good'])
};
const BTN = {
  send: L3("Yuborish", 'Отправить', 'Send'),
  save: L3("Saqlash", 'Сохранить', 'Save')
};
const PH = {
  name: L3("Ismingiz", 'Твоё имя', 'Your name'),
  fikr: L3("Fikringizni yozing", 'Напиши отзыв', 'Write a review'),
  savol: L3("Savolingiz", 'Твой вопрос', 'Your question'),
  about: L3("O'zingiz haqida yozing", 'Напиши о себе', 'Write about yourself')
};
// ПЯТЬ ВКЛАДОК — объекты карты: файл страницы, значок, цвет. Пятая — своя анкета ученика.
const TABS = [
  { id: 'smena', file: 'smena.html', ico: 'sun', c: '#FA4F28', name: PG.smena },
  { id: 'yozilish', file: 'yozilish.html', ico: 'pen', c: '#7C5CFA', name: PG.yozilish },
  { id: 'sport', file: 'sport.html', ico: 'ball', c: '#0FA38E', name: PG.sport },
  { id: 'fikr', file: 'fikr.html', ico: 'chat', c: '#F59E0B', name: PG.fikr },
  { id: 'mine', file: 'anketa.html', ico: 'star', c: '#E44D26', name: L3("Mening anketam", 'Моя анкета', 'My form') }
];
const XTRA = {
  ownH: L3("Mening to'garagim", 'Мой кружок', 'My club'),
  ownOpts: L3(['Rasm', 'Musiqa'], ['Рисование', 'Музыка'], ['Drawing', 'Music']),
  ownBtn: L3("Yozilish", 'Записаться', 'Sign up')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {attr} — атрибут.
// В звучащих узбекских фразах нет тире и символов (= " /): движок делает из тире точку.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari chiziq «\\». Yopuvchi tegda oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("«{bad}» tegining oxirida o'ng burchakli qavs «>» yo'q.", 'В конце тега «{bad}» не хватает уголка «>».', 'The tag “{bad}” is missing the bracket “>” at the end.'),
  noLt: L3("«{bad}»: teg chap burchakli qavs «<» bilan boshlanadi.", '«{bad}» — тег начинается с уголка «<».', '“{bad}” — a tag starts with the bracket “<”.'),
  typo: L3("«{bad}» degan teg yo'q. Balki «{near}» demoqchisiz?", '«{bad}» — такого тега нет. Может быть, «{near}»?', '“{bad}” — there’s no such tag. Did you mean “{near}”?'),
  unknown: L3("«{bad}» tegi bizning anketamizda kerak emas. Bizda select, option, textarea va button bor.", 'Тег «{bad}» в нашей анкете не нужен. У нас есть select, option, textarea и button.', 'Our form doesn’t need the “{bad}” tag. We have select, option, textarea and button.'),
  noLevel: L3("«{bad}» degan sarlavha yo'q: sarlavhalar h1 tegidan h6 tegigacha bo'ladi.", 'Заголовка «{bad}» нет: заголовки бывают от h1 до h6.', 'There’s no “{bad}” heading: headings go from h1 to h6.'),
  emptyTag: L3("Burchakli qavslar ichida teg nomi bo'lishi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Bu yerga faqat body ichidagi qismni yozing: qolgani allaqachon bor.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body allaqachon bor: tepada va pastda. Uning ichiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  hasForm: L3("form allaqachon bor: tepada va pastda. Uning ichiga yozing.", 'form уже есть: сверху и снизу. Пиши внутри него.', 'form is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Matndan oldin ochuvchi {tag} tegi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeStray: L3("Bu yopuvchi {got} tegi, lekin {got} ochilmagan.", 'Это закрывающий тег {got}, но {got} не открыт.', 'That’s the closing {got} tag, but {got} was never opened.'),
  wrongOpen: L3("Bu yerda {tag} tegi kerak, {got} emas.", 'Здесь нужен тег {tag}, а не {got}.', 'You need the {tag} tag here, not {got}.'),
  needText: L3("{tag} ichiga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} qismi yopilmadi: oxiriga yopuvchi {tag} tegini yozing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmadi, shuning uchun pastdagi hamma narsa ham katta bo'lib ketdi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  extra: L3("Oxirida ortiqcha narsa qolibdi: {got}.", 'В конце осталось лишнее: {got}.', 'There’s something extra at the end: {got}.'),
  short: L3("Matn juda qisqa: kamida ikki harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} yopilmadi. Ajratilgan so'zlardan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Bu yopuvchi {tag} tegi, lekin {tag} ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichida kamida bitta so'z bo'lsin.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  h1First: L3("Sahifa sarlavhadan boshlanadi: eng tepaga h1 tegini yozing.", 'Страница начинается с заголовка: в самом верху напиши h1.', 'The page starts with a heading: write h1 at the very top.'),
  mainH1: L3("Asosiy sarlavha uchun h1 kerak, {got} emas.", 'Для главного заголовка нужен h1, а не {got}.', 'The main heading needs h1, not {got}.'),
  oneH1: L3("h1 sahifada bitta bo'ladi.", 'h1 на странице один.', 'A page has just one h1.'),
  aOpen: L3("a yopilmadi: havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт: после слов ссылки напиши закрывающий тег a.', 'a isn’t closed: add the closing a tag after the link words.'),
  // Атрибуты (уроки 4–7).
  noQuote: L3("{attr} qiymatini qo'shtirnoq ichiga yozing.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("{attr} so'zidan keyin teng belgisi, keyin qo'shtirnoq ichida qiymat keladi.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("«{bad}» degan atribut yo'q. {tag} tegida {list} bo'ladi.", 'Атрибута «{bad}» нет. У тега {tag} бывают {list}.', 'There’s no “{bad}” attribute. The {tag} tag has {list}.'),
  attrNone: L3("{tag} tegiga atribut kerak emas, uni olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  inputClose: L3("input yopilmaydi: yopuvchi input tegi kerak emas, uni olib tashlang.", 'input не закрывается: закрывающий тег input не нужен, убери его.', 'input doesn’t close: the closing input tag isn’t needed, remove it.'),
  needLabel: L3("Yozuvni label ichiga yozing, maydon ham o'sha yerda bo'lsin.", 'Подпись пиши внутри label, и поле — там же.', 'Write the caption inside label, with the field right there.'),
  // Список, большое поле, кнопка (урок 7).
  liNotOption: L3("{got} tegi oddiy ro'yxat uchun. select ichidagi variant option tegida yoziladi.", 'Тег {got} — для обычного списка. Пункт внутри select пишут в теге option.', 'The {got} tag is for a regular list. An item inside select goes in the option tag.'),
  selNotOption: L3("select bu butun ro'yxat. Bitta variant uchun option tegi kerak.", 'select — это весь список. Для одного пункта нужен тег option.', 'select is the whole list. One item needs the option tag.'),
  wordNoOpt: L3("«{got}» so'zi option tegisiz turibdi, shuning uchun ro'yxatga tushmadi. Uni ochuvchi va yopuvchi option teglari o'rtasiga yozing.", 'Слово «{got}» стоит без тега option, поэтому в список не попало. Напиши его между открывающим и закрывающим option.', 'The word “{got}” has no option tag, so it didn’t get into the list. Write it between the opening and closing option tags.'),
  optInSel: L3("option faqat select ichida yashaydi.", 'option живёт только внутри select.', 'option lives only inside select.'),
  needOpts: L3("Ro'yxatda {n} ta variant bo'lsin: har biri o'z option tegida.", 'В списке должно быть {n} пункта: каждый в своём option.', 'The list should have {n} items, each in its own option.'),
  optMissing: L3("Ro'yxatda «{want}» varianti yo'q.", 'В списке нет пункта «{want}».', 'The list has no “{want}” item.'),
  keepWord: L3("So'z o'zgarmasin: faqat uni option teglari bilan o'rang.", 'Пусть слово останется прежним: просто оберни его тегами option.', 'Keep the word as it was: just wrap it in option tags.'),
  taOpen: L3("textarea yopilmadi, shuning uchun pastdagi kod ham maydon ichiga matn bo'lib tushdi. Maydondan keyin yopuvchi textarea tegini yozing.", 'textarea не закрыт, поэтому код ниже попал в поле как текст. После поля напиши закрывающий тег textarea.', 'textarea isn’t closed, so the code below landed in the field as text. Add the closing textarea tag after the field.'),
  keepTa: L3("placeholder o'zgarmasin: faqat yopuvchi textarea tegini qo'shing.", 'Пусть placeholder останется прежним: просто добавь закрывающий textarea.', 'Keep the placeholder as it was: just add the closing textarea tag.'),
  btnInput: L3("Kerakli tugmani button tegi yasaydi, yozuvi esa teglar o'rtasida turadi.", 'Нужную кнопку делает тег button, а надпись стоит между тегами.', 'The button we need is made by the button tag, with its text between the tags.'),
  btnOther: L3("Tugma yozuvi boshqacha: button ichiga «{want}» deb yozing.", 'Надпись другая: напиши в button «{want}».', 'The button text is different: write “{want}” in button.'),
  needForm: L3("Sarlavha tayyor! Endi anketa: ochuvchi form tegi, ichida ro'yxat, katta maydon va tugma, oxirida yopuvchi form tegi.", 'Заголовок готов! Теперь анкета: открывающий тег form, внутри список, большое поле и кнопка, в конце закрывающий form.', 'The heading is ready! Now the form: the opening form tag, a list, a big field and a button inside, the closing form tag at the end.'),
  inForm: L3("Ro'yxat, maydon va tugma form ichida yashaydi. Ularni ochuvchi va yopuvchi form teglari o'rtasiga yozing.", 'Список, поле и кнопка живут внутри form. Пиши их между открывающим и закрывающим form.', 'The list, the field and the button live inside form. Write them between the opening and closing form tags.'),
  needSel: L3("Anketada hali ro'yxat yo'q: select tegi va ichida option variantlari.", 'В анкете пока нет списка: тег select и внутри пункты option.', 'The form has no list yet: the select tag with option items inside.'),
  twoOpts: L3("Ro'yxatda kamida ikkita variant bo'lsin, har biri o'z option tegida.", 'В списке пусть будет хотя бы два пункта, каждый в своём option.', 'Let the list have at least two items, each in its own option.'),
  needTa: L3("Oz qoldi! Endi katta maydon qo'shing: textarea tegi.", 'Почти готово! Теперь добавь большое поле — тег textarea.', 'Almost there! Now add a big field: the textarea tag.'),
  needBtn: L3("Oxirgi qadam: anketani yuboradigan tugma. button tegi, yozuvi teglar o'rtasida.", 'Последний шаг: кнопка, которая отправит анкету. Тег button, надпись между тегами.', 'Last step: a button that sends the form. The button tag, with its text between the tags.'),
  next: L3("Endi {tag} qismini yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Yozgi lager", 'Летний лагерь', 'Summer camp'),
    say: L3("Salom! Men yozgi lager uchun sayt yasadim. Unda smena, yozilish, sport va fikrlar sahifalari bor. Har birida anketa: ro'yxatdan tanlaysiz, katta maydonga yozasiz, tugmani bosasiz. Qarang, smena sahifasida uchta oy bor. Endi saytni saqlash qoldi. «Saqlash» tugmasini bosing.",
      'Привет! Я сделал сайт летнего лагеря. В нём есть страницы смены, записи, спорта и отзывов. На каждой анкета: выбираешь из списка, пишешь в большое поле, нажимаешь кнопку. Смотри, на странице смены три месяца. Осталось сохранить сайт. Нажми «Сохранить».',
      'Hi! I made a website for a summer camp. It has pages for the shift, sign-up, sport and reviews. Each has a form: you pick from a list, write in a big field, press a button. Look, the shift page has three months. Now I just need to save the site. Tap “Save”.'),
    broke: L3("Voy! Saqlash paytida anketalar buzilib qoldi. Qarang, ro'yxatda faqat ikkita oy qoldi: Iyul qatorida teg nomi o'chib ketdi!",
      'Ой! При сохранении анкеты сломались. Смотри, в списке осталось только два месяца: в строке июля стёрлось имя тега!',
      'Oh no! The forms broke while saving. Look, only two months are left in the list: the tag name got erased in the July line!'),
    done: L3("O'tgan darsda ro'yxat, katta maydon va tugma bilan tanishdik: select, option, textarea va button. Endi shu bilim bilan to'rtta anketani birma-bir tuzatamiz. Kodni o'zingiz yozasiz, men esa yoningizdaman. Beshinchi anketa esa sizniki bo'ladi!",
      'На прошлом уроке мы познакомились со списком, большим полем и кнопкой: select, option, textarea и button. Теперь с этими знаниями починим четыре анкеты по одной. Код пишешь ты, а я рядом. А пятая анкета будет твоей!',
      'Last lesson we met the list, the big field and the button: select, option, textarea and button. Now let’s use that to fix four forms one by one. You write the code, and I’ll be right here. And the fifth form will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("To'rtta anketani tuzatamiz — kodni o'zingiz yozasiz", 'Починим четыре анкеты — код пишешь ты', 'Let’s fix four forms — you write the code')
  },
  t1: {
    eyebrow: L3("Smena", 'Смена', 'Shift'),
    say: L3("Birinchi anketa: smena. Ro'yxatda Iyun va Avgust bor, Iyul esa yo'q. Kodga qarang: Iyul qatorida ochuvchi teg nomi o'chib ketgan. Shuning uchun brauzer uni ro'yxatga qo'shmadi. Burchakli qavslar ichiga variant tegining nomini yozing.",
      'Первая анкета: смена. В списке есть июнь и август, а июля нет. Посмотри на код: в строке июля стёрлось имя открывающего тега. Поэтому браузер не добавил его в список. Впиши в уголки имя тега пункта.',
      'The first form is the shift. The list has June and August, but no July. Look at the code: the opening tag name got erased in the July line. That’s why the browser didn’t add it to the list. Type the item tag name in the brackets.'),
    ask: L3("Teg nomini yozing: option", 'Впиши имя тега: option', 'Type the tag name: option'),
    ok: L3("Ajoyib! Iyul ro'yxatga qaytdi!", 'Отлично! Июль вернулся в список!', 'Great! July is back in the list!'),
    hints: [
      L3("Iyul qatori oxirida yopuvchi teg bor. Ochuvchi teg ham xuddi shunday nomlanadi.", 'В конце строки июля есть закрывающий тег. Открывающий называется так же.', 'The July line ends with a closing tag. The opening tag has the same name.'),
      L3("select bu butun ro'yxat, li esa oddiy ro'yxat uchun. select ichidagi variant boshqa teg bilan yoziladi.", 'select — весь список, а li — для обычного списка. Пункт внутри select пишут другим тегом.', 'select is the whole list, and li is for a regular list. An item inside select uses another tag.'),
      L3("Masalan, ovqat ro'yxati shunday yoziladi. Siz esa option deb yozing.", 'Например, список еды пишут так. А ты впиши option.', 'For example, a food list is written like this. You type option.')
    ],
    drill: L3("Endi ovqat ro'yxati: teg nomini yozing", 'Теперь список еды: впиши имя тега', 'Now the food list: type the tag name')
  },
  t2: {
    eyebrow: L3("Yozilish", 'Запись', 'Sign-up'),
    say: L3("Smena tayyor, endi yozilish. Anketada ism maydoni bor, lekin uni yuboradigan tugma o'chib ketgan. Bo'sh qatorga tugmani yozing: ochuvchi button, yozuv va yopuvchi button. Esingizdami, input yopilmaydi, button esa yopiladi.",
      'Смена готова, теперь запись. В анкете есть поле для имени, а кнопка, чтобы её отправить, стёрлась. Напиши в пустой строке кнопку: открывающий button, надпись и закрывающий button. Помнишь, input не закрывается, а button закрывается.',
      'The shift is done, now sign-up. The form has a name field, but the button that sends it got erased. Write the button in the empty row: the opening button, the text and the closing button. Remember, input doesn’t close, but button does.'),
    ask: L3("button qatori, yozuvi: «Yuborish»", 'Строка button, надпись: «Отправить»', 'button line, text: “Send”'),
    ok: L3("Barakalla! Tugma joyida, endi anketani yuborsa bo'ladi!", 'Вот это да! Кнопка на месте, анкету можно отправлять!', 'Wow! The button is in place, and the form can be sent!'),
    hints: [
      L3("Tugma button tegida yoziladi. Unda ochuvchi va yopuvchi teg bor.", 'Кнопку пишут в теге button. У него есть открывающий и закрывающий тег.', 'A button goes in the button tag. It has an opening and a closing tag.'),
      L3("Tugma yozuvi ochuvchi va yopuvchi button teglari o'rtasida turadi.", 'Надпись кнопки стоит между открывающим и закрывающим button.', 'The button text sits between the opening and closing button tags.'),
      L3("Mana, boshqa tugmaning qatori. Siz ham shunday yozing, faqat topshiriqdagi yozuv bilan.", 'Вот строка другой кнопки. Напиши так же, только с надписью из задания.', 'Here’s the line for another button. Write yours the same way, with the text from the task.')
    ],
    drill: L3("Endi profil: button yozuvi «Saqlash»", 'Теперь профиль: надпись button «Сохранить»', 'Now the profile: button text “Save”')
  },
  t3: {
    eyebrow: L3("Sport", 'Спорт', 'Sport'),
    say: L3("Ikki anketa tayyor! Uchinchisi: sport. Bu yerda sport turlari ro'yxati butunlay yo'qolgan. Uni o'zingiz yozing: ochuvchi select, ichida uchta option, oxirida yopuvchi select. Har bir variant o'z option tegida bo'lsin.",
      'Две анкеты готовы! Третья: спорт. Здесь целиком пропал список видов спорта. Напиши его сам: открывающий select, внутри три option, в конце закрывающий select. Каждый пункт — в своём option.',
      'Two forms are done! The third is sport. The list of sports vanished here completely. Write it yourself: the opening select, three options inside, the closing select at the end. Each item in its own option.'),
    ask: L3("select va uchta option: «Futbol», «Suzish», «Shaxmat»", 'select и три option: «Футбол», «Плавание», «Шахматы»', 'select and three options: “Football”, “Swimming”, “Chess”'),
    ok: L3("Zo'r! Ro'yxat ochildi, uchala sport turi ham joyida!", 'Огонь! Список открылся, все три вида спорта на месте!', 'Awesome! The list opens, and all three sports are there!'),
    hints: [
      L3("Oldin ochuvchi select, oxirida yopuvchi select. Variantlar ularning o'rtasida.", 'Сначала открывающий select, в конце закрывающий. Пункты — между ними.', 'First the opening select, the closing select at the end. The items go between them.'),
      L3("Har bir variant alohida qatorda: ochuvchi option, so'z va yopuvchi option.", 'Каждый пункт — на своей строке: открывающий option, слово и закрывающий option.', 'Each item on its own line: the opening option, the word and the closing option.'),
      L3("Mana, ovqat ro'yxati. Siz ham shunday yozing, faqat sport turlari bilan.", 'Вот список еды. Напиши так же, только с видами спорта.', 'Here’s the food list. Write yours the same way, with sports.')
    ],
    drill: L3("Endi sayohat: select va uchta option «Muzey», «Bog'», «Tog'»", 'Теперь экскурсия: select и три option «Музей», «Парк», «Горы»', 'Now a trip: select and three options “Museum”, “Park”, “Mountains”')
  },
  t4: {
    eyebrow: L3("Fikrlar", 'Отзывы', 'Reviews'),
    say: L3("Uchta anketa tayyor! To'rtinchisi: fikrlar. Bu yerda men baho ro'yxatini yasadim: select tegini ochdim va ichiga ikkita baho yozdim. Lekin qarang, ro'yxatda faqat bitta baho bor. Demak, bir qator buzilgan. Oldin o'sha qatorni toping va ustiga bosing.",
      'Три анкеты готовы! Четвёртая: отзывы. Тут я сделал список оценок: открыл тег select и написал внутри две оценки. Но смотри, в списке только одна. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three forms are done! The fourth is reviews. Here I made a list of ratings: I opened the select tag and wrote two ratings inside. But look, the list has only one. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Bu so'z select ichida turibdi, lekin option tegisiz. Brauzer bunday so'zni ro'yxatga qo'shmaydi. So'zni option teglari bilan o'rang.",
      'Нашлась! Это слово стоит внутри select, но без тега option. Такое слово браузер в список не добавляет. Оберни слово тегами option.',
      'Found it! This word is inside select, but without the option tag. The browser doesn’t add a word like that to the list. Wrap the word in option tags.'),
    foundX: L3("Topdingiz! textarea ochilgan, lekin yopilmagan. Shuning uchun tugma kodi maydon ichiga matn bo'lib tushdi. Qator oxiriga yopuvchi textarea tegini yozing.",
      'Нашлась! textarea открыт, но не закрыт. Поэтому код кнопки попал в поле как текст. Допиши в конце строки закрывающий тег textarea.',
      'Found it! textarea is opened but not closed. That’s why the button code landed in the field as text. Add the closing textarea tag at the end of the line.'),
    ok: L3("Ura, ishladi! Ro'yxat to'ldi. Buzilgan joyni xuddi haqiqiy dasturchidek topdingiz!", 'Ура, заработало! Список снова полный. Поломка найдена, как у настоящего программиста!', 'Yes, it works! The list is full again. You found the bug like a real developer!'),
    why: {
      0: L3("body shu yerda ochiladi, bu qator joyida. Ro'yxatga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на список.', 'body opens here, this line is fine. Look at the list.'),
      1: L3("Sarlavha h1 to'g'ri ochilgan va yopilgan. Bu qator joyida.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("Anketa shu yerda boshlanadi, bu qator joyida.", 'Здесь начинается анкета, строка в порядке.', 'The form starts here, this line is fine.'),
      3: L3("Ro'yxat shu yerda ochiladi, bu qator joyida. Ichidagi variantlarga qarang.", 'Здесь открывается список, строка в порядке. Посмотри на пункты внутри.', 'The list opens here, this line is fine. Look at the items inside.'),
      4: L3("Bu variant option ichida, u ro'yxatda bor. Ikkinchi baho qayerda? Bir qator pastga qarang.", 'Этот пункт внутри option, он в списке есть. А где вторая оценка? Посмотри на строку ниже.', 'This item is inside option, it’s in the list. Where’s the second rating? Look one line down.'),
      6: L3("Ro'yxat shu yerda yopiladi. Ikkinchi baho nega yo'q? Bir qator tepaga qarang.", 'Здесь закрывается список. Почему нет второй оценки? Посмотри на строку выше.', 'The list closes here. Why is the second rating missing? Look one line up.'),
      7: L3("Tugma joyida. Ro'yxatga qarang.", 'Кнопка в порядке. Посмотри на список.', 'The button is fine. Look at the list.'),
      8: L3("Anketa shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается анкета, строка в порядке.', 'The form closes here, this line is fine.'),
      9: L3("body shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    whyX: {
      0: L3("body shu yerda ochiladi, bu qator joyida. Katta maydonga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на большое поле.', 'body opens here, this line is fine. Look at the big field.'),
      1: L3("Sarlavha h1 to'g'ri ochilgan va yopilgan. Bu qator joyida.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("Anketa shu yerda boshlanadi, bu qator joyida.", 'Здесь начинается анкета, строка в порядке.', 'The form starts here, this line is fine.'),
      4: L3("Tugma kodi to'g'ri, lekin u maydon ichiga tushib qolgan. Bir qator tepaga qarang.", 'Код кнопки верный, но он попал внутрь поля. Посмотри на строку выше.', 'The button code is right, but it ended up inside the field. Look one line up.'),
      5: L3("Anketa shu yerda yopiladi. Tugma nega yo'q? Katta maydon qatoriga qarang.", 'Здесь закрывается анкета. Почему нет кнопки? Посмотри на строку большого поля.', 'The form closes here. Why is there no button? Look at the big field line.'),
      6: L3("body shu yerda yopiladi, bu qator joyida.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Ro'yxatga qarang: ikkinchi baho nega yo'q?", 'Посмотри на список: почему нет второй оценки?', 'Look at the list: why is the second rating missing?'),
      L3("select ichidagi qatorlarga qarang: qaysi so'z option tegisiz?", 'Посмотри на строки внутри select: какое слово без тега option?', 'Look at the lines inside select: which word has no option tag?'),
      L3("Mana, to'g'ri variant qatori. Siz ham so'zni option teglari bilan o'rang.", 'Вот правильная строка пункта. Оберни и ты слово тегами option.', 'Here’s a proper item line. Wrap the word in option tags too.')
    ],
    drill: L3("Bu anketada tugma yo'qoldi: buzilgan qatorni toping va tuzating", 'В этой анкете пропала кнопка: найди сломанную строку и почини', 'The button vanished in this form: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening anketam", 'Моя анкета', 'My form'),
    say: L3("To'rtta anketa yonib turibdi! Endi beshinchisi: sizning anketangiz. Bu yerda faqat body bor. O'z to'garagingiz uchun anketa yasang. Eng tepada h1 tegida sarlavha. Keyin form ichida variantlari bor ro'yxat, katta maydon va yuborish tugmasi.",
      'Четыре анкеты горят! Теперь пятая: твоя анкета. Здесь есть только body. Сделай анкету для своего кружка. В самом верху заголовок в теге h1. Потом внутри form список с пунктами, большое поле и кнопка отправки.',
      'Four forms are lit! Now the fifth: your form. There’s only body here. Make a form for your own club. At the very top, a heading in the h1 tag. Then inside form, a list with items, a big field and a send button.'),
    ask: L3("body ichiga: h1, form, select, textarea, button", 'В body: h1, form, select, textarea, button', 'Inside body: h1, form, select, textarea, button'),
    ok: L3("Bu juda zo'r chiqdi! Anketangizda ro'yxat, katta maydon va tugma bor!", 'Это было мощно! В твоей анкете есть список, большое поле и кнопка!', 'That was awesome! Your form has a list, a big field and a button!'),
    hints: [
      L3("Chizmaga qarang: oldin h1, keyin form, uning ichida select, textarea va button.", 'Посмотри на схему: сначала h1, потом form, а в нём select, textarea и button.', 'Look at the plan: first h1, then form, with select, textarea and button inside it.'),
      L3("select ichida kamida ikkita option. textarea va button yopuvchi teglari bilan.", 'Внутри select — хотя бы два option. textarea и button — с закрывающими тегами.', 'Inside select, at least two options. textarea and button with their closing tags.'),
      L3("Mana, to'garak anketasi. Xuddi shunday yozing, faqat o'z to'garagingiz bilan.", 'Вот анкета кружка. Напиши так же, только про свой кружок.', 'Here’s a club form. Write yours the same way, about your own club.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, beshta anketa ham tayyor: ro'yxatlar to'la, tugmalar joyida!", 'Смотри, все пять анкет готовы: списки полные, кнопки на месте!', 'Look, all five forms are ready: the lists are full, and the buttons are in place!') },
      { k: 'select', text: L3("select ochiladigan ro'yxat yasadi.", 'select делал выпадающий список.', 'select made a drop-down list.') },
      { k: 'option', text: L3("Har bir variant option ichida yozildi. option tegisiz so'z ro'yxatga tushmaydi.", 'Каждый пункт писали в option. Слово без option в список не попадает.', 'Each item went inside option. A word without option doesn’t get into the list.') },
      { k: 'textarea', text: L3("textarea katta maydon qo'ydi, u albatta yopiladi.", 'textarea ставил большое поле, и он обязательно закрывается.', 'textarea put a big field, and it always closes.') },
      { k: 'button', text: L3("button esa tugma yasadi, yozuvi teglar o'rtasida turadi.", 'А button делал кнопку, надпись — между тегами.', 'And button made a button, with its text between the tags.') },
      { k: 'own', text: L3("Oxirida esa o'z anketangizni yasadingiz. Bu juda kuchli bo'ldi! Keyingi darsda haqiqiy sayt qanday tuzilishini ko'ramiz.", 'А в конце — твоя собственная анкета. Это было мощно! На следующем уроке посмотрим, как устроен настоящий сайт.', 'And at the end you made your own form. That was awesome! Next lesson we’ll see how a real website is built.') }
    ],
    roles: {
      select: L3("select — ro'yxat", 'select — список', 'select — list'),
      option: L3("option — variant", 'option — пункт', 'option — item'),
      textarea: L3("textarea — katta maydon", 'textarea — большое поле', 'textarea — big field'),
      button: L3("button — tugma", 'button — кнопка', 'button — button'),
      own: L3("O'z anketamni yasadim", 'Своя анкета', 'I made my own form')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, foundX: 1, why: 1, whyX: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { select: 1, option: 1, textarea: 1, button: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a7-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a7.css@*/
`;
