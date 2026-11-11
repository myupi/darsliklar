// =============================================================================
// НАБОР МОДУЛЯ «ИИ» (11.11.2026, основа — пробный экран tools/aiprobe/): «промпт в редакторе» без кода.
// · Симулятор ИИ (aiSite): честно собирает сайт из того, что написано в промпте. Нет «Nega?» — сайт без цели и цвета;
//   цель «записаться» — кнопка регистрации, «позвонить» — кнопка звонка, «заказать» — кнопка заказа, «рассказать» —
//   блок с информацией, «прийти» — кнопка «как добраться». Тема (футбол, шахматы, пицца…) — цвета сайта.
// · PromptEditor: светлое поле промпта как в ИИ-приложении; строки с метками вопросов формулы, кнопка «Yuborish» внутри.
// · Pins: метки вопросов у частей сайта — что дала каждая строка промпта.
// Заказчик (11.11.2026): «не обязательно чтобы код был… ученик научился писать правильный промпт и увидеть его
// результат, думать правильно» — кода ИИ в уроке нет.
// =============================================================================

const lowAll = (s) => String(s || '').toLowerCase().replace(/[‘’ʻʼ`]/g, "'");
const has = (s, re) => re.test(lowAll(s));
// Что должен сделать сайт (цель).
const RE_TELL = /haqida|ma'lumot|aytib|aytsin|aytish|tanishtir|ko'rsat|qachon|qayerda|vaqt|manzil|расска|информ|покаж|когда|где|время|tell|about|inform|show|when|where|time/;
const RE_JOIN = /ro'yxat|royxat|yozil|qatnash|ishtirok|qo'shil|a'zo|регистр|запис|участв|вступ|sign|regist|join|enrol/;
const RE_CALL = /qo'ng'iroq|qongiroq|telefon|bog'lan|позвон|звон|связ|call|phone|contact/;
const RE_ORDER = /buyurtma|sotib|xarid|заказ|куп|order|buy/;
const RE_COME = /kelsin|kelish|tashrif|keling|kelishsin|приш|прийти|приход|посет|come|visit/;
const RE_PRETTY = /chiroyli|zo'r|ajoyib|qiziq|yaxshi|красив|крут|интерес|хорош|pretty|beautiful|cool|nice|good/;
const goalsOf = (why) => ({ tell: has(why, RE_TELL), join: has(why, RE_JOIN), call: has(why, RE_CALL), order: has(why, RE_ORDER), come: has(why, RE_COME) });
const anyGoal = (why) => { const g = goalsOf(why); return g.tell || g.join || g.call || g.order || g.come; };
// Тема — цвета сайта (как подбирает их ИИ), значок для логотипа.
const TOPICS = [
  { re: /futbol|football|soccer|футбол/, c: '#16A34A', c2: '#15803D', bg: '#DCFCE7', em: '⚽' },
  { re: /shaxmat|chess|шахмат/, c: '#334155', c2: '#0F172A', bg: '#E2E8F0', em: '♟️' },
  { re: /pitsa|pizza|пицц/, c: '#DC2626', c2: '#B91C1C', bg: '#FEE2E2', em: '🍕' },
  { re: /robot|робот/, c: '#0D9488', c2: '#0F766E', bg: '#CCFBF1', em: '🤖' },
  { re: /kitob|book|книг/, c: '#7C3AED', c2: '#5B21B6', bg: '#EDE9FE', em: '📚' },
  { re: /minecraft|roblox|o'yin|game|игр|server|сервер/, c: '#65A30D', c2: '#3F6212', bg: '#ECFCCB', em: '🎮' },
  { re: /rasm|chiz|draw|art|рису|худож/, c: '#DB2777', c2: '#9D174D', bg: '#FCE7F3', em: '🎨' },
  { re: /kafe|cafe|кафе|ovqat|food|ед/, c: '#EA580C', c2: '#C2410C', bg: '#FFEDD5', em: '☕' }
];
const topicOf = (what) => TOPICS.find((t) => has(what, t.re)) || { c: '#7C3AED', c2: '#4C1D95', bg: '#EDE9FE', em: '✨' };
const capS = (s) => { const t = String(s || '').trim().replace(/[.!]+$/, ''); return t ? t[0].toUpperCase() + t.slice(1) : t; };
// Название сайта — из «Nima?»: «futbol turniri sayti» → «Futbol turniri».
const titleOf = (what) => capS(String(what || '').replace(/\s*(sayti|saytini|saytimiz|sayt|сайт[а-я]*|website|site)\s*/gi, ' ').replace(/\s+/g, ' ').trim()) || capS(what);
// Одна тема без вида («Futbol haqida sayt») — имя темы: «Futbol».
const topicName = (what) => capS(titleOf(what).replace(/\s*haqida.*$/i, '').replace(/^(про|о|об)\s+/i, '').replace(/^(a|an|the)\s+/i, '').replace(/^about\s+/i, '').trim());
const Q3 = (uz, ru, en) => L3(uz, ru, en);
const CARD = (ic, h, p) => ({ ic, h, p });
// Виды продукта: меню, карточки, плашка и подзаголовок, которые ИИ сам придумывает под вид сайта.
const KINDS = [
  { re: /turnir|musobaqa|турнир|соревнов|tournament|contest|championship/, nav: [Q3('Jadval', 'Расписание', 'Schedule'), Q3('Jamoalar', 'Команды', 'Teams'), Q3('Sovrinlar', 'Призы', 'Prizes')],
    cards: [CARD('🗓️', Q3('Jadval', 'Расписание', 'Schedule'), Q3("Barcha o'yinlar kuni va vaqti", 'Дни и время всех игр', 'Dates and times of all games')), CARD('👥', Q3('Jamoalar', 'Команды', 'Teams'), Q3('Ishtirokchi jamoalar', 'Команды-участники', 'Competing teams')), CARD('🏆', Q3('Sovrinlar', 'Призы', 'Prizes'), Q3("G'oliblarga kubok va medallar", 'Кубок и медали победителям', 'A cup and medals for the winners'))],
    badge: Q3('Bahor turniri · 2026', 'Весенний турнир · 2026', 'Spring tournament · 2026'), sub: Q3('Eng kuchli jamoalar bir maydonda!', 'Сильнейшие команды на одном поле!', 'The strongest teams on one field!'), rows: [Q3("Tribuna chiptasi · 30 000 so'm", 'Билет на трибуну · 30 000 сум', 'Stand ticket · 30,000 sum'), Q3("VIP chipta · 80 000 so'm", 'VIP-билет · 80 000 сум', 'VIP ticket · 80,000 sum')] },
  { re: /kafe|pitsa|pizza|restoran|кафе|пицц|ресторан|cafe|restaurant/, nav: [Q3('Menyu', 'Меню', 'Menu'), Q3('Narxlar', 'Цены', 'Prices'), Q3('Yetkazish', 'Доставка', 'Delivery')],
    cards: [CARD('🍕', Q3('Menyu', 'Меню', 'Menu'), Q3('Issiq va mazali taomlar', 'Горячие и вкусные блюда', 'Hot and tasty dishes')), CARD('💸', Q3('Narxlar', 'Цены', 'Prices'), Q3('Hamyonbop narxlar', 'Доступные цены', 'Affordable prices')), CARD('🛵', Q3('Yetkazib berish', 'Доставка', 'Delivery'), Q3('30 daqiqada eshigingizgacha', 'За 30 минут до двери', 'To your door in 30 minutes'))],
    badge: Q3('Bugun ochiqmiz', 'Сегодня открыты', 'Open today'), sub: Q3('Yangi pishgan, issiq va mazali.', 'Свежее, горячее и вкусное.', 'Fresh, hot and tasty.'),
    rows: [Q3("Margarita · 45 000 so'm", 'Маргарита · 45 000 сум', 'Margherita · 45,000 sum'), Q3("Pepperoni · 55 000 so'm", 'Пепперони · 55 000 сум', 'Pepperoni · 55,000 sum')] },
  { re: /to'gara|togara|klub|кружок|кружк|клуб|club/, nav: [Q3("Mashg'ulotlar", 'Занятия', 'Classes'), Q3('Ustoz', 'Наставник', 'Coach'), Q3('Yutuqlar', 'Достижения', 'Wins')],
    cards: [CARD('📚', Q3("Mashg'ulotlar", 'Занятия', 'Classes'), Q3('Haftada ikki marta, darsdan keyin', 'Два раза в неделю после уроков', 'Twice a week after school')), CARD('🧑‍🏫', Q3('Ustoz', 'Наставник', 'Coach'), Q3('Tajribali murabbiy bilan', 'С опытным тренером', 'With an experienced coach')), CARD('🏅', Q3('Yutuqlar', 'Достижения', 'Achievements'), Q3("Bizning g'alabalarimiz", 'Наши победы', 'Our wins'))],
    badge: Q3("Yangi a'zolarni kutamiz", 'Ждём новых ребят', 'New members welcome'), sub: Q3("Qiziqarli mashg'ulotlar va do'stona jamoa.", 'Интересные занятия и дружная команда.', 'Fun sessions and a friendly team.'), rows: [Q3("Oylik abonement · 200 000 so'm", 'Абонемент на месяц · 200 000 сум', 'Monthly pass · 200,000 sum'), Q3("Sinov darsi · bepul", 'Пробное занятие · бесплатно', 'Trial class · free')] },
  { re: /do'kon|dokon|магазин|shop|store/, nav: [Q3('Mahsulotlar', 'Товары', 'Products'), Q3('Narxlar', 'Цены', 'Prices'), Q3('Yetkazish', 'Доставка', 'Delivery')],
    cards: [CARD('🛍️', Q3('Mahsulotlar', 'Товары', 'Products'), Q3('Eng yangi tovarlar', 'Самые новые товары', 'The newest items')), CARD('💸', Q3('Narxlar', 'Цены', 'Prices'), Q3('Qulay narxlar va chegirmalar', 'Удобные цены и скидки', 'Fair prices and discounts')), CARD('🚚', Q3('Yetkazib berish', 'Доставка', 'Delivery'), Q3("Shahar bo'ylab bir kunda", 'По городу за один день', 'Across the city in one day'))],
    badge: Q3('Yangi kolleksiya', 'Новая коллекция', 'New collection'), sub: Q3('Hammasi bir joyda: qulay va tez.', 'Всё в одном месте: удобно и быстро.', 'Everything in one place: quick and easy.'),
    rows: [Q3("Futbol formasi · 150 000 so'm", 'Футбольная форма · 150 000 сум', 'Football kit · 150,000 sum'), Q3("Butsi · 250 000 so'm", 'Бутсы · 250 000 сум', 'Boots · 250,000 sum')] },
  { re: /ko'rgazma|korgazma|festival|bayram|выставк|фестивал|праздник|fair|exhibition|festival|party/, nav: [Q3('Dastur', 'Программа', 'Programme'), Q3('Mehmonlar', 'Гости', 'Guests'), Q3('Manzil', 'Место', 'Venue')],
    cards: [CARD('📋', Q3('Dastur', 'Программа', 'Programme'), Q3("Kun bo'yi qiziqarli tadbirlar", 'Интересные события весь день', 'Fun events all day')), CARD('🎤', Q3('Mehmonlar', 'Гости', 'Guests'), Q3('Mashhur mehmonlar bilan uchrashuv', 'Встреча с известными гостями', 'Meet famous guests')), CARD('📍', Q3('Manzil', 'Место', 'Venue'), Q3('Maktab katta zali', 'Большой зал школы', 'The school main hall'))],
    badge: Q3('Tez kunda', 'Скоро', 'Coming soon'), sub: Q3('Hammani kutamiz!', 'Ждём всех!', 'Everyone is welcome!'),
    rows: [Q3("Kattalar chiptasi · 20 000 so'm", 'Взрослый билет · 20 000 сум', 'Adult ticket · 20,000 sum'), Q3("Bolalar chiptasi · 10 000 so'm", 'Детский билет · 10 000 сум', 'Child ticket · 10,000 sum')] },
  { re: /server|сервер/, nav: [Q3('Rejimlar', 'Режимы', 'Modes'), Q3('Qoidalar', 'Правила', 'Rules'), Q3("O'yinchilar", 'Игроки', 'Players')],
    cards: [CARD('🎮', Q3('Rejimlar', 'Режимы', 'Modes'), Q3('Omon qolish va ijodkorlik', 'Выживание и творчество', 'Survival and creative')), CARD('📜', Q3('Qoidalar', 'Правила', 'Rules'), Q3("Halol o'yin", 'Честная игра', 'Fair play')), CARD('👾', Q3("O'yinchilar", 'Игроки', 'Players'), Q3("Kuniga 100 dan ortiq o'yinchi", 'Больше 100 игроков в день', '100+ players a day'))],
    badge: Q3('Onlayn', 'Онлайн', 'Online'), sub: Q3("Do'stlaringiz bilan birga o'ynang!", 'Играй вместе с друзьями!', 'Play with your friends!'), rows: [Q3("VIP status · 25 000 so'm", 'VIP-статус · 25 000 сум', 'VIP status · 25,000 sum'), Q3("Maxsus skin · 15 000 so'm", 'Особый скин · 15 000 сум', 'Special skin · 15,000 sum')] },
  { re: /kurs|курс|course/, nav: [Q3('Darslar', 'Уроки', 'Lessons'), Q3('Ustoz', 'Преподаватель', 'Teacher'), Q3('Jadval', 'Расписание', 'Schedule')],
    cards: [CARD('🎨', Q3('Darslar', 'Уроки', 'Lessons'), Q3('Oddiydan murakkabgacha', 'От простого к сложному', 'From simple to advanced')), CARD('🧑‍🏫', Q3('Ustoz', 'Преподаватель', 'Teacher'), Q3("Tajribali o'qituvchi", 'Опытный учитель', 'An experienced teacher')), CARD('🗓️', Q3('Jadval', 'Расписание', 'Schedule'), Q3('Haftada ikki marta', 'Два раза в неделю', 'Twice a week'))],
    badge: Q3('Yangi guruh', 'Новая группа', 'New group'), sub: Q3("Noldan boshlab o'rganing.", 'Учись с нуля.', 'Learn from scratch.'), rows: [Q3("Oylik abonement · 200 000 so'm", 'Абонемент на месяц · 200 000 сум', 'Monthly pass · 200,000 sum'), Q3("Sinov darsi · bepul", 'Пробное занятие · бесплатно', 'Trial class · free')] },
  { re: /jamoa|команд|team/, nav: [Q3("O'yinchilar", 'Игроки', 'Players'), Q3("O'yinlar", 'Матчи', 'Matches'), Q3('Yutuqlar', 'Достижения', 'Wins')],
    cards: [CARD('👥', Q3("O'yinchilar", 'Игроки', 'Players'), Q3('Bizning tarkib', 'Наш состав', 'Our squad')), CARD('⚽', Q3("O'yinlar", 'Матчи', 'Matches'), Q3("Yaqin o'yinlar", 'Ближайшие игры', 'Upcoming games')), CARD('🏆', Q3('Yutuqlar', 'Достижения', 'Achievements'), Q3('Kuboklarimiz', 'Наши кубки', 'Our trophies'))],
    badge: Q3('Mavsum 2026', 'Сезон 2026', 'Season 2026'), sub: Q3('Bir jamoa, bir maqsad!', 'Одна команда, одна цель!', 'One team, one goal!'), rows: [Q3("Tribuna chiptasi · 30 000 so'm", 'Билет на трибуну · 30 000 сум', 'Stand ticket · 30,000 sum'), Q3("VIP chipta · 80 000 so'm", 'VIP-билет · 80 000 сум', 'VIP ticket · 80,000 sum')] }
];
const RE_KIND = new RegExp(KINDS.map((k) => k.re.source).join('|') + "|lager|maktab|blog|portfolio|лагер|школ|блог|camp|school|blog");
const kindOf = (what) => KINDS.find((k) => has(what, k.re)) || null;
// Одна тема — ИИ делает «энциклопедию» о теме; ничего не сказано — общий шаблон «о компании».
const WIKI = { nav: [Q3('Tarix', 'История', 'History'), Q3('Qoidalar', 'Правила', 'Rules'), Q3('Faktlar', 'Факты', 'Facts')],
  cards: [CARD('📜', Q3('Tarix', 'История', 'History'), Q3("Hammasi qanday boshlangan", 'С чего всё началось', 'How it all began')), CARD('📖', Q3('Qoidalar', 'Правила', 'Rules'), Q3('Asosiy qoidalar', 'Главные правила', 'The main rules')), CARD('💡', Q3('Qiziqarli faktlar', 'Интересные факты', 'Fun facts'), Q3('Bilasizmi?', 'А ты знал?', 'Did you know?'))],
  title: Q3('{t} olami', '{t}: всё самое интересное', 'The world of {t}'), badge: Q3('Hammasi bir joyda', 'Всё в одном месте', 'All in one place'),
  sub: Q3('Tarix, qoidalar va qiziqarli faktlar.', 'История, правила и интересные факты.', 'History, rules and fun facts.') };
const BLANK = { nav: [Q3('Biz haqimizda', 'О нас', 'About'), Q3('Xizmatlar', 'Услуги', 'Services'), Q3('Aloqa', 'Контакты', 'Contact')],
  cards: [CARD('⭐', Q3('Sifat', 'Качество', 'Quality'), Q3('Biz eng yaxshisini qilamiz', 'Делаем лучше всех', 'We do it best')), CARD('⚡', Q3('Tezlik', 'Скорость', 'Speed'), Q3('Hammasi tez va oson', 'Быстро и просто', 'Fast and simple')), CARD('🤝', Q3('Ishonch', 'Доверие', 'Trust'), Q3('Mijozlar bizni tanlaydi', 'Нас выбирают', 'People choose us'))],
  title: Q3('Sizning loyihangiz', 'Ваш проект', 'Your project'), badge: Q3('Xush kelibsiz', 'Добро пожаловать', 'Welcome'),
  sub: Q3('Biz bilan hammasi oson.', 'С нами всё просто.', 'Everything is easy with us.'),
  rows: [Q3("Asosiy paket · 50 000 so'm", 'Базовый пакет · 50 000 сум', 'Basic plan · 50,000 sum'), Q3("Premium paket · 90 000 so'm", 'Премиум пакет · 90 000 сум', 'Premium plan · 90,000 sum')] };
// Цели: кнопка в баннере, подзаголовок и раздел внизу — их ИИ делает по «Nega?».
const AI_TXT = {
  more: Q3('Batafsil', 'Подробнее', 'Learn more'),
  join: Q3("Ro'yxatdan o'tish", 'Записаться', 'Sign up'),
  call: Q3("Qo'ng'iroq qilish", 'Позвонить', 'Call us'),
  order: Q3('Buyurtma berish', 'Заказать', 'Order now'),
  come: Q3('Qanday borish mumkin', 'Как добраться', 'How to get there'),
  subJoin: Q3("Hoziroq ro'yxatdan o'ting: joylar soni cheklangan!", 'Запишись прямо сейчас: мест немного!', 'Sign up now: places are limited!'),
  subCall: Q3("Savollaringiz bormi? Bizga qo'ng'iroq qiling.", 'Есть вопросы? Позвони нам.', 'Got questions? Give us a call.'),
  subOrder: Q3('Bir necha bosishda buyurtma bering!', 'Закажи в пару нажатий!', 'Order in just a few taps!'),
  subCome: Q3('Sizni kutamiz! Manzil va vaqt quyida.', 'Ждём тебя! Адрес и время ниже.', 'We’re waiting for you! Address and time below.'),
  subTell: Q3('Qachon, qayerda va qanday: hammasi shu yerda.', 'Когда, где и как: всё здесь.', 'When, where and how: it’s all here.'),
  gJoin: Q3("Ro'yxatdan o'tish", 'Запись', 'Sign up'), inName: Q3('Ismingiz', 'Твоё имя', 'Your name'), inClass: Q3('Sinfingiz', 'Твой класс', 'Your class'), send: Q3('Yuborish', 'Отправить', 'Send'),
  gCall: Q3("Biz bilan bog'laning", 'Свяжись с нами', 'Contact us'), phone: Q3('📞 +998 90 123 45 67', '📞 +998 90 123 45 67', '📞 +998 90 123 45 67'), hours: Q3('🕘 Har kuni 9:00–18:00', '🕘 Каждый день 9:00–18:00', '🕘 Every day 9:00–18:00'),
  gOrder: Q3('Buyurtma', 'Заказ', 'Order'), orderBtn: Q3('Buyurtma', 'Заказать', 'Order'),
  gTell: Q3('Qachon va qayerda', 'Когда и где', 'When and where'), date: Q3('📅 15-may, soat 10:00', '📅 15 мая, 10:00', '📅 May 15, 10:00'), place: Q3('📍 Maktab katta zali', '📍 Большой зал школы', '📍 The school main hall'),
  gCome: Q3('Bizga keling', 'Приходи к нам', 'Come visit'), addr: Q3("📍 Toshkent, Navoiy ko'chasi 12", '📍 Ташкент, ул. Навои 12', '📍 Tashkent, 12 Navoi street'), map: Q3("Xaritada ko'rish", 'Открыть карту', 'Open the map'),
  foot: Q3('© 2026 {t}. Barcha huquqlar himoyalangan.', '© 2026 {t}. Все права защищены.', '© 2026 {t}. All rights reserved.'),
  noName: Q3('Sizning loyihangiz', 'Ваш проект', 'Your project')
};
// Промпт → современный сайт (как у настоящего ИИ): меню, баннер с градиентом, карточки, раздел цели, подвал.
// Что именно на сайте — решает промпт: «Nima?» — название, меню и карточки; «Nega?» — кнопка баннера, подзаголовок
// и раздел внизу. Без «Nega?» ИИ ставит общую кнопку «Batafsil», которая никуда не ведёт.
function aiSite(pick, pr) {
  const what = pr ? String(pr.what || '').trim() : '';
  const why = pr ? String(pr.why || '').trim() : '';
  const kind = kindOf(what);
  const tname = what && !kind ? topicName(what) : '';
  const base = kind || (what ? WIKI : BLANK);
  const title = kind ? titleOf(what) : what ? pick(fillL(WIKI.title, { t: tname })) : pick(BLANK.title);
  const tp = topicOf(what + ' ' + why);
  const g = why ? goalsOf(why) : {};
  const btn = g.join ? 'join' : g.order ? 'order' : g.call ? 'call' : g.come ? 'come' : g.tell ? 'tell' : null;
  const sub = btn ? pick(AI_TXT[{ join: 'subJoin', order: 'subOrder', call: 'subCall', come: 'subCome', tell: 'subTell' }[btn]]) : pick(base.sub);
  const ctaText = btn && btn !== 'tell' ? pick(AI_TXT[btn]) : pick(AI_TXT.more);
  const short = title.split(/\s+/).slice(0, 2).join(' ');
  const els = [
    { t: 'div', cls: 'nav', k: 'nav', kids: [{ t: 'span', cls: 'logo', k: 'logo', text: tp.em + ' ' + short },
      { t: 'div', cls: 'links', k: 'links', kids: base.nav.map((x, i) => ({ t: 'span', k: 'l' + i, text: pick(x) })) },
      { t: 'span', cls: 'navbtn', k: 'navbtn', text: ctaText }] },
    { t: 'div', cls: 'hero', k: 'hero', kids: [{ t: 'span', cls: 'badge', k: 'badge', text: pick(base.badge) },
      { t: 'h1', cls: 'title', k: 'h1', text: title }, { t: 'p', cls: 'sub', k: 'sub', text: sub },
      { t: 'button', cls: 'cta', k: 'cta', text: ctaText }] },
    { t: 'div', cls: 'cards', k: 'cards', kids: base.cards.map((c, i) => ({ t: 'div', cls: 'card', k: 'card' + i,
      kids: [{ t: 'div', cls: 'ic', k: 'ic' + i, text: c.ic }, { t: 'h3', cls: 'ch', k: 'ch' + i, text: pick(c.h) }, { t: 'p', cls: 'cp', k: 'cp' + i, text: pick(c.p) }] })) }
  ];
  // Разделы цели: основной и ещё один (например, «рассказать» и «прийти»).
  const goalsList = ['join', 'order', 'call', 'come', 'tell'].filter((x) => g[x]).slice(0, 2);
  goalsList.forEach((x, gi) => {
    const kids = [];
    if (x === 'join') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gJoin) }, { t: 'div', cls: 'inp', text: pick(AI_TXT.inName) }, { t: 'div', cls: 'inp', text: pick(AI_TXT.inClass) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.send) });
    if (x === 'order') { kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gOrder) }); (base.rows || BLANK.rows).forEach((r, ri) => kids.push({ t: 'div', cls: 'row', k: 'row' + ri, kids: [{ t: 'span', text: pick(r) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.orderBtn) }] })); }
    if (x === 'call') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gCall) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.phone) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.hours) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.call) });
    if (x === 'tell') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gTell) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.date) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.place) });
    if (x === 'come') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gCome) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.addr) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.map) });
    els.push({ t: 'div', cls: 'goal', k: 'goal' + gi, kids });
  });
  els.push({ t: 'div', cls: 'foot', k: 'foot', text: pick(fillL(AI_TXT.foot, { t: title })) });
  const C1 = tp.c, C2 = tp.c2;
  const css = [
    'body { background-color: #F8FAFC; font-family: Inter, system-ui, sans-serif; color: #0F172A; }',
    '.nav { display: flex; justify-content: space-between; align-items: center; padding: 14px 32px; background-color: white; box-shadow: 0 1px 0 #E2E8F0; }',
    '.logo { font-weight: 800; font-size: 18px; color: ' + C2 + '; }',
    '.links { display: flex; gap: 22px; font-size: 14px; color: #475569; }',
    '.navbtn { background-color: ' + C1 + '; color: white; padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; }',
    '.hero { padding: 54px 32px; background-image: linear-gradient(135deg, ' + C1 + ', ' + C2 + '); color: white; text-align: center; }',
    '.badge { display: inline-block; padding: 5px 14px; border-radius: 999px; background-color: rgba(255, 255, 255, 0.2); font-size: 13px; font-weight: 600; }',
    '.title { margin: 14px 0 10px; font-size: 44px; font-weight: 800; line-height: 1.1; }',
    '.sub { margin: 0 0 24px; font-size: 18px; opacity: 0.92; }',
    '.cta { background-color: white; color: ' + C2 + '; padding: 14px 28px; border: none; border-radius: 12px; font-size: 17px; font-weight: 800; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18); }',
    '.cards { display: flex; gap: 16px; padding: 28px 32px 8px; }',
    '.card { flex: 1; background-color: white; border-radius: 16px; padding: 18px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }',
    '.ic { font-size: 28px; }',
    '.ch { margin: 8px 0 4px; font-size: 18px; font-weight: 700; }',
    '.cp { margin: 0; font-size: 14px; color: #64748B; }',
    '.goal { margin: 20px 32px 8px; padding: 22px; border-radius: 18px; background-color: ' + tp.bg + '; }',
    '.gh { margin: 0 0 12px; font-size: 22px; font-weight: 800; color: ' + C2 + '; }',
    '.gp { margin: 0 0 8px; font-size: 16px; }',
    '.inp { background-color: white; border: 1px solid #CBD5E1; border-radius: 10px; padding: 11px 14px; color: #94A3B8; margin: 0 0 10px; font-size: 15px; }',
    '.btn2 { background-color: ' + C1 + '; color: white; padding: 12px 22px; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; }',
    '.row { display: flex; justify-content: space-between; align-items: center; background-color: white; padding: 10px 14px; border-radius: 12px; margin: 0 0 8px; font-size: 15px; }',
    '.foot { padding: 24px 32px; color: #64748B; font-size: 13px; text-align: center; }',
    '@media (max-width: 600px) { .links { display: none; } .nav { padding: 12px 18px; } .hero { padding: 38px 20px; } .title { font-size: 32px; } .cards { flex-direction: column; padding: 20px; } .goal { margin: 16px 20px 8px; } }'
  ];
  return { title, els, css, goals: g, btn, kind: !!kind, what: !!what };
}
// Промпт одной строкой — для домашки (скопировать в настоящий ИИ).
const promptLine = (pick, pr) => pick(fillL(L3('{a}. Uning maqsadi: {b}.', '{a}. Его цель: {b}.', '{a}. Its goal: {b}.'), { a: capS(pr.what), b: String(pr.why || '').trim().replace(/[.!]+$/, '') }));

// ── ФОРМУЛА МОДУЛЯ: семь вопросов промпта (урок 1 — первые два) ──
const FORMULA = [
  L3('Nima?', 'Что?', 'What?'), L3('Nega?', 'Зачем?', 'Why?'), L3('Kim uchun?', 'Для кого?', 'For whom?'),
  L3('Ichida nima?', 'Что внутри?', 'What’s inside?'), L3("Ko'rinishi?", 'Как выглядит?', 'How it looks?'),
  L3('Qanday ishlaydi?', 'Как ведёт себя?', 'How it behaves?'), L3('Qoidalar?', 'Какие правила?', 'What rules?')
];
const LESSON_OF = L3('{n}-dars', 'урок {n}', 'lesson {n}');

// ── ОКНО ПРОМПТА (вариант «поле ИИ-приложения», заказчик 11.11.2026: «давай В») ──
// Светлое скруглённое поле, как в настоящих ИИ-приложениях: строки промпта — обычный текст, у каждой метка вопроса
// формулы и подсветка его цветом («Nima?» — оранжевый, «Nega?» — фиолетовый, такие же метки на сайте); внизу —
// следующие вопросы курса (later) и кнопка «Yuborish» (send).
// row: { body, q (вопрос из FORMULA), on (метка горит), cls }.
// Смена промпта — печатью (заказчик, 11.11.2026: «промпт поменялся, а я даже не заметил» → «типо как печатание и
// удаление»): старый текст строки стирается по букве, новый печатается, с мигающим курсором; поле горит рамкой.
// Пока строка печатается, она в жёлтой рамке. Под «меньше движения» — сразу новый текст.
const MISS = '\u2205';
const TYPE_DEL = 18, TYPE_ADD = 38;
// Общее начало строк не стирается (как правит человек): «Futbol haqida sayt» → «Futbol turniri sayti» стирает только хвост.
const typeCut = (a, b) => { let k = 0; while (k < a.length && k < b.length && a[k] === b[k]) k += 1; return k; };
const typeMs = (from, to) => {
  if (reduceMotion()) return 0;
  const a = from === MISS ? '' : String(from || ''), b = to === MISS ? '' : String(to || ''), k = typeCut(a, b);
  return (a.length - k) * TYPE_DEL + 180 + (b.length - k) * TYPE_ADD + 120;
};
function TypeSwap({ from, to, done, children }) {
  const old = from === MISS ? '' : String(from || '');
  const nw = to === MISS ? '' : String(to || '');
  const [st, setSt] = useState(() => (reduceMotion() ? { s: nw, end: true } : { s: old, del: true }));
  useEffect(() => {
    if (st.end) { done(); return undefined; }
    let t;
    if (st.del) {
      t = st.s.length > typeCut(old, nw) ? setTimeout(() => setSt({ s: st.s.slice(0, -1), del: true }), TYPE_DEL) : setTimeout(() => setSt({ s: st.s, del: false }), 180);
    } else {
      t = st.s.length < nw.length ? setTimeout(() => setSt({ s: nw.slice(0, st.s.length + 1) }), TYPE_ADD) : setTimeout(() => setSt({ s: nw, end: true }), 120);
    }
    return () => clearTimeout(t);
  }, [st]); // eslint-disable-line react-hooks/exhaustive-deps
  if (st.end) return children;
  return <span className="a1-val a1-typev">{st.s}<i className="a1-caret" aria-hidden="true" /></span>;
}
function PromptEditor({ rows, later, send }) {
  const pick = usePick();
  const prev = useRef(null);
  const anim = useRef({});          // строка i → { from, to, n }: идёт печать
  const flash = useRef(0);
  const [, tick] = useState(0);
  const now = rows.map((r) => (r.t != null ? String(r.t) : null));
  const was = prev.current;
  let any = false;
  now.forEach((k, i) => {
    if (was && k != null && was[i] != null && was[i] !== k && !(anim.current[i] && anim.current[i].to === k)) {
      const from = anim.current[i] ? anim.current[i].to : was[i];
      anim.current[i] = { from, to: k, n: (anim.current[i] ? anim.current[i].n : 0) + 1 }; any = true;
    }
  });
  if (any) flash.current += 1;
  useEffect(() => { prev.current = now; });
  const fin = (i, k) => () => { if (anim.current[i] && anim.current[i].to === k) { delete anim.current[i]; tick((x) => x + 1); } };
  return (
    <div className="a1-ed" translate="no">
      {flash.current ? <i key={flash.current} className="a1-ed-flash" aria-hidden="true" /> : null}
      <div className="a1-lines">
        {rows.map((r, i) => {
          const qi = r.q ? FORMULA.indexOf(r.q) : -1;
          const a = anim.current[i] && anim.current[i].to === now[i] ? anim.current[i] : null;
          return (
            <div key={i} className={'a1-line' + (qi >= 0 ? ' is-q' + qi : '') + (r.cls ? ' ' + r.cls : '') + (a ? ' a1-chg' : '')}>
              {r.q ? <span className={'a1-q' + (r.on ? ' is-on' : '')}>{pick(r.q)}</span> : null}
              <span className="a1-txt">{a ? <TypeSwap key={a.n + ':' + a.to} from={a.from} to={a.to} done={fin(i, a.to)}>{r.body}</TypeSwap> : r.body}</span>
            </div>
          );
        })}
      </div>
      {later || send ? (
        <div className="a1-bar">
          {later ? <span className="a1-next">{FORMULA.slice(2).map((q, i) => <span key={i} className="a1-chip" title={pick(fillL(LESSON_OF, { n: i + 2 }))}>{pick(q)}</span>)}</span> : <span />}
          {send || null}
        </div>
      ) : null}
    </div>
  );
}
// Готовые строки промпта: текст ученика или пример.
const txtRow = (text, qi, extra) => Object.assign({ t: text, q: qi == null ? null : FORMULA[qi], on: qi != null, cls: 'is-task', body: <span className="a1-val">{text}</span> }, extra || {});

// ── ОТКУДА ЧТО: метки вопросов формулы у частей сайта ──
function Pins({ pins }) {
  const pick = usePick();
  const ref = useRef(null);
  const [pos, setPos] = useState([]);
  const key = JSON.stringify(pins.map((p0) => [p0.sel, p0.q && p0.q.ru]));
  useLayoutEffect(() => {
    const host = ref.current && ref.current.closest('.kz-br-page');
    if (!host) return undefined;
    const put = () => {
      const o = host.getBoundingClientRect();
      setPos(pins.map((p0) => {
        const e = host.querySelector('.c17-doc ' + p0.sel);
        if (!e) return null;
        let r = e.getBoundingClientRect();
        try { const g = document.createRange(); g.selectNodeContents(e); const t = g.getBoundingClientRect(); if (t.width) r = t; } catch (x) { /* по рамке */ }
        // Справа от текста нет места (длинное название на телефоне) — метка встаёт над элементом, у правого края.
        const W = host.clientWidth, x0 = Math.round(r.right - o.left + host.scrollLeft + 14);
        if (x0 + 74 > W) return { x: Math.max(4, W - 78), y: Math.round(r.top - o.top + host.scrollTop - 4), q: p0.q, cls: (p0.cls || '') + ' is-above' };
        return { x: x0, y: Math.round(r.top + r.height / 2 - o.top + host.scrollTop), q: p0.q, cls: p0.cls };
      }).filter(Boolean));
    };
    put();
    const t = setTimeout(put, 450);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(put) : null;
    if (ro) ro.observe(host);
    return () => { clearTimeout(t); if (ro) ro.disconnect(); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className="a1-pins" aria-hidden="true">{pos.map((p0, i) => <i key={key + i} className={'a1-pin a1-in' + (p0.cls ? ' ' + p0.cls : '')} style={{ left: p0.x + 'px', top: p0.y + 'px', animationDelay: (0.25 + i * 0.3) + 's' }}>{pick(p0.q)}</i>)}</span>;
}
// Что дала каждая строка: «Nima?» — название и карточки, «Nega?» — кнопка баннера и раздел внизу.
const pinsOf = (site, withWhat) => [].concat(withWhat !== false && site.what ? [{ sel: '.title', q: FORMULA[0] }] : [],
  withWhat !== false && site.kind ? [{ sel: '.ch', q: FORMULA[0] }] : [], site.btn ? [{ sel: '.cta', q: FORMULA[1], cls: 'is-why' }, { sel: '.gh', q: FORMULA[1], cls: 'is-why' }] : []);
const noHl = (els) => els.map((e) => Object.assign({}, e, { hl: false }, e.kids ? { kids: e.kids.map((k) => (typeof k === 'string' ? k : Object.assign({}, k, { hl: false }))) } : {}));
// Телефон: окно маленькое — прокрутка к разделу, который дала цель (форма записи, заказ…), иначе его не видно.
const goalHl = (els) => { let done = false; return els.map((e) => (!done && e.cls === 'goal' ? (done = true, Object.assign({}, e, { hl: true })) : e)); };
// Узкий экран урока (телефон) — сайт в мобильной версии, иначе — как на компьютере (800 px, окно уменьшает его).
function useNarrow() {
  const get = () => (typeof window !== 'undefined' && window.innerWidth < 760);
  const [n, setN] = useState(get());
  useEffect(() => { const on = () => setN(get()); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  return n;
}

// ── ОКНО САЙТА: Chrome с сайтом из промпта; busy — ИИ «пишет» сайт ──
// Окно — по высоте сайта (заказчик, 11.11.2026: «снизу пустое пространство… браузер нужно уменьшить»): высота
// тела окна = высота страницы (--a1-fit), окно не тянется на всю колонку; если места меньше — сжимается, сайт листается.
function useFitBrowser(ref) {
  useLayoutEffect(() => {
    const me = ref.current;
    const br = me && me.closest('.kz-br');
    const page = br && br.querySelector('.kz-br-page');
    const body = br && br.querySelector('.kz-br-body');
    const wrap = page && page.querySelector('.c17-vwrap');
    if (!br || !page || !body || !wrap) return undefined;
    // Через кадр и только при заметной разнице — иначе ResizeObserver зацикливается (окно → страница → окно).
    let raf = 0;
    const put = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pad = Math.max(0, body.clientHeight - page.clientHeight);
        const h = Math.ceil(wrap.offsetHeight + pad);
        const was = parseFloat(br.style.getPropertyValue('--a1-fit')) || 0;
        if (h > 40 && Math.abs(h - was) > 2) br.style.setProperty('--a1-fit', h + 'px');
        if (h > 40) br.classList.add('is-fit');
      });
    };
    put();
    if (typeof ResizeObserver === 'undefined') return () => cancelAnimationFrame(raf);
    const ro = new ResizeObserver(put);
    ro.observe(wrap);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  });
}
function AiBrowser({ site, pins, busy, small }) {
  const pick = usePick();
  const narrow = useNarrow();
  const fitRef = useRef(null);
  useFitBrowser(fitRef);
  return (
    <Br title={site.title} url={site.url || 'index.html'} short={!!small} cls={'a1-site' + (busy ? ' a1-busy' : '')}>
      <span ref={fitRef} hidden />
      <CssPage els={small ? noHl(site.els) : narrow && site.btn ? goalHl(site.els) : site.els} rules={withBase(site.css, 'none')} vw={narrow ? 390 : 800} />
      {pins && !busy ? <Pins pins={pins} /> : null}
      {busy ? <div className="a1-gen" aria-live="polite"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></div> : null}
    </Br>
  );
}
// Поле ввода прямо в строке промпта.
function PromptSlot({ value, onChange, onEnter, ph, max, led }) {
  return (
    <span className={'a1-slot' + (led ? ' is-led' : '')}>
      <LessonInput value={value} onChange={onChange} onEnter={onEnter} placeholder={ph} label={ph} max={max || 90} />
    </span>
  );
}
// ИИ «пишет» сайт ~1 с (под «меньше движения» — сразу).
const AI_MS = () => (reduceMotion() ? 200 : 1200);
