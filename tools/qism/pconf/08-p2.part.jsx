// Практика 8 «Сайт школы Коди», ЧАСТЬ 2: section и свой сайт (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Новая тема»: вторая тема попадает в ту же рамку main), три задания по темам части 2 урока
// (НОВОЕ т1 разложить две темы по section, прежнее т3 как т2 — section с h2 и абзацем, НОВОЕ т3 найти незакрытый
// section — рамка второго раздела легла внутрь первого) и прежнее «своё» (т4, бывшее т5: header, main, footer).
// Вывод — прежний Fin с четырьмя вкладками (правки в build-prac: TABS[4] → TABS[3]).

// ── Карта части 2: четыре страницы (вкладки). ──
Object.assign(A8_ICO, {
  book: <><path d="M4 19V6a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2z" /><path d="M9 8h7M9 12h5" /></>,
  cal: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>
});
Object.assign(PG, {
  about: L3("Maktab haqida", 'О школе', 'About'),
  events: L3("Tadbirlar", 'События', 'Events')
});
TABS.splice(0, TABS.length,
  { id: 'about', file: 'haqida.html', ico: 'book', c: '#7C5CFA', name: PG.about },
  { id: 'clubs', file: 'togaraklar.html', ico: 'gear', c: '#0FA38E', name: PG.clubs },
  { id: 'events', file: 'tadbirlar.html', ico: 'cal', c: '#F59E0B', name: PG.events },
  { id: 'mine', file: 'mening.html', ico: 'star', c: '#E44D26', name: L3("Mening saytim", 'Мой сайт', 'My site') }
);
// Темы страниц: h — заголовок раздела, p — абзац. Хук, образец и дополнительные задачи — свои слова.
const XTRA2 = {
  hook: {
    t1: { h: L3("Futbol", 'Футбол', 'Football'), p: L3("Har kuni o'ynaymiz.", 'Играем каждый день.', 'We play every day.') },
    t2: { h: L3("Rasm chizish", 'Рисование', 'Drawing'), p: L3("Chiroyli rasmlar chizamiz.", 'Рисуем красивые картинки.', 'We draw nice pictures.') }
  },
  about: [
    { h: L3("Tarix", 'История', 'History'), p: L3("Maktab 2020-yilda ochilgan.", 'Школа открылась в 2020 году.', 'The school opened in 2020.') },
    { h: L3("Jamoa", 'Команда', 'Team'), p: L3("Bizda o'n ikki ustoz bor.", 'У нас двенадцать учителей.', 'We have twelve teachers.') }
  ],
  sport: [
    { h: L3("Futbol", 'Футбол', 'Football'), p: TXT.sportP },
    { h: L3("Voleybol", 'Волейбол', 'Volleyball'), p: L3("Haftada ikki marta.", 'Два раза в неделю.', 'Twice a week.') }
  ],
  sample: [
    { h: L3("Ertalab", 'Утро', 'Morning'), p: L3("Nonushta qilamiz.", 'Завтракаем.', 'We have breakfast.') },
    { h: L3("Kechqurun", 'Вечер', 'Evening'), p: L3("Kitob o'qiymiz.", 'Читаем книги.', 'We read books.') }
  ],
  events: [
    { h: L3("Ko'rgazma", 'Выставка', 'Show'), p: L3("Robotlar ko'rgazmasi.", 'Выставка роботов.', 'A robot show.') },
    { h: L3("Konsert", 'Концерт', 'Concert'), p: L3("Qo'shiq va raqs.", 'Песни и танцы.', 'Songs and dances.') }
  ],
  gallery: [
    { h: L3("Rasmlar", 'Фото', 'Photos'), p: L3("Yangi rasmlar.", 'Новые фото.', 'New photos.') },
    { h: L3("Videolar", 'Видео', 'Videos'), p: L3("Tez orada videolar.", 'Скоро видео.', 'Videos soon.') }
  ]
};

Object.assign(UI, {
  addTopic: L3("Yangi mavzu", 'Новая тема', 'New topic'),
  secPattern1: L3("1-mavzu", 'тема 1', 'topic 1'),
  secPattern2: L3("2-mavzu", 'тема 2', 'topic 2')
});

// ── Фразы проверки новых заданий (ввода ученика в них нет). ──
Object.assign(FB, {
  oneTopic: L3("Bitta bo'limda bitta mavzu bo'ladi. Ikkinchi mavzu uchun alohida section kerak.",
    'В одном разделе одна тема. Для второй темы нужен свой section.',
    'One section holds one topic. The second topic needs a section of its own.'),
  keepTopics: L3("So'zlar o'sha-o'sha qolsin: har bir bo'limda o'z sarlavhasi va o'z abzasi tursin.",
    'Слова пусть остаются прежними: в каждом разделе свой заголовок и свой абзац.',
    'Keep the words as they were: each section gets its own heading and its own paragraph.'),
  closeAtEnd: L3("Yopuvchi section qatorning eng oxirida turadi: sarlavha ham, abzas ham bo'lim ichida qoladi.",
    'Закрывающий section ставится в самом конце строки: и заголовок, и абзац остаются внутри раздела.',
    'The closing section goes at the very end of the line: both the heading and the paragraph stay inside the section.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
const OLD_SEC = C.t3;       // прежнее т3 (section с h2 и абзацем) становится т2
const OLD_OWN = C.t5;       // прежнее т5 (свой сайт) становится т4
const FIN_OLD = C.fin;      // подписи плашек и строка задания вывода — прежние
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! Maktab saytining to'rtta sahifasini tuzatdik, yana to'rttasi qoldi: maktab haqida, to'garaklar, tadbirlar va sizning saytingiz. Lekin oldin kichik sinov. Mana bosh sahifa, uning asosiy qismida bitta mavzu bor: futbol. Endi unga yana bitta mavzu qo'shamiz. «Yangi mavzu»ni bosing, nima bo'larkin?",
      'Привет! Четыре страницы школьного сайта мы починили, ещё четыре ждут: о школе, кружки, события и твой сайт. Но сначала маленький опыт. Вот главная, в её главной части одна тема: футбол. Сейчас добавим ещё одну. Нажми «Новая тема»: что получится?',
      'Hi! We fixed four pages of the school site, and four more are waiting: about the school, clubs, events and your own site. But first, a little experiment. Here’s the home page, with one topic in its main part: football. Now we’ll add another one. Tap “New topic”: what will happen?'),
    broke: L3("Ko'rdingizmi? Ikkinchi mavzu, rasm chizish, ham xuddi shu ramkaga tushdi. Futbol qayerda tugab, rasm chizish qayerda boshlanishini endi na Inspektor, na kod ko'rsatadi: hammasi bitta asosiy qismda aralashib ketdi!",
      'Видишь? Вторая тема, рисование, попала в ту же рамку. Где кончается футбол и начинается рисование, теперь не покажет ни Инспектор, ни код: всё смешалось в одной главной части!',
      'See? The second topic, drawing, landed in the same frame. Where football ends and drawing begins, neither the Inspector nor the code can show now: everything got mixed up in one main part!'),
    done: L3("Demak, har bir mavzuga o'z bo'limi kerak: section. Bitta bo'limda bitta mavzu bo'ladi, shunda ramkalar ham alohida chiqadi. Endi bu qoidani to'rtta sahifada sinab ko'ramiz, oxirgisida esa o'z saytingizni yig'asiz.",
      'Значит, каждой теме нужен свой раздел: section. В одном разделе одна тема, и тогда рамки тоже будут отдельные. Попробуем это правило на четырёх страницах, а на последней ты соберёшь свой сайт.',
      'So each topic needs a section of its own. One section holds one topic, and then the frames come out separate too. We’ll try this rule on four pages, and on the last one you’ll build your own site.'),
    ask: L3("«Yangi mavzu»ni bosing", 'Нажми «Новая тема»', 'Tap “New topic”'),
    askDone: L3("Ikki mavzu, lekin bitta ramka", 'Две темы, но одна рамка', 'Two topics, but one frame')
  },
  // Т1 (новое): две темы лежат в main вперемешку — положить каждую в свой section.
  t1: {
    eyebrow: L3("Maktab haqida", 'О школе', 'About'),
    say: L3("Maktab haqida sahifasida asosiy qismga ikkita mavzu tushib qolgan: tarix va jamoa. Ular bitta ramkada aralashib yotibdi, qayerda biri tugab, ikkinchisi boshlanishini Inspektor ham ko'rsata olmayapti. Har bir mavzuni o'z bo'limiga soling: oldin ochuvchi section, ichida sarlavha bilan abzas, keyin yopuvchi section. Bo'sh qatorlar sizni kutib turibdi.",
      'Первая страница: «О школе». В главной части лежат две темы, история и команда, и обе в одной рамке. Где кончается одна и начинается другая, не покажет даже Инспектор. Положи каждую тему в свой раздел: открывающий section, внутри заголовок и абзац, потом закрывающий section. Пустые строки уже ждут тебя.',
      'The first page is “About”. The main part holds two topics, history and team, and both sit in one frame. Even the Inspector can’t show where one ends and the other begins. Put each topic into a section of its own: the opening section, the heading and paragraph inside, then the closing section. The empty lines are already waiting for you.'),
    ask: L3("Har bir mavzuni o'z section ichiga soling", 'Положи каждую тему в свой section', 'Put each topic into its own section'),
    ok: L3("Ikkala mavzu o'z bo'limiga tushdi, Inspektor ularni alohida ramkaga oldi! Endi qaysi gap qayerda turganini bir qarashda ko'rasiz.",
      'Вот это порядок! Каждая тема в своём разделе, и Инспектор обвёл их отдельными рамками!',
      'Now that’s tidy! Each topic is in a section of its own, and the Inspector framed them separately!'),
    hints: [
      L3("Asosiy qismda nechta mavzu bor? Ikkita. Demak, nechta bo'lim kerak?",
        'Сколько тем в главной части? Две. Значит, сколько нужно разделов?',
        'How many topics are in the main part? Two. So how many sections do you need?'),
      L3("Bitta bo'limda bitta mavzu bo'ladi. Tarixning sarlavhasi bilan abzasini section teglarining o'rtasiga oling, jamoani ham shunday qiling.",
        'В одном разделе одна тема. Заголовок и абзац истории возьми между открывающим и закрывающим section. С командой сделай так же.',
        'One section holds one topic. Take the history heading and paragraph between the opening and closing section. Do the same with the team.'),
      L3("Mana ikki mavzu ikkita bo'limda turibdi. Siz ham shunday qiling, faqat so'zlar boshqa.",
        'Вот две темы в двух разделах. Сделай так же, только слова другие.',
        'Here are two topics in two sections. Do the same, just with different words.')
    ],
    drill: L3("Endi sport sahifasi: ikkita mavzuni ikkita bo'limga soling", 'Теперь страница спорта: положи две темы в два раздела', 'Now the sport page: put the two topics into two sections')
  },
  // Т2 (бывшее т3): section с h2 и абзацем — первый лист уже готов.
  t2: Object.assign({}, OLD_SEC, {
    say: L3("Birinchi sahifa tayyor! " + OLD_SEC.say.uz,
      OLD_SEC.say.ru.replace('Две страницы готовы! Третья: кружки.', 'Первая страница готова! Вторая: кружки.'),
      OLD_SEC.say.en.replace('Two pages are done! The third is clubs.', 'One page is done! The second is clubs.'))
  }),
  // Т3 (новое): найти незакрытый section — рамка второго раздела легла внутрь первого.
  t3: {
    eyebrow: L3("Tadbirlar", 'События', 'Events'),
    say: L3("Ikki sahifa tayyor! Endi tadbirlar sahifasi. Unda ikkita bo'lim bor, lekin Inspektor ikkinchi ramkani birinchisining ichiga solib qo'yibdi. Bunday bo'lmasligi kerak, demak, kodda bir qator buzilgan. Oldin shu qatorni toping-da, ustiga bosing.",
      'Две страницы готовы! Теперь страница событий. На ней два раздела, но Инспектор положил вторую рамку внутрь первой. Так быть не должно, значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Two pages are done! Now the events page. It has two sections, but the Inspector put the second frame inside the first. That’s not how it should be, so one line of code is broken. First find that line and tap it.'),
    ask: L3("Buzilgan qatorni bosing", 'Нажми сломанную строку', 'Tap the broken line'),
    ask2: L3("Shu qatorni tuzating", 'Почини эту строку', 'Fix this line'),
    found: L3("Topdingiz! Bu bo'lim yopilmagan: yopuvchi section tegi yo'q, shuning uchun ikkinchi bo'lim uning ichiga tushib qoldi. Qatorning oxiriga yopuvchi section tegini yozing.",
      'Нашлась! Этот раздел не закрыт: нет закрывающего section, поэтому второй раздел оказался внутри него. Допиши в конце строки закрывающий section.',
      'Found it! This section isn’t closed: there’s no closing section, so the second section ended up inside it. Add the closing section at the end of the line.'),
    ok: L3("Bo'limlar yonma-yon turibdi! Yopuvchi teg bo'lim qayerda tugashini ko'rsatadi, uni unutmang.",
      'Ура, заработало! Разделы встали рядом. Закрывающий тег показывает, где раздел кончается, не забывай его!',
      'Yes, it works! The sections stand side by side. The closing tag shows where a section ends, so never skip it!'),
    why: {
      0: L3("Bu yerda body ochiladi, qator butun. Ramkalarga qarang: qaysi bo'lim qo'shnisini ichiga olib qo'ygan?",
        'Здесь открывается body, строка в порядке. Посмотри на рамки: какой раздел проглотил соседа?',
        'body opens here, this line is fine. Look at the frames: which section swallowed its neighbour?'),
      1: L3("Bu yerda main ochiladi, u bitta va joyida. Bo'limlar qatorlariga qarang.",
        'Здесь открывается main, он один и на месте. Посмотри на строки разделов.',
        'main opens here, there’s just one and it’s fine. Look at the section lines.'),
      3: L3("Bu bo'lim oxirigacha yopilgan: oxirida yopuvchi section turibdi. Yuqoridagi bo'limga qarang.",
        'Этот раздел закрыт как надо: в конце есть закрывающий section. Посмотри на раздел выше.',
        'This section is closed properly: it has a closing section at the end. Look at the section above.'),
      4: L3("Bu yerda main yopiladi, qator butun.",
        'Здесь закрывается main, строка в порядке.',
        'main closes here, this line is fine.'),
      5: L3("Pastda body yopiladi, bu qator ham butun.",
        'Здесь закрывается body, строка в порядке.',
        'body closes here, this line is fine.')
    },
    hints: [
      L3("Ramkalarga qarang-chi: ikkinchi bo'lim birinchisining ichiga tushib qolibdi, ular yonma-yon turishi kerak edi. Qaysi bo'limning ramkasi pastgacha cho'zilib ketgan?",
        'Посмотри на рамки: второй раздел попал внутрь первого, а они должны стоять рядом. У какого раздела рамка растянулась вниз?',
        'Look at the frames: the second section got inside the first, but they should stand side by side. Whose frame stretched down?'),
      L3("Har bir bo'lim ochuvchi section bilan boshlanadi, yopuvchi section bilan tugaydi. Qaysi qatorda yopuvchi section yo'q?",
        'Каждый раздел начинается открывающим section и кончается закрывающим section. В какой строке закрывающего нет?',
        'Every section starts with an opening section and ends with a closing one. Which line has no closing section?'),
      L3("Mana yopilgan bo'lim: oxirida yopuvchi section turibdi. Siz ham qatorning oxiriga shuni yozing.",
        'Вот закрытый раздел: в конце стоит закрывающий section. Допиши и ты в конце строки такой же.',
        'Here’s a closed section: the closing section stands at the end. Add the same at the end of your line.')
    ],
    drill: L3("Bu sahifada ham bo'lim yopilmagan: qatorni toping va tuzating", 'Здесь тоже раздел не закрыт: найди строку и почини', 'A section is not closed here either: find the line and fix it')
  },
  // Т4 (бывшее т5): свой сайт — четвёртая страница, три готовы.
  t4: Object.assign({}, OLD_OWN, {
    say: L3(OLD_OWN.say.uz,
      OLD_OWN.say.ru.replace('Четыре страницы горят! Теперь пятая:', 'Три страницы горят! Теперь четвёртая:'),
      OLD_OWN.say.en.replace('Four pages are lit! Now the fifth:', 'Three pages are lit! Now the fourth:'))
  }),
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, maktab saytining qolgan sahifalari ham tayyor: maktab haqida, to'garaklar, tadbirlar va sizning saytingiz. Endi o'zingiz qurgan sinf saytini tepadan pastga bir aylanib chiqamiz.",
        'Смотри, остальные страницы школьного сайта тоже готовы: о школе, кружки, события и твой сайт. Теперь пройдёмся сверху вниз по сайту, который собран твоими руками.',
        'Look, the other pages of the school site are ready too: about the school, clubs, events and your own site. Now let’s walk from top to bottom through the site you built yourself.') },
      { k: 'header', text: L3("Eng tepada header turibdi: sayt nomi bilan menyu shu yerda yashaydi. Uni head bilan adashtirmang.",
        'Наверху header: в нём название сайта и меню. Не путай его с head.',
        'At the top is header, with the site name and the menu. Don’t mix it up with head.') },
      { k: 'nav', text: L3("header ichida nav turadi: u menyuni o'rab oladi.",
        'Внутри header стоит nav: он оборачивает меню.',
        'Inside header stands nav: it wraps the menu.') },
      { k: 'main', text: L3("O'rtada main turibdi: u sahifaning asosiy qismini o'rab oladi. Sahifada main faqat bitta bo'ladi.",
        'Посередине main: он оборачивает главную часть страницы. На странице он один.',
        'In the middle is main: it wraps the main part of the page. A page has just one.') },
      { k: 'section', text: L3("main ichida section bo'limlari yashaydi. Bitta bo'limda bitta mavzu bo'ladi: tarixning ham, jamoaning ham, tadbirlarning ham o'z bo'limi bor. Yopuvchi section esa bo'lim qayerda tugashini ko'rsatadi.",
        'Внутри main живут разделы section. В одном разделе одна тема: у истории, у команды и у событий свой раздел. А закрывающий section показывает, где раздел кончается.',
        'Inside main live the sections. One section holds one topic: history, team and events each have a section of their own. And the closing section shows where a section ends.') },
      { k: 'footer', text: L3("Eng pastda footer turadi: bu sayt oxiri.",
        'Внизу footer: это низ сайта.',
        'At the bottom is footer: the bottom of the site.') },
      { k: 'own', text: L3("Bu saytni o'zingiz noldan qurdingiz, Inspektor esa unda birorta ham qismni o'tkazib yubormadi! Endi butun kursdagi bilimlaringizni bitta saytga yig'adigan katta loyiha sizni kutyapti.",
        'Этот сайт собран тобой с нуля, и Инспектор не пропустил ни одной части! Дальше тебя ждёт большой проект, который соберёт знания всего курса в один сайт.',
        'You built this site from scratch, and the Inspector didn’t miss a single part! A big project is next, one that brings the whole course together in a single site.') }
    ],
    roles: FIN_OLD.roles,
    ask: FIN_OLD.ask
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т1 (новое) · разложить две темы по section. Страница «Maktab haqida»: в main подряд h2 и p двух тем без разделов.
// В редакторе четыре пустые строки: открывающий и закрывающий section у каждой темы. Проверка: два section подряд,
// в каждом свой h2 и p, слова прежние.
// ─────────────────────────────────────────────────────────────────────────────
function a8SecsCheck(code, words) {
  const r = a8Struct(code);
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  if (N.some((n) => n.kind === 'part' && n.tag === 'main')) return { ok: false, msg: FB.oneMain };
  if (N.some((n) => n.kind !== 'part')) return { ok: false, msg: FB.secWrap };
  if (N.some((n) => n.tag !== 'section')) return { ok: false, msg: fillL(FB.partOther, { want: 'section', role: ROLE.section }) };
  if (N.some((n) => n.kids.filter((k) => k.kind === 'block' && k.tag === 'h2').length > 1)) return { ok: false, msg: FB.oneTopic };
  if (N.length < words.length) return { ok: false, msg: FB.keepTopics };
  for (let i = 0; i < words.length; i += 1) {
    const s = N[i];
    const h = s.kids[0];
    if (!(h && h.kind === 'block' && h.tag === 'h2')) return { ok: false, msg: FB.secNeedH2 };
    const pr = s.kids.find((k) => k.kind === 'block' && k.tag === 'p');
    if (!pr) return { ok: false, msg: FB.secNeedP };
    if (s.kids.length !== 2 || a8Norm(h.text) !== a8Norm(words[i].h) || a8Norm(pr.text) !== a8Norm(words[i].p)) return { ok: false, msg: FB.keepTopics };
  }
  if (N.length > words.length) return { ok: false, msg: a8Fb('extra', { got: N[words.length].tag ? '<' + N[words.length].tag + '>' : N[words.length].v }) };
  return { ok: true };
}
// Две темы подряд, вокруг каждой — пустая строка под section (4 пустые строки).
const a8SecsInit = (words) => ['    ', '    ' + a8Wrap('h2', words[0].h), '    ' + a8Wrap('p', words[0].p), '    ', '    ',
  '    ' + a8Wrap('h2', words[1].h), '    ' + a8Wrap('p', words[1].p), '    '].join('\n');
const A8_X1 = { pg: 'about', file: 'haqida.html' };
const A8_X1X = { pg: 'sport', file: 'sport.html' };
function a8SecsView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  ' + a8Wrap('header', a8Wrap('h1', pg)), '  <main>'];
    const after = ['  </main>', '  ' + a8Wrap('footer', x.pick(FOOT)), '</body>'];
    return {
      title: pg, url: d.file, tree: a8Page(before.concat([st.code], after).join('\n')), pageHl: true,
      aid: <A8Parts parts={[{ code: '<section>' }, { word: UI.secPattern1 }, { code: '</section>' }, { code: '<section>' }, { word: UI.secPattern2 }, { code: '</section>' }]} />,
      editor: <A8Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgX1 = (pick) => {
  const words = XTRA2.about.map((t) => ({ h: pick(t.h), p: pick(t.p) }));
  const dr = XTRA2.sport.map((t) => ({ h: pick(t.h), p: pick(t.p) }));
  return {
    id: 't1', num: 1, cls: 't3 a8-x1', kind: 'wrap-sections', C: C.t1,
    init: () => ({ code: a8SecsInit(words) }),
    check: (st) => a8SecsCheck(st.code, words),
    view: a8SecsView(A8_X1),
    sample: (pk) => [].concat(...XTRA2.sample.map((t) => ['<section>', '  ' + a8Wrap('h2', pk(t.h)), '  ' + a8Wrap('p', pk(t.p)), '</section>'])),
    drill: { init: () => ({ code: a8SecsInit(dr) }), check: (st) => a8SecsCheck(st.code, dr), view: a8SecsView(A8_X1X) }
  };
};

// Т2 · section с h2 и абзацем — прежнее задание 3 (номер 2, лист кода как у т3).
const cfgX2 = (pick) => Object.assign(cfgT3(pick), { id: 't2', num: 2, cls: 't3', C: C.t2 });

// ─────────────────────────────────────────────────────────────────────────────
// Т3 (новое) · найти незакрытый section. Страница «Tadbirlar»: у первого раздела нет </section>, поэтому рамка второго
// легла внутрь первой. Нажать строку, дописать закрывающий тег в конце. В дополнительной задаче — «Galereya».
// ─────────────────────────────────────────────────────────────────────────────
const a8SecLine = (h, p, close) => '    <section>' + a8Wrap('h2', h) + a8Wrap('p', p) + (close ? '</section>' : '');
const A8_X3 = { pg: 'events', file: 'tadbirlar.html', bad: 2, data: XTRA2.events,
  lines: (pk) => ['<body>', '  <main>', a8SecLine(pk(XTRA2.events[0].h), pk(XTRA2.events[0].p), false), a8SecLine(pk(XTRA2.events[1].h), pk(XTRA2.events[1].p), true), '  </main>', '</body>'] };
const A8_X3X = { pg: 'gallery', file: 'galereya.html', bad: 2, data: XTRA2.gallery,
  lines: (pk) => ['<body>', '  <main>', a8SecLine(pk(XTRA2.gallery[0].h), pk(XTRA2.gallery[0].p), false), a8SecLine(pk(XTRA2.gallery[1].h), pk(XTRA2.gallery[1].p), true), '  </main>', '</body>'] };
function a8OpenView(d, V) {
  return (st, x) => {
    const title = x.pick(PG[d.pg]);
    const lines = d.lines(x.pick);
    const BAD = d.bad;
    const pickLine = (i) => {
      if (i === BAD) {
        sfx('ok', true);
        x.set({ at: i, code: lines[BAD], miss: null });
        x.t.put({ fails: 0 });
        x.t.setMsg(null);
        x.t.sayNow(V.found, 'point');
        setTimeout(() => { const el = x.inRef.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 80);
        return;
      }
      x.set(Object.assign({}, st, { miss: { at: i, n: Date.now() } }));
      x.t.fail(V.why[i] || V.why[0]);
    };
    if (st.at == null) {
      return {
        title, url: d.file, tree: a8Page(lines.join('\n')), pageHl: true, keys: false, ask: V.ask,
        editor: <A8Code lines={lines} onTap={pickLine} led={x.lv >= 2 ? BAD : null} miss={st.miss} />
      };
    }
    const before = lines.slice(0, BAD);
    const after = lines.slice(BAD + 1);
    return {
      title, url: d.file, tree: a8Page(before.concat([st.code], after).join('\n')), ask: V.ask2,
      editor: <A8Editor before={before} after={after} value={st.code} single onEnter={x.check} inputRef={x.inRef} led={x.led} mark={BAD}
        onChange={(c) => x.set(Object.assign({}, st, { code: c }))} />
    };
  };
}
function a8OpenCheck(st, d, pick, V) {
  if (st.at == null) return { ok: false, msg: V.ask };
  const r = a8Struct(st.code);
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  const f = N[0];
  if (!f) return { ok: false, msg: FB.empty };
  // Закрыли раньше времени: <section><h2>…</h2></section><p>…</p> — абзац остался снаружи.
  if (f.kind === 'part' && f.tag === 'section' && N.length > 1 && N.slice(1).every((n) => n.kind === 'block')) return { ok: false, msg: FB.closeAtEnd };
  if (f.kind !== 'part' || f.tag !== 'section' || N.length > 1) return { ok: false, msg: FB.keepLine };
  const h = f.kids[0], pr = f.kids[1];
  const E = d.data[0];
  if (f.kids.length !== 2 || !h || h.kind !== 'block' || h.tag !== 'h2' || !pr || pr.kind !== 'block' || pr.tag !== 'p'
    || a8Norm(h.text) !== a8Norm(pick(E.h)) || a8Norm(pr.text) !== a8Norm(pick(E.p))) return { ok: false, msg: FB.keepLine };
  return { ok: true };
}
const cfgX3 = (pick) => ({
  id: 't3', num: 3, cls: 't4', kind: 'find-fix-section', C: C.t3,
  init: () => ({ at: null, code: '' }),
  check: (st) => a8OpenCheck(st, A8_X3, pick, C.t3),
  view: a8OpenView(A8_X3, C.t3),
  sample: (pk) => [a8Wrap('section', a8Wrap('h2', pk(PG.sport)) + a8Wrap('p', pk(TXT.sportP)))],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a8OpenCheck(st, A8_X3X, pick, C.t3), view: a8OpenView(A8_X3X, C.t3) }
});

// Т4 · свой сайт — прежнее задание 5 (header, main, footer): номер 4, тексты C.t4; страница в целой практике — пятая,
// здесь четвёртая (TABS[4] → TABS[3] правит build-prac).
const cfgX4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, cls: 't5', C: C.t4 });

const X1 = ({ p }) => <A8Task p={p} make={cfgX1} />;
const X2 = ({ p }) => <A8Task p={p} make={cfgX2} />;
const X3 = ({ p }) => <A8Task p={p} make={cfgX3} />;
const X4 = ({ p }) => <A8Task p={p} make={cfgX4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: главная с одной темой в main. «Новая тема»: вторая тема попадает в ту же рамку main — где
// кончается одна и начинается другая, не видно. Одно касание. Код на телефоне спрятан (как в выводе).
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const H = XTRA2.hook;
  const [rec, put] = useRec('h2');
  const added = !!(rec && rec.done);
  const [flash, setFlash] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: added ? c.done : c.say, pose: added ? 'point' : 'hello' }]);
  const canGo = useAdvanceGate(added, spoken);
  const led = useIdleLed(!added, 0);
  const tabs = useA8Tabs(true);
  const tap = () => {
    if (added) return;
    sfx('ok', true);
    setFlash(1);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const topic = (T) => ['  ' + a8Wrap('h2', pick(T.h)), '  ' + a8Wrap('p', pick(T.p))];
  const code = [a8Wrap('header', a8Wrap('h1', pick(SCHOOL))), '<main>'].concat(topic(H.t1), added ? topic(H.t2) : [], ['</main>', a8Wrap('footer', pick(FOOT))]);
  const lines = a8Body(code);
  const mark = added ? lines.findIndex((s) => s.indexOf('<h2>' + pick(H.t2.h)) >= 0) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a8-sheet a8-fin a8-h2">
        <KzAsk text={added ? c.askDone : c.ask} />
        <div className="a8-work">
          <div className="a8-side">
            <A8Browser tabs={tabs} cur={0} title={pick(PG.index)} url="index.html"><A8Doc tree={a8Page(code.join('\n'))} flash={flash} /></A8Browser>
          </div>
          <div className="a8-main">
            <A8Code lines={lines} mark={mark < 0 ? null : mark} />
            {!added ? (
              <div className="kz-row a8-row">
                <button type="button" className="kz-btn is-coral a8-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  {pick(UI.addTopic)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
