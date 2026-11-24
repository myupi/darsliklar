// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 11 — «Финальный проект»
// (облик «Редактор», как уроки 1–9 модуля; 20.11.2026; финальный: final — практики и тестов нет). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs10/build.mjs → lessons/bootstrap/11-final-proekt.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 10 · «Финальный проект» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). Повторение модуля одним сайтом: сайт кружка роботов «потерял» Bootstrap, ученик возвращает его за
// 9 станций — по одной на урок 1–9 (CDN, цвет кнопки, img-fluid, justify-content-between, card, md:col-4, form-control,
// carousel-item, data-bs-toggle menu); в середине — показ «как на видео», как найти забытое на сайте. Потом сборка документа
// по порядку, «верно или нет», «почему не работает», свой цвет сайта и вывод. Загадка (без имён): Коди думает, что всё надо
// знать наизусть; разгадка — главное умение модуля: найти на сайте, скопировать, настроить.
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-11-final-proekt.md.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-11-final-proekt',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '11-dars. Yakuniy loyiha',
    ru: 'Урок 11. Финальный проект',
    en: 'Lesson 11. Final project'
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
  next: L3('Tilda', 'Tilda', 'Tilda'),
  withBs: L3('Bootstrap bilan', 'С Bootstrap', 'With Bootstrap'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  paste: L3("Shu yerga qo'ying", 'Вставь сюда', 'Paste here'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  need: L3('Kerak', 'Нужно', 'Goal'),
  yours: L3('Sizning kodingiz', 'Твой код', 'Your code'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  phone: L3('Telefon · 360 px', 'Телефон · 360 px', 'Phone · 360 px'),
  tablet: L3('Planshet · 768 px', 'Планшет · 768 px', 'Tablet · 768 px'),
  laptop: L3('Noutbuk · 1024 px', 'Ноутбук · 1024 px', 'Laptop · 1024 px'),
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
    join: L3('Yozilish', 'Записаться', 'Join'),
    sections: L3("Bo'limlar", 'Разделы', 'Sections'),
    g1: L3('Robototexnika', 'Робототехника', 'Robotics'),
    g2: L3('Dasturlash', 'Программирование', 'Coding'),
    g3: L3('3D modellash', '3D-моделирование', '3D modeling'),
    news: L3("Shanba kuni musobaqa!", 'В субботу соревнования!', 'Contest on Saturday!'),
    team: L3('Bizning jamoa', 'Наша команда', 'Our team'),
    r1: L3('Yashil chaqqon', 'Зелёный шустрик', 'Green racer'),
    r2: L3('Binafsha aqlli', 'Фиолетовый умник', 'Purple brain'),
    r3: L3("To'q sariq kuchli", 'Оранжевый силач', 'Orange strongman'),
    name: L3('Ism', 'Имя', 'Name'),
    send: L3('Yuborish', 'Отправить', 'Send')
  },
  map: {
    st1: L3('Ulash (CDN)', 'Подключение (CDN)', 'Connect (CDN)'),
    st2: L3('Tugma rangi', 'Цвет кнопки', 'Button color'),
    st3: L3('Rasm', 'Картинка', 'Image'),
    st4: L3('Flex sarlavha', 'Шапка flex', 'Flex header'),
    st5: L3('Kartochka', 'Карточка', 'Card'),
    st6: L3('Setka', 'Сетка', 'Grid'),
    stp: L3('Sahifa raqamlari', 'Номера страниц', 'Page numbers'),
    st7: L3('Forma', 'Форма', 'Form'),
    st8: L3('Karusel', 'Карусель', 'Carousel'),
    st9: L3('Menyu', 'Меню', 'Menu')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    stop: L3("{n}-bekat · {w}", 'Станция {n} · {w}', 'Stop {n} · {w}'),
    msgs: {
      empty: L3("Bo'sh joyga yozing.", 'Впиши в пустое место.', 'Type into the empty spot.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские.', 'Latin letters are needed here. Bootstrap’s words are English.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      old: L3("Bu eski nom, beshinchi versiyadan. Oltinchisida: {w}.", 'Это старое имя из пятой версии. В шестой: {w}.', 'That’s an old name from version five. In version six: {w}.'),
      typo: L3("Harflarni tekshiring. To'g'risi: {w}.", 'Проверь буквы. Правильно: {w}.', 'Check the letters. It’s spelled {w}.'),
      fam: L3("{w} boshqa narsa uchun. Bu yerga boshqa so'z kerak.", '{w} — для другой вещи. Сюда нужно другое слово.', '{w} is for something else. This spot needs another word.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas.", 'Bootstrap это слово знает, но результат не как в образце.', 'Bootstrap knows that word, but the result isn’t like the goal.'),
      unknown: L3("Bootstrap bunday so'zni bilmaydi: \u2063{w}\u2064. Shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает такого слова: \u2063{w}\u2064. Поэтому ничего не изменилось.', 'Bootstrap doesn’t know this word: \u2063{w}\u2064. So nothing changed.'),
      twice: L3("theme qismi allaqachon yozilgan. Faqat rang so'zini yozing: {w}.", 'Часть theme уже написана. Впиши только слово цвета: {w}.', 'The theme part is already there. Type just the color word: {w}.'),
      otherTheme: L3("{w} ham Bootstrap rangi, lekin namunadagi tugma boshqa rangda.", '{w} — тоже цвет Bootstrap, но в образце кнопка другого цвета.', '{w} is a Bootstrap color too, but the goal button is a different color.'),
      anyTheme: L3("Bootstrap ranglari o'z nomlari bilan: primary, success, danger, warning, info, accent. Bittasini yozing.", 'У цветов Bootstrap свои имена: primary, success, danger, warning, info, accent. Впиши одно из них.', 'Bootstrap colors have their own names: primary, success, danger, warning, info, accent. Type one of them.'),
      nativeColor: L3("Bootstrap ranglari o'z nomi bilan: yashil — {w}.", 'У цветов Bootstrap свои имена: зелёный — {w}.', 'Bootstrap colors have their own names: green is {w}.')
    }
  },
  s1: {
    eyebrow: L3('Yakuniy loyiha', 'Финальный проект', 'Final project'),
    say: L3("Salom! Bugun oxirgi dars. Qarang, to'garak sayti Bootstrapni yo'qotib qo'yibdi: hamma narsa bir uyum, rasmlar ostma-ost, menyu ochiq yotibdi. Uni qaytaramiz. Avval qanday bo'lishi kerakligini ko'ring: «Bootstrap bilan» tugmasini bosing.",
      'Привет! Сегодня последний урок. Смотри, сайт кружка потерял Bootstrap: всё кучей, фото друг под другом, меню лежит открытым. Вернём его. Сначала посмотри, каким он должен быть: нажми «С Bootstrap».',
      'Hi! Today is the last lesson. Look, the club site lost its Bootstrap: everything is in a pile, photos stacked, the menu lying open. Let’s bring it back. First see how it should look: tap “With Bootstrap”.'),
    magic: L3("Mana! Sarlavha, e'lon, karusel, kartochkalar va forma, hammasi joyida. O'n dars, bitta sayt!",
      'Вот! Шапка, объявление, карусель, карточки и форма — всё на месте. Десять уроков, один сайт!',
      'There! Header, notice, carousel, cards and form, all in place. Ten lessons, one site!'),
    done: L3("Bunday saytni qaytadan yasaymiz, bekatma-bekat. Lekin oldin topishmoq. Menimcha, buning uchun o'n darsning hamma so'zlarini yoddan bilish kerak. Juda ko'p! Siz nima deb o'ylaysiz? Javobni dars oxirida topamiz.",
      'Мы соберём такой сайт заново, станция за станцией. Но сначала загадка. По-моему, для этого надо знать наизусть все слова из десяти уроков. Это очень много! Как думаешь? Ответ найдём в конце урока.',
      'We’ll rebuild this site stop by stop. But first, a riddle. I think for that you need to know every word from ten lessons by heart. That’s a lot! What do you think? We’ll find out at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3("O'n dars — bitta sayt", 'Десять уроков — один сайт', 'Ten lessons, one site')
  },
  s2: {
    eyebrow: L3("Yo'l xaritasi", 'Карта пути', 'Route map'),
    say: L3("Mana yo'limiz: o'nta bekat, har biri bitta darsdan. Har bekatda saytning bitta qismini qaytaramiz. Boshladik!", 'Вот наш путь: десять станций, каждая — один урок. На каждой станции возвращаем одну часть сайта. Поехали!', 'Here’s our route: ten stops, one per lesson. At each stop we bring back one part of the site. Let’s go!'),
    ask: L3("O'nta bekat", 'Десять станций', 'Ten stops')
  },
  st1: {
    eyebrow: L3('Ulash', 'Подключение', 'Connect'),
    say: L3("Birinchi bekat, birinchi dars. Bootstrap ishlashi uchun head ichiga bitta qator kerak. Qaysi biri? Variantni tanlang, sahifa darrov ko'rsatadi.", 'Первая станция, первый урок. Чтобы Bootstrap работал, в head нужна одна строка. Какая? Выбери вариант — страница сразу покажет.', 'Stop one, lesson one. For Bootstrap to work, head needs one line. Which one? Pick an option, the page shows it right away.'),
    ask: L3("head ichiga qaysi qator?", 'Какую строку в head?', 'Which line goes in head?'),
    opts: {
      link: L3('link · bootstrap.min.css', 'link · bootstrap.min.css', 'link · bootstrap.min.css'),
      script: L3('script · bootstrap.bundle.min.js', 'script · bootstrap.bundle.min.js', 'script · bootstrap.bundle.min.js'),
      typo: L3('link · bootsrtap.min.css', 'link · bootsrtap.min.css', 'link · bootsrtap.min.css'),
      style: L3('<style>bootstrap</style>', '<style>bootstrap</style>', '<style>bootstrap</style>')
    },
    no: {
      script: L3("script qatori tugmalarni ishlatadi, lekin bezakni bermaydi. Bezak CSS faylda: sahifa oddiy qoldi.", 'Строка script оживляет кнопки, но оформления не даёт. Оформление — в CSS-файле: страница осталась простой.', 'The script line powers buttons but gives no styling. Styling is in the CSS file: the page stayed plain.'),
      typo: L3("Manzilda harf xatosi bor: bootsrtap. Bunday fayl yo'q, sahifa oddiy qoldi.", 'В адресе опечатка: bootsrtap. Такого файла нет, страница осталась простой.', 'The address has a typo: bootsrtap. There’s no such file, the page stayed plain.'),
      style: L3("style ichida bitta so'z yozish yetmaydi: Bootstrap faylini link bilan ulash kerak.", 'Одного слова в style мало: файл Bootstrap подключают строкой link.', 'One word in style isn’t enough: the Bootstrap file is connected with a link line.')
    },
    why: L3("link qatori Bootstrapning CSS faylini ulaydi: sahifa bezandi.", 'Строка link подключает CSS-файл Bootstrap: страница оформлена.', 'The link line connects Bootstrap’s CSS file: the page is styled.'),
    hint1: L3("Qaysi qator CSS faylini ulaydi?", 'Какая строка подключает CSS-файл?', 'Which line connects the CSS file?'),
    hint2: L3("CSS fayl — css bilan tugaydi, ulanadi link bilan.", 'CSS-файл оканчивается на css и подключается через link.', 'A CSS file ends in css and is connected with link.'),
    done: L3("Ajoyib! Bootstrap ulandi.", 'Отлично! Bootstrap подключён.', 'Great! Bootstrap is connected.')
  },
  st2: {
    eyebrow: L3('Tugma rangi', 'Цвет кнопки', 'Button color'),
    say: L3("Ikkinchi bekat: tugma. Namunadagidek yashil bo'lsin. Bo'sh joyga rang so'zini yozing.", 'Вторая станция: кнопка. Пусть будет зелёной, как в образце. Впиши слово цвета.', 'Stop two: the button. Make it green like the goal. Type the color word.'),
    ask: L3("Yozilish tugmasi yashil bo'lsin", 'Кнопка «Записаться» — зелёная', 'Make the Join button green'),
    hints: [
      L3("Bootstrap ranglari theme- dan keyin yoziladi.", 'Цвета Bootstrap пишутся после theme-.', 'Bootstrap colors go after theme-.'),
      L3("Yashil — muvaffaqiyat rangi, inglizcha success.", 'Зелёный — цвет успеха, по-английски success.', 'Green is the success color.'),
      L3("Yozing: success", 'Впиши: success', 'Type: success')
    ],
    why: L3("theme-success tugmani yashil qildi.", 'theme-success сделал кнопку зелёной.', 'theme-success made the button green.'),
    done: L3("Zo'r! Tugma rangi joyida.", 'Огонь! Цвет кнопки на месте.', 'Awesome! The button color is back.')
  },
  st3: {
    eyebrow: L3('Rasm', 'Картинка', 'Image'),
    say: L3("Uchinchi bekat: jamoa rasmi telefonga sig'mayapti. Uni ekranga moslang.", 'Третья станция: фото команды не помещается в телефон. Подгони его под экран.', 'Stop three: the team photo doesn’t fit the phone. Make it fit the screen.'),
    ask: L3("Rasm telefonga sig'sin", 'Фото помещается в телефон', 'Make the photo fit the phone'),
    noThumb: L3("Rasm sig'di, lekin ramka ham qo'shildi. Faqat moslaydigan so'z kerak.", 'Фото поместилось, но добавилась рамка. Нужно слово, которое только подгоняет.', 'The photo fits, but a frame was added too. You need the word that only fits it.'),
    hints: [
      L3("Uchinchi darsda rasmni ekranga moslaydigan so'z bor edi.", 'В третьем уроке было слово, которое подгоняет фото под экран.', 'Lesson three had a word that fits a photo to the screen.'),
      L3("img va fluid, ya'ni egiluvchan degani.", 'img и fluid, то есть «гибкий».', 'img and fluid.'),
      L3("Yozing: img-fluid", 'Впиши: img-fluid', 'Type: img-fluid')
    ],
    why: L3("img-fluid rasmni ekran kengligiga moslashtirdi.", 'img-fluid подогнал фото под ширину экрана.', 'img-fluid fit the photo to the screen width.'),
    done: L3("Qoyil! Rasm sig'di.", 'Класс! Фото поместилось.', 'Nice! The photo fits.')
  },
  st4: {
    eyebrow: L3('Flex sarlavha', 'Шапка flex', 'Flex header'),
    say: L3("To'rtinchi bekat: sarlavha. Logotip chapda, tugma o'ngda, oralarida bo'sh joy bo'lsin.", 'Четвёртая станция: шапка. Логотип слева, кнопка справа, между ними свободное место.', 'Stop four: the header. Logo on the left, button on the right, space between them.'),
    ask: L3("Chetlarga taqalsin, oralari teng", 'Края — к краям, промежутки поровну', 'Push to the edges, space between'),
    noJc: L3("Bu ham joylash so'zi, lekin chetdagi bo'laklar chetga taqalmadi. Oxirini almashtiring.", 'Это тоже слово расстановки, но крайние части не прижались к краям. Поменяй окончание.', 'That’s a placement word too, but the outer parts didn’t reach the edges. Change the ending.'),
    hints: [
      L3("Bosh o'q bo'yicha joylash — justify-content.", 'Расстановка по главной оси — justify-content.', 'Placing along the main axis is justify-content.'),
      L3("Oraliqda bo'sh joy — between.", 'Место между — between.', 'Space between is between.'),
      L3("Yozing: justify-content-between", 'Впиши: justify-content-between', 'Type: justify-content-between')
    ],
    why: L3("justify-content-between bo'laklarni chetlarga surdi.", 'justify-content-between развёл части к краям.', 'justify-content-between pushed the parts to the edges.'),
    done: L3("Ajoyib! Sarlavha tartibli.", 'Отлично! Шапка в порядке.', 'Great! The header is tidy.')
  },
  st5: {
    eyebrow: L3('Kartochka', 'Карточка', 'Card'),
    say: L3("Beshinchi bekat: robot kartochkasi buzilgan. Tashqi qutiga kerakli so'zni yozing.", 'Пятая станция: карточка робота сломалась. Впиши внешней коробке нужное слово.', 'Stop five: the robot card is broken. Give the outer box the right word.'),
    ask: L3("Ramkali kartochka bo'lsin", 'Пусть будет карточка с рамкой', 'Make it a card with a border'),
    hints: [
      L3("Ichida card-body bor. Tashqisi-chi?", 'Внутри card-body. А снаружи?', 'Inside is card-body. And outside?'),
      L3("Kartochka inglizcha card.", 'Карточка по-английски — card.', 'A card in English is card.'),
      L3("Yozing: card", 'Впиши: card', 'Type: card')
    ],
    why: L3("card ramka va yumaloq burchak berdi.", 'card дал рамку и круглые углы.', 'card gave a border and round corners.'),
    done: L3("Zo'r! Kartochka tayyor.", 'Огонь! Карточка готова.', 'Awesome! The card is ready.')
  },
  st6: {
    eyebrow: L3('Setka', 'Сетка', 'Grid'),
    say: L3("Oltinchi bekat: kartochkalar telefonda ostma-ost, planshetdan boshlab qatorda tursin. Uchinchisiga so'z yozing.", 'Шестая станция: на телефоне карточки друг под другом, а с планшета — в ряд. Впиши слово третьей.', 'Stop six: cards stack on a phone and go in a row from a tablet up. Give the third one its word.'),
    ask: L3("Planshetda yonma-yon, telefonda ostma-ost", 'На планшете — рядом, на телефоне — друг под другом', 'Side by side on a tablet, stacked on a phone'),
    noCol: L3("Bu so'z bilan telefonda ham qatorda qoladi. Qolgan ikkitasiga qarang: oldida ekran o'lchami bor.", 'С этим словом колонки останутся рядом и на телефоне. Посмотри на две другие: впереди размер экрана.', 'With that word the columns stay in a row on phones too. Look at the other two: they start with a screen size.'),
    hints: [
      L3("Qolgan ikki ustunda qaysi so'z bor?", 'Какое слово у двух других колонок?', 'Which word do the other two columns have?'),
      L3("md — planshet, ikki nuqta, keyin col-4.", 'md — планшет, двоеточие, потом col-4.', 'md is a tablet, a colon, then col-4.'),
      L3("Yozing: md:col-4", 'Впиши: md:col-4', 'Type: md:col-4')
    ],
    why: L3("md:col-4: planshetdan boshlab uchta ustun.", 'md:col-4: с планшета три колонки.', 'md:col-4: three columns from a tablet up.'),
    done: L3("Ajoyib! Setka ishlaydi.", 'Отлично! Сетка работает.', 'Great! The grid works.')
  },
  // Станция урока 7 «Navbar и Pagination» (23.11.2026): номера страниц под карточками.
  stp: {
    eyebrow: L3('Sahifa raqamlari', 'Номера страниц', 'Page numbers'),
    say: L3("Yettinchi bekat: kartochkalar ostidagi sahifa raqamlari ustma-ust ro'yxat bo'lib qolgan. ul tegiga kerakli so'zni yozing.", 'Седьмая станция: номера страниц под карточками стали списком друг под другом. Впиши тегу ul нужное слово.', 'Stop seven: the page numbers under the cards turned into a stacked list. Type the right word for the ul tag.'),
    ask: L3("Raqamlar namunadagidek tugmachalar qatori bo'lsin", 'Номера — ряд кнопочек, как в образце', 'Make the numbers a row of buttons like the goal'),
    noFlex: L3("Raqamlar qatorga turdi, lekin tugmacha bo'lmadi. Sahifa raqamlari uchun Bootstrapda alohida so'z bor.", 'Номера встали в ряд, но кнопочками не стали. Для номеров страниц у Bootstrap есть своё слово.', 'The numbers are in a row, but they aren’t buttons. Bootstrap has its own word for page numbers.'),
    hints: [
      L3("Raqamlar qatori qanday ataladi?", 'Как называется ряд номеров?', 'What’s the row of numbers called?'),
      L3("Inglizcha sahifalash, ya'ni pagination degani.", 'По-английски — pagination.', 'In English: pagination.'),
      L3("Yozing: pagination", 'Впиши: pagination', 'Type: pagination')
    ],
    why: L3("pagination raqamlarni bir qatorga, tugmachalarga aylantirdi.", 'pagination поставил номера в ряд кнопочками.', 'pagination turned the numbers into a row of buttons.'),
    done: L3("Barakalla! Sahifa raqamlari joyida.", 'Здорово! Номера страниц на месте.', 'Great! The page numbers are in place.')
  },
  st7: {
    eyebrow: L3('Forma', 'Форма', 'Form'),
    say: L3("Sakkizinchi bekat: yozilish formasi. Ism maydoni chiroyli bo'lsin.", 'Восьмая станция: форма записи. Пусть поле «Имя» станет красивым.', 'Stop eight: the sign-up form. Make the Name field neat.'),
    ask: L3("Ism maydoni namunadagidek keng bo'lsin", 'Поле «Имя» — широкое, как в образце', 'Make the Name field wide like the goal'),
    hints: [
      L3("Yozuvda form-label bor. Maydonda-chi?", 'У подписи form-label. А у поля?', 'The label has form-label. And the field?'),
      L3("form va control.", 'form и control.', 'form and control.'),
      L3("Yozing: form-control", 'Впиши: form-control', 'Type: form-control')
    ],
    why: L3("form-control maydonni keng va chiroyli qildi.", 'form-control сделал поле широким и аккуратным.', 'form-control made the field wide and neat.'),
    done: L3("Qoyil! Forma tayyor.", 'Класс! Форма готова.', 'Nice! The form is ready.')
  },
  st8: {
    eyebrow: L3('Karusel', 'Карусель', 'Carousel'),
    say: L3("To'qqizinchi bekat: karuselda uchinchi rasm buzilgan. Unga kerakli so'zni yozing va tugmani bosib tekshiring.", 'Девятая станция: в карусели сломалось третье фото. Впиши ему нужное слово и проверь кнопкой.', 'Stop nine: the carousel’s third photo is broken. Give it the right word and check with the button.'),
    ask: L3("O'ng tugmani bosing: uchinchi rasm chiqmaydi. Uni karuselga qo'shing", 'Нажми ›: третьего фото нет. Добавь его в карусель', 'Tap ›: there’s no third photo. Add it to the carousel'),
    hints: [
      L3("Qolgan ikki rasmda qaysi so'z bor?", 'Какое слово у двух других фото?', 'Which word do the other two photos have?'),
      L3("carousel va item.", 'carousel и item.', 'carousel and item.'),
      L3("Yozing: carousel-item", 'Впиши: carousel-item', 'Type: carousel-item')
    ],
    why: L3("carousel-item uchinchi rasmni ham karuselga qo'shdi.", 'carousel-item добавил третье фото в карусель.', 'carousel-item added the third photo to the carousel.'),
    done: L3("Zo'r! Karusel aylanadi.", 'Огонь! Карусель листается.', 'Awesome! The carousel slides.')
  },
  g1: {
    eyebrow: L3("Esdan chiqdimi?", 'Забыл слово?', 'Forgot a word?'),
    help: [
      L3("Menyudagi Components bo'limiga va Menu sahifasidagi birinchi qatorga qarang.", 'Посмотри на раздел Components и первую строку на странице Menu.', 'Look at Components and the first line on the Menu page.'),
      L3("Yodda bo'lmasa, saytni ochasiz: bo'limni topasiz, misolni ko'rasiz, kerakli so'zni olasiz.", 'Не помнишь — открываешь сайт: находишь раздел, смотришь пример, берёшь нужное слово.', 'Can’t remember? Open the site: find the section, look at the example, take the word you need.'),
      L3("Bu lug'atga o'xshaydi: hamma so'zni yodlamaysiz, kerak bo'lsa qaraysiz.", 'Это как словарь: все слова не учишь, а смотришь, когда нужно.', 'It’s like a dictionary: you don’t memorize every word, you look it up when needed.')
    ],
    say: L3("Keyingi bekatda menyu bor. Menyu tugmasiga qaysi so'z kerak edi? Esimdan chiqdi! Hechqisi yo'q, saytdan qaraymiz.", 'На следующей станции меню. Какое слово нужно кнопке меню? Забыл! Ничего, посмотрим на сайте.', 'The next stop has a menu. Which word did the menu button need? I forgot! No problem, let’s check the site.'),
    sayPage: L3("Components bo'limida Menu sahifasi. Birinchi misol: tugma va menyu.", 'В разделе Components — страница Menu. Первый пример: кнопка и меню.', 'In Components there’s the Menu page. The first example: a button and a menu.'),
    sayLine: L3("Mana, tugma qatorida yozilgan: data-bs-toggle va menu. Topdim!", 'Вот, в строке кнопки написано: data-bs-toggle и menu. Нашёл!', 'Here, the button line says data-bs-toggle and menu. Found it!'),
    done: L3("Eslab qoling: esdan chiqsa, saytni ochasiz va misoldan olasiz.", 'Запомни: забыл — открываешь сайт и берёшь из примера.', 'Remember: if you forget, open the site and take it from the example.'),
    askStart: L3('Qarang: sayt', 'Смотри: сайт', 'Watch: the site'),
    askMenu: L3('Qarang: Components → Menu', 'Смотри: Components → Menu', 'Watch: Components → Menu'),
    askPage: L3('Qarang: misol', 'Смотри: пример', 'Watch: the example'),
    askLine: L3('Qarang: data-bs-toggle', 'Смотри: data-bs-toggle', 'Watch: data-bs-toggle'),
    askDone: L3('Esdan chiqsa — sayt', 'Забыл — сайт', 'Forgot? The site')
  },
  st9: {
    eyebrow: L3('Menyu', 'Меню', 'Menu'),
    say: L3("O'ninchi bekat: Bo'limlar tugmasi menyuni ochmayapti. Saytda ko'rgan so'zni yozing va bosib tekshiring.", 'Десятая станция: кнопка «Разделы» не открывает меню. Впиши слово, которое мы видели на сайте, и проверь.', 'Stop ten: the Sections button doesn’t open the menu. Type the word we saw on the site and test it.'),
    ask: L3("Tugma menyuni ochsin", 'Кнопка открывает меню', 'Make the button open the menu'),
    hints: [
      L3("Tugma nimani ochishi kerak?", 'Что должна открыть кнопка?', 'What should the button open?'),
      L3("Saytda: data-bs-toggle va menu.", 'На сайте: data-bs-toggle и menu.', 'On the site: data-bs-toggle and menu.'),
      L3("Yozing: menu", 'Впиши: menu', 'Type: menu')
    ],
    why: L3("data-bs-toggle menu tugmaga menyuni ochishni o'rgatdi.", 'data-bs-toggle menu научил кнопку открывать меню.', 'data-bs-toggle menu taught the button to open the menu.'),
    done: L3("Ajoyib! O'n bekat ham tayyor!", 'Отлично! Все десять станций пройдены!', 'Great! All ten stops are done!')
  },
  t4: {
    eyebrow: L3("Sahifani yig'ing", 'Собери страницу', 'Build the page'),
    say: L3("Endi sahifani tartib bilan yig'amiz: Bootstrap ulanishi, keyin sahifa qismlari tepadan pastga, oxirida skript.", 'Теперь соберём страницу по порядку: подключение Bootstrap, потом части страницы сверху вниз, в конце скрипт.', 'Now let’s build the page in order: connect Bootstrap, then the parts top to bottom, the script last.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order'),
    parts: { hdr: L3('Sarlavha', 'Шапка', 'Header'), car: L3('Karusel', 'Карусель', 'Carousel'), row: L3('Kartochkalar', 'Карточки', 'Cards') },
    msgs: {
      link: L3("Oldin head ichida link qatori: Bootstrap ulanadi.", 'Сначала строка link в head: подключаем Bootstrap.', 'First the link line in head: connect Bootstrap.'),
      bo: L3("Endi sahifa tanasi ochiladi: body.", 'Теперь открывается тело страницы: body.', 'Now the page body opens: body.'),
      hdr: L3("Tepada sarlavha turadi.", 'Сверху стоит шапка.', 'The header goes on top.'),
      car: L3("Sarlavhadan keyin karusel.", 'После шапки — карусель.', 'After the header comes the carousel.'),
      row: L3("Karuseldan keyin kartochkalar qatori.", 'После карусели — ряд карточек.', 'After the carousel comes the row of cards.'),
      sc: L3("Oxirida, body yopilishidan oldin, script qatori.", 'В конце, перед закрытием body, — строка script.', 'At the end, before body closes, the script line.'),
      bc: L3("Oxirida body yopiladi.", 'В конце закрываем body.', 'Last, body closes.')
    },
    hints: [
      L3("Bootstrapni ulashdan boshlang.", 'Начни с подключения Bootstrap.', 'Start by connecting Bootstrap.'),
      L3("Tartib: link, body, sarlavha, karusel, kartochkalar, script, yopish.", 'Порядок: link, body, шапка, карусель, карточки, script, закрытие.', 'The order: link, body, header, carousel, cards, script, close.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! link tepada, script pastda, o'rtada sayt.", 'В точку! link сверху, script внизу, посередине сайт.', 'Spot on! link on top, script at the bottom, the site in between.')
  },
  tf: {
    eyebrow: L3("To'g'ri yoki noto'g'ri", 'Верно или нет', 'True or false'),
    say: L3("Endi tezkor sinov: beshta gap. Har birini to'g'ri yoki noto'g'ri deb belgilang.", 'Теперь быстрая проверка: пять утверждений. Отметь каждое: верно или нет.', 'Now a quick check: five statements. Mark each one true or false.'),
    ask: L3("Bu gap to'g'rimi?", 'Это верно?', 'Is this true?'),
    claims: [
      L3("Bootstrap ishlashi uchun head ichida link qatori kerak.", 'Чтобы Bootstrap работал, в head нужна строка link.', 'For Bootstrap to work, head needs the link line.'),
      L3("Bootstrap 6 da yashil tugma — btn-success.", 'В Bootstrap 6 зелёная кнопка — btn-success.', 'In Bootstrap 6 a green button is btn-success.'),
      L3("Menyu va karusel tugmalari ishlashi uchun script qatori kerak.", 'Чтобы работали кнопки меню и карусели, нужна строка script.', 'Menu and carousel buttons need the script line.'),
      L3("Bootstrap 6 da telefonda ustunlar ostma-ost tursin desak, col-md-4 yozamiz.", 'В Bootstrap 6, чтобы на телефоне колонки шли друг под другом, пишем col-md-4.', 'In Bootstrap 6, to stack columns on a phone, we write col-md-4.'),
      L3("Ro'yxat, ya'ni select ham form-control bilan bezaladi.", 'Список select тоже украшается form-control.', 'A select list is styled with form-control too.')
    ],
    why: [
      L3("link qatori Bootstrapning CSS faylini ulaydi.", 'Строка link подключает CSS-файл Bootstrap.', 'The link line connects Bootstrap’s CSS file.'),
      L3("btn-success beshinchi versiyaning nomi. Oltinchisida btn-solid va theme-success.", 'btn-success — имя пятой версии. В шестой — btn-solid и theme-success.', 'btn-success is a version five name. In version six it’s btn-solid with theme-success.'),
      L3("Menyu va karusel tugmalarini Bootstrap skripti ishlatadi.", 'Кнопки меню и карусели оживляет скрипт Bootstrap.', 'Bootstrap’s script powers the menu and carousel buttons.'),
      L3("col-md-4 beshinchi versiyaning nomi. Oltinchisida md:col-4.", 'col-md-4 — имя пятой версии. В шестой — md:col-4.', 'col-md-4 is a version five name. In version six it’s md:col-4.'),
      L3("Oltinchi versiyada select ham form-control bilan bezaladi.", 'В шестой версии select тоже украшается form-control.', 'In version six select is styled with form-control too.')
    ],
    opts: { yes: L3("To'g'ri", 'Верно', 'True'), no: L3("Noto'g'ri", 'Неверно', 'False') },
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    // подсказки — к каждому утверждению своя (23.11.2026: одна общая «это слово из шестой версии?» не подходила к link, script и select)
    hint1s: [
      L3("Bootstrap qanday ulanadi? 1-bekatni eslang.", 'Как подключается Bootstrap? Вспомни станцию 1.', 'How is Bootstrap connected? Remember stop 1.'),
      L3("So'zga qarang: u oltinchi versiyadanmi?", 'Посмотри на слово: оно из шестой версии?', 'Look at the word: is it from version six?'),
      L3("Menyu va karusel tugmalarini nima ishlatadi?", 'Что оживляет кнопки меню и карусели?', 'What powers the menu and carousel buttons?'),
      L3("So'zga qarang: col-md-4 oltinchi versiyadanmi?", 'Посмотри на слово: col-md-4 — из шестой версии?', 'Look at the word: is col-md-4 from version six?'),
      L3("8-bekatni eslang: ro'yxat qanday bezaldi?", 'Вспомни станцию 8: как оформили список?', 'Remember stop 8: how was the list styled?')
    ],
    hint2s: [
      L3("CSS faylini link qatori ulaydi, u head ichida turadi.", 'CSS-файл подключает строка link, она стоит в head.', 'The link line connects the CSS file, and it sits in head.'),
      L3("Oltinchi versiyada tugma ikki so'zdan: btn-solid va theme.", 'В шестой версии у кнопки два слова: btn-solid и theme.', 'In version six a button has two words: btn-solid and theme.'),
      L3("CSS faqat bezaydi, tugmalarni Bootstrap skripti ishlatadi.", 'CSS только оформляет, а кнопки оживляет скрипт Bootstrap.', 'CSS only styles things; Bootstrap’s script powers the buttons.'),
      L3("Oltinchi versiyada ekran o'lchami oldinda, ikki nuqta bilan.", 'В шестой версии размер экрана пишется впереди, через двоеточие.', 'In version six the screen size goes first, with a colon.'),
      L3("Oltinchi versiyada alohida form-select yo'q.", 'В шестой версии отдельного form-select нет.', 'Version six has no separate form-select.')
    ],
    ok: L3("Hammasi to'g'ri! Siz Bootstrap 6 ni yaxshi bilasiz.", 'Всё верно! Ты хорошо знаешь Bootstrap 6.', 'All correct! You know Bootstrap 6 well.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta sayt buzilgan, har birida sabab boshqa. Sahifaga va kodga qarang, sababini tanlang.", 'Последнее испытание. Три сайта сломаны, у каждого своя причина. Посмотри на страницу и код, выбери причину.', 'The last test. Three sites are broken, each for a different reason. Look at the page and code, pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    asks: [
      L3("Sahifa bezanmagan. Nega?", 'Страница без оформления. Почему?', 'The page has no styling. Why?'),
      L3("Yozilish tugmasi oddiy, qolgani chiroyli. Nega?", 'Кнопка «Записаться» простая, остальное красивое. Почему?', 'The Join button is plain, the rest looks nice. Why?'),
      L3("Bo'limlar tugmasini bosing: menyu ochilmaydi. Nega?", 'Нажми «Разделы»: меню не открывается. Почему?', 'Tap Sections: the menu won’t open. Why?')
    ],
    opts: {
      noLink: L3("link qatori yo'q", 'Нет строки link', 'No link line'),
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5'),
      noScript: L3("script qatori yo'q", 'Нет строки script', 'No script line')
    },
    rounds: [
      L3("head ichida link qatori yo'q: Bootstrap umuman ulanmagan, sahifa oddiy.", 'В head нет строки link: Bootstrap не подключён, страница простая.', 'There’s no link line in head: Bootstrap isn’t connected, the page is plain.'),
      L3("btn-primary beshinchi versiyaning nomi: tugma bezanmadi. Oltinchisida btn-solid va theme.", 'btn-primary — имя пятой версии: кнопка не оформлена. В шестой — btn-solid и theme.', 'btn-primary is a version five name: the button isn’t styled. In version six it’s btn-solid with theme.'),
      L3("Oxirida script qatori yo'q: Bo'limlar tugmasi menyuni ochmaydi.", 'В конце нет строки script: кнопка «Разделы» не открывает меню.', 'There’s no script line at the end: the Sections button won’t open the menu.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Sahifa bezanganmi? Tugmalar ishlaydimi?", 'Страница оформлена? Кнопки работают?', 'Is the page styled? Do the buttons work?'),
    hint2: L3("Bezak — link, tugmalar — script, nomlar — oltinchi versiyadan.", 'Оформление — link, кнопки — script, имена — из шестой версии.', 'Styling is link, buttons are script, names come from version six.'),
    ok: L3("Hammasi to'g'ri! Sayt buzilsa, sababini o'zingiz topasiz.", 'Всё верно! Если сайт сломается, причину найдёшь сам.', 'All correct! If a site breaks, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("Saytingiz rangi", 'Цвет твоего сайта', 'Your site’s color'),
    say: L3("Endi saytni o'zingizga moslang. Bootstrap ranglaridan birini tanlab, bo'sh joyga yozing: e'lon va tugmalar o'sha rangga kiradi. Keyin «Tayyor»ni bosing.", 'Теперь подгони сайт под себя. Выбери цвет Bootstrap и впиши его: объявление и кнопки станут этого цвета. Потом нажми «Готово».', 'Now make the site yours. Pick a Bootstrap color and type it in: the notice and buttons take that color. Then tap “Done”.'),
    ask: L3("Bootstrap rangini yozing: primary, danger, warning…", 'Впиши цвет Bootstrap: primary, danger, warning…', 'Type a Bootstrap color: primary, danger, warning…'),
    hints: [
      L3("Bootstrap ranglari: primary, success, danger, warning, info, accent.", 'Цвета Bootstrap: primary, success, danger, warning, info, accent.', 'Bootstrap colors: primary, success, danger, warning, info, accent.'),
      L3("theme- allaqachon yozilgan, faqat rang so'zi kerak.", 'theme- уже написано, нужно только слово цвета.', 'theme- is already there, just the color word.'),
      L3("Masalan: primary. Keyin «Tayyor»ni bosing.", 'Например: primary. Потом нажми «Готово».', 'For example: primary. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning saytingiz rangi.", 'Класс! Это цвет твоего сайта.', 'Nice! This is your site’s color.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men hamma so'zni yoddan bilish kerak deb o'ylagandim? Afsuski, adashibman. Siz o'n bekatni o'tdingiz, esdan chiqqanini esa saytdan topdingiz. Bootstrapning asosiy siri shu: topasiz, nusxalaysiz, o'zingizga moslaysiz.",
        'Вернёмся к загадке. Помнишь, я думал, что всё надо знать наизусть? Увы, я ошибся. Ты прошёл десять станций, а забытое нашёл на сайте. Вот главный секрет Bootstrap: нашёл, скопировал, подогнал под себя.',
        'Back to our riddle. Remember, I thought you had to know everything by heart? Sadly, I was wrong. You passed ten stops and found what you forgot on the site. That’s Bootstrap’s main secret: find it, copy it, make it yours.'), k: 'riddle' },
      { text: L3("Qarang, mana sizning saytingiz!", 'Смотри, вот твой сайт!', 'Look, here’s your site!'), k: null },
      { text: L3("Ulanish: head ichida link, body oxirida script.", 'Подключение: link в head, script в конце body.', 'Connecting: link in head, script at the end of body.'), k: 'cdn' },
      { text: L3("Ko'rinish: theme ranglari, tugmalar, kartochkalar va rasmlar.", 'Вид: цвета theme, кнопки, карточки и картинки.', 'Look: theme colors, buttons, cards and images.'), k: 'look' },
      { text: L3("Joylashuv: flex, container, row va ustunlar, forma.", 'Раскладка: flex, container, row и колонки, форма.', 'Layout: flex, container, row and columns, the form.'), k: 'layout' },
      { text: L3("Harakat: karusel va menyu, ularni skript ishlatadi.", 'Движение: карусель и меню, их оживляет скрипт.', 'Motion: the carousel and menu, powered by the script.'), k: 'js' },
      { text: L3("Tabriklayman! Siz Bootstrap modulini to'liq tugatdingiz. Keyingi modulda Tilda bilan sayt yasaymiz. Ko'rishguncha!", 'Ура! Ты полностью прошёл модуль Bootstrap. В следующем модуле будем делать сайты в Tilda. До встречи!', 'Hooray! You finished the whole Bootstrap module. In the next module we’ll build sites with Tilda. See you!'), k: null }
    ],
    roles: {
      cdn: L3('link · script', 'link · script', 'link · script'),
      look: L3('theme · card · img-fluid', 'theme · card · img-fluid', 'theme · card · img-fluid'),
      layout: L3('d-flex · row · md:col-4', 'd-flex · row · md:col-4', 'd-flex · row · md:col-4'),
      js: L3('carousel · menu', 'carousel · menu', 'carousel · menu')
    },
    ask: L3('Saytingizga qarang', 'Посмотри на свой сайт', 'Look at your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, why: 1, hint1: 1, hint2: 1, hint1s: 1, hint2s: 1, msgs: 1, magic: 1, ok: 1, no: 1, noCol: 1, sayPage: 1, sayLine: 1, right: 1, rounds: 1, claims: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs10-kit.jsx@*/

/*@FILE:bs10-site.jsx@*/

/*@FILE:bs10-head.jsx@*/

/*@FILE:bs10-common.jsx@*/

/*@FILE:bs10-screens.jsx@*/

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
/*@FILE:../bs5/bs5.css@*/
/*@FILE:../bs6/bs6.css@*/
/*@FILE:bs10.css@*/
`;
