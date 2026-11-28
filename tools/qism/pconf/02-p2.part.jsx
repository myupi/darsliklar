// Практика 2 «Газета Коди», ЧАСТЬ 2: b, i и своя статья (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Выделить»: в объявлении слова становятся жирным и наклонным), два новых задания по темам части 2
// урока (т1 сделать слова жирными — b в готовом абзаце, т2 смесь — слово наклонным i и слово жирным b), прежнее «найди
// и закрой незакрытый b» (т3, бывшее т4: погода) и прежнее «своя статья» (т4, бывшее т5). Вывод — прежний Fin с
// четырьмя вкладками (индексы вкладок правит build-prac: погода TABS[2], статья TABS[3]).

// ── Карта части 2: четыре страницы (вкладки): E'lonlar, Kitoblar, Ob-havo (прежняя), Mening maqolam (прежняя). ──
Object.assign(A2_ICO, {
  bell: <><path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
  book: <><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h11" /></>
});
const TAB_WEATHER = TABS[3];
const TAB_MINE = TABS[4];
TABS.splice(0, TABS.length,
  { id: 'news', ico: 'bell', c: '#FA4F28', name: L3("E'lonlar", 'Объявления', 'Notices') },
  { id: 'books', ico: 'book', c: '#7C5CFA', name: L3("Kitoblar", 'Книги', 'Books') },
  TAB_WEATHER,
  TAB_MINE
);
// Содержимое заданий, дополнительных задач, образцов и хука. t — полный текст абзаца, b / i — слова, которые нужно выделить.
const XTRA2 = {
  n1: { t: L3("Ertaga uchrashuv soat o'nda boshlanadi.", 'Завтра встреча начнётся в десять часов.', 'Tomorrow the meeting starts at ten o’clock.'),
    b: L3("soat o'nda", 'в десять часов', 'at ten o’clock') },
  n1d: { t: L3("Dars soat to'qqizda boshlanadi.", 'Урок начнётся в девять часов.', 'The class starts at nine o’clock.'),
    b: L3("soat to'qqizda", 'в девять часов', 'at nine o’clock') },
  n1s: { pre: L3("Bayram ", 'Праздник начнётся ', 'The party starts '), b: L3("ertaga", 'завтра', 'tomorrow'), post: L3(" boshlanadi.", '.', '.') },
  n2: { t: L3("Men Robotlar kitobini o'qidim, u juda qiziq!", 'Я прочитал книгу Роботы, она очень интересная!', 'I read the book Robots, and it’s really interesting!'),
    i: L3("Robotlar", 'Роботы', 'Robots'), b: L3("juda", 'очень', 'really') },
  n2d: { t: L3("Menga Alisa kitobi juda yoqdi.", 'Мне очень понравилась книга Алиса.', 'I really liked the book Alice.'),
    i: L3("Alisa", 'Алиса', 'Alice'), b: L3("juda", 'очень', 'really') },
  n2s: { pre: L3("Sevimli o'yinim ", 'Моя любимая игра ', 'My favourite game is '), i: L3("Minecraft", 'Minecraft', 'Minecraft'),
    mid: L3(", u ", ', она ', ', and it’s '), b: L3("juda", 'очень', 'really'), post: L3(" qiziq!", ' интересная!', ' fun!') },
  hook: {
    p1: { pre: L3("Ertaga matematikadan ", 'Завтра будет ', 'Tomorrow there is a maths '), b: L3("imtihon", 'экзамен', 'exam'), post: L3(" bo'ladi.", ' по математике.', '.') },
    p2: { pre: L3("O'z ", 'Не забудьте ', 'Bring your own '), i: L3("ruchkangizni", 'свою ручку', 'pen'), post: L3(" unutmang!", '!', '!') }
  }
};

Object.assign(UI, {
  highlight: L3("Ajratish", 'Выделить', 'Highlight'),
  bold: L3("qalin", 'жирный', 'bold'),
  slant: L3("qiya", 'наклонный', 'slanted')
});

// ── Фразы проверки новых заданий. В {got} — слова ученика (в невидимых метках), {want} — нужные слова из задания. ──
Object.assign(FB, {
  needBold: L3("Hozircha qalin so'z yo'q. Kerakli so'zlarni ochuvchi va yopuvchi b teglarining o'rtasiga oling.", 'Пока нет ни одного жирного слова. Возьми нужные слова между открывающим и закрывающим b.', 'There’s no bold word yet. Put the right words between the opening and closing b.'),
  needItalic: L3("Qiya so'z hali yo'q. Kerakli so'zni ochuvchi va yopuvchi i teglarining o'rtasiga oling.", 'Наклонного слова пока нет. Возьми нужное слово между открывающим и закрывающим i.', 'There’s no slanted word yet. Put the right word between the opening and closing i.'),
  needBoth: L3("Hech narsa ajratilmagan. So'zlarni teglarning o'rtasiga oling: qalin uchun b, qiya uchun i.", 'Пока ничего не выделено. Возьми слова между тегами: для жирного b, для наклонного i.', 'Nothing stands out yet. Put the words between tags: b for bold, i for slanted.'),
  wrongTagB: L3("Qiya yozuvni i tegi yasaydi, bizga esa qalin so'z kerak. Qalinni b tegi yasaydi.", 'Тег i делает слово наклонным, а нужно жирное. Жирным слово делает b.', 'The i tag slants a word, but we need a bold one. The b tag makes it bold.'),
  noItalic: L3("Bu yerda qiya so'z kerak emas, faqat qalin yozuv kerak. Uni b tegi yasaydi.", 'Здесь наклонное слово не нужно: только жирное, то есть b.', 'We don’t need a slanted word here: just a bold one, that is, b.'),
  swapTags: L3("Teglar o'rin almashibdi: qalin qiladigan teg b, qiya qiladigan teg esa i.", 'Теги поменялись местами: жирным делает b, а наклонным i.', 'The tags got swapped: b makes bold, and i makes slanted.'),
  boldWrong: L3("Qalin bo'lgan so'z boshqa chiqdi: ⁣«{got}»⁤. Bizga «{want}» kerak.", 'Жирным вышло другое: ⁣«{got}»⁤. А нужно «{want}».', 'The bold part is different: ⁣“{got}”⁤. We need “{want}”.'),
  italWrong: L3("Qiya bo'lgan so'z boshqa chiqdi: ⁣«{got}»⁤. Bizga «{want}» kerak.", 'Наклонным вышло другое: ⁣«{got}»⁤. А нужно «{want}».', 'The slanted part is different: ⁣“{got}”⁤. We need “{want}”.'),
  keepText: L3("So'zlarga va ularning orasidagi bo'sh joylarga tegmang, gap o'sha-o'sha qolsin. Faqat teglarni qo'shing.", 'Слова и пробелы между ними не трогай, пусть фраза останется прежней. Нужно только добавить теги.', 'Don’t touch the words or the spaces between them, keep the sentence as it was. Just add the tags.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
const OLD_T4 = C.t4;
const OLD_T5 = C.t5;
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! O'tgan amaliyotda gazetaning to'rtta sahifasida sarlavhalar bilan abzaslarni tuzatdik. Yana to'rttasi qoldi: e'lonlar, kitoblar, ob-havo va sizning maqolangiz. Lekin oldin bir e'longa qarang: ertaga nima bo'lishini bir qarashda topa olasizmi? Hamma so'z bir xil ko'rinadi-ku. «Ajratish»ni bosing, ko'ramiz.",
      'Привет! В прошлой практике мы навели порядок с заголовками и абзацами на четырёх страницах газеты. Осталось ещё четыре: объявления, книги, погода и твоя статья. Но сначала посмотри на это объявление: можешь с одного взгляда сказать, что будет завтра? Все слова выглядят одинаково. Нажми «Выделить», посмотрим.',
      'Hi! In the last practice we put headings and paragraphs in order on four pages of the paper. Four more are waiting: notices, books, weather and your article. But first look at this notice: can you tell at a glance what happens tomorrow? All the words look the same. Tap “Highlight” and let’s see.'),
    broke: L3("Ko'rdingizmi? Endi «imtihon» so'zi darrov ko'zga tashlanyapti, chunki u qalin yozildi. «ruchkangizni» so'zi esa qiya bo'lib turibdi. Kodga ham qarang: so'zlarni yangi teglar o'rab oldi!",
      'Видишь? Теперь слово «экзамен» сразу бросается в глаза, потому что оно жирное. А слова «свою ручку» стали наклонными. Посмотри и на код: слова обняли новые теги!',
      'See? Now the word “exam” catches your eye right away, because it’s bold. And the word “pen” is slanted. Look at the code too: new tags wrapped around the words!'),
    done: L3("Qalin qilish uchun b tegi bor, qiya qilish uchun esa i tegi. Bugun shu ikki tegni o'zimiz yozamiz. Ob-havo sahifasida esa qalinlik hamma matnga yoyilib ketgan, uni birga tuzatamiz. Oxirida esa o'z maqolangizni yozasiz.",
      'Жирным слово делает тег b, а наклонным тег i. Сегодня эти два тега мы напишем сами. На странице погоды жирный расползся на весь текст, его мы починим вместе. А в конце ты напишешь свою статью.',
      'The b tag makes a word bold and the i tag slants it. Today we’ll write these two tags ourselves. On the weather page the bold spread over the whole text, and we’ll fix that together. And at the end you’ll write your own article.'),
    ask: L3("«Ajratish»ni bosing", 'Нажми «Выделить»', 'Tap “Highlight”'),
    askDone: L3("So'zlarni b va i teglari ajratdi", 'Слова выделили теги b и i', 'Tags b and i made the words stand out')
  },
  t1: {
    eyebrow: L3("E'lonlar", 'Объявления', 'Notices'),
    say: L3("E'lonlar sahifasidan boshlaymiz. Matn bor, lekin hammasi bir xil, hech narsa ko'zga tashlanmayapti. Uchrashuvning vaqti eng muhim, shuning uchun uni qalin qilamiz. Qalin qilish uchun b tegi kerak: so'zlardan oldin ochuvchi b, keyin esa yopuvchi b. «soat o'nda» so'zlarini qalin qiling.",
      'Начнём с объявлений. Текст есть, но он весь одинаковый, и ничего не бросается в глаза. Время встречи самое важное, поэтому сделаем его жирным. Жирным слово делает тег b: перед словами открывающий b, после них закрывающий b. Сделай слова «в десять часов» жирными.',
      'Let’s start with the notices. The text is there, but it all looks the same, and nothing catches the eye. The time of the meeting is the most important, so let’s make it bold. The b tag makes words bold: an opening b before the words and a closing b after them. Make the words “at ten o’clock” bold.'),
    ask: L3("«soat o'nda» so'zlarini qalin qiling", 'Сделай слова «в десять часов» жирными', 'Make the words “at ten o’clock” bold'),
    ok: L3("Mana, vaqt endi darrov ko'zga tashlanyapti! Qalin faqat kerakli so'zlar, qolgan matn esa oddiyligicha qoldi.",
      'Вот это да! Теперь время сразу бросается в глаза. Жирными стали только нужные слова, остальной текст обычный.',
      'Wow! Now the time catches your eye right away. Only the right words are bold, and the rest of the text stayed normal.'),
    hints: [
      L3("Qaysi teg so'zni qalin qilardi, esingizdami? U inglizcha bold so'zining bosh harfi.", 'Помнишь, какой тег делает слово жирным? Это первая буква английского bold.', 'Remember which tag makes a word bold? It’s the first letter of the English word bold.'),
      L3("So'zlarning oldiga ochuvchi b tegini, keyin esa yopuvchi b tegini qo'ying. Yopuvchi tegda qiya chiziq ham bor.", 'Поставь открывающий b перед словами, а закрывающий b после них. В закрывающем есть косая черта.', 'Put the opening b before the words and the closing b after them. The closing one has a slash.'),
      L3("Mana qalin so'z qanday yoziladi: u ikkita b tegining o'rtasida turadi. Sizning so'zlaringiz ham shunday turishi kerak.", 'Вот как пишут жирное слово: оно стоит между двумя тегами b. Так и твои слова должны стоять.', 'Here’s how a bold word is written: it sits between two b tags. Your words should sit that way too.')
    ],
    drill: L3("Endi boshqa e'lon: «soat to'qqizda» so'zlarini qalin qiling", 'Теперь другое объявление: сделай «в девять часов» жирным', 'Now another notice: make “at nine o’clock” bold')
  },
  t2: {
    eyebrow: L3("Kitoblar", 'Книги', 'Books'),
    say: L3("Endi kitoblar sahifasi. Bu yerda ikkita narsani ajratish kerak: kitobning nomi qiya bo'lsin, «juda» so'zi esa qalin. Qiya yozuvni i tegi yasaydi, qalinni esa b tegi. Har bir so'zni o'z tegiga soling, har bir teg ochilib, yopilishi kerak. «Robotlar» so'zini qiya, «juda» so'zini qalin qiling.",
      'Теперь страница книг. Здесь нужно выделить две вещи: название книги пусть будет наклонным, а слово «очень» жирным. Наклонным слово делает тег i, жирным тег b. Каждое слово ставь в свой тег, и каждый тег нужно открыть и закрыть. Сделай слово «Роботы» наклонным, а слово «очень» жирным.',
      'Now the books page. Two things need to stand out here: let the book title be slanted and the word “really” bold. The i tag slants a word and the b tag makes it bold. Put each word into its own tag, and every tag has to be opened and closed. Make the word “Robots” slanted and the word “really” bold.'),
    ask: L3("«Robotlar» so'zini qiya, «juda» so'zini qalin qiling", 'Сделай «Роботы» наклонным, а «очень» жирным', 'Make “Robots” slanted and “really” bold'),
    ok: L3("Ikkala teg ham o'z joyida! Kitobning nomi qiya, «juda» so'zi esa qalin chiqdi.",
      'Отлично! Название книги наклонное, а слово «очень» жирное. Оба тега стоят на своих местах.',
      'Great! The book title is slanted and the word “really” is bold. Both tags are in their places.'),
    hints: [
      L3("Qaysi teg qalin qiladi, qaysi biri qiya qiladi? Esingizdami: b bold uchun, i esa italic uchun.", 'Какой тег делает жирным, а какой наклонным? Помнишь: b от bold, а i от italic.', 'Which tag makes bold and which slants? Remember: b is from bold, and i is from italic.'),
      L3("Kitobning nomini i teglarining o'rtasiga oling, «juda» so'zini esa b teglarining o'rtasiga. Har birining yopuvchi tegida qiya chiziq bor.", 'Название книги возьми между тегами i, а слово «очень» между тегами b. В каждом закрывающем есть косая черта.', 'Put the book title between the i tags and the word “really” between the b tags. Each closing tag has a slash.'),
      L3("Mana shunday: qiya so'z ikkita i tegining o'rtasida, qalin so'z ikkita b tegining o'rtasida turadi. Sizning gapingizda ham so'zlar shunday turishi kerak.", 'Вот так: наклонное слово стоит между двумя i, а жирное между двумя b. В твоей фразе слова тоже должны стоять так.', 'Like this: the slanted word sits between two i tags and the bold word between two b tags. The words in your sentence should sit that way too.')
    ],
    drill: L3("Yana bir kitob: «Alisa» so'zini qiya, «juda» so'zini qalin qiling", 'Ещё одна книга: сделай «Алиса» наклонным, а «очень» жирным', 'One more book: make “Alice” slanted and “really” bold')
  }
});
// Т3 · Ob-havo — прежнее «найди и закрой незакрытый b» (тексты разбора и подсказок — прежние), своя первая реплика.
C.t3 = Object.assign({}, OLD_T4, {
  say: L3("Ikkita e'lon tayyor! Endi ob-havo sahifasi. Voy, bunda boshqa muammo: hamma narsa qalin chiqyapti, bir sinfdoshim «Ko'zim og'ridi!» deb yozibdi. Faqat ikkita so'z qalin bo'lishi kerak edi, pastdagi hamma matn ham qalinlashib ketibdi. Qalinlik qaysi so'zdan boshlanganini ko'ryapsizmi? O'sha so'zlar turgan qatorni kodda topib, ustiga bosing.",
    'Два раздела готовы! Теперь погода. Тут другая беда: всё стало жирным, одноклассник даже написал «У меня глаза заболели!». Жирными должны быть только два слова, а жирным стал и весь текст ниже. Видишь, с какого слова начинается жирный? Найди строку с ними в коде и нажми на неё.',
    'Two pages are done! Now the weather. This one is a different mess: everything turned bold, and a classmate even wrote “My eyes hurt!”. Only two words were supposed to be bold, but all the text below turned bold too. Can you see which word the bold starts from? Find the line with them in the code and tap it.')
});
// Т4 · Mening maqolam — прежнее «своя статья», первая реплика — «третья вкладка горит, четвёртая пустая».
C.t4 = Object.assign({}, OLD_T5, {
  say: L3("Uchta sahifa yonib turibdi! Oxirgisi sizning maqolangiz. Hozircha unda faqat body bor. Maqola sarlavhadan boshlanadi, shuning uchun eng tepaga h1 tegida sarlavha yozing. Uning ostiga p tegida abzas qo'ying, ichidagi eng muhim so'zni esa b yoki i bilan ajrating. Nima haqida yozasiz, sevimli hayvoningiz, o'yiningiz yoki taomingiz haqidami? Tartibni chizma ko'rsatib turadi.",
    'Три страницы горят! Теперь последняя: твоя статья. Здесь есть только body. Внутри напиши статью сам. В самом верху заголовок в теге h1. Потом абзац в теге p. А самое важное слово в абзаце выдели тегом b или i. Тему выбирай сам: животное, игра или любимая еда. Схема подскажет дорогу.',
    'Three pages are lit! Now the last one: your article. There’s only body here. Write the article inside it yourself. At the very top, a heading in the h1 tag. Then a paragraph in the p tag. And mark the most important word in the paragraph with b or i. Pick the topic yourself: an animal, a game or your favourite food. The plan will show you the way.')
});
// Вывод части 2: четыре вкладки горят, открыта своя статья; плашки h1 · p · b и i · «своя статья».
Object.assign(C.fin, {
  say: [
    { k: 'all', text: L3("Qarang, gazetaning qolgan to'rtta sahifasi ham tayyor: e'lonlar, kitoblar, ob-havo va sizning maqolangiz. Endi gazetani chop etsa bo'ladi!",
      'Смотри, и остальные четыре страницы газеты готовы: объявления, книги, погода и твоя статья. Теперь газету можно печатать!',
      'Look, the other four pages of the paper are ready too: notices, books, weather and your article. Now the paper can go to print!') },
    { k: 'h', text: L3("Maqolangizning tepasida h1 tegidagi sarlavha turibdi.",
      'В твоей статье наверху стоит заголовок в h1.',
      'At the top of your article there’s a heading in h1.') },
    { k: 'p', text: L3("Uning ostida p tegidagi abzas turibdi.",
      'Под ним абзац в p.',
      'Under it there’s a paragraph in p.') },
    { k: 'bi', text: L3("Abzasdagi muhim so'zni b yoki i bilan ajratdingiz. E'londa vaqtni qalin, kitobning nomini esa qiya qilgan edingiz: so'z har safar ikkita tegning o'rtasida turdi.",
      'Важное слово в абзаце выделяют тегом b или i. В объявлении жирным стало время, а название книги — наклонным: слово каждый раз стояло между двумя тегами.',
      'You marked the important word in the paragraph with b or i. In the notice you made the time bold and the book title slanted: each time the word sat between two tags.') },
    { k: null, text: L3("Ob-havo sahifasida esa yopilmagan b tegini topdingiz, shuning uchun qalinlik hamma matnga yoyilgan edi. Yopuvchi teg qalinlikni to'xtatdi.",
      'А на странице погоды нашёлся незакрытый b: из-за него жирным стал весь текст. Закрывающий тег остановил жирный.',
      'And on the weather page you found the unclosed b: because of it all the text turned bold. The closing tag stopped the bold.') },
    { k: 'own', text: L3("Butun maqola sizning qo'lingizdan chiqdi! Gazetada endi nima yetishmaydi, sizningcha? Ro'yxatlar kerak bo'lsa kerak.",
      'А в конце вся статья написана твоими руками. Это было мощно! На следующем уроке сделаем списки.',
      'And at the end you wrote a whole article yourself. That was awesome! Next lesson we’ll make lists.') }
  ]
});

// ─────────────────────────────────────────────────────────────────────────────
// Т1 и Т2 · один вид: h1 и </body> готовы, абзац p — в редакторе одной строкой. Ученик ставит теги вокруг слов.
// Разбор: тот же абзац, слова не тронуты; слова внутри b (и внутри i в т2) — ровно нужные.
// ─────────────────────────────────────────────────────────────────────────────
// Тексты внутри каждого b и каждого i по порядку (вложенные теги считаются оба).
function a2Spans(toks) {
  const sp = { b: [], i: [] };
  const cur = { b: null, i: null };
  toks.forEach((t) => {
    if ((t.k === 'open' || t.k === 'close') && A2_INLINE[t.name]) {
      if (t.k === 'open') cur[t.name] = '';
      else if (cur[t.name] !== null) { sp[t.name].push(cur[t.name]); cur[t.name] = null; }
      return;
    }
    if (t.k === 'text') ['b', 'i'].forEach((tg) => { if (cur[tg] !== null) cur[tg] += t.raw; });
  });
  return sp;
}
// want: { text — абзац целиком, b — слова для b, i — слова для i (нет — i не нужен) }
function a2EmphCheck(code, want) {
  const r = a2Plan(code, A2_P('p'));
  if (!r.ok) return r;
  if (a2Norm(r.texts.p) !== a2Norm(want.text)) return { ok: false, msg: FB.keepText };
  const sp = a2Spans(lexA2(code));
  const wb = a2Norm(want.b), wi = want.i ? a2Norm(want.i) : null;
  if (!wi) {
    if (!sp.b.length) return { ok: false, msg: sp.i.length ? FB.wrongTagB : FB.needBold };
    if (sp.i.length) return { ok: false, msg: FB.noItalic };
  } else {
    if (!sp.b.length && !sp.i.length) return { ok: false, msg: FB.needBoth };
    if (sp.b.some((s) => a2Norm(s) === wi) || sp.i.some((s) => a2Norm(s) === wb)) return { ok: false, msg: FB.swapTags };
    if (!sp.b.length) return { ok: false, msg: FB.needBold };
    if (!sp.i.length) return { ok: false, msg: FB.needItalic };
    const wrongI = sp.i.find((s) => a2Norm(s) !== wi);
    if (wrongI !== undefined) return { ok: false, msg: fillL(FB.italWrong, { got: a2Squash(wrongI), want: want.i }) };
  }
  const wrongB = sp.b.find((s) => a2Norm(s) !== wb);
  if (wrongB !== undefined) return { ok: false, msg: fillL(FB.boldWrong, { got: a2Squash(wrongB), want: want.b }) };
  return { ok: true };
}
// Образец «Namuna»: абзац с одним-двумя выделенными словами.
const a2EmphLine = (parts) => '<p>' + parts.join('') + '</p>';
// Помощь t2: два тега и что каждый делает.
function A2Pair() {
  const pick = usePick();
  return (
    <div className="a2-slots" translate="no">
      <span className="a2-slot" style={{ '--pc': A2_COL.b }}><code>{'<b>…</b>'}</code><em>{pick(UI.bold)}</em></span>
      <span className="a2-slot" style={{ '--pc': 'var(--r-body)' }}><code>{'<i>…</i>'}</code><em>{pick(UI.slant)}</em></span>
    </div>
  );
}
function a2EmphView(aid) {
  return (st, x) => {
    const before = ['<body>', '  <h1>' + x.pick(TABS[st.tab || 0].name) + '</h1>'];
    const after = ['</body>'];
    return {
      title: x.pick(TABS[st.tab || 0].name), blocks: a2Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid,
      editor: <A2Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
const a2EmphInit = (tab, text) => ({ tab, code: '  <p>' + text + '</p>' });
const cfgU1 = (pick) => {
  const T = XTRA2.n1, D = XTRA2.n1d, S = XTRA2.n1s;
  const text = pick(T.t), bold = pick(T.b), dText = pick(D.t), dBold = pick(D.b);
  return {
    id: 't1', num: 1, kind: 'bold-word', C: C.t1,
    init: () => a2EmphInit(0, text),
    check: (st) => a2EmphCheck(st.code, { text, b: bold }),
    view: a2EmphView(<A2Slots tag="b" mid="word" />),
    sample: (pk) => [a2EmphLine([pk(S.pre), '<b>', pk(S.b), '</b>', pk(S.post)])],
    drill: { init: () => a2EmphInit(0, dText), check: (st) => a2EmphCheck(st.code, { text: dText, b: dBold }), view: a2EmphView(<A2Slots tag="b" mid="word" />) }
  };
};
const cfgU2 = (pick) => {
  const T = XTRA2.n2, D = XTRA2.n2d, S = XTRA2.n2s;
  const text = pick(T.t), ital = pick(T.i), bold = pick(T.b), dText = pick(D.t), dItal = pick(D.i), dBold = pick(D.b);
  return {
    id: 't2', num: 2, kind: 'bold-italic', C: C.t2,
    init: () => a2EmphInit(1, text),
    check: (st) => a2EmphCheck(st.code, { text, b: bold, i: ital }),
    view: a2EmphView(<A2Pair />),
    sample: (pk) => [a2EmphLine([pk(S.pre), '<i>', pk(S.i), '</i>', pk(S.mid), '<b>', pk(S.b), '</b>', pk(S.post)])],
    drill: { init: () => a2EmphInit(1, dText), check: (st) => a2EmphCheck(st.code, { text: dText, b: dBold, i: dItal }), view: a2EmphView(<A2Pair />) }
  };
};

// Т3 · найти и закрыть незакрытый b — прежнее задание (бывшее т4) на странице «Ob-havo» (TABS[2]).
const cfgU3 = (pick) => {
  const words = (d) => pick(d.pre) + ' ' + pick(d.bold);
  return {
    id: 't3', num: 3, kind: 'find-fix', C: C.t3,
    init: () => ({ at: null, code: '' }),
    check: (st) => a2FixCheck(st, words(TABS[2])),
    view: a2FixView(TABS[2], C.t3),
    sample: (pk) => ['<p>' + pk(XTRA.imp.pre) + ' <b>' + pk(XTRA.imp.bold) + '</b> ' + pk(XTRA.imp.post) + '</p>'],
    drill: { init: () => ({ at: null, code: '' }), check: (st) => a2FixCheck(st, words(XTRA.wind)), view: a2FixView(XTRA.wind, C.t3) }
  };
};
// Т4 · своя статья — прежнее задание (бывшее т5): номер 4, тексты C.t4; страница в целой практике — пятая, здесь четвёртая
// (TABS[4] → TABS[3] правит build-prac).
const cfgU4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, C: C.t4 });

const U1 = ({ p }) => <A2Task p={p} make={cfgU1} />;
const U2 = ({ p }) => <A2Task p={p} make={cfgU2} />;
const U3 = ({ p }) => <A2Task p={p} make={cfgU3} />;
const U4 = ({ p }) => <A2Task p={p} make={cfgU4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: объявление из двух абзацев — все слова одинаковые. «Ajratish»: «imtihon» становится жирным, «ruchkangizni»
// наклонным, в коде появляются теги b и i. Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const H = XTRA2.hook;
  const [rec, put] = useRec('h2');
  const marked = !!(rec && rec.done);
  const [flash, setFlash] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: marked ? c.done : c.say, pose: marked ? 'point' : 'hello' }]);
  const canGo = useAdvanceGate(marked, spoken);
  const led = useIdleLed(!marked, 0);
  const tabs = useA2Tabs(true);
  const tap = () => {
    if (marked) return;
    sfx('ok', true);
    setFlash(1);
    put({ done: true });
    sayNow(c.broke, 'smile');
    say(c.done, 'point');
  };
  const name = pick(TABS[0].name);
  const lines = a2Body(['<h1>' + name + '</h1>',
    a2EmphLine([pick(H.p1.pre), marked ? '<b>' : '', pick(H.p1.b), marked ? '</b>' : '', pick(H.p1.post)]),
    a2EmphLine([pick(H.p2.pre), marked ? '<i>' : '', pick(H.p2.i), marked ? '</i>' : '', pick(H.p2.post)])]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a2-sheet a2-s1 a2-h2">
        <KzAsk text={marked ? c.askDone : c.ask} />
        <div className="a2-work">
          <div className="a2-side">
            <A2Browser tabs={tabs} cur={0} title={name}><A2Doc blocks={a2Page(lines.join('\n')).blocks} flash={flash} /></A2Browser>
          </div>
          <div className="a2-main">
            <A2Code lines={lines} />
            {!marked ? (
              <div className="kz-row a2-row">
                <button type="button" className="kz-btn is-coral a2-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                  {pick(UI.highlight)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
