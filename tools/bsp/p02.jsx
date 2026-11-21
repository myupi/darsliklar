// =============================================================================
// ===== ПРАКТИКА 2 · «Ranglar qaytadi» · к уроку 2 «Цвета и кнопки» · модуль bootstrap-m1 =====
//
// ЗАМЫСЕЛ (21.11.2026). Сайт турнира Robo-futbol кружка роботов: цветной заголовок, фон у новости, кнопки. Коди обновил
// сайт кодом из старого учебника (имена версии 5: btn btn-success, text-primary) — кнопки стали серыми, цвет заголовка
// пропал, вкладки погасли. Ученик возвращает цвета: поменять слово стиля кнопки (btn-solid → btn-outline) → вписать в
// пустой class слово фона (bg-warning) → взять кнопку с сайта (Button, Variants) и настроить: цвет и свой текст →
// починить два старых имени (text-danger → fg-danger, btn btn-success → btn-solid theme-success) → своя страница:
// h1 с fg-*, абзац с bg-*, две кнопки — ichi to'la va chegarali. Главное — слова цвета и стиля берутся с сайта.
// 7 слайдов: крючок · пять заданий · вывод. Сценарий — docs/scenarij-bootstrap-02p-cveta-i-knopki.md.
// Узбекский — по /uzbekcha (апостроф ASCII, «Siz»); RU — «ты» без рода.
// =============================================================================
const META = {
  lessonId: 'bootstrap-02p-cveta-i-knopki',
  module: 'bootstrap-m1',
  lessonTitle: { uz: "2-amaliyot. Ranglar qaytadi", ru: 'Практика 2. Цвета возвращаются', en: 'Practice 2. The colors are back' }
};

const P2 = {
  cup: L3("Robo-futbol", 'Робофутбол', 'Robo-football'),
  reg: L3("Ro'yxat", 'Запись', 'Sign-up'),
  news: L3("Yangiliklar", 'Новости', 'News'),
  game: L3("O'yin", 'Матч', 'The match'),
  prize: L3("Sovrinlar", 'Призы', 'Prizes'),
  mine: L3("Mening sahifam", 'Моя страница', 'My page'),
  regH: L3("Ro'yxatdan o'tish", 'Запись на турнир', 'Tournament sign-up'),
  when: L3("Shanba kuni, soat 10:00", 'В субботу, в 10:00', 'Saturday, 10:00'),
  join: L3("Yozilaman", 'Записаться', 'Sign me up'),
  more: L3("Batafsil", 'Подробнее', 'More'),
  cancel: L3("Bekor qilish", 'Отменить', 'Cancel'),
  newBot: L3("Yangi robot keldi: u to'pni darvozaga kirita oladi!", 'Новый робот умеет забивать мяч в ворота!', 'The new robot can score goals!'),
  noClass: L3("Dushanba kuni mashg'ulot bo'lmaydi.", 'В понедельник занятия не будет.', 'There’s no class on Monday.'),
  play: L3("Qatnashaman", 'Участвую', 'I’m in'),
  winner: L3("G'olibga robot sovg'a qilinadi!", 'Победитель получит робота!', 'The winner gets a robot!'),
  rules: L3("Qoidalar har bir jamoa uchun bir xil.", 'Правила для всех команд одинаковые.', 'The rules are the same for every team.'),
  myH1: L3("Mening jamoam", 'Моя команда', 'My team'),
  myText: L3("Bizning robotimiz eng tez!", 'Наш робот самый быстрый!', 'Our robot is the fastest!'),
  show: L3("Ko'rish", 'Смотреть', 'Watch')
};
// Пример с сайта (Components → Button, Variants) — как в уроке 2.
const P2_BTN_SAMPLE = 'Primary';
const p2Btn = (cls, text, ind) => (ind == null ? '  ' : ind) + '<button type="button" class="' + cls + '">' + text + '</button>';
const P2_BTN_SITE = '<button type="button" class="btn-solid theme-primary">' + P2_BTN_SAMPLE + '</button>';
const P2_THEMES = ['theme-primary', 'theme-success', 'theme-danger', 'theme-warning', 'theme-info', 'theme-accent'];
const p2Pre = (pk, h1, more) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h1>' + pk(h1) + '</h1>'].concat(more || []);
const P2_POST = ['</body>'];
const p2Btns = (D) => D.qa('button');
const p2Sample = (e) => !!e && e.textContent.trim() === P2_BTN_SAMPLE;
// Сайт: примеры, которые ученик копирует, и слова разделов.
const P2_DOCS_BTN = { page: L3("Components · Button", 'Components · Button', 'Components · Button'), items: [
  { k: 'btn', title: 'Variants · HTML', code: P2_BTN_SITE },
  { k: 'shape', title: 'Button', chips: ['btn-solid', 'btn-outline'], copy: false },
  { k: 'var', title: 'Variants', chips: P2_THEMES, copy: false }
] };
const P2_DOCS_FIX = { page: L3("Utilities · Colors · Button", 'Utilities · Colors · Button', 'Utilities · Colors · Button'), items: [
  { k: 'fg', title: 'Colors', chips: ['fg-primary', 'fg-success', 'fg-danger', 'fg-warning', 'fg-info'], copy: false },
  { k: 'btn', title: 'Button', chips: ['btn-solid', 'btn-outline', 'theme-success', 'theme-danger'], copy: false }
] };
const P2_DOCS_OWN = { page: L3("Button · Colors · Background", 'Button · Colors · Background', 'Button · Colors · Background'), items: [
  { k: 'btn', title: 'Button · HTML', code: P2_BTN_SITE },
  { k: 'fg', title: 'Colors', chips: ['fg-primary', 'fg-success', 'fg-danger', 'fg-accent'], copy: false },
  { k: 'bg', title: 'Background', chips: ['bg-warning', 'bg-info', 'bg-success', 'bg-accent'], copy: false }
] };

const PR = {
  next: L3("Yuklanish va rasmlar", 'Загрузка и изображения', 'Loading and images'),
  tabs: [
    { ico: 'mail', c: '#FA4F28', name: P2.reg, file: 'royxat.html' },
    { ico: 'book', c: '#0FA38E', name: P2.news, file: 'yangiliklar.html' },
    { ico: 'ball', c: '#7C5CFA', name: P2.game, file: 'oyin.html' },
    { ico: 'cup', c: '#F59E0B', name: P2.prize, file: 'sovrinlar.html' },
    { ico: 'heart', c: '#E44D8A', name: P2.mine, file: 'my.html' }
  ],
  // Крючок: сайт в цветах Bootstrap 6; после «Yangilash» — имена из старого учебника (версия 5): цвета пропали.
  hook: {
    doc: (pk, on) => ['<head>', '  ' + BP_LINK, '</head>', '<body>',
      '  <h1 class="' + (on ? 'fg-primary' : 'text-primary') + '">' + pk(P2.cup) + '</h1>',
      '  <p class="bg-warning">' + pk(P2.when) + '</p>',
      p2Btn(on ? 'btn-solid theme-success' : 'btn btn-success', pk(P2.join)),
      p2Btn(on ? 'btn-outline theme-success' : 'btn btn-outline-success', pk(P2.more)), '</body>'].join('\n')
  },
  ownDefault: (pk) => ['<head>', '  ' + BP_LINK, '</head>', '<body>', '  <h1 class="fg-accent">' + pk(P2.myH1) + '</h1>',
    '  <p class="bg-info">' + pk(P2.myText) + '</p>', p2Btn('btn-solid theme-accent', pk(P2.join)), p2Btn('btn-outline theme-accent', pk(P2.more)), '</body>'].join('\n'),
  tasks: [
    // Т1 · слово стиля в готовом class: вторая кнопка — с рамкой (btn-solid → btn-outline).
    (pk) => bpTask(1, {
      kind: 'change-word', pre: p2Pre(pk, P2.regH, ['  <p>' + pk(P2.when) + '</p>']), post: P2_POST,
      code0: p2Btn('btn-solid theme-primary', pk(P2.join)) + '\n' + p2Btn('btn-solid theme-primary', pk(P2.more)),
      answer: p2Btn('btn-solid theme-primary', pk(P2.join)) + '\n' + p2Btn('btn-outline theme-primary', pk(P2.more)),
      goal: (D) => {
        const b = p2Btns(D)[1];
        if (D.has(b, 'btn-outline')) return D.theme(b) === 'primary' ? null : C.t1.color;
        return D.has(b, 'btn-solid') ? C.t1.no : C.t1.noStyle;
      },
      sample: [p2Btn('btn-outline theme-success', pk(P2.show), '')],
      drill: {
        code0: p2Btn('btn-solid theme-danger', pk(P2.join)) + '\n' + p2Btn('btn-solid theme-danger', pk(P2.cancel)),
        answer: p2Btn('btn-solid theme-danger', pk(P2.join)) + '\n' + p2Btn('btn-outline theme-danger', pk(P2.cancel)),
        goal: (D) => { const b = p2Btns(D)[1]; return D.has(b, 'btn-outline') && D.theme(b) === 'danger' ? null : C.t1.drillNo; }
      }
    }),
    // Т2 · слово фона в пустой class абзаца: фон новости sariq (bg-warning).
    (pk) => bpTask(2, {
      kind: 'write-class', pre: p2Pre(pk, P2.news), post: P2_POST,
      code0: '  <p class="">' + pk(P2.newBot) + '</p>', answer: '  <p class="bg-warning">' + pk(P2.newBot) + '</p>',
      goal: (D) => {
        if (D.bg('p') === 'warning') return null;
        if (D.fg('p')) return C.t2.fg;
        if (D.theme('p')) return C.t2.theme;
        return D.bg('p') ? C.t2.other : C.t2.no;
      },
      sample: ['<p class="bg-info">…</p>'],
      drill: { code0: '  <p class="">' + pk(P2.noClass) + '</p>', answer: '  <p class="bg-success">' + pk(P2.noClass) + '</p>',
        goal: (D) => (D.bg('p') === 'success' ? null : C.t2.drillNo) }
    }),
    // Т3 · кнопка с сайта (Button → Variants): скопировать, вставить, настроить цвет и свой текст.
    (pk) => bpTask(3, {
      kind: 'copy-adapt', pre: p2Pre(pk, P2.cup, ['  <p>' + pk(P2.when) + '</p>']), post: P2_POST, docs: () => P2_DOCS_BTN,
      code0: '', answer: p2Btn('btn-solid theme-success', pk(P2.play)),
      goal: (D) => {
        const b = p2Btns(D)[0];
        if (!b) return C.t3.noBtn;
        if (p2Sample(b)) return C.t3.sample;
        if (b.textContent.trim().length < 2) return C.t3.noText;
        if (!D.has(b, 'btn-solid')) return D.has(b, 'btn-outline') ? C.t3.outline : C.t3.noStyle;
        if (!D.theme(b)) return C.t3.noTheme;
        return D.theme(b) === 'success' ? null : C.t3.other;
      },
      sample: [p2Btn('btn-solid theme-info', pk(P2.show), '')],
      drill: { code0: '', answer: p2Btn('btn-outline theme-danger', pk(P2.cancel)),
        goal: (D) => { const b = p2Btns(D)[0]; return b && !p2Sample(b) && b.textContent.trim().length > 1 && D.has(b, 'btn-outline') && D.theme(b) === 'danger' ? null : C.t3.drillNo; } }
    }),
    // Т4 · два старых имени версии 5: text-danger → fg-danger, btn btn-success → btn-solid theme-success.
    (pk) => bpTask(4, {
      kind: 'fix', pre: ['<head>', '  ' + BP_LINK, '</head>', '<body>'], post: P2_POST, docs: () => P2_DOCS_FIX,
      code0: ['  <h1 class="text-danger">' + pk(P2.prize) + '</h1>', '  <p class="bg-warning">' + pk(P2.winner) + '</p>', p2Btn('btn btn-success', pk(P2.play))].join('\n'),
      answer: ['  <h1 class="fg-danger">' + pk(P2.prize) + '</h1>', '  <p class="bg-warning">' + pk(P2.winner) + '</p>', p2Btn('btn-solid theme-success', pk(P2.play))].join('\n'),
      goal: (D) => {
        if (D.fg('h1') !== 'danger') return C.t4.h1;
        const b = p2Btns(D)[0];
        return b && D.has(b, 'btn-solid') && D.theme(b) === 'success' ? null : C.t4.btn;
      },
      sample: ['<h1 class="fg-primary">…</h1>', '<button type="button" class="btn-solid theme-danger">…</button>'],
      drill: { code0: '  <p class="text-success">' + pk(P2.rules) + '</p>', answer: '  <p class="fg-success">' + pk(P2.rules) + '</p>',
        goal: (D) => (D.fg('p') === 'success' ? null : C.t4.drillNo) }
    }),
    // Т5 · своя страница: h1 с fg-*, абзац с bg-*, кнопка ichi to'la va chegarali (слова — с сайта).
    (pk, store) => bpTask(5, {
      kind: 'own-page', big: true, pre: ['<head>', '  ' + BP_LINK, '</head>', '<body>'], post: P2_POST, docs: () => P2_DOCS_OWN,
      code0: '', answer: ['  <h1 class="fg-accent">' + pk(P2.myH1) + '</h1>', '  <p class="bg-info">' + pk(P2.myText) + '</p>',
        p2Btn('btn-solid theme-accent', pk(P2.join)), p2Btn('btn-outline theme-accent', pk(P2.more))].join('\n'),
      list: [
        { t: L3("h1 — fg-… rang", 'h1 — цвет fg-…', 'h1 — fg-… color'), ok: (D) => !!D.text('h1') && !!D.fg('h1') },
        { t: L3("p — bg-… fon", 'p — фон bg-…', 'p — bg-… background'), ok: (D) => !!D.text('p') && !!D.bg('p') },
        { t: L3("btn-solid va theme-…", 'btn-solid и theme-…', 'btn-solid and theme-…'), ok: (D) => p2Btns(D).some((b) => D.has(b, 'btn-solid') && !!D.theme(b) && !p2Sample(b)) },
        { t: L3("btn-outline va theme-…", 'btn-outline и theme-…', 'btn-outline and theme-…'), ok: (D) => p2Btns(D).some((b) => D.has(b, 'btn-outline') && !!D.theme(b) && !p2Sample(b)) }
      ],
      goal: (D) => {
        if (!D.text('h1')) return C.t5.needH1;
        if (!D.fg('h1')) return C.t5.needFg;
        if (!D.text('p')) return C.t5.needP;
        if (!D.bg('p')) return C.t5.needBg;
        const bs = p2Btns(D);
        if (bs.some(p2Sample)) return C.t5.sampleText;
        if (!bs.some((b) => D.has(b, 'btn-solid') && D.theme(b))) return C.t5.needSolid;
        if (!bs.some((b) => D.has(b, 'btn-outline') && D.theme(b))) return C.t5.needOutline;
        return null;
      },
      sample: ['<h1 class="fg-success">…</h1>', '<p class="bg-warning">…</p>', '<button type="button" class="btn-solid theme-danger">…</button>',
        '<button type="button" class="btn-outline theme-danger">…</button>'],
      onSolved: (st) => store.set('myDoc', ['<head>', '  ' + BP_LINK, '</head>', '<body>', st.code.replace(/\s+$/, ''), '</body>'].join('\n'))
    })
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ТЕКСТЫ. Звучат: say, broke, done, ok, hints, фразы целей, drillNo, fin.say; печатаются: eyebrow, ask, roles, list.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  s1: {
    eyebrow: L3("Robo-futbol", 'Робофутбол', 'Robo-football'),
    say: L3("Salom! Bu robot to'garagining Robo-futbol turniri sayti. Qarang: ko'k sarlavha, sariq fon, yashil tugmalar. Bularning hammasi Bootstrapning rang so'zlari. Saytda beshta sahifa bor. Hozir saytni yangilayman, «Yangilash» tugmasini bosing.",
      'Привет! Это сайт турнира по робофутболу нашего кружка. Смотри: синий заголовок, жёлтый фон, зелёные кнопки. Всё это слова цвета Bootstrap. На сайте пять страниц. Сейчас я обновлю сайт, нажми «Обновить».',
      'Hi! This is our club’s robo-football tournament website. Look: a blue heading, a yellow background, green buttons. These are all Bootstrap color words. The site has five pages. I’m about to update it, tap “Refresh”.'),
    broke: L3("Voy! Men kodni eski darslikdan olgan ekanman. Tugmalar kulrang bo'lib qoldi, sarlavha rangi yo'qoldi, varaqlar o'chdi.",
      'Ой! Оказывается, я взял код из старого учебника. Кнопки стали серыми, цвет заголовка пропал, вкладки погасли.',
      'Oh no! Turns out I took the code from an old tutorial. The buttons turned gray, the heading lost its color, and the tabs went dark.'),
    done: L3("Kodga qarang: btn-success, text-primary. Bular Bootstrapning beshinchi versiyasidagi nomlar, oltinchisida ular ishlamaydi. Fon esa qoldi, chunki bg so'zlari o'zgarmagan. Beshta sahifaning ranglarini birma-bir qaytaramiz, oxirgisi sizniki bo'ladi.",
      'Посмотри на код: btn-success, text-primary. Это имена из пятой версии Bootstrap, в шестой они не работают. А фон остался, потому что слова bg не поменялись. Вернём цвета пяти страниц по одной, а последняя будет твоей.',
      'Look at the code: btn-success, text-primary. These are Bootstrap 5 names; they don’t work in version 6. The background stayed, because the bg words didn’t change. Let’s bring the colors back to five pages one by one, and the last one will be yours.'),
    ask: L3("«Yangilash» tugmasini bosing", 'Нажми «Обновить»', 'Tap “Refresh”'),
    askDone: L3("Beshta sahifaning ranglarini qaytaramiz", 'Вернём цвета пяти страниц', 'Let’s bring back the colors of five pages')
  },
  t1: {
    eyebrow: L3("Ro'yxat", 'Запись', 'Sign-up'),
    say: L3("Birinchi sahifa: ro'yxat. Tugmalarni o'zim tuzatdim, lekin ikkalasi bir xil chiqdi, qaysi biri asosiy, bilib bo'lmaydi. Batafsil tugmasi ikkinchi darajali, unda faqat chegara qolsin. Tugmaning uslub so'zini almashtiring.",
      'Первая страница: запись. Кнопки я починил сам, но они вышли одинаковые — непонятно, какая главная. «Подробнее» — второстепенная кнопка, пусть у неё останется только рамка. Замени слово стиля у этой кнопки.',
      'The first page is the sign-up. I fixed the buttons myself, but they came out identical, so you can’t tell which one matters most. More is a secondary button: let it keep only a border. Change that button’s style word.'),
    ask: L3("Batafsil tugmasida faqat chegara qolsin", 'Пусть у «Подробнее» будет только рамка', 'Let More have only a border'),
    ok: L3("Zo'r! Endi asosiy tugma darrov ko'zga tashlanadi, ikkinchisi esa yonida jimgina turibdi.", 'Здорово! Теперь главная кнопка сразу бросается в глаза, а вторая скромно стоит рядом.', 'Great! Now the main button catches the eye, and the second one sits quietly next to it.'),
    hints: [
      L3("Tugmaning class qiymatida ikki so'z bor: uslub va rang. Rang qolsin, faqat uslubni almashtiramiz.", 'В class кнопки два слова: стиль и цвет. Цвет оставим, меняем только стиль.', 'The button’s class has two words: style and color. Keep the color, change only the style.'),
      L3("Ichi to'la uslub btn-solid, faqat chegarali uslub esa btn-outline. Ikkinchi tugmadagi btn-solid o'rniga btn-outline yozing.", 'Залитый стиль — btn-solid, только рамка — btn-outline. У второй кнопки вместо btn-solid напиши btn-outline.', 'The filled style is btn-solid, border only is btn-outline. On the second button, write btn-outline instead of btn-solid.'),
      L3("Namuna kod ostida: u chegarali yashil tugma. Xuddi shunday uslub so'zini almashtiring va Tekshirishni bosing.", 'Образец под кодом — зелёная кнопка с рамкой. Так же замени слово стиля и нажми «Проверить».', 'The example under the code is a green outlined button. Change the style word the same way and tap Check.')
    ],
    no: L3("Tugmaning ichi hali ham to'la. Faqat chegara qolishi uchun btn-outline so'zi kerak.", 'Кнопка всё ещё залитая. Чтобы осталась только рамка, нужно слово btn-outline.', 'The button is still filled. For a border only, you need the word btn-outline.'),
    noStyle: L3("Tugmaning uslub so'zi yo'qoldi. class ichida uslub va rang turishi kerak.", 'У кнопки пропало слово стиля. В class должны стоять стиль и цвет.', 'The button lost its style word. class needs a style and a color.'),
    color: L3("Chegara chiqdi, lekin rang o'zgarib qoldi. Rang so'zi avvalgidek theme-primary bo'lsin.", 'Рамка появилась, но цвет поменялся. Слово цвета пусть останется theme-primary.', 'The border is there, but the color changed. Keep the color word theme-primary.'),
    drill: L3("endi Bekor qilish tugmasida ham faqat chegara qolsin", 'теперь пусть и у «Отменить» будет только рамка', 'now let Cancel have only a border too'),
    drillNo: L3("Bekor qilish tugmasi hali ichi to'la. Uslub so'zini btn-outline qiling, rang esa qizil qolsin.", '«Отменить» пока залитая. Сделай слово стиля btn-outline, а цвет оставь красным.', 'Cancel is still filled. Make the style word btn-outline and keep the color red.')
  },
  t2: {
    eyebrow: L3("Yangiliklar", 'Новости', 'News'),
    say: L3("Ikkinchi sahifa: yangiliklar. Yangilik oddiy matn bo'lib qolibdi, uni hech kim payqamaydi. Uning foni sariq bo'lsin. Darsdagi qoida esingizdami? Fon so'zlari bg bilan boshlanadi, ya'ni background degani.",
      'Вторая страница: новости. Новость стала обычным текстом — её никто не заметит. Пусть у неё будет жёлтый фон. Вспомни урок: слова фона начинаются с bg, то есть background.',
      'The second page is the news. The news turned into plain text, so nobody will notice it. Let it have a yellow background. Remember the lesson: background words start with bg, short for background.'),
    ask: L3("Yangilik foni sariq bo'lsin", 'Сделай фон новости жёлтым', 'Make the news background yellow'),
    ok: L3("Ajoyib! Sariq fonda yangilik endi uzoqdan ko'rinadi!", 'Отлично! На жёлтом фоне новость видно издалека!', 'Great! On a yellow background the news shows from afar!'),
    hints: [
      L3("Abzasning class qiymati bo'sh. Bu yerga bitta so'z kerak: fon rangi.", 'У абзаца пустой class. Сюда нужно одно слово — цвет фона.', 'The paragraph’s class is empty. It needs one word here: the background color.'),
      L3("Fon so'zi bg bilan boshlanadi, sariq rang esa warning. Ularni chiziqcha bilan qo'shing: bg-warning.", 'Слово фона начинается с bg, а жёлтый — это warning. Соедини их чёрточкой: bg-warning.', 'Background words start with bg, and yellow is warning. Join them with a dash: bg-warning.'),
      L3("Namuna kod ostida: u fonni havorang qiladi. Xuddi shunday sariq fon so'zini yozing va Tekshirishni bosing.", 'Образец под кодом делает фон голубым. Так же напиши слово жёлтого фона и нажми «Проверить».', 'The example under the code makes the background light blue. Write the yellow background word the same way and tap Check.')
    ],
    no: L3("Fon hali sariq emas. Abzasga bg-warning so'zi kerak.", 'Фон пока не жёлтый. Абзацу нужно слово bg-warning.', 'The background isn’t yellow yet. The paragraph needs the word bg-warning.'),
    fg: L3("fg so'zi harflarni bo'yaydi, fonni emas. Fon uchun bg bilan boshlanadigan so'z kerak.", 'Слово fg красит буквы, а не фон. Для фона нужно слово, которое начинается с bg.', 'An fg word colors the letters, not the background. The background needs a word starting with bg.'),
    theme: L3("theme so'zlari tugma va e'lon uchun. Abzas foni bg bilan boshlanadigan so'z bilan bo'yaladi.", 'Слова theme — для кнопок и объявлений. Фон абзаца красит слово, которое начинается с bg.', 'theme words are for buttons and alerts. A paragraph background uses a word starting with bg.'),
    other: L3("Fon chiqdi, lekin sariq emas. Sariq rang Bootstrapda warning.", 'Фон появился, но не жёлтый. Жёлтый в Bootstrap — warning.', 'There’s a background, but it isn’t yellow. Yellow in Bootstrap is warning.'),
    drill: L3("endi bu e'lonning foni yashil bo'lsin", 'теперь пусть у этого объявления будет зелёный фон', 'now give this notice a green background'),
    drillNo: L3("Fon hali yashil emas. Yashil rang success, demak bg-success.", 'Фон пока не зелёный. Зелёный — success, значит bg-success.', 'The background isn’t green yet. Green is success, so bg-success.')
  },
  t3: {
    eyebrow: L3("O'yin", 'Матч', 'The match'),
    say: L3("Uchinchi sahifa: o'yin. Bu yerda tugma umuman yo'q. Bootstrap saytining Button sahifasida tayyor tugma bor: nusxalash belgisini bosing, keyin Qo'yish tugmasini. So'ng tugmani moslang: rangi yashil bo'lsin, yozuvi esa Qatnashaman.",
      'Третья страница: матч. Здесь кнопки нет совсем. На сайте Bootstrap, на странице Button, есть готовая кнопка: нажми значок копирования, потом «Вставить». А потом настрой её: цвет зелёный, надпись — «Участвую».',
      'The third page is the match. There’s no button here at all. The Bootstrap site has a ready button on the Button page: tap the copy icon, then Paste. Then adjust it: make it green and label it “I’m in”.'),
    ask: L3("Saytdan tugma oling: yashil, «Qatnashaman»", 'Возьми кнопку с сайта: зелёная, «Участвую»', 'Take a button from the site: green, “I’m in”'),
    ok: L3("Qoyil! Saytdagi tugma sizning tugmangizga aylandi: rangi ham, yozuvi ham sizniki!", 'Вот это да! Кнопка с сайта стала твоей: и цвет, и надпись твои!', 'Wow! The site’s button became yours: both the color and the label!'),
    hints: [
      L3("Ish ikki qadamda: oldin saytdagi tugmani nusxalab, Qo'yish tugmasi bilan kodga qo'ying, keyin uni moslang: rangini va yozuvini.", 'Работа в два шага: сначала скопируй кнопку с сайта и вставь её кнопкой «Вставить», потом настрой: цвет и надпись.', 'It’s two steps: first copy the button from the site and paste it with the Paste button, then adjust it: the color and the label.'),
      L3("Yashil rang so'zi theme-success: uni theme-primary o'rniga yozing. Primary yozuvi o'rniga esa Qatnashaman deb yozing.", 'Слово зелёного цвета — theme-success: напиши его вместо theme-primary. А вместо надписи Primary напиши «Участвую».', 'The green color word is theme-success: write it instead of theme-primary. And instead of the label Primary, write “I’m in”.'),
      L3("Namuna kod ostida. Xuddi shunday tugmani yashil rangda, o'z yozuvingiz bilan yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши такую же кнопку, зелёную и со своей надписью, и нажми «Проверить».', 'The example is under the code. Write the same kind of button, green and with your own label, and tap Check.')
    ],
    noBtn: L3("Sahifada tugma hali yo'q. Saytdan tugmani nusxalang va Qo'yish tugmasini bosing.", 'На странице пока нет кнопки. Скопируй кнопку с сайта и нажми «Вставить».', 'There’s no button on the page yet. Copy the button from the site and tap Paste.'),
    sample: L3("Tugma bor, lekin yozuvi hali saytdagidek Primary. O'rniga Qatnashaman deb yozing.", 'Кнопка есть, но надпись ещё Primary, как на сайте. Напиши вместо неё «Участвую».', 'The button is there, but the label is still Primary, as on the site. Write “I’m in” instead.'),
    noText: L3("Tugmada yozuv yo'q. Teglar o'rtasiga Qatnashaman deb yozing.", 'На кнопке нет надписи. Напиши «Участвую» между тегами.', 'The button has no label. Write “I’m in” between the tags.'),
    outline: L3("Tugmada faqat chegara bor. Bu tugmaning ichi to'la bo'lishi kerak: btn-solid.", 'У кнопки только рамка. Эта кнопка должна быть залитой: btn-solid.', 'The button only has a border. This one should be filled: btn-solid.'),
    noStyle: L3("Tugmaning uslub so'zi yo'q. class ichida oldin uslub turadi: btn-solid.", 'У кнопки нет слова стиля. В class сначала идёт стиль: btn-solid.', 'The button has no style word. class starts with the style: btn-solid.'),
    noTheme: L3("Tugmaning rangi yo'q. class ichiga yashil rang so'zini qo'shing.", 'У кнопки нет цвета. Добавь в class слово зелёного цвета.', 'The button has no color. Add the green color word to class.'),
    other: L3("Tugma yashil emas. Yashil rang Bootstrapda success.", 'Кнопка не зелёная. Зелёный в Bootstrap — success.', 'The button isn’t green. Green in Bootstrap is success.'),
    drill: L3("endi qizil chegarali tugma yasang: «Bekor qilish»", 'теперь сделай красную кнопку с рамкой: «Отменить»', 'now make a red outlined button: “Cancel”'),
    drillNo: L3("Tugmani yana nusxalang. Uslubi btn-outline, rangi theme-danger bo'lsin, yozuvi esa o'zingizniki.", 'Скопируй кнопку ещё раз. Стиль — btn-outline, цвет — theme-danger, а надпись своя.', 'Copy the button again. Style btn-outline, color theme-danger, and your own label.')
  },
  t4: {
    eyebrow: L3("Sovrinlar", 'Призы', 'Prizes'),
    say: L3("To'rtinchi sahifa: sovrinlar. Bu yerda eski darslikdan ikki nom qolibdi. Sarlavha qizil, tugma esa yashil bo'lishi kerak edi, lekin ranglar chiqmayapti. Ikkalasini oltinchi versiya so'zlari bilan almashtiring.",
      'Четвёртая страница: призы. Здесь остались два имени из старого учебника. Заголовок должен быть красным, а кнопка зелёной, но цветов нет. Замени оба на слова шестой версии.',
      'The fourth page is the prizes. Two names from the old tutorial are left here. The heading should be red and the button green, but the colors don’t show. Replace both with version six words.'),
    ask: L3("Sarlavha qizil, tugma yashil bo'lsin", 'Сделай заголовок красным, а кнопку зелёной', 'Make the heading red and the button green'),
    ok: L3("Zo'r ish! Ikki eski nom ketdi, ranglar qaytdi!", 'Отличная работа! Два старых имени ушли, цвета вернулись!', 'Nice work! Two old names gone, the colors are back!'),
    hints: [
      L3("Bu yerda ikkita eski nom bor: biri sarlavhada, ikkinchisi tugmada. Ularni birma-bir toping.", 'Здесь два старых имени: одно у заголовка, второе у кнопки. Найди их по очереди.', 'There are two old names here: one on the heading, the other on the button. Find them one by one.'),
      L3("Matn rangi oltinchi versiyada fg bilan boshlanadi: text-danger o'rniga fg-danger. Tugma esa ikki so'z: btn-solid va theme-success.", 'Цвет текста в шестой версии начинается с fg: вместо text-danger — fg-danger. А кнопка — это два слова: btn-solid и theme-success.', 'In version six, text color starts with fg: fg-danger instead of text-danger. And a button is two words: btn-solid and theme-success.'),
      L3("Namuna kod ostida. Xuddi shunday sarlavha va tugma uchun yangi so'zlarni yozing va Tekshirishni bosing.", 'Образец под кодом. Так же напиши новые слова для заголовка и кнопки и нажми «Проверить».', 'The example is under the code. Write the new words for the heading and the button the same way and tap Check.')
    ],
    h1: L3("Sarlavha hali qizil emas. Matn rangi fg bilan boshlanadi: fg-danger.", 'Заголовок ещё не красный. Цвет текста начинается с fg: fg-danger.', 'The heading isn’t red yet. Text color starts with fg: fg-danger.'),
    btn: L3("Tugma hali yashil emas. Tugmaga ikki so'z kerak: uslub btn-solid va rang theme-success.", 'Кнопка ещё не зелёная. Кнопке нужны два слова: стиль btn-solid и цвет theme-success.', 'The button isn’t green yet. It needs two words: the style btn-solid and the color theme-success.'),
    drill: L3("endi bu abzasdagi eski nomni ham tuzating: matn yashil bo'lsin", 'теперь почини старое имя и у этого абзаца: текст должен быть зелёным', 'now fix the old name in this paragraph too: the text should be green'),
    drillNo: L3("text-success eski nom. Yashil matn uchun fg-success yozing.", 'text-success — старое имя. Для зелёного текста напиши fg-success.', 'text-success is an old name. For green text, write fg-success.')
  },
  t5: {
    eyebrow: L3("Mening sahifam", 'Моя страница', 'My page'),
    say: L3("Beshinchi sahifa sizniki! Jamoangiz sahifasini yasang: rangli sarlavha, foni bo'yalgan abzas va ikkita tugma, biri ichi to'la, ikkinchisi faqat chegarali. Ranglarni o'zingiz tanlang, so'zlarni esa saytdan oling.",
      'Пятая страница твоя! Сделай страницу своей команды: цветной заголовок, абзац с цветным фоном и две кнопки, одна залитая, другая только с рамкой. Цвета выбери сам, а слова возьми с сайта.',
      'The fifth page is yours! Make your team’s page: a colored heading, a paragraph with a colored background and two buttons, one filled and one with just a border. Pick the colors yourself and take the words from the site.'),
    ask: L3("Jamoangiz sahifasini yasang", 'Собери страницу своей команды', 'Build your team’s page'),
    ok: L3("Vau, qanday rang-barang sahifa! Bu haqiqiy jamoa sayti!", 'Вау, какая яркая страница! Это настоящий сайт команды!', 'Wow, what a colorful page! That’s a real team website!'),
    hints: [
      L3("Ro'yxatga qarang: to'rtta shart bor. Oldin h1 sarlavhani yozing va unga fg bilan boshlanadigan rang so'zini bering.", 'Посмотри на список: четыре условия. Сначала напиши заголовок h1 и дай ему слово цвета, которое начинается с fg.', 'Look at the list: four conditions. First write an h1 heading and give it a color word starting with fg.'),
      L3("Keyin p abzasini bg so'zi bilan yozing. Tugmani saytdan nusxalab qo'ying, uni ikki marta qo'ying: biriga btn-solid, ikkinchisiga btn-outline.", 'Потом напиши абзац p со словом bg. Кнопку скопируй с сайта и вставь два раза: одной btn-solid, другой btn-outline.', 'Then write a p paragraph with a bg word. Copy the button from the site and paste it twice: one with btn-solid, the other with btn-outline.'),
      L3("Namuna kod ostida. Xuddi shunday tartibda, o'z ranglaringiz va matningiz bilan yozing va Tekshirishni bosing.", 'Образец под кодом. Напиши в таком же порядке, со своими цветами и текстом, и нажми «Проверить».', 'The example is under the code. Write it in the same order, with your own colors and text, and tap Check.')
    ],
    needH1: L3("Sahifada sarlavha yo'q. h1 tegini o'z jamoangiz nomi bilan yozing.", 'На странице нет заголовка. Напиши тег h1 с названием своей команды.', 'The page has no heading. Write an h1 tag with your team’s name.'),
    needFg: L3("Sarlavhaning rangi yo'q. class ichiga fg bilan boshlanadigan rang so'zini yozing.", 'У заголовка нет цвета. Напиши в class слово цвета, которое начинается с fg.', 'The heading has no color. Write a color word starting with fg in its class.'),
    needP: L3("Sahifada abzas yo'q. p tegini o'z matningiz bilan yozing.", 'На странице нет абзаца. Напиши тег p со своим текстом.', 'The page has no paragraph. Write a p tag with your own text.'),
    needBg: L3("Abzasning foni yo'q. class ichiga bg bilan boshlanadigan so'zni yozing.", 'У абзаца нет фона. Напиши в class слово, которое начинается с bg.', 'The paragraph has no background. Write a word starting with bg in its class.'),
    sampleText: L3("Tugma yozuvi hali saytdagidek Primary. O'z yozuvingizni yozing.", 'Надпись на кнопке ещё Primary, как на сайте. Напиши свою.', 'The button label is still Primary, as on the site. Write your own.'),
    needSolid: L3("Ichi to'la tugma yo'q. Bitta tugmaga btn-solid va rang so'zini bering.", 'Нет залитой кнопки. Дай одной кнопке btn-solid и слово цвета.', 'There’s no filled button. Give one button btn-solid and a color word.'),
    needOutline: L3("Faqat chegarali tugma yo'q. Ikkinchi tugmaga btn-outline va rang so'zini bering.", 'Нет кнопки с рамкой. Дай второй кнопке btn-outline и слово цвета.', 'There’s no outlined button. Give the second button btn-outline and a color word.')
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: null, text: L3("Hamma sahifalarning ranglari qaytdi! Qarang, bu sizning jamoangiz sahifasi.", 'Все страницы снова в цвете! Смотри, это страница твоей команды.', 'All the pages have their colors back! Look, this is your team’s page.') },
      { k: 'a', text: L3("Tugma bu ikki so'z: oldin uslub, keyin rang.", 'Кнопка — это два слова: сначала стиль, потом цвет.', 'A button is two words: first the style, then the color.') },
      { k: 'b', text: L3("Rang so'zi hamma joyda bitta: success hamisha yashil, danger hamisha qizil.", 'Слово цвета везде одно: success всегда зелёный, danger всегда красный.', 'A color word is the same everywhere: success is always green, danger is always red.') },
      { k: 'c', text: L3("fg harflarni bo'yaydi, bg esa fonni.", 'fg красит буквы, а bg — фон.', 'fg colors the letters, and bg colors the background.') },
      { k: 'd', text: L3("So'zlarni saytdan olamiz. Eski darslikdagi nomlar oltinchi versiyada ishlamaydi.", 'Слова берём с сайта. Имена из старых учебников в шестой версии не работают.', 'We take the words from the site. Names from old tutorials don’t work in version six.') },
      { k: null, text: L3("Tabriklayman! Keyingi darsda yuklanish belgilari va rasmlar bilan ishlaymiz. Ko'rishguncha!", 'Поздравляю! На следующем уроке поработаем со знаками загрузки и картинками. До встречи!', 'Congratulations! Next lesson we’ll work with loading signs and pictures. See you!') }
    ],
    roles: {
      a: L3("Tugma: uslub va rang", 'Кнопка: стиль и цвет', 'Button: style and color'),
      b: L3("Rang so'zi hamma joyda bitta", 'Слово цвета — одно везде', 'One color word everywhere'),
      c: L3("fg — matn, bg — fon", 'fg — текст, bg — фон', 'fg — text, bg — background'),
      d: L3("So'zlar — saytdan", 'Слова — с сайта', 'Words come from the site')
    },
    ask: L3("Sahifangizga qarang", 'Посмотри на свою страницу', 'Look at your page')
  }
};
