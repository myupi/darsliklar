// =============================================================================
// ЭКРАНЫ УРОКА 17 КУРСА CSS «Финальный проект» (облик «Редактор», 11.11.2026). Движок — c17-engine.jsx (копия урока 16
// с картинками-файлами и тегом img). Повторение всего курса: сайт летнего лагеря Коди теряет весь CSS, ученик
// возвращает его за 16 станций — по одной на урок 1–16. Каждая станция — одно действие; страница честная и растёт:
// правила прошлых станций остаются (accTo). Типы заданий чередуются (раздел 3а навыка): сборка правила из кусочков,
// выбор с живым результатом, «впиши значение», «исправь», пары, перетаскивание, переключатель ширины; потом большая
// проверка (пять поломок), верно/неверно, свой стиль («Готово») и вывод с разгадкой. Бумаги нет.
// =============================================================================

// ── ПРАВИЛА СТАНЦИЙ: что вернёт каждая станция (порядок — как в коде сайта) ──
const ST = {
  k1: ['body { background-color: lightyellow; }'],
  k2: ['.karta { color: navy; }'],
  k3: ['.shapka { background-color: #1E9E72; color: white; }'],
  k4: ['.shapka { background-image: url("osmon.jpg"); background-repeat: no-repeat; background-size: cover; }'],
  k5: ['h1 { text-align: center; }'],
  k6: ['.rasm { width: 100%; }'],
  k7: ['.karta { padding: 12px; }'],
  k8: ['.karta { border-radius: 12px; box-shadow: 0 4px 10px silver; border-top: 4px solid #FA4F28; }'],
  k9: ['.menu { display: inline-block; }'],
  k10: ['.qator { display: flex; }'],
  k11: ['.qator { justify-content: space-between; }'],
  k12: ['.karta { position: relative; }', '.yangi { position: absolute; top: -8px; right: -8px; }'],
  k13: ['.tugma:hover { transform: scale(1.1); }'],
  k14: ['.tugma { transition: transform 0.3s; }'],
  k15: ['@keyframes aylan { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }', '.quyosh { animation: aylan 6s linear infinite; }'],
  k16: ['@media (max-width: 600px) { .qator { flex-direction: column; gap: 12px; } .karta { width: 100%; } }']
};
const KS = ['k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k10', 'k11', 'k12', 'k13', 'k14', 'k15', 'k16'];
// Правила станций до n-й (n — номер станции 1…16, её собственные не входят).
const accTo = (n) => [].concat(...KS.slice(0, n - 1).map((k) => ST[k]));
const ALL = accTo(17);
const N_RULES = ALL.length;

// ── СТРАНИЦА: сайт лагеря — шапка с солнцем, меню, фото, абзац, три карточки (у первой — значок «Yangi»), кнопка ──
const site = (pick, hl) => {
  const H = [].concat(hl || []);
  const m = (el) => (H.indexOf(el.k) >= 0 ? Object.assign(el, { hl: true }) : el);
  return [
    m({ t: 'div', cls: 'shapka', k: 'sh', kids: [m({ t: 'h1', k: 'h1', kids: [m({ t: 'span', cls: 'quyosh', k: 'qu', text: '☀' }), ' ' + pick(C.site.title)] })] }),
    m({ t: 'div', cls: 'nav', k: 'nav', kids: C.site.menu.map((x, i) => m({ t: 'div', cls: 'menu', k: 'm' + i, text: pick(x) })) }),
    m({ t: 'img', cls: 'rasm', k: 'img', src: 'lager.jpg', alt: pick(C.site.alt) }),
    m({ t: 'p', k: 'p', text: pick(C.site.lead) }),
    m({ t: 'div', cls: 'qator', k: 'q', kids: C.site.cards.map((x, i) => m({ t: 'div', cls: 'karta', k: 'ka' + i,
      kids: i === 0 ? [m({ t: 'span', cls: 'yangi', k: 'yn', text: pick(C.site.badge) }), ' ' + pick(x)] : [pick(x)] })) }),
    m({ t: 'button', cls: 'tugma', k: 'bt', hoverable: true, text: pick(C.site.button) })
  ];
};
const CARDS = ['ka0', 'ka1', 'ka2'];
const MENUS = ['m0', 'm1', 'm2'];

// ── КАРТА ПУТИ: 16 станций — по одной на урок; горят пройденные, текущая мигает ──
function StMap({ n, done }) {
  const pick = usePick();
  return (
    <div className="c17-map" role="img" aria-label={pick(UI.map) + ': ' + n + '/16'}>
      {KS.map((k, i) => {
        const j = i + 1;
        const st = j < n || (j === n && done) ? ' is-done' : j === n ? ' is-cur' : '';
        return <i key={k} className={'c17-dot' + st} aria-hidden="true">{j === n ? j : null}</i>;
      })}
    </div>
  );
}
// Строка-комментарий в редакторе: «/* готово: 5 правил */» — прошлые станции свёрнуты.
function CmtText({ n }) {
  const pick = usePick();
  const k = accTo(n).length;
  return <span className="c17-cmt" translate="no">{'/* ' + pick(fillL(UI.doneRules, { n: k })) + ' */'}</span>;
}
const cmtLine = (n) => (n > 1 ? [codeLine('cm', [<CmtText key="c" n={n} />], { d: 1, cls: 'c17-cssline c17-dim' })] : []);
const nOf = (id) => parseInt(String(id).slice(1), 10);
const pageOf = (n, extra, base) => withBase(accTo(n).concat(extra || []), base);

// ── «ВПИШИ ЗНАЧЕНИЕ» на станции: tpl — правила станции, в одном метка ▢ (поле); пустое поле — правила нет ──
function StFill({ p, id, c, F, tpl, want, keys, hl, hover, pulse, timer, vw0, slotCls }) {
  const pick = usePick();
  const n = nOf(id);
  const [vw, setVw] = useState(vw0 || null);
  const v = F.T.okNow ? want : noSemi(F.ty.val);
  const items = tpl.map((t) => (t.indexOf('▢') >= 0 ? (v ? t.replace('▢', v) : null) : t)).filter(Boolean);
  const slot = F.T.okNow ? P('v', slotCls || 'c17-val', want) : <Slot key="slot" ty={F.ty} led={F.led} onEnter={F.check} label={c.ask} onChange={F.onChange} />;
  const lines = cmtLine(n).concat(...tpl.map((t, i) => ruleLines('t' + i, 1, t, { cls: t.indexOf('▢') >= 0 ? (F.T.okNow ? 'is-new' : 'is-hl') : 'c17-given' }, { '▢': slot })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={F.speaker} done={F.canGo} hint={hintAt(Math.min(3, F.T.lad.lv + 1), c.hints) || c.ask} nav={navOf(p, F.canGo)}>
      <Sheet cls="c17-sheet c17-fill">
        <StMap n={n} done={F.T.okNow} />
        <KzAsk text={F.T.okNow ? c.ok : c.ask} hint={F.T.okNow ? null : (F.T.msg || hintAt(F.T.lad.lv, c.hints))} err={!!F.T.msg} />
        <div className="kz-scene c17-s5 c17-pair">
          <div className="kz-col">{c.palette ? <Swatch c={c} /> : null}<KzCode lines={styleWrap(lines)} cls="kz-code-sm" />{!F.T.okNow && F.T.lad.lv >= 3 ? <HelpCode code={c.sample || want} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, hl)} rules={pageOf(n, items)} hover={hover && F.T.okNow ? hover : null} mouse={!!((hover || pulse) && F.T.okNow)} pulse={pulse && F.T.okNow ? pulse : null} timer={!!timer} vw={vw} /></Br>{vw0 ? <WidthToggle vw={vw} setVw={setVw} /> : null}</div>
        </div>
        {!F.T.okNow ? <KeyRow keys={keys || []} ty={F.ty} canTap={F.canTap} onCheck={F.check} ready={F.ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}
// Образец цвета из палитры (станция 3): квадрат цвета и код.
function Swatch({ c }) {
  const pick = usePick();
  return (
    <div className="c17-hexchip" translate="no">
      <i style={{ background: c.palette.hex }} aria-hidden="true" />
      <span>{pick(c.palette.name)}</span><b>{c.palette.hex}</b>
    </div>
  );
}

// ── ВЫБОР С ЖИВЫМ РЕЗУЛЬТАТОМ: нажатый вариант сразу встаёт в код и на страницу; неверный — видно, что он делает ──
function StPick({ p, id, c, opts, right, ruleOf, hl, kind }) {
  const pick = usePick();
  const log = useLog();
  const n = nOf(id);
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [cur, setCur] = useState(solved ? right : null);
  const [off, setOff] = useState([]);
  const ok = solved || cur === right;
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ok, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, off.length);
  const ch = useChoiceHints(!ok, 0);
  const hints = c.hints;
  const choose = (v) => {
    if (!canTap || ok || off.indexOf(v) >= 0) return;
    st.current.tries += 1;
    setCur(v);
    if (v !== right) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(v)); sayNow(ch.miss(c.why[v], hints), 'think'); return; }
    sfx('win', true); ch.clear(); put({ done: true });
    log({ screenId: id, type: 'choose-live', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const rules = cur ? ruleOf(cur) : [];
  const lit = ch.lad.lv >= 3;
  const lines = cmtLine(n).concat(...(cur ? rules : ruleOf('▢')).map((t, i) => ruleLines('r' + i + (cur || ''), 1, t, { cls: ok ? 'is-new' : cur ? 'is-hl' : 'is-hl' }, { '▢': <span key="d" className="kz-dash kz-dash-sm c17-pslot" /> })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet c17-pick">
        <StMap n={n} done={ok} />
        <KzAsk text={ok ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} />
        <div className="kz-scene c17-s5 c17-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, hl)} rules={pageOf(n, rules)} /></Br></div>
        </div>
        <div className={'kz-pick c17-opts' + (kind ? ' c17-opts-' + kind : '')}>
          {opts.map((v) => (
            <button key={v} type="button" data-v={v} disabled={!canTap || ok || off.indexOf(v) >= 0} onClick={() => choose(v)}
              className={'kz-btn c17-opt ' + (ok && v === right ? 'is-ok' : off.indexOf(v) >= 0 ? 'is-off' : 'is-ghost') + (lit && v === right && !ok ? ' is-led' : '')}>
              <span translate="no">{v}</span><Led on={led && off.length === 0 && !ok} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// ── СБОРКА ИЗ КУСОЧКОВ: tpl — строки правила с метками ▢0, ▢1 …; кусочки ставятся по порядку (нажать или перетащить в код) ──
function StBuild({ p, id, c, tpl, want, tray, hl, pieceCls, ruleAt }) {
  const pick = usePick();
  const log = useLog();
  const n = nOf(id);
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? want.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === want.length;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const used = (i) => got.indexOf(i) >= 0;
  // Кусочки различаются по номеру в лотке (одинаковых нет).
  const place = (i) => {
    if (!canTap || done || used(i)) return false;
    st.current.tries += 1;
    const need = want[got.length];
    if (tray[i] !== need) {
      st.current.misses += 1;
      const why = (c.why[got.length] && (c.why[got.length][tray[i]] || c.why[got.length]._)) || c.why[got.length];
      sfx('soft', true); setShake(i); setTimeout(() => setShake(null), 520);
      setMsg(why); sayNow(why, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(i);
    setGot(nx);
    if (nx.length === want.length) {
      put({ done: true });
      log({ screenId: id, type: 'build-rule', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((i) => place(i));
  const lit = lad.lv >= 3;
  const vals = solved ? want : got.map((i) => tray[i]);
  const slots = {};
  want.forEach((w, j) => {
    slots['▢' + j] = j < vals.length ? <span key={'s' + j} className={'c17-built c17-a-in ' + (pieceCls[vals[j]] || 'c17-val')}>{vals[j]}</span>
      : <span key={'s' + j} data-place="code" className={'kz-dash kz-dash-sm c17-bslot' + (j === vals.length ? ' is-next' : '') + (dnd.hover === 'code' && j === vals.length ? ' is-hover' : '')} />;
  });
  // На странице — то, что уже поставлено (ruleAt): недособранное правило браузер не понимает.
  const full = want.reduce((s, w, j) => s.replace('▢' + j, w), tpl.join(' '));
  const rules = ruleAt(vals);
  const lines = cmtLine(n).concat(...tpl.map((t, i) => {
    // Строка без «{» (сборка всего правила): селектор и метки — свои куски.
    const ls = t.indexOf('{') < 0 ? [codeLine('b' + i, t.split(/(▢\d+|\s+)/).filter(Boolean).map((x, j) => (/^\s+$/.test(x) ? ' ' : /^▢/.test(x) ? P('m' + j, 'c17-raw', x) : P('w' + j, 'c17-sel c17-part', x))), { d: 1, cls: 'c17-cssline ' + (done ? 'is-new' : 'is-hl') })]
      : ruleLines('b' + i, 1, t, { cls: done ? 'is-new' : 'is-hl' }, null);
    ls.forEach((l) => { l.parts = splitSlots(l.parts, slots); l.place = 'code'; });
    return ls;
  }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet c17-build">
        <StMap n={n} done={done} />
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/' + want.length} />
        <div className={'kz-scene c17-s5 c17-pair' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" />{!done && lad.lv >= 3 ? <HelpCode code={full} /> : null}</div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, hl)} rules={pageOf(n, rules)} /></Br></div>
        </div>
        {!done ? (
          <div className="kz-tray c17-tray">
            {tray.map((t, i) => (used(i) ? null : (
              <button key={i} type="button" disabled={!canTap} data-id={t}
                className={'kz-scrap kz-scrap-code c17-piece' + (shake === i ? ' kz-a-shake' : '') + (lit && t === want[got.length] ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, i, t); }}
                onClick={() => place(i)}>
                <span translate="no">{t}</span><Led on={led && got.length === 0} />
              </button>
            )))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}
// Метки ▢0, ▢1 … в кусках строки: кусок «▢0;» или «{▢0» делится, метка — поле сборки.
function splitSlots(parts, slots) {
  const out = [];
  (parts || []).forEach((x) => {
    const t = x && x.props && typeof x.props.children === 'string' ? x.props.children : null;
    if (t == null || t.indexOf('▢') < 0) { out.push(x); return; }
    t.split(/(▢\d+)/).filter(Boolean).forEach((bit, j) => {
      if (slots[bit]) out.push(slots[bit]);
      else out.push(<span key={(x.key || 'x') + '-' + j} className={x.props.className}>{bit}</span>);
    });
  });
  return out;
}

// =============================================================================
// S1. КРЮЧОК — сайт лагеря во всей красе; сбой стирает весь CSS (страница голая, как браузер по умолчанию);
// «Tuzatish» — появляется путь из 16 станций. Загадка: Коди думает, что нужен «тысяча строк» или чужой шаблон.
// =============================================================================
const HOOK_SHORT = ['body { … }', '.shapka { … }', '.karta { … }', '.qator { … }', '.tugma:hover { … }', '@media (max-width: 600px) { … }'];
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [ph, setPh] = useState(solved ? 2 : 0);   // 0 — красивый сайт, 1 — сбой (CSS стёрт), 2 — путь из 16 станций
  const [glitch, setGlitch] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  useEffect(() => {
    if (ph !== 0 || !spoken || solved) return undefined;
    const t = setTimeout(() => { sfx('soft', true); setGlitch(true); setPh(1); sayNow(c.broken, 'embarrassed'); }, reduceMotion() ? 100 : 500);
    return () => clearTimeout(t);
  }, [spoken, ph]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!glitch) return undefined; const t = setTimeout(() => setGlitch(false), 700); return () => clearTimeout(t); }, [glitch]);
  const canTap = useCanAnswer(spoken) && ph === 1;
  const canGo = useAdvanceGate(solved || ph === 2, spoken);
  const led = useIdleLed(canTap, 0);
  const fix = () => {
    if (!canTap) return;
    sfx('ok', true); setPh(2); put({ done: true });
    sayNow(c.fix, 'point'); say(c.done, 'think');
  };
  const rules = ph === 0 ? withBase(ALL) : withBase([], 'none');
  const lines = ph === 0 ? HOOK_SHORT.map((r, i) => cssL('h' + i, 1, r, { cls: 'c17-given' })).concat([codeLine('more', [<span key="m" className="c17-cmt" translate="no">{'/* ' + pick(fillL(UI.more, { n: N_RULES - HOOK_SHORT.length })) + ' */'}</span>], { d: 1, cls: 'c17-cssline' })])
    : [codeLine('empty', [<span key="e" className="c17-cmt" translate="no">{'/* ' + pick(UI.empty) + ' */'}</span>], { d: 1, cls: 'c17-cssline' })];
  const ask = ph === 0 ? c.askStart : ph === 1 ? c.ask : c.askDone;
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet c17-hook">
        {ph === 2 ? <StMap n={1} done={false} /> : null}
        <KzAsk text={ask} />
        <div className={'kz-scene c17-s5 c17-pair' + (glitch ? ' c17-glitch' : '')}>
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick)} rules={rules} /></Br></div>
        </div>
        {ph === 1 ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={fix}>{pick(UI.fix)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// СТАНЦИИ 1–16 (экраны 2–17)
// =============================================================================
// K1 · урок 1 — правило целиком: body { background-color: lightyellow; } из кусочков (сборка).
const K1_TRAY = [':', 'lightyellow', '}', 'background-color', ';', '{'];
const K1_WANT = ['{', 'background-color', ':', 'lightyellow', ';', '}'];
const K1_CLS = { '{': 'c17-punc', '}': 'c17-punc', ':': 'c17-punc', ';': 'c17-punc', 'background-color': 'c17-prop', lightyellow: 'c17-val' };
function K1({ p }) {
  return <StBuild p={p} id="k1" c={C.k1} tpl={['body ▢0 ▢1▢2 ▢3▢4 ▢5']} want={K1_WANT} tray={K1_TRAY} pieceCls={K1_CLS}
    ruleAt={(v) => (v.length === K1_WANT.length ? ST.k1 : [])} />;
}
// K2 · урок 2 — селектор: только карточки тёмно-синие → .karta (div красит всё, #karta — ничего).
function K2({ p }) {
  return <StPick p={p} id="k2" c={C.k2} opts={['div', '#karta', '.karta']} right=".karta" ruleOf={(v) => [v + ' { color: navy; }']} hl={CARDS} kind="sel" />;
}
// K3 · урок 3 — hex из палитры: .shapka { background-color: ▢; color: white; } → #1E9E72.
function K3({ p }) {
  const c = C.k3;
  const F = useFill('k3', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (colorKey(v) === '#1e9e72') return null;
    if (/^[0-9a-f]{6}$/i.test(v)) return c.msgs.noHash;
    if (/^#[0-9a-f]{1,5}$|^#[0-9a-f]{7,}$/i.test(v)) return c.msgs.len;
    return colorKey(v) ? c.msgs.other : c.msgs.bad;
  });
  return <StFill p={p} id="k3" c={c} F={F} tpl={['.shapka { background-color: ▢; color: white; }']} want="#1E9E72" keys={['#']} hl={['sh']} />;
}
// K4 · урок 4 — фон: картинка повторяется плитками → background-repeat: no-repeat; background-size: cover (перетащить).
const K4_TRAY = ['cover', 'repeat', 'no-repeat'];
const K4_WANT = ['no-repeat', 'cover'];
function K4({ p }) {
  return <StBuild p={p} id="k4" c={C.k4} hl={['sh']} want={K4_WANT} tray={K4_TRAY} pieceCls={{}}
    tpl={['.shapka { background-image: url("osmon.jpg"); background-repeat: ▢0; background-size: ▢1; }']}
    ruleAt={(v) => ['.shapka { background-image: url("osmon.jpg");' + (v[0] ? ' background-repeat: ' + v[0] + ';' : '') + (v[1] ? ' background-size: ' + v[1] + ';' : '') + ' }']} />;
}
// K5 · урок 5 — h1 { text-align: ▢; } → center.
function K5({ p }) {
  const c = C.k5;
  const F = useFill('k5', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === 'center') return null;
    return cssOk('text-align', v) ? c.msgs.other : c.msgs.bad;
  });
  return <StFill p={p} id="k5" c={c} F={F} tpl={['h1 { text-align: ▢; }']} want="center" hl={['h1']} />;
}
// K6 · урок 6 — исправь: .rasm { width: 600px; } (в поле) → 100%.
function K6({ p }) {
  const c = C.k6;
  const F = useFill('k6', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === '100%') return null;
    if (/^\d+(\.\d+)?px$/.test(v)) return c.msgs.px;
    if (/^\d+(\.\d+)?$/.test(v)) return c.msgs.noUnit;
    if (/^\d+(\.\d+)?%$/.test(v)) return c.msgs.otherPct;
    return c.msgs.bad;
  }, 'embarrassed');
  const set0 = useRef(false);
  useEffect(() => { if (!set0.current && !F.T.okNow && !F.ty.val) { set0.current = true; F.ty.setVal('600px'); } }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <StFill p={p} id="k6" c={c} F={F} tpl={['.rasm { width: ▢; }']} want="100%" keys={['%']} hl={['img']} />;
}
// K7 · урок 7 — свойство на месте: .karta { ▢: 12px; } → padding (margin раздвигает карточки, но текст у края).
function K7({ p }) {
  const c = C.k7;
  const F = useFill('k7', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === 'padding') return null;
    if (v === 'margin') return c.msgs.margin;
    if (v === 'border') return c.msgs.border;
    return cssOk(v, '12px') ? c.msgs.other : c.msgs.bad;
  });
  return <StFill p={p} id="k7" c={c} F={F} tpl={['.karta { ▢: 12px; }']} want="padding" hl={CARDS} slotCls="c17-prop" />;
}
// K8 · урок 8 — пары: border-radius / box-shadow / border-top ↔ как выглядит (образцы нарисованы настоящим CSS).
const K8_DECL = { rad: 'border-radius: 12px', sh: 'box-shadow: 0 4px 10px silver', top: 'border-top: 4px solid #FA4F28' };
const K8_TAGS = ['rad', 'sh', 'top'];
const K8_CARDS = ['top', 'rad', 'sh'];
function K8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.k8;
  const [rec, put] = useRec('k8');
  const solved = !!(rec && rec.done);
  const [paired, setPaired] = useState(solved ? K8_TAGS.slice() : []);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = paired.length === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, paired.length * 10 + (sel ? 1 : 0));
  const lit = lad.lv >= 3;
  const nextT = K8_TAGS.find((t) => paired.indexOf(t) < 0);
  const pickCard = (card) => {
    if (!canTap || done || paired.indexOf(card) >= 0) return;
    if (!sel) { setMsg(c.pickFirst); return; }
    st.current.tries += 1;
    if (sel !== card) {
      st.current.misses += 1;
      sfx('soft', true); setShake(card); setTimeout(() => setShake(null), 520);
      const m = c.why[sel];
      setMsg(m); sayNow(m, 'think'); setSel(null);
      if (st.current.misses >= 2) lad.bump();
      return;
    }
    sfx('pop', true); setMsg(null);
    const nx = paired.concat(card);
    setPaired(nx); setSel(null);
    if (nx.length === 3) {
      put({ done: true });
      log({ screenId: 'k8', type: 'match-decor', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  const decl = (k) => cssStyle(K8_DECL[k]);
  const rule = '.karta { ' + paired.map((k) => K8_DECL[k] + ';').join(' ') + ' }';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet c17-k8">
        <StMap n={8} done={done} />
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        {done ? (
          <div className="kz-scene c17-s5 c17-pair">
            <div className="kz-col"><KzCode lines={styleWrap(cmtLine(8).concat(blockOf('k8', ST.k8[0], 'is-new')))} cls="kz-code-sm" /></div>
            <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, CARDS)} rules={pageOf(8, ST.k8)} /></Br></div>
          </div>
        ) : (
          <div className="kz-scene c17-match">
            <div className="c17-match-col">
              {K8_TAGS.map((t) => {
                const ok = paired.indexOf(t) >= 0;
                return (
                  <button key={t} type="button" disabled={!canTap || ok} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                    className={'kz-scrap kz-scrap-code c17-mtag' + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                    <span translate="no">{K8_DECL[t]}</span><Led on={led && !sel && !ok} />
                  </button>
                );
              })}
            </div>
            <div className="c17-match-col">
              {K8_CARDS.map((k) => {
                const ok = paired.indexOf(k) >= 0;
                return (
                  <button key={k} type="button" disabled={!canTap || ok} data-card={k} onClick={() => pickCard(k)}
                    className={'c17-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                    <span className="c17-swt" style={decl(k)} aria-hidden="true">{pick(C.site.cards[0])}</span>
                    <span className="c17-mcard-t">{pick(c.cards[k])}</span>
                    <Led on={led && !!sel && !ok} />
                  </button>
                );
              })}
            </div>
            <div className="c17-match-live" aria-hidden="true"><KzCode lines={[cssL('lv', 0, paired.length ? rule : '.karta { }', { cls: 'is-hl' })]} cls="kz-code-sm" /></div>
          </div>
        )}
      </Sheet>
    </StageB>
  );
}
// K9 · урок 9 — меню столбиком → display: inline-block (block — как было, none — меню пропало).
function K9({ p }) {
  return <StPick p={p} id="k9" c={C.k9} opts={['block', 'inline-block', 'none']} right="inline-block" ruleOf={(v) => ['.menu { display: ' + v + '; }']} hl={MENUS} />;
}
// K10 · урок 10 — .qator { display: ▢; } → flex.
function K10({ p }) {
  const c = C.k10;
  const F = useFill('k10', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === 'flex') return null;
    if (v === 'flexbox') return c.msgs.flexbox;
    return cssOk('display', v) ? c.msgs.other : c.msgs.bad;
  });
  return <StFill p={p} id="k10" c={c} F={F} tpl={['.qator { display: ▢; }']} want="flex" hl={['q']} />;
}
// K11 · урок 11 — justify-content: flex-start / center / space-between.
function K11({ p }) {
  return <StPick p={p} id="k11" c={C.k11} opts={['flex-start', 'center', 'space-between']} right="space-between" ruleOf={(v) => ['.qator { justify-content: ' + v + '; }']} hl={['q']} />;
}
// K12 · урок 12 — значок «Yangi» в угол карточки: position static / relative / absolute (у карточки уже relative).
function K12({ p }) {
  return <StPick p={p} id="k12" c={C.k12} opts={['static', 'relative', 'absolute']} right="absolute" hl={['yn']}
    ruleOf={(v) => ['.karta { position: relative; }', '.yangi { position: ' + v + '; top: -8px; right: -8px; }']} />;
}
// K13 · урок 13 — .tugma:hover { transform: ▢; } → scale(1.1) (принимается scale больше 1 и до 1.5).
function K13({ p }) {
  const c = C.k13;
  const F = useFill('k13', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    const m = /^scale\((\d*\.?\d+)\)$/.exec(v);
    if (m) { const k = parseFloat(m[1]); return k <= 1 ? c.msgs.small : k > 1.5 ? c.msgs.big : null; }
    if (/^scale\d|^scale$/.test(v)) return c.msgs.noParen;
    if (/^rotate/.test(v)) return c.msgs.rotate;
    if (/^translate/.test(v)) return c.msgs.translate;
    return c.msgs.bad;
  });
  return <StFill p={p} id="k13" c={c} F={F} tpl={['.tugma:hover { transform: ▢; }']} want="scale(1.1)" keys={['(', ')', '.']} hl={['bt']} hover="bt" />;
}
// K14 · урок 14 — .tugma { transition: ▢; } → transform 0.3s (принимается transform или all и время до 3 с).
function trOf(v) {
  try {
    const d = document.createElement('div');
    d.style.transition = String(v || '');
    if (!d.style.transition) return null;
    return { prop: d.style.transitionProperty, dur: secOf(d.style.transitionDuration) };
  } catch (e) { return null; }
}
function K14({ p }) {
  const c = C.k14;
  const F = useFill('k14', c, (w) => {
    const v = norm(w);
    if (!v) return c.msgs.empty;
    const t = trOf(v);
    if (!t) return /\d$/.test(v) ? c.msgs.noUnit : c.msgs.bad;
    if (!(t.dur > 0)) return c.msgs.noTime;
    if (t.prop !== 'transform' && t.prop !== 'all') return c.msgs.prop;
    if (t.dur > 3) return c.msgs.slow;
    return null;
  });
  return <StFill p={p} id="k14" c={c} F={F} tpl={['.tugma { transition: ▢; }']} want="transform 0.3s" keys={['.']} hl={['bt']} pulse="bt" timer />;
}
// K15 · урок 15 — имя анимации: .quyosh { animation: ▢ 6s linear infinite; } → aylan (как в @keyframes).
function K15({ p }) {
  const c = C.k15;
  const F = useFill('k15', c, (w) => {
    const v = String(w || '').trim();
    if (!v) return c.msgs.empty;
    if (v === 'aylan') return null;
    if (/^[A-Za-z_][\w-]*$/.test(v)) return c.msgs.miss;
    return c.msgs.bad;
  });
  return <StFill p={p} id="k15" c={c} F={F} tpl={[ST.k15[0], '.quyosh { animation: ▢ 6s linear infinite; }']} want="aylan" hl={['qu']} timer />;
}
// K16 · урок 16 — @media (max-width: 600px) { .qator { flex-direction: ▢; … } } → column; окно своей ширины.
function K16({ p }) {
  const c = C.k16;
  const F = useFill('k16', c, (w) => {
    const v = nows(w);
    if (!v) return c.msgs.empty;
    if (v === 'column') return null;
    if (v === 'row') return c.msgs.row;
    if (v === 'column-reverse' || v === 'row-reverse') return c.msgs.reverse;
    return c.msgs.bad;
  });
  return <StFill p={p} id="k16" c={c} F={F} tpl={['@media (max-width: 600px) { .qator { flex-direction: ▢; gap: 12px; } .karta { width: 100%; } }']} want="column" vw0={360} hl={['q']} />;
}

// =============================================================================
// BOSS. БОЛЬШАЯ ПРОВЕРКА (Error Detective) — тот же сайт, в коде пять поломок, по одной на тему; найти все в любом
// порядке (страница честно показывает каждую: карточки без отступа, фото шире окна, карточки столбиком, серая кнопка,
// меню столбиком). Найденная строка чинится сразу.
// =============================================================================
const BOSS = [
  { bad: '.Karta { padding: 12px; }', ok: ST.k7[0], kind: 'cls', el: 'q' },
  { ok: ST.k5[0] },
  { bad: '.rasm { width: 100; }', ok: ST.k6[0], kind: 'unit', el: 'img' },
  { bad: '.qator { display: flexbox; }', ok: ST.k10[0], kind: 'flex', el: 'q' },
  { ok: ST.k12[1] },
  { bad: '.tugma { background-color: orang; }', ok: '.tugma { background-color: orange; }', kind: 'color', el: 'bt' },
  { bad: '.menu { display inline-block; }', ok: ST.k9[0], kind: 'colon', el: 'nav' }
];
const BOSS_N = BOSS.filter((x) => x.bad).length;
function Boss({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.boss;
  const [rec, put] = useRec('boss');
  const solved = !!(rec && rec.done);
  const [found, setFound] = useState(solved ? BOSS.map((x, j) => j).filter((j) => BOSS[j].bad) : []);
  const [off, setOff] = useState([]);
  const [last, setLast] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found.length === BOSS_N;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const ch = useChoiceHints(!done, found.length);
  const hints = [c.hint1, c.hint2, c.hint3];
  const led = useIdleLed(canTap && !done, found.length * 10 + off.length);
  const next = BOSS.findIndex((x, j) => x.bad && found.indexOf(j) < 0);
  const tap = (j) => {
    if (!canTap || done || found.indexOf(j) >= 0 || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (!BOSS[j].bad) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(j)); setLast(null); sayNow(ch.miss(c.fine, hints), 'think'); return; }
    sfx('win', true); ch.clear(); setOff([]);
    const nx = found.concat(j);
    setFound(nx); setLast(j);
    if (nx.length === BOSS_N) {
      put({ done: true });
      log({ screenId: 'boss', type: 'find-errors', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(c.found[BOSS[j].kind], c.ok), 'cheer');
    } else sayNow(c.found[BOSS[j].kind], 'smile');
  };
  const isFixed = (j) => !BOSS[j].bad || found.indexOf(j) >= 0;
  const cur = BOSS.map((x, j) => (isFixed(j) ? x.ok : x.bad));
  // Остальное — как у готового сайта, кроме правил, что стоят здесь (их подменяют строки проверки).
  // Правила телефона (@media, станция 16) в копии нет: в узком окне урока они ставили бы карточки столбиком,
  // и поломка display: flexbox не была бы видна.
  const replaced = BOSS.map((x) => x.ok).concat([ST.k9[0]], ST.k16);
  const rules = withBase(ALL.filter((r) => replaced.indexOf(r) < 0).concat(cur), 'boss');
  const lit = ch.lad.lv >= 3;
  const lines = [].concat(...cur.map((r, j) => ruleLines('l' + j + (isFixed(j) ? 'f' : ''), 1, r).map((l) => Object.assign(l, {
    cls: l.cls + ' c17-hline' + (BOSS[j].bad && found.indexOf(j) >= 0 ? (last === j ? ' is-new' : ' is-fixed') : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
    onTap: done || found.indexOf(j) >= 0 ? null : () => tap(j), disabled: !canTap || done || found.indexOf(j) >= 0 || off.indexOf(j) >= 0,
    led: !done && ((led && off.length === 0 && found.length === 0 && j === 0) || (lit && j === next))
  }))));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet c17-boss">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : ch.now(hints)} err={ch.err} n={found.length + '/' + BOSS_N} />
        <div className="kz-scene c17-s5 c17-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.title)} short><CssPage els={site(pick, last != null ? [BOSS[last].el] : null)} rules={rules} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Q1. ВЕРНО ИЛИ НЕТ (True / False) — пять фраз по всему курсу.
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.items.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.items[0].t, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, it.why, it.right ? c.yes : c.no);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) { st.current.misses += 1; sfx('soft', true); setOff(v); sayNow(ch.miss(it.why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'q1', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); sayNow(c.items[ii + 1].t, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = (v) => (
    <button key={String(v)} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)}
      className={'kz-btn c17-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="c17-card c17-tf-card kz-a-drop">
              <span className="c17-card-h">{pick(c.card)}</span>
              <p className="c17-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={[cssL('c', 0, it.code)]} cls="kz-code-sm" /> : null}
            <div className="kz-pick c17-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// OWN. СВОЙ СТИЛЬ (Live Code Preview, «Готово») — цвет фона страницы, цвет кнопки и скругление карточек — свои.
const OWN = [{ k: 'myBg', f: 'fa', max: 16 }, { k: 'myBtn', f: 'fb', max: 16 }, { k: 'myRad', f: 'fc', max: 6 }];
const ownRules = (v) => ['body { background-color: ' + v[0] + '; }', '.tugma { background-color: ' + v[1] + '; }', '.karta { border-radius: ' + v[2] + '; }'];
function Own({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.own;
  const store = useStore();
  const [rec, put] = useRec('own');
  const solved = !!(rec && rec.done);
  const [vals, setVals] = useState(OWN.map((o) => store.get(o.k) || ''));
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !vals[0], 0);
  const v = vals.map((x) => noSemi(x));
  const ready = v.every(Boolean);
  const issueAt = (i) => {
    if (i < 2) return cssOk('background-color', norm(v[i])) ? null : fillL(c.msgs.color, { w: v[i] });
    const n = pxOf(v[2]);
    if (n == null) return c.msgs.radius;
    return n > 40 ? c.msgs.range : null;
  };
  const issueOf = () => issueAt(0) || issueAt(1) || issueAt(2);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    const issue = cyrIn(v.join(' ')) || issueOf();
    if (issue) { sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (lad.lv < 1) lad.bump(); return; }
    sfx('win', true); setMsg(null);
    OWN.forEach((o, i) => store.set(o.k, i === 2 ? nows(v[i]) : norm(v[i]))); put({ done: true });
    log({ screenId: 'own', type: 'own-style', correct: true, firstTry: true, attempts: 1, hints: lad.asked.current, depth: lad.lv, bg: v[0], button: v[1], radius: v[2] });
    sayNow(c.ok, 'cheer');
  };
  // Готовые значения сразу видны на странице; неготовое — правила ещё нет.
  const live = ownRules([norm(v[0]), norm(v[1]), nows(v[2])]).filter((r, i) => v[i] && !issueAt(i));
  const field = (i) => (
    <span key={OWN[i].f} className={'kz-gap c17-slot c17-slot-col' + (led && i === 0 ? ' kz-gap-led' : '')} data-f={OWN[i].f}>
      <LessonInput value={vals[i]} onChange={(x) => { setVals(vals.map((y, j) => (j === i ? x : y))); setMsg(null); }} onEnter={confirm} placeholder={L3('…', '…', '…')} label={c.ask} max={OWN[i].max} />
    </span>
  );
  const val = (i) => (solved ? P('v' + i, 'c17-val', v[i]) : field(i));
  const tpl = ['body { background-color: ▢1; }', '.tugma { background-color: ▢2; }', '.karta { border-radius: ▢3; }'];
  const lines = [].concat(...tpl.map((t, i) => ruleLines('o' + i, 1, t, { cls: solved ? 'is-new' : 'is-hl' }, { '▢1': val(0), '▢2': val(1), '▢3': val(2) })));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="c17-sheet kz-typed c17-own">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene c17-s5 c17-pair">
          <div className="kz-col"><KzCode lines={styleWrap(lines)} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(UI.mySite)} url="lager.html" short><CssPage els={site(pick)} rules={withBase(ALL.concat(live))} scroll={1} /></Br></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// FIN. ВЫВОД — разгадка: не «тысяча строк» и не чужой шаблон — около двадцати коротких правил (счёт на экране);
// свой сайт ученика (компьютер и телефон); четыре группы тем курса; дальше — модуль «ИИ».
function Fin({ p }) {
  const pick = usePick();
  const c = C.fin;
  const store = useStore();
  const own = [store.get('myBg') || 'lightyellow', store.get('myBtn') || '#FA4F28', store.get('myRad') || '12px'];
  const [vw, setVw] = useState(800);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  useEffect(() => { if (curK === 'own') setVw(360); }, [curK]);
  const ex = { look: '#1E9E72', box: 'padding', place: 'display: flex', move: '@media' };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="c17-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={pick(UI.mySite)} url="lager.html"><CssPage els={site(pick, vw < 600 ? ['q'] : null)} rules={withBase(ALL.concat(ownRules(own)))} vw={vw} /></Br>
            <WidthToggle vw={vw} setVw={setVw} />
          </div>
          <div className="kz-col kz-s15-side">
            <StMap n={17} done />
            <div className={'c17-count' + (curK === 'riddle' ? ' is-on' : '')} translate="no"><b>{N_RULES}</b><span>{pick(UI.rulesWord)}</span></div>
            <div className="kz-roles">
              {['look', 'box', 'place', 'move'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')}>
                  <i aria-hidden="true" /><span>{pick(c.roles[k])}</span>{curK === k ? <code className="c17-role-ex" translate="no">{ex[k]}</code> : null}
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

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 'k1', code: 'LEVEL-1', Comp: K1 }, { id: 'k2', code: 'LEVEL-2', Comp: K2 }, { id: 'k3', code: 'LEVEL-3', Comp: K3 }, { id: 'k4', code: 'LEVEL-4', Comp: K4 },
  { id: 'k5', code: 'LEVEL-5', Comp: K5 }, { id: 'k6', code: 'LEVEL-6', Comp: K6 }, { id: 'k7', code: 'LEVEL-7', Comp: K7 }, { id: 'k8', code: 'LEVEL-8', Comp: K8 },
  { id: 'k9', code: 'LEVEL-9', Comp: K9 }, { id: 'k10', code: 'LEVEL-10', Comp: K10 }, { id: 'k11', code: 'LEVEL-11', Comp: K11 }, { id: 'k12', code: 'LEVEL-12', Comp: K12 },
  { id: 'k13', code: 'LEVEL-13', Comp: K13 }, { id: 'k14', code: 'LEVEL-14', Comp: K14 }, { id: 'k15', code: 'LEVEL-15', Comp: K15 }, { id: 'k16', code: 'LEVEL-16', Comp: K16 },
  { id: 'boss', code: 'CHECK', Comp: Boss },
  { id: 'q1', code: 'QUIZ', Comp: Q1 },
  { id: 'own', code: 'LEVEL-OWN', Comp: Own },
  { id: 'fin', code: 'ACHIEVEMENT', Comp: Fin }
];
// «Повторить» стирает только экран; свой стиль ученика (myBg, myBtn, myRad) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 'fin') SCREEN_RESET[s.id] = [s.id]; });

// Артефакт урока — сайт лагеря целиком (HTML и CSS) со своим стилем ученика.
function lessonCss17Artifact(store) {
  const v = OWN.map((o) => store.get(o.k) || '');
  if (!v.some(Boolean)) return null;
  const css = BASE_LAGER.concat([TUGMA_BG], ALL, ownRules(v)).map((r) => '      ' + escHtml(r));
  return { type: 'html-page', bg: v[0], button: v[1], radius: v[2], rules: N_RULES,
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <meta name="viewport" content="width=device-width, initial-scale=1">', '    <title>Kodi yozgi lageri</title>', '    <style>'].concat(css,
      ['    </style>', '  </head>', '  <body>', '    <div class="shapka"><h1><span class="quyosh">☀</span> Kodi yozgi lageri</h1></div>',
        '    <div class="nav"><div class="menu">Bosh sahifa</div> <div class="menu">To\'garaklar</div> <div class="menu">Aloqa</div></div>',
        '    <img class="rasm" src="lager.jpg" alt="Lager">', '    <p>Yozda yetti kun: suzish, futbol va robotlar!</p>',
        '    <div class="qator">', '      <div class="karta"><span class="yangi">Yangi</span> Suzish</div>', '      <div class="karta">Futbol</div>', '      <div class="karta">Robototexnika</div>', '    </div>',
        '    <button class="tugma">Yozilish</button>', '  </body>', '</html>']).join('\n') };
}

export default function CssFinalProject({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonCss17Artifact(store) })
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
