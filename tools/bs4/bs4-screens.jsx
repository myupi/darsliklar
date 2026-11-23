// =============================================================================
// ЭКРАНЫ УРОКА 4 «Flex» — сами экраны (помощники — bs4-head.jsx, общие куски из урока 3 — bs4-common.jsx).
// =============================================================================

// S1. КРЮЧОК — шапка: логотип, название, кнопка друг под другом. «Bootstrap bilan» — три слова class, шапка в ряд.
// Загадка: «в Bootstrap flex свой, CSS можно забыть».
const S1_CLS = 'd-flex justify-content-between align-items-center';
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.done, 'smile');
  };
  const cls = on ? S1_CLS : null;
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={headLines(pick, cls, { cls: on ? 'is-new is-read' : 'is-hl' })} cls="kz-code-sm" /></div>
          <div className="kz-col"><SitePage pick={pick} body={headH(pick, cls)} vw={WIDE} title={vwTitle(pick, WIDE)} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// S2. d-flex (показ) — без class → justify-content-between без d-flex (ничего не изменилось) → + d-flex (ряд и по краям).
// Карточка «внутри Bootstrap»: правило каждого слова — тот же CSS.
const S2_CLS = [null, 'justify-content-between', 'd-flex justify-content-between'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayNo, pose: 'think' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayFlex, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askNo, c.askFlex][n];
  const help = useShowHelp(c.help);
  const cls = S2_CLS[n];
  const rules = (cls || '').split(' ').filter(Boolean).map(ruleOf);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={headLines(pick, cls, { cls: n ? 'is-new is-read' : '' })} cls="kz-code-sm" />
            {rules.length ? <CssCard pick={pick} rules={rules} on={n === 2} /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={headH(pick, cls)} vw={WIDE} title={vwTitle(pick, WIDE)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// X1. ПУЛЬТ ГЛАВНОЙ ОСИ — шесть слов justify-content-*: шапка и правило CSS меняются сразу. Готово — четыре разных.
const JC_KEYS = ['start', 'center', 'end', 'between', 'around', 'evenly'];
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [jc, setJc] = useState(solved ? 'between' : 'start');
  const [seen, setSeen] = useState(solved ? JC_KEYS.slice(0, 4) : ['start']);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, seen.length);
  const tap = (k) => {
    if (!canTap) return;
    st.current.tries += 1; sfx('tap', true); setJc(k);
    const fresh = seen.indexOf(k) < 0;
    const s2 = fresh ? seen.concat(k) : seen;
    setSeen(s2);
    if (!ok && s2.length >= 4) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.mean[k], c.ok), 'cheer'); say(c.done, 'smile');
      return;
    }
    if (fresh && !ok) sayNow(c.mean[k], 'point');
    if (st.current.tries >= 7 && !ok) lad.bump();
  };
  const cls = 'd-flex justify-content-' + jc;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} />
        <div className="kz-scene b1-pair b4-x1">
          <div className="kz-col">
            <KzCode lines={[hl('o' + jc, 0, '<div class="' + cls + '">', { cls: 'is-new' })]} cls="kz-code-sm" />
            <CssCard pick={pick} rules={[ruleOf('justify-content-' + jc)]} on />
          </div>
          <div className="kz-col"><SitePage pick={pick} body={headH(pick, cls)} vw={WIDE} title={vwTitle(pick, WIDE)} /></div>
        </div>
        <div className="b2-pult">
          <div className="b2-pult-row">
            <span className="b2-pult-h">justify-content <i>{Math.min(4, seen.length)}/4</i></span>
            <div className="b2-colors b4-jc">
              {JC_KEYS.map((k) => (
                <button key={k} type="button" className={'b2-chip' + (jc === k ? ' is-on' : '') + (seen.indexOf(k) >= 0 ? ' is-seen' : '')} onClick={() => tap(k)} disabled={!canTap} data-jc={k}>
                  <i className={'b4-jc-i is-' + k} aria-hidden="true"><b /><b /><b /></i><span translate="no">{k}</span><Led on={led && !ok && seen.indexOf(k) < 0 && k === JC_KEYS.find((x) => seen.indexOf(x) < 0)} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// G1 / G2 / G3 — слово с сайта (показ «как на видео», WordShow из урока 3).
function G1({ p }) {
  const pick = usePick();
  const code = (on) => headLines(pick, 'd-flex' + (on ? ' justify-content-between' : ''), { cls: on ? 'is-new is-read' : 'is-hl' });
  const page = (on) => headH(pick, 'd-flex' + (on ? ' justify-content-between' : ''));
  return <WordShow p={p} id="g1" c={C.g1} from="Placeholder" fromOpen="comp" grp="util" to="Justify content" block="justify" ln={3} word="justify-content-between" code={code} page={page} vw={WIDE} />;
}
function G2({ p }) {
  const pick = usePick();
  const base = 'd-flex justify-content-between';
  const code = (on) => headLines(pick, base + (on ? ' align-items-center' : ''), { cls: on ? 'is-new is-read' : 'is-hl' });
  const page = (on) => headH(pick, base + (on ? ' align-items-center' : ''));
  return <WordShow p={p} id="g2" c={C.g2} from="Justify content" fromOpen="util" grp="util" to="Align items" block="align" ln={2} word="align-items-center" code={code} page={page} vw={WIDE} />;
}
function G3({ p }) {
  const code = (on) => cardsLines('d-flex' + (on ? ' gap-4' : ''), { cls: on ? 'is-new is-read' : 'is-hl' });
  const page = (on) => cardsH('d-flex' + (on ? ' gap-4' : ''));
  return <WordShow p={p} id="g3" c={C.g3} from="Align items" fromOpen="util" grp="util" to="Gap" block="flexgap" ln={0} word="gap-4" code={code} page={page} vw={CARDS} />;
}

// T1 — главная ось по образцу; T2 — поперечная; T3 — расстояние по таблице.
const goalHead = (pick, cls) => headH(pick, cls);
function T1({ p }) {
  const pick = usePick();
  const c = C.t1;
  const mk = (want, ask, hints, why) => ({ kind: 'jc', want, ask, hints, why, ph: L3('justify-content-…', 'justify-content-…', 'justify-content-…'), vw: WIDE, gz: 0.42,
    line: (f) => [divField('d-flex', null)(f)].concat(headKids(pick, 1, true), [hl('c', 0, '</div>')]),
    body: (v) => headH(pick, 'd-flex ' + v), goal: goalHead(pick, 'd-flex ' + want) });
  const rounds = [mk('justify-content-center', c.ask1, c.hints1, c.why1), mk('justify-content-end', c.ask2, c.hints2, c.why2), mk('justify-content-between', c.ask3, c.hints3, c.why3)];
  // 23.11.2026: на телефоне окно сайта — полоса; прокручено к строкам кода примера (слова justify-content-…).
  return <FillRounds p={p} id="t1" c={c} rounds={rounds} docs={{ page: 'Justify content', only: 'justify', scroll: 'ln:justify:0' }} type="justify-by-sample" />;
}
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const base = 'd-flex justify-content-between';
  // 23.11.2026: образец крупнее (0.65 — разница по низу и по середине видна); строка с полем переносится перед полем (l4-fl),
  // иначе поле после длинной основы уходило за правый край.
  const mk = (want, ask, hints, why) => ({ kind: 'ai', want, ask, hints, why, ph: L3('align-items-…', 'align-items-…', 'align-items-…'), vw: WIDE, gz: 0.65,
    line: (f) => [{ k: 'o', d: 0, cls: 'b1-line is-hl l4-fl', parts: clsParts({ tag: 'div', attrs: [], before: null, field: <React.Fragment key="ff">{base.split(' ').map((w) => <React.Fragment key={w}><span className="b1-st l4-w">{w}</span>{' '}</React.Fragment>)}{f}</React.Fragment> }) }]
      .concat(headKids(pick, 1, true), [hl('c', 0, '</div>')]),
    body: (v) => headH(pick, base + ' ' + v), goal: goalHead(pick, base + ' ' + want) });
  const rounds = [mk('align-items-end', c.ask1, c.hints1, c.why1), mk('align-items-center', c.ask2, c.hints2, c.why2)];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} docs={{ page: 'Align items', only: 'align', scroll: 'ln:align:0' }} type="align-by-sample" />;
}
function T3({ p }) {
  const c = C.t3;
  const goalCards = (g, px) => '<div style="display:flex;align-items:center;gap:10px"><b style="font:600 13px system-ui;color:#BE123C">↔ ' + px + '</b>' + cardsH('d-flex ' + g).replace(/<img /g, '<img style="width:40px" ') + '</div>';
  const mk = (want, px, ask, hints, why) => ({ kind: 'gap', want, ask, hints, why, ph: L3('gap-…', 'gap-…', 'gap-…'), vw: CARDS, gz: 0.8,
    line: (f) => [divField('d-flex', null)(f)].concat(cardsLines(null).slice(1)),
    body: (v) => cardsH('d-flex ' + v), goal: goalCards(want, px) });
  const rounds = [mk('gap-5', '16 px', c.ask1, c.hints1, c.why1), mk('gap-9', '32 px', c.ask2, c.hints2, c.why2)];
  // 23.11.2026: на телефоне таблица прокручена к строкам вокруг нужного размера (16 px — gap-5, 32 px — gap-9), без подсветки.
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} docs={{ page: 'Gap', only: 'notation', scroll: (i) => (i === 0 ? 'ln:notation:4' : 'ln:notation:8') }} type="gap-by-table" />;
}

// S6. ПОПЕРЕЧНАЯ ОСЬ (показ) — шапка по краям; align-items-start → end → center: логотип высокий, кнопка низкая.
const S6_AI = [null, 'align-items-start', 'align-items-end', 'align-items-center'];
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayStart, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } }, { say: [{ text: c.sayEnd, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayCenter, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askS, c.askE, c.askC][n];
  const help = useShowHelp(c.help);
  const cls = 'd-flex justify-content-between' + (S6_AI[n] ? ' ' + S6_AI[n] : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={headLines(pick, cls, { cls: n ? 'is-new is-read' : '' })} cls="kz-code-sm" />
            {S6_AI[n] ? <CssCard pick={pick} rules={[ruleOf(S6_AI[n])]} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={headH(pick, cls)} vw={WIDE} title={vwTitle(pick, WIDE)}><span className="b4-axis" aria-hidden="true">↕</span></SitePage></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S9. РАССТОЯНИЕ (показ) — карточки d-flex вплотную → gap-3 → gap-5 → gap-9; число — размер по таблице, не пиксели.
const S9_G = [null, 'gap-3', 'gap-5', 'gap-9'];
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.say3, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } }, { say: [{ text: c.say5, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.say9, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : n === 0 ? c.askStart : fillL(c.askGap, { w: S9_G[n] + ' · ' + GAP_REM[S9_G[n].slice(4)] + ' · ' + Math.round(parseFloat(GAP_REM[S9_G[n].slice(4)]) * 16) + ' px' });
  const help = useShowHelp(c.help);
  const cls = 'd-flex' + (S9_G[n] ? ' ' + S9_G[n] : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={cardsLines(cls, { cls: n ? 'is-new is-read' : '' })} cls="kz-code-sm" />
            {S9_G[n] ? <CssCard pick={pick} rules={[ruleOf(S9_G[n])]} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={cardsH(cls)} vw={CARDS} title={vwTitle(pick, CARDS)} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// S12. ТЕЛЕФОН (показ) — 360 px: три карточки с gap-3 не помещаются → flex-wrap — переносятся на новую строку.
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 1 : 0);
  const [wide, setWide] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'think' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('ok', true); setN(1); } }, { say: [{ text: c.sayWrap, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : n ? c.askWrap : c.askStart;
  const help = useShowHelp(c.help);
  const cls = 'd-flex gap-3' + (n ? ' flex-wrap' : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={cardsLines(cls, { cls: n ? 'is-new is-read' : '' })} cls="kz-code-sm" />
            {n ? <CssCard pick={pick} rules={[ruleOf('flex-wrap')]} on /> : null}
          </div>
          <div className="kz-col"><SitePage pick={pick} body={cardsH(cls)} vw={PHONE} onWide={setWide} title={vwTitle(pick, PHONE)}><WideBadge pick={pick} wide={wide} /></SitePage></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// T4. СБОРКА — шапку по образцу собрать из кусочков class (нажатием включаются и выключаются). Проверка — набор слов.
const T4_PIECES = ['d-flex', 'flex-column', 'justify-content-center', 'justify-content-between', 'align-items-start', 'align-items-center'];
const T4_WANT = ['d-flex', 'justify-content-between', 'align-items-center'];
function T4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t4;
  const [rec, put] = useRec('t4');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? T4_WANT : []);
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, on.length);
  const toggle = (w) => { if (!canTap || ok) return; sfx('tap', true); setMsg(null); setOn((x) => (x.indexOf(w) >= 0 ? x.filter((y) => y !== w) : T4_PIECES.filter((y) => y === w || x.indexOf(y) >= 0))); };
  const check = () => {
    if (!canTap || ok) return;
    st.current.tries += 1;
    const has = (w) => on.indexOf(w) >= 0;
    const issue = !has('d-flex') ? c.msgs.noFlex : has('flex-column') ? c.msgs.column : !has('justify-content-between') ? c.msgs.jc : has('justify-content-center') ? c.msgs.both : !has('align-items-center') ? c.msgs.ai : has('align-items-start') ? c.msgs.both : null;
    if (issue) { st.current.misses += 1; sfx('soft', true); const t = st.current.misses >= 2 && lad.lv > 0 ? joinL(issue, hintAt(lad.lv, c.hints)) : issue; setMsg(t); sayNow(t, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setOk(true); setMsg(null); put({ done: true });
    log({ screenId: 't4', type: 'assemble-class', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const cls = on.join(' ');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene b1-pair b4-t4">
          <div className="kz-col">
            <Goal pick={pick} html={headH(pick, T4_WANT.join(' '))} zoom={0.65} />
            <KzCode lines={headLines(pick, cls || null, { cls: 'is-hl' }, true)} cls="kz-code-sm" />
          </div>
          <div className="kz-col"><SitePage pick={pick} body={headH(pick, cls || null)} vw={WIDE} title={vwTitle(pick, WIDE)} /></div>
        </div>
        <div className="b4-pieces">
          {T4_PIECES.map((w) => (
            <button key={w} type="button" className={'b2-chip b4-piece' + (on.indexOf(w) >= 0 ? ' is-on' : '')} onClick={() => toggle(w)} disabled={!canTap || ok} data-piece={w} aria-pressed={on.indexOf(w) >= 0 ? 'true' : 'false'}>
              <span translate="no">{w}</span><Led on={(lad.lv >= 3 && T4_WANT.indexOf(w) >= 0 && on.indexOf(w) < 0) || (led && !ok && on.length === 0 && w === 'd-flex')} />
            </button>
          ))}
        </div>
        {!ok ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap || !on.length} onClick={check}>{pick(UI.check)}</button></div> : null}
      </Sheet>
    </StageB>
  );
}

// Q1. КАРТИНКА → КОД (4 раунда): шапка по центру, по краям, колонкой; карточки через 32 px.
const Q1_ROUNDS = [
  { opts: ['justify-content-center', 'd-flex justify-content-center', 'd-flex justify-content-evenly', 'd-flex align-items-center'], a: 1, html: (pick, cls) => headH(pick, cls) },
  { opts: ['d-flex justify-content-around', 'd-flex justify-content-space-between', 'd-flex justify-content-between', 'd-flex'], a: 2, html: (pick, cls) => headH(pick, cls) },
  { opts: ['d-flex flex-column', 'flex-column', 'd-flex flex-row', 'd-flex flex-wrap'], a: 0, html: (pick, cls) => headH(pick, cls) },
  { opts: ['d-flex gap-32', 'd-flex gap-3', 'gap-9', 'd-flex gap-9'], a: 3, html: (pick, cls) => cardsH(cls), vw: CARDS }
];
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const R = useRounds(Q1_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [shown, setShown] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => { setOff([]); setShown(null); }, [R.ii]);
  const RR = Q1_ROUNDS[R.ii];
  const right = RR.opts[RR.a];
  const ch = useChoiceHints(!R.ok, R.ii);
  const why = c.why[R.ii];
  const hints = choiceHints(c.hint1, c.hint2, why, right);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (j) => {
    const o = RR.opts[j];
    if (!canTap || R.ok || off.indexOf(o) >= 0) return;
    R.st.current.tries += 1; setShown(o);
    if (j !== RR.a) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(o)); sayNow(ch.miss(c.no[o], hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 'q1', type: 'picture-to-code', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const res = R.ok ? right : shown;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.done : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene b1-pair b2-q1 b3-q1" key={'r' + R.ii}>
          <div className="kz-col"><Br title={pick(UI.need)} short cls="b2-q1page b3-goalwin"><BsFrame body={RR.html(pick, right)} bs dep={'g' + R.ii} vw={RR.vw || WIDE} /></Br></div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={RR.html(pick, res)} bs dep={res} vw={RR.vw || WIDE} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
            </Br>
          </div>
        </div>
        <div className="kz-pick b2-codes">
          {RR.opts.map((o, j) => (
            <button key={o} type="button" disabled={!canTap || R.ok || off.indexOf(o) >= 0} onClick={() => choose(j)} data-v={o}
              className={'kz-btn b2-code-opt ' + (R.ok && j === RR.a ? 'is-ok' : off.indexOf(o) >= 0 ? 'is-off' : 'is-ghost')} translate="no">
              {'class="' + o + '"'}<Led on={(led && !R.ok && off.length === 0 && j === 0) || (ch.lad.lv >= 3 && j === RR.a && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}
// Промах в «почему не работает» / «верно или нет» (заказчик, 23.11.2026: «да, сделай» — при ошибке сначала намёк, а не ответ):
// первая ошибка — нейтральная фраза, со второй к ней добавляется ступень подсказки; объяснение верного ответа — только на 3-й ступени.
const MISS_WHY = L3("Bu sabab emas. Sahifaga va kodga yana bir qarang.", 'Не эта причина. Посмотри ещё раз на страницу и код.', 'That’s not the reason. Look at the page and the code again.');
const MISS_TF = L3("Unday emas. Gapni yana bir bor o'qing.", 'Не так. Прочитай утверждение ещё раз.', 'Not quite. Read the statement again.');

// T6. ПОЧЕМУ НЕ РАБОТАЕТ — нет d-flex; значение CSS вместо класса; gap-16 — такого размера нет.
const T6_ROUNDS = [
  { k: 'noFlex', cls: 'justify-content-between', cards: false },
  { k: 'cssVal', cls: 'd-flex justify-content-space-between', cards: false },
  { k: 'noSize', cls: 'd-flex gap-16', cards: true }
];
function T6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t6;
  const [rec, put] = useRec('t6');
  const solved = !!(rec && rec.done);
  const R = useRounds(T6_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  useEffect(() => setOff([]), [R.ii]);
  const RR = T6_ROUNDS[R.ii];
  const why = c.rounds[R.ii];
  const ch = useChoiceHints(!R.ok, R.ii);
  const hints = choiceHints(c.hint1, c.hint2, why, c.opts[RR.k]);
  const led = useIdleLed(canTap && !R.ok, R.ii * 10 + off.length);
  const choose = (k) => {
    if (!canTap || R.ok || off.indexOf(k) >= 0) return;
    R.st.current.tries += 1;
    if (k !== RR.k) { R.st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(MISS_WHY, hints), 'think'); return; }
    sfx('ok', true); R.setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (R.last) {
      put({ done: true });
      log({ screenId: 't6', type: 'why-broken', correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const keys = ['noFlex', 'cssVal', 'noSize'];
  const lines = RR.cards ? cardsLines(RR.cls, { cls: 'is-hl' }) : headLines(pick, RR.cls, { cls: 'is-hl' });
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={RR.cards ? cardsH(RR.cls) : headH(pick, RR.cls)} vw={RR.cards ? CARDS : WIDE} title={vwTitle(pick, RR.cards ? CARDS : WIDE)} /></div>
        </div>
        <div className="kz-pick b1-why">
          {keys.map((k) => (
            <button key={k} type="button" disabled={!canTap || R.ok || off.indexOf(k) >= 0} onClick={() => choose(k)} data-v={k}
              className={'kz-btn b1-opt2 ' + (R.ok && k === RR.k ? 'is-ok' : off.indexOf(k) >= 0 ? 'is-off' : 'is-ghost')}>
              {pick(c.opts[k])}<Led on={(led && !R.ok && off.length === 0) || (ch.lad.lv >= 3 && k === RR.k && !R.ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// W1. СВОЯ ШАПКА — главная ось (justify-content-…) и расстояние (gap-…) своими словами с сайта; «Tayyor».
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [jc, setJc] = useState(store.get('myJc') || '');
  const [gp, setGp] = useState(store.get('myGap') || '');
  const [fld, setFld] = useState(null);   // в каком поле ученик: 'jc' | 'gp'
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !jc, 0);
  const vj = normCls(jc), vg = normCls(gp);
  const ready = !!(vj && vg);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    st.current.tries += 1;
    const issue = issueText(wordIssue(vj, 'jc', null)) || issueText(wordIssue(vg, 'gap', null));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myJc', vj); store.set('myGap', vg); put({ done: true });
    log({ screenId: 'w1', type: 'own-header', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, cls: vj + ' ' + vg });
    sayNow(c.ok, 'cheer');
  };
  // 23.11.2026: сайт рядом — по шагу: пока ученик в первом поле — Justify content; во втором (или первое уже верно) — Gap.
  const onGap = !solved && (fld === 'gp' || (fld !== 'jc' && !!vj && !wordIssue(vj, 'jc', null)));
  const f = (val, set, k, ph, lit) => (solved ? <span key={k} className="b1-st">{val.trim()}</span>
    : <span key={k} className={'kz-gap b1-slotin b2-field' + (lit ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} onFocus={() => setFld(k)} placeholder={ph} label={k === 'gp' ? c.askGap : c.ask} max={28} /></span>);
  const l1 = clsParts({ tag: 'div', attrs: [], before: 'd-flex', field: <React.Fragment key="ff">{f(jc, setJc, 'jc', L3('justify-content-…', 'justify-content-…', 'justify-content-…'), led)}<span className="b1-st">{' align-items-center '}</span>{f(gp, setGp, 'gp', L3('gap-…', 'gap-…', 'gap-…'))}</React.Fragment> });
  const cls = ('d-flex ' + vj + ' align-items-center ' + vg).replace(/\s+/g, ' ').trim();
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : onGap ? c.askGap : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className={docsPhoneCls({ ref: true, done: solved })}>
          {!solved ? <div className="kz-col b1-tri-docs" key={onGap ? 'gap' : 'jc'}>{onGap
            ? <DocsBr page="Gap"><BsDocs page="Gap" only="notation" copyOff /></DocsBr>
            : <DocsBr page="Justify content"><BsDocs page="Justify content" only="justify" copyOff /></DocsBr>}</div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={[{ k: 'a', d: 0, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l1 }].concat(headKids(pick, 1, true), [hl('c', 0, '</div>')])} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={headH(pick, cls)} vw={WIDE} title={pick(UI.mySite)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// S18. ВЫВОД — разгадка: таблица «CSS ↔ Bootstrap» (тот же flex), своя шапка, что умеем.
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const jc = store.get('myJc') || 'justify-content-between', gp = store.get('myGap') || 'gap-5';
  const cls = 'd-flex ' + jc + ' align-items-center ' + gp;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const words = cls.split(' ');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col"><SitePage pick={pick} body={headH(pick, cls) + '<div style="height:10px"></div>' + cardsH('d-flex ' + gp + ' flex-wrap')} vw={CARDS} title={pick(UI.mySite)} /></div>
          <div className="kz-col b1-end-side">
            <CssCard pick={pick} rules={words.map(ruleOf).filter(Boolean)} on={curK === 'riddle'} />
            <div className="kz-roles">
              {['flex', 'axes', 'gap', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'flex' ? '#0FA38E' : k === 'axes' ? '#7952B3' : k === 'gap' ? '#D97706' : '#FA4F28' }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// РЕЕСТР И КОРЕНЬ
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 'g3', code: 'SHOW', Comp: G3 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs4Artifact(store) {
  const jc = store.get('myJc'), gp = store.get('myGap');
  if (!jc && !gp) return null;
  const cls = ('d-flex ' + (jc || '') + ' align-items-center ' + (gp || '')).replace(/\s+/g, ' ').trim();
  return { type: 'html-page', cls,
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <div class="' + escH(cls) + '">', '      <img src="logo.png" alt="Logo">', "      <h4>Robot to'garagi</h4>", '      ' + BTN4, '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapFlex({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs4Artifact(store) })
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
