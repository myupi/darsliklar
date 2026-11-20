// =============================================================================
// ТЕСТЫ К УРОКУ 4 МОДУЛЯ BOOTSTRAP «Flex» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: в ряд ставит d-flex; края — justify-content-between (не space-between); число в gap-5 — номер в таблице
// размеров, не пиксели; по высоте по центру — align-items-center; CSS в class не работает — нужен класс Bootstrap.
// Страница — честная (bs={BS_CSS}). Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'flex';
const b4Box = (t) => `<div class="p-3 bg-warning">${t}</div>`;
const b4Boxes = (T) => [b4Box(T('Ali', 'Али', 'Ali')), b4Box(T('Vali', 'Вали', 'Vali')), b4Box(T('Lola', 'Лола', 'Lola'))];
const b4Wrap = (cls, kids) => `<div class="${cls}">\n${kids.map((k) => '  ' + k).join('\n')}\n</div>`;
const b4Head = (T, cls) => b4Wrap(cls, ['<b>RoboKlub</b>', `<span>${T('Menyu', 'Меню', 'Menu')}</span>`]);
const QS = [
  { id: 'bootstrap-04t1', target: 'bootstrap-04', ptype: 'Bootstrap', tag: 'd-flex', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b4Wrap('___ gap-5', b4Boxes(T))} html={b4Wrap('d-flex gap-5', b4Boxes(T))} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Uchta quti hozir ustma-ust turibdi. O'ngdagidek yonma-yon turishi kerak.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['flex', 'flex-row', 'd-flex', 'display-flex'],
      ok: "To'ppa-to'g'ri! d-flex — bu CSS-dagi display: flex. U ota tegga yoziladi va bolalarni bir qatorga qo'yadi.", hint: "CSS-da yonma-yon qo'yish display: flex edi. Bootstrapda display so'zi qanday qisqartirilgan?", alt: "Yonma-yon turgan uchta quti va ota tegning kodi" },
    ru: { ctx: 'Три коробки сейчас стоят друг под другом. Нужно в ряд, как справа.', q: 'Какое слово пишется на пустое место?', opts: ['flex', 'flex-row', 'd-flex', 'display-flex'],
      ok: 'Верно! d-flex — это display: flex из CSS. Его пишут родителю, и дети встают в ряд.', hint: 'В CSS в ряд ставило display: flex. Как в Bootstrap сокращено слово display?', alt: 'Три коробки в ряд и код родителя' },
    en: { ctx: 'The three boxes are stacked now. They should stand in a row, like on the right.', q: 'Which word goes in the empty spot?', opts: ['flex', 'flex-row', 'd-flex', 'display-flex'],
      ok: 'Right! d-flex is display: flex from CSS. It goes on the parent, and the children line up in a row.', hint: 'In CSS, display: flex put things in a row. How does Bootstrap shorten the word display?', alt: 'Three boxes in a row and the parent’s code' } },
  { id: 'bootstrap-04t2', target: 'bootstrap-04', ptype: 'Bootstrap', tag: 'justify-content', correct: 0, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={b4Head(T, 'd-flex ___ p-3 border')} html={b4Head(T, 'd-flex justify-content-between p-3 border')} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Saytning shapkasi: nom chap chetda, menyu o'ng chetda turishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['justify-content-between', 'justify-content-space-between', 'align-items-between', 'justify-content-center'],
      ok: "Qoyil! between elementlarni ikki chetga suradi, oradagi bo'sh joy esa o'rtada qoladi. CSS-dagi space-between Bootstrapda qisqaroq yoziladi.", hint: "Bu asosiy o'q bo'ylab, ya'ni gorizontal joylash. CSS-dagi space-between Bootstrap so'zida qanday qisqargan edi?", alt: "Nom chapda, menyu o'ngda turgan shapka" },
    ru: { ctx: 'Шапка сайта: название у левого края, меню у правого.', q: 'Что пишется на пустое место?', opts: ['justify-content-between', 'justify-content-space-between', 'align-items-between', 'justify-content-center'],
      ok: 'Здорово! between разводит элементы по краям, а свободное место остаётся посередине. CSS-ное space-between в Bootstrap пишется короче.', hint: 'Это расстановка по главной оси, по горизонтали. Как CSS-ное space-between сократилось в слове Bootstrap?', alt: 'Шапка: название слева, меню справа' },
    en: { ctx: 'The site header: the name at the left edge, the menu at the right edge.', q: 'What goes in the empty spot?', opts: ['justify-content-between', 'justify-content-space-between', 'align-items-between', 'justify-content-center'],
      ok: 'Nice work! between pushes the items to the edges and leaves the free space in the middle. CSS’s space-between is shorter in Bootstrap.', hint: 'This is placement along the main axis, horizontally. How did CSS’s space-between get shortened in the Bootstrap word?', alt: 'A header with the name on the left and the menu on the right' } },
  { id: 'bootstrap-04t3', target: 'bootstrap-04', ptype: 'Bootstrap', tag: 'gap', correct: 3,
    vis: (L) => { const T = aqL(L); const src = b4Wrap('d-flex gap-5', b4Boxes(T)); return <WqVis code={src} html={src} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Qutilar orasida gap-5 bilan bo'sh joy paydo bo'ldi.", q: "gap-5 dagi 5 raqami nimani bildiradi?", opts: ["Qutilar orasida 5 piksel bo'sh joy", "Qatorda ko'pi bilan 5 ta quti turadi", "Har bir quti 5 marta kattaroq bo'ladi", "O'lchamlar jadvalidagi raqam"],
      ok: "Juda zo'r! Raqam piksel emas, jadvaldagi o'rin: gap-5 — 16 piksel, gap-9 — 32 piksel. Kerakli o'lchamni saytdagi Gap jadvalidan qaraymiz.", hint: "Darsda saytdagi Gap sahifasida jadval bor edi. gap-3 necha piksel edi: 3 mi yoki boshqa son?", alt: "Orasida bo'sh joy bor uchta quti" },
    ru: { ctx: 'С gap-5 между коробками появился промежуток.', q: 'Что означает число 5 в gap-5?', opts: ['Промежуток в 5 пикселей между коробками', 'В ряду помещается не больше 5 коробок', 'Каждая коробка становится в 5 раз больше', 'Номер размера в таблице Bootstrap'],
      ok: 'Отлично! Число — не пиксели, а место в таблице: gap-5 — 16 пикселей, gap-9 — 32. Нужный размер смотрим в таблице Gap на сайте.', hint: 'В уроке на странице Gap сайта была таблица. Сколько пикселей было у gap-3: 3 или другое число?', alt: 'Три коробки с промежутками' },
    en: { ctx: 'gap-5 added space between the boxes.', q: 'What does the number 5 in gap-5 mean?', opts: ['5 pixels of space between the boxes', 'No more than 5 boxes fit in the row', 'Each box becomes 5 times bigger', 'A number from the size table'],
      ok: 'Great! The number isn’t pixels, it’s a place in the table: gap-5 is 16 pixels, gap-9 is 32. We look up the size in the Gap table on the site.', hint: 'The Gap page on the site had a table in the lesson. How many pixels was gap-3: 3 or another number?', alt: 'Three boxes with gaps between them' } },
  { id: 'bootstrap-04t4', target: 'bootstrap-04', ptype: 'Bootstrap', tag: 'align-items', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const kids = ['<img src="logo.png" alt="RoboKlub">', `<span>${T('Menyu', 'Меню', 'Menu')}</span>`]; return <WqVis code={b4Wrap('d-flex justify-content-between ___', kids)} html={b4Wrap('d-flex justify-content-between align-items-center p-3 border', kids)} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Logotip baland, menyu yozuvi past. Menyu logotipning bo'yi bo'yicha o'rtasida turishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['justify-content-center', 'align-items-center', 'align-center', 'text-center'],
      ok: "Xuddi shunday! align-items ko'ndalang o'q bo'yicha, ya'ni tepadan pastga joylaydi. center — o'rtaga.", hint: "Chap-o'ng joylashni justify qiladi, u allaqachon yozilgan. Tepadan pastga joylash qaysi so'z bilan boshlanadi?", alt: "Logotip va menyu bo'yi bo'yicha o'rtada" },
    ru: { ctx: 'Логотип высокий, надпись меню низкая. Меню должно стоять посередине высоты логотипа.', q: 'Что пишется на пустое место?', opts: ['justify-content-center', 'align-items-center', 'align-center', 'text-center'],
      ok: 'Именно! align-items расставляет по поперечной оси, то есть сверху вниз. center — посередине.', hint: 'Влево-вправо расставляет justify, оно уже написано. С какого слова начинается расстановка сверху вниз?', alt: 'Логотип и меню по центру по высоте' },
    en: { ctx: 'The logo is tall and the menu text is short. The menu should sit in the middle of the logo’s height.', q: 'What goes in the empty spot?', opts: ['justify-content-center', 'align-items-center', 'align-center', 'text-center'],
      ok: 'Exactly! align-items places along the cross axis, top to bottom. center means the middle.', hint: 'justify places left to right, and it’s already written. Which word starts top-to-bottom placement?', alt: 'The logo and menu centered by height' } },
  { id: 'bootstrap-04t5', target: 'bootstrap-04', ptype: 'Bootstrap', tag: 'class', correct: 2,
    vis: (L) => { const T = aqL(L); const src = b4Wrap('display: flex;', b4Boxes(T).slice(0, 2)); return <WqVis code={src} html={src} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Qutilarni yonma-yon qo'ymoqchi edik, lekin ular ustma-ust qoldi.", q: 'Nega?', opts: ["d-flex faqat body tegida ishlaydi", "Bootstrapda flex yo'q, CSS fayl kerak", "class-da CSS emas, Bootstrap so'zi kerak", "Qatorda ikkitadan ortiq quti bo'lmaydi"],
      ok: "To'ppa-to'g'ri! class ichiga CSS qoidasi emas, so'z yoziladi: d-flex. Bootstrap o'sha display: flex-ni o'zi qo'shadi.", hint: "class ichida nima turibdi: Bootstrap so'zimi yoki CSS qoidasimi? Brauzer class-da qoidani o'qiydimi?", alt: "class ichida CSS yozilgan va ustma-ust qolgan qutilar" },
    ru: { ctx: 'Хотели поставить коробки в ряд, но они остались друг под другом.', q: 'Почему?', opts: ['d-flex работает только у тега body', 'В Bootstrap нет flex, нужен CSS-файл', 'В class нужен не CSS, а слово Bootstrap', 'В ряду не больше двух коробок'],
      ok: 'Верно! В class пишут не CSS-правило, а слово: d-flex. Тот самый display: flex Bootstrap добавит сам.', hint: 'Что стоит в class: слово Bootstrap или CSS-правило? Читает ли браузер правила в class?', alt: 'CSS в class и коробки друг под другом' },
    en: { ctx: 'We wanted the boxes in a row, but they stayed stacked.', q: 'Why?', opts: ['d-flex only works on the body tag', 'Bootstrap has no flex, use a CSS file', 'class needs a Bootstrap word, not CSS', 'A row can’t hold more than two boxes'],
      ok: 'Right! class takes a word, not a CSS rule: d-flex. Bootstrap adds that display: flex itself.', hint: 'What is in class: a Bootstrap word or a CSS rule? Does the browser read rules inside class?', alt: 'CSS written in class and stacked boxes' } }
];
