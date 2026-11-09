// =============================================================================
// КУРС «CSS» · Урок 12 — «Позиционирование»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css12/build.mjs → lessons/css/12-pozicionirovanie.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 12 · «Позиционирование» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–11: правило, селекторы, цвета, фон, текст, размеры, Box Model, карточки, display,
// Flexbox. Коди хочет метку «НОВОЕ» в углу карточки игры и кнопку «Наверх», которая не уезжает при прокрутке. Ученик
// узнаёт position: relative (сдвиг от своего места, место остаётся; top толкает вниз, left — вправо), absolute (вне
// потока, относительно ближайшего родителя-якоря с position; без якоря — от страницы) и fixed (прилипает к окну
// браузера), и что сдвиги top / right / bottom / left без position не работают. Загадка (без имён): Коди пишет
// absolute и угол только метке и ждёт угол карточки. Разгадка: метка улетает в угол страницы — якоря нет.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (метка в строке текста → relative у карточки, absolute у метки; загадка про якорь)
//   relative: s2 показ (relative · top 20 — вниз · left 40 — вправо) · s3 вписать relative (Fill) · s4 сдвиг ↔ куда поехал (Matching)
//   absolute: s5 показ (вне потока · в угол страницы · relative у карточки — угол карточки) · s6 вписать relative родителю (Fill) · s7 где метка (выбор)
//   fixed:    s8 показ (absolute уезжает при прокрутке · fixed остаётся в окне) · s9 вписать fixed (Fill) · s10 какое значение нужно (Sort)
//   поломки:  s11 показ (top без position, positon, top: 20) · s12 исправить «relativ» (Debug & Fix) · s13 найти правило
//   w1 правило из трёх свойств: .belgi { position: absolute; bottom: 0px; left: 0px; } · s14 своя метка («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: relative и absolute считает сам браузер — страница в окне обычный поток (static), как body,
//     поэтому absolute без якоря держится за страницу окна. fixed — слой, прилипший к видимой части окна браузера урока
//     (sticky): страница прокручивается, слой — нет, как у настоящего fixed. Верная ли запись — решает Chrome.
//   · Не забегаем: z-index, sticky, transform (урок 13).
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: nisbiy — relative; mutlaq — absolute; mahkamlangan — fixed; langar — якорь; oqim — поток; belgi —
// метка; siljish — сдвиг. В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-12-pozicionirovanie',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '12-dars. Pozitsiyalash',
    ru: 'Урок 12. Позиционирование',
    en: 'Lesson 12. Positioning'
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
  next: L3("Hover va transform", 'Hover и transform', 'Hover and transform'),
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
  // Страницы урока (не звучат).
  site: {
    title: L3("Kodining o'yinlari", 'Игры Коди', 'Kodi’s games'),
    badge: L3("YANGI", 'НОВОЕ', 'NEW'),
    card: L3("Bugun yangi o'yin chiqdi: Kosmik poyga!", 'Сегодня вышла новая игра: Космические гонки!', 'A new game came out today: Space Race!'),
    p: L3("Uni hoziroq sinab ko'ring.", 'Попробуй её прямо сейчас.', 'Try it right now.')
  },
  long: {
    title: L3("Kodining kundaligi", 'Дневник Коди', 'Kodi’s diary'),
    p1: L3("Dushanba. Bugun maktabda CSS o'rgandik. Sahifam endi rangli va chiroyli.", 'Понедельник. Сегодня в школе учили CSS. Моя страница теперь цветная и красивая.', 'Monday. Today at school we learned CSS. My page is colorful and pretty now.'),
    p2: L3("Seshanba. Do'stim bilan futbol o'ynadik. Ikki gol urdim va jamoamiz yutdi.", 'Вторник. Играли с другом в футбол. Я забил два гола, и наша команда победила.', 'Tuesday. My friend and I played football. I scored two goals and our team won.'),
    p3: L3("Chorshanba. Kutubxonadan kosmos haqida kitob oldim. Unda Mars haqida juda qiziq rasmlar bor.", 'Среда. Взял в библиотеке книгу о космосе. В ней очень интересные картинки про Марс.', 'Wednesday. I got a book about space from the library. It has really interesting pictures of Mars.'),
    p4: L3("Payshanba. Yangi o'yin yasadim va uni sinfdoshlarimga ko'rsatdim. Hammaga yoqdi!", 'Четверг. Сделал новую игру и показал одноклассникам. Всем понравилось!', 'Thursday. I made a new game and showed it to my classmates. Everyone liked it!'),
    btn: L3("↑ Yuqoriga", '↑ Наверх', '↑ To top')
  },
  s1: {
    eyebrow: L3("YANGI belgisi", 'Метка «НОВОЕ»', 'The NEW badge'),
    say: L3("Salom! Men yangi o'yin kartochkasiga YANGI belgisini qo'ydim. Lekin qarang: belgi matn qatorida turibdi, xuddi oddiy so'zdek. Men uni kartochkaning yuqori o'ng burchagida ko'rmoqchiman, haqiqiy do'konlardagidek. «Aylantirish» tugmasini bosing.",
      'Привет! Я поставил на карточку новой игры метку «НОВОЕ». Но смотри: метка стоит в строке текста, как обычное слово. Я хочу видеть её в правом верхнем углу карточки, как в настоящих магазинах. Нажми «Превратить».',
      'Hi! I put a NEW badge on the new game’s card. But look: the badge sits in the line of text, like an ordinary word. I want it in the top-right corner of the card, like in real stores. Tap “Transform”.'),
    magic: L3("Mana! Belgi matndan chiqib, kartochkaning burchagiga uchib o'tdi.", 'Вот! Метка вылетела из текста и перелетела в угол карточки.', 'There! The badge left the text and flew to the corner of the card.'),
    magicP: L3("Buni position xususiyati qildi, ya'ni element qayerda turishi degani. Kartochkaga relative, belgiga esa absolute berdik.", 'Это сделало свойство position, то есть где стоит элемент. Карточке мы дали relative, а метке — absolute.', 'The position property did it, meaning where an element stands. We gave the card relative and the badge absolute.'),
    done: L3("Bugun elementlarni sahifaning istalgan joyiga qo'yishni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta faqat belgiga absolute va burchak yozgan edim, kartochkaga esa hech narsa yozmagan edim. Menimcha, belgi baribir kartochka burchagiga boradi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься ставить элементы в любое место страницы. Но сначала загадка. В первый раз я написал absolute и угол только метке, а карточке — ничего. По-моему, метка всё равно окажется в углу карточки. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to place elements anywhere on the page. But first, a riddle. The first time, I wrote absolute and the corner only on the badge, and nothing on the card. I think the badge will still land in the card’s corner. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("relative · absolute", 'relative · absolute', 'relative · absolute')
  },
  s2: {
    eyebrow: L3("relative", 'relative', 'relative'),
    help: [
      L3("Ikkinchi qutiga qarang: u siljiydi, lekin uning eski joyi bo'sh qoladi, uchinchi quti esa joyidan qimirlamaydi.", 'Посмотри на вторую коробку: она сдвигается, но её прежнее место остаётся пустым, а третья коробка не двигается.', 'Look at the second box: it moves, but its old spot stays empty, and the third box doesn’t move.'),
      L3("relative elementni o'z joyidan siljitadi. top yuqoridan chekinish beradi, shuning uchun quti pastga tushadi. left esa chapdan, shuning uchun o'ngga.", 'relative сдвигает элемент от его места. top — отступ сверху, поэтому коробка уходит вниз. left — отступ слева, поэтому вправо.', 'relative shifts an element from its own spot. top is a gap from the top, so the box goes down. left is a gap from the left, so it goes right.'),
      L3("Sinfda partadan turib, bir qadam chetga chiqing: sizning joyingiz bo'sh qoladi va sizni kutadi. relative ham shunday.", 'Встань из-за парты и отойди на шаг: твоё место остаётся пустым и ждёт тебя. relative работает так же.', 'Get up from your desk and step aside: your seat stays empty and waits for you. relative works the same way.')
    ],
    say: L3("Bu yerda uchta quti bor. Odatda hamma elementlarda position static bo'ladi: ular navbat bilan turadi va siljishlarni eshitmaydi. Ikkinchi qutiga position relative beramiz, ya'ni nisbiy degani: u o'z joyidan siljiydi.", "Здесь три коробки. Обычно у всех элементов position static: они стоят по порядку и сдвиги не слушают. Дадим второй коробке position relative, то есть относительно: она сдвигается от своего места.", "There are three boxes here. Normally every element has position static: they stand in order and ignore offsets. Let’s give the second box position relative, meaning relative: it moves from its own place."),
    sayRel: L3("Qarang, hech narsa o'zgarmadi. relative ning o'zi joyidan qimirlamaydi, unga qayerga siljishni aytish kerak.", 'Смотри, ничего не изменилось. Сам по себе relative не двигает, ему нужно сказать, куда сдвинуться.', 'Look, nothing changed. relative alone doesn’t move anything; you have to tell it where to move.'),
    sayTop: L3("top yigirma piksel. Diqqat qiling: quti pastga tushdi! top tepadan masofa degani, shuning uchun quti tepasidan yigirma piksel uzoqlashdi. Uning eski joyi esa bo'sh qoldi.", 'top двадцать пикселей. Внимание: коробка опустилась вниз! top — это отступ сверху, поэтому коробка отодвинулась от верха на двадцать пикселей. А её прежнее место осталось пустым.', 'top twenty pixels. Watch: the box went down! top is the distance from the top, so the box moved twenty pixels away from the top. Its old place stayed empty.'),
    sayLeft: L3("left qirq piksel: chapdan uzoqlashdi, ya'ni o'ngga siljidi. Uchinchi quti esa joyidan qimirlamadi.", 'left сорок пикселей: отодвинулась от левого края, то есть вправо. А третья коробка осталась на месте.', 'left forty pixels: it moved away from the left, that is, to the right. The third box didn’t move.'),
    done: L3("Demak, relative element o'z joyidan siljiydi, eski joyi esa uni kutib bo'sh turadi.", 'Значит, relative сдвигает элемент от его места, а прежнее место остаётся пустым и ждёт его.', 'So relative moves an element from its place, and the old place stays empty, waiting for it.'),
    askStart: L3("Qarang: uchta quti", 'Смотри: три коробки', 'Watch: three boxes'),
    askRel: L3("Qarang: relative — hali joyida", 'Смотри: relative — пока на месте', 'Watch: relative, still in place'),
    askTop: L3("Qarang: top 20px — pastga", 'Смотри: top 20px — вниз', 'Watch: top 20px moves down'),
    askLeft: L3("Qarang: left 40px — o'ngga", 'Смотри: left 40px — вправо', 'Watch: left 40px moves right'),
    askDone: L3("relative — o'z joyidan siljish", 'relative — сдвиг от своего места', 'relative moves from its own place')
  },
  s3: {
    eyebrow: L3("Siljiting", 'Сдвинь', 'Move it'),
    say: L3("Endi navbat sizga. Ikkinchi qutiga top va left yozilgan, lekin u qimirlamayapti. U o'z joyidan siljisin: position qiymatini yozing.",
      'Теперь твоя очередь. Второй коробке написаны top и left, но она не двигается. Пусть она сдвинется от своего места: впиши значение position.',
      'Now it’s your turn. The second box has top and left, but it doesn’t move. Let it move from its own place: type the position value.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      bad: L3("Brauzer bu so'zni tanimadi. position uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для position.', 'The browser didn’t recognize that word. Check the word for position.'),
      static: L3("static bilan quti joyidan qimirlamaydi: bu odatdagi holat.", 'Со static коробка не двигается: это обычный режим.', 'With static the box doesn’t move: that’s the normal mode.'),
      absolute: L3("absolute bilan quti o'z joyini tashlab ketdi, uchinchisi uning o'rniga chiqdi. Joyi saqlanib qolsin.", 'С absolute коробка бросила своё место, и третья заняла его. А место должно сохраниться.', 'With absolute the box left its place, and the third one took it. The place should be kept.'),
      fixed: L3("fixed oynaga yopishadi. Bizga o'z joyidan siljish kerak.", 'fixed прилипает к окну. А нужен сдвиг от своего места.', 'fixed sticks to the window. We need a move from its own place.'),
      other: L3("Bu boshqa qiymat. O'z joyidan siljish kerak.", 'Это другое значение. Нужен сдвиг от своего места.', 'That’s a different value. We need a move from its own place.')
    },
    hints: [
      L3("Qaysi qiymat elementni o'z joyidan siljitadi?", 'Какое значение сдвигает элемент от его места?', 'Which value moves an element from its own place?'),
      L3("Nisbiy degani relative.", 'Относительно — relative.', 'Relative is relative.'),
      L3("relative deb yozing va Tekshirishni bosing.", 'Впиши relative и нажми «Проверить».', 'Type relative and tap Check.')
    ],
    ok: L3("Zo'r! Quti siljidi, eski joyi esa bo'sh turibdi.", 'Огонь! Коробка сдвинулась, а прежнее место пустует.', 'Awesome! The box moved, and its old place is empty.'),
    ask: L3("Ikkinchi qutini siljiting", 'Сдвинь вторую коробку', 'Move the second box')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi siljishlarni juftlang. Chapdan siljishni, o'ngdan esa quti shu yo'nalishga ketgan rasmni bosing. Punktir quti eski joyini ko'rsatadi.",
      'Теперь соедини сдвиги. Нажми сдвиг слева, а потом картинку, где коробка уехала так, справа. Пунктир показывает прежнее место.',
      'Now match the offsets. Tap an offset on the left, then the picture where the box moved that way on the right. The dashed outline shows the old place.'),
    dir: {
      top: L3("pastga", 'вниз', 'down'),
      left: L3("o'ngga", 'вправо', 'right'),
      bottom: L3("tepaga", 'вверх', 'up')
    },
    why: {
      top: L3("top tepadan masofa: quti tepadan uzoqlashadi, ya'ni pastga tushadi.", 'top — отступ сверху: коробка отходит от верха, то есть опускается.', 'top is the distance from the top: the box moves away from the top, so it goes down.'),
      left: L3("left chapdan masofa: quti chapdan uzoqlashadi, ya'ni o'ngga ketadi.", 'left — отступ слева: коробка отходит от левого края, то есть вправо.', 'left is the distance from the left: the box moves away from the left, so it goes right.'),
      bottom: L3("bottom pastdan masofa: quti pastdan uzoqlashadi, ya'ni tepaga chiqadi.", 'bottom — отступ снизу: коробка отходит от низа, то есть поднимается.', 'bottom is the distance from the bottom: the box moves away from the bottom, so it goes up.')
    },
    pairOk: {
      top: L3("To'g'ri, top pastga suradi.", 'Верно, top толкает вниз.', 'Right, top pushes it down.'),
      left: L3("To'g'ri, left o'ngga suradi.", 'Верно, left толкает вправо.', 'Right, left pushes it right.'),
      bottom: L3("To'g'ri, bottom tepaga suradi.", 'Верно, bottom толкает вверх.', 'Right, bottom pushes it up.')
    },
    pickFirst: L3("Oldin chapdan siljishni tanlang.", 'Сначала выбери сдвиг слева.', 'First pick an offset on the left.'),
    hints: [
      L3("Siljish so'zi qaysi tomondan uzoqlashishni aytadi.", 'Слово сдвига говорит, от какой стороны отойти.', 'The offset word says which side to move away from.'),
      L3("top pastga, left o'ngga, bottom tepaga suradi.", 'top толкает вниз, left — вправо, bottom — вверх.', 'top pushes down, left pushes right, bottom pushes up.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Siljishlar sizni chalg'itmaydi.", 'Отлично! Сдвиги тебя не обманут.', 'Great! The offsets can’t fool you.'),
    ask: L3("Siljishni, keyin rasmni bosing", 'Нажми сдвиг, потом картинку', 'Tap an offset, then a picture'),
    askPlace: L3("Endi shunday rasmni bosing", 'Теперь нажми такую картинку', 'Now tap that picture')
  },
  s5: {
    eyebrow: L3("absolute", 'absolute', 'absolute'),
    help: [
      L3('Belgiga qarang: u avval matndan chiqadi, keyin sahifa burchagiga, oxirida esa kartochka burchagiga uchadi.', 'Посмотри на метку: сначала она выходит из текста, потом улетает в угол страницы, а в конце — в угол карточки.', 'Look at the badge: first it leaves the text, then flies to the page corner, and finally to the card corner.'),
      L3("absolute elementni qatordan chiqarib, burchakka qo'yadi. Qaysi burchakka? Tashqaridagi, position berilgan qutining burchagiga. Shuning uchun kartochkaga relative yoziladi.", "absolute вынимает элемент из ряда и ставит в угол. В угол чего? Той коробки снаружи, у которой есть position. Поэтому карточке пишут relative.", "absolute takes an element out of the row and puts it in a corner. Which corner? The corner of the outer box that has position. That’s why the card gets relative."),
      L3('Muzlatgichga magnit yopishtirasiz: u muzlatgich burchagida turadi, xona burchagida emas. Muzlatgich bu langar, magnit esa absolute.', 'Магнит на холодильнике держится в углу холодильника, а не в углу комнаты. Холодильник — якорь, магнит — absolute.', 'A magnet on a fridge sits in the fridge’s corner, not the room’s corner. The fridge is the anchor, the magnet is absolute.')
    ],
    say: L3("Endi absolute. U elementni umumiy qatordan olib chiqadi: qo'shnilar uni endi ko'rmaydi va uning joyini egallaydi. Elementning o'zini esa istalgan burchakka qo'yish mumkin. Belgiga qarang.", "Теперь absolute. Он вынимает элемент из общего ряда: соседи его больше не замечают и занимают его место. А сам элемент можно поставить в любой угол. Смотри на метку.", "Now absolute. It takes an element out of the shared row: the neighbors stop noticing it and take its place. And the element itself can go into any corner. Watch the badge."),
    sayOut: L3("position absolute: belgi qatordan chiqdi, matn esa darhol uning joyini egalladi.", "position absolute: метка вышла из строки, и текст сразу занял её место.", "position absolute: the badge left the line, and the text took its place right away."),
    sayCorner: L3("top nol, right nol: belgi burchakka uchdi. Lekin kartochka burchagiga emas, butun sahifa burchagiga! absolute o'zi yotgan va position berilgan qutini qidiradi. Kartochkada position yo'q, shuning uchun belgi sahifaga yopishdi.", "top ноль, right ноль: метка улетела в угол. Но не в угол карточки, а в угол всей страницы! absolute ищет коробку, в которой лежит и у которой есть position. У карточки position нет — и метка держится за страницу.", "top zero, right zero: the badge flew into a corner. But not the card’s corner, the whole page’s corner! absolute looks for a box it sits in that has position. The card has no position, so the badge holds on to the page."),
    sayParent: L3("Kartochkaga position relative beramiz. Endi belgi kartochkaga yopishdi, kartochka uning langari bo'ldi, va belgi aynan uning burchagiga keldi.", "Дадим карточке position relative. Теперь метка держится за карточку — карточка стала её якорем. И метка встала точно в её угол.", "Give the card position relative. Now the badge holds on to the card, the card became its anchor, and the badge landed right in its corner."),
    done: L3("Demak, absolute oqimdan chiqadi va eng yaqin langar otaga nisbatan turadi. Langar bo'lishi uchun otaga relative yoziladi.", 'Значит, absolute выходит из потока и встаёт относительно ближайшего родителя-якоря. Чтобы родитель стал якорем, ему пишут relative.', 'So absolute leaves the flow and stands relative to the nearest anchor parent. To make the parent an anchor, you give it relative.'),
    askStart: L3("Qarang: belgi matnda", 'Смотри: метка в тексте', 'Watch: the badge is in the text'),
    askOut: L3("Qarang: absolute — oqimdan chiqdi", 'Смотри: absolute — вышла из потока', 'Watch: absolute leaves the flow'),
    askCorner: L3("Qarang: sahifa burchagida", 'Смотри: в углу страницы', 'Watch: in the page’s corner'),
    askParent: L3("Qarang: relative ota — langar", 'Смотри: relative у родителя — якорь', 'Watch: relative on the parent is the anchor'),
    askDone: L3("absolute — langar otaga nisbatan", 'absolute — относительно родителя-якоря', 'absolute is relative to the anchor parent')
  },
  s6: {
    eyebrow: L3("Langar", 'Якорь', 'The anchor'),
    say: L3("Endi siz. Belgiga absolute va burchak yozilgan, lekin u sahifa burchagiga uchib ketgan. Kartochka langar bo'lsin: kartochka uchun position qiymatini yozing.",
      'Теперь ты. У метки есть absolute и угол, но она улетела в угол страницы. Пусть карточка станет якорем: впиши значение position для карточки.',
      'Your turn. The badge has absolute and a corner, but it flew to the page’s corner. Make the card the anchor: type the position value for the card.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      bad: L3("Brauzer bu so'zni tanimadi. position uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для position.', 'The browser didn’t recognize that word. Check the word for position.'),
      static: L3("static langar bo'la olmaydi: belgi hali sahifa burchagida.", 'static не может быть якорем: метка всё ещё в углу страницы.', 'static can’t be an anchor: the badge is still in the page’s corner.'),
      absolute: L3("Endi kartochkaning o'zi oqimdan chiqib ketdi. Kartochka joyida qolsin, faqat langar bo'lsin.", 'Теперь сама карточка вышла из потока. Пусть карточка остаётся на месте, просто станет якорем.', 'Now the card itself left the flow. Let the card stay in place and just become the anchor.'),
      fixed: L3("fixed bilan kartochka oynaga yopishdi. U joyida qolib, faqat langar bo'lsin.", 'С fixed карточка прилипла к окну. Пусть она остаётся на месте и просто будет якорем.', 'With fixed the card stuck to the window. Let it stay in place and just be the anchor.'),
      other: L3("Bu boshqa qiymat. Joyida turadigan langar kerak.", 'Это другое значение. Нужен якорь, который стоит на месте.', 'That’s a different value. We need an anchor that stays in place.')
    },
    hints: [
      L3("Qaysi qiymat elementni joyida qoldirib, langar qiladi?", 'Какое значение оставляет элемент на месте и делает его якорем?', 'Which value keeps the element in place and makes it an anchor?'),
      L3("Langar uchun odatda relative yoziladi.", 'Для якоря обычно пишут relative.', 'For an anchor you usually write relative.'),
      L3("relative deb yozing va Tekshirishni bosing.", 'Впиши relative и нажми «Проверить».', 'Type relative and tap Check.')
    ],
    ok: L3("Barakalla! Belgi kartochka burchagida.", 'Молодец! Метка в углу карточки.', 'Well done! The badge is in the card’s corner.'),
    ask: L3("Kartochka langar bo'lsin", 'Сделай карточку якорем', 'Make the card the anchor')
  },
  s7: {
    eyebrow: L3("Belgi qayerda?", 'Где метка?', 'Where’s the badge?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kartochka langar, belgi absolute. Belgining joyiga qarang va qaysi siljishlar uni o'sha yerga qo'yganini tanlang.",
      'Теперь проверь себя. Карточка — якорь, метка — absolute. Посмотри, где метка, и выбери, какие сдвиги её туда поставили.',
      'Now check yourself. The card is the anchor, the badge is absolute. Look where the badge is and pick which offsets put it there.'),
    ask: L3("Qaysi siljishlar belgini shu yerga qo'ydi?", 'Какие сдвиги поставили метку сюда?', 'Which offsets put the badge here?'),
    hint1: L3("Belgi qaysi burchakda: tepadami yoki pastda, chapdami yoki o'ngda?", 'В каком углу метка: сверху или снизу, слева или справа?', 'Which corner is the badge in: top or bottom, left or right?'),
    hint2: L3("absolute da top tepaga, bottom pastga, left chapga, right o'ngga yopishtiradi.", 'При absolute top прижимает к верху, bottom — к низу, left — к левому краю, right — к правому.', 'With absolute, top sticks it to the top, bottom to the bottom, left to the left, right to the right.'),
    rounds: [
      { want: 'top: 0px; right: 0px;', opts: ['top: 0px; left: 0px;', 'top: 0px; right: 0px;', 'bottom: 0px; right: 0px;'],
        why: L3("Belgi tepada va o'ngda: top va right.", 'Метка сверху и справа: top и right.', 'The badge is at the top right: top and right.') },
      { want: 'bottom: 0px; left: 0px;', opts: ['bottom: 0px; left: 0px;', 'top: 0px; left: 0px;', 'bottom: 0px; right: 0px;'],
        why: L3("Belgi pastda va chapda: bottom va left.", 'Метка снизу и слева: bottom и left.', 'The badge is at the bottom left: bottom and left.') },
      { want: 'bottom: 0px; right: 0px;', opts: ['top: 0px; right: 0px;', 'bottom: 0px; left: 0px;', 'bottom: 0px; right: 0px;'],
        why: L3("Belgi pastda va o'ngda: bottom va right.", 'Метка снизу и справа: bottom и right.', 'The badge is at the bottom right: bottom and right.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Burchaklarni bir qarashda o'qiysiz.", 'Всё верно! Ты читаешь углы с одного взгляда.', 'All correct! You read corners at a glance.')
  },
  s8: {
    eyebrow: L3("fixed", 'fixed', 'fixed'),
    help: [
      L3('Sahifa aylantirilganda tugmaga qarang: avval u sahifa bilan birga ketadi, fixed dan keyin esa oyna burchagida qoladi.', 'Посмотри на кнопку, когда страница прокручивается: сначала она уезжает вместе со страницей, а после fixed стоит в углу окна.', 'Watch the button as the page scrolls: first it moves with the page, but after fixed it stays in the window’s corner.'),
      L3('fixed elementni brauzer oynasiga yopishtiradi: sahifa aylantirilsa ham u joyida turadi. absolute esa sahifa bilan birga harakatlanadi.', 'fixed прилепляет элемент к окну браузера: он стоит на месте, даже когда страница прокручивается. А absolute едет вместе со страницей.', 'fixed sticks an element to the browser window: it stays put even when the page scrolls. absolute moves together with the page.'),
      L3("Mashina oynasiga yopishtirilgan stiker yo'l o'tib ketsa ham joyida qoladi. fixed tugma ham sahifa o'tib ketsa, oynada qoladi.", 'Наклейка на окне машины остаётся на месте, хотя дорога проносится мимо. Кнопка с fixed так же остаётся в окне, пока страница едет.', 'A sticker on a car window stays put while the road rushes by. A fixed button stays in the window the same way while the page moves.')
    ],
    say: L3("Bu uzun sahifa, kundalik. Eng pastda Yuqoriga tugmasi bor. Unga absolute va burchak berdik: sahifa aylantirilmaganida, u o'ng pastki burchakda turadi.", "Это длинная страница, дневник. В самом низу есть кнопка «Наверх». Мы дали ей absolute и угол: пока страница не прокручена, она стоит в правом нижнем углу.", "This is a long page, a diary. At the very bottom there’s a To top button. We gave it absolute and a corner: while the page isn’t scrolled, it stands in the bottom right corner."),
    sayAway: L3("Sahifani pastga aylantiramiz. Qarang: tugma sahifa bilan birga tepaga ketib qoldi. absolute sahifaga yopishgan.", 'Прокрутим страницу вниз. Смотри: кнопка уехала вверх вместе со страницей. absolute держится за страницу.', 'Let’s scroll the page down. Look: the button went up with the page. absolute holds on to the page.'),
    sayFixed: L3("Endi position fixed, ya'ni mahkamlangan degani. Tugma brauzer oynasining burchagiga yopishdi va sahifa aylansa ham joyida turibdi.", 'Теперь position fixed, то есть закреплённый. Кнопка прилипла к углу окна браузера и стоит на месте, хоть страница и прокручена.', 'Now position fixed, meaning fixed in place. The button stuck to the browser window’s corner and stays put even though the page is scrolled.'),
    sayTop: L3("Yana tepaga qaytamiz: tugma baribir oyna burchagida. fixed sahifaga emas, oynaga yopishadi.", 'Вернёмся наверх: кнопка всё так же в углу окна. fixed держится не за страницу, а за окно.', 'Back to the top: the button is still in the window’s corner. fixed holds on to the window, not the page.'),
    done: L3("Demak, fixed element oynaga yopishadi va sahifa bilan aylanmaydi. Yuqoriga tugmasi va menyular shunday qilinadi.", 'Значит, fixed прилипает к окну и не прокручивается вместе со страницей. Так делают кнопку «Наверх» и меню.', 'So fixed sticks to the window and doesn’t scroll with the page. That’s how To top buttons and menus are made.'),
    askStart: L3("Qarang: absolute tugma", 'Смотри: кнопка absolute', 'Watch: an absolute button'),
    askAway: L3("Qarang: aylantirdik — tugma ketdi", 'Смотри: прокрутили — кнопка уехала', 'Watch: scrolled, the button left'),
    askFixed: L3("Qarang: fixed — oynada qoldi", 'Смотри: fixed — осталась в окне', 'Watch: fixed stays in the window'),
    askTop: L3("Qarang: tepada ham oynada", 'Смотри: и наверху в окне', 'Watch: in the window at the top too'),
    askDone: L3("fixed — oynaga yopishadi", 'fixed — прилипает к окну', 'fixed sticks to the window')
  },
  s9: {
    eyebrow: L3("Yuqoriga tugmasi", 'Кнопка «Наверх»', 'The To top button'),
    say: L3("Endi siz. Sahifa pastga aylantirilgan, Yuqoriga tugmasi esa ko'rinmayapti. U doim oyna burchagida tursin: position qiymatini yozing.",
      'Теперь ты. Страница прокручена вниз, а кнопки «Наверх» не видно. Пусть она всегда стоит в углу окна: впиши значение position.',
      'Your turn. The page is scrolled down, and the To top button isn’t visible. Let it always stand in the window’s corner: type the position value.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      bad: L3("Brauzer bu so'zni tanimadi. position uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для position.', 'The browser didn’t recognize that word. Check the word for position.'),
      absolute: L3("absolute sahifaga yopishadi: aylantirsangiz tugma ketib qoladi. Oynaga yopishsin.", 'absolute держится за страницу: прокрутишь — кнопка уедет. Пусть держится за окно.', 'absolute holds on to the page: scroll, and the button leaves. Let it hold on to the window.'),
      relative: L3("relative tugmani o'z joyidan siljitadi, u esa sahifaning oxirida. Oynaga yopishsin.", 'relative сдвигает кнопку от её места, а оно в конце страницы. Пусть держится за окно.', 'relative moves the button from its place, which is at the end of the page. Let it hold on to the window.'),
      static: L3("static bilan tugma sahifa oxirida qoladi. Oynaga yopishsin.", 'Со static кнопка остаётся в конце страницы. Пусть держится за окно.', 'With static the button stays at the end of the page. Let it hold on to the window.'),
      other: L3("Bu boshqa qiymat. Oynaga yopishadigan qiymat kerak.", 'Это другое значение. Нужно значение, которое держится за окно.', 'That’s a different value. We need the value that holds on to the window.')
    },
    hints: [
      L3("Qaysi qiymat oynaga yopishadi va aylanmaydi?", 'Какое значение прилипает к окну и не прокручивается?', 'Which value sticks to the window and doesn’t scroll?'),
      L3("Mahkamlangan degani fixed.", 'Закреплённый — fixed.', 'Fixed in place is fixed.'),
      L3("fixed deb yozing va Tekshirishni bosing.", 'Впиши fixed и нажми «Проверить».', 'Type fixed and tap Check.')
    ],
    ok: L3("Ajoyib! Tugma oyna burchagida, sahifa qanchalik aylanmasin.", 'Отлично! Кнопка в углу окна, как ни прокручивай страницу.', 'Great! The button is in the window’s corner however far you scroll.'),
    ask: L3("Tugma doim oynada tursin", 'Пусть кнопка всегда будет в окне', 'Keep the button in the window')
  },
  s10: {
    eyebrow: L3("Qaysi qiymat?", 'Какое значение?', 'Which value?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men vazifani aytaman, siz esa position uchun qaysi qiymat kerakligini tanlang.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, какое значение position нужно.',
      'Now check yourself. I’ll say a task, and you pick which position value is needed.'),
    ask: L3("Bu vazifa uchun position qanday bo'ladi?", 'Какой position нужен для этой задачи?', 'Which position does this task need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Element oqimda qoladimi, o'z joyidan siljiydimi, langarga yopishadimi yoki oynagami?", 'Элемент остаётся в потоке, сдвигается от своего места, держится за якорь или за окно?', 'Does the element stay in the flow, move from its place, hold on to an anchor, or to the window?'),
    hint2: L3("static oddiy, relative o'z joyidan siljish, absolute langarga, fixed oynaga.", 'static — обычный, relative — сдвиг от своего места, absolute — к якорю, fixed — к окну.', 'static is normal, relative moves from its place, absolute goes to an anchor, fixed to the window.'),
    items: [
      { t: L3("Belgi kartochkaning burchagida tursin.", 'Метка должна стоять в углу карточки.', 'The badge should stand in the card’s corner.'), right: 'absolute',
        why: L3("Burchakka absolute qo'yadi, kartochka esa langar.", 'В угол ставит absolute, а карточка — якорь.', 'absolute puts it in the corner, and the card is the anchor.') },
      { t: L3("Menyu sahifa aylansa ham ekran tepasida tursin.", 'Меню должно оставаться наверху экрана, даже когда страницу прокручивают.', 'The menu should stay at the top of the screen even when the page scrolls.'), right: 'fixed',
        why: L3("Oynaga yopishish fixed bilan.", 'Прилипнуть к окну — это fixed.', 'Sticking to the window is fixed.') },
      { t: L3("Quti joyidan biroz siljisin, eski joyi bo'sh qolsin.", 'Коробка должна чуть сдвинуться, а прежнее место — остаться пустым.', 'The box should move a little, and its old place should stay empty.'), right: 'relative',
        why: L3("O'z joyidan siljish relative.", 'Сдвиг от своего места — relative.', 'Moving from its own place is relative.') },
      { t: L3("Abzas boshqalar qatori oddiy turaversin.", 'Абзац должен стоять как обычно, вместе с остальными.', 'The paragraph should just stand normally with the others.'), right: 'static',
        why: L3("Odatdagi holat static.", 'Обычный режим — static.', 'The normal mode is static.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! To'rtala qiymatni joyida ishlatasiz.", 'Всё верно! Ты применяешь все четыре значения к месту.', 'All correct! You use all four values in the right place.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Har safar kodga qarang: position bormi, so'z to'g'ri yozilganmi, son yonida px bormi? Keyin ikkinchi qutiga qarang.", 'Каждый раз смотри на код: есть ли position, верно ли написано слово, есть ли px у числа? Потом смотри на вторую коробку.', 'Each time, look at the code: is there position, is the word spelled right, does the number have px? Then look at the second box.'),
      L3("top, left, right, bottom faqat position bilan ishlaydi. So'zlar aniq yoziladi, sonlarga esa px kerak.", 'top, left, right и bottom работают только вместе с position. Слова пишутся точно, а у чисел нужен px.', 'top, left, right and bottom only work together with position. Words must be exact, and numbers need px.'),
      L3("Rulsiz velosiped haydab bo'lmaydi, pedalni qancha aylantirmang. Siljishlar ham position siz ishlamaydi.", 'Без руля на велосипеде не поедешь, сколько ни крути педали. Сдвиги так же не работают без position.', 'You can’t ride a bike without handlebars, however hard you pedal. Shifts don’t work without position either.')
    ],
    say: L3("position da ham xatolar bo'ladi. Keling, uchtasini ko'ramiz. Hozir ikkinchi quti relative va yigirma piksel pastga siljigan.",
      'И в position бывают ошибки. Давай посмотрим на три. Сейчас вторая коробка relative и сдвинута на двадцать пикселей вниз.',
      'position has mistakes too. Let’s look at three. Right now the second box is relative and moved twenty pixels down.'),
    sayNoPos: L3("Birinchisi: top bor, position yo'q. Oddiy element siljishlarga qaramaydi, quti joyiga qaytdi.", 'Первая: top есть, а position нет. Обычный элемент не слушает сдвиги, коробка вернулась на место.', 'The first: there’s top but no position. A normal element ignores offsets, so the box went back to its place.'),
    sayTypo: L3("Ikkinchisi: position so'zida harf tushib qolgan. Brauzer bunday xususiyatni bilmaydi va uni tashlab yubordi.", 'Вторая: в слове position пропала буква. Браузер не знает такого свойства и выбросил его.', 'The second: a letter is missing in position. The browser doesn’t know that property and threw it away.'),
    sayNoUnit: L3("Uchinchisi: yigirma sonidan keyin px yo'q. Siljish ishlamadi.", 'Третья: после двадцати нет px. Сдвиг не сработал.', 'The third: there’s no px after twenty. The offset didn’t work.'),
    done: L3("Demak, siljishlar faqat position bilan ishlaydi, so'zlar esa aniq va px bilan yoziladi.", 'Значит, сдвиги работают только вместе с position, а слова пишутся точно и с px.', 'So offsets only work together with position, and words must be exact, with px.'),
    askStart: L3("Qarang: relative va top", 'Смотри: relative и top', 'Watch: relative and top'),
    askNoPos: L3("Qarang: position yo'q", 'Смотри: нет position', 'Watch: no position'),
    askTypo: L3("Qarang: positon — harf yo'q", 'Смотри: positon — нет буквы', 'Watch: positon is missing a letter'),
    askNoUnit: L3("Qarang: px yo'q", 'Смотри: нет px', 'Watch: no px'),
    askDone: L3("Siljish faqat position bilan", 'Сдвиги — только с position', 'Offsets only with position')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men ikkinchi qutini siljitmoqchi edim, lekin u joyidan qimirlamayapti! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я хотел сдвинуть вторую коробку, а она не двигается! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wanted to move the second box, but it won’t budge! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      bad: L3("Brauzer bu so'zni tanimadi. relative bilan harfma-harf solishtiring.", "Браузер не узнал это слово. Сравни с relative буква за буквой.", "The browser didn’t recognize that word. Compare it with relative letter by letter."),
      static: L3("static bilan quti qimirlamaydi. O'z joyidan siljish kerak.", 'Со static коробка не двигается. Нужен сдвиг от своего места.', 'With static the box doesn’t move. We need a move from its own place.'),
      absolute: L3("absolute bilan quti joyini tashlab ketdi. Joyi saqlansin.", 'С absolute коробка бросила своё место. Место должно сохраниться.', 'With absolute the box left its place. The place should be kept.'),
      fixed: L3("fixed oynaga yopishadi. O'z joyidan siljish kerak.", 'fixed прилипает к окну. Нужен сдвиг от своего места.', 'fixed sticks to the window. We need a move from its own place.'),
      other: L3("Bu boshqa qiymat. Faqat harfni qo'shing.", 'Это другое значение. Просто допиши букву.', 'That’s a different value. Just add the letter.'),
      short: L3("Brauzer bu so'zni tanimadi: oxirida bitta harf yetishmayapti.", "Браузер не узнал это слово: в конце не хватает буквы.", "The browser didn’t recognize that word: a letter is missing at the end.")
    },
    hints: [
      L3("So'zni harfma-harf o'qing.", 'Прочитай слово по буквам.', 'Read the word letter by letter.'),
      L3("Oxirida e harfi yetishmayapti.", 'В конце не хватает буквы e.', 'The letter e is missing at the end.'),
      L3("relative deb yozing va Tekshirishni bosing.", 'Впиши relative и нажми «Проверить».', 'Type relative and tap Check.')
    ],
    ok: L3("Ura, ishladi! Quti siljidi.", 'Ура, заработало! Коробка сдвинулась.', 'Hooray, it works! The box moved.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga qarang va o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa sahifa. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь другая страница. Какое правило не работает?', 'Great, the first one is found! Now another page. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      nopos: L3("Topdingiz! position yo'q edi, shuning uchun siljishlar ishlamadi.", 'Есть! Не было position, поэтому сдвиги не работали.', 'Found it! There was no position, so the offsets didn’t work.'),
      typo: L3("Topdingiz! absolute so'zida harf yetishmayotgan edi.", 'Есть! В слове absolute не хватало буквы.', 'Found it! A letter was missing in absolute.')
    },
    hint1: L3("Sahifaga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      nopos: L3("Kodda ikkinchi quti siljishi kerak, u esa joyida. Nima yetishmayapti?", 'В коде вторая коробка должна сдвинуться, а она на месте. Чего не хватает?', 'The code says the second box should move, but it’s in place. What’s missing?'),
      typo: L3("Belgi burchakka chiqmadi. position qiymatini tekshiring.", 'Метка не вышла в угол. Проверь значение position.', 'The badge didn’t go to the corner. Check the position value.')
    },
    hint3: {
      nopos: L3("Ishlamayotgani ikkinchi qoida: position yo'q. O'sha qatorni bosing.", 'Не работает второе правило: нет position. Нажми эту строку.', 'The second rule doesn’t work: no position. Tap that line.'),
      typo: L3("Xato ikkinchi qoidada: absolut. O'sha qatorni bosing.", 'Ошибка во втором правиле: absolut. Нажми эту строку.', 'The bug is in the second rule: absolut. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz joylashuvni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Оба найдены. Ты проверяешь позиционирование как настоящий разработчик.', 'Super! Both found. You check positioning like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Kartochka allaqachon langar. Belgi kartochkaning chap pastki burchagida tursin: absolute, pastdan nol va chapdan nol.",
      'Теперь напиши правило целиком. Карточка уже якорь. Пусть метка стоит в левом нижнем углу карточки: absolute, снизу ноль и слева ноль.',
      'Now write the whole rule yourself. The card is already the anchor. Put the badge in the card’s bottom-left corner: absolute, zero from the bottom and zero from the left.'),
    msgs: {
      empty: L3("Qoidani yozing: avval selektor, keyin figurali qavslar ichida xususiyatlar.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойства.', 'Write the rule: first the selector, then the properties inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat orasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Belgining klassi belgi: selektor nuqta va belgi.", 'Класс метки — belgi: селектор — точка и belgi.', 'The badge’s class is belgi: the selector is a dot and belgi.'),
      noPos: L3("position yo'q, shuning uchun siljishlar ishlamaydi.", 'Нет position, поэтому сдвиги не работают.', 'There’s no position, so the offsets don’t work.'),
      notAbs: L3("Belgi burchakka faqat absolute bilan chiqadi.", 'В угол метка выходит только с absolute.', 'The badge only goes to a corner with absolute.'),
      side: L3("Burchak uchun ikkita siljish kerak: bottom va left.", 'Для угла нужны два сдвига: bottom и left.', 'A corner needs two offsets: bottom and left.'),
      other: L3("Burchak boshqa. Pastki chap burchak kerak: bottom nol va left nol.", 'Угол другой. Нужен левый нижний: bottom ноль и left ноль.', 'That’s a different corner. We need the bottom left: bottom zero and left zero.'),
      bad: L3("Brauzer bu so'zni tanimadi. So'zlarni tekshiring.", 'Браузер не узнал это слово. Проверь слова.', 'The browser didn’t recognize that word. Check the words.'),
      semi: L3("Xususiyatlar o'rtasida nuqtali vergul kerak: har bir qiymatdan keyin nuqtali vergul qo'ying.", "Между свойствами нужна точка с запятой: поставь её после каждого значения.", "Properties need a semicolon between them: put one after each value."),
      space: L3("Son va px o'rtasida bo'sh joy bo'lmaydi: 0px qo'shib yoziladi.", "Между числом и px не нужен пробел: 0px пишется слитно.", "No space between the number and px: 0px is written together.")
    },
    hints: [
      L3("Uchta xususiyat: position va ikkita siljish.", 'Три свойства: position и два сдвига.', 'Three properties: position and two offsets.'),
      L3("position absolute, bottom nol piksel, left nol piksel.", 'position absolute, bottom ноль пикселей, left ноль пикселей.', 'position absolute, bottom zero pixels, left zero pixels.'),
      L3("Namuna kod ostida paydo bo'ldi. Uni maydonga ko'chirib yozing va Tekshirishni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Belgi chap pastki burchakda. Qoidani o'zingiz yozdingiz.", 'Отлично! Метка в левом нижнем углу. Правило написано тобой целиком.', 'Great! The badge is in the bottom-left corner. You wrote the whole rule yourself.'),
    ask: L3("Belgini chap pastki burchakka qo'ying", 'Поставь метку в левый нижний угол', 'Put the badge in the bottom-left corner')
  },
  s14: {
    eyebrow: L3("O'z belgingiz", 'Своя метка', 'Your own badge'),
    say: L3("Endi o'z belgingizni joylang. Kartochka langar, belgi absolute. Tepadan va o'ngdan masofani hamda belgi rangini yozing. Keyin «Tayyor»ni bosing.",
      'Теперь размести свою метку. Карточка — якорь, метка — absolute. Впиши отступ сверху и справа и цвет метки. Потом нажми «Готово».',
      'Now place your own badge. The card is the anchor, the badge is absolute. Type the distance from the top and from the right, and the badge color. Then tap “Done”.'),
    msgs: {
      len: L3("Brauzer {w} qiymatini tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал значение {w}. Напиши число и px без пробела.', 'The browser didn’t recognize {w}. Write a number and px with no space.'),
      color: L3("Brauzer {w} rangini tanimadi. Rang nomini yoki kodini yozing.", 'Браузер не узнал цвет {w}. Напиши название или код цвета.', 'The browser didn’t recognize the color {w}. Write a color name or code.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("top va right uchun son va px, rang uchun rang nomi.", 'Для top и right — число и px, для цвета — название цвета.', 'For top and right, a number and px; for the color, a color name.'),
      L3("Masalan: sakkiz piksel, sakkiz piksel va gold. Keyin «Tayyor»ni bosing.", 'Например: восемь пикселей, восемь пикселей и gold. Потом нажми «Готово».', 'For example: eight pixels, eight pixels and gold. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning kartochkangiz.", 'Ого, как красиво! Это твоя карточка.', 'Wow, how pretty! This is your card.'),
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
    hint1: L3("Gap qaysi qiymat haqida: relative, absolute yoki fixed?", 'О каком значении фраза: relative, absolute или fixed?', 'Which value is the sentence about: relative, absolute or fixed?'),
    hint2: L3("Esingizdami: relative joyini saqlaydi, absolute langar otaga, fixed oynaga, siljishlar esa faqat position bilan.", 'Вспомни: relative сохраняет место, absolute — к родителю-якорю, fixed — к окну, а сдвиги — только с position.', 'Remember: relative keeps its place, absolute goes to the anchor parent, fixed to the window, and offsets only work with position.'),
    items: [
      { t: L3("relative element siljiganda uning eski joyi bo'sh qoladi.", 'Когда relative-элемент сдвигается, его прежнее место остаётся пустым.', 'When a relative element moves, its old place stays empty.'), right: true,
        why: L3("To'g'ri: relative joyini saqlab qoladi.", 'Верно: relative сохраняет своё место.', 'Right: relative keeps its place.') },
      { t: L3("Kartochkada position yo'q. Bu qoida belgini kartochka burchagiga qo'yadi.", 'У карточки нет position. Это правило поставит метку в угол карточки.', 'The card has no position. This rule will put the badge in the card’s corner.'), right: false, code: 'badge',
        why: L3("Aslida kartochka langar bo'lmasa, belgi sahifa burchagiga uchadi.", 'На самом деле, если карточка не якорь, метка улетит в угол страницы.', 'Actually, if the card isn’t an anchor, the badge flies to the page’s corner.') },
      { t: L3("fixed tugma sahifa aylansa ham oynada qoladi.", 'Кнопка fixed остаётся в окне, даже когда страницу прокручивают.', 'A fixed button stays in the window even when the page scrolls.'), right: true,
        why: L3("To'g'ri: fixed oynaga yopishadi.", 'Верно: fixed прилипает к окну.', 'Right: fixed sticks to the window.') },
      { t: L3("Bu qoida qutini o'ttiz piksel pastga siljitadi.", 'Это правило сдвигает коробку на тридцать пикселей вниз.', 'This rule moves the box thirty pixels down.'), right: false, code: 'nopos',
        why: L3("Aslida position yo'q, shuning uchun top ishlamaydi.", 'На самом деле position нет, поэтому top не работает.', 'Actually there’s no position, so top doesn’t work.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz position ni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в position.', 'All correct! You know position really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men faqat belgiga absolute va burchak yozgan edim? Qarang: belgi kartochka burchagiga emas, butun sahifa burchagiga uchib ketdi! Men adashibman. Langar yo'q edi.",
        'Вернёмся к загадке. Помнишь, я написал absolute и угол только метке? Смотри: метка улетела не в угол карточки, а в угол всей страницы! Я ошибся. Якоря не было.',
        'Back to our riddle. Remember, I wrote absolute and the corner only on the badge? Look: the badge flew not to the card’s corner but to the whole page’s corner! I was wrong. There was no anchor.'), k: 'riddle' },
      { text: L3("Kartochkaga relative yozsak, u langar bo'ladi va belgi aynan uning burchagiga tushadi. Mana!", 'Если написать карточке relative, она станет якорем, и метка встанет точно в её угол. Вот!', 'If we give the card relative, it becomes the anchor, and the badge lands right in its corner. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning kartochkangiz, o'zingiz joylagan belgi bilan!", 'Смотри, это твоя карточка с твоей собственной меткой!', 'Look, this is your card with the badge you placed yourself!'), k: 'own' },
      { text: L3("relative o'z joyidan siljiydi, eski joyi bo'sh qoladi.", 'relative сдвигается от своего места, прежнее место остаётся пустым.', 'relative moves from its own place; the old place stays empty.'), k: 'rel' },
      { text: L3("absolute oqimdan chiqadi va burchakka qo'yiladi.", 'absolute выходит из потока и встаёт в угол.', 'absolute leaves the flow and goes to a corner.'), k: 'abs' },
      { text: L3("Uning langari esa relative yozilgan ota.", 'А его якорь — родитель с relative.', 'And its anchor is a parent with relative.'), k: 'anchor' },
      { text: L3("fixed oynaga yopishadi va sahifa bilan aylanmaydi.", 'fixed прилипает к окну и не прокручивается вместе со страницей.', 'fixed sticks to the window and doesn’t scroll with the page.'), k: 'fix' },
      { text: L3("Tabriklayman! Endi siz elementlarni sahifaning istalgan joyiga qo'ya olasiz. Keyingi darsda sichqoncha bilan jonlanadigan tugmalar yasaymiz: hover va transform. Ko'rishguncha!",
        'Ура! Теперь ты умеешь ставить элементы в любое место страницы. На следующем уроке сделаем кнопки, которые оживают под мышкой: hover и transform. До встречи!',
        'Hooray! Now you can place elements anywhere on the page. Next lesson we’ll make buttons that come alive under the mouse: hover and transform. See you!') }
    ],
    roles: {
      rel: L3("relative — o'z joyidan", 'relative — от своего места', 'relative — from its own place'),
      abs: L3("absolute — oqimdan tashqari", 'absolute — вне потока', 'absolute — out of the flow'),
      anchor: L3("langar — relative ota", 'якорь — родитель с relative', 'anchor — a parent with relative'),
      fix: L3("fixed — oynaga", 'fixed — к окну', 'fixed — to the window')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayRel: 1, sayTop: 1, sayLeft: 1, sayOut: 1,
  sayCorner: 1, sayParent: 1, sayAway: 1, sayFixed: 1, sayNoPos: 1, sayTypo: 1, sayNoUnit: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1,
  rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c12-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c12.css@*/
`;
