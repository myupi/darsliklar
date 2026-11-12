// =============================================================================
// ЭКРАНЫ УРОКА 8 МОДУЛЯ «ИИ» «Финальный ИИ-проект» (12.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx,
// правки (второй промпт) — tools/ai7/ai7-fix.jsx.
// =============================================================================

const K7 = ['what', 'why', 'who', 'inside', 'look', 'beh', 'rules'];
const missRow = (qi, on) => ({ q: FORMULA[qi], t: MISS, on: !!on, cls: 'is-task is-miss', body: <span className="a1-later">…</span> });
const digits = (x) => String(x || '').replace(/\D/g, '');
const phoneIs = (r, want) => !!(r && r.must.phone && r.must.phone.v && digits(r.must.phone.v).slice(-9) === digits(want).slice(-9));
// Строки сайта фестиваля до станции i: ответ ученика со станции или образец.
const useFest = () => {
  const pick = usePick();
  const store = useStore();
  return (i) => { const o = {}; K7.slice(0, i).forEach((k, j) => { const s = store.get('pr_st' + (j + 1)); o[k] = s && s[k] ? s[k] : pick(FEST[k]); }); return o; };
};
const stEyebrow = (i) => fillL(STATION, { n: String(i + 1), q: FORMULA[i] });
// Строки второго промпта (как в уроке 7).
const p1Text = (P) => K7.map((k) => String(P[k] || '').trim()).filter(Boolean).join(' · ');
const pRow = (text, n) => ({ t: text, q: P_LBL(n), on: true, cls: 'is-task is-p' + (n === 1 ? ' is-p1' : ''), body: <span className="a1-val">{text}</span> });
const pField = (T, n, ph, max) => ({ q: P_LBL(n), on: true, cls: 'is-task is-p', body: <PromptSlot value={T.vals[0]} onChange={(x) => T.setVal(0, x)} onEnter={T.send} ph={ph} max={max || 160} led={T.led} /> });
const fixIssue = (t, f) => (!t || !f ? M8.fixEmpty : f.vague ? M8.vague : f.none ? M8.none : null);
const tailIssue = (f) => (f.guess.length ? M8.guess : !f.keep ? M8.keep : null);
// Сайт Коди из одной строки: всё остальное — догадки ИИ.
const KODI_PINS = [{ sel: '.badge', q: TAXMIN, cls: 'is-guess' }, { sel: '.sub', q: TAXMIN, cls: 'is-guess' }, { sel: '.ch', q: TAXMIN, cls: 'is-guess', top: true }];

// =============================================================================
// S1. КРЮЧОК — одна строка «festival sayti» → чужой фестиваль, «Taxmin». Загадка: главную работу делает ИИ.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ph, setPh] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken) && ph === 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap, 0);
  const send = () => {
    if (!canTap) return;
    sfx('pop', true); setPh(1);
    setTimeout(() => { setPh(2); put({ done: true }); sfx('soft', true); sayNow(c.magic, 'embarrassed'); say(c.done, 'think'); }, AI_MS());
  };
  const site = aiSite(pick, { what: pick(KODI_LINE) });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ph === 2 ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a8-sheet">
        <KzAsk text={ph === 2 ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <div className="a1-in" key={ph === 2 ? 'seen' : 'card'}><TaskCard c={{ card: ph === 2 ? c.seen : c.card }} /></div>
            <PromptEditor rows={[txtRow(pick(KODI_LINE), 0)]} later={1} send={ph < 2 ? (
              <button type="button" className="a1-send is-ready" disabled={!canTap} onClick={send}>
                <span>{pick(ph === 1 ? UI.thinking : UI.send)}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <Led on={led} />
              </button>) : null} />
          </div>
          <div className="kz-col a1-right">{ph < 2 ? <div className={'a1-empty' + (ph === 1 ? ' is-busy' : '')}>{ph === 1 ? <span className="a1-gen a1-gen-in"><i className="a1-aidot">✦</i>{pick(UI.gen)}<span className="a1-typing"><i /><i /><i /></span></span> : pick(C.s1.card.h) + ' · ' + pick(KODI_LINE)}</div> : <AiBrowser site={site} pins={KODI_PINS} />}</div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// MAP. ПОКАЗ — семь вопросов формулы загораются по очереди (пустые строки промпта), рядом — сайт Коди из одной строки.
// =============================================================================
function MapShow({ p }) {
  const pick = usePick();
  const c = C.map;
  const [rec, put] = useRec('map');
  const solved = !!(rec && rec.done);
  const [k, setK] = useState(solved ? 7 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(...c.says.map((t, i) => [
    { act: () => { sfx('pop', true); setK(i + 1); }, wait: 400 },
    { say: [{ text: t, pose: i % 2 ? 'wonder' : 'point' }] }]),
  [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const rows = K7.map((x, j) => Object.assign(missRow(j, j < k), j === k - 1 && !demo.done && !solved ? { cls: 'is-task is-miss a8-now' } : {}));
  const askText = solved || demo.done ? c.askDone : c.asks[k];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a8-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left"><PromptEditor rows={rows} /></div>
          <div className="kz-col a1-right"><AiBrowser site={aiSite(pick, { what: pick(KODI_LINE) })} pins={KODI_PINS} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// СТАНЦИЯ «НАПИШИ СТРОКУ» i (0…6): прежние строки готовы, эта — поле, дальше — пустые. Сайт — как в уроке i+1.
// =============================================================================
function StWrite({ p, i, check, demo, init }) {
  const pick = usePick();
  const c = C['st' + (i + 1)];
  const key = K7[i];
  const fest = useFest();
  const prev = fest(i);
  const T = usePromptTask('st' + (i + 1), c, [init || ''], (pr) => check(pr[key]), null, [key]);
  const site = aiSite(pick, T.sent ? Object.assign({}, prev, T.sent) : i === 0 ? { what: pick(KODI_LINE) } : prev);
  const rows = K7.map((k, j) => (j < i ? txtRow(prev[k], j) : j === i ? fieldRow(T, 0, i, c.ph, 120, !!init) : missRow(j)));
  const pins = T.sent ? pinsOf(site, i === 0, i === 1, i === 2, i === 3, i === 4, i === 5) : i === 0 ? KODI_PINS : null;
  return (
    <StageB voiceTop eyebrow={stEyebrow(i)} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet a8-sheet">
        <KzAsk text={T.solved ? c.ok : c.ask} hint={T.solved ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <TaskCard c={c} />
            <PromptEditor rows={rows} send={!T.solved ? <SendBtn T={T} /> : null} />
            {!T.solved && T.lad.lv >= 3 ? <HelpCode code={pick(FEST[key])} /> : null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={pins} busy={T.busy} demo={!!(demo && T.sent)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// СТАНЦИЯ «ВЫБЕРИ СТРОКУ» i: три варианта, выбранный сразу встаёт в промпт, ИИ пишет сайт по нему.
function StPick({ p, i }) {
  const pick = usePick();
  const c = C['st' + (i + 1)];
  const id = 'st' + (i + 1);
  const key = K7[i];
  const fest = useFest();
  const prev = fest(i);
  const R = useRounds(id, c, c.items, (it) => it.right, (it) => it.why, (it) => pick(it[it.right]));
  const it = R.it;
  const chosen = R.ok ? it.right : R.off.length ? R.off[R.off.length - 1] : null;
  const pr = chosen ? Object.assign({}, prev, { [key]: pick(it[chosen]) }) : prev;
  const site = aiSite(pick, pr);
  // Следующие вопросы — полосой меток внизу поля (три варианта под полем, на телефоне места мало).
  const rows = K7.slice(0, i + 1).map((k, j) => (j < i ? txtRow(prev[k], j) : chosen ? txtRow(pick(it[chosen]), j) : missRow(j, true)));
  return (
    <StageB voiceTop eyebrow={stEyebrow(i)} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="a1-sheet a8-sheet a8-pick">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <TaskCard c={c} />
            <PromptEditor rows={rows} later={i + 1} />
            <div className="a8-opts">
              {['a', 'b', 'c'].map((v) => (
                <button key={v} type="button" data-v={v} disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)}
                  className={'kz-btn a1-opt a8-opt ' + (R.ok && v === it.right ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && v === it.right && !R.ok ? ' is-led' : '')}>
                  <b>{v.toUpperCase()}</b><span>{pick(it[v])}</span><Led on={R.led && !R.ok && R.off.length === 0 && v === 'a'} />
                </button>
              ))}
            </div>
          </div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={chosen ? pinsOf(site, i === 0, i === 1, i === 2, i === 3, i === 4, i === 5) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
const ST1 = ({ p }) => { const pick = usePick(); const c = C.st1; return <StWrite p={p} i={0} init={pick(KODI_LINE)} check={(v) => (!v ? M8.empty : /robot|робот/i.test(v) && /festival|фестивал/i.test(v) ? null : c.msgs.robot)} />; };
const ST2 = ({ p }) => <StPick p={p} i={1} />;
const ST3 = ({ p }) => {
  const c = C.st3;
  return <StWrite p={p} i={2} check={(v) => {
    if (!v) return M8.empty;
    const a = audOf(v);
    if (!a || a.key === 'all' || a.key === 'gen') return c.msgs.all;
    if (!a.age) return c.msgs.age;
    return a.key === 'parents' || a.also === 'parents' ? null : c.msgs.par;
  }} />;
};
const ST4 = ({ p }) => {
  const c = C.st4;
  return <StWrite p={p} i={3} check={(v) => {
    if (!v) return M8.empty;
    const ins = insOf(v);
    if (!ins || !ins.blocks.length) return c.msgs.none;
    const hasB = (k) => ins.blocks.some((b) => b.k === k);
    return !hasB('schedule') ? c.msgs.schedule : !hasB('gallery') ? c.msgs.gallery : !hasB('contact') ? c.msgs.contact : null;
  }} />;
};
const ST5 = ({ p }) => <StPick p={p} i={4} />;
const ST6 = ({ p }) => {
  const c = C.st6;
  return <StWrite p={p} i={5} demo check={(v) => {
    if (!v) return M8.empty;
    const b = behOf(v);
    if (!b || b.vague || b.chaos || b.none) return c.msgs.vague;
    if (!b.hover) return c.msgs.hover;
    return b.hover.fx.indexOf('grow') >= 0 && !b.hover.guess ? null : c.msgs.grow;
  }} />;
};
const ST7 = ({ p }) => {
  const c = C.st7;
  return <StWrite p={p} i={6} check={(v) => {
    const r = rulesOf(v);
    if (!r) return c.msgs.empty;
    if (r.vague || r.none) return c.msgs.vague;
    if (!phoneIs(r, '+998 90 250 25 25')) return c.msgs.phone;
    return !r.no.popup ? c.msgs.popup : !r.no.sale ? c.msgs.sale : null;
  }} />;
};

// =============================================================================
// BIG. ПОКАЗ — одна строка Коди → полный промпт ученика: строки печатаются по очереди, сайт растёт, метки — у нового.
// =============================================================================
function BigShow({ p }) {
  const pick = usePick();
  const c = C.big;
  const fest = useFest();
  const all = fest(7);
  const upto = [[], ['what', 'why'], ['what', 'why', 'who', 'inside'], ['what', 'why', 'who', 'inside', 'look', 'beh'], K7];
  const steps = upto.map((ks, si) => {
    const pr = si === 0 ? { what: pick(KODI_LINE) } : {};
    ks.forEach((k) => { pr[k] = all[k]; });
    const isNew = (k) => si > 0 && upto[si].indexOf(k) >= 0 && upto[si - 1].indexOf(k) < 0;
    return { pr, rows: () => K7.map((k, j) => (pr[k] !== undefined ? txtRow(pr[k], j) : missRow(j))),
      pins: si === 0 ? false : undefined, pinWhat: isNew('what'), pinWhy: isNew('why'), pinWho: isNew('who'), pinIn: isNew('inside'), pinLook: isNew('look'), pinBeh: isNew('beh'), demo: false };
  });
  return <AiShow p={p} c={c} id="big" steps={steps} />;
}

// =============================================================================
// ПРАВКА: первый промпт строкой «1-prompt», поле «2-prompt» → «Yuborish» → ИИ правит сайт (урок 7).
// =============================================================================
function FixTask({ p, c, id, P, check, pose }) {
  const pick = usePick();
  const T = usePromptTask(id, c, [''], (x) => check(x.fix, fixOf(x.fix)), pose, ['fix']);
  const site = fixSite(pick, P, T.sent ? [T.sent.fix] : []);
  const pins = T.sent ? fixPins(site) : null;
  const rows = [pRow(p1Text(P), 1), T.solved || T.busy ? pRow(T.vals[0], 2) : pField(T, 2, c.ph, 200)];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet a8-sheet">
        <KzAsk text={T.solved ? c.ok : c.ask} hint={T.solved ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            {c.card ? <TaskCard c={c} /> : null}
            <PromptEditor rows={rows} send={!T.solved ? <SendBtn T={T} /> : null} />
            {!T.solved && T.lad.lv >= 3 && c.sample ? <HelpCode code={pick(c.sample)} /> : null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={pins} busy={T.busy} focus={pins && pins.length ? fixFocus(site) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// ST8. ВТОРОЙ ПРОМПТ — фестиваль: блок вопросов и ответов, остальное не меняй.
function ST8({ p }) {
  const c = C.st8;
  const fest = useFest();
  return <FixTask p={p} c={c} id="st8" P={fest(7)} check={(t, f) => fixIssue(t, f) || (fxHas(f, 'add', 'faq') ? null : c.msgs.faq) || tailIssue(f)} />;
}
// WHICH. ЗАКРЕПЛЕНИЕ — на какой вопрос формулы отвечает строка.
function Which({ p }) {
  const pick = usePick();
  const c = C.which;
  return <RoundsScreen p={p} c={c} id="which" keyOf={(it) => it.right} ansOf={(it) => pick(FORMULA[it.right])}
    opts={(it) => it.opts} optLabel={(v) => pick(FORMULA[v])}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// DET. ДЕТЕКТИВ — у сайта фестиваля выпала одна строка: какая?
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const full = {};
  K7.forEach((k) => { full[k] = pick(FEST[k]); });
  return <RoundsScreen p={p} c={c} id="det" keyOf={(it) => it.right} ansOf={(it) => pick(FORMULA[it.right])}
    opts={(it) => it.opts} optLabel={(v) => pick(FORMULA[v])}
    body={(it) => {
      const site = aiSite(pick, Object.assign({}, full, { [it.miss]: '' }));
      return (
        <div className="a1-which">
          <div className="a1-which-site"><AiBrowser site={site} small pins={rulePins(site)} /></div>
          <div className="a1-which-list">
            <span className="a1-qh">{pick(c.qWhich)}</span>
            <div className="a1-card a8-order"><span className="a1-card-t">{pick(c.order)}</span></div>
          </div>
        </div>
      );
    }} />;
}
// OWN. СВОЙ САЙТ — все семь строк.
function Own({ p }) {
  const c = C.own;
  const T = usePromptTask('own', c, ['', '', '', '', '', '', ''], (pr) => {
    if (!pr.what) return c.msgs.noWhat;
    if (!has(pr.what, RE_KIND) && pr.what.split(/\s+/).length < 2) return c.msgs.kind;
    if (!pr.why) return c.msgs.noWhy;
    if (!anyGoal(pr.why)) return c.msgs.goal;
    if (!pr.who) return c.msgs.noWho;
    const a = audOf(pr.who);
    if (a.key === 'all' || a.key === 'gen') return c.msgs.who;
    if (!pr.inside) return c.msgs.noIn;
    if (!insOf(pr.inside).blocks.length) return c.msgs.inNone;
    if (!pr.look) return c.msgs.noLook;
    const lk = lookOf(pr.look);
    if (lk.vague || lk.none) return c.msgs.look;
    if (!pr.beh) return c.msgs.noBeh;
    const b = behOf(pr.beh);
    if (b.vague || b.chaos || b.none) return c.msgs.beh;
    if (!pr.rules) return c.msgs.noRules;
    const r = rulesOf(pr.rules);
    return r.vague || r.none ? c.msgs.rules : null;
  }, 'point', K7);
  return <TaskScreen p={p} c={c} T={T} rows={[fieldRow(T, 0, 0, c.phWhat, 60), fieldRow(T, 1, 1, c.phWhy, 90), fieldRow(T, 2, 2, c.phWho, 90), fieldRow(T, 3, 3, c.phIn, 120), fieldRow(T, 4, 4, c.phLook, 120), fieldRow(T, 5, 5, c.phBeh, 160), fieldRow(T, 6, 6, c.phRules, 200)]} later={7} />;
}
// Свой сайт ученика (или образец, если экран пропущен).
const useOwn = () => {
  const pick = usePick();
  const store = useStore();
  const own = store.get('pr_own');
  if (own && own.what) return own;
  const o = {};
  pick(C.own.sample).split(' · ').forEach((x, j) => { o[K7[j]] = x; });
  return o;
};
// OWNFIX. ВТОРОЙ ПРОМПТ К СВОЕМУ САЙТУ.
function OwnFix({ p }) {
  const c = C.ownfix;
  const own = useOwn();
  return <FixTask p={p} c={c} id="ownfix" P={own} pose="point" check={(t, f) => fixIssue(t, f) || tailIssue(f)} />;
}
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз модуля.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// Промпт одной строкой — для домашки: семь строк и второй промпт.
const promptAll = (pick, pr, fix) => {
  const t = (x) => String(x || '').trim().replace(/[.!]+$/, '');
  const one = pick(fillL(L3("{a}. Uning maqsadi: {b}. Sayt {c} uchun. Saytda bo'lsin: {d}. Ko'rinishi: {e}. Qanday ishlaydi: {f}. Qoidalar: {g}.", '{a}. Его цель: {b}. Сайт для: {c}. На сайте: {d}. Вид: {e}. Поведение: {f}. Правила: {g}.', '{a}. Its goal: {b}. It’s for {c}. On the site: {d}. Look: {e}. Behaviour: {f}. Rules: {g}.'),
    { a: capS(pr.what), b: t(pr.why), c: t(pr.who), d: t(pr.inside), e: t(pr.look), f: t(pr.beh), g: t(pr.rules) }));
  return fix ? one + '\n\n' + fix : one;
};
// FIN. ВЫВОД — разгадка: главную работу делает человек; свой промпт, правка и сайт; конец модуля.
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = useOwn();
  const fx = store.get('pr_ownfix');
  const fix = fx && fx.fix ? fx.fix : null;
  const site = fixSite(pick, own, fix ? [fix] : []);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(promptAll(pick, own, fix)); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a8-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={[pRow(p1Text(own), 1)].concat(fix ? [pRow(fix, 2)] : [])} />
            <div className="kz-roles">
              {['think', 'write', 'check', 'fix'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}><i aria-hidden="true" /><span><b>{pick(c.roleH[k])}</b> — {pick(c.roles[k])}</span></span>
              ))}
            </div>
            <div className="a1-hw">
              <span className="a1-hw-h">{pick(UI.hw)}</span>
              <span className="a1-hw-t">{pick(c.hw)}</span>
              <button type="button" className="kz-btn is-ghost a1-copy" onClick={copy}>{pick(copied ? UI.copied : UI.copy)}</button>
            </div>
          </div>
          <div className="kz-col a1-right">
            <AiBrowser site={site} pins={fix ? fixPins(site) : pinsOf(site, false, false, false, false, false, false)} />
            <div className="kz-next a8-done"><Icon name="doc" size={18} /><span><b>{pick(UI.modDone)}</b></span></div>
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
  { id: 'map', code: 'SHOW', Comp: MapShow },
  { id: 'st1', code: 'LEVEL-1', Comp: ST1 }, { id: 'st2', code: 'CHECK-1', Comp: ST2 }, { id: 'st3', code: 'LEVEL-2', Comp: ST3 },
  { id: 'st4', code: 'LEVEL-3', Comp: ST4 }, { id: 'st5', code: 'CHECK-2', Comp: ST5 }, { id: 'st6', code: 'LEVEL-4', Comp: ST6 },
  { id: 'st7', code: 'LEVEL-5', Comp: ST7 },
  { id: 'big', code: 'SHOW', Comp: BigShow }, { id: 'st8', code: 'LEVEL-6', Comp: ST8 },
  { id: 'which', code: 'CHECK-3', Comp: Which }, { id: 'det', code: 'CHECK-4', Comp: Det },
  { id: 'own', code: 'LEVEL-W', Comp: Own }, { id: 'ownfix', code: 'LEVEL-X', Comp: OwnFix },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; строки ученика (pr_st1…, pr_own, pr_ownfix) остаются.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

function lessonAi8Artifact(store) {
  const own = store.get('pr_own'), fx = store.get('pr_ownfix');
  return own ? { type: 'ai-final', what: own.what, why: own.why, who: own.who, inside: own.inside, look: own.look, beh: own.beh, rules: own.rules, fix: fx ? fx.fix : null } : null;
}

export default function AiFinalProject({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi8Artifact(store) })
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
