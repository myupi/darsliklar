// =============================================================================
// КУРС «CSS» · Урок 9 — «Как элементы ведут себя на странице»
// (облик «Редактор», как уроки курса HTML; 06.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css9/build.mjs → lessons/css/09-display.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 9 · «Как элементы ведут себя на странице» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (06.11.2026). Уроки 1–8: правило, селекторы, цвета, фон, текст, размеры, Box Model, карточки. Коди хочет
// меню из одинаковых кнопок, а ссылки крошечные и разные. Ученик узнаёт два новых тега — div (пустая коробка) и span
// (кусочек текста), блочные (block: вся строка, друг под другом) и строчные (inline: по тексту, рядом) элементы,
// свойство display (block, inline, none) и inline-block (рядом и с размерами). «Инспектор» меряет каждый тег.
// Загадка (без имён): Коди даёт ссылкам только width 120px и ждёт равные кнопки. Разгадка: строчный элемент width не
// берёт; нужен display: inline-block.
//
// ДУГА (17 экранов; минимум 17 — заказчик, 05.11.2026). Типы заданий — по разделу 3а навыка:
//   s1 крючок (ссылки разные → inline-block, width, padding; загадка про width)
//   block/inline: s2 показ (div — вся строка, span — рядом; узкий div всё равно на своей строке) · s3 вписать block (Fill) · s4 тег → block или inline (Sort)
//   display:      s5 показ (div inline · span block · div none) · s6 вписать none (Fill) · s7 какое правило у страницы (выбор)
//   inline-block: s8 показ (width у ссылки не действует → inline-block → height) · s9 вписать inline-block (Fill) · s10 какой display у меню (Sort)
//   поломки:      s11 показ (blok, inlineblock, width у span) · s12 исправить «inline block» (Debug & Fix) · s13 найти правило, которое не работает
//   w1 правило целиком: a { display: block; } (перенос: меню столбиком) · s14 своё меню: display, ширина, фон («Готово»)
//   итог: q1 верно или нет · s15 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: на странице настоящие теги со своим display по умолчанию; верная ли запись — решает Chrome
//     (CSS.supports): «blok» и «inlineblock» не принимаются; width у строчного элемента честно не действует.
//   · Узбекский — по /uzbekcha; в речи нет символов, числа словами.
//
// СИСТЕМА СЛОВ: div — bo'sh quti / пустая коробка; span — matn bo'lagi / кусочек текста; block — ustma-ust / друг под
// другом; inline — yonma-yon / рядом; none — yashirin / спрятан. В речи названия тегов, свойств и значений — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-09-display',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: '9-dars. Elementlar sahifada qanday turadi',
    ru: 'Урок 9. Как элементы ведут себя на странице',
    en: 'Lesson 9. How elements behave on a page'
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
  next: L3("Flexbox: elementlarni joylashtirish", 'Flexbox: расположение элементов', 'Flexbox: arranging elements'),
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
  // Сайт Коди и страница коробок (не звучат).
  site: {
    title: L3("Kodining sayti", 'Сайт Коди', 'Kodi’s site'),
    a1: L3("Bosh sahifa", 'Главная', 'Home'),
    a2: L3("O'yinlar", 'Игры', 'Games'),
    a3: L3("Aloqa", 'Контакты', 'Contact'),
    p1: L3("Bugun ", 'Сегодня играем в ', 'Today we play '),
    pSpan: L3("futbol", 'футбол', 'football'),
    p2: L3(" o'ynaymiz!", '!', '!')
  },
  box: {
    d1: L3("Birinchi quti", 'Первая коробка', 'First box'),
    d2: L3("Ikkinchi quti", 'Вторая коробка', 'Second box'),
    s1: L3("olma", 'яблоко', 'apple'),
    s2: L3("nok", 'груша', 'pear')
  },
  s1: {
    eyebrow: L3("Menyu", 'Меню', 'The menu'),
    say: L3("Salom! Men saytimga menyu qildim: uchta havola. Ularni bir xil kenglikdagi chiroyli tugmalar qilmoqchiman. Lekin qarang: ular kichkina va har xil. Inspektor ham buni ko'rsatyapti. «Aylantirish» tugmasini bosing.",
      'Привет! Я сделал на сайте меню из трёх ссылок. Хочу, чтобы это были красивые кнопки одной ширины. Но смотри: они крошечные и разные. Инспектор это тоже показывает. Нажми «Превратить».',
      'Hi! I made a menu on my site: three links. I want them to be nice buttons of the same width. But look: they’re tiny and all different. The Inspector shows it too. Tap “Transform”.'),
    magic: L3("Mana! Havolalar bir xil kenglikdagi tugmalarga aylandi va yonma-yon turibdi.", 'Вот! Ссылки стали кнопками одной ширины и стоят рядом.', 'There! The links became buttons of the same width, standing side by side.'),
    magicP: L3("Buni display xususiyati qildi, ya'ni element sahifada o'zini qanday tutishi degani. Uning qiymati inline-block.", 'Это сделало свойство display, то есть то, как элемент ведёт себя на странице. Его значение — inline-block.', 'The display property did it, meaning how an element behaves on the page. Its value is inline-block.'),
    done: L3("Bugun elementlar sahifada qanday turishini o'rganasiz. Lekin oldin topishmoq. Men tugmalarni teng qilish uchun havolalarga faqat width bir yuz yigirma piksel beraman. Menimcha, shuning o'zi yetadi. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida birga topamiz.",
      'Сегодня ты узнаешь, как элементы ведут себя на странице. Но сначала загадка. Чтобы кнопки стали одинаковыми, я даю ссылкам только width сто двадцать пикселей. По-моему, этого хватит. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn how elements behave on a page. But first, a riddle. To make the buttons equal, I give the links only width one hundred twenty pixels. I think that’s enough. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3('«Aylantirish» tugmasini bosing', 'Нажми «Превратить»', 'Tap “Transform”'),
    askDone: L3("display: inline-block", 'display: inline-block', 'display: inline-block')
  },
  s2: {
    eyebrow: L3("Blok va qator", 'Блок и строка', 'Block and inline'),
    help: [
      L3('Inspektorda div va span teglariga qarang: div butun qatorni egallaydi, span esa faqat matn kengligida.', 'Посмотри на div и span в Инспекторе: div занимает всю строку, а span — только ширину своего текста.', 'Look at div and span in the Inspector: div takes the whole line, span only the width of its text.'),
      L3("Blok elementlar bir-birining ostida turadi, eni kichik bo'lsa ham. Qator elementlari esa yonma-yon turadi, xuddi matndagi so'zlardek.", 'Блочные элементы стоят друг под другом, даже если они узкие. А строчные стоят рядом, как слова в тексте.', 'Block elements stack one under another, even when they’re narrow. Inline elements sit side by side, like words in text.'),
      L3("Javondagi qutilar ustma-ust turadi, gapdagi so'zlar esa yonma-yon. div quti kabi, span esa so'z kabi.", 'Коробки на полке стоят друг на друге, а слова в предложении — рядом. div — как коробка, span — как слово.', 'Boxes on a shelf stack on top of each other, while words in a sentence sit side by side. div is like a box, span is like a word.')
    ],
    say: L3("Bu sahifada ikkita yangi teg bor. div, ya'ni bo'sh quti degani: uning ichiga istalgan narsani solish mumkin. span esa matn bo'lagi. Qarang: div teglari butun qatorni egallab, biri ostida biri turibdi. Ular block elementlar. span teglari esa faqat matnicha joy oladi va yonma-yon turadi. Ular inline elementlar.",
      'На этой странице два новых тега. div, то есть пустая коробка: в неё можно положить что угодно. А span — кусочек текста. Смотри: div занимают всю строку и стоят друг под другом. Это блочные элементы, block. А span занимают место только по своему тексту и стоят рядом. Это строчные элементы, inline.',
      'This page has two new tags. div, meaning an empty box: you can put anything inside it. And span is a piece of text. Look: the divs take the whole line and stand one under another. They’re block elements. The spans take only as much room as their text and stand side by side. They’re inline elements.'),
    sayDiv: L3("Endi div tegiga width bir yuz ellik piksel beramiz. Qarang, div torroq bo'ldi, lekin baribir o'z qatorida turibdi: ikkinchisi yoniga chiqmadi. block element doim yangi qatordan boshlanadi.",
      'Теперь дадим div width сто пятьдесят пикселей. Смотри, div стал уже, но всё равно стоит на своей строке: второй не встал рядом. Блочный элемент всегда начинается с новой строки.',
      'Now let’s give the div width one hundred fifty pixels. Look, the div got narrower, but it still stands on its own line: the second one didn’t move next to it. A block element always starts on a new line.'),
    done: L3("Demak, block elementlar ustma-ust turadi: div, p abzasi va h1 sarlavhasi shunday. inline elementlar esa matndagi so'zlar kabi yonma-yon turadi: span va a havolasi shunday.", "Значит, блочные элементы стоят друг под другом: так стоят div, абзац p и заголовок h1. А строчные стоят рядом, как слова в тексте: так стоят span и ссылка a.", "So block elements stack one under another: that’s div, the paragraph p and the heading h1. And inline elements sit side by side, like words in a text: that’s span and the link a."),
    askStart: L3("Qarang: div — block, span — inline", 'Смотри: div — block, span — inline', 'Watch: div is block, span is inline'),
    askDiv: L3("Qarang: tor div ham o'z qatorida", 'Смотри: узкий div тоже на своей строке', 'Watch: a narrow div is still on its own line'),
    askDone: L3("block — ustma-ust, inline — yonma-yon", 'block — друг под другом, inline — рядом', 'block stacks, inline sits side by side')
  },
  s3: {
    eyebrow: L3("Har biri yangi qatorda", 'Каждый с новой строки', 'Each on a new line'),
    say: L3("Endi navbat sizga. olma va nok yonma-yon turibdi. Ular ham quti kabi har biri o'z qatorida tursin: span uchun display qiymatini yozing.",
      'Теперь твоя очередь. Яблоко и груша стоят рядом. Пусть каждый стоит на своей строке, как коробка: впиши значение display для span.',
      'Now it’s your turn. The apple and the pear stand side by side. Let each one stand on its own line, like a box: type the display value for span.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      dash: L3("inline-block ularni yonma-yon qoldiradi. Bu yerda quti kabi bitta so'z kerak.", "inline-block оставит их рядом. Здесь нужно одно слово — как у коробки div.", "inline-block would keep them side by side. Here you need one word, like the div box."),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.'),
      inline: L3("inline bilan ular hozirgidek yonma-yon qoladi. Har biri yangi qatorda bo'lishi kerak.", 'С inline они так и останутся рядом. А нужно каждый с новой строки.', 'With inline they stay side by side. Each one should be on a new line.'),
      'inline-block': L3("inline-block bilan ham ular yonma-yon qoladi. Quti kabi kerak.", 'С inline-block они тоже остаются рядом. Нужно как у коробки.', 'With inline-block they still sit side by side. We need them like a box.'),
      none: L3("none bilan ular umuman yo'qoldi. Ko'rinib tursin, faqat har biri o'z qatorida.", 'С none они совсем пропали. Пусть будут видны, просто каждый на своей строке.', 'With none they disappeared. Keep them visible, just each on its own line.'),
      other: L3("Bu boshqa qiymat. Quti kabi bo'lishi kerak.", 'Это другое значение. Нужно как у коробки.', 'That’s a different value. We need it like a box.')
    },
    hints: [
      L3("Qaysi elementlar har doim yangi qatordan boshlanadi?", 'Какие элементы всегда начинаются с новой строки?', 'Which elements always start on a new line?'),
      L3("div kabi bo'lsin: u block element.", 'Пусть будут как div: он блочный, block.', 'Make them like div: it’s a block element.'),
      L3("block deb yozing va Tekshirishni bosing.", 'Впиши block и нажми «Проверить».', 'Type block and tap Check.')
    ],
    ok: L3("Zo'r! Endi olma va nok har biri o'z qatorida, quti kabi.", 'Огонь! Теперь яблоко и груша — каждый на своей строке, как коробки.', 'Awesome! Now the apple and the pear are each on their own line, like boxes.'),
    ask: L3("span teglari har biri yangi qatorda bo'lsin", 'Пусть каждый span будет с новой строки', 'Put each span on a new line')
  },
  s4: {
    eyebrow: L3("Block mi, inline mi?", 'Block или inline?', 'Block or inline?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men teg ko'rsataman, siz esa u odatda qanday turishini tanlang: block mi yoki inline mi?",
      'Теперь проверь себя. Я покажу тег, а ты выбери, как он обычно стоит на странице: block или inline?',
      'Now check yourself. I’ll show a tag, and you pick how it normally stands on a page: block or inline?'),
    ask: L3("Bu teg block mi yoki inline mi?", 'Этот тег block или inline?', 'Is this tag block or inline?'),
    card: L3('Teg', 'Тег', 'Tag'),
    hint1: L3("Eslang: abzas va sarlavha butun qatorni egallaydi, havola va span esa matn ichida turadi.", "Вспомни: абзац и заголовок занимают всю строку, а ссылка и span стоят внутри текста.", "Remember: a paragraph and a heading take the whole line, while a link and span sit inside the text."),
    hint2: L3("Abzas va sarlavhalar butun qatorni egallaydi. span va havola esa matn ichida turadi.", 'Абзац и заголовки занимают всю строку. А span и ссылка стоят внутри текста.', 'Paragraphs and headings take the whole line. span and links sit inside the text.'),
    items: [
      { tag: 'p', right: 'block', why: L3("Abzas butun qatorni egallaydi: block.", 'Абзац занимает всю строку: block.', 'A paragraph takes the whole line: block.') },
      { tag: 'a', right: 'inline', why: L3("Havola matn ichida turadi: inline.", 'Ссылка стоит внутри текста: inline.', 'A link sits inside the text: inline.') },
      { tag: 'h1', right: 'block', why: L3("Sarlavha butun qatorni egallaydi: block.", 'Заголовок занимает всю строку: block.', 'A heading takes the whole line: block.') },
      { tag: 'span', right: 'inline', why: L3("span matn bo'lagi: inline.", 'span — кусочек текста: inline.', 'span is a piece of text: inline.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Teglarni block va inline ga ajratasiz.", 'Всё верно! Ты делишь теги на block и inline.', 'All correct! You sort tags into block and inline.')
  },
  s5: {
    eyebrow: L3("display", 'display', 'display'),
    help: [
      L3("display qiymatiga va elementlar joylashuviga qarang: qiymat o'zgarsa, ular yonma-yon yoki ustma-ust bo'ladi.", 'Посмотри на значение display и на то, как стоят элементы: меняется значение — они встают рядом или друг под другом.', 'Look at the display value and how the elements are placed: when it changes, they go side by side or one under another.'),
      L3("display element qanday turishini aytadi: block ustma-ust, inline yonma-yon, none bo'lsa umuman ko'rinmaydi.", 'display говорит, как стоит элемент: block — друг под другом, inline — рядом, none — его совсем не видно.', 'display says how an element sits: block one under another, inline side by side, none means you can’t see it at all.'),
      L3("Kitoblarni javonga tik qo'yish yoki ustma-ust taxlash mumkin. display ham elementlarni qanday joylashtirishni tanlaydi.", 'Книги можно поставить на полку в ряд или сложить стопкой. display так же выбирает, как разместить элементы.', 'You can stand books in a row on a shelf or stack them in a pile. display chooses how to place elements the same way.')
    ],
    say: L3("Elementning odatdagi xulqini display xususiyati bilan o'zgartirish mumkin. Qiymatlari: block, inline va none. Keling, ko'ramiz.",
      'Обычное поведение элемента можно поменять свойством display. Значения: block, inline и none. Давай посмотрим.',
      'You can change an element’s normal behavior with the display property. The values are block, inline and none. Let’s see.'),
    sayInline: L3("div tegiga display inline. Qarang: qutilar endi matn kabi yonma-yon, olma va nok bilan bir qatorda.", 'div — display inline. Смотри: коробки теперь стоят рядом, как текст, в одной строке с яблоком и грушей.', 'display inline for div. Look: the boxes now sit side by side like text, on one line with the apple and the pear.'),
    sayBlock: L3("span tegiga esa display block. Endi olma va nok har biri o'z qatorida, quti kabi.", 'А span — display block. Теперь яблоко и груша каждый на своей строке, как коробки.', 'And display block for span. Now the apple and the pear are each on their own line, like boxes.'),
    sayNone: L3("Oxirgisi none. div tegiga display none bersak, qutilar butunlay yo'qoladi, joyi ham qolmaydi.", 'И последнее — none. Если дать div display none, коробки совсем пропадут, даже места не останется.', 'The last one is none. If we give div display none, the boxes vanish completely, leaving no space.'),
    done: L3("Demak, display element qanday turishini aytadi: block ustma-ust, inline yonma-yon, none esa umuman ko'rinmaydi.", 'Значит, display говорит, как стоит элемент: block — друг под другом, inline — рядом, а none — его совсем не видно.', 'So display says how an element stands: block stacks, inline sits side by side, and none isn’t shown at all.'),
    askStart: L3("Qarang: display o'zgartiradi", 'Смотри: display меняет поведение', 'Watch: display changes behavior'),
    askInline: L3("Qarang: div — inline", 'Смотри: div — inline', 'Watch: div is inline'),
    askBlock: L3("Qarang: span — block", 'Смотри: span — block', 'Watch: span is block'),
    askNone: L3("Qarang: div — none", 'Смотри: div — none', 'Watch: div is none'),
    askDone: L3("display: block · inline · none", 'display: block · inline · none', 'display: block · inline · none')
  },
  s6: {
    eyebrow: L3("Abzasni yashiring", 'Спрячь абзац', 'Hide the paragraph'),
    say: L3("Endi siz. Abzas hozircha kerak emas, uni sahifadan yashiring: p uchun display qiymatini yozing.",
      'Теперь ты. Абзац пока не нужен, спрячь его со страницы: впиши значение display для p.',
      'Your turn. The paragraph isn’t needed for now; hide it from the page: type the display value for p.'),
    msgs: {
      empty: L3("Qiymatni yozing: bitta so'z.", 'Впиши значение: одно слово.', 'Type the value: one word.'),
      hidden: L3("display uchun bunday so'z yo'q. Yashirish uchun boshqa so'z kerak: inglizcha hech narsa.", 'У display нет такого слова. Чтобы спрятать, нужно другое слово: по-английски «ничего».', 'display has no such word. To hide, you need another word: the English for nothing.'),
      dash: L3("Bu ikki so'z emas. Yashirish uchun bitta qisqa so'z kerak.", 'Тут не нужны два слова. Чтобы спрятать, нужно одно короткое слово.', 'Not two words here. To hide, you need one short word.'),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.'),
      block: L3("block bilan abzas ko'rinib turibdi. Uni yashirish kerak.", 'С block абзац виден. А его нужно спрятать.', 'With block the paragraph is visible. It needs to be hidden.'),
      inline: L3("inline bilan abzas ko'rinib turibdi. Uni yashirish kerak.", 'С inline абзац виден. А его нужно спрятать.', 'With inline the paragraph is visible. It needs to be hidden.'),
      'inline-block': L3("inline-block bilan abzas ko'rinib turibdi. Uni yashirish kerak.", 'С inline-block абзац виден. А его нужно спрятать.', 'With inline-block the paragraph is visible. It needs to be hidden.'),
      other: L3("Abzas hali ko'rinib turibdi. Yashirish so'zi kerak.", 'Абзац всё ещё виден. Нужно слово, которое прячет.', 'The paragraph is still visible. We need the word that hides it.')
    },
    hints: [
      L3("Qaysi qiymat elementni umuman ko'rsatmaydi?", 'Какое значение совсем не показывает элемент?', 'Which value doesn’t show the element at all?'),
      L3("Bu so'z inglizcha hech narsa degani.", 'Это слово по-английски значит «ничего».', 'The word means nothing in English.'),
      L3("none deb yozing va Tekshirishni bosing.", 'Впиши none и нажми «Проверить».', 'Type none and tap Check.')
    ],
    ok: L3("Barakalla! Abzas yashirindi, sahifada joyi ham qolmadi.", 'Молодец! Абзац спрятан, и места от него не осталось.', 'Well done! The paragraph is hidden, and no space is left.'),
    ask: L3("Abzasni yashiring", 'Спрячь абзац', 'Hide the paragraph')
  },
  s7: {
    eyebrow: L3("Qaysi kod?", 'Какой код?', 'Which code?'),
    say: L3("Endi o'zingizni sinab ko'ring. Men sahifani ko'rsataman, siz esa uni qaysi qoida shunday qilganini tanlang.",
      'Теперь проверь себя. Я покажу страницу, а ты выбери, какое правило сделало её такой.',
      'Now check yourself. I’ll show the page, and you pick which rule made it look like that.'),
    ask: L3("Sahifani qaysi qoida shunday qildi?", 'Какое правило сделало страницу такой?', 'Which rule made the page look like this?'),
    hint1: L3("Qutilar va mevalarga qarang: kim ustma-ust, kim yonma-yon, kim yo'q?", 'Посмотри на коробки и фрукты: кто друг под другом, кто рядом, кого нет?', 'Look at the boxes and the fruit: what stacks, what sits side by side, what’s missing?'),
    hint2: L3("block ustma-ust, inline yonma-yon, none esa yo'qotadi.", 'block — друг под другом, inline — рядом, none — прячет.', 'block stacks, inline sits side by side, none hides.'),
    rounds: [
      { want: 'span { display: block; }', opts: ['span { display: inline; }', 'span { display: block; }', 'span { display: none; }'],
        why: L3("Olma va nok har biri o'z qatorida: span block bo'ldi.", 'Яблоко и груша каждый на своей строке: span стал block.', 'The apple and the pear are each on their own line: span became block.') },
      { want: 'div { display: inline; }', opts: ['div { display: inline; }', 'div { display: block; }', 'div { display: none; }'],
        why: L3("Qutilar mevalar bilan bitta qatorda: div inline bo'ldi.", 'Коробки в одной строке с фруктами: div стал inline.', 'The boxes are on one line with the fruit: div became inline.') },
      { want: 'div { display: none; }', opts: ['div { display: block; }', 'div { display: inline; }', 'div { display: none; }'],
        why: L3("Qutilar yo'q, faqat mevalar qoldi: div none bo'ldi.", 'Коробок нет, остались только фрукты: div стал none.', 'The boxes are gone, only the fruit is left: div became none.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! display ni sahifadan o'qiysiz.", 'Всё верно! Ты читаешь display прямо по странице.', 'All correct! You read display right from the page.')
  },
  s8: {
    eyebrow: L3("inline-block", 'inline-block', 'inline-block'),
    help: [
      L3("Inspektordagi havolalar o'lchamiga qarang: width yozilganda o'zgarmaydi, inline-block dan keyin esa o'zgaradi.", 'Посмотри на размеры ссылок в Инспекторе: от width они не меняются, а после inline-block меняются.', 'Look at the link sizes in the Inspector: width doesn’t change them, but after inline-block it does.'),
      L3("Qator elementlari width va height ni olmaydi. inline-block bilan esa element yonma-yon turadi va o'lchamni ham oladi.", 'Строчные элементы не принимают width и height. А с inline-block элемент стоит рядом и принимает размеры.', 'Inline elements don’t accept width and height. With inline-block, an element sits side by side and accepts sizes too.'),
      L3("Klaviaturadagi tugmalarni eslang: ular yonma-yon turadi, lekin har birining o'z o'lchami bor. inline-block tugmalari ham shunday.", 'Вспомни клавиши на клавиатуре: они стоят рядом, но у каждой свой размер. Кнопки с inline-block — такие же.', 'Think of keyboard keys: they sit side by side, but each has its own size. inline-block buttons are like that.')
    ],
    say: L3("Endi menyuga qaytamiz. Havolalar inline elementlar. Ularning bir siri bor: inline elementlar width va height ni qabul qilmaydi.",
      'Вернёмся к меню. Ссылки — строчные элементы. У них есть секрет: строчные элементы не принимают width и height.',
      'Back to the menu. Links are inline elements. They have a secret: inline elements don’t accept width and height.'),
    sayWidth: L3("Havolalarga width bir yuz o'n piksel. Qarang, Inspektorda hech narsa o'zgarmadi! Havolalar inline, kenglik ularga ishlamaydi.", 'Ссылкам width сто десять пикселей. Смотри, в Инспекторе ничего не изменилось! Ссылки строчные, ширина на них не действует.', 'Links get width one hundred ten pixels. Look, nothing changed in the Inspector! Links are inline, width doesn’t work on them.'),
    sayIB: L3("Endi display inline-block. U ikkalasini birlashtiradi: havolalar yonma-yon qoladi, kenglik esa ishlaydi. Har biri bir yuz o'n piksel!", 'Теперь display inline-block. Он соединяет оба мира: ссылки стоят рядом, а ширина работает. Каждая — сто десять пикселей!', 'Now display inline-block. It combines both: the links stay side by side, and width works. Each one is one hundred ten pixels!'),
    sayHeight: L3("Endi height ham ishlaydi: qirq piksel. Bular haqiqiy tugmalar!", 'Теперь работает и height: сорок пикселей. Это настоящие кнопки!', 'Now height works too: forty pixels. These are real buttons!'),
    done: L3("Demak, inline-block yonma-yon turadi va o'lchamni qabul qiladi. Menyu tugmalari uchun aynan shu kerak.", 'Значит, inline-block стоит рядом и принимает размеры. Для кнопок меню нужно именно это.', 'So inline-block sits side by side and accepts sizes. That’s exactly what menu buttons need.'),
    askStart: L3("Qarang: havolalar — inline", 'Смотри: ссылки — inline', 'Watch: links are inline'),
    askWidth: L3("Qarang: width ishlamadi", 'Смотри: width не сработал', 'Watch: width didn’t work'),
    askIB: L3("Qarang: inline-block — ishladi", 'Смотри: inline-block — сработал', 'Watch: inline-block works'),
    askHeight: L3("Qarang: height ham ishlaydi", 'Смотри: height тоже работает', 'Watch: height works too'),
    askDone: L3("inline-block: yonma-yon va o'lcham bilan", 'inline-block: рядом и с размерами', 'inline-block: side by side, with sizes')
  },
  s9: {
    eyebrow: L3("Teng tugmalar", 'Равные кнопки', 'Equal buttons'),
    say: L3("Endi siz. Havolalarga width bor, lekin u ishlamayapti. Ular yonma-yon qolsin va kenglik ishlasin: display uchun qiymatni yozing.",
      'Теперь ты. У ссылок есть width, но он не работает. Пусть они останутся рядом и ширина заработает: впиши значение для display.',
      'Your turn. The links have width, but it doesn’t work. Let them stay side by side and make the width work: type the value for display.'),
    msgs: {
      empty: L3("Qiymatni yozing: ikki so'z, orasida chiziqcha.", 'Впиши значение: два слова через чёрточку.', 'Type the value: two words joined by a dash.'),
      dash: L3("Ikki so'z chiziqcha bilan, bo'sh joysiz yoziladi: inline, chiziqcha, block.", 'Два слова пишутся через чёрточку, без пробела: inline, чёрточка, block.', 'Two words are joined by a dash, with no space: inline, dash, block.'),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.'),
      block: L3("Kenglik ishladi, lekin tugmalar ustma-ust bo'lib qoldi. Ular yonma-yon bo'lishi kerak.", 'Ширина заработала, но кнопки встали друг под другом. А нужно рядом.', 'The width works, but the buttons stacked up. They need to be side by side.'),
      inline: L3("inline bilan width ishlamaydi. Boshqa qiymat kerak.", 'С inline ширина не работает. Нужно другое значение.', 'With inline, width doesn’t work. We need another value.'),
      none: L3("none bilan menyu yo'qoldi. Tugmalar ko'rinib tursin.", 'С none меню пропало. Кнопки должны быть видны.', 'With none the menu disappeared. The buttons should be visible.'),
      other: L3("Bu boshqa qiymat. Yonma-yon va kenglik bilan kerak.", 'Это другое значение. Нужно рядом и с шириной.', 'That’s a different value. We need side by side, with width.')
    },
    hints: [
      L3("Qaysi qiymat yonma-yon turadi va width ni qabul qiladi?", 'Какое значение стоит рядом и принимает width?', 'Which value sits side by side and accepts width?'),
      L3("Ikki so'z birlashadi: inline va block.", 'Два слова вместе: inline и block.', 'Two words together: inline and block.'),
      L3("inline-block deb yozing va Tekshirishni bosing.", 'Впиши inline-block и нажми «Проверить».', 'Type inline-block and tap Check.')
    ],
    ok: L3("Ajoyib! Tugmalar teng va yonma-yon.", 'Отлично! Кнопки равные и стоят рядом.', 'Great! The buttons are equal and side by side.'),
    ask: L3("Tugmalar yonma-yon va teng bo'lsin", 'Сделай кнопки рядом и одинаковыми', 'Make the buttons side by side and equal')
  },
  s10: {
    eyebrow: L3("Qaysi display?", 'Какой display?', 'Which display?'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda display qiymati yashirilgan. Menyuga qarang va toping: block, inline yoki inline-block?",
      'Теперь проверь себя. В коде значение display спрятано. Посмотри на меню и реши: block, inline или inline-block?',
      'Now check yourself. The display value is hidden in the code. Look at the menu and decide: block, inline or inline-block?'),
    ask: L3("Bu menyuda qaysi display?", 'Какой display у этого меню?', 'Which display does this menu have?'),
    hint1: L3("Tugmalar yonma-yonmi yoki ustma-ust? Kenglik ishlayaptimi?", 'Кнопки рядом или друг под другом? Работает ли ширина?', 'Are the buttons side by side or stacked? Does the width work?'),
    hint2: L3("block ustma-ust va kenglik bilan; inline yonma-yon, kengliksiz; inline-block yonma-yon va kenglik bilan.", 'block — друг под другом и с шириной; inline — рядом, без ширины; inline-block — рядом и с шириной.', 'block stacks with width; inline sits side by side without width; inline-block sits side by side with width.'),
    items: [
      { right: 'inline-block', why: L3("Tugmalar yonma-yon va teng: inline-block.", 'Кнопки рядом и одинаковые: inline-block.', 'The buttons are side by side and equal: inline-block.') },
      { right: 'block', why: L3("Tugmalar ustma-ust: block.", 'Кнопки друг под другом: block.', 'The buttons are stacked: block.') },
      { right: 'inline', why: L3("Tugmalar yonma-yon, lekin har xil, kenglik ishlamagan: inline.", 'Кнопки рядом, но разные, ширина не сработала: inline.', 'The buttons are side by side but different; the width didn’t work: inline.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Hammasi to'g'ri! Uchala qiymatni bir qarashda ajratasiz.", 'Всё верно! Ты различаешь все три значения с одного взгляда.', 'All correct! You tell all three values apart at a glance.')
  },
  s11: {
    eyebrow: L3("Qachon ishlamaydi", 'Когда не работает', 'When it doesn’t work'),
    help: [
      L3("Har safar kodga qarang: so'z to'g'ri yozilganmi? Keyin mevalar qanday turganiga qarang.", 'Каждый раз смотри на код: слово написано верно? Потом смотри, как стоят фрукты.', 'Each time, look at the code: is the word spelled right? Then see how the fruits are placed.'),
      L3("display so'zlari harfma-harf to'g'ri yozilishi kerak. Qator elementiga esa width ishlamaydi, qoida to'g'ri bo'lsa ham.", 'Слова display пишутся буква в букву. А на строчный элемент width не действует, даже если правило верное.', 'display words must be spelled letter for letter. And width doesn’t work on an inline element, even when the rule is correct.'),
      L3("Parolda bitta harf xato bo'lsa, eshik ochilmaydi. CSS so'zlari ham xuddi shunday aniq yozilishi kerak.", 'Если в пароле ошибиться на одну букву, дверь не откроется. Слова CSS тоже надо писать так же точно.', 'If one letter in a password is wrong, the door won’t open. CSS words must be just as exact.')
    ],
    say: L3("display da ham xatolar bo'ladi. Keling, uchtasini ko'ramiz. Hozir span teglari block, har biri o'z qatorida.",
      'И с display бывают ошибки. Давай посмотрим на три. Сейчас span — block, каждый на своей строке.',
      'display has mistakes too. Let’s look at three. Right now the spans are block, each on its own line.'),
    sayTypo: L3("Birinchisi: block so'zida xato, blok deb yozilgan. Brauzer qoidani tashlab yubordi, mevalar yana yonma-yon.", 'Первая: в слове block ошибка, написано blok. Браузер выбросил правило, фрукты снова рядом.', 'The first: block is misspelled as blok. The browser threw the rule away, the fruit is side by side again.'),
    sayDash: L3("Ikkinchisi: inline-block chiziqchasiz yozilgan. Bu ham boshqa so'z, brauzer uni tanimaydi.", 'Вторая: inline-block написан без чёрточки. Это тоже чужое слово, браузер его не знает.', 'The second: inline-block is written without the dash. That’s a different word too, the browser doesn’t know it.'),
    sayWidth: L3("Uchinchisi xato emas, lekin tuzoq: inline span tegiga width beramiz. Qoida to'g'ri, ammo span inline, kenglik unga ishlamaydi.", 'Третья — не ошибка, а ловушка: даём строчному span width. Правило верное, но span строчный, ширина на него не действует.', 'The third isn’t a mistake but a trap: we give the inline span a width. The rule is right, but span is inline, so width doesn’t work on it.'),
    done: L3("Demak, display so'zlari aniq yoziladi, inline elementga esa width ishlamaydi.", 'Значит, слова display пишутся точно, а на строчный элемент width не действует.', 'So display words must be written exactly, and width doesn’t work on an inline element.'),
    askStart: L3("Qarang: span — block", 'Смотри: span — block', 'Watch: span is block'),
    askTypo: L3("Qarang: blok — xato so'z", 'Смотри: blok — ошибка в слове', 'Watch: blok is a typo'),
    askDash: L3("Qarang: chiziqcha yo'q", 'Смотри: нет чёрточки', 'Watch: no dash'),
    askWidth: L3("Qarang: inline ga width ishlamaydi", 'Смотри: на inline width не действует', 'Watch: width doesn’t work on inline'),
    askDone: L3("So'z aniq, inline ga width yo'q", 'Точное слово, у inline нет width', 'Exact words, no width for inline')
  },
  s12: {
    eyebrow: L3("Tuzating", 'Исправь', 'Fix it'),
    say: L3("Voy, men tugmalar uchun display yozdim, lekin ular baribir har xil! Maydonda mening qiymatim turibdi. Xatoni toping va tuzating.",
      'Ой, я написал display для кнопок, а они всё равно разные! В поле — моё значение. Найди ошибку и исправь.',
      'Oops, I wrote display for the buttons, but they’re still different! My value is in the field. Find the mistake and fix it.'),
    msgs: {
      empty: L3("Qiymatni yozing: ikki so'z, orasida chiziqcha.", 'Впиши значение: два слова через чёрточку.', 'Type the value: two words joined by a dash.'),
      dash: L3("So'zlar orasida hali bo'sh joy bor. Uning o'rniga chiziqcha qo'ying.", 'Между словами всё ещё пробел. Поставь вместо него чёрточку.', 'There’s still a space between the words. Put a dash in its place.'),
      bad: L3("Brauzer bu so'zni tanimadi. inline va block chiziqcha bilan yoziladi.", 'Браузер не узнал это слово. inline и block пишутся через чёрточку.', 'The browser didn’t recognize that word. inline and block are joined by a dash.'),
      block: L3("Kenglik ishladi, lekin tugmalar ustma-ust. Yonma-yon kerak.", 'Ширина работает, но кнопки друг под другом. Нужно рядом.', 'The width works, but the buttons are stacked. They need to be side by side.'),
      inline: L3("inline bilan width ishlamaydi. Ikki so'z kerak edi.", 'С inline ширина не работает. Нужны были два слова.', 'With inline, width doesn’t work. We needed two words.'),
      none: L3("none bilan menyu yo'qoldi. Tugmalar ko'rinib tursin.", 'С none меню пропало. Кнопки должны быть видны.', 'With none the menu disappeared. The buttons should be visible.'),
      other: L3("Bu boshqa qiymat. Bo'sh joy o'rniga chiziqcha qo'ying, xolos.", 'Это другое значение. Просто поставь чёрточку вместо пробела.', 'That’s a different value. Just put a dash instead of the space.')
    },
    hints: [
      L3("So'zlar orasida nima turibdi?", 'Что стоит между словами?', 'What’s between the words?'),
      L3("Bo'sh joy emas, chiziqcha kerak.", 'Нужна не пробел, а чёрточка.', 'Not a space, a dash is needed.'),
      L3("Bo'sh joyni o'chirib, chiziqcha qo'ying, keyin Tekshirishni bosing.", 'Сотри пробел, поставь чёрточку и нажми «Проверить».', 'Delete the space, put a dash, then tap Check.')
    ],
    ok: L3("Ura, ishladi! Tugmalar teng.", 'Ура, заработало! Кнопки одинаковые.', 'Hooray, it works! The buttons are equal.'),
    ask: L3("Qiymatni tuzating", 'Исправь значение', 'Fix the value')
  },
  s13: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Endi o'zingizni sinab ko'ring. Kodda uchta qoida bor, lekin bittasi ishlamayapti. Sahifaga va Inspektorga qarang, keyin o'sha qoidani bosing.",
      'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на страницу и Инспектор и нажми это правило.',
      'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the page and the Inspector, then tap that rule.'),
    say2: L3("Zo'r, birinchisi topildi! Endi boshqa sahifa. Qaysi qoida ishlamayapti?", 'Класс, первая найдена! Теперь другая страница. Какое правило не работает?', 'Great, the first one is found! Now another page. Which rule doesn’t work?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Bu qoida ishlayapti: sahifada uning izi bor. Qaysi narsa kod aytgandek emas?", 'Это правило работает: на странице видно, что оно сделало. Что не так, как в коде?', 'This rule works: you can see what it did on the page. What doesn’t match the code?'),
    found: {
      dash: L3("Topdingiz! inline-block chiziqchasiz yozilgan edi.", 'Есть! inline-block был написан без чёрточки.', 'Found it! inline-block was written without the dash.'),
      inline: L3("Topdingiz! span inline, kenglik unga ishlamaydi. inline-block bilan ishladi.", 'Есть! span строчный, ширина на него не действует. С inline-block заработало.', 'Found it! span is inline, width doesn’t work on it. With inline-block it works.')
    },
    hint1: L3("Sahifaga qarang: qaysi narsa kod aytgandek emas?", 'Посмотри на страницу: что не так, как в коде?', 'Look at the page: what doesn’t match the code?'),
    hint2: {
      dash: L3("Havolalar tugmaga o'xshayaptimi? display qiymatini tekshiring.", 'Похожи ли ссылки на кнопки? Проверь значение display.', 'Do the links look like buttons? Check the display value.'),
      inline: L3("Inspektorda span tegining kengligi qancha? Kodda esa qancha?", 'Какая ширина у span в Инспекторе? А в коде?', 'What width does the Inspector show for span? And the code?')
    },
    hint3: {
      dash: L3("Xato ikkinchi qoidada: chiziqcha yo'q. O'sha qatorni bosing.", 'Ошибка во втором правиле: нет чёрточки. Нажми эту строку.', 'The bug is in the second rule: no dash. Tap that line.'),
      inline: L3("Ishlamayotgani uchinchi qoida: span inline. O'sha qatorni bosing.", 'Не работает третье правило: span строчный. Нажми эту строку.', 'The third rule doesn’t work: span is inline. Tap that line.')
    },
    ok: L3("Super! Ikkalasi ham topildi. Siz sahifani haqiqiy dasturchi kabi tekshiryapsiz.", 'Супер! Оба найдены. Ты проверяешь страницу как настоящий разработчик.', 'Super! Both found. You check the page like a real developer.')
  },
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило целиком', 'Write the rule yourself'),
    say: L3("Endi qoidani boshidan oxirigacha o'zingiz yozing. Telefonda menyu ustma-ust tursin: har bir havola o'z qatorida. Selektor a.",
      'Теперь напиши правило целиком. Пусть на телефоне меню стоит столбиком: каждая ссылка на своей строке. Селектор — a.',
      'Now write the whole rule yourself. On a phone, let the menu stand in a column: each link on its own line. The selector is a.'),
    msgs: {
      empty: L3("Qoidani yozing: avval selektor, keyin figurali qavslar ichida xususiyat va qiymat.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value inside curly braces.'),
      braces: L3("Qoidaga figurali qavslar kerak: ochuvchi va yopuvchi.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      colon: L3("Xususiyat va qiymat orasida ikki nuqta yo'q.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      sel: L3("Havolalar uchun a selektori kerak.", 'Для ссылок нужен селектор a.', 'The links need the a selector.'),
      prop: L3("Element qanday turishini display xususiyati beradi.", 'Как стоит элемент, задаёт свойство display.', 'The display property sets how an element stands.'),
      bad: L3("Brauzer bu so'zni tanimadi. display uchun so'zni tekshiring.", 'Браузер не узнал это слово. Проверь слово для display.', 'The browser didn’t recognize that word. Check the word for display.'),
      row: L3("Havolalar hali yonma-yon. Har biri o'z qatorida bo'lishi kerak.", 'Ссылки всё ещё рядом. Нужно, чтобы каждая была на своей строке.', 'The links are still side by side. Each should be on its own line.'),
      none: L3("none bilan menyu yo'qoldi. Havolalar ko'rinib tursin.", 'С none меню пропало. Ссылки должны быть видны.', 'With none the menu disappeared. The links should be visible.'),
      other: L3("Bu boshqa qiymat. Har biri o'z qatorida bo'lsin.", 'Это другое значение. Нужно, чтобы каждая была на своей строке.', 'That’s a different value. Each should be on its own line.')
    },
    hints: [
      L3("Qaysi selektor havolalarni tanlaydi? Qaysi qiymat har birini yangi qatordan boshlaydi?", 'Какой селектор выбирает ссылки? Какое значение начинает каждую с новой строки?', 'Which selector picks the links? Which value starts each one on a new line?'),
      L3("Selektor a, xususiyat display, qiymat block.", 'Селектор a, свойство display, значение block.', 'Selector a, property display, value block.'),
      L3("Namuna kod ostida paydo bo'ldi. Uni maydonga ko'chirib yozing va Tekshirishni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Ajoyib! Menyu ustma-ust, xuddi telefondagidek. Qoidani o'zingiz yozdingiz.", 'Отлично! Меню стоит столбиком, как на телефоне. Правило написано тобой целиком.', 'Great! The menu stands in a column, just like on a phone. You wrote the whole rule yourself.'),
    ask: L3("Havolalar ustma-ust tursin", 'Поставь ссылки столбиком', 'Stack the links in a column')
  },
  s14: {
    eyebrow: L3("O'z menyungiz", 'Своё меню', 'Your own menu'),
    say: L3("Endi o'z menyungizni yasang. Havolalar uchun display, kenglik va fon rangini yozing. Keyin «Tayyor»ni bosing.",
      'Теперь сделай своё меню. Впиши для ссылок display, ширину и цвет фона. Потом нажми «Готово».',
      'Now make your own menu. Type display, a width and a background color for the links. Then tap “Done”.'),
    msgs: {
      disp: L3("Brauzer display uchun {w} so'zini tanimadi. block, inline yoki inline-block yozing.", 'Браузер не узнал слово {w} для display. Впиши block, inline или inline-block.', 'The browser didn’t recognize {w} for display. Type block, inline or inline-block.'),
      none: L3("none bilan menyu yo'qoladi. Ko'rinadigan qiymat tanlang.", 'С none меню пропадёт. Выбери видимое значение.', 'With none the menu disappears. Pick a visible value.'),
      width: L3("Brauzer {w} kengligini tanimadi. Son va px yozing, orasida bo'sh joysiz.", 'Браузер не узнал ширину {w}. Напиши число и px без пробела.', 'The browser didn’t recognize the width {w}. Write a number and px with no space.'),
      color: L3("Brauzer {w} rangini tanimadi. Rang nomini yoki kodini yozing.", 'Браузер не узнал цвет {w}. Напиши название или код цвета.', 'The browser didn’t recognize the color {w}. Write a color name or code.')
    },
    hints: [
      L3("Har bir maydonga bitta qiymat yozing.", 'В каждое поле — одно значение.', 'One value in each field.'),
      L3("display uchun block, inline yoki inline-block; kenglik son va px; fon uchun rang.", 'Для display — block, inline или inline-block; ширина — число и px; для фона — цвет.', 'For display, block, inline or inline-block; the width is a number and px; a color for the background.'),
      L3("Masalan: inline-block, bir yuz piksel va gold. Keyin «Tayyor»ni bosing.", 'Например: inline-block, сто пикселей и gold. Потом нажми «Готово».', 'For example: inline-block, one hundred pixels and gold. Then tap “Done”.')
    ],
    ok: L3("Voy, qanday chiroyli! Bu sizning menyungiz.", 'Ого, как красиво! Это твоё меню.', 'Wow, how pretty! This is your menu.'),
    okInline: L3("Tayyor! Esingizdami, inline bilan kenglik ishlamaydi, shuning uchun tugmalar har xil. Bu ham sizning tanlovingiz.", 'Готово! Помнишь, с inline ширина не работает, поэтому кнопки разные. Это тоже твой выбор.', 'Done! Remember, with inline the width doesn’t work, so the buttons are different. That’s your choice too.'),
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
    hint1: L3("Gap qaysi qiymat haqida: block, inline, inline-block yoki none?", 'О каком значении фраза: block, inline, inline-block или none?', 'Which value is the sentence about: block, inline, inline-block or none?'),
    hint2: L3("Esingizdami: block ustma-ust, inline yonma-yon va kengliksiz, inline-block yonma-yon va kenglik bilan, none esa yashiradi.", 'Вспомни: block — друг под другом, inline — рядом и без ширины, inline-block — рядом и с шириной, а none прячет.', 'Remember: block stacks, inline sits side by side without width, inline-block sits side by side with width, and none hides.'),
    items: [
      { t: L3("div odatda butun qatorni egallaydi.", 'div обычно занимает всю строку.', 'A div normally takes the whole line.'), right: true,
        why: L3("To'g'ri: div block element.", 'Верно: div — блочный элемент.', 'Right: div is a block element.') },
      { t: L3("Bu qoida span tegini kengroq qiladi.", 'Это правило делает span шире.', 'This rule makes the span wider.'), right: false, code: 'span',
        why: L3("Aslida span inline, kenglik unga ishlamaydi.", 'На самом деле span строчный, ширина на него не действует.', 'Actually span is inline, width doesn’t work on it.') },
      { t: L3("display none elementni sahifadan yashiradi.", 'display none прячет элемент со страницы.', 'display none hides the element from the page.'), right: true,
        why: L3("To'g'ri: none bilan element ko'rinmaydi va joy ham olmaydi.", 'Верно: с none элемента не видно, и места он не занимает.', 'Right: with none the element isn’t shown and takes no space.') },
      { t: L3("Bu qoida havolalarni bitta qatorga teradi.", 'Это правило ставит ссылки в одну строку.', 'This rule puts the links in one row.'), right: false, code: 'row',
        why: L3("Aslida block har bir havolani yangi qatorga qo'yadi: ular ustma-ust turadi.", 'На самом деле block ставит каждую ссылку на новую строку: они стоят столбиком.', 'Actually block puts each link on a new line: they stand in a column.') }
    ],
    ok: L3("Hammasi to'g'ri! Siz display ni yaxshi bilasiz.", 'Всё верно! Ты отлично разбираешься в display.', 'All correct! You know display really well.')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men havolalarga faqat width bir yuz yigirma piksel bergan edim? Qarang: hech narsa o'zgarmadi, Inspektor ham buni ko'rsatyapti. Men adashibman! Havolalar inline, kenglik ularga ishlamaydi.",
        'Вернёмся к загадке. Помнишь, я дал ссылкам только width сто двадцать пикселей? Смотри: ничего не изменилось, Инспектор это тоже показывает. Я ошибся! Ссылки строчные, ширина на них не действует.',
        'Back to our riddle. Remember, I gave the links only width one hundred twenty pixels? Look: nothing changed, the Inspector shows it too. I was wrong! Links are inline, width doesn’t work on them.'), k: 'riddle' },
      { text: L3("Display inline-block qo'shsak, kenglik ishlaydi, tugmalar esa yonma-yon qoladi.", 'Добавим display inline-block, и ширина заработает, а кнопки останутся рядом.', 'Add display inline-block, and the width works while the buttons stay side by side.'), k: 'riddle2' },
      { text: L3("Qarang, bu sizning menyungiz, o'zingiz tanlagan qiymatlar bilan!", 'Смотри, это твоё меню с твоими собственными значениями!', 'Look, this is your menu with the values you picked yourself!'), k: 'own' },
      { text: L3("block elementlar, masalan div, abzas va sarlavha, butun qatorni egallaydi.", 'Блочные элементы, например div, абзац и заголовок, занимают всю строку.', 'Block elements, like div, paragraphs and headings, take the whole line.'), k: 'blk' },
      { text: L3("inline elementlar, masalan span va havola, matn kabi yonma-yon turadi.", 'Строчные элементы, например span и ссылка, стоят рядом, как текст.', 'Inline elements, like span and links, sit side by side like text.'), k: 'inl' },
      { text: L3("inline-block yonma-yon turadi va o'lchamni qabul qiladi.", 'inline-block стоит рядом и принимает размеры.', 'inline-block sits side by side and accepts sizes.'), k: 'ib' },
      { text: L3("none esa elementni yashiradi.", 'А none прячет элемент.', 'And none hides the element.'), k: 'none' },
      { text: L3("Tabriklayman! Endi siz elementlar sahifada qanday turishini bilasiz. Keyingi darsda Flexbox ni o'rganamiz: u elementlarni qatorga yoki ustunga juda oson teradi. Ko'rishguncha!",
        'Ура! Теперь ты знаешь, как элементы стоят на странице. На следующем уроке изучим Flexbox: он очень легко расставляет элементы в ряд или в столбик. До встречи!',
        'Hooray! Now you know how elements stand on a page. Next lesson we’ll learn Flexbox: it lines elements up in a row or a column very easily. See you!') }
    ],
    roles: {
      blk: L3("block — butun qator", 'block — вся строка', 'block — the whole line'),
      inl: L3("inline — matn kabi", 'inline — как текст', 'inline — like text'),
      ib: L3("inline-block — yonma-yon va o'lcham", 'inline-block — рядом и с размером', 'inline-block — side by side, with size'),
      none: L3("none — yashirin", 'none — спрятан', 'none — hidden')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayDiv: 1, sayInline: 1, sayBlock: 1, sayNone: 1,
  sayWidth: 1, sayIB: 1, sayHeight: 1, sayTypo: 1, sayDash: 1, okInline: 1, miss: 1, say2: 1, fine: 1, found: 1, items: 1, right: 1, rounds: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1, css: 1, right: 1, tag: 1 }, rounds: { want: 1, opts: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c9-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c9.css@*/
`;
