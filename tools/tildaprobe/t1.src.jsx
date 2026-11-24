// =============================================================================
// ПРОБНЫЙ ЭКРАН МОДУЛЯ TILDA (24.11.2026) — тестовый урок, не урок курса.
// Урок 1 «Знакомство с Tilda и первый сайт»: похожий редактор Tilda → библиотека блоков → обложка без замка →
// свой заголовок прямо на странице → «Опубликовать» → окно «Публикация прошла успешно!» → сайт по адресу .tilda.ws (без окна браузера).
// Сборка: node tools/tildaprobe/build.mjs → lessons/test/35-tilda-probnyy-ekran.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ПРОБА · модуль Tilda, урок 1 — один экран =====
//
// Редактор нарисован по настоящему (сверка 24.11.2026, docs/tilda-redaktor-zametki.md): верхняя полоса «Мои сайты / … /
// страница», «Предпросмотр», «Опубликовать»; пустая страница с «ВСЕ БЛОКИ» и быстрыми кнопками; библиотека слева с
// вкладками «Базовые / Вайб / Про» и категориями; блоки с шифром (CR01, CR28…), платные — с замком и «Доступно на платном
// тарифе»; у блока — «CR28 ▾ · Настройки · Контент»; текст правится прямо на странице; окно публикации с адресом .tilda.ws.
// Слова Tilda — как в интерфейсе: на русском для uz и ru (узбекского интерфейса у Tilda нет), на английском для en.
// Ни окна браузера, ни кода (заказчик, 24.11.2026: «убери браузер… ни одного кода не должно быть»); сначала — телефон.
// =============================================================================
const META = {
  lessonId: 'test-35-tilda-probnyy-ekran',
  module: 'tilda-m1-sayt',
  lessonTitle: {
    uz: 'Sinov: Tilda bilan birinchi sayt',
    ru: 'Проба: первый сайт на Tilda',
    en: 'Trial: your first site on Tilda'
  }
};
const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
// Слово интерфейса Tilda: у uz — русское, как увидит ученик.
const TW = (ru, en) => ({ uz: ru, ru: ru, en: en });

const UI = {
  finish: L3('Tugatish', 'Завершить', 'Finish'),
  done: L3('Tayyor', 'Готово', 'Done')
};

// Слова интерфейса Tilda.
const TL = {
  mySites: TW('Мои сайты', 'My sites'),
  site: TW('Мой сайт', 'My site'),
  page: TW('Главная', 'Home'),
  preview: TW('Предпросмотр', 'Preview'),
  publish: TW('Опубликовать', 'Publish'),
  more: TW('Еще', 'More'),
  empty1: TW('Посмотрите короткий ролик о том, как редактировать страницу', 'Watch a short video on how to edit a page'),
  empty2: TW('и начните проект с добавления блоков из библиотеки.', 'and start the project by adding blocks from the library.'),
  all: TW('ВСЕ БЛОКИ', 'ALL BLOCKS'),
  quick: [TW('Обложка', 'Cover'), TW('Заголовок: средний', 'Title: medium'), TW('Лид', 'Lead'), TW('Текст', 'Text'), TW('Изображение', 'Image')],
  lib: TW('Библиотека блоков', 'Block library'),
  tabs: [TW('Базовые', 'Basic'), TW('Вайб', 'Vibe'), TW('Про', 'Pro')],
  cats: [TW('Обложка', 'Cover'), TW('О проекте', 'About'), TW('Заголовок', 'Title'), TW('Текстовый блок', 'Text block'), TW('Изображение', 'Image'),
    TW('Галерея', 'Gallery'), TW('Форма', 'Form'), TW('Кнопка', 'Button'), TW('Меню', 'Menu'), TW('Подвал', 'Footer')],
  paid: TW('Доступно на платном тарифе', 'Available on a paid plan'),
  settings: TW('Настройки', 'Settings'),
  content: TW('Контент', 'Content'),
  okH: TW('Публикация прошла успешно!', 'Published successfully!'),
  okLink: TW('Публичная ссылка на эту страницу:', 'Public link to this page:'),
  open: TW('Открыть страницу', 'Open page'),
  close: TW('Закрыть', 'Close'),
  seo: TW('Как улучшить SEO?', 'How to improve SEO?'),
  made: TW('Made on Tilda', 'Made on Tilda')
};
// Обложки в библиотеке: на бесплатном тарифе CR01 и CR02 — с замком, CR28 и CR31 — без (как в настоящей Tilda).
const COVERS = [
  { id: 'CR01', paid: true, d: TW('Обложка: заголовок, подзаголовок и раздел', 'Cover: title, subtitle and section'), look: 'mount' },
  { id: 'CR02', paid: true, d: TW('Обложка: заголовок и описание', 'Cover: title and description'), look: 'lake' },
  { id: 'CR28', paid: false, d: TW('Обложка с текстом на плашке', 'Cover with text on a plate'), look: 'plate' },
  { id: 'CR31', paid: false, d: TW('Обложка с фото автора', 'Cover with author photo'), look: 'author' }
];
const COVER_TXT = {
  CR28: { t: 'Bring Your Ideas to Life', p: 'Everything that you dreamed of can be brought to life.' },
  CR31: { t: 'John Smith', p: 'Photographer and traveller' }
};
const SITE_URL = 'brave-orange-robot.tilda.ws';

const C = {
  eyebrow: L3('1-dars · Tilda bilan tanishuv', 'Урок 1 · Знакомство с Tilda', 'Lesson 1 · Meet Tilda'),
  say: [
    L3("Salom! Bugun Tilda bilan tanishamiz. Tilda — kod yozmasdan sayt yig'adigan joy. Bu yerda sayt tayyor bloklardan yig'iladi, ya'ni har bir blok — saytning bir qismi: muqova, matn, rasm, forma. Xuddi Bootstrap'dagi tayyor komponentlar kabi! Hozir sahifa bo'm-bo'sh. Pastdagi «Все блоки» tugmasini bosing — bloklar kutubxonasi ochiladi.",
      'Привет! Сегодня знакомимся с Tilda. Tilda — место, где сайт собирают без кода. Здесь сайт складывается из готовых блоков, то есть каждый блок — часть сайта: обложка, текст, картинка, форма. Совсем как готовые компоненты в Bootstrap! Сейчас страница пустая. Нажми внизу «Все блоки» — откроется библиотека блоков.',
      'Hi! Today we meet Tilda. Tilda is a place where you build a site without code. Here a site is made of ready blocks, that is, each block is one part of the site: a cover, text, an image, a form. Just like ready components in Bootstrap! Right now the page is empty. Tap “All blocks” at the bottom, and the block library opens.'),
    L3("Mana, bloklar kutubxonasi. Chapda bo'limlar: muqova, sarlavha, matn, forma va boshqalar. Saytning eng birinchi qismi — muqova, ya'ni katta sarlavhali birinchi ekran. «Обложка» bo'limini oching.",
      'Вот библиотека блоков. Слева разделы: обложка, заголовок, текст, форма и другие. Самая первая часть сайта — обложка, то есть первый экран с большим заголовком. Открой раздел «Обложка».',
      'Here’s the block library. On the left are sections: cover, title, text, form and more. The very first part of a site is the cover, that is, the first screen with a big title. Open the “Cover” section.'),
    L3("Qarang, ba'zi bloklarda qulf bor. Qulf — bu blok pullik tarifda, degani. Bepul akkauntda qulfsiz bloklarni olamiz. Qulfsiz muqovani tanlang.",
      'Смотри, у некоторых блоков замок. Замок значит, что блок есть только на платном тарифе. На бесплатном аккаунте берём блоки без замка. Выбери обложку без замка.',
      'Look, some blocks have a lock. A lock means the block is only on a paid plan. On a free account we take blocks without a lock. Pick a cover without a lock.'),
    L3("Ajoyib, muqova sahifaga tushdi! Lekin sarlavha hali inglizcha, birovning gapi. Tilda'da matnni to'g'ridan-to'g'ri sahifaning o'zida o'zgartirsa bo'ladi. Sarlavhani bosing va saytingiz nomini yozing.",
      'Отлично, обложка встала на страницу! Но заголовок пока чужой, на английском. В Tilda текст меняют прямо на самой странице. Нажми на заголовок и напиши название своего сайта.',
      'Great, the cover is on the page! But the title is still someone else’s text. In Tilda you change text right on the page itself. Tap the title and type your site’s name.'),
    L3("Zo'r nom! Endi eng qiziq joyi: saytni internetga chiqaramiz. Tepada «Опубликовать» tugmasi bor, ya'ni e'lon qilish. Bosing!",
      'Классное название! Теперь самое интересное: выпускаем сайт в интернет. Вверху есть кнопка «Опубликовать». Жми!',
      'Cool name! Now the most exciting part: we put the site on the internet. At the top there’s a “Publish” button. Tap it!'),
    L3("Tayyor! Tilda saytingizga o'z manzilini berdi. Endi bu sayt internetda: uni istalgan telefondan ochsa bo'ladi. «Открыть страницу» ni bosing va saytingizni ko'ring.",
      'Готово! Tilda дала сайту свой адрес. Теперь сайт в интернете: его можно открыть с любого телефона. Нажми «Открыть страницу» и посмотри на свой сайт.',
      'Done! Tilda gave your site its own address. Now the site is online: you can open it from any phone. Tap “Open page” and look at your site.')
  ],
  ask: [
    L3('«Все блоки» tugmasini bosing', 'Нажми «Все блоки»', 'Tap “All blocks”'),
    L3("«Обложка» bo'limini oching", 'Открой раздел «Обложка»', 'Open the “Cover” section'),
    L3('Qulfsiz muqovani tanlang', 'Выбери обложку без замка', 'Pick a cover without a lock'),
    L3('Sarlavhani bosing va sayt nomini yozing', 'Нажми на заголовок и напиши название сайта', 'Tap the title and type the site name'),
    L3('«Опубликовать» tugmasini bosing', 'Нажми «Опубликовать»', 'Tap “Publish”'),
    L3('«Открыть страницу» ni bosing', 'Нажми «Открыть страницу»', 'Tap “Open page”')
  ],
  hints: [
    L3("Sahifaning pastida qora tugma bor: «Все блоки».", 'Внизу страницы чёрная кнопка «Все блоки».', 'At the bottom of the page there’s a black “All blocks” button.'),
    L3("Chapdagi ro'yxatda birinchi bo'lim — «Обложка».", 'В списке слева первый раздел — «Обложка».', 'The first section in the list on the left is “Cover”.'),
    L3("Qulfli bloklar xira. CR28 yoki CR31 ni tanlang — ularda qulf yo'q.", 'Блоки с замком бледные. Выбери CR28 или CR31 — у них замка нет.', 'Locked blocks are pale. Pick CR28 or CR31: they have no lock.'),
    L3("Muqovadagi katta yozuvni bosing, eskisini o'chirib, o'z nomingizni yozing va «Tayyor» ni bosing.", 'Нажми на большую надпись на обложке, сотри старую, напиши своё название и нажми «Готово».', 'Tap the big text on the cover, erase it, type your own name and tap “Done”.'),
    L3("«Опубликовать» — muharrirning tepasida, o'ng tomonda.", '«Опубликовать» — вверху редактора, справа.', '“Publish” is at the top of the editor, on the right.'),
    L3("Oynaning o'rtasida to'q sariq tugma: «Открыть страницу».", 'В середине окна оранжевая кнопка «Открыть страницу».', 'In the middle of the window there’s an orange “Open page” button.')
  ],
  locked: L3("Bu blokda qulf bor — u faqat pullik tarifda. Qulfsiz muqovani tanlang.", 'У этого блока замок: он только на платном тарифе. Выбери обложку без замка.', 'This block has a lock: it’s only on a paid plan. Pick a cover without a lock.'),
  wrongCat: L3("Bu bo'lim boshqa bloklar uchun. Bizga muqova kerak — «Обложка».", 'Этот раздел для других блоков. Нам нужна обложка — «Обложка».', 'That section is for other blocks. We need a cover: “Cover”.'),
  emptyTitle: L3("Sarlavha bo'sh qoldi. Saytingiz nomini yozing.", 'Заголовок пустой. Напиши название своего сайта.', 'The title is empty. Type your site’s name.'),
  sameTitle: L3("Bu hali eski inglizcha sarlavha. O'z saytingiz nomini yozing.", 'Это всё ещё старый английский заголовок. Напиши название своего сайта.', 'That’s still the old title. Type your own site’s name.'),
  ph: L3('Masalan: Robotlar klubi', 'Например: Клуб роботов', 'For example: Robot club'),
  ok: L3("Mana u — sizning saytingiz, haqiqiy internet manzili bilan! Bir necha daqiqada, bitta ham kod yozmasdan. Pastdagi «Made on Tilda» yozuvini ko'rdingizmi? Bepul tarifda Tilda uni o'zi qo'shadi. Bu manzilni do'stlaringizga yuborsangiz, ular ham saytingizni ko'radi!",
    'Вот он — твой сайт с настоящим адресом в интернете! За пару минут и без единой строчки кода. Видишь внизу надпись «Made on Tilda»? На бесплатном тарифе Tilda добавляет её сама. Отправь этот адрес друзьям — и они тоже увидят твой сайт!',
    'There it is, your site with a real internet address! In a couple of minutes and without a single line of code. See “Made on Tilda” at the bottom? On the free plan Tilda adds it itself. Send this address to your friends, and they’ll see your site too!'),
  askOk: L3('Sayt internetda!', 'Сайт в интернете!', 'The site is online!')
};

/*@L2_HELPERS@*/

Object.assign(SPOKEN, { msgs: 1, hint1: 1, hint2: 1, hint3: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:t1-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:t1.css@*/
`;
