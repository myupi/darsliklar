// =============================================================================
// КУРС «CSS» · Урок 5 — «Текст и шрифты»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css5/build.mjs → lessons/css/05-tekst-i-shrifty.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · «Текст и шрифты» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–4: правило, селекторы, цвета, фон. Блог Коди выглядит как черновик: мелкий
// заголовок, буквы как в старой книге, ссылка с подчёркиванием. Ученик узнаёт пять свойств текста: font-size
// (размер в px), font-family (шрифт: serif, sans-serif, monospace, имя шрифта и запасной через запятую), font-weight
// (bold, normal), text-decoration (underline, line-through, none) и text-align (left, center, right).
// Загадка (без имён): Коди написал «font-size: 40;» без px и уверен, что заголовок станет большим.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (блог-черновик → крупный заголовок другим шрифтом по центру, ссылка без черты; загадка)
//   размер:   s2 показ (px; 12px, 24px, заголовок 40px) · s3 вписать 40px (Fill) · s4 размер ↔ надпись (Matching)
//   шрифт:    s5 показ (sans-serif, monospace, Georgia и запасной) · s6 собрать "Courier New", monospace (Code Builder) · s7 какой шрифт у надписи (выбор)
//   вес/черта: s8 показ (bold, text-decoration: none, normal) · s9 вписать none (Fill) · s10 какое свойство (Sort)
//   выравнивание: s11 показ (center, right, left) · s12 вписать center (Fill) · s13 найти сломанное правило (Error Detective)
//   w1 правило целиком: p { font-weight: bold; } (перенос) · s14 своя страница: размер заголовка и шрифт (Live, «Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: верная ли запись — решает сам Chrome (CSS.supports): «font-size: 40» без px, «text-align:
//     middle» — не принимаются, правило не действует. Шрифты — настоящие шрифты браузера.
//   · Узбекский — по /uzbekcha; в речи нет символов: «piksel», «vergul», «qo'shtirnoq».
//
// СИСТЕМА СЛОВ: shrift — шрифт; harf o'lchami — размер букв (draft); piksel — px; qalin — жирный; tagiga chiziq —
// подчёркивание (draft); o'rtaga — по центру. В речи названия свойств и значений — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-05-tekst-i-shrifty',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '5-dars. Matn va shriftlar',
    ru: 'Урок 5. Текст и шрифты',
    en: 'Lesson 5. Text and fonts'
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
  next: L3("O'lchamlar", 'Размеры элементов', 'Element sizes'),
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
  // Блог Коди (не звучит).
  site: {
    title: L3("Kodining blogi", 'Блог Коди', 'Kodi’s blog'),
    p1: L3("Bugun men o'yin yasadim.", 'Сегодня я сделал игру.', 'Today I made a game.'),
    p2: L3("U juda oddiy, lekin qiziqarli.", 'Она простая, но интересная.', 'It’s simple, but fun.'),
    more: L3("Batafsil o'qish", 'Читать дальше', 'Read more'),
    sample: L3("Salom!", 'Привет!', 'Hello!'),
    weight: L3("font-weight", 'font-weight', 'font-weight'),
    deco: L3("text-decoration", 'text-decoration', 'text-decoration')
  },
  s1: {
    eyebrow: L3("Kodining blogi", 'Блог Коди', 'Kodi’s blog'),
    say: L3("Salom! Men blog ochdim, ya'ni o'zim haqimda yozadigan sayt degani. Lekin qarang, u qoralamaga o'xshaydi: sarlavha kichkina, harflar eski kitobdagidek, havola tagida esa chiziq. «Aylantirish» tugmasini bosing.",
      'Привет! Я завёл блог, то есть сайт, где пишу о себе. Но смотри, он похож на черновик: заголовок маленький, буквы как в старой книге, а под ссылкой черта. Нажми «Превратить».',
      'Hi! I started a blog, that is, a site where I write about myself. But look, it looks like a draft: the heading is small, the letters look like an old book, and the link has a line under it. Tap “Transform”.'),
    magic: L3("Mana! Sarlavha katta, boshqa shriftda va o'rtada, havola tagidagi chiziq esa yo'qoldi.", 'Вот! Заголовок крупный, другим шрифтом и по центру, а черта под ссылкой исчезла.', 'There! The heading is big, in another font and centered, and the line under the link is gone.'),
    magicP: L3("HTML kodiga tegmadim. Matnning ko'rinishini CSS o'zgartirdi: o'lcham, shrift, joylashuv va chiziq.", 'HTML я не трогал. Вид текста поменял CSS: размер, шрифт, положение и черту.', 'I didn’t touch the HTML. CSS changed how the text looks: the size, the font, the position and the line.'),
    done: L3("Bugun matn bilan ishlaydigan beshta xususiyatni o'rganasiz. Lekin oldin kichik topishmoq. Birinchi urinishda men sarlavha uchun font-size deb yozdim va yoniga faqat qirq sonini qo'ydim. Menimcha, sarlavha shunchaki katta bo'ladi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты узнаешь пять свойств для текста. Но сначала маленькая загадка. В первый раз я написал для заголовка font-size и поставил рядом просто число сорок. По-моему, заголовок просто станет большим. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn five properties for text. But first, a little riddle. The first time, I wrote font-size for the heading and put just the number forty next to it. I think the heading will simply get big. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("O'lcham, shrift, joy va chiziq — hammasi CSS", 'Размер, шрифт, место и черта — всё CSS', 'Size, font, position and line: all CSS')
  },
  s2: {
    eyebrow: L3("Harf o'lchami", 'Размер букв', 'Text size'),
    say: L3("Birinchi xususiyat font-size, ya'ni harf o'lchami degani. O'lcham piksellarda yoziladi: son va yonida px. Piksel bu ekrandagi eng kichik nuqta. Oddiy matn odatda o'n olti piksel bo'ladi.",
      'Первое свойство — font-size, то есть размер букв. Размер пишут в пикселях: число и рядом px. Пиксель — это самая маленькая точка на экране. Обычный текст — обычно шестнадцать пикселей.',
      'The first property is font-size, meaning the size of the letters. The size is written in pixels: a number with px next to it. A pixel is the smallest dot on the screen. Normal text is usually sixteen pixels.'),
    saySmall: L3("Abzaslarga o'n ikki piksel beramiz. Qarang, matn kichrayib qoldi.", 'Дадим абзацам двенадцать пикселей. Смотри, текст стал мелким.', 'Let’s give the paragraphs twelve pixels. Look, the text got small.'),
    sayBig: L3("Endi yigirma to'rt piksel. Matn kattalashdi. Son qancha katta bo'lsa, harflar ham shuncha katta.", 'Теперь двадцать четыре пикселя. Текст стал крупным. Чем больше число, тем крупнее буквы.', 'Now twenty-four pixels. The text got big. The bigger the number, the bigger the letters.'),
    sayH1: L3("Sarlavhaga esa qirq piksel. Endi u haqiqiy katta sarlavha.", 'А заголовку — сорок пикселей. Теперь это настоящий большой заголовок.', 'And forty pixels for the heading. Now it’s a real big heading.'),
    done: L3("Demak, font-size harf o'lchamini beradi: son va px.", 'Значит, font-size задаёт размер букв: число и px.', 'So font-size sets the size of the letters: a number and px.'),
    askStart: L3("Qarang: font-size — harf o'lchami", 'Смотри: font-size — размер букв', 'Watch: font-size is the text size'),
    askSmall: L3("Qarang: 12px — kichik", 'Смотри: 12px — мелко', 'Watch: 12px is small'),
    askBig: L3("Qarang: 24px — katta", 'Смотри: 24px — крупно', 'Watch: 24px is big'),
    askH1: L3("Qarang: sarlavha 40px", 'Смотри: заголовок 40px', 'Watch: the heading at 40px'),
    askDone: L3("font-size: son va px", 'font-size: число и px', 'font-size: a number and px')
  },
  s3: {
    eyebrow: L3("Katta sarlavha", 'Большой заголовок', 'A big heading'),
    say: L3("Endi navbat sizga. Sarlavhani qirq pikselga kattalashtiring: font-size uchun qiymatni yozing. Px ni unutmang!",
      'Теперь твоя очередь. Сделай заголовок размером сорок пикселей: впиши значение для font-size. Не забудь px!',
      'Now it’s your turn. Make the heading forty pixels: type the value for font-size. Don’t forget px!'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Brauzer bunday qiymatni tashlab yuboradi: son yoniga px qo'shing.", 'Написано только число. Браузер такое значение выбрасывает: добавь к числу px.', 'Only a number. The browser throws a value like that away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing, masalan 30px.", 'Браузер не узнал это значение. Напиши число и px, например 30px.', 'The browser didn’t recognize that value. Write a number and px, for example 30px.'),
      other: L3("Bu boshqa o'lcham. Sarlavha qirq piksel bo'lishi kerak.", 'Это другой размер. Заголовок должен быть сорок пикселей.', 'That’s a different size. The heading should be forty pixels.')
    },
    hints: [
      L3("Qiymat ikki qismdan: son va o'lcham birligi.", 'Значение из двух частей: число и единица.', 'The value has two parts: a number and a unit.'),
      L3("Son qirq, birlik esa px. Ular o'rtasida bo'sh joy yo'q.", 'Число сорок, единица px. Между ними пробела нет.', 'The number is forty and the unit is px. No space between them.'),
      L3("40px deb yozing va Tekshirishni bosing.", 'Впиши 40px и нажми «Проверить».', 'Type 40px and tap Check.')
    ],
    ok: L3("Zo'r! Sarlavha endi katta va ko'zga tashlanadi.", 'Огонь! Заголовок теперь крупный и заметный.', 'Awesome! The heading is big and eye-catching now.'),
    ask: L3("Sarlavhani 40 piksel qiling", 'Сделай заголовок 40 пикселей', 'Make the heading 40 pixels')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi o'lchamlarni yozuvlar bilan juftlang. Chapdan o'lchamni, o'ngdan esa shu o'lchamdagi yozuvni bosing.", 'Теперь соедини размеры с надписями. Нажми размер слева, а потом надпись такого размера справа.', 'Now match the sizes with the words. Tap a size on the left, then the word of that size on the right.'),
    why: {
      s12: L3("O'n ikki piksel eng kichik o'lcham. Eng kichik yozuvni toping.", 'Двенадцать пикселей — самый маленький размер. Найди самую мелкую надпись.', 'Twelve pixels is the smallest size. Find the smallest word.'),
      s24: L3("Yigirma to'rt piksel o'rtacha o'lcham: oddiy matndan kattaroq.", 'Двадцать четыре пикселя — средний размер: крупнее обычного текста.', 'Twenty-four pixels is a medium size: bigger than normal text.'),
      s48: L3("Qirq sakkiz piksel eng katta o'lcham. Eng katta yozuvni toping.", 'Сорок восемь пикселей — самый большой размер. Найди самую крупную надпись.', 'Forty-eight pixels is the biggest size. Find the biggest word.')
    },
    pairOk: {
      s12: L3("To'g'ri, bu eng kichigi.", 'Верно, это самая мелкая.', 'Right, that’s the smallest.'),
      s24: L3("To'g'ri, bu o'rtachasi.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      s48: L3("To'g'ri, bu eng kattasi.", 'Верно, это самая крупная.', 'Right, that’s the biggest.')
    },
    pickFirst: L3("Oldin chapdan o'lchamni tanlang.", 'Сначала выбери размер слева.', 'First pick a size on the left.'),
    hints: [
      L3("Son qancha katta bo'lsa, yozuv ham shuncha katta.", 'Чем больше число, тем крупнее надпись.', 'The bigger the number, the bigger the word.'),
      L3("12px eng kichik, 48px eng katta, 24px o'rtada.", '12px — самая мелкая, 48px — самая крупная, 24px — посередине.', '12px is the smallest, 48px the biggest, and 24px in between.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! O'lchamni ko'z bilan ham taniysiz.", 'Отлично! Ты узнаёшь размер даже на глаз.', 'Great! You can tell the size just by looking.'),
    ask: L3("O'lchamni, keyin yozuvni bosing", 'Нажми размер, потом надпись', 'Tap a size, then a word'),
    askPlace: L3("Endi shu o'lchamdagi yozuvni bosing", 'Теперь нажми надпись такого размера', 'Now tap the word of that size')
  },
  s5: {
    eyebrow: L3("Shrift", 'Шрифт', 'Font'),
    say: L3("Ikkinchi xususiyat font-family, ya'ni shrift degani. Hozir brauzer oddiy shriftni ishlatyapti: harflarda kichik oyoqchalar bor, xuddi kitobdagidek. Bunday shriftlar serif deyiladi.",
      'Второе свойство — font-family, то есть шрифт. Сейчас браузер показывает обычный шрифт: у букв маленькие засечки, как в книге. Такие шрифты называются serif.',
      'The second property is font-family, meaning the font. Right now the browser uses its normal font: the letters have little feet, like in a book. Fonts like that are called serif.'),
    saySans: L3("sans-serif yozamiz. Oyoqchalar yo'qoldi, harflar silliq va zamonaviy bo'ldi.", 'Пишем sans-serif. Засечки пропали, буквы стали гладкими и современными.', 'We write sans-serif. The little feet are gone, and the letters look smooth and modern.'),
    sayMono: L3("monospace da esa har bir harf bir xil kenglikda, xuddi kod muharriridagidek.", 'А в monospace каждая буква одинаковой ширины, как в редакторе кода.', 'And in monospace every letter has the same width, like in a code editor.'),
    sayList: L3("Shrift nomini ham yozish mumkin, masalan Georgia. Vergul bilan zaxira shriftni qo'yamiz: Georgia topilmasa, brauzer serif ni oladi.", 'Можно написать и имя шрифта, например Georgia. Через запятую ставим запасной: если Georgia нет, браузер возьмёт serif.', 'You can also write a font name, for example Georgia. After a comma we put a backup: if Georgia isn’t there, the browser takes serif.'),
    done: L3("Demak, font-family shriftni tanlaydi: serif, sans-serif, monospace yoki shrift nomi va vergul bilan zaxira.", 'Значит, font-family выбирает шрифт: serif, sans-serif, monospace или имя шрифта и запасной через запятую.', 'So font-family picks the font: serif, sans-serif, monospace, or a font name with a backup after a comma.'),
    askStart: L3("Qarang: serif — oyoqchali", 'Смотри: serif — с засечками', 'Watch: serif has little feet'),
    askSans: L3("Qarang: sans-serif — silliq", 'Смотри: sans-serif — гладкий', 'Watch: sans-serif is smooth'),
    askMono: L3("Qarang: monospace — bir xil kenglik", 'Смотри: monospace — одинаковая ширина', 'Watch: monospace has equal widths'),
    askList: L3("Qarang: nom va zaxira shrift", 'Смотри: имя и запасной шрифт', 'Watch: a name and a backup font'),
    askDone: L3("font-family: shrift va zaxira", 'font-family: шрифт и запасной', 'font-family: a font and a backup')
  },
  s6: {
    eyebrow: L3("Shriftni yig'ing", 'Собери шрифт', 'Build the font'),
    say: L3("Endi o'zingiz yig'ing. Blog kod muharririga o'xshasin: shrift Courier New, zaxirasi esa monospace. Bo'laklarni to'g'ri tartibda bosing yoki suring.",
      'Теперь собери сам. Пусть блог будет похож на редактор кода: шрифт Courier New, а запасной — monospace. Нажимай или перетаскивай кусочки в правильном порядке.',
      'Now build it yourself. Let the blog look like a code editor: the font is Courier New, and the backup is monospace. Tap or drag the pieces in the right order.'),
    why: {
      px: L3("px o'lcham uchun edi, shriftga kerak emas.", 'px был для размера, шрифту он не нужен.', 'px was for the size, a font doesn’t need it.'),
      order: L3("Tartib boshqacha: oldin qo'shtirnoqdagi shrift nomi, keyin vergul, oxirida zaxira shrift.", 'Порядок другой: сначала имя шрифта в кавычках, потом запятая, в конце запасной шрифт.', 'The order is different: first the font name in quotes, then a comma, and the backup font last.')
    },
    hints: [
      L3("Oldin asosiy shrift, keyin zaxira.", 'Сначала основной шрифт, потом запасной.', 'The main font first, then the backup.'),
      L3("Shrift nomi qo'shtirnoqda, keyin vergul, keyin monospace.", 'Имя шрифта в кавычках, потом запятая, потом monospace.', 'The font name in quotes, then a comma, then monospace.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми горящий кусочек.', 'Tap the glowing piece.')
    ],
    ok: L3("Barakalla! Blog endi kod muharririga o'xshaydi.", 'Молодец! Теперь блог похож на редактор кода.', 'Well done! Now the blog looks like a code editor.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order')
  },
  s7: {
    eyebrow: L3("Qaysi shrift?", 'Какой шрифт?', 'Which font?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men yozuvni ko'rsataman, siz esa uni qaysi shrift berganini tanlang.", 'Теперь проверь себя. Я покажу надпись, а ты выбери, какой шрифт её дал.', 'Now check yourself. I’ll show some words, and you pick the font that made them.'),
    ask: L3("Bu yozuvni qaysi kod beradi?", 'Какой код даёт эту надпись?', 'Which code makes these words?'),
    hint1: L3("Harflarga qarang: oyoqchalari bormi? Hammasi bir xil kenglikdami?", 'Посмотри на буквы: есть ли засечки? Все ли одинаковой ширины?', 'Look at the letters: do they have little feet? Are they all the same width?'),
    hint2: L3("serif oyoqchali, sans-serif silliq, monospace da esa harflar bir xil kenglikda.", 'serif — с засечками, sans-serif — гладкий, в monospace буквы одинаковой ширины.', 'serif has feet, sans-serif is smooth, and monospace letters are all the same width.'),
    rounds: [
      { want: 'font-family: monospace;', opts: ['font-family: serif;', 'font-family: monospace;', 'font-family: sans-serif;'],
        why: L3("Har bir harf bir xil kenglikda, demak bu monospace.", 'Все буквы одинаковой ширины, значит, это monospace.', 'Every letter is the same width, so it’s monospace.') },
      { want: 'font-family: sans-serif;', opts: ['font-family: sans-serif;', 'font-family: serif;', 'font-family: monospace;'],
        why: L3("Harflar silliq, oyoqchalari yo'q. Demak bu sans-serif.", 'Буквы гладкие, без засечек. Значит, это sans-serif.', 'The letters are smooth with no feet. So it’s sans-serif.') },
      { want: 'font-family: serif;', opts: ['font-family: monospace;', 'font-family: sans-serif;', 'font-family: serif;'],
        why: L3("Harflarda kichik oyoqchalar bor, demak bu serif.", 'У букв маленькие засечки, значит, это serif.', 'The letters have little feet, so it’s serif.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Shriftni ko'rib taniysiz.", 'Всё верно! Ты узнаёшь шрифт на глаз.', 'All correct! You can recognize a font by sight.')
  },
  s8: {
    eyebrow: L3("Qalinlik va chiziq", 'Жирность и черта', 'Weight and line'),
    say: L3("Yana ikki foydali xususiyat bor. font-weight harflar qalinligini beradi, text-decoration esa matn ustidagi yoki ostidagi chiziqni.",
      'Есть ещё два полезных свойства. font-weight задаёт жирность букв, а text-decoration — черту на тексте или под ним.',
      'There are two more useful properties. font-weight sets how thick the letters are, and text-decoration sets a line on or under the text.'),
    sayBold: L3("Abzaslarga font-weight: bold yozamiz. Harflar qalin bo'ldi.", 'Пишем абзацам font-weight: bold. Буквы стали жирными.', 'We write font-weight: bold for the paragraphs. The letters got thick.'),
    sayNone: L3("Havolalar tagida odatda chiziq bo'ladi. text-decoration: none uni olib tashlaydi. underline esa chiziqni qo'yadi, line-through esa so'zni o'chirilgandek qiladi.", 'Под ссылками обычно есть черта. text-decoration: none её убирает. underline ставит черту, а line-through делает слово зачёркнутым.', 'Links usually have a line under them. text-decoration: none removes it. underline adds the line, and line-through crosses the word out.'),
    sayNormal: L3("Sarlavha odatda qalin. font-weight: normal yozsak, u oddiy qalinlikda bo'ladi.", 'Заголовок обычно жирный. Если написать font-weight: normal, он станет обычной толщины.', 'A heading is usually bold. If we write font-weight: normal, it becomes normal thickness.'),
    done: L3("Demak, font-weight qalinlik uchun: bold yoki normal. text-decoration chiziq uchun: underline, line-through yoki none.", 'Значит, font-weight — для жирности: bold или normal. text-decoration — для черты: underline, line-through или none.', 'So font-weight is for thickness: bold or normal. text-decoration is for lines: underline, line-through or none.'),
    askStart: L3("Qarang: qalinlik va chiziq", 'Смотри: жирность и черта', 'Watch: weight and line'),
    askBold: L3("Qarang: bold — qalin", 'Смотри: bold — жирный', 'Watch: bold is thick'),
    askNone: L3("Qarang: none — chiziqsiz", 'Смотри: none — без черты', 'Watch: none means no line'),
    askNormal: L3("Qarang: normal — oddiy", 'Смотри: normal — обычный', 'Watch: normal is regular'),
    askDone: L3("font-weight va text-decoration", 'font-weight и text-decoration', 'font-weight and text-decoration')
  },
  s9: {
    eyebrow: L3("Chiziqsiz havola", 'Ссылка без черты', 'A link with no line'),
    say: L3("Havola tagidagi chiziqni olib tashlang: text-decoration uchun qiymatni yozing.", 'Убери черту под ссылкой: впиши значение для text-decoration.', 'Remove the line under the link: type the value for text-decoration.'),
    msgs: {
      empty: L3("text-decoration uchun qiymat yozing.", 'Впиши значение для text-decoration.', 'Type a value for text-decoration.'),
      under: L3("underline chiziqni qo'yadi, u esa allaqachon bor. Bizga chiziqsiz qiymat kerak.", 'underline ставит черту, а она и так есть. Нам нужно значение без черты.', 'underline adds the line, and it’s already there. We need the value for no line.'),
      through: L3("line-through so'zni o'chirilgandek qildi. Bizga chiziqsiz qiymat kerak.", 'line-through зачеркнул слово. Нам нужно значение без черты.', 'line-through crossed the word out. We need the value for no line.'),
      other: L3("Brauzer bu qiymatni tanimadi. Chiziqsiz degani none.", 'Браузер не узнал это значение. Без черты — это none.', 'The browser didn’t recognize that value. No line is none.')
    },
    hints: [
      L3("Inglizcha «hech narsa» degan so'z qanday edi?", 'Как было английское слово «ничего»?', 'What was the English word for “nothing”?'),
      L3("text-decoration ning chiziqsiz qiymati to'rt harfli so'z.", 'Значение text-decoration без черты — слово из четырёх букв.', 'The no-line value of text-decoration is a four-letter word.'),
      L3("none deb yozing va Tekshirishni bosing.", 'Впиши none и нажми «Проверить».', 'Type none and tap Check.')
    ],
    ok: L3("Zo'r! Havola endi toza, tagida chiziq yo'q.", 'Огонь! Ссылка теперь чистая, черты нет.', 'Awesome! The link is clean now, with no line.'),
    ask: L3("Havola tagidagi chiziqni olib tashlang", 'Убери черту под ссылкой', 'Remove the line under the link')
  },
  s10: {
    eyebrow: L3("Qaysi xususiyat?", 'Какое свойство?', 'Which property?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men yozuvni ko'rsataman, siz esa uni qaysi xususiyat o'zgartirganini tanlang: font-weight yoki text-decoration.", 'Теперь проверь себя. Я покажу надпись, а ты выбери, какое свойство её изменило: font-weight или text-decoration.', 'Now check yourself. I’ll show some words, and you pick which property changed them: font-weight or text-decoration.'),
    ask: L3("Bu yozuvni qaysi xususiyat o'zgartirdi?", 'Какое свойство изменило эту надпись?', 'Which property changed these words?'),
    card: L3('Yozuv', 'Надпись', 'Words'),
    hint1: L3("Harflarning o'zi o'zgardimi yoki ularga chiziq qo'shildimi?", 'Изменились сами буквы или к ним добавилась черта?', 'Did the letters themselves change, or was a line added?'),
    hint2: L3("Qalinlik font-weight dan, chiziq esa text-decoration dan.", 'Жирность — от font-weight, черта — от text-decoration.', 'Thickness comes from font-weight, and lines come from text-decoration.'),
    items: [
      { css: 'font-weight: bold', right: 'weight', why: L3("Harflar qalin bo'ldi, demak bu font-weight.", 'Буквы стали жирными, значит, это font-weight.', 'The letters got thick, so it’s font-weight.') },
      { css: 'text-decoration: underline', right: 'deco', why: L3("So'z tagida chiziq paydo bo'ldi, demak bu text-decoration.", 'Под словом появилась черта, значит, это text-decoration.', 'A line appeared under the word, so it’s text-decoration.') },
      { css: 'text-decoration: line-through', right: 'deco', why: L3("So'z ustidan chiziq o'tdi, bu ham text-decoration.", 'Слово перечёркнуто, это тоже text-decoration.', 'The word is crossed out, that’s text-decoration too.') },
      { css: 'font-weight: normal; font-size: 26px', right: 'weight', why: L3("Katta sarlavha qalin emas, oddiy bo'ldi. Bu font-weight: normal.", 'Крупный заголовок стал не жирным, а обычным. Это font-weight: normal.', 'The big heading isn’t bold, it’s regular. That’s font-weight: normal.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Qalinlik va chiziqni adashtirmaysiz.", 'Всё верно! Ты не путаешь жирность и черту.', 'All correct! You don’t mix up weight and lines.')
  },
  s11: {
    eyebrow: L3("Joylashuv", 'Выравнивание', 'Alignment'),
    say: L3("Oxirgi xususiyat text-align, ya'ni matnni qatorning qaysi tomoniga qo'yish degani. Odatda matn chapda turadi.", 'Последнее свойство — text-align, то есть к какому краю строки поставить текст. Обычно текст стоит слева.', 'The last property is text-align, meaning which side of the line the text goes to. Normally text sits on the left.'),
    sayCenter: L3("Sarlavhaga text-align: center yozamiz. Sarlavha o'rtaga keldi.", 'Пишем заголовку text-align: center. Заголовок встал по центру.', 'We write text-align: center for the heading. The heading moved to the center.'),
    sayRight: L3("right yozsak, o'ng tomonga o'tadi.", 'Если написать right, он уедет вправо.', 'If we write right, it moves to the right.'),
    sayLeft: L3("left esa yana chapga qaytaradi. Bu qiymat odatiy.", 'А left вернёт его влево. Это значение по умолчанию.', 'And left brings it back to the left. That’s the default value.'),
    done: L3("Demak, text-align matnni qatorda joylaydi: left, center yoki right.", 'Значит, text-align ставит текст в строке: left, center или right.', 'So text-align places text on the line: left, center or right.'),
    askStart: L3("Qarang: odatda chapda", 'Смотри: обычно слева', 'Watch: normally on the left'),
    askCenter: L3("Qarang: center — o'rtada", 'Смотри: center — по центру', 'Watch: center'),
    askRight: L3("Qarang: right — o'ngda", 'Смотри: right — справа', 'Watch: right'),
    askLeft: L3("Qarang: left — chapda", 'Смотри: left — слева', 'Watch: left'),
    askDone: L3("text-align: left, center, right", 'text-align: left, center, right', 'text-align: left, center, right')
  },
  s12: {
    eyebrow: L3("O'rtadagi sarlavha", 'Заголовок по центру', 'A centered heading'),
    say: L3("Sarlavhani o'rtaga qo'ying: text-align uchun qiymatni yozing.", 'Поставь заголовок по центру: впиши значение для text-align.', 'Center the heading: type the value for text-align.'),
    msgs: {
      empty: L3("text-align uchun qiymat yozing.", 'Впиши значение для text-align.', 'Type a value for text-align.'),
      middle: L3("middle so'zini brauzer tanimaydi. O'rta degani CSS da center.", 'Слово middle браузер не знает. По центру в CSS — это center.', 'The browser doesn’t know middle. Centered in CSS is center.'),
      side: L3("Sarlavha chetga ketdi. Bizga o'rta kerak.", 'Заголовок ушёл к краю. Нам нужна середина.', 'The heading went to an edge. We need the middle.'),
      other: L3("Brauzer bu qiymatni tanimadi. O'rta degani center.", 'Браузер не узнал это значение. По центру — это center.', 'The browser didn’t recognize that value. Centered is center.')
    },
    hints: [
      L3("O'rta inglizcha qanday ataladi?", 'Как «центр» по-английски?', 'What is the middle called in English?'),
      L3("text-align ning uchta qiymati: left, center va right. Bizga o'rtadagisi kerak.", 'У text-align три значения: left, center и right. Нам нужно среднее.', 'text-align has three values: left, center and right. We need the middle one.'),
      L3("center deb yozing va Tekshirishni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Ajoyib! Sarlavha o'rtada, blog chiroyli ko'rinyapti.", 'Отлично! Заголовок по центру, блог смотрится красиво.', 'Great! The heading is centered, and the blog looks nice.'),
    ask: L3("Sarlavhani o'rtaga qo'ying", 'Поставь заголовок по центру', 'Center the heading')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va buzilgan qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми сломанное правило.', 'Now check yourself. There are three rules, but one doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: uning natijasi sahifada ko'rinib turibdi. Nima o'zgarmay qoldi?", 'Это правило работает: его результат виден на странице. Что не изменилось?', 'This rule works: you can see its result on the page. What didn’t change?'),
    found: {
      unit: L3("Topdingiz! O'ttiz ikki sonidan keyin px yo'q edi, shuning uchun brauzer bu qoidani tashlab yubordi.", 'Нашёл! После тридцати двух не было px, поэтому браузер выбросил это правило.', 'Found it! There was no px after thirty-two, so the browser threw the rule away.'),
      align: L3("Topdingiz! middle degan qiymat yo'q, o'rta degani center.", 'Нашёл! Значения middle нет, по центру — это center.', 'Found it! There’s no middle value; centered is center.')
    },
    hint1: L3("Sahifaga qarang: nima kutilganidek chiqmadi?", 'Посмотри на страницу: что вышло не так, как ждали?', 'Look at the page: what didn’t come out as expected?'),
    hint2: {
      unit: L3("Sarlavha kattalashmadi. Uning o'lchami yonida birlik bormi?", 'Заголовок не стал крупнее. Есть ли единица у его размера?', 'The heading didn’t get bigger. Does its size have a unit?'),
      align: L3("Abzaslar o'rtaga kelmadi. text-align qiymatiga qarang.", 'Абзацы не встали по центру. Посмотри на значение text-align.', 'The paragraphs didn’t center. Look at the text-align value.')
    },
    hint3: {
      unit: L3("Xato birinchi qoidada: px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      align: L3("Xato ikkinchi qoidada: middle. O'sha qatorni bosing.", 'Ошибка во втором правиле: middle. Нажми эту строку.', 'The bug is in the second rule: middle. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz matnni haqiqiy dizayner kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь текст как настоящий дизайнер.', 'Super! Both are found. You check text like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Abzaslardagi harflarni qalin qiling: p uchun font-weight xususiyatini yozing.", 'Теперь напиши правило целиком сам. Сделай буквы в абзацах жирными: напиши для p свойство font-weight.', 'Now write the whole rule yourself. Make the letters in the paragraphs bold: write the font-weight property for p.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin jingalak qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Abzaslar uchun p selektori kerak.", 'Для абзацев нужен селектор p.', 'The paragraphs need the p selector.'),
      prop: L3("Qalinlikni font-weight xususiyati beradi.", 'Жирность задаёт свойство font-weight.', 'The font-weight property sets the thickness.'),
      notOk: L3("Brauzer bu qiymatni tanimadi. Qalin degani bold.", 'Браузер не узнал это значение. Жирный — это bold.', 'The browser didn’t recognize that value. Thick is bold.'),
      other: L3("Harflar qalin bo'lmadi. Bizga bold kerak.", 'Буквы не стали жирными. Нам нужен bold.', 'The letters didn’t get thick. We need bold.')
    },
    hints: [
      L3("Abzaslar qaysi selektor bilan tanlanadi? Qalinlik uchun qaysi xususiyat kerak?", 'Каким селектором выбирают абзацы? Какое свойство нужно для жирности?', 'Which selector picks the paragraphs? Which property is for thickness?'),
      L3("Selektor p, xususiyat font-weight, qiymat bold.", 'Селектор p, свойство font-weight, значение bold.', 'The selector is p, the property font-weight, the value bold.'),
      L3("Shunday yozing: p, jingalak qavs, font-weight, ikki nuqta, bold, nuqtali vergul va yopuvchi jingalak qavs.", 'Напиши так: p, фигурная скобка, font-weight, двоеточие, bold, точка с запятой и закрывающая фигурная скобка.', 'Write: p, a curly brace, font-weight, a colon, bold, a semicolon and a closing curly brace.')
    ],
    ok: L3("Ajoyib! Abzaslar qalin bo'ldi. Qoidani o'zingiz yozdingiz.", 'Отлично! Абзацы стали жирными. Ты сам написал правило.', 'Great! The paragraphs are bold. You wrote the rule yourself.'),
    ask: L3("Abzaslarni qalin qiladigan qoidani yozing", 'Напиши правило, которое сделает абзацы жирными', 'Write a rule that makes the paragraphs bold')
  },
  s14: {
    eyebrow: L3("O'z blogingiz", 'Свой блог', 'Your own blog'),
    say: L3("Endi o'z sahifangizni bezang. Sarlavha uchun istalgan o'lchamni yozing, butun sahifa uchun esa istalgan shriftni. Keyin «Tayyor»ni bosing.", 'Теперь укрась свою страницу. Впиши любой размер для заголовка и любой шрифт для всей страницы. Потом нажми «Готово».', 'Now decorate your own page. Type any size for the heading and any font for the whole page. Then tap “Done”.'),
    msgs: {
      size: L3("Brauzer {w} ni o'lcham deb tanimadi. Son va px yozing.", 'Браузер не узнал размер в {w}. Напиши число и px.', 'The browser didn’t recognize {w} as a size. Write a number and px.'),
      font: L3("Brauzer {w} ni shrift deb tanimadi. Masalan, sans-serif yoki monospace yozing.", 'Браузер не узнал шрифт в {w}. Напиши, например, sans-serif или monospace.', 'The browser didn’t recognize {w} as a font. Write sans-serif or monospace, for example.')
    },
    hints: [
      L3("Sarlavha qanchalik katta bo'lsin? Qaysi shrift sizga yoqadi?", 'Насколько большим будет заголовок? Какой шрифт тебе нравится?', 'How big should the heading be? Which font do you like?'),
      L3("O'lcham son va px bilan, shrift esa nom yoki serif, sans-serif, monospace bilan.", 'Размер — число и px, шрифт — имя или serif, sans-serif, monospace.', 'The size is a number and px; the font is a name or serif, sans-serif, monospace.'),
      L3("Masalan, o'lchamga 36px, shriftga sans-serif yozing. Keyin «Tayyor»ni bosing.", 'Например, впиши 36px для размера и sans-serif для шрифта. Потом нажми «Готово».', 'For example, type 36px for the size and sans-serif for the font. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning blogingiz.", 'Ого, как красиво! Это твой блог.', 'Wow, how pretty! That’s your blog.'),
    ask: L3("O'lcham va shriftni yozing, «Tayyor»ni bosing", 'Впиши размер и шрифт, нажми «Готово»', 'Type a size and a font, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapda qaysi xususiyat haqida gap ketyapti?", 'О каком свойстве эта фраза?', 'Which property is the sentence about?'),
    hint2: L3("Dars esingizdami: font-size son va px bilan, text-align joylaydi, font-weight qalinlik beradi, text-decoration chiziq. Gap shunga mos keladimi?", 'Вспомни урок: font-size — число и px, text-align выравнивает, font-weight даёт жирность, text-decoration — черту. Фраза с этим совпадает?', 'Remember the lesson: font-size is a number and px, text-align aligns, font-weight sets thickness, text-decoration sets lines. Does the sentence match that?'),
    items: [
      { t: L3("font-size ga faqat son yozsa ham bo'ladi, px shart emas.", 'В font-size можно писать просто число, px не обязателен.', 'You can write just a number in font-size; px isn’t needed.'), right: false, code: 'unit',
        why: L3("Aslida px kerak. Usiz brauzer qiymatni tashlab yuboradi.", 'На самом деле px нужен. Без него браузер выбрасывает значение.', 'Actually px is needed. Without it the browser throws the value away.') },
      { t: L3("text-align: center matnni o'rtaga qo'yadi.", 'text-align: center ставит текст по центру.', 'text-align: center centers the text.'), right: true, code: 'center',
        why: L3("To'g'ri: center o'rta degani.", 'Верно: center — это по центру.', 'Right: center means the middle.') },
      { t: L3("font-weight: bold harflarni qalin qiladi.", 'font-weight: bold делает буквы жирными.', 'font-weight: bold makes the letters thick.'), right: true,
        why: L3("Shunday: bold qalin degani.", 'Так и есть: bold — жирный.', 'That’s right: bold means thick.') },
      { t: L3("text-decoration: none havola tagiga chiziq qo'yadi.", 'text-decoration: none ставит черту под ссылкой.', 'text-decoration: none puts a line under a link.'), right: false,
        why: L3("Aslida none chiziqni olib tashlaydi. Chiziqni underline qo'yadi.", 'На самом деле none убирает черту. Черту ставит underline.', 'Actually none removes the line. underline adds it.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz matn bilan ishlashni bilasiz.", 'Всё верно! Ты умеешь работать с текстом.', 'All correct! You know how to work with text.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men font-size ga faqat qirq sonini yozgan edim? Afsuski, men adashibman. O'lchamga birlik kerak, masalan px. Usiz brauzer qoidani tashlab yuboradi va sarlavha kichkinaligicha qoladi.",
        'Вернёмся к загадке. Помнишь, я написал в font-size просто число сорок? Увы, я ошибся. Размеру нужна единица, например px. Без неё браузер выбрасывает правило, и заголовок остаётся маленьким.',
        'Back to our riddle. Remember, I wrote just the number forty in font-size? Sadly, I was wrong. A size needs a unit, like px. Without it the browser throws the rule away, and the heading stays small.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning blogingiz, o'zingiz tanlagan o'lcham va shrift bilan!", 'Смотри, это твой блог с размером и шрифтом, которые ты выбрал сам!', 'Look, this is your blog with the size and font you picked yourself!'), k: null },
      { text: L3("font-size o'lchamni, font-family shriftni beradi.", 'font-size задаёт размер, font-family — шрифт.', 'font-size sets the size, and font-family sets the font.'), k: 'size' },
      { text: L3("font-weight qalinlikni, text-decoration chiziqni boshqaradi.", 'font-weight управляет жирностью, text-decoration — чертой.', 'font-weight controls thickness, and text-decoration controls lines.'), k: 'weight' },
      { text: L3("text-align esa matnni chapga, o'rtaga yoki o'ngga qo'yadi.", 'А text-align ставит текст влево, по центру или вправо.', 'And text-align puts text on the left, in the center or on the right.'), k: 'align' },
      { text: L3("Tabriklayman! Endi matningiz siz xohlagandek ko'rinadi. Keyingi darsda elementlar o'lchamlari bilan ishlaymiz. Ko'rishguncha!", 'Ура! Теперь твой текст выглядит так, как ты хочешь. На следующем уроке поработаем с размерами элементов. До встречи!', 'Hooray! Now your text looks the way you want. Next time we’ll work with element sizes. See you!'), k: null }
    ],
    roles: {
      size: L3('font-size, font-family', 'font-size, font-family', 'font-size, font-family'),
      weight: L3('font-weight, text-decoration', 'font-weight, text-decoration', 'font-weight, text-decoration'),
      align: L3('text-align', 'text-align', 'text-align')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, saySmall: 1, sayBig: 1, sayH1: 1, saySans: 1, sayMono: 1,
  sayList: 1, sayBold: 1, sayNone: 1, sayNormal: 1, sayCenter: 1, sayRight: 1, sayLeft: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c5-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c5.css@*/
`;
