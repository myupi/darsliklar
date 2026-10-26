// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 5 — «Изображения»
// (бумажный коллаж, по эталону урока 1). Дети 10–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node .claude/skills/novyy-urok/scripts/sobrat.mjs tools/izobr5/iz5.src.jsx lessons/html/05-izobrazheniya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · «Изображения» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (26.10.2026, по эталону — урок 1 «Бумажная страница»; материал —
// ролик html5.mp4 «Изображения»). Тот же бумажный стиль: лист с рваным краем,
// вырезки с фактурой и тенью, stop-motion, шорох бумаги, переход «разбор и
// сборка», честный бумажный браузер. Образ из ролика: бирюзовая страница с
// рамкой под картинку; «?» — пока нет src; рыжий кот на горчичном фото;
// карточка файла cat.jpg; порванное фото и текст alt; динамик программы чтения.
// Сюжет: страница «Наши питомцы» класса — на ней одни слова; ученик вставляет
// фото питомцев, даёт им адреса файлов и описания для тех, кто не видит.
//
// ДУГА (17 экранов): s1 крючок (фото кота влетает на страницу) · s2 план ·
// тройки «объяснение → сам делаешь → закрепление»: тег img без пары (s3–s5),
// атрибут src — адрес файла (s6–s8), атрибут alt — описание словами (s9–s11),
// тег картинки целиком (s12–s14) · итоговая проверка (q1, q2) · s15 вывод.
// Сценарий — docs/scenarij-05-izobrazheniya.md.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Подсветка идёт за речью Коди: одна реплика — одна подсвеченная вещь.
//   · Честный браузер: картинку ставит img там, где стоит тег; без src — пусто
//     (с alt — только текст alt); файла нет — значок сломанной картинки и текст
//     alt; </img> браузер не замечает; href у img ничего не делает; порядок
//     атрибутов не важен. Значение без кавычек браузер понимает — проверка
//     просит кавычки как правило записи.
//   · Конфетти только в финале: похвалы экранов — поза smile.
//
// СИСТЕМА СЛОВ. Картинка — rasm; файл — fayl; адрес — manzil; описание —
// tavsif; «не загрузилась» — yuklanmadi; программы для незрячих — ko‘zi ojiz
// odamlar uchun dasturlar. Как в уроках 1–4: teg (вслух «tag»), atribut, qiymat.
// Тег img вслух — «I M G», src — «S R C»; файл cat.jpg — «cat точка J P G».
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-05-izobrazheniya',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '5-dars. Rasmlar',
    ru: 'Урок 5. Изображения',
    en: 'Lesson 5. Images'
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
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Formalar', 'Формы', 'Forms'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3('O‘ynash', 'Играть', 'Play'),
  noTags: L3('Bu yerga faqat so‘z yozing, qo‘shtirnoq va burchakli qavslarsiz.', 'Здесь нужны только слова, без кавычек и угловых скобок.', 'Only words here, no quotes or angle brackets.'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  broken: L3('Singan rasm', 'Сломанная картинка', 'Broken picture'),
  files: L3('Fayllar', 'Файлы', 'Files'),
  attrWord: L3('atribut', 'атрибут', 'attribute'),
  reader: L3('Ekranni o‘qiydigan dastur', 'Программа чтения экрана', 'Screen reader')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦЫ И ФОТО — тексты страниц и описания питомцев.
// ─────────────────────────────────────────────────────────────────────────────
const PAGES = {
  pets: { title: L3('Uy hayvonlarimiz', 'Наши питомцы', 'Our pets'),
    text: L3('Sinfimizda to‘rtta uy hayvoni bor.', 'В нашем классе четыре питомца.', 'Our class has four pets.') },
  corner: { title: L3('Jonli burchak', 'Живой уголок', 'Pet corner') }
};
const PETS = {
  cat: { p1: L3('Bu bizning mushugimiz.', 'Это наш кот.', 'This is our cat.'), p2: L3('U kun bo‘yi uxlaydi.', 'Он спит весь день.', 'He sleeps all day.'),
    alt: L3('Sariq mushuk uxlayapti', 'Рыжий кот спит', 'A ginger cat sleeping') },
  dog: { p1: L3('Bu bizning itimiz.', 'Это наша собака.', 'This is our dog.'), p2: L3('U to‘p o‘ynashni yaxshi ko‘radi.', 'Она любит играть с мячом.', 'She loves playing with a ball.'),
    alt: L3('Quvnoq it', 'Весёлая собака', 'A happy dog') },
  parrot: { alt: L3('To‘tiqush shoxda o‘tiribdi', 'Попугай сидит на ветке', 'A parrot sitting on a branch'), short: L3('Qizil to‘tiqush', 'Красный попугай', 'A red parrot') },
  fish: { alt: L3('Oltin baliq akvariumda suzyapti', 'Золотая рыбка плавает в аквариуме', 'A goldfish swimming in a tank'), short: L3('Oltin baliq', 'Золотая рыбка', 'A goldfish') }
};

// Набор атрибута (s7, s13): что не так.
const ATTR_MSGS = {
  needEq: L3('Nomdan keyin tenglik belgisi «=» turadi.', 'После имени ставят знак равно «=».', 'After the name comes an equals sign “=”.'),
  needQuotes: L3('Brauzer tushundi, lekin qiymat qo‘shtirnoq ichida yoziladi: qiymatdan oldin ham, keyin ham.', 'Браузер понял, но значение пишут в кавычках — перед ним и после.', 'The browser understood, but the value goes in quotes, before and after it.'),
  needQuote2: L3('Qo‘shtirnoq juft bo‘ladi: biri qiymatdan oldin, ikkinchisi keyin.', 'Кавычки парные: одна перед значением, другая после.', 'Quotes come in pairs: one before the value, one after.'),
  href: L3('href havolalar uchun. Rasm manzili src atributida yoziladi.', 'href — для ссылок. Адрес картинки пишут в атрибуте src.', 'href is for links. A picture’s address goes in the src attribute.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Реплика Коди — 1–2 коротких предложения. Звучат: say, done, ok, msgs,
// hints, why, miss …; печатаются: eyebrow, ask, cards.title, opts.t, ph.
// В узбекских репликах, которые звучат, нет тире: движок отдаёт его сервису точкой.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Uy hayvonlarimiz', 'Наши питомцы', 'Our pets'),
    say: L3('Bu sinfimiz uy hayvonlari haqidagi sahifa. Lekin unda faqat so‘zlar bor, zerikarli! Mushuk rasmini bosing.',
      'Это страница про питомцев нашего класса. Но на ней одни слова — скучно! Нажми фото кота.',
      'This page is about our class pets. But it has only words. Boring! Tap the cat photo.'),
    magic: L3('Ko‘rdingizmi? Rasm paydo bo‘ldi va sahifa jonlandi.', 'Видишь? Появилась картинка, и страница ожила.', 'See? A picture appeared, and the page came alive.'),
    done: L3('Bugun sahifaga rasmlarni o‘zingiz qo‘yishni o‘rganasiz!', 'Сегодня ты научишься вставлять картинки на страницу!', 'Today you’ll learn to put pictures on a page yourself!'),
    ask: L3('Mushuk rasmini bosing', 'Нажми фото кота', 'Tap the cat photo'),
    askDone: L3('Sahifada rasm paydo bo‘ldi', 'На странице появилась картинка', 'A picture appeared on the page')
  },
  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Mana bugungi reja. Unda to‘rtta qadam bor.', 'Вот план урока. В нём четыре шага.', 'Here’s the plan for today. It has four steps.'),
    cards: [
      { title: L3('Rasm sahifada', 'Картинка на странице', 'A picture on the page'),
        say: L3('Avval sahifaga rasm qo‘yamiz.', 'Сначала поставим картинку на страницу.', 'First we’ll put a picture on the page.') },
      { title: L3('Qaysi rasm?', 'Какая картинка?', 'Which picture?'),
        say: L3('Keyin brauzerga qaysi rasmni ko‘rsatishni aytamiz.', 'Потом скажем браузеру, какую картинку показать.', 'Then we’ll tell the browser which picture to show.') },
      { title: L3('Rasm yuklanmasa', 'Если не загрузилась', 'If it won’t load'),
        say: L3('Uchinchi qadamda rasm yuklanmasa nima bo‘lishini ko‘ramiz.', 'Третий шаг — что будет, если картинка не загрузится.', 'Step three: what happens if a picture doesn’t load.') },
      { title: L3('O‘z rasmingiz', 'Своя картинка', 'Your own picture'),
        say: L3('Oxirida esa rasm tegini o‘zingiz to‘liq yozasiz!', 'А в конце ты напишешь тег картинки целиком!', 'And at the end you’ll write a whole picture tag yourself!') }
    ],
    done: L3('Reja tayyor. Boshladik!', 'План готов. Начинаем!', 'That’s the plan. Let’s start!'),
    ask: L3('Rejani tinglang', 'Слушай план урока', 'Listen to the plan')
  },
  s3: {
    eyebrow: L3('img tegi', 'Тег img', 'The img tag'),
    say: L3('Bu mushuk rasmining kodi. Keling, u nimalardan iborat ekanini ko‘ramiz.', 'Вот код этой картинки. Посмотрим, из чего он сделан.', 'Here’s the code of this picture. Let’s see what it’s made of.'),
    sayImg: L3('Rasmni img tegi qo‘yadi. img inglizcha image so‘zidan olingan, «rasm» degani.', 'Картинку вставляет тег img — от английского image, «изображение».', 'The img tag adds a picture. img is short for image.'),
    sayP: L3('p tegini eslang: u matnni o‘raydi, shuning uchun uning jufti bor.', 'Вспомни тег p: он оборачивает текст, поэтому у него есть пара.', 'Remember the p tag: it wraps text, so it has a pair.'),
    sayNoClose: L3('img esa hech narsani o‘ramaydi, shunchaki rasm qo‘yadi. Shuning uchun uning yopuvchi tegi yo‘q.', 'А img ничего не оборачивает, он просто вставляет картинку. Поэтому закрывающего тега у него нет.', 'But img doesn’t wrap anything, it just adds a picture. So it has no closing tag.'),
    sayAttr: L3('Mana bu qism esa qaysi rasm ekanini aytadi. U haqida biroz keyinroq.', 'А эта часть говорит, какая это картинка. О ней чуть позже.', 'And this part says which picture it is. More about it a bit later.'),
    done: L3('Demak, img rasm uchun teg va u juftsiz yoziladi.', 'Итак, img — тег для картинки, и пишут его без пары.', 'So img is the tag for a picture, and it’s written without a pair.'),
    ask: L3('Qarang: rasm kodi nimalardan iborat', 'Смотри, из чего сделан код картинки', 'Watch what the picture code is made of'),
    askDone: L3('img rasm qo‘yadi, jufti yo‘q', 'img вставляет картинку, пары у него нет', 'img adds a picture and has no pair')
  },
  s4: {
    eyebrow: L3('Rasm qo‘ying', 'Вставь картинку', 'Add a picture'),
    say: L3('Endi it rasmini qo‘yamiz. Qatorning boshi yo‘q. Bo‘sh joyga rasm tegining boshini yozing: chap burchakli qavs «<» va img.',
      'Теперь вставим фото собаки. У строки нет начала. Впиши в пустое место начало тега картинки: уголок «<» и img.',
      'Now let’s add the dog photo. The line has no start. Type the start of the picture tag in the empty spot: the bracket “<” and img.'),
    msgs: {
      needLt: L3('Teg chap burchakli qavs «<» bilan boshlanadi. Uni boshiga qo‘shing.', 'Тег начинается с уголка «<». Добавь его в начало.', 'A tag starts with the bracket “<”. Add it at the start.'),
      wrongName: L3('Rasm tegining nomi img: i, m, g.', 'Тег картинки называется img: i, m, g.', 'The picture tag is called img: i, m, g.'),
      image: L3('Brauzer taxmin qildi, lekin teg qisqa yoziladi: img.', 'Браузер догадался, но тег пишут коротко: img.', 'The browser guessed, but the tag is written short: img.'),
      extraGt: L3('O‘ng burchakli qavs «>» qator oxirida allaqachon turibdi. Bu yerda faqat «<» va img kerak.', 'Уголок «>» уже стоит в конце строки. Здесь нужны только «<» и img.', 'The bracket “>” is already at the end of the line. Here you only need “<” and img.'),
      noSlash: L3('Qiya chiziq «/» kerak emas: img ochuvchi teg, uning jufti yo‘q.', 'Косая черта «/» не нужна: img — открывающий тег, пары у него нет.', 'No slash “/” needed: img is an opening tag with no pair.')
    },
    hints: [
      L3('Rasmni qaysi teg qo‘yadi?', 'Каким тегом вставляют картинку?', 'Which tag adds a picture?'),
      L3('Bu img. Teg burchakli qavs bilan boshlanadi.', 'Это img. Тег начинается с уголка.', 'It’s img. A tag starts with a bracket.'),
      L3('Avval «<» tugmasini, keyin img tugmasini bosing.', 'Нажми сначала «<», потом img.', 'Tap “<” first, then img.')
    ],
    ok: L3('Zo‘r! It rasmi sahifada.', 'Огонь! Фото собаки на странице.', 'Awesome! The dog photo is on the page.'),
    ask: L3('Bo‘sh joyga «<img» yozing', 'Впиши в пустое место «<img»', 'Type “<img” in the empty spot')
  },
  s5: {
    eyebrow: L3('Rasm qayerda?', 'Где будет картинка?', 'Where will the picture be?'),
    say: L3('Brauzer kodni yuqoridan pastga o‘qiydi va rasmni img tegi turgan joyga qo‘yadi.', 'Браузер читает код сверху вниз и ставит картинку там, где стоит тег img.', 'The browser reads code from top to bottom and puts the picture where the img tag is.'),
    askQ: L3('Rasm sahifaning qayerida chiqadi? Joyni bosing.', 'Где на странице появится картинка? Нажми место.', 'Where will the picture appear on the page? Tap the spot.'),
    ok: L3('To‘g‘ri! Rasm aynan img tegi turgan joyda.', 'Верно! Картинка стоит ровно там, где тег img.', 'Right! The picture is exactly where the img tag is.'),
    miss: L3('Qarang: img tegi kodda boshqa joyda turibdi. Rasm aynan o‘sha joyda chiqadi.', 'Смотри: тег img стоит в коде в другом месте. Картинка появляется именно там.', 'Look: the img tag is somewhere else in the code. The picture appears right there.'),
    done: L3('Tushunarli: img tegi qayerda bo‘lsa, rasm ham o‘sha yerda.', 'Понятно: где тег img, там и картинка.', 'Got it: where the img tag is, that’s where the picture is.')
  },
  s6: {
    eyebrow: L3('src atributi', 'Атрибут src', 'The src attribute'),
    say: L3('Qarang: img tegi bor, lekin rasm o‘rni bo‘m-bo‘sh. Brauzer qaysi rasmni ko‘rsatishni bilmaydi.', 'Смотри: тег img есть, а на месте картинки пусто. Браузер не знает, какую картинку показать.', 'Look: there’s an img tag, but there’s no picture. The browser doesn’t know which picture to show.'),
    saySrc: L3('Buni src atributi aytadi. U teg ichida yoziladi, havoladagi href kabi.', 'Это подскажет атрибут src. Его пишут внутри тега, как href у ссылки.', 'The src attribute tells it which one. It goes inside the tag, like href in a link.'),
    sayFile: L3('src rasm faylining manzilini bildiradi. Masalan, cat.jpg.', 'src — это адрес файла с картинкой. Например, cat.jpg.', 'src is the address of the picture file. For example, cat.jpg.'),
    done: L3('Endi brauzer qaysi faylni ochishni biladi va rasmni ko‘rsatdi!', 'Теперь браузер знает, какой файл открыть, и показал картинку!', 'Now the browser knows which file to open, and it showed the picture!'),
    ask: L3('Qarang: rasmga manzil kerak', 'Смотри: картинке нужен адрес', 'Watch: the picture needs an address'),
    askDone: L3('src — rasm faylining manzili', 'src — адрес файла с картинкой', 'src is the address of the picture file')
  },
  s7: {
    eyebrow: L3('Fayl manzili', 'Адрес файла', 'The file address'),
    say: L3('It rasmi ko‘rinmayapti: tegda src yo‘q. Bo‘sh joyga src atributini yozing. Fayl nomi rasm ostida yozilgan.',
      'Фото собаки не видно: в теге нет src. Впиши в пустое место атрибут src. Имя файла подписано под фото.',
      'The dog photo isn’t showing: the tag has no src. Type the src attribute in the empty spot. The file name is written under the photo.'),
    msgs: Object.assign({}, ATTR_MSGS, {
      needName: L3('Atribut nomidan boshlanadi: src.', 'Атрибут начинается с имени: src.', 'An attribute starts with its name: src.'),
      wrongName: L3('Atribut nomini tekshiring: s, r, c.', 'Проверь имя атрибута: s, r, c.', 'Check the attribute name: s, r, c.'),
      wrongVal: L3('Fayl nomini tekshiring: it rasmi dog.jpg.', 'Проверь имя файла: фото собаки — dog.jpg.', 'Check the file name: the dog photo is dog.jpg.')
    }),
    hints: [
      L3('Atribut uch qismdan iborat: nomi, tenglik belgisi, qiymati.', 'Атрибут из трёх частей: имя, знак равно, значение.', 'An attribute has three parts: a name, an equals sign, a value.'),
      L3('Nomi src, qiymati dog.jpg, qo‘shtirnoq ichida.', 'Имя — src, значение — dog.jpg, в кавычках.', 'The name is src, the value is dog.jpg, in quotes.'),
      L3('Tugmalarni tartib bilan bosing: src, tenglik belgisi, qo‘shtirnoq, dog.jpg, qo‘shtirnoq.', 'Нажми кнопки по порядку: src, равно, кавычка, dog.jpg, кавычка.', 'Tap the keys in order: src, equals, quote, dog.jpg, quote.')
    ],
    ok: L3('Mana it! src kerakli faylni ko‘rsatdi.', 'Вот и собака! src указал нужный файл.', 'There’s the dog! src pointed to the right file.'),
    ask: L3('img tegiga dog.jpg manzilli src yozing', 'Впиши src с адресом dog.jpg', 'Type src with the address dog.jpg')
  },
  s8: {
    eyebrow: L3('Qaysi rasm?', 'Какая картинка?', 'Which picture?'),
    say: L3('Kodga qarang va brauzer qaysi rasmni ko‘rsatishini toping.', 'Посмотри на код и найди, какую картинку покажет браузер.', 'Look at the code and find which picture the browser will show.'),
    askQ: L3('Brauzer nimani ko‘rsatadi?', 'Что покажет браузер?', 'What will the browser show?'),
    ok: L3('To‘g‘ri! Brauzer aynan src dagi faylni ochadi.', 'Верно! Браузер открывает именно файл из src.', 'Right! The browser opens exactly the file in src.'),
    miss: {
      plain: L3('Qarang: src da {file} turibdi. Brauzer aynan shu faylni ochadi.', 'Смотри: в src стоит {file}. Браузер открывает именно этот файл.', 'Look: src says {file}. The browser opens exactly that file.'),
      broken: L3('Qarang: {file} degan fayl yo‘q, nomdagi har bir harf muhim. Brauzer rasmni topmadi va singan rasm belgisini ko‘rsatdi.', 'Смотри: файла {file} нет, а в имени важна каждая буква. Браузер не нашёл картинку и показал значок сломанной картинки.', 'Look: there’s no file called {file}, and every letter in the name matters. The browser couldn’t find the picture and showed a broken picture icon.')
    },
    done: L3('Endi bilasiz: qaysi rasm chiqishini src hal qiladi.', 'Теперь ты знаешь: какую картинку показать, решает src.', 'Now you know: src decides which picture shows.')
  },
  s9: {
    eyebrow: L3('alt atributi', 'Атрибут alt', 'The alt attribute'),
    say: L3('Bu rasmda yana bitta atribut bor: alt.', 'У этой картинки есть ещё один атрибут — alt.', 'This picture has one more attribute: alt.'),
    sayAlt: L3('alt bu rasmning so‘z bilan tavsifi.', 'alt — это описание картинки словами.', 'alt is a description of the picture in words.'),
    sayFail: L3('Agar rasm yuklanmasa, brauzer alt dagi matnni ko‘rsatadi.', 'Если картинка не загрузилась, браузер покажет текст из alt.', 'If the picture doesn’t load, the browser shows the text from alt.'),
    sayReader: L3('Yana ko‘zi ojiz odamlar uchun dasturlar alt ni ovoz chiqarib o‘qiydi.', 'А ещё alt читают вслух программы для незрячих людей.', 'And programs for blind people read alt out loud.'),
    done: L3('alt tufayli rasmni ko‘rmaydigan odam ham uni tushunadi.', 'alt помогает понять картинку тем, кто её не видит.', 'alt helps people understand a picture even when they can’t see it.'),
    ask: L3('Qarang: alt nima uchun kerak', 'Смотри, зачем нужен alt', 'Watch what alt is for'),
    askDone: L3('alt — rasmning so‘z bilan tavsifi', 'alt — описание картинки словами', 'alt is the picture described in words')
  },
  s10: {
    eyebrow: L3('Tavsif yozing', 'Опиши картинку', 'Describe the picture'),
    say: L3('It rasmi uchun alt yozing: rasmda nima borligini so‘z bilan ayting va «Tayyor»ni bosing.', 'Напиши alt для фото собаки: скажи словами, что на картинке, и нажми «Готово».', 'Write alt for the dog photo: say in words what’s in the picture, then tap “Done”.'),
    ok: L3('Ajoyib tavsif! Endi rasmni ko‘rmaydigan odam ham uni tushunadi.', 'Отличное описание! Теперь картинку поймёт и тот, кто её не видит.', 'Great description! Now even someone who can’t see the picture will understand it.'),
    hints: [
      L3('Rasmga qarang: kim bor va u nima qilyapti?', 'Посмотри на фото: кто там и что делает?', 'Look at the photo: who’s there and what are they doing?'),
      L3('Faqat so‘z yozing, qo‘shtirnoqlar allaqachon joyida.', 'Пиши только слова — кавычки уже на месте.', 'Type only words: the quotes are already in place.'),
      L3('Masalan: Quvnoq it. Keyin «Tayyor»ni bosing.', 'Например: Весёлая собака. Потом нажми «Готово».', 'For example: A happy dog. Then tap “Done”.')
    ],
    ask: L3('Rasmni alt ichida tasvirlang va «Tayyor»ni bosing', 'Опиши фото в alt и нажми «Готово»', 'Describe the photo in alt and tap “Done”'),
    ph: L3('Masalan: Quvnoq it', 'Например: Весёлая собака', 'For example: A happy dog')
  },
  s11: {
    eyebrow: L3('Yaxshi alt', 'Хороший alt', 'A good alt'),
    say: L3('Men rasmlarga alt yozyapman. Qaysi tavsif ko‘zi ojiz odamga eng ko‘p yordam beradi?', 'Я пишу alt для фото. Какое описание больше всего поможет незрячему человеку?', 'I’m writing alt for the photos. Which description helps a blind person the most?'),
    askQ: L3('Qaysi alt eng yaxshi?', 'Какой alt лучше всех?', 'Which alt is best?'),
    rounds: [
      { file: 'parrot.png', opts: [
        { id: 'pic', t: L3('rasm', 'картинка', 'picture'), why: L3('Bu so‘z hech narsani aytmaydi: rasmda nima borligi noma’lum.', 'Это слово ничего не говорит: непонятно, что на картинке.', 'This word says nothing: it’s unclear what’s in the picture.') },
        { id: 'num', t: L3('IMG_2041', 'IMG_2041', 'IMG_2041'), why: L3('Bu fayl raqami, tavsif emas. Dastur shunchaki raqamlarni o‘qiydi.', 'Это номер файла, а не описание. Программа просто прочитает цифры.', 'That’s a file number, not a description. The program will just read out numbers.') },
        { id: 'good', right: true, t: PETS.parrot.alt }
      ] },
      { file: 'fish.jpg', opts: [
        { id: 'good', right: true, t: PETS.fish.alt },
        { id: 'file', t: L3('fish.jpg', 'fish.jpg', 'fish.jpg'), why: L3('Bu fayl nomi, src dagi kabi. alt esa rasmni so‘z bilan tasvirlaydi.', 'Это имя файла, как в src. А alt описывает картинку словами.', 'That’s the file name, like in src. alt describes the picture in words.') },
        { id: 'photo', t: L3('foto', 'фото', 'photo'), why: L3('Bu so‘z hech narsani aytmaydi: rasmda nima borligi noma’lum.', 'Это слово ничего не говорит: непонятно, что на картинке.', 'This word says nothing: it’s unclear what’s in the picture.') }
      ] }
    ],
    ok: L3('To‘g‘ri! Bunday alt rasmni aniq tasvirlaydi.', 'Верно! Такой alt точно описывает картинку.', 'Right! This alt describes the picture clearly.'),
    done: L3('Yaxshi alt rasmda nima borligini aniq aytadi.', 'Хороший alt точно говорит, что на картинке.', 'A good alt says clearly what’s in the picture.')
  },
  s12: {
    eyebrow: L3('Rasm qismlari', 'Картинка по частям', 'A picture, part by part'),
    say: L3('Mana rasm tegi to‘liq. Keling, uni qismlarga ajratib ko‘ramiz.', 'Вот тег картинки целиком. Разберём его по частям.', 'Here’s a whole picture tag. Let’s take it apart.'),
    parts: {
      open: L3('Boshida img tegi: u rasm qo‘yadi.', 'В начале — тег img: он вставляет картинку.', 'At the start is the img tag: it adds a picture.'),
      src: L3('Keyin src atributi: rasm faylining manzili, parrot.png.', 'Потом атрибут src — адрес файла с картинкой, parrot.png.', 'Then the src attribute: the address of the picture file, parrot.png.'),
      alt: L3('Keyin alt atributi: rasmning so‘z bilan tavsifi.', 'Потом атрибут alt — описание картинки словами.', 'Then the alt attribute: the picture described in words.'),
      gt: L3('Burchakli qavs tegni tugatadi. Yopuvchi img tegi yo‘q!', 'Уголок заканчивает тег. Закрывающего тега img нет!', 'The bracket ends the tag. There’s no closing img tag!')
    },
    sayOrder: L3('Atributlar tartibi muhim emas: alt ni oldin yozsangiz ham, rasm o‘zgarmaydi.', 'Порядок атрибутов не важен: напиши alt первым — картинка та же.', 'The order of attributes doesn’t matter: write alt first, and the picture is the same.'),
    tapSay: L3('Istalgan qismni bosing, men uni yana tushuntiraman.', 'Нажми любую часть — я повторю её объяснение.', 'Tap any part, and I’ll explain it again.'),
    ask: L3('Rasm tegi qismlarini kuzating', 'Смотри на части тега картинки', 'Watch the parts of the picture tag'),
    askDone: L3('Rasm tegi qismlari', 'Части тега картинки', 'The parts of a picture tag'),
    askTap: L3('Xohlasangiz, istalgan qismni bosing', 'Нажми любую часть, если хочешь', 'Tap any part if you like')
  },
  s13: {
    eyebrow: L3('O‘z rasmingiz', 'Своя картинка', 'Your own picture'),
    say: L3('Men akvarium rasmini topdim, fayl nomi fish.jpg. Rasm tegini to‘liq yozing: img, manzilli src va o‘z tavsifingiz bilan alt.',
      'Я нашёл фото аквариума, файл fish.jpg. Напиши тег картинки целиком: img, src с адресом и alt со своим описанием.',
      'I found the aquarium photo, the file is fish.jpg. Write the whole picture tag: img, src with the address, and alt with your own description.'),
    msgs: Object.assign({}, ATTR_MSGS, {
      needOpen: L3('Rasm tegi chap burchakli qavs «<» va img bilan boshlanadi.', 'Тег картинки начинается с уголка «<» и img.', 'The picture tag starts with the bracket “<” and img.'),
      image: L3('Brauzer taxmin qildi, lekin teg qisqa yoziladi: img.', 'Браузер догадался, но тег пишут коротко: img.', 'The browser guessed, but the tag is written short: img.'),
      needSpace: L3('img va atribut orasida bo‘sh joy qoldiring.', 'Между img и атрибутом нужен пробел.', 'Put a space between img and the attribute.'),
      needSrc: L3('Tegga src atributi kerak: fish.jpg.', 'В теге нужен атрибут src: fish.jpg.', 'The tag needs the src attribute: fish.jpg.'),
      wrongSrc: L3('src dagi fayl nomini tekshiring: fish.jpg.', 'Проверь имя файла в src: fish.jpg.', 'Check the file name in src: fish.jpg.'),
      needAlt: L3('alt atributini qo‘shing: rasmni so‘z bilan tasvirlang.', 'Добавь атрибут alt: опиши картинку словами.', 'Add the alt attribute: describe the picture in words.'),
      needAltText: L3('alt ichiga tavsif so‘zlarini yozing.', 'Впиши в alt слова-описание.', 'Type description words inside alt.'),
      needGt: L3('Teg oxirida o‘ng burchakli qavs «>» turadi.', 'В конце тега нужен уголок «>».', 'The tag ends with the bracket “>”.'),
      noClose: L3('Yopuvchi img tegi kerak emas: uni o‘chiring.', 'Закрывающий тег img не нужен — сотри его.', 'The closing img tag isn’t needed: erase it.')
    }),
    hints: [
      L3('Tegda uch qism bor: img, src va alt, oxirida burchakli qavs.', 'В теге три части: img, src и alt, в конце уголок.', 'The tag has three parts: img, src and alt, with a bracket at the end.'),
      L3('src ga fish.jpg, alt ga esa o‘z so‘zlaringizni yozing.', 'В src — fish.jpg, в alt — свои слова.', 'src gets fish.jpg, alt gets your own words.'),
      L3('Namuna qatoriga qarang: xuddi shunday yozing, faqat fayl fish.jpg va tavsif sizniki.', 'Посмотри на строку-образец: напиши так же, только файл fish.jpg и описание свои.', 'Look at the example line: write it the same way, but with the file fish.jpg and your own description.')
    ],
    ok: L3('Zo‘r! Akvarium sahifada va uning tavsifi ham bor.', 'Огонь! Аквариум на странице, и у него есть описание.', 'Awesome! The aquarium is on the page, and it has a description.'),
    ask: L3('fish.jpg rasmining tegini to‘liq yozing', 'Напиши тег картинки fish.jpg целиком', 'Write the whole picture tag for fish.jpg')
  },
  s14: {
    eyebrow: L3('Nega rasm yo‘q?', 'Почему нет картинки?', 'Why no picture?'),
    say: L3('Men sahifaga rasmlar qo‘ydim, lekin ular ko‘rinmayapti. Har bir tegda bitta xato bor. Xato qismni bosing.', 'Я вставил картинки, но они не видны. В каждом теге одна ошибка. Нажми часть с ошибкой.', 'I added pictures, but they don’t show. Each tag has one mistake. Tap the wrong part.'),
    askQ: L3('Qaysi qism xato?', 'Какая часть с ошибкой?', 'Which part is wrong?'),
    ok: {
      name: L3('To‘g‘ri! Atribut nomi src bo‘lishi kerak. Brauzer bu nomni tanimadi va faqat alt matnini ko‘rsatdi.', 'Верно! Атрибут должен называться src. Браузер не узнал это имя и показал только текст из alt.', 'Right! The attribute must be called src. The browser didn’t recognize that name and showed only the alt text.'),
      val: L3('To‘g‘ri! Fayl nomida xato bor. Brauzer faylni topmadi.', 'Верно! В имени файла ошибка. Браузер не нашёл файл.', 'Right! There’s a mistake in the file name. The browser couldn’t find the file.'),
      href: L3('To‘g‘ri! href havolalar uchun. Rasm manzili src da yoziladi.', 'Верно! href — для ссылок. Адрес картинки пишут в src.', 'Right! href is for links. A picture’s address goes in src.')
    },
    fine: L3('Bu qism joyida. Brauzer nimani ko‘rsatayotganiga qarang.', 'Эта часть в порядке. Посмотри, что показывает браузер.', 'This part is fine. Look at what the browser shows.'),
    done: L3('Endi singan rasmni bir qarashda tuzatasiz.', 'Теперь сломанную картинку ты починишь с одного взгляда.', 'Now you can fix a broken picture at a glance.')
  },
  // ИТОГОВАЯ ПРОВЕРКА (q1, q2): новый пример без образца; до первой попытки ответ не подсвечен.
  q1: {
    eyebrow: L3('O‘zingizni tekshiring', 'Проверь себя', 'Check yourself'),
    say: L3('Yangi sahifa: jonli burchak. Har bir rasmga alt tavsifiga mos faylni bering. Bitta stiker ortiqcha.',
      'Новая страница — живой уголок. Дай каждой картинке файл, который подходит к её описанию в alt. Одна наклейка лишняя.',
      'A new page: the pet corner. Give each picture the file that matches its alt description. One sticker is extra.'),
    why: {
      swap: L3('Qarang: rasm tavsifga mos emas. alt da nima yozilganini o‘qing.', 'Смотри: картинка не подходит к описанию. Прочитай, что написано в alt.', 'Look: the picture doesn’t match the description. Read what alt says.'),
      href: L3('Qarang: rasm chiqmadi, faqat alt matni. href havolalar uchun, rasmga src kerak.', 'Смотри: картинки нет, только текст из alt. href — для ссылок, картинке нужен src.', 'Look: no picture, only the alt text. href is for links; a picture needs src.')
    },
    hints: [
      L3('Har bir alt qaysi rasmni tasvirlaydi?', 'Какую картинку описывает каждый alt?', 'Which picture does each alt describe?'),
      L3('To‘tiqush parrot.png, baliq fish.jpg. Atribut nomi src bo‘lishi shart.', 'Попугай — parrot.png, рыбка — fish.jpg. Атрибут обязательно src.', 'The parrot is parrot.png, the fish is fish.jpg. The attribute must be src.'),
      L3('Yonib turgan stikerni yonib turgan joyga torting.', 'Перетащи светящуюся наклейку на светящееся место.', 'Drag the glowing sticker to the glowing spot.')
    ],
    ok: L3('Ajoyib! Har bir rasm o‘z tavsifiga mos.', 'Отлично! Каждая картинка подходит к своему описанию.', 'Great! Each picture matches its description.'),
    pickFirst: L3('Avval stikerni tanlang.', 'Сначала выбери наклейку.', 'Pick a sticker first.'),
    ask: L3('Fayl stikerini rasmga torting', 'Перетащи наклейку с файлом к картинке', 'Drag a file sticker to a picture'),
    askPlace: L3('Endi joyni bosing', 'Теперь нажми место', 'Now tap the spot')
  },
  q2: {
    eyebrow: L3('alt nima qiladi?', 'Что делает alt?', 'What does alt do?'),
    say: L3('Oxirgi savol. alt atributi nima qiladi?', 'Последний вопрос. Что делает атрибут alt?', 'Last question. What does the alt attribute do?'),
    // Верный ответ не первый; неверные гаснут после попытки, с объяснением.
    opts: [
      { id: 'addr', t: L3('Rasm faylining manzilini beradi', 'Задаёт адрес файла с картинкой', 'Gives the address of the picture file'),
        why: L3('Yo‘q: bu src ning ishi. alt rasmni so‘z bilan tasvirlaydi.', 'Нет: это работа src. А alt описывает картинку словами.', 'No: that’s what src does. alt describes the picture in words.') },
      { id: 'desc', right: true, t: L3('Rasmni so‘z bilan tasvirlaydi', 'Описывает картинку словами', 'Describes the picture in words') },
      { id: 'close', t: L3('img tegini yopadi', 'Закрывает тег img', 'Closes the img tag'),
        why: L3('Yo‘q: img ning yopuvchi tegi yo‘q. alt esa rasmni so‘z bilan tasvirlaydi.', 'Нет: у img нет закрывающего тега. А alt описывает картинку словами.', 'No: img has no closing tag. alt describes the picture in words.') }
    ],
    hints: [
      L3('Rasm yuklanmaganda brauzer nimani ko‘rsatgan edi?', 'Что показал браузер, когда картинка не загрузилась?', 'What did the browser show when the picture didn’t load?'),
      L3('Manzil src da. alt da esa so‘zlar turadi.', 'Адрес — в src. А в alt стоят слова.', 'The address is in src. alt holds words.'),
      L3('alt rasmni so‘z bilan tasvirlaydi.', 'alt описывает картинку словами.', 'alt describes the picture in words.')
    ],
    ok: L3('To‘g‘ri! alt rasmni so‘z bilan tasvirlaydi. Bu rasm yuklanmasa ham, uni ko‘rmaydigan odamga ham yordam beradi.', 'Верно! alt описывает картинку словами — на случай, если она не загрузится, и для тех, кто её не видит.', 'Right! alt describes the picture in words, in case it doesn’t load and for people who can’t see it.'),
    ask: L3('Javobni tanlang', 'Выбери ответ', 'Pick an answer')
  },
  s15: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3('Qarang: sahifa rasmlar bilan jonlandi!', 'Посмотри: страница ожила с картинками!', 'Look: the page came alive with pictures!'), k: null },
      { text: L3('img rasm qo‘yadi va yopuvchi tegsiz yoziladi.', 'img вставляет картинку и пишется без закрывающего тега.', 'img adds a picture and is written without a closing tag.'), k: 'img' },
      { text: L3('src rasm faylining manzili.', 'src — адрес файла с картинкой.', 'src is the address of the picture file.'), k: 'src' },
      { text: L3('alt rasmning so‘z bilan tavsifi. U rasm yuklanmasa ham, rasmni ko‘rmaydiganlarga ham yordam beradi.', 'alt — описание картинки словами: на случай, если она не загрузится, и для тех, кто её не видит.', 'alt describes the picture in words: for when it doesn’t load, and for people who can’t see it.'), k: 'alt' },
      { text: L3('Tabriklayman! Endi sahifalaringizga rasm qo‘ya olasiz.', 'Ура! Теперь ты умеешь вставлять картинки.', 'Hooray! Now you can add pictures to your pages.'), k: null }
    ],
    roles: {
      img: L3('img — rasm', 'img — картинка', 'img — picture'),
      src: L3('src — fayl manzili', 'src — адрес файла', 'src — file address'),
      alt: L3('alt — so‘z bilan tavsif', 'alt — описание словами', 'alt — description in words')
    },
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { opts: 1, why: 1, magic: 1, sayImg: 1, sayP: 1, sayNoClose: 1, sayAttr: 1, saySrc: 1, sayFile: 1, msgs: 1, askQ: 1, miss: 1,
  sayAlt: 1, sayFail: 1, sayReader: 1, parts: 1, sayOrder: 1, tapSay: 1, cards: 1, pickFirst: 1, rounds: 1 });
Object.assign(NOT_SPOKEN_IN, { opts: { t: 1, id: 1, right: 1 }, cards: { title: 1 }, rounds: { file: 1 } });
// Теги урока вслух — по-английски во всех языках (заказчик, 17.10.2026).
Object.assign(TAG_SAY.ru, { img: 'I M G', src: 'S R C', alt: 'alt', href: 'H ref' });
Object.assign(TAG_SAY.uz, { img: 'I M G', src: 'S R C', alt: 'alt', href: 'H ref' });
Object.assign(TAG_SAY.en, { img: 'I M G', src: 'S R C', alt: 'alt', href: 'H ref' });

/*@FILE:../kollazh/kollazh-paper-data.jsx@*/

/*@FILE:../kollazh/kollazh-paper.jsx@*/

/*@FILE:../kollazh/kollazh-kit.jsx@*/

/*@FILE:../kollazh/kollazh-trans.jsx@*/

/*@FILE:iz5-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:../kollazh/kollazh.css@*/
/*@FILE:iz5.css@*/
`;
