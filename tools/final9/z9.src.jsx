// =============================================================================
// КУРС «HTML» · Модуль 1 «Основы разметки» · Урок 9 — «Финальный HTML-проект» (повторение курса)
// (облик «Редактор», по эталону — уроку 1 курса). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/final9/build.mjs → lessons/html/09-final-proekt.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 9 · «Финальный HTML-проект» · модуль html-m1-osnovy =====
//
// ЗАМЫСЕЛ (03.11.2026, по выбору заказчика — повторение всего курса). Урок с нуля; основа кода — уроки 2–8.
// Облик — эталона «Редактор» (naborRedaktor); бумаги нет нигде. Глитч сломал сайт Коди, который строился весь
// курс. Ученик проходит 8 станций — по уроку на станцию, на каждой одна поломка и одно действие: собрать каркас,
// вписать h1, выбрать ol, найти ссылку без href, вернуть src, вписать password, найти пары частей анкеты, выбрать
// header. Потом смешанное задание (картинка-ссылка), «босс» — пять поломок на одной странице, быстрый раунд
// «верно или нет», вывод. Нового материала нет (картинка внутри ссылки — сочетание двух знакомых тегов).
// Загадка (без имён): Коди думает, что сайт надо стереть и написать заново; в выводе признаёт ошибку —
// хватило маленьких точных правок.
//
// ДУГА (13 экранов; экрана плана нет — карта станций сверху):
//   s1 крючок · s2 каркас (Code Builder) · s3 h1 (Fill in the Blanks) · s4 ol (выбор) · s5 href (найти строку)
//   · s6 src (Drag & Drop) · s7 password (Fill in the Blanks) · s8 части анкеты (Matching Pairs) · s9 header (выбор)
//   · s10 смешанное: картинка-ссылка (Code Builder) · s11 босс: пять ошибок (Error Detective)
//   · q1 быстрый раунд (True / False) · s12 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер, как в уроках 1–8. Каждая реплика-напоминание — одна-две фразы, без нового материала.
//   · Итог для платформы — какие темы ученик починил с первой попытки (что стоит повторить).
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani», полные фразы (uslub.md, раздел 6).
//
// СИСТЕМА СЛОВ: bekat — станция (draft); ta'mirlash — починить (draft); kurs xaritasi — карта курса (draft).
// В речи ul, ol, li, img, src — по буквам, тег a — «A», остальные теги — по-английски.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'html-09-final-proekt',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: '9-dars. Yakuniy HTML loyiha',
    ru: 'Урок 9. Финальный HTML-проект',
    en: 'Lesson 9. The final HTML project'
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
  inspector: L3('Qoida', 'Правило', 'Rule'),
  repair: L3("Ta'mirlash", 'Починить', 'Repair'),
  map: L3('Kurs xaritasi', 'Карта курса', 'Course map'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi kurs', 'Следующий курс', 'Next course'),
  next: L3('CSS', 'CSS', 'CSS'),
  turn: L3('Aylantirish', 'Превратить', 'Transform'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  tab: L3('Yorliq', 'Вкладка', 'Tab'),
  win: L3('Oyna', 'Окно', 'Window'),
  mySite: L3('Mening saytim', 'Мой сайт', 'My site'),
  hello: L3('Salom, dunyo!', 'Привет, мир!', 'Hello, world!'),
  play: L3("O'ynash", 'Играть', 'Play'),
  noTags: L3("Bu yerga faqat so'z yozing, burchakli qavslar kerak emas.", 'Здесь нужны только слова, без угловых скобок.', 'Only words here, no angle brackets.'),
  hintN: L3('Yordam', 'Подсказка', 'Hint'),
  up: L3('Yuqoriga', 'Вверх', 'Up'),
  down: L3('Pastga', 'Вниз', 'Down'),
  finish: L3('Kursni tugatish', 'Завершить курс', 'Finish the course')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, found …; печатаются: eyebrow, ask, card, site, stations.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Станции — уроки курса (печатаются на карте и в быстром раунде).
  stations: [
    L3('Sahifa tuzilishi', 'Структура страницы', 'Page structure'),
    L3('Sarlavhalar', 'Заголовки', 'Headings'),
    L3("Ro'yxatlar", 'Списки', 'Lists'),
    L3('Havolalar', 'Ссылки', 'Links'),
    L3('Rasmlar', 'Картинки', 'Images'),
    L3('Formalar, 1-qism', 'Формы, часть 1', 'Forms, part 1'),
    L3('Formalar, 2-qism', 'Формы, часть 2', 'Forms, part 2'),
    L3('Sayt tuzilishi', 'Структура сайта', 'Site structure')
  ],
  // Сайт Коди — содержимое страниц в браузере (не звучит).
  site: {
    title: L3('Kodining sayti', 'Сайт Коди', 'Kodi’s site'),
    hello: L3('Salom! Bu mening saytim.', 'Привет! Это мой сайт.', 'Hi! This is my site.'),
    recipe: L3('Osh retsepti', 'Рецепт плова', 'Plov recipe'),
    recipeP: L3("Guruch, go'sht va sabzi kerak bo'ladi.", 'Нужны рис, мясо и морковь.', 'You need rice, meat and carrots.'),
    stepsH: L3('Qanday pishiriladi', 'Как готовить', 'How to cook'),
    steps: L3(['Guruchni yuving', "Sabzini to'g'rang", 'Hammasini qozonga soling'], ['Промой рис', 'Нарежь морковь', 'Сложи всё в казан'], ['Wash the rice', 'Chop the carrots', 'Put it all in the pot']),
    menu: L3(['Bosh sahifa', "O'yinlar", 'Osh'], ['Главная', 'Игры', 'Плов'], ['Home', 'Games', 'Plov']),
    altOsh: L3('Osh', 'Плов', 'Plov'),
    altCat: L3('Mushuk', 'Кот', 'Cat'),
    capPass: L3('Parol:', 'Пароль:', 'Password:'),
    club: L3("O'yinlar klubi", 'Клуб игр', 'Games club'),
    gallery: L3('Galereya', 'Галерея', 'Gallery'),
    galleryP: L3('Bu yerda hamma rasmlar turibdi.', 'Здесь все картинки.', 'All the pictures are here.'),
    games: L3(['Minecraft', 'Futbol'], ['Minecraft', 'Футбол'], ['Minecraft', 'Football']),
    send: L3('Yuborish', 'Отправить', 'Send'),
    foot: L3('© 2026 Kodining sayti', '© 2026 Сайт Коди', '© 2026 Kodi’s site')
  },
  s1: {
    eyebrow: L3('Glitch!', 'Глитч!', 'Glitch!'),
    say: L3("Voy! Saytimga glitch kelib, hammasini buzib ketdi! Qarang: sarlavha juda kichkina, rasm o'rnida faqat so'z, ro'yxatda raqam yo'q, havola bosilmaydi, parol esa ochiq ko'rinib turibdi. Bu saytni biz sakkiz dars davomida birga yasagan edik. Yordam bering, uni ta'mirlaymiz! «Ta'mirlash» tugmasini bosing.",
      'Ой! На мой сайт налетел глитч и всё сломал! Смотри: заголовок крошечный, вместо картинки одно слово, в списке нет номеров, ссылка не нажимается, а пароль виден всем. Этот сайт мы строили вместе восемь уроков. Помоги его починить! Нажми «Починить».',
      'Oh no! A glitch hit my site and broke everything! Look: the heading is tiny, there’s just a word instead of the picture, the list has no numbers, a link doesn’t work, and the password is visible to everyone. We built this site together over eight lessons. Help me repair it! Tap “Repair”.'),
    magic: L3("Mana, kurs xaritasi: sakkizta bekat, har bir darsga bitta. Har bir bekatda bitta buzuqlikni tuzatamiz va bekat yonadi.", 'Вот карта курса: восемь станций, по одной на урок. На каждой станции чиним одну поломку — и станция загорается.', 'Here’s the course map: eight stations, one per lesson. At each station we fix one break, and the station lights up.'),
    done: L3("Lekin oldin kichik topishmoq. Menimcha, glitch hammasini buzgani uchun saytni butunlay o'chirib, boshidan yozish kerak. Xo'sh, siz nima deb o'ylaysiz, men haqmanmi? Javobni oxirida birga topamiz. Birinchi bekatga o'tamiz!",
      'Но сначала маленькая загадка. По-моему, раз глитч сломал всё, сайт надо целиком стереть и написать заново. Ну как думаешь, я прав? Ответ найдём вместе в конце. Вперёд, к первой станции!',
      'But first, a little riddle. I think that since the glitch broke everything, we should delete the whole site and write it again from scratch. So what do you think, am I right? We’ll find the answer together at the end. On to the first station!'),
    ask: L3('«Ta\'mirlash» tugmasini bosing', 'Нажми «Починить»', 'Tap “Repair”'),
    askDone: L3("Sakkizta bekat — sakkizta dars", 'Восемь станций — восемь уроков', 'Eight stations, eight lessons')
  },
  s2: {
    eyebrow: L3('1-bekat · Tuzilish', 'Станция 1 · Каркас', 'Station 1 · Structure'),
    say: L3("Birinchi bekat. Glitch sahifaning karkasini sochib yubordi. Esingizdami: html ichida oldin head keladi, uning ichida sahifa nomi bo'ladi, keyin esa body keladi. Bo'laklarni to'g'ri tartibda qo'ying. Bitta bo'lak esa ortiqcha.",
      'Первая станция. Глитч рассыпал каркас страницы. Помнишь: внутри html сначала head, в нём название страницы, а потом body. Поставь куски по порядку. А один кусок лишний.',
      'First station. The glitch scattered the page’s frame. Remember: inside html, head comes first with the page title in it, and then body. Put the pieces in order. And one piece isn’t needed.'),
    why: {
      header: L3("header sahifaning ko'rinadigan tepasi bo'ladi va body ichida turadi. Bu yerda boshqa teg kerak.", 'header — видимый верх страницы, он внутри body. Здесь нужен другой тег.', 'header is the visible top of the page, and it goes inside body. A different tag goes here.'),
      head: L3("html ichida birinchi bo'lib head ochiladi.", 'Внутри html сначала открывается head.', 'Inside html, head opens first.'),
      title: L3("head ichida sahifa nomi turadi: title.", 'Внутри head — название страницы: title.', 'Inside head goes the page title: title.'),
      headc: L3("Sahifa nomidan keyin head yopiladi.", 'После названия страницы head закрывается.', 'After the page title, head closes.'),
      body: L3("Oxirida sahifaning ko'rinadigan qismi keladi: body.", 'В конце — видимая часть страницы: body.', 'At the end comes the visible part of the page: body.')
    },
    hints: [
      L3('html ichida nima birinchi keladi?', 'Что идёт первым внутри html?', 'What comes first inside html?'),
      L3("Oldin head va uning ichida title, keyin body.", 'Сначала head и в нём title, потом body.', 'First head with title inside it, then body.'),
      L3("Tartib shunday bo'ladi: head, title, yopuvchi head va body. header kerak emas.", 'Порядок такой: head, title, закрывающий head и body. header не нужен.', 'The order is: head, title, closing head and body. No header.')
    ],
    ok: L3("Zo'r! Karkas joyida: yorliqda sahifa nomi, oynada esa sahifa chiqdi. Birinchi bekat yondi!", 'Огонь! Каркас на месте: на вкладке название, в окне страница. Первая станция горит!', 'Awesome! The frame is in place: the title is on the tab, and the page is in the window. The first station is lit!'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s3: {
    eyebrow: L3('2-bekat · Sarlavha', 'Станция 2 · Заголовок', 'Station 2 · Heading'),
    say: L3("Ikkinchi bekat. Retsept sarlavhasi juda kichkina bo'lib qoldi, chunki glitch uni h6 qilib qo'ydi. Esingizdami: eng katta, asosiy sarlavha qaysi teg bo'ladi? Teg nomini yozing va «Tekshirish»ni bosing.",
      'Вторая станция. Заголовок рецепта стал крошечным: глитч сделал его h6. Помнишь, какой тег у самого большого, главного заголовка? Впиши имя тега и нажми «Проверить».',
      'Second station. The recipe heading became tiny: the glitch turned it into h6. Remember which tag is the biggest, main heading? Type the tag name and tap “Check”.'),
    msgs: {
      empty: L3('Burchakli qavslar o\'rtasiga teg nomini yozing.', 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslar joyida turibdi. Bu yerga faqat teg nomini yozing.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      small: L3("Bu ham sarlavha, lekin eng kattasi emas. Raqam qancha kichik bo'lsa, sarlavha shuncha katta bo'ladi.", 'Это тоже заголовок, но не самый большой. Чем меньше цифра, тем больше заголовок.', 'That’s a heading too, but not the biggest. The smaller the number, the bigger the heading.'),
      p: L3("p abzas yasaydi. Bizga sarlavha kerak.", 'p делает абзац. А нам нужен заголовок.', 'p makes a paragraph. We need a heading.'),
      other: L3("Bunday sarlavha tegi yo'q. Sarlavhalar h harfi va raqam bilan yoziladi.", 'Такого тега заголовка нет. Заголовки пишут буквой h и цифрой.', 'There’s no such heading tag. Headings are the letter h and a number.')
    },
    hints: [
      L3('Sarlavhalar qaysi harf bilan boshlanadi?', 'С какой буквы начинаются заголовки?', 'What letter do headings start with?'),
      L3("Raqam qancha kichik bo'lsa, sarlavha shuncha katta bo'ladi.", 'Чем меньше цифра, тем больше заголовок.', 'The smaller the number, the bigger the heading.'),
      L3("Asosiy sarlavha h1 bo'ladi. Shuni yozing.", 'Главный заголовок — h1. Впиши его.', 'The main heading is h1. Type it.')
    ],
    ok: L3("Barakalla! Sarlavha yana katta bo'ldi. Ikkinchi bekat yondi!", 'Молодец! Заголовок снова большой. Вторая станция горит!', 'Well done! The heading is big again. The second station is lit!'),
    ask: L3('Asosiy sarlavha tegini yozing', 'Впиши тег главного заголовка', 'Type the main heading tag')
  },
  s4: {
    eyebrow: L3("3-bekat · Ro'yxat", 'Станция 3 · Список', 'Station 3 · List'),
    say: L3("Uchinchi bekat. Osh pishirish qadamlari ketma-ket bajariladi, lekin ro'yxatda raqam o'rniga nuqtalar turibdi. Esingizdami: qaysi teg ro'yxatni raqamlaydi? To'g'ri tegni tanlang.",
      'Третья станция. Шаги готовки плова идут по порядку, а в списке вместо номеров точки. Помнишь, какой тег нумерует список? Выбери нужный тег.',
      'Third station. The steps for cooking plov go in order, but the list has dots instead of numbers. Remember which tag numbers a list? Choose the right tag.'),
    why: {
      ul: L3("Hozir ro'yxat aynan shu teg bilan yozilgan, shuning uchun nuqtalar turibdi.", 'Список сейчас как раз с этим тегом — поэтому точки.', 'The list already uses this tag; that’s why there are dots.'),
      li: L3("li ro'yxatdagi bitta band bo'ladi. Butun ro'yxat uchun boshqa teg kerak.", 'li — один пункт списка. Для всего списка нужен другой тег.', 'li is one item in a list. The whole list needs a different tag.')
    },
    ok: L3("Ajoyib! Qadamlar raqamlandi. Uchinchi bekat yondi!", 'Отлично! Шаги пронумерованы. Третья станция горит!', 'Great! The steps are numbered. The third station is lit!'),
    ask: L3("Raqamli ro'yxat tegini tanlang", 'Выбери тег нумерованного списка', 'Choose the numbered list tag'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило, 3 — причина и какой тег выбрать.
    hint1: L3("Brauzerga qarang: qadamlar oldida nima turibdi, nuqtami yoki raqam?", 'Посмотри на браузер: что стоит перед шагами — точки или номера?', 'Look at the browser: what is in front of the steps, dots or numbers?'),
    hint2: L3("Butun ro'yxatni tashqi teg belgilaydi: biri nuqta qo'yadi, boshqasi raqam. li esa faqat bitta band bo'ladi.", 'Весь список задаёт внешний тег: один ставит точки, другой — номера. А li — только один пункт.', 'The outer tag sets the whole list: one adds dots, the other numbers. And li is just one item.'),
    why3: L3("Qadamlar ketma-ket bajariladi, shuning uchun ularga raqam kerak. Raqamni ol tegi qo'yadi.", 'Шаги идут по порядку, значит, им нужны номера. Номера ставит тег ol.', 'The steps go in order, so they need numbers. The ol tag adds numbers.')
  },
  s5: {
    eyebrow: L3('4-bekat · Havola', 'Станция 4 · Ссылка', 'Station 4 · Link'),
    say: L3("To'rtinchi bekat. Menyuda bitta so'z bosilmaydi: u ko'k emas, tagida chiziq ham yo'q. Esingizdami: havolaga manzil kerak. Kodda qaysi qatorda manzil yo'q? O'sha qatorni bosing.",
      'Четвёртая станция. В меню одно слово не нажимается: оно не синее и не подчёркнуто. Помнишь: ссылке нужен адрес. В какой строке кода нет адреса? Нажми эту строку.',
      'Fourth station. One word in the menu doesn’t work: it isn’t blue or underlined. Remember: a link needs an address. Which line of code has no address? Tap that line.'),
    fine: L3("Bu havola ko'k, demak, u ishlaydi. Qaysi so'z oddiy matn bo'lib qolgan?", 'Эта ссылка синяя — значит, работает. Какое слово осталось простым текстом?', 'This link is blue, so it works. Which word is still plain text?'),
    ok: L3("Topdingiz! Unda href yo'q edi. Endi O'yinlar ham havola bo'ldi. To'rtinchi bekat yondi!", 'Есть! У неё не было href. Теперь «Игры» тоже ссылка. Четвёртая станция горит!', 'Found it! It had no href. Now Games is a link too. The fourth station is lit!'),
    ask: L3("Manzili yo'q qatorni bosing", 'Нажми строку без адреса', 'Tap the line with no address')
  },
  s6: {
    eyebrow: L3('5-bekat · Rasm', 'Станция 5 · Картинка', 'Station 5 · Picture'),
    say: L3("Beshinchi bekat. Galereyada rasm o'rnida faqat Mushuk degan so'z turibdi. Glitch fayl atributining nomini o'chirib yuboribdi. Esingizdami: rasm faylini qaysi atribut aytadi? Uni bo'sh joyga olib boring.",
      'Пятая станция. В галерее вместо картинки только слово «Кот». Глитч стёр имя атрибута файла. Помнишь, какой атрибут задаёт файл картинки? Перетащи его в пустое место.',
      'Fifth station. In the gallery there’s only the word Cat instead of the picture. The glitch erased the name of the file attribute. Remember which attribute gives the picture file? Drag it into the empty spot.'),
    why: {
      href: L3("href havola manzili uchun bo'ladi. Rasm uchun boshqa atribut kerak.", 'href — для адреса ссылки. Картинке нужен другой атрибут.', 'href is for a link’s address. A picture needs a different attribute.'),
      alt: L3("alt kodda bor, u rasmni so'z bilan tasvirlaydi. Faylni boshqa atribut aytadi.", 'alt в коде уже есть, он описывает картинку словами. Файл задаёт другой атрибут.', 'alt is already in the code; it describes the picture in words. Another attribute gives the file.')
    },
    ok: L3("Qoyil! Mushuk rasmi qaytdi. Beshinchi bekat yondi!", 'Класс! Кот вернулся. Пятая станция горит!', 'Brilliant! The cat is back. The fifth station is lit!'),
    ask: L3("Fayl atributini bo'sh joyga olib boring", 'Перетащи атрибут файла в пустое место', 'Drag the file attribute into the empty spot'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): на третьей нужный кусок загорается.
    hints: [
      L3("Brauzerga qarang: rasm o'rnida faqat so'z turibdi. Kodda qaysi atributning nomi yo'q?", 'Посмотри на браузер: вместо картинки только слово. Имени какого атрибута не хватает в коде?', 'Look at the browser: there’s only a word instead of the picture. Which attribute’s name is missing in the code?'),
      L3("Bo'sh joydan keyin fayl nomi turibdi: mushuk.jpg. Rasm faylini qaysi atribut aytardi, esingizdami?", 'После пустого места стоит имя файла mushuk.jpg. Помнишь, какой атрибут задаёт файл картинки?', 'Right after the empty spot is the file name mushuk.jpg. Remember which attribute gives the picture file?'),
      L3("Rasm faylini src atributi aytadi. Yonib turgan src bo'lagini bo'sh joyga olib boring.", 'Файл картинки задаёт атрибут src. Перетащи горящий src в пустое место.', 'The src attribute gives the picture file. Drag the glowing src into the empty spot.')
    ]
  },
  s7: {
    eyebrow: L3('6-bekat · Parol', 'Станция 6 · Пароль', 'Station 6 · Password'),
    say: L3("Oltinchi bekat. Klub anketasida parol hammaga ochiq ko'rinib turibdi, chunki maydon turi o'chib ketgan. Esingizdami: parolni nuqtalar ortiga qaysi tur yashiradi? Uni qo'shtirnoq ichiga yozing.",
      'Шестая станция. В анкете клуба пароль виден всем: стёрся вид поля. Помнишь, какой вид прячет пароль за точками? Впиши его в кавычки.',
      'Sixth station. In the club form the password is visible to everyone, because the field’s kind was erased. Remember which kind hides a password behind dots? Type it in the quotes.'),
    msgs: {
      empty: L3("Qo'shtirnoq ichiga maydon turini yozing.", 'Впиши вид поля в кавычки.', 'Type the field’s kind in the quotes.'),
      text: L3("text bilan maydon oddiy bo'ladi va parol ochiq qoladi.", 'С text поле обычное, и пароль остаётся виден.', 'With text the field is ordinary, and the password stays visible.'),
      number: L3("number faqat son uchun bo'ladi. U parolni yashirmaydi.", 'number — только для числа. Пароль он не прячет.', 'number is only for numbers. It doesn’t hide the password.'),
      typo: L3("Bunday tur yo'q, shuning uchun brauzer oddiy maydon qildi. So'zni harfma-harf yozing.", 'Такого вида нет, поэтому браузер сделал обычное поле. Напиши слово буква в букву.', 'There’s no such kind, so the browser made an ordinary field. Type the word letter by letter.')
    },
    hints: [
      L3('Maydon turi parolni qanday yashiradi?', 'Какой вид поля прячет пароль?', 'Which field kind hides a password?'),
      L3("U inglizcha, ya'ni parol degani.", 'Это английское слово, то есть «пароль».', 'It’s the English word for password.'),
      L3("Tur password bo'ladi. Uni qo'shtirnoq ichiga yozing.", 'Вид — password. Впиши его в кавычки.', 'The kind is password. Type it in the quotes.')
    ],
    ok: L3("Zo'r! Parol yana nuqtalar ortida. Oltinchi bekat yondi!", 'Огонь! Пароль снова за точками. Шестая станция горит!', 'Awesome! The password is behind dots again. The sixth station is lit!'),
    ask: L3('Parol maydonining turini yozing', 'Впиши вид поля пароля', 'Type the password field’s kind')
  },
  s8: {
    eyebrow: L3('7-bekat · Anketa', 'Станция 7 · Анкета', 'Station 7 · Form'),
    say: L3("Yettinchi bekat. Glitch anketa qismlarining nomlarini aralashtirib yubordi. Har bir tegni sahifadagi o'z narsasi bilan juftlang: ro'yxat, variant, katta maydon va tugma. Oldin tegni bosing, keyin narsani bosing.",
      'Седьмая станция. Глитч перепутал названия частей анкеты. Соедини каждый тег с его вещью на странице: список, вариант, большое поле и кнопка. Сначала нажми тег, потом вещь.',
      'Seventh station. The glitch mixed up the names of the form’s parts. Match each tag with its thing on the page: the list, a choice, the big field and the button. Tap a tag first, then the thing.'),
    cards: {
      select: L3("Ochiladigan ro'yxat", 'Выпадающий список', 'A drop-down list'),
      option: L3("Ro'yxatdagi bitta variant", 'Один вариант в списке', 'One choice in the list'),
      textarea: L3('Katta matn maydoni', 'Большое поле', 'A big text field'),
      button: L3('Tugma', 'Кнопка', 'A button')
    },
    pairOk: {
      select: L3("To'g'ri! select ro'yxat yasaydi.", 'Верно! select делает список.', 'Right! select makes the list.'),
      option: L3("To'g'ri! option bitta variant bo'ladi.", 'Верно! option — один вариант.', 'Right! option is one choice.'),
      textarea: L3("To'g'ri! textarea katta maydon yasaydi.", 'Верно! textarea делает большое поле.', 'Right! textarea makes a big field.'),
      button: L3("To'g'ri! button tugma yasaydi.", 'Верно! button делает кнопку.', 'Right! button makes a button.')
    },
    why: {
      select: L3("select butun ro'yxatni yasaydi: yonida strelkasi bor maydon.", 'select делает весь список: поле со стрелкой.', 'select makes the whole list: a field with an arrow.'),
      option: L3("option ro'yxat ichidagi bitta qator bo'ladi.", 'option — одна строка внутри списка.', 'option is one line inside the list.'),
      textarea: L3("textarea bir nechta qatorli maydon bo'ladi.", 'textarea — поле на несколько строк.', 'textarea is a field for several lines.'),
      button: L3("button bosiladigan tugma bo'ladi.", 'button — кнопка, которую нажимают.', 'button is a button you tap.')
    },
    hints: [
      L3("Har bir narsaga qarang: u ro'yxatmi, maydonmi yoki tugmami?", 'Посмотри на каждую вещь: это список, поле или кнопка?', 'Look at each thing: is it a list, a field or a button?'),
      L3("Strelkali maydon select, uning ichidagi bitta qator esa option bo'ladi.", 'Поле со стрелкой — select, а одна строка в нём — option.', 'The field with an arrow is select, and one line inside it is option.'),
      L3("Strelkali maydon select, bitta qator option, katta maydon textarea, tugma esa button bo'ladi.", 'Поле со стрелкой — select, строка — option, большое поле — textarea, кнопка — button.', 'The field with an arrow is select, a line is option, the big field is textarea, and the button is button.')
    ],
    ok: L3("Barakalla! Anketa yana tartibda. Yettinchi bekat yondi!", 'Молодец! Анкета снова в порядке. Седьмая станция горит!', 'Well done! The form is in order again. The seventh station is lit!'),
    ask: L3("Tegni o'z narsasi bilan juftlang", 'Соедини тег с его вещью', 'Match each tag with its thing'),
    askPlace: L3('Endi narsani bosing', 'Теперь нажми вещь', 'Now tap the thing'),
    pickFirst: L3('Oldin tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.')
  },
  s9: {
    eyebrow: L3('8-bekat · Sayt qismlari', 'Станция 8 · Части сайта', 'Station 8 · Site parts'),
    say: L3("Oxirgi bekat. Inspektorga qarang: asosiy qism va sayt oxiri ramkada, tepasida esa ramka yo'q. Glitch sayt tepasini head tegiga o'rab qo'yibdi. Esingizdami: sayt tepasi qaysi teg bo'ladi? To'g'ri tegni tanlang.",
      'Последняя станция. Посмотри на Инспектор: главная часть и низ сайта в рамках, а у верха рамки нет. Глитч обернул верх сайта в тег head. Помнишь, какой тег у верха сайта? Выбери нужный тег.',
      'Last station. Look at the Inspector: the main part and the bottom of the site have frames, but the top doesn’t. The glitch wrapped the top of the site in the head tag. Remember which tag the top of the site uses? Choose the right tag.'),
    why: {
      head: L3("head sahifa haqidagi ko'rinmas ma'lumot uchun bo'ladi. Hozir aynan u xato turibdi.", 'head — для невидимых сведений о странице. Сейчас как раз он стоит по ошибке.', 'head is for invisible information about the page. It’s exactly what’s wrongly there now.'),
      h1: L3("h1 bu sarlavha, u ichkarida allaqachon bor. Butun sayt tepasi uchun boshqa teg kerak.", 'h1 — это заголовок, он уже внутри. Для всего верха сайта нужен другой тег.', 'h1 is a heading, and it’s already inside. The whole top of the site needs a different tag.')
    },
    ok: L3("Ajoyib! Inspektor sayt tepasini yana ko'rdi. Sakkizinchi bekat ham yondi!", 'Отлично! Инспектор снова видит верх сайта. Горит и восьмая станция!', 'Great! The Inspector sees the top of the site again. The eighth station is lit too!'),
    ask: L3('Sayt tepasi tegini tanlang', 'Выбери тег верха сайта', 'Choose the tag for the top of the site'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило, 3 — причина и какой тег выбрать.
    hint1: L3("Inspektorga qarang: qaysi qismda ramka yo'q?", 'Посмотри на Инспектор: у какой части нет рамки?', 'Look at the Inspector: which part has no frame?'),
    hint2: L3("head ko'rinmas ma'lumot uchun, h1 esa bitta sarlavha. Bizga sayt tepasini butunligicha o'raydigan qism tegi kerak.", 'head — для невидимых сведений, а h1 — один заголовок. Нужен тег части, который обнимает весь верх сайта.', 'head is for invisible information, and h1 is one heading. We need the part tag that wraps the whole top of the site.'),
    why3: L3("Sayt tepasi header tegi bo'ladi: unda sarlavha va menyu turadi.", 'Верх сайта — это тег header: в нём заголовок и меню.', 'The top of the site is the header tag: it holds the heading and the menu.')
  },
  s10: {
    eyebrow: L3('Aralash vazifa', 'Смешанное задание', 'Mixed task'),
    say: L3("Hamma bekatlar yondi! Endi qiyinroq vazifa: ikkita bilimni birlashtiramiz. Mushuk rasmini havolaga aylantiring: rasmni bossangiz, galereya ochilsin. Buning uchun rasmni a tegi ichiga qo'yish kerak. Bo'laklarni tartib bilan qo'ying.",
      'Все станции горят! Теперь задание посложнее: соединим два умения. Сделай картинку с котом ссылкой — нажмёшь на картинку, и откроется галерея. Для этого картинку ставят внутрь тега a. Поставь куски по порядку.',
      'All the stations are lit! Now a harder task: let’s combine two skills. Turn the cat picture into a link, so tapping the picture opens the gallery. To do that, you put the picture inside the a tag. Put the pieces in order.'),
    why: {
      imgc: L3("img tegida yopuvchi teg bo'lmaydi. Bu bo'lak ortiqcha.", 'У img нет закрывающего тега. Этот кусок лишний.', 'img has no closing tag. This piece isn’t needed.'),
      aopen: L3("Oldin havola ochiladi: a tegi va uning manzili.", 'Сначала открывается ссылка: тег a и её адрес.', 'First the link opens: the a tag with its address.'),
      img: L3("Havola ichida rasm turadi.", 'Внутри ссылки стоит картинка.', 'The picture goes inside the link.'),
      aclose: L3("Oxirida havola yopiladi.", 'В конце ссылка закрывается.', 'At the end the link closes.')
    },
    hints: [
      L3('Rasm nimaning ichida turishi kerak?', 'Внутри чего должна стоять картинка?', 'What should the picture be inside?'),
      L3("Oldin a ochiladi, keyin rasm keladi.", 'Сначала открывается a, потом картинка.', 'First a opens, then the picture.'),
      L3("Tartib shunday bo'ladi: ochuvchi a, img va yopuvchi a. Yopuvchi img kerak emas.", 'Порядок такой: открывающий a, img и закрывающий a. Закрывающий img не нужен.', 'The order is: the opening a, img and the closing a. No closing img.')
    ],
    ok: L3("Vau, zo'r! Rasm havolaga aylandi. Bosib ko'ring: galereya ochiladi.", 'Вау, класс! Картинка стала ссылкой. Нажми на неё — откроется галерея.', 'Wow, awesome! The picture is now a link. Tap it and the gallery opens.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order'),
    askTap: L3('Rasmni bosib ko\'ring', 'Нажми на картинку', 'Tap the picture'),
    askOpened: L3('Galereya ochildi!', 'Галерея открылась!', 'The gallery opened!')
  },
  s11: {
    eyebrow: L3('Katta sinov', 'Большое испытание', 'The big test'),
    say: L3("Endi katta sinov! Glitch bitta sahifada beshta xato qoldirdi. Brauzerga qarang va har bir xatoni toping. Xato bor qatorni bosing, u o'zi tuzaladi. Qaysi tartibda topishingiz muhim emas.",
      'А теперь большое испытание! Глитч оставил на одной странице пять ошибок. Посмотри на браузер и найди каждую. Нажми строку с ошибкой — она починится сама. Порядок не важен.',
      'Now the big test! The glitch left five bugs on one page. Look at the browser and find each one. Tap a line with a bug and it fixes itself. The order doesn’t matter.'),
    fine: L3("Bu qator to'g'ri yozilgan. Brauzerga qarang: yana nima noto'g'ri ko'rinyapti?", 'Эта строка в порядке. Посмотри на браузер: что ещё выглядит не так?', 'This line is fine. Look at the browser: what else looks wrong?'),
    found: {
      h: L3("Topdingiz! h6 o'rniga h1 bo'lishi kerak edi.", 'Есть! Вместо h6 должен быть h1.', 'Found it! It should be h1, not h6.'),
      img: L3("Topdingiz! Rasmga href emas, src kerak edi.", 'Есть! Картинке нужен не href, а src.', 'Found it! A picture needs src, not href.'),
      li: L3("Topdingiz! Sabzi qadamida li yo'q edi, shuning uchun raqami ham yo'q edi.", 'Есть! У шага про морковь не было li, поэтому не было и номера.', 'Found it! The carrot step had no li, so it had no number either.'),
      a: L3("Topdingiz! Havolada href yo'q edi.", 'Есть! У ссылки не было href.', 'Found it! The link had no href.'),
      pass: L3("Topdingiz! Parol maydonining turi password bo'lishi kerak edi.", 'Есть! У поля пароля вид должен быть password.', 'Found it! The password field’s kind should be password.')
    },
    hints: [
      L3("Brauzerga qarang: nima kichkina, nima yo'q, nima ochiq turibdi?", 'Посмотри на браузер: что крошечное, чего нет, что видно всем?', 'Look at the browser: what’s tiny, what’s missing, what’s visible to everyone?'),
      L3("Sarlavha, rasm, ro'yxat, havola va parolni birma-bir tekshiring.", 'Проверь по очереди заголовок, картинку, список, ссылку и пароль.', 'Check the heading, the picture, the list, the link and the password one by one.'),
      L3("Yonib turgan qatorga qarang: xato o'sha yerda.", 'Посмотри на горящую строку: ошибка там.', 'Look at the lit line: the bug is there.')
    ],
    ok: L3("Ajoyib! Beshala xato ham topildi. Siz haqiqiy dasturchi kabi ishladingiz!", 'Супер! Все пять ошибок найдены. Ты работаешь как настоящий программист!', 'Super! All five bugs are found. You worked like a real programmer!'),
    ask: L3('Xato bor qatorlarni bosing', 'Нажимай строки с ошибками', 'Tap the lines with bugs')
  },
  q1: {
    eyebrow: L3('Tezkor savollar', 'Быстрый раунд', 'Quick round'),
    say: L3("Oxirgi sinov: tezkor savollar. Men bitta gap aytaman, siz esa u to'g'ri yoki noto'g'ri ekanini tanlaysiz.", 'Последнее испытание — быстрый раунд. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test: a quick round. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — общая, 2 — своя у каждой фразы (h), 3 — причина и ответ.
    hint1: L3("Kartochkadagi bekat nomiga qarang: gap kursning qaysi mavzusi haqida?", 'Посмотри на название станции на карточке: о какой теме курса эта фраза?', 'Look at the station name on the card: which topic of the course is the sentence about?'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    items: [
      { st: 0, t: L3("title ichidagi yozuv sahifaning o'zida katta sarlavha bo'lib chiqadi.", 'Текст в title появляется на самой странице большим заголовком.', 'The text in title shows on the page itself as a big heading.'), right: false,
        why: L3("title yozuvi brauzer yorlig'ida ko'rinadi. Sahifadagi sarlavhani h1 yasaydi.", 'Текст title виден на вкладке браузера. Заголовок на странице делает h1.', 'The title text shows on the browser tab. h1 makes the heading on the page.'),
          h: L3("title yozuvi qayerda ko'rinardi, esingizdami: sahifaning o'zidami yoki brauzer yorlig'idami?", 'Помнишь, где виден текст title: на самой странице или на вкладке браузера?', 'Remember where the title text shows: on the page itself or on the browser tab?') },
      { st: 2, t: L3("ol tegi ro'yxatni raqamlaydi.", 'Тег ol нумерует список.', 'The ol tag numbers a list.'), right: true,
        why: L3("ol tartibli ro'yxat bo'ladi: har bir bandga raqam qo'yiladi.", 'ol — нумерованный список: у каждого пункта номер.', 'ol is an ordered list: each item gets a number.'),
          h: L3("Ro'yxatning ikki turi bor edi: biri nuqta qo'yadi, boshqasi raqam. ol qaysi biri edi?", 'Списков было два вида: один ставит точки, другой — номера. Какой из них ol?', 'There were two kinds of lists: one adds dots, the other numbers. Which one is ol?') },
      { st: 4, t: L3('img yopuvchi teg bilan yoziladi.', 'img пишут с закрывающим тегом.', 'img is written with a closing tag.'), right: false,
        why: L3("img tegining yopuvchi tegi bo'lmaydi.", 'У img нет закрывающего тега.', 'img has no closing tag.'),
          h: L3("Ba'zi teglar ichiga matn yozilmaydi, ular faqat ochuvchi bo'ladi. img ichiga biror narsa yoziladimi?", 'Внутрь некоторых тегов ничего не пишут — они бывают только открывающими. В img что-то пишут внутри?', 'Some tags hold no text inside, so they are opening tags only. Do you write anything inside img?') },
      { st: 5, t: L3("label yozuvini bossangiz, maydon yozishga tayyor bo'ladi.", 'Если нажать на подпись в label, поле готово к вводу.', 'If you tap the caption in label, the field is ready for typing.'), right: true,
        why: L3("label yozuvni maydonga bog'laydi.", 'label связывает подпись с полем.', 'label ties the caption to the field.'),
          h: L3("label maydonning yozuvi bo'ladi. Yozuv maydonga bog'langan bo'lsa, uni bossangiz nima bo'lardi?", 'label — подпись поля. Что будет, если нажать на подпись, связанную с полем?', 'label is a field’s caption. What happens if you tap a caption tied to the field?') },
      { st: 7, t: L3('footer sayt oxirini bildiradi.', 'footer — это низ сайта.', 'footer marks the bottom of the site.'), right: true,
        why: L3("footer sayt oxiri bo'ladi: unda odatda mualliflik va aloqa turadi.", 'footer — низ сайта: там обычно авторство и контакты.', 'footer is the bottom of the site: it usually holds the copyright and contacts.'),
          h: L3("Saytning uch qismi bor edi: tepasi, asosiy qismi va oxiri. footer qaysi biri edi?", 'У сайта три части: верх, главная часть и низ. Какая из них footer?', 'A site has three parts: the top, the main part and the bottom. Which one is footer?') }
    ],
    ok: L3("Hammasi to'g'ri! Siz butun kursni yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь весь курс.', 'All correct! You know the whole course really well.')
  },
  s12: {
    eyebrow: L3('Kurs tugadi', 'Курс пройден', 'Course complete'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men saytni o'chirib, boshidan yozish kerak deb o'ylagan edim? Afsuski, men adashibman. Siz har bir sahifada faqat bitta kichik xatoni tuzatdingiz: bitta teg, bitta atribut yoki bitta qiymatni. Dasturchilar ham shunday ishlaydi: xatoni topib, aynan uni tuzatadi.",
        'Вернёмся к загадке. Помнишь, я думал, что сайт надо стереть и написать заново? Увы, я ошибся. Ты на каждой странице поправил всего одну маленькую ошибку: один тег, один атрибут или одно значение. Программисты так и работают: находят ошибку и чинят именно её.',
        'Back to our riddle. Remember, I thought we had to delete the site and write it again? Sadly, I was wrong. On each page you fixed just one small bug: one tag, one attribute or one value. That’s how programmers work: they find the bug and fix exactly that.'), k: 'riddle' },
      { text: L3("Qarang, saytim yana ishlayapti: sarlavha katta, rasm joyida, qadamlar raqamlangan, havola bosiladi, parol esa yashiringan.", 'Смотри, мой сайт снова работает: заголовок большой, картинка на месте, шаги пронумерованы, ссылка нажимается, а пароль спрятан.', 'Look, my site works again: the heading is big, the picture is in place, the steps are numbered, the link works, and the password is hidden.'), k: null },
      { text: L3("Siz HTML kursini tugatdingiz! Endi sahifa tuzilishi, sarlavhalar, ro'yxatlar, havolalar, rasmlar, formalar va sayt qismlarini bilasiz.", 'Ты прошёл курс HTML! Теперь ты знаешь структуру страницы, заголовки, списки, ссылки, картинки, формы и части сайта.', 'You’ve finished the HTML course! Now you know page structure, headings, lists, links, pictures, forms and the parts of a site.'), k: 'cert' },
      { text: L3("Keyingi kursda CSS bilan saytlarni chiroyli qilamiz: rang, shrift va joylashuv qo'shamiz. Ko'rishguncha!", 'В следующем курсе сделаем сайты красивыми с помощью CSS: добавим цвет, шрифты и расположение. До встречи!', 'In the next course we’ll make sites beautiful with CSS: colors, fonts and layout. See you!'), k: null }
    ],
    certH: L3('HTML kursi', 'Курс HTML', 'HTML course'),
    certT: L3("Sakkizta bekat — hammasi tuzatildi!", 'Восемь станций — всё починено!', 'Eight stations, all repaired!'),
    ask: L3('Saytga qarang', 'Посмотри на сайт', 'Look at the site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { hint1: 1, hint2: 1, why3: 1, why: 1, magic: 1, msgs: 1, fine: 1, found: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { st: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:z9-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:z9.css@*/
`;
