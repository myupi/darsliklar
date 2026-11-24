// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 7 — «Navbar и Pagination»
// (облик «Редактор», как уроки 1–6 модуля; 23.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bsnav/build.mjs → lessons/bootstrap/07-navbar-i-pagination.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 7 · «Navbar и Pagination» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (23.11.2026; заказчик: «давай после сетки поставим»). У сайта кружка разделы стоят простым списком ссылок, а новости
// и кнопки страниц — столбиком: на телефоне всё это занимает экран. Ученик ставит Navbar Bootstrap 6 (navbar, container-fluid,
// navbar-brand, nav navbar-nav, nav-item, nav-link, md:navbar-expand — от 768 px строкой, уже — кнопка ☰ и ящик drawer, который
// открывает строка script урока 1), тёмную окраску data-bs-theme="dark", active, и Pagination (pagination, page-item, page-link,
// active у li, justify-content-center у ul). Navbar и Pagination берутся с сайта (Components) и настраиваются под себя.
// В версии 5 — navbar-expand-lg, navbar-dark, bg-dark — одной фразой. Загадка (без имён): Коди думает, что для телефона и
// ноутбука нужны два разных меню; разгадка — один Navbar сам меняется по ширине (md:navbar-expand — та же md из урока 6).
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-07-navbar-i-pagination.md.
//
// СИСТЕМА СЛОВ: navbar, nav-link, pagination, page-item — по-английски; menyu satri — строка меню (Navbar); havola — ссылка;
// bo'lim — раздел; quti (ящик) — drawer; sahifa raqamlari — номера страниц (Pagination); faol — активный.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-07-navbar-i-pagination',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '7-dars. Navbar va Pagination',
    ru: 'Урок 7. Navbar и Pagination',
    en: 'Lesson 7. Navbar and Pagination'
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
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Formalar', 'Формы', 'Forms'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  need: L3('Kerak', 'Нужно', 'Goal'),
  yours: L3('Sizning kodingiz', 'Твой код', 'Your code'),
  phone: L3('Telefon · 360 px', 'Телефон · 360 px', 'Phone · 360 px'),
  tablet: L3('Planshet · 768 px', 'Планшет · 768 px', 'Tablet · 768 px'),
  laptop: L3('Noutbuk · 1024 px', 'Ноутбук · 1024 px', 'Laptop · 1024 px'),
  wide: L3("Ekranga sig'madi", 'Не помещается', 'Doesn’t fit'),
  fit: L3("Sig'di ✓", 'Помещается ✓', 'Fits ✓'),
  inside: L3('Bootstrap ichida', 'Внутри Bootstrap', 'Inside Bootstrap'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
const C = {
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    home: L3('Asosiy', 'Главная', 'Home'),
    courses: L3('Kurslar', 'Курсы', 'Courses'),
    news: L3('Yangiliklar', 'Новости', 'News'),
    contact: L3('Aloqa', 'Контакты', 'Contacts'),
    menuTitle: L3('Menyu', 'Меню', 'Menu'),
    prev: L3('Oldingi', 'Назад', 'Previous'),
    next: L3('Keyingi', 'Вперёд', 'Next'),
    newsPage: L3('Yangiliklar · {n}-sahifa', 'Новости · страница {n}', 'News · page {n}'),
    newsList: [
      L3("Yangi guruhga yozilish boshlandi", 'Открыта запись в новую группу', 'Sign-up for a new group is open'),
      L3("Robotimiz shahar musobaqasida g'olib", 'Наш робот победил на городском турнире', 'Our robot won the city contest'),
      L3("Shanba kuni ochiq dars bo'ladi", 'В субботу — открытый урок', 'An open class on Saturday'),
      L3("To'garakka 3D printer keldi", 'В кружок привезли 3D-принтер', 'The club got a 3D printer'),
      L3("Futbolchi robotlar mashg'ulotda", 'Роботы-футболисты на тренировке', 'Football robots at practice'),
      L3("Ota-onalar uchun ko'rgazma", 'Выставка для родителей', 'An exhibition for parents'),
      L3("Yozgi lager ro'yxati", 'Список летнего лагеря', 'The summer camp list'),
      L3("Yangi robot qismlari keldi", 'Пришли новые детали для роботов', 'New robot parts arrived'),
      L3("Murabbiy bilan uchrashuv", 'Встреча с тренером', 'Meet the coach')
    ]
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga yozing.", 'Впиши в пустое место.', 'Type into the empty spot.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские.', 'Latin letters are needed here. Bootstrap’s words are English.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      native: L3("Bootstrap o'z so'zlarini biladi. Inglizcha so'zni saytdan oling.", 'Bootstrap знает свои слова. Возьми английское слово с сайта.', 'Bootstrap knows its own words. Take the English word from the site.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      typo: L3("Harflarni tekshiring. To'g'risi: {w}.", 'Проверь буквы. Правильно: {w}.', 'Check the letters. It’s spelled {w}.'),
      old: L3("Bu eski nom, beshinchi versiyadan. Oltinchisida: {w}.", 'Это старое имя из пятой версии. В шестой: {w}.', 'That’s an old name from version five. In version six: {w}.'),
      expand: L3("Oltinchi versiyada o'lcham oldinda, ikki nuqta bilan: {w}. Xuddi md:col-4 kabi.", 'В шестой версии размер стоит впереди, через двоеточие: {w}. Как в md:col-4.', 'In version six the size comes first, with a colon: {w}. Just like md:col-4.'),
      fam: L3("{w} boshqa narsa uchun. Bu yerga boshqa so'z kerak.", '{w} — для другой вещи. Сюда нужно другое слово.', '{w} is for something else. This spot needs another word.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas.", 'Bootstrap это слово знает, но результат не как в образце.', 'Bootstrap knows that word, but the result isn’t like the goal.'),
      unknown: L3("Bootstrap bunday so'zni bilmaydi: \u2063{w}\u2064. Shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает такого слова: \u2063{w}\u2064. Поэтому ничего не изменилось.', 'Bootstrap doesn’t know this word: \u2063{w}\u2064. So nothing changed.'),
      theme: L3("data-bs-theme ikki so'zni biladi: dark va light. Qorasi — dark.", 'data-bs-theme знает два слова: dark и light. Тёмная — dark.', 'data-bs-theme knows two words: dark and light. Dark is dark.'),
      light: L3("light — yorug' degani, menyu satri oq bo'lib qoldi. Qorasi kerak.", 'light — значит светлая, строка меню осталась белой. Нужна тёмная.', 'light means light, so the bar stayed white. We need dark.'),
      noHash: L3("id-ga ishora qilganda oldiga panjara qo'yiladi: {w}. Busiz tugma qutini topmaydi.", 'Когда указываешь на id, впереди ставится решётка: {w}. Без неё кнопка не найдёт ящик.', 'Pointing to an id needs a hash in front: {w}. Without it the button won’t find the drawer.'),
      otherId: L3("Bunday id yo'q. Qutining id si dialog qatorida: {w}.", 'Такого id нет. id ящика — в строке dialog: {w}.', 'There’s no such id. The drawer’s id is on the dialog line: {w}.'),
      dotTarget: L3("Nuqta class uchun. id-ga panjara bilan ishora qilinadi: {w}.", 'Точка — для class. На id указывают решёткой: {w}.', 'A dot is for class. An id is pointed to with a hash: {w}.'),
      otherUi: L3("Bu boshqa narsani ochadi. Bu yerga kerakli so'z: {w}.", 'Это слово открывает другую вещь. Сюда нужно: {w}.', 'That word opens something else. This spot needs: {w}.')
    }
  },
  s1: {
    eyebrow: L3("Tor ekran", 'Узкий экран', 'A narrow screen'),
    say: L3("Salom! Bu — to'garak saytining telefondagi ko'rinishi. Bo'limlar havolalari ustma-ust turibdi, sahifa raqamlari ham ro'yxat bo'lib ketgan. Yangiliklarga yetish uchun ancha pastga tushish kerak. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Это сайт кружка на телефоне. Ссылки разделов стоят столбиком, номера страниц тоже превратились в список. До новостей надо долго листать. Нажми «С Bootstrap».',
      'Hi! This is the club site on a phone. The section links are stacked, and the page numbers turned into a list too. You have to scroll a lot to reach the news. Tap “With Bootstrap”.'),
    magic: L3("Voy! Tepada qora menyu satri, havolalar esa ☰ tugmasi ichida. Pastda sahifa raqamlari chiroyli bir qatorda.",
      'Ого! Сверху тёмная строка меню, а ссылки спрятались в кнопку ☰. Внизу номера страниц аккуратно в один ряд.',
      'Whoa! A dark menu bar on top, and the links hid inside the ☰ button. At the bottom the page numbers sit neatly in one row.'),
    done: L3("Bugun menyu satri va sahifa raqamlarini yasaymiz. Lekin oldin topishmoq. Telefonda ☰ tugmasi, noutbukda esa havolalar qatori. Menimcha, buning uchun ikki xil menyu yozish kerak: biri telefonga, biri noutbukka. Siz nima deb o'ylaysiz? Javobni dars oxirida topamiz.",
      'Сегодня делаем строку меню и номера страниц. Но сначала загадка. На телефоне кнопка ☰, а на ноутбуке ряд ссылок. По-моему, для этого нужно написать два разных меню: одно для телефона, другое для ноутбука. Как думаешь? Ответ найдём в конце урока.',
      'Today we make a menu bar and page numbers. But first, a riddle. A phone shows a ☰ button, a laptop shows a row of links. I think that needs two different menus: one for the phone, one for the laptop. What do you think? We’ll find out at the end.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('Navbar · Pagination', 'Navbar · Pagination', 'Navbar · Pagination')
  },
  s2: {
    eyebrow: L3('Menyu satri', 'Строка меню', 'The menu bar'),
    help: [
      L3("Kodda nav tegiga, keyin navbar, navbar-brand va nav-link so'zlariga qarang.", 'Посмотри на тег nav, потом на слова navbar, navbar-brand и nav-link.', 'Look at the nav tag, then the words navbar, navbar-brand and nav-link.'),
      L3("navbar — butun satr, navbar-brand — saytning nomi, nav-link — har bir havola. md:navbar-expand esa 768 pikseldan keng ekranda havolalarni qatorga qo'yadi.", 'navbar — вся строка, navbar-brand — название сайта, nav-link — каждая ссылка. А md:navbar-expand ставит ссылки в ряд на экране шире 768 пикселей.', 'navbar is the whole bar, navbar-brand the site name, nav-link each link. md:navbar-expand puts the links in a row on screens wider than 768 pixels.'),
      L3("Bu do'konning peshtaxtasiga o'xshaydi: tepada nomi, yonida bo'limlar yozuvlari.", 'Это как вывеска магазина: сверху название, рядом таблички отделов.', 'It’s like a shop sign: the name on top and the department signs next to it.')
    ],
    say: L3("Menyu satri qanday yig'ilishini ko'ramiz. Hozir bu planshet, kengligi 768 piksel. Havolalar oddiy ro'yxat. Qarang.", 'Посмотрим, как собирается строка меню. Сейчас это планшет, ширина 768 пикселей. Ссылки — простой список. Смотри.', 'Let’s see how a menu bar is built. This is a tablet, 768 pixels wide. The links are a plain list. Watch.'),
    sayBar: L3("nav tegiga navbar, ichidagi div tegiga container-fluid yozdim. Satr paydo bo'ldi, u butun kenglikni egalladi.", 'Тегу nav написал navbar, а div внутри — container-fluid. Появилась строка на всю ширину.', 'I gave the nav tag navbar and the div inside container-fluid. A bar appeared across the whole width.'),
    sayBrand: L3("Sayt nomiga navbar-brand yozdim. Nom kattaroq va qalinroq bo'ldi, xuddi logotipdek.", 'Названию сайта написал navbar-brand. Название стало крупнее и жирнее, как логотип.', 'I gave the site name navbar-brand. It got bigger and bolder, like a logo.'),
    sayLinks: L3("Ro'yxatga nav navbar-nav, bandlarga nav-item, havolalarga nav-link yozdim. nav tegiga esa md:navbar-expand. Havolalar qatorga turdi!", 'Списку написал nav navbar-nav, пунктам — nav-item, ссылкам — nav-link. А тегу nav — md:navbar-expand. Ссылки встали в ряд!', 'I gave the list nav navbar-nav, the items nav-item, the links nav-link. And the nav tag md:navbar-expand. The links stood in a row!'),
    done: L3("Eslab qoling: navbar — satr, navbar-brand — nom, nav-link — havola, md:navbar-expand — keng ekranda qator.", 'Запомни: navbar — строка, navbar-brand — название, nav-link — ссылка, md:navbar-expand — ряд на широком экране.', 'Remember: navbar is the bar, navbar-brand the name, nav-link a link, md:navbar-expand a row on wide screens.'),
    askStart: L3("Qarang: oddiy ro'yxat", 'Смотри: простой список', 'Watch: a plain list'),
    askBar: L3('Qarang: navbar', 'Смотри: navbar', 'Watch: navbar'),
    askBrand: L3('Qarang: navbar-brand', 'Смотри: navbar-brand', 'Watch: navbar-brand'),
    askLinks: L3('Qarang: nav-link', 'Смотри: nav-link', 'Watch: nav-link'),
    askDone: L3('navbar · navbar-brand · nav-link', 'navbar · navbar-brand · nav-link', 'navbar · navbar-brand · nav-link')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz. Ekran kengligini almashtiring: telefon, planshet va noutbuk. Menyu satri qanday o'zgarishini kuzating.", 'Теперь сам. Переключай ширину экрана: телефон, планшет и ноутбук. Следи, как меняется строка меню.', 'Now you. Switch the screen width: phone, tablet and laptop. Watch how the menu bar changes.'),
    w: {
      360: L3("Telefonda havolalar yashirindi, o'rniga ☰ tugmasi.", 'На телефоне ссылки спрятались, вместо них кнопка ☰.', 'On a phone the links hid, and a ☰ button took their place.'),
      768: L3("Planshetda 768 piksel, havolalar qatorga chiqdi.", 'На планшете 768 пикселей — ссылки вышли в ряд.', 'A tablet is 768 pixels: the links came out in a row.'),
      1024: L3("Noutbukda ham qator, joy esa ko'proq.", 'На ноутбуке тоже ряд, а места больше.', 'A laptop has a row too, with more room.')
    },
    more: L3("Boshqa kenglikni ham tanlang.", 'Выбери и другую ширину.', 'Pick another width too.'),
    ok: L3("Ajoyib! Bitta kod, lekin ekranga qarab o'zgaradi.", 'Отлично! Код один, а меняется по ширине экрана.', 'Great! One code, but it changes with the screen width.'),
    done: L3("Endi ☰ tugmasini ishlatamiz.", 'Теперь заставим работать кнопку ☰.', 'Now let’s make the ☰ button work.'),
    hints: [
      L3("Pastdagi Telefon tugmasini bosing.", 'Нажми кнопку «Телефон» внизу.', 'Tap the Phone button below.'),
      L3("Keyin Planshet va Noutbukni bosing.", 'Потом нажми «Планшет» и «Ноутбук».', 'Then tap Tablet and Laptop.'),
      L3("Uch tugmaning hammasini bosing.", 'Нажми все три кнопки.', 'Tap all three buttons.')
    ],
    ask: L3("Uchta kenglikni ko'ring", 'Посмотри три ширины', 'See all three widths'),
    askDone: L3("Bitta kod — uch ekran", 'Один код — три экрана', 'One code, three screens')
  },
  s4: {
    eyebrow: L3('☰ va quti', '☰ и ящик', '☰ and the drawer'),
    help: [
      L3("☰ tugmasidagi data-bs-toggle va data-bs-target-ga, keyin dialog qatoriga va pastdagi script qatoriga qarang.", 'Посмотри на data-bs-toggle и data-bs-target у кнопки ☰, потом на строку dialog и на script внизу.', 'Look at data-bs-toggle and data-bs-target on ☰, then the dialog line and the script at the bottom.'),
      L3("Havolalar dialog ichida, ya'ni yashirin quti, inglizchasi drawer. Tugmada data-bs-toggle drawer va panjara bilan id bo'lsa, Bootstrap skripti qutini yon tomondan chiqaradi.", 'Ссылки лежат в dialog, то есть в спрятанном ящике, по-английски drawer. Если у кнопки data-bs-toggle drawer и решётка с id, скрипт Bootstrap выдвигает ящик сбоку.', 'The links sit in a dialog, a hidden drawer. If the button has data-bs-toggle drawer and a hash with the id, Bootstrap’s script slides the drawer in from the side.'),
      L3("Bu shkaf tortmasiga o'xshaydi: kerak bo'lsa tortib chiqarasiz, keyin yopasiz.", 'Это как ящик шкафа: нужно — выдвинул, потом задвинул.', 'It’s like a cabinet drawer: pull it out when needed, then push it back.')
    ],
    say: L3("Telefonda havolalar ☰ tugmasi ortida. Ular qayerda turibdi va qanday chiqadi? Qarang.", 'На телефоне ссылки за кнопкой ☰. Где они лежат и как появляются? Смотри.', 'On a phone the links are behind ☰. Where are they and how do they appear? Watch.'),
    sayDead: L3("☰ ni bosdim, hech narsa bo'lmadi. Kod oxirida script qatori yo'q.", 'Нажал ☰ — ничего. В конце кода нет строки script.', 'I tapped ☰ and nothing happened. There’s no script line at the end.'),
    sayOpen: L3("Birinchi darsdagi script qatorini qo'ydim va ☰ ni bosdim. Quti o'ngdan chiqdi, havolalar ichida!", 'Поставил строку script из первого урока и нажал ☰. Ящик выехал справа, ссылки внутри!', 'I added the script line from lesson one and tapped ☰. The drawer slid in from the right with the links inside!'),
    sayClose: L3("Krestikni bosdim, quti yopildi. Krestikda data-bs-dismiss drawer yozilgan.", 'Нажал крестик — ящик закрылся. У крестика data-bs-dismiss drawer.', 'I tapped the cross and the drawer closed. The cross has data-bs-dismiss drawer.'),
    done: L3("Eslab qoling: ☰ tugmasiga data-bs-toggle drawer va data-bs-target, quti ishlashi uchun esa script qatori kerak.", 'Запомни: у ☰ — data-bs-toggle drawer и data-bs-target, а чтобы ящик работал, нужна строка script.', 'Remember: ☰ gets data-bs-toggle drawer and data-bs-target, and the drawer needs the script line to work.'),
    askStart: L3('Qarang: ☰ tugmasi', 'Смотри: кнопка ☰', 'Watch: the ☰ button'),
    askDead: L3('Qarang: tugma ishlamadi', 'Смотри: кнопка молчит', 'Watch: the button is dead'),
    askOpen: L3('Qarang: quti chiqdi', 'Смотри: ящик выехал', 'Watch: the drawer slid out'),
    askClose: L3('Qarang: data-bs-dismiss', 'Смотри: data-bs-dismiss', 'Watch: data-bs-dismiss'),
    askDone: L3('data-bs-toggle drawer · script', 'data-bs-toggle drawer · script', 'data-bs-toggle drawer · script')
  },
  g1: {
    eyebrow: L3('Navbar sahifasi', 'Страница Navbar', 'The Navbar page'),
    help: [
      L3("Menyudagi Components bo'limiga, Navbar sahifasiga va nusxa olish belgisiga qarang.", 'Посмотри на раздел Components, страницу Navbar и значок копирования.', 'Look at Components, the Navbar page and the copy icon.'),
      L3("Misolda ortiqcha narsalar ham bor: Menu bandi va qidiruv formasi. Ularni o'chirib, nom va havolalarni o'zimiznikiga almashtiramiz.", 'В примере есть лишнее: пункт Menu и форма поиска. Убираем их, а название и ссылки меняем на свои.', 'The example has extras: a Menu item and a search form. We remove them and change the name and links to ours.'),
      L3("Bu tayyor ko'ylakka o'xshaydi: o'lchamingizga moslab tikasiz.", 'Это как готовая рубашка: подшиваешь под свой размер.', 'It’s like a ready-made shirt: you tailor it to your size.')
    ],
    say: L3("Menyu satrini saytdan olamiz. U Components bo'limida. Qarang.", 'Строку меню возьмём с сайта. Она в разделе Components. Смотри.', 'Let’s take the menu bar from the site. It’s in Components. Watch.'),
    sayPage: L3("Navbar sahifasi. Example misolida hammasi bor: nom, ☰ tugmasi, quti va havolalar. Nusxa olamiz.", 'Страница Navbar. В примере Example есть всё: название, кнопка ☰, ящик и ссылки. Копируем.', 'The Navbar page. The Example has it all: a name, the ☰ button, the drawer and links. Let’s copy it.'),
    sayPaste: L3("Kodni body ichiga qo'ydim. Unda Menu bandi va qidiruv formasi ham bor. Ular bizga hozir kerak emas.", 'Вставил код в body. Там есть ещё пункт Menu и форма поиска. Они нам пока не нужны.', 'I pasted the code into body. It also has a Menu item and a search form. We don’t need them now.'),
    sayTrim: L3("Menu bandi va qidiruv formasi qatorlarini o'chirdim.", 'Удалил строки с пунктом Menu и формой поиска.', 'I deleted the Menu item and search form lines.'),
    sayText: L3("Navbar so'zini o'rniga Robot to'garagi deb yozdim, havolalarni ham o'zimiznikiga almashtirdim.", 'Вместо слова Navbar написал «Кружок роботов», а ссылки поменял на свои.', 'I replaced the word Navbar with Robot club and changed the links to ours.'),
    sayOpen: L3("Telefonda ☰ ni bosdim, quti chiqdi, ichida bizning havolalar!", 'На телефоне нажал ☰ — ящик выехал, внутри наши ссылки!', 'On the phone I tapped ☰: the drawer slid out with our links inside!'),
    done: L3("Eslab qoling: menyu satri Components bo'limida, Navbar sahifasida.", 'Запомни: строка меню — в разделе Components, на странице Navbar.', 'Remember: the menu bar is in Components, on the Navbar page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Navbar', 'Смотри: Components → Navbar', 'Watch: Components → Navbar'),
    askPage: L3('Qarang: Example', 'Смотри: Example', 'Watch: Example'),
    askPaste: L3("Qarang: body ichiga qo'yildi", 'Смотри: вставлено в body', 'Watch: pasted into body'),
    askTrim: L3("Qarang: ortiqchasi o'chirildi", 'Смотри: лишнее удалено', 'Watch: the extras removed'),
    askText: L3("Qarang: o'z yozuvlarimiz", 'Смотри: свои надписи', 'Watch: our own labels'),
    askOpen: L3("Qarang: quti chiqdi", 'Смотри: ящик выехал', 'Watch: the drawer slid out'),
    askDone: L3('Components → Navbar', 'Components → Navbar', 'Components → Navbar')
  },
  t1: {
    eyebrow: L3("Menyu satrini yig'ing", 'Собери строку меню', 'Build the menu bar'),
    say: L3("Endi o'zingiz. Kodga qarang va bo'sh joyga kerakli so'zni yozing. Natija planshet ekranida chiqadi.", 'Теперь сам. Посмотри на код и впиши в пустое место нужное слово. Результат — на экране планшета.', 'Now you. Look at the code and type the right word into the empty spot. The result shows on a tablet screen.'),
    ask1: L3("Sayt nomi logotipdek katta bo'lsin", 'Название сайта — крупно, как логотип', 'Make the site name big, like a logo'),
    ask2: L3("Yangiliklar havolasi boshqalardek bo'lsin", 'Ссылка «Новости» — как остальные', 'Make the News link like the others'),
    ask3: L3("Planshetda havolalar qatorda tursin", 'На планшете ссылки стоят в ряд', 'Put the links in a row on the tablet'),
    hints1: [
      L3("Nom uchun so'z navbar bilan boshlanadi.", 'Слово для названия начинается с navbar.', 'The word for the name starts with navbar.'),
      L3("navbar va brand, ya'ni brend, nom degani.", 'navbar и brand, то есть бренд, название.', 'navbar and brand.'),
      L3("Yozing: navbar-brand", 'Впиши: navbar-brand', 'Type: navbar-brand')
    ],
    hints2: [
      L3("Qolgan havolalarda qaysi so'z bor?", 'Какое слово у других ссылок?', 'Which word do the other links have?'),
      L3("nav va link, ya'ni havola degani.", 'nav и link, то есть ссылка.', 'nav and link.'),
      L3("Yozing: nav-link", 'Впиши: nav-link', 'Type: nav-link')
    ],
    hints3: [
      L3("Qaysi so'z keng ekranda havolalarni qatorga qo'yadi?", 'Какое слово ставит ссылки в ряд на широком экране?', 'Which word puts the links in a row on a wide screen?'),
      L3("O'lcham md, ikki nuqta, keyin navbar-expand. Xuddi md:col-4 kabi.", 'Размер md, двоеточие, потом navbar-expand. Как в md:col-4.', 'The size md, a colon, then navbar-expand. Like md:col-4.'),
      L3("Yozing: md:navbar-expand", 'Впиши: md:navbar-expand', 'Type: md:navbar-expand')
    ],
    why1: L3("navbar-brand nomni katta va qalin qildi.", 'navbar-brand сделал название крупным и жирным.', 'navbar-brand made the name big and bold.'),
    why2: L3("nav-link Yangiliklar havolasini ham boshqalardek menyu havolasi qildi.", 'nav-link сделал ссылку «Новости» такой же ссылкой меню, как остальные.', 'nav-link made the News link a menu link like the others.'),
    why3: L3("md:navbar-expand 768 pikseldan keng ekranda havolalarni qatorga qo'ydi.", 'md:navbar-expand поставил ссылки в ряд на экране шире 768 пикселей.', 'md:navbar-expand put the links in a row on screens wider than 768 pixels.'),
    done: L3("Qoyil! Menyu satri tayyor.", 'Класс! Строка меню готова.', 'Nice! The menu bar is ready.')
  },
  s7: {
    eyebrow: L3('Rang va faol havola', 'Цвет и активная ссылка', 'Color and the active link'),
    help: [
      L3("nav tegidagi data-bs-theme va bg so'zlariga, keyin birinchi havoladagi active so'ziga qarang.", 'Посмотри на data-bs-theme и bg у тега nav, потом на active у первой ссылки.', 'Look at data-bs-theme and bg on the nav tag, then active on the first link.'),
      L3("data-bs-theme dark menyu satrini qora qiladi, ya'ni yozuvlar oq bo'ladi. bg-primary fonni ko'k qiladi. active esa hozir ochiq bo'lgan sahifa havolasini ajratadi.", 'data-bs-theme dark делает строку меню тёмной, то есть надписи становятся светлыми. bg-primary красит фон в синий. А active выделяет ссылку открытой сейчас страницы.', 'data-bs-theme dark makes the bar dark, so the labels turn light. bg-primary paints the background blue. active marks the link of the page you’re on.'),
      L3("active — xaritadagi «siz shu yerdasiz» belgisi.", 'active — как метка «ты здесь» на карте.', 'active is like the “you are here” mark on a map.')
    ],
    say: L3("Menyu satrini bo'yaymiz. Hozir u och rangli. Qarang.", 'Покрасим строку меню. Сейчас она светлая. Смотри.', 'Let’s color the menu bar. Right now it’s light. Watch.'),
    sayDark: L3("nav tegiga data-bs-theme dark yozdim. Satr qora bo'ldi, yozuvlar oqardi.", 'Тегу nav написал data-bs-theme dark. Строка стала тёмной, надписи — светлыми.', 'I gave the nav tag data-bs-theme dark. The bar turned dark and the labels light.'),
    sayBlue: L3("bg-1 o'rniga bg-primary yozdim, satr ko'k bo'ldi. Ikkinchi darsdagi bg so'zlari bu yerda ham ishlaydi.", 'Вместо bg-1 написал bg-primary — строка стала синей. Слова bg из второго урока работают и здесь.', 'I wrote bg-primary instead of bg-1, and the bar turned blue. The bg words from lesson two work here too.'),
    sayActive: L3("Asosiy havolasiga active qo'shdim. U yorqinroq bo'ldi: ko'rib turgan sahifamiz shu.", 'Ссылке «Главная» добавил active. Она стала ярче: это страница, на которой мы сейчас.', 'I added active to the Home link. It got brighter: that’s the page we’re on.'),
    done: L3("Eslab qoling: data-bs-theme dark — qora satr, active — hozirgi sahifa. Eski darslarda navbar-dark deb yozilgan.", 'Запомни: data-bs-theme dark — тёмная строка, active — текущая страница. В старых уроках пишут navbar-dark.', 'Remember: data-bs-theme dark makes a dark bar, active marks the current page. Old tutorials use navbar-dark.'),
    askStart: L3('Qarang: och satr', 'Смотри: светлая строка', 'Watch: a light bar'),
    askDark: L3('Qarang: data-bs-theme dark', 'Смотри: data-bs-theme dark', 'Watch: data-bs-theme dark'),
    askBlue: L3('Qarang: bg-primary', 'Смотри: bg-primary', 'Watch: bg-primary'),
    askActive: L3('Qarang: active', 'Смотри: active', 'Watch: active'),
    askDone: L3('data-bs-theme dark · active', 'data-bs-theme dark · active', 'data-bs-theme dark · active')
  },
  t2: {
    eyebrow: L3('Satrni sozlang', 'Настрой строку', 'Set up the bar'),
    say: L3("Kodga qarang va bo'sh joyga kerakli so'zni yozing. Keyin sahifada tekshiring.", 'Посмотри на код и впиши в пустое место нужное слово. Потом проверь на странице.', 'Look at the code and type the right word into the empty spot. Then check the page.'),
    ask1: L3("Menyu satri qora bo'lsin", 'Строка меню — тёмная', 'Make the menu bar dark'),
    ask2: L3("Kurslar havolasi faol bo'lsin", 'Ссылка «Курсы» — активная', 'Make the Courses link active'),
    ask3: L3("Telefonda ☰ qutini topsin", 'На телефоне ☰ находит ящик', 'On the phone, make ☰ find the drawer'),
    hints1: [
      L3("data-bs-theme qaysi so'zni kutadi?", 'Какое слово ждёт data-bs-theme?', 'Which word does data-bs-theme expect?'),
      L3("Ikki so'z bor: dark va light. Qorasi — dark.", 'Есть два слова: dark и light. Тёмная — dark.', 'There are two words: dark and light. Dark is dark.'),
      L3("Yozing: dark", 'Впиши: dark', 'Type: dark')
    ],
    hints2: [
      L3("Ochiq sahifa havolasiga qaysi so'z qo'shiladi?", 'Какое слово добавляют ссылке открытой страницы?', 'Which word is added to the open page’s link?'),
      L3("Faol so'zi inglizchada active bo'ladi.", 'По-английски «активный» — active.', 'Active in English is active.'),
      L3("Yozing: active", 'Впиши: active', 'Type: active')
    ],
    hints3: [
      L3("Qutining id si qanday? dialog qatoriga qarang.", 'Какой id у ящика? Посмотри строку dialog.', 'What’s the drawer’s id? Look at the dialog line.'),
      L3("Panjara va id: #menyu.", 'Решётка и id: #menyu.', 'A hash and the id: #menyu.'),
      L3("Yozing: #menyu", 'Впиши: #menyu', 'Type: #menyu')
    ],
    why1: L3("dark menyu satrini qora qildi.", 'dark сделал строку меню тёмной.', 'dark made the menu bar dark.'),
    why2: L3("active Kurslar havolasini ajratib qo'ydi.", 'active выделил ссылку «Курсы».', 'active marked the Courses link.'),
    why3: L3("#menyu tugmaga qutini ko'rsatdi. Endi ☰ ni bosib ko'ring.", '#menyu показал кнопке ящик. Теперь нажми ☰.', '#menyu pointed the button at the drawer. Now tap ☰.'),
    done: L3("Zo'r! Satr qora, faol havola bor, ☰ esa ishlaydi.", 'Огонь! Строка тёмная, активная ссылка есть, а ☰ работает.', 'Awesome! The bar is dark, there’s an active link, and ☰ works.')
  },
  t3: {
    eyebrow: L3("Tartib bilan yig'ing", 'Собери по порядку', 'Build in order'),
    say: L3("Menyu satri kodini tartib bilan yig'ing: tashqarida nav, ichida konteyner, keyin nom, ☰ tugmasi va havolalar qutisi. Oxirida teglarni yoping.", 'Собери код строки меню по порядку: снаружи nav, внутри контейнер, потом название, кнопка ☰ и ящик со ссылками. В конце закрой теги.', 'Build the menu bar code in order: nav outside, the container inside, then the name, the ☰ button and the drawer with links. Close the tags at the end.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order'),
    msgs: {
      nav: L3("Oldin eng tashqi qism: nav.", 'Сначала самая внешняя часть: nav.', 'First the outermost part: nav.'),
      cf: L3("nav ichida konteyner: container-fluid.", 'Внутри nav — контейнер: container-fluid.', 'Inside nav comes the container: container-fluid.'),
      brand: L3("Konteyner ichida oldin sayt nomi.", 'В контейнере сначала название сайта.', 'Inside the container, the site name comes first.'),
      tog: L3("Nomdan keyin ☰ tugmasi.", 'После названия — кнопка ☰.', 'After the name comes the ☰ button.'),
      drw: L3("Keyin havolalar qutisi: dialog.", 'Потом ящик со ссылками: dialog.', 'Then the drawer with the links: dialog.'),
      cfc: L3("Endi konteynerni yopamiz.", 'Теперь закрываем контейнер.', 'Now close the container.'),
      navc: L3("Oxirida nav-ni yopamiz.", 'В конце закрываем nav.', 'Last, close nav.')
    },
    hints: [
      L3("nav-dan boshlang.", 'Начни с nav.', 'Start with nav.'),
      L3("Tartib: nav, container-fluid, nom, ☰, quti, yopish.", 'Порядок: nav, container-fluid, название, ☰, ящик, закрытие.', 'The order: nav, container-fluid, name, ☰, drawer, closing.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! Menyu satri tartib bilan yig'ildi.", 'В точку! Строка меню собрана по порядку.', 'Spot on! The menu bar is built in order.')
  },
  s10: {
    eyebrow: L3('Sahifa raqamlari', 'Номера страниц', 'Page numbers'),
    help: [
      L3("Kodda pagination, page-item va page-link so'zlariga, keyin active va justify-content-center-ga qarang.", 'Посмотри на слова pagination, page-item и page-link, потом на active и justify-content-center.', 'Look at pagination, page-item and page-link, then active and justify-content-center.'),
      L3("Yangiliklar ko'p bo'lsa, ularni sahifalarga bo'lamiz. pagination — raqamlar qatori, page-item — har bir raqam qutisi, page-link — bosiladigan raqam. active ochiq sahifani bo'yaydi.", 'Когда новостей много, их делят на страницы. pagination — ряд номеров, page-item — ячейка номера, page-link — номер, на который нажимают. active красит открытую страницу.', 'When there’s lots of news, we split it into pages. pagination is the row of numbers, page-item each number’s box, page-link the clickable number. active colors the open page.'),
      L3("Bu kitob sahifalariga o'xshaydi: pastda raqam, kerakli sahifani ochasiz.", 'Это как страницы в книге: внизу номер, открываешь нужную.', 'It’s like book pages: a number at the bottom, and you open the one you need.')
    ],
    say: L3("Endi sahifa raqamlari. Hozir ular oddiy ro'yxat, ustma-ust turibdi. Qarang.", 'Теперь номера страниц. Сейчас это простой список, они стоят друг под другом. Смотри.', 'Now page numbers. Right now they’re a plain list, stacked. Watch.'),
    sayRow: L3("Ro'yxatga pagination, bandlarga page-item, havolalarga page-link yozdim. Raqamlar bir qatorga turdi, har biri tugmachaga o'xshaydi.", 'Списку написал pagination, пунктам — page-item, ссылкам — page-link. Номера встали в ряд, каждый похож на кнопочку.', 'I gave the list pagination, the items page-item, the links page-link. The numbers stood in a row, each like a little button.'),
    sayActive: L3("Birinchi raqam bandiga active qo'shdim. U ko'k bo'ldi: biz birinchi sahifadamiz.", 'Пункту с номером 1 добавил active. Он стал синим: мы на первой странице.', 'I added active to the first number’s item. It turned blue: we’re on page one.'),
    sayCenter: L3("Ro'yxatga justify-content-center qo'shdim. Raqamlar o'rtaga keldi. Bu so'z to'rtinchi darsdan tanish.", 'Списку добавил justify-content-center. Номера встали посередине. Это слово знакомо по четвёртому уроку.', 'I added justify-content-center to the list. The numbers moved to the middle. You know this word from lesson four.'),
    done: L3("Eslab qoling: pagination — qator, page-item — band, page-link — raqam, active — ochiq sahifa.", 'Запомни: pagination — ряд, page-item — пункт, page-link — номер, active — открытая страница.', 'Remember: pagination is the row, page-item an item, page-link a number, active the open page.'),
    askStart: L3("Qarang: oddiy ro'yxat", 'Смотри: простой список', 'Watch: a plain list'),
    askRow: L3('Qarang: pagination', 'Смотри: pagination', 'Watch: pagination'),
    askActive: L3('Qarang: active', 'Смотри: active', 'Watch: active'),
    askCenter: L3("Qarang: o'rtada", 'Смотри: посередине', 'Watch: centered'),
    askDone: L3('pagination · page-item · page-link', 'pagination · page-item · page-link', 'pagination · page-item · page-link')
  },
  g2: {
    eyebrow: L3('Pagination sahifasi', 'Страница Pagination', 'The Pagination page'),
    help: [
      L3("Components bo'limidagi Pagination sahifasiga, Overview misoliga va Alignment bo'limiga qarang.", 'Посмотри на страницу Pagination в Components, пример Overview и раздел Alignment.', 'Look at the Pagination page in Components, the Overview example and the Alignment section.'),
      L3("Misoldagi Previous va Next so'zlarini o'zimiznikiga almashtiramiz. O'rtaga qo'yish so'zi esa Alignment bo'limida.", 'Слова Previous и Next в примере меняем на свои. А слово для выравнивания посередине — в разделе Alignment.', 'We change Previous and Next to our words. The centering word is in the Alignment section.'),
      L3("Bu retseptga o'xshaydi: asosini olasiz, ziravorni didingizga qo'shasiz.", 'Это как рецепт: берёшь основу, а специи добавляешь по вкусу.', 'It’s like a recipe: take the base and add spices to taste.')
    ],
    say: L3("Sahifa raqamlarini ham saytdan olamiz. Qarang.", 'Номера страниц тоже возьмём с сайта. Смотри.', 'Let’s take the page numbers from the site too. Watch.'),
    sayPage: L3("Pagination sahifasi. Overview misoli: Previous, uchta raqam va Next. Nusxa olamiz.", 'Страница Pagination. Пример Overview: Previous, три номера и Next. Копируем.', 'The Pagination page. The Overview example: Previous, three numbers and Next. Let’s copy it.'),
    sayPaste: L3("Kodni yangiliklar ostiga qo'ydim. Yozuvlar inglizcha: Previous va Next.", 'Вставил код под новостями. Надписи английские: Previous и Next.', 'I pasted the code under the news. The labels are English: Previous and Next.'),
    sayText: L3("Ularni Oldingi va Keyingi deb almashtirdim.", 'Поменял их на «Назад» и «Вперёд».', 'I changed them to Previous and Next in our words.'),
    sayAlign: L3("Alignment bo'limidan justify-content-center so'zini oldim va ul tegiga qo'ydim. Raqamlar o'rtada!", 'Из раздела Alignment взял слово justify-content-center и поставил в ul. Номера посередине!', 'From Alignment I took justify-content-center and put it on the ul. The numbers are centered!'),
    done: L3("Eslab qoling: sahifa raqamlari Components bo'limida, Pagination sahifasida.", 'Запомни: номера страниц — в разделе Components, на странице Pagination.', 'Remember: page numbers are in Components, on the Pagination page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Pagination', 'Смотри: Components → Pagination', 'Watch: Components → Pagination'),
    askPage: L3('Qarang: Overview', 'Смотри: Overview', 'Watch: Overview'),
    askPaste: L3("Qarang: qo'yildi", 'Смотри: вставлено', 'Watch: pasted'),
    askText: L3("Qarang: o'z yozuvlarimiz", 'Смотри: свои надписи', 'Watch: our own labels'),
    askAlign: L3('Qarang: Alignment', 'Смотри: Alignment', 'Watch: Alignment'),
    askDone: L3('Components → Pagination', 'Components → Pagination', 'Components → Pagination')
  },
  x3: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz. Sahifadagi 2 va 3 raqamlarini bosing va yangiliklar qanday almashishini ko'ring.", 'Теперь сам. Нажми на странице номера 2 и 3 и посмотри, как меняются новости.', 'Now you. Tap the numbers 2 and 3 on the page and watch the news change.'),
    page: L3("{n}-sahifa ochildi, active ham unga o'tdi.", 'Открылась страница {n}, и active перешёл на неё.', 'Page {n} opened, and active moved to it.'),
    same: L3("Bu sahifa ochiq. Boshqasini bosing.", 'Эта страница уже открыта. Нажми другую.', 'This page is already open. Tap another.'),
    more: L3("Endi boshqa raqamni bosing.", 'Теперь нажми другой номер.', 'Now tap another number.'),
    ok: L3("Ajoyib! Har bir raqam saytning boshqa sahifasini ochadi.", 'Отлично! Каждый номер открывает другую страницу сайта.', 'Great! Each number opens another page of the site.'),
    done: L3("Endi sahifa raqamlarini o'zingiz yig'asiz.", 'Теперь соберёшь номера страниц сам.', 'Now you’ll build the page numbers yourself.'),
    hints: [
      L3("Pastdagi 2 raqamini bosing.", 'Нажми номер 2 внизу.', 'Tap the number 2 at the bottom.'),
      L3("Keyin 3 raqamini bosing.", 'Потом нажми 3.', 'Then tap 3.'),
      L3("Keyingi tugmasi ham sahifani almashtiradi.", 'Кнопка «Вперёд» тоже листает страницы.', 'The Next button turns pages too.')
    ],
    ask: L3("2 va 3-sahifalarni oching", 'Открой страницы 2 и 3', 'Open pages 2 and 3'),
    askDone: L3("Sahifalar almashadi", 'Страницы листаются', 'The pages switch')
  },
  t4: {
    eyebrow: L3("Raqamlarni yig'ing", 'Собери номера страниц', 'Build the page numbers'),
    say: L3("Kodga qarang va bo'sh joyga kerakli so'zni yozing. Natija pastda, yangiliklar ostida.", 'Посмотри на код и впиши в пустое место нужное слово. Результат внизу, под новостями.', 'Look at the code and type the right word into the empty spot. The result is below the news.'),
    ask1: L3("Raqamlar bir qatorga tursin", 'Номера — в один ряд', 'Put the numbers in one row'),
    ask2: L3("2 raqami ham tugmacha bo'lsin", 'Номер 2 — тоже кнопочка', 'Make the number 2 a little button too'),
    ask3: L3("2-sahifa faol bo'lsin", 'Страница 2 — активная', 'Make page 2 active'),
    ask4: L3("Raqamlar o'rtada tursin", 'Номера — посередине', 'Center the numbers'),
    hints1: [
      L3("Raqamlar qatori qanday ataladi?", 'Как называется ряд номеров?', 'What’s the row of numbers called?'),
      L3("Inglizcha sahifalash: pagination.", 'По-английски — pagination.', 'In English: pagination.'),
      L3("Yozing: pagination", 'Впиши: pagination', 'Type: pagination')
    ],
    hints2: [
      L3("Qolgan raqamlarda a tegida qaysi so'z?", 'Какое слово у тега a других номеров?', 'Which word is on the other numbers’ a tag?'),
      L3("page va link.", 'page и link.', 'page and link.'),
      L3("Yozing: page-link", 'Впиши: page-link', 'Type: page-link')
    ],
    hints3: [
      L3("Ochiq sahifa qanday belgilanadi?", 'Как отмечают открытую страницу?', 'How is the open page marked?'),
      L3("Xuddi Navbar-dagidek: active.", 'Как в Navbar: active.', 'Just like in Navbar: active.'),
      L3("Yozing: active", 'Впиши: active', 'Type: active')
    ],
    hints4: [
      L3("To'rtinchi darsdagi o'rtaga qo'yish so'zini eslang.", 'Вспомни слово выравнивания посередине из четвёртого урока.', 'Remember the centering word from lesson four.'),
      L3("justify-content va center.", 'justify-content и center.', 'justify-content and center.'),
      L3("Yozing: justify-content-center", 'Впиши: justify-content-center', 'Type: justify-content-center')
    ],
    why1: L3("pagination raqamlarni qatorga qo'ydi.", 'pagination поставил номера в ряд.', 'pagination put the numbers in a row.'),
    why2: L3("page-link 2 raqamini tugmacha qildi.", 'page-link сделал номер 2 кнопочкой.', 'page-link made 2 a little button.'),
    why3: L3("active 2-sahifani bo'yadi.", 'active покрасил страницу 2.', 'active colored page 2.'),
    why4: L3("justify-content-center raqamlarni o'rtaga qo'ydi.", 'justify-content-center поставил номера посередине.', 'justify-content-center centered the numbers.'),
    done: L3("Ajoyib! Sahifa raqamlari tayyor.", 'Отлично! Номера страниц готовы.', 'Great! The page numbers are ready.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna. Qaysi class shunday chizadi? Variantni tanlang, natija o'ngda chiqadi.", 'Маленькое испытание. Слева образец. Какой class так рисует? Выбери вариант, результат появится справа.', 'A little test. The goal is on the left. Which class draws it? Pick an option, the result shows on the right.'),
    ask: L3('Qaysi class namunani chizadi?', 'Какой class рисует образец?', 'Which class draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Menyu havolalari: nav-link.", 'Ссылки меню: nav-link.', 'Menu links: nav-link.'),
      L3("Sayt nomi: navbar-brand.", 'Название сайта: navbar-brand.', 'The site name: navbar-brand.'),
      L3("Raqam tugmachalari: page-link.", 'Кнопочки номеров: page-link.', 'Number buttons: page-link.'),
      L3("Ochiq sahifa: active.", 'Открытая страница: active.', 'The open page: active.')
    ],
    no: {
      'navbar-link': L3("Bunday class yo'q: havolalar oddiy ko'k chiziqli bo'lib qoldi.", 'Такого class нет: ссылки остались синими с подчёркиванием.', 'There’s no such class: the links stayed blue and underlined.'),
      link: L3("Oldida nav so'zi kerak: havolalar oddiy bo'lib qoldi.", 'Впереди нужно слово nav: ссылки остались простыми.', 'It needs nav in front: the links stayed plain.'),
      'nav-item': L3("nav-item band uchun, li tegiga. Havolalar oddiy bo'lib qoldi.", 'nav-item — для пункта, тега li. Ссылки остались простыми.', 'nav-item is for the item, the li tag. The links stayed plain.'),
      brand: L3("Oldida navbar so'zi kerak: nom oddiy havola bo'lib qoldi.", 'Впереди нужно слово navbar: название осталось простой ссылкой.', 'It needs navbar in front: the name stayed a plain link.'),
      'navbar-logo': L3("Bunday class yo'q: nom oddiy havola bo'lib qoldi.", 'Такого class нет: название осталось простой ссылкой.', 'There’s no such class: the name stayed a plain link.'),
      'navbar-title': L3("Bunday class yo'q: nom oddiy havola bo'lib qoldi.", 'Такого class нет: название осталось простой ссылкой.', 'There’s no such class: the name stayed a plain link.'),
      'pagination-link': L3("Bunday class yo'q: raqamlar oddiy havola bo'lib qoldi.", 'Такого class нет: номера остались простыми ссылками.', 'There’s no such class: the numbers stayed plain links.'),
      page: L3("Oxirida link kerak: raqamlar oddiy bo'lib qoldi.", 'В конце нужно link: номера остались простыми.', 'It needs link at the end: the numbers stayed plain.'),
      'link-page': L3("So'zlar teskari: to'g'risi page-link.", 'Слова наоборот: правильно page-link.', 'The words are reversed: it’s page-link.'),
      selected: L3("Bunday so'z Bootstrapda yo'q: sahifa bo'yalmadi.", 'Такого слова в Bootstrap нет: страница не покрасилась.', 'Bootstrap has no such word: the page wasn’t colored.'),
      current: L3("Bunday so'z Bootstrapda yo'q: sahifa bo'yalmadi.", 'Такого слова в Bootstrap нет: страница не покрасилась.', 'Bootstrap has no such word: the page wasn’t colored.'),
      disabled: L3("disabled — o'chiq degani: raqam kulrang bo'ldi, bosilmaydi.", 'disabled — значит выключено: номер стал серым и не нажимается.', 'disabled means turned off: the number went gray and can’t be tapped.')
    },
    hint1: L3("Namunaga qarang: bu menyu satrimi yoki sahifa raqamlarimi?", 'Посмотри на образец: это строка меню или номера страниц?', 'Look at the goal: is it the menu bar or page numbers?'),
    hint2: L3("Menyu so'zlari nav bilan, raqamlar page bilan boshlanadi.", 'Слова меню начинаются с nav, номера — с page.', 'Menu words start with nav, numbers with page.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Menyu satri va raqamlar so'zlarini bilasiz.", 'Всё верно! Ты знаешь слова строки меню и номеров страниц.', 'All correct! You know the menu bar and page number words.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta menyu satri buzilgan, har birida sabab boshqa. Sahifada bosib ko'ring, kodga qarang va sababini tanlang.", 'Последнее испытание. Три строки меню сломаны, у каждой своя причина. Понажимай на странице, посмотри на код и выбери причину.', 'The last test. Three menu bars are broken, each for a different reason. Try them on the page, look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    // Строка-симптом своего раунда (как t6 финального урока, tools/bs10): что ученик видит на странице.
    asks: [
      L3("☰ tugmasini bosing: quti ochilmayapti. Nega?", 'Нажми ☰ — ящик не открывается. Почему?', 'Tap ☰: the drawer doesn’t open. Why?'),
      L3("Planshetda havolalar qatorda emas. Nega?", 'На планшете ссылки не в ряд. Почему?', 'On the tablet the links aren’t in a row. Why?'),
      L3("☰ tugmasini bosing: quti ochilmayapti. Nega?", 'Нажми ☰ — ящик не открывается. Почему?', 'Tap ☰: the drawer doesn’t open. Why?')
    ],
    opts: {
      noScript: L3("script qatori yo'q", 'Нет строки script', 'No script line'),
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5'),
      noHash: L3("Panjara # yo'q", 'Нет решётки #', 'No hash #')
    },
    rounds: [
      L3("Kod oxirida script qatori yo'q. Bootstrap skriptisiz ☰ qutini ochmaydi.", 'В конце кода нет строки script. Без скрипта Bootstrap кнопка ☰ не открывает ящик.', 'There’s no script line at the end. Without Bootstrap’s script ☰ won’t open the drawer.'),
      L3("navbar-expand-lg beshinchi versiyaning nomi. Oltinchisida md:navbar-expand, shuning uchun planshetda ham ☰ qoldi.", 'navbar-expand-lg — имя пятой версии. В шестой — md:navbar-expand, поэтому и на планшете осталась ☰.', 'navbar-expand-lg is a version five name. Version six uses md:navbar-expand, so the tablet still shows ☰.'),
      L3("data-bs-target-da panjara yo'q: menyu emas, #menyu bo'lishi kerak.", 'В data-bs-target нет решётки: нужно не menyu, а #menyu.', 'data-bs-target has no hash: it must be #menyu, not menyu.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the site example.'),
    hint2: L3("script qatori bormi? So'z yangi versiyadanmi? # bormi?", 'Есть ли строка script? Слово из новой версии? Есть ли #?', 'Is there a script line? Is the word from the new version? Is there a #?'),
    ok: L3("Hammasi to'g'ri! Endi menyu satri buzilsa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если строка меню сломается, причину найдёшь сам.', 'All correct! Now if a menu bar breaks, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z havolangiz", 'Своя ссылка', 'Your own link'),
    say: L3("Endi menyu satriga o'z havolangizni qo'shing. Nomini o'zingiz o'ylab toping va kerakli class-ni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь добавь в строку меню свою ссылку. Придумай название и впиши нужный class. Потом нажми «Готово».',
      'Now add your own link to the menu bar. Come up with a name and type the right class. Then tap “Done”.'),
    ask: L3("Havola nomi va class-ini yozing", 'Впиши название и class ссылки', 'Type the link name and class'),
    // Строка по шагам: пока название пустое — про название, потом — про class.
    askName: L3("Yangi havolaga nom yozing", 'Впиши название новой ссылки', 'Type a name for the new link'),
    askClass: L3("Endi class yozing", 'Теперь впиши class', 'Now type the class'),
    askText: L3("Havola nomi", 'Название ссылки', 'Link name'),
    askCls: L3('Havolaning class-i', 'class ссылки', 'The link’s class'),
    ph: L3("…", '…', '…'),
    noText: L3("Havola nomi bo'sh. Nom yozing, masalan: Galereya.", 'Название пустое. Напиши его, например: Галерея.', 'The name is empty. Type one, for example: Gallery.'),
    hints: [
      L3("Oldin havola nomini yozing.", 'Сначала впиши название.', 'First type the name.'),
      L3("Boshqa havolalarda qaysi class bor?", 'Какой class у других ссылок?', 'Which class do the other links have?'),
      L3("Yozing: nav-link. Keyin «Tayyor»ni bosing.", 'Впиши: nav-link. Потом нажми «Готово».', 'Type: nav-link. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Menyu satrida sizning havolangiz bor. Telefonda ham, planshetda ham chiqadi.", 'Класс! В строке меню есть твоя ссылка. Она будет и на телефоне, и на планшете.', 'Nice! The menu bar has your link. It shows on both the phone and the tablet.')
  },
  s17: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men telefon va noutbuk uchun ikki xil menyu kerak deb o'ylagandim? Afsuski, adashibman. Menyu bitta. md:navbar-expand uni keng ekranda qatorga qo'yadi, tor ekranda esa havolalar ☰ ortiga yashirinadi.",
        'Вернёмся к загадке. Помнишь, я думал, что для телефона и ноутбука нужны два разных меню? Увы, я ошибся. Меню одно. md:navbar-expand ставит его в ряд на широком экране, а на узком ссылки прячутся за ☰.',
        'Back to our riddle. Remember, I thought a phone and a laptop needed two different menus? Sadly, I was wrong. There’s one menu. md:navbar-expand puts it in a row on wide screens, and on narrow ones the links hide behind ☰.'), k: 'riddle' },
      { text: L3("Qarang, mana sizning saytingiz!", 'Смотри, вот твой сайт!', 'Look, here’s your site!'), k: null },
      { text: L3("Menyu satri: navbar, ichida sayt nomi navbar-brand va havolalar nav-link.", 'Строка меню: navbar, внутри название navbar-brand и ссылки nav-link.', 'The menu bar: navbar, with the name navbar-brand and the links nav-link inside.'), k: 'nav' },
      { text: L3("☰ tugmasi qutini ochadi, buning uchun birinchi darsdagi script qatori kerak.", 'Кнопка ☰ открывает ящик, для этого нужна строка script из первого урока.', 'The ☰ button opens the drawer, and that needs the script line from lesson one.'), k: 'drw' },
      { text: L3("Sahifa raqamlari: pagination, page-item va page-link, ochiq sahifada active.", 'Номера страниц: pagination, page-item и page-link, у открытой страницы — active.', 'Page numbers: pagination, page-item and page-link, with active on the open page.'), k: 'pag' },
      { text: L3("Ikkalasi ham saytda, Components bo'limida.", 'Оба — на сайте, в разделе Components.', 'Both are on the site, in Components.'), k: 'site' },
      { text: L3("Tabriklayman! Siz yettinchi darsni tugatdingiz. Keyingi darsda Bootstrap formalarini yasaymiz. Ko'rishguncha!", 'Ура! Ты прошёл седьмой урок. На следующем уроке соберём формы Bootstrap. До встречи!', 'Hooray! You finished the seventh lesson. Next time we’ll build Bootstrap forms. See you!'), k: null }
    ],
    roles: {
      nav: L3('navbar · navbar-brand · nav-link', 'navbar · navbar-brand · nav-link', 'navbar · navbar-brand · nav-link'),
      drw: L3('md:navbar-expand · ☰ · script', 'md:navbar-expand · ☰ · script', 'md:navbar-expand · ☰ · script'),
      pag: L3('pagination · page-item · page-link', 'pagination · page-item · page-link', 'pagination · page-item · page-link'),
      site: L3("So'zlar — Components bo'limida", 'Слова — в Components', 'Words are in Components')
    },
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, hints4: 1, why: 1, why1: 1, why2: 1, why3: 1, why4: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1, ok: 1, more: 1, same: 1, page: 1, w: 1,
  sayBar: 1, sayBrand: 1, sayLinks: 1, sayDead: 1, sayOpen: 1, sayClose: 1, sayPage: 1, sayPaste: 1, sayTrim: 1, sayText: 1, sayDark: 1, sayBlue: 1, sayActive: 1, sayRow: 1, sayCenter: 1, sayAlign: 1,
  noText: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bsnav-kit.jsx@*/

/*@FILE:bsnav-site.jsx@*/

/*@FILE:bsnav-head.jsx@*/

/*@FILE:bsnav-common.jsx@*/

/*@FILE:bsnav-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:../bs1/bs1.css@*/
/*@FILE:../bs2/bs2.css@*/
/*@FILE:../bs3/bs3.css@*/
/*@FILE:../bs4/bs4.css@*/
/*@FILE:../bs5/bs5.css@*/
/*@FILE:../bs6/bs6.css@*/
/*@FILE:bsnav.css@*/
`;
