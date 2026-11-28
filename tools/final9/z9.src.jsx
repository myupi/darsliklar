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
    uz: '17-dars. Yakuniy HTML loyiha',
    ru: 'Урок 17. Финальный HTML-проект',
    en: 'Lesson 17. The final HTML project'
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
    say: L3("Falokat: saytimga glitch tushibdi! Bu kompyuterdagi g'alati buzilishning nomi. U hammasini ag'dar-to'ntar qilib ketibdi! Qarang-chi: sarlavha mittigina bo'lib qolgan, rasm o'rnida bitta so'z turibdi, ro'yxatda raqamlar yo'q, havola bosilmaydi, parol esa hammaga ochiq ko'rinib turibdi. Axir bu saytni bu kurs davomida birga qurgan edik-ku! Qani, yordam bering, birga tuzatamiz: «Ta'mirlash» tugmasini bosing.",
      'Ой! На мой сайт налетел глитч и всё сломал! Смотри: заголовок крошечный, вместо картинки одно слово, в списке нет номеров, ссылка не нажимается, а пароль виден всем. Этот сайт мы строили вместе весь курс. Помоги его починить! Нажми «Починить».',
      'Oh no! A glitch hit my site and broke everything! Look: the heading is tiny, there’s just a word instead of the picture, the list has no numbers, a link doesn’t work, and the password is visible to everyone. We built this site together throughout the whole course. Help me repair it! Tap “Repair”.'),
    magic: L3("Mana, glitchdan qutulish yo'li xaritada: xuddi metro liniyasidagidek, sakkizta bekat bor, har bir mavzumizga bittadan. Har bir bekatda bitta buzilgan joyni tuzatamiz, shunda o'sha bekatda chiroq yonadi.", 'Вот карта курса: восемь станций, по одной на тему. На каждой станции чиним одну поломку — и станция загорается.', 'Here’s the course map: eight stations, one per lesson. At each station we fix one break, and the station lights up.'),
    done: L3("Do'stlarimga sayt kechgacha tayyor bo'ladi, deb va'da berganman, vaqt esa juda oz. Shuning uchun eng tez yo'lni o'yladim: hammasini o'chirib, boshidan yozaman, chunki glitch hammasini buzib tashlagan-ku! Siz mening o'rnimda nima qilardingiz? Javobni sakkizta bekatdan o'tgach birga ko'ramiz. Qani, birinchi bekatga!",
      'Но сначала маленькая загадка. По-моему, раз глитч сломал всё, сайт надо целиком стереть и написать заново. Ну как думаешь, я прав? Ответ найдём вместе в конце. Вперёд, к первой станции!',
      'But first, a little riddle. I think that since the glitch broke everything, we should delete the whole site and write it again from scratch. So what do you think, am I right? We’ll find the answer together at the end. On to the first station!'),
    ask: L3('«Ta\'mirlash» tugmasini bosing', 'Нажми «Починить»', 'Tap “Repair”'),
    askDone: L3("Sakkizta bekat — sakkizta mavzu", 'Восемь станций — восемь тем', 'Eight stations, eight topics')
  },
  s2: {
    eyebrow: L3('1-bekat · Tuzilish', 'Станция 1 · Каркас', 'Station 1 · Structure'),
    say: L3("Birinchi bekat, birinchi darsimiz! Glitch sahifaning asosini sochib yuboribdi. Esingizdami, html ichida nima birinchi keladi-yu, nima keyin? Bo'laklarni tartibi bilan joylab chiqing. Ehtiyot bo'ling: bittasining bu yerda umuman ishi yo'q.",
      'Первая станция. Глитч рассыпал каркас страницы. Помнишь: внутри html сначала head, в нём название страницы, а потом body. Поставь куски по порядку. А один кусок лишний.',
      'First station. The glitch scattered the page’s frame. Remember: inside html, head comes first with the page title in it, and then body. Put the pieces in order. And one piece isn’t needed.'),
    why: {
      header: L3("Bu bo'lak bizni aldamoqchi! header sayt boshini o'raydi, u body ichida yashaydi. Bu yerga boshqa teg kerak.", 'header — видимый верх страницы, он внутри body. Здесь нужен другой тег.', 'header is the visible top of the page, and it goes inside body. A different tag goes here.'),
      head: L3("Shoshilmang! html ichida eng birinchi bo'lib head ochiladi.", 'Внутри html сначала открывается head.', 'Inside html, head opens first.'),
      title: L3("head ochilgandan keyin uning ichiga sahifaning nomi keladi, u title tegiga yoziladi.", 'Внутри head — название страницы: title.', 'Inside head goes the page title: title.'),
      headc: L3("Sahifaning nomi yozildi, endi head yopilishi kerak.", 'После названия страницы head закрывается.', 'After the page title, head closes.'),
      body: L3("Eng oxirida sahifaning ko'rinadigan qismi, body keladi.", 'В конце — видимая часть страницы: body.', 'At the end comes the visible part of the page: body.')
    },
    hints: [
      L3("html ochilgandan keyin eng birinchi nima keladi?", 'Что идёт первым внутри html?', 'What comes first inside html?'),
      L3("Oldin head keladi, uning ichida title turadi, keyin esa body.", 'Сначала head и в нём title, потом body.', 'First head with title inside it, then body.'),
      L3("Oldin head ochiladi, ichida title turadi, so'ng head yopilib, body boshlanadi. header bu yerga kerak emas.", 'Порядок такой: head, title, закрывающий head и body. header не нужен.', 'The order is: head, title, closing head and body. No header.')
    ],
    ok: L3("Sahifaning asosi joy-joyiga tushdi: yorliqda sahifaning nomi, oynada esa sahifaning o'zi chiqdi. Birinchi bekat yondi!", 'Огонь! Каркас на месте: на вкладке название, в окне страница. Первая станция горит!', 'Awesome! The frame is in place: the title is on the tab, and the page is in the window. The first station is lit!'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s3: {
    eyebrow: L3('2-bekat · Sarlavha', 'Станция 2 · Заголовок', 'Station 2 · Heading'),
    say: L3("Ikkinchi bekatga keldik. Retseptning sarlavhasi juda kichkina bo'lib qolibdi, chunki glitch uni h6 qilib qo'ygan. Eng katta, asosiy sarlavha qaysi teg bilan yozilardi? Uning nomini yozing-da, «Tekshirish»ni bosing.",
      'Вторая станция. Заголовок рецепта стал крошечным: глитч сделал его h6. Помнишь, какой тег у самого большого, главного заголовка? Впиши имя тега и нажми «Проверить».',
      'Second station. The recipe heading became tiny: the glitch turned it into h6. Remember which tag is the biggest, main heading? Type the tag name and tap “Check”.'),
    msgs: {
      empty: L3("Qavslarning ichi bo'sh qolibdi: sarlavha tegining nomini yozing.", 'Впиши имя тега между уголками.', 'Type the tag name between the brackets.'),
      brackets: L3("Qavslar tayyor, ularni qaytadan yozmang: faqat nom kerak.", 'Скобки уже на месте. Здесь нужно только имя тега.', 'The brackets are already there. Only the tag name goes here.'),
      small: L3("Oz qoldi! Bu ham sarlavha, lekin eng kattasi emas: raqam qancha kichik bo'lsa, sarlavha shuncha katta chiqadi.", 'Это тоже заголовок, но не самый большой. Чем меньше цифра, тем больше заголовок.', 'That’s a heading too, but not the biggest. The smaller the number, the bigger the heading.'),
      p: L3("Unday emas: p abzas yasaydi. Bizga esa sarlavha kerak.", 'p делает абзац. А нам нужен заголовок.', 'p makes a paragraph. We need a heading.'),
      other: L3("Brauzer bunday sarlavha tegini bilmaydi. Sarlavhalar h harfi bilan raqamdan yasaladi.", 'Такого тега заголовка нет. Заголовки пишут буквой h и цифрой.', 'There’s no such heading tag. Headings are the letter h and a number.')
    },
    hints: [
      L3("Sarlavha teglari qaysi harf bilan boshlanardi?", 'С какой буквы начинаются заголовки?', 'What letter do headings start with?'),
      L3("Raqami qancha kichik bo'lsa, sarlavha shuncha katta bo'ladi. Eng kichik raqam qaysi?", 'Чем меньше цифра, тем больше заголовок.', 'The smaller the number, the bigger the heading.'),
      L3("Asosiy sarlavha h1 bo'ladi. Shuni yozing-da, «Tekshirish»ni bosing.", 'Главный заголовок — h1. Впиши его.', 'The main heading is h1. Type it.')
    ],
    ok: L3("Retseptning sarlavhasi yana kap-katta bo'lib qoldi. Xaritada yana bitta chiroq qo'shildi!", 'Молодец! Заголовок снова большой. Вторая станция горит!', 'Well done! The heading is big again. The second station is lit!'),
    ask: L3('Asosiy sarlavha tegini yozing', 'Впиши тег главного заголовка', 'Type the main heading tag')
  },
  s4: {
    eyebrow: L3("3-bekat · Ro'yxat", 'Станция 3 · Список', 'Station 3 · List'),
    say: L3("Uchinchi bekat, osh pishirish! Bu yerda qadamlar bittalab, tartib bilan keladi, lekin ro'yxatda raqam o'rniga nuqtalar turibdi. Ro'yxatni raqamlaydigan teg qaysi edi? Shu tegni tanlang.",
      'Третья станция. Шаги готовки плова идут по порядку, а в списке вместо номеров точки. Помнишь, какой тег нумерует список? Выбери нужный тег.',
      'Third station. The steps for cooking plov go in order, but the list has dots instead of numbers. Remember which tag numbers a list? Choose the right tag.'),
    why: {
      ul: L3("Yo'q, ro'yxat hozir aynan shu teg bilan yozilgan-ku, nuqtalar ham shundan.", 'Список сейчас как раз с этим тегом — поэтому точки.', 'The list already uses this tag; that’s why there are dots.'),
      li: L3("Bu li-ku: u ro'yxatdagi bittagina band. Butun ro'yxat uchun esa boshqa teg kerak.", 'li — один пункт списка. Для всего списка нужен другой тег.', 'li is one item in a list. The whole list needs a different tag.')
    },
    ok: L3("Osh qadamlari bir, ikki, uch deb raqamlanib chiqdi. Uchinchi bekatda ham chiroq yondi!", 'Отлично! Шаги пронумерованы. Третья станция горит!', 'Great! The steps are numbered. The third station is lit!'),
    ask: L3("Raqamli ro'yxat tegini tanlang", 'Выбери тег нумерованного списка', 'Choose the numbered list tag'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило, 3 — причина и какой тег выбрать.
    hint1: L3("Brauzerdagi qadamlarga bir qarang-chi: ularning oldida nuqta turibdimi yoki raqam?", 'Посмотри на браузер: что стоит перед шагами — точки или номера?', 'Look at the browser: what is in front of the steps, dots or numbers?'),
    hint2: L3("Nuqta yoki raqam qo'yishni butun ro'yxatni o'rab turgan teg hal qiladi. li esa faqat bitta bandning tegi.", 'Весь список задаёт внешний тег: один ставит точки, другой — номера. А li — только один пункт.', 'The outer tag sets the whole list: one adds dots, the other numbers. And li is just one item.'),
    why3: L3("Osh qadamlari ketma-ket bajariladi, shuning uchun ularga raqam kerak. Raqamlarni esa ol tegi qo'yadi.", 'Шаги идут по порядку, значит, им нужны номера. Номера ставит тег ol.', 'The steps go in order, so they need numbers. The ol tag adds numbers.')
  },
  s5: {
    eyebrow: L3('4-bekat · Havola', 'Станция 4 · Ссылка', 'Station 4 · Link'),
    say: L3("To'rtinchi bekatda menyu buzilibdi. Undagi bitta so'z bosilmayapti: u ko'k ham emas, tagida chizig'i ham yo'q. Havola ishlashi uchun unga nima kerak edi? Qaysi qatorda shu narsa tushib qolgan? Topib, ustiga bosing.",
      'Четвёртая станция. В меню одно слово не нажимается: оно не синее и не подчёркнуто. Помнишь: ссылке нужен адрес. В какой строке кода нет адреса? Нажми эту строку.',
      'Fourth station. One word in the menu doesn’t work: it isn’t blue or underlined. Remember: a link needs an address. Which line of code has no address? Tap that line.'),
    fine: L3("Bu havola ko'k rangda-ku, demak, u ishlayapti. Bosilmayotgani esa boshqa so'z: uni toping-da, o'sha qatorni bosing.", 'Эта ссылка синяя — значит, работает. Какое слово осталось простым текстом?', 'This link is blue, so it works. Which word is still plain text?'),
    ok: L3("Topdingiz! O'sha qatorda href yo'q edi. Endi «O'yinlar» ham bosiladigan havolaga aylandi. To'rtinchi bekat tayyor!", 'Есть! У неё не было href. Теперь «Игры» тоже ссылка. Четвёртая станция горит!', 'Found it! It had no href. Now Games is a link too. The fourth station is lit!'),
    ask: L3("Manzili yo'q qatorni bosing", 'Нажми строку без адреса', 'Tap the line with no address')
  },
  s6: {
    eyebrow: L3('5-bekat · Rasm', 'Станция 5 · Картинка', 'Station 5 · Picture'),
    say: L3("Beshinchi bekatda bizni galereya kutib turibdi. Rasm o'rnida faqat «Mushuk» degan so'z qolibdi, chunki glitch rasm faylini ko'rsatadigan atributning nomini o'chirib yuboribdi. Qaysi atribut tushib qolgan, eslay olasizmi? Uni bo'sh joyga olib boring.",
      'Пятая станция. В галерее вместо картинки только слово «Кот». Глитч стёр имя атрибута файла. Помнишь, какой атрибут задаёт файл картинки? Перетащи его в пустое место.',
      'Fifth station. In the gallery there’s only the word Cat instead of the picture. The glitch erased the name of the file attribute. Remember which attribute gives the picture file? Drag it into the empty spot.'),
    why: {
      href: L3("Shoshilmang! href havolaning manzilini ko'rsatadi. Rasm uchun esa boshqa atribut kerak.", 'href — для адреса ссылки. Картинке нужен другой атрибут.', 'href is for a link’s address. A picture needs a different attribute.'),
      alt: L3("alt kodda allaqachon bor-ku, u rasmni so'z bilan tasvirlaydi. Faylni esa boshqa atribut ko'rsatadi.", 'alt в коде уже есть, он описывает картинку словами. Файл задаёт другой атрибут.', 'alt is already in the code; it describes the picture in words. Another attribute gives the file.')
    },
    ok: L3("Mushukcha galereyaga qaytib keldi. Yo'lning yarmidan o'tib oldik!", 'Класс! Кот вернулся. Пятая станция горит!', 'Brilliant! The cat is back. The fifth station is lit!'),
    ask: L3("Fayl atributini bo'sh joyga olib boring", 'Перетащи атрибут файла в пустое место', 'Drag the file attribute into the empty spot'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): на третьей нужный кусок загорается.
    hints: [
      L3("Brauzerda rasm o'rnida faqat so'z turibdi. Kodda qaysi atributning nomi tushib qolgan?", 'Посмотри на браузер: вместо картинки только слово. Имени какого атрибута не хватает в коде?', 'Look at the browser: there’s only a word instead of the picture. Which attribute’s name is missing in the code?'),
      L3("Bo'sh joydan keyin fayl nomi turibdi: mushuk.jpg. Fayl nomidan oldin qaysi atribut yozilardi?", 'После пустого места стоит имя файла mushuk.jpg. Помнишь, какой атрибут задаёт файл картинки?', 'Right after the empty spot is the file name mushuk.jpg. Remember which attribute gives the picture file?'),
      L3("Rasmning faylini src atributi ko'rsatadi. Yonib turgan src bo'lagini bo'sh joyga qo'ying.", 'Файл картинки задаёт атрибут src. Перетащи горящий src в пустое место.', 'The src attribute gives the picture file. Drag the glowing src into the empty spot.')
    ]
  },
  s7: {
    eyebrow: L3('6-bekat · Parol', 'Станция 6 · Пароль', 'Station 6 · Password'),
    say: L3("Oltinchi bekat bizni klub anketasiga olib keldi. Bu yerda parol hammaga ochiq ko'rinib turibdi, chunki maydonning turi o'chib ketibdi. Parolni nuqtalar ortiga yashiradigan tur qaysi edi? Uni qo'shtirnoq ichiga yozing.",
      'Шестая станция. В анкете клуба пароль виден всем: стёрся вид поля. Помнишь, какой вид прячет пароль за точками? Впиши его в кавычки.',
      'Sixth station. In the club form the password is visible to everyone, because the field’s kind was erased. Remember which kind hides a password behind dots? Type it in the quotes.'),
    msgs: {
      empty: L3("Qo'shtirnoq ichi hali bo'sh. U yerga maydonning turini yozing.", 'Впиши вид поля в кавычки.', 'Type the field’s kind in the quotes.'),
      text: L3("Hali parol yashirinmadi: text bo'lsa maydon oddiy bo'lib qoladi, harflar hammaga ochiq ko'rinaveradi.", 'С text поле обычное, и пароль остаётся виден.', 'With text the field is ordinary, and the password stays visible.'),
      number: L3("number faqat son yozish uchun kerak. U parolni yashira olmaydi.", 'number — только для числа. Пароль он не прячет.', 'number is only for numbers. It doesn’t hide the password.'),
      typo: L3("Brauzer bunday turni tanimadi va oddiy maydon yasab qo'ydi. So'zni harfma-harf tekshirib yozing.", 'Такого вида нет, поэтому браузер сделал обычное поле. Напиши слово буква в букву.', 'There’s no such kind, so the browser made an ordinary field. Type the word letter by letter.')
    },
    hints: [
      L3("Qaysi tur parolni nuqtalar ortiga yashirar edi?", 'Какой вид поля прячет пароль?', 'Which field kind hides a password?'),
      L3("Bu so'z inglizchada «parol» degani.", 'Это английское слово, то есть «пароль».', 'It’s the English word for password.'),
      L3("Kerakli tur password bo'ladi. Uni qo'shtirnoq ichiga yozing-da, «Tekshirish»ni bosing.", 'Вид — password. Впиши его в кавычки.', 'The kind is password. Type it in the quotes.')
    ],
    ok: L3("Parol yana nuqtalar ortiga yashirindi. Oltinchi bekatni ham ortda qoldirdik!", 'Огонь! Пароль снова за точками. Шестая станция горит!', 'Awesome! The password is behind dots again. The sixth station is lit!'),
    ask: L3('Parol maydonining turini yozing', 'Впиши вид поля пароля', 'Type the password field’s kind')
  },
  s8: {
    eyebrow: L3('7-bekat · Anketa', 'Станция 7 · Анкета', 'Station 7 · Form'),
    say: L3("Yettinchi bekatda yana anketa bor, lekin bu safar glitch undagi teglarni aralashtirib yuboribdi. Sahifadan har bir tegning o'z narsasini topib bering: ro'yxat, variant, katta maydon yoki tugma. Oldin tegni, keyin sahifadagi narsani bosing.",
      'Седьмая станция. Глитч перепутал названия частей анкеты. Соедини каждый тег с его вещью на странице: список, вариант, большое поле и кнопка. Сначала нажми тег, потом вещь.',
      'Seventh station. The glitch mixed up the names of the form’s parts. Match each tag with its thing on the page: the list, a choice, the big field and the button. Tap a tag first, then the thing.'),
    cards: {
      select: L3("Ochiladigan ro'yxat", 'Выпадающий список', 'A drop-down list'),
      option: L3("Ro'yxatdagi bitta variant", 'Один вариант в списке', 'One choice in the list'),
      textarea: L3('Katta matn maydoni', 'Большое поле', 'A big text field'),
      button: L3('Tugma', 'Кнопка', 'A button')
    },
    pairOk: {
      select: L3("Ana, ro'yxat ham joyiga tushdi! select ochiladigan ro'yxat yasaydi.", 'Верно! select делает список.', 'Right! select makes the list.'),
      option: L3("Variant ham topildi: option ro'yxatdagi bitta qatorni yasaydi.", 'Верно! option — один вариант.', 'Right! option is one choice.'),
      textarea: L3("Katta maydon joyida, to'g'ri topdingiz: textarea katta matn maydonini yasaydi.", 'Верно! textarea делает большое поле.', 'Right! textarea makes a big field.'),
      button: L3("Tugma ham bosildi-ku: button bosiladigan tugma yasaydi.", 'Верно! button делает кнопку.', 'Right! button makes a button.')
    },
    why: {
      select: L3("select butun ro'yxatni yasaydi: yonida strelkasi bor maydonni qidiring.", 'select делает весь список: поле со стрелкой.', 'select makes the whole list: a field with an arrow.'),
      option: L3("Hechqisi yo'q! option ro'yxat ichidagi bittagina qator bo'ladi.", 'option — одна строка внутри списка.', 'option is one line inside the list.'),
      textarea: L3("Unday emas: textarea bir necha qatorga yoziladigan katta maydon bo'ladi.", 'textarea — поле на несколько строк.', 'textarea is a field for several lines.'),
      button: L3("button bosiladigan tugmani yasaydi. Sahifadan tugmani qidiring.", 'button — кнопка, которую нажимают.', 'button is a button you tap.')
    },
    hints: [
      L3("Sahifadagi har bir narsani bittalab ko'rib chiqing: u ro'yxatmi, maydonmi yoki tugmami?", 'Посмотри на каждую вещь: это список, поле или кнопка?', 'Look at each thing: is it a list, a field or a button?'),
      L3("Strelkali maydon select bo'ladi. Uning ichidagi har bir qatorni esa option yasaydi.", 'Поле со стрелкой — select, а одна строка в нём — option.', 'The field with an arrow is select, and one line inside it is option.'),
      L3("Strelkali maydonni select, undagi qatorni option yasaydi. Katta maydonni textarea, tugmani esa button yasaydi.", 'Поле со стрелкой — select, строка — option, большое поле — textarea, кнопка — button.', 'The field with an arrow is select, a line is option, the big field is textarea, and the button is button.')
    ],
    ok: L3("Anketa yana o'z holiga qaytdi. Oxirigacha bittagina qadam qoldi!", 'Молодец! Анкета снова в порядке. Седьмая станция горит!', 'Well done! The form is in order again. The seventh station is lit!'),
    ask: L3("Tegni o'z narsasi bilan juftlang", 'Соедини тег с его вещью', 'Match each tag with its thing'),
    askPlace: L3('Endi narsani bosing', 'Теперь нажми вещь', 'Now tap the thing'),
    pickFirst: L3('Oldin tegni bosing.', 'Сначала нажми тег.', 'Tap a tag first.')
  },
  s9: {
    eyebrow: L3('8-bekat · Sayt qismlari', 'Станция 8 · Части сайта', 'Station 8 · Site parts'),
    say: L3("Oxirgi bekatga ham yetib keldik! Inspektorga qarang: asosiy qism bilan sayt oxiri ramkada, sayt boshida esa ramka yo'q. Glitch uni head tegiga o'rab qo'yibdi. Sayt boshiga qaysi teg kerak edi? To'g'ri tegni tanlang.",
      'Последняя станция. Посмотри на Инспектор: главная часть и низ сайта в рамках, а у верха рамки нет. Глитч обернул верх сайта в тег head. Помнишь, какой тег у верха сайта? Выбери нужный тег.',
      'Last station. Look at the Inspector: the main part and the bottom of the site have frames, but the top doesn’t. The glitch wrapped the top of the site in the head tag. Remember which tag the top of the site uses? Choose the right tag.'),
    why: {
      head: L3("Yo'q, glitch aynan shu tegni qo'yib ketgan-ku! head sahifa haqidagi ko'rinmas ma'lumotlar uchun kerak, sayt boshi uchun emas.", 'head — для невидимых сведений о странице. Сейчас как раз он стоит по ошибке.', 'head is for invisible information about the page. It’s exactly what’s wrongly there now.'),
      h1: L3("Oz qoldi! h1 bitta sarlavha yasaydi, u esa ichkarida allaqachon turibdi. Butun sayt boshini o'rash uchun boshqa teg kerak.", 'h1 — это заголовок, он уже внутри. Для всего верха сайта нужен другой тег.', 'h1 is a heading, and it’s already inside. The whole top of the site needs a different tag.')
    },
    ok: L3("Inspektor sayt boshini yana ko'rib qoldi. Sakkizinchi bekat ham yondi, xaritamiz to'liq yorishdi!", 'Отлично! Инспектор снова видит верх сайта. Горит и восьмая станция!', 'Great! The Inspector sees the top of the site again. The eighth station is lit too!'),
    ask: L3("Sayt boshi tegini tanlang", 'Выбери тег верха сайта', 'Choose the tag for the top of the site'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — куда смотреть, 2 — правило, 3 — причина и какой тег выбрать.
    hint1: L3("Inspektordagi ramkalarni sanab ko'ring: qaysi qismda ramka yo'q?", 'Посмотри на Инспектор: у какой части нет рамки?', 'Look at the Inspector: which part has no frame?'),
    hint2: L3("head ko'rinmas ma'lumotlar uchun kerak, h1 esa bittagina sarlavha yasaydi. Bizga sayt boshini butunligicha o'raydigan teg kerak.", 'head — для невидимых сведений, а h1 — один заголовок. Нужен тег части, который обнимает весь верх сайта.', 'head is for invisible information, and h1 is one heading. We need the part tag that wraps the whole top of the site.'),
    why3: L3("Sayt boshini header tegi o'raydi: sarlavha bilan menyu shuning ichida turadi.", 'Верх сайта — это тег header: в нём заголовок и меню.', 'The top of the site is the header tag: it holds the heading and the menu.')
  },
  s10: {
    eyebrow: L3('Aralash vazifa', 'Смешанное задание', 'Mixed task'),
    say: L3("Hamma bekatlar yondi! Endi biroz qiyinroq ish: ikki mavzuni birlashtiramiz. Rasm ham havola bo'la oladi: rasmni bossangiz, galereya ochilsin. Buning uchun rasmni a tegining ichiga qo'yamiz. Qani, bo'laklarni tartib bilan joylang.",
      'Все станции горят! Теперь задание посложнее: соединим два умения. Сделай картинку с котом ссылкой — нажмёшь на картинку, и откроется галерея. Для этого картинку ставят внутрь тега a. Поставь куски по порядку.',
      'All the stations are lit! Now a harder task: let’s combine two skills. Turn the cat picture into a link, so tapping the picture opens the gallery. To do that, you put the picture inside the a tag. Put the pieces in order.'),
    why: {
      imgc: L3("Bu bo'lak ortiqcha: img tegining yopuvchi jufti bo'lmaydi.", 'У img нет закрывающего тега. Этот кусок лишний.', 'img has no closing tag. This piece isn’t needed.'),
      aopen: L3("Oldin havolaning o'zi ochilishi kerak: manzili bilan birga a tegi keladi.", 'Сначала открывается ссылка: тег a и её адрес.', 'First the link opens: the a tag with its address.'),
      img: L3("Havola ochildimi? Endi uning ichiga rasm keladi.", 'Внутри ссылки стоит картинка.', 'The picture goes inside the link.'),
      aclose: L3("Rasm joyiga tushdi, endi eng oxirida havola yopiladi.", 'В конце ссылка закрывается.', 'At the end the link closes.')
    },
    hints: [
      L3("Rasm bosiladigan bo'lishi uchun u nimaning ichida turishi kerak?", 'Внутри чего должна стоять картинка?', 'What should the picture be inside?'),
      L3("Oldin a tegi ochiladi, keyin uning ichiga rasm keladi.", 'Сначала открывается a, потом картинка.', 'First a opens, then the picture.'),
      L3("Bo'laklarni shu tartibda qo'ying: ochuvchi a, img, keyin yopuvchi a. Yopuvchi img bu yerga kerak emas.", 'Порядок такой: открывающий a, img и закрывающий a. Закрывающий img не нужен.', 'The order is: the opening a, img and the closing a. No closing img.')
    ],
    ok: L3("Qoyilmaqom! Mushuk rasmi endi havolaga aylandi. Qani, ustiga bosib ko'ring-chi, galereya ochilarmikan?", 'Вау, класс! Картинка стала ссылкой. Нажми на неё — откроется галерея.', 'Wow, awesome! The picture is now a link. Tap it and the gallery opens.'),
    ask: L3("Bo'laklarni to'g'ri tartibda qo'ying", 'Поставь куски по порядку', 'Put the pieces in order'),
    askTap: L3('Rasmni bosib ko\'ring', 'Нажми на картинку', 'Tap the picture'),
    askOpened: L3('Galereya ochildi!', 'Галерея открылась!', 'The gallery opened!')
  },
  s11: {
    eyebrow: L3('Katta sinov', 'Большое испытание', 'The big test'),
    say: L3("Endi glitch bilan katta jang! U bitta sahifaga beshta nosozlikni yashirib ketibdi. Sahifaga diqqat bilan qarang-da, har birini toping. Buzilgan qatorni bossangiz, u o'zi tuzaladi. Qaysi biridan boshlashingiz muhim emas.",
      'А теперь большое испытание! Глитч оставил на одной странице пять ошибок. Посмотри на браузер и найди каждую. Нажми строку с ошибкой — она починится сама. Порядок не важен.',
      'Now the big test! The glitch left five bugs on one page. Look at the browser and find each one. Tap a line with a bug and it fixes itself. The order doesn’t matter.'),
    fine: L3("Bu qator sog'-salomat, glitch unga tegmabdi. Sahifaga yana tikilib ko'ring: yana nima g'alati?", 'Эта строка в порядке. Посмотри на браузер: что ещё выглядит не так?', 'This line is fine. Look at the browser: what else looks wrong?'),
    found: {
      h: L3("Glitch sarlavhani mitti qilib qo'ygan: h6 emas, h1 turishi kerak edi.", 'Есть! Вместо h6 должен быть h1.', 'Found it! It should be h1, not h6.'),
      img: L3("Glitch rasmga href yozib ketibdi, uning o'rniga src kerak edi.", 'Есть! Картинке нужен не href, а src.', 'Found it! A picture needs src, not href.'),
      li: L3("Glitch osh qadamlaridan birining li tegini olib tashlagan, shuning uchun raqami ham chiqmagan edi.", 'Есть! У шага про морковь не было li, поэтому не было и номера.', 'Found it! The carrot step had no li, so it had no number either.'),
      a: L3("Havoladan href ham g'oyib bo'libdi! Manzil qaytarildi, endi u bosiladi.", 'Есть! У ссылки не было href.', 'Found it! The link had no href.'),
      pass: L3("Parol maydonining turini glitch o'zgartirgan: u password bo'lishi kerak edi, endi parol ko'rinmaydi.", 'Есть! У поля пароля вид должен быть password.', 'Found it! The password field’s kind should be password.')
    },
    hints: [
      L3("Brauzerdagi sahifani boshdan-oyoq ko'zdan kechiring: nima mitti, nima yo'q, nima ochiq turibdi?", 'Посмотри на браузер: что крошечное, чего нет, что видно всем?', 'Look at the browser: what’s tiny, what’s missing, what’s visible to everyone?'),
      L3("Sarlavhani, rasmni, ro'yxatni, havolani va parolni birma-bir tekshirib chiqing.", 'Проверь по очереди заголовок, картинку, список, ссылку и пароль.', 'Check the heading, the picture, the list, the link and the password one by one.'),
      L3("Yonib turgan qatorni ko'ryapsizmi? Nosozlik aynan o'sha yerda yashiringan.", 'Посмотри на горящую строку: ошибка там.', 'Look at the lit line: the bug is there.')
    ],
    ok: L3("Beshala nosozlik ham topildi, glitch yengildi! Endi sahifada uning izi ham qolmadi.", 'Супер! Все пять ошибок найдены. Ты работаешь как настоящий программист!', 'Super! All five bugs are found. You worked like a real programmer!'),
    ask: L3('Xato bor qatorlarni bosing', 'Нажимай строки с ошибками', 'Tap the lines with bugs')
  },
  q1: {
    eyebrow: L3('Tezkor savollar', 'Быстрый раунд', 'Quick round'),
    say: L3("Bekatlarni tez bir aylanib chiqamiz: har bir bekat haqida bitta fikr aytaman. Siz esa «Rost» yoki «Yolg'on» tugmasini bosasiz.", 'Последнее испытание — быстрый раунд. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test: a quick round. I’ll say something, and you choose: true or false.'),
    ask: L3("Rostmi yoki yolg'onmi?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    // Ступени подсказки (лампочка; со второй ошибки — сами): 1 — общая, 2 — своя у каждой фразы (h), 3 — причина и ответ.
    hint1: L3("Kartochkadagi bekat nomini o'qing-chi: bu fikr kursning qaysi mavzusi haqida ekan?", 'Посмотри на название станции на карточке: о какой теме курса эта фраза?', 'Look at the station name on the card: which topic of the course is the sentence about?'),
    yes: L3("Rost", 'Верно', 'True'),
    no: L3("Yolg'on", 'Неверно', 'False'),
    right: L3("Xuddi shunday!", 'Точно!', 'Exactly!'),
    items: [
      { st: 0, t: L3("title ichidagi yozuv sahifaning o'zida katta sarlavha bo'lib chiqadi.", 'Текст в title появляется на самой странице большим заголовком.', 'The text in title shows on the page itself as a big heading.'), right: false,
        why: L3("title yozuvi sahifada emas, brauzer yorlig'ida chiqadi. Sahifadagi katta sarlavhani esa h1 yasaydi.", 'Текст title виден на вкладке браузера. Заголовок на странице делает h1.', 'The title text shows on the browser tab. h1 makes the heading on the page.'),
          h: L3("title yozuvini sahifadan izlab ko'ring: u oynadami yoki tepadagi yorliqdami?", 'Помнишь, где виден текст title: на самой странице или на вкладке браузера?', 'Remember where the title text shows: on the page itself or on the browser tab?') },
      { st: 2, t: L3("ol tegi ro'yxatni raqamlaydi.", 'Тег ol нумерует список.', 'The ol tag numbers a list.'), right: true,
        why: L3("ol raqamli ro'yxat yasaydi: har bir bandning oldiga raqam qo'yadi.", 'ol — нумерованный список: у каждого пункта номер.', 'ol is an ordered list: each item gets a number.'),
          h: L3("Ro'yxatning ikki turi bor: biri nuqta qo'yadi, boshqasi raqam. Raqamni qaysi biri qo'yadi?", 'Списков было два вида: один ставит точки, другой — номера. Какой из них ol?', 'There were two kinds of lists: one adds dots, the other numbers. Which one is ol?') },
      { st: 4, t: L3('img yopuvchi teg bilan yoziladi.', 'img пишут с закрывающим тегом.', 'img is written with a closing tag.'), right: false,
        why: L3("img tegining yopuvchi jufti bo'lmaydi, u bitta o'zi turadi.", 'У img нет закрывающего тега.', 'img has no closing tag.'),
          h: L3("Ba'zi teglar ichiga matn yozilmaydi. img ichiga biror narsa yoziladimi?", 'Внутрь некоторых тегов ничего не пишут — они бывают только открывающими. В img что-то пишут внутри?', 'Some tags hold no text inside, so they are opening tags only. Do you write anything inside img?') },
      { st: 5, t: L3("label yozuvini bossangiz, maydon yozishga tayyor bo'ladi.", 'Если нажать на подпись в label, поле готово к вводу.', 'If you tap the caption in label, the field is ready for typing.'), right: true,
        why: L3("label yozuvni maydonga bog'lab qo'yadi, shuning uchun yozuvni bosish ham maydonni bosish bilan barobar.", 'label связывает подпись с полем.', 'label ties the caption to the field.'),
          h: L3("label yozuvni maydonga bog'laydi. Yozuvni bossangiz, nima bo'lardi?", 'label — подпись поля. Что будет, если нажать на подпись, связанную с полем?', 'label is a field’s caption. What happens if you tap a caption tied to the field?') },
      { st: 7, t: L3('footer sayt oxirini bildiradi.', 'footer — это низ сайта.', 'footer marks the bottom of the site.'), right: true,
        why: L3("footer sayt oxirini o'raydi: u yerda odatda saytni kim yasagani, telefon yoki pochta, yana bir-ikkita havola turadi.", 'footer — низ сайта: там обычно авторство и контакты.', 'footer is the bottom of the site: it usually holds the copyright and contacts.'),
          h: L3("Saytning uch qismi: boshi, o'rtasi, oxiri. footer shulardan qaysi biri?", 'У сайта три части: верх, главная часть и низ. Какая из них footer?', 'A site has three parts: the top, the main part and the bottom. Which one is footer?') }
    ],
    ok: L3("Har bir bekatni yaxshi eslab qolibsiz! Demak, bu kurs bekorga ketmabdi.", 'Всё верно! Ты отлично знаешь весь курс.', 'All correct! You know the whole course really well.')
  },
  s12: {
    eyebrow: L3('Kurs tugadi', 'Курс пройден', 'Course complete'),
    say: [
      { text: L3("Yo'lning boshida men saytni o'chirib, boshidan yozmoqchi edim. Siz esa har bir bekatda bittagina kichik nosozlikni tuzatdingiz: bitta tegni, bitta atributni yoki bitta qiymatni. Sayt butunligicha saqlanib qoldi, butun kurs davomidagi ishimiz ham yo'qolmadi, do'stlarimga ham kechgacha ulguramiz. Demak, eng qisqa yo'l o'chirib tashlash emas ekan: nosozlikni topib, aynan o'shani tuzatish kerak.",
        'Вернёмся к загадке. Помнишь, я думал, что сайт надо стереть и написать заново? Увы, я ошибся. Ты на каждой странице поправил всего одну маленькую ошибку: один тег, один атрибут или одно значение. Программисты так и работают: находят ошибку и чинят именно её.',
        'Back to our riddle. Remember, I thought we had to delete the site and write it again? Sadly, I was wrong. On each page you fixed just one small bug: one tag, one attribute or one value. That’s how programmers work: they find the bug and fix exactly that.'), k: 'riddle' },
      { text: L3("Mana, saytim yana jonlandi: sarlavha kap-katta, mushuk joyida, osh qadamlari raqamlangan, havola bosiladi, parol esa yashirin turibdi.", 'Смотри, мой сайт снова работает: заголовок большой, картинка на месте, шаги пронумерованы, ссылка нажимается, а пароль спрятан.', 'Look, my site works again: the heading is big, the picture is in place, the steps are numbered, the link works, and the password is hidden.'), k: null },
      { text: L3("Siz uddaladingiz: HTML kursi tugadi! Birinchi darsda bitta oddiy sahifa yasagan edik, hozir esa sarlavhasi, ro'yxatlari, havolalari, rasmlari va anketasi bor saytlar turibdi. Sakkizta bekatning hammasidan o'zingiz o'tdingiz. Endi glitch ham sizdan qo'rqadi!", 'Курс HTML пройден! Теперь ты знаешь структуру страницы, заголовки, списки, ссылки, картинки, формы и части сайта.', 'You’ve finished the HTML course! Now you know page structure, headings, lists, links, pictures, forms and the parts of a site.'), k: 'cert' },
      { text: L3("Endi har qanday sahifaning asosini o'zingiz qura olasiz, xuddi haqiqiy veb-dasturchidek. Lekin hozircha saytlarimiz oq-qora, rang ham, shrift ham yo'q. Keyingi kursda CSS bilan ularga rang va shrift beramiz, hamma narsani joy-joyiga chiroyli qo'yamiz. Sizni o'sha yerda intiqib kutaman!", 'В следующем курсе сделаем сайты красивыми с помощью CSS: добавим цвет, шрифты и расположение. До встречи!', 'In the next course we’ll make sites beautiful with CSS: colors, fonts and layout. See you!'), k: null }
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
