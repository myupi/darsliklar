// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 1 — «Введение в Bootstrap»
// (облик «Редактор», как уроки HTML и CSS; заказчик, 19.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs1/build.mjs → lessons/bootstrap/01-vvedenie.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 · «Введение в Bootstrap» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (19.11.2026). HTML, CSS и «ИИ» пройдены. Коди целый вечер писал CSS для красивого объявления на сайте
// кружка роботов — 12 строк; Bootstrap делает то же одной ссылкой и одним class. Ученик узнаёт, что Bootstrap —
// готовый CSS, который написали другие (мы ставим только class nomi); учится не теряться на сайте Bootstrap (меню,
// пример, код, «Copy»), подключать его ссылкой CDN с сайта (link в head, script перед </body>) и настраивать
// скопированный пример под себя: свой текст и цвет theme-* — словом с сайта. Загадка (без имён): Коди уверен, что
// Bootstrap — большая программа, её надо установить; в выводе признаёт ошибку — хватило одной строки-ссылки.
// Решения заказчика 19.11.2026 — CLAUDE.md, «Модуль Bootstrap»: только Bootstrap 6 (getbootstrap.com/docs/6.0,
// 6.0.0-alpha.1), CDN — строкой с сайта целиком, главное — найти на сайте, скопировать и настроить.
//
// ДУГА (18 экранов; экрана плана нет). Сценарий — docs/scenarij-bootstrap-01-vvedenie.md.
//   s1 крючок (12 строк CSS Коди → «Bootstrap bilan» → одна ссылка и class; загадка)
//   что это:   s2 показ (файл bootstrap.min.css, class у div) · s3 выбрать class (Bootstrap знает свои слова) · s4 кто написал строку
//   сайт:      s5 показ (меню, пример, код, Copy) · s6 найти Install · s7 найти Alert (перенос)
//   CDN:       s8 показ (CDN, link в head, script перед </body>, integrity) · s9 показ «как видео»: курсор жмёт Copy, link влетает в head ·
//              s10 показ: крестик не работает → Copy у JS → script перед </body> → крестик закрывает e'lon (заказчик, 19.11.2026:
//              «где берут ссылку — прям как на видео показать, а не у ученика спрашивать») · s11 найти сломанную ссылку
//   нусха:     s12 показ (скопировать, свой текст, theme-warning) · s13 скопировать пример · s14 свой текст · s15 зелёный (theme-success из Variants)
//   итог:      q1 верно или нет · w1 своё e'lon (текст и цвет) · s16 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честная страница: iframe без скриптов, в нём настоящий bootstrap.min.css 6.0.0-alpha.1 (BS_CSS). Без строки
//     link страница голая; ссылка с изменённой буквой — файла нет, страница голая. Скрипт Bootstrap имитируется:
//     кнопка закрытия e'lon работает, только если в коде есть строка script.
//   · Сайт Bootstrap — похожая страница в окне Chrome (светлая): те же разделы и пункты, тот же код, что в 6.0.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы; в речи нет символов.
//
// СИСТЕМА СЛОВ: Bootstrap, CDN, link, script, class, alert, theme-*, Install, Components, Variants, Copy — по-английски
// (правка речи в build.mjs); tayyor CSS kutubxonasi — библиотека (draft); class nomi — имя класса (как в CSS);
// e'lon — объявление (Alert на странице; draft); Bootstrap sayti — сайт документации; nusxalash / nusxa olish —
// копировать; qo'yish — вставить; internetdagi ombor — CDN (draft); himoya muhri — integrity (draft); misol — пример.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-01-vvedenie',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '1-dars. Bootstrapga kirish',
    ru: 'Урок 1. Введение в Bootstrap',
    en: 'Lesson 1. Getting started with Bootstrap'
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
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Ranglar va tugmalar', 'Цвета и кнопки', 'Colors and buttons'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  menu: L3('Menyu', 'Меню', 'Menu'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, … ; печатаются: eyebrow, ask, card, site.
// ───────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт кружка — содержимое страницы (не звучит).
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    h1: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    notice: L3("Robot to'garagi ochildi! Shanba kuni soat 10:00 da kutamiz.", 'Кружок роботов открылся! Ждём в субботу в 10:00.', 'The robot club is open! See you on Saturday at 10:00.'),
    mine: L3("Robot to'garagi shanba kuni ochiladi!", 'Кружок роботов откроется в субботу!', 'The robot club opens on Saturday!'),
    sample: 'A simple alert—check it out!'
  },
  s1: {
    eyebrow: L3('Bir soatlik ish', 'Час работы', 'An hour of work'),
    say: L3("Salom! Men robot to'garagining saytini tayyorlayapman. Mana, e'lon: robot to'garagi ochildi. Uni chiroyli qilish uchun kechqurun bir soat CSS yozdim, o'n ikki qator! Do'stim esa xuddi shunday e'lonni o'n soniyada qildi. Qanday qilib? Keling, ko'ramiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Я делаю сайт кружка роботов. Вот объявление: кружок роботов открылся. Чтобы сделать его красивым, я весь вечер писал CSS, целых двенадцать строк! А друг сделал такое же объявление за десять секунд. Как? Давай посмотрим. Нажми «С Bootstrap».',
      'Hi! I’m building the robot club website. Here’s the notice: the robot club is open. To make it pretty, I spent a whole evening writing CSS, twelve lines! But my friend made the same notice in ten seconds. How? Let’s see. Tap “With Bootstrap”.'),
    magic: L3("Voy! E'lon chiroyli kartochkaga aylandi: rangli fon, yumaloq burchaklar, ichida bo'sh joy. Mening o'n ikki qatorim esa kerak bo'lmadi!",
      'Ого! Объявление превратилось в красивую карточку: цветной фон, скруглённые углы, место внутри. А мои двенадцать строк не понадобились!',
      'Whoa! The notice turned into a nice card: a colored background, rounded corners, space inside. And my twelve lines weren’t needed!'),
    magicP: L3("Kodga qarang: bitta havola va class ichida ikkita so'z. Buning nomi Bootstrap.",
      'Посмотри на код: одна ссылка и два слова в class. Это называется Bootstrap.',
      'Look at the code: one link and two words in class. This is called Bootstrap.'),
    done: L3("Bugun Bootstrap bilan tanishasiz: uning saytidan kerakli narsani topasiz, nusxalaysiz va o'zingizga moslaysiz. Lekin oldin kichik topishmoq. Menimcha, Bootstrap bu kompyuterga o'rnatiladigan katta dastur. Uni o'yinlarga o'xshab yuklab olib, o'rnatish kerak. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты познакомишься с Bootstrap: найдёшь нужное на его сайте, скопируешь и настроишь под себя. Но сначала маленькая загадка. По-моему, Bootstrap — это большая программа, которую ставят на компьютер. Её надо скачать и установить, как игру. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll meet Bootstrap: you’ll find what you need on its website, copy it and make it your own. But first, a little riddle. I think Bootstrap is a big program you put on your computer. You have to download and install it, like a game. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('Bootstrap — tayyor CSS', 'Bootstrap — готовый CSS', 'Bootstrap is ready-made CSS'),
    mineH: L3('Mening CSS kodim', 'Мой CSS', 'My CSS'),
    bsH: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap')
  },
  s2: {
    eyebrow: L3('Bootstrap nima', 'Что такое Bootstrap', 'What Bootstrap is'),
    help: [
      L3("Koddagi Bootstrap fayliga, keyin div tegidagi class so'zlariga qarang. Brauzerga qarang: class qo'yilganda e'lon o'zgaradi.", 'Посмотри на файл Bootstrap в коде, потом на слова в class у тега div. Посмотри в браузер: когда появляется class, объявление меняется.', 'Look at the Bootstrap file in the code, then at the words in class on the div tag. Watch the browser: when class appears, the notice changes.'),
      L3("Bootstrap bu boshqalar yozgan tayyor CSS. Biz qoidalarni o'zimiz yozmaymiz, faqat uning class nomini ishlatamiz.", 'Bootstrap — это готовый CSS, который написали другие. Мы не пишем правила сами, а только используем имена его классов.', 'Bootstrap is ready-made CSS written by others. We don’t write the rules ourselves, we just use its class names.'),
      L3("Bu do'kondagi tayyor kiyimga o'xshaydi: tikish shart emas, o'lchamini tanlab, kiyib olasiz.", 'Это похоже на готовую одежду в магазине: шить не надо, выбираешь размер и надеваешь.', 'It’s like ready-made clothes in a shop: no sewing, you pick a size and put it on.')
    ],
    say: L3("Keling, sirni ochamiz. Bootstrap, ya'ni tayyor CSS kutubxonasi degani. Uni boshqa veb-dasturchilar allaqachon yozib qo'yishgan: tugmalar, e'lonlar, kartochkalar uchun minglab qoidalar bor. Qarang, nima bo'ladi.",
      'Давай раскроем секрет. Bootstrap — это библиотека готового CSS. Её уже написали другие веб-разработчики: в ней тысячи правил для кнопок, объявлений, карточек. Смотри, что будет.',
      'Let’s reveal the secret. Bootstrap is a library of ready-made CSS. Other web developers already wrote it: it has thousands of rules for buttons, notices, cards. Watch what happens.'),
    sayFile: L3("Mana, Bootstrap fayli. Ichida tayyor qoidalar turibdi. Masalan, alert uchun qoida bor: ichki bo'shliq, chegara va yumaloq burchaklar. Hozircha sahifa o'zgarmadi, chunki qoidani hech kim ishlatmayapti.",
      'Вот файл Bootstrap. В нём лежат готовые правила. Например, есть правило для alert: отступ внутри, рамка и скруглённые углы. Пока страница не изменилась: правило никто не использует.',
      'Here’s the Bootstrap file. It holds ready-made rules. For example, there’s a rule for alert: inner spacing, a border and rounded corners. The page hasn’t changed yet: nobody uses the rule.'),
    sayClass: L3("Endi biz faqat bitta ish qilamiz: div tegiga tayyor class nomini yozamiz. Qarang, e'lon darrov kiyindi!",
      'А теперь мы делаем только одно: пишем тегу div готовое имя класса. Смотри, объявление сразу оделось!',
      'Now we do just one thing: we give the div tag a ready-made class name. Look, the notice got dressed right away!'),
    done: L3("Eslab qoling: CSS qoidalarini Bootstrap yozgan, biz esa faqat class nomini qo'yamiz.",
      'Запомни: CSS-правила написал Bootstrap, а мы только ставим имя класса.',
      'Remember: Bootstrap wrote the CSS rules, and we just put in the class name.'),
    askStart: L3("Qarang: oddiy e'lon", 'Смотри: простое объявление', 'Watch: a plain notice'),
    askFile: L3('Qarang: Bootstrap fayli', 'Смотри: файл Bootstrap', 'Watch: the Bootstrap file'),
    askClass: L3("Qarang: class so'zlari", 'Смотри: слова в class', 'Watch: the words in class'),
    askDone: L3("Biz faqat class nomini qo'yamiz", 'Мы только ставим имя класса', 'We just put in the class name'),
    fileH: L3('Bootstrap fayli', 'Файл Bootstrap', 'The Bootstrap file')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Keling, bir tajriba qilamiz. Pastda ikkita tugma bor: link qatori va class. Ularni yoqib-o'chirib ko'ring va e'lon qachon kiyinishini toping.",
      'Давай проведём опыт. Внизу два переключателя: строка link и class. Включай и выключай их и найди, когда объявление оденется.',
      'Let’s do an experiment. Below are two switches: the link line and class. Turn them on and off and find out when the notice gets dressed.'),
    linkOnly: L3("Fayl ulandi, ichida alert qoidasi bor. Lekin div tegida class yo'q, shuning uchun qoidani hech kim ishlatmayapti.",
      'Файл подключён, в нём есть правило alert. Но у тега div нет class, поэтому правило никто не использует.',
      'The file is connected, and it has the alert rule. But the div tag has no class, so nobody uses the rule.'),
    classOnly: L3("class bor, lekin Bootstrap fayli ulanmagan. alert qoidasi yo'q, shuning uchun brauzer bu so'zni tanimaydi.",
      'class есть, но файл Bootstrap не подключён. Правила alert нет, поэтому браузер это слово не узнаёт.',
      'class is there, but the Bootstrap file isn’t connected. There’s no alert rule, so the browser doesn’t recognize the word.'),
    none: L3("Ikkalasi ham o'chiq. Oddiy sahifa.", 'Оба выключены. Простая страница.', 'Both are off. A plain page.'),
    ok: L3("Ana! Fayl alert qoidasini olib keldi, class esa uni yoqdi. E'lon kiyindi!",
      'Вот! Файл принёс правило alert, а class его включил. Объявление оделось!',
      'There! The file brought the alert rule, and class switched it on. The notice got dressed!'),
    done: L3("Demak, link qatori Bootstrap qoidalarini olib keladi, class esa ulardan keraklisini yoqadi. Bu xuddi CSS darsidagi class selektoriga o'xshaydi: faylda alert qoidasi, tegda esa alert so'zi.",
      'Значит, строка link приносит правила Bootstrap, а class включает нужное. Это как селектор класса из уроков CSS: в файле правило alert, а у тега — слово alert.',
      'So the link line brings Bootstrap’s rules, and class switches on the one you need. It’s just like the class selector from the CSS lessons: the alert rule in the file, the word alert on the tag.'),
    hints: [
      L3("E'lon kiyinishi uchun nima kerak: fayl, class yoki ikkalasi?", 'Что нужно, чтобы объявление оделось: файл, class или оба?', 'What does the notice need to get dressed: the file, class, or both?'),
      L3("Bittasini yoqib ko'rdingiz. Endi ikkinchisini ham yoqing.", 'Одно ты уже включил. Теперь включи и второе.', 'You turned one on. Now turn on the other one too.'),
      L3("Ikkala tugmani ham yoqing: link va class.", 'Включи оба переключателя: link и class.', 'Turn on both switches: link and class.')
    ],
    ask: L3("link va class tugmalarini yoqib-o'chirib ko'ring", 'Включай и выключай link и class', 'Turn link and class on and off'),
    askDone: L3("link qoidalarni olib keladi, class ularni yoqadi", 'link приносит правила, class их включает', 'link brings the rules, class switches them on'),
    linkL: L3('link qatori', 'строка link', 'link line'),
    fileH: L3('Bootstrap fayli', 'Файл Bootstrap', 'The Bootstrap file')
  },
  g1: {
    eyebrow: L3('Saytni topamiz', 'Находим сайт', 'Finding the site'),
    help: [
      L3("Qidiruv maydoniga, keyin natijalardagi getbootstrap.com manziliga va bosh sahifadagi Read the docs tugmasiga qarang.", 'Посмотри на поле поиска, потом на адрес getbootstrap.com в результатах и на кнопку Read the docs на главной.', 'Look at the search box, then the getbootstrap.com address in the results and the Read the docs button on the home page.'),
      L3("Bootstrapning rasmiy sayti getbootstrap.com manzilida turadi. Misollar va kodlar Read the docs tugmasi orqasida.", 'Официальный сайт Bootstrap — getbootstrap.com. Примеры и код — за кнопкой Read the docs.', 'Bootstrap’s official site is getbootstrap.com. The examples and code are behind the Read the docs button.'),
      L3("Bu kutubxonaga borishga o'xshaydi: oldin binoni topasiz, keyin kerakli kitob javonini.", 'Это как поход в библиотеку: сначала находишь здание, потом нужную полку.', 'It’s like going to a library: first you find the building, then the right shelf.')
    ],
    say: L3("Bootstrap saytini qanday topamiz? Juda oddiy: boshqa narsalarni qidirgandek, Google orqali. Qarang.",
      'Как найти сайт Bootstrap? Очень просто: через Google, как и всё остальное. Смотри.',
      'How do we find the Bootstrap site? Easy: through Google, like anything else. Watch.'),
    sayType: L3("Qidiruv maydonini bosaman va bootstrap so'zini yozaman.", 'Нажимаю на поле поиска и пишу слово bootstrap.', 'I tap the search box and type the word bootstrap.'),
    sayResults: L3("Mana, natijalar. Eng tepada Bootstrapning o'z sayti turibdi, manzili getbootstrap.com. Uni bosaman.",
      'Вот результаты. На самом верху — сайт самого Bootstrap, адрес getbootstrap.com. Нажимаю на него.',
      'Here are the results. At the very top is Bootstrap’s own site, getbootstrap.com. I tap it.'),
    sayHome: L3("Bu Bootstrapning bosh sahifasi. Bizga hujjatlar kerak, ya'ni misollar va kodlar yozilgan sahifalar degani. Ular binafsha rangli Read the docs tugmasi orqasida turibdi.",
      'Это главная страница Bootstrap. Нам нужна документация, то есть страницы с примерами и кодом. Она за фиолетовой кнопкой Read the docs.',
      'This is Bootstrap’s home page. We need the docs, the pages with examples and code. They’re behind the purple Read the docs button.'),
    sayDocs: L3("Bosaman, va mana, hujjatlar ochildi. Birinchi bo'lib Install sahifasi chiqadi.", 'Нажимаю — и вот, открылась документация. Первой открывается страница Install.', 'I tap it, and here are the docs. The Install page opens first.'),
    done: L3("Eslab qoling: Google, bootstrap so'zi, getbootstrap.com, keyin Read the docs. Shu yo'l bilan istalgan payt saytga kirasiz.",
      'Запомни: Google, слово bootstrap, getbootstrap.com, потом Read the docs. Так ты попадёшь на сайт в любой момент.',
      'Remember: Google, the word bootstrap, getbootstrap.com, then Read the docs. That way you can reach the site any time.'),
    askStart: L3('Qarang: Google qidiruvi', 'Смотри: поиск Google', 'Watch: Google search'),
    askType: L3('Qarang: bootstrap deb yozamiz', 'Смотри: пишем bootstrap', 'Watch: we type bootstrap'),
    askResults: L3('Qarang: getbootstrap.com', 'Смотри: getbootstrap.com', 'Watch: getbootstrap.com'),
    askHome: L3('Qarang: Read the docs tugmasi', 'Смотри: кнопка Read the docs', 'Watch: the Read the docs button'),
    askDocs: L3('Qarang: hujjatlar sahifasi', 'Смотри: страница документации', 'Watch: the docs page'),
    askDone: L3('Google → getbootstrap.com → Read the docs', 'Google → getbootstrap.com → Read the docs', 'Google → getbootstrap.com → Read the docs')
  },
  s9: {
    eyebrow: L3('Havolani nusxalaymiz', 'Копируем ссылку', 'Copying the link'),
    help: [
      L3("Saytdagi CDN kod blokiga, burchakdagi nusxa olish belgisiga, keyin koddagi head va body oxiriga qarang.", 'Посмотри на блок кода CDN на сайте, на значок копирования в углу, потом на head и конец body в коде.', 'Look at the CDN code block on the site, the copy icon in its corner, then head and the end of body in the code.'),
      L3("Nusxa olish belgisi ikkala qatorni nusxalaydi. link head ichida qoladi, script esa yopuvchi body tegidan oldin turadi.", 'Значок копирования копирует обе строки. link остаётся в head, а script стоит перед закрывающим тегом body.', 'The copy icon copies both lines. link stays in head, and script goes before the closing body tag.'),
      L3("Bu manzilni qo'lda yozish o'rniga xaritadan nusxa olishga o'xshaydi: bitta harf ham adashmaydi.", 'Это как скопировать адрес с карты вместо того, чтобы писать его руками: ни одна буква не потеряется.', 'It’s like copying an address from a map instead of typing it: not a single letter gets lost.')
    ],
    say: L3("Endi Bootstrapni sahifaga ulashni boshidan oxirigacha ko'rsataman. Install sahifasida CDN bo'limiga tushamiz.",
      'Сейчас покажу подключение Bootstrap от начала до конца. Спускаемся на странице Install к разделу CDN.',
      'Now I’ll show you how to connect Bootstrap from start to finish. We go down to the CDN section on the Install page.'),
    sayCopy: L3("Bu yerda kod bloki bor, ichida ikkita qator: link va script. Burchakdagi nusxa olish belgisini bosaman. Ana, Copied degan yozuv chiqdi: ikkala qator nusxalandi. Kompyuterda belgilab, Ctrl va C tugmalarini bossangiz ham bo'ladi.",
      'Здесь блок кода, в нём две строки: link и script. Нажимаю значок копирования в углу. Вот, появилась надпись Copied: обе строки скопированы. На компьютере можно выделить и нажать Ctrl и C.',
      'Here’s a code block with two lines: link and script. I tap the copy icon in the corner. There, it says Copied: both lines are copied. On a computer you can also select and press Ctrl and C.'),
    sayPaste: L3("Nusxani head ichidagi bo'sh joyga qo'yaman, kompyuterda bu Ctrl va V tugmalari. Qarang, sahifa darrov o'zgardi: Bootstrap ulandi! Havolani qo'lda o'zgartirmang: unda himoya muhri bor, bitta harf ham faylni yo'qotadi.", 'Вставляю копию в пустое место внутри head, на компьютере это Ctrl и V. Смотри, страница сразу изменилась: Bootstrap подключён! Ссылку руками не меняй: в ней печать защиты, одна буква — и файла нет.', 'I paste the copy into the empty spot inside head; on a computer that’s Ctrl and V. Look, the page changed right away: Bootstrap is connected! Don’t edit the link by hand: it has a safety seal, and one letter breaks it.'),
    sayMove: L3("Lekin script qatori yopuvchi body tegidan oldin turishi kerak. Uni pastga olib tushaman.", 'Но строка script должна стоять перед закрывающим тегом body. Переношу её вниз.', 'But the script line has to sit before the closing body tag. I move it down.'),
    sayClose: L3("Endi tekshiramiz. E'londagi yopish tugmasini bosaman. Ishladi! E'lon yopildi.", 'А теперь проверим. Нажимаю кнопку закрытия у объявления. Сработало! Объявление закрылось.', 'Now let’s check. I tap the notice’s close button. It worked! The notice closed.'),
    done: L3("Eslab qoling: kodni saytdan nusxalaymiz, link head ichida qoladi, script esa yopuvchi body tegidan oldin turadi.",
      'Запомни: код копируем с сайта, link остаётся в head, а script стоит перед закрывающим тегом body.',
      'Remember: we copy the code from the site, link stays in head, and script goes before the closing body tag.'),
    askStart: L3("Qarang: CDN bo'limi", 'Смотри: раздел CDN', 'Watch: the CDN section'),
    askCopy: L3('Qarang: nusxa olish belgisi', 'Смотри: значок копирования', 'Watch: the copy icon'),
    askPaste: L3("Qarang: head ichiga qo'yildi", 'Смотри: вставлено в head', 'Watch: pasted into head'),
    askMove: L3('Qarang: script pastga tushdi', 'Смотри: script переехал вниз', 'Watch: script moved down'),
    askClose: L3('Qarang: yopish tugmasi ishlaydi', 'Смотри: кнопка закрытия работает', 'Watch: the close button works'),
    askDone: L3("link — head ichida, script — body oxirida", 'link — в head, script — в конце body', 'link in head, script at the end of body')
  },
  sc: {
    eyebrow: L3("Tayyor bo'lak", 'Готовая деталь', 'A ready-made piece'),
    help: [
      L3("Menyuga, Alert sahifasidagi kodga, keyin koddagi p tegi va class so'zlariga qarang.", 'Посмотри на меню, на код на странице Alert, потом на тег p и слова в class.', 'Look at the menu, the code on the Alert page, then the p tag and the words in class.'),
      L3("Nusxalangan kod bu shablon: matnni o'zingizniki bilan almashtirasiz, rangni esa saytdagi so'z bilan tanlaysiz.", 'Скопированный код — это шаблон: текст меняешь на свой, а цвет выбираешь словом с сайта.', 'Copied code is a template: you swap the text for yours and pick the color with a word from the site.'),
      L3("Bu tayyor tabriknoma kartasiga o'xshaydi: kartani do'kondan olasiz, ichiga esa o'z so'zlaringizni yozasiz.", 'Это как готовая открытка: покупаешь её в магазине, а внутри пишешь свои слова.', 'It’s like a ready-made greeting card: you buy it in a shop and write your own words inside.')
    ],
    say: L3("Endi saytdan tayyor bo'lak olamiz va uni o'zimizga moslaymiz. Qarang.", 'Теперь возьмём с сайта готовую деталь и настроим её под себя. Смотри.', 'Now let’s take a ready-made piece from the site and make it our own. Watch.'),
    sayMenu: L3("Menyuda bo'limlar turibdi, har birining o'z rangli belgisi bor. Tayyor bo'laklar Components bo'limida. Telefonda menyu uch chiziqli tugma orqasida yashiringan.",
      'В меню разделы, у каждого свой цветной значок. Готовые детали — в разделе Components. На телефоне меню спрятано за кнопкой с тремя полосками.',
      'The menu has sections, each with its own colored icon. Ready-made pieces are in Components. On a phone the menu hides behind the three-line button.'),
    sayAlert: L3("Components ichidan Alert sahifasini ochaman. Oldin misol, tagida kod, burchakda esa nusxa olish belgisi.", 'Открываю в Components страницу Alert. Сначала пример, под ним код, а в углу — значок копирования.', 'I open the Alert page in Components. First the example, the code under it, and the copy icon in the corner.'),
    sayCopy: L3("Nusxa olish belgisini bosaman va kodni body ichiga qo'yaman. Mana, sahifada inglizcha e'lon paydo bo'ldi.", 'Нажимаю значок копирования и вставляю код внутрь body. Вот, на странице появилось объявление на английском.', 'I tap the copy icon and paste the code inside body. There, an English notice appeared on the page.'),
    sayText: L3("Matn inglizcha, bizga esa o'zimizniki kerak. p tegi ichidagi matnni belgilayman va o'z matnimni yozaman. Matnni xohlagancha o'zgartirsa bo'ladi.", 'Текст английский, а нам нужен свой. Выделяю текст внутри тега p и пишу свой. Текст можно менять как угодно.', 'The text is English, and we need our own. I select the text inside the p tag and type mine. You can change the text however you like.'),
    sayColor: L3("Endi rang. Saytdagi Variants bo'limida har bir rangning so'zi bor. Sariq uchun theme-warning. Uni alert so'zidan keyin yozaman. Qarang, e'lon sariq bo'ldi!", 'Теперь цвет. В разделе Variants на сайте у каждого цвета своё слово. Для жёлтого — theme-warning. Пишу его после слова alert. Смотри, объявление стало жёлтым!', 'Now the color. In the Variants section each color has its own word. For yellow it’s theme-warning. I type it after the word alert. Look, the notice turned yellow!'),
    sayOld: L3("Diqqat qiling: eski darslarda alert-success yoki btn-primary degan nomlarni ko'rasiz. Bu Bootstrapning beshinchi versiyasi, oltinchisida ular ishlamaydi. So'zni doim shu saytdan oling.",
      'Внимание: в старых уроках ты увидишь имена вроде alert-success или btn-primary. Это пятая версия Bootstrap, в шестой они не работают. Слово всегда бери с этого сайта.',
      'Heads up: in old tutorials you’ll see names like alert-success or btn-primary. That’s Bootstrap version five, and they don’t work in version six. Always take the word from this site.'),
    done: L3("Eslab qoling: menyu, misol, kod va nusxa olish belgisi. Matnni o'zgartiramiz, rangni esa saytdagi so'z bilan tanlaymiz.", 'Запомни: меню, пример, код и значок копирования. Текст меняем сами, а цвет выбираем словом с сайта.', 'Remember: the menu, the example, the code and the copy icon. We change the text ourselves and pick the color with a word from the site.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askAlert: L3('Qarang: Components → Alert', 'Смотри: Components → Alert', 'Watch: Components → Alert'),
    askCopy: L3("Qarang: kod body ichiga qo'yildi", 'Смотри: код вставлен в body', 'Watch: the code is pasted into body'),
    askText: L3("Qarang: matn o'zgardi", 'Смотри: текст изменился', 'Watch: the text changed'),
    askColor: L3("Qarang: rang so'zi saytdan", 'Смотри: слово цвета — с сайта', 'Watch: the color word comes from the site'),
    askDone: L3("Matn — sizniki, rang so'zi — saytdan", 'Текст — твой, слово цвета — с сайта', 'Text is yours, the color word is from the site')
  },
  t1: {
    eyebrow: L3('Bootstrapni ulang', 'Подключи Bootstrap', 'Connect Bootstrap'),
    say: L3("Endi o'zingiz ulaysiz. Saytdagi CDN blokidan nusxa oling va head ichiga qo'ying. Keyin script qatorini bosib, uni yopuvchi body tegidan oldingi joyga olib boring.",
      'Теперь подключаешь ты. Скопируй блок CDN с сайта и вставь в head. Потом нажми строку script и перенеси её перед закрывающим тегом body.',
      'Now you connect it. Copy the CDN block from the site and paste it into head. Then tap the script line and move it before the closing body tag.'),
    msgs: {
      noClip: L3("Oldin saytda nusxa olish belgisini bosing, keyin head ichidagi bo'sh joyni bosing.", 'Сначала нажми значок копирования на сайте, потом — пустое место в head.', 'First tap the copy icon on the site, then the empty spot in head.'),
      needPick: L3("Oldin head ichidagi script qatorini bosing, keyin pastdagi bo'sh joyni.", 'Сначала нажми строку script в head, потом — пустое место внизу.', 'First tap the script line in head, then the empty spot below.')
    },
    copied: L3("Nusxalandi! Endi head ichidagi bo'sh joyni bosing.", 'Скопировано! Теперь нажми пустое место в head.', 'Copied! Now tap the empty spot in head.'),
    pasted: L3("Zo'r, Bootstrap ulandi! Endi script qatorini bosing va uni pastga, yopuvchi body tegidan oldingi joyga olib boring.", 'Огонь, Bootstrap подключён! Теперь нажми строку script и перенеси её вниз, перед закрывающим тегом body.', 'Awesome, Bootstrap is connected! Now tap the script line and move it down, before the closing body tag.'),
    picked: L3("script tanlandi. Endi pastdagi bo'sh joyni bosing.", 'script выбран. Теперь нажми пустое место внизу.', 'script is selected. Now tap the empty spot below.'),
    hints: [
      L3("Saytdagi kod blokining burchagiga qarang.", 'Посмотри в угол блока кода на сайте.', 'Look at the corner of the code block on the site.'),
      L3("Nusxa olish belgisini, keyin head ichidagi bo'sh joyni bosing.", 'Нажми значок копирования, потом — пустое место в head.', 'Tap the copy icon, then the empty spot in head.'),
      L3("head ichidagi script qatorini bosing, keyin yopuvchi body tegidan oldingi bo'sh joyni.", 'Нажми строку script в head, потом — пустое место перед закрывающим тегом body.', 'Tap the script line in head, then the empty spot before the closing body tag.')
    ],
    ok: L3("Ajoyib! link head ichida, script body oxirida. Bootstrap to'liq ulandi.", 'Отлично! link — в head, script — в конце body. Bootstrap подключён полностью.', 'Great! link is in head, script is at the end of body. Bootstrap is fully connected.'),
    ask: L3("CDN ni nusxalab, head ichiga qo'ying", 'Скопируй CDN и вставь в head', 'Copy the CDN and paste it into head'),
    // На телефоне заголовок «CDN» уезжает вверх, блок подписан «HTML» — строка задания называет значок (23.11.2026).
    askPhone: L3("Saytdagi kodni nusxalang (burchakdagi belgi) va head ichiga qo'ying", 'Скопируй код с сайта (значок в углу) и вставь в head', 'Copy the code from the site (the icon in the corner) and paste it into head'),
    askMove: L3("script qatorini body oxiriga olib boring", 'Перенеси строку script в конец body', 'Move the script line to the end of body')
  },
  t2: {
    eyebrow: L3('Alertni oling', 'Возьми Alert', 'Take the Alert'),
    say: L3("Endi tayyor bo'lakni o'zingiz oling. Menyudan Alert sahifasini toping, misol kodidan nusxa oling va uni body ichiga qo'ying.",
      'Теперь возьми готовую деталь сам. Найди в меню страницу Alert, скопируй код примера и вставь его в body.',
      'Now take a ready-made piece yourself. Find the Alert page in the menu, copy the example’s code and paste it into body.'),
    msgs: {
      wrong: L3("Bu {w} sahifasi. Bizga e'lon kerak, ya'ni Alert degani.", 'Это страница {w}. Нам нужно объявление, то есть Alert.', 'This is the {w} page. We need a notice, that is, Alert.'),
      noClip: L3("Oldin Alert sahifasidagi nusxa olish belgisini bosing.", 'Сначала нажми значок копирования на странице Alert.', 'First tap the copy icon on the Alert page.')
    },
    copied: L3("Nusxalandi! Endi body ichidagi bo'sh joyni bosing.", 'Скопировано! Теперь нажми пустое место внутри body.', 'Copied! Now tap the empty spot inside body.'),
    hints: [
      L3("Alert tayyor bo'lak. Tayyor bo'laklar qaysi bo'limda turadi?", 'Alert — готовая деталь. В каком разделе лежат готовые детали?', 'Alert is a ready-made piece. Which section holds the ready-made pieces?'),
      L3("Components bo'limini oching va Alert sahifasini bosing.", 'Открой раздел Components и нажми страницу Alert.', 'Open the Components section and tap the Alert page.'),
      L3("Alert sahifasida kod burchagidagi nusxa olish belgisini, keyin body ichidagi bo'sh joyni bosing.", 'На странице Alert нажми значок копирования в углу кода, потом — пустое место внутри body.', 'On the Alert page tap the copy icon in the corner of the code, then the empty spot inside body.')
    ],
    ok: L3("To'ppa-to'g'ri! E'lon sahifaga tushdi. Endi uni o'zingizga moslaysiz.", 'Точно! Объявление на странице. Теперь настроишь его под себя.', 'Spot on! The notice is on the page. Now you’ll make it your own.'),
    ask: L3("Alert misolini nusxalab, body ichiga qo'ying", 'Скопируй пример Alert и вставь в body', 'Copy the Alert example and paste it into body'),
    // Меню сайта в узком окне спрятано за ☰ — строка задания и первая подсказка называют её (23.11.2026); меню слева — askFindSide.
    askFind: L3("☰ tugmasini bosing va Components → Alert sahifasini toping", 'Нажми ☰ и найди Components → Alert', 'Tap ☰ and find Components → Alert'),
    askFindSide: L3("Chapdagi menyudan Components → Alert sahifasini toping", 'Найди в меню слева Components → Alert', 'Find Components → Alert in the menu on the left'),
    hintMenu: L3("Menyu yashiringan. Sayt oynasining yuqori o'ng burchagidagi uch chiziqli tugmani bosing.", 'Меню спрятано. Нажми кнопку с тремя полосками в правом верхнем углу окна сайта.', 'The menu is hidden. Tap the three-line button in the top right corner of the site window.')
  },
  w1: {
    eyebrow: L3("O'z e'loningiz", 'Своё объявление', 'Your own notice'),
    say: L3("Endi e'lonni o'zingizga moslang. Saytdagi Variants bo'limidan o'zingizga yoqqan rangni tanlab, uning so'zini yozing, keyin e'lon matnini yozing. Ikkalasi tayyor bo'lsa, «Tayyor»ni bosing.",
      'Теперь сделай своё объявление. Выбери на сайте в разделе Variants цвет, который нравится, впиши его слово, а потом — текст объявления. Когда оба готовы, нажми «Готово».',
      'Now make your own notice. Pick a color you like in the Variants section on the site, type its word, then type the notice text. When both are ready, tap “Done”.'),
    msgs: {
      empty: L3("E'londa ikkita bo'sh joy bor: rang so'zi va matn. Ikkalasini ham yozing.", 'В объявлении два пустых места: слово цвета и текст. Заполни оба.', 'The notice has two empty spots: the color word and the text. Fill in both.'),
      native: L3("Bootstrap o'zbekcha so'zlarni bilmaydi. Saytdagi Variants bo'limidan so'z oling.", 'Bootstrap не знает таких слов. Возьми слово из раздела Variants на сайте.', 'Bootstrap doesn’t know such words. Take a word from the Variants section on the site.'),
      noTheme: L3("Oz qoldi! Saytdagi so'z theme va chiziqcha bilan boshlanadi.", 'Почти! Слово на сайте начинается с theme и дефиса.', 'Close! The word on the site starts with theme and a dash.'),
      notTheme: L3("Bootstrap {w} so'zini bilmaydi. Saytdagi Variants bo'limidan so'z oling.", 'Bootstrap не знает слова {w}. Возьми слово из раздела Variants на сайте.', 'Bootstrap doesn’t know the word {w}. Take a word from the Variants section on the site.'),
      same: L3("Bu hali saytdagi inglizcha matn. O'z e'loningizni yozing.", 'Это ещё английский текст с сайта. Напиши своё объявление.', 'That’s still the English text from the site. Write your own notice.'),
      // «Tayyor» с одним пустым полем — причина, а не молча (23.11.2026).
      noText: L3("E'loningiz matnini 2-qatorga yozing", 'Впиши текст своего объявления — строка 2', 'Type your notice text — line 2'),
      noColor: L3("E'lon rangining so'zini 1-qatorga yozing", 'Впиши слово цвета объявления — строка 1', 'Type the notice color word — line 1')
    },
    hints: [
      L3("E'londa ikkita bo'sh joy bor: rang so'zi va matn.", 'В объявлении два пустых места: слово цвета и текст.', 'The notice has two empty spots: the color word and the text.'),
      L3("Rang so'zini saytdagi Variants bo'limidan oling: u theme bilan boshlanadi.", 'Слово цвета возьми из раздела Variants на сайте: оно начинается с theme.', 'Take the color word from the Variants section: it starts with theme.'),
      L3("Masalan: theme-danger va matn: ertaga musobaqa bor. Keyin «Tayyor»ni bosing.", 'Например: theme-danger и текст: завтра соревнования. Потом нажми «Готово».', 'For example: theme-danger and the text: there’s a contest tomorrow. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning birinchi Bootstrap e'loningiz.", 'Класс! Это твоё первое объявление на Bootstrap.', 'Nice! This is your first Bootstrap notice.'),
    ask: L3("Rang so'zini va matnni yozing", 'Впиши слово цвета и текст', 'Type the color word and the text')
  },
  t4: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta sahifa buzilgan, lekin har birida sabab boshqa. Kodga qarang va sababini tanlang.",
      'Последнее испытание. Три страницы сломаны, и у каждой своя причина. Посмотри на код и выбери причину.',
      'The last test. Three pages are broken, and each has a different reason. Look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    opts: {
      noLink: L3("link qatori yo'q", 'Нет строки link', 'No link line'),
      typo: L3("Havolada harf o'zgargan", 'В ссылке изменена буква', 'A letter changed in the link'),
      oldClass: L3("class eski yoki o'ylab topilgan", 'class старый или придуманный', 'The class is old or made up')
    },
    // why звучит и при промахе (причина), и после верного ответа (за «Barakalla!») — без «To'g'ri / Ha» в начале (20.11.2026).
    rounds: [
      { k: 'noLink', ask: L3("E'lon yashil kartochka bo'lishi kerak edi, lekin oddiy matn chiqdi. Nega?", 'Объявление должно было стать зелёной карточкой, а вышел простой текст. Почему?', 'The notice should have been a green card, but it came out as plain text. Why?'), why: L3("Kodda head ichida link qatori yo'q. Fayl ulanmagan, demak qoidalar ham yo'q.", 'В head нет строки link. Файл не подключён, значит, и правил нет.', 'There’s no link line in head. The file isn’t connected, so there are no rules.') },
      { k: 'typo', ask: L3("link qatori bor, lekin e'lon baribir oddiy matn. Nega?", 'Строка link есть, а объявление всё равно простой текст. Почему?', 'The link line is there, but the notice is still plain text. Why?'), why: L3("Havolada bootstrap so'zi buzilgan. Brauzer bunday faylni topa olmadi.", 'В ссылке испорчено слово bootstrap. Браузер не нашёл такой файл.', 'The word bootstrap is broken in the link. The browser couldn’t find that file.') },
      { k: 'oldClass', ask: L3("E'lon yashil bo'lishi kerak edi. Nega bo'lmadi?", 'Объявление должно было стать зелёным. Почему не стало?', 'The notice should have turned green. Why didn’t it?'), why: L3("alert-success eski nom, beshinchi versiyadan. Oltinchi versiyada theme-success.", 'alert-success — старое имя из пятой версии. В шестой — theme-success.', 'alert-success is an old name from version five. In version six it’s theme-success.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Oldin head ichiga qarang: link qatori bormi?", 'Сначала посмотри в head: есть ли строка link?', 'First look in head: is there a link line?'),
    hint2: L3("Havolani va class so'zlarini saytdagi bilan solishtiring.", 'Сравни ссылку и слова в class с тем, что на сайте.', 'Compare the link and the class words with the site.'),
    ok: L3("Hammasi to'g'ri! Endi nimadir ishlamasa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если что-то не работает, причину найдёшь сам.', 'All correct! Now if something doesn’t work, you’ll find the reason yourself.')
  },
  s16: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men Bootstrapni o'rnatiladigan katta dastur deb o'ylagan edim? Afsuski, adashibman. Hech narsa o'rnatilmadi! Bitta link qatori yetarli bo'ldi: sahifa Bootstrap faylini internetdagi ombordan o'zi oldi.",
        'Вернёмся к загадке. Помнишь, я думал, что Bootstrap — это большая программа, которую надо установить? Увы, я ошибся. Ничего не устанавливали! Хватило одной строки link: страница сама взяла файл Bootstrap из хранилища в интернете.',
        'Back to our riddle. Remember, I thought Bootstrap was a big program you have to install? Sadly, I was wrong. Nothing got installed! One link line was enough: the page took the Bootstrap file from a store on the internet by itself.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning e'loningiz, o'zingiz tanlagan rangda!", 'Смотри, это твоё объявление в цвете, который ты выбрал сам!', 'Look, this is your notice in the color you picked yourself!'), k: null },
      { text: L3("Bootstrap boshqalar yozgan tayyor CSS. Biz faqat uning class nomlarini qo'yamiz.", 'Bootstrap — готовый CSS, который написали другие. Мы только ставим имена его классов.', 'Bootstrap is ready-made CSS written by others. We just put in its class names.'), k: 'lib' },
      { text: L3("Saytga Google orqali kiramiz: getbootstrap.com, keyin Read the docs. U yerda menyu, misol, kod va nusxa olish tugmasi bor.", 'На сайт заходим через Google: getbootstrap.com, потом Read the docs. Там меню, пример, код и кнопка копирования.', 'We reach the site through Google: getbootstrap.com, then Read the docs. There you’ll find the menu, the example, the code and the copy button.'), k: 'site' },
      { text: L3("link head ichida, script esa yopuvchi body tegidan oldin turadi.", 'link — внутри head, а script — перед закрывающим тегом body.', 'link goes inside head, and script before the closing body tag.'), k: 'cdn' },
      { text: L3("Nusxalangan kodda matnni bemalol o'zgartiramiz, rangni esa saytdagi so'z bilan tanlaymiz.", 'В скопированном коде текст меняем смело, а цвет выбираем словом с сайта.', 'In copied code we change the text freely and pick the color with a word from the site.'), k: 'edit' },
      { text: L3("Tabriklayman! Siz Bootstrapning birinchi darsini tugatdingiz. Keyingi darsda ranglar va tugmalar bilan ishlaymiz. Ko'rishguncha!", 'Ура! Ты прошёл первый урок Bootstrap. На следующем уроке поработаем с цветами и кнопками. До встречи!', 'Hooray! You finished the first Bootstrap lesson. Next time we’ll work with colors and buttons. See you!'), k: null }
    ],
    roles: {
      lib: L3('Bootstrap — tayyor CSS', 'Bootstrap — готовый CSS', 'Bootstrap — ready-made CSS'),
      site: L3('Sayt — menyu, misol, kod', 'Сайт — меню, пример, код', 'Site — menu, example, code'),
      cdn: L3('link — head, script — body oxiri', 'link — head, script — конец body', 'link — head, script — end of body'),
      edit: L3("Matn — sizniki, rang — saytdan", 'Текст — твой, цвет — с сайта', 'Text is yours, color from the site')
    },
    ask: L3("E'loningizga qarang", 'Посмотри на своё объявление', 'Look at your notice')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayFile: 1, sayClass: 1, sayMenu: 1, sayExample: 1,
  sayCode: 1, sayCopy: 1, linkOnly: 1, classOnly: 1, none: 1, sayOld: 1, picked: 1, rounds: 1, sayType: 1, sayResults: 1, sayHome: 1, sayDocs: 1, sayAlert: 1, sayMove: 1, sayClose: 1, sayLink: 1, sayParts: 1, sayScript: 1, hintMenu: 1, sayText: 1, sayColor: 1, sayPaste: 1, sayDead: 1, sayClosed: 1, pasted: 1, fine: 1, found: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { k: 1 }, rounds: { k: 1, ask: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs1-screens.jsx@*/

/*@FILE:bs1-site.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:bs1.css@*/
`;
