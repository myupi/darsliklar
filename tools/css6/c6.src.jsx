// =============================================================================
// КУРС «CSS» · Урок 6 — «Размеры элементов»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css6/build.mjs → lessons/css/06-razmery.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 6 · «Размеры элементов» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–5: правило, селекторы, цвета, фон, текст. Коди выложил фото из путешествия, а оно
// огромное и занимает полстраницы. Ученик узнаёт width и height: в пикселях (px) размер постоянный, в процентах (%)
// — часть окна, и меняется вместе с ним; у картинки только width — высота подстраивается сама, width и height
// вместе — картинку растягивает. Размеры видны «Инспектором» (как в уроке 8 HTML): пунктирная рамка и ярлык
// «тег ширина×высота» у каждого элемента — меряет сам браузер.
// Загадка (без имён): Коди дал длинному абзацу height: 30px и уверен, что лишний текст просто спрячется.
// Разгадка: текст вылезает за рамку (браузер его не прячет).
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (огромное фото → 180px и абзац на 60% окна; загадка про height)
//   px:     s2 показ (h1 200px; img 150px — высота сама) · s3 вписать 200px (Fill) · s4 размер ↔ полоска (Matching)
//   %:      s5 показ (p 50%; h1 200px; окно сужается — % меняется, px нет) · s6 вписать 50% (Fill) · s7 меняется ли с окном (Sort)
//   height: s8 показ (h1 80px; img height 60px; img width и height — растянута) · s9 вписать 80px (Fill) · s10 какой код у прямоугольника (выбор)
//   поломки: s11 показ (без px, пробел перед %, растянутая картинка) · s12 исправить «160 px» (Debug & Fix) · s13 найти сломанное правило (Error Detective)
//   w1 правило целиком: img { width: 100%; } (перенос) · s14 своя открытка: ширина картинки и абзаца (Live, «Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: верная ли запись — решает Chrome (CSS.supports): «200» без px и «50 %» с пробелом не принимаются.
//     Картинка — настоящий <img> (файл урока 360×225): пропорции и растяжение — как в браузере.
//   · Узбекский — по /uzbekcha; в речи нет символов: «piksel», «foiz».
//
// СИСТЕМА СЛОВ: kenglik — ширина; balandlik — высота; foiz — процент; piksel — px; oyna — окно браузера.
// В речи width, height, px — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-06-razmery',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: "6-dars. Elementlar o'lchami",
    ru: 'Урок 6. Размеры элементов',
    en: 'Lesson 6. Element sizes'
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
  next: L3('Box Model', 'Box Model', 'Box Model'),
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
  // Страница путешествия Коди (не звучит).
  site: {
    title: L3("Kodining sayohati", 'Путешествие Коди', 'Kodi’s trip'),
    photo: L3("Tog'lar", 'Горы', 'Mountains'),
    p1: L3("Bu suratni tog'da oldim.", 'Это фото я сделал в горах.', 'I took this photo in the mountains.'),
    long: L3("Biz ertalab tog'ga chiqdik, kun bo'yi yurdik va kechqurun gulxan yoqdik. Bu eng zo'r kun edi!", 'Мы утром поднялись в горы, шли весь день, а вечером разожгли костёр. Это был лучший день!', 'We climbed the mountains in the morning, walked all day and made a campfire in the evening. It was the best day!'),
    fixed: L3("O'zgarmaydi", 'Не меняется', 'Stays the same'),
    flex: L3("Oyna bilan o'zgaradi", 'Меняется с окном', 'Changes with the window')
  },
  s1: {
    eyebrow: L3("Sayohat surati", 'Фото из поездки', 'A trip photo'),
    say: L3("Salom! Men sayohatdan surat joyladim. Lekin qarang, u juda katta: sahifaning yarmini egallab olgan, matn esa pastda qolib ketdi. «Aylantirish» tugmasini bosing.",
      'Привет! Я выложил фото из поездки. Но смотри, оно огромное: заняло полстраницы, а текст уехал вниз. Нажми «Превратить».',
      'Hi! I posted a photo from my trip. But look, it’s huge: it takes up half the page, and the text got pushed down. Tap “Transform”.'),
    magic: L3("Mana! Surat ixcham bo'ldi, abzas esa oynaning bir qismini egallaydi. Inspektor har bir elementning o'lchamini ko'rsatyapti.", 'Вот! Фото стало аккуратным, а абзац занимает часть окна. Инспектор показывает размер каждого элемента.', 'There! The photo is neat now, and the paragraph takes part of the window. The Inspector shows each element’s size.'),
    magicP: L3("Buni ikki xususiyat qildi: width, ya'ni kenglik degani, va height, ya'ni balandlik degani.", 'Это сделали два свойства: width, то есть ширина, и height, то есть высота.', 'Two properties did it: width, meaning the width, and height, meaning the height.'),
    done: L3("Bugun elementlar o'lchamini boshqarishni o'rganasiz. Lekin oldin kichik topishmoq. Men uzun abzasga balandlik berdim: height o'ttiz piksel. Menimcha, sig'magan matn shunchaki yashirinadi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься управлять размерами элементов. Но сначала маленькая загадка. Я дал длинному абзацу высоту: height тридцать пикселей. По-моему, текст, который не влез, просто спрячется. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to control element sizes. But first, a little riddle. I gave a long paragraph a height: height thirty pixels. I think the text that doesn’t fit will just hide. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("width — kenglik, height — balandlik", 'width — ширина, height — высота', 'width is width, height is height')
  },
  s2: {
    eyebrow: L3("Kenglik", 'Ширина', 'Width'),
    say: L3("Inspektorga qarang: har bir elementning kengligi va balandligi yozilgan. Sarlavha odatda butun qatorni egallaydi. Uning kengligini width bilan o'zgartiramiz.",
      'Посмотри на Инспектор: у каждого элемента написаны ширина и высота. Заголовок обычно занимает всю строку. Его ширину меняют через width.',
      'Look at the Inspector: each element shows its width and height. A heading normally takes the whole line. We change its width with width.'),
    sayH1: L3("h1 uchun width ikki yuz piksel. Qarang, sarlavha qisqardi: Inspektorda endi ikki yuz.", 'Для h1 width двести пикселей. Смотри, заголовок стал короче: в Инспекторе теперь двести.', 'For h1, width two hundred pixels. Look, the heading got shorter: the Inspector now says two hundred.'),
    sayImg: L3("Endi suratga width bir yuz ellik piksel. Surat kichraydi, balandligi esa o'zi moslashdi: surat cho'zilmadi.", 'Теперь фото: width сто пятьдесят пикселей. Фото уменьшилось, а высота подстроилась сама: фото не растянулось.', 'Now the photo: width one hundred fifty pixels. The photo got smaller, and the height adjusted by itself: the photo didn’t stretch.'),
    done: L3("Demak, width kenglikni beradi. Suratga faqat width yozsak, balandlik o'zi moslashadi.", 'Значит, width задаёт ширину. Если у фото написать только width, высота подстроится сама.', 'So width sets the width. If a photo has only width, the height adjusts by itself.'),
    askStart: L3("Qarang: Inspektor o'lchamlari", 'Смотри: размеры в Инспекторе', 'Watch: sizes in the Inspector'),
    askH1: L3("Qarang: sarlavha 200px", 'Смотри: заголовок 200px', 'Watch: the heading at 200px'),
    askImg: L3("Qarang: surat 150px", 'Смотри: фото 150px', 'Watch: the photo at 150px'),
    askDone: L3("width — kenglik, piksellarda", 'width — ширина в пикселях', 'width is the width in pixels')
  },
  s3: {
    eyebrow: L3("Surat kengligi", 'Ширина фото', 'Photo width'),
    say: L3("Endi navbat sizga. Suratning kengligini ikki yuz piksel qiling: width uchun qiymatni yozing.", 'Теперь твоя очередь. Сделай ширину фото двести пикселей: впиши значение для width.', 'Now it’s your turn. Make the photo two hundred pixels wide: type the value for width.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Brauzer uni tashlab yuboradi: son yoniga px qo'shing.", 'Написано только число. Браузер его выбрасывает: добавь к числу px.', 'Only a number. The browser throws it away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Bu boshqa kenglik. Surat ikki yuz piksel bo'lishi kerak.", 'Это другая ширина. Фото должно быть двести пикселей.', 'That’s a different width. The photo should be two hundred pixels.')
    },
    hints: [
      L3("Qiymat son va o'lcham birligidan iborat.", 'Значение — число и единица.', 'The value is a number and a unit.'),
      L3("Son ikki yuz, birlik px.", 'Число двести, единица px.', 'The number is two hundred, the unit is px.'),
      L3("200px deb yozing va Tekshirishni bosing.", 'Впиши 200px и нажми «Проверить».', 'Type 200px and tap Check.')
    ],
    ok: L3("Zo'r! Surat ikki yuz piksel, Inspektor ham shuni ko'rsatyapti.", 'Огонь! Фото двести пикселей, и Инспектор это показывает.', 'Awesome! The photo is two hundred pixels, and the Inspector shows it.'),
    ask: L3("Surat kengligini 200 piksel qiling", 'Сделай ширину фото 200 пикселей', 'Make the photo 200 pixels wide')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi kengliklarni chiziqlar bilan juftlang. Chapdan kenglikni, o'ngdan esa shu kenglikdagi chiziqni bosing.", 'Теперь соедини ширины с полосками. Нажми ширину слева, а потом полоску такой ширины справа.', 'Now match the widths with the bars. Tap a width on the left, then the bar of that width on the right.'),
    why: {
      w60: L3("Oltmish piksel eng qisqa kenglik. Eng qisqa chiziqni toping.", 'Шестьдесят пикселей — самая короткая ширина. Найди самую короткую полоску.', 'Sixty pixels is the shortest width. Find the shortest bar.'),
      w120: L3("Bir yuz yigirma piksel o'rtacha: qisqasining ikki barobari.", 'Сто двадцать пикселей — средняя: вдвое длиннее короткой.', 'One hundred twenty pixels is medium: twice the short one.'),
      w180: L3("Bir yuz sakson piksel eng uzun kenglik. Eng uzun chiziqni toping.", 'Сто восемьдесят пикселей — самая длинная. Найди самую длинную полоску.', 'One hundred eighty pixels is the longest. Find the longest bar.')
    },
    pairOk: {
      w60: L3("To'g'ri, bu eng qisqasi.", 'Верно, это самая короткая.', 'Right, that’s the shortest.'),
      w120: L3("To'g'ri, bu o'rtachasi.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      w180: L3("To'g'ri, bu eng uzuni.", 'Верно, это самая длинная.', 'Right, that’s the longest.')
    },
    pickFirst: L3("Oldin chapdan kenglikni tanlang.", 'Сначала выбери ширину слева.', 'First pick a width on the left.'),
    hints: [
      L3("Son qancha katta bo'lsa, chiziq shuncha uzun.", 'Чем больше число, тем длиннее полоска.', 'The bigger the number, the longer the bar.'),
      L3("60px eng qisqa, 180px eng uzun, 120px o'rtada.", '60px — самая короткая, 180px — самая длинная, 120px — посередине.', '60px is the shortest, 180px the longest, 120px in between.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Kenglikni ko'z bilan ham chamalaysiz.", 'Отлично! Ты прикидываешь ширину на глаз.', 'Great! You can estimate width by eye.'),
    ask: L3("Kenglikni, keyin chiziqni bosing", 'Нажми ширину, потом полоску', 'Tap a width, then a bar'),
    askPlace: L3("Endi shu kenglikdagi chiziqni bosing", 'Теперь нажми полоску такой ширины', 'Now tap the bar of that width')
  },
  s5: {
    eyebrow: L3("Foizlar", 'Проценты', 'Percent'),
    say: L3("Kenglikni foizda ham yozish mumkin, ya'ni oynaning qancha qismi degani. Yuz foiz butun oyna, ellik foiz esa yarmi.", 'Ширину можно писать и в процентах, то есть какую часть окна занять. Сто процентов — всё окно, пятьдесят — половина.', 'You can also write width in percent, meaning how much of the window to take. A hundred percent is the whole window, fifty is half.'),
    sayHalf: L3("Abzasga width ellik foiz. Qarang, u oynaning yarmini egalladi.", 'Абзацу width пятьдесят процентов. Смотри, он занял половину окна.', 'Width fifty percent for the paragraph. Look, it took half the window.'),
    sayFix: L3("Sarlavhaga esa ikki yuz piksel beramiz, solishtirish uchun.", 'А заголовку дадим двести пикселей, для сравнения.', 'And we give the heading two hundred pixels, to compare.'),
    sayNarrow: L3("Endi oynani toraytiramiz. Qarang: abzas ham qisqardi, chunki u oynaning yarmi. Sarlavha esa o'sha ikki yuz pikselligicha qoldi.", 'Теперь сузим окно. Смотри: абзац тоже стал уже, ведь он — половина окна. А заголовок остался теми же двумястами пикселями.', 'Now let’s narrow the window. Look: the paragraph got narrower too, because it’s half the window. The heading stayed at the same two hundred pixels.'),
    done: L3("Demak, piksel o'zgarmaydi, foiz esa oyna bilan birga o'zgaradi.", 'Значит, пиксели не меняются, а проценты меняются вместе с окном.', 'So pixels stay the same, and percent changes with the window.'),
    askStart: L3("Qarang: foiz — oynaning qismi", 'Смотри: процент — часть окна', 'Watch: percent is part of the window'),
    askHalf: L3("Qarang: ellik foiz — yarmi", 'Смотри: пятьдесят процентов — половина', 'Watch: fifty percent is half'),
    askFix: L3("Qarang: 200px — solishtirish uchun", 'Смотри: 200px — для сравнения', 'Watch: 200px to compare'),
    askNarrow: L3("Qarang: oyna toraydi", 'Смотри: окно сузилось', 'Watch: the window got narrower'),
    askDone: L3("px o'zgarmaydi, foiz esa oyna bilan", 'px постоянны, проценты — вместе с окном', 'px stays, percent follows the window')
  },
  s6: {
    eyebrow: L3("Oynaning yarmi", 'Половина окна', 'Half the window'),
    say: L3("Abzas oynaning yarmini egallasin: width uchun foizdagi qiymatni yozing.", 'Пусть абзац занимает половину окна: впиши для width значение в процентах.', 'Let the paragraph take half the window: type a percent value for width.'),
    msgs: {
      empty: L3("Qiymat yozing: son va foiz belgisi.", 'Впиши значение: число и знак процента.', 'Type the value: a number and the percent sign.'),
      noUnit: L3("Faqat son yozildi. Son yoniga foiz belgisini qo'shing.", 'Написано только число. Добавь к числу знак процента.', 'Only a number. Add the percent sign to the number.'),
      px: L3("Bu piksel. Oynaning yarmi uchun foiz kerak.", 'Это пиксели. Для половины окна нужны проценты.', 'That’s pixels. Half the window needs percent.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va foiz belgisini bo'sh joysiz yozing.", 'Браузер не узнал это значение. Напиши число и знак процента без пробела.', 'The browser didn’t recognize that value. Write the number and the percent sign with no space.'),
      other: L3("Bu boshqa qism. Yarmi degani ellik foiz.", 'Это другая часть. Половина — это пятьдесят процентов.', 'That’s a different part. Half is fifty percent.')
    },
    hints: [
      L3("Butun oyna yuz foiz. Yarmi qancha?", 'Всё окно — сто процентов. Сколько половина?', 'The whole window is a hundred percent. What’s half?'),
      L3("Yarmi ellik foiz: son ellik va foiz belgisi.", 'Половина — пятьдесят процентов: число пятьдесят и знак процента.', 'Half is fifty percent: the number fifty and the percent sign.'),
      L3("Ellik sonini yozing, yoniga foiz belgisini qo'ying va Tekshirishni bosing.", 'Впиши число пятьдесят, поставь рядом знак процента и нажми «Проверить».', 'Type the number fifty, put the percent sign next to it and tap Check.')
    ],
    ok: L3("Barakalla! Abzas oynaning roppa-rosa yarmida.", 'Молодец! Абзац ровно на половину окна.', 'Well done! The paragraph is exactly half the window.'),
    ask: L3("Abzas oynaning yarmi bo'lsin", 'Пусть абзац будет на половину окна', 'Make the paragraph half the window')
  },
  s7: {
    eyebrow: L3("O'zgaradimi?", 'Меняется ли?', 'Does it change?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men kodni ko'rsataman, siz esa oyna torayganda element o'zgaradimi yoki yo'qmi, shuni tanlang.", 'Теперь проверь себя. Я покажу код, а ты выбери: изменится ли элемент, когда окно сузится?', 'Now check yourself. I’ll show some code, and you choose: will the element change when the window gets narrower?'),
    ask: L3("Oyna torayganda nima bo'ladi?", 'Что будет, когда окно сузится?', 'What happens when the window narrows?'),
    card: L3('Kod', 'Код', 'Code'),
    hint1: L3("Birlikka qarang: px mi yoki foiz mi?", 'Посмотри на единицу: px или процент?', 'Look at the unit: px or percent?'),
    hint2: L3("px o'zgarmaydi, foiz esa oynaga qarab o'zgaradi.", 'px не меняется, а процент меняется вслед за окном.', 'px stays the same, and percent changes with the window.'),
    items: [
      { code: 'width: 200px;', right: 'fixed', why: L3("Ikki yuz piksel doim ikki yuz piksel, oyna qanday bo'lmasin.", 'Двести пикселей — всегда двести, какое бы ни было окно.', 'Two hundred pixels is always two hundred, whatever the window.') },
      { code: 'width: 50%;', right: 'flex', why: L3("Ellik foiz oynaning yarmi: oyna torayadi, u ham torayadi.", 'Пятьдесят процентов — половина окна: окно уже, и он уже.', 'Fifty percent is half the window: the window narrows, so does it.') },
      { code: 'width: 100%;', right: 'flex', why: L3("Yuz foiz butun oyna, oyna bilan birga o'zgaradi.", 'Сто процентов — всё окно, меняется вместе с ним.', 'A hundred percent is the whole window and changes with it.') },
      { code: 'width: 80px;', right: 'fixed', why: L3("Sakson piksel o'zgarmaydi.", 'Восемьдесят пикселей не меняются.', 'Eighty pixels stays the same.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Piksel va foizni adashtirmaysiz.", 'Всё верно! Ты не путаешь пиксели и проценты.', 'All correct! You don’t mix up pixels and percent.')
  },
  s8: {
    eyebrow: L3("Balandlik", 'Высота', 'Height'),
    say: L3("Kenglikdan tashqari balandlik ham bor: height. U ham piksellarda yoziladi.", 'Кроме ширины есть и высота: height. Её тоже пишут в пикселях.', 'Besides width there’s also height: height. It’s written in pixels too.'),
    sayTall: L3("Sarlavhaga height sakson piksel. Sarlavha balandroq bo'ldi, matn esa uning tepasida qoldi.", 'Заголовку height восемьдесят пикселей. Заголовок стал выше, а текст остался вверху.', 'Height eighty pixels for the heading. The heading got taller, and the text stayed at the top.'),
    sayImgH: L3("Suratga faqat height oltmish piksel. Surat kichraydi, kengligi esa o'zi moslashdi.", 'Фото — только height шестьдесят пикселей. Фото уменьшилось, а ширина подстроилась сама.', 'For the photo, only height sixty pixels. The photo got smaller, and the width adjusted by itself.'),
    sayBoth: L3("Endi suratga ham width, ham height beramiz: ikki yuz va oltmish. Qarang, surat yassilanib qoldi. Ikkalasini birga yozsak, surat cho'ziladi.", 'А теперь дадим фото и width, и height: двести и шестьдесят. Смотри, фото сплющилось. Если написать оба, фото растягивается.', 'Now we give the photo both width and height: two hundred and sixty. Look, the photo got squashed. With both, the photo stretches.'),
    done: L3("Demak, height balandlikni beradi. Suratga bittasini yozsangiz, ikkinchisi o'zi moslashadi.", 'Значит, height задаёт высоту. Если у фото написать одно, второе подстроится само.', 'So height sets the height. If you write one for a photo, the other adjusts by itself.'),
    askStart: L3("Qarang: height — balandlik", 'Смотри: height — высота', 'Watch: height is the height'),
    askTall: L3("Qarang: sarlavha 80px baland", 'Смотри: заголовок высотой 80px', 'Watch: the heading 80px tall'),
    askImgH: L3("Qarang: surat faqat height bilan", 'Смотри: фото только с height', 'Watch: the photo with only height'),
    askBoth: L3("Qarang: ikkalasi — cho'zildi", 'Смотри: оба — растянулось', 'Watch: both, so it stretched'),
    askDone: L3("height — balandlik", 'height — высота', 'height is the height')
  },
  s9: {
    eyebrow: L3("Baland sarlavha", 'Высокий заголовок', 'A tall heading'),
    say: L3("Sarlavhaning balandligini sakson piksel qiling: height uchun qiymatni yozing.", 'Сделай высоту заголовка восемьдесят пикселей: впиши значение для height.', 'Make the heading eighty pixels tall: type the value for height.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Son yoniga px qo'shing.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing.", 'Браузер не узнал это значение. Напиши число и px.', 'The browser didn’t recognize that value. Write a number and px.'),
      other: L3("Bu boshqa balandlik. Sarlavha sakson piksel bo'lishi kerak.", 'Это другая высота. Заголовок должен быть восемьдесят пикселей.', 'That’s a different height. The heading should be eighty pixels.')
    },
    hints: [
      L3("Qiymat son va px dan iborat.", 'Значение — число и px.', 'The value is a number and px.'),
      L3("Son sakson, birlik px.", 'Число восемьдесят, единица px.', 'The number is eighty, the unit is px.'),
      L3("80px deb yozing va Tekshirishni bosing.", 'Впиши 80px и нажми «Проверить».', 'Type 80px and tap Check.')
    ],
    ok: L3("Ajoyib! Sarlavha sakson piksel baland.", 'Отлично! Заголовок высотой восемьдесят пикселей.', 'Great! The heading is eighty pixels tall.'),
    ask: L3("Sarlavha balandligini 80 piksel qiling", 'Сделай высоту заголовка 80 пикселей', 'Make the heading 80 pixels tall')
  },
  s10: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men to'rtburchakni ko'rsataman, siz esa uni qaysi kod chizganini tanlang.", 'Теперь проверь себя. Я покажу прямоугольник, а ты выбери, какой код его нарисовал.', 'Now check yourself. I’ll show a rectangle, and you pick the code that drew it.'),
    ask: L3("Bu to'rtburchakni qaysi kod beradi?", 'Какой код даёт этот прямоугольник?', 'Which code makes this rectangle?'),
    hint1: L3("To'rtburchak keng va pastmi yoki tor va balandmi?", 'Прямоугольник широкий и низкий или узкий и высокий?', 'Is the rectangle wide and short, or narrow and tall?'),
    hint2: L3("width kenglik, ya'ni yonga qancha; height balandlik, ya'ni tepaga qancha.", 'width — ширина, то есть насколько вбок; height — высота, то есть насколько вверх.', 'width is the width, meaning how far sideways; height is the height, meaning how far up.'),
    rounds: [
      { want: 'width: 160px; height: 40px;', opts: ['width: 40px; height: 160px;', 'width: 160px; height: 40px;', 'width: 160px; height: 160px;'],
        why: L3("To'rtburchak keng va past: kengligi bir yuz oltmish, balandligi qirq.", 'Прямоугольник широкий и низкий: ширина сто шестьдесят, высота сорок.', 'The rectangle is wide and short: width one hundred sixty, height forty.') },
      { want: 'width: 60px; height: 120px;', opts: ['width: 60px; height: 120px;', 'width: 120px; height: 60px;', 'width: 60px; height: 60px;'],
        why: L3("Bu tor va baland: kengligi oltmish, balandligi bir yuz yigirma.", 'Этот узкий и высокий: ширина шестьдесят, высота сто двадцать.', 'This one is narrow and tall: width sixty, height one hundred twenty.') },
      { want: 'width: 100px; height: 100px;', opts: ['width: 100px; height: 40px;', 'width: 40px; height: 100px;', 'width: 100px; height: 100px;'],
        why: L3("Kengligi va balandligi teng, demak bu kvadrat: yuz va yuz.", 'Ширина и высота равны, значит, это квадрат: сто и сто.', 'The width and height are equal, so it’s a square: a hundred by a hundred.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Kenglik va balandlikni adashtirmaysiz.", 'Всё верно! Ты не путаешь ширину и высоту.', 'All correct! You don’t mix up width and height.')
  },
  s11: {
    eyebrow: L3("O'lcham buzilsa", 'Когда размер ломается', 'When a size breaks'),
    say: L3("O'lchamni yozishda ham xatolar bo'ladi. Keling, uchtasini ko'ramiz.", 'В размерах тоже бывают ошибки. Давай посмотрим на три.', 'Sizes can have mistakes too. Let’s look at three.'),
    sayNoUnit: L3("Birinchisi: ikki yuz sonidan keyin px yo'q. Brauzer qoidani tashlab yubordi, surat yana katta.", 'Первая: после двухсот нет px. Браузер выбросил правило, фото снова большое.', 'The first: there’s no px after two hundred. The browser threw the rule away, and the photo is big again.'),
    saySpace: L3("Ikkinchisi: son va foiz belgisi orasida bo'sh joy. Bu ham ishlamaydi.", 'Вторая: между числом и знаком процента пробел. Тоже не работает.', 'The second: a space between the number and the percent sign. That doesn’t work either.'),
    sayStretch: L3("Uchinchisi xato emas, lekin chiroyli ham emas: suratga ikki yuzga ikki yuz berdik, u kvadrat bo'lib cho'zildi.", 'Третья — не ошибка, но и не красиво: дали фото двести на двести, и оно растянулось в квадрат.', 'The third isn’t an error, but it isn’t pretty either: we gave the photo two hundred by two hundred, and it stretched into a square.'),
    done: L3("Demak, son va birlik bo'sh joysiz yoziladi, suratga esa odatda faqat kenglik beriladi.", 'Значит, число и единица пишутся без пробела, а фото обычно задают только ширину.', 'So the number and unit go together with no space, and a photo usually gets only a width.'),
    askNoUnit: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askSpace: L3("Qarang: bo'sh joy", 'Смотри: пробел', 'Watch: a space'),
    askStretch: L3("Qarang: surat cho'zildi", 'Смотри: фото растянулось', 'Watch: the photo stretched'),
    askDone: L3("Son va birlik birga, suratga — bitta o'lcham", 'Число и единица вместе, фото — один размер', 'Number and unit together, one size for a photo')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men surat kengligini yozdim, lekin u ishlamayapti! Maydondagi qiymatga qarang va uni tuzating.", 'Ой, я написал ширину фото, но она не работает! Посмотри на значение в поле и исправь его.', 'Oops, I wrote the photo’s width, but it doesn’t work! Look at the value in the field and fix it.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      space: L3("Son va px orasida hali ham bo'sh joy bor. Uni olib tashlang.", 'Между числом и px всё ещё пробел. Убери его.', 'There’s still a space between the number and px. Remove it.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px bo'sh joysiz bo'ladi.", 'Браузер не узнал это значение. Число и px пишутся без пробела.', 'The browser didn’t recognize that value. The number and px go together with no space.'),
      other: L3("Kenglik o'zgarib ketdi. Bir yuz oltmish piksel qolsin, faqat bo'sh joyni olib tashlang.", 'Ширина поменялась. Пусть остаётся сто шестьдесят пикселей, просто убери пробел.', 'The width changed. Keep one hundred sixty pixels; just remove the space.')
    },
    hints: [
      L3("Maydondagi qiymatni diqqat bilan o'qing: nima ortiqcha?", 'Внимательно прочитай значение в поле: что лишнее?', 'Read the value in the field carefully: what’s extra?'),
      L3("Son va px o'rtasida bo'sh joy bor. Brauzer buni tanimaydi.", 'Между числом и px пробел. Браузер такое не узнаёт.', 'There’s a space between the number and px. The browser doesn’t recognize that.'),
      L3("160px deb yozing va Tekshirishni bosing.", 'Впиши 160px и нажми «Проверить».', 'Type 160px and tap Check.')
    ],
    ok: L3("Ura, ishladi! Surat bir yuz oltmish piksel.", 'Ура, заработало! Фото сто шестьдесят пикселей.', 'Yes, it works! The photo is one hundred sixty pixels.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Inspektorga qarang va buzilgan qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на Инспектор и нажми сломанное правило.', 'Now check yourself. There are three rules, but one doesn’t work. Look at the Inspector and tap the broken rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: Inspektor shu o'lchamni ko'rsatyapti. Qaysi element o'zgarmay qoldi?", 'Это правило работает: Инспектор показывает этот размер. Какой элемент не изменился?', 'This rule works: the Inspector shows that size. Which element didn’t change?'),
    found: {
      unit: L3("Topdingiz! Bir yuz ellik sonidan keyin px yo'q edi.", 'Нашёл! После ста пятидесяти не было px.', 'Found it! There was no px after one hundred fifty.'),
      space: L3("Topdingiz! Qirq va foiz belgisi orasida bo'sh joy bor edi.", 'Нашёл! Между сорока и знаком процента был пробел.', 'Found it! There was a space between forty and the percent sign.')
    },
    hint1: L3("Inspektorga qarang: qaysi element kod aytgandek emas?", 'Посмотри на Инспектор: какой элемент не такой, как в коде?', 'Look at the Inspector: which element doesn’t match the code?'),
    hint2: {
      unit: L3("Sarlavha butun qatorni egallab turibdi. Uning kengligi yonida birlik bormi?", 'Заголовок занимает всю строку. Есть ли единица у его ширины?', 'The heading takes the whole line. Does its width have a unit?'),
      space: L3("Surat kichraymadi. Uning kengligi qanday yozilgan?", 'Фото не уменьшилось. Как записана его ширина?', 'The photo didn’t get smaller. How is its width written?')
    },
    hint3: {
      unit: L3("Xato birinchi qoidada: px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      space: L3("Xato ikkinchi qoidada: bo'sh joy. O'sha qatorni bosing.", 'Ошибка во втором правиле: пробел. Нажми эту строку.', 'The bug is in the second rule: a space. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz o'lchamlarni haqiqiy dizayner kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь размеры как настоящий дизайнер.', 'Super! Both are found. You check sizes like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Surat butun oyna kengligida bo'lsin: img uchun width xususiyatini foizda yozing.", 'Теперь напиши правило целиком сам. Пусть фото будет во всю ширину окна: напиши для img свойство width в процентах.', 'Now write the whole rule yourself. Let the photo fill the whole width of the window: write the width property for img in percent.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin jingalak qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Surat uchun img selektori kerak.", 'Для фото нужен селектор img.', 'The photo needs the img selector.'),
      prop: L3("Kenglikni width xususiyati beradi.", 'Ширину задаёт свойство width.', 'The width property sets the width.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va foiz belgisini bo'sh joysiz yozing.", 'Браузер не узнал это значение. Напиши число и знак процента без пробела.', 'The browser didn’t recognize that value. Write the number and the percent sign with no space.'),
      other: L3("Surat butun oynani egallamadi. Butun oyna degani yuz foiz.", 'Фото не заняло всё окно. Всё окно — это сто процентов.', 'The photo didn’t fill the whole window. The whole window is a hundred percent.')
    },
    hints: [
      L3("Surat qaysi selektor bilan tanlanadi? Butun oyna necha foiz?", 'Каким селектором выбирают фото? Сколько процентов всё окно?', 'Which selector picks the photo? How many percent is the whole window?'),
      L3("Selektor img, xususiyat width, qiymat yuz foiz.", 'Селектор img, свойство width, значение сто процентов.', 'The selector is img, the property width, the value a hundred percent.'),
      L3("Shunday yozing: img, jingalak qavs, width, ikki nuqta, yuz va foiz belgisi, nuqtali vergul va yopuvchi jingalak qavs.", 'Напиши так: img, фигурная скобка, width, двоеточие, сто и знак процента, точка с запятой и закрывающая фигурная скобка.', 'Write: img, a curly brace, width, a colon, a hundred and the percent sign, a semicolon and a closing curly brace.')
    ],
    ok: L3("Ajoyib! Surat butun oyna kengligida. Qoidani o'zingiz yozdingiz.", 'Отлично! Фото во всю ширину окна. Ты сам написал правило.', 'Great! The photo fills the window width. You wrote the rule yourself.'),
    ask: L3("Suratni butun oyna kengligida qiladigan qoidani yozing", 'Напиши правило, которое растянет фото на всю ширину окна', 'Write a rule that makes the photo fill the window width')
  },
  s14: {
    eyebrow: L3("O'z otkritkangiz", 'Своя открытка', 'Your own postcard'),
    say: L3("Endi o'z otkritkangizni yasang. Surat uchun istalgan kenglikni yozing, abzas uchun ham. Piksel yoki foiz, o'zingiz tanlang. Keyin «Tayyor»ni bosing.", 'Теперь сделай свою открытку. Впиши любую ширину для фото и для абзаца. Пиксели или проценты — выбирай сам. Потом нажми «Готово».', 'Now make your own postcard. Type any width for the photo and for the paragraph. Pixels or percent, you choose. Then tap “Done”.'),
    msgs: {
      bad: L3("Brauzer {w} ni o'lcham deb tanimadi. Son va px yoki foiz belgisini bo'sh joysiz yozing.", 'Браузер не узнал размер в {w}. Напиши число и px или знак процента без пробела.', 'The browser didn’t recognize {w} as a size. Write a number with px or the percent sign, with no space.')
    },
    hints: [
      L3("Surat qanchalik katta bo'lsin? Abzas-chi?", 'Насколько большим будет фото? А абзац?', 'How big should the photo be? And the paragraph?'),
      L3("Kenglik son va px yoki son va foiz belgisi bilan yoziladi.", 'Ширина — число и px или число и знак процента.', 'A width is a number with px, or a number with the percent sign.'),
      L3("Masalan, suratga bir yuz oltmish piksel, abzasga esa yetmish foiz yozing. Keyin «Tayyor»ni bosing.", 'Например, впиши сто шестьдесят пикселей для фото и семьдесят процентов для абзаца. Потом нажми «Готово».', 'For example, type one hundred sixty pixels for the photo and seventy percent for the paragraph. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning otkritkangiz.", 'Ого, как красиво! Это твоя открытка.', 'Wow, how pretty! That’s your postcard.'),
    ask: L3('Ikkita kenglikni yozing, «Tayyor»ni bosing', 'Впиши две ширины, нажми «Готово»', 'Type two widths, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapda qaysi birlik haqida gap ketyapti: px mi yoki foiz mi?", 'О какой единице фраза: px или процент?', 'Which unit is the sentence about: px or percent?'),
    hint2: L3("Dars esingizdami: px o'zgarmaydi, foiz oyna bilan o'zgaradi, son va birlik birga yoziladi, suratga bitta o'lcham bersak, ikkinchisi moslashadi.", 'Вспомни урок: px не меняется, процент меняется с окном, число и единица пишутся вместе, если у фото один размер — второй подстраивается.', 'Remember the lesson: px stays the same, percent changes with the window, the number and unit go together, and if a photo has one size, the other adjusts.'),
    items: [
      { t: L3("Ellik foizli kenglik elementni oynaning yarmi qiladi.", 'Ширина в пятьдесят процентов делает элемент на половину окна.', 'A width of fifty percent makes the element half the window.'), right: true, code: 'half',
        why: L3("To'g'ri: ellik foiz yarmi degani.", 'Верно: пятьдесят процентов — половина.', 'Right: fifty percent means half.') },
      { t: L3("Oyna torayganda 200px kenglik ham torayadi.", 'Когда окно сужается, ширина 200px тоже сужается.', 'When the window narrows, a 200px width narrows too.'), right: false,
        why: L3("Aslida piksel o'zgarmaydi: ikki yuz piksel doim ikki yuz.", 'На самом деле пиксели не меняются: двести — всегда двести.', 'Actually pixels don’t change: two hundred is always two hundred.') },
      { t: L3("Suratga faqat width bersak, balandligi o'zi moslashadi.", 'Если дать фото только width, высота подстроится сама.', 'If we give a photo only width, the height adjusts by itself.'), right: true, code: 'img',
        why: L3("Shunday: surat cho'zilmaydi, pastki tomoni o'zi moslashadi.", 'Так и есть: фото не растягивается, высота подстраивается сама.', 'That’s right: the photo doesn’t stretch, the height adjusts by itself.') },
      { t: L3("width: 200 ham ishlaydi, px shart emas.", 'width: 200 тоже работает, px не обязателен.', 'width: 200 works too; px isn’t needed.'), right: false, code: 'unit',
        why: L3("Aslida px kerak. Usiz brauzer qoidani tashlab yuboradi.", 'На самом деле px нужен. Без него браузер выбрасывает правило.', 'Actually px is needed. Without it the browser throws the rule away.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz o'lchamlarni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в размерах.', 'All correct! You know sizes really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men uzun abzasga height o'ttiz piksel bergan edim va ortiqcha matn yashirinadi deb o'ylagan edim? Qarang, afsuski, men adashibman. Matn yashirinmadi, u ramkadan chiqib, pastga tushib ketdi. Brauzer matnni o'zi yashirmaydi.",
        'Вернёмся к загадке. Помнишь, я дал длинному абзацу height тридцать пикселей и думал, что лишний текст спрячется? Смотри, увы, я ошибся. Текст не спрятался, он вылез из рамки и свисает вниз. Браузер сам текст не прячет.',
        'Back to our riddle. Remember, I gave a long paragraph height thirty pixels and thought the extra text would hide? Look, sadly, I was wrong. The text didn’t hide; it came out of the frame and hangs down below. The browser doesn’t hide text by itself.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning otkritkangiz, o'zingiz tanlagan o'lchamlar bilan!", 'Смотри, это твоя открытка с размерами, которые ты выбрал сам!', 'Look, this is your postcard with the sizes you picked yourself!'), k: null },
      { text: L3("width kenglikni, height esa balandlikni beradi.", 'width задаёт ширину, а height — высоту.', 'width sets the width, and height sets the height.'), k: 'wh' },
      { text: L3("px o'zgarmaydi, foiz esa oyna bilan birga o'zgaradi.", 'px не меняется, а проценты меняются вместе с окном.', 'px stays the same, and percent changes with the window.'), k: 'unit' },
      { text: L3("Suratga odatda faqat width beriladi, shunda u cho'zilmaydi.", 'Фото обычно задают только width, тогда оно не растягивается.', 'A photo usually gets only width, so it doesn’t stretch.'), k: 'img' },
      { text: L3("Tabriklayman! Endi elementlar siz xohlagan o'lchamda. Keyingi darsda elementlar atrofidagi bo'shliqlar va chegaralarni o'rganamiz. Ko'rishguncha!", 'Ура! Теперь элементы такого размера, как ты хочешь. На следующем уроке узнаем про отступы и рамки вокруг элементов. До встречи!', 'Hooray! Now elements are the size you want. Next time we’ll learn about the spacing and borders around elements. See you!'), k: null }
    ],
    roles: {
      wh: L3('width, height', 'width, height', 'width, height'),
      unit: L3("px — doimiy, foiz — oyna bilan", 'px — постоянно, проценты — с окном', 'px fixed, percent with the window'),
      img: L3("img — faqat width", 'img — только width', 'img — width only')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayH1: 1, sayImg: 1, sayHalf: 1, sayFix: 1, sayNarrow: 1,
  sayTall: 1, sayImgH: 1, sayBoth: 1, sayNoUnit: 1, saySpace: 1, sayStretch: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c6-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c6.css@*/
`;
