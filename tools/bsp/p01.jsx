// =============================================================================
// ===== ПРАКТИКА 1 · «E'lonlar qaytadi» · к уроку 1 «Введение в Bootstrap» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Сайт кружка роботов из урока 1: пять страниц, на каждой e'lon Bootstrap. При обновлении
// пропала строка link — сайт стал голым, вкладки погасли. Коди возвращает строку link, ученик восстанавливает e'lonlar:
// поменять слово цвета в готовом class (sariq — theme-warning) → вписать в пустой class два слова (alert theme-success)
// → взять пример Alert с сайта (копировать, вставить) и настроить: цвет и свой текст → починить страницу: буква
// в адресе link (заново с сайта) и имя версии 5 alert-danger → своя страница: link в head, h1, e'lon с цветом,
// script в конце body (всё — с сайта, настроено под себя). Главное умение модуля — найти на сайте, скопировать, настроить.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-01p-vvedenie.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-01p-vvedenie',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "1-amaliyot. E'lonlar qaytadi", ru: 'Практика 1. Объявления возвращаются', en: 'Practice 1. The notices are back' }
};

// Страницы кружка (тексты на языке практики).
const P1 = {
  club: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
  home: L3("Bosh sahifa", 'Главная', 'Home'),
  news: L3("Yangiliklar", 'Новости', 'News'),
  plan: L3("Jadval", 'Расписание', 'Schedule'),
  cup: L3("Musobaqa", 'Соревнование', 'Contest'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'),
  open: L3("Robot to'garagi ochildi! Shanba kuni soat 10:00 da kutamiz.", 'Кружок роботов открылся! Ждём в субботу в 10:00.', 'The robot club is open! See you on Saturday at 10:00.'),
  newBot: L3("Yangi robot keldi: u raqsga tusha oladi!", 'У нас новый робот: он умеет танцевать!', 'A new robot has arrived: it can dance!'),
  noClass: L3("Diqqat! Dushanba kuni mashg'ulot bo'lmaydi.", 'Внимание! В понедельник занятия не будет.', 'Attention! There’s no class on Monday.'),
  sched: L3("Mashg'ulot har shanba soat 10:00 da.", 'Занятие каждую субботу в 10:00.', 'Class is every Saturday at 10:00.'),
  late: L3("Kechikmang!", 'Не опаздывай!', 'Don’t be late!'),
  ends: L3("Ro'yxatdan o'tish ertaga tugaydi!", 'Запись заканчивается завтра!', 'Sign-up ends tomorrow!'),
  prize: L3("G'olibga robot sovg'a qilinadi!", 'Победитель получит робота!', 'The winner gets a robot!'),
  myH1: L3("Mening robotim", 'Мой робот', 'My robot'),
  myText: L3("Mening robotim gapira oladi!", 'Мой робот умеет говорить!', 'My robot can talk!'),
  show: L3("Robotlar ko'rgazmasi yakshanba kuni.", 'Выставка роботов в воскресенье.', 'The robot show is on Sunday.')
};
// Пример Alert с сайта (Components → Alert, Default alert) — как в уроке 1.
const P1_SAMPLE = 'A simple alert—check it out!';
const P1_ALERT = '<div class="alert" role="alert">\n  <p>' + P1_SAMPLE + '</p>\n</div>';
const P1_THEMES = ['theme-primary', 'theme-success', 'theme-danger', 'theme-warning', 'theme-info'];
// Строка link, «поправленная» Коди руками: в слове bootstrap пропала буква t — такого файла нет (как в уроке 1, t4).
const P1_LINK_BAD = BP_LINK.replace('npm/bootstrap@', 'npm/boostrap@');
// Документ страницы: head со строкой link и body с заголовком — готовые строки над кодом ученика.
const p1Pre = (pk, h1) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(h1) + '</h1>'];
const P1_POST = ['</body>'];
const p1Alert = (cls, text, ind) => {
  const s = ind == null ? '  ' : ind;
  return s + '<div class="' + cls + '" role="alert">\n' + s + '  <p>' + text + '</p>\n' + s + '</div>';
};
const p1Doc = (pk, link, h1, body) => ['<head>', '  ' + link, '</head>', '<body>', '  <h1>' + pk(h1) + '</h1>'].concat(body, ['</body>']).join('\n');
const p1Text = (D) => D.text('.alert');
const p1Sample = (D) => /simple alert/i.test(p1Text(D));
// Сайт: примеры, которые ученик копирует.
const P1_DOCS_ALERT = { page: L3("Components · Alert", 'Components · Alert', 'Components · Alert'), items: [
  { k: 'alert', title: 'Default alert · HTML', code: P1_ALERT },
  { k: 'var', title: 'Variants', chips: P1_THEMES, copy: false }
] };
const P1_DOCS_FIX = { page: L3("Install · Alert", 'Install · Alert', 'Install · Alert'), items: [
  { k: 'css', title: 'CDN · CSS', code: BP_LINK },
  { k: 'var', title: 'Alert · Variants', chips: P1_THEMES, copy: false }
] };
const P1_DOCS_OWN = { page: L3("Install · Alert", 'Install · Alert', 'Install · Alert'), items: [
  { k: 'css', title: 'CDN · CSS', code: BP_LINK },
  { k: 'js', title: 'CDN · JS', code: BP_SCRIPT },
  { k: 'alert', title: 'Alert · HTML', code: P1_ALERT }
] };

const PR = {
  next: L3("Ranglar va tugmalar", 'Цвета и кнопки', 'Colors and buttons'),
  tabs: [
    { ico: 'star', c: '#FA4F28', name: P1.home, file: 'index.html' },
    { ico: 'mail', c: '#0FA38E', name: P1.news, file: 'yangiliklar.html' },
    { ico: 'book', c: '#7C5CFA', name: P1.plan, file: 'jadval.html' },
    { ico: 'rocket', c: '#F59E0B', name: P1.cup, file: 'musobaqa.html' },
    { ico: 'heart', c: '#E44D8A', name: P1.mine, file: 'my.html' }
  ],
  // Крючок: сайт в Bootstrap; после «Yangilash» строки link нет — страница голая.
  hook: {
    doc: (pk, on) => ['<head>'].concat(on ? ['  ' + BP_LINK] : [], ['</head>', '<body>', '  <h1>' + pk(P1.club) + '</h1>',
      p1Alert('alert theme-info', pk(P1.open)), '</body>']).join('\n')
  },
  ownDefault: (pk) => ['<head>', '  <title>' + pk(P1.mine) + '</title>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(P1.myH1) + '</h1>',
    p1Alert('alert theme-info', pk(P1.myText)), '  ' + BP_SCRIPT, '</body>'].join('\n'),
  tasks: [
    // Т1 · поменять слово цвета в готовом class: e'lon sariq (theme-info → theme-warning).
    (pk) => bpTask(1, {
      kind: 'change-word', pre: p1Pre(pk, P1.club), post: P1_POST,
      code0: p1Alert('alert theme-info', pk(P1.open)), answer: p1Alert('alert theme-warning', pk(P1.open)),
      goal: (D) => (!D.q('.alert') ? C.t1.noAlert : D.theme('.alert') === 'warning' ? null : C.t1.no),
      sample: p1Alert('alert theme-danger', pk(P1.show), '').split('\n'),
      drill: { code0: p1Alert('alert theme-warning', pk(P1.noClass)), answer: p1Alert('alert theme-danger', pk(P1.noClass)),
        goal: (D) => (D.theme('.alert') === 'danger' ? null : C.t1.drillNo) }
    }),
    // Т2 · вписать в пустой class два слова: e'lon и его цвет (alert theme-success).
    (pk) => bpTask(2, {
      kind: 'write-class', pre: p1Pre(pk, P1.news), post: P1_POST,
      code0: p1Alert('', pk(P1.newBot)), answer: p1Alert('alert theme-success', pk(P1.newBot)),
      goal: (D) => {
        const e = D.q('[role="alert"]');
        if (!D.has(e, 'alert')) return D.theme(e) ? C.t2.noAlert : C.t2.noTheme;
        if (!D.theme(e)) return C.t2.noTheme;
        return D.theme(e) === 'success' ? null : C.t2.other;
      },
      sample: p1Alert('alert theme-primary', pk(P1.show), '').split('\n'),
      drill: { code0: p1Alert('', pk(P1.noClass)), answer: p1Alert('alert theme-danger', pk(P1.noClass)),
        goal: (D) => { const e = D.q('[role="alert"]'); return D.has(e, 'alert') && D.theme(e) === 'danger' ? null : C.t2.drillNo; } }
    }),
    // Т3 · пример Alert с сайта: скопировать, вставить, настроить (цвет primary, свой текст со временем 10:00).
    (pk) => bpTask(3, {
      kind: 'copy-adapt', pre: p1Pre(pk, P1.plan), post: P1_POST, docs: () => P1_DOCS_ALERT,
      code0: '', answer: p1Alert('alert theme-primary', pk(P1.sched)),
      goal: (D) => {
        if (!D.q('.alert')) return D.q('[role="alert"]') ? C.t3.noAlertCls : C.t3.noAlert;
        if (p1Sample(D)) return C.t3.sample;
        if (p1Text(D).indexOf('10:00') < 0) return C.t3.noTime;
        if (!D.theme('.alert')) return C.t3.noTheme;
        return D.theme('.alert') === 'primary' ? null : C.t3.other;
      },
      sample: p1Alert('alert theme-info', pk(P1.show), '').split('\n'),
      drill: { code0: '', answer: p1Alert('alert theme-danger', pk(P1.late)),
        goal: (D) => (D.q('.alert') && !p1Sample(D) && p1Text(D).length > 2 && D.theme('.alert') === 'danger' ? null : C.t3.drillNo) }
    }),
    // Т4 · починить страницу: буква в адресе link (заново с сайта) и имя версии 5 alert-danger → theme-danger.
    (pk) => bpTask(4, {
      kind: 'fix', docs: () => P1_DOCS_FIX,
      code0: p1Doc(pk, P1_LINK_BAD, P1.cup, [p1Alert('alert alert-danger', pk(P1.ends))]),
      answer: p1Doc(pk, BP_LINK, P1.cup, [p1Alert('alert theme-danger', pk(P1.ends))]),
      goal: (D) => {
        if (!D.link.tag) return FB.noLink;
        if (!D.bs) return C.t4.noBs;
        return D.q('.alert') && D.theme('.alert') === 'danger' ? null : C.t4.no;
      },
      sample: ['<head>', '  ' + BP_LINK, '</head>', '<div class="alert theme-warning" role="alert">'],
      drill: { code0: p1Doc(pk, BP_LINK, P1.cup, [p1Alert('alert alert-success', pk(P1.prize))]),
        answer: p1Doc(pk, BP_LINK, P1.cup, [p1Alert('alert theme-success', pk(P1.prize))]),
        goal: (D) => (D.bs && D.theme('.alert') === 'success' ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: link в head, h1, e'lon с цветом и своим текстом, script в конце body — всё с сайта.
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, docs: () => P1_DOCS_OWN,
      code0: ['<head>', '  <title>' + pk(P1.mine) + '</title>', '  ', '</head>', '<body>', '  ', '</body>'].join('\n'),
      answer: PR.ownDefault(pk),
      list: [
        { t: L3("link — head ichida", 'link — в head', 'link — in head'), ok: (D) => D.bs && D.link.inHead },
        { t: L3("h1 — sarlavha", 'h1 — заголовок', 'h1 — heading'), ok: (D) => !!D.text('h1') },
        { t: L3("alert va theme-…", 'alert и theme-…', 'alert and theme-…'), ok: (D) => !!D.q('.alert') && !!D.theme('.alert') && !p1Sample(D) },
        { t: L3("script — body oxirida", 'script — в конце body', 'script — end of body'), ok: (D) => D.script.ok && D.script.atEnd }
      ],
      goal: (D) => {
        if (!D.link.tag) return FB.noLink;
        if (!D.link.inHead) return FB.linkBody;
        if (!D.text('h1')) return C.t5.needH1;
        if (!D.q('.alert')) return C.t5.needAlert;
        if (!D.theme('.alert')) return C.t5.needTheme;
        if (p1Sample(D)) return C.t5.sampleText;
        if (!D.script.tag) return FB.noScript;
        if (!D.script.atEnd) return FB.scriptPlace;
        return null;
      },
      sample: ['<head>', '  <title>…</title>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(P1.club) + '</h1>',
        p1Alert('alert theme-success', pk(P1.show)), '  ' + BP_SCRIPT, '</body>'].join('\n').split('\n'),
      onSolved: (st) => store.set('myDoc', st.code.trim())
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// Реплики сцеплены в одну историю: каждое задание начинается связкой с прошлым.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Robot to'garagi", 'Кружок роботов', 'Robot club'),
    say: L3("Salom! Bu robot to'garagining sayti. Qarang: rangli e'lonlar, yumaloq burchaklar, ichida bo'sh joy. Bularning hammasini Bootstrap qildi. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт кружка роботов. Смотри: цветные объявления, скруглённые углы, отступы внутри. Всё это сделал Bootstrap. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is the robot club website. Look: colorful notices, rounded corners, space inside. Bootstrap did all of that. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Yangilashda link qatori o'chib ketdi. Bootstrap ulanmay qoldi: e'lonlar oddiy matnga aylandi, varaqlar esa o'chdi.",
      'Ой! При обновлении стёрлась строка link. Bootstrap отключился: объявления превратились в обычный текст, а вкладки погасли.',
      'Oh no! The link line got erased during the update. Bootstrap is disconnected: the notices turned into plain text and the tabs went dark.'),
    done: L3("Kodga qarang: head ichida link qatori yo'q. Bootstrapsiz class so'zlari hech narsa qilmaydi. link qatorini men o'zim qaytaraman, e'lonlarni esa siz tiklaysiz. Beshta sahifani birma-bir tuzatamiz, oxirgisi esa sizning sahifangiz bo'ladi.",
      'Посмотри на код: в head нет строки link. Без Bootstrap слова в class ничего не делают. Строку link я верну сам, а объявления восстановишь ты. Починим пять страниц по одной, а последняя будет твоей.',
      'Look at the code: there’s no link line in head. Without Bootstrap the class words do nothing. I’ll bring the link line back myself, and you’ll restore the notices. We’ll fix five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifani tiklaymiz — kodni siz yozasiz", 'Восстановим пять страниц — код пишешь ты', 'Let’s restore five pages — you write the code')
  },
  t1: {
    eyebrow: L3("Bosh sahifa", 'Главная', 'Home'),
    say: L3("Birinchi sahifa: bosh sahifa. link qatorini qaytardim, Bootstrap yana ishlayapti. Lekin e'lon havorang bo'lib qolibdi, men esa uni sariq qilmoqchi edim: sariq rang ko'zga yaxshi tashlanadi. Rang so'zini almashtiring.",
      'Первая страница: главная. Строку link я вернул, Bootstrap снова работает. Но объявление голубое, а я хотел сделать его жёлтым: жёлтый сразу бросается в глаза. Замени слово цвета.',
      'The first page is the home page. I brought the link line back, and Bootstrap works again. But the notice is light blue, and I wanted it yellow: yellow catches the eye. Change the color word.'),
    ask: L3("E'lonni sariq qiling", 'Сделай объявление жёлтым', 'Make the notice yellow'),
    ok: L3("Zo'r! E'lon sariq bo'ldi, endi uni hamma ko'radi!", 'Здорово! Объявление стало жёлтым, теперь его все заметят!', 'Great! The notice is yellow, now everyone will see it!'),
    hints: [
      L3("class ichiga qarang: e'lonning rangini qaysi so'z beradi? U theme bilan boshlanadi.", 'Посмотри в class: какое слово задаёт цвет объявления? Оно начинается с theme.', 'Look inside class: which word sets the notice’s color? It starts with theme.'),
      L3("Sariq rang Bootstrapda warning, ya'ni ogohlantirish degani. theme-info o'rniga theme-warning yozing.", 'Жёлтый в Bootstrap — warning, то есть предупреждение. Вместо theme-info напиши theme-warning.', 'Yellow in Bootstrap is warning. Write theme-warning instead of theme-info.'),
      L3("Namuna kod ostida: u e'lonni qizil qiladi. Xuddi shunday rang so'zini almashtiring va Tekshirishni bosing.", 'Образец под кодом делает объявление красным. Так же замени слово цвета и нажми «Проверить».', 'The example under the code makes a notice red. Change the color word the same way and tap Check.')
    ],
    no: L3("Rang o'zgardi, lekin sariq emas. Sariq rang Bootstrapda warning so'zi bilan yoziladi.", 'Цвет поменялся, но это не жёлтый. Жёлтый в Bootstrap пишут словом warning.', 'The color changed, but it isn’t yellow. Yellow in Bootstrap is the word warning.'),
    noAlert: L3("E'lon yo'qolib qoldi: class ichida alert so'zi turishi kerak.", 'Объявление пропало: в class должно остаться слово alert.', 'The notice disappeared: class must keep the word alert.'),
    drill: L3("endi bu e'lonni qizil qiling", 'теперь сделай это объявление красным', 'now make this notice red'),
    drillNo: L3("E'lon hali qizil emas. Qizil rang Bootstrapda danger, ya'ni xavf degani.", 'Объявление пока не красное. Красный в Bootstrap — danger, то есть опасность.', 'The notice isn’t red yet. Red in Bootstrap is danger.')
  },
  t2: {
    eyebrow: L3("Yangiliklar", 'Новости', 'News'),
    say: L3("Ikkinchi sahifa: yangiliklar. Bu yerda e'lonning class qiymati bo'shab qolibdi, shuning uchun u oddiy matn. Yangilik quvonchli, demak e'lon yashil bo'lsin. class ichiga ikkita so'z kerak: biri e'lonning o'zi, ikkinchisi uning rangi.",
      'Вторая страница: новости. Здесь у объявления опустел class, поэтому это просто текст. Новость радостная — пусть объявление будет зелёным. В class нужны два слова: одно — само объявление, второе — его цвет.',
      'The second page is the news. Here the notice’s class is empty, so it’s just text. The news is happy, so let the notice be green. class needs two words: one is the notice itself, the other is its color.'),
    ask: L3("Yashil e'lon yasang", 'Сделай зелёное объявление', 'Make a green notice'),
    ok: L3("Ajoyib! Ramka, fon, yashil rang: ikki so'z bilan e'lon tayyor!", 'Отлично! Рамка, фон, зелёный цвет — два слова, и объявление готово!', 'Great! A border, a background, green color — two words and the notice is ready!'),
    hints: [
      L3("Darsdagi e'lon esingizdami? class ichida nechta so'z bor edi? Biri e'lonni yasaydi, ikkinchisi rangini beradi.", 'Вспомни объявление из урока: сколько слов было в class? Одно делает объявление, другое даёт цвет.', 'Remember the notice from the lesson: how many words were in class? One makes the notice, the other gives the color.'),
      L3("Birinchi so'z alert, u e'lonning o'zi. Ikkinchisi yashil rang so'zi: theme-success. Ularni bo'sh joy bilan yozing.", 'Первое слово — alert, это само объявление. Второе — зелёный цвет, то есть theme-success. Напиши их через пробел.', 'The first word is alert, the notice itself. The second is the green color, theme-success. Write them with a space between.'),
      L3("Namuna kod ostida: u ko'k e'lon yasaydi. Xuddi shunday yashil e'lon uchun ikki so'zni yozing va Tekshirishni bosing.", 'Образец под кодом делает синее объявление. Так же напиши два слова для зелёного и нажми «Проверить».', 'The example under the code makes a blue notice. Write the two words for a green one the same way and tap Check.')
    ],
    noAlert: L3("Rang bor, lekin e'lonning ramkasi va ichki bo'sh joyi yo'q. class ichiga alert so'zini ham qo'shing.", 'Цвет есть, но у объявления нет рамки и отступов. Добавь в class ещё слово alert.', 'There’s a color, but the notice has no border or inner space. Add the word alert to class too.'),
    noTheme: L3("E'lon chiqdi, lekin rangi oddiy. Yashil rang so'zini ham qo'shing: u theme bilan boshlanadi.", 'Объявление есть, но цвет обычный. Добавь слово зелёного цвета: оно начинается с theme.', 'The notice is there, but the color is plain. Add the green color word: it starts with theme.'),
    other: L3("E'lon chiqdi, lekin yashil emas. Yashil rang Bootstrapda success, ya'ni muvaffaqiyat degani.", 'Объявление есть, но не зелёное. Зелёный в Bootstrap — success, то есть успех.', 'The notice is there, but it isn’t green. Green in Bootstrap is success.'),
    drill: L3("endi qizil e'lon yasang", 'теперь сделай красное объявление', 'now make a red notice'),
    drillNo: L3("Qizil e'lon uchun ham ikki so'z kerak: alert va qizil rang so'zi theme-danger.", 'Красному объявлению тоже нужны два слова: alert и красный цвет, то есть theme-danger.', 'A red notice also needs two words: alert and the red color, theme-danger.')
  },
  t3: {
    eyebrow: L3("Jadval", 'Расписание', 'Schedule'),
    say: L3("Uchinchi sahifa: jadval. Bu yerda e'lon umuman yo'q. Uni boshidan yozmaymiz: Bootstrap saytida tayyor namuna bor. Nusxalash belgisini bosing, keyin Qo'yish tugmasini. So'ng namunani moslang: rangi ko'k bo'lsin, matnda esa mashg'ulot vaqti, soat o'n.",
      'Третья страница: расписание. Здесь объявления нет совсем. С нуля писать не будем: на сайте Bootstrap есть готовый пример. Нажми значок копирования, потом кнопку «Вставить». А потом настрой пример: цвет синий, а в тексте — время занятия, десять часов.',
      'The third page is the schedule. There’s no notice here at all. We won’t write it from scratch: the Bootstrap site has a ready example. Tap the copy icon, then the Paste button. Then adjust the example: make it blue, and put the class time, ten o’clock, in the text.'),
    ask: L3("Saytdan e'lon oling: ko'k, matnda — 10:00", 'Возьми объявление с сайта: синее, в тексте — 10:00', 'Take a notice from the site: blue, with 10:00 in the text'),
    ok: L3("Zo'r! Saytdagi namuna sizning e'loningizga aylandi. Bootstrap bilan aynan shunday ishlanadi!", 'Здорово! Пример с сайта стал твоим объявлением. С Bootstrap работают именно так!', 'Great! The site’s example became your notice. That’s exactly how you work with Bootstrap!'),
    hints: [
      L3("Ish ikki qadamda: oldin saytdagi namunani nusxalab, Qo'yish tugmasi bilan kodga qo'ying, keyin uni moslang: rangini va matnini.", 'Работа в два шага: сначала скопируй пример с сайта и вставь его кнопкой «Вставить», потом настрой его: цвет и текст.', 'It’s two steps: first copy the example from the site and paste it with the Paste button, then adjust it: the color and the text.'),
      L3("Endi namunani moslang. class ichiga rang so'zini qo'shing: ko'k rang theme-primary. Inglizcha matn o'rniga esa jadvalni yozing, soat o'n bilan.", 'Теперь настрой пример. Добавь в class слово цвета: синий — theme-primary. А вместо английского текста напиши расписание с десятью часами.', 'Now adjust the example. Add the color word to class: blue is theme-primary. And instead of the English text, write the schedule with ten o’clock.'),
      L3("Namuna kod ostida. Xuddi shunday e'lonni ko'k rangda, o'z matningiz bilan yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такое же объявление, синее и со своим текстом, и нажми «Проверить».', 'The example is under the code. Write the same kind of notice, blue and with your own text, and tap Check.')
    ],
    noAlert: L3("Sahifada e'lon hali yo'q. Saytdan namunani nusxalang va Qo'yish tugmasini bosing.", 'На странице пока нет объявления. Скопируй пример с сайта и нажми «Вставить».', 'There’s no notice on the page yet. Copy the example from the site and tap Paste.'),
    noAlertCls: L3("Teg bor, lekin class ichida alert so'zi yo'q. Saytdagi namunadagidek alert so'zini qoldiring.", 'Тег есть, но в class нет слова alert. Оставь слово alert, как в примере с сайта.', 'The tag is there, but class has no word alert. Keep the word alert, as in the site’s example.'),
    sample: L3("E'lon bor, lekin matni hali saytdagidek inglizcha. Uning o'rniga mashg'ulot jadvalini yozing.", 'Объявление есть, но текст ещё английский, как на сайте. Напиши вместо него расписание занятий.', 'The notice is there, but the text is still the site’s English one. Write the class schedule instead.'),
    noTime: L3("Matnda mashg'ulot vaqti yo'q. Soat o'nni raqamlar bilan yozing.", 'В тексте нет времени занятия. Напиши десять часов цифрами.', 'The text has no class time. Write ten o’clock in numbers.'),
    noTheme: L3("E'lon tayyor, lekin rangi oddiy. class ichiga ko'k rang so'zini qo'shing.", 'Объявление готово, но цвет обычный. Добавь в class слово синего цвета.', 'The notice is ready, but the color is plain. Add the blue color word to class.'),
    other: L3("E'lon ko'k emas. Ko'k rang Bootstrapda primary, ya'ni asosiy degani.", 'Объявление не синее. Синий в Bootstrap — primary, то есть главный.', 'The notice isn’t blue. Blue in Bootstrap is primary.'),
    drill: L3("endi qizil e'lon yasang: «Kechikmang!»", 'теперь сделай красное объявление: «Не опаздывай!»', 'now make a red notice: “Don’t be late!”'),
    drillNo: L3("Namunani yana nusxalang, rang so'zini theme-danger qiling va inglizcha matn o'rniga o'z matningizni yozing.", 'Скопируй пример ещё раз, слово цвета сделай theme-danger, а вместо английского текста напиши свой.', 'Copy the example again, make the color word theme-danger, and write your own text instead of the English one.')
  },
  t4: {
    eyebrow: L3("Musobaqa", 'Соревнование', 'Contest'),
    say: L3("To'rtinchi sahifa: musobaqa. Bu yerda link qatorini shoshib qo'lda yozibman, sahifa esa yana oddiy bo'lib qoldi. E'lon ham eski darslikdan olingan. Ikki narsani tuzating: Bootstrap ulansin va e'lon qizil bo'lsin.",
      'Четвёртая страница: соревнование. Здесь я в спешке набрал строку link руками, и страница снова стала обычной. А объявление взято из старого учебника. Почини две вещи: пусть Bootstrap подключится, а объявление станет красным.',
      'The fourth page is the contest. Here I typed the link line by hand in a hurry, and the page went plain again. And the notice comes from an old tutorial. Fix two things: get Bootstrap connected and make the notice red.'),
    ask: L3("Bootstrapni ulang va e'lonni qizil qiling", 'Подключи Bootstrap и сделай объявление красным', 'Connect Bootstrap and make the notice red'),
    ok: L3("Qoyil! Ikki tuzatish, va musobaqa sahifasi yana chiroyli!", 'Вот это да! Две правки — и страница соревнования снова красивая!', 'Wow! Two fixes, and the contest page looks great again!'),
    hints: [
      L3("Bu yerda ikkita buzuq joy bor: biri link qatorida, ikkinchisi e'lonning class qiymatida. Ularni birma-bir toping.", 'Здесь две поломки: одна в строке link, вторая — в class у объявления. Найди их по очереди.', 'There are two problems here: one in the link line, the other in the notice’s class. Find them one by one.'),
      L3("Manzildagi bootstrap so'zidan bitta harf tushib qolgan. Eng ishonchlisi: eski link qatorini o'chiring va saytdan yangisini qo'ying. alert-danger esa eski nom: o'rniga theme-danger yozing.", 'В адресе у слова bootstrap пропала буква. Надёжнее всего стереть старую строку link и вставить новую с сайта. А alert-danger — старое имя: напиши вместо него theme-danger.', 'The word bootstrap in the address lost a letter. The safest way is to delete the old link line and paste a new one from the site. And alert-danger is an old name: write theme-danger instead.'),
      L3("Namuna kod ostida. link qatorini saytdagidek, rang so'zini esa theme bilan yozing va Tekshirishni bosing.", 'Образец под кодом. Строку link возьми как на сайте, а слово цвета напиши с theme и нажми «Проверить».', 'The example is under the code. Use the link line as on the site, write the color word with theme, and tap Check.')
    ],
    noBs: L3("Bootstrap hali ulanmagan. link qatorini saytdan nusxalang va head ichiga qo'ying.", 'Bootstrap ещё не подключён. Скопируй строку link с сайта и вставь в head.', 'Bootstrap isn’t connected yet. Copy the link line from the site and paste it into head.'),
    no: L3("Bootstrap ulandi, lekin e'lon hali qizil emas. Qizil rang so'zi theme bilan boshlanadi: theme-danger.", 'Bootstrap подключён, но объявление ещё не красное. Слово красного цвета начинается с theme: theme-danger.', 'Bootstrap is connected, but the notice isn’t red yet. The red color word starts with theme: theme-danger.'),
    drill: L3("endi bu e'lonni tuzating: u yashil bo'lishi kerak", 'теперь почини это объявление: оно должно быть зелёным', 'now fix this notice: it should be green'),
    drillNo: L3("alert-success eski nom. Yashil rang uchun theme-success yozing.", 'alert-success — старое имя. Для зелёного напиши theme-success.', 'alert-success is an old name. For green, write theme-success.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki! Unda hozircha faqat sahifa nomi bor. Bootstrapni o'zingiz ulang, sarlavha va o'z e'loningizni qo'shing, oxirida script qatorini qo'ying. Kerakli kodning hammasi saytda bor: nusxalang, qo'ying va moslang.",
      'Пятая страница твоя! В ней пока только название. Подключи Bootstrap сам, добавь заголовок и своё объявление, а в конце поставь строку script. Весь нужный код есть на сайте: копируй, вставляй и настраивай.',
      'The fifth page is yours! So far it only has a title. Connect Bootstrap yourself, add a heading and your own notice, and put the script line at the end. All the code you need is on the site: copy, paste and adjust.'),
    ask: L3("O'z sahifangizni yasang", 'Собери свою страницу', 'Build your own page'),
    ok: L3("Vau, bu haqiqiy Bootstrap sahifa! Uni siz noldan yig'dingiz!", 'Вау, это настоящая страница на Bootstrap! И ты собрал её с нуля!', 'Wow, that’s a real Bootstrap page! And you built it from scratch!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart bor. Oldin saytdan link qatorini nusxalang, kodda head ichidagi bo'sh qatorni bosing va Qo'yish tugmasini bosing.", 'Посмотри на список: четыре условия. Сначала скопируй с сайта строку link, нажми пустую строку внутри head и нажми «Вставить».', 'Look at the list: four conditions. First copy the link line from the site, tap the empty line inside head and tap Paste.'),
      L3("body ichida oldin h1 sarlavhani yozing, keyin saytdan e'lonni olib, unga rang so'zini qo'shing. script qatorini esa eng oxiriga, yopuvchi body tegidan oldin qo'ying.", 'В body сначала напиши заголовок h1, потом возьми с сайта объявление и добавь ему слово цвета. А строку script поставь в самый конец, перед закрывающим тегом body.', 'In body, first write an h1 heading, then take a notice from the site and add a color word to it. Put the script line at the very end, before the closing body tag.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda o'z sahifangizni yozing va Tekshirishni bosing.", 'Образец под кодом. Собери свою страницу в таком же порядке и нажми «Проверить».', 'The example is under the code. Build your page in the same order and tap Check.')
    ],
    needH1: L3("Sahifada sarlavha yo'q. body ichiga h1 tegini o'z sarlavhangiz bilan yozing.", 'На странице нет заголовка. Напиши в body тег h1 со своим заголовком.', 'The page has no heading. Write an h1 tag with your heading in body.'),
    needAlert: L3("Sahifada e'lon yo'q. Saytdan e'lon namunasini nusxalab, body ichiga qo'ying.", 'На странице нет объявления. Скопируй пример объявления с сайта и вставь в body.', 'The page has no notice. Copy the notice example from the site and paste it into body.'),
    needTheme: L3("E'lonning rangi oddiy. class ichiga rang so'zini qo'shing, u theme bilan boshlanadi.", 'У объявления обычный цвет. Добавь в class слово цвета, оно начинается с theme.', 'The notice has a plain color. Add a color word to class; it starts with theme.'),
    sampleText: L3("E'lon matni hali saytdagidek inglizcha. O'z matningizni yozing.", 'Текст объявления ещё английский, как на сайте. Напиши свой.', 'The notice text is still the site’s English one. Write your own.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma sahifalar yana chiroyli! Qarang, bu sizning sahifangiz: Bootstrap bilan, o'zingiz yig'gansiz.", 'Все страницы снова красивые! Смотри, это твоя страница: на Bootstrap, собранная тобой.', 'All the pages look great again! Look, this is your page: built with Bootstrap, by you.') },
      { k: 'a', text: L3("Bootstrapni bitta link qatori ulaydi. U head ichida turadi, script qatori esa body oxirida.", 'Bootstrap подключает одна строка link. Она стоит в head, а строка script — в конце body.', 'One link line connects Bootstrap. It goes in head, and the script line at the end of body.') },
      { k: 'b', text: L3("E'lon bu alert so'zi, uning rangini esa theme bilan boshlanadigan so'z beradi.", 'Объявление — это слово alert, а цвет ему даёт слово, которое начинается с theme.', 'A notice is the word alert, and a word starting with theme gives it its color.') },
      { k: 'c', text: L3("Kodni boshidan yozmaymiz: saytdan namunani nusxalaymiz, keyin matni va rangini moslaymiz.", 'Код с нуля не пишем: копируем пример с сайта, а потом настраиваем текст и цвет.', 'We don’t write code from scratch: we copy an example from the site, then adjust the text and color.') },
      { k: 'd', text: L3("Sahifa oddiy bo'lib qolsa, link qatorini tekshiramiz. Rang chiqmasa, eski nom emasmi, deb qaraymiz.", 'Если страница стала обычной, проверяем строку link. Если цвет не появился — смотрим, не старое ли это имя.', 'If the page goes plain, we check the link line. If the color doesn’t show, we check whether it’s an old name.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda Bootstrapning ranglari va tugmalari bilan ishlaymiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке поработаем с цветами и кнопками Bootstrap. До встречи!', 'Congratulations! Next lesson we’ll work with Bootstrap colors and buttons. See you!') }
    ],
    roles: {
      a: L3("link — head, script — body oxiri", 'link — head, script — конец body', 'link — head, script — end of body'),
      b: L3("alert va theme-…", 'alert и theme-…', 'alert and theme-…'),
      c: L3("Saytdan nusxa → moslash", 'Копия с сайта → настройка', 'Copy from the site → adjust'),
      d: L3("Eski nomlar ishlamaydi", 'Старые имена не работают', 'Old names don’t work')
    },
    ask: L3("Sahifangizga qarang", 'Посмотри на свою страницу', 'Look at your page')
  }
};
