// =============================================================================
// КУРС «CSS» · Урок 1 — «Что такое CSS и как он меняет сайт»
// (облик «Редактор», как уроки курса HTML; заказчик, 05.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css1/build.mjs → lessons/css/01-chto-takoe-css.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 1 · «Что такое CSS и как он меняет сайт» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (05.11.2026). Курс HTML пройден: ученик знает каркас, теги, атрибуты, свой сайт. Сайт Коди
// работает, но он чёрно-белый и скучный. «Превратить» — сайт раскрашивается, а HTML не изменился ни на букву:
// это CSS. Ученик узнаёт, где живёт CSS (тег style в head), из чего состоит правило (селектор, свойство,
// значение), что селектор выбирает, что красить, и что ломает правило. Загадка (без имён): Коди написал
// «h1 { color = orange; }» — как атрибут в HTML — и уверен, что сработает; в выводе признаёт ошибку.
//
// ДУГА (17 экранов; экрана плана нет). Типы заданий — по разделу 3а навыка:
//   s1 крючок (чёрно-белый сайт → «Превратить» → цвета; загадка)
//   где CSS:      s2 показ (style в head, первое правило) · s3 вписать цвет (Fill in the Blanks) · s4 HTML или CSS (Sort)
//   правило:      s5 показ «из чего состоит» · s6 собрать правило (Code Builder) · s7 часть ↔ название (Matching Pairs)
//   селектор:     s8 показ «что красит правило» · s9 вписать селектор (Fill in the Blanks) · s10 правило ↔ место на странице (Visual Code Mapping)
//   поломки:      s11 показ «=», нет «;», CSS без style · s12 исправить «=» (Debug & Fix) · s13 найти сломанное правило (Error Detective)
//   правило целиком: w1 написать «p { color: red; }» самому (перенос; заказчик, 05.11.2026: минимум 17 экранов)
//   своя страница: s14 свои цвета (Live Code Preview, «Готово»)
//   итог: q1 верно или нет (True / False) · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: CSS разбирается по-настоящему (селектор, «свойство: значение», «;»), а принимает ли
//     браузер значение — решает сам Chrome (CSS.supports). Неверное значение, «=» вместо «:», пропущенная «;» —
//     правило не действует, как в настоящем браузере; CSS без тега style — просто текст на странице.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы; в речи нет символов —
//     «ikki nuqta», «nuqtali vergul», «jingalak qavs».
//
// СИСТЕМА СЛОВ: qoida — правило; selektor — селектор (draft); xususiyat — свойство (draft); qiymat — значение
// (как в уроке 4 HTML); ikki nuqta — двоеточие; nuqtali vergul — точка с запятой; jingalak qavs — фигурная
// скобка (draft); ko'rinish — внешний вид. В речи CSS, style, color, background-color и имена цветов —
// по-английски (правка речи в build.mjs).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-01-chto-takoe-css',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: "1-dars. CSS nima va u saytni qanday o'zgartiradi",
    ru: 'Урок 1. Что такое CSS и как он меняет сайт',
    en: 'Lesson 1. What CSS is and how it changes a site'
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
  next: L3('Bezash uchun elementni qanday tanlash', 'Как выбрать элемент для стилизации', 'How to pick an element to style'),
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
  // Сайт Коди — содержимое страницы в браузере (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    hello: L3('Salom! Bu mening saytim.', 'Привет! Это мой сайт.', 'Hi! This is my site.'),
    hobby: L3("Men futbol va shaxmatni yaxshi ko'raman.", 'Я люблю футбол и шахматы.', 'I love football and chess.'),
    games: L3("Kodining o'yinlari", 'Игры Коди', 'Kodi’s games'),
    news: L3("Bugun yangi o'yin qo'shildi.", 'Сегодня добавилась новая игра.', 'A new game was added today.'),
    colorsH: L3('Ranglar', 'Цвета', 'Colors'),
    bgH: L3('Fon ranglari', 'Цвета фона', 'Background colors'),
    names: L3({ blue: "ko'k", green: 'yashil', red: 'qizil', purple: 'binafsha', orange: "to'q sariq", lightyellow: 'och sariq', lightblue: "och ko'k", pink: 'pushti', lavender: 'lavanda', white: 'oq', black: 'qora' },
      { blue: 'синий', green: 'зелёный', red: 'красный', purple: 'фиолетовый', orange: 'оранжевый', lightyellow: 'светло-жёлтый', lightblue: 'голубой', pink: 'розовый', lavender: 'лавандовый', white: 'белый', black: 'чёрный' },
      { blue: 'blue', green: 'green', red: 'red', purple: 'purple', orange: 'orange', lightyellow: 'light yellow', lightblue: 'light blue', pink: 'pink', lavender: 'lavender', white: 'white', black: 'black' })
  },
  s1: {
    eyebrow: L3('Zerikarli sayt', 'Скучный сайт', 'A boring site'),
    say: L3("Salom! HTML kursida biz sayt yasashni o'rgandik. Mana mening saytim: sarlavha bor, matn bor, hammasi ishlaydi. Lekin qarang, u juda zerikarli: hammasi oq va qora. Xo'sh, uni qanday chiroyli qilamiz? «Aylantirish» tugmasini bosing.",
      'Привет! В курсе HTML мы научились делать сайты. Вот мой сайт: есть заголовок, есть текст, всё работает. Но смотри, он очень скучный: всё белое и чёрное. Ну и как сделать его красивым? Нажми «Превратить».',
      'Hi! In the HTML course we learned to build sites. Here’s my site: it has a heading, it has text, everything works. But look, it’s really boring: everything is black and white. So how do we make it pretty? Tap “Transform”.'),
    magic: L3("Voy! Sarlavha to'q sariq bo'ldi, matn yashil, fon esa och sariq. Sayt jonlandi!", 'Ого! Заголовок стал оранжевым, текст — зелёным, а фон — светло-жёлтым. Сайт ожил!', 'Whoa! The heading turned orange, the text green, and the background light yellow. The site came alive!'),
    magicP: L3("Eng qizig'i shundaki, HTML kodida birorta harf ham o'zgarmadi. Ranglarni boshqa til berdi. Uning nomi CSS.", 'Самое интересное: в HTML-коде не изменилось ни одной буквы. Цвета дал другой язык. Его зовут CSS.', 'The coolest part: not a single letter changed in the HTML code. The colors came from another language. It’s called CSS.'),
    done: L3("Bugun CSS nima ekanini bilib olasiz va o'z sahifangizni ranglarga bo'yaysiz. Lekin oldin kichik topishmoq. Men sarlavhani o'zim bo'yamoqchi bo'ldim. HTML'da atributni teng belgisi bilan yozardik-ku. Shuning uchun men ham h1 uchun color teng orange deb yozdim. Menimcha, sarlavha endi to'q sariq bo'ladi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты узнаешь, что такое CSS, и раскрасишь свою страницу. Но сначала маленькая загадка. Я хотел покрасить заголовок сам. В HTML атрибут мы писали через знак «равно», правда? Поэтому я и для h1 написал color равно orange. По-моему, заголовок теперь станет оранжевым. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll find out what CSS is and color your own page. But first, a little riddle. I wanted to color the heading myself. In HTML we wrote attributes with an equals sign, right? So for h1 I wrote color equals orange. I think the heading will turn orange now. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("CSS saytga ko'rinish beradi", 'CSS даёт сайту внешний вид', 'CSS gives a site its look')
  },
  s2: {
    eyebrow: L3('CSS qayerda turadi', 'Где живёт CSS', 'Where CSS lives'),
    help: [
      L3("Kodga qarang: HTML teglari bor, keyin head ichida style tegi paydo bo'ladi. Brauzerga qarang: style ichida qoida paydo bo'lganda sarlavha bo'yaladi.", 'Посмотри на код: есть теги HTML, а потом внутри head появляется тег style. Посмотри в браузер: когда в style появляется правило, заголовок окрашивается.', 'Look at the code: there are HTML tags, then a style tag appears inside head. Look at the browser: when a rule appears in style, the heading gets colored.'),
      L3("HTML sahifada nima borligini aytadi: sarlavha, matn, rasm. CSS esa ular qanday ko'rinishini aytadi. CSS head ichidagi style tegida yashaydi.", 'HTML говорит, что есть на странице: заголовок, текст, картинка. А CSS — как они выглядят. CSS живёт в теге style внутри head.', 'HTML says what’s on the page: a heading, text, a picture. CSS says how they look. CSS lives in the style tag inside head.'),
      L3("Uy qurilganda avval devorlar quriladi, keyin ular bo'yaladi. HTML bu devorlar, CSS esa bo'yoq.", 'Когда строят дом, сначала ставят стены, потом их красят. HTML — это стены, а CSS — краска.', 'When a house is built, the walls go up first, then they get painted. HTML is the walls, CSS is the paint.')
    ],
    say: L3("Keling, sirni ochamiz. HTML sahifada nima borligini aytadi: sarlavha, matn, rasm. CSS esa ular qanday ko'rinishini aytadi, ya'ni rangi, o'lchami va joyi degani. Qarang, CSS qayerga yoziladi.",
      'Давай раскроем секрет. HTML говорит, что есть на странице: заголовок, текст, картинка. А CSS говорит, как они выглядят, то есть их цвет, размер и место. Смотри, куда пишется CSS.',
      'Let’s reveal the secret. HTML says what’s on the page: a heading, text, a picture. CSS says how they look: their color, size and place. Watch where CSS is written.'),
    sayStyle: L3("CSS kodi style tegi ichiga yoziladi. style esa head ichida turadi, xuddi title kabi. Hozircha sahifada hech narsa o'zgarmadi, chunki style ichi bo'sh.",
      'CSS пишут внутри тега style. А style стоит внутри head, как и title. Пока на странице ничего не изменилось: style пустой.',
      'CSS goes inside the style tag. And style sits inside head, just like title. Nothing changed on the page yet: style is empty.'),
    sayRule: L3("Endi style ichiga bitta qoida yozamiz: sarlavha uchun to'q sariq rang. Qarang, sarlavha bo'yaldi! HTML qatorlari esa o'sha-o'sha qoldi.",
      'Теперь напишем внутри style одно правило: оранжевый цвет для заголовка. Смотри, заголовок покрасился! А строки HTML остались прежними.',
      'Now let’s write one rule inside style: an orange color for the heading. Look, the heading got colored! And the HTML lines stayed the same.'),
    done: L3("Eslab qoling: HTML sahifada nima borligini aytadi, CSS esa u qanday ko'rinishini aytadi. CSS esa head ichidagi style tegida yashaydi.",
      'Запомни: HTML говорит, что есть на странице, а CSS — как это выглядит. И CSS живёт в теге style внутри head.',
      'Remember: HTML says what’s on the page, and CSS says how it looks. And CSS lives in the style tag inside head.'),
    askStart: L3("Qarang: HTML — nima bor, CSS — qanday ko'rinadi", 'Смотри: HTML — что есть, CSS — как выглядит', 'Watch: HTML is what’s there, CSS is how it looks'),
    askStyle: L3('Qarang: style tegi head ichida', 'Смотри: тег style в head', 'Watch: the style tag in head'),
    askRule: L3('Qarang: birinchi qoida', 'Смотри: первое правило', 'Watch: the first rule'),
    askDone: L3('CSS style tegi ichida yoziladi', 'CSS пишут в теге style', 'CSS is written in the style tag')
  },
  s3: {
    eyebrow: L3('Rangni yozing', 'Впиши цвет', 'Type the color'),
    say: L3("Endi navbat sizga. Sarlavhani ko'k qilamiz. Qoidada rang uchun joy bo'sh turibdi. Pastdagi ranglardan ko'kini toping va uning inglizcha nomini yozing. Yozgan zahotingiz brauzer o'zgaradi.",
      'Теперь твоя очередь. Сделаем заголовок синим. В правиле место для цвета пустое. Найди синий среди цветов внизу и впиши его английское название. Браузер изменится, как только напишешь.',
      'Now it’s your turn. Let’s make the heading blue. The spot for the color in the rule is empty. Find blue among the colors below and type its English name. The browser changes as soon as you type.'),
    msgs: {
      empty: L3("Ikki nuqtadan keyin rang nomini yozing.", 'Впиши название цвета после двоеточия.', 'Type the color name after the colon.'),
      notColor: L3("Brauzer bunday rangni bilmaydi. Rang nomini inglizcha, pastdagidek yozing.", 'Браузер не знает такого цвета. Напиши название по-английски, как внизу.', 'The browser doesn’t know that color. Type the name in English, as shown below.'),
      other: L3("Bu boshqa rang. Bizga ko'k kerak, inglizcha u blue bo'ladi.", 'Это другой цвет. Нам нужен синий, по-английски blue.', 'That’s a different color. We need blue.')
    },
    hints: [
      L3("Sarlavha qaysi rangda bo'lishi kerak?", 'Каким цветом должен стать заголовок?', 'What color should the heading be?'),
      L3("Rang nomi inglizcha yoziladi. Pastdagi ranglar ro'yxatiga qarang.", 'Название цвета пишут по-английски. Посмотри на список цветов внизу.', 'Color names are written in English. Look at the list of colors below.'),
      L3("Ko'k rang inglizcha blue bo'ladi. Uni ikki nuqtadan keyin yozing.", 'Синий по-английски — blue. Впиши его после двоеточия.', 'Blue is blue. Type it after the colon.')
    ],
    ok: L3("Zo'r! Sarlavha ko'k bo'ldi. Siz birinchi CSS qoidangizni yozdingiz!", 'Огонь! Заголовок стал синим. Ты написал свою первую строку CSS!', 'Awesome! The heading is blue. You wrote your first CSS!'),
    ask: L3("color qiymatiga ko'k rang nomini yozing", 'Впиши в color название синего цвета', 'Type the name of blue in color')
  },
  s4: {
    eyebrow: L3('HTML yoki CSS?', 'HTML или CSS?', 'HTML or CSS?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men sahifani o'zgartiraman. Siz esa oldin va keyinga qarab, nima o'zgarganini ayting: HTMLmi yoki CSSmi?",
      'Теперь проверь себя. Я буду менять страницу. А ты посмотри на «до» и «после» и скажи, что поменялось: HTML или CSS?',
      'Now check yourself. I’ll change the page. You look at “before” and “after” and say what changed: HTML or CSS?'),
    ask: L3("Nima o'zgardi: HTML yoki CSS?", 'Что поменялось: HTML или CSS?', 'What changed: HTML or CSS?'),
    html: L3('HTML', 'HTML', 'HTML'),
    css: L3('CSS', 'CSS', 'CSS'),
    before: L3('Oldin', 'До', 'Before'),
    after: L3('Keyin', 'После', 'After'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Oldin va keyinga qarang: matn o'zgardimi yoki faqat ko'rinish?", 'Посмотри на «до» и «после»: изменился текст или только внешний вид?', 'Look at before and after: did the text change, or only the look?'),
    hint2: L3("Matn va teglar HTML bo'ladi. Rang, fon va o'lcham CSS bo'ladi.", 'Текст и теги — это HTML. Цвет, фон и размер — это CSS.', 'Text and tags are HTML. Color, background and size are CSS.'),
    items: [
      { k: 'text', right: 'html',
        why: L3("Sarlavhaning so'zlari o'zgardi. So'zlar HTML ichida yoziladi, demak HTML o'zgardi.", 'Изменились слова заголовка. Слова пишут в HTML, значит, поменялся HTML.', 'The heading’s words changed. Words live in HTML, so HTML changed.') },
      { k: 'color', right: 'css',
        why: L3("So'zlar o'sha-o'sha, faqat rangi o'zgardi. Rangni CSS beradi.", 'Слова те же, изменился только цвет. Цвет даёт CSS.', 'The words are the same, only the color changed. CSS gives the color.') },
      { k: 'para', right: 'html',
        why: L3("Sahifaga yangi abzas qo'shildi. Yangi abzas uchun yangi p tegi kerak, bu HTML.", 'На странице появился новый абзац. Для него нужен новый тег p — это HTML.', 'A new paragraph appeared. It needs a new p tag, and that’s HTML.') },
      { k: 'bg', right: 'css',
        why: L3("Matn o'zgarmadi, sahifaning foni bo'yaldi. Fonni ham CSS beradi.", 'Текст не изменился, покрасился фон страницы. Фон тоже даёт CSS.', 'The text didn’t change; the page background got colored. CSS gives the background too.') }
    ],
    ok: L3("Hammasi to'g'ri! Endi HTML bilan CSSni farqlaysiz.", 'Всё верно! Теперь ты отличаешь HTML от CSS.', 'All correct! Now you can tell HTML from CSS.')
  },
  s5: {
    eyebrow: L3('Qoida nimadan iborat', 'Из чего правило', 'What a rule is made of'),
    help: [
      L3('Qoidaning qismlariga ketma-ket qarang: avval selektor, keyin figurali qavslar, ichida xususiyat, ikki nuqta va qiymat.', 'Посмотри на части правила по очереди: сначала селектор, потом фигурные скобки, внутри свойство, двоеточие и значение.', 'Look at the rule’s parts in order: first the selector, then the curly braces, inside them the property, a colon and the value.'),
      L3("Selektor qaysi tegni bezashni aytadi. Xususiyat nimani o'zgartirishni, qiymat esa qanday o'zgartirishni aytadi. Figurali qavslar qoidaning boshi va oxiri.", 'Селектор говорит, какой тег оформляем. Свойство — что меняем, значение — как меняем. Фигурные скобки — начало и конец правила.', 'The selector says which tag to style. The property says what to change, the value says how. The curly braces are the start and end of the rule.'),
      L3("Do'stingizga «Ali, futbolkangni qizil qil» desangiz: Ali bu selektor, futbolka xususiyat, qizil esa qiymat.", 'Скажи другу: «Али, сделай футболку красной». Али — это селектор, футболка — свойство, красная — значение.', 'Tell a friend: “Ali, make your T-shirt red.” Ali is the selector, the T-shirt is the property, red is the value.')
    ],
    say: L3("Keling, bitta qoidani bo'laklarga ajratamiz. U kichkina bo'lsa ham, har bir belgisi o'z ishini qiladi.", 'Давай разберём одно правило по частям. Оно маленькое, но у каждого знака своя работа.', 'Let’s take one rule apart. It’s small, but every sign has its job.'),
    sayTag: L3("Boshida selektor turadi, ya'ni qaysi tegni bezashimizni aytadigan so'z degani. Bu yerda u p, demak abzaslar bo'yaladi.", 'В начале стоит селектор, то есть слово, которое говорит, какой тег мы оформляем. Здесь это p, значит, покрасятся абзацы.', 'First comes the selector: the word that says which tag we style. Here it’s p, so the paragraphs get colored.'),
    sayBrace: L3("Keyin jingalak qavslar keladi. Ular qoidaning boshi va oxirini ko'rsatadi, xuddi ochuvchi va yopuvchi teg kabi.", 'Дальше идут фигурные скобки. Они показывают начало и конец правила, как открывающий и закрывающий тег.', 'Next come the curly braces. They show where the rule starts and ends, like an opening and a closing tag.'),
    sayProp: L3("Qavslar ichida xususiyat turadi, ya'ni nimani o'zgartirishimiz degani. color matn rangini o'zgartiradi.", 'Внутри скобок — свойство, то есть что мы меняем. color меняет цвет текста.', 'Inside the braces is the property: what we change. color changes the text color.'),
    sayVal: L3("Xususiyatdan keyin ikki nuqta, keyin qiymat keladi, ya'ni qanday qilib o'zgartirishimiz degani. Bu yerda u green, ya'ni yashil degani.", 'После свойства — двоеточие, а потом значение, то есть как именно мы меняем. Здесь это green, зелёный.', 'After the property comes a colon, then the value: how exactly we change it. Here it’s green.'),
    saySemi: L3("Oxirida nuqtali vergul turadi. U xususiyat tugaganini aytadi.", 'В конце стоит точка с запятой. Она говорит, что свойство закончилось.', 'At the end there’s a semicolon. It says the property is finished.'),
    done: L3("Demak, qoida shunday tuziladi: selektor, jingalak qavs, xususiyat, ikki nuqta, qiymat va nuqtali vergul.", 'Значит, правило устроено так: селектор, фигурная скобка, свойство, двоеточие, значение и точка с запятой.', 'So a rule goes like this: selector, curly brace, property, colon, value and semicolon.'),
    askStart: L3("Qarang: qoidaning bo'laklari", 'Смотри: части правила', 'Watch: the parts of a rule'),
    asks: {
      sel: L3('Qarang: selektor — qaysi teg', 'Смотри: селектор — какой тег', 'Watch: the selector, which tag'),
      brace: L3("Qarang: jingalak qavslar", 'Смотри: фигурные скобки', 'Watch: the curly braces'),
      prop: L3("Qarang: xususiyat — nimani o'zgartiramiz", 'Смотри: свойство — что меняем', 'Watch: the property, what we change'),
      val: L3('Qarang: ikki nuqta va qiymat', 'Смотри: двоеточие и значение', 'Watch: the colon and the value'),
      semi: L3('Qarang: nuqtali vergul', 'Смотри: точка с запятой', 'Watch: the semicolon')
    },
    labels: {
      sel: L3('selektor', 'селектор', 'selector'),
      brace: L3('jingalak qavslar', 'фигурные скобки', 'curly braces'),
      prop: L3('xususiyat', 'свойство', 'property'),
      val: L3('qiymat', 'значение', 'value'),
      semi: L3('nuqtali vergul', 'точка с запятой', 'semicolon')
    },
    askDone: L3("Selektor, xususiyat, qiymat", 'Селектор, свойство, значение', 'Selector, property, value')
  },
  s6: {
    eyebrow: L3("Qoidani yig'ing", 'Собери правило', 'Build the rule'),
    say: L3("Endi qoidani o'zingiz yig'ing. Qavslar ichi bo'sh. Bo'laklarni to'g'ri tartibda bosing yoki olib boring: oldin xususiyat, keyin ikki nuqta, keyin qiymat va nuqtali vergul.",
      'Теперь собери правило сам. Внутри скобок пусто. Нажимай или перетаскивай куски по порядку: сначала свойство, потом двоеточие, потом значение и точка с запятой.',
      'Now build the rule yourself. The braces are empty. Tap or drag the pieces in order: first the property, then the colon, then the value and the semicolon.'),
    why: {
      prop: L3("Qavslar ichida oldin xususiyat turadi: nimani o'zgartiramiz. Bu color.", 'Внутри скобок сначала стоит свойство: что меняем. Это color.', 'Inside the braces the property comes first: what we change. That’s color.'),
      colon: L3("Xususiyatdan keyin ikki nuqta qo'yiladi.", 'После свойства ставится двоеточие.', 'After the property comes a colon.'),
      val: L3("Ikki nuqtadan keyin qiymat keladi, ya'ni rang nomi degani.", 'После двоеточия идёт значение, то есть название цвета.', 'After the colon comes the value: the color name.'),
      semi: L3("Oxirida nuqtali vergul qo'yiladi.", 'В конце ставится точка с запятой.', 'At the end comes a semicolon.')
    },
    hints: [
      L3("Qoidaning bo'laklari esingizdami: nimani, qanday va qayerda tugaydi?", 'Вспомни части правила: что меняем, как и где кончается.', 'Remember the parts of a rule: what we change, how, and where it ends.'),
      L3("Tartib shunday: xususiyat, ikki nuqta, qiymat, nuqtali vergul.", 'Порядок такой: свойство, двоеточие, значение, точка с запятой.', 'The order is: property, colon, value, semicolon.'),
      L3("Yonib turgan bo'lakni bosing: u navbatdagi bo'lak.", 'Нажми горящий кусок: он следующий.', 'Tap the glowing piece: it’s the next one.')
    ],
    ok: L3("Ajoyib! Qoida yig'ildi va abzaslar yashil bo'ldi.", 'Отлично! Правило собрано, и абзацы стали зелёными.', 'Great! The rule is built and the paragraphs turned green.'),
    ask: L3("Bo'laklarni tartib bilan qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Endi qoidaning bo'laklarini nomlari bilan juftlang. Chapdan bo'lakni, o'ngdan uning vazifasini bosing.", 'Теперь соедини части правила с их названиями. Нажми часть слева, потом её работу справа.', 'Now match the parts of the rule with their names. Tap a part on the left, then its job on the right.'),
    cards: {
      sel: L3('selektor: qaysi tegni bezaymiz', 'селектор: какой тег оформляем', 'selector: which tag we style'),
      prop: L3("xususiyat: nimani o'zgartiramiz", 'свойство: что меняем', 'property: what we change'),
      val: L3("qiymat: qanday qilib o'zgartiramiz", 'значение: как меняем', 'value: how we change it')
    },
    why: {
      sel: L3("p bu teg nomi. U qaysi tegni bezashimizni aytadi, demak u selektor.", 'p — имя тега. Оно говорит, какой тег оформляем, значит, это селектор.', 'p is a tag name. It says which tag we style, so it’s the selector.'),
      prop: L3("color nimani o'zgartirishimizni aytadi: matn rangini. Demak u xususiyat.", 'color говорит, что меняем: цвет текста. Значит, это свойство.', 'color says what we change: the text color. So it’s the property.'),
      val: L3("green qanday qilib o'zgartirishimizni aytadi: yashil qilib. Demak u qiymat.", 'green говорит, как меняем: делаем зелёным. Значит, это значение.', 'green says how we change it: make it green. So it’s the value.')
    },
    pairOk: {
      sel: L3("To'g'ri, p selektor bo'ladi.", 'Верно, p — селектор.', 'Right, p is the selector.'),
      prop: L3("To'g'ri, color xususiyat bo'ladi.", 'Верно, color — свойство.', 'Right, color is the property.'),
      val: L3("To'g'ri, green qiymat bo'ladi.", 'Верно, green — значение.', 'Right, green is the value.')
    },
    pickFirst: L3("Oldin chapdan bo'lakni tanlang.", 'Сначала выбери часть слева.', 'First pick a part on the left.'),
    hints: [
      L3("Har bir bo'lak qoidada qayerda turibdi?", 'Где стоит каждая часть в правиле?', 'Where does each part sit in the rule?'),
      L3("Qavsdan oldin selektor, ikki nuqtadan oldin xususiyat, ikki nuqtadan keyin qiymat turadi.", 'Перед скобкой — селектор, перед двоеточием — свойство, после двоеточия — значение.', 'Before the brace is the selector, before the colon the property, after the colon the value.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Zo'r! Endi qoidaning har bir bo'lagini bilasiz.", 'Класс! Теперь ты знаешь каждую часть правила.', 'Great! Now you know every part of a rule.'),
    ask: L3("Bo'lakni, keyin uning vazifasini bosing", 'Нажми часть, потом её работу', 'Tap a part, then its job'),
    askPlace: L3("Endi uning vazifasini bosing", 'Теперь нажми её работу', 'Now tap its job')
  },
  s8: {
    eyebrow: L3("Qoida nimani bo'yaydi", 'Что красит правило', 'What a rule colors'),
    help: [
      L3("Selektorga va sahifaga qarang: selektor o'zgarganda sahifaning boshqa qismi bo'yaladi.", 'Посмотри на селектор и на страницу: меняется селектор — красится другая часть страницы.', 'Look at the selector and the page: when the selector changes, a different part of the page gets colored.'),
      L3("Selektorda qaysi teg yozilsa, qoida o'sha tegni bezaydi. body bu butun sahifa. Bir nechta qoida ketma-ket yoziladi.", 'Какой тег в селекторе, тот правило и оформляет. body — это вся страница. Несколько правил пишут одно за другим.', 'Whichever tag is in the selector, that’s what the rule styles. body is the whole page. Several rules are written one after another.'),
      L3("Sinfda «qizlar, turinglar» desangiz, faqat qizlar turadi. Selektor ham shunday: faqat aytilgan teglar o'zgaradi.", 'Если в классе сказать «девочки, встаньте», встанут только девочки. Селектор так же: меняются только названные теги.', 'Say “girls, stand up” in class and only the girls stand. A selector works the same way: only the named tags change.')
    ],
    say: L3("Selektor juda muhim: u qoida qaysi tegga ishlashini aytadi. Qarang, hozir selektor h1, shuning uchun faqat sarlavha to'q sariq.", 'Селектор очень важен: он говорит, к какому тегу относится правило. Смотри, сейчас селектор h1, поэтому оранжевый только заголовок.', 'The selector matters a lot: it says which tag the rule works on. Look, the selector is h1 now, so only the heading is orange.'),
    sayP: L3("Endi selektorni p ga almashtiramiz. Sarlavha qorayib qoldi, ikkala abzas esa to'q sariq bo'ldi.", 'Теперь заменим селектор на p. Заголовок снова чёрный, а оба абзаца стали оранжевыми.', 'Now we switch the selector to p. The heading is black again, and both paragraphs turned orange.'),
    sayBody: L3("Yana bitta qoida qo'shamiz: body uchun fon rangi. body butun sahifa, shuning uchun hamma joy och ko'k bo'ldi.", 'Добавим ещё одно правило: цвет фона для body. body — это вся страница, поэтому всё стало голубым.', 'Let’s add one more rule: a background color for body. body is the whole page, so everything turned light blue.'),
    done: L3("Demak, selektor qaysi teg bo'lsa, qoida o'sha tegni bezaydi. Bir nechta qoida esa ketma-ket yoziladi.", 'Значит, какой тег в селекторе — тот правило и оформляет. А несколько правил пишутся одно за другим.', 'So whatever tag is in the selector, that’s what the rule styles. And several rules are written one after another.'),
    askStart: L3('Qarang: selektor h1', 'Смотри: селектор h1', 'Watch: the selector h1'),
    askP: L3('Qarang: selektor p', 'Смотри: селектор p', 'Watch: the selector p'),
    askBody: L3('Qarang: body uchun qoida', 'Смотри: правило для body', 'Watch: a rule for body'),
    askDone: L3("Selektor qaysi tegni bezashni aytadi", 'Селектор говорит, какой тег оформить', 'The selector says which tag to style')
  },
  s9: {
    eyebrow: L3('Selektorni yozing', 'Впиши селектор', 'Type the selector'),
    say: L3("Endi abzaslarni binafsha rangga bo'yaymiz. Qoidada rang bor, lekin selektor yo'q. Qavsdan oldin abzasning teg nomini yozing.", 'Теперь покрасим абзацы в фиолетовый. Цвет в правиле есть, а селектора нет. Впиши перед скобкой имя тега абзаца.', 'Now let’s color the paragraphs purple. The rule has a color but no selector. Type the paragraph’s tag name before the brace.'),
    msgs: {
      empty: L3("Qavsdan oldin teg nomini yozing.", 'Впиши имя тега перед скобкой.', 'Type the tag name before the brace.'),
      h1: L3("h1 faqat sarlavhani bo'yadi. Bizga abzaslar kerak.", 'h1 покрасил только заголовок. Нам нужны абзацы.', 'h1 colored only the heading. We need the paragraphs.'),
      body: L3("body butun sahifani bo'yadi, sarlavhani ham. Bizga faqat abzaslar kerak.", 'body покрасил всю страницу, и заголовок тоже. Нам нужны только абзацы.', 'body colored the whole page, the heading too. We need only the paragraphs.'),
      brackets: L3("Selektorga burchakli qavslar kerak emas, faqat teg nomi yoziladi.", 'В селекторе угловые скобки не нужны, пишут только имя тега.', 'No angle brackets in a selector, just the tag name.'),
      other: L3("Sahifada bunday teg yo'q, shuning uchun hech narsa bo'yalmadi.", 'На странице нет такого тега, поэтому ничего не покрасилось.', 'There’s no such tag on the page, so nothing got colored.')
    },
    hints: [
      L3("Qaysi narsani bo'yashimiz kerak?", 'Что именно нужно покрасить?', 'What exactly should we color?'),
      L3("Abzas qaysi teg bilan yoziladi, esingizdami?", 'Помнишь, каким тегом пишут абзац?', 'Remember which tag makes a paragraph?'),
      L3("Abzas p tegi bo'ladi. Qavsdan oldin p deb yozing.", 'Абзац — это тег p. Впиши p перед скобкой.', 'A paragraph is the p tag. Type p before the brace.')
    ],
    ok: L3("Zo'r! Ikkala abzas ham binafsha bo'ldi, sarlavha esa o'zgarmadi.", 'Огонь! Оба абзаца стали фиолетовыми, а заголовок не изменился.', 'Awesome! Both paragraphs turned purple, and the heading didn’t change.'),
    ask: L3('Qavsdan oldin abzas tegining nomini yozing', 'Впиши перед скобкой имя тега абзаца', 'Type the paragraph tag’s name before the brace')
  },
  s10: {
    eyebrow: L3('Qoida qayerga ishlaydi', 'Куда работает правило', 'Where a rule works'),
    say: L3("Kodda uchta qoida bor. Bittasi yonib turadi. Sahifada u nimani bo'yaganini toping va o'sha joyni bosing.", 'В коде три правила. Одно горит. Найди на странице, что оно покрасило, и нажми туда.', 'There are three rules in the code. One is glowing. Find what it colored on the page and tap it.'),
    ask: L3("Yonib turgan qoida nimani bo'yadi? Bosing", 'Что покрасило горящее правило? Нажми', 'What did the glowing rule color? Tap it'),
    hint1: L3("Yonib turgan qoidaning selektoriga qarang: qavsdan oldingi so'z.", 'Посмотри на селектор горящего правила: слово перед скобкой.', 'Look at the glowing rule’s selector: the word before the brace.'),
    hint2: {
      h1: L3("h1 sahifadagi katta sarlavha bo'ladi.", 'h1 — это большой заголовок на странице.', 'h1 is the big heading on the page.'),
      p: L3("p sahifadagi abzaslar bo'ladi.", 'p — это абзацы на странице.', 'p is the paragraphs on the page.'),
      body: L3("body butun sahifa bo'ladi: uning foni matn orqasida turadi.", 'body — вся страница: её фон лежит позади текста.', 'body is the whole page: its background sits behind the text.')
    },
    hint3: {
      h1: L3("Bu qoida sarlavhani bo'yadi. Tepadagi sarlavhani bosing.", 'Это правило покрасило заголовок. Нажми заголовок наверху.', 'This rule colored the heading. Tap the heading at the top.'),
      p: L3("Bu qoida abzaslarni bo'yadi. Abzaslardan birini bosing.", 'Это правило покрасило абзацы. Нажми любой абзац.', 'This rule colored the paragraphs. Tap any paragraph.'),
      body: L3("Bu qoida sahifa fonini bo'yadi. Matn yo'q bo'sh joyni bosing.", 'Это правило покрасило фон страницы. Нажми на пустое место без текста.', 'This rule colored the page background. Tap an empty spot with no text.')
    },
    miss: {
      h1: L3("Bu joy sarlavha emas. Qoidaning selektori h1, u faqat sarlavhani bo'yaydi.", 'Это не заголовок. У правила селектор h1, оно красит только заголовок.', 'That’s not the heading. The selector is h1, so it colors only the heading.'),
      p: L3("Bu joy abzas emas. Qoidaning selektori p, u abzaslarni bo'yaydi.", 'Это не абзац. У правила селектор p, оно красит абзацы.', 'That’s not a paragraph. The selector is p, so it colors the paragraphs.'),
      body: L3("Bu joy matn. Qoidaning selektori body, u butun sahifaning fonini bo'yaydi.", 'Это текст. У правила селектор body, оно красит фон всей страницы.', 'That’s text. The selector is body, so it colors the whole page’s background.')
    },
    right: {
      h1: L3("To'g'ri! h1 qoidasi sarlavhani bo'yadi.", 'Верно! Правило h1 покрасило заголовок.', 'Right! The h1 rule colored the heading.'),
      p: L3("To'g'ri! p qoidasi abzaslarni bo'yadi.", 'Верно! Правило p покрасило абзацы.', 'Right! The p rule colored the paragraphs.'),
      body: L3("To'g'ri! body qoidasi sahifa fonini bo'yadi.", 'Верно! Правило body покрасило фон страницы.', 'Right! The body rule colored the page background.')
    },
    ok: L3("Ajoyib! Siz qoida qayerga ishlashini ko'ra olasiz.", 'Отлично! Ты видишь, куда работает правило.', 'Great! You can see where a rule works.')
  },
  s11: {
    eyebrow: L3('Qoida buzilsa', 'Когда правило ломается', 'When a rule breaks'),
    help: [
      L3('Har safar kodga qarang: ikki nuqta bormi, nuqtali vergul bormi, qoida style ichidami? Keyin sahifaga qarang.', 'Каждый раз смотри на код: есть ли двоеточие, точка с запятой, стоит ли правило внутри style? Потом на страницу.', 'Each time, look at the code: is there a colon, a semicolon, is the rule inside style? Then look at the page.'),
      L3('Xususiyat va qiymat orasida ikki nuqta, xususiyatlar orasida nuqtali vergul turadi. CSS esa faqat style tegi ichida ishlaydi.', 'Между свойством и значением — двоеточие, между свойствами — точка с запятой. А CSS работает только внутри тега style.', 'A colon goes between the property and the value, a semicolon between properties. And CSS only works inside the style tag.'),
      L3("Telefon raqamida bitta raqam xato bo'lsa, qo'ng'iroq bo'lmaydi. CSS da ham bitta belgi xato bo'lsa, qoida ishlamaydi.", 'Если в номере телефона ошибиться на одну цифру, звонок не пройдёт. В CSS так же: ошибка в одном знаке — правило не работает.', 'One wrong digit in a phone number and the call won’t go through. In CSS too: one wrong symbol and the rule won’t work.')
    ],
    say: L3("CSS juda aniq tilni yaxshi ko'radi. Bitta belgi xato bo'lsa, brauzer qoidani tashlab yuboradi. Keling, uchta xatoni ko'ramiz.", 'CSS любит точность. Ошибся в одном знаке — и браузер просто пропускает правило. Посмотрим на три ошибки.', 'CSS loves precision. Get one sign wrong and the browser just skips the rule. Let’s look at three mistakes.'),
    sayEq: L3("Birinchisi: ikki nuqta o'rniga teng belgisi. Qarang, sarlavha bo'yalmadi. CSSda xususiyat va qiymat o'rtasida faqat ikki nuqta turadi.", 'Первая: знак «равно» вместо двоеточия. Смотри, заголовок не покрасился. В CSS между свойством и значением стоит только двоеточие.', 'The first: an equals sign instead of a colon. Look, the heading didn’t get colored. In CSS only a colon goes between the property and the value.'),
    saySemi: L3("Ikkinchisi: ikki xususiyat o'rtasida nuqtali vergul unutildi. Endi brauzer ikkalasini ham tushunmadi: rang ham, fon ham yo'q.", 'Вторая: между двумя свойствами забыли точку с запятой. Теперь браузер не понял ни одно: нет ни цвета, ни фона.', 'The second: the semicolon between two properties was forgotten. Now the browser understood neither: no color, no background.'),
    sayNoStyle: L3("Uchinchisi: qoida style tegisiz, to'g'ri body ichiga yozildi. Brauzer uni CSS deb bilmaydi va oddiy matn qilib sahifaga chiqarib qo'ydi.", 'Третья: правило написали без тега style, прямо в body. Браузер не считает его CSS и просто вывел на страницу как текст.', 'The third: the rule was written without the style tag, right inside body. The browser doesn’t treat it as CSS and just shows it on the page as text.'),
    done: L3("Demak, ikki nuqtani, nuqtali vergulni va style tegini doim tekshiring.", 'Значит, всегда проверяй двоеточие, точку с запятой и тег style.', 'So always check the colon, the semicolon and the style tag.'),
    askEq: L3("Qarang: teng belgisi o'rniga ikki nuqta kerak", 'Смотри: нужно двоеточие, а не «равно»', 'Watch: it needs a colon, not an equals sign'),
    askSemi: L3("Qarang: nuqtali vergul yo'q", 'Смотри: нет точки с запятой', 'Watch: no semicolon'),
    askNoStyle: L3("Qarang: style tegi yo'q", 'Смотри: нет тега style', 'Watch: no style tag'),
    askDone: L3('Ikki nuqta, nuqtali vergul, style tegi', 'Двоеточие, точка с запятой, тег style', 'Colon, semicolon, style tag')
  },
  s12: {
    eyebrow: L3('Belgini tuzating', 'Исправь знак', 'Fix the sign'),
    say: L3("Voy, men yana teng belgisini yozibman! Sarlavha bo'yalmayapti. Teng belgisini o'chirib, uning o'rniga to'g'ri belgini yozing.", 'Ой, я опять написал знак «равно»! Заголовок не красится. Сотри «равно» и напиши вместо него правильный знак.', 'Oops, I wrote the equals sign again! The heading won’t color. Erase the equals sign and type the right sign instead.'),
    msgs: {
      eq: L3("Bu hali ham teng belgisi. Uni strelkali tugma bilan o'chiring, keyin ikki nuqta qo'ying.", 'Это всё ещё знак «равно». Сотри его кнопкой со стрелкой и поставь двоеточие.', 'That’s still the equals sign. Erase it with the arrow button and put a colon instead.'),
      semi: L3("Bu nuqtali vergul, u xususiyatni tugatadi. Xususiyat va qiymat o'rtasida esa ikki nuqta turadi.", 'Это точка с запятой, она заканчивает свойство. А между свойством и значением стоит двоеточие.', 'That’s a semicolon; it ends a property. Between the property and the value goes a colon.'),
      empty: L3("Bo'sh joyga bitta belgi yozing.", 'Впиши в пустое место один знак.', 'Type one sign in the empty spot.'),
      other: L3("Bu belgi to'g'ri emas. Xususiyat va qiymat o'rtasida ikki nuqta turadi.", 'Этот знак не подходит. Между свойством и значением стоит двоеточие.', 'That sign doesn’t fit. A colon goes between the property and the value.')
    },
    hints: [
      L3("Darsdagi to'g'ri qoida esingizdami: color va rang o'rtasida qaysi belgi turardi?", 'Вспомни правильное правило из урока: какой знак стоял между color и цветом?', 'Remember the correct rule: which sign sat between color and the color?'),
      L3("Bu ikkita nuqta bir-birining ustida turadigan belgi.", 'Это знак из двух точек одна над другой.', 'It’s the sign with two dots, one above the other.'),
      L3("Avval strelkali tugma bilan teng belgisini o'chiring. Keyin ikki nuqta tugmasini va Tekshirishni bosing.", 'Сначала сотри «равно» кнопкой со стрелкой. Потом нажми кнопку с двоеточием и «Проверить».', 'First erase the equals sign with the arrow button. Then tap the colon button and Check.')
    ],
    ok: L3("Ajoyib! Sarlavha to'q sariq bo'ldi. Endi qoida to'g'ri yozilgan.", 'Отлично! Заголовок стал оранжевым. Теперь правило написано верно.', 'Great! The heading turned orange. Now the rule is written correctly.'),
    ask: L3("Teng belgisi o'rniga to'g'ri belgini yozing", 'Напиши вместо «равно» правильный знак', 'Type the right sign instead of the equals sign')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va xato qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми сломанное правило.', 'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi boshqa qoida buzildi. Qaysi biri?", 'Класс, первая ошибка найдена! Теперь сломалось другое правило. Какое?', 'Great, the first bug is found! Now another rule broke. Which one?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning rangi ko'rinib turibdi. Qaysi narsa bo'yalmadi?", 'Это правило работает: его цвет виден на странице. Что не покрасилось?', 'This rule works: its color shows on the page. What didn’t get colored?'),
    found: {
      typo: L3("Topdingiz! Xususiyat nomida harf yetishmayapti: color o'rniga colr. Brauzer bunday xususiyatni bilmaydi.", 'Нашёл! В имени свойства не хватает буквы: colr вместо color. Браузер не знает такого свойства.', 'Found it! The property name is missing a letter: colr instead of color. The browser doesn’t know that property.'),
      colon: L3("Topdingiz! Xususiyat va qiymat o'rtasida ikki nuqta yo'q edi.", 'Нашёл! Между свойством и значением не было двоеточия.', 'Found it! There was no colon between the property and the value.')
    },
    hint1: L3("Sahifaga qarang: nima bo'yalmay qoldi?", 'Посмотри на страницу: что осталось не покрашенным?', 'Look at the page: what stayed uncolored?'),
    hint2: {
      typo: L3("Abzaslar qora qoldi. p qoidasidagi xususiyat nomini harfma-harf tekshiring.", 'Абзацы остались чёрными. Проверь буква в букву имя свойства в правиле p.', 'The paragraphs stayed black. Check the property name in the p rule letter by letter.'),
      colon: L3("Sarlavha qora qoldi. h1 qoidasida xususiyat va qiymat o'rtasidagi belgiga qarang.", 'Заголовок остался чёрным. Посмотри на знак между свойством и значением в правиле h1.', 'The heading stayed black. Look at the sign between the property and the value in the h1 rule.')
    },
    hint3: {
      typo: L3("Xato p qoidasida: colr. O'sha qatorni bosing.", 'Ошибка в правиле p: colr. Нажми эту строку.', 'The bug is in the p rule: colr. Tap that line.'),
      colon: L3("Xato h1 qoidasida: ikki nuqta yo'q. O'sha qatorni bosing.", 'Ошибка в правиле h1: нет двоеточия. Нажми эту строку.', 'The bug is in the h1 rule: no colon. Tap that line.')
    },
    ok: L3("Ajoyib! Ikkala xato ham topildi. Siz CSSni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь CSS как настоящий программист.', 'Super! Both bugs are found. You check CSS like a real programmer.')
  },
  // Перенос: правило целиком своими руками (заказчик, 05.11.2026: в уроке минимум 17 экранов).
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi eng qiziq qismi: qoidani boshidan oxirigacha o'zingiz yozasiz. Hamma abzaslarni qizil qiling. Selektor, jingalak qavslar, xususiyat, ikki nuqta, qiymat va nuqtali vergul kerak bo'ladi. Yozganingiz zahoti brauzer o'zgaradi.",
      'А теперь самое интересное: правило целиком пишешь ты сам. Сделай все абзацы красными. Понадобятся селектор, фигурные скобки, свойство, двоеточие, значение и точка с запятой. Браузер меняется сразу, как пишешь.',
      'Now the most interesting part: you write the whole rule yourself. Make all the paragraphs red. You’ll need a selector, curly braces, a property, a colon, a value and a semicolon. The browser changes as you type.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin jingalak qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      eq: L3("Bu yerda teng belgisi turibdi. CSSda xususiyat va qiymat o'rtasida ikki nuqta turadi.", 'Здесь стоит знак «равно». В CSS между свойством и значением стоит двоеточие.', 'There’s an equals sign here. In CSS a colon goes between the property and the value.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      noSel: L3("Qavsdan oldin selektor yo'q. Nimani bo'yashni yozing: abzas tegi p.", 'Перед скобкой нет селектора. Напиши, что красим: тег абзаца — p.', 'There’s no selector before the brace. Write what we color: the paragraph tag, p.'),
      sel: L3("Bu qoida boshqa narsani bo'yaydi. Bizga abzaslar kerak, ularning tegi p.", 'Это правило красит другое. Нам нужны абзацы, их тег — p.', 'This rule colors something else. We need the paragraphs; their tag is p.'),
      prop: L3("Matn rangini color xususiyati o'zgartiradi.", 'Цвет текста меняет свойство color.', 'The color property changes the text color.'),
      notColor: L3("Brauzer bunday rangni bilmaydi. Qizil inglizcha red bo'ladi.", 'Браузер не знает такого цвета. Красный по-английски — red.', 'The browser doesn’t know that color. Red is red in English.'),
      other: L3("Bu boshqa rang. Bizga qizil kerak, inglizcha red.", 'Это другой цвет. Нам нужен красный, по-английски red.', 'That’s a different color. We need red.')
    },
    hints: [
      L3("Qoida qanday tuzilardi, esingizdami? Oldin selektor, keyin jingalak qavslar.", 'Помнишь, как устроено правило? Сначала селектор, потом фигурные скобки.', 'Remember how a rule is built? First the selector, then the curly braces.'),
      L3("Abzas tegi p, matn rangi color, qizil esa red.", 'Тег абзаца — p, цвет текста — color, красный — red.', 'The paragraph tag is p, the text color is color, and red is red.'),
      L3("Namuna kod ostida paydo bo'ldi. Uni maydonga ko'chirib yozing va Tekshirishni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Siz CSS qoidasini butunlay o'zingiz yozdingiz. Hamma abzaslar qizil.", 'Отлично! Ты написал правило CSS целиком сам. Все абзацы красные.', 'Great! You wrote a whole CSS rule yourself. All the paragraphs are red.'),
    ask: L3("Hamma abzaslarni qizil qiladigan qoidani yozing", 'Напиши правило, которое сделает все абзацы красными', 'Write a rule that makes all the paragraphs red')
  },
  s14: {
    eyebrow: L3("O'z ranglaringiz", 'Свои цвета', 'Your own colors'),
    say: L3("Endi o'z sahifangizni bo'yang. Ikkita qoida tayyor, faqat ranglar bo'sh. Sarlavha uchun bitta rang, sahifa foni uchun boshqa rang yozing. Pastdagi ranglardan tanlashingiz mumkin. Keyin «Tayyor»ni bosing.",
      'Теперь раскрась свою страницу. Два правила готовы, пусты только цвета. Впиши один цвет для заголовка и другой — для фона страницы. Можно выбрать из цветов внизу. Потом нажми «Готово».',
      'Now color your own page. Two rules are ready; only the colors are empty. Type one color for the heading and another for the page background. You can pick from the colors below. Then tap “Done”.'),
    msgs: {
      empty: L3("Ikkala rangni ham yozing: sarlavha uchun va fon uchun.", 'Впиши оба цвета: для заголовка и для фона.', 'Type both colors: for the heading and for the background.'),
      space: L3("Rang nomida bo'sh joy bo'lmaydi: lightblue qo'shib yoziladi.", 'В названии цвета нет пробелов: lightblue пишут слитно.', 'Color names have no spaces: lightblue is one word.'),
      notColor: L3("Brauzer {w} degan rangni bilmaydi. Rang nomini inglizcha yozing, masalan pastdagilardan.", 'Браузер не знает цвета {w}. Напиши название по-английски, например из списка внизу.', 'The browser doesn’t know the color {w}. Type an English name, for example from the list below.'),
      same: L3("Sarlavha va fon bir xil rangda bo'lsa, sarlavha ko'rinmay qoladi. Boshqa-boshqa rang tanlang.", 'Если заголовок и фон одного цвета, заголовка не видно. Выбери разные цвета.', 'If the heading and the background are the same color, the heading disappears. Pick different colors.')
    },
    hints: [
      L3("Qaysi rang sizga yoqadi? Shuni yozing.", 'Какой цвет тебе нравится? Его и впиши.', 'Which color do you like? Type that.'),
      L3("Rang nomlari inglizcha yoziladi. Pastdagi ranglar ro'yxatiga qarang.", 'Названия цветов пишут по-английски. Посмотри на список цветов внизу.', 'Color names are written in English. Look at the list of colors below.'),
      L3("Masalan, sarlavhaga purple, fonga lavender yozing. Keyin «Tayyor»ni bosing.", 'Например, впиши purple для заголовка и lavender для фона. Потом нажми «Готово».', 'For example, type purple for the heading and lavender for the background. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning birinchi bezatilgan sahifangiz.", 'Ого, как красиво! Это твоя первая оформленная страница.', 'Wow, how pretty! This is your first styled page.'),
    ask: L3('Ikkita rangni yozing va «Tayyor»ni bosing', 'Впиши два цвета и нажми «Готово»', 'Type two colors and tap “Done”')
  },
  // ИТОГОВАЯ ПРОВЕРКА: новые случаи без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapni bo'laklab o'qing: u CSSning qaysi qismi haqida?", 'Прочитай фразу по частям: о какой части CSS она?', 'Read the sentence piece by piece: which part of CSS is it about?'),
    hint2: L3("Dars esingizdami: CSS ko'rinishni beradi, style tegi head ichida turadi, qoidada selektor, xususiyat, ikki nuqta va qiymat bo'ladi. Gap shunga mos keladimi?",
      'Вспомни урок: CSS даёт внешний вид, тег style стоит в head, в правиле есть селектор, свойство, двоеточие и значение. Фраза с этим совпадает?',
      'Remember the lesson: CSS gives the look, the style tag sits in head, a rule has a selector, a property, a colon and a value. Does the sentence match that?'),
    items: [
      { t: L3("CSS sahifaga yangi matn qo'shadi.", 'CSS добавляет на страницу новый текст.', 'CSS adds new text to the page.'), right: false,
        why: L3("Aslida matnni HTML qo'shadi. CSS faqat ko'rinishni o'zgartiradi: rang, fon, o'lcham.", 'На самом деле текст добавляет HTML. CSS меняет только внешний вид: цвет, фон, размер.', 'Actually HTML adds text. CSS only changes the look: color, background, size.') },
      { t: L3("Xususiyat va qiymat o'rtasiga ikki nuqta qo'yiladi.", 'Между свойством и значением ставится двоеточие.', 'A colon goes between the property and the value.'), right: true, code: 'ok',
        why: L3("Shunday: color, ikki nuqta, keyin rang nomi. Teng belgisi CSSda ishlamaydi.", 'Так и есть: color, двоеточие, потом название цвета. Знак «равно» в CSS не работает.', 'That’s right: color, a colon, then the color name. The equals sign doesn’t work in CSS.') },
      { t: L3("style tegi head ichida turadi.", 'Тег style стоит внутри head.', 'The style tag sits inside head.'), right: true, code: 'style',
        why: L3("To'g'ri: style ham, title ham head ichida turadi.", 'Верно: и style, и title стоят внутри head.', 'Right: both style and title sit inside head.') },
      { t: L3("p uchun yozilgan qoida sarlavhani ham bo'yaydi.", 'Правило для p красит и заголовок.', 'A rule for p colors the heading too.'), right: false, code: 'p',
        why: L3("Aslida p qoidasi faqat abzaslarni bo'yaydi. Sarlavha uchun h1 selektori kerak.", 'На самом деле правило p красит только абзацы. Для заголовка нужен селектор h1.', 'Actually the p rule colors only paragraphs. The heading needs the h1 selector.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz CSSning asosini yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь основы CSS.', 'All correct! You know the basics of CSS really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men h1 uchun color teng orange deb yozgan edim? Afsuski, men adashibman. CSSda xususiyat va qiymat o'rtasida teng belgisi emas, ikki nuqta turadi. Teng belgisi HTML atributlari uchun edi. Shuning uchun sarlavha bo'yalmadi.",
        'Вернёмся к загадке. Помнишь, я написал для h1 color равно orange? Увы, я ошибся. В CSS между свойством и значением стоит не «равно», а двоеточие. «Равно» было для атрибутов в HTML. Поэтому заголовок и не покрасился.',
        'Back to our riddle. Remember, I wrote color equals orange for h1? Sadly, I was wrong. In CSS a colon, not an equals sign, goes between the property and the value. The equals sign was for HTML attributes. That’s why the heading didn’t get colored.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning sahifangiz, o'zingiz tanlagan ranglar bilan!", 'Смотри, это твоя страница в цветах, которые ты выбрал сам!', 'Look, this is your page in the colors you picked yourself!'), k: null },
      { text: L3("CSS saytga ko'rinish beradi va style tegi ichida yoziladi.", 'CSS даёт сайту внешний вид и пишется в теге style.', 'CSS gives a site its look and is written in the style tag.'), k: 'style' },
      { text: L3("Selektor qaysi tegni bezashni aytadi.", 'Селектор говорит, какой тег оформить.', 'The selector says which tag to style.'), k: 'sel' },
      { text: L3("Xususiyat nimani o'zgartirishni, qiymat esa qanday o'zgartirishni aytadi.", 'Свойство говорит, что менять, а значение — как.', 'The property says what to change, and the value says how.'), k: 'prop' },
      { text: L3("Tabriklayman! Siz birinchi CSS darsini tugatdingiz. Keyingi darsda bezash uchun kerakli elementni aniq tanlashni o'rganamiz. Ko'rishguncha!", 'Ура! Ты прошёл первый урок CSS. На следующем уроке научимся точно выбирать элемент для оформления. До встречи!', 'Hooray! You finished your first CSS lesson. Next time we’ll learn to pick exactly the element we want to style. See you!'), k: null }
    ],
    roles: {
      style: L3("style — CSS uyi", 'style — дом для CSS', 'style — home of CSS'),
      sel: L3('selektor — qaysi teg', 'селектор — какой тег', 'selector — which tag'),
      prop: L3("xususiyat — nimani o'zgartiramiz", 'свойство — что меняем', 'property — what we change'),
      val: L3("qiymat — qanday", 'значение — как', 'value — how')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayStyle: 1, sayRule: 1, sayTag: 1, sayBrace: 1, sayProp: 1,
  sayVal: 1, saySemi: 1, sayP: 1, sayBody: 1, sayEq: 1, sayNoStyle: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c1-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c1.css@*/
`;
