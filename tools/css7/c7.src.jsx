// =============================================================================
// КУРС «CSS» · Урок 7 — «Box Model»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css7/build.mjs → lessons/css/07-box-model.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 7 · «Box Model» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–6: правило, селекторы, цвета, фон, текст, размеры. Коди сделал страницу заметок:
// текст прилип к краю жёлтого фона, рамки нет. Ученик узнаёт, что каждый элемент — коробка: padding (внутренний
// отступ, растёт вместе с фоном), border (рамка из трёх частей: толщина, вид, цвет; без вида рамки нет), margin
// (внешний отступ, прозрачный, отодвигает соседей) и box-sizing: border-box (width — для всей коробки).
// «Инспектор», как DevTools: размер всей коробки у каждого элемента, у подсвеченного — padding зелёным, margin оранжевым.
// Загадка (без имён): чтобы раздвинуть заметки, Коди пишет padding 30px и уверен, что они разойдутся.
// Разгадка: заметки толще, а расстояние то же; раздвигает margin.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (текст у края, рамки нет → padding, border, margin; загадка про padding)
//   padding: s2 показ (8px → 24px, фон растёт) · s3 вписать 20px (Fill) · s4 padding ↔ заметка (Matching)
//   border:  s5 показ (solid · dashed · dotted · без вида — рамки нет) · s6 вписать dashed (Fill) · s7 какой код у рамки (выбор)
//   margin:  s8 показ (свой margin абзаца → 0px → 30px, фон не растёт) · s9 вписать 30px (Fill) · s10 padding или margin (Sort)
//   ширина:  s11 показ (200 → +padding 240 → +border 250 → border-box 200) · s12 вписать border-box (Fill) · s13 найти сломанное правило
//   w1 правило целиком: h1 { border: 2px solid black; } (перенос) · s14 своя заметка: padding, border, margin («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: верная ли запись — решает Chrome (CSS.supports): «20» без px не принимается; «border: 3px red»
//     браузер принимает, но рамки не рисует (нет вида линии) — так и показано. У абзаца свой margin, как в браузере.
//   · Узбекский — по /uzbekcha; в речи нет символов: «piksel», числа словами.
//
// СИСТЕМА СЛОВ: padding — ichki bo'shliq / внутренний отступ; margin — tashqi bo'shliq / внешний отступ;
// border — chegara / рамка; eslatma — заметка; quti — коробка. В речи названия свойств — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-07-box-model',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '7-dars. Box Model',
    ru: 'Урок 7. Box Model',
    en: 'Lesson 7. Box Model'
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
  next: L3('Chiroyli kartochkalar', 'Красивые карточки', 'Beautiful cards'),
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
  // Страница заметок Коди (не звучит).
  site: {
    title: L3("Kodining eslatmalari", 'Заметки Коди', 'Kodi’s notes'),
    n1: L3("Soat beshda futbol!", 'В пять — футбол!', 'Football at five!'),
    n2: L3("Kitobni qaytarish kerak.", 'Вернуть книгу в библиотеку.', 'Return the library book.'),
    note: L3("Eslatma", 'Заметка', 'Note')
  },
  s1: {
    eyebrow: L3("Eslatmalar", 'Заметки', 'Notes'),
    say: L3("Salom! Men eslatmalar sahifasini yasadim. Lekin qarang: matn sariq fonning chetiga yopishib qolgan, chegarasi ham yo'q. Unchalik chiroyli emas, to'g'rimi? «Aylantirish» tugmasini bosing.",
      'Привет! Я сделал страницу с заметками. Но смотри: текст прилип к самому краю жёлтого фона, а рамки нет. Не очень красиво, правда? Нажми «Превратить».',
      'Hi! I made a page of notes. But look: the text is stuck to the very edge of the yellow background, and there’s no frame. Not very pretty, right? Tap “Transform”.'),
    magic: L3("Mana! Matn chetdan uzoqlashdi, atrofida chegara paydo bo'ldi, eslatmalar esa bir-biridan ajraldi. Inspektor buni ranglar bilan ko'rsatyapti.",
      'Вот! Текст отошёл от края, вокруг появилась рамка, а заметки разошлись. Инспектор показывает это цветом.',
      'There! The text moved away from the edge, a frame appeared around it, and the notes moved apart. The Inspector shows it with colors.'),
    magicP: L3("Buni uchta xususiyat qildi: padding, ya'ni ichki bo'shliq degani, border, ya'ni chegara, va margin, ya'ni tashqi bo'shliq. Hammasi birga Box Model deyiladi, ya'ni quti modeli degani.",
      'Это сделали три свойства: padding, то есть внутренний отступ, border, то есть рамка, и margin, то есть внешний отступ. Вместе их называют Box Model, то есть модель коробки.',
      'Three properties did it: padding, meaning the inner space, border, meaning the frame, and margin, meaning the outer space. Together they’re called the Box Model, meaning the model of a box.'),
    done: L3("Bugun har bir elementni quti kabi bezashni o'rganasiz. Lekin oldin topishmoq. Men eslatmalar orasini kengroq qilmoqchiman va padding o'ttiz piksel yozaman. Menimcha, eslatmalar bir-biridan uzoqlashadi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься оформлять каждый элемент как коробку. Но сначала загадка. Я хочу раздвинуть заметки и пишу padding тридцать пикселей. По-моему, заметки разойдутся. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to style every element like a box. But first, a riddle. I want to move the notes apart, so I write padding thirty pixels. I think the notes will move apart. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("padding · border · margin", 'padding · border · margin', 'padding · border · margin')
  },
  s2: {
    eyebrow: L3("Ichki bo'shliq", 'Внутренний отступ', 'Inner space'),
    say: L3("Har bir element quti kabi: ichida matn, atrofida esa bo'shliqlar. Birinchisi padding, ya'ni ichki bo'shliq degani: matn bilan qutining cheti orasidagi joy. Inspektorda u yashil rangda ko'rinadi. Hozir u nolga teng.",
      'Каждый элемент — как коробка: внутри текст, а вокруг — отступы. Первый из них — padding, то есть внутренний отступ: место между текстом и краем коробки. В Инспекторе он зелёный. Сейчас он равен нулю.',
      'Every element is like a box: text inside, and space around it. The first kind is padding, meaning the inner space: the room between the text and the edge of the box. In the Inspector it’s green. Right now it’s zero.'),
    sayPad: L3("Eslatmaga padding sakkiz piksel. Qarang: matn chetdan uzoqlashdi, sariq fon esa kattalashdi. Yashil hoshiya o'sha sakkiz piksel.",
      'Заметке padding восемь пикселей. Смотри: текст отошёл от края, а жёлтый фон стал больше. Зелёная полоса — это те самые восемь пикселей.',
      'The note gets padding eight pixels. Look: the text moved away from the edge, and the yellow background got bigger. The green strip is those eight pixels.'),
    sayBig: L3("Endi yigirma to'rt piksel. Ichki bo'shliq kattaroq, eslatma ham semizroq bo'ldi. Matn o'sha-o'sha, faqat atrofida joy ko'paydi.",
      'Теперь двадцать четыре пикселя. Внутренний отступ больше, и заметка стала толще. Текст тот же, просто вокруг него больше места.',
      'Now twenty-four pixels. The inner space is bigger, and the note got thicker. The text is the same, there’s just more room around it.'),
    done: L3("Demak, padding matn atrofida, qutining ichida joy beradi. Fon ham shu joyni egallaydi.",
      'Значит, padding даёт место вокруг текста, внутри коробки. Фон занимает и это место.',
      'So padding gives room around the text, inside the box. The background fills that room too.'),
    askStart: L3("Qarang: yashil — padding", 'Смотри: зелёное — padding', 'Watch: green is padding'),
    askPad: L3("Qarang: padding 8px", 'Смотри: padding 8px', 'Watch: padding 8px'),
    askBig: L3("Qarang: padding 24px", 'Смотри: padding 24px', 'Watch: padding 24px'),
    askDone: L3("padding — ichki bo'shliq", 'padding — внутренний отступ', 'padding is the inner space')
  },
  s3: {
    eyebrow: L3("Eslatma ichida", 'Отступ внутри', 'Space inside'),
    say: L3("Endi navbat sizga. Eslatma ichida matn atrofida yigirma piksel joy bo'lsin: padding uchun qiymatni yozing.",
      'Теперь твоя очередь. Пусть внутри заметки вокруг текста будет двадцать пикселей: впиши значение для padding.',
      'Now it’s your turn. Let there be twenty pixels around the text inside the note: type the value for padding.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Brauzer uni tashlab yuboradi: son yoniga px qo'shing.", 'Написано только число. Браузер его выбрасывает: добавь к числу px.', 'Only a number. The browser throws it away: add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Bu boshqa o'lcham. Ichki bo'shliq yigirma piksel bo'lishi kerak.", 'Это другой размер. Внутренний отступ должен быть двадцать пикселей.', 'That’s a different size. The inner space should be twenty pixels.')
    },
    hints: [
      L3("Qiymat son va o'lcham birligidan iborat.", 'Значение — число и единица.', 'The value is a number and a unit.'),
      L3("Son yigirma, birlik px.", 'Число двадцать, единица px.', 'The number is twenty, the unit is px.'),
      L3("Yigirma sonini yozing, yoniga px qo'ying va Tekshirishni bosing.", 'Впиши число двадцать, допиши px и нажми «Проверить».', 'Type the number twenty, add px and tap Check.')
    ],
    ok: L3("Zo'r! Matn atrofida yigirma piksel, Inspektordagi yashil hoshiya ham shuni ko'rsatyapti.", 'Огонь! Вокруг текста двадцать пикселей, и зелёная полоса в Инспекторе это показывает.', 'Awesome! Twenty pixels around the text, and the green strip in the Inspector shows it.'),
    ask: L3("Eslatma ichida 20px bo'shliq bo'lsin", 'Сделай внутренний отступ заметки 20px', 'Give the note 20px of inner space')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi padding qiymatlarini eslatmalar bilan juftlang. Chapdan qiymatni, o'ngdan esa shunday ichki bo'shliqli eslatmani bosing.",
      'Теперь соедини значения padding с заметками. Нажми значение слева, а потом заметку с таким внутренним отступом справа.',
      'Now match the padding values with the notes. Tap a value on the left, then the note with that inner space on the right.'),
    why: {
      p4: L3("To'rt piksel juda kichik: matn deyarli chetga tegib turadi.", 'Четыре пикселя — совсем мало: текст почти касается края.', 'Four pixels is tiny: the text almost touches the edge.'),
      p16: L3("O'n olti piksel o'rtacha: matn atrofida bir oz joy bor.", 'Шестнадцать пикселей — средне: вокруг текста немного места.', 'Sixteen pixels is medium: a little room around the text.'),
      p32: L3("O'ttiz ikki piksel eng katta: eslatma eng semizi.", 'Тридцать два пикселя — больше всех: заметка самая толстая.', 'Thirty-two pixels is the biggest: the note is the thickest.')
    },
    pairOk: {
      p4: L3("To'g'ri, bu eng ingichkasi.", 'Верно, это самая тонкая.', 'Right, that’s the thinnest.'),
      p16: L3("To'g'ri, bu o'rtachasi.", 'Верно, это средняя.', 'Right, that’s the medium one.'),
      p32: L3("To'g'ri, bu eng semizi.", 'Верно, это самая толстая.', 'Right, that’s the thickest.')
    },
    pickFirst: L3("Oldin chapdan qiymatni tanlang.", 'Сначала выбери значение слева.', 'First pick a value on the left.'),
    hints: [
      L3("Son qancha katta bo'lsa, matn atrofida joy shuncha ko'p.", 'Чем больше число, тем больше места вокруг текста.', 'The bigger the number, the more room around the text.'),
      L3("To'rt piksel eng ingichka eslatma, o'ttiz ikki eng semiz, o'n olti o'rtada.", 'Четыре пикселя — самая тонкая заметка, тридцать два — самая толстая, шестнадцать — посередине.', 'Four pixels is the thinnest note, thirty-two the thickest, sixteen in between.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Ichki bo'shliqni ko'z bilan chamalaysiz.", 'Отлично! Ты прикидываешь внутренний отступ на глаз.', 'Great! You can estimate inner space by eye.'),
    ask: L3("Qiymatni, keyin eslatmani bosing", 'Нажми значение, потом заметку', 'Tap a value, then a note'),
    askPlace: L3("Endi shunday eslatmani bosing", 'Теперь нажми такую заметку', 'Now tap that note')
  },
  s5: {
    eyebrow: L3("Chegara", 'Рамка', 'Border'),
    say: L3("Endi chegara, ya'ni border. Uning qiymati uch qismdan iborat: qalinligi, chiziq turi va rangi. Ular bo'sh joy bilan ketma-ket yoziladi.",
      'Теперь рамка, то есть border. Её значение из трёх частей: толщина, вид линии и цвет. Они пишутся подряд через пробел.',
      'Now the frame, that is border. Its value has three parts: thickness, line type and color. They’re written one after another with spaces.'),
    saySolid: L3("Uch piksel, solid, ya'ni yaxlit chiziq, rangi black, ya'ni qora. Eslatma atrofida ingichka qora chegara chiqdi.",
      'Три пикселя, solid, то есть сплошная линия, цвет black, то есть чёрный. Вокруг заметки появилась тонкая чёрная рамка.',
      'Three pixels, solid, meaning a solid line, color black. A thin black frame appeared around the note.'),
    sayDashed: L3("Olti piksel, dashed, ya'ni chiziqchalar, rangi orange. Chegara qalinroq va uzuq-uzuq bo'ldi.",
      'Шесть пикселей, dashed, то есть чёрточки, цвет orange. Рамка стала толще и прерывистой.',
      'Six pixels, dashed, meaning dashes, color orange. The frame got thicker and broken into dashes.'),
    sayDotted: L3("dotted esa nuqtalar degani. To'rt piksel, nuqtali, rangi purple.",
      'А dotted — это точки. Четыре пикселя, точками, цвет purple.',
      'And dotted means dots. Four pixels, dotted, color purple.'),
    sayNoStyle: L3("Endi diqqat: uch piksel, qizil, lekin chiziq turi yo'q. Qarang, chegara umuman yo'qoldi! Chiziq turisiz brauzer chegarani chizmaydi.",
      'А теперь внимание: три пикселя, красный, но вида линии нет. Смотри, рамка совсем пропала! Без вида линии браузер рамку не рисует.',
      'Now watch closely: three pixels, red, but no line type. Look, the frame is gone! Without a line type the browser doesn’t draw the frame.'),
    done: L3("Demak, border uchun uchala qism kerak: qalinlik, tur va rang. Ayniqsa tur: solid, dashed yoki dotted.",
      'Значит, для border нужны все три части: толщина, вид и цвет. Особенно вид: solid, dashed или dotted.',
      'So border needs all three parts: thickness, type and color. Especially the type: solid, dashed or dotted.'),
    askStart: L3("Qarang: qalinlik · tur · rang", 'Смотри: толщина · вид · цвет', 'Watch: thickness · type · color'),
    askSolid: L3("Qarang: solid — yaxlit chiziq", 'Смотри: solid — сплошная', 'Watch: solid is a solid line'),
    askDashed: L3("Qarang: dashed — chiziqchalar", 'Смотри: dashed — чёрточки', 'Watch: dashed is dashes'),
    askDotted: L3("Qarang: dotted — nuqtalar", 'Смотри: dotted — точки', 'Watch: dotted is dots'),
    askNoStyle: L3("Qarang: tur yo'q — chegara yo'q", 'Смотри: нет вида — нет рамки', 'Watch: no type, no frame'),
    askDone: L3("border: qalinlik tur rang", 'border: толщина вид цвет', 'border: thickness type color')
  },
  s6: {
    eyebrow: L3("Chiziqchali chegara", 'Рамка из чёрточек', 'Dashed border'),
    say: L3("Endi o'zingiz qiling. Qalinligi va rangi tayyor, chiziq turi yetishmayapti. Chegara chiziqchalardan iborat bo'lsin.",
      'Теперь твой ход. Толщина и цвет уже есть, не хватает вида линии. Пусть рамка будет из чёрточек.',
      'Now you do it. The thickness and color are there, the line type is missing. Make the frame out of dashes.'),
    msgs: {
      empty: L3("Chiziq turini yozing.", 'Впиши вид линии.', 'Type the line type.'),
      solid: L3("Bu yaxlit chiziq. Bizga esa chiziqchalar kerak.", 'Это сплошная линия. А нужны чёрточки.', 'That’s a solid line. We need dashes.'),
      dotted: L3("Bu nuqtalar. Bizga esa chiziqchalar kerak.", 'Это точки. А нужны чёрточки.', 'Those are dots. We need dashes.'),
      bad: L3("Brauzer bu so'zni tanimadi va chegarani chizmadi. So'zni tekshiring.", 'Браузер не узнал это слово и не нарисовал рамку. Проверь слово.', 'The browser didn’t recognize that word and didn’t draw the frame. Check the word.'),
      other: L3("Bu boshqa tur. Bizga chiziqchalar kerak.", 'Это другой вид. Нужны чёрточки.', 'That’s a different type. We need dashes.')
    },
    hints: [
      L3("Chiziq turlari: solid, dashed va dotted. Qaysi biri chiziqchalar?", 'Виды линии: solid, dashed и dotted. Какой из них — чёрточки?', 'Line types: solid, dashed and dotted. Which one is dashes?'),
      L3("Chiziqchalar dashed deyiladi.", 'Чёрточки называются dashed.', 'Dashes are called dashed.'),
      L3("dashed deb yozing va Tekshirishni bosing.", 'Впиши dashed и нажми «Проверить».', 'Type dashed and tap Check.')
    ],
    ok: L3("Barakalla! Chegara chiziqchalardan iborat.", 'Молодец! Рамка из чёрточек.', 'Well done! The frame is made of dashes.'),
    ask: L3("Chegara chiziqchalardan bo'lsin", 'Сделай рамку из чёрточек', 'Make the border dashed')
  },
  s7: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men chegarali qutini ko'rsataman, siz esa uni qaysi kod chizganini tanlang.",
      'Теперь проверь себя. Я покажу коробку с рамкой, а ты выбери, какой код её нарисовал.',
      'Now check yourself. I’ll show a box with a frame, and you pick which code drew it.'),
    ask: L3("Bu chegarani qaysi kod beradi?", 'Какой код даёт эту рамку?', 'Which code gives this frame?'),
    hint1: L3("Chegaraga qarang: yaxlitmi, chiziqchalimi yoki nuqtalimi?", 'Посмотри на рамку: сплошная, чёрточками или точками?', 'Look at the frame: solid, dashes or dots?'),
    hint2: L3("solid yaxlit, dashed chiziqchalar, dotted nuqtalar. Qalinlik va rangni ham solishtiring.", 'solid — сплошная, dashed — чёрточки, dotted — точки. Сравни ещё толщину и цвет.', 'solid is solid, dashed is dashes, dotted is dots. Compare the thickness and color too.'),
    rounds: [
      { want: 'border: 4px solid black;', opts: ['border: 4px dashed black;', 'border: 4px solid black;', 'border: 4px dotted black;'],
        why: L3("Chegara yaxlit va qora: solid va black.", 'Рамка сплошная и чёрная: solid и black.', 'The frame is solid and black: solid and black.') },
      { want: 'border: 2px dashed orange;', opts: ['border: 2px dashed orange;', 'border: 10px dashed orange;', 'border: 2px solid orange;'],
        why: L3("Ingichka chiziqchalar: ikki piksel va dashed.", 'Тонкие чёрточки: два пикселя и dashed.', 'Thin dashes: two pixels and dashed.') },
      { want: 'border: 6px dotted purple;', opts: ['border: 6px dotted green;', 'border: 6px solid purple;', 'border: 6px dotted purple;'],
        why: L3("Binafsha nuqtalar: dotted va purple.", 'Фиолетовые точки: dotted и purple.', 'Purple dots: dotted and purple.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Chegaralarni bir qarashda o'qiysiz.", 'Всё верно! Ты читаешь рамки с одного взгляда.', 'All correct! You read frames at a glance.')
  },
  s8: {
    eyebrow: L3("Tashqi bo'shliq", 'Внешний отступ', 'Outer space'),
    say: L3("Endi uchinchisi: margin, ya'ni tashqi bo'shliq degani. U qutining tashqarisida, chegaradan keyin turadi va qo'shnilarni nariga suradi. Inspektorda u to'q sariq. Qarang, brauzer o'zi har bir abzasga ozgina margin beradi.",
      'Теперь третье: margin, то есть внешний отступ. Он снаружи коробки, за рамкой, и отодвигает соседей. В Инспекторе он оранжевый. Смотри, браузер сам даёт каждому абзацу небольшой margin.',
      'Now the third one: margin, meaning the outer space. It’s outside the box, beyond the frame, and pushes the neighbours away. In the Inspector it’s orange. Look, the browser gives every paragraph a little margin by itself.'),
    sayZero: L3("margin nol piksel. Qarang: eslatmalar bir-biriga yopishib qoldi, orada hech qanday joy yo'q.",
      'margin ноль пикселей. Смотри: заметки слиплись, между ними совсем нет места.',
      'margin zero pixels. Look: the notes are stuck together, there’s no room between them.'),
    sayBig: L3("Endi o'ttiz piksel. Eslatmalar bir-biridan uzoqlashdi, chetdan ham. Lekin sariq fon kattalashmadi: margin fondan tashqarida, u shaffof.",
      'Теперь тридцать пикселей. Заметки разошлись и отодвинулись от края. Но жёлтый фон не вырос: margin снаружи фона, он прозрачный.',
      'Now thirty pixels. The notes moved apart and away from the edge. But the yellow background didn’t grow: margin is outside the background, it’s transparent.'),
    done: L3("Demak, padding ichkarida, fon bilan birga. margin esa tashqarida, fonsiz, u qo'shnilarni suradi.",
      'Значит, padding — внутри, вместе с фоном. А margin — снаружи, без фона, он отодвигает соседей.',
      'So padding is inside, together with the background. And margin is outside, without the background, and pushes the neighbours away.'),
    askStart: L3("Qarang: to'q sariq — margin", 'Смотри: оранжевое — margin', 'Watch: orange is margin'),
    askZero: L3("Qarang: margin 0px", 'Смотри: margin 0px', 'Watch: margin 0px'),
    askBig: L3("Qarang: margin 30px", 'Смотри: margin 30px', 'Watch: margin 30px'),
    askDone: L3("margin — tashqi bo'shliq", 'margin — внешний отступ', 'margin is the outer space')
  },
  s9: {
    eyebrow: L3("Eslatmalar orasi", 'Между заметками', 'Between the notes'),
    say: L3("Endi siz. Eslatmalar orasida o'ttiz piksel bo'lsin: margin uchun qiymatni yozing.",
      'Теперь ты. Пусть между заметками будет тридцать пикселей: впиши значение для margin.',
      'Your turn. Let there be thirty pixels between the notes: type the value for margin.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Son yoniga px qo'shing.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Bu boshqa masofa. Eslatmalar orasida o'ttiz piksel bo'lishi kerak.", 'Это другое расстояние. Между заметками должно быть тридцать пикселей.', 'That’s a different distance. There should be thirty pixels between the notes.')
    },
    hints: [
      L3("Qiymat son va px.", 'Значение — число и px.', 'The value is a number and px.'),
      L3("Son o'ttiz, birlik px.", 'Число тридцать, единица px.', 'The number is thirty, the unit is px.'),
      L3("O'ttiz sonini yozing, yoniga px qo'ying va Tekshirishni bosing.", 'Впиши число тридцать, допиши px и нажми «Проверить».', 'Type the number thirty, add px and tap Check.')
    ],
    ok: L3("Ajoyib! Eslatmalar orasida o'ttiz piksel, Inspektorda to'q sariq hoshiya.", 'Отлично! Между заметками тридцать пикселей, в Инспекторе — оранжевая полоса.', 'Great! Thirty pixels between the notes, an orange strip in the Inspector.'),
    ask: L3("Eslatmalar orasida 30px bo'lsin", 'Сделай 30px между заметками', 'Put 30px between the notes')
  },
  s10: {
    eyebrow: L3("Ichkarimi, tashqarimi?", 'Внутри или снаружи?', 'Inside or outside?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda xususiyat nomi yashirilgan. Sahifaga qarang va toping: bu padding mi yoki margin mi?",
      'Теперь проверь себя. В коде имя свойства спрятано. Посмотри на страницу и реши: это padding или margin?',
      'Now check yourself. The property name is hidden in the code. Look at the page and decide: is it padding or margin?'),
    ask: L3("Bu padding mi yoki margin mi?", 'Это padding или margin?', 'Is it padding or margin?'),
    hint1: L3("Sariq fonga qarang: u kattalashdimi yoki eslatmalar orasi ochildimi?", 'Посмотри на жёлтый фон: он вырос или заметки раздвинулись?', 'Look at the yellow background: did it grow, or did the notes move apart?'),
    hint2: L3("Fon kattalashsa, bu padding. Eslatmalar uzoqlashsa, bu margin.", 'Вырос фон — это padding. Разошлись заметки — это margin.', 'If the background grew, it’s padding. If the notes moved apart, it’s margin.'),
    items: [
      { code: '20px', right: 'pad', why: L3("Sariq fon kattalashdi, matn chetdan uzoqlashdi: bu padding.", 'Жёлтый фон вырос, текст отошёл от края: это padding.', 'The yellow background grew, the text moved from the edge: it’s padding.') },
      { code: '30px', right: 'mar', why: L3("Fon o'zgarmadi, eslatmalar esa uzoqlashdi: bu margin.", 'Фон не изменился, а заметки разошлись: это margin.', 'The background didn’t change, but the notes moved apart: it’s margin.') },
      { code: '32px', right: 'pad', why: L3("Eslatmalar juda semiz, oralig'i esa odatdagidek: bu padding.", 'Заметки очень толстые, а расстояние обычное: это padding.', 'The notes are very thick, and the gap is normal: it’s padding.') },
      { code: '4px', right: 'mar', why: L3("Eslatmalar deyarli yopishib qoldi, matn esa chetga tegib turibdi: bu kichik margin.", 'Заметки почти слиплись, а текст касается края: это маленький margin.', 'The notes almost touch, and the text touches the edge: it’s a small margin.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! padding va margin ni adashtirmaysiz.", 'Всё верно! Ты не путаешь padding и margin.', 'All correct! You don’t mix up padding and margin.')
  },
  s11: {
    eyebrow: L3("Haqiqiy kenglik", 'Настоящая ширина', 'The real width'),
    say: L3("Endi bitta sir. Eslatmaga width ikki yuz piksel berdik. Inspektorga qarang: hozircha roppa-rosa ikki yuz.",
      'А теперь один секрет. Мы дали заметке width двести пикселей. Посмотри на Инспектор: пока ровно двести.',
      'Now a secret. We gave the note width two hundred pixels. Look at the Inspector: so far exactly two hundred.'),
    sayPad: L3("Endi padding yigirma piksel qo'shamiz. Qarang: eslatma kengaydi, endi ikki yuz qirq! Chunki ichki bo'shliq chapda ham, o'ngda ham qo'shildi.",
      'Добавим padding двадцать пикселей. Смотри: заметка стала шире, уже двести сорок! Ведь отступ добавился и слева, и справа.',
      'Let’s add padding twenty pixels. Look: the note got wider, now two hundred forty! Because the inner space was added on the left and on the right.'),
    sayBorder: L3("Chegara ham besh piksel, u ham ikki tomonda. Endi ikki yuz ellik. width ikki yuz desak ham, quti kattaroq.",
      'Рамка — ещё пять пикселей, тоже с двух сторон. Теперь двести пятьдесят. Хотя в width написано двести, коробка больше.',
      'The frame adds five pixels, also on both sides. Now two hundred fifty. Even though width says two hundred, the box is bigger.'),
    sayBox: L3("Buni box-sizing border-box tuzatadi. U brauzerga aytadi: width butun quti uchun, chegara bilan birga. Qarang, yana roppa-rosa ikki yuz! Ichkaridagi joy esa o'zi torroq bo'ldi.",
      'Это исправляет box-sizing border-box. Он говорит браузеру: width — для всей коробки, вместе с рамкой. Смотри, снова ровно двести! А место внутри само стало уже.',
      'box-sizing border-box fixes it. It tells the browser: width is for the whole box, frame included. Look, exactly two hundred again! And the room inside got narrower by itself.'),
    done: L3("Demak, odatda padding va chegara width ga qo'shiladi. border-box bilan esa quti width da yozilgan kenglikda qoladi.",
      'Значит, обычно padding и рамка прибавляются к width. А с border-box коробка остаётся той ширины, что написана в width.',
      'So normally padding and the frame are added to width. With border-box the box stays the width written in width.'),
    askStart: L3("Qarang: width 200px", 'Смотри: width 200px', 'Watch: width 200px'),
    askPad: L3("Qarang: padding bilan 240", 'Смотри: с padding — 240', 'Watch: with padding, 240'),
    askBorder: L3("Qarang: chegara bilan 250", 'Смотри: с рамкой — 250', 'Watch: with the border, 250'),
    askBox: L3("Qarang: border-box — yana 200", 'Смотри: border-box — снова 200', 'Watch: border-box — 200 again'),
    askDone: L3("border-box: width — butun quti", 'border-box: width — вся коробка', 'border-box: width is the whole box')
  },
  s12: {
    eyebrow: L3("Roppa-rosa 200", 'Ровно 200', 'Exactly 200'),
    say: L3("Endi siz. Eslatmada width ikki yuz va padding yigirma, Inspektor esa ikki yuz qirq ko'rsatyapti. Eslatma roppa-rosa ikki yuz bo'lsin: box-sizing uchun qiymatni yozing.",
      'Теперь ты. У заметки width двести и padding двадцать, а Инспектор показывает двести сорок. Пусть заметка будет ровно двести: впиши значение для box-sizing.',
      'Your turn. The note has width two hundred and padding twenty, and the Inspector shows two hundred forty. Make the note exactly two hundred: type the value for box-sizing.'),
    msgs: {
      empty: L3("Qiymatni yozing: ikki so'z, orasida chiziqcha.", 'Впиши значение: два слова через чёрточку.', 'Type the value: two words joined by a dash.'),
      content: L3("content-box odatiy holat: padding kenglikka qo'shiladi. Boshqa qiymat kerak.", 'content-box — обычный режим: padding прибавляется к ширине. Нужно другое значение.', 'content-box is the normal mode: padding is added to the width. We need the other value.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Ikki so'z chiziqcha bilan, bo'sh joysiz yoziladi.", 'Браузер не узнал это значение. Два слова пишутся через чёрточку, без пробелов.', 'The browser didn’t recognize that value. The two words are joined by a dash, with no spaces.')
    },
    hints: [
      L3("Qiymat butun quti haqida: chegara bilan birga.", 'Значение — про всю коробку, вместе с рамкой.', 'The value is about the whole box, frame included.'),
      L3("Ikki so'z: border va box, orasida chiziqcha.", 'Два слова: border и box, между ними чёрточка.', 'Two words: border and box, with a dash between them.'),
      L3("border-box deb yozing va Tekshirishni bosing.", 'Впиши border-box и нажми «Проверить».', 'Type border-box and tap Check.')
    ],
    ok: L3("Zo'r! Eslatma roppa-rosa ikki yuz piksel, padding esa ichkariga sig'di.", 'Огонь! Заметка ровно двести пикселей, а padding поместился внутри.', 'Awesome! The note is exactly two hundred pixels, and the padding fit inside.'),
    ask: L3("Eslatma roppa-rosa 200px bo'lsin", 'Сделай заметку ровно 200px', 'Make the note exactly 200px')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va buzilgan qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми сломанное правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap the broken rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило?', 'Great, the first one is found! Now something else broke. Which rule?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      unit: L3("Topdingiz! Yigirma sonidan keyin px yo'q edi.", 'Есть! После двадцати не было px.', 'Found it! There was no px after twenty.'),
      style: L3("Topdingiz! Chegarada chiziq turi yo'q edi, shuning uchun u ko'rinmadi.", 'Есть! У рамки не было вида линии, поэтому её не видно.', 'Found it! The frame had no line type, so it wasn’t visible.')
    },
    hint1: L3("Sahifaga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      unit: L3("Eslatmalar ichida bo'shliq bormi? padding qiymatini tekshiring.", 'Есть ли отступ внутри заметок? Проверь значение padding.', 'Is there space inside the notes? Check the padding value.'),
      style: L3("Kodda eslatmalar uchun chegara bor, sahifada esa yo'q. Nima yetishmayapti?", 'В коде у заметок есть рамка, а на странице её нет. Чего не хватает?', 'The code gives the notes a frame, but the page has none. What’s missing?')
    },
    hint3: {
      unit: L3("Xato birinchi qoidada: px yo'q. O'sha qatorni bosing.", 'Ошибка в первом правиле: нет px. Нажми эту строку.', 'The bug is in the first rule: no px. Tap that line.'),
      style: L3("Xato ikkinchi qoidada: chiziq turi yo'q. O'sha qatorni bosing.", 'Ошибка во втором правиле: нет вида линии. Нажми эту строку.', 'The bug is in the second rule: no line type. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz qutilarni haqiqiy dizayner kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь коробки как настоящий дизайнер.', 'Super! Both found. You check boxes like a real designer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Sarlavha atrofida chegara bo'lsin: ikki piksel, yaxlit, qora. Selektor h1.",
      'Теперь напиши правило целиком. Пусть вокруг заголовка будет рамка: два пикселя, сплошная, чёрная. Селектор — h1.',
      'Now write the whole rule yourself. Put a frame around the heading: two pixels, solid, black. The selector is h1.'),
    msgs: {
      empty: L3("Qoidani yozing: avval selektor, keyin figurali qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat orasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Sarlavha uchun h1 selektori kerak.", 'Для заголовка нужен селектор h1.', 'The heading needs the h1 selector.'),
      prop: L3("Chegarani border xususiyati beradi.", 'Рамку задаёт свойство border.', 'The border property sets the frame.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Uch qismni bo'sh joy bilan yozing: qalinlik, tur va rang.", 'Браузер не узнал это значение. Напиши три части через пробел: толщина, вид и цвет.', 'The browser didn’t recognize that value. Write three parts with spaces: thickness, type and color.'),
      noStyle: L3("Chiziq turi yo'q, shuning uchun chegara ko'rinmayapti. solid so'zini qo'shing.", 'Нет вида линии, поэтому рамки не видно. Добавь слово solid.', 'There’s no line type, so the frame isn’t visible. Add the word solid.'),
      other: L3("Chegara chiqdi, lekin boshqacha. Kerak: ikki piksel, solid va black.", 'Рамка есть, но другая. Нужно: два пикселя, solid и black.', 'There’s a frame, but a different one. We need two pixels, solid and black.')
    },
    hints: [
      L3("Qaysi selektor sarlavhani tanlaydi? Qaysi xususiyat chegara beradi?", 'Какой селектор выбирает заголовок? Какое свойство даёт рамку?', 'Which selector picks the heading? Which property gives a frame?'),
      L3("Selektor h1, xususiyat border, qiymat uch qismdan: ikki piksel, solid, black.", 'Селектор h1, свойство border, значение из трёх частей: два пикселя, solid, black.', 'Selector h1, property border, a value of three parts: two pixels, solid, black.'),
      L3("Shunday yozing: h1, figurali qavs, border, ikki nuqta, ikki piksel solid black, nuqtali vergul va yopuvchi figurali qavs.", 'Напиши так: h1, фигурная скобка, border, двоеточие, два пикселя solid black, точка с запятой и закрывающая фигурная скобка.', 'Write it like this: h1, curly brace, border, colon, two pixels solid black, semicolon and the closing curly brace.')
    ],
    ok: L3("Ajoyib! Sarlavha chegara ichida. Qoidani o'zingiz yozdingiz.", 'Отлично! Заголовок в рамке. Правило написано тобой целиком.', 'Great! The heading has a frame. You wrote the whole rule yourself.'),
    ask: L3("Sarlavhaga 2px solid black chegara bering", 'Дай заголовку рамку 2px solid black', 'Give the heading a 2px solid black border')
  },
  s14: {
    eyebrow: L3("O'z eslatmangiz", 'Своя заметка', 'Your own note'),
    say: L3("Endi o'z eslatmangizni bezang. Ichki bo'shliq, chegara va tashqi bo'shliq uchun istalgan qiymatni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь укрась свою заметку. Впиши любые значения для внутреннего отступа, рамки и внешнего отступа. Потом нажми «Готово».',
      'Now decorate your own note. Type any values for the inner space, the frame and the outer space. Then tap “Done”.'),
    msgs: {
      bad: L3("Brauzer {w} qiymatini tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал значение {w}. Напиши число и px без пробела.', 'The browser didn’t recognize {w}. Write a number and px with no space.'),
      badB: L3("Brauzer chegarani tanimadi. Uch qism yozing: qalinlik, tur va rang.", 'Браузер не узнал рамку. Напиши три части: толщина, вид и цвет.', 'The browser didn’t recognize the frame. Write three parts: thickness, type and color.'),
      noStyle: L3("Chegarada chiziq turi yo'q: solid, dashed yoki dotted qo'shing.", 'У рамки нет вида линии: добавь solid, dashed или dotted.', 'The frame has no line type: add solid, dashed or dotted.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("padding va margin uchun son va px, chegara uchun esa qalinlik, tur va rang.", 'Для padding и margin — число и px, а для рамки — толщина, вид и цвет.', 'For padding and margin, a number and px; for the frame, thickness, type and color.'),
      L3("Masalan: padding o'n olti piksel, chegara uch piksel dashed purple, margin yigirma piksel. Keyin «Tayyor»ni bosing.", 'Например: padding шестнадцать пикселей, рамка три пикселя dashed purple, margin двадцать пикселей. Потом нажми «Готово».', 'For example: padding sixteen pixels, a frame of three pixels dashed purple, margin twenty pixels. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning eslatmangiz.", 'Ого, как красиво! Это твоя заметка.', 'Wow, how pretty! This is your note.'),
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
    hint1: L3("Gap qaysi xususiyat haqida: padding, margin, border yoki box-sizing?", 'О каком свойстве фраза: padding, margin, border или box-sizing?', 'Which property is the sentence about: padding, margin, border or box-sizing?'),
    hint2: L3("Esingizdami: padding ichkarida va fon bilan, margin tashqarida, border uchun chiziq turi kerak, border-box esa kenglikni saqlaydi.", 'Вспомни: padding — внутри и с фоном, margin — снаружи, у border нужен вид линии, а border-box держит ширину.', 'Remember: padding is inside with the background, margin is outside, border needs a line type, and border-box keeps the width.'),
    items: [
      { t: L3("padding matn bilan chegara orasidagi ichki bo'shliq.", 'padding — внутренний отступ между текстом и рамкой.', 'padding is the inner space between the text and the frame.'), right: true,
        why: L3("To'g'ri: padding ichkarida, chegaraning ichida.", 'Верно: padding внутри, внутри рамки.', 'Right: padding is inside, within the frame.') },
      { t: L3("margin eslatmaning sariq fonini kattalashtiradi.", 'margin делает жёлтый фон заметки больше.', 'margin makes the note’s yellow background bigger.'), right: false,
        why: L3("Aslida margin tashqarida va shaffof: fon kattalashmaydi, qo'shnilar esa nariga suriladi.", 'На самом деле margin снаружи и прозрачный: фон не растёт, а соседи отодвигаются.', 'Actually margin is outside and transparent: the background doesn’t grow, the neighbours move away.') },
      { t: L3("Bu qoida qizil chegara chizadi.", 'Это правило рисует красную рамку.', 'This rule draws a red frame.'), right: false, code: 'brd',
        why: L3("Aslida chiziq turi yo'q, shuning uchun chegara chizilmaydi.", 'На самом деле нет вида линии, поэтому рамка не рисуется.', 'Actually there’s no line type, so the frame isn’t drawn.') },
      { t: L3("border-box bilan width ikki yuz piksel bo'lsa, padding qo'shilsa ham quti ikki yuz piksel qoladi.", 'С border-box при width двести пикселей коробка остаётся двести пикселей, даже если добавить padding.', 'With border-box and width two hundred pixels, the box stays two hundred pixels even with padding added.'), right: true,
        why: L3("To'g'ri: border-box padding va chegarani kenglik ichiga oladi.", 'Верно: border-box включает padding и рамку в ширину.', 'Right: border-box puts the padding and the frame inside the width.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz Box Model ni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в Box Model.', 'All correct! You know the Box Model really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men eslatmalarni uzoqlashtirish uchun padding o'ttiz piksel yozgan edim? Qarang: eslatmalar semirdi, oralig'i esa o'zgarmadi. Men adashibman! padding ichkarida joy beradi.",
        'Вернёмся к загадке. Помнишь, чтобы раздвинуть заметки, я написал padding тридцать пикселей? Смотри: заметки стали толще, а расстояние между ними не изменилось. Я ошибся! padding даёт место внутри.',
        'Back to our riddle. Remember, I wrote padding thirty pixels to move the notes apart? Look: the notes got thicker, but the gap between them didn’t change. I was wrong! padding gives room inside.'), k: 'riddle' },
      { text: L3("Eslatmalarni uzoqlashtirish uchun margin kerak edi. Mana, margin o'ttiz piksel: endi ular bir-biridan uzoqda.",
        'Чтобы раздвинуть заметки, нужен был margin. Вот margin тридцать пикселей: теперь они далеко друг от друга.',
        'To move the notes apart, I needed margin. Here’s margin thirty pixels: now they’re far apart.'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning eslatmangiz, o'zingiz tanlagan qiymatlar bilan!", 'Смотри, это твоя заметка с твоими собственными значениями!', 'Look, this is your note with the values you picked yourself!'), k: 'own' },
      { text: L3("padding ichki bo'shliq, u fon bilan birga.", 'padding — внутренний отступ, он вместе с фоном.', 'padding is the inner space, together with the background.'), k: 'pad' },
      { text: L3("margin tashqi bo'shliq, u qo'shnilarni suradi.", 'margin — внешний отступ, он отодвигает соседей.', 'margin is the outer space, it pushes the neighbours away.'), k: 'mar' },
      { text: L3("border uch qismdan iborat: qalinlik, tur va rang.", 'border состоит из трёх частей: толщина, вид и цвет.', 'border has three parts: thickness, type and color.'), k: 'brd' },
      { text: L3("box-sizing border-box esa qutini width da yozilgan kenglikda saqlaydi.", 'А box-sizing border-box держит коробку той ширины, что написана в width.', 'And box-sizing border-box keeps the box the width written in width.'), k: 'bs' },
      { text: L3("Tabriklayman! Endi har bir element chiroyli quti. Keyingi darsda kartochkalarni yanada chiroyli qilamiz: burchaklarni yumaloqlaymiz va soya beramiz. Ko'rishguncha!",
        'Ура! Теперь каждый элемент — аккуратная коробка. На следующем уроке сделаем карточки ещё красивее: скруглим углы и добавим тень. До встречи!',
        'Hooray! Now every element is a neat box. Next lesson we’ll make cards even prettier: round the corners and add a shadow. See you!') }
    ],
    roles: {
      pad: L3("padding — ichki", 'padding — внутри', 'padding — inside'),
      mar: L3("margin — tashqi", 'margin — снаружи', 'margin — outside'),
      brd: L3("border — qalinlik, tur, rang", 'border — толщина, вид, цвет', 'border — thickness, type, color'),
      bs: L3("border-box — kenglik saqlanadi", 'border-box — ширина та же', 'border-box — width stays')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayPad: 1, sayBig: 1, saySolid: 1, sayDashed: 1,
  sayDotted: 1, sayNoStyle: 1, sayZero: 1, sayBorder: 1, sayBox: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c7-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c7.css@*/
`;
