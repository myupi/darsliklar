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
    say: L3("Yana ko'rishdik! O'tgan darsda javonimni bir qatorga tizgan edik-ku. Lekin u hali do'kon vitrinasiga o'xshamayapti: kartochkalar chap chetga siqilib, bir-biriga yopishib qolibdi. Men ularni javonning qoq o'rtasiga qo'ymoqchiman, oralarida bo'sh joy ham bo'lsin. «Aylantirish» tugmasini bosib ko'ring-chi, nima bo'larkin.",
      'Привет! Моя полка выстроилась в ряд, но смотри: карточки прижались к левому краю и слиплись. Я хочу поставить их ровно в середину полки, с промежутками. Нажми «Превратить».',
      'Hi! My shelf lined up in a row, but look: the cards are squeezed to the left edge and stuck together. I want to put them right in the middle of the shelf, with gaps. Tap “Transform”.'),
    magic: L3("Endi javon vitrinaga o'xshab qoldi! Kartochkalar qoq o'rtada turibdi: chapdan o'ngga qarasangiz ham, tepadan pastga qarasangiz ham. Oralarida esa bo'sh joy paydo bo'ldi.", 'Вот! Карточки в середине полки и слева направо, и сверху вниз. А между ними — промежутки.', 'There! The cards are in the middle of the shelf both left to right and top to bottom. And there are gaps between them.'),
    magicP: L3("Bu ishni uchta xususiyat birgalikda qildi, ularning nomi kodda yonib turibdi. Biri kartochkalarni chapdan o'ngga o'rtaga surdi, ikkinchisi tepadan pastga. Uchinchisi-chi? U kartochkalarning oralariga bo'sh joy qo'ydi. Hozir ularni bittalab tanib olamiz.", 'Это сделали три свойства: justify-content выровнял по главной оси, align-items — по поперечной, а gap поставил промежутки.', 'Three properties did it: justify-content aligned along the main axis, align-items along the cross axis, and gap added the gaps.'),
    done: L3("Bugun siz ham flex qutidagi narsalarni xuddi shunday tekislashni o'rganasiz. Aytgancha, bu javonni birinchi marta tekislaganimda, justify-content center yozgan edim. O'shanda shu bitta qator kartochkalarni tepadan pastga qoq o'rtaga qo'yadi, deb o'ylagandim. Sizningcha-chi, men haqmanmi?",
      'Сегодня ты научишься выравнивать элементы во flex-коробке. Но сначала загадка. В первый раз, чтобы поставить карточки по центру сверху вниз, я написал justify-content center. По-моему, они должны встать по центру сверху вниз. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to align elements in a flex box. But first, a riddle. The first time, to center the cards top to bottom, I wrote justify-content center. I think they should land in the middle top to bottom. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("justify-content · align-items · gap", 'justify-content · align-items · gap', 'justify-content · align-items · gap')
  },
  s2: {
    eyebrow: L3("Asosiy o'q bo'ylab", 'По главной оси', 'Along the main axis'),
    help: [
      L3("To'q sariq strelkaga bir qarang-chi, keyin kartochkalarga ham. Ko'ryapsizmi, ular shu strelka bo'ylab yuradi: goh boshiga yig'iladi, goh o'rtasiga, goh oxiriga.", 'Посмотри на оранжевую стрелку и карточки: они собираются вдоль стрелки в начале, в середине или в конце.', 'Look at the orange arrow and the cards: they gather along the arrow at the start, the middle or the end.'),
      L3("Bu strelka asosiy o'q bo'ladi. justify-content kartochkalarni aynan shu strelka bo'ylab suradi: flex-start bilan ular boshiga boradi, center bilan o'rtaga, flex-end bilan oxiriga. space-between esa bo'sh joyni ularning orasiga teng bo'lib beradi.", 'justify-content выравнивает карточки по главной оси: flex-start — в начало, center — в середину, flex-end — в конец, space-between — делит место между ними поровну.', 'justify-content lines the cards up along the main axis: flex-start at the start, center in the middle, flex-end at the end, space-between shares the space evenly.'),
      L3("Uydagi kitob javonini ko'z oldingizga keltiring: kitoblarni bir chetga surib qo'yasiz, yo o'rtaga yig'asiz, yo butun javon bo'ylab teng tarqatasiz. justify-content kartochkalar bilan xuddi shu ishni qiladi.", 'Ставя книги на полку, ты двигаешь их к краю, в середину или расставляешь ровно по всей полке. justify-content делает то же самое.', 'When you put books on a shelf, you push them to an end, the middle, or spread them evenly. justify-content does the same.')
    ],
    say: L3("Keling, uchalasi bilan bittalab tanishamiz. Birinchi bo'lib justify-content keladi. U narsalarni asosiy o'q bo'ylab, mana shu to'q sariq strelka bo'ylab tekislaydi. Hozircha kartochkalar odatdagidek strelkaning boshida turibdi.",
      'Первое — justify-content. Оно выравнивает элементы по главной оси, то есть по оранжевой стрелке. Сейчас они, как обычно, стоят в начале.',
      'The first is justify-content. It aligns elements along the main axis, that is, along the orange arrow. Right now they stand at the start, as usual.'),
    sayCenter: L3("Qiymat o'rniga center deb yozdik, bu so'z inglizchada «o'rta» degani. Ko'rdingizmi? Kartochkalar javonning qoq o'rtasiga yig'ilib oldi!", 'center, то есть середина. Карточки собрались в середине полки.', 'center, meaning the middle. The cards gathered in the middle of the shelf.'),
    sayEnd: L3("Endi center o'rniga flex-end qo'yamiz. Ana, kartochkalar strelka tugaydigan joyga, o'ng chetga ko'chib o'tdi!", 'flex-end, то есть конец. Карточки ушли к правому краю, туда, где кончается стрелка.', 'flex-end, meaning the end. The cards moved to the right edge, where the arrow ends.'),
    sayBetween: L3("Eng qizig'ini oxiriga qoldirdim: space-between. Qarang-chi: birinchi kartochka chap chetga, oxirgisi o'ng chetga borib turdi, qolgan bo'sh joy esa ularning orasida teng bo'linib ketdi.", 'space-between, то есть место между. Первая слева, последняя справа, а остальное место поделено между ними поровну.', 'space-between, meaning space between. The first on the left, the last on the right, and the rest of the space is shared equally between them.'),
    done: L3("Demak, justify-content kartochkalarni asosiy o'q bo'ylab tekislaydi: ularni boshiga, o'rtasiga yoki oxiriga qo'yadi, xohlasangiz, bo'sh joyni oralariga teng bo'lib beradi.", 'Значит, justify-content выравнивает по главной оси: в начало, в середину, в конец или с местом между.', 'So justify-content aligns along the main axis: to the start, the middle, the end, or with space between.'),
    askStart: L3("Qarang: boshida", 'Смотри: в начале', 'Watch: at the start'),
    askCenter: L3("Qarang: center — o'rtada", 'Смотри: center — в середине', 'Watch: center is the middle'),
    askEnd: L3("Qarang: flex-end — oxirida", 'Смотри: flex-end — в конце', 'Watch: flex-end is the end'),
    askBetween: L3("Qarang: space-between — orasida joy", 'Смотри: space-between — место между', 'Watch: space-between'),
    askDone: L3("justify-content — asosiy o'q bo'ylab", 'justify-content — по главной оси', 'justify-content is along the main axis')
  },
  s3: {
    eyebrow: L3("O'rtaga", 'В середину', 'To the middle'),
    say: L3("Qani, javonni o'zingiz tekislab ko'ring! Kartochkalar javonning qoq o'rtasida tursin: buning uchun justify-content qiymatini yozing.",
      'Теперь твоя очередь. Пусть карточки стоят в середине полки: впиши значение для justify-content.',
      'Now it’s your turn. Let the cards stand in the middle of the shelf: type the value for justify-content.'),
    msgs: {
      empty: L3("Maydon hali bo'sh. Qiymatni yozing, bu yerga bitta so'z kerak.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      centre: L3("So'zni topdingiz, faqat yozilishi boshqacha: CSS uni amerikacha yozadi, oxirida oldin e, keyin r harfi keladi.", 'В CSS это слово пишется по-американски: на конце er.', 'In CSS this word uses the American spelling: it ends in er.'),
      middle: L3("Inglizchada middle ham «o'rta» degani, lekin CSS bu so'zni bilmaydi. Unga boshqa so'z kerak.", 'В CSS середина — не middle. Нужно другое слово.', 'In CSS the middle isn’t middle. Another word is needed.'),
      bad: L3("Brauzer bu so'zni tanimadi-yu, qoidani o'tkazib yubordi. justify-content uchun yozgan so'zingizni bir tekshirib ko'ring.", 'Браузер не узнал это слово. Проверь слово для justify-content.', 'The browser didn’t recognize that word. Check the word for justify-content.'),
      'flex-start': L3("flex-start bilan kartochkalar o'sha joyida, boshida qolib ketdi. Ular esa o'rtada turishi kerak edi.", 'С flex-start карточки останутся в начале. Нужна середина.', 'With flex-start the cards stay at the start. We need the middle.'),
      'flex-end': L3("Qarang: flex-end ularni javonning oxiriga olib ketdi. Lekin bizga o'rtasi kerak.", 'С flex-end они ушли в конец. Нужна середина.', 'With flex-end they moved to the end. We need the middle.'),
      'space-between': L3("space-between bilan kartochkalar chetlarga tarqalib ketdi-ku. Ularni o'rtaga yig'ish kerak.", 'С space-between они разошлись по краям. Нужна середина.', 'With space-between they spread to the edges. We need the middle.'),
      other: L3("Bu qiymat kartochkalarni o'rtaga olib bormaydi. O'rta uchun alohida so'z bor.", 'Это другое значение. Нужна середина.', 'That’s a different value. We need the middle.')
    },
    hints: [
      L3("O'rta, markaz inglizchada qanday deyilarkin, eslay olasizmi?", 'Как по-английски «середина, центр»?', 'What’s the English for the middle?'),
      L3("O'rta inglizchada center deyiladi, aynan shu so'z kerak.", 'Середина — center.', 'The middle is center.'),
      L3("Maydonga center deb yozing-da, «Tekshirish»ni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Zo'r! Kartochkalar javonning qoq o'rtasiga borib turdi.", 'Огонь! Карточки в середине полки.', 'Awesome! The cards are in the middle of the shelf.'),
    ask: L3("Kartochkalarni o'rtaga qo'ying", 'Поставь карточки в середину', 'Put the cards in the middle')
  },
  s4: {
    eyebrow: L3("Juftini toping", 'Найди пару', 'Find the pair'),
    say: L3("Mana, mening uchta kichkina javonim bor, har biri boshqacha tekislangan. Qaysi qiymat qaysi javonniki ekan? Oldin chapdan qiymatni bosing, keyin o'ngdan xuddi shunday tekislangan javonni bosing.",
      'Теперь соедини значения с полками. Нажми значение слева, а потом полку, выровненную так, справа.',
      'Now match the values with the shelves. Tap a value on the left, then the shelf aligned that way on the right.'),
    why: {
      'flex-start': L3("Hechqisi yo'q! flex-start bo'lsa, hamma kubiklar boshida, chap chetga yopishib turadi.", 'flex-start: все в начале, у левого края.', 'flex-start: everything at the start, by the left edge.'),
      center: L3("Unday emas: center bo'lsa, kubiklarning hammasi o'rtaga yig'ilgan bo'ladi.", 'center: все собрались в середине.', 'center: everything gathered in the middle.'),
      'space-between': L3("Yana bir qarang-chi: space-between bo'lsa, chetki kubiklar ikki chetda turadi, oralarida esa teng joy qoladi.", 'space-between: по краям и с равными промежутками.', 'space-between: at the edges with equal space between.')
    },
    pairOk: {
      'flex-start': L3("To'ppa-to'g'ri, bu javonda hammasi boshida turibdi.", 'Верно, это в начале.', 'Right, that’s at the start.'),
      center: L3("Ha, bunisida hammasi o'rtaga yig'ilgan.", 'Верно, это в середине.', 'Right, that’s in the middle.'),
      'space-between': L3("Xuddi shunday: bu javonda kubiklar orasida teng joy bor.", 'Верно, это с местом между.', 'Right, that’s with space between.')
    },
    pickFirst: L3("Oldin chapdan qiymatni tanlang.", 'Сначала выбери значение слева.', 'First pick a value on the left.'),
    hints: [
      L3("Har bir javondagi kubiklarga bir qarang-chi: ular chapga yig'ilganmi, o'rtagami yoki chetlarga tarqalganmi?", 'Посмотри, где собрались кубики: слева, в середине, по краям?', 'Look where the blocks gathered: left, middle, or at the edges?'),
      L3("flex-start ularni chapga suradi, center o'rtaga yig'adi, space-between esa chetlarga tarqatadi.", 'flex-start — слева, center — в середине, space-between — по краям.', 'flex-start is on the left, center in the middle, space-between at the edges.'),
      L3("Juftlik yonib turibdi: ikkalasini ketma-ket bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Ajoyib! Endi javonni ko'rishingiz bilan qaysi qiymat yozilganini bilib olasiz.", 'Отлично! Ты читаешь выравнивание на глаз.', 'Great! You read alignment by eye.'),
    ask: L3("Qiymatni, keyin javonni bosing", 'Нажми значение, потом полку', 'Tap a value, then a shelf'),
    askPlace: L3("Endi shunday javonni bosing", 'Теперь нажми такую полку', 'Now tap that shelf')
  },
  s5: {
    eyebrow: L3("Ko'ndalang o'q bo'ylab", 'По поперечной оси', 'Along the cross axis'),
    help: [
      L3("Bu safar binafsha strelkaga qarang. Kartochkalar endi shu strelka bo'ylab yuradi: tepaga ko'tariladi, o'rtada to'xtaydi yoki pastga tushadi.", 'Посмотри на фиолетовую стрелку: карточки двигаются вдоль неё вверх, в середину или вниз.', 'Look at the purple arrow: the cards move along it to the top, the middle or the bottom.'),
      L3("Bu strelka ko'ndalang o'q bo'ladi, uning bo'ylab align-items suradi. Odatda u stretch bo'ladi, shuning uchun kartochkalar cho'zilib turadi. Qolgan so'zlar-chi? Ular bizga tanish: flex-start kartochkalarni tepaga, center o'rtaga, flex-end pastga qo'yadi.", 'align-items выравнивает по поперечной оси. stretch растягивает, flex-start ставит в начало, center — в середину, flex-end — в конец.', 'align-items lines things up along the cross axis. stretch stretches, flex-start puts at the start, center in the middle, flex-end at the end.'),
      L3("Devorga bir nechta rasm ilayotganingizni tasavvur qiling: ularni tepa chetidan bir chiziqqa tekislash mumkin, o'rtasidan ham, pastidan ham. align-items kartochkalarni ham xuddi shunday tekislaydi.", 'Вешая картинки на стену, ты выравниваешь их по верху, по середине или по низу. align-items выравнивает так же.', 'When you hang pictures on a wall, you line them up by the top, the middle or the bottom. align-items lines up the same way.')
    ],
    say: L3("Endi binafsha strelkaga qarang-chi: u ko'ndalang o'q bo'ladi. Shu o'q bo'ylab kartochkalarni ikkinchi xususiyat, align-items tekislaydi. Odatda uning qiymati stretch bo'ladi. Bu so'z inglizchada «cho'zish» degani, shuning uchun kartochkalar hozir javonning butun bo'yiga cho'zilib turibdi.",
      'Второе — align-items. Оно выравнивает элементы по поперечной оси, то есть по фиолетовой стрелке. Обычно это stretch, то есть растянуть: карточки занимают всю высоту полки.',
      'The second is align-items. It aligns elements along the cross axis, that is, along the purple arrow. By default it’s stretch: the cards take the full height of the shelf.'),
    sayStart: L3("flex-start qo'yib ko'ramiz. Sezdingizmi? Kartochkalar cho'zilishni to'xtatdi-yu, tepaga, strelkaning boshiga ko'tarilib oldi.", 'flex-start: карточки перестали растягиваться и поднялись наверх, к началу стрелки.', 'flex-start: the cards stopped stretching and rose to the top, to the start of the arrow.'),
    sayCenter: L3("Keyin center qo'yamiz: endi kartochkalar tepadan pastga qaraganda qoq o'rtada turibdi.", 'center: по центру сверху вниз.', 'center: in the middle, top to bottom.'),
    sayEnd: L3("flex-end bo'lsa-chi? Kartochkalar pastga, strelka tugaydigan joyga tushib keldi.", 'flex-end: опустились вниз, к концу стрелки.', 'flex-end: they dropped down, to the end of the arrow.'),
    done: L3("Shunday qilib, align-items ko'ndalang o'q bo'ylab tekislaydi. Sezdingizmi, qiymatlari ham bizga tanish: o'sha flex-start, center va flex-end.", 'Значит, align-items выравнивает по поперечной оси. Значения те же: flex-start, center и flex-end.', 'So align-items aligns along the cross axis. The values are the same: flex-start, center and flex-end.'),
    askStart: L3("Qarang: stretch — cho'zilgan", 'Смотри: stretch — растянуты', 'Watch: stretch'),
    askTop: L3("Qarang: flex-start — tepada", 'Смотри: flex-start — наверху', 'Watch: flex-start is the top'),
    askCenter: L3("Qarang: center — o'rtada", 'Смотри: center — посередине', 'Watch: center is the middle'),
    askEnd: L3("Qarang: flex-end — pastda", 'Смотри: flex-end — внизу', 'Watch: flex-end is the bottom'),
    askDone: L3("align-items — ko'ndalang o'q bo'ylab", 'align-items — по поперечной оси', 'align-items is along the cross axis')
  },
  s6: {
    eyebrow: L3("Pastga", 'Вниз', 'Down'),
    say: L3("Navbatdagi ish: kartochkalar javonning tagiga tushsin, xuddi tokchaga terib qo'ygandek. Buning uchun align-items qiymatini yozing.",
      'Теперь ты. Пусть карточки опустятся на дно полки, будто стоят на ней: впиши значение для align-items.',
      'Your turn. Let the cards drop to the bottom of the shelf, as if standing on it: type the value for align-items.'),
    msgs: {
      empty: L3("Hali hech narsa yozilmabdi-ku. Bu yerga chiziqcha bilan ulangan ikki so'z kerak.", 'Впиши значение: два слова через чёрточку.', 'Type the value: two words joined by a dash.'),
      bottom: L3("Flex qutida «past» uchun bottom yozilmaydi. Bizga strelkaning oxiri kerak, u flex va end so'zlaridan yasaladi.", 'В CSS низ — не bottom. Нужен конец стрелки: flex и end.', 'In CSS the bottom isn’t bottom. We need the end of the arrow: flex and end.'),
      end: L3("Oz qoldi! end ham kartochkalarni pastga tushiradi, lekin flex qutida odatda flex-end deb yoziladi. Oldiga flex so'zi bilan chiziqchani qo'shing.", "Почти! end тоже опустит карточки, но во Flexbox принято писать flex-end: допиши впереди flex и чёрточку.", "Almost! end also moves the cards down, but in Flexbox we write flex-end: add flex and a dash in front."),
      bad: L3("Bunday so'zni brauzer bilmaydi. Ikki so'zni bo'sh joy bilan emas, chiziqcha bilan ulang.", 'Браузер не узнал это слово. Два слова пишутся через чёрточку, без пробела.', 'The browser didn’t recognize that word. Two words are joined by a dash, with no space.'),
      'flex-start': L3("flex-start kartochkalarni aksincha tepaga chiqarib yubordi-ku. Ular pastga tushishi kerak edi.", 'С flex-start они поднялись наверх. Нужен низ.', 'With flex-start they went to the top. We need the bottom.'),
      center: L3("center bilan kartochkalar o'rtada to'xtab qoldi. Ularni yana pastroqqa tushirish kerak.", 'С center они посередине. Нужен низ.', 'With center they’re in the middle. We need the bottom.'),
      stretch: L3("stretch ularni butun bo'yiga cho'zib qo'ydi-ku. Bizga esa pastda turgan kartochkalar kerak.", 'Со stretch они растянуты на всю высоту. Нужен низ.', 'With stretch they fill the whole height. We need the bottom.'),
      other: L3("Kartochkalar boshqa joyga borib qoldi. Bizga past, binafsha strelkaning oxiri kerak.", 'Это другое значение. Нужен низ, то есть конец стрелки.', 'That’s a different value. We need the bottom, the end of the arrow.')
    },
    hints: [
      L3("Binafsha strelka pastga qarab turibdi. Uning oxiri flex qutida qanday deyilarkin?", 'Фиолетовая стрелка смотрит вниз. Как называется её конец?', 'The purple arrow points down. What’s its end called?'),
      L3("Strelkaning oxiri flex-end deyiladi.", 'Конец — flex-end.', 'The end is flex-end.'),
      L3("flex-end deb yozing, keyin «Tekshirish»ni bosing.", 'Впиши flex-end и нажми «Проверить».', 'Type flex-end and tap Check.')
    ],
    ok: L3("Barakalla! Kartochkalar endi javonning tagida turibdi, xuddi tokchaga terib qo'ygandek.", 'Молодец! Карточки стоят на дне полки.', 'Well done! The cards stand at the bottom of the shelf.'),
    ask: L3("Kartochkalar pastga tushsin", 'Опусти карточки вниз', 'Move the cards to the bottom')
  },
  s7: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Endi teskarisini qilamiz: javon tayyor, kodi esa yashirin. Javonga qarab, uni qaysi kod shunday qilganini toping. Strelkalar sizga yo'l ko'rsatadi.",
      'Теперь проверь себя. Посмотри на полку и выбери, какой код сделал её такой. Стрелки помогут.',
      'Now check yourself. Look at the shelf and pick which code made it look like that. The arrows will help.'),
    ask: L3("Javonni qaysi kod shunday qildi?", 'Какой код сделал полку такой?', 'Which code made the shelf like this?'),
    hint1: L3("Kartochkalar qaysi strelka bo'ylab siljibdi: to'q sariqmi yoki binafsha?", 'Вдоль какой стрелки сдвинулись карточки: оранжевой или фиолетовой?', 'Which arrow did the cards move along: orange or purple?'),
    hint2: L3("To'q sariq strelka bo'ylab justify-content suradi, binafsha strelka bo'ylab esa align-items.", 'Вдоль оранжевой — justify-content, вдоль фиолетовой — align-items.', 'Along the orange one, justify-content; along the purple one, align-items.'),
    rounds: [
      { want: 'justify-content: center;', opts: ['justify-content: center;', 'align-items: center;', 'justify-content: flex-end;'],
        why: L3("Kartochkalar chapdan o'ngga qoq o'rtada, lekin hali ham cho'zilib turibdi: buni justify-content center qilgan.", 'Карточки посередине слева направо и растянуты: justify-content center.', 'The cards are in the middle left to right and stretched: justify-content center.') },
      { want: 'align-items: center;', opts: ['justify-content: center;', 'align-items: flex-end;', 'align-items: center;'],
        why: L3("Kartochkalar chap chetda qolibdi-yu, tepadan pastga esa o'rtada turibdi: buni align-items center qilgan.", 'Карточки слева, но посередине сверху вниз: align-items center.', 'The cards are on the left but in the middle top to bottom: align-items center.') },
      { want: 'align-items: flex-start;', opts: ['align-items: stretch;', 'align-items: flex-start;', 'justify-content: flex-start;'],
        why: L3("Kartochkalar cho'zilmagan, hammasi tepaga ko'tarilgan: bu align-items flex-start ishi.", 'Карточки не растянуты и наверху: align-items flex-start.', 'The cards aren’t stretched and are at the top: align-items flex-start.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("Uchala javonning kodini ham topdingiz! justify-content qayerda, align-items qayerda, endi adashtirmaysiz.", 'Всё верно! Ты не путаешь justify и align.', 'All correct! You don’t mix up justify and align.')
  },
  s8: {
    eyebrow: L3("Oraliq va yangi qator", 'Промежутки и перенос', 'Gaps and wrapping'),
    help: [
      L3("Kartochkalarning orasiga diqqat bilan qarang. Oldin u yerda bo'sh joy paydo bo'ladi, keyin esa qatorga sig'maganlari pastga, yangi qatorga ko'chib o'tadi.", 'Посмотри между карточками: сначала появляются промежутки, потом то, что не поместилось, переходит на новую строку.', 'Look between the cards: first gaps appear, then the ones that didn’t fit move to a new row.'),
      L3("Bo'sh joyni gap qo'yadi: u har ikki kartochka orasiga bir xil oraliq beradi. Sig'maganlarini esa flex-wrap wrap yangi qatorga o'tkazadi.", 'gap ставит одинаковые промежутки между карточками. flex-wrap wrap переносит то, что не поместилось, на новую строку.', 'gap puts equal gaps between the cards. flex-wrap wrap moves what doesn’t fit onto a new row.'),
      L3("Daftarga yozayotganda so'z qatorga sig'may qolsa, nima qilasiz? Keyingi qatorga ko'chirasiz-ku. flex-wrap ham sig'magan kartochkalarni xuddi shunday keyingi qatorga o'tkazadi.", 'Если слово не помещается в строку тетради, ты пишешь его на следующей. flex-wrap переносит карточки так же.', 'If a word doesn’t fit on a notebook line, you write it on the next one. flex-wrap moves cards the same way.')
    ],
    say: L3("Javonga yana uchta sport turini qo'shdim, endi unda oltita kartochka bor. Lekin ular bir qatorga zo'rg'a sig'yapti, ustiga-ustak bir-biriga yopishib qolgan.",
      'Теперь на полке шесть карточек. Они еле помещаются в ряд и слиплись.',
      'Now there are six cards on the shelf. They barely fit in a row and are stuck together.'),
    sayGap: L3("Oldin gap qo'shamiz, o'n ikki piksel. Ko'rdingizmi? Kartochkalar orasida bir xil bo'sh joy paydo bo'ldi. gap inglizchada «oraliq» degani.", 'gap двенадцать пикселей: между карточками появились равные промежутки. gap — то есть промежуток.', 'gap twelve pixels: equal gaps appeared between the cards. gap means a gap.'),
    sayWidth: L3("Keyin har bir kartochkaga width to'qson piksel beramiz. Lekin oltita shunday kartochka bitta qatorga sig'maydi-ku! Shuning uchun flex ularni o'zi siqib, ingichka qilib qo'ydi. Qarang, kartochkalar ozib qolibdi!", "Каждой карточке дали width девяносто пикселей. Но шесть таких в один ряд не влезают — и flex сам сделал их уже. Смотри: карточки стали тоньше.", "We gave each card width ninety pixels. But six of them don’t fit in one row, so flex made them narrower by itself. Look: the cards got thinner."),
    sayWrap: L3("Ana endi flex-wrap wrap yozamiz. Bu brauzerga «Sig'magan kartochkalar keyingi qatorga o'tsin», deb aytadi. Voy, qarang: ular pastki qatorga ko'chib o'tdi! Endi hech biri siqilmagan, hammasi yana to'liq eniga qaytdi.", 'flex-wrap wrap, то есть перенос: не поместившиеся карточки перешли на новую строку, сжатие пропало, и карточки снова полной ширины.', 'flex-wrap wrap, meaning wrapping: the cards that didn’t fit moved to a new line, the squeezing is gone, and the cards are full width again.'),
    done: L3("Xullas, gap kartochkalar orasiga oraliq qo'yadi, flex-wrap wrap esa sig'maganlarini yangi qatorga olib o'tadi.", 'Значит, gap ставит промежутки, а flex-wrap wrap переносит то, что не поместилось, на новую строку.', 'So gap adds gaps, and flex-wrap wrap moves what doesn’t fit to a new line.'),
    askStart: L3("Qarang: oltita kartochka", 'Смотри: шесть карточек', 'Watch: six cards'),
    askGap: L3("Qarang: gap — oraliq", 'Смотри: gap — промежуток', 'Watch: gap'),
    askWidth: L3("Qarang: sig'madi — siqildi", 'Смотри: не поместились — сжались', 'Watch: no room, squeezed'),
    askWrap: L3("Qarang: flex-wrap — yangi qator", 'Смотри: flex-wrap — новая строка', 'Watch: flex-wrap makes a new line'),
    askDone: L3("gap — oraliq, flex-wrap — yangi qator", 'gap — промежуток, flex-wrap — перенос', 'gap is the gap, flex-wrap wraps')
  },
  s9: {
    eyebrow: L3("Oraliq", 'Промежуток', 'The gap'),
    say: L3("Oraliqni endi o'zingiz qo'yib ko'ring: kartochkalar orasida yigirma piksel bo'sh joy bo'lsin. gap uchun qiymatni yozing.",
      'Теперь ты. Пусть между карточками будет промежуток двадцать пикселей: впиши значение для gap.',
      'Your turn. Let there be a twenty-pixel gap between the cards: type the value for gap.'),
    msgs: {
      empty: L3("Qiymatni yozishni unutibsiz-ku. Bu yerga son va px kerak.", 'Впиши значение: число и px.', 'Type the value: a number and px.'),
      noUnit: L3("Faqat sonning o'zi yozilibdi. Brauzer uni tushunmaydi, shuning uchun son yoniga px qo'shing.", 'Написано только число. Добавь к числу px.', 'Only a number. Add px to the number.'),
      bad: L3("Brauzerga bu qiymat notanish ekan. Sonni yozing-da, yoniga bo'sh joysiz px qo'shing.", 'Браузер не узнал это значение. Напиши число и px без пробела.', 'The browser didn’t recognize that value. Write a number and px with no space.'),
      other: L3("Bu oraliq biz xohlagandan boshqacha chiqdi. Bizga roppa-rosa yigirma piksel kerak.", 'Это другой промежуток. Нужно двадцать пикселей.', 'That’s a different gap. We need twenty pixels.')
    },
    hints: [
      L3("Oraliq ham o'lcham-ku, demak, u son va px bilan yoziladi.", 'Значение — число и px.', 'The value is a number and px.'),
      L3("Son yigirma bo'ladi, o'lchov birligi esa px.", 'Число двадцать, единица px.', 'The number is twenty, the unit is px.'),
      L3("Yigirma sonini yozing, yoniga px qo'shing-da, «Tekshirish»ni bosing.", 'Впиши число двадцать, допиши px и нажми «Проверить».', 'Type the number twenty, add px and tap Check.')
    ],
    ok: L3("Qoyil! Kartochkalar bir-biridan ajraldi, oralarida teng yigirma piksel bor.", 'Отлично! Между карточками равные промежутки.', 'Great! Equal gaps between the cards.'),
    ask: L3("Kartochkalar orasida 20px bo'lsin", 'Сделай промежуток 20px', 'Make a 20px gap')
  },
  s10: {
    eyebrow: L3("Qaysi xususiyat?", 'Какое свойство?', 'Which property?'),
    say: L3("Men javonim uchun to'rtta vazifa tayyorladim. Har birini o'qing-da, unga to'rtta xususiyatdan qaysi biri kerakligini tanlang.",
      'Теперь проверь себя. Я скажу задачу, а ты выбери, какое свойство нужно.',
      'Now check yourself. I’ll say a task, and you pick which property is needed.'),
    ask: L3("Bu vazifa uchun qaysi xususiyat kerak?", 'Какое свойство нужно для этой задачи?', 'Which property does this task need?'),
    card: L3('Vazifa', 'Задача', 'Task'),
    hint1: L3("Vazifadagi asosiy so'zni toping: chapdan o'ngga, tepadan pastga, bo'sh joy yoki yangi qator.", 'О чём задача: главная ось, поперечная ось, промежуток или новая строка?', 'What’s the task about: the main axis, the cross axis, a gap or a new line?'),
    hint2: L3("Asosiy o'q bo'ylab justify-content suradi, ko'ndalang o'q bo'ylab align-items. Oraliqni gap qo'yadi, yangi qatorga esa flex-wrap o'tkazadi.", 'justify-content — главная ось, align-items — поперечная, gap — промежуток, flex-wrap — новая строка.', 'justify-content is the main axis, align-items the cross axis, gap the gap, flex-wrap a new line.'),
    items: [
      { t: L3("Kartochkalar orasida bo'sh joy bo'lsin.", 'Между карточками нужны промежутки.', 'There should be gaps between the cards.'), right: 'gap',
        why: L3("Bo'sh joy kerak bo'lsa, gap yordam beradi: u kartochkalar orasiga oraliq qo'yadi.", 'Промежуток задаёт gap.', 'gap sets the gap.') },
      { t: L3("Sig'magan kartochkalar yangi qatorga o'tsin.", 'Не поместившиеся карточки должны перейти на новую строку.', 'The cards that don’t fit should move to a new line.'), right: 'flex-wrap',
        why: L3("Sig'maganlarini yangi qatorga flex-wrap o'tkazadi-ku.", 'Перенос на новую строку — это flex-wrap.', 'Moving to a new line is flex-wrap.') },
      { t: L3("Qatordagi kartochkalar tepadan pastga o'rtada tursin.", 'Карточки в ряд должны стоять посередине сверху вниз.', 'Cards in a row should stand in the middle top to bottom.'), right: 'align-items',
        why: L3("Qatorda tepadan pastga ko'ndalang o'q ketadi, uni esa align-items boshqaradi.", 'В ряду сверху вниз — это поперечная ось: align-items.', 'In a row, top to bottom is the cross axis: align-items.') },
      { t: L3("Menyu havolalari chap va o'ng chetlarga tarqalsin.", 'Ссылки меню должны разойтись к левому и правому краю.', 'The menu links should spread to the left and right edges.'), right: 'justify-content',
        why: L3("Chapdan o'ngga asosiy o'q ketadi: havolalarni chetlarga justify-content space-between tarqatadi.", 'Слева направо — главная ось: justify-content space-between.', 'Left to right is the main axis: justify-content space-between.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("To'rtta vazifa, to'rtta to'g'ri javob! Har bir xususiyatni o'z joyida ishlatyapsiz.", 'Всё верно! Ты применяешь все четыре свойства к месту.', 'All correct! You use all four properties in the right place.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Har bir o'zgarishda ikki narsani solishtiring: koddagi so'z qanday yozilgan va javondagi kartochkalar qayerga ko'chdi.", 'Каждый раз смотри на код: слово написано верно? Потом смотри, где стоят карточки.', 'Each time, look at the code: is the word spelled right? Then see where the cards are.'),
      L3("Bitta harf adashsa ham, CSS so'zni tanimaydi va qoidani o'tkazib yuboradi. Shuning uchun center ham, flex-end ham aniq yozilishi kerak. justify-content esa doim asosiy o'q bo'ylab ishlaydi, o'q qayoqqa burilmasin.", 'Значения пишутся точно: center, flex-end. А justify-content всегда работает по главной оси, куда бы она ни смотрела.', 'Values must be exact: center, flex-end. And justify-content always works along the main axis, whichever way it points.'),
      L3("Temir yo'lni ko'z oldingizga keltiring: rels qayoqqa burilsa, vagonlar ham o'sha tomonga teriladi. Asosiy o'q ham xuddi shunday rels: u pastga burilsa, justify-content kartochkalarni ham tepadan pastga teradi.", 'Если развернуть очередь, первый всё равно останется первым. Повернулась главная ось — justify-content следует за ней.', 'Turn a line around and the first person is still first. When the main axis turns, justify-content follows it.')
    ],
    say: L3("Javonni tekislash bitta harfdan ham buzilishi mumkin. Shunday ikkita xato ko'p uchraydi, yana bitta tuzoq ham bor, hammasini birma-bir ko'ramiz. Hozir kartochkalar chapdan o'ngga ham, tepadan pastga ham qoq o'rtada turibdi.", "И в выравнивании бывают ошибки. Давай посмотрим на две ошибки и одну ловушку. Сейчас карточки в середине — и слева направо, и сверху вниз.", "Alignment has mistakes too. Let’s look at two mistakes and one trap. Right now the cards are in the middle, both left to right and top to bottom."),
    sayCentre: L3("Birinchi xato: center so'zini britancha yozdim, oxiri re bilan. CSS esa faqat amerikacha yozuvni taniydi. Shuning uchun qoida ishlamadi-yu, kartochkalar chap chetga qaytib ketdi.", "Первая: center написан по-британски, с re на конце. CSS знает только американское написание — карточки уехали к левому краю.", "The first: center is spelled the British way, ending in re. CSS only knows the American spelling, so the cards moved to the left edge."),
    sayMiddle: L3("Ikkinchi xato: align-items uchun middle yozdim. CSS bunday qiymatni bilmaydi, shuning uchun brauzer uni tushunmadi va o'tkazib yubordi. Natijada kartochkalar yana butun bo'yiga cho'zilib oldi.", "Вторая: для align-items написано middle. Такого значения нет, браузер его выбросил — и карточки опять растянулись на всю высоту.", "The second: align-items says middle. There’s no such value, the browser threw it away, and the cards stretched to the full height again."),
    sayColumn: L3("Nihoyat, tuzoqqa keldik. Esingizdami, javonni column qilsak, o'qlar joy almashadi. Ko'ryapsizmi? justify-content center endi kartochkalarni tepadan pastga o'rtaga qo'ydi, chunki asosiy o'q pastga qarab qoldi.", 'Ловушка: в column оси меняются. Теперь justify-content center ставит карточки посередине сверху вниз, ведь главная ось смотрит вниз.', 'The trap: in column the axes swap. Now justify-content center centers the cards top to bottom, because the main axis points down.'),
    done: L3("Demak, so'zlarni bitta harfini ham adashtirmay yozamiz: center, flex-end. justify-content esa doim asosiy o'q orqasidan yuradi, o'q qayoqqa qaramasin.", 'Значит, слова пишутся точно: center и flex-end. А justify всегда работает по главной оси, куда бы она ни смотрела.', 'So the words must be exact: center and flex-end. And justify always works along the main axis, wherever it points.'),
    askStart: L3("Qarang: center", 'Смотри: center', 'Watch: center'),
    askCentre: L3("Qarang: centre — britancha", 'Смотри: centre — по-британски', 'Watch: centre is British'),
    askMiddle: L3("Qarang: middle — yo'q", 'Смотри: middle — нет такого', 'Watch: middle doesn’t exist'),
    askColumn: L3("Qarang: column — justify pastga", 'Смотри: column — justify вниз', 'Watch: column, justify goes down'),
    askDone: L3("So'z aniq, justify — asosiy o'q", 'Точное слово, justify — главная ось', 'Exact words, justify is the main axis')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Bugun ertalab javonimni o'zim tuzatmoqchi bo'ldim: kartochkalar tepadan pastga o'rtada tursin, dedim. Lekin ular haliyam cho'zilib turibdi! Maydondagi so'zni o'zim yozganman, demak, adashgan ham o'zimman. Uni to'g'rilab bera olasizmi?",
      'Ой, я хотел поставить карточки посередине сверху вниз, а они всё растянуты! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wanted to center the cards top to bottom, but they stay stretched! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Maydonni bo'shatib qo'ydingiz. Endi o'rniga bitta to'g'ri so'z yozing.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      middle: L3("Bu o'sha men yozgan middle-ku. CSS uni bilmaydi, o'rta uchun boshqa so'z bor.", 'middle в CSS нет. Для середины есть другое слово.', 'middle doesn’t exist in CSS. There’s another word for the middle.'),
      centre: L3("Oz qoldi! Faqat CSS bu so'zni amerikacha yozadi: oxirida oldin e, keyin r harfi keladi.", 'Почти! В CSS по-американски: на конце er.', 'Almost! In CSS it’s the American spelling: ending in er.'),
      bad: L3("Bu so'zni ham brauzer tanimadi. O'rta uchun qanday so'z yozilardi, esingizdami?", 'Браузер не узнал это слово. Проверь слово для середины.', 'The browser didn’t recognize that word. Check the word for the middle.'),
      'flex-start': L3("flex-start kartochkalarni tepaga chiqarib qo'ydi. Ular esa o'rtada turishi kerak.", 'С flex-start они наверху. Нужна середина.', 'With flex-start they’re at the top. We need the middle.'),
      'flex-end': L3("flex-end bilan kartochkalar pastga tushib ketdi, o'rtada to'xtamadi.", 'С flex-end они внизу. Нужна середина.', 'With flex-end they’re at the bottom. We need the middle.'),
      stretch: L3("stretch bilan ular yana cho'zilib qoldi-ku. O'rtaga qo'yadigan so'z kerak.", 'Со stretch они растянуты. Нужна середина.', 'With stretch they’re stretched. We need the middle.'),
      other: L3("Bu boshqa qiymat-ku. Kartochkalarni o'rtaga faqat bitta so'z qo'ya oladi.", 'Это другое значение. Нужна середина.', 'That’s a different value. We need the middle.')
    },
    hints: [
      L3("Maydondagi so'zga bir qarang-chi: CSS middle degan so'zni bilmaydi.", 'Слова middle в CSS нет.', 'The word middle doesn’t exist in CSS.'),
      L3("O'rta uchun CSS center so'zini ishlatadi.", 'Для середины используют center.', 'center is used for the middle.'),
      L3("middle o'rniga center deb yozing, keyin «Tekshirish»ni bosing.", 'Впиши center и нажми «Проверить».', 'Type center and tap Check.')
    ],
    ok: L3("Javonim qutuldi! Kartochkalar endi cho'zilmayapti, tepadan pastga qoq o'rtada turibdi.", 'Ура, заработало! Карточки посередине сверху вниз.', 'Hooray, it works! The cards are in the middle top to bottom.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi detektivlik qilamiz: javonning kodiga uchta qoida yozilgan, lekin javon ulardan birini bajarmayapti. Qaysi biri ekan? Kartochkalarga qarang-da, o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на полку и нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the shelf and tap that rule.'),
    say2: L3("Bitta xatoni ushladik! Lekin men shoshib, yana bitta joyni buzib qo'yibman. Qani, bu safar qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь сломалось другое. Какое правило не работает?', 'Great, the first one is found! Now something else broke. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Yo'q, javon bu qoidani bajaryapti: kartochkalar aynan u aytgan joyda turibdi. Kodda yozilgan-u, javonda ko'rinmayotgan narsani qidiring.", 'Это правило работает: на полке видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the shelf. What doesn’t match the code?'),
    found: {
      centre: L3("Ushladingiz! center britancha yozilgan ekan, oxiri re bilan.", 'Есть! center был написан по-британски.', 'Found it! center was spelled the British way.'),
      unit: L3("Topdingiz! Yigirma sonidan keyin px tushib qolgan ekan.", 'Есть! После двадцати не было px.', 'Found it! There was no px after twenty.')
    },
    hint1: L3("Kod nimani va'da qilgan-u, javonda nima chiqmagan? Shuni solishtiring.", 'Посмотри на полку: что не так, как в коде?', 'Look at the shelf: what doesn’t match the code?'),
    hint2: {
      centre: L3("Kartochkalar chapdan o'ngga o'rtada turibdimi? justify-content qiymatini bir tekshirib ko'ring.", 'Карточки посередине слева направо? Проверь значение justify-content.', 'Are the cards in the middle left to right? Check the justify-content value.'),
      unit: L3("Kartochkalar orasida bo'sh joy bormi? gap qiymatini diqqat bilan o'qing.", 'Есть ли промежутки между карточками? Проверь значение gap.', 'Are there gaps between the cards? Check the gap value.')
    },
    hint3: {
      centre: L3("Xato birinchi qoidada yashiringan: centre so'zida. Shu qatorni bosing.", 'Ошибка в первом правиле: centre. Нажми эту строку.', 'The bug is in the first rule: centre. Tap that line.'),
      unit: L3("Xato uchinchi qoidada: yigirmadan keyin px yo'q. Shu qatorni bosing.", 'Ошибка в третьем правиле: нет px. Нажми эту строку.', 'The bug is in the third rule: no px. Tap that line.')
    },
    ok: L3("Ikkalasini ham ushladingiz, javonim yana joyiga keldi! Dasturchilar ham kodni sahifa bilan har kuni shunday solishtirib turishadi.", 'Супер! Обе найдены. Ты проверяешь выравнивание как настоящий разработчик.', 'Super! Both found. You check alignment like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Bu safar kattaroq ish: qoidani boshidan oxirigacha o'zingiz yozasiz. Saytimning menyusi nav tegi ichida turibdi. U flex bo'lsin, havolalar esa chap va o'ng chetlarga tarqalib, oralarida teng joy qolsin.",
      'Теперь напиши правило целиком. Меню лежит в теге nav. Пусть он будет flex, а ссылки разойдутся к левому и правому краю, с равными промежутками.',
      'Now write the whole rule yourself. The menu is inside the nav tag. Make it flex and spread the links to the left and right edges, with equal space between them.'),
    msgs: {
      empty: L3("Qoidani yozing: oldin selektor keladi, keyin jingalak qavslar ichida xususiyatlar.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойства.', 'Write the rule: first the selector, then the properties inside curly braces.'),
      braces: L3("Jingalak qavslar qani? Qoidaga ikkalasi kerak: ochuvchi ham, yopuvchi ham.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat bilan qiymatning orasida ikki nuqta tushib qolibdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Menyu nav tegi ichida turibdi, shuning uchun selektor ham nav bo'ladi.", 'Меню лежит в теге nav: селектор — nav.', 'The menu is in the nav tag: the selector is nav.'),
      noFlex: L3("Oldin nav flex bo'lishi kerak, buni display flex qiladi.", 'Сначала nav должен быть flex: display flex.', 'First nav has to be flex: display flex.'),
      noJustify: L3("flex bor, lekin havolalar hali ham chapda turibdi. Endi tekislashni ham qo'shing.", 'flex есть, а ссылки пока слева. Допиши и выравнивание.', 'flex is there, but the links are still on the left. Add the alignment too.'),
      other: L3("Tekislash boshqacha chiqdi. Havolalar chetlarga tarqalishi, oralarida esa teng joy qolishi kerak.", 'Выравнивание другое. Ссылки должны разойтись по краям с равными промежутками.', 'The alignment is different. The links should spread to the edges with equal space between.'),
      bad: L3("Qaysidir so'zni brauzer tanimadi. So'zlarni bittalab tekshirib chiqing.", 'Браузер не узнал это слово. Проверь слова.', 'The browser didn’t recognize that word. Check the words.'),
      semi: L3("Ikki xususiyatni nuqtali vergul ajratib turadi: flex so'zidan keyin nuqtali vergul qo'ying.", "Между двумя свойствами нужна точка с запятой: поставь её после flex.", "Two properties need a semicolon between them: put one after flex.")
    },
    hints: [
      L3("Bu qoidaga ikkita xususiyat kerak: biri menyuni flex qiladi, ikkinchisi havolalarni asosiy o'q bo'ylab tekislaydi.", 'Нужны два свойства: одно делает flex, второе выравнивает по главной оси.', 'Two properties are needed: one makes it flex, the other aligns along the main axis.'),
      L3("Birinchisi display flex, ikkinchisi justify-content space-between.", 'display flex и justify-content space-between.', 'display flex and justify-content space-between.'),
      L3("Menyu uchun tayyor qoidani kod ostiga qo'yib qo'ydim. Uni maydonga harfma-harf yozib chiqing, keyin «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Menyu butun eniga yoyildi, xuddi haqiqiy saytlardagidek. Bu qoidani boshidan oxirigacha o'zingiz yozdingiz!", 'Отлично! Меню разошлось на всю ширину, как на настоящих сайтах. Правило написано тобой целиком.', 'Great! The menu spreads across the full width, just like on real sites. You wrote the whole rule yourself.'),
    ask: L3("nav: flex va chetlarga tarqatish", 'nav: flex и разнести по краям', 'nav: flex and spread to the edges')
  },
  s14: {
    eyebrow: L3("O'z javoningiz", 'Своя полка', 'Your own shelf'),
    say: L3("Endi javon sizning ixtiyoringizda: kartochkalarni qayerga qo'yishni o'zingiz hal qilasiz. Asosiy o'q, ko'ndalang o'q va oraliq uchun xohlagan qiymatingizni yozing, oxirida «Tayyor»ni bosing.",
      'Теперь выровняй свою полку. Впиши любые значения для главной оси, поперечной оси и промежутка. Потом нажми «Готово».',
      'Now align your own shelf. Type any values for the main axis, the cross axis and the gap. Then tap “Done”.'),
    msgs: {
      j: L3("Brauzer justify-content uchun bunday so'zni bilmaydi: \u2063{w}\u2064. Masalan, center yoki space-between deb yozib ko'ring.", 'Браузер не узнал такое слово для justify-content: \u2063{w}\u2064. Впиши, например, center или space-between.', 'The browser didn’t recognize this word for justify-content: \u2063{w}\u2064. Type, for example, center or space-between.'),
      a: L3("align-items uchun bu so'zni brauzer tanimadi: \u2063{w}\u2064. Masalan, center yoki flex-end deb yozib ko'ring.", 'Браузер не узнал такое слово для align-items: \u2063{w}\u2064. Впиши, например, center или flex-end.', 'The browser didn’t recognize this word for align-items: \u2063{w}\u2064. Type, for example, center or flex-end.'),
      gap: L3("Bunday oraliqni brauzer tushunmadi: \u2063{w}\u2064. Son yozing-da, yoniga bo'sh joysiz px qo'shing.", 'Браузер не узнал такой промежуток: \u2063{w}\u2064. Напиши число и px без пробела.', 'The browser didn’t recognize this gap: \u2063{w}\u2064. Write a number and px with no space.')
    },
    hints: [
      L3("Har bir maydonga bittadan qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("justify-content bilan align-items uchun center, flex-start yoki flex-end kabi so'z yozing. gap uchun esa son va px kerak.", 'Для justify-content и align-items — слово вроде center, flex-start или flex-end; для gap — число и px.', 'For justify-content and align-items, a word like center, flex-start or flex-end; for gap, a number and px.'),
      L3("Masalan, space-between, center va o'n ikki piksel yozsa bo'ladi. Keyin «Tayyor»ni bosing.", 'Например: space-between, center и двенадцать пикселей. Потом нажми «Готово».', 'For example: space-between, center and twelve pixels. Then tap “Done”.')
    ],
    ok: L3("Javoningiz tayyor! Kartochkalar aynan siz aytgan joyda turibdi.", 'Ого, как красиво! Это твоя полка.', 'Wow, how pretty! This is your shelf.'),
    ask: L3("Uchta qiymatni yozing, «Tayyor»ni bosing", 'Впиши три значения и нажми «Готово»', 'Type three values, tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi tezkor o'yin! Har bir fikrni eshiting-da, u rostmi yoki yo'qmi, o'ylab ko'ring. Keyin «To'g'ri» yoki «Noto'g'ri» tugmasini bosing.", 'Теперь быстрая проверка. Я говорю фразу, а ты выбери: верно или неверно.', 'Now a quick check. I say a sentence, and you choose: true or false.'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3("Fikr", 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    hint1: L3("Oldin bu fikr qaysi xususiyat haqida ekanini toping. Keyin o'sha xususiyat qaysi o'q bo'ylab ishlardi, esingizdami?", 'О каком свойстве фраза и по какой оси?', 'Which property is the sentence about, and along which axis?'),
    hint2: L3("Esingizdami: justify-content asosiy o'q bo'ylab, align-items esa ko'ndalang o'q bo'ylab tekislaydi. gap oraliq qo'yadi, flex-wrap yangi qatorga o'tkazadi.", 'Вспомни: justify — главная ось, align — поперечная, gap — промежуток, wrap — новая строка.', 'Remember: justify is the main axis, align the cross axis, gap the gap, wrap a new line.'),
    items: [
      { t: L3("justify-content elementlarni asosiy o'q bo'ylab tekislaydi.", 'justify-content выравнивает элементы по главной оси.', 'justify-content aligns elements along the main axis.'), right: true,
        why: L3("Ha, justify-content har doim asosiy o'q bo'ylab ishlaydi.", 'Верно: justify работает по главной оси.', 'Right: justify works along the main axis.') },
      { t: L3("Bu qoida qatordagi kartochkalarni chapdan o'ngga o'rtaga qo'yadi.", 'Это правило ставит карточки ряда посередине слева направо.', 'This rule centers the row’s cards left to right.'), right: false, code: 'ai',
        why: L3("Aslida align-items ko'ndalang o'q bo'ylab tekislaydi. Qatorda u kartochkalarni tepadan pastga qarab o'rtaga qo'yadi.", 'На самом деле align-items — по поперечной оси: в ряду это сверху вниз.', 'Actually align-items works along the cross axis: in a row that’s top to bottom.') },
      { t: L3("gap kartochkalarning orasiga bo'sh joy qo'yadi.", 'gap ставит промежутки между карточками.', 'gap puts gaps between the cards.'), right: true,
        why: L3("Rost: kartochkalar orasidagi oraliqni aynan gap qo'yadi.", 'Верно: gap — это промежуток.', 'Right: gap is the gap.') },
      { t: L3("flex-wrap wrap kartochkalarni kichraytiradi.", 'flex-wrap wrap уменьшает карточки.', 'flex-wrap wrap makes the cards smaller.'), right: false,
        why: L3("Aslida flex-wrap kartochkalarni kichraytirmaydi, balki yangi qatorga o'tkazadi, o'lchami esa o'sha-o'sha qoladi.", 'На самом деле wrap переносит их на новую строку, а размер сохраняется.', 'Actually wrap moves them to a new line, and their size stays the same.') }
    ],
    ok: L3("To'rtala fikrni ham to'g'ri baholadingiz! Demak, javonimni endi o'zingiz ham bemalol tekislay olasiz.", 'Всё верно! Ты отлично разбираешься в выравнивании flex.', 'All correct! You know flex alignment really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Dars boshida javonim bilan bir ish qilgan edim, esingizdami? Kartochkalar tepadan pastga o'rtada tursin deb, justify-content center yozgandim. Natijaga qarang: ular chapdan o'ngga o'rtaga keldi, tepadan pastga esa joyidan qimirlamadi. Ha, adashgan ekanman! justify-content asosiy o'q bo'ylab ishlaydi, qatorda esa asosiy o'q chapdan o'ngga ketadi.",
        'Вернёмся к загадке. Помнишь, чтобы поставить карточки посередине сверху вниз, я написал justify-content center? Смотри: они встали посередине слева направо, а сверху вниз ничего не изменилось. Я ошибся! justify работает по главной оси, а в ряду это слева направо.',
        'Back to our riddle. Remember, to center the cards top to bottom, I wrote justify-content center? Look: they centered left to right, but nothing changed top to bottom. I was wrong! justify works along the main axis, and in a row that’s left to right.'), k: 'riddle' },
      { text: L3("Tepadan pastga o'rtaga qo'yish uchun esa align-items center kerak edi. Ana endi kartochkalar tepadan pastga qoq o'rtada!", 'Чтобы поставить посередине сверху вниз, нужен был align-items center. Вот!', 'To center top to bottom, I needed align-items center. There!'), k: 'riddle2' },
      { text: L3("Bu esa sizning javoningiz, o'zingiz tanlagan qiymatlar bilan tekislangan!", 'Смотри, это твоя полка с твоими собственными значениями!', 'Look, this is your shelf with the values you picked yourself!'), k: 'own' },
      { text: L3("justify-content narsalarni asosiy o'q bo'ylab tekislaydi.", 'justify-content выравнивает по главной оси.', 'justify-content aligns along the main axis.'), k: 'jc' },
      { text: L3("align-items esa ularni ko'ndalang o'q bo'ylab tekislaydi.", 'align-items выравнивает по поперечной оси.', 'align-items aligns along the cross axis.'), k: 'ai' },
      { text: L3("Oraliqni esa gap qo'yadi: kartochkalar orasida bir xil bo'sh joy bo'ladi.", 'gap ставит промежутки между элементами.', 'gap puts gaps between elements.'), k: 'gap' },
      { text: L3("Sig'may qolganlarini flex-wrap wrap yangi qatorga o'tkazib beradi.", 'flex-wrap wrap переносит то, что не поместилось, на новую строку.', 'flex-wrap wrap moves what doesn’t fit to a new line.'), k: 'wrap' },
      { text: L3("Javonimiz endi chinakam vitrinaga o'xshadi, yordamingiz uchun rahmat! Flexbox bilan istalgan qatorni endi o'zingiz tekislay olasiz. Keyingi darsda esa elementlarni sahifaning xohlagan joyiga qo'yishni o'rganamiz. O'sha yerda kutib qolaman!",
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
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayCenter: 1, sayEnd: 1, sayBetween: 1,
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
