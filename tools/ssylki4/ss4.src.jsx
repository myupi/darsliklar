// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 4 — «Ссылки и атрибуты»
// (бумажный коллаж, по эталону урока 1). Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/ssylki4/ss4.src.jsx lessons/html/04-ssylki-i-atributy.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Ссылки и атрибуты» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (26.10.2026, по эталону — урок 1 «Бумажная страница»; материал —
// ролик html4.mp4 «Ссылки»). Тот же бумажный стиль: лист с рваным краем,
// вырезки с фактурой и тенью, stop-motion, шорох бумаги, переход «разбор и
// сборка», честный бумажный браузер. Образ из ролика: ссылка — дверь на другую
// страницу, атрибут — жёлтая наклейка «дополнительная информация», href — адрес
// на двери. Сюжет: Коди делает сайт класса (главная, коты, собаки, игры,
// мультики); страницы не связаны — ученик делает между ними двери-ссылки.
//
// ДУГА (17 экранов): s1 крючок (нажать синие слова — открылась другая
// страница, адрес наверху сменился) · s2 план · тройки «объяснение → сам
// делаешь → закрепление»: тег a (s3–s5), атрибут и href (s6–s8), адрес решает,
// куда ведёт ссылка (s9–s11), ссылка целиком (s12–s14) · итоговая проверка
// (q1, q2) · s15 вывод — карта сайта.
// Сценарий — docs/scenarij-04-ssylki-i-atributy.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь.
//   · Честный браузер: ссылку делает только a с href — синие подчёркнутые
//     слова, нажатие открывает файл из href (адрес и вкладка меняются); a без
//     href — обычный текст; атрибут в закрывающем теге браузер не замечает;
//     атрибут после «>» виден на странице как текст; без </a> ссылкой
//     становится и всё ниже; ссылки подряд стоят в одной строке; файла нет —
//     «Файл не найден». Значение без кавычек браузер понимает — проверка
//     просит кавычки как правило записи.
//   · Конфетти только в финале: похвалы экранов — поза smile.
//
// СИСТЕМА СЛОВ. Ссылка — havola; атрибут — atribut (qo‘shimcha ma’lumot);
// адрес — manzil; значение — qiymat; имя атрибута — nomi; дверь — eshik. Как в
// уроках 1–3: teg (вслух «tag»), yorliq — только вкладка, oyna — окно, sahifa.
// Тег a вслух — «A», href — «H ref»; файл cats.html — «cats точка HTML».
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-04-ssylki-i-atributy',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '4-dars. Havolalar va atributlar',
    ru: 'Урок 4. Ссылки и атрибуты',
    en: 'Lesson 4. Links and attributes'
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
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Rasmlar', 'Изображения', 'Images'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  link: L3('Havola', 'Ссылку', 'A link'),
  plain: L3('Oddiy matn', 'Простой текст', 'Plain text'),
  go: L3('Havolani bosish', 'Нажать ссылку', 'Tap the link'),
  home: L3('Bosh sahifaga', 'На главную', 'To the home page'),
  notFound: L3('Fayl topilmadi', 'Файл не найден', 'File not found'),
  siteMap: L3('Sayt xaritasi', 'Карта сайта', 'Site map'),
  name: L3('nomi', 'имя', 'name'),
  value: L3('qiymati', 'значение', 'value'),
  attrWord: L3('atribut', 'атрибут', 'attribute')
};

// ─────────────────────────────────────────────────────────────────────────────
// САЙТ КЛАССА — страницы (файл → название, заголовок, картинка, строка текста).
// ─────────────────────────────────────────────────────────────────────────────
const PAGES = {
  index: { title: L3('Bosh sahifa', 'Главная', 'Home'), h1: L3('Sinfimiz sayti', 'Сайт нашего класса', 'Our class website'),
    text: L3('Salom! Bu yerda sinfimiz haqida hammasi.', 'Привет! Здесь всё про наш класс.', 'Hi! Everything about our class is here.') },
  cats: { title: L3('Mushuklar haqida', 'Про котов', 'About cats'), text: L3('Mushuklar uxlashni yaxshi ko‘radi.', 'Коты любят спать.', 'Cats love to sleep.') },
  dogs: { title: L3('Itlar haqida', 'Про собак', 'About dogs'), text: L3('Itlar yugurishni yaxshi ko‘radi.', 'Собаки любят бегать.', 'Dogs love to run.') },
  games: { title: L3('O‘yinlar', 'Игры', 'Games'), text: L3('Tanaffusda o‘ynaymiz!', 'Играем на перемене!', 'We play at break time!') },
  cartoons: { title: L3('Multfilmlar', 'Мультики', 'Cartoons'), text: L3('Shanba kuni multfilm ko‘ramiz.', 'В субботу смотрим мультики.', 'On Saturday we watch cartoons.') },
  club: { title: L3('Sport to‘garaklari', 'Спортивные кружки', 'Sports clubs'), text: L3('To‘garakni tanlang.', 'Выбери кружок.', 'Pick a club.') },
  football: { title: L3('Futbol', 'Футбол', 'Football'), text: L3('Mashg‘ulot dushanba kuni.', 'Тренировка в понедельник.', 'Practice is on Monday.') },
  chess: { title: L3('Shaxmat', 'Шахматы', 'Chess'), text: L3('Mashg‘ulot chorshanba kuni.', 'Занятие в среду.', 'Class is on Wednesday.') }
};
const NEWS = [L3('Ertaga sayohatga boramiz.', 'Завтра идём на экскурсию.', 'Tomorrow we go on a field trip.'),
  L3('Juma — sport kuni.', 'Пятница — день спорта.', 'Friday is sports day.')];

// Набор атрибута href (s7) и ссылки целиком (s13): что не так.
const ATTR_MSGS = {
  needName: L3('Atribut nomidan boshlanadi: href.', 'Атрибут начинается с имени: href.', 'An attribute starts with its name: href.'),
  wrongName: L3('Atribut nomini tekshiring: h, r, e, f — href.', 'Проверь имя атрибута: h, r, e, f — href.', 'Check the attribute name: h, r, e, f, href.'),
  needEq: L3('Nomdan keyin tenglik belgisi «=» turadi.', 'После имени ставят знак равно «=».', 'After the name comes an equals sign “=”.'),
  needQuotes: L3('Brauzer tushundi, lekin qiymat qo‘shtirnoq ichida yoziladi: manzildan oldin va keyin.', 'Браузер понял, но значение пишут в кавычках — перед адресом и после.', 'The browser understood, but the value goes in quotes, before the address and after it.'),
  needQuote2: L3('Qo‘shtirnoq juft bo‘ladi: biri manzildan oldin, ikkinchisi keyin.', 'Кавычки парные: одна перед адресом, другая после.', 'Quotes come in pairs: one before the address, one after.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения. Звучат: say, done, ok, msgs,
// hints, why, miss …; печатаются: eyebrow, ask, cards.title, note, opts.t.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Sinf sayti', 'Сайт класса', 'Class website'),
    say: L3('Bu sinfimiz sayti. Bosh sahifada ko‘k so‘zlar bor. Ularni bosib ko‘ring!',
      'Это сайт нашего класса. На главной странице есть синие слова. Нажми на них!',
      'This is our class website. There are blue words on the home page. Tap them!'),
    magic: L3('Ko‘rdingizmi? Tepada manzil o‘zgardi: bu endi boshqa sahifa.', 'Видишь? Адрес наверху стал другим — это уже другая страница.', 'See? The address at the top changed: this is a different page now.'),
    done: L3('Ko‘k so‘zlar — bu havola. Bugun shunday havolalar yasashni o‘rganasiz va sahifalarni bitta saytga bog‘laysiz!',
      'Синие слова — это ссылка. Сегодня ты научишься делать такие ссылки и соединишь страницы в целый сайт!',
      'The blue words are a link. Today you’ll learn to make links like this and join pages into a whole website!'),
    ask: L3('«Mushuklar haqida» degan ko‘k so‘zlarni bosing', 'Нажми синие слова «Про котов»', 'Tap the blue words “About cats”'),
    askDone: L3('Havola boshqa sahifani ochdi', 'Ссылка открыла другую страницу', 'The link opened another page')
  },
  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Mana bugungi reja. Unda to‘rtta qadam bor.', 'Вот план урока. В нём четыре шага.', 'Here’s the plan for today. It has four steps.'),
    cards: [
      { title: L3('So‘z-eshiklar', 'Слова-двери', 'Word doors'),
        say: L3('Avval oddiy so‘zlarni boshqa sahifaga olib boradigan eshikka aylantiramiz.', 'Сначала превратим обычные слова в дверь на другую страницу.', 'First we’ll turn plain words into a door to another page.') },
      { title: L3('Eshik manzili', 'Адрес двери', 'The door’s address'),
        say: L3('Keyin eshikka manzil beramiz: u eshik qayerga olib borishini aytadi.', 'Потом дадим двери адрес — куда она ведёт.', 'Then we’ll give the door an address: where it leads.') },
      { title: L3('Qayerga olib boradi?', 'Куда ведёт?', 'Where does it lead?'),
        say: L3('Uchinchi qadamda manzilni almashtiramiz va eshik qayerga olib borishini topamiz.', 'Третий шаг — меняем адрес и узнаём, куда ведёт дверь.', 'Step three: we change the address and find out where the door leads.') },
      { title: L3('O‘z havolangiz', 'Своя ссылка', 'Your own link'),
        say: L3('Oxirida esa yangi sahifaga o‘z havolangizni yozasiz!', 'А в конце ты напишешь свою ссылку на новую страницу!', 'And at the end you’ll write your own link to a new page!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  s3: {
    eyebrow: L3('a tegi — havola', 'Тег a — ссылка', 'The a tag is a link'),
    say: L3('Bu bosh sahifa kodi. Ko‘k so‘zlar havola. Keling, u nimadan yasalganini ko‘ramiz.',
      'Это код главной страницы. Синие слова — ссылка. Посмотрим, из чего она сделана.',
      'This is the code of the home page. The blue words are a link. Let’s see what it’s made of.'),
    sayA: L3('Havolani a tegi yasaydi. Ochuvchi a tegi so‘zlardan oldin, yopuvchisi esa keyin turadi.',
      'Ссылку делает тег a. Открывающий стоит перед словами, закрывающий — после.',
      'The a tag makes a link. The opening tag goes before the words, the closing one after.'),
    sayText: L3('Ular orasida sahifada ko‘rinadigan so‘zlar turadi. Aynan shu so‘zlarni bosasiz.', 'Между ними — слова, которые видно на странице. Их и нажимают.', 'Between them are the words you see on the page. Those are what you tap.'),
    sayAttr: L3('Mana bu qism esa manzilni beradi. U haqida biroz keyinroq gaplashamiz.', 'А эта часть задаёт адрес. О ней поговорим чуть позже.', 'And this part sets the address. We’ll talk about it a bit later.'),
    done: L3('Havola eshikka o‘xshaydi: so‘zlarni bossangiz, boshqa sahifaga o‘tasiz.', 'Ссылка — как дверь: нажимаешь на слова — и ты уже на другой странице.', 'A link is like a door: tap the words, and you’re on another page.'),
    ask: L3('Qarang: havola nimadan yasalgan', 'Смотри, из чего сделана ссылка', 'Watch what a link is made of'),
    askDone: L3('a tegi so‘zlarni havolaga aylantiradi', 'Тег a превращает слова в ссылку', 'The a tag turns words into a link')
  },
  s4: {
    eyebrow: L3('Havolani yoping', 'Закрой ссылку', 'Close the link'),
    say: L3('Men itlar sahifasiga havola yasadim, lekin a tegini yopishni unutdim. Qarang: pastdagi yangilik ham ko‘k bo‘lib qoldi, brauzer uni havolaning bir qismi deb o‘ylaydi. Bo‘sh joyga yopuvchi a tegini yozing.',
      'Я сделал ссылку на страницу про собак, но забыл закрыть тег a. Смотри: новость ниже тоже стала синей — браузер думает, что это часть ссылки. Допиши в пустое место закрывающий тег a.',
      'I made a link to the dogs page but forgot to close the a tag. Look: the news below turned blue too, because the browser thinks it’s part of the link. Type the closing a tag in the empty spot.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda a dan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед a стоит косая черта «/».', 'That’s an opening tag. In the closing tag, a slash “/” goes before the letter a.'),
      needLt: L3('Teg chap «<» qavs bilan boshlanadi. Uni boshiga qo‘shing.', 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      needGt: L3('Teg oxirida o‘ng «>» qavs turadi. Uni oxiriga qo‘shing.', 'В конце тега нужен уголок «>». Добавь его в конец.', 'A tag ends with the bracket “>”. Add it at the end.'),
      wrongName: L3('Teg ichida boshqa so‘z yozilgan. Bu yerda a kerak: aynan u havolani ochgan.', 'Внутри тега другое слово. Здесь нужно a — это он открыл ссылку.', 'There’s a different word inside the tag. You need the a tag here: it opened the link.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darhol turadi.', 'Косая черта «/» стоит сразу после первого уголка.', 'The slash “/” goes right after the first bracket.')
    },
    hints: [
      L3('Havola qaysi teg bilan ochilgan? Aynan uni yopish kerak.', 'Каким тегом открыта ссылка? Его и нужно закрыть.', 'Which tag opened the link? That’s the one to close.'),
      L3('Yopuvchi teg o‘sha harf, faqat qiya chiziq bilan.', 'Закрывающий тег — та же буква, но с косой чертой.', 'The closing tag is the same letter, with a slash.'),
      L3('Avval burchakli qavs, keyin qiya chiziq qo‘ying. Undan keyin a va oxirida yana burchakli qavs.', 'Сначала уголок, потом косая черта. Дальше a и в конце снова уголок.', 'First a bracket, then the slash. Then the letter a, and another bracket at the end.')
    ],
    ok: L3('To‘g‘ri! Havola yopildi, yangilik yana oddiy matn.', 'Есть! Ссылка закрыта — новость снова обычный текст.', 'Yes! The link is closed, and the news is plain text again.'),
    ask: L3('Bo‘sh joyga yopuvchi a tegini yozing', 'Допиши закрывающий тег a в пустое место', 'Type the closing a tag in the empty spot')
  },
  s5: {
    eyebrow: L3('Havolami yoki matnmi?', 'Ссылка или текст?', 'Link or text?'),
    say: L3('Endi brauzer kabi o‘ylang: havolani faqat a tegi yasaydi.', 'Теперь подумай как браузер: ссылку делает только тег a.', 'Now think like a browser: only the a tag makes a link.'),
    askQ: L3('Brauzer nimani ko‘rsatadi?', 'Что покажет браузер?', 'What will the browser show?'),
    okLink: L3('To‘g‘ri! a tegi bor — demak, havola.', 'Верно! Есть тег a — значит, ссылка.', 'Right! There’s the a tag, so it’s a link.'),
    okText: L3('To‘g‘ri! a tegi yo‘q — havola ham yo‘q.', 'Верно! Нет тега a — нет и ссылки.', 'Right! Without the a tag, there’s no link.'),
    miss: {
      a: L3('Qarang: so‘zlar a tegi ichida. Bu havola, uni bosish mumkin.', 'Смотри: слова внутри тега a. Это ссылка, её можно нажать.', 'Look: the words are inside the a tag. It’s a link you can tap.'),
      fmt: L3('Qarang: bu teg so‘zni faqat bezaydi. Havolani esa a tegi yasaydi.', 'Смотри: этот тег только украшает слово. А ссылку делает тег a.', 'Look: this tag only styles the word. Only the a tag makes a link.'),
      blk: L3('Qarang: bu sarlavha yoki xatboshi, havola emas. Havolani a tegi yasaydi.', 'Смотри: это заголовок или абзац, а не ссылка. Ссылку делает тег a.', 'Look: this is a heading or a paragraph, not a link. Only the a tag makes a link.')
    },
    done: L3('Tushunarli: havolani a tegi yasaydi, boshqa teglar emas.', 'Главное понятно: ссылку делает тег a, а не другие теги.', 'Got it: the a tag makes links, not other tags.')
  },
  s6: {
    eyebrow: L3('Atribut', 'Атрибут', 'Attribute'),
    say: L3('Qarang: a tegi bor, lekin havola yo‘q: so‘zlar qora, bosib bo‘lmaydi. Eshikning manzili yo‘q, brauzer u qayerga olib borishini bilmaydi.',
      'Смотри: тег a есть, а ссылки нет — слова чёрные, нажать нельзя. У двери нет адреса: браузер не знает, куда она ведёт.',
      'Look: there’s the a tag, but no link: the words are black and can’t be tapped. The door has no address, so the browser doesn’t know where it leads.'),
    sayAttr: L3('Bu yerda atribut yordam beradi: teg haqida qo‘shimcha ma’lumot. U ochuvchi teg ichiga, teg nomidan keyin yoziladi.',
      'Тут помогает атрибут — дополнительная информация о теге. Его пишут внутри открывающего тега, после имени тега.',
      'This is where an attribute helps: extra information about a tag. It goes inside the opening tag, after the tag name.'),
    sayForm: L3('Atribut shunday yoziladi: nomi, tenglik belgisi va qo‘shtirnoq ichida qiymati.', 'Атрибут пишут так: имя, знак равно и значение в кавычках.', 'An attribute is written like this: a name, an equals sign and a value in quotes.'),
    sayHref: L3('Havolaning asosiy atributi — href. Unda sahifa manzili turadi: cats.html.', 'У ссылки главный атрибут — href. В нём адрес страницы: cats.html.', 'The main attribute of a link is href. It holds the page address: cats.html.'),
    done: L3('Endi eshikning manzili bor. Bossangiz, darhol o‘sha sahifaga o‘tasiz!', 'Теперь у двери есть адрес. Нажимаешь — и ты уже там!', 'Now the door has an address. Tap it, and you’re already there!'),
    ask: L3('Qarang: eshikka manzil kerak', 'Смотри: двери нужен адрес', 'Watch: the door needs an address'),
    askDone: L3('Atribut — teg haqida qo‘shimcha ma’lumot', 'Атрибут — дополнительная информация о теге', 'An attribute is extra information about a tag'),
    note: L3('teg haqida qo‘shimcha ma’lumot', 'дополнительная информация о теге', 'extra information about a tag')
  },
  s7: {
    eyebrow: L3('Manzil yozing', 'Впиши адрес', 'Add the address'),
    say: L3('Itlar haqidagi havolada manzil yo‘q, so‘zlar qora. Ochuvchi tegdagi bo‘sh joyga href atributini yozing. Itlar sahifasining manzili — dogs.html.',
      'У ссылки про собак нет адреса — слова чёрные. Впиши в пустое место открывающего тега атрибут href. Адрес страницы про собак — dogs.html.',
      'The dogs link has no address, so the words are black. Type the href attribute in the empty spot of the opening tag. The dogs page address is dogs.html.'),
    msgs: Object.assign({}, ATTR_MSGS, {
      wrongVal: L3('Manzilni tekshiring: itlar sahifasi — dogs.html.', 'Проверь адрес: страница про собак — dogs.html.', 'Check the address: the dogs page is dogs.html.')
    }),
    hints: [
      L3('Atribut uch qismdan iborat: nomi, tenglik belgisi, qiymati.', 'Атрибут из трёх частей: имя, знак равно, значение.', 'An attribute has three parts: a name, an equals sign, a value.'),
      L3('Nomi — href, qiymati — dogs.html, qo‘shtirnoq ichida.', 'Имя — href, значение — dogs.html, в кавычках.', 'The name is href, the value is dogs.html, in quotes.'),
      L3('Tugmalarni tartib bilan bosing: href, tenglik, qo‘shtirnoq, dogs.html, qo‘shtirnoq.', 'Нажми кнопки по порядку: href, равно, кавычка, dogs.html, кавычка.', 'Tap the keys in order: href, equals, quote, dogs.html, quote.')
    ],
    ok: L3('Zo‘r! So‘zlar ko‘k bo‘ldi: havolaning manzili bor. Bosib ko‘rishingiz mumkin!', 'Огонь! Слова стали синими — у ссылки есть адрес. Можешь нажать!', 'Awesome! The words turned blue: the link has an address. You can tap it!'),
    ask: L3('href atributini dogs.html manzili bilan yozing', 'Впиши href с адресом dogs.html', 'Type href with the address dogs.html')
  },
  s8: {
    eyebrow: L3('Atribut qayerda?', 'Где атрибут?', 'Where’s the attribute?'),
    say: L3('Bu havola uchun manzilli atribut tayyor. Uni kerakli joyga torting: brauzer darhol ko‘rsatadi.',
      'Для этой ссылки уже готов атрибут с адресом. Перетащи его в нужное место — браузер сразу покажет.',
      'An attribute with the address is ready for this link. Drag it to the right spot, and the browser will show it right away.'),
    why: {
      text: L3('Qarang: atribut so‘zlar qatoriga tushib, sahifada matn bo‘lib ko‘rindi. Atribut ochuvchi teg ichida turadi.', 'Смотри: атрибут попал к словам и виден на странице как текст. Атрибут стоит внутри открывающего тега.', 'Look: the attribute landed among the words and shows up on the page as text. An attribute goes inside the opening tag.'),
      close: L3('Qarang: yopuvchi tegdagi atributni brauzer sezmaydi, havola yo‘q. Atribut ochuvchi teg ichida turadi.', 'Смотри: атрибут в закрывающем теге браузер не замечает — ссылки нет. Атрибут стоит внутри открывающего тега.', 'Look: the browser ignores an attribute in the closing tag, so there’s no link. An attribute goes inside the opening tag.')
    },
    hints: [
      L3('Atribut qaysi tegda yashashini eslang.', 'Вспомни, в каком теге живёт атрибут.', 'Remember which tag an attribute lives in.'),
      L3('Atribut ochuvchi teg ichida, teg nomidan keyin turadi.', 'Атрибут — внутри открывающего тега, после имени тега.', 'The attribute goes inside the opening tag, after the tag name.'),
      L3('Atributni yonib turgan joyga torting.', 'Перетащи атрибут на светящееся место.', 'Drag the attribute to the glowing spot.')
    ],
    ok: L3('To‘g‘ri! Atribut ochuvchi teg ichida, havola ishlayapti.', 'Верно! Атрибут внутри открывающего тега — ссылка работает.', 'Right! The attribute is inside the opening tag, and the link works.'),
    more: L3('Yana bitta havola. Endi buni o‘zingiz bilasiz.', 'Ещё одна ссылка. Теперь ты знаешь, как.', 'One more link. Now you know how.'),
    ask: L3('Atributni kerakli joyga torting', 'Перетащи атрибут в нужное место', 'Drag the attribute to the right spot'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the spot'),
    pickFirst: L3('Avval atributni bosing.', 'Сначала нажми атрибут.', 'Tap the attribute first.')
  },
  s9: {
    eyebrow: L3('Manzil hal qiladi', 'Решает адрес', 'The address decides'),
    say: L3('Bosh sahifada ikkita havola bor. Har biri o‘z manziliga olib boradi.', 'На главной две ссылки. Каждая ведёт по своему адресу.', 'There are two links on the home page. Each one leads to its own address.'),
    sayCats: L3('href qiymati cats.html — va biz mushuklar sahifasidamiz.', 'В href стоит cats.html — и мы на странице про котов.', 'href says cats.html, and we’re on the cats page.'),
    sayDogs: L3('dogs.html esa itlar sahifasiga olib boradi.', 'А dogs.html ведёт к собакам.', 'And dogs.html leads to the dogs page.'),
    saySwap: L3('Birinchi havoladagi manzilni dogs.html ga almashtirsak-chi?', 'А если в первой ссылке поменять адрес на dogs.html?', 'What if we change the address in the first link to dogs.html?'),
    done: L3('So‘zlar o‘sha-o‘sha, «Mushuklar haqida», lekin itlar sahifasiga tushdik! Havola qayerga olib borishini href dagi manzil hal qiladi.',
      'Слова те же — «Про котов», а попали к собакам! Куда ведёт ссылка, решает адрес в href.',
      'The words still say “About cats”, but we landed on the dogs page! The address in href decides where a link leads.'),
    ask: L3('Qarang: havolalar qayerga olib boradi', 'Смотри, куда ведут ссылки', 'Watch where the links lead'),
    askDone: L3('Manzil hal qiladi, so‘zlar emas', 'Решает адрес, а не слова', 'The address decides, not the words')
  },
  s10: {
    eyebrow: L3('Havolani tuzating', 'Почини ссылку', 'Fix the link'),
    say: L3('Voy, men adashibman: «O‘yinlar» havolasi mushuklarga olib boryapti. Sayt xaritasidan o‘yinlar sahifasining manzilini toping va uni href ga yozing.',
      'Ой, я ошибся: ссылка «Игры» ведёт к котам. Найди на карте сайта адрес страницы игр и впиши его в href.',
      'Oops, I made a mistake: the “Games” link leads to the cats page. Find the games page address on the site map and type it into href.'),
    msgs: {
      page: L3('Havola «{page}» sahifasini ochdi. Bizga o‘yinlar sahifasi kerak.', 'Ссылка открыла страницу «{page}». А нужна страница игр.', 'The link opened the “{page}” page. We need the games page.'),
      none: L3('Brauzer «{url}» faylini topmadi. Manzilni sayt xaritasi bilan solishtiring: har bir harf muhim.', 'Браузер не нашёл файл «{url}». Сверь адрес с картой сайта: важна каждая буква.', 'The browser couldn’t find the file “{url}”. Compare the address with the site map: every letter matters.'),
      empty: L3('Qo‘shtirnoq ichiga sahifa manzilini yozing.', 'Впиши между кавычками адрес страницы.', 'Type the page address between the quotes.')
    },
    hints: [
      L3('Sayt xaritasida har bir sahifa ostida uning manzili yozilgan.', 'На карте сайта под каждой страницей подписан её адрес.', 'On the site map, each page has its address written under it.'),
      L3('O‘yinlar sahifasining manzili games so‘zidan boshlanadi.', 'Адрес страницы игр начинается со слова games.', 'The games page address starts with the word games.'),
      L3('Qo‘shtirnoq ichiga games.html yozing.', 'Впиши между кавычками games.html.', 'Type games.html between the quotes.')
    ],
    ok: L3('Ishladi! «O‘yinlar» endi o‘yinlar sahifasiga olib boradi.', 'Работает! «Игры» теперь ведут на страницу игр.', 'It works! “Games” now leads to the games page.'),
    ask: L3('href ga o‘yinlar sahifasining manzilini yozing', 'Впиши в href адрес страницы игр', 'Type the games page address into href')
  },
  s11: {
    eyebrow: L3('Qayerga olib boradi?', 'Куда приведёт?', 'Where will it lead?'),
    say: L3('Kodga qarang va bu havola qaysi sahifani ochishini toping.', 'Посмотри на код и найди, какую страницу откроет эта ссылка.', 'Look at the code and find which page this link will open.'),
    askQ: L3('Havola qaysi sahifani ochadi?', 'Какую страницу откроет ссылка?', 'Which page will the link open?'),
    ok: L3('To‘g‘ri! Manzil aynan shu sahifaga olib boradi.', 'Верно! Адрес ведёт именно сюда.', 'Right! The address leads right here.'),
    miss: {
      plain: L3('Qarang: href da {url} turibdi. Havola aynan shu faylni ochadi.', 'Смотри: в href стоит {url}. Ссылка открывает именно этот файл.', 'Look: href says {url}. The link opens exactly that file.'),
      trap: L3('Qarang: so‘zlar boshqa narsani aytadi, lekin href da {url}. Havolani manzil olib boradi, so‘zlar emas.', 'Смотри: слова говорят одно, а в href стоит {url}. Ведёт адрес, а не слова.', 'Look: the words say one thing, but href says {url}. The address leads, not the words.'),
      home: L3('Qarang: href da index.html turibdi — bu bosh sahifa.', 'Смотри: в href стоит index.html — это главная страница.', 'Look: href says index.html, that’s the home page.')
    },
    done: L3('Endi har qanday havola qayerga olib borishini bilasiz: href ga qarang.', 'Теперь ты знаешь, куда ведёт любая ссылка: смотри в href.', 'Now you know where any link leads: look at href.'),
    texts: { play: L3('O‘ynaymizmi?', 'Поиграем?', 'Want to play?'), meow: L3('Miyov!', 'Мяу!', 'Meow!'), back: L3('Orqaga', 'Назад', 'Back') }
  },
  s12: {
    eyebrow: L3('Havola qismlari', 'Ссылка по частям', 'A link, part by part'),
    say: L3('Mana butun havola. Keling, uni qismlarga ajratib ko‘ramiz.', 'Вот ссылка целиком. Разберём её по частям.', 'Here’s a whole link. Let’s take it apart.'),
    parts: {
      open: L3('Boshida ochuvchi a tegi. U havolani ochadi.', 'В начале — открывающий тег a. Он открывает ссылку.', 'At the start is the opening a tag. It opens the link.'),
      name: L3('Uning ichida atribut. Avval atribut nomi: href.', 'Внутри него — атрибут. Сначала имя атрибута: href.', 'Inside it is the attribute. First the attribute name: href.'),
      eq: L3('Keyin tenglik belgisi.', 'Потом знак равно.', 'Then an equals sign.'),
      val: L3('Keyin qo‘shtirnoq ichida qiymat: sahifa manzili games.html.', 'Потом значение в кавычках — адрес страницы games.html.', 'Then the value in quotes: the page address games.html.'),
      text: L3('Keyin sahifada ko‘rinadigan so‘zlar. Aynan shu so‘zlarni bosasiz.', 'Дальше — слова, которые видно на странице. Их и нажимают.', 'Next come the words you see on the page. Those are what you tap.'),
      close: L3('Va yopuvchi a tegi: havola shu yerda tugaydi.', 'И закрывающий тег a: здесь ссылка кончается.', 'And the closing a tag: the link ends here.')
    },
    tapSay: L3('Istalgan qismni bosing, men uni yana tushuntiraman.', 'Нажми любую часть — я повторю её объяснение.', 'Tap any part, and I’ll explain it again.'),
    ask: L3('Havola qismlarini kuzating', 'Смотри на части ссылки', 'Watch the parts of the link'),
    askDone: L3('Havola qismlari', 'Части ссылки', 'The parts of a link'),
    askTap: L3('Xohlasangiz, istalgan qismni bosing', 'Нажми любую часть, если хочешь', 'Tap any part if you like')
  },
  s13: {
    eyebrow: L3('O‘z havolangiz', 'Своя ссылка', 'Your own link'),
    say: L3('Men yangi sahifa yasadim: multfilmlar haqida, manzili cartoons.html. Bosh sahifada unga olib boradigan havolani to‘liq yozing: a tegi, manzilli href atributi va ichida o‘z so‘zlaringiz.',
      'Я сделал новую страницу — про мультики, адрес cartoons.html. Напиши на главной ссылку на неё целиком: тег a, атрибут href с адресом и свои слова внутри.',
      'I made a new page about cartoons, its address is cartoons.html. Write a whole link to it on the home page: the a tag, the href attribute with the address, and your own words inside.'),
    msgs: Object.assign({}, ATTR_MSGS, {
      needOpen: L3('Havola ochuvchi teg bilan boshlanadi: burchakli qavs «<» va a.', 'Ссылка начинается с открывающего тега: уголок «<» и a.', 'A link starts with the opening tag: the bracket “<” and the letter a.'),
      needSpace: L3('a va href orasida bo‘sh joy qoldiring.', 'Между a и href нужен пробел.', 'Put a space between the letter a and href.'),
      needName: L3('Ochuvchi tegga href atributi kerak.', 'В открывающем теге нужен атрибут href.', 'The opening tag needs the href attribute.'),
      wrongVal: L3('Manzilni tekshiring: multfilmlar sahifasi — cartoons.html.', 'Проверь адрес: страница мультиков — cartoons.html.', 'Check the address: the cartoons page is cartoons.html.'),
      needGt: L3('Manzildan keyin ochuvchi teg o‘ng «>» qavs bilan tugaydi.', 'После адреса открывающий тег заканчивается уголком «>».', 'After the address, the opening tag ends with the bracket “>”.'),
      needText: L3('Teglar orasiga sahifada ko‘rinadigan so‘zlarni yozing.', 'Между тегами напиши слова, которые увидят на странице.', 'Between the tags, type the words people will see on the page.'),
      needClose: L3('Oxirida yopuvchi a tegi kerak.', 'В конце нужен закрывающий тег a.', 'At the end you need the closing a tag.')
    }),
    hints: [
      L3('Havola uch qismdan iborat: ochuvchi teg, so‘zlar va yopuvchi teg.', 'Ссылка из трёх частей: открывающий тег, слова и закрывающий тег.', 'A link has three parts: the opening tag, the words and the closing tag.'),
      L3('Ochuvchi tegga cartoons.html manzilli href atributini yozing.', 'В открывающий тег впиши атрибут href с адресом cartoons.html.', 'Put the href attribute with the address cartoons.html in the opening tag.'),
      L3('Namuna qatoriga qarang: xuddi shunday yozing, faqat manzil cartoons.html va so‘zlar sizniki.', 'Посмотри на строку-образец: напиши так же, только адрес cartoons.html и слова свои.', 'Look at the example line: write it the same way, but with the address cartoons.html and your own words.')
    ],
    ok: L3('Zo‘r havola! Uni bosib ko‘ring: multfilmlar sahifasi ochiladi.', 'Отличная ссылка! Нажми её — откроется страница мультиков.', 'Great link! Tap it, and the cartoons page will open.'),
    ask: L3('Multfilmlar sahifasiga havolani to‘liq yozing', 'Напиши ссылку на страницу мультиков целиком', 'Write a whole link to the cartoons page'),
    sample: L3('Mushuklar', 'Коты', 'Cats')
  },
  s14: {
    eyebrow: L3('Havola sahifani yutdi', 'Ссылка съела страницу', 'The link ate the page'),
    say: L3('Yordam bering! Men bitta havolani yopmadim va u butun sahifani yutib yubordi. Yopuvchi a tegini kerakli joyga torting.',
      'Помоги! Я не закрыл одну ссылку, и она съела всю страницу. Перетащи закрывающий тег a в нужное место.',
      'Help! I didn’t close one link, and it swallowed the whole page. Drag the closing a tag to the right spot.'),
    why: {
      b: L3('Qarang: birinchi yangilik hali ham ko‘k. Havola «O‘yinlar» so‘zidan keyin darhol tugashi kerak.', 'Смотри: первая новость всё ещё синяя. Ссылка должна кончиться сразу после слова «Игры».', 'Look: the first news line is still blue. The link should end right after the word “Games”.'),
      c: L3('Qarang: hamma narsa hali ham ko‘k. Havola faqat «O‘yinlar» so‘zini o‘rashi kerak.', 'Смотри: всё по-прежнему синее. Ссылка должна обнимать только слово «Игры».', 'Look: everything is still blue. The link should wrap only the word “Games”.')
    },
    hints: [
      L3('Qaysi so‘zlar havola bo‘lishi kerak?', 'Какие слова должны быть ссылкой?', 'Which words should be the link?'),
      L3('Faqat «O‘yinlar». Havola shu so‘zdan keyin yopiladi.', 'Только «Игры». Ссылка закрывается сразу после этого слова.', 'Only “Games”. The link closes right after that word.'),
      L3('Tegni yonib turgan joyga torting.', 'Перетащи тег на светящееся место.', 'Drag the tag to the glowing spot.')
    ],
    ok: L3('Qutqardingiz! Havola faqat «O‘yinlar» so‘zida, yangiliklar yana oddiy matn.', 'Спасено! Ссылка только на слове «Игры», новости снова обычный текст.', 'Saved! The link is only on the word “Games”, and the news is plain text again.'),
    ask: L3('Yopuvchi a tegini kerakli joyga torting', 'Перетащи закрывающий тег a в нужное место', 'Drag the closing a tag to the right spot'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the spot'),
    pickFirst: L3('Avval tegni bosing.', 'Сначала нажми тег.', 'Tap the tag first.')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новый пример без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('O‘zingizni tekshiring', 'Проверь себя', 'Check yourself'),
    say: L3('Yangi sahifa: sport to‘garaklari. Har bir havolaga o‘z manzilini bering, shunda u o‘z sahifasiga olib boradi. Bitta stiker ortiqcha.',
      'Новая страница — спортивные кружки. Дай каждой ссылке свой адрес, чтобы она вела на свою страницу. Одна наклейка лишняя.',
      'A new page: sports clubs. Give each link its own address so it leads to its page. One sticker is extra.'),
    why: {
      swap: L3('Qarang: havola boshqa sahifaga olib boryapti. So‘zlarga mos manzilni tanlang.', 'Смотри: ссылка ведёт не на ту страницу. Выбери адрес, который подходит к словам.', 'Look: the link leads to the wrong page. Choose the address that matches the words.'),
      bare: L3('Qarang: havola yo‘q, so‘zlar qora. href nomisiz brauzer bu manzil ekanini tushunmadi. Atribut — nomi, tenglik belgisi va qiymati.', 'Смотри: ссылки нет, слова чёрные. Без имени href браузер не понял, что это адрес. Атрибут — это имя, знак равно и значение.', 'Look: no link, the words are black. Without the name href, the browser didn’t know it’s an address. An attribute is a name, an equals sign and a value.')
    },
    hints: [
      L3('Har bir havola qaysi sahifaga olib borishi kerak?', 'На какую страницу должна вести каждая ссылка?', 'Which page should each link lead to?'),
      L3('Futbol — football.html, shaxmat — chess.html. Atributda href nomi bo‘lishi shart.', 'Футбол — football.html, шахматы — chess.html. В атрибуте обязательно имя href.', 'Football is football.html, chess is chess.html. The attribute must have the name href.'),
      L3('Yonib turgan stikerni yonib turgan joyga torting.', 'Перетащи светящуюся наклейку на светящееся место.', 'Drag the glowing sticker to the glowing spot.')
    ],
    ok: L3('Ajoyib! Ikkala havola o‘z sahifasiga olib boradi.', 'Отлично! Обе ссылки ведут на свои страницы.', 'Great! Both links lead to their own pages.'),
    pickFirst: L3('Avval stikerni tanlang.', 'Сначала выбери наклейку.', 'Pick a sticker first.'),
    ask: L3('Manzilni havolaga torting', 'Перетащи адрес к ссылке', 'Drag an address to a link'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the spot')
  },
  q2: {
    eyebrow: L3('Atribut nima?', 'Что такое атрибут?', 'What is an attribute?'),
    say: L3('Oxirgi savol. Atribut nima?', 'Последний вопрос. Что такое атрибут?', 'Last question. What is an attribute?'),
    // Верный ответ не первый; неверные гаснут после попытки, с объяснением.
    opts: [
      { id: 'tag', t: L3('Havola ichidagi yana bitta teg', 'Ещё один тег внутри ссылки', 'Another tag inside the link'),
        why: L3('Yo‘q: atributning o‘z burchakli qavslari yo‘q. U ochuvchi teg ichida yashaydi.', 'Нет: у атрибута нет своих уголков. Он живёт внутри открывающего тега.', 'No: an attribute has no brackets of its own. It lives inside the opening tag.') },
      { id: 'info', right: true, t: L3('Teg haqida qo‘shimcha ma’lumot', 'Дополнительная информация о теге', 'Extra information about a tag') },
      { id: 'text', t: L3('Sahifada ko‘rinadigan so‘zlar', 'Слова, которые видно на странице', 'The words you see on the page'),
        why: L3('Yo‘q: atribut sahifada ko‘rinmaydi. Faqat teglar orasidagi so‘zlar ko‘rinadi.', 'Нет: атрибут на странице не видно. Видно только слова между тегами.', 'No: you can’t see an attribute on the page. Only the words between the tags show.') }
    ],
    hints: [
      L3('href qayerda yozilganini va u sahifada ko‘rinishini eslang.', 'Вспомни, где пишут href и видно ли его на странице.', 'Remember where href is written and whether it shows on the page.'),
      L3('Atribut ochuvchi teg ichida turadi va tegga nimadir qo‘shadi.', 'Атрибут стоит внутри открывающего тега и что-то добавляет тегу.', 'An attribute sits inside the opening tag and adds something to the tag.'),
      L3('Atribut — teg haqida qo‘shimcha ma’lumot.', 'Атрибут — дополнительная информация о теге.', 'An attribute is extra information about a tag.')
    ],
    ok: L3('To‘g‘ri! Atribut — teg haqida qo‘shimcha ma’lumot. Masalan, href havolaga manzil beradi.', 'Верно! Атрибут — дополнительная информация о теге. Например, href даёт ссылке адрес.', 'Right! An attribute is extra information about a tag. For example, href gives a link its address.'),
    ask: L3('Javobni tanlang', 'Выбери ответ', 'Pick an answer')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang: saytimiz sahifalari bog‘landi!', 'Посмотри: страницы нашего сайта соединены!', 'Look: the pages of our website are connected!'), k: null },
      { text: L3('a tegi havola yasaydi: u boshqa sahifaga eshik.', 'a — ссылка, дверь на другую страницу.', 'The a tag is a link, a door to another page.'), k: 'a' },
      { text: L3('Atribut — teg haqida qo‘shimcha ma’lumot. U ochuvchi tegda yoziladi: nomi, tenglik belgisi va qo‘shtirnoq ichida qiymati.',
        'Атрибут — дополнительная информация о теге. Его пишут в открывающем теге: имя, знак равно и значение в кавычках.',
        'An attribute is extra information about a tag. It goes in the opening tag: a name, an equals sign and a value in quotes.'), k: 'attr' },
      { text: L3('href havolaning asosiy atributi: unda havola olib boradigan sahifa manzili turadi.', 'href — главный атрибут ссылки: адрес страницы, куда она ведёт.', 'href is the main attribute of a link: the address of the page it leads to.'), k: 'href' },
      { text: L3('Tabriklayman! Endi sahifalarni saytga bog‘lay olasiz.', 'Ура! Теперь ты умеешь соединять страницы в сайт.', 'Hooray! Now you can join pages into a website.'), k: null }
    ],
    roles: {
      a: L3('a — havola', 'a — ссылка', 'a — link'),
      attr: L3('atribut — teg haqida qo‘shimcha ma’lumot', 'атрибут — доп. информация о теге', 'attribute — extra info about a tag'),
      href: L3('href — sahifa manzili', 'href — адрес страницы', 'href — page address')
    },
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your website')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { opts: 1, why: 1, magic: 1, sayA: 1, sayText: 1, sayAttr: 1, sayForm: 1, sayHref: 1, msgs: 1, askQ: 1, miss: 1,
  okLink: 1, okText: 1, sayCats: 1, sayDogs: 1, saySwap: 1, parts: 1, tapSay: 1, cards: 1, pickFirst: 1 });
Object.assign(NOT_SPOKEN_IN, { opts: { t: 1, id: 1, right: 1 }, cards: { title: 1 } });
// Теги урока вслух — по-английски во всех языках (заказчик, 17.10.2026).
Object.assign(TAG_SAY.ru, { a: 'A', href: 'H ref' });
Object.assign(TAG_SAY.uz, { a: 'A', href: 'H ref' });
Object.assign(TAG_SAY.en, { a: 'A', href: 'H ref' });

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:ss4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:ss4.css@*/
`;
