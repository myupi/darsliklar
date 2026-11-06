// =============================================================================
// КУРС «CSS» · Урок 11 — «Flexbox: выравнивание»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css11/build.mjs → lessons/css/11-flexbox-vyravnivanie.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 11 · «Flexbox: выравнивание» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Урок 10: display: flex, flex-direction, главная и поперечная оси (стрелки). Полка Коди
// выстроилась в ряд, но карточки прижаты к краю и слиплись. Ученик узнаёт justify-content (по главной оси: flex-start,
// center, flex-end, space-between), align-items (по поперечной: stretch, flex-start, center, flex-end), gap
// (промежутки) и flex-wrap: wrap (перенос, если не помещается). Стрелки осей остаются — по ним видно, вдоль чего
// выравнивает каждое свойство. Загадка (без имён): чтобы поставить карточки по центру сверху вниз, Коди пишет
// justify-content: center. Разгадка: в ряду justify — слева направо, сверху вниз — align-items.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (карточки у края → центр по двум осям и gap; загадка про justify сверху вниз)
//   justify: s2 показ (center · flex-end · space-between) · s3 вписать center (Fill) · s4 значение ↔ мини-полка (Matching)
//   align:   s5 показ (stretch → flex-start · center · flex-end) · s6 вписать flex-end (Fill) · s7 какой код у полки (выбор)
//   gap/wrap: s8 показ (6 карточек: gap · width 90 — сжались · flex-wrap — перенос) · s9 вписать 20px (Fill) · s10 какое свойство нужно (Sort)
//   поломки: s11 показ (centre, middle; ловушка — в column justify сверху вниз) · s12 исправить «middle» (Debug & Fix) · s13 найти правило
//   w1 правило из двух свойств: nav { display: flex; justify-content: space-between; } · s14 своя полка («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: верная ли запись — решает Chrome (CSS.supports): «centre», «middle», «gap: 20» не принимаются;
//     сжатие и перенос карточек — сам браузер; стрелки осей — по вычисленному flex-direction.
//   · Основа страницы — тусклые строки: полка уже flex и высотой 110px, карточки сиреневые с padding.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: tekislash — выравнивание; o'rta — середина; boshi / oxiri — начало / конец; oraliq — промежуток;
// yangi qator — новая строка; asosiy / ko'ndalang o'q — главная / поперечная ось. В речи свойства и значения — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-11-flexbox-vyravnivanie',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '11-dars. Flexbox: tekislash',
    ru: 'Урок 11. Flexbox: выравнивание',
    en: 'Lesson 11. Flexbox: alignment'
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
  next: L3("Pozitsiyalash", 'Позиционирование', 'Positioning'),
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
    c1: L3("Futbol", 'Футбол', 'Football'),
    c2: L3("Shaxmat", 'Шахматы', 'Chess'),
    c3: L3("Suzish", 'Плавание', 'Swimming'),
    c4: L3("Tennis", 'Теннис', 'Tennis'),
    c5: L3("Boks", 'Бокс', 'Boxing'),
    c6: L3("Yugurish", 'Бег', 'Running')
  },
  menu: {
    a1: L3("Bosh sahifa", 'Главная', 'Home'),
    a2: L3("O'yinlar", 'Игры', 'Games'),
    a3: L3("Aloqa", 'Контакты', 'Contact')
  },
  s1: {
    eyebrow: L3("Javon", 'Полка', 'The shelf'),
    say: L3("Salom! Javonim qatorga tizildi, lekin qarang: kartochkalar chap chetga siqilib, bir-biriga yopishib qolgan. Men ularni javonning qoq o'rtasiga qo'ymoqchiman, orasida bo'shliq bilan. «Aylantirish» tugmasini bosing.",
      'Привет! Моя полка выстроилась в ряд, но смотри: карточки прижались к левому краю и слиплись. Я хочу поставить их ровно в середину полки, с промежутками. Нажми «Превратить».',
      'Hi! My shelf lined up in a row, but look: the cards are squeezed to the left edge and stuck together. I want to put them right in the middle of the shelf, with gaps. Tap “Transform”.'),
    magic: L3("Mana! Kartochkalar javonning o'rtasida, ham chapdan o'ngga, ham tepadan pastga. Oralarida esa bo'shliq bor.", 'Вот! Карточки в середине полки и слева направо, и сверху вниз. А между ними — промежутки.', 'There! The cards are in the middle of the shelf both left to right and top to bottom. And there are gaps between them.'),
    magicP: L3("Buni uchta xususiyat qildi: justify-content asosiy o'q bo'ylab tekisladi, align-items ko'ndalang o'q bo'ylab, gap esa oraliq qo'ydi.", 'Это сделали три свойства: justify-content выровнял по главной оси, align-items — по поперечной, а gap поставил промежутки.', 'Three properties did it: justify-content aligned along the main axis, align-items along the cross axis, and gap added the gaps.'),
    done: L3("Bugun elementlarni flex qutida tekislashni o'rganasiz. Lekin oldin topishmoq. Men birinchi marta kartochkalarni tepadan pastga o'rtaga qo'ymoqchi bo'lib, justify-content center yozgan edim. Menimcha, ular tepadan pastga o'rtaga tushishi kerak. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты научишься выравнивать элементы во flex-коробке. Но сначала загадка. В первый раз, чтобы поставить карточки по центру сверху вниз, я написал justify-content center. По-моему, они должны встать по центру сверху вниз. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to align elements in a flex box. But first, a riddle. The first time, to center the cards top to bottom, I wrote justify-content center. I think they should land in the middle top to bottom. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("justify-content · align-items · gap", 'justify-content · align-items · gap', 'justify-content · align-items · gap')
  },
  s2: {
    eyebrow: L3("Asosiy o'q bo'ylab", 'По главной оси', 'Along the main axis'),
    say: L3("Birinchisi justify-content. U elementlarni asosiy o'q bo'ylab tekislaydi, ya'ni to'q sariq strelka yo'nalishida. Hozir ular odatdagidek boshida turibdi.",
      'Первое — justify-content. Оно выравнивает элементы по главной оси, то есть по оранжевой стрелке. Сейчас они, как обычно, стоят в начале.',
      'The first is justify-content. It aligns elements along the main axis, that is, along the orange arrow. Right now they stand at the start, as usual.'),
    sayCenter: L3("center, ya'ni o'rta. Kartochkalar javonning o'rtasiga yig'ildi.", 'center, то есть середина. Карточки собрались в середине полки.', 'center, meaning the middle. The cards gathered in the middle of the shelf.'),
    sayEnd: L3("flex-end, ya'ni oxiri. Kartochkalar o'ng chetga o'tdi, strelka tugaydigan joyga.", 'flex-end, то есть конец. Карточки ушли к правому краю, туда, где кончается стрелка.', 'flex-end, meaning the end. The cards moved to the right edge, where the arrow ends.'),
    sayBetween: L3("space-between, ya'ni orasida joy. Birinchisi chapda, oxirgisi o'ngda, qolgan joy esa ular orasida teng bo'lindi.", 'space-between, то есть место между. Первая слева, последняя справа, а остальное место поделено между ними поровну.', 'space-between, meaning space between. The first on the left, the last on the right, and the rest of the space is shared equally between them.'),
    done: L3("Demak, justify-content asosiy o'q bo'ylab tekislaydi: boshi, o'rtasi, oxiri yoki orasida joy bilan.", 'Значит, justify-content выравнивает по главной оси: в начало, в середину, в конец или с местом между.', 'So justify-content aligns along the main axis: to the start, the middle, the end, or with space between.'),
    askStart: L3("Qarang: boshida", 'Смотри: в начале', 'Watch: at the start'),
    askCenter: L3("Qarang: center — o'rtada", 'Смотри: center — в середине', 'Watch: center is the middle'),
    askEnd: L3("Qarang: flex-end — oxirida", 'Смотри: flex-end — в конце', 'Watch: flex-end is the end'),
    askBetween: L3("Qarang: space-between — orasida joy", 'Смотри: space-between — место между', 'Watch: space-between'),
    askDone: L3("justify-content — asosiy o'q bo'ylab", 'justify-content — по главной оси', 'justify-content is along the main axis')
  },
  s3: {
    eyebrow: L3("O'rtaga", 'В середину', 'To the middle'),
    say: L3("Endi navbat sizga. Kartochkalar javonning o'rtasida tursin: justify-content uchun qiymatni yozing.",
      'Теперь твоя очередь. Пусть карточки стоят в середине полки: впиши значение для justify-content.',
      'Now it’s your turn. Let the cards stand in the middle of the shelf: type the value for justify-content.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      centre: L3("CSS da bu so'z amerikacha yoziladi: oxiri er bilan.", 'В CSS это слово пишется по-американски: на конце er.', 'In CSS this word uses the American spelling: it ends in er.'),
      middle: L3("CSS da o'rta middle emas. Boshqa so'z kerak.", 'В CSS середина — не middle. Нужно другое слово.', 'In CSS the middle isn’t middle. Another word is needed.'),
      bad: L3("Brauzer bu so'zni tanimadi. justify-content uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для justify-content.', 'The browser didn’t recognize that word. Check the word for justify-content.'),
      'flex-start': L3("flex-start bilan kartochkalar boshida qoladi. O'rta kerak.", 'С flex-start карточки останутся в начале. Нужна середина.', 'With flex-start the cards stay at the start. We need the middle.'),
      'flex-end': L3("flex-end bilan ular oxiriga o'tdi. O'rta kerak.", 'С flex-end они ушли в конец. Нужна середина.', 'With flex-end they moved to the end. We need the middle.'),
      'space-between': L3("space-between bilan ular chetlarga tarqaldi. O'rta kerak.", 'С space-between они разошлись по краям. Нужна середина.', 'With space-between they spread to the edges. We need the middle.'),
      other: L3("Bu boshqa qiymat. O'rta kerak.", 'Это другое значение. Нужна середина.', 'That’s a different value. We need the middle.')
    },
    hints: [
      L3("O'rta inglizcha qanday?", 'Как по-английски «середина, центр»?', 'What’s the English for the middle?'),
      L3("O'rta center deyiladi.", 'Середина — center.', 'The middle is center.'),
      L3("center deb yozing va Tekshirishni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Zo'r! Kartochkalar javonning o'rtasida.", 'Огонь! Карточки в середине полки.', 'Awesome! The cards are in the middle of the shelf.'),
    ask: L3("Kartochkalarni o'rtaga qo'ying", 'Поставь карточки в середину', 'Put the cards in the middle')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Endi qiymatlarni javonlar bilan juftlang. Chapdan qiymatni, o'ngdan esa shunday tekislangan javonni bosing.",
      'Теперь соедини значения с полками. Нажми значение слева, а потом полку, выровненную так, справа.',
      'Now match the values with the shelves. Tap a value on the left, then the shelf aligned that way on the right.'),
    why: {
      'flex-start': L3("flex-start: hammasi boshida, chap chetda.", 'flex-start: все в начале, у левого края.', 'flex-start: everything at the start, by the left edge.'),
      center: L3("center: hammasi o'rtada yig'ilgan.", 'center: все собрались в середине.', 'center: everything gathered in the middle.'),
      'space-between': L3("space-between: chetlarda va orasida teng joy.", 'space-between: по краям и с равными промежутками.', 'space-between: at the edges with equal space between.')
    },
    pairOk: {
      'flex-start': L3("To'g'ri, bu boshida.", 'Верно, это в начале.', 'Right, that’s at the start.'),
      center: L3("To'g'ri, bu o'rtada.", 'Верно, это в середине.', 'Right, that’s in the middle.'),
      'space-between': L3("To'g'ri, bu orasida joy bilan.", 'Верно, это с местом между.', 'Right, that’s with space between.')
    },
    pickFirst: L3("Oldin chapdan qiymatni tanlang.", 'Сначала выбери значение слева.', 'First pick a value on the left.'),
    hints: [
      L3("Kubiklar qayerda yig'ilganiga qarang: chapdami, o'rtadami, chetlardami?", 'Посмотри, где собрались кубики: слева, в середине, по краям?', 'Look where the blocks gathered: left, middle, or at the edges?'),
      L3("flex-start chapda, center o'rtada, space-between chetlarda.", 'flex-start — слева, center — в середине, space-between — по краям.', 'flex-start is on the left, center in the middle, space-between at the edges.'),
      L3("Yonib turgan juftlikni bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Tekislashni ko'z bilan o'qiysiz.", 'Отлично! Ты читаешь выравнивание на глаз.', 'Great! You read alignment by eye.'),
    ask: L3("Qiymatni, keyin javonni bosing", 'Нажми значение, потом полку', 'Tap a value, then a shelf'),
    askPlace: L3("Endi shunday javonni bosing", 'Теперь нажми такую полку', 'Now tap that shelf')
  },
  s5: {
    eyebrow: L3("Ko'ndalang o'q bo'ylab", 'По поперечной оси', 'Along the cross axis'),
    say: L3("Ikkinchisi align-items. U elementlarni ko'ndalang o'q bo'ylab tekislaydi, ya'ni binafsha strelka yo'nalishida. Odatda u stretch, ya'ni cho'zish: kartochkalar javonning butun balandligini egallaydi.",
      'Второе — align-items. Оно выравнивает элементы по поперечной оси, то есть по фиолетовой стрелке. Обычно это stretch, то есть растянуть: карточки занимают всю высоту полки.',
      'The second is align-items. It aligns elements along the cross axis, that is, along the purple arrow. By default it’s stretch: the cards take the full height of the shelf.'),
    sayStart: L3("flex-start: kartochkalar cho'zilmadi va tepaga, strelka boshiga ko'tarildi.", 'flex-start: карточки перестали растягиваться и поднялись наверх, к началу стрелки.', 'flex-start: the cards stopped stretching and rose to the top, to the start of the arrow.'),
    sayCenter: L3("center: tepadan pastga o'rtada.", 'center: по центру сверху вниз.', 'center: in the middle, top to bottom.'),
    sayEnd: L3("flex-end: pastga, strelka oxiriga tushdi.", 'flex-end: опустились вниз, к концу стрелки.', 'flex-end: they dropped down, to the end of the arrow.'),
    done: L3("Demak, align-items ko'ndalang o'q bo'ylab tekislaydi. Qiymatlar o'sha-o'sha: flex-start, center va flex-end.", 'Значит, align-items выравнивает по поперечной оси. Значения те же: flex-start, center и flex-end.', 'So align-items aligns along the cross axis. The values are the same: flex-start, center and flex-end.'),
    askStart: L3("Qarang: stretch — cho'zilgan", 'Смотри: stretch — растянуты', 'Watch: stretch'),
    askTop: L3("Qarang: flex-start — tepada", 'Смотри: flex-start — наверху', 'Watch: flex-start is the top'),
    askCenter: L3("Qarang: center — o'rtada", 'Смотри: center — посередине', 'Watch: center is the middle'),
    askEnd: L3("Qarang: flex-end — pastda", 'Смотри: flex-end — внизу', 'Watch: flex-end is the bottom'),
    askDone: L3("align-items — ko'ndalang o'q bo'ylab", 'align-items — по поперечной оси', 'align-items is along the cross axis')
  },
  s6: {
    eyebrow: L3("Pastga", 'Вниз', 'Down'),
    say: L3("Endi siz. Kartochkalar javonning pastiga tushsin, xuddi tokchada turgandek: align-items uchun qiymatni yozing.",
      'Теперь ты. Пусть карточки опустятся на дно полки, будто стоят на ней: впиши значение для align-items.',
      'Your turn. Let the cards drop to the bottom of the shelf, as if standing on it: type the value for align-items.'),
    msgs: {
      empty: L3("Qiymatni yozing: ikki so'z, orasida chiziqcha.", 'Впиши значение: два слова через чёрточку.', 'Type the value: two words joined by a dash.'),
      bottom: L3("CSS da past bottom emas. Strelka oxiri kerak: flex va end.", 'В CSS низ — не bottom. Нужен конец стрелки: flex и end.', 'In CSS the bottom isn’t bottom. We need the end of the arrow: flex and end.'),
      end: L3("Deyarli! Flexbox da oldiga flex va chiziqcha qo'shiladi.", 'Почти! Во Flexbox впереди добавляют flex и чёрточку.', 'Almost! In Flexbox you add flex and a dash in front.'),
      bad: L3("Brauzer bu so'zni tanimadi. Ikki so'z chiziqcha bilan, bo'sh joysiz yoziladi.", 'Браузер не узнал это слово. Два слова пишутся через чёрточку, без пробела.', 'The browser didn’t recognize that word. Two words are joined by a dash, with no space.'),
      'flex-start': L3("flex-start bilan ular tepaga chiqdi. Past kerak.", 'С flex-start они поднялись наверх. Нужен низ.', 'With flex-start they went to the top. We need the bottom.'),
      center: L3("center bilan ular o'rtada. Past kerak.", 'С center они посередине. Нужен низ.', 'With center they’re in the middle. We need the bottom.'),
      stretch: L3("stretch bilan ular butun balandlikka cho'zildi. Past kerak.", 'Со stretch они растянуты на всю высоту. Нужен низ.', 'With stretch they fill the whole height. We need the bottom.'),
      other: L3("Bu boshqa qiymat. Past, ya'ni strelka oxiri kerak.", 'Это другое значение. Нужен низ, то есть конец стрелки.', 'That’s a different value. We need the bottom, the end of the arrow.')
    },
    hints: [
      L3("Binafsha strelka pastga qaraydi. Uning oxiri qanday ataladi?", 'Фиолетовая стрелка смотрит вниз. Как называется её конец?', 'The purple arrow points down. What’s its end called?'),
      L3("Oxiri flex-end.", 'Конец — flex-end.', 'The end is flex-end.'),
      L3("flex-end deb yozing va Tekshirishni bosing.", 'Впиши flex-end и нажми «Проверить».', 'Type flex-end and tap Check.')
    ],
    ok: L3("Barakalla! Kartochkalar javonning pastida turibdi.", 'Молодец! Карточки стоят на дне полки.', 'Well done! The cards stand at the bottom of the shelf.'),
    ask: L3("Kartochkalar pastga tushsin", 'Опусти карточки вниз', 'Move the cards to the bottom')
  },
  s7: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Javonga qarang va uni qaysi kod shunday qilganini tanlang. Strelkalar yordam beradi.",
      'Теперь проверь себя. Посмотри на полку и выбери, какой код сделал её такой. Стрелки помогут.',
      'Now check yourself. Look at the shelf and pick which code made it look like that. The arrows will help.'),
    ask: L3("Javonni qaysi kod shunday qildi?", 'Какой код сделал полку такой?', 'Which code made the shelf like this?'),
    hint1: L3("Kartochkalar qaysi strelka bo'ylab siljigan: to'q sariqmi yoki binafsha?", 'Вдоль какой стрелки сдвинулись карточки: оранжевой или фиолетовой?', 'Which arrow did the cards move along: orange or purple?'),
    hint2: L3("To'q sariq strelka bo'ylab justify-content, binafsha bo'ylab align-items.", 'Вдоль оранжевой — justify-content, вдоль фиолетовой — align-items.', 'Along the orange one, justify-content; along the purple one, align-items.'),
    rounds: [
      { want: 'justify-content: center;', opts: ['justify-content: center;', 'align-items: center;', 'justify-content: flex-end;'],
        why: L3("Kartochkalar chapdan o'ngga o'rtada va cho'zilgan: justify-content center.", 'Карточки посередине слева направо и растянуты: justify-content center.', 'The cards are in the middle left to right and stretched: justify-content center.') },
      { want: 'align-items: center;', opts: ['justify-content: center;', 'align-items: flex-end;', 'align-items: center;'],
        why: L3("Kartochkalar chapda, lekin tepadan pastga o'rtada: align-items center.", 'Карточки слева, но посередине сверху вниз: align-items center.', 'The cards are on the left but in the middle top to bottom: align-items center.') },
      { want: 'align-items: flex-start;', opts: ['align-items: stretch;', 'align-items: flex-start;', 'justify-content: flex-start;'],
        why: L3("Kartochkalar cho'zilmagan va tepada: align-items flex-start.", 'Карточки не растянуты и наверху: align-items flex-start.', 'The cards aren’t stretched and are at the top: align-items flex-start.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! justify va align ni adashtirmaysiz.", 'Всё верно! Ты не путаешь justify и align.', 'All correct! You don’t mix up justify and align.')
  },
  s8: {
    eyebrow: L3("Oraliq va yangi qator", 'Промежутки и перенос', 'Gaps and wrapping'),
    say: L3("Endi javonda oltita kartochka. Ular bir qatorga zo'rg'a sig'yapti va bir-biriga yopishgan.",
      'Теперь на полке шесть карточек. Они еле помещаются в ряд и слиплись.',
      'Now there are six cards on the shelf. They barely fit in a row and are stuck together.'),
    sayGap: L3("gap o'n ikki piksel: kartochkalar orasida teng bo'shliq paydo bo'ldi. gap ya'ni oraliq degani.", 'gap двенадцать пикселей: между карточками появились равные промежутки. gap — то есть промежуток.', 'gap twelve pixels: equal gaps appeared between the cards. gap means a gap.'),
    sayWidth: L3("Har bir kartochkaga width to'qson piksel. Qarang: ular bir qatorga sig'maydi, shuning uchun flex ularni siqib qo'ydi. Inspektorda kengliklar kichrayib ketdi.", 'Каждой карточке width девяносто пикселей. Смотри: в один ряд они не помещаются, и flex их сжал. В Инспекторе ширины стали меньше.', 'Each card gets width ninety pixels. Look: they don’t fit in one row, so flex squeezed them. The widths in the Inspector got smaller.'),
    sayWrap: L3("flex-wrap wrap, ya'ni o'rash: sig'magan kartochkalar yangi qatorga o'tdi, siqilish yo'qoldi va kartochkalar yana to'liq kenglikda.", 'flex-wrap wrap, то есть перенос: не поместившиеся карточки перешли на новую строку, сжатие пропало, и карточки снова полной ширины.', 'flex-wrap wrap, meaning wrapping: the cards that didn’t fit moved to a new line, the squeezing is gone, and the cards are full width again.'),
    done: L3("Demak, gap oraliq qo'yadi, flex-wrap wrap esa sig'maganlarni yangi qatorga o'tkazadi.", 'Значит, gap ставит промежутки, а flex-wrap wrap переносит то, что не поместилось, на новую строку.', 'So gap adds gaps, and flex-wrap wrap moves what doesn’t fit to a new line.'),
    askStart: L3("Qarang: oltita kartochka", 'Смотри: шесть карточек', 'Watch: six cards'),
    askGap: L3("Qarang: gap — oraliq", 'Смотри: gap — промежуток', 'Watch: gap'),
    askWidth: L3("Qarang: sig'madi — siqildi", 'Смотри: не поместились — сжались', 'Watch: no room, squeezed'),
    askWrap: L3("Qarang: flex-wrap — yangi qator", 'Смотри: flex-wrap — новая строка', 'Watch: flex-wrap makes a new line'),
    askDone: L3("gap — oraliq, flex-wrap — yangi qator", 'gap — промежуток, flex-wrap — перенос', 'gap is the gap, flex-wrap wraps')
  },
  s9: {
    eyebrow: L3("Oraliq", 'Промежуток', 'The gap'),
    say: L3("Endi siz. Kartochkalar orasida yigirma piksel bo'shliq bo'lsin: gap uchun qiymatni yozing.",
      'Теперь ты. Пусть между карточками будет промежуток двадцать пикселей: впиши значение для gap.',
      'Your turn. Let there be a twenty-pixel gap between the cards: type the value for gap.'),
    msgs: {
      empty: L3("Qiymat yozing: son va px.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat son yozildi. Son yoniga px qo'shing.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Brauzer bu qiymatni tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Bu boshqa oraliq. Yigirma piksel kerak.", 'Это другой промежуток. Нужно двадцать пикселей.', 'That’s a different gap. We need twenty pixels.')
    },
    hints: [
      L3("Qiymat son va px.", 'Значение — число и px.', 'The value is a number and px.'),
      L3("Son yigirma, birlik px.", 'Число двадцать, единица px.', 'The number is twenty, the unit is px.'),
      L3("Yigirma sonini yozing, yoniga px qo'ying va Tekshirishni bosing.", 'Впиши число двадцать, допиши px и нажми «Проверить».', 'Type the number twenty, add px and tap Check.')
    ],
    ok: L3("Ajoyib! Kartochkalar orasida teng bo'shliq.", 'Отлично! Между карточками равные промежутки.', 'Great! Equal gaps between the cards.'),
    ask: L3("Kartochkalar orasida 20px bo'lsin", 'Сделай промежуток 20px', 'Make a 20px gap')
  },
  s10: {
    eyebrow: L3("Qaysi xususiyat?", 'Какое свойство?', 'Which property?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men vazifani aytaman, siz esa qaysi xususiyat kerakligini tanlang.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, какое свойство нужно.',
      'Now check yourself. I’ll say a task, and you pick which property is needed.'),
    ask: L3("Bu vazifa uchun qaysi xususiyat kerak?", 'Какое свойство нужно для этой задачи?', 'Which property does this task need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Vazifa nima haqida: asosiy o'q, ko'ndalang o'q, oraliq yoki yangi qator?", 'О чём задача: главная ось, поперечная ось, промежуток или новая строка?', 'What’s the task about: the main axis, the cross axis, a gap or a new line?'),
    hint2: L3("justify-content asosiy o'q, align-items ko'ndalang o'q, gap oraliq, flex-wrap yangi qator.", 'justify-content — главная ось, align-items — поперечная, gap — промежуток, flex-wrap — новая строка.', 'justify-content is the main axis, align-items the cross axis, gap the gap, flex-wrap a new line.'),
    items: [
      { t: L3("Kartochkalar orasida bo'shliq bo'lsin.", 'Между карточками нужны промежутки.', 'There should be gaps between the cards.'), right: 'gap',
        why: L3("Oraliq gap bilan beriladi.", 'Промежуток задаёт gap.', 'gap sets the gap.') },
      { t: L3("Sig'magan kartochkalar yangi qatorga o'tsin.", 'Не поместившиеся карточки должны перейти на новую строку.', 'The cards that don’t fit should move to a new line.'), right: 'flex-wrap',
        why: L3("Yangi qatorga o'tkazish flex-wrap bilan.", 'Перенос на новую строку — это flex-wrap.', 'Moving to a new line is flex-wrap.') },
      { t: L3("Qatordagi kartochkalar tepadan pastga o'rtada tursin.", 'Карточки в ряд должны стоять посередине сверху вниз.', 'Cards in a row should stand in the middle top to bottom.'), right: 'align-items',
        why: L3("Qatorda tepadan pastga bu ko'ndalang o'q: align-items.", 'В ряду сверху вниз — это поперечная ось: align-items.', 'In a row, top to bottom is the cross axis: align-items.') },
      { t: L3("Menyu havolalari chap va o'ng chetlarga tarqalsin.", 'Ссылки меню должны разойтись к левому и правому краю.', 'The menu links should spread to the left and right edges.'), right: 'justify-content',
        why: L3("Chapdan o'ngga asosiy o'q: justify-content space-between.", 'Слева направо — главная ось: justify-content space-between.', 'Left to right is the main axis: justify-content space-between.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! To'rtala xususiyatni joyida ishlatasiz.", 'Всё верно! Ты применяешь все четыре свойства к месту.', 'All correct! You use all four properties in the right place.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    say: L3("Tekislashda ham xatolar bo'ladi. Keling, ikkitasini va bitta tuzoqni ko'ramiz. Hozir kartochkalar o'rtada.",
      'И в выравнивании бывают ошибки. Давай посмотрим на две ошибки и одну ловушку. Сейчас карточки в середине.',
      'Alignment has mistakes too. Let’s look at two mistakes and one trap. Right now the cards are in the middle.'),
    sayCentre: L3("Birinchisi: center britancha yozilgan, oxiri re bilan. CSS faqat amerikacha yozuvni taniydi, kartochkalar boshiga qaytdi.", 'Первая: center написан по-британски, с re на конце. CSS знает только американское написание, карточки вернулись в начало.', 'The first: center is spelled the British way, ending in re. CSS only knows the American spelling, so the cards went back to the start.'),
    sayMiddle: L3("Ikkinchisi: align-items uchun middle. Bunday qiymat yo'q, kartochkalar yana cho'zildi.", 'Вторая: для align-items написано middle. Такого значения нет, карточки снова растянулись.', 'The second: align-items says middle. There’s no such value, so the cards stretched again.'),
    sayColumn: L3("Tuzoq: column da o'qlar almashadi. justify-content center endi kartochkalarni tepadan pastga o'rtaga qo'ydi, chunki asosiy o'q pastga qaraydi.", 'Ловушка: в column оси меняются. Теперь justify-content center ставит карточки посередине сверху вниз, ведь главная ось смотрит вниз.', 'The trap: in column the axes swap. Now justify-content center centers the cards top to bottom, because the main axis points down.'),
    done: L3("Demak, so'zlar aniq yoziladi: center va flex-end. justify esa doim asosiy o'q bo'ylab ishlaydi, o'q qayoqqa qaramasin.", 'Значит, слова пишутся точно: center и flex-end. А justify всегда работает по главной оси, куда бы она ни смотрела.', 'So the words must be exact: center and flex-end. And justify always works along the main axis, wherever it points.'),
    askStart: L3("Qarang: center", 'Смотри: center', 'Watch: center'),
    askCentre: L3("Qarang: centre — britancha", 'Смотри: centre — по-британски', 'Watch: centre is British'),
    askMiddle: L3("Qarang: middle — yo'q", 'Смотри: middle — нет такого', 'Watch: middle doesn’t exist'),
    askColumn: L3("Qarang: column — justify pastga", 'Смотри: column — justify вниз', 'Watch: column, justify goes down'),
    askDone: L3("So'z aniq, justify — asosiy o'q", 'Точное слово, justify — главная ось', 'Exact words, justify is the main axis')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men kartochkalarni tepadan pastga o'rtaga qo'ymoqchi edim, lekin ular cho'zilib qolaveradi! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я хотел поставить карточки посередине сверху вниз, а они всё растянуты! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wanted to center the cards top to bottom, but they stay stretched! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      middle: L3("middle CSS da yo'q. O'rta uchun boshqa so'z bor.", 'middle в CSS нет. Для середины есть другое слово.', 'middle doesn’t exist in CSS. There’s another word for the middle.'),
      centre: L3("Deyarli! CSS da amerikacha: oxiri er bilan.", 'Почти! В CSS по-американски: на конце er.', 'Almost! In CSS it’s the American spelling: ending in er.'),
      bad: L3("Brauzer bu so'zni tanimadi. O'rta uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для середины.', 'The browser didn’t recognize that word. Check the word for the middle.'),
      'flex-start': L3("flex-start bilan ular tepada. O'rta kerak.", 'С flex-start они наверху. Нужна середина.', 'With flex-start they’re at the top. We need the middle.'),
      'flex-end': L3("flex-end bilan ular pastda. O'rta kerak.", 'С flex-end они внизу. Нужна середина.', 'With flex-end they’re at the bottom. We need the middle.'),
      stretch: L3("stretch bilan ular cho'zilgan. O'rta kerak.", 'Со stretch они растянуты. Нужна середина.', 'With stretch they’re stretched. We need the middle.'),
      other: L3("Bu boshqa qiymat. O'rta kerak.", 'Это другое значение. Нужна середина.', 'That’s a different value. We need the middle.')
    },
    hints: [
      L3("middle so'zi CSS da yo'q.", 'Слова middle в CSS нет.', 'The word middle doesn’t exist in CSS.'),
      L3("O'rta uchun center ishlatiladi.", 'Для середины используют center.', 'center is used for the middle.'),
      L3("center deb yozing va Tekshirishni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Ura, ishladi! Kartochkalar tepadan pastga o'rtada.", 'Ура, заработало! Карточки посередине сверху вниз.', 'Hooray, it works! The cards are in the middle top to bottom.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Javonga qarang va o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на полку и нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the shelf and tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa joy buzildi. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: javonda uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на полке видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the shelf. What doesn’t match the code?'),
    found: {
      centre: L3("Topdingiz! center britancha yozilgan edi.", 'Есть! center был написан по-британски.', 'Found it! center was spelled the British way.'),
      unit: L3("Topdingiz! Yigirma sonidan keyin px yo'q edi.", 'Есть! После двадцати не было px.', 'Found it! There was no px after twenty.')
    },
    hint1: L3("Javonga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на полку: что не так, как в коде?', 'Look at the shelf: what doesn’t match the code?'),
    hint2: {
      centre: L3("Kartochkalar chapdan o'ngga o'rtadami? justify-content qiymatini tekshiring.", 'Карточки посередине слева направо? Проверь значение justify-content.', 'Are the cards in the middle left to right? Check the justify-content value.'),
      unit: L3("Kartochkalar orasida bo'shliq bormi? gap qiymatini tekshiring.", 'Есть ли промежутки между карточками? Проверь значение gap.', 'Are there gaps between the cards? Check the gap value.')
    },
    hint3: {
      centre: L3("Xato birinchi qoidada: centre. O'sha qatorni bosing.", 'Ошибка в первом правиле: centre. Нажми эту строку.', 'The bug is in the first rule: centre. Tap that line.'),
      unit: L3("Xato uchinchi qoidada: px yo'q. O'sha qatorni bosing.", 'Ошибка в третьем правиле: нет px. Нажми эту строку.', 'The bug is in the third rule: no px. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz tekislashni haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Обе найдены. Ты проверяешь выравнивание как настоящий разработчик.', 'Super! Both found. You check alignment like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Menyu nav tegi ichida. U flex bo'lsin va havolalar chap va o'ng chetlarga tarqalsin, oralarida teng joy bilan.",
      'Теперь напиши правило целиком. Меню лежит в теге nav. Пусть он будет flex, а ссылки разойдутся к левому и правому краю, с равными промежутками.',
      'Now write the whole rule yourself. The menu is inside the nav tag. Make it flex and spread the links to the left and right edges, with equal space between them.'),
    msgs: {
      empty: L3("Qoidani yozing: avval selektor, keyin figurali qavslar ichida xususiyatlar.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойства.', 'Write the rule: first the selector, then the properties inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat orasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Menyu nav tegi ichida: selektor nav.", 'Меню лежит в теге nav: селектор — nav.', 'The menu is in the nav tag: the selector is nav.'),
      noFlex: L3("Avval nav flex bo'lishi kerak: display flex.", 'Сначала nav должен быть flex: display flex.', 'First nav has to be flex: display flex.'),
      noJustify: L3("flex bor, havolalar esa hali chapda. Tekislashni ham yozing.", 'flex есть, а ссылки пока слева. Допиши и выравнивание.', 'flex is there, but the links are still on the left. Add the alignment too.'),
      other: L3("Tekislash boshqacha. Havolalar chetlarga tarqalsin, oralarida teng joy.", 'Выравнивание другое. Ссылки должны разойтись по краям с равными промежутками.', 'The alignment is different. The links should spread to the edges with equal space between.'),
      bad: L3("Brauzer bu so'zni tanimadi. So'zlarni tekshiring.", 'Браузер не узнал это слово. Проверь слова.', 'The browser didn’t recognize that word. Check the words.')
    },
    hints: [
      L3("Ikki xususiyat kerak: biri flex qiladi, ikkinchisi asosiy o'q bo'ylab tekislaydi.", 'Нужны два свойства: одно делает flex, второе выравнивает по главной оси.', 'Two properties are needed: one makes it flex, the other aligns along the main axis.'),
      L3("display flex va justify-content space-between.", 'display flex и justify-content space-between.', 'display flex and justify-content space-between.'),
      L3("Shunday yozing: nav, figurali qavs, display ikki nuqta flex nuqtali vergul, justify-content ikki nuqta space-between nuqtali vergul, yopuvchi figurali qavs.", 'Напиши так: nav, фигурная скобка, display двоеточие flex точка с запятой, justify-content двоеточие space-between точка с запятой, закрывающая фигурная скобка.', 'Write it like this: nav, curly brace, display colon flex semicolon, justify-content colon space-between semicolon, closing curly brace.')
    ],
    ok: L3("Ajoyib! Menyu butun kenglikka tarqaldi, xuddi haqiqiy saytlardagidek. Qoidani o'zingiz yozdingiz.", 'Отлично! Меню разошлось на всю ширину, как на настоящих сайтах. Правило написано тобой целиком.', 'Great! The menu spreads across the full width, just like on real sites. You wrote the whole rule yourself.'),
    ask: L3("nav: flex va chetlarga tarqatish", 'nav: flex и разнести по краям', 'nav: flex and spread to the edges')
  },
  s14: {
    eyebrow: L3("O'z javoningiz", 'Своя полка', 'Your own shelf'),
    say: L3("Endi o'z javoningizni tekislang. Asosiy o'q, ko'ndalang o'q va oraliq uchun istalgan qiymatni yozing. Keyin «Tayyor»ni bosing.",
      'Теперь выровняй свою полку. Впиши любые значения для главной оси, поперечной оси и промежутка. Потом нажми «Готово».',
      'Now align your own shelf. Type any values for the main axis, the cross axis and the gap. Then tap “Done”.'),
    msgs: {
      j: L3("Brauzer justify-content uchun {w} so'zini tanimadi. Masalan, center yoki space-between yozing.", 'Браузер не узнал слово {w} для justify-content. Впиши, например, center или space-between.', 'The browser didn’t recognize {w} for justify-content. Type, for example, center or space-between.'),
      a: L3("Brauzer align-items uchun {w} so'zini tanimadi. Masalan, center yoki flex-end yozing.", 'Браузер не узнал слово {w} для align-items. Впиши, например, center или flex-end.', 'The browser didn’t recognize {w} for align-items. Type, for example, center or flex-end.'),
      gap: L3("Brauzer {w} oralig'ini tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал промежуток {w}. Напиши число и px без пробела.', 'The browser didn’t recognize the gap {w}. Write a number and px with no space.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("justify-content va align-items uchun center, flex-start yoki flex-end kabi so'z; gap uchun son va px.", 'Для justify-content и align-items — слово вроде center, flex-start или flex-end; для gap — число и px.', 'For justify-content and align-items, a word like center, flex-start or flex-end; for gap, a number and px.'),
      L3("Masalan: space-between, center va o'n ikki piksel. Keyin «Tayyor»ni bosing.", 'Например: space-between, center и двенадцать пикселей. Потом нажми «Готово».', 'For example: space-between, center and twelve pixels. Then tap “Done”.')
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
    hint1: L3("Gap qaysi xususiyat haqida va qaysi o'q bo'ylab?", 'О каком свойстве фраза и по какой оси?', 'Which property is the sentence about, and along which axis?'),
    hint2: L3("Esingizdami: justify asosiy o'q, align ko'ndalang o'q, gap oraliq, wrap yangi qator.", 'Вспомни: justify — главная ось, align — поперечная, gap — промежуток, wrap — новая строка.', 'Remember: justify is the main axis, align the cross axis, gap the gap, wrap a new line.'),
    items: [
      { t: L3("justify-content elementlarni asosiy o'q bo'ylab tekislaydi.", 'justify-content выравнивает элементы по главной оси.', 'justify-content aligns elements along the main axis.'), right: true,
        why: L3("To'g'ri: justify asosiy o'q bo'ylab ishlaydi.", 'Верно: justify работает по главной оси.', 'Right: justify works along the main axis.') },
      { t: L3("Bu qoida qatordagi kartochkalarni chapdan o'ngga o'rtaga qo'yadi.", 'Это правило ставит карточки ряда посередине слева направо.', 'This rule centers the row’s cards left to right.'), right: false, code: 'ai',
        why: L3("Aslida align-items ko'ndalang o'q bo'ylab: qatorda bu tepadan pastga.", 'На самом деле align-items — по поперечной оси: в ряду это сверху вниз.', 'Actually align-items works along the cross axis: in a row that’s top to bottom.') },
      { t: L3("gap kartochkalar orasiga bo'shliq qo'yadi.", 'gap ставит промежутки между карточками.', 'gap puts gaps between the cards.'), right: true,
        why: L3("To'g'ri: gap bu oraliq.", 'Верно: gap — это промежуток.', 'Right: gap is the gap.') },
      { t: L3("flex-wrap wrap kartochkalarni kichraytiradi.", 'flex-wrap wrap уменьшает карточки.', 'flex-wrap wrap makes the cards smaller.'), right: false,
        why: L3("Aslida wrap ularni yangi qatorga o'tkazadi, o'lchami esa saqlanadi.", 'На самом деле wrap переносит их на новую строку, а размер сохраняется.', 'Actually wrap moves them to a new line, and their size stays the same.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz flex tekislashni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в выравнивании flex.', 'All correct! You know flex alignment really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men kartochkalarni tepadan pastga o'rtaga qo'yish uchun justify-content center yozgan edim? Qarang: ular chapdan o'ngga o'rtaga keldi, tepadan pastga esa o'zgarmadi. Men adashibman! justify asosiy o'q bo'ylab ishlaydi, qatorda bu chapdan o'ngga.",
        'Вернёмся к загадке. Помнишь, чтобы поставить карточки посередине сверху вниз, я написал justify-content center? Смотри: они встали посередине слева направо, а сверху вниз ничего не изменилось. Я ошибся! justify работает по главной оси, а в ряду это слева направо.',
        'Back to our riddle. Remember, to center the cards top to bottom, I wrote justify-content center? Look: they centered left to right, but nothing changed top to bottom. I was wrong! justify works along the main axis, and in a row that’s left to right.'), k: 'riddle' },
      { text: L3("Tepadan pastga o'rtaga qo'yish uchun align-items center kerak edi. Mana!", 'Чтобы поставить посередине сверху вниз, нужен был align-items center. Вот!', 'To center top to bottom, I needed align-items center. There!'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning javoningiz, o'zingiz tanlagan qiymatlar bilan!", 'Смотри, это твоя полка с твоими собственными значениями!', 'Look, this is your shelf with the values you picked yourself!'), k: 'own' },
      { text: L3("justify-content asosiy o'q bo'ylab tekislaydi.", 'justify-content выравнивает по главной оси.', 'justify-content aligns along the main axis.'), k: 'jc' },
      { text: L3("align-items ko'ndalang o'q bo'ylab tekislaydi.", 'align-items выравнивает по поперечной оси.', 'align-items aligns along the cross axis.'), k: 'ai' },
      { text: L3("gap elementlar orasiga oraliq qo'yadi.", 'gap ставит промежутки между элементами.', 'gap puts gaps between elements.'), k: 'gap' },
      { text: L3("flex-wrap wrap sig'maganlarni yangi qatorga o'tkazadi.", 'flex-wrap wrap переносит то, что не поместилось, на новую строку.', 'flex-wrap wrap moves what doesn’t fit to a new line.'), k: 'wrap' },
      { text: L3("Tabriklayman! Endi siz Flexbox bilan har qanday qatorni chiroyli tekislay olasiz. Keyingi darsda elementlarni sahifaning istalgan joyiga qo'yishni o'rganamiz. Ko'rishguncha!",
        'Ура! Теперь ты умеешь красиво выравнивать любой ряд с помощью Flexbox. На следующем уроке научимся ставить элементы в любое место страницы. До встречи!',
        'Hooray! Now you can neatly align any row with Flexbox. Next lesson we’ll learn to place elements anywhere on the page. See you!') }
    ],
    roles: {
      jc: L3("justify-content — asosiy o'q", 'justify-content — главная ось', 'justify-content — main axis'),
      ai: L3("align-items — ko'ndalang o'q", 'align-items — поперечная ось', 'align-items — cross axis'),
      gap: L3("gap — oraliq", 'gap — промежуток', 'gap — the gap'),
      wrap: L3("flex-wrap — yangi qator", 'flex-wrap — новая строка', 'flex-wrap — a new line')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayCenter: 1, sayEnd: 1, sayBetween: 1,
  sayStart: 1, sayGap: 1, sayWidth: 1, sayWrap: 1, sayCentre: 1, sayMiddle: 1, sayColumn: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1,
  rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1, dir: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c11-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c11.css@*/
`;
