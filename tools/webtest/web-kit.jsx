// =============================================================================
// ТЕСТЫ КУРСОВ HTML И CSS — КАРТИНКИ ВОПРОСА (16.11.2026). Поверх набора тестов «ИИ» (tools/aitest/kit.jsx: AqTest,
// AqBrowser, aqFree, useAqFit, AQ_CSS): формат CRM «JSX savol / test», облик Quiz CoddyCamp, экран без прокрутки.
// Картинка вопроса — то, что ученик видел в уроках: код в тёмном редакторе (как VS Code в облике «Редактор») и/или
// окно Chrome с настоящей страницей. Страница — честная: iframe srcdoc без скриптов, HTML и CSS рисует сам браузер
// (в том числе @media — по ширине страницы vw, :hover — нет, анимации идут).
//
//   <WqVis code="…" file="index.html" mark={[3]} />            — только код (строки mark подсвечены, ___ — пустое место «?»)
//   <WqVis html="…" css="…" />                                — только страница (название вкладки — из <title>)
//   <WqVis code="…" html="…" css="…" />                       — код и результат: на ноутбуке рядом, на телефоне друг под другом
//   параметры страницы: vw — ширина страницы в px (по умолчанию 360 на телефоне, 420 рядом с кодом, 560 одна на ноутбуке), focus — селектор,
//   с которого показывать страницу, если целиком она стала бы мельче читаемого; title — своё название вкладки.
// Картинки и фоны: src="sher.png" / url(fon.png) с именем из WQ_FILES подменяются рисунком; другое имя — сломанная картинка
// (как в браузере: значок и alt).
// =============================================================================

// Рисунки-файлы для src и url(): простые цветные картинки.
const wqSvg = (bg, em, w = 160, h = 120) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bg}"/><text x="50%" y="56%" font-size="${Math.round(h * 0.55)}" text-anchor="middle" dominant-baseline="middle">${em}</text></svg>`);
const WQ_FILES = {
  'sher.png': wqSvg('#FDE68A', '🦁'), 'mushuk.png': wqSvg('#FBCFE8', '🐱'), 'it.png': wqSvg('#BFDBFE', '🐶'),
  'pingvin.png': wqSvg('#E0F2FE', '🐧'), 'robot.png': wqSvg('#DDD6FE', '🤖'), 'pitsa.png': wqSvg('#FED7AA', '🍕'),
  'tort.png': wqSvg('#FCE7F3', '🎂'), 'top.png': wqSvg('#DCFCE7', '⚽'), 'logo.png': wqSvg('#FFEDD5', '🏕️', 90, 90),
  'fon.png': wqSvg('#A7F3D0', '🌿', 120, 120), 'yulduz.png': wqSvg('#1E1B4B', '⭐', 80, 80), 'tog.png': wqSvg('#BAE6FD', '🏔️', 320, 180)
};
const wqFiles = (s) => s
  .replace(/(src\s*=\s*")([^"]+)(")/g, (m, a, n, b) => (WQ_FILES[n] ? a + WQ_FILES[n] + b : m))
  .replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, n) => (WQ_FILES[n] ? 'url("' + WQ_FILES[n] + '")' : m));

// ── РЕДАКТОР: подсветка как в VS Code (тег — синий, атрибут — голубой, значение — терракота; в CSS — селектор жёлтый) ──
function wqHtmlLine(line, key) {
  const out = []; let i = 0; let n = 0;
  const re = /<!--.*?-->|<\/?[a-zA-Z!][\w-]*|\/?>|___/g;
  let m; let inTag = false;
  const text = (t) => {
    if (!t) return;
    if (!inTag) { out.push(<span key={key + '-' + n++} className="wq-tx">{t}</span>); return; }
    t.split(/(\s+|=|"[^"]*"|'[^']*')/).forEach((p) => {
      if (!p) return;
      const c = /^["']/.test(p) ? 'wq-str' : p === '=' ? 'wq-pn' : /^\s+$/.test(p) ? 'wq-tx' : 'wq-at';
      out.push(<span key={key + '-' + n++} className={c}>{p}</span>);
    });
  };
  while ((m = re.exec(line))) {
    text(line.slice(i, m.index));
    const t = m[0];
    if (t === '___') out.push(<span key={key + '-' + n++} className="wq-slot">?</span>);
    else if (t.startsWith('<!--')) out.push(<span key={key + '-' + n++} className="wq-cm">{t}</span>);
    else if (t === '>' || t === '/>') { out.push(<span key={key + '-' + n++} className="wq-pn">{t}</span>); inTag = false; }
    else { const sl = t[1] === '/' ? 2 : 1; out.push(<span key={key + '-' + n++} className="wq-pn">{t.slice(0, sl)}</span>, <span key={key + '-' + n++} className="wq-tg">{t.slice(sl)}</span>); inTag = true; }
    i = m.index + t.length;
  }
  text(line.slice(i));
  return out;
}
function wqCssLine(line, key) {
  const out = []; let n = 0;
  const push = (c, t) => { if (t) out.push(<span key={key + '-' + n++} className={c}>{t}</span>); };
  const slot = (c, t) => t.split(/(___)/).forEach((p) => (p === '___' ? out.push(<span key={key + '-' + n++} className="wq-slot">?</span>) : push(c, p)));
  if (/^\s*\/\*/.test(line)) { const k = line.search(/\S/); push('wq-tx', line.slice(0, k)); push('wq-cm', line.slice(k)); return out; }
  let rest = line;
  const lead = /^\s*/.exec(rest)[0]; push('wq-tx', lead); rest = rest.slice(lead.length);
  if (/^@/.test(rest)) { const a = /^@[\w-]+/.exec(rest)[0]; push('wq-kw', a); rest = rest.slice(a.length); const b = rest.indexOf('{'); slot('wq-str', b >= 0 ? rest.slice(0, b) : rest); if (b >= 0) push('wq-pn', rest.slice(b)); return out; }
  if (rest.includes('{') || (!rest.includes(':') && !rest.includes('}') && rest.trim())) {
    const b = rest.indexOf('{'); slot('wq-sel', b >= 0 ? rest.slice(0, b) : rest);
    if (b >= 0) { push('wq-pn', '{'); rest = rest.slice(b + 1); } else return out;
  }
  // свойства: prop: value;  (могут быть и в той же строке после «{»)
  const re = /([\w-]+|___)(\s*:\s*)([^;}]*)(;?)|(\})|(\s+)|([^\s])/g; let m;
  while ((m = re.exec(rest))) {
    if (m[1] !== undefined && m[2]) { slot('wq-at', m[1]); push('wq-pn', m[2]); slot(/^-?[\d.]/.test(m[3]) ? 'wq-num' : 'wq-str', m[3]); push('wq-pn', m[4]); }
    else if (m[5]) push('wq-pn', '}');
    else if (m[6]) push('wq-tx', m[6]);
    else slot('wq-tx', m[0]);
  }
  return out;
}
function WqCode({ code, file, mark, fs, cut, innerRef }) {
  const lines = String(code).replace(/^\n+|\s+$/g, '').split('\n');
  const css = /\.css$/.test(file || '');
  let inStyle = false;
  const marks = mark || [];
  return (
    <div className={'wq-ed' + (cut ? ' is-cut' : '')} ref={innerRef} style={Object.assign({}, fs ? { fontSize: fs } : null, cut ? { maxHeight: cut.max } : null)}>
      <div className="wq-ed-tabs"><span className={'wq-ed-tab ' + (css ? 'is-css' : 'is-html')}>{file || 'index.html'}</span></div>
      <div className="wq-ed-body" style={cut && cut.off ? { marginTop: -cut.off } : undefined}>
        {lines.map((ln, i) => {
          let toks;
          if (css || inStyle) toks = /<\/style>/.test(ln) ? wqHtmlLine(ln, i) : wqCssLine(ln, i);
          else toks = wqHtmlLine(ln, i);
          if (!css) { if (/<style[\s>]/.test(ln) && !/<\/style>/.test(ln)) inStyle = true; else if (/<\/style>/.test(ln)) inStyle = false; }
          return <div key={i} className={'wq-ln' + (marks.indexOf(i + 1) >= 0 ? ' is-mark' : '')}><span className="wq-no">{i + 1}</span><span className="wq-code">{toks.length ? toks : ' '}</span></div>;
        })}
      </div>
    </div>
  );
}

// ── СТРАНИЦА: честный браузер ──
function wqDoc(html, css) {
  const body = /<html[\s>]/i.test(html) ? null : html;
  const base = '<style>html{font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff}body{margin:12px}img{max-width:100%}</style>';
  const own = css ? '<style>' + wqFiles(css) + '</style>' : '';
  if (body === null) {
    const full = wqFiles(html);
    return /<head[\s>]/i.test(full) ? full.replace(/<head([^>]*)>/i, '<head$1>' + base).replace(/<\/head>/i, own + '</head>') : full.replace(/<html([^>]*)>/i, '<html$1>' + base + own);
  }
  return '<!doctype html><html><head><meta charset="utf-8">' + base + own + '</head><body>' + wqFiles(body) + '</body></html>';
}
function WqVis({ code, file, mark, html, css, vw: vwOwn, focus, title }) {
  const box = useRef(null);
  const edRef = useRef(null);
  const frame = useRef(null);
  const ifr = useRef(null);
  const tick = useAqFit(box, [code, html, css]);
  const [docH, setDocH] = useState(0);
  const [docTitle, setDocTitle] = useState('');
  const [fit, setFit] = useState(null);
  const hasPage = html != null;
  const hasCode = code != null;
  const srcDoc = hasPage ? wqDoc(html, css) : null;
  const tabTitle = title || docTitle || 'index.html';   // название вкладки — то, что прочитал сам браузер (document.title)
  const measure = () => {
    const f = ifr.current; const d = f && f.contentDocument;
    if (!d || !d.documentElement) return;
    const old = f.style.height; f.style.height = '10px';   // иначе высота документа не меньше высоты окна
    const h = Math.max(120, d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0);   // пустая страница — белое окно, а не полоска
    f.style.height = old;
    if (d.title !== docTitle) setDocTitle(d.title);
    setDocH((p) => (Math.abs(p - h) > 1 ? h : p));
  };
  useEffect(() => { if (!hasPage) return undefined; const t = [setTimeout(measure, 60), setTimeout(measure, 400)]; return () => t.forEach(clearTimeout); }, [srcDoc]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const f = aqFree(box.current);
    if (!f) return;
    const wide = f.width >= 600;
    const both = hasCode && hasPage;
    const row = both && wide;
    const wideDoc = vwOwn > 520;   // широкая страница (vw 800 — «компьютер» в @media): рядом с кодом ей — 60% ширины
    const gap = 12;
    // Код: шрифт уменьшается (не мельче 10 px), пока редактор не влезет в свою долю высоты; не влез и так — редактор
    // показывает часть кода от первой выделенной строки (как окно сайта в тестах «ИИ» — часть от focus).
    // Телефон, код и страница друг под другом: до ответа странице остаётся 90–170 px; после ответа, если обоим тесно,
    // окно страницы прячется, а код берёт всё место.
    const answered = !!(box.current && box.current.closest('.aq-main') && box.current.closest('.aq-main').querySelector('.aq-fb'));
    let fs = null; let codeH = 0; let cut = null; let dropPage = false;
    if (hasCode && edRef.current) {
      const pageMin = Math.max(90, Math.min(170, Math.round(f.free * 0.42)));
      let limit = both && !row ? f.free - pageMin - gap : f.free;
      edRef.current.style.maxHeight = 'none'; const body0 = edRef.current.querySelector('.wq-ed-body'); if (body0) body0.style.marginTop = '0px';
      const base = wide ? 15 : 13;
      edRef.current.style.fontSize = base + 'px';
      const h0 = edRef.current.offsetHeight;
      fs = base;
      if (h0 > limit) fs = Math.max(10, Math.floor(base * (limit - 34) / Math.max(1, h0 - 34) * 10) / 10);
      edRef.current.style.fontSize = fs + 'px';
      while (fs > 10 && edRef.current.offsetHeight > limit - 2) { fs = Math.max(10, Math.round((fs - 0.3) * 10) / 10); edRef.current.style.fontSize = fs + 'px'; }   // точная подгонка
      if (both && !row && answered && edRef.current.offsetHeight > limit) {   // после ответа — код важнее окна
        dropPage = true; limit = f.free;
        fs = base; edRef.current.style.fontSize = fs + 'px';
        while (fs > 10 && edRef.current.offsetHeight > limit - 2) { fs = Math.max(10, Math.round((fs - 0.3) * 10) / 10); edRef.current.style.fontSize = fs + 'px'; }
      }
      codeH = edRef.current.offsetHeight;
      if (codeH > limit) {
        const max = Math.max(60, limit - 2);
        const ln = edRef.current.querySelector('.wq-ln.is-mark') || null;
        const body = edRef.current.querySelector('.wq-ed-body');
        const head = body ? body.offsetTop : 0;
        const lineH = ln ? ln.offsetHeight : 16;
        let off = 0;
        if (ln && body) off = Math.max(0, Math.min(body.offsetHeight - (max - head), ln.offsetTop - body.offsetTop - lineH));
        cut = { max, off: Math.round(off) };
        codeH = max;
      }
      // те же стили — сразу в DOM: если расчёт не изменился, React не перерисует, а сброс выше уже стёр их
      edRef.current.style.maxHeight = cut ? cut.max + 'px' : '';
      if (body0) body0.style.marginTop = cut && cut.off ? -cut.off + 'px' : '';
    }
    let pg = null;
    if (hasPage && frame.current && docH) {
      const vw = vwOwn || (row ? 420 : wide ? 560 : 360);   // текст страницы — почти в натуральную величину
      const maxW = row ? Math.floor((f.width - gap) * (wideDoc ? 0.6 : 0.5)) : Math.min(f.width, wide ? 640 : 480);
      // высота полос Chrome — по самим полосам: у спрятанного окна высота 0, и разность ушла бы в минус (окно мигало бы)
      const chrome = Array.prototype.reduce.call(frame.current.querySelectorAll('.aq-br-bar, .aq-br-tool'), (n, el) => n + el.offsetHeight, 0);
      const freeH = (both && !row ? f.free - codeH - gap : f.free) - chrome;
      const kW = maxW / vw; const kH = freeH / docH;
      const kMin = Math.min(kW, wide ? 0.5 : 0.55);
      const k = Math.max(Math.min(kW, kH), kMin);
      const fullH = Math.round(docH * k);
      const viewH = Math.max(0, Math.min(fullH, freeH));
      let off = 0;
      if (viewH < fullH && focus && ifr.current && ifr.current.contentDocument) {
        const el = ifr.current.contentDocument.querySelector(focus);
        if (el) off = Math.min(fullH - viewH, Math.max(0, Math.round((el.getBoundingClientRect().top - 8) * k)));
      }
      pg = { vw, k, viewH, off, hide: dropPage || viewH < 70 };   // места на окно нет (телефон после ответа) — окно прячется, как в тестах «ИИ»
    }
    const next = { row, wideDoc: row && wideDoc, fs, cut, pg };
    setFit((p) => (JSON.stringify(p) === JSON.stringify(next) ? p : next));
  }, [tick, docH, code, html, css]); // eslint-disable-line react-hooks/exhaustive-deps
  const pg = fit && fit.pg;
  const vw = pg ? pg.vw : (vwOwn || 360);
  useEffect(() => { if (hasPage) measure(); }, [vw]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={box} className={'wq-vis' + (fit && fit.row ? ' is-row' : '') + (fit && fit.wideDoc ? ' is-wide-doc' : '') + (hasCode && hasPage ? ' is-both' : '')}>
      {hasCode ? <WqCode code={code} file={file} mark={mark} fs={fit && fit.fs} cut={fit && fit.cut} innerRef={edRef} /> : null}
      {hasPage ? (
        <AqBrowser title={tabTitle} innerRef={frame} style={pg ? (pg.hide ? { width: Math.round(vw * pg.k), visibility: 'hidden', height: 0, position: 'absolute' } : { width: Math.round(vw * pg.k) }) : { visibility: 'hidden', width: 240 }}>
          <div className="wq-page" style={{ height: pg ? pg.viewH : 1 }}>
            <iframe ref={ifr} title={tabTitle} srcDoc={srcDoc} sandbox="allow-same-origin" scrolling="no" tabIndex={-1} onLoad={measure}
              style={{ width: vw, height: docH || 10, transform: 'translateY(' + -(pg ? pg.off : 0) + 'px) scale(' + (pg ? pg.k : 1) + ')' }} />
          </div>
        </AqBrowser>
      ) : null}
    </div>
  );
}

const WQ_CSS = `
.wq-vis { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; min-height: 0; }
.wq-vis.is-row { flex-direction: row; align-items: flex-start; justify-content: center; }
.wq-vis.is-row > .wq-ed { flex: 1 1 50%; min-width: 0; }
.wq-vis.is-row.is-wide-doc > .wq-ed { flex-basis: 38%; }
.wq-ed { flex: none; align-self: stretch; overflow: hidden; border-radius: 12px; background: #1E1E1E; box-shadow: 0 10px 26px rgba(15, 23, 42, .14); font: 600 13px/1.45 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: #D4D4D4; text-align: left; }
.wq-vis.is-row > .wq-ed { align-self: flex-start; }
.wq-ed-tabs { display: flex; background: #252526; }
.wq-ed-tab { display: flex; align-items: center; gap: 7px; padding: 6px 14px; background: #1E1E1E; border-top: 2px solid #FA4F28; color: #fff; font-family: Inter, system-ui, sans-serif; font-size: 12px; font-weight: 500; }
.wq-ed-tab::before { content: '<>'; color: #E44D26; font: 700 11px/1 'JetBrains Mono', monospace; }
.wq-ed-tab.is-css::before { content: '#'; color: #42A5F5; }
.wq-ed-body { padding: 8px 0 10px; }
.wq-ed.is-cut { position: relative; }
.wq-ed.is-cut::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 18px; background: linear-gradient(rgba(30, 30, 30, 0), #1E1E1E); }
@media (max-width: 719px) { .wq-ed { line-height: 1.36; } .wq-ed-tab { padding: 4px 12px; font-size: 11.5px; } .wq-ed-body { padding: 5px 0 7px; } }
.wq-ln { display: flex; padding: 0 12px 0 0; white-space: pre; }
.wq-ln.is-mark { background: rgba(250, 79, 40, .16); box-shadow: inset 3px 0 0 #FA4F28; }
.wq-no { flex: 0 0 2.6em; padding-right: 1em; text-align: right; color: #6E7681; user-select: none; }
.wq-code { min-width: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.wq-tg { color: #569CD6; } .wq-at { color: #9CDCFE; } .wq-str { color: #CE9178; } .wq-num { color: #B5CEA8; }
.wq-pn { color: #808080; } .wq-tx { color: #D4D4D4; } .wq-cm { color: #6A9955; } .wq-sel { color: #D7BA7D; } .wq-kw { color: #C586C0; }
.wq-slot { display: inline-block; min-width: 2.2em; margin: 0 2px; padding: 0 6px; border: 1.5px dashed #FA4F28; border-radius: 5px; color: #FDBA74; text-align: center; line-height: 1.25; }
.wq-page { overflow: hidden; background: #fff; }
.wq-page iframe { display: block; border: 0; transform-origin: 0 0; background: #fff; pointer-events: none; }
.wq-vis .aq-br { flex: none; }
`;
