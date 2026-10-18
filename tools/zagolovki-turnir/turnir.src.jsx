// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Заголовки и текст: турнир Пикселя» — урок 2 курса HTML, вариант 10
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node tools/zagolovki-turnir/turnir.build.mjs → lessons/test/10-zagolovki-i-tekst-turnir-pixel.jsx
// Правится исходник tools/zagolovki-turnir/ (turnir.src.jsx, tr-own.css), а не этот файл.
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Заголовки и текст» · модуль 1 «Основы разметки» · ТЕСТ (вариант 10) =====
//
// ЗАМЫСЕЛ. Продолжение урока 1 с роботом Пикселем: у Пикселя есть страница игры
// «Битва знаний», теперь он готовит турнир. На странице весь текст одинаковый —
// игроки теряются. Ученик превращает сплошной текст в понятную страницу:
// главный заголовок, разделы, подразделы, абзацы, ключевые слова, мысли. В финале
// Пиксель показывает страницу ученика игрокам.
// Описание: docs/urok-10-zagolovki-turnir-pixel-opisanie.md.
//
// ДУГА (14). Игроки запутались → h1 → title или h1 → p → h2 → h3 → шесть уровней →
// редактор перепутал уровни → b → i → что изменится → почини строку → твой турнир →
// страница готова.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Работа внутри body: код и мини-браузер строятся из одной модели блоков
//     { id, tag, parts } (помощники урока 2); сохраняемый HTML — buildHtml (с
//     экранированием) из той же модели.
//   · Заголовки — отдельными строками внутри body, без вложения h2 в h1.
//   · Превью честное: строки без тегов склеиваются, Enter в коде абзаца не создаёт,
//     незакрытый <b> захватывает текст ниже.
//   · Учёт: на каждый экран — ряд журнала { done, correct, firstTry, attempts, hints,
//     helped, strongHelp, stages }; раунды и дополнительные примеры (ключ + 'x')
//     хранятся отдельно в store 'st:<экран>' — «Повторить» их не стирает.
//   · После сильной помощи (третья ступень подсказки) — короткий новый пример.
//   · Прогресс живёт в памяти до конца урока; после перезагрузки урок начинается заново.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================

const META = {
  lessonId: 'test-html-zagolovki-turnir-pixel',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'Sarlavhalar va matn: Piksel turniri',
    ru: 'Заголовки и текст: турнир Пикселя',
    en: 'Headings and text: Pixel’s tournament'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      const sv = v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : String(v);
      s = s.split('{' + k + '}').join(sv);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Tuzilma qoidasi', 'Правило структуры', 'Structure rule'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  now: L3('Hozir', 'Сейчас', 'Now'),
  want: L3('Kerakli ko‘rinish', 'Как надо', 'How it should be'),
  tab: L3('Yorliqda', 'На вкладке', 'On the tab'),
  page: L3('Sahifada', 'На странице', 'On the page'),
  nextQ: L3('Keyingi savol', 'Следующий вопрос', 'Next question'),
  nextLine: L3('Keyingi qator', 'Следующая строка', 'Next line'),
  extra: L3('Yangi misol', 'Новый пример', 'New example'),
  step: L3('Qadam', 'Шаг', 'Step'),
  bold: L3('qalin', 'жирный', 'bold'),
  italic: L3('kursiv', 'курсив', 'italic'),
  here: L3('shu yerga', 'сюда', 'here'),
  noChange: L3('O‘zgarmadi', 'Без изменений', 'No change'),
  pixel: L3('Robot Piksel o‘yin sahifasini ko‘rsatyapti', 'Робот Пиксель показывает страницу игры', 'Robot Pixel shows the game page'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  author: L3('Muallif', 'Автор', 'Author'),
  thoughtPre: L3('Piksel o‘yladi:', 'Пиксель подумал:', 'Pixel thought:'),
  edit: L3('O‘zgartirish', 'Изменить', 'Edit'),
  self: L3('maslahatsiz', 'без подсказок', 'no hints'),
  helped: L3('maslahat bilan', 'с подсказкой', 'with hints'),
  levelN: L3('{n}-daraja', 'Уровень {n}', 'Level {n}'),
  roles: {
    whole: L3('butun sahifa nomi', 'название всей страницы', 'name of the whole page'),
    section: L3('bo‘lim nomi', 'название раздела', 'section name'),
    sub: L3('kichik bo‘lim nomi', 'название подраздела', 'subsection name')
  },
  tourn: L3('Turnir!', 'Турнир!', 'Tournament!'),
  kodi: L3('Kodi', 'Коди', 'Kodi')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА ИГРЫ ПИКСЕЛЯ — на языке ученика.
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  name: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  welcome: L3('O‘yinga xush kelibsiz!', 'Добро пожаловать в игру!', 'Welcome to the game!'),
  rules: L3('O‘yin qoidalari', 'Правила игры', 'Game rules'),
  rulesP: L3('Savolni o‘qing va javobni tanlang.', 'Читай вопрос и выбирай ответ.', 'Read the question and pick an answer.'),
  round: L3('Birinchi raund', 'Первый раунд', 'Round one'),
  roundP: L3('Raund mavzusi — hayvonlar.', 'Тема раунда — животные.', 'The round topic is animals.'),
  roundB: L3('hayvonlar', 'животные', 'animals'),
  thoughtP: L3('Piksel o‘yladi: Kim g‘olib bo‘larkin?', 'Пиксель подумал: Интересно, кто победит?', 'Pixel thought: I wonder who will win?'),
  thoughtI: L3('Kim g‘olib bo‘larkin?', 'Интересно, кто победит?', 'I wonder who will win?'),
  news: L3('Turnir yangiliklari', 'Новости турнира', 'Tournament news'),
  newsP: L3('Turnir shanba kuni boshlanadi.', 'Турнир начнётся в субботу.', 'The tournament starts on Saturday.'),
  newsB: L3('Turnir shanba kuni', 'Турнир начнётся', 'The tournament starts'),
  prizes: L3('Sovrinlar', 'Призы', 'Prizes'),
  prizesP: L3('G‘olibga — kubok.', 'Победителю — кубок.', 'The winner gets a cup.'),
  round2: L3('Ikkinchi raund', 'Второй раунд', 'Round two'),
  round2P: L3('Ikkinchi raund mavzusi — koinot.', 'Тема второго раунда — космос.', 'The second round topic is space.'),
  winP: L3('G‘olib kubok oladi.', 'Победитель получит кубок.', 'The winner will get a cup.'),
  winB: L3('kubok', 'кубок', 'cup'),
  timeP: L3('Javobga o‘n soniya beriladi.', 'На ответ — десять секунд.', 'You get ten seconds to answer.'),
  timeB: L3('o‘n soniya', 'десять секунд', 'ten seconds'),
  whisperP: L3('Piksel pichirladi: Albatta uddalayman!', 'Пиксель шепнул: Я точно справлюсь!', 'Pixel whispered: I can totally do this!'),
  whisperI: L3('Albatta uddalayman!', 'Я точно справлюсь!', 'I can totally do this!'),
  kodiP: L3('Kodi o‘yladi: Qiziq bo‘ladi!', 'Коди подумал: Будет весело!', 'Kodi thought: This will be fun!'),
  kodiI: L3('Qiziq bo‘ladi!', 'Будет весело!', 'This will be fun!'),
  birdsP: L3('Raund mavzusi — hayvonlar va qushlar.', 'Тема раунда — животные и птицы.', 'The round topic is animals and birds.'),
  finalP: L3('Final — yakshanba kuni kechqurun.', 'Финал — в воскресенье вечером.', 'The final is on Sunday evening.'),
  finalB: L3('yakshanba', 'воскресенье', 'Sunday'),
  hurrayP: L3('Kodi aytdi: Ura, turnir!', 'Коди сказал: Ура, турнир!', 'Kodi said: Hooray, a tournament!'),
  hurrayI: L3('Ura, turnir!', 'Ура, турнир!', 'Hooray, a tournament!')
};
// Шесть уровней большого турнира (экран 7): текст заголовка и смысл уровня.
const EX6 = [
  { t: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'), m: L3('butun o‘yin', 'вся игра', 'the whole game') },
  { t: L3('Turnirlar', 'Турниры', 'Tournaments'), m: L3('bo‘lim: barcha turnirlar', 'раздел: все турниры', 'section: all tournaments') },
  { t: L3('Kuzgi turnir', 'Осенний турнир', 'Autumn tournament'), m: L3('turnirlardan biri', 'один из турниров', 'one of the tournaments') },
  { t: L3('Birinchi raund', 'Первый раунд', 'Round one'), m: L3('kuzgi turnirning qismi', 'часть осеннего турнира', 'part of the autumn tournament') },
  { t: L3('Hayvonlar haqida savollar', 'Вопросы о животных', 'Questions about animals'), m: L3('birinchi raundning qismi', 'часть первого раунда', 'part of round one') },
  { t: L3('O‘rgimchaklar', 'Пауки', 'Spiders'), m: L3('eng kichik qism: o‘rgimchaklar haqida', 'самая маленькая часть: о пауках', 'the smallest part: about spiders') }
];

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики Коди звучат (короткие, начинаются с живого слова);
// подписи печатаются. Символов «+ / =» в репликах нет.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Turnir', 'Турнир', 'Tournament'),
    cast: [
      { pose: 'hello', text: L3('Piksel turnirga tayyorlanyapti! Lekin o‘yinchilar uning sahifasida adashib qolishyapti: nom qayerda, qoidalar qayerda? Keling, ularga yordam beramiz.',
        'Пиксель готовит турнир! Но игроки теряются на его странице: где название, где правила? Давай поможем им разобраться.',
        'Pixel is getting ready for a tournament! But players get lost on his page: where’s the name, where are the rules? Let’s help them out.') },
      { pose: 'point', text: L3('«Kerakli ko‘rinish»ni bosing va solishtiring.', 'Переключи на «Как надо» и сравни.', 'Switch to “How it should be” and compare.') }
    ],
    heads: L3('Qarang: nom va bo‘limlar sarlavhaga aylandi — ular darhol ko‘rinadi.', 'Смотри: название и разделы стали заголовками — их видно сразу.', 'Look: the name and the sections became headings, so you spot them at once.'),
    paras: L3('Matn xatboshilarga bo‘lingan — o‘qish oson.', 'Текст разбит на абзацы — читать легко.', 'The text is split into paragraphs, so it’s easy to read.'),
    marks: L3('Muhim so‘z qalin, Pikselning fikri esa qiya yozilgan.', 'Важное слово жирное, а мысль Пикселя — наклонная.', 'The key word is bold, and Pixel’s thought is slanted.'),
    done: L3('Ana! Bugun sahifani xuddi shunday qilishni o‘rganamiz.', 'Вот! Сегодня научимся делать страницу такой же.', 'There! Today we’ll learn to make a page just like this.'),
    ask: L3('«Kerakli ko‘rinish»ga o‘ting', 'Переключи на «Как надо»', 'Switch to “How it should be”'),
    askDone: L3('Ikkala ko‘rinishni solishtirish mumkin', 'Оба вида можно сравнивать', 'You can compare both views')
  },

  s2: {
    eyebrow: L3('Bosh sarlavha', 'Главный заголовок', 'Main heading'),
    cast: [
      { pose: 'point', text: L3('Nomni boshqa matndan ajratamiz. Uning oldiga ochuvchi <h1> tegini qo‘yaman.',
        'Отделим название от остального текста. Перед ним ставлю открывающий тег <h1>.',
        'Let’s set the name apart from the rest. I put the opening <h1> tag before it.') },
      { pose: 'explain', text: L3('Oxiriga esa yopuvchi teg. Qarang: sahifada nom katta va qalin bo‘ldi.',
        'А в конце — закрывающий тег. Смотри: на странице название стало крупным и жирным.',
        'And the closing tag at the end. Look: the name on the page got big and bold.') },
      { pose: 'rule', text: L3('<h1> — sahifaning bosh sarlavhasi, inglizcha heading so‘zidan. Odatda u sahifada bitta bo‘ladi.',
        '<h1> — главный заголовок страницы, от английского heading. Обычно он на странице один.',
        '<h1> is the main heading of the page, from the word heading. A page usually has just one.') },
      { pose: 'point', text: L3('Endi o‘z sarlavhangizni yozing — masalan, turniringiz nomini.',
        'Теперь напиши свой заголовок — например, название своего турнира.',
        'Now write your own heading, for example your tournament’s name.') }
    ],
    ask: L3('<h1> ichiga o‘z sarlavhangizni yozing', 'Напиши свой заголовок внутри <h1>', 'Write your own heading inside <h1>'),
    same: L3('Bu Pikselning nomi. O‘zingiznikini yozing.', 'Это название Пикселя. Напиши своё.', 'That’s Pixel’s name. Write your own.'),
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no brackets.'),
    done: L3('Zo‘r-ku! Sarlavhangiz sahifadagi eng katta yozuv.', 'Огонь! Твой заголовок — самая крупная надпись на странице.', 'Awesome! Your heading is the biggest text on the page.'),
    askDone: L3('Sarlavhani istalgan payt o‘zgartirish mumkin', 'Заголовок можно менять и дальше', 'You can keep editing the heading')
  },

  s3: {
    eyebrow: L3('Yorliqmi yoki sahifami?', 'Вкладка или страница?', 'Tab or page?'),
    say: L3('Eslang: title — brauzer yorlig‘idagi nom. <h1> esa sahifaning o‘zida. Qani, tekshiramiz.',
      'Вспомни: title — название на вкладке браузера. А <h1> — на самой странице. Давай проверим.',
      'Remember: title is the name on the browser tab. And <h1> is on the page itself. Let’s test it.'),
    rounds: {
      t: {
        q: L3('Kodi title ichidagi matnni almashtiradi. Yozuv qayerda o‘zgaradi?', 'Коди меняет текст внутри title. Где изменится надпись?', 'Kodi changes the text inside title. Where will the text change?'),
        newText: L3('Piksel turniri', 'Турнир Пикселя', 'Pixel’s Tournament'),
        right: L3('Aniq! title — yorliqdagi nom, sahifa o‘zgarmadi.', 'Чётко! title — это название на вкладке, а страница не изменилась.', 'Spot on! title is the name on the tab, and the page didn’t change.'),
        wrong: L3('Qarang: yorliq o‘zgardi, sahifa esa yo‘q. title — yorliqdagi nom.', 'Смотри: изменилась вкладка, а страница — нет. title — это название на вкладке.', 'Look: the tab changed, but the page didn’t. title is the name on the tab.')
      },
      h: {
        q: L3('Endi Kodi <h1> ichidagi matnni almashtiradi. Yozuv qayerda o‘zgaradi?', 'Теперь Коди меняет текст внутри <h1>. Где изменится надпись?', 'Now Kodi changes the text inside <h1>. Where will the text change?'),
        newText: L3('Turnir boshlandi!', 'Турнир начинается!', 'The tournament begins!'),
        right: L3('Ana! <h1> — sahifadagi sarlavha, yorliq esa o‘sha-o‘sha.', 'Есть! <h1> — заголовок на странице, а вкладка осталась прежней.', 'Yes! <h1> is the heading on the page, and the tab stayed the same.'),
        wrong: L3('Qarang: sahifadagi sarlavha o‘zgardi, yorliq esa yo‘q. <h1> sahifaning o‘zida yashaydi.', 'Смотри: изменился заголовок на странице, а вкладка — нет. <h1> живёт на самой странице.', 'Look: the heading on the page changed, but the tab didn’t. <h1> lives on the page itself.')
      }
    },
    done: L3('Ikkala holat tekshirildi: title — yorliqda, <h1> — sahifada.', 'Оба случая проверены: title — на вкладке, <h1> — на странице.', 'Both cases checked: title is on the tab, <h1> is on the page.'),
    askDone: L3('title — yorliqda, h1 — sahifada', 'title — на вкладке, h1 — на странице', 'title is on the tab, h1 is on the page')
  },

  s4: {
    eyebrow: L3('Xatboshilar', 'Абзацы', 'Paragraphs'),
    cast: [
      { pose: 'point', text: L3('Bu <p> tegi — xatboshi. U matn bo‘lagini o‘rab turadi.', 'Это тег <p> — абзац. Он обнимает кусок текста.', 'This is the <p> tag: a paragraph. It wraps a piece of text.') },
      { pose: 'explain', text: L3('Hozir bitta xatboshida ikki fikr bor: salomlashish va qoidalar.', 'Сейчас в одном абзаце две мысли: приветствие и правила.', 'Right now one paragraph holds two thoughts: the greeting and the rules.') },
      { pose: 'point', text: L3('Ularni ikki xatboshiga ajrating. Qaysi usul ishlaydi?', 'Раздели их на два абзаца. Какой способ сработает?', 'Split them into two paragraphs. Which way will work?') }
    ],
    ask: L3('Salomlashish va qoidalarni ikki xatboshiga ajrating', 'Раздели приветствие и правила на два абзаца', 'Split the greeting and the rules into two paragraphs'),
    opts: {
      enter: L3('Fikrlar orasida Enter bosish', 'Нажать Enter между фразами', 'Press Enter between the sentences'),
      tags: L3('</p> bilan yopib, yangi <p> ochish', 'Закрыть </p> и открыть новый <p>', 'Close with </p> and open a new <p>')
    },
    enterWhy: L3('Kodda qator ko‘chdi, sahifada esa o‘sha bitta xatboshi. Brauzer Enterni ko‘rmaydi — yangi xatboshiga o‘z <p> tegi kerak.',
      'В коде строка перенеслась, а на странице всё тот же один абзац. Браузер не видит Enter — новому абзацу нужен свой <p>.',
      'The code line wrapped, but the page still shows one paragraph. The browser ignores Enter: a new paragraph needs its own <p>.'),
    hints: [
      L3('Sahifaga qarang: matn ikkiga bo‘lindimi?', 'Посмотри на страницу: текст разделился?', 'Look at the page: did the text split?'),
      L3('Har bir xatboshi o‘z <p> va </p> teglari ichida turadi.', 'Каждый абзац стоит в своих <p> и </p>.', 'Each paragraph sits inside its own <p> and </p>.'),
      L3('Yopib, yangi xatboshi ochadigan usulni tanlang.', 'Выбери способ, где абзац закрывается и открывается новый.', 'Choose the way where one paragraph closes and a new one opens.')
    ],
    done: L3('Klass! Endi ikki xatboshi, ular orasida bo‘sh joy bor.', 'Класс! Теперь два абзаца, а между ними — отступ.', 'Cool! Now there are two paragraphs with space between them.'),
    askDone: L3('Har bir fikr — o‘z <p> ichida', 'Каждая мысль — в своём <p>', 'Each thought is in its own <p>')
  },

  s5: {
    eyebrow: L3('Bo‘lim', 'Раздел', 'Section'),
    cast: [
      { pose: 'point', text: L3('Bu <h2> — bo‘lim sarlavhasi. Bu yerda bo‘lim — «O‘yin qoidalari».', 'Это <h2> — заголовок раздела. Здесь раздел — «Правила игры».', 'This is <h2>: a section heading. Here the section is Game rules.') },
      { pose: 'explain', text: L3('Bosh sarlavha bitta, bo‘limlar esa bir nechta bo‘lishi mumkin.', 'Главный заголовок один, а разделов может быть несколько.', 'There’s one main heading, but there can be several sections.') },
      { pose: 'point', text: L3('Yangi bo‘lim qo‘shamiz: «Turnir yangiliklari». Uning sarlavhasiga teg tanlang.', 'Добавим раздел «Новости турнира». Выбери тег для его заголовка.', 'Let’s add a Tournament news section. Choose a tag for its heading.') }
    ],
    ask: L3('«{x}» sarlavhasi uchun teg tanlang', 'Выбери тег для заголовка «{x}»', 'Choose a tag for the “{x}” heading'),
    wrong: {
      h1: L3('Bosh sarlavha allaqachon bor — «Bilimlar jangi». Bu esa alohida bo‘lim, xuddi qoidalar kabi.', 'Главный заголовок уже есть — «Битва знаний». А это отдельный раздел, как «Правила».', 'There’s already a main heading: Battle of Knowledge. This is a separate section, like the rules.'),
      p: L3('<p> — oddiy matn uchun. Bu esa bo‘lim nomi.', '<p> — для обычного текста. А это название раздела.', '<p> is for plain text. This is a section name.')
    },
    hints: [
      L3('Bu sarlavha nimani nomlaydi: butun sahifanimi yoki bo‘limnimi?', 'Что называет этот заголовок: всю страницу или раздел?', 'What does this heading name: the whole page or a section?'),
      L3('Bo‘lim sarlavhasi «O‘yin qoidalari» bilan bir xil tegda.', 'У заголовка раздела тот же тег, что у «Правил игры».', 'A section heading uses the same tag as Game rules.'),
      L3('<h2> ni bosing.', 'Нажми <h2>.', 'Tap <h2>.')
    ],
    done: L3('Super! Endi sahifada ikki bo‘lim bor.', 'Супер! Теперь на странице два раздела.', 'Super! Now the page has two sections.'),
    extraSay: L3('Yana bir misol: «Sovrinlar» bo‘limi. Teg tanlang.', 'Ещё пример: раздел «Призы». Выбери тег.', 'One more: a Prizes section. Choose a tag.'),
    extraDone: L3('Aniq! Bo‘lim — <h2>.', 'Чётко! Раздел — это <h2>.', 'Spot on! A section is <h2>.'),
    askDone: L3('Bo‘lim sarlavhasi — h2', 'Заголовок раздела — h2', 'A section heading is h2')
  },

  s6: {
    eyebrow: L3('Kichik bo‘lim', 'Подраздел', 'Subsection'),
    cast: [
      { pose: 'point', text: L3('<h3> — kichik bo‘lim sarlavhasi: bo‘lim ichidagi qism.', '<h3> — заголовок подраздела: часть внутри раздела.', '<h3> is a subsection heading: a part inside a section.') },
      { pose: 'explain', text: L3('«Birinchi raund» — qoidalarning bir qismi. Uni o‘zi nomlaydigan matn oldiga qo‘ying.', '«Первый раунд» — часть правил. Поставь его перед текстом, который он называет.', 'Round one is part of the rules. Put it before the text it names.') },
      { pose: 'point', text: L3('Kodda qatorni bosing — sarlavha shu qator oldiga qo‘yiladi.', 'Нажми строку кода — заголовок встанет перед ней.', 'Tap a code line: the heading will go right before it.') }
    ],
    ask: L3('<h3> qaysi qator oldida turadi? Qatorni bosing', 'Перед какой строкой встанет <h3>? Нажми строку', 'Which line does <h3> go before? Tap that line'),
    wrong: {
      top: L3('Kichik bo‘lim bo‘lim ichida yashaydi — «O‘yin qoidalari» sarlavhasidan keyin.', 'Подраздел живёт внутри раздела — после заголовка «Правила игры».', 'A subsection lives inside a section, after the Game rules heading.'),
      general: L3('Bu xatboshi — umumiy qoidalar. «Birinchi raund» raund haqidagi matn oldida turadi.', 'Этот абзац — общие правила игры. «Первый раунд» стоит перед текстом про раунд.', 'This paragraph is the general rules. Round one goes before the text about the round.'),
      after: L3('Sarlavha o‘zi nomlaydigan matndan oldin turadi, keyin emas.', 'Заголовок стоит перед текстом, который называет, а не после.', 'A heading goes before the text it names, not after.'),
      news: L3('Bu boshqa bo‘lim — yangiliklar. Raund esa qoidalarning qismi.', 'Это уже другой раздел — новости. А раунд — часть правил.', 'That’s another section: news. The round is part of the rules.')
    },
    hints: [
      L3('Raund haqida qaysi xatboshi gapiradi?', 'Какой абзац рассказывает про раунд?', 'Which paragraph talks about the round?'),
      L3('Kichik bo‘lim sarlavhasi bo‘lim ichida, o‘z matni oldida turadi.', 'Заголовок подраздела стоит внутри раздела, перед своим текстом.', 'A subsection heading sits inside the section, before its text.'),
      L3('Raund mavzusi yozilgan qatorni bosing.', 'Нажми строку о теме раунда.', 'Tap the line about the round topic.')
    ],
    done: L3('Ana! «Birinchi raund» qoidalar ichida, o‘z matni oldida.', 'Есть! «Первый раунд» внутри правил, перед своим текстом.', 'Yes! Round one sits inside the rules, before its text.'),
    extraSay: L3('Yana bir misol: «Ikkinchi raund». Uni o‘z matni oldiga qo‘ying.', 'Ещё пример: «Второй раунд». Поставь его перед его текстом.', 'One more: Round two. Put it before its own text.'),
    extraWrong: L3('«Ikkinchi raund» o‘z matni — koinot haqidagi qator oldida turadi.', '«Второй раунд» стоит перед своим текстом — строкой про космос.', 'Round two goes before its own text: the line about space.'),
    extraDone: L3('Aniq! Kichik bo‘lim — o‘z matni oldida.', 'Чётко! Подраздел — перед своим текстом.', 'Spot on! A subsection goes before its text.'),
    askDone: L3('Kichik bo‘lim — h3, o‘z matni oldida', 'Подраздел — h3, перед своим текстом', 'A subsection is h3, before its text')
  },

  s7: {
    eyebrow: L3('Olti daraja', 'Шесть уровней', 'Six levels'),
    say: L3('Sarlavha darajalari oltita: h1 dan h6 gacha. Har bir keyingisi oldingisining qismi. Har bir qatorni bosing.',
      'Уровней заголовков шесть: от h1 до h6. Каждый следующий — часть предыдущего. Нажми каждую строку.',
      'There are six heading levels, from h1 to h6. Each next one is part of the one before. Tap every line.'),
    tell: [
      L3('h1 — butun o‘yin nomi.', 'h1 — название всей игры.', 'h1 is the name of the whole game.'),
      L3('h2 — bo‘lim: barcha turnirlar.', 'h2 — раздел: все турниры.', 'h2 is a section: all tournaments.'),
      L3('h3 — turnirlardan biri, kuzgisi.', 'h3 — один из турниров, осенний.', 'h3 is one of the tournaments, the autumn one.'),
      L3('h4 — kuzgi turnirning qismi: birinchi raund.', 'h4 — часть осеннего турнира: первый раунд.', 'h4 is part of the autumn tournament: round one.'),
      L3('h5 — birinchi raundning qismi: hayvonlar haqida savollar.', 'h5 — часть первого раунда: вопросы о животных.', 'h5 is part of round one: questions about animals.'),
      L3('h6 — eng kichik qism: o‘rgimchaklar haqida.', 'h6 — самая маленькая часть: о пауках.', 'h6 is the smallest part: about spiders.')
    ],
    all: L3('Hamma olti daraja har bir sahifada shart emas — keraklisini olamiz. Endi savol.',
      'Все шесть уровней нужны не на каждой странице — берём столько, сколько нужно. Теперь вопрос.',
      'Not every page needs all six levels: we use as many as we need. Now a question.'),
    askTap: L3('Har bir sarlavha qatorini bosing', 'Нажми каждую строку заголовка', 'Tap every heading line'),
    q: L3('«Birinchi raund» (h4) ichida yangi kichik bo‘lim paydo bo‘ldi: «Koinot haqida savollar». Uning tegi qaysi?',
      'Внутри «Первого раунда» (h4) появился подраздел «Вопросы о космосе». Какой у него тег?',
      'Inside Round one (h4) there’s a new subsection: Questions about space. Which tag does it get?'),
    qShort: L3('«Koinot haqida savollar» uchun teg', 'Тег для «Вопросов о космосе»', 'A tag for “Questions about space”'),
    qWrong: {
      h3: L3('h3 — kuzgi turnir darajasi, bu yuqoriroq.', 'h3 — это уровень осеннего турнира, он выше.', 'h3 is the autumn tournament level; that’s higher.'),
      h4: L3('h4 — «Birinchi raund»ning o‘zi. Uning qismi bir pog‘ona pastroq.', 'h4 — уровень самого «Первого раунда». Его часть — на ступеньку ниже.', 'h4 is Round one itself. A part of it goes one step lower.')
    },
    hints: [
      L3('«Birinchi raund» qaysi darajada?', 'На каком уровне «Первый раунд»?', 'Which level is Round one on?'),
      L3('Ichidagi qism har doim bir daraja pastroq: raqam bittaga katta.', 'Часть внутри — всегда на уровень ниже: цифра на один больше.', 'A part inside is always one level lower: the number is one bigger.'),
      L3('h4 dan keyin h5 keladi. h5 ni bosing.', 'После h4 идёт h5. Нажми h5.', 'After h4 comes h5. Tap h5.')
    ],
    right: L3('Aynan nishonga! Raund ichidagi qism — h5.', 'В точку! Часть внутри раунда — h5.', 'Nailed it! A part inside the round is h5.'),
    extraQ: L3('«Koinot haqida savollar» (h5) ichida — «Sayyoralar». Qaysi teg?', 'Внутри «Вопросов о космосе» (h5) — подраздел «Планеты». Какой тег?', 'Inside Questions about space (h5) there’s Planets. Which tag?'),
    extraShort: L3('«Sayyoralar» uchun teg', 'Тег для «Планет»', 'A tag for “Planets”'),
    extraWrong: L3('Ichidagi qism bir daraja pastroq: h5 dan keyin h6.', 'Часть внутри — на уровень ниже: после h5 идёт h6.', 'A part inside is one level lower: after h5 comes h6.'),
    done: L3('Zo‘r! Olti daraja — bu ma’no zinapoyasi, shunchaki harf o‘lchami emas.', 'Отлично! Шесть уровней — это лесенка смысла, а не просто размер букв.', 'Great! The six levels are a ladder of meaning, not just letter size.'),
    askDone: L3('Ichidagi qism — bir daraja pastroq', 'Часть внутри — на уровень ниже', 'A part inside is one level lower')
  },

  s8: {
    eyebrow: L3('Darajalar aralashdi', 'Редактор перепутал уровни', 'Mixed-up levels'),
    say: L3('Muharrir darajalarni aralashtirib yubordi. Har bir sarlavha yonida uning roli yozilgan. Mos darajani tanlang.',
      'Редактор перепутал уровни. Рядом с каждым заголовком написана его роль. Выбери подходящий уровень.',
      'The editor mixed up the levels. Each heading has its role next to it. Choose the right level.'),
    ask: L3('«{x}» uchun darajani tanlang', 'Выбери уровень для «{x}»', 'Choose a level for “{x}”'),
    wrong: {
      whole: L3('Bu butun sahifa nomi — eng muhim sarlavha.', 'Это название всей страницы — самый главный заголовок.', 'This is the name of the whole page: the most important heading.'),
      section: L3('Bu bo‘lim nomi: bosh sarlavhadan bir pog‘ona past.', 'Это название раздела: на ступеньку ниже главного.', 'This is a section name: one step below the main heading.'),
      sub: L3('Bu kichik bo‘lim nomi: bo‘limdan bir pog‘ona past.', 'Это название подраздела: на ступеньку ниже раздела.', 'This is a subsection name: one step below a section.'),
      same: L3('Muharrir aynan shuni qo‘ygan edi. Qator rolini qarang.', 'Так и поставил редактор. Посмотри на роль строки.', 'That’s what the editor put. Look at the line’s role.')
    },
    hints: [
      L3('Qator yonidagi rolni o‘qing.', 'Прочитай роль рядом со строкой.', 'Read the role next to the line.'),
      L3('Butun sahifa — h1, bo‘lim — h2, kichik bo‘lim — h3.', 'Вся страница — h1, раздел — h2, подраздел — h3.', 'The whole page is h1, a section is h2, a subsection is h3.'),
      L3('Bu qator uchun {lv} ni bosing.', 'Для этой строки нажми {lv}.', 'For this line, tap {lv}.')
    ],
    okStep: L3('Aniq!', 'Чётко!', 'Spot on!'),
    done: L3('Qoyil, chiqdi! Endi har bir sarlavha o‘z darajasida.', 'Вот это да, получилось! Теперь каждый заголовок на своём уровне.', 'Look at that, it works! Every heading is on its own level now.'),
    extraSay: L3('Yana bitta qator: «Ikkinchi raund» — kichik bo‘lim. Darajani tanlang.', 'Ещё одна строка: «Второй раунд» — подраздел. Выбери уровень.', 'One more line: Round two is a subsection. Choose a level.'),
    askDone: L3('Har bir sarlavha o‘z darajasida', 'Каждый заголовок на своём уровне', 'Every heading is on its level')
  },

  s9: {
    eyebrow: L3('Muhim so‘z', 'Ключевое слово', 'Key word'),
    cast: [
      { pose: 'point', text: L3('Muhim so‘z ko‘zga tashlanishi uchun uni <b> tegi bilan o‘raymiz.', 'Чтобы слово бросалось в глаза, его обнимает тег <b>.', 'To make a word stand out, we wrap it in the <b> tag.') },
      { pose: 'explain', text: L3('Qarang: «hayvonlar» so‘zi qalin bo‘ldi.', 'Смотри: слово «животные» стало жирным.', 'Look: the word animals became bold.') },
      { pose: 'point', text: L3('Endi siz: ikkinchi gapda g‘olib nima olishini qalin qiling.', 'Теперь ты: во второй фразе сделай жирным, что получит победитель.', 'Your turn: in the second sentence, make bold what the winner gets.') }
    ],
    goal: L3('G‘olib nima olishini qalin qiling', 'Сделай жирным, что получит победитель', 'Make bold what the winner gets'),
    goalX: L3('Javobga qancha vaqt berilishini qalin qiling', 'Сделай жирным, сколько времени на ответ', 'Make bold how much time you get'),
    askSel: L3('Kerakli so‘zlarni bosing, keyin <b> ni', 'Нажми нужные слова, потом <b>', 'Tap the words you need, then <b>'),
    askTag: L3('Endi <b> ni bosing', 'Теперь нажми <b>', 'Now tap <b>'),
    wrongSel: L3('Bu so‘zlar emas. G‘olib nima oladi?', 'Не те слова. Что получит победитель?', 'Not those words. What does the winner get?'),
    wrongSelX: L3('Bu so‘zlar emas. Javobga qancha vaqt beriladi?', 'Не те слова. Сколько времени на ответ?', 'Not those words. How much time do you get?'),
    noSel: L3('Avval so‘zni bosing.', 'Сначала нажми слово.', 'Tap a word first.'),
    hints: [
      L3('Gapni o‘qing: g‘olib nima oladi?', 'Прочитай фразу: что получит победитель?', 'Read the sentence: what does the winner get?'),
      L3('Muhim so‘z — gapdagi eng asosiy narsa: sovrin.', 'Ключевое слово — самое главное во фразе: приз.', 'The key word is the most important thing here: the prize.'),
      L3('«{f}» so‘zini bosing, keyin <b> ni.', 'Нажми слово «{f}», потом <b>.', 'Tap the word “{f}”, then <b>.')
    ],
    done: L3('Ana! Endi sovrin darhol ko‘zga tashlanadi.', 'Есть! Теперь приз сразу бросается в глаза.', 'Yes! Now the prize catches the eye right away.'),
    extraSay: L3('Yana bir misol: vaqtni qalin qiling.', 'Ещё пример: выдели время на ответ.', 'One more: make the answer time bold.'),
    extraDone: L3('Zo‘r! Ikki so‘z ham bitta <b> ichida.', 'Отлично! Два слова — внутри одного <b>.', 'Great! Both words sit inside one <b>.'),
    askDone: L3('Muhim so‘z — <b> ichida', 'Ключевое слово — внутри <b>', 'The key word is inside <b>')
  },

  s10: {
    eyebrow: L3('Pikselning fikri', 'Мысль Пикселя', 'Pixel’s thought'),
    cast: [
      { pose: 'point', text: L3('<i> tegi matnni qiya qiladi — bu kursiv. Fikrlarni ko‘pincha shunday yozishadi.', 'Тег <i> делает текст наклонным — это курсив. Так часто пишут мысли.', 'The <i> tag slants the text: that’s italics. Thoughts are often written this way.') },
      { pose: 'explain', text: L3('Qarang: Pikselning fikri qiya bo‘ldi.', 'Смотри: мысль Пикселя стала наклонной.', 'Look: Pixel’s thought is now slanted.') },
      { pose: 'point', text: L3('Endi Pikselning boshqa fikrini belgilang va tegni tanlang.', 'Теперь выдели другую мысль Пикселя и выбери тег.', 'Now select Pixel’s other thought and choose the tag.') }
    ],
    goal: L3('Pikselning fikrini kursiv qiling', 'Сделай мысль Пикселя курсивом', 'Put Pixel’s thought in italics'),
    goalX: L3('Kodining fikrini kursiv qiling', 'Сделай мысль Коди курсивом', 'Put Kodi’s thought in italics'),
    askSel: L3('Fikrning birinchi va oxirgi so‘zini bosing', 'Нажми первое и последнее слово мысли', 'Tap the first and last word of the thought'),
    askTag: L3('Endi tegni tanlang', 'Теперь выбери тег', 'Now choose a tag'),
    wrongSel: L3('Fikr — ikki nuqtadan keyingi so‘zlar, oxirigacha.', 'Мысль — это слова после двоеточия, до конца фразы.', 'The thought is the words after the colon, to the end.'),
    wrongTag: L3('<b> so‘zni qalin qiladi. Fikr uchun qiya yozuv kerak — <i>.', '<b> делает слова жирными. Мысли нужен наклонный текст — <i>.', '<b> makes words bold. A thought needs slanted text: <i>.'),
    noSel: L3('Avval so‘zlarni belgilang.', 'Сначала выдели слова.', 'Select the words first.'),
    hints: [
      L3('Piksel nima deb pichirladi?', 'Что шепнул Пиксель?', 'What did Pixel whisper?'),
      L3('Fikr ikki nuqtadan keyin boshlanadi va gap oxirigacha boradi.', 'Мысль начинается после двоеточия и идёт до конца фразы.', 'The thought starts after the colon and runs to the end.'),
      L3('«{a}» va «{b}» so‘zlarini bosing, keyin <i> ni.', 'Нажми «{a}» и «{b}», потом <i>.', 'Tap “{a}” and “{b}”, then <i>.')
    ],
    done: L3('Super! Pikselning fikri endi qiya — darhol fikr ekani ko‘rinadi.', 'Супер! Мысль Пикселя теперь наклонная — сразу видно, что это мысль.', 'Super! Pixel’s thought is slanted now, so it reads as a thought.'),
    extraSay: L3('Yana bir misol: Kodining fikri.', 'Ещё пример: мысль Коди.', 'One more: Kodi’s thought.'),
    extraDone: L3('Klass! Fikr — <i> ichida.', 'Класс! Мысль — внутри <i>.', 'Cool! The thought is inside <i>.'),
    askDone: L3('Fikr — <i> ichida', 'Мысль — внутри <i>', 'The thought is inside <i>')
  },

  s11: {
    eyebrow: L3('Nima o‘zgaradi?', 'Что изменится?', 'What will change?'),
    say: L3('Endi oldindan aytamiz. Avval javob bering — keyin Kodi o‘zgarishni kiritadi.', 'Теперь предскажем. Сначала ответь — потом Коди внесёт изменение.', 'Now let’s predict. Answer first, then Kodi makes the change.'),
    rounds: {
      p: {
        q: L3('Kodi ikkinchi <p> ni qo‘shadi. Yangi matn qayerda chiqadi?', 'Коди добавит второй <p>. Где появится новый текст?', 'Kodi adds a second <p>. Where will the new text appear?'),
        opts: {
          a: L3('Alohida, birinchi xatboshi ostida', 'Отдельно, под первым абзацем', 'Separately, under the first paragraph'),
          b: L3('O‘sha qatorda, birinchi xatboshidan keyin', 'В той же строке, сразу после первого', 'On the same line, right after the first')
        },
        answer: 'a',
        why: L3('Har bir <p> — alohida xatboshi, u yangi qatordan boshlanadi.', 'Каждый <p> — отдельный абзац, он начинается с новой строки.', 'Each <p> is a separate paragraph, starting on a new line.')
      },
      h: {
        q: L3('Kodi «Turnir yangiliklari»dagi <h2> ni <h3> ga almashtiradi. Nima bo‘ladi?', 'Коди заменит <h2> у «Новостей турнира» на <h3>. Что будет?', 'Kodi changes the <h2> on Tournament news to <h3>. What happens?'),
        opts: {
          a: L3('Joyida qoladi, lekin kichik bo‘lim bo‘ladi — kichikroq', 'Останется на месте, но станет подразделом — мельче', 'Stays in place but becomes a subsection, smaller'),
          b: L3('Yuqoriga, qoidalar yoniga ko‘chadi', 'Переедет выше, к «Правилам»', 'Moves up next to the rules'),
          c: L3('Hech narsa o‘zgarmaydi', 'Ничего не изменится', 'Nothing changes')
        },
        answer: 'a',
        why: L3('Teg sarlavhaning darajasini o‘zgartiradi, joyini emas: endi bu qoidalar ichidagi kichik bo‘lim.', 'Тег меняет уровень заголовка, а не его место: теперь это подраздел внутри «Правил».', 'The tag changes the heading’s level, not its place: now it’s a subsection of the rules.')
      },
      m: {
        q: L3('Kodi so‘zlarni <b> va </b> orasiga oladi. Qaysi so‘zlar qalin bo‘ladi?', 'Коди возьмёт слова в <b> и </b>. Какие слова станут жирными?', 'Kodi puts words between <b> and </b>. Which words become bold?'),
        opts: {
          a: L3('Faqat birinchi so‘z', 'Только первое слово', 'Only the first word'),
          b: L3('<b> va </b> orasidagi hamma so‘zlar', 'Все слова между <b> и </b>', 'All the words between <b> and </b>'),
          c: L3('Butun xatboshi', 'Весь абзац', 'The whole paragraph')
        },
        answer: 'b',
        why: L3('<b> ochilgan joydan </b> gacha bo‘lgan hamma narsa qalin bo‘ladi.', 'Жирным становится всё от <b> до </b>.', 'Everything from <b> to </b> becomes bold.')
      }
    },
    look: L3('Qarang:', 'Смотри:', 'Look:'),
    done: L3('Uchala bashorat tekshirildi! Kod va sahifa qanday bog‘langani endi ko‘rinib turibdi.', 'Все три прогноза проверены! Теперь видно, как код связан со страницей.', 'All three predictions checked! Now you can see how code and page connect.'),
    askDone: L3('Kod sahifani qanday o‘zgartirishi ko‘rindi', 'Видно, как код меняет страницу', 'You can see how code changes the page')
  },

  s12: {
    eyebrow: L3('Qatorni tuzating', 'Почини строку', 'Fix the line'),
    say: L3('Bu qatorlarda teglar joyidan siljib ketgan. Ularni birma-bir tuzatamiz.', 'В этих строках теги съехали. Починим их по одной.', 'The tags in these lines slipped. Let’s fix them one by one.'),
    goals: {
      edge: L3('Faqat «{t}» qalin bo‘lsin', 'Жирным должно быть только «{t}»', 'Only “{t}” should be bold'),
      nest: L3('Teglar tartib bilan yopilsin, fikr to‘liq kursiv', 'Теги закрываются по порядку, вся мысль — курсивом', 'Tags close in order, the whole thought in italics'),
      pair: L3('Yopuvchi teg ochuvchisiga mos kelsin', 'Закрывающий тег должен совпадать с открывающим', 'The closing tag must match the opening one')
    },
    tasks: {
      edge: L3('</b> qaysi so‘zdan keyin turishi kerak? O‘sha so‘zni bosing', 'После какого слова должен стоять </b>? Нажми это слово', 'Which word should </b> follow? Tap that word'),
      nest: L3('</i> uchun joyni bosing', 'Нажми место, где должен стоять </i>', 'Tap the place where </i> belongs'),
      pair: L3('Jufti mos kelmagan tegni bosing', 'Нажми тег, который не подходит к паре', 'Tap the tag that doesn’t match its pair'),
      pair2: L3('Uni qaysi teg bilan almashtiramiz?', 'На какой тег его заменить?', 'Which tag should replace it?')
    },
    intro: {
      edge: L3('Qarang: qalin bo‘lib ortiqcha so‘zlar ham ketgan. </b> ni to‘g‘ri so‘zdan keyin qo‘ying.', 'Смотри: жирными стали лишние слова. Поставь </b> после нужного слова.', 'Look: extra words went bold. Put </b> after the right word.'),
      nest: L3('Bu yerda </i> xatboshidan tashqarida qolgan. Oxirgi ochilgan teg birinchi yopiladi. Brauzer ba’zan o‘zi tuzatadi, lekin kod tartibli bo‘lishi kerak.', 'Здесь </i> оказался снаружи абзаца. Последний открытый тег закрывается первым. Браузер иногда исправляет сам, но код должен быть в порядке.', 'Here </i> ended up outside the paragraph. The last tag opened closes first. The browser sometimes fixes it, but the code should be tidy.'),
      pair: L3('Iya, keyingi xatboshi ham qalin bo‘lib ketdi! Bitta teg o‘z jufti bilan yopilmagan.', 'Ой, жирным стал и следующий абзац! Один тег закрыт не своей парой.', 'Oops, the next paragraph went bold too! One tag is closed by the wrong pair.')
    },
    edgeNow: L3('Hozir qalin: «{f}». Kerak faqat «{t}».', 'Сейчас жирное: «{f}». Нужно только «{t}».', 'Bold now: “{f}”. Only “{t}” should be.'),
    edgeBefore: L3('</b> <b> dan oldin turolmaydi: avval ochamiz, keyin yopamiz.', '</b> не может стоять раньше <b>: сначала открываем, потом закрываем.', '</b> can’t come before <b>: open first, then close.'),
    nestPart: L3('Endi fikrning faqat bir qismi qiya. Butun fikr kursiv bo‘lsin.', 'Теперь наклонная только часть мысли. Нужна вся мысль.', 'Now only part of the thought is slanted. The whole thought should be.'),
    nestOut: L3('U avval ham shu yerda edi — </p> dan keyin. Teg xatboshi ichida ochildi, ichida yopiladi.', 'Здесь он и стоял — после </p>. Тег открылся внутри абзаца — внутри и закрывается.', 'That’s where it was: after </p>. The tag opened inside the paragraph, so it closes inside.'),
    pairFine: L3('Bu teg joyida. <b> nima bilan yopilganiga qarang.', 'Этот тег в порядке. Посмотри, чем закрыт <b>.', 'This tag is fine. Look at what closes <b>.'),
    pairFineI: L3('Bu teg joyida. <i> nima bilan yopilganiga qarang.', 'Этот тег в порядке. Посмотри, чем закрыт <i>.', 'This tag is fine. Look at what closes <i>.'),
    pairSame: L3('Shunday edi — u ochuvchiga mos emas.', 'Так и было — он не подходит к открывающему.', 'That’s how it was: it doesn’t match the opening tag.'),
    pairP: L3('</p> xatboshini yopadi. Ochilgan teg o‘z nomi bilan yopiladi.', '</p> закрывает абзац. Открытый тег закрывается своим именем.', '</p> closes the paragraph. An opened tag closes with its own name.'),
    hints: {
      edge: [
        L3('Sahifaga qarang: qaysi so‘zlar ortiqcha qalin?', 'Посмотри на страницу: какие слова жирные зря?', 'Look at the page: which words are bold for no reason?'),
        L3('</b> qalin bo‘lishi kerak bo‘lgan oxirgi so‘zdan keyin turadi.', '</b> стоит сразу после последнего жирного слова.', '</b> goes right after the last word that should be bold.'),
        L3('«{t}» so‘zini bosing.', 'Нажми слово «{t}».', 'Tap the word “{t}”.')
      ],
      nest: [
        L3('Qaysi teg oxirgi ochildi: xatboshimi yoki kursivmi?', 'Какой тег открылся последним: абзац или курсив?', 'Which tag opened last: the paragraph or the italics?'),
        L3('Teskari tartib: avval </i>, keyin </p>.', 'Обратный порядок: сначала </i>, потом </p>.', 'Reverse order: first </i>, then </p>.'),
        L3('</p> oldidagi joyni bosing.', 'Нажми место прямо перед </p>.', 'Tap the spot right before </p>.')
      ],
      pair: [
        L3('Sahifaga qarang: qalinlik qayerda tugamayapti?', 'Посмотри на страницу: где жирный не заканчивается?', 'Look at the page: where doesn’t the bold end?'),
        L3('Har bir ochuvchi teg o‘z nomi bilan yopiladi.', 'Каждый открывающий тег закрывается своим именем.', 'Each opening tag closes with its own name.'),
        L3('Belgilangan tegni bosing va {w} ni tanlang.', 'Нажми отмеченный тег и выбери {w}.', 'Tap the marked tag and choose {w}.')
      ]
    },
    ok: {
      edge: L3('Aniq! Endi faqat kerakli so‘z qalin.', 'Чётко! Теперь жирное только нужное слово.', 'Spot on! Only the right word is bold now.'),
      nest: L3('Ana! Kursiv xatboshi ichida ochildi va ichida yopildi.', 'Есть! Курсив открылся внутри абзаца и внутри закрылся.', 'Yes! The italics opened inside the paragraph and closed inside it.'),
      pair: L3('Zo‘r-ku! Juftlar mos keldi — ortiqcha qalinlik yo‘qoldi.', 'Огонь! Пары совпали — лишний жирный пропал.', 'Awesome! The pairs match, and the extra bold is gone.')
    },
    extraSay: L3('Yana bir misol — xuddi shu qoida.', 'Ещё пример — на то же правило.', 'One more example, same rule.'),
    done: L3('Barcha qatorlar tuzatildi! Teglar juft va tartib bilan yopiladi.', 'Все строки починены! Теги парные и закрываются по порядку.', 'All lines fixed! Tags are paired and close in order.'),
    askDone: L3('Teglar juft va tartibli', 'Теги парные и по порядку', 'Tags are paired and in order')
  },

  s13: {
    eyebrow: L3('Sizning turniringiz', 'Твой турнир', 'Your tournament'),
    say: L3('Endi o‘z turniringiz sahifasini yasang. Har qadamda avval tegni tanlang, keyin matn yozing.',
      'Теперь сделай страницу своего турнира. На каждом шаге сначала выбери тег, потом напиши текст.',
      'Now build your own tournament page. On each step, first choose a tag, then write the text.'),
    steps: {
      h1: { role: L3('Turnir nomi', 'Название турнира', 'Tournament name'), ph: L3('Masalan: Kuzgi jang', 'Например: Осенняя битва', 'For example: Autumn Battle') },
      h2: { role: L3('Bo‘lim', 'Раздел', 'Section'), ph: L3('Masalan: Qoidalar', 'Например: Правила', 'For example: Rules') },
      p1: { role: L3('Bo‘lim xatboshisi', 'Абзац раздела', 'Section paragraph'), ph: L3('Masalan: Har jamoada uch o‘yinchi.', 'Например: В каждой команде три игрока.', 'For example: Each team has three players.') },
      h3: { role: L3('Kichik bo‘lim', 'Подраздел', 'Subsection'), ph: L3('Masalan: Birinchi raund', 'Например: Первый раунд', 'For example: Round one') },
      p2: { role: L3('Kichik bo‘lim xatboshisi', 'Абзац подраздела', 'Subsection paragraph'), ph: L3('Masalan: Mavzu — sport.', 'Например: Тема — спорт.', 'For example: The topic is sports.') },
      b: { role: L3('Muhim so‘z', 'Ключевое слово', 'Key word') },
      i: { role: L3('Pikselning fikri', 'Мысль Пикселя', 'Pixel’s thought'), ph: L3('Masalan: Kim yutarkin?', 'Например: Кто же победит?', 'For example: Who will win?') }
    },
    askTag: L3('{r}: tegni tanlang', '{r}: выбери тег', '{r}: choose a tag'),
    askText: L3('{r}: matnni yozing', '{r}: напиши текст', '{r}: write the text'),
    askB: L3('Xatboshidagi bitta so‘zni bosing, keyin tegni tanlang', 'Нажми одно слово в абзаце, потом выбери тег', 'Tap one word in a paragraph, then choose a tag'),
    askBTag: L3('Endi «{w}» uchun tegni tanlang', 'Теперь выбери тег для «{w}»', 'Now choose a tag for “{w}”'),
    askI2: L3('Endi fikr uchun tegni tanlang', 'Теперь выбери тег для мысли', 'Now choose a tag for the thought'),
    wrong: {
      h1: L3('Turnir nomi — butun sahifa nomi. Unga bosh sarlavha kerak.', 'Название турнира — название всей страницы. Ему нужен главный заголовок.', 'The tournament name names the whole page. It needs the main heading.'),
      h2: L3('Bu bo‘lim nomi — bosh sarlavhadan bir pog‘ona past.', 'Это название раздела — на ступеньку ниже главного.', 'This is a section name, one step below the main heading.'),
      h3: L3('Bu kichik bo‘lim — bo‘lim ichidagi qism.', 'Это подраздел — часть внутри раздела.', 'This is a subsection: a part inside a section.'),
      p: L3('Bu oddiy matn — unga sarlavha emas, xatboshi kerak.', 'Это обычный текст — ему нужен абзац, а не заголовок.', 'This is plain text: it needs a paragraph, not a heading.'),
      b: L3('Muhim so‘zni qalin qilamiz, kursiv esa fikrlar uchun.', 'Ключевое слово делаем жирным, а курсив — для мыслей.', 'A key word goes bold; italics are for thoughts.'),
      i: L3('Fikrni qiya yozamiz, qalin esa muhim so‘zlar uchun.', 'Мысль пишем наклонно, а жирный — для ключевых слов.', 'A thought is slanted; bold is for key words.'),
      h1taken: L3('Bosh sarlavha allaqachon bor — sahifada u bitta.', 'Главный заголовок уже есть — на странице он один.', 'There’s already a main heading: a page has one.')
    },
    hints: [
      L3('Bu qator nima: nommi yoki oddiy matnmi?', 'Что это за строка: название или обычный текст?', 'What is this line: a name or plain text?'),
      L3('Butun sahifa — h1, bo‘lim — h2, kichik bo‘lim — h3, matn — p. Muhim so‘z — b, fikr — i.', 'Вся страница — h1, раздел — h2, подраздел — h3, текст — p. Ключевое слово — b, мысль — i.', 'Whole page h1, section h2, subsection h3, text p. Key word b, thought i.'),
      L3('{t} ni bosing.', 'Нажми {t}.', 'Tap {t}.')
    ],
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no brackets.'),
    lost: L3('Muhim so‘z matndan yo‘qoldi — so‘zni yana bosing.', 'Ключевое слово пропало из текста — нажми слово ещё раз.', 'The key word left the text: tap a word again.'),
    done: L3('Bu kuchli bo‘ldi! Sahifa tayyor — har bir qism o‘z joyida.', 'Это было мощно! Страница готова — каждая часть на своём месте.', 'That was epic! The page is ready, every part in its place.'),
    askDone: L3('Matnlarni o‘zgartirish mumkin — sahifa yangilanadi', 'Тексты можно менять — страница обновится', 'You can still edit the texts: the page updates')
  },

  s14: {
    eyebrow: L3('Sahifa tayyor', 'Страница готова', 'Page ready'),
    saySelf: L3('Piksel sahifangizni o‘yinchilarga ko‘rsatyapti! Hammasi maslahatsiz chiqdi — xuddi haqiqiy veb-dasturchi kabi!',
      'Пиксель уже показывает твою страницу игрокам! Всё получилось без подсказок — как у настоящего веб-программиста!',
      'Pixel is already showing your page to the players! It all worked without hints, like a real web developer!'),
    sayHelp: L3('Piksel sahifangizni o‘yinchilarga ko‘rsatyapti! Ba’zi joylarda maslahatlar yordam berdi — bu yaxshi, endi hammasi tushunarli.',
      'Пиксель уже показывает твою страницу игрокам! Кое-где помогли подсказки — и это нормально: теперь всё понятно.',
      'Pixel is already showing your page to the players! Hints helped in a few places, and that’s fine: now it all makes sense.'),
    ach: {
      heads: L3('Sarlavhalar h1, h2, h3', 'Заголовки h1, h2, h3', 'Headings h1, h2, h3'),
      levels: L3('Olti daraja h1–h6', 'Шесть уровней h1–h6', 'Six levels h1–h6'),
      title: L3('title va h1 farqi', 'Разница title и h1', 'title vs h1'),
      p: L3('Xatboshilar p', 'Абзацы p', 'Paragraphs p'),
      marks: L3('Qalin b va kursiv i', 'Жирный b и курсив i', 'Bold b and italic i'),
      fix: L3('Bashorat va tuzatish', 'Прогноз и починка строк', 'Predicting and fixing'),
      own: L3('O‘z turnir sahifangiz', 'Своя страница турнира', 'Your own tournament page')
    },
    next: L3('Ro‘yxatlar: punktlar va raqamlar', 'Списки: пункты и номера', 'Lists: bullets and numbers'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2
// ═════════════════════════════════════════════════════════════════════════════
Object.assign(SPOKEN, { heads: 1, paras: 1, marks: 1, right: 1, enterWhy: 1, tell: 1, all: 1, q: 1, qWrong: 1, extraQ: 1,
  extraWrong: 1, extraSay: 1, extraDone: 1, wrongSel: 1, wrongSelX: 1, wrongTag: 1, noSel: 1, intro: 1, edgeBefore: 1, nestPart: 1,
  nestOut: 1, pairFine: 1, pairFineI: 1, pairSame: 1, pairP: 1, okStep: 1, noTags: 1, same: 1, lost: 1, saySelf: 1, sayHelp: 1, why: 1 });
Object.assign(NOT_SPOKEN_IN, { rounds: { newText: 1, opts: 1, answer: 1 } });

/*@PIXEL@*/

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ: текст → части блока; склейка строк без тегов (как браузер).
// ─────────────────────────────────────────────────────────────────────────────
function markParts(text, frag, tag) {
  const i = frag ? text.indexOf(frag) : -1;
  if (i < 0) return [txt(text)];
  return [txt(text.slice(0, i)), { k: tag, v: frag }, txt(text.slice(i + frag.length))].filter((x) => x.v !== '');
}
const pb = (pick, id, tag, key) => blk(id, tag, pick(PAGE[key]));
function glue(lines) {
  const out = [];
  lines.forEach((b) => {
    const last = out[out.length - 1];
    if (!b.tag && last && !last.tag) out[out.length - 1] = { id: last.id, tag: null, parts: last.parts.concat([txt(' ')], b.parts) };
    else out.push(b);
  });
  return out;
}
const okText = (s) => hasLetters(s) && !hasTags(s);
const nonEmpty = (parts) => parts.filter((x) => x.v !== '');
// Полная страница Пикселя (крючок, «как надо»).
function demoPage(pick) {
  return [pb(pick, 'name', 'h1', 'name'), pb(pick, 'welcome', 'p', 'welcome'), pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'),
    pb(pick, 'round', 'h3', 'round'), blk('roundP', 'p', markParts(pick(PAGE.roundP), pick(PAGE.roundB), 'b')),
    blk('thoughtP', 'p', markParts(pick(PAGE.thoughtP), pick(PAGE.thoughtI), 'i')), pb(pick, 'news', 'h2', 'news'), pb(pick, 'newsP', 'p', 'newsP')];
}
// Та же страница «стеной»: всё одним текстом.
const lumpPage = (pick) => [blk('lump', null, demoPage(pick).map(plain).join(' '))];

// ─────────────────────────────────────────────────────────────────────────────
// УЧЁТ. Статистика экрана в store 'st:<id>' (не стирается «Повторить»):
//   rounds — обязательные раунды; stages[k] = { misses, hint, done };
//   дополнительный пример раунда k — stages[k + 'x'].
// Ряд журнала: done — всё выполнено; correct — каждый раунд решён без промахов и
// без третьей ступени подсказки, либо после неё дополнительный пример решён
// без промахов; firstTry — без промахов и подсказок; helped / strongHelp.
// ─────────────────────────────────────────────────────────────────────────────
function statRow(id, s) {
  const st = s.stages || {};
  const rounds = s.rounds || [];
  const one = (k) => st[k] || { misses: 0, hint: 0, done: false };
  const clean = (g, maxHint) => !!(g && g.done && g.misses === 0 && (g.hint || 0) < maxHint);
  const roundOk = (k) => one(k).done && (clean(one(k), 3) || clean(st[k + 'x'], 2));
  const done = rounds.every((k) => one(k).done && (!st[k + 'x'] || st[k + 'x'].done));
  const keys = Object.keys(st);
  const hints = keys.reduce((n, k) => n + (st[k].hint || 0), 0);
  return {
    screenId: id, type: s.type, done, correct: done && rounds.every(roundOk),
    firstTry: done && rounds.every((k) => one(k).misses === 0 && !one(k).hint),
    attempts: rounds.reduce((n, k) => n + one(k).misses + (one(k).done ? 1 : 0), 0),
    hints, helped: hints > 0, strongHelp: keys.some((k) => (st[k].hint || 0) >= 3), stages: st
  };
}
function useStat(id, type, rounds) {
  const store = useStore();
  const log = useLog();
  return useMemo(() => {
    const write = (fn) => {
      const cur = store.get('st:' + id);
      const s = cur ? JSON.parse(JSON.stringify(cur)) : { stages: {} };
      s.type = type; s.rounds = rounds;
      fn(s);
      store.set('st:' + id, s);
      log(statRow(id, s));
      return s;
    };
    const g = (s, k) => s.stages[k] || (s.stages[k] = { misses: 0, hint: 0, done: false });
    return {
      miss: (k) => write((s) => { g(s, k).misses += 1; }),
      hint: (k, lv) => write((s) => { const x = g(s, k); x.hint = Math.max(x.hint || 0, lv); }),
      pass: (k) => write((s) => { g(s, k).done = true; }),
      touch: () => write(() => {}),
      get: () => store.get('st:' + id) || null
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
}
// Итог экрана для достижений: 'self' — без промахов и сильной помощи; 'help' — сделано с помощью.
function screenResult(store, id) {
  const s = store.get('st:' + id);
  if (!s) return null;
  const r = statRow(id, s);
  if (!r.done) return null;
  return r.correct && !r.strongHelp && !r.helped ? 'self' : 'help';
}

// ЛЕСЕНКА ПОДСКАЗОК: направить → принцип → конкретное действие. Ступень растёт
// от промаха (miss) и от кнопки «Подсказка» в шапке. Ступень пишется в учёт.
function useHelp(stat, stageKey, active) {
  const [lv, setLv] = useState(0);
  const r = useRef(0);
  const keyRef = useRef(stageKey); keyRef.current = stageKey;
  const actRef = useRef(active); actRef.current = active;
  const [btnN, setBtnN] = useState(0);
  const bump = useCallback(() => {
    r.current = Math.min(3, r.current + 1);
    setLv(r.current);
    stat.hint(keyRef.current, r.current);
    return r.current;
  }, [stat]);
  const reset = useCallback(() => { r.current = 0; setLv(0); }, []);
  const pulse = useHintPulse();
  const seen = useRef(pulse);
  useEffect(() => {
    if (pulse === seen.current) return;
    seen.current = pulse;
    if (actRef.current) { bump(); setBtnN((n) => n + 1); }
  }, [pulse, bump]);
  return { lv, bump, reset, ref: r, btnN };
}
const hintAt = (hints, lv, vars) => (hints && lv > 0 ? fillL(hints[Math.min(lv, hints.length) - 1], vars || {}) : null);
const nextHint = (hints, lv, vars) => (hints ? fillL(hints[Math.min(lv, hints.length - 1)], vars || {}) : null);

// Достижение-группа: 'self' / 'help' / null.
function groupResult(store, ids) {
  const rs = ids.map((id) => screenResult(store, id));
  if (rs.some((x) => !x)) return null;
  return rs.every((x) => x === 'self') ? 'self' : 'help';
}
const ACH = [['heads', ['s2', 's5', 's6', 's8']], ['levels', ['s7']], ['title', ['s3']], ['p', ['s4']], ['marks', ['s9', 's10']], ['fix', ['s11', 's12']], ['own', ['s13']]];
function achievements(store) {
  const out = {};
  ACH.forEach(([k, ids]) => { const r = groupResult(store, ids); if (r) out[k] = r; });
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// СВОЯ СТРАНИЦА (экран 13) → блоки, HTML, артефакт. Одна функция для превью,
// для экрана у Пикселя и для onFinished.
// ─────────────────────────────────────────────────────────────────────────────
const OWN_ORDER = ['h1', 'h2', 'p1', 'h3', 'p2', 'b', 'i'];
const OWN_TAG = { h1: 'h1', h2: 'h2', p1: 'p', h3: 'h3', p2: 'p', b: 'b', i: 'i' };
function ownBlocks(own, pick, opts) {
  const o = own || {};
  const tags = o.tags || {}, texts = o.texts || {};
  const o2 = opts || {};
  const out = [];
  ['h1', 'h2', 'p1', 'h3', 'p2'].forEach((id) => {
    if (!tags[id]) return;
    const t = String(texts[id] || '').trim();
    if (!t && !o2.keepEmpty) return;
    let parts = [txt(t)];
    if (o.bold && o.bold.line === id && t) parts = markParts(t, o.bold.word, 'b');
    out.push(blk(id, tags[id], parts));
  });
  const th = String(texts.i || '').trim();
  if (th || o2.keepEmpty) {
    const pre = pick(UI.thoughtPre) + ' ';
    out.push(blk('i', 'p', [txt(pre), tags.i === 'i' && th ? { k: 'i', v: th } : txt(th)]));
  }
  return out.map((b) => Object.assign({}, b, { parts: nonEmpty(b.parts) }));
}
function ownTitle(own, pick) {
  const t = own && own.texts && String(own.texts.h1 || '').trim();
  return t || pick(PAGE.name);
}
function makeArtifact(store) {
  const own = store.get('s13');
  if (!own || !own.done) return null;
  const pick = (n) => (n && typeof n === 'object' ? (n[own.lang] !== undefined ? n[own.lang] : n.ru) : n);
  const blocks = ownBlocks(own, pick);
  const title = ownTitle(own, pick);
  return { type: 'html-page', title, blocks, html: buildHtml(title, blocks) };
}

// ─────────────────────────────────────────────────────────────────────────────
// ЧАСТИ ИНТЕРФЕЙСА
// ─────────────────────────────────────────────────────────────────────────────
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask tr-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
// Без голоса строка героя на «тесных» экранах телефона спрятана (voiceTop) —
// тогда реплика Коди печатается здесь, под заданием. Текст всегда доступен.
// Прочитанная реплика через несколько секунд сворачивается в одну строку (экран
// не растёт), нажатие разворачивает её снова.
function SayLine({ speaker, skip }) {
  const pick = usePick();
  const audio = useAudio();
  const line = speaker && speaker.text ? pick(speaker.text) : '';
  const [fold, setFold] = useState(false);
  useEffect(() => {
    setFold(false);
    if (!line) return undefined;
    const t = setTimeout(() => setFold(true), Math.max(7000, estimateMs(line) + 4000));
    return () => clearTimeout(t);
  }, [line, speaker && speaker.nonce]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!(audio && audio.failed) || !line) return null;
  if (skip && pick(skip) === line) return null;   // тот же текст уже в строке задания
  return (
    <button type="button" className={'tr-say only-narrow' + (fold ? ' is-fold' : '')} aria-live="polite" aria-expanded={!fold} onClick={() => setFold((f) => !f)}>
      <span className="tr-say-k">{pick(UI.kodi)}:</span> {line}
    </button>
  );
}
// Робот Пиксель (фигура из урока 07): texts — надписи на его экране.
function Pix({ texts, cls }) {
  const pick = usePick();
  const ref = useRef(null);
  const html = useMemo(() => ({ __html: PIX.svg }), []);
  const key = JSON.stringify(texts || {});
  useLayoutEffect(() => {
    const t = texts || {};
    if (!ref.current) return;
    ref.current.querySelectorAll('[data-t]').forEach((n) => {
      const k = n.getAttribute('data-t');
      if (t[k] === undefined) return;
      n.textContent = t[k];
      const fit = Number(n.getAttribute('data-fit'));
      n.removeAttribute('textLength');
      n.removeAttribute('lengthAdjust');
      if (fit && t[k] && n.getComputedTextLength && n.getComputedTextLength() > fit) {
        n.setAttribute('textLength', String(fit));
        n.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={ref} className={'tr-fig iso fig-robot rb-html rb-css rb-js' + (cls ? ' ' + cls : '')} data-theme="light"
    style={{ '--ar': PIX.ar }} role="img" aria-label={pick(UI.pixel)} dangerouslySetInnerHTML={html} />;
}
// Кнопки тегов: неверная гаснет; после двух промахов светится верная (glow).
function TagPick({ tags, onPick, canTap, off, glow, led }) {
  return (
    <div className="tr-tags" role="group" translate="no">
      {tags.map((t) => {
        const dead = !!off && off.indexOf(t) >= 0;
        return (
          <button key={t} type="button" className={'tr-tag' + (dead ? ' is-off' : '') + (glow === t ? ' is-glow' : '')}
            disabled={!canTap || dead} onClick={() => onPick(t)}>
            <Tag tag={t} /><Led on={!!led && !dead} />
          </button>
        );
      })}
    </div>
  );
}
// Варианты ответа (прогноз): после ответа выбранный помечен, верный подсвечен.
function Opts({ opts, order, onPick, canTap, picked, answer, led }) {
  const pick = usePick();
  return (
    <div className="tr-opts" role="group">
      {/* После ответа остаются только выбранный и верный варианты — экран не растёт. */}
      {order.filter((k) => !picked || k === picked || k === answer).map((k) => (
        <button key={k} type="button" disabled={!canTap || !!picked}
          className={'tr-opt' + (picked === k ? (k === answer ? ' is-ok' : ' is-no') : '') + (picked && picked !== k && k === answer ? ' is-real' : '')}
          onClick={() => onPick(k)}>
          <span>{pick(opts[k])}</span><Led on={!!led && !picked} />
        </button>
      ))}
    </div>
  );
}
// Подсветка частей кода по зонам (z): токен с зоной из списка получает is-hl.
const zoneHl = (list) => (z) => (list && list.indexOf(z) >= 0 ? { cls: 'is-hl' } : null);
// Автозасчёт текста: через 1 с после последней правки, если текст годится.
function useAutoAccept(value, ok, onAccept) {
  const cb = useRef(onAccept);
  cb.current = onAccept;
  useEffect(() => {
    if (!ok) return undefined;
    const t = setTimeout(() => cb.current(value), 1000);
    return () => clearTimeout(t);
  }, [value, ok]);
}
// Защёлка: стало true — дальше всегда true (конец вступления не «отменяется»
// следующими репликами Коди).
function useLatch(cond) {
  const [v, setV] = useState(!!cond);
  useEffect(() => { if (cond && !v) setV(true); }, [cond, v]);
  return v || !!cond;
}
// Один раз за жизнь экрана выполнить при условии.
function useWhen(cond, fn) {
  const done = useRef(false);
  const f = useRef(fn); f.current = fn;
  useEffect(() => { if (cond && !done.current) { done.current = true; f.current(); } }, [cond]);
}

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. ИГРОКИ ЗАПУТАЛИСЬ. «Сейчас» (сплошной текст) ↔ «Как надо»; Коди по ходу
// речи подсвечивает заголовки, абзацы и выделения.
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const stat = useStat('s1', 'explore', ['view']);
  const [rec, put] = useRec('s1');
  const [view, setView] = useState(rec ? 'want' : 'now');
  const [told, setTold] = useState(!!rec);
  const [speaker, say, spoken] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const solved = !!rec || (told && spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !told, 0);
  useWhen(told && spoken && !rec, () => { put({ done: true }); stat.pass('view'); });
  const change = (v) => {
    setView(v);
    if (v === 'want' && !told) {
      setTold(true);
      say(c.heads, 'point'); say(c.paras, 'explain'); say(c.marks, 'point'); say(c.done, 'cheer');
    }
  };
  const now = speaker.text;
  const hl = view !== 'want' ? null : now === c.heads ? ['name', 'rules', 'round', 'news'] : now === c.paras ? ['welcome', 'rulesP', 'newsP']
    : now === c.marks ? ['roundP', 'thoughtP'] : null;
  const blocks = view === 'want' ? demoPage(pick) : lumpPage(pick);
  const ask = solved ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} />
      <div className="tr-hook">
        <Pix texts={{ scr1: pick(PAGE.name), scr2: pick(UI.tourn) }} cls="tr-fig-sm" />
        <div className={'tr-seg' + (led ? ' is-led' : '')}>
          <SegToggle value={view} onChange={(v) => { if (canTap || v === 'now') change(v); }}
            options={[{ v: 'now', label: UI.now }, { v: 'want', label: UI.want }]} />
          <Led on={led} />
        </div>
      </div>
      <MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page key={view} blocks={blocks} hl={hl} fresh={view === 'want' ? blocks.map((b) => b.id) : null} />} />
    </Stage>
  );
}

// ── 2. ИМЯ НА СТРАНИЦЕ. Коди показывает пару <h1> (подсветка тега и результата
// синхронно с речью), потом ученик пишет свой заголовок.
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const stat = useStat('s2', 'write', ['write']);
  const [rec, put] = useRec('s2');
  const [head, setHead] = useState(rec ? rec.head : pick(PAGE.name));
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const solved = !!rec;
  const canGo = useAdvanceGate(solved, spoken);
  const now = speaker.text;
  const writing = useLatch(solved || spoken);
  const led = useIdleLed(canTap && writing && !solved, head.length);
  const sample = pick(PAGE.name);
  const changed = head.trim().toLowerCase() !== sample.toLowerCase();
  const good = okText(head) && changed;
  useAutoAccept(head, good && !solved && writing, (v) => {
    put({ head: v.trim() }); setMsg(null); stat.pass('write'); sfx('ok', true); sayNow(c.done, 'cheer');
  });
  // После «Готово» правки продолжают сохраняться.
  useEffect(() => { if (solved && good && rec && rec.head !== head.trim()) put({ head: head.trim() }); }, [head]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!writing || solved) return undefined;
    if (hasTags(head)) { setMsg(c.noTags); return undefined; }
    if (okText(head) && !changed) { const t = setTimeout(() => setMsg(c.same), 2500); return () => clearTimeout(t); }
    setMsg(null);
    return undefined;
  }, [head, writing, solved]); // eslint-disable-line react-hooks/exhaustive-deps
  const zone = writing ? null : now === c.cast[0].text ? ['name:o'] : now === c.cast[1].text ? ['name:c'] : null;
  const pageHl = !writing && (now === c.cast[1].text || now === c.cast[2].text) ? ['name'] : null;
  const lineHl = !writing && now === c.cast[2].text;
  const blocks = [blk('name', 'h1', writing ? head : sample), blk('welcome', null, pick(PAGE.welcome))];
  const lines = srcLines(blocks, { frame: 'body' }).map((ln) => {
    if (ln.id !== 'name' || !writing) return ln;
    return Object.assign({}, ln, { toks: [ln.toks[0], { k: 'node', node: (
      <InlineInput value={head} onChange={setHead} max={40} label={c.ask} cls={led ? 'is-led-in' : ''} />
    ) }, ln.toks[ln.toks.length - 1]] });
  });
  const ask = solved ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={glue(blocks)} hl={pageHl} />} />}
        code={<Src lines={lines} className="tr-src" zone={zoneHl(zone)}
          lineProps={(ln) => (ln.id === 'name' ? { cls: 'tr-in' + (lineHl || writing ? ' is-hl' : '') } : null)} />} />
    </Stage>
  );
}

// ── 3. ВКЛАДКА ИЛИ СТРАНИЦА? Прогноз: меняется title → где? меняется h1 → где?
const S3_ROUNDS = [{ id: 't', answer: 'tab' }, { id: 'h', answer: 'page' }];
function S3({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s3;
  const stat = useStat('s3', 'predict', ['t', 'h']);
  const [rec, put] = useRec('s3');
  const startH1 = (store.get('s2') && store.get('s2').head) || pick(PAGE.name);
  const [ri, setRi] = useState(rec ? 2 : 0);
  const [picked, setPicked] = useState(rec ? rec.picked : {});
  const [title, setTitle] = useState(rec ? pick(c.rounds.t.newText) : pick(PAGE.name));
  const [h1, setH1] = useState(rec ? pick(c.rounds.h.newText) : startH1);
  const [flash, setFlash] = useState({ tab: 0, page: 0 });
  const done = ri >= 2;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' },
    ...(done ? [] : [{ text: c.rounds.t.q, pose: 'curious' }])]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const R = S3_ROUNDS[Math.min(ri, 1)];
  const cr = c.rounds[R.id];
  const answered = !!picked[R.id];
  const led = useIdleLed(canTap && !done && !answered, ri);
  const choose = (k) => {
    if (!canTap || answered || done) return;
    const right = k === R.answer;
    setPicked((x) => Object.assign({}, x, { [R.id]: k }));
    if (!right) stat.miss(R.id);
    stat.pass(R.id);
    sfx(right ? 'ok' : 'soft', true);
    if (R.id === 't') { setTitle(pick(cr.newText)); setFlash((f) => ({ tab: f.tab + 1, page: f.page })); }
    else { setH1(pick(cr.newText)); setFlash((f) => ({ tab: f.tab, page: f.page + 1 })); }
    sayNow(right ? cr.right : cr.wrong, right ? 'smile' : 'explain');
  };
  const next = () => {
    if (!canTap) return;
    sfx('tap', true);
    if (ri === 0) { setRi(1); sayNow(c.rounds.h.q, 'curious'); }
    else { setRi(2); put({ picked }); sayNow(c.done, 'cheer'); }
  };
  const blocks = [blk('h1', 'h1', h1), blk('welcome', null, pick(PAGE.welcome))];
  const lines = srcLines(blocks, { frame: 'hb', title });
  const target = done ? null : R.id === 't' ? 'title' : 'b-h1';
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : cr.q} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} />
      <Ask text={done ? c.askDone : cr.q} n={done ? null : (ri + 1) + '/2'} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={title} flashTab={flash.tab} flashPage={flash.page} cls="tr-mb"
          hl={!done && answered ? (R.id === 't' ? 'title' : 'body') : null} page={<Page blocks={glue(blocks)} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => (ln.key === target ? { cls: 'is-hl' } : null)} />} />
      {!done ? (
        <>
          {!answered ? <Opts opts={{ tab: UI.tab, page: UI.page }} order={['tab', 'page']} onPick={choose} canTap={canTap} picked={picked[R.id]} answer={R.answer} led={led} /> : (
            <div className={'tr-verdict' + (picked[R.id] === R.answer ? ' is-ok' : ' is-no')}>
              <span className="tr-verdict-ic"><Icon name={picked[R.id] === R.answer ? 'check' : 'bulb'} size={16} /></span>
              <span className="tr-verdict-t">{pick(R.answer === 'tab' ? UI.tab : UI.page)}</span>
              <button type="button" className="btn-accent tr-next-b" disabled={!canTap} onClick={next}>
                {pick(ri === 0 ? UI.nextQ : UI.done)}<Icon name="arrowR" size={16} /></button>
            </div>
          )}
        </>
      ) : null}
    </Stage>
  );
}

// ── 4. ТЕКСТУ НУЖНЫ АБЗАЦЫ. Один <p> с двумя мыслями → как разделить: Enter или
// </p> + <p>. Enter честно ничего не меняет на странице.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  const stat = useStat('s4', 'choice', ['split']);
  const [rec, put] = useRec('s4');
  const [state, setState] = useState(rec ? 'split' : 'one');   // one · enter · split
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [pin, setPin] = useState(null);
  const done = state === 'split';
  const help = useHelp(stat, 'split', !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, off.length);
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!pin) return undefined; const t = setTimeout(() => setPin(null), 2200); return () => clearTimeout(t); }, [pin]);
  const choose = (k) => {
    if (!canTap || done) return;
    if (k === 'enter') {
      sfx('soft', true); stat.miss('split'); help.bump();
      setState('enter'); setOff(['enter']); setPin(UI.noChange); setMsg(c.enterWhy); sayNow(c.enterWhy, 'explain');
      return;
    }
    sfx('pop', true); setState('split'); setMsg(null); put({ done: true }); stat.pass('split');
    sayNow(c.done, 'cheer');
  };
  const now = speaker.text;
  const intro = !useLatch(!!rec || spoken);
  const welcome = pick(PAGE.welcome), rules = pick(PAGE.rulesP);
  const blocks = done
    ? [pb(pick, 'name', 'h1', 'name'), blk('w', 'p', welcome), blk('r', 'p', rules)]
    : [pb(pick, 'name', 'h1', 'name'), blk('w', 'p', welcome + ' ' + rules)];
  let lines = srcLines(blocks, { frame: 'body' });
  if (state === 'enter') {
    // Перенос строки внутри абзаца: в коде две строки, абзац всё ещё один.
    lines = lines.flatMap((ln) => (ln.id !== 'w' ? [ln] : [
      Object.assign({}, ln, { key: 'w1', toks: [ln.toks[0], { k: 'text', v: welcome, z: 'w:0' }] }),
      { key: 'w2', d: ln.d, toks: [{ k: 'text', v: rules, z: 'w:1' }, ln.toks[ln.toks.length - 1]], cls: 'tr-enter' }
    ]));
  }
  const zone = intro && now === c.cast[0].text ? ['w:o', 'w:c'] : null;
  const pageHl = intro && (now === c.cast[0].text || now === c.cast[1].text) ? ['w'] : done ? null : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={done ? c.askDone : c.ask} hint={done ? null : msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" pins={pin ? { page: pin } : null}
          page={<Page blocks={blocks} hl={pageHl} fresh={done ? ['r'] : null} />} />}
        code={<Src lines={lines} className="tr-src" zone={zoneHl(zone)}
          lineProps={(ln) => (ln.cls ? { cls: ln.cls } : ln.id === 'r' ? { cls: 'tr-in' } : null)} />} />
      {!done ? (
        <div className="tr-opts" role="group">
          {['enter', 'tags'].map((k) => (
            <button key={k} type="button" disabled={!canTap || off.indexOf(k) >= 0}
              className={'tr-opt' + (off.indexOf(k) >= 0 ? ' is-off' : '') + (help.lv >= 3 && k === 'tags' ? ' is-glow' : '')}
              onClick={() => choose(k)}>
              <span className="tr-opt-ic mono" aria-hidden="true">{k === 'enter' ? '↵' : '</p><p>'}</span>
              <span>{pick(c.opts[k])}</span><Led on={led && off.indexOf(k) < 0} />
            </button>
          ))}
        </div>
      ) : null}
    </Stage>
  );
}

// ── 5. РАЗДЕЛ «ПРАВИЛА». Показ h2; ученик выбирает тег для «Новостей турнира».
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const stat = useStat('s5', 'choose-tag', ['news']);
  const [rec, put] = useRec('s5');
  const [stage, setStage] = useState(rec ? 'done' : 'news');   // news · newsx · done
  const [tagNews, setTagNews] = useState(rec ? 'h2' : null);
  const [tagPrize, setTagPrize] = useState(rec && rec.extra ? 'h2' : null);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const done = stage === 'done';
  const help = useHelp(stat, stage === 'newsx' ? 'newsx' : 'news', !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, off.length + (stage === 'newsx' ? 5 : 0));
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const key = stage === 'newsx' ? 'newsx' : 'news';
  const choose = (t) => {
    if (!canTap || done) return;
    if (t !== 'h2') {
      sfx('soft', true); wobble(key); stat.miss(key);
      const lv = help.bump();
      setOff((o) => o.concat(t));
      const why = c.wrong[t];
      const h = lv >= 3 ? joinL(why, c.hints[2]) : why;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('ok', true); stat.pass(key); setMsg(null); setOff([]);
    if (stage === 'news') {
      setTagNews('h2');
      if (help.ref.current >= 3) { help.reset(); setStage('newsx'); sayNow(joinL(c.done, c.extraSay), 'smile'); return; }
      setStage('done'); put({ done: true }); sayNow(c.done, 'cheer');
    } else {
      setTagPrize('h2'); setStage('done'); put({ done: true, extra: true }); sayNow(c.extraDone, 'cheer');
    }
  };
  const now = speaker.text;
  const intro = !useLatch(!!rec || spoken);
  const extraOn = stage === 'newsx' || !!tagPrize;
  const showNew = !intro;
  const base = [pb(pick, 'name', 'h1', 'name'), pb(pick, 'welcome', 'p', 'welcome'), pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP')];
  const more = showNew ? [blk('news', tagNews, pick(PAGE.news)), pb(pick, 'newsP', 'p', 'newsP')] : [];
  const more2 = extraOn ? [blk('prizes', tagPrize, pick(PAGE.prizes)), pb(pick, 'prizesP', 'p', 'prizesP')] : [];
  const blocks = base.concat(more, more2);
  const lines = srcLines(blocks, { frame: 'body', collapse: (b) => b.id === 'welcome' || b.id === 'rulesP' }).map((ln) => {
    if ((ln.id === 'news' && !tagNews) || (ln.id === 'prizes' && !tagPrize)) {
      return Object.assign({}, ln, { tag: 'h1', toks: [{ k: 'node', node: <span className="tr-slot-tag mono">h?</span> }, ln.toks[ln.toks.length - 1]] });
    }
    return ln;
  });
  const curId = stage === 'newsx' ? 'prizes' : 'news';
  const rulesHl = intro && (now === c.cast[0].text) ? ['rules'] : null;
  const ask = done ? c.askDone : fillL(c.ask, { x: stage === 'newsx' ? PAGE.prizes : PAGE.news });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={done ? null : msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={glue(blocks)} hl={rulesHl || (done ? null : [curId])} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => (ln.id === 'rules' && rulesHl ? { cls: 'is-hl' }
          : ln.id === curId && !done ? { cls: 'is-hl' + (shake === key ? ' tr-shake' : '') } : (ln.id === 'news' || ln.id === 'prizes') ? { cls: 'tr-in' } : null)} />} />
      {!done && showNew ? <TagPick tags={['h1', 'h2', 'p']} onPick={choose} canTap={canTap} off={off} glow={off.length >= 2 || help.lv >= 3 ? 'h2' : null} led={led} /> : null}
    </Stage>
  );
}

// ── 6. ВНУТРИ РАЗДЕЛА. h3 «Первый раунд» — нажать место перед подходящим абзацем.
const S6_LINES = ['name', 'welcome', 'rules', 'rulesP', 'roundP', 'news', 'newsP'];
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const stat = useStat('s6', 'place', ['place']);
  const [rec, put] = useRec('s6');
  const [stage, setStage] = useState(rec ? 'done' : 'place');   // place · placex · done
  const [placed, setPlaced] = useState(rec ? { round: true, round2: !!rec.extra } : {});
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const done = stage === 'done';
  const key = stage === 'placex' ? 'placex' : 'place';
  const help = useHelp(stat, key, !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, help.lv + (stage === 'placex' ? 9 : 0));
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const extraOn = stage === 'placex' || !!placed.round2;
  // Строки страницы (без h3); в доп. примере — абзац про второй раунд.
  const order = S6_LINES.slice();
  if (extraOn) order.splice(order.indexOf('roundP') + 1, 0, 'round2P');
  const want = stage === 'placex' ? 'round2P' : 'roundP';   // h3 ставится перед этой строкой
  const why = (before) => {
    if (stage === 'placex') return c.extraWrong;
    const i = order.indexOf(before);
    if (before === null || i > order.indexOf('news')) return c.wrong.news;
    if (i <= order.indexOf('rules')) return c.wrong.top;
    if (before === 'rulesP') return c.wrong.general;
    return c.wrong.after;
  };
  const tapSlot = (before) => {
    if (!canTap || done) return;
    if (before !== want) {
      sfx('soft', true); stat.miss(key); setShake(before); setTimeout(() => setShake(null), 420);
      const lv = help.bump();
      const h = lv >= 3 ? joinL(why(before), c.hints[2]) : why(before);
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('pop', true); stat.pass(key); setMsg(null);
    if (stage === 'place') {
      setPlaced({ round: true });
      if (help.ref.current >= 3) { help.reset(); setStage('placex'); sayNow(joinL(nextPraiseL(), c.extraSay), 'smile'); return; }
      setStage('done'); put({ done: true }); sayNow(c.done, 'cheer');
    } else {
      setPlaced({ round: true, round2: true }); setStage('done'); put({ done: true, extra: true }); sayNow(c.extraDone, 'cheer');
    }
  };
  const textOf = { name: ['h1', 'name'], welcome: ['p', 'welcome'], rules: ['h2', 'rules'], rulesP: ['p', 'rulesP'], roundP: ['p', 'roundP'],
    round2P: ['p', 'round2P'], news: ['h2', 'news'], newsP: ['p', 'newsP'] };
  const blocks = [];
  order.forEach((id) => {
    if (id === 'roundP' && placed.round) blocks.push(pb(pick, 'round', 'h3', 'round'));
    if (id === 'round2P' && placed.round2) blocks.push(pb(pick, 'round2', 'h3', 'round2'));
    blocks.push(pb(pick, id, textOf[id][0], textOf[id][1]));
  });
  const introDone = useLatch(spoken || !!rec);
  const tapOn = !done && introDone;
  let lines = srcLines(blocks, { frame: 'body', collapse: (b) => b.id === 'welcome' || b.id === 'newsP' || (extraOn && b.id === 'rulesP') });
  // В дополнительном примере строки до «Первого раунда» свёрнуты в одно «…» — на телефоне код помещается.
  if (stage === 'placex') {
    const at = lines.findIndex((ln) => ln.id === 'round');
    lines = [lines[0], { key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }].concat(lines.slice(at));
  }
  const chip = stage === 'placex' ? PAGE.round2 : PAGE.round;
  const intro = !introDone;
  const rulesHl = intro && speaker.text === c.cast[1].text ? ['rules', 'rulesP', 'roundP'] : null;
  const markLine = help.lv >= 3 ? want : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={done ? c.askDone : c.ask} hint={done ? null : msg} />
      {!done ? <div className="tr-chip-row" translate="no"><span className="tr-chip"><Tag tag="h3" /><span className="tk-tx">{pick(chip)}</span><Tag tag="h3" close /></span></div> : null}
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={glue(blocks)} hl={rulesHl}
          fresh={placed.round ? [placed.round2 ? 'round2' : 'round'] : null} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => {
          // Нажатая строка — «поставь заголовок перед ней». Первая строка (h1) не годится.
          if (tapOn && ln.id && order.indexOf(ln.id) > 0) {
            return { onTap: () => tapSlot(ln.id), disabled: !canTap, led: ln.id === markLine,
              cls: 'tr-pickline' + (shake === ln.id ? ' tr-shake' : '') + (ln.id === markLine ? ' is-hl' : '') };
          }
          if (rulesHl && rulesHl.indexOf(ln.id) >= 0) return { cls: 'is-hl' };
          if (ln.id === 'round' || ln.id === 'round2') return { cls: 'tr-in is-new' };
          return null;
        }} />} />
    </Stage>
  );
}

// ── 7. ШЕСТЬ УРОВНЕЙ. Большой турнир: нажать каждую строку h1…h6, потом вопрос.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  const stat = useStat('s7', 'levels', ['q']);
  const [rec, put] = useRec('s7');
  const [seen, setSeen] = useState(rec ? [0, 1, 2, 3, 4, 5] : []);
  const [cur, setCur] = useState(null);
  const [stage, setStage] = useState(rec ? 'done' : 'explore');   // explore · q · qx · done
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const done = stage === 'done';
  const key = stage === 'qx' ? 'qx' : 'q';
  const help = useHelp(stat, key, stage === 'q' || stage === 'qx');
  const [speaker, say, spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, seen.length * 10 + off.length);
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const tapLine = (i) => {
    if (!canTap || stage !== 'explore') return;
    sfx('tap', true);
    setCur(i);
    const ns = seen.indexOf(i) >= 0 ? seen : seen.concat(i);
    setSeen(ns);
    if (ns.length >= 6) { sayNow(c.tell[i], 'point'); say(c.all, 'explain'); say(c.q, 'curious'); setStage('q'); }
    else sayNow(c.tell[i], 'point');
  };
  const qOpts = stage === 'qx' ? ['h4', 'h5', 'h6'] : ['h3', 'h4', 'h5'];
  const want = stage === 'qx' ? 'h6' : 'h5';
  const answer = (t) => {
    if (!canTap || done) return;
    if (t !== want) {
      sfx('soft', true); stat.miss(key);
      const lv = help.bump();
      setOff((o) => o.concat(t));
      const why = stage === 'qx' ? c.extraWrong : c.qWrong[t];
      const h = lv >= 3 ? joinL(why, stage === 'qx' ? null : c.hints[2]) : why;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('ok', true); stat.pass(key); setMsg(null); setOff([]);
    if (stage === 'q' && help.ref.current >= 3) { help.reset(); setStage('qx'); sayNow(joinL(c.right, c.extraQ), 'smile'); return; }
    setStage('done'); put({ done: true }); sayNow(joinL(c.right, c.done), 'cheer');
  };
  const blocks = EX6.map((x, i) => blk('l' + (i + 1), 'h' + (i + 1), pick(x.t)));
  const lines = srcLines(blocks, { frame: 'body' });
  const ask = done ? c.askDone : stage === 'explore' ? c.askTap : stage === 'qx' ? c.extraShort : c.qShort;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : stage === 'explore' ? c.askTap : msg || nextHint(c.hints, help.lv)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={done ? null : msg} n={stage === 'explore' ? seen.length + '/6' : null} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(EX6[0].t)} cls="tr-mb" page={<Page blocks={blocks} hl={cur != null ? ['l' + (cur + 1)] : null} />} />}
        code={<Src lines={lines} className="tr-src tr-src-lv" lineProps={(ln) => {
          if (!ln.id) return null;
          const i = Number(ln.id.slice(1)) - 1;
          return {
            onTap: () => tapLine(i), disabled: !canTap || stage !== 'explore', led: led && stage === 'explore' && seen.indexOf(i) < 0 && i === Math.min(...[0, 1, 2, 3, 4, 5].filter((k) => seen.indexOf(k) < 0)),
            cls: 'tr-lv tr-lv-' + (i + 1) + (cur === i ? ' is-hl' : '') + (seen.indexOf(i) >= 0 ? ' is-seen' : ''),
            after: seen.indexOf(i) >= 0 ? <span className="tr-mean">{pick(EX6[i].m)}</span> : null
          };
        }} />} />
      {stage === 'q' || stage === 'qx' ? (
        <TagPick tags={qOpts} onPick={answer} canTap={canTap} off={off} glow={off.length >= 2 || help.lv >= 3 ? want : null} led={led} />
      ) : null}
    </Stage>
  );
}

// ── 8. РЕДАКТОР ПЕРЕПУТАЛ УРОВНИ. Роль у каждой строки → назначить уровень.
const S8_ROWS = [
  { id: 'name', key: 'name', role: 'whole', bad: 3, want: 1 },
  { id: 'rules', key: 'rules', role: 'section', bad: 1, want: 2 },
  { id: 'round', key: 'round', role: 'sub', bad: 2, want: 3 }
];
const S8_EXTRA = { id: 'round2', key: 'round2', role: 'sub', bad: 1, want: 3 };
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const stat = useStat('s8', 'assign', ['name', 'rules', 'round']);
  const [rec, put] = useRec('s8');
  const [lv, setLv] = useState(rec ? { name: 1, rules: 2, round: 3, round2: rec.extra ? 3 : undefined } : {});
  const [extraOn, setExtraOn] = useState(!!(rec && rec.extra));
  const [sel, setSel] = useState(null);
  const [miss, setMiss] = useState({});
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const rows = extraOn ? S8_ROWS.concat(S8_EXTRA) : S8_ROWS;
  const open = rows.filter((r) => lv[r.id] !== r.want);
  const done = !!rec || (open.length === 0 && (!extraOn || lv.round2 === 3));
  const cur = sel && open.find((r) => r.id === sel) ? sel : (open[0] ? open[0].id : null);
  const row = rows.find((r) => r.id === cur);
  const stageKey = cur === 'round2' ? 'roundx' : cur || 'name';
  const help = useHelp(stat, stageKey, !done);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec ? c.done : c.say, pose: rec ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, open.length * 10 + (miss[cur] || 0));
  useEffect(() => { if (help.btnN && row) setMsg(hintAt(c.hints, help.lv, { lv: 'h' + row.want })); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const choose = (t) => {
    if (!canTap || done || !row) return;
    const n = Number(t.slice(1));
    if (n !== row.want) {
      sfx('soft', true); stat.miss(stageKey); setShake(row.id); setTimeout(() => setShake(null), 420);
      setMiss((m) => Object.assign({}, m, { [row.id]: (m[row.id] || 0) + 1 }));
      const l = help.bump();
      const why = n === (lv[row.id] || row.bad) ? c.wrong.same : c.wrong[row.role];
      const h = l >= 3 ? joinL(why, fillL(c.hints[2], { lv: 'h' + row.want })) : why;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('ok', true); stat.pass(stageKey); setMsg(null);
    const strong = help.ref.current >= 3;
    help.reset(); setSel(null);
    const nl = Object.assign({}, lv, { [row.id]: n });
    setLv(nl);
    const left = rows.filter((r) => nl[r.id] !== r.want);
    if (row.id === 'round2') { put({ done: true, extra: true }); sayNow(c.done, 'cheer'); return; }
    if (strong && !extraOn) { setExtraOn(true); sayNow(joinL(c.okStep, c.extraSay), 'smile'); return; }
    if (!left.length || (left.length === 1 && left[0].id === 'round2')) {
      if (extraOn && nl.round2 !== 3) { sayNow(joinL(c.okStep, c.extraSay), 'smile'); return; }
      put({ done: true }); sayNow(c.done, 'cheer');
    } else sayNow(c.okStep, 'smile');
  };
  // Только заголовки: роли и уровни видны без лишних строк (телефон).
  const blocks = rows.map((r) => blk(r.id, 'h' + (lv[r.id] || r.bad), pick(PAGE[r.key])));
  const lines = srcLines(blocks, { frame: 'body' });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv, { lv: row ? 'h' + row.want : 'h1' })} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={done ? c.askDone : fillL(c.ask, { x: row ? PAGE[row.key] : '' })} hint={done ? null : msg} />
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} hl={cur && !done ? [cur] : null} />} />}
        code={<Src lines={lines} className="tr-src" lineProps={(ln) => {
          const r = rows.find((x) => x.id === ln.id);
          if (!r) return null;
          const ok = lv[r.id] === r.want;
          return {
            onTap: () => { if (canTap && !done && !ok) { sfx('tap', true); setSel(r.id); setMsg(null); help.reset(); } },
            disabled: !canTap || done || ok,
            cls: 'tr-roleline' + (r.id === cur && !done ? ' is-hl' : '') + (ok ? ' tr-fixed' : '') + (shake === r.id ? ' tr-shake' : ''),
            after: <span className={'tr-role' + (ok ? ' is-ok' : '')}>{pick(UI.roles[r.role])}</span>
          };
        }} />} />
      {!done ? <TagPick tags={['h1', 'h2', 'h3']} onPick={choose} canTap={canTap} glow={row && ((miss[row.id] || 0) >= 2 || help.lv >= 3) ? 'h' + row.want : null} led={led} /> : null}
    </Stage>
  );
}

// ── 9–10. ВЫДЕЛЕНИЕ СЛОВ: показ на одной фразе, потом своя фраза (WordLine).
// conf: { id, demo: { key, frag, tag }, task: { key, frag, goal, wrongSel }, extra: {...}, tags, punct }
function MarkScreen({ p, c, conf }) {
  const pick = usePick();
  const stat = useStat(conf.id, 'mark', ['mark']);
  const [rec, put] = useRec(conf.id);
  const [stage, setStage] = useState(rec ? 'done' : 'mark');   // mark · markx · done
  const [marked, setMarked] = useState(rec ? { task: true, extra: !!rec.extra } : {});
  const [sel, tapWord, setSel] = useWordSel();
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(null);
  const done = stage === 'done';
  const key = stage === 'markx' ? 'markx' : 'mark';
  const help = useHelp(stat, key, !done);
  const [speaker, , spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (sel ? 1 : 0) + help.lv * 3 + (stage === 'markx' ? 20 : 0));
  const T = stage === 'markx' ? conf.extra : conf.task;
  const toks = useMemo(() => toTokens(pick(PAGE[T.key])), [T.key, pick]); // eslint-disable-line react-hooks/exhaustive-deps
  const frag = pick(PAGE[T.frag]);
  const fragWords = frag.replace(/[!?.…]+$/, '');
  const target = findRange(toks, fragWords);
  const words = target ? toks.slice(target[0], target[1] + 1).filter((t) => t.w).map((t) => t.v) : [];
  const vars = { f: fragWords, a: words[0] || '', b: words[words.length - 1] || '' };
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv, vars)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const writeMiss = (h) => { sfx('soft', true); stat.miss(key); const lv = help.bump(); const hh = lv >= 3 ? fillL(c.hints[2], vars) : h; setMsg(hh); sayNow(hh, 'think'); };
  const onTag = (t) => {
    if (!canTap || done) return;
    if (!sel) { sfx('soft', true); setMsg(c.noSel); return; }
    const okSel = target && sel.a === target[0] && sel.b === target[1];
    if (!okSel) { setSel(null); writeMiss(stage === 'markx' ? (c.wrongSelX || c.wrongSel) : c.wrongSel); return; }
    if (t !== conf.tag) { writeMiss(c.wrongTag); return; }
    sfx('ok', true); stat.pass(key); setSel(null); setMsg(null);
    const which = stage === 'markx' ? 'extra' : 'task';
    setMarked((m) => Object.assign({}, m, { [which]: true }));
    setFlash({ id: which === 'extra' ? 'x' : 't', n: Date.now() });
    if (stage === 'mark' && help.ref.current >= 3) { help.reset(); setStage('markx'); sayNow(joinL(c.done, c.extraSay), 'smile'); return; }
    setStage('done'); put({ done: true, extra: stage === 'markx' }); sayNow(stage === 'markx' ? c.extraDone : c.done, 'cheer');
  };
  const now = speaker.text;
  const intro = !useLatch(!!rec || spoken);
  const demoOn = !intro || now !== c.cast[0].text;   // тег появляется на второй реплике
  const markOf = (key2, frag2, on) => blk(key2, 'p', on ? markParts(pick(PAGE[key2]), pick(PAGE[frag2]).replace(conf.punct ? /$/ : /[!?.…]+$/, ''), conf.tag) : pick(PAGE[key2]));
  const blocks = [blk('d', 'p', demoOn ? markParts(pick(PAGE[conf.demo.key]), pick(PAGE[conf.demo.frag]), conf.tag) : pick(PAGE[conf.demo.key]))];
  if (!intro) blocks.push(Object.assign(markOf(conf.task.key, conf.task.frag, marked.task), { id: 't' }));
  if (stage === 'markx' || marked.extra) blocks.push(Object.assign(markOf(conf.extra.key, conf.extra.frag, marked.extra), { id: 'x' }));
  const editId = done ? null : stage === 'markx' ? 'x' : 't';
  const hl = intro && now === c.cast[1].text ? ['d'] : editId ? [editId] : null;
  const lines = srcLines(blocks, { frame: 'body' });
  // Знаки в конце мысли (!, ?) входят в выделение вместе с последним словом.
  const withPunct = (s) => {
    if (!s || !conf.punct) return s;
    let b = s.b;
    while (toks[b + 1] && /^[!?.…]+$/.test(toks[b + 1].v)) b += 1;
    return { a: s.a, b };
  };
  const goal = stage === 'markx' ? c.goalX : c.goal;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints, help.lv, vars)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      {done ? <GoalCard done doneText={c.askDone} /> : !intro ? <GoalCard goal={goal} n={stage === 'markx' ? 2 : 1} total={stage === 'markx' ? 2 : 1} /> : null}
      {!done && !intro ? <Ask text={sel ? c.askTag : c.askSel} hint={msg} /> : null}
      <Work cls="tr-work"
        browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} hl={hl} flash={flash} />} />}
        code={<Src lines={lines} className="tr-src" zone={zoneHl(intro && now === c.cast[1].text ? ['d:1:o', 'd:1:c'] : null)}
          lineProps={(ln) => (ln.id === editId && !intro ? {
            cls: 'is-hl',
            content: <><Tag tag="p" /><WordLine toks={toks} marks={[]} sel={withPunct(sel)} onWord={(i) => { if (canTap) { sfx('tap', true); setMsg(null); tapWord(i); } }}
              canTap={canTap} led={led && !sel} hlRange={help.lv >= 3 ? target : null} /><Tag tag="p" close /></>
          } : (ln.id === 'd' && intro && now === c.cast[1].text ? { cls: 'is-hl' } : null))} />} />
      {!done && !intro ? <TagPick tags={conf.tags} onPick={(t) => onTag(t)} canTap={canTap} led={led && !!sel} /> : null}
    </Stage>
  );
}
// Выбор: при заданном conf.punct выделение мысли включает её знак в конце.
const S9_CONF = { id: 's9', tag: 'b', tags: ['b'], punct: false,
  demo: { key: 'roundP', frag: 'roundB' }, task: { key: 'winP', frag: 'winB' }, extra: { key: 'timeP', frag: 'timeB' } };
const S10_CONF = { id: 's10', tag: 'i', tags: ['b', 'i'], punct: true,
  demo: { key: 'thoughtP', frag: 'thoughtI' }, task: { key: 'whisperP', frag: 'whisperI' }, extra: { key: 'kodiP', frag: 'kodiI' } };
const S9 = ({ p }) => <MarkScreen p={p} c={C.s9} conf={S9_CONF} />;
const S10 = ({ p }) => <MarkScreen p={p} c={C.s10} conf={S10_CONF} />;

// ── 11. ЧТО ИЗМЕНИТСЯ? Три прогноза: сначала ответ, потом изменение и объяснение.
const S11_ORDER = ['p', 'h', 'm'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const stat = useStat('s11', 'predict', S11_ORDER);
  const [rec, put] = useRec('s11');
  const [ri, setRi] = useState(rec ? 3 : 0);
  const [picked, setPicked] = useState(rec ? rec.picked : {});
  const done = ri >= 3;
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.rounds.p.q, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const id = S11_ORDER[Math.min(ri, 2)];
  const R = c.rounds[id];
  const answered = !!picked[id];
  const led = useIdleLed(canTap && !done && !answered, ri);
  const choose = (k) => {
    if (!canTap || answered || done) return;
    const right = k === R.answer;
    setPicked((x) => Object.assign({}, x, { [id]: k }));
    if (!right) stat.miss(id);
    stat.pass(id);
    sfx(right ? 'ok' : 'soft', true);
    sayNow(joinL(right ? nextPraiseL() : c.look, R.why), right ? 'smile' : 'explain');
  };
  const next = () => {
    if (!canTap) return;
    sfx('tap', true);
    if (ri < 2) { setRi(ri + 1); sayNow(c.rounds[S11_ORDER[ri + 1]].q, 'curious'); }
    else { setRi(3); put({ picked }); sayNow(c.done, 'cheer'); }
  };
  // Состояние кода и страницы раунда: до ответа — изменение видно только в коде
  // (пунктиром), после — и на странице.
  const after = answered;
  let blocks = [], codeBlocks = [], ghost = null;
  if (id === 'p') {
    const base = [pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP')];
    codeBlocks = base.concat(pb(pick, 'timeP', 'p', 'timeP')); ghost = after ? null : 'timeP';
    blocks = after ? codeBlocks : base;
  } else if (id === 'h') {
    const mk = (lvl) => [pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'), pb(pick, 'news', lvl, 'news'), pb(pick, 'newsP', 'p', 'newsP')];
    codeBlocks = mk('h3'); ghost = after ? null : 'news';
    blocks = after ? mk('h3') : mk('h2');
  } else {
    const plainB = [pb(pick, 'news', 'h2', 'news'), pb(pick, 'newsP', 'p', 'newsP')];
    const boldB = [pb(pick, 'news', 'h2', 'news'), blk('newsP', 'p', markParts(pick(PAGE.newsP), pick(PAGE.newsB), 'b'))];
    codeBlocks = boldB; ghost = after ? null : 'newsP';
    blocks = after ? boldB : plainB;
  }
  const order = id === 'h' ? ['a', 'b', 'c'] : id === 'p' ? ['a', 'b'] : ['a', 'b', 'c'];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : R.q} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} />
      <Ask text={done ? c.askDone : R.q} n={done ? null : (ri + 1) + '/3'} />
      {!done ? (
        <Work cls="tr-work"
          browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} flash={after ? { id: id === 'p' ? 'timeP' : id === 'h' ? 'news' : 'newsP', n: 1 } : null} />} />}
          code={<Src lines={srcLines(codeBlocks, { frame: 'none' })} className="tr-src" lineProps={(ln) => (ln.id === ghost ? { cls: 'tr-ghost' } : ln.id === (id === 'p' ? 'timeP' : id === 'h' ? 'news' : 'newsP') ? { cls: 'is-hl' } : null)} />} />
      ) : (
        <Work cls="tr-work" browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={[pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'), pb(pick, 'timeP', 'p', 'timeP'),
          pb(pick, 'news', 'h3', 'news'), blk('newsP', 'p', markParts(pick(PAGE.newsP), pick(PAGE.newsB), 'b'))]} />} />}
          code={<Src lines={srcLines([pb(pick, 'rules', 'h2', 'rules'), pb(pick, 'rulesP', 'p', 'rulesP'), pb(pick, 'timeP', 'p', 'timeP'),
            pb(pick, 'news', 'h3', 'news'), blk('newsP', 'p', markParts(pick(PAGE.newsP), pick(PAGE.newsB), 'b'))], { frame: 'body' })} className="tr-src" />} />
      )}
      {!done ? (
        <>
          {!answered ? <Opts opts={R.opts} order={order} onPick={choose} canTap={canTap} picked={picked[id]} answer={R.answer} led={led} /> : (
            // После ответа — одна строка: верный ответ и кнопка дальше (экран не растёт).
            <div className={'tr-verdict' + (picked[id] === R.answer ? ' is-ok' : ' is-no')}>
              <span className="tr-verdict-ic"><Icon name={picked[id] === R.answer ? 'check' : 'bulb'} size={16} /></span>
              <span className="tr-verdict-t">{pick(R.opts[R.answer])}</span>
              <button type="button" className="btn-accent tr-next-b" disabled={!canTap} onClick={next}>
                {pick(ri < 2 ? UI.nextQ : UI.done)}<Icon name="arrowR" size={16} /></button>
            </div>
          )}
        </>
      ) : null}
    </Stage>
  );
}

// ── 12. ПОЧИНИ СТРОКУ. Три поломки: граница выделения, порядок закрытия, пара тегов.
// У каждой — основной пример и дополнительный (после сильной помощи).
const S12_ROUNDS = [
  { id: 'edge', kind: 'edge', key: 'birdsP', open: 'roundB', want: 'roundB', bad: 'birdsP', x: { key: 'finalP', open: 'finalB', want: 'finalB' } },
  { id: 'nest', kind: 'nest', key: 'thoughtP', frag: 'thoughtI', tag: 'i', x: { key: 'hurrayP', frag: 'hurrayI', tag: 'i' } },
  { id: 'pair', kind: 'pair', key: 'winP', frag: 'winB', tag: 'b', wrongClose: 'i', next: 'newsP', x: { key: 'kodiP', frag: 'kodiI', tag: 'i', wrongClose: 'b', next: 'newsP' } }
];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const stat = useStat('s12', 'fix', ['edge', 'nest', 'pair']);
  const [rec, put] = useRec('s12');
  const [ri, setRi] = useState(rec ? 3 : 0);
  const [isX, setIsX] = useState(false);
  const [edgeEnd, setEdgeEnd] = useState(null);      // индекс токена, после которого стоит </b>
  const [nestAt, setNestAt] = useState('out');       // место </i>: 'out' (после </p>), 'end' (перед </p>) или индекс слова
  const [pairPick, setPairPick] = useState(false);   // найден тег без пары
  const [fixed, setFixed] = useState(false);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const done = ri >= 3;
  const R = S12_ROUNDS[Math.min(ri, 2)];
  const D = isX ? Object.assign({}, R, R.x) : R;
  const key = R.id + (isX ? 'x' : '');
  const help = useHelp(stat, key, !done && !fixed);
  const [speaker, , spoken, sayNow] = useVoice(done ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.intro.edge, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done && !fixed, ri * 10 + help.lv + (isX ? 5 : 0));
  const text = pick(PAGE[D.key]);
  const toks = useMemo(() => toTokens(text), [text]);
  const wIdx = (s) => { const r = findRange(toks, s); return r ? r : null; };
  // Граница: открывающий <b> — перед словом open; конец по умолчанию — последнее слово фразы.
  const openR = R.kind === 'edge' ? wIdx(pick(PAGE[D.open])) : null;
  const wantR = R.kind === 'edge' ? wIdx(pick(PAGE[D.want])) : null;
  const lastWord = (() => { for (let i = toks.length - 1; i >= 0; i -= 1) if (toks[i].w) return i; return 0; })();
  const curEnd = edgeEnd == null ? lastWord : edgeEnd;
  // Порядок: слова мысли.
  const fragR = R.kind !== 'edge' ? wIdx(pick(PAGE[D.frag]).replace(/[!?.…]+$/, '')) : null;
  let fragEnd = fragR ? fragR[1] : 0;
  while (toks[fragEnd + 1] && /^[!?.…]+$/.test(toks[fragEnd + 1].v)) fragEnd += 1;
  const vars = R.kind === 'edge' ? { t: pick(PAGE[D.want]) } : R.kind === 'pair' ? { w: '</' + D.tag + '>' } : {};
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints[R.kind], help.lv, vars)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  const startRound = (i, x) => {
    setEdgeEnd(null); setNestAt('out'); setPairPick(false); setFixed(false); setMsg(null); help.reset();
    if (x) { setIsX(true); return; }
    setIsX(false); setRi(i);
  };
  const missWith = (why) => {
    sfx('soft', true); stat.miss(key);
    const lv = help.bump();
    const h = lv >= 3 ? joinL(why, fillL(c.hints[R.kind][2], vars)) : why;
    setMsg(h); sayNow(h, 'think');
  };
  const win = () => {
    sfx('ok', true); stat.pass(key); setFixed(true); setMsg(null);
    const strong = help.ref.current >= 3;
    if (!isX && strong) { sayNow(joinL(c.ok[R.kind], c.extraSay), 'smile'); setTimeout(() => startRound(ri, true), reduceMotion() ? 0 : 1200); return; }
    if (ri >= 2) { setRi(3); put({ done: true }); sayNow(joinL(c.ok[R.kind], c.done), 'cheer'); return; }
    sayNow(joinL(c.ok[R.kind], c.intro[S12_ROUNDS[ri + 1].kind]), 'smile');
    setTimeout(() => startRound(ri + 1, false), reduceMotion() ? 0 : 900);
  };
  // ── действия
  const tapEdge = (i) => {
    if (!canTap || fixed) return;
    if (i < openR[0]) { missWith(c.edgeBefore); return; }
    setEdgeEnd(i);
    if (i === wantR[1]) { win(); return; }
    missWith(fillL(c.edgeNow, { f: toks.slice(openR[0], i + 1).map((t) => t.v).join(''), t: pick(PAGE[D.want]) }));
  };
  const tapNest = (at) => {
    if (!canTap || fixed) return;
    setNestAt(at);
    if (at === 'end') { win(); return; }
    missWith(at === 'out' ? c.nestOut : c.nestPart);
  };
  const tapPairTag = (which) => {
    if (!canTap || fixed) return;
    if (which === 'close') { sfx('tap', true); setPairPick(true); setMsg(null); return; }
    missWith(D.tag === 'i' ? c.pairFineI : c.pairFine);
  };
  const pickPair = (t) => {
    if (!canTap || fixed) return;
    const want = D.tag;
    if (t === want) { setPairPick(false); win(); return; }
    missWith(t === 'p' ? c.pairP : c.pairSame);
  };
  // ── модель строки для кода и страницы
  let blocks = [], line = null;
  if (R.kind === 'edge') {
    const end = fixed ? wantR[1] : curEnd;
    const marks = [{ a: openR[0], b: end, tag: 'b' }];
    blocks = [blk('l', 'p', partsFrom(toks, marks))];
    line = (
      <span className="tr-fixline"><Tag tag="p" />
        {toks.map((t, i) => {
          const inB = i >= openR[0] && i <= end;
          const open = i === openR[0] ? <Tag tag="b" /> : null;
          const close = i === end ? <Tag tag="b" close /> : null;
          if (!t.w) return <React.Fragment key={i}>{open}<span className="wl-sp">{t.v}</span>{close}</React.Fragment>;
          return (
            <React.Fragment key={i}>{open}
              <button type="button" className={'wl-w' + (inB ? ' is-mark is-b' : '') + (help.lv >= 3 && i === wantR[1] ? ' is-hlr' : '') + (led && !fixed ? ' is-led' : '')}
                disabled={!canTap || fixed} onClick={() => tapEdge(i)}>{t.v}</button>{close}
            </React.Fragment>
          );
        })}
        <Tag tag="p" close /></span>
    );
  } else if (R.kind === 'nest') {
    const a = fragR ? fragR[0] : 0;
    const iEnd = fixed || nestAt === 'end' || nestAt === 'out' ? fragEnd : nestAt;
    blocks = [blk('l', 'p', partsFrom(toks, [{ a, b: iEnd, tag: 'i' }]))];
    const slot = (at, label) => (
      <button key={'s' + at} type="button" className={'tr-ins' + (nestAt === at ? ' is-here' : '') + (help.lv >= 3 && at === 'end' ? ' is-glow' : '')}
        disabled={!canTap || fixed} onClick={() => tapNest(at)} aria-label={label}>{nestAt === at ? <Tag tag="i" close /> : <span className="tr-ins-dot" aria-hidden="true">▾</span>}</button>
    );
    line = (
      <span className="tr-fixline"><Tag tag="p" />
        {toks.map((t, i) => (
          <React.Fragment key={i}>
            {i === a ? <Tag tag="i" /> : null}
            <span className={t.w ? 'tr-w' + (i >= a && i <= iEnd ? ' is-i' : '') : 'wl-sp'}>{t.v}</span>
            {i >= a && fragR && i < fragR[1] && t.w ? slot(i, String(i)) : null}
          </React.Fragment>
        ))}
        {slot('end', 'end')}<Tag tag="p" close />{slot('out', 'out')}
      </span>
    );
  } else {
    const frag = pick(PAGE[D.frag]).replace(/[!?.…]+$/, '');
    const r = wIdx(frag);
    const nextText = pick(PAGE[D.next]);
    if (fixed) blocks = [blk('l', 'p', partsFrom(toks, [{ a: r[0], b: r[1], tag: D.tag }])), blk('n', 'p', nextText)];
    else {
      // Честно: тег без своей пары не закрыт — выделение идёт до конца страницы.
      const parts = partsFrom(toks, [{ a: r[0], b: toks.length - 1, tag: D.tag }]);
      blocks = [blk('l', 'p', parts), blk('n', 'p', [{ k: D.tag, v: nextText }])];
    }
    const btnTag = (tg, close, which) => (
      <button type="button" className={'tr-tagbtn' + (which === 'close' && (pairPick || help.lv >= 3) ? ' is-glow' : '')} disabled={!canTap || fixed} onClick={() => tapPairTag(which)}>
        <Tag tag={tg} close={close} />
      </button>
    );
    line = (
      <span className="tr-fixline">
        {btnTag('p', false, 'p1')}
        {toks.map((t, i) => (
          <React.Fragment key={i}>
            {i === r[0] ? btnTag(D.tag, false, 'open') : null}
            <span className={t.w ? 'tr-w' : 'wl-sp'}>{t.v}</span>
            {i === r[1] ? (fixed ? <Tag tag={D.tag} close /> : btnTag(D.wrongClose, true, 'close')) : null}
          </React.Fragment>
        ))}
        {btnTag('p', true, 'p2')}
      </span>
    );
  }
  const codeLines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }, { key: 'l', id: 'l', d: 1, tag: 'p', toks: [{ k: 'node', node: line }] }]
    .concat(R.kind === 'pair' ? srcLines([blk('n', 'p', pick(PAGE[D.next]))], { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1 })) : [])
    .concat([{ key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const goal = R.kind === 'edge' ? fillL(c.goals.edge, { t: pick(PAGE[D.want]) }) : c.goals[R.kind];
  const task = R.kind === 'pair' && pairPick ? c.tasks.pair2 : c.tasks[R.kind];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={done ? c.askDone : msg || nextHint(c.hints[R.kind], help.lv, vars)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      {done ? <GoalCard done doneText={c.askDone} /> : <GoalCard goal={goal} n={ri + 1} total={3} />}
      {!done ? <Ask text={task} hint={msg} /> : null}
      {!done ? (
        <Work cls="tr-work"
          browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={blocks} flash={fixed ? { id: 'l', n: ri * 2 + (isX ? 1 : 0) } : null} />} />}
          code={<Src lines={codeLines} className="tr-src" lineProps={(ln) => (ln.id === 'l' ? { cls: 'is-hl' + (fixed ? ' tr-fixed' : '') + (shake ? ' tr-shake' : '') } : null)} />} />
      ) : (
        <Work cls="tr-work" browser={<MiniBrowser title={pick(PAGE.name)} cls="tr-mb" page={<Page blocks={[
          blk('a', 'p', markParts(pick(PAGE.birdsP), pick(PAGE.roundB), 'b')), blk('b', 'p', markParts(pick(PAGE.thoughtP), pick(PAGE.thoughtI), 'i')),
          blk('c', 'p', markParts(pick(PAGE.winP), pick(PAGE.winB), 'b')), pb(pick, 'n', 'p', 'newsP')]} />} />}
          code={<Src lines={srcLines([blk('a', 'p', markParts(pick(PAGE.birdsP), pick(PAGE.roundB), 'b')), blk('b', 'p', markParts(pick(PAGE.thoughtP), pick(PAGE.thoughtI), 'i')),
            blk('c', 'p', markParts(pick(PAGE.winP), pick(PAGE.winB), 'b'))], { frame: 'body' })} className="tr-src" />} />
      )}
      {!done && R.kind === 'pair' && pairPick && !fixed ? (
        <TagPick tags={['b', 'i', 'p'].map((x) => x)} onPick={(t) => pickPair(t)} canTap={canTap} glow={help.lv >= 3 ? D.tag : null} />
      ) : null}
    </Stage>
  );
}

// ── 13. ТВОЙ ТУРНИР. Семь шагов со счётчиком: тег → текст; ключевое слово; мысль.
function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const lang = useLang();
  const c = C.s13;
  const stat = useStat('s13', 'own-page', OWN_ORDER);
  const [rec, put] = useRec('s13');
  const [own, setOwn] = useState(() => rec || { tags: {}, texts: {}, acc: {}, bold: null, done: false });
  const [selWord, setSelWord] = useState(null);   // { line, at }
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [off, setOff] = useState([]);
  const [shake, setShake] = useState(null);
  const ownRef = useRef(own); ownRef.current = own;
  const save = (nx) => { const v = Object.assign({}, nx, { lang }); ownRef.current = v; setOwn(v); put(v); };
  // Шаг выполнен — по живому состоянию (правки после «Готово» учитываются).
  const tx = (id) => String(own.texts[id] || '');
  const stepOk = (id) => {
    if (id === 'b') return !!(own.bold && tx(own.bold.line).indexOf(own.bold.word) >= 0 && okText(own.bold.word));
    if (id === 'i') return own.tags.i === 'i' && okText(tx('i')) && !!own.acc.i;
    return own.tags[id] === OWN_TAG[id] && okText(tx(id)) && !!own.acc[id];
  };
  const curIdx = OWN_ORDER.findIndex((id) => !stepOk(id));
  const cur = curIdx < 0 ? null : OWN_ORDER[curIdx];
  const complete = curIdx < 0;
  const help = useHelp(stat, cur || 'h1', !complete);
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec && rec.done ? c.done : c.say, pose: rec && rec.done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(complete && own.done, spoken);
  const phase = !cur ? 'done' : cur === 'b' ? (selWord ? 'btag' : 'bword') : cur === 'i' ? (okText(tx('i')) && own.acc.i ? 'itag' : 'itext')
    : own.tags[cur] === OWN_TAG[cur] ? 'text' : 'tag';
  const led = useIdleLed(canTap && !complete, (curIdx + 1) * 10 + (phase === 'text' ? 1 : 0));
  useEffect(() => { setOff([]); help.reset(); setMsg(null); }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps
  const wantTag = cur ? OWN_TAG[cur] : null;
  const vars = { t: wantTag || '' };
  useEffect(() => { if (help.btnN) setMsg(hintAt(c.hints, help.lv, vars)); }, [help.btnN]); // eslint-disable-line react-hooks/exhaustive-deps
  useWhen(complete && !own.done, () => { save(Object.assign({}, ownRef.current, { done: true })); sfx('win', true); sayNow(c.done, 'cheer'); });
  const inputRefs = useRef({});
  const focusLater = (id) => requestAnimationFrame(() => { const el = inputRefs.current[id]; if (el && el.focus) el.focus(); });
  const missWith = (why) => {
    sfx('soft', true); stat.miss(cur); setShake(cur); setTimeout(() => setShake(null), 420);
    const lv = help.bump();
    const h = lv >= 3 ? joinL(why, fillL(c.hints[2], vars)) : why;
    setMsg(h); sayNow(h, 'think');
  };
  const chooseTag = (t) => {
    if (!canTap || !cur) return;
    const n = ownRef.current;
    if (cur === 'b' || cur === 'i') {
      if (cur === 'b' && !selWord) return;
      if (t !== wantTag) { setOff((o) => o.concat(t)); missWith(c.wrong[wantTag]); return; }
      sfx('ok', true); setMsg(null);
      if (cur === 'b') { save(Object.assign({}, n, { bold: { line: selWord.line, word: selWord.word } })); setSelWord(null); }
      else save(Object.assign({}, n, { tags: Object.assign({}, n.tags, { i: 'i' }) }));
      stat.pass(cur);
      return;
    }
    if (t !== wantTag) {
      setOff((o) => o.concat(t));
      missWith(t === 'h1' && cur !== 'h1' ? c.wrong.h1taken : c.wrong[wantTag === 'p' ? 'p' : wantTag]);
      return;
    }
    sfx('pop', true); setMsg(null);
    save(Object.assign({}, n, { tags: Object.assign({}, n.tags, { [cur]: t }) }));
    focusLater(cur);
  };
  const setText = (id, v) => {
    const n = ownRef.current;
    const acc = Object.assign({}, n.acc);
    if (!okText(v)) acc[id] = false;
    save(Object.assign({}, n, { texts: Object.assign({}, n.texts, { [id]: v }), acc }));
    if (hasTags(v)) setMsg(c.noTags); else if (msg === c.noTags) setMsg(null);
  };
  // Автозасчёт текста текущего шага: через 1 с после правки.
  const curText = cur && cur !== 'b' ? tx(cur) : '';
  useAutoAccept(curText + '|' + cur, !!cur && cur !== 'b' && okText(curText) && !own.acc[cur] && (cur === 'i' || own.tags[cur] === OWN_TAG[cur]), () => {
    const n = ownRef.current;
    save(Object.assign({}, n, { acc: Object.assign({}, n.acc, { [cur]: true }) }));
    sfx('ok', true);
    if (cur !== 'i') stat.pass(cur);
    setEditing(null);
  });
  const tapWord = (line, at, word) => {
    if (!canTap || cur !== 'b') return;
    sfx('tap', true); setMsg(null);
    setSelWord({ line, at, word });
  };
  // ── код: строки по мере выбора тегов; текущая строка — поле ввода.
  const lineFor = (id) => {
    const t = own.tags[id];
    const isCur = id === cur;
    const isEdit = isCur || editing === id;
    if (!t) {
      if (!isCur) return null;
      return { key: id, id, d: 1, tag: 'h1', toks: [{ k: 'node', node: <span className="tr-slot-tag mono">?</span> }, { k: 'node', node: <span className="tr-role-ph">{pick(c.steps[id].role)}</span> }] };
    }
    const text = tx(id);
    let content;
    if (cur === 'b' && (id === 'p1' || id === 'p2')) {
      const tk = toTokens(text);
      content = <WordLine toks={tk} marks={[]} sel={selWord && selWord.line === id ? { a: selWord.at, b: selWord.at } : null}
        onWord={(i) => tapWord(id, i, tk[i].v)} canTap={canTap} led={led && !selWord} />;
    } else if (isEdit) {
      content = <InlineInput value={text} onChange={(v) => setText(id, v)} placeholder={c.steps[id].ph} max={id[0] === 'p' ? 110 : 50}
        label={c.steps[id].role} inputRef={{ set current(el) { inputRefs.current[id] = el; }, get current() { return inputRefs.current[id]; } }}
        onEnter={() => setEditing(null)} cls={(isCur && led && phase === 'text' ? 'is-led-in' : '') + (shake === id ? ' tr-shake' : '')} />;
    } else {
      const parts = own.bold && own.bold.line === id ? markParts(text, own.bold.word, 'b') : [txt(text)];
      content = parts.map((x, j) => (x.k === 'b' ? <React.Fragment key={j}><Tag tag="b" /><span className="tk-tx">{x.v}</span><Tag tag="b" close /></React.Fragment>
        : <span key={j} className="tk-tx">{x.v}</span>));
      return { key: id, id, d: 1, tag: t, edit: id, toks: [{ k: 'open', tag: t }, { k: 'node', node: content }, { k: 'close', tag: t }] };
    }
    return { key: id, id, d: 1, tag: t, toks: [{ k: 'open', tag: t }, { k: 'node', node: content }, { k: 'close', tag: t }] };
  };
  const thoughtLine = () => {
    if (curIdx >= 0 && curIdx < 6) return null;
    const isEdit = cur === 'i' || editing === 'i';
    const th = tx('i');
    const inner = isEdit && phase !== 'itag'
      ? <InlineInput value={th} onChange={(v) => setText('i', v)} placeholder={c.steps.i.ph} max={60} label={c.steps.i.role}
        inputRef={{ set current(el) { inputRefs.current.i = el; }, get current() { return inputRefs.current.i; } }}
        onEnter={() => setEditing(null)} cls={(led && phase === 'itext' ? 'is-led-in' : '') + (shake === 'i' ? ' tr-shake' : '')} />
      : own.tags.i === 'i'
        ? <><Tag tag="i" /><span className="tk-tx">{th}</span><Tag tag="i" close /></>
        : <span className="tk-tx tr-pending">{th}</span>;
    const still = !(isEdit && phase !== 'itag') && own.tags.i === 'i';
    return { key: 'i', id: 'i', d: 1, tag: 'p', edit: still ? 'i' : null, toks: [{ k: 'open', tag: 'p' }, { k: 'text', v: pick(UI.thoughtPre) + ' ' }, { k: 'node', node: inner }, { k: 'close', tag: 'p' }] };
  };
  const lines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }]
    .concat(['h1', 'h2', 'p1', 'h3', 'p2'].map(lineFor).filter(Boolean), [thoughtLine()].filter(Boolean),
      [{ key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const blocks = ownBlocks(own, pick);
  const title = ownTitle(own, pick);
  const role = cur ? c.steps[cur].role : null;
  const ask = complete ? c.askDone : phase === 'tag' ? fillL(c.askTag, { r: role }) : phase === 'text' ? fillL(c.askText, { r: role })
    : phase === 'bword' ? c.askB : phase === 'btag' ? fillL(c.askBTag, { w: selWord.word }) : phase === 'itext' ? fillL(c.askText, { r: role }) : c.askI2;
  const pickTags = phase === 'tag' ? (cur === 'h1' ? ['h1', 'h2', 'h3', 'p'] : ['h1', 'h2', 'h3', 'p']) : phase === 'btag' || phase === 'itag' ? ['b', 'i'] : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo}
      hint={complete ? c.askDone : msg || nextHint(c.hints, help.lv, vars)} nav={navOf(p, canGo)}>
      <SayLine speaker={speaker} skip={msg} />
      <Ask text={ask} hint={complete ? null : msg} n={complete ? null : pick(UI.step) + ' ' + (curIdx + 1) + '/7'} />
      <Work cls="tr-work tr-work-own"
        browser={<MiniBrowser title={title} cls="tr-mb" page={blocks.length ? <Page blocks={blocks} hl={cur && own.tags[cur] ? [cur] : null} /> : <div className="pg-wait">…</div>} />}
        code={<div className="tr-code">
          <Src lines={lines} className="tr-src tr-src-own" lineProps={(ln) => {
            if (ln.edit) {
              // Готовая строка — в одну строку (весь текст виден в браузере); карандаш — править.
              return { cls: 'tr-static', after: (
                <button type="button" className="tr-edit" onClick={() => { setEditing(ln.edit); focusLater(ln.edit); }} aria-label={pick(UI.edit)} disabled={!canTap}>
                  <Icon name="undo" size={13} /></button>
              ) };
            }
            return ln.id && (ln.id === cur || (cur === 'b' && (ln.id === 'p1' || ln.id === 'p2')))
              ? { cls: 'is-hl tr-typing' } : ln.id && ln.id === editing ? { cls: 'tr-typing' } : null;
          }} />
          {pickTags ? <TagPick tags={pickTags} onPick={chooseTag} canTap={canTap} off={off} glow={off.length >= 2 || help.lv >= 3 ? wantTag : null} led={led && phase !== 'text'} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 14. СТРАНИЦА ГОТОВА. Пиксель показывает страницу ученика; что получилось.
function S14({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s14;
  const own = store.get('s13');
  const ach = achievements(store);
  const allSelf = ACH.every(([k]) => ach[k] === 'self');
  const [speaker, , spoken] = useVoice([{ text: allSelf ? c.saySelf : c.sayHelp, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const blocks = own ? ownBlocks(own, pick) : demoPage(pick);
  const title = own ? ownTitle(own, pick) : pick(PAGE.name);
  const sub = blocks.find((b) => b.tag === 'h2');
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <SayLine speaker={speaker} />
      <div className="tr-fin">
        <div className="tr-fin-show">
          <Pix texts={{ scr1: title, scr2: sub ? plain(sub) : pick(UI.tourn) }} cls="tr-fig-fin" />
          <MiniBrowser title={title} cls="tr-mb tr-mb-fin" page={<Page blocks={blocks} />} />
        </div>
        <div className="tr-fin-side">
          {Object.keys(ach).length ? (
            <>
              <div className="ach tr-ach" aria-label={pick(UI.done)}>
                {ACH.filter(([k]) => ach[k]).map(([k]) => (
                  <span key={k} className={'ach-i' + (ach[k] === 'self' ? ' is-self' : '')}
                    aria-label={pick(c.ach[k]) + ' · ' + pick(ach[k] === 'self' ? UI.self : UI.helped)}>
                    <span className="ach-m"><Icon name={ach[k] === 'self' ? 'star' : 'check'} size={12} /></span>
                    {pick(c.ach[k])}
                  </span>
                ))}
              </div>
              <div className="tr-ach-legend">
                {ACH.some(([k]) => ach[k] === 'self') ? <span><span className="ach-m is-self"><Icon name="star" size={10} /></span>{pick(UI.self)}</span> : null}
                {ACH.some(([k]) => ach[k] === 'help') ? <span><span className="ach-m"><Icon name="check" size={10} /></span>{pick(UI.helped)}</span> : null}
              </div>
            </>
          ) : null}
          <div className="bye-next next-card">
            <span className="bye-next-ic"><Icon name="list" size={22} /></span>
            <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(c.next)}</b></span>
            <span className="next-tags mono" translate="no">ul · ol · li</span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'PREDICT', Comp: S3 },
  { id: 's4', code: 'SHOW', Comp: S4 }, { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-1', Comp: S6 },
  { id: 's7', code: 'SHOW', Comp: S7 }, { id: 's8', code: 'LEVEL-2', Comp: S8 }, { id: 's9', code: 'SHOW', Comp: S9 },
  { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'PREDICT', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 },
  { id: 's13', code: 'RESULT', Comp: S13 }, { id: 's14', code: 'PREVIEW', Comp: S14 }
];
// «Повторить» стирает только решённое состояние экрана; учёт ('st:…') остаётся —
// сведения о подсказках и промахах не теряются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'] };

export default function HtmlZagolovkiTurnirPixel({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: makeArtifact(store), achievements: achievements(store) })
  });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА: стили урока 2 (код, браузер, клавиши …) + кит anatomy + свои (tr-…).
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@ISO_CSS@*/
/*@OWN_CSS@*/
`;
