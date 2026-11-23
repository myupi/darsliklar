// =============================================================================
// ЭКРАНЫ УРОКА 3 МОДУЛЯ BOOTSTRAP «Загрузка и изображения» (облик «Редактор», 20.11.2026). Набор — bs3-kit.jsx (копия
// урока 2 + экран заданной ширины vw и картинки FILES), похожий сайт — bs3-site.jsx. Страница честная: настоящий
// bootstrap.min.css 6.0.0-alpha.1, class — как набран; экран телефона — 360 px, большая картинка без img-fluid вылезает.
// Показы с сайтом — «как на видео» (курсор tools/mysh). Сценарий — docs/scenarij-bootstrap-03-zagruzka-i-izobrazheniya.md.
// =============================================================================
const PHONE = 360;
const docsPhoneCls = (o) => 'kz-scene b1-tri ms-root' + (o.clip ? ' has-clip' : '') + (o.nav ? ' is-nav' : '') + (o.done ? ' is-done' : '') + (o.ref ? ' is-ref' : '') + (o.show ? ' is-show' : '');
const h1H = (pick) => '<h1>' + escH(pick(C.site.h1)) + '</h1>';
const pH = (t, cls) => '<p' + clsA(cls) + '>' + escH(t) + '</p>';
const imgSrcLine = (k, d, file, cls, alt, extra) => hl(k, d, '<img src="' + file + '"' + (cls ? ' class="' + cls + '"' : '') + ' alt="' + alt + '">', extra);

// ── Проверка слова в class (kind: img | round | spin | fg | ph | phanim; want — строка или список равных ответов).
const KNOWN3 = { img: ['img-fluid', 'img-thumbnail'], round: RAD_SIDES.concat(RAD_SIZES), spin: ['spinner-border', 'spinner-grow'], fg: BS_THEMES.map((t) => 'fg-' + t),
  ph: ['placeholder'], phanim: ['placeholder-wave', 'placeholder-pulse', 'placeholder-glow'] };
const SHORT3 = { fluid: 'img-fluid', thumbnail: 'img-thumbnail', circle: 'rounded-circle', pill: 'rounded-pill', border: 'spinner-border', grow: 'spinner-grow', wave: 'placeholder-wave', pulse: 'placeholder-pulse' };
const OLD3 = /^(img-responsive|img-circle|img-rounded|text-[a-z]+|btn-[a-z]+|alert-[a-z]+)$/;
const NATIVE3 = /^(yumaloq|dumaloq|aylana|doira|burchak|qizil|yashil|sariq|kok|kulrang|binafsha|red|green|yellow|blue|purple|gray|grey|round|kichik|small|tolqin|wave-anim|loading|yuklanish)$/;
const normCls = (raw) => String(raw || '').trim().toLowerCase().replace(/[“”«»"'`‘’ʻʼ;]/g, '').replace(/\s+/g, ' ').replace(/\.$/, '');
function wordIssue(raw, kind, want) {
  const v = normCls(raw);
  const wants = want == null ? KNOWN3[kind] : [].concat(want);
  if (!v) return { k: 'empty' };
  if (/[Ѐ-ӿ]/.test(v)) return { k: 'cyr' };
  if (v[0] === '.') return { k: 'dot' };
  if (/\s/.test(v)) return { k: 'one' };
  if (wants.indexOf(v) >= 0) return null;
  if (OLD3.test(v)) return { k: 'old' };
  if (SHORT3[v] && KNOWN3[kind].indexOf(SHORT3[v]) >= 0) return { k: 'noPrefix', w: SHORT3[v] };
  if (kind === 'fg' && BS_THEMES.indexOf(v) >= 0) return { k: 'noPrefix', w: 'fg-' + v };
  if (NATIVE3.test(v)) return { k: 'native' };
  if (kind === 'fg' && /^(bg|theme)-/.test(v)) return { k: 'fam_fg', w: v };
  if (KNOWN3[kind].indexOf(v) >= 0) return { k: 'other' };
  const fam = Object.keys(KNOWN3).find((x) => KNOWN3[x].indexOf(v) >= 0);
  if (fam) return { k: 'fam', w: v };
  return { k: 'unknown', w: v };
}
const issueText = (is) => (is ? fillL(C.fill.msgs[is.k] || C.fill.msgs.other, { w: is.w || '' }) : null);

function useRounds(n, solved) {
  const [ii, setIi] = useState(solved ? n - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [next, setNext] = useState(false);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0, misses: 0 });
  const rm = useRef(0);
  const advance = () => { setNext(false); setIi((x) => x + 1); setOk(false); rm.current = 0; const a = lad.asked.current; lad.reset(); lad.asked.current = a; };
  return { ii, ok, setOk, next, setNext, lad, st, rm, advance, last: ii === n - 1, done: ok && ii === n - 1 };
}
function useRoundNext(R, spoken) {
  useEffect(() => {
    if (!R.next || !spoken) return undefined;
    const t = setTimeout(() => R.advance(), reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [R.next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
}
// Плашка «не поместилось» над экраном телефона (onWide от BsFrame).
function WideBadge({ pick, wide }) {
  return <span className={'b3-badge' + (wide ? ' is-wide' : ' is-fit')}>{pick(wide ? UI.wide : UI.fit)}</span>;
}
// Курсор по меню сайта: ☰ на телефоне → раздел → пункт. set: { setMenuView, setOpen, setPeek, setPage }.
function navSteps(M, burger, set, grp, item, openNow, after) {
  return [
    { act: () => { if (burger()) M.go('[data-x="burger"]', 0.5, 0.5, { hand: true }); }, wait: M.slow },
    { act: () => { if (burger()) { M.click(); set.setMenuView(true); } set.setPeek(grp); }, wait: 450 }
  ].concat(openNow ? [] : [
    { act: () => M.go('.bd-grp-h[data-g="' + grp + '"]', 0.35, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); set.setOpen(grp); }, wait: 400 }
  ], [
    { act: () => M.go('.bd-item[data-item="' + item + '"]', 0.3, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); set.setPage(item); set.setMenuView(false); if (after) after(); }, wait: 700 },
    { act: () => M.hide() }
  ]);
}
// Есть ли в сцене элемент: ☰ сайта есть, только пока окно сайта узкое — строка задания и подсказка называют ☰, только
// когда он на экране (23.11.2026).
function useHasEl(ref, sel) {
  const [has, setHas] = useState(false);
  useEffect(() => {
    const r = ref.current;
    if (!r) return undefined;
    const upd = () => setHas(!!r.querySelector(sel));
    upd();
    if (typeof MutationObserver === 'undefined') return undefined;
    const mo = new MutationObserver(upd);
    mo.observe(r, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  return has;
}
function useDocsNav(page0, open0) {
  const [page, setPage] = useState(page0);
  const [open, setOpen] = useState(open0);
  const [menuView, setMenuView] = useState(false);
  const [peek, setPeek] = useState(null);
  return { page, open, menuView, peek, set: { setPage, setOpen, setMenuView, setPeek } };
}

// =============================================================================
// S1. КРЮЧОК — экран телефона 360 px: фото робота вылезает за край («sig'madi»). «Bootstrap bilan» — class="img-fluid",
// фото помещается. Загадка: «для каждого телефона нужна своя маленькая копия фото».
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved);
  const [wide, setWide] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !on, 0);
  const turn = () => {
    if (!canTap || on) return;
    sfx('ok', true); setOn(true); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.done, 'smile');
  };
  const cls = on ? 'img-fluid' : null;
  const body = h1H(pick) + pH(pick(C.site.robots)) + imgH('robot.jpg', cls, 'Robot');
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={[hl('h', 0, '<h1>' + pick(C.site.h1) + '</h1>'), hl('p', 0, '<p>' + pick(C.site.robots) + '</p>'), imgSrcLine('i' + on, 0, 'robot.jpg', cls, 'Robot', { cls: on ? 'is-new is-read' : 'is-hl' })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><SitePage pick={pick} body={body} vw={PHONE} onWide={setWide} title={pick(UI.phone)}><WideBadge pick={pick} wide={wide} /></SitePage></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. img-fluid = «не шире родителя» (показ) — экран 360 → 768 → 1200 px без класса (на узких вылезает), потом с img-fluid
// (на узких помещается, на широком фото своего размера — не растягивается).
// =============================================================================
const S2_STATES = [[PHONE, false], [768, false], [1200, false], [PHONE, true], [768, true], [1200, true]];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 5 : 0);
  const [wide, setWide] = useState(false);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); }, wait: 1600 },
    { act: () => { sfx('pop', true); setN(2); } }, { say: [{ text: c.sayNo, pose: 'think' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayFluid, pose: 'wonder' }] },
    { act: () => { sfx('pop', true); setN(4); }, wait: 1600 },
    { act: () => { sfx('pop', true); setN(5); } }, { say: [{ text: c.sayBig, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const [vw, fl] = S2_STATES[n];
  const askText = solved || demo.done ? c.askDone : fillL(fl ? c.askOn : c.askOff, { w: String(vw) });
  const help = useShowHelp(c.help);
  const body = imgH('robot.jpg', fl ? 'img-fluid' : null, 'Robot');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            <KzCode lines={[imgSrcLine('i' + fl, 0, 'robot.jpg', fl ? 'img-fluid' : null, 'Robot', { cls: fl && n === 3 ? 'is-new is-read' : '' })]} cls="kz-code-sm" />
            <div className="b2-parts">
              <span className="b2-part is-on" style={{ '--c': '#0FA38E' }}><b translate="no">{vw} px</b>{pick(c.screenL)}</span>
              <span className="b2-part is-on" style={{ '--c': '#FA4F28' }}><b translate="no">800 px</b>{pick(c.photoL)}</span>
            </div>
          </div>
          <div className="kz-col"><SitePage pick={pick} body={body} vw={vw} onWide={setWide} title={vw + ' px'}><WideBadge pick={pick} wide={wide} /></SitePage></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// X1. ОПЫТ — переключатели ширины экрана (телефон 360, планшет 768, ноутбук 1200) и img-fluid. Готово — все три ширины
// и класс включён и выключен хотя бы раз.
// =============================================================================
const X1_W = [['phone', PHONE], ['tablet', 768], ['laptop', 1200]];
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [vw, setVw] = useState(PHONE);
  const [fl, setFl] = useState(false);
  const [seen, setSeen] = useState(solved ? { 360: 1, 768: 1, 1200: 1, on: 1, off: 1 } : { 360: 1, off: 1 });
  const [wide, setWide] = useState(false);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, Object.keys(seen).length);
  const mark = (nv, nf) => {
    const s2 = Object.assign({}, seen, { [nv]: 1, [nf ? 'on' : 'off']: 1 });
    setSeen(s2);
    st.current.tries += 1;
    if (st.current.tries >= 6 && !ok) lad.bump();
    if (!ok && s2[360] && s2[768] && s2[1200] && s2.on && s2.off) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer'); say(c.done, 'smile');
      return true;
    }
    return false;
  };
  const tapW = (w) => { if (!canTap) return; sfx('tap', true); setVw(w); if (!mark(w, fl)) sayNow(fl ? c.fits : w === 1200 ? c.bigOk : c.cut, fl || w === 1200 ? 'point' : 'think'); };
  const tapF = () => { if (!canTap) return; sfx('tap', true); const nf = !fl; setFl(nf); if (!mark(vw, nf)) sayNow(nf ? c.on : c.off, 'point'); };
  const body = imgH('robot.jpg', fl ? 'img-fluid' : null, 'Robot');
  const all = ['360', '768', '1200'].filter((k) => seen[k]).length;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} />
        <div className="kz-scene b1-pair b3-x1">
          <div className="kz-col"><KzCode lines={[imgSrcLine('i' + fl, 0, 'robot.jpg', fl ? 'img-fluid' : null, 'Robot', { cls: 'is-new' })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><SitePage pick={pick} body={body} vw={vw} onWide={setWide} title={vw + ' px'}><WideBadge pick={pick} wide={wide} /></SitePage></div>
        </div>
        <div className="b2-pult">
          <div className="b2-pult-row">
            <span className="b2-pult-h">{pick(c.widthH)} <i>{all}/3</i></span>
            {X1_W.map(([k, w]) => (
              <button key={k} type="button" className={'b2-chip is-shape' + (vw === w ? ' is-on' : '') + (seen[w] ? ' is-seen' : '')} onClick={() => tapW(w)} disabled={!canTap} data-w={w}>
                <span>{pick(c[k])}</span><span translate="no" className="b3-px">{w}</span><Led on={led && !ok && !seen[w]} />
              </button>
            ))}
          </div>
          <div className="b2-pult-row">
            <span className="b2-pult-h">class</span>
            <button type="button" className={'b1-sw' + (fl ? ' is-on' : '')} onClick={tapF} disabled={!canTap} aria-pressed={fl ? 'true' : 'false'} data-sw="fluid">
              <i aria-hidden="true" /><span translate="no">img-fluid</span><Led on={led && !ok && !(seen.on && seen.off)} />
            </button>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ПОКАЗ «КАК НА ВИДЕО»: СЛОВО С САЙТА (g1, g2) — меню (☰) → раздел → страница → начало раздела → курсор двойным щелчком
// выделяет слово в строке кода, Ctrl+C → слово встаёт в class у img → страница меняется.
// =============================================================================
function WordShow({ p, id, c, from, fromOpen, grp, to, block, ln, word, code, page, vw }) {
  const pick = usePick();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? to : from, solved ? grp : fromOpen);
  const [scroll, setScroll] = useState(solved ? block : null);
  const [wsel, setWsel] = useState(solved ? { i: ln, w: word } : null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 — меню; 2 — страница; 3 — слово; 4 — в class
  const [view, setView] = useState(solved);
  const [wide, setWide] = useState(false);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const LN = '.bd-code[data-code="' + block + '"] [data-ln="' + ln + '"]';
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, grp, to, fromOpen === grp, () => { setN(2); setScroll('sec:' + block); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll(block), wait: 500 },
      { act: () => M.go(LN, 0.32, 0.55), wait: M.slow },
      { act: () => { M.click(); setTimeout(() => M.click(), 160); setWsel({ i: ln, w: word }); setN(3); }, wait: 700 },
      { act: () => { M.card({ t: 'Ctrl + C' }); sfx('pop', true); }, wait: 900 },
      { act: () => { M.card(null); M.hide(); sfx('ok', true); setN(4); setView(true); }, wait: 800 },
      { say: [{ text: c.sayApply, pose: 'wonder' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askWord, c.askApply][n];
  const help = useShowHelp(c.help);
  const on = n >= 4;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} scrollTo={scroll} scrollKey={String(view) + n} lines={{ [block]: { word: wsel } }} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={code(on, n)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={page(on)} vw={vw} onWide={setWide} title={pick(UI.phone)}>{vw ? <WideBadge pick={pick} wide={wide} /> : null}</SitePage></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}
function G1({ p }) {
  const pick = usePick();
  const code = (on) => [hl('h', 0, '<h1>' + pick(C.site.h1) + '</h1>'), imgSrcLine('i' + on, 0, 'robot.jpg', on ? 'img-fluid' : null, 'Robot', { cls: on ? 'is-new is-read' : 'is-hl' })];
  const page = (on) => h1H(pick) + imgH('robot.jpg', on ? 'img-fluid' : null, 'Robot');
  return <WordShow p={p} id="g1" c={C.g1} from="Button" fromOpen="comp" grp="content" to="Images" block="responsive" ln={0} word="img-fluid" code={code} page={page} vw={PHONE} />;
}
function G2({ p }) {
  const pick = usePick();
  const code = (on) => [hl('h', 0, '<h1>' + pick(C.site.h1) + '</h1>'), imgSrcLine('i' + on, 0, 'murabbiy.jpg', 'img-fluid' + (on ? ' rounded-circle' : ''), 'Murabbiy', { cls: on ? 'is-new is-read' : 'is-hl' }), hl('p', 0, '<p>' + pick(C.site.coach) + '</p>')];
  const page = (on) => h1H(pick) + imgH('murabbiy.jpg', 'img-fluid' + (on ? ' rounded-circle' : ''), 'Murabbiy') + pH(pick(C.site.coach));
  return <WordShow p={p} id="g2" c={C.g2} from="Images" fromOpen="content" grp="util" to="Border radius" block="sizes" ln={10} word="rounded-circle" code={code} page={page} vw={PHONE} />;
}

// =============================================================================
// T1. САМ — фото команды вылезает; найти в меню Images, нажать строку с img-fluid (слово выделяется и копируется),
// нажать строку img в коде — слово встаёт в class. Не та страница или строка — причина.
// =============================================================================
function T1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t1;
  const [rec, put] = useRec('t1');
  const solved = !!(rec && rec.done);
  const D = useDocsNav(solved ? 'Images' : 'Install', solved ? 'content' : 'start');
  const [clip, setClip] = useState(solved);
  const [tried, setTried] = useState(null);
  const [pasted, setPasted] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [wide, setWide] = useState(false);
  const lad = useKzLadder(!pasted);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || pasted, spoken);
  const lv = lad.lv;
  const led = useIdleLed(canTap && !pasted, (D.page === 'Images' ? 1 : 0) + (clip ? 2 : 0));
  const miss = (m) => { st.current.misses += 1; sfx('soft', true); setMsg(m); sayNow(m, 'think'); if (st.current.misses >= 2) lad.bump(); };
  const nav = (it) => {
    if (!canTap || pasted) return;
    D.set.setPage(it); D.set.setMenuView(false);
    if (it !== 'Images') { miss(fillL(c.msgs.wrongPage, { w: it })); return; }
    sfx('ok', true); setMsg(null);
  };
  const onResp = () => { if (!canTap || pasted) return; st.current.tries += 1; setTried('responsive'); sfx('pop', true); setClip(true); setMsg(c.copied); };
  const onThumb = () => { if (!canTap || pasted) return; st.current.tries += 1; setTried('thumb'); miss(c.msgs.thumb); };
  const paste = () => {
    if (!canTap || pasted) return;
    if (!clip) { miss(c.msgs.noClip); return; }
    sfx('win', true); setPasted(true); setMsg(null); put({ done: true });
    log({ screenId: 't1', type: 'find-copy-word', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const onImg = D.page === 'Images';
  const scene = useRef(null);
  const burger = useHasEl(scene, '[data-x="burger"]');
  // ☰ горит сразу, пока меню закрыто (23.11.2026: «найди в меню», а меню не видно); внутри меню — по ступеням, как было.
  const lit = pasted ? null : !onImg ? (burger && !D.menuView ? 'burger' : lv >= 2 ? (D.open === 'content' ? 'item:Images' : 'grp:content') : null) : null;
  const hints = burger ? [c.hintMenu].concat(c.hints.slice(1)) : c.hints;
  const imgLine = pasted ? imgSrcLine('i', 1, 'jamoa.jpg', 'img-fluid', 'Jamoa', { cls: 'is-new' })
    : { k: 'slot', d: 1, cls: 'b1-line b1-slot' + (clip ? ' is-on' : ''), onTap: paste, disabled: !canTap, led: clip && (led || lv >= 3),
      parts: hParts('<img src="jamoa.jpg" class="').concat([<span key="ps" className="b1-paste">{'✎ ' + pick(UI.paste)}</span>], hParts('" alt="Jamoa">')) };
  const body = h1H(pick) + imgH('robot.jpg', 'img-fluid', 'Robot') + imgH('jamoa.jpg', pasted ? 'img-fluid' : null, 'Jamoa');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lv + 1), hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={pasted ? c.ok : clip ? c.askPaste : onImg ? c.ask : burger ? c.askFind : c.askFindSide} hint={pasted ? null : (msg || hintAt(lv, hints))} err={!!msg && msg !== c.copied} />
        <div ref={scene} className={docsPhoneCls({ clip, nav: !clip, done: pasted })}>
          {!pasted ? <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} onOpen={(x) => canTap && D.set.setOpen(x)} onNav={nav} navOff={!canTap} copyOff lit={lit} menuView={D.menuView} onMenu={() => D.set.setMenuView((x) => !x)} scrollTo={onImg ? 'sec:responsive' : null} scrollKey={D.page}
            lines={{ responsive: { onLine: onResp, sel: tried === 'responsive' ? 0 : null, word: clip ? { i: 0, w: 'img-fluid' } : null, lineLed: lv >= 3 ? 0 : null, lineOff: !canTap }, thumb: { onLine: onThumb, sel: tried === 'thumb' ? 0 : null, lineOff: !canTap } }} /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={[hl('h', 1, '<h1>' + pick(C.site.h1) + '</h1>'), imgSrcLine('r', 1, 'robot.jpg', 'img-fluid', 'Robot'), imgLine]} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} vw={PHONE} onWide={setWide} title={pick(UI.phone)}><WideBadge pick={pick} wide={wide} /></SitePage></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. УГЛЫ (показ) — фото тренера (квадрат) и фото команды (прямоугольник): rounded → rounded-circle (круг и овал) →
// у команды rounded-pill (капсула).
// =============================================================================
const S5_STEPS = [[null, null], ['rounded', 'rounded'], ['rounded-circle', 'rounded-circle'], ['rounded-circle', 'rounded-pill']];
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayRounded, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(2); } }, { say: [{ text: c.sayCircle, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.sayPill, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askRounded, c.askCircle, c.askPill][n];
  const help = useShowHelp(c.help);
  const [a, b] = S5_STEPS[n];
  const ca = 'img-fluid' + (a ? ' ' + a : ''), cb = 'img-fluid' + (b ? ' ' + b : '');
  const body = '<div style="display:grid;grid-template-columns:1fr 2fr;gap:10px;align-items:center">' + imgH('murabbiy.jpg', ca, 'Murabbiy') + imgH('jamoa.jpg', cb, 'Jamoa') + '</div>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={[imgSrcLine('a' + n, 0, 'murabbiy.jpg', ca, 'Murabbiy', { cls: n === 1 || n === 2 ? 'is-new is-read' : '' }), imgSrcLine('b' + n, 0, 'jamoa.jpg', cb, 'Jamoa', { cls: n >= 1 ? 'is-new is-read' : '' })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><SitePage pick={pick} body={body} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// ЗАДАНИЕ С ПОЛЕМ В CLASS (t2–t5) — раунды: строка кода с полем, страница меняется при наборе (честно), образец «Kerak»,
// справка — страница сайта. «Tekshirish» или Enter. round: { kind, want, line(field), body(v), goal, vw, ask, hints, why, ph }
// =============================================================================
function FillRounds({ p, id, c, rounds, docs, type }) {
  const pick = usePick();
  const log = useLog();
  const [rec, put] = useRec(id);
  const solved = !!(rec && rec.done);
  const R = useRounds(rounds.length, solved);
  const RR = rounds[R.ii];
  const want0 = [].concat(RR.want)[0];
  const [val, setVal] = useState(solved ? want0 : '');
  const [msg, setMsg] = useState(null);
  const [wide, setWide] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || R.done, spoken);
  useRoundNext(R, spoken);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setVal(''); setMsg(null); }, [R.ii]);
  const led = useIdleLed(canTap && !R.ok && !val, R.ii);
  const check = () => {
    if (!canTap || R.ok) return;
    R.st.current.tries += 1;
    const is = wordIssue(val, RR.kind, RR.want);
    if (is) {
      R.st.current.misses += 1; R.rm.current += 1; sfx('soft', true);
      const m = (RR.no && RR.no[normCls(val)]) || issueText(is);   // своя причина для варианта (rounded-pill на квадрате)
      const t = R.rm.current >= 2 && R.lad.lv > 0 ? joinL(m, hintAt(R.lad.lv, RR.hints)) : m;
      setMsg(t); sayNow(t, 'think'); if (R.rm.current >= 2) R.lad.bump();
      return;
    }
    sfx('ok', true); R.setOk(true); setMsg(null); setVal(normCls(val));
    const line = joinL(C.fill.right, (RR.okWhy && RR.okWhy[normCls(val)]) || RR.why);   // своё пояснение для второго верного (rounded-pill на квадрате)
    if (R.last) {
      put({ done: true });
      log({ screenId: id, type: type, correct: true, firstTry: R.st.current.misses === 0, attempts: R.st.current.tries, hints: R.lad.asked.current, depth: R.lad.lv });
      sayNow(joinL(line, c.done), 'cheer');
    } else { sayNow(line, 'smile'); R.setNext(true); }
  };
  const v = normCls(val);
  const field = R.ok ? <span key="f" className="b1-st b2-done">{v || want0}</span>
    : <span key="f" className={'kz-gap b1-slotin b2-field' + (led ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { setVal(x); setMsg(null); }} onEnter={check} placeholder={RR.ph || L3('…', '…', '…')} label={RR.ask} max={28} /></span>;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, R.lad.lv + 1), RR.hints) || RR.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={R.done ? c.done : RR.ask} hint={R.ok ? null : (msg || hintAt(R.lad.lv, RR.hints))} err={!!msg} n={rounds.length > 1 ? (R.ii + 1) + '/' + rounds.length : null} />
        <div className={docs ? docsPhoneCls({ ref: true, done: R.done }) : 'kz-scene b1-pair'} key={'r' + R.ii}>
          {docs && !R.done ? <div className="kz-col b1-tri-docs"><DocsBr page={docs.page}><BsDocs page={docs.page} only={RR.only || docs.only} copyOff /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code">
            {RR.goal ? <Goal pick={pick} html={RR.goal} zoom={RR.gz} /> : null}
            <KzCode lines={RR.line(field)} cls="kz-code-sm" />
          </div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={RR.body(R.ok ? (v || want0) : v)} vw={RR.vw} onWide={setWide} title={pick(RR.vw ? UI.phone : C.site.title)}>{RR.vw ? <WideBadge pick={pick} wide={wide} /> : null}</SitePage></div>
        </div>
        {!R.done ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap || R.ok || !v} onClick={check}>{pick(UI.check)}<Led on={canTap && !R.ok && !!v && led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}
const lineCls = (k, d, o, extra) => ({ k, d, cls: 'b1-line is-hl' + (extra ? ' ' + extra : ''), parts: clsParts(o) });
// Строка с полем в class и атрибутами после него: <img src=… class="before [поле]" alt="…">, <div class="[поле]" role="status">.
function clsLineA(o, tail) {
  const parts = clsParts(o);
  parts.pop();   // «>»
  (tail || []).forEach((a, j) => parts.push(<React.Fragment key={'ts' + j}>{sp()}</React.Fragment>, <span key={'ta' + j} className="b1-at">{a[0]}</span>, pn('te' + j, '='), <span key={'tv' + j} className="b1-st">{'"' + a[1] + '"'}</span>));
  parts.push(pn('tg', '>'));
  return parts;
}
const imgField = (file, alt, before) => (f) => [{ k: 'i', d: 0, cls: 'b1-line is-hl', parts: clsLineA({ tag: 'img', attrs: [['src', file]], before, field: f }, [['alt', alt]]) }];
const goalImg = (file, cls, w) => '<img src="' + file + '" class="' + cls + '" alt="" style="width:' + w + 'px;max-width:100%">';

// T2 — углы по образцу.
function T2({ p }) {
  const pick = usePick();
  const c = C.t2;
  const mk = (file, alt, want, gw) => ({ kind: 'round', want, line: imgField(file, alt, 'img-fluid'), body: (v) => imgH(file, 'img-fluid ' + v, alt), vw: PHONE, goal: goalImg(file, [].concat(want)[0], gw), gz: 0.6, ph: L3('rounded…', 'rounded…', 'rounded…') });
  const rounds = [
    // 23.11.2026: на квадратном фото rounded-pill рисует тот же круг — тоже верно, со своим пояснением; углы — rounded и rounded-1…9.
    Object.assign(mk('murabbiy.jpg', 'Murabbiy', ['rounded-circle', 'rounded-pill'], 90), { ask: c.ask1, hints: c.hints1, why: c.why1, okWhy: { 'rounded-pill': c.why1pill } }),
    Object.assign(mk('jamoa.jpg', 'Jamoa', ['rounded', 'rounded-1', 'rounded-2', 'rounded-3', 'rounded-4', 'rounded-5', 'rounded-6', 'rounded-7', 'rounded-8', 'rounded-9'], 200), { ask: c.ask2, hints: c.hints2, why: c.why2 }),
    Object.assign(mk('jamoa.jpg', 'Jamoa', 'rounded-pill', 200), { ask: c.ask3, hints: c.hints3, why: c.why3 })
  ];
  return <FillRounds p={p} id="t2" c={c} rounds={rounds} docs={{ page: 'Border radius', only: 'sizes' }} type="rounded-by-sample" />;
}

// =============================================================================
// S9. ЗАГРУЗКА (показ) — страница грузится: пусто, только заголовок → «ничего не происходит» → со спиннером → фото
// появились. role="status" и скрытый текст «Loading…» — для экранного диктора.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 4 : 0);   // 0 — пусто; 1 — спиннер в коде; 2 — крутится; 3 — фото пришло; 4 — role
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'think' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.saySpin, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(3); }, wait: 900 }, { say: [{ text: c.sayLoaded, pose: 'wonder' }] },
    { act: () => setN(4) }, { say: [{ text: c.sayRole, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askSpin, c.askSpin, c.askLoaded, c.askRole][n];
  const help = useShowHelp(c.help);
  const loaded = n >= 3;
  const spinLines = [hl('s0', 1, '<div class="spinner-border" role="status">', { cls: n === 1 ? 'is-new is-read' : n === 4 ? 'is-read' : '' }), hl('s1', 2, '<span class="visually-hidden">Loading…</span>', { cls: n === 4 ? 'is-read' : '' }), hl('s2', 1, '</div>')];
  const lines = [hl('h', 0, '<h1>' + pick(C.site.h1) + '</h1>')].concat(n >= 1 && !loaded ? spinLines : [], loaded ? [imgSrcLine('i', 0, 'robot.jpg', 'img-fluid rounded', 'Robot', { cls: n === 3 ? 'is-new' : '' })] : [], n === 4 ? spinLines.map((l) => Object.assign({}, l, { cls: l.cls + ' b3-ghost' })) : []);
  const body = h1H(pick) + (n >= 1 && !loaded ? spinH('spinner-border') : '') + (loaded ? imgH('robot.jpg', 'img-fluid rounded', 'Robot') : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col"><SitePage pick={pick} body={body} vw={PHONE} title={pick(UI.phone)}>{!loaded ? <span className="b3-load">{pick(UI.loading)}</span> : null}</SitePage></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// G3. СПИННЕР С САЙТА (показ «как на видео») — меню → Components → Spinner → значок копирования у Border spinner → три строки
// в body → крутится; Variants: строка fg-primary загорается → у нашего спиннера fg-primary — синий.
// =============================================================================
function G3({ p }) {
  const pick = usePick();
  const c = C.g3;
  const [rec, put] = useRec('g3');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Spinner' : 'Border radius', solved ? 'comp' : 'util');
  const [scroll, setScroll] = useState(solved ? 'svariants' : null);
  const [copied, setCopied] = useState(null);
  const [mark, setMark] = useState(null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 — меню; 2 — страница; 3 — вставлено; 4 — fg-primary
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Spinner', false, () => { setN(2); setScroll('sec:border'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => setScroll('border'), wait: 500 },
      { act: () => M.go('.bd-code[data-code="border"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
      { act: () => { M.click(); setCopied('border'); }, wait: 700 },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayPaste, pose: 'wonder' }] },
      { act: () => { setView(false); setScroll('svariants'); setMark({ svariants: [0] }); }, wait: 600 },
      { act: () => M.go('.bd-code[data-code="svariants"] [data-ln="0"]', 0.55, 0.5), wait: M.slow },
      { act: () => { M.hide(); sfx('ok', true); setN(4); setView(true); }, wait: 800 },
      { say: [{ text: c.sayColor, pose: 'point' }] },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askPaste, c.askColor][n];
  const help = useShowHelp(c.help);
  const cls = 'spinner-border' + (n >= 4 ? ' fg-primary' : '');
  const lines = [hl('h', 1, '<h1>' + pick(C.site.h1) + '</h1>')].concat(n >= 3
    ? [hl('s0' + n, 1, '<div class="' + cls + '" role="status">', { cls: n >= 3 ? 'is-new is-read' : '' }), hl('s1', 2, '<span class="visually-hidden">Loading…</span>', { cls: n === 3 ? 'is-new' : '' }), hl('s2', 1, '</div>', { cls: n === 3 ? 'is-new' : '' })]
    : [quietSlot('slot', 1, pick, !!copied)]);
  const body = h1H(pick) + (n >= 3 ? spinH(cls) : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view && n < 3, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} copied={copied} mark={mark} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} vw={PHONE} title={pick(UI.phone)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T3 — спиннер по образцу: кольцо, точка, красное кольцо.
function T3({ p }) {
  const pick = usePick();
  const c = C.t3;
  const spinLine = (before) => (f) => [{ k: 's', d: 0, cls: 'b1-line is-hl', parts: clsLineA({ tag: 'div', attrs: [], before, field: f }, [['role', 'status']]) }, hl('s1', 1, '<span class="visually-hidden">Loading…</span>'), hl('s2', 0, '</div>')];
  const body = (cls) => spinH(cls);   // только спиннер: на маленьком телефоне окно страницы низкое, результат должен быть виден
  const rounds = [
    { kind: 'spin', want: 'spinner-border', line: spinLine(null), body: (v) => body(v), goal: spinH('spinner-border'), gz: 1, only: 'border', ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('spinner-…', 'spinner-…', 'spinner-…') },
    { kind: 'spin', want: 'spinner-grow', line: spinLine(null), body: (v) => body(v), goal: spinH('spinner-grow'), gz: 1, only: 'grow', ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('spinner-…', 'spinner-…', 'spinner-…') },
    { kind: 'fg', want: 'fg-danger', line: spinLine('spinner-border'), body: (v) => body('spinner-border ' + v), goal: spinH('spinner-border fg-danger'), gz: 1, only: 'svariants', ask: c.ask3, hints: c.hints3, why: c.why3, ph: L3('fg-…', 'fg-…', 'fg-…') }
  ];
  return <FillRounds p={p} id="t3" c={c} rounds={rounds} docs={{ page: 'Spinner', only: 'grow' }} type="spinner" />;   // справка по раунду — only у раунда (23.11.2026)
}

// =============================================================================
// S12. ЗАГЛУШКИ (показ «как на видео») — меню → Components → Placeholder → пример: обычная карточка и «карточка-загрузка»;
// у нас: серые полосы с волной вместо подписи к фото → через 2 с подпись пришла.
// =============================================================================
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const D = useDocsNav(solved ? 'Placeholder' : 'Spinner', 'comp');
  const [scroll, setScroll] = useState(solved ? 'animation' : null);
  const [exHl, setExHl] = useState(null);
  const [mark, setMark] = useState(null);
  const [n, setN] = useState(solved ? 4 : 0);   // 1 — меню; 2 — пример; 3 — у нас заглушки; 4 — текст пришёл
  const [view, setView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [{ act: () => setN(1) }].concat(
    navSteps(M, burger, D.set, 'comp', 'Placeholder', true, () => { setN(2); setScroll('sec:example'); setExHl('example'); }), [
      { say: [{ text: c.sayPage, pose: 'point' }] },
      { act: () => { setExHl(null); setScroll('animation'); setMark({ animation: [0, 1, 2] }); }, wait: 700 },
      { act: () => M.go('.bd-code[data-code="animation"] [data-ln="1"]', 0.5, 0.5), wait: M.slow },
      { say: [{ text: c.sayCode, pose: 'point' }] },
      { act: () => { M.hide(); sfx('ok', true); setN(3); setView(true); }, wait: 800 },
      { say: [{ text: c.sayOurs, pose: 'wonder' }] },
      { act: () => { sfx('ok', true); setN(4); }, wait: 900 },
      { say: [{ text: c.done, pose: 'smile' }] },
      { act: () => put({ done: true }) }
    ]) });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : [c.askStart, c.askMenu, c.askPage, c.askOurs, c.askLoaded][n];
  const help = useShowHelp(c.help);
  const phLines = [hl('p0', 1, '<p class="placeholder-wave">', { cls: n === 3 ? 'is-new is-read' : '' }), hl('p1', 2, '<span class="placeholder col-6"></span>', { cls: n === 3 ? 'is-new is-read' : '' }), hl('p2', 2, '<span class="placeholder col-8"></span>', { cls: n === 3 ? 'is-new' : '' }), hl('p3', 1, '</p>')];
  const lines = [hl('h', 1, '<h1>' + pick(C.site.h1) + '</h1>')].concat(n === 3 ? phLines : n >= 4 ? [hl('t', 1, '<p>' + pick(C.site.team) + '</p>', { cls: 'is-new' })] : [quietSlot('slot', 1, pick, false)]);
  const body = h1H(pick) + (n === 3 ? '<p class="placeholder-wave"><span class="placeholder col-6"></span> <span class="placeholder col-8"></span></p>' : n >= 4 ? '<p>' + escH(pick(C.site.team)) + '</p>' : '');
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={docsPhoneCls({ clip: view, nav: !view, show: true })}>
          <div className="kz-col b1-tri-docs"><DocsBr page={D.page}><BsDocs page={D.page} open={D.open} navOff copyOff menuView={D.menuView} peek={D.peek} exHl={exHl} mark={mark} scrollTo={scroll} scrollKey={String(view) + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} vw={PHONE} title={pick(UI.phone)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// T4 — заглушка: слово placeholder, потом волна у родителя.
function T4({ p }) {
  const pick = usePick();
  const c = C.t4;
  const img = '';   // только полоса: на маленьком телефоне окно страницы низкое
  const rounds = [
    { kind: 'ph', want: 'placeholder', ask: c.ask1, hints: c.hints1, why: c.why1, ph: L3('…', '…', '…'), gz: 1,
      line: (f) => [hl('p0', 0, '<p>'), lineCls('s', 1, { tag: 'span', attrs: [], before: null, field: f, after: 'col-6', text: '', close: true }), hl('p1', 0, '</p>')],
      body: (v) => img + '<p><span' + clsA((v + ' col-6').trim()) + '></span></p>', goal: '<p style="margin:0"><span class="placeholder col-6"></span></p>' },
    { kind: 'phanim', want: 'placeholder-wave', ask: c.ask2, hints: c.hints2, why: c.why2, ph: L3('placeholder-…', 'placeholder-…', 'placeholder-…'), gz: 1,
      line: (f) => [{ k: 'p0', d: 0, cls: 'b1-line is-hl', parts: clsLineA({ tag: 'p', attrs: [], before: null, field: f }) }, hl('s', 1, '<span class="placeholder col-6"></span>'), hl('p1', 0, '</p>')],
      body: (v) => img + '<p' + clsA(v) + '><span class="placeholder col-6"></span></p>', goal: '<p class="placeholder-wave" style="margin:0"><span class="placeholder col-6"></span></p>' }
  ];
  return <FillRounds p={p} id="t4" c={c} rounds={rounds} docs={{ page: 'Placeholder', only: 'animation' }} type="placeholder" />;
}

// =============================================================================
// Q1. КАРТИНКА → КОД (4 раунда): круглое фото, фото в экране телефона, кольцо загрузки, серая полоса. Окно справа —
// честный результат выбранного варианта; у неверного варианта своя причина.
// =============================================================================
// Раунд 1: вместо rounded-pill (на квадратном фото — тот же круг, второй верный) — rounded-top (23.11.2026).
const Q1_ROUNDS = [
  { opts: ['img-circle', 'rounded', 'rounded-circle', 'rounded-top'], a: 2, html: (cls) => imgH('murabbiy.jpg', 'img-fluid ' + cls, 'Murabbiy').replace('>', ' style="width:110px">') },
  { opts: ['img-responsive', 'img-fluid', 'img-thumbnail', 'fluid'], a: 1, html: (cls) => imgH('robot.jpg', cls, 'Robot'), vw: PHONE },
  { opts: ['spinner-grow', 'spinner', 'loading', 'spinner-border'], a: 3, html: (cls) => spinH(cls) },
  { opts: ['placeholder col-6', 'placeholder', 'bg-secondary', 'skeleton col-6'], a: 0, html: (cls) => '<p style="margin:0"><span class="' + cls + '"></span></p>' }
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
          <div className="kz-col">
            <Br title={pick(UI.need)} short cls="b2-q1page b3-goalwin"><BsFrame body={RR.html(right)} bs dep={'g' + R.ii} vw={RR.vw} /></Br>
          </div>
          <div className="kz-col">
            <Br title={pick(UI.yours)} short cls="b2-q1page">
              {res ? <BsFrame body={RR.html(res)} bs dep={res} vw={RR.vw} /> : <div className="b2-q1-empty">{pick(c.empty)}</div>}
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

// =============================================================================
// T6. ПОЧЕМУ НЕ РАБОТАЕТ — img-responsive (старое имя: фото вылезает), class="spinner" (такого нет: пусто), заглушка
// без col-… (ширина 0: не видна).
// =============================================================================
const T6_ROUNDS = [
  { k: 'old', code: (pick) => [imgSrcLine('i', 0, 'robot.jpg', 'img-responsive', 'Robot', { cls: 'is-hl' })], body: () => imgH('robot.jpg', 'img-responsive', 'Robot') },
  { k: 'noClass', code: () => [hl('s0', 0, '<div class="spinner" role="status">', { cls: 'is-hl' }), hl('s1', 1, '<span class="visually-hidden">Loading…</span>'), hl('s2', 0, '</div>')], body: () => spinH('spinner') },
  { k: 'noWidth', code: () => [hl('p0', 0, '<p class="placeholder-wave">'), hl('p1', 1, '<span class="placeholder"></span>', { cls: 'is-hl' }), hl('p2', 0, '</p>')], body: () => '<p class="placeholder-wave"><span class="placeholder"></span></p>' }
];
function T6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t6;
  const [rec, put] = useRec('t6');
  const solved = !!(rec && rec.done);
  const R = useRounds(T6_ROUNDS.length, solved);
  const [off, setOff] = useState([]);
  const [wide, setWide] = useState(false);
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
  const keys = ['old', 'noClass', 'noWidth'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={R.done ? c.ok : c.ask} hint={R.ok ? null : ch.now(hints)} err={ch.err} n={(R.ii + 1) + '/' + T6_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code" key={'r' + R.ii}>
          <div className="kz-col"><KzCode lines={RR.code(pick)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} body={h1H(pick) + RR.body()} vw={PHONE} onWide={setWide} title={pick(UI.phone)}>{R.ii === 0 ? <WideBadge pick={pick} wide={wide} /> : null}</SitePage></div>
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

// =============================================================================
// W1. СВОЯ КАРТОЧКА — углы фото тренера (rounded-…) и цвет спиннера (fg-…); справка — Border radius; «Tayyor».
// =============================================================================
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [ro, setRo] = useState(store.get('myRound') || '');
  const [co, setCo] = useState(store.get('mySpin') || '');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !ro, 0);
  const vr = normCls(ro), vc = normCls(co);
  const ready = !!(vr && vc);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    st.current.tries += 1;
    const issue = issueText(wordIssue(vr, 'round', null)) || issueText(wordIssue(vc, 'fg', null));
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myRound', vr); store.set('mySpin', vc); put({ done: true });
    log({ screenId: 'w1', type: 'own-card', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, cls: vr + ' ' + vc });
    sayNow(c.ok, 'cheer');
  };
  const f = (val, set, k, ph, lit) => (solved ? <span key={k} className="b1-st">{val.trim()}</span>
    : <span key={k} className={'kz-gap b1-slotin b2-field' + (lit ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={ph} label={c.ask} max={24} /></span>);
  const l1 = clsLineA({ tag: 'img', attrs: [['src', 'murabbiy.jpg']], before: 'img-fluid', field: f(ro, setRo, 'ro', L3('rounded…', 'rounded…', 'rounded…'), led) }, [['alt', 'Murabbiy']]);
  const l2 = clsLineA({ tag: 'div', attrs: [], before: 'spinner-border', field: f(co, setCo, 'co', L3('fg-…', 'fg-…', 'fg-…')) }, [['role', 'status']]);
  const body = h1H(pick) + imgH('murabbiy.jpg', ('img-fluid ' + vr).trim(), 'Murabbiy').replace('>', ' style="width:150px">') + '<p>' + spinH(('spinner-border ' + vc).trim()) + ' ' + escH(pick(C.site.wait)) + '</p>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className={docsPhoneCls({ ref: true, done: solved })}>
          {!solved ? <div className="kz-col b1-tri-docs"><DocsBr page="Border radius"><BsDocs page="Border radius" only="sizes" copyOff /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={[{ k: 'a', d: 0, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l1 }, { k: 'b', d: 0, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l2 }]} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} body={body} vw={PHONE} title={pick(UI.mySite)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S18. ВЫВОД — разгадка: одно фото с img-fluid само подстраивается под телефон, планшет и ноутбук; своя карточка; что умеем.
// =============================================================================
function S18({ p }) {
  const pick = usePick();
  const c = C.s18;
  const store = useStore();
  const ro = store.get('myRound') || 'rounded-circle', co = store.get('mySpin') || 'fg-success';
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const [vi, setVi] = useState(0);
  useEffect(() => { if (curK !== 'riddle') return undefined; const t = setInterval(() => setVi((x) => (x + 1) % 3), 1600); return () => clearInterval(t); }, [curK]);
  const vw = curK === 'riddle' ? [PHONE, 768, 1200][vi] : PHONE;
  const body = h1H(pick) + imgH('robot.jpg', 'img-fluid rounded', 'Robot') + '<p style="margin-top:8px">' + imgH('murabbiy.jpg', 'img-fluid ' + ro, 'Murabbiy').replace('>', ' style="width:90px">') + ' ' + spinH('spinner-border ' + co) + '</p>';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col"><SitePage pick={pick} body={body} vw={vw} title={vw + ' px'} /></div>
          <div className="kz-col b1-end-side">
            <KzCode lines={[imgSrcLine('a', 0, 'robot.jpg', 'img-fluid rounded', 'Robot', { cls: curK === 'riddle' || curK === 'img' ? 'is-read' : '' }), imgSrcLine('b', 0, 'murabbiy.jpg', 'img-fluid ' + ro, 'Murabbiy', { cls: curK === 'img' ? 'is-read' : '' }), hl('c', 0, '<div class="spinner-border ' + co + '" role="status">', { cls: curK === 'load' ? 'is-read' : '' })]} cls="kz-code-sm b1-nowrap" />
            <div className="kz-roles">
              {['img', 'round', 'load', 'site'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'img' ? '#0FA38E' : k === 'round' ? '#7952B3' : k === 'load' ? '#D97706' : '#FA4F28' }}>
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

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 },
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 }, { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 't1', code: 'LEVEL-1', Comp: T1 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 'g2', code: 'SHOW', Comp: G2 }, { id: 't2', code: 'LEVEL-2', Comp: T2 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 'g3', code: 'SHOW', Comp: G3 }, { id: 't3', code: 'LEVEL-2', Comp: T3 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 't4', code: 'LEVEL-2', Comp: T4 },
  { id: 'q1', code: 'CHECK', Comp: Q1 }, { id: 't6', code: 'CHECK', Comp: T6 },
  { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 's18', code: 'ACHIEVEMENT', Comp: S18 }
];
// «Повторить» стирает только экран; своя карточка ученика (myRound, mySpin) остаётся.
const SCREEN_RESET = {};
SCREENS.forEach((s) => { if (s.id !== 's18') SCREEN_RESET[s.id] = [s.id]; });

function lessonBs3Artifact(store) {
  const ro = store.get('myRound'), co = store.get('mySpin');
  if (!ro && !co) return null;
  return { type: 'html-page', round: ro || '', spinner: co || '',
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      "    <title>Robot to'garagi</title>", '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <img src="murabbiy.jpg" class="img-fluid ' + escH(ro || '') + '" alt="Murabbiy">',
      '    <div class="spinner-border ' + escH(co || '') + '" role="status">', '      <span class="visually-hidden">Loading…</span>', '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapZagruzkaIIzobrazheniya({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs3Artifact(store) })
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
