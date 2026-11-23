// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 3 — «Загрузка и изображения»
// (облик «Редактор», как уроки 1–2 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs3/build.mjs → lessons/bootstrap/03-zagruzka-i-izobrazheniya.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 3 · «Загрузка и изображения» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Уроки 1–2 пройдены: сайт getbootstrap.com, копирование строки и слова, CDN, Alert, кнопки,
// theme-*, fg-*, bg-*. Сайт кружка роботов получает страницу с фото: на телефоне фото вылезает за экран, пока фото
// грузятся — страница пустая. Ученик учится: img-fluid (фото не шире экрана), rounded / rounded-circle / rounded-pill,
// спиннер (spinner-border, spinner-grow, цвет fg-*) и заглушки (placeholder, placeholder-wave) — и находить всё это на
// сайте: Content → Images, Utilities → Border radius, Components → Spinner и Placeholder. Загадка (без имён): Коди думает,
// что для каждого телефона нужна своя маленькая копия фото; разгадка — один img-fluid подгоняет фото под любой экран.
// Решения заказчика — CLAUDE.md, «Модуль Bootstrap» (не меньше 17 слайдов, новое на сайте — показом «как на видео»).
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-03-zagruzka-i-izobrazheniya.md.
//   s1 крючок · фото: s2 показ (360 / 768 / 1200 px) · x1 опыт · g1 показ «как видео» (Images, img-fluid) · t1 сам ·
//   углы: s5 показ · g2 показ «как видео» (Border radius) · t2 по образцу · загрузка: s9 показ · g3 показ «как видео»
//   (Spinner, Copy, fg-primary) · t3 · s12 показ «как видео» (Placeholder) · t4 · итог: q1 картинка → код ·
//   t6 почему не работает · w1 своя карточка · s18 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честная страница: настоящий bootstrap.min.css 6.0.0-alpha.1; экран телефона — 360 px (BsFrame vw): большое фото
//     без img-fluid вылезает за край. Фото — рисунки SVG вместо файлов (robot.jpg 800×500, murabbiy.jpg 400×400, jamoa.jpg 900×400).
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы; в речи нет символов.
//
// СИСТЕМА СЛОВ: img-fluid, rounded, spinner-border, placeholder, Images, Content, Spinner, Placeholder — по-английски;
// rasm — картинка (фото); ekranga sig'madi — не поместилось; burchak — угол; yumaloq — круглый; yuklanish — загрузка;
// aylanuvchi belgi — спиннер (draft); kulrang chiziq — заглушка (placeholder, ya'ni o'rinbosar; draft).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-03-zagruzka-i-izobrazheniya',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '3-dars. Yuklanish va rasmlar',
    ru: 'Урок 3. Загрузка и изображения',
    en: 'Lesson 3. Loading and images'
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
  next: L3('Flex', 'Flex', 'Flex'),
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
    robots: L3('Bizning robotlar', 'Наши роботы', 'Our robots'),
    coach: L3('Murabbiyimiz', 'Наш тренер', 'Our coach'),
    team: L3("Jamoamiz musobaqada g'olib bo'ldi!", 'Наша команда победила на соревнованиях!', 'Our team won the contest!'),
    wait: L3('Rasmlar yuklanmoqda', 'Фото загружаются', 'Photos are loading'),
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
      native: L3("Bootstrap o'z so'zlarini biladi, oddiy so'zni emas. Kerakli so'zni saytdan oling.", 'Bootstrap знает свои слова, а не обычные. Возьми нужное слово с сайта.', 'Bootstrap knows its own words, not everyday ones. Take the right word from the site.'),
      old: L3("Bu eski nom, Bootstrapning oldingi versiyalaridan. Oltinchisida u ishlamaydi, so'zni saytdan oling.", 'Это старое имя из прошлых версий Bootstrap. В шестой оно не работает, возьми слово с сайта.', 'That’s an old name from earlier Bootstrap versions. It doesn’t work in version six: take the word from the site.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      unknown: L3("Bootstrap {w} so'zini bilmaydi, shuning uchun hech narsa o'zgarmadi. Saytdagi so'zlardan birini oling.", 'Bootstrap не знает слова {w}, поэтому ничего не изменилось. Возьми одно из слов на сайте.', 'Bootstrap doesn’t know the word {w}, so nothing changed. Take one of the words from the site.'),
      fam: L3("{w} boshqa narsa uchun. Bu joyga boshqa so'z kerak: sahifani namuna bilan solishtiring.", '{w} — для другого. Сюда нужно другое слово: сравни страницу с образцом.', '{w} is for something else. This spot needs another word: compare the page with the goal.'),
      fam_fg: L3("{w} bu matn rangi emas. Rang fg bilan boshlanadi, xuddi o'tgan darsdagidek.", '{w} — это не цвет текста. Цвет начинается с fg, как на прошлом уроке.', '{w} isn’t a text color. Color starts with fg, just like last lesson.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas. Sahifani namuna bilan solishtiring.", 'Bootstrap это слово знает, но результат не как в образце. Сравни страницу с образцом.', 'Bootstrap knows that word, but the result isn’t like the goal. Compare the page with the goal.')
    }
  },
  s1: {
    eyebrow: L3("Rasm sig'madi", 'Фото не помещается', 'The photo doesn’t fit'),
    say: L3("Salom! Saytga robotimizning katta rasmini qo'ydim. Kompyuterda chiroyli edi. Lekin telefonda qarang: rasm ekranga sig'madi, o'ng tomoni chiqib ketdi! Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Я поставил на сайт большое фото нашего робота. На компьютере было красиво. Но посмотри на телефоне: фото не помещается в экран, правая часть вылезла! Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! I put a big photo of our robot on the site. It looked great on a computer. But look at the phone: the photo doesn’t fit, its right side sticks out! Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Rasm ekranga to'liq sig'di. Kodga qarang: img tegiga bitta so'z qo'shildi, img-fluid.",
      'Ого! Фото целиком поместилось в экран. Посмотри на код: у тега img появилось одно слово, img-fluid.',
      'Whoa! The whole photo fits the screen now. Look at the code: the img tag got one word, img-fluid.'),
    done: L3("Bugun rasmlar va yuklanish bilan ishlaymiz: rasmni ekranga sig'diramiz, burchaklarini yumaloq qilamiz, sayt yuklanayotganini ko'rsatamiz. Lekin oldin topishmoq. Menimcha, rasm har bir telefonga sig'ishi uchun har bir telefon uchun alohida kichik nusxa saqlash kerak. Telefonlar esa minglab! Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida topamiz.",
      'Сегодня работаем с фото и загрузкой: впишем фото в экран, скруглим углы, покажем, что сайт загружается. Но сначала загадка. По-моему, чтобы фото помещалось на каждый телефон, для каждого телефона нужно хранить свою маленькую копию. А телефонов тысячи! Как думаешь, я прав? Ответ найдём в конце урока.',
      'Today we work with photos and loading: we’ll fit photos to the screen, round their corners and show that the site is loading. But first, a riddle. I think that for a photo to fit every phone, you need to keep a separate small copy for each phone. And there are thousands of phones! What do you think, am I right? We’ll find the answer at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3("img-fluid: rasm ekranga sig'adi", 'img-fluid: фото помещается в экран', 'img-fluid: the photo fits the screen')
  },
  s2: {
    eyebrow: L3('img-fluid nima qiladi', 'Что делает img-fluid', 'What img-fluid does'),
    help: [
      L3("Ekran kengligiga va rasm kengligiga qarang: 360, 768, 1200 va 800.", 'Посмотри на ширину экрана и ширину фото: 360, 768, 1200 и 800.', 'Look at the screen width and the photo width: 360, 768, 1200 and 800.'),
      L3("img-fluid rasmni ekrandan keng bo'lishiga qo'ymaydi. Lekin kichik rasmni kattalashtirmaydi.", 'img-fluid не даёт фото быть шире экрана. Но маленькое фото не растягивает.', 'img-fluid doesn’t let a photo be wider than the screen. But it doesn’t stretch a small photo.'),
      L3("Bu ko'ylakka o'xshaydi: katta odamga katta, bolaga esa siqilib sig'adi, lekin o'z o'lchamidan oshmaydi.", 'Это как растягивающаяся футболка: на маленького садится по размеру, но больше своего размера не становится.', 'It’s like a stretchy T-shirt: it fits a small person, but never gets bigger than its own size.')
    ],
    say: L3("Keling, nima bo'layotganini tushunamiz. Rasmimizning kengligi 800 piksel. Telefon ekrani esa 360 piksel. Qarang, ekranni kengaytirib boramiz.",
      'Давай разберёмся, что происходит. Ширина нашего фото — 800 пикселей. А экран телефона — 360 пикселей. Смотри, будем расширять экран.',
      'Let’s figure out what’s going on. Our photo is 800 pixels wide. And the phone screen is 360 pixels. Watch, we’ll widen the screen.'),
    sayNo: L3("Telefon va planshetda rasm sig'madi. Faqat keng kompyuter ekranida sig'di, chunki u 800 pikseldan keng. Demak, class bo'lmasa, rasm doim o'z o'lchamida turadi.",
      'На телефоне и планшете фото не поместилось. Только на широком экране компьютера, потому что он шире 800 пикселей. Значит, без class фото всегда своего размера.',
      'On the phone and tablet the photo didn’t fit. Only on the wide computer screen, because it’s wider than 800 pixels. So without class, a photo always keeps its own size.'),
    sayFluid: L3("Endi img-fluid qo'shamiz. Bu so'z rasmga aytadi: ekrandan keng bo'lma. Telefonda rasm o'zi kichrayib, to'liq sig'di!",
      'А теперь добавим img-fluid. Это слово говорит фото: не будь шире экрана. На телефоне фото само уменьшилось и поместилось целиком!',
      'Now let’s add img-fluid. This word tells the photo: don’t be wider than the screen. On the phone the photo shrank by itself and fits completely!'),
    sayBig: L3("Keng ekranda esa rasm 800 pikselligicha qoldi, cho'zilmadi. img-fluid faqat kichraytiradi, kattalashtirmaydi.",
      'А на широком экране фото осталось 800 пикселей и не растянулось. img-fluid только уменьшает и никогда не увеличивает.',
      'And on the wide screen the photo stayed 800 pixels and didn’t stretch. img-fluid only shrinks, it never enlarges.'),
    done: L3("Eslab qoling: img-fluid rasmni ekranga sig'diradi, lekin o'z o'lchamidan katta qilmaydi.",
      'Запомни: img-fluid вписывает фото в экран, но не делает его больше своего размера.',
      'Remember: img-fluid fits a photo to the screen but never makes it bigger than its own size.'),
    askOff: L3('Qarang: ekran {w} px, class yo\'q', 'Смотри: экран {w} px, без class', 'Watch: screen {w} px, no class'),
    askOn: L3('Qarang: ekran {w} px, img-fluid bilan', 'Смотри: экран {w} px, с img-fluid', 'Watch: screen {w} px, with img-fluid'),
    askDone: L3("img-fluid: ekrandan keng emas", 'img-fluid: не шире экрана', 'img-fluid: never wider than the screen'),
    screenL: L3('ekran', 'экран', 'screen'),
    photoL: L3('rasm', 'фото', 'photo')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz sinab ko'ring. Pastda uchta ekran va img-fluid tugmasi bor. Uchala ekranni bosing va img-fluid ni yoqib-o'chirib ko'ring.",
      'Теперь попробуй сам. Внизу три экрана и переключатель img-fluid. Нажми все три экрана и включи и выключи img-fluid.',
      'Now try it yourself. Below are three screens and an img-fluid switch. Tap all three screens and turn img-fluid on and off.'),
    phone: L3('Telefon', 'Телефон', 'Phone'),
    tablet: L3('Planshet', 'Планшет', 'Tablet'),
    laptop: L3('Noutbuk', 'Ноутбук', 'Laptop'),
    cut: L3("Rasm sig'madi, chunki u ekrandan keng.", 'Фото не поместилось: оно шире экрана.', 'The photo doesn’t fit: it’s wider than the screen.'),
    bigOk: L3("Keng ekranga rasm sig'di, lekin telefonda-chi?", 'На широкий экран фото поместилось. А на телефоне?', 'The photo fits the wide screen. But what about the phone?'),
    fits: L3("img-fluid bilan rasm bu ekranga ham sig'di.", 'С img-fluid фото поместилось и на этот экран.', 'With img-fluid the photo fits this screen too.'),
    on: L3("img-fluid yoqildi: rasm ekrandan keng emas.", 'img-fluid включён: фото не шире экрана.', 'img-fluid is on: the photo is no wider than the screen.'),
    off: L3("img-fluid o'chdi: rasm yana o'z o'lchamida.", 'img-fluid выключен: фото снова своего размера.', 'img-fluid is off: the photo is back to its own size.'),
    ok: L3("Ajoyib! Ko'rdingizmi, img-fluid bilan rasm hamma ekranga sig'adi.", 'Отлично! Видишь: с img-fluid фото помещается на любой экран.', 'Great! See: with img-fluid the photo fits any screen.'),
    done: L3("Endi bu so'zni Bootstrap saytidan qanday topishni ko'ramiz.", 'Теперь посмотрим, как найти это слово на сайте Bootstrap.', 'Now let’s see how to find this word on the Bootstrap site.'),
    hints: [
      L3("Pastdagi ekran tugmalarini va img-fluid tugmasini bosing.", 'Нажимай кнопки экранов внизу и переключатель img-fluid.', 'Tap the screen buttons below and the img-fluid switch.'),
      L3("Uchala ekranni bosing: telefon, planshet, noutbuk.", 'Нажми все три экрана: телефон, планшет, ноутбук.', 'Tap all three screens: phone, tablet, laptop.'),
      L3("img-fluid ni yoqing, keyin yana o'chiring.", 'Включи img-fluid, потом снова выключи.', 'Turn img-fluid on, then off again.')
    ],
    ask: L3("Uchala ekranni va img-fluid ni sinang", 'Попробуй все три экрана и img-fluid', 'Try all three screens and img-fluid'),
    askDone: L3("img-fluid bilan rasm hamma ekranga sig'adi", 'С img-fluid фото помещается на любой экран', 'With img-fluid the photo fits any screen'),
    widthH: L3('Ekran', 'Экран', 'Screen')
  },
  g1: {
    eyebrow: L3('Images sahifasi', 'Страница Images', 'The Images page'),
    help: [
      L3("Menyudagi Content bo'limiga, Images sahifasiga va belgilangan so'zga qarang.", 'Посмотри на раздел Content в меню, на страницу Images и на выделенное слово.', 'Look at Content in the menu, the Images page and the selected word.'),
      L3("Rasm haqidagi hamma narsa Content bo'limida, Images sahifasida. Bizga Responsive images qismi kerak.", 'Всё про картинки — в разделе Content, на странице Images. Нам нужна часть Responsive images.', 'Everything about images is in Content, on the Images page. We need the Responsive images part.'),
      L3("Bu kitobning mundarijasiga o'xshaydi: bo'limni topasiz, keyin kerakli sahifani.", 'Это как оглавление книги: находишь раздел, потом нужную страницу.', 'It’s like a book’s contents: find the section, then the right page.')
    ],
    say: L3("img-fluid so'zi saytda qayerda turibdi? Qarang, rasmlar uchun alohida sahifa bor.",
      'Где на сайте слово img-fluid? Смотри, для картинок есть отдельная страница.',
      'Where is the word img-fluid on the site? Look, there’s a separate page for images.'),
    sayPage: L3("Content bo'limida Images sahifasini ochdim. Birinchi qism Responsive images, ya'ni ekranga moslashadigan rasmlar degani. Misol va kod shu yerda.",
      'В разделе Content открыл страницу Images. Первая часть — Responsive images, то есть картинки, которые подстраиваются под экран. Пример и код здесь.',
      'In Content I opened the Images page. The first part is Responsive images, meaning images that adapt to the screen. The example and code are here.'),
    sayApply: L3("Ikki marta bosib, img-fluid so'zini belgiladim va nusxaladim. Uni img tegining class qismiga qo'ydim. Rasm telefonga sig'di!",
      'Двойным щелчком выделил слово img-fluid и скопировал. Вставил его в class тега img. Фото поместилось на телефон!',
      'I double-clicked img-fluid, copied it and put it in the img tag’s class. The photo fits the phone!'),
    done: L3("Eslab qoling: rasmlar Content bo'limida, Images sahifasida.", 'Запомни: картинки — в разделе Content, на странице Images.', 'Remember: images are in Content, on the Images page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Content → Images', 'Смотри: Content → Images', 'Watch: Content → Images'),
    askPage: L3('Qarang: Responsive images', 'Смотри: Responsive images', 'Watch: Responsive images'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3("Qarang: rasm sig'di", 'Смотри: фото поместилось', 'Watch: the photo fits'),
    askDone: L3('Content → Images → img-fluid', 'Content → Images → img-fluid', 'Content → Images → img-fluid')
  },
  t1: {
    eyebrow: L3("Rasmni sig'diring", 'Впиши фото', 'Fit the photo'),
    say: L3("Jamoa rasmi ham telefonga sig'madi. Saytdan Images sahifasini toping, img-fluid yozilgan qatorni bosing, keyin kodda rasm qatorini bosing.",
      'Фото команды тоже не помещается на телефон. Найди на сайте страницу Images, нажми строку с img-fluid, потом нажми строку фото в коде.',
      'The team photo doesn’t fit the phone either. Find the Images page on the site, tap the line with img-fluid, then tap the photo line in the code.'),
    ask: L3('img-fluid qatorini bosing', 'Нажми строку с img-fluid', 'Tap the img-fluid line'),
    // Меню сайта в узком окне спрятано за ☰ — строка задания и первая подсказка называют её (23.11.2026); меню слева — askFindSide.
    askFind: L3("☰ tugmasini bosing va Content → Images sahifasini toping", 'Нажми ☰ и найди Content → Images', 'Tap ☰ and find Content → Images'),
    askFindSide: L3("Chapdagi menyudan Content → Images sahifasini toping", 'Найди в меню слева Content → Images', 'Find Content → Images in the menu on the left'),
    hintMenu: L3("Menyu yashiringan. Sayt oynasining yuqori o'ng burchagidagi uch chiziqli tugmani bosing.", 'Меню спрятано. Нажми кнопку с тремя полосками в правом верхнем углу окна сайта.', 'The menu is hidden. Tap the three-line button in the top right corner of the site window.'),
    // После копирования строка задания говорит, куда вставить (23.11.2026, как askPaste урока 1).
    askPaste: L3("Endi kodda jamoa rasmi qatoridagi bo'sh joyni bosing", 'Теперь нажми пустое место в строке фото команды', 'Now tap the empty spot in the team photo line'),
    copied: L3("Nusxalandi! Endi kodda jamoa rasmi qatorini bosing.", 'Скопировано! Теперь нажми в коде строку фото команды.', 'Copied! Now tap the team photo line in the code.'),
    msgs: {
      wrongPage: L3("Bu {w} sahifasi. Rasmlar Content bo'limida, Images sahifasida.", 'Это страница {w}. Картинки — в разделе Content, на странице Images.', 'This is the {w} page. Images are in Content, on the Images page.'),
      thumb: L3("Bu img-thumbnail: rasmga ramka qo'shadi. Bizga faqat sig'dirish kerak, Responsive images qismi.", 'Это img-thumbnail: он добавляет фото рамку. Нам нужно только вписать, часть Responsive images.', 'That’s img-thumbnail: it adds a frame. We only need to fit the photo: the Responsive images part.'),
      noClip: L3("Oldin saytda img-fluid qatorini bosing.", 'Сначала нажми строку с img-fluid на сайте.', 'First tap the img-fluid line on the site.')
    },
    hints: [
      L3("Rasmlar qaysi bo'limda turadi? Menyuni oching.", 'В каком разделе картинки? Открой меню.', 'Which section holds images? Open the menu.'),
      L3("Content, keyin Images. Birinchi kodda img-fluid bor.", 'Content, потом Images. В первом коде есть img-fluid.', 'Content, then Images. The first code has img-fluid.'),
      L3("img-fluid qatorini, keyin kodda jamoa rasmi qatorini bosing.", 'Нажми строку с img-fluid, потом строку фото команды в коде.', 'Tap the img-fluid line, then the team photo line in the code.')
    ],
    ok: L3("Zo'r! Ikkala rasm ham telefonga sig'di.", 'Огонь! Оба фото поместились на телефон.', 'Awesome! Both photos fit the phone.')
  },
  s5: {
    eyebrow: L3('Yumaloq burchaklar', 'Круглые углы', 'Rounded corners'),
    help: [
      L3("Rasmlarning burchaklariga va class dagi ikkinchi so'zga qarang.", 'Посмотри на углы фото и на второе слово в class.', 'Look at the photos’ corners and the second word in class.'),
      L3("rounded burchakni yumshatadi, rounded-circle doira qiladi, rounded-pill tabletka shakliga keltiradi.", 'rounded скругляет углы, rounded-circle делает круг, rounded-pill — форму таблетки.', 'rounded softens the corners, rounded-circle makes a circle, rounded-pill makes a pill shape.'),
      L3("Bu suratni qaychi bilan qirqishga o'xshaydi: burchakni ozgina kesasiz yoki doira qilib qirqasiz.", 'Это как вырезать фото ножницами: срезать уголки чуть-чуть или вырезать кружок.', 'It’s like cutting a photo with scissors: trim the corners a bit or cut out a circle.')
    ],
    say: L3("Rasmlar sig'di, lekin burchaklari o'tkir, xuddi qog'oz varag'idek. Saytlarda rasmlar ko'pincha yumaloq bo'ladi. Qarang, bitta so'z nima qiladi.",
      'Фото поместились, но углы у них острые, как у листа бумаги. На сайтах фото часто скруглены. Смотри, что делает одно слово.',
      'The photos fit, but their corners are sharp, like a sheet of paper. On websites photos are often rounded. Watch what one word does.'),
    sayRounded: L3("rounded so'zi burchaklarni ozgina yumaloq qildi. Rasm yumshoqroq ko'rinadi.", 'Слово rounded немного скруглило углы. Фото выглядит мягче.', 'The word rounded rounded the corners a little. The photo looks softer.'),
    sayCircle: L3("rounded-circle esa rasmni doira qiladi. Murabbiyning kvadrat rasmi chiroyli doira bo'ldi. Lekin diqqat qiling: uzun rasm doira emas, oval bo'ldi.",
      'А rounded-circle делает круг. Квадратное фото тренера стало красивым кругом. Но внимание: длинное фото стало не кругом, а овалом.',
      'And rounded-circle makes a circle. The coach’s square photo became a nice circle. But careful: the long photo became an oval, not a circle.'),
    sayPill: L3("Uzun rasm uchun rounded-pill bor: chetlari yumaloq, xuddi tabletkadek.", 'Для длинного фото есть rounded-pill: края круглые, как у таблетки.', 'For a long photo there’s rounded-pill: the ends are round, like a pill.'),
    done: L3("Eslab qoling: rounded — yumaloq burchak, rounded-circle — doira, rounded-pill — tabletka.", 'Запомни: rounded — скруглённые углы, rounded-circle — круг, rounded-pill — таблетка.', 'Remember: rounded is rounded corners, rounded-circle is a circle, rounded-pill is a pill.'),
    askStart: L3("Qarang: o'tkir burchaklar", 'Смотри: острые углы', 'Watch: sharp corners'),
    askRounded: L3('Qarang: rounded', 'Смотри: rounded', 'Watch: rounded'),
    askCircle: L3('Qarang: rounded-circle', 'Смотри: rounded-circle', 'Watch: rounded-circle'),
    askPill: L3('Qarang: rounded-pill', 'Смотри: rounded-pill', 'Watch: rounded-pill'),
    askDone: L3('rounded · rounded-circle · rounded-pill', 'rounded · rounded-circle · rounded-pill', 'rounded · rounded-circle · rounded-pill')
  },
  g2: {
    eyebrow: L3('Border radius sahifasi', 'Страница Border radius', 'The Border radius page'),
    help: [
      L3("Menyudagi Utilities bo'limiga, Border radius sahifasiga va belgilangan so'zga qarang.", 'Посмотри на раздел Utilities в меню, страницу Border radius и выделенное слово.', 'Look at Utilities in the menu, the Border radius page and the selected word.'),
      L3("Border radius, ya'ni burchak radiusi degani. Sizes qismida barcha yumaloq so'zlar bor.", 'Border radius — это радиус углов. В части Sizes есть все слова скругления.', 'Border radius means the corner radius. The Sizes part has all the rounding words.'),
      L3("Bu do'kondagi o'lchamlar ro'yxatiga o'xshaydi: kichikdan kattagacha, oxirida doira.", 'Это как список размеров в магазине: от маленького к большому, в конце круг.', 'It’s like a size chart in a shop: from small to big, with a circle at the end.')
    ],
    say: L3("Murabbiyning rasmini doira qilamiz. So'zni saytdan olamiz. Bu safar u Utilities bo'limida.",
      'Сделаем фото тренера круглым. Слово возьмём с сайта. На этот раз оно в разделе Utilities.',
      'Let’s make the coach’s photo round. We’ll take the word from the site. This time it’s in Utilities.'),
    sayPage: L3("Utilities bo'limida Border radius sahifasini ochdim. Sizes qismida rasmlar burchagi kichikdan kattagacha, oxirida doira va tabletka.",
      'В Utilities открыл страницу Border radius. В части Sizes углы от маленьких к большим, в конце круг и таблетка.',
      'In Utilities I opened the Border radius page. In Sizes the corners go from small to big, with a circle and a pill at the end.'),
    sayApply: L3("rounded-circle so'zini belgilab, nusxaladim va img-fluid dan keyin qo'ydim. Murabbiyning rasmi doira bo'ldi!",
      'Выделил rounded-circle, скопировал и поставил после img-fluid. Фото тренера стало круглым!',
      'I selected rounded-circle, copied it and put it after img-fluid. The coach’s photo is round now!'),
    done: L3("Diqqat qiling: class ichida ikkita so'z: img-fluid sig'diradi, rounded-circle doira qiladi. So'zlar bir-biriga xalal bermaydi.",
      'Внимание: в class два слова: img-fluid вписывает в экран, rounded-circle делает круг. Слова друг другу не мешают.',
      'Heads up: class has two words: img-fluid fits the screen, rounded-circle makes a circle. They don’t get in each other’s way.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Utilities → Border radius', 'Смотри: Utilities → Border radius', 'Watch: Utilities → Border radius'),
    askPage: L3("Qarang: Sizes qismi", 'Смотри: часть Sizes', 'Watch: the Sizes part'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3('Qarang: rasm doira bo\'ldi', 'Смотри: фото стало кругом', 'Watch: the photo is a circle'),
    askDone: L3('Utilities → Border radius', 'Utilities → Border radius', 'Utilities → Border radius')
  },
  t2: {
    eyebrow: L3('Burchaklar', 'Углы', 'Corners'),
    say: L3("Endi o'zingiz. Namunaga qarang va img-fluid dan keyin kerakli so'zni yozing. So'zlar saytdagi Sizes qismida.",
      'Теперь сам. Посмотри на образец и впиши после img-fluid нужное слово. Слова — в части Sizes на сайте.',
      'Now you. Look at the goal and type the right word after img-fluid. The words are in the Sizes part on the site.'),
    ask1: L3("Murabbiy rasmi doira bo'lsin", 'Фото тренера — круг', 'Make the coach’s photo a circle'),
    ask2: L3('Jamoa rasmining burchaklari yumaloq bo\'lsin', 'У фото команды — скруглённые углы', 'Round the team photo’s corners'),
    ask3: L3("Jamoa rasmi tabletka shaklida bo'lsin", 'Фото команды — таблеткой', 'Make the team photo a pill'),
    hints1: [
      L3("So'z rounded bilan boshlanadi.", 'Слово начинается с rounded.', 'The word starts with rounded.'),
      L3("Doira inglizcha circle bo'ladi.", 'Круг по-английски — circle.', 'A circle in English is circle.'),
      L3("Yozing: rounded-circle", 'Впиши: rounded-circle', 'Type: rounded-circle')
    ],
    hints2: [
      L3("Burchaklarni rounded so'zi yumaloq qiladi. Uning yonida raqam ham bo'lishi mumkin.", 'Углы скругляет слово rounded. После него может стоять и число.', 'The word rounded rounds the corners. It can have a number after it too.'),
      L3("Saytda rounded-0 dan rounded-9 gacha bor. Nolda burchak o'tkir, raqam qancha katta bo'lsa, shuncha yumaloq.", 'На сайте есть от rounded-0 до rounded-9. При нуле углы острые, чем больше число, тем круглее.', 'The site has rounded-0 to rounded-9. Zero means sharp corners; the bigger the number, the rounder.'),
      L3("Yozing: rounded yoki, masalan, rounded-5", 'Впиши: rounded или, например, rounded-5', 'Type: rounded or, for example, rounded-5')
    ],
    hints3: [
      L3("Tabletka inglizcha pill bo'ladi.", 'Таблетка по-английски — pill.', 'A pill in English is pill.'),
      L3("Saytdagi ro'yxatda u eng oxirida turibdi.", 'В списке на сайте он самый последний.', 'It’s the very last one in the site’s list.'),
      L3("Yozing: rounded-pill", 'Впиши: rounded-pill', 'Type: rounded-pill')
    ],
    why1: L3("rounded-circle kvadrat rasmni doira qiladi.", 'rounded-circle делает квадратное фото кругом.', 'rounded-circle turns a square photo into a circle.'),
    // Квадратное фото: rounded-pill рисует тот же круг — тоже верно (23.11.2026).
    why1pill: L3("Kvadrat rasmda rounded-pill ham doira chizadi, bu ham to'g'ri. Lekin doira uchun alohida so'z bor: rounded-circle.", 'На квадратном фото rounded-pill тоже рисует круг, так тоже верно. Но для круга есть своё слово: rounded-circle.', 'On a square photo rounded-pill draws a circle too, so that’s also right. But a circle has its own word: rounded-circle.'),
    why2: L3("Burchaklar yumaloq bo'ldi. rounded va raqamli rounded so'zlari burchaklarni yumshatadi.", 'Углы скруглились. rounded и rounded с числом смягчают углы.', 'The corners got rounded. rounded and rounded with a number soften the corners.'),
    why3: L3("rounded-pill uzun rasmni tabletka qiladi.", 'rounded-pill делает длинное фото таблеткой.', 'rounded-pill turns a long photo into a pill.'),
    done: L3("Qoyil! Endi har qanday rasmga kerakli burchakni bera olasiz.", 'Класс! Теперь любому фото дашь нужные углы.', 'Nice! Now you can give any photo the corners it needs.')
  },
  s9: {
    eyebrow: L3('Sayt yuklanmoqda', 'Сайт загружается', 'The site is loading'),
    help: [
      L3("Sahifadagi aylanuvchi belgiga, keyin koddagi spinner-border va role qatoriga qarang.", 'Посмотри на крутящийся значок на странице, потом на spinner-border и role в коде.', 'Look at the spinning icon on the page, then at spinner-border and role in the code.'),
      L3("Spinner, ya'ni aylanuvchi belgi degani. U foydalanuvchiga aytadi: sayt ishlayapti, ozgina kuting.", 'Спиннер — это крутящийся значок. Он говорит человеку: сайт работает, подожди немного.', 'A spinner is a spinning icon. It tells the person: the site is working, wait a moment.'),
      L3("Bu kompyuterdagi qum soatiga o'xshaydi: kutishni bilsangiz, asabiylashmaysiz.", 'Это как песочные часы на компьютере: когда знаешь, что надо подождать, не нервничаешь.', 'It’s like an hourglass on a computer: when you know you have to wait, you don’t get nervous.')
    ],
    say: L3("Internet sekin bo'lsa, rasmlar darrov chiqmaydi. Qarang: sahifa bo'm-bo'sh. Odam o'ylaydi: sayt buzilgan, va ketib qoladi.",
      'Если интернет медленный, фото появляются не сразу. Смотри: страница пустая. Человек думает: сайт сломан, — и уходит.',
      'If the internet is slow, photos don’t appear right away. Look: the page is empty. A person thinks the site is broken and leaves.'),
    saySpin: L3("Endi spinner qo'shamiz. Aylanayotgan halqa aytadi: kuting, hozir yuklanadi. Bootstrapda bu spinner-border.",
      'Добавим спиннер. Крутящееся кольцо говорит: подожди, сейчас загрузится. В Bootstrap это spinner-border.',
      'Let’s add a spinner. The spinning ring says: wait, it’s loading. In Bootstrap that’s spinner-border.'),
    sayLoaded: L3("Mana, rasm yuklandi va spinner o'z ishini bitirib, g'oyib bo'ldi.", 'Вот, фото загрузилось, и спиннер, сделав своё дело, исчез.', 'There, the photo loaded, and the spinner did its job and disappeared.'),
    sayRole: L3("Kodda yana ikkita narsa bor. role status va ichidagi Loading yozuvi ko'zga ko'rinmaydi. Ular ko'zi ojiz odamlar uchun: kompyuter ularga ovoz bilan yuklanayotganini aytadi.",
      'В коде есть ещё две вещи. role status и надпись Loading внутри не видны глазу. Они для незрячих людей: компьютер голосом скажет им, что идёт загрузка.',
      'There are two more things in the code. role status and the Loading text inside aren’t visible. They’re for blind people: the computer will tell them out loud that something is loading.'),
    done: L3("Eslab qoling: kutish kerak bo'lsa, spinner qo'yamiz, shunda odam saytni tark etmaydi.", 'Запомни: когда нужно подождать, ставим спиннер — тогда человек не уйдёт с сайта.', 'Remember: when people need to wait, we add a spinner so they don’t leave the site.'),
    askStart: L3("Qarang: sahifa bo'sh", 'Смотри: страница пустая', 'Watch: the page is empty'),
    askSpin: L3('Qarang: spinner', 'Смотри: спиннер', 'Watch: the spinner'),
    askLoaded: L3('Qarang: rasm yuklandi', 'Смотри: фото загрузилось', 'Watch: the photo loaded'),
    askRole: L3("Qarang: ko'rinmas yozuv", 'Смотри: невидимая надпись', 'Watch: the invisible text'),
    askDone: L3("Spinner: kuting, yuklanyapti", 'Спиннер: подожди, загружается', 'Spinner: wait, it’s loading')
  },
  g3: {
    eyebrow: L3('Spinner sahifasi', 'Страница Spinner', 'The Spinner page'),
    help: [
      L3("Menyudagi Spinner bandiga, nusxa olish belgisiga va Variants qismiga qarang.", 'Посмотри на пункт Spinner в меню, на значок копирования и на часть Variants.', 'Look at Spinner in the menu, the copy icon and the Variants part.'),
      L3("Spinner kodi uch qatordan iborat, shuning uchun uni nusxa olish belgisi bilan butunlay olamiz. Rangni esa fg so'zi beradi.", 'Код спиннера — три строки, поэтому берём его целиком значком копирования. А цвет даёт слово fg.', 'The spinner code is three lines, so we take it whole with the copy icon. The color comes from an fg word.'),
      L3("Bu tayyor ovqatni olishga o'xshaydi: butunlay olasiz, keyin ziravor qo'shasiz.", 'Это как взять готовое блюдо целиком, а потом добавить приправу.', 'It’s like taking a ready meal whole and then adding some seasoning.')
    ],
    say: L3("Spinner kodini o'zimiz yozmaymiz, saytdan olamiz. Qarang.", 'Код спиннера сами не пишем, берём с сайта. Смотри.', 'We don’t write the spinner code ourselves, we take it from the site. Watch.'),
    sayPage: L3("Components bo'limida Spinner sahifasi. Birinchi qism Border spinner: misol va uch qatorli kod.", 'В разделе Components — страница Spinner. Первая часть — Border spinner: пример и код из трёх строк.', 'In Components there’s the Spinner page. The first part is Border spinner: an example and three lines of code.'),
    sayPaste: L3("Nusxa olish belgisini bosdim va kodni body ichiga qo'ydim. Mana, sahifamizda spinner aylanyapti!", 'Нажал значок копирования и вставил код в body. Вот, на нашей странице крутится спиннер!', 'I tapped the copy icon and pasted the code into body. There, a spinner is spinning on our page!'),
    sayColor: L3("Variants qismida rangli spinnerlar bor. Rang so'zi tanish: fg-primary. Uni qo'shdim, spinner ko'k bo'ldi.", 'В части Variants есть цветные спиннеры. Слово цвета знакомое: fg-primary. Добавил — спиннер стал синим.', 'In Variants there are colored spinners. The color word is familiar: fg-primary. I added it, and the spinner turned blue.'),
    done: L3("Eslab qoling: spinner Components bo'limida. Uning rangi fg so'zi bilan, xuddi matn rangidek.", 'Запомни: спиннер — в разделе Components. Его цвет задаёт слово fg, как у текста.', 'Remember: the spinner is in Components. Its color comes from an fg word, just like text.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Spinner', 'Смотри: Components → Spinner', 'Watch: Components → Spinner'),
    askPage: L3('Qarang: Border spinner', 'Смотри: Border spinner', 'Watch: Border spinner'),
    askPaste: L3("Qarang: kod body ichida", 'Смотри: код в body', 'Watch: the code is in body'),
    askColor: L3('Qarang: fg-primary', 'Смотри: fg-primary', 'Watch: fg-primary'),
    askDone: L3('Components → Spinner', 'Components → Spinner', 'Components → Spinner')
  },
  t3: {
    eyebrow: L3('Spinner yasang', 'Сделай спиннер', 'Make a spinner'),
    say: L3("Endi spinnerni o'zingiz sozlaysiz. Namunaga qarang va bo'sh joyga kerakli so'zni yozing. So'zlar saytda.",
      'Теперь настраиваешь спиннер ты. Посмотри на образец и впиши в пустое место нужное слово. Слова — на сайте.',
      'Now you set up the spinner. Look at the goal and type the right word into the empty spot. The words are on the site.'),
    ask1: L3('Aylanuvchi halqa bo\'lsin', 'Пусть будет крутящееся кольцо', 'Make a spinning ring'),
    ask2: L3("Endi kattalashib-kichrayadigan nuqta bo'lsin", 'Теперь — точка, которая растёт', 'Now make a growing dot'),
    ask3: L3("Halqa qizil bo'lsin", 'Кольцо — красное', 'Make the ring red'),
    hints1: [
      L3("So'z spinner bilan boshlanadi.", 'Слово начинается со spinner.', 'The word starts with spinner.'),
      L3("Halqa — border, ya'ni chegara degani.", 'Кольцо — это border, то есть рамка.', 'A ring is border.'),
      L3("Yozing: spinner-border", 'Впиши: spinner-border', 'Type: spinner-border')
    ],
    hints2: [
      L3("Saytdagi Growing spinner misoliga qarang: class ichida qaysi so'z?", 'Посмотри на пример Growing spinner на сайте: какое слово в class?', 'Look at the Growing spinner example on the site: which word is in class?'),
      L3("O'sish inglizcha grow bo'ladi.", 'Расти по-английски — grow.', 'To grow in English is grow.'),
      L3("Yozing: spinner-grow", 'Впиши: spinner-grow', 'Type: spinner-grow')
    ],
    hints3: [
      L3("Rang so'zi fg bilan boshlanadi, xuddi matn rangidek.", 'Слово цвета начинается с fg, как у текста.', 'The color word starts with fg, just like text.'),
      L3("Qizil — xavf rangi, danger.", 'Красный — цвет опасности, danger.', 'Red is the danger color, danger.'),
      L3("Yozing: fg-danger", 'Впиши: fg-danger', 'Type: fg-danger')
    ],
    why1: L3("spinner-border aylanuvchi halqa.", 'spinner-border — крутящееся кольцо.', 'spinner-border is a spinning ring.'),
    why2: L3("spinner-grow kattalashib-kichrayadi.", 'spinner-grow растёт и пропадает.', 'spinner-grow grows and fades.'),
    why3: L3("fg-danger spinnerni qizil qiladi.", 'fg-danger делает спиннер красным.', 'fg-danger makes the spinner red.'),
    done: L3("Ajoyib! Endi spinnerning shaklini ham, rangini ham tanlay olasiz.", 'Отлично! Теперь ты выбираешь и форму спиннера, и цвет.', 'Great! Now you can pick both the spinner’s shape and its color.')
  },
  s12: {
    eyebrow: L3('Kulrang chiziqlar', 'Серые полосы', 'Gray bars'),
    help: [
      L3("Saytdagi ikkita kartochkaga, keyin koddagi placeholder so'ziga qarang.", 'Посмотри на две карточки на сайте, потом на слово placeholder в коде.', 'Look at the two cards on the site, then at the word placeholder in the code.'),
      L3("Placeholder, ya'ni o'rinbosar degani: matn kelguncha uning o'rnida kulrang chiziq turadi. col-6 chiziqni yarim kenglikda qiladi, placeholder-wave esa to'lqin yuritadi.", 'Placeholder — это «заместитель»: пока текст не пришёл, на его месте серая полоса. col-6 делает полосу шириной в половину, а placeholder-wave пускает волну.', 'A placeholder stands in for content: until the text arrives, a gray bar sits in its place. col-6 makes the bar half width, and placeholder-wave runs a wave over it.'),
      L3("Bu kinoteatrdagi band qilingan joyga o'xshaydi: odam hali kelmagan, lekin joyi tayyor.", 'Это как забронированное место в кино: человек ещё не пришёл, а место для него готово.', 'It’s like a reserved cinema seat: the person hasn’t arrived yet, but their seat is ready.')
    ],
    say: L3("Katta saytlarda sezganmisiz: sahifa yuklanayotganda matn o'rnida kulrang chiziqlar yuguradi? Bu ham Bootstrapda bor. Qarang.",
      'Замечал на больших сайтах: пока страница грузится, на месте текста бегут серые полосы? Это тоже есть в Bootstrap. Смотри.',
      'Have you noticed on big websites that gray bars run where the text will be while the page loads? Bootstrap has that too. Watch.'),
    sayPage: L3("Components bo'limida Placeholder sahifasi. Misolda ikkita kartochka: chapdagisi tayyor, o'ngdagisi hali yuklanmoqda, matn o'rnida kulrang chiziqlar.",
      'В разделе Components — страница Placeholder. В примере две карточки: левая готова, правая ещё загружается, на месте текста серые полосы.',
      'In Components there’s the Placeholder page. The example has two cards: the left one is ready, the right one is still loading, with gray bars instead of text.'),
    sayCode: L3("Kodda har bir chiziq bu span tegi, class ichida placeholder va col-6. col-6, ya'ni yarim kenglik degani. To'lqin uchun ota tegiga placeholder-wave qo'yiladi.",
      'В коде каждая полоса — это тег span, в class — placeholder и col-6. col-6 значит «половина ширины». Для волны родителю ставят placeholder-wave.',
      'In the code each bar is a span tag with placeholder and col-6 in class. col-6 means half width. For the wave, the parent gets placeholder-wave.'),
    sayOurs: L3("Saytimizda ham shunday qildim: sarlavha ostida, matn o'rnida ikkita kulrang chiziq yuguryapti.", 'Я сделал так и на нашем сайте: под заголовком, на месте текста, бегут две серые полосы.', 'I did the same on our site: under the heading, where the text goes, two gray bars are running.'),
    done: L3("Mana, matn keldi va chiziqlar o'rnini bo'shatdi. Eslab qoling: placeholder matn o'rnini band qilib turadi.", 'Вот, текст пришёл, и полосы уступили ему место. Запомни: placeholder держит место для текста.', 'There, the text arrived and the bars gave up their place. Remember: placeholder holds the text’s place.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Placeholder', 'Смотри: Components → Placeholder', 'Watch: Components → Placeholder'),
    askPage: L3('Qarang: yuklanayotgan kartochka', 'Смотри: загружающаяся карточка', 'Watch: the loading card'),
    askOurs: L3('Qarang: bizning saytda', 'Смотри: на нашем сайте', 'Watch: on our site'),
    askLoaded: L3('Qarang: matn keldi', 'Смотри: текст пришёл', 'Watch: the text arrived'),
    askDone: L3("placeholder — matn o'rnida", 'placeholder — на месте текста', 'placeholder holds the text’s place')
  },
  t4: {
    eyebrow: L3('Kulrang chiziq', 'Серая полоса', 'A gray bar'),
    say: L3("Endi kulrang chiziqni o'zingiz yasaysiz. Namunaga qarang va bo'sh joyga kerakli so'zni yozing. So'zlar saytdagi Animation qismida.",
      'Теперь серую полосу делаешь ты. Посмотри на образец и впиши в пустое место нужное слово. Слова — в части Animation на сайте.',
      'Now you make the gray bar. Look at the goal and type the right word into the empty spot. The words are in the Animation part on the site.'),
    ask1: L3("Namunadagidek kulrang chiziq chizing", 'Нарисуй серую полосу, как в образце', 'Draw a gray bar like in the goal'),
    ask2: L3("Chiziq ustida to'lqin yursin", 'По полосе пусть бежит волна', 'Make a wave run over the bar'),
    hints1: [
      L3("Chiziqning so'zi sahifa nomi bilan bir xil.", 'Слово полосы — как название страницы.', 'The bar’s word is the same as the page name.'),
      L3("Saytdagi span tegining class ichiga qarang.", 'Посмотри в class тега span на сайте.', 'Look inside the span tag’s class on the site.'),
      L3("Yozing: placeholder", 'Впиши: placeholder', 'Type: placeholder')
    ],
    hints2: [
      L3("To'lqin span tegiga emas, ota p tegiga yoziladi.", 'Волна пишется не у span, а у родителя — тега p.', 'The wave goes not on span but on the parent p tag.'),
      L3("To'lqin inglizcha wave bo'ladi.", 'Волна по-английски — wave.', 'A wave in English is wave.'),
      L3("Yozing: placeholder-wave", 'Впиши: placeholder-wave', 'Type: placeholder-wave')
    ],
    why1: L3("placeholder kulrang chiziq chizdi, col-6 esa uni yarim kenglikda qildi.", 'placeholder нарисовал серую полосу, а col-6 сделал её в половину ширины.', 'placeholder drew a gray bar, and col-6 made it half width.'),
    why2: L3("placeholder-wave chiziq ustida to'lqin yuritadi.", 'placeholder-wave пускает волну по полосе.', 'placeholder-wave runs a wave over the bar.'),
    done: L3("Zo'r! Endi saytingiz yuklanayotganda ham chiroyli ko'rinadi.", 'Огонь! Теперь твой сайт красивый даже во время загрузки.', 'Awesome! Now your site looks nice even while it’s loading.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna. Uni qaysi kod chizadi? Variantni bosing, o'ngda natijasi chiqadi.",
      'Маленькое испытание. Слева образец. Какой код его рисует? Нажми вариант, справа появится результат.',
      'A little test. The goal is on the left. Which code draws it? Tap an option and its result appears on the right.'),
    ask: L3('Namunani qaysi kod chizadi?', 'Какой код рисует образец?', 'Which code draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Doira shaklidagi rasm: rounded-circle.", 'Круглое фото: rounded-circle.', 'A round photo: rounded-circle.'),
      L3("Ekranga sig'gan rasm: img-fluid.", 'Фото по ширине экрана: img-fluid.', 'A photo that fits the screen: img-fluid.'),
      L3("Aylanuvchi halqa: spinner-border.", 'Крутящееся кольцо: spinner-border.', 'A spinning ring: spinner-border.'),
      L3("Kulrang chiziq: placeholder va kenglik col-6.", 'Серая полоса: placeholder и ширина col-6.', 'A gray bar: placeholder and the width col-6.')
    ],
    no: {
      'img-circle': L3("Bu eski nom, uchinchi versiyadan. Oltinchisida u ishlamaydi.", 'Это старое имя из третьей версии. В шестой оно не работает.', 'That’s an old name from version three. It doesn’t work in version six.'),
      'rounded': L3("rounded faqat burchaklarni yumshatadi, doira qilmaydi.", 'rounded только смягчает углы, круга не делает.', 'rounded only softens the corners, it doesn’t make a circle.'),
      // Было rounded-pill: на квадратном фото он рисует тот же круг — второй верный вариант (23.11.2026).
      'rounded-top': L3("rounded-top faqat tepadagi ikki burchakni yumshatadi, doira qilmaydi.", 'rounded-top скругляет только два верхних угла, круга не делает.', 'rounded-top rounds only the two top corners; it doesn’t make a circle.'),
      'img-responsive': L3("Bu eski nom, uchinchi versiyadan. Rasm sig'madi.", 'Это старое имя из третьей версии. Фото не поместилось.', 'That’s an old name from version three. The photo doesn’t fit.'),
      'img-thumbnail': L3("img-thumbnail ham sig'diradi, lekin ramka qo'shadi. Namunada ramka yo'q.", 'img-thumbnail тоже вписывает, но добавляет рамку. В образце рамки нет.', 'img-thumbnail fits too, but it adds a frame. The goal has no frame.'),
      'fluid': L3("Bunday so'z yo'q. To'liq so'z img bilan boshlanadi.", 'Такого слова нет. Полное слово начинается с img.', 'There’s no such word. The full word starts with img.'),
      'spinner-grow': L3("Bu kattalashadigan nuqta, halqa emas.", 'Это растущая точка, а не кольцо.', 'That’s a growing dot, not a ring.'),
      'spinner': L3("Bootstrapda spinner degan yolg'iz so'z yo'q. Halqa uchun spinner-border.", 'Отдельного слова spinner в Bootstrap нет. Для кольца — spinner-border.', 'Bootstrap has no plain spinner word. For a ring it’s spinner-border.'),
      'loading': L3("Bootstrap loading so'zini bilmaydi. Sahifa bo'sh qoldi.", 'Bootstrap не знает слова loading. Страница осталась пустой.', 'Bootstrap doesn’t know the word loading. The page stayed empty.'),
      'placeholder': L3("Kenglik yo'q, shuning uchun chiziq ko'rinmadi. col-6 kerak.", 'Нет ширины, поэтому полосы не видно. Нужен col-6.', 'There’s no width, so the bar isn’t visible. It needs col-6.'),
      'bg-secondary': L3("Bu faqat fon rangi. Bo'sh span tegida fon ko'rinmaydi.", 'Это только цвет фона. У пустого span фон не виден.', 'That’s only a background color. An empty span shows no background.'),
      'skeleton col-6': L3("Bootstrapda skeleton degan so'z yo'q. Chiziq placeholder deyiladi.", 'В Bootstrap нет слова skeleton. Полоса называется placeholder.', 'Bootstrap has no skeleton word. The bar is called placeholder.')
    },
    hint1: L3("Namunaga qarang: bu rasmmi, spinnermi yoki chiziqmi?", 'Посмотри на образец: это фото, спиннер или полоса?', 'Look at the goal: is it a photo, a spinner or a bar?'),
    hint2: L3("Eski nomlar va o'ylab topilgan so'zlar ishlamaydi. Saytdagi so'zlar esingizdami?", 'Старые имена и выдуманные слова не работают. Помнишь слова с сайта?', 'Old names and made-up words don’t work. Remember the words from the site?'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Rasmga qarab, kerakli kodni o'zingiz topasiz.", 'Всё верно! По картинке ты сам находишь нужный код.', 'All correct! You find the right code from a picture yourself.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta narsa ishlamayapti, har birida sabab boshqa. Kodga va sahifaga qarang, sababini tanlang.",
      'Последнее испытание. Три вещи не работают, и у каждой своя причина. Посмотри на код и страницу и выбери причину.',
      'The last test. Three things don’t work, and each has a different reason. Look at the code and the page and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    opts: {
      old: L3('Eski nom, oldingi versiyadan', 'Старое имя из прошлой версии', 'An old name from an earlier version'),
      noClass: L3("O'ylab topilgan so'z (hech qachon bo'lmagan)", 'Выдуманное слово — такого никогда не было', 'A made-up word: it never existed'),
      noWidth: L3('Kenglik berilmagan', 'Не задана ширина', 'No width is set')
    },
    rounds: [
      L3("img-responsive eski nom, uchinchi versiyadan. Oltinchisida img-fluid.", 'img-responsive — старое имя из третьей версии. В шестой — img-fluid.', 'img-responsive is an old name from version three. In version six it’s img-fluid.'),
      L3("Bootstrapda spinner degan yolg'iz class yo'q. Halqa uchun spinner-border kerak.", 'Отдельного class spinner в Bootstrap нет. Для кольца нужен spinner-border.', 'Bootstrap has no plain spinner class. A ring needs spinner-border.'),
      L3("Chiziqning kengligi yo'q, shuning uchun u ko'rinmaydi. col-6 kabi kenglik kerak.", 'У полосы нет ширины, поэтому её не видно. Нужна ширина, например col-6.', 'The bar has no width, so it isn’t visible. It needs a width like col-6.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the example on the site.'),
    hint2: L3("So'z eskimi, o'ylab topilganmi yoki biror narsa yetishmayaptimi?", 'Слово старое, выдуманное или чего-то не хватает?', 'Is the word old, made up, or is something missing?'),
    ok: L3("Hammasi to'g'ri! Endi nimadir ishlamasa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если что-то не работает, причину найдёшь сам.', 'All correct! Now if something doesn’t work, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z kartochkangiz", 'Своя карточка', 'Your own card'),
    say: L3("Endi murabbiy kartochkasini o'zingiz bezang. Rasm burchaklarini va spinner rangini tanlang. So'zlar saytda. Ikkalasi tayyor bo'lsa, «Tayyor»ni bosing.",
      'Теперь оформи карточку тренера сам. Выбери углы фото и цвет спиннера. Слова — на сайте. Когда оба готовы, нажми «Готово».',
      'Now decorate the coach’s card yourself. Pick the photo’s corners and the spinner’s color. The words are on the site. When both are ready, tap “Done”.'),
    ask: L3("Burchak va rang so'zini yozing", 'Впиши слово углов и цвета', 'Type the corner word and the color word'),
    hints: [
      L3("Kodda ikkita bo'sh joy bor: rasm burchagi va spinner rangi.", 'В коде два пустых места: углы фото и цвет спиннера.', 'The code has two empty spots: the photo’s corners and the spinner’s color.'),
      L3("Burchak so'zi rounded bilan, rang so'zi fg bilan boshlanadi.", 'Слово углов начинается с rounded, слово цвета — с fg.', 'The corner word starts with rounded, the color word with fg.'),
      L3("Masalan: rounded-circle va fg-success. Keyin «Tayyor»ni bosing.", 'Например: rounded-circle и fg-success. Потом нажми «Готово».', 'For example: rounded-circle and fg-success. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Kartochkangiz tayyor.", 'Класс! Твоя карточка готова.', 'Nice! Your card is ready.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men har bir telefon uchun rasmning alohida nusxasi kerak deb o'ylagandim? Afsuski, adashibman. Qarang: rasm bitta, img-fluid ham bitta, rasm esa telefonga ham, planshetga ham, noutbukka ham sig'yapti.",
        'Вернёмся к загадке. Помнишь, я думал, что для каждого телефона нужна своя копия фото? Увы, я ошибся. Смотри: фото одно, img-fluid тоже один, а фото помещается и на телефон, и на планшет, и на ноутбук.',
        'Back to our riddle. Remember, I thought every phone needed its own copy of the photo? Sadly, I was wrong. Look: one photo, one img-fluid, and the photo fits a phone, a tablet and a laptop.'), k: 'riddle' },
      { text: L3("Qarang, mana sizning kartochkangiz!", 'Смотри, вот твоя карточка!', 'Look, here’s your card!'), k: null },
      { text: L3("img-fluid rasmni ekranga sig'diradi, rounded so'zlari burchaklarni yumaloq qiladi.", 'img-fluid вписывает фото в экран, слова rounded скругляют углы.', 'img-fluid fits a photo to the screen, the rounded words round its corners.'), k: 'img' },
      { text: L3("Doira uchun rounded-circle, tabletka uchun rounded-pill.", 'Для круга — rounded-circle, для таблетки — rounded-pill.', 'For a circle, rounded-circle; for a pill, rounded-pill.'), k: 'round' },
      { text: L3("Kutish kerak bo'lsa, spinner va kulrang chiziqlar odamga aytadi: sayt ishlayapti.", 'Когда нужно подождать, спиннер и серые полосы говорят человеку: сайт работает.', 'When people need to wait, a spinner and gray bars tell them: the site is working.'), k: 'load' },
      { text: L3("Hammasini saytdan topdik: Content, Utilities va Components bo'limlaridan.", 'Всё нашли на сайте: в разделах Content, Utilities и Components.', 'We found everything on the site: in Content, Utilities and Components.'), k: 'site' },
      { text: L3("Tabriklayman! Siz uchinchi darsni tugatdingiz. Keyingi darsda Flex bilan bo'laklarni yonma-yon teramiz. Ko'rishguncha!", 'Ура! Ты прошёл третий урок. На следующем уроке расставим детали рядом с помощью Flex. До встречи!', 'Hooray! You finished the third lesson. Next time we’ll line pieces up side by side with Flex. See you!'), k: null }
    ],
    roles: {
      img: L3("img-fluid — ekranga sig'adi", 'img-fluid — помещается в экран', 'img-fluid — fits the screen'),
      round: L3('rounded — yumaloq burchak', 'rounded — круглые углы', 'rounded — round corners'),
      load: L3('spinner, placeholder — yuklanish', 'spinner, placeholder — загрузка', 'spinner, placeholder — loading'),
      site: L3("So'zlar — saytdan", 'Слова — с сайта', 'Words come from the site')
    },
    ask: L3('Kartochkangizga qarang', 'Посмотри на свою карточку', 'Look at your card')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, hintMenu: 1, why1pill: 1, msgs: 1, magic: 1,
  sayNo: 1, sayFluid: 1, sayBig: 1, cut: 1, bigOk: 1, fits: 1, on: 1, off: 1, sayPage: 1, sayApply: 1, copied: 1, sayRounded: 1, sayCircle: 1, sayPill: 1,
  saySpin: 1, sayLoaded: 1, sayRole: 1, sayPaste: 1, sayColor: 1, sayCode: 1, sayOurs: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs3-kit.jsx@*/

/*@FILE:bs3-site.jsx@*/

/*@FILE:bs3-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../mysh/mysh.css@*/
/*@FILE:../bs1/bs1.css@*/
/*@FILE:../bs2/bs2.css@*/
/*@FILE:bs3.css@*/
`;
