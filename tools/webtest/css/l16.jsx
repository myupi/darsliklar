// =============================================================================
// ТЕСТЫ К УРОКУ 16 КУРСА CSS «Адаптивность» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: 100% — во всю ширину окна; max-width работает и на самой границе; спрятать в @media — display: none;
// min-width — наоборот (для широких окон); @media выше обычного правила проигрывает ему.
// @media честный: ширина страницы vw (360 — телефон, 800 — компьютер). Апостроф — только ASCII «'».
// Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'adaptivnost';
const C16_BASE = '.banner { padding: 12px 14px; box-sizing: border-box; border-radius: 10px; background: #FA4F28; color: #fff; font-weight: bold; } .qator { display: flex; gap: 10px; margin-top: 10px; } .karta { flex: 1; padding: 16px 0; border-radius: 10px; background: #EDE9FE; text-align: center; font-weight: bold; }';
const c16Page = (T) => `<div class="banner">${T("Yangi o'yin chiqdi! Hoziroq yuklab oling va do'stlaringizni chaqiring.", 'Вышла новая игра! Скачай прямо сейчас и позови друзей.', 'A new game is out! Download it now and invite your friends.')}</div><div class="qator"><div class="karta">1</div><div class="karta">2</div><div class="karta">3</div></div>`;
const QS = [
  { id: 'css-16t1', target: 'css-16', ptype: 'CSS', tag: 'percent', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`.banner {\n  width: 700px;\n}`} mark={[2]} vw={360}
      html={c16Page(T)} css={C16_BASE + ' .banner { width: 700px; }'} />; },
    uz: { ctx: "Telefonda banner oynaga sig'madi.", q: "Har qanday oynada eniga teng bo'lishi uchun qaysi qiymat kerak?", opts: ['700px', '100%', '360px', '100px'],
      ok: "To'ppa-to'g'ri! 100% oynaning butun eni degani: telefonda ham, kompyuterda ham banner sig'adi.", hint: "px har doim bir xil bo'ladi. Qaysi qiymat oynaning eniga qarab o'zgaradi?", alt: "Telefonda sig'magan banner" },
    ru: { ctx: 'На телефоне баннер не влез в окно.', q: 'Какое значение сделает его шириной в окно на любом экране?', opts: ['700px', '100%', '360px', '100px'],
      ok: 'Верно! 100% — это вся ширина окна: баннер влезет и на телефоне, и на компьютере.', hint: 'px всегда одинаковые. Какое значение меняется вместе с шириной окна?', alt: 'Баннер, который не влез на телефоне' },
    en: { ctx: 'On the phone, the banner doesn’t fit the window.', q: 'Which value makes it window-wide on any screen?', opts: ['700px', '100%', '360px', '100px'],
      ok: 'Right! 100% means the whole window width: the banner fits both on a phone and on a computer.', hint: 'px are always the same. Which value changes with the window width?', alt: 'A banner that doesn’t fit on a phone' } },
  { id: 'css-16t2', target: 'css-16', ptype: 'CSS', tag: 'max-width', correct: 1,
    vis: () => <WqVis file="style.css" code={`@media (max-width: 600px) {\n  .qator {\n    flex-direction: column;\n  }\n}`} mark={[1]} />,
    uz: { ctx: "Oyna eni roppa-rosa 600px.", q: "Kartochkalar qanday turadi?", opts: ["Qatorda, chunki 600 dan kichik emas", "Ustun bo'lib, chunki teng bo'lsa ham ishlaydi", "Umuman ko'rinmaydi", 'Yarmi qatorda, yarmi ustunda'],
      ok: "Qoyil! max-width oyna shu sondan katta bo'lmaganda ishlaydi. Teng bo'lsa ham ishlaydi.", hint: "max-width: 600px bu «600 dan katta bo'lmasa» degani. 600 o'zi 600 dan kattami?", alt: "max-width: 600px shartli @media" },
    ru: { ctx: 'Ширина окна — ровно 600px.', q: 'Как встанут карточки?', opts: ['В ряд, ведь 600 не меньше 600', 'Столбиком: на границе тоже работает', 'Их совсем не будет видно', 'Половина в ряд, половина столбиком'],
      ok: 'Здорово! max-width работает, когда окно не шире этого числа. Если равно — тоже работает.', hint: 'max-width: 600px — это «не больше 600». Больше ли 600, чем 600?', alt: '@media с условием max-width: 600px' },
    en: { ctx: 'The window is exactly 600px wide.', q: 'How will the cards line up?', opts: ['In a row, since 600 isn’t less than 600', 'In a column: it works at the limit too', 'They won’t be visible at all', 'Half in a row, half in a column'],
      ok: 'Nice work! max-width works when the window is no wider than the number. Equal works too.', hint: 'max-width: 600px means “not more than 600”. Is 600 more than 600?', alt: '@media with the condition max-width: 600px' } },
  { id: 'css-16t3', target: 'css-16', ptype: 'CSS', tag: 'display-none', correct: 2, mono: true,
    vis: () => <WqVis file="style.css" code={`@media (max-width: 600px) {\n  .banner {\n    display: ___;\n  }\n}`} mark={[3]} />,
    uz: { ctx: "Telefonda banner yashirinsin, kompyuterda esa joyida qolsin.", q: "Bo'sh joyga nima yoziladi?", opts: ['block', 'hidden', 'none', '0px'],
      ok: "Xuddi shunday! display: none bannerni yashiradi, @media esa buni faqat tor oynalarda qiladi.", hint: "Qaysi display qiymati elementni umuman ko'rsatmaydi? Uni oldin o'rganganmiz.", alt: "display qiymati bo'sh @media" },
    ru: { ctx: 'На телефоне баннер должен спрятаться, а на компьютере — остаться.', q: 'Что пишется на пустое место?', opts: ['block', 'hidden', 'none', '0px'],
      ok: 'Именно! display: none прячет баннер, а @media делает это только в узких окнах.', hint: 'Какое значение display совсем не показывает элемент? Мы его уже проходили.', alt: '@media с пустым значением display' },
    en: { ctx: 'On a phone the banner should hide, but stay on a computer.', q: 'What goes in the empty spot?', opts: ['block', 'hidden', 'none', '0px'],
      ok: 'Exactly! display: none hides the banner, and @media does it only in narrow windows.', hint: 'Which display value doesn’t show the element at all? We learned it earlier.', alt: '@media with an empty display value' } },
  { id: 'css-16t4', target: 'css-16', ptype: 'CSS', tag: 'min-width', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`@media (min-width: 600px) {\n  .qator {\n    flex-direction: column;\n  }\n}`} mark={[1]} vw={800}
      html={c16Page(T)} css={C16_BASE + ' @media (min-width: 600px) { .qator { flex-direction: column; } }'} />; },
    uz: { ctx: "Kartochkalar telefonda ustun bo'lishi kerak edi, lekin kompyuterda ustun bo'lib qoldi.", q: "Nima buzilib qolibdi?", opts: ["600px o'rniga 600 yozish kerak", 'Qavslar ortiqcha', 'flex-direction ishlamaydi', "min-width o'rniga max-width kerak"],
      ok: "Juda zo'r! min-width keng oynalarda ishlaydi, tor oyna uchun esa max-width kerak.", hint: "Sahifa kompyuterda, 800px. Shart «kamida 600» deyapti. Bizga «ko'pi bilan 600» kerak edi.", alt: "Kompyuterda ustun bo'lib qolgan kartochkalar" },
    ru: { ctx: 'Карточки должны были встать столбиком на телефоне, а встали на компьютере.', q: 'Что сломалось?', opts: ['Вместо 600px нужно 600', 'Скобки лишние', 'flex-direction не работает', 'Вместо min-width нужен max-width'],
      ok: 'Отлично! min-width работает в широких окнах, а для узких нужен max-width.', hint: 'Страница на компьютере, 800px. Условие говорит «не меньше 600». А нам нужно было «не больше 600».', alt: 'Карточки столбиком на компьютере' },
    en: { ctx: 'Cards should stack on a phone, but they stacked on a computer.', q: 'What broke?', opts: ['Write 600, not 600px', 'The brackets are extra', 'flex-direction is broken', 'Use max-width, not min-width'],
      ok: 'Great! min-width works in wide windows; narrow ones need max-width.', hint: 'The page is on a computer, 800px. The condition says “at least 600”. We needed “at most 600”.', alt: 'Cards in a column on a computer' } },
  { id: 'css-16t5', target: 'css-16', ptype: 'CSS', tag: 'order', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`@media (max-width: 600px) {\n  .banner { width: 100%; }\n}\n.banner { width: 700px; }`} mark={[4]} vw={360}
      html={c16Page(T)} css={C16_BASE + ' @media (max-width: 600px) { .banner { width: 100%; } } .banner { width: 700px; }'} />; },
    uz: { ctx: "Telefonda baribir banner 700px bo'lib, sig'may qoldi.", q: "Nimaga?", opts: ["@media tepada: pastdagi qoida uni bosib ketdi", '100% telefonda ishlamaydi', "max-width o'rniga min-width kerak", 'Qavslar ortiqcha'],
      ok: "To'ppa-to'g'ri! Kuchi teng qoidalardan pastdagisi g'olib bo'ladi. @media ni oddiy qoidadan keyin yozish kerak.", hint: "Ikki qoida bir xil xususiyatni o'zgartiryapti. Qaysi biri pastda turibdi? Pastdagisi g'olib bo'ladi.", alt: "Telefonda sig'magan banner" },
    ru: { ctx: 'На телефоне баннер всё равно 700px и не влезает.', q: 'Почему?', opts: ['@media стоит выше: нижнее правило его перебило', '100% не работает на телефоне', 'Вместо max-width нужен min-width', 'Скобки лишние'],
      ok: 'Верно! Из равных по силе правил побеждает нижнее. @media пишут после обычного правила.', hint: 'Два правила меняют одно и то же свойство. Какое из них стоит ниже? Нижнее побеждает.', alt: 'Баннер, который не влез на телефоне' },
    en: { ctx: 'On the phone the banner is still 700px and doesn’t fit.', q: 'Why?', opts: ['@media is on top: the rule below overrode it', '100% doesn’t work on phones', 'min-width is needed instead of max-width', 'The brackets are extra'],
      ok: 'Right! Of two equally strong rules, the lower one wins. @media goes after the normal rule.', hint: 'Two rules change the same property. Which one is lower? The lower one wins.', alt: 'A banner that doesn’t fit on a phone' } }
];
