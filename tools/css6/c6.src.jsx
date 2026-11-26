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
    say: L3("Salom! Tog'ga sayohatga borib keldim va saytimga bitta surat joyladim. Lekin qarang-chi, surat juda kattakon chiqibdi: sahifaning yarmini egallab olgan, matn esa pastga tushib qolgan. Qani, «Aylantirish» tugmasini bosing!",
      'Привет! Я выложил фото из поездки. Но смотри, оно огромное: заняло полстраницы, а текст уехал вниз. Нажми «Превратить».',
      'Hi! I posted a photo from my trip. But look, it’s huge: it takes up half the page, and the text got pushed down. Tap “Transform”.'),
    magic: L3("Voy, qarang! Surat ixchamgina bo'lib qoldi, abzas esa oynaning bir qismini egallab turibdi. Har bir element yonidagi yozuvchalarni ko'ryapsizmi? Ularni Inspektor yozib qo'ygan: u har bir elementning o'lchamini ko'rsatib turadi.", 'Вот! Фото стало аккуратным, а абзац занимает часть окна. Инспектор показывает размер каждого элемента.', 'There! The photo is neat now, and the paragraph takes part of the window. The Inspector shows each element’s size.'),
    magicP: L3("Buni ikkita xususiyat qildi. Birinchisi width, ya'ni kenglik degani. Ikkinchisi height, bu so'z inglizchada «balandlik» degani.", 'Это сделали два свойства: width, то есть ширина, и height, то есть высота.', 'Two properties did it: width, meaning the width, and height, meaning the height.'),
    done: L3("Bugun elementlarning o'lchamini o'zingiz boshqarishni o'rganasiz. Sayohat haqidagi uzun abzasim ko'p joy olyapti, shuning uchun unga height o'ttiz piksel berdim. Endi ikki xil bo'lishi mumkin: sig'magan matn yashirinib qoladi yoki abzasdan tashqariga chiqib ketadi. Men birinchisiga ishonaman. Siz qaysi biriga ovoz berasiz? Matn qayerga ketganini dars oxirida sahifamning o'zida ko'ramiz.",
      'Сегодня ты научишься управлять размерами элементов. Но сначала маленькая загадка. Я дал длинному абзацу высоту: height тридцать пикселей. По-моему, текст, который не влез, просто спрячется. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to control element sizes. But first, a little riddle. I gave a long paragraph a height: height thirty pixels. I think the text that doesn’t fit will just hide. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("width — kenglik, height — balandlik", 'width — ширина, height — высота', 'width is width, height is height')
  },
  s2: {
    eyebrow: L3("Kenglik", 'Ширина', 'Width'),
    help: [
      L3("Inspektorga bir qarang-chi: har bir elementning yonida uning kengligi va balandligi yozib qo'yilgan. Koddagi width soni o'zgarsa, Inspektordagi son ham darrov o'zgaradi.", 'Посмотри на Инспектор: у каждого элемента написаны ширина и высота. Меняется число width в коде — меняется и число в Инспекторе.', 'Look at the Inspector: every element shows its width and height. When the width number changes in the code, the Inspector number changes too.'),
      L3("Nega shunday? Chunki width elementning kengligini beradi. Suratga faqat width yozsangiz, balandligi o'zi moslashadi, shuning uchun surat cho'zilib ketmaydi.", 'width задаёт ширину элемента. Если у фото написать только width, высота подстроится сама, и фото не растянется.', 'width sets an element’s width. If a photo gets only width, its height adjusts by itself and the photo isn’t stretched.'),
      L3("Telefonda suratni ikki barmoq bilan kichraytirganingiz esingizdami? Surat kichrayadi-yu, lekin qiyshayib ketmaydi. width ham suratni xuddi shunday, buzmasdan kichraytiradi.", 'Вспомни, как на телефоне уменьшаешь фото двумя пальцами: оно уменьшается, не искажаясь. width уменьшает фото так же.', 'Remember shrinking a photo on a phone with two fingers: it gets smaller without distorting. width shrinks a photo the same way.')
    ],
    say: L3("Inspektor har bir elementning yonida uning kengligi va balandligini yozib turibdi. Sarlavhaga qarang-chi: u odatda butun qatorni egallaydi. Uning kengligini width bilan o'zgartiramiz.",
      'Посмотри на Инспектор: у каждого элемента написаны ширина и высота. Заголовок обычно занимает всю строку. Его ширину меняют через width.',
      'Look at the Inspector: each element shows its width and height. A heading normally takes the whole line. We change its width with width.'),
    sayH1: L3("Oldin h1 sarlavhasiga width ikki yuz piksel beramiz. Ko'rdingizmi? Sarlavha qisqarib qoldi, Inspektorda ham endi ikki yuz turibdi.", 'Для h1 width двести пикселей. Смотри, заголовок стал короче: в Инспекторе теперь двести.', 'For h1, width two hundred pixels. Look, the heading got shorter: the Inspector now says two hundred.'),
    sayImg: L3("Endi suratning navbati: unga width yuz ellik piksel yozamiz. Ana, surat kichraydi, balandligi esa o'zi moslashib oldi. Shuning uchun surat cho'zilmadi, tog'lar ham qiyshaymadi.", 'Теперь фото: width сто пятьдесят пикселей. Фото уменьшилось, а высота подстроилась сама: фото не растянулось.', 'Now the photo: width one hundred fifty pixels. The photo got smaller, and the height adjusted by itself: the photo didn’t stretch.'),
    done: L3("Demak, kenglikni width beradi. Suratga faqat width yozsak, balandligini brauzer o'zi moslab qo'yadi.", 'Значит, width задаёт ширину. Если у фото написать только width, высота подстроится сама.', 'So width sets the width. If a photo has only width, the height adjusts by itself.'),
    askStart: L3("Qarang: Inspektor o'lchamlari", 'Смотри: размеры в Инспекторе', 'Watch: sizes in the Inspector'),
    askH1: L3("Qarang: sarlavha 200px", 'Смотри: заголовок 200px', 'Watch: the heading at 200px'),
    askImg: L3("Qarang: surat 150px", 'Смотри: фото 150px', 'Watch: the photo at 150px'),
    askDone: L3("width — kenglik, pikselda", 'width — ширина в пикселях', 'width is the width in pixels')
  },
  s3: {
    eyebrow: L3("Surat kengligi", 'Ширина фото', 'Photo width'),
    say: L3("Endi navbat sizga! Tog' suratimning kengligini ikki yuz piksel qiling: width uchun qiymatni yozing.", 'Теперь твоя очередь. Сделай ширину фото двести пикселей: впиши значение для width.', 'Now it’s your turn. Make the photo two hundred pixels wide: type the value for width.'),
    msgs: {
      empty: L3("Maydon hali bo'm-bo'sh. Bu yerga son va px yozing.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Son yozilibdi-yu, birligi tushib qolibdi. Birliksiz sonni brauzer o'tkazib yuboradi, shuning uchun yoniga px qo'shing.", 'Написано только число. Браузер его выбрасывает: добавь к числу px.', 'Only a number. The browser throws it away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Sonni yozing-da, yoniga bo'sh joysiz px qo'shing.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Bu boshqa kenglik bo'lib qoldi. Suratga aynan ikki yuz piksel kerak.", 'Это другая ширина. Фото должно быть двести пикселей.', 'That’s a different width. The photo should be two hundred pixels.'),
      pct: L3("Siz foiz yozibsiz. Bu safar bizga piksel kerak: son va px.", "Это проценты. Здесь нужны пиксели: число и px.", "That’s percent. Here you need pixels: a number and px."),
      space: L3("Son bilan px o'rtasida bo'sh joy qolibdi. Ularni qo'shib yozing.", "Между числом и px не нужен пробел: пиши слитно.", "No space between the number and px: write them together.")
    },
    hints: [
      L3("Qiymatga ikkita narsa kerak: son va o'lchov birligi.", 'Значение — число и единица.', 'The value is a number and a unit.'),
      L3("Son ikki yuz bo'ladi, birligi esa px.", 'Число двести, единица px.', 'The number is two hundred, the unit is px.'),
      L3("200px deb yozing-da, «Tekshirish»ni bosing.", 'Впиши 200px и нажми «Проверить».', 'Type 200px and tap Check.')
    ],
    ok: L3("Zo'r! Surat endi ikki yuz piksel, Inspektor ham xuddi shuni ko'rsatib turibdi.", 'Огонь! Фото двести пикселей, и Инспектор это показывает.', 'Awesome! The photo is two hundred pixels, and the Inspector shows it.'),
    ask: L3("Surat kengligini 200 piksel qiling", 'Сделай ширину фото 200 пикселей', 'Make the photo 200 pixels wide')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi ko'z bilan chamalab ko'ramiz! Chapda uchta kenglik, o'ngda esa uchta chiziq bor. Kenglikni bosing-da, keyin o'ngdan shu kenglikdagi chiziqni toping.", 'Теперь соедини ширины с полосками. Нажми ширину слева, а потом полоску такой ширины справа.', 'Now match the widths with the bars. Tap a width on the left, then the bar of that width on the right.'),
    why: {
      w60: L3("Hechqisi yo'q! Oltmish piksel uchalasining eng qisqasi bo'ladi. Unga eng kalta chiziqni qidiring.", 'Шестьдесят пикселей — самая короткая ширина. Найди самую короткую полоску.', 'Sixty pixels is the shortest width. Find the shortest bar.'),
      w120: L3("Unday emas: yuz yigirma piksel o'rtacha kenglik bo'ladi. U eng kalta chiziqdan ikki baravar uzun.", 'Сто двадцать пикселей — средняя: вдвое длиннее короткой.', 'One hundred twenty pixels is medium: twice the short one.'),
      w180: L3("Yana bir qarang-chi: yuz sakson piksel eng katta kenglik. Unga eng uzun chiziq mos keladi.", 'Сто восемьдесят пикселей — самая длинная. Найди самую длинную полоску.', 'One hundred eighty pixels is the longest. Find the longest bar.')
    },
    pairOk: {
      w60: L3("To'ppa-to'g'ri, eng kaltasi shu!", 'Верно, это самая короткая.', 'Right, that’s the shortest.'),
      w120: L3("Ana, o'rtachasi ham topildi.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      w180: L3("Ha, eng uzuni aynan shu!", 'Верно, это самая длинная.', 'Right, that’s the longest.')
    },
    pickFirst: L3("Oldin chapdan kenglikni tanlang.", 'Сначала выбери ширину слева.', 'First pick a width on the left.'),
    hints: [
      L3("Sonlarni solishtirib ko'ring: son qancha katta bo'lsa, chiziq ham shuncha uzun bo'ladi.", 'Чем больше число, тем длиннее полоска.', 'The bigger the number, the longer the bar.'),
      L3("60px eng kalta chiziqniki, 180px eng uzun chiziqniki, 120px esa ularning o'rtasida.", '60px — самая короткая, 180px — самая длинная, 120px — посередине.', '60px is the shortest, 180px the longest, 120px in between.'),
      L3("Yonib turgan kenglik bilan chiziqni ketma-ket bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Kenglikni endi ko'z bilan ham chamalay olasiz.", 'Отлично! Ты прикидываешь ширину на глаз.', 'Great! You can estimate width by eye.'),
    ask: L3("Kenglikni, keyin chiziqni bosing", 'Нажми ширину, потом полоску', 'Tap a width, then a bar'),
    askPlace: L3("Endi shu kenglikdagi chiziqni bosing", 'Теперь нажми полоску такой ширины', 'Now tap the bar of that width')
  },
  s5: {
    eyebrow: L3("Foizlar", 'Проценты', 'Percent'),
    help: [
      L3("Abzas bilan sarlavhaga qarab turing-chi. Oyna torayganda ulardan biri ham torayadi, ikkinchisi esa qimir etmaydi.", 'Посмотри на абзац и заголовок, а потом следи, что будет, когда окно сузится: кто-то станет уже, а кто-то нет.', 'Look at the paragraph and the heading, then watch what happens when the window narrows: one gets narrower, one doesn’t.'),
      L3("Nega bunday bo'ladi? Chunki foiz elementga oynaning qancha qismini olishni aytadi: yuz foiz butun oyna, ellik foiz uning yarmi bo'ladi. Piksel esa oyna qanday bo'lmasin, doim bir xil qoladi.", 'Проценты говорят, какую часть окна занять: сто процентов — всё окно, пятьдесят — половина. А пиксели всегда одинаковые.', 'Percent says what part of the window to take: a hundred percent is the whole window, fifty is half. Pixels always stay the same.'),
      L3("Pitsani tasavvur qiling: katta pitsaning yarmi ham, kichkina pitsaning yarmi ham baribir yarmi bo'ladi. Ellik foiz ham shunday: oyna katta bo'ladimi, kichikmi, abzas baribir uning yarmini oladi.", 'Половина пиццы — это половина и большой, и маленькой пиццы. Пятьдесят процентов так же: половина того окна, какое есть.', 'Half a pizza is half of a big pizza and half of a small one. Fifty percent works the same: half of whatever window there is.')
    ],
    say: L3("Kenglikni pikselda emas, foizda ham yozsa bo'ladi. Foiz elementga oynaning qancha qismini egallashni aytadi: yuz foiz bo'lsa butun oyna, ellik foiz bo'lsa uning yarmi.", 'Ширину можно писать и в процентах, то есть какую часть окна занять. Сто процентов — всё окно, пятьдесят — половина.', 'You can also write width in percent, meaning how much of the window to take. A hundred percent is the whole window, fifty is half.'),
    sayHalf: L3("Abzasga width ellik foiz yozamiz. Qarang-chi, abzas oynaning roppa-rosa yarmini egalladi.", 'Абзацу width пятьдесят процентов. Смотри, он занял половину окна.', 'Width fifty percent for the paragraph. Look, it took half the window.'),
    sayFix: L3("Sarlavhaga esa solishtirish uchun ikki yuz piksel beramiz. Endi ikkalasini kuzatib turing!", 'А заголовку дадим двести пикселей, для сравнения.', 'And we give the heading two hundred pixels, to compare.'),
    sayNarrow: L3("Endi oynani toraytiramiz. Ko'rdingizmi? Abzas ham qisqarib qoldi, chunki u har doim oynaning yarmini oladi. Sarlavha esa o'sha ikki yuz pikselligicha qimir etmay turibdi.", 'Теперь сузим окно. Смотри: абзац тоже стал уже, ведь он — половина окна. А заголовок остался теми же двумястами пикселями.', 'Now let’s narrow the window. Look: the paragraph got narrower too, because it’s half the window. The heading stayed at the same two hundred pixels.'),
    done: L3("Shunday qilib, piksel o'zgarmaydi, foiz esa oyna bilan birga o'zgaradi.", 'Значит, пиксели не меняются, а проценты меняются вместе с окном.', 'So pixels stay the same, and percent changes with the window.'),
    askStart: L3("Qarang: foiz — oynaning qismi", 'Смотри: процент — часть окна', 'Watch: percent is part of the window'),
    askHalf: L3("Qarang: ellik foiz — yarmi", 'Смотри: пятьдесят процентов — половина', 'Watch: fifty percent is half'),
    askFix: L3("Qarang: 200px — solishtirish uchun", 'Смотри: 200px — для сравнения', 'Watch: 200px to compare'),
    askNarrow: L3("Qarang: oyna toraydi", 'Смотри: окно сузилось', 'Watch: the window got narrower'),
    askDone: L3("px o'zgarmaydi, foiz esa oyna bilan", 'px постоянны, проценты — вместе с окном', 'px stays, percent follows the window')
  },
  s6: {
    eyebrow: L3("Oynaning yarmi", 'Половина окна', 'Half the window'),
    say: L3("Endi foizni o'zingiz sinab ko'ring! Abzasim oynaning yarmini egallasin: width qiymatini foizda yozing.", 'Пусть абзац занимает половину окна: впиши для width значение в процентах.', 'Let the paragraph take half the window: type a percent value for width.'),
    msgs: {
      empty: L3("Bu yerga hali hech narsa yozilmadi. Son yozing-da, yoniga foiz belgisini qo'ying.", 'Впиши значение: число и знак процента.', 'Type the value: a number and the percent sign.'),
      noUnit: L3("Son bor-u, foiz belgisi yo'q. Uni son yoniga qo'shing.", 'Написано только число. Добавь к числу знак процента.', 'Only a number. Add the percent sign to the number.'),
      px: L3("Siz piksel yozibsiz. Oynaning yarmi uchun esa foiz kerak.", 'Это пиксели. Для половины окна нужны проценты.', 'That’s pixels. Half the window needs percent.'),
      bad: L3("Bunday yozuvni brauzer tanimaydi. Son bilan foiz belgisini bo'sh joysiz, qo'shib yozing.", 'Браузер не узнал это значение. Напиши число и знак процента без пробела.', 'The browser didn’t recognize that value. Write the number and the percent sign with no space.'),
      other: L3("Bu oynaning boshqa qismi bo'lib qoldi. Yarmi esa ellik foiz bo'ladi.", 'Это другая часть. Половина — это пятьдесят процентов.', 'That’s a different part. Half is fifty percent.'),
      space: L3("Foiz belgisi sondan ajralib qolibdi: o'rtadagi bo'sh joyni olib tashlang.", "Между числом и знаком процента не нужен пробел: пиши слитно.", "No space between the number and the percent sign: write them together.")
    },
    hints: [
      L3("Butun oyna yuz foiz bo'ladi. Uning yarmi-chi, qancha?", 'Всё окно — сто процентов. Сколько половина?', 'The whole window is a hundred percent. What’s half?'),
      L3("Yuzning yarmi ellik. Demak, ellik soni va foiz belgisi kerak.", 'Половина — пятьдесят процентов: число пятьдесят и знак процента.', 'Half is fifty percent: the number fifty and the percent sign.'),
      L3("Ellik sonini yozing, yoniga foiz belgisini qo'ying-da, «Tekshirish»ni bosing.", 'Впиши число пятьдесят, поставь рядом знак процента и нажми «Проверить».', 'Type the number fifty, put the percent sign next to it and tap Check.')
    ],
    ok: L3("Barakalla! Abzas endi oynaning yarmini egallab turibdi.", 'Молодец! Абзац ровно на половину окна.', 'Well done! The paragraph is exactly half the window.'),
    ask: L3("Abzas oynaning yarmi bo'lsin", 'Пусть абзац будет на половину окна', 'Make the paragraph half the window')
  },
  s7: {
    eyebrow: L3("O'zgaradimi?", 'Меняется ли?', 'Does it change?'),
    say: L3("Endi oynani toraytirib o'ynaymiz. Men sizga bittalab kod ko'rsataman. Oyna torayganda element ham o'zgaradimi yoki o'z holicha qoladimi, shuni tanlang.", 'Теперь проверь себя. Я покажу код, а ты выбери: изменится ли элемент, когда окно сузится?', 'Now check yourself. I’ll show some code, and you choose: will the element change when the window gets narrower?'),
    ask: L3("Oyna torayganda nima bo'ladi?", 'Что будет, когда окно сузится?', 'What happens when the window narrows?'),
    card: L3('Kod', 'Код', 'Code'),
    hint1: L3("Son yonida nima turibdi: px yozuvimi yoki foiz belgisi?", 'Посмотри на единицу: px или процент?', 'Look at the unit: px or percent?'),
    hint2: L3("Pikseldagi o'lcham o'zgarmaydi, foizdagisi esa oyna orqasidan ergashadi.", 'px не меняется, а процент меняется вслед за окном.', 'px stays the same, and percent changes with the window.'),
    items: [
      { code: 'width: 200px;', right: 'fixed', why: L3("Ikki yuz piksel oyna qanday bo'lmasin, doim ikki yuz piksel bo'lib qoladi.", 'Двести пикселей — всегда двести, какое бы ни было окно.', 'Two hundred pixels is always two hundred, whatever the window.') },
      { code: 'width: 50%;', right: 'flex', why: L3("Ellik foiz oynaning yarmi bo'ladi: oyna torayishi bilan element ham torayadi.", 'Пятьдесят процентов — половина окна: окно уже, и он уже.', 'Fifty percent is half the window: the window narrows, so does it.') },
      { code: 'width: 100%;', right: 'flex', why: L3("Yuz foiz butun oynani egallaydi, shuning uchun oyna bilan birga o'zgaradi.", 'Сто процентов — всё окно, меняется вместе с ним.', 'A hundred percent is the whole window and changes with it.') },
      { code: 'width: 80px;', right: 'fixed', why: L3("Sakson piksel ham pikseldagi o'lcham, u oynaga qaramaydi va o'zgarmaydi.", 'Восемьдесят пикселей не меняются.', 'Eighty pixels stays the same.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("To'rttala kodni ham to'g'ri topdingiz! Piksel bilan foizni endi adashtirmaysiz.", 'Всё верно! Ты не путаешь пиксели и проценты.', 'All correct! You don’t mix up pixels and percent.')
  },
  s8: {
    eyebrow: L3("Balandlik", 'Высота', 'Height'),
    help: [
      L3("Sarlavha bilan suratga qarab turing: height qo'shilganda ular balandroq yoki pastroq bo'lib qoladi. Oxirida suratga yaxshilab qarang-chi: shakli o'zgaradimi?", 'Посмотри на заголовок и фото: с height они становятся выше или ниже. В конце посмотри на форму фото.', 'Look at the heading and the photo: with height they get taller or shorter. At the end, look at the photo’s shape.'),
      L3("height elementning balandligini beradi. Suratga kenglik yoki balandlikdan bittasini yozsangiz, ikkinchisi o'zi moslashadi. Ikkalasini birdan yozsangiz-chi? Unda surat cho'zilib ketishi mumkin.", 'height задаёт высоту элемента. Если у фото написать одно, второе подстроится само. Если написать оба, фото может растянуться.', 'height sets an element’s height. Give a photo just one and the other adjusts by itself. Give both, and the photo can get stretched.'),
      L3("Rezinadek cho'zilib, qiyshayib ketgan suratni ko'rganmisiz? Suratga ham width, ham height yozsangiz, xuddi shunday bo'lib qolishi mumkin.", 'Бывает, что фото растянуто, как резинка. Так случается, если самому задать фото и ширину, и высоту.', 'Ever seen a photo stretched like a rubber band? That can happen when you set both the width and the height yourself.')
    ],
    say: L3("Kenglikni bilib oldik, endi balandlikning navbati. Uni height beradi va u ham pikselda yoziladi.", 'Кроме ширины есть и высота: height. Её тоже пишут в пикселях.', 'Besides width there’s also height: height. It’s written in pixels too.'),
    sayTall: L3("Sarlavhaga height sakson piksel beramiz. Qarang, sarlavha balandroq bo'ldi, lekin uning matni tepada qolaverdi.", 'Заголовку height восемьдесят пикселей. Заголовок стал выше, а текст остался вверху.', 'Height eighty pixels for the heading. The heading got taller, and the text stayed at the top.'),
    sayImgH: L3("Endi suratga faqat height yozamiz, oltmish piksel. Surat kichraydi, kengligi esa o'zi moslashib oldi.", 'Фото — только height шестьдесят пикселей. Фото уменьшилось, а ширина подстроилась сама.', 'For the photo, only height sixty pixels. The photo got smaller, and the width adjusted by itself.'),
    sayBoth: L3("Endi-chi, suratga ham width, ham height beramiz: kengligi ikki yuz, balandligi oltmish. Voy, qarang, surat yassilanib qoldi! Ikkalasini birga yozsak, surat shunaqa cho'zilib ketishi mumkin.", 'А теперь дадим фото и width, и height: двести и шестьдесят. Смотри, фото сплющилось. Если написать оба, фото растягивается.', 'Now we give the photo both width and height: two hundred and sixty. Look, the photo got squashed. With both, the photo stretches.'),
    done: L3("Demak, balandlikni height beradi. Suratga bittasini yozsangiz bas, ikkinchisini brauzer o'zi moslaydi.", 'Значит, height задаёт высоту. Если у фото написать одно, второе подстроится само.', 'So height sets the height. If you write one for a photo, the other adjusts by itself.'),
    askStart: L3("Qarang: height — balandlik", 'Смотри: height — высота', 'Watch: height is the height'),
    askTall: L3("Qarang: sarlavha 80px baland", 'Смотри: заголовок высотой 80px', 'Watch: the heading 80px tall'),
    askImgH: L3("Qarang: surat faqat height bilan", 'Смотри: фото только с height', 'Watch: the photo with only height'),
    askBoth: L3("Qarang: ikkalasi — cho'zildi", 'Смотри: оба — растянулось', 'Watch: both, so it stretched'),
    askDone: L3("height — balandlik", 'height — высота', 'height is the height')
  },
  s9: {
    eyebrow: L3("Baland sarlavha", 'Высокий заголовок', 'A tall heading'),
    say: L3("Sarlavhamni ham balandroq qilaylik: uning balandligi sakson piksel bo'lsin. height uchun qiymatni yozing.", 'Сделай высоту заголовка восемьдесят пикселей: впиши значение для height.', 'Make the heading eighty pixels tall: type the value for height.'),
    msgs: {
      empty: L3("Hali hech narsa yozilmabdi-ku. height uchun son va px kerak.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son turibdi, px esa yo'q. Uni son yoniga qo'shing.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Bunday qiymatni brauzer bilmaydi. Bu yerga son va px kerak.", 'Браузер не узнал это значение. Напиши число и px.', 'The browser didn’t recognize that value. Write a number and px.'),
      other: L3("Bu boshqa balandlik bo'lib qoldi. Sarlavhamga sakson piksel kerak.", 'Это другая высота. Заголовок должен быть восемьдесят пикселей.', 'That’s a different height. The heading should be eighty pixels.'),
      pct: L3("Bu foiz-ku. Balandlik uchun bu yerda piksel kerak: son va px.", "Это проценты. Здесь нужны пиксели: число и px.", "That’s percent. Here you need pixels: a number and px."),
      space: L3("Bo'sh joy ortiqcha: son bilan px qo'shib yoziladi.", "Между числом и px не нужен пробел: пиши слитно.", "No space between the number and px: write them together.")
    },
    hints: [
      L3("Qiymatga yana o'sha ikki narsa kerak: son va px.", 'Значение — число и px.', 'The value is a number and px.'),
      L3("Son sakson bo'ladi, birligi esa px.", 'Число восемьдесят, единица px.', 'The number is eighty, the unit is px.'),
      L3("80px deb yozing-da, «Tekshirish»ni bosing.", 'Впиши 80px и нажми «Проверить».', 'Type 80px and tap Check.')
    ],
    ok: L3("Qoyil! Sarlavhaning balandligi endi sakson piksel bo'ldi.", 'Отлично! Заголовок высотой восемьдесят пикселей.', 'Great! The heading is eighty pixels tall.'),
    ask: L3("Sarlavha balandligini 80 piksel qiling", 'Сделай высоту заголовка 80 пикселей', 'Make the heading 80 pixels tall')
  },
  s10: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Mana bu to'rtburchaklarni men chizdim, lekin kodlarini aralashtirib yubordim. To'rtburchakka qarang-da, uni qaysi kod chizganini toping.", 'Теперь проверь себя. Я покажу прямоугольник, а ты выбери, какой код его нарисовал.', 'Now check yourself. I’ll show a rectangle, and you pick the code that drew it.'),
    ask: L3("Bu to'rtburchakni qaysi kod beradi?", 'Какой код даёт этот прямоугольник?', 'Which code makes this rectangle?'),
    hint1: L3("To'rtburchakka bir qarang-chi: u keng va pastmi yoki tor va balandmi?", 'Прямоугольник широкий и низкий или узкий и высокий?', 'Is the rectangle wide and short, or narrow and tall?'),
    hint2: L3("width to'rtburchakning yonga qancha cho'zilishini aytadi, height esa tepaga qancha o'sishini.", 'width — ширина, то есть насколько вбок; height — высота, то есть насколько вверх.', 'width is the width, meaning how far sideways; height is the height, meaning how far up.'),
    rounds: [
      { want: 'width: 160px; height: 40px;', opts: ['width: 40px; height: 160px;', 'width: 160px; height: 40px;', 'width: 160px; height: 160px;'],
        why: L3("Bu to'rtburchak keng va past: kengligi yuz oltmish, balandligi esa atigi qirq.", 'Прямоугольник широкий и низкий: ширина сто шестьдесят, высота сорок.', 'The rectangle is wide and short: width one hundred sixty, height forty.') },
      { want: 'width: 60px; height: 120px;', opts: ['width: 60px; height: 120px;', 'width: 120px; height: 60px;', 'width: 60px; height: 60px;'],
        why: L3("Bunisi tor va baland: kengligi oltmish, balandligi esa yuz yigirma.", 'Этот узкий и высокий: ширина шестьдесят, высота сто двадцать.', 'This one is narrow and tall: width sixty, height one hundred twenty.') },
      { want: 'width: 100px; height: 100px;', opts: ['width: 100px; height: 40px;', 'width: 40px; height: 100px;', 'width: 100px; height: 100px;'],
        why: L3("Kengligi ham, balandligi ham yuz, shuning uchun to'rtburchak kvadrat bo'lib chiqdi.", 'Ширина и высота равны, значит, это квадрат: сто и сто.', 'The width and height are equal, so it’s a square: a hundred by a hundred.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala to'rtburchakning ham sirini ochdingiz! Endi bilasiz: width yon tomonni o'lchaydi, height esa tepadan pastni.", 'Всё верно! Ты не путаешь ширину и высоту.', 'All correct! You don’t mix up width and height.')
  },
  s11: {
    eyebrow: L3("O'lcham buzilsa", 'Когда размер ломается', 'When a size breaks'),
    help: [
      L3("Kodda son yonidagi narsaga diqqat qiling-chi, keyin suratga qarang: u o'zgardimi yoki o'zgarmadimi?", 'Каждый раз смотри на код: что стоит рядом с числом? Потом на фото: изменилось оно или нет.', 'Each time, look at the code: what’s next to the number? Then look at the photo: did it change or not?'),
      L3("Nega shunday? Chunki brauzer faqat to'g'ri yozuvni tushunadi: son bilan birlik qo'shib yoziladi. Birlik bo'lmasa yoki o'rtada bo'sh joy qolsa, brauzer qoidani tushunmaydi va o'tkazib yuboradi.", 'Браузер понимает только верную запись: число и единица пишутся слитно. Нет единицы или есть пробел — правило выбрасывается.', 'The browser only understands the right spelling: the number and the unit go together. No unit or a space, and the rule is thrown away.'),
      L3("Do'stingizning telefon raqamini terayotib bitta raqamni tushirib qoldirsangiz, qo'ng'iroq o'tmaydi-ku. CSS kodida ham shunday: bitta belgi yetishmasa, qoida ishlamay qoladi.", 'Если при наборе номера телефона пропустить одну цифру, звонок не пройдёт. В CSS так же: не хватает одного знака — правило не работает.', 'If you miss one digit when dialing a phone number, the call won’t go through. In CSS too: miss one symbol and the rule doesn’t work.')
    ],
    say: L3("O'lcham yozayotganda men ham ko'p adashganman. Qani, tog' suratimni ataylab uch marta buzib ko'raylik-chi, nima bo'larkin?", 'В размерах тоже бывают ошибки. Давай посмотрим на три.', 'Sizes can have mistakes too. Let’s look at three.'),
    sayNoUnit: L3("Birinchi marta ikki yuz sonidan keyin px yozmadim. Ana, brauzer qoidani tushunmadi va o'tkazib yubordi, surat esa yana kattakon bo'lib qoldi.", 'Первая: после двухсот нет px. Браузер выбросил правило, фото снова большое.', 'The first: there’s no px after two hundred. The browser threw the rule away, and the photo is big again.'),
    saySpace: L3("Ikkinchi marta son bilan foiz belgisining o'rtasiga bo'sh joy qo'yib yubordim. Qarang, bu qoida ham ishlamadi.", 'Вторая: между числом и знаком процента пробел. Тоже не работает.', 'The second: a space between the number and the percent sign. That doesn’t work either.'),
    sayStretch: L3("Uchinchisi xato emas, lekin chiroyli ham emas. Suratga kengligini ham, balandligini ham ikki yuz qilib berdim. Voy, tog'larim cho'zilib, kvadratga aylanib qoldi!", 'Третья — не ошибка, но и не красиво: дали фото двести на двести, и оно растянулось в квадрат.', 'The third isn’t an error, but it isn’t pretty either: we gave the photo two hundred by two hundred, and it stretched into a square.'),
    done: L3("Xullas, son bilan birlik doim qo'shib yoziladi, suratga esa odatda faqat kenglikni beramiz.", 'Значит, число и единица пишутся без пробела, а фото обычно задают только ширину.', 'So the number and unit go together with no space, and a photo usually gets only a width.'),
    askNoUnit: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askSpace: L3("Qarang: bo'sh joy", 'Смотри: пробел', 'Watch: a space'),
    askStretch: L3("Qarang: surat cho'zildi", 'Смотри: фото растянулось', 'Watch: the photo stretched'),
    askDone: L3("Son va birlik birga, suratga — bitta o'lcham", 'Число и единица вместе, фото — один размер', 'Number and unit together, one size for a photo')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Suratimning kengligini yozdim-ku, lekin u ishlamayapti! Maydondagi qiymatga yaxshilab qarang-da, uni tuzatib bering.", 'Ой, я написал ширину фото, но она не работает! Посмотри на значение в поле и исправь его.', 'Oops, I wrote the photo’s width, but it doesn’t work! Look at the value in the field and fix it.'),
    msgs: {
      empty: L3("Maydon bo'shab qoldi. Bu yerga son va px yozing.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      space: L3("Son bilan px o'rtasida bo'sh joy hali ham turibdi. Uni olib tashlang.", 'Между числом и px всё ещё пробел. Убери его.', 'There’s still a space between the number and px. Remove it.'),
      bad: L3("Brauzer bu qiymatni tushunmadi. Hammasini o'chirib, 160px deb qo'shib yozing.", "Браузер не узнал это значение. Сотри всё и впиши 160px слитно.", "The browser didn’t recognize that value. Erase everything and type 160px together."),
      other: L3("Kenglik o'zgarib ketibdi-ku. U yuz oltmish piksel bo'lib qolsin, siz faqat bo'sh joyni olib tashlang.", 'Ширина поменялась. Пусть остаётся сто шестьдесят пикселей, просто убери пробел.', 'The width changed. Keep one hundred sixty pixels; just remove the space.'),
      noUnit: L3("px ham yo'qolib qolibdi-ku! 160px deb yozing.", "Пропал px. Впиши 160px.", "The px went missing. Type 160px.")
    },
    hints: [
      L3("Maydondagi qiymatni diqqat bilan o'qib chiqing-chi: unda nima ortiqcha?", 'Внимательно прочитай значение в поле: что лишнее?', 'Read the value in the field carefully: what’s extra?'),
      L3("Qarang: 160 bilan px bir-biridan ajralib turibdi. Brauzer bunday yozuvni tanimaydi.", 'Между числом и px пробел. Браузер такое не узнаёт.', 'There’s a space between the number and px. The browser doesn’t recognize that.'),
      L3("O'chirish tugmasi bilan maydondagi hamma narsani o'chiring-da, 160px deb bo'sh joysiz yozing. Namuna kodning tagida turibdi.", "Сотри всё в поле кнопкой со стрелкой и впиши 160px слитно, без пробела. Образец — под кодом.", "Erase everything in the field with the arrow button and type 160px together, with no space. The example is under the code.")
    ],
    ok: L3("Ura, ishladi! Tog' suratim endi yuz oltmish piksel.", 'Ура, заработало! Фото сто шестьдесят пикселей.', 'Yes, it works! The photo is one hundred sixty pixels.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Sahifamda yana nimadir joyida emas. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Inspektorga qarang-da, o'sha buzilgan qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на Инспектор и нажми сломанное правило.', 'Now check yourself. There are three rules, but one doesn’t work. Look at the Inspector and tap the broken rule.'),
    say2: L3("Voy, buzilgani bitta emas ekan! Inspektor yana bir elementda boshqacha o'lcham ko'rsatyapti. Uni qaysi qoida buzganini toping.", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlab turibdi: Inspektor aynan shu o'lchamni ko'rsatyapti. Qaysi element o'zgarmay qoldi ekan?", 'Это правило работает: Инспектор показывает этот размер. Какой элемент не изменился?', 'This rule works: the Inspector shows that size. Which element didn’t change?'),
    found: {
      unit: L3("Topildi! Yuz ellik sonidan keyin px tushib qolgan ekan, shuning uchun sarlavha butun qatorga cho'zilib turibdi.", 'Нашёл! После ста пятидесяти не было px.', 'Found it! There was no px after one hundred fifty.'),
      space: L3("Ana u! Qirq bilan foiz belgisining o'rtasida bo'sh joy qolgan ekan, shuning uchun surat kichraymagan edi.", 'Нашёл! Между сорока и знаком процента был пробел.', 'Found it! There was a space between forty and the percent sign.')
    },
    hint1: L3("Inspektorga qarang-chi: qaysi element kodda yozilgandek emas?", 'Посмотри на Инспектор: какой элемент не такой, как в коде?', 'Look at the Inspector: which element doesn’t match the code?'),
    hint2: {
      unit: L3("Sarlavha hali ham butun qatorni egallab turibdi. Uning kengligida birlik bormi?", 'Заголовок занимает всю строку. Есть ли единица у его ширины?', 'The heading takes the whole line. Does its width have a unit?'),
      space: L3("Surat kichraymabdi. Uning kengligi qanday yozilganiga qarang.", 'Фото не уменьшилось. Как записана его ширина?', 'The photo didn’t get smaller. How is its width written?')
    },
    hint3: {
      unit: L3("Buzilgan qoida birinchi qatorda turibdi: unda px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      space: L3("Buzilgan qoida ikkinchi qatorda: unda ortiqcha bo'sh joy bor. O'sha qatorni bosing.", 'Ошибка во втором правиле: пробел. Нажми эту строку.', 'The bug is in the second rule: a space. Tap that line.')
    },
    ok: L3("Mana, sarlavha ham, surat ham endi kodda yozilgan o'lchamda turibdi! Dizaynerlar ham har bir o'lchamni Inspektorda xuddi shunday tekshiradi.", 'Супер! Обе найдены. Ты проверяешь размеры как настоящий дизайнер.', 'Super! Both are found. You check sizes like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi qoidaning hammasini o'zingiz yozasiz, men faqat kuzatib turaman. Tog' suratim oynaning butun kengligini egallasin: img selektoriga width xususiyatini foizda yozing.", 'Теперь напиши правило целиком сам. Пусть фото будет во всю ширину окна: напиши для img свойство width в процентах.', 'Now write the whole rule yourself. Let the photo fill the whole width of the window: write the width property for img in percent.'),
    msgs: {
      empty: L3("Qoida qanday yozilishini eslaysizmi? Oldin selektor, keyin jingalak qavslar ichida xususiyat bilan qiymat keladi.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaning jingalak qavslari yetishmayapti: biri ochadi, biri yopadi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymat o'rtasidagi ikki nuqta tushib qolibdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Suratni img selektori tanlaydi, qoidani o'shandan boshlang.", 'Для фото нужен селектор img.', 'The photo needs the img selector.'),
      prop: L3("Kenglikni beradigan xususiyat width bo'ladi.", 'Ширину задаёт свойство width.', 'The width property sets the width.'),
      bad: L3("Bu qiymat brauzerga notanish. Son bilan foiz belgisini bo'sh joysiz yozing.", 'Браузер не узнал это значение. Напиши число и знак процента без пробела.', 'The browser didn’t recognize that value. Write the number and the percent sign with no space.'),
      other: L3("Surat hali butun oynani egallamadi. Butun oyna esa yuz foiz bo'ladi.", 'Фото не заняло всё окно. Всё окно — это сто процентов.', 'The photo didn’t fill the whole window. The whole window is a hundred percent.')
    },
    hints: [
      L3("Suratni qaysi selektor tanlaydi-yu, butun oyna necha foiz bo'ladi?", 'Каким селектором выбирают фото? Сколько процентов всё окно?', 'Which selector picks the photo? How many percent is the whole window?'),
      L3("Selektor img, xususiyat width, qiymati esa yuz foiz bo'ladi.", 'Селектор img, свойство width, значение сто процентов.', 'The selector is img, the property width, the value a hundred percent.'),
      L3("Kodning tagida namuna paydo bo'ldi. Uni maydonga harfma-harf ko'chirib yozing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Tog' suratim oynaning butun kengligiga yoyildi, qoidani esa o'zingiz yozdingiz.", 'Отлично! Фото во всю ширину окна. Ты сам написал правило.', 'Great! The photo fills the window width. You wrote the rule yourself.'),
    ask: L3("Suratni butun oyna kengligida qiladigan qoidani yozing", 'Напиши правило, которое растянет фото на всю ширину окна', 'Write a rule that makes the photo fill the window width')
  },
  s14: {
    eyebrow: L3("O'z tabriknomangiz", 'Своя открытка', 'Your own postcard'),
    say: L3("Sayohatdan qaytgach, do'stlarga surati bor tabriknoma yuborsa bo'ladi. Qani, tog' suratimdan o'zingizning tabriknomangizni yasang: surat uchun ham, abzas uchun ham xohlagan kengligingizni yozing. Piksel yozasizmi yoki foiz, o'zingiz tanlaysiz. Keyin «Tayyor»ni bosing.", 'Теперь сделай свою открытку. Впиши любую ширину для фото и для абзаца. Пиксели или проценты — выбирай сам. Потом нажми «Готово».', 'Now make your own postcard. Type any width for the photo and for the paragraph. Pixels or percent, you choose. Then tap “Done”.'),
    msgs: {
      bad: L3("Brauzer buni o'lcham deb tushunmadi: \u2063{w}\u2064. Son yozing-da, yoniga px yoki foiz belgisini bo'sh joysiz qo'shing.", 'Браузер не узнал такой размер: \u2063{w}\u2064. Напиши число и px или знак процента без пробела.', 'The browser didn’t recognize this as a size: \u2063{w}\u2064. Write a number with px or the percent sign, with no space.')
    },
    hints: [
      L3("Suratingiz qanchalik keng bo'lsin? Abzasingiz-chi?", 'Насколько большим будет фото? А абзац?', 'How big should the photo be? And the paragraph?'),
      L3("Kenglikni ikki xil yozish mumkin: son va px, yoki son va foiz belgisi.", 'Ширина — число и px или число и знак процента.', 'A width is a number with px, or a number with the percent sign.'),
      L3("Masalan, suratga yuz oltmish piksel, abzasga esa yetmish foiz yozib ko'ring. Keyin «Tayyor»ni bosing.", 'Например, впиши сто шестьдесят пикселей для фото и семьдесят процентов для абзаца. Потом нажми «Готово».', 'For example, type one hundred sixty pixels for the photo and seventy percent for the paragraph. Then tap “Done”.')
    ],
    ok: L3("Qanday chiroyli tabriknoma bo'ldi-ya! Buni o'zingiz yasadingiz.", 'Ого, как красиво! Это твоя открытка.', 'Wow, how pretty! That’s your postcard.'),
    ask: L3('Ikkita kenglikni yozing, «Tayyor»ni bosing', 'Впиши две ширины, нажми «Готово»', 'Type two widths, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Sahifamni yasayotib, o'lchamlar haqida to'rtta fikr yozib qo'ygandim. Ba'zilari rost, ba'zilari esa yo'q. Qani, har birini tekshirib, «To'g'ri» yoki «Noto'g'ri»ni bosing.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    hint1: L3("Bu fikr qaysi birlik haqida: px yoki foiz?", 'О какой единице фраза: px или процент?', 'Which unit is the sentence about: px or percent?'),
    hint2: L3("Esingizdami: px o'zgarmaydi, foiz esa oyna bilan o'zgaradi. Son bilan birlik qo'shib yoziladi, suratga bitta o'lcham bersak, ikkinchisi o'zi moslashadi.", 'Вспомни урок: px не меняется, процент меняется с окном, число и единица пишутся вместе, если у фото один размер — второй подстраивается.', 'Remember the lesson: px stays the same, percent changes with the window, the number and unit go together, and if a photo has one size, the other adjusts.'),
    items: [
      { t: L3("Kengligi ellik foiz bo'lgan element oynaning yarmini egallaydi.", 'Ширина в пятьдесят процентов делает элемент на половину окна.', 'A width of fifty percent makes the element half the window.'), right: true, code: 'half',
        why: L3("Ellik foiz yuzning yarmi bo'ladi, element ham oynaning yarmini oladi.", 'Верно: пятьдесят процентов — половина.', 'Right: fifty percent means half.') },
      { t: L3("Oyna torayganda 200px kenglik ham torayadi.", 'Когда окно сужается, ширина 200px тоже сужается.', 'When the window narrows, a 200px width narrows too.'), right: false,
        why: L3("Aslida piksel o'zgarmaydi: ikki yuz piksel oyna qanday bo'lmasin, ikki yuzligicha qoladi.", 'На самом деле пиксели не меняются: двести — всегда двести.', 'Actually pixels don’t change: two hundred is always two hundred.') },
      { t: L3("Suratga faqat width bersak, balandligi o'zi moslashadi.", 'Если дать фото только width, высота подстроится сама.', 'If we give a photo only width, the height adjusts by itself.'), right: true, code: 'img',
        why: L3("Tog' suratimda buni ko'rgandik: faqat width yozilganda surat cho'zilmadi, balandligi o'zi moslashdi.", 'Так и есть: фото не растягивается, высота подстраивается сама.', 'That’s right: the photo doesn’t stretch, the height adjusts by itself.') },
      { t: L3("width: 200 ham ishlaydi, px shart emas.", 'width: 200 тоже работает, px не обязателен.', 'width: 200 works too; px isn’t needed.'), right: false, code: 'unit',
        why: L3("px bo'lmasa, brauzer qoidani o'tkazib yuboradi. Tog' suratim yana kattakon bo'lib qolgani esingizdami?", 'На самом деле px нужен. Без него браузер выбрасывает правило.', 'Actually px is needed. Without it the browser throws the rule away.') }
    ],
    ok: L3("To'rttala fikrni ham to'g'ri ajratdingiz! O'lchamlarni endi juda yaxshi tushunasiz.", 'Всё верно! Ты отлично разбираешься в размерах.', 'All correct! You know sizes really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Abzasim haqidagi savolim esingizdami? Men matn yashirinib qoladi, degan variantga ishongandim. Endi qarang: matn hech qayerga yashirinmadi, ramkadan chiqib, pastga osilib turibdi. Kim o'ylabdi deysiz! Brauzer matnni o'zi yashirmaydi. Ikkinchi variantga ovoz bergan bo'lsangiz, siz haq chiqdingiz!",
        'Вернёмся к загадке. Помнишь, я дал длинному абзацу height тридцать пикселей и думал, что лишний текст спрячется? Смотри, увы, я ошибся. Текст не спрятался, он вылез из рамки и свисает вниз. Браузер сам текст не прячет.',
        'Back to our riddle. Remember, I gave a long paragraph height thirty pixels and thought the extra text would hide? Look, sadly, I was wrong. The text didn’t hide; it came out of the frame and hangs down below. The browser doesn’t hide text by itself.'), k: 'riddle' },
      { text: L3("Bu esa sizning tabriknomangiz. Surat bilan abzasning kengligini o'zingiz tanladingiz!", 'Смотри, это твоя открытка с размерами, которые ты выбрал сам!', 'Look, this is your postcard with the sizes you picked yourself!'), k: null },
      { text: L3("Kenglikni width beradi, balandlikni esa height.", 'width задаёт ширину, а height — высоту.', 'width sets the width, and height sets the height.'), k: 'wh' },
      { text: L3("px o'zgarmay turadi, foiz esa oyna bilan birga o'zgaradi.", 'px не меняется, а проценты меняются вместе с окном.', 'px stays the same, and percent changes with the window.'), k: 'unit' },
      { text: L3("Suratga odatda faqat width beramiz, shunda u cho'zilib ketmaydi.", 'Фото обычно задают только width, тогда оно не растягивается.', 'A photo usually gets only width, so it doesn’t stretch.'), k: 'img' },
      { text: L3("Tabriklayman! Endi elementlar siz xohlagan o'lchamda turadi. Keyingi darsda elementlar atrofidagi bo'shliqlar va chegaralar bilan tanishamiz. Ko'rishguncha!", 'Ура! Теперь элементы такого размера, как ты хочешь. На следующем уроке узнаем про отступы и рамки вокруг элементов. До встречи!', 'Hooray! Now elements are the size you want. Next time we’ll learn about the spacing and borders around elements. See you!'), k: null }
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
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayH1: 1, sayImg: 1, sayHalf: 1, sayFix: 1, sayNarrow: 1,
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
