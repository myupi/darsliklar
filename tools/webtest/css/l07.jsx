// =============================================================================
// ТЕСТЫ К УРОКУ 7 КУРСА CSS «Box Model» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: padding — внутри, фон растёт; border без вида линии не рисуется; margin — снаружи, отодвигает соседей,
// фон не растёт; ширина коробки = width + padding + border; box-sizing: border-box держит width.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis (код и/или честная страница).
// =============================================================================
const SLUG = 'box-model';
const QS = [
  { id: 'css-07t1', target: 'css-07', ptype: 'CSS', tag: 'padding', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`p {\n  background: gold;\n  ___: 24px;\n}`} mark={[3]}
      html={`<p>${T('Eslatma', 'Заметка', 'Note')}</p>`} css={`body{margin:0;padding:8px}p{background:gold;padding:24px;margin:0;font-weight:700}`} />; },
    uz: { ctx: "Matn sariq fon chetidan uzoqlashdi, fon esa kattalashdi.", q: "Bo'sh joyda qaysi xususiyat turibdi?", opts: ['margin', 'padding', 'border', 'width'],
      ok: "Qoyil! padding, ya'ni ichki bo'shliq: matn bilan chegara o'rtasidagi joy. Fon u bilan birga o'sadi.", hint: "Joy fonning ichida paydo bo'ldimi yoki tashqarisida? Ichkaridagi bo'shliqning nomi nima edi?", alt: "Sariq eslatma va kod" },
    ru: { ctx: 'Текст отошёл от края жёлтого фона, а фон стал больше.', q: 'Какое свойство на пустом месте?', opts: ['margin', 'padding', 'border', 'width'],
      ok: 'Здорово! padding — внутренний отступ: место между текстом и краем. Фон растёт вместе с ним.', hint: 'Место появилось внутри фона или снаружи? Как называется отступ внутри?', alt: 'Жёлтая заметка и код' },
    en: { ctx: 'The text moved away from the edge of the yellow background, and the background grew.', q: 'Which property is in the empty spot?', opts: ['margin', 'padding', 'border', 'width'],
      ok: 'Nice work! padding is the inner space between the text and the edge. The background grows with it.', hint: 'Did the space appear inside the background or outside? What’s the inner space called?', alt: 'A yellow note and code' } },
  { id: 'css-07t2', target: 'css-07', ptype: 'CSS', tag: 'border', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`p {\n  border: 3px red;\n}`} mark={[2]}
      html={`<p>${T('Eslatma', 'Заметка', 'Note')}</p>`} css={`body{margin:0;padding:8px}p{background:#FEF9C3;padding:12px;margin:0;font-weight:700;border:3px red}`} />; },
    uz: { ctx: "Voy, qizil chegara chiqmabdi!", q: "border qiymatida nima tushib qolibdi?", opts: ['Rangi', 'Qalinligi', 'Chiziq turi (solid)', 'px birligi'],
      ok: "Xuddi shunday! Chiziq turi bo'lmasa, chegara chizilmaydi: solid, dashed yoki dotted kerak.", hint: "border qiymati uch qismdan iborat edi: qalinlik, chiziq turi va rang. Kodda qaysi biri yo'q?", alt: "Chegarasiz eslatma" },
    ru: { ctx: 'Ой, красная рамка не появилась!', q: 'Чего не хватает в значении border?', opts: ['Цвета', 'Толщины', 'Вида линии (solid)', 'Единицы px'],
      ok: 'Именно! Без вида линии рамка не рисуется: нужен solid, dashed или dotted.', hint: 'В значении border три части: толщина, вид линии и цвет. Какой нет в коде?', alt: 'Заметка без рамки' },
    en: { ctx: 'Oops, the red border didn’t show up!', q: 'What is missing from the border value?', opts: ['The colour', 'The thickness', 'The line style (solid)', 'The px unit'],
      ok: 'Exactly! Without a line style there’s no border: you need solid, dashed or dotted.', hint: 'The border value has three parts: thickness, line style and colour. Which one is missing?', alt: 'A note with no border' } },
  { id: 'css-07t3', target: 'css-07', ptype: 'CSS', tag: 'margin', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`p {\n  background: gold;\n  ___: 30px;\n}`} mark={[3]}
      html={`<p>${T('Birinchi', 'Первая', 'First')}</p><p>${T('Ikkinchi', 'Вторая', 'Second')}</p>`} css={`body{margin:0;padding:1px 8px}p{background:gold;margin:30px;padding:0;font-weight:700}`} />; },
    uz: { ctx: "Eslatmalar bir-biridan uzoqlashdi, lekin sariq fon kattalashmadi.", q: "Bo'sh joyda qaysi xususiyat turibdi?", opts: ['padding', 'border', 'width', 'margin'],
      ok: "Juda zo'r! margin, ya'ni tashqi bo'shliq: u qo'shnilarni itaradi, fon esa o'smaydi.", hint: "Joy fonning ichida paydo bo'ldimi yoki eslatmalar o'rtasida, fondan tashqarida?", alt: "Ikkita sariq eslatma va kod" },
    ru: { ctx: 'Заметки разошлись, но жёлтый фон не вырос.', q: 'Какое свойство на пустом месте?', opts: ['padding', 'border', 'width', 'margin'],
      ok: 'Отлично! margin — внешний отступ: он отодвигает соседей, а фон не растёт.', hint: 'Место появилось внутри фона или между заметками, снаружи фона?', alt: 'Две жёлтые заметки и код' },
    en: { ctx: 'The notes moved apart, but the yellow background didn’t grow.', q: 'Which property is in the empty spot?', opts: ['padding', 'border', 'width', 'margin'],
      ok: 'Great! margin is the outer space: it pushes neighbours away, and the background doesn’t grow.', hint: 'Did the space appear inside the background or between the notes, outside it?', alt: 'Two yellow notes and code' } },
  { id: 'css-07t4', target: 'css-07', ptype: 'CSS', tag: 'box', correct: 2,
    vis: () => <WqVis file="style.css" code={`.quti {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid orange;\n}`} />,
    uz: { ctx: "Kodga qarang.", q: "Butun quti necha piksel keng bo'ladi?", opts: ['200px', '220px', '250px', '240px'],
      ok: "To'ppa-to'g'ri! 200 + 20 + 20 + 5 + 5 = 250: ichki bo'shliq va chegara ikki tomondan qo'shiladi.", hint: "padding va border chapda ham, o'ngda ham bor. Ularni width ga ikki marta qo'shib ko'ring.", alt: "Quti kodi" },
    ru: { ctx: 'Посмотри на код.', q: 'Какой будет ширина всей коробки?', opts: ['200px', '220px', '250px', '240px'],
      ok: 'Верно! 200 + 20 + 20 + 5 + 5 = 250: отступ и рамка добавляются с двух сторон.', hint: 'padding и border есть и слева, и справа. Прибавь их к width дважды.', alt: 'Код коробки' },
    en: { ctx: 'Look at the code.', q: 'How wide will the whole box be?', opts: ['200px', '220px', '250px', '240px'],
      ok: 'Right! 200 + 20 + 20 + 5 + 5 = 250: padding and border are added on both sides.', hint: 'padding and border are on the left and on the right. Add them to width twice.', alt: 'Box code' } },
  { id: 'css-07t5', target: 'css-07', ptype: 'CSS', tag: 'box-sizing', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`.quti {\n  width: 200px;\n  padding: 20px;\n  box-sizing: ___;\n}`} mark={[4]} />,
    uz: { ctx: "Quti ichki bo'shliq bilan ham 200 piksel qolishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['content-box', 'border-box', 'padding-box', '200px'],
      ok: "Qoyil! border-box bilan width butun qutini o'lchaydi: ichki bo'shliq va chegara ichkariga sig'adi.", hint: "Oddiy rejimda padding kenglikka qo'shiladi. Qaysi qiymat butun qutini, chegarasigacha, hisoblaydi?", alt: "Bo'sh joyli quti kodi" },
    ru: { ctx: 'Коробка должна остаться 200 пикселей и с отступом.', q: 'Что написать на пустое место?', opts: ['content-box', 'border-box', 'padding-box', '200px'],
      ok: 'Здорово! С border-box width меряет всю коробку: отступ и рамка помещаются внутрь.', hint: 'В обычном режиме padding прибавляется к ширине. Какое значение считает всю коробку, до рамки?', alt: 'Код коробки с пустым местом' },
    en: { ctx: 'The box must stay 200 pixels wide even with padding.', q: 'What goes in the empty spot?', opts: ['content-box', 'border-box', 'padding-box', '200px'],
      ok: 'Nice work! With border-box, width measures the whole box: padding and border fit inside.', hint: 'Normally padding is added to the width. Which value counts the whole box, up to the border?', alt: 'Box code with an empty spot' } }
];
