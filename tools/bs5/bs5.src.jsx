// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 5 — «Карточки»
// (облик «Редактор», как уроки 1–4 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs5/build.mjs → lessons/bootstrap/05-kartochki.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 5 · «Карточки» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Страница «Bizning robotlar»: фото, имя, описание и кнопка кучей. Ученик собирает карточку
// (section.card, img.card-img-top, div.card-body), копирует пример со страницы Components → Card и настраивает его
// (src, текст, цвет кнопки), красит карточку (theme-*, card-subtle) и ставит три карточки в ряд d-flex gap-* (урок 4).
// card-title и card-text в CSS 6.0.0-alpha.1 правил не имеют — это имена (опыт x1 показывает честно). Загадка (без имён):
// Коди думает, что каждому кусочку внутри нужен свой class, иначе карточка развалится; разгадка — держат card и card-body.
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-05-kartochki.md.
//   s1 крючок · s2 показ (части) · x1 опыт (переключатели) · g1 показ «как видео» (Card, Copy) · s5 показ (настройка) ·
//   t1 сам (найти и скопировать) · t2 настроить (src, кнопка) · s8 показ (цвет) · g2 показ «как видео» (Theme variants) ·
//   t3 цвет по образцу · s11 показ (в ряд) · t5 ряд (d-flex, gap) · t4 сборка по порядку · q1 class части ·
//   t6 почему не так · w1 своя карточка · s18 вывод с разгадкой.
//
// СИСТЕМА СЛОВ: card, card-body, card-img-top, card-title, card-text, theme-*, card-subtle — по-английски; kartochka —
// карточка; ramka — рамка; ichki joy — отступ внутри; rasm fayli — файл фото (src).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-05-kartochki',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '5-dars. Kartochkalar',
    ru: 'Урок 5. Карточки',
    en: 'Lesson 5. Cards'
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
  next: L3('Konteyner va setka', 'Контейнер и сетка', 'Container and grid'),
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
  inside: L3('Bootstrap ichida', 'Внутри Bootstrap', 'Inside Bootstrap'),
  files: L3('Fayllar', 'Файлы', 'Files'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  noTags: L3("Bu yerga faqat matn yozing, burchakli qavslar kerak emas.", 'Здесь нужен только текст, без угловых скобок.', 'Only text here, no angle brackets.')
};
const C = {
  site: {
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    h1: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    more: L3('Batafsil', 'Подробнее', 'More'),
    name1: L3('Yashil chaqqon', 'Зелёный шустрик', 'Green Speedy'),
    desc1: L3("Chiziq bo'ylab yuguradi.", 'Бегает по линии.', 'Runs along a line.'),
    name2: L3('Binafsha aqlli', 'Фиолетовый умник', 'Purple Brain'),
    desc2: L3("To'siqni aylanib o'tadi.", 'Объезжает препятствия.', 'Drives around obstacles.'),
    name3: L3("To'q sariq kuchli", 'Оранжевый силач', 'Orange Strongman'),
    desc3: L3("Yuk ko'taradi.", 'Поднимает грузы.', 'Lifts loads.')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga yozing.", 'Впиши в пустое место.', 'Type into the empty spot.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak.", 'Здесь нужны латинские буквы.', 'Latin letters are needed here.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      cssProp: L3("Bu CSS yozuvi. Bu yerga Bootstrap so'zi kerak: {w}.", 'Это запись CSS. Здесь нужно слово Bootstrap: {w}.', 'That’s CSS. This spot needs a Bootstrap word: {w}.'),
      dots: L3("Bu saytdagi uchta nuqta, ya'ni to'ldirgich degani. Uning o'rniga rasm faylining nomini yozing.", 'Это три точки с сайта, то есть заглушка. Вместо них впиши имя файла с фото.', 'Those are the site’s three dots, a placeholder. Type the photo file name instead.'),
      otherFile: L3("Bu fayl bor, lekin rasm namunadagidek emas. Fayllar ro'yxatiga qarang.", 'Такой файл есть, но фото не как в образце. Посмотри на список файлов.', 'That file exists, but the photo doesn’t match the goal. Check the file list.'),
      noExt: L3("Oz qoldi! Fayl nomi oxiri bilan yoziladi: {w}.", 'Почти! Имя файла пишется с окончанием: {w}.', 'Close! A file name needs its ending: {w}.'),
      noFile: L3("Bunday fayl yo'q: \u2063{w}\u2064. Shuning uchun rasm chiqmadi. Fayllar ro'yxatidan oling.", 'Такого файла нет: \u2063{w}\u2064. Поэтому фото не появилось. Возьми имя из списка файлов.', 'There’s no such file: \u2063{w}\u2064. So no photo appeared. Take a name from the file list.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas. Sahifani namuna bilan solishtiring.", 'Bootstrap это слово знает, но результат не как в образце. Сравни страницу с образцом.', 'Bootstrap knows that word, but the result isn’t like the goal. Compare the page with the goal.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      native: L3("Bootstrap o'z so'zlarini biladi, oddiy so'zni emas. Rang so'zini saytdan oling.", 'Bootstrap знает свои слова, а не обычные. Возьми слово цвета с сайта.', 'Bootstrap knows its own words, not everyday ones. Take the color word from the site.'),
      unknown: L3("Bootstrap bunday so'zni bilmaydi: \u2063{w}\u2064. Shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает такого слова: \u2063{w}\u2064. Поэтому ничего не изменилось.', 'Bootstrap doesn’t know this word: \u2063{w}\u2064. So nothing changed.'),
      old: L3("Bu boshqa narsa uchun yoki eski nom. Rang so'zi theme bilan boshlanadi.", 'Это для другого или старое имя. Слово цвета начинается с theme.', 'That’s for something else or an old name. The color word starts with theme.'),
      cardTheme: L3("Bunday class yo'q. Kartochka rangi ham theme bilan: {w}.", 'Такого class нет. Цвет карточки тоже начинается с theme: {w}.', 'There’s no such class. A card’s color starts with theme too: {w}.'),
      bgTheme: L3("Bu so'z faqat fon yoki matnni bo'yaydi: \u2063{w}\u2064. Kartochka va tugma rangi theme bilan.", 'Это слово красит только фон или текст: \u2063{w}\u2064. Цвет карточки и кнопки — через theme.', 'This word only colors the background or text: \u2063{w}\u2064. Cards and buttons take theme.'),
      needFlex: L3("Siz yozgan so'z \u2063({w})\u2064 ishlashi uchun oldin bloklar qatorga tizilishi kerak. Qaysi so'z qatorga tizadi?", 'Чтобы слово \u2063«{w}»\u2064 заработало, блоки сначала надо выстроить в ряд. Какое слово строит ряд?', 'For the word \u2063“{w}”\u2064 to work, the blocks must be in a row first. Which word makes a row?'),
      grid: L3("row va col bu setka, keyingi dars mavzusi. Bugun qatorni flex bilan qilamiz.", 'row и col — это сетка, тема следующего урока. Сегодня ряд делаем через flex.', 'row and col are the grid, next lesson’s topic. Today we make the row with flex.'),
      noSize: L3("Bunday o'lcham yo'q: \u2063{w}\u2064. gap dan keyingi raqam jadvaldagi tartib raqami.", 'Такого размера нет: \u2063{w}\u2064. Число после gap — номер в таблице.', 'There’s no such size: \u2063{w}\u2064. The number after gap is the row number in the table.'),
      isFlex: L3("d-flex allaqachon yozilgan. Bu joyga oraliq so'zi kerak.", 'd-flex уже написан. Сюда нужно слово расстояния.', 'd-flex is already there. This spot needs a spacing word.')
    }
  },
  s1: {
    eyebrow: L3('Uyum', 'Куча', 'A pile'),
    say: L3("Salom! Saytga robotlarimiz haqida sahifa qilyapman. Mana birinchisi: rasm, nomi, qisqa matn va tugma. Lekin hammasi uyulib yotibdi, chiroyli emas. Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! Делаю на сайте страницу про наших роботов. Вот первый: фото, имя, короткий текст и кнопка. Но всё свалено в кучу, некрасиво. Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! I’m making a page about our robots on the site. Here’s the first one: a photo, a name, a short text and a button. But it’s all piled up, not pretty. Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Hammasi chiroyli kartochkaga aylandi: ramka, yumaloq burchaklar, rasm tepada, matn ichida joy bilan.",
      'Ого! Всё превратилось в красивую карточку: рамка, скруглённые углы, фото сверху, текст с отступами внутри.',
      'Whoa! It all turned into a nice card: a border, rounded corners, the photo on top, the text with space inside.'),
    done: L3("Bugun kartochkalar yasaymiz: saytdan olamiz, o'zimizga moslaymiz, bo'yaymiz va qatorga teramiz. Lekin oldin topishmoq. Menimcha, kartochka buzilmasligi uchun ichidagi har bir bo'lakka alohida class kerak: rasmga, sarlavhaga, matnga, tugmaga. Siz nima deb o'ylaysiz, men haqmanmi? Javobni dars oxirida topamiz.",
      'Сегодня делаем карточки: берём с сайта, настраиваем, красим и ставим в ряд. Но сначала загадка. По-моему, чтобы карточка не развалилась, каждому кусочку внутри нужен свой class: фото, заголовку, тексту, кнопке. Как думаешь, я прав? Ответ найдём в конце урока.',
      'Today we make cards: take them from the site, adjust them, color them and line them up. But first, a riddle. I think that for a card not to fall apart, every piece inside needs its own class: the photo, the title, the text, the button. What do you think, am I right? We’ll find the answer at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('Kartochka tayyor', 'Карточка готова', 'The card is ready')
  },
  s2: {
    eyebrow: L3('Kartochka nimadan iborat', 'Из чего карточка', 'What a card is made of'),
    help: [
      L3("Koddagi uchta class ga va pastdagi «Bootstrap ichida» kartochkasiga qarang.", 'Посмотри на три class в коде и на карточку «Внутри Bootstrap».', 'Look at the three classes in the code and the “Inside Bootstrap” card.'),
      L3("card ramka beradi, card-img-top rasmni tepaga to'liq kenglikda qo'yadi, card-body ichki joy beradi va bolalarini ustun qilib teradi.", 'card даёт рамку, card-img-top ставит фото сверху во всю ширину, card-body даёт отступы и выстраивает детей колонкой.', 'card gives the border, card-img-top puts the photo on top at full width, card-body adds inner space and stacks its children in a column.'),
      L3("Bu ramkadagi suratga o'xshaydi: ramka, surat va tagidagi yozuv.", 'Это как фото в рамке: рамка, снимок и подпись под ним.', 'It’s like a framed photo: the frame, the picture and the caption under it.')
    ],
    say: L3("Keling, kartochkani bo'laklab ko'ramiz. Hozir class yo'q, hammasi uyulgan. Qarang.", 'Давай разберём карточку по частям. Сейчас class нет, всё кучей. Смотри.', 'Let’s take the card apart. Right now there’s no class, it’s all piled up. Watch.'),
    sayCard: L3("card: tashqi qutiga ramka va yumaloq burchak berdi. Lekin ichidagilar hali chetga yopishib turibdi.", 'card: внешняя коробка получила рамку и скруглённые углы. Но внутри всё ещё прилипло к краю.', 'card: the outer box got a border and rounded corners. But the inside still sticks to the edge.'),
    sayImg: L3("card-img-top: rasm kartochka tepasiga butun kenglikda joylashdi, tepa burchaklari ham yumaloq.", 'card-img-top: фото встало наверх карточки во всю ширину, верхние углы тоже скруглены.', 'card-img-top: the photo sits at the top across the full width, with rounded top corners too.'),
    sayBody: L3("card-body: matn atrofida joy paydo bo'ldi, nom, matn va tugma ustun bo'lib, teng oraliq bilan turdi. Pastdagi kartochkaga qarang: ichida flex va gap, xuddi o'tgan darsdagidek!",
      'card-body: вокруг текста появилось место, имя, текст и кнопка встали колонкой с одинаковым промежутком. Посмотри на карточку внизу: внутри flex и gap, как на прошлом уроке!',
      'card-body: space appeared around the text, and the name, text and button stacked in a column with equal gaps. Look at the card below: inside there’s flex and gap, just like last lesson!'),
    done: L3("Eslab qoling: card — ramka, card-img-top — tepadagi rasm, card-body — ichki joy.", 'Запомни: card — рамка, card-img-top — фото сверху, card-body — место внутри.', 'Remember: card is the frame, card-img-top is the top photo, card-body is the inner space.'),
    askStart: L3('Qarang: hammasi uyulgan', 'Смотри: всё кучей', 'Watch: everything piled up'),
    askCard: L3('Qarang: card', 'Смотри: card', 'Watch: card'),
    askImg: L3('Qarang: card-img-top', 'Смотри: card-img-top', 'Watch: card-img-top'),
    askBody: L3('Qarang: card-body', 'Смотри: card-body', 'Watch: card-body'),
    askDone: L3('card · card-img-top · card-body', 'card · card-img-top · card-body', 'card · card-img-top · card-body')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz tekshiring. Pastda to'rtta tugma bor. Har birini o'chirib-yoqib ko'ring va kartochka nima bo'lishini kuzating.",
      'Теперь проверь сам. Внизу четыре переключателя. Выключай и включай каждый и смотри, что станет с карточкой.',
      'Now check it yourself. Below are four switches. Turn each one off and on and watch what happens to the card.'),
    what: {
      card: L3("card o'chdi: ramka va burchaklar yo'qoldi.", 'card выключен: пропали рамка и углы.', 'card is off: the border and corners are gone.'),
      'card-img-top': L3("card-img-top o'chdi: rasm o'z o'lchamiga qaytdi, tepa burchaklari to'g'ri.", 'card-img-top выключен: фото вернулось к своему размеру, верхние углы прямые.', 'card-img-top is off: the photo went back to its own size, with square top corners.'),
      'card-body': L3("card-body o'chdi: matn ramkaga yopishib qoldi, oraliqlar yo'qoldi.", 'card-body выключен: текст прилип к рамке, промежутки пропали.', 'card-body is off: the text sticks to the border, the gaps are gone.'),
      'card-title': L3("Qiziq! card-title va card-text o'chdi, lekin hech narsa o'zgarmadi. Bootstrap oltinchi versiyasida bu ikkisi shunchaki nom, ko'rinishni card-body beradi.",
        'Интересно! card-title и card-text выключены, а ничего не изменилось. В шестой версии Bootstrap эти двое — просто имена, вид даёт card-body.',
        'Interesting! card-title and card-text are off, but nothing changed. In Bootstrap version six these two are just names; card-body gives the look.')
    },
    back: L3("Qaytib yoqildi.", 'Снова включено.', 'Back on.'),
    ok: L3("Ajoyib! Kartochkani ikkita class ushlab turadi: card va card-body.", 'Отлично! Карточку держат два class: card и card-body.', 'Great! Two classes hold the card together: card and card-body.'),
    done: L3("Endi kartochkani Bootstrap saytidan qanday olishni ko'ramiz.", 'Теперь посмотрим, как взять карточку с сайта Bootstrap.', 'Now let’s see how to take a card from the Bootstrap site.'),
    hints: [
      L3("Pastdagi tugmalarni bosing.", 'Нажимай переключатели внизу.', 'Tap the switches below.'),
      L3("To'rttala tugmani ham bir marta bosing.", 'Нажми все четыре переключателя хотя бы раз.', 'Tap all four switches at least once.'),
      L3("Oxirgisi card-title: uni bosib, nima bo'lishini kuzating.", 'Последний — card-title: нажми и посмотри, что будет.', 'The last one is card-title: tap it and see what happens.')
    ],
    ask: L3("To'rttala tugmani sinang", 'Попробуй все четыре переключателя', 'Try all four switches'),
    askDone: L3("Asosiysi: card va card-body", 'Главное: card и card-body', 'The key ones: card and card-body')
  },
  g1: {
    eyebrow: L3('Card sahifasi', 'Страница Card', 'The Card page'),
    help: [
      L3("Menyudagi Card bandiga, misolga va nusxa olish belgisiga qarang.", 'Посмотри на пункт Card в меню, на пример и на значок копирования.', 'Look at Card in the menu, the example and the copy icon.'),
      L3("Kartochka kodi uzun, shuning uchun uni nusxa olish belgisi bilan butunlay olamiz. Rasm o'rnida esa uchta nuqta turadi.", 'Код карточки длинный, поэтому берём его целиком значком копирования. А вместо фото там три точки.', 'The card code is long, so we take it whole with the copy icon. Where the photo should be, there are three dots.'),
      L3("Bu tayyor tabriknomaga o'xshaydi: ichida «ismingizni yozing» degan bo'sh joy bor.", 'Это как готовая открытка: внутри пустое место «впиши своё имя».', 'It’s like a ready-made card: inside there’s a blank “write your name here”.')
    ],
    say: L3("Kartochkani o'zimiz yozmaymiz, saytdan olamiz. Qarang.", 'Карточку сами не пишем, берём с сайта. Смотри.', 'We don’t write the card ourselves, we take it from the site. Watch.'),
    sayPage: L3("Components bo'limida Card sahifasi. Birinchi misol tayyor kartochka: rasm, sarlavha, matn va tugma. Tagida uning kodi.",
      'В разделе Components — страница Card. Первый пример — готовая карточка: фото, заголовок, текст и кнопка. Под ней её код.',
      'In Components there’s the Card page. The first example is a ready card: a photo, a title, text and a button. Its code is underneath.'),
    sayPaste: L3("Nusxa olish belgisini bosdim va kodni body ichiga qo'ydim. Kartochka chiqdi! Lekin rasm o'rnida buzilgan belgi. Nega? Kodga qarang: src ichida uchta nuqta. Bu saytdagi to'ldirgich, rasm fayli emas.",
      'Нажал значок копирования и вставил код в body. Карточка появилась! Но вместо фото сломанный значок. Почему? Посмотри в код: в src три точки. Это заглушка с сайта, а не файл фото.',
      'I tapped the copy icon and pasted the code into body. The card appeared! But instead of a photo there’s a broken icon. Why? Look at the code: src has three dots. That’s the site’s placeholder, not a photo file.'),
    done: L3("Eslab qoling: saytdan olingan kodni o'zimizga moslaymiz. Birinchi navbatda src atributiga o'z rasmimizni yozamiz.", 'Запомни: код с сайта подгоняем под себя. Первым делом пишем в src своё фото.', 'Remember: we adapt code from the site. First of all, we put our own photo in src.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Card', 'Смотри: Components → Card', 'Watch: Components → Card'),
    askPage: L3('Qarang: misol va kod', 'Смотри: пример и код', 'Watch: the example and code'),
    askPaste: L3("Qarang: rasm buzilgan", 'Смотри: фото сломано', 'Watch: the photo is broken'),
    askDone: L3('Components → Card → nusxa', 'Components → Card → копия', 'Components → Card → copy')
  },
  s5: {
    eyebrow: L3("O'zimizga moslaymiz", 'Подгоняем под себя', 'Making it ours'),
    help: [
      L3("src qatoriga, Fayllar ro'yxatiga va sahifadagi rasmga qarang.", 'Посмотри на строку src, на список файлов и на фото на странице.', 'Look at the src line, the file list and the photo on the page.'),
      L3("src atributiga rasm faylining nomi yoziladi. Sarlavha va matn o'zimizniki, tugma rangi theme so'zi bilan.", 'В src пишут имя файла фото. Заголовок и текст свои, цвет кнопки — словом theme.', 'src takes the photo file name. The title and text are ours, and the button color is a theme word.'),
      L3("Bu tayyor libosni tikuvchiga moslatishga o'xshaydi: libos tayyor, faqat o'lchamni to'g'rilaysiz.", 'Это как подогнать готовую одежду у портного: вещь готова, только подправляешь по себе.', 'It’s like having ready clothes altered: the garment is done, you just adjust it to fit.')
    ],
    say: L3("Nusxalangan kartochkani o'zimizning robotga moslaymiz. Qarang.", 'Подгоним скопированную карточку под нашего робота. Смотри.', 'Let’s adapt the copied card to our robot. Watch.'),
    saySrc: L3("src ichidagi uchta nuqtani robot1.jpg ga almashtirdim. Bu fayl saytimiz yonida turibdi, Fayllar ro'yxatiga qarang. Rasm chiqdi!", 'Заменил три точки в src на robot1.jpg. Этот файл лежит рядом с нашим сайтом, посмотри на список файлов. Фото появилось!', 'I replaced the three dots in src with robot1.jpg. That file sits next to our site, see the file list. The photo appeared!'),
    sayText: L3("Card title o'rniga robot nomini, inglizcha matn o'rniga uning ta'rifini yozdim.", 'Вместо Card title написал имя робота, вместо английского текста — его описание.', 'Instead of Card title I wrote the robot’s name, and instead of the English text, its description.'),
    sayBtn: L3("Tugmani yashil qildim: theme-primary o'rniga theme-success. Bu ikkinchi darsdan tanish!", 'Кнопку сделал зелёной: вместо theme-primary — theme-success. Это знакомо со второго урока!', 'I made the button green: theme-success instead of theme-primary. You know this from lesson two!'),
    done: L3("Eslab qoling: src, matn va rang — saytdan olingan kartochkada shularni o'zgartiramiz.", 'Запомни: src, текст и цвет — вот что меняем в карточке с сайта.', 'Remember: src, text and color are what we change in a card from the site.'),
    askStart: L3("Qarang: src ichida uchta nuqta", 'Смотри: в src три точки', 'Watch: three dots in src'),
    askSrc: L3('Qarang: robot1.jpg', 'Смотри: robot1.jpg', 'Watch: robot1.jpg'),
    askText: L3("Qarang: o'z matnimiz", 'Смотри: свой текст', 'Watch: our own text'),
    askBtn: L3('Qarang: theme-success', 'Смотри: theme-success', 'Watch: theme-success'),
    askDone: L3("src, matn, rang — o'zimizniki", 'src, текст, цвет — свои', 'src, text, color — ours')
  },
  t1: {
    eyebrow: L3('Kartochkani oling', 'Возьми карточку', 'Take a card'),
    say: L3("Endi o'zingiz. Saytdan Card sahifasini toping, misol kodini nusxalang va body ichiga qo'ying.", 'Теперь сам. Найди на сайте страницу Card, скопируй код примера и вставь в body.', 'Now you. Find the Card page on the site, copy the example code and paste it into body.'),
    ask: L3("Misolni nusxalab, body ichiga qo'ying", 'Скопируй пример и вставь в body', 'Copy the example and paste it into body'),
    askFind: L3("☰ tugmasini bosing va Components → Card sahifasini toping", 'Нажми ☰ и найди Components → Card', 'Tap ☰ and find Components → Card'),
    copied: L3("Nusxalandi! Endi body ichidagi bo'sh joyni bosing.", 'Скопировано! Теперь нажми пустое место в body.', 'Copied! Now tap the empty spot in body.'),
    msgs: {
      wrongPage: L3("Bu {w} sahifasi. Kartochkalar Components bo'limida, Card sahifasida.", 'Это страница {w}. Карточки — в разделе Components, на странице Card.', 'This is the {w} page. Cards are in Components, on the Card page.'),
      wrongBlock: L3("Bu boshqa misol. Bizga birinchi, to'liq kartochka kerak.", 'Это другой пример. Нам нужен первый, полная карточка.', 'That’s another example. We need the first one, the full card.'),
      noClip: L3("Oldin saytdagi misolning nusxa olish belgisini bosing.", 'Сначала нажми значок копирования у примера на сайте.', 'First tap the copy icon of the example on the site.')
    },
    hints: [
      L3("Kartochka tayyor bo'lak. Tayyor bo'laklar qaysi bo'limda?", 'Карточка — готовая деталь. В каком разделе готовые детали?', 'A card is a ready-made piece. Which section has those?'),
      L3("Components, keyin Card. Birinchi misolning kodi.", 'Components, потом Card. Код первого примера.', 'Components, then Card. The first example’s code.'),
      L3("Kod burchagidagi nusxa olish belgisini, keyin body ichidagi bo'sh joyni bosing.", 'Нажми значок копирования в углу кода, потом пустое место в body.', 'Tap the copy icon in the code’s corner, then the empty spot in body.')
    ],
    ok: L3("Zo'r! Kartochka sahifada. Rasm hali buzilgan, uni keyingi qadamda tuzatamiz.", 'Огонь! Карточка на странице. Фото пока сломано, починим на следующем шаге.', 'Awesome! The card is on the page. The photo is still broken; we’ll fix it next.')
  },
  t2: {
    eyebrow: L3('Moslang', 'Подгони', 'Adjust it'),
    say: L3("Kartochkani ikkinchi robotga moslaymiz. Namunaga qarang va bo'sh joyni to'ldiring.", 'Подгоним карточку под второго робота. Посмотри на образец и заполни пустое место.', 'Let’s adapt the card to the second robot. Look at the goal and fill the empty spot.'),
    ask1: L3("Namunadagi rasm faylini yozing", 'Впиши файл фото из образца', 'Type the photo file from the goal'),
    ask2: L3("Tugma yashil bo'lsin", 'Кнопка — зелёная', 'Make the button green'),
    hints1: [
      L3("src atributiga fayl nomi yoziladi. Fayllar ro'yxatiga qarang.", 'В src пишется имя файла. Посмотри на список файлов.', 'src takes a file name. Look at the file list.'),
      L3("Namunada binafsha robot. Ro'yxatda u ikkinchi.", 'В образце фиолетовый робот. В списке он второй.', 'The goal shows the purple robot. It’s second in the list.'),
      L3("Yozing: robot2.jpg", 'Впиши: robot2.jpg', 'Type: robot2.jpg')
    ],
    hints2: [
      L3("Tugma rangi theme so'zi bilan.", 'Цвет кнопки — словом theme.', 'A button’s color is a theme word.'),
      L3("Yashil — muvaffaqiyat rangi, success.", 'Зелёный — цвет успеха, success.', 'Green is the success color.'),
      L3("Yozing: theme-success", 'Впиши: theme-success', 'Type: theme-success')
    ],
    why1: L3("robot2.jpg — binafsha robot rasmi.", 'robot2.jpg — фото фиолетового робота.', 'robot2.jpg is the purple robot photo.'),
    why2: L3("theme-success tugmani yashil qildi.", 'theme-success сделал кнопку зелёной.', 'theme-success made the button green.'),
    done: L3("Qoyil! Saytdan olingan kartochka endi sizniki.", 'Класс! Карточка с сайта теперь твоя.', 'Nice! The card from the site is now yours.')
  },
  s8: {
    eyebrow: L3('Kartochka rangi', 'Цвет карточки', 'Card color'),
    help: [
      L3("section tegining class qismiga va kartochka rangiga qarang.", 'Посмотри на class тега section и на цвет карточки.', 'Look at the section tag’s class and the card’s color.'),
      L3("theme so'zi kartochka ramkasini va rasm ostidagi chiziqni bo'yaydi, foni esa oq qoladi. card-subtle bilan ramka och, yumshoq rangda.", 'Слово theme красит рамку карточки и линию под фото, а фон остаётся белым. С card-subtle рамка светлая, мягкого цвета.', 'A theme word colors the card’s frame and the line under the photo; the background stays white. With card-subtle the frame is a light, soft color.'),
      L3("Bu rasm ramkasiga o'xshaydi: rasm o'sha, ramka esa yorqin yoki och rangli.", 'Это как рамка для фото: фото то же, а рамка яркая или пастельная.', 'It’s like a photo frame: the photo stays the same, the frame is bright or pastel.')
    ],
    say: L3("Kartochkani ham bo'yash mumkin. So'zlar tanish. Qarang.", 'Карточку тоже можно покрасить. Слова знакомые. Смотри.', 'Cards can be colored too. The words are familiar. Watch.'),
    sayTheme: L3("theme-primary qo'shdim: kartochka ramkasi ko'k bo'ldi, rasm ostidagi chiziq ham. Foni esa oq qoldi. Tugmadagi so'z bilan bir xil!", 'Добавил theme-primary: рамка карточки стала синей, и линия под фото тоже. А фон остался белым. То же слово, что у кнопки!', 'I added theme-primary: the card’s frame turned blue, and so did the line under the photo. The background stayed white. The same word as for buttons!'),
    saySubtle: L3("card-subtle va theme-success: ramka och yashil, yumshoq. Ko'zga yoqimli.", 'card-subtle и theme-success: рамка светло-зелёная, мягкая. Приятно глазу.', 'card-subtle and theme-success: a soft light green frame. Easy on the eyes.'),
    done: L3("Eslab qoling: kartochka ramkasining rangi theme so'zi bilan, yumshoq rang uchun yana card-subtle.", 'Запомни: цвет рамки карточки — словом theme, для мягкого цвета ещё card-subtle.', 'Remember: a card’s frame color is a theme word; for a soft color add card-subtle.'),
    askStart: L3('Qarang: oddiy kartochka', 'Смотри: обычная карточка', 'Watch: a plain card'),
    askTheme: L3('Qarang: theme-primary', 'Смотри: theme-primary', 'Watch: theme-primary'),
    askSubtle: L3('Qarang: card-subtle', 'Смотри: card-subtle', 'Watch: card-subtle'),
    askDone: L3("Ramka rangi — theme, yumshoq — card-subtle", 'Цвет рамки — theme, мягкий — card-subtle', 'Frame color: theme; soft: card-subtle')
  },
  g2: {
    eyebrow: L3('Theme variants', 'Theme variants', 'Theme variants'),
    help: [
      L3("Card sahifasidagi Theme variants qismiga va belgilangan so'zga qarang.", 'Посмотри на часть Theme variants на странице Card и на выделенное слово.', 'Look at the Theme variants part of the Card page and the selected word.'),
      L3("Har bir rangli kartochkaning kodida bitta theme so'zi.", 'В коде каждой цветной карточки — одно слово theme.', 'Each colored card’s code has one theme word.'),
      L3("Bu rangli qalamlar qutisiga o'xshaydi: kerakli qalamni olasiz.", 'Это как коробка цветных карандашей: берёшь нужный.', 'It’s like a box of colored pencils: you take the one you need.')
    ],
    say: L3("Kartochka ranglari saytda ham bor. Qarang.", 'Цвета карточек есть и на сайте. Смотри.', 'Card colors are on the site too. Watch.'),
    sayPage: L3("Card sahifasining Theme variants qismi: sakkizta rangli kartochka va ularning kodi.", 'Часть Theme variants на странице Card: восемь цветных карточек и их код.', 'The Theme variants part of the Card page: eight colored cards and their code.'),
    sayApply: L3("theme-success so'zini belgiladim va card dan keyin qo'ydim. Kartochka ramkasi yashil bo'ldi!", 'Выделил theme-success и поставил после card. Рамка карточки стала зелёной!', 'I selected theme-success and put it after card. The card’s frame turned green!'),
    done: L3("Rang so'zlari hamma joyda bir xil: tugmada ham, e'londa ham, kartochkada ham.", 'Слова цвета везде одинаковые: у кнопки, у объявления, у карточки.', 'Color words are the same everywhere: buttons, notices, cards.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Card', 'Смотри: Components → Card', 'Watch: Components → Card'),
    askPage: L3('Qarang: Theme variants', 'Смотри: Theme variants', 'Watch: Theme variants'),
    askWord: L3("Qarang: so'z belgilandi", 'Смотри: слово выделено', 'Watch: the word is selected'),
    askApply: L3("Qarang: ramka yashil", 'Смотри: рамка зелёная', 'Watch: the frame is green'),
    askDone: L3('Card → Theme variants', 'Card → Theme variants', 'Card → Theme variants')
  },
  t3: {
    eyebrow: L3("Ramkani bo'yang", 'Покрась рамку', 'Color the frame'),
    say: L3("Uchinchi robot kartochkasining ramkasini bo'yaymiz. Namunaga qarang va rang so'zini yozing.", 'Покрасим рамку карточки третьего робота. Посмотри на образец и впиши слово цвета.', 'Let’s color the third robot’s card frame. Look at the goal and type the color word.'),
    ask1: L3("Ramka qizil bo'lsin", 'Рамка — красная', 'Make the frame red'),
    ask2: L3("Ramka yumshoq sariq bo'lsin", 'Рамка — мягкая жёлтая', 'Make the frame soft yellow'),
    hints1: [
      L3("Rang so'zi theme bilan boshlanadi.", 'Слово цвета начинается с theme.', 'The color word starts with theme.'),
      L3("Qizil — xavf rangi.", 'Красный — цвет опасности.', 'Red is the danger color.'),
      L3("Yozing: theme-danger", 'Впиши: theme-danger', 'Type: theme-danger')
    ],
    hints2: [
      L3("card-subtle allaqachon yozilgan, rangni qo'shing.", 'card-subtle уже написан, добавь цвет.', 'card-subtle is already there; add the color.'),
      L3("Sariq — ogohlantirish rangi.", 'Жёлтый — цвет предупреждения.', 'Yellow is the warning color.'),
      L3("Yozing: theme-warning", 'Впиши: theme-warning', 'Type: theme-warning')
    ],
    why1: L3("theme-danger kartochka ramkasini qizil qildi.", 'theme-danger сделал рамку карточки красной.', 'theme-danger made the card’s frame red.'),
    why2: L3("card-subtle va theme-warning: ramka yumshoq sariq.", 'card-subtle и theme-warning: рамка мягкая жёлтая.', 'card-subtle and theme-warning: a soft yellow frame.'),
    done: L3("Ajoyib! Kartochka ramkasini istalgan rangga bo'yay olasiz.", 'Отлично! Рамку карточки покрасишь в любой цвет.', 'Great! You can color a card’s frame any color.')
  },
  s11: {
    eyebrow: L3('Qatorda', 'В ряд', 'In a row'),
    help: [
      L3("Uchta kartochkani o'rab turgan div tegining class qismiga qarang.", 'Посмотри на class тега div, который обнимает три карточки.', 'Look at the class of the div wrapping the three cards.'),
      L3("Kartochkalarni qatorga d-flex teradi, oraliqni gap beradi: o'tgan dars!", 'Карточки в ряд ставит d-flex, расстояние даёт gap: прошлый урок!', 'd-flex lines the cards up, gap adds space: last lesson!'),
      L3("Bu do'kon peshtaxtasiga o'xshaydi: mollar bir qatorda, o'rtasida joy bilan.", 'Это как витрина магазина: товары в ряд, с промежутками.', 'It’s like a shop window: items in a row, with space between.')
    ],
    say: L3("Uchala robot kartochkasi tayyor, lekin ular bir-birining ostida. Ularni qatorga teramiz. Qarang.", 'Карточки всех трёх роботов готовы, но они друг под другом. Поставим их в ряд. Смотри.', 'All three robot cards are ready, but they’re stacked. Let’s line them up. Watch.'),
    sayFlex: L3("O'rab turgan div tegiga d-flex qo'shdim: kartochkalar qatorga tizildi. Lekin bir-biriga yopishib qoldi.", 'Добавил обёртке div d-flex: карточки встали в ряд. Но слиплись.', 'I gave the wrapping div d-flex: the cards lined up. But they’re stuck together.'),
    sayGap: L3("gap-5 qo'shdim: o'rtasida 16 piksel joy. Mana, chiroyli qator! Hammasi o'tgan darsdan tanish.", 'Добавил gap-5: между ними 16 пикселей. Вот красивый ряд! Всё знакомо с прошлого урока.', 'I added gap-5: 16 pixels between them. There’s a nice row! All familiar from last lesson.'),
    done: L3("Eslab qoling: kartochkalarni qatorga d-flex va gap teradi.", 'Запомни: карточки в ряд ставят d-flex и gap.', 'Remember: d-flex and gap line the cards up.'),
    askStart: L3("Qarang: bir-birining ostida", 'Смотри: друг под другом', 'Watch: stacked'),
    askFlex: L3('Qarang: d-flex', 'Смотри: d-flex', 'Watch: d-flex'),
    askGap: L3('Qarang: gap-5', 'Смотри: gap-5', 'Watch: gap-5'),
    askDone: L3('d-flex gap — kartochkalar qatori', 'd-flex gap — ряд карточек', 'd-flex gap: a row of cards')
  },
  t5: {
    eyebrow: L3("Qatorga tering", 'Поставь в ряд', 'Line them up'),
    say: L3("Endi kartochkalarni o'zingiz qatorga terasiz. Namunaga qarang va bo'sh joyga so'z yozing.", 'Теперь ставишь карточки в ряд сам. Посмотри на образец и впиши слово.', 'Now you line up the cards. Look at the goal and type the word.'),
    ask1: L3("Kartochkalar ostma-ost emas, bir qatorda tursin", 'Карточки — в один ряд, а не столбиком', 'Cards in one row, not stacked'),
    ask2: L3("Oraliq 24 piksel bo'lsin", 'Расстояние — 24 пикселя', 'Make the spacing 24 pixels'),
    hints1: [
      L3("Qatorga teradigan so'z o'tgan darsda edi.", 'Слово, которое строит ряд, было на прошлом уроке.', 'The word that makes a row was in last lesson.'),
      L3("U d harfi bilan boshlanadi.", 'Оно начинается с буквы d.', 'It starts with the letter d.'),
      L3("Yozing: d-flex", 'Впиши: d-flex', 'Type: d-flex')
    ],
    hints2: [
      L3("Jadvalda 24 piksel qatorini toping.", 'Найди в таблице строку 24 пикселя.', 'Find the 24 pixel row in the table.'),
      L3("24 piksel bu 1.5rem.", '24 пикселя — это 1.5rem.', '24 pixels is 1.5rem.'),
      L3("Yozing: gap-7", 'Впиши: gap-7', 'Type: gap-7')
    ],
    why1: L3("d-flex kartochkalarni qatorga tizdi.", 'd-flex поставил карточки в ряд.', 'd-flex lined the cards up.'),
    why2: L3("gap-7 bu 1.5rem, ya'ni 24 piksel degani.", 'gap-7 — это 1.5rem, то есть 24 пикселя.', 'gap-7 is 1.5rem, that is, 24 pixels.'),
    done: L3("Zo'r! O'tgan darsdagi bilim bu yerda ham ishladi.", 'Огонь! Знания с прошлого урока пригодились и здесь.', 'Awesome! What you learned last lesson worked here too.')
  },
  t4: {
    eyebrow: L3("Tartib bilan yig'ing", 'Собери по порядку', 'Build in order'),
    say: L3("Kartochka kodini o'zingiz yig'asiz. Pastdagi bo'laklarni to'g'ri tartibda bosing: tepadan pastga, xuddi kartochkada turganidek.",
      'Код карточки собираешь сам. Нажимай кусочки внизу в правильном порядке: сверху вниз, как они стоят в карточке.',
      'You build the card code yourself. Tap the pieces below in the right order: top to bottom, as they sit in the card.'),
    ask: L3("Kartochkadagidek tepadan pastga bosing", 'Нажимай сверху вниз, как в карточке', 'Tap from top to bottom, like in the card'),
    msgs: {
      img: L3("Oldin rasm: u kartochkaning eng tepasida turadi.", 'Сначала фото: оно на самом верху карточки.', 'The photo first: it sits at the very top of the card.'),
      body: L3("Rasmdan keyin card-body ochiladi: matnlar uning ichida.", 'После фото открывается card-body: тексты внутри него.', 'After the photo, card-body opens: the texts go inside it.'),
      title: L3("card-body ichida birinchi sarlavha, ya'ni robot nomi degani.", 'Внутри card-body первым идёт заголовок, то есть имя робота.', 'Inside card-body the title comes first: the robot’s name.'),
      text: L3("Sarlavhadan keyin matn.", 'После заголовка — текст.', 'After the title comes the text.'),
      btn: L3("Matndan keyin tugma.", 'После текста — кнопка.', 'After the text comes the button.'),
      close: L3("Oxirida card-body yopiladi.", 'В конце card-body закрывается.', 'At the end, card-body closes.')
    },
    hints: [
      L3("Kartochkaga qarang: tepada nima turadi?", 'Посмотри на карточку: что наверху?', 'Look at a card: what’s on top?'),
      L3("Tartib: rasm, card-body, sarlavha, matn, tugma, yopish.", 'Порядок: фото, card-body, заголовок, текст, кнопка, закрытие.', 'The order: photo, card-body, title, text, button, closing.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! Kartochka tartib bilan yig'ildi.", 'В точку! Карточка собрана по порядку.', 'Spot on! The card is built in order.')
  },
  q1: {
    eyebrow: L3('Qaysi class', 'Какой class', 'Which class'),
    say: L3("Kichik sinov. Chapda namuna, o'ngda sizning tanlovingiz natijasi. Kerakli bo'lakka qaysi class kerak?", 'Маленькое испытание. Слева образец, справа результат твоего выбора. Какой class нужен части?', 'A little test. The goal is on the left, your choice’s result on the right. Which class does the part need?'),
    asks: [L3('Rasmga qaysi class?', 'Какой class у фото?', 'Which class for the photo?'), L3('Tashqi qutiga qaysi class?', 'Какой class у внешней коробки?', 'Which class for the outer box?'), L3('Ichki div tegiga qaysi class?', 'Какой class у внутреннего div?', 'Which class for the inner div?'), L3('Yashil ramkali kartochkaga qaysi class?', 'Какой class у карточки с зелёной рамкой?', 'Which class for the green-framed card?')],
    ask: L3('Qaysi class?', 'Какой class?', 'Which class?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Rasm tepada, butun kenglikda: card-img-top.", 'Фото сверху во всю ширину: card-img-top.', 'The photo on top, full width: card-img-top.'),
      L3("Ramka va yumaloq burchak: card.", 'Рамка и скруглённые углы: card.', 'A border and rounded corners: card.'),
      L3("Ichki joy va oraliqlar: card-body.", 'Отступы и промежутки: card-body.', 'Inner space and gaps: card-body.'),
      L3("Yashil ramkali kartochka: card va theme-success.", 'Карточка с зелёной рамкой: card и theme-success.', 'A card with a green frame: card and theme-success.')
    ],
    no: {
      'rounded-circle': L3("rounded-circle rasmni oval qilib qirqdi. Namunada rasm to'rtburchak, kartochkaning tepasida.", 'rounded-circle обрезал фото овалом. В образце фото прямоугольное, наверху карточки.', 'rounded-circle cut the photo into an oval. In the goal the photo is a rectangle at the top of the card.'),
      'card-body': L3("card-body ichki joy beradi: rasm atrofida oq hoshiya paydo bo'ldi. Namunada rasm kartochka chetlariga tegib turibdi.", 'card-body даёт отступы: вокруг фото появились белые поля. В образце фото вплотную к краям карточки.', 'card-body adds inner space: white margins appeared around the photo. In the goal the photo touches the card’s edges.'),
      'img-thumbnail': L3("img-thumbnail rasmga soyali ramka berdi. Namunada rasm atrofida ramka yo'q.", 'img-thumbnail дал фото рамку с тенью. В образце вокруг фото рамки нет.', 'img-thumbnail gave the photo a frame with a shadow. In the goal there’s no frame around the photo.'),
      'card-box': L3("Bunday class yo'q: ramka ham, burchak ham chiqmadi.", 'Такого class нет: ни рамки, ни углов.', 'There’s no such class: no border, no corners.'),
      'cards': L3("Ko'plikda emas: class nomi birlikda.", 'Не во множественном числе: имя class в единственном.', 'Not plural: the class name is singular.'),
      'border': L3("border faqat chiziq chizadi, yumaloq burchak va kartochka tartibi yo'q.", 'border рисует только линию, без скругления и порядка карточки.', 'border only draws a line, without the rounding and the card layout.'),
      'card-text': L3("card-text bu nom, ko'rinish bermaydi: matn ramkaga yopishdi.", 'card-text — это имя, вида не даёт: текст прилип к рамке.', 'card-text is just a name, it gives no look: the text sticks to the border.'),
      'card-content': L3("Bunday class yo'q, ichki joy chiqmadi.", 'Такого class нет, отступов нет.', 'There’s no such class, so no inner space.'),
      'p-0': L3("p-0 ichki joyni olib tashlaydi, namunada esa joy bor.", 'p-0 убирает отступы, а в образце они есть.', 'p-0 removes inner space, but the goal has it.'),
      'card bg-green': L3("bg-green degan so'z yo'q. Rang theme bilan.", 'Слова bg-green нет. Цвет — через theme.', 'There’s no bg-green word. Color goes through theme.'),
      'card-success': L3("card-success degan class yo'q. Kartochka rangi theme bilan.", 'Такого class card-success нет. Цвет карточки — через theme.', 'There’s no card-success class. A card’s color goes through theme.'),
      'card fg-success': L3("fg faqat matnni bo'yaydi, kartochka ramkasi o'zgarmadi.", 'fg красит только текст, рамка карточки не изменилась.', 'fg only colors the text; the card’s frame didn’t change.')
    },
    hint1: L3("Namunadagi bo'lakka qarang: u qanday ko'rinadi?", 'Посмотри на часть в образце: как она выглядит?', 'Look at the part in the goal: what does it look like?'),
    hint2: L3("Saytdagi misol esingizdami? card, card-img-top, card-body.", 'Вспомни пример с сайта: card, card-img-top, card-body.', 'Remember the site example: card, card-img-top, card-body.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Kartochkaning har bir bo'lagini bilasiz.", 'Всё верно! Ты знаешь каждую часть карточки.', 'All correct! You know every part of a card.')
  },
  t6: {
    eyebrow: L3('Nega bunday?', 'Почему так?', 'Why like this?'),
    say: L3("Oxirgi sinov. Uchta kartochka chiroyli chiqmadi, har birida sabab boshqa. Kodga qarang va sababini tanlang.", 'Последнее испытание. Три карточки вышли некрасиво, у каждой своя причина. Посмотри на код и выбери причину.', 'The last test. Three cards didn’t come out right, each for a different reason. Look at the code and pick the reason.'),
    ask: L3('Nega bunday? Sababini tanlang', 'Почему так? Выбери причину', 'Why like this? Pick the reason'),
    asks: [L3('Matn ramkaga yopishgan. Nega?', 'Текст прилип к рамке. Почему?', 'The text sticks to the border. Why?'),
      L3('Rasm chiqmadi. Nega?', 'Фото не появилось. Почему?', 'The photo didn’t show up. Why?'),
      L3('Ramka rangsiz. Nega?', 'Рамка без цвета. Почему?', 'The frame has no color. Why?')],
    opts: {
      noBody: L3("card-body yo'q", 'Нет card-body', 'No card-body'),
      noSrc: L3("Rasm fayli yozilmagan", 'Не вписан файл фото', 'No photo file written'),
      noClass: L3("Bunday class yo'q", 'Такого class нет', 'There’s no such class')
    },
    rounds: [
      L3("card-body yo'q, shuning uchun matn ramkaga yopishib qoldi.", 'Нет card-body, поэтому текст прилип к рамке.', 'There’s no card-body, so the text sticks to the border.'),
      L3("src ichida saytdagi uchta nuqta qolgan. Rasm fayli nomini yozish kerak.", 'В src остались три точки с сайта. Нужно вписать имя файла фото.', 'src still has the site’s three dots. It needs the photo file name.'),
      L3("card-success degan class yo'q. Rang theme bilan: theme-success.", 'Такого class card-success нет. Цвет — через theme: theme-success.', 'There’s no card-success class. Color goes through theme: theme-success.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the site example.'),
    hint2: L3("Bo'lak yetishmayaptimi, nuqtalar qolganmi yoki so'z o'ylab topilganmi?", 'Не хватает части, остались точки или слово выдуманное?', 'Is a part missing, are the dots still there, or is the word made up?'),
    ok: L3("Hammasi to'g'ri! Endi kartochka chiroyli chiqmasa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если карточка вышла не так, причину найдёшь сам.', 'All correct! Now if a card goes wrong, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z kartochkangiz", 'Своя карточка', 'Your own card'),
    say: L3("Endi o'z kartochkangizni yasang: rasmni, robot nomini va kartochka rangini tanlang. Hammasi tayyor bo'lsa, «Tayyor»ni bosing.",
      'Теперь сделай свою карточку: выбери фото, имя робота и цвет карточки. Когда всё готово, нажми «Готово».',
      'Now make your own card: pick the photo, the robot’s name and the card color. When everything’s ready, tap “Done”.'),
    ask: L3("Rang, rasm va nomni yozing", 'Впиши цвет, фото и имя', 'Type the color, photo and name'),
    msgs: {
      name: L3("Robotga nom yozing, kamida bitta so'z.", 'Впиши имя робота, хотя бы одно слово.', 'Type the robot’s name, at least one word.')
    },
    hints: [
      L3("Kodda uchta bo'sh joy bor: rang, rasm fayli va nom.", 'В коде три пустых места: цвет, файл фото и имя.', 'The code has three empty spots: the color, the photo file and the name.'),
      L3("Rang theme bilan, rasm faylini Fayllar ro'yxatidan oling, nomni o'zingiz o'ylang.", 'Цвет — через theme, файл возьми из списка, имя придумай сам.', 'Color via theme, the file from the list, and make up the name yourself.'),
      L3("Masalan: theme-info, robot3.jpg va nom: Tezkor. Keyin «Tayyor»ni bosing.", 'Например: theme-info, robot3.jpg и имя: Быстрый. Потом нажми «Готово».', 'For example: theme-info, robot3.jpg and the name: Rocket. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning robotingiz kartochkasi.", 'Класс! Это карточка твоего робота.', 'Nice! This is your robot’s card.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men har bir bo'lakka alohida class kerak, aks holda kartochka buziladi deb o'ylagandim? Afsuski, adashibman. Kartochkani ikkita class ushlab turadi: card va card-body. card-title va card-text esa oltinchi versiyada shunchaki nom, tajribada ko'rdik.",
        'Вернёмся к загадке. Помнишь, я думал, что каждому кусочку нужен свой class, иначе карточка развалится? Увы, я ошибся. Карточку держат два class: card и card-body. А card-title и card-text в шестой версии — просто имена, мы видели это в опыте.',
        'Back to our riddle. Remember, I thought every piece needed its own class or the card would fall apart? Sadly, I was wrong. Two classes hold a card together: card and card-body. And in version six card-title and card-text are just names, as we saw in the experiment.'), k: 'riddle' },
      { text: L3("Qarang, birinchi kartochka sizniki!", 'Смотри, первая карточка — твоя!', 'Look, the first card is yours!'), k: null },
      { text: L3("Kartochka: card ramka, card-img-top rasm, card-body ichki joy.", 'Карточка: card — рамка, card-img-top — фото, card-body — место внутри.', 'A card: card is the frame, card-img-top the photo, card-body the inner space.'), k: 'parts' },
      { text: L3("Saytdan nusxalab, src, matn va rangni o'zimizga moslaymiz.", 'Копируем с сайта и подгоняем src, текст и цвет под себя.', 'We copy from the site and adapt src, text and color.'), k: 'copy' },
      { text: L3("Ramka rangini theme beradi, yumshoq rangni card-subtle.", 'Цвет рамки даёт theme, мягкий цвет — card-subtle.', 'theme gives the frame color, card-subtle the soft version.'), k: 'color' },
      { text: L3("Kartochkalarni qatorga d-flex va gap teradi.", 'Карточки в ряд ставят d-flex и gap.', 'd-flex and gap line the cards up.'), k: 'row' },
      { text: L3("Tabriklayman! Siz beshinchi darsni tugatdingiz. Keyingi darsda konteyner va setka bilan sahifani ustunlarga bo'lamiz. Ko'rishguncha!", 'Ура! Ты прошёл пятый урок. На следующем уроке разделим страницу на колонки с контейнером и сеткой. До встречи!', 'Hooray! You finished the fifth lesson. Next time we’ll split the page into columns with a container and a grid. See you!'), k: null }
    ],
    roles: {
      parts: L3('card · card-img-top · card-body', 'card · card-img-top · card-body', 'card · card-img-top · card-body'),
      copy: L3('Saytdan nusxa — keyin moslash', 'С сайта — потом подогнать', 'Copy from the site, then adapt'),
      color: L3('theme — ramka rangi', 'theme — цвет рамки', 'theme — frame color'),
      row: L3('d-flex gap — qator', 'd-flex gap — ряд', 'd-flex gap — a row')
    },
    ask: L3('Kartochkangizga qarang', 'Посмотри на свою карточку', 'Look at your card')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, why: 1, why1: 1, why2: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1,
  sayCard: 1, sayImg: 1, sayBody: 1, what: 1, back: 1, sayPage: 1, sayPaste: 1, sayApply: 1, saySrc: 1, sayText: 1, sayBtn: 1, sayTheme: 1, saySubtle: 1, sayFlex: 1, sayGap: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs5-kit.jsx@*/

/*@FILE:bs5-site.jsx@*/

/*@FILE:bs5-head.jsx@*/

/*@FILE:bs5-common.jsx@*/

/*@FILE:bs5-screens.jsx@*/

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
/*@FILE:../bs4/bs4.css@*/
/*@FILE:bs5.css@*/
`;
