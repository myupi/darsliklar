// =============================================================================
// БАНК ТРЕНАЖЁРА BOOTSTRAP · урок 8 «Карусель» — 11 вопросов с выбором (4 easy, 5 medium, 2 hard) + 3 «впиши ответ» (q12–q14)
// + игровые: 2 «собери» (q15, q16), 1 «найди ошибку» (q17), 1 «нажми на странице» (q18).
// Проверяем: сайт — Components → Carousel; слайд — carousel-item (+ active — начальный); data-bs-slide prev / next;
// carousel-fade — смена растворением; без строки script кнопки мёртвые, а листать пальцем можно (прокрутка браузера);
// в примере сайта src="..." — свой файл; data-bs-ride — имя версии 5 (→ data-bs-autoplay="true"); data-bs-interval — мс,
// без него 5000; carousel-control-prev/next — имена версии 5 (→ btn-icon btn-sm); data-bs-target="#id" — свой id у
// скопированных кнопок; точки — carousel-indicators.
// Не повторяет тесты урока (tools/webtest/bootstrap/l08.jsx): пустой carousel-inner, active у первого, target без «#»,
// data-bs-slide-to третьей точки, interval 3 секунды.
// На странице вопроса скриптов нет: карусель показывает первый слайд, кнопки не листают.
// Словарь урока 8: karusel, slayd, rasm, tugma, nuqtalar, panjara (#), millisekund, soniya, xiralashib almashish.
// Апостроф в узбекском — только ASCII «'».
// =============================================================================
const t3 = (uz, ru, en) => ({ uz, ru, en });
// Невидимые слайды на странице — картинка той же формы, что первый (banner.png): высоту ряда карусели задаёт самый высокий
// слайд, и квадратное фото оставляло бы под первым слайдом пустоту. src — для памяти, что за фото задумано.
const SLIDE = (src) => '<div class="carousel-item"><img src="banner.png" class="d-block w-100" alt="' + src.replace(/\.png$/, '') + '"></div>';

// Страница вопроса q18: заголовок + карусель (первый слайд) + ряд кнопок с точками; цели data-t не вложены друг в друга.
const CAR18 = '\n<div id="sport" class="carousel">'
  + '<div class="carousel-inner" data-t="slaydlar">'
  + '<div class="carousel-item active"><img src="banner.png" class="d-block w-100" alt="Robo-futbol"></div>'
  + SLIDE('top.png') + '</div>'
  + '<div class="d-flex align-items-center gap-3">'
  + '<button class="btn-icon btn-sm" data-bs-target="#sport" data-bs-slide="prev" data-t="oldingi"><span class="carousel-icon-prev"></span></button>'
  + '<div class="carousel-indicators" data-t="nuqtalar"><button data-bs-target="#sport" data-bs-slide-to="0"></button><button data-bs-target="#sport" data-bs-slide-to="1"></button></div>'
  + '<button class="btn-icon btn-sm" data-bs-target="#sport" data-bs-slide="next" data-t="keyingi"><span class="carousel-icon-next"></span></button>'
  + '</div></div>';

export default [
  {
    id: 'bootstrap_l09_q01',
    difficulty: 'easy',
    tags: ['sayt', 'carousel'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Robo-futbol turniri sahifasiga rasmlar karuseli kerak. Namunani Bootstrap saytidan olamiz.",
      q: 'Saytning qaysi joyida karusel namunasi bor?',
      opts: ['Components → Carousel', 'Content → Images', 'Forms → Overview', 'Utilities → Flex'],
      why: "Karusel — saytning tayyor qismi, ya'ni komponent degani. U Components bo'limida, Carousel sahifasida. Content → Images esa faqat rasmning o'zi uchun.",
    },
    ru: {
      ctx: 'Странице турнира Robo-futbol нужна карусель с фото. Берём пример с сайта Bootstrap.',
      q: 'Где на сайте пример карусели?',
      opts: ['Components → Carousel', 'Content → Images', 'Forms → Overview', 'Utilities → Flex'],
      why: 'Карусель — готовая часть сайта, то есть компонент. Она в разделе Components, на странице Carousel. А Content → Images — только про саму картинку.',
    },
    en: {
      ctx: 'The Robo-futbol tournament page needs a photo carousel. We take the example from the Bootstrap site.',
      q: 'Where on the site is the carousel example?',
      opts: ['Components → Carousel', 'Content → Images', 'Forms → Overview', 'Utilities → Flex'],
      why: 'A carousel is a ready part of a site, a component. It is in the Components section, on the Carousel page. Content → Images is only about the picture itself.',
    },
  },
  {
    id: 'bootstrap_l09_q02',
    difficulty: 'easy',
    tags: ['carousel-item'],
    mono: true,
    sort: false,
    vis: {
      code: '<div id="sport" class="carousel">\n  <div class="carousel-inner">\n    <div class="___ active">\n      <img src="banner.png" class="d-block w-100">\n    </div>\n    …\n  </div>\n</div>',
      page: '<div id="sport" class="carousel"><div class="carousel-inner">'
        + '<div class="carousel-item active"><img src="banner.png" class="d-block w-100" alt="Robo-futbol"></div>'
        + SLIDE('tog.png') + SLIDE('top.png') + '</div></div>',
    },
    uz: {
      ctx: "Karuselda uchta rasm bor. Har biri butun kenglikda bo'lsin va oynada bittadan ko'rinsin.",
      q: "Har bir rasm qutisiga qaysi so'z yoziladi?",
      opts: ['carousel-item', 'carousel-inner', 'carousel-slide', 'img-fluid'],
      why: "carousel-item — bitta slayd: rasmni butun kenglikka cho'zadi, shuning uchun oynada bittasi ko'rinadi. carousel-inner esa hamma slaydlarni o'rab turadi.",
    },
    ru: {
      ctx: 'В карусели три фото. Каждое должно быть во всю ширину, а в окне — по одному.',
      q: 'Какое слово пишется у блока каждого фото?',
      opts: ['carousel-item', 'carousel-inner', 'carousel-slide', 'img-fluid'],
      why: 'carousel-item — один слайд: растягивает фото во всю ширину, поэтому в окне видно одно. А carousel-inner обнимает все слайды.',
    },
    en: {
      ctx: 'The carousel has three photos. Each should be full width, one at a time in the window.',
      q: 'Which word goes on the box of each photo?',
      opts: ['carousel-item', 'carousel-inner', 'carousel-slide', 'img-fluid'],
      why: 'carousel-item is one slide: it stretches the photo to full width, so one shows in the window. carousel-inner wraps all the slides.',
    },
  },
  {
    id: 'bootstrap_l09_q03',
    difficulty: 'easy',
    tags: ['data-bs-slide', 'prev'],
    mono: false,
    sort: false,
    vis: {
      code: '<button class="btn-icon btn-sm"\n        data-bs-target="#sport"\n        data-bs-slide="prev">\n  <span class="carousel-icon-prev"></span>\n</button>',
      mark: [3],
    },
    uz: {
      ctx: "Karusel ostidagi chap tugma. script qatori sahifada bor.",
      q: 'Bu tugma bosilganda nima bo\'ladi?',
      opts: ['Oldingi slayd chiqadi', 'Keyingi slayd chiqadi', "Karusel to'xtab qoladi", 'Birinchi slaydga qaytadi'],
      why: "data-bs-slide qayoqqa surishni aytadi: prev — oldingi, next — keyingi. data-bs-target esa qaysi karuselni surishni: #sport.",
    },
    ru: {
      ctx: 'Левая кнопка под каруселью. Строка script на странице есть.',
      q: 'Что будет, если нажать эту кнопку?',
      opts: ['покажется предыдущий слайд', 'покажется следующий слайд', 'карусель остановится', 'вернётся первый слайд'],
      why: 'data-bs-slide говорит, куда листать: prev — назад, next — вперёд. А data-bs-target — какую карусель: #sport.',
    },
    en: {
      ctx: 'The left button under the carousel. The script line is on the page.',
      q: 'What happens when this button is clicked?',
      opts: ['the previous slide shows', 'the next slide shows', 'the carousel stops', 'it goes back to the first slide'],
      why: 'data-bs-slide says where to move: prev is back, next is forward. data-bs-target says which carousel: #sport.',
    },
  },
  {
    id: 'bootstrap_l09_q04',
    difficulty: 'easy',
    tags: ['carousel-fade'],
    mono: true,
    sort: false,
    vis: {
      code: '<div id="sport" class="carousel ___">\n  <div class="carousel-inner">\n    …\n  </div>\n</div>',
    },
    uz: {
      ctx: "Rasmlar yonga surilmasin: joyida xiralashib, o'rniga yangisi paydo bo'lsin.",
      q: "Bo'sh joyga qaysi so'z yoziladi?",
      opts: ['carousel-fade', 'carousel-slide', 'fade-in', 'carousel-blur'],
      why: "carousel-fade rasmni joyida xiralashtirib almashtiradi. Saytda bu Crossfade bo'limida. Oddiy karuselda esa rasmlar yonga surilib almashadi.",
    },
    ru: {
      ctx: 'Фото не должны уезжать вбок: пусть растворяются на месте, а вместо них появляется новое.',
      q: 'Какое слово вписать на пустое место?',
      opts: ['carousel-fade', 'carousel-slide', 'fade-in', 'carousel-blur'],
      why: 'carousel-fade меняет фото растворением на месте. На сайте это раздел Crossfade. В обычной карусели фото уезжают вбок.',
    },
    en: {
      ctx: 'The photos should not slide sideways: let each fade in place and a new one appear.',
      q: 'Which word goes in the empty spot?',
      opts: ['carousel-fade', 'carousel-slide', 'fade-in', 'carousel-blur'],
      why: 'carousel-fade swaps photos by fading them in place. On the site it is the Crossfade section. In a normal carousel, photos slide sideways.',
    },
  },
  {
    id: 'bootstrap_l09_q05',
    difficulty: 'medium',
    tags: ['script'],
    mono: false,
    sort: false,
    vis: {
      code: '<body>\n  <div id="sport" class="carousel slide">\n    …\n    <button class="btn-icon btn-sm"\n      data-bs-target="#sport"\n      data-bs-slide="next">›</button>\n  </div>\n</body>',
    },
    uz: {
      ctx: "Karusel sahifada chiroyli turibdi, lekin «›» tugmasi bosilsa, hech narsa bo'lmayapti.",
      q: 'Nima yetishmayapti?',
      opts: ['body oxirida script qatori', 'head ichida link qatori', "Ikkinchi slaydda active so'zi", "Tugmada btn-solid so'zi"],
      why: "Tugmalarni Bootstrap skripti ishlatadi, u esa birinchi darsdagi script qatori bilan ulanadi — body oxirida. link qatori bor: aks holda karusel chiroyli ko'rinmasdi.",
    },
    ru: {
      ctx: 'Карусель на странице выглядит красиво, но при нажатии «›» ничего не происходит.',
      q: 'Чего не хватает?',
      opts: ['строки script в конце body', 'строки link внутри head', 'слова active у второго слайда', 'слова btn-solid у кнопки'],
      why: 'Кнопки работают благодаря скрипту Bootstrap, а он подключается строкой script из первого урока — в конце body. Строка link есть: иначе карусель не была бы красивой.',
    },
    en: {
      ctx: 'The carousel looks nice on the page, but clicking “›” does nothing.',
      q: 'What is missing?',
      opts: ['the script line at the end of body', 'the link line inside head', 'the word active on the second slide', 'the word btn-solid on the button'],
      why: 'The buttons are run by the Bootstrap script, which is connected by the script line from lesson 1, at the end of body. The link line is there, or the carousel would not look nice.',
    },
  },
  {
    id: 'bootstrap_l09_q06',
    difficulty: 'medium',
    tags: ['sayt', 'src'],
    mono: false,
    sort: false,
    vis: {
      code: '<div id="sport" class="carousel slide">\n  <div class="carousel-inner">\n    <div class="carousel-item active">\n      <img src="..." alt="..."\n           class="d-block w-100">\n    </div>\n  </div>\n</div>',
      page: true,
    },
    uz: {
      ctx: "Bottom controls namunasi saytdan nusxalanib, sahifaga qo'yildi. Lekin rasm o'rnida singan belgi turibdi.",
      q: 'Rasm chiqishi uchun nima qilish kerak?',
      opts: [
        "... o'rniga o'z faylingiz nomini yozish",
        "d-block w-100 so'zlarini o'chirish",
        "img tegiga active so'zini qo'shish",
        'Namunani saytdan qaytadan nusxalash',
      ],
      why: "Saytdagi namunada rasm nomi o'rnida uch nuqta turadi: bu «o'z rasmingizni qo'ying» degani. src ichiga faylingiz nomini yozasiz, masalan banner.png.",
    },
    ru: {
      ctx: 'Пример Bottom controls скопировали с сайта на страницу. Но вместо фото — значок сломанной картинки.',
      q: 'Что сделать, чтобы фото появилось?',
      opts: [
        'вписать вместо ... имя своего файла',
        'удалить слова d-block w-100',
        'добавить тегу img слово active',
        'скопировать пример с сайта заново',
      ],
      why: 'В примере сайта на месте имени файла стоят три точки: это значит «поставь своё фото». В src пишут имя своего файла, например banner.png.',
    },
    en: {
      ctx: 'The Bottom controls example was copied to the page. But a broken image icon shows instead of a photo.',
      q: 'What makes the photo appear?',
      opts: [
        'write your file name instead of ...',
        'delete the words d-block w-100',
        'add the word active to the img tag',
        'copy the example from the site again',
      ],
      why: 'In the site example, three dots stand where the file name goes: it means “put your own photo here”. Write your file name in src, for example banner.png.',
    },
  },
  {
    id: 'bootstrap_l09_q07',
    difficulty: 'medium',
    tags: ['data-bs-autoplay', 'eski nom'],
    mono: true,
    sort: false,
    vis: {
      code: '<div id="sport" class="carousel slide"\n     data-bs-ride="carousel">\n  <div class="carousel-inner">\n    …\n  </div>\n</div>',
      mark: [2],
    },
    uz: {
      ctx: "Kod eski darslikdan olingan. script qatori bor, lekin karusel o'zi aylanmayapti.",
      q: 'Belgilangan qator o\'rniga nima yoziladi?',
      opts: ['data-bs-autoplay="true"', 'data-bs-ride="true"', 'data-bs-interval="true"', 'data-bs-play="carousel"'],
      why: "data-bs-ride — beshinchi versiyaning nomi, oltinchisida ishlamaydi. Bootstrap 6 da karusel o'zi aylanishi uchun data-bs-autoplay atributi, qiymati true. Saytda — Autoplay bo'limi.",
    },
    ru: {
      ctx: 'Код взят из старого учебника. Строка script есть, но карусель сама не листается.',
      q: 'Что пишут вместо выделенной строки?',
      opts: ['data-bs-autoplay="true"', 'data-bs-ride="true"', 'data-bs-interval="true"', 'data-bs-play="carousel"'],
      why: 'data-bs-ride — старое имя из 5-й версии, в 6-й не работает. В Bootstrap 6 карусель листается сама с атрибутом data-bs-autoplay со значением true. На сайте — раздел Autoplay.',
    },
    en: {
      ctx: 'The code is from an old tutorial. The script line is there, but the carousel does not move by itself.',
      q: 'What replaces the marked line?',
      opts: ['data-bs-autoplay="true"', 'data-bs-ride="true"', 'data-bs-interval="true"', 'data-bs-play="carousel"'],
      why: 'data-bs-ride is a version 5 name; it does not work in version 6. In Bootstrap 6 a carousel moves by itself with data-bs-autoplay set to true. On the site: the Autoplay section.',
    },
  },
  {
    id: 'bootstrap_l09_q08',
    difficulty: 'medium',
    tags: ['data-bs-interval'],
    mono: false,
    sort: false,
    vis: {
      code: '<div id="sport" class="carousel"\n     data-bs-autoplay="true">\n  <div class="carousel-inner">\n    <div class="carousel-item active"\n         data-bs-interval="2000">…</div>\n    <div class="carousel-item">…</div>\n  </div>\n</div>',
      mark: [6],
    },
    uz: {
      ctx: "Karusel o'zi aylanadi. Birinchi slaydda vaqt yozilgan, ikkinchisida esa yo'q.",
      q: 'Ikkinchi slayd qancha turadi?',
      opts: ['5 soniya', '2 soniya', '0 soniya', "Umuman almashmaydi"],
      why: "data-bs-interval yozilmagan slayd odatiy vaqtcha turadi: 5000 millisekund, bu 5 soniya. 2000 millisekund esa faqat birinchi slaydning vaqti.",
    },
    ru: {
      ctx: 'Карусель листается сама. У первого слайда время написано, у второго — нет.',
      q: 'Сколько простоит второй слайд?',
      opts: ['5 секунд', '2 секунды', '0 секунд', 'вообще не сменится'],
      why: 'Слайд без data-bs-interval стоит обычное время: 5000 миллисекунд, то есть 5 секунд. А 2000 миллисекунд — время только первого слайда.',
    },
    en: {
      ctx: 'The carousel moves by itself. The first slide has a time written, the second does not.',
      q: 'How long does the second slide stay?',
      opts: ['5 seconds', '2 seconds', '0 seconds', 'it never changes'],
      why: 'A slide without data-bs-interval stays the usual time: 5000 milliseconds, that is 5 seconds. The 2000 milliseconds belong only to the first slide.',
    },
  },
  {
    id: 'bootstrap_l09_q09',
    difficulty: 'medium',
    tags: ['btn-icon', 'eski nom'],
    mono: true,
    sort: false,
    vis: {
      code: '<button class="carousel-control-next"\n        data-bs-target="#sport"\n        data-bs-slide="next">\n  <span class="carousel-icon-next"></span>\n</button>',
      mark: [1],
    },
    uz: {
      ctx: "Eski darslikdagi tugma Bootstrap tugmasiga o'xshamadi: kulrang va oddiy chiqdi.",
      q: 'Bootstrap 6 da tugmaning class atributiga nima yoziladi?',
      opts: ['btn-icon btn-sm', 'carousel-next', 'carousel-control', 'btn-carousel-next'],
      why: "carousel-control-next — beshinchi versiyaning nomi. Oltinchi versiyada karusel tugmasi kichik belgili tugma: btn-icon btn-sm. Saytdagi Bottom controls namunasida shunday yozilgan.",
    },
    ru: {
      ctx: 'Кнопка из старого учебника не стала кнопкой Bootstrap: вышла серой и простой.',
      q: 'Что пишут в class кнопки в Bootstrap 6?',
      opts: ['btn-icon btn-sm', 'carousel-next', 'carousel-control', 'btn-carousel-next'],
      why: 'carousel-control-next — имя из 5-й версии. В 6-й кнопка карусели — маленькая кнопка со значком: btn-icon btn-sm. Так написано в примере Bottom controls на сайте.',
    },
    en: {
      ctx: 'A button from an old tutorial did not become a Bootstrap button: it came out grey and plain.',
      q: 'What goes in the button’s class in Bootstrap 6?',
      opts: ['btn-icon btn-sm', 'carousel-next', 'carousel-control', 'btn-carousel-next'],
      why: 'carousel-control-next is a version 5 name. In version 6 a carousel button is a small icon button: btn-icon btn-sm. That is how the Bottom controls example on the site writes it.',
    },
  },
  {
    id: 'bootstrap_l09_q10',
    difficulty: 'hard',
    tags: ['data-bs-target', 'moslash'],
    mono: false,
    sort: false,
    vis: {
      code: '<div id="sport" class="carousel">…</div>\n\n<div id="maktab" class="carousel">\n  …\n  <button class="btn-icon btn-sm"\n          data-bs-target="#sport"\n          data-bs-slide="next">›</button>\n</div>',
    },
    uz: {
      ctx: "Sahifada ikkita karusel bor. Ikkinchisining «›» tugmasi bosilsa, birinchi karusel aylanyapti.",
      q: 'Nega shunday?',
      opts: [
        'Tugmada #sport qolgan, #maktab kerak',
        "Sahifada ikkita karusel bo'lishi mumkin emas",
        "Ikkinchi karuselda active slayd yo'q",
        'script qatori ikki marta yozilishi kerak',
      ],
      why: "data-bs-target qaysi karuselni surishni aytadi. Tugma birinchi karuseldan nusxalangan va unda #sport qolib ketgan. Nusxalangan kodda target ham moslanadi: #maktab.",
    },
    ru: {
      ctx: 'На странице две карусели. Нажимаешь «›» у второй — листается первая.',
      q: 'Почему так?',
      opts: [
        'в кнопке остался #sport, нужен #maktab',
        'на странице не бывает двух каруселей',
        'у второй карусели нет слайда active',
        'строку script нужно написать дважды',
      ],
      why: 'data-bs-target говорит, какую карусель листать. Кнопку скопировали у первой карусели, и в ней остался #sport. В скопированном коде настраивают и target: #maktab.',
    },
    en: {
      ctx: 'The page has two carousels. Clicking “›” on the second one moves the first.',
      q: 'Why?',
      opts: [
        'the button still has #sport; it needs #maktab',
        'a page can’t have two carousels',
        'the second carousel has no active slide',
        'the script line must be written twice',
      ],
      why: 'data-bs-target says which carousel to move. The button was copied from the first carousel, and #sport stayed in it. In copied code, adapt the target too: #maktab.',
    },
  },
  {
    id: 'bootstrap_l09_q11',
    difficulty: 'hard',
    tags: ['script', 'surish'],
    mono: false,
    sort: false,
    vis: null,
    uz: {
      ctx: "Sahifada script qatori yo'q. Karusel kodi va link qatori esa joyida.",
      q: 'Telefonda karuselni barmoq bilan surish mumkinmi?',
      opts: [
        'Ha: surish ishlaydi, tugmalar esa ishlamaydi',
        "Yo'q: skriptsiz karusel umuman ishlamaydi",
        'Ha: surish ham, tugmalar ham ishlaydi',
        "Yo'q: rasmlar bir-birining ostida turadi",
      ],
      why: "Bootstrap 6 karuseli brauzerning surilishiga qurilgan: barmoq bilan surishni brauzerning o'zi qiladi. Tugmalar, nuqtalar va o'zi aylanishni esa Bootstrap skripti boshqaradi.",
    },
    ru: {
      ctx: 'На странице нет строки script. Код карусели и строка link на месте.',
      q: 'Можно ли на телефоне листать карусель пальцем?',
      opts: [
        'да: пальцем листается, а кнопки не работают',
        'нет: без скрипта карусель не работает совсем',
        'да: работают и палец, и кнопки',
        'нет: фото встанут друг под другом',
      ],
      why: 'Карусель Bootstrap 6 построена на прокрутке браузера: пальцем листает сам браузер. А кнопками, точками и автопрокруткой управляет скрипт Bootstrap.',
    },
    en: {
      ctx: 'The page has no script line. The carousel code and the link line are in place.',
      q: 'Can you swipe the carousel with a finger on a phone?',
      opts: [
        'yes: swiping works, but the buttons don’t',
        'no: without the script nothing works',
        'yes: both swiping and the buttons work',
        'no: the photos stack under each other',
      ],
      why: 'The Bootstrap 6 carousel is built on the browser’s own scrolling, so the browser handles swiping. The buttons, dots and autoplay are run by the Bootstrap script.',
    },
  },
  // ---- «Впиши ответ» (q12–q14) ----
  {
    id: 'bootstrap_l09_q12',
    type: 'input',
    difficulty: 'easy',
    tags: ['data-bs-autoplay'],
    mono: true,
    answer: ['true'],
    vis: {
      code: '<div id="sport" class="carousel"\n     data-bs-autoplay="___">\n  <div class="carousel-inner">\n    …\n  </div>\n</div>',
    },
    uz: {
      ctx: "Turnir rasmlari tugma bosilmasa ham o'zi almashib tursin.",
      q: "Bo'sh joyga qiymatni yozing.",
      why: "data-bs-autoplay qiymati true bo'lsa, karusel o'zi aylanadi: true — yoqiq, false — o'chiq degani. Saytda bu Autoplay bo'limida.",
    },
    ru: {
      ctx: 'Фото турнира должны сменяться сами, даже если кнопки не нажимают.',
      q: 'Впиши на пустое место значение.',
      why: 'Если у data-bs-autoplay значение true, карусель листается сама: true — включено, false — выключено. На сайте это раздел Autoplay.',
    },
    en: {
      ctx: 'The tournament photos should change by themselves, even when nobody clicks the buttons.',
      q: 'Type the value in the empty spot.',
      why: 'When data-bs-autoplay is true, the carousel moves by itself: true means on, false means off. On the site it is the Autoplay section.',
    },
  },
  {
    id: 'bootstrap_l09_q13',
    type: 'input',
    difficulty: 'medium',
    tags: ['carousel-indicators'],
    mono: true,
    answer: ['carousel-indicators'],
    vis: {
      code: '<div class="___">\n  <button data-bs-target="#sport"\n          data-bs-slide-to="0"></button>\n  <button data-bs-target="#sport"\n          data-bs-slide-to="1"></button>\n</div>',
    },
    uz: {
      ctx: "Rasm ostida nuqtalar bo'lsin: har bir nuqta — bitta slayd.",
      q: "Nuqtalarni o'rab turgan div tegiga qaysi so'z yoziladi?",
      why: "Nuqtalar qatorining nomi — carousel-indicators. Ichidagi har bir tugma data-bs-slide-to raqami bilan o'z slaydiga o'tkazadi, sanoq noldan boshlanadi.",
    },
    ru: {
      ctx: 'Под фото нужны точки: каждая точка — один слайд.',
      q: 'Какое слово пишется у div вокруг точек?',
      why: 'Ряд точек называется carousel-indicators. Каждая кнопка внутри по номеру data-bs-slide-to ведёт на свой слайд, счёт с нуля.',
    },
    en: {
      ctx: 'There should be dots under the photo: each dot is one slide.',
      q: 'Which word goes on the div around the dots?',
      why: 'The row of dots is called carousel-indicators. Each button inside goes to its slide by the data-bs-slide-to number, counting from zero.',
    },
  },
  {
    id: 'bootstrap_l09_q14',
    type: 'input',
    difficulty: 'hard',
    tags: ['data-bs-target'],
    mono: true,
    answer: ['#kubok'],
    vis: {
      code: '<div id="kubok" class="carousel">…</div>\n<button class="btn-icon btn-sm"\n        data-bs-target="___"\n        data-bs-slide="next">\n  <span class="carousel-icon-next"></span>\n</button>',
    },
    uz: {
      ctx: "Bu tugma kubok rasmlari karuselini keyingi slaydga o'tkazsin.",
      q: "Bo'sh joyga data-bs-target qiymatini yozing.",
      why: "data-bs-target karuselni id bo'yicha topadi va oldida panjara turadi: #kubok. Panjarasiz, faqat kubok yozilsa, tugma karuselni topa olmaydi.",
    },
    ru: {
      ctx: 'Эта кнопка должна листать вперёд карусель с фото кубка.',
      q: 'Впиши на пустое место значение data-bs-target.',
      why: 'data-bs-target находит карусель по id, и перед ним стоит решётка: #kubok. Если написать просто kubok, кнопка карусель не найдёт.',
    },
    en: {
      ctx: 'This button should move the cup photo carousel to the next slide.',
      q: 'Type the data-bs-target value in the empty spot.',
      why: 'data-bs-target finds the carousel by id, with a # in front: #kubok. With just kubok, the button can’t find the carousel.',
    },
  },
  // ---- Игровые: «собери» (q15, q16), «найди ошибку» (q17), «нажми на странице» (q18) ----
  {
    id: 'bootstrap_l09_q15',
    type: 'build',
    difficulty: 'medium',
    tags: ['carousel-item', 'active'],
    pieces: ['<div class="', 'carousel-item active', '">', '<img src="tog.png">', '</div>'],
    extra: ['carousel-items', '</img>'],
    vis: {
      code: '<div id="sport" class="carousel">\n  <div class="carousel-inner">\n    ___\n    <div class="carousel-item">…</div>\n  </div>\n</div>',
    },
    uz: {
      ctx: "Karusel tog' rasmi bilan boshlansin: birinchi slaydni yig'amiz.",
      q: "Bo'laklarni tartib bilan bosib, boshlanadigan slaydni yig'ing",
      why: "Slayd — carousel-item so'zli div, active esa karusel shu slayddan boshlanishini bildiradi. Ichida rasm, oxirida yopuvchi div. img tegining yopuvchi tegi yo'q.",
    },
    ru: {
      ctx: 'Карусель должна начинаться с фото гор: собираем первый слайд.',
      q: 'Нажимай кусочки по порядку и собери начальный слайд',
      why: 'Слайд — div со словом carousel-item, а active значит, что карусель начинается с него. Внутри фото, в конце закрывающий div. У img закрывающего тега нет.',
    },
    en: {
      ctx: 'The carousel should start with the mountain photo: we build the first slide.',
      q: 'Tap the pieces in order to build the starting slide',
      why: 'A slide is a div with the word carousel-item, and active means the carousel starts there. Inside is the photo, then the closing div. img has no closing tag.',
    },
  },
  {
    id: 'bootstrap_l09_q16',
    type: 'build',
    difficulty: 'easy',
    tags: ['data-bs-slide', 'next'],
    pieces: ['data-bs-slide', '=', '"next"'],
    extra: ['data-bs-ride', '"prev"', '#next'],
    vis: {
      code: '<button class="btn-icon btn-sm"\n        data-bs-target="#sport"\n        ___>\n  <span class="carousel-icon-next"></span>\n</button>',
    },
    uz: {
      ctx: "O'ngdagi tugma karuselni keyingi slaydga o'tkazsin.",
      q: "Bo'laklarni tartib bilan bosib, tugmaning atributini yig'ing",
      why: "Qayoqqa surishni data-bs-slide aytadi: next — keyingi, prev — oldingi. Qiymat qo'shtirnoq ichida, panjarasiz. data-bs-ride — beshinchi versiyadan qolgan nom.",
    },
    ru: {
      ctx: 'Правая кнопка должна листать карусель вперёд.',
      q: 'Нажимай кусочки по порядку и собери атрибут кнопки',
      why: 'Куда листать, говорит data-bs-slide: next — вперёд, prev — назад. Значение — в кавычках, без решётки. data-bs-ride — имя из 5-й версии.',
    },
    en: {
      ctx: 'The right button should move the carousel forward.',
      q: 'Tap the pieces in order to build the button’s attribute',
      why: 'data-bs-slide says where to move: next is forward, prev is back. The value goes in quotes, with no #. data-bs-ride is a version 5 name.',
    },
  },
  {
    id: 'bootstrap_l09_q17',
    type: 'bug',
    difficulty: 'medium',
    tags: ['data-bs-interval', 'millisekund'],
    line: 4,
    vis: {
      code: '<div class="carousel" data-bs-autoplay="true">\n  <div class="carousel-inner">\n    <div class="carousel-item active"\n         data-bs-interval="3">…</div>\n    <div class="carousel-item">…</div>\n  </div>\n</div>',
    },
    uz: {
      ctx: "Birinchi rasm 3 soniya tursin edi, lekin u ko'z ochib-yumguncha almashib ketyapti.",
      q: 'Qaysi qatorda xato bor? Shu qatorni bosing',
      why: "4-qatorda vaqt soniyada yozilgan: 3. data-bs-interval esa millisekundda o'qiydi, 3 millisekund — juda qisqa. 3 soniya — 3000.",
    },
    ru: {
      ctx: 'Первое фото должно было стоять 3 секунды, а оно меняется в мгновение ока.',
      q: 'В какой строке ошибка? Нажми на эту строку',
      why: 'В строке 4 время записано в секундах: 3. А data-bs-interval читает миллисекунды, 3 миллисекунды — это совсем мало. 3 секунды — 3000.',
    },
    en: {
      ctx: 'The first photo should stay for 3 seconds, but it changes in the blink of an eye.',
      q: 'Which line has the mistake? Tap that line',
      why: 'Line 4 gives the time in seconds: 3. But data-bs-interval reads milliseconds, and 3 milliseconds is tiny. 3 seconds is 3000.',
    },
  },
  {
    id: 'bootstrap_l09_q18',
    type: 'tap',
    difficulty: 'easy',
    tags: ['data-bs-slide', 'next'],
    answer: 'keyingi',
    vis: {
      page: t3(
        '<h4 data-t="sarlavha">Robo-futbol turniri</h4>' + CAR18,
        '<h4 data-t="sarlavha">Турнир Robo-futbol</h4>' + CAR18,
        '<h4 data-t="sarlavha">Robo-futbol tournament</h4>' + CAR18,
      ),
    },
    uz: {
      ctx: "Turnir karuseli: tepada sarlavha, rasm ostida ikkita tugma va nuqtalar.",
      q: 'Qaysi tugmaning data-bs-slide qiymati next? Ustiga bosing',
      why: "next — keyingi slayd, uning belgisi o'ngga qaragan. prev — oldingi, chapga qaragan. O'rtadagi nuqtalar esa carousel-indicators.",
    },
    ru: {
      ctx: 'Карусель турнира: сверху заголовок, под фото две кнопки и точки.',
      q: 'У какой кнопки data-bs-slide равен next? Нажми на неё',
      why: 'next — следующий слайд, его значок смотрит вправо. prev — предыдущий, смотрит влево. А точки посередине — это carousel-indicators.',
    },
    en: {
      ctx: 'The tournament carousel: a heading on top, two buttons and dots under the photo.',
      q: 'Which button has data-bs-slide set to next? Tap it',
      why: 'next is the next slide, and its icon points right. prev is the previous one, pointing left. The dots in the middle are carousel-indicators.',
    },
  },
];

