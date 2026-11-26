// =============================================================================
// КУРС «JAVASCRIPT» · Урок 2 — «Переменные» (26.11.2026, заказчик: «делаем следующий урок js»).
// Облик «Редактор», как урок 1. Дети 11–14, проходят сами. Страницы в браузере нет (до DOM) — своя картинка: «Память».
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/js2/build.mjs → lessons/javascript/02-peremennye.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Переменные» · модуль js-m1 =====
//
// ЗАМЫСЕЛ. Коди делает игру «Kodi Run»: игре надо помнить монеты, жизни, уровень. Переменная — коробка в «Памяти»:
// let открывает коробку, имя — ярлык, знак равно кладёт значение; новое значение вытесняет старое; у const — замок.
// Загадка: Коди уверен, что console.log("coins") покажет число из коробки coins; разгадка — в кавычках просто текст.
// Дуга (18): крючок → показ «коробка» → собери строку → что в консоли → своя переменная → показ «изменение» →
// новый уровень → что будет в коробке → показ const → let или const → исправь const → показ «ошибки» → найди строку →
// кавычки или имя → строка целиком → карточка героя → верно или нет → вывод.
// Честный JavaScript: j2-engine.jsx выполняет let, const, присваивание и выдаёт ошибки как Chrome.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'js-02-peremennye',
  module: 'js-m1',
  lessonTitle: {
    uz: "2-dars. O'zgaruvchilar",
    ru: 'Урок 2. Переменные',
    en: 'Lesson 2. Variables'
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
  run: L3('Ishga tushirish', 'Запустить', 'Run'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  coin: L3('Tanga olish', 'Взять монету', 'Grab a coin'),
  yes: L3("To'g'ri", 'Верно', 'True'),
  no: L3("Noto'g'ri", 'Неверно', 'False'),
  err: L3('Xato', 'Ошибка', 'Error'),
  mem: L3('Xotira', 'Память', 'Memory'),
  memEmpty: L3("Hozircha quti yo'q", 'Пока нет ни одной коробки', 'No boxes yet'),
  conEmpty: L3("Konsol hozircha bo'sh", 'Консоль пока пуста', 'The console is empty for now'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3("Ma'lumot turlari", 'Типы данных', 'Data types'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  undo: L3('Orqaga', 'Назад', 'Back')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, msgs, hints, help, why, right, wrong, piece …; печатаются: eyebrow, ask, q, code, opts.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Kodi o'yini", 'Игра Коди', 'Kodi’s game'),
    say: L3("Salom! Men o'yin yasayapman: «Kodi Run». Qahramon yuguradi va tanga yig'adi. O'yin nechta tanga yig'ilganini eslab qolishi kerak. Tanga tugmasini bosing!",
      'Привет! Я делаю игру «Kodi Run». Герой бежит и собирает монеты. Игра должна помнить, сколько монет собрано. Нажми на монету!',
      'Hi! I’m making a game: “Kodi Run”. The hero runs and collects coins. The game has to remember how many coins were collected. Tap the coin!'),
    more: L3("Yana bosing. Kodga va xotiraga qarang.", 'Нажми ещё. Смотри на код и на память.', 'Tap again. Watch the code and the memory.'),
    works: L3("Ko'rdingizmi? coins qutisi har safar kattalashdi: bir, ikki, uch. JavaScript sonni eslab qoldi. Bunday quti o'zgaruvchi deyiladi.",
      'Видишь? Коробка coins каждый раз росла: один, два, три. JavaScript запомнил число. Такая коробка называется переменной.',
      'See? The coins box grew each time: one, two, three. JavaScript remembered the number. A box like this is called a variable.'),
    riddle: L3("Bugun o'zgaruvchilar bilan ishlaymiz. Lekin oldin topishmoq. coins qutisida uch bor. Men console.log ichiga qo'shtirnoq bilan coins deb yozsam, konsolda uch chiqadi, deb o'ylayman. Men haqmanmi? Dars oxirida bilamiz.",
      'Сегодня работаем с переменными. Но сначала загадка. В коробке coins лежит три. Я думаю, если написать в console.log слово coins в кавычках, в консоли выйдет три. Прав ли я? Узнаем в конце урока.',
      'Today we work with variables. But first, a riddle. The coins box holds three. I think if I write coins in quotes inside console.log, the console will show three. Am I right? We’ll find out at the end of the lesson.'),
    ask: L3("Tangani bosing", 'Нажми на монету', 'Tap the coin'),
    askMore: L3("Yana bosing", 'Нажми ещё', 'Tap again'),
    askDone: L3('Topishmoq: console.log("coins") nima chiqaradi?', 'Загадка: что выведет console.log("coins")?', 'Riddle: what will console.log("coins") show?')
  },
  s2: {
    eyebrow: L3("O'zgaruvchi — quti", 'Переменная — коробка', 'A variable is a box'),
    say: L3("O'zgaruvchi qanday yasaladi? Bitta qatorni qismlarga bo'lib ko'ramiz. Kuzating.",
      'Как делают переменную? Разберём одну строку по частям. Смотри.',
      'How is a variable made? Let’s take one line apart. Watch.'),
    steps: [
      L3("let so'zi JavaScript'ga aytadi: xotirada yangi quti och.", 'Слово let говорит JavaScript: открой в памяти новую коробку.', 'The word let tells JavaScript: open a new box in memory.'),
      L3("hero bu qutining nomi, ya'ni yorlig'i degani. Keyin qutini shu nom bilan topamiz.", 'hero — имя коробки, её ярлык. Потом мы найдём коробку по этому имени.', 'hero is the box’s name, its label. Later we find the box by this name.'),
      L3("Teng belgisi bu yerda «teng» degani emas. U «qutiga sol» degani. Qo'shtirnoqdagi Kodi qutiga tushadi.", 'Знак равно здесь не значит «равно». Он значит «положи в коробку». Kodi в кавычках падает в коробку.', 'The equals sign here doesn’t mean “equals”. It means “put into the box”. Kodi in quotes drops into the box.'),
      L3("Endi console.log ichida qutining nomini qo'shtirnoqsiz yozamiz. JavaScript qutini topadi va ichidagi qiymatni konsolga chiqaradi: Kodi.", 'Теперь пишем в console.log имя коробки без кавычек. JavaScript находит коробку и выводит в консоль то, что внутри: Kodi.', 'Now we write the box’s name in console.log without quotes. JavaScript finds the box and shows what’s inside in the console: Kodi.')
    ],
    help: [
      L3("Qatorning qismlariga qarang: let, nom, teng belgisi, qiymat.", 'Смотри на части строки: let, имя, знак равно, значение.', 'Look at the parts of the line: let, name, equals sign, value.'),
      L3("let qutini ochadi, nom unga yorliq beradi, teng belgisi qiymatni qutiga soladi.", 'let открывает коробку, имя даёт ей ярлык, знак равно кладёт значение в коробку.', 'let opens the box, the name labels it, the equals sign puts the value in.'),
      L3("Xuddi maktabdagi shkafcha kabi: eshigida ismingiz, ichida narsangiz. Ismga qarab ochasiz.", 'Как шкафчик в школе: на дверце имя, внутри вещи. Открываешь по имени.', 'Like a school locker: your name on the door, your things inside. You open it by the name.')
    ],
    ask: L3("O'zgaruvchi qanday yasalishini kuzating", 'Смотри, как делают переменную', 'Watch how a variable is made'),
    askDone: L3("let — quti, nom — yorliq, teng belgisi — qutiga sol", 'let — коробка, имя — ярлык, знак равно — «положи»', 'let is the box, the name is the label, equals means “put in”')
  },
  s3: {
    eyebrow: L3("Qatorni yig'ing", 'Собери строку', 'Build the line'),
    say: L3("Endi siz. score nomli quti oching va unga nol soling. Bo'laklarni to'g'ri tartibda bosing.",
      'Теперь ты. Открой коробку с именем score и положи в неё ноль. Нажимай кусочки по порядку.',
      'Now you. Open a box named score and put zero in it. Tap the pieces in the right order.'),
    ask: L3("score qutisini oching va unga 0 soling", 'Открой коробку score и положи в неё 0', 'Open the score box and put 0 in it'),
    piece: [
      L3("Oldin let: u JavaScript'ga yangi quti ochishni aytadi.", 'Сначала let: он говорит JavaScript открыть новую коробку.', 'First let: it tells JavaScript to open a new box.'),
      L3("let dan keyin qutining nomi keladi.", 'После let идёт имя коробки.', 'After let comes the box’s name.'),
      L3("Nomdan keyin teng belgisi: u qiymatni qutiga soladi.", 'После имени — знак равно: он кладёт значение в коробку.', 'After the name comes the equals sign: it puts the value in the box.'),
      L3("Endi qutiga solinadigan qiymat.", 'Теперь значение, которое кладём в коробку.', 'Now the value that goes into the box.'),
      L3("Oxirida nuqtali vergul: buyruq tugadi.", 'В конце точка с запятой: команда закончилась.', 'At the end, a semicolon: the command is over.')
    ],
    hints: [
      L3("Qator har doim let bilan boshlanadi.", 'Строка всегда начинается с let.', 'The line always starts with let.'),
      L3("Tartib: let, nom, teng belgisi, qiymat, nuqtali vergul.", 'Порядок: let, имя, знак равно, значение, точка с запятой.', 'The order: let, name, equals sign, value, semicolon.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("Zo'r! Xotirada score qutisi paydo bo'ldi, ichida nol. Konsol ham nolni ko'rsatdi.", 'Супер! В памяти появилась коробка score, в ней ноль. И консоль показала ноль.', 'Awesome! The score box appeared in memory with zero inside. And the console showed zero.')
  },
  s4: {
    eyebrow: L3('Konsolda nima?', 'Что в консоли?', 'What’s in the console?'),
    say: L3("Konsolda nima chiqishini taxmin qiling. Keyin kod ishlaydi, xotira va konsolda tekshiramiz.",
      'Угадай, что появится в консоли. Потом код сработает, и проверим по памяти и консоли.',
      'Guess what the console will show. Then the code runs and we check the memory and the console.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: L3(['let pet = "mushuk";', 'console.log(pet);'], ['let pet = "кот";', 'console.log(pet);'], ['let pet = "cat";', 'console.log(pet);']),
        opts: L3(['pet', 'mushuk', 'err'], ['pet', 'кот', 'err'], ['pet', 'cat', 'err']), a: 1,
        why: L3("pet qutining nomi. Konsolga uning ichidagi qiymat chiqadi.", 'pet — имя коробки. В консоль выходит то, что лежит внутри.', 'pet is the box’s name. The console shows what’s inside it.') },
      { code: L3(['let a = 2 + 3;', 'console.log(a);'], ['let a = 2 + 3;', 'console.log(a);'], ['let a = 2 + 3;', 'console.log(a);']),
        opts: L3(['2 + 3', 'a', '5'], ['2 + 3', 'a', '5'], ['2 + 3', 'a', '5']), a: 2,
        why: L3("JavaScript oldin misolni hisoblaydi, keyin javobni qutiga soladi: qutida besh.", 'JavaScript сначала считает пример, потом кладёт ответ в коробку: в ней пять.', 'JavaScript works out the sum first, then puts the answer in the box: it holds five.') },
      { code: L3(['let level = 4;', 'console.log(level * 2);'], ['let level = 4;', 'console.log(level * 2);'], ['let level = 4;', 'console.log(level * 2);']),
        opts: L3(['level * 2', '8', '4'], ['level * 2', '8', '4'], ['level * 2', '8', '4']), a: 1,
        why: L3("JavaScript qutidan to'rtni oladi va ikkiga ko'paytiradi: sakkiz.", 'JavaScript берёт из коробки четыре и умножает на два: восемь.', 'JavaScript takes four from the box and multiplies by two: eight.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Birinchi qatorga qarang: qutiga nima solinyapti?", 'Посмотри на первую строку: что кладут в коробку?', 'Look at the first line: what goes into the box?'),
    hint2: L3("Nom qo'shtirnoqsiz yozilgan bo'lsa, konsolga qutining ichidagi qiymat chiqadi.", 'Если имя написано без кавычек, в консоль выходит то, что лежит в коробке.', 'If the name is written without quotes, the console shows what’s in the box.'),
    ok: L3("Barakalla! Siz qutining nomi va uning ichidagi qiymatni ajratasiz.", 'Молодец! Ты различаешь имя коробки и то, что в ней лежит.', 'Well done! You can tell a box’s name from what’s inside it.')
  },
  s5: {
    eyebrow: L3('Sizning qahramoningiz', 'Твой герой', 'Your hero'),
    say: L3("O'yinga qahramon kerak. Qo'shtirnoq ichiga qahramonning ismini yozing va ishga tushiring. hero qutisiga nima tushishini kuzating.",
      'Игре нужен герой. Напиши в кавычках имя героя и запусти. Следи, что попадёт в коробку hero.',
      'The game needs a hero. Type the hero’s name inside the quotes and run. Watch what lands in the hero box.'),
    ask: L3("Qahramon ismini yozing va ishga tushiring", 'Напиши имя героя и запусти', 'Type the hero’s name and run'),
    msgs: {
      empty: L3("Qo'shtirnoq ichi bo'sh. Qahramonga ism bering.", 'В кавычках пусто. Дай герою имя.', 'The quotes are empty. Give the hero a name.'),
      quote: L3("Qo'shtirnoqlar allaqachon bor. Ichiga faqat ism yozing.", 'Кавычки уже есть. Внутри напиши только имя.', 'The quotes are already there. Just type a name inside.')
    },
    hints: [
      L3("Kulrang joyga bosing va ism yozing.", 'Нажми на серое место и напиши имя.', 'Tap the grey spot and type a name.'),
      L3("Istalgan ism bo'ladi: Robo, Bars yoki o'zingizniki.", 'Подойдёт любое имя: Robo, Bars или своё.', 'Any name works: Robo, Bars or your own.'),
      L3("Robo deb yozing va «Ishga tushirish» ni bosing.", 'Напиши Robo и нажми «Запустить».', 'Type Robo and tap “Run”.')
    ],
    ok: L3("Zo'r! Qahramon ismi hero qutisida. console.log uni nom bo'yicha topib, konsolga chiqardi.", 'Супер! Имя героя лежит в коробке hero. console.log нашёл его по имени и вывел в консоль.', 'Awesome! The hero’s name is in the hero box. console.log found it by name and showed it in the console.')
  },
  s6: {
    eyebrow: L3("Qiymat o'zgaradi", 'Значение меняется', 'The value changes'),
    say: L3("O'yinda hayotlar bor. Qahramon to'siqqa urilsa, bitta hayot kamayadi. Qutidagi qiymat qanday o'zgaradi? Kuzating.",
      'В игре есть жизни. Если герой врезается в преграду, жизней становится на одну меньше. Как меняется значение в коробке? Смотри.',
      'The game has lives. When the hero hits an obstacle, one life is lost. How does the value in the box change? Watch.'),
    steps: [
      L3("Hayotlar qutisi ochildi, uning nomi lives. Ichida uch. Konsol uchni ko'rsatdi.", 'Открылась коробка lives — жизни, в ней три. Консоль показала три.', 'The lives box opened with three inside. The console showed three.'),
      L3("Qahramon urildi. lives teng belgisi ikki: eski qiymat chiqib ketdi, ikki tushdi. Diqqat qiling: let yana yozilmadi, chunki quti allaqachon bor.", 'Герой врезался. lives знак равно два: старое значение ушло, упало два. Заметь: let второй раз не пишут — коробка уже есть.', 'The hero crashed. lives equals sign two: the old value left, two dropped in. Note: we don’t write let again, the box already exists.'),
      L3("Yana urildi. Endi qator lives teng belgisi lives minus bir. JavaScript oldin o'ng tomonni hisoblaydi: qutidan ikkini oladi, birni ayiradi, keyin javobni qutiga qaytaradi. Qutida bir.", 'Снова удар. Теперь строка: lives знак равно lives минус один. JavaScript сначала считает правую часть: берёт из коробки два, вычитает один и кладёт ответ обратно. В коробке один.', 'Another crash. Now the line is lives equals sign lives minus one. JavaScript works out the right side first: takes two from the box, subtracts one, and puts the answer back. The box holds one.')
    ],
    help: [
      L3("Xotiradagi lives qutisiga qarang: qiymat har safar almashadi.", 'Смотри на коробку lives в памяти: значение каждый раз меняется.', 'Watch the lives box in memory: the value changes each time.'),
      L3("let qutini bir marta ochadi. Keyin faqat nom, teng belgisi va yangi qiymat yoziladi.", 'let открывает коробку один раз. Дальше пишут только имя, знак равно и новое значение.', 'let opens the box once. After that you write only the name, the equals sign and the new value.'),
      L3("Xuddi o'yindagi hayot belgisi kabi: belgi bitta, ichidagi son kamayib boradi.", 'Как счётчик жизней в игре: значок один, а число в нём уменьшается.', 'Like the lives counter in a game: one icon, but the number in it goes down.')
    ],
    ask: L3("Qiymat qanday o'zgarishini kuzating", 'Смотри, как меняется значение', 'Watch how the value changes'),
    askDone: L3("Yangi qiymat eskisini almashtiradi, let qayta yozilmaydi", 'Новое значение вытесняет старое, let второй раз не пишут', 'A new value replaces the old one; let isn’t written again')
  },
  s7: {
    eyebrow: L3('Yangi daraja', 'Новый уровень', 'A new level'),
    say: L3("Qahramon beshinchi darajaga chiqdi! level qutisidagi qiymatni o'zgartiring: uchinchi qatorni o'zingiz yozing, shunda konsolda besh chiqsin.",
      'Герой вышел на пятый уровень! Поменяй значение в коробке level: напиши третью строку целиком, чтобы в консоли вышло пять.',
      'The hero reached level five! Change the value in the level box: write the third line yourself so the console shows five.'),
    ask: L3("level qiymatini 5 ga o'zgartiring", 'Поменяй значение level на 5', 'Change level to 5'),
    msgs: {
      empty: L3("Qator bo'sh. Qutining nomidan boshlang.", 'Строка пустая. Начни с имени коробки.', 'The line is empty. Start with the box’s name.'),
      redeclare: L3("Konsol qizil: level qutisi allaqachon bor. let faqat yangi quti uchun. let so'zini olib tashlang.", 'Консоль красная: коробка level уже есть. let — только для новой коробки. Убери слово let.', 'The console is red: the level box already exists. let is only for a new box. Remove the word let.'),
      otherBox: L3("Kod ishladi, lekin xotirada yangi quti paydo bo'ldi va level o'zgarmadi. Nom aynan level bo'lsin: kichik harflar bilan.", 'Код сработал, но в памяти появилась новая коробка, а level не изменился. Имя должно быть точно level — маленькими буквами.', 'The code ran, but a new box appeared in memory and level didn’t change. The name must be exactly level, in lowercase.'),
      notFive: L3("Konsolda besh emas. Teng belgisidan keyin besh yozing.", 'В консоли не пять. После знака равно напиши пять.', 'The console doesn’t show five. Write five after the equals sign.'),
      quoted: L3("Konsolda besh, lekin qutida qo'shtirnoqli matn. Son qo'shtirnoqsiz yoziladi.", 'В консоли пять, но в коробке текст в кавычках. Число пишут без кавычек.', 'The console shows five, but the box holds text in quotes. A number is written without quotes.'),
      syntax: L3("JavaScript bu qatorni tushunmadi. Shakl: nom, teng belgisi, qiymat, nuqtali vergul.", 'JavaScript не понял строку. Форма: имя, знак равно, значение, точка с запятой.', 'JavaScript didn’t understand the line. The shape: name, equals sign, value, semicolon.')
    },
    hints: [
      L3("Quti allaqachon bor, shuning uchun let kerak emas.", 'Коробка уже есть, поэтому let не нужен.', 'The box already exists, so let isn’t needed.'),
      L3("Qator qutining nomi bilan boshlanadi, keyin teng belgisi va yangi qiymat.", 'Строка начинается с имени коробки, потом знак равно и новое значение.', 'The line starts with the box’s name, then the equals sign and the new value.'),
      L3("Namunani ko'chirib yozing.", 'Перепиши образец.', 'Copy the example.')
    ],
    ok: L3("Ajoyib! level qutisida endi besh. Eski bir chiqib ketdi.", 'Отлично! В коробке level теперь пять. Старая единица ушла.', 'Excellent! The level box now holds five. The old one left.')
  },
  s8: {
    eyebrow: L3('Qutida nima?', 'Что в коробке?', 'What’s in the box?'),
    say: L3("Kodni qatorma-qator o'qing va oxirida qutida nima qolishini toping. Javobdan keyin kod ishlaydi va tekshiramiz.",
      'Прочитай код строка за строкой и найди, что останется в коробке в конце. После ответа код сработает, и проверим.',
      'Read the code line by line and find what’s left in the box at the end. After you answer, the code runs and we check.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['let score = 0;', 'score = 10;', 'console.log(score);'], opts: ['0', '10', 'score'], a: 1,
        why: L3("Ikkinchi qator nolni chiqarib, o'nni soldi.", 'Вторая строка выкинула ноль и положила десять.', 'The second line threw out zero and put in ten.') },
      { code: ['let score = 10;', 'score = score + 5;', 'console.log(score);'], opts: ['10', '15', 'score + 5'], a: 1,
        why: L3("Qutidan o'nni oldi, beshni qo'shdi va o'n beshni qaytardi.", 'Взяли из коробки десять, прибавили пять и положили обратно пятнадцать.', 'It took ten from the box, added five, and put fifteen back.') },
      { code: ['let coins = 3;', 'coins = coins * 2;', 'coins = coins - 1;', 'console.log(coins);'], opts: ['6', '3', '5'], a: 2,
        why: L3("Oldin uchni ikkiga ko'paytirdi: olti. Keyin birni ayirdi: besh.", 'Сначала три умножили на два: шесть. Потом вычли один: пять.', 'First three times two: six. Then minus one: five.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Har bir qatordan keyin qutida nima borligini yozib boring.", 'Записывай для себя, что лежит в коробке после каждой строки.', 'Keep track of what’s in the box after each line.'),
    hint2: L3("Yangi qiymat eskisini almashtiradi. O'ng tomonni oldin hisoblang.", 'Новое значение вытесняет старое. Правую часть считай первой.', 'A new value replaces the old one. Work out the right side first.'),
    ok: L3("Barakalla! Siz kodni JavaScript'dek o'qiysiz: qatorma-qator.", 'Молодец! Ты читаешь код как JavaScript — строка за строкой.', 'Well done! You read code like JavaScript does: line by line.')
  },
  s9: {
    eyebrow: L3('Qulfli quti', 'Коробка с замком', 'A locked box'),
    say: L3("Ba'zi narsalar hech qachon o'zgarmaydi. Masalan, o'yin nomi. Ular uchun boshqa so'z bor: const. Kuzating.",
      'Некоторые вещи никогда не меняются. Например, название игры. Для них есть другое слово — const. Смотри.',
      'Some things never change. For example, the game’s name. There’s another word for them: const. Watch.'),
    steps: [
      L3("const ham quti ochadi, lekin qulf bilan. Qiymat bir marta solinadi.", 'const тоже открывает коробку, но с замком. Значение кладут один раз.', 'const also opens a box, but with a lock. The value goes in once.'),
      L3("console.log qulfli qutidan ham bemalol o'qiydi: Kodi Run.", 'Читать из коробки с замком console.log может спокойно: Kodi Run.', 'console.log can read from a locked box just fine: Kodi Run.'),
      L3("Endi yangi nom yozishga urinamiz. Konsol qizil: Assignment to constant variable, ya'ni o'zgarmas qutiga yozib bo'lmaydi degani.", 'А теперь пробуем записать новое название. Консоль красная: Assignment to constant variable — в коробку с замком писать нельзя.', 'Now we try to write a new name. The console is red: Assignment to constant variable, you can’t write into a locked box.'),
      L3("Qoida oddiy. O'zgaradigan narsalar, masalan ochko, hayot, daraja, let bilan. O'zgarmaydiganlar, masalan o'yin nomi yoki tug'ilgan yil, const bilan.", 'Правило простое. То, что меняется — очки, жизни, уровень, — через let. То, что не меняется — название игры или год рождения, — через const.', 'The rule is simple. Things that change, like score, lives or level, use let. Things that don’t, like the game’s name or a birth year, use const.')
    ],
    help: [
      L3("Xotiradagi qutiga qarang: const qutisida qulf bor.", 'Смотри на коробку в памяти: у const есть замок.', 'Look at the box in memory: the const box has a lock.'),
      L3("const qutisini o'qisa bo'ladi, lekin yangi qiymat yozib bo'lmaydi.", 'Коробку const можно читать, но записать новое значение нельзя.', 'You can read a const box, but you can’t write a new value.'),
      L3("Xuddi tug'ilganlik guvohnomasi kabi: o'qiysiz, lekin undagi sanani o'zgartirmaysiz.", 'Как свидетельство о рождении: читать можно, а дату в нём не поменяешь.', 'Like a birth certificate: you can read it, but you can’t change the date in it.')
    ],
    ask: L3("const qanday ishlashini kuzating", 'Смотри, как работает const', 'Watch how const works'),
    askDone: L3("O'zgaradi — let, o'zgarmaydi — const", 'Меняется — let, не меняется — const', 'Changes: let. Never changes: const')
  },
  s10: {
    eyebrow: L3('let yoki const?', 'let или const?', 'let or const?'),
    say: L3("O'yindagi har bir narsa uchun so'z tanlang: o'zgaradimi, demak let, o'zgarmaydimi, demak const.",
      'Выбери слово для каждой вещи в игре: меняется — значит let, не меняется — значит const.',
      'Pick a word for each thing in the game: if it changes, let; if it never changes, const.'),
    ask: L3("Qaysi so'z mos?", 'Какое слово подходит?', 'Which word fits?'),
    rounds: [
      { q: L3("O'yindagi ochkolar", 'Очки в игре', 'The game score'), a: 'let', why: L3("Ochko o'yin davomida o'sadi, demak let.", 'Очки растут по ходу игры — значит let.', 'The score grows during the game, so let.') },
      { q: L3("O'yinning nomi", 'Название игры', 'The game’s name'), a: 'const', why: L3("O'yin nomi o'zgarmaydi, demak const.", 'Название игры не меняется — значит const.', 'The game’s name doesn’t change, so const.') },
      { q: L3("Qahramonning hayotlari", 'Жизни героя', 'The hero’s lives'), a: 'let', why: L3("Hayotlar kamayadi, demak let.", 'Жизни уменьшаются — значит let.', 'Lives go down, so let.') },
      { q: L3("Sizning tug'ilgan yilingiz", 'Твой год рождения', 'Your birth year'), a: 'const', why: L3("Tug'ilgan yil hech qachon o'zgarmaydi.", 'Год рождения никогда не меняется.', 'A birth year never changes.') },
      { q: L3("Hozirgi daraja", 'Текущий уровень', 'The current level'), a: 'let', why: L3("Daraja oshib boradi, demak let.", 'Уровень растёт — значит let.', 'The level goes up, so let.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("O'ylang: o'yin davomida bu narsa o'zgaradimi?", 'Подумай: эта вещь меняется по ходу игры?', 'Think: does this thing change during the game?'),
    hint2: L3("O'zgarsa — let. Hech qachon o'zgarmasa — const.", 'Меняется — let. Никогда не меняется — const.', 'If it changes, let. If it never changes, const.'),
    ok: L3("Ajoyib! Siz let va const ni to'g'ri tanlaysiz.", 'Отлично! Ты правильно выбираешь между let и const.', 'Excellent! You pick let and const correctly.')
  },
  s11: {
    eyebrow: L3('Tuzating', 'Исправь', 'Fix it'),
    say: L3("Kodi tangalar uchun const yozib qo'ydi va konsol qizil bo'ldi. Birinchi qatordagi so'zni almashtiring va ishga tushiring.",
      'Коди написал для монет const, и консоль стала красной. Поменяй слово в первой строке и запусти.',
      'Kodi used const for the coins, and the console turned red. Change the word on the first line and run.'),
    ask: L3("Birinchi qatordagi so'zni almashtiring", 'Поменяй слово в первой строке', 'Change the word on the first line'),
    msgs: {
      still: L3("Konsol yana qizil: qulfli qutiga yozib bo'lmaydi. Tangalar o'zgaradi, demak qaysi so'z kerak?", 'Консоль снова красная: в коробку с замком писать нельзя. Монеты меняются — какое слово нужно?', 'The console is red again: you can’t write into a locked box. The coins change, so which word is needed?'),
      empty: L3("So'z o'chib qoldi. Quti ochadigan so'zni yozing.", 'Слово стёрто. Напиши слово, которое открывает коробку.', 'The word is gone. Type the word that opens a box.'),
      old: L3("Kod ishladi, lekin var eski usul. Bugun let yozamiz.", 'Код сработал, но var — старый способ. Сегодня пишем let.', 'The code ran, but var is the old way. Today we write let.'),
      other: L3("JavaScript bu so'zni tanimadi. Quti ochadigan ikki so'z esingizdami?", 'JavaScript не узнал это слово. Вспомни два слова, которые открывают коробку.', 'JavaScript didn’t recognize this word. Remember the two words that open a box.')
    },
    hints: [
      L3("Qizil xabarni o'qing: Assignment to constant variable.", 'Прочитай красное сообщение: Assignment to constant variable.', 'Read the red message: Assignment to constant variable.'),
      L3("Tangalar o'zgaradi. O'zgaradigan quti qaysi so'z bilan ochiladi?", 'Монеты меняются. Каким словом открывают коробку, которая меняется?', 'The coins change. Which word opens a box that changes?'),
      L3("const o'rniga let yozing.", 'Напиши let вместо const.', 'Write let instead of const.')
    ],
    ok: L3("Tuzatildi! let qutisiga yangi qiymat bemalol yoziladi: endi bitta tanga.", 'Исправлено! В коробку let новое значение пишется спокойно: теперь одна монета.', 'Fixed! A let box takes a new value just fine: now there’s one coin.')
  },
  s12: {
    eyebrow: L3("O'zgaruvchi xatolari", 'Ошибки переменных', 'Variable mistakes'),
    say: L3("O'zgaruvchilar bilan ham konsol qizil bo'lishi mumkin. Uchta ko'p uchraydigan xatoni ko'ramiz.",
      'И с переменными консоль может стать красной. Посмотрим три частые ошибки.',
      'The console can turn red with variables too. Let’s look at three common mistakes.'),
    steps: [
      L3("Quti nomi score, lekin chaqirishda Score bosh harf bilan. JavaScript uchun bular ikki xil nom, shuning uchun Score is not defined.", 'Коробка называется score, а зовут её Score — с большой буквы. Для JavaScript это два разных имени, поэтому Score is not defined.', 'The box is called score, but it’s called as Score, with a capital letter. To JavaScript those are two different names, so Score is not defined.'),
      L3("Bu yerda qutidan oldin foydalanildi. Kod tepadan pastga ishlaydi: birinchi qatorda lives qutisi hali ochilmagan. Xabar: Cannot access before initialization, ya'ni hali tayyor emas degani.", 'Здесь коробкой воспользовались раньше, чем её открыли. Код идёт сверху вниз: в первой строке коробки lives ещё нет. Сообщение: Cannot access before initialization — ещё не готова.', 'Here the box is used before it’s opened. Code runs top to bottom: on the first line the lives box isn’t open yet. The message: Cannot access before initialization, it isn’t ready yet.'),
      L3("Bu yerda let ikki marta bitta nom bilan. Bitta nomda ikkita quti bo'lmaydi: already been declared. Bunday xatoda kod umuman ishlamaydi.", 'Здесь let дважды с одним именем. Двух коробок с одним именем не бывает: already been declared. С такой ошибкой код не запускается совсем.', 'Here let is used twice with one name. There can’t be two boxes with one name: already been declared. With this mistake the code doesn’t run at all.')
    ],
    help: [
      L3("Har bir misolda kodga va qizil xabarga qarang.", 'В каждом примере смотри на код и красное сообщение.', 'In each example, look at the code and the red message.'),
      L3("Nom aynan bir xil bo'lsin, quti oldin ochilsin, let esa bir marta yozilsin.", 'Имя должно совпадать точь-в-точь, коробку открывают раньше, а let пишут один раз.', 'The name must match exactly, the box is opened first, and let is written once.'),
      L3("Xuddi telefondagi kontakt kabi: bitta harf xato bo'lsa, qo'ng'iroq boshqa odamga ketadi yoki hech kimga.", 'Как контакт в телефоне: ошибёшься в одной букве — звонок уйдёт не туда или никуда.', 'Like a contact on your phone: one wrong letter and the call goes to someone else, or nowhere.')
    ],
    ask: L3("Qizil xabarlarni kuzating", 'Смотри на красные сообщения', 'Watch the red messages'),
    askDone: L3("Nom aynan bir xil, oldin let, let bir marta", 'Имя точь-в-точь, сначала let, let один раз', 'Exact name, let first, let once')
  },
  s13: {
    eyebrow: L3('Buzilgan qator', 'Сломанная строка', 'The broken line'),
    say: L3("Qizil xabarga va o'ng tomondagi raqamga qarang, keyin buzilgan qatorni bosing.",
      'Посмотри на красное сообщение и номер справа, потом нажми сломанную строку.',
      'Look at the red message and the number on the right, then tap the broken line.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    rounds: [
      { lines: ['let coins = 5;', 'coins = coins + 1;', 'console.log(coin);'], bad: 2, why: L3("Uchinchi qatorda nom xato: coin, oxirida s harfi yo'q.", 'В третьей строке ошибка в имени: coin, в конце нет буквы s.', 'On the third line the name is wrong: coin, the s at the end is missing.') },
      { lines: ['const lives = 3;', 'console.log(lives);', 'lives = 2;'], bad: 2, why: L3("Uchinchi qatorda qulfli qutiga yangi qiymat yozilyapti.", 'В третьей строке в коробку с замком пишут новое значение.', 'On the third line a new value is written into a locked box.') }
    ],
    wrong: L3("Bu qator xatosiz ishladi. Qizil xabar yonidagi raqamga qarang.", 'Эта строка сработала без ошибки. Посмотри на номер у красного сообщения.', 'This line ran without a mistake. Look at the number next to the red message.'),
    right: L3("Topildi!", 'Есть!', 'Found it!'),
    hint1: L3("Qizil xabarning o'ng tomonida raqam bor. U qator raqami.", 'Справа у красного сообщения есть число. Это номер строки.', 'There’s a number on the right of the red message. It’s the line number.'),
    hint2: L3("Raqamni toping va koddagi o'sha qatorni bosing.", 'Найди число и нажми эту строку в коде.', 'Find the number and tap that line in the code.'),
    ok: L3("Ajoyib! Endi o'zgaruvchi xatolarini ham topa olasiz.", 'Здорово! Теперь ты находишь и ошибки переменных.', 'Awesome! Now you can find variable mistakes too.')
  },
  s14: {
    eyebrow: L3("Qo'shtirnoq yoki nom?", 'Кавычки или имя?', 'Quotes or a name?'),
    say: L3("Muhim farq. Qutida o'n bor. Ikki qatorda konsolga nima chiqadi? Taxmin qiling.",
      'Важная разница. В коробке десять. Что выведут в консоль две строки? Угадай.',
      'An important difference. The box holds ten. What will these two lines show in the console? Guess.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: ['let score = 10;', 'console.log("score");'], opts: ['score', '10', 'err'], a: 0,
        why: L3("Qo'shtirnoq ichida bu oddiy matn. Konsolga score so'zining o'zi chiqadi.", 'В кавычках это просто текст. В консоль выходит само слово score.', 'In quotes it’s just text. The console shows the word score itself.') },
      { code: ['let score = 10;', 'console.log(score);'], opts: ['score', '10', 'err'], a: 1,
        why: L3("Qo'shtirnoqsiz bu qutining nomi. Konsolga qutidagi o'n chiqadi.", 'Без кавычек это имя коробки. В консоль выходит десять из коробки.', 'Without quotes it’s the box’s name. The console shows the ten from the box.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Qo'shtirnoqqa qarang: ular bormi yoki yo'qmi?", 'Посмотри на кавычки: они есть или нет?', 'Look at the quotes: are they there or not?'),
    hint2: L3("Qo'shtirnoqda — matnning o'zi. Qo'shtirnoqsiz — qutidagi qiymat.", 'В кавычках — сам текст. Без кавычек — значение из коробки.', 'In quotes: the text itself. Without quotes: the value from the box.'),
    ok: L3("Barakalla! Matn va qutining nomini endi adashtirmaysiz.", 'Молодец! Теперь текст и имя коробки не перепутать.', 'Well done! You won’t mix up text and a box’s name anymore.')
  },
  s15: {
    eyebrow: L3("Butun qator", 'Целая строка', 'A whole line'),
    say: L3("Endi butun qatorni o'zingiz yozing: coins nomli quti oching va unga ellik soling. Pastdagi qator uni konsolga chiqaradi.",
      'Теперь напиши всю строку целиком: открой коробку coins и положи в неё пятьдесят. Строка ниже выведет её в консоль.',
      'Now write the whole line yourself: open a box named coins and put fifty in it. The line below will show it in the console.'),
    ask: L3("coins qutisini oching va unga 50 soling", 'Открой коробку coins и положи в неё 50', 'Open the coins box and put 50 in it'),
    msgs: {
      empty: L3("Qator bo'sh. let dan boshlang.", 'Строка пустая. Начни с let.', 'The line is empty. Start with let.'),
      noKw: L3("Kod ishladi, lekin qutini let bilan oching: qator let so'zi bilan boshlansin.", 'Код сработал, но открой коробку через let: пусть строка начинается со слова let.', 'The code ran, but open the box with let: start the line with the word let.'),
      name: L3("Konsol qizil: pastdagi qator coins qutisini qidiradi, lekin bunday quti yo'q. Nom aynan coins bo'lsin.", 'Консоль красная: строка ниже ищет коробку coins, а такой нет. Имя должно быть точно coins.', 'The console is red: the line below looks for the coins box, but there isn’t one. The name must be exactly coins.'),
      value: L3("Quti bor, lekin ichida ellik emas. Teng belgisidan keyin ellik yozing.", 'Коробка есть, но в ней не пятьдесят. После знака равно напиши пятьдесят.', 'The box is there, but it doesn’t hold fifty. Write fifty after the equals sign.'),
      quoted: L3("Qutida qo'shtirnoqli matn. Son qo'shtirnoqsiz yoziladi.", 'В коробке текст в кавычках. Число пишут без кавычек.', 'The box holds text in quotes. A number is written without quotes.'),
      space: L3("Nomda bo'sh joy bo'lmaydi. Nomni bitta so'z qilib yozing.", 'В имени не бывает пробелов. Напиши имя одним словом.', 'A name can’t have spaces. Write the name as one word.'),
      syntax: L3("JavaScript bu qatorni tushunmadi. Shakl: let, nom, teng belgisi, qiymat, nuqtali vergul.", 'JavaScript не понял строку. Форма: let, имя, знак равно, значение, точка с запятой.', 'JavaScript didn’t understand the line. The shape: let, name, equals sign, value, semicolon.')
    },
    hints: [
      L3("Qator let bilan boshlanadi.", 'Строка начинается с let.', 'The line starts with let.'),
      L3("Keyin nom coins, teng belgisi, ellik va nuqtali vergul.", 'Потом имя coins, знак равно, пятьдесят и точка с запятой.', 'Then the name coins, the equals sign, fifty and a semicolon.'),
      L3("Namunani ko'chirib yozing va ishga tushiring.", 'Перепиши образец и запусти.', 'Copy the example and run it.')
    ],
    ok: L3("Ajoyib! Butun qatorni o'zingiz yozdingiz: xotirada coins qutisi, ichida ellik.", 'Отлично! Вся строка написана тобой: в памяти коробка coins, в ней пятьдесят.', 'Excellent! You wrote the whole line: the coins box is in memory with fifty inside.')
  },
  s16: {
    eyebrow: L3('Qahramon kartasi', 'Карточка героя', 'Hero card'),
    say: L3("Endi o'z qahramoningizning kartasi. Uchta bo'sh joyni to'ldiring: qahramon ismi, boshlang'ich ochko va bonus. Ochko va bonus raqam, qo'shtirnoqsiz. JavaScript yangi ochkoni o'zi hisoblaydi!",
      'Теперь карточка твоего героя. Заполни три пропуска: имя героя, начальные очки и бонус. Очки и бонус — числа, без кавычек. JavaScript сам посчитает новые очки!',
      'Now your own hero’s card. Fill in three gaps: the hero’s name, the starting score and a bonus. The score and bonus are numbers, without quotes. JavaScript will work out the new score by itself!'),
    ask: L3("Uchta bo'sh joyni to'ldiring va ishga tushiring", 'Заполни три пропуска и запусти', 'Fill in the three gaps and run'),
    ph: [L3('ism', 'имя', 'name'), L3('son', 'число', 'number'), L3('son', 'число', 'number')],
    msgs: {
      empty: L3("Hamma bo'sh joylarni to'ldiring.", 'Заполни все пропуски.', 'Fill in all the gaps.'),
      quote: L3("Qo'shtirnoqlar allaqachon bor. Birinchi joyga faqat ism yozing.", 'Кавычки уже есть. В первый пропуск пиши только имя.', 'The quotes are already there. Just type a name in the first gap.'),
      num: L3("Ikkinchi va uchinchi joyga faqat raqam yozing, qo'shtirnoqsiz.", 'Во второй и третий пропуск пиши только цифры, без кавычек.', 'Type only digits in the second and third gaps, without quotes.')
    },
    hints: [
      L3("Birinchi joyga ism, qolgan ikkitasiga raqam yozing.", 'В первый пропуск — имя, в два других — цифры.', 'A name in the first gap, digits in the other two.'),
      L3("Raqamni qo'shtirnoqsiz yozamiz, shunda JavaScript uni hisoblaydi.", 'Число пишем без кавычек — тогда JavaScript его считает.', 'We write numbers without quotes, so JavaScript can calculate them.'),
      L3("Masalan: Robo, keyin yuz, keyin ellik.", 'Например: Robo, потом сто, потом пятьдесят.', 'For example: Robo, then a hundred, then fifty.')
    ],
    ok: L3("Zo'r! Qahramoningiz tayyor. Xotirada ikkita quti: ism qulf bilan, ochko esa o'sdi!", 'Супер! Твой герой готов. В памяти две коробки: имя под замком, а очки выросли!', 'Awesome! Your hero is ready. Memory has two boxes: the name under a lock, and the score went up!')
  },
  s17: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Kichik tekshiruv. Har bir gap to'g'rimi yoki noto'g'rimi? Bosing.",
      'Маленькая проверка. Каждое утверждение верно или нет? Нажимай.',
      'A little check. Is each statement true or false? Tap.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или нет?', 'True or false?'),
    rounds: [
      { q: L3("let bilan ochilgan qutining qiymatini o'zgartirsa bo'ladi.", 'Значение в коробке, открытой через let, можно поменять.', 'You can change the value in a box opened with let.'), a: true, why: L3("Ha, let qutisi o'zgaradi.", 'Да, коробка let меняется.', 'Yes, a let box can change.') },
      { q: L3("const qutisiga keyin yangi qiymat yozsa bo'ladi.", 'В коробку const потом можно записать новое значение.', 'You can later write a new value into a const box.'), a: false, why: L3("Yo'q, const qulfli: konsol qizil bo'ladi.", 'Нет, const под замком: консоль станет красной.', 'No, const is locked: the console turns red.') },
      { q: L3('console.log("score") score qutisidagi qiymatni chiqaradi.', 'console.log("score") выводит значение из коробки score.', 'console.log("score") shows the value from the score box.'), a: false, why: L3("Yo'q, qo'shtirnoqda bu matn: score so'zi chiqadi.", 'Нет, в кавычках это текст: выйдет слово score.', 'No, in quotes it’s text: the word score comes out.') },
      { q: L3("Qiymatni o'zgartirganda let ni yana yozish kerak.", 'Чтобы поменять значение, let нужно написать ещё раз.', 'To change the value you must write let again.'), a: false, why: L3("Yo'q, let faqat yangi quti uchun.", 'Нет, let — только для новой коробки.', 'No, let is only for a new box.') },
      { q: L3("score va Score ikki xil nom.", 'score и Score — два разных имени.', 'score and Score are two different names.'), a: true, why: L3("Ha, JavaScript katta va kichik harfni farqlaydi.", 'Да, JavaScript различает большие и маленькие буквы.', 'Yes, JavaScript tells capital and small letters apart.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Darsda ko'rganlaringiz esingizdami?", 'Вспомни, что было на уроке.', 'Remember what you saw in the lesson.'),
    hint2: L3("let o'zgaradi, const qulfli, qo'shtirnoqda matn, harflar muhim.", 'let меняется, const под замком, в кавычках текст, буквы важны.', 'let changes, const is locked, quotes mean text, letters matter.'),
    ok: L3("Ajoyib! Siz o'zgaruvchilar qoidalarini bilasiz.", 'Отлично! Ты знаешь правила переменных.', 'Excellent! You know the rules of variables.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men console.log ichida qo'shtirnoqdagi coins uchni chiqaradi degandim? Xato qilibman! Qo'shtirnoqda bu oddiy matn, konsolga coins so'zi chiqadi. Qutidagi qiymat uchun nom qo'shtirnoqsiz yoziladi.",
        'Помнишь, я говорил, что console.log с coins в кавычках покажет три? Я ошибся! В кавычках это просто текст — в консоль выйдет слово coins. Чтобы достать значение из коробки, имя пишут без кавычек.',
        'Remember when I said console.log with coins in quotes would show three? I was wrong! In quotes it’s just text, so the word coins comes out. To get the value from a box, write its name without quotes.') },
      { k: 'box', text: L3("O'zgaruvchi xotiradagi quti: let uni ochadi, nom yorliq bo'ladi, teng belgisi qiymatni soladi.", 'Переменная — коробка в памяти: let её открывает, имя становится ярлыком, знак равно кладёт значение.', 'A variable is a box in memory: let opens it, the name becomes its label, the equals sign puts the value in.') },
      { k: 'change', text: L3("Qiymatni o'zgartirish uchun let yozilmaydi: nom, teng belgisi va yangi qiymat.", 'Чтобы поменять значение, let не пишут: имя, знак равно и новое значение.', 'To change a value you don’t write let: the name, the equals sign and the new value.') },
      { k: 'const', text: L3("O'zgarmaydigan narsalar uchun const: qutisi qulfli.", 'Для того, что не меняется, — const: коробка под замком.', 'For things that never change, const: the box is locked.') },
      { k: null, text: L3("Barakalla! Endi JavaScript siz uchun ma'lumotni eslab qoladi. Keyingi darsda ma'lumot turlari: qutiga matn, son yoki ha va yo'q qanday solinadi!",
        'Ура! Теперь JavaScript запоминает данные для тебя. На следующем уроке — типы данных: как в коробку кладут текст, число или «да» и «нет»!',
        'Hooray! Now JavaScript remembers data for you. Next lesson: data types, how text, numbers, or yes and no go into a box!') }
    ],
    ask: L3("O'zgaruvchilar — xotiradagi qutilar", 'Переменные — коробки в памяти', 'Variables are boxes in memory'),
    roles: { riddle: L3("Nom — qo'shtirnoqsiz", 'Имя — без кавычек', 'A name has no quotes'), box: L3("let — yangi quti", 'let — новая коробка', 'let is a new box'),
      change: L3("Teng belgisi — qutiga sol", 'Знак равно — «положи»', 'Equals means “put in”'), const: L3("const — qulfli quti", 'const — коробка с замком', 'const is a locked box') }
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, right: 1, rounds: 1, ok: 1, wrong: 1, msgs: 1, more: 1, works: 1, riddle: 1, piece: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { q: 1, a: 1, code: 1, opts: 1, lines: 1, bad: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:j2-engine.jsx@*/

/*@FILE:j2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css1/c1.css@*/
/*@FILE:../js1/j1.css@*/
/*@FILE:j2.css@*/
`;
