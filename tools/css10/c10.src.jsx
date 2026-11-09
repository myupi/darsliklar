// =============================================================================
// КУРС «CSS» · Урок 10 — «Flexbox: расположение элементов»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css10/build.mjs → lessons/css/10-flexbox-osi.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 10 · «Flexbox: расположение элементов» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–9: правило, селекторы, цвета, фон, текст, размеры, Box Model, карточки, display.
// Коди сделал полку видов спорта: карточки стоят столбиком, а он хочет витрину в ряд. Ученик узнаёт родителя и детей,
// display: flex у родителя, flex-direction (row, column, row-reverse, column-reverse), главную ось (по направлению,
// оранжевая стрелка) и поперечную (поперёк, фиолетовая; дети тянутся по ней). Стрелки рисует «Инспектор» по
// flex-direction, который вычислил браузер. Загадка (без имён): Коди пишет display: flex каждой карточке и ждёт ряд.
// Разгадка: flex пишут родителю — сами карточки так не выстроятся.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (полка столбиком → display: flex у родителя; загадка про flex у детей)
//   flex:      s2 показ (родитель и дети → flex) · s3 вписать flex (Fill) · s4 какому тегу flex — строка HTML (выбор)
//   direction: s5 показ (column · row-reverse · column-reverse) · s6 вписать column (Fill) · s7 какое направление по номерам (выбор)
//   оси:       s8 показ (главная и поперечная; height — дети тянутся; column — оси меняются) · s9 вписать row-reverse (Fill) · s10 куда идёт главная ось (Sort)
//   поломки:   s11 показ (colum, flexbox, направление без flex) · s12 исправить «flexbox» (Debug & Fix) · s13 найти правило, которое не работает
//   w1 правило целиком из двух свойств: nav { display: flex; flex-direction: column; } · s14 своя полка («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: настоящие теги; верная ли запись — решает Chrome (CSS.supports): «colum» и «flexbox» не
//     принимаются; flex-direction без display: flex честно ничего не делает.
//   · Не забегаем: justify-content, align-items, gap, flex-wrap — урок 11.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: ota quti — коробка-родитель; bola — ребёнок; javon — полка; yo'nalish — направление; asosiy o'q —
// главная ось; ko'ndalang o'q — поперечная ось; ustun — столбик; qator — ряд. В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-10-flexbox-osi',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '10-dars. Flexbox: elementlarni joylashtirish',
    ru: 'Урок 10. Flexbox: расположение элементов',
    en: 'Lesson 10. Flexbox: arranging elements'
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
  next: L3("Flexbox: tekislash", 'Flexbox: выравнивание', 'Flexbox: alignment'),
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
  // Полка Коди и меню (не звучат).
  site: {
    title: L3("Kodining javoni", 'Полка Коди', 'Kodi’s shelf'),
    c1: L3("1. Futbol", '1. Футбол', '1. Football'),
    c2: L3("2. Shaxmat", '2. Шахматы', '2. Chess'),
    c3: L3("3. Suzish", '3. Плавание', '3. Swimming')
  },
  menu: {
    a1: L3("Bosh sahifa", 'Главная', 'Home'),
    a2: L3("O'yinlar", 'Игры', 'Games'),
    a3: L3("Aloqa", 'Контакты', 'Contact')
  },
  s1: {
    eyebrow: L3("Javon", 'Полка', 'The shelf'),
    say: L3("Salom! Men sevimli sport turlarim uchun javon yasadim. Kartochkalar do'kon vitrinasidagidek yonma-yon tursin demoqchi edim. Lekin qarang: ular bir-birining ostida turibdi. «Aylantirish» tugmasini bosing.",
      'Привет! Я сделал полку для любимых видов спорта. Хотел, чтобы карточки стояли рядом, как на витрине магазина. Но смотри: они стоят друг под другом. Нажми «Превратить».',
      'Hi! I made a shelf for my favorite sports. I wanted the cards to stand side by side, like in a shop window. But look: they stand one under another. Tap “Transform”.'),
    magic: L3("Mana! Kartochkalar bir qatorga tizildi. Pastdagi to'q sariq strelka ular qaysi tomonga tizilganini ko'rsatadi.", 'Вот! Карточки выстроились в ряд. Оранжевая стрелка снизу показывает, в какую сторону они выстроились.', 'There! The cards lined up in a row. The orange arrow below shows which way they lined up.'),
    magicP: L3("Buni Flexbox qildi. Kartochkalarni o'z ichiga olgan ota qutiga display flex yozdik, ya'ni moslashuvchan quti degani.", 'Это сделал Flexbox. Мы написали display flex для коробки-родителя, в которой лежат карточки, то есть гибкая коробка.', 'Flexbox did it. We wrote display flex for the parent box that holds the cards, meaning a flexible box.'),
    done: L3("Bugun Flexbox bilan elementlarni qatorga va ustunga terishni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta display flex ni har bir kartochkaning o'ziga yozgan edim. Menimcha, ular baribir qatorga tizilishi kerak. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься расставлять элементы в ряд и в столбик с помощью Flexbox. Но сначала загадка. В первый раз я написал display flex каждой карточке. По-моему, они всё равно должны выстроиться в ряд. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to line elements up in a row and in a column with Flexbox. But first, a riddle. The first time, I wrote display flex on each card itself. I think they should still line up in a row. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("display: flex — ota qutiga", 'display: flex — коробке-родителю', 'display: flex goes on the parent box')
  },
  s2: {
    eyebrow: L3("Ota va bolalar", 'Родитель и дети', 'Parent and children'),
    help: [
      L3('Katta qutiga va uning ichidagi kartochkalarga qarang. display flex ota qutiga yozilganda bolalar nima qiladi?', 'Посмотри на большую коробку и карточки внутри неё. Что делают дети, когда родителю пишут display flex?', 'Look at the big box and the cards inside it. What do the children do when the parent gets display flex?'),
      L3('display flex ota qutiga yoziladi, ichidagi bolalar esa qatorga tizilib turadi.', 'display flex пишут коробке-родителю, а дети внутри неё встают в ряд.', 'display flex goes on the parent box, and the children inside line up in a row.'),
      L3("O'qituvchi «qatorga turinglar!» desa, o'quvchilar qatorga turadi. flex ham ota qutining shunday buyrug'i.", 'Учитель говорит «встаньте в ряд!» — и ученики встают. flex — такая же команда коробки-родителя.', 'A teacher says “line up!” and the students line up. flex is that kind of command from the parent box.')
    ],
    say: L3("Sahifaga qarang. Kartochkalar, ya'ni bolalar, bitta katta div ichida turibdi: uning klassi javon. Bu katta quti ularning otasi. Hozir kartochkalar oddiy div, shuning uchun ustma-ust turibdi.",
      'Посмотри на страницу. Карточки, то есть дети, лежат внутри одного большого div с классом javon. Эта большая коробка — их родитель. Сейчас карточки — обычные div, поэтому стоят друг под другом.',
      'Look at the page. The cards, the children, sit inside one big div with the class javon. This big box is their parent. Right now the cards are plain divs, so they stack one under another.'),
    sayFlex: L3("Endi ota qutiga display flex beramiz. Qarang: bolalar darhol bir qatorga tizildi. Flex ota qutiga yoziladi, bolalar esa unga bo'ysunadi.", 'Теперь дадим коробке-родителю display flex. Смотри: дети сразу встали в ряд. Flex пишут родителю, а дети его слушаются.', 'Now give the parent box display flex. Look: the children lined up in a row at once. Flex goes on the parent, and the children follow it.'),
    done: L3("Demak, display flex ota qutiga yoziladi va uning bolalari qatorga tiziladi.", 'Значит, display flex пишут коробке-родителю, и её дети встают в ряд.', 'So display flex is written on the parent box, and its children line up in a row.'),
    askStart: L3("Qarang: kartochkalar — bolalar", 'Смотри: карточки — это дети', 'Watch: the cards are the children'),
    askFlex: L3("Qarang: ota qutiga flex", 'Смотри: flex коробке-родителю', 'Watch: flex on the parent box'),
    askDone: L3("flex — otaga, bolalar qatorda", 'flex — родителю, дети в ряд', 'flex on the parent, children in a row')
  },
  s3: {
    eyebrow: L3("Qatorga tering", 'Поставь в ряд', 'Line them up'),
    say: L3("Endi navbat sizga. Kartochkalar ustma-ust turibdi. Ular bir qatorga tizilsin: ota quti uchun display qiymatini yozing.",
      'Теперь твоя очередь. Карточки стоят друг под другом. Пусть они выстроятся в ряд: впиши значение display для коробки-родителя.',
      'Now it’s your turn. The cards are stacked. Line them up in a row: type the display value for the parent box.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta qisqa so'z.", 'Впиши значение: одно короткое слово.', 'Type the value: one short word.'),
      flexbox: L3("Flexbox bu usulning nomi. display uchun qiymat qisqaroq: faqat flex.", 'Flexbox — это название способа. Значение для display короче: просто flex.', 'Flexbox is the name of the technique. The value for display is shorter: just flex.'),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.'),
      block: L3("block bilan kartochkalar hozirgidek ustma-ust qoladi.", 'С block карточки так и останутся друг под другом.', 'With block the cards stay stacked.'),
      none: L3("none bilan javon butunlay yo'qoldi. Kartochkalar qatorda ko'rinsin.", 'С none полка совсем пропала. Карточки должны быть видны в ряд.', 'With none the shelf disappeared. The cards should be visible in a row.'),
      other: L3("Bu boshqa qiymat. Oldingi ekranda kartochkalarni qatorga qo'ygan so'z kerak.", "Это другое значение. Нужно то слово, от которого на прошлом экране карточки встали в ряд.", "That’s a different value. You need the word that put the cards in a row on the last screen.")
    },
    hints: [
      L3("Oldingi ekranni eslang: display dan keyin qaysi so'z kartochkalarni qatorga qo'ydi?", "Вспомни прошлый экран: какое слово после display поставило карточки в ряд?", "Remember the last screen: which word after display put the cards in a row?"),
      L3("Flexbox so'zining boshi: flex.", 'Начало слова Flexbox: flex.', 'The start of the word Flexbox: flex.'),
      L3("flex deb yozing va Tekshirishni bosing.", 'Впиши flex и нажми «Проверить».', 'Type flex and tap Check.')
    ],
    ok: L3("Zo'r! Kartochkalar bir qatorda, xuddi vitrinadagidek.", 'Огонь! Карточки в ряд, как на витрине.', 'Awesome! The cards are in a row, just like a shop window.'),
    ask: L3("Kartochkalarni qatorga tering", 'Поставь карточки в ряд', 'Line the cards up in a row')
  },
  s4: {
    eyebrow: L3("Qaysi tegga?", 'Какому тегу?', 'Which tag?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men HTML kodini ko'rsataman. Ichidagilar qatorga tizilishi uchun display flex qaysi tegga yoziladi? O'sha qatorni bosing.",
      'Теперь проверь себя. Я покажу HTML-код. Какому тегу написать display flex, чтобы то, что внутри, встало в ряд? Нажми эту строку.',
      'Now check yourself. I’ll show some HTML code. Which tag gets display flex so that what’s inside lines up in a row? Tap that line.'),
    ask: L3("display: flex qaysi tegga yoziladi?", 'Какому тегу написать display: flex?', 'Which tag gets display: flex?'),
    words: {
      m1: L3("Bosh sahifa", 'Главная', 'Home'), m2: L3("O'yinlar", 'Игры', 'Games'), m3: L3("Aloqa", 'Контакты', 'Contact'),
      l1: L3("Non", 'Хлеб', 'Bread'), l2: L3("Sut", 'Молоко', 'Milk'), l3: L3("Olma", 'Яблоки', 'Apples'),
      c1: L3("Futbol", 'Футбол', 'Football'), c2: L3("Shaxmat", 'Шахматы', 'Chess'), c3: L3("Suzish", 'Плавание', 'Swimming')
    },
    child: L3("Bu bola teg. display flex esa bolalarni o'z ichiga olgan ota tegga yoziladi.", 'Это тег-ребёнок. А display flex пишут тегу-родителю, в котором лежат дети.', 'That’s a child tag. display flex goes on the parent tag that holds the children.'),
    hint1: L3("Qaysi teg qolganlarini o'z ichiga oladi?", 'Какой тег содержит внутри остальные?', 'Which tag holds the others inside?'),
    hint2: L3("Ota teg eng tepada ochiladi va eng pastda yopiladi.", 'Тег-родитель открывается в самом верху и закрывается в самом низу.', 'The parent tag opens at the very top and closes at the very bottom.'),
    hint3: L3("Bolalarni to'g'ridan-to'g'ri o'rab turgan tegni oching: kartochkalar, menyu bandlari yoki ro'yxat bandlari aynan uning ichida. O'sha qatorni bosing.", "Нажми строку, которая открывает тег прямо вокруг детей: карточки, пункты меню или списка лежат именно в нём.", "Tap the line that opens the tag right around the children: the cards, menu items or list items sit directly inside it."),
    right: L3("To'g'ri! Bu ota teg, flex unga yoziladi.", 'Верно! Это тег-родитель, flex пишут ему.', 'Right! That’s the parent tag; flex goes on it.'),
    ok: L3("Hammasi to'g'ri! Siz ota tegni darhol topasiz.", 'Всё верно! Ты сразу находишь тег-родитель.', 'All correct! You find the parent tag right away.'),
    outer: L3("Bu tashqi quti: bolalar uning ichida emas, undan ham ichkaridagi tegda yotadi. Ularni to'g'ridan-to'g'ri o'rab turgan tegni toping.", "Это внешняя коробка: дети лежат не прямо в ней, а в теге внутри. Найди тег, который обнимает их напрямую.", "That’s the outer box: the children aren’t right inside it but in a tag inside it. Find the tag that wraps them directly.")
  },
  s5: {
    eyebrow: L3("Yo'nalish", 'Направление', 'Direction'),
    help: [
      L3("To'q sariq strelkaga qarang: u kartochkalar qaysi tomonga tizilishini ko'rsatadi.", 'Посмотри на оранжевую стрелку: она показывает, в какую сторону выстраиваются карточки.', 'Look at the orange arrow: it shows which way the cards line up.'),
      L3("flex-direction yo'nalishni beradi: row chapdan o'ngga, column tepadan pastga, reverse esa teskari tomonga.", 'flex-direction задаёт направление: row — слева направо, column — сверху вниз, reverse — в обратную сторону.', 'flex-direction sets the direction: row left to right, column top to bottom, reverse goes the opposite way.'),
      L3('Navbatda turganlar bir tomonga qarab turadi. flex-direction ham kartochkalar navbati qaysi tomonga yurishini aytadi.', 'Люди в очереди стоят в одну сторону. flex-direction говорит, куда «смотрит» очередь из карточек.', 'People in a line all face one way. flex-direction says which way the line of cards faces.')
    ],
    say: L3("Qaysi tomonga tizilishini flex-direction xususiyati aytadi, ya'ni yo'nalish degani. Odatda u row, ya'ni qator: chapdan o'ngga. To'q sariq strelka aynan shu yo'nalish.",
      'В какую сторону выстраиваться, говорит свойство flex-direction, то есть направление. Обычно это row, то есть ряд: слева направо. Оранжевая стрелка — это и есть направление.',
      'Which way they line up is set by the flex-direction property, meaning the direction. By default it’s row: left to right. The orange arrow is that very direction.'),
    sayCol: L3("column, ya'ni ustun: kartochkalar tepadan pastga tizildi. Strelka ham pastga qaradi.", 'column, то есть столбик: карточки выстроились сверху вниз. Стрелка тоже смотрит вниз.', 'column: the cards lined up top to bottom. The arrow points down too.'),
    sayRR: L3("row-reverse, ya'ni teskari qator: o'ngdan chapga. Qarang, birinchi kartochka endi eng o'ngda.", 'row-reverse, то есть ряд наоборот: справа налево. Смотри, первая карточка теперь справа.', 'row-reverse, a reversed row: right to left. Look, the first card is now on the right.'),
    sayCR: L3("column-reverse, ya'ni teskari ustun: pastdan tepaga. Birinchi kartochka eng pastda.", 'column-reverse, то есть столбик наоборот: снизу вверх. Первая карточка — в самом низу.', 'column-reverse, a reversed column: bottom to top. The first card is at the very bottom.'),
    done: L3("Demak, flex-direction yo'nalishni beradi: row, column va ularning teskarisi.", 'Значит, flex-direction задаёт направление: row, column и их обратные варианты.', 'So flex-direction sets the direction: row, column and their reverses.'),
    askStart: L3("Qarang: row — chapdan o'ngga", 'Смотри: row — слева направо', 'Watch: row is left to right'),
    askCol: L3("Qarang: column — tepadan pastga", 'Смотри: column — сверху вниз', 'Watch: column is top to bottom'),
    askRR: L3("Qarang: row-reverse — o'ngdan chapga", 'Смотри: row-reverse — справа налево', 'Watch: row-reverse is right to left'),
    askCR: L3("Qarang: column-reverse — pastdan tepaga", 'Смотри: column-reverse — снизу вверх', 'Watch: column-reverse is bottom to top'),
    askDone: L3("flex-direction — yo'nalish", 'flex-direction — направление', 'flex-direction is the direction')
  },
  s6: {
    eyebrow: L3("Ustun", 'Столбик', 'A column'),
    say: L3("Endi siz. Telefonda javon tor, kartochkalar ustun bo'lib tursin, lekin flex qolsin: flex-direction qiymatini yozing.",
      'Теперь ты. На телефоне полка узкая, пусть карточки стоят столбиком, но flex остаётся: впиши значение flex-direction.',
      'Your turn. On a phone the shelf is narrow, so let the cards stand in a column while keeping flex: type the flex-direction value.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      bad: L3("Brauzer bu so'zni tanimadi. Harflarni tekshiring.", 'Браузер не узнал это слово. Проверь буквы.', 'The browser didn’t recognize that word. Check the letters.'),
      row: L3("row bilan kartochkalar qatorda qoladi. Ustun kerak.", 'С row карточки остаются в ряд. Нужен столбик.', 'With row the cards stay in a row. We need a column.'),
      'row-reverse': L3("Bu teskari qator. Bizga tepadan pastga ustun kerak.", 'Это ряд наоборот. Нужен столбик сверху вниз.', 'That’s a reversed row. We need a column, top to bottom.'),
      'column-reverse': L3("Ustun bo'ldi, lekin teskari: birinchi kartochka pastda. Tepadan pastga kerak.", 'Столбик, но наоборот: первая карточка внизу. Нужно сверху вниз.', 'A column, but reversed: the first card is at the bottom. We need top to bottom.'),
      other: L3("Bu boshqa qiymat. Ustun kerak.", 'Это другое значение. Нужен столбик.', 'That’s a different value. We need a column.')
    },
    hints: [
      L3("Ko'rsatuvni eslang: kartochkalar qaysi so'z bilan tepadan pastga turdi, row yoki column?", "Вспомни показ: каким словом карточки встали сверху вниз — row или column?", "Remember the demo: which word made the cards line up top to bottom, row or column?"),
      L3("Ustun column deyiladi.", 'Столбик называется column.', 'It’s called column.'),
      L3("column deb yozing va Tekshirishni bosing.", 'Впиши column и нажми «Проверить».', 'Type column and tap Check.')
    ],
    ok: L3("Barakalla! Kartochkalar ustun bo'lib turibdi.", 'Молодец! Карточки стоят столбиком.', 'Well done! The cards stand in a column.'),
    ask: L3("Kartochkalar ustun bo'lsin", 'Сделай карточки столбиком', 'Put the cards in a column')
  },
  s7: {
    eyebrow: L3("Qaysi yo'nalish?", 'Какое направление?', 'Which direction?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kartochkalardagi raqamlarga qarang va qaysi flex-direction ekanini toping.",
      'Теперь проверь себя. Посмотри на номера на карточках и найди, какой здесь flex-direction.',
      'Now check yourself. Look at the numbers on the cards and find which flex-direction it is.'),
    ask: L3("Bu qaysi flex-direction?", 'Какой это flex-direction?', 'Which flex-direction is this?'),
    hint1: L3("Kartochkalar qatordami yoki ustunda? Birinchisi qayerda?", 'Карточки в ряд или столбиком? Где первая?', 'Are the cards in a row or a column? Where’s the first one?'),
    hint2: L3("Qator row, ustun column. Birinchisi oxirida bo'lsa, demak reverse.", 'Ряд — row, столбик — column. Если первая в конце, значит reverse.', 'A row is row, a column is column. If the first one is at the end, it’s reverse.'),
    rounds: [
      { want: 'row-reverse', opts: ['row', 'row-reverse', 'column'],
        why: L3("Qator, lekin birinchi kartochka o'ngda: row-reverse.", 'Ряд, но первая карточка справа: row-reverse.', 'A row, but the first card is on the right: row-reverse.') },
      { want: 'column', opts: ['column', 'column-reverse', 'row'],
        why: L3("Ustun, birinchisi tepada: column.", 'Столбик, первая наверху: column.', 'A column with the first one on top: column.') },
      { want: 'column-reverse', opts: ['row-reverse', 'column', 'column-reverse'],
        why: L3("Ustun, birinchisi pastda: column-reverse.", 'Столбик, первая внизу: column-reverse.', 'A column with the first one at the bottom: column-reverse.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Yo'nalishni raqamlardan o'qiysiz.", 'Всё верно! Ты читаешь направление по номерам.', 'All correct! You read the direction from the numbers.')
  },
  s8: {
    eyebrow: L3("Ikki o'q", 'Две оси', 'Two axes'),
    help: [
      L3("Ikki strelkaga qarang: to'q sariq asosiy o'q, ikkinchisi unga ko'ndalang. column bo'lganda ular almashadi.", 'Посмотри на две стрелки: оранжевая — главная ось, вторая — поперёк неё. С column они меняются местами.', 'Look at the two arrows: orange is the main axis, the other runs across it. With column they swap.'),
      L3("Asosiy o'q — kartochkalar navbati ketadigan tomon. Ko'ndalang o'q navbatga ko'ndalang. Ko'ndalang o'q bo'ylab kartochkalar o'zi cho'ziladi.", "Главная ось — куда идёт очередь карточек. Поперечная — поперёк очереди. Вдоль поперечной оси карточки сами вытягиваются.", "The main axis is where the line of cards goes. The cross axis runs across the line. Along the cross axis the cards stretch by themselves."),
      L3("Daftar katagini eslang: chiziqlar bir tomonga, ustunlar unga ko'ndalang. Flexbox da ham shunday ikki yo'nalish bor.", 'Вспомни тетрадь в клетку: строки идут в одну сторону, столбцы — поперёк. Во Flexbox тоже два направления.', 'Think of graph paper: rows go one way, columns across them. Flexbox has two directions like that too.')
    ],
    say: L3("Flexbox da ikkita o'q bor. Asosiy o'q, ya'ni kartochkalar tiziladigan yo'nalish degani: u to'q sariq strelka. Ikkinchisi unga ko'ndalang ketadi, xuddi T harfining ustidagi chiziq kabi: bu binafsha strelka, ko'ndalang o'q. Hozir asosiy o'q chapdan o'ngga, ko'ndalang o'q esa tepadan pastga.", "Во Flexbox две оси. Главная — куда выстраиваются карточки: это оранжевая стрелка. Вторая идёт поперёк, как перекладина у буквы Т: это фиолетовая стрелка, поперечная ось. Сейчас главная — слева направо, а поперечная — сверху вниз.", "Flexbox has two axes. The main one is where the cards line up: that’s the orange arrow. The second runs across it, like the bar on a letter T: that’s the purple arrow, the cross axis. Right now the main axis goes left to right, and the cross axis top to bottom."),
    sayStretch: L3("Javonga height bir yuz yigirma piksel beramiz. Qarang: kartochkalar ko'ndalang o'q bo'ylab cho'zildi, javonning butun balandligini egalladi. Flex buni o'zi qiladi.", 'Дадим полке height сто двадцать пикселей. Смотри: карточки растянулись по поперечной оси на всю высоту полки. Flex делает это сам.', 'Give the shelf height one hundred twenty pixels. Look: the cards stretched along the cross axis to the full height of the shelf. Flex does it by itself.'),
    sayCol: L3("Endi column. O'qlar almashdi: asosiy o'q tepadan pastga, ko'ndalang o'q esa chapdan o'ngga. Shuning uchun kartochkalar endi kengligi bo'yicha cho'zildi.", 'Теперь column. Оси поменялись: главная ось — сверху вниз, а поперечная — слева направо. Поэтому теперь карточки растянулись по ширине.', 'Now column. The axes swapped: the main axis is top to bottom, and the cross axis is left to right. That’s why the cards now stretch across the width.'),
    done: L3("Demak, asosiy o'q flex-direction bo'yicha ketadi, ko'ndalang o'q esa doim unga tik.", 'Значит, главная ось идёт по flex-direction, а поперечная — всегда поперёк неё.', 'So the main axis follows flex-direction, and the cross axis always goes across it.'),
    askStart: L3("Qarang: asosiy va ko'ndalang o'q", 'Смотри: главная и поперечная ось', 'Watch: the main and cross axes'),
    askStretch: L3("Qarang: ko'ndalang o'q bo'ylab cho'zildi", 'Смотри: растянулись по поперечной оси', 'Watch: stretched along the cross axis'),
    askCol: L3("Qarang: column — o'qlar almashdi", 'Смотри: column — оси поменялись', 'Watch: column swaps the axes'),
    askDone: L3("Asosiy o'q — yo'nalish, ko'ndalang — unga tik", 'Главная ось — направление, поперечная — поперёк', 'Main axis is the direction, cross axis goes across')
  },
  s9: {
    eyebrow: L3("O'ngdan chapga", 'Справа налево', 'Right to left'),
    say: L3("Endi siz. Asosiy o'q o'ngdan chapga yursin: birinchi kartochka eng o'ngda tursin. flex-direction qiymatini yozing.",
      'Теперь ты. Пусть главная ось идёт справа налево: первая карточка — справа. Впиши значение flex-direction.',
      'Your turn. Let the main axis run right to left: the first card on the far right. Type the flex-direction value.'),
    msgs: {
      empty: L3("Qiymatni yozing: ikki so'z, orasida chiziqcha.", 'Впиши значение: два слова через чёрточку.', 'Type the value: two words joined by a dash.'),
      bad: L3("Brauzer bu so'zni tanimadi. Ikki so'z chiziqcha bilan, bo'sh joysiz yoziladi.", 'Браузер не узнал это слово. Два слова пишутся через чёрточку, без пробела.', 'The browser didn’t recognize that word. Two words are joined by a dash, with no space.'),
      row: L3("row bilan o'q chapdan o'ngga. Teskarisi kerak.", 'С row ось идёт слева направо. Нужна обратная.', 'With row the axis runs left to right. We need the reverse.'),
      column: L3("column bilan o'q tepadan pastga. Bizga qator kerak, faqat teskari.", 'С column ось идёт сверху вниз. Нужен ряд, только обратный.', 'With column the axis runs top to bottom. We need a row, just reversed.'),
      'column-reverse': L3("Bu teskari ustun. Bizga teskari qator kerak.", 'Это обратный столбик. А нужен обратный ряд.', 'That’s a reversed column. We need a reversed row.'),
      other: L3("Bu boshqa qiymat. Teskari qator kerak.", 'Это другое значение. Нужен обратный ряд.', 'That’s a different value. We need a reversed row.')
    },
    hints: [
      L3("Qator row, teskari esa reverse.", 'Ряд — row, а наоборот — reverse.', 'A row is row, and reversed is reverse.'),
      L3("Ikki so'z: row va reverse, orasida chiziqcha.", 'Два слова: row и reverse, между ними чёрточка.', 'Two words: row and reverse, with a dash between them.'),
      L3("row-reverse deb yozing va Tekshirishni bosing.", 'Впиши row-reverse и нажми «Проверить».', 'Type row-reverse and tap Check.')
    ],
    ok: L3("Ajoyib! Asosiy o'q o'ngdan chapga, birinchi kartochka o'ngda.", 'Отлично! Главная ось справа налево, первая карточка справа.', 'Great! The main axis runs right to left, the first card on the right.'),
    ask: L3("Asosiy o'q o'ngdan chapga bo'lsin", 'Пусть главная ось идёт справа налево', 'Make the main axis run right to left')
  },
  s10: {
    eyebrow: L3("O'q qayoqqa?", 'Куда идёт ось?', 'Where does the axis go?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodga qarang va asosiy o'q qaysi tomonga ketishini tanlang.",
      'Теперь проверь себя. Посмотри на код и выбери, куда идёт главная ось.',
      'Now check yourself. Look at the code and pick which way the main axis goes.'),
    ask: L3("Asosiy o'q qayoqqa ketadi?", 'Куда идёт главная ось?', 'Which way does the main axis go?'),
    hint1: L3("Qiymat qator haqidami yoki ustun haqidami? Teskarimi?", 'Значение про ряд или про столбик? Обратное?', 'Is the value about a row or a column? Is it reversed?'),
    hint2: L3("row o'ngga, row-reverse chapga, column pastga, column-reverse tepaga.", 'row — вправо, row-reverse — влево, column — вниз, column-reverse — вверх.', 'row goes right, row-reverse left, column down, column-reverse up.'),
    dirs: {
      r: L3("o'ngga", 'вправо', 'right'), l: L3("chapga", 'влево', 'left'),
      d: L3("pastga", 'вниз', 'down'), u: L3("tepaga", 'вверх', 'up')
    },
    items: [
      { dir: 'column', right: 'd', why: L3("column: tepadan pastga.", 'column: сверху вниз.', 'column: top to bottom.') },
      { dir: 'row', right: 'r', why: L3("row: chapdan o'ngga.", 'row: слева направо.', 'row: left to right.') },
      { dir: 'row-reverse', right: 'l', why: L3("row-reverse: o'ngdan chapga.", 'row-reverse: справа налево.', 'row-reverse: right to left.') },
      { dir: 'column-reverse', right: 'u', why: L3("column-reverse: pastdan tepaga.", 'column-reverse: снизу вверх.', 'column-reverse: bottom to top.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! O'qni koddan ko'ra olasiz.", 'Всё верно! Ты видишь ось прямо в коде.', 'All correct! You can see the axis right in the code.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Har safar kodga qarang: so'zlar to'g'ri yozilganmi va display flex bormi? Keyin kartochkalar qanday turganiga qarang.", 'Каждый раз смотри на код: слова написаны верно и есть ли display flex? Потом смотри, как стоят карточки.', 'Each time, look at the code: are the words right, and is there display flex? Then see how the cards are placed.'),
      L3("Flex so'zlari aniq yozilishi kerak, flex-direction esa faqat display flex bilan ishlaydi.", 'Слова flex пишутся точно, а flex-direction работает только вместе с display flex.', 'Flex words must be exact, and flex-direction only works together with display flex.'),
      L3('Pult batareyasiz ishlamaydi, tugmani qancha bosmang. flex-direction ham display flex siz ishlamaydi.', 'Пульт без батареек не работает, сколько ни жми кнопки. flex-direction так же не работает без display flex.', 'A remote doesn’t work without batteries, however hard you press. flex-direction doesn’t work without display flex either.')
    ],
    say: L3("Flexbox da ham xatolar bo'ladi. Keling, uchtasini ko'ramiz. Hozir javon flex, kartochkalar ustunda.",
      'И во Flexbox бывают ошибки. Давай посмотрим на три. Сейчас полка flex, карточки столбиком.',
      'Flexbox has mistakes too. Let’s look at three. Right now the shelf is flex, the cards are in a column.'),
    sayTypo: L3("Birinchisi: column so'zida harf tushib qolgan. Brauzer qoidani tashlab yubordi, yo'nalish yana qator bo'ldi.", 'Первая: в слове column пропала буква. Браузер выбросил правило, направление снова ряд.', 'The first: a letter is missing in column. The browser threw the rule away, the direction is a row again.'),
    sayFlexbox: L3("Ikkinchisi: display uchun flexbox deb yozilgan. Bunday qiymat yo'q, javon oddiy div bo'lib qoldi.", 'Вторая: для display написано flexbox. Такого значения нет, полка осталась обычным div.', 'The second: display says flexbox. There’s no such value, the shelf stayed a plain div.'),
    sayNoFlex: L3("Uchinchisi: flex-direction bor, lekin display flex yo'q. Yo'nalish faqat flex qutida ishlaydi, shuning uchun hech narsa o'zgarmadi.", 'Третья: flex-direction есть, а display flex нет. Направление работает только во flex-коробке, поэтому ничего не изменилось.', 'The third: there’s flex-direction but no display flex. Direction only works in a flex box, so nothing changed.'),
    done: L3("Demak, so'zlar aniq yoziladi, flex-direction esa faqat display flex bilan ishlaydi.", 'Значит, слова пишутся точно, а flex-direction работает только вместе с display flex.', 'So the words must be exact, and flex-direction only works together with display flex.'),
    askStart: L3("Qarang: flex va column", 'Смотри: flex и column', 'Watch: flex and column'),
    askTypo: L3("Qarang: colum — harf yo'q", 'Смотри: colum — нет буквы', 'Watch: colum is missing a letter'),
    askFlexbox: L3("Qarang: flexbox — bunday qiymat yo'q", 'Смотри: flexbox — такого значения нет', 'Watch: flexbox isn’t a value'),
    askNoFlex: L3("Qarang: flex yo'q — yo'nalish ishlamaydi", 'Смотри: без flex направление не работает', 'Watch: no flex, no direction'),
    askDone: L3("So'z aniq, yo'nalish — faqat flex bilan", 'Точное слово, направление — только с flex', 'Exact words, direction only with flex')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men javonga flex yozdim, lekin kartochkalar baribir ustma-ust! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я написал полке flex, а карточки всё равно друг под другом! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wrote flex for the shelf, but the cards are still stacked! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta qisqa so'z.", 'Впиши значение: одно короткое слово.', 'Type the value: one short word.'),
      flexbox: L3("flexbox bu usulning nomi, display uchun qiymat emas. Qisqartiring.", 'flexbox — название способа, а не значение display. Сократи.', 'flexbox is the technique’s name, not a display value. Shorten it.'),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.'),
      other: L3("Bu boshqa qiymat. Kartochkalar qatorda tursin.", 'Это другое значение. Карточки должны стоять в ряд.', 'That’s a different value. The cards should stand in a row.')
    },
    hints: [
      L3("Qiymatda ortiqcha harflar bor.", 'В значении лишние буквы.', 'The value has extra letters.'),
      L3("Oxiridagi box so'zi ortiqcha.", 'Слово box в конце лишнее.', 'The word box at the end is extra.'),
      L3("Faqat flex qoldiring va Tekshirishni bosing.", 'Оставь только flex и нажми «Проверить».', 'Leave just flex and tap Check.')
    ],
    ok: L3("Ura, ishladi! Kartochkalar qatorda.", 'Ура, заработало! Карточки в ряд.', 'Hooray, it works! The cards are in a row.'),
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
      typo: L3("Topdingiz! column so'zida harf yetishmayotgan edi.", 'Есть! В слове column не хватало буквы.', 'Found it! A letter was missing in column.'),
      noflex: L3("Topdingiz! display flex yo'q edi, shuning uchun yo'nalish ishlamadi.", 'Есть! Не было display flex, поэтому направление не работало.', 'Found it! There was no display flex, so the direction didn’t work.')
    },
    hint1: L3("Sahifaga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      typo: L3("Kodda ustun yozilgan, kartochkalar esa qatorda. So'zni tekshiring.", 'В коде написан столбик, а карточки в ряд. Проверь слово.', 'The code says column, but the cards are in a row. Check the word.'),
      noflex: L3("Kodda teskari qator yozilgan, kartochkalar esa ustma-ust. Nima yetishmayapti?", 'В коде написан обратный ряд, а карточки друг под другом. Чего не хватает?', 'The code says reversed row, but the cards are stacked. What’s missing?')
    },
    hint3: {
      typo: L3("Xato uchinchi qoidada: colum. O'sha qatorni bosing.", 'Ошибка в третьем правиле: colum. Нажми эту строку.', 'The bug is in the third rule: colum. Tap that line.'),
      noflex: L3("Ishlamayotgani ikkinchi qoida: display flex yo'q. O'sha qatorni bosing.", 'Не работает второе правило: нет display flex. Нажми эту строку.', 'The second rule doesn’t work: no display flex. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz Flexbox ni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь Flexbox как настоящий разработчик.', 'Super! Both found. You check Flexbox like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Menyu nav tegi ichida. U flex bo'lsin va havolalar ustun bo'lib tursin. Qoidada ikkita xususiyat bo'ladi, har biridan keyin nuqtali vergul.",
      'Теперь напиши правило целиком. Меню лежит в теге nav. Пусть он будет flex, а ссылки стоят столбиком. В правиле будет два свойства, после каждого — точка с запятой.',
      'Now write the whole rule yourself. The menu is inside the nav tag. Make it flex, with the links in a column. The rule will have two properties, each followed by a semicolon.'),
    msgs: {
      empty: L3("Qoidani yozing: avval selektor, keyin figurali qavslar ichida xususiyatlar.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойства.', 'Write the rule: first the selector, then the properties inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat orasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Menyu nav tegi ichida: selektor nav.", 'Меню лежит в теге nav: селектор — nav.', 'The menu is in the nav tag: the selector is nav.'),
      noFlex: L3("Avval nav flex bo'lishi kerak: display flex.", 'Сначала nav должен быть flex: display flex.', 'First nav has to be flex: display flex.'),
      noDir: L3("flex bor, havolalar esa hali qatorda. Yo'nalishni ham yozing.", 'flex есть, а ссылки пока в ряд. Допиши и направление.', 'flex is there, but the links are still in a row. Add the direction too.'),
      dir: L3("Yo'nalish boshqacha. Havolalar tepadan pastga ustun bo'lsin.", 'Направление другое. Ссылки должны стоять столбиком сверху вниз.', 'The direction is different. The links should stand in a column, top to bottom.'),
      bad: L3("Brauzer bu so'zni tanimadi. So'zlarni tekshiring.", 'Браузер не узнал это слово. Проверь слова.', 'The browser didn’t recognize that word. Check the words.'),
      semi: L3("Ikki xususiyat o'rtasida nuqtali vergul kerak: flex dan keyin nuqtali vergul qo'ying.", "Между двумя свойствами нужна точка с запятой: поставь её после flex.", "Two properties need a semicolon between them: put one after flex.")
    },
    hints: [
      L3("Ikki xususiyat kerak: biri flex qiladi, ikkinchisi yo'nalishni beradi.", 'Нужны два свойства: одно делает flex, второе задаёт направление.', 'Two properties are needed: one makes it flex, the other sets the direction.'),
      L3("display flex va flex-direction column.", 'display flex и flex-direction column.', 'display flex and flex-direction column.'),
      L3("Namuna kod ostida paydo bo'ldi. Uni maydonga ko'chirib yozing va Tekshirishni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Menyu ustun bo'ldi, havolalar esa kengligi bo'yicha cho'zildi. Qoidani o'zingiz yozdingiz.", 'Отлично! Меню стало столбиком, а ссылки растянулись по ширине. Правило написано тобой целиком.', 'Great! The menu became a column, and the links stretched across the width. You wrote the whole rule yourself.'),
    ask: L3("nav: flex va ustun", 'nav: flex и столбик', 'nav: flex and a column')
  },
  s14: {
    eyebrow: L3("O'z javoningiz", 'Своя полка', 'Your own shelf'),
    say: L3("Endi o'z javoningizni yasang. Javon flex. Yo'nalish, kartochkalar foni va ichki bo'shliq uchun istalgan qiymatni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь сделай свою полку. Полка уже flex. Впиши любые значения для направления, фона карточек и внутреннего отступа. Потом нажми «Готово».',
      'Now make your own shelf. The shelf is flex. Type any values for the direction, the cards’ background and the inner space. Then tap “Done”.'),
    msgs: {
      dir: L3("Brauzer {w} yo'nalishini tanimadi. row, column, row-reverse yoki column-reverse yozing.", 'Браузер не узнал направление {w}. Впиши row, column, row-reverse или column-reverse.', 'The browser didn’t recognize the direction {w}. Type row, column, row-reverse or column-reverse.'),
      color: L3("Brauzer {w} rangini tanimadi. Rang nomini yoki kodini yozing.", 'Браузер не узнал цвет {w}. Напиши название или код цвета.', 'The browser didn’t recognize the color {w}. Write a color name or code.'),
      pad: L3("Brauzer {w} qiymatini tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал значение {w}. Напиши число и px без пробела.', 'The browser didn’t recognize {w}. Write a number and px with no space.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("Yo'nalish uchun to'rtta so'zdan biri; fon uchun rang; ichki bo'shliq uchun son va px.", 'Для направления — одно из четырёх слов; для фона — цвет; для отступа — число и px.', 'For the direction, one of the four words; for the background, a color; for the inner space, a number and px.'),
      L3("Masalan: row, gold va o'n ikki piksel. Keyin «Tayyor»ni bosing.", 'Например: row, gold и двенадцать пикселей. Потом нажми «Готово».', 'For example: row, gold and twelve pixels. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning javoningiz.", 'Ого, как красиво! Это твоя полка.', 'Wow, how pretty! This is your shelf.'),
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
    hint1: L3("Gap nima haqida: flex qayerga yozilishi, yo'nalish yoki o'qlar?", 'О чём фраза: куда пишут flex, о направлении или об осях?', 'What’s the sentence about: where flex goes, the direction or the axes?'),
    hint2: L3("Esingizdami: flex ota qutiga yoziladi, column ustun, reverse teskari, yo'nalish esa faqat flex bilan ishlaydi.", 'Вспомни: flex пишут родителю, column — столбик, reverse — наоборот, а направление работает только с flex.', 'Remember: flex goes on the parent, column is a column, reverse flips it, and the direction only works with flex.'),
    items: [
      { t: L3("display flex kartochkalarni o'z ichiga olgan ota qutiga yoziladi.", 'display flex пишут коробке-родителю, в которой лежат карточки.', 'display flex goes on the parent box that holds the cards.'), right: true,
        why: L3("To'g'ri: flex otaga yoziladi, bolalar unga bo'ysunadi.", 'Верно: flex пишут родителю, дети его слушаются.', 'Right: flex goes on the parent, and the children follow it.') },
      { t: L3("Bu qoidalar kartochkalarni qatorga teradi.", 'Эти правила ставят карточки в ряд.', 'These rules put the cards in a row.'), right: false, code: 'col',
        why: L3("Aslida column ustun qiladi: kartochkalar tepadan pastga turadi.", 'На самом деле column делает столбик: карточки стоят сверху вниз.', 'Actually column makes a column: the cards stand top to bottom.') },
      { t: L3("row-reverse da birinchi kartochka eng o'ngda turadi.", 'При row-reverse первая карточка стоит справа.', 'With row-reverse the first card stands on the far right.'), right: true,
        why: L3("To'g'ri: row-reverse o'ngdan chapga teradi.", 'Верно: row-reverse ставит справа налево.', 'Right: row-reverse goes right to left.') },
      { t: L3("display flex bo'lmasa ham flex-direction ishlaydi.", 'flex-direction работает и без display flex.', 'flex-direction works even without display flex.'), right: false,
        why: L3("Aslida yo'nalish faqat flex qutida ishlaydi.", 'На самом деле направление работает только во flex-коробке.', 'Actually the direction only works in a flex box.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz Flexbox o'qlarini yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в осях Flexbox.', 'All correct! You know Flexbox axes really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men display flex ni har bir kartochkaning o'ziga yozgan edim? Qarang: ular baribir ustma-ust turibdi! Men adashibman. Flex kartochka ichidagi matnni tizadi, kartochkalarning o'zini emas.",
        'Вернёмся к загадке. Помнишь, я написал display flex каждой карточке? Смотри: они всё равно стоят друг под другом! Я ошибся. Flex расставляет то, что внутри карточки, а не сами карточки.',
        'Back to our riddle. Remember, I wrote display flex on each card? Look: they still stand one under another! I was wrong. Flex arranges what’s inside a card, not the cards themselves.'), k: 'riddle' },
      { text: L3("Kartochkalarni qatorga terish uchun flex ularning otasiga, ya'ni javonga yoziladi. Mana!", 'Чтобы поставить карточки в ряд, flex пишут их родителю, то есть полке. Вот!', 'To put the cards in a row, flex goes on their parent, the shelf. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning javoningiz, o'zingiz tanlagan qiymatlar bilan!", 'Смотри, это твоя полка с твоими собственными значениями!', 'Look, this is your shelf with the values you picked yourself!'), k: 'own' },
      { text: L3("display flex ota qutiga yoziladi.", 'display flex пишут коробке-родителю.', 'display flex goes on the parent box.'), k: 'flex' },
      { text: L3("flex-direction yo'nalishni beradi: row, column va teskarilari.", 'flex-direction задаёт направление: row, column и обратные.', 'flex-direction sets the direction: row, column and the reverses.'), k: 'dir' },
      { text: L3("Asosiy o'q shu yo'nalish bo'yicha ketadi.", 'Главная ось идёт по этому направлению.', 'The main axis follows that direction.'), k: 'main' },
      { text: L3("Ko'ndalang o'q esa unga tik, bolalar uning bo'ylab cho'ziladi.", 'А поперечная ось — поперёк неё, по ней дети растягиваются.', 'And the cross axis goes across it; the children stretch along it.'), k: 'cross' },
      { text: L3("Tabriklayman! Endi siz elementlarni qatorga va ustunga tera olasiz. Keyingi darsda ularni o'qlar bo'ylab tekislashni o'rganamiz: o'rtaga, chetlarga va orasida bo'shliq bilan. Ko'rishguncha!",
        'Ура! Теперь ты умеешь ставить элементы в ряд и в столбик. На следующем уроке научимся выравнивать их по осям: по центру, по краям и с промежутками. До встречи!',
        'Hooray! Now you can line elements up in a row and a column. Next lesson we’ll learn to align them along the axes: to the center, to the edges and with gaps. See you!') }
    ],
    roles: {
      flex: L3("display: flex — otaga", 'display: flex — родителю', 'display: flex — on the parent'),
      dir: L3("flex-direction — yo'nalish", 'flex-direction — направление', 'flex-direction — the direction'),
      main: L3("asosiy o'q — yo'nalish bo'yicha", 'главная ось — по направлению', 'main axis — along the direction'),
      cross: L3("ko'ndalang o'q — unga tik", 'поперечная ось — поперёк', 'cross axis — across it')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayFlex: 1, sayCol: 1, sayRR: 1, sayCR: 1,
  sayStretch: 1, sayTypo: 1, sayFlexbox: 1, sayNoFlex: 1, child: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c10-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c10.css@*/
`;
