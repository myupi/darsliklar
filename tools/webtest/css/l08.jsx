// =============================================================================
// ТЕСТЫ К УРОКУ 8 КУРСА CSS «Красивые карточки» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: border-radius без px не действует; первое число box-shadow — вправо; тень пишется без запятых;
// border-left — линия только слева; круг — квадрат и border-radius: 50%.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis (код и/или честная страница).
// =============================================================================
const SLUG = 'kartochki';
const CARD8 = 'body{margin:0;padding:14px}.karta{background:#EDE9FE;padding:14px;font:700 16px Arial;width:200px}';
const QS = [
  { id: 'css-08t1', target: 'css-08', ptype: 'CSS', tag: 'radius', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`.karta {\n  border-radius: 20;\n}`} mark={[2]}
      html={`<div class="karta">${T("Shaxmat to'garagi", 'Шахматный кружок', 'Chess club')}</div>`} css={CARD8 + '.karta{border-radius:20}'} />; },
    uz: { ctx: "Kartochka burchaklari o'tkirligicha qolibdi.", q: "Burchaklar nimaga yumaloqlanmadi?", opts: ["20 dan keyin px yo'q", 'Son juda kichik', 'Kartochkaning rangi yo\'q', 'Kartochkada border yo\'q'],
      ok: "To'ppa-to'g'ri! Faqat son bilan brauzer qoidani tashlab ketadi: border-radius: 20px deb yozish kerak.", hint: "Qiymatga qarang: son bor, lekin uning yonida yana nima bo'lishi kerak edi?", alt: "O'tkir burchakli kartochka va kod" },
    ru: { ctx: 'Углы карточки остались острыми.', q: 'Почему углы не скруглились?', opts: ['После 20 нет px', 'Число слишком маленькое', 'У карточки нет цвета', 'У карточки нет border'],
      ok: 'Верно! С одним числом браузер пропускает правило: нужно border-radius: 20px.', hint: 'Посмотри на значение: число есть, а что ещё должно стоять рядом с ним?', alt: 'Карточка с острыми углами и код' },
    en: { ctx: 'The card’s corners are still sharp.', q: 'Why didn’t the corners get rounded?', opts: ['There’s no px after 20', 'The number is too small', 'The card has no colour', 'The card has no border'],
      ok: 'Right! With a bare number the browser skips the rule: you need border-radius: 20px.', hint: 'Look at the value: there’s a number, but what else should be next to it?', alt: 'A card with sharp corners and code' } },
  { id: 'css-08t2', target: 'css-08', ptype: 'CSS', tag: 'shadow', correct: 1,
    vis: () => <WqVis file="style.css" code={`.karta {\n  box-shadow: 8px 0px 0px gray;\n}`} mark={[2]} />,
    uz: { ctx: "Tartibni eslang: birinchi son, ikkinchi son, xiralik, rang.", q: "Soya qaysi tomonga tushadi?", opts: ['Pastga', "O'ngga", 'Tepaga', 'Chapga'],
      ok: "Qoyil! Birinchi son soyani o'ngga suradi, ikkinchisi pastga. Bu yerda pastga nol.", hint: "box-shadow da birinchi son qaysi tomonga suradi, ikkinchisi qaysi tomonga? Qaysi biri nol?", alt: "Soya kodi" },
    ru: { ctx: 'Вспомни порядок: первое число, второе число, размытие, цвет.', q: 'В какую сторону упадёт тень?', opts: ['Вниз', 'Вправо', 'Вверх', 'Влево'],
      ok: 'Здорово! Первое число сдвигает тень вправо, второе — вниз. Здесь вниз — ноль.', hint: 'В box-shadow куда сдвигает первое число, а куда второе? Какое из них ноль?', alt: 'Код тени' },
    en: { ctx: 'Remember the order: first number, second number, blur, colour.', q: 'Which way will the shadow fall?', opts: ['Down', 'Right', 'Up', 'Left'],
      ok: 'Nice work! The first number moves the shadow right, the second moves it down. Here down is zero.', hint: 'In box-shadow, where does the first number move it, and the second? Which one is zero?', alt: 'Shadow code' } },
  { id: 'css-08t3', target: 'css-08', ptype: 'CSS', tag: 'shadow', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`.karta {\n  box-shadow: 0px, 6px, 12px, gray;\n}`} mark={[2]}
      html={`<div class="karta">${T("Robot to'garagi", 'Кружок роботов', 'Robot club')}</div>`} css={CARD8 + '.karta{border-radius:12px;box-shadow:0px, 6px, 12px, gray}'} />; },
    uz: { ctx: "Voy, kartochkada soya chiqmabdi!", q: "Qiymatni qanday tuzatamiz?", opts: ['0px;6px;12px;gray', '(0px 6px 12px) gray', '0px 6px 12px gray', '0px, 6px, 12px gray'],
      ok: "Xuddi shunday! Soya qismlari bo'sh joy bilan yoziladi, vergul bilan emas.", hint: "Kodda qismlar o'rtasida nima turibdi? Darsda ular nima bilan ajratilgan edi?", alt: "Soyasiz kartochka va kod" },
    ru: { ctx: 'Ой, у карточки нет тени!', q: 'Как исправить значение?', opts: ['0px;6px;12px;gray', '(0px 6px 12px) gray', '0px 6px 12px gray', '0px, 6px, 12px gray'],
      ok: 'Именно! Части тени пишутся через пробел, а не через запятую.', hint: 'Что стоит в коде между частями? Чем они разделялись на уроке?', alt: 'Карточка без тени и код' },
    en: { ctx: 'Oops, the card has no shadow!', q: 'How do we fix the value?', opts: ['0px;6px;12px;gray', '(0px 6px 12px) gray', '0px 6px 12px gray', '0px, 6px, 12px gray'],
      ok: 'Exactly! Shadow parts are separated by spaces, not commas.', hint: 'What sits between the parts in the code? What separated them in the lesson?', alt: 'A card with no shadow and code' } },
  { id: 'css-08t4', target: 'css-08', ptype: 'CSS', tag: 'border-side', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis html={`<div class="karta">${T("Futbol to'garagi", 'Футбольный кружок', 'Football club')}</div>`} css={CARD8 + '.karta{background:#fff;border-radius:6px;border-left:6px solid orange;box-shadow:0 4px 10px #CBD5E1}'} />; },
    uz: { ctx: "Kartochkaning faqat chap tomonida to'q sariq chiziq bor.", q: "Qaysi qator shuni beradi?", opts: ['border: 6px solid orange;', 'border-top: 6px solid orange;', 'border-right: 6px solid orange;', 'border-left: 6px solid orange;'],
      ok: "Juda zo'r! border-left faqat chap tomonga chiziq chizadi. border esa to'rt tomonga.", hint: "Chiziq nechta tomonda? Inglizcha «chap» qanday bo'ladi?", alt: "Chap tomonida chizig'i bor kartochka" },
    ru: { ctx: 'У карточки оранжевая полоса только слева.', q: 'Какая строка это даёт?', opts: ['border: 6px solid orange;', 'border-top: 6px solid orange;', 'border-right: 6px solid orange;', 'border-left: 6px solid orange;'],
      ok: 'Отлично! border-left рисует линию только слева. А border — со всех четырёх сторон.', hint: 'Со скольких сторон полоса? Как по-английски «левый»?', alt: 'Карточка с полосой слева' },
    en: { ctx: 'The card has an orange stripe on the left side only.', q: 'Which line gives this?', opts: ['border: 6px solid orange;', 'border-top: 6px solid orange;', 'border-right: 6px solid orange;', 'border-left: 6px solid orange;'],
      ok: 'Great! border-left draws a line on the left only. border draws on all four sides.', hint: 'How many sides have the stripe? Which side is it on?', alt: 'A card with a stripe on the left' } },
  { id: 'css-08t5', target: 'css-08', ptype: 'CSS', tag: 'circle', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`.doira {\n  width: 120px;\n  height: 120px;\n  background: orange;\n  border-radius: ___;\n}`} mark={[5]} />,
    uz: { ctx: "Kvadratdan doira yasamoqchimiz.", q: "Bo'sh joyga nima yoziladi?", opts: ['10px', '50%', '20%', '50'],
      ok: "To'ppa-to'g'ri! Kvadratga border-radius: 50% bersak, u doira bo'ladi.", hint: "Burchaklar shunchalik yumaloq bo'lishi kerakki, to'g'ri chiziq qolmasin. Bu tomonning qancha qismi?", alt: "Bo'sh joyli doira kodi" },
    ru: { ctx: 'Хотим сделать из квадрата круг.', q: 'Что написать на пустое место?', opts: ['10px', '50%', '20%', '50'],
      ok: 'Верно! Если квадрату дать border-radius: 50%, он станет кругом.', hint: 'Углы должны скруглиться так, чтобы прямых не осталось. Какая это часть стороны?', alt: 'Код круга с пустым местом' },
    en: { ctx: 'We want to turn a square into a circle.', q: 'What goes in the empty spot?', opts: ['10px', '50%', '20%', '50'],
      ok: 'Right! Give a square border-radius: 50% and it becomes a circle.', hint: 'The corners must round so much that no straight edge is left. What part of the side is that?', alt: 'Circle code with an empty spot' } }
];
