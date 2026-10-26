// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Ссылки и атрибуты» — урок 4 курса HTML, проба
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node .claude/skills/novyy-urok/scripts/sobrat.mjs
//   tools/ssylki/ssylki.src.jsx lessons/test/06-ssylki-i-atributy.jsx
// Правится исходник tools/ssylki/ (ssylki.src.jsx, ln-own.css), а не этот файл.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Ссылки и атрибуты» · модуль 1 «Основы разметки» · ТЕСТ =====
//
// ЗАМЫСЕЛ. Коди сделал сайт школьного «Кино во дворе» из четырёх страниц, но
// страницы не связаны: гость застревает на главной. Ученик — веб-программист сайта:
// соединяет страницы ссылками, чинит адреса и делает меню своего сайта.
// Сценарий: docs/scenarij-test-06-ssylki-kino.md.
//
// ДУГА. Крючок (текст никуда не ведёт → то же слово в <a> открывает афишу) →
// план → части ссылки и слово «атрибут» (показ) → прогноз «без href» →
// проверить ссылки в браузере → починить адрес файлом из папки → набрать
// адрес → место атрибута → закрыть </a> → детектив → ссылка «На главную»
// целиком → меню своего сайта → сохранить → итог.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · СИСТЕМА СЛОВ: ссылка — тег a; адрес — атрибут href; атрибут —
//     настройка тега в открывающем теге; текст ссылки — то, что нажимают.
//   · МИНИ-БРАУЗЕР УРОКА (LnBrowser) — обёртка в стиле Chrome: адресная строка,
//     кнопка «назад», подсказка адреса внизу окна. Ссылки в нём нажимаются
//     честно: нужная страница, не та страница или «Страница не найдена».
//   · ПРЕВЬЮ ЧЕСТНОЕ: <a> без href — обычный текст; пустой href открывает ту же
//     страницу; незакрытая <a> делает ссылкой и абзац ниже; текст атрибута вне
//     тега виден на странице.
//   · ЦВЕТ ТЕГА a — коричневый #8A5A3C (свободный тон той же светлоты).
//   · ОЗВУЧКА: теги — по-английски во всех языках (A, H ref), имя файла —
//     «rules точка HTML» (spokenLn поверх spokenHtml урока 2).
//   · АРТЕФАКТ: главная своего сайта с меню из трёх ссылок.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты», EN — «you».
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
      const sv = v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : String(v);
      s = s.split('{' + k + '}').join(sv);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Tuzilma tekshiruvi', 'Проверка структуры', 'Structure check'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  save: L3('Saytni saqlash', 'Сохранить сайт', 'Save the site'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  back: L3('Orqaga', 'Назад', 'Back'),
  folder: L3('Sayt papkasi', 'Папка сайта', 'Site folder'),
  nf: L3('Sahifa topilmadi', 'Страница не найдена', 'Page not found'),
  nfP: L3('Saytda {f} fayli yo‘q.', 'Файла {f} нет на сайте.', 'There is no {f} file on this site.'),
  caseN: L3('Ish', 'Дело', 'Case'),
  test: L3('Havolalarni brauzerda bosib tekshirish mumkin', 'Ссылки можно проверить в браузере', 'You can test the links in the browser')
};

// ─────────────────────────────────────────────────────────────────────────────
// САЙТ «КИНО ВО ДВОРЕ»: файлы, названия страниц и тексты — на языке ученика.
// ─────────────────────────────────────────────────────────────────────────────
const FILES = ['index.html', 'films.html', 'rules.html', 'map.html'];
const PG = {
  'index.html': { name: L3('Bosh sahifa', 'Главная', 'Home'), title: L3('Hovlidagi kino', 'Кино во дворе', 'Yard Cinema'),
    text: L3('Har juma katta ekranda kino ko‘ramiz.', 'Каждую пятницу смотрим кино на большом экране.', 'Every Friday we watch a film on the big screen.') },
  'films.html': { name: L3('Afisha', 'Афиша', 'What’s on'), title: L3('Afisha', 'Афиша', 'What’s on'),
    text: L3('Juma — «Yulduzli yo‘l».', 'Пятница — «Звёздный маршрут».', 'Friday: Star Route.') },
  'rules.html': { name: L3('Qoidalar', 'Правила', 'Rules'), title: L3('Qoidalar', 'Правила', 'Rules'),
    text: L3('Shovqin qilmang va ortingizdan yig‘ishtiring.', 'Не шуми и убирай за собой.', 'Keep quiet and clean up after yourself.') },
  'map.html': { name: L3('Qayerdamiz', 'Как нас найти', 'Find us'), title: L3('Qayerdamiz', 'Как нас найти', 'Find us'),
    text: L3('Maktab hovlisi, katta daraxt yonida.', 'Школьный двор, у большого дерева.', 'The school yard, by the big tree.') }
};
const HOME = L3('Bosh sahifaga', 'На главную', 'Home');

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики героя звучат; подписи печатаются.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Sayt', 'Сайт', 'The site'),
    cast: [
      { pose: 'hello', text: L3('Salom! Men «Hovlidagi kino» uchun sayt yasadim. To‘rtta sahifa!', 'Привет! Я сделал сайт «Кино во дворе». Целых четыре страницы!', 'Hi! I made a site for Yard Cinema. Four whole pages!') },
      { pose: 'sorry', text: L3('Lekin mehmonlar bosh sahifada qolib ketyapti. Afishaga o‘tishga harakat qiling: «Afisha» so‘zini bosing.',
        'Но гости застревают на главной. Попробуй попасть на афишу: нажми слово «Афиша».',
        'But visitors get stuck on the home page. Try to get to the listings: tap the word What’s on.') }
    ],
    ask: L3('Sahifadagi «Afisha» ni bosing', 'Нажми «Афиша» на странице', 'Tap “What’s on” on the page'),
    ask2: L3('«Afisha» ni yana bir marta bosing', 'Нажми «Афиша» ещё раз', 'Tap “What’s on” once more'),
    askDone: L3('Havola boshqa sahifani ochdi', 'Ссылка открыла другую страницу', 'The link opened another page'),
    nothing: L3('Hech narsa bo‘lmadi — bu oddiy matn. Qarang, uni havolaga aylantiraman. Yana bosing!',
      'Ничего не случилось — это просто текст. Смотри, превращаю его в ссылку. Нажми ещё раз!',
      'Nothing happened: it’s just text. Watch, I’ll turn it into a link. Tap again!'),
    ok: L3('Ochildi! Havola boshqa sahifaga olib boradi. Bugun butun saytni havolalar bilan bog‘laymiz.',
      'Открылось! Ссылка ведёт на другую страницу. Сегодня соединим ссылками весь сайт.',
      'It opened! A link leads to another page. Today we’ll connect the whole site with links.')
  },

  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Saytni bog‘laymiz. Uch qadam.', 'Соединяем сайт. Три шага.', 'Let’s connect the site. Three steps.'),
    steps: [
      { icon: 'arrowR', text: L3('Sahifani ochadigan so‘z', 'Слово, которое открывает страницу', 'A word that opens a page'),
        say: L3('Avval oddiy so‘z qanday qilib boshqa sahifaga eshikka aylanishini bilib olamiz.', 'Сначала узнаем, как обычное слово превращается в дверь на другую страницу.', 'First we’ll find out how an ordinary word turns into a door to another page.') },
      { icon: 'doc', text: L3('Eshik qayerga olib boradi', 'Куда ведёт дверь', 'Where the door leads'),
        say: L3('Keyin bu eshik qayerga olib borishini o‘zimiz hal qilamiz.', 'Потом научимся сами решать, куда она ведёт.', 'Then we’ll learn to decide where it leads.') },
      { icon: 'browser', text: L3('O‘z saytingiz menyusi', 'Меню своего сайта', 'A menu for your own site'),
        say: L3('Oxirida o‘z saytingizga menyu yasaysiz.', 'А в конце сделаешь меню своего сайта.', 'And at the end you’ll make a menu for your own site.') }
    ],
    done: L3('Boshladik!', 'Поехали!', 'Let’s go!')
  },

  s3: {
    eyebrow: L3('Havola nimadan iborat', 'Из чего ссылка', 'What a link is made of'),
    cast: [
      { pose: 'point', text: L3('Mana havola kodi. Uning har bir qismini bosing va nima qilishini bilib oling.', 'Вот код ссылки. Нажми каждую её часть и узнай, что она делает.', 'Here’s the code of a link. Tap each part and find out what it does.') }
    ],
    ask: L3('Havolaning har bir qismini bosing', 'Нажми каждую часть ссылки', 'Tap each part of the link'),
    parts: {
      tag: L3('a — havola tegi', 'a — тег ссылки', 'a is the link tag'),
      href: L3('href — havola qayerga olib boradi', 'href — куда ведёт ссылка', 'href is where the link leads'),
      text: L3('Havola matni: u ko‘rinadi va uni bosishadi', 'Текст ссылки: его видно, на него нажимают', 'The link text: you see it and tap it'),
      close: L3('</a> — havola oxiri', '</a> — конец ссылки', '</a> ends the link')
    },
    tell: {
      tag: L3('Bu <a> tegi. Havola u bilan boshlanadi.', 'Это тег <a>. С него начинается ссылка.', 'This is the <a> tag. A link starts with it.'),
      href: L3('Bu manzil: havola olib boradigan sahifa fayli. Brauzer uni oyna pastida ko‘rsatadi.', 'А это адрес: файл страницы, куда ведёт ссылка. Браузер показывает его внизу окна.', 'This is the address: the page file the link leads to. The browser shows it at the bottom of the window.'),
      text: L3('Bu havola matni. U sahifada ko‘rinadi, uni bosishadi.', 'Это текст ссылки. Его видно на странице, на него и нажимают.', 'This is the link text. You see it on the page and tap it.'),
      close: L3('</a> esa havolani tugatadi.', 'А </a> заканчивает ссылку.', 'And </a> ends the link.')
    },
    done: L3('Esda tuting: href — bu atribut. Atribut — tegning sozlamasi. U ochuvchi teg ichida yoziladi, sahifada ko‘rinmaydi, lekin havola qayerga olib borishini hal qiladi.',
      'Запомни: href — это атрибут. Атрибут — настройка тега. Он пишется внутри открывающего тега, на странице его не видно, но он решает, куда ведёт ссылка.',
      'Remember: href is an attribute. An attribute is a setting of a tag. It goes inside the opening tag, it isn’t visible on the page, but it decides where the link leads.')
  },

  s4: {
    eyebrow: L3('Oldindan ayting', 'Угадай', 'Guess'),
    say: L3('href ni o‘chirsak nima bo‘ladi? Sizningcha, brauzer nimani ko‘rsatadi?', 'А если стереть href? Как думаешь, что покажет браузер?', 'What if we erase href? What do you think the browser will show?'),
    ask: L3('href siz nima bo‘ladi?', 'Что будет без href?', 'What happens without href?'),
    opts: {
      home: L3('Havola bosh sahifaga olib boradi', 'Ссылка поведёт на главную', 'The link will lead home'),
      text: L3('So‘z qoladi, lekin oddiy matnga aylanadi', 'Слово останется, но станет обычным текстом', 'The word stays, but becomes plain text'),
      gone: L3('So‘z yo‘qoladi', 'Слово исчезнет', 'The word will disappear')
    },
    right: L3('To‘g‘ri! href siz <a> qayerga olib borishni bilmaydi — bu endi havola emas.', 'Верно! Без href тег <a> не знает, куда вести, — это уже не ссылка.', 'Right! Without href, the <a> tag doesn’t know where to lead, so it’s no longer a link.'),
    miss: L3('Qarang: so‘z qoldi, lekin oddiy matn bo‘lib qoldi. href siz <a> qayerga olib borishni bilmaydi.', 'Смотри: слово осталось, но стало обычным текстом. Без href тег <a> не знает, куда вести.', 'Look: the word stayed, but it’s plain text now. Without href, the <a> tag doesn’t know where to lead.')
  },

  s5: {
    eyebrow: L3('Havolalarni tekshiring', 'Проверь ссылки', 'Test the links'),
    say: L3('Men bosh sahifaga uchta havola qo‘ydim. Ularni brauzerda bosib tekshiring: qaysi biri boshqa joyga olib boradi? Orqaga qaytish uchun — chapdagi o‘q.',
      'Я поставил на главную три ссылки. Проверь их в браузере: какая ведёт не туда? Вернуться назад — стрелка слева.',
      'I put three links on the home page. Test them in the browser: which one leads to the wrong place? To go back, use the arrow on the left.'),
    ask: L3('Havolalarni bosing va boshqa joyga olib boradiganini toping', 'Нажимай ссылки и найди ту, что ведёт не туда', 'Tap the links and find the one that leads to the wrong place'),
    okLink: L3('Bu havola joyida. Orqaga qayting va boshqasini tekshiring.', 'Эта ссылка в порядке. Вернись назад и проверь другую.', 'This link is fine. Go back and test another one.'),
    found: L3('Topildi! Matnda bir narsa, ochildi boshqasi. Kodga qarang: brauzer matnga emas, href ga qarab boradi.',
      'Нашлась! В тексте одно, а открылось другое. Посмотри в код: браузер идёт по href, а не по тексту ссылки.',
      'Found it! The text says one thing, but something else opened. Look at the code: the browser follows href, not the link text.')
  },

  s6: {
    eyebrow: L3('Manzilni tuzating', 'Почини адрес', 'Fix the address'),
    say: L3('Ikki havolaning manzili almashib qolgan. Papkadan to‘g‘ri faylni bosing — brauzer havolani o‘zi tekshiradi.',
      'У двух ссылок перепутаны адреса. Нажми в папке нужный файл — браузер сам проверит ссылку.',
      'Two links have mixed-up addresses. Tap the right file in the folder, and the browser will test the link itself.'),
    rounds: [
      { link: 'rules.html', bad: 'map.html', ask: L3('«Qoidalar» havolasi uchun faylni bosing', 'Нажми файл для ссылки «Правила»', 'Tap the file for the “Rules” link'),
        hints: [L3('«Qoidalar» havolasi qoidalarni ochishi kerak. Ularning fayli papkada qayerda?', 'По ссылке «Правила» должны открыться правила. Где в папке их файл?', 'The Rules link should open the rules. Where is their file in the folder?'),
          L3('Har bir fayl ostida qaysi sahifa ekani yozilgan.', 'Под каждым файлом подписано, какая это страница.', 'Under each file it says which page it is.'),
          L3('«Qoidalar» deb yozilgan faylni bosing — bu rules.html.', 'Нажми файл с подписью «Правила» — это rules.html.', 'Tap the file labelled Rules: it’s rules.html.')] },
      { link: 'map.html', bad: 'rules.html', ask: L3('«Qayerdamiz» havolasi uchun faylni bosing', 'Нажми файл для ссылки «Как нас найти»', 'Tap the file for the “Find us” link'),
        hints: [L3('Bu havola manzil sahifasini ochishi kerak.', 'Эта ссылка должна открыть страницу «Как нас найти».', 'This link should open the Find us page.'),
          L3('Fayl ostidagi yozuvlarni o‘qing.', 'Читай подписи под файлами.', 'Read the labels under the files.'),
          L3('«Qayerdamiz» deb yozilgan faylni bosing — bu map.html.', 'Нажми файл с подписью «Как нас найти» — это map.html.', 'Tap the file labelled Find us: it’s map.html.')] }
    ],
    wrong: L3('«{got}» ochildi — bu boshqa sahifa.', 'Открылась «{got}» — не та страница.', '“{got}” opened: the wrong page.'),
    ok: L3('Havola to‘g‘ri sahifani ochdi!', 'Ссылка открыла нужную страницу!', 'The link opened the right page!'),
    done: L3('Ikkala havola tuzatildi. Manzilni almashtirding — havola boshqa joyga olib boradi.', 'Обе ссылки починены. Меняешь href — меняется, куда ведёт ссылка.', 'Both links are fixed. Change href, and you change where the link leads.')
  },

  s7: {
    eyebrow: L3('Manzilni yozing', 'Напиши адрес', 'Type the address'),
    say: L3('Afisha sahifasida «Qoidalar» havolasi bor, lekin manzili bo‘sh. Qo‘shtirnoq ichiga qoidalar faylining nomini yozing.',
      'На афише есть ссылка «Правила», но адрес пустой. Напиши в кавычках имя файла правил.',
      'The listings page has a Rules link, but the address is empty. Type the name of the rules file in the quotes.'),
    ask: L3('Qo‘shtirnoq ichiga qoidalar fayli nomini yozing', 'Напиши в кавычках имя файла правил', 'Type the rules file name in the quotes'),
    noExt: L3('Sahifa topilmadi. Fayl nomi .html bilan tugaydi.', 'Страница не найдена. Имя файла заканчивается на .html.', 'Page not found. A file name ends with .html.'),
    typo: L3('Bunday fayl yo‘q. Harflarni papka bilan solishtiring.', 'Такого файла нет. Сверь буквы с папкой.', 'There’s no such file. Check the letters against the folder.'),
    other: L3('«{got}» ochildi. Bizga qoidalar kerak.', 'Открылась страница «{got}». А нужны правила.', 'The “{got}” page opened. We need the rules.'),
    hint3: L3('Shunday yozing: rules.html', 'Напиши так: rules.html', 'Type this: rules.html'),
    ok: L3('Ochildi! Fayl nomi to‘g‘ri — havola qoidalarga olib boradi.', 'Открылось! Имя файла верное — ссылка ведёт на правила.', 'It opened! The file name is right, so the link leads to the rules.')
  },

  s8: {
    eyebrow: L3('Atribut qayerda', 'Где атрибут', 'Where the attribute goes'),
    say: L3('Havolaga href kerak. U qayerda turishi kerak? Joyni bosing — brauzer nima chiqishini ko‘rsatadi.',
      'Ссылке нужен href. Где он должен стоять? Нажми место — браузер покажет, что получится.',
      'The link needs href. Where should it go? Tap a place, and the browser will show what happens.'),
    ask: L3('href uchun joyni bosing', 'Нажми место для href', 'Tap the place for href'),
    asText: L3('Atribut matnga tushib qoldi — brauzer uni so‘z qilib ko‘rsatdi. Atribut ochuvchi teg ichida yashaydi.',
      'Атрибут попал в текст — браузер показал его как слова. Атрибут живёт внутри открывающего тега.',
      'The attribute ended up in the text, so the browser showed it as words. An attribute lives inside the opening tag.'),
    inClose: L3('Yopuvchi tegda atributlar ishlamaydi — havola hech qayerga olib bormaydi.', 'В закрывающем теге атрибуты не работают — ссылка никуда не ведёт.', 'Attributes don’t work in a closing tag: the link leads nowhere.'),
    hints: [
      L3('Atribut — tegning sozlamasi. Havola qaysi tegdan boshlanadi?', 'Атрибут — настройка тега. С какого тега начинается ссылка?', 'An attribute is a setting of a tag. Which tag does the link start with?'),
      L3('Kerakli teg — ochuvchi <a>.', 'Нужен открывающий тег <a>.', 'You need the opening <a> tag.'),
      L3('<a> dagi a harfidan keyingi joyni bosing.', 'Нажми место сразу после буквы a в <a>.', 'Tap the place right after the letter a in <a>.')
    ],
    ok: L3('To‘g‘ri! Atribut ochuvchi teg ichida: nom, teng belgisi, qo‘shtirnoqdagi qiymat. Havola ishlayapti.',
      'Верно! Атрибут внутри открывающего тега: имя, знак равенства и значение в кавычках. Ссылка работает.',
      'Right! The attribute is inside the opening tag: a name, an equals sign, and a value in quotes. The link works.')
  },

  s9: {
    eyebrow: L3('Havolani yoping', 'Закрой ссылку', 'Close the link'),
    say: L3('Voy, havolani yopmabman — pastdagi abzats ham havolaga aylandi. Yopuvchi tegni tugmalar bilan tering.',
      'Ой, я не закрыл ссылку — и абзац ниже тоже стал ссылкой. Набери закрывающий тег кнопками.',
      'Oops, I didn’t close the link, so the paragraph below turned into a link too. Type the closing tag with the buttons.'),
    ask: L3('Bo‘sh qatorga havolani yopuvchi tegni tering', 'Набери в пустой строке закрывающий тег ссылки', 'Type the link’s closing tag in the empty line'),
    typeMsg: {
      needSlash: L3('Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Это открывающий тег. В закрывающем есть косая черта.', 'That’s an opening tag. A closing tag has a slash.'),
      needLt: L3('Teg burchakdan boshlanadi.', 'Тег начинается с уголка.', 'A tag starts with an angle bracket.'),
      needGt: L3('Tegni burchak bilan yoping.', 'Закрой тег уголком.', 'Close the tag with an angle bracket.'),
      wrongName: L3('Bu abzatsni yopadi. Yopilmagan esa havola — a.', 'Это закрывает абзац. А не закрыта ссылка — a.', 'That closes the paragraph. It’s the link, a, that isn’t closed.'),
      generic: L3('Havolani yopuvchi tegni tering.', 'Набери закрывающий тег ссылки.', 'Type the link’s closing tag.')
    },
    praise: L3('Havola yopildi — abzats yana oddiy matn.', 'Ссылка закрыта — абзац снова обычный текст.', 'The link is closed, and the paragraph is plain text again.'),
    hintSay: L3('Havolani yopuvchi teg: qiya chiziq va a harfi.', 'Закрывающий тег ссылки: косая черта и буква a.', 'The link’s closing tag: a slash and the letter a.')
  },

  s10: {
    eyebrow: L3('HTML-detektiv', 'HTML-детектив', 'HTML detective'),
    say: L3('Uchta ish. Har birida bitta havola ishlamayapti. Brauzerda tekshirib ko‘ring, keyin kodda buzilgan qatorni bosing.',
      'Три дела. В каждом одна ссылка не работает. Проверь ссылки в браузере, потом нажми в коде сломанную строку.',
      'Three cases. In each, one link doesn’t work. Test the links in the browser, then tap the broken line in the code.'),
    ask: L3('Buzilgan havola qatorini bosing', 'Нажми строку сломанной ссылки', 'Tap the line with the broken link'),
    cases: [
      { goal: L3('«Afisha» bosilganda: «Sahifa topilmadi»', '«Афиша» открывает «Страница не найдена»', '“What’s on” opens “Page not found”'),
        hints: [L3('Brauzer qaysi faylni qidirdi? Manzil satriga qarang.', 'Какой файл искал браузер? Посмотри в адресную строку.', 'Which file did the browser look for? Look at the address bar.'),
          L3('Fayl nomidagi harflarni papka bilan solishtiring.', 'Сверь буквы в имени файла с папкой.', 'Compare the letters in the file name with the folder.'),
          L3('«Afisha» havolasi qatorini bosing.', 'Нажми строку ссылки «Афиша».', 'Tap the line of the What’s on link.')],
        why: L3('Fayl nomida harflar almashgan edi. Bitta harf — va sahifa topilmaydi.', 'В имени файла переставлены буквы. Одна буква — и страница не найдена.', 'Two letters were swapped in the file name. One letter, and the page can’t be found.') },
      { goal: L3('«Qoidalar» oddiy matn, bosilmaydi', '«Правила» — обычный текст, не нажимается', '“Rules” is plain text and can’t be tapped'),
        hints: [L3('Oddiy matnga aylangan havolaga nima yetishmaydi?', 'Чего не хватает ссылке, которая стала обычным текстом?', 'What is missing from a link that turned into plain text?'),
          L3('Ochuvchi teglarni solishtiring.', 'Сравни открывающие теги.', 'Compare the opening tags.'),
          L3('href siz <a> qatorini bosing.', 'Нажми строку <a> без href.', 'Tap the <a> line without href.')],
        why: L3('href yo‘q edi. href siz <a> — havola emas.', 'Не было href. Без href тег <a> — не ссылка.', 'href was missing. Without href, <a> isn’t a link.') },
      { goal: L3('«Qayerdamiz» ko‘rinadi, lekin bosilmaydi', '«Как нас найти» видно, но не нажимается', '“Find us” is visible but can’t be tapped'),
        hints: [L3('Havola matni qayerda turishi kerak?', 'Где должен стоять текст ссылки?', 'Where should the link text go?'),
          L3('Matn <a> va </a> orasida bo‘lishi kerak.', 'Текст должен стоять между <a> и </a>.', 'The text must be between <a> and </a>.'),
          L3('Matni </a> dan keyin turgan qatorni bosing.', 'Нажми строку, где текст стоит после </a>.', 'Tap the line where the text comes after </a>.')],
        why: L3('Matn havoladan tashqarida edi. Bosiladigan matn <a> va </a> orasida turadi.', 'Текст стоял вне ссылки. Нажимаемый текст стоит между <a> и </a>.', 'The text was outside the link. Tappable text goes between <a> and </a>.') }
    ],
    other: L3('Bu qator joyida. Qidirishda davom eting.', 'Эта строка в порядке. Ищи дальше.', 'This line is fine. Keep looking.'),
    done: L3('Uchala ish yechildi! Endi havolalarni har qanday saytda tuzata olasiz.', 'Все три дела раскрыты! Теперь ты чинишь ссылки на любом сайте.', 'All three cases solved! Now you can fix links on any site.')
  },

  s11: {
    eyebrow: L3('Havolani yozing', 'Напиши ссылку', 'Write the link'),
    say: L3('Qoidalar sahifasidan orqaga yo‘l yo‘q. «Bosh sahifaga» havolasini o‘zingiz to‘liq yozing. Bosh sahifa fayli — index.html.',
      'Со страницы правил не вернуться. Напиши ссылку «На главную» целиком сам. Файл главной — index.html.',
      'There’s no way back from the rules page. Write the Home link yourself, all of it. The home page file is index.html.'),
    ask: L3('«Bosh sahifaga» havolasini to‘liq yozing', 'Напиши ссылку «На главную» целиком', 'Write the whole “Home” link'),
    msgs: {
      noOpen: L3('Ochuvchi <a teg bilan boshlang.', 'Начни с открывающего тега <a.', 'Start with the opening tag <a.'),
      noHref: L3('Ochuvchi tegga href atributi kerak.', 'В открывающем теге нужен атрибут href.', 'The opening tag needs the href attribute.'),
      noGt: L3('Ochuvchi tegni burchak bilan yoping.', 'Закрой открывающий тег уголком.', 'Close the opening tag with an angle bracket.'),
      wrongFile: L3('Havola bosh sahifaga olib borishi kerak — fayl index.html.', 'Ссылка должна вести на главную — файл index.html.', 'The link must lead home: the file is index.html.'),
      noText: L3('Ochuvchi teg va </a> orasiga havola matnini yozing.', 'Между открывающим тегом и </a> напиши текст ссылки.', 'Write the link text between the opening tag and </a>.'),
      noClose: L3('Havolani </a> tegi bilan yoping.', 'Закрой ссылку тегом </a>.', 'Close the link with </a>.')
    },
    hints: [
      L3('Oldingi ekranlardagi havolalarga o‘xshash bo‘ladi.', 'Она такая же, как ссылки на прошлых экранах.', 'It’s just like the links on the earlier screens.'),
      L3('Tartib: <a href="…">, matn, </a>.', 'Порядок: <a href="…">, текст, </a>.', 'The order: <a href="…">, text, </a>.'),
      L3('Shunday yozing: <a href="index.html">Bosh sahifaga</a>', 'Напиши так: <a href="index.html">На главную</a>', 'Type this: <a href="index.html">Home</a>')
    ],
    quotes: L3('Ishlayapti! Faqat manzilni qo‘shtirnoqqa olish odat — shunday ishonchliroq.', 'Работает! Только адрес принято брать в кавычки — так надёжнее.', 'It works! Just note that addresses are usually put in quotes; it’s more reliable.'),
    praise: L3('Havola to‘liq yozildi va ishlayapti! Endi qoidalardan bosh sahifaga qaytish mumkin.', 'Ссылка написана целиком и работает! Теперь с правил можно вернуться на главную.', 'The whole link is written and works! Now you can get home from the rules page.')
  },

  s12: {
    eyebrow: L3('Mening saytim', 'Мой сайт', 'My site'),
    say: L3('Endi o‘z klubingiz sayti. Mavzu tanlang, keyin menyuga uchta havola qo‘ying: fayl va matn.',
      'Теперь сайт твоего клуба. Выбери тему, потом сделай меню из трёх ссылок: файл и текст.',
      'Now your own club’s site. Pick a topic, then make a menu of three links: a file and a text for each.'),
    topics: [
      { id: 'games', label: L3('O‘yinlar klubi', 'Клуб игр', 'Games club') },
      { id: 'music', label: L3('Musiqa klubi', 'Клуб музыки', 'Music club') },
      { id: 'sport', label: L3('Sport klubi', 'Клуб спорта', 'Sports club') },
      { id: 'books', label: L3('Kitob klubi', 'Клуб книг', 'Book club') }
    ],
    pages: [
      { file: 'news.html', name: L3('Yangiliklar', 'Новости', 'News') },
      { file: 'photo.html', name: L3('Rasmlar', 'Фото', 'Photos') },
      { file: 'team.html', name: L3('Jamoa', 'Команда', 'Team') }
    ],
    askTopic: L3('Mavzu tanlang', 'Выбери тему', 'Pick a topic'),
    askItems: L3('Belgilangan qator uchun faylni bosing va havola matnini yozing', 'Нажми файл для отмеченной строки и напиши текст ссылки', 'Tap a file for the marked line and write the link text'),
    used: L3('Bu sahifa menyuda allaqachon bor. Boshqasini tanlang.', 'Эта страница уже есть в меню. Выбери другую.', 'This page is already in the menu. Pick another one.'),
    mismatch: L3('Matn «{t}», havola esa boshqa sahifaga. Mehmon adashadi — matn sahifaga mos bo‘lsin.', 'Текст «{t}», а ведёт на другую страницу. Гость запутается — пусть текст совпадает со страницей.', 'The text says “{t}” but it leads to another page. Visitors will get confused; make the text match the page.'),
    noTags: L3('Bu yerga faqat so‘zlar, teglar allaqachon bor.', 'Здесь только слова — теги уже стоят.', 'Only words here; the tags are already there.'),
    pageText: L3('Bu klubingizning «{n}» sahifasi.', 'Это страница «{n}» твоего клуба.', 'This is your club’s {n} page.'),
    done: L3('Menyu tayyor: uchta havola, har biri o‘z sahifasiga. Brauzerda bosib ko‘ring!', 'Меню готово: три ссылки, каждая ведёт на свою страницу. Понажимай их в браузере!', 'The menu is ready: three links, each leading to its own page. Try them in the browser!')
  },

  s13: {
    eyebrow: L3('Mening saytim', 'Мой сайт', 'My site'),
    say: L3('Mana saytingizning bosh sahifasi va uning kodi. Uni saqlang.', 'Вот главная страница твоего сайта и её код. Сохрани её.', 'Here’s your site’s home page and its code. Save it.'),
    saved: L3('Ura, saqlandi! Saytingizda menyu bor — bu allaqachon haqiqiy sayt!', 'Ура, сохранено! У твоего сайта есть меню — это уже настоящий сайт!', 'Hooray, saved! Your site has a menu: it’s a real site now!'),
    ask: L3('Saytni saqlang', 'Сохрани сайт', 'Save the site')
  },

  s14: {
    eyebrow: L3('Yakun', 'Итог', 'Wrap-up'),
    say: L3('Bugun sayt sahifalarini havolalar bilan bog‘ladik. Keyingi darsda saytga rasmlar qo‘shamiz. Ko‘rishguncha!',
      'Сегодня мы соединили страницы сайта ссылками. На следующем уроке добавим на сайт картинки. Пока!',
      'Today we connected the site’s pages with links. Next lesson we’ll add pictures to the site. Bye!'),
    skills: [
      L3('<a> — havola: boshqa sahifaga olib boradi', '<a> — ссылка: ведёт на другую страницу', '<a> is a link: it leads to another page'),
      L3('href — atribut: havola qayerga olib boradi', 'href — атрибут: куда ведёт ссылка', 'href is an attribute: where the link leads'),
      L3('Atribut ochuvchi tegda yoziladi: nom="qiymat"', 'Атрибут пишется в открывающем теге: имя="значение"', 'An attribute goes in the opening tag: name="value"'),
      L3('Havola matni <a> va </a> orasida', 'Текст ссылки — между <a> и </a>', 'The link text goes between <a> and </a>')
    ],
    next: L3('Rasmlar', 'Изображения', 'Images'),
    btn: L3('Darsni yakunlash', 'Завершить урок', 'Finish the lesson')
  }
};

/*@L2_HELPERS@*/

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2: тег a, атрибут href, списки, имена файлов
// ═════════════════════════════════════════════════════════════════════════════
TAGC.a = '#8A5A3C';
TAGC.ul = '#2F6FB0'; TAGC.ol = '#2F6FB0'; TAGC.li = '#2F6FB0';
// Теги вслух — по-английски во всех языках (заказчик, 17.10.2026).
Object.assign(TAG_SAY.ru, { a: 'A', href: 'H ref', ul: 'U L', ol: 'O L', li: 'L I', dot: 'точка', aWith: 'тег A с адресом' });
Object.assign(TAG_SAY.uz, { a: 'A', href: 'H ref', ul: 'U L', ol: 'O L', li: 'L I', dot: 'nuqta', aWith: 'A tegi, manzili' });
Object.assign(TAG_SAY.en, { a: 'A', href: 'H ref', ul: 'U L', ol: 'O L', li: 'L I', dot: 'dot', aWith: 'an A tag with the address' });
Object.assign(SPOKEN, { nothing: 1, okLink: 1, found: 1, right: 1, miss: 1, asText: 1, inClose: 1, noExt: 1, typo: 1, hint3: 1,
  quotes: 1, msgs: 1, cases: 1, rounds: 1, used: 1, mismatch: 1 });
Object.assign(NOT_SPOKEN_IN, { cases: { goal: 1 }, rounds: { ask: 1, link: 1, bad: 1 } });
// Озвучка: теги a, ul, ol, li, href — по-английски; имя файла — «rules точка HTML».
function spokenLn(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const s = String(text || '')
    // <a href="index.html"> в реплике — словами, без знаков = и кавычек.
    .replace(/<\s*a\s+href\s*=\s*["']?([^"'>]*)["']?\s*>/gi, (x, h) => ' ' + m.aWith + ' ' + h + ', ')
    .replace(/<\s*\/\s*(a|ul|ol|li)\s*>/gi, (x, t) => ' ' + m.close + ' ' + m[t.toLowerCase()] + ' ')
    .replace(/<\s*(a|ul|ol|li)\s*>/gi, (x, t) => ' ' + m[t.toLowerCase()] + ' ')
    .replace(/<\s*a\b/gi, ' ' + m.a + ' ')
    .replace(/\bhref\b/gi, m.href)
    .replace(/([A-Za-z]+)\.html\b/g, (x, f) => f + ' ' + m.dot + ' ' + m.html)
    .replace(/(^|[^A-Za-zА-Яа-яЁё])(ul|ol|li)(?=[^A-Za-zА-Яа-яЁё]|$)/g, (x, pre, t) => pre + m[t]);
  return spokenHtml(s, lang);
}
function SpokenLn({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenLn(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// МИНИ-БРАУЗЕР УРОКА: вкладка, адресная строка с «назад», страница, подсказка
// адреса внизу окна. Разметка и стили — как у MiniBrowser урока 2.
// ─────────────────────────────────────────────────────────────────────────────
function useNav(start) {
  const [hist, setHist] = useState([start]);
  const path = hist[hist.length - 1];
  const go = useCallback((h) => setHist((x) => x.concat(h)), []);
  const back = useCallback(() => setHist((x) => (x.length > 1 ? x.slice(0, -1) : x)), []);
  const reset = useCallback((p) => setHist([p]), []);
  return { path, go, back, reset, canBack: hist.length > 1 };
}
function LnBrowser({ path, title, page, canBack, onBack, status, cls }) {
  const pick = usePick();
  return (
    <div className={'mb ln-mb' + (cls ? ' ' + cls : '')}>
      <div className="mb-top">
        <span className="mb-tab">
          <span className="mb-fav" aria-hidden="true" />
          <span className="mb-tab-t">{title}</span>
          <span className="mb-x" aria-hidden="true" />
        </span>
        <span className="mb-new" aria-hidden="true" />
        <span className="mb-win" aria-hidden="true"><i className="mb-w-min" /><i className="mb-w-max" /><i className="mb-w-x" /></span>
      </div>
      <div className="ln-bar">
        <button type="button" className="ln-back" disabled={!canBack} onClick={onBack} aria-label={pick(UI.back)}><Icon name="arrowL" size={16} /></button>
        <span className="ln-url mono" key={path} translate="no">{path}</span>
      </div>
      <div className={'mb-page' + (status ? ' has-status' : '')} key={'p' + path}>
        <div className="mb-doc ln-doc">{page}</div>
        {status ? <span className="ln-status mono" translate="no">{status}</span> : null}
      </div>
    </div>
  );
}
// Страница сайта. Узлы: { kind: 'h1' | 'p', v, asLink? } и
// { kind: 'links', items: [{ id, href, text, noHref, dead, pre, post }] } — ссылки в одну
// строку (как в браузере: строки кода без блоков склеиваются через пробел);
// { kind: 'menu', items } — список ul из ссылок.
function SitePage({ nodes, onLink, onDead, hl, fresh, canTap = true, ledIds }) {
  const has = (arr, id) => !!arr && arr.indexOf(id) >= 0;
  const linkEl = (it) => {
    const cls = (has(hl, it.id) ? ' is-hl' : '') + (has(fresh, it.id) ? ' is-new' : '');
    const inner = it.text;
    let el;
    if (it.noHref || it.href == null) {
      el = it.dead ? (
        <button key={it.id} type="button" className={'ln-dead' + cls} disabled={!canTap} onClick={() => onDead && onDead(it)}>{inner}<Led on={has(ledIds, it.id)} /></button>
      ) : <span key={it.id} className={'ln-plain' + cls}>{inner}</span>;
    } else {
      el = (
        <button key={it.id} type="button" className={'ln-a' + cls} disabled={!canTap} onClick={() => onLink && onLink(it.href, it)}>
          {inner || '​'}<Led on={has(ledIds, it.id)} />
        </button>
      );
    }
    return <React.Fragment key={it.id}>{it.pre ? <span className="ln-plain">{it.pre}</span> : null}{el}{it.post ? <span className="ln-plain">{it.post}</span> : null}</React.Fragment>;
  };
  return (
    <div className="pg ln-pg">
      {nodes.map((n, i) => {
        if (n.kind === 'links') return <p key={'l' + i} className="ln-links">{n.items.map((it, k) => <React.Fragment key={it.id}>{k ? ' ' : null}{linkEl(it)}</React.Fragment>)}</p>;
        if (n.kind === 'menu') return <ul key={'m' + i} className="ln-menu">{n.items.map((it) => <li key={it.id}>{linkEl(it)}</li>)}</ul>;
        const Tg = n.kind === 'h1' ? 'h1' : 'p';
        return <Tg key={n.kind + i} className={'ln-' + Tg + (n.asLink ? ' ln-aslink' : '') + (has(fresh, n.id) ? ' is-new' : '')}>{n.v}</Tg>;
      })}
    </div>
  );
}
// Страница сайта по файлу (для переходов): h1 + абзац, или «не найдена».
function pageFor(pick, path) {
  const pg = PG[path];
  if (!pg) return { title: pick(UI.nf), nodes: [{ kind: 'h1', v: pick(UI.nf) }, { kind: 'p', v: pick(fillL(UI.nfP, { f: path || '""' })) }] };
  return { title: pick(pg.title), nodes: [{ kind: 'h1', v: pick(pg.title) }, { kind: 'p', v: pick(pg.text) }] };
}

// КОД. Открывающий тег a с атрибутом: имя — цветом тега, значение — чернилами.
function AOpen({ href, noHref, hrefNode }) {
  return (
    <span className="tk-tag ln-tag" style={{ '--c': TAGC.a }}>
      <span className="tk-br">{'<'}</span><span className="tk-nm">a</span>
      {noHref ? null : (
        <>
          <span className="ln-sp"> </span><span className="ln-an">href</span><span className="ln-eq">=</span>
          <span className="ln-av">"{hrefNode != null ? hrefNode : href}"</span>
        </>
      )}
      <span className="tk-br">{'>'}</span>
    </span>
  );
}
// Строка кода со ссылкой.
function aLine(id, o) {
  const node = (
    <>
      <AOpen href={o.href} noHref={o.noHref} hrefNode={o.hrefNode} />
      {o.textNode != null ? o.textNode : (o.text ? <span className="tk-tx">{o.text}</span> : null)}
      {o.noClose ? null : <Tag tag="a" close />}
      {o.post ? <span className="tk-tx">{o.post}</span> : null}
    </>
  );
  return { key: id, id, d: o.d || 0, tag: 'a', toks: [{ k: 'node', node, z: id }] };
}
const bLine = (id, tag, text, d) => ({ key: id, id, d: d || 0, tag, toks: [{ k: 'open', tag, z: id + ':o' }, { k: 'text', v: text, z: id + ':t' }, { k: 'close', tag, z: id + ':c' }] });
const rawLine = (id, text, d) => ({ key: id, id, d: d || 0, toks: [{ k: 'text', v: text, z: id }] });
const nodeLine = (id, node, d, tag) => ({ key: id, id, d: d || 0, tag, toks: [{ k: 'node', node, z: id }] });

// Папка сайта: файлы с подписями страниц.
function Folder({ files, names, onPick, canTap, picked, used, ledFile, compact }) {
  const pick = usePick();
  return (
    <div className={'ln-folder' + (compact ? ' is-compact' : '')} translate="no">
      <span className="ln-folder-h"><Icon name="doc" size={13} />{pick(UI.folder)}</span>
      <div className="ln-files">
        {files.map((f) => {
          const isUsed = used && used.indexOf(f) >= 0;
          const label = <><span className="ln-f-n mono">{f}</span><span className="ln-f-l">{pick(names[f])}</span></>;
          return onPick ? (
            <button key={f} type="button" className={'ln-file' + (picked === f ? ' is-on' : '') + (isUsed ? ' is-used' : '')}
              disabled={!canTap} onClick={() => onPick(f)}>{label}<Led on={ledFile === f} /></button>
          ) : <span key={f} className="ln-file is-static">{label}</span>;
        })}
      </div>
    </div>
  );
}
const PG_NAMES = (() => { const o = {}; FILES.forEach((f) => { o[f] = PG[f].name; }); return o; })();

function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
const stepHint = (hints, misses) => (misses > 0 && hints ? hints[Math.min(hints.length, misses) - 1] : null);
const okText = (s) => hasLetters(s) && !hasTags(s);
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
// Главная «Кино во дворе» с тремя ссылками; hrefs — адрес для каждой (null — без href).
const homeLinks = (pick, hrefs, extra) => ['films.html', 'rules.html', 'map.html'].map((f, i) => Object.assign({
  id: 'l' + i, file: f, text: pick(PG[f].name), href: hrefs ? hrefs[i] : f
}, (extra && extra[i]) || {}));

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. HOOK. Текст никуда не ведёт — то же слово в <a> открывает афишу.
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const [phase, setPhase] = useState(rec ? 'done' : 'text');   // text · link · done
  const nav = useNav(rec ? 'films.html' : 'index.html');
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.ok, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(phase === 'done', spoken);
  const [shake, wobble] = useShake();
  const led = useIdleLed(canTap && phase !== 'done', phase === 'link' ? 1 : 0);
  const home = PG['index.html'];
  const item = { id: 'af', text: pick(PG['films.html'].name), href: phase === 'text' ? null : 'films.html', dead: phase === 'text' };
  const onDead = () => { if (!canTap) return; sfx('soft', true); wobble('af'); setPhase('link'); sayNow(c.nothing, 'point'); };
  const onLink = (h) => {
    if (!canTap) return;
    sfx('ok', true); nav.go(h);
    if (phase !== 'done') { setPhase('done'); put({ done: true }); sayNow(c.ok, 'cheer'); }
  };
  const pg = nav.path === 'index.html'
    ? { title: pick(home.title), nodes: [{ kind: 'h1', v: pick(home.title) }, { kind: 'p', v: pick(home.text) }, { kind: 'links', items: [item] }] }
    : pageFor(pick, nav.path);
  const lines = [bLine('h1', 'h1', pick(home.title)), bLine('p', 'p', pick(home.text)),
    phase === 'text' ? rawLine('af', item.text) : aLine('af', { href: 'films.html', text: item.text })];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={phase === 'link' ? c.ask2 : c.ask} nav={navOf(p, canGo)}>
      <Ask text={phase === 'done' ? c.askDone : phase === 'link' ? c.ask2 : c.ask} />
      <Work
        browser={<LnBrowser path={nav.path} title={pg.title} canBack={nav.canBack} onBack={nav.back}
          page={<SitePage nodes={pg.nodes} onLink={onLink} onDead={onDead} canTap={canTap} hl={shake === 'af' ? ['af'] : null}
            ledIds={led ? ['af'] : null} fresh={phase === 'link' ? ['af'] : null} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (ln.id === 'af' && phase !== 'text' ? { cls: 'is-new' } : null)} />} />
    </Stage>
  );
}

// ── 2. MISSION.
const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;

// ── 3. SHOW. Четыре части ссылки; после — слово «атрибут».
const PARTS = ['tag', 'href', 'text', 'close'];
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const [seen, setSeen] = useState(rec ? PARTS : []);
  const done = seen.length >= 4;
  const [cur, setCur] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'rule' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, seen.length);
  const tap = (k) => {
    if (!canTap) return;
    sfx('tap', true); setCur(k);
    const next = seen.indexOf(k) >= 0 ? seen : seen.concat(k);
    setSeen(next);
    if (next.length >= 4 && !done) { put({ done: true }); sayNow(joinL(c.tell[k], c.done), 'rule'); } else sayNow(c.tell[k], 'point');
  };
  const pb = (k, inner) => (
    <button type="button" className={'ln-part' + (cur === k ? ' is-cur' : '') + (seen.indexOf(k) >= 0 ? ' is-seen' : '')} disabled={!canTap} onClick={() => tap(k)}>
      {inner}<Led on={led && seen.indexOf(k) < 0} />
    </button>
  );
  const text = pick(PG['films.html'].name);
  const lineNode = (
    <span className="ln-anat">
      {pb('tag', <span className="tk-tag ln-tag" style={{ '--c': TAGC.a }}><span className="tk-br">{'<'}</span><span className="tk-nm">a</span></span>)}
      {pb('href', <span className="ln-attr"><span className="ln-an">href</span><span className="ln-eq">=</span><span className="ln-av">"films.html"</span></span>)}
      <span className="tk-tag ln-tag" style={{ '--c': TAGC.a }}><span className="tk-br">{'>'}</span></span>
      {pb('text', <span className="tk-tx">{text}</span>)}
      {pb('close', <Tag tag="a" close />)}
    </span>
  );
  const home = PG['index.html'];
  const nodes = [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: [{ id: 'af', text, href: 'films.html' }] }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} n={seen.length + '/4'} />
      <div className="src src-one ln-src ln-one" translate="no">{lineNode}</div>
      <div className={'ln-legend' + (cur ? ' is-on' : '')} aria-live="polite">{cur ? pick(c.parts[cur]) : ' '}</div>
      <LnBrowser path="index.html" title={pick(home.title)} status={cur === 'href' ? 'films.html' : null}
        page={<SitePage nodes={nodes} canTap={false} hl={cur === 'text' || cur === 'tag' || cur === 'close' ? ['af'] : null} />} />
    </Stage>
  );
}

// ── 4. PREDICT. Без href <a> — обычный текст.
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const [ans, setAns] = useState(rec ? rec.ans : null);
  const done = !!rec;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? (rec.ans === 'text' ? c.right : c.miss) : c.say, pose: done ? 'rule' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !ans, 0);
  const choose = (k) => {
    if (!canTap || ans) return;
    const right = k === 'text';
    setAns(k); put({ ans: k });
    sfx(right ? 'ok' : 'soft', true);
    log({ screenId: 's4', type: 'predict', correct: right, firstTry: right, attempts: 1 });
    sayNow(right ? c.right : c.miss, right ? 'cheer' : 'explain');
  };
  const home = PG['index.html'];
  const text = pick(PG['films.html'].name);
  const gone = !!ans;
  const nodes = [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: [{ id: 'af', text, href: gone ? null : 'films.html', noHref: gone }] }];
  const lines = [bLine('h1', 'h1', pick(home.title)), aLine('af', { href: 'films.html', text, noHref: gone })];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <Work browser={<LnBrowser path="index.html" title={pick(home.title)} page={<SitePage nodes={nodes} canTap={false} fresh={gone ? ['af'] : null} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (ln.id === 'af' && gone ? { cls: 'is-new' } : null)} />} />
      <div className="ln-opts" role="group">
        {['home', 'text', 'gone'].map((k) => (
          <button key={k} type="button" disabled={!canTap || !!ans}
            className={'ln-opt' + (ans === k ? (k === 'text' ? ' is-ok' : ' is-off') : '') + (ans && ans !== k && k === 'text' ? ' is-real' : '')}
            onClick={() => choose(k)}>{pick(c.opts[k])}<Led on={led} /></button>
        ))}
      </div>
    </Stage>
  );
}

// ── 5. LEVEL-1. Проверить ссылки в браузере и найти ту, что ведёт не туда.
const S5_HREF = ['films.html', 'map.html', 'rules.html'];   // «Правила» и «Как нас найти» перепутаны
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!rec;
  const nav = useNav('index.html');
  const [found, setFound] = useState(rec ? rec.link : null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.found : c.say, pose: solved ? 'rule' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved, tries.current + (nav.canBack ? 10 : 0));
  const links = homeLinks(pick, S5_HREF);
  const onLink = (h, it) => {
    if (!canTap) return;
    sfx('tap', true); nav.go(h);
    if (solved) return;
    tries.current += 1;
    if (h !== it.file) {
      setFound(it.id); put({ done: true, link: it.id });
      log({ screenId: 's5', type: 'test-links', correct: true, firstTry: true, attempts: tries.current });
      sayNow(c.found, 'wonder');
    } else sayNow(c.okLink, 'smile');
  };
  const home = PG['index.html'];
  const pg = nav.path === 'index.html'
    ? { title: pick(home.title), nodes: [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: links }] }
    : pageFor(pick, nav.path);
  const lines = [bLine('h1', 'h1', pick(home.title))].concat(links.map((l) => aLine(l.id, { href: l.href, text: l.text })));
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={c.ask} />
      <Work browser={<LnBrowser path={nav.path} title={pg.title} canBack={nav.canBack} onBack={() => { sfx('tap', true); nav.back(); }}
        page={<SitePage nodes={pg.nodes} onLink={onLink} canTap={canTap} ledIds={led && nav.path === 'index.html' ? links.map((l) => l.id) : null} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (found && ln.id === found ? { cls: 'is-cur ln-show-href' } : null)} />} />
    </Stage>
  );
}

// ── 6. LEVEL-2. Починить адрес: выбрать файл в папке — браузер сам проверит ссылку.
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!rec;
  const [r, setR] = useState(solved ? 2 : 0);
  const R = c.rounds[Math.min(r, 1)];
  const [hrefs, setHrefs] = useState(() => (solved ? ['films.html', 'rules.html', 'map.html'] : S5_HREF.slice()));
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const nav = useNav('index.html');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({ tries: 0, misses: 0 });
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const led = useIdleLed(canTap && !solved && !busy, r * 10 + misses);
  const idx = R.link === 'rules.html' ? 1 : 2;
  const pickFile = (f) => {
    if (!canTap || solved || busy) return;
    stat.current.tries += 1;
    const old = hrefs[idx];
    const nh = hrefs.slice(); nh[idx] = f; setHrefs(nh);
    setBusy(true);
    // Браузер «нажимает» ссылку: открывает то, что стоит в href.
    setTimeout(() => { if (alive.current) nav.go(f); }, 350);
    if (f === R.link) {
      sfx('ok', true); setMsg(null);
      if (r === 1) {
        put({ done: true });
        log({ screenId: 's6', type: 'fix-href', correct: true, firstTry: stat.current.misses === 0, attempts: stat.current.tries, hints: stat.current.misses });
        sayNow(joinL(c.ok, c.done), 'cheer');
        setTimeout(() => { if (!alive.current) return; setR(2); setBusy(false); }, 400);
        return;
      }
      sayNow(c.ok, 'smile');
      setTimeout(() => { if (!alive.current) return; nav.reset('index.html'); setR(1); setMisses(0); setBusy(false); }, reduceMotion() ? 1200 : 2200);
      return;
    }
    stat.current.misses += 1;
    const n = misses + 1;
    setMisses(n); sfx('soft', true);
    const got = PG[f] ? PG[f].name : UI.nf;
    const base = fillL(c.wrong, { got });
    const h = stepHint(R.hints, n);
    setMsg(h ? joinL(base, h) : base);
    sayNow(h ? joinL(base, h) : base, 'think');
    setTimeout(() => {
      if (!alive.current) return;
      const back = hrefs.slice(); back[idx] = old; setHrefs(back); nav.reset('index.html'); setBusy(false);
    }, reduceMotion() ? 1400 : 2400);
  };
  const links = homeLinks(pick, hrefs);
  const home = PG['index.html'];
  const pg = nav.path === 'index.html'
    ? { title: pick(home.title), nodes: [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: links }] }
    : pageFor(pick, nav.path);
  const lines = [bLine('h1', 'h1', pick(home.title))].concat(links.map((l) => aLine(l.id, { href: l.href, text: l.text })));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={R.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.done : R.ask} hint={solved ? null : msg} n={solved ? null : (Math.min(r, 1) + 1) + '/2'} />
      <Work browser={<LnBrowser path={nav.path} title={pg.title} page={<SitePage nodes={pg.nodes} canTap={false} hl={!solved ? ['l' + idx] : null} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (!solved && ln.id === 'l' + idx ? { cls: 'is-cur' } : null)} />} />
      {!solved ? <Folder files={FILES} names={PG_NAMES} onPick={pickFile} canTap={canTap && !busy} ledFile={led && misses >= 3 ? R.link : null} /> : null}
    </Stage>
  );
}

// ── 7. LEVEL-3. Набрать адрес: имя файла правил в пустом href.
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!rec;
  const [val, setVal] = useState(solved ? 'rules.html' : '');
  const [msg, setMsg] = useState(null);
  const [misses, setMisses] = useState(0);
  const nav = useNav(solved ? 'rules.html' : 'films.html');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved && !val, 0);
  // Пауза в наборе — браузер «нажимает» ссылку и показывает, что открылось.
  useEffect(() => {
    if (solved) return undefined;
    const v = val.trim().toLowerCase();
    if (!v) { setMsg(null); return undefined; }
    const t = setTimeout(() => {
      tries.current += 1;
      nav.reset('films.html'); nav.go(v);
      if (v === 'rules.html') {
        sfx('ok', true); setMsg(null); put({ done: true });
        log({ screenId: 's7', type: 'type-href', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
        sayNow(c.ok, 'cheer');
        return;
      }
      const n = misses + 1;
      setMisses(n); sfx('soft', true);
      let m;
      if (PG[v]) m = fillL(c.other, { got: PG[v].name });
      else m = /\.html$/.test(v) ? c.typo : c.noExt;
      if (n >= 3) m = joinL(m, c.hint3);
      setMsg(m); sayNow(m, 'think');
    }, 1300);
    return () => clearTimeout(t);
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const films = PG['films.html'];
  const input = (
    <span className={'ln-inp' + (led ? ' is-led' : '')}>
      <InlineInput value={val} onChange={(v) => { setVal(v); setMsg(null); }} placeholder={L3('…', '…', '…')} label={c.ask} max={20} cls="tk-input-tag" />
      <Led on={led} />
    </span>
  );
  const ruleText = pick(PG['rules.html'].name);
  const lines = [bLine('h1', 'h1', pick(films.title)), bLine('p', 'p', pick(films.text)),
    aLine('lr', { href: val, hrefNode: solved ? null : input, text: ruleText })];
  const pg = nav.path === 'films.html'
    ? { title: pick(films.title), nodes: [{ kind: 'h1', v: pick(films.title) }, { kind: 'p', v: pick(films.text) }, { kind: 'links', items: [{ id: 'lr', text: ruleText, href: val.trim() || 'films.html' }] }] }
    : pageFor(pick, nav.path);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.ok : c.ask} hint={solved ? null : msg} />
      <Work cls="ln-typing" browser={<LnBrowser path={nav.path} title={pg.title} canBack={nav.canBack} onBack={nav.back}
        page={<SitePage nodes={pg.nodes} onLink={(h) => nav.go(h)} canTap={canTap} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (ln.id === 'lr' ? { cls: solved ? 'is-new' : 'is-cur' } : null)} />} />
      <Folder files={FILES} names={PG_NAMES} compact />
    </Stage>
  );
}

// ── 8. LEVEL-4. Место атрибута: внутри открывающего тега.
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!rec;
  const [at, setAt] = useState(solved ? 'open' : null);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);
  const led = useIdleLed(canTap && !solved && !at, misses);
  const place = (k) => {
    if (!canTap || solved || at) return;
    tries.current += 1;
    setAt(k);
    if (k === 'open') {
      sfx('ok', true); setMsg(null); put({ done: true });
      log({ screenId: 's8', type: 'attr-place', correct: true, firstTry: misses === 0, attempts: tries.current, hints: misses });
      sayNow(c.ok, 'cheer');
      return;
    }
    const n = misses + 1;
    setMisses(n); sfx('soft', true);
    const base = k === 'close' ? c.inClose : c.asText;
    const h = n >= 2 ? stepHint(c.hints, n - 1) : null;
    setMsg(h ? joinL(base, h) : base);
    sayNow(h ? joinL(base, h) : base, 'think');
    setTimeout(() => { if (alive.current) setAt(null); }, reduceMotion() ? 1600 : 2600);
  };
  const attrTxt = 'href="map.html"';
  const text = pick(PG['map.html'].name);
  const A = <span className="ln-attr ln-attr-in"><span className="ln-sp"> </span><span className="ln-an">href</span><span className="ln-eq">=</span><span className="ln-av">"map.html"</span></span>;
  const slot = (k) => (at === k ? (k === 'open' || k === 'close' ? A : <span className="tk-tx ln-stray">{attrTxt}</span>) : (!at ? (
    <button type="button" className="ln-slot" disabled={!canTap} onClick={() => place(k)} aria-label={k}><Led on={led && misses >= 3 && k === 'open'} /></button>
  ) : null));
  const tag = (inner) => <span className="tk-tag ln-tag" style={{ '--c': TAGC.a }}>{inner}</span>;
  const lineNode = (
    <span className="ln-anat">
      {slot('before')}
      {tag(<><span className="tk-br">{'<'}</span><span className="tk-nm">a</span></>)}{slot('open')}{tag(<span className="tk-br">{'>'}</span>)}
      {slot('text')}<span className="tk-tx">{text}</span>
      {tag(<><span className="tk-br">{'<'}</span><span className="tk-sl">/</span><span className="tk-nm">a</span></>)}{slot('close')}{tag(<span className="tk-br">{'>'}</span>)}
      {slot('after')}
    </span>
  );
  // Что показывает браузер при каждом месте.
  const works = at === 'open';
  const pre = at === 'before' || at === 'text' ? attrTxt : null;
  const post = at === 'after' ? attrTxt : null;
  const home = PG['index.html'];
  const nodes = [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: [{ id: 'lm', text, href: works ? 'map.html' : null, noHref: !works, pre, post }] }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.ok : c.ask} hint={solved ? null : msg} />
      {!solved ? <div className="ln-card mono" translate="no"><span className="ln-an">href</span><span className="ln-eq">=</span><span className="ln-av">"map.html"</span></div> : null}
      <div className="src src-one ln-src ln-one" translate="no">{lineNode}</div>
      <LnBrowser path="index.html" title={pick(home.title)} status={works ? 'map.html' : null}
        page={<SitePage nodes={nodes} canTap={false} fresh={at ? ['lm'] : null} />} />
    </Stage>
  );
}

// ── 9. LEVEL-5. Закрыть ссылку: набрать </a>.
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!rec;
  const ty = useTagTyping({ max: 8 });
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.praise : c.say, pose: solved ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0), misses = useRef(0);
  const led = useIdleLed(canTap && !solved && !ty.val, 0);
  const win = () => {
    sfx('win', true); setMsg(null); put({ done: true });
    log({ screenId: 's9', type: 'type-close', correct: true, firstTry: misses.current === 0, attempts: tries.current + 1 });
    sayNow(c.praise, 'cheer');
  };
  useEffect(() => { if (!solved && normTag(ty.val) === '</a>') win(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const issue = tagTypingIssue(ty.val, 'a', c.typeMsg);
    if (!issue) { win(); return; }
    misses.current += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
  };
  const home = PG['index.html'];
  const text = pick(PG['films.html'].name);
  const input = (
    <span className={'ln-inp' + (led ? ' is-led' : '')}>
      <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check}
        placeholder={L3('</…>', '</…>', '</…>')} label={c.ask} max={8} cls="tk-input-tag" /><Led on={led} />
    </span>
  );
  const lines = [bLine('h1', 'h1', pick(home.title)),
    aLine('af', { href: 'films.html', text, noClose: true })]
    .concat(solved ? [nodeLine('cl', <Tag tag="a" close />, 0, 'a')] : [nodeLine('gap', input)])
    .concat([bLine('p', 'p', pick(home.text))]);
  const nodes = [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: [{ id: 'af', text, href: 'films.html' }] },
    { kind: 'p', id: 'p', v: pick(home.text), asLink: !solved }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.hintSay} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="ln-typing" browser={<LnBrowser path="index.html" title={pick(home.title)} page={<SitePage nodes={nodes} canTap={false} fresh={solved ? ['p'] : null} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (ln.id === 'gap' ? { cls: 'is-gap' } : ln.id === 'cl' ? { cls: 'is-new' } : null)} />} />
      {!solved ? <KeyRow keys={['<', '/', 'a', 'p', '>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 10. CHECK. Детектив: в каждом деле одна ссылка не работает.
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!rec;
  const [k, setK] = useState(solved ? 2 : 0);
  const [fixed, setFixed] = useState(solved);
  const [misses, setMisses] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble, alive] = useShake();
  const nav = useNav('index.html');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const stat = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !fixed && misses >= 3, k * 10 + misses);
  const BAD = [
    [{ href: 'flims.html' }, {}, {}],
    [{}, { href: null, noHref: true }, {}],
    [{}, {}, { textOut: true }]
  ];
  const links = homeLinks(pick, null).map((l, i) => {
    const b = fixed ? {} : BAD[k][i];
    const href = b.href !== undefined ? b.href : l.file;
    return Object.assign({}, l, { href, noHref: !!b.noHref, textOut: !!b.textOut });
  });
  const target = 'l' + k;
  const tapLine = (ln) => {
    if (!canTap || fixed || ln.id === 'h1') return;
    stat.current.tries += 1;
    if (ln.id === target) {
      sfx('ok', true); setFixed(true); setMsg(null); nav.reset('index.html');
      const cc = c.cases[k];
      if (k === 2) {
        put({ done: true });
        log({ screenId: 's10', type: 'detective', correct: true, firstTry: stat.current.misses === 0, attempts: stat.current.tries, hints: stat.current.misses });
        sayNow(joinL(cc.why, c.done), 'cheer');
        return;
      }
      sayNow(cc.why, 'smile');
      setTimeout(() => { if (!alive.current) return; setK((v) => v + 1); setFixed(false); setMisses(0); nav.reset('index.html'); }, reduceMotion() ? 1200 : 2400);
      return;
    }
    stat.current.misses += 1;
    const n = misses + 1;
    setMisses(n); sfx('soft', true); wobble(ln.id);
    const h = stepHint(c.cases[k].hints, n);
    setMsg(h); sayNow(joinL(c.other, h), 'think');
  };
  const home = PG['index.html'];
  const pageLinks = links.map((l) => (l.textOut ? Object.assign({}, l, { text: '', post: l.text }) : l));
  const pg = nav.path === 'index.html'
    ? { title: pick(home.title), nodes: [{ kind: 'h1', v: pick(home.title) }, { kind: 'links', items: pageLinks }] }
    : pageFor(pick, nav.path);
  const lines = [bLine('h1', 'h1', pick(home.title))].concat(links.map((l) => aLine(l.id, {
    href: l.href, noHref: l.noHref, text: l.textOut ? '' : l.text, post: l.textOut ? l.text : null })));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="ln-case"><span className="ln-case-n mono">{pick(UI.caseN)} {k + 1}/3</span><b>{pick(c.cases[k].goal)}</b></div>
      <Ask text={solved ? c.done : c.ask} hint={fixed ? null : msg} />
      <Work browser={<LnBrowser path={nav.path} title={pg.title} canBack={nav.canBack} onBack={() => { sfx('tap', true); nav.back(); }}
        page={<SitePage nodes={pg.nodes} onLink={(h) => { if (canTap) { sfx('tap', true); nav.go(h); } }} canTap={canTap} fresh={fixed ? [target] : null} />} />}
        code={<Src lines={lines} className="ln-src"
          lineProps={(ln) => (fixed ? (ln.id === target ? { cls: 'is-new' } : null)
            : ln.id === 'h1' ? null : { onTap: () => tapLine(ln), disabled: !canTap, led: led && ln.id === target, cls: shake === ln.id ? 'fx-no' : '' })} />} />
    </Stage>
  );
}

// ── 11. TRANSFER. Написать ссылку «На главную» целиком.
const linkRe = /^<\s*a\s+href\s*=\s*(["']?)([^"'\s>]*)\1\s*>(.*?)<\s*\/\s*a\s*>$/i;
function linkIssue(raw, msgs) {
  const s = String(raw || '').trim();
  const m = s.match(linkRe);
  if (m) {
    if (m[2].toLowerCase() !== 'index.html') return msgs.wrongFile;
    if (!okText(m[3].trim())) return msgs.noText;
    return null;
  }
  if (!/^<\s*a\b/i.test(s)) return msgs.noOpen;
  if (!/^<\s*a\s+href\s*=/i.test(s)) return msgs.noHref;
  const gt = s.indexOf('>');
  if (gt < 0) return msgs.noGt;
  const hm = s.slice(0, gt).match(/href\s*=\s*["']?([^"'\s>]*)/i);
  if (!hm || hm[1].toLowerCase() !== 'index.html') return msgs.wrongFile;
  const rest = s.slice(gt + 1);
  const text = rest.split('<')[0];
  if (!okText(text.trim())) return msgs.noText;
  return msgs.noClose;
}
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!rec;
  const ty = useTagTyping({ max: 60 });
  const [msg, setMsg] = useState(null);
  const [misses, setMisses] = useState(0);
  const nav = useNav('rules.html');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.praise : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tries = useRef(0);
  const led = useIdleLed(canTap && !solved && !ty.val, 0);
  const win = (text, quoted) => {
    sfx('win', true); setMsg(null); put({ done: true, text });
    log({ screenId: 's11', type: 'write-link', correct: true, firstTry: misses === 0, attempts: tries.current + 1, hints: misses, quoted });
    sayNow(quoted ? c.praise : joinL(c.quotes, c.praise), 'cheer');
  };
  useEffect(() => {
    if (solved) return;
    const m = ty.val.trim().match(linkRe);
    if (m && m[2].toLowerCase() === 'index.html' && okText(m[3].trim())) win(m[3].trim(), !!m[1]);
  }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const issue = linkIssue(ty.val, c.msgs);
    if (!issue) return;
    const n = misses + 1;
    setMisses(n); sfx('soft', true);
    const h = n >= 2 ? stepHint(c.hints, n - 1) : null;
    setMsg(h ? joinL(issue, h) : issue);
    sayNow(h ? joinL(issue, h) : issue, 'think');
  };
  // Живое превью: как только строка похожа на ссылку, она появляется на странице.
  const live = (() => {
    if (solved) return { href: 'index.html', text: rec.text };
    const m = ty.val.trim().match(linkRe);
    return m && okText(m[3].trim()) ? { href: m[2], text: m[3].trim() } : null;
  })();
  const rules = PG['rules.html'];
  const input = (
    <span className={'ln-inp ln-inp-wide' + (led ? ' is-led' : '')}>
      <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check}
        placeholder={L3('<a href="…">…</a>', '<a href="…">…</a>', '<a href="…">…</a>')} label={c.ask} max={60} cls="tk-input-tag" /><Led on={led} />
    </span>
  );
  const lines = [bLine('h1', 'h1', pick(rules.title)), bLine('p', 'p', pick(rules.text)),
    solved ? aLine('home', { href: 'index.html', text: rec.text }) : nodeLine('gap', input)];
  const pg = nav.path === 'rules.html'
    ? { title: pick(rules.title), nodes: [{ kind: 'h1', v: pick(rules.title) }, { kind: 'p', v: pick(rules.text) }].concat(live ? [{ kind: 'links', items: [{ id: 'home', text: live.text, href: live.href }] }] : []) }
    : pageFor(pick, nav.path);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Ask text={solved ? c.praise : c.ask} hint={solved ? null : msg} />
      <Work cls="ln-typing" browser={<LnBrowser path={nav.path} title={pg.title} canBack={nav.canBack} onBack={() => nav.back()}
        page={<SitePage nodes={pg.nodes} onLink={(h) => { sfx('tap', true); nav.go(h); }} canTap={canTap} fresh={live ? ['home'] : null} />} />}
        code={<Src lines={lines} className="ln-src" lineProps={(ln) => (ln.id === 'gap' ? { cls: 'is-gap' } : ln.id === 'home' ? { cls: 'is-new' } : null)} />} />
      {!solved ? <KeyRow keys={['<a ', 'href="', 'index.html', '"', '>', '</a>']} ty={ty} canTap={canTap} onCheck={check} ready={!!ty.val} /> : null}
    </Stage>
  );
}

// ── 12. RESULT. Меню своего сайта: тема → три ссылки (файл + текст).
const siteHtml = (title, links) => buildHtml(title, [blk('h1', 'h1', title)])
  .replace('  </body>', '    <ul>\n' + links.map((l) => '      <li><a href="' + escHtml(l.href) + '">' + escHtml(l.text) + '</a></li>').join('\n') + '\n    </ul>\n  </body>');
function makeArtifact(store) {
  const saved = store.get('artifact');
  if (saved) return saved;
  const own = store.get('s12');
  if (!own || !own.done) return null;
  return { type: 'html-page', topic: own.topic, title: own.title, links: own.links, html: siteHtml(own.title, own.links) };
}
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const [topic, setTopic] = useState(rec ? rec.topic : null);
  const [rows, setRows] = useState(rec ? rec.links.map((l) => ({ href: l.href, text: l.text })) : [{ href: '', text: '' }, { href: '', text: '' }, { href: '', text: '' }]);
  const [msg, setMsg] = useState(null);
  const done = !!(rec && rec.done);
  const nav = useNav('index.html');
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const T0 = c.topics.find((t) => t.id === topic);
  const names = {}; c.pages.forEach((pg) => { names[pg.file] = pg.name; });
  const files = c.pages.map((pg) => pg.file);
  const complete = (r) => !!r.href && okText(r.text);
  const active = rows.findIndex((r) => !complete(r));
  const filled = rows.filter(complete).length;
  const led = useIdleLed(canTap && !done && !!topic, filled * 10 + (active >= 0 && rows[active].href ? 1 : 0));
  const tries = useRef(0);
  const used = rows.map((r) => r.href).filter(Boolean);
  const pickFile = (f) => {
    if (!canTap || done || active < 0) return;
    if (used.indexOf(f) >= 0 && rows[active].href !== f) { sfx('soft', true); setMsg(c.used); sayNow(c.used, 'think'); return; }
    sfx('pop', true); setMsg(null);
    setRows((rs) => rs.map((r, i) => (i === active ? Object.assign({}, r, { href: f }) : r)));
  };
  const setText = (i, v) => setRows((rs) => rs.map((r, j) => (j === i ? Object.assign({}, r, { text: v }) : r)));
  // Текст совпадает с названием ДРУГОЙ страницы — гость запутается (как на экране 5).
  const mismatch = (() => {
    for (let i = 0; i < rows.length; i += 1) {
      const r = rows[i]; if (!r.href || !okText(r.text)) continue;
      const t = r.text.trim().toLowerCase();
      const other = c.pages.find((pg) => pg.file !== r.href && pick(pg.name).toLowerCase() === t);
      if (other) return fillL(c.mismatch, { t: r.text.trim() });
    }
    return null;
  })();
  useEffect(() => {
    if (done || !topic || filled < 3 || mismatch || rows.some((r) => hasTags(r.text))) return undefined;
    const t = setTimeout(() => {
      tries.current += 1;
      const title = pick(T0.label);
      const links = rows.map((r) => ({ href: r.href, text: r.text.trim() }));
      put({ done: true, topic, title, links });
      log({ screenId: 's12', type: 'project', correct: true, firstTry: true, attempts: tries.current });
      sfx('win', true); sayNow(c.done, 'cheer');
    }, 1000);
    return () => clearTimeout(t);
  }, [rows, topic, filled, mismatch]); // eslint-disable-line react-hooks/exhaustive-deps
  const title = T0 ? pick(T0.label) : '';
  const tagMsg = rows.some((r) => hasTags(r.text)) ? c.noTags : null;
  const menuItems = rows.map((r, i) => ({ id: 'm' + i, href: r.href || null, noHref: !r.href, text: okText(r.text) ? r.text.trim() : (r.href ? '…' : '') }))
    .filter((it) => it.text);
  const pg = nav.path === 'index.html'
    ? { title, nodes: [{ kind: 'h1', v: title }].concat(menuItems.length ? [{ kind: 'menu', items: menuItems }] : []) }
    : (names[nav.path] ? { title: pick(names[nav.path]), nodes: [{ kind: 'h1', v: pick(names[nav.path]) }, { kind: 'p', v: pick(fillL(c.pageText, { n: names[nav.path] })) }] } : pageFor(pick, nav.path));
  const lines = topic ? [bLine('h1', 'h1', title), nodeLine('ul-o', <Tag tag="ul" />, 0, 'ul')].concat(rows.map((r, i) => {
    const isAct = i === active && !done;
    const inp = done ? null : (
      <span className="ln-inp"><InlineInput value={r.text} onChange={(v) => setText(i, v)} label={c.askItems} max={24}
        placeholder={r.href ? names[r.href] : L3('…', '…', '…')} /></span>
    );
    const node = (
      <>
        <Tag tag="li" />
        <AOpen href={r.href} hrefNode={r.href ? null : <span className={'ln-hole' + (isAct ? ' is-act' : '')} />} />
        {done ? <span className="tk-tx">{r.text}</span> : inp}
        <Tag tag="a" close /><Tag tag="li" close />
      </>
    );
    return Object.assign(nodeLine('r' + i, node, 1, 'li'), { act: isAct });
  })).concat([nodeLine('ul-c', <Tag tag="ul" close />, 0, 'ul')]) : [];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={topic ? c.askItems : c.askTopic} nav={navOf(p, canGo)}>
      <Ask text={!topic ? c.askTopic : done ? c.done : c.askItems} hint={done ? null : (msg || mismatch || tagMsg)} n={topic && !done ? filled + '/3' : null} />
      {!topic ? (
        <div className="ln-topics">
          {c.topics.map((t) => (
            <button key={t.id} type="button" className="ln-topic" disabled={!canTap} onClick={() => { sfx('tap', true); setTopic(t.id); }}>
              {pick(t.label)}<Led on={led} />
            </button>
          ))}
        </div>
      ) : (
        <>
          <Work cls="ln-typing" browser={<LnBrowser path={nav.path} title={pg.title} canBack={nav.canBack} onBack={() => nav.back()}
            page={<SitePage nodes={pg.nodes} onLink={(h) => { sfx('tap', true); nav.go(h); }} canTap={canTap} />} />}
            code={<Src lines={lines} className="ln-src ln-src-sm" lineProps={(ln) => (ln.act ? { cls: 'is-cur' } : null)} />} />
          {!done ? <Folder files={files} names={names} onPick={pickFile} canTap={canTap} used={used} compact
            ledFile={led && active >= 0 && !rows[active].href ? files.find((f) => used.indexOf(f) < 0) : null} /> : null}
        </>
      )}
    </Stage>
  );
}

// ── 13. ACHIEVEMENT. Главная своего сайта и её код — сохранить.
function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const saved = !!(rec && rec.saved);
  const own = store.get('s12');
  const title = own ? own.title : pick(PG['index.html'].title);
  const links = own ? own.links : homeLinks(pick, null).map((l) => ({ href: l.file, text: l.text }));
  const [speaker, , spoken, sayNow] = useVoice([{ text: saved ? c.saved : c.say, pose: saved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(saved, spoken);
  const [view, setView] = useState('result');
  const led = useIdleLed(canTap && !saved, 0);
  const save = () => {
    if (!canTap || saved) return;
    sfx('win', true);
    store.set('artifact', { type: 'html-page', topic: own ? own.topic : null, title, links, html: siteHtml(title, links) });
    put({ saved: true });
    sayNow(c.saved, 'cheer');
  };
  const lines = [bLine('h1', 'h1', title), nodeLine('ul-o', <Tag tag="ul" />, 0, 'ul')]
    .concat(links.map((l, i) => nodeLine('r' + i, <><Tag tag="li" /><AOpen href={l.href} /><span className="tk-tx">{l.text}</span><Tag tag="a" close /><Tag tag="li" close /></>, 1, 'li')))
    .concat([nodeLine('ul-c', <Tag tag="ul" close />, 0, 'ul')]);
  const nodes = [{ kind: 'h1', v: title }, { kind: 'menu', items: links.map((l, i) => ({ id: 'm' + i, href: l.href, text: l.text })) }];
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <div className="site-top">
        <span className="site-author">{pick(UI.author)}: <b>{p.name}</b></span>
        <div className="only-narrow">
          <SegToggle value={view} onChange={setView} options={[{ v: 'result', label: UI.result }, { v: 'code', label: UI.code }]} />
        </div>
      </div>
      <div className={'site view-' + view}>
        <div className="site-b"><LnBrowser path="index.html" title={title} page={<SitePage nodes={nodes} canTap={false} />} cls="mb-site" /></div>
        <div className="site-c"><Src lines={lines} className="src-site ln-src ln-src-sm" /></div>
      </div>
      {saved ? (
        <div className="saved-stamp fx-ok"><Icon name="check" size={18} />{pick(UI.saved)}</div>
      ) : (
        <button type="button" className={'bigbtn' + (led ? ' is-led' : '')} disabled={!canTap} onClick={save}>
          <span className="bigbtn-in"><Icon name="save" size={20} />{pick(UI.save)}</span>
          <Led on={led} />
        </button>
      )}
    </Stage>
  );
}

// ── 14. PREVIEW. Итог и мостик к уроку о картинках.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'bye' }]);
  const canGo = useAdvanceGate(true, spoken);
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.say}
      nav={<NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} />}>
      <div className="recap">
        <div className="ln-recap mono" aria-hidden="true" translate="no">
          <AOpen href="films.html" /><span className="tk-tx">{pick(PG['films.html'].name)}</span><Tag tag="a" close />
        </div>
        <div className="skills">
          {c.skills.map((sk, i) => (
            <div className="skill-row" key={i} style={{ animationDelay: (0.2 + i * 0.12) + 's' }}>
              <span className="skill-tick"><Icon name="check" size={14} /></span>
              {pick(sk)}
            </div>
          ))}
        </div>
        <div className="bye-next next-card">
          <span className="bye-next-ic"><Icon name="pic" size={26} /></span>
          <span className="bye-next-t">
            <span>{pick(UI.nextLesson)}</span>
            <b>{pick(c.next)}</b>
          </span>
          <span className="next-tags mono" translate="no">img · src · alt</span>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 }, { id: 's3', code: 'SHOW', Comp: S3 },
  { id: 's4', code: 'PREDICT', Comp: S4 }, { id: 's5', code: 'LEVEL-1', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 },
  { id: 's7', code: 'LEVEL-3', Comp: S7 }, { id: 's8', code: 'LEVEL-4', Comp: S8 }, { id: 's9', code: 'LEVEL-5', Comp: S9 },
  { id: 's10', code: 'CHECK', Comp: S10 }, { id: 's11', code: 'TRANSFER', Comp: S11 }, { id: 's12', code: 'RESULT', Comp: S12 },
  { id: 's13', code: 'ACHIEVEMENT', Comp: S13 }, { id: 's14', code: 'PREVIEW', Comp: S14 }
];
// «Повторить» стирает только этот экран; свой сайт (s12) и сохранённую
// страницу (artifact) повтор других экранов не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'] };

export default function HtmlLesson04({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store) })
  });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenLn(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenLn>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenLn>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА: стили урока 2 (код, браузер, клавиши …) + свои (ln-…).
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:ln-own.css@*/
`;
