// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 6 — «Контейнер и сетка»
// (облик «Редактор», как уроки 1–5 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs6/build.mjs → lessons/bootstrap/06-kontejner-i-setka.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 6 · «Контейнер и сетка» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Главная страница кружка: три блока растянуты на весь ноутбук и стоят друг под другом. Ученик
// ставит container (по центру, max-width по ширине экрана), делит ряд row на колонки col и col-N (доля из 12), а с
// адаптивными классами версии 6 — через двоеточие (md:col-4) — делает, чтобы на телефоне колонки шли столбиком, а с
// планшета — в ряд. Страница — в окне заданной ширины (360 / 768 / 1024), @media срабатывают честно. Сайт: Layout →
// Grid, Breakpoints. Загадка (без имён): Коди думает, что для телефона и ноутбука нужны два разных сайта; разгадка —
// один код md:col-4.
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-06-kontejner-i-setka.md.
//
// СИСТЕМА СЛОВ: container, row, col, col-6, md:col-4, Layout, Grid, Breakpoints — по-английски; konteyner — контейнер;
// setka — сетка; ustun — колонка; qator — ряд; 12 bo'lak — 12 частей; ekran kengligi — ширина экрана.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-06-kontejner-i-setka',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '6-dars. Konteyner va setka',
    ru: 'Урок 6. Контейнер и сетка',
    en: 'Lesson 6. Container and grid'
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
  next: L3('Navbar va Pagination', 'Navbar и Pagination', 'Navbar and Pagination'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  need: L3('Kerak', 'Нужно', 'Goal'),
  yours: L3('Sizning kodingiz', 'Твой код', 'Your code'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  phone: L3('Telefon · 360 px', 'Телефон · 360 px', 'Phone · 360 px'),
  tablet: L3('Planshet · 768 px', 'Планшет · 768 px', 'Tablet · 768 px'),
  laptop: L3('Noutbuk · 1024 px', 'Ноутбук · 1024 px', 'Laptop · 1024 px'),
  laptopW: L3('Noutbuk · 1200 px', 'Ноутбук · 1200 px', 'Laptop · 1200 px'),
  wide: L3("Ekranga sig'madi", 'Не помещается', 'Doesn’t fit'),
  fit: L3("Sig'di ✓", 'Помещается ✓', 'Fits ✓'),
  inside: L3('Bootstrap ichida', 'Внутри Bootstrap', 'Inside Bootstrap'),
  files: L3('Fayllar', 'Файлы', 'Files'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
const C = {
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    h1: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    join: L3('Yozilish', 'Записаться', 'Join'),
    b1: L3('Robotlar', 'Роботы', 'Robots'), b1t: L3(' — bizning 3 ta robot.', ' — наши 3 робота.', ' — our 3 robots.'),
    b2: L3('Jadval', 'Расписание', 'Schedule'), b2t: L3(' — shanba, 10:00.', ' — суббота, 10:00.', ' — Saturday, 10:00.'),
    b3: L3('Aloqa', 'Контакты', 'Contacts'), b3t: L3(' — telefon: 90 000 00 00', ' — телефон: 90 000 00 00', ' — phone: 90 000 00 00'),
    b4: L3('Yangiliklar', 'Новости', 'News'), b4t: L3(' — musobaqa yaqin.', ' — скоро соревнования.', ' — a contest is coming.')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga bitta so'z yozing.", 'Впиши в пустое место одно слово.', 'Type one word into the empty spot.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские.', 'Latin letters are needed here. Bootstrap’s words are English.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      native: L3("Bootstrap o'z so'zlarini biladi. Inglizcha so'zni saytdan oling.", 'Bootstrap знает свои слова. Возьми английское слово с сайта.', 'Bootstrap knows its own words. Take the English word from the site.'),
      fluid: L3("container-fluid butun kenglikni egallaydi. Namunada esa sahifa o'rtada, chetlarida joy bor.", 'container-fluid занимает всю ширину. А в образце страница посередине, с полями по краям.', 'container-fluid takes the full width. The goal is centered, with space at the sides.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      plural: L3("Ko'plikda emas, birlikda: {w}.", 'Не во множественном числе, а в единственном: {w}.', 'Not plural, singular: {w}.'),
      flexRow: L3("d-flex ham qator qiladi, lekin setka uchun Bootstrapda alohida so'z bor: u ustunlarning kengligini to'g'ri hisoblaydi.", 'd-flex тоже делает ряд, но для сетки у Bootstrap есть своё слово: оно правильно считает ширину колонок.', 'd-flex also makes a row, but the grid has its own word: it calculates the column widths correctly.'),
      fam_cont: L3("{w} ichkaridagi bo'lak uchun. Eng tashqi quti — konteyner.", '{w} — для внутренней части. Самая внешняя коробка — контейнер.', '{w} is for an inner part. The outermost box is the container.'),
      fam_row: L3("{w} boshqa bo'lak uchun. Bu yerda qator kerak.", '{w} — для другой части. Здесь нужен ряд.', '{w} is for another part. This spot needs the row.'),
      fam_col: L3("{w} boshqa bo'lak uchun. Bu yerda ustun kerak.", '{w} — для другой части. Здесь нужна колонка.', '{w} is for another part. This spot needs a column.'),
      old: L3("Bu eski nom, beshinchi versiyadan. Oltinchisida ekran o'lchami oldinda, ikki nuqta bilan: {w}.", 'Это старое имя из пятой версии. В шестой размер экрана впереди, через двоеточие: {w}.', 'That’s an old name from version five. In version six the screen size comes first, with a colon: {w}.'),
      noColon: L3("Oz qoldi! Ekran o'lchamidan keyin chiziqcha emas, ikki nuqta: {w}.", 'Почти! После размера экрана не дефис, а двоеточие: {w}.', 'Close! After the screen size comes a colon, not a dash: {w}.'),
      over: L3("{w} degan class yo'q: setka 12 bo'lakdan iborat, raqam 1 dan 12 gacha.", 'Класса {w} нет: сетка из 12 частей, число от 1 до 12.', 'There’s no {w} class: the grid has 12 parts, the number goes from 1 to 12.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas. Sahifani namuna bilan solishtiring.", 'Bootstrap это слово знает, но результат не как в образце. Сравни страницу с образцом.', 'Bootstrap knows that word, but the result isn’t like the goal. Compare the page with the goal.'),
      unknown: L3("Bootstrap {w} so'zini bilmaydi, shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает слова {w}, поэтому ничего не изменилось.', 'Bootstrap doesn’t know the word {w}, so nothing changed.')
    }
  },
  s1: {
    eyebrow: L3("Cho'zilgan sahifa", 'Растянутая страница', 'A stretched page'),
    say: L3("Salom! Saytning bosh sahifasida uchta blok bor: robotlar, jadval va aloqa. Noutbukda qarang: ular chetdan chetgacha cho'zilgan va bir-birining ostida turibdi. O'qish noqulay. Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! На главной странице сайта три блока: роботы, расписание и контакты. Посмотри на ноутбуке: они растянуты от края до края и стоят друг под другом. Читать неудобно. Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! The site’s home page has three blocks: robots, schedule and contacts. Look at it on a laptop: they’re stretched edge to edge and stacked. It’s hard to read. Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Bloklar o'rtaga yig'ildi va uchta ustunga bo'lindi. Kodga qarang: uchta yangi so'z: container, row va col.",
      'Ого! Блоки собрались посередине и встали в три колонки. Посмотри на код: три новых слова: container, row и col.',
      'Whoa! The blocks gathered in the middle and split into three columns. Look at the code: three new words: container, row and col.'),
    done: L3("Bugun sahifani ustunlarga bo'lamiz va uni har xil ekranga moslaymiz. Lekin oldin topishmoq. Menimcha, telefon uchun bitta sayt, noutbuk uchun esa boshqa sayt yasash kerak. Ikki barobar ish! Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida topamiz.",
      'Сегодня делим страницу на колонки и подгоняем её под разные экраны. Но сначала загадка. По-моему, для телефона нужно делать один сайт, а для ноутбука — другой. Вдвое больше работы! Как думаешь, я прав? Ответ найдём в конце урока.',
      'Today we split the page into columns and fit it to different screens. But first, a riddle. I think you need one site for phones and another for laptops. Twice the work! What do you think, am I right? We’ll find the answer at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('container · row · col', 'container · row · col', 'container · row · col')
  },
  s2: {
    eyebrow: L3('Konteyner', 'Контейнер', 'Container'),
    help: [
      L3("Sahifa chetlariga va ekran kengligiga qarang.", 'Посмотри на края страницы и на ширину экрана.', 'Look at the page edges and the screen width.'),
      L3("container sahifani o'rtaga yig'adi va kengligini ekranga qarab cheklaydi: noutbukda 960, planshetda 720 piksel, telefonda butun ekran.", 'container собирает страницу посередине и ограничивает ширину по экрану: на ноутбуке 960, на планшете 720 пикселей, на телефоне весь экран.', 'container gathers the page in the middle and limits its width by screen: 960 pixels on a laptop, 720 on a tablet, the whole screen on a phone.'),
      L3("Bu gazetaga o'xshaydi: matn varaq chetiga yopishmaydi, atrofida hoshiya bor.", 'Это как газета: текст не прилипает к краю листа, вокруг поля.', 'It’s like a newspaper: the text doesn’t touch the paper’s edge, there are margins around it.')
    ],
    say: L3("Birinchi so'z container, ya'ni konteyner degani. Hozir konteyner yo'q, bloklar noutbukda chetdan chetgacha. Qarang.",
      'Первое слово — container, то есть контейнер. Сейчас контейнера нет, блоки на ноутбуке от края до края. Смотри.',
      'The first word is container. Right now there’s no container, the blocks go edge to edge on the laptop. Watch.'),
    say1280: L3("container qo'shdim. Noutbukda bloklar 960 pikseldan keng emas va o'rtada turibdi, chetlarida joy bor.", 'Добавил container. На ноутбуке блоки не шире 960 пикселей и стоят посередине, по краям место.', 'I added container. On the laptop the blocks are at most 960 pixels wide and centered, with space at the sides.'),
    say768: L3("Planshetda konteyner torroq, 720 piksel.", 'На планшете контейнер уже, 720 пикселей.', 'On a tablet the container is narrower, 720 pixels.'),
    say360: L3("Telefonda esa u butun ekran bo'ylab. Konteyner o'lchamini ekranga qarab o'zi tanlaydi.", 'А на телефоне — во весь экран. Контейнер сам выбирает размер по экрану.', 'And on a phone it fills the whole screen. The container picks its size by screen itself.'),
    done: L3("Eslab qoling: container sahifani o'rtaga yig'adi va kengligini cheklaydi.", 'Запомни: container собирает страницу посередине и ограничивает ширину.', 'Remember: container gathers the page in the middle and limits its width.'),
    askW: L3('Qarang: ekran {w} px', 'Смотри: экран {w} px', 'Watch: screen {w} px'),
    askStart: L3("Qarang: konteyner yo'q", 'Смотри: контейнера нет', 'Watch: no container'),
    askDone: L3("container — o'rtada, chegarali", 'container — посередине, с границей', 'container: centered, limited')
  },
  s3: {
    eyebrow: L3('Qator va ustunlar', 'Ряд и колонки', 'Row and columns'),
    help: [
      L3("Kodda row va col so'zlariga, sahifada bloklar joylashuviga qarang.", 'Посмотри на слова row и col в коде и на расположение блоков на странице.', 'Look at the words row and col in the code and how the blocks are arranged.'),
      L3("row qator yasaydi, col esa qator ichidagi ustun. col lar qatorni teng bo'lib oladi.", 'row делает ряд, а col — колонку в этом ряду. Колонки col делят ряд поровну.', 'row makes a row, and col is a column inside it. The col columns share the row equally.'),
      L3("Bu shokolad plitkasiga o'xshaydi: plitka — qator, bo'laklar — ustunlar.", 'Это как плитка шоколада: плитка — ряд, дольки — колонки.', 'It’s like a chocolate bar: the bar is the row, the squares are the columns.')
    ],
    say: L3("Konteyner ichida bloklar hali bir-birining ostida. Ularni ustunlarga bo'lamiz. Qarang.", 'В контейнере блоки ещё друг под другом. Разделим их на колонки. Смотри.', 'Inside the container the blocks are still stacked. Let’s split them into columns. Watch.'),
    sayRow: L3("row qo'shdim, ya'ni qator degani. Hozircha hech narsa o'zgarmadi: ustunlar hali yo'q.", 'Добавил row, то есть ряд. Пока ничего не изменилось: колонок ещё нет.', 'I added row, which means a row. Nothing changed yet: there are no columns.'),
    sayCol: L3("Endi har bir blokka col yozdim, ya'ni ustun degani. Mana! Qator uchta teng ustunga bo'lindi. Ichida flex, xuddi to'rtinchi darsdagidek.", 'А теперь каждому блоку написал col, то есть колонка. Вот! Ряд разделился на три равные колонки. Внутри flex, как на четвёртом уроке.', 'Now I gave each block col, meaning a column. There! The row split into three equal columns. There’s flex inside, just like lesson four.'),
    done: L3("Eslab qoling: container ichida row, row ichida col.", 'Запомни: в container — row, в row — col.', 'Remember: row goes inside container, col inside row.'),
    askStart: L3("Qarang: bloklar ostma-ost", 'Смотри: блоки друг под другом', 'Watch: blocks stacked'),
    askRow: L3('Qarang: row', 'Смотри: row', 'Watch: row'),
    askCol: L3('Qarang: col', 'Смотри: col', 'Watch: col'),
    askDone: L3('container → row → col', 'container → row → col', 'container → row → col')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Ustunlar sonini o'zingiz o'zgartiring. Pastdagi raqamlarni bosing va kengliklarga qarang. Uchta har xil sonni sinang.",
      'Меняй число колонок сам. Нажимай числа внизу и смотри на ширину. Попробуй три разных числа.',
      'Change the number of columns yourself. Tap the numbers below and watch the widths. Try three different numbers.'),
    each: L3("Har bir ustun qatorning taxminan {w} foizi.", 'Каждая колонка — примерно {w} процентов ряда.', 'Each column is about {w} percent of the row.'),
    ok: L3("Ajoyib! col qatorni o'zi teng bo'ladi, nechta bo'lsa ham.", 'Отлично! col сам делит ряд поровну, сколько бы их ни было.', 'Great! col shares the row equally by itself, however many there are.'),
    done: L3("Endi setkani Bootstrap saytidan qanday olishni ko'ramiz.", 'Теперь посмотрим, как взять сетку с сайта Bootstrap.', 'Now let’s see how to take the grid from the Bootstrap site.'),
    hints: [
      L3("Pastdagi raqamlarni bosing.", 'Нажимай числа внизу.', 'Tap the numbers below.'),
      L3("Uchta har xil raqamni bosing.", 'Нажми три разных числа.', 'Tap three different numbers.'),
      L3("Masalan: 1, 2 va 4.", 'Например: 1, 2 и 4.', 'For example: 1, 2 and 4.')
    ],
    ask: L3("Uchta har xil sonni sinang", 'Попробуй три разных числа', 'Try three different numbers'),
    askDone: L3("col — teng ustunlar", 'col — равные колонки', 'col: equal columns'),
    colsH: L3('Ustunlar', 'Колонки', 'Columns')
  },
  g1: {
    eyebrow: L3('Grid sahifasi', 'Страница Grid', 'The Grid page'),
    help: [
      L3("Menyudagi Layout bo'limiga, Grid sahifasiga va nusxa olish belgisiga qarang.", 'Посмотри на раздел Layout в меню, на страницу Grid и на значок копирования.', 'Look at Layout in the menu, the Grid page and the copy icon.'),
      L3("Setka Layout bo'limida, ya'ni sahifa tuzilishi degani. Misolda container, row va uchta col.", 'Сетка — в разделе Layout, то есть «устройство страницы». В примере container, row и три col.', 'The grid is in Layout, meaning the page structure. The example has container, row and three col.'),
      L3("Bu uy rejasiga o'xshaydi: oldin xonalar chiziladi, keyin mebel qo'yiladi.", 'Это как план дома: сначала чертят комнаты, потом ставят мебель.', 'It’s like a house plan: first you draw the rooms, then add the furniture.')
    ],
    say: L3("Setkani saytdan olamiz. U boshqa bo'limda: Layout. Qarang.", 'Сетку возьмём с сайта. Она в другом разделе: Layout. Смотри.', 'Let’s take the grid from the site. It’s in another section: Layout. Watch.'),
    sayPage: L3("Layout bo'limida Grid sahifasi. Birinchi misol: uchta Column. Kodda container, row va uchta col.", 'В разделе Layout — страница Grid. Первый пример: три Column. В коде container, row и три col.', 'In Layout there’s the Grid page. The first example: three Columns. The code has container, row and three col.'),
    sayPaste: L3("Nusxa olish belgisini bosdim va kodni body ichiga qo'ydim. Uchta ustun chiqdi, hammasida Column yozuvi.", 'Нажал значок копирования и вставил код в body. Появились три колонки, во всех надпись Column.', 'I tapped the copy icon and pasted the code into body. Three columns appeared, each saying Column.'),
    sayText: L3("Column o'rniga o'z bloklarimizni yozdim: robotlar, jadval, aloqa.", 'Вместо Column написал свои блоки: роботы, расписание, контакты.', 'Instead of Column I wrote our own blocks: robots, schedule, contacts.'),
    done: L3("Eslab qoling: setka Layout bo'limida, Grid sahifasida.", 'Запомни: сетка — в разделе Layout, на странице Grid.', 'Remember: the grid is in Layout, on the Grid page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Layout → Grid', 'Смотри: Layout → Grid', 'Watch: Layout → Grid'),
    askPage: L3('Qarang: misol', 'Смотри: пример', 'Watch: the example'),
    askPaste: L3("Qarang: body ichiga qo'yildi", 'Смотри: вставлено в body', 'Watch: pasted into body'),
    askText: L3("Qarang: o'z matnimiz", 'Смотри: свой текст', 'Watch: our own text'),
    askDone: L3('Layout → Grid', 'Layout → Grid', 'Layout → Grid')
  },
  t1: {
    eyebrow: L3("Setkani yig'ing", 'Собери сетку', 'Build the grid'),
    say: L3("Endi o'zingiz. Namunaga qarang va bo'sh joyga yetishmayotgan so'zni yozing.", 'Теперь сам. Посмотри на образец и впиши в пустое место недостающее слово.', 'Now you. Look at the goal and type the missing word into the empty spot.'),
    ask1: L3("Chetlarda bo'sh joy bo'lsin, bloklar o'rtada", 'По краям — поля, блоки посередине', 'Margins at the edges, blocks in the middle'),
    ask2: L3("Bloklar qatorga tizilsin", 'Блоки — в ряд', 'Put the blocks in a row'),
    ask3: L3("Uchinchi blok ham ustun bo'lsin", 'Третий блок — тоже колонка', 'Make the third block a column too'),
    hints1: [
      L3("Eng tashqi quti — konteyner.", 'Самая внешняя коробка — контейнер.', 'The outermost box is the container.'),
      L3("Inglizcha container.", 'По-английски container.', 'In English: container.'),
      L3("Yozing: container", 'Впиши: container', 'Type: container')
    ],
    hints2: [
      L3("Ustunlar qator ichida turadi.", 'Колонки стоят внутри ряда.', 'Columns sit inside a row.'),
      L3("Qator inglizcha row.", 'Ряд по-английски — row.', 'Row in English is row.'),
      L3("Yozing: row", 'Впиши: row', 'Type: row')
    ],
    hints3: [
      L3("Qolgan ikkita blokda qaysi so'z bor?", 'Какое слово у двух других блоков?', 'Which word do the other two blocks have?'),
      L3("Ustun inglizcha column, qisqasi col.", 'Колонка по-английски column, коротко col.', 'Column in English is column, col for short.'),
      L3("Yozing: col", 'Впиши: col', 'Type: col')
    ],
    why1: L3("container sahifani o'rtaga yig'di.", 'container собрал страницу посередине.', 'container gathered the page in the middle.'),
    why2: L3("row qator yasadi, col lar unga tizildi.", 'row сделал ряд, колонки встали в него.', 'row made a row, and the columns lined up in it.'),
    why3: L3("col uchinchi ustunni yasadi.", 'col сделал третью колонку.', 'col made the third column.'),
    done: L3("Qoyil! container, row va col — setkaning uchta qavati.", 'Класс! container, row и col — три этажа сетки.', 'Nice! container, row and col are the grid’s three layers.')
  },
  s7: {
    eyebrow: L3("12 bo'lak", '12 частей', '12 parts'),
    help: [
      L3("col dan keyingi raqamga va ustun kengligiga qarang.", 'Посмотри на число после col и на ширину колонки.', 'Look at the number after col and the column’s width.'),
      L3("Qator 12 bo'lakka bo'lingan. col-6 — 12 dan 6 tasi, ya'ni yarmi degani. Qolganini oddiy col lar teng bo'lib oladi.", 'Ряд поделён на 12 частей. col-6 — 6 из 12, то есть половина. Остальное поровну делят простые col.', 'The row is split into 12 parts. col-6 is 6 of 12, meaning half. Plain col columns share the rest equally.'),
      L3("Bu 12 bo'lakli pitsaga o'xshaydi: kimgadir 6, kimgadir 3 bo'lak.", 'Это как пицца из 12 кусков: кому-то 6, кому-то 3.', 'It’s like a 12-slice pizza: someone gets 6 slices, someone gets 3.')
    ],
    say: L3("Ustunlar har doim teng bo'lishi shart emas. Bootstrap qatorni 12 bo'lakka bo'ladi. Qarang.", 'Колонки не обязаны быть равными. Bootstrap делит ряд на 12 частей. Смотри.', 'Columns don’t have to be equal. Bootstrap splits a row into 12 parts. Watch.'),
    say6: L3("O'rtadagi ustunga col-6 yozdim: u 12 bo'lakdan 6 tasini, ya'ni yarmini oldi degani. Chetdagilar qolganini teng bo'lishdi.", 'Средней колонке написал col-6: она взяла 6 частей из 12, то есть половину. Крайние поровну поделили остальное.', 'I gave the middle column col-6: it took 6 of the 12 parts, half. The outer ones shared the rest.'),
    say84: L3("Endi ikkita ustun: col-8 va col-4. Sakkiz qo'shuv to'rt — o'n ikki, butun qator.", 'А теперь две колонки: col-8 и col-4. Восемь и четыре — двенадцать, весь ряд.', 'Now two columns: col-8 and col-4. Eight and four make twelve, the whole row.'),
    done: L3("Eslab qoling: raqam — 12 dan nechta bo'lak.", 'Запомни: число — сколько частей из 12.', 'Remember: the number is how many parts out of 12.'),
    askStart: L3("Qarang: teng ustunlar", 'Смотри: равные колонки', 'Watch: equal columns'),
    ask6: L3('Qarang: col-6', 'Смотри: col-6', 'Watch: col-6'),
    ask84: L3('Qarang: col-8 va col-4', 'Смотри: col-8 и col-4', 'Watch: col-8 and col-4'),
    askDone: L3("col-N — 12 dan N bo'lak", 'col-N — N частей из 12', 'col-N: N parts of 12')
  },
  t2: {
    eyebrow: L3('Kenglik', 'Ширина', 'Width'),
    say: L3("Namunaga qarang va ustunga kerakli kenglikni yozing. 12 bo'lak esingizdami?", 'Посмотри на образец и впиши колонке нужную ширину. Помни про 12 частей.', 'Look at the goal and give the column the right width. Remember the 12 parts.'),
    ask1: L3("O'rtadagi ustun yarmini olsin", 'Средняя колонка — половина', 'The middle column takes half'),
    ask2: L3("Birinchi ustun keng bo'lsin, ikkinchisi col-4", 'Первая колонка широкая, вторая col-4', 'The first column is wide, the second col-4'),
    hints1: [
      L3("Yarmi — 12 dan nechta?", 'Половина — сколько из 12?', 'Half is how many of 12?'),
      L3("12 ning yarmi 6.", 'Половина от 12 — 6.', 'Half of 12 is 6.'),
      L3("Yozing: col-6", 'Впиши: col-6', 'Type: col-6')
    ],
    hints2: [
      L3("Ikkalasi birga 12 bo'lishi kerak.", 'Вместе должно быть 12.', 'Together they must make 12.'),
      L3("12 dan 4 ni olsak, 8 qoladi.", '12 минус 4 — это 8.', '12 minus 4 is 8.'),
      L3("Yozing: col-8", 'Впиши: col-8', 'Type: col-8')
    ],
    why1: L3("col-6 — 12 dan 6, ya'ni yarmi degani.", 'col-6 — 6 из 12, то есть половина.', 'col-6 is 6 of 12, meaning half.'),
    why2: L3("col-8 va col-4 birga 12, butun qator.", 'col-8 и col-4 вместе 12, весь ряд.', 'col-8 and col-4 together make 12, the whole row.'),
    done: L3("Zo'r! Ustun kengligini o'zingiz tanlay olasiz.", 'Огонь! Ширину колонки ты выбираешь сам.', 'Awesome! You can pick a column’s width yourself.')
  },
  s9: {
    eyebrow: L3('Telefonda', 'На телефоне', 'On a phone'),
    help: [
      L3("Ekran kengligiga va class dagi md: qismiga qarang.", 'Посмотри на ширину экрана и на часть md: в class.', 'Look at the screen width and the md: part in class.'),
      L3("md:col-4 degani: 768 pikseldan keng ekranda col-4, torroqda ustun yo'q, bloklar ostma-ost.", 'md:col-4 значит: на экране шире 768 пикселей — col-4, а на узком колонок нет, блоки друг под другом.', 'md:col-4 means: on screens wider than 768 pixels it’s col-4; on narrower ones there are no columns, the blocks stack.'),
      L3("Bu yig'iladigan stolga o'xshaydi: keng xonada ochiladi, tor xonada yig'ilib turadi.", 'Это как раскладной стол: в большой комнате раскладывают, в тесной он сложен.', 'It’s like a folding table: opened in a big room, folded in a small one.')
    ],
    say: L3("Telefonda qarang: uchta ustun juda tor, matn siqilib qoldi. Telefonda bloklar ostma-ost bo'lgani yaxshi. Qarang, buni qanday qilamiz.",
      'Посмотри на телефоне: три колонки очень узкие, текст зажат. На телефоне лучше, чтобы блоки шли друг под другом. Смотри, как это сделать.',
      'Look on a phone: three columns are very narrow, the text is squeezed. On a phone it’s better if the blocks stack. Watch how we do it.'),
    sayMd: L3("col-4 o'rniga md:col-4 yozdim. md, ya'ni o'rta ekran degani, 768 pikseldan boshlab. Telefon torroq, shuning uchun bloklar ostma-ost.", 'Вместо col-4 написал md:col-4. md — значит средний экран, от 768 пикселей. Телефон уже, поэтому блоки друг под другом.', 'Instead of col-4 I wrote md:col-4. md means a medium screen, from 768 pixels. A phone is narrower, so the blocks stack.'),
    say768: L3("Planshetda ekran 768 piksel: endi uchta ustun.", 'На планшете экран 768 пикселей: теперь три колонки.', 'On a tablet the screen is 768 pixels: now there are three columns.'),
    sayOld: L3("Noutbukda ham uchta ustun. Diqqat qiling: eski darslarda col-md-4 deb yozilgan. Bu beshinchi versiya. Oltinchisida ekran o'lchami oldinda, ikki nuqta bilan.", 'На ноутбуке тоже три колонки. Внимание: в старых уроках пишут col-md-4. Это пятая версия. В шестой размер экрана впереди, через двоеточие.', 'Three columns on a laptop too. Heads up: old tutorials write col-md-4. That’s version five. In version six the screen size comes first, with a colon.'),
    done: L3("Eslab qoling: md:col-4 — telefonda ostma-ost, planshetdan boshlab qatorda.", 'Запомни: md:col-4 — на телефоне друг под другом, с планшета — в ряд.', 'Remember: md:col-4 stacks on a phone and goes in a row from a tablet up.'),
    askTight: L3("Qarang: telefonda siqilgan", 'Смотри: на телефоне тесно', 'Watch: cramped on a phone'),
    askW: L3('Qarang: ekran {w} px', 'Смотри: экран {w} px', 'Watch: screen {w} px'),
    askStart: L3("Qarang: telefonda siqilgan", 'Смотри: на телефоне тесно', 'Watch: cramped on a phone'),
    askDone: L3('md:col-4 — 768 px dan qatorda', 'md:col-4 — в ряд с 768 px', 'md:col-4: a row from 768 px')
  },
  g2: {
    eyebrow: L3('Breakpoints sahifasi', 'Страница Breakpoints', 'The Breakpoints page'),
    help: [
      L3("Breakpoints jadvaliga va belgilangan md qatoriga qarang.", 'Посмотри на таблицу Breakpoints и на выделенную строку md.', 'Look at the Breakpoints table and the highlighted md row.'),
      L3("Jadvalda ekran o'lchamlari: sm 576, md 768, lg 1024, xl 1280 piksel. Shu so'zni col oldiga ikki nuqta bilan qo'yamiz.", 'В таблице размеры экранов: sm 576, md 768, lg 1024, xl 1280 пикселей. Это слово ставим перед col через двоеточие.', 'The table lists screen sizes: sm 576, md 768, lg 1024, xl 1280 pixels. We put that word before col with a colon.'),
      L3("Bu kiyim o'lchamlariga o'xshaydi: S, M, L.", 'Это как размеры одежды: S, M, L.', 'It’s like clothing sizes: S, M, L.')
    ],
    say: L3("md qayerdan olindi? Saytda ekran o'lchamlari jadvali bor. Qarang.", 'Откуда взялось md? На сайте есть таблица размеров экрана. Смотри.', 'Where did md come from? The site has a table of screen sizes. Watch.'),
    sayPage: L3("Layout bo'limida Breakpoints sahifasi. Jadvalda olti o'lcham: eng kichigidan eng kattasigacha.", 'В разделе Layout — страница Breakpoints. В таблице шесть размеров: от самого маленького до самого большого.', 'In Layout there’s the Breakpoints page. The table has six sizes, from smallest to largest.'),
    sayMd: L3("md, ya'ni Medium degani, o'rta ekran, 768 pikseldan boshlab. Planshet shu o'lchamda.", 'md — это Medium, средний экран, от 768 пикселей. Планшет как раз такой.', 'md stands for Medium, a medium screen from 768 pixels. A tablet is exactly that size.'),
    sayApply: L3("Kodimizda col-4 oldiga md va ikki nuqta qo'ydim. Telefonda bloklar darrov ostma-ost bo'ldi!", 'В нашем коде перед col-4 поставил md и двоеточие. На телефоне блоки сразу встали друг под другом!', 'In our code I put md and a colon before col-4. On the phone the blocks stacked right away!'),
    done: L3("Eslab qoling: ekran o'lchamlari Layout bo'limida, Breakpoints sahifasida.", 'Запомни: размеры экранов — в разделе Layout, на странице Breakpoints.', 'Remember: screen sizes are in Layout, on the Breakpoints page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Layout → Breakpoints', 'Смотри: Layout → Breakpoints', 'Watch: Layout → Breakpoints'),
    askPage: L3("Qarang: o'lchamlar jadvali", 'Смотри: таблица размеров', 'Watch: the size table'),
    askApply: L3('Qarang: md:col-4', 'Смотри: md:col-4', 'Watch: md:col-4'),
    askDone: L3('Layout → Breakpoints', 'Layout → Breakpoints', 'Layout → Breakpoints')
  },
  t3: {
    eyebrow: L3('Ekranga moslang', 'Подгони под экран', 'Fit the screen'),
    say: L3("Pastdagi tugmalar bilan ekran kengligini almashtirib ko'ring: ustunlar qaysi ekranda qatorga turishi kerak? Uchinchi blokka kerakli so'zni yozing. O'lchamlar jadvali saytda.", 'Переключай ширину экрана кнопками под кодом: на каком экране колонки должны встать в ряд? Впиши третьему блоку нужное слово. Таблица размеров — на сайте.', 'Switch the screen width with the buttons under the code: on which screen should the columns line up? Give the third block the right word. The size table is on the site.'),
    ask1: L3("360 da ostma-ost, 768 da qatorda", 'На 360 — столбиком, на 768 — в ряд', 'Stacked at 360, a row at 768'),
    ask2: L3("768 da ostma-ost, 1024 da qatorda", 'На 768 — столбиком, на 1024 — в ряд', 'Stacked at 768, a row at 1024'),
    hints1: [
      L3("Qolgan ikkita blokda qaysi so'z bor?", 'Какое слово у двух других блоков?', 'Which word do the other two blocks have?'),
      L3("Planshet bu md, 768 piksel.", 'Планшет — md, 768 пикселей.', 'A tablet is md, 768 pixels.'),
      L3("Yozing: md:col-4", 'Впиши: md:col-4', 'Type: md:col-4')
    ],
    hints2: [
      L3("Jadvalda 1024 pikselli o'lchamni toping.", 'Найди в таблице размер 1024 пикселя.', 'Find the 1024 pixel size in the table.'),
      L3("1024 — lg, ya'ni Large degani.", '1024 — это lg, Large.', '1024 is lg, Large.'),
      L3("Yozing: lg:col-4", 'Впиши: lg:col-4', 'Type: lg:col-4')
    ],
    why1: L3("md:col-4: telefonda ostma-ost, 768 dan qatorda.", 'md:col-4: на телефоне столбиком, с 768 в ряд.', 'md:col-4: stacked on a phone, a row from 768.'),
    why2: L3("lg:col-4: 1024 piksel dan oldin ostma-ost.", 'lg:col-4: до 1024 пикселей — столбиком.', 'lg:col-4: stacked below 1024 pixels.'),
    done: L3("Ajoyib! Endi sahifa har bir ekranga moslashadi.", 'Отлично! Теперь страница подстраивается под любой экран.', 'Great! Now the page adapts to any screen.')
  },
  s12: {
    eyebrow: L3('Hammasi birga', 'Всё вместе', 'All together'),
    help: [
      L3("Kodda sarlavha, row va kartochkalarga, sahifada ekran kengligiga qarang.", 'Посмотри в коде на шапку, row и карточки, а на странице — на ширину экрана.', 'Look at the header, row and cards in the code, and the screen width on the page.'),
      L3("Sarlavha — to'rtinchi darsdan, kartochkalar — beshinchidan, setka — bugungi dars. Hammasi bitta container ichida.", 'Шапка — с четвёртого урока, карточки — с пятого, сетка — сегодняшний урок. Всё в одном container.', 'The header is from lesson four, the cards from lesson five, the grid from today. All inside one container.'),
      L3("Bu konstruktorga o'xshaydi: tanish bo'laklardan yangi uy yig'iladi.", 'Это как конструктор: из знакомых деталей собирается новый дом.', 'It’s like a construction set: a new house built from familiar pieces.')
    ],
    say: L3("Endi o'rgangan hamma narsani bir joyga yig'amiz: sarlavha, kartochkalar va setka. Oldin telefonda qarang.", 'А теперь соберём всё изученное вместе: шапку, карточки и сетку. Сначала посмотри на телефоне.', 'Now let’s put everything we learned together: the header, the cards and the grid. First, look on a phone.'),
    sayTablet: L3("Planshetda kartochkalar uchta ustunga tizildi.", 'На планшете карточки встали в три колонки.', 'On a tablet the cards lined up in three columns.'),
    sayLaptop: L3("Noutbukda esa hammasi container ichida, o'rtada. Bu haqiqiy saytga o'xshaydi!", 'А на ноутбуке всё внутри container, посередине. Это похоже на настоящий сайт!', 'And on a laptop it’s all inside the container, in the middle. It looks like a real site!'),
    done: L3("Eslab qoling: bitta kod har bir ekranda o'zicha chiroyli ko'rinadi.", 'Запомни: один код красиво выглядит на каждом экране.', 'Remember: one code looks good on every screen.'),
    askW: L3('Qarang: ekran {w} px', 'Смотри: экран {w} px', 'Watch: screen {w} px'),
    askStart: L3('Qarang: telefonda', 'Смотри: на телефоне', 'Watch: on a phone'),
    askDone: L3('Bitta kod — hamma ekran', 'Один код — все экраны', 'One code, every screen')
  },
  t4: {
    eyebrow: L3("Tartib bilan yig'ing", 'Собери по порядку', 'Build in order'),
    say: L3("Setka kodini tartib bilan yig'ing: tashqaridan ichkariga, keyin ichkaridan tashqariga yopamiz.", 'Собери код сетки по порядку: снаружи внутрь, а потом закрываем изнутри наружу.', 'Build the grid code in order: from outside in, then close from inside out.'),
    ask: L3("Tashqaridan ichkariga oching, keyin teskarisiga yoping", 'Открывай снаружи внутрь, закрывай в обратном порядке', 'Open from outside in, then close in reverse order'),
    msgs: {
      cont: L3("Oldin eng tashqi quti: container.", 'Сначала самая внешняя коробка: container.', 'First the outermost box: container.'),
      row: L3("container ichida qator, row.", 'Внутри container — ряд, row.', 'Inside container comes the row.'),
      col: L3("row ichida ustun.", 'Внутри row — колонка.', 'Inside row comes the column.'),
      card: L3("Ustun ichida blok.", 'Внутри колонки — блок.', 'Inside the column goes the block.'),
      colc: L3("Endi yopamiz: oldin ustun.", 'Теперь закрываем: сначала колонку.', 'Now we close: the column first.'),
      rowc: L3("Keyin qator.", 'Потом ряд.', 'Then the row.'),
      contc: L3("Oxirida konteyner.", 'В конце контейнер.', 'Last, the container.')
    },
    hints: [
      L3("Tashqi qutidan boshlang.", 'Начни с внешней коробки.', 'Start with the outer box.'),
      L3("Tartib: container, row, ustun, blok, keyin teskarisiga yopish.", 'Порядок: container, row, колонка, блок, потом закрытие в обратном порядке.', 'The order: container, row, column, block, then close in reverse.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! Qutilar bir-birining ichida, xuddi matryoshkadek.", 'В точку! Коробки одна в другой, как матрёшка.', 'Spot on! Boxes inside boxes, like nesting dolls.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna, ekran kengligi uning sarlavhasida. Qaysi class lar shunday chizadi?", 'Маленькое испытание. Слева образец, ширина экрана в его заголовке. Какие class так нарисуют?', 'A little test. The goal is on the left, its screen width in the title. Which classes draw this?'),
    ask: L3('Qaysi class lar namunani chizadi?', 'Какие class рисуют образец?', 'Which classes draw the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Uchta teng ustun: col, col, col.", 'Три равные колонки: col, col, col.', 'Three equal columns: col, col, col.'),
      L3("O'rtadagisi yarmi: col, col-6, col.", 'Средняя — половина: col, col-6, col.', 'The middle one is half: col, col-6, col.'),
      L3("Planshetda uchta ustun: md:col-4.", 'На планшете три колонки: md:col-4.', 'Three columns on a tablet: md:col-4.'),
      L3("O'rtada, chetlarida joy: container.", 'Посередине, с полями: container.', 'Centered, with space at the sides: container.')
    ],
    no: {
      'col-3 · col-3 · col-3': L3("Har biri 12 dan 3, birga 9: o'ngda bo'sh joy qoldi.", 'Каждая 3 из 12, вместе 9: справа осталось пустое место.', 'Each is 3 of 12, together 9: empty space is left on the right.'),
      'row · row · row': L3("row qator, ustun emas: bloklar ostma-ost.", 'row — это ряд, а не колонка: блоки друг под другом.', 'row is a row, not a column: the blocks stack.'),
      'col-6 · col-6 · col-6': L3("Birga 18, 12 dan oshdi: uchinchisi keyingi qatorga tushdi.", 'Вместе 18, больше 12: третья упала на новую строку.', 'Together 18, more than 12: the third dropped to a new line.'),
      'col-6 · col · col': L3("Yarmi birinchisida, namunada esa o'rtadagisida.", 'Половина у первой, а в образце — у средней.', 'Half is on the first one, but in the goal it’s the middle one.'),
      'col · col · col': L3("Hammasi teng, namunada esa o'rtadagisi keng.", 'Все равные, а в образце средняя широкая.', 'All equal, but in the goal the middle one is wide.'),
      'col · col-8 · col-8': L3("Birga 16 dan ko'p, 12 dan oshdi: ustun pastga tushdi.", 'Вместе больше 12: колонка упала вниз.', 'Together more than 12: a column dropped down.'),
      'lg:col-4 ×3': L3("lg — 1024 piksel dan. Planshetda bloklar ostma-ost qoldi.", 'lg — с 1024 пикселей. На планшете блоки остались столбиком.', 'lg starts at 1024 pixels. On a tablet the blocks stayed stacked.'),
      'col-md-4 ×3': L3("Bu eski nom, beshinchi versiyadan: ishlamadi.", 'Это старое имя из пятой версии: не сработало.', 'That’s an old name from version five: it didn’t work.'),
      'md-col-4 ×3': L3("Chiziqcha emas, ikki nuqta kerak: md:col-4.", 'Нужен не дефис, а двоеточие: md:col-4.', 'It needs a colon, not a dash: md:col-4.'),
      'container-fluid': L3("container-fluid butun kenglikda, namunada esa o'rtada.", 'container-fluid во всю ширину, а в образце посередине.', 'container-fluid is full width, but the goal is centered.'),
      'contain': L3("Bunday class yo'q: sahifa chetdan chetgacha.", 'Такого class нет: страница от края до края.', 'There’s no such class: the page goes edge to edge.'),
      'row': L3("row qator yasaydi, sahifani o'rtaga yig'maydi.", 'row делает ряд, но не собирает страницу посередине.', 'row makes a row but doesn’t center the page.')
    },
    hint1: L3("Namunaga qarang: nechta ustun, qaysi biri keng, ekran qancha?", 'Посмотри на образец: сколько колонок, какая шире, какой экран?', 'Look at the goal: how many columns, which is wider, what screen?'),
    hint2: L3("Birga 12 bo'lsin, ekran o'lchami ikki nuqta bilan.", 'Вместе должно быть 12, размер экрана — через двоеточие.', 'Together it should be 12, and the screen size goes with a colon.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Setkani o'qiysiz va yozasiz.", 'Всё верно! Ты читаешь и пишешь сетку.', 'All correct! You can read and write the grid.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta setka kutilgandek chiqmadi, har birida sabab boshqa. Kodga qarang va sababini tanlang.", 'Последнее испытание. Три сетки получились не так, у каждой своя причина. Посмотри на код и выбери причину.', 'The last test. Three grids came out wrong, each for a different reason. Look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    opts: {
      noRow: L3("row yo'q", 'Нет row', 'No row'),
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5'),
      over: L3("12 dan oshib ketdi", 'Больше 12', 'More than 12')
    },
    rounds: [
      L3("Ustunlar row ichida emas, shuning uchun ular qatorga tizilmadi.", 'Колонки не внутри row, поэтому не встали в ряд.', 'The columns aren’t inside row, so they didn’t line up.'),
      L3("col-md-4 eski nom, beshinchi versiyadan. Oltinchisida md:col-4.", 'col-md-4 — старое имя из пятой версии. В шестой — md:col-4.', 'col-md-4 is an old name from version five. In version six it’s md:col-4.'),
      L3("col-8 va col-8 birga 16, 12 dan ko'p. Ikkinchi ustun keyingi qatorga tushdi.", 'col-8 и col-8 вместе 16, больше 12. Вторая колонка упала на следующую строку.', 'col-8 and col-8 make 16, more than 12. The second column dropped to the next line.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the site example.'),
    hint2: L3("row bormi? Nom yangi versiyadanmi? Raqamlar birga 12 dan oshmaydimi?", 'Есть ли row? Имя из новой версии? Числа вместе не больше 12?', 'Is there a row? Is the name from the new version? Do the numbers stay within 12?'),
    ok: L3("Hammasi to'g'ri! Endi setka buzilsa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если сетка сломается, причину найдёшь сам.', 'All correct! Now if a grid breaks, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z setkangiz", 'Своя сетка', 'Your own grid'),
    say: L3("Endi ustunlarni o'zingiz tanlang: oddiy col, col-4 yoki md:col-4. Pastdagi tugmalar bilan har xil ekranda tekshiring va «Tayyor»ni bosing.",
      'Теперь выбери колонки сам: простой col, col-4 или md:col-4. Проверь кнопками внизу на разных экранах и нажми «Готово».',
      'Now pick the columns yourself: plain col, col-4 or md:col-4. Check on different screens with the buttons below and tap “Done”.'),
    ask: L3("Uchala ustun uchun class yozing", 'Впиши class для всех трёх колонок', 'Type a class for all three columns'),
    hints: [
      L3("Bitta so'z, u col bilan bog'liq.", 'Одно слово, связанное с col.', 'One word, related to col.'),
      L3("Telefonda ostma-ost bo'lsin desangiz, oldiga ekran o'lchamini qo'ying.", 'Если хочешь столбиком на телефоне, поставь впереди размер экрана.', 'If you want them stacked on a phone, put a screen size in front.'),
      L3("Masalan: md:col-4. Keyin «Tayyor»ni bosing.", 'Например: md:col-4. Потом нажми «Готово».', 'For example: md:col-4. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning setkangiz.", 'Класс! Это твоя сетка.', 'Nice! This is your grid.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men telefon va noutbuk uchun ikkita alohida sayt kerak deb o'ylagandim? Afsuski, adashibman. Qarang: kod bitta, md:col-4 ham bitta, sahifa esa telefonda ham, planshetda ham, noutbukda ham o'zicha chiroyli.",
        'Вернёмся к загадке. Помнишь, я думал, что для телефона и ноутбука нужны два разных сайта? Увы, я ошибся. Смотри: код один, md:col-4 тоже один, а страница красивая и на телефоне, и на планшете, и на ноутбуке.',
        'Back to our riddle. Remember, I thought phones and laptops needed two separate sites? Sadly, I was wrong. Look: one code, one md:col-4, and the page looks good on a phone, a tablet and a laptop.'), k: 'riddle' },
      { text: L3("Qarang, mana sizning setkangiz!", 'Смотри, вот твоя сетка!', 'Look, here’s your grid!'), k: null },
      { text: L3("container sahifani o'rtaga yig'adi va kengligini cheklaydi.", 'container собирает страницу посередине и ограничивает ширину.', 'container centers the page and limits its width.'), k: 'cont' },
      { text: L3("row — qator, col — ustun. Raqam — 12 dan nechta bo'lak.", 'row — ряд, col — колонка. Число — сколько частей из 12.', 'row is a row, col a column. The number is how many parts of 12.'), k: 'grid' },
      { text: L3("md, lg kabi so'zlar ekran o'lchami: md:col-4 — planshetdan boshlab ustun.", 'Слова md, lg — размер экрана: md:col-4 — колонка с планшета.', 'Words like md and lg are screen sizes: md:col-4 is a column from a tablet up.'), k: 'resp' },
      { text: L3("Hammasi saytda, Layout bo'limida.", 'Всё это — на сайте, в разделе Layout.', 'It’s all on the site, in Layout.'), k: 'site' },
      { text: L3("Tabriklayman! Siz oltinchi darsni tugatdingiz. Keyingi darsda sayt menyusini, ya'ni Navbarni, va sahifa tugmalarini, ya'ni Paginationni yasaymiz. Ko'rishguncha!", 'Ура! Ты прошёл шестой урок. На следующем уроке сделаем меню сайта — Navbar — и кнопки страниц — Pagination. До встречи!', 'Hooray! You finished the sixth lesson. Next time we’ll make the site menu, Navbar, and the page buttons, Pagination. See you!'), k: null }
    ],
    roles: {
      cont: L3("container — o'rtada", 'container — посередине', 'container — centered'),
      grid: L3("row · col — 12 bo'lak", 'row · col — 12 частей', 'row · col — 12 parts'),
      resp: L3('md:col-4 — ekranga qarab', 'md:col-4 — по экрану', 'md:col-4 — by screen'),
      site: L3("So'zlar — Layout da", 'Слова — в Layout', 'Words are in Layout')
    },
    ask: L3('Setkangizga qarang', 'Посмотри на свою сетку', 'Look at your grid')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1,
  say1280: 1, say768: 1, say360: 1, sayRow: 1, sayCol: 1, each: 1, sayPage: 1, sayPaste: 1, sayText: 1, say6: 1, say84: 1, sayMd: 1, sayOld: 1, sayApply: 1, sayTablet: 1, sayLaptop: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs6-kit.jsx@*/

/*@FILE:bs6-site.jsx@*/

/*@FILE:bs6-head.jsx@*/

/*@FILE:bs6-common.jsx@*/

/*@FILE:bs6-screens.jsx@*/

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
/*@FILE:bs6.css@*/
`;
