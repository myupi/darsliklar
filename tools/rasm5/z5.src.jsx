// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 5 — «Изображения»
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/rasm5/build.mjs → lessons/html/05-izobrazheniya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · «Изображения» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026). Урок с нуля; основа кода — уроки 2–4. Облик — эталона «Редактор» (naborRedaktor);
// бумаги нет нигде. Страница рецепта плова из уроков 3–4 — один текст, без фото. Ученик учит тег img
// и атрибуты src и alt, ставит картинки, чинит сломанные и делает картинку на своей странице.
// Загадка (без имён): Коди написал картинке href="osh.jpg", как у ссылки, и уверен, что фото
// появится; в выводе признаёт ошибку — картинке нужен src.
//
// ДУГА (20 экранов; экрана плана нет; w1–w3 стоят после s11). Типы заданий — по разделу 3а навыка:
//   s1 крючок (страница без фото → с фото, загадка)
//   img и src:     s2 показ · s3 вписать имя файла (Fill in the Blanks) · s4 строка кода ↔ картинка (Visual Code Mapping)
//   alt и без </img>: s5 показ · s6 собрать <img …> (Code Builder) · s7 img / src / alt ↔ что делает (Matching Pairs)
//   поломки:       s8 показ «нет src», «нет файла» · s9 вписать alt (Fill in the Blanks) · s10 до и после (Before / After)
//   картинка из интернета (заказчик, 05.11.2026): w1 показ https://, имя сайта, файл; без https:// — сломанная ·
//                 w2 вписать полный адрес (Fill in the Blanks) · w3 «откуда браузер возьмёт» (Sort, по одному)
//   своя картинка: s11 показ «страница целиком» · s12 свой src, s13 свой alt (Live Code Preview) · s14 вернуть src (Debug & Fix)
//   итоговая проверка: q1 найти строку с ошибкой (Error Detective) · q2 верно или нет (True / False)
//   s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: есть файл — картинка; нет такого файла — значок сломанной картинки и текст alt
//     (без alt — один значок); нет src — ничего (есть alt — только его текст); у img нет закрывающего тега;
//     картинки — строчные: несколько img встают в строку.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ: rasm — картинка; rasm fayli — файл картинки; manba — источник (draft); alt matni,
// muqobil matn — альтернативный текст (draft); buzilgan rasm belgisi — значок сломанной картинки (draft).
// В речи img и src — по буквам («I M G», «S R C»), alt — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-05-izobrazheniya',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '5-dars. Rasmlar',
    ru: 'Урок 5. Изображения',
    en: 'Lesson 5. Images'
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
  next: L3('Formalar', 'Формы', 'Forms'),
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
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card, site, alt.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт Коди — содержимое страниц в браузере (не звучит).
  site: {
    osh: L3('Osh retsepti', 'Рецепт плова', 'Plov recipe'),
    oshText: L3("Guruch, go'sht va sabzi kerak bo'ladi.", 'Нужны рис, мясо и морковь.', 'You need rice, meat and carrots.'),
    games: L3("Mening o'yinlarim", 'Мои игры', 'My games'),
    gamesText: L3("Men futbol o'ynashni yaxshi ko'raman.", 'Я люблю играть в футбол.', 'I love playing football.'),
    gallery: L3('Galereya', 'Галерея', 'Gallery'),
    cat: L3('Mening mushugim', 'Мой кот', 'My cat'),
    filesH: L3('Fayllar', 'Файлы', 'Files'),
    // Картинки в интернете (w1–w3): на «сайте Коди» kodi.uz (сайт урока, придуман для примера).
    hostH: L3('Sayt nomi', 'Имя сайта', 'Site name'),
    fileH: L3('Rasm fayli', 'Файл картинки', 'Picture file'),
    proto: L3("internetga yo'l", 'путь в интернет', 'the way to the internet'),
    hostL: L3('sayt nomi', 'имя сайта', 'the site name'),
    fileL: L3('rasm fayli', 'файл картинки', 'the picture file'),
    fruit: L3('Sevimli mevam', 'Мой любимый фрукт', 'My favourite fruit'),
    sun: L3('Quyoshli kun', 'Солнечный день', 'A sunny day'),
    webAlts: L3({ 'quyosh.jpg': 'Quyosh', 'olma.jpg': 'Olma' }, { 'quyosh.jpg': 'Солнце', 'olma.jpg': 'Яблоко' }, { 'quyosh.jpg': 'Sun', 'olma.jpg': 'Apple' }),
    alts: L3({ 'osh.jpg': 'Osh', 'mushuk.jpg': 'Mushuk', 'top.jpg': "To'p", 'gul.jpg': 'Gul' },
      { 'osh.jpg': 'Плов', 'mushuk.jpg': 'Кот', 'top.jpg': 'Мяч', 'gul.jpg': 'Цветок' },
      { 'osh.jpg': 'Plov', 'mushuk.jpg': 'Cat', 'top.jpg': 'Ball', 'gul.jpg': 'Flower' })
  },
  s1: {
    eyebrow: L3('Rasmsiz sahifa', 'Страница без фото', 'A page with no photo'),
    say: L3("Salom! O'tgan darsda sahifalarni havolalar bilan uladik. Mana, osh retsepti sahifasi. Lekin qarang, unda faqat yozuv bor. Rasmsiz osh unchalik ishtahani ochmaydi, to'g'rimi? Keling, sahifaga osh rasmini qo'yamiz. «Aylantirish» tugmasini bosing.",
      'Привет! На прошлом уроке мы связали страницы ссылками. Вот страница с рецептом плова. Но смотри: на ней один текст. Без фото плов не так уж аппетитный, правда? Давай поставим на страницу фото плова. Нажми «Превратить».',
      'Hi! Last time we connected pages with links. Here’s the plov recipe page. But look, it’s only text. Plov without a photo isn’t very tasty, right? Let’s put a photo of plov on the page. Tap “Transform”.'),
    magic: L3("Voy, qarang! Sarlavha ostida osh rasmi paydo bo'ldi. Endi sahifa ancha jonli ko'rinadi.", 'Ого, смотри! Под заголовком появилось фото плова. Теперь страница выглядит гораздо живее.', 'Whoa, look! A photo of plov appeared under the heading. Now the page looks much more alive.'),
    magicP: L3("Rasm kodda turgan joyida chiqdi: sarlavhadan keyin va yozuvdan oldin.", 'Фото встало там, где оно стоит в коде: после заголовка и перед текстом.', 'The photo appears where it is in the code: after the heading and before the text.'),
    done: L3("Bugun sahifaga shunday rasm qo'yishni o'rganasiz: o'z faylingizdan ham, internetdagi saytdan ham. Lekin oldin kichik topishmoq. Men ham rasm qo'ymoqchi bo'ldim. O'tgan darsda havolaga manzilni href bilan bergan edik-ku. Shuning uchun men rasmga ham href bilan osh.jpg faylini yozdim. Menimcha, endi sahifada osh rasmi chiqadi. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься ставить такие картинки — и из своих файлов, и с сайта в интернете. Но сначала маленькая загадка. Я тоже хотел поставить картинку. На прошлом уроке мы давали ссылке адрес через href. Вот и картинке я написал файл osh.jpg через href. По-моему, теперь на странице появится фото плова. Ну как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to put pictures like this on a page: from your own files and from a site on the internet. But first, a little riddle. I wanted to add a picture too. Last time we gave a link its address with href. So I gave the picture the file osh.jpg with href too. I think the plov photo will show up now. So what do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Rasm sarlavha ostida chiqdi", 'Фото встало под заголовком', 'The photo is under the heading')
  },
  s2: {
    eyebrow: L3('img tegi va src', 'Тег img и src', 'The img tag and src'),
    say: L3("Keling, birinchi rasmni birga qo'yamiz. Rasm uchun img tegi bor. img inglizcha image so'zidan olingan, ya'ni rasm degani. Qarang, sarlavha bilan yozuv orasiga img tegini qo'yamiz.",
      'Давай поставим первую картинку вместе. Для картинки есть тег img. img — от английского image, то есть картинка. Смотри, ставим тег img между заголовком и текстом.',
      'Let’s put in the first picture together. There’s the img tag for pictures. img comes from the word image: a picture. Watch, we put the img tag between the heading and the text.'),
    sayImg: L3("Lekin qarang: sahifada hech narsa chiqmadi. Chunki img tegi qaysi rasmni ko'rsatishni hali bilmaydi. Unga rasm fayli kerak bo'ladi.",
      'Но смотри: на странице ничего не появилось. Потому что тег img ещё не знает, какую картинку показать. Ему нужен файл картинки.',
      'But look: nothing showed up on the page, because the img tag doesn’t know which picture to show yet. It needs a picture file.'),
    sayRest: L3("Faylni src atributi aytadi. src inglizcha source so'zidan olingan, ya'ni manba degani. Qo'shtirnoq ichiga rasm faylining nomini yozamiz: osh.jpg. Mana, rasm chiqdi! Brauzer faylni topdi va uni img turgan joyga qo'ydi.",
      'Файл задаёт атрибут src. src — от английского source, то есть источник. В кавычках пишем имя файла картинки: osh.jpg. Вот и фото! Браузер нашёл файл и поставил его туда, где стоит img.',
      'The src attribute gives the file. src comes from the word source. In the quotes we write the picture file’s name: osh.jpg. There’s the photo! The browser found the file and put it where img is.'),
    done: L3("Eslab qoling: img tegi rasm qo'yadi, src esa qaysi faylni ko'rsatishni aytadi.", 'Запомни: тег img ставит картинку, а src говорит, какой файл показать.', 'Remember: the img tag puts in a picture, and src says which file to show.'),
    askImg: L3('Qarang: img tegi', 'Смотри: тег img', 'Watch: the img tag'),
    askSrc: L3('Qarang: src atributi', 'Смотри: атрибут src', 'Watch: the src attribute'),
    askDone: L3('img — rasm, src — fayl', 'img — картинка, src — файл', 'img — picture, src — file')
  },
  s3: {
    eyebrow: L3('Faylni yozing', 'Впиши файл', 'Type the file'),
    say: L3("Endi navbat sizga. O'yinlar sahifasiga to'p rasmini qo'yamiz. img tegi joyida, lekin src qo'shtirnog'i bo'sh turibdi. Pastdagi fayllar ro'yxatidan to'p rasmini toping va uning nomini qo'shtirnoq ichiga yozing.",
      'Теперь твоя очередь. Поставим на страницу игр фото мяча. Тег img на месте, но кавычки src пустые. Найди фото мяча в списке файлов внизу и впиши его имя в кавычки.',
      'Now it’s your turn. Let’s put a photo of a ball on the games page. The img tag is in place, but the src quotes are empty. Find the ball photo in the list of files below and type its name in the quotes.'),
    msgs: {
      empty: L3("Qo'shtirnoq ichiga fayl nomini yozing.", 'Впиши имя файла в кавычки.', 'Type the file name in the quotes.'),
      noExt: L3("Rasm fayli nomi oxirida .jpg bo'ladi. Fayllar ro'yxatiga qarang.", 'Имя файла картинки заканчивается на .jpg. Посмотри в список файлов.', 'A picture file name ends with .jpg. Look at the list of files.'),
      other: L3("Bu boshqa rasm bo'ladi. Bizga to'p rasmi kerak.", 'Это другая картинка. Нам нужно фото мяча.', 'That’s a different picture. We need the ball photo.'),
      typo: L3("Bunday fayl yo'q, shuning uchun brauzer buzilgan rasm belgisini ko'rsatdi. Nomni ro'yxatdagidek, harfma-harf yozing.", 'Такого файла нет, поэтому браузер показал значок сломанной картинки. Напиши имя буква в букву, как в списке.', 'There’s no such file, so the browser shows a broken picture icon. Type the name letter by letter, as in the list.')
    },
    hints: [
      L3('Sahifaga qaysi rasm kerak?', 'Какая картинка нужна странице?', 'Which picture does the page need?'),
      L3("To'p rasmining fayli fayllar ro'yxatida turibdi.", 'Файл с фото мяча есть в списке файлов.', 'The ball photo file is in the list of files.'),
      L3("Fayl nomi top.jpg bo'ladi. Uni qo'shtirnoq ichiga yozing.", 'Имя файла — top.jpg. Впиши его в кавычки.', 'The file name is top.jpg. Type it in the quotes.')
    ],
    ok: L3("Zo'r! To'p rasmi chiqdi. Brauzer siz yozgan faylni topdi.", 'Огонь! Фото мяча на месте. Браузер нашёл файл, который ты написал.', 'Awesome! The ball photo is there. The browser found the file you typed.'),
    ask: L3("Qo'shtirnoq ichiga rasm fayli nomini yozing", 'Впиши в кавычки имя файла картинки', 'Type the picture file name in the quotes')
  },
  s4: {
    eyebrow: L3('Kod va rasm', 'Код и картинка', 'Code and picture'),
    say: L3("Galereyada uchta rasm bor, kodda esa uchta img qatori. Rasmlar yonma-yon, xuddi kod qatorlaridagi tartibda turibdi. Kodda bitta qator yonadi. Siz esa sahifada shu qator chiqargan rasmni bosing.",
      'В галерее три картинки, а в коде три строки img. Картинки стоят рядом в том же порядке, что и строки кода. В коде загорается одна строка. А ты нажми на странице картинку, которую она выводит.',
      'The gallery has three pictures, and the code has three img lines. The pictures sit side by side in the same order as the code lines. One line lights up in the code. Tap the picture on the page that this line shows.'),
    askQ: L3('Yongan qator qaysi rasmni chiqaradi?', 'Какую картинку выводит горящая строка?', 'Which picture does the lit line show?'),
    rounds: [
      null,
      L3("Endi men qatorlarni almashtirdim. Qarang, rasmlar ham joyini almashtirdi. Yongan qator qaysi rasmni chiqaradi?", 'Теперь я поменял строки местами. Смотри, картинки тоже поменялись. Какую картинку выводит горящая строка?', 'Now I swapped the lines. Look, the pictures swapped too. Which picture does the lit line show?'),
      L3("Oxirgisi. Bu safar yongan qatorda fayl nomida xato bor. Sahifada bu qatordan nima chiqdi?", 'Последняя. На этот раз в имени файла горящей строки ошибка. Что эта строка вывела на странице?', 'The last one. This time the lit line has a typo in the file name. What did this line show on the page?')
    ],
    ok: [
      L3("To'g'ri! top.jpg qatori to'p rasmini chiqaradi.", 'Верно! Строка top.jpg выводит фото мяча.', 'Right! The top.jpg line shows the ball.'),
      L3("To'g'ri! Qatorlar tartibi o'zgarsa, rasmlar tartibi ham o'zgaradi.", 'Верно! Меняется порядок строк — меняется и порядок картинок.', 'Right! Change the order of the lines, and the pictures change order too.'),
      L3("To'g'ri! Fayl topilmadi, shuning uchun brauzer buzilgan rasm belgisini qo'ydi.", 'Верно! Файл не нашёлся, поэтому браузер поставил значок сломанной картинки.', 'Right! The file wasn’t found, so the browser put a broken picture icon.')
    ],
    miss: {
      order: L3("Bu boshqa rasm. Rasmlar kod qatorlari tartibida turadi: birinchi qator birinchi rasmni, keyingisi keyingi rasmni chiqaradi.", 'Это другая картинка. Картинки идут в порядке строк кода: первая строка — первая картинка, следующая — следующая.', 'That’s a different picture. The pictures go in the order of the code lines: the first line gives the first picture, the next one the next.'),
      broken: L3("Bu rasm joyida chiqdi. Yongan qatordagi fayl nomiga qarang: unda bitta harf yetishmaydi.", 'Эта картинка на месте. Посмотри на имя файла в горящей строке: в нём не хватает буквы.', 'This picture showed up fine. Look at the file name in the lit line: it’s missing a letter.')
    },
    done: L3("Barakalla! Endi har bir img qatori qaysi rasmni chiqarishini bilasiz.", 'Молодец! Теперь ты знаешь, какую картинку выводит каждая строка img.', 'Well done! Now you know which picture each img line shows.'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило раунда, 3 — какую картинку нажать (она загорается).
    hint1: L3("Yonib turgan qatorga qarang: unda qaysi fayl nomi yozilgan?", 'Посмотри на горящую строку: какое имя файла в ней написано?', 'Look at the lit line: which file name is written in it?'),
    hint2: {
      order: L3("Rasmlar kod qatorlari tartibida turadi. Yongan qator kodda nechanchi bo'lsa, rasm ham sahifada o'sha joyda bo'ladi.", 'Картинки стоят в порядке строк кода. Какая по счёту горящая строка, на том же месте и картинка.', 'The pictures go in the order of the code lines. Whatever place the lit line has, the picture has the same place on the page.'),
      broken: L3("Fayl nomida xato bo'lsa, brauzer faylni topa olmaydi. Unda rasm o'rnida nima chiqadi?", 'Если в имени файла ошибка, браузер не найдёт файл. Что тогда выходит на месте картинки?', 'If the file name has a typo, the browser can’t find the file. What shows up in the picture’s place then?')
    },
    hint3: [
      L3("Yongan qator kodda ikkinchi turibdi, unda top.jpg. Sahifadagi ikkinchi rasmni bosing, u to'p rasmi.", 'Горящая строка в коде вторая, в ней top.jpg. Нажми вторую картинку на странице, это мяч.', 'The lit line is second in the code, with top.jpg. Tap the second picture on the page: the ball.'),
      L3("Endi yongan qator uchinchi turibdi. Sahifadagi uchinchi rasmni bosing, u yana to'p rasmi.", 'Теперь горящая строка третья. Нажми третью картинку на странице, это снова мяч.', 'Now the lit line is third. Tap the third picture on the page: the ball again.'),
      L3("Yongan qator birinchi, uning fayl nomida bitta harf yetishmaydi. Sahifadagi birinchi rasmni bosing, u buzilgan rasm belgisi.", 'Горящая строка первая, в её имени файла не хватает буквы. Нажми первую картинку на странице, то есть значок сломанной картинки.', 'The lit line is first, and its file name is missing a letter. Tap the first picture on the page, the broken picture icon.')
    ]
  },
  s5: {
    eyebrow: L3('alt atributi', 'Атрибут alt', 'The alt attribute'),
    say: L3("Rasmning yana bitta muhim atributi bor: alt. alt inglizcha alternative text so'zlaridan olingan, ya'ni muqobil matn degani. U rasmda nima borligini so'z bilan aytadi. Hozir rasm ochildi, shuning uchun alt matni ko'rinmaydi. Lekin rasm ochilmasa nima bo'ladi? Keling, ko'ramiz.",
      'У картинки есть ещё один важный атрибут: alt. alt — от английского alternative text, то есть запасной текст. Он словами говорит, что на картинке. Сейчас фото открылось, поэтому текста alt не видно. А что будет, если фото не откроется? Давай посмотрим.',
      'A picture has one more important attribute: alt. alt comes from alternative text. It says in words what’s in the picture. Right now the photo opened, so the alt text isn’t visible. But what if the photo doesn’t open? Let’s see.'),
    sayBroken: L3("Fayl nomida xato bor: jpg o'rniga jgp yozildi. Brauzer rasmni topa olmadi, shuning uchun buzilgan rasm belgisini va alt matnini ko'rsatdi. Endi rasm ochilmasa ham, unda nima borligini bilib turamiz. Yana bir gap: ko'rish qiyin bo'lgan odamlarga sahifani ovoz bilan o'qib beradigan dasturlar ham aynan alt matnini o'qiydi.",
      'В имени файла ошибка: вместо jpg написано jgp. Браузер не нашёл картинку, поэтому показал значок сломанной картинки и текст alt. Даже без фото мы знаем, что там было. И ещё: программы, которые читают страницу вслух людям с плохим зрением, читают именно текст alt.',
      'The file name has a typo: it says jgp instead of jpg. The browser couldn’t find the picture, so it showed a broken picture icon and the alt text. Even without the photo, we know what was there. One more thing: programs that read pages aloud for people who can’t see well read exactly the alt text.'),
    sayNoAlt: L3("Endi alt atributini olib tashlaymiz. Qarang, faqat buzilgan rasm belgisi qoldi. Bu yerda nima bo'lgani endi hech kimga tushunarli emas.",
      'А теперь уберём атрибут alt. Смотри, остался только значок сломанной картинки. Что здесь было, теперь непонятно никому.',
      'Now let’s remove the alt attribute. Look, only the broken picture icon is left. Now nobody can tell what was here.'),
    sayVoid: L3("Fayl nomini to'g'rilab, alt atributini qaytardik. Rasm yana joyida. Diqqat qiling: img tegining yopuvchi tegi bo'lmaydi. Rasm ichiga matn yozilmaydi, shuning uchun yopuvchi img tegi kerak emas.",
      'Исправили имя файла и вернули alt. Фото снова на месте. Обрати внимание: у тега img нет закрывающего тега. Внутрь картинки текст не пишут, поэтому закрывающий img не нужен.',
      'We fixed the file name and brought alt back. The photo is back. Note: the img tag has no closing tag. You don’t write text inside a picture, so a closing img isn’t needed.'),
    done: L3("Demak, src rasm faylini aytadi, alt esa rasmni so'z bilan tasvirlaydi. Ikkalasi ham img tegining ichida yoziladi.", 'Значит, src задаёт файл картинки, а alt описывает картинку словами. Оба пишут внутри тега img.', 'So src gives the picture file, and alt describes the picture in words. Both go inside the img tag.'),
    alt: L3('Likopchada osh', 'Плов на тарелке', 'Plov on a plate'),
    noClose: L3('Yopuvchi teg kerak emas', 'Закрывающий тег не нужен', 'No closing tag needed'),
    askAlt: L3('Qarang: alt atributi', 'Смотри: атрибут alt', 'Watch: the alt attribute'),
    askBroken: L3('Qarang: rasm ochilmasa', 'Смотри: если фото не открылось', 'Watch: when the photo doesn’t open'),
    askVoid: L3('Qarang: yopuvchi teg yo\'q', 'Смотри: закрывающего тега нет', 'Watch: there’s no closing tag'),
    askDone: L3('src — fayl, alt — rasm haqida so\'z', 'src — файл, alt — слова о картинке', 'src — file, alt — words about the picture')
  },
  s6: {
    eyebrow: L3("Rasmni yig'ing", 'Собери картинку', 'Build the picture'),
    say: L3("Endi img tegini o'zingiz yig'ing. Kodda to'rtta bo'sh joy bor. Oldin teg boshlanadi, keyin ikkita atribut keladi, oxirida esa teg yopiladi. Atributlar tartibi muhim emas: src oldin bo'lsa ham, alt oldin bo'lsa ham bo'laveradi. Bitta bo'lak esa umuman ortiqcha.",
      'Теперь собери тег img сам. В коде четыре пустых места. Сначала начинается тег, потом идут два атрибута, а в конце тег закрывается. Порядок атрибутов не важен: можно сначала src, можно сначала alt. А один кусок вообще лишний.',
      'Now build the img tag yourself. The code has four empty spots. First the tag starts, then come two attributes, and at the end the tag closes. The order of the attributes doesn’t matter: src first or alt first, both are fine. And one piece isn’t needed at all.'),
    why: {
      close: L3("img tegida yopuvchi teg bo'lmaydi. Bu bo'lak ortiqcha.", 'У img нет закрывающего тега. Этот кусок лишний.', 'img has no closing tag. This piece isn’t needed.'),
      openFirst: L3("Teg doim burchakli qavs va nomi bilan boshlanadi. Oldin img boshini qo'ying.", 'Тег всегда начинается с уголка и имени. Сначала поставь начало img.', 'A tag always starts with a bracket and its name. Put the start of img first.'),
      openOnce: L3("Teg boshi joyida turibdi. Endi atribut kerak bo'ladi.", 'Начало тега уже на месте. Теперь нужен атрибут.', 'The start of the tag is already there. Now you need an attribute.'),
      gtLast: L3("Hali ikkinchi atribut kerak. Burchakli qavs eng oxirida keladi.", 'Ещё нужен второй атрибут. Уголок идёт в самом конце.', 'You still need the second attribute. The bracket goes at the very end.'),
      gtEarly: L3("Hali erta. Oldin ikkala atributni qo'ying, teg keyin yopiladi.", 'Рано. Сначала оба атрибута, а потом тег закрывается.', 'Too early. Put both attributes first, then the tag closes.')
    },
    hints: [
      L3('Teg nima bilan boshlanadi?', 'С чего начинается тег?', 'What does a tag start with?'),
      L3("Birinchi bo'lib img boshi, keyin src va alt keladi.", 'Сначала начало img, потом src и alt.', 'First the start of img, then src and alt.'),
      L3("Tartib shunday bo'ladi: img boshi, src, alt va burchakli qavs. Yopuvchi teg kerak emas.", 'Порядок такой: начало img, src, alt и уголок. Закрывающий тег не нужен.', 'The order is: the start of img, src, alt and the bracket. No closing tag.')
    ],
    ok: L3("Ajoyib! Teg to'g'ri yig'ildi, to'p rasmi ham chiqdi. Ortiqcha bo'lakni ham to'g'ri tashlab ketdingiz.", 'Отлично! Тег собран верно, и фото мяча появилось. И лишний кусок ты правильно не взял.', 'Great! The tag is built right, and the ball photo appeared. And you were right to leave the extra piece.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order'),
    altV: L3("To'p", 'Мяч', 'Ball')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Bugun uchta yangi so'z bilan tanishdik: img, src va alt. Har birini u bajaradigan ish bilan juftlang. Oldin so'zni bosing, keyin uning ishini bosing.",
      'Сегодня у нас три новых слова: img, src и alt. Соедини каждое с тем, что оно делает. Сначала нажми слово, потом его дело.',
      'Today we met three new words: img, src and alt. Match each one with what it does. Tap a word first, then what it does.'),
    cards: {
      img: L3("Sahifaga rasm qo'yadi", 'Ставит картинку на страницу', 'Puts a picture on the page'),
      src: L3("Qaysi rasm faylini ko'rsatishni aytadi", 'Говорит, какой файл картинки показать', 'Says which picture file to show'),
      alt: L3("Rasmni so'z bilan tasvirlaydi", 'Описывает картинку словами', 'Describes the picture in words')
    },
    pairOk: {
      img: L3("To'g'ri! img tegi sahifaga rasm qo'yadi.", 'Верно! Тег img ставит картинку.', 'Right! The img tag puts in a picture.'),
      src: L3("To'g'ri! src atributi rasm faylini aytadi.", 'Верно! Атрибут src задаёт файл картинки.', 'Right! The src attribute gives the picture file.'),
      alt: L3("To'g'ri! alt atributi rasmni so'z bilan tasvirlaydi.", 'Верно! Атрибут alt описывает картинку словами.', 'Right! The alt attribute describes the picture in words.')
    },
    why: {
      img: L3("img bu teg, u sahifaga rasm qo'yadi.", 'img — это тег, он ставит картинку на страницу.', 'img is the tag; it puts a picture on the page.'),
      src: L3("src bu atribut, u qaysi fayl ekanini aytadi.", 'src — это атрибут, он говорит, какой файл.', 'src is the attribute that says which file.'),
      alt: L3("alt bu atribut, u rasm ochilmasa ko'rinadigan so'zlarni beradi.", 'alt — это атрибут, он даёт слова, которые видны, если фото не открылось.', 'alt is the attribute that gives the words shown if the photo doesn’t open.')
    },
    hints: [
      L3("Qaysi so'z teg, qaysilari atribut?", 'Какое слово — тег, а какие — атрибуты?', 'Which word is the tag, and which are attributes?'),
      L3("img teg bo'ladi, u rasmni o'zi qo'yadi.", 'img — тег, он сам ставит картинку.', 'img is the tag; it puts the picture in itself.'),
      L3("img rasm qo'yadi, src faylni aytadi, alt rasmni so'z bilan tasvirlaydi.", 'img ставит картинку, src задаёт файл, alt описывает словами.', 'img puts in a picture, src gives the file, alt describes it in words.')
    ],
    ok: L3("Qoyil! Rasmning hamma bo'lagini bilasiz.", 'Класс! Ты знаешь все части картинки.', 'Brilliant! You know every part of a picture.'),
    ask: L3("So'zni uning ishi bilan juftlang", 'Соедини слово с его делом', 'Match each word with what it does'),
    askPlace: L3('Endi uning ishini bosing', 'Теперь нажми его дело', 'Now tap what it does'),
    pickFirst: L3("Oldin so'zni bosing.", 'Сначала нажми слово.', 'Tap a word first.')
  },
  s8: {
    eyebrow: L3('Rasm chiqmasa', 'Когда картинки нет', 'When the picture is missing'),
    say: L3("Rasmlar ba'zan chiqmay qoladi. Keling, eng ko'p uchraydigan ikkita xatoni ko'ramiz.", 'Картинки иногда не появляются. Посмотрим на две самые частые ошибки.', 'Sometimes pictures don’t show up. Let’s look at the two most common mistakes.'),
    sayNoSrc: L3("Birinchisi: src atributi unutildi. Brauzer qaysi faylni ko'rsatishni bilmaydi, shuning uchun rasm yo'q. Faqat alt matni qoldi.",
      'Первая: забыли атрибут src. Браузер не знает, какой файл показать, поэтому картинки нет. Остался только текст alt.',
      'The first: the src attribute was forgotten. The browser doesn’t know which file to show, so there’s no picture. Only the alt text is left.'),
    sayTypo: L3("Ikkinchisi: fayl nomida bitta harf tushib qoldi. mushuk.jpg o'rniga mushk.jpg yozildi. Brauzer aynan yozilgan faylni qidiradi va harfma-harf solishtiradi. Bunday fayl yo'q, shuning uchun buzilgan rasm belgisi chiqdi.",
      'Вторая: в имени файла пропала буква. Вместо mushuk.jpg написано mushk.jpg. Браузер ищет ровно тот файл, что написан, буква в букву. Такого файла нет, поэтому появился значок сломанной картинки.',
      'The second: one letter is missing from the file name. It says mushk.jpg instead of mushuk.jpg. The browser looks for exactly the file that’s written, letter by letter. There’s no such file, so a broken picture icon shows up.'),
    done: L3("Demak, rasmga doim src kerak bo'ladi, fayl nomini esa aniq yozish kerak.", 'Значит, картинке всегда нужен src, а имя файла надо писать точно.', 'So a picture always needs src, and the file name must be written exactly.'),
    alt: L3('Qizil mushuk', 'Рыжий кот', 'A ginger cat'),
    askNoSrc: L3("Qarang: src yo'q", 'Смотри: нет src', 'Watch: no src'),
    askTypo: L3('Qarang: fayl nomida xato', 'Смотри: ошибка в имени файла', 'Watch: a typo in the file name'),
    askDone: L3('src kerak, fayl nomi aniq', 'Нужен src, имя файла — точное', 'src is needed, the file name exact')
  },
  s9: {
    eyebrow: L3('alt matnini yozing', 'Напиши alt', 'Write the alt text'),
    say: L3("Voy, to'p rasmining fayli saytga hali yuklanmagan ekan! Shuning uchun sahifada faqat buzilgan rasm belgisi turibdi. Hech kim bu yerda nima bo'lishi kerakligini bilmaydi. alt qo'shtirnog'i ichiga rasmda nima borligini so'z bilan yozing va «Tekshirish»ni bosing.",
      'Ой, файл с фото мяча ещё не загружен на сайт! Поэтому на странице только значок сломанной картинки. Никто не знает, что здесь должно быть. Напиши в кавычки alt словами, что на картинке, и нажми «Проверить».',
      'Oops, the ball photo file isn’t on the site yet! So the page only shows a broken picture icon. Nobody knows what should be here. Type in the alt quotes what’s in the picture, in words, and tap “Check”.'),
    msgs: {
      empty: L3("alt qo'shtirnog'i ichiga rasmda nima borligini yozing.", 'Напиши в кавычки alt, что на картинке.', 'Type what’s in the picture in the alt quotes.'),
      tags: L3("Bu yerga teg kerak emas, faqat so'z yozing.", 'Здесь не нужен тег, только слова.', 'No tag here, just words.'),
      file: L3("Bu fayl nomi bo'ladi. alt ichiga esa rasmda nima borligini so'z bilan yozing.", 'Это имя файла. А в alt словами пишут, что на картинке.', 'That’s a file name. In alt you describe in words what’s in the picture.'),
      short: L3("Juda qisqa. Rasmda nima borligini bitta-ikkita so'z bilan yozing.", 'Слишком коротко. Напиши одно-два слова о том, что на картинке.', 'Too short. Write a word or two about what’s in the picture.')
    },
    hints: [
      L3('Rasmda nima bo\'lishi kerak edi?', 'Что должно быть на картинке?', 'What should the picture show?'),
      L3("Bu o'yinlar sahifasi va rasm fayli koptok.jpg. Rasmda nima bor?", 'Это страница игр, а файл — koptok.jpg. Что на картинке?', 'This is the games page, and the file is koptok.jpg. What’s in the picture?'),
      L3("Masalan, Futbol to'pi deb yozing.", 'Например, напиши: Футбольный мяч.', 'For example, write: A football.')
    ],
    ok: L3("Zo'r! Endi rasm ochilmasa ham, uning o'rnida sizning so'zlaringiz turibdi. Hamma bu yerda nima borligini biladi.", 'Огонь! Даже если фото не открылось, на его месте стоят твои слова. Все знают, что здесь было.', 'Awesome! Even if the photo doesn’t open, your words stand in its place. Everyone knows what’s here.'),
    ask: L3("alt ichiga rasmda nima borligini yozing", 'Напиши в alt, что на картинке', 'Type in alt what’s in the picture'),
    sample: L3("Futbol to'pi", 'Футбольный мяч', 'A football')
  },
  s10: {
    eyebrow: L3('Oldin va keyin', 'До и после', 'Before and after'),
    say: L3("Endi ikkita holatga qarang: oldin va keyin. Kodda bitta narsa o'zgardi va rasm boshqacha bo'lib qoldi. Xo'sh, nima o'zgardi?",
      'Теперь посмотри на два состояния: до и после. В коде изменилась одна вещь, и картинка стала другой. Ну и что изменилось?',
      'Now look at two states: before and after. One thing changed in the code, and the picture changed. So what changed?'),
    askQ: L3("Kodda nima o'zgardi?", 'Что изменилось в коде?', 'What changed in the code?'),
    ok: {
      src: L3("To'g'ri! src qo'shildi, rasm paydo bo'ldi.", 'Верно! Добавили src — картинка появилась.', 'Right! src was added, so the picture appeared.'),
      val: L3("To'g'ri! Fayl nomi to'g'rilandi, rasm ochildi.", 'Верно! Исправили имя файла — фото открылось.', 'Right! The file name was fixed, so the photo opened.'),
      alt: L3("To'g'ri! alt qo'shildi, belgi yonida so'zlar chiqdi.", 'Верно! Добавили alt — рядом со значком появились слова.', 'Right! alt was added, so words appeared next to the icon.')
    },
    miss: {
      src: L3("Qarang: oldin sahifada umuman hech narsa yo'q edi, keyin rasm chiqdi. Buzilgan belgi ham yo'q edi. Demak, src qo'shildi.", 'Смотри: сначала на странице не было вообще ничего, потом появилась картинка. Даже значка не было. Значит, добавили src.', 'Look: at first there was nothing on the page at all, then the picture appeared. There wasn’t even an icon. So src was added.'),
      val: L3("Qarang: oldin buzilgan rasm belgisi bor edi, keyin rasm ochildi. Demak, fayl nomi to'g'rilandi.", 'Смотри: сначала был значок сломанной картинки, потом фото открылось. Значит, исправили имя файла.', 'Look: first there was a broken picture icon, then the photo opened. So the file name was fixed.'),
      alt: L3("Qarang: rasm ikkalasida ham ochilmadi, lekin keyin belgi yonida so'zlar chiqdi. Bu so'zlarni alt beradi.", 'Смотри: фото не открылось ни там, ни там, но после рядом со значком появились слова. Эти слова даёт alt.', 'Look: the photo didn’t open in either, but after, words appeared next to the icon. alt gives those words.')
    },
    done: L3("Endi rasm nimaga chiqmasligini bilasiz. Keyin butun sahifani birga o'qib chiqamiz.", 'Теперь ты знаешь, почему картинка не появляется. Дальше прочитаем всю страницу вместе.', 'Now you know why a picture doesn’t show up. Next, let’s read the whole page together.'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After'),
    // Ступени подсказки (лампочка): 1 — куда смотреть, 2 — по виду раунда, 3 — причина и какой ответ выбрать.
    hint1: L3("Oldingi va keyingi rasmni solishtiring: sahifada nima o'zgardi?", 'Сравни картинку «до» и «после»: что изменилось на странице?', 'Compare the picture before and after: what changed on the page?'),
    hint2: {
      src: L3("Oldin sahifada umuman hech narsa yo'q edimi, hatto belgi ham? Brauzerga qaysi faylni ko'rsatishni qaysi atribut aytadi, esingizdami?", 'Сначала на странице не было вообще ничего, даже значка? Вспомни, какой атрибут говорит браузеру, какой файл показать.', 'Was there nothing on the page at first, not even an icon? Remember which attribute tells the browser which file to show.'),
      val: L3("Oldin buzilgan rasm belgisi bormidi? Demak, src bor edi, lekin brauzer faylni topa olmadi. Kodda nima tuzatilgan bo'lishi mumkin?", 'Сначала был значок сломанной картинки? Значит, src был, но браузер не нашёл файл. Что могли исправить в коде?', 'Was there a broken picture icon at first? Then src was there, but the browser couldn’t find the file. What could have been fixed in the code?'),
      alt: L3("Rasm ikkalasida ham ochilmadimi? Unda belgi yonidagi so'zlarga qarang: ularni qaysi atribut beradi?", 'Фото не открылось ни там, ни там? Тогда посмотри на слова рядом со значком: какой атрибут их даёт?', 'Did the photo fail to open in both? Then look at the words next to the icon: which attribute gives them?')
    },
    // Как назвать кнопку в третьей ступени — словами, без кавычек и знаков (подсказка звучит).
    pick: { src: L3('src', 'src', 'src'), val: L3('jpg', 'jpg', 'jpg'), alt: L3('alt', 'alt', 'alt') }
  },
  s11: {
    eyebrow: L3('Butun sahifa', 'Страница целиком', 'The whole page'),
    say: L3("Mana, osh retsepti sahifasi tayyor. Keling, brauzer uni qanday o'qishini ko'ramiz. Brauzer kodni har doimgidek tepadan pastga o'qiydi.", 'Вот страница с рецептом плова готова. Посмотрим, как браузер её читает. Как всегда, сверху вниз.', 'Here’s the plov recipe page, all done. Let’s see how the browser reads it: as always, from top to bottom.'),
    order1: L3("Birinchi qatorda sarlavha turibdi. U sahifaning eng tepasida chiqdi.", 'В первой строке — заголовок. Он появился на самом верху страницы.', 'The first line is the heading. It appeared at the very top of the page.'),
    order2: L3("Ikkinchi qatorda img tegi. Brauzer osh.jpg faylini topdi va rasmni aynan shu joyga qo'ydi.", 'Во второй строке — тег img. Браузер нашёл файл osh.jpg и поставил фото ровно сюда.', 'The second line is the img tag. The browser found the file osh.jpg and put the photo right here.'),
    order3: L3("Uchinchi qatorda yozuv. Demak, rasm kodda qayerda tursa, sahifada ham o'sha joyda chiqadi.", 'В третьей строке — текст. Значит, где картинка стоит в коде, там она и появится на странице.', 'The third line is the text. So wherever the picture is in the code, that’s where it shows up on the page.'),
    ask: L3("Brauzer qanday o'qishini kuzating", 'Смотри, как читает браузер', 'Watch how the browser reads'),
    askDone: L3('Rasm kodda turgan joyida chiqadi', 'Картинка встаёт там, где стоит в коде', 'The picture shows up where it is in the code')
  },
  // КАРТИНКА ИЗ ИНТЕРНЕТА (заказчик, 05.11.2026): w1 показ · w2 вписать полный адрес · w3 «откуда браузер возьмёт».
  w1: {
    eyebrow: L3('Internetdagi rasm', 'Картинка из интернета', 'A picture from the internet'),
    say: L3("O'tgan darsda havola https bilan internetdagi saytga olib borganini ko'rdik. Rasm ham xuddi shunday ishlaydi. Qarang, men sahifaga quyosh rasmini qo'ymoqchiman. Lekin fayllarimizda quyosh.jpg yo'q. Shuning uchun brauzer buzilgan rasm belgisini ko'rsatyapti.",
      'На прошлом уроке мы видели: ссылка с https ведёт на сайт в интернете. С картинками так же. Смотри, я хочу поставить на страницу картинку с солнцем. Но среди наших файлов нет quyosh.jpg. Поэтому браузер показывает значок сломанной картинки.',
      'Last lesson we saw a link with https take us to a site on the internet. Pictures work the same way. Look, I want to put a sun picture on the page. But there’s no quyosh.jpg among our files. That’s why the browser shows the broken picture icon.'),
    // Показ «как взять адрес картинки» (заказчик, 05.11.2026): курсор мыши сам проходит все шаги — вкладка сайта,
    // правая кнопка по картинке, «Скопировать адрес картинки», назад к коду, правая кнопка, «Вставить».
    sayWeb: L3("Bu rasm mening internetdagi saytimda turibdi. Uni olish uchun rasmning to'liq manzili kerak. Keling, manzilni qanday olishni ko'rsataman. Saytim brauzerning boshqa yorlig'ida ochiq.",
      'Эта картинка лежит на моём сайте в интернете. Чтобы её взять, нужен полный адрес картинки. Давай покажу, как его достать. Мой сайт открыт в другой вкладке браузера.',
      'This picture is on my site on the internet. To get it, we need the picture’s full address. Let me show you how to get it. My site is open in another browser tab.'),
    sayMenu: L3("Rasm ustiga sichqonchani olib boramiz va o'ng tugmasini bosamiz. Qarang, ro'yxat chiqdi.",
      'Наводим мышку на картинку и нажимаем правую кнопку. Смотри, появился список.',
      'We move the mouse over the picture and press the right button. Look, a menu appeared.'),
    sayCopy: L3("Ro'yxatdan «Copy image address»ni tanlaymiz. Endi rasmning to'liq manzili xotirada turibdi.",
      'В списке выбираем «Копировать URL картинки». Теперь полный адрес картинки в памяти.',
      'In the menu we choose “Copy image address”. Now the picture’s full address is in memory.'),
    sayBack: L3("Endi o'z sahifamiz yorlig'iga qaytamiz va kodga boramiz. Eski fayl nomini belgilaymiz.",
      'Теперь возвращаемся во вкладку своей страницы и идём к коду. Выделяем старое имя файла.',
      'Now we go back to our page’s tab and over to the code. We select the old file name.'),
    sayPaste: L3("Yana o'ng tugmani bosamiz. Bu safar ro'yxatdan «Paste»ni tanlaymiz.",
      'Снова нажимаем правую кнопку. В этот раз выбираем в списке «Вставить».',
      'We press the right button again. This time we choose “Paste” in the menu.'),
    sayPasted: L3("Mana! Manzil kodga tushdi, rasm esa sahifada paydo bo'ldi. Endi manzil qanday tuzilganini ko'raylik.",
      'Готово! Адрес попал в код, а картинка появилась на странице. Теперь посмотрим, из чего состоит адрес.',
      'There! The address went into the code, and the picture appeared on the page. Now let’s see what the address is made of.'),
    // На узбекском меню правой кнопки — английское, как в браузере у учеников (заказчик, 05.11.2026).
    menuImg: L3(['Open image in new tab', 'Save image as…', 'Copy image', 'Copy image address'],
      ['Открыть картинку в новой вкладке', 'Сохранить картинку как…', 'Копировать картинку', 'Копировать URL картинки'],
      ['Open image in new tab', 'Save image as…', 'Copy image', 'Copy image address']),
    menuEd: L3(['Cut', 'Copy', 'Paste'], ['Вырезать', 'Копировать', 'Вставить'], ['Cut', 'Copy', 'Paste']),
    webTitle: L3('Kodining rasmlari', 'Картинки Коди', 'Kodi’s pictures'),
    copied: L3('Nusxa olindi', 'Скопировано', 'Copied'),
    askTab: L3("Qarang: sayt boshqa yorliqda", 'Смотри: сайт в другой вкладке', 'Watch: the site is in another tab'),
    askMenu: L3("Qarang: o'ng tugma, ro'yxat", 'Смотри: правая кнопка — список', 'Watch: right button, a menu'),
    askCopy: L3("Qarang: manzildan nusxa olamiz", 'Смотри: копируем адрес', 'Watch: we copy the address'),
    askPaste: L3("Qarang: kodga qo'yamiz", 'Смотри: вставляем в код', 'Watch: we paste it into the code'),
    askPasted: L3("Qarang: rasm paydo bo'ldi", 'Смотри: картинка появилась', 'Watch: the picture appeared'),
    sayProto: L3("Manzil https bilan boshlanadi, keyin ikki nuqta va ikkita qiya chiziq keladi. Bu brauzerga internetga chiqishni aytadi.",
      'Адрес начинается с https, потом идут двоеточие и две косые черты. Это говорит браузеру: иди в интернет.',
      'The address starts with https, then a colon and two slashes. That tells the browser to go out to the internet.'),
    sayHost: L3("Keyin rasm turgan sayt nomi keladi: kodi.uz.", 'Дальше — имя сайта, где лежит картинка: kodi.uz.', 'Next comes the name of the site where the picture is: kodi.uz.'),
    sayFile: L3("Oxirida esa qiya chiziq va rasm fayli nomi turadi. Shuning uchun brauzer rasmni internetdan olib keldi.",
      'А в конце — косая черта и имя файла картинки. Поэтому браузер и принёс картинку из интернета.',
      'And at the end, a slash and the picture’s file name. That’s why the browser brought the picture from the internet.'),
    sayNoProto: L3("Endi boshidagi https qismini o'chirib ko'ramiz. Xo'sh, nima bo'larkin?", 'А теперь сотрём начало, https. Ну, что будет?', 'Now let’s erase the https part at the start. So what happens?'),
    sayNf: L3("Rasm yana buzildi! https bo'lmasa, brauzer kodi.uz degan papkani o'z saytimizdan qidiradi va uni topa olmaydi.",
      'Картинка снова сломалась! Без https браузер ищет папку kodi.uz на нашем сайте и не находит её.',
      'The picture broke again! Without https the browser looks for a folder called kodi.uz on our site and can’t find it.'),
    done: L3("Demak, o'z faylimiz uchun fayl nomi yetadi. Internetdagi rasm uchun esa to'liq manzil kerak: https, sayt nomi va rasm fayli.",
      'Значит, для своего файла хватит имени файла. А для картинки из интернета нужен полный адрес: https, имя сайта и файл картинки.',
      'So for our own file, the file name is enough. A picture from the internet needs the full address: https, the site name and the picture file.'),
    askStart: L3('Qarang: rasm buzildi', 'Смотри: картинка сломалась', 'Watch: the picture is broken'),
    askProto: L3("Qarang: boshida https, ya'ni internetga yo'l", 'Смотри: в начале https — путь в интернет', 'Watch: https at the start is the way to the internet'),
    askHost: L3('Qarang: sayt nomi', 'Смотри: имя сайта', 'Watch: the site name'),
    askFile: L3('Qarang: rasm fayli', 'Смотри: файл картинки', 'Watch: the picture file'),
    askNf: L3("Qarang: boshida https bo'lmasa", 'Смотри: без https в начале', 'Watch: without https at the start'),
    askDone: L3("Internetdagi rasmga to'liq manzil kerak", 'Картинке из интернета — полный адрес', 'A picture from the internet needs the full address')
  },
  w2: {
    eyebrow: L3('Rasm manzili', 'Адрес картинки', 'The picture’s address'),
    say: L3("Endi navbat sizga. Mening sevimli mevam olma, uning rasmi ham saytimda turibdi. Pastda sayt nomi va rasm fayli yozilgan. src ichiga rasmning to'liq manzilini yozing: https, sayt nomi, qiya chiziq va fayl nomi.",
      'Теперь твоя очередь. Мой любимый фрукт — яблоко, и его картинка тоже лежит на моём сайте. Внизу написаны имя сайта и файл картинки. Впиши в src полный адрес картинки: https, имя сайта, косая черта и имя файла.',
      'Now it’s your turn. My favourite fruit is the apple, and its picture is on my site too. The site name and the picture file are written below. Type the picture’s full address in src: https, the site name, a slash and the file name.'),
    msgs: {
      empty: L3("src ichiga rasmning to'liq manzilini yozing.", 'Впиши в src полный адрес картинки.', 'Type the picture’s full address in src.'),
      noProto: L3("Boshida https yo'q. Usiz brauzer rasmni o'z saytimizdan qidiradi va rasm buziladi. Manzilni https, ikki nuqta va ikkita qiya chiziq bilan boshlang.",
        'В начале нет https. Без него браузер ищет картинку на нашем сайте, и она ломается. Начни адрес с https, двоеточия и двух косых черт.',
        'There’s no https at the start. Without it the browser looks for the picture on our site, and it breaks. Start the address with https, a colon and two slashes.'),
      colon: L3("https so'zidan keyin ikki nuqta, keyin ikkita qiya chiziq turadi. Ularni tekshiring.", 'После https идут двоеточие и две косые черты. Проверь их.', 'After https come a colon and two slashes. Check them.'),
      slash: L3("Sayt nomi bilan fayl nomi o'rtasida qiya chiziq turadi.", 'Между именем сайта и именем файла стоит косая черта.', 'There’s a slash between the site name and the file name.'),
      typo: L3("Sayt nomi va fayl nomini pastdagidek, harfma-harf yozing.", 'Напиши имя сайта и имя файла буква в букву, как внизу.', 'Type the site name and the file name letter by letter, as shown below.')
    },
    hints: [
      L3('Bu rasm boshqa saytda turibdi. Unga qanday manzil kerak?', 'Эта картинка лежит на другом сайте. Какой адрес ей нужен?', 'This picture is on another site. What kind of address does it need?'),
      L3("To'liq manzil https bilan boshlanadi, keyin ikki nuqta va ikkita qiya chiziq. Keyin sayt nomi, qiya chiziq va fayl nomi keladi.", 'Полный адрес начинается с https, потом двоеточие и две косые черты. Дальше — имя сайта, косая черта и имя файла.', 'A full address starts with https, then a colon and two slashes. Then the site name, a slash and the file name.'),
      L3("https tugmasini bosing va kodi.uz deb yozing. Keyin qiya chiziq qo'ying va olma.jpg faylini yozing.", 'Нажми кнопку https и напиши kodi.uz. Потом поставь косую черту и напиши файл olma.jpg.', 'Tap the https button and type kodi.uz. Then add a slash and type the file olma.jpg.')
    ],
    ok: L3("Zo'r! Olma rasmi internetdan keldi.", 'Огонь! Картинка с яблоком пришла из интернета.', 'Awesome! The apple picture came from the internet.'),
    okHttp: L3("Ishladi! Lekin bugun saytlar ko'pincha https bilan yoziladi. Oxiridagi s harfi xavfsiz degani.", 'Работает! Но сегодня сайты обычно пишут с https: буква s значит «защищённый».', 'It works! But today sites usually use https: the s means secure.'),
    ask: L3("src ichiga rasmning to'liq manzilini yozing", 'Впиши в src полный адрес картинки', 'Type the picture’s full address in src')
  },
  w3: {
    eyebrow: L3('Rasm qayerdan?', 'Откуда картинка?', 'Where’s the picture from?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men src atributiga manzil yozaman. Siz esa brauzer rasmni qayerdan olishini tanlang: saytimiz fayllaridanmi yoki internetdanmi?",
      'Теперь проверь себя. Я пишу адрес в атрибут src, а ты выбери, откуда браузер возьмёт картинку: из файлов нашего сайта или из интернета?',
      'Now check yourself. I write an address in the src attribute, and you choose where the browser gets the picture: from our site’s files or from the internet?'),
    ask: L3('Brauzer rasmni qayerdan oladi?', 'Откуда браузер возьмёт картинку?', 'Where will the browser get the picture?'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило, 3 — причина и ответ.
    hint1: L3("src atributidagi manzilning eng boshiga qarang.", 'Посмотри на самое начало адреса в атрибуте src.', 'Look at the very start of the address in the src attribute.'),
    hint2: L3("Manzil https bilan boshlansa, brauzer rasmni internetdan oladi. Faqat fayl yoki sayt nomi bo'lsa, saytimiz fayllaridan qidiradi.",
      'Если адрес начинается с https, браузер берёт картинку из интернета. Если там только имя файла или сайта, он ищет среди файлов нашего сайта.',
      'If the address starts with https, the browser gets the picture from the internet. If it’s just a file or site name, it looks among our site’s files.'),
    site: L3('Saytimiz fayllaridan', 'Из файлов сайта', 'From our site’s files'),
    web: L3('Internetdan', 'Из интернета', 'From the internet'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { src: 'top.jpg', right: 'site',
        why: L3("Bu oddiy fayl nomi. top.jpg fayllarimizda bor, brauzer uni o'sha yerdan oladi.", 'Это просто имя файла. top.jpg есть среди наших файлов, браузер возьмёт его оттуда.', 'That’s just a file name. top.jpg is among our files, so the browser takes it from there.') },
      { src: 'https://kodi.uz/quyosh.jpg', right: 'web',
        why: L3("Manzil https bilan boshlanadi. Brauzer rasmni internetdagi saytdan olib keladi.", 'Адрес начинается с https. Браузер принесёт картинку с сайта в интернете.', 'The address starts with https. The browser brings the picture from a site on the internet.') },
      { src: 'kodi.uz/olma.jpg', right: 'site',
        why: L3("Aldanmang! Boshida https yo'q. Brauzer buni saytimizdagi papka deb o'ylaydi, uni topa olmaydi va rasm buziladi.", 'Не попадись! В начале нет https. Браузер думает, что это папка на нашем сайте, не находит её — и картинка ломается.', 'Don’t be fooled! There’s no https at the start. The browser thinks it’s a folder on our site, can’t find it, and the picture breaks.') },
      { src: 'https://kodi.uz/olma.jpg', right: 'web',
        why: L3("https bilan boshlangan manzil internetdagi saytga olib boradi. Brauzer olma rasmini o'sha yerdan oladi.", 'Адрес с https ведёт на сайт в интернете. Браузер возьмёт картинку с яблоком оттуда.', 'An address starting with https leads to a site on the internet. The browser takes the apple picture from there.') }
    ],
    ok: L3("Hammasi to'g'ri! Endi rasm qayerdan kelishini bilasiz.", 'Всё верно! Теперь ты знаешь, откуда берётся картинка.', 'All correct! Now you know where a picture comes from.')
  },
  // Своя картинка — два экрана: файл (по «Проверить»), потом текст alt (по «Готово»).
  s12: {
    eyebrow: L3('Rasmingizni tanlang', 'Выбери свою картинку', 'Pick your picture'),
    say: L3("Endi o'zingizning sahifangizga rasm qo'ying. Fayllar ro'yxatida uchta rasm bor. O'zingizga yoqqanini tanlang va uning nomini src qo'shtirnog'i ichiga yozing. Keyin «Tekshirish»ni bosing.",
      'Теперь поставь картинку на свою страницу. В списке файлов три картинки. Выбери ту, что нравится, и впиши её имя в кавычки src. Потом нажми «Проверить».',
      'Now put a picture on your own page. The list of files has three pictures. Pick the one you like and type its name in the src quotes. Then tap “Check”.'),
    msgs: {
      empty: L3("Qo'shtirnoq ichiga rasm fayli nomini yozing.", 'Впиши в кавычки имя файла картинки.', 'Type the picture file name in the quotes.'),
      noExt: L3("Rasm fayli nomi oxirida .jpg bo'ladi. Fayllar ro'yxatiga qarang.", 'Имя файла картинки заканчивается на .jpg. Посмотри в список файлов.', 'A picture file name ends with .jpg. Look at the list of files.'),
      other: L3("Bu rasm sizning fayllaringiz o'rtasida yo'q. Ro'yxatdagi uchta rasmdan birini tanlang.", 'Этой картинки нет среди твоих файлов. Выбери одну из трёх в списке.', 'That picture isn’t among your files. Pick one of the three in the list.'),
      typo: L3("Bunday fayl yo'q, shuning uchun buzilgan rasm belgisi chiqdi. Nomni ro'yxatdagidek, harfma-harf yozing.", 'Такого файла нет, поэтому появился значок сломанной картинки. Напиши имя буква в букву, как в списке.', 'There’s no such file, so a broken picture icon shows up. Type the name letter by letter, as in the list.')
    },
    hints: [
      L3("Qaysi rasm sizga ko'proq yoqadi?", 'Какая картинка тебе больше нравится?', 'Which picture do you like best?'),
      L3("Fayllar ro'yxatidan bitta nomni oling, masalan gul.jpg.", 'Возьми одно имя из списка файлов, например gul.jpg.', 'Take one name from the list of files, for example gul.jpg.'),
      L3("Masalan, mushuk.jpg deb yozing va «Tekshirish»ni bosing.", 'Например, напиши mushuk.jpg и нажми «Проверить».', 'For example, type mushuk.jpg and tap “Check”.')
    ],
    ok: L3("Zo'r tanlov! Rasmingiz sahifada chiqdi. Endi unga alt matnini yozamiz.", 'Классный выбор! Твоя картинка на странице. Теперь напишем ей alt.', 'Great choice! Your picture is on the page. Now let’s write its alt text.'),
    ask: L3("src ichiga rasm fayli nomini yozing", 'Впиши в src имя файла картинки', 'Type the picture file name in src')
  },
  s13: {
    eyebrow: L3('Rasmingiz alt matni', 'alt своей картинки', 'Your picture’s alt'),
    say: L3("Endi rasmingizga alt matnini yozing: rasmda nima borligini o'z so'zlaringiz bilan ayting. Rasm ochilgani uchun alt sahifada ko'rinmaydi. Lekin ovoz bilan o'qiydigan dastur uni aynan shunday o'qiydi: pastda ko'rib turibsiz. Keyin «Tayyor»ni bosing.",
      'Теперь напиши своей картинке alt: своими словами скажи, что на ней. Фото открылось, поэтому alt на странице не видно. Но программа, которая читает вслух, прочтёт его именно так — смотри ниже. Потом нажми «Готово».',
      'Now write your picture’s alt text: say in your own words what’s in it. The photo opened, so alt isn’t visible on the page. But a program that reads aloud will read it exactly like this: see below. Then tap “Done”.'),
    ok: L3("Ajoyib! Endi rasmingiz ochilsa ham, ochilmasa ham, unda nima borligi tushunarli.", 'Отлично! Теперь откроется фото или нет — понятно, что на нём.', 'Great! Now whether the photo opens or not, it’s clear what’s in it.'),
    hints: [
      L3('Rasmingizda nima bor? Shuni yozing.', 'Что на твоей картинке? Это и напиши.', 'What’s in your picture? Write that.'),
      L3("Faqat so'z yozing, qo'shtirnoq joyida turibdi.", 'Пиши только слова — кавычки на месте.', 'Type only words: the quotes are in place.'),
      L3("Masalan: Mening mushugim. Keyin «Tayyor»ni bosing.", 'Например: Мой кот. Потом нажми «Готово».', 'For example: My cat. Then tap “Done”.')
    ],
    ask: L3("alt matnini yozing va «Tayyor»ni bosing", 'Напиши alt и нажми «Готово»', 'Type the alt text and tap “Done”'),
    ph: L3('Masalan: Mening mushugim', 'Например: Мой кот', 'For example: My cat'),
    reader: L3("Dastur o'qiydi", 'Программа прочтёт', 'A reader says')
  },
  s14: {
    eyebrow: L3("Rasm yo'qoldi", 'Пропала картинка', 'The picture is gone'),
    say: L3("Voy, men sahifangizni tahrirlayotib bitta so'zni o'chirib yubordim! Endi rasm o'rnida faqat alt matni turibdi. Kodda img tegidan keyin bo'sh joy bor. Yetishmayotgan so'zni o'sha joyga olib boring.",
      'Ой, я правил твою страницу и стёр одно слово! Теперь вместо картинки только текст alt. В коде после img пустое место. Перетащи туда недостающее слово.',
      'Oops, I was editing your page and deleted one word! Now only the alt text is where the picture was. In the code there’s an empty spot after img. Drag the missing word into it.'),
    why: {
      href: L3("href havola manzilini beradi. Rasm faylini esa boshqa atribut aytadi.", 'href задаёт адрес ссылки. А файл картинки задаёт другой атрибут.', 'href gives a link’s address. A picture file is given by another attribute.'),
      alt: L3("alt kodda bor, u keyinroq turibdi. Bu yerda rasm faylini aytadigan atribut kerak.", 'alt в коде уже есть, он дальше. Здесь нужен атрибут, который задаёт файл картинки.', 'alt is already in the code, further along. Here you need the attribute that gives the picture file.')
    },
    ok: L3("Ana endi joyida! src qaytdi va rasmingiz yana chiqdi.", 'Вот теперь порядок! src вернулся, и твоя картинка снова на месте.', 'That’s it! src is back, and your picture shows up again.'),
    ask: L3("Yetishmayotgan so'zni bo'sh joyga olib boring", 'Перетащи недостающее слово в пустое место', 'Drag the missing word into the empty spot'),
    // Ступени подсказки: 1 — куда смотреть, 2 — правило, 3 — какой кусок взять (он загорается).
    hints: [
      L3("Brauzerga qarang: rasm o'rnida faqat alt matni qoldi. Brauzerga nima yetishmayapti?", 'Посмотри на браузер: вместо картинки остался только текст alt. Чего не хватает браузеру?', 'Look at the browser: only the alt text is left where the picture was. What is the browser missing?'),
      L3("Bo'sh joydan keyin fayl nomi turibdi. Brauzerga rasm faylini qaysi atribut aytadi, esingizdami?", 'После пустого места стоит имя файла. Вспомни, какой атрибут сообщает браузеру файл картинки.', 'The file name comes after the empty spot. Remember which attribute tells the browser the picture file.'),
      L3("Bo'laklardan src so'zini oling va bo'sh joyga olib boring.", 'Возьми кусок src и перетащи его в пустое место.', 'Take the src piece and drag it into the empty spot.')
    ]
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Mana, galereya, lekin unda xato bor. Brauzerga qarang: qaysi rasm chiqmadi? Xato qaysi qatorda ekanini toping va o'sha qatorni bosing.",
      'Теперь проверь себя. Вот галерея, но в ней ошибка. Посмотри на браузер: какая картинка не появилась? Найди строку с ошибкой и нажми её.',
      'Now check yourself. Here’s the gallery, but it has a bug. Look at the browser: which picture didn’t show up? Find the line with the bug and tap it.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi boshqa rasm chiqmadi: uning o'rnida faqat so'zlar turibdi. Bu yerda nima buzilgan?", 'Класс, первая ошибка найдена! Теперь не появилась другая картинка: на её месте только слова. Что сломано здесь?', 'Great, the first bug is found! Now a different picture didn’t show: only words are in its place. What’s broken here?'),
    ask: L3('Xato bor qatorni bosing', 'Нажми строку с ошибкой', 'Tap the line with the bug'),
    fine: L3("Bu qator to'g'ri yozilgan: src ham, fayl nomi ham joyida. Brauzerga qarang: qaysi rasm chiqmadi?", 'Эта строка в порядке: есть и src, и имя файла. Посмотри на браузер: какая картинка не появилась?', 'This line is fine: it has src and the file name. Look at the browser: which picture didn’t show?'),
    found: {
      typo: L3("Topdingiz! Fayl nomida bitta harf yetishmayotgan edi. Shuning uchun brauzer faylni topa olmagan edi.", 'Есть! В имени файла не хватало буквы. Поэтому браузер не нашёл файл.', 'Found it! The file name was missing a letter. That’s why the browser couldn’t find the file.'),
      href: L3("Topdingiz! Bu yerda src o'rniga href yozilgan edi. href rasm uchun emas, shuning uchun faqat alt matni qolgan edi.", 'Есть! Здесь вместо src был написан href. href не для картинок, поэтому оставался только текст alt.', 'Found it! Here href was written instead of src. href isn’t for pictures, so only the alt text was left.')
    },
    hints: {
      typo: [
        L3("Brauzerga qarang: qaysi rasm o'rnida buzilgan belgi turibdi?", 'Посмотри на браузер: где вместо картинки значок?', 'Look at the browser: where is there an icon instead of a picture?'),
        L3("Buzilgan belgi fayl topilmaganda chiqadi. Fayl nomlarini solishtiring.", 'Значок появляется, когда файл не нашёлся. Сравни имена файлов.', 'The icon appears when the file isn’t found. Compare the file names.'),
        L3("Ikkinchi qatorga qarang: fayl nomi to'liqmi?", 'Посмотри на вторую строку: имя файла полное?', 'Look at the second line: is the file name complete?')
      ],
      href: [
        L3("Brauzerga qarang: qaysi rasm o'rnida faqat so'zlar turibdi?", 'Посмотри на браузер: где вместо картинки только слова?', 'Look at the browser: where are there only words instead of a picture?'),
        L3("Belgisiz faqat so'zlar chiqsa, brauzer faylni umuman bilmaydi. Atribut nomlariga qarang.", 'Если видны только слова без значка, браузер вообще не знает файла. Посмотри на имена атрибутов.', 'If there are only words with no icon, the browser doesn’t know the file at all. Look at the attribute names.'),
        L3("Qaysi qatorda src o'rniga boshqa atribut turibdi?", 'В какой строке вместо src другой атрибут?', 'Which line has a different attribute instead of src?')
      ]
    },
    alts: L3(['Osh', 'Mushuk', "To'p"], ['Плов', 'Кот', 'Мяч'], ['Plov', 'Cat', 'Ball']),
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz rasmlarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь картинки как настоящий программист.', 'Super! Both bugs are found. You check pictures like a real programmer.')
  },
  q2: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки: 1 — как читать фразу, 2 — правило урока, 3 — причина и ответ (choiceHints).
    hint1: L3("Gapni bo'laklab o'qing: u qaysi teg yoki atribut haqida?", 'Прочитай фразу по частям: о каком теге или атрибуте она?', 'Read the sentence piece by piece: which tag or attribute is it about?'),
    hint2: L3("img tegi esingizdami? src rasm faylini aytadi, alt esa rasm ochilmasa chiqadigan so'zlarni beradi. Yopuvchi tegi yo'q. Boshqa saytdagi rasmga https bilan boshlangan manzil kerak. Gap shunga mos keladimi?",
      'Вспомни тег img: src задаёт файл картинки, а alt даёт слова, если фото не открылось. Закрывающего тега у него нет. Картинке с другого сайта нужен адрес с https. Фраза с этим совпадает?',
      'Remember the img tag: src gives the picture file, and alt gives words if the photo doesn’t open. It has no closing tag. A picture from another site needs an address starting with https. Does the sentence match that?'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { t: L3('img tegi yopuvchi teg bilan yoziladi.', 'Тег img пишут с закрывающим тегом.', 'The img tag is written with a closing tag.'), right: false, code: 'void',
        why: L3("Aslida img tegining yopuvchi tegi bo'lmaydi. Rasm ichiga matn yozilmaydi.", 'На самом деле у img нет закрывающего тега. Внутрь картинки текст не пишут.', 'Actually img has no closing tag. You don’t write text inside a picture.') },
      { t: L3("Rasm ochilmasa, uning o'rnida alt matni ko'rinadi.", 'Если фото не открылось, на его месте виден текст alt.', 'If the photo doesn’t open, the alt text shows in its place.'), right: true, code: 'alt',
        why: L3("Shuning uchun alt kerak: rasm ochilmasa ham, unda nima borligi tushunarli bo'ladi.", 'Для этого и нужен alt: даже без фото понятно, что на нём.', 'That’s what alt is for: even without the photo, it’s clear what’s in it.') },
      { t: L3('Rasm faylini href atributi aytadi.', 'Файл картинки задаёт атрибут href.', 'The href attribute gives the picture file.'), right: false, code: 'href',
        why: L3("href havola uchun bo'ladi. Rasm faylini src atributi aytadi.", 'href — для ссылок. Файл картинки задаёт атрибут src.', 'href is for links. The src attribute gives the picture file.') },
      { t: L3("Boshqa saytdagi rasm uchun src atributiga sayt nomi va fayl nomini yozish yetadi, https shart emas.", 'Для картинки с другого сайта в src хватит имени сайта и файла, https не нужен.', 'For a picture from another site, the site name and file name in src are enough; https isn’t needed.'), right: false, code: 'host',
        why: L3("Aslida https kerak. Usiz brauzer rasmni o'z saytimizdan qidiradi va rasm buziladi.", 'На самом деле https нужен. Без него браузер ищет картинку на нашем сайте, и она ломается.', 'Actually https is needed. Without it the browser looks for the picture on our site, and it breaks.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz img tegini, src va alt atributlarini yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь тег img и атрибуты src и alt.', 'All correct! You know the img tag and the src and alt attributes really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men rasmga href bilan osh.jpg faylini yozgan edim? Afsuski, men adashibman. href havola uchun bo'ladi, img tegi esa uni tushunmaydi. Shuning uchun sahifada hech narsa chiqmadi. Demak, rasmga doim src kerak bo'ladi.",
        'Вернёмся к загадке. Помнишь, я написал картинке файл osh.jpg через href? Увы, я ошибся. href — для ссылок, а тег img его не понимает. Поэтому на странице ничего не появилось. Значит, картинке всегда нужен src.',
        'Back to our riddle. Remember, I gave the picture the file osh.jpg with href? Sadly, I was wrong. href is for links, and the img tag doesn’t understand it. That’s why nothing showed up on the page. So a picture always needs src.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning sahifangiz va sizning rasmingiz!", 'Смотри, это твоя страница и твоя картинка!', 'Look, this is your page and your picture!'), k: null },
      { text: L3("img tegi sahifaga rasm qo'yadi.", 'Тег img ставит картинку на страницу.', 'The img tag puts a picture on the page.'), k: 'img' },
      { text: L3("src atributi qaysi faylni ko'rsatishni aytadi.", 'Атрибут src говорит, какой файл показать.', 'The src attribute says which file to show.'), k: 'src' },
      { text: L3("alt atributi esa rasmni so'z bilan tasvirlaydi.", 'А атрибут alt описывает картинку словами.', 'And the alt attribute describes the picture in words.'), k: 'alt' },
      { text: L3("Rasm boshqa saytda tursa, src ichiga https bilan boshlanadigan to'liq manzil yoziladi.", 'А если картинка на другом сайте, в src пишут полный адрес, который начинается с https.', 'And if the picture is on another site, src holds a full address starting with https.'), k: 'web' },
      { text: L3("Tabriklayman! Endi sahifalaringiz rasmlar bilan jonlandi. Keyingi darsda formalar bilan tanishamiz: sahifaga o'zingiz yozadigan maydonlar qo'yamiz. Ko'rishguncha!", 'Ура! Теперь твои страницы ожили с картинками. На следующем уроке познакомимся с формами: поставим на страницу поля, в которые можно писать. До встречи!', 'Hooray! Now your pages have come alive with pictures. Next time we’ll meet forms: we’ll put fields on the page that you can type into. See you!'), k: null }
    ],
    roles: {
      img: L3("img — rasm", 'img — картинка', 'img — picture'),
      src: L3('src — fayl', 'src — файл', 'src — file'),
      alt: L3("alt — rasm haqida so'z", 'alt — слова о картинке', 'alt — words about it'),
      web: L3('https bilan — internetdan', 'с https — из интернета', 'with https — from the internet')
    },
    ask: L3('Rasmingizga qarang', 'Посмотри на свою картинку', 'Look at your picture')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayImg: 1, sayRest: 1, sayBroken: 1, sayNoAlt: 1, sayVoid: 1,
  sayNoSrc: 1, sayTypo: 1, sayWeb: 1, sayMenu: 1, sayCopy: 1, sayBack: 1, sayPaste: 1, sayPasted: 1, sayProto: 1, sayHost: 1, sayFile: 1, sayNoProto: 1, sayNf: 1, okHttp: 1, askQ: 1, rounds: 1, miss: 1, order1: 1, order2: 1, order3: 1, say2: 1, fine: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:z5-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:z5.css@*/
`;
