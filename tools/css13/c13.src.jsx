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
    say: L3("Salom! O'yinimga «O'ynash» tugmasini qo'ydim, lekin u devordagi rasmga o'xshab qoldi: sichqonchani ustiga olib borsangiz ham, qimir etmaydi. Haqiqiy saytlarda esa tugmalar jonlanadi-ku! Qani, «Aylantirish» tugmasini bosing.",
      'Привет! Я поставил в игру кнопку «Играть». Но она как картинка: наведёшь мышку — ничего не происходит. А на настоящих сайтах кнопка оживает! Нажми «Превратить».',
      'Hi! I put a Play button in my game. But it’s like a picture: point the mouse at it and nothing happens. On real sites a button comes alive! Tap “Transform”.'),
    magic: L3("Voy, qarang! Sichqoncha ustiga kelishi bilan tugma to'q sariq rangga kirdi-yu, biroz kattalashdi. Ko'rsatkich esa qo'lga aylanib qoldi!", 'Вот! Когда мышка над кнопкой, она становится оранжевой и немного увеличивается. А указатель превращается в руку.', 'There! When the mouse is over the button, it turns orange and grows a little. And the pointer turns into a hand.'),
    magicP: L3("Buni uchta narsa qildi. Biri hover, u «sichqoncha ustida» degani: shuning uchun qoida faqat sichqoncha kelganda ishladi. Tugmani transform kattalashtirdi, ko'rsatkichni esa cursor qo'lga aylantirdi. Telefonda sichqoncha yo'q-ku, u yerda tugma barmoq tekkanda jonlanadi.", 'Это сделали hover, то есть «мышка над элементом», transform, то есть преобразование, и cursor, то есть указатель. А на телефоне так бывает при касании кнопки.', 'hover did it, meaning the mouse is over the element, plus transform, meaning a change of shape, and cursor, meaning the pointer. On a phone it happens when you tap the button.'),
    done: L3("Bugun siz ham tugmalarni shunday jonlantirishni o'rganasiz. Kecha eski papkamdan bir kod topib oldim: unda tugma bilan hover o'rtasida bitta bo'sh joy turibdi. Menimcha, bo'sh joy hech narsani buzmaydi, aksincha, kod chiroyliroq ko'rinadi. Siz nima deysiz, shu kod bilan tugma jonlanadimi? Dars oxirida o'sha eski kodni ishga tushirib ko'ramiz.",
      'Сегодня ты научишься оживлять кнопки. Но сначала загадка. В первый раз я поставил пробел между кнопкой и hover, чтобы было красивее. По-моему, пробел ничего не меняет. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to bring buttons to life. But first, a riddle. The first time, I put a space between the button and hover to make it look nicer. I think a space changes nothing. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3(":hover · transform · cursor", ':hover · transform · cursor', ':hover · transform · cursor')
  },
  s2: {
    eyebrow: L3(":hover", ':hover', ':hover'),
    help: [
      L3("Tugmaga, keyin Inspektordagi hover belgisiga bir qarang-chi: tugma faqat sichqoncha ustiga kelgandagina o'zgaryapti.", 'Посмотри на кнопку и на метку hover в Инспекторе: кнопка меняется только тогда, когда мышка над ней.', 'Look at the button and the hover tag in the Inspector: the button changes only when the mouse is over it.'),
      L3("Nega shunday? Chunki selektordan keyin hover yozilsa, qoida faqat sichqoncha element ustida turganda ishlaydi. Telefonda esa barmoq tekkanda ishlaydi.", 'Если после селектора написать hover, правило работает только когда мышка над элементом. А на телефоне — при касании.', 'If you write hover after the selector, the rule works only while the mouse is over the element. On a phone, when you tap.'),
      L3("Kompyuter o'yinlarida sichqonchani tugmaga olib borsangiz, tugma yorishib ketadi, xuddi sizni o'yinga chaqirayotgandek. hover ham aynan shu ishni qiladi.", 'В играх кнопка подсвечивается, когда наводишь на неё мышку. Это и есть hover: кнопка будто говорит «нажми меня».', 'In games a button lights up when you point the mouse at it. That’s hover: the button seems to say “press me”.')
    ],
    say: L3("Endi hover bilan yaqinroq tanishamiz. Selektordan keyin ikki nuqta qo'yib, hover deb yozsak, qoida doim emas, faqat sichqoncha element ustida turganda ishlaydi. Qani, tugmada sinab ko'ramiz.",
      'Если после селектора написать двоеточие и hover, правило работает, только когда мышка над элементом. Давай посмотрим.',
      'If you write a colon and hover after the selector, the rule only works while the mouse is over the element. Let’s see.'),
    sayRule: L3("Mana, qoida yozildi: hover paytida fon to'q sariq bo'lsin. Lekin qarang-chi, tugma o'zgarmadi! Chunki sichqoncha hali uning ustiga kelgani yo'q.", 'Правило готово: при hover фон оранжевый. Но смотри, кнопка не изменилась, ведь мышка пока не над ней.', 'The rule is ready: on hover the background is orange. But look, the button didn’t change, because the mouse isn’t over it yet.'),
    sayHover: L3("Endi sichqonchani tugma ustiga olib boramiz. Ana, fon darrov to'q sariq bo'ldi! Inspektor ham buni hover belgisi bilan ko'rsatib turibdi.", 'Теперь представь, что мышка навелась на кнопку. Вот, фон стал оранжевым! Инспектор показывает это меткой hover.', 'Now imagine the mouse moved over the button. There, the background turned orange! The Inspector shows it with a hover tag.'),
    sayColor: L3("Yana bitta qoida qo'shamiz: hover paytida matn oq bo'lsin. Ko'rdingizmi, hover uchun qoidalarni xohlagancha yozish mumkin.", 'Ещё одно правило: при hover текст белый. Правил может быть сколько угодно.', 'One more rule: on hover the text is white. You can have as many rules as you like.'),
    done: L3("Demak, hover qoidasi doim ishlamaydi: kompyuterda sichqoncha element ustiga kelganda, telefonda esa barmoq tekkanda ishga tushadi.", 'Значит, правило с hover работает не всегда, а только когда мышка над элементом. А на телефоне — при касании.', 'So a hover rule doesn’t work all the time, only while the mouse is over the element. On a phone, when you tap.'),
    askStart: L3("Qarang: oddiy tugma", 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askRule: L3("Qarang: qoida bor, sichqoncha yo'q", 'Смотри: правило есть, мышки нет', 'Watch: a rule, but no mouse'),
    askHover: L3("Qarang: sichqoncha ustida", 'Смотри: мышка над кнопкой', 'Watch: the mouse is over it'),
    askColor: L3("Qarang: yana bir qoida", 'Смотри: ещё одно правило', 'Watch: one more rule'),
    askDone: L3(":hover — sichqoncha ustida", ':hover — когда мышка над элементом', ':hover is when the mouse is over it')
  },
  s3: {
    eyebrow: L3("Ustida — oltin", 'Под мышкой — золотая', 'Gold on hover'),
    say: L3("Endi navbat sizga! Sichqoncha ustiga kelganda tugma oltin rangga kirsin: hover qoidasiga shu rangni yozing. Keyin sichqonchani tugmaga olib borib ko'ring, telefonda esa ustiga bir bosing.", "Теперь твоя очередь. Пусть под мышкой кнопка становится золотой — впиши этот цвет в правило с hover. Потом наведи мышку на кнопку, а на телефоне — коснись её.", "Now it’s your turn. Make the button turn gold on hover: type that color into the hover rule. Then point the mouse at the button, or tap it on a phone."),
    msgs: {
      empty: L3("Maydon hali bo'sh-ku. Bu yerga rangning nomi kerak.", 'Впиши цвет.', 'Type a color.'),
      bad: L3("Brauzer bunday rangni bilmas ekan. Rangning nomini inglizcha yozib ko'ring.", 'Браузер не узнал этот цвет. Напиши название цвета по-английски.', 'The browser didn’t recognize that color. Write the color name in English.'),
      other: L3("Bu ham chiroyli rang, lekin bizga oltin rang kerak. U inglizcha gold deyiladi.", 'Это другой цвет. Золотой называется gold.', 'That’s a different color. Gold is called gold.')
    },
    hints: [
      L3("Oltin rang inglizcha qanday bo'ladi, esingizdami?", 'Как по-английски «золотой»?', 'What’s the English for gold?'),
      L3("Oltin rang inglizchada gold bo'ladi.", 'Золотой — gold.', 'It’s gold.'),
      L3("Maydonga gold deb yozing-da, «Tekshirish»ni bosing.", 'Впиши gold и нажми «Проверить».', 'Type gold and tap Check.')
    ],
    ok: L3("Zo'r! Endi sichqoncha ustiga kelishi bilan tugma oltin rangga kiradi.", 'Огонь! Теперь под мышкой кнопка золотая.', 'Awesome! Now the button turns gold under the mouse.'),
    ask: L3("Ustida bo'lganda tugma gold bo'lsin", 'Сделай кнопку золотой при hover', 'Make the button gold on hover')
  },
  s4: {
    eyebrow: L3("Doim yoki ustida?", 'Всегда или под мышкой?', 'Always or on hover?'),
    say: L3("Endi qoidalarni ikkiga ajratamiz: biri doim ishlaydi, boshqasi faqat sichqoncha ustida. Har bir qoidani o'qing-da, qaysi turga kirishini tanlang.",
      'Теперь проверь себя. Я покажу правило, а ты выбери: оно работает всегда или только под мышкой?',
      'Now check yourself. I’ll show a rule, and you pick: does it work all the time or only on hover?'),
    ask: L3("Bu qoida qachon ishlaydi?", 'Когда работает это правило?', 'When does this rule work?'),
    opts: {
      always: L3("Doim", 'Всегда', 'Always'),
      hover: L3("Faqat ustida", 'Только под мышкой', 'Only on hover')
    },
    hint1: L3("Selektorning oxiriga qarang-chi: u yerda hover bormi?", 'Посмотри на селектор: есть ли в конце hover?', 'Look at the selector: is there hover at the end?'),
    hint2: L3("hover bor bo'lsa, qoida faqat sichqoncha ustida ishlaydi, yo'q bo'lsa, doim ishlaydi.", 'Есть hover — только под мышкой; нет — всегда.', 'With hover, only under the mouse; without it, always.'),
    items: [
      { code: '.tugma { color: white; }', right: 'always', why: L3("Bu selektorda hover yo'q, shuning uchun matn doim oq bo'lib turadi.", 'hover нет: текст белый всегда.', 'No hover: the text is always white.') },
      { code: '.tugma:hover { color: white; }', right: 'hover', why: L3("Selektor oxirida hover turibdi: matn faqat sichqoncha ustida oqaradi.", 'hover есть: только под мышкой.', 'There’s hover: only under the mouse.') },
      { code: 'a:hover { color: red; }', right: 'hover', why: L3("Havolaning selektorida ham hover bor, shuning uchun u faqat sichqoncha ustida qizarib ketadi.", 'Ссылка становится красной только под мышкой.', 'The link turns red only under the mouse.') },
      { code: 'h1 { color: orange; }', right: 'always', why: L3("h1 selektorida hover yo'q, shuning uchun sarlavha doim to'q sariq rangda turadi.", 'hover нет: заголовок оранжевый всегда.', 'No hover: the heading is always orange.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("To'rttasini ham to'g'ri ajratdingiz! Endi hover qoidasini birinchi qarashdayoq taniysiz.", 'Всё верно! Ты сразу узнаёшь правило с hover.', 'All correct! You spot a hover rule right away.')
  },
  s5: {
    eyebrow: L3("transform", 'transform', 'transform'),
    help: [
      L3("Tugmani kuzatib turing: u oldin kattalashadi, keyin buriladi, keyin suriladi. Pastdagi abzas esa shu payt joyidan qimirlamaydi.", 'Посмотри на кнопку: она увеличивается, поворачивается и сдвигается. А абзац под ней не двигается.', 'Look at the button: it grows, turns and moves. The paragraph below it doesn’t move.'),
      L3("Buni transform qiladi: scale elementni kattalashtiradi, rotate buradi, translate suradi. Qo'shnilar esa bundan bexabar, o'z joyida qolaveradi.", 'transform меняет элемент: scale увеличивает, rotate поворачивает, translate сдвигает. А соседи остаются на месте.', 'transform changes an element: scale makes it bigger, rotate turns it, translate moves it. The neighbors stay in place.'),
      L3("Telefonda rasmni ikki barmoq bilan kattalashtirib yoki burib ko'rganmisiz? Rasm o'zgaradi, atrofidagi tugmalar esa joyida qoladi. transform ham elementni xuddi shunday o'zgartiradi.", 'Когда на телефоне увеличиваешь или поворачиваешь фото двумя пальцами, всё вокруг остаётся на месте. transform работает так же.', 'When you zoom or turn a photo on a phone with two fingers, everything around it stays put. transform works the same way.')
    ],
    say: L3("Endi eng qiziq xususiyatlardan biri bilan tanishamiz: transform, inglizchada «o'zgartirish» degani. U elementni kattalashtira oladi, bura oladi, hatto sura ham oladi. Qanchaga kattalashtirish yoki burishni esa qavs ichiga yozamiz. Qani, tugmani kuzatib turing!",
      'Теперь transform, то есть преобразование. Он увеличивает элемент, поворачивает или сдвигает. В скобках пишем, насколько.',
      'Now transform, meaning a change of shape. It makes an element bigger, turns it or moves it. In the brackets we write how much.'),
    sayScale: L3("Oldin scale bir yarim yozamiz. Ana, tugma bir yarim barobar kattalashib ketdi! Qarang-chi, pastdagi abzas esa joyidan jilmadi.", 'scale полтора: кнопка стала в полтора раза больше. Смотри, абзац под ней не сдвинулся.', 'scale one and a half: the button got one and a half times bigger. Look, the paragraph below didn’t move.'),
    sayRotate: L3("Endi rotate o'n besh deg qo'yamiz. deg so'zi gradusni bildiradi. Ko'rdingizmi? Tugma o'n besh gradusga burilib, qiyshayib qoldi.", 'rotate пятнадцать deg: кнопка повернулась на пятнадцать градусов. deg — то есть градусы.', 'rotate fifteen deg: the button turned fifteen degrees. deg means degrees.'),
    sayTranslate: L3("Oxirida translate qirq va o'n piksel yozamiz. Birinchi son tugmani o'ngga, ikkinchisi pastga suradi, ularning o'rtasida esa vergul turadi. Ana, tugma o'ngga qirq, pastga o'n piksel surildi. Qo'shnilar-chi? Ular yana o'sha joyida!", "translate сорок и десять пикселей: первое число двигает вправо, второе — вниз. Кнопка уехала вправо на сорок и вниз на десять. Между числами запятая. А соседи опять на месте.", "translate forty and ten pixels: the first number moves right, the second moves down. The button moved forty right and ten down. There’s a comma between the numbers. The neighbours stayed in place again."),
    done: L3("Shunday qilib, transform elementni kattalashtiradi, buradi yoki suradi, qo'shnilarga esa tegmaydi.", 'Значит, transform увеличивает, поворачивает или сдвигает элемент, а соседи остаются на месте.', 'So transform scales, turns or moves an element, and the neighbours stay in place.'),
    askStart: L3("Qarang: oddiy tugma", 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askScale: L3("Qarang: scale — kattalashtirish", 'Смотри: scale — увеличение', 'Watch: scale makes it bigger'),
    askRotate: L3("Qarang: rotate — burish", 'Смотри: rotate — поворот', 'Watch: rotate turns it'),
    askTranslate: L3("Qarang: translate — surish", 'Смотри: translate — сдвиг', 'Watch: translate moves it'),
    askDone: L3("scale · rotate · translate", 'scale · rotate · translate', 'scale · rotate · translate')
  },
  s6: {
    eyebrow: L3("Ikki barobar", 'Вдвое больше', 'Twice as big'),
    say: L3("Tugmani endi o'zingiz kattalashtiring: u ikki barobar katta bo'lsin. Buning uchun scale qavslari ichiga kerakli sonni yozing.",
      'Теперь ты. Пусть кнопка станет вдвое больше: впиши число в скобки scale.',
      'Your turn. Make the button twice as big: type the number inside scale’s brackets.'),
    msgs: {
      empty: L3("Qavs ichi hali bo'sh turibdi. Bu yerga bitta son kerak.", 'Впиши число.', 'Type a number.'),
      unit: L3("scale uchun px kerak emas: u faqat necha barobar kattalashtirishni so'raydi, shuning uchun sonning o'zi yetadi.", 'Для scale px не нужен: только число — во сколько раз.', 'scale needs no px: just a number, how many times.'),
      bad: L3("Brauzer bu qiymatni tushunmadi. Qavs ichiga harfsiz, faqat son yozing.", 'Браузер не узнал это значение. Напиши в скобках только число.', 'The browser didn’t recognize that value. Write just a number in the brackets.'),
      zero: L3("Nol bilan tugma butunlay g'oyib bo'ldi-ku! Bizga ikki barobar kattasi kerak.", 'С нулём кнопка совсем пропала. Нужно вдвое.', 'With zero the button vanished. We need twice as big.'),
      one: L3("Bir bilan tugma o'z o'lchamida qoldi. Uni ikki barobar kattalashtirish kerak.", 'С единицей кнопка не изменилась. Нужно вдвое.', 'With one the button didn’t change. We need twice as big.'),
      other: L3("Tugma o'zgardi, lekin boshqa o'lchamga. Bizga aynan ikki barobar kerak.", 'Это другой размер. Нужно вдвое.', 'That’s a different size. We need twice as big.'),
      comma: L3("CSS kodida kasr son vergul bilan emas, nuqta bilan yoziladi. Lekin bu yerga kasr emas, butun son kerak: tugma necha barobar kattalashsin?", "Дробь в CSS пишут через точку, а не через запятую. А здесь нужно целое число — во сколько раз.", "In CSS a decimal uses a dot, not a comma. And here you need a whole number: how many times.")
    },
    hints: [
      L3("scale ichidagi son tugmani necha barobar kattalashtirishni aytadi.", 'Число в scale говорит, во сколько раз.', 'The number in scale says how many times.'),
      L3("Tugma necha barobar kattalashishi kerak bo'lsa, qavs ichiga aynan o'sha sonni yozing.", 'Вдвое — это два.', 'Twice is two.'),
      L3("Qavs ichiga ikki sonini yozing-da, «Tekshirish»ni bosing.", 'Впиши число два и нажми «Проверить».', 'Type the number two and tap Check.')
    ],
    ok: L3("Barakalla! Tugma roppa-rosa ikki barobar kattalashdi.", 'Молодец! Кнопка вдвое больше.', 'Well done! The button is twice as big.'),
    ask: L3("Tugmani ikki barobar kattalashtiring", 'Увеличь кнопку вдвое', 'Make the button twice as big')
  },
  s7: {
    eyebrow: L3("Qaysi transform?", 'Какой transform?', 'Which transform?'),
    say: L3("Men tugmamni uch marta har xil o'zgartirdim. Har safar tugmaga qarang-da, uni qaysi transform shunday qilganini toping.",
      'Теперь проверь себя. Посмотри на кнопку и выбери, какой transform сделал её такой.',
      'Now check yourself. Look at the button and pick which transform made it look like that.'),
    ask: L3("Tugmani qaysi transform shunday qildi?", 'Какой transform сделал кнопку такой?', 'Which transform made the button like this?'),
    hint1: L3("Tugmaga yaxshilab qarang-chi: u kattalashganmi, burilganmi yoki surilganmi?", 'Кнопка увеличилась, повернулась или сдвинулась?', 'Did the button grow, turn or move?'),
    hint2: L3("scale kattalashtiradi yoki kichraytiradi, rotate buradi, translate esa suradi: birinchi soni o'ngga, ikkinchisi pastga.", "scale увеличивает или уменьшает, rotate поворачивает, translate сдвигает: первое число — вправо, второе — вниз.", "scale makes it bigger or smaller, rotate turns it, translate moves it: the first number right, the second down."),
    rounds: [
      { want: 'rotate(20deg)', opts: ['scale(1.5)', 'rotate(20deg)', 'translate(40px, 0px)'],
        why: L3("Tugma bir tomonga qiyshayib turibdi, buni rotate qilgan.", 'Кнопка наклонена: rotate.', 'The button is tilted: rotate.') },
      { want: 'scale(1.5)', opts: ['scale(0.5)', 'scale(1.5)', 'translate(0px, 20px)'],
        why: L3("Tugma odatdagidan kattaroq bo'lib qolgan: bu scale bir yarim ishi.", 'Кнопка больше: scale полтора.', 'The button is bigger: scale one and a half.') },
      { want: 'translate(60px, 0px)', opts: ['rotate(20deg)', 'translate(60px, 0px)', 'translate(0px, 30px)'],
        why: L3("Tugma joyidan o'ngga surilib ketgan, uni translate oltmish va nol olib borgan.", 'Кнопка сдвинута вправо: translate шестьдесят и ноль.', 'The button moved right: translate sixty and zero.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala tugmaning ham sirini ochdingiz! Endi transform qiymatini tugmaning o'ziga qarab bilib olasiz.", 'Всё верно! Ты читаешь transform с одного взгляда.', 'All correct! You read transform at a glance.')
  },
  s8: {
    eyebrow: L3("hover va transform", 'hover и transform', 'hover and transform'),
    help: [
      L3("Tugma bilan ko'rsatkichni birga kuzatib turing: sichqoncha kelganda tugma kattalashadi, ko'rsatkich esa qo'lga aylanadi.", 'Посмотри на кнопку и указатель: когда приходит мышка, кнопка растёт, а указатель становится рукой.', 'Look at the button and the pointer: when the mouse arrives, the button grows and the pointer turns into a hand.'),
      L3("Bu yerda hover bilan transform birga ishlayapti: tugma faqat sichqoncha ustida kattalashadi. cursor pointer esa ko'rsatkichni qo'lga aylantirib, «Buni bosish mumkin», deb aytadi.", 'hover и transform вместе оживляют кнопку. А cursor pointer превращает указатель в руку и показывает, что на это можно нажать.', 'hover and transform together bring the button to life. cursor pointer turns the pointer into a hand and shows it can be pressed.'),
      L3("Istalgan saytda havolaga sichqoncha olib borib ko'ring: strelka o'rniga qo'l paydo bo'ladi. Ana shu qo'lni cursor pointer chiqaradi. Hamma saytlarda u bitta ma'noni bildiradi: bu narsa bosiladi.", 'На сайтах над ссылкой появляется рука. Это cursor pointer — знак «сюда можно нажать».', 'On websites a hand appears over a link. That’s cursor pointer, a sign that says “you can press this”.')
    ],
    say: L3("Endi hover bilan transform ikkalasini birlashtiramiz: tugma faqat sichqoncha ustiga kelganda kattalashsin. Yana bitta yangi xususiyat ham qo'shamiz: cursor, u sichqoncha ko'rsatkichining ko'rinishini o'zgartiradi.",
      'Теперь соединим оба: пусть кнопка увеличивается только под мышкой. И ещё одно свойство: cursor, то есть указатель.',
      'Now let’s combine them: make the button grow only under the mouse. And one more property: cursor, meaning the pointer.'),
    sayRule: L3("Qoidani yozdik: hover paytida scale bir butun o'ndan ikki bo'lsin. Hozircha sichqoncha uzoqda, shuning uchun tugma odatdagidek turibdi.", 'Правило: при hover scale одна целая две десятых. Сейчас мышки нет, кнопка обычная.', 'The rule: on hover, scale one point two. Right now there’s no mouse, the button is normal.'),
    sayHover: L3("Sichqoncha tugma ustiga keldi-yu, tugma sal kattalashdi, xuddi «Meni bosing!» deyayotgandek!", 'Мышка над кнопкой: она немного выросла. Будто говорит: нажми меня!', 'The mouse is over it: the button grew a little. As if it’s saying: press me!'),
    sayCursor: L3("Endi tugmaga cursor pointer ham yozamiz. Kompyuterda sichqoncha tugma ustiga kelganda, ko'rsatkich strelkadan qo'lga aylanadi. Telefonda esa ko'rsatkichning o'zi yo'q, shuning uchun bu faqat kompyuterda ko'rinadi.", 'cursor pointer: на компьютере, когда мышка над кнопкой, указатель превращается из стрелки в руку. На телефоне указателя нет, поэтому это видно только на компьютере.', 'cursor pointer: on a computer, when the mouse is over the button, the pointer turns from an arrow into a hand. A phone has no pointer, so you only see this on a computer.'),
    done: L3("Xullas, hover bilan transform birga tugmani jonlantiradi, cursor pointer esa uni bosish mumkinligini ko'rsatib turadi.", 'Значит, hover и transform вместе оживляют кнопку, а cursor pointer показывает, что на неё можно нажать.', 'So hover and transform together bring the button to life, and cursor pointer shows it can be pressed.'),
    askStart: L3("Qarang: oddiy tugma", 'Смотри: обычная кнопка', 'Watch: a plain button'),
    askRule: L3("Qarang: qoida bor, sichqoncha yo'q", 'Смотри: правило есть, мышки нет', 'Watch: a rule, but no mouse'),
    askHover: L3("Qarang: ustida — kattalashdi", 'Смотри: под мышкой — выросла', 'Watch: it grows under the mouse'),
    askCursor: L3("Qarang: cursor pointer", 'Смотри: cursor pointer', 'Watch: cursor pointer'),
    askDone: L3("hover va transform, cursor pointer", 'hover и transform, cursor pointer', 'hover and transform, cursor pointer')
  },
  s9: {
    eyebrow: L3("Qo'l ko'rsatkich", 'Курсор-рука', 'A hand pointer'),
    say: L3("Ko'rsatkichni endi o'zingiz qo'lga aylantiring. Kompyuterda sichqoncha tugma ustiga kelganda strelka o'rniga qo'l chiqsin: buning uchun cursor qiymatini yozing.",
      'Теперь ты. Пусть на компьютере указатель над кнопкой превращается в руку: впиши значение для cursor.',
      'Your turn. On a computer, make the pointer turn into a hand over the button: type the value for cursor.'),
    msgs: {
      empty: L3("Maydon bo'sh qoldi-ku. Bu yerga bitta inglizcha so'z kerak.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      hand: L3("Inglizchada qo'l hand bo'ladi, lekin CSS bunday so'zni bilmaydi. Bizga «ko'rsatkich» degan so'z kerak.", 'В CSS рука — не hand. Нужно слово «указатель».', 'In CSS the hand isn’t hand. We need the word for pointer.'),
      bad: L3("Bu so'zni brauzer tanimadi, shuning uchun ko'rsatkich o'zgarmadi. Harflarini bir tekshirib ko'ring.", 'Браузер не узнал это слово. Проверь слово для cursor.', 'The browser didn’t recognize that word. Check the word for cursor.'),
      other: L3("Bunday ko'rsatkich ham bor, lekin u qo'l emas. Qo'l shaklidagi ko'rsatkich pointer deyiladi.", 'Это другой указатель. Рука называется pointer.', 'That’s a different pointer. The hand is called pointer.')
    },
    hints: [
      L3("«Ko'rsatkich» so'zi inglizcha qanday bo'ladi?", 'Как по-английски «указатель»?', 'What’s the English for pointer?'),
      L3("Inglizchada ko'rsatkichni pointer deyishadi.", 'Указатель-рука — pointer.', 'The hand pointer is pointer.'),
      L3("pointer deb yozing-da, «Tekshirish»ni bosing.", 'Впиши pointer и нажми «Проверить».', 'Type pointer and tap Check.')
    ],
    ok: L3("Ajoyib! Kompyuterda sichqonchani tugma ustiga olib borib ko'ring-chi: strelka darrov qo'lga aylanadi.", 'Отлично! На компьютере наведи мышку на кнопку: указатель станет рукой.', 'Great! On a computer, point the mouse at the button: the pointer becomes a hand.'),
    ask: L3("Ko'rsatkich qo'l bo'lsin", 'Сделай указатель рукой', 'Make the pointer a hand')
  },
  s10: {
    eyebrow: L3("Nima kerak?", 'Что нужно?', 'What’s needed?'),
    say: L3("O'yinimdagi tugma bilan yana to'rtta ish qilmoqchiman. Har bir topshiriqni o'qing-u, unga scale, rotate, translate yoki cursor kerakligini tanlang.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, что нужно.',
      'Now check yourself. I’ll say a task, and you pick what’s needed.'),
    ask: L3("Bu vazifa uchun nima kerak?", 'Что нужно для этой задачи?', 'What does this task need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Vazifani yana bir o'qing: tugma kattalashadimi, buriladimi, suriladimi yoki ko'rsatkich o'zgaradimi?", 'Кнопка растёт, поворачивается, сдвигается или меняется указатель?', 'Does the button grow, turn, move, or does the pointer change?'),
    hint2: L3("Esingizdami: kattalashtirishni scale, burishni rotate, surishni translate qiladi, ko'rsatkichni esa cursor o'zgartiradi.", 'scale увеличивает, rotate поворачивает, translate сдвигает, cursor меняет указатель.', 'scale grows, rotate turns, translate moves, cursor changes the pointer.'),
    items: [
      { t: L3("Tugma biroz kattalashsin.", 'Кнопка должна немного вырасти.', 'The button should grow a little.'), right: 'scale', why: L3("Tugmani kattalashtirish kerak, bu esa scale ishi.", 'Увеличение — scale.', 'Growing is scale.') },
      { t: L3("Tugma biroz qiyshaysin.", 'Кнопка должна немного наклониться.', 'The button should tilt a little.'), right: 'rotate', why: L3("Tugma qiyshayishi uchun uni burish kerak, buni rotate qiladi.", 'Поворот — rotate.', 'Turning is rotate.') },
      { t: L3("Tugma biroz yuqoriga ko'tarilsin.", 'Кнопка должна чуть подняться вверх.', 'The button should rise a little.'), right: 'translate', why: L3("Tugmani tepaga surish kerak, buni esa translate qila oladi.", 'Сдвиг — translate.', 'Moving is translate.') },
      { t: L3("Ko'rsatkich qo'lga aylansin.", 'Указатель должен стать рукой.', 'The pointer should become a hand.'), right: 'cursor', why: L3("Ko'rsatkichning ko'rinishini faqat cursor o'zgartira oladi.", 'Указатель меняет cursor.', 'cursor changes the pointer.') }
    ],
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    ok: L3("To'rtala vazifaga ham kerakli asbobni topdingiz! Endi o'yinimdagi tugmalarni o'zingiz jonlantira olasiz.", 'Всё верно! Ты подбираешь к каждой задаче нужный инструмент.', 'All correct! You pick the right tool for each task.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Har bir qadamda oldin kodga qarang: scale ichida birlik bormi, rotate ichida deg bormi, translate ichida vergul bormi? Keyin tugma nima bo'lganini ko'ring.", 'Каждый раз смотри на код: есть ли единица в scale, есть ли deg в rotate, есть ли запятая в translate? Потом смотри на кнопку.', 'Each time, look at the code: does scale have a unit, does rotate have deg, does translate have a comma? Then look at the button.'),
      L3("Nega tugma ishlamay qoladi? Chunki scale ichiga birlik yozilmaydi, rotate ichida deg bo'lishi shart, translate sonlarini esa vergul ajratib turadi. Ikkita transform yozsangiz, ikkinchisi birinchisini o'chirib yuboradi.", 'В scale единица не нужна, в rotate нужен deg, в translate числа разделяют запятой. Если написать два transform, второй сотрёт первый.', 'scale needs no unit, rotate needs deg, translate separates numbers with a comma. Write two transforms and the second erases the first.'),
      L3("Retseptda «yuz gramm un» o'rniga «yuz dona un» deb yozilsa, taom chiqmaydi-ku. transform ichida ham shunday: rotate gradusni kutadi, scale esa birliksiz sonni.", 'Если в рецепте перепутать граммы и штуки, блюдо не получится. В CSS у каждой функции тоже своя единица.', 'Mix up grams and pieces in a recipe and the dish won’t work out. In CSS each function wants its own unit too.')
    ],
    say: L3("transform juda injiq: bitta harf yoki vergul tushib qolsa, tugma qimir etmaydi. Hozir tugma bir yarim barobar katta bo'lib turibdi. Keling, u qanday holatlarda ishlamay qolishini birma-bir ko'ramiz.",
      'И с transform бывают ошибки. Давай посмотрим на четыре. Сейчас кнопка в полтора раза больше.',
      'transform has mistakes too. Let’s look at four. Right now the button is one and a half times bigger.'),
    sayUnit: L3("Birinchi holat: scale ichiga px yozib qo'ydik. scale birlikni yoqtirmaydi, shuning uchun brauzer qoidani tushunmadi va o'tkazib yubordi. Tugma oddiy holiga qaytdi.", 'Первая: в scale написан px. Для scale единица не нужна, браузер выбросил правило.', 'The first: scale has px inside. scale needs no unit, so the browser threw the rule away.'),
    sayDeg: L3("Ikkinchisi: rotate ichida faqat o'n besh soni turibdi, deg esa yo'q. Brauzer o'n besh nima ekanini bilmaydi, shuning uchun tugmani burmadi.", 'Вторая: в rotate только число, без deg. Браузер не понял, на сколько поворачивать.', 'The second: rotate has just a number, no deg. The browser didn’t understand how much to turn.'),
    sayComma: L3("Uchinchisi: translate sonlarining o'rtasida vergul tushib qolibdi. Brauzer bu qoidani ham o'tkazib yubordi, shuning uchun tugma joyidan surilmadi.", "Третья: между числами translate нет запятой. Браузер выбросил правило — кнопка не сдвинулась.", "The third: there’s no comma between translate’s numbers. The browser threw the rule away, so the button didn’t move."),
    sayTwice: L3("To'rtinchisi esa tuzoq: ikkita alohida transform qoidasi yozdik. Ikkinchisi birinchisini o'chirib yubordi, shuning uchun tugma faqat burildi, kattalashmadi. Ikkalasi kerak bo'lsa, ularni bitta qatorga, bo'sh joy bilan yozamiz.", 'Четвёртая — ловушка: два правила transform. Второе стёрло первое, кнопка только повернулась, но не выросла. Если нужны оба, их пишут в одной строке через пробел.', 'The fourth is a trap: two transform rules. The second erased the first, so the button only turned and didn’t grow. If you need both, you write them on one line with a space.'),
    done: L3("Demak, scale ichiga birlik yozilmaydi, rotate ichida deg bo'ladi, translate sonlari vergul bilan ajratiladi. Bir nechta transform kerak bo'lsa, hammasini bitta qatorga yozamiz.", 'Значит, в scale нет единицы, в rotate есть deg, в translate есть запятая, а transform пишут в одной строке.', 'So scale has no unit, rotate has deg, translate has a comma, and transform goes on one line.'),
    askStart: L3("Qarang: scale(1.5)", 'Смотри: scale(1.5)', 'Watch: scale(1.5)'),
    askUnit: L3("Qarang: scale ichida px", 'Смотри: px в scale', 'Watch: px in scale'),
    askDeg: L3("Qarang: deg yo'q", 'Смотри: нет deg', 'Watch: no deg'),
    askComma: L3("Qarang: vergul yo'q", 'Смотри: нет запятой', 'Watch: no comma'),
    askTwice: L3("Qarang: ikkinchisi g'olib", 'Смотри: побеждает второе', 'Watch: the second one wins'),
    askDone: L3("Birliksiz, deg bilan, vergul bilan, bitta qatorda", 'Без единицы, с deg, с запятой, в одну строку', 'No unit, with deg, with a comma, on one line')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men tugmani burmoqchi edim, u esa tik turibdi-ku! Maydondagi qiymatni men yozganman. Nimani unutganimni topib, tuzatib qo'ying-chi.",
      'Ой, я написал поворот кнопки, а она стоит прямо! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wrote a turn for the button, but it stands straight! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Maydon bo'shab qoldi. Unga rotate qiymatini qaytadan yozing.", 'Впиши значение.', 'Type the value.'),
      deg: L3("Son hali ham yolg'iz turibdi, yonida deg yo'q. Uni qo'shib qo'ying.", 'Рядом с числом всё ещё нет deg. Добавь его.', 'There’s still no deg next to the number. Add it.'),
      bad: L3("Bunday qiymatni brauzer tanimadi. Qavslar bilan deg so'zini bir tekshirib chiqing.", 'Браузер не узнал это значение. Проверь скобки и deg.', 'The browser didn’t recognize that value. Check the brackets and deg.'),
      other: L3("Bu esa umuman boshqa qiymat bo'lib qoldi. O'n besh sonini o'zgartirmang, yoniga deg qo'shsangiz bas.", 'Это другое значение. Не меняй число, просто добавь deg.', 'That’s a different value. Don’t change the number, just add deg.')
    },
    hints: [
      L3("rotate ichida son yonida yana nima turishi kerak edi?", 'Что должно стоять рядом с числом в rotate?', 'What should be next to the number in rotate?'),
      L3("Gradusni CSS kodida qisqa qilib deg deb yozamiz.", 'Градусы пишутся deg.', 'Degrees are written deg.'),
      L3("rotate, qavs, o'n besh deg, keyin yopuvchi qavsni yozing-da, «Tekshirish»ni bosing.", 'Впиши rotate, скобка, пятнадцать deg, закрывающая скобка и нажми «Проверить».', 'Type rotate, bracket, fifteen deg, closing bracket and tap Check.')
    ],
    ok: L3("Ishladi-ku! Uchta harf qo'shildi-yu, tugma o'n besh gradusga burildi.", 'Ура, заработало! Кнопка повернулась на пятнадцать градусов.', 'Hooray, it works! The button turned fifteen degrees.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("O'yin sahifamda nimadir joyida emas. Kodda uchta qoida bor, lekin bittasi tugmaga hech narsa qilmayapti. Sahifaga qarang-da, ishlamayotgan qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap that rule.'),
    say2: L3("Tugma tuzaldi, lekin men yana bir joyini buzib qo'yibman. Bu safar qaysi qoida ishlamayapti ekan?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida bemalol ishlayapti, natijasi sahifada ko'rinib turibdi. Kodda yozilgan-u, sahifada ko'rinmayotgan narsani qidiring.", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      unit: L3("Topdingiz! scale ichiga px yozilgan ekan, shuning uchun tugma kattalashmagan.", 'Есть! В scale не должно быть px.', 'Found it! There shouldn’t be px in scale.'),
      comma: L3("Mana u! translate sonlarining o'rtasida vergul tushib qolgan ekan.", 'Есть! Между числами translate не было запятой.', 'Found it! There was no comma between translate’s numbers.')
    },
    hint1: L3("Sahifaga qarang-chi: kodda yozilgan qaysi o'zgarish tugmada ko'rinmayapti?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      unit: L3("Tugma rostdan kattalashdimi? transform qiymatiga diqqat bilan qarang.", 'Кнопка увеличилась? Проверь значение transform.', 'Did the button grow? Check the transform value.'),
      comma: L3("Tugma joyidan surildimi? translate ichidagi sonlarni tekshirib ko'ring.", 'Кнопка сдвинулась? Проверь, что внутри translate.', 'Did the button move? Check inside translate.')
    },
    hint3: {
      unit: L3("Ikkinchi qoidada scale ichiga px yozilgan. O'sha qatorni bosing.", 'Ошибка во втором правиле: px в scale. Нажми эту строку.', 'The bug is in the second rule: px in scale. Tap that line.'),
      comma: L3("Ikkinchi qoidada translate sonlari vergulsiz qolgan. O'sha qatorni bosing.", 'Ошибка во втором правиле: нет запятой. Нажми эту строку.', 'The bug is in the second rule: no comma. Tap that line.')
    },
    ok: L3("Ikki joydagi nosozlikni ham topdingiz, endi tugma kattalashyapti ham, surilyapti ham! Kod bilan sahifani shunday solishtirsangiz, birorta ham buzuqlik ko'zingizdan qochib qutulolmaydi.", 'Супер! Обе найдены. Ты проверяешь кнопки как настоящий разработчик.', 'Super! Both found. You check buttons like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi butun qoidani boshidan oxirigacha o'zingiz yozasiz! Sichqoncha ustiga kelganda tugma o'n gradusga burilsin. Selektor tugmaning class nomi bilan hover so'zidan yasaladi.",
      'Теперь напиши правило целиком. Пусть под мышкой кнопка поворачивается на десять градусов. Селектор — класс кнопки и hover.',
      'Now write the whole rule yourself. Make the button turn ten degrees on hover. The selector is the button’s class plus hover.'),
    msgs: {
      empty: L3("Maydon hali bo'sh. Oldin selektorni, keyin jingalak qavslar ichida xususiyat bilan qiymatni yozing.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga jingalak qavslar kerak: biri ochadi, biri yopadi. Qaysi biri yo'qligini qarang.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymat o'rtasiga ikki nuqta qo'yish esdan chiqibdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      space: L3("Tugma bilan hover o'rtasida bo'sh joy qolibdi. Hozircha ularni bir-biriga yopishtirib yozing, nega shunday ekanini dars oxirida bilib olasiz.", 'Между кнопкой и hover есть пробел. Напиши их слитно.', 'There’s a space between the button and hover. Write them together.'),
      noHover: L3("Selektorda hover yo'q, shuning uchun tugma doim qiyshayib turadi. Bizga esa faqat sichqoncha ustida burilishi kerak.", 'Нет hover: кнопка будет повёрнута всегда. А нужно только под мышкой.', 'No hover: the button would always be turned. We need it only on hover.'),
      sel: L3("Selektor shunday yasaladi: nuqta, tugmaning class nomi, ikki nuqta va hover.", 'Селектор: точка, класс кнопки, двоеточие и hover.', 'The selector: a dot, the button’s class, a colon and hover.'),
      prop: L3("Tugmani faqat transform xususiyati bura oladi.", 'Поворот задаёт свойство transform.', 'The transform property does the turning.'),
      deg: L3("O'n sonining yonida deg yo'q-ku.", 'Рядом с числом нет deg.', 'There’s no deg next to the number.'),
      bad: L3("Qiymatni brauzer tanimadi. rotate so'zidan keyingi qavslarni tekshirib ko'ring.", 'Браузер не узнал это значение. Проверь скобки.', 'The browser didn’t recognize that value. Check the brackets.'),
      other: L3("Tugma burildi, lekin boshqa burchakka. Bizga aynan o'n gradus kerak.", 'Поворот другой. Нужно десять градусов.', 'The turn is different. We need ten degrees.')
    },
    hints: [
      L3("Selektorga hover qo'shing, xususiyat sifatida esa transform yozing.", 'Добавь к селектору hover, а свойство — transform.', 'Add hover to the selector, and the property is transform.'),
      L3("Selektor nuqta, tugma, ikki nuqta va hover bo'ladi, qiymat esa rotate, qavs ichida o'n deg.", 'Селектор: точка tugma двоеточие hover, значение: rotate десять deg.', 'Selector: dot tugma colon hover; value: rotate ten deg.'),
      L3("Kodning tagida namuna paydo bo'ldi. Uni maydonga ko'chirib yozing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Sichqoncha kelishi bilan tugma qiyshayib qoladi. Bu qoidani boshidan oxirigacha o'zingiz yozdingiz!", 'Отлично! Под мышкой кнопка наклоняется. Правило написано тобой целиком.', 'Great! The button tilts on hover. You wrote the whole rule yourself.'),
    ask: L3("Ustida tugma 10 gradusga burilsin", 'Поверни кнопку на 10 градусов при hover', 'Turn the button 10 degrees on hover')
  },
  s14: {
    eyebrow: L3("O'z tugmangiz", 'Своя кнопка', 'Your own button'),
    say: L3("O'zingizning tugmangizni jonlantirish vaqti keldi! Sichqoncha ustiga kelganda tugma qanday rangga kirsin, qanday o'zgarsin, ko'rsatkich qanaqa bo'lsin, o'zingiz tanlang. Uchta qiymatni yozib, «Tayyor»ni bosing.",
      'Теперь оживи свою кнопку. Впиши любые значения для цвета под мышкой, transform и указателя. Потом нажми «Готово».',
      'Now bring your own button to life. Type any values for the hover color, the transform and the pointer. Then tap “Done”.'),
    msgs: {
      color: L3("Bu rangni brauzer tanimadi: \u2063{w}\u2064. Rangning inglizcha nomini yoki kodini yozing.", 'Браузер не узнал такой цвет: \u2063{w}\u2064. Напиши название или код цвета.', 'The browser didn’t recognize this color: \u2063{w}\u2064. Write a color name or code.'),
      tf: L3("Brauzer bu qiymatni tanimadi: \u2063{w}\u2064. scale, rotate yoki translate so'zidan keyin qavs ochib, ichiga son yozing, masalan, scale bir butun o'ndan bir.", "Браузер не узнал такое значение: \u2063{w}\u2064. После scale, rotate или translate нужны скобки с числом внутри — например, scale и в скобках одна целая одна десятая.", "The browser didn’t recognize this value: \u2063{w}\u2064. After scale, rotate or translate you need brackets with a number inside, for example scale with one point one in brackets."),
      deg: L3("Son yolg'iz qolibdi: rotate ichida uning yoniga deg qo'shing.", 'В rotate рядом с числом нет deg.', 'In rotate there’s no deg next to the number.'),
      cur: L3("Brauzer bunday ko'rsatkichni bilmaydi: \u2063{w}\u2064. Masalan, pointer yozib ko'ring.", 'Браузер не узнал такой указатель: \u2063{w}\u2064. Впиши, например, pointer.', 'The browser didn’t recognize this pointer: \u2063{w}\u2064. Type, for example, pointer.'),
      comma: L3("Kasr sonni nuqta bilan yozing: bir nuqta bir. Bu yerda CSS vergulni tushunmaydi.", "Дробь в CSS пишут через точку: одна точка одна, а не через запятую.", "In CSS a decimal uses a dot, not a comma: one point one.")
    },
    hints: [
      L3("Har bir maydonga faqat bitta qiymat sig'adi.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Rang maydoniga rangning nomini yozing. transform uchun scale, rotate yoki translate so'zini yozib, qavs ichiga son qo'ying. cursor uchun esa pointer yetadi.", "Для цвета — название цвета, для transform — scale, rotate или translate со скобками и числом, для cursor — pointer.", "For the color, a color name; for transform, scale, rotate or translate with brackets and a number; for cursor, pointer."),
      L3("Masalan, gold, scale bir butun o'ndan bir va pointer yozing. Keyin «Tayyor»ni bosing.", 'Например: gold, scale одна целая одна десятая и pointer. Потом нажми «Готово».', 'For example: gold, scale one point one and pointer. Then tap “Done”.')
    ],
    ok: L3("Zo'r tugma chiqdi! Sichqonchani olib borib ko'ring-chi, u sizga javob beradi.", 'Ого, как красиво! Это твоя живая кнопка.', 'Wow, how pretty! This is your living button.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("To'rtta gap aytaman: hover haqida, transform haqida va bitta yashirin tuzoq haqida. Har birini eshitib, to'g'rimi yoki noto'g'rimi, tanlang.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapni yana bir o'qing: u hover haqidami, transform haqidami yoki selektorning yozilishi haqidami?", 'О чём фраза: о hover, о transform или о записи селектора?', 'What’s the sentence about: hover, transform, or how the selector is written?'),
    hint2: L3("Esingizdami: hover faqat sichqoncha ustida ishlaydi, transform qo'shnilarni surmaydi, rotate ichida deg bo'ladi. Oxirgi gapda esa kodga diqqat bilan qarang.", 'Вспомни: hover работает только под мышкой, transform не двигает соседей, rotate нужен deg, hover пишут слитно с кнопкой.', 'Remember: hover only works under the mouse, transform doesn’t move neighbours, rotate needs deg, and hover is written right after the button.'),
    items: [
      { t: L3("hover qoidasi sichqoncha element ustida bo'lganda ishlaydi.", 'Правило с hover работает, когда мышка над элементом.', 'A hover rule works when the mouse is over the element.'), right: true,
        why: L3("hover so'zining ma'nosi ham shu: sichqoncha element ustida.", 'Верно: hover — это мышка над элементом.', 'Right: hover means the mouse is over it.') },
      { t: L3("scale ikki bo'lsa, pastdagi abzas ham pastga suriladi.", 'При scale два абзац под кнопкой тоже сдвигается вниз.', 'With scale two, the paragraph below moves down too.'), right: false,
        why: L3("Aslida transform qo'shnilarni surmaydi: tugma kattalashsa ham, abzas joyida qoladi.", 'На самом деле transform не двигает соседей: они остаются на месте.', 'Actually transform doesn’t move neighbours: they stay in place.') },
      { t: L3("rotate ichida son yoniga deg yoziladi.", 'В rotate рядом с числом пишут deg.', 'In rotate you write deg next to the number.'), right: true,
        why: L3("deg gradusni bildiradi, usiz rotate tugmani burolmaydi.", 'Верно: deg — это градусы.', 'Right: deg means degrees.') },
      { t: L3("Bu qoida sichqoncha tugma ustiga kelganda ishlaydi.", 'Это правило сработает, когда мышка над кнопкой.', 'This rule works when the mouse is over the button.'), right: false, code: 'space',
        why: L3("Aslida bu qoida tugmani jonlantirmaydi. Bo'sh joy nima qilganini dars oxirida birga ko'ramiz.", 'На самом деле пробел ломает селектор: браузер ищет что-то внутри кнопки.', 'Actually the space breaks the selector: the browser looks for something inside the button.') }
    ],
    ok: L3("To'rtala gapda ham adashmadingiz! Endi hover ham, transform ham sizga yaxshi tanish.", 'Всё верно! Ты отлично разбираешься в hover и transform.', 'All correct! You know hover and transform really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi eski papkadagi o'sha kodni ishga tushiramiz. Unda tugma bilan hover o'rtasida bo'sh joy bor edi, esingizdami? Qarang: sichqoncha tugmaning ustida turibdi, tugma esa qimir etmayapti! Men noto'g'ri o'ylagan ekanman. Bo'sh joy bo'lsa, brauzer hover holatini tugmaning o'zidan emas, uning ichidagi boshqa elementdan qidirar ekan.",
        'Вернёмся к загадке. Помнишь, я поставил пробел между кнопкой и hover? Смотри: мышка над кнопкой, а она не меняется! Я ошибся. С пробелом браузер ищет какой-то другой элемент внутри кнопки.',
        'Back to our riddle. Remember, I put a space between the button and hover? Look: the mouse is over the button, but it doesn’t change! I was wrong. With a space, the browser looks for some other element inside the button.'), k: 'riddle' },
      { text: L3("Bo'sh joyni olib tashlasak bas: hover darrov ishlab ketdi. Mana!", 'Уберём пробел, и hover сразу работает. Вот!', 'Remove the space, and hover works right away. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning jonli tugmangiz, uni o'zingiz yasadingiz!", 'Смотри, это твоя живая кнопка!', 'Look, this is your living button!'), k: 'own' },
      { text: L3("Esingizda bo'lsin: hover qoidasi faqat sichqoncha element ustida turganda ishlaydi.", 'Правило с hover работает только под мышкой.', 'A hover rule only works under the mouse.'), k: 'hover' },
      { text: L3("transform elementni kattalashtiradi, buradi va suradi, qo'shnilarga esa tegmaydi.", 'transform увеличивает, поворачивает и сдвигает.', 'transform scales, turns and moves.'), k: 'tf' },
      { text: L3("cursor pointer esa ko'rsatkichni qo'lga aylantirib, bu narsani bosish mumkinligini ko'rsatadi.", 'cursor pointer показывает, что на элемент можно нажать.', 'cursor pointer shows something can be pressed.'), k: 'cur' },
      { text: L3("hover so'zini esa selektorga bo'sh joysiz, yopishtirib yozamiz.", 'А hover пишут вплотную к кнопке, без пробела.', 'And hover is written right after the button, with no space.'), k: 'space' },
      { text: L3("Qoyil! Endi tugmalaringiz jonli. Keyingi darsda ularni yanada silliq qilamiz: o'zgarish birdaniga emas, asta-sekin bo'ladi. Ko'rishguncha!",
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
