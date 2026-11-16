// =============================================================================
// ТЕСТЫ К УРОКУ 11 КУРСА CSS «Flexbox: выравнивание» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: center (не centre / middle); в ряду сверху вниз центрует align-items; space-between по виду полки;
// gap без px не работает; flex-wrap: wrap переносит карточки на новую строку.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis (код и/или честная страница).
// =============================================================================
const SLUG = 'flexbox-vyravnivanie';
const SHELF11 = 'body{margin:0;padding:10px}.javon{display:flex;background:#FFF1EC;border:2px dashed #FDBA74;padding:6px;min-height:40px}.karta{background:#FA4F28;color:#fff;font:700 18px Arial;padding:8px 14px;border-radius:8px}';
const CARDS11 = (n) => '<div class="javon">' + Array.from({ length: n }, (_, i) => `<div class="karta">${i + 1}</div>`).join('') + '</div>';
const QS = [
  { id: 'css-11t1', target: 'css-11', ptype: 'CSS', tag: 'justify', correct: 2, mono: true,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  justify-content: ___;\n}`} mark={[3]} html={CARDS11(3)} css={SHELF11 + '.javon{justify-content:center}'} />,
    uz: { ctx: "Kartochkalar javonning o'rtasiga yig'ildi.", q: "Bo'sh joyda qaysi qiymat turibdi?", opts: ['centre', 'middle', 'center', 'flex-center'],
      ok: "Qoyil! center — CSS so'zi. centre va middle esa brauzerga tanish emas.", hint: "CSS da «o'rta» qaysi so'z bilan yoziladi? Harflarining tartibiga diqqat qiling.", alt: "O'rtaga yig'ilgan kartochkalar va kod" },
    ru: { ctx: 'Карточки собрались в середине полки.', q: 'Какое значение на пустом месте?', opts: ['centre', 'middle', 'center', 'flex-center'],
      ok: 'Здорово! center — слово CSS. А centre и middle браузер не знает.', hint: 'Каким словом в CSS пишется «середина»? Обрати внимание на порядок букв.', alt: 'Карточки в середине и код' },
    en: { ctx: 'The cards gathered in the middle of the shelf.', q: 'Which value is in the empty spot?', opts: ['centre', 'middle', 'center', 'flex-center'],
      ok: 'Nice work! center is the CSS word. The browser doesn’t know centre or middle.', hint: 'Which word does CSS use for “middle”? Watch the order of the letters.', alt: 'Cards in the middle and code' } },
  { id: 'css-11t2', target: 'css-11', ptype: 'CSS', tag: 'align', correct: 1, mono: true,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  height: 120px;\n  ___\n}`} mark={[4]} />,
    uz: { ctx: "Qator javon. Kartochkalar tepadan pastga qarab o'rtada tursin.", q: "Bo'sh qatorga nima yoziladi?", opts: ['justify-content: center;', 'align-items: center;', 'flex-direction: center;', 'text-align: center;'],
      ok: "Xuddi shunday! Qatorda tepadan pastga — ko'ndalang o'q, uni align-items tekislaydi.", hint: "Qatorda asosiy o'q chapdan o'ngga ketadi. Tepadan pastga qaysi o'q, uni qaysi xususiyat tekislaydi?", alt: "Bo'sh qatorli javon kodi" },
    ru: { ctx: 'Полка-ряд. Карточки должны стоять посередине сверху вниз.', q: 'Что написать в пустую строку?', opts: ['justify-content: center;', 'align-items: center;', 'flex-direction: center;', 'text-align: center;'],
      ok: 'Именно! В ряду сверху вниз идёт поперечная ось, её выравнивает align-items.', hint: 'В ряду главная ось идёт слева направо. Какая ось сверху вниз и какое свойство её выравнивает?', alt: 'Код полки с пустой строкой' },
    en: { ctx: 'A row shelf. The cards must sit in the middle from top to bottom.', q: 'What goes on the empty line?', opts: ['justify-content: center;', 'align-items: center;', 'flex-direction: center;', 'text-align: center;'],
      ok: 'Exactly! In a row, top to bottom is the cross axis, and align-items aligns it.', hint: 'In a row the main axis runs left to right. Which axis runs top to bottom, and which property aligns it?', alt: 'Shelf code with an empty line' } },
  { id: 'css-11t3', target: 'css-11', ptype: 'CSS', tag: 'justify', correct: 3, mono: true,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  justify-content: ___;\n}`} mark={[3]} html={CARDS11(3)} css={SHELF11 + '.javon{justify-content:space-between}'} />,
    uz: { ctx: "Chetdagi kartochkalar javon chetiga tegib turibdi, o'rtasida esa teng joy bor.", q: "Bo'sh joyda qaysi qiymat turibdi?", opts: ['flex-start', 'center', 'flex-end', 'space-between'],
      ok: "Juda zo'r! space-between: kartochkalar chetlarda, ular o'rtasidagi joy esa teng.", hint: "Kartochkalar bir joyga yig'ilganmi yoki javon bo'ylab tarqalganmi? «between» — «o'rtasida» degani.", alt: "Javon bo'ylab tarqalgan kartochkalar" },
    ru: { ctx: 'Крайние карточки у краёв полки, а между ними равные промежутки.', q: 'Какое значение на пустом месте?', opts: ['flex-start', 'center', 'flex-end', 'space-between'],
      ok: 'Отлично! space-between: карточки по краям, а промежутки между ними равные.', hint: 'Карточки собрались в одном месте или разошлись по полке? «between» — значит «между».', alt: 'Карточки, разошедшиеся по полке' },
    en: { ctx: 'The end cards touch the shelf edges, with equal gaps between them.', q: 'Which value is in the empty spot?', opts: ['flex-start', 'center', 'flex-end', 'space-between'],
      ok: 'Great! space-between: cards at the edges, equal gaps between them.', hint: 'Did the cards gather in one place or spread along the shelf? “between” is the key word.', alt: 'Cards spread along the shelf' } },
  { id: 'css-11t4', target: 'css-11', ptype: 'CSS', tag: 'gap', correct: 0,
    vis: () => <WqVis file="style.css" code={`.javon {\n  display: flex;\n  gap: 20;\n}`} mark={[3]} html={CARDS11(3)} css={SHELF11 + '.javon{gap:20}'} />,
    uz: { ctx: "Kartochkalar o'rtasida joy paydo bo'lmadi, ular yopishib turibdi.", q: "Nimaga gap ishlamadi?", opts: ["20 dan keyin px yo'q", 'gap faqat ustunda ishlaydi', 'gap kartochkalarga yoziladi', 'justify-content yozilmagan'],
      ok: "To'ppa-to'g'ri! Faqat son bilan brauzer qoidani tashlab ketadi: gap: 20px kerak.", hint: "Qiymatga qarang: son bor. Darsda uning yonida yana nima turgan edi?", alt: "Yopishgan kartochkalar va kod" },
    ru: { ctx: 'Между карточками не появилось места, они слиплись.', q: 'Почему gap не сработал?', opts: ['После 20 нет px', 'gap работает только в столбике', 'gap пишут карточкам', 'Не написан justify-content'],
      ok: 'Верно! С одним числом браузер пропускает правило: нужно gap: 20px.', hint: 'Посмотри на значение: число есть. Что ещё стояло рядом с ним на уроке?', alt: 'Слипшиеся карточки и код' },
    en: { ctx: 'No space appeared between the cards; they’re stuck together.', q: 'Why didn’t gap work?', opts: ['There’s no px after 20', 'gap only works in a column', 'gap goes on the cards', 'justify-content is missing'],
      ok: 'Right! With a bare number the browser skips the rule: you need gap: 20px.', hint: 'Look at the value: there’s a number. What else stood next to it in the lesson?', alt: 'Cards stuck together and code' } },
  { id: 'css-11t5', target: 'css-11', ptype: 'CSS', tag: 'wrap', correct: 2, mono: true,
    vis: () => <WqVis file="style.css" code={`.javon { display: flex; }\n.karta { width: 90px; }`} html={CARDS11(6)} css={SHELF11 + '.karta{width:90px}'} />,
    uz: { ctx: "Oltita kartochka javonga sig'madi va siqilib qoldi.", q: "Ularni yangi qatorga qanday o'tkazamiz?", opts: ['gap: 20px;', 'flex-direction: column;', 'flex-wrap: wrap;', 'justify-content: center;'],
      ok: "Qoyil! flex-wrap: wrap sig'maganlarni yangi qatorga o'tkazadi, kartochkalar yana to'liq kenglikda bo'ladi.", hint: "Kartochkalarni kichraytirish emas, sig'maganini keyingi qatorga o'tkazish kerak. Qaysi xususiyat shunday qiladi?", alt: "Siqilib qolgan oltita kartochka" },
    ru: { ctx: 'Шесть карточек не поместились на полку и сжались.', q: 'Как перенести карточки на новую строку?', opts: ['gap: 20px;', 'flex-direction: column;', 'flex-wrap: wrap;', 'justify-content: center;'],
      ok: 'Здорово! flex-wrap: wrap переносит то, что не поместилось, на новую строку, и карточки снова полной ширины.', hint: 'Карточки нужно не уменьшить, а перенести лишние на следующую строку. Какое свойство это делает?', alt: 'Шесть сжатых карточек' },
    en: { ctx: 'Six cards didn’t fit on the shelf and got squeezed.', q: 'How do we move them to a new line?', opts: ['gap: 20px;', 'flex-direction: column;', 'flex-wrap: wrap;', 'justify-content: center;'],
      ok: 'Nice work! flex-wrap: wrap moves what doesn’t fit to a new line, and the cards are full width again.', hint: 'Don’t shrink the cards: move the extra ones to the next line. Which property does that?', alt: 'Six squeezed cards' } }
];
