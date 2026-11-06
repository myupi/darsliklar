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
// ЗАМЫСЕЛ (05.11.2026). Уроки 1–3: правило, style в head, селекторы тег / .class / #id, цвета именем, hex, rgb, hsl.
// Сайт футбольного клуба Коди — белый и скучный; Коди хочет, чтобы он был похож на стадион: сзади поле, текст
// на белых полосах. Ученик узнаёт: background-color красит фон любого элемента (не только body); background-image
// ставит картинку url("файл"); маленькая картинка сама повторяется плиткой; background-repeat: no-repeat — одна;
// background-size: cover — на весь фон; файл не нашёлся — виден цвет фона (запасной).
// Загадка (без имён): Коди написал «background-image: "maydon.jpg";» без url( ) и уверен, что картинка появится.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (белый сайт → поле за страницей, белые полосы под текстом; HTML не тронут; загадка)
//   фон элемента:  s2 показ (body → h1 → p) · s3 вписать белый фон заголовка (Fill) · s4 что покрасило правило (Visual Code Mapping)
//   картинка:      s5 показ (url, кавычки, плитка) · s6 собрать url("osmon.jpg") (Code Builder) · s7 какой код у страницы (выбор)
//   повтор/размер: s8 показ (плитка → no-repeat → большая картинка → cover) · s9 вписать no-repeat (Fill) · s10 плиткой или одна (Sort)
//   поломки:       s11 показ (без url, опечатка в имени файла, запасной цвет) · s12 вписать url( (Debug & Fix) · s13 найти сломанное правило (Error Detective)
//   w1 правило целиком (перенос) · s14 свой фон (Live, «Готово»)
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
    say: L3("Salom! Bu mening futbol klubimning sayti. Lekin qarang, u juda oddiy: oq fon va qora harflar. Men uni haqiqiy stadionga o'xshatmoqchiman, orqada yashil maydon bo'lsin. «Aylantirish» tugmasini bosing.",
      'Привет! Это сайт моего футбольного клуба. Но смотри, он совсем простой: белый фон и чёрные буквы. Хочу, чтобы он был похож на настоящий стадион, а сзади было зелёное поле. Нажми «Превратить».',
      'Hi! This is my football club’s site. But look, it’s very plain: a white background and black letters. I want it to look like a real stadium, with a green field behind it. Tap “Transform”.'),
    magic: L3("Mana! Sahifa orqasida maydon paydo bo'ldi, sarlavha va matn orqasi esa oq.", 'Вот! За страницей появилось поле, а под заголовком и текстом белый фон.', 'There! A field appeared behind the page, and the heading and text have a white background.'),
    magicP: L3("HTML kodiga tegmadim. Hammasini CSS qildi: sahifa orqasiga rasm qo'ydi, matn orqasini esa oq rangga bo'yadi.", 'HTML я не трогал. Всё сделал CSS: поставил картинку позади страницы, а фон под текстом закрасил белым.', 'I didn’t touch the HTML. CSS did it all: it put a picture behind the page and painted the background behind the text white.'),
    done: L3("Bugun fon bilan ishlashni o'rganasiz: rang va rasm. Lekin oldin kichik topishmoq. Birinchi urinishda men background-image deb yozdim, keyin esa faqat fayl nomini qo'shtirnoqda qoldirdim. Menimcha, shu yetarli. Siz nima deb o'ylaysiz, rasm chiqadimi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься работать с фоном: цветом и картинкой. Но сначала маленькая загадка. В первый раз я написал background-image, а после него просто имя файла в кавычках. По-моему, этого хватит. Как думаешь, картинка появится? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to work with backgrounds: colors and pictures. But first, a little riddle. The first time, I wrote background-image and then just the file name in quotes. I think that’s enough. What do you think, will the picture show up? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Orqada rasm, matn ostida oq fon", 'Сзади картинка, под текстом белый фон', 'A picture behind, white behind the text')
  },
  s2: {
    eyebrow: L3('Element foni', 'Фон элемента', 'An element’s background'),
    say: L3("Fon rangini siz allaqachon bilasiz: body uchun background-color butun sahifani bo'yaydi. Lekin fonni istalgan elementga berish mumkin. Qarang.",
      'Цвет фона ты уже знаешь: background-color для body красит всю страницу. Но фон можно дать любому элементу. Смотри.',
      'You already know background colors: background-color on body paints the whole page. But you can give a background to any element. Watch.'),
    sayH1: L3("Endi h1 uchun background-color yozamiz. Sarlavha orqasida sariq chiziq paydo bo'ldi. U sahifaning butun kengligi bo'ylab cho'zildi, chunki sarlavha qatorni to'liq egallaydi.",
      'Теперь напишем background-color для h1. За заголовком появилась жёлтая полоса. Она тянется на всю ширину страницы, потому что заголовок занимает строку целиком.',
      'Now we write background-color for h1. A yellow strip appeared behind the heading. It stretches across the whole width of the page, because a heading takes up the entire line.'),
    sayP: L3("Abzaslar uchun ham xuddi shunday. Har bir abzas orqasi oq bo'ldi. Matn rangi esa o'zgarmadi: harflar rangini color beradi, orqasini esa background-color.",
      'С абзацами так же. Фон за каждым абзацем стал белым. А цвет текста не изменился: цвет букв задаёт color, а фон за ними — background-color.',
      'Same with paragraphs. Each paragraph got a white background. The text color didn’t change: color sets the letters, and background-color sets what’s behind them.'),
    done: L3("Demak, background-color elementning orqasini bo'yaydi: butun sahifani, sarlavhani yoki abzasni.", 'Значит, background-color красит фон элемента: всей страницы, заголовка или абзаца.', 'So background-color paints an element’s background: the whole page, a heading or a paragraph.'),
    askStart: L3('Qarang: butun sahifa foni', 'Смотри: фон всей страницы', 'Watch: the whole page’s background'),
    askH1: L3('Qarang: sarlavha foni', 'Смотри: фон заголовка', 'Watch: the heading’s background'),
    askP: L3('Qarang: abzaslar foni', 'Смотри: фон абзацев', 'Watch: the paragraphs’ background'),
    askDone: L3("background-color element orqasini bo'yaydi", 'background-color красит фон элемента', 'background-color paints an element’s background')
  },
  s3: {
    eyebrow: L3('Sarlavha foni', 'Фон заголовка', 'The heading’s background'),
    say: L3("Endi navbat sizga. Sahifa yashil, sarlavha esa unda yaxshi ko'rinmayapti. Sarlavha orqasini oq qiling: background-color uchun rangni yozing.",
      'Теперь твоя очередь. Страница зелёная, и заголовок на ней плохо видно. Сделай фон заголовка белым: впиши цвет для background-color.',
      'Now it’s your turn. The page is green, and the heading is hard to see on it. Make the heading’s background white: type the color for background-color.'),
    msgs: {
      empty: L3("Rang yozing, masalan uning nomini.", 'Впиши цвет, например его имя.', 'Type a color, for example its name.'),
      notColor: L3("Brauzer buni rang deb tanimadi. Rang nomini yoki kodini tekshiring.", 'Браузер не узнал в этом цвет. Проверь имя или код цвета.', 'The browser didn’t recognize that as a color. Check the color’s name or code.'),
      other: L3("Bu boshqa rang chiqdi. Sarlavha orqasi oq bo'lishi kerak.", 'Получился другой цвет. Фон заголовка должен быть белым.', 'That’s a different color. The heading’s background should be white.')
    },
    hints: [
      L3("Oq rang inglizcha qanday ataladi?", 'Как белый цвет называется по-английски?', 'What is white called in English?'),
      L3("Oq rangning nomi white. Uni hex kod bilan ham yozish mumkin.", 'Белый по-английски white. Его можно записать и hex-кодом.', 'White is called white. You can also write it as a hex code.'),
      L3("white so'zini yozing va Tekshirishni bosing.", 'Впиши слово white и нажми «Проверить».', 'Type the word white and tap Check.')
    ],
    ok: L3("Zo'r! Endi sarlavha yashil sahifada aniq ko'rinadi.", 'Огонь! Теперь заголовок хорошо видно на зелёной странице.', 'Awesome! Now the heading stands out on the green page.'),
    ask: L3("Sarlavha orqasini oq qiling", 'Сделай фон заголовка белым', 'Make the heading’s background white')
  },
  s4: {
    eyebrow: L3("Nimani bo'yadi?", 'Что покрасило?', 'What did it paint?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor. Men bittasini yoqaman, siz esa sahifada u nimani bo'yaganini bosing.",
      'Теперь проверь себя. В коде три правила. Я подсвечу одно, а ты нажми на странице то, что оно покрасило.',
      'Now check yourself. There are three rules in the code. I’ll light one up, and you tap what it painted on the page.'),
    ask: L3("Yonib turgan qoida nimani bo'yadi? Sahifada bosing", 'Что покрасило горящее правило? Нажми на странице', 'What did the lit rule paint? Tap it on the page'),
    hint1: L3("Yonib turgan qoidaning selektoriga qarang.", 'Посмотри на селектор горящего правила.', 'Look at the lit rule’s selector.'),
    hint2: L3("body bu butun sahifa, h1 sarlavha, p esa abzas.", 'body — это вся страница, h1 — заголовок, p — абзац.', 'body is the whole page, h1 is the heading, p is a paragraph.'),
    why: {
      p: L3("Bu qoida p uchun: u abzaslar orqasini bo'yaydi.", 'Это правило для p: оно красит фон абзацев.', 'This rule is for p: it paints the paragraphs’ background.'),
      body: L3("Bu qoida body uchun: u butun sahifa orqasini bo'yaydi. Sahifaning bo'sh joyini bosing.", 'Это правило для body: оно красит фон всей страницы. Нажми на пустое место страницы.', 'This rule is for body: it paints the whole page’s background. Tap an empty spot on the page.'),
      h1: L3("Bu qoida h1 uchun: u sarlavha orqasini bo'yaydi.", 'Это правило для h1: оно красит фон заголовка.', 'This rule is for h1: it paints the heading’s background.')
    },
    got: L3("To'g'ri! Keyingi qoidaga qarang.", 'Верно! Смотри на следующее правило.', 'Right! Look at the next rule.'),
    ok: L3("Barakalla! Qaysi qoida qayerni bo'yashini bilasiz.", 'Молодец! Ты знаешь, какое правило что красит.', 'Well done! You know which rule paints what.')
  },
  s5: {
    eyebrow: L3('Fon rasmi', 'Картинка на фоне', 'A background picture'),
    say: L3("Endi eng qiziqi: fonga rasm qo'yamiz. Buning uchun background-image xususiyati bor, ya'ni fon rasmi degani. Pastda fayllar turibdi, ulardan birini olamiz.",
      'А теперь самое интересное: поставим на фон картинку. Для этого есть свойство background-image, то есть картинка фона. Внизу лежат файлы, возьмём один из них.',
      'Now the most interesting part: we put a picture on the background. There’s a property for that, background-image, meaning the background picture. The files are below; we’ll take one of them.'),
    sayUrl: L3("Qiymat url so'zi bilan boshlanadi, keyin qavs ichida, qo'shtirnoqda fayl nomi yoziladi. url brauzerga bu fayl manzili ekanini aytadi.",
      'Значение начинается со слова url, потом в скобках и в кавычках пишется имя файла. url говорит браузеру, что это адрес файла.',
      'The value starts with the word url, then the file name goes in brackets and quotes. url tells the browser that this is a file’s address.'),
    sayTile: L3("Qarang, yulduzcha kichkina, sahifa esa katta. Shuning uchun brauzer rasmni kafel kabi qayta-qayta takrorlab, butun fonni to'ldirdi.",
      'Смотри, звёздочка маленькая, а страница большая. Поэтому браузер повторил картинку плиткой и заполнил весь фон.',
      'Look, the star is small and the page is big. So the browser repeated the picture like tiles and filled the whole background.'),
    done: L3("Demak, background-image fonga rasm qo'yadi: url, qavs, qo'shtirnoqda fayl nomi. Kichik rasm o'zi takrorlanadi.", 'Значит, background-image ставит на фон картинку: url, скобки, имя файла в кавычках. Маленькая картинка сама повторяется.', 'So background-image puts a picture on the background: url, brackets, the file name in quotes. A small picture repeats by itself.'),
    askStart: L3('Qarang: fon rasmi', 'Смотри: картинка на фоне', 'Watch: a background picture'),
    askUrl: L3("Qarang: url va fayl nomi", 'Смотри: url и имя файла', 'Watch: url and the file name'),
    askTile: L3("Qarang: rasm takrorlanadi", 'Смотри: картинка повторяется', 'Watch: the picture repeats'),
    askDone: L3("background-image: url, qavs, fayl nomi", 'background-image: url, скобки, имя файла', 'background-image: url, brackets, file name')
  },
  s6: {
    eyebrow: L3("Rasmni qo'ying", 'Поставь картинку', 'Add the picture'),
    say: L3("Endi o'zingiz yig'ing. Sahifa foniga osmon rasmini qo'ying. Bo'laklarni to'g'ri tartibda bosing yoki suring.",
      'Теперь собери сам. Поставь на фон страницы картинку с небом. Нажимай или перетаскивай кусочки в правильном порядке.',
      'Now build it yourself. Put the sky picture on the page background. Tap or drag the pieces in the right order.'),
    why: {
      src: L3("src HTML kodidagi img tegi uchun edi. CSS da rasm url bilan beriladi.", 'src был для тега img в HTML. В CSS картинку задают через url.', 'src was for the img tag in HTML. In CSS a picture is given with url.'),
      order: L3("Tartib boshqacha: oldin url va ochuvchi qavs, keyin qo'shtirnoqdagi fayl nomi, oxirida yopuvchi qavs.", 'Порядок другой: сначала url и открывающая скобка, потом имя файла в кавычках, в конце закрывающая скобка.', 'The order is different: first url and the opening bracket, then the file name in quotes, and the closing bracket last.')
    },
    hints: [
      L3("Qiymat qaysi so'z bilan boshlanardi?", 'С какого слова начиналось значение?', 'Which word did the value start with?'),
      L3("url, ochuvchi qavs, fayl nomi, yopuvchi qavs.", 'url, открывающая скобка, имя файла, закрывающая скобка.', 'url, the opening bracket, the file name, the closing bracket.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми горящий кусочек.', 'Tap the glowing piece.')
    ],
    ok: L3("Ajoyib! Sahifa ortida osmon paydo bo'ldi.", 'Отлично! За страницей появилось небо.', 'Great! The sky appeared behind the page.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order')
  },
  s7: {
    eyebrow: L3('Qaysi kod?', 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men sahifani ko'rsataman, siz esa uni qaysi kod yasaganini tanlang.", 'Теперь проверь себя. Я покажу страницу, а ты выбери, какой код её сделал.', 'Now check yourself. I’ll show a page, and you pick the code that made it.'),
    ask: L3("Bu fonni qaysi kod beradi?", 'Какой код даёт этот фон?', 'Which code makes this background?'),
    hint1: L3("Fonga qarang: bu rangmi yoki rasmmi?", 'Посмотри на фон: это цвет или картинка?', 'Look at the background: is it a color or a picture?'),
    hint2: L3("Rang uchun background-color kerak, rasm uchun esa background-image va fayl nomi.", 'Для цвета нужен background-color, а для картинки — background-image и имя файла.', 'A color needs background-color, and a picture needs background-image and a file name.'),
    rounds: [
      { want: 'background-image: url("yulduz.png");', opts: ['background-color: gold;', 'background-image: url("yulduz.png");', 'background-image: url("futbol.png");'],
        why: L3("Fonda kichik yulduzchalar takrorlanyapti, demak bu yulduz.png rasmi.", 'На фоне повторяются звёздочки, значит, это картинка yulduz.png.', 'Little stars repeat on the background, so it’s the picture yulduz.png.') },
      { want: 'background-color: skyblue;', opts: ['background-image: url("osmon.jpg");', 'background-color: skyblue;', 'background-color: navy;'],
        why: L3("Fon tekis och ko'k, rasm yo'q. Demak, bu rang: skyblue.", 'Фон ровный голубой, картинки нет. Значит, это цвет skyblue.', 'The background is plain light blue with no picture. So it’s the color skyblue.') },
      { want: 'background-image: url("maydon.jpg");', opts: ['background-image: url("maydon.jpg");', 'background-color: green;', 'background-image: url("osmon.jpg");'],
        why: L3("Fonda maydon chiziqlari bor, demak bu maydon.jpg rasmi.", 'На фоне видны линии поля, значит, это картинка maydon.jpg.', 'You can see the field lines, so it’s the picture maydon.jpg.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Siz fon kodini o'qiy olasiz.", 'Всё верно! Ты умеешь читать код фона.', 'All correct! You can read background code.')
  },
  s8: {
    eyebrow: L3("Takrorlash va o'lcham", 'Повтор и размер', 'Repeat and size'),
    say: L3("Rasm har doim ham takrorlanishi kerak emas. Buni ikki xususiyat boshqaradi. Hozir to'p rasmi butun fonni to'ldirib turibdi.", 'Картинке не всегда нужно повторяться. Этим управляют два свойства. Сейчас мячи заполнили весь фон.', 'A picture doesn’t always need to repeat. Two properties control that. Right now the balls fill the whole background.'),
    sayOne: L3("background-repeat: no-repeat, ya'ni takrorlanmasin degani. Endi to'p faqat bitta, chap yuqori burchakda.", 'background-repeat: no-repeat — значит «не повторять». Теперь мяч только один, в левом верхнем углу.', 'background-repeat: no-repeat means “don’t repeat”. Now there’s only one ball, in the top left corner.'),
    sayBig: L3("Endi katta osmon rasmini qo'yamiz. U bitta, lekin sahifani to'liq qoplamayapti: yon tomonda bo'sh joy qoldi.", 'Теперь поставим большую картинку неба. Она одна, но не закрывает страницу целиком: сбоку осталось пустое место.', 'Now we put the big sky picture. There’s one, but it doesn’t cover the whole page: there’s empty space at the side.'),
    sayCover: L3("background-size: cover rasmni kattalashtirib, butun fonni qoplaydi. Endi osmon hamma joyda.", 'background-size: cover растягивает картинку на весь фон. Теперь небо везде.', 'background-size: cover stretches the picture over the whole background. Now the sky is everywhere.'),
    done: L3("Demak, no-repeat rasmni bitta qoldiradi, cover esa uni butun fonga yoyadi.", 'Значит, no-repeat оставляет одну картинку, а cover растягивает её на весь фон.', 'So no-repeat leaves just one picture, and cover stretches it over the whole background.'),
    askStart: L3("Qarang: rasm takrorlanadi", 'Смотри: картинка повторяется', 'Watch: the picture repeats'),
    askOne: L3("Qarang: no-repeat, rasm bitta", 'Смотри: no-repeat, картинка одна', 'Watch: no-repeat, one picture'),
    askBig: L3("Qarang: katta rasm bitta", 'Смотри: большая картинка одна', 'Watch: one big picture'),
    askCover: L3("Qarang: cover, butun fonga", 'Смотри: cover, на весь фон', 'Watch: cover, the whole background'),
    askDone: L3("no-repeat bitta, cover butun fonga", 'no-repeat — одна, cover — на весь фон', 'no-repeat for one, cover for the whole')
  },
  s9: {
    eyebrow: L3("Bitta to'p", 'Один мяч', 'Just one ball'),
    say: L3("To'p rasmi butun fonni to'ldirib yuboribdi. Faqat bitta to'p bo'lsin. background-repeat uchun qiymatni yozing.", 'Мячи заполнили весь фон. Пусть мяч будет только один. Впиши значение для background-repeat.', 'The balls filled the whole background. Let there be just one ball. Type the value for background-repeat.'),
    msgs: {
      empty: L3("background-repeat uchun qiymat yozing.", 'Впиши значение для background-repeat.', 'Type a value for background-repeat.'),
      space: L3("no va repeat o'rtasida bo'sh joy emas, chiziqcha bo'ladi.", 'Между no и repeat не пробел, а дефис.', 'Between no and repeat there’s a hyphen, not a space.'),
      repeat: L3("repeat takrorlansin degani, shuning uchun to'plar yana ko'p. Takrorlanmasin degan so'z kerak.", 'repeat значит «повторять», поэтому мячей снова много. Нужно «не повторять».', 'repeat means “repeat”, so there are many balls again. You need “don’t repeat”.'),
      other: L3("Brauzer bu qiymatni tanimadi. Takrorlanmasin degani no-repeat bo'ladi.", 'Браузер не узнал это значение. «Не повторять» — это no-repeat.', 'The browser didn’t recognize that value. “Don’t repeat” is no-repeat.')
    },
    hints: [
      L3("Takrorlanmasin degan qiymat qanday edi?", 'Как было значение «не повторять»?', 'What was the value for “don’t repeat”?'),
      L3("U ikki so'zdan iborat: no va repeat, o'rtasida chiziqcha.", 'Оно из двух слов: no и repeat, между ними дефис.', 'It’s two words, no and repeat, with a hyphen between them.'),
      L3("no-repeat deb yozing va Tekshirishni bosing.", 'Впиши no-repeat и нажми «Проверить».', 'Type no-repeat and tap Check.')
    ],
    ok: L3("Zo'r! Endi fonda bitta to'p qoldi.", 'Огонь! Теперь на фоне один мяч.', 'Awesome! Now there’s one ball on the background.'),
    ask: L3("Bitta to'p uchun qiymatni yozing", 'Впиши значение для одного мяча', 'Type the value for one ball')
  },
  s10: {
    eyebrow: L3('Takrorlanadimi?', 'Плиткой или одна?', 'Tiled or one?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men kodni ko'rsataman, siz esa rasm takrorlanadimi yoki bitta bo'ladimi, shuni tanlang.", 'Теперь проверь себя. Я покажу код, а ты выбери: картинка будет плиткой или одна?', 'Now check yourself. I’ll show some code, and you choose: will the picture be tiled or just one?'),
    ask: L3("Rasm takrorlanadimi yoki bittami?", 'Картинка будет плиткой или одна?', 'Will the picture be tiled or just one?'),
    card: L3('body uchun kod', 'Код для body', 'Code for body'),
    hint1: L3("Kodda background-repeat yoki background-size bormi?", 'Есть ли в коде background-repeat или background-size?', 'Does the code have background-repeat or background-size?'),
    hint2: L3("Hech narsa yozilmasa, kichik rasm o'zi takrorlanadi. no-repeat bitta qoldiradi, cover bitta rasmni butun fonga yoyadi.", 'Если ничего не написано, маленькая картинка сама повторяется. no-repeat оставляет одну, cover растягивает одну на весь фон.', 'If nothing is written, a small picture repeats by itself. no-repeat leaves one, and cover stretches one over the whole background.'),
    items: [
      { code: 'background-image: url("yulduz.png");', right: 'tile', why: L3("Takrorlash haqida hech narsa yozilmagan, shuning uchun kichik rasm o'zi takrorlanadi.", 'Про повтор ничего не написано, поэтому маленькая картинка повторяется сама.', 'Nothing is written about repeating, so the small picture repeats by itself.') },
      { code: 'background-image: url("futbol.png");\nbackground-repeat: no-repeat;', right: 'one', why: L3("no-repeat takrorlanmasin degani, demak rasm bitta.", 'no-repeat значит «не повторять», значит, картинка одна.', 'no-repeat means “don’t repeat”, so there’s one picture.') },
      { code: 'background-image: url("futbol.png");\nbackground-repeat: repeat;', right: 'tile', why: L3("repeat takrorlansin degani, demak rasm takrorlanadi.", 'repeat значит «повторять», значит, картинка плиткой.', 'repeat means “repeat”, so the picture is tiled.') },
      { code: 'background-image: url("osmon.jpg");\nbackground-size: cover;', right: 'one', why: L3("cover bitta rasmni butun fonga yoyadi.", 'cover растягивает одну картинку на весь фон.', 'cover stretches one picture over the whole background.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Rasm qanday turishini oldindan bilasiz.", 'Всё верно! Ты заранее знаешь, как ляжет картинка.', 'All correct! You know in advance how the picture will look.')
  },
  s11: {
    eyebrow: L3('Rasm chiqmasa', 'Когда картинки нет', 'When the picture is missing'),
    say: L3("Ba'zan rasm chiqmay qoladi. Brauzer xato kodni tashlab yuboradi yoki faylni topa olmaydi. Keling, ikkita sababni va bitta yordamchini ko'ramiz.", 'Бывает, картинка не появляется. Браузер выбрасывает ошибочный код или не находит файл. Давай посмотрим на две причины и одного помощника.', 'Sometimes the picture doesn’t show. The browser throws away bad code or can’t find the file. Let’s look at two reasons and one helper.'),
    sayNoUrl: L3("Birinchisi: url yo'q, faqat qo'shtirnoqda fayl nomi. Brauzer buni rasm deb tanimadi, fon bo'sh qoldi.", 'Первая: нет url, только имя файла в кавычках. Браузер не узнал в этом картинку, фон пустой.', 'The first: there’s no url, only the file name in quotes. The browser didn’t recognize it as a picture, so the background is empty.'),
    sayTypo: L3("Ikkinchisi: fayl nomida bitta harf yo'q. Fayllar orasida bunday nom yo'q, shuning uchun rasm yana chiqmadi.", 'Вторая: в имени файла пропала буква. Среди файлов такого имени нет, поэтому картинки снова нет.', 'The second: a letter is missing from the file name. There’s no file with that name, so again there’s no picture.'),
    sayBackup: L3("Endi yordamchi. Rasm bilan birga background-color ham yozamiz. Rasm topilmasa, brauzer shu rangni ko'rsatadi. Bu zaxira rang.", 'А теперь помощник. Вместе с картинкой напишем и background-color. Если картинки нет, браузер покажет этот цвет. Это запасной цвет.', 'Now the helper. Along with the picture we also write background-color. If the picture isn’t found, the browser shows this color. It’s a backup color.'),
    done: L3("Demak, rasm uchun url va to'g'ri fayl nomi kerak, zaxira rang esa sahifani bo'sh qoldirmaydi.", 'Значит, для картинки нужны url и верное имя файла, а запасной цвет не даст странице остаться пустой.', 'So a picture needs url and the right file name, and a backup color keeps the page from looking empty.'),
    askNoUrl: L3("Qarang: url yo'q", 'Смотри: нет url', 'Watch: no url'),
    askTypo: L3("Qarang: fayl nomida xato", 'Смотри: ошибка в имени файла', 'Watch: a typo in the file name'),
    askBackup: L3("Qarang: zaxira rang", 'Смотри: запасной цвет', 'Watch: a backup color'),
    askDone: L3("url, to'g'ri nom va zaxira rang", 'url, верное имя и запасной цвет', 'url, the right name and a backup color')
  },
  s12: {
    eyebrow: L3("url ni qo'ying", 'Поставь url', 'Add url'),
    say: L3("Voy, men yana url ni unutibman! Maydon chiqmayapti. Fayl nomi oldidagi bo'sh joyga kerakli so'z va qavsni yozing.", 'Ой, я опять забыл url! Поле не появляется. Впиши в пустое место перед именем файла нужное слово и скобку.', 'Oops, I forgot url again! The field won’t show. Type the right word and bracket in the empty spot before the file name.'),
    msgs: {
      empty: L3("Fayl nomi oldiga so'z va qavs yozing.", 'Впиши перед именем файла слово и скобку.', 'Type a word and a bracket before the file name.'),
      paren: L3("So'z to'g'ri, lekin uning yonida ochuvchi qavs bo'lishi kerak.", 'Слово верное, но рядом с ним нужна открывающая скобка.', 'The word is right, but it needs an opening bracket next to it.'),
      other: L3("Bu ishlamaydi. Fayl nomi oldida url so'zi va ochuvchi qavs turadi.", 'Так не работает. Перед именем файла стоят слово url и открывающая скобка.', 'That doesn’t work. The file name comes after the word url and an opening bracket.')
    },
    hints: [
      L3("Rasm qiymati qaysi so'z bilan boshlanardi?", 'С какого слова начинается значение картинки?', 'Which word does a picture value start with?'),
      L3("url so'zi va ochuvchi qavs. Yopuvchi qavs allaqachon bor.", 'Слово url и открывающая скобка. Закрывающая уже есть.', 'The word url and an opening bracket. The closing one is already there.'),
      L3("Pastdagi url tugmasini bosing, keyin Tekshirishni bosing.", 'Нажми кнопку url внизу, потом «Проверить».', 'Tap the url button below, then Check.')
    ],
    ok: L3("Ajoyib! Maydon qaytib keldi.", 'Отлично! Поле вернулось.', 'Great! The field is back.'),
    ask: L3("Fayl nomi oldiga kerakli so'zni yozing", 'Впиши перед именем файла нужное слово', 'Type the right word before the file name')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga va fayllarga qarang va buzilgan qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и на файлы и нажми сломанное правило.', 'Now check yourself. There are three rules, but one doesn’t work. Look at the page and the files, and tap the broken rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: uning natijasi sahifada ko'rinib turibdi. Nima chiqmay qoldi?", 'Это правило работает: его результат виден на странице. Что не появилось?', 'This rule works: you can see its result on the page. What didn’t show up?'),
    found: {
      file: L3("Topdingiz! Faylning nomi osmon.jpg, kodda esa osmon.jpeg deb yozilgan.", 'Нашёл! Файл называется osmon.jpg, а в коде написано osmon.jpeg.', 'Found it! The file is called osmon.jpg, but the code says osmon.jpeg.'),
      space: L3("Topdingiz! no va repeat o'rtasida bo'sh joy bor, chiziqcha bo'lishi kerak edi.", 'Нашёл! Между no и repeat пробел, а нужен дефис.', 'Found it! There’s a space between no and repeat, but it should be a hyphen.')
    },
    hint1: L3("Sahifaga qarang: nima kutilganidek chiqmadi?", 'Посмотри на страницу: что вышло не так, как ждали?', 'Look at the page: what didn’t come out as expected?'),
    hint2: {
      file: L3("Osmon chiqmadi. Kodda yozilgan nomni fayllardagi nom bilan solishtiring.", 'Неба нет. Сравни имя в коде с именем в файлах.', 'There’s no sky. Compare the name in the code with the name in the files.'),
      space: L3("To'plar takrorlanyapti, lekin bitta bo'lishi kerak edi. background-repeat qiymatiga qarang.", 'Мячи повторяются, а должен быть один. Посмотри на значение background-repeat.', 'The balls repeat, but there should be one. Look at the background-repeat value.')
    },
    hint3: {
      file: L3("Xato birinchi qoidada: osmon.jpeg. O'sha qatorni bosing.", 'Ошибка в первом правиле: osmon.jpeg. Нажми эту строку.', 'The bug is in the first rule: osmon.jpeg. Tap that line.'),
      space: L3("Xato oxirgi qoidada: no repeat. O'sha qatorni bosing.", 'Ошибка в последнем правиле: no repeat. Нажми эту строку.', 'The bug is in the last rule: no repeat. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz fonni haqiqiy dizayner kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь фон как настоящий дизайнер.', 'Super! Both are found. You check backgrounds like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Sahifa foniga yulduzchalar qo'ying: fayl nomi yulduz.png. body uchun background-image xususiyatini yozing.", 'Теперь напиши правило целиком сам. Поставь на фон страницы звёздочки: файл yulduz.png. Напиши для body свойство background-image.', 'Now write the whole rule yourself. Put stars on the page background: the file is yulduz.png. Write the background-image property for body.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin jingalak qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Butun sahifa foni uchun body selektori kerak.", 'Для фона всей страницы нужен селектор body.', 'The whole page’s background needs the body selector.'),
      prop: L3("Fon rasmini background-image xususiyati beradi.", 'Картинку фона задаёт свойство background-image.', 'The background-image property sets the background picture.'),
      noUrl: L3("Fayl nomi oldida url so'zi va qavs yo'q. Usiz brauzer rasmni tanimaydi.", 'Перед именем файла нет слова url и скобки. Без них браузер не узнаёт картинку.', 'There’s no url and bracket before the file name. Without them the browser doesn’t recognize the picture.'),
      broken: L3("Brauzer bu qiymatni tanimadi. Qavslar va qo'shtirnoqlarni tekshiring: url, qavs, qo'shtirnoqda nom, qavs.", 'Браузер не узнал это значение. Проверь скобки и кавычки: url, скобка, имя в кавычках, скобка.', 'The browser didn’t recognize that value. Check the brackets and quotes: url, a bracket, the name in quotes, a bracket.'),
      noFile: L3("Fayllar orasida bunday nom yo'q. Nomni harfma-harf tekshiring.", 'Среди файлов нет такого имени. Проверь имя буква в букву.', 'There’s no file with that name. Check the name letter by letter.'),
      other: L3("Bu boshqa rasm. Yulduzchalar fayli yulduz.png.", 'Это другая картинка. Файл со звёздочками — yulduz.png.', 'That’s a different picture. The stars file is yulduz.png.')
    },
    hints: [
      L3("Butun sahifa qaysi selektor bilan tanlanardi? Fon rasmi uchun qaysi xususiyat kerak?", 'Каким селектором выбирают всю страницу? Какое свойство нужно для картинки фона?', 'Which selector picks the whole page? Which property is for the background picture?'),
      L3("Selektor body, xususiyat background-image, qiymat esa url, qavs ichida qo'shtirnoqda yulduz.png.", 'Селектор body, свойство background-image, а значение — url и в скобках yulduz.png в кавычках.', 'The selector is body, the property background-image, and the value url with yulduz.png in quotes inside brackets.'),
      L3("Shunday yozing: body, jingalak qavs, background-image, ikki nuqta, url, qavs, qo'shtirnoqda yulduz.png, qavs, nuqtali vergul va yopuvchi jingalak qavs.", 'Напиши так: body, фигурная скобка, background-image, двоеточие, url, скобка, yulduz.png в кавычках, скобка, точка с запятой и закрывающая фигурная скобка.', 'Write: body, a curly brace, background-image, a colon, url, a bracket, yulduz.png in quotes, a bracket, a semicolon and a closing curly brace.')
    ],
    ok: L3("Ajoyib! Sahifa yulduzlarga to'ldi. Qoidani o'zingiz yozdingiz.", 'Отлично! Страница в звёздах. Ты сам написал правило.', 'Great! The page is full of stars. You wrote the rule yourself.'),
    ask: L3("Fonga yulduz.png qo'yadigan qoidani yozing", 'Напиши правило, которое поставит на фон yulduz.png', 'Write a rule that puts yulduz.png on the background')
  },
  s14: {
    eyebrow: L3("O'z foningiz", 'Свой фон', 'Your own background'),
    say: L3("Endi o'z sahifangizni bezang. Fayllardan sahifa foni uchun bitta rasm tanlang va uning nomini yozing. Sarlavha orqasi uchun esa istalgan rangni yozing. Keyin «Tayyor»ni bosing.", 'Теперь укрась свою страницу. Выбери из файлов картинку для фона страницы и впиши её имя. А для фона заголовка впиши любой цвет. Потом нажми «Готово».', 'Now decorate your own page. Pick a picture from the files for the page background and type its name. Then type any color for the heading’s background. Then tap “Done”.'),
    msgs: {
      noFile: L3("Fayllar orasida {w} degan nom yo'q. Fayllardan birining nomini yozing.", 'Среди файлов нет имени {w}. Впиши имя одного из файлов.', 'There’s no file called {w}. Type the name of one of the files.'),
      notColor: L3("Brauzer {w} ni rang deb tanimadi. Rang nomini yoki kodini tekshiring.", 'Браузер не узнал цвет в {w}. Проверь имя или код цвета.', 'The browser didn’t recognize {w} as a color. Check the color’s name or code.')
    },
    hints: [
      L3("Qaysi rasm sizga yoqadi? Uning nomini fayllardan ko'ring.", 'Какая картинка тебе нравится? Посмотри её имя в файлах.', 'Which picture do you like? Look up its name in the files.'),
      L3("Fayl nomi nuqta va kengaytmasi bilan yoziladi. Rang esa nom yoki kod bilan.", 'Имя файла пишется с точкой и окончанием. А цвет — именем или кодом.', 'A file name is written with the dot and its ending. A color is a name or a code.'),
      L3("Masalan, rasmga osmon.jpg, rangga esa white yozing. Keyin «Tayyor»ni bosing.", 'Например, впиши osmon.jpg для картинки и white для цвета. Потом нажми «Готово».', 'For example, type osmon.jpg for the picture and white for the color. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning o'z foningiz.", 'Ого, как красиво! Это твой собственный фон.', 'Wow, how pretty! That’s your very own background.'),
    ask: L3('Rasm nomi va rangni yozing, «Tayyor»ni bosing', 'Впиши имя картинки и цвет, нажми «Готово»', 'Type a picture name and a color, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapni bo'laklab o'qing: u rang haqidami yoki rasm haqidami?", 'Прочитай фразу по частям: она про цвет или про картинку?', 'Read the sentence piece by piece: is it about a color or a picture?'),
    hint2: L3("Dars esingizdami: rasm url bilan beriladi, kichik rasm o'zi takrorlanadi, rasm chiqmasa zaxira rang ko'rinadi. Gap shunga mos keladimi?", 'Вспомни урок: картинку задают через url, маленькая картинка сама повторяется, если картинки нет — виден запасной цвет. Фраза с этим совпадает?', 'Remember the lesson: a picture is given with url, a small picture repeats by itself, and if the picture is missing the backup color shows. Does the sentence match that?'),
    items: [
      { t: L3("background-image da fayl nomi url va qavs ichida yoziladi.", 'В background-image имя файла пишется внутри url и скобок.', 'In background-image the file name goes inside url and brackets.'), right: true, code: 'img',
        why: L3("To'g'ri: url, qavs, qo'shtirnoqda fayl nomi, qavs.", 'Верно: url, скобка, имя файла в кавычках, скобка.', 'Right: url, a bracket, the file name in quotes, a bracket.') },
      { t: L3("Kichik rasm o'z-o'zidan faqat bitta bo'lib chiqadi.", 'Маленькая картинка сама по себе показывается только один раз.', 'A small picture shows up only once by itself.'), right: false,
        why: L3("Aslida kichik rasm o'zi takrorlanadi. Bitta bo'lishi uchun no-repeat kerak.", 'На самом деле маленькая картинка повторяется сама. Чтобы была одна, нужен no-repeat.', 'Actually a small picture repeats by itself. To get one, you need no-repeat.') },
      { t: L3("Rasm topilmasa, background-color rangi ko'rinadi.", 'Если картинка не нашлась, виден цвет из background-color.', 'If the picture isn’t found, the background-color shows.'), right: true, code: 'backup',
        why: L3("Shunday: bu zaxira rang, u sahifani bo'sh qoldirmaydi.", 'Так и есть: это запасной цвет, он не даёт странице остаться пустой.', 'That’s right: it’s a backup color that keeps the page from looking empty.') },
      { t: L3("background-color faqat body uchun ishlaydi.", 'background-color работает только для body.', 'background-color only works for body.'), right: false,
        why: L3("Aslida fonni istalgan elementga berish mumkin: sarlavhaga, abzasga, butun sahifaga.", 'На самом деле фон можно дать любому элементу: заголовку, абзацу, всей странице.', 'Actually you can give any element a background: a heading, a paragraph, the whole page.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz fonni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в фоне.', 'All correct! You know backgrounds really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men background-image dan keyin faqat qo'shtirnoqda fayl nomini yozgan edim? Afsuski, men adashibman. Rasm uchun url so'zi va qavslar kerak. Usiz brauzer bu yozuvni tashlab yuboradi va fon bo'sh qoladi.",
        'Вернёмся к загадке. Помнишь, после background-image я написал только имя файла в кавычках? Увы, я ошибся. Для картинки нужны слово url и скобки. Без них браузер выбрасывает эту запись, и фон остаётся пустым.',
        'Back to our riddle. Remember, after background-image I wrote only the file name in quotes? Sadly, I was wrong. A picture needs the word url and brackets. Without them the browser throws the line away, and the background stays empty.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning sahifangiz, o'zingiz tanlagan fon bilan!", 'Смотри, это твоя страница с фоном, который ты выбрал сам!', 'Look, this is your page with the background you picked yourself!'), k: null },
      { text: L3("background-color istalgan elementning orqasini bo'yaydi.", 'background-color красит фон любого элемента.', 'background-color paints the background of any element.'), k: 'color' },
      { text: L3("background-image url bilan fonga rasm qo'yadi.", 'background-image ставит на фон картинку через url.', 'background-image puts a picture on the background with url.'), k: 'image' },
      { text: L3("background-repeat rasm takrorlanadimi yoki yo'qmi, shuni hal qiladi.", 'background-repeat решает, повторяется картинка или нет.', 'background-repeat decides whether the picture repeats or not.'), k: 'repeat' },
      { text: L3("Tabriklayman! Endi siz sahifaga istalgan fon bera olasiz. Keyingi darsda matn va shriftlar bilan ishlaymiz. Ko'rishguncha!", 'Ура! Теперь ты можешь дать странице любой фон. На следующем уроке поработаем с текстом и шрифтами. До встречи!', 'Hooray! Now you can give a page any background. Next time we’ll work with text and fonts. See you!'), k: null }
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
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayH1: 1, sayP: 1, sayUrl: 1, sayTile: 1, sayOne: 1, sayBig: 1,
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
