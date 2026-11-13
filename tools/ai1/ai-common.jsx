// =============================================================================
// ОБЩИЕ ЭКРАНЫ МОДУЛЯ «ИИ» (вынесены из урока 1, 11.11.2026; подключаются уроками 1, 2 …): задание «напиши строки
// промпта» (usePromptTask, fieldRow, SendBtn, TaskScreen, TaskCard), показ AiShow, выбор по раундам RoundsScreen.
// =============================================================================

// ── ЗАДАНИЕ «НАПИШИ СТРОКИ ПРОМПТА»: поля в строках редактора → «Yuborish» → ИИ пишет сайт → проверка ──
// keys — какие строки промпта в задании (урок 1: what, why; урок 2: what, why, who).
function usePromptTask(id, c, init, issueOf, pose, keys) {
  const K = keys || ['what', 'why'];
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const saved = store.get('pr_' + id);
  const [vals, setVals] = useState(saved ? K.map((k) => saved[k] || '') : init.slice());
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
    const pr = {};
    K.forEach((k, i) => { pr[k] = noSemi(vals[i]); });
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
      log({ screenId: id, type: 'write-prompt', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, what: pr.what, why: pr.why, who: pr.who });
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
// after — что-то под полем промпта (урок 3: кнопки блоков для сборки порядка).
// demo (урок 5) — после «Yuborish» курсор сам показывает, как ведёт себя сайт; demoBefore — и до (сайт Коди с ошибкой).
function TaskScreen({ p, c, T, rows, later, extra, before, pinOpts, after, demo, demoBefore }) {
  const pick = usePick();
  const site = aiSite(pick, T.sent || null);
  const shown = T.sent ? site : aiSite(pick, before || null);
  const pins = T.sent ? pinsOf.apply(null, [site].concat(pinOpts || [])) : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={T.speaker} done={T.canGo} hint={hintAt(Math.min(3, T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, T.canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={T.solved ? c.ok : c.ask} hint={T.solved ? null : (T.msg || hintAt(T.lad.lv, c.hints))} err={!!T.msg} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">
            {c.card ? <TaskCard c={c} /> : null}
            <PromptEditor rows={rows} later={later} send={!T.solved && !extra ? <SendBtn T={T} /> : null} />
            {after || null}
            {!T.solved && T.lad.lv >= 3 && c.sample ? <HelpCode code={pick(c.sample)} /> : null}
            {extra || null}
          </div>
          <div className="kz-col a1-right"><AiBrowser site={shown} pins={pins} busy={T.busy} demo={demo && (T.sent ? true : !!demoBefore)} focus={pins && !demo ? pinFocus(pins) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}
// Заказ: что хочет «заказчик» (Коди, кружок, кафе) — карточка над редактором.
function TaskCard({ c }) {
  const pick = usePick();
  const t = String(pick(c.card.t));
  const parts = t.split(new RegExp('(' + RE_PHONE.source + ')'));
  return <div className="a1-card"><span className="a1-card-h">{pick(c.card.h)}</span><span className="a1-card-t">{parts.map((x, i) => (i % 2 ? <span key={i} className="a1-nowrap">{x}</span> : x))}</span></div>;
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
    // Шаг без нового промпта (урок 5: то же окно на телефоне) — ИИ не пишет сайт заново, меняется только окно.
    steps[i + 1].noAi ? { act: () => { sfx('pop', true); setPn(i + 1); setN(i + 1); }, wait: 1500 } : { act: () => {
      sfx('pop', true); setPn(i + 1);
      setTimeout(() => { setBusy(true); setTimeout(() => { setBusy(false); setN(i + 1); }, AI_MS()); }, typeOf(i) + (reduceMotion() ? 100 : 350));
    }, wait: typeOf(i) + (reduceMotion() ? 100 : 350) + AI_MS() + 400 },
    { say: [{ text: t, pose: i % 2 ? 'wonder' : 'point' }] }]),
  [{ say: [{ text: c.done, pose: 'smile' }] }, { act: () => put({ done: true }) }]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const s = steps[n];
  const site = aiSite(pick, s.pr);
  const pins = s.pins === false || !s.pr ? null : pinsOf(site, s.pinWhat, s.pinWhy, s.pinWho, s.pinIn, s.pinLook, s.pinBeh);
  const demoOn = s.demo === undefined ? !!site.demos : s.demo;
  const askText = solved || demo.done ? c.askDone : c.asks[n];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene a1-scene">
          <div className="kz-col a1-left">{c.card ? <TaskCard c={c} /> : null}<PromptEditor rows={steps[pn].rows(pick)} /></div>
          <div className="kz-col a1-right"><AiBrowser site={site} pins={pins} busy={busy} demo={demoOn} vw={s.vw} focus={pins && !demoOn ? pinFocus(pins) : null} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// ── ВЫБОР ПО РАУНДАМ (engine useRounds): карточка + варианты ──
// pickCards — варианты нажимаются прямо в теле (карточки PickCard детектива), ряд кнопок под ним не ставится.
function RoundsScreen({ p, c, id, keyOf, ansOf, body, opts, optLabel, pickCards }) {
  const pick = usePick();
  const R0 = useRounds(id, c, c.items, keyOf, (it) => it.why, ansOf);
  const R = Object.assign({}, R0, { key: keyOf(R0.it) });
  const cards = typeof pickCards === 'function' ? pickCards(R.it) : !!pickCards;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={R.speaker} done={R.canGo} hint={R.ch.next(R.hints) || c.ask} nav={navOf(p, R.canGo)}>
      <Sheet cls="a1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : R.ch.now(R.hints)} err={R.ch.err} n={(R.ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col a1-rounds a1-in" key={'i' + R.ii}>
          <div className="kz-col">
            {body(R.it, R)}
            {cards ? null : <div className={'kz-pick a1-opts a1-opts-' + opts(R.it).length}>
              {opts(R.it).map((v) => (
                <button key={v} type="button" data-v={v} disabled={!R.canTap || R.ok || R.off.indexOf(v) >= 0} onClick={() => R.choose(v)}
                  className={'kz-btn a1-opt ' + (R.ok && v === keyOf(R.it) ? 'is-ok' : R.off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (R.ch.lad.lv >= 3 && v === keyOf(R.it) && !R.ok ? ' is-led' : '')}>
                  <span>{optLabel(v, R.it)}</span><Led on={R.led && !R.ok && R.off.length === 0} />
                </button>
              ))}
            </div>}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}
// Вариант-карточка детектива: нажимается сама (без отдельного ряда кнопок A/B/C).
function PickCard({ R, v, cls, children }) {
  const off = R.off.indexOf(v) >= 0;
  return (
    <button type="button" data-v={v} disabled={!R.canTap || R.ok || off} onClick={() => R.choose(v)}
      className={'a1-opt a1-pickc ' + (cls || '') + (R.ok && v === R.key ? ' is-ok' : off ? ' is-off' : '') + (R.ch.lad.lv >= 3 && v === R.key && !R.ok ? ' is-led' : '')}>
      {children}<Led on={R.led && !R.ok && R.off.length === 0 && v === 'a'} />
    </button>
  );
}
// Куда прокрутить окно сайта: к первой метке; название, плашка и кнопка — в баннере, тогда к верху сайта.
const pinFocus = (pins) => { const s = pins && pins[0] ? pins[0].sel : null; return !s ? null : /^\.(title|badge|cta|sub|logo|ch)$/.test(s) ? '.nav' : s; };

