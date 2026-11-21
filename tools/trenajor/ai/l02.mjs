// =============================================================================
// БАНК ТРЕНАЖЁРА «ИИ» · урок 2 «Для кого создаём?» — 18 вопросов с выбором (6 easy, 8 medium, 4 hard).
// Проверяем: «Kim uchun?» — аудитория: возраст и кто они, а не «hamma uchun»; интересы аудитории становятся карточками;
// аудитория меняет облик, слова и разделы сайта (дети — ярко и крупно, подростки — тёмный и современный, родители —
// спокойно, безопасность / цены / расписание, пожилые — крупно, телефон на виду); две аудитории — кто выбирает и кто решает;
// маленький ребёнок сайт не читает — аудитория родители; без «Kim uchun?» ИИ гадает («Taxmin»); по сайту понять, для кого он;
// какая фраза в какую строку. Промпт — «Nima?», «Nega?», «Kim uchun?».
// Словарь: auditoriya, qiziqish, ota-onalar, buvi va bobolar, o'smirlar, taxmin.
// Апостроф в узбекском — только ASCII «'». Ситуации тестов модуля (tools/aitest/l02.jsx) не повторяются.
// Формат — tools/trenajor/ai/FORMAT.md.
// =============================================================================
const T = (uz, ru, en) => ({ uz, ru, en });
const FOOT = T('Barcha huquqlar himoyalangan.', 'Все права защищены.', 'All rights reserved.');
const WHO = { t: T('Kim uchun?', 'Для кого?', 'For whom?'), c: '#0D9488' };
const GUESS = { t: T('Taxmin', 'Догадка', 'Guess'), c: '#64748B' };
const KIDS_FONT = '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive';

export default [
  {
    id: 'ai_l02_q01',
    difficulty: 'easy',
    tags: ['kim-uchun'],
    sort: false,
    vis: null,
    uz: {
      ctx: "Promptga uchinchi savol qo'shildi: «Kim uchun?».",
      q: 'Bu qatorga nima yoziladi?',
      opts: ["Saytni kimlar ko'rishi: yoshi va kimligi", "Sayt qanday narsa ekani: turnirmi, klubmi", "Sayt mehmondan nima so'rashi", 'Saytni kim va qachon yaratgani'],
      why: "«Kim uchun?» — auditoriya, ya'ni saytni ko'radigan odamlar degani. Sun'iy intellekt shunga qarab ko'rinish va so'zlarni tanlaydi.",
    },
    ru: {
      ctx: 'В промпте появился третий вопрос: «Для кого?».',
      q: 'Что пишут в эту строку?',
      opts: ['Кто будет смотреть сайт: возраст и кто они', 'Что это за вещь: турнир или клуб', 'Что сайт просит сделать гостя', 'Кто и когда сделал этот сайт'],
      why: '«Для кого?» — аудитория, то есть люди, которые будут смотреть сайт. По ней ИИ выбирает вид и слова.',
    },
    en: {
      ctx: 'A third question joined the prompt: “For whom?”.',
      q: 'What goes in this line?',
      opts: ['Who views the site: age and who they are', 'What kind of thing it is: a contest or a club', 'What the site asks visitors to do', 'Who made the site and when'],
      why: '“For whom?” is the audience, that is, the people who will look at the site. The AI picks the look and the words by it.',
    },
  },
  {
    id: 'ai_l02_q02',
    difficulty: 'easy',
    tags: ['kim-uchun', 'hamma'],
    sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Batut parki sayti', 'Сайт батутного парка', 'A trampoline park site') },
        { q: 1, t: T('odamlar vaqt band qilsin', 'чтобы люди бронировали время', 'get people to book a time') },
        { q: 2, t: T('hamma uchun', 'для всех', 'for everyone'), hl: true },
      ],
    } },
    uz: {
      ctx: '«Kim uchun?» qatoriga «hamma uchun» deb yozildi.',
      q: '«Hamma uchun» nega yaxshi emas?',
      opts: ["Sun'iy intellekt saytni hech kimga moslamaydi", "Sayt juda uzun va og'ir bo'lib qoladi", "Sun'iy intellekt bu qatorni o'chirib tashlaydi", 'Saytga faqat kattalar kira oladi'],
      why: "«Hamma uchun» degani hech kim uchun degani: sun'iy intellekt saytni na bolalarga, na kattalarga moslaydi. Yoshi va kimligi kerak.",
    },
    ru: {
      ctx: 'В строку «Для кого?» написали «для всех».',
      q: 'Чем плоха строка «для всех»?',
      opts: ['ИИ ни под кого не подстроит сайт', 'Сайт станет слишком длинным', 'ИИ просто сотрёт эту строку', 'На сайт смогут зайти только взрослые'],
      why: '«Для всех» — значит ни для кого: ИИ не подстроит сайт ни под детей, ни под взрослых. Нужны возраст и кто они.',
    },
    en: {
      ctx: 'Someone wrote “for everyone” in the “For whom?” line.',
      q: 'What’s wrong with “for everyone”?',
      opts: ['The AI won’t tailor the site to anyone', 'The site gets far too long', 'The AI just deletes this line', 'Only adults can open the site'],
      why: '“For everyone” means for no one: the AI won’t tailor the site to kids or to adults. It needs an age and who they are.',
    },
  },
  {
    id: 'ai_l02_q03',
    difficulty: 'easy',
    tags: ['sayt-kimga'],
    sort: false,
    vis: { ai: {
      site: {
        title: T('Mahalla dorixonasi', 'Аптека нашего района', 'Our local pharmacy'), em: '💊', c: '#0F766E', c2: '#134E4A', bg: '#CCFBF1',
        nav: [T('Dorilar', 'Лекарства', 'Medicines'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contacts')],
        badge: T('Keksalar uchun', 'Для старшего поколения', 'For seniors'),
        sub: T("Hammasi oddiy va tushunarli. Savol bo'lsa, qo'ng'iroq qiling.", 'Всё просто и понятно. Есть вопросы — позвоните.', 'Simple and clear. Questions? Just give us a call.'),
        cta: T("Qo'ng'iroq qilish", 'Позвонить', 'Call us'),
        info: [{ t: '📞 71 200-00-00' }],
        big: true,   // как в уроке 2 для пожилых: крупный шрифт, меню спрятано
        noFoot: true,
      },
    } },
    uz: {
      ctx: "Sun'iy intellekt dorixona uchun shu saytni yaratdi.",
      q: '«Kim uchun?» qatorida nima yozilgan bo\'lishi mumkin?',
      opts: ['mahalladagi buvi va bobolar', '7–8 yoshli kichik bolalar', "12–14 yoshli o'smirlar", 'hamma uchun, hammaga yoqsin'],
      why: "Plashkada «Keksalar uchun», gaplar oddiy, telefon raqami ko'rinib turibdi. Sun'iy intellekt saytni buvi va bobolarga moslagan.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт для аптеки.',
      q: 'Что могло быть написано в строке «Для кого?»?',
      opts: ['бабушки и дедушки нашего района', 'маленькие дети 7–8 лет', 'подростки 12–14 лет', 'для всех, чтобы всем понравилось'],
      why: 'На плашке «Для старшего поколения», фразы простые, телефон на виду. ИИ подстроил сайт под бабушек и дедушек.',
    },
    en: {
      ctx: 'The AI made this site for a pharmacy.',
      q: 'What could the “For whom?” line say?',
      opts: ['grandparents in our neighbourhood', 'little kids aged 7–8', 'teens aged 12–14', 'everyone, so everyone likes it'],
      why: 'The badge says “For seniors”, the words are simple and the phone number is in view. The AI tailored the site to grandparents.',
    },
  },
  {
    id: 'ai_l02_q04',
    difficulty: 'hard',
    tags: ['sayt-kimga', 'qiziqish'],
    sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Kibersport turniri sayti', 'Сайт киберспортивного турнира', 'An esports tournament site') },
        { q: 1, t: T('jamoalar turnirga yozilsin', 'чтобы команды записывались на турнир', 'get teams to sign up') },
        { q: 2, t: null },
      ],
      site: {
        title: T('Kibersport kubogi', 'Киберкубок', 'Esports cup'), em: '🎮', c: '#8B5CF6', c2: '#22D3EE', bg: '#1E293B', dark: true,
        heroBg: 'linear-gradient(135deg, #0F172A, #4C1D95)', btn: '#22D3EE', btnFg: '#0F172A',
        nav: [T('Jadval', 'Расписание', 'Schedule'), T('Jamoalar', 'Команды', 'Teams'), T('Sovrinlar', 'Призы', 'Prizes')],
        badge: T("O'smirlar uchun", 'Для подростков', 'For teens'),
        sub: T("Do'stlaringni chaqir, birga zo'rroq! 🔥", 'Зови друзей — вместе круче! 🔥', 'Bring your friends, it’s better together! 🔥'),
        cta: T('Jamoani yozish', 'Записать команду', 'Sign up a team'),
        cards: [
          { ic: '🕹️', h: T("O'yinlar", 'Игры', 'Games'), p: T("Eng mashhur o'yinlar", 'Самые популярные игры', 'The most popular games') },
          { ic: '📺', h: T('Strim', 'Стрим', 'Stream'), p: T('Finalni jonli tomosha qil', 'Смотри финал вживую', 'Watch the final live') },
          { ic: '🏆', h: T('Sovrinlar', 'Призы', 'Prizes'), p: T("Eng zo'r jamoalarga", 'Лучшим командам', 'For the best teams') },
        ],
        foot: FOOT,
      },
    } },
    uz: {
      ctx: "«Kim uchun?» qatori yashirilgan. Sun'iy intellekt shu saytni yaratdi.",
      q: 'Qaysi «Kim uchun?» qatori shu saytni bergan?',
      opts: ["13–15 yoshli o'smirlar, o'yinni yaxshi ko'radi", "7–8 yoshli bolalar, multfilmni yaxshi ko'radi", "o'yinchilarning ota-onalari", 'mahalladagi buvi va bobolar'],
      why: "Sayt qorong'i va zamonaviy, plashkada «O'smirlar uchun», kartochkalarda o'yinlar va strim. Bu o'yinni yaxshi ko'radigan o'smirlar uchun sayt.",
    },
    ru: {
      ctx: 'Строка «Для кого?» скрыта. ИИ сделал такой сайт.',
      q: 'Какая строка «Для кого?» дала этот сайт?',
      opts: ['подростки 13–15 лет, любят игры', 'дети 7–8 лет, любят мультфильмы', 'родители игроков', 'бабушки и дедушки нашего района'],
      why: 'Сайт тёмный и современный, на плашке «Для подростков», в карточках игры и стрим. Это сайт для подростков, которые любят игры.',
    },
    en: {
      ctx: 'The “For whom?” line is hidden. The AI made this site.',
      q: 'Which “For whom?” line gave this site?',
      opts: ['teens aged 13–15 who love games', 'kids aged 7–8 who love cartoons', 'the players’ parents', 'grandparents in our neighbourhood'],
      why: 'The site is dark and modern, the badge says “For teens”, the cards are games and streams. It’s a site for teens who love games.',
    },
  },
  {
    id: 'ai_l02_q05',
    difficulty: 'medium',
    tags: ['ikki-auditoriya'],
    sort: false,
    vis: { ai: {
      site: {
        title: T('Ingliz tili kursi', 'Курс английского', 'English course'), em: '📘', c: '#2563EB', c2: '#1E3A8A', bg: '#DBEAFE',
        font: KIDS_FONT, radius: 24, heroBg: 'linear-gradient(135deg, #3B82F6, #EC4899 55%, #FACC15)',
        nav: [T("O'yinlar", 'Игры', 'Games'), T('Darslar', 'Уроки', 'Lessons'), T('Aloqa', 'Контакты', 'Contacts')],
        badge: T('9–11 yosh uchun', 'Для детей 9–11 лет', 'For kids aged 9–11'),
        sub: T("Ingliz tilini o'ynab o'rganamiz!", 'Учим английский играя!', 'Learn English through play!'),
        cta: T('Yozilish', 'Записаться', 'Sign up'),
        blocks: [{
          h: T('Ota-onalar uchun', 'Для родителей', 'For parents'),
          items: [
            { ic: '🛡️', t: T('Xavfsizlik', 'Безопасность', 'Safety') },
            { ic: '💳', t: T('Narx', 'Цена', 'Price') },
            { ic: '🗓️', t: T('Jadval', 'Расписание', 'Schedule') },
          ],
        }],
        noFoot: true,
      },
      focus: '.blk',
    } },
    uz: {
      ctx: "Sun'iy intellekt ingliz tili kursi uchun shu saytni yaratdi.",
      q: "Saytda nega «Ota-onalar uchun» bo'limi chiqdi?",
      opts: ['«Kim uchun?» da ota-onalar ham yozilgan', "«Nega?» da «ota-onalar to'lasin» deyilgan", "Sun'iy intellekt har saytga shuni qo'yadi", '«Nima?» da «kurs sayti» deyilgan'],
      why: "Tepasi yorqin — bolalar uchun, pastida ota-onalar uchun bo'lim. Demak, «Kim uchun?» qatorida bolalardan keyin ularning ota-onalari ham yozilgan.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт для курса английского.',
      q: 'Почему на сайте появился раздел «Для родителей»?',
      opts: ['В «Для кого?» записаны и родители', 'В «Зачем?» сказано «чтобы платили родители»', 'ИИ ставит такой раздел на любой сайт', 'В «Что?» сказано «сайт курса»'],
      why: 'Верх яркий — для детей, внизу раздел для родителей. Значит, в строке «Для кого?» после детей записаны и их родители.',
    },
    en: {
      ctx: 'The AI made this site for an English course.',
      q: 'Why did a “For parents” section appear on the site?',
      opts: ['“For whom?” also names the parents', '“Why?” says “get parents to pay”', 'The AI puts it on every site', '“What?” says “a course site”'],
      why: 'The top is bright, for kids, and below is a section for parents. So the “For whom?” line names the kids and then their parents too.',
    },
  },
  {
    id: 'ai_l02_q06',
    difficulty: 'medium',
    tags: ['qiziqish'],
    sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Shahar bayrami sayti', 'Сайт городского праздника', 'A city festival site') },
        { q: 1, t: T('bolalar bayramga kelsin', 'чтобы дети пришли на праздник', 'get kids to come to the festival') },
        { q: 2, t: T("8–10 yoshli bolalar, musiqa va rasmni yaxshi ko'radi", 'дети 8–10 лет, любят музыку и рисование', 'kids aged 8–10 who love music and drawing'), hl: true },
      ],
    } },
    uz: {
      ctx: "Sun'iy intellekt sayt yaratyapti: tepada banner, keyin kartochkalar.",
      q: "Sun'iy intellekt qaysi kartochkalarni birinchi qo'yadi?",
      opts: ['«Musiqa» va «Rasm chizish»', '«Narxlar» va «Jadval»', '«Tarix» va «Faktlar»', '«Xavfsizlik» va «Aloqa»'],
      why: "Auditoriya yaxshi ko'radigan narsa saytga kartochka bo'lib tushadi. Bu bolalar musiqa va rasmni yaxshi ko'radi — shular birinchi chiqadi.",
    },
    ru: {
      ctx: 'ИИ делает сайт: вверху баннер, потом карточки.',
      q: 'Какие карточки ИИ поставит первыми?',
      opts: ['«Музыка» и «Рисование»', '«Цены» и «Расписание»', '«История» и «Факты»', '«Безопасность» и «Контакты»'],
      why: 'То, что любит аудитория, попадает на сайт карточками. Эти дети любят музыку и рисование — они и будут первыми.',
    },
    en: {
      ctx: 'The AI is making a site: a banner on top, then cards.',
      q: 'Which cards will the AI put first?',
      opts: ['“Music” and “Drawing”', '“Prices” and “Schedule”', '“History” and “Facts”', '“Safety” and “Contact”'],
      why: 'What the audience loves lands on the site as cards. These kids love music and drawing, so those come first.',
    },
  },
  {
    id: 'ai_l02_q07',
    difficulty: 'hard',
    tags: ['ikki-auditoriya', 'mijoz'],
    sort: false,
    vis: { ai: {
      msg: { who: T('Mijoz', 'Клиент', 'Client'), text: T("«Bog'chamizga 3–5 yoshli bolalarni qabul qilamiz. Saytni ota-onalar o'qiydi va bolani o'zlari yozdiradi.»", '«В наш детский сад принимаем детей 3–5 лет. Сайт читают родители, и они сами записывают ребёнка».', '“Our kindergarten takes kids aged 3–5. Parents read the site and sign their child up themselves.”') },
      prompt: [
        { q: 0, t: T("Bolalar bog'chasi sayti", 'Сайт детского сада', 'A kindergarten site') },
        { q: 1, t: T('ota-onalar bolani yozdirsin', 'чтобы родители записывали ребёнка', 'get parents to sign their child up') },
        { q: 2, t: null },
      ],
    } },
    uz: {
      ctx: "Mijozning xabarini o'qing.",
      q: '«Kim uchun?» qatoriga nima yozamiz?',
      opts: ['3–5 yoshli bolalarning ota-onalari', '3–5 yoshli kichkintoylar', 'hamma uchun, bolalarga ham', "bog'chaning tarbiyachilari"],
      why: "Uch yoshli bola saytni o'qimaydi: saytni ota-onalar ko'radi va qaror qiladi. Shuning uchun asosiy auditoriya — bolalarning ota-onalari.",
    },
    ru: {
      ctx: 'Прочитай сообщение клиента.',
      q: 'Что написать в строку «Для кого?»?',
      opts: ['родители детей 3–5 лет', 'малыши 3–5 лет', 'для всех, и для детей тоже', 'воспитатели детского сада'],
      why: 'Трёхлетний ребёнок сайт не читает: его смотрят и решают родители. Поэтому главная аудитория — родители детей.',
    },
    en: {
      ctx: 'Read the client’s message.',
      q: 'What goes in the “For whom?” line?',
      opts: ['parents of kids aged 3–5', 'little kids aged 3–5', 'everyone, kids too', 'the kindergarten teachers'],
      why: 'A three-year-old doesn’t read the site: parents look at it and decide. So the main audience is the kids’ parents.',
    },
  },
  {
    id: 'ai_l02_q08',
    difficulty: 'easy',
    tags: ['kim-uchun', 'qator'],
    sort: false,
    vis: null,
    uz: {
      ctx: 'Shaxmat maktabi uchun prompt yozyapmiz.',
      q: '«Kim uchun?» qatoriga qaysi gap yoziladi?',
      opts: ["shaxmatni yaxshi ko'radigan 10 yoshli bolalar", 'Shaxmat maktabi sayti', 'bolalar shaxmat darslariga yozilsin', "sayt jiddiy va chiroyli bo'lsin"],
      why: "Bu gap odamlarning o'zi haqida: yoshi va nimani yaxshi ko'rishi. «Shaxmat maktabi sayti» — «Nima?», «yozilsin» — «Nega?».",
    },
    ru: {
      ctx: 'Пишем промпт для шахматной школы.',
      q: 'Какая фраза идёт в строку «Для кого?»?',
      opts: ['дети 10 лет, которые любят шахматы', 'Сайт шахматной школы', 'чтобы дети записывались на занятия', 'чтобы сайт был серьёзным и красивым'],
      why: 'Эта фраза о самих людях: сколько им лет и что они любят. «Сайт шахматной школы» — это «Что?», «записывались» — «Зачем?».',
    },
    en: {
      ctx: 'We are writing a prompt for a chess school.',
      q: 'Which phrase goes in the “For whom?” line?',
      opts: ['10-year-old kids who love chess', 'A chess school site', 'get kids to sign up for classes', 'make the site serious and pretty'],
      why: 'This phrase is about the people: their age and what they love. “A chess school site” is “What?”, “sign up” is “Why?”.',
    },
  },
  {
    id: 'ai_l02_q09',
    difficulty: 'medium',
    tags: ['qiziqish'],
    sort: false,
    vis: null,
    uz: {
      ctx: "«Kim uchun?» qatoriga yoshidan keyin qiziqishni ham qo'shdik.",
      q: "Saytda nima o'zgaradi?",
      opts: ["Ular yaxshi ko'radigan narsa kartochka bo'ladi", "Saytning nomi butunlay boshqa bo'ladi", "Saytga yangi maqsad va tugma qo'shiladi", "Hech narsa: qiziqish saytga ta'sir qilmaydi"],
      why: "Qiziqish — auditoriya yaxshi ko'radigan narsa: u saytda kartochka bo'lib chiqadi. Nom «Nima?» dan, tugma «Nega?» dan keladi.",
    },
    ru: {
      ctx: 'В строку «Для кого?» после возраста добавили интересы.',
      q: 'Что изменится на сайте?',
      opts: ['То, что они любят, станет карточками', 'Название сайта станет совсем другим', 'На сайте появятся новая цель и кнопка', 'Ничего: интересы на сайт не влияют'],
      why: 'Интерес — то, что любит аудитория, — появляется на сайте карточкой. Название идёт от «Что?», кнопка — от «Зачем?».',
    },
    en: {
      ctx: 'We added interests to the “For whom?” line after the age.',
      q: 'What will change on the site?',
      opts: ['What they love turns into cards', 'The site’s name changes completely', 'A new goal and button appear', 'Nothing: interests don’t affect it'],
      why: 'An interest, that is, something the audience loves, shows up on the site as a card. The name comes from “What?”, the button from “Why?”.',
    },
  },
  {
    id: 'ai_l02_q10',
    difficulty: 'medium',
    tags: ['taxmin', 'kim-uchun'],
    sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T("Kulolchilik to'garagi sayti", 'Сайт гончарного кружка', 'A pottery club site') },
        { q: 1, t: T("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club') },
        { q: 2, t: null },
      ],
      site: {
        title: T("Kulolchilik to'garagi", 'Гончарный кружок', 'Pottery club'), em: '🏺', c: '#B45309', c2: '#78350F', bg: '#F5F5F4',
        heroBg: 'linear-gradient(135deg, #111827, #374151)', btn: '#D4AF37', btnFg: '#111827',
        nav: [T('Ustaxona', 'Мастерская', 'Workshop'), T('Narxlar', 'Цены', 'Prices'), T('Aloqa', 'Контакты', 'Contacts')],
        badge: T('Kattalar uchun', 'Для взрослых', 'For adults'),
        sub: T('Professional yondashuv va yuqori sifat.', 'Профессиональный подход и высокое качество.', 'A professional approach and top quality.'),
        cta: T('Yozilish', 'Записаться', 'Sign up'),
        marks: { hero: GUESS },
        foot: FOOT,
      },
    } },
    uz: {
      ctx: "To'garak 9–11 yoshli bolalarni kutyapti, lekin sayt boshqacha chiqdi.",
      q: 'Nega sayt kattalarga moslangan?',
      opts: ["«Kim uchun?» bo'sh, shuning uchun taxmin qilindi", 'Kulolchilik faqat kattalar uchun bo\'ladi', '«Nega?» qatori juda qisqa yozilgan', "Sun'iy intellekt doim kattalarga sayt qiladi"],
      why: "Auditoriya yozilmasa, sun'iy intellekt uni o'zi taxmin qiladi — «Taxmin» belgisi shuni aytadi. «Kim uchun?» ga 9–11 yoshli bolalarni yozish kerak.",
    },
    ru: {
      ctx: 'Кружок ждёт детей 9–11 лет, но сайт вышел другим.',
      q: 'Почему сайт подстроен под взрослых?',
      opts: ['«Для кого?» пусто, и ИИ додумал сам', 'Гончарное дело — только для взрослых', 'Строка «Зачем?» слишком короткая', 'ИИ всегда делает сайты для взрослых'],
      why: 'Если аудитория не написана, ИИ додумывает её сам — об этом метка «Догадка». В «Для кого?» нужно написать детей 9–11 лет.',
    },
    en: {
      ctx: 'The club expects kids aged 9–11, but the site came out different.',
      q: 'Why is the site made for adults?',
      opts: ['“For whom?” is empty, so the AI guessed', 'Pottery is only for adults', 'The “Why?” line is too short', 'The AI always makes sites for adults'],
      why: 'If the audience isn’t written, the AI guesses it, as the “Guess” label shows. The “For whom?” line needs kids aged 9–11.',
    },
  },
  {
    id: 'ai_l02_q11',
    difficulty: 'medium',
    tags: ['kim-uchun', 'keksalar'],
    sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Mahalla kutubxonasi sayti', 'Сайт библиотеки района', 'A local library site') },
        { q: 1, t: T("odamlar qo'ng'iroq qilib kitob so'rasin", 'чтобы люди звонили и заказывали книги', 'get people to call and ask for books') },
        { q: 2, t: T('nafaqadagi buvi va bobolar', 'бабушки и дедушки на пенсии', 'retired grandparents'), hl: true },
      ],
    } },
    uz: {
      ctx: "Sun'iy intellekt bu promptdan sayt yaratadi.",
      q: "Sayt qanday ko'rinishda chiqadi?",
      opts: ["Harflar katta, telefon raqami darrov ko'rinadi", "Qorong'i fon, neon ranglar va o'yinlar", "Komikslar va o'yinchoqdek yorqin tugmalar", "Mayda harflar va juda ko'p menyu bo'limlari"],
      why: "Buvi va bobolarga katta harf, ortiqcha narsasiz sahifa va ko'rinib turgan telefon raqami qulay. Sun'iy intellekt saytni shunga moslaydi.",
    },
    ru: {
      ctx: 'ИИ сделает сайт по этому промпту.',
      q: 'Каким получится сайт?',
      opts: ['Крупные буквы, телефон сразу на виду', 'Тёмный фон, неоновые цвета и игры', 'Комиксы и яркие кнопки-игрушки', 'Мелкие буквы и очень много пунктов меню'],
      why: 'Бабушкам и дедушкам удобны крупные буквы, страница без лишнего и заметный номер телефона. ИИ подстроит сайт под это.',
    },
    en: {
      ctx: 'The AI will make a site from this prompt.',
      q: 'What will the site look like?',
      opts: ['Big letters, the phone number in plain view', 'A dark background, neon colours and games', 'Comics and bright toy-like buttons', 'Small letters and lots of menu items'],
      why: 'Grandparents find big letters, a page without extras and a clear phone number handy. The AI tailors the site to that.',
    },
  },
  {
    id: 'ai_l02_q12',
    difficulty: 'hard',
    tags: ['ikki-auditoriya'],
    sort: false,
    vis: { ai: {
      msg: { who: T('Mijoz', 'Клиент', 'Client'), text: T("«Sayt bolalarga juda yoqdi. Lekin ota-onalar narx va xavfsizlikni topa olmadi, shuning uchun pul to'lashmadi.»", '«Детям сайт очень понравился. Но родители не нашли цены и безопасность, поэтому не оплатили».', '“Kids loved the site. But parents couldn’t find the price and safety info, so they didn’t pay.”') },
      prompt: [
        { q: 0, t: T('Robot yasash lageri sayti', 'Сайт лагеря робототехники', 'A robot building camp site') },
        { q: 1, t: T('bolalar lagerga yozilsin', 'чтобы дети записывались в лагерь', 'get kids to sign up for camp') },
        { q: 2, t: T("10–13 yoshli bolalar, robotlarni yaxshi ko'radi", 'дети 10–13 лет, любят роботов', 'kids aged 10–13 who love robots'), hl: true },
      ],
    } },
    uz: {
      ctx: "Lager sayti tayyor edi, lekin mijoz yozdi.",
      q: '«Kim uchun?» qatorini qanday tuzatamiz?',
      opts: ['10–13 yoshli bolalar va ularning ota-onalari', '10–13 yoshli bolalarning ota-onalari', 'hamma uchun: bolalar ham, kattalar ham', "10–13 yoshli bolalar, o'yinni yaxshi ko'radi"],
      why: "Lagerni bolalar tanlaydi, ota-onalar to'laydi. Ikkalasini yozsak, tepasi bolalarga yorqin bo'ladi, pastida ota-onalar uchun bo'lim chiqadi.",
    },
    ru: {
      ctx: 'Сайт лагеря был готов, но клиент написал.',
      q: 'Как исправить строку «Для кого?»?',
      opts: ['дети 10–13 лет и их родители', 'родители детей 10–13 лет', 'для всех: и детей, и взрослых', 'дети 10–13 лет, любят игры'],
      why: 'Лагерь выбирают дети, а платят родители. Если написать обоих, верх будет ярким для детей, а внизу появится раздел для родителей.',
    },
    en: {
      ctx: 'The camp site was ready, but the client wrote back.',
      q: 'How do we fix the “For whom?” line?',
      opts: ['kids aged 10–13 and their parents', 'parents of kids aged 10–13', 'everyone: kids and grown-ups', 'kids aged 10–13 who love games'],
      why: 'Kids choose the camp, parents pay. Write both: the top will be bright for kids, and a section for parents will appear below.',
    },
  },
  {
    id: 'ai_l02_q13',
    difficulty: 'medium',
    tags: ['kim-uchun'],
    sort: false,
    vis: null,
    uz: {
      ctx: "Ikki prompt: «Nima?» va «Nega?» bir xil, faqat «Kim uchun?» boshqa.",
      q: 'Ikki sayt bir-biridan nimasi bilan farq qiladi?',
      opts: ["Ko'rinishi, so'zlari va bo'limlari bilan", 'Faqat saytning nomi va menyusi bilan', 'Hech narsasi bilan: saytlar bir xil', 'Faqat tugmaning rangi bilan'],
      why: "«Kim uchun?» o'zgarsa, sayt boshqa odamlarga moslashadi: ranglar, harflar, gaplar va bo'limlar o'zgaradi. Nom va maqsad esa joyida qoladi.",
    },
    ru: {
      ctx: 'Два промпта: «Что?» и «Зачем?» одинаковые, отличается только «Для кого?».',
      q: 'Чем два сайта будут отличаться?',
      opts: ['Видом, словами и разделами', 'Только названием и меню сайта', 'Ничем: сайты одинаковые', 'Только цветом кнопки'],
      why: 'Если меняется «Для кого?», сайт подстраивается под других людей: меняются цвета, буквы, фразы и разделы. Название и цель остаются.',
    },
    en: {
      ctx: 'Two prompts: “What?” and “Why?” are the same, only “For whom?” differs.',
      q: 'How will the two sites differ?',
      opts: ['In look, words and sections', 'Only in the site’s name and menu', 'Not at all: they’re the same', 'Only in the button colour'],
      why: 'When “For whom?” changes, the site fits other people: colours, letters, phrases and sections change. The name and goal stay.',
    },
  },
  {
    id: 'ai_l02_q14',
    difficulty: 'hard',
    tags: ['mijoz', 'qator'],
    sort: false,
    vis: { ai: {
      msg: { who: T('Mijoz', 'Клиент', 'Client'), text: T("«Maktabimizda kitobxonlar kechasi bo'ladi. 5–6-sinf o'quvchilarini kutamiz, ular sarguzasht kitoblarini yaxshi ko'radi. Ular kechaga yozilsin.»", '«В нашей школе будет вечер книголюбов. Ждём учеников 5–6 классов, они любят книги о приключениях. Пусть записываются на вечер».', '“Our school is holding a book lovers’ evening. We expect grade 5–6 students who love adventure books. They should sign up for it.”') },
    } },
    uz: {
      ctx: "Mijozning xabarini o'qing.",
      q: '«Kim uchun?» qatoriga qaysi biri mos?',
      opts: ["5–6-sinf o'quvchilari, sarguzashtni sevadi", "o'quvchilar kitobxonlar kechasiga yozilsin", 'Kitobxonlar kechasi sayti, maktab uchun', "kitobni yaxshi ko'radigan hamma uchun"],
      why: "Xabarda uch narsa bor. «Kim uchun?» — odamlar haqida: qaysi sinf va nimani yaxshi ko'radi. «Yozilsin» — «Nega?», kecha sayti — «Nima?».",
    },
    ru: {
      ctx: 'Прочитай сообщение клиента.',
      q: 'Что подходит в строку «Для кого?»?',
      opts: ['ученики 5–6 классов, любят приключения', 'чтобы ученики записывались на вечер', 'Сайт вечера книголюбов, для школы', 'все, кто любит книги'],
      why: 'В сообщении три вещи. «Для кого?» — о людях: какой класс и что они любят. «Записывались» — это «Зачем?», сайт вечера — «Что?».',
    },
    en: {
      ctx: 'Read the client’s message.',
      q: 'What fits the “For whom?” line?',
      opts: ['grade 5–6 students who love adventures', 'get students to sign up for the evening', 'A book evening site, for the school', 'everyone who loves books'],
      why: 'The message has three things. “For whom?” is about people: which grade and what they love. “Sign up” is “Why?”, the evening site is “What?”.',
    },
  },
  {
    id: 'ai_l02_q15',
    difficulty: 'easy',
    tags: ['sayt-kimga'],
    sort: false,
    vis: { ai: {
      site: {
        title: T('Bolalar tish shifoxonasi', 'Детская стоматология', 'Kids’ dental clinic'), em: '🦷', c: '#0284C7', c2: '#0C4A6E', bg: '#E0F2FE',
        font: 'Georgia, "Times New Roman", serif', heroBg: 'linear-gradient(135deg, #0369A1, #0C4A6E)',
        nav: [T('Xizmatlar', 'Услуги', 'Services'), T('Shifokorlar', 'Врачи', 'Doctors'), T('Aloqa', 'Контакты', 'Contacts')],
        badge: T('Ota-onalar uchun', 'Для родителей', 'For parents'),
        sub: T('Farzandingiz uchun xavfsiz, foydali va qulay.', 'Безопасно, полезно и удобно для ребёнка.', 'Safe, useful and convenient for your child.'),
        cta: T('Qabulga yozilish', 'Записаться на приём', 'Book a visit'),
        cards: [
          { ic: '🛡️', h: T('Xavfsizlik', 'Безопасность', 'Safety'), p: T('Toza va steril asboblar', 'Чистые стерильные инструменты', 'Clean, sterile tools') },
          { ic: '💳', h: T('Narxlar', 'Цены', 'Prices'), p: T('Oldindan aniq narx', 'Точная цена заранее', 'A clear price up front') },
          { ic: '🗓️', h: T('Jadval', 'Расписание', 'Schedule'), p: T('Har kuni 9:00–18:00', 'Каждый день 9:00–18:00', 'Every day 9:00–18:00') },
        ],
        foot: FOOT,
      },
    } },
    uz: {
      ctx: "Sun'iy intellekt shu saytni yaratdi.",
      q: 'Bu sayt asosan kimga moslangan?',
      opts: ['Bolalarning ota-onalariga', "Kichkintoy bolalarning o'ziga", "O'yinni yaxshi ko'radigan o'smirlarga", 'Shifoxona shifokorlariga'],
      why: "Plashkada «Ota-onalar uchun», ranglar sokin, kartochkalarda xavfsizlik, narx va jadval. Ota-onalar aynan shuni so'raydi.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт.',
      q: 'Под кого в основном подстроен этот сайт?',
      opts: ['Под родителей детей', 'Под самих малышей', 'Под подростков, которые любят игры', 'Под врачей клиники'],
      why: 'На плашке «Для родителей», цвета спокойные, в карточках безопасность, цены и расписание. Именно об этом спрашивают родители.',
    },
    en: {
      ctx: 'The AI made this site.',
      q: 'Who is this site mainly made for?',
      opts: ['The kids’ parents', 'The little kids themselves', 'Teens who love games', 'The clinic’s doctors'],
      why: 'The badge says “For parents”, the colours are calm, the cards are safety, prices and schedule. That’s exactly what parents ask about.',
    },
  },
  {
    id: 'ai_l02_q16',
    difficulty: 'medium',
    tags: ['kim-uchun', 'qiziqish'],
    sort: false,
    vis: { ai: {
      prompt: [
        { q: 0, t: T('Yozgi futbol maktabi sayti', 'Сайт летней футбольной школы', 'A summer football school site') },
        { q: 1, t: T("bolalar mashg'ulotga yozilsin", 'чтобы дети записывались на тренировки', 'get kids to sign up for training') },
        { q: 2, t: T("bolalar uchun, sayt chiroyli bo'lsin", 'для детей, чтобы сайт был красивым', 'for kids, make the site pretty'), hl: true },
      ],
    } },
    uz: {
      ctx: '«Kim uchun?» qatori shunday yozildi.',
      q: 'Bu qatorda nima yetishmayapti?',
      opts: ["Yoshi va ular nimani yaxshi ko'rishi", 'Saytning nomi va menyusi', 'Yana bitta «Nega?» maqsadi', "Hech narsa: qator to'liq"],
      why: "«Bolalar» juda umumiy, «chiroyli bo'lsin» esa istak. Yoshi va qiziqishi kerak, masalan: «9–11 yoshli bolalar, futbolni yaxshi ko'radi».",
    },
    ru: {
      ctx: 'Строку «Для кого?» заполнили так.',
      q: 'Чего не хватает в этой строке?',
      opts: ['Возраста и того, что они любят', 'Названия и меню сайта', 'Ещё одной цели «Зачем?»', 'Ничего: строка полная'],
      why: '«Дети» — слишком общо, а «красивым» — пожелание. Нужны возраст и интерес, например: «дети 9–11 лет, любят футбол».',
    },
    en: {
      ctx: 'Someone filled in the “For whom?” line like this.',
      q: 'What is missing from this line?',
      opts: ['Their age and what they love', 'The site’s name and menu', 'One more “Why?” goal', 'Nothing: the line is complete'],
      why: '“Kids” is too general, and “pretty” is a wish. It needs an age and an interest, like “kids aged 9–11 who love football”.',
    },
  },
  {
    id: 'ai_l02_q17',
    difficulty: 'easy',
    tags: ['kim-uchun'],
    sort: false,
    vis: null,
    uz: {
      ctx: "Kimdir o'ylaydi: yaxshi sayt hammaga birdek yoqadi.",
      q: '«Kim uchun?» qatori nega kerak?',
      opts: ["Har xil odamga har xil sayt qulay", "Usiz sun'iy intellekt sayt yaratmaydi", 'Sayt internetda tezroq ochiladi', 'Saytning nomi chiroyliroq chiqadi'],
      why: "Bolaga o'yin va katta harflar, ota-onaga narx va xavfsizlik, buviga ko'rinib turgan telefon kerak. Shuning uchun aynan kimligini aytamiz.",
    },
    ru: {
      ctx: 'Кто-то думает: хороший сайт всем нравится одинаково.',
      q: 'Зачем нужна строка «Для кого?»?',
      opts: ['Разным людям удобны разные сайты', 'Без неё ИИ не сделает сайт', 'Сайт будет быстрее открываться', 'Название сайта выйдет красивее'],
      why: 'Ребёнку нужны игры и крупные буквы, родителям — цены и безопасность, бабушке — заметный телефон. Поэтому называем, кто именно.',
    },
    en: {
      ctx: 'Someone thinks a good site pleases everyone the same.',
      q: 'Why do we need the “For whom?” line?',
      opts: ['Different people need different sites', 'Without it the AI won’t make a site', 'The site will open faster', 'The site’s name will look nicer'],
      why: 'A kid needs games and big letters, parents need prices and safety, a grandma needs a clear phone number. So we say exactly who.',
    },
  },
  {
    id: 'ai_l02_q18',
    difficulty: 'medium',
    tags: ['sayt-kimga'],
    sort: false,
    vis: { ai: {
      site: {
        title: T('Matematika vazifalari', 'Задания по математике', 'Maths tasks'), em: '📐', c: '#4F46E5', c2: '#312E81', bg: '#E0E7FF',
        nav: [T('Mavzular', 'Темы', 'Topics'), T('Testlar', 'Тесты', 'Tests'), T('Aloqa', 'Контакты', 'Contacts')],
        sub: T('Darsga tayyorlanish endi tezroq', 'Готовиться к урокам теперь быстрее', 'Getting ready for lessons is now faster'),
        cta: T("Ro'yxatdan o'tish", 'Зарегистрироваться', 'Sign up'),
        cards: [
          { ic: '📋', h: T('Dars rejalari', 'Планы уроков', 'Lesson plans'), p: T('Har bir sinf uchun', 'Для каждого класса', 'For every grade') },
          { ic: '✅', h: T('Test tuzish', 'Составить тест', 'Make a test'), p: T('5 daqiqada', 'За 5 минут', 'In 5 minutes') },
          { ic: '📊', h: T('Baholar jadvali', 'Журнал оценок', 'Grade book'), p: T("O'zi hisoblaydi", 'Считает сам', 'Counts by itself') },
        ],
        foot: FOOT,
      },
      focus: '.cards',
    } },
    uz: {
      ctx: "Sun'iy intellekt shu saytni yaratdi. Kartochkalarga qarang.",
      q: 'Bu sayt kimlar uchun yaratilgan?',
      opts: ["Matematika o'qituvchilari uchun", "5-sinf o'quvchilari uchun", "O'quvchilarning ota-onalari uchun", 'Matematikani sevadigan hamma uchun'],
      why: "Dars rejalari, test tuzish, baholar jadvali — bular o'qituvchiga kerak, o'quvchiga emas. Demak, «Kim uchun?» da o'qituvchilar yozilgan.",
    },
    ru: {
      ctx: 'ИИ сделал такой сайт. Посмотри на карточки.',
      q: 'Для кого сделан этот сайт?',
      opts: ['Для учителей математики', 'Для учеников 5 класса', 'Для родителей учеников', 'Для всех, кто любит математику'],
      why: 'Планы уроков, составить тест, журнал оценок — это нужно учителю, а не ученику. Значит, в «Для кого?» написаны учителя.',
    },
    en: {
      ctx: 'The AI made this site. Look at the cards.',
      q: 'Who was this site made for?',
      opts: ['Maths teachers', 'Grade 5 students', 'The students’ parents', 'Everyone who loves maths'],
      why: 'Lesson plans, making tests, a grade book: a teacher needs these, not a student. So “For whom?” says teachers.',
    },
  },
];
