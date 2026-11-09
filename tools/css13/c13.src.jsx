// =============================================================================
// КУРС «CSS» · Урок 13 — «Hover и transform»
// (облик «Редактор», как уроки курса HTML; 07.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css13/build.mjs → lessons/css/13-hover-transform.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 13 · «Hover и transform» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (07.11.2026). Уроки 1–12: правило, селекторы, цвета, фон, текст, размеры, Box Model, карточки, display,
// Flexbox, позиционирование. В игре Коди кнопка «Играть» — как картинка: мышка над ней, а ничего не меняется. Ученик
// узнаёт :hover (правило работает, только пока мышка над элементом; на телефоне — при касании), transform: scale
// (во сколько раз, без единиц), rotate (deg), translate (x, y через запятую; соседи не сдвигаются) и cursor: pointer.
// Загадка (без имён): Коди пишет «.tugma :hover» с пробелом и думает, что пробел ничего не меняет. Разгадка: с пробелом
// браузер ищет элемент внутри кнопки — hover не срабатывает.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (кнопка-картинка → hover оранжевый, scale 1.1, cursor pointer; загадка про пробел)
//   :hover:    s2 показ (правило без мышки · мышка над кнопкой · ещё одно правило) · s3 вписать gold (Fill) · s4 всегда или под мышкой (Sort)
//   transform: s5 показ (scale 1.5 · rotate 15deg · translate 40px, 10px) · s6 scale(▢) → 2 (Fill) · s7 какой transform (выбор)
//   вместе:    s8 показ (hover + scale 1.2 · cursor pointer) · s9 вписать pointer (Fill) · s10 что нужно (Sort)
//   поломки:   s11 показ (scale(1.5px), rotate(15), translate без запятой, два transform) · s12 исправить «rotate(15)» · s13 найти правило
//   w1 правило целиком: .tugma:hover { transform: rotate(10deg); } · s14 своя кнопка («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: правила с :hover движок применяет к элементу, когда над ним мышка (или касание на телефоне);
//     на показах «мышка над кнопкой» включается сама — Инспектор помечает это меткой :hover. transform и cursor
//     ставит сам браузер. Верная ли запись — решает Chrome (CSS.supports).
//   · Не забегаем: transition (урок 14), :active, :focus, skew, несколько функций в одном transform — только упомянуты.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: ustida — hover («sichqoncha ustida»); o'zgartirish — transform; kattalashtirish — scale; burish — rotate;
// surish — translate; ko'rsatkich — cursor; gradus — deg. В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-13-hover-transform',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '13-dars. Hover va transform',
    ru: 'Урок 13. Hover и transform',
    en: 'Lesson 13. Hover and transform'
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
  next: L3("Silliq effektlar", 'Плавные эффекты', 'Smooth effects'),
  mainAx: L3("asosiy o'q", 'главная ось', 'main axis'),
  crossAx: L3("ko'ndalang o'q", 'поперечная ось', 'cross axis'),
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
  // Страница игры Коди (не звучит).
  site: {
    title: L3("Kodining o'yini", 'Игра Коди', 'Kodi’s game'),
    p1: L3("Tayyormisiz? Tugmani bosing!", 'Готов? Нажми кнопку!', 'Ready? Press the button!'),
    btn: L3("O'ynash", 'Играть', 'Play'),
    p2: L3("Rekord: 120 ochko.", 'Рекорд: 120 очков.', 'Record: 120 points.')
  },
  s1: {
    eyebrow: L3("O'ynash tugmasi", 'Кнопка «Играть»', 'The Play button'),
    say: L3("Salom! Men o'yinimga O'ynash tugmasini qo'ydim. Lekin u xuddi rasmdek: sichqonchani ustiga olib kelsangiz ham, hech narsa bo'lmaydi. Haqiqiy saytlarda tugma jonlanadi-ku! «Aylantirish» tugmasini bosing.",
      'Привет! Я поставил в игру кнопку «Играть». Но она как картинка: наведёшь мышку — ничего не происходит. А на настоящих сайтах кнопка оживает! Нажми «Превратить».',
      'Hi! I put a Play button in my game. But it’s like a picture: point the mouse at it and nothing happens. On real sites a button comes alive! Tap “Transform”.'),
    magic: L3("Mana! Sichqoncha tugma ustida bo'lsa, u to'q sariq rangga kiradi va biroz kattalashadi. Ko'rsatkich esa qo'lga aylanadi.", 'Вот! Когда мышка над кнопкой, она становится оранжевой и немного увеличивается. А указатель превращается в руку.', 'There! When the mouse is over the button, it turns orange and grows a little. And the pointer turns into a hand.'),
    magicP: L3("Buni uchta narsa qildi. hover, ya'ni sichqoncha ustida degani. transform, ya'ni o'zgartirish degani. Va cursor, ya'ni ko'rsatkich degani. Telefonda esa tugmaga bosilganda shunday bo'ladi.", 'Это сделали hover, то есть «мышка над элементом», transform, то есть преобразование, и cursor, то есть указатель. А на телефоне так бывает при касании кнопки.', 'hover did it, meaning the mouse is over the element, plus transform, meaning a change of shape, and cursor, meaning the pointer. On a phone it happens when you tap the button.'),
    done: L3("Bugun tugmalarni jonlantirishni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta tugma va hover o'rtasiga bo'sh joy qo'yib yozgan edim, chiroyliroq ko'rinsin deb. Menimcha, bo'sh joy hech narsani o'zgartirmaydi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься оживлять кнопки. Но сначала загадка. В первый раз я поставил пробел между кнопкой и hover, чтобы было красивее. По-моему, пробел ничего не меняет. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to bring buttons to life. But first, a riddle. The first time, I put a space between the button and hover to make it look nicer. I think a space changes nothing. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3(":hover · transform · cursor", ':hover · transform · cursor', ':hover · transform · cursor')
  },
  s2: {
    eyebrow: L3(":hover", ':hover', ':hover'),
    help: [
      L3("Tugmaga va Inspektordagi hover belgisiga qarang: sichqoncha tugma ustiga kelgandagina tugma o'zgaradi.", 'Посмотри на кнопку и на метку hover в Инспекторе: кнопка меняется только тогда, когда мышка над ней.', 'Look at the button and the hover tag in the Inspector: the button changes only when the mouse is over it.'),
      L3("Selektordan keyin hover yozilsa, qoida faqat sichqoncha element ustida bo'lganda ishlaydi. Telefonda esa tegilganda.", 'Если после селектора написать hover, правило работает только когда мышка над элементом. А на телефоне — при касании.', 'If you write hover after the selector, the rule works only while the mouse is over the element. On a phone, when you tap.'),
      L3("O'yinlarda sichqonchani tugmaga olib borsangiz, u yorishadi. Bu hover: tugma «meni bosing» deyayotgandek.", 'В играх кнопка подсвечивается, когда наводишь на неё мышку. Это и есть hover: кнопка будто говорит «нажми меня».', 'In games a button lights up when you point the mouse at it. That’s hover: the button seems to say “press me”.')
    ],
    say: L3("Selektordan keyin ikki nuqta va hover yozilsa, qoida faqat sichqoncha element ustida bo'lganda ishlaydi. Keling, ko'ramiz.",
      'Если после селектора написать двоеточие и hover, правило работает, только когда мышка над элементом. Давай посмотрим.',
      'If you write a colon and hover after the selector, the rule only works while the mouse is over the element. Let’s see.'),
    sayRule: L3("Qoida tayyor: hover bo'lganda fon to'q sariq. Lekin qarang, tugma o'zgarmadi, chunki sichqoncha hali ustida emas.", 'Правило готово: при hover фон оранжевый. Но смотри, кнопка не изменилась, ведь мышка пока не над ней.', 'The rule is ready: on hover the background is orange. But look, the button didn’t change, because the mouse isn’t over it yet.'),
    sayHover: L3("Endi sichqoncha tugma ustiga keldi deb tasavvur qiling. Ana, fon to'q sariq bo'ldi! Inspektor buni hover belgisi bilan ko'rsatyapti.", 'Теперь представь, что мышка навелась на кнопку. Вот, фон стал оранжевым! Инспектор показывает это меткой hover.', 'Now imagine the mouse moved over the button. There, the background turned orange! The Inspector shows it with a hover tag.'),
    sayColor: L3("Yana bir qoida: hover bo'lganda matn oq. Qoidalar ko'p bo'lishi mumkin.", 'Ещё одно правило: при hover текст белый. Правил может быть сколько угодно.', 'One more rule: on hover the text is white. You can have as many rules as you like.'),
    done: L3("Demak, hover qoidasi doim emas, faqat sichqoncha ustida ishlaydi. Telefonda esa tegilganda.", 'Значит, правило с hover работает не всегда, а только когда мышка над элементом. А на телефоне — при касании.', 'So a hover rule doesn’t work all the time, only while the mouse is over the element. On a phone, when you tap.'),
    askStart: L3("Qarang: oddiy tugma", 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askRule: L3("Qarang: qoida bor, sichqoncha yo'q", 'Смотри: правило есть, мышки нет', 'Watch: a rule, but no mouse'),
    askHover: L3("Qarang: sichqoncha ustida", 'Смотри: мышка над кнопкой', 'Watch: the mouse is over it'),
    askColor: L3("Qarang: yana bir qoida", 'Смотри: ещё одно правило', 'Watch: one more rule'),
    askDone: L3(":hover — sichqoncha ustida", ':hover — когда мышка над элементом', ':hover is when the mouse is over it')
  },
  s3: {
    eyebrow: L3("Ustida — oltin", 'Под мышкой — золотая', 'Gold on hover'),
    say: L3("Endi navbat sizga. Sichqoncha ustida bo'lganda tugma oltin rangga kirsin: hover li qoidaga shu rangni yozing. Keyin tugmaga sichqonchani olib borib ko'ring, telefonda esa bosing.", "Теперь твоя очередь. Пусть под мышкой кнопка становится золотой — впиши этот цвет в правило с hover. Потом наведи мышку на кнопку, а на телефоне — коснись её.", "Now it’s your turn. Make the button turn gold on hover: type that color into the hover rule. Then point the mouse at the button, or tap it on a phone."),
    msgs: {
      empty: L3("Rang yozing.", 'Впиши цвет.', 'Type a color.'),
      bad: L3("Brauzer bu rangni tanimadi. Rang nomini inglizcha yozing.", 'Браузер не узнал этот цвет. Напиши название цвета по-английски.', 'The browser didn’t recognize that color. Write the color name in English.'),
      other: L3("Bu boshqa rang. Oltin rang gold deyiladi.", 'Это другой цвет. Золотой называется gold.', 'That’s a different color. Gold is called gold.')
    },
    hints: [
      L3("Oltin rang inglizcha qanday?", 'Как по-английски «золотой»?', 'What’s the English for gold?'),
      L3("Oltin gold.", 'Золотой — gold.', 'It’s gold.'),
      L3("gold deb yozing va Tekshirishni bosing.", 'Впиши gold и нажми «Проверить».', 'Type gold and tap Check.')
    ],
    ok: L3("Zo'r! Endi sichqoncha ustida tugma oltin rangda.", 'Огонь! Теперь под мышкой кнопка золотая.', 'Awesome! Now the button turns gold under the mouse.'),
    ask: L3("Ustida bo'lganda tugma gold bo'lsin", 'Сделай кнопку золотой при hover', 'Make the button gold on hover')
  },
  s4: {
    eyebrow: L3("Doim yoki ustida?", 'Всегда или под мышкой?', 'Always or on hover?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men qoida ko'rsataman, siz esa u doim ishlaydimi yoki faqat sichqoncha ustida, shuni tanlang.",
      'Теперь проверь себя. Я покажу правило, а ты выбери: оно работает всегда или только под мышкой?',
      'Now check yourself. I’ll show a rule, and you pick: does it work all the time or only on hover?'),
    ask: L3("Bu qoida qachon ishlaydi?", 'Когда работает это правило?', 'When does this rule work?'),
    opts: {
      always: L3("Doim", 'Всегда', 'Always'),
      hover: L3("Faqat ustida", 'Только под мышкой', 'Only on hover')
    },
    hint1: L3("Selektorga qarang: oxirida hover bormi?", 'Посмотри на селектор: есть ли в конце hover?', 'Look at the selector: is there hover at the end?'),
    hint2: L3("hover bo'lsa, faqat sichqoncha ustida; bo'lmasa, doim.", 'Есть hover — только под мышкой; нет — всегда.', 'With hover, only under the mouse; without it, always.'),
    items: [
      { code: '.tugma { color: white; }', right: 'always', why: L3("hover yo'q: matn doim oq.", 'hover нет: текст белый всегда.', 'No hover: the text is always white.') },
      { code: '.tugma:hover { color: white; }', right: 'hover', why: L3("hover bor: faqat sichqoncha ustida.", 'hover есть: только под мышкой.', 'There’s hover: only under the mouse.') },
      { code: 'a:hover { color: red; }', right: 'hover', why: L3("Havola faqat sichqoncha ustida qizil bo'ladi.", 'Ссылка становится красной только под мышкой.', 'The link turns red only under the mouse.') },
      { code: 'h1 { color: orange; }', right: 'always', why: L3("hover yo'q: sarlavha doim to'q sariq.", 'hover нет: заголовок оранжевый всегда.', 'No hover: the heading is always orange.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! hover qoidasini darrov taniysiz.", 'Всё верно! Ты сразу узнаёшь правило с hover.', 'All correct! You spot a hover rule right away.')
  },
  s5: {
    eyebrow: L3("transform", 'transform', 'transform'),
    help: [
      L3('Tugmaga qarang: u kattalashadi, buriladi va suriladi. Pastdagi abzas esa joyidan qimirlamaydi.', 'Посмотри на кнопку: она увеличивается, поворачивается и сдвигается. А абзац под ней не двигается.', 'Look at the button: it grows, turns and moves. The paragraph below it doesn’t move.'),
      L3("transform elementni o'zgartiradi: scale kattalashtiradi, rotate buradi, translate suradi. Qo'shnilar esa joyida qoladi.", 'transform меняет элемент: scale увеличивает, rotate поворачивает, translate сдвигает. А соседи остаются на месте.', 'transform changes an element: scale makes it bigger, rotate turns it, translate moves it. The neighbors stay in place.'),
      L3('Telefonda rasmni ikki barmoq bilan kattalashtirsangiz yoki bursangiz, atrofdagi narsalar joyida qoladi. transform ham shunday.', 'Когда на телефоне увеличиваешь или поворачиваешь фото двумя пальцами, всё вокруг остаётся на месте. transform работает так же.', 'When you zoom or turn a photo on a phone with two fingers, everything around it stays put. transform works the same way.')
    ],
    say: L3("Endi transform, ya'ni o'zgartirish degani. U elementni kattalashtiradi, buradi yoki suradi. Qavs ichida qancha ekanini yozamiz.",
      'Теперь transform, то есть преобразование. Он увеличивает элемент, поворачивает или сдвигает. В скобках пишем, насколько.',
      'Now transform, meaning a change of shape. It makes an element bigger, turns it or moves it. In the brackets we write how much.'),
    sayScale: L3("scale bir yarim: tugma bir yarim barobar kattalashdi. Qarang, pastdagi abzas joyidan qimirlamadi.", 'scale полтора: кнопка стала в полтора раза больше. Смотри, абзац под ней не сдвинулся.', 'scale one and a half: the button got one and a half times bigger. Look, the paragraph below didn’t move.'),
    sayRotate: L3("rotate o'n besh deg: tugma o'n besh gradusga burildi. deg ya'ni gradus degani.", 'rotate пятнадцать deg: кнопка повернулась на пятнадцать градусов. deg — то есть градусы.', 'rotate fifteen deg: the button turned fifteen degrees. deg means degrees.'),
    sayTranslate: L3("translate qirq va o'n piksel: birinchi son o'ngga suradi, ikkinchisi pastga. Tugma o'ngga qirq va pastga o'n piksel surildi. Sonlar o'rtasida vergul bor. Qo'shnilar esa yana joyida.", "translate сорок и десять пикселей: первое число двигает вправо, второе — вниз. Кнопка уехала вправо на сорок и вниз на десять. Между числами запятая. А соседи опять на месте.", "translate forty and ten pixels: the first number moves right, the second moves down. The button moved forty right and ten down. There’s a comma between the numbers. The neighbours stayed in place again."),
    done: L3("Demak, transform elementni kattalashtiradi, buradi yoki suradi, qo'shnilar esa joyida qoladi.", 'Значит, transform увеличивает, поворачивает или сдвигает элемент, а соседи остаются на месте.', 'So transform scales, turns or moves an element, and the neighbours stay in place.'),
    askStart: L3("Qarang: oddiy tugma", 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askScale: L3("Qarang: scale — kattalashtirish", 'Смотри: scale — увеличение', 'Watch: scale makes it bigger'),
    askRotate: L3("Qarang: rotate — burish", 'Смотри: rotate — поворот', 'Watch: rotate turns it'),
    askTranslate: L3("Qarang: translate — surish", 'Смотри: translate — сдвиг', 'Watch: translate moves it'),
    askDone: L3("scale · rotate · translate", 'scale · rotate · translate', 'scale · rotate · translate')
  },
  s6: {
    eyebrow: L3("Ikki barobar", 'Вдвое больше', 'Twice as big'),
    say: L3("Endi siz. Tugma ikki barobar katta bo'lsin: scale qavsi ichiga sonni yozing.",
      'Теперь ты. Пусть кнопка станет вдвое больше: впиши число в скобки scale.',
      'Your turn. Make the button twice as big: type the number inside scale’s brackets.'),
    msgs: {
      empty: L3("Son yozing.", 'Впиши число.', 'Type a number.'),
      unit: L3("scale uchun px kerak emas: faqat son, necha barobar.", 'Для scale px не нужен: только число — во сколько раз.', 'scale needs no px: just a number, how many times.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Qavs ichiga faqat son yozing.", 'Браузер не узнал это значение. Напиши в скобках только число.', 'The browser didn’t recognize that value. Write just a number in the brackets.'),
      zero: L3("Nol bilan tugma butunlay yo'qoldi. Ikki barobar kerak.", 'С нулём кнопка совсем пропала. Нужно вдвое.', 'With zero the button vanished. We need twice as big.'),
      one: L3("Bir bilan tugma o'zgarmadi. Ikki barobar kerak.", 'С единицей кнопка не изменилась. Нужно вдвое.', 'With one the button didn’t change. We need twice as big.'),
      other: L3("Bu boshqa o'lcham. Ikki barobar kerak.", 'Это другой размер. Нужно вдвое.', 'That’s a different size. We need twice as big.'),
      comma: L3("CSS da kasr vergul bilan emas, nuqta bilan yoziladi. Bu yerda esa butun son kerak: necha barobar.", "Дробь в CSS пишут через точку, а не через запятую. А здесь нужно целое число — во сколько раз.", "In CSS a decimal uses a dot, not a comma. And here you need a whole number: how many times.")
    },
    hints: [
      L3("scale ichidagi son necha barobar ekanini aytadi.", 'Число в scale говорит, во сколько раз.', 'The number in scale says how many times.'),
      L3("Ikki barobar bu ikki.", 'Вдвое — это два.', 'Twice is two.'),
      L3("Ikki sonini yozing va Tekshirishni bosing.", 'Впиши число два и нажми «Проверить».', 'Type the number two and tap Check.')
    ],
    ok: L3("Barakalla! Tugma ikki barobar katta.", 'Молодец! Кнопка вдвое больше.', 'Well done! The button is twice as big.'),
    ask: L3("Tugmani ikki barobar kattalashtiring", 'Увеличь кнопку вдвое', 'Make the button twice as big')
  },
  s7: {
    eyebrow: L3("Qaysi transform?", 'Какой transform?', 'Which transform?'),
    say: L3("Endi o'zingizni sinab ko'ring. Tugmaga qarang va qaysi transform uni shunday qilganini tanlang.",
      'Теперь проверь себя. Посмотри на кнопку и выбери, какой transform сделал её такой.',
      'Now check yourself. Look at the button and pick which transform made it look like that.'),
    ask: L3("Tugmani qaysi transform shunday qildi?", 'Какой transform сделал кнопку такой?', 'Which transform made the button like this?'),
    hint1: L3("Tugma kattalashganmi, burilganmi yoki surilganmi?", 'Кнопка увеличилась, повернулась или сдвинулась?', 'Did the button grow, turn or move?'),
    hint2: L3("scale kattalashtiradi yoki kichraytiradi, rotate buradi, translate suradi: birinchi son o'ngga, ikkinchisi pastga.", "scale увеличивает или уменьшает, rotate поворачивает, translate сдвигает: первое число — вправо, второе — вниз.", "scale makes it bigger or smaller, rotate turns it, translate moves it: the first number right, the second down."),
    rounds: [
      { want: 'rotate(20deg)', opts: ['scale(1.5)', 'rotate(20deg)', 'translate(40px, 0px)'],
        why: L3("Tugma qiyshaygan: rotate.", 'Кнопка наклонена: rotate.', 'The button is tilted: rotate.') },
      { want: 'scale(1.5)', opts: ['scale(0.5)', 'scale(1.5)', 'translate(0px, 20px)'],
        why: L3("Tugma kattaroq: scale bir yarim.", 'Кнопка больше: scale полтора.', 'The button is bigger: scale one and a half.') },
      { want: 'translate(60px, 0px)', opts: ['rotate(20deg)', 'translate(60px, 0px)', 'translate(0px, 30px)'],
        why: L3("Tugma o'ngga surilgan: translate oltmish va nol.", 'Кнопка сдвинута вправо: translate шестьдесят и ноль.', 'The button moved right: translate sixty and zero.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! transform ni bir qarashda o'qiysiz.", 'Всё верно! Ты читаешь transform с одного взгляда.', 'All correct! You read transform at a glance.')
  },
  s8: {
    eyebrow: L3("hover va transform", 'hover и transform', 'hover and transform'),
    help: [
      L3("Tugma va ko'rsatkichga qarang: sichqoncha kelganda tugma kattalashadi, ko'rsatkich esa qo'lga aylanadi.", 'Посмотри на кнопку и указатель: когда приходит мышка, кнопка растёт, а указатель становится рукой.', 'Look at the button and the pointer: when the mouse arrives, the button grows and the pointer turns into a hand.'),
      L3("hover va transform birga tugmani jonlantiradi. cursor pointer esa ko'rsatkichni qo'lga aylantirib, bu narsani bosish mumkinligini bildiradi.", 'hover и transform вместе оживляют кнопку. А cursor pointer превращает указатель в руку и показывает, что на это можно нажать.', 'hover and transform together bring the button to life. cursor pointer turns the pointer into a hand and shows it can be pressed.'),
      L3("Saytlarda havolaga sichqoncha olib borsangiz, qo'l paydo bo'ladi. Bu cursor pointer: «buni bosish mumkin» degan belgi.", 'На сайтах над ссылкой появляется рука. Это cursor pointer — знак «сюда можно нажать».', 'On websites a hand appears over a link. That’s cursor pointer, a sign that says “you can press this”.')
    ],
    say: L3("Endi ikkalasini birlashtiramiz: tugma faqat sichqoncha ustida kattalashsin. Va yana bitta xususiyat: cursor, ya'ni ko'rsatkich degani.",
      'Теперь соединим оба: пусть кнопка увеличивается только под мышкой. И ещё одно свойство: cursor, то есть указатель.',
      'Now let’s combine them: make the button grow only under the mouse. And one more property: cursor, meaning the pointer.'),
    sayRule: L3("Qoida: hover bo'lganda scale bir butun o'ndan ikki. Hozir sichqoncha yo'q, tugma oddiy.", 'Правило: при hover scale одна целая две десятых. Сейчас мышки нет, кнопка обычная.', 'The rule: on hover, scale one point two. Right now there’s no mouse, the button is normal.'),
    sayHover: L3("Sichqoncha ustida: tugma biroz kattalashdi. Xuddi bosing deyayotgandek!", 'Мышка над кнопкой: она немного выросла. Будто говорит: нажми меня!', 'The mouse is over it: the button grew a little. As if it’s saying: press me!'),
    sayCursor: L3("cursor pointer: kompyuterda sichqoncha tugma ustiga kelganda ko'rsatkich strelkadan qo'lga aylanadi. Telefonda ko'rsatkich yo'q, shuning uchun bu faqat kompyuterda ko'rinadi.", 'cursor pointer: на компьютере, когда мышка над кнопкой, указатель превращается из стрелки в руку. На телефоне указателя нет, поэтому это видно только на компьютере.', 'cursor pointer: on a computer, when the mouse is over the button, the pointer turns from an arrow into a hand. A phone has no pointer, so you only see this on a computer.'),
    done: L3("Demak, hover va transform birga tugmani jonlantiradi, cursor pointer esa bu bosiladigan narsa ekanini ko'rsatadi.", 'Значит, hover и transform вместе оживляют кнопку, а cursor pointer показывает, что на неё можно нажать.', 'So hover and transform together bring the button to life, and cursor pointer shows it can be pressed.'),
    askStart: L3("Qarang: oddiy tugma", 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askRule: L3("Qarang: qoida bor, sichqoncha yo'q", 'Смотри: правило есть, мышки нет', 'Watch: a rule, but no mouse'),
    askHover: L3("Qarang: ustida — kattalashdi", 'Смотри: под мышкой — выросла', 'Watch: it grows under the mouse'),
    askCursor: L3("Qarang: cursor pointer", 'Смотри: cursor pointer', 'Watch: cursor pointer'),
    askDone: L3("hover va transform, cursor pointer", 'hover и transform, cursor pointer', 'hover and transform, cursor pointer')
  },
  s9: {
    eyebrow: L3("Qo'l ko'rsatkich", 'Курсор-рука', 'A hand pointer'),
    say: L3("Endi siz. Kompyuterda sichqoncha tugma ustiga kelganda ko'rsatkich qo'lga aylansin: cursor uchun qiymatni yozing.",
      'Теперь ты. Пусть на компьютере указатель над кнопкой превращается в руку: впиши значение для cursor.',
      'Your turn. On a computer, make the pointer turn into a hand over the button: type the value for cursor.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      hand: L3("CSS da qo'l hand emas. Ko'rsatkich degan so'z kerak.", 'В CSS рука — не hand. Нужно слово «указатель».', 'In CSS the hand isn’t hand. We need the word for pointer.'),
      bad: L3("Brauzer bu so'zni tanimadi. cursor uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для cursor.', 'The browser didn’t recognize that word. Check the word for cursor.'),
      other: L3("Bu boshqa ko'rsatkich. Qo'l pointer deyiladi.", 'Это другой указатель. Рука называется pointer.', 'That’s a different pointer. The hand is called pointer.')
    },
    hints: [
      L3("Ko'rsatkich inglizcha qanday?", 'Как по-английски «указатель»?', 'What’s the English for pointer?'),
      L3("Qo'l ko'rsatkich pointer deyiladi.", 'Указатель-рука — pointer.', 'The hand pointer is pointer.'),
      L3("pointer deb yozing va Tekshirishni bosing.", 'Впиши pointer и нажми «Проверить».', 'Type pointer and tap Check.')
    ],
    ok: L3("Ajoyib! Kompyuterda sichqonchani tugma ustiga olib borib ko'ring: ko'rsatkich qo'lga aylanadi.", 'Отлично! На компьютере наведи мышку на кнопку: указатель станет рукой.', 'Great! On a computer, point the mouse at the button: the pointer becomes a hand.'),
    ask: L3("Ko'rsatkich qo'l bo'lsin", 'Сделай указатель рукой', 'Make the pointer a hand')
  },
  s10: {
    eyebrow: L3("Nima kerak?", 'Что нужно?', 'What’s needed?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men vazifani aytaman, siz esa nima kerakligini tanlang.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, что нужно.',
      'Now check yourself. I’ll say a task, and you pick what’s needed.'),
    ask: L3("Bu vazifa uchun nima kerak?", 'Что нужно для этой задачи?', 'What does this task need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Tugma kattalashadimi, buriladimi, suriladimi yoki ko'rsatkich o'zgaradimi?", 'Кнопка растёт, поворачивается, сдвигается или меняется указатель?', 'Does the button grow, turn, move, or does the pointer change?'),
    hint2: L3("scale kattalashtiradi, rotate buradi, translate suradi, cursor ko'rsatkichni o'zgartiradi.", 'scale увеличивает, rotate поворачивает, translate сдвигает, cursor меняет указатель.', 'scale grows, rotate turns, translate moves, cursor changes the pointer.'),
    items: [
      { t: L3("Tugma biroz kattalashsin.", 'Кнопка должна немного вырасти.', 'The button should grow a little.'), right: 'scale', why: L3("Kattalashtirish scale.", 'Увеличение — scale.', 'Growing is scale.') },
      { t: L3("Tugma biroz qiyshaysin.", 'Кнопка должна немного наклониться.', 'The button should tilt a little.'), right: 'rotate', why: L3("Burish rotate.", 'Поворот — rotate.', 'Turning is rotate.') },
      { t: L3("Tugma biroz yuqoriga ko'tarilsin.", 'Кнопка должна чуть подняться вверх.', 'The button should rise a little.'), right: 'translate', why: L3("Surish translate.", 'Сдвиг — translate.', 'Moving is translate.') },
      { t: L3("Ko'rsatkich qo'lga aylansin.", 'Указатель должен стать рукой.', 'The pointer should become a hand.'), right: 'cursor', why: L3("Ko'rsatkichni cursor o'zgartiradi.", 'Указатель меняет cursor.', 'cursor changes the pointer.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Har biriga to'g'ri vositani tanlaysiz.", 'Всё верно! Ты подбираешь к каждой задаче нужный инструмент.', 'All correct! You pick the right tool for each task.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3('Har safar kodga qarang: scale da birlik bormi, rotate da deg bormi, translate da vergul bormi? Keyin tugmaga qarang.', 'Каждый раз смотри на код: есть ли единица в scale, есть ли deg в rotate, есть ли запятая в translate? Потом смотри на кнопку.', 'Each time, look at the code: does scale have a unit, does rotate have deg, does translate have a comma? Then look at the button.'),
      L3("scale ga birlik kerak emas, rotate ga deg kerak, translate da sonlar vergul bilan ajratiladi. Ikkita transform yozilsa, ikkinchisi birinchisini o'chiradi.", 'В scale единица не нужна, в rotate нужен deg, в translate числа разделяют запятой. Если написать два transform, второй сотрёт первый.', 'scale needs no unit, rotate needs deg, translate separates numbers with a comma. Write two transforms and the second erases the first.'),
      L3("Retseptda grammni shtuk bilan adashtirsangiz, taom chiqmaydi. CSS da ham har bir funksiya o'z birligini xohlaydi.", 'Если в рецепте перепутать граммы и штуки, блюдо не получится. В CSS у каждой функции тоже своя единица.', 'Mix up grams and pieces in a recipe and the dish won’t work out. In CSS each function wants its own unit too.')
    ],
    say: L3("transform da ham xatolar bo'ladi. Keling, to'rttasini ko'ramiz. Hozir tugma bir yarim barobar katta.",
      'И с transform бывают ошибки. Давай посмотрим на четыре. Сейчас кнопка в полтора раза больше.',
      'transform has mistakes too. Let’s look at four. Right now the button is one and a half times bigger.'),
    sayUnit: L3("Birinchisi: scale ichida px. scale ga birlik kerak emas, brauzer qoidani tashlab yubordi.", 'Первая: в scale написан px. Для scale единица не нужна, браузер выбросил правило.', 'The first: scale has px inside. scale needs no unit, so the browser threw the rule away.'),
    sayDeg: L3("Ikkinchisi: rotate ichida faqat son, deg yo'q. Brauzer qanchalik burishni tushunmadi.", 'Вторая: в rotate только число, без deg. Браузер не понял, на сколько поворачивать.', 'The second: rotate has just a number, no deg. The browser didn’t understand how much to turn.'),
    sayComma: L3("Uchinchisi: translate sonlari o'rtasida vergul yo'q. Brauzer qoidani tashlab yubordi, tugma surilmadi.", "Третья: между числами translate нет запятой. Браузер выбросил правило — кнопка не сдвинулась.", "The third: there’s no comma between translate’s numbers. The browser threw the rule away, so the button didn’t move."),
    sayTwice: L3("To'rtinchisi tuzoq: ikkita transform qoidasi. Ikkinchisi birinchisini o'chirdi, tugma faqat burildi, kattalashmadi. Ikkalasi kerak bo'lsa, bitta qatorga bo'sh joy bilan yoziladi.", 'Четвёртая — ловушка: два правила transform. Второе стёрло первое, кнопка только повернулась, но не выросла. Если нужны оба, их пишут в одной строке через пробел.', 'The fourth is a trap: two transform rules. The second erased the first, so the button only turned and didn’t grow. If you need both, you write them on one line with a space.'),
    done: L3("Demak, scale da birlik yo'q, rotate da deg bor, translate da vergul bor, transform esa bitta qatorda yoziladi.", 'Значит, в scale нет единицы, в rotate есть deg, в translate есть запятая, а transform пишут в одной строке.', 'So scale has no unit, rotate has deg, translate has a comma, and transform goes on one line.'),
    askStart: L3("Qarang: scale(1.5)", 'Смотри: scale(1.5)', 'Watch: scale(1.5)'),
    askUnit: L3("Qarang: scale da px", 'Смотри: px в scale', 'Watch: px in scale'),
    askDeg: L3("Qarang: deg yo'q", 'Смотри: нет deg', 'Watch: no deg'),
    askComma: L3("Qarang: vergul yo'q", 'Смотри: нет запятой', 'Watch: no comma'),
    askTwice: L3("Qarang: ikkinchisi g'olib", 'Смотри: побеждает второе', 'Watch: the second one wins'),
    askDone: L3("Birliksiz, deg bilan, vergul bilan, bitta qatorda", 'Без единицы, с deg, с запятой, в одну строку', 'No unit, with deg, with a comma, on one line')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men tugmani buraman deb yozdim, lekin u to'g'ri turibdi! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я написал поворот кнопки, а она стоит прямо! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wrote a turn for the button, but it stands straight! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      deg: L3("Son yonida hali deg yo'q. Uni qo'shing.", 'Рядом с числом всё ещё нет deg. Добавь его.', 'There’s still no deg next to the number. Add it.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Qavslarni va deg ni tekshiring.", 'Браузер не узнал это значение. Проверь скобки и deg.', 'The browser didn’t recognize that value. Check the brackets and deg.'),
      other: L3("Bu boshqa qiymat. Sonni o'zgartirmang, faqat deg qo'shing.", 'Это другое значение. Не меняй число, просто добавь deg.', 'That’s a different value. Don’t change the number, just add deg.')
    },
    hints: [
      L3("rotate ichida son yonida nima bo'lishi kerak?", 'Что должно стоять рядом с числом в rotate?', 'What should be next to the number in rotate?'),
      L3("Gradus deg deb yoziladi.", 'Градусы пишутся deg.', 'Degrees are written deg.'),
      L3("rotate, qavs, o'n besh deg, yopuvchi qavs deb yozing va Tekshirishni bosing.", 'Впиши rotate, скобка, пятнадцать deg, закрывающая скобка и нажми «Проверить».', 'Type rotate, bracket, fifteen deg, closing bracket and tap Check.')
    ],
    ok: L3("Ura, ishladi! Tugma o'n besh gradusga burildi.", 'Ура, заработало! Кнопка повернулась на пятнадцать градусов.', 'Hooray, it works! The button turned fifteen degrees.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      unit: L3("Topdingiz! scale ichida px bo'lmasligi kerak.", 'Есть! В scale не должно быть px.', 'Found it! There shouldn’t be px in scale.'),
      comma: L3("Topdingiz! translate sonlari o'rtasida vergul yo'q edi.", 'Есть! Между числами translate не было запятой.', 'Found it! There was no comma between translate’s numbers.')
    },
    hint1: L3("Sahifaga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      unit: L3("Tugma kattalashdimi? transform qiymatini tekshiring.", 'Кнопка увеличилась? Проверь значение transform.', 'Did the button grow? Check the transform value.'),
      comma: L3("Tugma surildimi? translate ichini tekshiring.", 'Кнопка сдвинулась? Проверь, что внутри translate.', 'Did the button move? Check inside translate.')
    },
    hint3: {
      unit: L3("Xato ikkinchi qoidada: scale ichida px. O'sha qatorni bosing.", 'Ошибка во втором правиле: px в scale. Нажми эту строку.', 'The bug is in the second rule: px in scale. Tap that line.'),
      comma: L3("Xato ikkinchi qoidada: vergul yo'q. O'sha qatorni bosing.", 'Ошибка во втором правиле: нет запятой. Нажми эту строку.', 'The bug is in the second rule: no comma. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz tugmalarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь кнопки как настоящий разработчик.', 'Super! Both found. You check buttons like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Sichqoncha ustida bo'lganda tugma o'n gradusga burilsin. Selektor tugma klassi va hover.",
      'Теперь напиши правило целиком. Пусть под мышкой кнопка поворачивается на десять градусов. Селектор — класс кнопки и hover.',
      'Now write the whole rule yourself. Make the button turn ten degrees on hover. The selector is the button’s class plus hover.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin figurali qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      space: L3("Tugma va hover o'rtasida bo'sh joy bor. Ularni yopishtirib yozing.", 'Между кнопкой и hover есть пробел. Напиши их слитно.', 'There’s a space between the button and hover. Write them together.'),
      noHover: L3("hover yo'q: tugma doim burilib turadi. Faqat sichqoncha ustida kerak.", 'Нет hover: кнопка будет повёрнута всегда. А нужно только под мышкой.', 'No hover: the button would always be turned. We need it only on hover.'),
      sel: L3("Selektor: nuqta, tugma klassi, ikki nuqta va hover.", 'Селектор: точка, класс кнопки, двоеточие и hover.', 'The selector: a dot, the button’s class, a colon and hover.'),
      prop: L3("Burishni transform xususiyati beradi.", 'Поворот задаёт свойство transform.', 'The transform property does the turning.'),
      deg: L3("Son yonida deg yo'q.", 'Рядом с числом нет deg.', 'There’s no deg next to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Qavslarni tekshiring.", 'Браузер не узнал это значение. Проверь скобки.', 'The browser didn’t recognize that value. Check the brackets.'),
      other: L3("Burish boshqacha. O'n gradus kerak.", 'Поворот другой. Нужно десять градусов.', 'The turn is different. We need ten degrees.')
    },
    hints: [
      L3("Selektorga hover qo'shing, xususiyat esa transform.", 'Добавь к селектору hover, а свойство — transform.', 'Add hover to the selector, and the property is transform.'),
      L3("Selektor nuqta tugma ikki nuqta hover, qiymat rotate o'n deg.", 'Селектор: точка tugma двоеточие hover, значение: rotate десять deg.', 'Selector: dot tugma colon hover; value: rotate ten deg.'),
      L3("Namuna kod ostida paydo bo'ldi. Uni maydonga ko'chirib yozing va Tekshirishni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Sichqoncha ustida tugma qiyshayadi. Qoidani o'zingiz yozdingiz.", 'Отлично! Под мышкой кнопка наклоняется. Правило написано тобой целиком.', 'Great! The button tilts on hover. You wrote the whole rule yourself.'),
    ask: L3("Ustida tugma 10 gradusga burilsin", 'Поверни кнопку на 10 градусов при hover', 'Turn the button 10 degrees on hover')
  },
  s14: {
    eyebrow: L3("O'z tugmangiz", 'Своя кнопка', 'Your own button'),
    say: L3("Endi o'z tugmangizni jonlantiring. Sichqoncha ustidagi rang, transform va ko'rsatkich uchun istalgan qiymatni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь оживи свою кнопку. Впиши любые значения для цвета под мышкой, transform и указателя. Потом нажми «Готово».',
      'Now bring your own button to life. Type any values for the hover color, the transform and the pointer. Then tap “Done”.'),
    msgs: {
      color: L3("Brauzer {w} rangini tanimadi. Rang nomini yoki kodini yozing.", 'Браузер не узнал цвет {w}. Напиши название или код цвета.', 'The browser didn’t recognize the color {w}. Write a color name or code.'),
      tf: L3("Brauzer {w} qiymatini tanimadi. scale, rotate yoki translate dan keyin qavs ichida son kerak, masalan scale bir butun o'ndan bir.", "Браузер не узнал {w}. После scale, rotate или translate нужны скобки с числом внутри — например, scale и в скобках одна целая одна десятая.", "The browser didn’t recognize {w}. After scale, rotate or translate you need brackets with a number inside, for example scale with one point one in brackets."),
      deg: L3("rotate da son yonida deg yo'q.", 'В rotate рядом с числом нет deg.', 'In rotate there’s no deg next to the number.'),
      cur: L3("Brauzer {w} ko'rsatkichini tanimadi. Masalan, pointer yozing.", 'Браузер не узнал указатель {w}. Впиши, например, pointer.', 'The browser didn’t recognize the pointer {w}. Type, for example, pointer.'),
      comma: L3("CSS da kasr vergul bilan emas, nuqta bilan yoziladi: bir nuqta bir.", "Дробь в CSS пишут через точку: одна точка одна, а не через запятую.", "In CSS a decimal uses a dot, not a comma: one point one.")
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Rang uchun rang nomi, transform uchun qavsli va sonli scale, rotate yoki translate, cursor uchun pointer.", "Для цвета — название цвета, для transform — scale, rotate или translate со скобками и числом, для cursor — pointer.", "For the color, a color name; for transform, scale, rotate or translate with brackets and a number; for cursor, pointer."),
      L3("Masalan: gold, scale bir butun o'ndan bir va pointer. Keyin «Tayyor»ni bosing.", 'Например: gold, scale одна целая одна десятая и pointer. Потом нажми «Готово».', 'For example: gold, scale one point one and pointer. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning jonli tugmangiz.", 'Ого, как красиво! Это твоя живая кнопка.', 'Wow, how pretty! This is your living button.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor tekshiruv. Men gap aytaman, siz esa to'g'rimi yoki noto'g'rimi, shuni tanlang.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gap nima haqida: hover, transform yoki selektor yozilishi?", 'О чём фраза: о hover, о transform или о записи селектора?', 'What’s the sentence about: hover, transform, or how the selector is written?'),
    hint2: L3("Esingizdami: hover faqat ustida ishlaydi, transform qo'shnilarni surmaydi, rotate ga deg kerak, hover tugmaga yopishib yoziladi.", 'Вспомни: hover работает только под мышкой, transform не двигает соседей, rotate нужен deg, hover пишут слитно с кнопкой.', 'Remember: hover only works under the mouse, transform doesn’t move neighbours, rotate needs deg, and hover is written right after the button.'),
    items: [
      { t: L3("hover qoidasi sichqoncha element ustida bo'lganda ishlaydi.", 'Правило с hover работает, когда мышка над элементом.', 'A hover rule works when the mouse is over the element.'), right: true,
        why: L3("To'g'ri: hover sichqoncha ustida degani.", 'Верно: hover — это мышка над элементом.', 'Right: hover means the mouse is over it.') },
      { t: L3("scale ikki bo'lsa, pastdagi abzas ham pastga suriladi.", 'При scale два абзац под кнопкой тоже сдвигается вниз.', 'With scale two, the paragraph below moves down too.'), right: false,
        why: L3("Aslida transform qo'shnilarni surmaydi: ular joyida qoladi.", 'На самом деле transform не двигает соседей: они остаются на месте.', 'Actually transform doesn’t move neighbours: they stay in place.') },
      { t: L3("rotate da son yoniga deg yoziladi.", 'В rotate рядом с числом пишут deg.', 'In rotate you write deg next to the number.'), right: true,
        why: L3("To'g'ri: deg gradus degani.", 'Верно: deg — это градусы.', 'Right: deg means degrees.') },
      { t: L3("Bu qoida tugma ustiga kelganda ishlaydi.", 'Это правило сработает, когда мышка над кнопкой.', 'This rule works when the mouse is over the button.'), right: false, code: 'space',
        why: L3("Aslida bo'sh joy selektorni buzadi: brauzer tugma ichidan qidiradi.", 'На самом деле пробел ломает селектор: браузер ищет что-то внутри кнопки.', 'Actually the space breaks the selector: the browser looks for something inside the button.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz hover va transform ni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в hover и transform.', 'All correct! You know hover and transform really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men tugma va hover o'rtasiga bo'sh joy qo'ygan edim? Qarang: sichqoncha ustida bo'lsa ham tugma o'zgarmayapti! Men adashibman. Bo'sh joy bilan brauzer tugma ichidagi boshqa elementni qidiradi.",
        'Вернёмся к загадке. Помнишь, я поставил пробел между кнопкой и hover? Смотри: мышка над кнопкой, а она не меняется! Я ошибся. С пробелом браузер ищет какой-то другой элемент внутри кнопки.',
        'Back to our riddle. Remember, I put a space between the button and hover? Look: the mouse is over the button, but it doesn’t change! I was wrong. With a space, the browser looks for some other element inside the button.'), k: 'riddle' },
      { text: L3("Bo'sh joyni olib tashlasak, hover darrov ishlaydi. Mana!", 'Уберём пробел, и hover сразу работает. Вот!', 'Remove the space, and hover works right away. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning jonli tugmangiz!", 'Смотри, это твоя живая кнопка!', 'Look, this is your living button!'), k: 'own' },
      { text: L3("hover qoidasi faqat sichqoncha ustida ishlaydi.", 'Правило с hover работает только под мышкой.', 'A hover rule only works under the mouse.'), k: 'hover' },
      { text: L3("transform kattalashtiradi, buradi va suradi.", 'transform увеличивает, поворачивает и сдвигает.', 'transform scales, turns and moves.'), k: 'tf' },
      { text: L3("cursor pointer bosiladigan narsani ko'rsatadi.", 'cursor pointer показывает, что на элемент можно нажать.', 'cursor pointer shows something can be pressed.'), k: 'cur' },
      { text: L3("hover esa tugmaga bo'sh joysiz yoziladi.", 'А hover пишут вплотную к кнопке, без пробела.', 'And hover is written right after the button, with no space.'), k: 'space' },
      { text: L3("Tabriklayman! Endi tugmalaringiz jonli. Keyingi darsda ularni silliq qilamiz: o'zgarish birdaniga emas, asta-sekin bo'ladi. Ko'rishguncha!",
        'Ура! Теперь твои кнопки живые. На следующем уроке сделаем их плавными: изменения будут не сразу, а постепенно. До встречи!',
        'Hooray! Now your buttons are alive. Next lesson we’ll make them smooth: changes will happen gradually, not all at once. See you!') }
    ],
    roles: {
      hover: L3(":hover — ustida", ':hover — под мышкой', ':hover — under the mouse'),
      tf: L3("transform — o'zgartirish", 'transform — преобразование', 'transform — change of shape'),
      cur: L3("cursor — ko'rsatkich", 'cursor — указатель', 'cursor — the pointer'),
      space: L3("bo'sh joysiz", 'без пробела', 'no space')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayRule: 1, sayHover: 1, sayColor: 1,
  sayScale: 1, sayRotate: 1, sayTranslate: 1, sayCursor: 1, sayUnit: 1, sayDeg: 1, sayComma: 1, sayTwice: 1, miss: 1, say2: 1, fine: 1, found: 1,
  items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c13-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c13.css@*/
`;
