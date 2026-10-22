// =============================================================================
// ХУК, ПЯТЬ ЗАДАНИЙ, ВЫВОД И КОРЕНЬ ПРАКТИКИ «ПОХОДНЫЙ БЛОКНОТ»
// Семь слайдов (заказчик, 22.10.2026). У каждого задания своя механика:
// дописать пункт → правка в двух местах (ul → ol) → строка в список → найти и
// починить пункты (счётчик) → свой список с нуля (живой список условий).
// =============================================================================
const DOCTYPE = '<!DOCTYPE html>';
// Готовая рамка документа (урок 1): head с title и открытый body; extra — строки в body.
const frame = (title, extra) => [DOCTYPE, '<html>', '  <head>', '    <title>' + title + '</title>', '  </head>', '  <body>'].concat(extra || []);
const END = ['  </body>', '</html>'];
const same = (a, b) => normName(a) === normName(b);
const sameList = (a, b) => a.length === b.length && a.every((x, i) => same(x, b[i]));
const sameSet = (a, b) => sameList(a.map(normName).sort(), b.map(normName).sort());
// Разбор нашёл поломку записи или пар — его фраза; line — где она.
const fragFail = (r) => ({ ok: false, msg: r.msg, cat: 'tag', line: r.line });
const itemsOf = (ls) => ls.items.map((x) => squash(x.text));
// Список кодом: открывающий тег, пункты с отступом, закрывающий.
const listCode = (tag, items) => ['<' + tag + '>'].concat(items.map((x) => '  <li>' + x + '</li>'), ['</' + tag + '>']).join('\n');

// t1 — один новый пункт li с нужным словом (в коде он стоит внутри ul).
function checkAddItem(code, w) {
  if (!String(code || '').trim()) return fb('needLi');
  const other = lexDoc(code).find((t) => (t.k === 'open' || t.k === 'close') && t.name !== 'li');
  if (other) return fb('notLi', { tag: other.name });
  const r = checkFrag('<ul>' + code + '</ul>');
  if (!r.ok) return fragFail(r);
  const items = r.lists[0] ? r.lists[0].items : [];
  if (!items.length) return fb('needLi');
  if (items.length > 1) return fb('oneItem');
  if (!same(items[0].text, w)) return fb('wordSame', { w });
  return { ok: true, result: {} };
}

// t2 — тот же список, но ol; шаги прежние.
function checkToOl(code, items) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  if (r.lists.length !== 1) return fb('noList');
  if (r.lists[0].t !== 'ol') return fb('stillUl');
  if (!sameList(itemsOf(r.lists[0]), items)) return fb('itemsSame');
  return { ok: true, result: {} };
}

// t3 — строка вещей → список ul: по пункту на вещь, строки p не осталось.
function checkFromText(code, words) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  if (!r.lists.length) return fb('needUl');
  if (r.blocks.some((x) => hasLetters(x.text))) return fb('leftText');
  const ls = r.lists[0];
  if (r.lists.length > 1) return fb('countN', { n: words.length });
  if (ls.t !== 'ul') return fb('notOl');
  if (ls.items.length !== words.length) return fb('countN', { n: words.length });
  if (!sameSet(itemsOf(ls), words)) return fb('itemsWrong', { list: words.join(', ') });
  return { ok: true, result: {} };
}

// t4 — пункты починены, а список прежний: тот же тег и те же шаги.
// В ul порядок пунктов не важен, в ol — важен.
function checkFix(code, want) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  const ls = r.lists;
  const got = ls.length === 1 ? itemsOf(ls[0]) : [];
  const textOk = want.tag === 'ol' ? sameList(got, want.items) : sameSet(got, want.items);
  if (ls.length === 1 && ls[0].t === want.tag && textOk && !r.blocks.length) return { ok: true, result: {} };
  const all = [].concat(...ls.map(itemsOf));
  if (sameSet(all, want.items)) return fb('keepList', { tag: want.tag });
  return fb('textSame');
}
// Сколько строк с поломкой осталось — для счётчика. Пусто — не «всё исправлено».
const brokenLeft = (code) => {
  const r = checkFrag(code, { strictText: true });
  return r.ok && r.lists.length ? 0 : Math.max(1, r.count);
};

// t5 — свой список: h1 с названием, список ul или ol, три пункта с текстом, всё закрыто.
function listPageOf(code) {
  const r = checkFrag(code, { strictText: true });
  const h1 = r.blocks.find((x) => x.t === 'h1' && hasLetters(x.text));
  const ls = r.lists.find((x) => x.items.filter((it) => hasLetters(it.text)).length >= 3) || r.lists[0] || null;
  const n = ls ? ls.items.filter((it) => hasLetters(it.text)).length : 0;
  return { r, h1, ls, n, closed: r.ok && (r.blocks.length > 0 || r.lists.length > 0) };
}
function checkOwn(code) {
  if (!String(code || '').trim()) return fb('artEmpty', null, 'h1');
  const a = listPageOf(code);
  if (!a.r.ok) return fragFail(a.r);
  if (!a.r.blocks.some((x) => x.t === 'h1')) return fb('needH1', null, 'h1');
  if (!a.h1) return fb('headEmpty', null, 'h1');
  if (!a.ls) return fb('needList', null, 'list');
  if (a.n < 3) return fb('needItems', null, 'items');
  return { ok: true, result: { title: squash(a.h1.text), kind: a.ls.t, items: a.ls.items.filter((it) => hasLetters(it.text)).map((it) => squash(it.text)) } };
}

// =============================================================================
// ПЯТЬ ЗАДАНИЙ. num — номер задания и привал тропы, который оно восстанавливает.
// =============================================================================
// 1 · Рюкзак — дописать в готовый ul новый пункт <li>компас</li>.
function cfgT1(pick) {
  const top = pick(TXT.hike);
  const w = pick(TXT.add), w2 = pick(TXT.add2);
  const pre = (items, h) => frame(top, ['    <h2>' + h + '</h2>', '    <ul>'].concat(items.map((x) => '      <li>' + pick(x) + '</li>')));
  const post = ['    </ul>'].concat(END);
  return {
    id: 't1', num: 1, kind: 'line', C: C.t1,
    spec: { kind: 'line', before: pre(TXT.pack, pick(TXT.packH)), after: post, ind: 6 },
    init: () => ({ code: '' }),
    check: (st) => checkAddItem(st.code, w),
    hint: (lv) => ({ text: C.t1.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    h3: () => <CodeSample code={'<li>' + pick(TXT.sample1) + '</li>'} />,
    drill: { make: () => ({
      order: C.t1.drill,
      spec: { kind: 'line', before: pre(TXT.pack2, pick(TXT.packH)), after: post, ind: 6 },
      init: () => ({ code: '' }), check: (st) => checkAddItem(st.code, w2)
    }) }
  };
}

// 2 · Тропа — шаги маршрута в ul: поменять оба тега на ol.
function cfgT2(pick) {
  const top = pick(TXT.hike);
  const route = TXT.route.map(pick), sand = TXT.sand.map(pick);
  return {
    id: 't2', num: 2, kind: 'block', C: C.t2,
    spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.routeH) + '</h2>']), after: END, ind: 4 },
    init: () => ({ code: listCode('ul', route) }),
    check: (st) => checkToOl(st.code, route),
    hint: (lv) => ({ text: C.t2.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    h3: () => <CodeSample code={'<ol>\n  …\n</ol>'} />,
    drill: { make: () => ({
      order: C.t2.drill,
      spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.sandH) + '</h2>']), after: END, ind: 4 },
      init: () => ({ code: listCode('ul', sand) }), check: (st) => checkToOl(st.code, sand)
    }) }
  };
}

// 3 · Привал — строка «шапка, вода, карта» → список ul. Рядом — как должно быть.
function cfgT3(pick) {
  const top = pick(TXT.hike);
  const rest = TXT.rest.map(pick), games = TXT.games.map(pick);
  return {
    id: 't3', num: 3, kind: 'block', C: C.t3,
    spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.restH) + '</h2>']), after: END, ind: 4 },
    init: () => ({ code: '<p>' + rest.join(', ') + '</p>' }),
    check: (st) => checkFromText(st.code, rest),
    hint: (lv) => ({ text: C.t3.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <ListTarget kind="ul" items={rest} />,
    h3: () => <CodeSample code={listCode('ul', TXT.sample3.map(pick))} />,
    drill: { make: () => ({
      order: C.t3.drill,
      spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.gamesH) + '</h2>']), after: END, ind: 4 },
      init: () => ({ code: '<p>' + games.join(', ') + '</p>' }), check: (st) => checkFromText(st.code, games),
      aids: <ListTarget kind="ul" items={games} />
    }) }
  };
}

// 4 · Палатка — два сломанных пункта: текст без <li> и <li> вместо </li>.
// Браузер честно показывает обе поломки: шаг без номера и лишний пустой пункт.
function cfgT4(pick) {
  const top = pick(TXT.hike);
  const tent = TXT.tent.map(pick), dish = TXT.dish.map(pick);
  const before = frame(top, ['    <h2>' + pick(TXT.tentH) + '</h2>']);
  const dbefore = frame(top, ['    <h2>' + pick(TXT.dishH) + '</h2>']);
  const want = { tag: 'ol', items: tent };
  const dwant = { tag: 'ul', items: dish };
  const lineOf = (code) => { const r = checkFrag(code, { strictText: true }); return r.ok || r.line == null ? null : before.length + r.line; };
  return {
    id: 't4', num: 4, kind: 'block', C: C.t4,
    spec: { kind: 'block', before, after: END, ind: 4 },
    init: () => ({ code: ['<ol>', '  <li>' + tent[0] + '</li>', '  ' + tent[1] + '</li>', '  <li>' + tent[2] + '<li>', '</ol>'].join('\n') }),
    check: (st) => checkFix(st.code, want),
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t4.hints[lv - 1] };
      const at = lineOf(st.code);
      if (at != null) return { text: fillL(C.t4.hints[1], { n: at + 1 }) };
      if (brokenLeft(st.code)) return { text: C.t4.hintTags };
      return { text: checkFix(st.code, want).ok ? C.t4.hintLine : C.t4.hintKeep };
    },
    fx: (rec) => (rec.solved ? null : { markLine: rec.hint >= 2 ? lineOf(rec.st.code) : null }),
    aids: (rec, st) => <FixLeft n={brokenLeft(st.code)} />,
    h3: () => <CodeSample code={listCode('ol', TXT.sand.map(pick))} />,
    drill: { make: () => ({
      order: C.t4.drill,
      spec: { kind: 'block', before: dbefore, after: END, ind: 4 },
      init: () => ({ code: ['<ul>', '  <li>' + dish[0] + '</li>', '  ' + dish[1], '</ul>', '<li>' + dish[2] + '</li>'].join('\n') }),
      check: (st) => checkFix(st.code, dwant),
      aids: (d, st) => <FixLeft n={brokenLeft(st.code)} />
    }) }
  };
}

// 5 · Свой список — с нуля внутри body: h1 и список с тремя пунктами.
// Список условий загорается по ходу набора; редактор во всё свободное место.
function cfgT5(pick) {
  const top = pick(TXT.hike);
  const before = frame(top);
  const items = (code) => {
    const a = listPageOf(code);
    return [
      { k: 'h1', ok: !!a.h1, text: UI.needH1 },
      { k: 'list', ok: !!a.ls, text: UI.needList },
      { k: 'n', ok: a.n >= 3, text: UI.need3 },
      { k: 'cl', ok: a.closed, text: UI.needClosed }
    ];
  };
  return {
    id: 't5', num: 5, kind: 'block', C: C.t5,
    spec: { kind: 'block', before, after: END, ind: 4, big: true, empty: C.t5.empty },
    init: () => ({ code: '' }),
    check: (st) => {
      const r = checkOwn(st.code);
      if (!r.ok) return r;
      const html = before.concat(st.code.split('\n').map((l) => '    ' + l)).concat(END).join('\n');
      const pg = renderDoc(html);
      return { ok: true, result: Object.assign({}, r.result, { html, page: pg.title, blocks: pg.blocks }) };
    },
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t5.hints[lv - 1] };
      const r = checkOwn(st.code);
      const cat = r.ok ? 'tag' : r.cat === 'tag' && !listPageOf(st.code).r.blocks.length && !listPageOf(st.code).r.lists.length ? 'h1' : (r.cat || 'tag');
      return { text: C.t5.hint2[cat] || C.t5.hints[1] };
    },
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: (rec, st) => <Checklist items={items(st.code)} />,
    h3: () => <CodeSample code={'<h1>' + pick(TXT.books) + '</h1>\n' + listCode('ul', TXT.booksL.map(pick))} />,
    drill: { make: () => ({
      order: C.t5.drill,
      spec: { kind: 'block', before, after: END, ind: 4, empty: C.t5.empty },
      init: () => ({ code: '' }),
      check: (st) => {
        const r = checkFrag(st.code, { strictText: true });
        if (!r.ok) return fragFail(r);
        const ls = r.lists[0];
        if (!ls || ls.t !== 'ol') return fb('needOl');
        if (ls.items.filter((it) => hasLetters(it.text)).length < 3) return fb('needItems');
        return { ok: true, result: {} };
      }
    }) }
  };
}

const ST1 = ({ p }) => <TaskScreen p={p} make={cfgT1} />;
const ST2 = ({ p }) => <TaskScreen p={p} make={cfgT2} />;
const ST3 = ({ p }) => <TaskScreen p={p} make={cfgT3} />;
const ST4 = ({ p }) => <TaskScreen p={p} make={cfgT4} />;
const ST5 = ({ p }) => <TaskScreen p={p} make={cfgT5} />;

// =============================================================================
// ХУК — тропа целая; одно касание «Дождь!»: флажки привалов вздрагивают,
// выцветают и косятся, капли слетают (stop-motion, шорох). Потом Коди называет задачу.
// =============================================================================
function SIntro({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.intro;
  const [done, setDone] = useState(() => !!(store.get('intro') || {}).done);
  const [blown, setBlown] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: done ? c.plan : c.say, pose: 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(done, spoken);
  const led = useIdleLed(canTap && !done, 0);
  const rain = () => {
    if (!canTap || done) return;
    sfx('pop', true);
    setBlown(true);
    setDone(true);
    store.set('intro', { done: true });
    sayNow(joinL(c.blown, c.plan), 'wonder');
  };
  return (
    <PStage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.plan : c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} label={UI.start} /></>}>
      <Sheet cls="pp-sheet pp-sheet-intro">
        <PAsk text={done ? c.order : c.ask} />
        <StreetMap whole={!done} blown={blown} />
        {done ? <p className="pp-intro-note kz-piece">{pick(c.note)}</p> : (
          <div className="pp-wind-row">
            <button type="button" className={'kz-btn is-coral pp-wind' + (led ? ' is-led' : '')} disabled={!canTap} onClick={rain}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M7 15a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 7.5a3.8 3.8 0 0 1 .5 7.5H7zM8 18l-1 3M12 18l-1 3M16 18l-1 3" />
              </svg>
              {pick(UI.rain)}
            </button>
          </div>
        )}
      </Sheet>
    </PStage>
  );
}

// Переключатель «Страница / Код» на телефоне в выводе.
function PSeg({ value, onChange }) {
  const pick = usePick();
  return (
    <div className="pp-seg" role="radiogroup">
      {[{ v: 'page', label: UI.page }, { v: 'code', label: UI.code }].map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={'pp-seg-b' + (value === o.v ? ' is-on' : '')}
          onClick={() => { sfx('tap', true); onChange(o.v); }}>{pick(o.label)}</button>
      ))}
    </div>
  );
}

// ВЫВОД — тропа горит, свой список и его код, что ученик теперь умеет, следующий урок.
function SFin({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.fin;
  const [speaker, , spoken] = useVoice([{ text: c.say, pose: 'celebrate' }]);
  const canGo = useAdvanceGate(true, spoken);
  const [view, setView] = useState('page');
  const res = (store.get('t5') || {}).result;
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  return (
    <PStage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.say}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="pp-sheet pp-sheet-fin">
        <StreetMap glow />
        {res ? (
          <div className="pp-fin">
            <div className="pp-fin-top">
              <span className="pp-stamp kz-piece"><Icon name="check" size={18} />{pick(UI.ready)}</span>
              <span className="pp-only-narrow"><PSeg value={view} onChange={setView} /></span>
            </div>
            <div className={'pp-fin-pair view-' + view}>
              <div className="pp-fin-b"><PageView title={res.page} blocks={res.blocks} /></div>
              <div className="pp-fin-c"><Pad><CodeSample code={res.html} /></Pad></div>
            </div>
            <div className="pp-skills kz-piece">
              {c.skills.map((sk, i) => (
                <span className="pp-skill" key={i} style={{ '--dl': (0.2 + i * 0.12) + 's' }}><Icon name="check" size={13} />{pick(sk)}</span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        ) : null}
      </Sheet>
    </PStage>
  );
}

// =============================================================================
// РЕЕСТР ЭКРАНОВ, АРТЕФАКТ, КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 'intro', code: 'HOOK', Comp: SIntro },
  { id: 't1', code: 'LEVEL-1', Comp: ST1 }, { id: 't2', code: 'LEVEL-2', Comp: ST2 },
  { id: 't3', code: 'LEVEL-3', Comp: ST3 }, { id: 't4', code: 'CHECK-1', Comp: ST4 },
  { id: 't5', code: 'RESULT', Comp: ST5 },
  { id: 'fin', code: 'PREVIEW', Comp: SFin }
];

// «Повторить» стирает только текущий экран.
const SCREEN_RESET = { intro: ['intro'], t1: ['t1'], t2: ['t2'], t3: ['t3'], t4: ['t4'], t5: ['t5'], fin: [] };

// Артефакт практики — страница со своим списком, как её написал ученик.
function practiceArtifact(store) {
  const r = (store.get('t5') || {}).result;
  if (!r) return null;
  return { type: 'html-page', title: r.title, text: (r.items || []).join(', '), items: r.items || [], html: r.html };
}

export default function HtmlPractice03({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: practiceArtifact(store) })
  });
  useParallax();
  usePaperSound();
  const cur = SCREENS[R.i];
  const Comp = cur.Comp;
  // Прогрев озвучки: реплики этого экрана и следующего — заранее.
  const nextId = SCREENS[R.i + 1] && SCREENS[R.i + 1].id;
  useEffect(() => {
    if (!R.audio || !R.audio.warm) return undefined;
    const t = setTimeout(() => {
      R.audio.warm(heroLines(C[cur.id], R.lang).concat(heroLines(C[nextId], R.lang)).map((s) => spokenHtml(s, R.lang)));
    }, 700);
    return () => clearTimeout(t);
  }, [cur.id, nextId, R.lang]); // eslint-disable-line react-hooks/exhaustive-deps
  // Переход «разбор и сборка» — на «Дальше» и «Назад», как в уроке 1.
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next), prev: R.i > 0 ? go(R.prev) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
