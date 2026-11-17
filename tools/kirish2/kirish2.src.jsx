// =============================================================================
// ВВОДНЫЙ УРОК, ВАРИАНТ 2 · «Свой сайт за 5 минут» (тестовый, вне списка курсов; 17.11.2026).
// Заказчик: «создай по новой тестовый урок того как ты видишь… можешь полностью по новой сделать». Вводный урок
// всего курса: кода нет ни строчки, 5–6 минут, в конце — дорожная карта курса заказчика (17.11.2026: html → css →
// ai → bootstrap → tilda → blockly → JavaScript → Git/GitHub → React).
// Облик — эталон «Редактор» (стол в точку, Chrome, оранжевый CoddyCamp, Коди с голосом), окно сайта — набор «ИИ».
// Сборка: node tools/kirish2/build.mjs → lessons/test/34-kirish-yol-xaritasi.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== ВВОДНЫЙ УРОК 2 · «Свой сайт за 5 минут» =====
//
// ЗАМЫСЕЛ. Коди спорит: «Сайт за пять минут? Сделаем!» Ученик сам собирает СВОЙ сайт на выбранную тему и по ходу
// узнаёт три части любого сайта: скелет (HTML) — кирпичики-части встают на пустую страницу голыми; одежда (CSS) —
// наряд волной накрывает страницу; мозг (JavaScript) — мёртвая кнопка оживает и делает то, что ученик выбрал.
// Потом сайт «улетает в интернет»: у него адрес, просмотры, лайки и отзывы друзей. Дорожная карта — куда ведёт этот
// первый шаг; вывод — сайт ученика и время, за которое он собран.
//
// ДУГА (7 экранов, ~5 минут; правило «минимум 17» здесь нарочно не действует — вводный урок вне списка):
//   s1 крючок: спор на 5 минут, выбор темы — пустая страница · s2 сам: скелет из кирпичиков · s3 сам: одежда ·
//   s4 сам: мозг — мёртвая кнопка, выбор «что делает», кнопка работает · s5 сам: «В интернет!» — адрес, просмотры,
//   отзывы · map показ: дорожная карта, ракета с сайтом ученика · fin вывод: три части и сайт ученика.
//
// СИСТЕМА СЛОВ: skelet — скелет (HTML), kiyim — одежда (CSS), miya — мозг (JavaScript), g'isht — кирпичик.
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода (без прошедшего времени с «ты»), EN — «you».
// =============================================================================
const META = {
  lessonId: 'test-34-kirish-yol-xaritasi',
  module: 'kirish',
  lessonTitle: {
    uz: "Kirish. O'z saytingiz 5 daqiqada",
    ru: 'Введение. Свой сайт за 5 минут',
    en: 'Intro. Your own site in 5 minutes'
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
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3('HTML hujjat tuzilishi', 'Структура HTML-документа', 'HTML document structure'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone')
};

// Темы сайта ученика: что написано на его сайте. Картинки — свои SVG (kirish2-screens.jsx, FILES).
const K2_TOPICS = {
  game: { name: L3("O'yinlar", 'Игры', 'Games'), logo: '✦ planeta9', title: 'Planeta 9', img: 'k2-game.svg', dom: 'planeta9.uz',
    sub: L3("Robot bilan galaktika bo'ylab sakrang!", 'Прыгай по галактике вместе с роботом!', 'Jump across the galaxy with your robot!'),
    spec: L3('3 olam · 60 daraja · bepul', '3 мира · 60 уровней · бесплатно', '3 worlds · 60 levels · free'),
    btn: L3("O'ynash", 'Играть', 'Play'),
    links: [L3("O'yin", 'Игра', 'Game'), L3('Qahramonlar', 'Герои', 'Heroes'), L3('Reyting', 'Рейтинг', 'Ranking')] },
  foot: { name: L3('Futbol', 'Футбол', 'Football'), logo: '★ golstar', title: 'Gol Star', img: 'k2-foot.svg', dom: 'golstar.uz',
    sub: L3("Har shanba maktab stadionida o'yin. Jamoaga qo'shiling!", 'Каждую субботу — матч на школьном стадионе. Вступай в команду!', 'A match at the school stadium every Saturday. Join the team!'),
    spec: L3("11 o'yinchi · har shanba · stadionda", '11 игроков · по субботам · на стадионе', '11 players · Saturdays · at the stadium'),
    btn: L3("Qo'shilish", 'Вступить', 'Join'),
    links: [L3('Jamoa', 'Команда', 'Team'), L3("O'yinlar", 'Матчи', 'Matches'), L3('Gollar', 'Голы', 'Goals')] },
  music: { name: L3('Musiqa', 'Музыка', 'Music'), logo: '♪ ritm', title: 'Ritm', img: 'k2-music.svg', dom: 'ritm-music.uz',
    sub: L3("Sevimli qo'shiqlaringiz bir joyda. Tinglang va raqsga tushing!", 'Любимые песни в одном месте. Слушай и танцуй!', 'Your favourite songs in one place. Listen and dance!'),
    spec: L3("1000 qo'shiq · 50 albom · reklamasiz", '1000 песен · 50 альбомов · без рекламы', '1000 songs · 50 albums · no ads'),
    btn: L3('Tinglash', 'Слушать', 'Listen'),
    links: [L3("Qo'shiqlar", 'Песни', 'Songs'), L3('Albomlar', 'Альбомы', 'Albums'), L3('Konsertlar', 'Концерты', 'Concerts')] },
  zoo: { name: L3('Hayvonlar', 'Животные', 'Animals'), logo: '● pandapark', title: 'Panda Park', img: 'k2-zoo.svg', dom: 'pandapark.uz',
    sub: L3('Pandalar, kenguru va pingvinlar sizni kutmoqda!', 'Панды, кенгуру и пингвины ждут тебя!', 'Pandas, kangaroos and penguins are waiting for you!'),
    spec: L3('40 xil hayvon · har kuni · 9:00–18:00', '40 видов · каждый день · 9:00–18:00', '40 species · every day · 9:00–18:00'),
    btn: L3('Mehmonga', 'В гости', 'Visit'),
    links: [L3('Hayvonlar', 'Звери', 'Animals'), L3('Xarita', 'Карта', 'Map'), L3('Chiptalar', 'Билеты', 'Tickets')] }
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, picked, ok, dead, chosen, says, done, help; печатаются: eyebrow, ask, подписи, кнопки.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Kirish', 'Введение', 'Intro'),
    say: L3("Salom! Men Kodi. Ko'pchilik sayt yasash juda qiyin deb o'ylaydi. Men esa aytaman: o'z saytingizni besh daqiqada yasaymiz! Ishonmaysizmi? Keling, sinab ko'ramiz. Avval saytingiz nima haqida bo'lishini tanlang.",
      'Привет! Я Коди. Многие думают, что сделать сайт очень сложно. А я говорю: свой сайт мы сделаем за пять минут! Не веришь? Давай проверим. Сначала выбери, о чём будет твой сайт.',
      'Hi! I’m Kodi. Lots of people think making a website is really hard. But I say we’ll make your own site in five minutes! Don’t believe me? Let’s try. First, pick what your site will be about.'),
    picked: L3("Zo'r tanlov! Mana saytingiz uchun bo'sh sahifa. Hozircha unda hech narsa yo'q, lekin bu uzoqqa cho'zilmaydi.",
      'Отличный выбор! Вот пустая страница для твоего сайта. Пока на ней ничего нет, но это ненадолго.',
      'Great choice! Here’s a blank page for your site. There’s nothing on it yet, but not for long.'),
    blank: L3("Bo'sh sahifa", 'Пустая страница', 'Blank page'),
    yours: L3("Bu yerda saytingiz bo'ladi", 'Здесь будет твой сайт', 'Your site will be here'),
    ask: L3("Sayt nima haqida bo'ladi?", 'О чём будет сайт?', 'What will the site be about?'),
    askDone: L3("Sahifa tayyor. Davom etamiz!", 'Страница готова. Вперёд!', 'The page is ready. Let’s go!')
  },
  s2: {
    eyebrow: L3('Skelet', 'Скелет', 'Skeleton'),
    say: L3("Har qanday sayt skeletdan boshlanadi. Skelet sahifada nima borligini aytadi: menyu, sarlavha, rasm va tugma. G'ishtlarni bosing, ular sahifaga tushadi!",
      'Любой сайт начинается со скелета. Скелет говорит, что есть на странице: меню, заголовок, картинка и кнопка. Нажимай на кирпичики — они встанут на страницу!',
      'Every site starts with a skeleton. The skeleton says what’s on the page: a menu, a heading, a picture and a button. Tap the bricks and they’ll drop onto the page!'),
    shelf: L3("G'ishtlar", 'Кирпичики', 'Bricks'),
    bricks: { menu: L3('Menyu', 'Меню', 'Menu'), title: L3('Sarlavha', 'Заголовок', 'Heading'), pic: L3('Rasm', 'Картинка', 'Picture'), btn: L3('Tugma', 'Кнопка', 'Button') },
    ok: L3("Skelet tayyor! Uni HTML deyishadi: u sahifada nima borligini aytadi. Lekin biroz xunuk, to'g'rimi? Oddiy matn, oddiy tugma. Saytga kiyim kerak!",
      'Скелет готов! Его называют HTML: он говорит, что есть на странице. Только немного некрасиво, правда? Простой текст, простая кнопка. Сайту нужна одежда!',
      'The skeleton is ready! It’s called HTML: it says what’s on the page. But it’s a bit plain, right? Plain text, a plain button. The site needs clothes!'),
    ask: L3("G'ishtlarni bosing", 'Нажимай на кирпичики', 'Tap the bricks'),
    askDone: L3('Skelet (HTML) — sahifada nima bor', 'Скелет (HTML) — что есть на странице', 'Skeleton (HTML): what is on the page')
  },
  s3: {
    eyebrow: L3('Kiyim', 'Одежда', 'Clothes'),
    say: L3("Endi saytni kiyintiramiz! Kiyim saytning ranglari, shriftlari va shaklini belgilaydi. Kiyimlardan birini tanlang.",
      'Теперь оденем сайт! Одежда задаёт цвета, шрифты и форму. Выбери наряд.',
      'Now let’s dress the site! Clothes set the colours, fonts and shapes. Pick an outfit.'),
    wardrobe: L3('Kiyimlar', 'Наряды', 'Outfits'),
    outfits: { neon: L3('Neon', 'Неон', 'Neon'), candy: L3('Konfet', 'Конфета', 'Candy'), retro: L3('Retro', 'Ретро', 'Retro'), forest: L3("O'rmon", 'Лес', 'Forest') },
    ok: L3("Voy, butunlay boshqa sayt! Bu kiyim, ya'ni CSS degani: sayt qanday ko'rinishi. Skelet esa o'sha-o'sha qoldi. Xohlasangiz, boshqa kiyimni ham kiyib ko'ring!",
      'Ого, совсем другой сайт! Это одежда, то есть CSS: как выглядит сайт. А скелет остался тем же. Хочешь — примерь и другой наряд!',
      'Whoa, a totally different site! These are the clothes, that is, CSS: how the site looks. The skeleton stayed the same. Try another outfit if you like!'),
    ask: L3('Kiyim tanlang', 'Выбери наряд', 'Pick an outfit'),
    askDone: L3("Kiyim (CSS) — qanday ko'rinadi", 'Одежда (CSS) — как выглядит', 'Clothes (CSS): how it looks')
  },
  s4: {
    eyebrow: L3('Miya', 'Мозг', 'Brain'),
    say: L3("Saytingiz chiroyli bo'ldi! Endi saytdagi tugmani bosib ko'ring.", 'Сайт стал красивым! А теперь нажми на сайте кнопку.', 'Your site looks great! Now tap the button on the site.'),
    dead: L3("Hech narsa bo'lmadi! Tugma bor, lekin u nima qilishni bilmaydi. Unga miya kerak, ya'ni JavaScript degani. Bosilganda nima bo'lsin? Tanlang!",
      'Ничего не произошло! Кнопка есть, но она не знает, что делать. Ей нужен мозг, то есть JavaScript. Что должно случиться при нажатии? Выбери!',
      'Nothing happened! The button is there, but it doesn’t know what to do. It needs a brain, that is, JavaScript. What should happen when you tap? Choose!'),
    chosen: L3('Miya tayyor! Endi tugmani yana bosing.', 'Мозг готов! Теперь снова нажми кнопку.', 'The brain is ready! Now tap the button again.'),
    ok: L3("Ishladi! JavaScript saytning miyasi: tugma bosilganda nima bo'lishini aytadi. Uchala qism tayyor: skelet, kiyim va miya!",
      'Сработало! JavaScript — мозг сайта: он говорит, что произойдёт при нажатии. Все три части готовы: скелет, одежда и мозг!',
      'It works! JavaScript is the site’s brain: it says what happens when you tap. All three parts are ready: skeleton, clothes and brain!'),
    head: L3('Bosilganda', 'При нажатии', 'On tap'),
    acts: { jump: L3('Rasm sakraydi', 'Картинка прыгает', 'Picture jumps'), confetti: L3('Konfetti', 'Конфетти', 'Confetti'), like: L3('Layk', 'Лайк', 'Like') },
    toast: L3('Ishlayapti!', 'Работает!', 'It works!'),
    locked: L3('Oldin tugmani bosing', 'Сначала нажми кнопку', 'Tap the button first'),
    asks: [L3('Saytdagi tugmani bosing', 'Нажми кнопку на сайте', 'Tap the button on the site'), L3("Bosilganda nima bo'lsin?", 'Что будет при нажатии?', 'What happens on tap?'),
      L3('Tugmani yana bosing', 'Снова нажми кнопку', 'Tap the button again')],
    askDone: L3('Miya (JS) — sayt nima qiladi', 'Мозг (JS) — что делает сайт', 'Brain (JS): what the site does')
  },
  s5: {
    eyebrow: L3('Internetga!', 'В интернет!', 'Go live!'),
    say: L3("Sayt tayyor, lekin hozir uni faqat siz ko'ryapsiz. Keling, uni internetga chiqaramiz, shunda do'stlaringiz ham ocha oladi. Tugmani bosing!",
      'Сайт готов, но пока его видишь только ты. Давай выложим его в интернет — тогда его откроют и друзья. Жми кнопку!',
      'The site is ready, but right now only you can see it. Let’s put it on the internet so your friends can open it too. Tap the button!'),
    btn: L3('Internetga chiqarish', 'Выложить в интернет', 'Publish'),
    loading: L3('Yuklanmoqda…', 'Загружаю…', 'Uploading…'),
    live: L3('Internetda', 'В интернете', 'Live'),
    addr: L3('Manzil', 'Адрес', 'Address'),
    views: L3("Ko'rishlar", 'Просмотры', 'Views'),
    likes: L3('Layklar', 'Лайки', 'Likes'),
    comments: [L3("Zo'r chiqibdi!", 'Круто получилось!', 'Looks awesome!'), L3('Menga ham shunday sayt yasab ber!', 'Сделай мне такой же!', 'Make me one too!'),
      L3("Tugmasi zo'r ishlayapti!", 'Кнопка классно работает!', 'The button works great!')],
    ok: L3("Voy! Saytingiz internetda! Endi uni manzil orqali istalgan telefon va kompyuterda ochish mumkin. Qarang, do'stlaringiz allaqachon ko'ryapti!",
      'Ура! Твой сайт в интернете! Теперь его можно открыть по адресу на любом телефоне и компьютере. Смотри, друзья уже заходят!',
      'Yay! Your site is on the internet! Now anyone can open it by its address on any phone or computer. Look, your friends are already visiting!'),
    ask: L3('«Internetga chiqarish»ni bosing', 'Нажми «Выложить в интернет»', 'Tap “Publish”'),
    askDone: L3('Sayt internetda!', 'Сайт в интернете!', 'The site is live!')
  },
  map: {
    eyebrow: L3("Yo'l xaritasi", 'Дорожная карта', 'Roadmap'),
    help: [
      L3('Raketaga va sayyoralarga qarang: har bir sayyora kursning bir qismi.', 'Посмотри на ракету и планеты: каждая планета — часть курса.', 'Look at the rocket and the planets: each planet is a part of the course.'),
      L3("Oldin sayt yasashni o'rganamiz, keyin tezroq usullarni, oxirida esa haqiqiy dasturlashni.", 'Сначала учимся делать сайты, потом — быстрые способы, а в конце — настоящее программирование.', 'First we learn to make sites, then faster ways, and at the end real programming.'),
      L3("O'yinga o'xshaydi: har bir darajadan o'tib, yangi kuch olasiz.", 'Как в игре: проходишь уровень — получаешь новую силу.', 'It’s like a game: clear a level and you get a new power.')
    ],
    say: L3("Bugun siz o'z saytingizni yasadingiz: skelet, kiyim va miya. Bu katta sayohatning boshlanishi! Mana sizning yo'lingiz.",
      'Сегодня у тебя получился свой сайт: скелет, одежда и мозг. Это начало большого путешествия! Вот твой путь.',
      'Today you made your own site: skeleton, clothes and brain. This is the start of a big journey! Here’s your path.'),
    says: [
      L3("Oldin sayt yasashni o'rganamiz: HTML, CSS va sun'iy intellekt bilan.", 'Сначала учимся делать сайты: HTML, CSS и вместе с ИИ.', 'First we learn to make sites: HTML, CSS and with AI.'),
      L3('Keyin tezroq yasaymiz: Bootstrap, Tilda va Blockly dasturlash.', 'Потом делаем быстрее: Bootstrap, Tilda и программирование на Blockly.', 'Then we build faster: Bootstrap, Tilda and Blockly coding.'),
      L3("Oxirida haqiqiy dasturchi bo'lamiz: JavaScript, Git va React.", 'А в конце — как настоящий программист: JavaScript, Git и React.', 'And at the end, like a real developer: JavaScript, Git and React.')
    ],
    done: L3("Har bir sayyorada yangi kuch olasiz. Birinchi qadam esa bugun qo'yildi!", 'На каждой планете — новая сила. А первый шаг сделан уже сегодня!', 'On every planet you’ll gain a new power. And the first step was taken today!'),
    rows: [L3('Sayt yasash', 'Делаем сайты', 'Making sites'), L3('Tezroq', 'Быстрее', 'Faster'), L3('Dasturchi', 'Программист', 'Developer')],
    names: { ai: L3("Sun'iy intellekt", 'ИИ', 'AI'), git: 'Git / GitHub' },
    stops: {
      html: L3('sahifa skeleti', 'скелет страницы', 'page skeleton'),
      css: L3('chiroyli kiyim', 'красивая одежда', 'stylish clothes'),
      ai: L3("so'zlardan sayt", 'сайт по словам', 'sites from words'),
      bootstrap: L3('tayyor bloklar', 'готовые блоки', 'ready-made blocks'),
      tilda: L3('kodsiz sayt', 'сайт без кода', 'sites without code'),
      blockly: L3('bloklar bilan dasturlash', 'программирование блоками', 'coding with blocks'),
      js: L3('saytning miyasi', 'мозг сайта', 'the site’s brain'),
      git: L3('kodni saqlash va ulashish', 'хранить код и делиться', 'save and share code'),
      react: L3('zamonaviy ilovalar', 'современные приложения', 'modern apps')
    },
    here: L3('Siz shu yerdasiz', 'Ты здесь', 'You are here'),
    goal: L3('Haqiqiy dasturchi!', 'Настоящий программист!', 'A real developer!'),
    tap: L3("Sayyorani bosing: u haqida bilib oling", 'Нажми на планету — узнай, что там', 'Tap a planet to see what’s there'),
    asks: [L3("Qarang: sizning yo'lingiz", 'Смотри: твой путь', 'Watch: your path'), L3('Qarang: sayt yasash', 'Смотри: делаем сайты', 'Watch: making sites'),
      L3('Qarang: tezroq usullar', 'Смотри: быстрые способы', 'Watch: faster ways'), L3('Qarang: dasturlash', 'Смотри: программирование', 'Watch: programming')],
    askDone: L3("Yo'l oxirida — haqiqiy dasturchi", 'В конце пути — настоящий программист', 'At the end of the path: a real developer')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Xo'sh, ishondingizmi? Sayt yasash sehr emas. Siz uni bir necha daqiqada yasadingiz!",
        'Ну что, веришь теперь? Сайт — не волшебство. У тебя он получился всего за несколько минут!',
        'So, do you believe me now? A site isn’t magic. You made one in just a few minutes!'), k: 'time' },
      { text: L3("Skelet, ya'ni HTML degani: sahifada nima bor.", 'Скелет, то есть HTML: что есть на странице.', 'The skeleton, that is HTML: what’s on the page.'), k: 'html' },
      { text: L3("Kiyim, ya'ni CSS degani: sayt qanday ko'rinadi.", 'Одежда, то есть CSS: как выглядит сайт.', 'The clothes, that is CSS: how the site looks.'), k: 'css' },
      { text: L3("Miya, ya'ni JavaScript degani: sayt nima qiladi.", 'Мозг, то есть JavaScript: что делает сайт.', 'The brain, that is JavaScript: what the site does.'), k: 'js' },
      { text: L3("Siz mavzu tanladingiz, skelet qurdingiz, saytni kiyintirdingiz, unga miya berdingiz va internetga chiqardingiz. Barakalla!",
        'Тема, скелет, одежда, мозг и даже интернет — всё получилось. Молодец!',
        'You picked a topic, built a skeleton, dressed the site, gave it a brain and put it online. Well done!'), k: 'own' }
    ],
    time: L3('Sayt yasaldi', 'Сайт готов за', 'Built in'),
    under5: L3('5 daqiqadan kam!', 'Меньше 5 минут!', 'Under 5 minutes!'),
    ready: L3('Sayt tayyor!', 'Сайт готов!', 'Site ready!'),
    min: L3('daqiqa', 'мин', 'min'),
    roles: {
      html: L3('skelet: sahifada nima bor', 'скелет: что есть на странице', 'the skeleton: what’s on the page'),
      css: L3("kiyim: qanday ko'rinadi", 'одежда: как выглядит', 'the clothes: how it looks'),
      js: L3('miya: nima qiladi', 'мозг: что делает', 'the brain: what it does')
    },
    ask: L3("Saytingizdagi tugmani bosib ko'ring", 'Нажми кнопку на своём сайте', 'Tap the button on your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, picked: 1, ok: 1, dead: 1, chosen: 1 });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:kirish2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:kirish2.css@*/
`;
