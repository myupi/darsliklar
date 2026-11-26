// =============================================================================
// МОДУЛЬ «ИИ» · Урок 2 — «Для кого создаём?»
// (облик «промпт в поле ИИ-приложения» поверх рамки CoddyCamp; 11.11.2026). Дети 11–14, проходят сами.
// Один самодостаточный JSX: канон курса (до пометки «УРОК») + урок.
// Сборка: node tools/ai2/build.mjs → lessons/ai/02-dlya-kogo.jsx
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Для кого создаём?» · модуль ai-m1-sayt =====
//
// ЗАМЫСЕЛ (план заказчика 11.11.2026: каждый урок добавляет в промпт новый кусок; темы урока — целевая аудитория и
// интересы аудитории). Промпт Коди с прошлого урока («Futbol turniri sayti · o'yinchilar ro'yxatdan o'tsin») делает
// правильный сайт турнира, но турнир — для первоклассников, и первокласснику скучно: мелкие буквы, сложные слова.
// Урок учит третьему вопросу формулы «Kim uchun?»: кто будет смотреть сайт (возраст, кто они), что они любят и что
// бывает две аудитории (дети выбирают, родители решают). ИИ подстраивает под аудиторию облик, слова и разделы сайта.
// Загадка (без имён): Коди думает, что хороший сайт нравится всем. Разгадка: сайт «для всех» — сайт ни для кого.
//
// ДУГА (17 экранов):
//   s1 крючок (промпт Коди без «Kim uchun?» → правильный, но «взрослый» сайт; карточка «первокласснику скучно»; загадка)
//   «Kim uchun?»: s2 показ (никто · дети 7–8 · родители · бабушки и дедушки) · s3 сам (кружок роботов: 12–14 лет) ·
//                s4 что точнее (раунды «для всех» / конкретно)
//   интересы: s5 показ (возраст → + комиксы → + приключения → игры и подарки) · s6 сам (праздник животных) ·
//             s7 какая строка (фразу — в «Nima? / Nega? / Kim uchun?»)
//   перенос и две аудитории: s8 сам (столовая района: пожилые) · s9 показ (лагерь: дети · родители · оба) ·
//             s10 сам (курс плавания: дети и родители)
//   думать промптом: g1 ИИ угадал не то (без «Kim uchun?» — «для взрослых») · det детектив (для кого сайт; какая строка
//             «Kim uchun?» дала сайт) · s12 почини «hamma uchun» Коди · s13 три строки с нуля · s14 свой сайт
//   итог: q1 верно или нет · fin вывод с разгадкой, свой промпт и сайт, домашка.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · ИИ — симулятор (tools/ai1/ai1-kit.jsx, aiSite с pr.who, audOf): аудитория меняет шрифт, цвета, размеры, плашку и
//     подзаголовок; интересы — первые карточки; родителям — раздел «Ota-onalar uchun», пожилым — крупный телефон.
//     Метки «Kim uchun?» (бирюзовые) на сайте показывают, что дала третья строка.
//   · Промпт ученика уходит ИИ всегда; проверка называет, чего не хватает.
//   · Узбекский — по /uzbekcha; в речи нет символов и цифр через тире.
//
// СИСТЕМА СЛОВ: auditoriya — аудитория (ya'ni «saytni ko'radigan odamlar»); qiziqish — интерес («nimani yaxshi
// ko'radi»); keksalar — пожилые (buvi va bobolar); kichkintoylar — малыши.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================
const META = {
  lessonId: 'ai-02-dlya-kogo',
  module: 'ai-m1-sayt',
  lessonTitle: {
    uz: '2-dars. Kim uchun yaratamiz?',
    ru: 'Урок 2. Для кого создаём?',
    en: 'Lesson 2. Who are we making it for?'
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
  erase: L3("O'chirish", 'Стереть', 'Erase'),
  send: L3('Yuborish', 'Отправить', 'Send'),
  thinking: L3('Yozyapti…', 'Пишет…', 'Typing…'),
  gen: L3("Sun'iy intellekt sayt yaratyapti", 'ИИ создаёт сайт', 'The AI is building the site'),
  kodi: L3('Kodi', 'Коди', 'Kodi'),
  hw: L3('Uyga vazifa', 'Домашнее задание', 'Homework'),
  copy: L3('Nusxalash', 'Копировать', 'Copy'),
  copied: L3('Nusxalandi', 'Скопировано', 'Copied'),
  finish: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  next: L3("Saytda nima bo'ladi?", 'Что должно быть на сайте?', 'What goes on the site?'),
  width: L3('Oyna kengligi', 'Ширина окна', 'Window width'),
  pc: L3('Kompyuter', 'Компьютер', 'Computer'),
  phone: L3('Telefon', 'Телефон', 'Phone'),
  hintN: L3('Yordam', 'Подсказка', 'Hint')
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, says, magic, done, ok, msgs, hints, help, why, hint1, hint2 …; печатаются: eyebrow, ask, card,
// строки промптов.
// ─────────────────────────────────────────────────────────────────────────────
const BUY = L3('Buyurtma', 'Заказ', 'Request');
// Общие ответы проверки «Kim uchun?».
const M = {
  empty: L3("«Kim uchun?» qatori hali bo'sh. Saytni kimlar ko'radi, shuni yozing.", 'Напиши в строку «Для кого?»: кто будет смотреть сайт?', 'Write in the “Who for?” line: who will look at the site?'),
  all: L3("«Hamma uchun» deb yozsangiz, sun'iy intellekt saytni hech kimga moslay olmaydi. Buyurtmaga qarang-chi: saytni aynan kimlar ochadi?", 'Если написать «для всех», ИИ ни под кого сайт не подстроит. Посмотри в заказ: кто именно?', 'If you write “for everyone”, the AI won’t tailor the site to anyone. Check the request: who exactly?'),
  gen: L3("Sun'iy intellekt bu so'zdan saytni kimlar ochishini tushunmadi. Ularning yoshini yoki kimligini yozing: bolalarmi, o'quvchilarmi, ota-onalarmi.", 'ИИ не понял по этому слову, кто это. Напиши возраст или кто они: дети, школьники, родители.', 'The AI couldn’t tell who that is. Write their age or who they are: kids, students, parents.')
};
const C = {
  s1: {
    eyebrow: L3('Kim uchun?', 'Для кого?', 'Who for?'),
    say: L3("Yana salom! O'tgan darsda promptga ikkita qator yozishni o'rgangan edik: nima va nega. Mana, o'sha usulda maktab futbol turniri uchun yangi prompt yozdim. Bu safar turnir birinchi va ikkinchi sinf bolalari uchun bo'ladi. Kichkintoylarga bu sayt yoqarmikan? Bilish uchun «Yuborish»ni bosing.",
      'Привет! На прошлом уроке мы научились писать правильный промпт: что и зачем. Вот мой промпт для школьного футбольного турнира. Турнир — для первого и второго класса. Нажми «Отправить» — посмотрим, какой выйдет сайт!',
      'Hi! Last lesson we learned to write a proper prompt: what and why. Here’s my prompt for the school football tournament. The tournament is for first and second graders. Tap “Send” and let’s see the site!'),
    what: L3('Futbol turniri sayti', 'Сайт футбольного турнира', 'A football tournament site'),
    why: L3("o'yinchilar ro'yxatdan o'tsin", 'чтобы игроки записывались', 'get players to sign up'),
    empty: L3("Bu yerda sun'iy intellekt yaratgan sayt chiqadi", 'Здесь появится сайт, который сделает ИИ', 'The site the AI makes will appear here'),
    magic: L3("Qarang, bu safar sayt to'g'ri chiqdi: turnir ham bor, ro'yxatdan o'tish ham. Lekin uni birinchi sinf o'quvchisi ochib ko'rdi-yu, zerikib qoldi! Uning uchun harflar mayda, so'zlar qiyin, qiziqarli hech narsa yo'q ekan.",
      'Ого, сайт получился правильный: есть и турнир, и запись. Но его открыл первоклассник — и заскучал! Буквы для него мелкие, слова сложные, ничего интересного.',
      'Wow, the site came out right: there’s the tournament and the sign-up. But a first grader opened it and got bored! The letters are tiny, the words are hard, nothing fun.'),
    done: L3("Nimaga zerikdi ekan? Men saytni ataylab hamma uchun qilgandim-ku! Axir yaxshi sayt kattalarga ham, bolalarga ham birdek yoqishi kerak, to'g'rimi? Siz ham shunday qilgan bo'larmidingiz? Bugun uchinchi savol bilan tanishamiz: sayt kim uchun?",
      'По-моему, хороший сайт должен нравиться всем одинаково: и взрослым, и детям. Я сделал его для всех. А ты как думаешь? Сегодня разберём третий вопрос: для кого сайт?',
      'I think a good site should please everyone equally: adults and kids. I made it for everyone. What do you think? Today we learn the third question: who is the site for?'),
    seen: { h: L3('Saytni kim ochdi', 'Кто открыл сайт', 'Who opened the site'), t: L3("Birinchi sinf o'quvchisi, 7 yosh: «Harflar mayda, so'zlar qiyin. Zerikarli! O'yin qani?»", 'Первоклассник, 7 лет: «Буквы мелкие, слова сложные. Скучно! А где игра?»', 'A first grader, age 7: “The letters are tiny, the words are hard. Boring! Where’s the fun?”') },
    ask: L3('«Yuborish»ni bosing', 'Нажми «Отправить»', 'Tap “Send”'),
    askDone: L3('Bu sayt kichkintoylarga mos emas', 'Этот сайт не для малышей', 'This site doesn’t suit little kids')
  },
  s2: {
    eyebrow: L3('Kim uchun?', 'Для кого?', 'Who for?'),
    help: [
      L3("Yangi «Kim uchun?» qatorini kuzatib turing. Keyin saytdagi harflarga, ranglarga va eng tepadagi yozuvga qarang-chi.", 'Посмотри на строку промпта, на буквы, цвета и надпись вверху сайта.', 'Look at the prompt line and at the site’s letters, colours and the label at the top.'),
      L3("Bu qatorga saytni kimlar ko'rishini yozamiz: ularning yoshini va kimligini. Sun'iy intellekt shunga qarab saytning ko'rinishini ham, so'zlarini ham tanlaydi.", '«Для кого?» — это кто будет смотреть сайт: возраст и кто они. По этому ИИ выбирает дизайн и слова.', '“Who for?” is who will look at the site: their age and who they are. The AI picks the design and words from it.'),
      L3("Bitta voqeani do'stingizga bemalol, tez-tez aytib berasiz, buvingizga esa sekinroq, oddiyroq qilib tushuntirasiz. Saytda bu ishni sun'iy intellekt qiladi: kim o'qishiga qarab so'zlarni ham, ko'rinishni ham o'zgartiradi.", 'Одну и ту же историю другу ты расскажешь так, а бабушке — иначе. С сайтом так же.', 'You’d tell the same story one way to a friend and another way to your grandma. Sites work the same way.')
    ],
    say: L3("Uchinchi savol shunday: sayt kim uchun? Saytni ko'radigan odamlarni auditoriya deyishadi. Promptimizga shu savol uchun yangi qator qo'shdim. Hozircha u bo'sh, shuning uchun sun'iy intellekt saytni hech kimga moslamadi.",
      'Третий вопрос: для кого сайт? Это называют аудиторией, то есть людьми, которые будут смотреть сайт. Добавим в промпт новую строку. Пока она пустая — поэтому ИИ ни под кого сайт не подстроил.',
      'The third question: who is the site for? We call it the audience, that is, the people who will look at the site. Let’s add a new line to the prompt. It’s empty for now, so the AI didn’t tailor the site to anyone.'),
    a1: L3('7–8 yoshli bolalar', 'дети 7–8 лет', 'kids aged 7–8'),
    a2: L3("o'yinchilarning ota-onalari", 'родители игроков', 'the players’ parents'),
    a3: L3('tomosha qiladigan buvi va bobolar', 'бабушки и дедушки, которые придут смотреть', 'grandparents who come to watch'),
    says: [
      L3("Qatorga «yetti-sakkiz yoshli bolalar» deb yozdik. Qarang-chi: harflar kattalashdi, ranglar yorqin bo'ldi, tugma esa o'yinchoqqa o'xshab qoldi. Sun'iy intellekt saytni kichkintoylarga moslab qaytadan yasabdi!", 'Пишем: дети семи-восьми лет. Смотри: буквы крупные, цвета яркие, кнопка как игрушка. ИИ переделал сайт под малышей.', 'We write: kids aged seven to eight. Look: big letters, bright colours, a button like a toy. The AI remade the site for little kids.'),
      L3("Endi qatorga o'yinchilarning ota-onalarini yozdik. Ranglar sokinroq bo'ldi, yangi bo'lim ham chiqdi: xavfsizlik, narx va jadval. Ota-onalar odatda aynan shularni so'rashadi-da.", 'Теперь тот же сайт — для родителей игроков. Цвета стали спокойными, и появился новый раздел: безопасность, цены и расписание. Родители спрашивают именно об этом.', 'Now the same site for the players’ parents. The colours calmed down and a new section appeared: safety, prices and the schedule. That’s exactly what parents ask about.'),
      L3("Buvi va bobolar uchun-chi? Harflar juda katta bo'lib ketdi, ortiqcha narsa yo'q, telefon raqami esa darrov ko'zga tashlanadi.", 'А для бабушек и дедушек — очень крупные буквы, ничего лишнего и сразу виден номер телефона.', 'And for grandparents: very big letters, nothing extra, and the phone number right there.')
    ],
    done: L3("Ko'rdingizmi? «Nima?» bilan «Nega?» o'sha-o'sha qoldi, faqat «Kim uchun?» o'zgardi, sayt esa butunlay boshqacha bo'ldi: ko'rinishi ham, so'zlari ham, bo'limlari ham.", 'Значит, даже если «Что?» и «Зачем?» те же, стоит поменять «Для кого?» — и меняется сайт: вид, слова и разделы.', 'So even with the same “What?” and “Why?”, change “Who for?” and the site changes: its look, words and sections.'),
    asks: [L3("Qarang: hech kimga moslanmagan", 'Смотри: ни под кого', 'Watch: tailored to no one'), L3('Qarang: bolalar uchun', 'Смотри: для детей', 'Watch: for kids'),
      L3('Qarang: ota-onalar uchun', 'Смотри: для родителей', 'Watch: for parents'), L3('Qarang: buvi va bobolar uchun', 'Смотри: для бабушек и дедушек', 'Watch: for grandparents')],
    askDone: L3("«Kim uchun?» saytni auditoriyaga moslaydi", '«Для кого?» подстраивает сайт под аудиторию', '“Who for?” tailors the site to the audience')
  },
  s3: {
    eyebrow: L3('Kim uchun yaratamiz?', 'Для кого создаём?', 'Who is it for?'),
    card: { h: BUY, t: L3("Robot to'garagi yangi a'zolar qidiryapti: 12–14 yoshli maktab o'quvchilari.", 'Кружок робототехники ищет новых ребят: школьников 12–14 лет.', 'The robotics club is looking for new members: students aged 12–14.') },
    say: L3("Robot to'garagidan buyurtma keldi: ular yangi a'zolar qidiryapti. Birinchi ikki qatorni tayyorlab qo'ydim, uchinchisi sizdan. Buyurtmani o'qing-da, «Kim uchun?» qatoriga sayt kimlar uchun ekanini yozing.",
      'Теперь ты. Кружок робототехники попросил сайт. «Что?» и «Зачем?» готовы. Прочитай заказ и напиши в строку «Для кого?», для кого этот сайт.',
      'Your turn. The robotics club asked for a site. “What?” and “Why?” are ready. Read the request and write in the “Who for?” line who the site is for.'),
    what: L3("Robot to'garagi sayti", 'Сайт кружка робототехники', 'A robotics club site'),
    why: L3("o'quvchilar to'garakka yozilsin", 'чтобы школьники записывались в кружок', 'get students to sign up for the club'),
    ph: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    msgs: {
      other: L3("Buyurtmaga yana bir qarang: to'garak na kichkintoylarni, na kattalarni kutyapti. U o'n ikki yoshdan o'n to'rt yoshgacha bo'lgan o'quvchilarni izlayapti.", 'Посмотри в заказ: кружок ждёт не малышей и не взрослых, а школьников от двенадцати до четырнадцати лет.', 'Check the request: the club isn’t waiting for little kids or adults, but for students aged twelve to fourteen.')
    },
    hints: [
      L3("Buyurtmani qayta o'qing-chi: to'garak kimlarni kutyapti?", 'Перечитай заказ: кто там назван?', 'Read the request again: who does it name?'),
      L3("Ularning yoshi bilan kimligini yozsangiz, sun'iy intellektga eng katta yordam bo'ladi.", 'Напиши возраст и кто они: это больше всего поможет ИИ.', 'Write their age and who they are: that helps the AI most.'),
      L3("Namunani «Kim uchun?» qatoriga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("12–14 yoshli maktab o'quvchilari", 'школьники 12–14 лет', 'students aged 12–14'),
    ok: L3("Zo'r! Sayt darrov o'smirlarga moslashdi: zamonaviyroq bo'ldi, ranglari to'qlashdi, tepasiga esa yoshi ham yozildi. Endi sayt o'smirlar tilida gapiryapti.", 'Огонь! Сайт подстроился под подростков: современный, тёмные цвета, вверху указан возраст. ИИ понял, для кого он.', 'Awesome! The site adapted to teens: modern, dark colours, the age at the top. The AI knew who it was for.'),
    ask: L3("«Kim uchun?» qatorini yozing", 'Напиши строку «Для кого?»', 'Write the “Who for?” line')
  },
  s4: {
    eyebrow: L3('Qaysi biri aniqroq?', 'Что точнее?', 'Which is clearer?'),
    say: L3("Bir xil sayt uchun ikki xil «Kim uchun?» qatori yozilgan. Sizningcha, qaysi biri sun'iy intellektga ko'proq yordam beradi?",
      'Теперь проверь себя. Какое из двух «Для кого?» больше поможет ИИ?',
      'Now check yourself. Which of the two “Who for?” lines helps the AI more?'),
    card: L3('Savol', 'Вопрос', 'Question'),
    q: L3("Qaysi «Kim uchun?» aniqroq?", 'Какое «Для кого?» точнее?', 'Which “Who for?” is clearer?'),
    ask: L3('Aniqroq javobni tanlang', 'Выбери более точный вариант', 'Pick the clearer one'),
    hint1: L3("Qaysi birida odamlar aniq aytilgan: yoshi, kimligi yoki nimani yaxshi ko'rishi?", 'Где понятно, кто это: возраст, кто они или что любят?', 'Which one makes it clear who they are: their age, who they are or what they love?'),
    hint2: L3("«Hamma», «odamlar», «mijozlar» degan so'zlar juda umumiy, ular hech kimni aniq ko'rsatmaydi.", '«Все», «люди», «клиенты» — слишком общие слова.', '“Everyone”, “people”, “customers” are too general.'),
    items: [
      { a: L3('hamma uchun', 'для всех', 'for everyone'), b: L3('8–10 yoshli bolalar', 'дети 8–10 лет', 'kids aged 8–10'), right: 'b',
        why: L3("«Hamma uchun» degan qatordan sun'iy intellekt hech narsa bilolmaydi. Yoshi yozilgan qator unga ko'proq yordam beradi.", '«Для всех» — значит ни для кого. Лучше, где указан возраст.', '“For everyone” means for no one. The one with an age is better.') },
      { a: L3("pitsani yaxshi ko'radigan talabalar", 'студенты, которые любят пиццу', 'students who love pizza'), b: L3('odamlar', 'люди', 'people'), right: 'a',
        why: L3("Birinchisida ularning kimligi ham, nimani yaxshi ko'rishi ham aytilgan. «Odamlar» esa juda umumiy so'z.", 'В первом есть и кто они, и что любят.', 'The first one says who they are and what they love.') },
      { a: L3('mijozlar', 'клиенты', 'customers'), b: L3("nevaralariga sovg'a izlayotgan buvi va bobolar", 'бабушки и дедушки, которые ищут подарок внукам', 'grandparents looking for gifts for their grandkids'), right: 'b',
        why: L3("Ikkinchisida kimlar ekani ham, nima izlashi ham aytilgan. «Mijozlar» so'zi esa hech narsa aytmaydi.", 'Второй точный: сказано, кто и что ищет.', 'The second one is precise: it says who and what they’re looking for.') }
    ],
    right: L3("To'ppa-to'g'ri!", 'Точно!', 'Exactly!'),
    ok: L3("«Hamma», «odamlar», «mijozlar» degan so'zlarni endi uzoqdan taniysiz! Sun'iy intellektga aniq auditoriya kerakligini yaxshi bilasiz.", 'Всё верно! Ты отличаешь общее слово от точной аудитории.', 'All correct! You can tell a general word from a precise audience.')
  },
  s5: {
    eyebrow: L3("Nimani yaxshi ko'radi?", 'Что любят?', 'What do they love?'),
    help: [
      L3("«Kim uchun?» qatorining oxiriga qarang-chi, keyin saytdagi birinchi kartochkalarga ham.", 'Посмотри на строку промпта и на первые карточки сайта.', 'Look at the prompt line and at the site’s first cards.'),
      L3("Qatorga auditoriyaning qiziqishini qo'shsak, masalan, komikslarni, sun'iy intellekt shuni saytga kartochka qilib chiqaradi.", 'Интерес — то, что любит аудитория, — появляется на сайте карточкой.', 'An interest, that is, something the audience loves, shows up on the site as a card.'),
      L3("Do'stingizga sovg'a tanlayotganda birinchi navbatda nimani o'ylaysiz? U nimani yaxshi ko'rishini, albatta. Saytdagi kartochkalar ham auditoriyaning qiziqishiga qarab tanlanadi.", 'Выбирая другу подарок, ты думаешь, что он любит. Сайт выбирают так же.', 'When you choose a gift for a friend, you think about what they love. A site is chosen the same way.')
    ],
    say: L3("Sayt kim uchun ekanini yozdik, lekin bu hali yarim ish. Yana bir sir bor: auditoriya nimani yaxshi ko'radi? Buni qiziqish deyishadi. Mana, kitob ko'rgazmasi sayti. Hozircha uning promptida faqat bolalarning yoshi yozilgan.",
      'Написать, для кого сайт, — это полдела. Есть ещё секрет: что любит аудитория? Смотри, сейчас указан только возраст.',
      'Writing who the site is for is only half the job. There’s one more secret: what does the audience love? Look, right now only the age is written.'),
    what: L3("Kitob ko'rgazmasi sayti", 'Сайт книжной выставки', 'A book fair site'),
    why: L3("bolalar ko'rgazmaga kelsin", 'чтобы дети пришли на выставку', 'get kids to come to the fair'),
    b0: L3('10–12 yoshli bolalar', 'дети 10–12 лет', 'kids aged 10–12'),
    b1: L3("10–12 yoshli bolalar, komikslarni yaxshi ko'radi", 'дети 10–12 лет, любят комиксы', 'kids aged 10–12 who love comics'),
    b2: L3("10–12 yoshli bolalar, komikslar va sarguzashtlarni yaxshi ko'radi", 'дети 10–12 лет, любят комиксы и приключения', 'kids aged 10–12 who love comics and adventures'),
    b3: L3("10–12 yoshli bolalar, o'yinlar va sovg'alarni yaxshi ko'radi", 'дети 10–12 лет, любят игры и подарки', 'kids aged 10–12 who love games and prizes'),
    says: [
      L3("Qatorga «komikslarni yaxshi ko'radi» degan so'zlarni qo'shdik. Voy, saytda darrov «Komikslar» kartochkasi chiqdi!", 'Добавим: любят комиксы. На сайте сразу появилась карточка «Комиксы»!', 'We add: they love comics. A “Comics” card appeared on the site right away!'),
      L3("Endi sarguzashtlarni ham qo'shdik. Mana, «Sarguzashtlar» kartochkasi ham paydo bo'ldi. Sun'iy intellekt bolalar yaxshi ko'rgan narsani saytga qo'yib boryapti.", 'Добавим ещё приключения. Вот появились и «Приключения». ИИ ставит на сайт то, что они любят.', 'Let’s add adventures too. There, “Adventures” appeared. The AI puts what they love on the site.'),
      L3("Agar bu bolalar o'yin bilan sovg'alarni yaxshi ko'rsa-chi? Qarang, kartochkalar ham butunlay almashdi.", 'А если они любят игры и подарки? Смотри, и карточки стали другими.', 'And what if they love games and prizes? Look, the cards changed too.')
    ],
    done: L3("Demak, «Kim uchun?» qatoriga auditoriyaning yoshi bilan birga qiziqishini ham yozamiz. Shunda sun'iy intellekt saytni aynan ularga qiziq qilib yasaydi.", 'Значит, в строку «Для кого?» пиши не только возраст, но и что они любят. ИИ сделает сайт для них ещё интереснее.', 'So in the “Who for?” line write not only the age but also what they love. The AI will make the site even more fun for them.'),
    asks: [L3('Qarang: faqat yoshi', 'Смотри: только возраст', 'Watch: just the age'), L3('Qarang: komikslar', 'Смотри: комиксы', 'Watch: comics'),
      L3('Qarang: sarguzashtlar', 'Смотри: приключения', 'Watch: adventures'), L3("Qarang: o'yin va sovg'alar", 'Смотри: игры и подарки', 'Watch: games and prizes')],
    askDone: L3("Qiziqishlar saytga kartochka bo'lib tushadi", 'Интересы попадают на сайт карточками', 'Interests land on the site as cards')
  },
  s6: {
    eyebrow: L3('Qiziqishlar', 'Интересы', 'Interests'),
    card: { h: BUY, t: L3("Maktabda «Hayvonlar bayrami» bo'ladi. U 8–10 yoshli bolalar uchun, ular hayvonlarni va o'yinlarni yaxshi ko'radi.", 'В школе будет «Праздник животных». Он для детей 8–10 лет, они любят животных и игры.', 'The school is holding an “Animal Festival”. It’s for kids aged 8–10, who love animals and games.') },
    say: L3("Maktabimizda tez orada hayvonlar bayrami bo'ladi! Buyurtmani o'qing-da, «Kim uchun?» qatoriga ikkita narsani yozing: bayram kimlar uchun va ular nimani yaxshi ko'radi.",
      'Теперь ты. В школе будет праздник животных. Прочитай заказ и напиши в строку «Для кого?», для кого он и что они любят.',
      'Your turn. The school is holding an animal festival. Read the request and write in the “Who for?” line who it’s for and what they love.'),
    what: L3('Hayvonlar bayrami sayti', 'Сайт праздника животных', 'An animal festival site'),
    why: L3('bolalar bayramga kelsin', 'чтобы дети пришли на праздник', 'get kids to come to the festival'),
    ph: L3("kim uchun va nimani yaxshi ko'radi?", 'для кого и что они любят?', 'who for and what do they love?'),
    msgs: {
      other: L3("Buyurtmada yoshi aniq yozilgan-ku: bayram sakkiz yoshdan o'n yoshgacha bo'lgan bolalar uchun.", 'В заказе указан возраст: дети от восьми до десяти лет.', 'The request gives an age: kids from eight to ten.'),
      noLike: L3("Bolalarni to'g'ri yozdingiz. Endi ular nimani yaxshi ko'rishini ham qo'shing, bu ham buyurtmada bor.", 'Кто они — есть. Теперь добавь, что они любят: это есть в заказе.', 'You’ve got who they are. Now add what they love: it’s in the request.')
    },
    hints: [
      L3("Buyurtmada ikki narsani topasiz: bayramga kimlar keladi va ular nimani yaxshi ko'radi.", 'В заказе две вещи: кто они и что любят.', 'The request has two things: who they are and what they love.'),
      L3("Oldin yoshi bilan kimligini yozing, keyin ular nimani yaxshi ko'rishini qo'shing.", 'Сначала возраст и кто они, потом — что они любят.', 'First their age and who they are, then what they love.'),
      L3("Namunadagi qatorni ko'chirib yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("8–10 yoshli bolalar, hayvonlar va o'yinlarni yaxshi ko'radi", 'дети 8–10 лет, любят животных и игры', 'kids aged 8–10 who love animals and games'),
    ok: L3("Ajoyib! Saytda «Hayvonlar» bilan «O'yinlar» kartochkalari chiqdi, harflar ham katta, ranglar ham yorqin bo'ldi. Bayramga keladigan bolalar buni darrov yoqtirib qoladi!", 'Класс! На сайте появились карточки «Животные» и «Игры», буквы крупные и яркие. Это сайт именно для детей!', 'Great! “Animals” and “Games” cards appeared, with big bright letters. This is a site made for kids!'),
    ask: L3("Kimlar va nimani yaxshi ko'rishini yozing", 'Напиши, кто они и что любят', 'Write who they are and what they love')
  },
  s7: {
    eyebrow: L3('Qaysi qator?', 'Какая строка?', 'Which line?'),
    say: L3("Endi uchala savolni aralashtirib yuboramiz! Kartochkadagi so'zlar promptning qaysi qatoriga tushadi: «Nima?» qatorigami, «Nega?» qatorigami yoki «Kim uchun?» qatorigami?",
      'Теперь используем все три вопроса. Я говорю фразу, а ты выбираешь, в какую строку промпта она попадает: Что, Зачем или Для кого?',
      'Now let’s use all three questions. I say a phrase, and you choose which prompt line it goes in: What, Why or Who for?'),
    card: L3('Bu qaysi qatorga?', 'В какую строку?', 'Which line is it?'),
    ask: L3('Qatorni tanlang', 'Выбери строку', 'Choose the line'),
    hint1: L3("Bu so'zlar nima haqida: saytning o'zi haqidami, maqsad haqidami yoki odamlar haqidami?", 'О чём фраза: о вещи, о цели или о людях?', 'What is the phrase about: a thing, a goal or people?'),
    hint2: L3("Sayt nima ekanini «Nima?» qatori aytadi. «Kim nima qilsin?» degan savolga «Nega?» qatori javob beradi. Kimlar va necha yoshda ekani esa «Kim uchun?» qatorida turadi.", 'Что за сайт — это «Что?». Кто что должен сделать — «Зачем?». Кто они и сколько им лет — «Для кого?».', 'What the site is: “What?”. Who should do what: “Why?”. Who they are and their age: “Who for?”.'),
    items: [
      { t: L3('Rasm kursi sayti', 'Сайт курса рисования', 'A drawing course site'), right: 'what', why: L3("Bu so'zlar nima yaratayotganimizni aytadi: rasm kursi sayti.", 'Это что мы создаём: сайт курса рисования.', 'That’s what we’re making: a drawing course site.') },
      { t: L3('7–9 yoshli bolalar', 'дети 7–9 лет', 'kids aged 7–9'), right: 'who', why: L3("Bu yerda saytni kimlar ko'rishi va ularning yoshi aytilgan.", 'Это для кого: с возрастом.', 'That’s who it’s for, with an age.') },
      { t: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'), right: 'why', why: L3("Gap saytning ishi haqida: odamlar pitsa buyurtma qilsin.", 'Это цель: что делает сайт.', 'That’s the goal: what the site does.') },
      { t: L3("futbolni yaxshi ko'radigan o'smirlar", 'подростки, которые любят футбол', 'teens who love football'), right: 'who', why: L3("O'smirlar auditoriya bo'ladi, futbol esa ularning qiziqishi.", 'Это аудитория и её интерес.', 'That’s the audience and its interest.') },
      { t: L3("o'quvchilar kursga yozilsin", 'чтобы ученики записывались на курс', 'get students to sign up for the course'), right: 'why', why: L3("Bunda kim nima qilsin, aytilgan: o'quvchilar kursga yozilsin. Bu maqsad bo'ladi.", 'Это цель: кто что должен сделать.', 'That’s the goal: who should do what.') },
      { t: L3("Kitob do'koni sayti", 'Сайт книжного магазина', 'A bookshop site'), right: 'what', why: L3("Kitob do'koni sayti aniq narsa bo'ladi, u saytning o'zini aytadi.", 'Это конкретная вещь: сайт книжного магазина.', 'That’s a specific thing: a bookshop site.') }
    ],
    right: L3("Topdingiz!", 'Точно!', 'Exactly!'),
    ok: L3("Oltita gapning hammasi o'z joyida! Endi uchala savolni bir-biridan bemalol ajratasiz.", 'Класс! Ты различаешь все три вопроса.', 'Great! You can tell all three questions apart.')
  },
  s8: {
    eyebrow: L3('Yangi buyurtma', 'Новый заказ', 'A new request'),
    card: { h: BUY, t: L3("Mahalla oshxonasi sayt so'rayapti. Ovqatni ko'pincha mahalladagi buvi va bobolar buyurtma qiladi.", 'Столовая нашего района просит сайт. Еду чаще всего заказывают бабушки и дедушки района.', 'Our neighbourhood canteen wants a site. Most orders come from the grandparents in the area.') },
    say: L3("Mahallamizdagi oshxona ham sayt so'rabdi. Ovqatni u yerdan kim ko'p buyurtma qilarkan? Buyurtmani diqqat bilan o'qing-chi, javob o'sha yerda.",
      'Новый заказ! Столовая нашего района попросила сайт. Внимательно прочитай заказ: для кого этот сайт?',
      'A new request! Our neighbourhood canteen asked for a site. Read the request carefully: who is the site for?'),
    what: L3('Mahalla oshxonasi sayti', 'Сайт столовой нашего района', 'Our neighbourhood canteen site'),
    why: L3('odamlar ovqat buyurtma qilsin', 'чтобы люди заказывали еду', 'get people to order food'),
    ph: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    msgs: {
      other: L3("Buyurtmada bir muhim gap bor: ovqatni ko'pincha kimlar buyurtma qiladi?", 'Посмотри в заказ: кто чаще всего заказывает еду?', 'Check the request: who orders the food most often?')
    },
    hints: [
      L3("Buyurtmaning ikkinchi gapini o'qing: unda ovqatni kimlar buyurtma qilishi yozilgan.", 'В заказе написано, кто заказывает еду.', 'The request says who orders the food.'),
      L3("Ovqatni asosan mahalladagi buvi va bobolar buyurtma qiladi.", 'Это бабушки и дедушки, то есть старшее поколение.', 'They’re grandparents, that is, older people.'),
      L3("Pastdagi namunaga qarab yozing, keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('mahalladagi buvi va bobolar', 'бабушки и дедушки нашего района', 'grandparents in our neighbourhood'),
    ok: L3("Mana endi buvim ham bemalol o'qiy oladi! Harflar juda katta, telefon raqami ham darrov ko'rinib turibdi. Buvi va bobolarga qulay sayt chiqdi.", 'Огонь! Буквы очень крупные, номер телефона сразу виден. Вышел удобный сайт для бабушек и дедушек.', 'Awesome! Very big letters and the phone number right there. A site that’s easy for grandparents.'),
    ask: L3("«Kim uchun?» qatorini yozing", 'Напиши строку «Для кого?»', 'Write the “Who for?” line')
  },
  s9: {
    eyebrow: L3('Ikki auditoriya', 'Две аудитории', 'Two audiences'),
    help: [
      L3("«Kim uchun?» qatoriga qarang-chi, keyin saytning tepasiga va eng pastki bo'limiga.", 'Посмотри на строку промпта, на верх сайта и на нижний раздел.', 'Look at the prompt line, the top of the site and the bottom section.'),
      L3("Ba'zan saytning ikkita auditoriyasi bo'ladi: uni ikki xil odam ko'radi. Biri tanlaydi, ikkinchisi esa «mayli» deydi va pulini to'laydi.", 'Две аудитории — это когда сайт смотрят двое разных: один выбирает, другой решает.', 'Two audiences means two different kinds of people look at the site: one chooses, the other decides.'),
      L3("O'yinchoq do'konida nima bo'ladi? Bolalar o'yinchoq tanlaydi, ota-onalar esa narxiga qaraydi. Ikki auditoriyali sayt ham ikkalasiga yoqishi kerak.", 'В магазине игрушек дети выбирают игрушку, а родители смотрят на цену.', 'In a toy shop, kids choose the toy and parents look at the price.')
    ],
    say: L3("Buvi va bobolar bilan ish oson edi, auditoriya bitta edi. Endi qiyinroq holat: yozgi lager. Uni bolalar tanlaydi-yu, pulini ota-onalar to'laydi. Demak, bu saytni ikki xil odam ochadi. Hozircha esa sayt faqat bolalar uchun yasalgan. Ota-onalar-chi?",
      'Бывает, что сайт смотрят двое разных людей. Летний лагерь выбирают дети, а платят родители. Смотри, сейчас сайт только для детей.',
      'Sometimes two different kinds of people look at a site. Kids choose a summer camp, but parents pay. Look, right now the site is only for kids.'),
    what: L3('Yozgi lager sayti', 'Сайт летнего лагеря', 'A summer camp site'),
    why: L3('bolalar lagerga yozilsin', 'чтобы детей записывали в лагерь', 'get kids signed up for camp'),
    c0: L3('8–12 yoshli bolalar', 'дети 8–12 лет', 'kids aged 8–12'),
    c1: L3('ularning ota-onalari', 'их родители', 'their parents'),
    c2: L3('8–12 yoshli bolalar va ularning ota-onalari', 'дети 8–12 лет и их родители', 'kids aged 8–12 and their parents'),
    says: [
      L3("Endi qatorga faqat ota-onalarni yozdik. Sayt sokinlashdi, xavfsizlik bilan narx chiqdi. Lekin bolalarga endi umuman qiziq emas-da!", 'Теперь напишем только родителей. Сайт стал спокойным, появились безопасность и цены, но детям уже неинтересно.', 'Now we write only parents. The site calmed down, safety and prices appeared, but it’s no fun for kids any more.'),
      L3("Endi ikkalasini birga yozdik: bolalar va ularning ota-onalari. Mana, saytning tepasi bolalar uchun yorqin, pastida esa ota-onalarga alohida bo'lim bor. Hamma xursand!", 'Пишем обоих: дети и их родители. Вот: верх яркий для детей, внизу — раздел для родителей. Довольны все!', 'We write both: kids and their parents. There: a bright top for kids, a section for parents below. Everyone’s happy!')
    ],
    done: L3("Xullas, saytni ikki xil odam ko'rsa, ikkalasini ham yozamiz: oldin asosiysini, keyin ikkinchisini.", 'Значит, если сайт смотрят двое разных, пиши обоих: сначала главного, потом второго.', 'So if two kinds of people look at the site, write both: the main one first, then the second.'),
    asks: [L3('Qarang: faqat bolalar', 'Смотри: только дети', 'Watch: kids only'), L3('Qarang: faqat ota-onalar', 'Смотри: только родители', 'Watch: parents only'), L3('Qarang: ikkalasi ham', 'Смотри: оба', 'Watch: both')],
    askDone: L3("Ikki auditoriya bo'lsa, ikkalasini yozing", 'Две аудитории — пиши обе', 'Two audiences? Write both')
  },
  s10: {
    eyebrow: L3('Ikki auditoriya', 'Две аудитории', 'Two audiences'),
    card: { h: BUY, t: L3("Suzish kursi 6–9 yoshli bolalarni kutadi. Bolalarni ota-onalari yozdiradi, ular xavfsizlik va narxni so'raydi.", 'Курс плавания ждёт детей 6–9 лет. Записывают их родители — они спрашивают о безопасности и ценах.', 'The swimming course is for kids aged 6–9. Their parents sign them up and ask about safety and prices.') },
    say: L3("Suzish kursi ham sayt so'rayapti. Buyurtmani o'qisangiz, unda ikki xil odamni topasiz. Qani, ikkalasini ham «Kim uchun?» qatoriga yozing.",
      'Теперь ты. Курс плавания попросил сайт. Прочитай заказ: тут двое разных людей. Напиши обоих в строку «Для кого?».',
      'Your turn. The swimming course asked for a site. Read the request: there are two kinds of people here. Write both in the “Who for?” line.'),
    what: L3('Suzish kursi sayti', 'Сайт курса плавания', 'A swimming course site'),
    why: L3('bolalar kursga yozilsin', 'чтобы детей записывали на курс', 'get kids signed up for the course'),
    ph: L3('kimlar uchun?', 'для кого?', 'who for?'),
    msgs: {
      noParents: L3("Bolalarni yozibsiz, lekin ularni kursga kim yozdiradi? Ota-onalarni ham qo'shing.", 'Дети есть, а кто их записывает? Добавь и родителей.', 'You’ve got the kids, but who signs them up? Add the parents too.'),
      noKids: L3("Ota-onalar bor ekan. Lekin suzishni kim o'rganadi? Bolalarni ham yozing.", 'Родители есть. А курс для кого? Напиши и детей.', 'You’ve got the parents. But who is the course for? Write the kids too.'),
      other: L3("Buyurtmaga yana bir qarang-chi: kim suzadi-yu, kim yozdiradi?", 'Посмотри в заказ: кто плавает и кто записывает?', 'Check the request: who swims and who signs them up?')
    },
    hints: [
      L3("Buyurtmada ikki xil odam bor. Ulardan qaysi biri suzadi, qaysi biri yozdiradi?", 'Кто в заказе: кто плавает и кто записывает?', 'Who’s in the request: who swims and who signs them up?'),
      L3("Bolalarni ham, ota-onalarni ham yozing, ularni «va» so'zi bilan ulang.", 'Дети и родители: напиши обоих через «и».', 'Kids and parents: write both, joined with “and”.'),
      L3("Namunadagi qatorni yozib chiqing, keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('6–9 yoshli bolalar va ularning ota-onalari', 'дети 6–9 лет и их родители', 'kids aged 6–9 and their parents'),
    ok: L3("Barakalla! Ikkala auditoriyani ham yozdingiz, shuning uchun sayt ikkiga bo'lindi: tepasi bolalarni quvontiradi, pastki bo'limi esa ota-onalarning savollariga javob beradi.", 'Молодец! Верх яркий для детей, внизу для родителей — безопасность и цены. Сайт подходит обоим.', 'Well done! A bright top for kids, safety and prices for parents below. The site suits both.'),
    ask: L3('Ikkala auditoriyani yozing', 'Напиши обе аудитории', 'Write both audiences')
  },
  g1: {
    eyebrow: L3('Taxmin', 'Догадка ИИ', 'The AI’s guess'),
    card: { h: BUY, t: L3("Raqs to'garagi ustozi: «Bizga 5–7 yoshli kichkintoylar keladi».", 'Руководитель танцевального кружка: «К нам приходят малыши 5–7 лет».', 'The dance club teacher: “Little ones aged 5–7 come to us.”') },
    say: L3("Raqs to'garagining saytiga qarang-chi: qora va oltin rangli, jiddiy sayt. Kimga o'xshaydi? Kattalarga! Chunki men «Kim uchun?» qatorini tashlab ketgandim, sun'iy intellekt esa o'zicha taxmin qildi. Ustoz bo'lsa, bizga kichkintoylar keladi, deyapti. Qani, «Kim uchun?» qatorini yozing.",
      'Я не написал «Для кого?» для танцевального кружка. Смотри, ИИ сам догадался: для взрослых! Вышел строгий сайт в чёрном с золотом. А руководитель говорит, что приходят малыши. Напиши строку «Для кого?».',
      'I didn’t write “Who for?” for the dance club. Look, the AI guessed by itself: for adults! It made a serious black-and-gold site. But the teacher says little ones come. Write the “Who for?” line.'),
    what: L3("Raqs to'garagi sayti", 'Сайт танцевального кружка', 'A dance club site'),
    why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'),
    guess: L3('kattalar', 'взрослые', 'adults'),
    guessTag: L3('Taxmin', 'Догадка', 'Guess'),
    ph: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    msgs: {
      guess: L3("Sayt yana kattalarga moslashdi. Ustoz to'garakka kimlar keladi, degan edi?", 'Это снова для взрослых. Кто, по словам руководителя, приходит?', 'That’s for adults again. Who did the teacher say comes?'),
      other: L3("Ustozning so'zlarini o'qing: to'garakka besh yoshdan yetti yoshgacha bo'lgan kichkintoylar keladi.", 'Посмотри в заказ: в кружок приходят малыши от пяти до семи лет.', 'Check the request: little ones from five to seven come to the club.')
    },
    hints: [
      L3("Sayt hozir kimlarga moslangan? Ustoz esa kimlar keladi, deyapti?", 'Кого додумал ИИ? А кого назвал руководитель?', 'Who did the AI guess? And who did the teacher name?'),
      L3("Ustoz kichkintoylarni aytdi, ularning yoshini ham qo'shib qo'ydi.", 'Руководитель назвал малышей и их возраст.', 'The teacher named little ones and their age.'),
      L3("Namunadagi kabi yozing, keyin «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3('5–7 yoshli kichkintoylar', 'малыши 5–7 лет', 'little ones aged 5–7'),
    ok: L3("Ana, kichkintoylarga mos sayt chiqdi! Qora bilan oltin rang ketib, sayt yorqin va quvnoq bo'ldi. Kim uchun ekanini aytib qo'ysangiz, sun'iy intellekt endi adashmaydi.", 'Огонь! Чёрное с золотом ушло, сайт стал ярким и весёлым. Скажи, для кого сайт, — и ИИ не будет гадать.', 'Awesome! The black and gold are gone; the site is bright and cheerful. Say who it’s for and the AI won’t guess.'),
    ask: L3("Taxminni to'g'ri auditoriya bilan almashtiring", 'Замени догадку ИИ настоящей аудиторией', 'Replace the AI’s guess with the real audience')
  },
  det: {
    eyebrow: L3('Detektiv', 'Детектив', 'Detective'),
    say: L3("Yana detektivlik qilamiz, lekin bu safar odamlarni qidiramiz! Saytning ko'rinishiga qarab toping: u kim uchun yaratilgan va promptning «Kim uchun?» qatorida nima yozilgan edi?",
      'Теперь побудем детективами. По сайту найдём: для кого он сделан и что было написано в промпте?',
      'Let’s be detectives. From the site we’ll work out who it was made for and what the prompt said.'),
    ask: L3('Saytga qarab auditoriyani toping', 'Найди аудиторию по сайту', 'Work out the audience from the site'),
    qWhom: L3('Bu sayt kim uchun?', 'Для кого этот сайт?', 'Who is this site for?'),
    qWhich: L3("Qaysi «Kim uchun?» shu saytni yaratdi?", 'Какое «Для кого?» дало этот сайт?', 'Which “Who for?” made this site?'),
    whom: { kids: L3('Bolalar', 'Дети', 'Kids'), parents: L3('Ota-onalar', 'Родители', 'Parents'), old: L3('Buvi va bobolar', 'Бабушки и дедушки', 'Grandparents') },
    hint1: L3("Saytdagi harflarga, ranglarga va qo'shimcha bo'limlarga bir qarang-chi.", 'Посмотри на буквы, цвета и дополнительные разделы.', 'Look at the letters, the colours and the extra sections.'),
    hint2: L3("Bolalar uchun sayt yorqin, harflari katta bo'ladi. Ota-onalar uchun xavfsizlik bilan narx chiqadi. Buvi va bobolar uchun esa harflar juda katta, telefon raqami ham ko'zga tashlanib turadi.", 'Детям — ярко и крупно. Родителям — безопасность и цены. Старшим — очень крупные буквы и телефон.', 'For kids: bright and big. For parents: safety and prices. For older people: very big letters and a phone number.'),
    items: [
      { type: 'whom', site: { what: L3("Robot to'garagi sayti", 'Сайт кружка робототехники', 'A robotics club site'), why: L3("bolalar to'garakka yozilsin", 'чтобы дети записывались в кружок', 'get kids to sign up for the club'), who: L3('7–9 yoshli bolalar', 'дети 7–9 лет', 'kids aged 7–9') },
        right: 'kids', why: L3("Harflar katta, ranglar yorqin, tugma o'yinchoqqa o'xshaydi. Bunday sayt bolalar uchun yasaladi.", 'Буквы крупные, цвета яркие, кнопка как игрушка: это для детей.', 'Big letters, bright colours, a toy-like button: this is for kids.') },
      { type: 'whom', site: { what: L3("Pitsa do'koni sayti", 'Сайт пиццерии', 'A pizza shop site'), why: L3('odamlar pitsa buyurtma qilsin', 'чтобы люди заказывали пиццу', 'get people to order pizza'), who: L3('keksalar', 'пожилые люди', 'senior citizens') },
        right: 'old', why: L3("Harflar juda katta, telefon raqami ham ko'zga tashlanib turibdi. Bunaqa saytni buvi va bobolar uchun qilishadi.", 'Очень крупные буквы и номер телефона: это для старшего поколения.', 'Very big letters and a phone number: this is for older people.') },
      { type: 'whom', site: { what: L3('Suzish kursi sayti', 'Сайт курса плавания', 'A swimming course site'), why: L3('bolalar kursga yozilsin', 'чтобы детей записывали на курс', 'get kids signed up for the course'), who: L3('bolalarning ota-onalari', 'родители детей', 'parents of young children') },
        right: 'parents', why: L3("Ranglari sokin, saytda xavfsizlik, narx va jadval bor. Ota-onalar aynan shularni qidiradi.", 'Спокойные цвета, безопасность, цены и расписание: это для родителей.', 'Calm colours, safety, prices and a schedule: this is for parents.') },
      { type: 'which', site: { what: L3("Kitob ko'rgazmasi sayti", 'Сайт книжной выставки', 'A book fair site'), why: L3("bolalar ko'rgazmaga kelsin", 'чтобы дети пришли на выставку', 'get kids to come to the fair'), who: L3("10–12 yoshli bolalar, komikslarni yaxshi ko'radi", 'дети 10–12 лет, любят комиксы', 'kids aged 10–12 who love comics') },
        a: L3("10–12 yoshli bolalar, sportni yaxshi ko'radi", 'дети 10–12 лет, любят спорт', 'kids aged 10–12 who love sport'), b: L3('ota-onalar', 'родители', 'parents'), c: L3("10–12 yoshli bolalar, komikslarni yaxshi ko'radi", 'дети 10–12 лет, любят комиксы', 'kids aged 10–12 who love comics'),
        right: 'c', why: L3("Saytda «Komikslar» kartochkasi turibdi, demak, promptda komikslar yozilgan ekan. Ular faqat C variantida bor.", 'На сайте есть карточка «Комиксы» — значит, в промпте написаны комиксы. Это C.', 'The site has a “Comics” card, so the prompt mentioned comics. That’s C.') }
    ],
    right: L3('Barakalla!', 'Точно!', 'Exactly!'),
    ok: L3("Qoyil! Endi sayt kim uchun yasalganini uning ko'rinishidan bilib olasiz.", 'Класс! Ты находишь аудиторию сайта по его виду.', 'Great! You can work out a site’s audience just by looking at it.')
  },
  s12: {
    eyebrow: L3('Kodining xatosi', 'Ошибка Коди', 'Kodi’s mistake'),
    card: { h: BUY, t: L3("Server rahbari: «Serverimizda 10–13 yoshli o'yinchilar o'ynaydi, ular qurilishni yaxshi ko'radi».", 'Админ сервера: «У нас играют ребята 10–13 лет, они любят строить».', 'The server admin: “Our players are aged 10–13, and they love building.”') },
    say: L3("Mana, mening navbatdagi promptim: Minecraft serverimiz uchun. «Kim uchun?» qatoriga esa «hamma uchun» deb qo'ydim. Natijasi ko'rinib turibdi: sayt hech kimga moslanmagan, oddiygina chiqdi. Server rahbari esa kimlar o'ynashini aniq aytgan edi. Qatorimni to'g'rilashga yordam berasizmi?",
      'Ой, я написал для сайта сервера в строку «Для кого?» «для всех». Сайт ни под кого не подстроился, вышел обычным. А админ сказал, кто играет. Исправь мою строку.',
      'Oops, for the server site I wrote “for everyone” in the “Who for?” line. The site didn’t adapt to anyone and came out plain. But the admin said who plays. Fix my line.'),
    what: L3('Minecraft serverimiz sayti', 'Сайт нашего сервера Minecraft', 'Our Minecraft server site'),
    why: L3("o'yinchilar serverga qo'shilsin", 'чтобы игроки вступали на сервер', 'get players to join the server'),
    bad: L3('hamma uchun', 'для всех', 'for everyone'),
    ph: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    msgs: {
      all: L3("Qatorda hali ham «hamma uchun» turibdi. Rahbar serverda kimlar o'ynashini aytgan-ku, buyurtmani o'qing.", '«Для всех» осталось. Админ сказал, кто играет: прочитай заказ.', '“For everyone” is still there. The admin said who plays: read the request.'),
      noLike: L3("Yoshi joyida. Endi o'yinchilar nimani yaxshi ko'rishini ham qo'shing.", 'Возраст есть. А что они любят? Добавь и это.', 'You’ve got the age. What do they love? Add that too.'),
      other: L3("Rahbar nima degan edi? Serverda o'n yoshdan o'n uch yoshgacha bo'lgan o'yinchilar o'ynaydi.", 'Посмотри в заказ: на сервере играют ребята от десяти до тринадцати лет.', 'Check the request: the players are aged ten to thirteen.')
    },
    hints: [
      L3("Rahbar ikki narsani aytgan: o'yinchilarning yoshini va ular nimani yaxshi ko'rishini.", 'Админ сказал две вещи: возраст игроков и что они любят.', 'The admin said two things: the players’ age and what they love.'),
      L3("«Hamma uchun» degan so'zlarni o'chiring-da, o'rniga oldin yoshni, keyin qiziqishni yozing.", 'Сотри «для всех» и напиши возраст, а потом интерес.', 'Delete “for everyone” and write the age, then the interest.'),
      L3("Namunadagi so'zlarni qatorga yozib chiqing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("10–13 yoshli o'yinchilar, qurilishni yaxshi ko'radi", 'игроки 10–13 лет, любят строить', 'players aged 10–13 who love building'),
    ok: L3("Rahmat, qatorim tuzaldi! Sayt o'yinchilarga moslashdi, «Qurilish» kartochkasi ham chiqdi. Endi qurishni yaxshi ko'radiganlar serverimizga bemalol qo'shiladi.", 'Класс! Сайт подстроился под подростков, и появилась карточка «Стройка». Теперь он точно для игроков.', 'Great! The site adapted to teens and a “Building” card appeared. Now it’s really for the players.'),
    ask: L3("Kodining qatorini tuzating", 'Исправь «для всех»', 'Fix “for everyone”')
  },
  s13: {
    eyebrow: L3('Uchala qator', 'Все три строки', 'All three lines'),
    card: { h: BUY, t: L3("Maktabda robotlar ko'rgazmasi bo'ladi. Unga 9–11 yoshli bolalar kelsin, ular o'yinlarni yaxshi ko'radi.", 'В школе будет выставка роботов. Пусть на неё придут дети 9–11 лет, они любят игры.', 'The school is holding a robot fair. Kids aged 9–11 should come; they love games.') },
    say: L3("Maktabimizda robotlar ko'rgazmasi bo'ladi, sayti esa hali yo'q! Promptni noldan, uchala qatori bilan yozib chiqing. Buyurtmani o'qing-da, «Nima?», «Nega?» va «Kim uchun?» qatorlarini birma-bir to'ldiring.",
      'Теперь все три строки пишешь ты. В школе будет выставка роботов. Прочитай заказ и напиши «Что?», «Зачем?» и «Для кого?».',
      'Now you write all three lines. The school is holding a robot fair. Read the request and write “What?”, “Why?” and “Who for?”.'),
    phWhat: L3('nima yaratamiz?', 'что создаём?', 'what are we making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3('sayt kim uchun?', 'для кого сайт?', 'who is the site for?'),
    msgs: {
      noWhat: L3("Boshidan boshlaymiz: «Nima?» qatoriga qanday sayt yaratishimizni yozing.", 'Напиши строку «Что?»: какой сайт создаём?', 'Write the “What?” line: what site are we making?'),
      topic: L3("Ko'rgazmada robotlar bo'ladi-ku! Sayt ham robotlar haqida bo'lishi kerak.", 'Сайт должен быть про роботов: прочитай заказ.', 'The site should be about robots: read the request.'),
      kind: L3("Robotlar hozircha faqat mavzu bo'lib turibdi. Aniq nima: ko'rgazmami yoki do'konmi?", 'Это только тема. Что именно про роботов: выставка, магазин? Напиши точно.', 'That’s just a topic. What exactly about robots: a fair, a shop? Be specific.'),
      noWhy: L3("«Nima?» joyida. Endi «Nega?» qatoriga sayt nima qilishi kerakligini yozing.", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      pretty: L3("Bu shunchaki istak, xolos. Saytni ochgan bolalar nima qilishi kerak?", 'Это пожелание, а не цель. Что сайт должен сделать для гостя?', 'That’s a wish, not a goal. What should the site do for a visitor?'),
      goal: L3("Maqsad buyurtmaning o'zida yozilgan: bolalar ko'rgazmaga kelsin.", 'В заказе есть цель: чтобы дети пришли на выставку.', 'The request has a goal: kids should come to the fair.'),
      noWho: L3("Ikki qator tayyor! Endi «Kim uchun?» qatori qoldi: saytni kimlar ko'radi?", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?'),
      other: L3("Buyurtmada ko'rgazmaga kimlar kelishi aniq yozilgan: to'qqiz yoshdan o'n bir yoshgacha bo'lgan bolalar.", 'В заказе сказано, кто придёт: дети от девяти до одиннадцати лет.', 'The request says who should come: kids aged nine to eleven.')
    },
    hints: [
      L3("Buyurtmani sinchiklab o'qing: unda uchala savolning javobi bor.", 'В заказе есть все три ответа: что, зачем и для кого.', 'The request has all three answers: what, why and who for.'),
      L3("«Nima?» qatoriga robotlar ko'rgazmasi sayti, «Nega?» qatoriga bolalar kelsin, «Kim uchun?» qatoriga esa bolalarning yoshi bilan qiziqishi yoziladi.", 'Что: сайт выставки роботов. Зачем: чтобы дети пришли. Для кого: возраст и интерес.', 'What: a robot fair site. Why: kids should come. Who for: age and interest.'),
      L3("Namunadagi uch qatorni o'z joylariga yozing-da, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Robotlar ko'rgazmasi sayti · bolalar ko'rgazmaga kelsin · 9–11 yoshli bolalar, o'yinlarni yaxshi ko'radi", 'Сайт выставки роботов · чтобы дети пришли на выставку · дети 9–11 лет, любят игры', 'A robot fair site · get kids to come to the fair · kids aged 9–11 who love games'),
    ok: L3("Ana endi to'liq prompt! Robotlar ko'rgazmasi sayti to'qqiz-o'n bir yoshli bolalarni o'yinlar bilan kutib olyapti.", 'Молодец! Все три строки написаны тобой, и сайт вышел именно для этих детей.', 'Well done! You wrote all three lines, and the site came out just right for these kids.'),
    ask: L3('Uchala qatorni yozing', 'Напиши все три строки', 'Write all three lines')
  },
  s14: {
    eyebrow: L3("O'z saytingiz", 'Твой сайт', 'Your site'),
    say: L3("Endi o'zingizga yoqqan narsa uchun sayt o'ylab toping: klubmi, o'yin serverimi, do'konmi yoki bayrammi. Uchala qatorni yozasiz, faqat sayt kim uchun ekanini aniq ayting, bu bugungi eng muhim qator!",
      'А теперь твой сайт! Придумай сайт для того, что тебе нравится: клуб, игровой сервер, магазин или праздник. Напиши все три строки и точно скажи, для кого он.',
      'Now your own site! Think of a site for something you love: a club, a game server, a shop or a party. Write all three lines and say exactly who it’s for.'),
    phWhat: L3('nima yaratasiz?', 'что создаёшь?', 'what are you making?'),
    phWhy: L3('sayt nima qilishi kerak?', 'что должен сделать сайт?', 'what should the site do?'),
    phWho: L3("kim uchun va nimani yaxshi ko'radi?", 'для кого и что они любят?', 'who for and what do they love?'),
    msgs: {
      noWhat: L3("«Nima?» qatori bo'sh qolibdi. Qanday sayt yaratasiz?", 'Напиши строку «Что?»: какой сайт создаёшь?', 'Write the “What?” line: what site are you making?'),
      kind: L3("Hozircha bu mavzuga o'xshaydi. Aniq narsani yozing: klub, server, do'kon yoki bayram sayti.", 'Это только тема. Напиши конкретную вещь: сайт клуба, сервера, магазина или праздника.', 'That’s just a topic. Write a specific thing: a club, server, shop or party site.'),
      noWhy: L3("Saytingiz nima ish qiladi? Buni «Nega?» qatoriga yozing.", 'Теперь напиши строку «Зачем?»: что должен сделать сайт?', 'Now write the “Why?” line: what should the site do?'),
      pretty: L3("Bunday istak maqsad bo'lolmaydi. Saytingizni ochgan mehmon nima qilsin?", 'Это пожелание, а не цель. Что сайт должен сделать для гостя?', 'That’s a wish, not a goal. What should the site do for a visitor?'),
      goal: L3("Maqsadni aniqroq yozing: odamlar yozilsinmi, buyurtma qilsinmi yoki kelsinmi?", 'Напиши цель: чтобы записывались, заказывали или приходили?', 'Write the goal: should people sign up, order or come?'),
      noWho: L3("Eng muhim qator qoldi. Saytingizni kimlar ochadi? Shuni «Kim uchun?» qatoriga yozing.", 'Теперь напиши строку «Для кого?»: кто будет смотреть сайт?', 'Now write the “Who for?” line: who will look at the site?')
    },
    hints: [
      L3("O'zingizdan uchta savol so'rang: nima yarataman, odamlar nima qilsin va sayt kim uchun?", 'Что создаёшь? Что они должны сделать? Для кого сайт?', 'What are you making? What should they do? Who is the site for?'),
      L3("«Kim uchun?» qatoriga auditoriyaning yoshini va nimani yaxshi ko'rishini yozing.", 'В строку «Для кого?» напиши возраст и что они любят.', 'In the “Who for?” line write their age and what they love.'),
      L3("Namunadagidek yozib, «Yuborish»ni bosing.", 'Напиши как в образце и нажми «Отправить».', 'Write it like the example and tap Send.')
    ],
    sample: L3("Futbol klubimiz sayti · bolalar klubga yozilsin · futbolni yaxshi ko'radigan 11–13 yoshli bolalar", 'Сайт нашего футбольного клуба · чтобы ребята записывались в клуб · дети 11–13 лет, которые любят футбол', 'Our football club site · get kids to sign up for the club · kids aged 11–13 who love football'),
    ok: L3("Voy, mana bu sayt! Endi uni ochgan odam darrov «Bu aynan men uchun-ku!» deb o'ylaydi.", 'Ого, классно! Это твой промпт из трёх строк. Дома отправишь его настоящему ИИ.', 'Wow, great! That’s your three-line prompt. At home you’ll send it to a real AI.'),
    ask: L3("O'z saytingiz uchun uchta qatorni yozing", 'Напиши три строки для своего сайта', 'Write three lines for your own site')
  },
  q1: {
    eyebrow: L3("To'g'rimi?", 'Верно или нет?', 'True or false?'),
    say: L3("Darsni yakunlashdan oldin beshta gapni tekshirib chiqamiz, hammasi auditoriya haqida. Qaysi biri to'g'ri-yu, qaysi biri noto'g'ri, toping-chi!", 'Теперь быстрая проверка. Я говорю фразу, а ты выбираешь: верно или неверно?', 'Now a quick check. I say a sentence, and you choose: true or false?'),
    ask: L3("To'g'rimi yoki noto'g'rimi?", 'Верно или неверно?', 'True or false?'),
    card: L3('Gap', 'Фраза', 'Statement'),
    yes: L3("To'g'ri", 'Верно', 'True'),
    no: L3("Noto'g'ri", 'Неверно', 'False'),
    right: L3("Ofarin!", 'Точно!', 'Exactly!'),
    hint1: L3("Gapni diqqat bilan o'qing: unda auditoriya, yosh yoki qiziqish haqida nima deyilgan?", 'О чём фраза: об аудитории, возрасте или интересах?', 'What’s it about: the audience, age or interests?'),
    hint2: L3("Bir narsani unutmang: sun'iy intellekt saytni promptda aytilgan odamlarga moslaydi.", 'Вспомни: ИИ подстраивает сайт под людей, названных в промпте.', 'Remember: the AI tailors the site to the people named in the prompt.'),
    items: [
      { t: L3("Yaxshi sayt hammaga birdek yoqadi.", 'Хороший сайт нравится всем одинаково.', 'A good site pleases everyone equally.'), right: false,
        why: L3("Aslida sayt kimga moslab yasalsa, o'shalarga ko'proq yoqadi. Nega bunday ekanini xulosada aytib beraman.", 'На самом деле сайт нравится тем, под кого он сделан. «Для всех» — значит ни для кого.', 'Actually a site pleases the people it’s made for. “For everyone” means for no one.') },
      { t: L3("«Kim uchun?» o'zgarsa, saytning ko'rinishi ham o'zgaradi.", 'Если поменять «Для кого?», меняется и вид сайта.', 'Change “Who for?” and the site’s look changes too.'), right: true,
        why: L3("Bu rost: harflar ham, ranglar ham, so'zlar ham auditoriyaga moslashadi.", 'Верно: буквы, цвета и слова подстраиваются под аудиторию.', 'Right: letters, colours and words adapt to the audience.') },
      { t: L3("«Kim uchun?» qatoriga «odamlar» deb yozish yetarli.", 'В «Для кого?» достаточно написать «люди».', 'Writing “people” in “Who for?” is enough.'), right: false,
        why: L3("«Odamlar» juda umumiy so'z. Aslida yoshini, kimligini va nimani yaxshi ko'rishini yozish kerak.", 'На самом деле нужно написать возраст, кто они и что любят.', 'Actually you should write their age, who they are and what they love.') },
      { t: L3("Auditoriya nimani yaxshi ko'rishini yozsak, sun'iy intellekt saytga shuni qo'yadi.", 'Если написать, что любит аудитория, ИИ добавит это на сайт.', 'If we write what the audience loves, the AI puts it on the site.'), right: true,
        why: L3("Xuddi shunday bo'ladi: «komikslar» desangiz, saytda komikslar kartochkasi chiqadi.", 'Верно: напишешь «комиксы» — появится карточка комиксов.', 'Right: write “comics” and a comics card appears.') },
      { t: L3("Saytni ikki xil odam ko'rsa, faqat bittasini yozish kerak.", 'Если сайт смотрят двое разных, писать нужно только одного.', 'If two kinds of people look at a site, you should write only one.'), right: false,
        why: L3("Unday emas: ikkalasini ham yozish kerak, masalan, bolalar va ularning ota-onalari.", 'На самом деле пиши обоих: например, дети и их родители.', 'Actually write both: for example, kids and their parents.') }
    ],
    ok: L3("Shu bilan auditoriya sirlarini ham bilib oldingiz! Endi har bir promptni yozishdan oldin saytni kim ochishini o'ylaysiz.", 'Всё верно! Ты правильно думаешь об аудитории.', 'All correct! You think about audiences the right way.')
  },
  fin: {
    eyebrow: L3('Xulosa', 'Вывод', 'Summary'),
    say: [
      { text: L3("Endi bilaman, o'sha birinchi sinf o'quvchisi nega zerikib qolgan! Men yaxshi sayt hammaga birdek yoqadi, deb o'ylagandim. Lekin bolalarga bitta narsa kerak, ota-onalarga boshqa, buvi va bobolarga esa uchinchisi. Hamma uchun qilingan sayt hech kimga to'liq yoqmas ekan. Mana sizga qiziq: «hamma uchun» aslida «hech kim uchun» degani ekan!",
        'Вернёмся к загадке. Я думал, что хороший сайт нравится всем. Но детям нужно одно, родителям — другое, а бабушкам и дедушкам — третье. Сайт «для всех» никому не подходит по-настоящему. Я ошибся.',
        'Back to the riddle. I thought a good site pleases everyone. But kids need one thing, parents another, and grandparents a third. A site “for everyone” doesn’t really suit anyone. I was wrong.'), k: 'riddle' },
      { text: L3("Mana, uch qatorli promptingiz va undan chiqqan sayt. Hammasini o'zingiz qildingiz!", 'Смотри, это твой промпт из трёх строк и твой сайт.', 'Look, this is your three-line prompt and your site.'), k: 'own' },
      { text: L3("Birinchi ikki qator sizga tanish: «Nima?» qatorida aniq narsa, «Nega?» qatorida esa maqsad turadi.", '«Что?» — конкретная вещь, «Зачем?» — цель.', '“What?” is a specific thing, “Why?” is the goal.'), k: 'what' },
      { text: L3("Bugungi yangi qator esa «Kim uchun?». Unga auditoriyani yozamiz: saytni kimlar ko'radi, ular necha yoshda va nimani yaxshi ko'radi.", '«Для кого?» — это аудитория, то есть люди, которые будут смотреть сайт: возраст, кто они и что любят.', '“Who for?” is the audience, that is, the people who will look at the site: their age, who they are and what they love.'), k: 'who' },
      { text: L3("Uyda shu promptni nusxalab, haqiqiy sun'iy intellektga yuborib ko'ring: u ham saytni sizning auditoriyangizga moslarmikan? To'rtinchi savol esa saytning ichida nimalar bo'lishi haqida, uni keyingi darsda ochamiz. Xayr, ko'rishguncha!",
        'Домашнее задание: скопируй свой промпт и отправь настоящему ИИ. На следующем уроке — четвёртый вопрос: что будет на сайте? До встречи!',
        'Homework: copy your prompt and send it to a real AI. Next lesson: the fourth question — what goes on the site? See you!') }
    ],
    roles: { what: L3("aniq narsa: turnir, klub, do'kon", 'конкретная вещь: турнир, клуб, магазин', 'a specific thing: tournament, club, shop'), why: L3('maqsad: sayt nima qilsin', 'цель: что сделает сайт', 'the goal: what the site should do'),
      who: L3("auditoriya: yoshi, kimligi, nimani yaxshi ko'radi", 'аудитория: возраст, кто они, что любят', 'the audience: age, who they are, what they love') },
    hw: L3("Promptingizni haqiqiy sun'iy intellektga yuboring va saytingizni yarating.", 'Отправь свой промпт настоящему ИИ и сделай свой сайт.', 'Send your prompt to a real AI and make your site.'),
    ask: L3('Promptingiz va saytingizga qarang', 'Посмотри на свой промпт и сайт', 'Look at your prompt and your site')
  }
};

/*@L2_HELPERS@*/

// Ключи реплик урока — для прогрева озвучки (heroLines).
Object.assign(SPOKEN, { help: 1, says: 1, magic: 1, msgs: 1, hint1: 1, hint2: 1, why: 1, items: 1, right: 1 });
Object.assign(NOT_SPOKEN_IN, { items: { a: 1, b: 1, c: 1, site: 1, right: 1 } });

/*@FILE:gen/b16-chrome.jsx@*/

/*@FILE:gen/p17-skin.jsx@*/

/*@FILE:gen/kollazh-paper-data.jsx@*/

/*@FILE:gen/kollazh-paper.jsx@*/

/*@FILE:gen/kollazh-kit.jsx@*/

/*@FILE:gen/kollazh-trans.jsx@*/

/*@FILE:../ai1/ai1-engine.jsx@*/

/*@FILE:../ai1/ai1-kit.jsx@*/

/*@FILE:../ai1/ai-common.jsx@*/

/*@FILE:ai2-screens.jsx@*/

const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@FILE:gen/kollazh.css@*/
/*@FILE:gen/b16.css@*/
/*@FILE:gen/p17.css@*/
/*@FILE:gen/r28.css@*/
/*@FILE:../css17/c17.css@*/
/*@FILE:../ai1/ai1.css@*/
/*@FILE:ai2.css@*/
`;
