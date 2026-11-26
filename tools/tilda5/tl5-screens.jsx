// =============================================================================
// ЭКРАНЫ УРОКА 5 МОДУЛЯ TILDA «Цвета и шрифты». Показы — указатель (курсор / палец) сам делает шаги под речь Коди;
// задания — ученик нажимает сам (ничего не печатает), указатель стоит у нужной вещи. Сайт клуба меняется от экрана к экрану:
// чёрно-белый (s1) → кремовый фон (s4) → тёмно-синие заголовки (s5) → оранжевая кнопка с белым текстом (s6) →
// шрифт Montserrat (s10). Сквозные данные: tl5RealUrl.
// =============================================================================
const useShowHelp = (help) => {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
};
function useActTask(hints0) {
  const lad = useKzLadder(true);
  const [msg, setMsg] = useState(null);
  const st = useRef({ tries: 0, misses: 0 });
  return {
    lad, msg, st, setMsg,
    miss: (m, sayNow) => { st.current.tries += 1; st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); },
    hit: () => { st.current.tries += 1; setMsg(null); },
    now: (h) => msg || hintAt(lad.lv, h || hints0),
    next: (h) => hintAt(Math.min(3, lad.lv + 1), h || hints0)
  };
}
const logOf = (T, id, type, extra) => Object.assign({ screenId: id, type: type, correct: true, firstTry: T.st.current.misses === 0, attempts: T.st.current.tries, hints: T.lad.asked.current, depth: T.lad.lv }, extra || {});
const nav5 = (p, canGo) => navOf(p, canGo);
const shake = (set, k) => { set(k); setTimeout(() => set(null), 700); };

// Блоки страницы и темы по ходу урока.
const B5 = [{ u: 'c', k: 'cover', id: 'CR28' }, { u: 't', k: 'title', id: 'TL02' }, { u: 'x', k: 'text', id: 'TX01' }, { u: 'i', k: 'img', id: 'IM01' }, { u: 'b', k: 'button', id: 'BF101' }];
const blocks5 = (flash) => B5.map((b) => (flash && flash === b.u ? Object.assign({}, b, { flash: true }) : b));
const TH_S4 = th5({ bg: PAL.cream });
const TH_S5 = th5({ bg: PAL.cream, h: PAL.blue });
const TH_S6 = th5({ bg: PAL.cream, h: PAL.blue, btnBg: PAL.orange, btnFg: PAL.white });
const TH_END = th5({ bg: PAL.cream, h: PAL.blue, btnBg: PAL.orange, btnFg: PAL.white, font: 'montserrat' });
const colVals = (th) => ({ h: th.h === TH0.h ? '#000000' : th.h, t: '#000000', l: '#ff0000', bg: th.bg === '#FFFFFF' ? '#ffffff' : th.bg });

// =============================================================================
// S1. КРЮЧОК — сообщение клуба: «чёрно-белый, как у всех; сделай в цветах клуба». Вопрос-мнение и загадка Коди.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ans, setAns] = useState(solved ? rec.k : null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.riddle : c.say, pose: solved ? 'curious' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const pickOpt = (k) => {
    if (!canTap || ans) return;
    sfx('tap', true); setAns(k); put({ done: true, k: k });
    sayNow(joinL(c.reply[k], c.riddle), 'curious');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ans ? c.askDone : c.ask} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={ans ? c.askDone : c.ask} />
        <div className="kz-scene tl-scene tl2-hook tl4-hook tl5-hook">
          <div className="tl-msg kz-a-drop">
            <span className="tl-msg-from"><i className="tl-ava" aria-hidden="true" />{pick(c.from)}</span>
            <span className="tl-msg-t">{pick(c.msg)}</span>
            <span className="tl5-msg-pal" aria-hidden="true"><TSw c={PAL.blue} big /><TSw c={PAL.orange} big /></span>
            <span className="tl-msg-time">10:12</span>
          </div>
          <TEd2 project="RoboKlub" cls="tl2-mini"><TPage5 blocks={blocks5()} th={TH0} /></TEd2>
          <div className="tl-pick is-two">
            {['rainbow', 'club'].map((k) => (
              <button key={k} type="button" data-v={k} className={'kz-btn tl-opt' + (ans === k ? ' is-ok' : '')} disabled={!canTap || !!ans} onClick={() => pickOpt(k)}>{pick(c.opts[k])}</button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ПОКАЗ «ЗАЧЕМ ЦВЕТ» — один сайт трижды: чёрно-белый, радуга, два цвета клуба.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [v, setV] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => setV(0) }, { say: [{ text: c.steps[0], pose: 'point' }] }, { wait: 300 * ms },
    { act: () => { sfx('pop', true); setV(1); } }, { wait: 500 * ms }, { say: [{ text: c.steps[1], pose: 'think' }] },
    { act: () => { sfx('pop', true); setV(2); } }, { wait: 500 * ms }, { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const th = v === 2 ? TH_S6 : v === 1 ? th5({ h: '#7C3AED', btnBg: '#22C55E', btnFg: '#FDE047' }) : TH0;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl5-why">
          <span className="tl5-vdots" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} className={i === v ? 'is-on' : ''} />)}</span>
          <TEd2 project="RoboKlub" cls="tl5-why-ed"><TPage5 key={v} blocks={blocks5()} th={th} rainbow={v === 1} /></TEd2>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ЗАДАНИЕ «ЧИТАЕТСЯ?» — 3 раунда по две карточки: текст на фоне.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const log = useLog();
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okK, setOkK] = useState(solved ? c.rounds[c.rounds.length - 1].a : null);
  const [bad, setBad] = useState(null);
  const misses = useRef(0);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const R = c.rounds[r];
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tap = (k) => {
    if (!canTap || solved || okK) return;
    if (k !== R.a) { misses.current += 1; shake(setBad, k); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's3', type: 'contrast', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene tl-scene tl3-quiz tl5-quiz">
          <div className="tl2-qn" aria-live="polite">
            <span className="tl2-qdots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
          </div>
          <div key={'o' + r} className="tl3-qopts kz-a-drop">
            {['a', 'b'].map((k) => {
              const o = k === 'a' ? R.A : R.B;
              return (
                <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK} className={'tl3-qo tl5-cq' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)}>
                  <span className="tl3-cmp-l" translate="no">{k.toUpperCase()}</span>
                  <span className="tl5-cq-card" style={{ background: o.bg, color: o.fg }} translate="no"><b>RoboKlub</b><span>{pick(c.sample)}</span></span>
                </button>
              );
            })}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. ПОКАЗ «ЦВЕТА САЙТА» — название проекта → «Настройки сайта» → «Цвета и стили» → «ЦВЕТ ФОНА СТРАНИЦЫ» → кремовый →
// «Сохранить изменения» → фон страницы сменился.
// =============================================================================
function S4({ p }) {
  const c = C.s4;
  const root = useRef(null);
  const G = useGuide(root);
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [view, setView] = useState('ed');
  const [tab, setTab] = useState(null);
  const [open, setOpen] = useState(null);
  const [bg, setBg] = useState(solved ? PAL.cream : TH0.bg);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => G.go('[data-part="path"] b', 0.5, 0.5) }, { wait: 800 * ms },
    { act: () => { G.tap(); setView('proj'); } }, { wait: 600 * ms },
    { act: () => G.go('[data-t="siteset"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setView('set'); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => G.go('[data-v="tab-colors"]', 0.4, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setTab('colors'); } }, { wait: 500 * ms },
    { say: [{ text: c.steps[1], pose: 'explain' }] },
    { act: () => G.go('[data-t="sw-bg"]', 0.2, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setOpen('bg'); } }, { wait: 500 * ms },
    { act: () => G.go('[data-v="c-cream"] .tl5-sw', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); setBg(PAL.cream); setOpen(null); } }, { wait: 500 * ms },
    { act: () => G.go('[data-t="savechg"]', 0.5, 0.5) }, { wait: 700 * ms },
    { act: () => { G.tap(); sfx('ok', true); setView('ed'); setTab(null); } }, { wait: 500 * ms },
    { act: () => G.hide() },
    { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl-groot" ref={root}>
          <TEd2 project="RoboKlub" cls={view !== 'ed' ? 'tl5-seton' : ''}>
            <TPage5 blocks={blocks5()} th={th5({ bg: bg })} />
            {view === 'proj' ? <TProj5 onSet={() => {}} /> : null}
            {view === 'set' ? (
              <TSiteSet tab={tab} onTab={() => {}} onSave={() => {}}>
                {tab === 'colors' ? <TColors vals={colVals(th5({ bg: bg }))} open={open} pal={['cream', 'white', 'gray', 'yellow']} /> : null}
              </TSiteSet>
            ) : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. ЗАДАНИЕ «ЦВЕТ ЗАГОЛОВКОВ» — «Цвета и стили» → «ЦВЕТ ЗАГОЛОВКОВ» → тёмно-синий → «Сохранить изменения».
// =============================================================================
function S5({ p }) {
  const c = C.s5;
  const log = useLog();
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 4 : 0);   // 0 — раздел, 1 — кружок, 2 — цвет, 3 — сохранить, 4 — готово
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onTab = (k) => { if (!canTap || st !== 0) return; if (k !== 'colors') { T.miss(c.wrongTab, sayNow); return; } T.hit(); sfx('tap', true); setSt(1); };
  const onSw = (k) => { if (!canTap || st < 1 || st > 2) return; if (k !== 'h') { T.miss(c.wrongRow, sayNow); return; } T.hit(); sfx('pop', true); setSt(2); };
  const onPick = (n) => {
    if (!canTap || st !== 2) return;
    if (n !== 'blue') { shake(setBad, n); T.miss(c.wrong[n], sayNow); return; }
    T.hit(); sfx('ok', true); setSt(3); sayNow(c.picked, 'smile');
  };
  const onSave = () => {
    if (!canTap || st !== 3) return;
    sfx('win', true); setSt(4); put({ done: true });
    log(logOf(T, 's5', 'title-color', { value: 'blue' }));
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  usePoint(G, st === 0 ? '[data-v="tab-colors"]' : st === 1 ? '[data-t="sw-h"]' : st === 2 && T.lad.lv >= 3 ? '[data-v="c-blue"] .tl5-sw' : st === 3 ? '[data-t="savechg"]' : null, canTap);
  const vals = colVals(TH_S4);
  if (st >= 3) vals.h = PAL.blue;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 4 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={st < 4 ? 'tl5-seton' : ''}>
            <TPage5 blocks={blocks5(st === 4 ? 't' : null)} th={st === 4 ? TH_S5 : TH_S4} />
            {st < 4 ? (
              <TSiteSet tab={st >= 1 ? 'colors' : null} onTab={canTap && st === 0 ? onTab : null} tabLed={st === 0 ? 'colors' : null} onSave={canTap && st === 3 ? onSave : null} saveLed={st === 3}>
                {st >= 1 ? <TColors vals={vals} open={st === 2 ? 'h' : null} onSw={canTap && st <= 2 ? onSw : null} swLed={st === 1 ? 'h' : null} pal={['yellow', 'blue', 'pink', 'orange']} onPick={canTap ? onPick : null} bad={bad} /> : null}
              </TSiteSet>
            ) : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. ЗАДАНИЕ «ЦВЕТ КНОПКИ» — кнопка → «Настройки» → «КНОПКА» → «ЦВЕТ ФОНА» оранжевый → «ЦВЕТ ТЕКСТА» белый →
// «Сохранить и закрыть». Кнопка на странице меняется сразу.
// =============================================================================
const BTN_BG_PAL = ['gray', 'orange', 'blue'], BTN_FG_PAL = ['orange', 'yellow', 'white'];
function S6({ p }) {
  const c = C.s6;
  const log = useLog();
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 5 : 0);   // 0 — кнопка, 1 — «Настройки», 2 — «КНОПКА», 3 — цвета, 4 — сохранить, 5 — готово
  const [vals, setVals] = useState(solved ? { bg: PAL.orange, fg: PAL.white } : { bg: null, fg: '#000000' });
  const [open, setOpen] = useState(null);
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onSel = (u) => { if (!canTap || st !== 0) return; sfx('tap', true); if (u !== 'b') return; T.hit(); setSt(1); };
  const onSettings = () => { if (!canTap || st !== 1) return; T.hit(); sfx('pop', true); setSt(2); };
  const onSec = (k) => { if (!canTap || st !== 2) return; if (k !== 'btn') { T.miss(c.wrongSec, sayNow); return; } T.hit(); sfx('pop', true); setSt(3); };
  const onSw = (k) => { if (!canTap || st !== 3) return; sfx('tap', true); setOpen((o) => (o === k ? null : k)); };
  const onPick = (n) => {
    if (!canTap || st !== 3 || !open) return;
    if (open === 'bg') {
      if (n !== 'orange') { shake(setBad, n); setVals((v) => Object.assign({}, v, { bg: PAL[n] })); T.miss(c.wrong[n], sayNow); return; }
      T.hit(); sfx('ok', true);
      const nv = Object.assign({}, vals, { bg: PAL.orange }); setVals(nv); setOpen(null);
      if (nv.fg === PAL.white) { setSt(4); sayNow(c.picked, 'smile'); } else sayNow(c.half, 'smile');
      return;
    }
    if (n !== 'white') { shake(setBad, n); setVals((v) => Object.assign({}, v, { fg: PAL[n] })); T.miss(n === 'orange' ? c.wrong.fgOrange : c.wrong.fgYellow, sayNow); return; }
    T.hit(); sfx('ok', true);
    const nv = Object.assign({}, vals, { fg: PAL.white }); setVals(nv); setOpen(null);
    if (nv.bg === PAL.orange) { setSt(4); sayNow(c.picked, 'smile'); }
  };
  const onSave = () => {
    if (!canTap || st !== 4) return;
    sfx('win', true); setSt(5); put({ done: true });
    log(logOf(T, 's6', 'button-color', { value: 'orange/white' }));
    sayNow(c.ok, 'cheer');
  };
  useEffect(() => { if (st >= 2) { const t = setTimeout(() => scrollTopTo('[data-b="b"]'), 120); return () => clearTimeout(t); } return undefined; }, [st >= 2]); // eslint-disable-line react-hooks/exhaustive-deps
  const groot = useRef(null);
  const G = useGuide(groot);
  const need = vals.bg !== PAL.orange ? 'bg' : vals.fg !== PAL.white ? 'fg' : null;
  usePoint2(G, st === 0 ? '[data-b="b"]' : st === 1 ? '[data-b="b"] [data-t="settings"]' : st === 2 ? '[data-v="sec-btn"]'
    : st === 3 && need ? (open === need ? (T.lad.lv >= 3 ? '[data-v="c-' + (need === 'bg' ? 'orange' : 'white') + '"] .tl5-sw' : null) : '[data-t="bsw-' + need + '"]') : st === 4 ? '[data-t="saveclose"]' : null, canTap);
  const th = th5(Object.assign({}, TH_S5, { btnBg: vals.bg, btnFg: vals.fg }));
  const panel = st >= 2 && st <= 4;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 5 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={panel ? 'tl4-panon' : ''}>
            <TPage5 blocks={blocks5(st === 5 ? 'b' : null)} th={th} sel={st >= 1 && st <= 4 ? 'b' : null} lite
              onSel={canTap && st === 0 ? onSel : null} onSettings={canTap && st === 1 ? onSettings : null} setLed={canTap && st === 1} />
            {panel ? (
              <TBlockSet5 sec={st >= 3 ? 'btn' : null} onSec={canTap && st === 2 ? onSec : null} secLed={st === 2 ? 'btn' : null} vals={vals} open={open}
                onSw={canTap && st === 3 ? onSw : null} swLed={st === 3 && open !== need ? need : null} pal={open === 'fg' ? BTN_FG_PAL : BTN_BG_PAL} onPick={canTap ? onPick : null} bad={bad}
                onSave={canTap && st === 4 ? onSave : null} saveLed={st === 4} />
            ) : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S7. ЗАКРЕПЛЕНИЕ «СРАВНИ» — радуга Коди и сайт ученика в двух цветах.
// =============================================================================
function S7({ p }) {
  const c = C.s7;
  const log = useLog();
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [ok, setOk] = useState(solved);
  const [bad, setBad] = useState(false);
  const misses = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const tap = (k) => {
    if (!canTap || ok) return;
    if (k !== 'b') { misses.current += 1; setBad(true); setTimeout(() => setBad(false), 700); sfx('soft', true); sayNow(c.wrong, 'think'); return; }
    sfx('ok', true); setOk(true); put({ done: true });
    log({ screenId: 's7', type: 'compare', correct: true, firstTry: misses.current === 0, attempts: misses.current + 1, hints: 0, depth: 0 });
    sayNow(c.ok, 'cheer');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} />
        <div className="kz-scene tl-scene tl3-cmp">
          {['a', 'b'].map((k) => (
            <button key={k} type="button" data-v={k} disabled={!canTap || ok} className={'tl3-cmp-c' + (ok && k === 'b' ? ' is-ok' : '') + (bad && k === 'a' ? ' is-bad' : '')} onClick={() => tap(k)}>
              <span className="tl3-cmp-l" translate="no">{k.toUpperCase()}</span>
              <TMini5 th={TH_S6} rainbow={k === 'a'} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S8. ПОКАЗ «ШРИФТ» — слово RoboKlub в пяти шрифтах, у каждого характер.
// =============================================================================
const SHOW_FONTS = ['montserrat', 'playfair', 'comfortaa', 'oswald', 'code'];
function S8({ p }) {
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? -1 : null);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: c.say, pose: 'explain' }]);
  const ms = reduceMotion() ? 0.1 : 1;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => setOn(0) }, { wait: 300 * ms }, { say: [{ text: c.steps[0], pose: 'point' }] },
    { act: () => setOn(1) }, { wait: 300 * ms }, { say: [{ text: c.steps[1], pose: 'point' }] },
    { act: () => setOn(2) }, { wait: 300 * ms }, { say: [{ text: c.steps[2], pose: 'smile' }] },
    { act: () => setOn(3) }, { wait: 300 * ms }, { say: [{ text: c.steps[3], pose: 'think' }] },
    { act: () => { setOn(-1); put({ done: true }); } }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const help = useShowHelp(c.help);
  const lit = (i) => on === -1 || on === i || (on === 3 && i === 4);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || c.ask} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} hint={help.now} />
        <div className="kz-scene tl-scene tl5-fshow">
          {SHOW_FONTS.map((k, i) => (
            <span key={k} className={'tl5-fs-row' + (lit(i) ? ' is-on' : '') + (on != null && !lit(i) ? ' is-dim' : '')} translate="no">
              <TFontWord k={k} word="RoboKlub" /><em>{FONTS[k].n}</em>
            </span>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЗАДАНИЕ «КАКОЙ ШРИФТ ПОДХОДИТ?» — 3 раунда: тема сайта → один из трёх шрифтов.
// =============================================================================
const FIT_FONTS = ['playfair', 'montserrat', 'comfortaa'];
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const log = useLog();
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [r, setR] = useState(solved ? c.rounds.length - 1 : 0);
  const [okK, setOkK] = useState(solved ? c.rounds[c.rounds.length - 1].a : null);
  const [bad, setBad] = useState(null);
  const misses = useRef(0);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const R = c.rounds[r];
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const hints = [c.hint1, c.hint2, R.why];
  const tap = (k) => {
    if (!canTap || solved || okK) return;
    if (k !== R.a) { misses.current += 1; shake(setBad, k); sfx('soft', true); sayNow(misses.current >= 2 ? c.hint2 : c.hint1, 'think'); if (misses.current >= 2) lad.bump(); return; }
    sfx('ok', true); setOkK(k);
    if (r === c.rounds.length - 1) {
      put({ done: true });
      log({ screenId: 's9', type: 'font-fit', correct: true, firstTry: misses.current === 0, attempts: c.rounds.length + misses.current, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(R.why, c.ok), 'cheer');
      return;
    }
    sayNow(joinL(c.right, R.why), 'smile');
    tm.current = setTimeout(() => { setR((x) => x + 1); setOkK(null); }, reduceMotion() ? 300 : 1600);
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (hintAt(Math.min(3, lad.lv + 1), hints) || c.ask)} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : hintAt(lad.lv, hints)} />
        <div className="kz-scene tl-scene tl5-fit">
          <div className="tl2-qn" aria-live="polite">
            <span className="tl2-qdots">{c.rounds.map((x, i) => <i key={i} className={i < r || (i === r && okK) ? 'is-done' : i === r ? 'is-now' : ''} />)}</span>
            <b key={r} className="kz-a-drop">{pick(R.q)}</b>
          </div>
          <div key={'o' + r} className="tl5-fit-opts kz-a-drop">
            {FIT_FONTS.map((k) => (
              <button key={k} type="button" data-v={k} disabled={!canTap || solved || !!okK} className={'tl5-fit-o' + (okK === k ? ' is-ok' : '') + (bad === k ? ' is-bad' : '')} onClick={() => tap(k)} translate="no">
                <TFontWord k={k} word={R.word} /><em>{FONTS[k].n}</em>
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ЗАДАНИЕ «СМЕНИ ШРИФТ» — «Настройки сайта» → «Шрифты» → стрелками до Montserrat → «Выбрать» → «Сохранить изменения».
// =============================================================================
function S10({ p }) {
  const c = C.s10;
  const log = useLog();
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [st, setSt] = useState(solved ? 3 : 0);   // 0 — раздел, 1 — шрифт, 2 — сохранить, 3 — готово
  const [i, setI] = useState(0);
  const [bad, setBad] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const n = FONT_ORDER.length;
  const onTab = (k) => { if (!canTap || st !== 0) return; if (k !== 'fonts') { T.miss(c.wrongTab, sayNow); return; } T.hit(); sfx('tap', true); setSt(1); };
  const onPrev = () => { if (!canTap || st !== 1) return; sfx('tap', true); setI((x) => (x + n - 1) % n); };
  const onNext = () => { if (!canTap || st !== 1) return; sfx('tap', true); setI((x) => (x + 1) % n); };
  const onChoose = (k) => {
    if (!canTap || st !== 1) return;
    if (k !== 'montserrat') { shake(setBad, k); T.miss(c.wrong[k], sayNow); return; }
    T.hit(); sfx('ok', true); setSt(2); sayNow(c.picked, 'smile');
  };
  const onSave = () => {
    if (!canTap || st !== 2) return;
    sfx('win', true); setSt(3); put({ done: true });
    log(logOf(T, 's10', 'site-font', { value: 'montserrat' }));
    sayNow(c.ok, 'cheer');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  const atM = FONT_ORDER[i] === 'montserrat';
  usePoint(G, st === 0 ? '[data-v="tab-fonts"]' : st === 1 ? (atM ? '[data-t="choose"]' : '[data-t="next"]') : st === 2 ? '[data-t="savechg"]' : null, canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={st === 3 ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot" ref={groot}>
          <TEd2 project="RoboKlub" cls={st < 3 ? 'tl5-seton' : ''}>
            <TPage5 blocks={blocks5(st === 3 ? 't' : null)} th={st === 3 ? TH_END : TH_S6} />
            {st < 3 ? (
              <TSiteSet tab={st >= 1 ? 'fonts' : null} onTab={canTap && st === 0 ? onTab : null} tabLed={st === 0 ? 'fonts' : null} onSave={canTap && st === 2 ? onSave : null} saveLed={st === 2}>
                {st >= 1 ? <TFonts i={i} chosen={st === 2 ? 'montserrat' : 'tilda'} onPrev={canTap && st === 1 ? onPrev : null} onNext={canTap && st === 1 ? onNext : null}
                  onChoose={canTap && st === 1 ? onChoose : null} nextLed={st === 1 && !atM} chooseLed={st === 1 && atM} bad={bad} word="RoboKlub" /> : null}
              </TSiteSet>
            ) : null}
          </TEd2>
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. ПРОВЕРКА «НАЙДИ 3 ОШИБКИ» — бледный текст, рукописный заголовок, блоки радугой. Нажатие — исправлено.
// =============================================================================
const FIX_KEYS = ['pale', 'font', 'rainbow'];
function S11({ p }) {
  const c = C.s11;
  const log = useLog();
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [fixed, setFixed] = useState(solved ? { pale: 1, font: 1, rainbow: 1 } : {});
  const [flash, setFlash] = useState(null);
  const T = useActTask(c.hints);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const onTap = (k) => {
    if (!canTap || solved) return;
    if (k === 'good' || fixed[k]) { T.miss(c.good, sayNow); return; }
    T.hit(); sfx('ok', true);
    const nf = Object.assign({}, fixed, { [k]: 1 }); setFixed(nf); setFlash(k); setTimeout(() => setFlash(null), 900);
    if (FIX_KEYS.every((x) => nf[x])) {
      put({ done: true }); log(logOf(T, 's11', 'find-mistakes'));
      sayNow(joinL(c.fix[k], c.ok), 'cheer');
    } else sayNow(c.fix[k], 'smile');
  };
  const groot = useRef(null);
  const G = useGuide(groot);
  const next = FIX_KEYS.find((k) => !fixed[k]);
  usePoint(G, solved || T.lad.lv < 3 || !next ? null : next === 'rainbow' ? '[data-v="fx-rainbow0"]' : '[data-v="fx-' + next + '"]', canTap);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved ? null : (T.next() || c.ask)} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={solved ? null : T.now()} err={!!T.msg} />
        <div className="kz-scene tl-scene tl-groot tl5-fixs" ref={groot}>
          <span className="tl5-fcount" aria-live="polite">{FIX_KEYS.map((k) => <i key={k} className={fixed[k] ? 'is-on' : ''} />)}</span>
          <TFix5 fixed={fixed} onTap={canTap && !solved ? onTap : null} flash={flash} />
          {G.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. В НАСТОЯЩЕЙ TILDA — шаги списком; адрес своего сайта (…tilda.ws) или «Сделаю позже».
// =============================================================================
const tildaUrl = (v) => String(v || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(solved ? (store.get('tl5RealUrl') || '') : '');
  const [msg, setMsg] = useState(null);
  const tries = useRef(0);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? (rec.later ? c.okLater : c.ok) : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const check = () => {
    if (!canTap || solved) return;
    tries.current += 1;
    const u = tildaUrl(val);
    if (!/^[a-z0-9][a-z0-9-]*\.tilda\.ws$/.test(u)) { sfx('soft', true); setMsg(c.bad); sayNow(c.bad, 'think'); return; }
    if (u === SITE_URL) { sfx('soft', true); setMsg(c.demo); sayNow(c.demo, 'think'); return; }
    sfx('win', true); setMsg(null); store.set('tl5RealUrl', u); put({ done: true, later: false });
    log({ screenId: 's12', type: 'real-tilda', correct: true, firstTry: tries.current === 1, attempts: tries.current, hints: 0, depth: 0, value: u });
    sayNow(c.ok, 'cheer');
  };
  const later = () => {
    if (!canTap || solved) return;
    sfx('tap', true); put({ done: true, later: true });
    log({ screenId: 's12', type: 'real-tilda', correct: false, firstTry: false, attempts: tries.current, hints: 0, depth: 0, value: 'later' });
    sayNow(c.okLater, 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={nav5(p, canGo)}>
      <Sheet cls="tl-sheet">
        <KzAsk text={c.ask} hint={msg} err={!!msg} />
        <div className="kz-scene tl-scene">
          <ol className="tl-real">{c.todo.map((st, i) => <li key={i}><b>{i + 1}</b><span>{pick(st)}</span></li>)}</ol>
          <div className="tl-real-in">
            <span className="tl-url is-field"><i className="tl-globe" aria-hidden="true" />
              <input value={val} placeholder={pick(c.ph)} aria-label={pick(c.ask)} disabled={solved} data-v="url"
                onChange={(e) => { setVal(e.target.value); setMsg(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } }}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} inputMode="url" enterKeyHint="done" />
            </span>
            {!solved ? (
              <span className="tl-real-btns">
                <button type="button" className="kz-btn is-coral" data-v="check" disabled={!canTap || !val.trim()} onClick={check}>{pick(c.check)}</button>
                <button type="button" className="kz-btn is-ghost" data-v="later" disabled={!canTap} onClick={later}>{pick(c.later)}</button>
              </span>
            ) : null}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S13. ВЫВОД — разгадка, сайт клуба в цветах и шрифте клуба, что умеем, следующий урок.
// =============================================================================
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'shy' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="tl-sheet">
        <div className="kz-scene tl-scene tl-end tl2-end">
          <div className="tl-ed is-live tl2-live" translate="no">
            <div className="tl-url"><i className="tl-globe" aria-hidden="true" /><span>{SITE_URL}</span></div>
            <div className="tl2-canvas"><TPage5 blocks={blocks5()} th={TH_END} /></div>
          </div>
          <div className="kz-roles tl-roles">
            {['riddle', 'color', 'contrast', 'font'].map((k) => (
              <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'riddle' ? '#FA4F28' : k === 'color' ? '#F97316' : k === 'contrast' ? '#1E3A8A' : '#7952B3' }}>
                <i aria-hidden="true" />{pick(c.roles[k])}
              </span>
            ))}
          </div>
          <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 },
  { id: 's4', code: 'SHOW', Comp: S4 }, { id: 's5', code: 'LEVEL-2', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-1', Comp: S9 }, { id: 's10', code: 'LEVEL-2', Comp: S10 },
  { id: 's11', code: 'CHECK', Comp: S11 }, { id: 's12', code: 'CHECK', Comp: S12 },
  { id: 's13', code: 'ACHIEVEMENT', Comp: S13 }
];
const SCREEN_RESET = Object.fromEntries(SCREENS.map((s) => [s.id, [s.id]]));

function lessonTl5Artifact(store) {
  return { type: 'tilda-colors-fonts', colors: { title: PAL.blue, button: PAL.orange, buttonText: PAL.white, page: PAL.cream }, font: 'Montserrat',
    realUrl: store.get('tl5RealUrl') ? 'https://' + store.get('tl5RealUrl') : null };
}

export default function TildaCvetaShrifty({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonTl5Artifact(store) })
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
