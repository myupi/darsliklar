// =============================================================================
// ТЕСТЫ К УРОКУ 4 КУРСА HTML (сквозной номер; старый урок 2, часть 2) «Qalin va qiya matn» / «Жирный и наклонный текст» (27.11.2026) —
// 5 вопросов, по файлу на вопрос. Темы части: b — жирный, i — наклонный (действуют только на слово внутри), забытый </b> делает жирным
// всё дальше, верная запись тега вокруг слова (в части уже есть абзац p и заголовки из части 1).
// Прежние вопросы 02t3 (забытый </b>), 02t4 (i) + новые 3 (какое слово какое, одно слово жирным, какой код даёт страницу).
// Словарь урока: abzas, qalin, qiya. Апостроф — только ASCII «'». Верные ответы: A, B, C, D, C.
// =============================================================================
const SLUG = 'zagolovki-i-tekst';
const QS = [
  { id: 'html-02q2t1', target: 'html-02q2', ptype: 'HTML', tag: 'b-i', correct: 0,
    vis: (L) => { const T = aqL(L); return <WqVis code={`<body>\n  <p>${T("Bugun <b>juda</b> issiq <i>kun</i>!", 'Сегодня <b>очень</b> жарко <i>днём</i>!', 'It is <b>very</b> hot <i>today</i>!')}</p>\n</body>`} />; },
    uz: { ctx: "Kodda ikkita so'z teglar ichiga olingan.", q: "Brauzerda bu so'zlar qanday chiqadi?", opts: ["«juda» qalin, «kun» qiya", "«juda» qiya, «kun» qalin", "«juda» ham, «kun» ham qalin", "Butun gap ham qalin, ham qiya"],
      ok: "Zo'r! b so'zni qalin, i esa qiya qiladi. Har biri faqat o'z teglari orasidagi so'zga ta'sir qiladi.", hint: "Har bir so'z qaysi teg ichida turibdi? b va i harflari qaysi inglizcha so'zlardan olingan, eslab ko'ring.", alt: "Ikki so'zi teg ichiga olingan kod" },
    ru: { ctx: 'В коде два слова взяты в теги.', q: 'Как эти слова будут выглядеть в браузере?', opts: ['«очень» жирное, «днём» наклонное', '«очень» наклонное, «днём» жирное', 'Оба слова — и «очень», и «днём» — жирные', 'Весь текст и жирный, и наклонный'],
      ok: 'Здорово! b делает слово жирным, а i — наклонным. Каждый тег действует только на слово между своими тегами.', hint: 'В какой тег взято каждое слово? Вспомни, от каких английских слов взяты буквы b и i.', alt: 'Код с двумя словами в тегах' },
    en: { ctx: 'In the code two words are wrapped in tags.', q: 'How will these words look in the browser?', opts: ['“very” is bold, “today” is slanted', '“very” is slanted, “today” is bold', 'Both words, “very” and “today”, are bold', 'The whole sentence is bold and slanted'],
      ok: 'Nice! b makes a word bold and i makes it slanted. Each tag affects only the word between its own tags.', hint: 'Which tag is each word wrapped in? Remember which English words the letters b and i come from.', alt: 'Code with two words in tags' } },
  { id: 'html-02q2t2', target: 'html-02q2', ptype: 'HTML', tag: 'i', correct: 1, mono: true,
    vis: (L) => { const T = aqL(L); const s = T('Bugun juda', 'Сегодня очень', 'It is very'); const w = T('issiq', 'жарко', 'hot'); return <WqVis code={`<p>${s} <___>${w}</___>!</p>`} html={`<p>${s} <i>${w}</i>!</p>`} />; },
    uz: { ctx: "Brauzerda bitta so'z qiya bo'lib chiqdi.", q: "Bo'sh joylarga qaysi teg yozilgan?", opts: ['b', 'i', 'p', 'h1'],
      ok: "Juda zo'r! i tegi italic so'zidan olingan, ya'ni qiya degani. b esa so'zni qalin qiladi.", hint: "So'z qalinmi yoki qiyshaygan? Qaysi teg harflarni qiya qiladi?", alt: "Bitta so'zi qiya abzas" },
    ru: { ctx: 'В браузере одно слово стало наклонным.', q: 'Какой тег написан на пустых местах?', opts: ['b', 'i', 'p', 'h1'],
      ok: 'Отлично! Тег i — от слова italic, то есть курсив. А b делает слово жирным.', hint: 'Слово жирное или наклонное? Какой тег наклоняет буквы?', alt: 'Абзац с одним наклонным словом' },
    en: { ctx: 'In the browser one word turned slanted.', q: 'Which tag is written in the empty spots?', opts: ['b', 'i', 'p', 'h1'],
      ok: 'Great! The i tag comes from italic, meaning slanted. And b makes a word bold.', hint: 'Is the word bold or slanted? Which tag slants the letters?', alt: 'A paragraph with one slanted word' } },
  { id: 'html-02q2t3', target: 'html-02q2', ptype: 'HTML', tag: 'b', correct: 2,
    vis: (L) => <AqMsg who={L === 'ru' ? 'Друг' : L === 'en' ? 'Friend' : "Do'stim"} text={L === 'ru' ? '«Хочу, чтобы в абзаце жирным было только одно слово, а не весь текст. Как это сделать?»' : L === 'en' ? '“I want only one word in the paragraph to be bold, not the whole text. How do I do that?”' : "«Abzasda faqat bitta so'zni qalin qilmoqchiman, butun matnni emas. Qanday qilsam bo'ladi?»"} />,
    uz: { ctx: "Do'stingiz so'rayapti.", q: "Unga nima deb javob berasiz?", opts: ["Butun abzasni b tegi ichiga olish kerak", "Shu so'zni i tegi ichiga olish kerak", "Shu so'zni b tegi ichiga olish kerak", "Shu so'zni p tegi ichiga olish kerak"],
      ok: "Mukammal! b tegi faqat o'z ichidagi so'zni qalin qiladi. Qolgan matn oddiy bo'lib qoladi.", hint: "Teg faqat o'z ichidagi matnga ta'sir qiladi. Qalin qiluvchi teg qaysi edi?", alt: "Do'stning qalin so'z haqidagi xabari" },
    ru: { ctx: 'Друг спрашивает.', q: 'Что ты ему ответишь?', opts: ['Взять весь абзац целиком в тег b', 'Взять только это слово в тег i', 'Взять только это слово в тег b', 'Взять только это слово в тег p'],
      ok: 'Точно! Тег b делает жирным только то, что внутри него. Остальной текст остаётся обычным.', hint: 'Тег действует только на то, что внутри него. Какой тег делает текст жирным?', alt: 'Сообщение друга про жирное слово' },
    en: { ctx: 'A friend is asking.', q: 'What will you answer?', opts: ['Wrap the whole paragraph in a b tag', 'Wrap just that word in an i tag', 'Wrap just that word in a b tag', 'Wrap just that word in a p tag'],
      ok: 'Spot on! The b tag makes bold only what is inside it. The rest of the text stays normal.', hint: 'A tag affects only what is inside it. Which tag makes text bold?', alt: 'A friend’s message about a bold word' } },
  { id: 'html-02q2t4', target: 'html-02q2', ptype: 'HTML', tag: 'b', correct: 3, mono: true,
    vis: (L) => { const T = aqL(L); const a = `<p>${T('Bugun havo <b>issiq.', 'Сегодня <b>жарко.', 'Today it is <b>hot.')}</p>`; const b = `<p>${T('Biz parkka boramiz.', 'Мы идём в парк.', 'We are going to the park.')}</p>`; return <WqVis code={`<body>\n  ${a}\n  ${b}\n</body>`} mark={[2]} html={`${a}\n${b}`} />; },
    uz: { ctx: "Voy, ikkinchi abzas ham qalin bo'lib qolibdi!", q: "Kodda nima tushib qolibdi?", opts: ['</p>', '<p>', '<i>', '</b>'],
      ok: "Xuddi shunday! b tegi yopilmagan, shuning uchun brauzer keyingi hamma matnni qalin qilib ketdi.", hint: "Qalinlik qayerdan boshlanyapti-yu, qayerda tugashi kerak edi? Qaysi teg ochilgan, lekin yopilmagan?", alt: "Ikki abzasi ham qalin sahifa" },
    ru: { ctx: 'Ой, второй абзац тоже стал жирным!', q: 'Что потерялось в коде?', opts: ['</p>', '<p>', '<i>', '</b>'],
      ok: 'Именно! Тег b не закрыт, поэтому браузер сделал жирным весь текст дальше.', hint: 'Где жирный начинается и где должен был закончиться? Какой тег открыт, но не закрыт?', alt: 'Страница, где оба абзаца жирные' },
    en: { ctx: 'Oops, the second paragraph turned bold too!', q: 'What is missing in the code?', opts: ['</p>', '<p>', '<i>', '</b>'],
      ok: 'Exactly! The b tag isn’t closed, so the browser made all the following text bold.', hint: 'Where does the bold start, and where should it have ended? Which tag is opened but not closed?', alt: 'A page where both paragraphs are bold' } },
  { id: 'html-02q2t5', target: 'html-02q2', ptype: 'HTML', tag: 'b', correct: 2, mono: true,
    vis: (L) => { const T = aqL(L); return <WqVis html={`<p>${T('Mushuk <b>tez</b> yuguradi.', 'Кошка <b>быстро</b> бежит.', 'The cat runs <b>fast</b>.')}</p>`} />; },
    uz: { ctx: "Brauzerda bitta so'z qalin chiqdi.", q: "Qaysi kod shu sahifani yaratadi?", opts: ['<p>Mushuk <i>tez</i> yuguradi.</p>', '<p>Mushuk <b>tez<b/> yuguradi.</p>', '<p>Mushuk <b>tez</b> yuguradi.</p>', '<p><b>Mushuk tez</b> yuguradi.</p>'],
      ok: "Ha, shunday! Qalin bo'lishi kerak so'zning oldida <b>, orqasida esa qiya chiziqli </b> turadi.", hint: "Faqat bitta so'z qalin. Tegni qayerda ochib, qayerda yopish kerak?", alt: "Bitta so'zi qalin abzas" },
    ru: { ctx: 'В браузере одно слово жирное.', q: 'Какой код создаёт эту страницу?', opts: ['<p>Кошка <i>быстро</i> бежит.</p>', '<p>Кошка <b>быстро<b/> бежит.</p>', '<p>Кошка <b>быстро</b> бежит.</p>', '<p><b>Кошка быстро</b> бежит.</p>'],
      ok: 'Да, так! Перед нужным словом стоит <b>, а после него — </b> с косой чертой.', hint: 'Жирное только одно слово. Где нужно открыть тег, а где закрыть?', alt: 'Абзац с одним жирным словом' },
    en: { ctx: 'In the browser one word is bold.', q: 'Which code makes this page?', opts: ['<p>The cat runs <i>fast</i>.</p>', '<p>The cat runs <b>fast<b/>.</p>', '<p>The cat runs <b>fast</b>.</p>', '<p><b>The cat runs</b> fast.</p>'],
      ok: 'Yes, like that! <b> goes before the word, and </b> with a slash goes after it.', hint: 'Only one word is bold. Where should the tag open and where should it close?', alt: 'A paragraph with one bold word' } }
];
