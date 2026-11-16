// =============================================================================
// ТЕСТЫ К УРОКУ 13 КУРСА CSS «Hover и transform» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: правило с :hover работает только под мышкой; пробел перед :hover ломает правило; transform не сдвигает
// соседей; rotate пишется с deg; рука над кнопкой — cursor: pointer.
// :hover в честной странице не срабатывает, поэтому вопросы про него — по коду; страница — только для статичного scale.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'hover-transform';
const C13_BTN = '.tugma { padding: 10px 22px; border: none; border-radius: 10px; background: #C4B5FD; font-size: 16px; font-weight: bold; } p { margin: 18px 0 0; }';
const QS = [
  { id: 'css-13t1', target: 'css-13', ptype: 'CSS', tag: 'hover', correct: 1,
    vis: () => <WqVis file="style.css" code={`.tugma {\n  background-color: #C4B5FD;\n}\n.tugma:hover {\n  background-color: orange;\n}`} mark={[4]} />,
    uz: { ctx: "Tugmaning ikkita qoidasi bor.", q: "Tugma qachon to'q sariq bo'ladi?", opts: ["Doim, sahifa ochilishi bilan", "Sichqoncha ustiga kelganda", "Tugmani bosib qo'yib yuborganda", "Hech qachon, ikkinchi qoida ishlamaydi"],
      ok: "To'ppa-to'g'ri! :hover qoidasi faqat sichqoncha tugma ustida turganda ishlaydi. Telefonda esa barmoq tekkanda.", hint: "Ikkinchi qoidaning selektoriga qarang: tugma so'zidan keyin nima turibdi? U qachon ishlashini aytadi.", alt: "Ikkita qoida: oddiy va :hover" },
    ru: { ctx: 'У кнопки два правила.', q: 'Когда кнопка станет оранжевой?', opts: ['Всегда, сразу при открытии страницы', 'Когда мышка над ней', 'Когда кнопку нажали и отпустили', 'Никогда, второе правило не работает'],
      ok: 'Верно! Правило с :hover работает, только пока мышка над кнопкой. На телефоне — при касании.', hint: 'Посмотри на селектор второго правила: что стоит после имени кнопки? Это и говорит, когда оно работает.', alt: 'Два правила: обычное и :hover' },
    en: { ctx: 'The button has two rules.', q: 'When does the button turn orange?', opts: ['Always, as soon as the page opens', 'When the mouse is over it', 'When the button is clicked and released', 'Never, the second rule doesn’t work'],
      ok: 'Right! A :hover rule only works while the mouse is over the button. On a phone — when you touch it.', hint: 'Look at the second rule’s selector: what comes after the button name? That tells you when it works.', alt: 'Two rules: a normal one and :hover' } },
  { id: 'css-13t2', target: 'css-13', ptype: 'CSS', tag: 'hover-space', correct: 2,
    vis: () => <WqVis file="style.css" code={`.tugma :hover {\n  transform: scale(1.1);\n}`} mark={[1]} />,
    uz: { ctx: "Sichqoncha tugma ustida turibdi, lekin tugma kattalashmayapti.", q: "Nima xalaqit beryapti?", opts: ["scale(1.1) juda kichik son", "Tugmaning ichida matn bor", ":hover oldidagi bo'sh joy", "transform bilan :hover ishlamaydi"],
      ok: "Qoyil! .tugma va :hover yonma-yon, bo'sh joysiz yoziladi. Bo'sh joy bilan selektor tugmaning ichidagi narsani qidiradi.", hint: "Birinchi qatorni harfma-harf o'qing. .tugma bilan :hover o'rtasida nima turibdi?", alt: "Selektorida bo'sh joy bor qoida" },
    ru: { ctx: 'Мышка над кнопкой, но кнопка не увеличивается.', q: 'Что мешает?', opts: ['scale(1.1) — слишком маленькое число', 'Внутри кнопки есть текст', 'Пробел перед :hover', 'transform не работает с :hover'],
      ok: 'Здорово! .tugma и :hover пишутся вплотную, без пробела. С пробелом селектор ищет что-то внутри кнопки.', hint: 'Прочитай первую строку по буквам. Что стоит между .tugma и :hover?', alt: 'Правило с пробелом в селекторе' },
    en: { ctx: 'The mouse is over the button, but the button doesn’t grow.', q: 'What is getting in the way?', opts: ['scale(1.1) is too small a number', 'There is text inside the button', 'The space before :hover', 'transform doesn’t work with :hover'],
      ok: 'Nice work! .tugma and :hover are written together, with no space. With a space the selector looks for something inside the button.', hint: 'Read the first line letter by letter. What is between .tugma and :hover?', alt: 'A rule with a space in the selector' } },
  { id: 'css-13t3', target: 'css-13', ptype: 'CSS', tag: 'scale', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`.tugma {\n  transform: scale(1.5);\n}`} mark={[2]}
      html={`<button class="tugma">${T("O'ynash", 'Играть', 'Play')}</button><p>${T("Abzas tugmaning ostida turibdi.", 'Абзац стоит под кнопкой.', 'The paragraph sits under the button.')}</p>`}
      css={C13_BTN + ' .tugma { transform: scale(1.5); }'} />; },
    uz: { ctx: "scale(1.5) tugmani bir yarim barobar kattalashtirdi.", q: "Tugma ostidagi abzas-chi?", opts: ['Pastga surilib ketdi', 'Kichrayib qoldi', "Yon tomonga o'tib ketdi", 'Joyida qoldi'],
      ok: "Xuddi shunday! transform faqat tugmaning o'zini o'zgartiradi, qo'shnilar esa joyidan qimirlamaydi.", hint: "Sahifaga qarang: abzas tugmadan qochdimi yoki o'z joyida turibdimi?", alt: "Kattalashgan tugma va uning ostidagi abzas" },
    ru: { ctx: 'scale(1.5) увеличил кнопку в полтора раза.', q: 'А абзац под кнопкой?', opts: ['Сдвинулся вниз', 'Уменьшился', 'Ушёл в сторону', 'Остался на месте'],
      ok: 'Именно! transform меняет только саму кнопку, а соседи не двигаются.', hint: 'Посмотри на страницу: абзац отодвинулся от кнопки или стоит на своём месте?', alt: 'Увеличенная кнопка и абзац под ней' },
    en: { ctx: 'scale(1.5) made the button one and a half times bigger.', q: 'What about the paragraph under the button?', opts: ['It moved down', 'It got smaller', 'It moved to the side', 'It stayed in place'],
      ok: 'Exactly! transform changes only the button itself, and the neighbours don’t move.', hint: 'Look at the page: did the paragraph move away from the button, or is it still in its place?', alt: 'A bigger button and the paragraph under it' } },
  { id: 'css-13t4', target: 'css-13', ptype: 'CSS', tag: 'rotate', correct: 0, mono: true,
    vis: () => <WqVis file="style.css" code={`.tugma:hover {\n  transform: rotate(___);\n}`} mark={[2]} />,
    uz: { ctx: "Sichqoncha kelganda tugma 15 gradusga burilsin.", q: "Qavs ichiga nima yoziladi?", opts: ['15deg', '15', '15px', '15%'],
      ok: "Juda zo'r! Burish gradusda o'lchanadi, shuning uchun songa deg qo'shiladi: rotate(15deg).", hint: "Son yolg'iz bo'lsa, brauzer uni tanimaydi. Gradus so'zining qisqasi qaysi?", alt: "rotate qavsi bo'sh qoida" },
    ru: { ctx: 'При наведении кнопка должна повернуться на 15 градусов.', q: 'Что пишется в скобках?', opts: ['15deg', '15', '15px', '15%'],
      ok: 'Отлично! Поворот измеряется в градусах, поэтому к числу добавляется deg: rotate(15deg).', hint: 'Одно число браузер не примет. Как коротко записываются градусы?', alt: 'Правило с пустыми скобками rotate' },
    en: { ctx: 'On hover, the button should turn 15 degrees.', q: 'What goes inside the brackets?', opts: ['15deg', '15', '15px', '15%'],
      ok: 'Great! Turning is measured in degrees, so the number gets deg: rotate(15deg).', hint: 'A bare number won’t be accepted. What is the short way to write degrees?', alt: 'A rule with empty rotate brackets' } },
  { id: 'css-13t5', target: 'css-13', ptype: 'CSS', tag: 'cursor', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`.tugma {\n  ___: pointer;\n}`} mark={[2]} />,
    uz: { ctx: "Sichqoncha tugma ustiga kelganda qo'lchaga aylansin.", q: "Bo'sh joyga qaysi xususiyat yoziladi?", opts: ['transform', 'cursor', 'hover', 'display'],
      ok: "To'ppa-to'g'ri! cursor xususiyati sichqoncha ko'rsatkichini almashtiradi, pointer esa qo'lcha degani.", hint: "pointer bu qiymat. Sichqoncha ko'rsatkichi inglizcha qanday ataladi?", alt: "Xususiyat nomi bo'sh qoida" },
    ru: { ctx: 'Над кнопкой указатель мышки должен стать рукой.', q: 'Какое свойство пишется на пустое место?', opts: ['transform', 'cursor', 'hover', 'display'],
      ok: 'Верно! Свойство cursor меняет указатель мышки, а pointer — это рука.', hint: 'pointer — это значение. Как по-английски называется указатель мышки?', alt: 'Правило с пустым именем свойства' },
    en: { ctx: 'Over the button, the mouse pointer should turn into a hand.', q: 'Which property goes in the empty spot?', opts: ['transform', 'cursor', 'hover', 'display'],
      ok: 'Right! The cursor property changes the mouse pointer, and pointer means the hand.', hint: 'pointer is the value. What is the mouse pointer called in English?', alt: 'A rule with an empty property name' } }
];
