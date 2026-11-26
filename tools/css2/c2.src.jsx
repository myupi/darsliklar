// =============================================================================
// КУРС «CSS» · Урок 2 — «Как выбрать элемент для стилизации»
// (облик «Редактор», как уроки курса HTML; 05.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/css2/build.mjs → lessons/css/02-selektory.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Как выбрать элемент для стилизации» · модуль css-m1-osnovy =====
//
// ЗАМЫСЕЛ (05.11.2026). Урок 1: style в head, правило «селектор { свойство: значение; }», селектор по тегу.
// На странице новостей Коди хочет выделить красным один важный абзац, пишет правило для p — краснеют все.
// Ученик учит class (много элементов, в CSS — точка) и id (один элемент, в CSS — «#»), чинит выбор и даёт
// класс своему абзацу. Загадка (без имён): Коди дал абзацу class="muhim", а в CSS написал «muhim { … }» без
// точки и уверен, что сработает; в выводе признаёт ошибку.
//
// ДУГА (17 экранов; экрана плана нет; заказчик, 05.11.2026: минимум 17). Типы заданий — по разделу 3а навыка:
//   s1 крючок (p красит все абзацы; загадка)
//   class:  s2 показ (class в HTML, точка в CSS) · s3 вписать имя класса (Fill in the Blanks) · s4 какие абзацы покрасит (Visual Code Mapping)
//   id:     s5 показ (id в HTML, «#» в CSS; класс — форма команды, id — номер паспорта) · s6 собрать селектор (Code Builder) · s7 селектор ↔ что выбирает (Matching Pairs)
//   class или id: k1 показ (много — class, одна вещь — id) · k2 вписать селектор целиком (Fill in the Blanks) · k3 class или id (Sort)
//   поломки: s8 показ (опечатка в имени, «#» вместо точки, точка в HTML) · s9 поставить точку (Debug & Fix) · s10 найти сломанное правило (Error Detective)
//   правило целиком: w1 написать «#bosh { color: purple; }» самому (перенос)
//   свой класс: s11 своё имя класса в HTML и CSS (Live Code Preview, «Готово»)
//   итог: q1 верно или нет (True / False) · s12 вывод с разгадкой.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · Честный браузер: селекторы сопоставляются по-настоящему — тег, .class (имя буква в букву, регистр важен),
//     #id; сила селекторов как в браузере (id > class > тег, при равенстве — последнее правило); значения
//     проверяет сам Chrome (CSS.supports). Нет точки — браузер ищет тег с таким именем и ничего не красит.
//   · Узбекский — по /uzbekcha: апостроф ASCII, «ya'ni … degani»; в речи нет символов — «nuqta»,
//     «panjara belgisi», «ikki nuqta».
//
// СИСТЕМА СЛОВ: selektor, xususiyat, qiymat — как в уроке 1; class atributi, id atributi; class nomi;
// nuqta — точка; panjara belgisi — «#» (draft); teg selektori, class selektori, id selektori.
// В речи CSS, class, id, color и имена цветов — по-английски (правка речи в build.mjs).
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'css-02-selektory',
  module: 'css-m1-osnovy',
  lessonTitle: {
    uz: "2-dars. Bezash uchun elementni qanday tanlash",
    ru: 'Урок 2. Как выбрать элемент для стилизации',
    en: 'Lesson 2. How to pick an element to style'
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
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  goal: L3('Vazifa', 'Задание', 'Task'),
  save: L3('Saqlash', 'Сохранить', 'Save'),
  saved: L3('Saqlandi', 'Сохранено', 'Saved'),
  author: L3('Muallif', 'Автор', 'Author'),
  code: L3('Kod', 'Код', 'Code'),
  result: L3('Natija', 'Результат', 'Result'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('Ranglar', 'Цвета', 'Colors'),
  turn: L3("Bo'yash", 'Покрасить', 'Color it'),
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
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, done, ok, msgs, hints, why, miss …; печатаются: eyebrow, ask, card, site.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  // Страница новостей Коди (не звучит).
  site: {
    title: L3('Kodining yangiliklari', 'Новости Коди', 'Kodi’s news'),
    chess: L3("Bugun shaxmat to'garagi bor.", 'Сегодня кружок шахмат.', 'Chess club is on today.'),
    football: L3("Muhim: ertaga futbol o'yini!", 'Важно: завтра футбольный матч!', 'Important: football match tomorrow!'),
    photos: L3("Yangi rasmlar qo'shildi.", 'Добавились новые фото.', 'New photos were added.'),
    school: L3("Maktabda bayram bo'ladi.", 'В школе будет праздник.', 'The school will have a party.'),
    run: L3('Yugurish musobaqasi shanba kuni.', 'Забег — в субботу.', 'The race is on Saturday.'),
    mine: L3("Bu mening abzasim.", 'Это мой абзац.', 'This is my paragraph.'),
    colorsH: L3('Ranglar', 'Цвета', 'Colors')
  },
  s1: {
    eyebrow: L3('Hammasi qizil', 'Всё красное', 'All red'),
    say: L3("Salom! Mana, mening yangiliklar sahifam. Bu yerdagi bitta yangilik juda muhim: ertaga futbol o'yini bo'ladi! Shuning uchun faqat shu abzasni qizil qilmoqchiman. O'tgan darsdagidek, p uchun qoida yozib qo'ydim. Qani, «Bo'yash» tugmasini bosing-chi, nima bo'larkin?",
      'Привет! Это моя страница новостей. Одна новость очень важная: завтра футбольный матч. Я хочу сделать красным только этот абзац. Как на прошлом уроке, я написал правило для p. Нажми «Покрасить».',
      'Hi! This is my news page. One piece of news is really important: there’s a football match tomorrow. I want to make only that paragraph red. Like last lesson, I wrote a rule for p. Tap “Color it”.'),
    magic: L3("Voy, nima bo'ldi? Hamma abzaslar qip-qizil bo'lib ketdi-ku! Men faqat bittasini bo'yamoqchi edim.", 'Ой! Все абзацы стали красными. А я хотел только один.', 'Oops! All the paragraphs turned red. I wanted only one.'),
    magicP: L3("Gap shundaki, p teg selektori bo'ladi, u sahifadagi hamma abzaslarni birdaniga tanlaydi. Sahifadagi har bir narsa esa element deyiladi: sarlavha ham, abzas ham, rasm ham. Endi shu elementlardan faqat bittasini tanlash usulini topishimiz kerak.", 'Селектор тега p выбирает все абзацы на странице. А нам нужен способ выбрать именно нужный элемент.', 'The p tag selector picks every paragraph on the page. We need a way to pick exactly the element we want.'),
    done: L3("Bugun class va id bilan aynan kerakli elementni tanlashni o'rganasiz. Men esa buning chorasini allaqachon o'ylab topdim! Futbol haqidagi abzasga class atributini qo'shib, unga muhim deb nom berdim. CSS kodiga ham shunchaki muhim deb yozdim-da, qavslar ichiga qizil rangni qo'ydim. Ichimda bir ovoz «Hammasi joyida, abzas qizaradi», deydi, boshqasi esa «Nimadir yetishmayapti», deydi. Qaysi biri haq ekan? Shu savol esingizda tursin, dars oxirida o'sha qoidani qayta ochib ko'ramiz.",
      'Сегодня ты научишься выбирать именно нужный элемент: с помощью class и id. Но сначала маленькая загадка. Я добавил важному абзацу атрибут class и назвал его muhim. А в CSS написал muhim и в скобках поставил красный цвет. По-моему, теперь красным станет только этот абзац. Как думаешь, я прав? Ответ найдём вместе в конце урока.',
      'Today you’ll learn to pick exactly the element you want: with class and id. But first, a little riddle. I added a class attribute to the important paragraph and named it muhim. In CSS I wrote muhim and put the red color in the braces. I think now only that paragraph will turn red. What do you think, am I right? We’ll find the answer together at the end of the lesson.'),
    ask: L3("«Bo'yash» tugmasini bosing", 'Нажми «Покрасить»', 'Tap “Color it”'),
    askDone: L3("p hamma abzaslarni tanlaydi", 'p выбирает все абзацы', 'p picks every paragraph')
  },
  s2: {
    eyebrow: L3('class atributi', 'Атрибут class', 'The class attribute'),
    help: [
      L3("Bu safar ikki joyni kuzating-chi: HTML kodida abzasga class atributi qo'shiladi, CSS kodida esa nuqta va o'sha nom yoziladi. Keyin qarang, qaysi abzas bo'yalarkin?", 'Посмотри на два места: в HTML абзацу добавляют class, а в CSS пишут точку и то же имя. Какой абзац покрасится?', 'Look at two places: in HTML the paragraph gets a class, and in CSS you write a dot and the same name. Which paragraph gets colored?'),
      L3("Nega bitta abzasgina bo'yaldi? Chunki class atributi elementga nom beradi, CSS qoidasi esa shu nomni nuqta orqali qidiradi. Shuning uchun ikkala joyda nom harfma-harf bir xil bo'lishi kerak.", 'class даёт элементу имя. В CSS перед этим именем ставят точку. В обоих местах имя одинаковое, буква в букву.', 'class gives an element a name. In CSS a dot goes before that name. The name must match letter for letter in both places.'),
      L3("Maktabda navbatchilar ko'kragiga «Navbatchi» degan nishon taqib yurishadi, bunday nishonni bir nechta o'quvchi taqadi. O'qituvchi «Navbatchilar, bu yoqqa keling!» desa, hammasi birdan keladi. class ham xuddi shunday nishon: uni bir nechta elementga taqsa bo'ladi.", 'На мероприятии носят бейджик с именем: по нему тебя и находят. class — такой же бейджик.', 'At an event you wear a name badge, and people find you by it. class is that kind of badge.')
    ],
    say: L3("Keling, futbol haqidagi muhim abzasni boshqalaridan ajratib tanlaymiz. Buning uchun ikki joyga yozish kerak bo'ladi: HTML kodiga ham, CSS kodiga ham. Qani, kuzatib turing.", 'Давай выберем важный абзац отдельно. Для этого пишем в двух местах: в HTML и в CSS. Смотри.', 'Let’s pick the important paragraph on its own. We write in two places for that: in HTML and in CSS. Watch.'),
    sayHtml: L3("Oldin HTML kodida kerakli abzasga class atributini qo'shdik. class so'zi inglizchada «guruh» degani. Keyin unga muhim degan nom berdik. Bu nom abzasga taqilgan nishonga o'xshaydi: xohlasak, xuddi shunday nishonni boshqa abzaslarga ham taqamiz.", 'Сначала в HTML добавляем нужному абзацу атрибут class и даём ему имя: muhim. Это как бейджик с именем на одежде.', 'First, in HTML we add a class attribute to the paragraph and give it a name: muhim. It’s like a name badge on clothes.'),
    sayCss: L3("Endi CSS kodida class nomining oldiga nuqta qo'ydik. Bu nuqta brauzerga «Bu teg emas, class nomi», deb aytadi. Ana, endi faqat futbol haqidagi muhim abzas qizil bo'ldi!", 'А теперь в CSS ставим перед именем класса точку. Точка говорит браузеру: это не тег, а имя класса. Смотри, теперь красный только важный абзац!', 'Now in CSS we put a dot before the class name. The dot tells the browser: this isn’t a tag, it’s a class name. Look, only the important paragraph is red now!'),
    done: L3("Demak, HTML kodida abzasga class atributini beramiz, CSS kodida esa o'sha nomni nuqta bilan yozamiz. Ikkala joyda ham nom harfma-harf bir xil bo'lishi kerak.", 'Значит, в HTML — атрибут class, а в CSS — точка и то же имя. В обоих местах имя одинаковое, буква в букву.', 'So in HTML it’s the class attribute, and in CSS a dot and the same name. The name is the same in both places, letter by letter.'),
    askStart: L3('Qarang: bitta abzasni tanlaymiz', 'Смотри: выбираем один абзац', 'Watch: we pick one paragraph'),
    askHtml: L3('Qarang: HTML kodida class atributi', 'Смотри: атрибут class в HTML', 'Watch: the class attribute in HTML'),
    askCss: L3("Qarang: CSS kodida nuqta va nom", 'Смотри: в CSS точка и имя', 'Watch: a dot and the name in CSS'),
    askDone: L3("class — nuqta bilan", 'class — с точкой', 'class — with a dot')
  },
  s3: {
    eyebrow: L3('class nomini yozing', 'Впиши имя класса', 'Type the class name'),
    say: L3("Uchinchi yangilikni yashil qilib bering! HTML kodidan uning class nomini toping-da, CSS kodidagi nuqtadan keyin yozing. Nom to'g'ri bo'lsa, abzas shu zahoti bo'yaladi.", "Теперь твоя очередь. Сделаем зелёным третий абзац. Найди в HTML-коде имя его класса и впиши в CSS после точки.", "Now it’s your turn. Let’s make the third paragraph green. Find its class name in the HTML code and type it after the dot in CSS."),
    msgs: {
      empty: L3("Hali hech narsa yozilmabdi. Nuqtadan keyin class nomini yozing.", 'Впиши имя класса после точки.', 'Type the class name after the dot.'),
      dot: L3("Nuqta o'z joyida turibdi-ku, uni qayta yozish shart emas. Faqat class nomini yozing.", 'Точка уже стоит. Впиши только имя класса.', 'The dot is already there. Type only the class name.'),
      other: L3("Bu boshqa class ekan: u boshqa abzasni bo'yab qo'ydi. Bizga esa yangi degan class berilgan abzas kerak.", 'Это другой класс: он покрасил другой абзац. Нам нужен класс yangi.', 'That’s a different class: it colored another paragraph. We need the class yangi.'),
      none: L3("Sahifada bunday class topilmadi, shuning uchun hech narsa bo'yalmadi. Nomni HTML kodidagidek, harfma-harf ko'chirib yozing.", 'На странице нет такого класса, ничего не покрасилось. Напиши имя буква в букву, как в HTML.', 'There’s no such class on the page, so nothing got colored. Type the name letter by letter, as in HTML.')
    },
    hints: [
      L3("HTML kodidagi uchinchi abzasga bir qarang-chi: uning class atributida qanday nom yozilgan?", 'Посмотри на третий абзац в HTML: какое имя в его атрибуте class?', 'Look at the third paragraph in HTML: what name is in its class attribute?'),
      L3("CSS kodidagi nom HTML kodidagi class nomi bilan bir xil bo'lishi kerak.", 'Имя в CSS должно совпадать с именем класса в HTML.', 'The name in CSS must match the class name in HTML.'),
      L3("Uchinchi abzasga yangi degan class berilgan. Shuning uchun nuqtadan keyin yangi deb yozing.", 'Класс третьего абзаца — yangi. Впиши yangi после точки.', 'The third paragraph’s class is yangi. Type yangi after the dot.')
    ],
    ok: L3("Zo'r! Faqat yangi degan class berilgan abzas yashil bo'ldi, qolganlari o'zgarmadi.", 'Огонь! Зелёным стал только абзац с классом yangi.', 'Awesome! Only the paragraph with the class yangi turned green.'),
    ask: L3("Uchinchi abzasni yashil qiling: nuqtadan keyin class nomi", "Сделай третий абзац зелёным: после точки — его класс", "Make the third paragraph green: its class after the dot")
  },
  s4: {
    eyebrow: L3("Qaysilari bo'yaladi?", 'Какие покрасятся?', 'Which will be colored?'),
    say: L3("Mana, sport degan class uchun qoida yozdim: u ko'k rang beradi. HTML kodini o'qib chiqing-da, qaysi abzaslar ko'k bo'lishini toping. Keyin ularni sahifada bosing.", 'Теперь проверь себя. Это правило красит в синий элементы с классом sport. Посмотри в HTML и найди, какие абзацы станут синими. Нажми их на странице.', 'Now check yourself. This rule makes elements with the class sport blue. Look at the HTML and find which paragraphs will turn blue. Tap them on the page.'),
    ask: L3("Ko'k bo'ladigan abzaslarni bosing", 'Нажми абзацы, которые станут синими', 'Tap the paragraphs that will turn blue'),
    hint1: L3("HTML kodida har bir abzasning class atributini bittalab o'qib chiqing.", 'Посмотри в HTML на атрибут class у каждого абзаца.', 'Look at each paragraph’s class attribute in the HTML.'),
    hint2: L3("Qoida faqat sport degan class berilgan abzaslarni bo'yaydi. Class boshqacha bo'lsa yoki umuman yo'q bo'lsa, abzas o'zgarmaydi.", 'Правило красит только абзацы с классом sport. Абзацы с другим классом или без класса не меняются.', 'The rule colors only paragraphs with the class sport. Ones with another class or no class don’t change.'),
    hint3: L3("Birinchi va uchinchi abzasga sport degan class berilgan. Ana shularni bosing.", 'У первого и третьего абзаца класс sport. Нажми их.', 'The first and third paragraphs have the class sport. Tap them.'),
    why: {
      maktab: L3("Bu abzasga maktab degan class berilgan ekan. Qoida esa faqat sport uchun yozilgan, shuning uchun u bo'yalmaydi.", 'У этого абзаца класс maktab. А правило — для класса sport, он не покрасится.', 'This paragraph’s class is maktab. The rule is for the class sport, so it won’t be colored.'),
      none: L3("Bu abzasda class atributi umuman yo'q-ku. Shuning uchun sport qoidasi unga yetib bormaydi.", 'У этого абзаца нет класса. Правило sport его не трогает.', 'This paragraph has no class. The sport rule doesn’t touch it.')
    },
    got: L3("Topdingiz, bu abzasga sport degan class berilgan! Endi ikkinchisini toping.", 'Верно, у этого абзаца класс sport.', 'Right, this paragraph’s class is sport.'),
    ok: L3("Ajoyib, ikkala sport yangiligi ham ko'k bo'ldi! Ko'rdingizmi, bitta class nomini bir nechta elementga berish mumkin ekan.", 'Отлично! Оба абзаца sport стали синими. Один класс можно дать нескольким элементам.', 'Great! Both sport paragraphs turned blue. One class can go on several elements.')
  },
  s5: {
    eyebrow: L3('id atributi', 'Атрибут id', 'The id attribute'),
    help: [
      L3("HTML kodiga qarang-chi: sarlavhaga id atributi qo'shiladi. Keyin CSS kodiga ko'z tashlang: nomdan oldin panjara belgisi turibdi.", 'Посмотри, как в HTML заголовку добавляют id, а в CSS перед именем ставят решётку.', 'Watch how in HTML the heading gets an id, and in CSS a hash sign goes before the name.'),
      L3("Farqi nimada? id nomi sahifada faqat bitta elementga beriladi. CSS kodida uni nuqta bilan emas, panjara belgisi bilan yozamiz: nuqta faqat class uchun kerak.", 'id дают только одному элементу. В CSS перед именем id ставят решётку, а перед именем класса — точку.', 'id is given to just one element. In CSS a hash sign goes before an id name, and a dot before a class name.'),
      L3("Futbol jamoasini ko'z oldingizga keltiring: hamma o'yinchi bir xil forma kiyadi, class ham shunday umumiy forma. Pasport raqami esa har kimning o'ziniki, boshqa hech kimda takrorlanmaydi: id ham xuddi shunday yagona nom.", 'У игроков одной команды одинаковая форма — это class. А номер паспорта у каждого свой — это id.', 'Players on one team wear the same uniform: that’s class. A passport number is unique to each person: that’s id.')
    ],
    say: L3("class bilan tanishdik, endi id navbati keldi. class nomini bir nechta elementga bersa bo'ladi, xuddi jamoaning bir xil formasidek. id esa faqat bitta elementga beriladi, xuddi pasport raqamidek. Qani, ko'ramiz.", 'Класс можно дать нескольким элементам, как одинаковую форму команды. А id дают только одному элементу, как номер паспорта. Смотри.', 'A class can go on several elements, like a team’s matching uniform. An id goes on only one element, like a passport number. Watch.'),
    sayHtml: L3("HTML kodida sarlavhaga id atributini qo'shdik va unga bosh degan nom berdik. Endi sahifada boshqa hech bir elementga bosh degan id berilmaydi: bu nom faqat sarlavhaniki.", 'В HTML добавляем заголовку атрибут id с именем bosh. Ни у одного другого элемента на странице id bosh не будет.', 'In HTML we add an id attribute to the heading named bosh. No other element on the page will have the id bosh.'),
    sayCss: L3("CSS kodida esa id nomining oldiga panjara belgisini qo'ydik. Ana, sarlavha binafsha rangga kirdi!", 'В CSS перед именем id ставят решётку. Смотри, заголовок стал фиолетовым.', 'In CSS a hash sign goes before the id name. Look, the heading turned purple.'),
    done: L3("Shunday qilib, class nomidan oldin nuqta, id nomidan oldin esa panjara belgisi yoziladi. class nomini ko'p elementga bersa bo'ladi, id nomini esa faqat bittasiga.", 'Значит, для класса — точка, для id — решётка. Класс — для многих элементов, id — только для одного.', 'So a dot for a class, a hash sign for an id. A class is for many elements, an id for just one.'),
    askStart: L3("Qarang: class — forma, id — pasport", 'Смотри: класс — форма, id — паспорт', 'Watch: class is a uniform, id is a passport'),
    askHtml: L3('Qarang: HTML kodida id atributi', 'Смотри: атрибут id в HTML', 'Watch: the id attribute in HTML'),
    askCss: L3("Qarang: CSS kodida panjara belgisi", 'Смотри: в CSS решётка', 'Watch: a hash sign in CSS'),
    askDone: L3("id — panjara belgisi bilan", 'id — с решёткой', 'id — with a hash sign')
  },
  s6: {
    eyebrow: L3("Selektorni yig'ing", 'Собери селектор', 'Build the selector'),
    say: L3("Bu sahifada sarlavhaning id nomi logo ekan. Keling, uni to'q sariq qilamiz! Selektorda ikkita joy bo'sh turibdi: biri belgi uchun, biri nom uchun. Kerakli bo'laklarni tartib bilan bosing.", 'У заголовка id logo. Сделаем его оранжевым. Для селектора два пустых места: знак и имя. Нажми нужные куски по порядку.', 'The heading’s id is logo. Let’s make it orange. The selector has two empty spots: a sign and a name. Tap the right pieces in order.'),
    why: {
      dot: L3("Shoshilmang! Nuqta class uchun bo'ladi. Sarlavhada esa id bor, unga panjara belgisi kerak.", 'Точка — для класса. Здесь id, ему нужна решётка.', 'A dot is for a class. This is an id, so it needs a hash sign.'),
      nameFirst: L3("Oz qoldi! Selektorda oldin belgi turadi, id uchun u panjara belgisi bo'ladi. Nom esa undan keyin keladi.", 'Сначала идёт знак: для id это решётка. Потом имя.', 'The sign comes first: a hash sign for an id. Then the name.'),
      tag: L3("Bu bo'lakdagi h2 tegning nomi bo'ladi. Bizga esa sarlavhaning id nomi kerak: logo.", 'h2 — это имя тега. Нам нужно имя id заголовка: logo.', 'h2 is a tag name. We need the heading’s id name: logo.')
    },
    hints: [
      L3("HTML kodiga bir qarang: sarlavhaga class berilganmi yoki id?", 'Посмотри в HTML: у заголовка class или id?', 'Look at the HTML: does the heading have a class or an id?'),
      L3("id selektorida oldin panjara belgisi, keyin id nomi yoziladi.", 'Для id сначала пишут решётку, потом имя id.', 'For an id you write the hash sign first, then the id name.'),
      L3("Yonib turgan bo'lakni bosing: selektorga hozir aynan u kerak.", 'Нажми горящий кусок: он следующий.', 'Tap the glowing piece: it’s the next one.')
    ],
    ok: L3("Juda zo'r! Sarlavha to'q sariq bo'ldi, siz esa birinchi id selektoringizni yig'dingiz.", 'Огонь! Заголовок стал оранжевым. Ты написал селектор по id.', 'Awesome! The heading turned orange. You wrote an id selector.'),
    ask: L3("Bo'laklarni tartib bilan qo'ying", 'Поставь куски по порядку', 'Put the pieces in order')
  },
  s7: {
    eyebrow: L3('Juftini toping', 'Найди пару', 'Find the pair'),
    say: L3("Mana, uchta selektor: p, nuqtali muhim va panjarali logo. Har biri nimani tanlashini toping: chapdan selektorni, o'ngdan uning ishini bosing.", 'Теперь соедини селекторы с тем, что они выбирают. Нажми селектор слева, потом его работу справа.', 'Now match the selectors with what they pick. Tap a selector on the left, then its job on the right.'),
    cards: {
      tag: L3('sahifadagi hamma p teglari', 'все теги p на странице', 'every p tag on the page'),
      cls: L3("muhim degan class berilgan hamma elementlar", 'все элементы с классом muhim', 'every element with the class muhim'),
      id: L3("id nomi logo bo'lgan bitta element", 'один элемент с id logo', 'the one element with the id logo')
    },
    why: {
      tag: L3("O'ylab ko'ring-chi: p oldida hech qanday belgi yo'q, demak, u teg selektori bo'ladi. Teg selektori esa sahifadagi hamma abzaslarni tanlaydi.", 'p без знака — селектор тега. Он выбирает все абзацы на странице.', 'p with no sign is a tag selector. It picks every paragraph on the page.'),
      cls: L3("Hechqisi yo'q! Nuqta bilan boshlangan selektor class bo'yicha ishlaydi: muhim degan class berilgan hamma elementlarni tanlaydi.", 'Селектор с точкой выбирает по классу.', 'A selector starting with a dot picks by class.'),
      id: L3("Qarang: panjara belgisi bilan boshlangan selektor id nomi bo'yicha faqat bitta elementni tanlaydi.", 'Селектор с решёткой выбирает один элемент по id.', 'A selector starting with a hash sign picks one element by id.')
    },
    pairOk: {
      tag: L3("To'ppa-to'g'ri! p sahifadagi hamma abzaslarni birdaniga tanlaydi.", 'Верно, p выбирает все абзацы.', 'Right, p picks every paragraph.'),
      cls: L3("Ha, aynan! Nuqta class nomi bo'yicha tanlaydi.", 'Верно, точка выбирает по классу.', 'Right, the dot picks by class.'),
      id: L3("Juda to'g'ri! Panjara belgisi id nomi bo'yicha tanlaydi.", 'Верно, решётка выбирает по id.', 'Right, the hash sign picks by id.')
    },
    pickFirst: L3("Oldin chapdan selektorni tanlang.", 'Сначала выбери селектор слева.', 'First pick a selector on the left.'),
    hints: [
      L3("Har bir selektorning boshiga qarang-chi: unda belgi bormi, bo'lsa qaysi?", 'Посмотри на начало селектора: есть ли знак?', 'Look at the start of the selector: is there a sign?'),
      L3("Belgi bo'lmasa, teg selektori bo'ladi. Nuqta tursa, class selektori, panjara belgisi tursa esa id selektori.", 'Без знака — тег, с точкой — класс, с решёткой — id.', 'No sign means a tag, a dot means a class, a hash sign means an id.'),
      L3("Yonib turgan selektorni, keyin uning yonib turgan ishini bosing.", 'Нажми горящую пару.', 'Tap the glowing pair.')
    ],
    ok: L3("Qoyil! Endi teg, class va id selektorlarini bir qarashda farqlaysiz.", 'Отлично! Теперь ты различаешь все три селектора.', 'Great! Now you can tell all three selectors apart.'),
    ask: L3("Selektorni, keyin uning ishini bosing", 'Нажми селектор, потом его работу', 'Tap a selector, then its job'),
    askPlace: L3("Endi uning ishini bosing", 'Теперь нажми его работу', 'Now tap its job')
  },
  // ТРОЙКА «class или id?» (заказчик, 05.11.2026: в уроке минимум 17 экранов).
  k1: {
    eyebrow: L3('class yoki id?', 'class или id?', 'class or id?'),
    help: [
      L3("Oldin sport yangiliklariga qarang, keyin sarlavhaga. Sezdingizmi, bitta class qoidasi uchala yangilikni bo'yadi, id qoidasi esa faqat bitta sarlavhani.", 'Посмотри на спортивные новости и заголовок: один class красит все три новости, а id — только один заголовок.', 'Look at the sports news and the heading: one class colors all three news items, while id colors just the one heading.'),
      L3("Qanday tanlaymiz? Sahifada bir xil narsalar ko'p bo'lsa, ularga class bering. Narsa sahifada yolg'iz bo'lsa, unga id bering.", 'Если одинаковых вещей много — берут class. Если вещь на странице одна — берут id.', 'If there are many of the same thing, use class. If something is the only one on the page, use id.'),
      L3("Futbol jamoasidagi forma bilan pasport esingizdami? Formani butun jamoa kiyadi, shuning uchun ko'p narsaga class beramiz. Pasport raqami esa bitta odamniki, shuning uchun yagona narsaga id beramiz.", 'В школе звонок звенит всем ученикам — это class. А директор один, его зовут по имени — это id.', 'At school the bell rings for all students: that’s class. There’s only one principal, called by name: that’s id.')
    ],
    say: L3("Xo'sh, qachon class, qachon id tanlaymiz? Buning oddiy yo'li bor. Bir xil narsalar ko'p bo'lsa, class beramiz. Narsa sahifada yagona bo'lsa, id beramiz. Qani, yangiliklar sahifamda ko'raylik.", 'Когда брать class, а когда id? Есть простое правило. Если одинаковых вещей много — берут class. Если вещь на странице одна — берут id. Смотри.', 'When do you use a class, and when an id? There’s a simple rule. If there are many of the same thing, use a class. If something is the only one on the page, use an id. Watch.'),
    sayCls: L3("Sahifamda sport yangiliklari uchta. Uchalasiga ham bir xil sport degan class berdik, shuning uchun bitta qoida ularni birdaniga ko'k qildi.", 'Спортивных новостей три. Всем им дан один класс sport, поэтому одно правило покрасило синим все три.', 'There are three sports news items. They all have the same class sport, so one rule made all three blue.'),
    sayId: L3("Saytning sarlavhasi esa bitta, unga logo degan id berdik. Ko'rdingizmi? id qoidasi faqat uni to'q sariq qildi.", 'А заголовок сайта один. Ему дан id logo, и правило сделало оранжевым только его.', 'The site heading is the only one. It has the id logo, and the rule made only it orange.'),
    done: L3("Demak, bir xil narsalar ko'p bo'lsa, ularga class beramiz, yagona narsaga esa id.", 'Значит, для многих одинаковых вещей — class, для одной-единственной — id.', 'So a class for many of the same thing, an id for the one and only thing.'),
    askStart: L3("Qarang: ko'p narsa — class, bitta — id", 'Смотри: много — class, одна — id', 'Watch: many is a class, one is an id'),
    askCls: L3("Qarang: uchta sport yangiligi — bitta class", 'Смотри: три новости sport — один класс', 'Watch: three sport news items, one class'),
    askId: L3('Qarang: yagona sarlavha — id', 'Смотри: единственный заголовок — id', 'Watch: the only heading, an id'),
    askDone: L3("Ko'p — class, bitta — id", 'Много — class, одна — id', 'Many — class, one — id')
  },
  k2: {
    eyebrow: L3("Selektorni to'liq yozing", 'Впиши селектор целиком', 'Type the whole selector'),
    say: L3("Endi hamma sport yangiliklarini yashilga bo'yab bering! Bu safar selektorni to'liq o'zingiz yozasiz: belgisi ham, nomi ham sizdan.", 'Теперь сделай все спортивные новости зелёными. В этот раз впиши селектор целиком, вместе со знаком.', 'Now make all the sports news green. This time type the whole selector yourself, sign included.'),
    msgs: {
      empty: L3("Qavsdan oldingi joy bo'sh turibdi. U yerga selektorni yozing.", 'Впиши селектор перед скобкой.', 'Type the selector before the brace.'),
      noDot: L3("Nuqta tushib qolibdi! Nuqtasiz brauzer sport degan tegni qidiradi, bunday teg esa yo'q. class nomining oldiga nuqta qo'ying.", 'Нет точки. Без неё браузер ищет тег sport. Поставь точку перед именем класса.', 'No dot. Without it the browser looks for a tag called sport. Put a dot before the class name.'),
      hash: L3("Panjara belgisi id uchun bo'ladi. Sport yangiliklarida esa class turibdi, unga nuqta kerak.", 'Решётка — для id. А у новостей sport класс, ему нужна точка.', 'A hash sign is for an id. The sport news items have a class, which needs a dot.'),
      tag: L3("Qarang: p hamma abzaslarni bo'yab yubordi, sportga aloqasi yo'qlarini ham. Bizga esa faqat sport degan class kerak.", 'p покрасил все абзацы, и не спортивные тоже. Нам нужен только класс sport.', 'p colored every paragraph, not just the sports ones. We need only the class sport.'),
      other: L3("Bu selektor sport yangiliklarini topa olmadi. HTML kodidagi class nomiga yana bir qarang-chi.", 'Этот селектор не выбрал новости sport. Посмотри на имя класса в HTML-коде.', 'This selector didn’t pick the sports news. Look at the class name in the HTML code.'),
      space: L3("Belgi bilan nomning o'rtasida bo'sh joy bo'lmaydi, ularni qo'shib yozing.", "Между знаком и именем не нужен пробел: пиши слитно.", "No space between the sign and the name: write them together.")
    },
    hints: [
      L3("Sport yangiliklari HTML kodida qaysi atribut bilan belgilangan: class bilanmi yoki id bilan?", 'Посмотри в HTML-код: у новостей sport class или id?', 'Look at the HTML code: do the sports news items have a class or an id?'),
      L3("class selektori ikki qismdan tuziladi: oldin nuqta, keyin class nomi.", 'Селектор класса — это точка и имя класса.', 'A class selector is a dot and the class name.'),
      L3("Qavsdan oldin nuqta qo'ying-da, ketidan sport deb yozing.", 'Поставь точку и напиши sport.', 'Put a dot and type sport.')
    ],
    ok: L3("Zo'r! Uchala sport yangiligi birdaniga yashil bo'ldi.", 'Огонь! Все три спортивные новости стали зелёными.', 'Awesome! All three sports news items turned green.'),
    ask: L3("Sport yangiliklarini yashil qiling: qavsdan oldin selektor", "Сделай новости sport зелёными: селектор перед скобкой", "Make the sport news green: the selector before the brace")
  },
  k3: {
    eyebrow: L3('class yoki id?', 'class или id?', 'class or id?'),
    say: L3("Saytimga yana to'rtta narsa qo'shmoqchiman, ular kartochkada birma-bir chiqadi. Har birini o'qing-da, unga class kerakmi yoki id, o'zingiz hal qiling.", 'Теперь выбери сам. Я назову вещь на странице, а ты выбери, нужен ей class или id.', 'Now you choose. I’ll name something on a page, and you choose whether it needs a class or an id.'),
    ask: L3('class yoki id?', 'class или id?', 'class or id?'),
    card: L3('Sahifada', 'На странице', 'On the page'),
    cls: L3('class', 'class', 'class'),
    id: L3('id', 'id', 'id'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("O'ylab ko'ring-chi: bunday narsa sahifada bitta bo'ladimi yoki ko'p?", 'Подумай: эта вещь на странице одна или их много?', 'Think: is this thing the only one on the page, or are there many?'),
    hint2: L3("Bir xil narsalar ko'p bo'lsa, class beramiz, sahifada yolg'iz bo'lsa, id beramiz.", 'Для многих одинаковых вещей берут class, для одной-единственной — id.', 'Use a class for many of the same thing, an id for the one and only.'),
    items: [
      { t: L3("Hamma sport yangiliklari", 'Все спортивные новости', 'All the sports news items'), right: 'cls',
        why: L3("Sport yangiliklari ko'p-ku, shuning uchun ularning hammasiga bitta class beramiz.", 'Спортивных новостей много, поэтому им дают один класс.', 'There are many sports news items, so they get one class.') },
      { t: L3("Sahifaning yagona sarlavhasi", 'Единственный заголовок страницы', 'The page’s only heading'), right: 'id',
        why: L3("Sahifada sarlavha bittagina, shuning uchun unga id beramiz.", 'Заголовок на странице один, ему дают id.', 'There’s only one heading on the page, so it gets an id.') },
      { t: L3("Har bir o'yin kartochkasi", 'Каждая карточка игры', 'Every game card'), right: 'cls',
        why: L3("O'yin kartochkalari ko'p va hammasi bir xil ko'rinadi, demak, ularga class kerak.", 'Карточек много, и они выглядят одинаково, значит, нужен класс.', 'There are many cards and they look the same, so a class is needed.') },
      { t: L3("Saytning bitta menyusi", 'Одно-единственное меню сайта', 'The site’s one and only menu'), right: 'id',
        why: L3("Menyu saytda bitta bo'ladi, shuning uchun unga id bersa bo'ladi.", 'Меню на странице одно, поэтому ему можно дать id.', 'There’s just one menu on the page, so it can get an id.') }
    ],
    ok: L3("To'rttasida ham adashmadingiz! Endi qayerga class, qayerga id kerakligini o'zingiz hal qila olasiz.", 'Всё верно! Теперь ты выбираешь class и id к месту.', 'All correct! Now you pick a class or an id where each fits.')
  },
  // Перенос: правило целиком своими руками.
  w1: {
    eyebrow: L3("Qoidani o'zingiz yozing", 'Напиши правило сам', 'Write the rule yourself'),
    say: L3("Endi katta ish: butun qoidani o'zingiz yozasiz! Sarlavhaga bosh degan id berilgan, uni binafsha rangga bo'yang. Selektordan boshlang, belgini esa unutmang!", 'Теперь напиши правило целиком сам. У заголовка id bosh. Сделай его фиолетовым. Начни с селектора и не забудь знак.', 'Now write the whole rule yourself. The heading’s id is bosh. Make it purple. Start with the selector and don’t forget the sign.'),
    msgs: {
      empty: L3("Qoida hali yozilmagan. Uni selektordan boshlang, keyin jingalak qavslar ichiga xususiyat bilan qiymatni yozing.", 'Напиши правило: сначала селектор, потом в фигурных скобках свойство и значение.', 'Write the rule: first the selector, then the property and value in curly braces.'),
      braces: L3("Qoidada jingalak qavslar tushib qolibdi: biri ochadi, biri yopadi, ikkalasi ham kerak.", 'Правилу нужны фигурные скобки: открывающая и закрывающая.', 'The rule needs curly braces: an opening one and a closing one.'),
      eq: L3("Tenglik belgisi bu yerga to'g'ri kelmaydi. CSS kodida xususiyat bilan qiymatni ikki nuqta ajratib turadi.", 'Здесь стоит знак «равно». В CSS между свойством и значением стоит двоеточие.', 'There’s an equals sign here. In CSS a colon goes between the property and the value.'),
      colon: L3("Xususiyat bilan qiymat o'rtasidagi ikki nuqta tushib qolibdi.", 'Между свойством и значением нет двоеточия.', 'There’s no colon between the property and the value.'),
      dot: L3("Nuqta class uchun bo'ladi-ku. Sarlavhaga esa id berilgan, unga panjara belgisi kerak.", 'Точка — для класса. А у заголовка id, ему нужна решётка.', 'A dot is for a class. The heading has an id, which needs a hash sign.'),
      noSign: L3("Nomdan oldin belgi tushib qolibdi. id nomining oldiga panjara belgisini qo'ying.", 'Нет знака. Поставь решётку перед именем id.', 'No sign. Put a hash sign before the id name.'),
      tag: L3("h1 ham sarlavhani bo'yaydi, lekin bu safar uni id orqali tanlashimiz kerak. Panjara belgisini qo'yib, ketidan bosh deb yozing.", 'h1 тоже покрасит заголовок, но задание — выбрать по id. Напиши решётку и bosh.', 'h1 would color the heading too, but the task is to pick it by id. Type the hash sign and bosh.'),
      sel: L3("Bu selektor sarlavhani topa olmadi. Sarlavhaga bosh degan id berilgan-ku.", 'Этот селектор не выбрал заголовок. Его id — bosh.', 'This selector didn’t pick the heading. Its id is bosh.'),
      prop: L3("Matnning rangini faqat color xususiyati o'zgartira oladi.", 'Цвет текста меняет свойство color.', 'The color property changes the text color.'),
      notColor: L3("Brauzer bunday rangni tanimadi. Binafsha rang inglizcha purple bo'ladi.", 'Браузер не знает такого цвета. Фиолетовый по-английски — purple.', 'The browser doesn’t know that color. Purple is purple.'),
      other: L3("Sarlavha boshqa rangga kirib qoldi. Bizga binafsha kerak, inglizchasi purple.", 'Это другой цвет. Нам нужен фиолетовый, по-английски purple.', 'That’s a different color. We need purple.')
    },
    hints: [
      L3("Sarlavhaning HTML kodiga qarang: unda qaysi atribut turibdi? Belgini shunga qarab tanlaymiz.", 'У заголовка class или id? От этого зависит знак.', 'Does the heading have a class or an id? The sign depends on that.'),
      L3("id selektori panjara belgisi bilan id nomidan tuziladi. Undan keyin jingalak qavslar ichiga color bilan purple yozasiz.", 'Селектор id — это решётка и имя id. Потом в фигурных скобках color и purple.', 'An id selector is a hash sign and the id name. Then color and purple in curly braces.'),
      L3("bosh degan id berilgan sarlavha uchun namuna kod ostida chiqdi. Uni harfma-harf ko'chirib yozing-da, «Tekshirish»ni bosing.", "Образец появился под кодом. Перепиши его в поле и нажми «Проверить».", "An example appeared under the code. Copy it into the field and tap Check.")
    ],
    ok: L3("Gap yo'q! Sarlavha binafsha bo'ldi, id bo'yicha qoidani esa boshidan oxirigacha o'zingiz yozdingiz.", 'Отлично! Ты сам написал целое правило по id.', 'Great! You wrote a whole id rule yourself.'),
    ask: L3("bosh degan id berilgan sarlavhani binafsha qiling: qoidani to'liq yozing", "Сделай заголовок с id bosh фиолетовым: напиши правило целиком", "Make the heading with id bosh purple: write the whole rule")
  },
  s8: {
    eyebrow: L3('Tanlov buzilsa', 'Когда выбор ломается', 'When picking breaks'),
    help: [
      L3("Nom ikki joyda yozilgan, shuning uchun ikkalasini solishtirib ko'ring: harflar bir xilmi? Keyin CSS kodidagi belgiga qarang: nuqta turibdimi yoki panjara?", 'Каждый раз сравни имя в двух местах: совпадают ли буквы в HTML и CSS, верный ли знак в CSS — точка или решётка?', 'Each time, compare the name in both places: do the letters match in HTML and CSS, and is the CSS sign right, dot or hash?'),
      L3("Nega brauzer elementni topolmay qoladi? Chunki u nomni harfma-harf solishtiradi. CSS kodida class uchun nuqta, id uchun panjara belgisi turadi, HTML kodida esa faqat nomning o'zi yoziladi.", 'Имя в двух местах пишется буква в букву. Для класса — точка, для id — решётка, а в HTML — только само имя.', 'The name is written letter for letter in both places. A dot for class, a hash for id, and in HTML only the name itself.'),
      L3("Pochtachi xatni manzildagi uy raqamiga qarab olib boradi. Raqamda bitta adashsangiz, xat boshqa uyga ketib qoladi. Brauzer ham elementni xuddi shunday, nomiga qarab topadi.", 'Почтальон находит дом по номеру. Ошибка в одной цифре — письмо уйдёт не туда. Браузер так же находит элемент по имени.', 'A mail carrier finds a house by its number. One wrong digit and the letter goes elsewhere. The browser finds an element by its name the same way.')
    ],
    say: L3("class va id nomlari bilan hazillashib bo'lmaydi: bitta harf yoki bitta belgi boshqacha bo'lsa, brauzer elementni topolmaydi. Qani, futbol haqidagi muhim abzasimda uchta shunday chalkashlikni ko'rib chiqamiz.", 'class и id любят точность. Ошибся в одном знаке или букве — и браузер не находит элемент. Посмотрим на три ошибки.', 'class and id love precision. One wrong sign or letter and the browser can’t find the element. Let’s look at three mistakes.'),
    sayTypo: L3("Birinchisi: CSS kodidagi nomda bitta harf o'zgarib qoldi. HTML kodida muhim turibdi, CSS kodida esa muhum. Brauzer bunday class nomini topolmadi, shuning uchun abzas bo'yalmadi.", 'Первая: в имени в CSS одна буква другая. В HTML — muhim, а в CSS — muhum. Браузер не нашёл такой класс, и ничего не покрасилось.', 'The first: one letter in the CSS name is different. HTML says muhim, CSS says muhum. The browser found no such class, so nothing got colored.'),
    sayHash: L3("Ikkinchisi: class uchun nuqta o'rniga panjara belgisini qo'ydik. Endi brauzer id nomi muhim bo'lgan elementni qidirib ketdi, bunday element esa sahifada yo'q.", 'Вторая: для класса вместо точки написали решётку. Теперь браузер ищет id muhim, а такого нет.', 'The second: a hash sign was written instead of a dot for a class. Now the browser looks for an id muhim, and there isn’t one.'),
    sayDotHtml: L3("Uchinchisi esa ayyorroq: nuqtani HTML kodiga ham yozib qo'ydik. Lekin HTML kodida nuqta kerak emas, u faqat CSS kodida turadi. Natijada ikki joydagi nomlar endi bir-biriga mos kelmayapti.", 'Третья: точку написали и в HTML. В HTML точка не нужна, она стоит только в CSS. Поэтому имена теперь не совпадают.', 'The third: the dot was also written in the HTML. HTML doesn’t need the dot; it only goes in CSS. So the names no longer match.'),
    done: L3("Xullas, nomni ikki joyda harfma-harf bir xil yozamiz. CSS kodida class uchun nuqta, id uchun panjara belgisi qo'yamiz, HTML kodida esa faqat nomning o'zi turadi.", 'Значит, пиши имя буква в букву, ставь точку для класса и решётку для id, а в HTML — только само имя.', 'So write the name letter by letter, use a dot for a class and a hash sign for an id, and in HTML just the name itself.'),
    askTypo: L3("Qarang: nomda bitta harf boshqa", 'Смотри: в имени другая буква', 'Watch: one letter differs in the name'),
    askHash: L3("Qarang: class uchun panjara belgisi", 'Смотри: решётка для класса', 'Watch: a hash sign for a class'),
    askDotHtml: L3("Qarang: HTML kodida ortiqcha nuqta", 'Смотри: лишняя точка в HTML', 'Watch: an extra dot in HTML'),
    askDone: L3("Nom, belgi va HTML — aniq", 'Имя, знак и HTML — точно', 'Name, sign and HTML — exact')
  },
  s9: {
    eyebrow: L3("Nuqtani qo'ying", 'Поставь точку', 'Add the dot'),
    say: L3("Voy, qoidam yana ishlamayapti! Bu dars boshidagi qoidamga o'xshab ketyapti-ku: abzasga muhim degan class berilgan, CSS kodiga ham muhim deb yozdim. Lekin nom oldida bitta belgi tushib qolibdi. Bo'sh joyga o'sha belgini yozib bering.", 'Ой, моё правило не работает! В HTML у абзаца класс muhim, в CSS я тоже написал muhim. Но не хватает одного знака. Впиши нужный знак в пустое место перед именем.', 'Oops, my rule doesn’t work! In HTML the paragraph’s class is muhim, and in CSS I wrote muhim too. But one sign is missing. Type the right sign in the empty spot before the name.'),
    msgs: {
      empty: L3("Nom oldidagi joy bo'shligicha qoldi. U yerga bitta belgi kerak.", 'Впиши один знак перед именем.', 'Type one sign before the name.'),
      hash: L3("Oz qoldi! Panjara belgisi id uchun bo'ladi, bu abzasga esa class berilgan.", 'Решётка — для id. А у этого абзаца класс.', 'A hash sign is for an id. This paragraph has a class.'),
      other: L3("Bu belgi bu yerga to'g'ri kelmaydi. class nomining oldida nuqta turadi.", 'Этот знак не подходит. Перед именем класса стоит точка.', 'That sign doesn’t fit. A dot goes before a class name.')
    },
    hints: [
      L3("Futbol abzasining HTML kodiga qarang-chi: unga class berilganmi yoki id?", 'Посмотри в HTML: у абзаца class или id?', 'Look at the HTML: does the paragraph have a class or an id?'),
      L3("CSS kodida class nomining oldida qaysi belgi turardi, esingizdami?", 'Помнишь, какой знак стоит в CSS перед именем класса?', 'Remember which sign goes before a class name in CSS?'),
      L3("Pastdagi nuqta tugmasini bosing-da, keyin «Tekshirish»ni bosing.", 'Нажми кнопку с точкой внизу, потом «Проверить».', 'Tap the dot button below, then Check.')
    ],
    ok: L3("Ishladi! Endi faqat futbol haqidagi muhim abzas qizil bo'ldi.", 'Отлично! Теперь красный только важный абзац.', 'Great! Now only the important paragraph is red.'),
    ask: L3("Nom oldiga kerakli belgini yozing", 'Впиши перед именем нужный знак', 'Type the right sign before the name')
  },
  s10: {
    eyebrow: L3('Xatoni toping', 'Найди ошибку', 'Find the bug'),
    say: L3("Yangiliklar sahifamda yana bir narsa bo'yalmay qolibdi! Kodda uchta qoida bor, lekin bittasi ishlamayapti. HTML kodini sahifa bilan solishtiring-da, o'sha qoidani bosing.", 'Теперь проверь себя. В коде три правила, но одно не работает. Посмотри на HTML и страницу и нажми сломанное правило.', 'Now check yourself. There are three rules in the code, but one doesn’t work. Look at the HTML and the page and tap the broken rule.'),
    say2: L3("Sport yangiliklari ko'k bo'ldi! Endi boshqa sahifamni ochdim, unda ham bitta qoida ishlamayapti. Bu safar qaysi biri aybdor?", 'Класс, первая ошибка найдена! Теперь сломалось другое правило. Какое?', 'Great, the first bug is found! Now another rule broke. Which one?'),
    ask: L3('Ishlamayotgan qoidani bosing', 'Нажми правило, которое не работает', 'Tap the rule that doesn’t work'),
    fine: L3("Yo'q, bu qoidaning ishi sahifada ko'rinib turibdi. Qaysi narsa rangsiz qolganini qidiring.", 'Это правило работает: его цвет виден на странице. Что не покрасилось?', 'This rule works: its color shows on the page. What didn’t get colored?'),
    found: {
      case: L3("Topdingiz! HTML kodida sport kichik harf bilan yozilgan, CSS kodida esa katta harf bilan boshlangan. Brauzer uchun katta va kichik harf ikki xil harf bo'ladi.", 'Есть! В HTML класс sport с маленькой буквы, а в CSS — с большой. Для браузера большая и маленькая буквы — разные буквы.', 'Found it! In HTML the class sport is lowercase, but in CSS it starts with a capital. Letter case matters in a class name too.'),
      sign: L3("Aybdorni topdingiz! Sarlavhaga logo degan class berilgan, CSS kodida esa id belgisi turibdi. class uchun nuqta kerak edi.", 'Нашёл! У заголовка класс logo, а в CSS стоит знак id. Для класса нужна точка.', 'Found it! The heading has the class logo, but CSS uses the id sign. A class needs a dot.')
    },
    hint1: L3("Sahifadagi qaysi narsa rangsiz qolibdi?", 'Посмотри на страницу: что осталось не покрашенным?', 'Look at the page: what stayed uncolored?'),
    hint2: {
      case: L3("Sport yangiliklari bo'yalmabdi. Nomni HTML va CSS kodida harfma-harf solishtiring, katta-kichik harflariga ham qarang.", 'Абзацы sport не покрасились. Сравни имя в HTML и CSS буква в букву, вплоть до больших и маленьких букв.', 'The sport paragraphs didn’t get colored. Compare the name in HTML and CSS letter by letter, down to capital letters.'),
      sign: L3("Sarlavha bo'yalmabdi. HTML kodida unga class berilganmi yoki id? CSS kodidagi belgi bunga mos keladimi?", 'Заголовок не покрасился. В HTML у заголовка class или id? Подходит ли знак в CSS?', 'The heading didn’t get colored. Does the heading have a class or an id in HTML? Does the sign in CSS match?')
    },
    hint3: {
      case: L3("Buzilish sport qoidasida: u yerda nom katta harf bilan boshlangan. O'sha qatorni bosing.", 'Ошибка в правиле sport: имя начинается с большой буквы. Нажми эту строку.', 'The bug is in the sport rule: the name starts with a capital. Tap that line.'),
      sign: L3("Buzilish logo qoidasida: class uchun id belgisi qo'yilgan. O'sha qatorni bosing.", 'Ошибка в правиле logo: для класса стоит знак id. Нажми эту строку.', 'The bug is in the logo rule: the id sign is used for a class. Tap that line.')
    },
    ok: L3("Ikkinchi aybdor ham qo'lga tushdi, yangiliklarim yana rang-barang! Endi katta-kichik harfdan tortib nuqtagacha, hech narsa ko'zingizdan qochmaydi.", 'Супер! Обе ошибки найдены. Ты проверяешь селекторы как настоящий программист.', 'Super! Both bugs are found. You check selectors like a real programmer.')
  },
  s11: {
    eyebrow: L3("Shaxsiy class", 'Свой класс', 'Your own class'),
    say: L3("Endi navbat sizga: o'z abzasingizga class bering! Unga o'zingiz nom o'ylab toping-da, ikki joyga yozing: HTML kodidagi class atributiga va CSS kodidagi nuqtadan keyin. Nomlar bir xil chiqsa, abzasingiz bo'yaladi. Keyin «Tayyor»ni bosing.",
      'Теперь дай своему абзацу класс. Придумай ему имя и впиши в два места: в атрибут class в HTML и после точки в CSS. Если имена совпадут, твой абзац покрасится. Потом нажми «Готово».',
      'Now give your paragraph a class. Make up a name and type it in two places: in the class attribute in HTML and after the dot in CSS. If the names match, your paragraph gets colored. Then tap “Done”.'),
    msgs: {
      empty: L3("Nom ikkala joyga ham yozilishi kerak: HTML kodiga ham, CSS kodiga ham.", 'Впиши имя класса в оба места.', 'Type the class name in both places.'),
      mismatch: L3("Nomlar bir-biriga o'xshamayapti: \u2063HTML kodida {a}, CSS kodida {b}\u2064. Ularni harfma-harf bir xil yozing.", 'Имена разные: \u2063в HTML {a}, в CSS {b}\u2064. Напиши их одинаково, буква в букву.', 'The names differ: \u2063{a} in HTML, {b} in CSS\u2064. Make them the same, letter by letter.'),
      bad: L3("class nomini lotin harflari, raqamlar va chiziqchadan tuzamiz, lekin u raqam bilan boshlanmaydi. Masalan, mening yoki rang1 degan nom bo'lishi mumkin.", 'В имени класса — только латинские буквы, цифры и дефис, и оно не начинается с цифры. Например, mening или rang1.', 'A class name uses only Latin letters, digits and dashes, and doesn’t start with a digit. For example, mening or rang1.'),
      dot: L3("HTML kodidagi class nomiga nuqta kerak emas, nuqta faqat CSS kodida turadi.", 'В имени класса в HTML точка не нужна. Точка стоит только в CSS.', 'No dot in the class name in HTML. The dot goes only in CSS.')
    },
    hints: [
      L3("Abzasingizga qanday nom qo'yasiz? O'zingiz o'ylab toping-chi.", 'Как назовёшь свой абзац? Придумай сам.', 'What will you name your paragraph? Make it up yourself.'),
      L3("Bitta nomni ikki joyga yozasiz: HTML kodiga nuqtasiz, CSS kodiga esa nuqtadan keyin.", 'Впиши одно и то же имя в два места: в HTML без точки, в CSS после точки.', 'Type the same name in two places: in HTML without a dot, in CSS after the dot.'),
      L3("Masalan, ikkala joyga mening deb yozing. Keyin «Tayyor»ni bosing.", 'Например, впиши в оба места mening. Потом нажми «Готово».', 'For example, type mening in both places. Then tap “Done”.')
    ],
    ok: L3("Ajoyib chiqdi! Abzasingiz o'zingiz qo'ygan class nomi bilan bo'yaldi.", 'Ого, класс! Твой абзац покрасился по своему классу.', 'Wow, great! Your paragraph got colored by its own class.'),
    ask: L3("class nomini ikki joyga yozing va «Tayyor»ni bosing", 'Впиши имя класса в два места и нажми «Готово»', 'Type the class name in two places and tap “Done”')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Endi rollarni almashamiz: men gapiraman, siz esa tekshiruvchi bo'lasiz. class, id va teglar haqida to'rtta gap aytaman. Har biri rostmi yoki yo'qmi, «To'g'ri» yoki «Noto'g'ri» tugmasi bilan javob bering.", 'Последнее испытание. Я скажу фразу, а ты выбери: верно это или нет.', 'The last test. I’ll say something, and you choose: true or false.'),
    ask: L3("To'g'ri yoki noto'g'ri?", 'Верно или нет?', 'True or false?'),
    card: L3('Kodi aytadi', 'Коди говорит', 'Kodi says'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Gapni bo'laklab o'qing-chi: u nima haqida? class haqidami, id haqidami yoki teg selektori haqidami?", 'Прочитай фразу по частям: она о классе, id или селекторе тега?', 'Read the sentence piece by piece: is it about a class, an id or a tag selector?'),
    hint2: L3("Darsdan nimalar esda qoldi? class nomini ko'p elementga, id nomini esa faqat bittasiga beramiz. CSS kodida class uchun nuqta, id uchun panjara belgisi turadi. Gap shunga to'g'ri keladimi?",
      'Вспомни урок: класс дают нескольким элементам, id — только одному. В CSS для класса точка, для id — решётка. Фраза с этим совпадает?',
      'Remember the lesson: a class goes on several elements, an id on just one. In CSS a class gets a dot, an id a hash sign. Does the sentence match that?'),
    items: [
      { t: L3("Bitta class nomini bir nechta elementga berish mumkin.", 'Один класс можно дать нескольким элементам.', 'One class can be given to several elements.'), right: true,
        why: L3("Masalan, ikkita abzasga sport degan class berilgan bo'lsa, bitta qoida ikkalasini ham bo'yaydi.", 'Верно: например, если у двух абзацев класс sport, правило покрасит оба.', 'Right: for example, if two paragraphs have the class sport, the rule colors both.') },
      { t: L3("CSS kodida id nomining oldiga nuqta qo'yiladi.", 'В CSS перед именем id ставят точку.', 'In CSS a dot goes before an id name.'), right: false, code: 'id',
        why: L3("Aslida id nomining oldida panjara belgisi turadi, nuqta esa class uchun.", 'На самом деле для id ставят решётку. Точка — для класса.', 'Actually an id gets a hash sign. The dot is for a class.') },
      { t: L3("CSS kodidagi class nomi HTML kodidagi bilan harfma-harf bir xil bo'lishi kerak.", 'Имя класса в CSS должно совпадать с HTML буква в букву.', 'The class name in CSS must match the HTML letter by letter.'), right: true, code: 'cls',
        why: L3("Nomda bitta harf boshqacha bo'lsa ham, brauzer elementni topolmay qoladi.", 'Так и есть: даже одна другая буква — и браузер не найдёт элемент.', 'That’s right: even one different letter and the browser won’t find the element.') },
      { t: L3("p selektori faqat birinchi abzasni bo'yaydi.", 'Селектор p красит только первый абзац.', 'The p selector colors only the first paragraph.'), right: false,
        why: L3("p selektori bittasini emas, sahifadagi hamma abzaslarni bo'yaydi. Dars boshidagi qip-qizil sahifam esingizdami?", 'На самом деле селектор p красит все абзацы на странице.', 'Actually the p selector colors every paragraph on the page.') }
    ],
    ok: L3("Zo'r tekshiruvchi ekansiz: birorta gapimga ham aldanmadingiz! Selektorlarni endi yaxshi bilasiz.", 'Всё верно! Ты отлично знаешь селекторы.', 'All correct! You know selectors really well.')
  },
  s12: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi ichimdagi ikki ovozning bahsini hal qilamiz. Mana o'sha qoida: abzas haliyam bo'yalmay turibdi, demak, «Nimadir yetishmayapti» degan ovoz haq chiqdi! Sababini esa endi o'zingiz ham bilasiz: muhim so'zining oldida nuqta yo'q. Nuqta bo'lmasa, brauzer muhim degan tegni qidiradi, bunday teg esa yo'q. class nomining oldida doim nuqta turishi kerak.",
        'Вернёмся к загадке. Помнишь, я написал в CSS muhim, без точки? Увы, я ошибся. Без точки браузер ищет тег muhim, а такого тега нет. Поэтому абзац не покрасился. Перед именем класса всегда стоит точка.',
        'Back to our riddle. Remember, I wrote muhim in CSS, with no dot? Sadly, I was wrong. Without the dot the browser looks for a tag called muhim, and there isn’t one. That’s why the paragraph didn’t get colored. A class name always has a dot before it.'), k: 'riddle' },
      { text: L3("Sizning abzasingiz ham o'zingiz o'ylab topgan class nomi bilan bo'yalib turibdi, bir qarang!", 'Смотри, это твой абзац со своим классом!', 'Look, this is your paragraph with its own class!'), k: null },
      { text: L3("Teg selektori sahifadagi shu teg bilan yozilgan hamma elementlarni tanlaydi: masalan, p hamma abzaslarni tanlaydi.", 'Селектор тега выбирает все элементы с этим тегом.', 'A tag selector picks every element with that tag.'), k: 'tag' },
      { text: L3("class selektori nuqta bilan yoziladi va shu class nomi berilgan hamma elementlarni tanlaydi.", 'Селектор класса пишут с точкой, он выбирает все элементы с этим классом.', 'A class selector is written with a dot and picks every element with that class.'), k: 'cls' },
      { text: L3("id selektori esa panjara belgisi bilan yoziladi va faqat bitta elementni tanlaydi.", 'Селектор id пишут с решёткой, он выбирает один элемент.', 'An id selector is written with a hash sign and picks one element.'), k: 'id' },
      { text: L3("Tabriklayman! Endi sahifadagi istalgan elementni nishonga olib bo'yay olasiz. Keyingi darsda esa ranglarning o'zini chuqurroq o'rganamiz. Ko'rishguncha!", 'Ура! Теперь ты можешь точно выбрать любой элемент. На следующем уроке разберёмся с цветами глубже. До встречи!', 'Hooray! Now you can pick any element exactly. Next time we’ll dig deeper into colors. See you!'), k: null }
    ],
    roles: {
      tag: L3("p — hamma p teglari", 'p — все теги p', 'p — every p tag'),
      cls: L3(".class — guruh", '.class — группа', '.class — a group'),
      id: L3("#id — bitta element", '#id — один элемент', '#id — one element')
    },
    ask: L3('Abzasingizga qarang', 'Посмотри на свой абзац', 'Look at your paragraph')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, sayCls: 1, sayId: 1, hint1: 1, hint2: 1, hint3: 1, why: 1, magic: 1, magicP: 1, msgs: 1, sayHtml: 1, sayCss: 1, sayTypo: 1, sayHash: 1,
  sayDotHtml: 1, miss: 1, say2: 1, fine: 1, found: 1, got: 1, items: 1, right: 1, pairOk: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { code: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:c2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:c2.css@*/
`;
