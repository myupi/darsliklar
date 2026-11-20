// =============================================================================
// ТЕСТЫ К УРОКУ 2 МОДУЛЯ BOOTSTRAP «Цвета и кнопки» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: у кнопки два слова — стиль (btn-solid) и цвет (theme-*); btn-primary — имя версии 5, кнопка голая;
// цвет текста — fg-* (не text-*); bg-* — фон; кнопка с рамкой — btn-outline theme-*.
// Страница — честная (bs={BS_CSS}). Апостроф — ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'cveta-i-knopki';
const b2Btn = (T) => T("Yozilish", 'Записаться', 'Sign up');
const b2More = (T) => T("Batafsil", 'Подробнее', 'More');
const b2H1 = (T, cls) => `<h1${cls ? ` class="${cls}"` : ''}>${T("Robot to'garagi", 'Кружок роботов', 'Robot club')}</h1>`;
const QS = [
  { id: 'bootstrap-02t1', target: 'bootstrap-02', ptype: 'Bootstrap', tag: 'btn-solid', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<button class="___ theme-success">\n  ${b2Btn(T)}\n</button>`} html={`<button class="btn-solid theme-success">${b2Btn(T)}</button>`} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Tugma o'ngdagidek bo'lishi kerak: ichi to'la, yashil.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['btn-success', 'theme-solid', 'btn-outline', 'btn-solid'],
      ok: "To'ppa-to'g'ri! Birinchi so'z — uslub: btn-solid ichi to'la tugma beradi. Rangni esa ikkinchi so'z theme-success beradi.", hint: "Tugma class-ida ikki so'z bo'ladi: uslub va rang. Rang allaqachon yozilgan. Ichi to'la uslub qaysi so'z edi?", alt: "Uslub so'zi bo'sh qolgan tugma kodi va kerakli yashil tugma" },
    ru: { ctx: 'Кнопка должна стать как справа: залитая, зелёная.', q: 'Какое слово пишется на пустое место?', opts: ['btn-success', 'theme-solid', 'btn-outline', 'btn-solid'],
      ok: 'Верно! Первое слово — стиль: btn-solid даёт залитую кнопку. А цвет даёт второе слово, theme-success.', hint: 'В class кнопки два слова: стиль и цвет. Цвет уже написан. Каким словом задаётся залитый стиль?', alt: 'Код кнопки с пустым словом стиля и нужная зелёная кнопка' },
    en: { ctx: 'The button should look like the one on the right: filled and green.', q: 'Which word goes in the empty spot?', opts: ['btn-success', 'theme-solid', 'btn-outline', 'btn-solid'],
      ok: 'Right! The first word is the style: btn-solid makes a filled button. The color comes from the second word, theme-success.', hint: 'A button class has two words: style and color. The color is already there. Which word makes the filled style?', alt: 'Button code with an empty style word and the green button needed' } },
  { id: 'bootstrap-02t2', target: 'bootstrap-02', ptype: 'Bootstrap', tag: 'btn-primary', correct: 0,
    vis: (L) => { const T = aqL(L); const src = `${b2H1(T)}\n<button class="btn-primary">${b2Btn(T)}</button>`; return <WqVis code={src} html={src} bs={BS_CSS} mark={[2]} />; },
    uz: { ctx: "Bootstrap ulangan, lekin tugma oddiy brauzer tugmasi bo'lib qoldi.", q: 'Nega?', opts: ["btn-primary — 5-versiya nomi", "primary faqat e'lonlar uchun", "button-ga class yozib bo'lmaydi", "Tugma matni juda uzun"],
      ok: "Qoyil! Bu nom eski darsliklardan. Oltinchi versiyada tugma ikki so'z bilan yoziladi: btn-solid theme-primary.", hint: "Sarlavha chiroyli bo'lsa, Bootstrap ulangan. Demak, gap class so'zida. Bu so'z qaysi versiyadan?", alt: "btn-primary yozilgan oddiy tugma" },
    ru: { ctx: 'Bootstrap подключён, но кнопка осталась обычной кнопкой браузера.', q: 'Почему?', opts: ['btn-primary — имя 5-й версии', 'primary — только для объявлений', 'у button не бывает class', 'Слишком длинный текст кнопки'],
      ok: 'Здорово! Это имя из старых учебников. В шестой версии кнопка пишется двумя словами: btn-solid theme-primary.', hint: 'Раз заголовок красивый, Bootstrap подключён. Значит, дело в слове в class. Из какой оно версии?', alt: 'Обычная кнопка с btn-primary' },
    en: { ctx: 'Bootstrap is connected, but the button stayed a plain browser button.', q: 'Why?', opts: ['btn-primary is a version 5 name', 'primary is only for alerts', 'a button can’t have a class', 'The button text is too long'],
      ok: 'Nice work! That name comes from old tutorials. In version 6 a button takes two words: btn-solid theme-primary.', hint: 'The heading looks nice, so Bootstrap is connected. The problem is the class word. Which version is it from?', alt: 'A plain button with btn-primary' } },
  { id: 'bootstrap-02t3', target: 'bootstrap-02', ptype: 'Bootstrap', tag: 'fg', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<h1 class="___">\n  ${T("Robot to'garagi", 'Кружок роботов', 'Robot club')}\n</h1>`} html={b2H1(T, 'fg-danger')} bs={BS_CSS} mark={[1]} />; },
    uz: { ctx: "Sarlavha harflari o'ngdagidek qizil bo'lishi kerak.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['text-danger', 'bg-danger', 'fg-danger', 'theme-red'],
      ok: "Xuddi shunday! Matn rangi fg bilan boshlanadi: fg-danger — qizil harflar. text-danger esa beshinchi versiyaning nomi.", hint: "Bu yerda fon emas, harflarning rangi kerak. Darsda matn rangi qaysi qisqa so'z bilan boshlanardi?", alt: "class-i bo'sh sarlavha va qizil sarlavha" },
    ru: { ctx: 'Буквы заголовка должны стать красными, как справа.', q: 'Какое слово пишется на пустое место?', opts: ['text-danger', 'bg-danger', 'fg-danger', 'theme-red'],
      ok: 'Именно! Цвет текста начинается с fg: fg-danger — красные буквы. А text-danger — имя пятой версии.', hint: 'Здесь нужен не фон, а цвет букв. С какого короткого слова в уроке начинался цвет текста?', alt: 'Заголовок с пустым class и красный заголовок' },
    en: { ctx: 'The heading letters should turn red, like on the right.', q: 'Which word goes in the empty spot?', opts: ['text-danger', 'bg-danger', 'fg-danger', 'theme-red'],
      ok: 'Exactly! Text color starts with fg: fg-danger means red letters. text-danger is a version 5 name.', hint: 'We need the color of the letters, not the background. Which short word started text colors in the lesson?', alt: 'A heading with an empty class and a red heading' } },
  { id: 'bootstrap-02t4', target: 'bootstrap-02', ptype: 'Bootstrap', tag: 'bg', correct: 1,
    vis: (L) => { const T = aqL(L); const src = `${b2H1(T)}\n<p class="bg-warning">${T("Mashg'ulot shanba kuni", 'Занятие в субботу', 'Class is on Saturday')}</p>`; return <WqVis code={src} html={src} bs={BS_CSS} mark={[2]} />; },
    uz: { ctx: "Abzasga bg-warning yozildi.", q: "Bu so'z abzasda nimani o'zgartirdi?", opts: ["Harflarning o'zini sariq rangga bo'yadi", "Abzasning orqa fonini sariq qildi", "Abzas atrofiga sariq chegara chizdi", "Harflarni qalin va kattaroq qildi"],
      ok: "Juda zo'r! bg — background, ya'ni fon. bg-warning abzas ortini sariq qiladi, harflar esa o'z rangida qoladi.", hint: "Sahifaga qarang: sariq rang qayerda — harflardami yoki ularning ortidami? bg so'zi nimaning qisqartmasi?", alt: "Foni sariq abzas va uning kodi" },
    ru: { ctx: 'Абзацу написали bg-warning.', q: 'Что это слово изменило у абзаца?', opts: ['Покрасило буквы в жёлтый цвет', 'Сделало жёлтым фон за абзацем', 'Нарисовало жёлтую рамку вокруг', 'Сделало буквы жирными и крупнее'],
      ok: 'Отлично! bg — background, то есть фон. bg-warning делает жёлтым фон, а буквы остаются своего цвета.', hint: 'Посмотрите на страницу: где жёлтый — в буквах или за ними? Сокращением какого слова является bg?', alt: 'Абзац с жёлтым фоном и его код' },
    en: { ctx: 'The paragraph got bg-warning.', q: 'What did this word change in the paragraph?', opts: ['It painted the letters yellow', 'It made the background yellow', 'It drew a yellow border around it', 'It made the letters bold and bigger'],
      ok: 'Great! bg stands for background. bg-warning makes the background yellow, and the letters keep their color.', hint: 'Look at the page: where is the yellow — in the letters or behind them? What word is bg short for?', alt: 'A paragraph with a yellow background and its code' } },
  { id: 'bootstrap-02t5', target: 'bootstrap-02', ptype: 'Bootstrap', tag: 'btn-outline', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<button class="btn-solid theme-primary">${b2Btn(T)}</button>\n<button class="___">${b2More(T)}</button>`} html={`<button class="btn-solid theme-primary">${b2Btn(T)}</button> <button class="btn-outline theme-primary">${b2More(T)}</button>`} bs={BS_CSS} mark={[2]} />; },
    uz: { ctx: "Ikkinchi tugma o'ngdagidek bo'lishi kerak: faqat ko'k chegara, ichi oq.", q: "Bo'sh joyga nima yoziladi?", opts: ['btn-outline-primary', 'btn-solid theme-outline', 'btn-solid theme-light', 'btn-outline theme-primary'],
      ok: "To'ppa-to'g'ri! Uslubni btn-outline beradi, rangni theme-primary. Rang o'sha-o'sha, faqat uslub almashdi.", hint: "Birinchi tugmaga qarang: ikki so'z — uslub va rang. Rang o'sha ko'k. Faqat qaysi so'zni almashtirish kerak?", alt: "Ichi to'la va chegarali ikki tugma" },
    ru: { ctx: 'Вторая кнопка должна быть как справа: только синяя рамка, внутри белая.', q: 'Что пишется на пустое место?', opts: ['btn-outline-primary', 'btn-solid theme-outline', 'btn-solid theme-light', 'btn-outline theme-primary'],
      ok: 'Верно! Стиль даёт btn-outline, цвет — theme-primary. Цвет тот же, поменялся только стиль.', hint: 'Посмотрите на первую кнопку: два слова — стиль и цвет. Цвет тот же синий. Какое слово надо заменить?', alt: 'Залитая кнопка и кнопка с рамкой' },
    en: { ctx: 'The second button should look like the one on the right: only a blue border, white inside.', q: 'What goes in the empty spot?', opts: ['btn-outline-primary', 'btn-solid theme-outline', 'btn-solid theme-light', 'btn-outline theme-primary'],
      ok: 'Right! btn-outline gives the style, theme-primary gives the color. Same color, only the style changed.', hint: 'Look at the first button: two words, style and color. The color is the same blue. Which word must change?', alt: 'A filled button and an outlined button' } }
];
