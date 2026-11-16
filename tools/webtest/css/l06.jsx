// =============================================================================
// ТЕСТЫ К УРОКУ 6 КУРСА CSS «Размеры элементов» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: число без px не действует; % меняется вместе с окном, px — нет; width и height вместе растягивают
// фото; пробел между числом и единицей ломает значение; % — часть ширины родителя.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis (код и/или честная страница).
// =============================================================================
const SLUG = 'razmery';
const QS = [
  { id: 'css-06t1', target: 'css-06', ptype: 'CSS', tag: 'px', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`img {\n  width: ___;\n}`} mark={[2]} />,
    uz: { ctx: "Surat kengligi 200 piksel bo'lishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['200', '200px', '200 px', 'px200'],
      ok: "To'ppa-to'g'ri! Son va px birga, o'rtasida bo'sh joysiz yoziladi.", hint: "Brauzer faqat son bilan nima qilishni bilmaydi: yonida o'lchov birligi bo'lishi kerak. U songa yopishib turadimi?", alt: "Bo'sh joyli CSS qoidasi" },
    ru: { ctx: 'Фото должно быть шириной 200 пикселей.', q: 'Что написать на пустое место?', opts: ['200', '200px', '200 px', 'px200'],
      ok: 'Верно! Число и px пишутся вместе, без пробела.', hint: 'Браузер не знает, что делать с одним числом: рядом нужна единица. Она стоит вплотную к числу?', alt: 'CSS-правило с пустым местом' },
    en: { ctx: 'The photo must be 200 pixels wide.', q: 'What goes in the empty spot?', opts: ['200', '200px', '200 px', 'px200'],
      ok: 'Right! The number and px go together, with no space.', hint: 'The browser doesn’t know what to do with a bare number: it needs a unit. Is it right next to the number?', alt: 'A CSS rule with an empty spot' } },
  { id: 'css-06t2', target: 'css-06', ptype: 'CSS', tag: 'percent', correct: 2,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`p {\n  width: 50%;\n}\nh1 {\n  width: 200px;\n}`}
      html={`<h1>${T('Sarlavha', 'Заголовок', 'Heading')}</h1><p>${T('Abzas', 'Абзац', 'Paragraph')}</p>`}
      css={`body{margin:0;padding:8px}h1{width:200px;background:#FFEDD5;font-size:22px;margin:0 0 8px}p{width:50%;background:#CCFBF1;margin:0;padding:4px 0}`} />; },
    uz: { ctx: "Brauzer oynasini toraytirib ko'ramiz.", q: "Qaysi element ham oyna bilan torayadi?", opts: ['Ikkalasi ham', 'Hech biri', 'Faqat p (50%)', 'Faqat h1 (200px)'],
      ok: "Qoyil! 50% oynaning yarmi degani: oyna toraysa, yarmi ham torayadi. 200px esa doim bir xil.", hint: "Qaysi qiymat oynaga bog'liq: aniq piksel yoki foiz?", alt: "Kod va brauzer oynasi" },
    ru: { ctx: 'Сужаем окно браузера.', q: 'Какой элемент тоже станет уже?', opts: ['Оба', 'Ни один', 'Только p (50%)', 'Только h1 (200px)'],
      ok: 'Здорово! 50% — это половина окна: окно уже — и половина уже. А 200px всегда одинаковые.', hint: 'Какое значение зависит от окна: точные пиксели или проценты?', alt: 'Код и окно браузера' },
    en: { ctx: 'We make the browser window narrower.', q: 'Which element gets narrower too?', opts: ['Both', 'Neither', 'Only p (50%)', 'Only h1 (200px)'],
      ok: 'Nice work! 50% means half the window: a narrower window, a narrower half. 200px always stays the same.', hint: 'Which value depends on the window: exact pixels or percent?', alt: 'Code and a browser window' } },
  { id: 'css-06t3', target: 'css-06', ptype: 'CSS', tag: 'img', correct: 0,
    vis: () => <WqVis file="style.css" code={`img {\n  width: 150px;\n  height: 150px;\n}`}
      html={`<img src="tog.png" alt="tog'">`} css={`img{width:150px;height:150px;display:block}`} />,
    uz: { ctx: "Voy, tog'ning surati g'alati bo'lib qolibdi!", q: "Surat nimaga cho'zilib qoldi?", opts: ['width ham, height ham berilgan', 'width juda katta', 'height berilmagan', 'Surat fayli buzilgan'],
      ok: "Xuddi shunday! Ikkalasini bersak, surat kvadratga siqiladi. Faqat width bersak, balandlik o'zi moslashadi.", hint: "Kodda nechta o'lcham bor? Faqat kenglik bo'lsa, balandlik bilan nima bo'lardi?", alt: "Siqilgan surat" },
    ru: { ctx: 'Ой, фото горы стало странным!', q: 'Почему фото растянулось?', opts: ['Заданы и width, и height', 'width слишком большой', 'height не задан', 'Файл фото сломан'],
      ok: 'Именно! Если задать оба, фото сжимается в квадрат. Если только width, высота подстроится сама.', hint: 'Сколько размеров в коде? Что было бы с высотой, если бы осталась только ширина?', alt: 'Сжатое фото' },
    en: { ctx: 'Oops, the mountain photo looks weird!', q: 'Why did the photo get stretched?', opts: ['Both width and height are set', 'width is too big', 'height is missing', 'The photo file is broken'],
      ok: 'Exactly! With both, the photo is squeezed into a square. With only width, the height adjusts by itself.', hint: 'How many sizes are in the code? What would happen to the height with only the width?', alt: 'A squeezed photo' } },
  { id: 'css-06t4', target: 'css-06', ptype: 'CSS', tag: 'debug', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`.quti {\n  width: 40 %;\n}`} mark={[2]}
      html={`<div class="quti">${T('Quti', 'Коробка', 'Box')}</div>`} css={`body{margin:0;padding:8px}.quti{width:40 %;background:#FED7AA;padding:8px;font-weight:700}`} />; },
    uz: { ctx: "Quti oynaning 40 foizi bo'lishi kerak edi, lekin butun qatorni egallabdi.", q: "Qaysi qator ishlaydi?", opts: ['width: 40;', 'width: %40;', 'width: 40 %;', 'width: 40%;'],
      ok: "Juda zo'r! Son va % o'rtasida bo'sh joy bo'lmaydi.", hint: "Kodda son bilan % o'rtasida nima turibdi? Brauzer uni tushunadimi?", alt: "Butun qatorni egallagan quti" },
    ru: { ctx: 'Коробка должна была занять 40% окна, а заняла всю строку.', q: 'Какая строка работает?', opts: ['width: 40;', 'width: %40;', 'width: 40 %;', 'width: 40%;'],
      ok: 'Отлично! Между числом и % пробела нет.', hint: 'Что стоит в коде между числом и %? Поймёт ли это браузер?', alt: 'Коробка на всю строку' },
    en: { ctx: 'The box was meant to take 40% of the window, but it took the whole line.', q: 'Which line works?', opts: ['width: 40;', 'width: %40;', 'width: 40 %;', 'width: 40%;'],
      ok: 'Great! There’s no space between the number and %.', hint: 'What sits between the number and % in the code? Will the browser understand it?', alt: 'A box across the whole line' } },
  { id: 'css-06t5', target: 'css-06', ptype: 'CSS', tag: 'percent', correct: 1,
    vis: () => <WqVis vw={400} file="style.css" code={`.quti {\n  width: 25%;\n}`}
      html={`<div class="o">400px</div><div class="quti">?</div>`} css={`body{margin:0}.o{background:#E2E8F0;text-align:center;font:700 14px Arial;padding:4px 0}.quti{width:25%;background:#FA4F28;color:#fff;text-align:center;font:700 18px Arial;padding:6px 0;margin-top:6px}`} />,
    uz: { ctx: "Oyna kengligi 400 piksel.", q: "Quti necha piksel keng bo'ladi?", opts: ['25px', '100px', '250px', '400px'],
      ok: "To'ppa-to'g'ri! 25% to'rtdan bir degani: 400 ning to'rtdan biri 100.", hint: "25% butun kenglikning qancha qismi? Yarmi 50% bo'lsa, 25% undan ham kichik.", alt: "Oyna va undagi quti" },
    ru: { ctx: 'Ширина окна — 400 пикселей.', q: 'Какой будет ширина коробки?', opts: ['25px', '100px', '250px', '400px'],
      ok: 'Верно! 25% — это четверть: четверть от 400 — это 100.', hint: 'Какая часть всей ширины — 25%? Если половина — 50%, то 25% ещё меньше.', alt: 'Окно и коробка в нём' },
    en: { ctx: 'The window is 400 pixels wide.', q: 'How wide will the box be?', opts: ['25px', '100px', '250px', '400px'],
      ok: 'Right! 25% means a quarter: a quarter of 400 is 100.', hint: 'What part of the full width is 25%? If half is 50%, then 25% is even less.', alt: 'A window with a box in it' } }
];
