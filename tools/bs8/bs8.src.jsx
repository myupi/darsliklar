// =============================================================================
// МОДУЛЬ «BOOTSTRAP» · Урок 9 — «Карусель»
// (облик «Редактор», как уроки 1–7 модуля; 20.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/bs8/build.mjs → lessons/bootstrap/09-karusel.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 8 · «Карусель» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (20.11.2026). На главной странице кружка три фото стоят друг под другом — страница длинная. Ученик делает из них
// карусель Bootstrap 6: carousel → carousel-inner → carousel-item (по одному фото; листается сама прокрутка браузера,
// scroll-snap), active — с какого фото начать; кнопки btn-icon с data-bs-slide и data-bs-target="#galereya", точки
// carousel-indicators, автопрокрутка data-bs-autoplay="true", время — data-bs-interval у фото (миллисекунды), плавная
// смена — carousel-fade. Кнопки и автопрокрутку ведёт скрипт Bootstrap — строка script из урока 1 (без неё кнопки мёртвые).
// Загадка (без имён): Коди думает, что для карусели надо писать свой JavaScript; разгадка — классы, data-bs-* и одна строка.
//
// ДУГА (17 экранов). Сценарий — docs/scenarij-bootstrap-09-karusel.md.
//
// СИСТЕМА СЛОВ: carousel, carousel-inner, carousel-item, active, data-bs-*, carousel-fade — по-английски; karusel —
// карусель; slayd / rasm — слайд; tugma — кнопка; nuqtalar — точки (indicators); millisekund — миллисекунда.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'bootstrap-09-karusel',
  module: 'bootstrap-m1',
  lessonTitle: {
    uz: '9-dars. Karusel',
    ru: 'Урок 9. Карусель',
    en: 'Lesson 9. Carousel'
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
  next: L3('Menu va Dialog', 'Menu и Dialog', 'Menu and Dialog'),
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
    title: L3("Robot to'garagi", 'Кружок роботов', 'Robot club')
  },
  fill: {
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    msgs: {
      empty: L3("Bo'sh joyga yozing.", 'Впиши в пустое место.', 'Type into the empty spot.'),
      dot: L3("Nuqta kerak emas. class ichida so'z nuqtasiz yoziladi.", 'Точка не нужна. В class слово пишется без точки.', 'No dot needed. Inside class the word goes without it.'),
      cyr: L3("Bu yerga lotin harflari kerak. Bootstrap so'zlari inglizcha.", 'Здесь нужны латинские буквы. Слова Bootstrap — английские.', 'Latin letters are needed here. Bootstrap’s words are English.'),
      one: L3("Bu joyga bitta so'z kerak, ichida bo'sh joy bo'lmasin.", 'Сюда нужно одно слово, без пробелов внутри.', 'One word goes here, with no spaces inside.'),
      native: L3("Bootstrap o'z so'zlarini biladi. Inglizcha so'zni saytdan oling.", 'Bootstrap знает свои слова. Возьми английское слово с сайта.', 'Bootstrap knows its own words. Take the English word from the site.'),
      typo: L3("Harflarni tekshiring. To'g'risi: {w}.", 'Проверь буквы. Правильно: {w}.', 'Check the letters. It’s spelled {w}.'),
      noPrefix: L3("Oz qoldi! Saytda bu so'z to'liq yozilgan: {w}.", 'Почти! На сайте это слово записано целиком: {w}.', 'Close! On the site the word is written in full: {w}.'),
      old: L3("Bu eski nom, beshinchi versiyadan. Oltinchi versiyada u ishlamaydi.", 'Это старое имя из пятой версии. В шестой оно не работает.', 'That’s an old name from version five. It doesn’t work in version six.'),
      fam: L3("{w} boshqa narsa uchun. Bu yerga boshqa so'z kerak.", '{w} — для другой вещи. Сюда нужно другое слово.', '{w} is for something else. This spot needs another word.'),
      other: L3("Bootstrap bu so'zni biladi, lekin natija namunadagidek emas.", 'Bootstrap это слово знает, но результат не как в образце.', 'Bootstrap knows that word, but the result isn’t like the goal.'),
      unknown: L3("Bootstrap bunday so'zni bilmaydi: \u2063{w}\u2064. Shuning uchun hech narsa o'zgarmadi.", 'Bootstrap не знает такого слова: \u2063{w}\u2064. Поэтому ничего не изменилось.', 'Bootstrap doesn’t know this word: \u2063{w}\u2064. So nothing changed.'),
      dir: L3("Bu tugma o'ngga, ya'ni keyingi rasmga o'tkazishi kerak. next — keyingi, prev — oldingi degani.", 'Эта кнопка должна листать вправо, к следующему фото. next — следующий, prev — предыдущий.', 'This button should go right, to the next photo. next means next, prev means previous.'),
      dirWord: L3("Bootstrap inglizcha qisqa so'zni kutadi: {w}.", 'Bootstrap ждёт короткое английское слово: {w}.', 'Bootstrap expects a short English word: {w}.'),
      noHash: L3("id ga ishora qilganda oldiga panjara qo'yiladi: {w}. Busiz tugma karuselni topmaydi.", 'Когда указываешь на id, впереди ставится решётка: {w}. Без неё кнопка не найдёт карусель.', 'Pointing to an id needs a hash in front: {w}. Without it the button won’t find the carousel.'),
      otherId: L3("Bunday id yo'q. Karuselning id si birinchi qatorda: {w}.", 'Такого id нет. id карусели — в первой строке: {w}.', 'There’s no such id. The carousel’s id is on the first line: {w}.'),
      dotTarget: L3("Nuqta class uchun. id ga panjara bilan ishora qilinadi: {w}.", 'Точка — для class. На id указывают решёткой: {w}.', 'A dot is for class. An id is pointed to with a hash: {w}.'),
      autoFalse: L3("false — o'chiq degani. Rasmlar o'zi aylansin desangiz, yoqiq so'zini yozing.", 'false значит «выключено». Чтобы фото листались сами, нужно «включено».', 'false means off. For the photos to change by themselves, it needs on.'),
      autoYes: L3("Oz qoldi! Bootstrap bu yerda inglizcha {w} so'zini kutadi.", 'Почти! Bootstrap ждёт здесь английское {w}.', 'Close! Bootstrap expects the English word {w} here.'),
      msSec: L3("Vaqt soniyada emas, millisekundda yoziladi va harfsiz: \u2063{w}\u2064.", 'Время пишется не в секундах, а в миллисекундах и без букв: \u2063{w}\u2064.', 'Time is written in milliseconds, without letters: \u2063{w}\u2064.'),
      msSmall: L3("Bu juda kam: vaqt millisekundda. 1 soniya — 1000.\u2063 Demak: {w}.\u2064", 'Это слишком мало: время в миллисекундах. 1 секунда — 1000.\u2063 Значит: {w}.\u2064', 'That’s too little: the time is in milliseconds. 1 second is 1000.\u2063 So: {w}.\u2064'),
      msUnit: L3("ms yozish shart emas, faqat raqam: \u2063{w}\u2064.", 'ms писать не нужно, только число: \u2063{w}\u2064.', 'No need for ms, just the number: \u2063{w}\u2064.'),
      msOther: L3("Raqam to'g'ri yozilgan, lekin vaqt boshqa. 3 soniya necha millisekund?", 'Число записано верно, но время другое. 3 секунды — это сколько миллисекунд?', 'The number is fine, but the time is different. How many milliseconds is 3 seconds?'),
      msNum: L3("Bu yerga faqat raqam kerak, millisekundlarda.", 'Сюда нужно только число, в миллисекундах.', 'Only a number goes here, in milliseconds.')
    }
  },
  s1: {
    eyebrow: L3('Galereya', 'Галерея', 'Gallery'),
    say: L3("Salom! To'garak saytida uchta rasm bor, lekin ular bir-birining ostida turibdi. Sahifa juda uzun bo'lib ketdi, pastga ancha surish kerak. Saytlarda rasmlar ko'pincha bitta joyda almashib turadi. Keling, Bootstrapdan yordam so'raymiz. «Bootstrap bilan» tugmasini bosing.",
      'Привет! На сайте кружка три фото, но они стоят друг под другом. Страница получилась очень длинной, листать приходится долго. На сайтах фото часто сменяют друг друга в одном месте. Давай попросим помощи у Bootstrap. Нажми «С Bootstrap».',
      'Hi! The club site has three photos, but they’re stacked. The page got really long, you have to scroll a lot. On websites photos often take turns in one spot. Let’s ask Bootstrap for help. Tap “With Bootstrap”.'),
    magic: L3("Voy! Endi bitta joyda bitta rasm, pastida esa ikkita tugma. Bu karusel, ya'ni aylanadigan rasmlar degani. Kodga qarang: yangi so'zlar va oxirida tanish script qatori.",
      'Ого! Теперь в одном месте одно фото, а под ним две кнопки. Это карусель — фото, которые сменяют друг друга. Посмотри на код: новые слова, а в конце знакомая строка script.',
      'Whoa! Now there’s one photo in one spot, with two buttons below. That’s a carousel, photos that take turns. Look at the code: new words, and the familiar script line at the end.'),
    done: L3("Bugun karusel yasaymiz: rasmlar tugma bilan ham, o'zi ham almashadi. Lekin oldin topishmoq. Menimcha, rasmlarni aylantirish uchun uzun JavaScript kodini o'zimiz yozishimiz kerak. Men esa JavaScriptni hali bilmayman! Siz nima deb o'ylaysiz? Javobni dars oxirida topamiz.",
      'Сегодня делаем карусель: фото листаются и кнопками, и сами. Но сначала загадка. По-моему, чтобы фото листались, нужно самим написать длинный код на JavaScript. А я JavaScript ещё не знаю! Как думаешь? Ответ найдём в конце урока.',
      'Today we make a carousel: photos change with buttons and by themselves. But first, a riddle. I think to make photos slide we must write a long JavaScript program ourselves. And I don’t know JavaScript yet! What do you think? We’ll find out at the end of the lesson.'),
    ask: L3('«Bootstrap bilan» tugmasini bosing', 'Нажми «С Bootstrap»', 'Tap “With Bootstrap”'),
    askDone: L3('carousel · carousel-inner · carousel-item', 'carousel · carousel-inner · carousel-item', 'carousel · carousel-inner · carousel-item')
  },
  s2: {
    eyebrow: L3('Karusel qanday tuzilgan', 'Как устроена карусель', 'How a carousel is built'),
    help: [
      L3("Kodda carousel-inner va carousel-item so'zlariga, sahifada rasmlarga qarang.", 'Посмотри на слова carousel-inner и carousel-item в коде и на фото на странице.', 'Look at carousel-inner and carousel-item in the code and the photos on the page.'),
      L3("carousel-inner rasmlarni bitta qatorga tizadi va yonga suriladigan qiladi. carousel-item har bir rasmni butun kenglikka cho'zadi, shuning uchun bittadan ko'rinadi.", 'carousel-inner ставит фото в один ряд и делает его прокручиваемым вбок. carousel-item растягивает каждое фото на всю ширину, поэтому видно по одному.', 'carousel-inner lines the photos up in one row that scrolls sideways. carousel-item stretches each photo to full width, so you see one at a time.'),
      L3("Bu kinoplyonkaga o'xshaydi: kadrlar qatorda, oynada esa bittasi ko'rinadi.", 'Это как киноплёнка: кадры в ряд, а в окошке виден один.', 'It’s like a film strip: frames in a row, one visible in the window.')
    ],
    say: L3("Karusel qanday ishlaydi? Hozir class yo'q, rasmlar ostma-ost. Qarang.", 'Как работает карусель? Сейчас class нет, фото друг под другом. Смотри.', 'How does a carousel work? Right now there’s no class, the photos are stacked. Watch.'),
    sayInner: L3("Tashqi qutiga carousel, ichkisiga carousel-inner yozdim. Rasmlar bitta qatorga tizildi, lekin hammasi kichkina.", 'Внешней коробке написал carousel, внутренней — carousel-inner. Фото встали в один ряд, но все маленькие.', 'I gave the outer box carousel and the inner one carousel-inner. The photos lined up in a row, but they’re all small.'),
    sayItem: L3("Har bir rasm qutisiga carousel-item yozdim. Endi har biri butun kenglikda, oynada bittasi ko'rinadi. Birinchisida active ham bor, ya'ni boshlanadigan rasm degani.", 'Каждой коробке с фото написал carousel-item. Теперь каждое во всю ширину, в окне видно одно. У первого ещё active, то есть фото, с которого начинаем.', 'I gave each photo box carousel-item. Now each is full width, one shows in the window. The first also has active, the photo we start from.'),
    saySwipe: L3("Qolgan rasmlar yonida, ko'rinmay turibdi. Barmoq bilan surib ko'rdim: keyingi rasm chiqdi! Surish uchun skript ham kerak emas, buni brauzerning o'zi qiladi.", 'Остальные фото рядом, их не видно. Провёл пальцем — появилось следующее фото! Чтобы листать пальцем, даже скрипт не нужен, это делает сам браузер.', 'The other photos are beside it, out of view. I swiped: the next photo appeared! Swiping doesn’t even need a script, the browser does it.'),
    done: L3("Eslab qoling: carousel ichida carousel-inner, uning ichida carousel-item lar.", 'Запомни: в carousel — carousel-inner, в нём — carousel-item.', 'Remember: carousel-inner goes in carousel, carousel-item goes in carousel-inner.'),
    askStart: L3("Qarang: class yo'q", 'Смотри: class нет', 'Watch: no class'),
    askInner: L3('Qarang: carousel-inner', 'Смотри: carousel-inner', 'Watch: carousel-inner'),
    askItem: L3('Qarang: carousel-item', 'Смотри: carousel-item', 'Watch: carousel-item'),
    askSwipe: L3('Qarang: surildi', 'Смотри: листаем', 'Watch: a swipe'),
    askDone: L3('carousel → carousel-inner → carousel-item', 'carousel → carousel-inner → carousel-item', 'carousel → carousel-inner → carousel-item')
  },
  x1: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz suring. Sahifadagi rasmni barmoq bilan chapga torting. Kompyuterda sichqoncha bilan bosib torting. Uchala rasmni ko'ring.",
      'Теперь листай сам. Потяни фото на странице пальцем влево. На компьютере — зажми мышкой и потяни. Посмотри все три фото.',
      'Now swipe yourself. Drag the photo on the page to the left with your finger. On a computer, press and drag with the mouse. See all three photos.'),
    more: L3("Yangi rasm! Yana suring.", 'Новое фото! Листай дальше.', 'A new photo! Keep swiping.'),
    ok: L3("Ajoyib! Uchala rasm ham bitta joyda, navbat bilan.", 'Отлично! Все три фото в одном месте, по очереди.', 'Great! All three photos in one spot, one after another.'),
    done: L3("Endi karuselni Bootstrap saytidan olamiz.", 'Теперь возьмём карусель с сайта Bootstrap.', 'Now let’s take a carousel from the Bootstrap site.'),
    hints: [
      L3("Sahifadagi rasmni chapga torting.", 'Потяни фото на странице влево.', 'Drag the photo on the page to the left.'),
      L3("Barmoqni rasmga qo'yib, chapga suring. Sichqonchada bosib turib torting.", 'Поставь палец на фото и веди влево. Мышкой — зажми и тяни.', 'Put your finger on the photo and slide left. With a mouse, press and drag.'),
      L3("Ikki marta chapga suring: ikkinchi va uchinchi rasm chiqadi.", 'Потяни влево два раза: появятся второе и третье фото.', 'Swipe left twice: the second and third photos appear.')
    ],
    ask: L3("Rasmlarni suring", 'Листай фото', 'Swipe the photos'),
    askDone: L3("Uchala rasm ko'rildi", 'Все три фото просмотрены', 'All three photos seen')
  },
  g1: {
    eyebrow: L3('Carousel sahifasi', 'Страница Carousel', 'The Carousel page'),
    help: [
      L3("Menyudagi Components bo'limiga, Carousel sahifasiga va nusxa olish belgisiga qarang.", 'Посмотри на раздел Components в меню, страницу Carousel и значок копирования.', 'Look at Components in the menu, the Carousel page and the copy icon.'),
      L3("Saytdagi misolda rasmlar o'rnida uch nuqta turadi. Nusxalagach, o'z rasmlarimiz nomini yozamiz.", 'В примере на сайте вместо фото стоят три точки. После копирования пишем имена своих фото.', 'In the site example the photos are three dots. After copying, we type our own photo names.'),
      L3("Bu bo'sh ramkalarga o'xshaydi: ramkani olasiz, ichiga o'z suratingizni qo'yasiz.", 'Это как пустые рамки: берёшь рамку и вставляешь своё фото.', 'It’s like empty frames: you take a frame and put your own photo in.')
    ],
    say: L3("Karuselni saytdan olamiz. U Components bo'limida. Qarang.", 'Карусель возьмём с сайта. Она в разделе Components. Смотри.', 'Let’s take the carousel from the site. It’s in Components. Watch.'),
    sayPage: L3("Carousel sahifasi. Bottom controls misoli: rasmlar va pastida ikkita tugma. Nusxa olamiz.", 'Страница Carousel. Пример Bottom controls: фото и две кнопки снизу. Копируем.', 'The Carousel page. The Bottom controls example: photos with two buttons below. Let’s copy it.'),
    sayPaste: L3("Kodni body ichiga qo'ydim. Lekin rasmlar singan! Saytdagi misolda rasm nomi o'rnida uch nuqta turibdi.", 'Вставил код в body. Но фото сломаны! В примере на сайте вместо имени фото стоят три точки.', 'I pasted the code into body. But the photos are broken! The site example has three dots instead of a photo name.'),
    sayPics: L3("Uch nuqta o'rniga o'z rasmlarimiz nomini yozdim: slayd1, slayd2 va slayd3. Rasmlar chiqdi.", 'Вместо трёх точек написал имена своих фото: slayd1, slayd2 и slayd3. Фото появились.', 'Instead of the three dots I typed our photo names: slayd1, slayd2 and slayd3. The photos appeared.'),
    sayNext: L3("O'ngdagi tugmani bosdim, keyingi rasm chiqdi! Tugma ishlaydi, chunki pastda birinchi darsdagi script qatori bor.", 'Нажал правую кнопку — появилось следующее фото! Кнопка работает, потому что внизу есть строка script с первого урока.', 'I tapped the right button and the next photo appeared! The button works because the script line from lesson one is at the bottom.'),
    done: L3("Eslab qoling: karusel Components bo'limida, Carousel sahifasida.", 'Запомни: карусель — в разделе Components, на странице Carousel.', 'Remember: the carousel is in Components, on the Carousel page.'),
    askStart: L3('Qarang: menyu', 'Смотри: меню', 'Watch: the menu'),
    askMenu: L3('Qarang: Components → Carousel', 'Смотри: Components → Carousel', 'Watch: Components → Carousel'),
    askPage: L3('Qarang: Bottom controls', 'Смотри: Bottom controls', 'Watch: Bottom controls'),
    askPaste: L3("Qarang: rasmlar singan", 'Смотри: фото сломаны', 'Watch: broken photos'),
    askPics: L3("Qarang: o'z rasmlarimiz", 'Смотри: свои фото', 'Watch: our own photos'),
    askNext: L3("Qarang: tugma ishladi", 'Смотри: кнопка работает', 'Watch: the button works'),
    askDone: L3('Components → Carousel', 'Components → Carousel', 'Components → Carousel')
  },
  t1: {
    eyebrow: L3("Karuselni yig'ing", 'Собери карусель', 'Build the carousel'),
    say: L3("Endi o'zingiz. Namunaga qarang va bo'sh joyga kerakli so'zni yozing.", 'Теперь сам. Посмотри на образец и впиши в пустое место нужное слово.', 'Now you. Look at the goal and type the right word into the empty spot.'),
    ask1: L3("Rasmlar ustma-ust emas, bittadan chiqsin", 'Фото не столбиком, а по одному', 'Show the photos one at a time, not in a stack'),
    ask2: L3("Namunadagi uchinchi rasm sahifada ham chiqsin", 'Третье фото из образца — пусть будет и на странице', 'Make the goal’s third photo show on the page too'),
    ask3: L3("Karusel ikkinchi rasmdan boshlansin", 'Карусель начинается со второго фото', 'Start the carousel from the second photo'),
    hints1: [
      L3("Rasmlar qaysi quti ichida turadi?", 'В какой коробке стоят фото?', 'Which box holds the photos?'),
      L3("carousel so'zidan keyin inner, ya'ni ichki degani.", 'После carousel идёт inner, то есть «внутренний».', 'After carousel comes inner, meaning inside.'),
      L3("Yozing: carousel-inner", 'Впиши: carousel-inner', 'Type: carousel-inner')
    ],
    hints2: [
      L3("Qolgan ikki rasm qutisida qaysi so'z bor?", 'Какое слово у двух других коробок с фото?', 'Which word do the other two photo boxes have?'),
      L3("Bitta rasm inglizcha item, ya'ni bo'lak degani.", 'Одно фото — item, то есть «элемент».', 'One photo is an item.'),
      L3("Yozing: carousel-item", 'Впиши: carousel-item', 'Type: carousel-item')
    ],
    hints3: [
      L3("Qaysi so'z boshlanadigan rasmni belgilaydi?", 'Какое слово отмечает фото, с которого начинаем?', 'Which word marks the starting photo?'),
      L3("Bu so'z ikkinchi tushuntirishda edi: faol degani.", 'Это слово было во втором показе: «активный».', 'That word was in the second show: it means active.'),
      L3("Yozing: active", 'Впиши: active', 'Type: active')
    ],
    why1: L3("carousel-inner rasmlarni bir qatorga terdi: endi ular bittadan ko'rinadi.", 'carousel-inner выстроил фото в ряд: теперь их видно по одному.', 'carousel-inner lined the photos up in a row: now they show one at a time.'),
    why2: L3("carousel-item uchinchi rasmni ham karusel rasmi qildi: endi u ko'rinadi.", 'carousel-item сделал и третье фото слайдом: теперь его видно.', 'carousel-item made the third photo a slide too: now you can see it.'),
    why3: L3("active karuselni ikkinchi rasmdan boshladi.", 'active начал карусель со второго фото.', 'active started the carousel from the second photo.'),
    done: L3("Qoyil! Karusel tuzilishi tayyor.", 'Класс! Устройство карусели готово.', 'Nice! The carousel structure is ready.')
  },
  s6: {
    eyebrow: L3('Tugmalar', 'Кнопки', 'Buttons'),
    help: [
      L3("Tugma qatoridagi data-bs-slide va data-bs-target ga, kod oxiridagi script qatoriga qarang.", 'Посмотри на data-bs-slide и data-bs-target в строке кнопки и на строку script в конце кода.', 'Look at data-bs-slide and data-bs-target on the button line and the script line at the end.'),
      L3("data-bs-slide qayoqqa surishni aytadi: next — keyingi, prev — oldingi. data-bs-target qaysi karuselni surishni aytadi: panjara va id. Tugmani esa Bootstrap skripti ishlatadi.", 'data-bs-slide говорит, куда листать: next — вперёд, prev — назад. data-bs-target говорит, какую карусель: решётка и id. А саму кнопку запускает скрипт Bootstrap.', 'data-bs-slide says which way: next or prev. data-bs-target says which carousel: a hash and the id. And Bootstrap’s script makes the button work.'),
      L3("Bu pultga o'xshaydi: tugmada nima qilish yozilgan, lekin batareyasiz ishlamaydi.", 'Это как пульт: на кнопке написано, что делать, но без батарейки он не работает.', 'It’s like a remote: the button says what to do, but it won’t work without batteries.')
    ],
    say: L3("Tugmalarni ko'rib chiqamiz. Hozir kodda script qatori yo'q. Qarang, nima bo'ladi.", 'Разберём кнопки. Сейчас в коде нет строки script. Смотри, что будет.', 'Let’s look at the buttons. Right now there’s no script line in the code. Watch what happens.'),
    sayDead: L3("O'ng tugmani bosdim, lekin hech narsa bo'lmadi. Tugma o'lik!", 'Нажал правую кнопку, но ничего не произошло. Кнопка не работает!', 'I tapped the right button, but nothing happened. The button is dead!'),
    sayScript: L3("Pastga birinchi darsdagi script qatorini qo'ydim. Bu Bootstrapning skripti, tugmalarni u ishlatadi.", 'Добавил внизу строку script с первого урока. Это скрипт Bootstrap, кнопки работают благодаря ему.', 'I added the script line from lesson one at the bottom. It’s Bootstrap’s script, and it makes the buttons work.'),
    sayNext: L3("Yana bosdim, rasm almashdi! Tugmada data-bs-slide va next yozilgan, ya'ni keyingi rasmga degani.", 'Нажал ещё раз — фото сменилось! У кнопки написано data-bs-slide и next, то есть «к следующему фото».', 'I tapped again and the photo changed! The button says data-bs-slide with next, meaning go to the next photo.'),
    sayTarget: L3("data-bs-target esa qaysi karuselni surishni aytadi: panjara va karusel id si, galereya. Sahifada karusel bir nechta bo'lsa ham, tugma o'zinikini topadi.", 'А data-bs-target говорит, какую карусель листать: решётка и id карусели, galereya. Даже если каруселей несколько, кнопка найдёт свою.', 'And data-bs-target says which carousel to slide: a hash and the carousel’s id, galereya. Even with several carousels, the button finds its own.'),
    done: L3("Eslab qoling: tugmaga data-bs-slide va data-bs-target, kod oxirida esa script qatori kerak.", 'Запомни: кнопке нужны data-bs-slide и data-bs-target, а в конце кода — строка script.', 'Remember: a button needs data-bs-slide and data-bs-target, and the code needs the script line at the end.'),
    askStart: L3("Qarang: script yo'q", 'Смотри: script нет', 'Watch: no script'),
    askDead: L3('Qarang: tugma ishlamadi', 'Смотри: кнопка молчит', 'Watch: the button is dead'),
    askScript: L3('Qarang: script qatori', 'Смотри: строка script', 'Watch: the script line'),
    askNext: L3('Qarang: data-bs-slide', 'Смотри: data-bs-slide', 'Watch: data-bs-slide'),
    askTarget: L3('Qarang: data-bs-target', 'Смотри: data-bs-target', 'Watch: data-bs-target'),
    askDone: L3('data-bs-slide · data-bs-target · script', 'data-bs-slide · data-bs-target · script', 'data-bs-slide · data-bs-target · script')
  },
  t2: {
    eyebrow: L3('Tugmani sozlang', 'Настрой кнопку', 'Set up the button'),
    say: L3("O'ng tugma ishlamayapti. Kodga qarang va bo'sh joyga kerakli so'zni yozing. Keyin tugmani sahifada bosib tekshiring.", 'Правая кнопка не работает. Посмотри на код и впиши в пустое место нужное слово. Потом проверь кнопку на странице.', 'The right button doesn’t work. Look at the code and type the right word into the empty spot. Then test the button on the page.'),
    ask1: L3("O'ng tugma keyingi rasmga o'tkazsin", 'Правая кнопка листает к следующему фото', 'The right button goes to the next photo'),
    ask2: L3("O'ng tugma bizning karuselni topsin", 'Правая кнопка находит нашу карусель', 'The right button finds our carousel'),
    hints1: [
      L3("Chap tugmada prev yozilgan. O'ngdagisi teskarisi.", 'У левой кнопки prev. У правой — наоборот.', 'The left button has prev. The right one is the opposite.'),
      L3("Keyingi inglizcha next.", 'Следующий по-английски — next.', 'Next in English is next.'),
      L3("Yozing: next", 'Впиши: next', 'Type: next')
    ],
    hints2: [
      L3("Chap tugmada data-bs-target nima?", 'Что у левой кнопки в data-bs-target?', 'What does the left button have in data-bs-target?'),
      L3("Panjara va karusel id si.", 'Решётка и id карусели.', 'A hash and the carousel’s id.'),
      L3("Yozing: #galereya", 'Впиши: #galereya', 'Type: #galereya')
    ],
    why1: L3("next tugmani keyingi rasmga o'tkazadigan qildi.", 'next заставил кнопку листать вперёд.', 'next makes the button go forward.'),
    why2: L3("#galereya tugmaga bizning karuselni ko'rsatdi.", '#galereya показал кнопке нашу карусель.', '#galereya pointed the button at our carousel.'),
    done: L3("Zo'r! Endi ikkala tugma ishlaydi. Sahifada bosib ko'ring!", 'Огонь! Теперь работают обе кнопки. Нажми их на странице!', 'Awesome! Both buttons work now. Try them on the page!')
  },
  s8: {
    eyebrow: L3('Nuqtalar', 'Точки', 'Indicators'),
    help: [
      L3("Kodda carousel-indicators ga, sahifada rasm ostidagi nuqtalarga qarang.", 'Посмотри на carousel-indicators в коде и на точки под фото.', 'Look at carousel-indicators in the code and the dots under the photo.'),
      L3("Har bir nuqta — bitta rasm. data-bs-slide-to raqami qaysi rasmga o'tishni aytadi: hisob noldan boshlanadi. Hozirgi rasm nuqtasi uzunroq.", 'Каждая точка — одно фото. Число data-bs-slide-to говорит, к какому фото перейти; счёт с нуля. Точка текущего фото длиннее.', 'Each dot is one photo. The data-bs-slide-to number says which photo to jump to, counting from zero. The current photo’s dot is longer.'),
      L3("Bu kitobdagi xatcho'plarga o'xshaydi: kerakli sahifaga darrov o'tasiz.", 'Это как закладки в книге: сразу открываешь нужную страницу.', 'It’s like bookmarks in a book: you jump straight to the page you need.')
    ],
    say: L3("Tugmalar bor. Endi rasm ostiga nuqtalar qo'shamiz. Qarang.", 'Кнопки есть. Теперь добавим под фото точки. Смотри.', 'We have buttons. Now let’s add dots under the photo. Watch.'),
    sayDots: L3("carousel-indicators qo'shdim. Ichida uchta tugma-nuqta, har biri bitta rasm. data-bs-slide-to raqami qaysi rasmga o'tishni aytadi: nol, bir, ikki. Hisob noldan boshlanadi!", 'Добавил carousel-indicators. Внутри три кнопки-точки, каждая — одно фото. Число data-bs-slide-to говорит, к какому фото перейти: ноль, один, два. Счёт с нуля!', 'I added carousel-indicators. Inside are three dot buttons, one per photo. The data-bs-slide-to number says which photo: zero, one, two. Counting starts at zero!'),
    sayTo: L3("Uchinchi nuqtani bosdim, karusel darrov uchinchi rasmga o'tdi. Uzun nuqta ham ko'chdi.", 'Нажал третью точку — карусель сразу перешла к третьему фото. Длинная точка тоже переехала.', 'I tapped the third dot and the carousel jumped to the third photo. The long dot moved too.'),
    done: L3("Eslab qoling: nuqtalar carousel-indicators ichida, raqam noldan boshlanadi.", 'Запомни: точки — в carousel-indicators, счёт с нуля.', 'Remember: the dots live in carousel-indicators, and counting starts at zero.'),
    askStart: L3('Qarang: tugmalar bor', 'Смотри: кнопки есть', 'Watch: buttons are here'),
    askDots: L3('Qarang: carousel-indicators', 'Смотри: carousel-indicators', 'Watch: carousel-indicators'),
    askTo: L3('Qarang: uchinchi nuqta', 'Смотри: третья точка', 'Watch: the third dot'),
    askDone: L3('carousel-indicators · data-bs-slide-to', 'carousel-indicators · data-bs-slide-to', 'carousel-indicators · data-bs-slide-to')
  },
  g2: {
    eyebrow: L3('Autoplay', 'Autoplay', 'Autoplay'),
    help: [
      L3("Saytdagi Autoplay bo'limiga, belgilangan qatorga va sahifadagi nuqta chizig'iga qarang.", 'Посмотри на раздел Autoplay на сайте, на выделенную строку и на полоску в точке.', 'Look at the Autoplay section, the highlighted line and the bar in the dot.'),
      L3("data-bs-autoplay true bo'lsa, karusel o'zi aylanadi. Har bir rasm qancha turishini data-bs-interval aytadi, millisekundlarda: 1000 — bir soniya.", 'Если data-bs-autoplay равен true, карусель листается сама. Сколько стоит каждое фото, говорит data-bs-interval, в миллисекундах: 1000 — одна секунда.', 'If data-bs-autoplay is true, the carousel slides by itself. data-bs-interval says how long each photo stays, in milliseconds: 1000 is one second.'),
      L3("Bu slayd-shouga o'xshaydi: telefon suratlarni o'zi almashtirib turadi.", 'Это как слайд-шоу: телефон сам меняет фотографии.', 'It’s like a slideshow: the phone changes the pictures by itself.')
    ],
    say: L3("Karusel o'zi aylansin desak-chi? Saytda buning uchun alohida bo'lim bor. Qarang.", 'А если хотим, чтобы карусель листалась сама? На сайте для этого есть отдельный раздел. Смотри.', 'What if we want the carousel to slide by itself? The site has a section for that. Watch.'),
    sayPage: L3("Carousel sahifasidagi Autoplay bo'limi. Misolning birinchi qatorida yangi atribut bor: data-bs-autoplay, qiymati true, ya'ni yoqiq degani.", 'Раздел Autoplay на странице Carousel. В первой строке примера новый атрибут: data-bs-autoplay со значением true, то есть «включено».', 'The Autoplay section of the Carousel page. The example’s first line has a new attribute: data-bs-autoplay with the value true, meaning on.'),
    sayAuto: L3("Shu atributni karuselimizga qo'shdim. Qarang: rasmlar o'zi almashyapti, nuqta ichida esa vaqt chizig'i to'lyapti. Bir rasm besh soniya turadi.", 'Добавил этот атрибут в нашу карусель. Смотри: фото меняются сами, а в точке заполняется полоска времени. Одно фото стоит пять секунд.', 'I added that attribute to our carousel. Look: the photos change by themselves, and a time bar fills inside the dot. Each photo stays five seconds.'),
    sayInt: L3("Vaqtni o'zgartirsa bo'ladi. Individual intervals misolida rasm qatorida data-bs-interval bor. U millisekundda yoziladi: 2000 — ikki soniya, 4000 — to'rt soniya.", 'Время можно менять. В примере Individual intervals у фото есть data-bs-interval. Оно пишется в миллисекундах: 2000 — две секунды, 4000 — четыре.', 'You can change the time. In the Individual intervals example each photo has data-bs-interval. It’s written in milliseconds: 2000 is two seconds, 4000 is four.'),
    done: L3("Eslab qoling: data-bs-autoplay true — o'zi aylanadi, data-bs-interval — vaqt millisekundda.", 'Запомни: data-bs-autoplay true — листается сама, data-bs-interval — время в миллисекундах.', 'Remember: data-bs-autoplay true slides by itself, data-bs-interval is the time in milliseconds.'),
    askStart: L3('Qarang: sayt', 'Смотри: сайт', 'Watch: the site'),
    askPage: L3('Qarang: Autoplay', 'Смотри: Autoplay', 'Watch: Autoplay'),
    askLine: L3('Qarang: data-bs-autoplay', 'Смотри: data-bs-autoplay', 'Watch: data-bs-autoplay'),
    askAuto: L3("Qarang: o'zi aylanyapti", 'Смотри: листается сама', 'Watch: it slides by itself'),
    askInt: L3('Qarang: data-bs-interval', 'Смотри: data-bs-interval', 'Watch: data-bs-interval'),
    askDone: L3('autoplay · interval', 'autoplay · interval', 'autoplay · interval')
  },
  t3: {
    eyebrow: L3("O'zi aylansin", 'Пусть листается сама', 'Make it slide by itself'),
    say: L3("Karusel o'zi aylansin. Kodga qarang va bo'sh joyga kerakli qiymatni yozing.", 'Пусть карусель листается сама. Посмотри на код и впиши в пустое место нужное значение.', 'Let the carousel slide by itself. Look at the code and type the right value into the empty spot.'),
    ask1: L3("Karusel o'zi aylansin", 'Карусель листается сама', 'Make the carousel slide by itself'),
    ask2: L3("Birinchi rasm 3 soniya tursin", 'Первое фото стоит 3 секунды', 'The first photo stays 3 seconds'),
    hints1: [
      L3("Atribut yoqiq bo'lishi kerak.", 'Атрибут должен быть включён.', 'The attribute needs to be on.'),
      L3("Yoqiq inglizcha true, o'chiq esa false.", 'Включено по-английски true, выключено — false.', 'On is true, off is false.'),
      L3("Yozing: true", 'Впиши: true', 'Type: true')
    ],
    hints2: [
      L3("Vaqt millisekundda yoziladi.", 'Время пишется в миллисекундах.', 'Time is written in milliseconds.'),
      L3("1 soniya — 1000 millisekund. 3 soniya-chi?", '1 секунда — 1000 миллисекунд. А 3 секунды?', '1 second is 1000 milliseconds. What about 3 seconds?'),
      L3("Yozing: 3000", 'Впиши: 3000', 'Type: 3000')
    ],
    why1: L3("true karuselni o'zi aylanadigan qildi.", 'true заставил карусель листаться самой.', 'true made the carousel slide by itself.'),
    why2: L3("3000 millisekund — uch soniya.", '3000 миллисекунд — это три секунды.', '3000 milliseconds is three seconds.'),
    done: L3("Ajoyib! Karusel o'zi aylanadi va vaqtni siz tanlaysiz.", 'Отлично! Карусель листается сама, а время выбираешь ты.', 'Great! The carousel slides by itself, and you choose the time.')
  },
  s11: {
    eyebrow: L3('Silliq almashish', 'Плавная смена', 'Crossfade'),
    help: [
      L3("Birinchi qatordagi class ga va rasmlar qanday almashishiga qarang.", 'Посмотри на class в первой строке и на то, как меняются фото.', 'Look at the class on the first line and how the photos change.'),
      L3("slide — rasm yonga suriladi. carousel-fade — rasm joyida xiralashib, yangisi paydo bo'ladi.", 'slide — фото уезжает вбок. carousel-fade — фото тает на месте, и появляется новое.', 'slide moves the photo sideways. carousel-fade fades it out in place as the new one appears.'),
      L3("Bu kinodagi sahna almashishiga o'xshaydi: kadr asta-sekin boshqasiga aylanadi.", 'Это как смена сцены в кино: один кадр плавно переходит в другой.', 'It’s like a scene change in a film: one shot slowly turns into the next.')
    ],
    say: L3("Hozir rasmlar yonga surilib almashadi. Boshqacha ham bo'ladimi? Qarang.", 'Сейчас фото меняются, уезжая вбок. А можно иначе? Смотри.', 'Right now the photos slide sideways. Can it be different? Watch.'),
    sayFade: L3("slide o'rniga carousel-fade yozdim. Endi rasm yonga ketmaydi: joyida xiralashadi va yangisi paydo bo'ladi.", 'Вместо slide написал carousel-fade. Теперь фото не уезжает вбок: оно тает на месте, и появляется новое.', 'Instead of slide I wrote carousel-fade. Now the photo doesn’t slide away: it fades in place and the new one appears.'),
    sayWhy: L3("Bu effekt saytda Crossfade bo'limida. Qaysi biri chiroyliroq, o'zingiz tanlaysiz.", 'Этот эффект — в разделе Crossfade на сайте. Какой красивее — выбираешь сам.', 'This effect is in the Crossfade section of the site. Which looks better is up to you.'),
    done: L3("Eslab qoling: slide — surilib, carousel-fade — xiralashib almashadi.", 'Запомни: slide — сменяется сдвигом, carousel-fade — растворением.', 'Remember: slide changes by sliding, carousel-fade by fading.'),
    askStart: L3('Qarang: slide', 'Смотри: slide', 'Watch: slide'),
    askFade: L3('Qarang: carousel-fade', 'Смотри: carousel-fade', 'Watch: carousel-fade'),
    askWhy: L3('Qarang: Crossfade', 'Смотри: Crossfade', 'Watch: Crossfade'),
    askDone: L3('slide · carousel-fade', 'slide · carousel-fade', 'slide · carousel-fade')
  },
  x2: {
    eyebrow: L3('Tajriba', 'Опыт', 'Experiment'),
    say: L3("Endi o'zingiz sozlang. Pastda effekt va vaqt bor. Ikkala effektni va ikkala vaqtni sinab ko'ring.", 'Теперь настрой сам. Внизу эффект и время. Попробуй оба эффекта и оба времени.', 'Now you set it up. Below are the effect and the time. Try both effects and both times.'),
    what: {
      slide: L3("slide: rasm yonga surilib almashadi.", 'slide: фото сменяется сдвигом.', 'slide: the photo slides away.'),
      'carousel-fade': L3("carousel-fade: rasm joyida xiralashib almashadi.", 'carousel-fade: фото растворяется на месте.', 'carousel-fade: the photo fades in place.'),
      1000: L3("1000 millisekund, ya'ni bir soniya. Juda tez!", '1000 миллисекунд, то есть одна секунда. Очень быстро!', '1000 milliseconds, one second. Very fast!'),
      3000: L3("3000 millisekund, ya'ni uch soniya. Rasmni yaxshi ko'rib olasiz.", '3000 миллисекунд, то есть три секунды. Успеваешь рассмотреть фото.', '3000 milliseconds, three seconds. You have time to look at the photo.')
    },
    ok: L3("Ajoyib! Effekt va vaqtni o'zingiz tanlay olasiz.", 'Отлично! Эффект и время ты выбираешь сам.', 'Great! You can pick the effect and the time yourself.'),
    done: L3("Endi karusel kodini tartib bilan yig'amiz.", 'Теперь соберём код карусели по порядку.', 'Now let’s build the carousel code in order.'),
    hints: [
      L3("Pastdagi tugmalarni bosing.", 'Нажимай кнопки внизу.', 'Tap the buttons below.'),
      L3("carousel-fade va 1000 ni ham bosing.", 'Нажми ещё carousel-fade и 1000.', 'Also tap carousel-fade and 1000.'),
      L3("Yonib turgan tugmani bosing.", 'Нажми кнопку, которая светится.', 'Tap the glowing button.')
    ],
    ask: L3("Ikkala effekt va ikkala vaqtni sinang", 'Попробуй оба эффекта и оба времени', 'Try both effects and both times'),
    askDone: L3("Effekt va vaqt — sizning tanlovingiz", 'Эффект и время — твой выбор', 'Effect and time are your choice'),
    fxH: L3('Effekt', 'Эффект', 'Effect'),
    msH: L3('Vaqt, ms', 'Время, мс', 'Time, ms')
  },
  t4: {
    eyebrow: L3("Tartib bilan yig'ing", 'Собери по порядку', 'Build in order'),
    say: L3("Karusel kodini tartib bilan yig'ing: tashqi qutidan ichkariga, keyin ichkaridan tashqariga yopamiz.", 'Собери код карусели по порядку: снаружи внутрь, потом закрываем изнутри наружу.', 'Build the carousel code in order: from outside in, then close from inside out.'),
    ask: L3("Bo'laklarni tartib bilan bosing", 'Нажимай кусочки по порядку', 'Tap the pieces in order'),
    msgs: {
      car: L3("Oldin eng tashqi quti: carousel.", 'Сначала самая внешняя коробка: carousel.', 'First the outermost box: carousel.'),
      inner: L3("carousel ichida rasmlar qatori: carousel-inner.", 'Внутри carousel — ряд фото: carousel-inner.', 'Inside carousel comes the photo row: carousel-inner.'),
      i0: L3("Qator ichida birinchi rasm, u active.", 'Внутри ряда — первое фото, у него active.', 'Inside the row goes the first photo, with active.'),
      i1: L3("Endi ikkinchi rasm.", 'Теперь второе фото.', 'Now the second photo.'),
      i2: L3("Keyin uchinchi rasm.", 'Потом третье фото.', 'Then the third photo.'),
      innerc: L3("Rasmlar tugadi: avval rasmlar qatorini yopamiz.", 'Фото закончились: сначала закрываем ряд фото.', 'The photos are done: close the photo row first.'),
      carc: L3("Oxirida karuselni yopamiz.", 'В конце закрываем карусель.', 'Last, close the carousel.')
    },
    hints: [
      L3("Tashqi qutidan boshlang.", 'Начни с внешней коробки.', 'Start with the outer box.'),
      L3("Tartib: carousel, carousel-inner, uchta rasm, keyin ikkita yopish.", 'Порядок: carousel, carousel-inner, три фото, потом два закрытия.', 'The order: carousel, carousel-inner, three photos, then two closings.'),
      L3("Yonib turgan bo'lakni bosing.", 'Нажми кусочек, который светится.', 'Tap the glowing piece.')
    ],
    ok: L3("To'ppa-to'g'ri! Rasmlar qatori karusel ichida, rasmlar esa qator ichida.", 'В точку! Ряд фото внутри карусели, а фото внутри ряда.', 'Spot on! The photo row is inside the carousel, and the photos are inside the row.')
  },
  q1: {
    eyebrow: L3('Rasm va kod', 'Картинка и код', 'Picture and code'),
    say: L3("Kichik sinov. Chapda namuna. Qaysi kod shunday qiladi? Variantni tanlang, natija o'ngda chiqadi.", 'Маленькое испытание. Слева образец. Какой код так делает? Выбери вариант, результат появится справа.', 'A little test. The goal is on the left. Which code does that? Pick an option, the result shows on the right.'),
    ask: L3('Qaysi kod namunani chizadi?', 'Какой код рисует образец?', 'Which code draws the goal?'),
    empty: L3("Variantni tanlang, natija shu yerda chiqadi", 'Выбери вариант, результат появится здесь', 'Pick an option, the result shows here'),
    why: [
      L3("Bittadan rasm: carousel-item.", 'По одному фото: carousel-item.', 'One photo at a time: carousel-item.'),
      L3("Xiralashib almashadi: carousel-fade.", 'Сменяется растворением: carousel-fade.', 'Changes by fading: carousel-fade.'),
      L3("O'zi aylanadi: data-bs-autoplay true.", 'Листается сама: data-bs-autoplay true.', 'Slides by itself: data-bs-autoplay true.'),
      L3("Rasm ostida nuqtalar: carousel-indicators.", 'Точки под фото: carousel-indicators.', 'Dots under the photo: carousel-indicators.')
    ],
    no: {
      'carousel-items': L3("Bunday class yo'q, oxirida s ortiqcha: rasmlar kichkina qoldi.", 'Такого class нет, лишняя s в конце: фото остались маленькими.', 'There’s no such class, the s at the end is extra: the photos stayed small.'),
      item: L3("Bunday class yo'q: rasmlar kichkina qoldi.", 'Такого class нет: фото остались маленькими.', 'There’s no such class: the photos stayed small.'),
      slide: L3("slide butun karuselga yoziladi, rasmga emas: rasmlar kichkina qoldi.", 'slide пишется всей карусели, а не фото: фото остались маленькими.', 'slide goes on the whole carousel, not a photo: the photos stayed small.'),
      fade: L3("Bunday class yo'q: rasmlar surilib almashyapti.", 'Такого class нет: фото меняются сдвигом.', 'There’s no such class: the photos slide.'),
      'carousel-slide': L3("Bunday class yo'q: rasmlar surilib almashyapti.", 'Такого class нет: фото меняются сдвигом.', 'There’s no such class: the photos slide.'),
      'data-bs-ride="carousel"': L3("Bu eski nom, beshinchi versiyadan: karusel turib qoldi.", 'Это старое имя из пятой версии: карусель стоит.', 'That’s an old name from version five: the carousel stands still.'),
      'autoplay="true"': L3("Bootstrap so'zlari data-bs bilan boshlanadi: karusel turib qoldi.", 'Слова Bootstrap начинаются с data-bs: карусель стоит.', 'Bootstrap’s words start with data-bs: the carousel stands still.'),
      'data-bs-autoplay="false"': L3("false — o'chiq degani: karusel turib qoldi.", 'false значит «выключено»: карусель стоит.', 'false means off: the carousel stands still.'),
      'carousel-dots': L3("Bunday class yo'q: nuqtalar o'rnida mitti kulrang tugmachalar qoldi.", 'Такого class нет: вместо точек — крошечные серые кнопочки.', 'There’s no such class: tiny gray buttons instead of dots.'),
      indicators: L3("Oldida carousel so'zi kerak: nuqtalar o'rnida mitti kulrang tugmachalar qoldi.", 'Впереди нужно слово carousel: вместо точек — крошечные серые кнопочки.', 'It needs carousel in front: tiny gray buttons instead of dots.'),
      'carousel-control': L3("Bu class nuqtalarni chizmaydi: o'rnida mitti kulrang tugmachalar qoldi.", 'Этот class точки не рисует: вместо них крошечные серые кнопочки.', 'That class doesn’t draw dots: tiny gray buttons instead.')
    },
    hint1: L3("Namunaga qarang: rasm nechta, qanday almashadi, o'zi aylanadimi, nuqtalar bormi?", 'Посмотри на образец: сколько фото видно, как меняются, листается ли сама, есть ли точки?', 'Look at the goal: how many photos show, how they change, does it slide by itself, are there dots?'),
    hint2: L3("Bootstrap 6 so'zlari carousel bilan, atributlar data-bs bilan boshlanadi.", 'Слова Bootstrap 6 начинаются с carousel, атрибуты — с data-bs.', 'Bootstrap 6 words start with carousel, attributes with data-bs.'),
    right: L3("Barakalla!", 'Точно!', 'Exactly!'),
    done: L3("Hammasi to'g'ri! Karusel so'zlarini bilasiz.", 'Всё верно! Ты знаешь слова карусели.', 'All correct! You know the carousel words.')
  },
  t6: {
    eyebrow: L3('Nega ishlamayapti?', 'Почему не работает?', 'Why isn’t it working?'),
    say: L3("Oxirgi sinov. Uchta karusel ishlamayapti, har birida sabab boshqa. Sahifadagi tugmalarni bosib ko'ring, kodga qarang va sababini tanlang.", 'Последнее испытание. Три карусели не работают, у каждой своя причина. Понажимай кнопки на странице, посмотри на код и выбери причину.', 'The last test. Three carousels don’t work, each for a different reason. Try the buttons on the page, look at the code and pick the reason.'),
    ask: L3('Nega ishlamayapti? Sababini tanlang', 'Почему не работает? Выбери причину', 'Why isn’t it working? Pick the reason'),
    // Строка-симптом своего раунда (как t6 финального урока, tools/bs10): что ученик видит на странице.
    asks: [
      L3("O'ng tugmani bosing: rasm almashmayapti. Nega?", 'Нажми правую кнопку — фото не меняется. Почему?', 'Tap the right button: the photo doesn’t change. Why?'),
      L3("O'ng tugmani bosing: rasm almashmayapti. Nega?", 'Нажми правую кнопку — фото не меняется. Почему?', 'Tap the right button: the photo doesn’t change. Why?'),
      L3("Karusel o'zi aylanishi kerak edi, lekin turibdi. Nega?", 'Карусель должна листаться сама, а стоит. Почему?', 'The carousel should slide by itself, but it stands still. Why?')
    ],
    opts: {
      noScript: L3("script qatori yo'q", 'Нет строки script', 'No script line'),
      noHash: L3("Panjara # yo'q", 'Нет решётки #', 'No hash #'),
      old: L3('Eski nom, 5-versiyadan', 'Старое имя из версии 5', 'An old name from version 5')
    },
    rounds: [
      L3("Kod oxirida script qatori yo'q. Bootstrap skriptisiz tugmalar ishlamaydi.", 'В конце кода нет строки script. Без скрипта Bootstrap кнопки не работают.', 'There’s no script line at the end. Without Bootstrap’s script the buttons don’t work.'),
      L3("data-bs-target da panjara yo'q: galereya emas, #galereya bo'lishi kerak.", 'В data-bs-target нет решётки: нужно не galereya, а #galereya.', 'data-bs-target has no hash: it must be #galereya, not galereya.'),
      L3("data-bs-ride beshinchi versiyaning nomi. Oltinchisida data-bs-autoplay true.", 'data-bs-ride — имя пятой версии. В шестой — data-bs-autoplay true.', 'data-bs-ride is a version five name. In version six it’s data-bs-autoplay true.')
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    hint1: L3("Kodni saytdagi misol bilan solishtiring.", 'Сравни код с примером на сайте.', 'Compare the code with the site example.'),
    hint2: L3("script qatori bormi? # bormi? So'zlar yangi versiyadanmi?", 'Есть ли строка script? Есть ли #? Слова из новой версии?', 'Is there a script line? Is there a #? Are the words from the new version?'),
    ok: L3("Hammasi to'g'ri! Endi karusel buzilsa, sababini o'zingiz topasiz.", 'Всё верно! Теперь, если карусель сломается, причину найдёшь сам.', 'All correct! Now if a carousel breaks, you’ll find the reason yourself.')
  },
  w1: {
    eyebrow: L3("O'z karuselingiz", 'Своя карусель', 'Your own carousel'),
    say: L3("Endi karuselni o'zingizga sozlang. Effektni tanlang va har bir rasm necha millisekund turishini yozing: 1000 dan 10000 gacha. Keyin «Tayyor»ni bosing.",
      'Теперь настрой карусель под себя. Выбери эффект и впиши, сколько миллисекунд стоит каждое фото: от 1000 до 10000. Потом нажми «Готово».',
      'Now set up the carousel your way. Pick the effect and type how many milliseconds each photo stays: from 1000 to 10000. Then tap “Done”.'),
    ask: L3("Vaqtni millisekundda yozing, masalan, 3000", 'Впиши время в миллисекундах, например, 3000', 'Type the time in milliseconds, for example, 3000'),
    range: L3("Vaqt 1000 dan 10000 gacha bo'lsin, ya'ni bir soniyadan o'n soniyagacha degani.", 'Пусть время будет от 1000 до 10000, то есть от одной до десяти секунд.', 'Keep the time between 1000 and 10000, from one to ten seconds.'),
    hints: [
      L3("Bitta raqam yozing, millisekundda.", 'Впиши одно число, в миллисекундах.', 'Type one number, in milliseconds.'),
      L3("1 soniya — 1000. Masalan, 2 soniya — 2000.", '1 секунда — 1000. Например, 2 секунды — 2000.', '1 second is 1000. For example, 2 seconds is 2000.'),
      L3("Masalan: 3000. Keyin «Tayyor»ni bosing.", 'Например: 3000. Потом нажми «Готово».', 'For example: 3000. Then tap “Done”.')
    ],
    ok: L3("Qoyil! Bu sizning karuselingiz.", 'Класс! Это твоя карусель.', 'Nice! This is your carousel.')
  },
  s18: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi topishmoqqa qaytamiz. Esingizdami, men karusel uchun uzun JavaScript yozish kerak deb o'ylagandim? Afsuski, adashibman. Qarang: biz bitta ham JavaScript qatori yozmadik. Faqat class lar, data-bs atributlari va birinchi darsdagi bitta script qatori. Qolganini Bootstrap skripti qiladi!",
        'Вернёмся к загадке. Помнишь, я думал, что для карусели нужно писать длинный JavaScript? Увы, я ошибся. Смотри: мы не написали ни одной строки JavaScript. Только class, атрибуты data-bs и одна строка script с первого урока. Остальное делает скрипт Bootstrap!',
        'Back to our riddle. Remember, I thought a carousel needed a long JavaScript program? Sadly, I was wrong. Look: we didn’t write a single line of JavaScript. Just classes, data-bs attributes and one script line from lesson one. Bootstrap’s script does the rest!'), k: 'riddle' },
      { text: L3("Qarang, mana sizning karuselingiz!", 'Смотри, вот твоя карусель!', 'Look, here’s your carousel!'), k: null },
      { text: L3("carousel ichida carousel-inner, uning ichida carousel-item lar. active — boshlanadigan rasm.", 'В carousel — carousel-inner, в нём — carousel-item. active — фото, с которого начинаем.', 'carousel-inner goes in carousel, carousel-item goes inside it. active is the starting photo.'), k: 'item' },
      { text: L3("Tugmalarga data-bs-slide va data-bs-target, nuqtalarga carousel-indicators.", 'Кнопкам — data-bs-slide и data-bs-target, точкам — carousel-indicators.', 'Buttons get data-bs-slide and data-bs-target, dots get carousel-indicators.'), k: 'btn' },
      { text: L3("data-bs-autoplay true — o'zi aylanadi, data-bs-interval — vaqt millisekundda.", 'data-bs-autoplay true — листается сама, data-bs-interval — время в миллисекундах.', 'data-bs-autoplay true slides by itself, data-bs-interval is the time in milliseconds.'), k: 'auto' },
      { text: L3("Hammasi saytda: Components bo'limi, Carousel sahifasi.", 'Всё это — на сайте: раздел Components, страница Carousel.', 'It’s all on the site: Components, the Carousel page.'), k: 'site' },
      { text: L3("Tabriklayman! Siz to'qqizinchi darsni tugatdingiz. Keyingi darsda menyu va oynalar yasaymiz, Bootstrapda ular Menu va Dialog deb ataladi. Ko'rishguncha!", 'Ура! Ты прошёл девятый урок. На следующем уроке сделаем меню и окна, в Bootstrap они называются Menu и Dialog. До встречи!', 'Hooray! You finished the ninth lesson. Next time we’ll make menus and windows, called Menu and Dialog in Bootstrap. See you!'), k: null }
    ],
    roles: {
      item: L3('carousel-inner · carousel-item', 'carousel-inner · carousel-item', 'carousel-inner · carousel-item'),
      btn: L3("Tugmalar va nuqtalar", 'Кнопки и точки', 'Buttons and dots'),
      auto: L3("autoplay · interval", 'autoplay · interval', 'autoplay · interval'),
      site: L3("So'zlar — Carousel da", 'Слова — в Carousel', 'Words are in Carousel')
    },
    ask: L3('Karuselingizga qarang', 'Посмотри на свою карусель', 'Look at your carousel')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, hints: 1, hints1: 1, hints2: 1, hints3: 1, why: 1, why1: 1, why2: 1, why3: 1, hint1: 1, hint2: 1, msgs: 1, magic: 1, what: 1, ok: 1, more: 1,
  sayInner: 1, sayItem: 1, saySwipe: 1, sayPage: 1, sayPaste: 1, sayPics: 1, sayNext: 1, sayDead: 1, sayScript: 1, sayTarget: 1, sayDots: 1, sayTo: 1,
  sayAuto: 1, sayInt: 1, sayFade: 1, sayWhy: 1, range: 1, right: 1, no: 1, rounds: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:gen/bs-css.jsx@*/

/*@FILE:../mysh/mysh.jsx@*/

/*@FILE:bs8-kit.jsx@*/

/*@FILE:bs8-site.jsx@*/

/*@FILE:bs8-head.jsx@*/

/*@FILE:bs8-common.jsx@*/

/*@FILE:bs8-screens.jsx@*/

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
/*@FILE:bs8.css@*/
`;
