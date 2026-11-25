// =============================================================================
// ОБЩИЕ СЛОВА И ДАННЫЕ ИНТЕРФЕЙСА TILDA для уроков модуля (урок 1, урок 2 …). Слово интерфейса — как в Tilda: для uz и ru
// русское (узбекского интерфейса у Tilda нет), для en — английское. Подключается меткой FILE на этот файл.
// =============================================================================
// Слово интерфейса Tilda: у uz — русское, как увидит ученик.
const TW = (ru, en) => ({ uz: ru, ru: ru, en: en });

// Слова интерфейса Tilda.
const TL = {
  brand: TW('Tilda Publishing', 'Tilda Publishing'),
  hero: TW('Создайте впечатляющий сайт на Tilda', 'Create an impressive website on Tilda'),
  reg: TW('Регистрация', 'Sign up'),
  login: TW('Войти', 'Log in'),
  start: TW('Начните с бесплатной учетной записи', 'Start with a free account'),
  fName: TW('Ваше имя', 'Your name'),
  fMail: TW('Электронная почта', 'Email'),
  fPass: TW('Пароль', 'Password'),
  regBtn: TW('Зарегистрироваться', 'Sign up'),
  newSite: TW('Создать новый сайт', 'Create a new website'),
  editSite: TW('РЕДАКТИРОВАТЬ САЙТ', 'EDIT WEBSITE'),
  head: TW('ЗАГОЛОВОК', 'TITLE'),
  headPh: TW('Мой проект', 'My project'),
  headNote: TW('Используется только внутри Тильды.', 'Used only inside Tilda.'),
  type: TW('ТИП САЙТА', 'WEBSITE TYPE'),
  web: TW('Веб-сайт', 'Website'),
  shop: TW('Интернет-магазин', 'Online store'),
  close: TW('Закрыть', 'Close'),
  create: TW('Создать', 'Create'),
  mySites: TW('Мои сайты', 'My sites'),
  addr: TW('Адрес сайта:', 'Website address:'),
  siteSet: TW('Настройки сайта', 'Website settings'),
  newPage: TW('Создать новую страницу', 'Create new page'),
  noPages: TW('Вы создали сайт, но в нем пока нет ни одной страницы.', 'You created a website, but it has no pages yet.'),
  withAi: TW('Начните новую страницу с AI', 'Start a new page with AI'),
  aiPh: TW('Создай лендинг для школы танцев…', 'Make a landing page for a dance school…'),
  tplSearch: TW('Поиск по шаблонам', 'Search templates'),
  blank: TW('Пустая страница', 'Blank page'),
  fromBlocks: TW('Собрать страницу из готовых блоков', 'Build a page from ready blocks'),
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
  seo: TW('Как улучшить SEO?', 'How to improve SEO?'),
  made: TW('Made on Tilda', 'Made on Tilda'),
  ctaFree: TW('Создать сайт бесплатно', 'Create a site for free'),
  hero1: TW('Создайте впечатляющий сайт на Tilda.', 'Create an impressive website on Tilda.'),
  hero2: TW('Вместе с', 'Together with'),
  heroSub: TW('Мгновенный старт с ИИ. Превратите идею в готовый сайт всего за несколько шагов — быстро и без ограничений.', 'An instant start with AI. Turn an idea into a ready site in just a few steps — fast and without limits.'),
  ckLink: TW('Подробнее — в политике использования cookie-файлов', 'More in the cookie policy'),
  terms: TW('Нажимая «Зарегистрироваться», вы принимаете условия пользовательского соглашения и политики конфиденциальности', 'By clicking “Sign up”, you accept the terms of the user agreement and the privacy policy'),
  haveAcc: TW('Уже зарегистрированы? Войти тут', 'Already registered? Log in here'),
  typeNote: TW('Определяет подсказки и интерфейс редактора, но не ограничивает доступные возможности.', 'Sets the editor’s hints and interface but doesn’t limit what you can do.'),
  domain: TW('ПОДКЛЮЧИТЬ ДОМЕН', 'CONNECT DOMAIN'),
  pubAll: TW('ОПУБЛИКОВАТЬ ВСЕ СТРАНИЦЫ', 'PUBLISH ALL PAGES'),
  leads: TW('ЗАЯВКИ', 'LEADS'),
  noPages2: TW('Нажмите кнопку «Создать новую страницу».', 'Click “Create new page”.'),
  withAiA: TW('Начните новую страницу с', 'Start a new page with'),
  aiNote: TW('Искусственный интеллект может допускать ошибки. Условия использования.', 'AI can make mistakes. Terms of use.'),
  templates: TW('Шаблоны', 'Templates'),
  tplCats: [TW('Бизнес', 'Business'), TW('Магазин', 'Store'), TW('Pro', 'Pro'), TW('Мультиссылка', 'Multilink'), TW('Квиз-форма', 'Quiz form'), TW('Событие', 'Event')],
  myProjects: TW('Мои проекты:', 'My projects:'),
  plans: TW('Тарифы и оплата', 'Plans and billing'),
  profile: TW('Профиль', 'Profile'),
  help: TW('Справочный центр', 'Help center'),
  lessons: TW('Уроки и статьи', 'Lessons and articles'),
  logout: TW('Выйти', 'Log out'),

  overview: TW('Обзор', 'Overview'),
  tariffs: TW('ТАРИФЫ', 'PRICING'),
  blog: TW('БЛОГ', 'BLOG'),
  more2: TW('ЕЩЁ', 'MORE'),
  find: L3('Qidirish', 'Найти', 'Search'),
  resH: TW('Конструктор сайтов Tilda Publishing — создать сайт бесплатно', 'Tilda Publishing website builder — create a site for free'),
  resD: TW('Создайте сайт, интернет-магазин или лендинг без кода…', 'Create a website, online store or landing page without code…'),
  ckH: TW('Управление файлами cookies', 'Managing cookies'),
  ckT: TW('Мы используем cookies. Это нужно для улучшения работы сайта и платформы.', 'We use cookies to improve the site and the platform.'),
  ckYes: TW('Принять все', 'Accept all'),
  ckNo: TW('Отклонить все', 'Decline all'),
  ckSet: TW('Настроить', 'Settings'),
  lMail: TW('Эл. почта', 'Email'),
  robot: TW('Я не робот', 'I’m not a robot'),
  forgot: TW('Забыли пароль?', 'Forgot password?'),
  // Блоки на странице-примере (показ «конструктор»).
  bMenu: TW('Меню', 'Menu'), bCover: TW('Обложка', 'Cover'), bText: TW('Текст', 'Text'), bGal: TW('Галерея', 'Gallery'), bForm: TW('Форма', 'Form'), bFoot: TW('Подвал', 'Footer')
};
// Обложки в библиотеке: на бесплатном тарифе CR01 и CR02 — с замком, CR28 и CR31 — без (как в настоящей Tilda, 24.11.2026).
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
// Адрес сайта: Tilda выдаёт его сама (в настоящей — три случайных слова, как sedately-strong-walnut.tilda.ws).
const SITE_URL = 'brave-orange-robot.tilda.ws';
