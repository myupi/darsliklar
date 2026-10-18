// =============================================================================
// ТЕСТОВЫЕ УРОКИ · «Заголовки и текст: монитор турнира» — урок 2 курса HTML, проба
// Дети 11–14. Один самодостаточный JSX: канон курса HTML (до пометки «УРОК») + урок.
// ФАЙЛ СОБРАН: node tools/zagolovki/zagolovki.build.mjs → lessons/test/09-zagolovki-monitor.jsx
// Правится исходник tools/zagolovki/ (zagolovki.src.jsx, zg-own.css, monitor.figures.mjs).
// =============================================================================
/*@CANON@*/
// =============================================================================
// ===== УРОК 2 · «Заголовки и текст» · модуль 1 «Основы разметки» · ТЕСТ =====
//
// ЗАМЫСЕЛ. В школьном зале турнир «Битва знаний» (игра из урока 1 с роботом
// Пикселем). Правила показывают на большом мониторе, но Коди вставил текст, и он
// слипся в комок — из зала ничего не прочитать. Ученик — веб-программист турнира:
// делает страницу читаемой — главный заголовок, разделы, абзацы, важные слова —
// и в конце добавляет на монитор свой раздел.
// Сценарий: docs/scenarij-09-zagolovki-monitor.md.
//
// ДУГА. Крючок (монитор: комок → порядок) → план → эксперимент «Enter в коде» →
// h1 → шесть уровней → разделы и подразделы по плану → закрыть </h2> → абзацы p →
// жирный b и курсив i → детектив: страница финала → строка заголовка целиком →
// свой раздел → финал на мониторе зала.
//
// ОСОБЫЕ ПРАВИЛА УРОКА
//   · МОНИТОР — фигура навыка anatomy (monitor.figures.mjs). Корпус нарисован при
//     сборке, экран — живой мини-браузер урока 2, развёрнутый 2D-матрицей по трём
//     углам стекла. На телефоне в рабочих экранах монитор без подставки (крупнее).
//   · ПРЕВЬЮ ЧЕСТНОЕ: строки без тегов склеиваются в одну; незакрытый заголовок или
//     <b> захватывает текст ниже; переносы строк в коде браузер не видит.
//   · ЦВЕТА ТЕГОВ — из урока 2 (h — индиго, p — морская волна, b/i — пурпур).
//   · ОЗВУЧКА: теги по-английски во всех языках (H one, P, B, I) — spokenHtml урока 2.
//   · АРТЕФАКТ: страница турнира с разделом ученика.
//
// ОБРАЩЕНИЕ: UZ — Siz, RU — «ты» без рода, EN — «you».
// =============================================================================

const META = {
  lessonId: 'test-html-zagolovki-monitor',
  module: 'html-m1-osnovy',
  lessonTitle: {
    uz: 'Sarlavhalar va matn: turnir monitori',
    ru: 'Заголовки и текст: монитор турнира',
    en: 'Headings and text: the tournament monitor'
  }
};

const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });
const fillL = (node, vars) => {
  const out = {};
  LANGS.forEach((l) => {
    let s = node[l] !== undefined ? node[l] : node.ru;
    Object.keys(vars || {}).forEach((k) => {
      const v = vars[k];
      const sv = v && typeof v === 'object' ? (v[l] !== undefined ? v[l] : v.ru) : String(v);
      s = s.split('{' + k + '}').join(sv);
    });
    out[l] = s;
  });
  return out;
};

const UI = {
  inspector: L3('Tekshiruv qoidalari', 'Правила проверки', 'Check rules'),
  check: L3('Tekshirish', 'Проверить', 'Check'),
  erase: L3('O‘chirish', 'Стереть', 'Erase'),
  goal: L3('Maqsad', 'Цель', 'Goal'),
  ready: L3('Tayyor', 'Готово', 'Done'),
  edit: L3('Matnni o‘zgartirish', 'Изменить текст', 'Edit the text'),
  monitor: L3('Monitor: ekranda brauzer va sahifa', 'Монитор: на экране браузер со страницей', 'A monitor showing a browser with a page'),
  updated: L3('Yangilandi', 'Обновлено', 'Updated'),
  noChange: L3('O‘zgarmadi', 'Без изменений', 'No change'),
  bold: L3('qalin', 'жирный', 'bold'),
  italic: L3('kursiv', 'курсив', 'italic'),
  plan: L3('Turnir rejasi', 'План турнира', 'Tournament plan'),
  conds: L3('Tayyor bo‘ladi, agar:', 'Готово, когда есть:', 'Done when you have:'),
  nextLesson: L3('Keyingi dars', 'Следующий урок', 'Next lesson'),
  done: L3('Bajarildi', 'Сделано', 'Done'),
  power: L3('Monitorni yoqish', 'Включить монитор', 'Turn on the monitor')
};

// ─────────────────────────────────────────────────────────────────────────────
// СТРАНИЦА ТУРНИРА — на языке ученика. Строки коротки: на телефоне строка кода
// с тегами помещается в ширину экрана.
// ─────────────────────────────────────────────────────────────────────────────
const PAGE = {
  name: L3('Bilimlar jangi', 'Битва знаний', 'Battle of Knowledge'),
  rules: L3('Qoidalar', 'Правила', 'Rules'),
  r1: L3('O‘yinda o‘nta savol bor.', 'В игре десять вопросов.', 'The game has ten questions.'),
  r2: L3('Javobga o‘ttiz soniya beriladi.', 'На ответ — тридцать секунд.', 'You get thirty seconds to answer.'),
  hints: L3('Maslahatlar', 'Подсказки', 'Hints'),
  hp: L3('Butun o‘yinga bitta maslahat.', 'Одна подсказка на всю игру.', 'One hint for the whole game.'),
  prizes: L3('Sovrinlar', 'Призы', 'Prizes'),
  zp: L3('Sovrin — «Koinot sirlari» kitobi.', 'Приз — книга «Тайны космоса».', 'The prize: the book “Secrets of Space”.'),
  // Выделения экрана «Важные слова»: b в r2, i в zp.
  fragB: L3('o‘ttiz soniya', 'тридцать секунд', 'thirty seconds'),
  fragI: L3('Koinot sirlari', 'Тайны космоса', 'Secrets of Space'),
  // Раздел «Финал» (экран «Новый раздел»): заголовок пишет ученик, абзац готов.
  final: L3('Final', 'Финал', 'Final'),
  finalP: L3('Final juma kuni aktlar zalida.', 'Финал — в пятницу в актовом зале.', 'The final is on Friday in the main hall.')
};
const P_IDS = ['name', 'rules', 'r1', 'r2', 'hints', 'hp', 'prizes', 'zp'];
const HEAD_LV = { name: 1, rules: 2, hints: 3, prizes: 2 };
const TEXT_IDS = ['r1', 'r2', 'hp', 'zp'];

// Страница финала для второго монитора — с тремя поломками (экран «Проверка»).
const FIN = {
  title: L3('Final', 'Финал', 'The Final'),
  teams: L3('Jamoalar', 'Команды', 'Teams'),
  teamsP: L3('Finalda «Boyqushlar» va «Raketalar».', 'В финале — «Совы» и «Ракеты».', 'The Owls and the Rockets play.'),
  when: L3('Qachon', 'Когда', 'When'),
  whenPre: L3('Boshlanish ', 'Начало в ', 'Starts on '),
  whenB: L3('jumada', 'пятницу', 'Friday'),
  whenPost: L3(', soat to‘rtda.', ' в четыре часа.', ' at four.'),
  free: L3('Muxlislar uchun kirish bepul.', 'Для болельщиков вход свободный.', 'Entry is free for fans.')
};

// ─────────────────────────────────────────────────────────────────────────────
// ВСЕ ТЕКСТЫ УРОКА. Реплики героя звучат; подписи печатаются.
// Реплика Коди — 1–2 коротких предложения, начинается с живого слова (эмоция
// голоса). Похвала — эмоция и что получилось (pohvala.md).
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3('Turnir', 'Турнир', 'The tournament'),
    cast: [
      { pose: 'hello', text: L3('Salom! Bugun maktab zalida «Bilimlar jangi» turniri. Qoidalarni katta monitorda ko‘rsatamiz.',
        'Привет! Сегодня в школьном зале турнир «Битва знаний». Правила покажем на большом мониторе.',
        'Hi! Today the school hall hosts the Battle of Knowledge tournament. We’ll show the rules on the big monitor.') },
      { pose: 'point', text: L3('Monitorni yoqing.', 'Включи монитор.', 'Turn the monitor on.') }
    ],
    ask: L3('Monitorni yoqing', 'Включи монитор', 'Turn the monitor on'),
    lump: L3('Iya! Men qoidalarni joylab qo‘ydim, ular esa bitta bo‘lakka yopishib qolibdi. Zaldan buni hech kim o‘qiy olmaydi.',
      'Ой! Я вставил правила, а они слиплись в один комок. Из зала такое никто не прочитает.',
      'Oops! I pasted the rules, and they stuck together in one lump. Nobody in the hall can read that.'),
    askFix: L3('«Tartibga keltirish»ni bosing', 'Нажми «Навести порядок»', 'Tap “Tidy up”'),
    fixBtn: L3('Tartibga keltirish', 'Навести порядок', 'Tidy up'),
    done: L3('Voy! Nom oxirgi qatordan ham ko‘rinadi, bo‘limlar bir qarashda topiladi. Dars oxirida buni o‘zingiz qila olasiz.',
      'Ого! Название видно даже с последнего ряда, разделы находятся с одного взгляда. К концу урока у тебя получится так же.',
      'Whoa! The name is visible even from the back row, and the sections are found at a glance. By the end of the lesson, you’ll do this yourself.'),
    askDone: L3('Sahifa tartibga keldi', 'Страница в порядке', 'The page is tidy')
  },

  s2: {
    eyebrow: L3('Reja', 'План', 'Plan'),
    say: L3('Sahifani zal uchun tayyorlaymiz. Mana reja.', 'Готовим страницу для зала. Вот план.', 'Let’s get the page ready for the hall. Here’s the plan.'),
    steps: [
      { icon: 'textSize', text: L3('Zaldan ko‘rinadigan katta nom', 'Огромное название — видно из зала', 'A huge name you can see from the hall'),
        say: L3('Avval nomni shunday kattalashtiramizki, uni oxirgi qatordan ham o‘qish mumkin bo‘lsin.', 'Сначала сделаем название таким крупным, чтобы его читали с последнего ряда.', 'First we’ll make the name big enough to read from the back row.') },
      { icon: 'listN', text: L3('Bo‘limlar va kichik bo‘limlar', 'Разделы и подразделы', 'Sections and subsections'),
        say: L3('Keyin qoidalarni bo‘limlarga ajratamiz — kerakli joy bir qarashda topiladi.', 'Потом разложим правила по разделам — нужное найдётся с одного взгляда.', 'Then we’ll split the rules into sections, so anything can be found at a glance.') },
      { icon: 'doc', text: L3('Matn — bo‘lak-bo‘lak', 'Текст — по кусочкам', 'Text in neat pieces'),
        say: L3('Matnni alohida bo‘laklarga bo‘lamiz, shunda u yopishib qolmaydi.', 'Разделим текст на отдельные кусочки, чтобы он не слипался.', 'We’ll cut the text into separate pieces so it doesn’t stick together.') },
      { icon: 'bold', text: L3('Muhim so‘zlar ko‘zga tashlanadi', 'Важные слова — заметнее', 'Important words stand out'),
        say: L3('Eng muhim so‘zlarni ajratib ko‘rsatamiz.', 'Выделим самые важные слова.', 'We’ll make the most important words stand out.') },
      { icon: 'screen', text: L3('Monitorda o‘z bo‘limingiz', 'Свой раздел на мониторе', 'Your own section on the monitor'),
        say: L3('Oxirida monitorga o‘z bo‘limingizni qo‘shasiz.', 'А в конце добавишь на монитор свой раздел.', 'And at the end you’ll add your own section to the monitor.') }
    ],
    done: L3('Boshladik!', 'Поехали!', 'Let’s go!')
  },

  s3: {
    eyebrow: L3('Tajriba', 'Эксперимент', 'Experiment'),
    say: L3('Kodda har bir qator alohida, monitorda esa — bitta bo‘lak. Balki qatorlarga joy torlik qilayotgandir? Enter tugmasini bosib, ularni suring.',
      'В коде каждая строка отдельно, а на мониторе комок. Может, строкам тесно? Нажми Enter и раздвинь их.',
      'In the code every line is separate, but the monitor shows a lump. Maybe the lines are too cramped? Press Enter to spread them out.'),
    ask: L3('Enter tugmasini bosing — qatorlarni suring', 'Нажми Enter — раздвинь строки', 'Press Enter to spread the lines'),
    same: L3('Qarang: kodda qatorlar ajraldi, monitorda esa hech narsa o‘zgarmadi. Brauzer qator ko‘chishini ko‘rmaydi va matnni yopishtiradi. Qayerda sarlavha, qayerda oddiy matn ekanini unga teglar aytadi.',
      'Смотри: в коде строки разошлись, а на мониторе ничего не изменилось. Браузер не видит переносов строк и склеивает текст. Где заголовок, а где обычный текст, ему говорят теги.',
      'Look: the lines in the code moved apart, but nothing changed on the monitor. The browser ignores line breaks and glues the text together. Tags tell it where a heading is and where plain text is.'),
    askDone: L3('Brauzer qator ko‘chishini ko‘rmaydi', 'Браузер не видит переносов строк', 'The browser ignores line breaks')
  },

  s4: {
    eyebrow: L3('Bosh sarlavha', 'Главный заголовок', 'Main heading'),
    say: L3('Nomdan boshlaymiz. Kodda o‘yin nomi yozilgan qatorni bosing.', 'Начнём с названия. Нажми в коде строку с названием игры.', 'Let’s start with the name. Tap the line with the game’s name in the code.'),
    ask: L3('Kodda «{n}» qatorini bosing', 'Нажми в коде строку «{n}»', 'Tap the “{n}” line in the code'),
    miss: L3('Bu qoidalar matni. O‘yin nomi — birinchi qatorda.', 'Это текст правил. Название игры — в первой строке.', 'That’s rules text. The game’s name is the first line.'),
    done: L3('Zo‘r! Bu <h1> tegi — bosh sarlavha, inglizcha heading so‘zidan. Brauzer uni eng katta qilib ko‘rsatadi va sahifada u bitta bo‘ladi.',
      'Есть! Это тег <h1> — главный заголовок, от английского heading. Браузер рисует его самым крупным, и на странице он один.',
      'Yes! That’s the <h1> tag: the main heading, from the word heading. The browser shows it the biggest, and a page has only one.'),
    askDone: L3('Nom — bosh sarlavha h1', 'Название — главный заголовок h1', 'The name is the main heading, h1')
  },

  s5: {
    eyebrow: L3('Sarlavha darajalari', 'Уровни заголовков', 'Heading levels'),
    say: L3('Sarlavha raqami birdan oltigacha bo‘ladi. «Qoidalar» uchun har bir raqamni sinab ko‘ring.',
      'Цифра у заголовка бывает от одного до шести. Попробуй каждую цифру у «Правил».',
      'A heading’s number goes from one to six. Try every number on Rules.'),
    ask: L3('«Qoidalar» uchun h1 dan h6 gacha sinab ko‘ring', 'Попробуй у «Правил» все цифры от h1 до h6', 'Try every number from h1 to h6 on “Rules”'),
    done: L3('Tushunarli! Raqam — muhimlik darajasi: bir — eng asosiysi, olti — eng kichigi. Darajani o‘lchamiga qarab emas, ma’nosiga qarab tanlaymiz.',
      'Ясно! Цифра — это уровень важности: один — самый главный, шесть — самый мелкий. Уровень выбирают по смыслу, а не по размеру.',
      'Got it! The number is the level of importance: one is the main one, six is the smallest. We choose the level by meaning, not by size.'),
    askDone: L3('Raqam — muhimlik darajasi', 'Цифра — уровень важности', 'The number is the level of importance')
  },

  s6: {
    eyebrow: L3('Bo‘limlar', 'Разделы и подразделы', 'Sections'),
    say: L3('Mana turnir rejasi. Bo‘limlar nom ostida turadi, kichik bo‘lim esa bo‘lim ichida. Har bir sarlavhaga daraja tanlang.',
      'Вот план турнира. Разделы стоят под названием, а подраздел — внутри раздела. Выбери уровень каждому заголовку.',
      'Here’s the tournament plan. Sections sit under the name, and a subsection sits inside a section. Choose a level for each heading.'),
    ask: L3('«{x}» uchun darajani tanlang', 'Выбери уровень для «{x}»', 'Choose a level for “{x}”'),
    wrong: {
      h1: L3('h1 allaqachon bor — bu o‘yin nomi. Bosh sarlavha sahifada bitta.', 'h1 уже есть — это название игры. Главный заголовок на странице один.', 'There’s already an h1: the game’s name. A page has only one main heading.'),
      sec: L3('Bu bo‘lim, u to‘g‘ridan-to‘g‘ri nom ostida turadi. Rejaga qarang.', 'Это раздел, он стоит прямо под названием. Посмотри на план.', 'This is a section: it sits right under the name. Look at the plan.'),
      sub: L3('Bu «Qoidalar» ichidagi kichik bo‘lim. U bir pog‘ona pastroq.', 'Это подраздел внутри «Правил». Он на ступеньку ниже.', 'This is a subsection inside Rules. It’s one step lower.'),
      deep: L3('Bunchalik mayda kerak emas: rejada atigi uch pog‘ona bor.', 'Так мелко не нужно: в плане всего три ступеньки.', 'No need to go that small: the plan has only three steps.')
    },
    hints: [
      L3('Rejaga qarang: bu sarlavha qaysi pog‘onada?', 'Посмотри на план: на какой ступеньке этот заголовок?', 'Look at the plan: which step is this heading on?'),
      L3('Nom — h1, bo‘limlar — h2, ularning ichidagi qismlar — h3.', 'Название — h1, разделы — h2, их части — h3.', 'The name is h1, sections are h2, their parts are h3.'),
      L3('Bu sarlavha uchun {lv} ni bosing.', 'Для этого заголовка нажми {lv}.', 'For this heading, tap {lv}.')
    ],
    done: L3('Qoyil, chiqdi! Endi sahifa rejasi aniq: bo‘limlar — h2, kichik bo‘lim — h3.',
      'Вот это да, получилось! Теперь план страницы как на ладони: разделы — h2, подраздел — h3.',
      'Look at that, it works! The page plan is crystal clear now: sections are h2, the subsection is h3.'),
    askDone: L3('Bo‘limlar — h2, kichik bo‘lim — h3', 'Разделы — h2, подраздел — h3', 'Sections are h2, the subsection is h3')
  },

  s7: {
    eyebrow: L3('Yopuvchi teg', 'Закрывающий тег', 'Closing tag'),
    say: L3('Iya, men «Sovrinlar» sarlavhasini yopishni unutibman! Undan keyingi hamma narsa ham ulkan bo‘lib ketdi. Yopuvchi tegni yozing.',
      'Ой, я забыл закрыть заголовок «Призы»! И всё, что после него, тоже стало огромным. Набери закрывающий тег.',
      'Oops, I forgot to close the Prizes heading! Everything after it got huge too. Type the closing tag.'),
    ask: L3('«{x}» dan keyin </h2> ni yozing', 'Набери </h2> после «{x}»', 'Type </h2> after “{x}”'),
    msgs: {
      needSlash: L3('Deyarli! Bu ochuvchi teg. Yopuvchida qiya chiziq bor.', 'Почти! Это открывающий тег. В закрывающем есть косая черта.', 'Almost! That’s an opening tag. A closing tag has a slash.'),
      needLt: L3('Teg burchakli qavs bilan boshlanadi.', 'Тег начинается с уголка.', 'A tag starts with a bracket.'),
      needGt: L3('Oxirida burchakli qavs yetishmayapti.', 'В конце не хватает уголка.', 'The bracket at the end is missing.'),
      wrongName: L3('Nomi ochuvchi teg bilan bir xil bo‘lsin: {tag}.', 'Имя должно совпадать с открывающим: {tag}.', 'The name must match the opening tag: {tag}.'),
      generic: L3('Yopuvchi teg shunday yig‘iladi: burchak, qiya chiziq, nom, burchak.', 'Закрывающий тег собирается так: уголок, косая черта, имя, уголок.', 'A closing tag goes: bracket, slash, name, bracket.')
    },
    hints: [
      L3('Brauzerga sarlavha qayerda tugashini ayting.', 'Скажи браузеру, где заголовок кончается.', 'Tell the browser where the heading ends.'),
      L3('Yopuvchi teg ochuvchiga o‘xshaydi, faqat qiya chiziq bilan.', 'Закрывающий тег — как открывающий, только с косой чертой.', 'A closing tag looks like the opening one, plus a slash.'),
      L3('Yozing: </h2>', 'Набери: </h2>', 'Type: </h2>')
    ],
    done: L3('Zo‘r-ku! Sarlavha yopildi — matn yana oddiy bo‘ldi.', 'Огонь! Заголовок закрыт — текст снова обычный.', 'Awesome! The heading is closed and the text is normal again.'),
    askDone: L3('Sarlavha yopildi', 'Заголовок закрыт', 'The heading is closed')
  },

  s8: {
    eyebrow: L3('Xatboshilar', 'Абзацы', 'Paragraphs'),
    say: L3('«Qoidalar» ostidagi ikki gap bitta qatorga yopishib qoldi. Kodda birinchi gapni bosing.',
      'Две фразы под «Правилами» слиплись в одну строку. Нажми в коде первую фразу.',
      'Two sentences under Rules stuck together on one line. Tap the first sentence in the code.'),
    ask1: L3('Kodda birinchi gapni bosing', 'Нажми в коде первую фразу', 'Tap the first sentence in the code'),
    ask2: L3('Endi ikkinchi gapni bosing', 'Теперь нажми вторую фразу', 'Now tap the second sentence'),
    first: L3('Ana! Bu <p> tegi — xatboshi, bitta fikr haqidagi matn bo‘lagi. Endi ikkinchi gapni bosing.',
      'Есть! Это тег <p> — абзац, кусок текста об одном. Теперь нажми вторую фразу.',
      'Yes! That’s the <p> tag: a paragraph, a piece of text about one thing. Now tap the second sentence.'),
    done: L3('Klass! Har bir gap — o‘z xatboshisida. Qolgan matnni men ham <p> ga o‘rab qo‘ydim.',
      'Класс! У каждой фразы свой абзац. Остальной текст я тоже обернул в <p>.',
      'Cool! Each sentence has its own paragraph. I wrapped the rest of the text in <p> too.'),
    askDone: L3('Har bir matn bo‘lagi — o‘z p ichida', 'Каждый кусок текста — в своём p', 'Every piece of text is in its own p')
  },

  s9: {
    eyebrow: L3('Muhim so‘zlar', 'Важные слова', 'Important words'),
    say: L3('Eng muhimini ajratamiz. Kerakli so‘zlarni bosing, keyin tegni tanlang.', 'Выделим самое важное. Нажми нужные слова, потом выбери тег.', 'Let’s highlight what matters most. Tap the words, then choose a tag.'),
    goals: {
      b: L3('Qalin qiling: «{f}»', 'Сделай жирным: «{f}»', 'Make bold: “{f}”'),
      i: L3('Kitob nomini kursiv qiling', 'Название книги — курсивом', 'Put the book title in italics')
    },
    askSel: L3('Birinchi va oxirgi so‘zni bosing', 'Нажми первое и последнее слово', 'Tap the first and the last word'),
    askTag: L3('Endi tegni tanlang', 'Теперь выбери тег', 'Now choose a tag'),
    wrongSel: L3('Deyarli! Faqat «{f}» so‘zlarini belgilang.', 'Почти! Выдели только «{f}».', 'Almost! Select only “{f}”.'),
    wrongTag: {
      b: L3('Bu kursiv bo‘ladi. Qalin uchun — <b>.', 'Это будет курсив. Для жирного — <b>.', 'That would be italics. For bold, use <b>.'),
      i: L3('Bu qalin bo‘ladi. Kursiv uchun — <i>.', 'Это будет жирный. Для курсива — <i>.', 'That would be bold. For italics, use <i>.')
    },
    noSel: L3('Avval so‘zlarni belgilang.', 'Сначала выдели слова.', 'Select the words first.'),
    hints3: L3('Belgilangan so‘zlarni bosing.', 'Нажми отмеченные слова.', 'Tap the marked words.'),
    okB: L3('Klass! <b> tegi so‘zlarni qalin qiladi. Endi kitob nomi.', 'Класс! Тег <b> делает слова жирными. Теперь название книги.', 'Cool! The <b> tag makes words bold. Now the book title.'),
    done: L3('Super! <i> tegi matnni qiya qiladi — bu kursiv. Muhim narsa endi darhol ko‘rinadi.',
      'Супер! Тег <i> делает текст наклонным — это курсив. Важное теперь видно сразу.',
      'Super! The <i> tag slants the text: that’s italics. The important stuff stands out now.'),
    askDone: L3('Qalin — b, kursiv — i', 'Жирный — b, курсив — i', 'Bold is b, italics is i')
  },

  s10: {
    eyebrow: L3('Tekshiruv', 'Проверка', 'Check'),
    say: L3('Men sport zalidagi ikkinchi monitor uchun final sahifasini yasadim. Unda uchta buzilish yashiringan. Buzilgan qatorni bosing.',
      'Я сделал страницу финала для второго монитора, в спортзале. В ней спрятались три поломки. Нажми строку с поломкой.',
      'I made the final’s page for the second monitor, in the gym. Three bugs are hiding in it. Tap a line with a bug.'),
    ask: L3('Buzilgan qatorni bosing', 'Нажми строку с поломкой', 'Tap a line with a bug'),
    askFix: L3('Qanday tuzatamiz?', 'Как исправить?', 'How do we fix it?'),
    rules: {
      one: L3('Bosh sarlavha h1 — bitta', 'Главный заголовок h1 — один', 'Only one main heading h1'),
      closed: L3('Ochilgan teg yopilgan', 'Открытый тег закрыт', 'Every opened tag is closed'),
      para: L3('Oddiy matn — p ichida', 'Обычный текст — в абзаце p', 'Plain text goes in a paragraph p')
    },
    bugs: {
      one: {
        found: L3('Topildi! Bu ikkinchi h1, bosh sarlavha esa bitta bo‘lishi kerak.', 'Есть! Это второй h1, а главный заголовок должен быть один.', 'Got it! That’s a second h1, but there must be only one main heading.'),
        bad: L3('«Jamoalar» — bo‘lim sarlavhasi, oddiy matn emas.', '«Команды» — заголовок раздела, а не обычный текст.', 'Teams is a section heading, not plain text.')
      },
      closed: {
        found: L3('Ana! <b> ochilgan, lekin yopilmagan — shuning uchun pastdagi hamma narsa qalin.', 'Вот! <b> открыт, но не закрыт — поэтому всё ниже жирное.', 'There! <b> is opened but never closed, so everything below is bold.'),
        bad: L3('Unda butun sahifa qalin bo‘lib qoladi. Faqat bitta so‘z qalin bo‘lishi kerak.', 'Тогда жирной останется вся страница. Жирным должно быть одно слово.', 'Then the whole page stays bold. Only one word should be bold.')
      },
      para: {
        found: L3('Topildi! Bu oddiy gap, lekin u sarlavhaga o‘ralgan — shuning uchun ulkan.', 'Нашлась! Это обычная фраза, но она в заголовке — вот и огромная.', 'Found it! It’s a plain sentence wrapped in a heading, so it’s huge.'),
        bad: L3('h3 ham sarlavha. Oddiy gap xatboshida yashaydi.', 'h3 — тоже заголовок. Обычная фраза живёт в абзаце.', 'h3 is a heading too. A plain sentence lives in a paragraph.')
      }
    },
    fixes: {
      one: [{ id: 'h2', ok: true, label: L3('h2 qilish', 'Сделать h2', 'Make it h2') }, { id: 'p', label: L3('p qilish', 'Сделать p', 'Make it p') }],
      closed: [{ id: 'end', label: L3('</b> eng oxirida', '</b> в самом конце', '</b> at the very end') }, { id: 'after', ok: true, label: L3('</b> so‘zdan keyin', '</b> после слова', '</b> after the word') }],
      para: [{ id: 'h3', label: L3('h3 qilish', 'Сделать h3', 'Make it h3') }, { id: 'p', ok: true, label: L3('p qilish', 'Сделать p', 'Make it p') }]
    },
    fixed: L3('Aniq! Qoida bajarildi.', 'Чётко! Правило выполнено.', 'Spot on! The rule is met.'),
    fine: L3('Bu qator joyida. Qoidalarga qarang: qaysi biri bajarilmagan?', 'Эта строка в порядке. Посмотри на правила: какое не выполнено?', 'This line is fine. Look at the rules: which one isn’t met?'),
    hints: [
      L3('Monitorga qarang: qayer g‘alati ko‘rinadi?', 'Посмотри на монитор: что выглядит странно?', 'Look at the monitor: what looks odd?'),
      L3('Ro‘yxatdagi birinchi bajarilmagan qoidani o‘qing.', 'Прочитай первое невыполненное правило в списке.', 'Read the first rule in the list that isn’t met.'),
      L3('Belgilangan qatorni bosing.', 'Нажми отмеченную строку.', 'Tap the marked line.')
    ],
    done: L3('Uchala buzilish tuzatildi! Xuddi haqiqiy veb-dasturchi kabi!', 'Все три поломки исправлены! Уже как настоящий веб-программист!', 'All three bugs fixed! Like a real web developer!'),
    askDone: L3('Sahifa qoidalarga mos', 'Страница по правилам', 'The page follows the rules')
  },

  s11: {
    eyebrow: L3('Yangi bo‘lim', 'Новый раздел', 'New section'),
    say: L3('Tashkilotchilar asosiy monitorga «Final» bo‘limini qo‘shishni so‘rashdi. Matni tayyor. Bo‘lim sarlavhasi qatorini to‘liq yozing.',
      'Организаторы просят добавить на главный монитор раздел «Финал». Текст уже есть. Напиши строку заголовка раздела целиком.',
      'The organisers want a Final section on the main monitor. The text is ready. Write the whole heading line for the section.'),
    ask: L3('«{f}» bo‘limi sarlavhasini yozing — «{x}» kabi', 'Напиши заголовок раздела «{f}» — как у «{x}»', 'Write the heading of the “{f}” section, like “{x}”'),
    msgs: {
      empty: L3('Avval qatorni yozing.', 'Сначала напиши строку.', 'Write the line first.'),
      noTag: L3('Brauzer buni oddiy matn deb ko‘radi. Sarlavhaga teg kerak.', 'Браузер видит просто текст. Заголовку нужен тег.', 'The browser sees plain text. A heading needs a tag.'),
      h1: L3('h1 allaqachon bor — bu o‘yin nomi. Bo‘lim bir pog‘ona pastroq.', 'h1 уже есть — это название игры. Раздел на ступеньку ниже.', 'There’s already an h1: the game’s name. A section is one step lower.'),
      deep: L3('Bu kichik bo‘lim darajasi. «Final» esa «Sovrinlar» kabi bo‘lim.', 'Это уровень подраздела. А «Финал» — раздел, как «Призы».', 'That’s a subsection level. Final is a section, like Prizes.'),
      p: L3('<p> — xatboshi uchun. Bo‘lim nomiga sarlavha kerak.', '<p> — для абзаца. Названию раздела нужен заголовок.', '<p> is for paragraphs. A section name needs a heading.'),
      other: L3('Bu teg sarlavha emas. «Sovrinlar» qanday yozilganiga qarang.', 'Это не тег заголовка. Посмотри, как записаны «Призы».', 'That isn’t a heading tag. Look at how Prizes is written.'),
      noText: L3('Teglar orasiga bo‘lim nomini yozing.', 'Между тегами напиши название раздела.', 'Write the section name between the tags.'),
      noClose: L3('Deyarli! Oxirida yopuvchi teg yetishmayapti.', 'Почти! В конце не хватает закрывающего тега.', 'Almost! The closing tag is missing at the end.'),
      noSlash: L3('Yopuvchi tegda qiya chiziq bo‘lishi kerak.', 'В закрывающем теге нужна косая черта.', 'The closing tag needs a slash.'),
      mismatch: L3('Yopuvchi teg ochuvchisi bilan bir xil bo‘lishi kerak.', 'Закрывающий тег должен совпадать с открывающим.', 'The closing tag must match the opening one.')
    },
    hints: [
      L3('«Sovrinlar» qanday yozilganiga qarang.', 'Посмотри, как записаны «Призы».', 'Look at how Prizes is written.'),
      L3('Bo‘lim — h2. Ochuvchi teg, nom, yopuvchi teg.', 'Раздел — h2. Открывающий тег, название, закрывающий тег.', 'A section is h2: opening tag, name, closing tag.'),
      L3('Yozing: <h2>Final</h2>', 'Напиши: <h2>Финал</h2>', 'Type: <h2>Final</h2>')
    ],
    ph: L3('qatorni shu yerga yozing', 'пиши строку здесь', 'type the line here'),
    done: L3('Ishlayapti! Qarang, qanday chiroyli — yangi bo‘lim monitorda.', 'Работает! Смотри, как красиво — новый раздел уже на мониторе.', 'It works! Look how cool: the new section is on the monitor.'),
    askDone: L3('Yangi bo‘lim monitorda', 'Новый раздел на мониторе', 'The new section is on the monitor')
  },

  s12: {
    eyebrow: L3('O‘z bo‘limingiz', 'Свой раздел', 'Your section'),
    say: L3('Tashkilotchilar monitordan sizga joy berishdi! O‘yinchilar uchun o‘z bo‘limingizni yozing: maslahat, tabrik yoki qiziq fakt.',
      'Организаторы дали тебе место на мониторе! Напиши свой раздел для игроков: совет, приветствие или интересный факт.',
      'The organisers gave you space on the monitor! Write your own section for the players: a tip, a greeting or a fun fact.'),
    conds: {
      head: L3('Bo‘lim sarlavhasi', 'Заголовок раздела', 'A section heading'),
      text: L3('Xatboshi matni', 'Текст абзаца', 'A paragraph of text'),
      bold: L3('Bitta so‘z qalin', 'Одно слово жирным', 'One word in bold')
    },
    askHead: L3('<h2> ichiga bo‘lim nomini yozing', 'Напиши название раздела внутри <h2>', 'Write the section name inside <h2>'),
    askText: L3('<p> ichiga matn yozing', 'Напиши текст внутри <p>', 'Write the text inside <p>'),
    askBold: L3('Xatboshingizdagi muhim so‘zni bosing', 'Нажми важное слово в своём абзаце', 'Tap an important word in your paragraph'),
    phHead: L3('Masalan: Jamoaga maslahat', 'Например: Совет команде', 'For example: A tip for teams'),
    phText: L3('Masalan: Javobdan oldin maslahatlashing.', 'Например: Перед ответом посоветуйтесь.', 'For example: Talk it over before you answer.'),
    noTags: L3('Bu yerga faqat so‘z yozing, burchakli qavslarsiz.', 'Здесь только слова, без уголков.', 'Only words here, no brackets.'),
    short: L3('Biroz ko‘proq yozing — kamida ikki so‘z.', 'Напиши чуть больше — хотя бы два слова.', 'Write a bit more: at least two words.'),
    empty: L3('Bu yerga bo‘lim nomini yozing.', 'Напиши здесь название раздела.', 'Write the section name here.'),
    done: L3('Bu kuchli bo‘ldi! Bo‘limingiz zal monitorida — o‘yinchilar uni o‘qiydi.', 'Это было мощно! Твой раздел на мониторе зала — игроки его прочитают.', 'That was epic! Your section is on the hall monitor, and the players will read it.'),
    askDone: L3('Bo‘limingiz monitorda', 'Твой раздел на мониторе', 'Your section is on the monitor')
  },

  s13: {
    eyebrow: L3('Zal monitorida', 'На мониторе зала', 'On the hall monitor'),
    say: L3('Turnir boshlanmoqda! Sahifa zal monitorida: katta nom, bo‘limlar, xatboshilar va sizning bo‘limingiz. Xuddi haqiqiy veb-dasturchi kabi!',
      'Турнир начинается! Страница на мониторе зала: огромное название, разделы, абзацы и твой раздел. Уже как настоящий веб-программист!',
      'The tournament is starting! The page is on the hall monitor: a huge name, sections, paragraphs and your own section. Like a real web developer!'),
    ach: {
      levels: { self: L3('Sarlavha darajalarini maslahatsiz tanladingiz', 'Уровни заголовков — выбраны без подсказок', 'Chose heading levels on your own'),
        help: L3('Sarlavha darajalarini tanladingiz', 'Уровни заголовков — выбраны', 'Chose heading levels') },
      close: { self: L3('</h2> ni yozdingiz', 'Закрывающий </h2> — написан', 'Wrote the closing </h2>'),
        help: L3('</h2> ni maslahat bilan yozdingiz', 'Закрывающий </h2> — написан с подсказкой', 'Wrote </h2> with a hint') },
      fix: { self: L3('Uchta buzilishni maslahatsiz tuzatdingiz', 'Три поломки — исправлены без подсказок', 'Fixed three bugs on your own'),
        help: L3('Uchta buzilishni tuzatdingiz', 'Три поломки — исправлены', 'Fixed three bugs') },
      write: { self: L3('Sarlavha qatorini to‘liq yozdingiz', 'Строка заголовка — написана целиком', 'Wrote a whole heading line'),
        help: L3('Sarlavha qatorini maslahat bilan yozdingiz', 'Строка заголовка — написана с подсказкой', 'Wrote a heading line with a hint') },
      own: { self: L3('Monitorga o‘z bo‘limingizni qo‘shdingiz', 'Свой раздел — на мониторе', 'Added your own section to the monitor'),
        help: L3('Monitorga o‘z bo‘limingizni qo‘shdingiz', 'Свой раздел — на мониторе', 'Added your own section to the monitor') }
    },
    next: L3('Ro‘yxatlar: punktlar va raqamlar', 'Списки: пункты и номера', 'Lists: bullets and numbers'),
    btn: L3('Darsni tugatish', 'Завершить урок', 'Finish the lesson'),
    ask: L3('Sahifangizga qarang', 'Посмотри на свою страницу', 'Look at your page')
  }
};

/*@L2_HELPERS@*/

// ═════════════════════════════════════════════════════════════════════════════
// РАСШИРЕНИЕ ПОМОЩНИКОВ УРОКА 2
// ═════════════════════════════════════════════════════════════════════════════
Object.assign(SPOKEN, { cast: 1, lump: 1, same: 1, miss: 1, first: 1, msgs: 1, wrong: 1, bugs: 1, fine: 1, fixed: 1,
  wrongSel: 1, wrongTag: 1, noSel: 1, hints3: 1, okB: 1, short: 1, noTags: 1, empty: 1 });
Object.assign(NOT_SPOKEN_IN, { bugs: { fixes: 1 } });

/*@MONITOR@*/
const MON_VB = MON.full;

// Текст → части блока; frag (если есть) обёрнут тегом tag.
function markParts(text, frag, tag) {
  const i = frag ? text.indexOf(frag) : -1;
  if (i < 0) return [txt(text)];
  return [txt(text.slice(0, i)), { k: tag, v: frag }, txt(text.slice(i + frag.length))].filter((x) => x.v !== '');
}

// Строки страницы турнира. o.heads — уровень заголовка по id (0 — строка без тегов),
// o.paras — какие строки текста в <p>, o.marks — выделения b / i.
function docLines(pick, o) {
  const opt = o || {};
  const heads = Object.assign({}, HEAD_LV, opt.heads || {});
  const paras = opt.paras || TEXT_IDS;
  return P_IDS.map((id) => {
    const text = pick(PAGE[id]);
    if (HEAD_LV[id] !== undefined) return blk(id, heads[id] ? 'h' + heads[id] : null, text);
    let parts = [txt(text)];
    if (opt.marks && id === 'r2') parts = markParts(text, pick(PAGE.fragB), 'b');
    if (opt.marks && id === 'zp') parts = markParts(text, pick(PAGE.fragI), 'i');
    return blk(id, paras.indexOf(id) >= 0 ? 'p' : null, parts);
  });
}

// Браузер склеивает соседние строки без тегов в одну (переносы — просто пробел).
function glue(lines) {
  const out = [];
  lines.forEach((b) => {
    const last = out[out.length - 1];
    if (!b.tag && last && !last.tag) out[out.length - 1] = { id: last.id, ids: (last.ids || [last.id]).concat(b.id), tag: null, parts: last.parts.concat([txt(' ')], b.parts) };
    else out.push(b);
  });
  return out;
}

// Раздел «Финал» и свой раздел ученика — для экранов после «Нового раздела».
function finalBlocks(pick, store) {
  const s11 = store.get('s11');
  return [blk('fh', 'h2', s11 && s11.text ? s11.text : pick(PAGE.final)), blk('fp', 'p', pick(PAGE.finalP))];
}
function ownBlocks(store) {
  const own = store.get('s12');
  if (!own || !own.done) return [];
  return [blk('oh', 'h2', own.head), blk('op', 'p', markParts(own.text, own.bold, 'b'))];
}
function fullPage(pick, store) {
  return docLines(pick, { marks: true }).concat(finalBlocks(pick, store), ownBlocks(store));
}
// Артефакт урока для payload: страница турнира с разделом ученика (кладёт экран 12).
function makeArtifact(store) {
  const own = store.get('s12');
  if (!own || !own.done || !own.blocks) return null;
  return { type: 'html-page', title: own.title, blocks: own.blocks, html: buildHtml(own.title, own.blocks), mine: { head: own.head, text: own.text, bold: own.bold } };
}
const putAch = (store, k, v) => {
  const a = Object.assign({}, store.get('ach') || {});
  if (!a[k]) { a[k] = v; store.set('ach', a); }
};

// Узкий экран (телефон): в рабочих экранах монитор показывается без подставки.
function useNarrow() {
  const q = '(max-width: 719px)';
  const get = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(q).matches;
  const [n, setN] = useState(get);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const m = window.matchMedia(q);
    const h = () => setN(m.matches);
    if (m.addEventListener) m.addEventListener('change', h); else m.addListener(h);
    return () => { if (m.removeEventListener) m.removeEventListener('change', h); else m.removeListener(h); };
  }, []);
  return n;
}

// ─────────────────────────────────────────────────────────────────────────────
// МОНИТОР. Корпус — SVG фигуры (MON), экран — мини-браузер урока 2 поверх SVG,
// развёрнутый матрицей по трём углам стекла (tl, tr, bl в координатах рисунка).
// Ширина слоя — ширина стекла в пикселях (в пределах 240–420), поэтому текст на
// экране всегда своего размера и чёткий; вид — тот же, что у браузера урока.
//   on — включён ли; crop — без подставки; focusKey — сменился → экран
//   прокручивается к блоку focus; badge — надпись на экране («Обновлено»).
// ─────────────────────────────────────────────────────────────────────────────
function Monitor({ title, blocks, on = true, crop, flash, hl, fresh, focus, focusKey, tour, led, onTap, tapLabel, badge, cls, renderBlock }) {
  const pick = usePick();
  const wrapRef = useRef(null);
  const scrRef = useRef(null);
  const pageRef = useRef(null);
  const els = useRef({});
  const vb = crop ? MON.crop : MON_VB;
  const svg = useMemo(() => ({ __html: MON.svg.replace(/viewBox="[^"]*"/, 'viewBox="' + vb.join(' ') + '"') }), [crop]); // eslint-disable-line react-hooks/exhaustive-deps
  const [boot, setBoot] = useState(false);
  const wasOn = useRef(on);
  useEffect(() => {
    if (on && !wasOn.current && !reduceMotion()) {
      setBoot(true);
      const t = setTimeout(() => setBoot(false), 1300);
      wasOn.current = on;
      return () => clearTimeout(t);
    }
    wasOn.current = on;
    return undefined;
  }, [on]);
  useLayoutEffect(() => {
    const wrap = wrapRef.current, scr = scrRef.current;
    if (!wrap || !scr) return undefined;
    const S = MON.screen;
    const calc = () => {
      const W = wrap.clientWidth;
      if (!W) return;
      const s = W / vb[2];
      const P = (q) => [(q[0] - vb[0]) * s, (q[1] - vb[1]) * s];
      const a = P(S.tl), b = P(S.tr), c = P(S.bl);
      const sw = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const w0 = Math.max(240, Math.min(420, sw));
      const h0 = w0 / S.aspect;
      scr.style.width = w0.toFixed(1) + 'px';
      scr.style.height = h0.toFixed(1) + 'px';
      scr.style.transform = 'matrix(' + [(b[0] - a[0]) / w0, (b[1] - a[1]) / w0, (c[0] - a[0]) / h0, (c[1] - a[1]) / h0, a[0], a[1]]
        .map((v) => v.toFixed(5)).join(',') + ')';
    };
    calc();
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(calc); ro.observe(wrap); }
    window.addEventListener('resize', calc);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [crop]); // eslint-disable-line react-hooks/exhaustive-deps
  // Прокрутка экрана к блоку, который сейчас в работе.
  useEffect(() => {
    const t = setTimeout(() => {
      // Строка, склеенная с соседними, ищется по общему блоку.
      const host = (blocks || []).find((b) => b.id === focus || (b.ids && b.ids.indexOf(focus) >= 0));
      const pg = pageRef.current, el = host && els.current[host.id];
      if (!pg || !el) return;
      const top = el.offsetTop, bot = top + el.offsetHeight, st = pg.scrollTop, ch = pg.clientHeight;
      let to = null;
      if (bot - top > ch) { if (top < st || top > st + ch - 30) to = top - 6; }   // высокий блок: виден его верх — не трогаем
      else if (top < st) to = top - 6;
      else if (bot > st + ch) to = Math.min(top - 6, bot - ch + 10);
      if (to !== null) pg.scrollTo({ top: Math.max(0, to), behavior: reduceMotion() ? 'auto' : 'smooth' });
    }, 80);
    return () => clearTimeout(t);
  }, [focusKey]); // eslint-disable-line react-hooks/exhaustive-deps
  // Обзор страницы: экран медленно прокручивается вниз и возвращается наверх.
  useEffect(() => {
    if (!tour || reduceMotion()) return undefined;
    const pg = pageRef.current;
    if (!pg) return undefined;
    const t1 = setTimeout(() => pg.scrollTo({ top: pg.scrollHeight, behavior: 'smooth' }), 1400);
    const t2 = setTimeout(() => pg.scrollTo({ top: 0, behavior: 'smooth' }), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [tour]);
  const reg = useCallback((id, el) => { if (el) els.current[id] = el; }, []);
  const tap = onTap ? () => onTap() : undefined;
  return (
    <div ref={wrapRef} className={'zg-mon iso' + (on ? ' is-on' : '') + (boot ? ' is-boot' : '') + (crop ? ' is-crop' : '') + (onTap ? ' is-tap' : '') + (led ? ' is-led' : '') + (cls ? ' ' + cls : '')}
      data-theme="light" style={{ '--ar': (vb[2] / vb[3]).toFixed(4) }}
      role={onTap ? 'button' : 'img'} tabIndex={onTap ? 0 : undefined} aria-label={pick(onTap && tapLabel ? tapLabel : UI.monitor)}
      onClick={tap} onKeyDown={onTap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } } : undefined}>
      <div className="zg-mon-svg" dangerouslySetInnerHTML={svg} />
      <div ref={scrRef} className="zg-scr" aria-hidden={on ? undefined : 'true'}>
        <div className="zg-scr-in">
          <MiniBrowser title={title} pageRef={pageRef} cls="zg-mb"
            page={<Page blocks={blocks || []} flash={flash} hl={hl} fresh={fresh} regBlock={reg} renderBlock={renderBlock} />} />
          {badge ? <span className="zg-badge" key={badge.n}>{pick(badge.text)}</span> : null}
        </div>
      </div>
    </div>
  );
}

// Строка задания; подсказка встаёт на её место.
function Ask({ text, hint, n }) {
  const pick = usePick();
  return (
    <p className={'ask hook-ask zg-ask' + (hint ? ' ask-hint' : '')} aria-live="polite">
      {n ? <span className="ask-n mono">{n}</span> : null}{n ? ' ' : null}{pick(hint || text)}
    </p>
  );
}
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;
const hintOf = (hints, lv, vars) => (lv > 0 && hints[lv - 1] ? fillL(hints[lv - 1], vars || {}) : null);

// Слот уровня заголовка: «h?» пунктиром, пока уровень не выбран.
function HSlot({ on, led }) {
  return <span className={'zg-slot mono' + (on ? ' is-on' : '')}>h?{led ? <Led on /> : null}</span>;
}
// Список условий «готово» — в стиле проверки структуры урока 2.
function Conds({ title, items }) {
  const pick = usePick();
  const firstOpen = items.findIndex((r) => !r.ok);
  return (
    <div className={'insp zg-conds' + (firstOpen < 0 ? ' insp-all' : '')} aria-live="polite">
      <span className="insp-h"><Icon name="listN" size={14} />{pick(title)}</span>
      {items.map((r, i) => (
        <span key={r.id} className={'insp-r' + (r.ok ? ' is-ok' : '') + (i === firstOpen ? ' is-now' : '')}>
          <span className="insp-ic">{r.ok ? <Icon name="check" size={13} /> : null}</span>
          {pick(r.text)}
        </span>
      ))}
    </div>
  );
}

// =============================================================================
// ЭКРАНЫ
// =============================================================================

// ── 1. HOOK. Монитор в зале: включить → комок текста → «Навести порядок».
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const [phase, setPhase] = useState(rec ? 'done' : 'off');   // off · lump · done
  const [speaker, say, spoken, sayNow] = useVoice(rec ? [{ text: c.done, pose: 'smile' }] : c.cast);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(phase === 'done', spoken);
  const led = useIdleLed(canTap && phase !== 'done', phase === 'lump' ? 1 : 0);
  const [fresh, setFresh] = useState(null);
  const powerOn = () => {
    if (!canTap || phase !== 'off') return;
    sfx('pop', true);
    setPhase('lump');
    sayNow(c.lump, 'sorry');
  };
  const tidy = () => {
    if (!canTap || phase !== 'lump') return;
    sfx('win', true);
    setPhase('done'); put({ done: true });
    setFresh(P_IDS.slice());
    sayNow(c.done, 'wonder');
  };
  const blocks = phase === 'done' ? docLines(pick, { marks: true }) : glue(docLines(pick, { heads: { name: 0, rules: 0, hints: 0, prizes: 0 }, paras: [] }));
  const ask = phase === 'off' ? c.ask : phase === 'lump' ? c.askFix : c.askDone;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} />
      <div className="zg-hall">
        <Monitor title={pick(PAGE.name)} blocks={blocks} on={phase !== 'off'} fresh={fresh} tour={fresh ? 1 : 0} cls="zg-mon-hero"
          onTap={phase === 'off' ? powerOn : undefined} tapLabel={UI.power} led={led && phase === 'off'} />
      </div>
      <div className="zg-acts">
        {phase === 'off' ? (
          <button type="button" className="btn-accent zg-act" disabled={!canTap} onClick={powerOn}>
            <Icon name="power" size={18} />{pick(UI.power)}<Led on={led} />
          </button>
        ) : phase === 'lump' ? (
          <button type="button" className="btn-accent zg-act" disabled={!canTap} onClick={tidy}>
            <Icon name="textSize" size={18} />{pick(c.fixBtn)}<Led on={led} />
          </button>
        ) : null}
      </div>
    </Stage>
  );
}

// ── 2. MISSION. План урока карточками (канон).
const S2 = ({ p }) => <MissionScreen p={p} c={C.s2} id="s2" />;

// ── 3. ЭКСПЕРИМЕНТ «Enter в коде»: строки раздвинулись — на мониторе тот же комок.
const S3_GAPS = ['rules', 'hints', 'prizes'];
function S3({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const [gaps, setGaps] = useState(rec ? 1 : 0);
  const done = !!rec;
  const [badge, setBadge] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.same : c.say, pose: done ? 'rule' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const press = () => {
    if (!canTap) return;
    sfx('type', true);
    const g = Math.min(2, gaps + 1);
    setGaps(g);
    setBadge((b) => ({ text: UI.noChange, n: (b ? b.n : 0) + 1 }));
    if (!done) { put({ done: true }); sayNow(c.same, 'rule'); }
  };
  const raw = docLines(pick, { heads: { name: 0, rules: 0, hints: 0, prizes: 0 }, paras: [] });
  const lines = srcLines(raw, { frame: 'body' });
  const withGaps = [];
  lines.forEach((ln) => {
    if (gaps && S3_GAPS.indexOf(ln.id) >= 0) for (let k = 0; k < gaps; k += 1) withGaps.push({ key: 'gap-' + ln.id + k, d: 1, toks: [], gap: true });
    withGaps.push(ln);
  });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={done ? c.askDone : c.ask} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} badge={badge} />}
        code={<div className="zg-code zg-code-enter">
          <Src lines={withGaps} className="zg-src" lineProps={(ln) => (ln.gap ? { cls: 'zg-gap' } : null)} />
          <button type="button" className={'zg-enter' + (led ? ' is-led' : '')} disabled={!canTap} onClick={press}>
            <span className="zg-enter-k mono">Enter</span><span className="zg-enter-a" aria-hidden="true">↵</span><Led on={led} />
          </button>
        </div>} />
    </Stage>
  );
}

// ── 4. ГЛАВНЫЙ ЗАГОЛОВОК. Нажать строку названия — она становится h1.
function S4({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const done = !!rec;
  const [flash, setFlash] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'rule' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const tap = (id) => {
    if (!canTap || done) return;
    if (id !== 'name') { sfx('soft', true); wobble(id); sayNow(c.miss, 'think'); return; }
    sfx('pop', true);
    put({ done: true });
    setFlash({ id: 'name', n: 1 });
    sayNow(c.done, 'cheer');
  };
  const raw = docLines(pick, { heads: { name: done ? 1 : 0, rules: 0, hints: 0, prizes: 0 }, paras: [] });
  const ask = done ? c.askDone : fillL(c.ask, { n: PAGE.name });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus="name" focusKey={done ? 'n1' : 'n0'} />}
        code={<Src lines={srcLines(raw, { frame: 'body' })} className="zg-src"
          lineProps={(ln) => (ln.id ? {
            onTap: () => tap(ln.id), disabled: !canTap || done, led: led && ln.id === 'name',
            cls: (ln.id === 'name' && done ? 'zg-in' : '') + (shake === ln.id ? ' zg-shake' : '')
          } : null)} />} />
    </Stage>
  );
}

// ── 5. ШЕСТЬ УРОВНЕЙ. Цифра у «Правил» — размер на мониторе меняется сразу.
const LEVELS = [1, 2, 3, 4, 5, 6];
function S5({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const [lv, setLv] = useState(2);
  const [seen, setSeen] = useState(rec ? LEVELS.slice() : [2]);
  const done = !!rec;
  const [flash, setFlash] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'rule' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, seen.length);
  const pickLv = (n) => {
    if (!canTap) return;
    sfx('tap', true);
    setLv(n);
    setFlash((f) => ({ id: 'rules', n: (f ? f.n : 0) + 1 }));
    const ns = seen.indexOf(n) >= 0 ? seen : seen.concat(n);
    setSeen(ns);
    if (ns.length >= 6 && !done) { put({ done: true }); sayNow(c.done, 'rule'); }
  };
  const raw = docLines(pick, { heads: { rules: lv, hints: 0, prizes: 0 }, paras: [] });
  const shown = raw.slice(0, 3);   // название, «Правила» и текст под ними — остальное свёрнуто
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Ask text={done ? c.askDone : c.ask} n={done ? null : seen.length + '/6'} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus="rules" focusKey={'r' + lv} hl={['rules']} />}
        code={<div className="zg-code">
          <Src lines={(() => { const L = srcLines(shown, { frame: 'body' }); return L.slice(0, -1).concat([{ key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }], L.slice(-1)); })()} className="zg-src"
            lineProps={(ln) => (ln.id === 'rules' ? { cls: 'is-hl' } : null)} />
          <LevelRow levels={LEVELS} value={lv} onPick={pickLv} canTap={canTap} seen={seen} led={led} />
        </div>} />
    </Stage>
  );
}

// ── 6. РАЗДЕЛЫ И ПОДРАЗДЕЛЫ. Уровни трёх заголовков — по плану турнира.
const S6_ORDER = ['rules', 'hints', 'prizes'];
function PlanCard({ cur, set }) {
  const pick = usePick();
  const row = (id, d) => (
    <span key={id} className={'zg-plan-r d' + d + (cur === id ? ' is-cur' : '') + (set[id] ? ' is-set' : '')} style={{ '--d': d }}>
      <span className="zg-plan-t">{pick(PAGE[id])}</span>
      {set[id] || id === 'name' ? <span className="zg-plan-h mono">h{id === 'name' ? 1 : set[id]}</span> : null}
    </span>
  );
  return (
    <div className="zg-plan" aria-label={pick(UI.plan)}>
      <span className="zg-plan-l">{pick(UI.plan)}</span>
      {row('name', 0)}{row('rules', 1)}{row('hints', 2)}{row('prizes', 1)}
    </div>
  );
}
function S6({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const [set, setSet] = useState(rec ? { rules: 2, hints: 3, prizes: 2 } : {});
  const cur = S6_ORDER.find((id) => !set[id]) || null;
  const done = !cur;
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [miss, setMiss] = useState(0);
  const [flash, setFlash] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: rec ? c.done : c.say, pose: rec ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, S6_ORDER.indexOf(cur));
  const pickLv = (n) => {
    if (!canTap || !cur) return;
    const want = HEAD_LV[cur];
    if (n === want) {
      sfx('ok', true);
      const ns = Object.assign({}, set, { [cur]: n });
      setSet(ns); setMsg(null); ladder.reset();
      setFlash({ id: cur, n: Date.now() });
      if (!S6_ORDER.find((id) => !ns[id])) {
        put({ done: true });
        putAch(store, 'levels', miss ? 'help' : 'self');
        sayNow(c.done, 'cheer');
      }
      return;
    }
    sfx('soft', true); wobble(cur);
    setMiss((m) => m + 1);
    const lvN = ladder.bump();
    const why = n === 1 ? c.wrong.h1 : n > 3 ? c.wrong.deep : want === 2 ? c.wrong.sec : c.wrong.sub;
    const h = lvN >= 3 ? fillL(c.hints[2], { lv: 'h' + want }) : why;
    setMsg(h);
    sayNow(h, 'think');
  };
  const heads = { rules: set.rules || 0, hints: set.hints || 0, prizes: set.prizes || 0 };
  const raw = docLines(pick, { heads, paras: [] });
  const lines = srcLines(raw.filter((b) => b.id !== 'r2'), { frame: 'body', collapse: (b) => TEXT_IDS.indexOf(b.id) >= 0 }).map((ln) => {
    if (S6_ORDER.indexOf(ln.id) >= 0 && !set[ln.id]) {
      return Object.assign({}, ln, { tag: 'h1', toks: [{ k: 'node', node: <HSlot on={ln.id === cur} led={led && ln.id === cur} />, z: ln.id + ':o' },
        { k: 'text', v: pick(PAGE[ln.id]), z: ln.id + ':t' }] });
    }
    return ln;
  });
  const ask = done ? c.askDone : fillL(c.ask, { x: PAGE[cur] });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus={cur || 'prizes'} focusKey={cur || 'end'} />}
        code={<div className="zg-code">
          <div className="zg-s6">
            <PlanCard cur={cur} set={Object.assign({ name: 1 }, set)} />
            <Src lines={lines} numbers={false} className="zg-src zg-src-nonum" lineProps={(ln) => (ln.id === cur ? { cls: 'is-hl' + (shake === cur ? ' zg-shake' : '') } : null)} />
          </div>
          {!done ? <LevelRow levels={[1, 2, 3, 4]} value={null} onPick={pickLv} canTap={canTap} led={led} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 7. ЗАКРОЙ ЗАГОЛОВОК. Без </h2> «Призы» захватывают текст ниже.
function S7({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const done = !!rec;
  const ty = useTagTyping({ max: 8 });
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'sorry' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, ty.val.length);
  const check = () => {
    if (!canTap || done) return;
    const issue = tagTypingIssue(ty.val, 'h2', c.msgs);
    if (!issue) {
      sfx('ok', true); put({ done: true }); setMsg(null);
      putAch(store, 'close', ladder.ref.current ? 'help' : 'self');
      sayNow(c.done, 'cheer');
      return;
    }
    sfx('soft', true); wobble('in');
    const lv = ladder.bump();
    const h = lv >= 3 ? c.hints[2] : (normTag(ty.val) ? issue : c.hints[lv - 1]);
    setMsg(h);
    sayNow(h, 'think');
  };
  const raw = docLines(pick, { paras: [] });
  // Честное превью: незакрытый h2 забирает текст после себя.
  const shownBlocks = done ? glue(raw) : glue(raw.slice(0, 6)).concat([blk('prizes', 'h2', pick(PAGE.prizes) + ' ' + pick(PAGE.zp))]);
  const lines = srcLines(raw, { frame: 'body', collapse: (b) => b.id !== 'zp' && TEXT_IDS.indexOf(b.id) >= 0 }).map((ln) => {
    if (ln.id !== 'prizes') return ln;
    const toks = ln.toks.slice(0, 2);
    return Object.assign({}, ln, { toks: done ? ln.toks : toks.concat([{ k: 'node', node: (
      <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} placeholder={L3('</…>', '</…>', '</…>')} max={8}
        label={c.hints[2]} onEnter={check} cls={'tk-input-tag zg-in-tag' + (led ? ' is-led-in' : '') + (shake === 'in' ? ' zg-shake' : '')} />
    ) }]) });
  });
  const ask = done ? c.askDone : fillL(c.ask, { x: PAGE.prizes });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={shownBlocks} focus="prizes" focusKey={done ? 'f1' : 'f0'} hl={done ? null : ['prizes']}
          flash={done ? { id: 'prizes', n: 1 } : null} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id === 'prizes' && !done ? { cls: 'is-hl zg-typing' } : null)} />
          {!done ? <KeyRow keys={['<', '/', '>']} ty={ty} canTap={canTap} onCheck={check} ready={normTag(ty.val).length >= 4} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 8. АБЗАЦЫ. Две фразы «Правил» слиплись — каждую в свой <p>.
const S8_IDS = ['r1', 'r2'];
function S8({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const [wrapped, setWrapped] = useState(rec ? S8_IDS.slice() : []);
  const done = !!rec;
  const [flash, setFlash] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const next = S8_IDS.find((id) => wrapped.indexOf(id) < 0) || null;
  const led = useIdleLed(canTap && !done, wrapped.length);
  const tap = (id) => {
    if (!canTap || done || wrapped.indexOf(id) >= 0) return;
    sfx('pop', true);
    const nw = wrapped.concat(id);
    setWrapped(nw);
    setFlash({ id, n: Date.now() });
    if (nw.length >= 2) { put({ done: true }); sayNow(c.done, 'cheer'); } else sayNow(c.first, 'rule');
  };
  const raw = docLines(pick, { paras: done ? TEXT_IDS : wrapped });
  const lines = srcLines(raw, { frame: 'body', collapse: (b) => !done && (b.id === 'hp' || b.id === 'zp') });
  const ask = done ? c.askDone : wrapped.length ? c.ask2 : c.ask1;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Ask text={ask} n={done ? null : wrapped.length + '/2'} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus="r1" focusKey={'w' + wrapped.length} hl={done ? null : ['r1', 'r2']} />}
        code={<Src lines={lines} className="zg-src" lineProps={(ln) => (S8_IDS.indexOf(ln.id) >= 0 && !done ? {
          onTap: () => tap(ln.id), disabled: !canTap || wrapped.indexOf(ln.id) >= 0, led: led && ln.id === next,
          cls: wrapped.indexOf(ln.id) >= 0 ? 'zg-in' : 'zg-loose'
        } : (done && TEXT_IDS.indexOf(ln.id) >= 0 && S8_IDS.indexOf(ln.id) < 0 ? { cls: 'zg-in' } : null))} />} />
    </Stage>
  );
}

// ── 9. ВАЖНЫЕ СЛОВА. Выбрать слова касаниями и поставить <b>, потом <i>.
function MarkRow({ onPick, canTap, ready, led }) {
  const pick = usePick();
  return (
    <div className="zg-marks" translate="no">
      <button type="button" className={'zg-mark' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={() => onPick('b')}>
        <Tag tag="b" /><b>{pick(UI.bold)}</b><Led on={!!led} />
      </button>
      <button type="button" className={'zg-mark' + (ready ? ' is-ready' : '')} disabled={!canTap} onClick={() => onPick('i')}>
        <Tag tag="i" /><i>{pick(UI.italic)}</i><Led on={!!led} />
      </button>
    </div>
  );
}
function S9({ p }) {
  const pick = usePick();
  const narrow = useNarrow();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const [round, setRound] = useState(rec ? 2 : 0);   // 0 — b, 1 — i, 2 — готово
  const done = round >= 2;
  const [sel, tapWord, setSel] = useWordSel();
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [flash, setFlash] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, (sel ? 1 : 0) + round * 2);
  const tag = round === 0 ? 'b' : 'i';
  const id = round === 0 ? 'r2' : 'zp';
  const frag = pick(round === 0 ? PAGE.fragB : PAGE.fragI);
  const toks = useMemo(() => toTokens(pick(PAGE[id])), [id, pick]); // eslint-disable-line react-hooks/exhaustive-deps
  const target = findRange(toks, frag);
  const onWord = (i) => { if (!canTap || done) return; sfx('tap', true); setMsg(null); tapWord(i); };
  const onTag = (t) => {
    if (!canTap || done) return;
    if (!sel) { sfx('soft', true); setMsg(c.noSel); return; }
    const okSel = target && sel.a === target[0] && sel.b === target[1];
    if (!okSel) {
      sfx('soft', true);
      const lv = ladder.bump();
      const h = lv >= 3 ? c.hints3 : fillL(c.wrongSel, { f: frag });
      setMsg(h); setSel(null); sayNow(h, 'think');
      return;
    }
    if (t !== tag) { sfx('soft', true); ladder.bump(); setMsg(c.wrongTag[tag]); sayNow(c.wrongTag[tag], 'think'); return; }
    sfx('ok', true);
    setFlash({ id, n: Date.now() });
    setSel(null); setMsg(null); ladder.reset();
    if (round === 0) { setRound(1); sayNow(c.okB, 'smile'); } else { setRound(2); put({ done: true }); sayNow(c.done, 'cheer'); }
  };
  const marks = { r2: round > 0, zp: round > 1 };
  const raw = docLines(pick, { marks: false }).map((b) => {
    if (b.id === 'r2' && marks.r2) return blk('r2', 'p', markParts(pick(PAGE.r2), pick(PAGE.fragB), 'b'));
    if (b.id === 'zp' && marks.zp) return blk('zp', 'p', markParts(pick(PAGE.zp), pick(PAGE.fragI), 'i'));
    return b;
  });
  // Только два раздела, где выделяем: «Правила» и «Призы» — остальное не мешает.
  const lines = srcLines(raw.filter((b) => ['rules', 'r1', 'r2', 'prizes', 'zp'].indexOf(b.id) >= 0), { frame: 'none', collapse: (b) => b.id === 'r1' })
    .map((ln) => Object.assign({}, ln, { d: 0 }));
  lines.splice(3, 0, { key: 'gap', d: 0, toks: [{ k: 'text', v: '…', dim: true }] });
  const goal = round === 0 ? fillL(c.goals.b, { f: frag }) : c.goals.i;
  const ask = done ? c.askDone : msg || (sel ? c.askTag : c.askSel);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      {!done ? <GoalCard goal={goal} n={round + 1} total={2} /> : <GoalCard done doneText={c.askDone} />}
      {!done ? <Ask text={sel ? c.askTag : c.askSel} hint={msg} /> : null}
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={glue(raw)} flash={flash} focus={id} focusKey={'m' + round} hl={done ? null : [id]} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id === id && !done ? {
            cls: 'is-hl',
            content: <><Tag tag="p" /><WordLine toks={toks} marks={[]} sel={sel} onWord={onWord} canTap={canTap} led={led && !sel}
              hlRange={ladder.level >= 3 ? target : null} /><Tag tag="p" close /></>
          } : null)} />
          {!done ? <MarkRow onPick={onTag} canTap={canTap} ready={!!sel} led={led && !!sel} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 10. ПРОВЕРКА. Страница финала: три поломки — найти строку и выбрать исправление.
const BUGS = ['one', 'closed', 'para'];
const BUG_LINE = { one: 'f2', closed: 'f5', para: 'f6' };
function finLines(pick, fixed) {
  const whenParts = fixed.closed
    ? [txt(pick(FIN.whenPre)), { k: 'b', v: pick(FIN.whenB) }, txt(pick(FIN.whenPost))]
    : [txt(pick(FIN.whenPre)), { k: 'b', v: pick(FIN.whenB) + pick(FIN.whenPost) }];
  return [
    blk('f1', 'h1', pick(FIN.title)),
    blk('f2', fixed.one ? 'h2' : 'h1', pick(FIN.teams)),
    blk('f3', 'p', pick(FIN.teamsP)),
    blk('f4', 'h2', pick(FIN.when)),
    blk('f5', 'p', whenParts),
    blk('f6', fixed.para ? 'p' : 'h2', pick(FIN.free))
  ];
}
function S10({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const [fixed, setFixed] = useState(rec ? { one: true, closed: true, para: true } : {});
  const [found, setFound] = useState(null);
  const done = BUGS.every((k) => fixed[k]);
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [helped, setHelped] = useState(false);
  const [flash, setFlash] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, Object.keys(fixed).length * 2 + (found ? 1 : 0));
  const openBug = BUGS.find((k) => !fixed[k]);
  const tapLine = (lineId) => {
    if (!canTap || done) return;
    const bug = BUGS.find((k) => BUG_LINE[k] === lineId && !fixed[k]);
    if (!bug) {
      sfx('soft', true); wobble(lineId); setHelped(true);
      const lv = ladder.bump();
      const h = lv >= 2 ? c.hints[lv - 1] : c.fine;
      setMsg(h); sayNow(h, 'think');
      return;
    }
    sfx('tap', true); setFound(bug); setMsg(null);
    sayNow(c.bugs[bug].found, 'point');
  };
  const fix = (f) => {
    if (!canTap || !found) return;
    if (!f.ok) { sfx('soft', true); setHelped(true); setMsg(c.bugs[found].bad); sayNow(c.bugs[found].bad, 'think'); return; }
    sfx('ok', true);
    const nf = Object.assign({}, fixed, { [found]: true });
    setFixed(nf); setFlash({ id: BUG_LINE[found], n: Date.now() });
    setFound(null); setMsg(null); ladder.reset();
    if (BUGS.every((k) => nf[k])) {
      put({ done: true });
      putAch(store, 'fix', helped ? 'help' : 'self');
      sayNow(c.done, 'cheer');
    } else sayNow(c.fixed, 'smile');
  };
  const raw = finLines(pick, fixed);
  // Честное превью: незакрытый <b> делает жирным всё ниже по странице.
  const shownBlocks = fixed.closed ? raw : raw.map((b, i) => (i > 4 ? Object.assign({}, b, { parts: b.parts.map((x) => ({ k: 'b', v: x.v })) }) : b));
  const lines = srcLines(raw, { frame: 'body' }).map((ln) => {
    if (ln.id !== 'f5' || fixed.closed) return ln;
    const t = ln.toks;   // open p, pre, open b, text, close b, close p → без close b
    return Object.assign({}, ln, { toks: t.filter((x) => !(x.k === 'close' && x.tag === 'b')) });
  });
  const markLine = ladder.level >= 3 && openBug ? BUG_LINE[openBug] : null;
  // Найденная поломка — её правило первым: на телефоне видно именно его.
  const rules = (found ? [found].concat(BUGS.filter((k) => k !== found)) : BUGS).map((k) => ({ id: k, ok: !!fixed[k], text: c.rules[k] }));
  const ask = done ? c.askDone : found ? c.askFix : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <div className="zg-insp"><Inspector rules={rules} /></div>
      {!done ? <Ask text={ask} hint={msg} /> : null}
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(FIN.title)} blocks={shownBlocks} flash={flash} focus={found ? BUG_LINE[found] : 'f2'} focusKey={(found || '') + Object.keys(fixed).join('')}
          hl={found ? [BUG_LINE[found]] : null} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id ? {
            onTap: () => tapLine(ln.id), disabled: !canTap || done || !!found,
            led: (led && !found && ln.id === markLine) || (ln.id === markLine),
            cls: (found && BUG_LINE[found] === ln.id ? 'is-hl' : '') + (shake === ln.id ? ' zg-shake' : '')
              + (BUGS.some((k) => fixed[k] && BUG_LINE[k] === ln.id) ? ' zg-fixed' : '')
          } : null)} />
          {found ? (
            <div className="zg-fixes" role="group">
              {c.fixes[found].map((f) => (
                <button key={f.id} type="button" className="zg-fix" disabled={!canTap} onClick={() => fix(f)}>
                  <span translate="no">{pick(f.label)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>} />
    </Stage>
  );
}

// ── 11. НОВЫЙ РАЗДЕЛ. Строка заголовка целиком: <h2>Финал</h2>.
// Разбор набранной строки — честно, как браузер: тег, текст, закрыт ли.
function parseLine(raw) {
  const s = String(raw || '').trim();
  const m = s.match(/^<\s*([a-z0-9]+)\s*>([\s\S]*)$/i);
  if (!m) return { tag: null, text: s };
  const tag = m[1].toLowerCase();
  const c = m[2].match(/^([\s\S]*?)<\s*(\/?)\s*([a-z0-9]*)\s*>\s*$/i);
  if (c) return { tag, text: c[1].trim(), close: true, slash: !!c[2], closeTag: c[3].toLowerCase() };
  return { tag, text: m[2].replace(/<[^>]*$/, '').trim(), close: false };
}
function lineIssue(raw, msgs) {
  const s = String(raw || '').trim();
  if (!s) return msgs.empty;
  const r = parseLine(s);
  if (!r.tag) return msgs.noTag;
  if (r.tag === 'h1') return msgs.h1;
  if (/^h[3-6]$/.test(r.tag)) return msgs.deep;
  if (r.tag === 'p') return msgs.p;
  if (r.tag !== 'h2') return msgs.other;
  if (!hasLetters(r.text)) return msgs.noText;
  if (!r.close) return msgs.noClose;
  if (!r.slash) return msgs.noSlash;
  if (r.closeTag !== 'h2') return msgs.mismatch;
  return null;
}
function liveBlock(raw) {
  const r = parseLine(raw);
  if (!String(raw || '').trim()) return null;
  if (r.tag && /^(h[1-6]|p)$/.test(r.tag)) return blk('fh', r.tag, r.text || '​');
  return blk('fh', null, r.tag ? r.text : String(raw).trim());
}
function S11({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const done = !!(rec && rec.done);
  const ty = useTagTyping({ max: 40 });
  const ladder = useLadder(0);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, ty.val.length);
  const check = () => {
    if (!canTap || done) return;
    const issue = lineIssue(ty.val, c.msgs);
    if (!issue) {
      const r = parseLine(ty.val);
      sfx('ok', true); setMsg(null);
      put({ done: true, text: r.text, line: ty.val.trim() });
      putAch(store, 'write', ladder.ref.current ? 'help' : 'self');
      sayNow(c.done, 'cheer');
      return;
    }
    sfx('soft', true); wobble('in');
    const lv = ladder.bump();
    const h = lv >= 3 ? c.hints[2] : issue;
    setMsg(h); sayNow(h, 'think');
  };
  const base = docLines(pick, { marks: true });
  const nb = done ? blk('fh', 'h2', rec.text) : liveBlock(ty.val);
  const monBlocks = base.concat(nb ? [nb] : [], [blk('fp', 'p', pick(PAGE.finalP))]);
  const codeBase = srcLines(base, { frame: 'none', collapse: (b) => b.id !== 'prizes' && b.id !== 'zp' })
    .filter((ln) => ['prizes', 'zp'].indexOf(ln.id) >= 0).map((ln) => Object.assign({}, ln, { d: 1 }));
  const fp = srcLines([blk('fp', 'p', pick(PAGE.finalP))], { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1 }));
  const typeLine = done ? srcLines([blk('fh', 'h2', rec.text)], { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1, cls: 'zg-in' }))
    : [{ key: 'type', id: 'type', d: 1, toks: [{ k: 'node', node: (
      <InlineInput value={ty.val} onChange={ty.setVal} inputRef={ty.inputRef} placeholder={c.ph} max={40}
        label={c.ph} onEnter={check} cls={'tk-input-tag zg-in-line' + (led ? ' is-led-in' : '') + (shake === 'in' ? ' zg-shake' : '')} />
    ) }] }];
  const lines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }, { key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }]
    .concat(codeBase, typeLine, fp, [{ key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const ask = done ? c.askDone : fillL(c.ask, { f: PAGE.final, x: PAGE.prizes });
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={monBlocks} focus="fp" focusKey={done ? 'd' : 't' + (nb ? nb.tag : '')}
          flash={done ? { id: 'fh', n: 1 } : null} hl={done ? null : ['fh']} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => (ln.id === 'type' ? { cls: 'is-hl zg-typing' } : ln.id === 'prizes' ? { cls: 'zg-keep' } : ln.cls ? { cls: ln.cls } : null)} />
          {!done ? <KeyRow keys={['<', '/', '>']} ty={ty} canTap={canTap} onCheck={check} ready={/<\s*\/\s*h2\s*>\s*$/i.test(ty.val)} /> : null}
        </div>} />
    </Stage>
  );
}

// ── 12. СВОЙ РАЗДЕЛ. Заголовок h2, абзац p, одно слово — <b>.
const okWords = (s) => String(s || '').trim().split(/\s+/).filter((w) => /[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ]/.test(w)).length;
function S12({ p }) {
  const pick = usePick();
  const store = useStore();
  const narrow = useNarrow();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const [head, setHead] = useState(rec ? rec.head : '');
  const [text, setText] = useState(rec ? rec.text : '');
  const [phase, setPhase] = useState(rec && rec.done ? 'done' : 'head');   // head · text · bold · done
  const [boldAt, setBoldAt] = useState(rec && rec.done ? rec.boldAt : null);
  const [msg, setMsg] = useState(null);
  const [shake, wobble] = useShake();
  const headRef = useRef(null), textRef = useRef(null);
  const toks = useMemo(() => toTokens(text), [text]);
  const headOk = hasLetters(head) && !hasTags(head);
  const textOk = okWords(text) >= 2 && !hasTags(text);
  const done = phase === 'done' && headOk && textOk;
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.done : c.say, pose: done ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, phase === 'head' ? head.length : phase === 'text' ? text.length + 100 : 999);
  // Раздел ученика — в хранилище и в артефакт (и после правки заголовка).
  const save = (h, i) => {
    const word = toks[i].v;
    const blocks = fullPage(pick, store).filter((b) => b.id !== 'oh' && b.id !== 'op')
      .concat([blk('oh', 'h2', h.trim()), blk('op', 'p', partsFrom(toks, [{ a: i, b: i, tag: 'b' }]))]);
    const title = pick(PAGE.name);
    put({ done: true, head: h.trim(), text: text.trim(), bold: word, boldAt: i, title, blocks });
    store.set('artifact', { type: 'html-page', title, blocks, html: buildHtml(title, blocks), mine: { head: h.trim(), text: text.trim(), bold: word } });
  };
  useEffect(() => { if (phase === 'done' && headOk && boldAt != null && toks[boldAt]) save(head, boldAt); }, [head]); // eslint-disable-line react-hooks/exhaustive-deps
  const commit = () => {
    if (!canTap) return;
    if (phase === 'head') {
      if (!headOk) { sfx('soft', true); wobble('head'); const h = hasTags(head) ? c.noTags : c.empty; setMsg(h); sayNow(h, 'think'); return; }
      sfx('ok', true); setMsg(null); setPhase('text');
      requestAnimationFrame(() => { if (textRef.current) textRef.current.focus(); });
      return;
    }
    if (phase === 'text') {
      if (!textOk) { sfx('soft', true); wobble('text'); const h = hasTags(text) ? c.noTags : c.short; setMsg(h); sayNow(h, 'think'); return; }
      sfx('ok', true); setMsg(null); setPhase('bold'); setBoldAt(null);
      if (textRef.current) textRef.current.blur();
    }
  };
  const onWord = (i) => {
    if (!canTap) return;
    if (!headOk) { sfx('soft', true); wobble('head'); const h = hasTags(head) ? c.noTags : c.empty; setMsg(h); sayNow(h, 'think'); return; }
    sfx('pop', true);
    setBoldAt(i);
    save(head, i);
    if (phase !== 'done') { setPhase('done'); setMsg(null); putAch(store, 'own', 'self'); sayNow(c.done, 'cheer'); }
  };
  const editText = () => { if (!canTap) return; sfx('tap', true); setPhase('text'); setBoldAt(null); requestAnimationFrame(() => { if (textRef.current) textRef.current.focus(); }); };
  const ownParts = boldAt != null && toks[boldAt] ? partsFrom(toks, [{ a: boldAt, b: boldAt, tag: 'b' }]) : [txt(text)];
  const monBlocks = docLines(pick, { marks: true }).concat(finalBlocks(pick, store),
    head.trim() ? [blk('oh', 'h2', head.trim())] : [], text.trim() ? [blk('op', 'p', ownParts)] : []);
  const headLine = { key: 'oh', id: 'oh', d: 1, tag: 'h2', toks: [{ k: 'open', tag: 'h2' }, { k: 'node', node: (
    <InlineInput value={head} onChange={setHead} inputRef={headRef} placeholder={c.phHead} max={40}
      label={c.conds.head} onEnter={commit} onFocus={() => { if (phase === 'text' && !textOk) setPhase('head'); }}
      cls={(led && phase === 'head' ? 'is-led-in' : '') + (shake === 'head' ? ' zg-shake' : '')} />
  ) }, { k: 'close', tag: 'h2' }] };
  const textNode = phase === 'bold' || phase === 'done'
    ? <><WordLine toks={toks} marks={boldAt != null ? [{ a: boldAt, b: boldAt, tag: 'b' }] : []} sel={null} onWord={onWord} canTap={canTap} led={led && phase === 'bold'} />
      <button type="button" className="zg-edit" onClick={editText} disabled={!canTap} aria-label={pick(UI.edit)}><Icon name="undo" size={14} /></button></>
    : (
      <InlineInput value={text} onChange={setText} inputRef={textRef} placeholder={c.phText} max={90}
        label={c.conds.text} onEnter={commit} onFocus={() => { if (phase === 'head' && headOk) setPhase('text'); }}
        cls={(led && phase === 'text' ? 'is-led-in' : '') + (shake === 'text' ? ' zg-shake' : '')} />
    );
  const textLine = { key: 'op', id: 'op', d: 1, tag: 'p', toks: [{ k: 'open', tag: 'p' }, { k: 'node', node: textNode }, { k: 'close', tag: 'p' }] };
  const lines = [{ key: 'body-o', d: 0, toks: [{ k: 'open', tag: 'body' }] }, { key: 'more', d: 1, toks: [{ k: 'text', v: '…', dim: true }] }]
    .concat(srcLines(finalBlocks(pick, store), { frame: 'none' }).map((ln) => Object.assign({}, ln, { d: 1 })),
      [headLine, textLine, { key: 'body-c', d: 0, toks: [{ k: 'close', tag: 'body' }] }]);
  const conds = [{ id: 'head', ok: headOk && phase !== 'head', text: c.conds.head }, { id: 'text', ok: textOk && (phase === 'bold' || phase === 'done'), text: c.conds.text },
    { id: 'bold', ok: phase === 'done' && boldAt != null, text: c.conds.bold }];
  const ask = done ? c.askDone : phase === 'head' ? c.askHead : phase === 'text' ? c.askText : c.askBold;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={msg || ask} nav={navOf(p, canGo)}>
      <div className="zg-insp"><Conds title={UI.conds} items={conds} /></div>
      <Ask text={ask} hint={msg} />
      <Work cls="zg-work zg-work-sm"
        browser={<Monitor crop={narrow} title={pick(PAGE.name)} blocks={monBlocks} focus={text.trim() ? 'op' : 'oh'} focusKey={phase + ':' + (head ? 1 : 0) + (text ? 1 : 0)} />}
        code={<div className="zg-code">
          <Src lines={lines} className="zg-src" lineProps={(ln) => ((ln.id === 'oh' && phase === 'head') || (ln.id === 'op' && phase !== 'head' && !done) ? { cls: 'is-hl zg-typing' } : null)} />
          {phase === 'head' || phase === 'text' ? (
            <div className="zg-go">
              <button type="button" className={'key-b key-go' + ((phase === 'head' ? headOk : textOk) ? ' is-ready' : '')} disabled={!canTap} onClick={commit}>
                <Icon name="check" size={16} />{pick(UI.ready)}
              </button>
            </div>
          ) : null}
        </div>} />
    </Stage>
  );
}

// ── 13. ФИНАЛ. Страница на мониторе зала, что получилось, следующий урок.
function S13({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s13;
  const ach = store.get('ach') || {};
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 700); return () => clearTimeout(t); }, []);
  const blocks = fullPage(pick, store);
  const own = ownBlocks(store).length ? 'oh' : 'fh';
  const list = ['levels', 'close', 'fix', 'write', 'own'].filter((k) => ach[k]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={c.btn} /></>}>
      <div className="zg-fin">
        <div className="zg-fin-mon">
          <Monitor title={pick(PAGE.name)} blocks={blocks} focus={own} focusKey="fin" hl={ownBlocks(store).length ? ['oh', 'op'] : null} cls="zg-mon-hero" />
        </div>
        <div className="zg-fin-side">
          {list.length ? (
            <div className="ach" aria-label={pick(UI.done)}>
              {list.map((k) => (
                <span key={k} className={'ach-i' + (ach[k] === 'self' ? ' is-self' : '')}><span className="ach-m"><Icon name={ach[k] === 'self' ? 'star' : 'check'} size={12} /></span>{pick(c.ach[k][ach[k] === 'self' ? 'self' : 'help'])}</span>
              ))}
            </div>
          ) : null}
          <div className="bye-next next-card">
            <span className="bye-next-ic"><Icon name="list" size={22} /></span>
            <span className="bye-next-t"><span>{pick(UI.nextLesson)}</span><b>{pick(c.next)}</b></span>
            <span className="next-tags mono" translate="no">ul · ol · li</span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 }, { id: 's3', code: 'PREDICT', Comp: S3 },
  { id: 's4', code: 'SHOW', Comp: S4 }, { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-1', Comp: S6 },
  { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's9', code: 'LEVEL-4', Comp: S9 },
  { id: 's10', code: 'CHECK', Comp: S10 }, { id: 's11', code: 'TRANSFER', Comp: S11 }, { id: 's12', code: 'RESULT', Comp: S12 },
  { id: 's13', code: 'ACHIEVEMENT', Comp: S13 }
];
// «Повторить» стирает только этот экран; свой раздел (s12), артефакт и
// достижения (ach) повтор других экранов не трогает.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'] };

export default function HtmlZagolovkiMonitor({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: store.get('artifact') || makeArtifact(store), achievements: store.get('ach') || {} })
  });
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const p = { screen: R.i, total: SCREENS.length, next: R.next, prev: R.i > 0 ? R.prev : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}

// =============================================================================
// CSS УРОКА: стили урока 2 (код, браузер, клавиши …) + кит anatomy + свои (zg-…).
// =============================================================================
const LESSON_CSS = CANON_SCREEN_CSS + `
/*@L2_CSS@*/
/*@ISO_CSS@*/
/*@FILE:zg-own.css@*/
`;
