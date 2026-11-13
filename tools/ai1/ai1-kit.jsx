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
  // Урок 2: темы новых заказов.
  { re: /suzish|suzuv|swim|плав|бассейн/, c: '#0284C7', c2: '#075985', bg: '#E0F2FE', em: '🏊' },
  { re: /raqs|dance|танц/, c: '#C026D3', c2: '#86198F', bg: '#FAE8FF', em: '💃' },
  { re: /lager|лагер|camp/, c: '#059669', c2: '#065F46', bg: '#D1FAE5', em: '⛺' },
  { re: /hayvon|animal|живот|зоопарк|zoo/, c: '#D97706', c2: '#92400E', bg: '#FEF3C7', em: '🐾' },
  { re: /futbol|football|soccer|футбол/, c: '#16A34A', c2: '#15803D', bg: '#DCFCE7', em: '⚽' },
  { re: /shaxmat|chess|шахмат/, c: '#334155', c2: '#0F172A', bg: '#E2E8F0', em: '♟️' },
  { re: /pitsa|pizza|пицц/, c: '#DC2626', c2: '#B91C1C', bg: '#FEE2E2', em: '🍕' },
  { re: /robot|робот/, c: '#0D9488', c2: '#0F766E', bg: '#CCFBF1', em: '🤖' },
  { re: /kitob|book|книг/, c: '#7C3AED', c2: '#5B21B6', bg: '#EDE9FE', em: '📚' },
  { re: /minecraft|roblox|o'yin|game|игр|server|сервер/, c: '#65A30D', c2: '#3F6212', bg: '#ECFCCB', em: '🎮' },
  { re: /rasm|chiz|draw|art|рису|рисов|худож/, c: '#DB2777', c2: '#9D174D', bg: '#FCE7F3', em: '🎨' },
  { re: /kafe|cafe|кафе|ovqat|oshxona|food|столов|canteen|ед/, c: '#EA580C', c2: '#C2410C', bg: '#FFEDD5', em: '☕' }
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
  { re: /kafe|pitsa|pizza|restoran|oshxona|кафе|пицц|ресторан|столов|cafe|restaurant|canteen/, nav: [Q3('Menyu', 'Меню', 'Menu'), Q3('Narxlar', 'Цены', 'Prices'), Q3('Yetkazish', 'Доставка', 'Delivery')],
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
  { re: /lager|лагер|camp/, nav: [Q3('Dastur', 'Программа', 'Programme'), Q3('Sharoit', 'Условия', 'Facilities'), Q3('Narx', 'Цены', 'Prices')],
    cards: [CARD('⛺', Q3('Dastur', 'Программа', 'Programme'), Q3('Sport, suzish va gulxan', 'Спорт, плавание и костёр', 'Sports, swimming and campfires')), CARD('🍲', Q3('Ovqat', 'Питание', 'Meals'), Q3("Kuniga to'rt mahal mazali ovqat", 'Вкусная еда четыре раза в день', 'Tasty meals four times a day')), CARD('🌳', Q3('Tabiat', 'Природа', 'Nature'), Q3("Tog' etagida, toza havoda", 'У подножия гор, на свежем воздухе', 'At the foot of the mountains, in fresh air'))],
    badge: Q3('Yozgi mavsum · 2026', 'Летний сезон · 2026', 'Summer season · 2026'), sub: Q3('Unutilmas yoz shu yerda boshlanadi!', 'Незабываемое лето начинается здесь!', 'An unforgettable summer starts here!'), rows: [Q3("Bir smena · 2 500 000 so'm", 'Одна смена · 2 500 000 сум', 'One session · 2,500,000 sum'), Q3("Ikki smena · 4 500 000 so'm", 'Две смены · 4 500 000 сум', 'Two sessions · 4,500,000 sum')] },
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
// ── «KIM UCHUN?» (урок 2 модуля, 11.11.2026): кто будет смотреть сайт. ИИ меняет облик (шрифт, цвета, размеры),
// подзаголовок и плашку, добавляет карточки того, что аудитория любит, и разделы для родителей или пожилых.
const RE_PARENTS = /ota-ona|ota ona|otaona|onalar|родител|мам|пап|parent|mum|mom|dad/;
const RE_OLD = /keksa|qariya|buvi|bobo|nafaqa|пожил|бабуш|дедуш|пенсион|elderly|grandp|grandm|senior/;
const RE_TEACH = /o'qituvchi|muallim|учител|педагог|teacher/;
const RE_ADULT = /kattalar|katta yosh|взросл|adult|grown/;
const RE_TEEN = /o'smir|o'quvchi|talaba|подрост|школьник|ученик|студент|teen|pupil|student/;
const RE_KID = /bola|kichkintoy|go'dak|дет|ребят|ребён|малыш|kid|child|little/;
const RE_ALL = /hamma|barcha|har kim|har bir|odamlar|все|всех|люд|everyone|anyone|everybody|people|(^|\s)all(\s|$)/;
const RE_AND = /\sva\s|\sи\s|\sand\s|,|\+/;
// Возраст: «7–8 yosh», «12 лет», «1–3-sinf» (класс → возраст + 6).
const ageOf = (t) => {
  let m = t.match(/(\d{1,2})\s*[–—-]\s*(\d{1,2})(\s*-?\s*(sinf|класс|grade))?/);
  if (m) return m[3] ? { a: +m[1] + 6, b: +m[2] + 6, i: m.index, grade: m[1] + '–' + m[2] } : { a: +m[1], b: +m[2], i: m.index, txt: m[1] + '–' + m[2] };
  m = t.match(/(\d{1,2})\s*-?\s*(sinf|класс|grade)/);
  if (m) return { a: +m[1] + 6, b: +m[1] + 6, i: m.index, grade: m[1] };
  m = t.match(/(\d{1,2})\s*(yosh|лет|год|year)/);
  if (m) return { a: +m[1], b: +m[1], i: m.index, txt: m[1] };
  return null;
};
// Что аудитория любит — ИИ ставит это первыми карточками.
const LIKES = [
  { k: 'game', re: /o'yin|game|игр/, ic: '🎮', h: Q3("O'yinlar", 'Игры', 'Games'), p: Q3("Har safar yangi o'yin", 'Каждый раз новая игра', 'A new game every time') },
  { k: 'gift', re: /sovg'a|sovrin|prize|gift|подар|приз/, ic: '🎁', h: Q3("Sovg'alar", 'Подарки', 'Prizes'), p: Q3("Har bir ishtirokchiga sovg'a", 'Подарок каждому участнику', 'A gift for every player') },
  { k: 'comic', re: /komiks|comic|комикс/, ic: '💥', h: Q3('Komikslar', 'Комиксы', 'Comics'), p: Q3("Eng zo'r komikslar burchagi", 'Уголок лучших комиксов', 'A corner of the best comics') },
  { k: 'adv', re: /sarguzasht|adventure|приключ/, ic: '🗺️', h: Q3('Sarguzashtlar', 'Приключения', 'Adventures'), p: Q3('Sirli sarguzasht kitoblari', 'Загадочные книги приключений', 'Mysterious adventure books') },
  { k: 'music', re: /musiqa|qo'shiq|music|song|музык|песн/, ic: '🎵', h: Q3('Musiqa', 'Музыка', 'Music'), p: Q3("Quvnoq qo'shiqlar va raqslar", 'Весёлые песни и танцы', 'Fun songs and dances') },
  { k: 'animal', re: /hayvon|animal|живот|звер/, ic: '🐾', h: Q3('Hayvonlar', 'Животные', 'Animals'), p: Q3('Hayvonlar bilan yaqindan tanishuv', 'Знакомство с животными поближе', 'Meet the animals up close') },
  { k: 'build', re: /qurish|qurilish|quradi|build|стро/, ic: '🧱', h: Q3('Qurilish', 'Стройка', 'Building'), p: Q3('Katta qurilish tanlovlari', 'Большие конкурсы построек', 'Big building contests') },
  { k: 'cheap', re: /arzon|chegirma|cheap|discount|дешев|скидк/, ic: '💸', h: Q3('Chegirmalar', 'Скидки', 'Discounts'), p: Q3('Arzon narxlar va chegirmalar', 'Низкие цены и скидки', 'Low prices and discounts') },
  { k: 'sport', re: /sport|спорт/, ic: '🏃', h: Q3('Sport', 'Спорт', 'Sports'), p: Q3("Har kuni harakatli o'yinlar", 'Каждый день подвижные игры', 'Active games every day') },
  { k: 'draw', re: /rasm|chizish|drawing|рисов/, ic: '🎨', h: Q3('Rasm', 'Рисование', 'Drawing'), p: Q3('Rang-barang ijod', 'Яркое творчество', 'Colourful creativity') }
];
// Кто смотрит сайт: главный зритель (первый названный) и второй («bolalar va ota-onalar»). «Bolalarning ota-onalari» —
// главный зритель родители. «Hamma uchun» — никто конкретно: ИИ ничего не меняет.
function audOf(who) {
  const t = lowAll(who).trim();
  if (!t) return null;
  const age = ageOf(t);
  const at = (re) => { const m = t.match(re); return m ? m.index : -1; };
  const iKid = at(RE_KID), iTeen = at(RE_TEEN);
  const yi = [iKid, iTeen, age ? age.i : -1].filter((x) => x >= 0);
  const found = [];
  if (yi.length) found.push([Math.min.apply(null, yi), age ? (age.a <= 9 ? 'kids' : age.a <= 17 ? 'teens' : 'adult') : iTeen >= 0 && (iKid < 0 || iTeen < iKid) ? 'teens' : 'kids']);
  [['parents', RE_PARENTS], ['old', RE_OLD], ['teach', RE_TEACH], ['adult', RE_ADULT]].forEach(([k, re]) => { const i = at(re); if (i >= 0 && !found.some((f) => f[1] === k)) found.push([i, k]); });
  found.sort((a, b) => a[0] - b[0]);
  const likes = LIKES.filter((l) => l.re.test(t)).slice(0, 2);
  let key = found.length ? found[0][1] : RE_ALL.test(t) ? 'all' : 'gen';
  let also = found.length > 1 ? found[1][1] : null;
  // «Bolalarning ota-onalari», «родители детей» — без «va / и / and» главный зритель — родители.
  if (also === 'parents' && !RE_AND.test(t)) { key = 'parents'; also = null; }
  if (key === 'parents' && also && !RE_AND.test(t)) also = null;
  return { key, also, age, likes, text: String(who).trim() };
}
const AUD_TXT = {
  sub: {
    kids: Q3("Keling, birga o'ynaymiz va o'rganamiz! 🎈", 'Давай играть и учиться вместе! 🎈', 'Let’s play and learn together! 🎈'),
    teens: Q3("Do'stlaringni chaqir, birga zo'rroq! 🔥", 'Зови друзей — вместе круче! 🔥', 'Bring your friends, it’s better together! 🔥'),
    parents: Q3('Farzandingiz uchun xavfsiz, foydali va qulay.', 'Безопасно, полезно и удобно для вашего ребёнка.', 'Safe, useful and convenient for your child.'),
    old: Q3("Hammasi oddiy va tushunarli. Savol bo'lsa, qo'ng'iroq qiling.", 'Всё просто и понятно. Есть вопросы — позвоните.', 'Simple and clear. Questions? Just give us a call.'),
    teach: Q3('Dars uchun tayyor reja va materiallar.', 'Готовый план и материалы для урока.', 'A ready plan and materials for your class.'),
    adult: Q3('Professional yondashuv va yuqori sifat.', 'Профессиональный подход и высокое качество.', 'A professional approach and top quality.'),
    gen: Q3('{w} uchun maxsus', 'Специально для: {w}', 'Made for {w}')
  },
  badge: {
    kids: Q3('Bolalar uchun', 'Для детей', 'For kids'), teens: Q3("O'smirlar uchun", 'Для подростков', 'For teens'),
    parents: Q3('Ota-onalar uchun', 'Для родителей', 'For parents'), old: Q3('Keksalar uchun', 'Для старшего поколения', 'For seniors'),
    teach: Q3("O'qituvchilar uchun", 'Для учителей', 'For teachers'), adult: Q3('Kattalar uchun', 'Для взрослых', 'For adults'),
    all: Q3('Hamma uchun', 'Для всех', 'For everyone'), age: Q3('{a} yosh uchun', 'Для {a} лет', 'Ages {a}'), grade: Q3('{a}-sinflar uchun', 'Для {a} классов', 'Grades {a}')
  },
  parH: Q3('Ota-onalar uchun', 'Родителям', 'For parents'),
  par: [Q3('🛡️ Tajribali ustozlar va xavfsiz joy', '🛡️ Опытные наставники и безопасное место', '🛡️ Experienced staff and a safe place'),
    Q3('💳 Narxlar ochiq va tushunarli', '💳 Понятные и открытые цены', '💳 Clear and open prices'),
    Q3('🕒 Jadval: darsdan keyin, 15:00–17:00', '🕒 Расписание: после уроков, 15:00–17:00', '🕒 Schedule: after school, 3–5 pm')],
  telH: Q3("Savolingiz bormi?", 'Есть вопросы?', 'Got questions?'),
  tel: Q3("📞 +998 90 123 45 67: qo'ng'iroq qiling, hammasini tushuntiramiz.", '📞 +998 90 123 45 67 — позвоните, всё объясним.', '📞 +998 90 123 45 67: call us and we’ll explain everything.')
};
// Облик под зрителя: шрифт, цвета, размеры (как настоящий ИИ меняет дизайн под аудиторию).
const audCss = (key, C1, C2, bg) => ({
  kids: ['body { background-color: #FFFBEB; font-family: "Comic Sans MS", "Chalkboard SE", "Trebuchet MS", sans-serif; }',
    '.hero { background-image: linear-gradient(135deg, #F59E0B, ' + C1 + ', #EC4899); }', '.title { font-size: 54px; }', '.sub { font-size: 21px; }',
    '.badge { background-color: #FEF08A; color: #713F12; font-size: 15px; }', '.cta { border-radius: 999px; font-size: 21px; padding: 16px 34px; transform: rotate(-2deg); }',
    '.card { border: 3px solid #FDE68A; border-radius: 26px; }', '.ic { font-size: 40px; }', '.navbtn { border-radius: 999px; }', '.btn2 { border-radius: 999px; }',
    '@media (max-width: 600px) { .title { font-size: 38px; } .cta { font-size: 18px; } }'],
  teens: ['body { background-color: #0B1120; color: #E2E8F0; }', '.nav { background-color: #0F172A; box-shadow: 0 1px 0 #1E293B; }', '.logo { color: #E2E8F0; }', '.links { color: #94A3B8; }',
    '.hero { background-image: linear-gradient(135deg, #0F172A, ' + C1 + ', #7C3AED); }', '.title { font-size: 50px; letter-spacing: -1px; text-transform: uppercase; }',
    '.badge { background-color: #22D3EE; color: #083344; }', '.card { background-color: #111827; box-shadow: 0 0 0 1px #1F2937; }', '.cp { color: #94A3B8; }',
    '.goal { background-color: #111827; }', '.par { background-color: #111827; }', '.it { background-color: #111827; box-shadow: 0 0 0 1px #1F2937; }', '.bh { color: #E2E8F0; }', '.pr { color: #F1F5F9; }', '.gh { color: #E2E8F0; }', '.inp { background-color: #0F172A; border: 1px solid #334155; }', '.row { background-color: #0F172A; }',
    '@media (max-width: 600px) { .title { font-size: 34px; } }'],
  parents: ['.hero { background-image: linear-gradient(180deg, #FFFFFF, ' + bg + '); color: #0F172A; }', '.badge { background-color: white; color: ' + C2 + '; box-shadow: inset 0 0 0 1px ' + C1 + '; }',
    '.title { font-family: Georgia, "Times New Roman", serif; color: ' + C2 + '; font-size: 42px; }', '.ch { font-family: Georgia, "Times New Roman", serif; }', '.gh2 { font-family: Georgia, "Times New Roman", serif; }',
    '.sub { color: #475569; }', '.cta { background-color: ' + C1 + '; color: white; }', '.card { box-shadow: 0 0 0 1px #E2E8F0; border-top: 4px solid ' + C1 + '; }'],
  old: ['body { font-size: 20px; }', '.links { display: none; }', '.logo { font-size: 24px; }', '.navbtn { font-size: 18px; padding: 10px 18px; }',
    '.hero { background-image: none; background-color: ' + C2 + '; }', '.title { font-size: 58px; }', '.sub { font-size: 26px; opacity: 1; }', '.badge { font-size: 18px; }',
    '.cta { font-size: 26px; padding: 20px 40px; }', '.ch { font-size: 26px; }', '.cp { font-size: 20px; color: #1E293B; }', '.ic { font-size: 40px; }', '.gp { font-size: 22px; }', '.btn2 { font-size: 22px; padding: 16px 28px; }',
    '@media (max-width: 600px) { .title { font-size: 40px; } .sub { font-size: 21px; } .cta { font-size: 21px; padding: 16px 26px; } }'],
  teach: ['.hero { background-image: none; background-color: ' + C2 + '; text-align: left; padding: 44px 40px; }', '.title { font-size: 40px; }', '.card { box-shadow: 0 0 0 1px #CBD5E1; border-radius: 8px; }', '.cta { border-radius: 6px; }', '.btn2 { border-radius: 6px; }'],
  adult: ['.hero { background-image: linear-gradient(135deg, #111827, #374151); }', '.title { font-weight: 300; letter-spacing: 1px; font-size: 46px; }',
    '.badge { background-color: rgba(255, 255, 255, 0.12); letter-spacing: 2px; text-transform: uppercase; font-size: 11px; }', '.cta { background-color: #D4AF37; color: #111827; border-radius: 4px; }',
    '.card { border-radius: 6px; }', '.navbtn { background-color: #111827; border-radius: 4px; }']
}[key] || []);

// ── «ICHIDA NIMA?» (урок 3 модуля, 12.11.2026): какие блоки на странице и в каком порядке. ИИ ставит блоки ровно в
// том порядке, в каком они написаны (лендинг — одна страница, блоки друг за другом). «3 ta sharh» — число карточек.
// Настоящие данные (цена «150 000 so'm», телефон «+998 …») ИИ берёт из промпта; не написаны — придумывает сам
// (на сайте у них метка «Taxmin»).
const BLOCKS = [
  { k: 'menu', re: /menyu|menu|меню|taom/, h: Q3('Menyu', 'Меню', 'Menu') },
  { k: 'gallery', re: /rasm|surat|foto|фото|галер|gallery|photo|picture|картин/, h: Q3('Rasmlar', 'Фото', 'Photos') },
  { k: 'prices', re: /narx|цен|price|тариф|abonement/, h: Q3('Narxlar', 'Цены', 'Prices') },
  { k: 'reviews', re: /sharh|fikr|отзыв|review|feedback/, h: Q3('Sharhlar', 'Отзывы', 'Reviews') },
  { k: 'schedule', re: /jadval|расписан|schedule|timetable/, h: Q3('Jadval', 'Расписание', 'Schedule') },
  { k: 'team', re: /murabbiy|ustoz|o'qituvchi|тренер|наставник|учител|coach|teacher|staff|jamoamiz/, h: Q3('Ustozlar', 'Наставники', 'Coaches') },
  { k: 'faq', re: /savol|вопрос|faq|question/, h: Q3("Savol-javob", 'Вопросы и ответы', 'FAQ') },
  { k: 'rules', re: /qoida|правил|rule/, h: Q3('Qoidalar', 'Правила', 'Rules') },
  { k: 'contact', re: /aloqa|manzil|kontakt|контакт|адрес|contact|address|xarita|карт|map|telefon|телефон|phone/, h: Q3('Aloqa', 'Контакты', 'Contact') },
  { k: 'about', re: /biz haqimizda|о нас|about us|tarix|истори|history/, h: Q3('Biz haqimizda', 'О нас', 'About us') }
];
const RE_VAGUE_IN = /hamma narsa|hammasi|barcha narsa|kerakli narsa|zo'r bo'lim|chiroyli bo'lim|всё|все нужн|everything|anything|all the|nice sections/;
const RE_PRICE = /(\d[\d\s,.]{1,9}\d)\s*(so'm|som|сум|sum)/;
const RE_PHONE = /\+?\d{3}[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\+?\d[\d\s-]{8,}\d/;
function insOf(inside) {
  const t = lowAll(inside).trim();
  if (!t) return null;
  const found = [];
  BLOCKS.forEach((b) => {
    const m = t.match(b.re);
    if (!m) return;
    const before = t.slice(Math.max(0, m.index - 8), m.index);
    const n = before.match(/(\d{1,2})\s*(ta\s*)?$/);
    found.push({ k: b.k, h: b.h, i: m.index, n: n ? Math.max(1, Math.min(6, +n[1])) : 0 });
  });
  found.sort((a, b) => a.i - b.i);
  const pm = String(inside).match(new RegExp(RE_PRICE.source, 'i'));
  const ph = String(inside).match(RE_PHONE);
  return { blocks: found, vague: !found.length && RE_VAGUE_IN.test(t), price: pm ? pm[1].trim() + ' ' + pm[2] : null, phone: ph ? ph[0].trim() : null, text: String(inside).trim() };
}
const INS_TXT = {
  menu: [Q3("🍕 Margarita · 45 000 so'm", '🍕 Маргарита · 45 000 сум', '🍕 Margherita · 45,000 sum'), Q3("🍔 Burger · 35 000 so'm", '🍔 Бургер · 35 000 сум', '🍔 Burger · 35,000 sum'), Q3("🥤 Sharbat · 10 000 so'm", '🥤 Сок · 10 000 сум', '🥤 Juice · 10,000 sum')],
  // Меню по теме сайта (13.11.2026: пицца в книжном магазине и у сладостей сбивала с толку).
  menus: [
    { re: /shirinlik|tort|novvoy|pishiriq|сладост|торт|пекар|кондитер|выпечк|sweet|cake|bak/, items: [Q3("🎂 Tort · 120 000 so'm", '🎂 Торт · 120 000 сум', '🎂 Cake · 120,000 sum'), Q3("🧁 Keks · 15 000 so'm", '🧁 Кекс · 15 000 сум', '🧁 Cupcake · 15,000 sum'), Q3("🍪 Pechene · 8 000 so'm", '🍪 Печенье · 8 000 сум', '🍪 Cookies · 8,000 sum')] },
    { re: /muzqaymoq|морожен|ice cream/, items: [Q3("🍦 Vanilli · 12 000 so'm", '🍦 Ванильное · 12 000 сум', '🍦 Vanilla · 12,000 sum'), Q3("🍫 Shokoladli · 14 000 so'm", '🍫 Шоколадное · 14 000 сум', '🍫 Chocolate · 14,000 sum'), Q3("🍓 Qulupnayli · 14 000 so'm", '🍓 Клубничное · 14 000 сум', '🍓 Strawberry · 14,000 sum')] },
    { re: /kitob|книг|book/, items: [Q3("📖 Sarguzasht kitobi · 45 000 so'm", '📖 Приключения · 45 000 сум', '📖 Adventure book · 45,000 sum'), Q3("📘 Ensiklopediya · 90 000 so'm", '📘 Энциклопедия · 90 000 сум', '📘 Encyclopedia · 90,000 sum'), Q3("📗 Ertaklar · 30 000 so'm", '📗 Сказки · 30 000 сум', '📗 Fairy tales · 30,000 sum')] },
    { re: /oshxona|milliy|choyxona|столов|национ|чайхан|canteen|national/, items: [Q3("🍚 Osh · 30 000 so'm", '🍚 Плов · 30 000 сум', '🍚 Plov · 30,000 sum'), Q3("🍜 Lag'mon · 28 000 so'm", '🍜 Лагман · 28 000 сум', '🍜 Lagman · 28,000 sum'), Q3("🍵 Choy · 5 000 so'm", '🍵 Чай · 5 000 сум', '🍵 Tea · 5,000 sum')] }
  ],
  plan: [Q3('Asosiy', 'Базовый', 'Basic'), Q3('Standart', 'Стандарт', 'Standard'), Q3('Premium', 'Премиум', 'Premium')],
  planP: ["50 000", "90 000", "150 000"],
  sum: Q3("so'm", 'сум', 'sum'),
  priceH: Q3('Narx', 'Цена', 'Price'),
  rev: [Q3("«Juda zo'r! Yana kelamiz.»", '«Очень круто! Придём ещё.»', '“Really great! We’ll be back.”'), Q3("«Hammasi tez va mazali.»", '«Всё быстро и вкусно.»', '“Everything was quick and tasty.”'),
    Q3("«Bolalarim juda xursand.»", '«Дети очень довольны.»', '“My kids loved it.”'), Q3("«Do'stlarimga ham aytdim.»", '«Рассказал и друзьям.»', '“I told my friends too.”')],
  days: [Q3('Dushanba · 16:00', 'Понедельник · 16:00', 'Monday · 4 pm'), Q3('Chorshanba · 16:00', 'Среда · 16:00', 'Wednesday · 4 pm'), Q3('Juma · 16:00', 'Пятница · 16:00', 'Friday · 4 pm')],
  team: [Q3('🧑‍🏫 Bosh murabbiy', '🧑‍🏫 Главный тренер', '🧑‍🏫 Head coach'), Q3('👩‍🏫 Yordamchi murabbiy', '👩‍🏫 Помощник тренера', '👩‍🏫 Assistant coach'), Q3('🧑‍⚕️ Shifokor', '🧑‍⚕️ Врач', '🧑‍⚕️ Doctor')],
  faq: [Q3("❓ Qancha turadi? Narxlar bo'limida.", '❓ Сколько стоит? Смотри в ценах.', '❓ How much is it? See prices.'), Q3("❓ Qachon ochiq? Har kuni.", '❓ Когда открыто? Каждый день.', '❓ When are you open? Every day.'), Q3("❓ Qanday yozilaman? Formani to'ldiring.", '❓ Как записаться? Заполни форму.', '❓ How do I sign up? Fill in the form.')],
  rules: [Q3("✅ Halol o'yin", '✅ Честная игра', '✅ Fair play'), Q3("✅ Bir-birini hurmat qilish", '✅ Уважать друг друга', '✅ Respect each other'), Q3("✅ Spam yo'q", '✅ Без спама', '✅ No spam')],
  phone: '+998 90 123 45 67',
  addr: Q3("📍 Toshkent, Navoiy ko'chasi 12", '📍 Ташкент, ул. Навои 12', '📍 Tashkent, 12 Navoi street'),
  hours: Q3('🕘 Har kuni 9:00–20:00', '🕘 Каждый день 9:00–20:00', '🕘 Every day 9:00–20:00'),
  about: Q3("Biz 2015-yildan beri ishlaymiz va har bir mehmonni xursand qilishga harakat qilamiz.", 'Мы работаем с 2015 года и стараемся порадовать каждого гостя.', 'We’ve been working since 2015 and try to make every visitor happy.')
};
// Блок страницы из «Ichida nima?»: заголовок (bh0, bh1 … — для меток) и содержимое.
function blockEl(pick, b, i, ins, tp, topic) {
  const kids = [];
  const it = (x, k, cls) => ({ t: 'div', cls: cls || 'it', k, text: x });
  const n = (d) => b.n || d;
  if (b.k === 'menu') { const mm = INS_TXT.menus.find((m) => has(topic || '', m.re)); (mm ? mm.items : INS_TXT.menu).slice(0, Math.min(3, n(3))).forEach((x, j) => kids.push(it(pick(x), 'm' + j))); }
  if (b.k === 'gallery') for (let j = 0; j < Math.min(6, n(3)); j += 1) kids.push(it(tp.em, 'g' + j, 'ph'));
  if (b.k === 'prices') {
    if (ins.price) kids.push({ t: 'div', cls: 'it', k: 'p0', kids: [{ t: 'p', cls: 'cp', k: 'p0a', text: pick(INS_TXT.priceH) }, { t: 'p', cls: 'pr', k: 'p0b', text: '💳 ' + ins.price }] });
    else INS_TXT.plan.slice(0, Math.min(3, n(3))).forEach((x, j) => kids.push({ t: 'div', cls: 'it', k: 'p' + j, kids: [{ t: 'p', cls: 'cp', k: 'pa' + j, text: pick(x) }, { t: 'p', cls: j ? 'pr' : 'pr gsP', k: 'pb' + j, text: INS_TXT.planP[j] + ' ' + pick(INS_TXT.sum) }] }));
  }
  if (b.k === 'reviews') INS_TXT.rev.slice(0, Math.min(4, n(2))).forEach((x, j) => kids.push({ t: 'div', cls: 'it', k: 'r' + j, kids: [{ t: 'p', cls: 'star', k: 'rs' + j, text: '★★★★★' }, { t: 'p', cls: 'cp', k: 'rq' + j, text: pick(x) }] }));
  if (b.k === 'schedule') INS_TXT.days.forEach((x, j) => kids.push(it('🗓️ ' + pick(x), 'd' + j)));
  if (b.k === 'team') INS_TXT.team.slice(0, Math.min(3, n(3))).forEach((x, j) => kids.push(it(pick(x), 't' + j)));
  if (b.k === 'faq') INS_TXT.faq.forEach((x, j) => kids.push(it(pick(x), 'f' + j, 'it wide')));
  if (b.k === 'rules') INS_TXT.rules.forEach((x, j) => kids.push(it(pick(x), 'u' + j)));
  if (b.k === 'contact') kids.push({ t: 'div', cls: 'it wide', k: 'c0', kids: [{ t: 'p', cls: ins.phone ? 'gp' : 'gp gsT', k: 'c0a', text: '📞 ' + (ins.phone || INS_TXT.phone) }, { t: 'p', cls: 'gp', k: 'c0b', text: pick(INS_TXT.addr) }, { t: 'p', cls: 'gp', k: 'c0c', text: pick(INS_TXT.hours) }] });
  if (b.k === 'about') kids.push(it(pick(INS_TXT.about), 'a0', 'it wide'));
  return { t: 'div', cls: 'blk', k: 'blk' + b.k, kids: [{ t: 'h2', cls: 'bh bh' + i, k: 'bh' + b.k, text: pick(b.h) }, { t: 'div', cls: 'row3', k: 'row' + b.k, kids }] };
}

// ── «KO'RINISHI?» (урок 4 модуля, 12.11.2026): как выглядит сайт — настроение (стиль), цвета, форма карточек, тени,
// шрифт. «Chiroyli bo'lsin» ИИ не понимает: он угадывает сам (нежно-розовый, «Taxmin»).
const LOOK_MOODS = [
  { k: 'neon', re: /neon|неон/ },
  { k: 'retro', re: /retro|piksel|pixel|ретро|пиксел/ },
  { k: 'dark', re: /qorong'i|tungi|dark|тёмн|темн|ночн/ },
  { k: 'fun', re: /quvnoq|yorqin|o'yinqaroq|rang-barang|весел|ярк|fun|bright|playful|colou?rful/ },
  { k: 'calm', re: /sokin|tinch|yumshoq|iliq|спокойн|нежн|тепл|уютн|calm|soft|warm|cozy|cosy/ },
  { k: 'minimal', re: /minimal|oddiy|sodda|минимал|прост|clean|simple/ },
  { k: 'serious', re: /jiddiy|rasmiy|строг|серьёзн|серьезн|официал|serious|formal|strict/ },
  { k: 'modern', re: /zamonaviy|современ|modern|stylish/ }
];
const LOOK_COLORS = [
  { k: 'orange', re: /to'q sariq|apelsin|оранж|orange/, c: '#F97316', c2: '#C2410C', bg: '#FFEDD5' },
  { k: 'red', re: /qizil|красн|(^|[^a-z])red([^a-z]|$)/, c: '#DC2626', c2: '#991B1B', bg: '#FEE2E2' },
  { k: 'blue', re: /ko'k|moviy|син|голуб|blue/, c: '#2563EB', c2: '#1E3A8A', bg: '#DBEAFE' },
  { k: 'green', re: /yashil|зел|green/, c: '#16A34A', c2: '#14532D', bg: '#DCFCE7' },
  { k: 'yellow', re: /sariq|желт|жёлт|yellow/, c: '#EAB308', c2: '#854D0E', bg: '#FEF9C3' },
  { k: 'pink', re: /pushti|розов|pink/, c: '#EC4899', c2: '#9D174D', bg: '#FCE7F3' },
  { k: 'purple', re: /binafsha|siyohrang|фиолет|сирен|purple|violet/, c: '#7C3AED', c2: '#4C1D95', bg: '#EDE9FE' },
  { k: 'gold', re: /oltin|золот|gold/, c: '#D4AF37', c2: '#7C5E10', bg: '#FEF9E7' },
  { k: 'brown', re: /jigarrang|корич|brown/, c: '#92400E', c2: '#78350F', bg: '#FEF3C7' },
  { k: 'black', re: /qora|черн|чёрн|black/, c: '#111827', c2: '#030712', bg: '#E5E7EB' },
  { k: 'gray', re: /kulrang|сер(ый|ая|ое|ые|ого|ым)|gr[ae]y/, c: '#6B7280', c2: '#374151', bg: '#F3F4F6' },
  { k: 'white', re: /(^|[^a-z'])oq([^a-z']|$)|бел|white/, c: '#FFFFFF', c2: '#334155', bg: '#FFFFFF' }
];
const RE_LOOK_VAGUE = /chiroyli|zo'r|yaxshi|ajoyib|красив|крут|хорош|классн|beautiful|nice|cool|pretty|awesome|great/;
function lookOf(look) {
  let t = lowAll(look).trim();
  if (!t) return null;
  const at = (re) => { const m = t.match(re); return m ? m.index : -1; };
  const moods = LOOK_MOODS.filter((m) => m.re.test(t)).map((m) => m.k);
  const cols = [];
  LOOK_COLORS.forEach((c) => { const i = at(c.re); if (i >= 0) { cols.push([i, c]); t = t.replace(c.re, ' '.repeat(10)); } });
  cols.sort((a, b) => a[0] - b[0]);
  const t0 = lowAll(look);
  const shape = /yumaloq|aylana|скругл|кругл|rounded|round/.test(t0) ? 'round' : /to'g'ri burchak|o'tkir|остр|прям(ые|ых) угл|square|sharp/.test(t0) ? 'square' : null;
  const shadow = /soyasiz|soya yo'q|без тен|no shadow|without shadow/.test(t0) ? 'none' : /soya|тен|shadow/.test(t0) ? 'big' : null;
  const font = /qo'lyozma|рукописн|handwrit|script/.test(t0) ? 'hand' : /klassik|serif|засечк|классич|classic/.test(t0) ? 'serif' : /kod shrift|monospace|моноширин|kompyuter shrift/.test(t0) ? 'mono' : /katta harf|katta shrift|yirik|крупн|big text|large text|big font|large font/.test(t0) ? 'big' : null;
  const colors = cols.map((x) => x[1]);
  const any = moods.length || colors.length || shape || shadow || font;
  return { moods, colors, shape, shadow, font, vague: !any && RE_LOOK_VAGUE.test(t0), none: !any, text: String(look).trim() };
}
// Цвета из «Ko'rinishi?»: первый (не белый) — главный, второй — для кнопок; белый — светлый фон.
const lookPalette = (lk, tp) => {
  const cs = lk.colors.filter((c) => c.k !== 'white');
  if (!cs.length) return { tp, acc: null, white: lk.colors.some((c) => c.k === 'white') };
  const a = cs[0];
  return { tp: Object.assign({}, tp, { c: a.c, c2: a.c2, bg: a.bg }), acc: cs[1] ? cs[1].c : null, white: lk.colors.some((c) => c.k === 'white') };
};
const lookCss = (lk, C1, C2, bg, acc) => {
  const A = acc || C1;
  const out = [];
  const mood = lk.vague ? 'calm' : lk.moods[0];
  const M = {
    modern: ['.hero { background-image: linear-gradient(135deg, ' + C1 + ', ' + C2 + '); }', '.title { letter-spacing: -1px; }', '.card { border-radius: 18px; box-shadow: 0 10px 26px rgba(15, 23, 42, 0.1); }'],
    minimal: ['body { background-color: white; }', '.hero { background-image: none; background-color: white; color: #0F172A; box-shadow: inset 0 -1px 0 #E5E7EB; }', '.title { color: ' + C2 + '; }', '.sub { color: #475569; }',
      '.badge { background-color: #F1F5F9; color: #334155; }', '.cta { background-color: ' + C1 + '; color: white; border-radius: 8px; box-shadow: none; }', '.card { box-shadow: none; border: 1px solid #E5E7EB; border-radius: 8px; }', '.nav { box-shadow: 0 1px 0 #F1F5F9; }'],
    fun: ['body { background-color: #FFFBEB; font-family: "Comic Sans MS", "Chalkboard SE", "Trebuchet MS", sans-serif; }', '.hero { background-image: linear-gradient(135deg, ' + C1 + ', #F59E0B, #EC4899); }',
      '.cta { border-radius: 999px; transform: rotate(-2deg); }', '.card { border: 3px dashed ' + C1 + '; border-radius: 24px; }', '.ic { font-size: 38px; }'],
    calm: ['body { background-color: ' + bg + '; }', '.hero { background-image: linear-gradient(180deg, ' + bg + ', white); color: ' + C2 + '; }', '.badge { background-color: white; color: ' + C2 + '; }',
      '.cta { background-color: ' + C1 + '; color: white; border-radius: 16px; }', '.card { border-radius: 22px; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06); }', '.title { font-weight: 600; }'],
    dark: ['body { background-color: #0B1120; color: #E2E8F0; }', '.nav { background-color: #0F172A; box-shadow: 0 1px 0 #1E293B; }', '.logo { color: #E2E8F0; }', '.links { color: #94A3B8; }',
      '.hero { background-image: linear-gradient(135deg, #0F172A, ' + C2 + '); }', '.card { background-color: #111827; box-shadow: 0 0 0 1px #1F2937; }', '.cp { color: #94A3B8; }', '.goal { background-color: #111827; }', '.gh { color: #E2E8F0; }', '.it { background-color: #111827; }', '.bh { color: #E2E8F0; }'],
    neon: ['body { background-color: #05060F; color: #E2E8F0; }', '.nav { background-color: #05060F; box-shadow: 0 1px 0 ' + C1 + '; }', '.logo { color: ' + C1 + '; }', '.links { color: #94A3B8; }',
      '.hero { background-image: none; background-color: #05060F; }', '.title { color: ' + C1 + '; text-shadow: 0 0 18px ' + C1 + '; text-transform: uppercase; }', '.badge { background-color: transparent; color: ' + C1 + '; box-shadow: inset 0 0 0 1px ' + C1 + '; }',
      '.cta { background-color: transparent; color: ' + C1 + '; border: 2px solid ' + C1 + '; box-shadow: 0 0 16px ' + C1 + '; }', '.card { background-color: #0B0F1F; box-shadow: 0 0 14px ' + C1 + '66; border: 1px solid ' + C1 + '; }', '.cp { color: #94A3B8; }',
      '.goal { background-color: #0B0F1F; }', '.gh { color: ' + C1 + '; }', '.navbtn { background-color: transparent; color: ' + C1 + '; box-shadow: inset 0 0 0 1px ' + C1 + '; }'],
    serious: ['.hero { background-image: none; background-color: ' + C2 + '; text-align: left; padding: 44px 40px; }', '.title { font-family: Georgia, "Times New Roman", serif; font-weight: 700; }', '.ch { font-family: Georgia, "Times New Roman", serif; }',
      '.cta { border-radius: 4px; }', '.card { border-radius: 4px; box-shadow: 0 0 0 1px #CBD5E1; }', '.badge { border-radius: 4px; }'],
    retro: ['body { font-family: "Courier New", monospace; background-color: #FFFDF5; }', '.hero { background-image: none; background-color: ' + C1 + '; }', '.title { text-transform: uppercase; text-shadow: 4px 4px 0 #111827; }',
      '.cta { border-radius: 0; box-shadow: 5px 5px 0 #111827; }', '.card { border-radius: 0; border: 3px solid #111827; box-shadow: 6px 6px 0 #111827; }', '.badge { border-radius: 0; }']
  };
  if (mood && M[mood]) out.push(...M[mood]);
  if (lk.moods.indexOf('dark') >= 0 && mood !== 'dark' && mood !== 'neon') out.push(...M.dark);
  if (acc) out.push('.navbtn { background-color: ' + A + '; }', '.btn2 { background-color: ' + A + '; }', mood === 'neon' ? '.cta { color: ' + A + '; border: 2px solid ' + A + '; }' : '.cta { background-color: ' + A + '; color: white; }');
  if (lk.shape === 'round') out.push('.card { border-radius: 28px; }', '.cta { border-radius: 999px; }', '.btn2 { border-radius: 999px; }', '.navbtn { border-radius: 999px; }', '.it { border-radius: 24px; }');
  if (lk.shape === 'square') out.push('.card { border-radius: 0; }', '.cta { border-radius: 0; }', '.btn2 { border-radius: 0; }', '.navbtn { border-radius: 0; }', '.badge { border-radius: 0; }', '.it { border-radius: 0; }');
  if (lk.shadow === 'none') out.push('.card { box-shadow: none; border: 1px solid #E2E8F0; }', '.cta { box-shadow: none; }', '.it { box-shadow: none; border: 1px solid #E2E8F0; }');
  if (lk.shadow === 'big') out.push('.card { box-shadow: 0 18px 40px rgba(15, 23, 42, 0.22); }', '.cta { box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3); }', '.it { box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18); }');
  if (lk.font === 'hand') out.push('body { font-family: "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive; }');
  if (lk.font === 'serif') out.push('body { font-family: Georgia, "Times New Roman", serif; }');
  if (lk.font === 'mono') out.push('body { font-family: "Courier New", monospace; }');
  if (lk.font === 'big') out.push('.title { font-size: 56px; }', '.sub { font-size: 21px; }', '.cp { font-size: 16px; }', '.ch { font-size: 21px; }', '@media (max-width: 600px) { .title { font-size: 38px; } }');
  // Блоки из «Ichida nima?» (.it) выглядят как карточки.
  return out.concat(out.filter((r) => r.indexOf('.card {') === 0).map((r) => '.it {' + r.slice(7)));
};

// ── «QANDAY ISHLAYDI?» (урок 5 модуля, 12.11.2026): как сайт ведёт себя — что бывает, когда наводишь мышь, нажимаешь,
// открываешь страницу, смотришь с телефона. Поведение = когда (qachon) + что (nima) + что делает (nima bo'ladi).
// Нет «когда» — ИИ делает просто вид (кнопка всегда большая); есть «когда», нет «что делает» — ИИ угадывает («Taxmin»);
// «jonli, qiziqarli» — ИИ угадывает сам: всё прыгает и крутится, кнопка убегает.
const BEH_TRIG = [
  { k: 'hover', re: /sichqoncha|kursor|ustiga kel|ustiga bor|ustida tur|hover|навед|навод|курсор|мыш|mouse|cursor/ },
  { k: 'click', re: /bosil|bosganda|bossa|bosish|bosgan|bossangiz|chertil|tegil|tekkanda|нажат|нажм|нажим|нажал|клик|тап|косн|click|tap|press/ },
  { k: 'load', re: /ochilganda|ochilishi|ochilsa|saytga kir|sahifaga kir|kirganda|kirishi|yuklan|paydo|при открыт|открыти|загруз|появ|при входе|заход|on load|loads|page opens|site opens|is opened|opening the|when you open|appear|when you enter|on entering/ },
  { k: 'phone', re: /telefon|mobil|smartfon|телефон|смартфон|мобил|phone|mobile/ }
];
const BEH_FX = [
  ['grow', /kattalash|kattaroq|katta bo'l|увелич|больше|крупнее|grow|bigger|larger|scale|zoom|enlarg/],
  ['color', /rang|цвет|colou?r/],
  ['lift', /ko'taril|подним|приподн|всплы|lift|rais|rise|float up/],
  ['shadow', /soya|yorish|nur soch|тен|свеч|подсвет|shadow|glow/],
  ['msg', /xabar|rahmat|yozuv|bildirish|сообщ|спасибо|надпис|уведом|message|thank|notice|popup|alert/],
  ['open', /javob|ochil|раскр|ответ|открыва|разверн|expand|answer|open|unfold/],
  ['fade', /silliq|asta|sekin|yumshoq|birin-ketin|navbat|плавн|постеп|медлен|мягк|по очереди|smooth|fade|gentl|slow|one by one/],
  ['slide', /sirpan|tushib kel|chiqib kel|uchib kel|выезж|выплыв|съезж|прилет|slide|fly in/],
  ['pulse', /lipilla|puls|miltilla|yonib-o'ch|пульс|мига|мерца|pulse|blink|flash|throb/],
  ['burger', /☰|burger|бургер|yig'il|yashir|свер|свора|спрят|в кнопк|collapse|hamburger|into a button|hide/],
  ['bar', /pastda|doim ko'rin|внизу|всегда видн|прилип|bottom|always visible|sticky/],
  ['jump', /sakra|qimirla|silkin|o'ynab tur|прыг|скач|тряс|дрож|jump|bounce|hop|wiggle|shake/],
  ['spin', /aylan|крут|вращ|spin|rotat|twirl/]
];
const BEH_EL = [
  ['faq', /savol|вопрос|question|faq/], ['card', /kartochka|kartochk|karta|blok|bo'lim|карточк|блок|раздел|card|block|section|tile/],
  ['img', /rasm|surat|фото|картин|изображ|image|photo|picture/], ['call', /qo'ng'iroq|звон|позвон|(^|\s)call/],
  ['btn', /tugma|кнопк|button/], ['title', /sarlavha|nomi|заголов|назван|title|heading/], ['menu', /menyu|меню|menu/]
];
const RE_BEH_VAGUE = /jonli|qiziqarli|interaktiv|dinamik|zo'r|chiroyli|ajoyib|yaxshi ishla|qulay|живо|живой|интерес|интерактив|динамич|круто|красив|классн|хорошо работ|удобн|lively|alive|interesting|interactive|dynamic|cool|nice|awesome|(^|\s)fun|convenient|handy/;
const RE_BEH_ALL = /hamma narsa|hammasi|barcha|всё|все элемент|everything|all (the )?elements/;
function behOf(beh) {
  const src = String(beh || '').replace(/[‘’ʻʼ`]/g, "'").trim();
  if (!src) return null;
  // Слова в кавычках — текст сообщения («Rahmat!»): вынимаем до разбора, в них бывают запятые.
  const quotes = [];
  const txt = src.replace(/[«"“„]([^«»"“”„]{1,48})[»"”]/g, (a, q) => { quotes.push(q.trim()); return ' ⟨' + (quotes.length - 1) + '⟩ '; });
  const out = { hover: null, click: null, loads: [], phone: null, pulse: false, still: null, chaos: false, guess: false, vague: false, none: false, n: 0, text: src };
  let last = null;
  // Части: по знакам и по «va / и / and», если у каждой половины своё «когда» («…kelganda rangi o'zgarsin va bosilganda…»).
  const trigOf = (x) => BEH_TRIG.some((t) => t.re.test(x.toLowerCase()));
  const parts = [];
  txt.split(/[,;.!\n]+|\s(?:keyin|а потом|then)\s/i).forEach((c) => {
    let cur = null;
    c.split(/\s(?:va|и|а|and|but)\s/i).forEach((x) => { if (cur != null && trigOf(cur) && trigOf(x)) { parts.push(cur); cur = x; } else cur = cur == null ? x : cur + ' va ' + x; });
    if (cur != null) parts.push(cur);
  });
  const RE_NEG = /hech narsa|hech qaysi|sakrama|aylanma|qimirlama|silkinma|не прыг|не крут|не двига|не тряс|ничего не|don't|do not|nothing|no jump|no spin|without/;
  parts.forEach((raw) => {
    let s = ' ' + raw.toLowerCase() + ' ';
    // «Когда» — первое по месту; «при открытии» слабее остальных («сообщение появляется после нажатия» — это нажатие).
    const trs = BEH_TRIG.map((x) => { const m = s.match(x.re); return m ? { k: x.k, i: m.index + (x.k === 'load' ? 1000 : 0) } : null; }).filter(Boolean).sort((a, b) => a.i - b.i);
    const tr = trs[0];
    // «Paydo bo'lsin» — и когда (сайт открылся), и что делает (появляется); остальные слова «когда» в реакциях не участвуют.
    const appear = /paydo|появ|appear/.test(s);
    BEH_TRIG.forEach((x) => { s = s.replace(new RegExp(x.re.source, 'g'), (m) => ' '.repeat(m.length)); });
    const fx = BEH_FX.filter((f) => f[1].test(s)).map((f) => f[0]);
    const els = BEH_EL.filter((e) => e[1].test(s)).map((e) => e[0]);
    const qm = s.match(/⟨(\d+)⟩/);
    const msg = qm ? quotes[+qm[1]] : null;
    if (msg && fx.indexOf('msg') < 0) fx.push('msg');
    const silly = fx.filter((f) => f === 'jump' || f === 'spin');
    if (silly.length && RE_NEG.test(s)) return;   // «hech narsa sakramasin» — наоборот, спокойно
    if (silly.length && (RE_BEH_ALL.test(s) || !els.length)) { out.chaos = true; return; }
    let t = tr ? tr.k : null;
    const vis = fx.filter((f) => ['grow', 'color', 'lift', 'shadow'].indexOf(f) >= 0);
    if (!t && fx.indexOf('pulse') >= 0) { out.pulse = true; out.n += 1; return; }
    let cg = false;   // «xabar chiqsin» без «когда» — ИИ сам решает, что после нажатия
    if (!t && (fx.indexOf('msg') >= 0 || fx.indexOf('open') >= 0)) { if (last !== 'click') cg = true; t = 'click'; }
    if (!t && last && fx.length) t = last;   // «…kelganda rangi o'zgarsin, kattalashsin» — «когда» из прошлой части
    if (!t) { if (vis.length) out.still = { el: els[0] || 'btn', fx: vis }; return; }
    last = t;
    if (t === 'hover') {
      const el = els.indexOf('faq') >= 0 || els.indexOf('card') >= 0 || els.indexOf('img') >= 0 || (els.indexOf('menu') >= 0 && els.indexOf('btn') < 0) ? 'card' : els.indexOf('title') >= 0 && els.indexOf('btn') < 0 ? 'title' : 'btn';
      const h = out.hover || { els: [], fx: [], guess: false };
      if (h.els.indexOf(el) < 0) h.els.push(el);
      vis.forEach((f) => { if (h.fx.indexOf(f) < 0) h.fx.push(f); });
      if (!vis.length && !h.fx.length) { h.fx.push('color'); h.guess = true; }
      else if (vis.length && h.guess) { h.fx = vis.slice(); h.guess = false; }
      out.hover = h;
    } else if (t === 'click') {
      // «…savol bosilganda, javobi ochilsin» — вторая часть дополняет ту же реакцию.
      if (!tr && !els.length && out.click && (out.click.guess || cg === false)) {
        if (out.click.guess || fx.indexOf('open') >= 0 || msg) { out.click.fx = out.click.el === 'faq' || (fx.indexOf('open') >= 0 && !msg) ? 'open' : 'msg'; out.click.msg = msg || out.click.msg; out.click.guess = false; return; }
      }
      const faq = els.indexOf('faq') >= 0;
      const c = { el: faq ? 'faq' : 'btn', fx: faq || (fx.indexOf('open') >= 0 && fx.indexOf('msg') < 0) ? 'open' : 'msg', msg, guess: cg || !fx.length };
      if (!out.click || out.click.guess) out.click = c;
      else if (c.el === 'faq') out.click2 = c; else out.click2 = out.click2 || c;
    } else if (t === 'load') {
      const f = fx.indexOf('slide') >= 0 ? 'slide' : 'fade';
      const how = fx.indexOf('fade') >= 0 || fx.indexOf('slide') >= 0;
      if (!tr && out.loads.length && out.loads[out.loads.length - 1].guess) out.loads.pop();   // «…opens, blocks fade in» — одно и то же
      out.loads.push({ el: els.indexOf('title') >= 0 && els.indexOf('card') < 0 && els.indexOf('img') < 0 ? 'title' : 'all', fx: f, how, guess: !appear && !how });
    } else if (t === 'phone') {
      // Телефон без «что делает» — ИИ сам прячет меню в ☰ («Taxmin»); «menyu» без «yig'ilsin» — тоже догадка.
      const p0 = out.phone || { menu: false, bar: false, guess: false };
      const bar = fx.indexOf('bar') >= 0 && (els.indexOf('btn') >= 0 || els.indexOf('call') >= 0);
      const burger = fx.indexOf('burger') >= 0;
      const menu = burger || (els.indexOf('menu') >= 0 && !bar);
      if (bar) p0.bar = true;
      if (menu) { p0.menu = true; p0.guess = !burger && !(p0.menu && p0.sure); if (burger) p0.sure = true; }
      if (!bar && !menu && !p0.menu && !p0.bar) { p0.menu = true; p0.guess = true; }
      out.phone = p0;
    }
  });
  out.n += (out.hover ? 1 : 0) + (out.click ? 1 : 0) + (out.loads.length ? 1 : 0) + (out.phone ? 1 : 0);
  const low = lowAll(src);
  if (!out.n && !out.chaos && !out.still && RE_BEH_VAGUE.test(low)) { out.chaos = true; out.guess = true; out.vague = true; }
  out.none = !out.n && !out.chaos && !out.still;
  return out;
}
// Текст сообщения после нажатия: из кавычек или по цели сайта.
const BEH_TXT = {
  join: Q3("✅ Rahmat! Siz ro'yxatdan o'tdingiz", '✅ Спасибо! Ты записан', '✅ Thanks! You’re signed up'),
  order: Q3("🛒 Savatga qo'shildi", '🛒 Добавлено в корзину', '🛒 Added to the cart'),
  call: Q3("📞 Tez orada qo'ng'iroq qilamiz", '📞 Скоро перезвоним', '📞 We’ll call you soon'),
  any: Q3('✅ Rahmat!', '✅ Спасибо!', '✅ Thank you!'),
  ans: Q3("Javob: hammasi narxlar bo'limida yozilgan.", 'Ответ: всё написано в разделе цен.', 'Answer: it’s all in the prices section.'),
  menu: Q3('Menyu', 'Меню', 'Menu')
};
// Поведение → правила CSS страницы (настоящие :hover, transition, @keyframes, @media) и анимации.
const BEH_KF = [
  '@keyframes ai5up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }',
  '@keyframes ai5down { from { opacity: 0; transform: translateY(-60px); } to { opacity: 1; transform: none; } }',
  '@keyframes ai5pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(250, 204, 21, 0.45); } 100% { transform: scale(1); } }',
  '@keyframes ai5toast { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }',
  '@keyframes ai5drop { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: none; } }',
  '@keyframes ai5wob { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }',
  '@keyframes ai5jump { from { transform: translateY(0); } to { transform: translateY(-16px); } }',
  '@keyframes ai5spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
  '@keyframes ai5run { from { transform: translateX(-70px); } to { transform: translateX(70px); } }'
];
const behCss = (b, C1, C2, dark) => {
  // ☰, открытое меню и панель снизу есть на странице всегда, видны — только когда так написано (и на узкой странице).
  const out = BEH_KF.concat(['.burger { display: none; padding: 2px 10px; border-radius: 10px; font-size: 26px; line-height: 1.1; cursor: pointer; }',
    '.mnav { display: flex; flex-direction: column; padding: 4px 20px 10px; background-color: white; color: #0F172A; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.14); animation: ai5drop 0.3s ease both; }',
    '.mi { padding: 11px 2px; font-size: 17px; font-weight: 700; box-shadow: inset 0 -1px 0 #E2E8F0; }', '.callbar { display: none; }']);
  if (b.chaos) {
    out.push('.title { display: inline-block; animation: ai5wob 0.5s ease-in-out infinite alternate; }', '.badge { animation: ai5spin 1.4s linear infinite; }',
      '.logo { display: inline-block; animation: ai5spin 2.4s linear infinite; }', '.ic { display: inline-block; animation: ai5spin 1.1s linear infinite; }',
      '.card { animation: ai5jump 0.45s ease-in-out infinite alternate; }', '.it { animation: ai5jump 0.45s ease-in-out infinite alternate; }', '.ph { animation: ai5jump 0.45s ease-in-out infinite alternate; }',
      '.d1 { animation-delay: 0.15s; }', '.d2 { animation-delay: 0.3s; }', '.cta { animation: ai5run 0.9s ease-in-out infinite alternate; }', '.navbtn { animation: ai5jump 0.35s ease-in-out infinite alternate; }');
    return out;
  }
  const HB = dark ? '#FACC15' : '#FACC15';
  if (b.hover) {
    const tf = [];
    if (b.hover.fx.indexOf('lift') >= 0) tf.push('translateY(-8px)');
    if (b.hover.fx.indexOf('grow') >= 0) tf.push('scale(1.12)');
    const dec = (card) => [tf.length ? 'transform: ' + tf.join(' ') + ';' : '', b.hover.fx.indexOf('color') >= 0 ? (card ? 'background-color: #FEF3C7; color: #111827;' : 'background-color: ' + HB + '; color: #111827;') : '',
      b.hover.fx.indexOf('shadow') >= 0 || b.hover.fx.indexOf('lift') >= 0 ? 'box-shadow: 0 18px 34px rgba(15, 23, 42, 0.3);' : ''].join(' ');
    const sels = [].concat(b.hover.els.indexOf('btn') >= 0 ? ['.cta', '.navbtn', '.btn2'] : [], b.hover.els.indexOf('card') >= 0 ? ['.card', '.it', '.ph'] : [], b.hover.els.indexOf('title') >= 0 ? ['.title'] : []);
    sels.forEach((s) => out.push(s + ' { transition: all 0.3s ease; cursor: pointer; }', s + ':hover { ' + dec(s !== '.cta' && s !== '.navbtn' && s !== '.btn2') + ' }'));
    if (b.hover.els.indexOf('title') >= 0) out.push('.title { display: inline-block; }');
  }
  if (b.click) out.push('.cta { cursor: pointer; }', '.prs { transform: scale(0.92); }', '.faq { cursor: pointer; }');
  out.push('.toast { position: fixed; left: 16px; right: 16px; bottom: 16px; padding: 14px 18px; border-radius: 14px; background-color: #111827; color: white; font-size: 17px; font-weight: 800; text-align: center; box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3); animation: ai5toast 0.35s ease both; }',
    '.ans { margin: 8px 0 0; font-weight: 500; color: #475569; animation: ai5drop 0.3s ease both; }', '.qa { font-weight: 700; }');
  b.loads.forEach((l) => {
    if (l.el === 'title') { out.push('.title { animation: ' + (l.fx === 'slide' ? 'ai5down 0.9s' : 'ai5up 0.8s') + ' ease 0.2s backwards; }'); return; }
    const a = (d) => (l.fx === 'slide' ? 'ai5down' : 'ai5up') + ' 0.8s ease ' + d + 's backwards';
    out.push('.badge { animation: ' + a(0.1) + '; }', '.title { animation: ' + a(0.35) + '; }', '.sub { animation: ' + a(0.6) + '; }', '.cta { animation: ' + a(0.85) + '; }',
      '.card { animation: ' + a(1.1) + '; }', '.blk { animation: ' + a(1.1) + '; }', '.d1 { animation-delay: 1.45s; }', '.d2 { animation-delay: 1.8s; }', '.d3 { animation-delay: 2.15s; }', '.goal { animation: ' + a(2.2) + '; }', '.par { animation: ' + a(1.1) + '; }');
  });
  if (b.pulse) out.push('.cta { animation: ai5pulse 1.3s ease-in-out infinite; }');
  if (b.still) {
    const f = b.still.fx;
    const s = b.still.el === 'card' || b.still.el === 'img' ? '.card' : b.still.el === 'title' ? '.title' : '.cta';
    out.push(s + ' { ' + [f.indexOf('grow') >= 0 ? (s === '.cta' ? 'font-size: 26px; padding: 22px 46px;' : 'transform: scale(1.06);') : '', f.indexOf('color') >= 0 ? 'background-color: #FACC15; color: #111827;' : '',
      f.indexOf('shadow') >= 0 || f.indexOf('lift') >= 0 ? 'box-shadow: 0 18px 34px rgba(15, 23, 42, 0.3);' : ''].join(' ') + ' }');
  }
  if (b.phone && b.phone.menu) out.push('@media (max-width: 600px) { .burger { display: block; } .navbtn { display: none; } }');
  if (b.phone && b.phone.bar) out.push('@media (max-width: 600px) { .callbar { display: block; position: fixed; left: 12px; right: 12px; bottom: 12px; padding: 14px; border-radius: 14px; background-color: ' + C1 + '; color: white; text-align: center; font-size: 17px; font-weight: 800; box-shadow: 0 12px 26px rgba(0, 0, 0, 0.28); } .foot { padding-bottom: 80px; } }');
  return out;
};
// Поведение на странице: кого можно навести, классы для очереди появления, ☰, панель снизу, ответы на вопросы,
// сообщение после нажатия (st — что сейчас сделал курсор: clicked, open, menu).
function behEls(pick, els, b, st, ctx) {
  const HOV = /(^|\s)(cta|navbtn|btn2|card|it|ph|burger|faq)(\s|$)/;
  let nCard = 0, nBlk = 0, h0 = false;
  const mark = (e) => {
    if (!e || typeof e === 'string') return e;
    let cls = e.cls || '';
    if (/(^|\s)card(\s|$)/.test(cls)) { cls += ' d' + nCard; nCard += 1; }
    if (/(^|\s)blk(\s|$)/.test(cls)) { cls += ' d' + nBlk; nBlk += 1; }
    if (!h0 && /(^|\s)(card|it|ph)(\s|$)/.test(cls)) { cls += ' h0'; h0 = true; }
    if (st && st.press === e.k) cls += ' prs';   // кнопка под курсором в миг нажатия
    const n = Object.assign({}, e, { cls: cls.trim() }, HOV.test(cls) ? { hoverable: true } : {});
    if (e.kids) n.kids = e.kids.map(mark);
    return n;
  };
  let out = els.map(mark);
  // Вопросы — свёрнуты: открывается ответ на тот, на который нажали.
  const faqClick = (b.click && b.click.el === 'faq') || (b.click2 && b.click2.el === 'faq');
  if (faqClick) {
    const has = out.some((e) => e.k === 'blkfaq');
    if (!has) out.splice(out.length - 1, 0, mark(blockEl(pick, { k: 'faq', h: BLOCKS.find((x) => x.k === 'faq').h, n: 0 }, 9, ctx.ins || {}, ctx.tp)));
    out = out.map((e) => (e.k !== 'blkfaq' ? e : Object.assign({}, e, { kids: e.kids.map((r) => (r.k !== 'rowfaq' ? r : Object.assign({}, r, { kids: r.kids.map((it, j) => {
      const full = String(it.text || ''), q = full.split('? ')[0] + '?', a = full.split('? ').slice(1).join('? ');
      return Object.assign({}, it, { text: undefined, cls: (it.cls || 'it wide') + ' faq', hoverable: true, kids: [{ t: 'p', cls: 'qa', k: it.k + 'q', text: q + (st && st.open && j === 0 ? ' ▴' : ' ▾') }].concat(st && st.open && j === 0 ? [{ t: 'p', cls: 'ans', k: it.k + 'a', text: a || pick(BEH_TXT.ans) }] : []) });
    }) }))) })));
  }
  // ☰ в шапке (виден только на узкой странице, @media) и открытое меню под шапкой.
  out = out.map((e) => (e.k !== 'nav' ? e : Object.assign({}, e, { kids: e.kids.concat([{ t: 'span', cls: 'burger', k: 'burger', text: '☰', hoverable: true }]) })));
  if (st && st.menu) {
    const links = (ctx.base.nav || []).map((x, i) => ({ t: 'div', cls: 'mi', k: 'mi' + i, text: pick(x) }));
    out.splice(1, 0, { t: 'div', cls: 'mnav', k: 'mnav', kids: links });
  }
  if (b.phone && b.phone.bar) out.push({ t: 'div', cls: 'callbar', k: 'callbar', text: (ctx.btn === 'call' ? '📞 ' : '👉 ') + ctx.ctaText });
  if (st && st.clicked && b.click && b.click.fx === 'msg') {
    const m = b.click.msg ? '✅ ' + b.click.msg : pick(BEH_TXT[ctx.btn === 'join' || ctx.btn === 'order' || ctx.btn === 'call' ? ctx.btn : 'any']);
    out.push({ t: 'div', cls: 'toast', k: 'toast', text: m });
  }
  return out;
}
// Что курсор показывает на странице (по кругу): наводит, нажимает, сужает окно до телефона и нажимает ☰.
const behDemos = (b, els) => {
  if (!b) return [];
  const firstCard = (() => { let k = null; const walk = (e) => { if (k || !e || typeof e === 'string') return; if (/(^|\s)h0(\s|$)/.test(e.cls || '')) k = e.k; (e.kids || []).forEach(walk); }; els.forEach(walk); return k; })();
  if (b.chaos) return [{ a: 'hover', k: 'cta' }];
  const d = [];
  if (b.hover) b.hover.els.forEach((el) => d.push({ a: 'hover', k: el === 'card' ? firstCard || 'cta' : el === 'title' ? 'h1' : 'cta' }));
  [b.click, b.click2].filter(Boolean).forEach((c) => d.push(c.el === 'faq' ? { a: 'click', k: 'f0', st: 'open' } : { a: 'click', k: 'cta', st: 'clicked' }));
  if (b.loads.length) d.push({ a: 'reload' });
  if (b.phone && b.phone.menu) d.push({ a: 'click', k: 'burger', st: 'menu', vw: 360 });
  else if (b.phone && b.phone.bar) d.push({ a: 'look', vw: 360 });
  if (!b.hover && !b.click && !b.loads.length && !b.phone && !b.pulse) d.push({ a: 'hover', k: 'cta' }, { a: 'click', k: 'cta', st: 'clicked' });
  return d;
};

// Промпт → современный сайт (как у настоящего ИИ): меню, баннер с градиентом, карточки, раздел цели, подвал.
// Что именно на сайте — решает промпт: «Nima?» — название, меню и карточки; «Nega?» — кнопка баннера, подзаголовок
// и раздел внизу. Без «Nega?» ИИ ставит общую кнопку «Batafsil», которая никуда не ведёт.
// ── «QOIDALAR?» (урок 6 модуля, 12.11.2026): точные требования заказчика — что обязательно (majburiy) и что нельзя
// (mumkin emas), ограничения (faqat bitta tugma, ko'pi bilan 3 ta blok). Правил нет или они расплывчатые («hammasi
// tushunarli») — ИИ сам добавляет «полезное»: окно подписки, «−50%», чат, и выдумывает телефон («Taxmin»).
const RL_NEG = /masin|mang(iz)?(\s|$)|mumkin emas|kerak emas|taqiq|нельзя|запрещ|никак|(^|\s)без(\s|$)|(^|\s)не(\s|$)|(^|\s)no(\s|$)|(^|\s)not(\s|$)|n't|without|never|avoid|forbid/;
const RL_POS = /majburiy|shart|albatta|bo'lsin|kerak|qo'sh|обязательн|должн|нужн|добав|пусть|(^|\s)must|required|need|should|include|(^|\s)add/;
const RL_HEAD = /(majburiy|mumkin emas|bo'lishi shart|обязательно|нельзя|запрещено|must not|not allowed|must|required)\s*:/g;
const RL_ITEMS = [
  ['popup', /oyna|popup|pop-up|qalqib|obuna|reklama|всплыва|окн|окош|подпис|реклам|window|modal|subscri|advert|(^|\s)ads?(\s|$)/],
  ['sale', /chegirma|aksiya|скид|акци|discount|(^|\s)sale|%/],
  ['chat', /chat|чат|suhbat/],
  ['phone', /telefon|raqam|телефон|номер|phone|number/],
  ['addr', /manzil|адрес|address/],
  ['hours', /ish vaqti|ish soati|время работы|часы работы|opening hours|working hours|(^|\s)hours/],
  ['tg', /telegram|телеграм/],
  ['one', /bitta tugma|bir tugma|одна кнопка|одну кнопку|one button|single button/],
  ['max', /blok|bo'lim|блок|раздел|block|section/]
];
const RE_RULE_VAGUE = /tushunarli|o'zing bil|o'zi bil|yaxshi bo'lsin|ortiqcha|hammasi joyida|понятно|сам знаешь|как надо|хорошо|лишн|obvious|you know|as usual|extra|be good/;
const RE_HOURS = /\d{1,2}[:.]\d{2}\s*[–—-]\s*\d{1,2}[:.]\d{2}/;
function rulesOf(rules) {
  const src = String(rules || '').replace(/[‘’ʻʼ`]/g, "'").replace(/[“”«»„]/g, '"').trim();
  if (!src) return null;
  const out = { must: {}, no: {}, yes: {}, one: false, max: 0, vague: false, none: false, n: 0, text: src };
  // Части по заголовкам «majburiy:» / «mumkin emas:» — у каждой своя «сторона».
  const segs = [];
  let last = 0, side = null, m;
  const low0 = src.toLowerCase();
  RL_HEAD.lastIndex = 0;
  while ((m = RL_HEAD.exec(low0))) { if (m.index > last) segs.push({ t: src.slice(last, m.index), side }); side = /mumkin emas|нельзя|запрещ|must not|not allowed/.test(m[1]) ? 'neg' : 'pos'; last = m.index + m[0].length; }
  segs.push({ t: src.slice(last), side });
  segs.forEach((sg) => {
    // Список «reklama oynasi, chegirma va chat bo'lmasin» — сторона у слов без своей метки берётся у соседа справа,
    // «без окна, скидок и чата» — у соседа слева.
    const parts = sg.t.split(/([,;\n]+|\.(?!\d)|\s(?:va|yoki|и|или|and|or)\s)/i);
    const cl = [];
    for (let i = 0; i < parts.length; i += 2) {
      const x = String(parts[i] || '').trim();
      const sep = parts[i + 1] || '';
      if (!x) continue;
      const s = ' ' + x.toLowerCase() + ' ';
      cl.push({ x, s, own: RL_NEG.test(s) ? 'neg' : RL_POS.test(s) ? 'pos' : null, join: /^\s(va|yoki|и|или|and|or)\s$/i.test(sep) });
    }
    // Без своей пометки: «chegirma va chat bo'lmasin» — сторона соседа через союз (справа, потом слева); иначе — сторона
    // заголовка («majburiy: telefon …, Telegram tugmasi»); без заголовка — ближайший сосед с пометкой.
    cl.forEach((c, i) => {
      if (c.own) { c.pol = c.own; return; }
      let j = i; while (cl[j].join && j + 1 < cl.length && !cl[j + 1].own) j += 1;
      const rj = cl[j].join && j + 1 < cl.length ? cl[j + 1].own : null;
      let k = i; while (k > 0 && cl[k - 1].join && !cl[k - 1].own) k -= 1;
      const lk = k > 0 && cl[k - 1].join ? cl[k - 1].own : null;
      const r = cl.slice(i + 1).find((d) => d.own), l = cl.slice(0, i).reverse().find((d) => d.own);
      c.pol = rj || lk || sg.side || (r ? r.own : l ? l.own : 'pos');
    });
    cl.forEach((c) => {
      const items = RL_ITEMS.filter((it) => it[1].test(c.s)).map((it) => it[0]);
      const num = c.s.match(/(\d{1,2})\s*(ta(dan)?|-?та|шт)?\s/);
      items.forEach((k) => {
        if (k === 'max') {
          const nn = c.s.match(/(\d)\s*(ta(dan)?)?\s*(dan\s)?(ko'p|ortiq|blok|bo'lim)|(ko'pi bilan|eng ko'pi|не больше|максимум|не более|at most|no more than|max(imum)?)\s*(\d)|(\d)\s*(блок|раздел|block|section)/);
          const v = nn ? +(nn[1] || nn[8] || nn[9]) : 0;
          if (v > 0) { out.max = v; out.n += 1; }
          return;
        }
        if (k === 'one') { out.one = true; out.n += 1; return; }   // ограничение — и «faqat bitta», и «bittadan ko'p bo'lmasin»
        if (k === 'popup' || k === 'sale' || k === 'chat') { if (c.pol === 'neg') out.no[k] = true; else out.yes[k] = true; out.n += 1; return; }
        if (c.pol === 'neg') return;
        let v = null;
        if (k === 'phone') { const p0 = c.x.match(RE_PHONE); v = p0 ? p0[0].trim() : null; }
        if (k === 'hours') { const h = c.x.match(RE_HOURS); v = h ? h[0] : null; }
        if (k === 'addr') {
          const a = c.x.replace(/^.*?(manzil[a-z']*|адрес[а-я]*|address)\s*[:\-–]?\s*/i, '').replace(/\s*(albatta|majburiy|bo'lsin|bo'lishi shart|kerak|обязательно|должен быть|нужен|пусть будет|must be|is required|please).*$/i, '').trim();
          v = a && a.length > 2 && !/^(albatta|majburiy|bo'lsin)$/i.test(a) ? a : null;
        }
        out.must[k] = { v };
        out.n += 1;
      });
    });
  });
  if (!out.n && RE_RULE_VAGUE.test(low0)) out.vague = true;
  out.none = !out.n && !out.vague;
  return out;
}
const RULE_TXT = {
  promoH: Q3("🎁 Obuna bo'ling!", '🎁 Подпишись!', '🎁 Subscribe!'), promoP: Q3("Birinchi buyurtmaga sovg'a", 'Подарок к первому заказу', 'A gift with your first order'),
  sale: Q3('−50% CHEGIRMA!', '−50% СКИДКА!', '−50% OFF!'), tg: Q3('✈️ Telegram', '✈️ Telegram', '✈️ Telegram'),
  addr: Q3("Navoiy ko'chasi 12", 'ул. Навои 12', '12 Navoi street'), hours: '9:00–20:00'
};
// Правила → страница: «обязательное» — строка сведений под баннером; «нельзя» убирает то, что ИИ добавил бы сам.
function ruleEls(pick, els, r, ctx) {
  const R0 = r || { must: {}, no: {}, yes: {}, vague: false };
  const ex = { popup: !R0.no.popup, sale: !R0.no.sale, chat: !R0.no.chat };
  let out = els.map((e) => (e.k !== 'hero' || !ex.sale ? e : Object.assign({}, e, { kids: [{ t: 'span', cls: 'sale', k: 'sale', text: pick(RULE_TXT.sale) }].concat(e.kids) })));
  const M = R0.must, info = [];
  if (M.phone) info.push({ t: 'span', cls: M.phone.v ? 'ii' : 'ii gsR', k: 'iph', text: '📞 ' + (M.phone.v || INS_TXT.phone) });
  if (M.addr) info.push({ t: 'span', cls: M.addr.v ? 'ii' : 'ii gsR', k: 'iad', text: '📍 ' + (M.addr.v || pick(RULE_TXT.addr)) });
  if (M.hours) info.push({ t: 'span', cls: 'ii', k: 'iho', text: '🕘 ' + (M.hours.v || RULE_TXT.hours) });
  if (M.tg) info.push({ t: 'span', cls: 'tg', k: 'itg', text: pick(RULE_TXT.tg) });
  if (info.length) out.splice(out.findIndex((e) => e.k === 'hero') + 1, 0, { t: 'div', cls: 'info', k: 'info', kids: info });
  if (ex.popup) out.push({ t: 'div', cls: 'promo', k: 'promo', kids: [{ t: 'p', cls: 'pmh', k: 'pmh', text: pick(RULE_TXT.promoH) }, { t: 'p', cls: 'pmp', k: 'pmp', text: pick(RULE_TXT.promoP) }, { t: 'span', cls: 'pmx', k: 'pmx', text: '✕' }] });
  if (ex.chat) out.push({ t: 'div', cls: 'chatb', k: 'chatb', text: '💬' });
  return out;
}
const ruleCss = (r, C1, C2) => {
  const out = ['.sale { position: absolute; right: 18px; top: 16px; padding: 8px 14px; border-radius: 10px; background-color: #DC2626; color: white; font-size: 16px; font-weight: 900; transform: rotate(6deg); box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25); }',
    '.hero { position: relative; }',
    '.info { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; justify-content: center; padding: 12px 24px; background-color: white; color: #0F172A; box-shadow: 0 1px 0 #E2E8F0; font-size: 15px; font-weight: 700; }',
    '.tg { padding: 7px 14px; border-radius: 999px; background-color: #229ED9; color: white; font-size: 14px; }',
    '.promo { position: fixed; left: 14px; bottom: 14px; width: 210px; padding: 12px 34px 12px 14px; border-radius: 14px; background-color: white; color: #0F172A; box-shadow: 0 14px 34px rgba(15, 23, 42, 0.3); }',
    '.pmh { margin: 0 0 2px; font-size: 16px; font-weight: 800; }', '.pmp { margin: 0; font-size: 13px; color: #475569; }', '.pmx { position: absolute; right: 10px; top: 8px; color: #94A3B8; font-size: 14px; }',
    '.chatb { position: fixed; right: 14px; bottom: 14px; width: 52px; height: 52px; border-radius: 50%; background-color: ' + C1 + '; color: white; font-size: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28); }'];
  // Узкая страница (телефон): окно подписки и чат меньше — сайт под ними видно.
  out.push('@media (max-width: 600px) { .promo { width: 150px; padding: 8px 24px 8px 10px; } .pmh { font-size: 13px; } .pmp { font-size: 11px; } .chatb { width: 40px; height: 40px; font-size: 20px; } .sale { font-size: 13px; padding: 5px 10px; } }');
  if (r && r.one) out.push('.navbtn { display: none; }', '.btn2 { display: none; }', '.tg { display: none; }');
  return out;
};

const BEH_NONE = { hover: null, click: null, loads: [], phone: null, pulse: false, still: null, chaos: false, guess: false, none: true, n: 0 };
// st — что сейчас сделал курсор показа (урок 5): clicked, press, open, menu.
function aiSite(pick, pr, st) {
  const what = pr ? String(pr.what || '').trim() : '';
  const why = pr ? String(pr.why || '').trim() : '';
  const aud = pr ? audOf(pr.who) : null;   // урок 2: «Kim uchun?»
  const ins = pr ? insOf(pr.inside) : null;   // урок 3: «Ichida nima?»
  // Урок 6: «Qoidalar?» — свой телефон, «ko'pi bilan 3 ta blok» (лишние блоки ИИ не ставит).
  const l6 = !!(pr && pr.rules !== undefined);
  const rl = l6 ? rulesOf(pr.rules) : null;
  if (rl && rl.must.phone && rl.must.phone.v && ins && !ins.phone) ins.phone = rl.must.phone.v;   // свой телефон — и в «Aloqa»
  const kind = kindOf(what);
  const tname = what && !kind ? topicName(what) : '';
  const base = kind || (what ? WIKI : BLANK);
  const title = kind ? titleOf(what) : what ? pick(fillL(WIKI.title, { t: tname })) : pick(BLANK.title);
  const lk = pr ? lookOf(pr.look) : null;   // урок 4: «Ko'rinishi?»
  const lp = lk ? lookPalette(lk.vague ? Object.assign({}, lk, { colors: [LOOK_COLORS.find((c) => c.k === 'pink')] }) : lk, topicOf(what + ' ' + why)) : null;
  const tp = lp ? lp.tp : topicOf(what + ' ' + why);
  const g = why ? goalsOf(why) : {};
  const btn = g.join ? 'join' : g.order ? 'order' : g.call ? 'call' : g.come ? 'come' : g.tell ? 'tell' : null;
  const sub = btn ? pick(AI_TXT[{ join: 'subJoin', order: 'subOrder', call: 'subCall', come: 'subCome', tell: 'subTell' }[btn]]) : pick(base.sub);
  const ctaText = btn && btn !== 'tell' ? pick(AI_TXT[btn]) : pick(AI_TXT.more);
  const audSub = aud && aud.key !== 'all' ? (aud.key === 'gen' ? pick(fillL(AUD_TXT.sub.gen, { w: capS(aud.text) })) : pick(AUD_TXT.sub[aud.key])) : null;
  const audBadge = !aud ? null : aud.age && aud.age.grade && aud.key !== 'parents' && aud.key !== 'old' ? pick(fillL(AUD_TXT.badge.grade, { a: aud.age.grade }))
    : aud.age && aud.age.txt && (aud.key === 'kids' || aud.key === 'teens') ? pick(fillL(AUD_TXT.badge.age, { a: aud.age.txt }))
      : AUD_TXT.badge[aud.key] ? pick(AUD_TXT.badge[aud.key]) : null;
  const likeCards = aud ? aud.likes.map((l) => ({ ic: l.ic, h: l.h, p: l.p, like: true })) : [];
  const cardsAll = likeCards.concat(base.cards).slice(0, 3);
  const short = title.split(/\s+/).slice(0, 2).join(' ');
  const els = [
    { t: 'div', cls: 'nav', k: 'nav', kids: [{ t: 'span', cls: 'logo', k: 'logo', text: tp.em + ' ' + short },
      { t: 'div', cls: 'links', k: 'links', kids: base.nav.map((x, i) => ({ t: 'span', k: 'l' + i, text: pick(x) })) },
      { t: 'span', cls: 'navbtn', k: 'navbtn', text: ctaText }] },
    { t: 'div', cls: 'hero', k: 'hero', kids: [{ t: 'span', cls: 'badge', k: 'badge', text: audBadge || pick(base.badge) },
      { t: 'h1', cls: 'title', k: 'h1', text: title }, { t: 'p', cls: 'sub', k: 'sub', text: audSub || sub },
      { t: 'button', cls: 'cta', k: 'cta', text: ctaText }] },
    { t: 'div', cls: 'cards', k: 'cards', kids: cardsAll.map((c, i) => ({ t: 'div', cls: 'card', k: 'card' + i,
      kids: [{ t: 'div', cls: 'ic', k: 'ic' + i, text: c.ic }, { t: 'h3', cls: c.like ? 'ch ach' : 'ch', k: 'ch' + i, text: pick(c.h) }, { t: 'p', cls: 'cp', k: 'cp' + i, text: pick(c.p) }] })) }
  ];
  // Разделы цели: основной и ещё один (например, «рассказать» и «прийти»).
  const goalsList = ['join', 'order', 'call', 'come', 'tell'].filter((x) => g[x]).slice(0, 2);
  // Заказ: строки — из меню по теме сайта (торты, мороженое, книги, плов), иначе — по виду сайта.
  const tm = INS_TXT.menus.find((m) => has(what + ' ' + why, m.re));
  const topicMenu = tm ? tm.items : null;
  goalsList.forEach((x, gi) => {
    const kids = [];
    if (x === 'join') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gJoin) }, { t: 'div', cls: 'inp', text: pick(AI_TXT.inName) }, { t: 'div', cls: 'inp', text: pick(AI_TXT.inClass) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.send) });
    if (x === 'order') { kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gOrder) }); (topicMenu || base.rows || BLANK.rows).forEach((r, ri) => kids.push({ t: 'div', cls: 'row', k: 'row' + ri, kids: [{ t: 'span', text: pick(r) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.orderBtn) }] })); }
    if (x === 'call') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gCall) }, l6 ? { t: 'p', cls: rl && rl.must.phone && rl.must.phone.v ? 'gp' : 'gp gsR', text: '📞 ' + (rl && rl.must.phone && rl.must.phone.v ? rl.must.phone.v : INS_TXT.phone) } : { t: 'p', cls: 'gp', text: pick(AI_TXT.phone) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.hours) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.call) });
    if (x === 'tell') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gTell) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.date) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.place) });
    if (x === 'come') kids.push({ t: 'h2', cls: 'gh', text: pick(AI_TXT.gCome) }, { t: 'p', cls: 'gp', text: pick(AI_TXT.addr) }, { t: 'button', cls: 'btn2', text: pick(AI_TXT.map) });
    els.push({ t: 'div', cls: 'goal', k: 'goal' + gi, kids });
  });
  // «Kim uchun?»: родителям — раздел про безопасность, цены и расписание; пожилым — крупный телефон.
  const hasPar = aud && (aud.key === 'parents' || aud.also === 'parents');
  const hasTel = aud && (aud.key === 'old' || aud.also === 'old');
  // Сразу под баннером — чтобы их было видно в окне (заказчик: любое изменение ученик должен заметить).
  const audEls = [];
  if (hasTel) audEls.push({ t: 'div', cls: 'par', k: 'tel', kids: [{ t: 'h2', cls: 'gh2', k: 'telh', text: pick(AUD_TXT.telH) }, { t: 'p', cls: 'gp', k: 'tel0', text: pick(AUD_TXT.tel) }] });
  if (hasPar) audEls.push({ t: 'div', cls: 'par', k: 'par', kids: [{ t: 'h2', cls: 'gh2', k: 'parh', text: pick(AUD_TXT.parH) }].concat(AUD_TXT.par.map((x, i) => ({ t: 'p', cls: 'gp', k: 'par' + i, text: pick(x) }))) });
  // «Ichida nima?»: вместо карточек-заглушек — блоки, ровно в написанном порядке.
  if (ins && ins.blocks.length) els.splice(2, 1, ...ins.blocks.slice(0, rl && rl.max ? rl.max : 99).map((b, i) => blockEl(pick, b, i, ins, tp, what + ' ' + why)));
  els.splice(2, 0, ...audEls);
  els.push({ t: 'div', cls: 'foot', k: 'foot', text: pick(fillL(AI_TXT.foot, { t: title })) });
  // Урок 5: «Qanday ishlaydi?» — поведение (у уроков 1–4 строки нет, страница прежняя).
  const l5 = !!(pr && pr.beh !== undefined);
  const bh = l5 ? behOf(pr.beh) : null;
  const els5a = l5 ? behEls(pick, els, bh || BEH_NONE, st || {}, { ins, tp, base, btn, ctaText }) : els;
  const els5 = l6 ? ruleEls(pick, els5a, rl, { tp }) : els5a;
  const C1 = tp.c, C2 = tp.c2;
  // Свой «Ko'rinishi?» важнее догадки ИИ по аудитории: облик под аудиторию не накладывается.
  const hasLook = !!(lk && (!lk.none || lk.vague));
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
    '.row { display: flex; justify-content: space-between; align-items: center; gap: 10px; background-color: white; padding: 10px 14px; border-radius: 12px; margin: 0 0 8px; font-size: 15px; }',
    '.foot { padding: 24px 32px; color: #64748B; font-size: 13px; text-align: center; }',
    '.par { margin: 20px 32px 8px; padding: 22px; border-radius: 18px; background-color: white; box-shadow: 0 0 0 1px #E2E8F0; }',
    '.gh2 { margin: 0 0 12px; font-size: 22px; font-weight: 800; color: ' + C2 + '; }',
    '.blk { margin: 22px 32px 6px; }', '.bh { margin: 0 0 12px; font-size: 22px; font-weight: 800; color: ' + C2 + '; }',
    '.row3 { display: flex; flex-wrap: wrap; gap: 12px; }',
    '.it { flex: 1; background-color: white; border-radius: 14px; padding: 14px 16px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07); font-size: 15px; font-weight: 600; }',
    '.wide { flex-basis: 100%; }', '.ph { flex: 1; height: 92px; border-radius: 14px; background-image: linear-gradient(135deg, ' + tp.bg + ', ' + C1 + '); font-size: 36px; display: flex; align-items: center; justify-content: center; }',
    '.pr { margin: 4px 0 0; font-size: 20px; font-weight: 800; color: ' + C2 + '; }', '.star { margin: 0 0 4px; color: #F59E0B; letter-spacing: 2px; }',
    '@media (max-width: 600px) { .btn2 { white-space: nowrap; } .pr { white-space: nowrap; } .links { display: none; } .nav { padding: 12px 18px; } .hero { padding: 38px 20px; } .title { font-size: 32px; } .cards { flex-direction: column; padding: 20px; } .goal { margin: 16px 20px 8px; } .par { margin: 16px 20px 8px; } .blk { margin: 16px 20px 6px; } .row3 { flex-direction: column; } .ph { height: 70px; } }'
  ].concat(aud && !hasLook ? audCss(aud.key, C1, C2, tp.bg) : [], hasLook ? lookCss(lk, C1, C2, tp.bg, lp && lp.acc) : [], l5 ? behCss(bh || BEH_NONE, C1, C2) : [], l6 ? ruleCss(rl, C1, C2) : []);
  return { title, els: els5, css, goals: g, btn, kind: !!kind, what: !!what, aud, likes: likeCards.length, par: hasPar, tel: hasTel,
    rules: l6 ? (rl || { must: {}, no: {}, yes: {}, none: true, n: 0 }) : null, beh: bh, demos: l5 ? behDemos(bh || BEH_NONE, els5) : null, at: l5 ? (s2) => aiSite(pick, pr, s2) : null,
    lk, look: !!(lk && !lk.none), lookGuess: !!(lk && lk.vague),
    ins, blocks: ins ? ins.blocks.length : 0, gsP: !!(ins && !ins.price && ins.blocks.some((b) => b.k === 'prices')), gsT: !!(ins && !ins.phone && ins.blocks.some((b) => b.k === 'contact')) };
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
const TAXMIN = L3('Taxmin', 'Догадка', 'Guess');

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
// Телефон (13.11.2026, заказчик: «многовато информации на телефонах»): готовые строки сворачиваются в одну полосу
// цветных меток («Nima? ✓ Nega? ✓ …»), развёрнута только рабочая строка — поле, строка Коди с ошибкой, строка, которая
// сейчас меняется или менялась последней (иначе — последняя строка с текстом). Нажатие на полосу раскрывает всё.
function PromptEditor({ rows, later, send }) {
  const pick = usePick();
  const narrow = useNarrow();
  const [open, setOpen] = useState(false);
  const lastChg = useRef(-1);
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
  now.forEach((k, i) => { if (anim.current[i] && anim.current[i].to === k) lastChg.current = i; });
  const hasText = (r) => r.t != null && r.t !== MISS;
  const work = rows.map((r, i) => r.t == null || (r.t === MISS && r.on) || /is-hl/.test(r.cls || '') || i === lastChg.current || !!(anim.current[i] && anim.current[i].to === now[i]));
  if (!work.some(Boolean)) { let k = -1; rows.forEach((r, i) => { if (hasText(r)) k = i; }); if (k >= 0) work[k] = true; }
  const foldable = rows.map((r, i) => !work[i] && !!r.q);
  const fold = narrow && !open && foldable.filter(Boolean).length >= 3;
  useEffect(() => { prev.current = now; });
  const fin = (i, k) => () => { if (anim.current[i] && anim.current[i].to === k) { delete anim.current[i]; tick((x) => x + 1); } };
  return (
    <div className="a1-ed" translate="no">
      {flash.current ? <i key={flash.current} className="a1-ed-flash" aria-hidden="true" /> : null}
      <div className="a1-lines">
        {fold ? (
          <button type="button" className="a1-fold" onClick={() => setOpen(true)}>
            {rows.map((r, i) => (foldable[i] ? <span key={i} className={'a1-fold-q' + (FORMULA.indexOf(r.q) >= 0 ? ' is-q' + FORMULA.indexOf(r.q) : '')}><span className={'a1-q' + (hasText(r) ? ' is-on' : '')}>{pick(r.q)}{hasText(r) ? ' ✓' : ''}</span></span> : null))}
            <span className="a1-fold-more" aria-hidden="true">▾</span>
          </button>
        ) : narrow && open && foldable.filter(Boolean).length >= 3 ? <button type="button" className="a1-fold is-open" onClick={() => setOpen(false)}><span className="a1-fold-more" aria-hidden="true">▴</span></button> : null}
        {rows.map((r, i) => {
          if (fold && foldable[i]) return null;
          const qi = r.q ? FORMULA.indexOf(r.q) : -1;
          const a = anim.current[i] && anim.current[i].to === now[i] ? anim.current[i] : null;
          return (
            <div key={i} className={'a1-line' + (qi >= 0 ? ' is-q' + qi : '') + (r.cls ? ' ' + r.cls : '') + (a ? ' a1-chg' : '') + (fold && work[i] ? ' is-work' : '')}>
              {r.q ? <span className={'a1-q' + (r.on ? ' is-on' : '')}>{pick(r.q)}</span> : null}
              <span className="a1-txt">{a ? <TypeSwap key={a.n + ':' + a.to} from={a.from} to={a.to} done={fin(i, a.to)}>{r.body}</TypeSwap> : r.body}</span>
            </div>
          );
        })}
      </div>
      {later || send ? (
        <div className="a1-bar">
          {later ? <span className="a1-next">{FORMULA.slice(later === true ? 2 : later).map((q, i) => <span key={i} className="a1-chip" title={pick(fillL(LESSON_OF, { n: i + (later === true ? 2 : later) }))}>{pick(q)}</span>)}</span> : <span />}
          {send || null}
        </div>
      ) : null}
    </div>
  );
}
// Готовые строки промпта: текст ученика или пример.
const txtRow = (text, qi, extra) => Object.assign({ t: text, q: qi == null ? null : FORMULA[qi], on: qi != null, cls: 'is-task', body: <span className="a1-val">{text}</span> }, extra || {});

// ── ОТКУДА ЧТО: метки вопросов формулы у частей сайта ──
function Pins({ pins, stamp }) {
  const pick = usePick();
  const ref = useRef(null);
  const [pos, setPos] = useState([]);
  const key = JSON.stringify(pins.map((p0) => [p0.sel, p0.q && p0.q.ru])) + (stamp || '');
  useLayoutEffect(() => {
    const host = ref.current && ref.current.closest('.kz-br-page');
    if (!host) return undefined;
    const put = () => {
      const o = host.getBoundingClientRect();
      const next0 = pins.map((p0) => {
        const e = host.querySelector('.c17-doc ' + p0.sel);
        if (!e || !e.getClientRects().length) return null;   // спрятан (☰ на широкой странице)
        let r = e.getBoundingClientRect();
        try { const g = document.createRange(); g.selectNodeContents(e); const t = g.getBoundingClientRect(); if (t.width) r = t; } catch (x) { /* по рамке */ }
        // Справа от текста нет места (длинное название на телефоне) — метка встаёт над элементом, у правого края.
        const W = host.clientWidth, x0 = Math.round(r.right - o.left + host.scrollLeft + 14);
        // top — метка над элементом слева (карточка в ряду: справа от неё — соседняя карточка).
        const pw = 18 + 6.6 * String(pick(p0.q)).length;
        // Над элементом нет места (☰ у самого верха окна) — метка под ним.
        const yTop = Math.round(r.top - o.top + host.scrollTop - 4), low = r.top - o.top < 26;
        const yB = Math.round(r.bottom - o.top + host.scrollTop + 4);
        if (p0.top) return { x: Math.round(Math.min(r.left - o.left + host.scrollLeft + 4, W - pw - 4)), y: low ? yB : yTop, q: p0.q, cls: (p0.cls || '') + (low ? ' is-below is-top' : ' is-above is-top') };
        if (x0 + (p0.cls && /is-beh|is-guess/.test(p0.cls) ? pw : 74) > W) return { x: Math.max(4, Math.round(Math.min(r.left - o.left + host.scrollLeft + r.width / 2 - pw / 2, W - pw - 4))), y: low ? yB : yTop, q: p0.q, cls: (p0.cls || '') + (low ? ' is-below' : ' is-above') };
        return { x: x0, y: Math.round(r.top + r.height / 2 - o.top + host.scrollTop), q: p0.q, cls: p0.cls };
      }).filter(Boolean);
      // Узкое окно (телефон): не больше двух меток, сначала те, что встают сбоку от вещи, а не над ней.
      const W0 = host.clientWidth;
      const list = W0 < 460 ? next0.filter((q) => !/is-above|is-below/.test(q.cls || '')).concat(next0.filter((q) => /is-above|is-below/.test(q.cls || ''))).slice(0, 2) : next0;
      const next = list.reduce((out, q) => {
        // Метки не налезают друг на друга: сверху — сдвиг влево, сбоку — вниз.
        const w = (t) => 16 + 6.6 * String(pick(t.q)).length;
        const hit = (a) => out.some((b) => Math.abs(a.y - b.y) < 20 && a.x < b.x + w(b) + 4 && b.x < a.x + w(a) + 4);
        const r = Object.assign({}, q);
        for (let k = 0; k < 6 && hit(r); k += 1) { if (/is-above/.test(r.cls || '')) r.x = Math.max(4, r.x - w(r) - 8); else r.y += 22; }
        out.push(r);
        return out;
      }, []);
      setPos((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next));
    };
    put();
    const t = setTimeout(put, 450);
    const t2 = setTimeout(put, 2600);   // урок 5: блоки въезжают по очереди — метки на свои места, когда всё встало
    // Урок 5: курсор открывает меню, ответ, окно сужается — страница меняется сама; метки едут следом (раз в 0,7 с).
    const iv = stamp ? setInterval(put, 700) : 0;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(put) : null;
    if (ro) ro.observe(host);
    return () => { clearTimeout(t); clearTimeout(t2); clearInterval(iv); if (ro) ro.disconnect(); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className="a1-pins" aria-hidden="true">{pos.map((p0, i) => <i key={key + i} className={'a1-pin a1-in' + (p0.cls ? ' ' + p0.cls : '')} style={{ left: p0.x + 'px', top: p0.y + 'px', animationDelay: (0.25 + i * 0.3) + 's' }}>{pick(p0.q)}</i>)}</span>;
}
// Что дала каждая строка: «Nima?» — название и карточки, «Nega?» — кнопка баннера и раздел внизу.
// Урок 5: «Qanday ishlaydi?» — у того, что ведёт себя (кнопка, первая карточка, вопрос, ☰, панель снизу); по метке на элемент.
const behPins = (site) => {
  const b = site.beh;
  if (!b) return [];
  const Q = FORMULA[5], pin = (sel, guess) => ({ sel, q: guess ? TAXMIN : Q, cls: guess ? 'is-guess' : 'is-beh' });
  if (b.chaos) return b.guess ? [pin('.title', true), pin('.cta', true)] : [pin('.title')];
  const out = [];
  if (b.hover) b.hover.els.forEach((el) => out.push(Object.assign(pin(el === 'card' ? '.h0' : el === 'title' ? '.title' : '.cta', b.hover.guess), { hov: true }, el === 'card' ? { top: true } : {})));
  [b.click, b.click2].filter(Boolean).forEach((c) => out.push(Object.assign(pin(c.el === 'faq' ? '.faq' : '.cta', c.guess), c.el === 'faq' ? { top: true } : {})));
  if (b.loads.length) out.push(pin('.title', b.loads.every((l) => l.guess)));
  if (b.pulse || b.still) out.push(pin('.cta'));
  if (b.phone && b.phone.menu) out.push(pin('.burger', b.phone.guess));
  if (b.phone && b.phone.bar) out.push(pin('.callbar'));
  return out.filter((x, i) => out.findIndex((y) => y.sel === x.sel) === i).slice(0, 3);
};
// Урок 6: «Qoidalar?» — у строки сведений (телефон, адрес); то, что ИИ добавил сам (окно, скидка, выдуманный телефон), — «Taxmin».
const rulePins = (site) => {
  const r = site.rules;
  if (!r) return [];
  const out = [];
  if (r.must && Object.keys(r.must).length) out.push({ sel: '.info', q: FORMULA[6], cls: 'is-rule', top: true });
  if (!r.no.sale && !r.yes.sale) out.push({ sel: '.sale', q: TAXMIN, cls: 'is-guess' });
  if (!r.no.popup && !r.yes.popup) out.push({ sel: '.pmh', q: TAXMIN, cls: 'is-guess' });
  if (site.gsT && !(r.must.phone && r.must.phone.v)) out.push({ sel: '.gsT', q: TAXMIN, cls: 'is-guess' });
  if (!(r.must.phone && r.must.phone.v)) out.push({ sel: '.gsR', q: TAXMIN, cls: 'is-guess' });
  return out.slice(0, 3);
};
const pinsOf = (site, withWhat, withWhy, withWho, withIn, withLook, withBeh) => [].concat(
  rulePins(site),
  withBeh !== false ? behPins(site) : [],
  // Урок 4: «Ko'rinishi?» — у названия, кнопки и первой карточки; «chiroyli» — догадка ИИ («Taxmin»).
  withLook !== false && site.look ? [{ sel: '.title', q: FORMULA[4], cls: 'is-look' }, { sel: '.cta', q: FORMULA[4], cls: 'is-look' }, { sel: site.blocks ? '.bh0' : '.ch', q: FORMULA[4], cls: 'is-look' }] : [],
  withLook !== false && site.lookGuess ? [{ sel: '.title', q: TAXMIN, cls: 'is-guess' }, { sel: '.ch', q: TAXMIN, cls: 'is-guess' }] : [],
  // Урок 3: «Ichida nima?» — у первых трёх блоков; придуманные ИИ цена и телефон — «Taxmin».
  withIn !== false && site.blocks ? [0, 1, 2].slice(0, site.blocks).map((i) => ({ sel: '.bh' + i, q: FORMULA[3], cls: 'is-in' })) : [],
  withIn !== false && site.gsP ? [{ sel: '.gsP', q: TAXMIN, cls: 'is-guess' }] : [], withIn !== false && site.gsT ? [{ sel: '.gsT', q: TAXMIN, cls: 'is-guess' }] : [],
  // Урок 2: «Kim uchun?» — первыми (их место главнее): плашка, карточка интереса, раздел для родителей или пожилых.
  withWho !== false && site.aud && site.aud.key !== 'all' ? [{ sel: '.badge', q: FORMULA[2], cls: 'is-who' }] : [], withWho !== false && site.likes ? [{ sel: '.ach', q: FORMULA[2], cls: 'is-who' }] : [],
  withWho !== false && (site.par || site.tel) ? [{ sel: '.gh2', q: FORMULA[2], cls: 'is-who' }] : [],
  withWhat !== false && site.what ? [{ sel: '.title', q: FORMULA[0] }] : [],
  withWhat !== false && site.kind ? [{ sel: '.ch:not(.ach)', q: FORMULA[0] }] : [], withWhy !== false && site.btn ? [{ sel: '.cta', q: FORMULA[1], cls: 'is-why' }, { sel: '.gh', q: FORMULA[1], cls: 'is-why' }] : []);
const noHl = (els) => els.map((e) => Object.assign({}, e, { hl: false }, e.kids ? { kids: e.kids.map((k) => (typeof k === 'string' ? k : Object.assign({}, k, { hl: false }))) } : {}));
// Телефон: окно маленькое — прокрутка к разделу, который дала цель (форма записи, заказ…), иначе его не видно.
const goalHl = (els) => { let done = false; return els.map((e) => (!done && e.cls === 'goal' ? (done = true, Object.assign({}, e, { hl: true })) : e)); };
// Урок 2: на телефоне — прокрутка к тому, что дала строка «Kim uchun?»: раздел для родителей или пожилых, иначе карточки
// интересов; иначе — верх сайта (плашка с аудиторией видна сразу).
// Урок 3: на телефоне — прокрутка к первому блоку из «Ichida nima?».
const blkHl = (els) => { let done = false; return noHl(els).map((e) => (!done && e.cls === 'blk' ? (done = true, Object.assign({}, e, { hl: true })) : e)); };
const audHl = (site) => {
  const want = site.par || site.tel ? 'par' : site.likes ? 'cards' : 'hero';   // hero — назад к верху (после формы записи)
  let done = false;
  return noHl(site.els).map((e) => (want && !done && e.cls === want ? (done = true, Object.assign({}, e, { hl: true })) : e));
};
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
// Урок 5: показ поведения курсором — по кругу: наводит (hover), нажимает (click: курсор, щелчок, результат), страница
// открывается заново (reload: анимации появления), окно сужается до телефона (vw) и курсор нажимает ☰.
// Под «меньше движения» — то же, без плавности курсора.
function useBehDemo(demos, on) {
  const list = on && demos ? demos : [];
  const sig = JSON.stringify(list);
  const Z = { aim: null, rest: null, st: {}, vw: null, press: false, reload: 0, cur: false };
  const [s, setS] = useState(Z);
  useEffect(() => {
    setS((o) => Object.assign({}, Z, { reload: o.reload }));
    if (!list.length) return undefined;
    let alive = true;
    const ts = [];
    const T = (f, ms) => ts.push(setTimeout(() => { if (alive) f(); }, ms));
    const set = (x) => setS((o) => Object.assign({}, o, x));
    let pv = null;
    const run = (i) => {
      const d = list[i % list.length];
      const vw = d.vw || null;
      setS((o) => ({ aim: null, rest: d.k || o.rest, st: {}, vw, press: false, reload: o.reload, cur: d.a === 'hover' || d.a === 'click' }));
      const t0 = vw && pv !== vw ? 1200 : 300;   // окно сначала сужается до телефона
      pv = vw;
      // Страница открывается заново; блоки въезжают ~3 с, потом стоят — чтобы их успели рассмотреть.
      if (d.a === 'reload') { T(() => set({ reload: Date.now() }), 400); T(() => run(i + 1), 7600); return; }
      if (d.a === 'look') { T(() => run(i + 1), t0 + 2800); return; }
      T(() => set({ aim: d.k }), t0 + 300);
      if (d.a === 'hover') { T(() => set({ aim: null }), t0 + 3400); T(() => run(i + 1), t0 + 4500); return; }
      T(() => set({ press: d.k, st: { press: d.k } }), t0 + 1350);
      T(() => set({ press: false, st: { [d.st]: true } }), t0 + 1600);
      T(() => set({ aim: null }), t0 + 2700);
      T(() => run(i + 1), t0 + 5600);
    };
    T(() => run(0), 700);
    return () => { alive = false; ts.forEach(clearTimeout); };
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  return list.length ? s : Z;
}
// Элемент, к которому едет курсор, — в видимой части окна (своя плавная прокрутка: smooth в окне урока не работает).
function useDemoScroll(ref, k) {
  useEffect(() => {
    if (!k) return undefined;
    const page = ref.current && ref.current.closest('.kz-br-page');
    const el = page && page.querySelector('.c17-doc [data-hk="' + k + '"]');
    if (!page || !el) return undefined;
    const r = el.getBoundingClientRect(), o = page.getBoundingClientRect();
    if (r.top >= o.top + 8 && r.bottom <= o.bottom - 8) return undefined;
    const to = Math.max(0, Math.round(r.top - o.top + page.scrollTop - (page.clientHeight - r.height) / 2));
    if (reduceMotion()) { page.scrollTop = to; return undefined; }
    const from = page.scrollTop;
    let i = 0;
    const iv = setInterval(() => { i += 1; const q = i / 14; page.scrollTop = Math.round(from + (to - from) * (1 - (1 - q) * (1 - q))); if (i >= 14) clearInterval(iv); }, 22);
    return () => clearInterval(iv);
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
}
// focus — селектор части сайта, к которой окно прокручено (детектив: в маленьком окне видна нужная карточка).
// demo (урок 5) — курсор сам показывает поведение сайта; vw — своя ширина страницы (800 — компьютер, 360 — телефон).
function AiBrowser({ site, pins, busy, small, focus, demo, vw: vw0 }) {
  const pick = usePick();
  const narrow = useNarrow();
  const fitRef = useRef(null);
  useFitBrowser(fitRef);
  // Окно-телефон (своя ширина до 600) — мыши нет: наведение не показываем, только нажатия.
  const phoneView = !!(vw0 && vw0 <= 600);
  const D = useBehDemo(site.demos && phoneView ? site.demos.filter((d) => d.a !== 'hover') : site.demos, !!demo && !busy);
  useDemoScroll(fitRef, D.aim || D.rest);
  useEffect(() => {
    if (!focus) return undefined;
    const t = setTimeout(() => {
      const page = fitRef.current && fitRef.current.closest('.kz-br-page');
      const el = page && page.querySelector('.c17-doc ' + focus);
      if (!el) return;
      const top = el.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 12;
      page.scrollTop = Math.max(0, top);   // smooth в окне урока не работает (урок 12 CSS)
    }, 900);
    return () => clearTimeout(t);
  }, [focus, site.title]); // eslint-disable-line react-hooks/exhaustive-deps
  const on = !!demo && !busy && site.demos && site.demos.length;
  const s2 = on && site.at && Object.keys(D.st).length ? site.at(D.st) : site;
  const vw = vw0 || (narrow ? 390 : D.vw || 800);
  // Показ курсором — без подсветки (иначе страница прыгала бы к ней при каждом шаге курсора).
  const els = small || on ? noHl(s2.els) : narrow && (s2.look || s2.lookGuess || s2.beh || s2.demos) ? audHl(Object.assign({}, s2, { par: false, tel: false, likes: 0 })) : narrow && s2.blocks ? blkHl(s2.els) : narrow && s2.aud && s2.aud.key !== 'all' ? audHl(s2) : narrow && s2.btn ? goalHl(s2.els) : s2.els;
  return (
    <Br title={site.title} url={site.url || 'index.html'} short={!!small} cls={'a1-site' + (busy ? ' a1-busy' : '') + (on ? ' a1-demo' : '')}>
      <span ref={fitRef} hidden />
      <CssPage key={'r' + D.reload} els={els} rules={withBase(s2.css, 'none')} vw={vw} hover={on ? D.aim : null} mouse={!!(on && D.cur)} rest={on ? D.rest : null} press={!!D.press} />
      {pins && !busy ? <Pins pins={vw <= 600 && (phoneView || D.vw) ? pins.filter((x) => !x.hov) : pins} stamp={site.demos ? String(vw) : null} /> : null}
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
