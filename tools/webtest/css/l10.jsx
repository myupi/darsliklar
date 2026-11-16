// =============================================================================
// ТЕСТЫ К УРОКУ 10 КУРСА CSS «Flexbox: расположение элементов» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: display: flex пишут родителю; flex-direction по виду полки; row-reverse — главная ось справа
// налево; flexbox — не значение display; дети тянутся по поперечной оси.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis (код и/или честная страница).
// =============================================================================
const SLUG = 'flexbox-osi';
const SHELF = 'body{margin:0;padding:10px}.javon{background:#FFF1EC;border:2px dashed #FDBA74;padding:6px;gap:6px}.karta{background:#FA4F28;color:#fff;font:700 18px Arial;padding:8px 14px;border-radius:8px;margin:3px}';
const CARDS = '<div class="javon"><div class="karta">1</div><div class="karta">2</div><div class="karta">3</div></div>';
const QS = [
  { id: 'css-10t1', target: 'css-10', ptype: 'CSS', tag: 'parent', correct: 1, mono: true,
    vis: () => <WqVis code={`<div class="javon">\n  <div class="karta">1</div>\n  <div class="karta">2</div>\n  <div class="karta">3</div>\n</div>`} mark={[1]} />,
    uz: { ctx: "Kartochkalar qatorga tizilishi kerak.", q: "display: flex qaysi selektorga yoziladi?", opts: ['.karta', '.javon', 'body', 'html'],
      ok: "Qoyil! flex ota qutiga, ya'ni bolalarni o'rab turgan javonga yoziladi.", hint: "Qaysi teg kartochkalarni o'z ichiga oladi? flex bolalarga emas, ularning otasiga yoziladi.", alt: "Javon va uchta kartochka kodi" },
    ru: { ctx: 'Карточки должны встать в ряд.', q: 'Какому селектору пишут display: flex?', opts: ['.karta', '.javon', 'body', 'html'],
      ok: 'Здорово! flex пишут коробке-родителю — полке, которая обнимает детей.', hint: 'Какой тег содержит карточки? flex пишут не детям, а их родителю.', alt: 'Код полки с тремя карточками' },
    en: { ctx: 'The cards must line up in a row.', q: 'Which selector gets display: flex?', opts: ['.karta', '.javon', 'body', 'html'],
      ok: 'Nice work! flex goes on the parent box, the shelf that wraps the children.', hint: 'Which tag contains the cards? flex goes not on the children but on their parent.', alt: 'Code of a shelf with three cards' } },
  { id: 'css-10t2', target: 'css-10', ptype: 'CSS', tag: 'direction', correct: 3, mono: true,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  flex-direction: ___;\n}`} mark={[3]}
      html={CARDS} css={SHELF + '.javon{display:flex;flex-direction:column-reverse}'} />,
    uz: { ctx: "Javonga qarang: kartochkalar tepadan pastga 3, 2, 1 bo'lib turibdi.", q: "Bo'sh joyda qaysi qiymat turibdi?", opts: ['row', 'column', 'row-reverse', 'column-reverse'],
      ok: "To'ppa-to'g'ri! column — ustun, reverse — teskari: birinchi kartochka eng pastda.", hint: "Kartochkalar qatordami yoki ustunda? Birinchisi qayerda: tepadami yoki pastda?", alt: "Kartochkalari teskari ustunda turgan javon" },
    ru: { ctx: 'Посмотри на полку: сверху вниз карточки идут 3, 2, 1.', q: 'Какое значение на пустом месте?', opts: ['row', 'column', 'row-reverse', 'column-reverse'],
      ok: 'Верно! column — столбик, reverse — наоборот: первая карточка в самом низу.', hint: 'Карточки в ряд или столбиком? Где первая: сверху или снизу?', alt: 'Полка с карточками в обратном столбике' },
    en: { ctx: 'Look at the shelf: from top to bottom the cards go 3, 2, 1.', q: 'Which value is in the empty spot?', opts: ['row', 'column', 'row-reverse', 'column-reverse'],
      ok: 'Right! column is a stack, reverse flips it: the first card is at the very bottom.', hint: 'Are the cards in a row or a column? Where is the first one: top or bottom?', alt: 'A shelf with cards in a reversed column' } },
  { id: 'css-10t3', target: 'css-10', ptype: 'CSS', tag: 'axis', correct: 1,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  flex-direction: row-reverse;\n}`} mark={[3]} />,
    uz: { ctx: "Asosiy o'q kartochkalar tizilish yo'nalishini ko'rsatadi.", q: "Bu yerda asosiy o'q qayerga qaraydi?", opts: ["Chapdan o'ngga →", "O'ngdan chapga ←", 'Tepadan pastga ↓', 'Pastdan tepaga ↑'],
      ok: "Xuddi shunday! row — qator, reverse — teskari: asosiy o'q o'ngdan chapga, birinchi kartochka eng o'ngda.", hint: "row qaysi tomonga ketadi? reverse esa uni nima qiladi?", alt: "row-reverse kodi" },
    ru: { ctx: 'Главная ось показывает, куда выстраиваются карточки.', q: 'Куда здесь смотрит главная ось?', opts: ['Слева направо →', 'Справа налево ←', 'Сверху вниз ↓', 'Снизу вверх ↑'],
      ok: 'Именно! row — ряд, reverse — наоборот: главная ось справа налево, первая карточка справа.', hint: 'Куда идёт row? А что с ним делает reverse?', alt: 'Код row-reverse' },
    en: { ctx: 'The main axis shows which way the cards line up.', q: 'Where does the main axis point here?', opts: ['Left to right →', 'Right to left ←', 'Top to bottom ↓', 'Bottom to top ↑'],
      ok: 'Exactly! row is a row, reverse flips it: the main axis runs right to left, the first card is on the right.', hint: 'Which way does row go? And what does reverse do to it?', alt: 'row-reverse code' } },
  { id: 'css-10t4', target: 'css-10', ptype: 'CSS', tag: 'debug', correct: 2,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flexbox;\n}`} mark={[2]} html={CARDS} css={SHELF + '.javon{display:flexbox}'} />,
    uz: { ctx: "Voy, kartochkalar qatorga tizilmabdi!", q: "Nimaga qoida ishlamadi?", opts: ['flex-direction yozilmagan', 'Kartochkalarga ham flex kerak', 'flexbox degan qiymat yo\'q, flex kerak', 'Javon juda tor'],
      ok: "Juda zo'r! flexbox — usulning nomi, display qiymati esa shunchaki flex.", hint: "display qiymatiga qarang. Darsda qaysi so'z yozilgan edi: qisqasimi yoki uzunimi?", alt: "Ustunda qolgan kartochkalar va kod" },
    ru: { ctx: 'Ой, карточки не встали в ряд!', q: 'Почему правило не сработало?', opts: ['Не написан flex-direction', 'Карточкам тоже нужен flex', 'Значения flexbox нет, нужен flex', 'Полка слишком узкая'],
      ok: 'Отлично! flexbox — название способа, а значение display — просто flex.', hint: 'Посмотри на значение display. Какое слово писали на уроке: короткое или длинное?', alt: 'Карточки столбиком и код' },
    en: { ctx: 'Oops, the cards didn’t line up in a row!', q: 'Why didn’t the rule work?', opts: ['flex-direction is missing', 'The cards need flex too', 'There’s no flexbox value, it’s flex', 'The shelf is too narrow'],
      ok: 'Great! flexbox is the name of the method; the display value is just flex.', hint: 'Look at the display value. Which word was written in the lesson: the short one or the long one?', alt: 'Cards in a column and code' } },
  { id: 'css-10t5', target: 'css-10', ptype: 'CSS', tag: 'cross-axis', correct: 0,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  height: 120px;\n}`} html={CARDS} css={SHELF + '.javon{display:flex;height:120px}'} />,
    uz: { ctx: "Javon balandligi 120 piksel, kartochkalar esa tepadan pastgacha cho'zildi.", q: "Kartochkalar nimaga cho'zildi?", opts: ["Ular ko'ndalang o'q bo'ylab cho'ziladi", 'height kartochkalarga yozilgan', 'flex-direction: column turibdi', 'Kartochkalarda padding juda katta'],
      ok: "To'ppa-to'g'ri! Qatorda ko'ndalang o'q tepadan pastga ketadi, bolalar esa shu o'q bo'ylab cho'ziladi.", hint: "height kimga yozilgan: javongami yoki kartochkalargami? Qatorda ko'ndalang o'q qaysi tomonga ketadi?", alt: "Cho'zilgan kartochkalari bor javon" },
    ru: { ctx: 'Высота полки — 120 пикселей, а карточки вытянулись сверху донизу.', q: 'Почему карточки вытянулись?', opts: ['Они тянутся по поперечной оси', 'height написан карточкам', 'Стоит flex-direction: column', 'У карточек слишком большой padding'],
      ok: 'Верно! В ряду поперечная ось идёт сверху вниз, и дети тянутся вдоль неё.', hint: 'Кому написан height: полке или карточкам? Куда в ряду идёт поперечная ось?', alt: 'Полка с вытянутыми карточками' },
    en: { ctx: 'The shelf is 120 pixels tall, and the cards stretched from top to bottom.', q: 'Why did the cards stretch?', opts: ['They stretch along the cross axis', 'height is set on the cards', 'flex-direction: column is set', 'The cards’ padding is too big'],
      ok: 'Right! In a row the cross axis runs top to bottom, and the children stretch along it.', hint: 'Who has height: the shelf or the cards? Which way does the cross axis run in a row?', alt: 'A shelf with stretched cards' } }
];
