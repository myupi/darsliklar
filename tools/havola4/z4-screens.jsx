// =============================================================================
// ЭКРАНЫ УРОКА 4 «Ссылки и атрибуты» (облик «Редактор»). Сделаны с нуля; основа кода — экраны
// уроков 2–3 (tools/zagolovki2/, tools/royxat3/). Типы заданий — по разделу 3а навыка:
// s3 вписать — s4 перетащить; s6 собрать код — s7 найти пару; s9 вписать — s10 до и после;
// s12, s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет. Экрана плана нет.
// Честный браузер: ссылка с href — синяя, подчёркнутая, по нажатию открывает страницу (адрес меняется,
// стрелка «назад» возвращает); a без href — обычный текст; нет такого файла — «Файл не найден»;
// без </a> ссылкой становится и текст дальше. Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const FILES = ['index.html', 'osh.html', 'oyinlar.html'];

// Части строки → JSX страницы. { a, href } — ссылка (тап — переход); { an } — a без href (просто текст);
// { b } — жирный. onNav(href) — переход в браузере экрана.
const inl = (parts, onNav, key) => (parts || []).map((x, j) => {
  const k = (key || '') + j;
  if (typeof x === 'string') return <React.Fragment key={k}>{x}</React.Fragment>;
  if (x.a !== undefined) {
    return onNav ? <a key={k} href={'#' + x.href} className={'z4-a' + (x.hl ? ' is-hl' : '')} onClick={(e) => { e.preventDefault(); onNav(x.href); }}>{x.a}</a>
      : <span key={k} className={'z4-a' + (x.hl ? ' is-hl' : '')}>{x.a}</span>;
  }
  if (x.an !== undefined) return <span key={k} className={'z4-an' + (x.hl ? ' is-hl' : '')}>{x.an}</span>;
  return <b key={k}>{x.b}</b>;
});

function useFitPage(dep) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const page = el && el.closest('.kz-br-page');
    if (!el || !page) return undefined;
    const fit = () => {
      let k = 1;
      el.style.fontSize = '';
      while (page.scrollHeight > page.clientHeight + 1 && k > 0.56) { k -= 0.06; el.style.fontSize = k.toFixed(2) + 'em'; }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => ro.disconnect();
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}
// Страница: блоки { t: 'h1' | 'h2' | 'p' | 'ul' | 'nf', parts | items, hl, k, cls }.
function PageDoc({ blocks, onNav, cls }) {
  const ref = useFitPage(JSON.stringify(blocks.map((b) => [b.t, b.k, b.cls, b.hl, JSON.stringify(b.parts || b.items)])));
  return (
    <div ref={ref} className={'z4-doc' + (cls ? ' ' + cls : '')}>
      {blocks.map((bk, i) => {
        const c = 'z4-blk z4-' + bk.t + (bk.hl ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '');
        if (bk.t === 'ul') return <ul key={bk.k || i} className={c}>{bk.items.map((it, j) => <li key={j}>{inl(it, onNav, i + '-' + j)}</li>)}</ul>;
        return <div key={bk.k || i} className={c}>{inl(bk.parts, onNav, 'k' + i)}</div>;
      })}
    </div>
  );
}

// Адрес сайта в интернете: без пробелов и «/» в конце; http:// браузер сам переводит на https://.
const webKey = (f) => String(f || '').trim().replace(/\/+$/, '').toLowerCase().replace(/^http:\/\//, 'https://');
// САЙТ КОДИ — страницы по имени файла. mine — своя страница ученика (s12–s15).
const sitePage = (pick, file, mine) => {
  const home = { t: 'p', parts: [{ a: pick(C.site.home), href: 'index.html' }], k: 'home' };
  if (file === 'index.html') return { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' }, { t: 'p', parts: [pick(C.site.hello)], k: 'p' },
    { t: 'p', parts: [{ a: pick(C.site.osh), href: 'osh.html' }], k: 'l1' }, { t: 'p', parts: [{ a: pick(C.site.games), href: 'oyinlar.html' }], k: 'l2' }] };
  if (file === 'osh.html') return { title: pick(C.site.osh), blocks: [
    { t: 'h1', parts: [pick(C.site.osh)], k: 'h' }, { t: 'ul', items: pick(C.site.oshList).map((w) => [w]), k: 'u' }, home] };
  if (file === 'oyinlar.html') return { title: pick(C.site.games), blocks: [
    { t: 'h1', parts: [pick(C.site.games)], k: 'h' }, { t: 'ul', items: pick(C.site.gamesList).map((w) => [w]), k: 'u' }, home] };
  if (file === 'mening.html' && mine) return { title: mine, blocks: [
    { t: 'h1', parts: [mine], k: 'h' }, { t: 'p', parts: [pick(C.site.mineHello)], k: 'p' }, home] };
  // Сайт в интернете (w1–w3): адрес с https:// (или http://) — Википедия; другое имя сайта — «Не удаётся открыть сайт».
  const wk = webKey(file);
  if (/^https:\/\//.test(wk)) {
    if (LANGS.some((l) => C.web.url[l] === wk) || wk === C.web.portal) return { title: pick(C.web.title), web: true, blocks: [
      { t: 'h1', parts: [pick(C.web.title)], k: 'h' }, { t: 'p', parts: [pick(C.web.sub)], k: 'p' }] };
    return { title: file, nf: true, blocks: [{ t: 'nf', parts: [pick(C.site.nr)], k: 'nf' }, { t: 'p', parts: [pick(fillL(C.site.nrText, { f: file }))], k: 'nfp', cls: 'z4-nf-p' }] };
  }
  // Честно: такого файла нет — браузер показывает свою страницу ошибки.
  return { title: file, nf: true, blocks: [{ t: 'nf', parts: [pick(C.site.nf)], k: 'nf' }, { t: 'p', parts: [pick(fillL(C.site.nfText, { f: file }))], k: 'nfp', cls: 'z4-nf-p' }] };
};

// Переходы в браузере экрана: адрес, история, «назад». files — какие файлы есть на «диске».
function useNav(start, files) {
  const [hist, setHist] = useState([start]);
  const url = hist[hist.length - 1];
  const go = (href) => { const f = String(href || '').trim(); sfx('tap', true); setHist((h) => h.concat(files.indexOf(f) >= 0 ? f : (f || url))); };
  const back = hist.length > 1 ? () => { sfx('tap', true); setHist((h) => h.slice(0, -1)); } : null;
  const reset = (f) => setHist([f || start]);
  return { url, go, back, reset, at: hist.length };
}
// Окно браузера с сайтом: показывает страницу по адресу, ссылки нажимаются.
function SiteBrowser({ nav, mine, short, cls, pageHl, override, live = true }) {
  const pick = usePick();
  const pg = override || sitePage(pick, nav.url, mine);
  return (
    <PaperBrowser title={pg.title} url={nav.url} onBack={live ? nav.back : null} short={short} cls={'z4-br' + (pg.nf ? ' is-nf' : '') + (cls ? ' ' + cls : '')} pageHl={pageHl}>
      <PageDoc key={nav.url + ':' + nav.at} blocks={pg.blocks} onNav={live ? nav.go : null} cls="z4-a-in" />
    </PaperBrowser>
  );
}
// Значение href: у полного адреса части отдельно — https:// и имя сайта (lit — какая горит).
const urlVal = (href, lit) => {
  const m = /^(https?:\/\/)(.*)$/.exec(href);
  if (!m) return <span className="z4-val">{'"' + href + '"'}</span>;
  return <span className="z4-val">"<span className={'z4-u' + (lit === 'proto' ? ' is-cur' : '')}>{m[1]}</span><span className={'z4-u' + (lit === 'host' ? ' is-cur' : '')}>{m[2]}</span>"</span>;
};
// Строка кода: <p><a href="…">текст</a></p> и варианты.
const aCode = (href, text, opts) => {
  const o = opts || {};
  const open = o.noHref ? [T_('a')] : [<span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span> <span className="z4-attr">href</span><span className="kz-tk-b">=</span>{urlVal(href, o.lit)}<span className="kz-tk-b">{'>'}</span></span>];
  return [T_('p')].concat(open, [W_(text)], o.noClose ? [] : [T_('a', true)], o.tail ? [W_(o.tail)] : [], [T_('p', true)]);
};
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts }, extra || {});
// Панель «Файлы» — какие страницы есть у сайта (честно: href — точное имя одного из них).
const FilesPanel = ({ files, hl }) => {
  const pick = usePick();
  return (
    <div className="z4-files" aria-label={pick(C.site.filesH)}>
      <span className="z4-files-h">{pick(C.site.filesH)}</span>
      {files.map((f) => <span key={f} className={'z4-file' + (hl === f ? ' is-hl' : '')} translate="no"><i aria-hidden="true" />{f}</span>)}
    </div>
  );
};
const TagChip = ({ t, cls, on }) => <span className={'z4-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;

// Проверка имени файла в href (s3, s13).
function hrefIssue(v, want, msgs) {
  const n = normT(v).replace(/^["'«“]+|["'»”]+$/g, '');
  if (n === want) return null;
  if (!n) return msgs.empty;
  if (n.indexOf('.') < 0) return msgs.noExt;
  if (FILES.concat(['mening.html']).indexOf(n) >= 0) return msgs.other;
  return msgs.typo;
}

// =============================================================================
// S1. КРЮЧОК — сайт Коди: на главной названия страниц — просто текст, нажатие ничего не даёт.
// «Превратить»: слова становятся ссылками (синие, подчёркнутые) — нажимаются, страница меняется,
// «назад» возвращает. Загадка: Коди обернул текст в <a> без адреса.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'links' : 'plain');
  const [poke, setPoke] = useState(0);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && phase === 'plain', 0);
  const nav = useNav('index.html', FILES);
  const turn = () => {
    if (!canTap || phase !== 'plain') return;
    sfx('ok', true); setPhase('links'); put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile');
  };
  // До превращения: названия — простой текст; нажатие только слегка встряхивает окно.
  const plain = { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' }, { t: 'p', parts: [pick(C.site.hello)], k: 'p' },
    { t: 'p', parts: [pick(C.site.osh)], k: 'l1' }, { t: 'p', parts: [pick(C.site.games)], k: 'l2' }] };
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={phase === 'plain' ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={phase === 'plain' ? c.ask : c.askDone} />
        <div className="kz-scene z4-s1">
          <div className="kz-stagebox z4-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={phase === 'links'} /></div></div>
          <div className="kz-col z4-s1-page" onClick={() => { if (phase === 'plain') setPoke((x) => x + 1); }}>
            <SiteBrowser nav={nav} key={'b' + poke} cls={phase === 'plain' && poke ? 'z4-nudge' : ''} override={phase === 'plain' ? plain : null} live={phase === 'links'} />
          </div>
        </div>
        {phase === 'plain' ? (
          <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ТЕГ a И АТРИБУТ href (показ) — строка «Osh retsepti»: обернули в a — в окне ничего не изменилось;
// добавили href="osh.html" — текст стал ссылкой; браузер сам «нажимает» её — открывается рецепт, потом назад.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);   // 0 — текст; 1 — <a> без href; 2 — <a href>
  const nav = useNav('index.html', FILES);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const line = () => codeRef.current && codeRef.current.querySelector('[data-place="l"]');
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: line, act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.sayA, pose: 'think' }] },
    { look: line, act: () => { sfx('ok', true); setN(2); } },
    { say: [{ text: c.sayHref, pose: 'point' }] },
    { act: () => nav.go('osh.html') },
    { wait: reduceMotion() ? 300 : 1400 },
    { act: () => nav.back && nav.back() },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const w = pick(C.site.osh);
  const lineParts = n === 0 ? [T_('p'), W_(w), T_('p', true)] : n === 1 ? aCode('', w, { noHref: true }) : aCode('osh.html', w);
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [n === 2 ? { a: w, href: 'osh.html' } : n === 1 ? { an: w } : w], k: 'l1', hl: speaker.text === c.sayA || speaker.text === c.sayHref }] } : null;
  const askText = solved || demo.done ? c.askDone : n >= 2 ? c.askHref : c.askA;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z4-s5">
          <div className="kz-col" ref={codeRef}>
            <KzCode lines={[codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)], { cls: 'z4-edge' }),
              codeLine('l', lineParts, { cls: n >= 1 ? 'is-new' + (speaker.text === c.sayHref ? ' is-read' : '') : '' })]} cls="kz-code-sm" />
          </div>
          <div className="kz-col"><SiteBrowser nav={nav} short override={page} live={false} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ АДРЕС (Fill in the Blanks) — у ссылки «Mening o'yinlarim» пустой href. Ученик пишет имя
// файла из панели «Файлы»; ссылку можно сразу нажать — честно откроется то, что написано.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 20 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const nav = useNav('index.html', FILES);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const val = okNow ? 'oyinlar.html' : ty.val.trim().replace(/^["']+|["']+$/g, '');
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = hrefIssue(ty.val, 'oyinlar.html', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-href', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const g = pick(C.site.games);
  // Честно: пока адреса нет, у ссылки href пустой — браузер всё равно рисует её ссылкой.
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [{ a: pick(C.site.osh), href: 'osh.html' }], k: 'l1' },
    { t: 'p', parts: [{ a: g, href: val || 'index.html' }], k: 'l2', hl: !okNow }] } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={page} />
            <KzCode lines={[
              codeLine('l1', aCode('osh.html', pick(C.site.osh)), { cls: 'z4-ctx' }),
              okNow ? codeLine('l2', aCode('oyinlar.html', g), { cls: 'is-new' }) : codeLine('l2', [T_('p'),
                <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span> <span className="z4-attr">href</span><span className="kz-tk-b">=</span><span className="z4-val">"</span></span>,
                <span key="g" className={'kz-gap z4-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={20} /></span>,
                <span key="c" className="kz-tag" translate="no"><span className="z4-val">"</span><span className="kz-tk-b">{'>'}</span></span>,
                W_(g), T_('a', true), T_('p', true)], { cls: 'is-hl' })
            ]} cls="kz-code-sm" />
            <FilesPanel files={FILES} hl={lad.lv >= 3 ? 'oyinlar.html' : null} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['.html']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. МЕНЮ САЙТА (Drag & Drop) — три ссылки меню с пустыми адресами; в лотке три файла. Перетащить
// (или нажать файл, потом ссылку) каждый файл к своей ссылке. Не тот файл — причина; потом ссылки работают.
// =============================================================================
const S4_LINKS = [{ k: 'home', file: 'index.html' }, { k: 'osh', file: 'osh.html' }, { k: 'games', file: 'oyinlar.html' }];
const S4_TRAY = ['oyinlar.html', 'index.html', 'osh.html'];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? S4_LINKS.map((l) => l.file) : [null, null, null]);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const nav = useNav('index.html', FILES);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const doneN = slots.filter(Boolean).length;
  const done = doneN === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, doneN * 10 + (sel ? 1 : 0));
  const label = (k) => pick(C.site[k === 'home' ? 'home' : k === 'osh' ? 'osh' : 'games']);
  const place = (file, where) => {
    const k = Number(where);
    if (!canTap || done || !file || Number.isNaN(k) || slots[k]) return false;
    st.current.tries += 1;
    if (S4_LINKS[k].file !== file) {
      st.current.misses += 1;
      sfx('soft', true); setShake(file); setTimeout(() => setShake(null), 520);
      const m = fillL(c.why, { f: file, page: label(S4_LINKS.find((l) => l.file === file).k) });
      setMsg(m); setSel(null); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = slots.slice(); ns[k] = file;
    setSlots(ns); setSel(null); setMsg(null);
    if (ns.every(Boolean)) {
      put({ done: true });
      log({ screenId: 's4', type: 'place-hrefs', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((file, where) => place(file, where));
  const pickSlot = (k) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, String(k)); };
  const lit = lad.lv >= 3;
  const nextK = slots.findIndex((x) => !x);
  const trayRef = useRef(null);
  const codeRef = useRef(null);
  const lines = S4_LINKS.map((l, k) => (slots[k] ? codeLine('s' + k, aCode(slots[k], label(l.k)), { cls: 'is-new' })
    : codeLine(String(k), [T_('p'),
      <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span> <span className="z4-attr">href</span><span className="kz-tk-b">=</span><span className="z4-val">"</span></span>,
      <span key="d" className="kz-dash kz-dash-sm" />,
      <span key="c" className="kz-tag" translate="no"><span className="z4-val">"</span><span className="kz-tk-b">{'>'}</span></span>,
      W_(label(l.k)), T_('a', true), T_('p', true)], {
      cls: 'z4-hline' + (dnd.hover === String(k) ? ' is-hover' : ''), onTap: () => pickSlot(k), disabled: !canTap || done,
      led: (led && !!sel) || (lit && k === nextK) })));
  const menu = { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.menu)], k: 'h' }].concat(S4_LINKS.map((l, k) => ({
    t: 'p', parts: [slots[k] ? { a: label(l.k), href: slots[k] } : { an: label(l.k) }], k: 'm' + k }))) };
  const nextFile = nextK >= 0 ? S4_LINKS[nextK].file : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : doneN + '/3'} />
        <div className={'kz-scene z4-s5' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col" ref={codeRef}><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><SiteBrowser nav={nav} short override={nav.url === 'index.html' ? menu : null} /></div>
        </div>
        {!done ? (
          <div ref={trayRef} className="kz-tray">
            {S4_TRAY.map((f) => (slots.indexOf(f) >= 0 ? null : (
              <button key={f} type="button" disabled={!canTap} data-id={f}
                className={'kz-scrap kz-scrap-code z4-filechip' + (sel === f ? ' is-sel' : '') + (shake === f ? ' kz-a-shake' : '') + (lit && f === nextFile ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, f, f); }}
                onClick={() => { setSel(sel === f ? null : f); setMsg(null); sfx('tap', true); }}>
                <span translate="no">{f}</span><Led on={led && !sel} />
              </button>
            )))}
          </div>
        ) : null}
        <KzHand label="index.html" run={canTap && !done && !sel && !dnd.active && doneN === 0}
          targets={[() => trayRef.current && trayRef.current.querySelector('[data-id="index.html"]'), () => codeRef.current && codeRef.current.querySelector('[data-place="0"]')]} />
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// S5. ИЗ ЧЕГО СОСТОИТ АТРИБУТ (показ) — одна крупная строка ссылки; под речь Коди по очереди загораются:
// имя тега a, имя атрибута href, знак «=», значение в кавычках, закрывающий тег (без атрибутов).
// =============================================================================
const S5_PARTS = ['tag', 'attr', 'val', 'close'];
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [on, setOn] = useState(solved ? 4 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setOn(1); } }, { say: [{ text: c.sayTag, pose: 'point' }] },
    { act: () => { sfx('tap', true); setOn(2); } }, { say: [{ text: c.sayAttr, pose: 'point' }] },
    { act: () => { sfx('tap', true); setOn(3); } }, { say: [{ text: c.sayVal, pose: 'explain' }] },
    { act: () => { sfx('ok', true); setOn(4); } }, { say: [{ text: c.sayClose, pose: 'explain' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const cur = solved || demo.done ? null : S5_PARTS[on - 1];
  const cls = (k) => 'z4-part z4-part-' + k + (S5_PARTS.indexOf(k) < on ? ' is-on' : '') + (cur === k ? ' is-cur' : '');
  const askText = solved || demo.done ? c.askDone : cur ? c.asks[cur] : c.askStart;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z4-anat">
          <div className="z4-anat-code" translate="no">
            <span className={cls('tag')}><i>{'<'}</i><b>a</b></span>{' '}
            <span className={cls('attr')}><b>href</b></span><span className={cls('val')}><i>=</i><b>"osh.html"</b></span><span className={cls('tag')}><i>{'>'}</i></span>
            <span className="z4-anat-txt">{pick(C.site.osh)}</span>
            <span className={cls('close')}><i>{'</'}</i><b>a</b><i>{'>'}</i></span>
          </div>
          <div className="z4-anat-labels">
            {S5_PARTS.map((k, i) => (i < on ? <TagChip key={k} t={pick(c.labels[k])} cls={'z4-anat-lbl z4-a-in z4-lbl-' + k} on={cur === k} /> : null))}
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ АТРИБУТ (Code Builder) — в открывающем теге три пустых места; в лотке вперемешку
// href, =, "oyinlar.html". Нажать кусок — он встаёт в следующее место (или перетащить).
// =============================================================================
const S6_TRAY = ['val', 'eq', 'href'];
const S6_WANT = ['href', 'eq', 'val'];
const S6_TXT = { href: 'href', eq: '=', val: '"oyinlar.html"' };
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? S6_WANT.slice() : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const nav = useNav('index.html', FILES);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 3;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    if (id !== S6_WANT[got.length]) {
      st.current.misses += 1;
      const m = got.length === 0 ? (id === 'val' ? c.why.valFirst : c.why.eqFirst) : c.why.valEarly;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 3) {
      put({ done: true });
      log({ screenId: 's6', type: 'build-attribute', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const g = pick(C.site.games);
  const slot = (i) => (got[i] ? <span key={'s' + i} className={'z4-built z4-a-in' + (got[i] === 'href' ? ' z4-attr' : got[i] === 'val' ? ' z4-val' : ' kz-tk-b')}>{S6_TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm z4-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [done ? { a: g, href: 'oyinlar.html' } : { an: g }], k: 'l', hl: done }] } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/3'} />
        <div className={'kz-scene kz-scene-col z4-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={page} live={done} />
            <KzCode lines={[codeLine('l', [T_('p'), <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span></span>, ' ', slot(0), slot(1), slot(2),
              <span key="c" className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>, W_(g), T_('a', true), T_('p', true)], { cls: done ? 'is-new' : 'is-hl', place: 'code' })]} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z4-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === S6_WANT[got.length] ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, S6_TXT[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{S6_TXT[id]}</span><Led on={led} />
              </button>
            )))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// S7. НАЙДИ ПАРУ (Matching Pairs) — слева части тега: a, href, "osh.html"; справа их названия.
// Нажать часть, потом её название; пара закрепляется. Не та пара — причина.
// =============================================================================
const S7_TAGS = ['a', 'href', 'val'];
const S7_CARDS = ['val', 'a', 'href'];
const S7_TXT = { a: 'a', href: 'href', val: '"osh.html"' };
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const [paired, setPaired] = useState(solved ? S7_TAGS.slice() : []);
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
  const nextT = S7_TAGS.find((t) => paired.indexOf(t) < 0);
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
      log({ screenId: 's7', type: 'match-parts', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene z4-match">
          <div className="z4-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code z4-mtag z4-mtag-' + t + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{S7_TXT[t]}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z4-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z4-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="z4-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z4-mcard-tag" translate="no">{S7_TXT[k]}</span> : null}
                  <Led on={led && !!sel && !ok} />
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
// S8. ЧТО ЛОМАЕТ ССЫЛКУ (показ) — 1) опечатка в имени файла: браузер сам «нажимает» ссылку — «Файл не
// найден»; исправили — рецепт открылся. 2) забыли </a> — ссылкой стал и текст дальше.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [st8, setSt8] = useState(solved ? 4 : 0);   // 0 ok; 1 опечатка; 2 «нажали» — ошибка; 3 без </a>; 4 исправлено
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setSt8(1); } },
    { say: [{ text: c.sayTypo, pose: 'think' }] },
    { act: () => { sfx('soft', true); setSt8(2); } },
    { say: [{ text: c.sayNf, pose: 'wonder' }] },
    { act: () => { sfx('tap', true); setSt8(3); } },
    { say: [{ text: c.sayClose, pose: 'think' }] },
    { act: () => { sfx('ok', true); setSt8(4); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const w = pick(C.site.osh), tail = pick(c.tail);
  const href = st8 === 1 || st8 === 2 ? 'osh.htm' : 'osh.html';
  const noClose = st8 === 3;
  const nav = { url: st8 === 2 ? 'osh.htm' : 'index.html', at: st8, back: null, go: () => {} };
  const page = st8 === 2 ? null : { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: noClose ? [{ a: w + tail, href }] : [{ a: w, href }, tail], k: 'l', hl: st8 === 1 || st8 === 3 }] };
  const askText = solved || demo.done ? c.askDone : st8 >= 3 ? c.askClose : c.askTypo;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z4-s5">
          <div className="kz-col">
            <KzCode lines={[codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)], { cls: 'z4-edge' }),
              codeLine('l', aCode(href, w, { noClose, tail }), { cls: st8 === 1 || st8 === 2 || st8 === 3 ? 'is-read' : st8 === 4 ? 'is-new' : '' })]} cls="kz-code-sm" />
          </div>
          <div className="kz-col"><SiteBrowser nav={nav} short override={page} live={false} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. ЗАКРОЙ ССЫЛКУ (Fill in the Blanks) — без </a> ссылкой стал весь хвост фразы. Ученик пишет </a>
// после названия; кнопки < / a > вставляют символ в поле.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 8 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const nav = useNav('index.html', FILES);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const issue = tagTypingIssue(ty.val, 'a', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-closing-a', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const g = pick(C.site.games), tail = pick(c.tail);
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: okNow ? [{ a: g, href: 'oyinlar.html' }, tail] : [{ a: g + tail, href: 'oyinlar.html' }], k: 'l', hl: !okNow }] } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={page} cls={okNow ? '' : 'z4-broken'} />
            <KzCode lines={[codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)], { cls: 'z4-edge' }),
              okNow ? codeLine('l', aCode('oyinlar.html', g, { tail }), { cls: 'is-new' }) : codeLine('l', aCode('oyinlar.html', g, { noClose: true }).slice(0, 3).concat([
                <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '') + (ty.val ? '' : ' z4-miss')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={8} cls="kz-tag-in" /></span>,
                W_(tail), T_('p', true)]), { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'a', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 2} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ДО И ПОСЛЕ (Before / After) — «до» и «после»: текст стал ссылкой (добавили href), хвост перестал
// быть ссылкой (добавили </a>), «Файл не найден» сменился рецептом (исправили имя файла). Ученик
// выбирает, что изменили в коде. Промах — причина, раунд того же типа.
// =============================================================================
const S10_ROUNDS = [{ want: 'href', kind: 'href', w: 'osh' }, { want: 'close', kind: 'close', w: 'osh' }, { want: 'val', kind: 'val', w: 'osh' }];
const S10_EXTRA = [{ want: 'href', kind: 'href', w: 'games' }, { want: 'close', kind: 'close', w: 'games' }, { want: 'val', kind: 'val', w: 'games' }];
const S10_BTN = { href: 'href="…"', close: '</a>', val: '"….html"' };
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (ans ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S10_EXTRA : S10_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const answer = (k) => {
    if (!canTap || !round || ans) return;
    const right = k === R.want;
    setAns(k);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.unshift({ i: round.i, extra: true });
    const line = right ? c.ok[k] : c.miss[R.want];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's10.r' + (ii + 1), type: 'before-after', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
      });
      put({ done: true }); setQueue([]);
      sayNow(joinL(line, c.done), 'smile');
      return;
    }
    sayNow(line, right ? 'smile' : 'rule');
    setPending(rest);
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const view = (after) => {
    if (!R) return null;
    const w = pick(C.site[R.w]), file = R.w === 'osh' ? 'osh.html' : 'oyinlar.html', tail = pick(C.s8.tail);
    if (R.kind === 'href') return <PageDoc blocks={[{ t: 'p', parts: [after ? { a: w, href: file } : w], k: 'x' }]} />;
    if (R.kind === 'close') return <PageDoc blocks={[{ t: 'p', parts: after ? [{ a: w, href: file }, tail] : [{ a: w + tail, href: file }], k: 'x' }]} />;
    const pg = after ? sitePage(pick, file) : sitePage(pick, file.replace('.html', '.htm'));
    return (
      <div className="z4-mini">
        <span className="z4-mini-url" translate="no">{after ? file : file.replace('.html', '.htm')}</span>
        <PageDoc blocks={pg.blocks.slice(0, 2)} />
      </div>
    );
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z4-ba kz-a-drop">
                <div className="z4-card"><span className="z4-card-h">{pick(c.before)}</span>{view(false)}</div>
                <span className="z4-ba-arrow" aria-hidden="true" />
                <div className="z4-card is-after"><span className="z4-card-h">{pick(c.after)}</span>{view(true)}</div>
              </div>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick z4-pick3">
            {['href', 'close', 'val'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z4-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}><span translate="no">{S10_BTN[k]}</span><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. САЙТ ЦЕЛИКОМ (показ) — браузер сам ходит по ссылкам: главная → рецепт → назад → игры → назад;
// строка кода ссылки загорается перед переходом.
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const nav = useNav('index.html', FILES);
  const [lit, setLit] = useState(null);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const W = reduceMotion() ? 300 : 1200;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => setLit('l1') }, { wait: 600 }, { act: () => nav.go('osh.html') },
    { say: [ORDER[0]] },
    { act: () => { setLit(null); nav.back && nav.back(); } }, { wait: W },
    { act: () => setLit('l2') }, { wait: 600 }, { act: () => nav.go('oyinlar.html') },
    { say: [ORDER[1]] },
    { act: () => { setLit(null); nav.back && nav.back(); } },
    { say: [ORDER[2]] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const lines = [codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)]),
    codeLine('p', [T_('p'), W_(pick(C.site.hello)), T_('p', true)]),
    codeLine('l1', aCode('osh.html', pick(C.site.osh)), { cls: lit === 'l1' ? 'is-read' : '' }),
    codeLine('l2', aCode('oyinlar.html', pick(C.site.games)), { cls: lit === 'l2' ? 'is-read' : '' })];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={solved || demo.done ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={solved || demo.done ? c.askDone : c.ask} />
        <div className="kz-scene z4-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><SiteBrowser nav={nav} live={solved || demo.done} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. САЙТ В ИНТЕРНЕТЕ (показ; заказчик, 05.11.2026) — к главной добавляется ссылка на Википедию с полным
// адресом; под речь Коди загораются https:// и имя сайта; браузер сам нажимает — открывается Википедия, адрес
// в строке полный. Потом https:// стирается — браузер ищет файл на нашем сайте: «Файл не найден».
// =============================================================================
function W1({ p }) {
  const pick = usePick();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);   // 0 — ссылки нет; 1 — полный адрес; 2 — без https://; 3 — снова полный
  const [lit, setLit] = useState(null);
  const [seen, setSeen] = useState(solved ? 2 : 0);
  const nav = useNav('index.html', FILES);
  const url = pick(C.web.url), host = pick(C.web.host), link = pick(C.web.link);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const W = reduceMotion() ? 300 : 1300;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { wait: 500 },
    { act: () => { sfx('tap', true); setLit('proto'); setSeen(1); } }, { say: [{ text: c.sayProto, pose: 'point' }] },
    { act: () => { sfx('tap', true); setLit('host'); setSeen(2); } }, { say: [{ text: c.sayHost, pose: 'point' }] },
    { act: () => { setLit(null); nav.go(url); } }, { wait: 500 }, { say: [{ text: c.sayOpen, pose: 'smile' }] },
    { act: () => nav.back && nav.back() }, { wait: W },
    { act: () => { sfx('soft', true); setN(2); } }, { say: [{ text: c.sayNoProto, pose: 'curious' }] },
    { act: () => nav.go(host) }, { wait: 500 }, { say: [{ text: c.sayNf, pose: 'wonder' }] },
    { act: () => { if (nav.back) nav.back(); sfx('ok', true); setN(3); } }, { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const href = n === 2 ? host : url;
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [{ a: pick(C.site.osh), href: 'osh.html' }], k: 'l1' }].concat(n >= 1 ? [{ t: 'p', parts: [{ a: link, href }], k: 'w', hl: !demo.done && !solved }] : []) } : null;
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askNf : lit === 'host' ? c.askHost : lit === 'proto' ? c.askProto : c.askStart;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z4-s5">
          <div className="kz-col">
            <KzCode lines={[codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)], { cls: 'z4-edge' }),
              codeLine('l1', aCode('osh.html', pick(C.site.osh)), { cls: 'z4-ctx' })].concat(n >= 1 ? [codeLine('w', aCode(href, link, { lit }), { cls: 'is-new' + (lit || n === 2 ? ' is-read' : '') })] : [])} cls="kz-code-sm" />
            {seen ? (
              <div className="z4-anat-labels z4-url-lbls">
                <TagChip t={'https:// — ' + pick(C.web.proto)} cls="z4-a-in" on={lit === 'proto'} />
                {seen >= 2 ? <TagChip t={pick(fillL(C.web.hostL, { h: C.web.host }))} cls="z4-a-in" on={lit === 'host'} /> : null}
              </div>
            ) : null}
          </div>
          <div className="kz-col"><SiteBrowser nav={nav} short override={page} live={false} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Проверка полного адреса (w2): null — верно; 'http' — работает, но без s; иначе — причина.
function urlIssue(v, host, msgs) {
  const n = normT(v).replace(/^["'«“]+|["'»”]+$/g, '').replace(/\/+$/, '');
  if (n === 'https://' + host) return null;
  if (n === 'http://' + host) return 'http';
  if (!n) return msgs.empty;
  if (/^https?:\/\//.test(n)) return msgs.typo;
  if (/^h?t?t?ps?(?=[:/]|$)/.test(n) || /^https?/.test(n)) return msgs.colon;
  return msgs.noProto;
}

// =============================================================================
// W2. ПОЛНЫЙ АДРЕС (Fill in the Blanks) — у ссылки «Википедия» пустой href; внизу — имя сайта. Ученик пишет
// полный адрес (кнопка https:// вставляет начало). Ссылку можно нажать: честно откроется то, что написано —
// без https:// «Файл не найден», с ошибкой в имени — «Не удаётся открыть сайт».
// =============================================================================
function W2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w2;
  const [rec, put] = useRec('w2');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 40 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [okVal, setOkVal] = useState(null);
  const nav = useNav('index.html', FILES);
  const url = pick(C.web.url), host = pick(C.web.host), link = pick(C.web.link);
  const hints = c.hints.map((h) => fillL(h, { h: C.web.host }));
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const typed = ty.val.trim().replace(/^["']+|["']+$/g, '');
  const val = okNow ? (okVal || url) : typed;
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = urlIssue(ty.val, host, c.msgs);
    if (!issue || issue === 'http') {
      sfx('win', true); setMsg(null); setOkNow(true); setOkVal(typed); put({ done: true });
      log({ screenId: 'w2', type: 'write-url', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(issue === 'http' ? c.okHttp : c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [{ a: link, href: val || 'index.html' }], k: 'w', hl: !okNow }] } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={page} />
            <KzCode lines={[codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)], { cls: 'z4-edge' }),
              okNow ? codeLine('w', aCode(val, link), { cls: 'is-new' }) : codeLine('w', [T_('p'),
                <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span> <span className="z4-attr">href</span><span className="kz-tk-b">=</span><span className="z4-val">"</span></span>,
                <span key="g" className={'kz-gap z4-slot z4-slot-url' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={40} /></span>,
                <span key="c" className="kz-tag" translate="no"><span className="z4-val">"</span><span className="kz-tk-b">{'>'}</span></span>,
                W_(link), T_('a', true), T_('p', true)], { cls: 'is-hl' })
            ]} cls="kz-code-sm" />
            <div className="z4-files z4-host" aria-label={pick(C.web.hostH)}>
              <span className="z4-files-h">{pick(C.web.hostH)}</span>
              <span className={'z4-file z4-file-web' + (lad.lv >= 3 ? ' is-hl' : '')} translate="no"><i aria-hidden="true" />{host}</span>
            </div>
          </div>
        </div>
        {!okNow ? <KeyRow keys={['https://']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W3. ГДЕ БРАУЗЕР БУДЕТ ИСКАТЬ (сортировка по одному) — адрес ссылки: «среди файлов сайта» или «в интернете».
// Ловушка — имя сайта без https://: браузер ищет файл на нашем сайте. После верного ответа браузер честно
// открывает адрес (рецепт, Википедию или «Файл не найден»). Промах — причина, можно выбрать снова.
// =============================================================================
function W3({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w3;
  const [rec, put] = useRec('w3');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.items.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState(null);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const nav = useNav('index.html', FILES);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  const href = it.k === 'osh' ? 'osh.html' : it.k === 'url' ? pick(C.web.url) : it.k === 'host' ? pick(C.web.host) : C.web.portal;
  const text = it.k === 'osh' ? pick(C.site.osh) : pick(C.web.link);
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) {
      st.current.misses += 1;
      sfx('soft', true); setOff(v); setMsg(it.why); sayNow(it.why, 'think');
      return;
    }
    sfx('ok', true); setOk(true); setMsg(null); nav.go(href);
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'w3', type: 'sort-address', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: 0, depth: 0 });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); nav.reset('index.html'); setIi((x) => x + 1); setOk(false); setOff(null); setMsg(null); }, reduceMotion() ? 300 : 1400);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [
    { t: 'h1', parts: [pick(C.site.title)], k: 'h' }, { t: 'p', parts: [{ a: text, href }], k: 'w', hl: !ok }] } : null;
  const btn = (v) => (
    <button key={v} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)} data-v={v}
      className={'kz-btn z4-tf z4-where ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(c[v])}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene z4-s5" key={'i' + ii}>
          <div className="kz-col">
            <KzCode lines={[codeLine('w', aCode(href, text), { cls: 'is-hl' })]} cls="kz-code-sm" />
            <div className="kz-pick z4-tf-pick">{btn('site')}{btn('web')}</div>
          </div>
          <div className="kz-col"><SiteBrowser nav={nav} short override={page} live={false} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. ТЕКСТ СВОЕЙ ССЫЛКИ и S13. АДРЕС СВОЕЙ СТРАНИЦЫ (Live Code Preview) — своя ссылка двумя экранами:
// текст ссылки (засчёт по «Готово»), потом имя файла своей страницы mening.html (по «Проверить»);
// после этого ссылку можно нажать — откроется своя страница.
// =============================================================================
const MINE_FILES = FILES.concat(['mening.html']);
const useMine4 = () => {
  const store = useStore();
  const pick = usePick();
  return store.get('myLink') || pick(C.s12.ph).replace(/^[^:]*:\s*/, '');
};
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec] = useRec('s12');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myLink', screenId: 's12', type: 'own-link-text', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  const nav = useNav('index.html', MINE_FILES);
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [{ a: pick(C.site.osh), href: 'osh.html' }], k: 'l1' }].concat(ty.shown ? [{ t: 'p', parts: [{ a: ty.shown, href: 'mening.html' }], k: 'l3', hl: !ty.solved }] : []) } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={page} mine={ty.shown || pick(UI.mySite)} live={ty.solved} />
            <KzCode lines={[codeLine('l1', aCode('osh.html', pick(C.site.osh)), { cls: 'z4-ctx' }),
              codeLine('l3', [T_('p'), <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span> <span className="z4-attr">href</span><span className="kz-tk-b">=</span><span className="z4-val">"mening.html"</span><span className="kz-tk-b">{'>'}</span></span>,
                <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={28} /></span>,
                T_('a', true), T_('p', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s13;
  const mine = useMine4();
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 20 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const nav = useNav('index.html', MINE_FILES);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const val = okNow ? 'mening.html' : ty.val.trim().replace(/^["']+|["']+$/g, '');
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = hrefIssue(ty.val, 'mening.html', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's13', type: 'own-link-href', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [{ a: mine, href: val || 'index.html' }], k: 'l3', hl: !okNow }] } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={page} mine={mine} />
            <KzCode lines={[okNow ? codeLine('l3', aCode('mening.html', mine), { cls: 'is-new' }) : codeLine('l3', [T_('p'),
              <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span> <span className="z4-attr">href</span><span className="kz-tk-b">=</span><span className="z4-val">"</span></span>,
              <span key="g" className={'kz-gap z4-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={20} /></span>,
              <span key="c" className="kz-tag" translate="no"><span className="z4-val">"</span><span className="kz-tk-b">{'>'}</span></span>,
              W_(mine), T_('a', true), T_('p', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
            <FilesPanel files={MINE_FILES} hl={lad.lv >= 3 ? 'mening.html' : null} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['.html']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ПРОПАЛ АДРЕС (Debug & Fix) — у своей ссылки потерялся атрибут: в окне простой текст. Перетащить
// (или нажать) нужный кусок в пустое место открывающего тега: href="mening.html", а не одно имя или одно значение.
// =============================================================================
const S14_OPTS = ['"mening.html"', 'href="mening.html"', 'href'];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const mine = useMine4();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const nav = useNav('index.html', MINE_FILES);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === 'href="mening.html"') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'fix-href', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'cheer');
      return true;
    }
    const m = o === 'href' ? c.why.name : c.why.val;
    sfx('soft', true); setOff(off.concat(o)); setMsg(m); sayNow(m, 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    { t: 'p', parts: [okNow ? { a: mine, href: 'mening.html' } : { an: mine }], k: 'l3', hl: !okNow }] } : null;
  const glow = off.length >= 2 ? 'href="mening.html"' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z4-s5">
          <div className="kz-col"><SiteBrowser nav={nav} override={page} mine={mine} cls={okNow ? '' : 'z4-broken'} live={okNow} /></div>
          <div className="kz-col">
            <KzCode lines={[codeLine('h', [T_('h1'), W_(pick(C.site.title)), T_('h1', true)], { cls: 'z4-edge' }),
              okNow ? codeLine('l3', aCode('mening.html', mine), { cls: 'is-new' }) : codeLine('l3', [T_('p'),
                <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span></span>, ' ',
                <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z4-miss' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />,
                <span key="c" className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>,
                W_(mine), T_('a', true), T_('p', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            {S14_OPTS.map((o) => (
              <button key={o} type="button" disabled={!canTap || off.indexOf(o) >= 0} onClick={() => choose(o)}
                onPointerDown={(e) => { if (canTap && !okNow && off.indexOf(o) < 0) dnd.start(e, o, o); }}
                className={'kz-scrap kz-scrap-code' + (off.indexOf(o) >= 0 ? ' is-used' : '') + (glow === o ? ' is-led' : '')}>
                <span translate="no">{o}</span><Led on={led && off.indexOf(o) < 0} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </StageB>
  );
}

// =============================================================================
// Q1. НАЙДИ ОШИБКУ (Error Detective) — меню из трёх ссылок, без образца. Раунд 1: у ссылки нет href
// (в окне простой текст). Раунд 2: в имени файла опечатка — Коди нажал её, в окне «Файл не найден».
// Ученик нажимает строку с ошибкой; найденная строка чинится сама.
// =============================================================================
const Q1_LINKS = [{ k: 'home', file: 'index.html' }, { k: 'osh', file: 'osh.html' }, { k: 'games', file: 'oyinlar.html' }];
const Q1_ROUNDS = [{ bad: 1, kind: 'noHref' }, { bad: 2, kind: 'typo' }];
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? Q1_ROUNDS.length - 1 : 0);
  const [found, setFound] = useState(solved);
  const [off, setOff] = useState([]);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = found && ri === Q1_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!found);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !found, ri * 10 + off.length);
  const R = Q1_ROUNDS[ri];
  const label = (k) => pick(C.site[k]);
  const tap = (j) => {
    if (!canTap || found || off.indexOf(j) >= 0) return;
    st.current.tries += 1;
    if (j !== R.bad) {
      st.current.misses += 1;
      sfx('soft', true); setOff(off.concat(j)); setMsg(c.fine); sayNow(c.fine, 'think');
      if (st.current.misses >= 2) lad.bump();
      return;
    }
    sfx('win', true); setFound(true); setMsg(null);
    if (ri === Q1_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 'q1', type: 'find-error', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.found[R.kind], c.ok), 'cheer');
    } else { sayNow(c.found[R.kind], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setFound(false); setOff([]); setMsg(null); lad.reset(); sayNow(c.say2, 'curious'); }, reduceMotion() ? 300 : 1200);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const broken = (j) => !found && j === R.bad;
  const hrefOf = (j) => (broken(j) && R.kind === 'typo' ? Q1_LINKS[j].file.replace('.html', '.htm') : Q1_LINKS[j].file);
  const codeOf = (j) => aCode(hrefOf(j), label(Q1_LINKS[j].k), { noHref: broken(j) && R.kind === 'noHref' });
  const menu = { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.menu)], k: 'h' }].concat(Q1_LINKS.map((l, j) => ({
    t: 'p', parts: [broken(j) && R.kind === 'noHref' ? { an: label(l.k) } : { a: label(l.k), href: hrefOf(j) }], k: 'm' + j }))) };
  // Раунд 2: Коди нажал сломанную ссылку — в окне честная страница ошибки.
  const showNf = R.kind === 'typo' && !found;
  const nav = { url: showNf ? hrefOf(2) : 'index.html', at: ri * 10 + (found ? 1 : 0), back: null, go: () => {} };
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene kz-scene-col z4-q1" key={'q' + ri}>
          <div className="kz-col">
            <SiteBrowser nav={nav} short override={showNf ? null : menu} live={false} cls={found ? '' : 'z4-broken'} />
            <KzCode lines={[0, 1, 2].map((j) => ({
              k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: codeOf(j),
              cls: 'z4-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
              onTap: found ? null : () => tap(j), disabled: !canTap || found || off.indexOf(j) >= 0,
              led: !found && ((led && off.length === 0 && j === 0) || (lit && j === R.bad))
            }))} cls="kz-code-sm" />
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// Q2. ВЕРНО ИЛИ НЕТ (True / False) — три утверждения по очереди. Промах — кнопка гаснет, объяснение.
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
  const [rec, put] = useRec('q2');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? c.items.length - 1 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState(null);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }]
    : [{ text: c.say, pose: 'curious' }, { text: c.items[0].t, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  const choose = (v) => {
    if (!canTap || ok || off === v) return;
    st.current.tries += 1;
    if (v !== it.right) {
      st.current.misses += 1;
      sfx('soft', true); setOff(v); setMsg(it.why); sayNow(it.why, 'think');
      return;
    }
    sfx('ok', true); setOk(true); setMsg(null);
    const line = joinL(c.right, it.why);
    if (ii === c.items.length - 1) {
      put({ done: true });
      log({ screenId: 'q2', type: 'true-false', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: 0, depth: 0 });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); setMsg(null); sayNow(c.items[ii + 1].t, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const btn = (v) => (
    <button key={String(v)} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)}
      className={'kz-btn z4-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z4-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z4-card z4-tf-card kz-a-drop">
              <span className="z4-card-h">{pick(c.card)}</span>
              <p className="z4-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={[codeLine('c', it.code === 'ok' ? aCode('osh.html', pick(C.site.osh)) : it.code === 'host' ? aCode(pick(C.web.host), pick(C.web.link)) : aCode('osh.html', pick(C.site.osh), { noHref: true }))]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z4-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: у Коди <a> без href — простой текст; своя ссылка ученика работает (можно нажать —
// откроется своя страница); роли a, href, значение загораются, пока Коди их называет.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine4();
  const nav = useNav('index.html', MINE_FILES);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const page = nav.url === 'index.html' ? { title: pick(C.site.title), blocks: [{ t: 'h1', parts: [pick(C.site.title)], k: 'h' },
    riddle ? { t: 'p', parts: [{ an: pick(C.site.games) }], k: 'r', hl: true } : { t: 'p', parts: [{ a: mine, href: 'mening.html', hl: curK === 'a' }], k: 'm', hl: curK === 'href' || curK === 'val' }] } : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z4-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <SiteBrowser nav={nav} override={page} mine={mine} live={!riddle} />
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['a', 'href', 'val', 'web'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'href') ? ' is-on' : '')} style={{ '--c': k === 'a' ? '#FA4F28' : k === 'href' ? '#7C5CFA' : k === 'val' ? '#0FA38E' : '#D97706' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 's3', code: 'LEVEL-1', Comp: S3 }, { id: 's4', code: 'CHECK-1', Comp: S4 },
  { id: 's5', code: 'SHOW', Comp: S5 }, { id: 's6', code: 'LEVEL-2', Comp: S6 }, { id: 's7', code: 'CHECK-2', Comp: S7 },
  { id: 's8', code: 'SHOW', Comp: S8 }, { id: 's9', code: 'LEVEL-3', Comp: S9 }, { id: 's10', code: 'CHECK-3', Comp: S10 },
  { id: 's11', code: 'SHOW', Comp: S11 },
  { id: 'w1', code: 'SHOW', Comp: W1 }, { id: 'w2', code: 'LEVEL-W', Comp: W2 }, { id: 'w3', code: 'CHECK-W', Comp: W3 },
  { id: 's12', code: 'LEVEL-4', Comp: S12 }, { id: 's13', code: 'LEVEL-4B', Comp: S13 },
  { id: 's14', code: 'CHECK-4', Comp: S14 },
  { id: 'q1', code: 'CHECK-5', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; своя ссылка ученика (myLink) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], w1: ['w1'], w2: ['w2'], w3: ['w3'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — своя ссылка ученика на свою страницу.
function lesson4Artifact(store) {
  const t = store.get('myLink');
  if (!t) return null;
  return { type: 'html-page', title: t,
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(t) + '</title>', '  </head>', '  <body>',
      '    <p><a href="mening.html">' + escHtml(t) + '</a></p>', '  </body>', '</html>'].join('\n') };
}

export default function HtmlSsylki({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson4Artifact(store) })
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
