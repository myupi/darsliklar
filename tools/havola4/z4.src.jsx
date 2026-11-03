// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 4 — «Ссылки и атрибуты»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/havola4/build.mjs → lessons/html/04-ssylki-i-atributy.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Ссылки и атрибуты» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Урок с нуля (черновики прежних уроков удалены заказчиком); основа кода —
// уроки 2–3. Облик — эталона «Редактор» (naborRedaktor); бумаги нет нигде.
// У Коди сайт из трёх страниц (главная, рецепт плова из урока 3, «Мои игры»), но названия на главной —
// простой текст, нажатие ничего не даёт. Ученик учит тег a и атрибут href, собирает меню, чинит
// сломанные ссылки и делает ссылку на свою страницу. Загадка (без имён): Коди обернул «Mening
// o'yinlarim» в a без href и уверен, что ссылка заработает; в выводе признаёт ошибку.
//
// ДУГА (17 экранов; экрана плана нет). Типы заданий — по разделу 3а навыка:
//   s1 крючок (текст → ссылки, переходы, загадка)
//   a и href:     s2 показ · s3 вписать имя файла (Fill in the Blanks) · s4 файлы к ссылкам меню (Drag & Drop)
//   атрибут:      s5 показ «из чего состоит» · s6 собрать href="…" (Code Builder) · s7 часть ↔ название (Matching Pairs)
//   поломки:      s8 показ «Файл не найден», нет </a> · s9 вписать </a> (Fill in the Blanks) · s10 до и после (Before / After)
//   своя ссылка:  s11 показ «по сайту» · s12 текст, s13 адрес mening.html (Live Code Preview) · s14 вернуть href (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: ссылка с href — синяя, подчёркнутая (так рисует любой браузер без CSS),
//     по нажатию открывает страницу, адрес в строке меняется, стрелка «назад» возвращает;
//     a без href — простой текст; нет такого файла — «Файл не найден»; без </a> ссылкой становится
//     и текст дальше.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ: havola — ссылка; atribut — атрибут («tegga qo'shimcha ma'lumot»); qiymat — значение
// (draft); manzil — адрес (draft); qo'shtirnoq — кавычки (draft); fayl nomi — имя файла.
// В речи тег a — «A», href — по-английски.
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
  inspector: L3('Qoida', 'Правило', 'Rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Rasmlar', 'Изображения', 'Images'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card, site.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт Коди — содержимое страниц в браузере (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    hello: L3('Salom! Bu mening saytim.', 'Привет! Это мой сайт.', 'Hi! This is my site.'),
    osh: L3('Osh retsepti', 'Рецепт плова', 'Plov recipe'),
    games: L3("Mening o'yinlarim", 'Мои игры', 'My games'),
    home: L3('Bosh sahifa', 'Главная', 'Home'),
    menu: L3('Menyu', 'Меню', 'Menu'),
    oshList: L3(['Guruch', "Go'sht", 'Sabzi'], ['Рис', 'Мясо', 'Морковь'], ['Rice', 'Meat', 'Carrots']),
    gamesList: L3(['Futbol', 'Shaxmat', 'Minecraft'], ['Футбол', 'Шахматы', 'Minecraft'], ['Football', 'Chess', 'Minecraft']),
    mineHello: L3('Salom! Bu mening sahifam.', 'Привет! Это моя страница.', 'Hi! This is my page.'),
    nf: L3('Fayl topilmadi', 'Файл не найден', 'File not found'),
    nfText: L3('{f} fayli topilmadi. Manzilni tekshiring.', 'Файл {f} не найден. Проверь адрес.', 'The file {f} wasn’t found. Check the address.'),
    filesH: L3('Fayllar', 'Файлы', 'Files')
  },
  s1: {
    eyebrow: L3("Bosilmaydigan so'zlar", 'Слова не нажимаются', 'Words that don’t click'),
    say: L3("Salom! O'tgan darsda ro'yxatlar tuzdik. Endi menda butun sayt bor: bosh sahifa, osh retsepti va o'yinlarim sahifasi. Lekin qarang: bosh sahifadagi nomlarni bossangiz, hech narsa bo'lmaydi. Ular oddiy matn bo'lib turibdi. Keling, ularni jonlantiramiz. «Aylantirish» tugmasini bosing.",
      'Привет! На прошлом уроке мы делали списки. А теперь у меня целый сайт: главная, рецепт плова и страница с моими играми. Но смотри: нажимаешь названия на главной — ничего не происходит. Это просто текст. Давай их оживим. Нажми «Превратить».',
      'Hi! Last time we made lists. Now I have a whole site: a home page, a plov recipe and a page with my games. But look: tap the names on the home page and nothing happens. They’re just text. Let’s bring them to life. Tap “Transform”.'),
    magic: L3("Voy, qarang! Nomlar ko'k rangga kirdi, tagiga chiziq tushdi. Endi ular havola bo'ldi.", 'Ого, смотри! Названия стали синими и подчёркнутыми. Теперь это ссылки.', 'Whoa, look! The names turned blue and underlined. Now they’re links.'),
    magicP: L3("Havolani bosib ko'ring: boshqa sahifa ochiladi. Tepadagi strelka bilan esa orqaga qaytasiz.", 'Нажми ссылку — откроется другая страница. А стрелкой вверху вернёшься назад.', 'Tap a link and another page opens. The arrow at the top takes you back.'),
    done: L3("Bugun shunday havolalar yasashni o'rganasiz va o'z sahifangizga havola qilasiz. Lekin oldin kichik topishmoq. Men o'yinlarim sahifasiga havola yasamoqchi bo'ldim va Mening o'yinlarim so'zlarini a tegiga o'rab qo'ydim, xolos. Menimcha, endi uni bossangiz, o'yinlar sahifasi ochiladi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делать такие ссылки и сделаешь ссылку на свою страницу. Но сначала маленькая загадка. Я хотел сделать ссылку на страницу с играми и просто обернул слова «Мои игры» в тег a. По-моему, теперь нажмёшь — и откроются игры. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make links like these and link to your own page. But first, a little riddle. I wanted a link to my games page, so I just wrapped the words “My games” in the a tag. I think if you tap it now, the games page opens. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Havolani bosib ko'ring", 'Нажми ссылку', 'Tap a link')
  },
  s2: {
    eyebrow: L3('a tegi va href', 'Тег a и href', 'The a tag and href'),
    say: L3("Keling, birinchi havolani birga yasaymiz. Havola, ya'ni bosilganda boshqa sahifaga olib boradigan so'z degani. Uni yasash uchun a tegi bor. Qarang, Osh retsepti so'zlarini a tegiga o'raymiz.",
      'Давай сделаем первую ссылку вместе. Ссылка — это слово, которое по нажатию ведёт на другую страницу. Для неё есть тег a. Смотри, оборачиваем слова «Рецепт плова» в тег a.',
      'Let’s make the first link together. A link is a word that takes you to another page when you tap it. There’s the a tag for that. Watch, we wrap the words “Plov recipe” in the a tag.'),
    sayA: L3("Lekin qarang: brauzerda hech narsa o'zgarmadi. Chunki a tegi qayerga borishni hali bilmaydi. Unga manzil kerak bo'ladi.",
      'Но смотри: в браузере ничего не изменилось. Потому что тег a ещё не знает, куда вести. Ему нужен адрес.',
      'But look: nothing changed in the browser, because the a tag doesn’t know where to go yet. It needs an address.'),
    sayHref: L3("Manzilni href atributi aytadi. href inglizcha hypertext reference so'zlaridan olingan, ya'ni havola manzili degani. Qo'shtirnoq ichiga sahifaning fayl nomini yozamiz: osh.html. Endi so'z ko'k bo'ldi, tagiga chiziq tushdi. Qarang, brauzer o'zi bosib ko'radi.",
      'Адрес задаёт атрибут href. href — от английского hypertext reference, то есть адрес ссылки. В кавычках пишем имя файла страницы: osh.html. Теперь слово синее и подчёркнутое. Смотри, браузер сам нажмёт.',
      'The href attribute gives the address. href comes from hypertext reference: the link’s address. In the quotes we write the page’s file name: osh.html. Now the word is blue and underlined. Watch, the browser taps it.'),
    done: L3("Retsept ochildi, keyin strelka bilan orqaga qaytdik. Eslab qoling: a tegi havola yasaydi, href esa qayerga borishni aytadi.",
      'Рецепт открылся, потом стрелкой вернулись назад. Запомни: тег a делает ссылку, а href говорит, куда вести.',
      'The recipe opened, then the arrow took us back. Remember: the a tag makes a link, and href says where it goes.'),
    askA: L3('Qarang: a tegi', 'Смотри: тег a', 'Watch: the a tag'),
    askHref: L3('Qarang: href atributi', 'Смотри: атрибут href', 'Watch: the href attribute'),
    askDone: L3('a — havola, href — manzil', 'a — ссылка, href — адрес', 'a — link, href — address')
  },
  s3: {
    eyebrow: L3('Manzilni yozing', 'Впиши адрес', 'Type the address'),
    say: L3("Endi navbat sizga. Mening o'yinlarim havolasida manzil yo'q: href qo'shtirnog'i bo'sh turibdi. Pastdagi fayllar ro'yxatidan kerakli faylni toping va uning nomini qo'shtirnoq ichiga yozing.",
      'Теперь твоя очередь. У ссылки «Мои игры» нет адреса: кавычки href пустые. Найди нужный файл в списке файлов внизу и впиши его имя в кавычки.',
      'Now it’s your turn. The “My games” link has no address: the href quotes are empty. Find the right file in the list of files below and type its name in the quotes.'),
    msgs: {
      empty: L3("Qo'shtirnoq ichiga fayl nomini yozing.", 'Впиши имя файла в кавычки.', 'Type the file name in the quotes.'),
      noExt: L3("Fayl nomi oxirida .html bo'ladi. Fayllar ro'yxatiga qarang.", 'Имя файла заканчивается на .html. Посмотри в список файлов.', 'A file name ends with .html. Look at the list of files.'),
      other: L3("Bu fayl boshqa sahifani ochadi. Bizga o'yinlar sahifasi kerak bo'ladi.", 'Этот файл открывает другую страницу. Нам нужна страница с играми.', 'That file opens another page. We need the games page.'),
      typo: L3("Bunday fayl yo'q. Nomni ro'yxatdagidek, harfma-harf yozing.", 'Такого файла нет. Напиши имя буква в букву, как в списке.', 'There’s no such file. Type the name letter by letter, as in the list.')
    },
    hints: [
      L3('Qaysi sahifa ochilishi kerak?', 'Какая страница должна открыться?', 'Which page should open?'),
      L3("O'yinlar sahifasining fayli fayllar ro'yxatida turibdi.", 'Файл страницы с играми есть в списке файлов.', 'The games page file is in the list of files.'),
      L3("Fayl nomi oyinlar.html bo'ladi. Uni qo'shtirnoq ichiga yozing.", 'Имя файла — oyinlar.html. Впиши его в кавычки.', 'The file name is oyinlar.html. Type it in the quotes.')
    ],
    ok: L3("Zo'r! Havola ishladi. Bosib ko'ring: o'yinlar sahifasi ochiladi.", 'Огонь! Ссылка работает. Нажми — откроется страница с играми.', 'Awesome! The link works. Tap it and the games page opens.'),
    ask: L3("Qo'shtirnoq ichiga fayl nomini yozing", 'Впиши имя файла в кавычки', 'Type the file name in the quotes')
  },
  s4: {
    eyebrow: L3('Menyuni ulang', 'Подключи меню', 'Wire up the menu'),
    say: L3("Sayt menyusida uchta havola bor, lekin ularning manzili yo'q. Har bir faylni o'z havolasiga olib boring: bosh sahifaga, retseptga va o'yinlarga.",
      'В меню сайта три ссылки, но у них нет адресов. Перетащи каждый файл к своей ссылке: к главной, к рецепту и к играм.',
      'The site menu has three links, but they have no addresses. Drag each file to its link: home, recipe and games.'),
    why: L3("{f} fayli {page} sahifasini ochadi. Uni boshqa havolaga qo'ying.", 'Файл {f} открывает страницу «{page}». Поставь его к другой ссылке.', 'The file {f} opens the “{page}” page. Put it on another link.'),
    hints: [
      L3('Har bir havola qaysi sahifani ochishi kerak?', 'Какую страницу должна открыть каждая ссылка?', 'Which page should each link open?'),
      L3("Fayl nomi sahifa nomiga o'xshaydi: osh, oyinlar, index.", 'Имя файла похоже на страницу: osh, oyinlar, index.', 'A file name looks like its page: osh, oyinlar, index.'),
      L3("index.html bosh sahifa bo'ladi, osh.html retsept, oyinlar.html esa o'yinlar.", 'index.html — главная, osh.html — рецепт, oyinlar.html — игры.', 'index.html is home, osh.html is the recipe, and oyinlar.html is games.')
    ],
    ok: L3("Barakalla! Menyu ishladi. Har bir havolani bosib, tekshirib ko'ring.", 'Молодец! Меню работает. Понажимай ссылки и проверь.', 'Well done! The menu works. Tap the links to check them.'),
    ask: L3('Fayllarni havolalarga olib boring', 'Перетащи файлы к ссылкам', 'Drag the files to the links'),
    askPlace: L3('Endi havolani bosing', 'Теперь нажми ссылку', 'Now tap a link'),
    pickFirst: L3('Oldin faylni bosing.', 'Сначала нажми файл.', 'Tap a file first.')
  },
  s5: {
    eyebrow: L3('Atribut', 'Атрибут', 'Attribute'),
    say: L3("Endi havolani yaqinroqdan ko'raylik. href bu atribut, ya'ni tegga qo'shimcha ma'lumot degani. Teg nima qilishni aytadi, atribut esa qanday qilishni aytadi. Keling, havolaning bo'laklarini birma-bir ko'ramiz.",
      'Теперь рассмотрим ссылку поближе. href — это атрибут, то есть дополнительные сведения для тега. Тег говорит, что делать, а атрибут — как. Разберём ссылку по кусочкам.',
      'Now let’s look closer at a link. href is an attribute: extra information for a tag. The tag says what to do, and the attribute says how. Let’s take the link apart piece by piece.'),
    sayTag: L3("Oldin teg nomi keladi: a. U brauzerga bu havola ekanini aytadi.", 'Сначала идёт имя тега: a. Оно говорит браузеру, что это ссылка.', 'First comes the tag name: a. It tells the browser this is a link.'),
    sayAttr: L3("Keyin bo'sh joy va atribut nomi keladi: href.", 'Потом пробел и имя атрибута: href.', 'Then a space and the attribute name: href.'),
    sayVal: L3("Undan keyin teng belgisi va qo'shtirnoq ichidagi qiymat keladi. Qiymat bu fayl nomi bo'ladi.", 'Дальше знак «равно» и значение в кавычках. Значение — это имя файла.', 'Then the equals sign and the value in quotes. The value is the file name.'),
    sayClose: L3("Diqqat qiling: atribut faqat ochuvchi teg ichida bo'ladi. Yopuvchi tegda atribut bo'lmaydi.", 'Внимание: атрибут бывает только в открывающем теге. В закрывающем атрибутов нет.', 'Note: an attribute only goes in the opening tag. The closing tag has no attributes.'),
    done: L3("Demak, havola shunday tuziladi: teg nomi, bo'sh joy, atribut nomi, teng belgisi va qo'shtirnoq ichida qiymat.",
      'Значит, ссылка устроена так: имя тега, пробел, имя атрибута, знак «равно» и значение в кавычках.',
      'So a link is built like this: the tag name, a space, the attribute name, the equals sign and the value in quotes.'),
    labels: {
      tag: L3('teg nomi', 'имя тега', 'tag name'),
      attr: L3('atribut nomi', 'имя атрибута', 'attribute name'),
      val: L3('qiymat', 'значение', 'value'),
      close: L3('atributsiz', 'без атрибутов', 'no attributes')
    },
    asks: {
      tag: L3('Qarang: teg nomi', 'Смотри: имя тега', 'Watch: the tag name'),
      attr: L3('Qarang: atribut nomi', 'Смотри: имя атрибута', 'Watch: the attribute name'),
      val: L3('Qarang: qiymat', 'Смотри: значение', 'Watch: the value'),
      close: L3('Qarang: yopuvchi teg', 'Смотри: закрывающий тег', 'Watch: the closing tag')
    },
    askStart: L3("Havolaning bo'laklariga qarang", 'Смотри на части ссылки', 'Watch the parts of the link'),
    askDone: L3('Teg nomi, atribut, qiymat', 'Имя тега, атрибут, значение', 'Tag name, attribute, value')
  },
  s6: {
    eyebrow: L3("Atributni yig'ing", 'Собери атрибут', 'Build the attribute'),
    say: L3("Endi atributni o'zingiz yig'ing. a tegidan keyin uchta bo'sh joy bor. Bo'laklarni to'g'ri tartibda qo'ying: atribut nomi, teng belgisi va qiymat.",
      'Теперь собери атрибут сам. После тега a три пустых места. Поставь куски по порядку: имя атрибута, знак «равно» и значение.',
      'Now build the attribute yourself. After the a tag there are three empty spots. Put the pieces in order: the attribute name, the equals sign and the value.'),
    why: {
      valFirst: L3("Qiymat oxirida keladi. Oldin atribut nomi bo'lishi kerak.", 'Значение идёт в конце. Сначала нужно имя атрибута.', 'The value goes last. The attribute name comes first.'),
      eqFirst: L3("Teng belgisi o'rtada turadi. Undan oldin atribut nomi keladi.", 'Знак «равно» стоит посередине. Перед ним — имя атрибута.', 'The equals sign goes in the middle. The attribute name comes before it.'),
      valEarly: L3('Hali erta. Atribut nomidan keyin teng belgisi keladi.', 'Рано. После имени атрибута идёт знак «равно».', 'Too early. The equals sign comes after the attribute name.')
    },
    hints: [
      L3('Atribut nima bilan boshlanadi?', 'С чего начинается атрибут?', 'What does an attribute start with?'),
      L3('Birinchi bo\'lib href, keyin teng belgisi keladi.', 'Сначала href, потом знак «равно».', 'First href, then the equals sign.'),
      L3("Tartib shunday bo'ladi: href, teng belgisi, keyin qo'shtirnoq ichida fayl nomi.", 'Порядок такой: href, знак «равно», потом имя файла в кавычках.', 'The order is: href, the equals sign, then the file name in quotes.')
    ],
    ok: L3("Ajoyib! Atribut to'g'ri yig'ildi, havola ham ishladi.", 'Отлично! Атрибут собран верно, и ссылка заработала.', 'Great! The attribute is built right, and the link works.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Havolaning uchta bo'lagi bor: a, href va qo'shtirnoq ichidagi qiymat. Har bir bo'lakni uning nomi bilan juftlang. Oldin bo'lakni bosing, keyin nomini bosing.",
      'У ссылки три части: a, href и значение в кавычках. Соедини каждую часть с её названием. Сначала нажми часть, потом название.',
      'A link has three parts: a, href and the value in quotes. Match each part with its name. Tap a part first, then its name.'),
    cards: {
      a: L3('Teg nomi: havola', 'Имя тега: ссылка', 'Tag name: link'),
      href: L3('Atribut nomi: manzil', 'Имя атрибута: адрес', 'Attribute name: address'),
      val: L3('Qiymat: fayl nomi', 'Значение: имя файла', 'Value: file name')
    },
    pairOk: {
      a: L3("To'g'ri! a teg nomi bo'ladi.", 'Верно! a — имя тега.', 'Right! a is the tag name.'),
      href: L3("To'g'ri! href atribut nomi bo'ladi.", 'Верно! href — имя атрибута.', 'Right! href is the attribute name.'),
      val: L3("To'g'ri! Qo'shtirnoq ichidagi fayl nomi qiymat bo'ladi.", 'Верно! Имя файла в кавычках — значение.', 'Right! The file name in quotes is the value.')
    },
    why: {
      a: L3('a bu teg nomi, u havola yasaydi.', 'a — это имя тега, он делает ссылку.', 'a is the tag name; it makes a link.'),
      href: L3('href bu atribut nomi, u manzilni aytadi.', 'href — это имя атрибута, он задаёт адрес.', 'href is the attribute name; it gives the address.'),
      val: L3("Qo'shtirnoq ichidagi yozuv qiymat bo'ladi, ya'ni fayl nomi degani.", 'То, что в кавычках, — значение, то есть имя файла.', 'What’s in the quotes is the value: the file name.')
    },
    hints: [
      L3("Qaysi bo'lak birinchi keladi?", 'Какая часть идёт первой?', 'Which part comes first?'),
      L3("a teg nomi, href esa atribut nomi bo'ladi.", 'a — имя тега, а href — имя атрибута.', 'a is the tag name, and href is the attribute name.'),
      L3("a teg nomi, href atribut nomi, qo'shtirnoq ichidagisi qiymat bo'ladi.", 'a — имя тега, href — имя атрибута, в кавычках — значение.', 'a is the tag name, href is the attribute name, and what’s in quotes is the value.')
    ],
    ok: L3("Qoyil! Havolaning hamma bo'lagini bilasiz.", 'Класс! Ты знаешь все части ссылки.', 'Brilliant! You know every part of a link.'),
    ask: L3("Bo'lakni uning nomi bilan juftlang", 'Соедини часть с её названием', 'Match each part with its name'),
    askPlace: L3('Endi uning nomini bosing', 'Теперь нажми её название', 'Now tap its name'),
    pickFirst: L3("Oldin bo'lakni bosing.", 'Сначала нажми часть.', 'Tap a part first.')
  },
  s8: {
    eyebrow: L3('Havola buzilsa', 'Когда ссылка ломается', 'When a link breaks'),
    say: L3("Havolalar ba'zan buziladi. Keling, eng ko'p uchraydigan ikkita xatoni ko'ramiz.", 'Ссылки иногда ломаются. Посмотрим на две самые частые ошибки.', 'Links sometimes break. Let’s look at the two most common mistakes.'),
    sayTypo: L3("Birinchisi: fayl nomida bitta harf tushib qoldi. osh.html o'rniga osh.htm yozildi. Qarang, brauzer bosib ko'radi.",
      'Первая: в имени файла пропала одна буква. Вместо osh.html написано osh.htm. Смотри, браузер нажмёт.',
      'The first: one letter is missing from the file name. It says osh.htm instead of osh.html. Watch, the browser taps it.'),
    sayNf: L3("Fayl topilmadi! Brauzer aynan yozilgan faylni qidiradi va harfma-harf solishtiradi. Bitta harf yetishmasa ham, sahifa ochilmaydi.",
      'Файл не найден! Браузер ищет ровно тот файл, что написан, буква в букву. Не хватает одной буквы — и страница не откроется.',
      'File not found! The browser looks for exactly the file that’s written, letter by letter. Even one missing letter and the page won’t open.'),
    sayClose: L3("Ikkinchisi: yopuvchi a tegi unutildi. Qarang, endi gapning qolgani ham havolaga aylandi. Chunki brauzer havola qayerda tugashini bilmaydi.",
      'Вторая: забыли закрывающий тег a. Смотри, теперь и остаток фразы стал ссылкой. Ведь браузер не знает, где ссылка кончается.',
      'The second: the closing a tag was forgotten. Look, now the rest of the sentence became a link too, because the browser doesn’t know where the link ends.'),
    done: L3("Demak, fayl nomini aniq yozing va havolani doim yopuvchi a tegi bilan yoping.", 'Значит, пиши имя файла точно и всегда закрывай ссылку закрывающим тегом a.', 'So write the file name exactly and always close the link with the closing a tag.'),
    tail: L3(' sahifasini oching.', ' — загляни туда.', ' — take a look.'),
    askTypo: L3('Qarang: fayl nomida xato', 'Смотри: ошибка в имени файла', 'Watch: a typo in the file name'),
    askClose: L3("Qarang: yopuvchi teg yo'q", 'Смотри: нет закрывающего тега', 'Watch: no closing tag'),
    askDone: L3('Aniq fayl nomi va yopuvchi teg', 'Точное имя файла и закрывающий тег', 'An exact file name and a closing tag')
  },
  s9: {
    eyebrow: L3('Havolani yoping', 'Закрой ссылку', 'Close the link'),
    say: L3("Voy, men yana yopuvchi tegni unutibman! Endi butun gap havolaga aylandi. Havola nomidan keyin yopuvchi a tegini yozing.",
      'Ой, я опять забыл закрывающий тег! Теперь вся фраза стала ссылкой. Напиши закрывающий тег a после названия ссылки.',
      'Oops, I forgot the closing tag again! Now the whole sentence is a link. Type the closing a tag after the link name.'),
    msgs: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchi tegda a harfidan oldin qiya chiziq «/» turadi.', 'Это открывающий тег. В закрывающем перед a стоит косая черта «/».', 'That’s the opening tag. The closing one has a slash “/” before a.'),
      needLt: L3("Teg chap «<» qavs bilan boshlanadi. Uni boshiga qo'shing.", 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      needGt: L3("Teg oxirida o'ng «>» qavs turadi. Uni oxiriga qo'shing.", 'В конце тега нужен уголок «>». Добавь его в конец.', 'A tag ends with the bracket “>”. Add it at the end.'),
      wrongName: L3("Teg ichida boshqa harf yozilgan. Bu yerda a kerak bo'ladi.", 'Внутри тега другая буква. Здесь нужна a.', 'There’s a different letter inside the tag. Here you need a.'),
      generic: L3('Qiya chiziq «/» birinchi burchakli qavsdan keyin darrov turadi.', 'Косая черта «/» стоит сразу после первого уголка.', 'The slash “/” goes right after the first bracket.')
    },
    hints: [
      L3('Havola qayerda tugashi kerak?', 'Где должна кончаться ссылка?', 'Where should the link end?'),
      L3("Yopuvchi teg o'sha harf bo'ladi, faqat qiya chiziq bilan.", 'Закрывающий тег — та же буква, но с косой чертой.', 'The closing tag is the same letter with a slash.'),
      L3("Oldin burchakli qavs, keyin qiya chiziq, keyin a va oxirida yana burchakli qavs qo'ying.", 'Сначала уголок, потом косая черта, потом a и в конце снова уголок.', 'First a bracket, then the slash, then a, and another bracket at the end.')
    ],
    ok: L3("Zo'r! Endi faqat havola nomi ko'k, gapning qolgani esa oddiy matn bo'lib qoldi.", 'Огонь! Теперь синее только название ссылки, а остальное — обычный текст.', 'Awesome! Now only the link name is blue, and the rest is plain text.'),
    ask: L3('Havola nomidan keyin yopuvchi a tegini yozing', 'Напиши закрывающий тег a после названия', 'Type the closing a tag after the link name'),
    tail: L3(' sahifasini oching.', ' — загляни туда.', ' — take a look.')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Endi ikkita holatga qarang: oldin va keyin. Kodda nimadir o'zgardi. Xo'sh, nima o'zgardi?",
      'Теперь посмотри на два состояния: до и после. В коде что-то изменилось. Ну и что именно?',
      'Now look at two states: before and after. Something changed in the code. So what changed?'),
    askQ: L3("Kodda nima o'zgardi?", 'Что изменилось в коде?', 'What changed in the code?'),
    ok: {
      href: L3("To'g'ri! href qo'shildi, matn havolaga aylandi.", 'Верно! Добавили href — текст стал ссылкой.', 'Right! href was added, so the text became a link.'),
      close: L3("To'g'ri! Yopuvchi a tegi havolani to'xtatdi.", 'Верно! Закрывающий a остановил ссылку.', 'Right! The closing a tag ended the link.'),
      val: L3("To'g'ri! Fayl nomi to'g'rilandi, sahifa ochildi.", 'Верно! Имя файла исправили — страница открылась.', 'Right! The file name was fixed, so the page opened.')
    },
    miss: {
      href: L3("Qarang: oldin oddiy matn edi, keyin havola bo'ldi. Havolani href atributi yasaydi.", 'Смотри: был обычный текст, стала ссылка. Ссылку делает атрибут href.', 'Look: it was plain text, then it became a link. The href attribute makes a link.'),
      close: L3("Qarang: keyin gapning qolgani oddiy matnga qaytdi. Buni yopuvchi a tegi qiladi.", 'Смотри: после остаток фразы снова стал обычным текстом. Это делает закрывающий a.', 'Look: after, the rest of the sentence became plain text again. The closing a tag does that.'),
      val: L3("Qarang: oldin fayl topilmagan edi, keyin sahifa ochildi. Demak, fayl nomi to'g'rilandi.", 'Смотри: сначала файл не нашёлся, потом страница открылась. Значит, исправили имя файла.', 'Look: first the file wasn’t found, then the page opened. So the file name was fixed.')
    },
    done: L3("Endi havola nimaga buzilishini bilasiz. Keyin butun saytni birga aylanib chiqamiz.", 'Теперь ты знаешь, почему ссылки ломаются. Дальше пройдёмся по всему сайту.', 'Now you know why links break. Next, let’s walk around the whole site.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After')
  },
  s11: {
    eyebrow: L3("Sayt bo'ylab", 'По сайту', 'Around the site'),
    say: L3("Mana, butun saytim tayyor. Keling, brauzer havolalar bo'ylab qanday yurishini ko'ramiz.", 'Вот весь мой сайт. Посмотрим, как браузер ходит по ссылкам.', 'Here’s my whole site. Let’s see how the browser walks through the links.'),
    order1: L3("Birinchi havola osh.html faylini ochdi. Manzil satrida ham fayl nomi o'zgardi.", 'Первая ссылка открыла файл osh.html. В адресной строке тоже сменилось имя файла.', 'The first link opened the file osh.html. The file name changed in the address bar too.'),
    order2: L3("Orqaga qaytdik, ikkinchi havola esa oyinlar.html faylini ochdi.", 'Вернулись назад, а вторая ссылка открыла файл oyinlar.html.', 'We went back, and the second link opened the file oyinlar.html.'),
    order3: L3("Demak, har bir havola o'z faylini ochadi, tepadagi strelka esa orqaga qaytaradi.", 'Значит, каждая ссылка открывает свой файл, а стрелка вверху возвращает назад.', 'So each link opens its own file, and the arrow at the top takes you back.'),
    ask: L3('Brauzer qanday yurishini kuzating', 'Смотри, как ходит браузер', 'Watch how the browser walks'),
    askDone: L3("Har bir havola o'z faylini ochadi", 'Каждая ссылка открывает свой файл', 'Each link opens its own file')
  },
  // Своя ссылка — два экрана: текст ссылки (по «Готово»), потом адрес своей страницы (по «Проверить»).
  s12: {
    eyebrow: L3('Havolangiz matni', 'Текст своей ссылки', 'Your link text'),
    say: L3("Endi o'zingizning havolangizni yasang. Sizning sahifangiz mening.html faylida turibdi. Oldin havola matnini yozing. Bu sahifada ko'rinadigan so'zlar bo'ladi. Keyin «Tayyor»ni bosing.",
      'Теперь сделай свою ссылку. Твоя страница лежит в файле mening.html. Сначала напиши текст ссылки — это слова, которые видны на странице. Потом нажми «Готово».',
      'Now make your own link. Your page is in the file mening.html. First type the link text: the words people see on the page. Then tap “Done”.'),
    ok: L3("Zo'r matn! Endi havolaga manzil beramiz.", 'Классный текст! Теперь дадим ссылке адрес.', 'Great text! Now let’s give the link an address.'),
    hints: [
      L3('Sahifangiz nima haqida? Shuni yozing.', 'О чём твоя страница? Это и напиши.', 'What is your page about? Write that.'),
      L3("Faqat so'z yozing, teglar joyida turibdi.", 'Пиши только слова — теги на месте.', 'Type only words: the tags are in place.'),
      L3("Masalan: Mening sahifam. Keyin «Tayyor»ni bosing.", 'Например: Моя страница. Потом нажми «Готово».', 'For example: My page. Then tap “Done”.')
    ],
    ask: L3('Havola matnini yozing va «Tayyor»ni bosing', 'Напиши текст ссылки и нажми «Готово»', 'Type the link text and tap “Done”'),
    ph: L3('Masalan: Mening sahifam', 'Например: Моя страница', 'For example: My page')
  },
  s13: {
    eyebrow: L3('Havolangiz manzili', 'Адрес своей ссылки', 'Your link’s address'),
    say: L3("Endi havolangizga manzil bering. Sahifangiz fayli fayllar ro'yxatida turibdi. Uning nomini qo'shtirnoq ichiga yozing va «Tekshirish»ni bosing.",
      'Теперь дай своей ссылке адрес. Файл твоей страницы есть в списке файлов. Впиши его имя в кавычки и нажми «Проверить».',
      'Now give your link an address. Your page’s file is in the list of files. Type its name in the quotes and tap “Check”.'),
    msgs: {
      empty: L3("Qo'shtirnoq ichiga fayl nomini yozing.", 'Впиши имя файла в кавычки.', 'Type the file name in the quotes.'),
      noExt: L3("Fayl nomi oxirida .html bo'ladi. Fayllar ro'yxatiga qarang.", 'Имя файла заканчивается на .html. Посмотри в список файлов.', 'A file name ends with .html. Look at the list of files.'),
      other: L3("Bu fayl boshqa sahifani ochadi. Bizga sizning sahifangiz kerak bo'ladi.", 'Этот файл открывает другую страницу. Нам нужна твоя страница.', 'That file opens another page. We need your page.'),
      typo: L3("Bunday fayl yo'q. Nomni ro'yxatdagidek, harfma-harf yozing.", 'Такого файла нет. Напиши имя буква в букву, как в списке.', 'There’s no such file. Type the name letter by letter, as in the list.')
    },
    hints: [
      L3('Sizning sahifangiz qaysi faylda turibdi?', 'В каком файле твоя страница?', 'Which file holds your page?'),
      L3("Fayllar ro'yxatida eng oxirgi fayl sizniki bo'ladi.", 'Последний файл в списке — твой.', 'The last file in the list is yours.'),
      L3("Fayl nomi mening.html bo'ladi. Uni qo'shtirnoq ichiga yozing.", 'Имя файла — mening.html. Впиши его в кавычки.', 'The file name is mening.html. Type it in the quotes.')
    ],
    ok: L3("Ajoyib! Havolangiz ishladi. Bosib ko'ring: sizning sahifangiz ochiladi.", 'Отлично! Твоя ссылка работает. Нажми — откроется твоя страница.', 'Great! Your link works. Tap it and your page opens.'),
    ask: L3("Qo'shtirnoq ichiga sahifangiz faylini yozing", 'Впиши в кавычки файл своей страницы', 'Type your page’s file in the quotes')
  },
  s14: {
    eyebrow: L3("Manzil yo'qoldi", 'Пропал адрес', 'The address is gone'),
    say: L3("Voy, men havolangizni tahrirlayotib atributni o'chirib yubordim! Endi u oddiy matn bo'lib qoldi. Yetishmayotgan bo'lakni a tegidan keyingi bo'sh joyga olib boring.",
      'Ой, я правил твою ссылку и стёр атрибут! Теперь это обычный текст. Перетащи недостающий кусок в пустое место после тега a.',
      'Oops, I was editing your link and deleted the attribute! Now it’s plain text. Drag the missing piece into the empty spot after the a tag.'),
    why: {
      name: L3("Bu faqat atribut nomi. Unga qiymat ham kerak bo'ladi, ya'ni fayl nomi degani.", 'Это только имя атрибута. Ему нужно ещё значение, то есть имя файла.', 'That’s only the attribute name. It also needs a value: the file name.'),
      val: L3("Bu faqat qiymat. Oldida atribut nomi va teng belgisi bo'lishi kerak.", 'Это только значение. Перед ним нужны имя атрибута и знак «равно».', 'That’s only the value. It needs the attribute name and the equals sign before it.')
    },
    ok: L3("Ana endi joyida! Havolangiz yana ishlaydi, bosib ko'ring.", 'Вот теперь порядок! Ссылка снова работает — нажми.', 'That’s it! Your link works again; tap it.'),
    ask: L3("Yetishmayotgan bo'lakni bo'sh joyga olib boring", 'Перетащи недостающий кусок в пустое место', 'Drag the missing piece into the empty spot')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, sayt menyusi, lekin unda xato bor. Brauzerga qarang: qaysi havola noto'g'ri? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот меню сайта, но в нём ошибка. Посмотри на браузер: какая ссылка не такая? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the site menu, but it has a bug. Look at the browser: which link is wrong? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi men menyudagi havolani bosdim, lekin fayl topilmadi. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Теперь я нажал ссылку в меню, а файл не нашёлся. Что сломано здесь?', 'Great, the first bug is found! Now I tapped a link in the menu, but the file wasn’t found. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan: href ham, fayl nomi ham joyida. Brauzerga qarang: buzilish qayerda?", 'Эта строка в порядке: есть и href, и имя файла. Посмотри на браузер: где поломка?', 'This line is fine: it has href and the file name. Look at the browser: where’s the problem?'),
    found: {
      noHref: L3("Topdingiz! Bu havolada href yo'q edi. Shuning uchun u oddiy matn bo'lib qolgan edi.", 'Нашёл! У этой ссылки не было href. Поэтому она была обычным текстом.', 'Found it! This link had no href. That’s why it was plain text.'),
      typo: L3("Topdingiz! Fayl nomida bitta harf yetishmayotgan edi. Shuning uchun brauzer faylni topa olmagan edi.", 'Нашёл! В имени файла не хватало буквы. Поэтому браузер не нашёл файл.', 'Found it! The file name was missing a letter. That’s why the browser couldn’t find the file.')
    },
    hints: {
      noHref: [
        L3("Brauzerga qarang: qaysi nom havolaga o'xshamaydi?", 'Посмотри на браузер: какое название не похоже на ссылку?', 'Look at the browser: which name doesn’t look like a link?'),
        L3("Ko'k bo'lmagan nomda href yo'q bo'ladi.", 'У несинего названия нет href.', 'The name that isn’t blue has no href.'),
        L3("Qaysi qatorda a tegida href yo'q?", 'В какой строке у тега a нет href?', 'Which line has an a tag without href?')
      ],
      typo: [
        L3('Manzil satriga qarang: qaysi fayl qidirildi?', 'Посмотри в адресную строку: какой файл искали?', 'Look at the address bar: which file was it looking for?'),
        L3("Fayl nomlari .html bilan tugaydi. Qaysi qatorda u boshqacha?", 'Имена файлов кончаются на .html. В какой строке иначе?', 'File names end with .html. Which line is different?'),
        L3("Uchinchi qatorga qarang: fayl nomi to'liqmi?", 'Посмотри на третью строку: имя файла полное?', 'Look at the third line: is the file name complete?')
      ]
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz havolalarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь ссылки как настоящий программист.', 'Super! Both bugs are found. You check links like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3('href atributi yopuvchi teg ichiga yoziladi.', 'Атрибут href пишут в закрывающем теге.', 'The href attribute goes in the closing tag.'), right: false,
        why: L3("Aslida href ochuvchi teg ichida bo'ladi. Yopuvchi tegda atribut bo'lmaydi.", 'На самом деле href стоит в открывающем теге. В закрывающем атрибутов нет.', 'Actually href goes in the opening tag. The closing tag has no attributes.') },
      { t: L3("href qiymati qo'shtirnoq ichida yoziladi.", 'Значение href пишут в кавычках.', 'The href value goes in quotes.'), right: true, code: 'ok',
        why: L3("Fayl nomi qo'shtirnoq ichida yoziladi, shunda brauzer uni aniq o'qiydi.", 'Имя файла пишут в кавычках — так браузер читает его точно.', 'The file name goes in quotes so the browser reads it exactly.') },
      { t: L3("a tegi href atributisiz ham havola bo'ladi.", 'Тег a и без href — ссылка.', 'The a tag is a link even without href.'), right: false, code: 'noHref',
        why: L3("href bo'lmasa, brauzer qayerga borishni bilmaydi va so'z oddiy matn bo'lib qoladi.", 'Без href браузер не знает, куда вести, и слово остаётся обычным текстом.', 'Without href the browser doesn’t know where to go, and the word stays plain text.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz a tegi va href atributini yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь тег a и атрибут href.', 'All correct! You know the a tag and the href attribute really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men Mening o'yinlarim so'zlarini a tegiga o'rab qo'ygan edim, xolos? Afsuski, men adashibman. href bo'lmasa, brauzer qayerga borishni bilmaydi, shuning uchun so'z oddiy matn bo'lib qoldi. Demak, havolaga doim href kerak bo'ladi.",
        'Вернёмся к загадке. Помнишь, я просто обернул «Мои игры» в тег a? Увы, я ошибся. Без href браузер не знает, куда вести, поэтому слова остались обычным текстом. Значит, ссылке всегда нужен href.',
        'Back to our riddle. Remember, I just wrapped “My games” in the a tag? Sadly, I was wrong. Without href the browser doesn’t know where to go, so the words stayed plain text. So a link always needs href.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning havolangiz! Bosib ko'ring.", 'Смотри, это твоя ссылка! Нажми её.', 'Look, this is your link! Tap it.'), k: null },
      { text: L3('a tegi havola yasaydi.', 'Тег a делает ссылку.', 'The a tag makes a link.'), k: 'a' },
      { text: L3('href atributi qayerga borishni aytadi.', 'Атрибут href говорит, куда вести.', 'The href attribute says where to go.'), k: 'href' },
      { text: L3("Qo'shtirnoq ichidagi qiymat esa fayl nomi bo'ladi.", 'А значение в кавычках — это имя файла.', 'And the value in quotes is the file name.'), k: 'val' },
      { text: L3("Tabriklayman! Endi sahifalaringiz bir-biriga ulandi. Keyingi darsda sahifaga rasm qo'yamiz. Ko'rishguncha!", 'Ура! Теперь твои страницы связаны друг с другом. На следующем уроке добавим на страницу картинку. До встречи!', 'Hooray! Now your pages are connected. Next time we’ll add a picture to the page. See you!'), k: null }
    ],
    roles: {
      a: L3('a — havola', 'a — ссылка', 'a — link'),
      href: L3('href — manzil', 'href — адрес', 'href — address'),
      val: L3('qiymat — fayl nomi', 'значение — имя файла', 'value — file name')
    },
    ask: L3('Havolangizga qarang', 'Посмотри на свою ссылку', 'Look at your link')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { why: 1, magic: 1, magicP: 1, msgs: 1, sayA: 1, sayHref: 1, sayTag: 1, sayAttr: 1, sayVal: 1, sayClose: 1,
  sayTypo: 1, sayNf: 1, askQ: 1, miss: 1, order1: 1, order2: 1, order3: 1, say2: 1, fine: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:z4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:z4.css@*/
`;
