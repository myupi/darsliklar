// Практика 7 «Лагерь Коди», ЧАСТЬ 2: button и своя анкета (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 (сохранение стирает кнопку «Yuborish»), лесенка «строка → блок → найти и исправить → своё»:
//   t1 — прежнее (бывшее t2): строка button с надписью;
//   t2 — НОВОЕ: textarea и под ним button (смесь частей 1 и 2; без закрывающего textarea кнопка уезжает в поле);
//   t3 — НОВОЕ как основное: найти строку, которая «проглотила» кнопку (незакрытый textarea); бывшая дополнительная
//        задача t4 («Savollar») стала дополнительной задачей этого задания;
//   t4 — прежнее «своё» (бывшее t5): h1, form, select, textarea, button.
// Вывод — прежний Fin с четырьмя вкладками и новой речью. Четыре вкладки: Yozilish, Sayohat, Takliflar, Mening anketam
// (правки TABS[4] → TABS[3], класс листа по cfg.css — в pconf/07.mjs).

// ── Карта части 2: четыре страницы. ──
Object.assign(A7_ICO, {
  trip: <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  idea: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></>
});
Object.assign(PG, {
  taklif: L3("Takliflar", 'Предложения', 'Ideas')
});
Object.assign(PH, {
  taklif: L3("Taklifingizni yozing", 'Напиши своё предложение', 'Write your idea'),
  taom: L3("Taomingiz haqida yozing", 'Напиши о блюде', 'Write about the dish')
});
const OLD = { t2: C.t2, t4: C.t4, t5: C.t5 };   // прежние тексты: кнопка, найти и исправить, своя анкета
TABS.splice(0, TABS.length,
  { id: 'yozilish', file: 'yozilish.html', ico: 'pen', c: '#7C5CFA', name: PG.yozilish },
  { id: 'sayohat', file: 'sayohat.html', ico: 'trip', c: '#0FA38E', name: PG.sayohat },
  { id: 'taklif', file: 'takliflar.html', ico: 'idea', c: '#F59E0B', name: PG.taklif },
  { id: 'mine', file: 'anketa.html', ico: 'star', c: '#E44D26', name: L3("Mening anketam", 'Моя анкета', 'My form') }
);
Object.assign(SPOKEN, { foundX: 1, whyX: 1 });

// ── Фразы проверки нового задания t2. Слово ученика сюда не попадает. ──
Object.assign(FB, {
  taPh: L3("Maydondagi placeholder yozuvi «{want}» bo'lsin, uni o'zgartirmang.",
    'Подсказка placeholder в поле должна быть такой, как в задании: «{want}».',
    'The placeholder in the field should be as in the task: “{want}”.'),
  btnLast: L3("Tugma anketaning oxirida turadi: oldin katta maydon, uning ostida esa tugma.",
    'Кнопка стоит в конце анкеты: сначала большое поле, а под ним кнопка.',
    'The button goes at the end of the form: first the big field, then the button under it.')
});

// ── Тексты. Звучат: say, broke, done, ok, hints, found, why; печатаются: eyebrow, ask, roles. ──
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! Oldingi amaliyotda ro'yxatlar bilan katta maydonni tuzatdik. Lager saytida yana to'rtta sahifa bor: yozilish, sayohat, takliflar va sizning anketangiz. Mana, yozilish sahifasi: ism yoziladigan maydon ham, yuboradigan tugma ham joyida. «Saqlash»ni bosamiz, nima bo'larkin?",
      'Привет! В прошлой практике мы починили списки и большое поле. На сайте лагеря ещё четыре страницы: запись, экскурсия, предложения и твоя анкета. Вот страница записи: и поле для имени, и кнопка отправки на месте. Нажми «Сохранить» и посмотрим, что будет.',
      'Hi! In the last practice we fixed the lists and the big field. The camp site has four more pages: sign-up, trip, ideas and your own form. Here’s the sign-up page: both the name field and the send button are in place. Tap “Save” and let’s see what happens.'),
    broke: L3("Voy, qarang! Saqlash paytida tugma yo'qolib qoldi. Ism yoziladigan maydon turibdi, uni yuboradigan tugma esa yo'q.",
      'Ой! При сохранении пропала кнопка. Поле для имени есть, а кнопки, чтобы его отправить, нет!',
      'Oh no! The button vanished while saving. The name field is there, but there’s no button to send it!'),
    done: L3("Tugmasiz anketani hech kim yubora olmaydi! Uchta sahifani tuzatamiz, to'rtinchisiga esa o'z anketangizni yozasiz. Qaysi qatorda nima yo'qolganini birga topamiz, kodni esa o'zingiz yozasiz.",
      'Без кнопки анкету никто не отправит! Починим три страницы, а на четвёртой ты напишешь свою анкету. Что и где пропало, найдём вместе, а код пишешь ты.',
      'Without a button nobody can send the form! We’ll fix three pages, and on the fourth you’ll write your own form. We’ll find what went missing together, and you write the code.'),
    ask: L3("«Saqlash» tugmasini bosing", 'Нажми «Сохранить»', 'Tap “Save”'),
    askDone: L3("Tugma yo'qoldi, uni birga qaytaramiz", 'Кнопка пропала, вернём её вместе', 'The button vanished, let’s bring it back')
  },
  // Т1 — бывшее t2 (кнопка): та же лесенка, новое вступление.
  t1: Object.assign({}, OLD.t2, {
    say: L3("Yozilish sahifasidan boshlaymiz. Bu anketada ism yoziladigan maydon bor, lekin uni yuboradigan tugma o'chib ketibdi. Tugmasiz bola ismini yozadi-yu, yubora olmaydi-da! Bo'sh qatorga tugmani yozing. Tugmaning yozuvi bor, u ikkita teg o'rtasida turadi, shuning uchun button tegini yopish ham kerak.",
      'Начнём с записи. В анкете есть поле для имени, а кнопка, чтобы её отправить, стёрлась. Напиши в пустой строке кнопку: открывающий button, надпись и закрывающий button. Помнишь, input не закрывается, а button закрывается.',
      'Let’s start with sign-up. The form has a name field, but the button that sends it got erased. Write the button in the empty row: the opening button, the text and the closing button. Remember, input doesn’t close, but button does.')
  }),
  t2: {
    eyebrow: L3("Sayohat", 'Экскурсия', 'Trip'),
    say: L3("Yozilish tayyor! Endi sayohat sahifasi. Bolalar sayohatdan keyin shu yerga fikr yozadi, ammo sahifada na katta maydon bor, na yuboradigan tugma. Ikkalasini ham o'zingiz yozing: oldin katta maydon, ostiga esa tugma. Maydonning yopuvchi tegini unutmang, aks holda tugma maydon ichiga tushib ketadi.",
      'Запись готова! Теперь экскурсия. После поездки ребята пишут сюда отзыв, а на странице нет ни большого поля, ни кнопки отправки. Напиши обе вещи сам: сначала большое поле, а под ним кнопку. Про закрывающий тег поля не забудь, иначе кнопка упадёт внутрь поля.',
      'Sign-up is done! Now the trip page. After the trip, kids write a review here, but the page has neither a big field nor a send button. Write both yourself: first the big field, then the button under it. Don’t forget the closing tag of the field, or the button will fall inside it.'),
    ask: L3("textarea, placeholder «Fikringizni yozing», va ostida button, yozuvi «Yuborish»", 'textarea с placeholder «Напиши отзыв» и под ним button с надписью «Отправить»', 'textarea with placeholder “Write a review” and, under it, button with the text “Send”'),
    ok: L3("Ikkalasi ham joyida: katta maydon fikrni qabul qiladi, tugma esa uni yuboradi. Maydon yopilgani uchun tugma o'z joyida turibdi!",
      'Вот это да! Поле принимает отзыв, а кнопка его отправляет. Поле закрыто, поэтому кнопка встала на своё место!',
      'Wow! The field takes the review and the button sends it. The field is closed, so the button is in its place!'),
    hints: [
      L3("Ikkita qator yozasiz: birinchisida katta maydon, ikkinchisida tugma. Ularni qaysi teglar yasashi esingizdami?", 'Нужны две строки: в первой большое поле, во второй кнопка. Вспомни, какими тегами их пишут.', 'You need two lines: the big field in the first, the button in the second. Remember which tags make them.'),
      L3("textarea ham, button ham yopuvchi teg bilan yoziladi. Maydonning placeholder atributi ochuvchi tegning ichida turadi, tugmaning yozuvi esa ikkita teg o'rtasida.", 'И textarea, и button пишут с закрывающим тегом. placeholder у поля стоит внутри открывающего тега, а надпись кнопки между тегами.', 'Both textarea and button are written with a closing tag. The field’s placeholder sits inside the opening tag, and the button text sits between the tags.'),
      L3("Mana ikkita qator: katta maydon va tugma. Siz ham shunday yozing, faqat so'zlar topshiriqdagidek bo'lsin.", 'Вот две строки: поле и кнопка. Напиши так же, только со словами из задания.', 'Here are two lines: a field and a button. Write yours the same way, with the words from the task.')
    ],
    drill: L3("Ovqat sahifasida ham maydon bilan tugma kerak: placeholder «Taomingiz haqida yozing», tugma yozuvi «Saqlash»", 'На странице еды тоже нужны поле и кнопка: placeholder «Напиши о блюде», надпись кнопки «Сохранить»', 'The food page needs a field and a button too: placeholder “Write about the dish”, button text “Save”')
  },
  // Т3 — найти строку, которая проглотила кнопку (незакрытый textarea). Тексты found/why — прежние foundX / whyX.
  t3: {
    eyebrow: L3("Takliflar", 'Предложения', 'Ideas'),
    say: L3("Sayohat tayyor! Takliflar sahifasida esa g'alati narsa: maydon turibdi-yu, yuboradigan tugma ko'rinmayapti. Kodda esa tugma bor! Demak, qatorlardan biri tugmani yutib yuborgan. Qani, o'sha qatorni topib, ustiga bosing.",
      'Экскурсия готова! А на странице предложений странность: поле есть, а кнопки отправки не видно. А в коде кнопка есть! Значит, одна из строк её проглотила. Найди эту строку и нажми на неё.',
      'The trip is done! But something is odd on the ideas page: the field is there, but the send button isn’t visible. Yet the button is in the code! So one of the lines swallowed it. Find that line and tap it.'),
    ask: L3("Tugmani yutgan qatorni bosing", 'Нажми строку, которая проглотила кнопку', 'Tap the line that swallowed the button'),
    ask2: OLD.t4.ask2,
    foundX: OLD.t4.foundX,
    whyX: OLD.t4.whyX,
    ok: L3("Tugma qaytdi! Maydon yopilgach, uning ostidagi kod yana tugma bo'lib chiqdi. Nima yutib yuborganini topish haqiqiy dasturchining ishi!",
      'Кнопка вернулась! Поле закрыли, и код под ним снова стал кнопкой. Найти, что проглотило строку, это работа настоящего программиста!',
      'The button is back! The field got closed, and the code under it became a button again. Finding what swallowed it is a real developer’s job!'),
    hints: [
      L3("Sahifaga qarang: tugma qayoqqa ketdi? Maydon ichida nima yozilgani ko'rinyaptimi?", 'Посмотри на страницу: куда делась кнопка? Что написано внутри поля?', 'Look at the page: where did the button go? What’s written inside the field?'),
      L3("Maydon ichida tugmaning kodi turibdi. Demak, maydon yopilmay qolgan. Qaysi qator ochilgan-u, yopilmagan?", 'Код кнопки оказался внутри поля. Значит, поле не закрыто. Какая строка открыта, но не закрыта?', 'The button’s code ended up inside the field. So the field isn’t closed. Which line is opened but not closed?'),
      L3("Mana yopilgan maydon: ochuvchi teg, yopuvchi teg va ularning o'rtasi bo'sh. Siz ham maydon qatorini shunday tugating.", 'Вот закрытое поле: открывающий тег, закрывающий тег, а между ними пусто. Закончи строку поля так же.', 'Here’s a closed field: an opening tag, a closing tag and nothing between them. End the field line the same way.')
    ],
    drill: OLD.t4.drill
  },
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Qarang, lager sayti tayyor: yozilish, sayohat, takliflar va sizning anketangiz. Hamma tugmalar joyida, maydonlar yopilgan!",
        'Смотри, сайт лагеря готов: запись, экскурсия, предложения и твоя анкета. Все кнопки на месте, поля закрыты!',
        'Look, the camp site is ready: sign-up, trip, ideas and your own form. All the buttons are in place, the fields are closed!') },
      { k: 'select', text: L3("Ro'yxatni select yasadi, uning har bir varianti esa o'z option tegida turdi. Strelkani bossangiz, variantlar ochiladi.",
        'Список делал select, а каждый вариант стоял в своём option. Нажал на стрелку, и варианты раскрылись.',
        'The list was made by select, and each choice sat in its own option. Tap the arrow, and the choices open.') },
      { k: 'option', text: L3("Esingizdami, option tegisiz so'z ro'yxatga hech qachon tushmaydi. Shuning uchun har bir variantni o'z option tegiga yozdingiz.",
        'Помнишь, слово без option в список не попадает. Поэтому каждый вариант ты записывал в свой option.',
        'Remember, a word without option never gets into the list. That’s why you wrote each choice in its own option.') },
      { k: 'textarea', text: L3("textarea esa katta maydon yasadi. Uni yopmasangiz, pastdagi tugmani ham o'z ichiga yutib yuboradi.",
        'А textarea ставил большое поле. Если его не закрыть, он проглотит и кнопку под собой.',
        'And textarea put a big field. If you don’t close it, it swallows the button under it too.') },
      { k: 'button', text: L3("Tugmasiz anketa yuborilmaydi: button uni yuboradi, yozuvi esa ikkita teg o'rtasida turadi.",
        'Без кнопки анкету не отправить: button её отправляет, а надпись стоит между тегами.',
        'A form can’t be sent without a button: button sends it, with its text between the tags.') },
      { k: 'own', text: L3("Sizning to'garagingiz anketasi lager saytining eng yorqin sahifasi bo'ldi! Sayt kattalashib ketdi, endi uni qanday qismlarga bo'lish kerak? Shuni oldin o'zingiz taxmin qilib ko'ring.",
        'А в конце твоя собственная анкета. Это было мощно! Сайт разросся, и теперь его нужно разделить на части. Как? Это мы узнаем на следующем уроке.',
        'And at the end you made your own form. That was awesome! The site has grown, and now it needs to be split into parts. How? We’ll find out in the next lesson.') }
    ],
    roles: C.fin.roles,
    ask: C.fin.ask
  }
});
// Т4 — своё (бывшее t5): тексты те же, номер страницы и первая фраза — четвёртые.
C.t4 = Object.assign({}, OLD.t5, {
  say: L3("Uchta sahifa ishlayapti! To'rtinchisi sizniki. Bolalar sizning to'garagingizga qanday yozilsin: ro'yxatdan tanlabmi, o'zi haqida yozibmi, tugmani bosibmi? Mana shu anketani noldan o'zingiz yozasiz. Tepada h1 sarlavha bo'lsin, undan keyin form: ichida variantli ro'yxat, katta maydon va yuboradigan tugma.",
    'Три страницы горят! Теперь четвёртая: твоя анкета. Здесь есть только body. Сделай анкету для своего кружка. В самом верху заголовок в теге h1. Потом внутри form список с пунктами, большое поле и кнопка отправки.',
    'Three pages are lit! Now the fourth: your form. There’s only body here. Make a form for your own club. At the very top, a heading in the h1 tag. Then inside form, a list with items, a big field and a send button.')
});

// ─────────────────────────────────────────────────────────────────────────────
// Т2 (новое) · textarea и button: два поля подряд. Верно: сначала textarea с закрывающим тегом и placeholder из
// задания, потом button с надписью из задания; больше ничего. Без </textarea> кнопка уезжает в поле (честный браузер).
// ─────────────────────────────────────────────────────────────────────────────
function a7TaBtnCheck(code, ph, want) {
  const r = a7Form(code, { inForm: true });
  if (r.msg) return { ok: false, msg: r.msg };
  const N = r.nodes;
  if (!N.length) return { ok: false, msg: FB.empty };
  const ta = N.find((n) => n.kind === 'textarea');
  const bt = N.find((n) => n.kind === 'button');
  const other = N.find((n) => n.kind !== 'textarea' && n.kind !== 'button');
  if (other) return { ok: false, msg: other.kind === 'input' ? (ta ? FB.btnInput : FB.needTa) : a7Fb('extra', { got: '<' + (other.tag || other.kind) + '>' }) };
  if (!ta) return { ok: false, msg: FB.needTa };
  if (!bt) return { ok: false, msg: FB.needBtn };
  if (N.indexOf(bt) < N.indexOf(ta)) return { ok: false, msg: FB.btnLast };
  if (a7Norm(ta.attrs.placeholder) !== a7Norm(ph)) return { ok: false, msg: fillL(FB.taPh, { want: ph }) };
  if (a7Norm(bt.text) !== a7Norm(want)) return { ok: false, msg: fillL(FB.btnOther, { want }) };
  if (N.length > 2) return { ok: false, msg: a7Fb('extra', { got: '<' + (N[2].tag || N[2].kind) + '>' }) };
  return { ok: true };
}
const A7_W2 = { pg: 'sayohat', ph: 'fikr', btn: 'send' };
const A7_W2X = { pg: 'ovqat', ph: 'taom', btn: 'save' };
function a7TaBtnView(d) {
  return (st, x) => {
    const pg = x.pick(PG[d.pg]);
    const before = ['<body>', '  <h1>' + pg + '</h1>', '  <form>'];
    const after = ['  </form>', '</body>'];
    return {
      title: pg, url: d.pg + '.html', blocks: a7Page(before.concat([st.code], after).join('\n')).blocks, pageHl: true,
      aid: <A7Parts parts={[{ code: '<textarea placeholder="…"></textarea>' }, { code: '<button>…</button>' }]} />,
      editor: <A7Editor before={before} after={after} value={st.code} inputRef={x.inRef} led={x.led} onChange={(c) => x.set({ code: c })} />
    };
  };
}
const cfgW2 = (pick) => ({
  id: 't2', num: 2, kind: 'write-block', C: C.t2, css: 't3',
  init: () => ({ code: '    ' }),
  check: (st) => a7TaBtnCheck(st.code, pick(PH[A7_W2.ph]), pick(BTN[A7_W2.btn])),
  view: a7TaBtnView(A7_W2),
  sample: (pk) => ['<textarea placeholder="' + pk(PH.about) + '"></textarea>', '<button>OK</button>'],
  drill: { init: () => ({ code: '    ' }), check: (st) => a7TaBtnCheck(st.code, pick(PH[A7_W2X.ph]), pick(BTN[A7_W2X.btn])), view: a7TaBtnView(A7_W2X) }
});

// Т3 · найти и исправить: на странице «Takliflar» textarea не закрыт — код кнопки стал текстом в поле. Строки те же,
// что в прежней дополнительной задаче (a7FixView, вид 'ta'); дополнительная задача — «Savollar» (A7_T4X).
const A7_W3 = {
  pg: 'taklif', bad: 3, why: 'whyX', found: 'foundX', kind: 'ta',
  lines: (pk) => a7Body(['<h1>' + pk(PG.taklif) + '</h1>', '<form>', '  <textarea' + a7At('placeholder', pk(PH.taklif)) + '>', '  ' + a7Btn(pk(BTN.send)), '</form>'])
};
const a7TaFix = (st, ph) => (st.at == null ? { ok: false, msg: C.t3.ask } : a7TaLine(st.code, ph));
const cfgW3 = (pick) => ({
  id: 't3', num: 3, kind: 'find-fix', C: C.t3, css: 't4',
  init: () => ({ at: null, code: '' }),
  check: (st) => a7TaFix(st, pick(PH.taklif)),
  view: a7FixView(A7_W3, C.t3),
  sample: (pk) => ['<textarea placeholder="' + pk(PH.fikr) + '"></textarea>'],
  drill: { init: () => ({ at: null, code: '' }), check: (st) => a7TaFix(st, pick(PH.savol)), view: a7FixView(A7_T4X, C.t3) }
});
// Т1 — прежняя кнопка; Т4 — прежнее «своё» (cfgT5): номер 4, лист по стилям задания 5, страница — четвёртая.
const cfgW1 = (pick) => Object.assign(cfgT2(pick), { id: 't1', num: 1, C: C.t1, css: 't2' });
const cfgW4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, css: 't5', C: C.t4 });

const W1 = ({ p }) => <A7Task p={p} make={cfgW1} />;
const W2 = ({ p }) => <A7Task p={p} make={cfgW2} />;
const W3 = ({ p }) => <A7Task p={p} make={cfgW3} />;
const W4 = ({ p }) => <A7Task p={p} make={cfgW4} />;

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: страница «Yozilish» (поле для имени и кнопка) → «Saqlash» → сбой: строка кнопки стёрлась —
// кнопка пропала со страницы, вкладки гаснут. Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const [rec, put] = useRec('h2');
  const broke = !!(rec && rec.done);
  const [boom, setBoom] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: broke ? c.done : c.say, pose: broke ? 'point' : 'wonder' }]);
  const canGo = useAdvanceGate(broke, spoken);
  const led = useIdleLed(!broke, 0);
  const all = useA7Tabs(true);
  const tabs = broke ? all.map((t) => Object.assign({}, t, { st: 'off' })) : all;
  const tap = () => {
    if (broke) return;
    sfx('off', true);
    setBoom(true);
    setTimeout(() => setBoom(false), 700);
    put({ done: true });
    sayNow(c.broke, 'think');
    say(c.done, 'point');
  };
  const pg = pick(PG.yozilish);
  const lines = ['<h1>' + pg + '</h1>', '<form>', '  ' + a7Label(pick(CAP.name), a7Input('text', pick(PH.name))), broke ? '' : '  ' + a7Btn(pick(BTN.send)), '</form>'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a7-sheet a7-s1">
        <KzAsk text={broke ? c.askDone : c.ask} />
        <div className="a7-work">
          <div className="a7-side">
            <A7Browser tabs={tabs} cur={0} title={pg} cls={boom ? 'a7-glitch' : ''} url="yozilish.html">
              <A7Doc blocks={a7Page(lines.join('\n')).blocks} />
            </A7Browser>
          </div>
          <div className="a7-main">
            <A7Code lines={lines} cls={boom ? 'a7-glitch' : ''} mark={broke ? 3 : null} />
            {!broke ? (
              <div className="kz-row a7-row">
                <button type="button" className="kz-btn is-coral a7-publish" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h11l3 3v15H5z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></svg>
                  {pick(UI.save)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
