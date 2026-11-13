// =============================================================================
// ТЕСТЫ К УРОКУ 2 МОДУЛЯ «ИИ» «Для кого создаём?» (13.11.2026) — 5 вопросов, по файлу на вопрос.
// Проверяем: «Kim uchun?» — возраст и кто они, а не «hamma uchun»; по сайту понять, для кого он; интересы аудитории;
// две аудитории (кто выбирает и кто решает); какая фраза идёт в «Kim uchun?», а не в «Nima?» / «Nega?».
// Апостроф в узбекском — только ASCII «'». Верные ответы стоят на разных местах.
// =============================================================================
const SLUG = 'dlya-kogo';
const QS = [
  { id: 'ai-02t1', target: 'ai-02', tag: 'kim-uchun', correct: 1,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T('Suzish kursi sayti', 'Сайт курса плавания', 'A swimming course site') }, { q: 1, t: T('bolalar yozilsin', 'чтобы дети записывались', 'get kids to sign up') }, { q: 2, t: null }]} />; },
    uz: { ctx: "Sun'iy intellektga sayt kimlar uchun ekanini aytamiz.", q: "«Kim uchun?» qatoriga qaysi biri aniqroq?", opts: ['hamma uchun', '8–10 yoshli bolalar', 'yaxshi odamlar', "ko'p odam"],
      ok: "Yoshi ham, kimligi ham aytilgan. Sun'iy intellekt saytni aynan shu bolalarga moslaydi.", hint: "Qaysi javobda yosh va kimligi bor? «Hamma uchun» degani hech kim uchun degani.", alt: "«Kim uchun?» qatori bo'sh prompt" },
    ru: { ctx: 'Говорим ИИ, для кого сайт.', q: 'Что точнее подходит в строку «Для кого?»?', opts: ['для всех', 'дети 8–10 лет', 'хорошие люди', 'много людей'],
      ok: 'Названы и возраст, и кто они. ИИ подстроит сайт именно под этих детей.', hint: 'В каком ответе есть возраст и кто они? «Для всех» — значит ни для кого.', alt: 'Промпт с пустой строкой «Для кого?»' },
    en: { ctx: 'We tell the AI who the site is for.', q: 'Which fits the “For whom?” line best?', opts: ['for everyone', 'kids aged 8–10', 'nice people', 'lots of people'],
      ok: 'It names both the age and who they are. The AI will fit the site to exactly these kids.', hint: 'Which answer has an age and says who they are? “For everyone” means for no one.', alt: 'A prompt with an empty “For whom?” line' } },

  { id: 'ai-02t2', target: 'ai-02', tag: 'sayt-kimga', correct: 2,
    // Сайт, как его делает ИИ урока 2 для «7–8 yoshli bolalar»: яркий, крупный, Comic Sans, интересы — первыми карточками.
    vis: (L) => { const T = aqL(L); return <AqSite site={{
      title: T('Robotlar shousi', 'Шоу роботов', 'Robot show'), em: '🤖', c: '#F97316', c2: '#7C2D12', bg: '#FFEDD5',
      font: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive', radius: 26,
      heroBg: 'linear-gradient(135deg, #F97316, #EC4899 55%, #FACC15)',
      nav: [T("O'yinlar", 'Игры', 'Games'), T("Sovg'alar", 'Подарки', 'Gifts'), T('Aloqa', 'Контакты', 'Contact')],
      badge: T('7–8 yosh uchun', 'Для детей 7–8 лет', 'For kids aged 7–8'),
      sub: T("Robotlar bilan o'ynaymiz va sovg'a yutamiz!", 'Играем с роботами и выигрываем подарки!', 'Play with robots and win gifts!'),
      cta: T('Kelaman!', 'Я приду!', 'I’m coming!'),
      cards: [{ ic: '🎮', h: T("O'yinlar", 'Игры', 'Games'), p: T("Robotlar bilan o'yinlar", 'Игры с роботами', 'Games with robots') },
        { ic: '🎁', h: T("Sovg'alar", 'Подарки', 'Gifts'), p: T("Har bir bolaga sovg'a", 'Подарок каждому', 'A gift for every kid') },
        { ic: '🦸', h: T('Komikslar', 'Комиксы', 'Comics'), p: T('Robot qahramonlar', 'Роботы-герои', 'Robot heroes') }],
      foot: T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.') }} />; },
    uz: { ctx: "Sun'iy intellekt shu saytni yaratdi.", q: 'Bu sayt kim uchun yaratilgan?', opts: ['Keksalar uchun', 'Ota-onalar uchun', 'Kichik bolalar uchun', "O'qituvchilar uchun"],
      ok: "Plashkada «7–8 yosh uchun», kartochkalarda o'yinlar va sovg'alar. Sayt yorqin va katta: u kichik bolalarga moslangan.", hint: "Banner ustidagi plashkani va kartochkalarni o'qing. Ular kimga qiziq?", alt: "Yorqin sayt: «7–8 yosh uchun», o'yinlar va sovg'alar" },
    ru: { ctx: 'ИИ сделал такой сайт.', q: 'Для кого сделан этот сайт?', opts: ['Для пожилых', 'Для родителей', 'Для маленьких детей', 'Для учителей'],
      ok: 'На плашке «Для детей 7–8 лет», в карточках игры и подарки. Сайт яркий и крупный — он подстроен под маленьких детей.', hint: 'Прочитай плашку над заголовком и карточки. Кому они интересны?', alt: 'Яркий сайт: «Для детей 7–8 лет», игры и подарки' },
    en: { ctx: 'The AI made this site.', q: 'Who was this site made for?', opts: ['Elderly people', 'Parents', 'Little kids', 'Teachers'],
      ok: 'The badge says “For kids aged 7–8”, and the cards are games and gifts. The site is bright and big: it is made for little kids.', hint: 'Read the badge above the title and the cards. Who would find them interesting?', alt: 'A bright site: “For kids aged 7–8”, games and gifts' } },

  { id: 'ai-02t3', target: 'ai-02', tag: 'qiziqish', correct: 3,
    vis: (L) => { const T = aqL(L); return <AqPrompt L={L} rows={[{ q: 0, t: T("Hayvonot bog'i bayrami sayti", 'Сайт праздника в зоопарке', 'A zoo festival site') }, { q: 1, t: T('oilalar kelsin', 'чтобы семьи пришли', 'get families to come') }, { q: 2, t: null }]} />; },
    uz: { ctx: "Bolalar hayvonlar va o'yinlarni yaxshi ko'radi. Sayt shuni ko'rsatsin.", q: "«Kim uchun?» qatorini qanday yozamiz?", opts: ["hamma uchun, qiziqarli bo'lsin", "bolalar uchun, hammasi chiroyli va qiziqarli bo'lsin", "hayvonot bog'i bayrami sayti, oilalar uchun", "6–8 yoshli bolalar, ular hayvonlar va o'yinlarni yaxshi ko'radi"],
      ok: "Yoshi ham, qiziqishi ham aytilgan. Sun'iy intellekt «Hayvonlar» va «O'yinlar» kartochkalarini birinchi qo'yadi.", hint: "Bu qatorda ikki narsa bo'lsin: kimlar va ular nimani yaxshi ko'radi.", alt: "«Kim uchun?» qatori bo'sh prompt" },
    ru: { ctx: 'Дети любят животных и игры. Пусть сайт это покажет.', q: 'Как написать строку «Для кого?»?', opts: ['для всех, чтобы было интересно', 'для детей, чтобы всё было красиво и интересно', 'сайт праздника в зоопарке, для семей', 'дети 6–8 лет, они любят животных и игры'],
      ok: 'Названы и возраст, и интересы. ИИ поставит карточки «Животные» и «Игры» первыми.', hint: 'В этой строке должны быть две вещи: кто они и что они любят.', alt: 'Промпт с пустой строкой «Для кого?»' },
    en: { ctx: 'Kids love animals and games. Let the site show it.', q: 'How should we write the “For whom?” line?', opts: ['for everyone, make it fun', 'for kids, make everything pretty and fun', 'a zoo festival site, for families', 'kids aged 6–8, they love animals and games'],
      ok: 'It names both the age and the interests. The AI will put the “Animals” and “Games” cards first.', hint: 'This line needs two things: who they are and what they love.', alt: 'A prompt with an empty “For whom?” line' } },

  { id: 'ai-02t4', target: 'ai-02', tag: 'ikki-auditoriya', correct: 0,
    vis: (L) => { const T = aqL(L); return <AqMsg who={T('Mijoz', 'Клиент', 'Client')} text={T("«Suzish kursimizga bolalar yozilsin. Lekin pulni ota-onalar to'laydi va xavfsizlik haqida so'raydi.»", '«Хотим, чтобы на курс плавания записывались дети. Но платят родители, и они спрашивают про безопасность».', '“We want kids to sign up for our swimming course. But parents pay, and they ask about safety.”')} />; },
    uz: { ctx: "Mijozning xabarini o'qing.", q: "«Kim uchun?» qatoriga nima yozamiz?", opts: ['bolalar va ularning ota-onalari', 'bolalar', 'ota-onalar', 'hamma uchun'],
      ok: "Bolalar tanlaydi, ota-onalar hal qiladi: ikkalasi ham yoziladi. Shunda saytda ota-onalar uchun bo'lim ham chiqadi.", hint: "Xabarda ikki xil odam bor: kim yoziladi va kim to'laydi. Ikkalasini ham yozing.", alt: 'Mijozning xabari' },
    ru: { ctx: 'Прочитай сообщение клиента.', q: 'Что написать в строку «Для кого?»?', opts: ['дети и их родители', 'дети', 'родители', 'для всех'],
      ok: 'Дети выбирают, родители решают — пишем обоих. Тогда на сайте появится и раздел для родителей.', hint: 'В сообщении два разных человека: кто записывается и кто платит. Напиши обоих.', alt: 'Сообщение клиента' },
    en: { ctx: 'Read the client’s message.', q: 'What goes in the “For whom?” line?', opts: ['kids and their parents', 'kids', 'parents', 'for everyone'],
      ok: 'Kids choose, parents decide: write both. Then the site also gets a section for parents.', hint: 'The message has two kinds of people: who signs up and who pays. Write both.', alt: 'The client’s message' } },

  { id: 'ai-02t5', target: 'ai-02', tag: 'qator', correct: 2,
    vis: (L) => <AqPrompt L={L} rows={[{ q: 0, t: null }, { q: 1, t: null }, { q: 2, t: null }]} />,
    uz: { ctx: "Robot to'garagi uchun prompt yozyapmiz.", q: "«12–14 yoshli o'quvchilar, robotlarni yaxshi ko'radi» qaysi qatorga yoziladi?", opts: ['«Nima?»', '«Nega?»', '«Kim uchun?»', 'Hech qaysi qatorga'],
      ok: "Bu gap kimlar uchun ekanini va ular nimani yaxshi ko'rishini aytadi. Bu «Kim uchun?» qatori.", hint: "«Nima?» — qanday sayt, «Nega?» — odamlar nima qilsin. Bu gap esa odamlarning o'zi haqida.", alt: "Uch qatorli bo'sh prompt" },
    ru: { ctx: 'Пишем промпт для кружка роботов.', q: 'В какую строку пишем «ученики 12–14 лет, любят роботов»?', opts: ['«Что?»', '«Зачем?»', '«Для кого?»', 'Ни в какую'],
      ok: 'Эта фраза говорит, для кого сайт и что эти люди любят. Это строка «Для кого?».', hint: '«Что?» — какой сайт, «Зачем?» — что должны сделать люди. А эта фраза про самих людей.', alt: 'Пустой промпт из трёх строк' },
    en: { ctx: 'We are writing a prompt for a robot club.', q: 'Which line does “students aged 12–14 who love robots” go in?', opts: ['“What?”', '“Why?”', '“For whom?”', 'None of them'],
      ok: 'This phrase says who the site is for and what they love. That is the “For whom?” line.', hint: '“What?” is what site, “Why?” is what people should do. This phrase is about the people themselves.', alt: 'An empty three-line prompt' } }
];
