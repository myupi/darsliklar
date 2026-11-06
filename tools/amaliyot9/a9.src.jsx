// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 9 (финальный проект) — «Мой сайт от и до»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot9/build.mjs → lessons/html/09p-final-proekt.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 9 · «Мой сайт от и до» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026, заказчик: «в финальном проекте HTML можем добавить практику, где с учеником делаем сайт от и до,
// используя всё, чему научились»; на основе практики 08p — tools/amaliyot8). Курс пройден: ученик с Коди строит свой
// сайт с пустого файла. Один сайт растёт по шагам, каждый шаг — один урок курса: title (1) → header с h1 (2, 8) →
// меню nav со ссылкой (4) → main с разделом h2 и p (2, 8) → список ul (3) → раздел с картинкой img (5) → footer с
// абзацем (8) → форма: label и input (6) → select и button (7). Карта — план сайта из девяти шагов: сделанный горит
// зелёным, как станции финального проекта. 11 слайдов: крючок · девять заданий · вывод (заказчик, 06.11.2026: в
// финальной практике можно больше слайдов, чем семь).
// Сценарий — docs/scenarij-09p-final-proekt.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a9-screens.jsx) находит теги, атрибуты и текст, страницу рисует React.
//     Честно: на вкладке — title, в окне — body; части — рамками «Инспектора»; картинка без файла — значок
//     сломанной картинки и alt; form не видна, поля и кнопка — как в Chrome.
//   · Тексты сайта — свои: проверка смотрит на устройство кода, а не на слова (кроме дополнительных задач).
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; термины как в уроках 1–8. В речи названия
//     тегов и атрибутов — по-английски. Символов (= " /) в звучащих фразах нет. RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-09p-final-proekt',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: "9-amaliyot. Saytimni boshidan oxirigacha yasayman",
    ru: 'Практика 9. Мой сайт от и до',
    en: 'Practice 9. My site from start to finish'
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
  start: L3("Boshlash", 'Начать', 'Start'),
  drill: L3("Qo'shimcha", 'Ещё разок', 'Bonus'),
  sample: L3("Namuna", 'Образец', 'Example'),
  workReady: L3("Sayt tayyor", 'Сайт готов', 'The site is ready'),
  nextLesson: L3("Keyingi kurs", 'Следующий курс', 'Next course'),
  next: L3("CSS", 'CSS', 'CSS'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Bu yerga faqat teg nomini yozing: burchakli qavslar kerak emas.", 'Здесь нужно только имя тега: без уголков.', 'Only the tag name here: no angle brackets.'),
  insp: L3("Inspektor", 'Инспектор', 'Inspector'),
  plan: L3("Sayt rejasi", 'План сайта', 'Site plan'),
  siteName: L3("sayt nomi", 'название сайта', 'site name'),
  files: L3("Rasmlar", 'Картинки', 'Pictures'),
  bpFooter: L3("sayt oxiri", 'низ сайта', 'bottom of the site'),
  bpForm: L3("forma", 'форма', 'form'),
  bpLabel: L3("yozuv va maydon", 'подпись и поле', 'label and field'),
  bpButton: L3("tugma", 'кнопка', 'button'),
  bpCopy: L3("abzas", 'абзац', 'paragraph'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening saytim", 'Мой сайт', 'My site'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// Цвета частей сайта — как рамки «Инспектора» урока 8.
const PART_C = { header: '#FA4F28', nav: '#7C5CFA', main: '#0FA38E', section: '#D97706', footer: '#DB2777' };
// Слова запасного сайта, образцов и дополнительных задач (не звучат).
const XTRA = {
  site: L3("Mening saytim", 'Мой сайт', 'My site'),
  home: L3("Bosh sahifa", 'Главная', 'Home'),
  about: L3("Men haqimda", 'Обо мне', 'About me'),
  aboutP: L3("Men kod yozishni yaxshi ko'raman.", 'Я люблю писать код.', 'I love writing code.'),
  li1: L3("Futbol", 'Футбол', 'Football'),
  li2: L3("Shaxmat", 'Шахматы', 'Chess'),
  pet: L3("Sevimli hayvonim", 'Любимое животное', 'My favorite animal'),
  panda: L3("Panda", 'Панда', 'Panda'),
  name: L3("Ismingiz:", 'Твоё имя:', 'Your name:'),
  send: L3("Yuborish", 'Отправить', 'Send'),
  copy: L3("© 2026 Mening saytim", '© 2026 Мой сайт', '© 2026 My site'),
  sampleT: L3("Mening blogim", 'Мой блог', 'My blog'),
  blog: L3("Sport blogi", 'Спортивный блог', 'Sport blog'),
  sportH: L3("Sport klubi", 'Спортклуб', 'Sport club'),
  games: L3("O'yinlar", 'Игры', 'Games'),
  gamesP: L3("Biz har kuni o'ynaymiz.", 'Мы играем каждый день.', 'We play every day.'),
  g1: L3("Basketbol", 'Баскетбол', 'Basketball'),
  g2: L3("Tennis", 'Теннис', 'Tennis'),
  books: L3("Sevimli kitoblarim", 'Мои любимые книги', 'My favorite books'),
  elephant: L3("Fil", 'Слон', 'Elephant'),
  butterfly: L3("Kapalak", 'Бабочка', 'Butterfly'),
  email: L3("Email:", 'Email:', 'Email:'),
  join: L3("Obuna bo'lish", 'Подписаться', 'Subscribe'),
  copyS: L3("© 2026 Sport klubi", '© 2026 Спортклуб', '© 2026 Sport club'),
  age: L3("Yoshingiz:", 'Твой возраст:', 'Your age:')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг. Без «xato», «noto'g'ri». {tag} — имя тега, {got} — что
// встретилось, {bad} — как записано, {want} — что нужно. В звучащих узбекских фразах нет тире и символов.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Hozircha bo'sh. Kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Bu teskari chiziq «\\». Yopuvchi tegda oddiy qiya chiziq «/» turadi.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("«{bad}» tegining oxirida o'ng burchakli qavs «>» yo'q.", 'В конце тега «{bad}» не хватает уголка «>».', 'The tag “{bad}” is missing the bracket “>” at the end.'),
  noLt: L3("«{bad}»: teg chap burchakli qavs «<» bilan boshlanadi.", '«{bad}» — тег начинается с уголка «<».', '“{bad}” — a tag starts with the bracket “<”.'),
  typo: L3("«{bad}» degan teg yo'q, brauzer uni tanimaydi. Balki «{near}» demoqchisiz?", '«{bad}» — такого тега нет, браузер его не знает. Может быть, «{near}»?', '“{bad}” — there’s no such tag, the browser doesn’t know it. Did you mean “{near}”?'),
  unknown: L3("«{bad}» tegi bizning saytimizda kerak emas.", 'Тег «{bad}» на нашем сайте не нужен.', 'Our site doesn’t need the “{bad}” tag.'),
  noLevel: L3("«{bad}» degan sarlavha yo'q: sarlavhalar h1 tegidan h6 tegigacha bo'ladi.", 'Заголовка «{bad}» нет: заголовки бывают от h1 до h6.', 'There’s no “{bad}” heading: headings go from h1 to h6.'),
  emptyTag: L3("Burchakli qavslar ichida teg nomi bo'lishi kerak.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Bu yerga faqat body ichidagi qismni yozing: qolgani allaqachon bor.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body allaqachon bor: tepada va pastda. Uning ichiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  headNotHeader: L3("head ko'rinmaydigan ma'lumotlar uchun, u body ichida ishlamaydi. Sayt boshi uchun header tegi kerak.", 'head — для невидимых сведений, внутри body он не работает. Для верха сайта нужен тег header.', 'head is for invisible details, and it doesn’t work inside body. The top of the site needs the header tag.'),
  needOpenText: L3("Matndan oldin ochuvchi {tag} tegi kerak.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeStray: L3("Bu yopuvchi {got} tegi, lekin {got} ochilmagan.", 'Это закрывающий тег {got}, но {got} не открыт.', 'That’s the closing {got} tag, but {got} was never opened.'),
  wrongOpen: L3("Bu yerda {tag} tegi kerak, {got} emas.", 'Здесь нужен тег {tag}, а не {got}.', 'You need the {tag} tag here, not {got}.'),
  needText: L3("{tag} ichiga matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Bu ochuvchi teg. Yopuvchi tegda {tag} so'zidan oldin qiya chiziq «/» turadi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("{tag} yopilmadi: oxiriga yopuvchi {tag} tegini yozing.", '{tag} не закрыт: в конце напиши закрывающий тег {tag}.', '{tag} isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmadi, shuning uchun pastdagi hamma narsa ham katta bo'lib ketdi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  extra: L3("Oxirida ortiqcha narsa qolibdi: {got}.", 'В конце осталось лишнее: {got}.', 'There’s something extra at the end: {got}.'),
  short: L3("Matn juda qisqa: kamida ikki harf yozing.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} yopilmadi. Ajratilgan so'zlardan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Bu yopuvchi {tag} tegi, lekin {tag} ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichida kamida bitta so'z bo'lsin.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  aOpen: L3("a yopilmadi: havola so'zlaridan keyin yopuvchi a tegini yozing.", 'a не закрыт: после слов ссылки напиши закрывающий тег a.', 'a isn’t closed: add the closing a tag after the link words.'),
  noQuote: L3("{attr} qiymatini qo'shtirnoq ichiga yozing.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("{attr} so'zidan keyin teng belgisi, keyin qo'shtirnoq ichida qiymat keladi.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("«{bad}» degan atribut yo'q. {tag} tegida {list} bo'ladi.", 'Атрибута «{bad}» нет. У тега {tag} бывают {list}.', 'There’s no “{bad}” attribute. The {tag} tag has {list}.'),
  attrNone: L3("{tag} tegiga atribut kerak emas, uni olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  voidClose: L3("{tag} tegi yopilmaydi: yopuvchi {tag} tegini olib tashlang.", 'Тег {tag} не закрывается: убери закрывающий {tag}.', 'The {tag} tag doesn’t close: remove the closing {tag}.'),
  textOther: L3("{tag} ichidagi so'z boshqacha: «{want}» deb yozing.", 'В {tag} другие слова: напиши «{want}».', 'The words in {tag} are different: write “{want}”.'),
  // Т1 · title.
  onlyTitle: L3("Bu qatorga faqat title yoziladi: ochuvchi teg, sayt nomi, yopuvchi teg. Qolgani allaqachon bor.", 'В эту строку пишется только title: открывающий тег, название, закрывающий тег. Остальное уже есть.', 'Only title goes on this line: the opening tag, the name, the closing tag. The rest is already there.'),
  // Т2 · header.
  headerWrap: L3("Sarlavha va menyu sayt boshida bo'ladi: ularni ochuvchi va yopuvchi header teglari o'rtasiga yozing.", 'Заголовок и меню — это верх сайта: напиши их между открывающим и закрывающим header.', 'The heading and menu are the top of the site: write them between the opening and closing header tags.'),
  h1InHeader: L3("header ichida sayt nomi bo'lsin: h1 tegi.", 'Внутри header пусть будет название сайта — тег h1.', 'Put the site name inside header: the h1 tag.'),
  needNav: L3("Sayt boshida menyu bo'lsin: header ichida nav va unda havola.", 'Наверху сайта пусть будет меню: внутри header — nav, а в нём ссылка.', 'Let the top of the site have a menu: nav inside header, with a link in it.'),
  navWrap: L3("Havola tayyor, lekin u menyu ichida emas. Uni ochuvchi va yopuvchi nav teglari o'rtasiga yozing.", 'Ссылка готова, но она не в меню. Напиши её между открывающим и закрывающим nav.', 'The link is ready, but it isn’t in the menu. Write it between the opening and closing nav tags.'),
  navNoLink: L3("nav ichida havola yo'q. Ichiga a tegini yozing: href va havola so'zi bilan.", 'В nav нет ссылки. Напиши внутри тег a: с href и словом ссылки.', 'There’s no link in nav. Write an a tag inside it, with href and the link word.'),
  noHref: L3("Bu a tegida href yo'q, shuning uchun so'z oddiy matn bo'lib qoldi. Ochuvchi a tegiga href qo'shing.", 'У этого тега a нет href, поэтому слово осталось простым текстом. Добавь href в открывающий тег a.', 'This a tag has no href, so the word stayed plain text. Add href to the opening a tag.'),
  hrefOther: L3("Bu havola {got} sahifasiga olib boradi. Bizga {want} kerak.", 'Эта ссылка ведёт на {got}. А нужно {want}.', 'This link goes to {got}. We need {want}.'),
  linkText: L3("Havola so'zi boshqacha: a ichiga «{want}» deb yozing.", 'Слово ссылки другое: напиши в a «{want}».', 'The link word is different: write “{want}” in a.'),
  // Т3 · main, section, список.
  mainWrap: L3("Bo'lim tayyor, lekin u asosiy qism ichida emas. Uni ochuvchi va yopuvchi main teglari o'rtasiga yozing.", 'Раздел готов, но он не в главной части. Напиши его между открывающим и закрывающим main.', 'The section is ready, but it isn’t in the main part. Write it between the opening and closing main tags.'),
  oneMain: L3("main sahifada bitta bo'ladi va u allaqachon bor. Shu yerga faqat yangi section yozing.", 'main на странице один, и он уже есть. Здесь напиши только новый section.', 'A page has just one main, and it’s already there. Write only a new section here.'),
  secWrap: L3("Sarlavha va matn bor, lekin ular bo'lim ichida emas. Ularni ochuvchi va yopuvchi section teglari o'rtasiga yozing.", 'Заголовок и текст есть, но они не в разделе. Напиши их между открывающим и закрывающим section.', 'The heading and text are there, but not in a section. Write them between the opening and closing section tags.'),
  needSection: L3("main ichida bo'lim bo'lsin: section, unda h2, abzas va ro'yxat.", 'Внутри main пусть будет раздел: section, в нём h2, абзац и список.', 'Let main have a section: section, with h2, a paragraph and a list.'),
  secNeedH2: L3("Bo'lim sarlavhadan boshlanadi: section ichida eng tepada h2 tegi.", 'Раздел начинается с заголовка: внутри section в самом верху тег h2.', 'A section starts with a heading: the h2 tag at the very top inside section.'),
  secNeedP: L3("Sarlavha tayyor! Endi uning tagiga abzas yozing: p tegi.", 'Заголовок готов! Теперь под ним напиши абзац — тег p.', 'The heading is ready! Now write a paragraph under it: the p tag.'),
  needList: L3("Abzas bor! Endi ro'yxat qo'shing: ul tegi va uning ichida li bandlari.", 'Абзац есть! Теперь добавь список: тег ul, а в нём пункты li.', 'The paragraph is there! Now add a list: the ul tag with li items inside.'),
  liNoList: L3("li bandlari bor, lekin ular ro'yxat ichida emas. Ularni ochuvchi va yopuvchi ul teglari o'rtasiga yozing.", 'Пункты li есть, но они не в списке. Напиши их между открывающим и закрывающим ul.', 'The li items are there, but they aren’t in a list. Write them between the opening and closing ul tags.'),
  liWrap: L3("Ro'yxat ichida faqat li bandlari bo'ladi: har bir matnni li tegiga o'rang.", 'Внутри списка бывают только пункты li: оберни каждый текст в тег li.', 'A list holds only li items: wrap each text in an li tag.'),
  liText: L3("Har bir li bandida matn bo'lsin.", 'В каждом пункте li пусть будет текст.', 'Let every li item have some text.'),
  liTwo: L3("Ro'yxatda kamida ikkita band bo'lsin: yana bitta li qo'shing.", 'В списке пусть будет хотя бы два пункта: добавь ещё один li.', 'Let the list have at least two items: add one more li.'),
  // Т4 · картинка.
  galWrap: L3("Sarlavha va rasm yangi bo'lim ichida bo'lsin: ularni ochuvchi va yopuvchi section teglari o'rtasiga yozing.", 'Заголовок и картинка пусть будут в новом разделе: напиши их между открывающим и закрывающим section.', 'Let the heading and picture be in a new section: write them between the opening and closing section tags.'),
  needImg: L3("Sarlavha bor! Endi rasm qo'shing: img tegi, src va alt bilan.", 'Заголовок есть! Теперь добавь картинку: тег img с src и alt.', 'The heading is there! Now add a picture: the img tag with src and alt.'),
  imgNoSrc: L3("img tegida src yo'q, shuning uchun brauzer qaysi rasmni ko'rsatishni bilmaydi. src ichiga fayl nomini yozing.", 'У тега img нет src, поэтому браузер не знает, какую картинку показать. Напиши в src имя файла.', 'The img tag has no src, so the browser doesn’t know which picture to show. Put the file name in src.'),
  imgNo: L3("{got} degan fayl yo'q, shuning uchun rasm singan bo'lib chiqdi. Rasmlar ro'yxatidan bitta fayl nomini yozing.", 'Файла {got} нет, поэтому картинка сломалась. Впиши имя файла из списка картинок.', 'There’s no file called {got}, so the picture is broken. Write a file name from the pictures list.'),
  imgNoAlt: L3("Rasm chiqdi! Endi alt qo'shing: rasm haqida bir ikki so'z. Rasm ochilmasa, brauzer shu so'zlarni ko'rsatadi.", 'Картинка появилась! Теперь добавь alt: пару слов о картинке. Если картинка не откроется, браузер покажет эти слова.', 'The picture showed up! Now add alt: a couple of words about it. If the picture doesn’t load, the browser shows those words.'),
  imgOther: L3("Bu boshqa rasm. Bizga {want} fayli kerak.", 'Это другая картинка. Нужен файл {want}.', 'That’s a different picture. We need the file {want}.'),
  // Т5 · footer с формой.
  footWrap: L3("Forma tayyor, lekin u sayt oxirida emas. Uni ochuvchi va yopuvchi footer teglari o'rtasiga yozing.", 'Форма готова, но она не в низу сайта. Напиши её между открывающим и закрывающим footer.', 'The form is ready, but it isn’t at the bottom of the site. Write it between the opening and closing footer tags.'),
  formWrap: L3("Yozuv, maydon va tugma forma ichida bo'ladi: ularni ochuvchi va yopuvchi form teglari o'rtasiga yozing.", 'Подпись, поле и кнопка бывают внутри формы: напиши их между открывающим и закрывающим form.', 'The label, field and button go inside a form: write them between the opening and closing form tags.'),
  needForm: L3("footer ichida forma bo'lsin: form tegi, unda yozuv, maydon va tugma.", 'Внутри footer пусть будет форма: тег form, в нём подпись, поле и кнопка.', 'Let footer have a form: the form tag, with a label, a field and a button.'),
  needLabel: L3("Maydon nima uchunligini yozing: label tegi va uning ichida yozuv.", 'Подпиши, для чего поле: тег label и надпись в нём.', 'Say what the field is for: the label tag with words inside.'),
  needInput: L3("Yozuv bor! Endi maydon qo'shing: input tegi.", 'Подпись есть! Теперь добавь поле — тег input.', 'The label is there! Now add a field: the input tag.'),
  typeOther: L3("«{got}» degan maydon turi yo'q. Oddiy matn uchun text yozing.", 'Типа поля «{got}» нет. Для обычного текста пиши text.', 'There’s no “{got}” field type. For plain text, write text.'),
  needButton: L3("Ro'yxat tayyor! Endi uning tagiga tugma qo'shing: button tegi va uning ichida so'z.", 'Список готов! Теперь добавь под ним кнопку: тег button и слово в нём.', 'The list is ready! Now add a button under it: the button tag with a word inside.'),
  needSelect: L3("Bu yerga tanlash ro'yxati kerak: select tegi, ichida option bandlari.", 'Здесь нужен список выбора: тег select, а в нём пункты option.', 'This needs a choice list: the select tag with option items inside.'),
  optNoSel: L3("option bandlari bor, lekin ular select ichida emas. Ularni ochuvchi va yopuvchi select teglari o'rtasiga yozing.", 'Пункты option есть, но они не в select. Напиши их между открывающим и закрывающим select.', 'The option items are there, but they aren’t in select. Write them between the opening and closing select tags.'),
  optWrap: L3("select ichida faqat option bandlari bo'ladi: har bir tanlovni option tegiga o'rang.", 'Внутри select бывают только пункты option: оберни каждый вариант в тег option.', 'select holds only option items: wrap each choice in an option tag.'),
  optTwo: L3("Tanlash uchun kamida ikkita band kerak: yana bitta option qo'shing.", 'Для выбора нужно хотя бы два пункта: добавь ещё один option.', 'A choice needs at least two items: add one more option.'),
  needFootP: L3("footer ichiga abzas yozing: p tegi, masalan yil va sayt nomi.", 'Напиши в footer абзац — тег p, например год и название сайта.', 'Write a paragraph in footer: the p tag, for example the year and the site name.'),
  footPWrap: L3("Abzas tayyor, lekin u sayt oxirida emas. Uni ochuvchi va yopuvchi footer teglari o'rtasiga yozing.", 'Абзац готов, но он не в низу сайта. Напиши его между открывающим и закрывающим footer.', 'The paragraph is ready, but it isn’t at the bottom of the site. Write it between the opening and closing footer tags.'),
  typeNeed: L3("Bu maydonga {want} turi kerak: input tegida type ichiga {want} deb yozing.", 'Этому полю нужен тип {want}: напиши в input type «{want}».', 'This field needs the {want} type: write {want} in the input type.'),
  onlyH1: L3("Hozircha header ichida faqat h1 bo'lsin. Menyuni keyingi qadamda qo'shamiz.", 'Пока в header пусть будет только h1. Меню добавим на следующем шаге.', 'For now, let header hold only h1. We’ll add the menu at the next step.'),
  liN: L3("Ro'yxatda kamida {n} ta band bo'lsin.", 'В списке пусть будет хотя бы {n} пункта.', 'Let the list have at least {n} items.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, start, done, ok, hints, drill …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Mening saytim", 'Мой сайт', 'My site'),
    say: L3("Salom! Siz butun HTML kursini o'tdingiz. Endi eng qiziq ish qoldi: o'z saytingizni bo'sh fayldan boshlab yasaymiz. Qarang, faylda hozircha faqat bitta qator bor. «Boshlash» tugmasini bosing.",
      'Привет! Ты прошёл весь курс HTML. Осталось самое интересное: сделать свой сайт с пустого файла. Смотри, в файле пока одна строка. Нажми «Начать».',
      'Hi! You’ve finished the whole HTML course. Now the most exciting part is left: building your own site from an empty file. Look, the file has just one line so far. Tap “Start”.'),
    start: L3("Mana, sayt rejasi! Unda to'qqizta qadam: sahifa nomidan boshlab sayt oxiridagi formagacha.",
      'Вот план сайта! В нём девять шагов: от названия страницы до формы внизу сайта.',
      'Here’s the site plan! It has nine steps: from the page title to the form at the bottom of the site.'),
    done: L3("Har bir qadamda bitta kichik qismni o'zingiz yozasiz, sayt esa brauzerda ko'z oldingizda o'sib boradi. Har bir qadam kursning bir darsidan. Tayyor qadam rejada yashil bo'lib yonadi. Qani, boshladik!",
      'На каждом шаге ты сам пишешь одну небольшую часть, а сайт растёт в браузере прямо на глазах. Каждый шаг — из одного урока курса. Готовый шаг загорается в плане зелёным. Поехали!',
      'At each step you write one small part yourself, and the site grows in the browser right before your eyes. Each step comes from one lesson of the course. A finished step lights up green in the plan. Let’s go!'),
    ask: L3("«Boshlash» tugmasini bosing", 'Нажми «Начать»', 'Tap “Start”'),
    askDone: L3("To'qqizta qadam — bitta sayt", 'Девять шагов — один сайт', 'Nine steps, one site')
  },
  t1: {
    eyebrow: L3("Sahifa nomi", 'Название страницы', 'Page title'),
    say: L3("Birinchi qadam eng oson: saytga nom beramiz. Esingizdami, sahifa nomi head ichida, title tegida yoziladi va brauzer varag'ida ko'rinadi. Saytingizni qanday ataysiz? title qatorini yozing.",
      'Первый шаг самый лёгкий: дадим сайту название. Помнишь, название страницы пишется в head, в теге title, и видно на вкладке браузера. Как назовёшь свой сайт? Напиши строку title.',
      'The first step is the easiest: let’s name the site. Remember, the page title goes in head, in the title tag, and shows on the browser tab. What will you call your site? Write the title line.'),
    ask: L3("title qatori: saytingiz nomi", 'Строка title: название твоего сайта', 'The title line: your site’s name'),
    ok: L3("Ajoyib nom! Qarang, u brauzer varag'ida chiqdi!", 'Классное название! Смотри, оно появилось на вкладке!', 'Great name! Look, it showed up on the tab!'),
    hints: [
      L3("Nom title tegi ichida yoziladi: ochuvchi teg, nom, yopuvchi teg.", 'Название пишется внутри тега title: открывающий тег, название, закрывающий тег.', 'The name goes inside the title tag: the opening tag, the name, the closing tag.'),
      L3("Yopuvchi tegda title so'zidan oldin qiya chiziq bo'ladi.", 'В закрывающем теге перед словом title стоит косая черта.', 'The closing tag has a slash before the word title.'),
      L3("Mana, boshqa sayt nomi. Siz ham shunday yozing, faqat o'z nomingiz bilan.", 'Вот название другого сайта. Напиши так же, только своё название.', 'Here’s another site’s title. Write yours the same way, with your own name.')
    ],
    drill: L3("Endi boshqa sayt uchun: title «Sport blogi»", 'Теперь для другого сайта: title «Спортивный блог»', 'Now for another site: title “Sport blog”')
  },
  t2: {
    eyebrow: L3("Sarlavha", 'Заголовок', 'Heading'),
    say: L3("Nom bor! Endi sahifaning o'zi. Sayt boshidan boshlaymiz, ya'ni header tegi degani. Uning ichiga saytning katta sarlavhasini yozing: h1 tegi. Sarlavhani o'zingiz tanlang.",
      'Название есть! Теперь сама страница. Начнём с верха сайта, то есть с тега header. Напиши в нём большой заголовок сайта — тег h1. Заголовок выбери сам.',
      'We have a title! Now the page itself. Let’s start with the top of the site, that is, the header tag. Inside it, write the site’s big heading: the h1 tag. Pick the heading yourself.'),
    ask: L3("header ichida h1 sarlavha", 'Заголовок h1 внутри header', 'An h1 heading inside header'),
    ok: L3("Zo'r! Sarlavha katta, Inspektor esa sayt boshini ramka bilan ko'rsatyapti!", 'Огонь! Заголовок крупный, а Инспектор обвёл верх сайта рамкой!', 'Awesome! The heading is big, and the Inspector framed the top of the site!'),
    hints: [
      L3("Oldin ochuvchi header, oxirida yopuvchi header. Sarlavha ularning o'rtasida.", 'Сначала открывающий header, в конце закрывающий. Заголовок — между ними.', 'First the opening header, the closing header at the end. The heading goes between them.'),
      L3("Eng katta sarlavha h1 tegida yoziladi.", 'Самый большой заголовок пишется в теге h1.', 'The biggest heading goes in the h1 tag.'),
      L3("Mana, sport klubining sayt boshi. Siz ham shunday yozing, faqat o'z sarlavhangiz bilan.", 'Вот верх сайта спортклуба. Напиши так же, только со своим заголовком.', 'Here’s the top of a sport club’s site. Write yours the same way, with your own heading.')
    ],
    drill: L3("Endi sport klubi uchun: h1 «Sport klubi»", 'Теперь для спортклуба: h1 «Спортклуб»', 'Now for a sport club: h1 “Sport club”')
  },
  t3: {
    eyebrow: L3("Menyu", 'Меню', 'Menu'),
    say: L3("Sarlavha tayyor! Endi uning tagiga menyu qo'shamiz. Menyu nav tegida bo'ladi, unda kamida bitta havola, ya'ni a tegi href bilan degani. Havola so'zini va qaysi sahifaga olib borishini o'zingiz tanlang.",
      'Заголовок готов! Теперь добавим под ним меню. Меню — в теге nav, а в нём хотя бы одна ссылка, то есть тег a с href. Слово ссылки и куда она ведёт выбери сам.',
      'The heading is ready! Now let’s add a menu under it. The menu goes in the nav tag, with at least one link in it, that is, an a tag with href. Pick the link word and where it goes yourself.'),
    ask: L3("nav qatori: ichida havola a, href bilan", 'Строка nav: внутри ссылка a с href', 'A nav line: an a link with href inside'),
    ok: L3("Barakalla! Havola ko'k va tagiga chizilgan, Inspektor menyuni ham ko'rsatyapti!", 'Молодец! Ссылка синяя и подчёркнутая, а Инспектор показывает и меню!', 'Well done! The link is blue and underlined, and the Inspector shows the menu too!'),
    hints: [
      L3("Menyu nav tegida: ochuvchi nav, havola, yopuvchi nav.", 'Меню — в теге nav: открывающий nav, ссылка, закрывающий nav.', 'The menu goes in nav: the opening nav, the link, the closing nav.'),
      L3("a tegida href ichida fayl nomi, teglar o'rtasida esa havola so'zi.", 'В теге a: в href — имя файла, а между тегами — слово ссылки.', 'In the a tag, href holds the file name, and the link word goes between the tags.'),
      L3("Mana, boshqa menyu qatori. Siz ham shunday yozing, faqat o'z havolangiz bilan.", 'Вот строка другого меню. Напиши так же, только со своей ссылкой.', 'Here’s another menu line. Write yours the same way, with your own link.')
    ],
    drill: L3("Endi boshqa havola: «O'yinlar», href «oyinlar.html»", 'Теперь другая ссылка: «Игры», href «oyinlar.html»', 'Now another link: “Games”, href “oyinlar.html”')
  },
  t4: {
    eyebrow: L3("Men haqimda", 'Обо мне', 'About me'),
    say: L3("Sayt boshi tayyor! Endi asosiy qism, ya'ni main tegi degani. Uning ichiga birinchi bo'limni yozamiz: section, unda h2 sarlavha va o'zingiz haqingizda abzas.",
      'Верх готов! Теперь главная часть, то есть тег main. Внутри напишем первый раздел: section, в нём заголовок h2 и абзац о себе.',
      'The top is ready! Now the main part, that is, the main tag. Inside it we write the first section: section, with an h2 heading and a paragraph about yourself.'),
    ask: L3("main ichida section: h2 va abzas p", 'main, в нём section: h2 и абзац p', 'main with a section: h2 and a paragraph p'),
    ok: L3("Ajoyib! Bo'lim tayyor, sayt jonlanib qoldi!", 'Отлично! Раздел готов, сайт ожил!', 'Great! The section is ready, and the site came alive!'),
    hints: [
      L3("Tartib shunday: ochuvchi main, ochuvchi section, ichida mazmun, keyin yopuvchi section va yopuvchi main.", 'Порядок такой: открывающий main, открывающий section, внутри содержимое, потом закрывающие section и main.', 'The order is: the opening main, the opening section, the content inside, then the closing section and main.'),
      L3("section ichida avval h2 sarlavha, keyin p abzas.", 'Внутри section сначала заголовок h2, потом абзац p.', 'Inside section, first the h2 heading, then the p paragraph.'),
      L3("Mana, o'yinlar bo'limi. Siz ham shunday yozing, faqat o'zingiz haqingizda.", 'Вот раздел про игры. Напиши так же, только про себя.', 'Here’s a section about games. Write yours the same way, about yourself.')
    ],
    drill: L3("Endi kitoblar haqida: h2 «Sevimli kitoblarim» va abzas", 'Теперь про книги: h2 «Мои любимые книги» и абзац', 'Now about books: h2 “My favorite books” and a paragraph')
  },
  t5: {
    eyebrow: L3("Ro'yxat", 'Список', 'List'),
    say: L3("Abzas bor, endi ro'yxat! Bo'limingizga sevimli narsalaringiz ro'yxatini qo'shing. Esingizdami, ro'yxat ul tegida, har bir band esa li tegida yoziladi. Kamida ikkita band bo'lsin.",
      'Абзац есть, теперь список! Добавь в свой раздел список любимых вещей. Помнишь, список пишется в теге ul, а каждый пункт — в теге li. Пусть будет хотя бы два пункта.',
      'We have a paragraph, now a list! Add a list of your favorite things to your section. Remember, a list goes in the ul tag, and each item in an li tag. Let there be at least two items.'),
    ask: L3("ul ro'yxati: kamida ikkita li", 'Список ul: хотя бы два li', 'A ul list: at least two li'),
    ok: L3("Qoyil! Ro'yxat tayyor, har bir band oldida nuqta chiqdi!", 'Класс! Список готов, у каждого пункта появилась точка!', 'Brilliant! The list is ready, and every item got a bullet!'),
    hints: [
      L3("Oldin ochuvchi ul, ichida bandlar, oxirida yopuvchi ul.", 'Сначала открывающий ul, внутри пункты, в конце закрывающий ul.', 'First the opening ul, the items inside, the closing ul at the end.'),
      L3("Har bir band alohida li tegida: ochuvchi li, so'z, yopuvchi li.", 'Каждый пункт — в своём теге li: открывающий li, слово, закрывающий li.', 'Each item goes in its own li tag: the opening li, the word, the closing li.'),
      L3("Mana, raqamli ro'yxat. Siz ham shunday yozing, faqat o'z bandlaringiz bilan.", 'Вот нумерованный список. Напиши так же, только со своими пунктами.', 'Here’s a numbered list. Write yours the same way, with your own items.')
    ],
    drill: L3("Endi uch bandli ro'yxat yozing", 'Теперь напиши список из трёх пунктов', 'Now write a list with three items')
  },
  t6: {
    eyebrow: L3("Rasm", 'Картинка', 'Picture'),
    say: L3("Matn bor, endi rasm qo'shamiz! Asosiy qism ichiga yana bitta bo'lim yozing: section, unda h2 sarlavha va img tegi. src ichiga rasmlar ro'yxatidan fayl nomini, alt ichiga esa rasm haqida bir ikki so'z yozing.",
      'Текст есть, теперь добавим картинку! Напиши в главной части ещё один раздел: section, в нём заголовок h2 и тег img. В src впиши имя файла из списка картинок, а в alt — пару слов о картинке.',
      'We have text, now let’s add a picture! Write one more section in the main part: section, with an h2 heading and an img tag. Put a file name from the pictures list in src, and a couple of words about the picture in alt.'),
    ask: L3("Yangi section: h2 va img", 'Новый section: h2 и img', 'A new section: h2 and img'),
    ok: L3("Voy, qanday chiroyli! Rasm saytingizda chiqdi!", 'Ого, как красиво! Картинка появилась на сайте!', 'Wow, how pretty! The picture showed up on your site!'),
    hints: [
      L3("Yangi bo'lim ham section tegida: avval h2, keyin img.", 'Новый раздел — тоже в теге section: сначала h2, потом img.', 'The new section also goes in a section tag: first h2, then img.'),
      L3("img yopilmaydi. Unda ikkita atribut: src ichida fayl nomi, alt ichida rasm haqida so'z.", 'img не закрывается. У него два атрибута: в src имя файла, в alt слова о картинке.', 'img doesn’t close. It has two attributes: the file name in src and words about the picture in alt.'),
      L3("Mana, fil haqidagi bo'lim. Siz ham shunday yozing, faqat boshqa rasm bilan.", 'Вот раздел про слона. Напиши так же, только с другой картинкой.', 'Here’s a section about an elephant. Write yours the same way, with a different picture.')
    ],
    drill: L3("Endi kapalak: h2 «Kapalak» va kapalak.jpg rasmi", 'Теперь бабочка: h2 «Бабочка» и картинка kapalak.jpg', 'Now a butterfly: h2 “Butterfly” and the picture kapalak.jpg')
  },
  t7: {
    eyebrow: L3("Sayt oxiri", 'Низ сайта', 'Bottom of the site'),
    say: L3("Asosiy qism tayyor! Endi sayt oxiri, ya'ni footer tegi degani. Uning ichiga abzas yozing: masalan, yil va saytingiz nomi. Odatda saytlar pastida shunday yozuv bo'ladi.",
      'Главная часть готова! Теперь низ сайта, то есть тег footer. Напиши в нём абзац: например, год и название сайта. Обычно внизу сайтов бывает такая надпись.',
      'The main part is ready! Now the bottom of the site, that is, the footer tag. Write a paragraph inside it: for example, the year and your site’s name. Sites usually have a line like that at the bottom.'),
    ask: L3("footer ichida abzas p", 'Абзац p внутри footer', 'A paragraph p inside footer'),
    ok: L3("Zo'r! Sayt endi pastdan ham yopildi!", 'Огонь! Теперь у сайта есть и низ!', 'Awesome! Now the site has a bottom too!'),
    hints: [
      L3("Oldin ochuvchi footer, oxirida yopuvchi footer. Abzas ularning o'rtasida.", 'Сначала открывающий footer, в конце закрывающий. Абзац — между ними.', 'First the opening footer, the closing footer at the end. The paragraph goes between them.'),
      L3("Abzas p tegida: ochuvchi p, matn, yopuvchi p.", 'Абзац — в теге p: открывающий p, текст, закрывающий p.', 'A paragraph goes in p: the opening p, the text, the closing p.'),
      L3("Mana, sport klubining sayt oxiri. Siz ham shunday yozing, faqat o'z saytingiz nomi bilan.", 'Вот низ сайта спортклуба. Напиши так же, только с названием своего сайта.', 'Here’s the bottom of a sport club’s site. Write yours the same way, with your own site’s name.')
    ],
    drill: L3("Endi sport klubi uchun: abzas «© 2026 Sport klubi»", 'Теперь для спортклуба: абзац «© 2026 Спортклуб»', 'Now for a sport club: a paragraph “© 2026 Sport club”')
  },
  t8: {
    eyebrow: L3("Forma", 'Форма', 'Form'),
    say: L3("Sayt oxiriga mehmonlar uchun forma qo'shamiz! Abzas ustiga form tegini yozing. Uning ichida label: yozuv va input maydoni. Masalan, mehmon ismini yozadigan maydon.",
      'Добавим в низ сайта форму для гостей! Над абзацем напиши тег form. В нём — label: надпись и поле input. Например, поле, куда гость впишет имя.',
      'Let’s add a form for visitors to the bottom of the site! Above the paragraph, write the form tag. Inside it, a label: words and an input field. For example, a field where a visitor types their name.'),
    ask: L3("form: label ichida yozuv va input", 'form: в label надпись и input', 'form: words and an input inside label'),
    ok: L3("Barakalla! Forma chiqdi: yozuv va maydon, xuddi Chrome'dagidek!", 'Молодец! Форма появилась: надпись и поле, как в Chrome!', 'Well done! The form showed up: words and a field, just like in Chrome!'),
    hints: [
      L3("Hammasi form ichida: ochuvchi form, ichida label, oxirida yopuvchi form.", 'Всё внутри form: открывающий form, в нём label, в конце закрывающий form.', 'Everything goes inside form: the opening form, a label inside, the closing form at the end.'),
      L3("label ichida avval yozuv, keyin input. input yopilmaydi.", 'Внутри label сначала надпись, потом input. input не закрывается.', 'Inside label, first the words, then input. input doesn’t close.'),
      L3("Mana, email maydoni. Siz ham shunday yozing, faqat o'z yozuvingiz bilan.", 'Вот поле для email. Напиши так же, только со своей надписью.', 'Here’s an email field. Write yours the same way, with your own words.')
    ],
    drill: L3("Endi yosh uchun: label «Yoshingiz:» va type «number»", 'Теперь для возраста: label «Твой возраст:» и type «number»', 'Now for age: label “Your age:” and type “number”')
  },
  t9: {
    eyebrow: L3("Tanlov va tugma", 'Выбор и кнопка', 'Choice and button'),
    say: L3("Oxirgi va eng katta qadam! Formaga tanlash ro'yxatini qo'shing: select tegi, ichida kamida ikkita option. Masalan, mehmon sevimli o'yinini tanlasin. Ro'yxat tagiga esa button tugmasini yozing. Bu qismni butunlay o'zingiz yozasiz!",
      'Последний и самый большой шаг! Добавь в форму список выбора: тег select, а в нём хотя бы два option. Например, пусть гость выберет любимую игру. А под списком напиши кнопку button. Эту часть ты пишешь полностью сам!',
      'The last and biggest step! Add a choice list to the form: the select tag with at least two options inside. For example, let a visitor pick their favorite game. Under the list, write a button. You write this part all by yourself!'),
    ask: L3("select: ikkita option, keyin button", 'select: два option, потом button', 'select: two options, then a button'),
    ok: L3("Bu juda zo'r chiqdi! Saytingizda hamma narsa bor: nom, sarlavha, menyu, bo'limlar, ro'yxat, rasm va forma bilan sayt oxiri!", 'Это было мощно! На твоём сайте есть всё: название, заголовок, меню, разделы, список, картинка и низ с формой!', 'That was awesome! Your site has it all: a title, a heading, a menu, sections, a list, a picture and a bottom with a form!'),
    hints: [
      L3("Avval select: ochuvchi select, ichida option bandlari, oxirida yopuvchi select. Keyin button.", 'Сначала select: открывающий select, внутри пункты option, в конце закрывающий select. Потом button.', 'First select: the opening select, option items inside, the closing select at the end. Then button.'),
      L3("Har bir tanlov alohida option tegida. button ichiga tugma so'zini yozing.", 'Каждый вариант — в своём теге option. В button напиши слово кнопки.', 'Each choice goes in its own option tag. Put the button word inside button.'),
      L3("Mana, sport klubining tanlovi. Siz ham shunday yozing, faqat o'z so'zlaringiz bilan.", 'Вот выбор для спортклуба. Напиши так же, только своими словами.', 'Here’s a choice for a sport club. Write yours the same way, with your own words.')
    ]
  },
  drill: {
    say: L3("Zo'r! Endi yana bir kichik mashq: qoida o'sha, so'zlar boshqa.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Mana, endi bu qoida sizniki! Davom etamiz.", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'own', text: L3("Qarang, bu sizning saytingiz! Uni bo'sh fayldan boshlab to'qqiz qadamda o'zingiz yozdingiz.", 'Смотри, это твой сайт! Ты написал его сам, с пустого файла, за девять шагов.', 'Look, this is your site! You wrote it yourself, from an empty file, in nine steps.') },
      { k: 'title', text: L3("title sahifa nomini varaqqa chiqardi.", 'title вывел название на вкладку.', 'title put the name on the tab.') },
      { k: 'header', text: L3("header sayt boshi bo'ldi, h1 esa uning katta sarlavhasi.", 'header стал верхом сайта, а h1 — его большим заголовком.', 'header became the top of the site, and h1 its big heading.') },
      { k: 'nav', text: L3("nav ichidagi havola menyu bo'ldi.", 'Ссылка в nav стала меню.', 'The link in nav became the menu.') },
      { k: 'main', text: L3("main asosiy qismni saqladi, section uni bo'limlarga bo'ldi.", 'main хранил главную часть, а section делил её на разделы.', 'main held the main part, and section split it into sections.') },
      { k: 'list', text: L3("ul va li ro'yxat yasadi.", 'ul и li сделали список.', 'ul and li made the list.') },
      { k: 'img', text: L3("img src va alt bilan rasm qo'ydi.", 'img с src и alt поставил картинку.', 'img with src and alt added the picture.') },
      { k: 'footer', text: L3("footer sayt oxiri bo'ldi.", 'footer стал низом сайта.', 'footer became the bottom of the site.') },
      { k: 'form', text: L3("form, label, input, select va button esa mehmonlar uchun forma bo'ldi. Bu butun HTML kursi edi, va siz uni bitta saytga jamladingiz! Keyingi kursda CSS bilan saytingizni rangli va chiroyli qilamiz.", 'А form, label, input, select и button стали формой для гостей. Это был весь курс HTML, и ты собрал его в одном сайте! В следующем курсе с CSS сделаем твой сайт цветным и красивым.', 'And form, label, input, select and button became a form for visitors. That was the whole HTML course, and you put it all into one site! In the next course, CSS will make your site colorful and beautiful.') }
    ],
    roles: {
      title: L3("title — sahifa nomi", 'title — название', 'title — page title'),
      header: L3("header, h1 — sayt boshi", 'header, h1 — верх сайта', 'header, h1 — top'),
      nav: L3("nav, a — menyu", 'nav, a — меню', 'nav, a — menu'),
      main: L3("main, section — mazmun", 'main, section — содержимое', 'main, section — content'),
      list: L3("ul, li — ro'yxat", 'ul, li — список', 'ul, li — list'),
      img: L3("img — rasm", 'img — картинка', 'img — picture'),
      footer: L3("footer — sayt oxiri", 'footer — низ сайта', 'footer — bottom'),
      form: L3("form, select — forma", 'form, select — форма', 'form, select — form')
    },
    ask: L3("Sayt tayyor! «Amaliyotni tugatish»ni bosing", 'Сайт готов! Нажми «Завершить практику»', 'The site is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { start: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { title: 1, header: 1, nav: 1, main: 1, list: 1, img: 1, footer: 1, form: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a9-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a9.css@*/
`;
