// =============================================================================
// ТЕСТЫ К УРОКУ 8 МОДУЛЯ BOOTSTRAP «Карусель» (20.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: слайды обнимает carousel-inner; начальный слайд — active; data-bs-target с «#»; точки считаются с нуля
// (data-bs-slide-to); data-bs-interval — в миллисекундах.
// Страница — честная (bs={BS_CSS}): карусель Bootstrap 6 на прокрутке браузера, без скрипта видна первая картинка.
// Апостроф — ASCII «'».
// =============================================================================
const SLUG = 'karusel';
const b8Car = (inner, item1) => `<div id="robotlar" class="carousel">\n  <div class="${inner}">\n    <div class="${item1}"><img src="slayd1.jpg" alt=""></div>\n    <div class="carousel-item"><img src="slayd2.jpg" alt=""></div>\n  </div>\n</div>`;
const B8_PAGE = b8Car('carousel-inner', 'carousel-item active');
const b8Code = (inner, item1) => `<div id="robotlar" class="carousel">\n  <div class="${inner}">\n    <div class="${item1}">…</div>\n    <div class="carousel-item">…</div>\n  </div>\n</div>`;
const QS = [
  { id: 'bootstrap-08t1', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'carousel-inner', correct: 1, mono: true,
    vis: () => <WqVis code={b8Code('___', 'carousel-item active')} html={B8_PAGE} bs={BS_CSS} mark={[2]} />,
    uz: { ctx: "Karusel uch qavatdan iborat: tashqi div, slaydlarni o'rab turgan div va slaydlar.", q: "Bo'sh joyga qaysi so'z yoziladi?", opts: ['carousel-list', 'carousel-inner', 'carousel-items', 'carousel-box'],
      ok: "Qoyil! Tartib: carousel, ichida carousel-inner, uning ichida carousel-item slaydlari. inner — ichki degani.", hint: "Darsdagi uch qavatni eslang. O'rtadagisining nomi «ichki» degan inglizcha so'z bilan tugaydi.", alt: "O'rta qavati bo'sh karusel kodi va karusel" },
    ru: { ctx: 'Карусель — три слоя: внешний div, обёртка слайдов и слайды.', q: 'Какое слово пишется на пустое место?', opts: ['carousel-list', 'carousel-inner', 'carousel-items', 'carousel-box'],
      ok: 'Здорово! Порядок: carousel, в нём carousel-inner, в нём слайды carousel-item. inner значит «внутренний».', hint: 'Вспомните три слоя из урока. Имя среднего кончается английским словом «внутренний».', alt: 'Код карусели с пустым средним слоем и карусель' },
    en: { ctx: 'A carousel has three layers: the outer div, the div around the slides, and the slides.', q: 'Which word goes in the empty spot?', opts: ['carousel-list', 'carousel-inner', 'carousel-items', 'carousel-box'],
      ok: 'Nice work! The order: carousel, carousel-inner inside it, carousel-item slides inside that. inner means “inside”.', hint: 'Remember the three layers from the lesson. The middle one ends with the English word for “inside”.', alt: 'Carousel code with an empty middle layer and the carousel' } },
  { id: 'bootstrap-08t2', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'active', correct: 3, mono: true,
    vis: () => <WqVis code={b8Code('carousel-inner', 'carousel-item ___')} html={B8_PAGE} bs={BS_CSS} mark={[3]} />,
    uz: { ctx: "Sahifa ochilganda karusel birinchi slayddan boshlanishi kerak.", q: "Birinchi slaydning class-iga qaysi so'z qo'shiladi?", opts: ['first', 'start', 'show', 'active'],
      ok: "To'ppa-to'g'ri! active — hozir ko'rinib turgan slayd. Sahifa ochilganda karusel shundan boshlanadi.", hint: "Darsda boshlang'ich slaydga «faol» degan so'z qo'yilgan edi. U inglizcha qanday?", alt: "Birinchi slaydi belgilangan karusel kodi" },
    ru: { ctx: 'Когда страница открывается, карусель должна начинаться с первого слайда.', q: 'Какое слово добавляют в class первого слайда?', opts: ['first', 'start', 'show', 'active'],
      ok: 'Верно! active — слайд, который виден сейчас. С него карусель и начинается.', hint: 'В уроке начальному слайду ставили слово «активный». Как оно по-английски?', alt: 'Код карусели с выделенным первым слайдом' },
    en: { ctx: 'When the page opens, the carousel should start on the first slide.', q: 'Which word is added to the first slide’s class?', opts: ['first', 'start', 'show', 'active'],
      ok: 'Right! active is the slide that’s visible now. The carousel starts there.', hint: 'In the lesson the starting slide got a word meaning “currently on”. What is it?', alt: 'Carousel code with the first slide marked' } },
  { id: 'bootstrap-08t3', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'data-bs-target', correct: 0,
    vis: () => <WqVis code={`<div id="robotlar" class="carousel">\n  …\n</div>\n<button class="btn-icon btn-sm"\n        data-bs-slide="next"\n        data-bs-target="robotlar">›</button>`} mark={[6]} />,
    uz: { ctx: "«›» tugmasi bosilganda karusel keyingi slaydga o'tmayapti. script qatori bor.", q: 'Nima xato?', opts: ["target-da # yo'q, #robotlar kerak", "next o'rniga right yozish kerak edi", "Tugmaga btn-solid so'zi yozilmagan", "Karuselda id bo'lmasligi kerak edi"],
      ok: "Xuddi shunday! data-bs-target id bo'yicha qidiradi va oldida # turishi shart: #robotlar. Usiz tugma qaysi karuselni surishni bilmaydi.", hint: "Tugma karuselni id bo'yicha topadi. Darsda id oldiga qanday belgi qo'yilgan edi?", alt: "Karusel tugmasining kodi" },
    ru: { ctx: 'При нажатии «›» карусель не переходит дальше. Строка script есть.', q: 'Что не так?', opts: ['В target нет #: нужно #robotlar', 'Вместо next нужно было написать right', 'У кнопки нет слова btn-solid в class', 'У карусели вообще не должно быть id'],
      ok: 'Именно! data-bs-target ищет по id, и перед ним обязательно #: #robotlar. Без него кнопка не знает, какую карусель листать.', hint: 'Кнопка находит карусель по id. Какой знак в уроке ставили перед id?', alt: 'Код кнопки карусели' },
    en: { ctx: 'Clicking “›” doesn’t move the carousel on. The script line is there.', q: 'What is wrong?', opts: ['target has no #, it needs #robotlar', 'It should say right instead of next', 'The button has no btn-solid class word', 'The carousel must not have any id at all'],
      ok: 'Exactly! data-bs-target looks things up by id, and it needs # in front: #robotlar. Without it the button doesn’t know which carousel to move.', hint: 'The button finds the carousel by its id. Which sign went before the id in the lesson?', alt: 'The code of a carousel button' } },
  { id: 'bootstrap-08t4', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'slide-to', correct: 2, mono: true,
    vis: () => <WqVis code={`<div class="carousel-indicators">\n  <button data-bs-target="#robotlar" data-bs-slide-to="0"></button>\n  <button data-bs-target="#robotlar" data-bs-slide-to="1"></button>\n  <button data-bs-target="#robotlar" data-bs-slide-to="___"></button>\n</div>`} mark={[4]} />,
    uz: { ctx: "Karusel ostidagi nuqtalar. Uchinchi nuqta uchinchi slaydga o'tkazishi kerak.", q: "Bo'sh joyga qaysi son yoziladi?", opts: ['3', '1', '2', '0'],
      ok: "Juda zo'r! Nuqtalar noldan sanaladi: 0 — birinchi slayd, 1 — ikkinchi, 2 — uchinchi.", hint: "Birinchi nuqtaga qarang: unda qaysi son turibdi? Sanoq qaysi sondan boshlanadi?", alt: "Karusel nuqtalarining kodi" },
    ru: { ctx: 'Точки под каруселью. Третья точка должна переключать на третий слайд.', q: 'Какое число пишется на пустое место?', opts: ['3', '1', '2', '0'],
      ok: 'Отлично! Точки считаются с нуля: 0 — первый слайд, 1 — второй, 2 — третий.', hint: 'Посмотрите на первую точку: какое там число? С какого числа начинается счёт?', alt: 'Код точек карусели' },
    en: { ctx: 'The dots under the carousel. The third dot should switch to the third slide.', q: 'Which number goes in the empty spot?', opts: ['3', '1', '2', '0'],
      ok: 'Great! The dots count from zero: 0 is the first slide, 1 the second, 2 the third.', hint: 'Look at the first dot: which number does it have? Where does the count start?', alt: 'The code of the carousel dots' } },
  { id: 'bootstrap-08t5', target: 'bootstrap-08', ptype: 'Bootstrap', tag: 'interval', correct: 1, mono: true,
    vis: () => <WqVis code={`<div class="carousel-item active"\n     data-bs-interval="___">\n  <img src="slayd1.jpg" alt="">\n</div>`} mark={[2]} />,
    uz: { ctx: "Karusel o'zi aylanadi. Birinchi slayd 3 soniya turishi kerak.", q: "Bo'sh joyga nima yoziladi?", opts: ['3', '3000', '3s', '300'],
      ok: "To'ppa-to'g'ri! Vaqt millisoniyada yoziladi: 1 soniya — 1000, demak 3 soniya — 3000.", hint: "data-bs-interval vaqtni qaysi birlikda o'qiydi? Odatiy qiymat 5000 edi — bu necha soniya?", alt: "data-bs-interval qiymati bo'sh slayd kodi" },
    ru: { ctx: 'Карусель листается сама. Первый слайд должен стоять 3 секунды.', q: 'Что пишется на пустое место?', opts: ['3', '3000', '3s', '300'],
      ok: 'Верно! Время пишут в миллисекундах: 1 секунда — 1000, значит 3 секунды — 3000.', hint: 'В каких единицах data-bs-interval читает время? Обычное значение было 5000 — это сколько секунд?', alt: 'Код слайда с пустым data-bs-interval' },
    en: { ctx: 'The carousel moves on its own. The first slide should stay for 3 seconds.', q: 'What goes in the empty spot?', opts: ['3', '3000', '3s', '300'],
      ok: 'Right! Time is written in milliseconds: 1 second is 1000, so 3 seconds is 3000.', hint: 'Which unit does data-bs-interval read time in? The default was 5000: how many seconds is that?', alt: 'Slide code with an empty data-bs-interval' } }
];
