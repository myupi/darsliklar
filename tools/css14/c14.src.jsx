// =============================================================================
// КУРС «CSS» · Урок 14 — «Плавные эффекты»
// (облик «Редактор», как уроки курса HTML; 07.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css14/build.mjs → lessons/css/14-transition.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 14 · «Плавные эффекты» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (07.11.2026). Уроки 1–13: правило, селекторы, цвета, фон, текст, размеры, Box Model, карточки, display,
// Flexbox, позиционирование, hover и transform. Кнопка «Играть» под мышкой растёт и краснеет рывком. Ученик узнаёт
// transition: какое свойство (transform, background-color, all) и сколько времени (s, ms; кратко — быстро, долго —
// медленно), скорость linear и ease (по умолчанию), и поломки: время без s, запятая вместо точки, опечатка в имени
// свойства (браузер её принимает, но плавным не становится ничего). Загадка (без имён): Коди пишет transition внутри
// .tugma:hover и думает, что плавно будет в обе стороны. Разгадка: обратно — прыжком, transition уходит вместе с :hover.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (кнопка прыгает → transition: all 0.4s; загадка про transition в :hover)
//   время:     s2 показ (без transition — 0s · transform 1s · 0.3s) · s3 вписать 0.5s (Fill) · s4 сразу, быстро, медленно (Sort)
//   свойство:  s5 показ (transform · background-color · all) · s6 вписать background-color (Fill) · s7 какой transition (выбор)
//   скорость:  s8 показ (500ms = 0.5s · linear · ease) · s9 вписать 1000ms (Fill) · s10 что поменять (Sort)
//   поломки:   s11 показ (без s, запятая, transfrom) · s12 исправить «transform 0,5s» (Debug & Fix) · s13 найти правило
//   w1 правило целиком: .tugma { transition: transform 0.3s; } · s14 своя кнопка («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: transition — настоящий (в стиле элемента), плавность считает сам браузер. На показах курсор
//     сам наезжает на кнопку и уезжает (туда и обратно); полоса времени под страницей — по событиям transitionrun
//     и getComputedStyle, заполняется с той же кривой скорости. Верная ли запись — решает Chrome (CSS.supports).
//   · Не забегаем: @keyframes и animation (урок 15), transition-delay, cubic-bezier.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: silliq o'tish — transition; silliq — плавный; birdaniga — сразу; soniya — секунда; millisoniya —
// миллисекунда; tekis — linear; tezlik — скорость. В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-14-transition',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '14-dars. Silliq effektlar',
    ru: 'Урок 14. Плавные эффекты',
    en: 'Lesson 14. Smooth effects'
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
  next: L3("CSS animatsiyalar", 'CSS-анимации', 'CSS animations'),
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
    eyebrow: L3("Sakraydigan tugma", 'Кнопка-прыгун', 'The jumpy button'),
    say: L3("Salom! Esingizdami, o'tgan darsda tugmamni jonlantirdik? Endi sichqoncha ustiga kelsa, u o'sadi va to'q sariq bo'ladi. Lekin qarang: u birdaniga sakraydi, xuddi kadr tushib qolgandek. Haqiqiy saytlarda tugma silliq o'zgaradi. «Aylantirish» tugmasini bosing.",
      'Привет! Помнишь, на прошлом уроке мы оживили кнопку? Теперь под мышкой она растёт и становится оранжевой. Но смотри: она прыгает сразу, будто кадр пропал. На настоящих сайтах кнопка меняется плавно. Нажми «Превратить».',
      'Hi! Remember how we brought the button to life last lesson? Now it grows and turns orange under the mouse. But look: it jumps all at once, as if a frame went missing. On real sites a button changes smoothly. Tap “Transform”.'),
    magic: L3("Mana! Endi tugma birdaniga emas, asta-sekin o'sadi va rangini o'zgartiradi. Sichqoncha ketganda esa xuddi shunday silliq qaytadi.", 'Вот! Теперь кнопка растёт и меняет цвет не сразу, а постепенно. А когда мышка уходит, так же плавно возвращается.', 'There! Now the button grows and changes color gradually, not all at once. And when the mouse leaves, it goes back just as smoothly.'),
    magicP: L3("Buni transition qildi, ya'ni silliq o'tish degani. Pastdagi chiziqqa qarang: u o'zgarish qancha vaqt davom etganini ko'rsatadi.", 'Это сделал transition, то есть «плавный переход». Посмотри на полосу внизу: она показывает, сколько времени длится изменение.', 'transition did it, meaning a smooth change. Look at the bar at the bottom: it shows how long the change takes.'),
    done: L3("Bugun tugmalarni silliq qilishni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta transition qoidasini hover qoidasining ichiga yozgan edim. Menimcha, farqi yo'q: tugma baribir ikki tomonga ham silliq bo'ladi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься делать кнопки плавными. Но сначала загадка. В первый раз я написал transition внутри правила с hover. По-моему, разницы нет: кнопка всё равно будет плавной в обе стороны. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to make buttons smooth. But first, a riddle. The first time, I put transition inside the hover rule. I think it makes no difference: the button will still be smooth both ways. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("transition — silliq o'tish", 'transition — плавный переход', 'transition is a smooth change')
  },
  s2: {
    eyebrow: L3("transition", 'transition', 'transition'),
    say: L3("transition qoidasida ikki narsa yoziladi: qaysi xususiyat silliq o'zgaradi va bu necha soniya davom etadi. Keling, ko'ramiz.",
      'В правиле transition пишут две вещи: какое свойство меняется плавно и сколько секунд это длится. Давай посмотрим.',
      'A transition rule says two things: which property changes smoothly and how many seconds it takes. Let’s see.'),
    sayJump: L3("Hozir transition yo'q. Tugma birdaniga sakraydi, chiziqda esa nol soniya: o'zgarish bir zumda bo'ldi.", 'Сейчас transition нет. Кнопка прыгает сразу, а на полосе ноль секунд: изменение случилось мгновенно.', 'Right now there’s no transition. The button jumps at once, and the bar shows zero seconds: the change was instant.'),
    saySlow: L3("transform bir soniya: o'sish endi bir soniya davom etadi. Sekin va silliq. s harfi soniya degani.", 'transform одна секунда: рост теперь длится одну секунду. Медленно и плавно. Буква s — это секунды.', 'transform one second: growing now takes one second. Slow and smooth. The letter s means seconds.'),
    sayFast: L3("Nol butun o'ndan uch soniya: tez, lekin baribir silliq. Odatda tugmalar uchun shunday qisqa vaqt tanlanadi.", 'Ноль целых три десятых секунды: быстро, но всё равно плавно. Обычно для кнопок выбирают такое короткое время.', 'Zero point three seconds: fast, but still smooth. Buttons usually get a short time like this.'),
    done: L3("Demak, transition o'zgarishni silliq qiladi: oldin xususiyat, keyin vaqt yoziladi.", 'Значит, transition делает изменение плавным: сначала пишут свойство, потом время.', 'So transition makes a change smooth: first you write the property, then the time.'),
    askStart: L3("Qarang: tugma sakraydi", 'Смотри: кнопка прыгает', 'Watch: the button jumps'),
    askJump: L3("Qarang: transition yo'q — 0s", 'Смотри: нет transition — 0s', 'Watch: no transition — 0s'),
    askSlow: L3("Qarang: 1s — sekin", 'Смотри: 1s — медленно', 'Watch: 1s is slow'),
    askFast: L3("Qarang: 0.3s — tez", 'Смотри: 0.3s — быстро', 'Watch: 0.3s is fast'),
    askDone: L3("transition: xususiyat va vaqt", 'transition: свойство и время', 'transition: property and time')
  },
  s3: {
    eyebrow: L3("Yarim soniya", 'Полсекунды', 'Half a second'),
    say: L3("Endi navbat sizga. Tugma yarim soniyada silliq o'ssin: transform dan keyin vaqtni yozing.",
      'Теперь твоя очередь. Пусть кнопка плавно растёт за полсекунды: впиши время после transform.',
      'Now it’s your turn. Make the button grow smoothly in half a second: type the time after transform.'),
    msgs: {
      empty: L3("Vaqtni yozing.", 'Впиши время.', 'Type the time.'),
      comma: L3("Sonda vergul bor. CSS da kasr nuqta bilan yoziladi.", 'В числе запятая. В CSS дробь пишут через точку.', 'There’s a comma in the number. CSS writes decimals with a dot.'),
      unit: L3("Son bor, lekin birlik yo'q. Soniya uchun s harfini qo'shing.", 'Число есть, а единицы нет. Добавь букву s — секунды.', 'There’s a number but no unit. Add the letter s for seconds.'),
      bad: L3("Brauzer bu vaqtni tanimadi. Son va s harfini yozing.", 'Браузер не узнал это время. Напиши число и букву s.', 'The browser didn’t recognize that time. Write a number and the letter s.'),
      other: L3("Bu boshqa vaqt. Yarim soniya kerak.", 'Это другое время. Нужно полсекунды.', 'That’s a different time. We need half a second.')
    },
    hints: [
      L3("Yarim soniya bu nol butun o'ndan besh degani.", 'Полсекунды — это ноль целых пять десятых.', 'Half a second is zero point five.'),
      L3("Son nuqta bilan, oxirida s harfi.", 'Число через точку, в конце буква s.', 'A number with a dot, and the letter s at the end.'),
      L3("Nol, nuqta, besh va s deb yozing, keyin Tekshirishni bosing.", 'Впиши ноль, точка, пять и s, потом нажми «Проверить».', 'Type zero, dot, five and s, then tap Check.')
    ],
    ok: L3("Zo'r! Tugma yarim soniyada silliq o'sadi. Chiziqqa qarang.", 'Огонь! Кнопка плавно растёт за полсекунды. Посмотри на полосу.', 'Awesome! The button grows smoothly in half a second. Look at the bar.'),
    ask: L3("Yarim soniya: 0.5s", 'Полсекунды: 0.5s', 'Half a second: 0.5s')
  },
  s4: {
    eyebrow: L3("Qanday o'zgaradi?", 'Как изменится?', 'How will it change?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men qoida ko'rsataman, siz esa tugma qanday o'zgarishini tanlang: birdaniga, tez yoki sekin.",
      'Теперь проверь себя. Я покажу правило, а ты выбери, как изменится кнопка: сразу, быстро или медленно.',
      'Now check yourself. I’ll show a rule, and you pick how the button will change: at once, fast or slow.'),
    ask: L3("Tugma qanday o'zgaradi?", 'Как изменится кнопка?', 'How will the button change?'),
    opts: {
      jump: L3("Birdaniga", 'Сразу', 'At once'),
      fast: L3("Tez", 'Быстро', 'Fast'),
      slow: L3("Sekin", 'Медленно', 'Slow')
    },
    hint1: L3("Vaqtga qarang: soniyami yoki millisoniyami?", 'Посмотри на время: секунды или миллисекунды?', 'Look at the time: seconds or milliseconds?'),
    hint2: L3("Nol bo'lsa birdaniga, bir soniyadan kam bo'lsa tez, bir necha soniya bo'lsa sekin. Ming millisoniya esa bir soniya.", 'Ноль — сразу, меньше секунды — быстро, несколько секунд — медленно. Тысяча миллисекунд — одна секунда.', 'Zero is at once, under a second is fast, a few seconds is slow. A thousand milliseconds is one second.'),
    items: [
      { code: '.tugma { transition: transform 3s; }', right: 'slow', why: L3("Uch soniya bu sekin.", 'Три секунды — это медленно.', 'Three seconds is slow.') },
      { code: '.tugma { transition: transform 0.2s; }', right: 'fast', why: L3("Soniyaning beshdan biri, demak tez.", 'Одна пятая секунды — быстро.', 'A fifth of a second is fast.') },
      { code: '.tugma { transition: transform 0s; }', right: 'jump', why: L3("Nol soniyada o'zgarish birdaniga bo'ladi.", 'Ноль секунд — изменение сразу.', 'Zero seconds means the change is instant.') },
      { code: '.tugma { transition: transform 2000ms; }', right: 'slow', why: L3("Ikki ming millisoniya bu ikki soniya, demak sekin.", 'Две тысячи миллисекунд — это две секунды, то есть медленно.', 'Two thousand milliseconds is two seconds, so it’s slow.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Vaqtni ko'rib, tezlikni bilasiz.", 'Всё верно! Ты по времени сразу видишь скорость.', 'All correct! You can tell the speed from the time.')
  },
  s5: {
    eyebrow: L3("Qaysi xususiyat?", 'Какое свойство?', 'Which property?'),
    say: L3("Sichqoncha ustida tugmada ikki narsa o'zgaradi: o'lchami va rangi. transition faqat siz yozgan xususiyatni silliq qiladi. Keling, ko'ramiz.",
      'Под мышкой у кнопки меняются две вещи: размер и цвет. transition делает плавным только то свойство, которое ты написал. Давай посмотрим.',
      'Under the mouse, two things change on the button: its size and its color. transition only smooths the property you write. Let’s see.'),
    sayTf: L3("transform bir soniya: o'sish silliq, lekin rang birdaniga sakraydi. Chunki rang yozilmagan.", 'transform одна секунда: рост плавный, а цвет прыгает сразу. Ведь цвет не написан.', 'transform one second: the growing is smooth, but the color jumps at once. Because color isn’t written.'),
    sayBg: L3("Endi background-color bir soniya: rang silliq, o'sish esa birdaniga.", 'Теперь background-color одна секунда: цвет плавный, а рост сразу.', 'Now background-color one second: the color is smooth, but the growing is instant.'),
    sayAll: L3("all bir soniya: all ya'ni hammasi degani. Endi o'lcham ham, rang ham silliq o'zgaradi.", 'all одна секунда: all — то есть «всё». Теперь плавно меняются и размер, и цвет.', 'all one second: all means everything. Now both the size and the color change smoothly.'),
    done: L3("Demak, transition da qaysi xususiyat yozilsa, o'shasi silliq bo'ladi. Hammasi kerak bo'lsa, all yoziladi.", 'Значит, плавным становится то свойство, которое написано в transition. Если нужно всё — пишут all.', 'So whichever property you write in transition becomes smooth. If you need everything, you write all.'),
    askStart: L3("Qarang: o'lcham va rang", 'Смотри: размер и цвет', 'Watch: size and color'),
    askTf: L3("Qarang: faqat transform silliq", 'Смотри: плавный только transform', 'Watch: only transform is smooth'),
    askBg: L3("Qarang: faqat rang silliq", 'Смотри: плавный только цвет', 'Watch: only the color is smooth'),
    askAll: L3("Qarang: all — hammasi", 'Смотри: all — всё', 'Watch: all is everything'),
    askDone: L3("Silliq — faqat yozilgan xususiyat", 'Плавное — только написанное свойство', 'Smooth: only the property you write')
  },
  s6: {
    eyebrow: L3("Silliq rang", 'Плавный цвет', 'A smooth color'),
    say: L3("Endi siz. Sichqoncha ustida tugmaning foni o'zgaradi. Fon rangi silliq o'zgarsin: o'sha xususiyat nomini yozing.",
      'Теперь ты. Под мышкой у кнопки меняется фон. Пусть цвет фона меняется плавно: впиши имя этого свойства.',
      'Your turn. Under the mouse, the button’s background changes. Make the background color change smoothly: type that property’s name.'),
    msgs: {
      empty: L3("Xususiyat nomini yozing.", 'Впиши имя свойства.', 'Type the property name.'),
      all: L3("all ham ishlaydi, lekin bu yerda aynan fon rangi xususiyatining nomi kerak.", 'all тоже сработает, но здесь нужно именно имя свойства цвета фона.', 'all would work too, but here we need the exact name of the background color property.'),
      color: L3("color bu matn rangi. O'zgarayotgani esa fon.", 'color — это цвет текста. А меняется фон.', 'color is the text color. What’s changing is the background.'),
      tf: L3("transform bu yerda o'zgarmayapti. Hover qoidasiga qarang.", 'transform здесь не меняется. Посмотри на правило с hover.', 'transform isn’t changing here. Look at the hover rule.'),
      value: L3("orange bu qiymat. Bu yerga xususiyat nomi kerak.", 'orange — это значение. А нужно имя свойства.', 'orange is a value. We need the property name.'),
      typo: L3("Brauzer bunday xususiyatni bilmaydi. Yozilishini tekshiring.", 'Браузер не знает такого свойства. Проверь написание.', 'The browser doesn’t know that property. Check the spelling.'),
      other: L3("Bu boshqa xususiyat. Fon rangi o'zgaryapti.", 'Это другое свойство. Меняется цвет фона.', 'That’s a different property. The background color is changing.')
    },
    hints: [
      L3("Hover qoidasida qaysi xususiyat o'zgaryapti?", 'Какое свойство меняется в правиле с hover?', 'Which property changes in the hover rule?'),
      L3("U yerda background-color yozilgan.", 'Там написано background-color.', 'It says background-color there.'),
      L3("background-color deb yozing va Tekshirishni bosing.", 'Впиши background-color и нажми «Проверить».', 'Type background-color and tap Check.')
    ],
    ok: L3("Ajoyib! Endi rang yarim soniyada silliq o'zgaradi.", 'Отлично! Теперь цвет плавно меняется за полсекунды.', 'Great! Now the color changes smoothly in half a second.'),
    ask: L3("Fon rangi silliq o'zgarsin", 'Сделай плавным цвет фона', 'Make the background color smooth')
  },
  s7: {
    eyebrow: L3("Qaysi transition?", 'Какой transition?', 'Which transition?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men hover qoidasini ko'rsataman, siz esa uni silliq qiladigan transition ni tanlang.",
      'Теперь проверь себя. Я покажу правило с hover, а ты выбери transition, который сделает его плавным.',
      'Now check yourself. I’ll show a hover rule, and you pick the transition that makes it smooth.'),
    ask: L3("Qaysi transition bu o'zgarishni silliq qiladi?", 'Какой transition сделает это изменение плавным?', 'Which transition makes this change smooth?'),
    hint1: L3("Hover qoidasida qaysi xususiyat o'zgaryapti?", 'Какое свойство меняется в правиле с hover?', 'Which property changes in the hover rule?'),
    hint2: L3("transition da xuddi o'sha xususiyat nomi turishi kerak. Qiymat emas, nom.", 'В transition должно стоять имя того же свойства. Не значение, а имя.', 'transition must have the same property name. Not the value, the name.'),
    rounds: [
      { hover: '.tugma:hover { transform: rotate(10deg); }', opts: ['color 0.5s', 'transform 0.5s', 'width 0.5s'], want: 'transform 0.5s',
        why: L3("O'zgarayotgani transform, demak transition da ham transform.", 'Меняется transform — значит, и в transition transform.', 'transform is changing, so transition needs transform too.') },
      { hover: '.tugma:hover { color: white; }', opts: ['background-color 1s', 'transform 1s', 'color 1s'], want: 'color 1s',
        why: L3("Matn rangi o'zgaryapti, uning nomi color.", 'Меняется цвет текста, то есть color.', 'The text color, that is color, is changing.') },
      { hover: '.tugma:hover { background-color: gold; }', opts: ['gold 1s', 'background-color 1s', 'transform 1s'], want: 'background-color 1s',
        why: L3("gold bu qiymat. transition qoidasiga xususiyat nomi kerak: background-color.", 'gold — это значение. В transition нужно имя свойства: background-color.', 'gold is a value. transition needs the property name: background-color.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Qaysi xususiyatni silliq qilishni aniq bilasiz.", 'Всё верно! Ты точно знаешь, что делать плавным.', 'All correct! You know exactly what to make smooth.')
  },
  s8: {
    eyebrow: L3("Vaqt va tezlik", 'Время и скорость', 'Time and speed'),
    say: L3("Vaqtni boshqacha ham yozish mumkin, tezlikni ham tanlash mumkin. Keling, ko'ramiz. Hozir yarim soniya.",
      'Время можно записать и по-другому, а ещё можно выбрать скорость. Давай посмотрим. Сейчас полсекунды.',
      'You can write the time another way, and you can pick the speed too. Let’s see. Right now it’s half a second.'),
    sayMs: L3("Besh yuz millisoniya ham xuddi yarim soniya. Millisoniya soniyaning mingdan biri degani. Tugma oldingidek o'zgaryapti.", 'Пятьсот миллисекунд — это те же полсекунды. Миллисекунда — это тысячная доля секунды. Кнопка меняется так же, как раньше.', 'Five hundred milliseconds is the same half a second. A millisecond is a thousandth of a second. The button changes just like before.'),
    sayLinear: L3("Endi tugma ikki soniyada o'ngga suriladi. linear ya'ni tekis degani: tezlik boshidan oxirigacha bir xil. Chiziq ham tekis to'lyapti.", 'Теперь кнопка за две секунды сдвигается вправо. linear — то есть «ровно»: скорость от начала до конца одинаковая. И полоса заполняется ровно.', 'Now the button slides right over two seconds. linear means even: the speed is the same from start to end. The bar fills evenly too.'),
    sayEase: L3("ease esa boshqacha: oldin sekin, o'rtada tez, oxirida yana sekin. Xuddi mashina joyidan qo'zg'alib, keyin to'xtagandek. Hech narsa yozmasangiz, brauzer o'zi ease ni oladi.", 'А ease по-другому: сначала медленно, в середине быстро, в конце опять медленно. Как машина, что трогается и останавливается. Если ничего не написать, браузер сам берёт ease.', 'ease is different: slow at first, fast in the middle, slow again at the end. Like a car starting off and then stopping. If you write nothing, the browser uses ease by itself.'),
    done: L3("Demak, vaqt soniyada yoki millisoniyada yoziladi, tezlikni esa linear yoki ease tanlaydi.", 'Значит, время пишут в секундах или миллисекундах, а скорость выбирают linear или ease.', 'So time is written in seconds or milliseconds, and the speed is chosen with linear or ease.'),
    askStart: L3("Qarang: 0.5s", 'Смотри: 0.5s', 'Watch: 0.5s'),
    askMs: L3("Qarang: 500ms — bu 0.5s", 'Смотри: 500ms — это 0.5s', 'Watch: 500ms is 0.5s'),
    askLinear: L3("Qarang: linear — tekis", 'Смотри: linear — ровно', 'Watch: linear is even'),
    askEase: L3("Qarang: ease — sekin, tez, sekin", 'Смотри: ease — медленно, быстро, медленно', 'Watch: ease is slow, fast, slow'),
    askDone: L3("s va ms · linear va ease", 's и ms · linear и ease', 's and ms · linear and ease')
  },
  s9: {
    eyebrow: L3("Millisoniyada", 'В миллисекундах', 'In milliseconds'),
    say: L3("Endi siz. Tugma bir soniyada o'zgarsin, lekin vaqtni millisoniyada yozing. Bir soniyada nechta millisoniya bor?",
      'Теперь ты. Пусть кнопка меняется за одну секунду, но время напиши в миллисекундах. Сколько миллисекунд в одной секунде?',
      'Your turn. Make the button change in one second, but write the time in milliseconds. How many milliseconds are in a second?'),
    msgs: {
      empty: L3("Vaqtni yozing.", 'Впиши время.', 'Type the time.'),
      unit: L3("Son bor, lekin birlik yo'q. Millisoniya uchun ms yoziladi.", 'Число есть, а единицы нет. Миллисекунды пишут ms.', 'There’s a number but no unit. Milliseconds are written ms.'),
      sec: L3("To'g'ri, bu bir soniya! Lekin vazifa millisoniyada yozish edi.", 'Верно, это одна секунда! Но задание — написать в миллисекундах.', 'Right, that’s one second! But the task is to write it in milliseconds.'),
      bad: L3("Brauzer bu vaqtni tanimadi. Son va ms yozing.", 'Браузер не узнал это время. Напиши число и ms.', 'The browser didn’t recognize that time. Write a number and ms.'),
      other: L3("Bu boshqa vaqt. Bir soniya kerak.", 'Это другое время. Нужна одна секунда.', 'That’s a different time. We need one second.')
    },
    hints: [
      L3("Milli ming degani: soniyada ming millisoniya.", '«Милли» — это тысяча: в секунде тысяча миллисекунд.', 'Milli means thousand: a second has a thousand milliseconds.'),
      L3("Ming soni va ms harflari.", 'Число тысяча и буквы ms.', 'The number one thousand and the letters ms.'),
      L3("Bir, uchta nol va ms deb yozing, keyin Tekshirishni bosing.", 'Впиши единицу, три нуля и ms, потом нажми «Проверить».', 'Type one, three zeros and ms, then tap Check.')
    ],
    ok: L3("Barakalla! Ming millisoniya bu bir soniya.", 'Молодец! Тысяча миллисекунд — это одна секунда.', 'Well done! A thousand milliseconds is one second.'),
    ask: L3("1 soniya millisoniyada", '1 секунда в миллисекундах', '1 second in milliseconds')
  },
  s10: {
    eyebrow: L3("Nimani o'zgartirish kerak?", 'Что поменять?', 'What to change?'),
    say: L3("Endi o'zingizni sinab ko'ring. Tugmada transform ikki soniya turibdi. Men vazifani aytaman, siz esa nimani yozish kerakligini tanlang.",
      'Теперь проверь себя. У кнопки стоит transform две секунды. Я скажу задачу, а ты выбери, что нужно написать.',
      'Now check yourself. The button has transform two seconds. I’ll say a task, and you pick what to write.'),
    ask: L3("Buning uchun nima kerak?", 'Что для этого нужно?', 'What does this need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Vazifa nima haqida: vaqtmi, xususiyatmi yoki tezlikmi?", 'О чём задача: о времени, о свойстве или о скорости?', 'What’s the task about: time, a property or speed?'),
    hint2: L3("Vaqt kamroq bo'lsa, tezroq. linear bilan tezlik bir xil. all bilan hammasi silliq.", 'Меньше время — быстрее. linear — скорость одинаковая. all — плавное всё.', 'Less time is faster. linear keeps the speed the same. all makes everything smooth.'),
    items: [
      { t: L3("Tugma tezroq o'zgarsin.", 'Кнопка должна меняться быстрее.', 'The button should change faster.'), right: '0.2s', why: L3("Vaqt kamroq bo'lsa, o'zgarish tezroq.", 'Чем меньше время, тем быстрее изменение.', 'The less time, the faster the change.') },
      { t: L3("Faqat fon rangi silliq bo'lsin.", 'Плавным должен быть только цвет фона.', 'Only the background color should be smooth.'), right: 'background-color', why: L3("Fon rangi xususiyati background-color deyiladi.", 'Свойство цвета фона — background-color.', 'The background color property is background-color.') },
      { t: L3("Tezlik boshidan oxirigacha bir xil bo'lsin.", 'Скорость должна быть одинаковой от начала до конца.', 'The speed should be the same from start to end.'), right: 'linear', why: L3("linear tekis tezlik beradi.", 'linear — ровная скорость.', 'linear is an even speed.') },
      { t: L3("Hamma o'zgarishlar silliq bo'lsin.", 'Плавными должны быть все изменения.', 'All changes should be smooth.'), right: 'all', why: L3("all ya'ni hammasi degani.", 'all — значит «всё».', 'all means everything.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! transition ni kerakli tomonga sozlay olasiz.", 'Всё верно! Ты умеешь настроить transition как нужно.', 'All correct! You can tune transition just the way you need.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    say: L3("transition da ham xatolar bo'ladi. Keling, uchtasini ko'ramiz. Hozir hammasi to'g'ri: yarim soniya, silliq.",
      'И в transition бывают ошибки. Давай посмотрим на три. Сейчас всё правильно: полсекунды, плавно.',
      'transition has mistakes too. Let’s look at three. Right now everything is correct: half a second, smooth.'),
    sayUnit: L3("Birinchisi: sondan keyin s harfi yo'q. Brauzer qoidani tashlab yubordi, tugma yana sakraydi.", 'Первая: после числа нет буквы s. Браузер выбросил правило, кнопка снова прыгает.', 'The first: there’s no s after the number. The browser threw the rule away, and the button jumps again.'),
    sayComma: L3("Ikkinchisi: nuqta o'rniga vergul. Biz sonlarni vergul bilan yozishga o'rganganmiz, lekin CSS faqat nuqtani tushunadi.", 'Вторая: запятая вместо точки. Мы привыкли писать дроби через запятую, но CSS понимает только точку.', 'The second: a comma instead of a dot. Some of us write decimals with a comma, but CSS only understands a dot.'),
    sayTypo: L3("Uchinchisi ayyorroq: transform so'zida harflar almashib qolgan. Brauzer qoidani xato demaydi, lekin bunday xususiyat yo'q, shuning uchun hech narsa silliq bo'lmaydi.", 'Третья — хитрее: в слове transform переставлены буквы. Браузер не считает правило ошибкой, но такого свойства нет, поэтому плавным не становится ничего.', 'The third is sneakier: letters in the word transform are swapped. The browser doesn’t call the rule a mistake, but there’s no such property, so nothing becomes smooth.'),
    done: L3("Demak, vaqtga s yoki ms kerak, kasr nuqta bilan yoziladi, xususiyat nomi esa harfma-harf to'g'ri bo'lishi kerak.", 'Значит, у времени нужны s или ms, дробь пишут через точку, а имя свойства — буква в букву.', 'So time needs s or ms, decimals use a dot, and the property name must be right letter for letter.'),
    askStart: L3("Qarang: 0.5s — silliq", 'Смотри: 0.5s — плавно', 'Watch: 0.5s is smooth'),
    askUnit: L3("Qarang: s yo'q", 'Смотри: нет s', 'Watch: no s'),
    askComma: L3("Qarang: vergul", 'Смотри: запятая', 'Watch: a comma'),
    askTypo: L3("Qarang: transfrom — xato so'z", 'Смотри: transfrom — опечатка', 'Watch: transfrom is a typo'),
    askDone: L3("s yoki ms · nuqta · to'g'ri nom", 's или ms · точка · верное имя', 's or ms · a dot · the right name')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men tugmani yarim soniyada silliq qilmoqchi edim, lekin u sakrayapti! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я хотел, чтобы кнопка менялась плавно за полсекунды, а она прыгает! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wanted the button to change smoothly in half a second, but it jumps! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing.", 'Впиши значение.', 'Type the value.'),
      comma: L3("Sonda hali vergul turibdi. Uni nuqtaga almashtiring.", 'В числе всё ещё запятая. Замени её на точку.', 'There’s still a comma in the number. Change it to a dot.'),
      unit: L3("Vaqtga s harfi kerak.", 'Времени нужна буква s.', 'The time needs the letter s.'),
      typo: L3("Xususiyat nomi buzildi. transform deb yozing.", 'Имя свойства сломалось. Напиши transform.', 'The property name broke. Write transform.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Xususiyat va vaqtni tekshiring.", 'Браузер не узнал это значение. Проверь свойство и время.', 'The browser didn’t recognize that value. Check the property and the time.'),
      other: L3("Bu boshqa qiymat. Faqat vergulni nuqtaga almashtiring.", 'Это другое значение. Просто замени запятую на точку.', 'That’s a different value. Just change the comma to a dot.')
    },
    hints: [
      L3("Sonning o'rtasiga qarang.", 'Посмотри на середину числа.', 'Look at the middle of the number.'),
      L3("CSS da kasr vergul bilan emas, nuqta bilan yoziladi.", 'В CSS дробь пишут не через запятую, а через точку.', 'In CSS decimals use a dot, not a comma.'),
      L3("transform, bo'sh joy, nol, nuqta, besh va s deb yozing, keyin Tekshirishni bosing.", 'Впиши transform, пробел, ноль, точка, пять и s, потом нажми «Проверить».', 'Type transform, space, zero, dot, five and s, then tap Check.')
    ],
    ok: L3("Ura, ishladi! Tugma yana silliq.", 'Ура, заработало! Кнопка снова плавная.', 'Hooray, it works! The button is smooth again.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga va chiziqqa qarang, keyin o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и на полосу, потом нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and the bar, then tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      unit: L3("Topdingiz! Vaqtda s harfi yo'q edi.", 'Есть! У времени не было буквы s.', 'Found it! The time had no s.'),
      typo: L3("Topdingiz! transform so'zida harflar almashgan edi.", 'Есть! В слове transform были переставлены буквы.', 'Found it! The letters in transform were swapped.')
    },
    hint1: L3("Chiziqqa qarang: tugma silliq o'zgaryaptimi?", 'Посмотри на полосу: кнопка меняется плавно?', 'Look at the bar: does the button change smoothly?'),
    hint2: {
      unit: L3("Chiziqda nol soniya. transition qatoridagi vaqtni tekshiring.", 'На полосе ноль секунд. Проверь время в строке transition.', 'The bar shows zero seconds. Check the time in the transition line.'),
      typo: L3("Chiziqda nol soniya. transition qatoridagi xususiyat nomini tekshiring.", 'На полосе ноль секунд. Проверь имя свойства в строке transition.', 'The bar shows zero seconds. Check the property name in the transition line.')
    },
    hint3: {
      unit: L3("Xato ikkinchi qoidada: vaqtda s yo'q. O'sha qatorni bosing.", 'Ошибка во втором правиле: у времени нет s. Нажми эту строку.', 'The bug is in the second rule: the time has no s. Tap that line.'),
      typo: L3("Xato uchinchi qoidada: transfrom. O'sha qatorni bosing.", 'Ошибка в третьем правиле: transfrom. Нажми эту строку.', 'The bug is in the third rule: transfrom. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz silliq effektlarni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь плавные эффекты как настоящий разработчик.', 'Super! Both found. You check smooth effects like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Hover qoidasi tayyor. Tugmaning o'zi uchun qoida yozing: transform nol butun o'ndan uch soniyada silliq o'zgarsin.",
      'Теперь напиши правило целиком. Правило с hover уже готово. Напиши правило для самой кнопки: пусть transform меняется плавно за ноль целых три десятых секунды.',
      'Now write the whole rule yourself. The hover rule is ready. Write a rule for the button itself: make transform change smoothly in zero point three seconds.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor, keyin figurali qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat o'rtasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      hoverSel: L3("transition ni tugmaning o'z qoidasiga yozamiz, hover siz. Nega bunday, dars oxirida ko'rasiz.", 'transition пишем в правило самой кнопки, без hover. Почему так — увидишь в конце урока.', 'We put transition in the button’s own rule, without hover. You’ll see why at the end of the lesson.'),
      sel: L3("Selektor: nuqta va tugma klassi.", 'Селектор: точка и класс кнопки.', 'The selector: a dot and the button’s class.'),
      prop: L3("Silliq o'tishni transition xususiyati beradi.", 'Плавный переход задаёт свойство transition.', 'The transition property makes the change smooth.'),
      comma: L3("Sonda vergul bor. Kasr nuqta bilan yoziladi.", 'В числе запятая. Дробь пишут через точку.', 'There’s a comma in the number. Decimals use a dot.'),
      typo: L3("Xususiyat nomini tekshiring: transform.", 'Проверь имя свойства: transform.', 'Check the property name: transform.'),
      which: L3("Hover da transform o'zgaradi, demak transition da ham transform.", 'Под hover меняется transform, значит, и в transition — transform.', 'transform changes on hover, so transition needs transform too.'),
      unit: L3("Vaqtga s harfi kerak.", 'Времени нужна буква s.', 'The time needs the letter s.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Xususiyat va vaqtni tekshiring.", 'Браузер не узнал это значение. Проверь свойство и время.', 'The browser didn’t recognize that value. Check the property and the time.'),
      other: L3("Vaqt boshqa. Nol butun o'ndan uch soniya kerak.", 'Время другое. Нужно ноль целых три десятых секунды.', 'The time is different. We need zero point three seconds.')
    },
    hints: [
      L3("Selektor tugma klassi, xususiyat transition, qiymat esa transform va vaqt.", 'Селектор — класс кнопки, свойство — transition, значение — transform и время.', 'The selector is the button’s class, the property is transition, the value is transform and the time.'),
      L3("Selektor nuqta tugma, qiymat transform, bo'sh joy, nol nuqta uch s.", 'Селектор: точка tugma, значение: transform, пробел, ноль точка три s.', 'Selector: dot tugma; value: transform, space, zero point three s.'),
      L3("Shunday yozing: nuqta tugma, figurali qavs, transition ikki nuqta transform, nol nuqta uch s, nuqtali vergul, yopuvchi qavs.", 'Напиши так: точка tugma, фигурная скобка, transition двоеточие transform, ноль точка три s, точка с запятой, закрывающая скобка.', 'Write it like this: dot tugma, curly brace, transition colon transform, zero point three s, semicolon, closing brace.')
    ],
    ok: L3("Ajoyib! Tugma endi silliq o'sadi va silliq qaytadi. Qoidani o'zingiz yozdingiz.", 'Отлично! Кнопка плавно растёт и плавно возвращается. Правило написано тобой целиком.', 'Great! The button grows and goes back smoothly. You wrote the whole rule yourself.'),
    ask: L3("transform 0.3s da silliq bo'lsin", 'Сделай transform плавным за 0.3s', 'Make transform smooth in 0.3s')
  },
  s14: {
    eyebrow: L3("O'z tugmangiz", 'Своя кнопка', 'Your own button'),
    say: L3("Endi o'z tugmangizni yarating. Sichqoncha ustida nima o'zgarishini, qancha vaqt davom etishini va tezlikni o'zingiz tanlang. Keyin «Tayyor»ni bosing.",
      'Теперь сделай свою кнопку. Сам выбери, что меняется под мышкой, сколько это длится и какая скорость. Потом нажми «Готово».',
      'Now make your own button. Choose what changes under the mouse, how long it takes and the speed. Then tap “Done”.'),
    msgs: {
      tf: L3("Brauzer {w} qiymatini tanimadi. Masalan, scale, rotate yoki translate yozing.", 'Браузер не узнал значение {w}. Впиши, например, scale, rotate или translate.', 'The browser didn’t recognize {w}. Type, for example, scale, rotate or translate.'),
      comma: L3("Vaqtda vergul bor. Kasr nuqta bilan yoziladi.", 'Во времени запятая. Дробь пишут через точку.', 'There’s a comma in the time. Decimals use a dot.'),
      unit: L3("Vaqtga s yoki ms kerak.", 'Времени нужны s или ms.', 'The time needs s or ms.'),
      time: L3("Brauzer {w} vaqtini tanimadi. Son va s yoki ms yozing.", 'Браузер не узнал время {w}. Напиши число и s или ms.', 'The browser didn’t recognize the time {w}. Write a number and s or ms.'),
      zero: L3("Nol soniyada o'zgarish birdaniga bo'ladi. Noldan katta vaqt yozing.", 'За ноль секунд изменение будет сразу. Напиши время больше нуля.', 'With zero seconds the change is instant. Write a time greater than zero.'),
      long: L3("Bu juda uzoq: tugmani kutib charchab qolasiz. Besh soniyadan kam yozing.", 'Это слишком долго: устанешь ждать кнопку. Напиши меньше пяти секунд.', 'That’s too long: you’d get tired waiting for the button. Write less than five seconds.'),
      fn: L3("Brauzer {w} tezligini tanimadi. linear yoki ease yozing.", 'Браузер не узнал скорость {w}. Впиши linear или ease.', 'The browser didn’t recognize the speed {w}. Type linear or ease.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Birinchisiga scale, rotate yoki translate, ikkinchisiga vaqt, uchinchisiga linear yoki ease.", 'В первое — scale, rotate или translate, во второе — время, в третье — linear или ease.', 'In the first, scale, rotate or translate; in the second, a time; in the third, linear or ease.'),
      L3("Masalan: scale bir butun o'ndan uch, nol butun o'ndan to'rt soniya va ease. Keyin «Tayyor»ni bosing.", 'Например: scale одна целая три десятых, ноль целых четыре десятых секунды и ease. Потом нажми «Готово».', 'For example: scale one point three, zero point four seconds and ease. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday silliq! Bu sizning o'z tugmangiz.", 'Ого, как плавно! Это твоя собственная кнопка.', 'Wow, how smooth! This is your very own button.'),
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
    hint1: L3("Gap nima haqida: vaqt, yozilish yoki qoidaning joyi?", 'О чём фраза: о времени, о записи или о месте правила?', 'What’s the sentence about: time, spelling or where the rule goes?'),
    hint2: L3("Esingizdami: transition silliq qiladi, ming millisoniya bir soniya, kasr nuqta bilan yoziladi.", 'Вспомни: transition делает плавно, тысяча миллисекунд — одна секунда, дробь пишут через точку.', 'Remember: transition makes things smooth, a thousand milliseconds is one second, and decimals use a dot.'),
    items: [
      { t: L3("transition o'zgarishni silliq qiladi.", 'transition делает изменение плавным.', 'transition makes a change smooth.'), right: true,
        why: L3("To'g'ri: transition silliq o'tish degani.", 'Верно: transition — это плавный переход.', 'Right: transition means a smooth change.') },
      { t: L3("Besh yuz millisoniya va yarim soniya bir xil vaqt.", 'Пятьсот миллисекунд и полсекунды — одно и то же время.', 'Five hundred milliseconds and half a second are the same time.'), right: true,
        why: L3("To'g'ri: soniyada ming millisoniya.", 'Верно: в секунде тысяча миллисекунд.', 'Right: a second has a thousand milliseconds.') },
      { t: L3("Bu qoida ishlaydi.", 'Это правило сработает.', 'This rule works.'), right: false, code: 'comma',
        why: L3("Aslida vergul tufayli brauzer qoidani tashlab yuboradi.", 'На самом деле из-за запятой браузер выбросит правило.', 'Actually the browser throws the rule away because of the comma.') },
      { t: L3("Bunday yozilsa, tugma ikki tomonga ham silliq o'zgaradi.", 'Если написать так, кнопка будет плавной в обе стороны.', 'Written like this, the button is smooth both ways.'), right: false, code: 'inHover',
        why: L3("Aslida tugma faqat bir tomonga silliq bo'ladi. Nega, hozir ko'ramiz.", 'На самом деле плавно будет только в одну сторону. Почему — сейчас увидим.', 'Actually it’s smooth only one way. We’ll see why in a moment.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz transition ni yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь transition.', 'All correct! You know transition really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men transition ni hover qoidasining ichiga yozgan edim? Qarang: tugma silliq o'sadi, lekin sichqoncha ketganda birdaniga sakrab qaytadi! Men adashibman. Sichqoncha ketishi bilan hover qoidasi o'chadi, u bilan birga transition ham ketadi.",
        'Вернёмся к загадке. Помнишь, я написал transition внутри правила с hover? Смотри: кнопка плавно растёт, а когда мышка уходит, прыгает обратно сразу! Я ошибся. Как только мышка уходит, правило с hover выключается, и transition уходит вместе с ним.',
        'Back to our riddle. Remember, I put transition inside the hover rule? Look: the button grows smoothly, but when the mouse leaves, it jumps back at once! I was wrong. As soon as the mouse leaves, the hover rule switches off, and transition goes with it.'), k: 'riddle' },
      { text: L3("transition ni tugmaning o'z qoidasiga ko'chirsak, u doim turadi. Endi ikki tomonga ham silliq. Mana!", 'Перенесём transition в правило самой кнопки — оно действует всегда. Теперь плавно в обе стороны. Вот!', 'Move transition into the button’s own rule, and it’s always there. Now it’s smooth both ways. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning silliq tugmangiz!", 'Смотри, это твоя плавная кнопка!', 'Look, this is your smooth button!'), k: 'own' },
      { text: L3("transition o'zgarishni silliq qiladi.", 'transition делает изменение плавным.', 'transition makes a change smooth.'), k: 'tr' },
      { text: L3("Vaqt soniyada yoki millisoniyada yoziladi.", 'Время пишут в секундах или миллисекундах.', 'Time is written in seconds or milliseconds.'), k: 'time' },
      { text: L3("Qaysi xususiyat yozilsa, o'shasi silliq bo'ladi, all esa hammasini silliq qiladi.", 'Плавным становится написанное свойство, а all делает плавным всё.', 'The property you write becomes smooth, and all makes everything smooth.'), k: 'prop' },
      { text: L3("transition esa hover qoidasiga emas, tugmaning o'z qoidasiga yoziladi.", 'А transition пишут не в правило с hover, а в правило самой кнопки.', 'And transition goes in the button’s own rule, not in the hover rule.'), k: 'place' },
      { text: L3("Tabriklayman! Endi tugmalaringiz silliq. Keyingi darsda yanada qiziqroq narsa bor: sahifadagi narsalar sichqonchasiz, o'zi harakatlanadi. Bu animatsiya deyiladi. Ko'rishguncha!",
        'Ура! Теперь твои кнопки плавные. На следующем уроке ещё интереснее: вещи на странице будут двигаться сами, без мышки. Это называется анимация. До встречи!',
        'Hooray! Now your buttons are smooth. Next lesson is even more fun: things on the page will move by themselves, without the mouse. That’s called animation. See you!') }
    ],
    roles: {
      tr: L3("transition — silliq o'tish", 'transition — плавный переход', 'transition — a smooth change'),
      time: L3("vaqt: s yoki ms", 'время: s или ms', 'time: s or ms'),
      prop: L3("qaysi xususiyat yoki all", 'какое свойство или all', 'which property, or all'),
      place: L3("tugmaning o'z qoidasida", 'в правиле самой кнопки', 'in the button’s own rule')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayJump: 1, saySlow: 1, sayFast: 1,
  sayTf: 1, sayBg: 1, sayAll: 1, sayMs: 1, sayLinear: 1, sayEase: 1, sayUnit: 1, sayComma: 1, sayTypo: 1, miss: 1, say2: 1, fine: 1, found: 1,
  items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1 }, rounds: { want: 1, opts: 1, hover: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c14-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c14.css@*/
`;
