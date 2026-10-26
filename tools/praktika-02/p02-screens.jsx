// =============================================================================
// ХУК, ПЯТЬ ЗАДАНИЙ, ВЫВОД И КОРЕНЬ ПРАКТИКИ «СТЕНГАЗЕТА»
// Семь слайдов (заказчик, 22.10.2026). У каждого задания своя механика:
// поменять цифру → разрезать абзац → сделать как на вырезке → найти и починить
// поломки (счётчик) → своя статья с нуля (живой список условий).
// =============================================================================
const DOCTYPE = '<!DOCTYPE html>';
// Готовая рамка документа (урок 1): head с title и открытый body; extra — строки в body.
const frame = (title, extra) => [DOCTYPE, '<html>', '  <head>', '    <title>' + title + '</title>', '  </head>', '  <body>'].concat(extra || []);
const END = ['  </body>', '</html>'];
// Предложение из кусочков: строка или { b } / { i }.
const partsHtml = (parts) => parts.map((x) => (typeof x === 'string' ? x : x.b !== undefined ? '<b>' + x.b + '</b>' : '<i>' + x.i + '</i>')).join('');
const partsPlain = (parts) => parts.map((x) => (typeof x === 'string' ? x : x.b !== undefined ? x.b : x.i)).join('');
const wordOf = (parts, tag) => { const x = parts.find((y) => typeof y !== 'string' && y[tag] !== undefined); return x ? x[tag] : ''; };
const same = (a, b) => normName(a) === normName(b);
// Разбор нашёл поломку записи или пар — его фраза; line — где она.
const fragFail = (r) => ({ ok: false, msg: r.msg, cat: 'tag', line: r.line });
const marksOf = (bk, tag) => squash(bk.marks.filter((m) => m.tag === tag).map((m) => m.v).join(''));

// t1 — один заголовок нужного уровня с прежним текстом.
function checkLevel(code, text, want) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  if (r.blocks.length !== 1) return fb(r.blocks.length ? 'oneBlock' : 'needHead');
  const bk = r.blocks[0];
  if (!isHead(bk.t)) return fb('needHead');
  const n = Number(bk.t.slice(1));
  if (n !== want) return fb(want === 1 ? 'notBiggest' : 'notSection', { n });
  if (!same(bk.text, text)) return fb('textSame');
  return { ok: true, result: {} };
}

// t2 — два абзаца: граница после первого предложения.
function checkSplit(code, a, b) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  const bl = r.blocks;
  const other = bl.find((x) => x.t !== 'p');
  if (other) return fb('onlyP', { tag: other.t });
  if (bl.length < 2) return fb('oneP');
  if (bl.length > 2) return fb('tooManyP');
  if (same(bl[0].text, a) && same(bl[1].text, b)) return { ok: true, result: {} };
  if (same(bl[0].text + ' ' + bl[1].text, a + ' ' + b)) return fb('splitWrong');
  return fb('textSame');
}

// t3 — как на вырезке: одно слово в b, другое в i, текст прежний.
function checkMatch(code, parts) {
  const wb = wordOf(parts, 'b');
  const wi = wordOf(parts, 'i');
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  if (r.blocks.length !== 1 || r.blocks[0].t !== 'p') return fb('oneLine');
  const bk = r.blocks[0];
  const gb = marksOf(bk, 'b');
  const gi = marksOf(bk, 'i');
  if (!(same(gb, wb) && same(gi, wi))) {
    if (same(gb, wi) && same(gi, wb)) return fb('swapped', { b: wb, i: wi });
    if (!gb) return fb('needB', { w: wb });
    if (!same(gb, wb)) return fb('bWrong', { got: gb, w: wb });
    if (!gi) return fb('needI', { w: wi });
    return fb('iWrong', { got: gi, w: wi });
  }
  if (!same(bk.text, partsPlain(parts))) return fb('textSame');
  return { ok: true, result: {} };
}

// t4 — поломки починены, а вырезка осталась прежней: h2, два абзаца, одно выделенное слово.
function checkFix(code, want) {
  const r = checkFrag(code, { strictText: true });
  if (!r.ok) return fragFail(r);
  const bl = r.blocks;
  if (!same(bl.map((x) => x.text).join(' '), want.all)) return fb('textSame');
  const shape = bl.length === 3 && bl[0].t === 'h2' && bl[1].t === 'p' && bl[2].t === 'p';
  const marks = bl.reduce((acc, x) => acc.concat(x.marks), []);
  const okMark = same(marks.filter((m) => m.tag === want.tag).map((m) => m.v).join(''), want.w) && marks.every((m) => m.tag === want.tag);
  if (!shape || !okMark) return fb('keepAsWas', { tag: want.tag, w: want.w });
  return { ok: true, result: {} };
}
// Сколько поломок осталось — для счётчика. Пусто — не «всё исправлено».
const brokenLeft = (code) => {
  const r = checkFrag(code, { strictText: true });
  return r.ok && r.blocks.length ? 0 : Math.max(1, r.count);
};

// t5 — своя статья: h2 с названием, абзац, выделенное слово, все пары закрыты.
function articleOf(code) {
  const r = checkFrag(code, { strictText: true });
  const bl = r.blocks;
  const h2 = bl.find((x) => x.t === 'h2' && hasLetters(x.text));
  const p = bl.find((x) => x.t === 'p' && hasLetters(x.text));
  const em = bl.some((x) => x.t === 'p' && x.marks.some((m) => hasLetters(m.v)));
  return { r, bl, h2, p, em, closed: r.ok && bl.length > 0 };
}
function checkArticle(code) {
  if (!String(code || '').trim()) return fb('artEmpty', null, 'h2');
  const a = articleOf(code);
  if (!a.r.ok) return fragFail(a.r);
  if (!a.bl.some((x) => x.t === 'h2')) return fb(a.bl.some((x) => x.t === 'h1') ? 'h1Taken' : 'needH2', null, 'h2');
  if (!a.h2) return fb('headEmpty', null, 'h2');
  if (!a.p) return fb('needP', null, 'p');
  if (!a.em) return fb('needEm', null, 'em');
  return { ok: true, result: { title: squash(a.h2.text), text: squash(a.bl.filter((x) => x.t === 'p').map((x) => x.text).join(' ')) } };
}

// =============================================================================
// ПЯТЬ ЗАДАНИЙ. num — номер задания и вырезка газеты, которую оно чинит.
// =============================================================================
// 1 · Название газеты — h4 → h1 (поменять цифру в обоих тегах).
function cfgT1(pick) {
  const top = pick(TXT.gazeta);
  const mast = pick(TXT.mast);
  const sport = pick(TXT.sport);
  return {
    id: 't1', num: 1, kind: 'line', C: C.t1,
    spec: { kind: 'line', before: frame(top), after: ['    <p>' + pick(TXT.mastText) + '</p>'].concat(END), ind: 4 },
    init: () => ({ code: '<h4>' + mast + '</h4>' }),
    check: (st) => checkLevel(st.code, mast, 1),
    hint: (lv) => ({ text: C.t1.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    h3: () => <CodeSample code={'<h1>' + pick(TXT.otherPaper) + '</h1>'} />,
    drill: { make: () => ({
      order: C.t1.drill,
      spec: { kind: 'line', before: frame(top, ['    <h1>' + mast + '</h1>']), after: ['    <p>' + partsHtml(pick(TXT.footText)) + '</p>'].concat(END), ind: 4 },
      init: () => ({ code: '<h5>' + sport + '</h5>' }), check: (st) => checkLevel(st.code, sport, 2)
    }) }
  };
}

// 2 · Новости — один абзац разрезать на два: вставить </p><p> посреди строки.
function cfgT2(pick) {
  const top = pick(TXT.gazeta);
  const a = pick(TXT.news1), b = pick(TXT.news2);
  const da = pick(TXT.club1), db = pick(TXT.club2);
  return {
    id: 't2', num: 2, kind: 'block', C: C.t2,
    spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.news) + '</h2>']), after: END, ind: 4 },
    init: () => ({ code: '<p>' + a + ' ' + b + '</p>' }),
    check: (st) => checkSplit(st.code, a, b),
    hint: (lv) => ({ text: C.t2.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    h3: () => <CodeSample code={'<p>' + pick(TXT.rain1) + '</p>\n<p>' + pick(TXT.rain2) + '</p>'} />,
    drill: { make: () => ({
      order: C.t2.drill,
      spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.clubs) + '</h2>']), after: END, ind: 4 },
      init: () => ({ code: '<p>' + da + ' ' + db + '</p>' }), check: (st) => checkSplit(st.code, da, db)
    }) }
  };
}

// 3 · Спорт — сделать как на вырезке: вырезка-образец лежит рядом с браузером.
function cfgT3(pick) {
  const top = pick(TXT.gazeta);
  const win = pick(TXT.win);
  const race = pick(TXT.race);
  return {
    id: 't3', num: 3, kind: 'line', C: C.t3,
    spec: { kind: 'line', before: frame(top, ['    <h2>' + pick(TXT.sport) + '</h2>']), after: END, ind: 4 },
    init: () => ({ code: '<p>' + partsPlain(win) + '</p>' }),
    check: (st) => checkMatch(st.code, win),
    hint: (lv) => ({ text: C.t3.hints[lv - 1] }),
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: <TargetCard parts={win} />,
    h3: () => <CodeSample code={'<p>' + partsHtml(pick(TXT.footText)) + '</p>'} />,
    drill: { make: () => ({
      order: C.t3.drill,
      spec: { kind: 'line', before: frame(top, ['    <h2>' + pick(TXT.sport) + '</h2>']), after: END, ind: 4 },
      init: () => ({ code: '<p>' + partsPlain(race) + '</p>' }), check: (st) => checkMatch(st.code, race),
      aids: <TargetCard parts={race} />
    }) }
  };
}

// 4 · Погода — найти и починить два испорченных тега. Браузер честно показывает
// обе поломки: абзацы внутри незакрытого h2 огромные, незакрытый b тянется дальше.
function cfgT4(pick) {
  const top = pick(TXT.gazeta);
  const before = frame(top);
  const head = pick(TXT.weather), w1 = pick(TXT.w1), wb = pick(TXT.w1b), w2 = pick(TXT.w2);
  const want = { tag: 'b', w: wb, all: head + ' ' + w1 + ' ' + wb + ' ' + w2 };
  const qh = pick(TXT.quiz), q1 = pick(TXT.q1), qi = pick(TXT.q1b), q2 = pick(TXT.q2);
  const dwant = { tag: 'i', w: qi, all: qh + ' ' + q1 + ' ' + qi + ' ' + q2 };
  const lineOf = (code) => { const r = checkFrag(code, { strictText: true }); return r.ok || r.line == null ? null : before.length + r.line; };
  return {
    id: 't4', num: 4, kind: 'block', C: C.t4,
    spec: { kind: 'block', before, after: END, ind: 4 },
    init: () => ({ code: ['<h2>' + head + '<h2>', '<p>' + w1 + ' <b>' + wb + '</p>', '<p>' + w2 + '</p>'].join('\n') }),
    check: (st) => checkFix(st.code, want),
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t4.hints[lv - 1] };
      const at = lineOf(st.code);
      if (at != null) return { text: fillL(C.t4.hints[1], { n: at + 1 }) };
      if (brokenLeft(st.code)) return { text: C.t5.hint2.tag };
      return { text: checkFix(st.code, want).ok ? C.t4.hintLine : C.t4.hintKeep };
    },
    fx: (rec) => (rec.solved ? null : { markLine: rec.hint >= 2 ? lineOf(rec.st.code) : null }),
    aids: (rec, st) => <FixLeft n={brokenLeft(st.code)} />,
    h3: () => <CodeSample code={'<h2>' + pick(TXT.football) + '</h2>\n<p>' + partsHtml(pick(TXT.footText)) + '</p>'} />,
    drill: { make: () => ({
      order: C.t4.drill,
      spec: { kind: 'block', before, after: END, ind: 4 },
      init: () => ({ code: ['<h2>' + qh + '</h2>', '<p>' + q1 + ' <i>' + qi + '</p>', '<p>' + q2 + '<p>'].join('\n') }),
      check: (st) => checkFix(st.code, dwant),
      aids: (d, st) => <FixLeft n={brokenLeft(st.code)} />
    }) }
  };
}

// 5 · Своя статья — с нуля под названием газеты: h2, абзац, выделенное слово.
// Список условий загорается по ходу набора; редактор во всё свободное место.
function cfgT5(pick) {
  const top = pick(TXT.gazeta);
  const before = frame(top, ['    <h1>' + pick(TXT.mast) + '</h1>']);
  const items = (code) => {
    const a = articleOf(code);
    return [
      { k: 'h2', ok: !!a.h2, text: UI.needH2 },
      { k: 'p', ok: !!a.p, text: UI.needP },
      { k: 'em', ok: a.em, text: UI.needEm },
      { k: 'cl', ok: a.closed, text: UI.needClosed }
    ];
  };
  return {
    id: 't5', num: 5, kind: 'block', C: C.t5,
    spec: { kind: 'block', before, after: END, ind: 4, big: true, empty: C.t5.empty },
    init: () => ({ code: '' }),
    check: (st) => {
      const r = checkArticle(st.code);
      if (!r.ok) return r;
      const html = before.concat(st.code.split('\n').map((l) => '    ' + l)).concat(END).join('\n');
      const pg = renderDoc(html);
      return { ok: true, result: Object.assign({}, r.result, { html, page: pg.title, blocks: pg.blocks }) };
    },
    hint: (lv, st) => {
      if (lv !== 2) return { text: C.t5.hints[lv - 1] };
      const r = checkArticle(st.code);
      // Тегов ещё нет совсем — подсказываем начало статьи, а не «проверь пары».
      const cat = r.ok ? 'tag' : r.cat === 'tag' && !articleOf(st.code).bl.length ? 'h2' : (r.cat || 'tag');
      return { text: C.t5.hint2[cat] || C.t5.hints[1] };
    },
    fx: (rec) => (rec.solved ? null : { led: rec.hint >= 3 }),
    aids: (rec, st) => <Checklist items={items(st.code)} />,
    h3: () => <CodeSample code={'<h2>' + pick(TXT.workshop) + '</h2>\n<p>' + pick(TXT.workText) + '</p>'} />,
    drill: { make: () => ({
      order: C.t5.drill,
      spec: { kind: 'block', before: frame(top, ['    <h2>' + pick(TXT.workshop) + '</h2>']), after: END, ind: 4 },
      init: () => ({ code: '' }),
      check: (st) => {
        const a = articleOf(st.code);
        if (!a.r.ok) return fragFail(a.r);
        if (!a.p) return fb('needP');
        if (!a.em) return fb('needEm');
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
// ХУК — стенгазета целая; одно касание «Печать»: вырезки выцветают и косятся,
// с них слетают клочки (stop-motion, шорох). Потом Коди называет задачу.
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
  const print = () => {
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
            <button type="button" className={'kz-btn is-coral pp-wind' + (led ? ' is-led' : '')} disabled={!canTap} onClick={print}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />
              </svg>
              {pick(UI.print)}
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

// ВЫВОД — газета горит, своя статья и её код, что ученик теперь умеет, следующий урок.
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

// Артефакт практики — страница со своей статьёй, как её написал ученик.
function practiceArtifact(store) {
  const r = (store.get('t5') || {}).result;
  if (!r) return null;
  return { type: 'html-page', title: r.title, text: r.text, html: r.html };
}

export default function HtmlPractice02({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
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
