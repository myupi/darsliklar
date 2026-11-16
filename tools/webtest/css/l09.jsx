// =============================================================================
// ТЕСТЫ К УРОКУ 9 КУРСА CSS «Как элементы ведут себя на странице» (16.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: div — на всю строку, span — рядом; width у строчного span не действует; inline-block — рядом и с
// размерами; display: none прячет элемент целиком; inlineblock без чёрточки не работает.
// Апостроф — только ASCII «'». Верные ответы стоят на разных местах. Картинка — WqVis (код и/или честная страница).
// =============================================================================
const SLUG = 'display';
const BOX9 = 'body{margin:0;padding:10px;font:700 16px Arial}div{background:#FED7AA;margin:4px 0;padding:4px 6px}span{background:#CCFBF1;padding:2px 4px}a{background:#FA4F28;color:#fff;text-decoration:none;padding:6px;margin-right:4px}';
const QS = [
  { id: 'css-09t1', target: 'css-09', ptype: 'CSS', tag: 'block-inline', correct: 1,
    vis: (L) => { const T = aqL(L); const a = T('Olma', 'Яблоко', 'Apple'); const b = T('Nok', 'Груша', 'Pear'); return <WqVis
      code={`<div>${a}</div>\n<div>${b}</div>\n<span>${a}</span>\n<span>${b}</span>`}
      html={`<div>${a}</div><div>${b}</div><span>${a}</span> <span>${b}</span>`} css={BOX9} />; },
    uz: { ctx: "Brauzer to'rtta tegni qanday joylashtirdi?", q: "Qaysi teglar yonma-yon turibdi?", opts: ['div teglari', 'span teglari', 'Ikkalasi ham', 'Hech biri'],
      ok: "To'ppa-to'g'ri! span — inline: matn ichida, yonma-yon turadi. div esa block: butun qatorni egallaydi.", hint: "Qaysi teglar har biri o'z qatorida, qaysilari bitta qatorda turibdi?", alt: "Ikkita div va ikkita span" },
    ru: { ctx: 'Как браузер расставил четыре тега?', q: 'Какие теги стоят рядом?', opts: ['Теги div', 'Теги span', 'И те, и другие', 'Никакие'],
      ok: 'Верно! span — inline: стоит в тексте, рядом. А div — block: занимает всю строку.', hint: 'Какие теги каждый на своей строке, а какие — на одной?', alt: 'Два div и два span' },
    en: { ctx: 'How did the browser place the four tags?', q: 'Which tags sit side by side?', opts: ['The div tags', 'The span tags', 'Both', 'Neither'],
      ok: 'Right! span is inline: it sits in the text, side by side. div is block: it takes the whole line.', hint: 'Which tags are each on their own line, and which share one line?', alt: 'Two divs and two spans' } },
  { id: 'css-09t2', target: 'css-09', ptype: 'CSS', tag: 'inline-width', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`span {\n  width: 200px;\n}`} mark={[2]}
      html={`<p>${T('Mening', 'Мой', 'My')} <span>${T('mushugim', 'кот', 'cat')}</span> ${T('uxlayapti.', 'спит.', 'is asleep.')}</p>`} css={BOX9 + 'p{margin:0}span{width:200px}'} />; },
    uz: { ctx: "span kengligi 200 piksel bo'lishi kerak edi, lekin u o'zgarmadi.", q: "Nimaga width ishlamadi?", opts: ["span — inline, unga width ta'sir qilmaydi", '200px juda kichik qiymat', 'span tegida rang berilmagan', "Qoidada nuqtali vergul ortiqcha"],
      ok: "Qoyil! Matn ichidagi inline elementga width va height ta'sir qilmaydi. Buning uchun inline-block kerak.", hint: "span qanday element: butun qatorni egallaydimi yoki matn ichida turadimi? Bunday elementlarga o'lcham berib bo'ladimi?", alt: "Abzas ichidagi span" },
    ru: { ctx: 'span должен был стать шириной 200 пикселей, но не изменился.', q: 'Почему width не сработал?', opts: ['span — inline, width на него не действует', '200px — слишком маленькое значение', 'У тега span нет цвета', 'В правиле лишняя точка с запятой'],
      ok: 'Здорово! На строчный элемент в тексте width и height не действуют. Для этого нужен inline-block.', hint: 'Какой элемент span: на всю строку или внутри текста? Можно ли таким задать размер?', alt: 'span внутри абзаца' },
    en: { ctx: 'The span was meant to be 200 pixels wide, but it didn’t change.', q: 'Why didn’t width work?', opts: ['span is inline, width doesn’t affect it', '200px is too small a value', 'The span tag has no colour', 'The rule has an extra semicolon'],
      ok: 'Nice work! width and height don’t affect an inline element in text. You need inline-block for that.', hint: 'What kind of element is span: a whole line or inside text? Can you size that kind?', alt: 'A span inside a paragraph' } },
  { id: 'css-09t3', target: 'css-09', ptype: 'CSS', tag: 'inline-block', correct: 2, mono: true,
    vis: () => <WqVis file="style.css" code={`a {\n  display: ___;\n  width: 110px;\n}`} mark={[2]} />,
    uz: { ctx: "Menyu havolalari yonma-yon tursin va har biri 110 piksel bo'lsin.", q: "Bo'sh joyga nima yoziladi?", opts: ['block', 'inline', 'inline-block', 'none'],
      ok: "Xuddi shunday! inline-block yonma-yon qoldiradi va o'lcham berishga ruxsat beradi.", hint: "block havolalarni ustma-ust qo'yadi, inline esa o'lchamni qabul qilmaydi. Ikkisining yaxshi tomonini qaysi qiymat oladi?", alt: "Bo'sh joyli havola qoidasi" },
    ru: { ctx: 'Ссылки меню должны стоять рядом, и каждая — шириной 110 пикселей.', q: 'Что написать на пустое место?', opts: ['block', 'inline', 'inline-block', 'none'],
      ok: 'Именно! inline-block оставляет рядом и разрешает задать размер.', hint: 'block ставит ссылки друг под другом, а inline не принимает размер. Какое значение берёт лучшее от обоих?', alt: 'Правило ссылок с пустым местом' },
    en: { ctx: 'The menu links must sit side by side, each 110 pixels wide.', q: 'What goes in the empty spot?', opts: ['block', 'inline', 'inline-block', 'none'],
      ok: 'Exactly! inline-block keeps them side by side and lets you set a size.', hint: 'block stacks the links, and inline ignores the size. Which value takes the best of both?', alt: 'A link rule with an empty spot' } },
  { id: 'css-09t4', target: 'css-09', ptype: 'CSS', tag: 'none', correct: 3,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<style>\n  .reklama { display: none; }\n</style>\n<p>${T('Yangiliklar', 'Новости', 'News')}</p>\n<p class="reklama">${T('Reklama', 'Реклама', 'Advert')}</p>\n<p>${T('Ob-havo', 'Погода', 'Weather')}</p>`} mark={[2]} />; },
    uz: { ctx: "Sahifada uchta abzas bor, ikkinchisiga display: none berilgan.", q: "Brauzer ikkinchi abzas bilan nima qiladi?", opts: ['Shaffof qiladi, joyi bo\'sh qoladi', 'Chapga surib qo\'yadi', 'Yangi qatorga o\'tkazadi', 'Butunlay yashiradi'],
      ok: "Juda zo'r! display: none elementni butunlay yashiradi: qo'shnilar uning joyini egallaydi.", hint: "none so'zi «hech qanday» degani. Element ko'rinadimi, joyi qoladimi?", alt: "Uchta abzasli kod" },
    ru: { ctx: 'На странице три абзаца, второму дали display: none.', q: 'Что браузер сделает со вторым абзацем?', opts: ['Сделает прозрачным, место останется', 'Сдвинет влево', 'Перенесёт на новую строку', 'Спрячет целиком'],
      ok: 'Отлично! display: none прячет элемент целиком: соседи занимают его место.', hint: 'Слово none значит «никакой». Виден ли элемент, остаётся ли его место?', alt: 'Код с тремя абзацами' },
    en: { ctx: 'The page has three paragraphs; the second has display: none.', q: 'What will the browser do with the second paragraph?', opts: ['Make it see-through, its space stays', 'Move it to the left', 'Move it to a new line', 'Hide it completely'],
      ok: 'Great! display: none hides the element completely: its neighbours take its place.', hint: 'none means “no kind at all”. Is the element visible? Does its space remain?', alt: 'Code with three paragraphs' } },
  { id: 'css-09t5', target: 'css-09', ptype: 'CSS', tag: 'debug', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis file="style.css" code={`a {\n  display: inlineblock;\n  width: 100px;\n}`} mark={[2]}
      html={`<a>${T('Bosh sahifa', 'Главная', 'Home')}</a><a>${T('Aloqa', 'Контакты', 'Contact')}</a>`} css={BOX9 + 'a{display:inlineblock;width:100px}'} />; },
    uz: { ctx: "Havolalar 100 piksel bo'lmadi: qoida ishlamayapti.", q: "Qiymatni qanday tuzatamiz?", opts: ['inline block', 'inline-block', 'inline_block', 'inlineBlock'],
      ok: "To'ppa-to'g'ri! inline va block o'rtasida chiziqcha bo'ladi: inline-block.", hint: "Darsdagi qiymatni eslang: ikki so'z bor edi, ular nima bilan ulangan edi?", alt: "Kichkina havolalar va kod" },
    ru: { ctx: 'Ссылки не стали по 100 пикселей: правило не работает.', q: 'Как исправить значение?', opts: ['inline block', 'inline-block', 'inline_block', 'inlineBlock'],
      ok: 'Верно! Между inline и block стоит чёрточка: inline-block.', hint: 'Вспомни значение с урока: там два слова. Чем они соединены?', alt: 'Маленькие ссылки и код' },
    en: { ctx: 'The links didn’t become 100 pixels wide: the rule doesn’t work.', q: 'How do we fix the value?', opts: ['inline block', 'inline-block', 'inline_block', 'inlineBlock'],
      ok: 'Right! There’s a hyphen between inline and block: inline-block.', hint: 'Remember the value from the lesson: two words. What joins them?', alt: 'Small links and code' } }
];
