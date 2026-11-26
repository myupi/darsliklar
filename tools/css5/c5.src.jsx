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
    say: L3("Salom! Men o'zimning blogimni ochdim. Blog bu odam o'zi haqida yozib boradigan sayt bo'ladi. Lekin bir qarang-chi, u hali qoralamaga o'xshaydi: sarlavhasi kichkina, harflari eski kitobdagidek, havolaning tagida esa chiziq turibdi. Qani, «Aylantirish» tugmasini bosing!",
      'Привет! Я завёл блог, то есть сайт, где пишу о себе. Но смотри, он похож на черновик: заголовок маленький, буквы как в старой книге, а под ссылкой черта. Нажми «Превратить».',
      'Hi! I started a blog, that is, a site where I write about myself. But look, it looks like a draft: the heading is small, the letters look like an old book, and the link has a line under it. Tap “Transform”.'),
    magic: L3("Voy, qarang! Sarlavha kattalashdi, shrifti almashdi, o'zi esa qoq o'rtaga kelib oldi. Havolaning tagidagi chiziq ham yo'qolibdi!", 'Вот! Заголовок крупный, другим шрифтом и по центру, а черта под ссылкой исчезла.', 'There! The heading is big, in another font and centered, and the line under the link is gone.'),
    magicP: L3("Sezdingizmi? Men HTML kodiga umuman tegmadim. Matnning ko'rinishini CSS o'zgartirdi: o'lchamini ham, shriftini ham, joyini ham, chizig'ini ham.", 'HTML я не трогал. Вид текста поменял CSS: размер, шрифт, положение и черту.', 'I didn’t touch the HTML. CSS changed how the text looks: the size, the font, the position and the line.'),
    done: L3("Bugun siz matnni bezaydigan beshta xususiyatni o'rganasiz. Keling, bir bahslashamiz! Men sarlavhaga font-size yozib, yoniga faqat qirq sonini qo'ydim. Ishonchim komil: sarlavha shundoq ham kattalashadi. Siz nima deysiz, bu bahsda men yutamanmi yoki yutqazamanmi? Kim haq ekanini dars oxirida blogimning o'zida ko'ramiz.",
      'Сегодня ты узнаешь пять свойств для текста. Но сначала маленькая загадка. В первый раз я написал для заголовка font-size и поставил рядом просто число сорок. По-моему, заголовок просто станет большим. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn five properties for text. But first, a little riddle. The first time, I wrote font-size for the heading and put just the number forty next to it. I think the heading will simply get big. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("O'lcham, shrift, joy va chiziq — hammasi CSS", 'Размер, шрифт, место и черта — всё CSS', 'Size, font, position and line: all CSS')
  },
  s2: {
    eyebrow: L3("Harf o'lchami", 'Размер букв', 'Text size'),
    help: [
      L3("Oldin kodga bir qarang-chi: font-size qatorida son o'zgarib turibdi. Endi brauzerga ko'z tashlang: son o'zgarishi bilan harflar ham darrov kattalashadi yoki kichrayadi.", 'Посмотри на код: в строке font-size меняется число. Потом посмотри в браузер: буквы сразу становятся крупнее или мельче.', 'Look at the code: the number in the font-size line changes. Then look at the browser: the letters get bigger or smaller right away.'),
      L3("Nega shunday bo'lyapti? Chunki font-size brauzerga harflar qancha katta bo'lishini aytadi. Son qancha katta bo'lsa, harflar ham shuncha yirik chiqadi. Faqat son yonida doim px turishi kerak.", 'font-size говорит, какого размера буквы. Больше число — крупнее буквы. Рядом с числом всегда пишут px.', 'font-size says how big the letters are. A bigger number means bigger letters. You always write px next to the number.'),
      L3("Telefoningizda harflarni kattalashtirib ko'rganmisiz? Shunda xabarlar yiriklashib, o'qish osonlashadi. font-size ham saytdagi harflarni xuddi shunday kattalashtiradi: yigirma to'rt piksel bo'lsa, matn yirikroq chiqadi.", 'Помнишь, в телефоне можно сделать шрифт крупнее? Это то же самое: двадцать четыре пикселя — текст крупнее, читать легче.', 'Have you ever made the text bigger on a phone? It’s the same thing: twenty-four pixels means bigger text that’s easier to read.')
    ],
    say: L3("Birinchi xususiyatimizning nomi font-size, ya'ni harf o'lchami degani. O'lcham pikselda yoziladi: oldin son, yonida esa px. Piksel nima deysizmi? Bu ekrandagi eng kichkina nuqta. Oddiy matn odatda o'n olti piksel bo'ladi. Qani, sonni o'zgartirib ko'ramiz!",
      'Первое свойство — font-size, то есть размер букв. Размер пишут в пикселях: число и рядом px. Пиксель — это самая маленькая точка на экране. Обычный текст — обычно шестнадцать пикселей.',
      'The first property is font-size, meaning the size of the letters. The size is written in pixels: a number with px next to it. A pixel is the smallest dot on the screen. Normal text is usually sixteen pixels.'),
    saySmall: L3("Oldin abzaslarga o'n ikki piksel beramiz. Qarang-chi, matn maydalashib qoldi, o'qish ham qiyinlashdi.", 'Дадим абзацам двенадцать пикселей. Смотри, текст стал мелким.', 'Let’s give the paragraphs twelve pixels. Look, the text got small.'),
    sayBig: L3("Endi o'n ikki o'rniga yigirma to'rt piksel yozamiz. Ana, matn birdan yiriklashdi! Ko'rdingizmi, son qancha katta bo'lsa, harflar ham shuncha katta bo'ladi.", 'Теперь двадцать четыре пикселя. Текст стал крупным. Чем больше число, тем крупнее буквы.', 'Now twenty-four pixels. The text got big. The bigger the number, the bigger the letters.'),
    sayH1: L3("Sarlavhaga esa qirq piksel beramiz. Mana endi u haqiqiy katta sarlavhaga o'xshab qoldi!", 'А заголовку — сорок пикселей. Теперь это настоящий большой заголовок.', 'And forty pixels for the heading. Now it’s a real big heading.'),
    done: L3("Demak, harflarning o'lchamini font-size beradi, qiymatiga esa son va px yoziladi.", 'Значит, font-size задаёт размер букв: число и px.', 'So font-size sets the size of the letters: a number and px.'),
    askStart: L3("Qarang: font-size — harf o'lchami", 'Смотри: font-size — размер букв', 'Watch: font-size is the text size'),
    askSmall: L3("Qarang: 12px — kichik", 'Смотри: 12px — мелко', 'Watch: 12px is small'),
    askBig: L3("Qarang: 24px — katta", 'Смотри: 24px — крупно', 'Watch: 24px is big'),
    askH1: L3("Qarang: sarlavha 40px", 'Смотри: заголовок 40px', 'Watch: the heading at 40px'),
    askDone: L3("font-size: son va px", 'font-size: число и px', 'font-size: a number and px')
  },
  s3: {
    eyebrow: L3("Katta sarlavha", 'Большой заголовок', 'A big heading'),
    say: L3("Blogimning sarlavhasini endi o'zingiz kattalashtiring! U qirq piksel bo'lsin: font-size uchun qiymatni yozing. Faqat px qo'shishni unutmang!",
      'Теперь твоя очередь. Сделай заголовок размером сорок пикселей: впиши значение для font-size. Не забудь px!',
      'Now it’s your turn. Make the heading forty pixels: type the value for font-size. Don’t forget px!'),
    msgs: {
      empty: L3("Maydon hali bo'm-bo'sh turibdi. Sarlavha uchun son yozing-da, yoniga px qo'shing.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Bu yerda yolg'iz son turibdi. Brauzer birliksiz sonni tushunmaydi va o'tkazib yuboradi, shuning uchun son yoniga px qo'shing.", 'Написано только число. Браузер такое значение выбрасывает: добавь к числу px.', 'Only a number. The browser throws a value like that away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni taniy olmadi. Son yozing-da, yoniga px qo'shing, masalan, 30px.", 'Браузер не узнал это значение. Напиши число и px, например 30px.', 'The browser didn’t recognize that value. Write a number and px, for example 30px.'),
      other: L3("Bunday o'lcham ham bo'ladi, lekin bizning sarlavhaga roppa-rosa qirq piksel kerak.", 'Это другой размер. Заголовок должен быть сорок пикселей.', 'That’s a different size. The heading should be forty pixels.'),
      space: L3("Son bilan px o'rtasida bo'sh joy qolib ketibdi. Ularni qo'shib yozing, masalan, 30px.", "Между числом и px не нужен пробел: пиши слитно, например 30px.", "No space between the number and px: write them together, like 30px.")
    },
    hints: [
      L3("Qiymat ikki bo'lakdan turadi: oldin son keladi, keyin o'lchov birligi.", 'Значение из двух частей: число и единица.', 'The value has two parts: a number and a unit.'),
      L3("Bizga qirq soni kerak, birligi esa px bo'ladi. Ularni bo'sh joysiz, qo'shib yozasiz.", 'Число сорок, единица px. Между ними пробела нет.', 'The number is forty and the unit is px. No space between them.'),
      L3("Maydonga 40px deb yozing-da, «Tekshirish»ni bosing.", 'Впиши 40px и нажми «Проверить».', 'Type 40px and tap Check.')
    ],
    ok: L3("Zo'r! Sarlavham endi katta bo'ldi, blogga kirgan odam uni darrov ko'radi.", 'Огонь! Заголовок теперь крупный и заметный.', 'Awesome! The heading is big and eye-catching now.'),
    ask: L3("Sarlavhani 40 piksel qiling", 'Сделай заголовок 40 пикселей', 'Make the heading 40 pixels')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Keling, ko'zimizni sinab ko'ramiz! O'ngda uchta «Salom!» yozuvi turibdi, har biri boshqa o'lchamda. Oldin chapdan o'lchamni, keyin o'ngdan shu o'lchamdagi yozuvni bosing.", 'Теперь соедини размеры с надписями. Нажми размер слева, а потом надпись такого размера справа.', 'Now match the sizes with the words. Tap a size on the left, then the word of that size on the right.'),
    why: {
      s12: L3("Hechqisi yo'q! O'n ikki piksel uchala o'lchamning eng kichigi bo'ladi, shuning uchun unga eng mayda yozuvni qidiring.", 'Двенадцать пикселей — самый маленький размер. Найди самую мелкую надпись.', 'Twelve pixels is the smallest size. Find the smallest word.'),
      s24: L3("Unday emas: yigirma to'rt piksel o'rtacha o'lcham bo'ladi. U oddiy matndan kattaroq, lekin eng katta yozuv emas.", 'Двадцать четыре пикселя — средний размер: крупнее обычного текста.', 'Twenty-four pixels is a medium size: bigger than normal text.'),
      s48: L3("Yana bir qarang-chi: qirq sakkiz piksel bu yerdagi eng katta o'lcham. Unga eng yirik yozuv mos keladi.", 'Сорок восемь пикселей — самый большой размер. Найди самую крупную надпись.', 'Forty-eight pixels is the biggest size. Find the biggest word.')
    },
    pairOk: {
      s12: L3("To'ppa-to'g'ri, eng mayda yozuv shu!", 'Верно, это самая мелкая.', 'Right, that’s the smallest.'),
      s24: L3("Ha, o'rtachasi aynan shu.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      s48: L3("Ana, eng kattasi ham joyini topdi!", 'Верно, это самая крупная.', 'Right, that’s the biggest.')
    },
    pickFirst: L3("Oldin chapdan o'lchamni tanlang.", 'Сначала выбери размер слева.', 'First pick a size on the left.'),
    hints: [
      L3("Sonlarni solishtiring: son qancha katta bo'lsa, yozuv ham shuncha yirik bo'ladi.", 'Чем больше число, тем крупнее надпись.', 'The bigger the number, the bigger the word.'),
      L3("12px eng mayda yozuvniki, 48px eng kattasiniki, 24px esa ularning o'rtasida turadi.", '12px — самая мелкая, 48px — самая крупная, 24px — посередине.', '12px is the smallest, 48px the biggest, and 24px in between.'),
      L3("Yonib turgan o'lcham bilan yozuvni ketma-ket bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Endi o'lchamni yozuvning o'ziga qarab ham bilib olasiz.", 'Отлично! Ты узнаёшь размер даже на глаз.', 'Great! You can tell the size just by looking.'),
    ask: L3("O'lchamni, keyin yozuvni bosing", 'Нажми размер, потом надпись', 'Tap a size, then a word'),
    askPlace: L3("Endi shu o'lchamdagi yozuvni bosing", 'Теперь нажми надпись такого размера', 'Now tap the word of that size')
  },
  s5: {
    eyebrow: L3("Shrift", 'Шрифт', 'Font'),
    help: [
      L3("font-family qatoridagi so'zga bir qarang-chi, keyin brauzerdagi harflarga ham. So'z almashishi bilan harflarning shakli ham o'zgarib qoladi.", 'Посмотри на слово в строке font-family и на форму букв в браузере: меняется слово — меняется и форма букв.', 'Look at the word in the font-family line and at the shape of the letters in the browser: when the word changes, the letters change shape.'),
      L3("Bu so'z shriftni tanlaydi. serif yozsangiz, harflarning uchida kitobdagidek kichkina oyoqchalar bo'ladi. sans-serif bilan harflar silliq chiqadi, monospace bilan esa hamma harf bir xil kenglikda turadi.", 'font-family выбирает шрифт. В serif у букв маленькие засечки, как в книге. В sans-serif буквы гладкие. В monospace все буквы одной ширины.', 'font-family picks the font. serif letters have little feet, like in a book. sans-serif letters are smooth. In monospace every letter has the same width.'),
      L3("Kitobdagi harflarni telefoningizdagi harflar bilan solishtirib ko'ring: ular har xil ko'rinadi-ku. Saytda ham shunday: font-family bilan sarlavhaga bitta shrift, matnga boshqasini tanlash mumkin.", 'Сравни буквы в книге и в телефоне: они выглядят по-разному. На сайте тоже можно взять один шрифт для заголовка, а другой для текста.', 'Compare the letters in a book and on a phone: they look different. On a site you can also pick one font for headings and another for text.')
    ],
    say: L3("Endi ikkinchi xususiyatga o'tamiz: font-family. U harflarning shriftini tanlaydi. Hozir brauzer o'zining oddiy shriftini ishlatyapti. Harflarga yaqinroq qarang-chi: uchlarida kitobdagidek kichkina oyoqchalar bor. Bunday shriftlar serif deyiladi.",
      'Второе свойство — font-family, то есть шрифт. Сейчас браузер показывает обычный шрифт: у букв маленькие засечки, как в книге. Такие шрифты называются serif.',
      'The second property is font-family, meaning the font. Right now the browser uses its normal font: the letters have little feet, like in a book. Fonts like that are called serif.'),
    saySans: L3("Endi sans-serif yozib ko'ramiz. Sezdingizmi? Oyoqchalar g'oyib bo'ldi, harflar esa silliq va zamonaviy bo'lib qoldi!", 'Пишем sans-serif. Засечки пропали, буквы стали гладкими и современными.', 'We write sans-serif. The little feet are gone, and the letters look smooth and modern.'),
    sayMono: L3("monospace yozsak-chi? Ana, endi har bir harf bir xil kenglikda turibdi, xuddi kod muharriridagidek.", 'А в monospace каждая буква одинаковой ширины, как в редакторе кода.', 'And in monospace every letter has the same width, like in a code editor.'),
    sayList: L3("Shriftning nomini ham yozsa bo'ladi, masalan, Georgia. Uning ortidan vergul qo'yib, zaxira shriftni yozamiz. Nega kerak? Chunki Georgia topilmasa, brauzer serif shriftini oladi. Agar shrift nomi ikki so'zdan bo'lsa, masalan, Courier New, uni qo'shtirnoq ichiga olamiz.", "Можно написать и имя шрифта, например Georgia. Через запятую ставим запасной: если Georgia нет, браузер возьмёт serif. А если в имени шрифта два слова, его берут в кавычки, например Courier New.", "You can also write a font name, for example Georgia. After a comma we put a backup: if Georgia isn’t there, the browser takes serif. And if a font name has two words, we put it in quotes, for example Courier New."),
    done: L3("Shunday qilib, font-family shriftni tanlaydi: serif, sans-serif yoki monospace. Xohlasangiz, shrift nomini yozib, vergul bilan zaxirasini ham qo'shasiz.", 'Значит, font-family выбирает шрифт: serif, sans-serif, monospace или имя шрифта и запасной через запятую.', 'So font-family picks the font: serif, sans-serif, monospace, or a font name with a backup after a comma.'),
    askStart: L3("Qarang: serif — oyoqchali", 'Смотри: serif — с засечками', 'Watch: serif has little feet'),
    askSans: L3("Qarang: sans-serif — silliq", 'Смотри: sans-serif — гладкий', 'Watch: sans-serif is smooth'),
    askMono: L3("Qarang: monospace — bir xil kenglik", 'Смотри: monospace — одинаковая ширина', 'Watch: monospace has equal widths'),
    askList: L3("Qarang: nom va zaxira shrift", 'Смотри: имя и запасной шрифт', 'Watch: a name and a backup font'),
    askDone: L3("font-family: shrift va zaxira", 'font-family: шрифт и запасной', 'font-family: a font and a backup')
  },
  s6: {
    eyebrow: L3("Shriftni yig'ing", 'Собери шрифт', 'Build the font'),
    say: L3("Blogim kod muharririga o'xshab qolsa, zo'r bo'lardi! Buning uchun shrift Courier New bo'lsin, zaxirasi esa monospace. Bo'laklarni to'g'ri tartibda bosing yoki ushlab, joyiga olib boring.",
      'Теперь собери сам. Пусть блог будет похож на редактор кода: шрифт Courier New, а запасной — monospace. Нажимай или перетаскивай кусочки в правильном порядке.',
      'Now build it yourself. Let the blog look like a code editor: the font is Courier New, and the backup is monospace. Tap or drag the pieces in the right order.'),
    why: {
      px: L3("Shoshilmang! px harf o'lchamida ishlatiladi, shrift nomiga u qo'shilmaydi.", 'px был для размера, шрифту он не нужен.', 'px was for the size, a font doesn’t need it.'),
      order: L3("Tartib boshqacha bo'lishi kerak: oldin qo'shtirnoqdagi shrift nomi keladi, keyin vergul, eng oxirida esa zaxira shrift.", 'Порядок другой: сначала имя шрифта в кавычках, потом запятая, в конце запасной шрифт.', 'The order is different: first the font name in quotes, then a comma, and the backup font last.')
    },
    hints: [
      L3("Asosiy shrift oldin yoziladi, zaxirasi esa undan keyin keladi.", 'Сначала основной шрифт, потом запасной.', 'The main font first, then the backup.'),
      L3("Bizga oldin qo'shtirnoqdagi Courier New kerak, keyin vergul, eng oxirida esa monospace turadi.", 'Имя шрифта в кавычках, потом запятая, потом monospace.', 'The font name in quotes, then a comma, then monospace.'),
      L3("Endi yonib turgan bo'lakni bosing.", 'Нажми горящий кусочек.', 'Tap the glowing piece.')
    ],
    ok: L3("Barakalla! Blogim endi haqiqiy kod muharririga o'xshab qoldi.", 'Молодец! Теперь блог похож на редактор кода.', 'Well done! Now the blog looks like a code editor.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order')
  },
  s7: {
    eyebrow: L3("Qaysi shrift?", 'Какой шрифт?', 'Which font?'),
    say: L3("Qani, shriftni ko'rib taniysizmi? Men yozuvlarni bittalab ko'rsataman, har biri boshqa shriftda. Harflarga yaxshilab qarang-da, yozuvni qaysi kod chiqarganini tanlang.", 'Теперь проверь себя. Я покажу надпись, а ты выбери, какой шрифт её дал.', 'Now check yourself. I’ll show some words, and you pick the font that made them.'),
    ask: L3("Bu yozuvni qaysi kod beradi?", 'Какой код даёт эту надпись?', 'Which code makes these words?'),
    hint1: L3("Harflarning uchiga yaqinroq qarang: oyoqchalari bormi? Yana bir belgi bor: monospace shriftida ingichka i harfi ham keng m harfi qancha joy olsa, shuncha joy oladi.", "Посмотри на буквы: есть ли засечки? В monospace даже узкая «i» занимает столько же места, сколько широкая «m».", "Look at the letters: do they have little feet? In monospace even a thin “i” takes as much room as a wide “m”."),
    hint2: L3("serif harflari oyoqchali bo'ladi, sans-serif harflari silliq, monospace harflari esa bir xil kenglikda turadi.", 'serif — с засечками, sans-serif — гладкий, в monospace буквы одинаковой ширины.', 'serif has feet, sans-serif is smooth, and monospace letters are all the same width.'),
    rounds: [
      { want: 'font-family: monospace;', opts: ['font-family: serif;', 'font-family: monospace;', 'font-family: sans-serif;'],
        why: L3("Qarang, bu yozuvda hamma harf bir xil kenglikda turibdi. Bunday harflarni monospace beradi.", 'Все буквы одинаковой ширины, значит, это monospace.', 'Every letter is the same width, so it’s monospace.') },
      { want: 'font-family: sans-serif;', opts: ['font-family: sans-serif;', 'font-family: serif;', 'font-family: monospace;'],
        why: L3("Bu harflar silliq, ularda oyoqchalar yo'q. Silliq harflarni sans-serif chiqaradi.", 'Буквы гладкие, без засечек. Значит, это sans-serif.', 'The letters are smooth with no feet. So it’s sans-serif.') },
      { want: 'font-family: serif;', opts: ['font-family: monospace;', 'font-family: sans-serif;', 'font-family: serif;'],
        why: L3("Bu harflarning uchida kitobdagidek kichkina oyoqchalar bor. Oyoqchali harflarni serif beradi.", 'У букв маленькие засечки, значит, это serif.', 'The letters have little feet, so it’s serif.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala shriftni ham topdingiz! Endi shriftni harflarning o'ziga qarab taniysiz.", 'Всё верно! Ты узнаёшь шрифт на глаз.', 'All correct! You can recognize a font by sight.')
  },
  s8: {
    eyebrow: L3("Qalinlik va chiziq", 'Жирность и черта', 'Weight and line'),
    help: [
      L3("Oldin abzaslarga qarang: harflari qalinlashib qoladi. Keyin havolaga ko'z tashlang-chi: uning tagidagi chiziq yo'qolib ketadi.", 'Сначала посмотри на абзацы: буквы становятся жирными. Потом на ссылку: черта под ней пропадает.', 'First look at the paragraphs: the letters get bold. Then look at the link: the line under it disappears.'),
      L3("Buni ikkita xususiyat qilyapti. font-weight harflarning qalinligini beradi: bold yozsangiz qalin, normal yozsangiz oddiy bo'ladi. text-decoration esa chiziq chizadi: underline so'zning tagidan, line-through ustidan o'tkazadi, none bo'lsa, chiziq umuman bo'lmaydi.", 'font-weight задаёт толщину букв: bold — жирно, normal — обычно. А text-decoration — черту: underline снизу, line-through поверх, none — без черты.', 'font-weight sets how thick the letters are: bold is thick, normal is regular. text-decoration sets a line: underline below, line-through across, none for no line.'),
      L3("Daftarga yozganingizda muhim so'zni qalinroq qilib yozasiz, adashib yozgan so'zni esa ustidan chizib qo'yasiz-ku. Saytda shu ikki ishni bold bilan line-through qiladi.", 'В тетради важное слово ты пишешь жирно, а ошибку зачёркиваешь. На сайте это делают bold и line-through.', 'In a notebook you write an important word in bold and cross out a mistake. On a site, bold and line-through do that.')
    ],
    say: L3("Matnni bezaydigan yana ikkita xususiyat bor. font-weight harflarning qalinligini beradi, text-decoration esa matnning ustidan yoki tagidan chiziq o'tkazadi. Keling, ikkalasini ham ishlatib ko'ramiz!",
      'Есть ещё два полезных свойства. font-weight задаёт жирность букв, а text-decoration — черту на тексте или под ним.',
      'There are two more useful properties. font-weight sets how thick the letters are, and text-decoration sets a line on or under the text.'),
    sayBold: L3("Oldin abzaslarga font-weight bold yozamiz. Ko'rdingizmi? Harflar qalin bo'lib, ko'zga yaqqol tashlanib qoldi.", 'Пишем абзацам font-weight: bold. Буквы стали жирными.', 'We write font-weight: bold for the paragraphs. The letters got thick.'),
    sayNone: L3("Havolalarning tagida odatda chiziq turadi. Endi line-through o'rniga none yozamiz, bu so'z inglizchada «hech narsa» degani. Ana, havola tagidagi chiziq ham g'oyib bo'ldi! underline yozsak esa, chiziq yana qaytib keladi.", "Под ссылками обычно есть черта. text-decoration: none её убирает: none значит «ничего». А underline возвращает черту.", "Links usually have a line under them. text-decoration: none removes it: none means “nothing”. And underline brings the line back."),
    sayNormal: L3("Sarlavha-chi? U odatda qalin bo'ladi. Unga font-weight normal yozsak, harflari oddiy qalinlikka qaytadi.", 'Заголовок обычно жирный. Если написать font-weight: normal, он станет обычной толщины.', 'A heading is usually bold. If we write font-weight: normal, it becomes normal thickness.'),
    done: L3("Xullas, qalinlik uchun font-weight kerak: bold yoki normal. Chiziqni esa text-decoration boshqaradi: underline, line-through yoki none.", 'Значит, font-weight — для жирности: bold или normal. text-decoration — для черты: underline, line-through или none.', 'So font-weight is for thickness: bold or normal. text-decoration is for lines: underline, line-through or none.'),
    askStart: L3("Qarang: qalinlik va chiziq", 'Смотри: жирность и черта', 'Watch: weight and line'),
    askBold: L3("Qarang: bold — qalin", 'Смотри: bold — жирный', 'Watch: bold is thick'),
    askNone: L3("Qarang: none — chiziqsiz", 'Смотри: none — без черты', 'Watch: none means no line'),
    askNormal: L3("Qarang: normal — oddiy", 'Смотри: normal — обычный', 'Watch: normal is regular'),
    askDone: L3("font-weight va text-decoration", 'font-weight и text-decoration', 'font-weight and text-decoration'),
    sayLine: L3("Endi havolaga o'tamiz. Bir qiziq narsani ko'ring-chi: line-through yozdik, so'z esa daftarda chizib tashlangan so'zdek, ustidan chizilib qoldi!", "Сначала интересное: line-through зачёркивает слово, как ошибку в тетради.", "First, something fun: line-through crosses the word out, like a mistake in a notebook."),
    askLine: L3("line-through — chizilgan", "line-through — зачёркнуто", "line-through: crossed out")
  },
  s9: {
    eyebrow: L3("Chiziqsiz havola", 'Ссылка без черты', 'A link with no line'),
    say: L3("«Batafsil o'qish» havolasining tagidagi chiziq blogimga yarashmayapti. Uni olib tashlang: text-decoration uchun qiymatni yozing.", 'Убери черту под ссылкой: впиши значение для text-decoration.', 'Remove the line under the link: type the value for text-decoration.'),
    msgs: {
      empty: L3("Qiymat yozilmabdi-ku. text-decoration uchun bitta so'z kerak.", 'Впиши значение для text-decoration.', 'Type a value for text-decoration.'),
      under: L3("underline chiziqni qo'yadi-ku, u esa havolada allaqachon bor. Bizga chiziqni olib tashlaydigan qiymat kerak.", 'underline ставит черту, а она и так есть. Нам нужно значение без черты.', 'underline adds the line, and it’s already there. We need the value for no line.'),
      through: L3("line-through havolani ustidan chizib qo'ydi-ku! Bizga esa chiziq umuman bo'lmaydigan qiymat kerak.", 'line-through зачеркнул слово. Нам нужно значение без черты.', 'line-through crossed the word out. We need the value for no line.'),
      other: L3("Brauzer bu so'zni tanimadi. Chiziqni olib tashlaydigan so'z none bo'ladi.", 'Браузер не узнал это значение. Без черты — это none.', 'The browser didn’t recognize that value. No line is none.')
    },
    hints: [
      L3("Hozirgina havola tagidagi chiziqni olib tashlagandim, esingizdami? text-decoration xususiyatiga qaysi so'zni yozgandim?", "Вспомни показ: каким словом после text-decoration Коди убрал черту под ссылкой?", "Remember the demo: which word after text-decoration removed the line under the link?"),
      L3("Chiziqni olib tashlaydigan so'z to'rt harfli bo'ladi.", 'Значение text-decoration без черты — слово из четырёх букв.', 'The no-line value of text-decoration is a four-letter word.'),
      L3("Maydonga none deb yozing-da, «Tekshirish»ni bosing.", 'Впиши none и нажми «Проверить».', 'Type none and tap Check.')
    ],
    ok: L3("Mana, havola tozalandi! «Batafsil o'qish» tagida endi chiziq yo'q, blogim ancha chiroyli ko'rinyapti.", 'Огонь! Ссылка теперь чистая, черты нет.', 'Awesome! The link is clean now, with no line.'),
    ask: L3("Havola tagidagi chiziqni olib tashlang", 'Убери черту под ссылкой', 'Remove the line under the link')
  },
  s10: {
    eyebrow: L3("Qaysi xususiyat?", 'Какое свойство?', 'Which property?'),
    say: L3("Endi blogimdagi yozuvlarni birma-bir o'zgartiraman. Siz esa har safar buni qaysi xususiyat qilganini topasiz: font-weight yoki text-decoration.", 'Теперь проверь себя. Я покажу надпись, а ты выбери, какое свойство её изменило: font-weight или text-decoration.', 'Now check yourself. I’ll show some words, and you pick which property changed them: font-weight or text-decoration.'),
    ask: L3("Bu yozuvni qaysi xususiyat o'zgartirdi?", 'Какое свойство изменило эту надпись?', 'Which property changed these words?'),
    card: L3('Yozuv', 'Надпись', 'Words'),
    hint1: L3("Harflarning o'ziga qarang-chi: ular o'zgardimi yoki shunchaki chiziq qo'shildimi?", 'Изменились сами буквы или к ним добавилась черта?', 'Did the letters themselves change, or was a line added?'),
    hint2: L3("Qalinlikni font-weight beradi, chiziqni esa text-decoration chizadi.", 'Жирность — от font-weight, черта — от text-decoration.', 'Thickness comes from font-weight, and lines come from text-decoration.'),
    items: [
      { css: 'font-weight: bold', right: 'weight', why: L3("Bu yerda harflarning o'zi qalinlashdi, qalinlikni esa font-weight beradi.", 'Буквы стали жирными, значит, это font-weight.', 'The letters got thick, so it’s font-weight.') },
      { css: 'text-decoration: underline', right: 'deco', why: L3("So'zning tagida chiziq paydo bo'ldi, chiziqni esa text-decoration chizadi.", 'Под словом появилась черта, значит, это text-decoration.', 'A line appeared under the word, so it’s text-decoration.') },
      { css: 'text-decoration: line-through', right: 'deco', why: L3("So'zning ustidan chiziq tortildi. Bu ham text-decoration ishi.", 'Слово перечёркнуто, это тоже text-decoration.', 'The word is crossed out, that’s text-decoration too.') },
      { css: 'font-weight: normal; font-size: 26px', right: 'weight', why: L3("Katta sarlavhaning harflari qalin emas, oddiy bo'lib qoldi. Buni font-weight normal qildi.", 'Крупный заголовок стал не жирным, а обычным. Это font-weight: normal.', 'The big heading isn’t bold, it’s regular. That’s font-weight: normal.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("To'rttala yozuvda ham adashmadingiz! Qalinlik qayerda-yu, chiziq qayerda, endi aniq bilasiz.", 'Всё верно! Ты не путаешь жирность и черту.', 'All correct! You don’t mix up weight and lines.'),
    before: L3("Oldin", "До", "Before"),
    after: L3("Keyin", "После", "After")
  },
  s11: {
    eyebrow: L3("Joylashuv", 'Выравнивание', 'Alignment'),
    help: [
      L3("Sarlavhani kuzatib turing-chi: u qatorning goh chap tomoniga, goh o'rtasiga, goh o'ng tomoniga ko'chib yuradi.", 'Посмотри на заголовок: он переезжает влево, в середину и вправо строки.', 'Look at the heading: it moves to the left, the middle and the right of the line.'),
      L3("Uni text-align ko'chiryapti: bu xususiyat matnning qatorda qayerda turishini aytadi. left yozsangiz chapda, center yozsangiz o'rtada, right yozsangiz o'ngda turadi.", 'text-align говорит, у какого края строки стоит текст: left — слева, center — по центру, right — справа.', 'text-align says which side of the line the text sits on: left on the left, center in the middle, right on the right.'),
      L3("Kitob muqovasiga e'tibor berganmisiz? Nomi odatda qoq o'rtada turadi. Sayt sarlavhasini ham text-align center bilan xuddi shunday o'rtaga qo'yish mumkin.", 'На обложке книги название обычно стоит посередине. Заголовок сайта тоже можно поставить по центру: text-align center.', 'On a book cover the title usually sits in the middle. You can put a site heading in the middle too: text-align center.')
    ],
    say: L3("Mana, oxirgi xususiyatga ham yetib keldik: text-align, ya'ni matnni tekislash degani. U matnni qatorning qaysi tomoniga qo'yishni aytadi. Hozircha sarlavha odatdagidek chap tomonda turibdi.", 'Последнее свойство — text-align, то есть к какому краю строки поставить текст. Обычно текст стоит слева.', 'The last property is text-align, meaning which side of the line the text goes to. Normally text sits on the left.'),
    sayCenter: L3("Sarlavhaga text-align center yozamiz. Ana, sarlavha qatorning qoq o'rtasiga kelib qoldi!", 'Пишем заголовку text-align: center. Заголовок встал по центру.', 'We write text-align: center for the heading. The heading moved to the center.'),
    sayRight: L3("right yozsak-chi? Qarang, sarlavha shu zahoti o'ng chetga o'tib oldi!", 'Если написать right, он уедет вправо.', 'If we write right, it moves to the right.'),
    sayLeft: L3("left esa uni yana chap tomonga qaytaradi. Aslida brauzer matnni o'zi ham chapga qo'yadi, shuning uchun left yozmasangiz ham sarlavha chapda turadi.", 'А left вернёт его влево. Это значение по умолчанию.', 'And left brings it back to the left. That’s the default value.'),
    done: L3("Demak, text-align matnni qatorda chapga, o'rtaga yoki o'ngga qo'yadi: left, center yoki right.", 'Значит, text-align ставит текст в строке: left, center или right.', 'So text-align places text on the line: left, center or right.'),
    askStart: L3("Qarang: odatda chapda", 'Смотри: обычно слева', 'Watch: normally on the left'),
    askCenter: L3("Qarang: center — o'rtada", 'Смотри: center — по центру', 'Watch: center'),
    askRight: L3("Qarang: right — o'ngda", 'Смотри: right — справа', 'Watch: right'),
    askLeft: L3("Qarang: left — chapda", 'Смотри: left — слева', 'Watch: left'),
    askDone: L3("text-align: left, center, right", 'text-align: left, center, right', 'text-align: left, center, right')
  },
  s12: {
    eyebrow: L3("O'rtadagi sarlavha", 'Заголовок по центру', 'A centered heading'),
    say: L3("Blogimning sarlavhasi kitob muqovasidagidek qoq o'rtada tursa, chiroyli bo'lardi. Qani, uni o'rtaga qo'ying: text-align uchun qiymatni yozing.", 'Поставь заголовок по центру: впиши значение для text-align.', 'Center the heading: type the value for text-align.'),
    msgs: {
      empty: L3("Bu yerga hali hech narsa yozilmadi. text-align uchun bitta so'z kerak.", 'Впиши значение для text-align.', 'Type a value for text-align.'),
      middle: L3("middle so'zi inglizchada «o'rta» bo'lsa ham, brauzer uni tanimaydi. Matnni o'rtaga qo'yish uchun CSS center so'zini ishlatadi.", 'Слово middle браузер не знает. По центру в CSS — это center.', 'The browser doesn’t know middle. Centered in CSS is center.'),
      side: L3("Sarlavha chetga borib qoldi-ku. Biz esa uni qoq o'rtada ko'rmoqchimiz.", 'Заголовок ушёл к краю. Нам нужна середина.', 'The heading went to an edge. We need the middle.'),
      other: L3("CSS bunday so'zni bilmaydi. O'rtaga qo'yadigan so'z center bo'ladi.", 'Браузер не узнал это значение. По центру — это center.', 'The browser didn’t recognize that value. Centered is center.')
    },
    hints: [
      L3("«O'rta» inglizchada qanday deyiladi? Hozirgina men ko'rsatganimda bu so'zni eshitgan edingiz.", 'Как «центр» по-английски?', 'What is the middle called in English?'),
      L3("text-align uchta qiymatni biladi: left, center va right. Bizga ularning o'rtadagisi kerak.", 'У text-align три значения: left, center и right. Нам нужно среднее.', 'text-align has three values: left, center and right. We need the middle one.'),
      L3("center deb yozing-da, «Tekshirish»ni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Qoyil! Sarlavha qoq o'rtaga keldi, blogim birdan chiroyli bo'lib ketdi.", 'Отлично! Заголовок по центру, блог смотрится красиво.', 'Great! The heading is centered, and the blog looks nice.'),
    ask: L3("Sarlavhani o'rtaga qo'ying", 'Поставь заголовок по центру', 'Center the heading')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Blogimda nimadir buzilibdi! Kodda uchta qoida bor, lekin ulardan biri ishlamayapti. Sahifaga qarang-da, o'sha buzilgan qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми сломанное правило.', 'Now check yourself. There are three rules, but one doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Voy, buzilgani bitta emas ekan! Blogimda yana bir joy kutganimizdek chiqmadi. Endi qaysi qoida aybdor ekan?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida bemalol ishlayapti, natijasini sahifada ko'rib turibmiz-ku. Qani, nima o'zgarmay qoldi?", 'Это правило работает: его результат виден на странице. Что не изменилось?', 'This rule works: you can see its result on the page. What didn’t change?'),
    found: {
      unit: L3("Ana, topdingiz! O'ttiz ikki sonidan keyin px yo'q ekan, shuning uchun brauzer bu qoidani tushunmay, o'tkazib yubordi.", 'Нашёл! После тридцати двух не было px, поэтому браузер выбросил это правило.', 'Found it! There was no px after thirty-two, so the browser threw the rule away.'),
      align: L3("Mana u! CSS middle degan so'zni bilmaydi, o'rta uchun center yoziladi.", 'Нашёл! Значения middle нет, по центру — это center.', 'Found it! There’s no middle value; centered is center.')
    },
    hint1: L3("Sahifaga qarang-chi: qaysi narsa kutganimizdek chiqmadi?", 'Посмотри на страницу: что вышло не так, как ждали?', 'Look at the page: what didn’t come out as expected?'),
    hint2: {
      unit: L3("Sarlavha kattalashmabdi. Uning o'lchamiga qarang: son yonida birlik bormi?", 'Заголовок не стал крупнее. Есть ли единица у его размера?', 'The heading didn’t get bigger. Does its size have a unit?'),
      align: L3("Abzaslar o'rtaga kelmabdi. text-align qiymatini bir tekshirib ko'ring.", 'Абзацы не встали по центру. Посмотри на значение text-align.', 'The paragraphs didn’t center. Look at the text-align value.')
    },
    hint3: {
      unit: L3("Buzilgan joy birinchi qoidada: unda px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      align: L3("Buzilgan joy ikkinchi qoidada, middle so'zida. O'sha qatorni bosing.", 'Ошибка во втором правиле: middle. Нажми эту строку.', 'The bug is in the second rule: middle. Tap that line.')
    },
    ok: L3("Sarlavha kattalashdi, abzaslar o'rtaga keldi, blogim yana ishlayapti! Sahifaga qarab koddagi kamchilikni topish endi siz uchun oson ish.", 'Супер! Обе найдены. Ты проверяешь текст как настоящий дизайнер.', 'Super! Both are found. You check text like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi qoidani to'liq o'zingiz yozib ko'ring: selektor ham, xususiyat ham sizdan. Blogimdagi abzaslar qalin bo'lsin: p selektoriga font-weight xususiyatini yozing.", 'Теперь напиши правило целиком сам. Сделай буквы в абзацах жирными: напиши для p свойство font-weight.', 'Now write the whole rule yourself. Make the letters in the paragraphs bold: write the font-weight property for p.'),
    msgs: {
      empty: L3("Qoidaning tartibi bunday: oldin selektor keladi, keyin jingalak qavslar ichida xususiyat bilan qiymat turadi.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: biri ochadi, biri yopadi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymatning o'rtasida ikki nuqta tushib qolibdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Abzaslarni p selektori tanlaydi, qoida o'shandan boshlanishi kerak.", 'Для абзацев нужен селектор p.', 'The paragraphs need the p selector.'),
      prop: L3("Harflarni qalin qiladigan xususiyat font-weight bo'ladi.", 'Жирность задаёт свойство font-weight.', 'The font-weight property sets the thickness.'),
      notOk: L3("Bu so'zni brauzer bilmaydi. Qalin harflar uchun bold so'zi kerak.", 'Браузер не узнал это значение. Жирный — это bold.', 'The browser didn’t recognize that value. Thick is bold.'),
      other: L3("Harflar hali ham qalin bo'lmadi. Ularga bold kerak.", 'Буквы не стали жирными. Нам нужен bold.', 'The letters didn’t get thick. We need bold.')
    },
    hints: [
      L3("Abzaslarni qaysi selektor tanlaydi-yu, qalinlikni qaysi xususiyat beradi?", 'Каким селектором выбирают абзацы? Какое свойство нужно для жирности?', 'Which selector picks the paragraphs? Which property is for thickness?'),
      L3("Selektor p bo'ladi, xususiyat font-weight, qiymati esa bold.", 'Селектор p, свойство font-weight, значение bold.', 'The selector is p, the property font-weight, the value bold.'),
      L3("Kodning tagida tayyor namuna chiqdi. Uni harfma-harf maydonga yozib chiqing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Abzaslar qalin bo'ldi, qoidani esa boshidan oxirigacha o'zingiz yozdingiz.", 'Отлично! Абзацы стали жирными. Ты сам написал правило.', 'Great! The paragraphs are bold. You wrote the rule yourself.'),
    ask: L3("Abzaslarni qalin qiladigan qoidani yozing", 'Напиши правило, которое сделает абзацы жирными', 'Write a rule that makes the paragraphs bold')
  },
  s14: {
    eyebrow: L3("O'z blogingiz", 'Свой блог', 'Your own blog'),
    say: L3("Endi o'z blogingizni bezash vaqti keldi! Sarlavha uchun xohlagan o'lchamingizni, butun sahifa uchun esa yoqqan shriftingizni yozing. Keyin «Tayyor»ni bosing.", 'Теперь укрась свою страницу. Впиши любой размер для заголовка и любой шрифт для всей страницы. Потом нажми «Готово».', 'Now decorate your own page. Type any size for the heading and any font for the whole page. Then tap “Done”.'),
    msgs: {
      size: L3("Brauzer buni o'lcham deb tushunmadi: \u2063{w}\u2064. Son yozing-da, yoniga px qo'shing.", 'Браузер не узнал такой размер: \u2063{w}\u2064. Напиши число и px.', 'The browser didn’t recognize this as a size: \u2063{w}\u2064. Write a number and px.'),
      font: L3("Bunday shriftni brauzer tanimadi: \u2063{w}\u2064. Masalan, sans-serif yoki monospace deb yozib ko'ring.", 'Браузер не узнал такой шрифт: \u2063{w}\u2064. Напиши, например, sans-serif или monospace.', 'The browser didn’t recognize this as a font: \u2063{w}\u2064. Write sans-serif or monospace, for example.')
    },
    hints: [
      L3("Sarlavhangiz qanchalik katta bo'lsin? Sizga qaysi shrift ko'proq yoqadi?", 'Насколько большим будет заголовок? Какой шрифт тебе нравится?', 'How big should the heading be? Which font do you like?'),
      L3("O'lchamga son va px yoziladi. Shriftga esa uning nomini yoki serif, sans-serif, monospace so'zlaridan birini yozasiz.", 'Размер — число и px, шрифт — имя или serif, sans-serif, monospace.', 'The size is a number and px; the font is a name or serif, sans-serif, monospace.'),
      L3("Masalan, o'lchamga 36px, shriftga sans-serif yozib ko'ring. Keyin «Tayyor»ni bosing.", 'Например, впиши 36px для размера и sans-serif для шрифта. Потом нажми «Готово».', 'For example, type 36px for the size and sans-serif for the font. Then tap “Done”.')
    ],
    ok: L3("Qanday chiroyli chiqdi-ya! Mana, sizning blogingiz tayyor.", 'Ого, как красиво! Это твой блог.', 'Wow, how pretty! That’s your blog.'),
    ask: L3("O'lcham va shriftni yozing, «Tayyor»ni bosing", 'Впиши размер и шрифт, нажми «Готово»', 'Type a size and a font, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Blogim uchun matn haqida to'rtta maslahat tayyorlagandim, lekin ba'zilari chalkash chiqdi. Qaysi biri rost, qaysi biri yo'q? Har birini eshiting-da, «To'g'ri» yoki «Noto'g'ri»ni bosing.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    hint1: L3("Bu fikr qaysi xususiyat haqida ekan?", 'О каком свойстве эта фраза?', 'Which property is the sentence about?'),
    hint2: L3("Esingizdami: font-size son va px bilan yoziladi, text-align matnni joylaydi, font-weight qalinlik beradi, text-decoration esa chiziq chizadi. Fikr shunga to'g'ri keladimi?", 'Вспомни урок: font-size — число и px, text-align выравнивает, font-weight даёт жирность, text-decoration — черту. Фраза с этим совпадает?', 'Remember the lesson: font-size is a number and px, text-align aligns, font-weight sets thickness, text-decoration sets lines. Does the sentence match that?'),
    items: [
      { t: L3("font-size xususiyatiga faqat son yozsa ham bo'ladi, px shart emas.", 'В font-size можно писать просто число, px не обязателен.', 'You can write just a number in font-size; px isn’t needed.'), right: false, code: 'unit',
        why: L3("Aslida px kerak: usiz brauzer qiymatni tushunmaydi va o'tkazib yuboradi.", 'На самом деле px нужен. Без него браузер выбрасывает значение.', 'Actually px is needed. Without it the browser throws the value away.') },
      { t: L3("text-align: center matnni o'rtaga qo'yadi.", 'text-align: center ставит текст по центру.', 'text-align: center centers the text.'), right: true, code: 'center',
        why: L3("center matnni qatorning qoq o'rtasiga qo'yadi, blogimning sarlavhasida buni o'zingiz qildingiz.", 'Верно: center — это по центру.', 'Right: center means the middle.') },
      { t: L3("font-weight: bold harflarni qalin qiladi.", 'font-weight: bold делает буквы жирными.', 'font-weight: bold makes the letters thick.'), right: true,
        why: L3("Hozirgina ko'rdik-ku: bold yozilganda abzaslarning harflari qalinlashdi.", 'Так и есть: bold — жирный.', 'That’s right: bold means thick.') },
      { t: L3("text-decoration: none havola tagiga chiziq qo'yadi.", 'text-decoration: none ставит черту под ссылкой.', 'text-decoration: none puts a line under a link.'), right: false,
        why: L3("Aslida none chiziqni olib tashlaydi, chiziqni esa underline qo'yadi.", 'На самом деле none убирает черту. Черту ставит underline.', 'Actually none removes the line. underline adds it.') }
    ],
    ok: L3("Birorta fikr sizni chalg'ita olmadi! Matn bilan ishlashni endi yaxshi bilasiz.", 'Всё верно! Ты умеешь работать с текстом.', 'All correct! You know how to work with text.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Bahsimiz esingizdami? Men sarlavhaga faqat qirq sonini yozib, u baribir kattalashadi, degandim. Mana natijasi: sarlavha kattalashmadi, kichkinaligicha qolibdi. Yutqazdim! O'lchamga birlik kerak, masalan, px. Birlik bo'lmasa, brauzer qoidani tushunmaydi va o'tkazib yuboradi. Agar siz px kerak, degan bo'lsangiz, bahsda siz yutdingiz!",
        'Вернёмся к загадке. Помнишь, я написал в font-size просто число сорок? Увы, я ошибся. Размеру нужна единица, например px. Без неё браузер выбрасывает правило, и заголовок остаётся маленьким.',
        'Back to our riddle. Remember, I wrote just the number forty in font-size? Sadly, I was wrong. A size needs a unit, like px. Without it the browser throws the rule away, and the heading stays small.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning blogingiz! O'lchamini ham, shriftini ham o'zingiz tanladingiz.", 'Смотри, это твой блог с размером и шрифтом, которые ты выбрал сам!', 'Look, this is your blog with the size and font you picked yourself!'), k: null },
      { text: L3("Harflarning o'lchamini font-size beradi, shriftini esa font-family tanlaydi.", 'font-size задаёт размер, font-family — шрифт.', 'font-size sets the size, and font-family sets the font.'), k: 'size' },
      { text: L3("font-weight harflarni qalin yoki oddiy qiladi, text-decoration esa chiziqni qo'yadi yoki olib tashlaydi.", 'font-weight управляет жирностью, text-decoration — чертой.', 'font-weight controls thickness, and text-decoration controls lines.'), k: 'weight' },
      { text: L3("text-align bo'lsa, matnni chapga, o'rtaga yoki o'ngga qo'yadi.", 'А text-align ставит текст влево, по центру или вправо.', 'And text-align puts text on the left, in the center or on the right.'), k: 'align' },
      { text: L3("Barakalla! Endi blogingizdagi matn siz xohlagandek ko'rinadi. Keyingi darsda esa matnning o'zini emas, butun elementlarning o'lchamini o'zgartirishni o'rganamiz. Ko'rishguncha!", 'Ура! Теперь твой текст выглядит так, как ты хочешь. На следующем уроке поработаем с размерами элементов. До встречи!', 'Hooray! Now your text looks the way you want. Next time we’ll work with element sizes. See you!'), k: null }
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
Object.assign(SPOKEN, { help: 1, sayLine: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, saySmall: 1, sayBig: 1, sayH1: 1, saySans: 1, sayMono: 1,
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
