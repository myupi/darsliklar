// =============================================================================
// ЭКРАНЫ УРОКА 7 МОДУЛЯ «ИИ» «Как улучшить результат ИИ?» (12.11.2026). Общие экраны модуля — tools/ai1/ai-common.jsx,
// симулятор второго промпта — ai7-fix.jsx (fixOf, fixSite, fixPins).
// =============================================================================

const K7 = ['what', 'why', 'who', 'inside', 'look', 'beh', 'rules'];
// Первый промпт сайта экрана: строки на языке урока (+ свой CSS первого сайта).
const prL = (pick, pr) => { const o = {}; K7.forEach((k) => { o[k] = pick(pr[k]); }); if (pr.css) o.css = pr.css; return o; };
// Первый промпт — одной строкой «1-prompt» (семь ответов через «·»).
const p1Text = (P) => K7.map((k) => String(P[k] || '').trim()).filter(Boolean).join(' · ');
const pRow = (text, n) => ({ t: text, q: P_LBL(n), on: true, cls: 'is-task is-p' + (n === 1 ? ' is-p1' : ''), body: <span className="a1-val">{text}</span> });
const pMiss = (n) => ({ t: MISS, q: P_LBL(n), on: false, cls: 'is-task is-p is-miss', body: <span className="a1-later">…</span> });
const pField = (T, n, ph, max, hl) => ({ q: P_LBL(n), on: true, cls: 'is-task is-p' + (hl ? ' is-hl' : ''),
  body: <PromptSlot value={T.vals[0]} onChange={(x) => T.setVal(0, x)} onEnter={T.send} ph={ph} max={max || 160} led={T.led} /> });
// Общая проверка правки: пусто, «yaxshiroq qil», ничего не узнано. Догадка и «qolganini o'zgartirma» — в конце проверки экрана.
const fixIssue = (t, f) => (!t || !f ? M7.empty : f.vague ? M7.vague : f.none ? M7.none : null);
const tailIssue = (f) => (f.guess.length ? M7.guess : !f.keep ? M7.keep : null);
const MARK_OK = L3('✓', '✓', '✓');
const MARK_BAD = L3('✗', '✗', '✗');

// ── ЗАКАЗ КЛИЕНТА ПУНКТАМИ: ✓ — есть на сайте, ✗ — нет; в задании пункты нажимаются ──
function Checklist({ items, marks, onTap, sel, lit, disabled }) {
  const pick = usePick();
  return (
    <div className="a7-chk">
      <span className="a1-card-h">{pick(ORDER)}</span>
      {items.map((it, i) => {
        const m = marks[i] || (sel && sel[i] ? 'bad' : null);
        const inner = <><i className="a7-chk-box" aria-hidden="true">{m === 'ok' ? '✓' : m === 'bad' ? '✗' : ''}</i><span className="a7-chk-t">{pick(it.t)}</span>{onTap ? <Led on={!!(lit && lit[i])} /> : null}</>;
        return onTap
          ? <button key={i} type="button" data-i={i} className={'a7-chk-it is-tap' + (m ? ' is-' + m : '')} disabled={disabled} onClick={() => onTap(i)}>{inner}</button>
          : <div key={i} className={'a7-chk-it' + (m ? ' is-' + m : '')}>{inner}</div>;
      })}
    </div>
  );
}
const markPins = (items, marks) => items.map((it, i) => (marks[i] && it.sel ? { sel: it.sel, q: marks[i] === 'ok' ? MARK_OK : MARK_BAD, cls: marks[i] === 'ok' ? 'is-ok7' : 'is-bad7' } : null)).filter(Boolean);

// =============================================================================
// S1. КРЮЧОК — сайт сладостей готов; второй промпт Коди «yaxshiroq qil» → ИИ пишет всё заново, цен нет.
// Загадка: ИИ сам знает, что плохо.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ph, setPh] = useState(solved ? 2 : 0);   // 0 — первый сайт и промпт Коди, 1 — ИИ пишет, 2 — сайт заново
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken) && ph === 0;
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap, 0);
  const send = () => {
    if (!canTap) return;
    sfx('pop', true); setPh(1);
    setTimeout(() => { setPh(2); put({ done: true }); sfx('soft', true); sayNow(c.magic, 'embarrassed'); say(c.done, 'think'); }, AI_MS());
  };
  const P = prL(pick, PR.sweets);
  const site = fixSite(pick, P, ph === 2 ? [pick(c.bad)] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ph === 2 ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a7-sheet">
        <KzAsk text={ph === 2 ? c.askDone : c.ask} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <div className="a1-in" key={ph === 2 ? 'seen' : 'card'}><TaskCard c={{ card: ph === 2 ? c.seen : c.card }} /></div>
            <PromptEditor rows={[pRow(p1Text(P), 1), pRow(pick(c.bad), 2)]} send={ph < 2 ? (
              <button type="button" className="a1-send is-ready" disabled={!canTap} onClick={send}>
                <span>{pick(ph === 1 ? UI.thinking : UI.send)}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <Led on={led} />
              </button>) : null} />
          </div>
          <div className="kz-col a1-right"><AiBrowser site={site} busy={ph === 1} pins={ph === 2 ? fixPins(site) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ анализа — книжный клуб: пункты заказа отмечаются по очереди (✓ есть, ✗ нет), метки — на сайте.
// =============================================================================
function CheckShow({ p, c, id, pr }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const N = c.items.length;
  const [k, setK] = useState(solved ? N : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(...c.says.map((t, i) => [
    { act: () => { sfx(c.items[i].ok ? 'ok' : 'soft', true); setK(i + 1); }, wait: 700 },
    { say: [{ text: t, pose: c.items[i].ok ? 'point' : 'wonder' }] }]),
  [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const marks = c.items.map((it, i) => (i < k ? (it.ok ? 'ok' : 'bad') : null));
  const site = fixSite(pick, prL(pick, pr), []);
  const cur = k > 0 ? c.items[k - 1] : null;
  const askText = solved || demo.done ? c.askDone : c.asks[k];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a7-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left"><Checklist items={c.items} marks={marks} /></div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={markPins(c.items, marks)} focus={cur ? (cur.sel || '.foot') : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
function S2({ p }) { return <CheckShow p={p} c={C.s2} id="s2" pr={PR.book} />; }

// =============================================================================
// S3. САМ — кружок рисования: нажми пункты заказа, которых нет на сайте, потом «Проверить».
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const id = 's3';
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [sel, setSel] = useState(() => c.items.map((it) => solved && !it.ok));
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !sel.some(Boolean), 0);
  const tap = (i) => { if (!canTap || solved) return; sfx('tap', true); setSel(sel.map((x, j) => (j === i ? !x : x))); setMsg(null); };
  const check = () => {
    if (!canTap || solved) return;
    st.current.tries += 1;
    const wrongOk = c.items.findIndex((it, i) => sel[i] && it.ok);
    const missed = c.items.findIndex((it, i) => !sel[i] && !it.ok);
    const issue = !sel.some(Boolean) ? c.msgs.none : wrongOk >= 0 ? c.items[wrongOk].why : missed >= 0 ? joinL(c.msgs.more, c.items[missed].why) : null;
    if (issue) {
      st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
      if (st.current.misses >= 2) lad.bump();
      return;
    }
    sfx('win', true); put({ done: true }); setMsg(null);
    log({ screenId: id, type: 'analyze', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const marks = solved ? c.items.map((it) => (it.ok ? 'ok' : 'bad')) : c.items.map(() => null);
  const lit = c.items.map((it, i) => (lad.lv >= 3 ? !it.ok && !sel[i] : i === 0 && led));
  const site = fixSite(pick, prL(pick, PR.art), []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a7-sheet">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <Checklist items={c.items} marks={marks} sel={solved ? null : sel} onTap={solved ? null : tap} lit={solved ? null : lit} disabled={!canTap} />
            {!solved ? <button type="button" className="kz-btn a7-chk-go" disabled={!canTap || !sel.some(Boolean)} onClick={check}>{pick(UI.check)}</button> : null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={solved ? markPins(c.items.map((it, i) => Object.assign({}, it, { sel: i === 0 ? '.bh0' : i === 2 ? '.info' : i === 3 ? '.cta' : null })), marks) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// S4. ЗАКРЕПЛЕНИЕ — какое наблюдение точнее.
function S4({ p }) {
  const pick = usePick();
  const c = C.s4;
  return <RoundsScreen p={p} c={c} id="s4" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}

// =============================================================================
// ПОКАЗ ПРАВОК: строки «2-prompt» («3-prompt») печатаются заново, ИИ пишет сайт, Коди говорит, когда сайт уже виден.
// steps — правки по шагам (L3), slots — сколько строк правок в поле.
// =============================================================================
function FixShow({ p, c, id, pr, steps, slots }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const last = steps.length - 1;
  const [n, setN] = useState(solved ? last : 0);
  const [pn, setPn] = useState(solved ? last : 0);
  const [busy, setBusy] = useState(false);
  const P = prL(pick, pr);
  const fx = steps.map((s) => s.map((x) => pick(x)));
  const rowsOf = (i) => [pRow(p1Text(P), 1)].concat(Array.from({ length: slots }, (_, j) => (fx[i][j] ? pRow(fx[i][j], j + 2) : pMiss(j + 2))));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const typeOf = (i) => {
    const ta = rowsOf(i).map((r) => r.t), tb = rowsOf(i + 1).map((r) => r.t);
    return Math.max(0, ...tb.map((t, j) => (t != null && ta[j] != null && t !== ta[j] ? typeMs(String(ta[j]), String(t)) : 0)));
  };
  const lead = (i) => typeOf(i) + (reduceMotion() ? 100 : 350);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [].concat(...c.says.map((t, i) => [
    { act: () => {
      sfx('pop', true); setPn(i + 1);
      setTimeout(() => { setBusy(true); setTimeout(() => { setBusy(false); setN(i + 1); }, AI_MS()); }, lead(i));
    }, wait: lead(i) + AI_MS() + 400 },
    { say: [{ text: t, pose: i % 2 ? 'wonder' : 'point' }] }]),
  [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const site = fixSite(pick, P, fx[n]);
  const pins = n > 0 ? fixPins(site) : null;
  const askText = solved || demo.done ? c.askDone : c.asks[n];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet a7-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">{c.card ? <TaskCard c={c} /> : null}<PromptEditor rows={rowsOf(pn)} /></div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={pins} busy={busy} focus={pins && pins.length ? fixFocus(site) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ЗАДАНИЕ «НАПИШИ ПРАВКУ»: первый промпт строкой, прежние правки (hist), поле новой правки → «Yuborish» → ИИ правит сайт.
// bad — правка Коди с ошибкой (её сайт виден сразу, поле подсвечено).
// =============================================================================
function FixTask({ p, c, id, pr, hist, check, pose, bad, max }) {
  const pick = usePick();
  const H = (hist || []).filter(Boolean);
  const n = H.length + 2;
  const P = prL(pick, pr);
  const T = usePromptTask(id, c, [bad ? pick(bad) : ''], (x) => check(x.fix, fixOf(x.fix)), pose, ['fix']);
  const fixes = T.sent ? H.concat(T.sent.fix) : bad ? H.concat(pick(bad)) : H;
  const site = fixSite(pick, P, fixes);
  const pins = T.sent || bad ? fixPins(site) : null;
  const rows = [pRow(p1Text(P), 1)].concat(H.map((h, i) => pRow(h, i + 2)), [T.solved || T.busy ? pRow(T.vals[0], n) : pField(T, n, c.ph, max, !!bad)]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet a7-sheet">
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

// S5. ПОКАЗ «qolganini o'zgartirma» — футбольный клуб: без него ИИ меняет всё, с ним — только цены.
function S5({ p }) { const c = C.s5; return <FixShow p={p} c={c} id="s5" pr={PR.foot} steps={[[], [c.f1], [c.f2]]} slots={1} />; }
// S6. САМ — танцевальный кружок: добавь отзывы, остальное не меняй.
function S6({ p }) {
  const c = C.s6;
  return <FixTask p={p} c={c} id="s6" pr={PR.dance} check={(t, f) => fixIssue(t, f) || (fxHas(f, 'add', 'reviews') ? null : c.msgs.add) || tailIssue(f)} />;
}
// S7. ЗАКРЕПЛЕНИЕ — какой промпт меняет только нужное.
function S7({ p }) {
  const pick = usePick();
  const c = C.s7;
  return <RoundsScreen p={p} c={c} id="s7" keyOf={(it) => it.right} ansOf={(it) => pick(it[it.right])}
    opts={() => ['a', 'b']} optLabel={(v, it) => pick(it[v])}
    body={() => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(c.q)}</p></div>} />;
}
// S8. ПОКАЗ «что и как» — мороженое: «yaxshiroq qil» → «tugmani o'zgartir» → «tugmani kattaroq va qizil qil».
function S8({ p }) { const c = C.s8; return <FixShow p={p} c={c} id="s8" pr={PR.ice} steps={[[], [c.f1], [c.f2], [c.f3]]} slots={1} />; }
// S9. САМ — магазин велосипедов: заголовок больше.
function S9({ p }) {
  const c = C.s9;
  return <FixTask p={p} c={c} id="s9" pr={PR.bike} check={(t, f) => fixIssue(t, f) || (fxHas(f, 'titleBig') ? null : fxHas(f, 'btnBig') ? c.msgs.btn : f.guess.length ? M7.guess : c.msgs.title) || tailIssue(f)} />;
}
// S10. ПОКАЗ второго и третьего промпта — баскетбол: номер, потом чат.
function S10({ p }) { const c = C.s10; return <FixShow p={p} c={c} id="s10" pr={PR.ball} steps={[[], [c.f2], [c.f2, c.f3]]} slots={2} />; }
// S11. САМ — пиццерия, второй промпт: кнопка больше.
function S11({ p }) {
  const c = C.s11;
  return <FixTask p={p} c={c} id="s11" pr={PR.pizza} check={(t, f) => fixIssue(t, f) || (fxHas(f, 'btnBig') ? null : f.guess.length ? M7.guess : c.msgs.big) || tailIssue(f)} />;
}
// S12. САМ — пиццерия, третий промпт: Telegram (второй промпт ученика — в строке выше).
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const store = useStore();
  const prev = store.get('pr_s11');
  return <FixTask p={p} c={c} id="s12" pr={PR.pizza} hist={[prev && prev.fix ? prev.fix : pick(C.s11.sample)]} check={(t, f) => fixIssue(t, f) || (fxHas(f, 'tg') ? null : c.msgs.tg) || tailIssue(f)} />;
}
// G1. ОШИБКА КОДИ — «rangini o'zgartir»: ИИ выбрал цвет сам; клиенту нужен красный.
function G1({ p }) {
  const c = C.g1;
  return <FixTask p={p} c={c} id="g1" pr={PR.gym} bad={c.bad} pose="embarrassed"
    check={(t, f) => fixIssue(t, f) || (fxHas(f, 'color', 'red') ? null : f.ch.some((x) => x.k === 'color') ? c.msgs.wrong : f.ch.some((x) => x.k === 'btnColor') ? c.msgs.btn : c.msgs.color) || tailIssue(f)} />;
}
// DET. ДЕТЕКТИВ: какой второй промпт дал этот сайт (A/B/C) — по сайту и меткам.
function Det({ p }) {
  const pick = usePick();
  const c = C.det;
  const P = prL(pick, PR.foot);
  return <RoundsScreen p={p} c={c} id="det" keyOf={(it) => it.right} ansOf={(it) => it.right.toUpperCase()}
    opts={() => ['a', 'b', 'c']} optLabel={(v) => v.toUpperCase()}
    body={(it) => {
      const site = fixSite(pick, P, [pick(it.fix)]);
      return (
        <div className="a1-which">
          <div className="a1-which-site"><AiBrowser site={site} small pins={fixPins(site)} /></div>
          <div className="a1-which-list">
            <span className="a1-qh">{pick(c.qWhich)}</span>
            <span className="a7-before">{pick(c.before)}</span>
            {['a', 'b', 'c'].map((v) => <div key={v} className="a1-pr a7-pr"><b>{v.toUpperCase()}</b><span><span className="a1-pr-l"><em>{pick(P_LBL(2))}</em>{pick(it[v])}</span></span></div>)}
          </div>
        </div>
      );
    }} />;
}
// S13. ПОЧИНИ «yaxshiroq qil» Коди — магазин сладостей: цены и большая кнопка, остальное не меняй.
function S13({ p }) {
  const c = C.s13;
  return <FixTask p={p} c={c} id="s13" pr={PR.sweets} bad={C.s1.bad} pose="embarrassed" max={200}
    check={(t, f) => (f && f.vague ? c.msgs.vague : fixIssue(t, f)) || (fxHas(f, 'add', 'prices') ? null : c.msgs.prices) || (fxHas(f, 'btnBig') ? null : c.msgs.big) || tailIssue(f)} />;
}
// S14. УЛУЧШИ САМ — сайт Roblox-клуба: любая точная правка и «qolganini o'zgartirma».
function S14({ p }) {
  const c = C.s14;
  return <FixTask p={p} c={c} id="s14" pr={PR.game} pose="point" max={200} check={(t, f) => fixIssue(t, f) || tailIssue(f)} />;
}
// Q1. ВЕРНО ИЛИ НЕТ — пять фраз урока.
function Q1({ p }) {
  const pick = usePick();
  const c = C.q1;
  return <RoundsScreen p={p} c={c} id="q1" keyOf={(it) => it.right} ansOf={(it) => pick(it.right ? c.yes : c.no)}
    opts={() => [true, false]} optLabel={(v) => pick(v ? c.yes : c.no)}
    body={(it) => <div className="a1-q-card kz-a-drop"><span className="a1-card-h">{pick(c.card)}</span><p>{pick(it.t)}</p></div>} />;
}
// FIN. ВЫВОД — разгадка: ИИ не знает, что не понравилось; цепочка промптов ученика и сайт; домашка.
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = store.get('pr_s13');
  const fix = own && own.fix ? own.fix : pick(C.s13.sample);
  const P = prL(pick, PR.sweets);
  const site = fixSite(pick, P, [fix]);
  const [copied, setCopied] = useState(false);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const copy = () => { try { navigator.clipboard.writeText(fix); } catch (e) { /* без буфера */ } sfx('tap', true); setCopied(true); };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="a1-sheet a7-sheet a1-fin">
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            <PromptEditor rows={[pRow(p1Text(P), 1), pRow(fix, 2)]} />
            <div className="kz-roles">
              {['look', 'fix', 'keep', 'loop'].map((k) => (
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
            <AiBrowser site={site} pins={fixPins(site)} />
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
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 },
  { id: 's10', code: 'SHOW', Comp: S10 }, { id: 's11', code: 'LEVEL-3B', Comp: S11 }, { id: 's12', code: 'LEVEL-3C', Comp: S12 },
  { id: 'g1', code: 'LEVEL-G', Comp: G1 }, { id: 'det', code: 'CHECK-3', Comp: Det },
  { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's14', code: 'LEVEL-5', Comp: S14 },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; правки ученика (pr_s11, pr_s13, pr_s14) остаются.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

function lessonAi7Artifact(store) {
  const a = store.get('pr_s13'), b = store.get('pr_s14');
  return a || b ? { type: 'ai-fix', fix: a ? a.fix : null, own: b ? b.fix : null } : null;
}

export default function AiImproveResult({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonAi7Artifact(store) })
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
