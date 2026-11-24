// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 4 — «Flex»
// (облик «Редактор», как уроки 1–3 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs4/build.mjs → lessons/bootstrap/04-flex.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 4 · «Flex» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Flex знаком по урокам CSS 10–11 (display: flex, оси, justify-content, align-items, gap, flex-wrap).
// Bootstrap дал этим свойствам готовые классы: d-flex, justify-content-*, align-items-*, gap-* (шкала версии 6: gap-5 —
// 1rem, 16 px), flex-wrap. Шапка сайта кружка (логотип, заголовок, кнопка) стоит столбиком — ученик выстраивает её в ряд,
// расставляет по осям, раздвигает карточки роботов, на телефоне переносит их flex-wrap. Сайт: Utilities → Justify
// content, Align items, Gap. Загадка (без имён): Коди думает, что в Bootstrap flex свой и CSS можно забыть; разгадка —
// это тот же CSS (карточка «внутри Bootstrap»: .d-flex { display: flex }).
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-04-flex.md.
//   s1 крючок · s2 показ (d-flex) · x1 пульт главной оси · g1 показ «как видео» (Justify content) · t1 по образцу ·
//   s6 показ (поперечная ось) · g2 показ «как видео» (Align items) · t2 · s9 показ (gap) · g3 показ «как видео» (Gap) ·
//   t3 по таблице · s12 показ (телефон, flex-wrap) · t4 сборка class · q1 картинка → код · t6 почему не работает ·
//   w1 своя шапка · s18 вывод с разгадкой.
//
// СИСТЕМА СЛОВ: d-flex, justify-content, align-items, gap, flex-wrap, flex-column — по-английски; qator — ряд;
// ustun — колонка; bosh o'q / ko'ndalang o'q — главная / поперечная ось (как в CSS 10); oraliq — расстояние;
// chetlarga — по краям.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-04-flex',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '4-dars. Flex',
    ru: 'Урок 4. Flex',
    en: 'Lesson 4. Flex'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      s = s.split('{' + k + '}').join(v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : v);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  check: L3('Tekshirish', 'Проверить', 'Check'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Kartochkalar', 'Карточки', 'Cards'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  need: L3('Kerak', 'Нужно', 'Goal'),
  yours: L3('Sizning kodingiz', 'Твой код', 'Your code'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  phone: L3('Telefon · 360 px', 'Телефон · 360 px', 'Phone · 360 px'),
  wide: L3("Ekranga sig'madi", 'Не помещается', 'Doesn’t fit'),
  fit: L3("Sig'di ✓", 'Помещается ✓', 'Fits ✓'),
  loading: L3('Yuklanmoqda…', 'Загружается…', 'Loading…'),
  inside: L3('Bootstrap ichida', 'Внутри Bootstrap', 'Inside Bootstrap'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
// ───────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, … ; печатаются: eyebrow, ask, site.
// ───────────────────────────────────────────────────────────────────────────
const C = {
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    h1: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    join: L3('Yozilish', 'Записаться', 'Join'),
    when: L3('Shanba kuni, soat 10:00', 'В субботу, в 10:00', 'Saturday, 10:00'),
    notice: L3("Joylar soni cheklangan!", 'Мест мало!', 'Places are limited!'),
    btn: L3("Ro'yxatdan o'tish", 'Записаться', 'Sign up')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga bitta so'z yozing.", 'Впиши в пустое место одно слово.', 'Type one word into the empty spot.'),
      dot: L3("Nuqta kerak emas. Nuqta CSS faylida turadi, class ichida esa so'z nuqtasiz yoziladi.", 'Точка не нужна. Точка бывает в файле CSS, а в class слово пишется без точки.', 'No dot needed. The dot lives in a CSS file; inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha, ularni saytdan oling.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские, бери их с сайта.', 'Latin letters are needed here. Bootstrap’s words are English: take them from the site.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      cssProp: L3("Bu CSS yozuvi, xuddi style faylidagidek. class ichida esa Bootstrap so'zi turadi: {w}.", 'Это запись CSS, как в файле стилей. А в class пишется слово Bootstrap: {w}.', 'That’s CSS, like in a style file. Inside class goes a Bootstrap word: {w}.'),
      cssVal: L3("Bu CSS qiymati. Bootstrap uni qisqartirib yozadi: {w}.", 'Это значение из CSS. Bootstrap пишет его короче: {w}.', 'That’s the CSS value. Bootstrap writes it shorter: {w}.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      noSize: L3("Bunday o'lcham yo'q: \u2063{w}\u2064. gap dan keyingi raqam piksel emas, jadvaldagi tartib raqami. Jadvalga qarang.", 'Такого размера нет: \u2063{w}\u2064. Число после gap — не пиксели, а номер в таблице. Посмотри в таблицу.', 'There’s no such size: \u2063{w}\u2064. The number after gap isn’t pixels, it’s the row number in the table. Check the table.'),
      isFlex: L3("d-flex allaqachon yozilgan. Bu joyga joylashtiradigan so'z kerak.", 'd-flex уже написан. Сюда нужно слово, которое расставляет.', 'd-flex is already there. This spot needs a word that arranges the items.'),
      native: L3("Bootstrap o'z so'zlarini biladi, oddiy so'zni emas. Kerakli so'zni saytdan oling.", 'Bootstrap знает свои слова, а не обычные. Возьми нужное слово с сайта.', 'Bootstrap knows its own words, not everyday ones. Take the right word from the site.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas. Sahifani namuna bilan solishtiring.", 'Bootstrap это слово знает, но результат не как в образце. Сравни страницу с образцом.', 'Bootstrap knows that word, but the result isn’t like the goal. Compare the page with the goal.'),
      fam_jc: L3("{w} boshqa o'q uchun. Bu yerda bosh o'q kerak: justify-content.", '{w} — для другой оси. Здесь нужна главная ось: justify-content.', '{w} is for the other axis. This needs the main axis: justify-content.'),
      fam_ai: L3("{w} boshqa o'q uchun. Bu yerda ko'ndalang o'q kerak: align-items.", '{w} — для другой оси. Здесь нужна поперечная ось: align-items.', '{w} is for the other axis. This needs the cross axis: align-items.'),
      fam_gap: L3("{w} joylashtiradi, oraliq bermaydi. Oraliq uchun gap so'zi kerak.", '{w} расставляет, а не даёт расстояние. Для расстояния нужно слово gap.', '{w} arranges items, it doesn’t add space. For space you need gap.'),
      unknown: L3("Bootstrap bunday so'zni bilmaydi: \u2063{w}\u2064. Shuning uchun hech narsa o'zgarmadi. Saytdagi so'zlardan birini oling.", 'Bootstrap не знает такого слова: \u2063{w}\u2064. Поэтому ничего не изменилось. Возьми одно из слов на сайте.', 'Bootstrap doesn’t know this word: \u2063{w}\u2064. So nothing changed. Take one of the words from the site.')
    }
  },
  s1: {
    eyebrow: L3('Sochilgan sarlavha', 'Рассыпанная шапка', 'A scattered header'),
    say: L3("Salom! Saytning tepasiga sarlavha qildim: logotip, nom va yozilish tugmasi. Lekin qarang, ular bir-birining ostida turibdi, xuddi zinapoyadek. Haqiqiy saytlarda ular bitta qatorda bo'ladi. Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Я сделал шапку сайта: логотип, название и кнопку записи. Но посмотри: они стоят друг под другом, как лесенка. На настоящих сайтах они в одном ряду. Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! I made the site header: a logo, a title and a sign-up button. But look, they’re stacked under each other like stairs. On real websites they sit in one row. Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Hammasi bitta qatorga tizildi: logotip chapda, tugma o'ngda, nom o'rtada. Kodga qarang: class ichida uchta so'z.",
      'Ого! Всё встало в один ряд: логотип слева, кнопка справа, название посередине. Посмотри на код: в class три слова.',
      'Whoa! Everything lined up in one row: the logo on the left, the button on the right, the title in the middle. Look at the code: three words in class.'),
    done: L3("Bugun bloklarni qatorga teramiz va joylashtiramiz. Lekin oldin topishmoq. Menimcha, Bootstrapda flex butunlay boshqacha, CSS darslarida o'rgangan hamma narsani unutish kerak. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida topamiz.",
      'Сегодня будем выстраивать блоки в ряд и расставлять их. Но сначала загадка. По-моему, в Bootstrap flex совсем другой, и всё, что мы учили на уроках CSS, можно забыть. Как думаешь, я прав? Ответ найдём в конце урока.',
      'Today we’ll line blocks up in a row and arrange them. But first, a riddle. I think flex in Bootstrap is completely different, and everything we learned in the CSS lessons can be forgotten. What do you think, am I right? We’ll find the answer at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3("Sarlavha bitta qatorda", 'Шапка в одном ряду', 'The header is in one row')
  },
  s2: {
    eyebrow: L3('d-flex nima', 'Что такое d-flex', 'What d-flex is'),
    help: [
      L3("class dagi so'zlarga va pastdagi «Bootstrap ichida» kartochkasiga qarang.", 'Посмотри на слова в class и на карточку «Внутри Bootstrap» под кодом.', 'Look at the words in class and the “Inside Bootstrap” card under the code.'),
      L3("d-flex bu display flex degani. U bo'lmasa, joylashtiradigan boshqa so'zlar ishlamaydi.", 'd-flex — это display flex. Без него остальные слова расстановки не работают.', 'd-flex means display flex. Without it, the other arranging words don’t work.'),
      L3("Bu sport jamoasiga o'xshaydi: oldin hammani bir qatorga tizasiz, keyingina joylarini aytasiz.", 'Это как на физкультуре: сначала всех строят в шеренгу, а потом уже расставляют по местам.', 'It’s like in PE class: first everyone lines up, and only then are they placed.')
    ],
    say: L3("Keling, bu so'zlarning sirini ochamiz. Hozir class yo'q, bloklar bir-birining ostida. Qarang, nima bo'ladi.",
      'Давай раскроем секрет этих слов. Сейчас class нет, блоки друг под другом. Смотри, что будет.',
      'Let’s uncover the secret of these words. Right now there’s no class, the blocks are stacked. Watch what happens.'),
    sayNo: L3("Men justify-content-between yozdim, ya'ni chetlarga taqsimla degani. Lekin hech narsa o'zgarmadi! Nega? Chunki bloklar hali qatorga tizilmagan.",
      'Я написал justify-content-between, то есть «раздвинь по краям». Но ничего не изменилось! Почему? Потому что блоки ещё не выстроены в ряд.',
      'I wrote justify-content-between, meaning “spread to the edges”. But nothing changed! Why? Because the blocks aren’t lined up in a row yet.'),
    sayFlex: L3("Endi oldiga d-flex qo'shdim. Mana! Bloklar qatorga tizildi va chetlarga taqsimlandi. Pastdagi kartochkaga qarang: Bootstrap ichida d-flex bu display flex, CSS darsidagi o'sha qoida!",
      'Теперь добавил впереди d-flex. Вот! Блоки встали в ряд и разошлись по краям. Посмотри на карточку под кодом: внутри Bootstrap d-flex — это display flex, то самое правило из уроков CSS!',
      'Now I added d-flex in front. There! The blocks lined up and spread to the edges. Look at the card under the code: inside Bootstrap, d-flex is display flex, the very rule from the CSS lessons!'),
    done: L3("Eslab qoling: oldin d-flex, keyin joylashtiradigan so'zlar. d-flex siz ular ishlamaydi.", 'Запомни: сначала d-flex, потом слова расстановки. Без d-flex они не работают.', 'Remember: first d-flex, then the arranging words. Without d-flex they don’t work.'),
    askStart: L3("Qarang: class yo'q", 'Смотри: class нет', 'Watch: no class'),
    askNo: L3("Qarang: d-flex siz", 'Смотри: без d-flex', 'Watch: without d-flex'),
    askFlex: L3('Qarang: d-flex bilan', 'Смотри: с d-flex', 'Watch: with d-flex'),
    askDone: L3('d-flex: display flex', 'd-flex: display flex', 'd-flex: display flex')
  },
  x1: {
    eyebrow: L3('Bosh o\'q pulti', 'Пульт главной оси', 'Main axis remote'),
    say: L3("Bosh o'q bo'yicha joylashtirishni sinab ko'ramiz. Pastda oltita so'z bor. Bosing va sarlavha qanday o'zgarishini kuzating. Kamida to'rttasini sinang.",
      'Попробуем расставлять по главной оси. Внизу шесть слов. Нажимай и смотри, как меняется шапка. Попробуй хотя бы четыре.',
      'Let’s arrange things along the main axis. Below are six words. Tap them and watch the header change. Try at least four.'),
    mean: {
      start: L3("start: hammasi chapda, boshida.", 'start: всё слева, в начале.', 'start: everything on the left, at the start.'),
      center: L3("center: hammasi o'rtada.", 'center: всё посередине.', 'center: everything in the middle.'),
      end: L3("end: hammasi o'ngda, oxirida.", 'end: всё справа, в конце.', 'end: everything on the right, at the end.'),
      between: L3("between: chetlarga, birinchisi chapda, oxirgisi o'ngda.", 'between: по краям, первый слева, последний справа.', 'between: to the edges, the first on the left, the last on the right.'),
      around: L3("around: har bir blok atrofida teng joy.", 'around: вокруг каждого блока равное место.', 'around: equal space around each block.'),
      evenly: L3("evenly: barcha oraliqlar bir xil.", 'evenly: все промежутки одинаковые.', 'evenly: all the gaps are the same.')
    },
    ok: L3("Ajoyib! Kartochkaga qarang: har bir so'z CSS dagi justify-content qiymati.", 'Отлично! Посмотри на карточку: каждое слово — значение justify-content из CSS.', 'Great! Look at the card: each word is a justify-content value from CSS.'),
    done: L3("Endi bu so'zlarni Bootstrap saytidan qanday topishni ko'ramiz.", 'Теперь посмотрим, как найти эти слова на сайте Bootstrap.', 'Now let’s see how to find these words on the Bootstrap site.'),
    hints: [
      L3("Pastdagi so'zlarni bosing.", 'Нажимай слова внизу.', 'Tap the words below.'),
      L3("To'rtta har xil so'zni bosing.", 'Нажми четыре разных слова.', 'Tap four different words.'),
      L3("Masalan: center, end, between va around.", 'Например: center, end, between и around.', 'For example: center, end, between and around.')
    ],
    ask: L3("To'rtta joylashuvni sinang", 'Попробуй четыре расстановки', 'Try four arrangements'),
    askDone: L3("justify-content — bosh o'q", 'justify-content — главная ось', 'justify-content is the main axis')
  },
  g1: {
    eyebrow: L3('Justify content sahifasi', 'Страница Justify content', 'The Justify content page'),
    help: [
      L3("Menyudagi Utilities bo'limiga, Justify content sahifasiga va belgilangan so'zga qarang.", 'Посмотри на раздел Utilities в меню, страницу Justify content и выделенное слово.', 'Look at Utilities in the menu, the Justify content page and the selected word.'),
      L3("Har bir qator misolda bir xil bloklar, faqat joylashuvi boshqa. Kodda esa qator so'zi.", 'В каждом ряду примера одни и те же блоки, только расставлены по-разному. В коде — слово этого ряда.', 'Each example row has the same blocks, just arranged differently. The code has that row’s word.'),
      L3("Bu kiyim do'konidagi rasmlarga o'xshaydi: ko'rinishini tanlaysiz, keyin nomini olasiz.", 'Это как картинки в магазине одежды: выбираешь, как выглядит, и берёшь название.', 'It’s like pictures in a clothes shop: you pick the look, then take its name.')
    ],
    say: L3("Bu so'zlar saytda qayerda? Qarang, flex uchun Utilities bo'limida alohida sahifalar bor.", 'Где эти слова на сайте? Смотри, для flex в разделе Utilities есть отдельные страницы.', 'Where are these words on the site? Look, Utilities has separate pages for flex.'),
    sayPage: L3("Utilities bo'limida Justify content sahifasini ochdim. Misolda oltita qator: start, end, center, between, around, evenly. Har birining tagida o'z kodi.",
      'В разделе Utilities открыл страницу Justify content. В примере шесть рядов: start, end, center, between, around, evenly. У каждого свой код.',
      'In Utilities I opened the Justify content page. The example has six rows: start, end, center, between, around, evenly. Each has its own code.'),
    sayApply: L3("justify-content-between so'zini ikki marta bosib belgiladim, nusxaladim va d-flex dan keyin qo'ydim. Sarlavha chetlarga taqsimlandi!",
      'Двойным щелчком выделил justify-content-between, скопировал и поставил после d-flex. Шапка разошлась по краям!',
      'I double-clicked justify-content-between, copied it and put it after d-flex. The header spread to the edges!'),
    done: L3("Eslab qoling: joylashtirish so'zlari Utilities bo'limida: Justify content, Align items va Gap.", 'Запомни: слова расстановки — в разделе Utilities: Justify content, Align items и Gap.', 'Remember: the arranging words are in Utilities: Justify content, Align items and Gap.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Utilities → Justify content', 'Смотри: Utilities → Justify content', 'Watch: Utilities → Justify content'),
    askPage: L3('Qarang: oltita qator', 'Смотри: шесть рядов', 'Watch: six rows'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3('Qarang: chetlarga taqsimlandi', 'Смотри: разошлись по краям', 'Watch: spread to the edges'),
    askDone: L3('Utilities → Justify content', 'Utilities → Justify content', 'Utilities → Justify content')
  },
  t1: {
    eyebrow: L3("Bosh o'q", 'Главная ось', 'Main axis'),
    say: L3("Endi o'zingiz. Namunaga qarang va d-flex dan keyin kerakli so'zni yozing. So'zlar saytda.",
      'Теперь сам. Посмотри на образец и впиши после d-flex нужное слово. Слова — на сайте.',
      'Now you. Look at the goal and type the right word after d-flex. The words are on the site.'),
    ask1: L3("Hammasi o'rtada bo'lsin", 'Всё посередине', 'Everything in the middle'),
    ask2: L3("Hammasi o'ngda bo'lsin", 'Всё справа', 'Everything on the right'),
    ask3: L3('Chetlarga taqsimlansin', 'По краям', 'Spread to the edges'),
    hints1: [
      L3("So'z justify-content bilan boshlanadi.", 'Слово начинается с justify-content.', 'The word starts with justify-content.'),
      L3("O'rta inglizcha center.", 'Середина по-английски — center.', 'Middle in English is center.'),
      L3("Yozing: justify-content-center", 'Впиши: justify-content-center', 'Type: justify-content-center')
    ],
    hints2: [
      L3("O'ng tomon — qatorning oxiri.", 'Справа — это конец ряда.', 'The right side is the end of the row.'),
      L3("Oxir inglizcha end.", 'Конец по-английски — end.', 'End in English is end.'),
      L3("Yozing: justify-content-end", 'Впиши: justify-content-end', 'Type: justify-content-end')
    ],
    hints3: [
      L3("Birinchisi chapda, oxirgisi o'ngda: joy ularning o'rtasiga taqsimlanadi.", 'Первый слева, последний справа: место распределено между ними.', 'First on the left, last on the right: the space is shared between them.'),
      L3("O'rtasida inglizcha between.", 'Между по-английски — between.', 'Between in English is between.'),
      L3("Yozing: justify-content-between", 'Впиши: justify-content-between', 'Type: justify-content-between')
    ],
    why1: L3("justify-content-center hammasini o'rtaga yig'di.", 'justify-content-center собрал всё посередине.', 'justify-content-center gathered everything in the middle.'),
    why2: L3("justify-content-end hammasini oxiriga surdi.", 'justify-content-end сдвинул всё в конец.', 'justify-content-end pushed everything to the end.'),
    why3: L3("justify-content-between chetlarga taqsimladi.", 'justify-content-between раздвинул по краям.', 'justify-content-between spread them to the edges.'),
    done: L3("Qoyil! Bosh o'q bo'yicha istalgan joylashuvni qila olasiz.", 'Класс! По главной оси ты расставишь как угодно.', 'Nice! You can arrange things any way along the main axis.')
  },
  s6: {
    eyebrow: L3("Ko'ndalang o'q", 'Поперечная ось', 'Cross axis'),
    help: [
      L3("Logotip, nom va tugmaning balandligiga va ularning tepa-pastiga qarang.", 'Посмотри на высоту логотипа, названия и кнопки и на то, где они по вертикали.', 'Look at the heights of the logo, title and button and where they sit vertically.'),
      L3("align-items ko'ndalang o'q bo'yicha joylaydi: qator bo'lsa, tepadan pastga. start — tepa, end — past, center — o'rta.", 'align-items расставляет по поперечной оси: в ряду это сверху вниз. start — верх, end — низ, center — середина.', 'align-items arranges along the cross axis: in a row that’s top to bottom. start is top, end is bottom, center is middle.'),
      L3("Bu javondagi kitoblarga o'xshaydi: past-baland kitoblarni tagidan, tepasidan yoki o'rtasidan tekislash mumkin.", 'Это как книги на полке: книги разной высоты можно выровнять по низу, по верху или по середине.', 'It’s like books on a shelf: books of different heights can line up by the bottom, the top or the middle.')
    ],
    say: L3("Sarlavha qatorda turibdi, lekin bloklarning balandligi har xil: logotip baland, tugma past. Ular tepa-pastda qanday turadi? CSS darsi esingizdami? Bu ko'ndalang o'q. Qarang.",
      'Шапка в ряду, но блоки разной высоты: логотип высокий, кнопка низкая. Как они стоят по вертикали? Вспомни урок CSS: это поперечная ось. Смотри.',
      'The header is in a row, but the blocks have different heights: the logo is tall, the button is short. How do they sit vertically? Remember the CSS lesson: that’s the cross axis. Watch.'),
    sayStart: L3("align-items-start: hammasi tepaga tekislandi.", 'align-items-start: всё выровнялось по верху.', 'align-items-start: everything lined up at the top.'),
    sayEnd: L3("align-items-end: hammasi pastga tushdi.", 'align-items-end: всё опустилось вниз.', 'align-items-end: everything dropped to the bottom.'),
    sayCenter: L3("align-items-center: hammasi o'rtaga tekislandi. Sarlavhalarda ko'pincha aynan shunday qilinadi.", 'align-items-center: всё выровнялось по середине. В шапках чаще всего делают именно так.', 'align-items-center: everything lined up in the middle. Headers usually do exactly this.'),
    done: L3("Eslab qoling: justify-content — bosh o'q, align-items — ko'ndalang o'q, xuddi CSS dagidek.", 'Запомни: justify-content — главная ось, align-items — поперечная, как в CSS.', 'Remember: justify-content is the main axis, align-items is the cross axis, just like CSS.'),
    askStart: L3("Qarang: balandligi har xil", 'Смотри: высота разная', 'Watch: different heights'),
    askS: L3('Qarang: align-items-start', 'Смотри: align-items-start', 'Watch: align-items-start'),
    askE: L3('Qarang: align-items-end', 'Смотри: align-items-end', 'Watch: align-items-end'),
    askC: L3('Qarang: align-items-center', 'Смотри: align-items-center', 'Watch: align-items-center'),
    askDone: L3("align-items — ko'ndalang o'q", 'align-items — поперечная ось', 'align-items is the cross axis')
  },
  g2: {
    eyebrow: L3('Align items sahifasi', 'Страница Align items', 'The Align items page'),
    help: [
      L3("Menyudagi Align items sahifasiga va belgilangan so'zga qarang.", 'Посмотри на страницу Align items в меню и на выделенное слово.', 'Look at the Align items page in the menu and the selected word.'),
      L3("Misolda beshta qator: start, end, center, baseline, stretch. Har birida bloklar boshqacha balandlikda turadi.", 'В примере пять рядов: start, end, center, baseline, stretch. В каждом блоки стоят на разной высоте.', 'The example has five rows: start, end, center, baseline, stretch. In each the blocks sit at a different height.'),
      L3("Bu suratga tushishga o'xshaydi: past-baland do'stlarni bir chiziqqa keltirasiz.", 'Это как фото на память: друзей разного роста выстраиваешь в одну линию.', 'It’s like a group photo: you line up friends of different heights.')
    ],
    say: L3("Endi ko'ndalang o'q so'zini saytdan olamiz. U ham Utilities bo'limida.", 'Теперь возьмём с сайта слово поперечной оси. Оно тоже в разделе Utilities.', 'Now let’s take the cross axis word from the site. It’s in Utilities too.'),
    sayPage: L3("Align items sahifasi. Misolda beshta qator, uchinchisi center: bloklar o'rtada.", 'Страница Align items. В примере пять рядов, третий — center: блоки посередине.', 'The Align items page. The example has five rows, the third is center: blocks in the middle.'),
    sayApply: L3("align-items-center so'zini belgiladim, nusxaladim va class oxiriga qo'ydim. Logotip, nom va tugma o'rtaga tekislandi!", 'Выделил align-items-center, скопировал и поставил в конец class. Логотип, название и кнопка выровнялись по середине!', 'I selected align-items-center, copied it and added it at the end of class. The logo, title and button lined up in the middle!'),
    done: L3("Endi sarlavha xuddi haqiqiy saytdagidek: qatorda, chetlarga taqsimlangan va o'rtaga tekislangan.", 'Теперь шапка как на настоящем сайте: в ряд, по краям и по середине.', 'Now the header looks like a real site’s: in a row, spread to the edges and centered.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Utilities → Align items', 'Смотри: Utilities → Align items', 'Watch: Utilities → Align items'),
    askPage: L3('Qarang: beshta qator', 'Смотри: пять рядов', 'Watch: five rows'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3("Qarang: o'rtaga tekislandi", 'Смотри: выровнялось по середине', 'Watch: lined up in the middle'),
    askDone: L3('Utilities → Align items', 'Utilities → Align items', 'Utilities → Align items')
  },
  t2: {
    eyebrow: L3("Ko'ndalang o'q", 'Поперечная ось', 'Cross axis'),
    say: L3("Endi ko'ndalang o'q. Namunaga qarang va oxiriga kerakli so'zni yozing.", 'Теперь поперечная ось. Посмотри на образец и впиши в конец нужное слово.', 'Now the cross axis. Look at the goal and type the right word at the end.'),
    ask1: L3("Logotip, nom va tugma pastki chiziqqa tekislansin", 'Логотип, название и кнопка — по нижнему краю', 'Logo, title and button lined up along the bottom edge'),
    ask2: L3("Logotip, nom va tugma o'rta chiziqqa tekislansin", 'Логотип, название и кнопка — по середине', 'Logo, title and button lined up along the middle'),
    hints1: [
      L3("So'z align-items bilan boshlanadi.", 'Слово начинается с align-items.', 'The word starts with align-items.'),
      L3("Past — oxiri, inglizcha end.", 'Низ — это конец, по-английски end.', 'The bottom is the end, end in English.'),
      L3("Yozing: align-items-end", 'Впиши: align-items-end', 'Type: align-items-end')
    ],
    hints2: [
      L3("O'rta inglizcha center.", 'Середина по-английски — center.', 'Middle in English is center.'),
      L3("Oldingi so'z align-items edi, faqat oxiri boshqa.", 'Начало то же — align-items, другой только конец.', 'The start is the same, align-items; only the end changes.'),
      L3("Yozing: align-items-center", 'Впиши: align-items-center', 'Type: align-items-center')
    ],
    why1: L3("align-items-end hammasini pastga tekisladi.", 'align-items-end выровнял всё по низу.', 'align-items-end lined everything up at the bottom.'),
    why2: L3("align-items-center hammasini o'rtaga tekisladi.", 'align-items-center выровнял всё по середине.', 'align-items-center lined everything up in the middle.'),
    done: L3("Zo'r! Ikkala o'q ham sizning qo'lingizda.", 'Огонь! Обе оси в твоих руках.', 'Awesome! Both axes are in your hands.')
  },
  s9: {
    eyebrow: L3('Oraliq', 'Расстояние', 'Spacing'),
    help: [
      L3("Robot rasmlari orasidagi joyga va gap dan keyingi raqamga qarang.", 'Посмотри на место между фото роботов и на число после gap.', 'Look at the space between the robot photos and the number after gap.'),
      L3("gap bloklar o'rtasiga joy qo'yadi. Raqam katta bo'lsa, joy ham katta. Raqam piksel emas: gap-5 bu 16 piksel.", 'gap ставит место между блоками. Чем больше число, тем больше место. Число — не пиксели: gap-5 — это 16 пикселей.', 'gap puts space between blocks. The bigger the number, the bigger the space. The number isn’t pixels: gap-5 is 16 pixels.'),
      L3("Bu partadagi o'quvchilarga o'xshaydi: yaqin o'tirsa siqiladi, ozgina oraliq bo'lsa qulay.", 'Это как ученики за партами: вплотную тесно, с небольшим промежутком удобно.', 'It’s like students at desks: squeezed together is cramped, a little space is comfy.')
    ],
    say: L3("Endi robotlarimiz rasmlari. d-flex ularni qatorga tizdi, lekin ular bir-biriga yopishib qoldi. Oraliq kerak. Qarang.",
      'Теперь фото наших роботов. d-flex выстроил их в ряд, но они слиплись. Нужно расстояние. Смотри.',
      'Now our robots’ photos. d-flex lined them up, but they’re stuck together. We need some space. Watch.'),
    say3: L3("gap-3: rasmlar o'rtasida ozgina joy paydo bo'ldi, 8 piksel.", 'gap-3: между фото появилось немного места, 8 пикселей.', 'gap-3: a little space appeared between the photos, 8 pixels.'),
    say5: L3("gap-5: kattaroq, 16 piksel.", 'gap-5: побольше, 16 пикселей.', 'gap-5: a bit more, 16 pixels.'),
    say9: L3("gap-9: yanada katta, 32 piksel. Diqqat qiling: gap dan keyingi raqam piksel emas, u o'lchamlar jadvalidagi tartib raqami. Jadval saytda bor.",
      'gap-9: ещё больше, 32 пикселя. Внимание: число после gap — не пиксели, а номер в таблице размеров. Таблица есть на сайте.',
      'gap-9: even more, 32 pixels. Heads up: the number after gap isn’t pixels, it’s the row number in the size table. The table is on the site.'),
    done: L3("Eslab qoling: gap — oraliq, raqam — jadvaldagi o'lcham.", 'Запомни: gap — расстояние, число — размер из таблицы.', 'Remember: gap is spacing, the number is a size from the table.'),
    askStart: L3('Qarang: rasmlar yopishgan', 'Смотри: фото слиплись', 'Watch: the photos are stuck together'),
    askGap: L3('Qarang: {w}', 'Смотри: {w}', 'Watch: {w}'),
    askDone: L3("gap — bloklar orasidagi joy", 'gap — место между блоками', 'gap is the space between blocks')
  },
  g3: {
    eyebrow: L3('Gap sahifasi', 'Страница Gap', 'The Gap page'),
    help: [
      L3("Gap sahifasidagi jadvalga va belgilangan so'zga qarang.", 'Посмотри на таблицу на странице Gap и на выделенное слово.', 'Look at the table on the Gap page and the selected word.'),
      L3("Jadvalda har bir gap so'zining o'lchami bor: rem va piksel. Kerakli oraliqni jadvaldan topasiz.", 'В таблице у каждого слова gap есть размер: в rem и в пикселях. Нужное расстояние находишь в таблице.', 'The table gives each gap word a size: in rem and pixels. You find the spacing you need in the table.'),
      L3("Bu kiyim o'lchamlari jadvaliga o'xshaydi: S, M, L harfi aslida santimetrlar.", 'Это как таблица размеров одежды: буквы S, M, L — на самом деле сантиметры.', 'It’s like a clothes size chart: the letters S, M, L really stand for centimeters.')
    ],
    say: L3("gap so'zlari va ularning o'lchami saytda bor. Qarang.", 'Слова gap и их размеры есть на сайте. Смотри.', 'The gap words and their sizes are on the site. Watch.'),
    sayPage: L3("Utilities bo'limida Gap sahifasi. Tepada jadval: chapda so'z, o'ngda o'lcham. Pastda Flexbox gap misoli, kodda gap-4.",
      'В разделе Utilities — страница Gap. Наверху таблица: слева слово, справа размер. Ниже пример Flexbox gap, в коде gap-4.',
      'In Utilities there’s the Gap page. At the top is a table: the word on the left, the size on the right. Below is the Flexbox gap example, with gap-4 in the code.'),
    sayApply: L3("gap-4 so'zini belgiladim va d-flex dan keyin qo'ydim. Jadvalda gap-4 bu 12 piksel, rasmlar o'rtasida xuddi shuncha joy.",
      'Выделил gap-4 и поставил после d-flex. По таблице gap-4 — 12 пикселей, между фото ровно столько места.',
      'I selected gap-4 and put it after d-flex. In the table gap-4 is 12 pixels, and that’s exactly the space between the photos.'),
    done: L3("Eslab qoling: kerakli oraliqni Gap sahifasidagi jadvaldan topamiz.", 'Запомни: нужное расстояние находим в таблице на странице Gap.', 'Remember: we find the spacing we need in the table on the Gap page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Utilities → Gap', 'Смотри: Utilities → Gap', 'Watch: Utilities → Gap'),
    askPage: L3("Qarang: o'lchamlar jadvali", 'Смотри: таблица размеров', 'Watch: the size table'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3('Qarang: 12 px oraliq', 'Смотри: расстояние 12 px', 'Watch: 12 px of space'),
    askDone: L3('Utilities → Gap', 'Utilities → Gap', 'Utilities → Gap')
  },
  t3: {
    eyebrow: L3('Oraliqni tanlang', 'Выбери расстояние', 'Pick the spacing'),
    say: L3("Namunada oraliq piksel bilan yozilgan. Saytdagi jadvaldan shu o'lchamdagi gap so'zini toping va yozing.",
      'В образце расстояние написано в пикселях. Найди в таблице на сайте слово gap с таким размером и впиши его.',
      'The goal shows the spacing in pixels. Find the gap word with that size in the table on the site and type it.'),
    ask1: L3("Oraliq 16 piksel bo'lsin", 'Расстояние — 16 пикселей', 'Make the spacing 16 pixels'),
    ask2: L3("Oraliq 32 piksel bo'lsin", 'Расстояние — 32 пикселя', 'Make the spacing 32 pixels'),
    hints1: [
      L3("Jadvalning o'ng ustunida piksellar yozilgan.", 'В правом столбце таблицы — пиксели.', 'The table’s right column shows pixels.'),
      L3("16 piksel 1rem ga teng. Shu qatordagi so'zni oling.", '16 пикселей — это 1rem. Возьми слово из этой строки.', '16 pixels is 1rem. Take the word from that row.'),
      L3("Yozing: gap-5", 'Впиши: gap-5', 'Type: gap-5')
    ],
    hints2: [
      L3("Jadvalda 32 piksel qatorini toping.", 'Найди в таблице строку 32 пикселя.', 'Find the 32 pixel row in the table.'),
      L3("32 piksel 2rem ga teng.", '32 пикселя — это 2rem.', '32 pixels is 2rem.'),
      L3("Yozing: gap-9", 'Впиши: gap-9', 'Type: gap-9')
    ],
    why1: L3("gap-5 bu 1rem, ya'ni 16 piksel degani.", 'gap-5 — это 1rem, то есть 16 пикселей.', 'gap-5 is 1rem, that is, 16 pixels.'),
    why2: L3("gap-9 bu 2rem, ya'ni 32 piksel degani.", 'gap-9 — это 2rem, то есть 32 пикселя.', 'gap-9 is 2rem, that is, 32 pixels.'),
    done: L3("Ajoyib! Endi istalgan oraliqni jadvaldan topasiz.", 'Отлично! Теперь любое расстояние найдёшь по таблице.', 'Great! Now you’ll find any spacing in the table.')
  },
  s12: {
    eyebrow: L3('Telefonda', 'На телефоне', 'On a phone'),
    help: [
      L3("Telefon ekraniga, keyin class dagi flex-wrap so'ziga qarang.", 'Посмотри на экран телефона, потом на слово flex-wrap в class.', 'Look at the phone screen, then the word flex-wrap in class.'),
      L3("d-flex hamma blokni bitta qatorga sig'dirishga urinadi. flex-wrap esa sig'maganini keyingi qatorga o'tkazadi.", 'd-flex старается уместить все блоки в один ряд. А flex-wrap переносит те, что не влезли, на следующий ряд.', 'd-flex tries to fit all the blocks in one row. flex-wrap moves the ones that don’t fit to the next row.'),
      L3("Bu kitobdagi so'zlarga o'xshaydi: qator tugasa, so'z keyingi qatorga o'tadi.", 'Это как слова в книге: строка кончилась — слово переносится на следующую.', 'It’s like words in a book: when a line ends, the word moves to the next line.')
    ],
    say: L3("Saytni telefonda ochamiz. Uchta rasm 360 piksellik ekranga sig'madi: oxirgisi chiqib ketdi.", 'Откроем сайт на телефоне. Три фото не поместились на экран в 360 пикселей: последнее вылезло.', 'Let’s open the site on a phone. Three photos don’t fit a 360 pixel screen: the last one sticks out.'),
    sayWrap: L3("flex-wrap qo'shdim. Sig'magan rasm keyingi qatorga o'tdi. Endi hammasi ekranda!", 'Добавил flex-wrap. Фото, которое не влезло, перешло на следующий ряд. Теперь всё на экране!', 'I added flex-wrap. The photo that didn’t fit moved to the next row. Now everything’s on screen!'),
    done: L3("Eslab qoling: telefonda bloklar sig'masa, flex-wrap ularni keyingi qatorga o'tkazadi.", 'Запомни: если на телефоне блоки не влезают, flex-wrap переносит их на следующий ряд.', 'Remember: if blocks don’t fit on a phone, flex-wrap moves them to the next row.'),
    askStart: L3("Qarang: telefonga sig'madi", 'Смотри: не помещается на телефон', 'Watch: doesn’t fit the phone'),
    askWrap: L3("Qarang: flex-wrap", 'Смотри: flex-wrap', 'Watch: flex-wrap'),
    askDone: L3("flex-wrap — keyingi qatorga", 'flex-wrap — перенос на новый ряд', 'flex-wrap wraps to a new row')
  },
  t4: {
    eyebrow: L3("Bo'laklardan yig'ing", 'Собери из кусочков', 'Build from pieces'),
    say: L3("Endi sarlavhani o'zingiz yig'asiz. Pastdagi so'zlarni bosib, class ga qo'shing yoki olib tashlang. Natija namunadagidek bo'lsa, «Tekshirish»ni bosing.",
      'Теперь собери шапку сам. Нажимай слова внизу, чтобы добавить их в class или убрать. Когда результат как в образце, нажми «Проверить».',
      'Now build the header yourself. Tap the words below to add them to class or remove them. When the result matches the goal, tap “Check”.'),
    ask: L3("Namunadagi sarlavhani yig'ing", 'Собери шапку как в образце', 'Build the header like the goal'),
    msgs: {
      noFlex: L3("d-flex yo'q, shuning uchun qolgan so'zlar ishlamayapti. Oldin d-flex qo'shing.", 'Нет d-flex, поэтому остальные слова не работают. Сначала добавь d-flex.', 'There’s no d-flex, so the other words don’t work. Add d-flex first.'),
      column: L3("flex-column bloklarni ustun qildi. Namunada esa qator.", 'flex-column поставил блоки колонкой. А в образце — ряд.', 'flex-column stacked the blocks in a column. The goal is a row.'),
      jc: L3("Bosh o'q bo'yicha joylashuv namunadagidek emas. Namunada chetlarga taqsimlangan.", 'Расстановка по главной оси не как в образце. В образце — по краям.', 'The main axis arrangement doesn’t match. The goal is spread to the edges.'),
      ai: L3("Ko'ndalang o'q bo'yicha namunada hammasi o'rtada. Qaysi so'z o'rtaga tekislaydi?", 'По поперечной оси в образце всё посередине. Какое слово выравнивает по середине?', 'On the cross axis everything in the goal is in the middle. Which word centers them?'),
      both: L3("Bitta o'q uchun ikkita so'z qo'yilgan. Har bir o'qqa bittadan so'z yetadi.", 'Для одной оси стоят два слова. На каждую ось хватает одного слова.', 'One axis has two words. One word per axis is enough.')
    },
    hints: [
      L3("Har doim d-flex dan boshlang.", 'Всегда начинай с d-flex.', 'Always start with d-flex.'),
      L3("Keyin bosh o'q uchun bitta so'z va ko'ndalang o'q uchun bitta so'z.", 'Потом одно слово для главной оси и одно для поперечной.', 'Then one word for the main axis and one for the cross axis.'),
      L3("Kerak: d-flex, justify-content-between va align-items-center.", 'Нужно: d-flex, justify-content-between и align-items-center.', 'You need: d-flex, justify-content-between and align-items-center.')
    ],
    ok: L3("To'ppa-to'g'ri! Uchta so'z: qator, chetlarga, o'rtaga.", 'В точку! Три слова: ряд, по краям, по середине.', 'Spot on! Three words: a row, to the edges, in the middle.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna. Uni qaysi kod chizadi? Variantni bosing, o'ngda natijasi chiqadi.", 'Маленькое испытание. Слева образец. Какой код его рисует? Нажми вариант, справа появится результат.', 'A little test. The goal is on the left. Which code draws it? Tap an option and its result appears on the right.'),
    ask: L3('Namunani qaysi kod chizadi?', 'Какой код рисует образец?', 'Which code draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Qatorda va o'rtada: d-flex va justify-content-center.", 'В ряд и посередине: d-flex и justify-content-center.', 'In a row and in the middle: d-flex and justify-content-center.'),
      L3("Chetlarga: d-flex va justify-content-between.", 'По краям: d-flex и justify-content-between.', 'To the edges: d-flex and justify-content-between.'),
      L3("Ustun bo'lib, tugma butun kenglikda: d-flex va flex-column.", 'Колонкой, кнопка во всю ширину: d-flex и flex-column.', 'A column, with the button full width: d-flex and flex-column.'),
      L3("32 piksel oraliq: d-flex va gap-9.", 'Расстояние 32 пикселя: d-flex и gap-9.', '32 pixels of space: d-flex and gap-9.')
    ],
    no: {
      'justify-content-center': L3("d-flex yo'q, shuning uchun bloklar ustun bo'lib qoldi.", 'Нет d-flex, поэтому блоки остались столбиком.', 'There’s no d-flex, so the blocks stayed stacked.'),
      'd-flex justify-content-evenly': L3("evenly oraliqlarni teng qiladi, bloklar butun qator bo'ylab tarqaladi.", 'evenly делает промежутки равными, блоки расходятся по всему ряду.', 'evenly makes the gaps equal, so the blocks spread across the whole row.'),
      'd-flex align-items-center': L3("Bu ko'ndalang o'q, bloklar esa chapda qoldi.", 'Это поперечная ось, а блоки остались слева.', 'That’s the cross axis, and the blocks stayed on the left.'),
      'd-flex justify-content-around': L3("around chetlarda ham joy qoldiradi. Namunada bloklar chetga taqalgan.", 'around оставляет место и у краёв. В образце блоки прижаты к краям.', 'around leaves space at the edges too. In the goal the blocks touch the edges.'),
      'd-flex justify-content-space-between': L3("Bu CSS qiymati. Bootstrap so'zi qisqaroq: justify-content-between.", 'Это значение из CSS. Слово Bootstrap короче: justify-content-between.', 'That’s the CSS value. The Bootstrap word is shorter: justify-content-between.'),
      'd-flex': L3("Faqat qator bo'ldi, joylashuv so'zi yo'q.", 'Получился только ряд, слова расстановки нет.', 'That’s just a row, with no arranging word.'),
      'flex-column': L3("d-flex yo'q, shuning uchun flex-column ishlamadi. Tugma oddiy kenglikda.", 'Нет d-flex, поэтому flex-column не сработал. Кнопка обычной ширины.', 'There’s no d-flex, so flex-column didn’t work. The button is its normal width.'),
      'd-flex flex-row': L3("flex-row bu qator, namunada esa ustun.", 'flex-row — это ряд, а в образце колонка.', 'flex-row is a row, but the goal is a column.'),
      'd-flex flex-wrap': L3("flex-wrap faqat sig'maganini o'tkazadi. Bu yerda hammasi qatorda.", 'flex-wrap только переносит то, что не влезло. Здесь всё в ряд.', 'flex-wrap only moves what doesn’t fit. Here everything is in a row.'),
      'd-flex gap-32': L3("gap-32 degan o'lcham yo'q. Raqam piksel emas, jadvaldagi tartib raqami.", 'Размера gap-32 нет. Число — не пиксели, а номер в таблице.', 'There’s no gap-32 size. The number isn’t pixels, it’s the row number in the table.'),
      'd-flex gap-3': L3("gap-3 bu 8 piksel, namunada esa kattaroq.", 'gap-3 — это 8 пикселей, а в образце больше.', 'gap-3 is 8 pixels, but the goal is wider.'),
      'gap-9': L3("d-flex yo'q, shuning uchun gap ishlamadi.", 'Нет d-flex, поэтому gap не сработал.', 'There’s no d-flex, so gap didn’t work.')
    },
    hint1: L3("Oldin qarang: bloklar qatordami yoki ustundami?", 'Сначала посмотри: блоки в ряд или колонкой?', 'First look: are the blocks in a row or a column?'),
    hint2: L3("d-flex bormi? So'z CSS dagidek emas, Bootstrap dagidek yozilganmi?", 'Есть ли d-flex? Слово записано как в Bootstrap, а не как в CSS?', 'Is there d-flex? Is the word written the Bootstrap way, not the CSS way?'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Rasmga qarab, kerakli kodni o'zingiz topasiz.", 'Всё верно! По картинке ты сам находишь нужный код.', 'All correct! You find the right code from a picture yourself.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta sahifada joylashuv ishlamayapti, har birida sabab boshqa. Kodga qarang va sababini tanlang.",
      'Последнее испытание. На трёх страницах расстановка не работает, и у каждой своя причина. Посмотри на код и выбери причину.',
      'The last test. On three pages the arrangement doesn’t work, and each has a different reason. Look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    opts: {
      noFlex: L3("d-flex yo'q", 'Нет d-flex', 'No d-flex'),
      cssVal: L3("CSS qiymati yozilgan", 'Написано значение из CSS', 'A CSS value was written'),
      noSize: L3("Bunday o'lcham yo'q", 'Такого размера нет', 'There’s no such size')
    },
    rounds: [
      L3("justify-content-between bor, lekin d-flex yo'q. Bloklar qatorga tizilmagan, shuning uchun joylashuv ishlamaydi.", 'justify-content-between есть, а d-flex нет. Блоки не выстроены в ряд, поэтому расстановка не работает.', 'justify-content-between is there, but d-flex isn’t. The blocks aren’t in a row, so the arrangement doesn’t work.'),
      L3("space-between bu CSS qiymati. Bootstrap da qisqasi: justify-content-between.", 'space-between — значение из CSS. В Bootstrap короче: justify-content-between.', 'space-between is the CSS value. In Bootstrap it’s shorter: justify-content-between.'),
      L3("gap-16 degan o'lcham yo'q. 16 piksel: gap-5 (Gap sahifasidagi jadvalda).", 'Размера gap-16 нет. 16 пикселей — это gap-5 (таблица на странице Gap).', 'There’s no gap-16 size. 16 pixels is gap-5 (the table on the Gap page).')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Oldin d-flex bormi, tekshiring.", 'Сначала проверь, есть ли d-flex.', 'First check whether d-flex is there.'),
    hint2: L3("So'zni saytdagi bilan solishtiring: qisqa Bootstrap so'zimi, CSS qiymatimi, raqami Gap sahifasidagi jadvaldami?", 'Сравни слово с сайтом: это короткое слово Bootstrap, значение CSS, есть ли такое число в таблице на странице Gap?', 'Compare the word with the site: is it a short Bootstrap word, a CSS value, is that number in the table on the Gap page?'),
    ok: L3("Hammasi to'g'ri! Endi joylashuv ishlamasa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если расстановка не работает, причину найдёшь сам.', 'All correct! Now if an arrangement doesn’t work, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z sarlavhangiz", 'Своя шапка', 'Your own header'),
    say: L3("Endi sarlavhani o'zingizga moslang. Bosh o'q bo'yicha joylashuvni va oraliqni tanlang. So'zlar saytda. Ikkalasi tayyor bo'lsa, «Tayyor»ni bosing.",
      'Теперь настрой шапку под себя. Выбери расстановку по главной оси и расстояние. Слова — на сайте. Когда оба готовы, нажми «Готово».',
      'Now make the header your own. Pick the main axis arrangement and the spacing. The words are on the site. When both are ready, tap “Done”.'),
    ask: L3("Joylashuvni tanlang, keyin oraliqni (gap-…)", 'Выбери расстановку, потом расстояние (gap-…)', 'Pick the arrangement, then the spacing (gap-…)'),
    askGap: L3("Endi oraliqni tanlang: gap-… (Gap sahifasidagi jadval)", 'Теперь выбери расстояние: gap-… (таблица на странице Gap)', 'Now pick the spacing: gap-… (the table on the Gap page)'),
    hints: [
      L3("Kodda ikkita bo'sh joy bor: bosh o'q va oraliq.", 'В коде два пустых места: главная ось и расстояние.', 'The code has two empty spots: the main axis and the spacing.'),
      L3("Birinchisi justify-content bilan, ikkinchisi gap bilan boshlanadi.", 'Первое начинается с justify-content, второе — с gap.', 'The first starts with justify-content, the second with gap.'),
      L3("Masalan: justify-content-around va gap-5. Keyin «Tayyor»ni bosing.", 'Например: justify-content-around и gap-5. Потом нажми «Готово».', 'For example: justify-content-around and gap-5. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning sarlavhangiz.", 'Класс! Это твоя шапка.', 'Nice! This is your header.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men Bootstrapda flex butunlay boshqacha, CSS ni unutish kerak deb o'ylagandim? Afsuski, adashibman. Kartochkaga qarang: har bir so'z ichida CSS dagi o'sha qoida. d-flex bu display flex, justify-content-between bu space-between. Bootstrap ularga qisqa nom bergan, xolos!",
        'Вернёмся к загадке. Помнишь, я думал, что в Bootstrap flex совсем другой и CSS можно забыть? Увы, я ошибся. Посмотри на карточку: внутри каждого слова — то же правило CSS. d-flex — это display flex, justify-content-between — это space-between. Bootstrap просто дал им короткие имена!',
        'Back to our riddle. Remember, I thought flex in Bootstrap was completely different and CSS could be forgotten? Sadly, I was wrong. Look at the card: inside every word is the same CSS rule. d-flex is display flex, justify-content-between is space-between. Bootstrap just gave them short names!'), k: 'riddle' },
      { text: L3("Qarang, mana sizning sarlavhangiz!", 'Смотри, вот твоя шапка!', 'Look, here’s your header!'), k: null },
      { text: L3("d-flex bloklarni qatorga tizadi. U bo'lmasa, qolgan so'zlar ishlamaydi.", 'd-flex выстраивает блоки в ряд. Без него остальные слова не работают.', 'd-flex lines blocks up in a row. Without it, the other words don’t work.'), k: 'flex' },
      { text: L3("justify-content — bosh o'q, align-items — ko'ndalang o'q.", 'justify-content — главная ось, align-items — поперечная.', 'justify-content is the main axis, align-items is the cross axis.'), k: 'axes' },
      { text: L3("gap oraliq beradi, raqamini jadvaldan olamiz. Telefonda esa flex-wrap yordam beradi.", 'gap даёт расстояние, число берём из таблицы. А на телефоне помогает flex-wrap.', 'gap adds spacing, and we take the number from the table. On a phone, flex-wrap helps.'), k: 'gap' },
      { text: L3("Hammasi saytda, Utilities bo'limida.", 'Всё это — на сайте, в разделе Utilities.', 'It’s all on the site, in Utilities.'), k: 'site' },
      { text: L3("Tabriklayman! Siz to'rtinchi darsni tugatdingiz. Keyingi darsda kartochkalar yasaymiz. Ko'rishguncha!", 'Ура! Ты прошёл четвёртый урок. На следующем уроке будем делать карточки. До встречи!', 'Hooray! You finished the fourth lesson. Next time we’ll make cards. See you!'), k: null }
    ],
    roles: {
      flex: L3("d-flex — qator", 'd-flex — ряд', 'd-flex — a row'),
      axes: L3("justify va align — ikki o'q", 'justify и align — две оси', 'justify and align — two axes'),
      gap: L3('gap — oraliq', 'gap — расстояние', 'gap — spacing'),
      site: L3("So'zlar — Utilities da", 'Слова — в Utilities', 'Words are in Utilities')
    },
    ask: L3('Sarlavhangizga qarang', 'Посмотри на свою шапку', 'Look at your header')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1,
  sayNo: 1, sayFlex: 1, mean: 1, sayPage: 1, sayApply: 1, sayStart: 1, sayEnd: 1, sayCenter: 1, say3: 1, say5: 1, say9: 1, sayWrap: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs4-kit.jsx@*/

/*@FILE:bs4-site.jsx@*/

/*@FILE:bs4-head.jsx@*/

/*@FILE:bs4-common.jsx@*/

/*@FILE:bs4-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:../bs1/bs1.css@*/
/*@FILE:../bs2/bs2.css@*/
/*@FILE:../bs3/bs3.css@*/
/*@FILE:bs4.css@*/
`;
