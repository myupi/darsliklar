// =============================================================================
// ЭКРАНЫ УРОКА 1 МОДУЛЯ BOOTSTRAP «Введение в Bootstrap» (облик «Редактор», 19.11.2026).
// Основа кода — урок 1 CSS (tools/css1/). Страница в окне Chrome — честная: iframe без скриптов, внутри настоящий
// bootstrap.min.css 6.0.0-alpha.1 (BS_CSS из gen/bs-css.jsx). Сайт Bootstrap — похожая страница (светлая тема):
// те же разделы и пункты, тот же код, что на getbootstrap.com/docs/6.0. Копирование и вставка — нажатиями.
// Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const escH = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── CDN — та же строка, что на сайте (Install, CDN Quickstart). «//» записан кодом: адреса — текст урока, урок их не грузит.
const BS_H = 'https://';
const BS_CDN = BS_H + 'cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/';
const BS_CSS_URL = BS_CDN + 'css/bootstrap.min.css';
const BS_JS_URL = BS_CDN + 'js/bootstrap.bundle.min.js';
const BS_CSS_SRI = 'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe';
const BS_JS_SRI = 'sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL';
const LINK_HTML = '<link href="' + BS_CSS_URL + '" rel="stylesheet" integrity="' + BS_CSS_SRI + '" crossorigin="anonymous">';
const SCRIPT_HTML = '<script type="module" src="' + BS_JS_URL + '" integrity="' + BS_JS_SRI + '" crossorigin="anonymous"></script>';
// Ссылка, «поправленная» Коди (s11): буквы в слове bootstrap поменялись местами — такого файла нет.
const LINK_BAD = LINK_HTML.replace('npm/bootstrap@', 'npm/bootsrtap@');
const BS_THEMES = ['primary', 'accent', 'success', 'danger', 'warning', 'info', 'inverse', 'secondary'];
const CLOSE_BTN = '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
const SAMPLE = 'A simple alert—check it out!';

// ── СТРОКИ КОДА: подсветка HTML как в VS Code; значение integrity свёрнуто, как в редакторе (sha384-B/GM…CrCe).
const sp = () => <span className="b1-sp">{' '}</span>;
function foldVal(v, mark, fold) {
  if (fold === 'pkg' && /cdn\.jsdelivr/.test(v)) { const m = /npm\/([^/]+)\//.exec(v); return <span title={v}>{'…/npm/'}<b className="b1-pkg">{m ? m[1] : ''}</b>{'/…/' + v.slice(v.lastIndexOf('/') + 1)}</span>; }   // видна буква в имени пакета (t4)
  if (fold && /cdn\.jsdelivr/.test(v)) return <span className="b1-fold" title={v}>{'…/' + v.slice(v.lastIndexOf('/') + 1)}</span>;
  if (/^sha384-/.test(v)) return <span className={'b1-fold' + (mark === 'sri' ? ' is-mk' : '')} title={v}>{v.slice(0, 11) + '…' + v.slice(-4)}</span>;
  if (mark && /cdn\.jsdelivr/.test(v)) {
    const at = v.indexOf('bootstrap@'), ver = 'bootstrap@6.0.0-alpha.1';
    const fi = v.lastIndexOf('/') + 1;
    if (at > 0) return <>{v.slice(0, at)}<span className={mark === 'ver' ? 'b1-mk' : ''}>{ver}</span>{v.slice(at + ver.length, fi)}<span className={mark === 'file' ? 'b1-mk' : ''}>{v.slice(fi)}</span></>;
  }
  return v;
}
function hParts(src, opt) {
  const o = opt || {};
  const out = [];
  let n = 0;
  const key = () => 'h' + (n++);
  const re = /<\/?[a-zA-Z!][\w-]*|\/?>/g;
  let m, i = 0, inTag = false;
  const text = (t) => {
    if (!t) return;
    if (!inTag) { out.push(<span key={key()} className="b1-tx">{t}</span>); return; }
    t.split(/(\s+|=|"[^"]*")/).forEach((p) => {
      if (!p) return;
      if (p[0] === '"') out.push(<span key={key()} className="b1-st">{'"'}{foldVal(p.slice(1, -1), o.mark, o.fold)}{'"'}</span>);
      else if (p === '=') out.push(<span key={key()} className="b1-pn">=</span>);
      else if (/^\s+$/.test(p)) out.push(<React.Fragment key={key()}>{sp()}</React.Fragment>);
      else out.push(<span key={key()} className="b1-at">{p}</span>);
    });
  };
  while ((m = re.exec(src))) {
    text(src.slice(i, m.index));
    const t = m[0];
    if (t === '>' || t === '/>') { out.push(<span key={key()} className="b1-pn">{t}</span>); inTag = false; }
    else { const sl = t[1] === '/' ? 2 : 1; out.push(<span key={key()} className="b1-pn">{t.slice(0, sl)}</span>, <span key={key()} className="b1-tg">{t.slice(sl)}</span>); inTag = true; }
    i = m.index + t.length;
  }
  text(src.slice(i));
  return out;
}
const hl = (k, d, src, extra, opt) => Object.assign({ k, d, parts: hParts(src, opt), cls: 'b1-line' }, extra || {}, { cls: 'b1-line' + (extra && extra.cls ? ' ' + extra.cls : '') + (src.length > 60 ? ' b1-long' : '') });
// Пустое место для вставки: «✎ Shu yerga qo'ying».
function slotLine(k, d, pick, onTap, led, disabled) {
  return { k, d, cls: 'b1-line b1-slot', onTap, led, disabled, parts: [<span key="p" className="b1-paste">{'✎ ' + pick(UI.paste)}</span>] };
}
// Документ в редакторе: head (title + свои строки) и body (свои строки).
function docLines(pick, head, body) {
  return [hl('ho', 0, '<head>', { cls: 'b1-edge' })]
    .concat(head || [], [hl('hc', 0, '</head>', { cls: 'b1-edge' }), hl('bo', 0, '<body>', { cls: 'b1-edge' })], body || [], [hl('bc', 0, '</body>', { cls: 'b1-edge' })]);
}
const linkL = (k, d, extra, full) => hl(k, d, LINK_HTML, extra, { fold: !full });
const scriptL = (k, d, extra, full) => hl(k, d, SCRIPT_HTML, extra, { fold: !full });
const alertSrc = (cls, close) => ['<div class="' + cls + '" role="alert">', '  <p>{T}</p>'].concat(close ? ['  ' + CLOSE_BTN] : [], ['</div>']);
const alertCode = (k, d, cls, text, close, extra) => alertSrc(cls, close).map((s, j) => hl(k + j, d + (s.startsWith('  ') ? 1 : 0), s.replace(/^ {2}/, '').replace('{T}', text), extra));

// ── СТРАНИЦА: iframe без скриптов. bs — подключён ли CSS Bootstrap (строка link в коде); js — строка script:
// без неё кнопка закрытия e'lon не работает (имитация скрипта Bootstrap). Страница ужимается целиком (scale), если не
// влезает в окно.
function BsFrame({ body, bs, js, onDismiss, onDead, dep, zoom }) {
  const ref = useRef(null);
  const wrap = useRef(null);
  const live = useRef({});
  live.current = { js, onDismiss, onDead };
  // Светлая тема всегда (data-bs-theme="light"): Bootstrap 6 сам включает тёмную, если она в системе, а облик уроков — светлый.
  const doc = useMemo(() => '<!doctype html><html data-bs-theme="light" style="color-scheme:light"><head><meta charset="utf-8">' + (bs ? '<style>' + BS_CSS + '</style>' : '') +
    '<style>html,body{margin:0}body{padding:12px 14px}</style></head><body>' + body + '</body></html>', [body, bs]);
  const fit = () => {
    const f = ref.current, w = wrap.current;
    const d = f && f.contentDocument;
    if (!d || !d.documentElement || !w) return;
    const page = w.closest('.kz-br-page');
    const W = w.clientWidth || 300;
    let z = 1;
    const at = (k) => {
      f.style.width = Math.round(W / k) + 'px'; f.style.height = '10px';
      const h = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);
      f.style.height = h + 'px'; f.style.transform = 'scale(' + k + ')'; w.style.height = Math.ceil(h * k) + 'px';
    };
    if (zoom) { at(zoom); return; }   // примеры на сайте Bootstrap — свой масштаб, без подгонки под окно
    at(z);
    while (page && page.scrollHeight > page.clientHeight + 1 && z > 0.5) { z -= 0.07; at(z); }
  };
  const onLoad = () => {
    const d = ref.current && ref.current.contentDocument;
    if (d) d.addEventListener('click', (e) => {
      const b = e.target && e.target.closest && e.target.closest('[data-bs-dismiss="alert"]');
      if (!b) return;
      if (live.current.js) { const a = b.closest('.alert'); if (a) a.remove(); fit(); if (live.current.onDismiss) live.current.onDismiss(); }
      else if (live.current.onDead) live.current.onDead();
    });
    fit();
  };
  useLayoutEffect(() => {
    const page = wrap.current && wrap.current.closest('.kz-br-page');
    if (!page || typeof ResizeObserver === 'undefined') return undefined;
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
    ro.observe(page);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(fit, 80); return () => clearTimeout(t); }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={wrap} className="b1-frame"><iframe ref={ref} title="page" srcDoc={doc} sandbox="allow-same-origin" scrolling="no" tabIndex={-1} onLoad={onLoad} /></div>;
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url || 'index.html'} short={short} cls={'b1-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
// Сайт кружка: заголовок и e'lon. cls — class у div (null — без class), text, close — с кнопкой закрытия.
const siteHtml = (pick, a) => (a && a.h1 ? '<h1>' + escH(pick(C.site.h1)) + '</h1>' : '') + (a === null ? '' : a && a.gone ? '' :
  '<div' + (a && a.cls != null ? ' class="' + escH(a.cls) + '"' : '') + ' role="alert"><p>' + escH(a && a.text != null ? a.text : pick(C.site.notice)) + '</p>' + (a && a.close ? CLOSE_BTN : '') + '</div>');
function SitePage({ pick, a, bs, js, onDismiss, onDead, title }) {
  const body = siteHtml(pick, a);
  return <Br title={title || pick(C.site.title)} short><BsFrame body={body} bs={bs} js={js} onDismiss={onDismiss} onDead={onDead} dep={body + bs} /></Br>;
}

// ── САЙТ BOOTSTRAP И ПОИСК GOOGLE — в bs1-site.jsx (подключается после этого файла).

// Помощь на экране-объяснении (как в уроках CSS): ступени 1-2-3 по лампочке.
function useShowHelp(help) {
  const lad = useKzLadder(!!(help && help.length));
  const num = (k) => { const o = {}; LANGS.forEach((l) => { o[l] = k + '/' + help.length + ' · ' + (help[k - 1][l] !== undefined ? help[k - 1][l] : help[k - 1].ru); }); return o; };
  if (!help || !help.length) return { now: null, next: null };
  return { now: lad.lv > 0 ? num(Math.min(lad.lv, help.length)) : null, next: help[Math.min(lad.lv, help.length - 1)] };
}
// Ход «скопируй на сайте → вставь в код» (s9, s10, s13): want — какую копию ждём; промахи — своя причина.
function useCopyPaste({ want, c, canTap, onDone }) {
  const [clip, setClip] = useState(null);
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(true);
  const st = useRef({ tries: 0, misses: 0 });
  const copy = (k) => { if (!canTap) return; sfx('pop', true); setClip(k); setMsg(null); return k; };
  const paste = (sayNow) => {
    if (!canTap) return false;
    st.current.tries += 1;
    const issue = !clip ? c.msgs.noClip : clip !== want ? c.msgs.wrongClip : null;
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return false; }
    setMsg(null); onDone(st.current, lad); return true;
  };
  return { clip, copy, paste, msg, lad, st, setMsg };
}

// =============================================================================
// S1. КРЮЧОК — объявление простое; рядом 12 строк CSS Коди. «Bootstrap bilan» — одна ссылка и class, e'lon стал
// карточкой. Загадка: «Bootstrap — программа, её надо установить».
// =============================================================================
const HOOK_CSS_LINES = ['.elon {', '  padding: 16px 20px;', '  margin: 12px 0;', '  border: 1px solid #9be0b4;', '  border-radius: 10px;', '  background-color: #e6f7ec;', '  color: #0b5d2b;', '  font-family: Arial;', '  font-size: 16px;', '  line-height: 1.5;', '  box-shadow: 0 2px 6px #ccc;', '}'];
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
    sayNow(c.magic, 'wonder'); say(c.magicP, 'point'); say(c.done, 'smile');
  };
  const code = on
    ? [hl('l', 0, LINK_HTML, { cls: 'is-new' }), hl('d', 0, '<div class="alert theme-success" role="alert">', { cls: 'is-new' })]
    : HOOK_CSS_LINES.map((s, j) => ({ k: 'k' + j, d: s.startsWith('  ') ? 1 : 0, cls: 'b1-line b1-css', parts: [<span key="t" className={j === 0 || j === HOOK_CSS_LINES.length - 1 ? 'b1-sel' : 'b1-at'}>{s.trim()}</span>] }));
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene b1-pair">
          <div className="kz-col"><KzCode lines={code} cls={'kz-code-sm' + (on ? '' : ' b1-csscode')} /></div>
          <div className="kz-col"><SitePage pick={pick} a={on ? { cls: 'alert theme-success', h1: true } : { h1: true }} bs={on} /></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.withBs)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ЧТО ТАКОЕ BOOTSTRAP (показ) — голая страница → файл bootstrap.min.css (строки .alert, .theme-success) →
// у div появляется class → e'lon одевается.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);   // 0 — голая; 1 — файл подключён, class нет; 2 — class
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } }, { say: [{ text: c.sayFile, pose: 'point' }] },
    { act: () => { sfx('ok', true); setN(2); } }, { say: [{ text: c.sayClass, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askClass : n === 1 ? c.askFile : c.askStart;
  const help = useShowHelp(c.help);
  const fileLines = ['.alert {', '  padding: …;  border: …;', '  border-radius: …;', '}', '.theme-success { … }'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div className="kz-scene b1-pair">
          <div className="kz-col">
            {n >= 1 ? (
              <div className={'b1-file kz-a-drop' + (n === 1 ? ' is-hl' : '')}>
                <span className="b1-file-h">bootstrap.min.css</span>
                <KzCode lines={fileLines.map((s, j) => ({ k: 'f' + j, d: s.startsWith('  ') ? 1 : 0, cls: 'b1-line b1-css', parts: [<span key="t" className={/^[.}]/.test(s) ? 'b1-sel' : 'b1-at'}>{s.trim()}</span>] }))} cls="kz-code-sm b1-nofile" />
              </div>
            ) : null}
            <KzCode lines={[hl('d', 0, n === 2 ? '<div class="alert theme-success" role="alert">' : '<div role="alert">', { cls: n === 2 ? 'is-new is-read' : '' }), hl('p', 1, '<p>' + pick(C.site.notice) + '</p>'), hl('dc', 0, '</div>')]} cls="kz-code-sm" />
          </div>
          <div className="kz-col"><SitePage pick={pick} a={{ cls: n === 2 ? 'alert theme-success' : null }} bs={n >= 1} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// X1. ОПЫТ «ЧТО ВКЛЮЧАЕТ BOOTSTRAP» (заказчик, 19.11.2026: урок из 11 слайдов — ученик должен понять, как это работает):
// два переключателя — строка link и class у div. Объявление одето, только когда включены оба; в карточке файла Bootstrap
// правило .alert загорается, когда класс совпал. Каждое состояние — своя реплика. Готово — оба включены.
// =============================================================================
function X1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.x1;
  const [rec, put] = useRec('x1');
  const solved = !!(rec && rec.done);
  const [lk, setLk] = useState(solved);
  const [cl, setCl] = useState(solved);
  const [ok, setOk] = useState(solved);
  const lad = useKzLadder(!ok);
  const st = useRef({ tries: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || ok, spoken);
  const led = useIdleLed(canTap && !ok, (lk ? 1 : 0) + (cl ? 2 : 0));
  const flip = (which) => {
    if (!canTap || ok) return;
    st.current.tries += 1;
    const nl = which === 'lk' ? !lk : lk, nc = which === 'cl' ? !cl : cl;
    setLk(nl); setCl(nc); sfx('tap', true);
    if (nl && nc) {
      sfx('win', true); setOk(true); put({ done: true });
      log({ screenId: 'x1', type: 'experiment', correct: true, firstTry: st.current.tries <= 2, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(joinL(c.ok, c.done), 'cheer');
      return;
    }
    if (st.current.tries >= 3) lad.bump();
    sayNow(nl ? c.linkOnly : nc ? c.classOnly : c.none, 'think');
  };
  const sw = (k, on, label) => (
    <button key={k} type="button" className={'b1-sw' + (on ? ' is-on' : '')} onClick={() => flip(k)} disabled={!canTap || ok} aria-pressed={on ? 'true' : 'false'} data-sw={k}>
      <i aria-hidden="true" /><span translate="no">{label}</span><Led on={led && !on} />
    </button>
  );
  const lines = [hl('ho', 0, '<head>', { cls: 'b1-edge' }), lk ? linkL('lk', 1, { cls: 'is-new' }) : { k: 'lk0', d: 1, cls: 'b1-line b1-off', parts: [<span key="t" className="b1-cm">{'<!-- link yo\'q -->'}</span>] }, hl('hc', 0, '</head>', { cls: 'b1-edge' }),
    hl('d', 0, cl ? '<div class="alert theme-success" role="alert">' : '<div role="alert">', { cls: cl ? 'is-new' : '' }), hl('p', 1, '<p>' + pick(C.site.mine) + '</p>'), hl('dc', 0, '</div>')];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={ok ? c.askDone : c.ask} hint={ok ? null : hintAt(lad.lv, c.hints)} />
        <div className="kz-scene b1-pair b1-x1">
          <div className="kz-col">
            <div className={'b1-file' + (lk ? ' is-on' : ' is-off')}>
              <span className="b1-file-h">bootstrap.min.css {lk ? '✓' : '✕'}</span>
              <div className={'b1-rule' + (lk && cl ? ' is-hit' : '')} translate="no"><b>.alert</b> {'{ padding: …; border: …; }'}</div>
              <div className={'b1-rule' + (lk && cl ? ' is-hit' : '')} translate="no"><b>.theme-success</b> {'{ … }'}</div>
            </div>
            <KzCode lines={lines} cls="kz-code-sm b1-x1-code" />
          </div>
          <div className="kz-col"><SitePage pick={pick} a={{ cls: cl ? 'alert theme-success' : null, text: pick(C.site.mine) }} bs={lk} /></div>
        </div>
        <div className="kz-row b1-sws">{sw('lk', lk, pick(c.linkL))}{sw('cl', cl, 'class="alert"')}</div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// G1. КАК НАЙТИ САЙТ (показ «как на видео»; заказчик, 19.11.2026: «покажи, как заходят на сайт, начиная с гугл поиска»):
// Google → курсор жмёт поле, буквы bootstrap появляются → результаты → курсор жмёт getbootstrap.com → главная → курсор
// жмёт «Read the docs» → документация, страница Install. Адрес и вкладка окна меняются, как в настоящем браузере.
// =============================================================================
const webStage = (k) => ({   // функция: bdTitle/bdPath — из bs1-site.jsx, он подключается после этого файла
  google: { t: 'Google', u: 'google.com' },
  results: { t: 'bootstrap - Google Search', u: 'google.com/search?q=bootstrap' },
  home: { t: 'Bootstrap · The most popular HTML, CSS, and JS library in the world.', u: 'getbootstrap.com' },
  docs: { t: bdTitle('Install'), u: bdPath('Install') }
})[k];
function G1({ p }) {
  const c = C.g1;
  const [rec, put] = useRec('g1');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const [stage, setStage] = useState(solved ? 'docs' : 'google');
  const [typed, setTyped] = useState('');
  const [caret, setCaret] = useState(false);
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const typeWord = () => { const w = 'bootstrap'; for (let i = 1; i <= w.length; i += 1) tm.current.push(setTimeout(() => { setTyped(w.slice(0, i)); sfx('type', true); }, i * (reduceMotion() ? 20 : 120))); };
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => M.go('[data-x="gbox"]', 0.35, 0.5), wait: M.slow },
    { act: () => { M.click(); setCaret(true); }, wait: 350 },
    { act: () => typeWord() },
    { say: [{ text: c.sayType, pose: 'point' }] },
    { act: () => { setCaret(false); M.hide(); setStage('results'); }, wait: 600 },
    { say: [{ text: c.sayResults, pose: 'point' }] },
    { act: () => M.go('[data-x="result"] .gg-t', 0.3, 0.5, { hand: true }), wait: M.slow },
    { act: () => M.click(), wait: 350 },
    { act: () => { M.hide(); setStage('home'); }, wait: 700 },
    { say: [{ text: c.sayHome, pose: 'point' }] },
    { act: () => M.go('[data-x="read"]', 0.5, 0.5, { hand: true }), wait: M.slow },
    { act: () => M.click(), wait: 350 },
    { act: () => { M.hide(); setStage('docs'); }, wait: 700 },
    { say: [{ text: c.sayDocs, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : stage === 'docs' ? c.askDocs : stage === 'home' ? c.askHome : stage === 'results' ? c.askResults : caret ? c.askType : c.askStart;
  const help = useShowHelp(c.help);
  const W = webStage(stage);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className="kz-scene kz-scene-col ms-root">
          <div className="kz-col">
            <PaperBrowser title={W.t} url={W.u} short cls="b1-br b1-docs b1-web">
              {stage === 'google' ? <GoogleHome typed={typed} caret={caret} />
                : stage === 'results' ? <GoogleResults q="bootstrap" />
                : stage === 'home' ? <BxHome />
                : <BsDocs page="Install" open="start" navOff copyOff />}
            </PaperBrowser>
          </div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. КОПИРУЕМ ССЫЛКУ (показ «как на видео»; заказчик, 19.11.2026): как на сайте — один блок кода «HTML» с двумя строками
// (link и script) и значком копирования. Курсор жмёт значок («Copied!») → обе строки влетают в head → страница одевается →
// строка script переезжает перед </body> → курсор жмёт крестик у e'lon — он закрывается. Курсор — только в окнах браузера.
// =============================================================================
const quietSlot = (k, d, pick, on) => ({ k, d, cls: 'b1-line b1-slot' + (on ? ' is-on' : ''), parts: [<span key="p" className="b1-paste">{'✎ ' + pick(UI.paste)}</span>] });
function useCloseX(root, M) {
  const btn = () => {
    const r = root.current; const fr = r && r.querySelector('.b1-tri-page iframe');
    const b = fr && fr.contentDocument && fr.contentDocument.querySelector('.btn-close');
    return b ? { fr, b } : null;
  };
  const go = () => {
    const x = btn(); if (!x) return;
    const wrap = x.fr.parentElement; const k = wrap.clientWidth / (x.fr.offsetWidth || 1); const r = x.b.getBoundingClientRect();
    M.go('.b1-tri-page .b1-frame', (r.left + r.width / 2) * k / (wrap.clientWidth || 1), (r.top + r.height / 2) * k / (wrap.clientHeight || 1), { hand: true });
  };
  const click = () => { const x = btn(); M.click(); if (x) x.b.click(); };
  return { go, click };
}
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const X = useCloseX(root, M);
  const [clip, setClip] = useState(solved ? 'cdn' : null);
  const [pasted, setPasted] = useState(solved);
  const [moved, setMoved] = useState(solved);
  const [closed, setClosed] = useState(solved);
  const [n, setN] = useState(solved ? 5 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { setN(1); M.go('.bd-copy[data-copy="cdn"]', 0.5, 0.5, { hand: true }); }, wait: M.slow },
    { act: () => { M.click(); setClip('cdn'); }, wait: 650 },
    { say: [{ text: c.sayCopy, pose: 'point' }] },
    { act: () => { M.hide(); sfx('ok', true); setPasted(true); setN(2); }, wait: 600 },
    { say: [{ text: c.sayPaste, pose: 'wonder' }] },
    { act: () => { sfx('pop', true); setMoved(true); setN(3); }, wait: 700 },
    { say: [{ text: c.sayMove, pose: 'point' }] },
    { act: () => { setN(4); X.go(); }, wait: M.slow },
    { act: () => X.click(), wait: 650 },
    { say: [{ text: c.sayClose, pose: 'wonder' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => { M.hide(); setN(5); put({ done: true }); } }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done || n >= 5 ? c.askDone : [c.askStart, c.askCopy, c.askPaste, c.askMove, c.askClose][n];
  const help = useShowHelp(c.help);
  const note = pick(C.site.mine);
  const head = !pasted ? [quietSlot('slot', 1, pick, !!clip)]
    : [linkL('lk', 1, { cls: n === 2 ? 'is-new is-read' : '' })].concat(moved ? [] : [scriptL('sc', 1, { cls: 'is-new is-read' })]);
  const body = alertCode('a', 1, 'alert theme-success', note, true).concat(moved ? [scriptL('sc', 1, { cls: n === 3 ? 'is-new is-read b1-moved' : '' })] : []);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        <div ref={root} className={'kz-scene b1-tri ms-root' + (pasted ? ' has-clip' : '')}>
          <div className="kz-col b1-tri-docs"><DocsBr page="Install"><BsDocs page="Install" only="cdn" copied={clip} copyOff scrollTo="cdn" /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, head, body)} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} a={{ cls: 'alert theme-success', text: note, close: true, gone: closed }} bs={pasted} js={pasted} onDismiss={() => setClosed(true)} /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}


// =============================================================================
// SC. ГОТОВАЯ ДЕТАЛЬ (показ «как на видео») — меню (на телефоне ☰) → Components → Alert → значок копирования → код влетает
// в body → текст выделяется и меняется на свой → курсор показывает theme-warning в Variants → слово в class → жёлтый.
// Реплика про Bootstrap 5: alert-success, btn-primary из старых уроков в 6-й версии не работают.
// =============================================================================
function SC({ p }) {
  const pick = usePick();
  const c = C.sc;
  const [rec, put] = useRec('sc');
  const solved = !!(rec && rec.done);
  const root = useRef(null);
  const M = useMysh(root);
  const [page, setPage] = useState(solved ? 'Alert' : 'Install');
  const [open, setOpen] = useState(solved ? 'comp' : 'start');
  const [menuView, setMenuView] = useState(false);
  const [peek, setPeek] = useState(null);
  const [H, setH] = useState(null);
  const [n, setN] = useState(solved ? 5 : 0);   // 1 — меню; 2 — Alert; 3 — вставлен; 4 — свой текст; 5 — theme-warning
  const [copied, setCopied] = useState(solved);
  const [sel, setSel] = useState(null);
  const [scroll, setScroll] = useState(solved ? 'variants' : null);
  const [pageView, setPageView] = useState(solved);
  const burger = () => !!(root.current && root.current.querySelector('[data-x="burger"]'));
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { setN(1); if (burger()) M.go('[data-x="burger"]', 0.5, 0.5, { hand: true }); else setH('menu'); }, wait: M.slow },
    { act: () => { if (burger()) { M.click(); setMenuView(true); setH('menu'); } }, wait: 450 },
    { say: [{ text: c.sayMenu, pose: 'point' }] },
    { act: () => { setH(null); setPeek('comp'); }, wait: 250 },
    { act: () => M.go('.bd-grp-h[data-g="comp"]', 0.35, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); setOpen('comp'); }, wait: 350 },
    { act: () => M.go('.bd-item[data-item="Alert"]', 0.3, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); setPage('Alert'); setMenuView(false); setN(2); setScroll('alert'); }, wait: 550 },
    { say: [{ text: c.sayAlert, pose: 'point' }] },
    { act: () => M.go('.bd-code[data-code="alert"] .bd-copy', 0.5, 0.5, { hand: true }), wait: M.slow },
    { act: () => { M.click(); setCopied(true); }, wait: 650 },
    { act: () => { M.hide(); sfx('ok', true); setN(3); setPageView(true); }, wait: 500 },
    { say: [{ text: c.sayCopy, pose: 'point' }] },
    { act: () => setSel('text'), wait: 1000 },
    { act: () => { setSel(null); sfx('pop', true); setN(4); }, wait: 500 },
    { say: [{ text: c.sayText, pose: 'point' }] },
    { act: () => { setPageView(false); setScroll('variants'); }, wait: 500 },
    { act: () => M.go('.bd-code[data-code="variants"] pre > div:nth-child(5)', 0.55, 0.5), wait: M.slow },
    // 19.11.2026: строка theme-warning подсвечивается на сайте и видна, пока курсор на ней; только потом — код и страница
    // (раньше всё переключалось в миг прилёта курсора, и на телефоне выбранной строки не было видно).
    { act: () => setN(5), wait: 900 },
    { act: () => { M.hide(); sfx('ok', true); setPageView(true); }, wait: 600 },
    { say: [{ text: c.sayColor, pose: 'wonder' }] },
    { say: [{ text: c.sayOld, pose: 'think' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const askText = solved || demo.done ? c.askDone : n >= 5 ? c.askColor : n === 4 ? c.askText : n === 3 ? c.askCopy : n === 2 ? c.askAlert : c.askStart;
  const help = useShowHelp(c.help);
  const text = n >= 4 ? pick(C.site.mine) : SAMPLE;
  const cls = n >= 5 ? 'alert theme-warning' : 'alert';
  const body = n >= 3 ? alertCode('a', 1, cls, text, false, { cls: n === 3 ? 'is-new' : '' }).map((l, j) => (j === 1 && sel === 'text') ? Object.assign({}, l, { cls: l.cls + ' is-sel' }) : (n === 4 && j === 1) || (n === 5 && j === 0) ? Object.assign({}, l, { cls: l.cls + ' is-new is-read' }) : l) : [quietSlot('slot', 1, pick, copied)];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={help.next || askText} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={askText} hint={help.now} />
        {/* is-nav — на телефоне только окно сайта, крупно: пока ищем Alert (n < 3) и пока выбираем строку в Variants (n ≥ 4, сайт снова открыт;
            19.11.2026 — иначе окно сайта ~90 px, строки theme-warning не видно, курсор показывал на код) */}
        <div ref={root} className={'kz-scene b1-tri is-show ms-root' + (pageView ? ' has-clip' : '') + (n < 3 || (n >= 4 && !pageView && !(solved || demo.done)) ? ' is-nav' : '')}>
          <div className="kz-col b1-tri-docs"><DocsBr page={page}><BsDocs page={page} open={open} hl={H} navOff copyOff menuView={menuView} peek={peek} copied={copied ? 'alert' : null} mark={n >= 5 ? { variants: [4] } : null} scrollTo={scroll} scrollKey={String(pageView) + scroll + n} /></DocsBr></div>
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, [linkL('lk', 1)], body)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} a={n >= 3 ? { cls, text } : null} bs /></div>
          {M.el}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// T1. ПОДКЛЮЧИ САМ — значок копирования у блока CDN → пустое место в head (обе строки) → нажать строку script → пустое
// место перед </body>. Страница одевается после вставки; крестик работает. Промахи — причина в панели.
// =============================================================================
function T1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t1;
  const [rec, put] = useRec('t1');
  const solved = !!(rec && rec.done);
  const [pasted, setPasted] = useState(solved);
  const [picked, setPicked] = useState(false);
  const [moved, setMoved] = useState(solved);
  const [msg2, setMsg2] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || moved, spoken);
  const cp = useCopyPaste({ want: 'cdn', c: { msgs: { noClip: c.msgs.noClip, wrongClip: c.msgs.noClip } }, canTap: canTap && !pasted, onDone: () => {
    sfx('ok', true); setPasted(true); sayNow(c.pasted, 'smile');
  } });
  const lv = cp.lad.lv;
  const led = useIdleLed(canTap && !moved, (cp.clip ? 1 : 0) + (pasted ? 2 : 0) + (picked ? 4 : 0));
  const pick2 = () => { if (!canTap || moved) return; sfx('tap', true); setPicked(true); setMsg2(c.picked); };
  const drop = () => {
    if (!canTap || moved) return;
    if (!picked) { sfx('soft', true); setMsg2(c.msgs.needPick); sayNow(c.msgs.needPick, 'think'); cp.lad.bump(); return; }
    sfx('win', true); setMoved(true); setMsg2(null); put({ done: true });
    log({ screenId: 't1', type: 'connect-cdn', correct: true, firstTry: cp.st.current.misses === 0, attempts: cp.st.current.tries + 1, hints: cp.lad.asked.current, depth: cp.lad.lv });
    sayNow(c.ok, 'cheer');
  };
  const head = !pasted ? [slotLine('slot', 1, pick, () => cp.paste(sayNow), (led && !!cp.clip) || (lv >= 3 && !!cp.clip), !canTap)]
    : [linkL('lk', 1, { cls: moved ? '' : 'is-new' })].concat(moved ? [] : [scriptL('sc', 1, { cls: 'b1-hline' + (picked ? ' is-picked' : ''), onTap: pick2, disabled: !canTap, led: !picked && (led || lv >= 3) })]);
  const body = alertCode('a', 1, 'alert theme-success', pick(C.site.mine), true)
    .concat(pasted && !moved ? [{ k: 'drop', d: 1, cls: 'b1-line b1-slot' + (picked ? ' is-on' : ''), onTap: drop, disabled: !canTap, led: picked && (led || lv >= 3), parts: [<span key="p" className="b1-paste">{'✎ ' + pick(UI.paste)}</span>] }] : moved ? [scriptL('sc2', 1, { cls: 'is-new' })] : []);
  const hintNow = moved ? null : (cp.msg || msg2 || (cp.clip && !pasted ? c.copied : null) || hintAt(lv, c.hints));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={moved ? c.ok : pasted ? c.askMove : c.ask} hint={hintNow} err={!!cp.msg || msg2 === c.msgs.needPick} />
        <div className={'kz-scene b1-tri' + (cp.clip ? ' has-clip' : '') + (moved ? ' is-done' : '')}>
          {!moved ? <div className="kz-col b1-tri-docs"><DocsBr page="Install"><BsDocs page="Install" only="cdn" onCopy={(k) => cp.copy(k)} copied={cp.clip} lit={!cp.clip && (led || lv >= 2) ? 'cdn' : null} copyOff={!canTap || pasted} scrollTo="cdn" /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, head, body)} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} a={{ cls: 'alert theme-success', text: pick(C.site.mine), close: true }} bs={pasted} js={pasted} /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// T2. ВОЗЬМИ ALERT САМ — найти в меню Alert (на телефоне сначала ☰), значок копирования у примера, пустое место в body.
// Не та страница — она честно открывается, причина в панели.
// =============================================================================
function T2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t2;
  const [rec, put] = useRec('t2');
  const solved = !!(rec && rec.done);
  const [page, setPage] = useState(solved ? 'Alert' : 'Install');
  const [open, setOpen] = useState(solved ? 'comp' : 'start');
  const [menuView, setMenuView] = useState(false);
  const [pasted, setPasted] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || pasted, spoken);
  const cp = useCopyPaste({ want: 'alert', c: { msgs: { noClip: c.msgs.noClip, wrongClip: c.msgs.noClip } }, canTap: canTap && !pasted, onDone: (st, lad) => {
    sfx('win', true); setPasted(true); put({ done: true });
    log({ screenId: 't2', type: 'find-copy', correct: true, firstTry: st.misses === 0, attempts: st.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'cheer');
  } });
  const lv = cp.lad.lv;
  const led = useIdleLed(canTap && !pasted, (page === 'Alert' ? 1 : 0) + (cp.clip ? 2 : 0));
  const nav = (it) => {
    if (!canTap || pasted) return;
    setPage(it); setMenuView(false);
    if (it !== 'Alert') { sfx('soft', true); const m = fillL(c.msgs.wrong, { w: it }); setMsg(m); sayNow(m, 'think'); cp.lad.bump(); return; }
    sfx('ok', true); setMsg(null);
  };
  const onAlert = page === 'Alert';
  const g = 'comp';
  const lit = pasted ? null : !onAlert ? (lv >= 2 ? (open === g ? 'item:Alert' : 'grp:' + g) : null) : (!cp.clip && (led || lv >= 2) ? 'alert' : null);
  const body = pasted ? alertCode('a', 1, 'alert', SAMPLE, false, { cls: 'is-new' }) : [slotLine('slot', 1, pick, () => cp.paste(sayNow), !!cp.clip && (led || lv >= 3), !canTap)];
  const hintNow = pasted ? null : (cp.msg || msg || (cp.clip ? c.copied : null) || hintAt(lv, c.hints));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={pasted ? c.ok : onAlert ? c.ask : c.askFind} hint={hintNow} err={!!cp.msg || !!msg} />
        <div className={'kz-scene b1-tri' + (cp.clip ? ' has-clip' : ' is-nav') + (pasted ? ' is-done' : '')}>
          {!pasted ? <div className="kz-col b1-tri-docs"><DocsBr page={page}><BsDocs page={page} open={open} onOpen={(x) => canTap && setOpen(x)} onNav={nav} navOff={!canTap} onCopy={(k) => { if (onAlert) cp.copy(k); }} copied={cp.clip} copyOff={!canTap || !onAlert} lit={lit} menuView={menuView} onMenu={() => setMenuView((x) => !x)} scrollTo={onAlert ? 'alert' : null} scrollKey={page} /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={docLines(pick, [linkL('lk', 1)], body)} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} a={pasted ? { cls: 'alert', text: SAMPLE } : null} bs /></div>
        </div>
      </Sheet>
    </StageB>
  );
}

const noTagsIn = (s) => /[<>]/.test(String(s || ''));
function themeIssue(raw, c, want) {
  const v = String(raw || '').trim().toLowerCase().replace(/[“”«»"']/g, '');
  if (!v) return c.msgs.empty;
  if (/[Ѐ-ӿ]/.test(v) || /yashil|зел/.test(v)) return c.msgs.native;
  if (/green|yellow|red|blue/.test(v)) return c.msgs.green;
  const m = /^theme-([a-z]+)$/.exec(v);
  if (!m) {
    if (BS_THEMES.indexOf(v) >= 0 || /^theme\s*[a-z]+$/.test(v)) return c.msgs.noTheme;
    return c.msgs.typo;
  }
  if (BS_THEMES.indexOf(m[1]) < 0) return c.msgs.typo;
  if (want && m[1] !== want) return c.msgs.other;
  return null;
}

// =============================================================================
// W1. СВОЁ E'LON — два поля: слово цвета (с сайта, Variants) и текст. Страница меняется при наборе; «Tayyor».
// =============================================================================
function W1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w1;
  const store = useStore();
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [th, setTh] = useState(store.get('myTheme') || '');
  const [tx, setTx] = useState(store.get('myText2') || '');
  const [msg, setMsg] = useState(null);
  const lad = useKzLadder(!solved);
  const st = useRef({ tries: 0, misses: 0 });
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved && !th, 0);
  const vt = th.trim().toLowerCase(), vx = tx.trim();
  const ready = !!(vt && vx);
  const confirm = () => {
    if (!canTap || !ready || solved) return;
    st.current.tries += 1;
    const nt = fillL(c.msgs.notTheme, { w: th.trim() });
    const tIssue = themeIssue(vt, { msgs: { empty: c.msgs.empty, native: c.msgs.native, noTheme: c.msgs.noTheme, green: nt, typo: nt, other: null } }, null);
    const issue = tIssue || (noTagsIn(vx) ? UI.noTags : vx.replace(/\s+/g, '').length < 3 ? c.msgs.empty : normT(vx) === normT(SAMPLE) ? c.msgs.same : null);
    if (issue) { st.current.misses += 1; sfx('soft', true); setMsg(issue); sayNow(issue, 'think'); if (st.current.misses >= 2) lad.bump(); return; }
    sfx('win', true); setMsg(null); store.set('myTheme', vt); store.set('myText2', vx); put({ done: true });
    log({ screenId: 'w1', type: 'own-alert', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv, theme: vt });
    sayNow(c.ok, 'cheer');
  };
  const f = (val, set, k, max, ph) => (solved ? <span key={k} className={k === 'th' ? 'b1-st' : 'b1-tx'}>{val.trim()}</span>
    : <span key={k} className={'kz-gap b1-slotin' + (led && k === 'th' ? ' kz-gap-led' : '')}><InlineInput value={val} onChange={(x) => { set(x); setMsg(null); }} onEnter={confirm} placeholder={ph} label={c.ask} max={max} /></span>);
  const l1 = [<span key="a" className="b1-pn">{'<'}</span>, <span key="b" className="b1-tg">div</span>, sp(), <span key="c" className="b1-at">class</span>, <span key="d" className="b1-pn">=</span>, <span key="e" className="b1-st">{'"alert '}</span>, f(th, setTh, 'th', 20, L3('theme-…', 'theme-…', 'theme-…')), <span key="z" className="b1-st">{'"'}</span>, <span key="j" className="b1-pn">{'>'}</span>];
  const l2 = [<span key="a" className="b1-pn">{'<'}</span>, <span key="b" className="b1-tg">p</span>, <span key="c" className="b1-pn">{'>'}</span>, f(tx, setTx, 'tx', 60, L3('…', '…', '…')), <span key="d" className="b1-pn">{'</'}</span>, <span key="e" className="b1-tg">p</span>, <span key="f2" className="b1-pn">{'>'}</span>];
  const valid = vt && !themeIssue(vt, { msgs: { empty: 1, native: 1, noTheme: 1, green: 1, typo: 1, other: null } }, null);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet kz-typed">
        <KzAsk text={solved ? c.ok : c.ask} hint={solved ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className={'kz-scene b1-tri is-ref' + (solved ? ' is-done' : '')}>
          {!solved ? <div className="kz-col b1-tri-docs"><DocsBr page="Alert"><BsDocs page="Alert" only="variants" copyOff scrollTo="variants" /></DocsBr></div> : null}
          <div className="kz-col b1-tri-code"><KzCode lines={[{ k: 'a', d: 1, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l1 }, { k: 'b', d: 2, cls: 'b1-line ' + (solved ? 'is-new' : 'is-hl'), parts: l2 }, hl('c', 1, '</div>')]} cls="kz-code-sm" /></div>
          <div className="kz-col b1-tri-page"><SitePage pick={pick} a={{ cls: 'alert' + (valid ? ' ' + vt : ''), text: vx || SAMPLE }} bs title={pick(UI.mySite)} /></div>
        </div>
        {!solved ? <ReadyBtn on={canTap && ready} glow={canTap && ready} onClick={confirm} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// T4. ПОЧЕМУ НЕ РАБОТАЕТ — три поломки по очереди: нет строки link; в ссылке изменена буква; класс старый (alert-success).
// Страница честная: в первых двух Bootstrap не подключён, в третьей alert серый — alert-success Bootstrap 6 не знает.
// =============================================================================
const T4_ROUNDS = [
  { k: 'noLink', head: [], cls: 'alert theme-success', bs: false },
  { k: 'typo', head: [LINK_BAD], cls: 'alert theme-success', bs: false },
  { k: 'oldClass', head: [LINK_HTML], cls: 'alert alert-success', bs: true }
];
function T4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.t4;
  const [rec, put] = useRec('t4');
  const solved = !!(rec && rec.done);
  const [ii, setIi] = useState(solved ? 2 : 0);
  const [ok, setOk] = useState(solved);
  const [off, setOff] = useState([]);
  const [next, setNext] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === T4_ROUNDS.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const R = T4_ROUNDS[ii];
  const why = c.rounds[ii].why;
  const ch = useChoiceHints(!ok, ii);
  const hints = choiceHints(c.hint1, c.hint2, why, c.opts[R.k]);
  const led = useIdleLed(canTap && !ok, ii * 10 + off.length);
  const choose = (k) => {
    if (!canTap || ok || off.indexOf(k) >= 0) return;
    st.current.tries += 1;
    if (k !== R.k) { st.current.misses += 1; sfx('soft', true); setOff(off.concat(k)); sayNow(ch.miss(why, hints), 'think'); return; }
    sfx('ok', true); setOk(true); ch.clear();
    const line = joinL(c.right, why);
    if (ii === T4_ROUNDS.length - 1) {
      put({ done: true });
      log({ screenId: 't4', type: 'why-broken', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: ch.lad.asked.current, depth: ch.lad.lv });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff([]); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const lines = [hl('ho', 0, '<head>', { cls: 'b1-edge' })].concat(R.head.length ? R.head.map((h, j) => hl('h' + j, 1, h, {}, { fold: 'pkg' })) : [{ k: 'none', d: 1, cls: 'b1-line b1-off', parts: [<span key="t" className="b1-cm">{'  '}</span>] }],
    [hl('hc', 0, '</head>', { cls: 'b1-edge' }), hl('d', 0, '<div class="' + R.cls + '" role="alert">'), hl('p', 1, '<p>' + pick(C.site.mine) + '</p>'), hl('dc', 0, '</div>')]);
  const keys = ['noLink', 'typo', 'oldClass'];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={ch.next(hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="b1-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : ch.now(hints)} err={ch.err} n={(ii + 1) + '/' + T4_ROUNDS.length} />
        <div className="kz-scene b1-pair b1-wide-code" key={'r' + ii}>
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm b1-nowrap" /></div>
          <div className="kz-col b1-t4-page"><SitePage pick={pick} a={{ cls: R.cls, text: pick(C.site.mine) }} bs={R.bs} /></div>
        </div>
        <div className="kz-pick b1-why">
          {keys.map((k) => (
            <button key={k} type="button" disabled={!canTap || ok || off.indexOf(k) >= 0} onClick={() => choose(k)} data-v={k}
              className={'kz-btn b1-opt2 ' + (ok && k === R.k ? 'is-ok' : off.indexOf(k) >= 0 ? 'is-off' : 'is-ghost')}>
              {pick(c.opts[k])}<Led on={(led && !ok && off.length === 0) || (ch.lad.lv >= 3 && k === R.k && !ok)} />
            </button>
          ))}
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S16. ВЫВОД — разгадка: ничего не устанавливали, одна строка link; своё e'lon ученика; что умеем.
// =============================================================================
function S16({ p }) {
  const pick = usePick();
  const c = C.s16;
  const store = useStore();
  const theme = store.get('myTheme') || 'theme-success';
  const text = store.get('myText2') || store.get('myText') || pick(C.site.mine);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="b1-sheet">
        <div className="kz-scene b1-pair b1-end">
          <div className="kz-col">
            <SitePage pick={pick} a={{ cls: 'alert ' + theme, text }} bs title={pick(UI.mySite)} />
          </div>
          <div className="kz-col b1-end-side">
            <KzCode lines={[linkL('lk', 0, { cls: riddle || curK === 'cdn' ? 'is-read' : '' }), scriptL('sc', 0, { cls: curK === 'cdn' ? 'is-read' : '' })]} cls="kz-code-sm b1-nowrap" />
            <div className="kz-roles">
              {['lib', 'site', 'cdn', 'edit'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'lib' ? '#7952B3' : k === 'site' ? '#FA4F28' : k === 'cdn' ? '#0FA38E' : '#D97706' }}>
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
  { id: 's2', code: 'SHOW', Comp: S2 }, { id: 'x1', code: 'EXPERIMENT', Comp: X1 },
  { id: 'g1', code: 'SHOW', Comp: G1 }, { id: 's9', code: 'SHOW', Comp: S9 }, { id: 'sc', code: 'SHOW', Comp: SC },
  { id: 't1', code: 'LEVEL-1', Comp: T1 }, { id: 't2', code: 'LEVEL-2', Comp: T2 }, { id: 'w1', code: 'LEVEL-3', Comp: W1 },
  { id: 't4', code: 'CHECK', Comp: T4 },
  { id: 's16', code: 'ACHIEVEMENT', Comp: S16 }
];
// «Повторить» стирает только экран; своё e'lon ученика (myText, myTheme, myText2) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], x1: ['x1'], g1: ['g1'], s9: ['s9'], sc: ['sc'], t1: ['t1'], t2: ['t2'], w1: ['w1'], t4: ['t4'] };

// Артефакт урока — своя страница ученика с Bootstrap и своим e'lon.
function lessonBs1Artifact(store) {
  const th = store.get('myTheme'), tx = store.get('myText2') || store.get('myText');
  if (!th && !tx) return null;
  return { type: 'html-page', theme: th || '', text: tx || '',
    html: ['<!doctype html>', '<html lang="uz">', '  <head>', '    <meta charset="utf-8">', '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      '    <title>Mening saytim</title>', '    ' + LINK_HTML, '  </head>', '  <body>',
      '    <div class="alert ' + escH(th || '') + '" role="alert">', '      <p>' + escH(tx || '') + '</p>', '    </div>', '    ' + SCRIPT_HTML, '  </body>', '</html>'].join('\n') };
}

export default function BootstrapVvedenie({ studentName, lang, ttsApiBase, ttsKey, voiceGender, studentUuid, student_uuid, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, ttsKey, studentUuid: studentUuid || student_uuid, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lessonBs1Artifact(store) })
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
