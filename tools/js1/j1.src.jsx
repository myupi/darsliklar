// =============================================================================
// КУРС «JAVASCRIPT» · Урок 1 — «Что такое JavaScript» (26.11.2026, заказчик: «делай первый урок JS»).
// Облик «Редактор», как уроки курса HTML и CSS. Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/js1/build.mjs → lessons/javascript/01-chto-takoe-js.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 · «Что такое JavaScript» · модуль js-m1 =====
//
// ЗАМЫСЕЛ. На сайте Коди кнопка «Bosing» мёртвая: HTML дал кнопку, CSS — цвет, оживляет её третий язык — JavaScript.
// Ученик узнаёт, что делают HTML, CSS и JS (скелет, одежда, мозг), где живёт JS (script в конце body, файл script.js
// через src), пишет console.log и находит результат в консоли браузера, отличает текст в кавычках от выражения,
// читает красные ошибки консоли и видит, что код выполняется сверху вниз. Загадка: Коди уверен, что console.log("Salom")
// выведет «Salom» на страницу; разгадка — пишет в консоль, тетрадь программиста.
// Дуга (17): крючок → показ «три языка» → кто это делает → показ «где живёт JS» → где поставить script → впиши src →
// показ console.log → своё сообщение → что покажет консоль → показ «красные ошибки» → исправь кавычки → найди строку →
// порядок строк → строка целиком → своя визитка → верно или нет → вывод.
// Честный JavaScript: j1-engine.jsx выполняет console.log и выдаёт ошибки как Chrome.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'js-01-chto-takoe-js',
  module: 'js-m1',
  lessonTitle: {
    uz: '1-dars. JavaScript nima',
    ru: 'Урок 1. Что такое JavaScript',
    en: 'Lesson 1. What JavaScript is'
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
  connect: L3("JavaScript'ni ulash", 'Подключить JavaScript', 'Connect JavaScript'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  yes: L3("To'g'ri", 'Верно', 'True'),
  no: L3("Noto'g'ri", 'Неверно', 'False'),
  err: L3('Xato', 'Ошибка', 'Error'),
  files: L3('Fayllar', 'Файлы', 'Files'),
  conEmpty: L3("Konsol hozircha bo'sh", 'Консоль пока пуста', 'The console is empty for now'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3("O'zgaruvchilar", 'Переменные', 'Variables'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, steps, ok, msgs, hints, help, why, right, wrong …; печатаются: eyebrow, ask, site, opts, q, code.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Сайт Коди (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    text: L3("Tugmani bosing va nima bo'lishini ko'ring.", 'Нажми кнопку и посмотри, что будет.', 'Press the button and see what happens.'),
    btn: L3('Bosing', 'Нажми', 'Press'),
    count: L3('Bosildi: {n} marta', 'Нажато: {n} раз', 'Pressed: {n} times')
  },
  s1: {
    eyebrow: L3("O'lik tugma", 'Мёртвая кнопка', 'A dead button'),
    say: L3("Salom! Bu mening saytim. HTML bilan sahifa yasadik, CSS bilan uni bezadik. Mana «Bosing» tugmasi. Qani, bosib ko'ring!",
      'Привет! Это мой сайт. С HTML мы сделали страницу, с CSS — украсили её. Вот кнопка «Нажми». Ну-ка, нажми её!',
      'Hi! This is my site. With HTML we made a page, with CSS we decorated it. Here’s the “Press” button. Go on, press it!'),
    dead: L3("Hech narsa bo'lmadi, to'g'rimi? Tugma chiroyli, lekin o'lik. Uni jonlantirish uchun uchinchi til kerak: JavaScript. «JavaScript'ni ulash» tugmasini bosing.",
      'Ничего не произошло, правда? Кнопка красивая, но мёртвая. Чтобы её оживить, нужен третий язык — JavaScript. Нажми «Подключить JavaScript».',
      'Nothing happened, right? The button is pretty, but dead. To bring it to life we need a third language: JavaScript. Tap “Connect JavaScript”.'),
    alive: L3("Ulandi! Endi tugmani yana bosing.", 'Подключили! Теперь нажми кнопку ещё раз.', 'Connected! Now press the button again.'),
    works: L3("Ishladi! Har bosganingizda son ortadi. Buni JavaScript qildi.", 'Работает! С каждым нажатием число растёт. Это сделал JavaScript.', 'It works! The number grows with every press. JavaScript did that.'),
    riddle: L3("Bugun JavaScript bilan tanishasiz va birinchi buyrug'ingizni yozasiz. Lekin oldin topishmoq. Men console.log degan buyruqni bilaman. Menimcha, uning ichiga Salom deb yozsam, Salom so'zi sahifada katta bo'lib chiqadi. Men haqmanmi? Dars oxirida bilamiz.",
      'Сегодня ты познакомишься с JavaScript и напишешь свою первую команду. Но сначала загадка. Я знаю команду console.log. По-моему, если написать в ней Salom, слово Salom появится на странице крупными буквами. Прав ли я? Узнаем в конце урока.',
      'Today you’ll meet JavaScript and write your first command. But first, a riddle. I know a command called console.log. I think if I write Salom in it, the word Salom will appear big on the page. Am I right? We’ll find out at the end of the lesson.'),
    ask: L3('«Bosing» tugmasini bosing', 'Нажми кнопку «Нажми»', 'Press the “Press” button'),
    askJs: L3("«JavaScript'ni ulash» ni bosing", 'Нажми «Подключить JavaScript»', 'Tap “Connect JavaScript”'),
    askAgain: L3('Tugmani yana bosing', 'Нажми кнопку ещё раз', 'Press the button again'),
    askDone: L3("Topishmoq: console.log sahifaga yozadimi?", 'Загадка: console.log пишет на страницу?', 'Riddle: does console.log write on the page?')
  },
  s2: {
    eyebrow: L3('Uchta til', 'Три языка', 'Three languages'),
    say: L3("Har bir sayt uchta tildan yasaladi. Bitta sahifada uchalasini solishtiramiz. Kuzating.",
      'Каждый сайт делают из трёх языков. Сравним все три на одной странице. Смотри.',
      'Every site is made of three languages. Let’s compare all three on one page. Watch.'),
    steps: [
      L3("Faqat HTML. Sarlavha, matn va tugma bor, lekin hammasi oddiy. HTML saytning skeleti, ya'ni sahifada nima borligini aytadi degani.", 'Только HTML. Есть заголовок, текст и кнопка, но всё простое. HTML — скелет сайта: он говорит, что есть на странице.', 'HTML only. There’s a title, text and a button, but it’s all plain. HTML is the site’s skeleton: it says what’s on the page.'),
      L3("CSS qo'shildi: ranglar, shrift, chiroyli tugma. CSS saytning kiyimi, u qanday ko'rinishini aytadi.", 'Добавили CSS: цвета, шрифт, красивая кнопка. CSS — одежда сайта: он говорит, как всё выглядит.', 'CSS is added: colors, a font, a pretty button. CSS is the site’s clothes: it says how everything looks.'),
      L3("Endi JavaScript: tugma bosilganda son ortadi. JavaScript saytning miyasi, ya'ni sayt nima qilishini aytadi degani.", 'А теперь JavaScript: при нажатии число растёт. JavaScript — мозг сайта: он говорит, что сайт делает.', 'And now JavaScript: the number grows when you press. JavaScript is the site’s brain: it says what the site does.')
    ],
    help: [
      L3("Uchta sahifaga qarang: faqat HTML, keyin CSS bilan, keyin JavaScript bilan.", 'Посмотри на три вида: только HTML, потом с CSS, потом с JavaScript.', 'Look at the three versions: HTML only, then with CSS, then with JavaScript.'),
      L3("HTML nima bor, CSS qanday ko'rinadi, JavaScript nima qiladi.", 'HTML — что есть, CSS — как выглядит, JavaScript — что делает.', 'HTML is what’s there, CSS is how it looks, JavaScript is what it does.'),
      L3("Xuddi odam kabi: skelet tanani ushlaydi, kiyim chiroy beradi, miya esa harakatni boshqaradi.", 'Как человек: скелет держит тело, одежда украшает, а мозг управляет движениями.', 'Like a person: the skeleton holds the body, clothes make it look nice, and the brain controls movement.')
    ],
    roles: { html: L3('HTML · skelet', 'HTML · скелет', 'HTML · skeleton'), css: L3('CSS · kiyim', 'CSS · одежда', 'CSS · clothes'), js: L3('JS · miya', 'JS · мозг', 'JS · brain') },
    ask: L3('Uchta tilni kuzating', 'Смотри на три языка', 'Watch the three languages'),
    askDone: L3("HTML nima bor, CSS qanday, JS nima qiladi", 'HTML — что есть, CSS — как, JS — что делает', 'HTML: what, CSS: how, JS: does')
  },
  s3: {
    eyebrow: L3('Kim qiladi?', 'Кто это делает?', 'Who does it?'),
    say: L3("Endi siz ajrating. Har bir ishni qaysi til qiladi: HTML, CSS yoki JavaScript? Bosing.",
      'Теперь распредели сам. Какой язык делает каждое дело: HTML, CSS или JavaScript? Нажимай.',
      'Now you sort them. Which language does each job: HTML, CSS or JavaScript? Tap.'),
    ask: L3('Bu ishni qaysi til qiladi?', 'Какой язык это делает?', 'Which language does this?'),
    rounds: [
      { q: L3("Sahifaga sarlavha qo'yish", 'Поставить на страницу заголовок', 'Put a title on the page'), a: 'html', why: L3("Sahifada nima bor, buni HTML aytadi.", 'Что есть на странице — говорит HTML.', 'What’s on the page is HTML’s job.') },
      { q: L3("Tugmani yashil qilish", 'Сделать кнопку зелёной', 'Make the button green'), a: 'css', why: L3("Rang bu ko'rinish. Bu CSS ishi.", 'Цвет — это внешний вид. Это CSS.', 'Color is looks. That’s CSS.') },
      { q: L3("Tugma bosilganda son ortadi", 'При нажатии кнопки число растёт', 'The number grows when the button is pressed'), a: 'js', why: L3("Bosilganda nimadir bo'ladi, demak bu JavaScript.", 'При нажатии что-то происходит — значит, это JavaScript.', 'Something happens on a press, so it’s JavaScript.') },
      { q: L3("Sahifaga rasm qo'shish", 'Добавить на страницу картинку', 'Add a picture to the page'), a: 'html', why: L3("Rasm sahifada bor narsa. Bu HTML.", 'Картинка — то, что есть на странице. Это HTML.', 'A picture is something on the page. That’s HTML.') },
      { q: L3("Matnni kattaroq qilish", 'Сделать текст крупнее', 'Make the text bigger'), a: 'css', why: L3("O'lcham bu ko'rinish. Bu CSS.", 'Размер — это внешний вид. Это CSS.', 'Size is looks. That’s CSS.') },
      { q: L3("O'yinda ochkolarni hisoblash", 'Считать очки в игре', 'Count points in a game'), a: 'js', why: L3("Hisoblash bu harakat. Buni JavaScript qiladi.", 'Считать — это действие. Это делает JavaScript.', 'Counting is an action. JavaScript does it.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("O'ylang: bu narsa sahifada bormi, u qanday ko'rinadimi yoki u biror narsa qiladimi?", 'Подумай: это что-то на странице, то, как оно выглядит, или то, что оно делает?', 'Think: is it something on the page, how it looks, or something it does?'),
    hint2: L3("Nima bor bu HTML. Qanday ko'rinadi bu CSS. Bosganda nima bo'ladi bu JavaScript.", 'Что есть — HTML. Как выглядит — CSS. Что происходит при нажатии — JavaScript.', 'What’s there is HTML. How it looks is CSS. What happens on a press is JavaScript.'),
    ok: L3("Barakalla! Siz uchta tilni ajratasiz.", 'Молодец! Ты различаешь три языка.', 'Well done! You can tell the three languages apart.')
  },
  s4: {
    eyebrow: L3('JS qayerda yashaydi', 'Где живёт JS', 'Where JS lives'),
    say: L3("JavaScript qayerda yashaydi? Uni HTML sahifaga script tegi olib keladi. Kuzating.",
      'Где живёт JavaScript? На HTML-страницу его приводит тег script. Смотри.',
      'Where does JavaScript live? The script tag brings it into the HTML page. Watch.'),
    steps: [
      L3("script tegi body ichida, eng oxirida turadi. Uning ichiga JavaScript kodi yoziladi.", 'Тег script стоит внутри body, в самом конце. Внутри него пишут код JavaScript.', 'The script tag sits inside body, at the very end. JavaScript code is written inside it.'),
      L3("Nega oxirida? Brauzer sahifani tepadan pastga o'qiydi. Avval tugma paydo bo'lsin, keyin skript uni topadi.", 'Почему в конце? Браузер читает страницу сверху вниз. Сначала пусть появится кнопка, потом скрипт её найдёт.', 'Why at the end? The browser reads the page from top to bottom. First the button appears, then the script finds it.'),
      L3("Odatda kodni alohida faylga yozamiz: script.js. Unda script tegiga src atributi qo'yiladi, ya'ni fayl nomi degani. Xuddi rasmdagi src kabi.", 'Обычно код пишут в отдельный файл — script.js. Тогда у тега script ставят атрибут src — имя файла. Как src у картинки.', 'Usually the code goes in a separate file, script.js. Then the script tag gets a src attribute, the file name. Just like src on an image.')
    ],
    help: [
      L3("Kodga qarang: body oxirida script tegi paydo bo'ladi.", 'Посмотри на код: в конце body появляется тег script.', 'Look at the code: a script tag appears at the end of body.'),
      L3("JavaScript script tegi ichida yoki src bilan ulangan alohida faylda yashaydi.", 'JavaScript живёт внутри тега script или в отдельном файле, подключённом через src.', 'JavaScript lives inside a script tag or in a separate file connected with src.'),
      L3("Xuddi kitob oxiridagi javoblar kabi: avval savollar, keyin ularning yechimi.", 'Как ответы в конце учебника: сначала задачи, потом их решения.', 'Like the answers at the back of a textbook: first the tasks, then their solutions.')
    ],
    ask: L3("JavaScript qayerga yozilishini kuzating", 'Смотри, куда пишут JavaScript', 'Watch where JavaScript goes'),
    askDone: L3("script — body oxirida, kod — script.js da", 'script — в конце body, код — в script.js', 'script at the end of body, code in script.js')
  },
  s5: {
    eyebrow: L3('Skript joyi', 'Место скрипта', 'Where the script goes'),
    say: L3("Kodi sahifasiga skriptni qo'yamiz. Uchta joy bor. Qaysi joyda skript tugmani topadi? Bosing.",
      'Поставим скрипт на страницу Коди. Есть три места. Где скрипт найдёт кнопку? Нажми.',
      'Let’s add the script to Kodi’s page. There are three places. Where will the script find the button? Tap.'),
    ask: L3("script tegini qayerga qo'yamiz?", 'Куда поставить тег script?', 'Where should the script tag go?'),
    wrong: {
      head: L3("Bu joyda skript sahifadan oldin ishga tushadi. Tugma hali yo'q, skript uni topa olmaydi.", 'Здесь скрипт запустится раньше страницы. Кнопки ещё нет, скрипт её не найдёт.', 'Here the script runs before the page. The button isn’t there yet, so the script can’t find it.'),
      mid: L3("Skript tugmadan oldin turibdi. U ishlaganda tugma hali paydo bo'lmagan.", 'Скрипт стоит раньше кнопки. Когда он сработает, кнопки ещё не будет.', 'The script is before the button. When it runs, the button doesn’t exist yet.')
    },
    hints: [
      L3("Brauzer sahifani tepadan pastga o'qiydi. Skript tugmadan keyin turishi kerak.", 'Браузер читает страницу сверху вниз. Скрипт должен стоять после кнопки.', 'The browser reads the page top to bottom. The script must come after the button.'),
      L3("Eng pastki joyni tanlang: yopuvchi body tegidan oldin.", 'Выбери самое нижнее место — перед закрывающим тегом body.', 'Pick the lowest spot, before the closing body tag.'),
      L3("Uchinchi joyni bosing.", 'Нажми третье место.', 'Tap the third spot.')
    ],
    ok: L3("To'g'ri! body oxirida skript hamma narsadan keyin ishlaydi va tugmani topadi.", 'Верно! В конце body скрипт работает после всего и находит кнопку.', 'Right! At the end of body the script runs after everything and finds the button.')
  },
  s6: {
    eyebrow: L3('Faylni ulash', 'Подключи файл', 'Connect the file'),
    say: L3("Kodni alohida faylga yozdik. Endi uni sahifaga ulaymiz: src ichiga JavaScript faylining nomini yozing. Fayllar ro'yxati pastda.",
      'Код мы написали в отдельный файл. Теперь подключим его к странице: впиши в src имя файла JavaScript. Список файлов внизу.',
      'We wrote the code in a separate file. Now let’s connect it to the page: type the JavaScript file’s name into src. The file list is below.'),
    ask: L3("src ichiga JavaScript faylining nomini yozing", 'Впиши в src имя файла JavaScript', 'Type the JavaScript file’s name into src'),
    msgs: {
      empty: L3("Fayl nomini yozing.", 'Впиши имя файла.', 'Type the file name.'),
      css: L3("style.css bu CSS fayli, u ko'rinish uchun. Bizga JavaScript fayli kerak.", 'style.css — файл CSS, он для внешнего вида. Нам нужен файл JavaScript.', 'style.css is a CSS file, it’s for looks. We need the JavaScript file.'),
      html: L3("index.html bu sahifaning o'zi. JavaScript fayli boshqa.", 'index.html — это сама страница. Файл JavaScript другой.', 'index.html is the page itself. The JavaScript file is a different one.'),
      noExt: L3("Fayl nomi oxirida nuqta va js bo'ladi. Ro'yxatdagidek to'liq yozing.", 'В конце имени файла — точка и js. Напиши полностью, как в списке.', 'The file name ends with a dot and js. Type it in full, like in the list.'),
      other: L3("Bunday fayl yo'q. Fayllar ro'yxatiga qarang va nomni aynan o'shandek yozing.", 'Такого файла нет. Посмотри в список файлов и напиши имя точно так же.', 'There’s no such file. Look at the file list and type the name exactly the same.')
    },
    hints: [
      L3("Fayllar ro'yxatida JavaScript fayli qaysi?", 'Какой файл в списке — файл JavaScript?', 'Which file in the list is the JavaScript file?'),
      L3("JavaScript fayllari oxirida nuqta va js bo'ladi.", 'Файлы JavaScript заканчиваются на точку и js.', 'JavaScript files end with a dot and js.'),
      L3("script.js deb yozing.", 'Напиши script.js.', 'Type script.js.')
    ],
    ok: L3("Ulandi! Endi sahifa script.js faylini o'qiydi.", 'Подключено! Теперь страница читает файл script.js.', 'Connected! Now the page reads the script.js file.')
  },
  s7: {
    eyebrow: L3('Birinchi buyruq', 'Первая команда', 'The first command'),
    say: L3("Endi birinchi buyruq: console.log, ya'ni konsolga yozish degani. Qavs ichida, qo'shtirnoqda xabar yoziladi. Kuzating.",
      'Теперь первая команда: console.log — «написать в консоль». В скобках, в кавычках пишут сообщение. Смотри.',
      'Now the first command: console.log, “write to the console”. The message goes inside the brackets, in quotes. Watch.'),
    steps: [
      L3("Kodni ishga tushiraman. Sahifaga qarang: hech narsa o'zgarmadi! Xabar qayerda?", 'Запускаю код. Посмотри на страницу: ничего не изменилось! Где сообщение?', 'I run the code. Look at the page: nothing changed! Where’s the message?'),
      L3("Brauzerda yashirin oyna bor: konsol. Uni F12 tugmasi ochadi yoki sichqonchaning o'ng tugmasi, keyin Inspect va Console. Mana xabarimiz!", 'В браузере есть скрытое окно — консоль. Его открывает клавиша F12 или правая кнопка мыши, потом Inspect и Console. Вот наше сообщение!', 'The browser has a hidden window: the console. F12 opens it, or a right click, then Inspect and Console. Here’s our message!'),
      L3("Konsol dasturchining daftari. U yerga kod natijasini va xatolarni yozamiz. Saytga kirgan odam uni ko'rmaydi.", 'Консоль — тетрадь программиста. Туда пишут результаты кода и ошибки. Посетитель сайта её не видит.', 'The console is the programmer’s notebook. Code results and errors go there. A site visitor doesn’t see it.')
    ],
    help: [
      L3("Kuzating: kod ishladi, sahifa o'zgarmadi, xabar esa pastdagi konsolda.", 'Следи: код сработал, страница не изменилась, а сообщение — в консоли внизу.', 'Watch: the code ran, the page didn’t change, and the message is in the console below.'),
      L3("console.log xabarni sahifaga emas, konsolga yozadi.", 'console.log пишет сообщение не на страницу, а в консоль.', 'console.log writes the message not on the page but in the console.'),
      L3("Xuddi oshpazning qoralama daftari kabi: mehmonlar ko'rmaydi, lekin oshpaz u yerda hammasini tekshiradi.", 'Как черновик повара: гости его не видят, а повар проверяет там всё.', 'Like a chef’s rough notebook: guests don’t see it, but the chef checks everything there.')
    ],
    ask: L3("console.log qanday ishlashini kuzating", 'Смотри, как работает console.log', 'Watch how console.log works'),
    askDone: L3("console.log konsolga yozadi", 'console.log пишет в консоль', 'console.log writes to the console')
  },
  s8: {
    eyebrow: L3('Sizning xabaringiz', 'Твоё сообщение', 'Your message'),
    say: L3("Endi siz. Qo'shtirnoq ichiga istalgan so'z yozing va «Ishga tushirish» tugmasini bosing.",
      'Теперь ты. Напиши в кавычках любое слово и нажми «Запустить».',
      'Now you. Type any word inside the quotes and tap “Run”.'),
    ask: L3("Qo'shtirnoq ichiga so'z yozing va ishga tushiring", 'Напиши слово в кавычках и запусти', 'Type a word in the quotes and run'),
    msgs: {
      empty: L3("Qo'shtirnoq ichi bo'sh. Biror so'z yozing.", 'В кавычках пусто. Напиши какое-нибудь слово.', 'The quotes are empty. Type some word.'),
      quote: L3("Qo'shtirnoqlar allaqachon bor. Ichiga faqat so'z yozing.", 'Кавычки уже есть. Внутри напиши только слово.', 'The quotes are already there. Just type a word inside.')
    },
    hints: [
      L3("Kulrang joyga bosing va so'z yozing.", 'Нажми на серое место и напиши слово.', 'Tap the grey spot and type a word.'),
      L3("Masalan, ismingizni yoki Salom so'zini yozing.", 'Например, своё имя или слово «Привет».', 'For example, your name or the word Hello.'),
      L3("Salom deb yozing va «Ishga tushirish» ni bosing.", 'Напиши «Привет» и нажми «Запустить».', 'Type Hello and tap “Run”.')
    ],
    ok: L3("Zo'r! Konsolda sizning xabaringiz. Bu sizning birinchi JavaScript buyrug'ingiz!", 'Супер! В консоли — твоё сообщение. Это твоя первая команда на JavaScript!', 'Awesome! Your message is in the console. That’s your first JavaScript command!')
  },
  s9: {
    eyebrow: L3('Konsolda nima?', 'Что в консоли?', 'What’s in the console?'),
    say: L3("Konsolda nima chiqishini taxmin qiling. Keyin kod ishlaydi va tekshiramiz.",
      'Угадай, что появится в консоли. Потом код сработает, и проверим.',
      'Guess what will show up in the console. Then the code runs and we check.'),
    ask: L3("Konsolda nima chiqadi?", 'Что появится в консоли?', 'What will the console show?'),
    rounds: [
      { code: 'console.log("Kodi");', opts: ['"Kodi"', 'Kodi', 'err'], a: 1, why: L3("Qo'shtirnoqlar konsolga chiqmaydi, ular faqat matnning chegarasi.", 'Кавычки в консоль не выводятся — это только границы текста.', 'Quotes don’t show in the console; they only mark where the text starts and ends.') },
      { code: 'console.log(2 + 3);', opts: ['23', '2 + 3', '5'], a: 2, why: L3("Qo'shtirnoqsiz bu misol. JavaScript uni hisoblaydi: besh.", 'Без кавычек это пример. JavaScript его считает: пять.', 'Without quotes it’s a sum. JavaScript works it out: five.') },
      { code: 'console.log("2 + 3");', opts: ['2 + 3', '5', 'err'], a: 0, why: L3("Qo'shtirnoq ichida bu oddiy matn. JavaScript uni hisoblamaydi.", 'В кавычках это просто текст. JavaScript его не считает.', 'In quotes it’s just text. JavaScript doesn’t work it out.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Qo'shtirnoqqa qarang: ular bormi yoki yo'qmi?", 'Посмотри на кавычки: они есть или нет?', 'Look at the quotes: are they there or not?'),
    hint2: L3("Qo'shtirnoq ichidagi matn o'zgarmay chiqadi. Qo'shtirnoqsiz misolni JavaScript hisoblaydi.", 'Текст в кавычках выводится как есть. Пример без кавычек JavaScript считает.', 'Text in quotes comes out as is. JavaScript works out a sum without quotes.'),
    ok: L3("Barakalla! Matn va misolning farqini bildingiz.", 'Молодец! Теперь разница между текстом и примером понятна.', 'Well done! You know the difference between text and a sum.')
  },
  s10: {
    eyebrow: L3('Qizil xabarlar', 'Красные сообщения', 'Red messages'),
    say: L3("Kodda xato bo'lsa, konsol qizil xabar beradi. Qo'rqmang, bu yordam: u nima noto'g'ri va qaysi qatorda ekanini aytadi. Uchta misolni ko'ramiz.",
      'Если в коде ошибка, консоль показывает красное сообщение. Не бойся, это помощь: оно говорит, что не так и в какой строке. Посмотрим три примера.',
      'If the code has a mistake, the console shows a red message. Don’t worry, it’s help: it says what’s wrong and on which line. Let’s look at three examples.'),
    steps: [
      L3("Qo'shtirnoq unutildi. JavaScript Salom so'zini matn emas, nom deb o'yladi va uni topa olmadi. Xabar: Salom is not defined, ya'ni Salom topilmadi degani.", 'Забыли кавычки. JavaScript решил, что Salom — не текст, а имя, и не нашёл его. Сообщение: Salom is not defined — Salom не найден.', 'The quotes were forgotten. JavaScript thought Salom was a name, not text, and couldn’t find it. The message: Salom is not defined.'),
      L3("Bu yerda Console bosh harf bilan yozilgan. JavaScript katta va kichik harflarni farqlaydi: console faqat kichik harf bilan.", 'Здесь Console написан с большой буквы. JavaScript различает большие и маленькие буквы: console — только с маленькой.', 'Here Console is written with a capital letter. JavaScript tells capital and small letters apart: console is only lowercase.'),
      L3("Bu yerda yopuvchi qavs yo'q. Xabar shuni aytadi: missing qavs. O'ng tomonda esa qator raqami, ya'ni xato qayerda ekani degani.", 'Здесь нет закрывающей скобки. Сообщение так и говорит: missing скобка. А справа — номер строки, где ошибка.', 'Here the closing bracket is missing. The message says just that: missing bracket. And on the right is the line number where the mistake is.')
    ],
    help: [
      L3("Har bir qatorga va konsoldagi qizil xabarga qarang.", 'Смотри на каждую строку и красное сообщение в консоли.', 'Look at each line and the red message in the console.'),
      L3("Qizil xabar nima noto'g'riligini, o'ng tomondagi raqam esa qaysi qatorda ekanini aytadi.", 'Красное сообщение говорит, что не так, а номер справа — в какой строке.', 'The red message says what’s wrong, and the number on the right says which line.'),
      L3("Xuddi o'qituvchining qizil ruchkasi kabi: xatoni ko'rsatadi, siz uni tuzatasiz.", 'Как красная ручка учителя: показывает ошибку, а исправляешь ты.', 'Like a teacher’s red pen: it points out the mistake, and you fix it.')
    ],
    ask: L3("Qizil xabarlarni kuzating", 'Смотри на красные сообщения', 'Watch the red messages'),
    askDone: L3("Qizil xabar: nima va qaysi qatorda", 'Красное сообщение: что и в какой строке', 'Red message: what and on which line')
  },
  s11: {
    eyebrow: L3('Tuzating', 'Исправь', 'Fix it'),
    say: L3("Kodi xabar yozdi, lekin konsol qizil. Qatorni tuzating va ishga tushiring.",
      'Коди написал сообщение, но консоль красная. Исправь строку и запусти.',
      'Kodi wrote a message, but the console is red. Fix the line and run it.'),
    ask: L3("Salom so'zini qo'shtirnoqqa oling", 'Возьми слово Salom в кавычки', 'Put the word Salom in quotes'),
    msgs: {
      still: L3("Konsol yana qizil: so'z hali ham qo'shtirnoqsiz. Uni ikki tomondan qo'shtirnoq bilan o'rang.", 'Консоль снова красная: слово всё ещё без кавычек. Окружи его кавычками с двух сторон.', 'The console is red again: the word still has no quotes. Put quotes on both sides of it.'),
      half: L3("Bitta qo'shtirnoq yetmaydi: matn qo'shtirnoq bilan boshlanadi va tugaydi.", 'Одной кавычки мало: текст начинается и заканчивается кавычкой.', 'One quote isn’t enough: text starts and ends with a quote.'),
      other: L3("Konsolda boshqa qizil xabar chiqdi. Uni o'qing va faqat qo'shtirnoq qo'shing.", 'В консоли другое красное сообщение. Прочитай его и добавь только кавычки.', 'A different red message appeared. Read it and only add quotes.'),
      word: L3("Kod ishladi, lekin so'z boshqa. Salom so'zini qoldiring, faqat qo'shtirnoq qo'shing.", 'Код сработал, но слово другое. Оставь слово Salom, добавь только кавычки.', 'The code ran, but the word is different. Keep the word Salom and just add quotes.')
    },
    hints: [
      L3("Konsoldagi qizil xabarni o'qing: Salom is not defined.", 'Прочитай красное сообщение: Salom is not defined.', 'Read the red message: Salom is not defined.'),
      L3("Matn har doim qo'shtirnoq ichida bo'ladi. Pastdagi qo'shtirnoq tugmasi yordam beradi.", 'Текст всегда в кавычках. Кнопка кавычек внизу поможет.', 'Text is always in quotes. The quote key below will help.'),
      L3("So'zning oldiga va orqasiga qo'shtirnoq qo'ying.", 'Поставь кавычку перед словом и после него.', 'Put a quote before the word and after it.')
    ],
    ok: L3("Tuzatildi! Konsol endi qizil emas, xabar chiqdi.", 'Исправлено! Консоль больше не красная, сообщение вышло.', 'Fixed! The console isn’t red anymore, and the message is out.')
  },
  s12: {
    eyebrow: L3('Buzilgan qator', 'Сломанная строка', 'The broken line'),
    say: L3("Konsol xato qaysi qatorda ekanini aytadi. Qizil xabarga va o'ng tomondagi raqamga qarang, keyin buzilgan qatorni bosing.",
      'Консоль говорит, в какой строке ошибка. Посмотри на красное сообщение и номер справа, потом нажми сломанную строку.',
      'The console says which line has the mistake. Look at the red message and the number on the right, then tap the broken line.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    rounds: [
      { lines: L3(['console.log("Salom!");', 'console.lg("Men Kodiman");', 'console.log("Xayr!");'], ['console.log("Привет!");', 'console.lg("Я Коди");', 'console.log("Пока!");'], ['console.log("Hello!");', 'console.lg("I am Kodi");', 'console.log("Bye!");']), bad: 1, why: L3("Ikkinchi qatorda log o'rniga lg yozilgan.", 'Во второй строке вместо log написано lg.', 'On the second line lg is written instead of log.') },
      { lines: L3(['console.log("Bir");', 'console.log("Ikki");', 'Console.log("Uch");'], ['console.log("Раз");', 'console.log("Два");', 'Console.log("Три");'], ['console.log("One");', 'console.log("Two");', 'Console.log("Three");']), bad: 2, why: L3("Uchinchi qatorda Console bosh harf bilan.", 'В третьей строке Console с большой буквы.', 'On the third line Console has a capital letter.') }
    ],
    wrong: L3("Bu qator ishladi: uning xabari konsolda bor. Qizil xabar yonidagi raqamga qarang.", 'Эта строка сработала — её сообщение есть в консоли. Посмотри на номер у красного сообщения.', 'This line worked: its message is in the console. Look at the number next to the red message.'),
    right: L3("Topildi!", 'Есть!', 'Found it!'),
    hint1: L3("Qizil xabarning o'ng tomonida raqam bor. U qator raqami.", 'Справа у красного сообщения есть число. Это номер строки.', 'There’s a number on the right of the red message. It’s the line number.'),
    hint2: L3("Raqamni toping va koddagi o'sha qatorni bosing.", 'Найди число и нажми эту строку в коде.', 'Find the number and tap that line in the code.'),
    ok: L3("Ajoyib! Endi siz konsol yordamida xatoni topa olasiz.", 'Здорово! Теперь ты умеешь находить ошибку по консоли.', 'Awesome! Now you can find a mistake with the console.')
  },
  s13: {
    eyebrow: L3('Tartib', 'Порядок', 'Order'),
    say: L3("Kodi o'z kunini konsolda aytib bermoqchi, lekin qatorlar aralashib ketdi. Strelkalar bilan joyiga qo'ying: kod tepadan pastga ishlaydi.",
      'Коди хочет рассказать в консоли свой день, но строки перепутались. Поставь их на места стрелками: код работает сверху вниз.',
      'Kodi wants to tell his day in the console, but the lines got mixed up. Put them in place with the arrows: code runs from top to bottom.'),
    ask: L3("Qatorlarni to'g'ri tartibga qo'ying", 'Расставь строки по порядку', 'Put the lines in order'),
    lines: [L3("1. Uyg'ondim", '1. Проснулся', '1. Woke up'), L3('2. Nonushta qildim', '2. Позавтракал', '2. Had breakfast'), L3('3. Maktabga bordim', '3. Пошёл в школу', '3. Went to school')],
    hints: [
      L3("Konsolga qarang: xabarlar koddagi tartibda chiqadi.", 'Посмотри в консоль: сообщения выходят в порядке кода.', 'Look at the console: the messages come out in code order.'),
      L3("Birinchi raqamli qator eng tepada bo'lishi kerak.", 'Строка с номером один должна быть наверху.', 'The line with number one should be at the top.'),
      L3("Qatorlarni bir, ikki, uch tartibida qo'ying.", 'Расставь строки: один, два, три.', 'Arrange the lines: one, two, three.')
    ],
    ok: L3("Ajoyib! Kod tepadan pastga, qatorma-qator ishlaydi.", 'Отлично! Код работает сверху вниз, строка за строкой.', 'Excellent! Code runs from top to bottom, line by line.')
  },
  s14: {
    eyebrow: L3("Butun qator", 'Целая строка', 'A whole line'),
    say: L3("Endi butun qatorni o'zingiz yozing: console.log, qavslar, qo'shtirnoq va ichida xabar. Masalan, Men dasturchiman. Kerakli belgilar klaviatura ostida.",
      'Теперь напиши всю строку сам: console.log, скобки, кавычки и внутри сообщение. Например, «Я программист». Нужные знаки — под клавиатурой.',
      'Now write the whole line yourself: console.log, brackets, quotes and a message inside. For example, I am a programmer. The symbols you need are below.'),
    ask: L3("Butun qatorni yozing va ishga tushiring", 'Напиши всю строку и запусти', 'Write the whole line and run it'),
    msgs: {
      empty: L3("Qator bo'sh. console.log dan boshlang.", 'Строка пустая. Начни с console.log.', 'The line is empty. Start with console.log.'),
      ref: L3("Qo'shtirnoq yo'q: JavaScript so'zni nom deb o'yladi. Matnni qo'shtirnoqqa oling.", 'Нет кавычек: JavaScript принял слово за имя. Возьми текст в кавычки.', 'No quotes: JavaScript took the word for a name. Put the text in quotes.'),
      cap: L3("console kichik harf bilan yoziladi.", 'console пишется с маленькой буквы.', 'console is written in lowercase.'),
      fn: L3("Buyruq nomida xato bor: console nuqta log deb yozing.", 'В имени команды ошибка: напиши console точка log.', 'There’s a typo in the command: write console dot log.'),
      paren: L3("Yopuvchi qavs yetishmayapti.", 'Не хватает закрывающей скобки.', 'The closing bracket is missing.'),
      token: L3("Qo'shtirnoq yopilmagan yoki ortiqcha belgi bor.", 'Кавычка не закрыта или есть лишний знак.', 'A quote isn’t closed, or there’s an extra symbol.'),
      syntax: L3("JavaScript bu qatorni tushunmadi. Namunaga qarang: console, nuqta, log, qavs, qo'shtirnoqda matn, qavs.", 'JavaScript не понял эту строку. Сверься с образцом: console, точка, log, скобка, текст в кавычках, скобка.', 'JavaScript didn’t understand this line. Check the pattern: console, dot, log, bracket, text in quotes, bracket.'),
      noLog: L3("Kod ishladi, lekin konsolga hech narsa chiqmadi. console.log yozing.", 'Код сработал, но в консоль ничего не вышло. Напиши console.log.', 'The code ran, but nothing reached the console. Write console.log.')
    },
    hints: [
      L3("Qator console so'zi bilan boshlanadi.", 'Строка начинается со слова console.', 'The line starts with the word console.'),
      L3("Keyin nuqta, log, ochuvchi qavs, qo'shtirnoq ichida xabar va yopuvchi qavs.", 'Потом точка, log, открывающая скобка, сообщение в кавычках и закрывающая скобка.', 'Then a dot, log, an opening bracket, the message in quotes and a closing bracket.'),
      L3("Namunani ko'chirib yozing va ishga tushiring.", 'Перепиши образец и запусти.', 'Copy the example and run it.')
    ],
    sample: L3('console.log("Men dasturchiman!");', 'console.log("Я программист!");', 'console.log("I am a programmer!");'),
    ok: L3("Ajoyib! Butun qatorni o'zingiz yozdingiz va u ishladi!", 'Отлично! Вся строка написана тобой — и она работает!', 'Excellent! You wrote the whole line yourself, and it works!')
  },
  s15: {
    eyebrow: L3('Sizning dasturingiz', 'Твоя программа', 'Your program'),
    say: L3("Endi o'zingiz haqingizda kichik dastur. Uchta bo'sh joyni to'ldiring: ismingiz, sevimli o'yiningiz va tug'ilgan yilingiz. Oxirgisi raqam, qo'shtirnoqsiz: JavaScript yoshingizni o'zi hisoblaydi!",
      'Теперь маленькая программа о тебе. Заполни три пропуска: имя, любимую игру и год рождения. Последний — число, без кавычек: JavaScript сам посчитает твой возраст!',
      'Now a small program about you. Fill in three gaps: your name, your favorite game and your birth year. The last one is a number without quotes: JavaScript will work out your age by itself!'),
    ask: L3("Uchta bo'sh joyni to'ldiring va ishga tushiring", 'Заполни три пропуска и запусти', 'Fill in the three gaps and run'),
    pre: [L3('Salom! Mening ismim ', 'Привет! Меня зовут ', 'Hi! My name is '), L3("Sevimli o'yinim: ", 'Моя любимая игра: ', 'My favorite game: ')],
    ph: [L3('ism', 'имя', 'name'), L3("o'yin", 'игра', 'game'), L3('yil', 'год', 'year')],
    msgs: {
      empty: L3("Hamma bo'sh joylarni to'ldiring.", 'Заполни все пропуски.', 'Fill in all the gaps.'),
      quote: L3("Qo'shtirnoqlar allaqachon bor. Bo'sh joyga faqat so'z yozing.", 'Кавычки уже есть. В пропуск пиши только слово.', 'The quotes are already there. Just type a word in the gap.'),
      year: L3("Oxirgi joyga tug'ilgan yilingizni to'rtta raqam bilan yozing, qo'shtirnoqsiz.", 'В последний пропуск впиши год рождения четырьмя цифрами, без кавычек.', 'In the last gap, type your birth year in four digits, without quotes.')
    },
    hints: [
      L3("Birinchi ikkita joyga so'z, oxirgisiga raqam yozing.", 'В первые два пропуска — слова, в последний — число.', 'Words in the first two gaps, a number in the last one.'),
      L3("Raqamni qo'shtirnoqsiz yozamiz, shunda JavaScript uni hisoblaydi.", 'Число пишем без кавычек — тогда JavaScript его считает.', 'We write the number without quotes, so JavaScript calculates it.'),
      L3("Yil to'rtta raqamdan iborat bo'ladi.", 'Год — это четыре цифры.', 'A year is four digits.')
    ],
    ok: L3("Zo'r! Bu sizning birinchi dasturingiz. Konsol yoshingizni o'zi hisobladi!", 'Супер! Это твоя первая программа. Консоль сама посчитала твой возраст!', 'Awesome! This is your first program. The console worked out your age by itself!')
  },
  s16: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3("Kichik tekshiruv. Har bir gap to'g'rimi yoki noto'g'rimi? Bosing.",
      'Маленькая проверка. Каждое утверждение верно или нет? Нажимай.',
      'A little check. Is each statement true or false? Tap.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или нет?', 'True or false?'),
    rounds: [
      { q: L3("console.log xabarni sahifaga chiqaradi.", 'console.log выводит сообщение на страницу.', 'console.log shows the message on the page.'), a: false, why: L3("Yo'q, konsolga yozadi.", 'Нет, он пишет в консоль.', 'No, it writes to the console.') },
      { q: L3("JavaScript saytni jonlantiradi: bosilganda nimadir bo'ladi.", 'JavaScript оживляет сайт: при нажатии что-то происходит.', 'JavaScript brings a site to life: something happens on a press.'), a: true, why: L3("Ha, JavaScript saytning miyasi.", 'Да, JavaScript — мозг сайта.', 'Yes, JavaScript is the site’s brain.') },
      { q: L3("script tegi odatda body oxirida turadi.", 'Тег script обычно стоит в конце body.', 'The script tag usually sits at the end of body.'), a: true, why: L3("Ha, shunda skript sahifa tayyor bo'lgach ishlaydi.", 'Да, тогда скрипт работает, когда страница готова.', 'Yes, then the script runs once the page is ready.') },
      { q: L3('console.log(2 + 3) konsolga «2 + 3» deb yozadi.', 'console.log(2 + 3) пишет в консоль «2 + 3».', 'console.log(2 + 3) writes “2 + 3” to the console.'), a: false, why: L3("Yo'q, qo'shtirnoqsiz misol hisoblanadi: besh.", 'Нет, пример без кавычек считается: пять.', 'No, a sum without quotes gets worked out: five.') },
      { q: L3("Console.log va console.log bir xil.", 'Console.log и console.log — одно и то же.', 'Console.log and console.log are the same.'), a: false, why: L3("Yo'q, JavaScript katta va kichik harfni farqlaydi.", 'Нет, JavaScript различает большие и маленькие буквы.', 'No, JavaScript tells capital and small letters apart.') }
    ],
    right: L3("To'g'ri!", 'Верно!', 'Right!'),
    hint1: L3("Dars davomida ko'rganlaringizni eslang.", 'Вспомни, что было на уроке.', 'Remember what you saw in the lesson.'),
    hint2: L3("console.log konsolga yozadi, misol hisoblanadi, katta harf muhim.", 'console.log пишет в консоль, пример считается, большая буква важна.', 'console.log writes to the console, sums get worked out, capital letters matter.'),
    ok: L3("Ajoyib! Siz JavaScriptning birinchi qoidalarini bilasiz.", 'Отлично! Ты знаешь первые правила JavaScript.', 'Excellent! You know the first rules of JavaScript.')
  },
  s17: {
    eyebrow: L3('Xulosa', 'Итог', 'Summary'),
    say: [
      { k: 'riddle', text: L3("Esingizdami, men console.log Salom so'zini sahifaga chiqaradi degandim? Xato qilibman! console.log konsolga yozadi, ya'ni dasturchining daftariga degani. Sahifada hech narsa o'zgarmaydi.",
        'Помнишь, я говорил, что console.log выведет Salom на страницу? Я ошибся! console.log пишет в консоль — тетрадь программиста. На странице ничего не меняется.',
        'Remember when I said console.log would put Salom on the page? I was wrong! console.log writes to the console, the programmer’s notebook. Nothing changes on the page.') },
      { k: 'roles', text: L3("HTML nima borligini, CSS qanday ko'rinishini, JavaScript esa sayt nima qilishini aytadi.", 'HTML говорит, что есть, CSS — как выглядит, а JavaScript — что сайт делает.', 'HTML says what’s there, CSS how it looks, and JavaScript what the site does.') },
      { k: 'where', text: L3("JavaScript script tegida yashaydi: body oxirida yoki script.js faylida.", 'JavaScript живёт в теге script: в конце body или в файле script.js.', 'JavaScript lives in the script tag: at the end of body or in the script.js file.') },
      { k: 'errors', text: L3("Qizil xabar qo'rqinchli emas: u nima noto'g'ri va qaysi qatorda ekanini aytadi.", 'Красное сообщение не страшное: оно говорит, что не так и в какой строке.', 'A red message isn’t scary: it says what’s wrong and on which line.') },
      { k: null, text: L3("Barakalla! Siz birinchi dasturingizni yozdingiz. Keyingi darsda o'zgaruvchilar bilan tanishamiz: JavaScript ma'lumotni qanday eslab qoladi!",
        'Ура! Твоя первая программа готова. На следующем уроке познакомимся с переменными — как JavaScript запоминает данные!',
        'Hooray! You wrote your first program. Next lesson we’ll meet variables: how JavaScript remembers data!') }
    ],
    ask: L3("Birinchi dastur tayyor", 'Первая программа готова', 'The first program is ready'),
    roles: { riddle: L3("console.log — konsolga", 'console.log — в консоль', 'console.log goes to the console'), roles: L3('HTML · CSS · JS', 'HTML · CSS · JS', 'HTML · CSS · JS'),
      where: L3("script — body oxirida", 'script — в конце body', 'script at the end of body'), errors: L3("Qizil xabar — yordamchi", 'Красное сообщение — помощник', 'A red message is a helper') }
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { steps: 1, help: 1, hint1: 1, hint2: 1, hints: 1, why: 1, right: 1, rounds: 1, ok: 1, wrong: 1, msgs: 1, dead: 1, alive: 1, works: 1, riddle: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { q: 1, a: 1, code: 1, opts: 1, lines: 1, bad: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:j1-engine.jsx@*/

/*@FILE:j1-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css1/c1.css@*/
/*@FILE:j1.css@*/
`;
