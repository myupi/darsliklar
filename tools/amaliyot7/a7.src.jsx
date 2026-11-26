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
  noTags: L3("Qavslar kodda allaqachon turibdi, bu yerga faqat teg nomini yozing.", 'Здесь нужно только имя тега: без уголков.', 'Only the tag name here: no angle brackets.'),
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
  empty: L3("Anketa hali yo'q, uni shu yerga yozasiz.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Teskari chiziq «\\» tushib qolibdi. Yopuvchi tegda uni «/» belgisiga almashtiring.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("Tegni yopuvchi o'ng burchakli qavs «>» tushib qolibdi: \u2063«{bad}»\u2064.", 'В конце тега не хватает уголка «>»: \u2063«{bad}»\u2064.', 'This tag is missing the bracket “>” at the end: \u2063“{bad}”\u2064.'),
  noLt: L3("Tegning boshidagi «<» tushib qolibdi: \u2063«{bad}»\u2064. Uni qaytarib qo'ying.", 'Тег начинается с уголка «<», а здесь его нет: \u2063«{bad}»\u2064.', 'A tag starts with the bracket “<”, but it’s missing here: \u2063“{bad}”\u2064.'),
  typo: L3("Bunaqa tegni brauzer bilmaydi: \u2063«{bad}»\u2064. «{near}» yozmoqchi bo'lgandingizmi?", 'Такого тега нет: \u2063«{bad}»\u2064. Может быть, «{near}»?', 'There’s no such tag: \u2063“{bad}”\u2064. Did you mean “{near}”?'),
  unknown: L3("Lager anketasiga bu teg kerak emas: \u2063«{bad}»\u2064. Bu yerda select, option, textarea va button bilan ishlaymiz.", 'Этот тег в нашей анкете не нужен: \u2063«{bad}»\u2064. У нас есть select, option, textarea и button.', 'Our form doesn’t need this tag: \u2063“{bad}”\u2064. We have select, option, textarea and button.'),
  noLevel: L3("Sarlavha tegi h harfi va bitta raqamdan yasaladi, bu esa boshqacha yozilgan: \u2063«{bad}»\u2064.", 'Такого заголовка нет: \u2063«{bad}»\u2064. Заголовки бывают от h1 до h6.', 'There’s no such heading: \u2063“{bad}”\u2064. Headings go from h1 to h6.'),
  emptyTag: L3("Qavslarni qo'ydingiz-u, ichiga hech narsa yozmabsiz. Teg nomi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Lager sahifasining qolgan qatorlari joyida, faqat body ichiga yozing.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("Lager sahifasi uchun body allaqachon yozilgan. Siz uning ichiga yozasiz.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  hasForm: L3("form teglari ham joyida: ochuvchisi tepada, yopuvchisi pastda. Siz faqat ularning o'rtasini yozing.", 'form уже есть: сверху и снизу. Пиши внутри него.', 'form is already there, at the top and bottom. Write inside it.'),
  needOpenText: L3("Matndan oldin ochuvchi {tag} tegini qo'ying, aks holda brauzer uni oddiy matn deb o'ylaydi.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeStray: L3("Yopuvchi \u2063{got}\u2064 tegi turibdi, lekin u hali ochilmagan. Oldin uni oching.", 'Это закрывающий тег \u2063{got}\u2064, но открывающего тега нет.', 'That’s the closing \u2063{got}\u2064 tag, but it was never opened.'),
  wrongOpen: L3("Bu joyga {tag} tegi keladi, boshqasi emas: \u2063{got}\u2064.", 'Здесь нужен тег {tag}, другой не подойдёт: \u2063{got}\u2064.', 'You need the {tag} tag here, not another one: \u2063{got}\u2064.'),
  needText: L3("{tag} ichiga hali hech narsa yozilmagan, so'z qo'shing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu ochuvchi teg bo'lib qolibdi: yopuvchi {tag} uchun oldiga qiya chiziq «/» qo'ying.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} ochilgan-u, yopilmay qolibdi. Oxiriga yopuvchi {tag} tegini qo'shing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmay qolibdi, shuning uchun brauzer pastdagi hamma narsani ham sarlavha deb o'yladi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  extra: L3("Kodning oxirida ortiqcha narsa qolib ketibdi, uni o'chirib tashlang: \u2063{got}\u2064.", 'В конце осталось лишнее: \u2063{got}\u2064.', 'There’s something extra at the end: \u2063{got}\u2064.'),
  short: L3("Bu so'z juda qisqa ekan, unga kamida ikkita harf kerak.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} yopilmay qolibdi. Uning ichidagi so'zlardan keyin yopuvchi {tag} tegini qo'ying.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Yopuvchi {tag} tegi bor-u, {tag} hali ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichiga so'z yozilmagan, hech bo'lmasa bittasini qo'shing.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  h1First: L3("Lager sahifasi ham sarlavhadan boshlanadi: tepaga h1 tegini qo'ying.", 'Страница начинается с заголовка: в самом верху напиши h1.', 'The page starts with a heading: write h1 at the very top.'),
  mainH1: L3("Lager nomi uchun h1 tegi kerak, boshqasi emas: \u2063{got}\u2064.", 'Для главного заголовка нужен h1, другой не подойдёт: \u2063{got}\u2064.', 'The main heading needs h1, not another tag: \u2063{got}\u2064.'),
  oneH1: L3("Ikkinchi h1 kerak emas, ortiqchasini o'chirib qo'ying.", 'h1 на странице один.', 'A page has just one h1.'),
  aOpen: L3("a tegi ochiq qolgan: lager sahifasida hamma narsa havolaga aylanib ketishi mumkin. Havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт: после слов ссылки напиши закрывающий тег a.', 'a isn’t closed: add the closing a tag after the link words.'),
  // Атрибуты (уроки 4–7).
  noQuote: L3("{attr} qiymati qo'shtirnoqsiz yozilibdi, uni qo'shtirnoq ichiga oling.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("{attr} so'zidan keyin teng belgisi yoziladi, so'ng qiymat qo'shtirnoq ichida turadi.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("Brauzer bunaqa atributni tanimaydi: \u2063«{bad}»\u2064. {tag} tegida {list} bo'lishi mumkin.", 'Такого атрибута нет: \u2063«{bad}»\u2064. У тега {tag} бывают {list}.', 'There’s no such attribute: \u2063“{bad}”\u2064. The {tag} tag has {list}.'),
  attrNone: L3("{tag} tegiga atribut bermaymiz, uni o'chirib qo'ying.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  inputClose: L3("input yopilmaydi, uning juftini qo'yish shart emas. Yopuvchi input tegini olib tashlang.", 'input не закрывается: закрывающий тег input не нужен, убери его.', 'input doesn’t close: the closing input tag isn’t needed, remove it.'),
  needLabel: L3("Maydonning yozuvini label ichiga yozing, maydonning o'zi ham o'sha yerda tursin.", 'Подпись пиши внутри label, и поле — там же.', 'Write the caption inside label, with the field right there.'),
  // Список, большое поле, кнопка (урок 7).
  liNotOption: L3("Bu teg oddiy ro'yxat bandlari uchun mo'ljallangan: \u2063{got}\u2064. select ichida variantni option tegi yasaydi.", 'Этот тег для обычного списка: \u2063{got}\u2064. Пункт внутри select пишут в теге option.', 'This tag is for a regular list: \u2063{got}\u2064. An item inside select goes in the option tag.'),
  selNotOption: L3("select butun ro'yxatni yasaydi. Bitta variant uchun esa option tegi kerak.", 'select — это весь список. Для одного пункта нужен тег option.', 'select is the whole list. One item needs the option tag.'),
  wordNoOpt: L3("Mana bu so'z option tegisiz qolibdi: \u2063«{got}»\u2064. Shuning uchun u ro'yxatga chiqmadi. Uni ochuvchi va yopuvchi option teglari o'rtasiga yozing.", 'Это слово стоит без тега option: \u2063«{got}»\u2064. Поэтому оно не попало в список. Напиши его между открывающим и закрывающим option.', 'This word has no option tag: \u2063“{got}”\u2064. So it didn’t get into the list. Write it between the opening and closing option tags.'),
  optInSel: L3("option tegi faqat select ichida yashaydi, uni o'sha yerga ko'chiring.", 'option живёт только внутри select.', 'option lives only inside select.'),
  needOpts: L3("Topshiriqda {n} ta so'z bor, ro'yxatda ham shuncha variant turishi kerak. Har birini o'z option tegiga yozing.", 'В списке должно быть {n} пункта: каждый в своём option.', 'The list should have {n} items, each in its own option.'),
  optMissing: L3("Ro'yxatda «{want}» varianti ko'rinmayapti, uni option bilan qo'shing.", 'В списке нет пункта «{want}».', 'The list has no “{want}” item.'),
  keepWord: L3("So'zni o'zgartirmang, uni faqat option teglari bilan o'rab qo'ying.", 'Пусть слово останется прежним: просто оберни его тегами option.', 'Keep the word as it was: just wrap it in option tags.'),
  taOpen: L3("textarea yopilmay qolibdi, shuning uchun brauzer pastdagi kodni ham maydon ichidagi matn deb o'yladi. Maydondan keyin yopuvchi textarea tegini yozing.", 'textarea не закрыт, поэтому код ниже попал в поле как текст. После поля напиши закрывающий тег textarea.', 'textarea isn’t closed, so the code below landed in the field as text. Add the closing textarea tag after the field.'),
  keepTa: L3("placeholder atributini o'zgartirmang, faqat yopuvchi textarea tegini qo'shing.", 'Пусть placeholder останется прежним: просто добавь закрывающий textarea.', 'Keep the placeholder as it was: just add the closing textarea tag.'),
  btnInput: L3("Bizga kerakli tugmani input emas, button tegi yasaydi. Tugmaning yozuvi esa ikkita button tegining o'rtasida turadi.", 'Нужную кнопку делает тег button, а надпись стоит между тегами.', 'The button we need is made by the button tag, with its text between the tags.'),
  btnOther: L3("Tugmadagi yozuv boshqacha chiqibdi. button ichiga «{want}» deb yozing.", 'Надпись другая: напиши в button «{want}».', 'The button text is different: write “{want}” in button.'),
  needForm: L3("Sarlavha tayyor! Endi anketaning o'zi qoldi: oldin ochuvchi form tegi, ichida ro'yxat, katta maydon va tugma, oxirida yopuvchi form tegi keladi.", 'Заголовок готов! Теперь анкета: открывающий тег form, внутри список, большое поле и кнопка, в конце закрывающий form.', 'The heading is ready! Now the form: the opening form tag, a list, a big field and a button inside, the closing form tag at the end.'),
  inForm: L3("Ro'yxat, maydon va tugmaning uyi form ichida. Ularni ochuvchi va yopuvchi form teglarining o'rtasiga ko'chiring.", 'Список, поле и кнопка живут внутри form. Пиши их между открывающим и закрывающим form.', 'The list, the field and the button live inside form. Write them between the opening and closing form tags.'),
  needSel: L3("Anketada hali ro'yxat yo'q. select tegini yozing, uning ichiga esa option variantlarini qo'ying.", 'В анкете пока нет списка: тег select и внутри пункты option.', 'The form has no list yet: the select tag with option items inside.'),
  twoOpts: L3("Ro'yxatda kamida ikkita variant bo'lsin, chunki bittasidan tanlab bo'lmaydi. Har biri o'zining option tegida tursin.", 'В списке пусть будет хотя бы два пункта, каждый в своём option.', 'Let the list have at least two items, each in its own option.'),
  needTa: L3("Oz qoldi! Endi anketaga katta maydon qo'shing, uni textarea tegi yasaydi.", 'Почти готово! Теперь добавь большое поле — тег textarea.', 'Almost there! Now add a big field: the textarea tag.'),
  needBtn: L3("Oxirgi qadam qoldi: anketani yuboradigan tugma kerak. Uni button tegi bilan yozing, yozuvi teglarning o'rtasida tursin.", 'Последний шаг: кнопка, которая отправит анкету. Тег button, надпись между тегами.', 'Last step: a button that sends the form. The button tag, with its text between the tags.'),
  next: L3("Keyingisi {tag} qismi, endi uni yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Yozgi lager", 'Летний лагерь', 'Summer camp'),
    say: L3("Yozgi lager ochilishiga bir hafta qoldi, sayt esa tayyor! Unda to'rtta anketa bor: lager navbati, yozilish, sport va fikrlar. Bolalar ro'yxatdan tanlaydi, katta maydonga yozadi, tugmani bosadi. Navbat ro'yxatida hozir uchta oy turibdi. Bolalar kirmasidan oldin «Saqlash»ni bosamiz.",
      'Привет! Я сделал сайт летнего лагеря. В нём есть страницы смены, записи, спорта и отзывов. На каждой анкета: выбираешь из списка, пишешь в большое поле, нажимаешь кнопку. Смотри, на странице смены три месяца. Осталось сохранить сайт. Нажми «Сохранить».',
      'Hi! I made a website for a summer camp. It has pages for the shift, sign-up, sport and reviews. Each has a form: you pick from a list, write in a big field, press a button. Look, the shift page has three months. Now I just need to save the site. Tap “Save”.'),
    broke: L3("Ukam xabar yozdi: «Iyul qani?» Rostdan ham, ro'yxatda ikkita oy qolibdi: Iyul qatoridagi teg nomi o'chib ketibdi. Telefonimda yozgan qismim aralashib ketgan shekilli, barmog'im kichkina klaviaturada adashgan.",
      'Ой! При сохранении анкеты сломались. Смотри, в списке осталось только два месяца: в строке июля стёрлось имя тега!',
      'Oh no! The forms broke while saving. Look, only two months are left in the list: the tag name got erased in the July line!'),
    done: L3("Lager boshlanishiga ulgurib tuzatamiz! Anketani yana to'rtta teg qaytaradi: select, option, textarea va button. Qaysi qator buzilganini birga topamiz, kodni esa o'zingiz yozasiz.",
      'На прошлом уроке мы познакомились со списком, большим полем и кнопкой: select, option, textarea и button. Теперь с этими знаниями починим четыре анкеты по одной. Код пишешь ты, а я рядом. А пятая анкета будет твоей!',
      'Last lesson we met the list, the big field and the button: select, option, textarea and button. Now let’s use that to fix four forms one by one. You write the code, and I’ll be right here. And the fifth form will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("To'rtta anketani tuzatamiz — kodni o'zingiz yozasiz", 'Починим четыре анкеты — код пишешь ты', 'Let’s fix four forms — you write the code')
  },
  t1: {
    eyebrow: L3("Smena", 'Смена', 'Shift'),
    say: L3("Smena anketasidan boshlaymiz. Ro'yxatga bir qarang-chi: Iyun bor, Avgust bor, Iyul esa yo'q. Sababi kodda ko'rinib turibdi: Iyul qatorida ochuvchi tegning nomi o'chib ketgan. Nomsiz tegni brauzer variant deb tanimaydi, shuning uchun Iyulni ro'yxatga qo'shmadi. Variantni qaysi teg yasaydi? Qavslar o'rtasiga shuning nomini yozing-da, «Tekshirish»ni bosing.",
      'Первая анкета: смена. В списке есть июнь и август, а июля нет. Посмотри на код: в строке июля стёрлось имя открывающего тега. Поэтому браузер не добавил его в список. Впиши в уголки имя тега пункта.',
      'The first form is the shift. The list has June and August, but no July. Look at the code: the opening tag name got erased in the July line. That’s why the browser didn’t add it to the list. Type the item tag name in the brackets.'),
    ask: L3("Teg nomini yozing: option", 'Впиши имя тега: option', 'Type the tag name: option'),
    ok: L3("Mana, Iyul ham ro'yxatda! Endi bolalar uni ham tanlay oladi.", 'Отлично! Июль вернулся в список!', 'Great! July is back in the list!'),
    hints: [
      L3("Iyul qatorining oxiriga qarang: u yerda yopuvchi teg turibdi. Ochuvchi tegning nomi ham xuddi o'sha bo'ladi.", 'В конце строки июля есть закрывающий тег. Открывающий называется так же.', 'The July line ends with a closing tag. The opening tag has the same name.'),
      L3("select butun ro'yxatni yasaydi, li tegi esa oddiy ro'yxatlarda ishlaydi. Demak, select ichidagi variantga boshqa teg kerak.", 'select — весь список, а li — для обычного списка. Пункт внутри select пишут другим тегом.', 'select is the whole list, and li is for a regular list. An item inside select uses another tag.'),
      L3("Ovqat ro'yxatidagi har bir taom o'z tegi ichida turibdi. Shu tegning nomi sizga ham kerak: u option.", 'Например, список еды пишут так. А ты впиши option.', 'For example, a food list is written like this. You type option.')
    ],
    drill: L3("Endi ovqat ro'yxati: teg nomini yozing", 'Теперь список еды: впиши имя тега', 'Now the food list: type the tag name')
  },
  t2: {
    eyebrow: L3("Yozilish", 'Запись', 'Sign-up'),
    say: L3("Smena joyida, endi yozilish sahifasi. Bu anketada ism yoziladigan maydon bor, lekin uni yuboradigan tugma o'chib ketibdi. Tugmasiz bolalar ismini yozadi-yu, yubora olmaydi-da! Bo'sh qatorga tugmani yozing. Tugmaning yozuvi bor, u ikkita teg o'rtasida turadi, shuning uchun button tegini yopish ham kerak.",
      'Смена готова, теперь запись. В анкете есть поле для имени, а кнопка, чтобы её отправить, стёрлась. Напиши в пустой строке кнопку: открывающий button, надпись и закрывающий button. Помнишь, input не закрывается, а button закрывается.',
      'The shift is done, now sign-up. The form has a name field, but the button that sends it got erased. Write the button in the empty row: the opening button, the text and the closing button. Remember, input doesn’t close, but button does.'),
    ask: L3("button qatori, yozuvi: «Yuborish»", 'Строка button, надпись: «Отправить»', 'button line, text: “Send”'),
    ok: L3("Tugma qaytdi: input yozuvni qabul qiladi, button esa uni yuboradi. Endi ism yozgan bola anketani yubora oladi.", 'Вот это да! Кнопка на месте, анкету можно отправлять!', 'Wow! The button is in place, and the form can be sent!'),
    hints: [
      L3("Tugmani button tegi yasaydi. input yolg'iz turardi, button esa ochiladi va yopiladi.", 'Кнопку пишут в теге button. У него есть открывающий и закрывающий тег.', 'A button goes in the button tag. It has an opening and a closing tag.'),
      L3("Tugmadagi yozuv qayerda turishini o'ylab ko'ring: ochuvchi va yopuvchi button teglarining o'rtasida.", 'Надпись кнопки стоит между открывающим и закрывающим button.', 'The button text sits between the opening and closing button tags.'),
      L3("Boshqa tugmaning qatori qanday yozilgan? Ochuvchi button, yozuv, yopuvchi button. «Yuborish» ham shunday tuziladi.", 'Вот строка другой кнопки. Напиши так же, только с надписью из задания.', 'Here’s the line for another button. Write yours the same way, with the text from the task.')
    ],
    drill: L3("Endi profil: button yozuvi «Saqlash»", 'Теперь профиль: надпись button «Сохранить»', 'Now the profile: button text “Save”')
  },
  t3: {
    eyebrow: L3("Sport", 'Спорт', 'Sport'),
    say: L3("Ikkita anketa ishlayapti, endi sport sahifasi! Unda sport turlari ro'yxati butunlay g'oyib bo'libdi, bolalar endi qaysi sportni tanlaydi? Qani, ro'yxatni qaytadan yig'amiz. Oldin select tegini oching-da, sport turlarini bittalab yozib chiqing: har biri o'z option tegida tursin. Oxirida select tegini yopishni unutmang.",
      'Две анкеты готовы! Третья: спорт. Здесь целиком пропал список видов спорта. Напиши его сам: открывающий select, внутри три option, в конце закрывающий select. Каждый пункт — в своём option.',
      'Two forms are done! The third is sport. The list of sports vanished here completely. Write it yourself: the opening select, three options inside, the closing select at the end. Each item in its own option.'),
    ask: L3("select va uchta option: «Futbol», «Suzish», «Shaxmat»", 'select и три option: «Футбол», «Плавание», «Шахматы»', 'select and three options: “Football”, “Swimming”, “Chess”'),
    ok: L3("Ro'yxat ochildi: futbol ham, suzish ham, shaxmat ham joyida turibdi!", 'Огонь! Список открылся, все три вида спорта на месте!', 'Awesome! The list opens, and all three sports are there!'),
    hints: [
      L3("Ro'yxatni ochuvchi select boshlaydi, yopuvchi select tugatadi. Variantlar ularning o'rtasida turadi.", 'Сначала открывающий select, в конце закрывающий. Пункты — между ними.', 'First the opening select, the closing select at the end. The items go between them.'),
      L3("Har bir variantni alohida qatorga yozing: ochuvchi option, sport turi, keyin yopuvchi option.", 'Каждый пункт — на своей строке: открывающий option, слово и закрывающий option.', 'Each item on its own line: the opening option, the word and the closing option.'),
      L3("Ovqat ro'yxatiga qarang: select ichida taomlar option teglarida. Sport turlari ham shunday qatorlashadi.", 'Вот список еды. Напиши так же, только с видами спорта.', 'Here’s the food list. Write yours the same way, with sports.')
    ],
    drill: L3("Lager sayohati: select va uchta option «Muzey», «Bog'», «Tog'»", 'Теперь экскурсия: select и три option «Музей», «Парк», «Горы»', 'Now a trip: select and three options “Museum”, “Park”, “Mountains”')
  },
  t4: {
    eyebrow: L3("Fikrlar", 'Отзывы', 'Reviews'),
    say: L3("Fikrlar sahifasida baho ro'yxatiga ikkita baho yozgandim, ro'yxat esa bittasini ko'rsatyapti, xolos. Ikkinchi baho qayoqqa yashirinibdi? Uning qatorini topib, ustiga bosing.",
      'Три анкеты готовы! Четвёртая: отзывы. Тут я сделал список оценок: открыл тег select и написал внутри две оценки. Но смотри, в списке только одна. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three forms are done! The fourth is reviews. Here I made a list of ratings: I opened the select tag and wrote two ratings inside. But look, the list has only one. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Yo'qolgan bahoni topdingiz: bu so'z select ichida turibdi-yu, option tegi yo'q. Brauzer ro'yxatga faqat option ichidagi so'zni oladi, yalang'och so'zni esa ro'yxatga qo'shmaydi. So'zni ochuvchi va yopuvchi option teglari bilan o'rab qo'ying.",
      'Нашлась! Это слово стоит внутри select, но без тега option. Такое слово браузер в список не добавляет. Оберни слово тегами option.',
      'Found it! This word is inside select, but without the option tag. The browser doesn’t add a word like that to the list. Wrap the word in option tags.'),
    foundX: L3("Tugmani yutib yuborgan teg shu ekan: textarea ochilgan-u, yopilmagan! Shuning uchun brauzer tugmaning kodini ham maydon ichidagi oddiy matn deb o'ylabdi. Qator oxiriga yopuvchi textarea tegini yozib qo'ying.",
      'Нашлась! textarea открыт, но не закрыт. Поэтому код кнопки попал в поле как текст. Допиши в конце строки закрывающий тег textarea.',
      'Found it! textarea is opened but not closed. That’s why the button code landed in the field as text. Add the closing textarea tag at the end of the line.'),
    ok: L3("Mana, ikkinchi baho ham ro'yxatga chiqdi! Endi bolalar fikr qoldirganda ikkala bahodan tanlay oladi.", 'Ура, заработало! Список снова полный. Поломка найдена, как у настоящего программиста!', 'Yes, it works! The list is full again. You found the bug like a real developer!'),
    why: {
      0: L3("Bu qator faqat sahifani boshlaydi, baho esa pastroqda. Ro'yxat qayerda yozilgan?", 'Здесь открывается body, строка в порядке. Посмотри на список.', 'body opens here, this line is fine. Look at the list.'),
      1: L3("Sarlavha o'qilib turibdi, demak, h1 sog'. Anketaning o'ziga qarang.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("Bu form tegi: u anketani ochadi, baholarni yo'qotmaydi. Ichiga tushing.", 'Здесь начинается анкета, строка в порядке.', 'The form starts here, this line is fine.'),
      3: L3("select shu yerda ochilyapti, bu qator butun. Aybdorni ichidagi variantlardan qidiring.", 'Здесь открывается список, строка в порядке. Посмотри на пункты внутри.', 'The list opens here, this line is fine. Look at the items inside.'),
      4: L3("Bu baho option ichida turibdi, shuning uchun ro'yxatda ko'rinyapti. Ikkinchisi-chi? Bir qator pastroqqa qarang.", 'Этот пункт внутри option, он в списке есть. А где вторая оценка? Посмотри на строку ниже.', 'This item is inside option, it’s in the list. Where’s the second rating? Look one line down.'),
      6: L3("Ro'yxat shu qatorda yopiladi. Ikkinchi baho nega chiqmadi ekan? Bir qator tepaga qarang.", 'Здесь закрывается список. Почему нет второй оценки? Посмотри на строку выше.', 'The list closes here. Why is the second rating missing? Look one line up.'),
      7: L3("Tugma o'z joyida turibdi. Baho esa ro'yxatda yo'qoldi, ro'yxatga qarang.", 'Кнопка в порядке. Посмотри на список.', 'The button is fine. Look at the list.'),
      8: L3("Anketa shu yerda yopiladi. Baho esa tepada, ro'yxat ichida adashgan.", 'Здесь закрывается анкета, строка в порядке.', 'The form closes here, this line is fine.'),
      9: L3("Bu yerda sahifa tugaydi, ayb bu qatorda emas. Ro'yxatni teparoqdan qidiring.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    whyX: {
      0: L3("Sahifa shu yerdan boshlanadi, tugma esa pastroqda adashgan. Katta maydonga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на большое поле.', 'body opens here, this line is fine. Look at the big field.'),
      1: L3("Sarlavha o'z joyida, tugmaning yo'qolishiga u aybdor emas.", 'Заголовок h1 открыт и закрыт как надо. Строка в порядке.', 'The h1 heading opens and closes just right. This line is fine.'),
      2: L3("form shu yerdan boshlanadi, tugmani u yutmagan. Pastroqqa qarang.", 'Здесь начинается анкета, строка в порядке.', 'The form starts here, this line is fine.'),
      4: L3("Tugmaning kodi to'g'ri yozilgan, lekin u maydon ichiga tushib qolibdi. Sababini bir qator tepadan qidiring.", 'Код кнопки верный, но он попал внутрь поля. Посмотри на строку выше.', 'The button code is right, but it ended up inside the field. Look one line up.'),
      5: L3("Anketa shu yerda yopiladi. Tugma qayoqqa ketdi ekan? Katta maydon qatoriga qarang.", 'Здесь закрывается анкета. Почему нет кнопки? Посмотри на строку большого поля.', 'The form closes here. Why is there no button? Look at the big field line.'),
      6: L3("Sahifa shu yerda tugaydi, tugma esa teparoqda adashgan.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    hints: [
      L3("Ro'yxatga qarang-chi: men ikkita baho yozgandim, ikkinchisi qayoqqa ketdi?", 'Посмотри на список: почему нет второй оценки?', 'Look at the list: why is the second rating missing?'),
      L3("select ichidagi qatorlarni bittalab o'qing: qaysi so'zning atrofida option tegi yo'q?", 'Посмотри на строки внутри select: какое слово без тега option?', 'Look at the lines inside select: which word has no option tag?'),
      L3("To'g'ri variant qanday yozilgan? So'zi option ichida turadi. Ikkinchi bahoni ham shunday o'rang.", 'Вот правильная строка пункта. Оберни и ты слово тегами option.', 'Here’s a proper item line. Wrap the word in option tags too.')
    ],
    drill: L3("Bu anketada tugma yo'qoldi: buzilgan qatorni toping va tuzating", 'В этой анкете пропала кнопка: найди сломанную строку и почини', 'The button vanished in this form: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening anketam", 'Моя анкета', 'My form'),
    say: L3("Bolalar sizning to'garagingizga qanday yozilsin: ro'yxatdan tanlabmi, o'zi haqida yozibmi, tugmani bosibmi? Mana shu anketani endi noldan o'zingiz yozasiz. Tepada h1 sarlavha bo'lsin. Undan keyin form: ichida variantli ro'yxat, katta maydon va yuboradigan tugma.",
      'Четыре анкеты горят! Теперь пятая: твоя анкета. Здесь есть только body. Сделай анкету для своего кружка. В самом верху заголовок в теге h1. Потом внутри form список с пунктами, большое поле и кнопка отправки.',
      'Four forms are lit! Now the fifth: your form. There’s only body here. Make a form for your own club. At the very top, a heading in the h1 tag. Then inside form, a list with items, a big field and a send button.'),
    ask: L3("body ichiga: h1, form, select, textarea, button", 'В body: h1, form, select, textarea, button', 'Inside body: h1, form, select, textarea, button'),
    ok: L3("Ro'yxat, katta maydon va tugma bir joyda: to'garagingiz endi lager saytida turibdi!", 'Это было мощно! В твоей анкете есть список, большое поле и кнопка!', 'That was awesome! Your form has a list, a big field and a button!'),
    hints: [
      L3("Yondagi chizmaga qarang: oldin h1 keladi, keyin form, uning ichida esa select, textarea va button turadi.", 'Посмотри на схему: сначала h1, потом form, а в нём select, textarea и button.', 'Look at the plan: first h1, then form, with select, textarea and button inside it.'),
      L3("Ro'yxat bo'sh qolmasin: select ichida kamida ikkita option bo'lsin. textarea va button teglarini yopishni ham unutmang.", 'Внутри select — хотя бы два option. textarea и button — с закрывающими тегами.', 'Inside select, at least two options. textarea and button with their closing tags.'),
      L3("Namunadagi anketada qaysi uchta narsa bor? Ro'yxat, katta maydon va tugma. Sizniki ham shu uchtani olsin, so'zlari esa to'garagingizga mos bo'lsin.", 'Вот анкета кружка. Напиши так же, только про свой кружок.', 'Here’s a club form. Write yours the same way, about your own club.')
    ]
  },
  drill: {
    say: L3("Lagerning yana bir sahifasi ham buzilibdi, endi uni yolg'iz o'zingiz tuzatasiz.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Bu sahifa ham tuzaldi: lager darvozasi ochiq!", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Lager sayti endi bolalarni kutyapti: hamma anketada ro'yxatlar to'liq, tugmalar joyida!", 'Смотри, все пять анкет готовы: списки полные, кнопки на месте!', 'Look, all five forms are ready: the lists are full, and the buttons are in place!') },
      { k: 'select', text: L3("Ro'yxatni nima yasagan edi? select! Yonidagi o'qchani bossangiz, variantlar ochiladi.", 'select делал выпадающий список.', 'select made a drop-down list.') },
      { k: 'option', text: L3("Iyul nega yo'qolgan edi? Chunki uning option tegi buzilgan edi. option tegisiz so'z ro'yxatga hech qachon tushmaydi.", 'Каждый пункт писали в option. Слово без option в список не попадает.', 'Each item went inside option. A word without option doesn’t get into the list.') },
      { k: 'textarea', text: L3("textarea esa katta maydon yasadi. Uni yopmasangiz, u pastdagi kodni ham o'z ichiga yutib yuboradi.", 'textarea ставил большое поле, и он обязательно закрывается.', 'textarea put a big field, and it always closes.') },
      { k: 'button', text: L3("Tugmasiz anketa yuborilmaydi, shuning uchun yozilish sahifasiga button qaytardik. Uning yozuvi ikkita teg o'rtasida turadi.", 'А button делал кнопку, надпись — между тегами.', 'And button made a button, with its text between the tags.') },
      { k: 'own', text: L3("Sizning to'garagingiz anketasi lager saytining eng yorqin sahifasi bo'ldi! Sayt kattalashib ketdi, endi uni qanday qismlarga bo'lish kerak? Shuni oldin o'zingiz taxmin qilib ko'ring.", 'А в конце — твоя собственная анкета. Это было мощно! На следующем уроке посмотрим, как устроен настоящий сайт.', 'And at the end you made your own form. That was awesome! Next lesson we’ll see how a real website is built.') }
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
