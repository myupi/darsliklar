// =============================================================================
// КУРС «CSS» · Урок 4 — «Фон»
// (облик «Редактор», как уроки курса HTML; 05.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css4/build.mjs → lessons/css/04-fon.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Фон» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (05.11.2026). Уроки 1–3: правило, style в head, селекторы тег / .class / #id, цвета именем, hex, rgb (hsl только назван).
// Сайт футбольного клуба Коди — белый и скучный; Коди хочет, чтобы он был похож на стадион: сзади поле, текст
// на белых полосах. Ученик узнаёт: background-color красит фон любого элемента (не только body); background-image
// ставит картинку url("файл"); маленькая картинка сама повторяется плиткой; background-repeat: no-repeat — одна;
// background-size: cover — на весь фон; файл не нашёлся — виден цвет фона (запасной).
// Загадка (без имён): Коди написал «background-image: "maydon.jpg";» без url( ) и уверен, что картинка появится.
//
// ДУГА (19 экранов; упрощён 09.11.2026 по просьбе заказчика: всё оставить, но проще — повтор и размер разнесены,
// задание на cover отдельно; на объяснениях лампочка даёт помощь 1-2-3). Типы заданий — по разделу 3а навыка:
//   s1 крючок (белый сайт → поле за страницей, белые полосы под текстом; HTML не тронут; загадка)
//   фон элемента:  s2 показ (body → h1 → p) · s3 вписать белый фон заголовка (Fill) · s4 что покрасило правило (Visual Code Mapping)
//   картинка:      s5 показ (url, кавычки, плитка) · s6 собрать url("osmon.jpg") (Code Builder) · s7 какой код у страницы (выбор)
//   повтор:        s8 показ (плитка → no-repeat) · s9 вписать no-repeat (Fill)
//   размер:        s8b показ (большое небо с пустым местом → cover) · s9b вписать cover (Fill) · s10 плиткой или одна (Sort)
//   поломки:       s11 показ (без url, опечатка в имени файла, запасной цвет) · s12 вписать url( (Debug & Fix) · s13 найти сломанное правило (Error Detective)
//   w1 правило целиком (перенос, кнопка url() · s14 свой фон (Live, «Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: верная ли запись — решает сам Chrome (CSS.supports): «"maydon.jpg"» без url( ), «no repeat»
//     с пробелом — не принимаются. Картинки — файлы урока (FILES); имени нет среди файлов — картинки нет, виден цвет.
//     Маленькая картинка без no-repeat повторяется плиткой, как в браузере; фон body — на всё окно.
//   · Узбекский — по /uzbekcha; в речи нет символов: «qavs», «qo'shtirnoq», «chiziqcha».
//
// СИСТЕМА СЛОВ: fon — фон; fon rasmi — фоновая картинка (draft); takrorlanadi — повторяется; kafel kabi — плиткой
// (draft); zaxira rang — запасной цвет (draft); fayl nomi — имя файла. В речи background-color, background-image,
// background-repeat, background-size, url, no-repeat, cover — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-04-fon',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '4-dars. Fon',
    ru: 'Урок 4. Фон',
    en: 'Lesson 4. Backgrounds'
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
  next: L3('Matn va shriftlar', 'Текст и шрифты', 'Text and fonts'),
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

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card, site.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Страница Коди (не звучит).
  site: {
    title: L3('Kodi futbol klubi', 'Футбольный клуб Коди', 'Kodi Football Club'),
    p1: L3("Har shanba maydonda o'ynaymiz.", 'Каждую субботу играем на поле.', 'We play on the field every Saturday.'),
    p2: L3("Bizga qo'shiling!", 'Присоединяйся к нам!', 'Join us!'),
    files: L3('Fayllar', 'Файлы', 'Files'),
    tile: L3('Takrorlanadi', 'Плиткой', 'Tiled'),
    one: L3('Bitta', 'Одна', 'Just one'),
    names: {
      h1: L3('sarlavha', 'заголовок', 'heading'),
      p: L3('abzas', 'абзац', 'paragraph'),
      body: L3('butun sahifa', 'вся страница', 'the whole page')
    }
  },
  s1: {
    eyebrow: L3('Stadion kabi', 'Как стадион', 'Like a stadium'),
    say: L3("Salom! Mana, futbol klubimning sayti. Lekin qarang-chi, juda zerikarli chiqibdi: oppoq fon, ustida qora harflar, xolos. Men uni haqiqiy stadionga o'xshatmoqchiman: orqasida yam-yashil maydon bo'lsin! Qani, «Aylantirish» tugmasini bosing.",
      'Привет! Это сайт моего футбольного клуба. Но смотри, он совсем простой: белый фон и чёрные буквы. Хочу, чтобы он был похож на настоящий стадион, а сзади было зелёное поле. Нажми «Превратить».',
      'Hi! This is my football club’s site. But look, it’s very plain: a white background and black letters. I want it to look like a real stadium, with a green field behind it. Tap “Transform”.'),
    magic: L3("Voy, qarang! Sahifaning orqasida futbol maydoni paydo bo'ldi, sarlavha bilan matnning orqasi esa oppoq bo'lib qoldi.", 'Вот! За страницей появилось поле, а под заголовком и текстом белый фон.', 'There! A field appeared behind the page, and the heading and text have a white background.'),
    magicP: L3("Qizig'i shundaki, HTML kodiga umuman tegmadim. Hammasini CSS qildi: sahifaning orqasiga rasm qo'ydi, matnning orqasini esa oq rangga bo'yadi.", 'HTML я не трогал. Всё сделал CSS: поставил картинку позади страницы, а фон под текстом закрасил белым.', 'I didn’t touch the HTML. CSS did it all: it put a picture behind the page and painted the background behind the text white.'),
    done: L3("Bugun siz ham sahifaga fon berishni o'rganasiz: rang ham, rasm ham qo'yamiz. Maydonni qo'yayotganimda bir ish qildim: background-image deb yozdim-u, keyin qo'shtirnoq ichida faqat fayl nomini qoldirdim. Shuning o'zi yetadi, bunga ishonchim komil! Siz bo'lsangiz, shunday yozarmidingiz? Maydon chiqadimi-yo'qmi, buni dars davomida o'zingiz payqab qolasiz.",
      'Сегодня ты научишься работать с фоном: цветом и картинкой. Но сначала маленькая загадка. В первый раз я написал background-image, а после него просто имя файла в кавычках. По-моему, этого хватит. Как думаешь, картинка появится? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to work with backgrounds: colors and pictures. But first, a little riddle. The first time, I wrote background-image and then just the file name in quotes. I think that’s enough. What do you think, will the picture show up? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Orqada rasm, matn ostida oq fon", 'Сзади картинка, под текстом белый фон', 'A picture behind, white behind the text')
  },
  s2: {
    eyebrow: L3('Element foni', 'Фон элемента', 'An element’s background'),
    help: [
      L3("Kodga qarang: unda har safar bittadan yangi qator qo'shilyapti. Endi sahifaga ko'z tashlang, o'sha qator qaysi joyni bo'yadi?", 'В коде каждый раз добавляется новая строка. Посмотри на странице, что она покрасила.', 'Each time a new line is added to the code. Look at what it painted on the page.'),
      L3("Nimani bo'yashni selektor aytadi: body butun sahifani tanlaydi, h1 sarlavhani, p esa abzasni. background-color esa tanlangan narsaning orqasini bo'yaydi.", 'Селектор говорит, что красить: body — всю страницу, h1 — заголовок, p — абзац. background-color — их фон.', 'The selector says what to paint: body is the whole page, h1 the heading, p a paragraph. background-color is what’s behind them.'),
      L3("Daftardagi muhim gapni marker bilan bo'yaganmisiz? Harflar o'sha-o'sha qoladi, faqat orqasi rangli bo'ladi. background-color ham elementning orqasini xuddi shunday bo'yaydi.", 'Как выделить текст маркером в тетради: буквы те же, а под ними появляется цвет.', 'It’s like a highlighter in a notebook: the letters stay the same, but color appears behind them.')
    ],
    say: L3("Fon rangi sizga tanish-ku: body uchun background-color yozsak, butun sahifa bo'yaladi. Lekin fonni faqat sahifaga emas, istalgan elementga ham berish mumkin. Qani, ko'ramiz!",
      'Цвет фона ты уже знаешь: background-color для body красит всю страницу. Но фон можно дать любому элементу. Смотри.',
      'You already know background colors: background-color on body paints the whole page. But you can give a background to any element. Watch.'),
    sayH1: L3("Endi h1 uchun background-color yozdik. Ko'rdingizmi, sarlavhaning orqasida sariq chiziq paydo bo'ldi! U sahifaning butun eniga cho'zildi, chunki sarlavha o'z qatorini boshidan oxirigacha to'ldirib turadi.",
      'Теперь напишем background-color для h1. За заголовком появилась жёлтая полоса. Она тянется на всю ширину страницы, потому что заголовок занимает строку целиком.',
      'Now we write background-color for h1. A yellow strip appeared behind the heading. It stretches across the whole width of the page, because a heading takes up the entire line.'),
    sayP: L3("Abzaslarga ham xuddi shunday fon berdik: endi har bir abzasning orqasi oq. Sezdingizmi, harflarning rangi o'zgarmadi? Chunki harflarni color bo'yaydi, ularning orqasini esa background-color.",
      'С абзацами так же. Фон за каждым абзацем стал белым. А цвет текста не изменился: цвет букв задаёт color, а фон за ними — background-color.',
      'Same with paragraphs. Each paragraph got a white background. The text color didn’t change: color sets the letters, and background-color sets what’s behind them.'),
    done: L3("Demak, background-color qaysi element uchun yozilsa, o'shaning orqasini bo'yaydi: butun sahifanimi, sarlavhanimi yoki abzasnimi.", 'Значит, background-color красит фон элемента: всей страницы, заголовка или абзаца.', 'So background-color paints an element’s background: the whole page, a heading or a paragraph.'),
    askStart: L3('Qarang: butun sahifa foni', 'Смотри: фон всей страницы', 'Watch: the whole page’s background'),
    askH1: L3('Qarang: sarlavha foni', 'Смотри: фон заголовка', 'Watch: the heading’s background'),
    askP: L3('Qarang: abzaslar foni', 'Смотри: фон абзацев', 'Watch: the paragraphs’ background'),
    askDone: L3("background-color element orqasini bo'yaydi", 'background-color красит фон элемента', 'background-color paints an element’s background')
  },
  s3: {
    eyebrow: L3('Sarlavha foni', 'Фон заголовка', 'The heading’s background'),
    say: L3("Endi navbat sizga! Qarang, sahifa yashil, sarlavha esa unda yaxshi ko'rinmayapti. Sarlavhaning orqasini oq qilib qo'ying: background-color uchun rang yozing.",
      'Теперь твоя очередь. Страница зелёная, и заголовок на ней плохо видно. Сделай фон заголовка белым: впиши цвет для background-color.',
      'Now it’s your turn. The page is green, and the heading is hard to see on it. Make the heading’s background white: type the color for background-color.'),
    msgs: {
      empty: L3("Hali hech narsa yozilmadi. Bu yerga rang yozing, masalan, uning inglizcha nomini.", 'Впиши цвет, например его имя.', 'Type a color, for example its name.'),
      notColor: L3("Brauzer bu so'zni rang deb tanimadi. Rangning nomini yoki kodini bir tekshirib ko'ring.", 'Браузер не узнал в этом цвет. Проверь имя или код цвета.', 'The browser didn’t recognize that as a color. Check the color’s name or code.'),
      other: L3("Sarlavhaning orqasi boshqa rangga bo'yaldi-ku. Bizga oppoq fon kerak.", 'Получился другой цвет. Фон заголовка должен быть белым.', 'That’s a different color. The heading’s background should be white.')
    },
    hints: [
      L3("Oq rang inglizchada qanday aytiladi?", 'Как белый цвет называется по-английски?', 'What is white called in English?'),
      L3("Oq rangning inglizcha nomi white bo'ladi. Xohlasangiz, uni hex kod bilan ham yozsa bo'ladi.", 'Белый по-английски white. Его можно записать и hex-кодом.', 'White is called white. You can also write it as a hex code.'),
      L3("white so'zini yozing-da, «Tekshirish»ni bosing.", 'Впиши слово white и нажми «Проверить».', 'Type the word white and tap Check.')
    ],
    ok: L3("Zo'r! Endi sarlavha yashil sahifada yaqqol ko'rinib turibdi.", 'Огонь! Теперь заголовок хорошо видно на зелёной странице.', 'Awesome! Now the heading stands out on the green page.'),
    ask: L3("Sarlavha orqasini oq qiling", 'Сделай фон заголовка белым', 'Make the heading’s background white')
  },
  s4: {
    eyebrow: L3("Nimani bo'yadi?", 'Что покрасило?', 'What did it paint?'),
    say: L3("Endi bir o'yin o'ynaymiz! Kodda uchta qoida bor, men ulardan bittasini yoqib qo'yaman. Siz esa sahifadan o'sha qoida bo'yagan joyni topib, ustiga bosing.",
      'Теперь проверь себя. В коде три правила. Я подсвечу одно, а ты нажми на странице то, что оно покрасило.',
      'Now check yourself. There are three rules in the code. I’ll light one up, and you tap what it painted on the page.'),
    ask: L3("Yonib turgan qoida nimani bo'yadi? Sahifada bosing", 'Что покрасило горящее правило? Нажми на странице', 'What did the lit rule paint? Tap it on the page'),
    hint1: L3("Yonib turgan qoidaning boshiga, selektoriga qarang.", 'Посмотри на селектор горящего правила.', 'Look at the lit rule’s selector.'),
    hint2: L3("Esingizdami: body selektori butun sahifani, h1 sarlavhani, p esa abzasni tanlaydi.", 'body — это вся страница, h1 — заголовок, p — абзац.', 'body is the whole page, h1 is the heading, p is a paragraph.'),
    why: {
      p: L3("Bu qoida p uchun yozilgan, shuning uchun u abzaslarning orqasini bo'yaydi.", 'Это правило для p: оно красит фон абзацев.', 'This rule is for p: it paints the paragraphs’ background.'),
      body: L3("Bu qoida body uchun yozilgan, u butun sahifaning orqasini bo'yaydi. Sahifaning bo'sh joyini bosing.", 'Это правило для body: оно красит фон всей страницы. Нажми на пустое место страницы.', 'This rule is for body: it paints the whole page’s background. Tap an empty spot on the page.'),
      h1: L3("Qoidaning boshida h1 turibdi-ku, shuning uchun u sarlavhaning orqasini bo'yaydi.", 'Это правило для h1: оно красит фон заголовка.', 'This rule is for h1: it paints the heading’s background.')
    },
    got: L3("To'ppa-to'g'ri! Endi keyingi yonib turgan qoidaga qarang.", 'Верно! Смотри на следующее правило.', 'Right! Look at the next rule.'),
    ok: L3("Barakalla! Uchala qoidaning ham qayerni bo'yaganini topdingiz.", 'Молодец! Ты знаешь, какое правило что красит.', 'Well done! You know which rule paints what.')
  },
  s5: {
    eyebrow: L3('Fon rasmi', 'Картинка на фоне', 'A background picture'),
    help: [
      L3("Kod ostidagi fayllarga bir ko'z tashlang. Koddagi nom ulardan birining nomi bilan harfma-harf bir xil.", 'Посмотри на файлы внизу. Имя в коде — то же, что у одного из них.', 'Look at the files below. The name in the code matches one of them.'),
      L3("Fayl nomining oldida url so'zi turibdi-ku. U brauzerga «Rasmni mana shu fayldan ol», deb aytadi. Fayl nomi esa qavs ichida, qo'shtirnoqqa olib yoziladi.", 'url говорит браузеру, откуда взять файл. Имя файла пишется в скобках и в кавычках.', 'url tells the browser where to get the file. The file name goes in brackets and quotes.'),
      L3("Do'stingizdan «Stoldagi ko'k papkani olib kel», deb so'rasangiz, u darrov topib keladi, chunki aniq aytdingiz. url ham brauzerga faylni xuddi shunday aniq ko'rsatadi.", 'Как попросить друга: «принеси синюю папку со стола». Назовёшь точно — он найдёт.', 'It’s like asking a friend to bring the blue folder from the desk: name it exactly and they’ll find it.')
    ],
    say: L3("Endi eng qizig'iga o'tamiz: fonga rasm qo'yamiz! Buning uchun maxsus xususiyat bor: background-image, ya'ni fon rasmi degani. Qarang, pastda bir nechta fayl turibdi, ulardan birini olamiz.",
      'А теперь самое интересное: поставим на фон картинку. Для этого есть свойство background-image, то есть картинка фона. Внизу лежат файлы, возьмём один из них.',
      'Now the most interesting part: we put a picture on the background. There’s a property for that, background-image, meaning the background picture. The files are below; we’ll take one of them.'),
    sayUrl: L3("Endi kodga qarang: qiymat url so'zi bilan boshlandi, undan keyin qavs ichida qo'shtirnoqqa olingan fayl nomi turibdi. url brauzerga «Bu faylning manzili», deb aytadi.",
      'Значение начинается со слова url, потом в скобках и в кавычках пишется имя файла. url говорит браузеру, что это адрес файла.',
      'The value starts with the word url, then the file name goes in brackets and quotes. url tells the browser that this is a file’s address.'),
    sayTile: L3("Lekin qarang-chi: yulduzcha rasmi kichkina, sahifa esa katta. Shuning uchun brauzer rasmni kafel kabi qayta-qayta terib chiqib, butun fonni to'ldirdi.",
      'Смотри, звёздочка маленькая, а страница большая. Поэтому браузер повторил картинку плиткой и заполнил весь фон.',
      'Look, the star is small and the page is big. So the browser repeated the picture like tiles and filled the whole background.'),
    done: L3("Xullas, background-image fonga rasm qo'yadi. Unga url so'zi, qavs va qo'shtirnoq ichida fayl nomi kerak. Rasm kichik bo'lsa, o'zi takrorlanib ketadi.", 'Значит, background-image ставит на фон картинку: url, скобки, имя файла в кавычках. Маленькая картинка сама повторяется.', 'So background-image puts a picture on the background: url, brackets, the file name in quotes. A small picture repeats by itself.'),
    askStart: L3('Qarang: fon rasmi', 'Смотри: картинка на фоне', 'Watch: a background picture'),
    askUrl: L3("Qarang: url va fayl nomi", 'Смотри: url и имя файла', 'Watch: url and the file name'),
    askTile: L3("Qarang: rasm takrorlanadi", 'Смотри: картинка повторяется', 'Watch: the picture repeats'),
    askDone: L3("background-image: url, qavs, fayl nomi", 'background-image: url, скобки, имя файла', 'background-image: url, brackets, file name')
  },
  s6: {
    eyebrow: L3("Rasmni qo'ying", 'Поставь картинку', 'Add the picture'),
    say: L3("Endi url qiymatini o'zingiz yig'ib ko'ring! Sahifaning foniga osmon rasmini qo'yamiz. Bo'laklarni to'g'ri tartibda bosing yoki ushlab, joyiga olib boring.",
      'Теперь собери сам. Поставь на фон страницы картинку с небом. Нажимай или перетаскивай кусочки в правильном порядке.',
      'Now build it yourself. Put the sky picture on the page background. Tap or drag the pieces in the right order.'),
    why: {
      src: L3("Bu bo'lak ortiqcha: src atributi HTML kodidagi img teginiki edi. CSS kodida esa rasmni url bilan beramiz.", 'src был для тега img в HTML. В CSS картинку задают через url.', 'src was for the img tag in HTML. In CSS a picture is given with url.'),
      order: L3("Bo'laklar tartibi boshqacha bo'ladi: oldin url bilan ochuvchi qavs keladi, keyin qo'shtirnoqdagi fayl nomi, eng oxirida esa yopuvchi qavs.", 'Порядок другой: сначала url и открывающая скобка, потом имя файла в кавычках, в конце закрывающая скобка.', 'The order is different: first url and the opening bracket, then the file name in quotes, and the closing bracket last.')
    },
    hints: [
      L3("Fon rasmining qiymati qaysi so'z bilan boshlanar edi?", 'С какого слова начиналось значение?', 'Which word did the value start with?'),
      L3("Tartib shunday: url bilan ochuvchi qavs, keyin fayl nomi, oxirida yopuvchi qavs.", 'url, открывающая скобка, имя файла, закрывающая скобка.', 'url, the opening bracket, the file name, the closing bracket.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми горящий кусочек.', 'Tap the glowing piece.')
    ],
    ok: L3("Ajoyib! Sahifaning orqasida moviy osmon paydo bo'ldi.", 'Отлично! За страницей появилось небо.', 'Great! The sky appeared behind the page.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order')
  },
  s7: {
    eyebrow: L3('Qaysi kod?', 'Какой код?', 'Which code?'),
    say: L3("Bu safar sahifa tayyor, kodini esa siz topasiz. Fonga qarang-da, uni qaysi qoida berganini tanlang.", 'Теперь проверь себя. Я покажу страницу, а ты выбери, какой код её сделал.', 'Now check yourself. I’ll show a page, and you pick the code that made it.'),
    ask: L3("Bu fonni qaysi kod beradi?", 'Какой код даёт этот фон?', 'Which code makes this background?'),
    hint1: L3("Fonga yaxshilab qarang: u tekis rangmi yoki rasmmi?", 'Посмотри на фон: это цвет или картинка?', 'Look at the background: is it a color or a picture?'),
    hint2: L3("Tekis rang uchun background-color kerak bo'ladi, rasm uchun esa background-image va fayl nomi.", 'Для цвета нужен background-color, а для картинки — background-image и имя файла.', 'A color needs background-color, and a picture needs background-image and a file name.'),
    rounds: [
      { want: 'background-image: url("yulduz.png");', opts: ['background-color: gold;', 'background-image: url("yulduz.png");', 'background-image: url("futbol.png");'],
        why: L3("Fonda kichik yulduzchalar qayta-qayta takrorlanyapti, bu yulduz.png rasmi.", 'На фоне повторяются звёздочки, значит, это картинка yulduz.png.', 'Little stars repeat on the background, so it’s the picture yulduz.png.') },
      { want: 'background-color: skyblue;', opts: ['background-image: url("osmon.jpg");', 'background-color: skyblue;', 'background-color: navy;'],
        why: L3("Fon tekis och ko'k, hech qanday rasm yo'q, shuning uchun bu oddiy rang: skyblue.", 'Фон ровный голубой, картинки нет. Значит, это цвет skyblue.', 'The background is plain light blue with no picture. So it’s the color skyblue.') },
      { want: 'background-image: url("maydon.jpg");', opts: ['background-image: url("maydon.jpg");', 'background-color: green;', 'background-image: url("osmon.jpg");'],
        why: L3("Fonda futbol maydonining chiziqlari ko'rinib turibdi-ku, bu maydon.jpg rasmi.", 'На фоне видны линии поля, значит, это картинка maydon.jpg.', 'You can see the field lines, so it’s the picture maydon.jpg.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Qoyil! Fonga bir qarab, uni qaysi kod berganini aytib beryapsiz.", 'Всё верно! Ты умеешь читать код фона.', 'All correct! You can read background code.')
  },
  s8: {
    eyebrow: L3("Takrorlanmasin", 'Без повтора', 'No repeat'),
    say: L3("Kichik rasm o'zi takrorlanishini ko'rdingiz. Lekin bu har doim ham kerak bo'lavermaydi. Mana, hozir to'p rasmi butun fonga sochilib ketgan.", 'Маленькая картинка сама повторяется — это уже было. Но так нужно не всегда. Сейчас мячи заполнили весь фон.', 'You’ve seen that a small picture repeats by itself. But you don’t always want that. Right now the balls fill the whole background.'),
    sayOne: L3("Endi kodga yangi qator qo'shdik: background-repeat: no-repeat. no-repeat inglizchada «takrorlanmasin» degani. Qarang-chi: to'p bitta qoldi, tepadagi chap burchakda turibdi.", 'Добавляем строку background-repeat: no-repeat, то есть «не повторять». Теперь мяч только один, в левом верхнем углу.', 'We add a line, background-repeat: no-repeat, that is, “don’t repeat”. Now there’s only one ball, in the top left corner.'),
    done: L3("Demak, no-repeat rasmni bitta qoldiradi. U bo'lmasa, kichik rasm yana butun fonni to'ldirib tashlaydi.", 'Значит, no-repeat оставляет одну картинку. Без него маленькая картинка заполняет весь фон.', 'So no-repeat leaves just one picture. Without it a small picture fills the whole background.'),
    askStart: L3("Qarang: rasm takrorlanadi", 'Смотри: картинка повторяется', 'Watch: the picture repeats'),
    askOne: L3("no-repeat — rasm bitta", 'no-repeat — картинка одна', 'no-repeat: one picture'),
    askDone: L3("no-repeat — takrorlanmasin", 'no-repeat — не повторять', 'no-repeat: don’t repeat'),
    help: [
      L3("Kodda bitta yangi qator qo'shildi, u background-repeat qatori. Endi sahifadagi to'plarni sanab ko'ring-chi, nechta qoldi?", 'В коде добавилась одна строка — background-repeat. Посмотри, сколько мячей на странице.', 'One line was added to the code: background-repeat. Look at how many balls are on the page.'),
      L3("Nega bitta qoldi? Chunki repeat «takrorlansin» degani, no-repeat esa «takrorlanmasin». Diqqat qiling: no bilan repeat o'rtasida chiziqcha turadi.", 'repeat значит «повторять», а no-repeat — «не повторять». Между no и repeat дефис.', 'repeat means repeat, and no-repeat means don’t. There’s a hyphen between no and repeat.'),
      L3("Stikerlarni o'ylab ko'ring: ular bilan butun devorni qoplab tashlasa ham bo'ladi, bittasini yopishtirib qo'ysa ham. no-repeat esa brauzerga «Bittasini yopishtir», deb aytadi.", 'Как наклейки на стене: можно обклеить ими всю стену, а можно наклеить одну.', 'It’s like stickers on a wall: you can cover the whole wall with them, or stick just one.')
    ]
  },
  s8b: {
    eyebrow: L3("Butun fonga", 'На весь фон', 'The whole background'),
    say: L3("Endi katta osmon rasmini qo'ydik. U bitta, lekin sahifani to'liq qoplamayapti: yon tomonda ham, pastda ham bo'sh joy qolib ketdi. Qani, buni tuzatamiz.", 'Теперь большая картинка неба. Она одна, но не закрывает страницу целиком: сбоку и снизу осталось пустое место. Исправим.', 'Now a big sky picture. There’s one, but it doesn’t cover the whole page: there’s empty space at the side and below. Let’s fix it.'),
    sayCover: L3("Buning uchun background-size qatorini qo'shdik va unga cover deb yozdik. cover inglizchada «qoplamoq» degani. Ko'rdingizmi? Rasm kattalashib, butun fonni qoplab oldi, osmon endi hamma joyda!", 'Добавляем background-size: cover. cover значит «накрыть». Картинка выросла и накрыла весь фон. Теперь небо везде.', 'We add background-size: cover. cover means “cover it”. The picture grew and covered the whole background. Now the sky is everywhere.'),
    done: L3("Shunday qilib, cover rasmni butun fonga yoyadi, bo'sh joy qolmaydi.", 'Значит, cover растягивает картинку на весь фон, пустого места не остаётся.', 'So cover stretches the picture over the whole background, with no empty space left.'),
    askBig: L3("Qarang: bo'sh joy qoldi", 'Смотри: осталось пустое место', 'Watch: empty space is left'),
    askCover: L3("cover — butun fonga", 'cover — на весь фон', 'cover: the whole background'),
    askDone: L3("cover — butun fonni qoplaydi", 'cover — накрывает весь фон', 'cover covers the whole background'),
    help: [
      L3("Sahifaning o'ng chetiga va pastiga qarang: oldin u yerda bo'sh joy bor edi-ku.", 'Посмотри на правый край и низ страницы: сначала там было пустое место.', 'Look at the right side and the bottom of the page: at first there was empty space there.'),
      L3("Bo'sh joy qayoqqa ketdi deysizmi? background-size rasmning o'lchamini beradi, cover bo'lsa, rasm butun fonni qoplaguncha kattalashaveradi.", 'background-size задаёт размер картинки. cover — картинка растёт, пока не накроет весь фон.', 'background-size sets the picture’s size. cover makes it grow until it covers the whole background.'),
      L3("Stolga dasturxon yozilganini ko'rgansiz: dasturxon katta bo'lsa, stol butunlay yopiladi. cover ham rasmni fonga xuddi shunday yozib qo'yadi.", 'Как скатерть на столе: если она большая, стол закрыт целиком.', 'It’s like a tablecloth: when it’s big enough, the whole table is covered.')
    ]
  },
  s9: {
    eyebrow: L3("Bitta to'p", 'Один мяч', 'Just one ball'),
    say: L3("To'p rasmi yana butun fonni to'ldirib yuboribdi! Sahifada faqat bitta to'p qolsin: buning uchun background-repeat qiymatini yozing.", 'Мячи заполнили весь фон. Пусть мяч будет только один. Впиши значение для background-repeat.', 'The balls filled the whole background. Let there be just one ball. Type the value for background-repeat.'),
    msgs: {
      empty: L3("Qiymat yoziladigan joy hali bo'm-bo'sh-ku. Bu yerga background-repeat uchun qiymat kerak.", 'Впиши значение для background-repeat.', 'Type a value for background-repeat.'),
      space: L3("Oz qoldi! Faqat no bilan repeat o'rtasida bo'sh joy emas, chiziqcha turadi.", 'Между no и repeat не пробел, а дефис.', 'Between no and repeat there’s a hyphen, not a space.'),
      repeat: L3("repeat «takrorlansin» degani, shuning uchun to'plar yana ko'payib ketdi. Bizga esa «takrorlanmasin» degan qiymat kerak.", 'repeat значит «повторять», поэтому мячей снова много. Нужно «не повторять».', 'repeat means “repeat”, so there are many balls again. You need “don’t repeat”.'),
      other: L3("Brauzer bunday qiymatni bilmaydi. «Takrorlanmasin» inglizchada no-repeat bo'ladi.", 'Браузер не узнал это значение. «Не повторять» — это no-repeat.', 'The browser didn’t recognize that value. “Don’t repeat” is no-repeat.')
    },
    hints: [
      L3("«Takrorlanmasin» degan qiymat qanday yozilar edi?", 'Как было значение «не повторять»?', 'What was the value for “don’t repeat”?'),
      L3("U ikki so'zdan yasalgan: no va repeat, ularning o'rtasida chiziqcha turadi.", 'Оно из двух слов: no и repeat, между ними дефис.', 'It’s two words, no and repeat, with a hyphen between them.'),
      L3("no-repeat deb yozing-da, «Tekshirish»ni bosing.", 'Впиши no-repeat и нажми «Проверить».', 'Type no-repeat and tap Check.')
    ],
    ok: L3("Zo'r! Endi fonda yolg'iz bitta to'p qoldi.", 'Огонь! Теперь на фоне один мяч.', 'Awesome! Now there’s one ball on the background.'),
    ask: L3("Bitta to'p uchun qiymatni yozing", 'Впиши значение для одного мяча', 'Type the value for one ball')
  },
  s9b: {
    eyebrow: L3("Osmon hamma joyda", 'Небо везде', 'Sky everywhere'),
    say: L3("Osmonni ham o'zingiz tuzatib ko'ring! Qarang, osmon rasmi sahifani to'liq qoplamayapti. Rasm butun fonni qoplashi uchun background-size qatoriga kerakli so'zni yozing.", 'Теперь ты. Картинка неба не закрывает страницу целиком. Впиши такое значение для background-size, чтобы картинка накрыла весь фон.', 'Your turn. The sky picture doesn’t cover the whole page. Type a value for background-size so the picture covers the whole background.'),
    msgs: {
      empty: L3("Bo'sh joy hali bo'm-bo'sh turibdi. Rasm butun fonni qoplashi uchun bu yerga background-size qiymatini yozing.", 'Впиши значение для background-size.', 'Type a value for background-size.'),
      contain: L3("contain degan qiymat ham bor, lekin u rasmni butunligicha sig'diradi, shuning uchun bo'sh joy baribir qoladi. Bizga «qoplasin» degan so'z kerak.", 'contain тоже бывает, но он вмещает картинку целиком, и пустое место остаётся. Нужно слово «накрыть».', 'contain exists too, but it fits the whole picture in and leaves empty space. You need the word for “cover”.'),
      bad: L3("Brauzer bu so'zni tanimadi. «Butun fonni qoplasin» inglizchada cover bo'ladi.", 'Браузер не узнал это значение. «Накрыть весь фон» по-английски — cover.', 'The browser didn’t recognize that value. Covering the whole background is cover.'),
      other: L3("Rasm o'zgardi-yu, lekin fon hali ham to'liq yopilmadi. Rasm butun fonni qoplashi uchun boshqa so'z kerak.", 'Картинка изменилась, но фон накрыт не весь. Нужно слово «накрыть».', 'The picture changed, but the background isn’t fully covered. You need the word for “cover”.')
    },
    hints: [
      L3("Osmon butun fonni qoplashi uchun qaysi so'z kerak edi, esingizdami?", 'Какое слово нужно, чтобы картинка накрыла весь фон?', 'Which word makes the picture cover the whole background?'),
      L3("Bu so'z inglizchada «qoplamoq» degani, u besh harfli va c harfi bilan boshlanadi.", 'Это английское слово «накрыть», пять букв, начинается на c.', 'It’s the English word for that, five letters, starting with c.'),
      L3("cover deb yozing-da, «Tekshirish»ni bosing.", 'Впиши cover и нажми «Проверить».', 'Type cover and tap Check.')
    ],
    ok: L3("Mana endi osmon butun fonni qoplab oldi, bo'sh joy qolmadi!", 'Отлично! Небо накрыло весь фон.', 'Great! The sky covers the whole background.'),
    ask: L3("Rasm butun fonni qoplasin", 'Пусть картинка накроет весь фон', 'Make the picture cover the whole background')
  },
  s10: {
    eyebrow: L3('Takrorlanadimi?', 'Плиткой или одна?', 'Tiled or one?'),
    say: L3("Endi fonni ko'rmasdan, faqat kodga qarab topasiz: rasm takrorlanarmikin yoki bitta qolarmikin? Har bir kodni o'qing-da, javobni tanlang.", 'Теперь проверь себя. Я покажу код, а ты выбери: картинка будет плиткой или одна?', 'Now check yourself. I’ll show some code, and you choose: will the picture be tiled or just one?'),
    ask: L3("Rasm takrorlanadimi yoki bittami?", 'Картинка будет плиткой или одна?', 'Will the picture be tiled or just one?'),
    card: L3('body uchun kod', 'Код для body', 'Code for body'),
    hint1: L3("Kodga qarang-chi: unda background-repeat yoki background-size bormi?", 'Есть ли в коде background-repeat или background-size?', 'Does the code have background-repeat or background-size?'),
    hint2: L3("Agar hech narsa yozilmagan bo'lsa yoki repeat turgan bo'lsa, kichik rasm kafel kabi takrorlanadi. no-repeat esa rasmni bitta qoldiradi, cover bo'lsa, bitta rasmni butun fonga yoyadi.", "Если ничего не написано или написано repeat, маленькая картинка повторяется плиткой. no-repeat оставляет одну, cover растягивает одну на весь фон.", "If nothing is written, or repeat is written, a small picture repeats like tiles. no-repeat leaves one, and cover stretches one over the whole background."),
    items: [
      { code: 'background-image: url("yulduz.png");', right: 'tile', why: L3("Bu kodda takrorlash haqida hech narsa yozilmagan, shuning uchun kichik rasm o'z-o'zidan takrorlanadi.", 'Про повтор ничего не написано, поэтому маленькая картинка повторяется сама.', 'Nothing is written about repeating, so the small picture repeats by itself.') },
      { code: 'background-image: url("futbol.png");\nbackground-repeat: no-repeat;', right: 'one', why: L3("no-repeat «takrorlanmasin» degani, shuning uchun rasm bitta bo'ladi.", 'no-repeat значит «не повторять», значит, картинка одна.', 'no-repeat means “don’t repeat”, so there’s one picture.') },
      { code: 'background-image: url("futbol.png");\nbackground-repeat: repeat;', right: 'tile', why: L3("Bu yerda repeat ochiqdan-ochiq «takrorlansin» deb turibdi, rasm kafel kabi teriladi.", 'repeat значит «повторять», значит, картинка плиткой.', 'repeat means “repeat”, so the picture is tiled.') },
      { code: 'background-image: url("osmon.jpg");\nbackground-size: cover;', right: 'one', why: L3("cover bitta rasmni kattalashtirib, butun fonga yoyib qo'yadi.", 'cover растягивает одну картинку на весь фон.', 'cover stretches one picture over the whole background.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Juda zo'r! Endi rasm fonda qanday turishini kodning o'zidan bilib olasiz.", 'Всё верно! Ты заранее знаешь, как ляжет картинка.', 'All correct! You know in advance how the picture will look.')
  },
  s11: {
    eyebrow: L3('Rasm chiqmasa', 'Когда картинки нет', 'When the picture is missing'),
    help: [
      L3("Kodda har gal bittadan narsa o'zgaradi. Qizil bilan belgilangan joyga, keyin pastdagi fayllarga ko'z tashlang.", 'Каждый раз в коде меняется одна вещь. Посмотри на отмеченное красным и на файлы внизу.', 'Each time one thing changes in the code. Look at what’s marked in red and at the files below.'),
      L3("Brauzer tushunmagan qiymatni o'tkazib yuboradi, topa olmagan fayl o'rniga esa hech narsa chizmaydi. Shunday paytda fonda background-color rangi ko'rinib qoladi.", 'Ошибочное значение браузер выбрасывает, а вместо ненайденного файла ничего не рисует. Тогда виден background-color.', 'The browser throws out a wrong value, and draws nothing for a missing file. Then background-color shows.'),
      L3("Devorga osilgan rasmni o'ylab ko'ring: rasm tushib ketsa ham, devor bo'm-bo'sh qolmaydi, uning bo'yog'i ko'rinib turadi. Zaxira rang ham fonda xuddi o'sha bo'yoqdek turadi.", 'Как картина на стене: даже если картина упала, видна краска стены.', 'It’s like a painting on a wall: even if the painting falls, you still see the wall’s paint.')
    ],
    say: L3("Hozir stadionimiz joyida, maydon ko'rinib turibdi. Lekin ba'zan rasm chiqmay qoladi: yo brauzer kodni tushunmay, o'tkazib yuboradi, yo faylni topa olmaydi. Qani, ikkalasini ham ko'raylik, keyin sizni bitta yordamchi bilan tanishtiraman.", 'Бывает, картинка не появляется. Браузер выбрасывает ошибочный код или не находит файл. Давай посмотрим на две причины и одного помощника.', 'Sometimes the picture doesn’t show. The browser throws away bad code or can’t find the file. Let’s look at two reasons and one helper.'),
    sayNoUrl: L3("Oldin url so'zini olib tashladik, qo'shtirnoqda faqat fayl nomi turibdi. Ko'rdingizmi? Brauzer buni rasm deb tanimadi, fon bo'm-bo'sh bo'lib qoldi.", 'Первая: нет url, только имя файла в кавычках. Браузер не узнал в этом картинку, фон пустой.', 'The first: there’s no url, only the file name in quotes. The browser didn’t recognize it as a picture, so the background is empty.'),
    sayTypo: L3("Endi url joyiga qaytdi, lekin fayl nomidan bitta harf tushib qoldi. Pastdagi fayllarda bunday nom yo'q, shuning uchun rasm yana chiqmadi.", 'Вторая: в имени файла пропала буква. Среди файлов такого имени нет, поэтому картинки снова нет.', 'The second: a letter is missing from the file name. There’s no file with that name, so again there’s no picture.'),
    sayBackup: L3("Mana, va'da qilgan yordamchim: rasm bilan birga background-color ham yozib qo'ydik. Fayl topilmasa ham, brauzer shu yashil rangni ko'rsatadi, sahifa bo'sh qolmaydi. Bunday rang zaxira rang deyiladi.", 'А теперь помощник. Вместе с картинкой напишем и background-color. Если картинки нет, браузер покажет этот цвет. Это запасной цвет.', 'Now the helper. Along with the picture we also write background-color. If the picture isn’t found, the browser shows this color. It’s a backup color.'),
    done: L3("Demak, rasm chiqishi uchun url so'zi ham, to'g'ri fayl nomi ham kerak. Zaxira rang esa har ehtimolga qarshi sahifani bo'sh qoldirmaydi.", 'Значит, для картинки нужны url и верное имя файла, а запасной цвет не даст странице остаться пустой.', 'So a picture needs url and the right file name, and a backup color keeps the page from looking empty.'),
    askNoUrl: L3("Qarang: url yo'q", 'Смотри: нет url', 'Watch: no url'),
    askTypo: L3("Qarang: fayl nomida xato", 'Смотри: ошибка в имени файла', 'Watch: a typo in the file name'),
    askBackup: L3("Qarang: zaxira rang", 'Смотри: запасной цвет', 'Watch: a backup color'),
    askDone: L3("url, to'g'ri nom va zaxira rang", 'url, верное имя и запасной цвет', 'url, the right name and a backup color'),
    askStart: L3("Qarang: hammasi ishlayapti, maydon joyida", "Смотри: всё работает, поле на месте", "Watch: everything works, the field is there")
  },
  s12: {
    eyebrow: L3("url ni qo'ying", 'Поставь url', 'Add url'),
    say: L3("Voy, men yana url so'zini unutib qo'yibman! Shuning uchun maydon chiqmayapti. Qani, fayl nomining oldidagi bo'sh joyga kerakli so'zni va qavsni yozib bering.", 'Ой, я опять забыл url! Поле не появляется. Впиши в пустое место перед именем файла нужное слово и скобку.', 'Oops, I forgot url again! The field won’t show. Type the right word and bracket in the empty spot before the file name.'),
    msgs: {
      empty: L3("Fayl nomining oldi hali bo'sh. U yerga bitta so'z va qavs kerak.", 'Впиши перед именем файла слово и скобку.', 'Type a word and a bracket before the file name.'),
      paren: L3("Oz qoldi! So'zni to'g'ri topdingiz, faqat uning yoniga ochuvchi qavs ham qo'ying.", 'Слово верное, но рядом с ним нужна открывающая скобка.', 'The word is right, but it needs an opening bracket next to it.'),
      other: L3("Bunday yozuv bilan maydon chiqmaydi. Fayl nomining oldida url so'zi va ochuvchi qavs turishi kerak.", 'Так не работает. Перед именем файла стоят слово url и открывающая скобка.', 'That doesn’t work. The file name comes after the word url and an opening bracket.'),
      quote: L3("Qo'shtirnoq fayl nomining oldida allaqachon turibdi-ku. Siz faqat url so'zini va qavsni yozing.", "Кавычка уже стоит перед именем файла. Впиши только url и скобку.", "The quote is already before the file name. Type only url and the bracket.")
    },
    hints: [
      L3("Esingizdami, brauzer fayl manzilini qaysi so'zdan taniydi?", 'С какого слова начинается значение картинки?', 'Which word does a picture value start with?'),
      L3("Kerakli so'z url bo'ladi, undan keyin ochuvchi qavs keladi. Yopuvchi qavs esa kodda allaqachon bor.", 'Слово url и открывающая скобка. Закрывающая уже есть.', 'The word url and an opening bracket. The closing one is already there.'),
      L3("Pastdagi url tugmasini bosing-da, keyin «Tekshirish»ni bosing.", 'Нажми кнопку url внизу, потом «Проверить».', 'Tap the url button below, then Check.')
    ],
    ok: L3("Rahmat! Maydon joyiga qaytdi, stadionim yana tayyor!", 'Отлично! Поле вернулось.', 'Great! The field is back.'),
    ask: L3("Fayl nomi oldiga kerakli so'zni yozing", 'Впиши перед именем файла нужное слово', 'Type the right word before the file name')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Klub saytida yana muammo chiqibdi! Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga ham, fayllarga ham qarang-da, buzilgan qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и на файлы и нажми сломанное правило.', 'Now check yourself. There are three rules, but one doesn’t work. Look at the page and the files, and tap the broken rule.'),
    say2: L3("Osmon joyiga qaytdi! Lekin endi sahifada boshqa narsa buzilibdi. Qaysi qoida aybdor ekan, topa olasizmi?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoidada muammo yo'q, uning natijasi sahifada ko'rinib turibdi. Sahifadagi qaysi narsa joyida emas?", 'Это правило работает: его результат виден на странице. Что не появилось?', 'This rule works: you can see its result on the page. What didn’t show up?'),
    found: {
      file: L3("Topdingiz! Faylning nomi osmon.jpg ekan, kodda esa osmon.jpeg deb yozib qo'yilgan.", 'Есть! Файл называется osmon.jpg, а в коде написано osmon.jpeg.', 'Found it! The file is called osmon.jpg, but the code says osmon.jpeg.'),
      space: L3("Mana, aybdor qoida! no bilan repeat o'rtasida bo'sh joy turibdi, u yerda chiziqcha bo'lishi kerak edi.", 'Есть! Между no и repeat пробел, а нужен дефис.', 'Found it! There’s a space between no and repeat, but it should be a hyphen.')
    },
    hint1: L3("Sahifaga diqqat bilan qarang: nima chiqmay qolibdi yoki boshqacha chiqibdi?", 'Посмотри на страницу: что вышло не так, как ждали?', 'Look at the page: what didn’t come out as expected?'),
    hint2: {
      file: L3("Osmon chiqmay qolibdi. Koddagi fayl nomini pastdagi fayllar nomi bilan solishtirib ko'ring.", 'Неба нет. Сравни имя в коде с именем в файлах.', 'There’s no sky. Compare the name in the code with the name in the files.'),
      space: L3("To'plar takrorlanib ketibdi, lekin bitta bo'lishi kerak edi. background-repeat qiymatiga qarang.", 'Мячи повторяются, а должен быть один. Посмотри на значение background-repeat.', 'The balls repeat, but there should be one. Look at the background-repeat value.')
    },
    hint3: {
      file: L3("Buzilgan joy birinchi qoidada, osmon.jpeg nomida. Shu qatorni bosing.", 'Ошибка в первом правиле: osmon.jpeg. Нажми эту строку.', 'The bug is in the first rule: osmon.jpeg. Tap that line.'),
      space: L3("Oxirgi qoidaga qarang: unda no repeat bo'sh joy bilan yozilgan. Shu qatorni bosing.", 'Ошибка в последнем правиле: no repeat. Нажми эту строку.', 'The bug is in the last rule: no repeat. Tap that line.')
    },
    ok: L3("Mana, to'p ham bitta qoldi, klub sayti yana chiroyli bo'ldi! Endi rasm chiqmasa, fayl nomini ham, qiymatni ham tekshirib ko'rishni bilasiz.", 'Супер! Обе найдены. Ты проверяешь фон как настоящий дизайнер.', 'Super! Both are found. You check backgrounds like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Bu safar qoidaning hammasi sizdan: selektor ham, xususiyat ham, qiymat ham. Butun sahifaning foniga yulduzchalar qo'ying, ular yulduz.png faylida turibdi.", "Теперь напиши правило целиком сам. Поставь на фон всей страницы звёздочки из файла yulduz.png.", "Now write the whole rule yourself. Put stars from the file yulduz.png on the whole page background."),
    msgs: {
      empty: L3("Qoida hali yozilmadi. Esingizdami, u oldin selektordan boshlanadi, keyin jingalak qavslar ichida xususiyat va qiymat keladi.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Jingalak qavslarni unutmang: qoidaga ochuvchi ham, yopuvchi ham kerak.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymat o'rtasiga ikki nuqta qo'yilmabdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Butun sahifaning foni uchun body selektori kerak, qoidani shundan boshlang.", 'Для фона всей страницы нужен селектор body.', 'The whole page’s background needs the body selector.'),
      prop: L3("Fonga rasmni background-image xususiyati qo'yadi, shuni yozing.", 'Картинку фона задаёт свойство background-image.', 'The background-image property sets the background picture.'),
      noUrl: L3("Fayl nomining oldida url so'zi bilan qavs yo'q-ku. Ularsiz brauzer rasmni tanimaydi.", 'Перед именем файла нет слова url и скобки. Без них браузер не узнаёт картинку.', 'There’s no url and bracket before the file name. Without them the browser doesn’t recognize the picture.'),
      broken: L3("Qiymat chalkashib ketibdi. Qavslar bilan qo'shtirnoqlarni tekshirib chiqing: url, qavs, qo'shtirnoqdagi nom, yana qavs.", 'Браузер не узнал это значение. Проверь скобки и кавычки: url, скобка, имя в кавычках, скобка.', 'The browser didn’t recognize that value. Check the brackets and quotes: url, a bracket, the name in quotes, a bracket.'),
      noFile: L3("Pastdagi fayllarda bunday nom yo'q ekan. Nomni harfma-harf solishtirib ko'ring.", 'Среди файлов нет такого имени. Проверь имя буква в букву.', 'There’s no file with that name. Check the name letter by letter.'),
      other: L3("Bu boshqa rasm chiqdi-ku. Yulduzchalar yulduz.png faylida turibdi.", 'Это другая картинка. Файл со звёздочками — yulduz.png.', 'That’s a different picture. The stars file is yulduz.png.')
    },
    hints: [
      L3("Butun sahifani qaysi selektor tanlar edi? Fon rasmini-chi, qaysi xususiyat qo'yadi?", 'Каким селектором выбирают всю страницу? Какое свойство нужно для картинки фона?', 'Which selector picks the whole page? Which property is for the background picture?'),
      L3("Selektor body bo'ladi, xususiyat background-image. Qiymati esa url so'zidan boshlanadi, qavs ichida qo'shtirnoqqa olingan yulduz.png turadi.", 'Селектор body, свойство background-image, а значение — url и в скобках yulduz.png в кавычках.', 'The selector is body, the property background-image, and the value url with yulduz.png in quotes inside brackets.'),
      L3("Kod ostiga namuna chiqdi, unda yulduzli qoida to'liq yozilgan. Uni ko'chirib yozing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Sahifa yulduzlarga to'lib ketdi. Bu qoidada bitta ham harf mendan emas, hammasini o'zingiz yozdingiz!", 'Отлично! Страница в звёздах. Всё правило — целиком твоё.', 'Great! The page is full of stars. You wrote the rule yourself.'),
    ask: L3("Fonga yulduz.png qo'yadigan qoidani yozing", 'Напиши правило, которое поставит на фон yulduz.png', 'Write a rule that puts yulduz.png on the background')
  },
  s14: {
    eyebrow: L3("O'z foningiz", 'Свой фон', 'Your own background'),
    say: L3("Endi sahifani o'zingiz bezaysiz, xuddi o'z klubingizning saytidek! Fayllardan sahifa foni uchun bitta rasm tanlab, uning nomini yozing. Sarlavhaning orqasi uchun esa xohlagan rangingizni yozing-da, «Tayyor»ni bosing.", 'Теперь укрась свою страницу. Выбери из файлов картинку для фона страницы и впиши её имя. А для фона заголовка впиши любой цвет. Потом нажми «Готово».', 'Now decorate your own page. Pick a picture from the files for the page background and type its name. Then type any color for the heading’s background. Then tap “Done”.'),
    msgs: {
      noFile: L3("Fayllarda bunday nom topilmadi: \u2063{w}\u2064. Fayl nomini to'liq yozing: nuqtasi ham, oxiridagi jpg yoki png ham bo'lsin, masalan, osmon.jpg.", "Среди файлов нет такого имени: \u2063{w}\u2064. Перепиши имя файла целиком, с точкой и окончанием, например osmon.jpg.", "There’s no file with that name: \u2063{w}\u2064. Copy the whole file name, with the dot and the ending, for example osmon.jpg."),
      notColor: L3("Bunday rangni brauzer bilmaydi: \u2063{w}\u2064. Rangning nomini yoki kodini tekshirib ko'ring.", 'Браузер не узнал такой цвет: \u2063{w}\u2064. Проверь имя или код цвета.', 'The browser didn’t recognize this as a color: \u2063{w}\u2064. Check the color’s name or code.')
    },
    hints: [
      L3("Qaysi rasm ko'proq yoqdi? Uning nomini pastdagi fayllardan qarab oling.", 'Какая картинка тебе нравится? Посмотри её имя в файлах.', 'Which picture do you like? Look up its name in the files.'),
      L3("Fayl nomi to'liq yoziladi: nuqtasi ham, oxiridagi jpg yoki png ham kerak. Rangni esa nomi yoki kodi bilan yozsa bo'ladi.", 'Имя файла пишется с точкой и окончанием. А цвет — именем или кодом.', 'A file name is written with the dot and its ending. A color is a name or a code.'),
      L3("Masalan, rasm uchun osmon.jpg, rang uchun esa white yozing-da, «Tayyor»ni bosing.", 'Например, впиши osmon.jpg для картинки и white для цвета. Потом нажми «Готово».', 'For example, type osmon.jpg for the picture and white for the color. Then tap “Done”.')
    ],
    ok: L3("Qanday chiroyli fon chiqdi! Bunisini endi o'zingiz yaratdingiz.", 'Ого, как красиво! Это твой собственный фон.', 'Wow, how pretty! That’s your very own background.'),
    ask: L3('Rasm nomi va rangni yozing, «Tayyor»ni bosing', 'Впиши имя картинки и цвет, нажми «Готово»', 'Type a picture name and a color, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi fon haqida to'rtta gap aytaman. Ehtiyot bo'ling: ba'zilari rost, ba'zilarini esa ataylab chalkashtirdim. Har birini o'ylab, to'g'rimi yoki noto'g'rimi, shuni tanlang.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    hint1: L3("Gapni sekin, bo'lib-bo'lib o'qing: u fon rangi haqidami yoki fon rasmi haqidami?", 'Прочитай фразу по частям: она про цвет или про картинку?', 'Read the sentence piece by piece: is it about a color or a picture?'),
    hint2: L3("Darsda ko'rganlarimizni eslab ko'ring: rasm url bilan beriladi, kichik rasm o'zi takrorlanadi, rasm chiqmasa, zaxira rang ko'rinadi. Gap shularga to'g'ri keladimi?", 'Вспомни урок: картинку задают через url, маленькая картинка сама повторяется, если картинки нет — виден запасной цвет. Фраза с этим совпадает?', 'Remember the lesson: a picture is given with url, a small picture repeats by itself, and if the picture is missing the backup color shows. Does the sentence match that?'),
    items: [
      { t: L3("background-image qiymatida fayl nomi url va qavs ichida yoziladi.", 'В background-image имя файла пишется внутри url и скобок.', 'In background-image the file name goes inside url and brackets.'), right: true, code: 'img',
        why: L3("Ha, rost: oldin url so'zi, keyin qavs, qo'shtirnoqdagi fayl nomi va yopuvchi qavs keladi.", 'Верно: url, скобка, имя файла в кавычках, скобка.', 'Right: url, a bracket, the file name in quotes, a bracket.') },
      { t: L3("Kichik rasm o'z-o'zidan faqat bitta bo'lib chiqadi.", 'Маленькая картинка сама по себе показывается только один раз.', 'A small picture shows up only once by itself.'), right: false,
        why: L3("Aslida kichik rasm o'z-o'zidan takrorlanib ketadi. Bitta bo'lishi uchun esa no-repeat kerak.", 'На самом деле маленькая картинка повторяется сама. Чтобы была одна, нужен no-repeat.', 'Actually a small picture repeats by itself. To get one, you need no-repeat.') },
      { t: L3("Rasm topilmasa, background-color rangi ko'rinadi.", 'Если картинка не нашлась, виден цвет из background-color.', 'If the picture isn’t found, the background-color shows.'), right: true, code: 'backup',
        why: L3("Rost, aynan shu rang zaxira rang bo'ladi, u sahifani bo'sh qoldirmaydi.", 'Так и есть: это запасной цвет, он не даёт странице остаться пустой.', 'That’s right: it’s a backup color that keeps the page from looking empty.') },
      { t: L3("background-color faqat body uchun ishlaydi.", 'background-color работает только для body.', 'background-color only works for body.'), right: false,
        why: L3("Unday emas: darsda fonni sarlavhaga ham, abzasga ham, butun sahifaga ham berdik-ku.", 'На самом деле фон можно дать любому элементу: заголовку, абзацу, всей странице.', 'Actually you can give any element a background: a heading, a paragraph, the whole page.') }
    ],
    ok: L3("Qoyil! Ataylab chalkashtirgan gaplarimni ham darrov ajratdingiz.", 'Всё верно! Ты отлично разбираешься в фоне.', 'All correct! You know backgrounds really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Ishonchim komil bo'lgan o'sha kod mana bu: qo'shtirnoqda faqat fayl nomi turibdi. Fonga qarang, maydon yo'q! Siz buni dars davomida allaqachon payqadingiz: rasm uchun url so'zi va qavslar kerak. Ularsiz brauzer bu yozuvni tushunmaydi va o'tkazib yuboradi, fon esa bo'sh qoladi. Mana, ortiqcha ishonch nimaga olib keladi!",
        'Вернёмся к загадке. Помнишь, после background-image я написал только имя файла в кавычках? Увы, я ошибся. Для картинки нужны слово url и скобки. Без них браузер выбрасывает эту запись, и фон остаётся пустым.',
        'Back to our riddle. Remember, after background-image I wrote only the file name in quotes? Sadly, I was wrong. A picture needs the word url and brackets. Without them the browser throws the line away, and the background stays empty.'), k: 'riddle' },
      { text: L3("Bu esa sizning sahifangiz: foni ham, sarlavhasining rangi ham o'zingizniki!", 'Смотри, это твоя страница с твоим собственным фоном!', 'Look, this is your page with the background you picked yourself!'), k: null },
      { text: L3("background-color istalgan elementning orqasini bo'yaydi: sahifani ham, sarlavhani ham, abzasni ham.", 'background-color красит фон любого элемента.', 'background-color paints the background of any element.'), k: 'color' },
      { text: L3("background-image esa fonga rasm qo'yadi, buning uchun url so'zi kerak.", 'background-image ставит на фон картинку через url.', 'background-image puts a picture on the background with url.'), k: 'image' },
      { text: L3("background-repeat rasm takrorlanadimi yoki yo'qmi, shuni hal qiladi.", 'background-repeat решает, повторяется картинка или нет.', 'background-repeat decides whether the picture repeats or not.'), k: 'repeat' },
      { text: L3("Tabriklayman! Klubimning sayti endi haqiqiy stadiondek bo'ldi, siz esa istalgan sahifaga xohlagan fonni bera olasiz. Keyingi darsda matn va shriftlar bilan ishlaymiz. Ko'rishguncha!", 'Ура! Теперь ты можешь дать странице любой фон. На следующем уроке поработаем с текстом и шрифтами. До встречи!', 'Hooray! Now you can give a page any background. Next time we’ll work with text and fonts. See you!'), k: null }
    ],
    roles: {
      color: L3('background-color — rang', 'background-color — цвет', 'background-color — a color'),
      image: L3('background-image — rasm', 'background-image — картинка', 'background-image — a picture'),
      repeat: L3('background-repeat — takrorlash', 'background-repeat — повтор', 'background-repeat — repeating')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};


/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayH1: 1, sayP: 1, sayUrl: 1, sayTile: 1, sayOne: 1, sayBig: 1,
  sayCover: 1, sayNoUrl: 1, sayTypo: 1, sayBackup: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, got: 1, rounds: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c4.css@*/
`;
