// =============================================================================
// КУРС «CSS» · Урок 3 — «Цвета»
// (облик «Редактор», как уроки курса HTML; 05.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css3/build.mjs → lessons/css/03-cveta.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Цвета» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (05.11.2026). Уроки 1–2: правило, style в head, селекторы тег / .class / #id, цвет по имени. Коди
// хочет заголовок ровно цвета своего логотипа, но среди имён цветов такого нет: orange, tomato, orangered —
// всё не то. Ученик узнаёт три способа задать любой цвет: hex («#» и шесть знаков — красный, зелёный, синий),
// rgb (сколько красного, зелёного и синего света, 0–255) и hsl (место на круге цветов, насыщенность, светлота).
// Загадка (без имён): Коди написал цвет логотипа как FA4F28 без «#» и уверен, что сработает; в выводе признаёт.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (имена цветов не попадают в цвет логотипа → hex попадает; загадка)
//   hex:   s2 показ (# и три пары: красный, зелёный, синий) · s3 вписать синий hex (Fill) · s4 hex ↔ цвет (Matching)
//   rgb:   s5 показ (три числа света; красный + зелёный = жёлтый; 0 — чёрный, 255 — белый) · s6 три числа для жёлтого (Fill) · s7 какой rgb у цвета (выбор)
//   hsl:   s8 показ (круг цветов, светлота) · s9 вписать место на круге для зелёного (Fill) · s10 светлый или тёмный (Sort)
//   поломки: s11 показ (нет «#», пять знаков, hsl без «%») · s12 поставить «#» (Debug & Fix) · s13 найти сломанное правило (Error Detective)
//   w1 правило целиком с hex для фона (перенос) · s14 свои цвета в любом формате (Live, «Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: принимает ли браузер цвет — решает сам Chrome (CSS.supports); проверено 05.11.2026:
//     FA4F28 без «#», #FA4F2, #GG0000, hsl(120, 100, 40) — не принимаются; #F00, rgb(255, 0, 0), hsl(…%) — да.
//   · Узбекский — по /uzbekcha; в речи нет символов и кодов знаками: «panjara belgisi», «foiz».
//
// СИСТЕМА СЛОВ: hex kod — шестнадцатеричный код (draft); rang doirasi — круг цветов (draft); to'yinganlik —
// насыщенность (draft); yorug'lik — светлота (draft); nur — свет. В речи hex, rgb, hsl — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-03-cveta',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '3-dars. Ranglar',
    ru: 'Урок 3. Цвета',
    en: 'Lesson 3. Colors'
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
  next: L3('Fon', 'Фон', 'Background'),
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
  // Страница Коди (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    hello: L3('Salom! Bu mening saytim.', 'Привет! Это мой сайт.', 'Hi! This is my site.'),
    hobby: L3("Men futbol va shaxmatni yaxshi ko'raman.", 'Я люблю футбол и шахматы.', 'I love football and chess.'),
    logo: L3('Logotip rangi', 'Цвет логотипа', 'Logo color'),
    heading: L3('Sarlavha rangi', 'Цвет заголовка', 'Heading color'),
    match: L3('Bir xil!', 'Совпадает!', 'A match!'),
    noMatch: L3('Boshqacha', 'Не тот', 'Different'),
    light: L3('Och', 'Светлый', 'Light'),
    dark: L3("To'q", 'Тёмный', 'Dark'),
    red: L3('qizil', 'красный', 'red'),
    green: L3('yashil', 'зелёный', 'green'),
    blue: L3("ko'k", 'синий', 'blue'),
    names: L3({ red: 'qizil', green: 'yashil', blue: "ko'k", black: 'qora', white: 'oq', yellow: 'sariq', purple: 'binafsha', orange: "to'q sariq" },
      { red: 'красный', green: 'зелёный', blue: 'синий', black: 'чёрный', white: 'белый', yellow: 'жёлтый', purple: 'фиолетовый', orange: 'оранжевый' },
      { red: 'red', green: 'green', blue: 'blue', black: 'black', white: 'white', yellow: 'yellow', purple: 'purple', orange: 'orange' })
  },
  s1: {
    eyebrow: L3('Aynan shu rang', 'Именно этот цвет', 'Exactly this color'),
    say: L3("Salom! Mening logotipim bor, uning rangi juda chiroyli. Saytdagi sarlavha ham xuddi shu rangda bo'lishini xohlayman. Ranglarning nomlari bilan urinib ko'rdim: orange, tomato, orangered. Lekin qarang, hech biri aynan o'sha emas. «Aylantirish» tugmasini bosing.",
      'Привет! У меня есть логотип, и цвет у него очень красивый. Хочу, чтобы заголовок на сайте был точно такого же цвета. Я попробовал имена цветов: orange, tomato, orangered. Но смотри, ни один не тот самый. Нажми «Превратить».',
      'Hi! I have a logo, and its color is really nice. I want the heading on my site to be exactly the same color. I tried color names: orange, tomato, orangered. But look, none of them is exactly it. Tap “Transform”.'),
    magic: L3("Mana! Endi sarlavha logotip bilan aynan bir xil rangda.", 'Вот! Теперь заголовок точно такого же цвета, как логотип.', 'There! Now the heading is exactly the logo’s color.'),
    magicP: L3("Rang nomi o'rniga men maxsus kod yozdim. U bilan dunyodagi istalgan rangni aniq berish mumkin.", 'Вместо имени цвета я написал особый код. С ним можно точно задать любой цвет на свете.', 'Instead of a color name I wrote a special code. With it you can give any color in the world exactly.'),
    done: L3("Bugun istalgan rangni aniq yozishni o'rganasiz: hex, rgb va hsl bilan. Lekin oldin kichik topishmoq. Men logotip rangini yozganda kodni FA4F28 deb yozdim, oldiga hech narsa qo'ymadim. Menimcha, bu ham ishlaydi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься точно записывать любой цвет: через hex, rgb и hsl. Но сначала маленькая загадка. Когда я записывал цвет логотипа, я написал код FA4F28 и ничего перед ним не поставил. По-моему, это тоже сработает. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to write any color exactly: with hex, rgb and hsl. But first, a little riddle. When I wrote the logo color, I wrote the code FA4F28 and put nothing in front of it. I think that works too. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("Kod bilan rang aynan tushdi", 'Кодом цвет попал точно', 'The code hit the color exactly')
  },
  s2: {
    eyebrow: L3('hex kod', 'hex-код', 'The hex code'),
    say: L3("Keling, kodni bo'laklarga ajratamiz. Har bir rang uch xil nurdan yig'iladi: qizil, yashil va ko'k. hex kod shu uchta nurni yozadi.", 'Давай разберём код по частям. Каждый цвет собирается из трёх лучей света: красного, зелёного и синего. Hex-код записывает эти три луча.', 'Let’s take the code apart. Every color is made of three kinds of light: red, green and blue. A hex code writes those three.'),
    sayParts: L3("Boshida panjara belgisi turadi, keyin oltita belgi: ikkitasi qizil uchun, ikkitasi yashil uchun, ikkitasi ko'k uchun. Nol nol degani nur umuman yo'q, FF esa to'liq. Bu yerda qizil to'liq, qolganlari yo'q, shuning uchun sarlavha qizil.",
      'В начале стоит решётка, потом шесть знаков: два для красного, два для зелёного, два для синего. Ноль-ноль значит света нет совсем, а FF — на полную. Здесь красный на полную, остальных нет, поэтому заголовок красный.',
      'First comes the hash sign, then six symbols: two for red, two for green, two for blue. Zero zero means no light at all, and FF means full. Here red is full and the others are off, so the heading is red.'),
    sayGreen: L3("Endi FF ni o'rtadagi juftga ko'chiramiz. Yashil to'liq, sarlavha yashil bo'ldi.", 'Теперь переносим FF в среднюю пару. Зелёный на полную — заголовок зелёный.', 'Now we move FF to the middle pair. Green is full, so the heading is green.'),
    sayBlue: L3("Oxirgi juftda FF bo'lsa, ko'k to'liq bo'ladi.", 'FF в последней паре — синий на полную.', 'FF in the last pair makes blue full.'),
    done: L3("Demak, hex kod panjara belgisi va oltita belgi: qizil, yashil va ko'k uchun ikkitadan. Belgilar 0 dan 9 gacha raqamlar va A dan F gacha harflar bo'ladi.", 'Значит, hex-код — это решётка и шесть знаков: по два на красный, зелёный и синий. Знаки — цифры от 0 до 9 и буквы от A до F.', 'So a hex code is a hash sign and six symbols: two each for red, green and blue. The symbols are digits 0 to 9 and letters A to F.'),
    askStart: L3("Qarang: rang uch nurdan", 'Смотри: цвет из трёх лучей', 'Watch: a color from three lights'),
    askParts: L3("Qarang: qizil, yashil, ko'k juftlari", 'Смотри: пары красного, зелёного, синего', 'Watch: the red, green and blue pairs'),
    askDone: L3("hex: panjara va oltita belgi", 'hex: решётка и шесть знаков', 'hex: a hash sign and six symbols')
  },
  s3: {
    eyebrow: L3('hex kodni yozing', 'Впиши hex-код', 'Type the hex code'),
    say: L3("Endi navbat sizga. Sarlavhani ko'k qiling. Panjara belgisi tayyor, uning yoniga oltita belgini yozing: qizil yo'q, yashil yo'q, ko'k to'liq.", 'Теперь твоя очередь. Сделай заголовок синим. Решётка уже стоит, впиши рядом шесть знаков: красного нет, зелёного нет, синий на полную.', 'Now it’s your turn. Make the heading blue. The hash sign is ready; type six symbols next to it: no red, no green, full blue.'),
    msgs: {
      empty: L3("Panjara belgisidan keyin oltita belgi yozing.", 'Впиши после решётки шесть знаков.', 'Type six symbols after the hash sign.'),
      hash: L3("Panjara belgisi allaqachon turibdi, uni yana yozish kerak emas.", 'Решётка уже стоит, второй раз её писать не нужно.', 'The hash sign is already there; you don’t need it again.'),
      len: L3("hex kodda oltita belgi bo'ladi: har bir rang uchun ikkitadan.", 'В hex-коде шесть знаков: по два на каждый цвет.', 'A hex code has six symbols: two for each color.'),
      chars: L3("hex kodda faqat 0 dan 9 gacha raqamlar va A dan F gacha harflar bo'ladi.", 'В hex-коде только цифры от 0 до 9 и буквы от A до F.', 'A hex code has only digits 0 to 9 and letters A to F.'),
      other: L3("Bu boshqa rang chiqdi. Ko'k uchun oxirgi juft FF, qolgan ikki juft nol nol bo'ladi.", 'Получился другой цвет. Для синего последняя пара FF, а две другие — ноль-ноль.', 'That’s a different color. For blue the last pair is FF and the other two are zero zero.')
    },
    hints: [
      L3("Qaysi juft ko'k uchun edi: birinchimi, o'rtadagimi yoki oxirgisi?", 'Какая пара отвечает за синий: первая, средняя или последняя?', 'Which pair is for blue: the first, the middle or the last?'),
      L3("Qizil va yashil kerak emas, ularning jufti nol nol. Ko'k to'liq, uning jufti FF.", 'Красный и зелёный не нужны — их пары ноль-ноль. Синий на полную — его пара FF.', 'No red or green, so their pairs are zero zero. Blue is full, so its pair is FF.'),
      L3("To'rtta nol yozing, keyin FF.", 'Напиши четыре нуля, потом FF.', 'Type four zeros, then FF.')
    ],
    ok: L3("Zo'r! Sarlavha ko'k bo'ldi. Siz birinchi hex kodingizni yozdingiz.", 'Огонь! Заголовок синий. Ты написал свой первый hex-код.', 'Awesome! The heading is blue. You wrote your first hex code.'),
    ask: L3("Panjara belgisidan keyin ko'k rangning kodini yozing", 'Впиши после решётки код синего цвета', 'Type the code for blue after the hash sign')
  },
  s4: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Endi kodlarni ranglari bilan juftlang. Chapdan kodni, o'ngdan uning rangini bosing.", 'Теперь соедини коды с их цветами. Нажми код слева, потом его цвет справа.', 'Now match the codes with their colors. Tap a code on the left, then its color on the right.'),
    why: {
      red: L3("Bu kodda birinchi juft FF, qolganlari nol. Demak, faqat qizil nur bor.", 'В этом коде первая пара FF, остальные нули. Значит, есть только красный свет.', 'This code has FF in the first pair and zeros elsewhere. So there’s only red light.'),
      green: L3("Bu kodda o'rtadagi juft FF. Demak, faqat yashil nur bor.", 'В этом коде средняя пара FF. Значит, есть только зелёный свет.', 'This code has FF in the middle pair. So there’s only green light.'),
      black: L3("Bu kodda hamma juftlar nol. Nur umuman yo'q, demak qora.", 'В этом коде все пары — нули. Света нет совсем, значит, чёрный.', 'All the pairs are zeros. No light at all, so it’s black.')
    },
    pairOk: {
      red: L3("To'g'ri, bu qizil.", 'Верно, это красный.', 'Right, that’s red.'),
      green: L3("To'g'ri, bu yashil.", 'Верно, это зелёный.', 'Right, that’s green.'),
      black: L3("To'g'ri, nur yo'q, demak qora.", 'Верно, света нет — значит, чёрный.', 'Right, no light means black.')
    },
    pickFirst: L3("Oldin chapdan kodni tanlang.", 'Сначала выбери код слева.', 'First pick a code on the left.'),
    hints: [
      L3("Har bir kodda FF qaysi juftda turibdi?", 'В какой паре стоит FF в каждом коде?', 'In which pair is FF in each code?'),
      L3("Birinchi juft qizil, o'rtadagisi yashil, oxirgisi ko'k. Hammasi nol bo'lsa, qora.", 'Первая пара — красный, средняя — зелёный, последняя — синий. Все нули — чёрный.', 'The first pair is red, the middle is green, the last is blue. All zeros is black.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Endi hex kodni ko'rib, rangini topa olasiz.", 'Отлично! Теперь по hex-коду ты угадываешь цвет.', 'Great! Now you can tell a color from its hex code.'),
    ask: L3("Kodni, keyin uning rangini bosing", 'Нажми код, потом его цвет', 'Tap a code, then its color'),
    askPlace: L3("Endi uning rangini bosing", 'Теперь нажми его цвет', 'Now tap its color')
  },
  s5: {
    eyebrow: L3('rgb', 'rgb', 'rgb'),
    say: L3("Rangni yozishning yana bir yo'li bor: rgb. Bu yerda ham uchta nur bor, lekin ular oddiy sonlar bilan yoziladi: noldan ikki yuz ellik beshgacha.", 'Есть ещё один способ записать цвет: rgb. Здесь тоже три луча, но их пишут обычными числами: от нуля до двухсот пятидесяти пяти.', 'There’s another way to write a color: rgb. It also has three lights, but they’re written as ordinary numbers: from zero to two hundred fifty-five.'),
    sayParts: L3("Birinchi son qizil, ikkinchisi yashil, uchinchisi ko'k. Ikki yuz ellik besh degani to'liq. Bu yerda qizil to'liq, sarlavha qizil.", 'Первое число — красный, второе — зелёный, третье — синий. Двести пятьдесят пять значит на полную. Здесь красный на полную, заголовок красный.', 'The first number is red, the second green, the third blue. Two hundred fifty-five means full. Here red is full, so the heading is red.'),
    sayMix: L3("Endi qiziq narsa: qizil va yashil nurni birga to'liq qilamiz. Qarang, sariq rang chiqdi! Nurlar qo'shilib, yangi rang beradi.", 'А теперь интересное: включим на полную и красный, и зелёный. Смотри, получился жёлтый! Лучи складываются и дают новый цвет.', 'Now something cool: we turn red and green both to full. Look, it’s yellow! The lights add up into a new color.'),
    sayBlack: L3("Hamma son nol bo'lsa, nur yo'q va rang qora. Hammasi ikki yuz ellik besh bo'lsa, oq bo'ladi.", 'Все числа ноль — света нет, цвет чёрный. Все двести пятьдесят пять — белый.', 'All zeros means no light, so black. All two hundred fifty-five makes white.'),
    done: L3("Demak, rgb uchta son: qizil, yashil va ko'k, har biri noldan ikki yuz ellik beshgacha.", 'Значит, rgb — это три числа: красный, зелёный и синий, каждое от нуля до двухсот пятидесяти пяти.', 'So rgb is three numbers: red, green and blue, each from zero to two hundred fifty-five.'),
    askStart: L3('Qarang: rgb — uchta son', 'Смотри: rgb — три числа', 'Watch: rgb is three numbers'),
    askParts: L3("Qarang: qizil, yashil, ko'k", 'Смотри: красный, зелёный, синий', 'Watch: red, green, blue'),
    askMix: L3("Qarang: qizil va yashil — sariq", 'Смотри: красный и зелёный — жёлтый', 'Watch: red plus green is yellow'),
    askBlack: L3("Qarang: nol — qora, to'liq — oq", 'Смотри: ноль — чёрный, полный — белый', 'Watch: zero is black, full is white'),
    askDone: L3("rgb: uchta son, 0 dan 255 gacha", 'rgb: три числа от 0 до 255', 'rgb: three numbers from 0 to 255')
  },
  s6: {
    eyebrow: L3("Sariq rang yasang", 'Собери жёлтый', 'Make yellow'),
    say: L3("Endi o'zingiz rang yasang. Fonni sariq qiling. Esingizdami, sariq rang qizil va yashil nurdan chiqadi, ko'k esa kerak emas. Uchta sonni yozing.", 'Теперь собери цвет сам. Сделай фон жёлтым. Помнишь, жёлтый получается из красного и зелёного, а синий не нужен. Впиши три числа.', 'Now make a color yourself. Make the background yellow. Remember, yellow comes from red and green light, and blue isn’t needed. Type three numbers.'),
    msgs: {
      empty: L3("Uchala songa ham qiymat yozing.", 'Впиши все три числа.', 'Type all three numbers.'),
      range: L3("Har bir son noldan ikki yuz ellik beshgacha bo'ladi.", 'Каждое число — от нуля до двухсот пятидесяти пяти.', 'Each number is from zero to two hundred fifty-five.'),
      red: L3("Qizil nur yetarli emas. Uni to'liq qiling: ikki yuz ellik besh.", 'Красного не хватает. Сделай его на полную: двести пятьдесят пять.', 'Not enough red. Make it full: two hundred fifty-five.'),
      green: L3("Yashil nur yetarli emas. Uni ham to'liq qiling.", 'Зелёного не хватает. Его тоже на полную.', 'Not enough green. Make it full too.'),
      blue: L3("Ko'k nur bor. Sariq rangda ko'k bo'lmaydi, uni nol qiling.", 'Есть синий свет. В жёлтом синего нет, сделай его нулём.', 'There’s blue light. Yellow has no blue, so make it zero.')
    },
    hints: [
      L3("Sariq rang qaysi ikki nurdan chiqadi?", 'Из каких двух лучей получается жёлтый?', 'Which two lights make yellow?'),
      L3("Qizil va yashil to'liq, ko'k esa yo'q.", 'Красный и зелёный на полную, синего нет.', 'Red and green full, no blue.'),
      L3("Birinchi va ikkinchi songa ikki yuz ellik besh, uchinchisiga nol yozing.", 'В первое и второе число впиши двести пятьдесят пять, в третье — ноль.', 'Type two hundred fifty-five in the first and second number, and zero in the third.')
    ],
    ok: L3("Zo'r! Fon sariq bo'ldi. Siz nurlardan rang yasadingiz!", 'Огонь! Фон стал жёлтым. Ты собрал цвет из лучей!', 'Awesome! The background is yellow. You made a color out of light!'),
    ask: L3("Sariq fon uchun uchta sonni yozing", 'Впиши три числа для жёлтого фона', 'Type three numbers for a yellow background')
  },
  s7: {
    eyebrow: L3('Qaysi kod?', 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men rangni ko'rsataman, siz esa unga mos rgb kodni tanlang.", 'Теперь проверь себя. Я покажу цвет, а ты выбери для него подходящий rgb-код.', 'Now check yourself. I’ll show a color, and you pick the rgb code that makes it.'),
    ask: L3("Bu rangni qaysi kod beradi?", 'Какой код даёт этот цвет?', 'Which code makes this color?'),
    hint1: L3("Rangga qarang: unda qaysi nurlar bor?", 'Посмотри на цвет: какие в нём лучи?', 'Look at the color: which lights are in it?'),
    hint2: L3("Birinchi son qizil, ikkinchisi yashil, uchinchisi ko'k. Ikki yuz ellik besh to'liq, nol yo'q degani.", 'Первое число — красный, второе — зелёный, третье — синий. Двести пятьдесят пять — на полную, ноль — нет.', 'The first number is red, the second green, the third blue. Two hundred fifty-five is full, zero is none.'),
    rounds: [
      { want: 'rgb(255, 255, 0)', opts: ['rgb(0, 0, 255)', 'rgb(255, 255, 0)', 'rgb(255, 0, 0)'], name: 'yellow',
        why: L3("Sariqda qizil va yashil to'liq, ko'k yo'q.", 'В жёлтом красный и зелёный на полную, синего нет.', 'Yellow has full red and green, and no blue.') },
      { want: 'rgb(0, 0, 0)', opts: ['rgb(255, 255, 255)', 'rgb(128, 128, 128)', 'rgb(0, 0, 0)'], name: 'black',
        why: L3("Qora rangda nur umuman yo'q, hamma son nol.", 'В чёрном света нет совсем, все числа — ноль.', 'Black has no light at all; all the numbers are zero.') },
      { want: 'rgb(128, 0, 128)', opts: ['rgb(128, 0, 128)', 'rgb(0, 128, 0)', 'rgb(255, 255, 0)'], name: 'purple',
        why: L3("Binafsha rangda qizil va ko'k yarimta, yashil yo'q.", 'В фиолетовом красный и синий наполовину, зелёного нет.', 'Purple has half red and half blue, and no green.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Siz rgb kodni o'qiy olasiz.", 'Всё верно! Ты умеешь читать rgb-код.', 'All correct! You can read an rgb code.')
  },
  s8: {
    eyebrow: L3('hsl', 'hsl', 'hsl'),
    say: L3("Uchinchi usul hsl. U rangni boshqacha yozadi: rang doirasidagi joy, ya'ni qaysi rang degani, keyin uning kuchi va yorug'ligi.", 'Третий способ — hsl. Он записывает цвет по-другому: место на круге цветов, то есть какой это цвет, потом его насыщенность и светлота.', 'The third way is hsl. It writes a color differently: a spot on the color wheel, meaning which color it is, then its saturation and lightness.'),
    sayHue: L3("Birinchi son rang doirasidagi joy, noldan uch yuz oltmishgacha. Nol qizil, bir yuz yigirma yashil, ikki yuz qirq ko'k. Qarang, son o'zgarsa, rang doira bo'ylab yuradi.", 'Первое число — место на круге цветов, от нуля до трёхсот шестидесяти. Ноль — красный, сто двадцать — зелёный, двести сорок — синий. Смотри, число меняется — и цвет идёт по кругу.', 'The first number is the spot on the color wheel, from zero to three hundred sixty. Zero is red, one hundred twenty is green, two hundred forty is blue. Look, as the number changes, the color moves around the wheel.'),
    sayLight: L3("Oxirgi son yorug'lik, foizda. Uni katta qilsak, rang ochroq bo'ladi.", 'Последнее число — светлота в процентах. Сделаем его больше — цвет станет светлее.', 'The last number is lightness, in percent. Make it bigger and the color gets lighter.'),
    sayDark: L3("Kichik qilsak, rang to'qroq bo'ladi. O'rtadagi son esa rang kuchi: yuz foiz eng yorqin.", 'Сделаем меньше — цвет темнее. А среднее число — насыщенность: сто процентов — самый яркий.', 'Make it smaller and the color gets darker. The middle number is saturation: a hundred percent is the brightest.'),
    done: L3("Demak, hsl: rang doirasidagi joy, rang kuchi va yorug'lik. Ikkinchi va uchinchi son foiz bilan yoziladi.", 'Значит, hsl: место на круге, насыщенность и светлота. Второе и третье число пишут с процентами.', 'So hsl is the spot on the wheel, saturation and lightness. The second and third numbers are written with percent signs.'),
    askStart: L3("Qarang: hsl — rang doirasi", 'Смотри: hsl — круг цветов', 'Watch: hsl is the color wheel'),
    askHue: L3("Qarang: doiradagi joy", 'Смотри: место на круге', 'Watch: the spot on the wheel'),
    askLight: L3("Qarang: yorug'lik — ochroq", 'Смотри: светлота — светлее', 'Watch: lightness, lighter'),
    askDark: L3("Qarang: yorug'lik — to'qroq", 'Смотри: светлота — темнее', 'Watch: lightness, darker'),
    askDone: L3("hsl: joy, kuch, yorug'lik", 'hsl: место, насыщенность, светлота', 'hsl: spot, saturation, lightness')
  },
  s9: {
    eyebrow: L3('Doiradagi joy', 'Место на круге', 'The spot on the wheel'),
    say: L3("Sarlavhani yashil qiling. hsl kodda faqat birinchi son bo'sh, ya'ni rang doirasidagi joy degani. Yashil qaysi joyda edi?", 'Сделай заголовок зелёным. В hsl-коде пусто только первое число — место на круге цветов. Где был зелёный?', 'Make the heading green. In the hsl code only the first number is empty: the spot on the color wheel. Where was green?'),
    msgs: {
      empty: L3("Birinchi songa rang doirasidagi joyni yozing.", 'Впиши в первое число место на круге.', 'Type the spot on the wheel in the first number.'),
      num: L3("Bu yerda faqat son bo'ladi, foiz belgisi kerak emas.", 'Здесь только число, без знака процента.', 'Just a number here, no percent sign.'),
      other: L3("Bu boshqa rang chiqdi. Doirada yashil qizildan keyin, bir yuz yigirmada turadi.", 'Получился другой цвет. На круге зелёный стоит после красного, на ста двадцати.', 'That’s a different color. On the wheel green comes after red, at one hundred twenty.')
    },
    hints: [
      L3("Rang doirasiga qarang: yashil qayerda?", 'Посмотри на круг цветов: где зелёный?', 'Look at the color wheel: where is green?'),
      L3("Nol qizil, ikki yuz qirq ko'k. Yashil ularning o'rtasida.", 'Ноль — красный, двести сорок — синий. Зелёный между ними.', 'Zero is red, two hundred forty is blue. Green is in between.'),
      L3("Yashil bir yuz yigirmada. Birinchi songa 120 yozing.", 'Зелёный — на ста двадцати. Впиши в первое число 120.', 'Green is at one hundred twenty. Type 120 as the first number.')
    ],
    ok: L3("Zo'r! Sarlavha yashil bo'ldi.", 'Огонь! Заголовок стал зелёным.', 'Awesome! The heading turned green.'),
    ask: L3("Yashil uchun doiradagi joyni yozing", 'Впиши место на круге для зелёного', 'Type the wheel spot for green')
  },
  s10: {
    eyebrow: L3("Och yoki to'q?", 'Светлый или тёмный?', 'Light or dark?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men hsl kodni ko'rsataman, siz esa rang och chiqadimi yoki to'q, shuni tanlang.", 'Теперь проверь себя. Я покажу hsl-код, а ты выбери: цвет будет светлым или тёмным?', 'Now check yourself. I’ll show an hsl code, and you choose: will the color be light or dark?'),
    ask: L3("Rang och bo'ladimi yoki to'q?", 'Цвет будет светлым или тёмным?', 'Will the color be light or dark?'),
    card: L3('hsl kod', 'hsl-код', 'hsl code'),
    hint1: L3("Oxirgi songa qarang: u yorug'lik.", 'Посмотри на последнее число: это светлота.', 'Look at the last number: it’s the lightness.'),
    hint2: L3("Yorug'lik katta bo'lsa rang och, kichik bo'lsa to'q bo'ladi.", 'Большая светлота — цвет светлый, маленькая — тёмный.', 'High lightness makes a light color, low lightness a dark one.'),
    items: [
      { code: 'hsl(210, 100%, 85%)', right: 'light', why: L3("Yorug'lik sakson besh foiz, bu katta. Rang och.", 'Светлота восемьдесят пять процентов — это много. Цвет светлый.', 'Lightness is eighty-five percent, which is high. The color is light.') },
      { code: 'hsl(210, 100%, 25%)', right: 'dark', why: L3("Yorug'lik yigirma besh foiz, bu kam. Rang to'q.", 'Светлота двадцать пять процентов — это мало. Цвет тёмный.', 'Lightness is twenty-five percent, which is low. The color is dark.') },
      { code: 'hsl(0, 100%, 90%)', right: 'light', why: L3("To'qson foiz yorug'lik. Qizil juda och, pushti bo'lib qoldi.", 'Светлота девяносто процентов. Красный очень светлый, почти розовый.', 'Ninety percent lightness. The red is very light, almost pink.') },
      { code: 'hsl(120, 100%, 20%)', right: 'dark', why: L3("Yigirma foiz yorug'lik. Yashil juda to'q.", 'Двадцать процентов светлоты. Зелёный очень тёмный.', 'Twenty percent lightness. The green is very dark.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Yorug'lik sonini o'qiy olasiz.", 'Всё верно! Ты читаешь число светлоты.', 'All correct! You can read the lightness number.')
  },
  s11: {
    eyebrow: L3('Rang buzilsa', 'Когда цвет ломается', 'When a color breaks'),
    say: L3("Rang kodlari juda aniq bo'lishi kerak. Bitta belgi xato bo'lsa, brauzer rangni tashlab yuboradi. Keling, uchta xatoni ko'ramiz.", 'Коды цветов должны быть точными. Ошибся в одном знаке — и браузер выбрасывает цвет. Посмотрим на три ошибки.', 'Color codes must be exact. One wrong symbol and the browser throws the color away. Let’s look at three mistakes.'),
    sayNoHash: L3("Birinchisi: hex kod oldida panjara belgisi yo'q. Brauzer uni rang deb tanimadi, sarlavha qora qoldi.", 'Первая: перед hex-кодом нет решётки. Браузер не узнал в нём цвет, заголовок остался чёрным.', 'The first: there’s no hash sign before the hex code. The browser didn’t recognize it as a color, so the heading stayed black.'),
    sayFive: L3("Ikkinchisi: kodda bitta belgi yetishmayapti, beshta qolgan. Bu ham ishlamaydi.", 'Вторая: в коде не хватает одного знака, осталось пять. Тоже не работает.', 'The second: the code is missing a symbol; only five are left. That doesn’t work either.'),
    sayPct: L3("Uchinchisi: hsl kodda foiz belgilari unutilgan. Ikkinchi va uchinchi son foiz bilan bo'lishi kerak.", 'Третья: в hsl-коде забыли знаки процента. Второе и третье число должны быть с процентами.', 'The third: the percent signs were forgotten in the hsl code. The second and third numbers need them.'),
    done: L3("Demak, hex kodga panjara va oltita belgi, hsl ga esa foiz belgilari kerak.", 'Значит, hex-коду нужны решётка и шесть знаков, а hsl — знаки процента.', 'So a hex code needs a hash sign and six symbols, and hsl needs percent signs.'),
    askNoHash: L3("Qarang: panjara belgisi yo'q", 'Смотри: нет решётки', 'Watch: no hash sign'),
    askFive: L3("Qarang: beshta belgi", 'Смотри: пять знаков', 'Watch: five symbols'),
    askPct: L3("Qarang: foiz belgisi yo'q", 'Смотри: нет процентов', 'Watch: no percent signs'),
    askDone: L3("Panjara, oltita belgi, foiz", 'Решётка, шесть знаков, проценты', 'Hash sign, six symbols, percent')
  },
  s12: {
    eyebrow: L3("Belgini qo'ying", 'Поставь знак', 'Add the sign'),
    say: L3("Voy, men logotip rangini yana panjara belgisisiz yozibman! Sarlavha bo'yalmayapti. Kod oldidagi bo'sh joyga kerakli belgini yozing.", 'Ой, я опять написал цвет логотипа без решётки! Заголовок не красится. Впиши нужный знак в пустое место перед кодом.', 'Oops, I wrote the logo color without the hash sign again! The heading won’t color. Type the right sign in the empty spot before the code.'),
    msgs: {
      empty: L3("Kod oldiga bitta belgi yozing.", 'Впиши один знак перед кодом.', 'Type one sign before the code.'),
      dot: L3("Nuqta class uchun edi. hex kod oldida panjara belgisi turadi.", 'Точка была для класса. Перед hex-кодом стоит решётка.', 'The dot was for a class. A hex code starts with a hash sign.'),
      other: L3("Bu belgi to'g'ri emas. hex kod panjara belgisi bilan boshlanadi.", 'Этот знак не подходит. Hex-код начинается с решётки.', 'That sign doesn’t fit. A hex code starts with a hash sign.')
    },
    hints: [
      L3("hex kod qaysi belgi bilan boshlanardi?", 'С какого знака начинается hex-код?', 'Which sign does a hex code start with?'),
      L3("Bu belgi id selektorida ham ishlatiladi.", 'Этот знак есть и в селекторе id.', 'The same sign is used in an id selector.'),
      L3("Pastdagi panjara tugmasini bosing, keyin Tekshirishni bosing.", 'Нажми кнопку с решёткой внизу, потом «Проверить».', 'Tap the hash button below, then Check.')
    ],
    ok: L3("Ajoyib! Sarlavha logotip rangida.", 'Отлично! Заголовок цвета логотипа.', 'Great! The heading is the logo color.'),
    ask: L3("Kod oldiga kerakli belgini yozing", 'Впиши перед кодом нужный знак', 'Type the right sign before the code')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasining rangi ishlamayapti. Sahifaga qarang va xato qoidani bosing.", 'Теперь проверь себя. В коде три правила, но цвет одного не работает. Посмотри на страницу и нажми сломанное правило.', 'Now check yourself. There are three rules, but one color doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Zo'r, birinchi xato topildi! Endi boshqa rang buzildi. Qaysi biri?", 'Класс, первая ошибка найдена! Теперь сломался другой цвет. Какой?', 'Great, the first bug is found! Now another color broke. Which one?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: uning rangi sahifada ko'rinib turibdi. Qaysi narsa bo'yalmadi?", 'Это правило работает: его цвет виден на странице. Что не покрасилось?', 'This rule works: its color shows on the page. What didn’t get colored?'),
    found: {
      letter: L3("Topdingiz! hex kodda G harfi bor. hex da faqat A dan F gacha harflar bo'ladi.", 'Нашёл! В hex-коде буква G. В hex бывают только буквы от A до F.', 'Found it! There’s a G in the hex code. Hex only uses letters A to F.'),
      pct: L3("Topdingiz! hsl kodda foiz belgilari yo'q edi.", 'Нашёл! В hsl-коде не было знаков процента.', 'Found it! The hsl code had no percent signs.')
    },
    hint1: L3("Sahifaga qarang: nima bo'yalmay qoldi?", 'Посмотри на страницу: что осталось не покрашенным?', 'Look at the page: what stayed uncolored?'),
    hint2: {
      letter: L3("Sarlavha qora qoldi. Uning hex kodidagi harflarni tekshiring: hammasi A dan F gachami?", 'Заголовок остался чёрным. Проверь буквы в его hex-коде: все от A до F?', 'The heading stayed black. Check the letters in its hex code: are they all A to F?'),
      pct: L3("Fon oq qoldi. body qoidasidagi hsl kodda foiz belgilari bormi?", 'Фон остался белым. Есть ли проценты в hsl-коде правила body?', 'The background stayed white. Does the hsl code in the body rule have percent signs?')
    },
    hint3: {
      letter: L3("Xato h1 qoidasida: G harfi. O'sha qatorni bosing.", 'Ошибка в правиле h1: буква G. Нажми эту строку.', 'The bug is in the h1 rule: the letter G. Tap that line.'),
      pct: L3("Xato body qoidasida: foiz yo'q. O'sha qatorni bosing.", 'Ошибка в правиле body: нет процентов. Нажми эту строку.', 'The bug is in the body rule: no percent signs. Tap that line.')
    },
    ok: L3("Super! Ikkala xato ham topildi. Siz ranglarni haqiqiy dizayner kabi tekshiryapsiz.", 'Супер! Обе ошибки найдены. Ты проверяешь цвета как настоящий дизайнер.', 'Super! Both bugs are found. You check colors like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Sahifaning fonini och shaftoli rangga bo'yang, kodi FFE0B2. body uchun background-color xususiyatini yozing.", 'Теперь напиши правило целиком сам. Сделай фон страницы светло-персиковым, его код FFE0B2. Напиши для body свойство background-color.', 'Now write the whole rule yourself. Make the page background a light peach, code FFE0B2. Write the background-color property for body.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin jingalak qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Butun sahifaning foni uchun body selektori kerak.", 'Для фона всей страницы нужен селектор body.', 'The whole page’s background needs the body selector.'),
      prop: L3("Fon rangini background-color xususiyati beradi.", 'Цвет фона задаёт свойство background-color.', 'The background-color property sets the background color.'),
      noHash: L3("Kod oldida panjara belgisi yo'q. Usiz brauzer rangni tanimaydi.", 'Перед кодом нет решётки. Без неё браузер не узнаёт цвет.', 'No hash sign before the code. Without it the browser doesn’t recognize the color.'),
      notColor: L3("Brauzer bu kodni rang deb tanimadi. Panjara va oltita belgini tekshiring.", 'Браузер не узнал в этом коде цвет. Проверь решётку и шесть знаков.', 'The browser didn’t recognize this code as a color. Check the hash sign and the six symbols.'),
      other: L3("Bu boshqa rang. Kod FFE0B2 bo'lishi kerak.", 'Это другой цвет. Код должен быть FFE0B2.', 'That’s a different color. The code should be FFE0B2.')
    },
    hints: [
      L3("Butun sahifa qaysi selektor bilan tanlanardi? Fon uchun qaysi xususiyat kerak?", 'Каким селектором выбирают всю страницу? Какое свойство нужно для фона?', 'Which selector picks the whole page? Which property is for the background?'),
      L3("Selektor body, xususiyat background-color, qiymat esa panjara va FFE0B2.", 'Селектор body, свойство background-color, а значение — решётка и FFE0B2.', 'The selector is body, the property background-color, and the value a hash sign and FFE0B2.'),
      L3("Shunday yozing: body, jingalak qavs, background-color, ikki nuqta, panjara, FFE0B2, nuqtali vergul va yopuvchi qavs.", 'Напиши так: body, фигурная скобка, background-color, двоеточие, решётка, FFE0B2, точка с запятой и закрывающая скобка.', 'Write: body, a curly brace, background-color, a colon, a hash sign, FFE0B2, a semicolon and a closing brace.')
    ],
    ok: L3("Ajoyib! Sahifa iliq rangga kirdi. Qoidani o'zingiz yozdingiz.", 'Отлично! Страница стала тёплой. Ты сам написал правило.', 'Great! The page got a warm color. You wrote the rule yourself.'),
    ask: L3("Fonni FFE0B2 qiladigan qoidani yozing", 'Напиши правило, которое сделает фон FFE0B2', 'Write a rule that makes the background FFE0B2')
  },
  s14: {
    eyebrow: L3("O'z ranglaringiz", 'Свои цвета', 'Your own colors'),
    say: L3("Endi o'z sahifangizga ranglar tanlang. Istalgan usulda yozishingiz mumkin: nom, hex, rgb yoki hsl. Sarlavha uchun bitta rang, fon uchun boshqasini yozing. Keyin «Tayyor»ni bosing.", 'Теперь выбери цвета для своей страницы. Можно любым способом: имя, hex, rgb или hsl. Впиши один цвет для заголовка и другой для фона. Потом нажми «Готово».', 'Now pick colors for your own page. Any way works: a name, hex, rgb or hsl. Type one color for the heading and another for the background. Then tap “Done”.'),
    msgs: {
      notColor: L3("Brauzer {w} ni rang deb tanimadi. Kodni tekshiring: hex uchun panjara va oltita belgi, hsl uchun foiz.", 'Браузер не узнал цвет в {w}. Проверь код: для hex — решётка и шесть знаков, для hsl — проценты.', 'The browser didn’t recognize {w} as a color. Check the code: a hash sign and six symbols for hex, percent signs for hsl.'),
      same: L3("Sarlavha va fon bir xil rangda bo'lsa, sarlavha ko'rinmay qoladi. Boshqa-boshqa rang tanlang.", 'Если заголовок и фон одного цвета, заголовка не видно. Выбери разные цвета.', 'If the heading and the background are the same color, the heading disappears. Pick different colors.')
    },
    hints: [
      L3("Qaysi rang sizga yoqadi? Uni istalgan usulda yozing.", 'Какой цвет тебе нравится? Запиши его любым способом.', 'Which color do you like? Write it any way.'),
      L3("Masalan, hex uchun panjara va oltita belgi, rgb uchun qavsda uchta son.", 'Например, для hex — решётка и шесть знаков, для rgb — три числа в скобках.', 'For example, a hash sign and six symbols for hex, three numbers in brackets for rgb.'),
      L3("Masalan, sarlavhaga purple, fonga esa lavender yozing. Keyin «Tayyor»ni bosing.", 'Например, впиши purple для заголовка и lavender для фона. Потом нажми «Готово».', 'For example, type purple for the heading and lavender for the background. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning o'z ranglaringiz.", 'Ого, как красиво! Это твои собственные цвета.', 'Wow, how pretty! These are your very own colors.'),
    ask: L3('Ikkita rangni yozing va «Tayyor»ni bosing', 'Впиши два цвета и нажми «Готово»', 'Type two colors and tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Oxirgi sinov. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapni bo'laklab o'qing: u hex, rgb yoki hsl haqidami?", 'Прочитай фразу по частям: она про hex, rgb или hsl?', 'Read the sentence piece by piece: is it about hex, rgb or hsl?'),
    hint2: L3("Dars esingizdami: hex panjara va oltita belgi, rgb uchta son noldan ikki yuz ellik beshgacha, hsl da oxirgi son yorug'lik. Gap shunga mos keladimi?",
      'Вспомни урок: hex — решётка и шесть знаков, rgb — три числа от нуля до двухсот пятидесяти пяти, в hsl последнее число — светлота. Фраза с этим совпадает?',
      'Remember the lesson: hex is a hash sign and six symbols, rgb is three numbers from zero to two hundred fifty-five, and in hsl the last number is lightness. Does the sentence match that?'),
    items: [
      { t: L3("FF0000 kodi panjara belgisi bilan qizil rang beradi.", 'Код FF0000 с решёткой даёт красный.', 'The code FF0000 with a hash sign gives red.'), right: true, code: 'hex',
        why: L3("To'g'ri: birinchi juft FF, ya'ni qizil to'liq degani, qolganlari esa nol.", 'Верно: первая пара FF, то есть красный на полную, остальные нули.', 'Right: the first pair is FF, full red, and the rest are zeros.') },
      { t: L3("rgb dagi sonlar noldan yuzgacha bo'ladi.", 'Числа в rgb бывают от нуля до ста.', 'The numbers in rgb go from zero to a hundred.'), right: false,
        why: L3("Aslida rgb dagi sonlar noldan ikki yuz ellik beshgacha bo'ladi.", 'На самом деле числа в rgb — от нуля до двухсот пятидесяти пяти.', 'Actually the numbers in rgb go from zero to two hundred fifty-five.') },
      { t: L3("Qizil va yashil nur qo'shilsa, sariq rang chiqadi.", 'Красный и зелёный свет вместе дают жёлтый.', 'Red and green light together make yellow.'), right: true, code: 'rgb',
        why: L3("Shunday: rgb da qizil va yashil to'liq, ko'k nol bo'lsa, sariq chiqadi.", 'Так и есть: в rgb красный и зелёный на полную, синий ноль — получается жёлтый.', 'That’s right: full red and green with zero blue in rgb makes yellow.') },
      { t: L3("hsl da oxirgi son kattalashsa, rang to'qroq bo'ladi.", 'Если в hsl увеличить последнее число, цвет станет темнее.', 'If the last number in hsl gets bigger, the color gets darker.'), right: false, code: 'hsl',
        why: L3("Aslida oxirgi son yorug'lik: u kattalashsa, rang ochroq bo'ladi.", 'На самом деле последнее число — светлота: больше — значит светлее.', 'Actually the last number is lightness: bigger means lighter.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz ranglarni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в цветах.', 'All correct! You know colors really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men kodni FA4F28 deb, oldiga hech narsa qo'ymay yozgan edim? Afsuski, men adashibman. hex kod doim panjara belgisi bilan boshlanadi. Usiz brauzer bu oltita belgini rang deb tanimaydi.",
        'Вернёмся к загадке. Помнишь, я написал код FA4F28 и ничего перед ним не поставил? Увы, я ошибся. Hex-код всегда начинается с решётки. Без неё браузер не узнаёт в шести знаках цвет.',
        'Back to our riddle. Remember, I wrote the code FA4F28 with nothing in front of it? Sadly, I was wrong. A hex code always starts with a hash sign. Without it the browser doesn’t recognize the six symbols as a color.'), k: 'riddle' },
      { text: L3("Qarang, bu sizning sahifangiz, o'zingiz tanlagan ranglar bilan!", 'Смотри, это твоя страница в цветах, которые ты выбрал сам!', 'Look, this is your page in the colors you picked yourself!'), k: null },
      { text: L3("hex kod panjara belgisi va oltita belgidan iborat.", 'Hex-код — это решётка и шесть знаков.', 'A hex code is a hash sign and six symbols.'), k: 'hex' },
      { text: L3("rgb uchta son: qizil, yashil va ko'k nur.", 'rgb — три числа: красный, зелёный и синий свет.', 'rgb is three numbers: red, green and blue light.'), k: 'rgb' },
      { text: L3("hsl esa rang doirasidagi joy, rang kuchi va yorug'lik.", 'А hsl — место на круге цветов, насыщенность и светлота.', 'And hsl is the spot on the color wheel, saturation and lightness.'), k: 'hsl' },
      { text: L3("Tabriklayman! Endi siz istalgan rangni aniq yoza olasiz. Keyingi darsda fon bilan ishlaymiz. Ko'rishguncha!", 'Ура! Теперь ты можешь точно записать любой цвет. На следующем уроке поработаем с фоном. До встречи!', 'Hooray! Now you can write any color exactly. Next time we’ll work with backgrounds. See you!'), k: null }
    ],
    roles: {
      hex: L3('hex — # va 6 belgi', 'hex — # и 6 знаков', 'hex — # and 6 symbols'),
      rgb: L3('rgb — 3 ta son', 'rgb — 3 числа', 'rgb — 3 numbers'),
      hsl: L3("hsl — joy, kuch, yorug'lik", 'hsl — место, насыщенность, светлота', 'hsl — spot, saturation, lightness')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayParts: 1, sayGreen: 1, sayBlue: 1, sayMix: 1, sayBlack: 1,
  sayHue: 1, sayLight: 1, sayDark: 1, sayNoHash: 1, sayFive: 1, sayPct: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, pairOk: 1, rounds: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c3.css@*/
`;
