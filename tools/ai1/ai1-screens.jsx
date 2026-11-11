// =============================================================================
// ЭКРАНЫ УРОКА 1 МОДУЛЯ «ИИ» «Что создаём и зачем?» (11.11.2026). Облик — «промпт в редакторе» (ai1-kit.jsx),
// страница — честный браузер урока 17 CSS (c17-engine.jsx). Тройки «показ → сам → закрепление» по «Nima?» и «Nega?»,
// потом «думать промптом»: какой промпт дал сайт, чего не хватает, починить промпт Коди, промпт с нуля, свой сайт.
// =============================================================================

// ── ЗАДАНИЕ «НАПИШИ СТРОКИ ПРОМПТА»: поля в строках редактора → «Yuborish» → ИИ пишет сайт → проверка ──
function usePromptTask(id, c, init, issueOf, pose) {
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const saved = store.get('pr_' + id);
  const [vals, setVals] = useState(saved ? [saved.what, saved.why] : init.slice());
  const [sent, setSent] = useState(solved && saved ? saved : null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : (pose || 'explain') }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !busy && !sent, 0);
  const setVal = (i, x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); };
  const send = () => {
    if (!canTap || solved || busy) return;
    st.current.tries += 1;
    const pr = { what: noSemi(vals[0]), why: noSemi(vals[1]) };
    const issue = issueOf(pr);
    // Промпт уходит ИИ в любом случае — ученик видит, что вышло; проверка говорит, чего не хватает.
    sfx('pop', true); setMsg(null); setBusy(true);
    setTimeout(() => {
      setBusy(false); setSent(pr);
      if (issue) {
        st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
        if (st.current.misses >= 2) lad.bump();
        return;
      }
      sfx('win', true); store.set('pr_' + id, pr); put({ done: true });
      log({ screenId: id, type: 'write-prompt', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, what: pr.what, why: pr.why });
      sayNow(c.ok, 'cheer');
    }, AI_MS());
  };
  return { vals, setVal, sent, busy, msg, setMsg, send, lad, speaker, canTap, canGo, led, solved, sayNow };
}
// Строка промпта: поле, пока задание не решено; потом — текст.
const fieldRow = (T, i, qi, ph, max, hl) => (T.solved || T.busy
  ? txtRow(T.vals[i], qi)
  : { q: FORMULA[qi], on: true, cls: 'is-task' + (hl ? ' is-hl' : ''), body: <PromptSlot value={T.vals[i]} onChange={(x) => T.setVal(i, x)} onEnter={T.send} ph={ph} max={max} led={T.led && i === 0} /> });
// Кнопка «Yuborish» — внутри поля промпта, справа внизу (как в ИИ-приложениях).
function SendBtn({ T }) {
  const pick = usePick();
  return (
    <button type="button" className={'a1-send' + (T.vals.every((x) => String(x || '').trim()) ? ' is-ready' : '')} disabled={!T.canTap || T.busy} onClick={T.send}>
      <span>{pick(T.busy ? UI.thinking : UI.send)}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
// Экран-задание: редактор с полями + окно сайта.
function TaskScreen({ p, c, T, rows, later, extra, before }) {
  const pick = usePick();
  const site = aiSite(pick, T.sent || null);
  const shown = T.sent ? site : aiSite(pick, before || null);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={T.solved ? c.ok : c.ask} hint={T.solved ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            {c.card ? <TaskCard c={c} /> : null}
            <PromptEditor rows={rows} later={later} send={!T.solved && !extra ? <SendBtn T={T} /> : null} />
            {!T.solved && T.lad.lv >= 3 && c.sample ? <HelpCode code={pick(c.sample)} /> : null}
            {extra || null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={shown} pins={T.sent ? pinsOf(site) : null} busy={T.busy} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// Заказ: что хочет «заказчик» (Коди, кружок, кафе) — карточка над редактором.
function TaskCard({ c }) {
  const pick = usePick();
  return <div className="a1-card"><span className="a1-card-h">{pick(c.card.h)}</span><span className="a1-card-t">{pick(c.card.t)}</span></div>;
}

// ── ПОКАЗ: шаги промптов, сайт меняется сам под речь Коди; помощь 1-2-3 по лампочке ──
function AiShow({ p, c, id, steps }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const last = steps.length - 1;
  const [n, setN] = useState(solved ? last : 0);     // шаг сайта
  const [pn, setPn] = useState(solved ? last : 0);   // шаг промпта: сначала меняется промпт (со вспышкой), потом ИИ пишет сайт
  const [busy, setBusy] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const typeOf = (i) => {
    const ta = steps[i].rows(pick).map((r) => r.t), tb = steps[i + 1].rows(pick).map((r) => r.t);
    return Math.max(0, ...tb.map((t, j) => (t != null && ta[j] != null && t !== ta[j] ? typeMs(String(ta[j]), String(t)) : 0)));
  };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(...c.says.map((t, i) => [
    // Сначала промпт стирается и печатается заново, потом ИИ пишет сайт; Коди говорит, когда новый сайт уже виден.
    { act: () => {
      sfx('pop', true); setPn(i + 1);
      setTimeout(() => { setBusy(true); setTimeout(() => { setBusy(false); setN(i + 1); }, AI_MS()); }, typeOf(i) + (reduceMotion() ? 100 : 350));
    }, wait: typeOf(i) + (reduceMotion() ? 100 : 350) + AI_MS() + 400 },
    { say: [{ text: t, pose: i % 2 ? 'wonder' : 'point' }] }]),
  [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const s = steps[n];
  const site = aiSite(pick, s.pr);
  const askText = solved || demo.done ? c.askDone : c.asks[n];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left"><PromptEditor rows={steps[pn].rows(pick)} /></div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={s.pins === false || !s.pr ? null : pinsOf(site, s.pinWhat)} busy={busy} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ── ВЫБОР ПО РАУНДАМ (engine useRounds): карточка + варианты ──
function RoundsScreen({ p, c, id, keyOf, ansOf, body, opts, optLabel }) {
  const pick = usePick();
  const R = useRounds(id, c, c.items, keyOf, (it) => it.why, ansOf);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col a1-rounds a1-in" key={'i' + R.ii}>
          <div className="kz-col">
            {body(R.it, R)}
            <div className={'kz-pick a1-opts a1-opts-' + opts(R.it).length}>
              {opts(R.it).map((v) => (
                <button key={v} type="button" data-v={v} disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)}
                  className={'kz-btn a1-opt ' + (R.ok && v === keyOf(R.it) ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && v === keyOf(R.it) && !R.ok ? ' is-led' : '')}>
                  <span>{optLabel(v, R.it)}</span><Led on={R.led && !R.ok && R.off.length === 0} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S1. КРЮЧОК — Коди пишет ИИ «Futbol haqida sayt qil» → «Yuborish» (ученик) → скучный сайт ни о чём. Коди хотел
// сайт турнира с записью. Загадка: «ИИ умный — он сам должен был догадаться?»
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ph, setPh] = useState(solved ? 2 : 0);   // 0 — промпт Коди, 1 — ИИ пишет, 2 — сайт готов
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken) && ph === 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap, 0);
  const send = () => {
    if (!canTap) return;
    sfx('pop', true); setPh(1);
    setTimeout(() => { setPh(2); put({ done: true }); sfx('soft', true); sayNow(c.magic, 'embarrassed'); say(c.done, 'think'); }, AI_MS());
  };
  const site = aiSite(pick, ph === 2 ? { what: pick(c.topic), why: '' } : null);
  const rows = [{ cls: 'is-task', body: <span className="a1-val">{pick(c.vague)}</span> }];
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ph === 2 ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={ph === 2 ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={rows} send={ph < 2 ? (
              <button type="button" className="a1-send is-ready" disabled={!canTap} onClick={send}>
                <span>{pick(ph === 1 ? UI.thinking : UI.send)}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <Led on={led} />
              </button>) : null} />
            {ph === 2 ? <div className="a1-in a1-wanted"><TaskCard c={{ card: c.wanted }} /></div> : null}
          </div>
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(c.empty)}</div> : <AiBrowser site={site} />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S2. ПОКАЗ «Nima?» — одна тема «futbol», разные продукты: турнир, клуб, магазин — разные сайты.
const SHOW_NIMA = (c) => [
  { pr: { what: c.p0, why: '' }, rows: (pick) => [txtRow(pick(c.p0), 0)], pins: false },
  { pr: { what: c.p1, why: '' }, rows: (pick) => [txtRow(pick(c.p1), 0)], pinWhat: true },
  { pr: { what: c.p2, why: '' }, rows: (pick) => [txtRow(pick(c.p2), 0)], pinWhat: true },
  { pr: { what: c.p3, why: '' }, rows: (pick) => [txtRow(pick(c.p3), 0)], pinWhat: true }
];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const steps = SHOW_NIMA(c).map((s) => Object.assign({}, s, { pr: { what: pick(s.pr.what), why: '' } }));
  return <AiShow p={p} c={c} id="s2" steps={steps} />;
}
// S3. САМ «Nima?» — заказ: сайт шахматного кружка → строка «Nima?».
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const T = usePromptTask('s3', c, ['', pick(c.why)], (pr) => {
    if (!pr.what) return c.msgs.empty;
    if (!has(pr.what, /shaxmat|chess|шахмат/)) return c.msgs.topic;
    if (!has(pr.what, RE_KIND)) return c.msgs.kind;
    if (!has(pr.what, /to'gara|togara|klub|кружок|кружк|клуб|club/)) return c.msgs.other;
    return null;
  });
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.ph, 60), txtRow(T.vals[1], 1)]} before={{ what: '', why: T.vals[1] }} />;
}
// S4. ЗАКРЕПЛЕНИЕ — какой промпт точнее (тема или продукт).
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S5. ПОКАЗ «Nega?» — один продукт, разные цели: рассказать → блок; записаться → кнопка; позвонить → другая кнопка.
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const w = pick(c.what);
  const steps = [c.g0, c.g1, c.g2, c.g3].map((g, i) => ({ pr: { what: w, why: g ? pick(g) : '' }, rows: (pk) => [txtRow(w, 0), g ? txtRow(pk(g), 1) : { q: FORMULA[1], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> }], pinWhat: false, pins: i === 0 ? false : undefined }));
  return <AiShow p={p} c={c} id="s5" steps={steps} />;
}
// S6. САМ «Nega?» — кружок хочет, чтобы дети записывались → строка «Nega?».
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const T = usePromptTask('s6', c, [pick(c.what), ''], (pr) => {
    if (!pr.why) return c.msgs.empty;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!has(pr.why, RE_JOIN)) return anyGoal(pr.why) ? c.msgs.other : c.msgs.vague;
    return null;
  });
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), fieldRow(T, 1, 1, c.ph, 90)]} before={{ what: T.vals[0], why: '' }} />;
}
// S7. ЗАКРЕПЛЕНИЕ — цель или нет (что сайт должен сделать для гостя — или просто пожелание).
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(c.opts[it.right])}
    opts={() => ['goal', 'wish']} optLabel={(v) => pick(c.opts[v])}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>«{pick(it.t)}»</p></div>} />;
}
// S8. САМ (перенос) — пиццерия: гости должны заказывать → цель сама ставит кнопку «Buyurtma berish».
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const T = usePromptTask('s8', c, [pick(c.what), ''], (pr) => {
    if (!pr.why) return c.msgs.empty;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!has(pr.why, RE_ORDER)) return anyGoal(pr.why) ? c.msgs.other : c.msgs.vague;
    return null;
  });
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), fieldRow(T, 1, 1, c.ph, 90)]} before={{ what: T.vals[0], why: '' }} />;
}
// S9. ПОКАЗ «каждая строка оставляет след»: обе строки → сайт с метками; убрать «Nega?» — кнопка исчезла;
// убрать «Nima?» — у сайта нет имени.
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const w = pick(c.what), g = pick(c.why);
  const miss = (qi) => ({ q: FORMULA[qi], t: MISS, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
  const steps = [
    { pr: { what: w, why: g }, rows: () => [txtRow(w, 0), txtRow(g, 1)], pins: false },
    { pr: { what: w, why: g }, rows: () => [txtRow(w, 0), txtRow(g, 1)] },
    { pr: { what: w, why: '' }, rows: () => [txtRow(w, 0), miss(1)] },
    { pr: { what: '', why: g }, rows: () => [miss(0), txtRow(g, 1)] },
    { pr: { what: w, why: g }, rows: () => [txtRow(w, 0), txtRow(g, 1)] }
  ];
  return <AiShow p={p} c={c} id="s9" steps={steps} />;
}
// S8B. ОДНА СТРОКА — ДВЕ ЦЕЛИ: организатор хочет и рассказать, когда и где турнир, и записать игроков → в «Nega?»
// обе цели; на сайте — и раздел «Qachon va qayerda», и форма записи.
function S8B({ p }) {
  const pick = usePick();
  const c = C.s8b;
  const T = usePromptTask('s8b', c, [pick(c.what), ''], (pr) => {
    if (!pr.why) return c.msgs.empty;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    const tell = has(pr.why, RE_TELL), join = has(pr.why, RE_JOIN);
    if (tell && join) return null;
    if (tell) return c.msgs.noJoin;
    if (join) return c.msgs.noTell;
    return c.msgs.vague;
  });
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), fieldRow(T, 1, 1, c.ph, 120)]} before={{ what: T.vals[0], why: '' }} />;
}
// G1. ИИ УГАДАЛ НЕ ТО: в промпте нет «Nega?», и ИИ сам придумал цель — продавать билеты (метка «Taxmin»), а тренер хочет,
// чтобы ребята записывались в команду → ученик пишет «Nega?», и угадывать ИИ больше не нужно.
function G1({ p }) {
  const pick = usePick();
  const c = C.g1;
  const T = usePromptTask('g1', c, [pick(c.what), ''], (pr) => {
    if (!pr.why) return c.msgs.empty;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (has(pr.why, RE_ORDER)) return c.msgs.guess;
    if (!has(pr.why, RE_JOIN)) return anyGoal(pr.why) ? c.msgs.other : c.msgs.vague;
    return null;
  });
  const guess = aiSite(pick, { what: pick(c.what), why: pick(c.guess) });
  const shown = T.sent ? aiSite(pick, T.sent) : guess;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={T.solved ? c.ok : c.ask} hint={T.solved ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <TaskCard c={c} />
            <PromptEditor rows={[txtRow(T.vals[0], 0), fieldRow(T, 1, 1, c.ph, 90)]} send={!T.solved ? <SendBtn T={T} /> : null} />
            {!T.solved && T.lad.lv >= 3 ? <HelpCode code={pick(c.sample)} /> : null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={shown} busy={T.busy}
            pins={T.sent ? pinsOf(shown) : [{ sel: '.cta', q: c.guessTag, cls: 'is-guess' }, { sel: '.gh', q: c.guessTag, cls: 'is-guess' }]} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// DET. ДЕТЕКТИВ: по сайту понять промпт — раунды «какой промпт дал этот сайт» (A/B/C) и «какой строки не хватает».
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const prRows = (pr) => [pr.what ? txtRow(pick(pr.what), 0) : { q: FORMULA[0], t: MISS, cls: 'is-miss', body: <span className="a1-later">…</span> }, pr.why ? txtRow(pick(pr.why), 1) : { q: FORMULA[1], t: MISS, cls: 'is-miss', body: <span className="a1-later">…</span> }];
  return <RoundsScreen p={p} c={c} id="det" keyOf={(it) => it.right}
    ansOf={(it) => (it.type === 'which' ? it.right.toUpperCase() : pick(FORMULA[it.right === 'what' ? 0 : 1]))}
    opts={(it) => (it.type === 'which' ? ['a', 'b', 'c'] : ['what', 'why'])}
    optLabel={(v, it) => (it.type === 'which' ? v.toUpperCase() : pick(FORMULA[v === 'what' ? 0 : 1]))}
    body={(it) => (it.type === 'which' ? (
      <div className="a1-which">
        <div className="a1-which-site"><AiBrowser site={aiSite(pick, { what: pick(it.site.what), why: pick(it.site.why) })} small /></div>
        <div className="a1-which-list"><span className="a1-qh">{pick(c.qWhich)}</span>{['a', 'b', 'c'].map((v) => <div key={v} className="a1-pr"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(FORMULA[0])}</em>{pick(it[v].what)}</span><span className="a1-pr-l"><em>{pick(FORMULA[1])}</em>{pick(it[v].why)}</span></span></div>)}</div>
      </div>
    ) : (
      <div className="a1-which">
        <div className="a1-which-list">
          <span className="a1-qh">{pick(c.qMiss)}</span>
          <TaskCard c={{ card: { h: c.wantH, t: it.want } }} />
          <PromptEditor rows={prRows(it.pr)} />
        </div>
        <div className="a1-which-site"><AiBrowser site={aiSite(pick, { what: it.pr.what ? pick(it.pr.what) : '', why: it.pr.why ? pick(it.pr.why) : '' })} small /></div>
      </div>
    ))} />;
}
// S12. ИСПРАВЬ промпт Коди: «Robot to'garagi sayti. Chiroyli bo'lsin.» — кружок хочет, чтобы записывались.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const T = usePromptTask('s12', c, [pick(c.what), pick(c.bad)], (pr) => {
    if (!pr.why) return c.msgs.empty;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!has(pr.why, RE_JOIN)) return anyGoal(pr.why) ? c.msgs.other : c.msgs.vague;
    return null;
  }, 'embarrassed');
  return <TaskScreen p={p} c={c} T={T} rows={[txtRow(T.vals[0], 0), fieldRow(T, 1, 1, c.ph, 90, true)]} before={{ what: pick(c.what), why: pick(c.bad) }} />;
}
// S13. С НУЛЯ — выставка книг: рассказать, когда и где, и позвать прийти. Обе строки.
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const T = usePromptTask('s13', c, ['', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, /kitob|book|книг/)) return c.msgs.topic;
    if (!has(pr.what, RE_KIND)) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!(has(pr.why, RE_TELL) || has(pr.why, RE_COME))) return c.msgs.goal;
    return null;
  });
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90)]} />;
}
// S14. СВОЙ САЙТ — своя тема (игра, клуб, праздник…), обе строки, «Tayyor» после результата.
function S14({ p }) {
  const pick = usePick();
  const c = C.s14;
  const T = usePromptTask('s14', c, ['', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND) && pr.what.split(/\s+/).length < 2) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (has(pr.why, RE_PRETTY) && !anyGoal(pr.why)) return c.msgs.pretty;
    if (!anyGoal(pr.why)) return c.msgs.goal;
    return null;
  }, 'point');
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90)]} later />;
}

// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}

// FIN. ВЫВОД — разгадка: ИИ не читает мысли, он делает то, что написано; свой сайт ученика с метками; домашка.
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s14') || { what: pick(C.s2.p1), why: pick(C.s6.sample) };
  const site = aiSite(pick, own);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptLine(pick, own)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={[txtRow(own.what, 0), txtRow(own.why, 1)]} later />
            <div className="kz-roles">
              {['what', 'why'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(FORMULA[k === 'what' ? 0 : 1])}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
            <div className="a1-hw">
              <span className="a1-hw-h">{pick(UI.hw)}</span>
              <span className="a1-hw-t">{pick(c.hw)}</span>
              <button type="button" className="kz-btn is-ghost a1-copy" onClick={copy}>{pick(copied ? UI.copied : UI.copy)}</button>
            </div>
          </div>
          <div className="kz-col a1-right">
            <AiBrowser site={site} pins={pinsOf(site)} />
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 's8', code: 'LEVEL-3', Comp: S8 }, { id: 's8b', code: 'LEVEL-3B', Comp: S8B },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 'g1', code: 'LEVEL-G', Comp: G1 }, { id: 'det', code: 'CHECK-3', Comp: Det },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-W', Comp: S13 }, { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; свой промпт ученика (pr_s14) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

function lessonAi1Artifact(store) {
  const own = store.get('pr_s14');
  return own ? { type: 'ai-prompt', what: own.what, why: own.why } : null;
}

export default function AiWhatWhy({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi1Artifact(store) })
  });
  useParallax();
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
  const go = useKzTransition(cur.id + ':' + R.runN);
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next, 1), prev: R.i > 0 ? go(R.prev, -1) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
