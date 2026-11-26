// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Практика к уроку 8 — «Сайт школы Коди»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + практика.
// Сборка: node tools/amaliyot8/build.mjs → lessons/html/08p-struktura-sajta.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРАКТИКА 8 · «Сайт школы Коди» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (04.11.2026, на основе практики 07p — tools/amaliyot7). Коди сделал сайт своей школы: главная, новости,
// кружки, контакты. Он разложил страницы на части — header, nav, main, section, footer, — а при сохранении части
// перепутались и пропали: рамки «Инспектора» исчезли. Ученик чинит страницы по одной и сам пишет код: имя тега
// main → строка nav со ссылкой (смесь с уроком 4) → section с h2 и абзацем → найти верх, обёрнутый в head вместо
// header (загадка урока 8; в дополнительной задаче — опечатка foter) → свой сайт из частей. Карта — вкладки
// браузера, как в 01p–07p. 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-08p-struktura-sajta.md.
//
// ОСОБЫЕ ПРАВИЛА
//   · Код ученика не исполняется: разбор (a8-screens.jsx) находит теги, атрибуты и текст, страницу рисует React.
//     Честно, как в уроке 8: части сайта вид страницы не меняют — их показывает «Инспектор» (цветные пунктирные
//     рамки с именем тега, значок «Inspektor» на окне). head в body и опечатка — браузер не знает такой части,
//     рамки нет, а текст остаётся на месте.
//   · Узбекский — по навыку /uzbekcha: апостроф только ASCII ', «Siz»; sayt boshi, menyu, asosiy qism, bo'lim,
//     sayt oxiri — как в уроке 8. В речи header, nav, main, section, footer, head, href — по-английски. Символов
//     (= " /) в звучащих фразах нет. RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'html-08p-struktura-sajta',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '8-amaliyot. Kodining maktab sayti',
    ru: 'Практика 8. Сайт школы Коди',
    en: 'Practice 8. Kodi’s school site'
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
  next: L3("Yakuniy HTML loyiha", 'Финальный HTML-проект', 'Final HTML project'),
  finish: L3("Amaliyotni tugatish", 'Завершить практику', 'Finish the practice'),
  noTags: L3("Qavslar kodda allaqachon turibdi, bu yerga faqat teg nomini yozing.", 'Здесь нужно только имя тега: без уголков.', 'Only the tag name here: no angle brackets.'),
  insp: L3("Inspektor", 'Инспектор', 'Inspector'),
  parts: L3("Sayt qismlari", 'Части сайта', 'Site parts'),
  bpHeader: L3("sayt boshi: h1 va nav", 'верх: h1 и nav', 'top: h1 and nav'),
  bpMain: L3("asosiy qism", 'главная часть', 'main part'),
  bpSec: L3("bo'lim: h2 va p", 'раздел: h2 и p', 'section: h2 and p'),
  bpFooter: L3("sayt oxiri", 'низ сайта', 'bottom of the site'),
  given: L3("bor", 'уже есть', 'already there'),
  // Ключи, которых ждёт набор урока 1 (kollazh-kit, b16-chrome).
  up: L3("Yuqoriga", 'Вверх', 'Up'),
  down: L3("Pastga", 'Вниз', 'Down'),
  mySite: L3("Mening saytim", 'Мой сайт', 'My site'),
  hello: L3("Salom!", 'Привет!', 'Hello!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  ready: L3("Tayyor", 'Готово', 'Done')
};

// ─────────────────────────────────────────────────────────────────────────────
// САЙТ ШКОЛЫ — части сайта (что значит каждая), страницы, тексты.
// ─────────────────────────────────────────────────────────────────────────────
const ROLE = {
  header: L3("sayt boshi", 'верх сайта', 'the top of the site'),
  nav: L3("menyu", 'меню', 'the menu'),
  main: L3("asosiy qism", 'главная часть', 'the main part'),
  section: L3("bo'lim", 'раздел', 'a section'),
  footer: L3("sayt oxiri", 'низ сайта', 'the bottom of the site')
};
const PART_C = { header: '#FA4F28', nav: '#7C5CFA', main: '#0FA38E', section: '#D97706', footer: '#DB2777' };
const SCHOOL = L3("Kodi maktabi", 'Школа Коди', 'Kodi School');
const FOOT = L3("© 2026 Kodi maktabi", '© 2026 Школа Коди', '© 2026 Kodi School');
const PG = {
  index: L3("Bosh sahifa", 'Главная', 'Home'),
  news: L3("Yangiliklar", 'Новости', 'News'),
  clubs: L3("To'garaklar", 'Кружки', 'Clubs'),
  contact: L3("Aloqa", 'Контакты', 'Contacts'),
  gallery: L3("Galereya", 'Галерея', 'Gallery'),
  sport: L3("Sport", 'Спорт', 'Sport')
};
const TXT = {
  welcome: L3("Xush kelibsiz!", 'Добро пожаловать!', 'Welcome!'),
  welcomeP: L3("Bizda darslar qiziqarli.", 'У нас интересные уроки.', 'Our lessons are fun.'),
  newsP: L3("Bugun robotlar ko'rgazmasi!", 'Сегодня выставка роботов!', 'Today is the robot show!'),
  robot: L3("Robototexnika", 'Робототехника', 'Robotics'),
  chess: L3("Shaxmat", 'Шахматы', 'Chess'),
  phone: L3("Telefon: 90 123 45 67", 'Телефон: 90 123 45 67', 'Phone: 90 123 45 67'),
  soon: L3("Rasmlar tez orada!", 'Фото скоро!', 'Photos coming soon!'),
  sportP: L3("Har kuni futbol.", 'Футбол каждый день.', 'Football every day.')
};
// ПЯТЬ ВКЛАДОК — объекты карты: файл страницы, значок, цвет. Пятая — свой сайт ученика.
const TABS = [
  { id: 'index', file: 'index.html', ico: 'home', c: '#FA4F28', name: PG.index },
  { id: 'news', file: 'yangiliklar.html', ico: 'news', c: '#7C5CFA', name: PG.news },
  { id: 'clubs', file: 'togaraklar.html', ico: 'gear', c: '#0FA38E', name: PG.clubs },
  { id: 'contact', file: 'aloqa.html', ico: 'phone', c: '#F59E0B', name: PG.contact },
  { id: 'mine', file: 'mening.html', ico: 'star', c: '#E44D26', name: L3("Mening saytim", 'Мой сайт', 'My site') }
];
const XTRA = {
  ownH: L3("Mening sinfim", 'Мой класс', 'My class'),
  ownSec: L3("Darslar", 'Уроки', 'Lessons'),
  ownP: L3("Bizda besh xil dars bor.", 'У нас пять разных уроков.', 'We have five different lessons.'),
  ownFoot: L3("© 2026 Mening sinfim", '© 2026 Мой класс', '© 2026 My class')
};

// ─────────────────────────────────────────────────────────────────────────────
// ФРАЗЫ ПРОВЕРКИ — одна причина и следующий шаг; о правилах нашей страницы. Без «xato»,
// «noto'g'ri». {tag} — имя тега, {got} — что встретилось, {bad} — как записано, {want} — что нужно.
// В звучащих узбекских фразах нет тире и символов (= " /): движок делает из тире точку.
// ─────────────────────────────────────────────────────────────────────────────
const FB = {
  empty: L3("Inspektor hali ko'rsatadigan narsa topmadi: kodni shu yerga yozing.", 'Пока пусто. Пиши код здесь.', 'It’s empty so far. Write the code here.'),
  backslash: L3("Yopuvchi tegda «\\» emas, «/» turadi. Chiziqni boshqa tomonga qiyshaytiring.", 'Это обратная черта «\\». В закрывающем теге стоит обычная косая черта «/».', 'That’s a backslash “\\”. A closing tag uses a normal slash “/”.'),
  noGt: L3("Inspektor bu tegning oxirini topolmadi, chunki o'ng burchakli qavs «>» yo'q: \u2063«{bad}»\u2064.", 'В конце тега не хватает уголка «>»: \u2063«{bad}»\u2064.', 'This tag is missing the bracket “>” at the end: \u2063“{bad}”\u2064.'),
  noLt: L3("Inspektor bu qatorni teg deb tanimadi: boshida chap burchakli qavs «<» yo'q: \u2063«{bad}»\u2064.", 'Тег начинается с уголка «<», а здесь его нет: \u2063«{bad}»\u2064.', 'A tag starts with the bracket “<”, but it’s missing here: \u2063“{bad}”\u2064.'),
  typo: L3("Bunaqa teg yo'q: \u2063«{bad}»\u2064. Shuning uchun Inspektor uni tanimadi va ramka chizmadi. Balki «{near}» demoqchi edingiz?", 'Такого тега нет: \u2063«{bad}»\u2064. Поэтому Инспектор не считает его частью. Может быть, «{near}»?', 'There’s no such tag: \u2063“{bad}”\u2064. So the Inspector doesn’t see it as a part. Did you mean “{near}”?'),
  unknown: L3("Maktab saytiga bu teg kerak emas: \u2063«{bad}»\u2064. Sayt qismlarini header, nav, main, section va footer teglari yasaydi.", 'Этот тег на нашем сайте не нужен: \u2063«{bad}»\u2064. Части сайта: header, nav, main, section и footer.', 'Our site doesn’t need this tag: \u2063“{bad}”\u2064. The site parts are header, nav, main, section and footer.'),
  noLevel: L3("Inspektor bunday sarlavhani bilmaydi: \u2063«{bad}»\u2064. Sarlavha tegi h1, h2 kabi yoziladi.", 'Такого заголовка нет: \u2063«{bad}»\u2064. Заголовки бывают от h1 до h6.', 'There’s no such heading: \u2063“{bad}”\u2064. Headings go from h1 to h6.'),
  emptyTag: L3("Inspektor qavslarni ko'rdi, lekin ichida teg nomi yo'q. Nomni yozing, Inspektor ramka chizishga o'tadi.", 'Внутри уголков должно быть имя тега.', 'There should be a tag name between the brackets.'),
  inBody: L3("Maktab saytining qolgan qatorlari yozilgan, siz faqat body ichiga yozasiz.", 'Здесь пишется только то, что внутри body: остальное уже есть.', 'Write only what goes inside body here: the rest is already there.'),
  hasBody: L3("body tegi allaqachon bor: ochuvchisi tepada, yopuvchisi pastda turibdi. Kodni ularning o'rtasiga yozing.", 'body уже есть: сверху и снизу. Пиши внутри него.', 'body is already there, at the top and bottom. Write inside it.'),
  headNotHeader: L3("head sahifa haqidagi ko'rinmas ma'lumotlarni saqlaydi, body ichida u ishlamaydi. Sayt boshini esa header tegi yasaydi.", 'head — для невидимых сведений, внутри body он не работает. Для верха сайта нужен тег header.', 'head is for invisible details, and it doesn’t work inside body. The top of the site needs the header tag.'),
  needOpenText: L3("Inspektor matn oldida ochuvchi {tag} tegini ko'rmadi. Uni matndan oldin qo'ying.", 'Перед текстом нужен открывающий тег {tag}.', 'Before the text you need the opening {tag} tag.'),
  closeStray: L3("Bu yopuvchi \u2063{got}\u2064 tegi o'z ochuvchi juftini topolmayapti: u hali ochilmagan. Uni oching, shunda Inspektor ramka chizadi.", 'Это закрывающий тег \u2063{got}\u2064, но открывающего тега нет.', 'That’s the closing \u2063{got}\u2064 tag, but it was never opened.'),
  wrongOpen: L3("Inspektor bu joyda {tag} tegini kutgan edi, siz yozgan teg esa boshqa qismni bildiradi: \u2063{got}\u2064.", 'Здесь нужен тег {tag}, другой не подойдёт: \u2063{got}\u2064.', 'You need the {tag} tag here, not another one: \u2063{got}\u2064.'),
  needText: L3("{tag} ichida hech narsa yo'q: Inspektor ramkasi ko'rinadi, sahifada esa bo'sh joy qoladi. Matn yozing.", 'Напиши текст внутри {tag}.', 'Write some text inside {tag}.'),
  needSlash: L3("Yopuvchi tegni qiya chiziq «/» ajratib turadi: u {tag} so'zidan oldin yoziladi.", 'Это открывающий тег. В закрывающем перед {tag} стоит косая черта «/».', 'That’s an opening tag. The closing one has a slash “/” before {tag}.'),
  needClose: L3("Inspektor {tag} qismining oxirini topolmayapti, chunki u yopilmagan. Yopuvchi {tag} tegini qo'shing.", 'Часть {tag} не закрыта: в конце напиши закрывающий тег {tag}.', 'The {tag} part isn’t closed: add the closing {tag} tag at the end.'),
  headOpen: L3("{tag} yopilmagan, Inspektor shuning uchun pastdagi hamma narsani sarlavha deb o'yladi. Sarlavhadan keyin yopuvchi {tag} tegini yozing.", '{tag} не закрыт, поэтому всё ниже тоже стало крупным. После заголовка напиши закрывающий тег {tag}.', '{tag} isn’t closed, so everything below got big too. Add the closing {tag} tag after the heading.'),
  extra: L3("Inspektor oxirida ortiqcha narsani ko'rdi: \u2063{got}\u2064. Uni o'chiring.", 'В конце осталось лишнее: \u2063{got}\u2064.', 'There’s something extra at the end: \u2063{got}\u2064.'),
  short: L3("Bu yozuv juda qisqa ekan, unga kamida ikkita harf kerak.", 'Текст слишком короткий: хотя бы две буквы.', 'The text is too short: at least two letters.'),
  inlineOpen: L3("{tag} hali yopilmagan. Uning ichidagi so'zlar tugagach, yopuvchi {tag} tegini yozing.", '{tag} не закрыт. После выделенных слов напиши закрывающий тег {tag}.', '{tag} isn’t closed. After the marked words, add the closing {tag} tag.'),
  inlineStray: L3("Ochuvchisiz yopuvchi {tag} tegi Inspektorga ham tushunarsiz: {tag} hali ochilmagan. Oldin ochuvchi {tag} tegini yozing.", 'Это закрывающий тег {tag}, но {tag} не открыт. Сначала напиши открывающий тег {tag}.', 'That’s the closing {tag} tag, but {tag} was never opened. Write the opening {tag} tag first.'),
  inlineEmpty: L3("{tag} ichi bo'm-bo'sh, unga hech bo'lmasa bitta so'z yozing.", 'Внутри {tag} должно быть хотя бы одно слово.', 'Put at least one word inside {tag}.'),
  aOpen: L3("a tegi yopilmagan, Inspektor ham havolaning oxirini topolmayapti. So'zlardan keyin yopuvchi a tegini yozing.", 'a не закрыт: после слов ссылки напиши закрывающий тег a.', 'a isn’t closed: add the closing a tag after the link words.'),
  noQuote: L3("{attr} qiymatini qo'shtirnoq ichiga yozing, aks holda brauzer chalkashadi.", 'Значение {attr} пиши в кавычках.', 'Put the {attr} value in quotes.'),
  noEq: L3("Inspektor {attr} qiymatini o'qiy olmadi: teng belgisi bilan qo'shtirnoq tushib qolibdi.", 'После {attr} идёт знак равенства, а потом значение в кавычках.', 'After {attr} comes an equals sign, then the value in quotes.'),
  attrTypo: L3("Brauzer bunday atributni bilmaydi: \u2063«{bad}»\u2064. {tag} tegida {list} bo'ladi, boshqasi yo'q.", 'Такого атрибута нет: \u2063«{bad}»\u2064. У тега {tag} бывают {list}.', 'There’s no such attribute: \u2063“{bad}”\u2064. The {tag} tag has {list}.'),
  attrNone: L3("Bu {tag} tegida atribut turmaydi, ortiqchasini olib tashlang.", 'Тегу {tag} атрибут не нужен, убери его.', 'The {tag} tag doesn’t need an attribute, remove it.'),
  // Части сайта (урок 8).
  partOther: L3("Bu joyga {role} kerak, buni {want} tegi qiladi. Siz yozgan teg esa boshqa vazifa uchun.", 'Здесь нужен {want}, то есть {role}.', 'This needs {want}, that is, {role}.'),
  oneMain: L3("main sahifada faqat bitta bo'ladi. Uning ichidagi bo'limlarni esa section tegi bilan yozing.", 'main на странице один. Для разделов внутри есть section.', 'A page has just one main. For sections inside it there’s section.'),
  navWrap: L3("Havola tayyor-u, lekin hali menyuga kirmagan. Uni ochuvchi va yopuvchi nav teglarining o'rtasiga qo'ying.", 'Ссылка готова, но она не в меню. Напиши её между открывающим и закрывающим nav.', 'The link is ready, but it isn’t in the menu. Write it between the opening and closing nav tags.'),
  navNoLink: L3("Menyu bo'sh qolibdi: nav ichida birorta havola yo'q. Uning ichiga href atributi va havola so'zi bilan a tegini yozing.", 'В nav нет ссылки. Напиши внутри тег a: с href и словом ссылки.', 'There’s no link in nav. Write an a tag inside it, with href and the link word.'),
  noHref: L3("href bo'lmasa, a tegi havolaga aylanmaydi: so'z oddiy matn bo'lib qoldi. Ochuvchi a tegiga href qo'shing.", 'У этого тега a нет href, поэтому слово осталось простым текстом. Добавь href в открывающий тег a.', 'This a tag has no href, so the word stayed plain text. Add href to the opening a tag.'),
  hrefOther: L3("Bu havola boshqa sahifaga olib boradi: \u2063{got}\u2064. Kerakli sahifa ochilishi uchun href ichida {want} turishi kerak.", 'Эта ссылка ведёт на другую страницу: \u2063{got}\u2064. А нужно {want}.', 'This link goes to a different page: \u2063{got}\u2064. We need {want}.'),
  linkText: L3("Havolada boshqa so'z turibdi. a tegi ichiga «{want}» deb yozing.", 'Слово ссылки другое: напиши в a «{want}».', 'The link word is different: write “{want}” in a.'),
  secWrap: L3("Sarlavha bilan abzas bor-u, lekin ular hali bo'limga kirmagan. Ularni ochuvchi va yopuvchi section teglarining o'rtasiga oling.", 'Заголовок и абзац есть, но они не в разделе. Напиши их между открывающим и закрывающим section.', 'The heading and paragraph are there, but not in a section. Write them between the opening and closing section tags.'),
  secNeedH2: L3("Bo'lim sarlavhadan boshlanadi, shuning uchun section ichida eng tepada h2 tegi tursin.", 'Раздел начинается с заголовка: внутри section в самом верху тег h2.', 'A section starts with a heading: the h2 tag at the very top inside section.'),
  h2Other: L3("Bo'limning sarlavhasi boshqacha chiqibdi. h2 ichiga «{want}» deb yozing.", 'Заголовок раздела другой: напиши в h2 «{want}».', 'The section heading is different: write “{want}” in h2.'),
  secNeedP: L3("Sarlavha tayyor! Endi uning tagiga p tegida abzas yozing.", 'Заголовок готов! Теперь под ним напиши абзац — тег p.', 'The heading is ready! Now write a paragraph under it: the p tag.'),
  keepLine: L3("Ichidagi matnni o'zgartirmang, faqat tegning o'zini to'g'rilang.", 'Пусть текст внутри останется прежним: поправь только тег.', 'Keep the text inside as it was: just fix the tag.'),
  needHeader: L3("Sayt tepadan boshlanadi, shuning uchun eng tepaga header tegini yozing, ichiga esa h1 sarlavhani qo'ying.", 'Сайт начинается с верха: в самом верху напиши header, а в нём заголовок h1.', 'A site starts at the top: write header at the very top, with an h1 heading inside.'),
  h1InHeader: L3("header ichida saytning nomi tursin, uni h1 tegiga yozing.", 'Внутри header пусть будет название сайта — тег h1.', 'Put the site name inside header: the h1 tag.'),
  needNav: L3("Sayt boshida menyu ham bo'lishi kerak: header ichiga nav qo'ying, unga esa havola yozing.", 'Наверху сайта пусть будет меню: внутри header — nav, а в нём ссылка.', 'Let the top of the site have a menu: nav inside header, with a link in it.'),
  needMain: L3("Sayt boshi tayyor! Endi asosiy qismni main tegi bilan yozing.", 'Верх готов! Теперь главная часть — тег main.', 'The top is ready! Now the main part: the main tag.'),
  needSection: L3("main ichida kamida bitta bo'lim bo'lsin: section tegini oching, unga h2 bilan abzas yozing.", 'Внутри main пусть будет хотя бы один раздел: section, в нём h2 и абзац.', 'Let main have at least one section: section, with h2 and a paragraph.'),
  needFooter: L3("Endi eng pastga sayt oxirini qo'shing: footer tegini yozing, ichiga qisqagina matn qo'ying.", 'Последний шаг: низ сайта. В самом низу напиши тег footer, а в нём короткий текст.', 'Last step: the bottom of the site. At the very bottom, write the footer tag with a short text inside.'),
  partOrder: L3("Qismlarning joyi almashib qolibdi. Oldin header keladi, keyin main, eng oxirida esa footer.", 'Порядок частей: сначала header, потом main, в самом конце footer.', 'The order of parts: header first, then main, footer at the very end.'),
  inPart: L3("Bu matn hech bir qismga kirmay qolibdi. Uni header, main yoki footer ichiga ko'chiring.", 'Этот текст не внутри части. Напиши его внутри header, main или footer.', 'This text isn’t inside a part. Write it inside header, main or footer.'),
  next: L3("Endi {tag} qismiga o'tamiz, uni yozing.", 'Теперь напиши часть {tag}.', 'Now write the {tag} part.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, found, why …; печатаются: eyebrow, ask, roles.
// Реплики сцеплены в одну историю (hikoya.md): каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Maktab sayti", 'Сайт школы', 'School site'),
    say: L3("Maktabimizda yangi yordamchi paydo bo'ldi: Inspektor! U sayt qismlarini topadi va faqat to'g'ri yozilgan qismga rangli ramka chizadi. Maktab saytimizda bosh sahifa, yangiliklar, to'garaklar va aloqa bor, har birida uch qism: sayt boshi, asosiy qism va sayt oxiri. Direktor saytni ko'rmoqchi ekan, mana «Saqlash» tugmasi: bosing, nusxa unga ketadi.",
      'Привет! Я сделал сайт нашей школы: главная, новости, кружки и контакты. Каждую страницу я разложил на части: верх, главная часть и низ. Смотри, Инспектор показывает их цветными рамками. Осталось сохранить сайт. Нажми «Сохранить».',
      'Hi! I made a website for our school: home, news, clubs and contacts. I split each page into parts: the top, the main part and the bottom. Look, the Inspector shows them with colored frames. Now I just need to save the site. Tap “Save”.'),
    broke: L3("Inspektor birinchi sahifadayoq ramka chizmayapti! Kecha kimdir sayt kodiga qo'l urgan ko'rinadi: main tegining nomi o'chib ketgan, shuning uchun asosiy qismga ramka yo'q.",
      'Ой! При сохранении части перепутались. Смотри, на главной пропала рамка главной части: стёрлось имя тега main!',
      'Oh no! The parts got mixed up while saving. Look, the main part frame vanished on the home page: the main tag name got erased!'),
    done: L3("Direktorga bunday saytni ko'rsatib bo'lmaydi! Lekin Inspektor bizga yordam beradi: nima buzilganini sahifadan emas, ramkalardan topamiz. Ramkasiz qolgan qism buzilgan qism. To'rtta sahifani tuzatamiz, so'ng beshinchisida o'z saytingizni quramiz.",
      'На прошлом уроке мы познакомились с частями сайта: header, nav, main, section и footer. Вид страницы они не меняют, зато наводят порядок в коде. Теперь починим четыре страницы по одной. Код пишешь ты, а я рядом. А пятая страница будет твоей!',
      'Last lesson we met the site parts: header, nav, main, section and footer. They don’t change how the page looks, but they keep the code tidy. Now let’s fix four pages one by one. You write the code, and I’ll be right here. And the fifth page will be yours!'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("To'rtta sahifani tuzatamiz — kodni o'zingiz yozasiz", 'Починим четыре страницы — код пишешь ты', 'Let’s fix four pages — you write the code')
  },
  t1: {
    eyebrow: L3("Bosh sahifa", 'Главная', 'Home'),
    say: L3("Oldin bosh sahifani tuzatamiz. Sayt boshi ham, sayt oxiri ham joyida, o'rtadagi qismning ochuvchi tegidan esa faqat bo'sh qavslar qolibdi. Inspektor nomsiz tegni tanimaydi, shuning uchun asosiy qismga ramka chizmayapti. Qavslar o'rtasiga kerakli teg nomini yozib, «Tekshirish»ni bosing.",
      'Первая страница: главная. Верх и низ на месте, а у средней части стёрлось имя открывающего тега. Поэтому Инспектор не показывает рамку главной части. Впиши в уголки имя тега главной части.',
      'The first page is home. The top and bottom are in place, but the middle part lost the name of its opening tag. That’s why the Inspector doesn’t show the main part frame. Type the main part tag name in the brackets.'),
    ask: L3("Teg nomini yozing: main", 'Впиши имя тега: main', 'Type the tag name: main'),
    ok: L3("Mana, asosiy qism ramkasi paydo bo'ldi! Inspektor uni yana tanidi.", 'Отлично! Рамка главной части вернулась!', 'Great! The main part frame is back!'),
    hints: [
      L3("Pastroqqa, asosiy qismning oxiriga qarang-chi: u yerda yopuvchi teg turibdi. Ochuvchisining nomi ham xuddi shunday bo'ladi.", 'В конце части есть закрывающий тег. Открывающий называется так же.', 'The part ends with a closing tag. The opening tag has the same name.'),
      L3("Bitta bo'lim uchun section bor. Butun sahifaning o'rtasi uchun esa boshqa teg kerak: u katta va sahifada bitta bo'ladi. Qaysi biri bizga kerak?", 'section — это раздел, а главная часть — вся середина. Она на странице одна.', 'section is a section, and the main part is the whole middle. A page has just one.'),
      L3("Asosiy qismni yopuvchi teg pastroqda turibdi, nomini o'sha yerdan o'qing. Ochuvchisi ham aynan shunday nomda bo'ladi.", 'Например, низ сайта пишут так. А ты впиши main.', 'For example, the bottom of a site is written like this. You type main.')
    ],
    drill: L3("Endi sayt oxiri: teg nomini yozing", 'Теперь низ сайта: впиши имя тега', 'Now the bottom of the site: type the tag name')
  },
  t2: {
    eyebrow: L3("Yangiliklar", 'Новости', 'News'),
    say: L3("Yangiliklar sahifasida muammo boshqacha: tepadagi menyu o'chib ketibdi, yangiliklarni o'qigan bola endi bosh sahifaga qaytib o'ta olmaydi. Menyuni qaytaramiz: bo'sh qatorga nav tegini oching, ichiga bosh sahifaga havola yozing, keyin nav tegini yoping. Havola qanday yozilishini eslaysizmi?",
      'Главная готова, теперь новости. В верху этой страницы стёрлось меню, на главную не вернуться. Напиши в пустой строке меню: открывающий nav, внутри ссылка на главную, в конце закрывающий nav. Помнишь ссылки с прошлых уроков?',
      'Home is done, now news. The menu at the top of this page got erased, and there’s no way back home. Write the menu in the empty row: the opening nav, a link to the home page inside, the closing nav at the end. Remember links from earlier lessons?'),
    ask: L3("nav qatori: ichida «Bosh sahifa» havolasi, href «index.html»", 'Строка nav: внутри ссылка «Главная», href «index.html»', 'nav line: a “Home” link inside, href “index.html”'),
    ok: L3("Menyu joyida: yangiliklardan endi bosh sahifaga qaytsa bo'ladi.", 'Вот это да! Меню вернулось, и Инспектор обвёл его рамкой nav!', 'Wow! The menu is back, and the Inspector framed it as nav!'),
    hints: [
      L3("Menyuni nav tegi o'rab turadi, uning ichida esa havola bo'ladi. Havolani a tegi yasashini bilasiz-ku.", 'Меню пишут в теге nav. Внутри него — ссылка, то есть тег a.', 'A menu goes in the nav tag. Inside it is a link, that is, the a tag.'),
      L3("a tegining href atributiga fayl nomini yozasiz, teglar o'rtasiga esa havolaning so'zini.", 'В теге a: в href — имя файла, а между тегами — слово ссылки.', 'In the a tag, href holds the file name, and the link word goes between the tags.'),
      L3("Boshqa sahifada menyu allaqachon yozilgan, uning qatori pastda turibdi. Havolaning so'zi bilan fayl nomini o'zgartirsangiz, bizniki tayyor.", 'Вот строка другого меню. Напиши так же, только со ссылкой из задания.', 'Here’s the line for another menu. Write yours the same way, with the link from the task.')
    ],
    drill: L3("Endi aloqa sahifasiga: «Aloqa» havolasi, href «aloqa.html»", 'Теперь на контакты: ссылка «Контакты», href «aloqa.html»', 'Now to contacts: a “Contacts” link, href “aloqa.html”')
  },
  t3: {
    eyebrow: L3("To'garaklar", 'Кружки', 'Clubs'),
    say: L3("To'garaklar sahifasida asosiy qism bor-u, ichi bo'm-bo'sh: birorta to'garak haqida gap yo'q. Har bir to'garakka alohida bo'lim kerak, chunki bitta bo'limda bitta mavzu bo'ladi. Robototexnikadan boshlaylik. main ichida section tegini oching, section ichiga h2 sarlavha bilan bitta abzas yozing, keyin section tegini yoping.",
      'Две страницы готовы! Третья: кружки. Главная часть есть, но внутри пусто. Напиши в main раздел: открывающий section, заголовок h2, абзац и закрывающий section. Один раздел — одна тема.',
      'Two pages are done! The third is clubs. The main part is there, but it’s empty inside. Write a section inside main: the opening section, an h2 heading, a paragraph and the closing section. One section, one topic.'),
    ask: L3("section: h2 «Robototexnika» va abzas p", 'section: h2 «Робототехника» и абзац p', 'section: h2 “Robotics” and a paragraph p'),
    ok: L3("Robototexnika bo'limi tayyor: sarlavha va abzas bitta section ichida turibdi!", 'Огонь! Раздел готов, и Инспектор обвёл его рамкой section!', 'Awesome! The section is ready, and the Inspector framed it as section!'),
    hints: [
      L3("Bo'limni ochuvchi section tegi boshlaydi, yopuvchi section tegi tugatadi. Sarlavha bilan abzas ularning o'rtasida turadi.", 'Сначала открывающий section, в конце закрывающий. Заголовок и абзац — между ними.', 'First the opening section, the closing section at the end. The heading and paragraph go between them.'),
      L3("Bo'limning sarlavhasini h2 tegiga yozing, undan keyin p tegiga bitta gap qo'shing.", 'Заголовок раздела — в теге h2, потом одна фраза в теге p.', 'The section heading goes in h2, then one sentence in p.'),
      L3("Hamma bo'limlar bir qolipdan chiqadi: section, ichida h2 va p. Robototexnika bo'limi ham shunday, farqi faqat sarlavhasida.", 'Вот другой раздел. Напиши так же, только с заголовком из задания.', 'Here’s another section. Write yours the same way, with the heading from the task.')
    ],
    drill: L3("Endi yana bir bo'lim: h2 «Shaxmat» va abzas p", 'Теперь ещё раздел: h2 «Шахматы» и абзац p', 'Now one more section: h2 “Chess” and a paragraph p')
  },
  t4: {
    eyebrow: L3("Aloqa", 'Контакты', 'Contacts'),
    say: L3("Aloqa sahifasida sarlavha ko'rinib turibdi-yu, Inspektor sayt boshiga ramka chizmayapti: nimadir yo'q. Aybdor qatorni toping-chi, ustiga bosing.",
      'Три страницы готовы! Четвёртая: контакты. Тут я сам написал верх сайта: обернул заголовок в тег head. Заголовок виден, а рамки верха Инспектор не показывает. Значит, одна строка сломана. Сначала найди эту строку и нажми на неё.',
      'Three pages are done! The fourth is contacts. Here I wrote the top of the site myself: I wrapped the heading in the head tag. The heading shows, but the Inspector doesn’t show a frame for the top. So one line is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Inspektorni adashtirgan teg topildi: head sahifa haqidagi ko'rinmas ma'lumotlar uchun kerak, body ichida u ishlamaydi. Sayt boshini esa header tegi yasaydi. Ikkalasining nomi deyarli bir xil, shuning uchun hamma adashadi. Ikkala head so'zining o'rniga header deb yozing.",
      'Нашлась! head — для невидимых сведений, внутри body он не работает. А верх сайта — это тег header. Напиши header вместо обоих head.',
      'Found it! head is for invisible details, and it doesn’t work inside body. The top of the site is the header tag. Write header instead of both head words.'),
    foundX: L3("Sayt oxirining ramkasi yo'qligiga sabab shu teg: bitta harfi tushib qolgan! Brauzer uni tanimadi, Inspektor esa ramka chizmadi. Ikkala tegning nomini ham footer deb tuzating.",
      'Нашлась! В этом теге пропала одна буква, поэтому браузер его не узнал. Исправь имя в обоих тегах на footer.',
      'Found it! One letter is missing in this tag, so the browser didn’t recognize it. Fix the name in both tags to footer.'),
    ok: L3("Inspektor sayt boshini nihoyat tanidi, tepada ramka paydo bo'ldi! Nomi deyarli bir xil teglarni endi bir qarashda ajratasiz.", 'Ура, заработало! Рамка верха появилась. Поломка найдена, как у настоящего программиста!', 'Yes, it works! The top frame showed up. You found the bug like a real developer!'),
    why: {
      0: L3("Bu qatordan sahifa boshlanadi, sayt boshiga u aloqador emas. Sarlavha turgan qatorga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на строку заголовка.', 'body opens here, this line is fine. Look at the heading line.'),
      2: L3("Asosiy qism joyida, ramkasi ham bor. Sayt boshi-chi? Bir qator tepaga qarang.", 'Главная часть в порядке, рамка у неё есть. А где верх? Посмотри на строку выше.', 'The main part is fine, it has a frame. Where’s the top? Look one line up.'),
      3: L3("Sayt oxirining ramkasi bor, demak, u butun. Siz sayt boshini qidiring.", 'Низ сайта в порядке, рамка у него есть. Посмотри на верх.', 'The bottom is fine, it has a frame. Look at the top.'),
      4: L3("Sahifa shu yerda tugaydi, ramkasiz qolgan qism esa ancha tepada, o'shanga qaytamiz.", 'Здесь закрывается body, строка в порядке.', 'body closes here, this line is fine.')
    },
    whyX: {
      0: L3("Sahifa shu yerdan boshlanadi, sayt oxirining kodi esa pastroqda turibdi. Pastga qarang.", 'Здесь открывается body, строка в порядке. Посмотри на низ сайта.', 'body opens here, this line is fine. Look at the bottom of the site.'),
      1: L3("Sayt boshi ramkasi bilan turibdi, demak, u to'g'ri. Pastroqqa tushing.", 'Верх в порядке, рамка у него есть. Посмотри ниже.', 'The top is fine, it has a frame. Look further down.'),
      2: L3("Asosiy qismda ham muammo yo'q. Sayt oxiri qayerda ekan? Bir qator pastga qarang.", 'Главная часть в порядке. А где низ сайта? Посмотри на строку ниже.', 'The main part is fine. Where’s the bottom? Look one line down.'),
      4: L3("Sahifa shu yerda tugaydi. Sayt oxiri nega ramkasiz qoldi? Bir qator tepaga qarang.", 'Здесь закрывается body. Почему у низа нет рамки? Посмотри на строку выше.', 'body closes here. Why does the bottom have no frame? Look one line up.')
    },
    hints: [
      L3("Sarlavha ko'rinib turibdi-yu, sayt boshining ramkasi yo'q. Sayt boshi qaysi qatorda yozilgan?", 'Заголовок есть, а рамки верха нет. В какой строке верх сайта?', 'The heading is there, but there’s no frame for the top. Which line is the top?'),
      L3("Nomlari o'xshasa ham, head bilan header boshqa-boshqa teglar. Qaysi biri sayt boshini yasaydi?", 'head и header — разные теги. Какой из них — верх сайта?', 'head and header are different tags. Which one is the top of the site?'),
      L3("Qaysi biri sayt boshi, head yoki header? Boshqa sahifada to'g'ri yozilgani turibdi, solishtirib ko'ring.", 'Вот правильный верх сайта. Напиши и ты header вместо head.', 'Here’s a proper top of a site. Write header instead of head too.')
    ],
    drill: L3("Bu sahifada sayt oxiri ramkasiz: buzilgan qatorni toping va tuzating", 'Здесь у низа сайта нет рамки: найди сломанную строку и почини', 'Here the bottom of the site has no frame: find the broken line and fix it')
  },
  t5: {
    eyebrow: L3("Mening saytim", 'Мой сайт', 'My site'),
    say: L3("Sinfingiz uchun sayt qursangiz, unda nimalar bo'lardi? Endi shuni noldan yozasiz: sinfingiz yoki to'garagingiz haqida bo'lsin. Tepada header turadi: ichida sayt nomi h1 tegida va yonida havolali menyu. O'rtada main, ichida bitta bo'lim. Pastda footer, odatda unda sayt haqida qisqa yozuv bo'ladi.",
      'Четыре страницы горят! Теперь пятая: твой сайт. Здесь есть только body. Сделай страницу для своего класса или кружка. Наверху header: h1 и меню со ссылкой. В середине main, а в нём один раздел. Внизу footer.',
      'Four pages are lit! Now the fifth: your site. There’s only body here. Make a page for your class or club. At the top, header: h1 and a menu with a link. In the middle, main with one section inside. At the bottom, footer.'),
    ask: L3("body ichiga: header, main, footer", 'В body: header, main, footer', 'Inside body: header, main, footer'),
    ok: L3("Inspektor saytingizning hamma qismini topdi: tepada header, o'rtada main va section, pastda footer. Sinfingiz sayti maktab sayti bilan bir qatorda tura oladi!", 'Это было мощно! На твоём сайте есть все части, и Инспектор показывает их все!', 'That was awesome! Your site has every part, and the Inspector shows them all!'),
    hints: [
      L3("Chizmaga bir qarang-chi: tepada header, o'rtada main, eng pastda footer turadi.", 'Посмотри на схему: сначала header, потом main, в конце footer.', 'Look at the plan: first header, then main, footer at the end.'),
      L3("header ichida sayt nomi h1 bilan menyu nav yashaydi. main ichida section turadi, section ichida esa h2 sarlavha va p abzas bor.", 'В header — h1 и nav, в main — section, в section — h2 и p.', 'Inside header: h1 and nav. Inside main: section. Inside section: h2 and p.'),
      L3("Sinf saytining kodi tayyor turibdi: nechta qism bor? Uchta: header, main va footer. Sizniki ham shunday.", 'Вот сайт класса. Напиши так же, только про свой класс или кружок.', 'Here’s a class site. Write yours the same way, about your own class or club.')
    ]
  },
  drill: {
    say: L3("Inspektor yana bir sahifada ramka topa olmayapti, uni ham siz tuzatasiz.", 'Здорово! Теперь ещё одно маленькое задание: правило то же, слова другие.', 'Nice! Now one more small task: same rule, different words.'),
    done: L3("Ramka yonib turibdi: direktor bu sahifani ko'rsa ham bo'ladi!", 'Вот, теперь это правило твоё! Идём дальше.', 'There — now this rule is yours! Let’s keep going.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Maktab saytining hamma sahifasi tayyor! Endi o'zingiz qurgan sinf saytini tepadan pastga bir aylanib chiqamiz.", 'Смотри, все пять страниц готовы, и Инспектор показывает все части!', 'Look, all five pages are ready, and the Inspector shows every part!') },
      { k: 'header', text: L3("Eng tepada header turibdi: sayt nomi bilan menyu shu yerda yashaydi. Nomi head tegiga o'xshasa ham, vazifasi butunlay boshqa.", 'header был верхом сайта: в нём заголовок и меню. Не путай его с head.', 'header was the top of the site, with the heading and menu. Don’t mix it up with head.') },
      { k: 'nav', text: L3("header ichida nav turadi. U menyuni o'rab oladi, Inspektor esa havolalarni alohida ramka bilan ajratib ko'rsatadi.", 'nav оборачивал меню.', 'nav wrapped the menu.') },
      { k: 'main', text: L3("O'rtadagi katta ramka main. U sahifaning asosiy qismini o'rab turadi. Bunday ramka sahifada bitta bo'ladi.", 'main был главной частью, он на странице один.', 'main was the main part, and a page has just one.') },
      { k: 'section', text: L3("main ichida section bo'limlari yashaydi. Har bir bo'lim bitta mavzu haqida bo'ladi, bo'limlarni esa xohlaganingizcha qo'shsangiz bo'ladi.", 'А section делил главную часть на темы.', 'And section split the main part into topics.') },
      { k: 'footer', text: L3("Eng pastda footer turadi: bu sayt oxiri. Odatda u yerga sayt kimniki ekanini va yilini yozishadi.", 'footer был низом сайта.', 'footer was the bottom of the site.') },
      { k: 'own', text: L3("Bu saytni o'zingiz noldan qurdingiz, Inspektor esa unda birorta ham qismni o'tkazib yubormadi! Direktor mamnun bo'ladi. Endi butun kursdagi bilimlaringizni bitta saytga yig'adigan katta loyiha sizni kutyapti.", 'А в конце — твой собственный сайт из частей. Это было мощно! На следующем уроке — финальный проект.', 'And at the end you built your own site from parts. That was awesome! Next lesson is the final project.') }
    ],
    roles: {
      header: L3("header — sayt boshi", 'header — верх сайта', 'header — top'),
      nav: L3("nav — menyu", 'nav — меню', 'nav — menu'),
      main: L3("main — asosiy qism", 'main — главная часть', 'main — main part'),
      section: L3("section — bo'lim", 'section — раздел', 'section — section'),
      footer: L3("footer — sayt oxiri", 'footer — низ сайта', 'footer — bottom'),
      own: L3("O'z saytimni yig'dim", 'Свой сайт из частей', 'I built my own site')
    },
    ask: L3("Ish tayyor! «Amaliyotni tugatish»ni bosing", 'Работа готова! Нажми «Завершить практику»', 'Work is ready! Tap “Finish the practice”')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик практики — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { broke: 1, found: 1, foundX: 1, why: 1, whyX: 1 });
Object.assign(NOT_SPOKEN_IN, { roles: { header: 1, nav: 1, main: 1, section: 1, footer: 1, own: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:a8-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:a8.css@*/
`;
