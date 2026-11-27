// Практика 1 «Кодина вкладки», ЧАСТЬ 2: body и порядок документа (tools/qism/build-prac.mjs, 27.11.2026).
// Новый хук H2 («Добавить текст»: название на вкладке, текст в окне), прежнее т3 (блок body — теперь т1), новое
// задание т2 (название и текст перепутаны местами — вернуть каждое на место: вкладка или окно), прежнее т4 (незакрытый
// title — теперь т3: «вкладка съела страницу», экран S14 урока) и прежнее «своё» (т5 — теперь т4: head, title и body
// в правильном порядке). Вывод — прежний Fin с четырьмя вкладками (правки в build-prac): Ob-havo, Hayvonlar, Kino и
// своя страница.

Object.assign(A1_ICO, {
  cat: <><path d="M5 9l1-5 4 3h4l4-3 1 5" /><path d="M5 9c-1 4 1 9 7 9s8-5 7-9" /><circle cx="9.5" cy="12" r=".7" /><circle cx="14.5" cy="12" r=".7" /></>
});
// Карта части 2 — четыре вкладки: погода и кино — прежние, животные — новая, четвёртая — своя страница ученика.
TABS.splice(0, TABS.length, TABS[2],
  { id: 'animals', ico: 'cat', c: '#16A34A', name: L3("Hayvonlar", 'Животные', 'Animals'), text: L3("Mushuk uxlayapti", 'Кот спит', 'The cat is sleeping') },
  TABS[3], TABS[4]
);
// Содержимое образцов (другое, чем в заданиях).
const XTRA2 = {
  booksText: L3("Eng sevimli kitoblarim", 'Мои любимые книги', 'My favourite books')
};

Object.assign(UI, {
  addText: L3("Matn qo'shish", 'Добавить текст', 'Add text'),
  onTab: L3("varaqda", 'на вкладке', 'on the tab'),
  inWin: L3("oynada", 'в окне', 'in the window')
});

// ── Фразы проверки нового задания. {got} — слово ученика, только в метках; {want} — правильный текст из задания. ──
Object.assign(FB, {
  swapNoName: L3("title ichi bo'sh qolibdi: u yerga sahifaning nomi kerak.", 'Внутри title пусто: там нужно название страницы.', 'There’s nothing inside title: it needs the page name.'),
  swapNoText: L3("body ichi bo'sh qolibdi: u yerga oynadagi matn kerak.", 'Внутри body пусто: там нужен текст для окна.', 'There’s nothing inside body: it needs the window text.'),
  swapStill: L3("Hali hammasi joyida emas: nom bilan matn almashib turibdi. Nom title ichida, matn esa body ichida bo'ladi.",
    'Пока всё на старых местах: название и текст поменялись. Название стоит в title, а текст окна — в body.',
    'Everything’s still where it was: the name and the text are mixed up. The name goes in title, the window text goes in body.'),
  wrongText: L3("Oynada boshqa matn chiqib qoldi: ⁣«{got}»⁤. Bizga esa «{want}» kerak.", 'В окне вышел другой текст: ⁣«{got}»⁤. А нужно «{want}».', 'The window shows a different text: ⁣“{got}”⁤. We need “{want}”.')
});

// ── Тексты. Прежние тексты заданий 3, 4 и 5 переезжают (со своей первой фразой); т2 и хук — новые. ──
const OLD = { t3: C.t3, t4: C.t4, t5: C.t5, fin: C.fin };
Object.assign(C, {
  h2: {
    eyebrow: L3("Davom etamiz", 'Продолжаем', 'Let’s continue'),
    say: L3("Salom! O'tgan amaliyotda to'rtta varaqni tuzatdik va sahifaning nomi title tegida turishini ko'rdik. Mana yana bitta sahifa: nomi varaqda turibdi, lekin oynasi bo'm-bo'sh. Sizningcha, oynaga matnni qayerga yozish kerak? «Matn qo'shish»ni bosing, birga ko'ramiz.",
      'Привет! В прошлой практике мы починили четыре вкладки и увидели: название страницы живёт в title. Вот ещё одна страница: название на вкладке есть, а окно совсем пустое. Как думаешь, куда писать текст для окна? Нажми «Добавить текст», посмотрим вместе.',
      'Hi! In the last practice we fixed four tabs and saw that the page name lives in title. Here’s one more page: the name is on the tab, but the window is completely empty. Where do you think the window text goes? Tap “Add text” and let’s see together.'),
    broke: L3("Mana! Matn body tegining ichiga tushdi va shu zahoti oynada chiqdi. Varaqdagi nom esa joyida qoldi: u title tegida turibdi.",
      'Вот! Текст лёг внутрь body и сразу появился в окне. А название на вкладке осталось на месте: оно в title.',
      'There! The text went inside body and showed up in the window at once. And the name on the tab stayed where it was: it’s in title.'),
    done: L3("Demak, varaqqa title, oynaga esa body to'g'ri keladi. Shu qoidani to'rtta sahifada sinab ko'ramiz: ob-havo, hayvonlar, kino, oxirgisida esa o'z sahifangizni yozasiz. Ketdik!",
      'Выходит: для вкладки — title, для окна — body. Проверим это правило на четырёх страницах: погода, животные, кино, а на последней ты напишешь свою. Погнали!',
      'So: title is for the tab, body is for the window. We’ll try this rule on four pages: weather, animals, movies, and on the last one you’ll write your own. Let’s go!'),
    ask: L3("«Matn qo'shish»ni bosing", 'Нажми «Добавить текст»', 'Tap “Add text”'),
    askDone: L3("Nom varaqda, matn oynada", 'Название на вкладке, текст в окне', 'The name is on the tab, the text is in the window')
  },
  // Т1 · Ob-havo: блок body (прежнее т3).
  t1: Object.assign({}, OLD.t3, {
    say: L3("Ob-havo sahifasidan boshlaymiz! Ertalab soyabon olaymi-yo'qmi, shundan bilaman. Nomi joyida, oynasi esa bo'm-bo'sh: body qismi butunlay yo'qolibdi. Oynada ko'rinadigan hamma narsa body ichida turishini eslaysizmi? Demak, uni qaytarish kerak. head yopilgan joydan keyin body qismini yozing, ichiga esa ob-havo haqida bitta gap qo'shing, masalan, «Bugun quyoshli».",
      'Начнём с погоды! Название на месте, но окно пустое: часть body пропала целиком. Помнишь, всё, что видно в окне, стоит внутри body? После того места, где закрылся head, напиши часть body, а внутри — пару слов о погоде.',
      'Let’s start with the weather! The name is there, but the window is empty: the body part is gone. Remember, everything you see in the window sits inside body? After the place where head closes, write the body part, with a few words about the weather inside.')
  }),
  // Т2 · Hayvonlar: название и текст перепутаны (новое).
  t2: {
    eyebrow: L3("Hayvonlar", 'Животные', 'Animals'),
    say: L3("Ob-havo tayyor! Endi hayvonlar sahifasi. Voy, bu yerda nimadir chalkashib ketibdi: varaqda «Mushuk uxlayapti» deb yozilgan, oynada esa faqat «Hayvonlar» turibdi. Esingizdami, nom qaysi tegda yashaydi, oynadagi matn-chi? Ikkala so'zni o'z joyiga qo'ying.",
      'Погода готова! Теперь страница про животных. Ой, тут всё перепутано: на вкладке написано «Кот спит», а в окне стоит только «Животные». Помнишь, в каком теге живёт название, а в каком текст окна? Поставь оба слова на свои места.',
      'The weather is done! Now the animals page. Oops, everything’s mixed up here: the tab says “The cat is sleeping”, and the window only says “Animals”. Remember which tag holds the name and which holds the window text? Put both words in their places.'),
    ask: L3("Varaqda «Hayvonlar», oynada «Mushuk uxlayapti» bo'lsin", 'Пусть на вкладке будет «Животные», а в окне «Кот спит»', 'Make the tab say “Animals” and the window say “The cat is sleeping”'),
    ok: L3("Mana, tuzaldi! Nom varaqqa, matn oynaga qaytdi. Mushuk endi tinch uxlayapti!",
      'Вот и порядок! Название вернулось на вкладку, текст — в окно. Кот спокойно спит!',
      'That’s better! The name is back on the tab and the text is back in the window. The cat sleeps in peace!'),
    hints: [
      L3("Varaqqa va oynaga bir qarang-chi: so'zlar joylarini almashtirib olibdi. Sahifaning nomi qaysi tegda yashaydi, oynadagi matn-chi?", 'Посмотри на вкладку и окно: слова поменялись местами. В каком теге живёт название страницы, а в каком — текст окна?', 'Look at the tab and the window: the words swapped places. Which tag holds the page name, and which holds the window text?'),
      L3("Nom title ichida turadi va varaqda chiqadi. Matn body ichida turadi va oynada chiqadi. Ikkala maydondagi so'zlarni almashtiring.", 'Название стоит в title и показывается на вкладке. Текст стоит в body и показывается в окне. Поменяй слова в обоих полях.', 'The name sits in title and shows on the tab. The text sits in body and shows in the window. Swap the words in both fields.'),
      L3("Mana boshqa sahifa to'g'ri yozilgan: nom title ichida, matn body ichida. Siz ham so'zlarni shunday joylashtiring.", 'Вот другая страница, где всё на месте: название в title, текст в body. Расставь слова так же.', 'Here’s another page with everything in place: the name in title, the text in body. Place your words the same way.')
    ],
    drill: L3("Endi xuddi shunday chalkashlik: sport sahifasi", 'Теперь такая же путаница на другой странице', 'Now the same mix-up on another page')
  },
  // Т3 · Kino: незакрытый title (прежнее т4).
  t3: Object.assign({}, OLD.t4, {
    say: L3("Ikkita varaq tayyor! Uchinchisi: kino. Bu varaqda g'alati ish bor: butun matn varaqqa chiqib ketgan, oyna esa bo'sh! Sizningcha, qaysi qator aybdor? Varaqdagi ortiqcha so'zlarga qarab, uni kodda toping-da, ustiga bosing.",
      'Две вкладки готовы! Третья: кино. Смотри, тут странно: весь текст страницы уехал на вкладку, а окно пустое. Значит, одна строка кода сломана. Сначала найди эту строку и нажми на неё.',
      'Two tabs are done! The third is movies. Look, something’s odd here: all the page text went onto the tab, and the window is empty. So one line of code is broken. First find that line and tap it.')
  }),
  // Т4 · своя страница (прежнее т5).
  t4: Object.assign({}, OLD.t5, {
    say: L3("Uchta varaq yonib turibdi! Eng qizig'i qoldi: to'rtinchi, bo'sh varaq sizniki! Qanday sahifa yasagingiz keladi, o'yin haqidami yoki futbol haqidami? Hozircha unda ramka bor, xolos: doctype qatori va ikkita html tegi. Oldin head yozing, ichida title bilan o'zingiz o'ylagan nom. Keyin body, ichida xohlagan matningiz. Chizma yoningizda turibdi.",
      'Три вкладки горят! Теперь четвёртая: твоя страница. Здесь есть только рамка: строка doctype и тег html. Внутри напиши страницу сам. Сначала часть head, в ней title и твоё название. Потом часть body и внутри любой текст. Схема подскажет дорогу.',
      'Three tabs are lit! Now the fourth one: your page. There’s only a frame here: the doctype line and the html tag. Write the page inside it yourself. First the head part, with title and your own name in it. Then the body part with any text inside. The plan will show you the way.')
  }),
  fin: {
    eyebrow: L3("Xulosa", 'Вывод', 'Summary'),
    say: [
      { k: 'all', text: L3("Mana, to'rtta varaqning hammasi yonib turibdi: ob-havo, hayvonlar, kino va sizning sahifangiz!",
        'Смотри, все четыре вкладки горят: погода, животные, кино и твоя страница!',
        'Look, all four tabs are lit: weather, animals, movies and your own page!') },
      { k: 'title', text: L3("Nom title tegida turdi va varaqda chiqdi. Hayvonlar sahifasida esa uni o'z joyiga qaytardingiz.",
        'Название стояло в title и показалось на вкладке. А на странице про животных ты вернул его на место.',
        'The name sat in title and showed on the tab. And on the animals page you put it back in its place.') },
      { k: 'body', text: L3("Matnni body ichiga qo'ydingiz, shuning uchun u oynada chiqdi. Ob-havo sahifasining bo'sh oynasini ham shunday to'ldirdingiz.",
        'Текст оказался внутри body, поэтому он появился в окне. Так ты наполнил и пустое окно на странице погоды.',
        'The text went inside body, so it showed up in the window. That’s how you filled the empty window on the weather page.') },
      { k: 'close', text: L3("Har bir ochgan tegingizni yopdingiz, kino sahifasida yopilmay qolgan title tegini ham o'zingiz topdingiz.",
        'Каждый открытый тег закрыт, а на странице кино ты сам нашёл забытый закрывающий title.',
        'You closed every opened tag and even found the forgotten closing title on the movies page.') },
      { k: 'own', text: L3("To'rtinchi varaq esa endi bo'm-bo'sh emas: unda o'zingiz yozgan sahifa turibdi! Katta sarlavha bilan abzaslar hali yo'q: ular sahifangizni navbatdagi darsda to'ldiradi.",
        'А в конце вся страница написана твоими руками. Это было мощно! На следующем уроке добавим на страницу большой заголовок и абзацы.',
        'And at the end you wrote a whole page yourself. That was awesome! Next lesson we’ll add a big heading and paragraphs to the page.') }
    ],
    roles: OLD.fin.roles,
    ask: OLD.fin.ask
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// H2 · КРЮЧОК ЧАСТИ 2: страница с head и title, а окно пустое. «Matn qo'shish»: в код встаёт body, в окне появляется
// текст — название осталось на вкладке. Вкладки: три ждут, четвёртая (своя страница) открыта. Одно касание.
// ─────────────────────────────────────────────────────────────────────────────
function H2({ p }) {
  const pick = usePick();
  const c = C.h2;
  const [rec, put] = useRec('h2');
  const added = !!(rec && rec.done);
  const [flash, setFlash] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: added ? c.done : c.say, pose: added ? 'point' : 'hello' }]);
  const canGo = useAdvanceGate(added, spoken);
  const led = useIdleLed(!added, 0);
  const all = useA1Tabs(false);
  const tabs = all.map((t, i) => (i === 3 ? Object.assign({}, t, { st: 'ok' }) : t));
  const title = pick(UI.mySite);
  const text = pick(UI.hello);
  const tap = () => {
    if (added) return;
    sfx('ok', true);
    setFlash(1);
    put({ done: true });
    sayNow(c.broke, 'wonder');
    say(c.done, 'point');
  };
  const lines = added ? a1Full(title, text) : [A1_DOC].concat(a1Head(title), ['', '</html>']);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a1-s1 a1-h2">
        <KzAsk text={added ? c.askDone : c.ask} />
        <div className="a1-work">
          <div className="a1-side">
            <A1Browser tabs={tabs} cur={3} title={title} flash={flash}><A1Page text={added ? text : ''} flash={flash} /></A1Browser>
          </div>
          <div className="a1-main">
            <A1Code lines={lines} />
            {!added ? (
              <div className="kz-row a1-row">
                <button type="button" className="kz-btn is-coral a1-addtext" onClick={tap}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  {pick(UI.addText)}<Led on={led} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Т1 · блок body с текстом после </head> (прежнее т3 — страница «Ob-havo»).
// ─────────────────────────────────────────────────────────────────────────────
const cfgW1 = () => ({
  id: 't1', num: 1, kind: 'write-block', C: C.t1,
  init: () => ({ code: '  ' }),
  check: (st) => a1Plan(st.code, A1_BODY, { textOut: true }),
  view: a1BodyView(TABS[0].name),
  sample: (pk) => ['<body>', '  ' + pk(XTRA.hi), '</body>'],
  drill: { init: () => ({ code: '  ' }), check: (st) => a1Plan(st.code, A1_BODY, { textOut: true }), view: a1BodyView(TABS[0].name) }
});

// ─────────────────────────────────────────────────────────────────────────────
// Т2 · название и текст перепутаны: в title стоит текст для окна, в body — название страницы. Два поля в коде, оба
// заполнены наоборот; поменять слова местами. Вкладка и окно меняются при наборе. Проверка одна: в title — название,
// в body — текст. Выбор «title или body» — тема части 2 урока (вкладка или окно). В коде — только head и body (без doctype
// и html: на телефоне длинное слово в title переносит строку, места под лишние строки нет); страница по-прежнему честная.
// ─────────────────────────────────────────────────────────────────────────────
function a1SwapCheck(st, name, text) {
  const a = a1Squash(st.v), b = a1Squash(st.w);
  if (/[<>]/.test(a) || /[<>]/.test(b)) return { ok: false, msg: UI.noTags };
  if (!a) return { ok: false, msg: FB.swapNoName };
  if (!b) return { ok: false, msg: FB.swapNoText };
  if (a1Norm(a) === a1Norm(text) && a1Norm(b) === a1Norm(name)) return { ok: false, msg: FB.swapStill };
  if (a1Norm(a) !== a1Norm(name)) return { ok: false, msg: fillL(FB.wrongName, { got: a, want: name }) };
  if (a1Norm(b) !== a1Norm(text)) return { ok: false, msg: fillL(FB.wrongText, { got: b, want: text }) };
  return { ok: true };
}
function A1Where() {
  const pick = usePick();
  return (
    <div className="a1-slots a1-where" translate="no">
      <span className="a1-slot" style={{ '--pc': 'var(--r-head)' }}><code>title</code><em>{'→ '}{pick(UI.onTab)}</em></span>
      <span className="a1-slot" style={{ '--pc': 'var(--r-body)' }}><code>body</code><em>{'→ '}{pick(UI.inWin)}</em></span>
    </div>
  );
}
function a1SwapView() {
  return (st, x) => {
    const v = st.v || '', w = st.w || '';
    const pg = a1Page(a1Full(v, w).join('\n'));
    const field = (k, ref) => (
      <span key={k} className={'kz-gap' + (x.led ? ' kz-gap-led' : '')}>
        <InlineInput value={st[k] || ''} onChange={(s) => x.set(Object.assign({}, st, { [k]: s }))} inputRef={ref} onEnter={x.check} placeholder={L3('…', '…', '…')} label={UI.editor} max={30}
          onFocus={(e) => { const el = e.target; el.select(); setTimeout(() => { const box = el.closest('.a1-kz'); if (box && box.scrollHeight > box.clientHeight) box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 2); }, 120); }} />
      </span>
    );
    return {
      title: pg.title, text: pg.text, tabHl: true, pageHl: true,
      aid: <A1Where />,
      editor: (
        <div className="a1-fieldwrap">
          <KzCode cls="a1-kz" lines={[
            { k: 'hd', parts: [T_('head')] },
            { k: 't', d: 1, cls: x.solved ? 'is-new' : 'is-hl', parts: [T_('title'), x.solved ? W_(v) : field('v', x.inRef), T_('title', true)] },
            { k: 'hc', parts: [T_('head', true)] },
            { k: 'b', parts: [T_('body')] },
            { k: 'x', d: 1, cls: x.solved ? 'is-new' : 'is-hl', parts: [x.solved ? W_(w) : field('w', null)] },
            { k: 'bc', parts: [T_('body', true)] }
          ]} />
        </div>
      ),
      keys: !x.solved, syms: []
    };
  };
}
const cfgW2 = (pick) => {
  const T = TABS[1];
  const name = pick(T.name), text = pick(T.text);
  const sport = pick(XTRA.sport), football = pick(XTRA.football);
  return {
    id: 't2', num: 2, kind: 'swap-title-body', C: C.t2,
    init: () => ({ v: text, w: name }),
    check: (st) => a1SwapCheck(st, name, text),
    view: a1SwapView(),
    sample: (pk) => ['<title>' + pk(XTRA.books) + '</title>', '<body>', '  ' + pk(XTRA2.booksText), '</body>'],
    drill: { init: () => ({ v: football, w: sport }), check: (st) => a1SwapCheck(st, sport, football), view: a1SwapView() }
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Т3 · найти строку и исправить: незакрытый title (прежнее т4 — страница «Kino»). Т4 · своя страница (прежнее т5).
// ─────────────────────────────────────────────────────────────────────────────
const cfgW3 = (pick) => {
  const T = TABS[2];
  const sport = pick(XTRA.sport);
  const miss = (st, want) => (st.at == null ? { ok: false, msg: C.t3.ask } : a1FixCheck(st, want));
  return {
    id: 't3', num: 3, kind: 'find-fix', C: C.t3,
    init: () => ({ at: null, code: '' }),
    check: (st) => miss(st, pick(T.name)),
    view: a1FixView(T.name, T.text, C.t3),
    sample: (pk) => ['<title>' + pk(XTRA.books) + '</title>'],
    drill: { init: () => ({ at: null, code: '' }), check: (st) => miss(st, sport), view: a1FixView(XTRA.sport, XTRA.football, C.t3, true) }
  };
};
const cfgW4 = (pick, store) => Object.assign(cfgT5(pick, store), { id: 't4', num: 4, C: C.t4 });

const W1 = ({ p }) => <A1Task p={p} make={cfgW1} />;
const W2 = ({ p }) => <A1Task p={p} make={cfgW2} />;
const W3 = ({ p }) => <A1Task p={p} make={cfgW3} />;
const W4 = ({ p }) => <A1Task p={p} make={cfgW4} />;
