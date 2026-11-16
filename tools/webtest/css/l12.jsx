// =============================================================================
// ТЕСТЫ К УРОКУ 12 КУРСА CSS «Позиционирование» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: relative сдвигает от своего места и место остаётся пустым; absolute без якоря держится за страницу,
// якорь — relative у родителя; fixed не уезжает при прокрутке; top без position не работает; какие сдвиги ставят
// метку в угол. Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis.
// =============================================================================
const SLUG = 'pozicionirovanie';
// Страницы урока: ряд из трёх коробок и карточка игры с меткой.
const C12_BOX = '.qator { display: flex; gap: 12px; } .q { width: 70px; height: 70px; border-radius: 10px; background: #C4B5FD; } .ikki { background: #FA4F28; }';
const c12Boxes = () => '<div class="qator"><div class="q"></div><div class="q ikki"></div><div class="q"></div></div><p style="margin-top:40px">&nbsp;</p>';
const C12_CARD = '.karta { width: 220px; padding: 18px; border-radius: 14px; background: #EDE9FE; } .karta b { font-size: 18px; } .karta p { margin: 6px 0 0; } .belgi { padding: 4px 10px; border-radius: 8px; background: #FA4F28; color: #fff; font-size: 12px; font-weight: bold; }';
const c12Card = (T) => `<div class="karta"><b>${T('Kosmik poyga', 'Космогонка', 'Space race')}</b><p>${T("Yangi o'yin", 'Новая игра', 'A new game')}</p><span class="belgi">${T('YANGI', 'НОВОЕ', 'NEW')}</span></div>`;
const QS = [
  { id: 'css-12t1', target: 'css-12', ptype: 'CSS', tag: 'relative', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`.ikki {\n  position: ___;\n  top: 20px;\n  left: 40px;\n}`} mark={[2]}
      html={c12Boxes()} css={C12_BOX + ' .ikki { position: relative; top: 20px; left: 40px; }'} />,
    uz: { ctx: "Ikkinchi quti o'z joyidan siljidi, joyi esa bo'm-bo'sh qoldi.", q: "Bo'sh joyga qaysi qiymat yoziladi?", opts: ['absolute', 'relative', 'fixed', 'static'],
      ok: "To'ppa-to'g'ri! relative qutini o'z joyidan suradi, eski joyi esa bo'sh turadi.", hint: "Qo'shni qutilar joyida qoldi, o'rtada bo'sh joy bor. Qaysi qiymat eski joyni saqlab qoladi?", alt: "Siljigan quti va bo'sh joy" },
    ru: { ctx: 'Вторая коробка сдвинулась со своего места, а её место осталось пустым.', q: 'Какое значение пишется на пустое место?', opts: ['absolute', 'relative', 'fixed', 'static'],
      ok: 'Верно! relative сдвигает коробку от её места, а старое место остаётся пустым.', hint: 'Соседи остались на местах, посередине пусто. Какое значение сохраняет старое место?', alt: 'Сдвинутая коробка и пустое место' },
    en: { ctx: 'The second box moved from its place, and its place stayed empty.', q: 'Which value goes in the empty spot?', opts: ['absolute', 'relative', 'fixed', 'static'],
      ok: 'Right! relative moves the box from its own place, and the old place stays empty.', hint: 'The neighbours stayed put and there is a gap in the middle. Which value keeps the old place?', alt: 'A moved box and an empty gap' } },
  { id: 'css-12t2', target: 'css-12', ptype: 'CSS', tag: 'absolute', correct: 2, mono: true,
    // Только код: с длинными вариантами-кодом окно страницы на маленьком телефоне не помещается.
    vis: () => <WqVis file="style.css" code={`.karta {\n  padding: 18px;\n}\n.belgi {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n}`} mark={[5]} />,
    uz: { ctx: "Belgi kartochka emas, sahifa burchagiga chiqib ketdi.", q: "Qaysi qator uni kartochka burchagiga qaytaradi?", opts: ['.belgi { position: relative; }', '.karta { top: 0px; }', '.karta { position: relative; }', '.belgi { position: fixed; }'],
      ok: "Qoyil! Kartochkaga relative berdik: u langar bo'ldi, absolute belgi endi uning burchagini oladi.", hint: "absolute belgi eng yaqin langarni qidiradi. Langar yo'q bo'lsa, sahifaga yopishadi. Kim langar bo'lishi kerak?", alt: "Belgi sahifaning o'ng yuqori burchagida" },
    ru: { ctx: 'Метка ушла не в угол карточки, а в угол страницы.', q: 'Какая строка вернёт её в угол карточки?', opts: ['.belgi { position: relative; }', '.karta { top: 0px; }', '.karta { position: relative; }', '.belgi { position: fixed; }'],
      ok: 'Здорово! У карточки relative — она стала якорем, и метка absolute теперь берёт её угол.', hint: 'Метка absolute ищет ближайший якорь. Нет якоря — держится за страницу. Кто должен стать якорем?', alt: 'Метка в правом верхнем углу страницы' },
    en: { ctx: 'The label went to the page’s corner, not the card’s.', q: 'Which line brings it back to the card’s corner?', opts: ['.belgi { position: relative; }', '.karta { top: 0px; }', '.karta { position: relative; }', '.belgi { position: fixed; }'],
      ok: 'Nice work! The card got relative, so it became the anchor, and the absolute label now takes its corner.', hint: 'An absolute label looks for the nearest anchor. With no anchor it sticks to the page. Who should be the anchor?', alt: 'The label in the top right corner of the page' } },
  { id: 'css-12t3', target: 'css-12', ptype: 'CSS', tag: 'fixed', correct: 3, mono: true,
    vis: () => <WqVis file="style.css" code={`.tugma {\n  position: ___;\n  bottom: 10px;\n  right: 10px;\n}`} mark={[2]} />,
    uz: { ctx: "Sahifa uzun. «Yuqoriga» tugmasi pastga aylantirganda ham oyna burchagida qolsin.", q: "Bo'sh joyga qaysi qiymat yoziladi?", opts: ['relative', 'absolute', 'static', 'fixed'],
      ok: "Xuddi shunday! fixed tugmani oynaga mahkamlaydi: sahifa aylanadi, tugma esa joyida turadi.", hint: "absolute tugma sahifa bilan birga yuqoriga ketib qoladi. Qaysi qiymat tugmani oynaning o'ziga mahkamlaydi?", alt: "position qiymati bo'sh qoida" },
    ru: { ctx: 'Страница длинная. Кнопка «Наверх» должна оставаться в углу окна и при прокрутке.', q: 'Какое значение пишется на пустое место?', opts: ['relative', 'absolute', 'static', 'fixed'],
      ok: 'Именно! fixed прикрепляет кнопку к окну: страница прокручивается, а кнопка стоит на месте.', hint: 'Кнопка absolute уедет вверх вместе со страницей. Какое значение прикрепляет кнопку к самому окну?', alt: 'Правило с пустым значением position' },
    en: { ctx: 'The page is long. The “Top” button must stay in the window’s corner even when you scroll.', q: 'Which value goes in the empty spot?', opts: ['relative', 'absolute', 'static', 'fixed'],
      ok: 'Exactly! fixed pins the button to the window: the page scrolls, the button stays put.', hint: 'An absolute button scrolls away with the page. Which value pins the button to the window itself?', alt: 'A rule with an empty position value' } },
  { id: 'css-12t4', target: 'css-12', ptype: 'CSS', tag: 'debug', correct: 0,
    vis: () => <WqVis file="style.css" code={`.ikki {\n  top: 30px;\n  left: 30px;\n}`} html={c12Boxes()} css={C12_BOX + ' .ikki { top: 30px; left: 30px; }'} />,
    uz: { ctx: "Kod yozildi, lekin to'q sariq quti joyidan qimirlamadi.", q: "Quti nimaga siljimadi?", opts: ['position yozilmagan', "top manfiy bo'lishi kerak", 'px yozmaslik kerak edi', 'top va left birga ishlamaydi'],
      ok: "To'ppa-to'g'ri! top va left faqat position bor joyda ishlay oladi. position yo'q bo'lsa, ular uxlab yotadi.", hint: "Darsdagi siljishlar esingizdami? top va left dan oldin qoidada yana nima turar edi?", alt: "Joyidan siljimagan quti" },
    ru: { ctx: 'Код написан, а оранжевая коробка не сдвинулась.', q: 'Почему коробка не сдвинулась?', opts: ['Не написан position', 'top должен быть отрицательным', 'px писать не нужно было', 'top и left не работают вместе'],
      ok: 'Верно! top и left работают только там, где есть position. Без position они спят.', hint: 'Вспомни сдвиги из урока: что ещё стояло в правиле перед top и left?', alt: 'Коробка, которая не сдвинулась' },
    en: { ctx: 'The code is written, but the orange box didn’t move.', q: 'Why didn’t the box move?', opts: ['position is missing', 'top must be negative', 'There should be no px', 'top and left don’t work together'],
      ok: 'Right! top and left only work where there is a position. Without it they do nothing.', hint: 'Remember the moves in the lesson: what else was in the rule before top and left?', alt: 'A box that did not move' } },
  { id: 'css-12t5', target: 'css-12', ptype: 'CSS', tag: 'corner', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis html={c12Card(T)} css={C12_CARD + ' .karta { position: relative; } .belgi { position: absolute; bottom: 0px; left: 0px; }'} />; },
    uz: { ctx: "Kartochka langar, belgi esa absolute. Belgi qayerda turganiga qarang.", q: "Qaysi siljishlar belgini shu yerga qo'ydi?", opts: ['top: 0px; left: 0px;', 'bottom: 0px; left: 0px;', 'bottom: 0px; right: 0px;', 'top: 0px; right: 0px;'],
      ok: "Juda zo'r! bottom belgini pastki chetga, left esa chap chetga yopishtiradi.", hint: "Belgi pastdami yoki tepadami? Chapdami yoki o'ngdami? Har biriga bitta so'z kerak.", alt: "Kartochkaning chap pastki burchagidagi belgi" },
    ru: { ctx: 'Карточка — якорь, метка — absolute. Посмотри, где стоит метка.', q: 'Какие сдвиги поставили метку сюда?', opts: ['top: 0px; left: 0px;', 'bottom: 0px; left: 0px;', 'bottom: 0px; right: 0px;', 'top: 0px; right: 0px;'],
      ok: 'Отлично! bottom прижимает метку к нижнему краю, а left — к левому.', hint: 'Метка внизу или вверху? Слева или справа? На каждое — своё слово.', alt: 'Метка в левом нижнем углу карточки' },
    en: { ctx: 'The card is the anchor and the label is absolute. Look where the label is.', q: 'Which offsets put the label here?', opts: ['top: 0px; left: 0px;', 'bottom: 0px; left: 0px;', 'bottom: 0px; right: 0px;', 'top: 0px; right: 0px;'],
      ok: 'Great! bottom pins the label to the bottom edge, and left pins it to the left edge.', hint: 'Is the label at the bottom or the top? Left or right? Each needs its own word.', alt: 'A label in the bottom left corner of the card' } }
];
