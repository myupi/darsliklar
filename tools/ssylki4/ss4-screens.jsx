// =============================================================================
// ЧАСТИ УРОКА 4 — сайт класса в бумажном браузере, честные ссылки, код с атрибутом
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// Озвучка урока поверх озвучки бумажного набора. Файл cats.html — «cats точка
// HTML»; знаки «=» и кавычки в речь не идут (рядом всегда слова «знак равно»,
// «кавычки»); голые a и href — словами (TAG_SAY). В английском «a» — артикль,
// поэтому там тег a узнаётся только в «the a», «opening a», «letter a».
const DOT_SAY = { uz: 'nuqta', ru: 'точка', en: 'dot' };
const spokenKit4 = spokenHtml;
// eslint-disable-next-line no-func-assign
spokenHtml = (text, lang) => {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  let s = String(text || '').replace(/[«“"]\s*=\s*[»”"]/g, ' ').replace(/"/g, ' ');
  s = s.replace(/\b([a-z]+)\.html\b/g, (all, n) => n + ' ' + (DOT_SAY[lang] || DOT_SAY.ru) + ' html');
  let out = spokenKit4(s, lang).replace(/(^|[^A-Za-z‘’'ʻʼ])href(?=[^A-Za-z‘’'ʻʼ]|$)/g, (all, pre) => pre + m.href);
  if (lang === 'en') out = out.replace(/\b(the|The|letter|opening|closing) a\b/g, '$1 ' + m.a);
  else out = out.replace(/(^|[^A-Za-z‘’'ʻʼ-])a(?=[^A-Za-z‘’'ʻʼ-]|$)/g, (all, pre) => pre + m.a);
  return out;
};

// Страница всегда помещается в окно целиком, без прокрутки (правило эталона):
// не влезает — шрифт страницы ступеньками уменьшается (не меньше 56 %).
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
    const t = setTimeout(fit, 700);
    if (typeof ResizeObserver === 'undefined') return () => clearTimeout(t);
    const ro = new ResizeObserver(() => fit());
    ro.observe(page);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// САЙТ: файл → страница (тексты — PAGES), картинка, ссылка «наверх».
// ─────────────────────────────────────────────────────────────────────────────
const SITE = {
  'index.html': { pg: 'index', pic: 'home' },
  'cats.html': { pg: 'cats', pic: 'cat', up: 'index.html' },
  'dogs.html': { pg: 'dogs', pic: 'dog', up: 'index.html' },
  'games.html': { pg: 'games', pic: 'games', up: 'index.html' },
  'cartoons.html': { pg: 'cartoons', pic: 'tv', up: 'index.html' },
  'club.html': { pg: 'club', pic: 'cup' },
  'football.html': { pg: 'football', pic: 'ball', up: 'club.html' },
  'chess.html': { pg: 'chess', pic: 'chess', up: 'club.html' }
};
const pageL = (url) => (SITE[url] ? PAGES[SITE[url].pg].title : null);
const pageTitle = (url, pick) => (SITE[url] ? pick(PAGES[SITE[url].pg].title) : url);
const pageH1 = (url, pick) => { const P = PAGES[SITE[url].pg]; return pick(P.h1 || P.title); };
function siteBlocks(url, pick) {
  const s = SITE[url];
  if (!s) return [{ t: 'nf', url, k: 'nf' }];
  const P = PAGES[s.pg];
  const out = [{ t: 'h1', s: pick(P.h1 || P.title), k: 'h' }, { t: 'pic', pic: s.pic, k: 'pic' }, { t: 'p', s: pick(P.text), k: 'p' }];
  if (s.up) out.push({ t: 'row', k: 'up', items: [{ s: pick(s.up === 'index.html' ? UI.home : PAGES.club.title), href: s.up, k: 'u' }] });
  return out;
}

// Бумажная картинка страницы (кот, собака, игры, телевизор…) — из простых вырезок.
function PagePic({ pic }) {
  return <span className={'l4-pic l4-pic-' + pic} aria-hidden="true"><i /><i /><i /></span>;
}

// СТРАНИЦА В БУМАЖНОМ БРАУЗЕРЕ — как её рисует настоящий браузер:
//   { t: 'h1' | 'p', s, k, hl, href, cls } — заголовок, абзац; href (строка) —
//       блок внутри незакрытой ссылки: весь синий и нажимается;
//   { t: 'row', k, items: [{ s, href, hl, k, cls }] } — ссылки и текст подряд:
//       стоят в одной строке через пробел (a — строчный тег); href — ссылка,
//       без href — обычный текст;
//   { t: 'pic', pic } — картинка страницы; { t: 'nf', url } — «Файл не найден».
function LinkDoc({ blocks, onGo, anim }) {
  const ref = useFitPage(JSON.stringify(blocks));
  const pick = usePick();
  const A = (it, key) => {
    const c = 'l4-a' + (it.hl ? ' is-hl' : '') + (it.cls ? ' ' + it.cls : '');
    if (!onGo) return <span key={key} className={c} data-k={it.k}>{it.s}</span>;
    return <button key={key} type="button" className={c} data-k={it.k} onClick={() => onGo(it.href)}>{it.s}</button>;
  };
  const inl = (it, j) => (typeof it.href === 'string' ? A(it, it.k || j)
    : <span key={it.k || j} className={'l4-t' + (it.hl ? ' is-hl' : '') + (it.cls ? ' ' + it.cls : '')} data-k={it.k}>{it.s}</span>);
  return (
    <div ref={ref} className="l4-doc">
      {blocks.map((bk, i) => {
        const k = bk.k || i;
        const ac = anim ? ' kz-a-drop' : '';
        const st = anim ? { '--dl': (0.08 * i) + 's' } : null;
        if (bk.t === 'pic') return <PagePic key={k} pic={bk.pic} />;
        if (bk.t === 'nf') return <div key={k} className="l4-nf"><PagePic pic="none" /><b>{pick(UI.notFound)}</b><span translate="no">{bk.url}</span></div>;
        if (bk.t === 'row') {
          const items = bk.items.filter((it) => it && it.s);
          if (!items.length) return null;
          return <div key={k} className={'l4-row' + ac} style={st}>{items.map((it, j) => [j ? ' ' : null, inl(it, j)])}</div>;
        }
        const c = 'l4-blk l4-' + bk.t + (bk.hl ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '') + ac;
        return <div key={k} className={c} style={st}>{typeof bk.href === 'string' ? A({ s: bk.s, href: bk.href, k: bk.k }, 'a') : bk.s}</div>;
      })}
    </div>
  );
}

// ПЕРЕХОДЫ ПО САЙТУ: история адресов; ссылка открывает файл из href.
function useNav(home = 'index.html') {
  const [hist, setHist] = useState([home]);
  const [stamp, setStamp] = useState(0);
  const url = hist[hist.length - 1];
  const go = useCallback((href) => {
    setHist((h) => { const cur = h[h.length - 1]; const u = String(href == null ? '' : href).trim() || cur; return h.concat(u); });
    setStamp((x) => x + 1); sfx('pop', true);
  }, []);
  const back = hist.length > 1 ? () => { setHist((h) => h.slice(0, -1)); setStamp((x) => x + 1); sfx('tap', true); } : null;
  // Домой со сменой страницы (показ) и тихий сброс (код поменялся — страница перезагружена).
  const toHome = useCallback(() => { setHist([home]); setStamp((x) => x + 1); }, [home]);
  const reset = useCallback(() => { setHist((h) => (h.length > 1 ? [home] : h)); }, [home]);
  return { url, go, back, toHome, reset, stamp, home };
}

// Бумажный браузер сайта: на «своей» странице — содержимое экрана (из кода),
// на остальных — страницы сайта; адрес и вкладка меняются вместе со страницей.
function LinkBrowser({ nav, homeTitle, children, cls, short, pageHl, urlHl, brRef }) {
  const pick = usePick();
  const at = nav.url;
  const atHome = at === nav.home;
  const title = atHome && homeTitle ? homeTitle : pageTitle(at, pick);
  return (
    <div className="l4-brwrap" ref={brRef}>
      <PaperBrowser title={title} url={at} urlHl={urlHl} stamp={nav.stamp} short={short} cls={'l4-br' + (cls ? ' ' + cls : '')} pageHl={pageHl} onBack={nav.back || undefined}>
        <div key={at + ':' + nav.stamp} className={'l4-pagein' + (nav.stamp ? ' kz-a-drop' : '')}>
          {atHome ? children : <LinkDoc blocks={siteBlocks(at, pick)} onGo={nav.go} />}
        </div>
      </PaperBrowser>
    </div>
  );
}

// Карточка страницы на карте сайта: картинка, название, файл.
function SiteCard({ url, onClick, hl, state, disabled, led, i = 0, noTitle }) {
  const pick = usePick();
  const s = SITE[url];
  const inner = (
    <>
      <Cut c="var(--kz-piece)" seed={300 + i * 7} n={8} amp={3} asp={0.85} cls="l4-card-cut" r={i % 2 ? 1.2 : -1.2} />
      <span className="l4-card-in">
        <PagePic pic={s.pic} />
        {noTitle ? null : <b>{pick(PAGES[s.pg].title)}</b>}
        <code translate="no">{url}</code>
      </span>
      <Led on={!!led} />
    </>
  );
  const c = 'l4-card' + (hl ? ' is-hl' : '') + (state ? ' is-' + state : '');
  if (onClick) return <button type="button" className={c} onClick={onClick} disabled={disabled} data-url={url}>{inner}</button>;
  return <div className={c} data-url={url}>{inner}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// КОД: открывающий тег a с атрибутом, атрибут href="…", части тега для полей.
// ─────────────────────────────────────────────────────────────────────────────
function TagA({ attr, cls }) {
  return (
    <span className={'kz-tag l4-taga' + (cls ? ' ' + cls : '')} translate="no">
      <span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span>{attr ? ' ' : null}{attr || null}<span className="kz-tk-b">{'>'}</span>
    </span>
  );
}
const Attr = ({ v, n = 'href', cls }) => (
  <span className={'l4-attr' + (cls ? ' ' + cls : '')}><span className="l4-an">{n}</span><span className="l4-eq">=</span><span className="l4-av">{'"' + v + '"'}</span></span>
);
const linkParts = (v, s, attrCls) => [<TagA key="o" attr={v != null ? <Attr v={v} cls={attrCls} /> : null} />, W_(s), T_('a', true)];
// Куски тегов вокруг поля или места: «<a », «>», «</a», «>».
// После «<a» — неразрывный пробел внутри тега: обычный в строке-флексе схлопывается («<ahref»).
const OpenA = ({ sp }) => <span key="oa" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">a</span>{sp ? '\u00A0' : null}</span>;
const Gt = ({ k }) => <span key={k || 'gt'} className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>;
const CloseA = () => <span key="ca" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-b">/</span><span className="kz-tk-n">a</span></span>;
const stickerText = (st) => (st.n ? st.n + '="' + st.v + '"' : '"' + st.v + '"');

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР НАБРАННОГО — как его читает браузер.
// ─────────────────────────────────────────────────────────────────────────────
// Атрибуты внутри открывающего тега: имя → значение (без значения — пустая строка).
function attrsOf(src) {
  const out = {};
  const re = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(String(src || '')))) {
    const n = m[1].toLowerCase();
    if (!(n in out)) out[n] = m[2] != null ? m[2] : m[3] != null ? m[3] : m[4] != null ? m[4] : '';
  }
  return out;
}
// href набранного атрибута для живой страницы: строка — ссылка; undefined — нет
// href (обычный текст); null — незакрытые кавычки «съели» тег и всё после него.
function liveHref(src) {
  const s = String(src || '');
  if ((s.match(/"/g) || []).length % 2 || (s.match(/'/g) || []).length % 2) return null;
  const a = attrsOf(s);
  return 'href' in a ? a.href.trim() : undefined;
}
// Что не так с набранным атрибутом href="want". null — всё верно.
function attrIssue(val, want, msgs) {
  const s = String(val || '').trim();
  if (!s) return msgs.needName;
  const m = /^([^=\s"']*)\s*(=?)\s*([\s\S]*)$/.exec(s);
  const name = m[1].toLowerCase(), eq = m[2], rest = m[3].trim();
  if (!name) return msgs.needName;
  if (name !== 'href') return msgs.wrongName;
  if (!eq) return msgs.needEq;
  const isQ = (ch) => ch === '"' || ch === "'";
  const q = rest.charAt(0), z = rest.charAt(rest.length - 1);
  if (!isQ(q) && !isQ(z)) return rest === want ? msgs.needQuotes : msgs.wrongVal;
  if (!isQ(q) || !isQ(z) || rest.length < 2 || q !== z) return msgs.needQuote2;
  if (rest.slice(1, -1).trim() !== want) return msgs.wrongVal;
  return null;
}
// Ссылка, набранная целиком (s13): что не так; при успехе — { text }.
function scanOpenA(s) {
  const mo = /^<\s*a(?=[\s>]|$)/i.exec(s);
  if (!mo) return null;
  let q = null;
  for (let i = mo[0].length; i < s.length; i += 1) {
    const ch = s.charAt(i);
    if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if (ch === '>') return { attr: s.slice(mo[0].length, i), end: i };
  }
  return { attr: s.slice(mo[0].length), end: -1 };
}
function linkIssue(val, want, msgs) {
  const s = String(val || '').trim();
  if (/^<\s*ahref/i.test(s)) return { msg: msgs.needSpace };
  const op = scanOpenA(s);
  if (!op) return { msg: msgs.needOpen };
  const a = op.attr.trim();
  const ai = attrIssue(a.replace(/>$/, ''), want, msgs);
  if (ai) return { msg: ai };
  if (op.end < 0) return { msg: msgs.needGt };
  const rest = s.slice(op.end + 1);
  const cl = /<\s*\/\s*a\s*>/i.exec(rest);
  const text = (cl ? rest.slice(0, cl.index) : rest).trim();
  if (!cl) return { msg: hasLetters(text.split('<')[0]) ? msgs.needClose : msgs.needText };
  if (!okText(text)) return { msg: msgs.needText };
  return { msg: null, text };
}
// Живая страница набранной строки: текст до ссылки, ссылка (до </a> или до
// конца), текст после. Недописанный тег (нет «>») браузер не показывает.
const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/<[^>]*$/, '');
function typedItems(val) {
  const s = String(val || '');
  const at = s.search(/<\s*a(?=[\s>]|$)/i);
  if (at < 0) return [{ s: stripTags(s), k: 'x0' }];
  const before = stripTags(s.slice(0, at));
  const op = scanOpenA(s.slice(at));
  if (!op || op.end < 0) return [{ s: before, k: 'x0' }];
  const href = liveHref(op.attr);
  const rest = s.slice(at + op.end + 1);
  const cl = /<\s*\/\s*a\s*>/i.exec(rest);
  const inner = stripTags(cl ? rest.slice(0, cl.index) : rest);
  const after = cl ? stripTags(rest.slice(cl.index + cl[0].length)) : '';
  return [{ s: before, k: 'x0' }, { s: inner, href: typeof href === 'string' ? href : undefined, k: 'mine' }, { s: after, k: 'x2' }];
}

// =============================================================================
// S1. КРЮЧОК — сайт класса: на главной синие слова «Про котов». Нажал — страница
// сменилась сама (разбор и сборка), адрес наверху стал cats.html. Потом можно
// гулять: «На главную» и снова к котам.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const doneRef = useRef(solved);
  const nav = useNav();
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !solved, 0);
  const go = (href) => {
    if (!canTap) return;
    nav.go(href);
    if (doneRef.current) return;
    doneRef.current = true; put({ done: true });
    sayNow(c.magic, 'wonder'); say(c.done, 'smile');
  };
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'pic', pic: 'home', k: 'pic' }, { t: 'p', s: pick(PAGES.index.text), k: 'p' },
    { t: 'row', k: 'r', items: [{ s: pageTitle('cats.html', pick), href: 'cats.html', k: 'cats', cls: led ? 'is-led' : '' }] }];
  const askText = solved ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l4-s1">
          <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} urlHl={speaker.text === c.magic}>
            <LinkDoc blocks={blocks} onGo={canTap ? (nav.url === 'index.html' ? go : nav.go) : null} />
          </LinkBrowser>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S2. ПЛАН — четыре карточки открываются сами, пока Коди о них говорит.
// =============================================================================
const CARD_C = [KZ.teal, KZ.mustard, KZ.coral, 'var(--kz-piece)'];
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }].concat(c.cards.map((k) => ({ text: k.say, pose: 'point' })), [{ text: c.done, pose: 'smile' }]));
  const [open, setOpen] = useState(solved ? 4 : 0);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const reach = (n) => { if (n <= open) return; setOpen(n); sfx('pop', true); if (n === 4) put({ done: true }); };
  useEffect(() => {
    const i = c.cards.findIndex((k) => k.say === speaker.text);
    reach(i >= 0 ? i + 1 : speaker.text === c.done ? 4 : 0);
  }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (spoken) reach(4); }, [spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const again = (i) => { if (canTap && i < open) sayNow(c.cards[i].say, 'point'); };
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={c.ask} n={open + '/4'} />
        <div className="kz-plan">
          {c.cards.map((card, i) => {
            const on = i < open;
            const now = on && speaker.text === card.say;
            return (
              <button key={i} type="button" className={'kz-card' + (on ? ' is-open' : '')} disabled={!on || !canTap} onClick={() => again(i)}
                aria-label={on ? pick(card.title) : String(i + 1)} style={{ '--dl': (i * 0.12) + 's' }}>
                <Cut c={on ? CARD_C[i] : 'var(--kz-piece)'} seed={90 + i} n={9} amp={3} asp={1.6} cls="kz-card-cut kz-a-drop" r={i % 2 ? 1.2 : -1.4} dl={i * 0.12} hl={now} hlc={KZ.ink}>
                  <span className="kz-card-face" key={on ? 'o' : 'c'}>
                    {on ? <span className="kz-a-stamp">{pick(card.title)}</span> : <span className="kz-card-n">{i + 1}</span>}
                  </span>
                </Cut>
              </button>
            );
          })}
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S3. ТЕГ a — ССЫЛКА. Показ: в коде главной загорается тег a (открывающий и
// закрывающий), потом слова между ними (и ссылка на странице), потом адрес —
// «о нём позже». В конце ссылка на странице загорается и сама открывает
// страницу про котов: адрес наверху меняется.
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const nav = useNav();
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const brRef = useRef(null);
  const q = (r, sel) => () => r.current && r.current.querySelector(sel);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q(codeRef, '.l4-line-a .l4-taga') },
    { say: [{ text: c.sayA, pose: 'point' }] },
    { look: q(codeRef, '.l4-line-a .kz-txt') },
    { say: [{ text: c.sayText, pose: 'point' }] },
    { look: q(codeRef, '.l4-line-a .l4-attr') },
    { say: [{ text: c.sayAttr, pose: 'explain' }] },
    { look: q(brRef, '.l4-a'), act: () => nav.go('cats.html') },
    { wait: reduceMotion() ? 200 : 900 },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const hl = speaker.text === c.sayA ? 'a' : speaker.text === c.sayText ? 'text' : speaker.text === c.sayAttr ? 'attr' : null;
  const cats = pageTitle('cats.html', pick);
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'row', k: 'r', items: [{ s: cats, href: 'cats.html', k: 'cats', hl: hl === 'text' }] }];
  const askText = explore ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l4-duo">
          <div className="kz-col" ref={codeRef}>
            <KzCode lines={[
              { k: 'h', d: 0, cls: 'l4-ctx', parts: [T_('h1'), W_(pageH1('index.html', pick)), T_('h1', true)] },
              { k: 'a', d: 0, cls: 'l4-line-a' + (hl ? ' l4-hl-' + hl : ''), parts: linkParts('cats.html', cats, 'l4-later') }
            ]} />
          </div>
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short brRef={brRef} urlHl={nav.url !== 'index.html' && speaker.text === c.done}>
              <LinkDoc blocks={blocks} onGo={explore ? nav.go : null} />
            </LinkBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S4. ЗАКРОЙ ССЫЛКУ — нет </a>: новость ниже честно стала частью ссылки (синяя,
// нажимается и ведёт к собакам). Ученик набирает </a>; окно меняется сразу.
// =============================================================================
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 12 });
  const nav = useNav();
  useEffect(() => { nav.reset(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
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
      log({ screenId: 's4', type: 'write-closing-a', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const dogs = pageTitle('dogs.html', pick), news = pick(NEWS[0]);
  const closed = okNow || normT(ty.val) === '</a>';
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'row', k: 'r', items: [{ s: dogs, href: 'dogs.html', k: 'd' }] },
    closed ? { t: 'p', s: news, k: 'n', cls: okNow ? 'kz-a-stamp' : '' } : { t: 'p', s: news, href: 'dogs.html', k: 'n', hl: true }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short cls={okNow ? '' : 'l4-broken'} pageHl={!okNow}>
              <LinkDoc blocks={blocks} onGo={canTap ? nav.go : null} />
            </LinkBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: 'l4-ctx', parts: [T_('h1'), W_(pageH1('index.html', pick)), T_('h1', true)] },
              { k: 'a', d: 0, cls: okNow ? '' : 'is-hl', parts: [<TagA key="o" attr={<Attr v="dogs.html" />} />, W_(dogs), okNow ? <span key="c" className="kz-a-stamp">{T_('a', true)}</span> : (
                <span key="g" className={'kz-gap' + (led || speaker.text === c.say ? ' kz-gap-led' : '') + (ty.val ? '' : ' l4-q')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={12} cls="kz-tag-in" />
                </span>)] },
              { k: 'p', d: 0, parts: [T_('p'), W_(news), T_('p', true)] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', '/', 'a', '>']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S5. ССЫЛКА ИЛИ ТЕКСТ? — строка кода; ученик решает, что покажет браузер, и
// окно показывает правду. Ловушки: жирный b, заголовок h1 — не ссылки.
// Промах — в конце ещё раунд того же типа.
// =============================================================================
const S5_ROUNDS = [
  { tag: 'a', href: 'games.html', s: PAGES.games.title, type: 'a' },
  { tag: 'b', s: PAGES.cartoons.title, type: 'fmt' },
  { tag: 'h1', s: PAGES.cats.title, type: 'blk' }
];
const S5_EXTRA = [
  { tag: 'a', href: 'cats.html', s: C.s11.texts.meow, type: 'a' },
  { tag: 'i', s: PAGES.games.title, type: 'fmt' },
  { tag: 'p', s: PAGES.dogs.title, type: 'blk' }
];
function s5Blocks(R, s) {
  if (R.tag === 'a') return [{ t: 'row', k: 'r', items: [{ s, href: R.href, k: 'a' }] }];
  if (R.tag === 'b' || R.tag === 'i') return [{ t: 'row', k: 'r', items: [{ s, k: 't', cls: 'l4-' + R.tag }] }];
  return [{ t: R.tag, s, k: 'b' }];
}
function S5({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (ans ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S5_EXTRA : S5_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const isLink = R && R.tag === 'a';
  const answer = (k) => {
    if (!canTap || !round || ans) return;
    const right = (k === 'link') === isLink;
    setAns(k);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.push({ i: round.i, extra: true });
    const line = right ? (isLink ? c.okLink : c.okText) : c.miss[R.type];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's5.r' + (ii + 1), type: 'predict-link', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setAns(null); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const s = R ? pick(R.s) : '';
  const right = ans ? (isLink ? 'link' : 'text') : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            {R ? (
              <div className="kz-slip-wrap" key={'s' + doneN}>
                <KzCode lines={[{ k: 'r', d: 0, cls: 'kz-a-drop kz-slip', parts: R.tag === 'a' ? linkParts(R.href, s) : [T_(R.tag), W_(s), T_(R.tag, true)] }]} />
              </div>
            ) : null}
            <PaperBrowser title={pageTitle('index.html', pick)} short cls="l4-br" pageHl={!!ans}>
              {ans && R ? <LinkDoc key={'d' + doneN} blocks={s5Blocks(R, s)} anim /> : <div className="l4-qmark" aria-hidden="true">?</div>}
            </PaperBrowser>
          </div>
        </div>
        {round ? (
          <div className="kz-pick">
            {['link', 'text'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn ' + (ans === k ? (k === right ? 'is-ok' : 'is-off') : ans && k === right ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}>
                {k === 'link' ? <span className="l4-a l4-a-btn">{pick(UI.link)}</span> : pick(UI.plain)}<Led on={led && !ans} />
              </button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S6. АТРИБУТ — в коде <a>Про котов</a>: на странице слова чёрные, не нажимаются.
// Показ (как в ролике): в открывающий тег вклеивается жёлтая наклейка «атрибут»
// (рядом — записка «дополнительная информация о теге»); наклейка превращается в
// схему «имя = "значение"» — части загораются по очереди; потом схема становится
// href="cats.html", слова синеют, ссылка сама открывает страницу про котов.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [stage, setStage] = useState(solved ? 3 : 0);
  const nav = useNav();
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const brRef = useRef(null);
  const q = (r, sel) => () => r.current && r.current.querySelector(sel);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q(codeRef, '.l4-taga'), act: () => { sfx('pop', true); setStage(1); } },
    { say: [{ text: c.sayAttr, pose: 'explain' }] },
    { act: () => { sfx('pop', true); setStage(2); } },
    { look: q(codeRef, '.l4-an') }, { look: q(codeRef, '.l4-eq') }, { look: q(codeRef, '.l4-av') },
    { say: [{ text: c.sayForm, pose: 'point' }] },
    { look: q(codeRef, '.l4-attr'), act: () => { sfx('win', true); setStage(3); } },
    { say: [{ text: c.sayHref, pose: 'point' }] },
    { look: q(brRef, '.l4-a'), act: () => nav.go('cats.html') },
    { wait: reduceMotion() ? 200 : 900 },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const cats = pageTitle('cats.html', pick);
  const attr = stage === 1 ? <span className="l4-note kz-a-stamp">{pick(UI.attrWord)}</span>
    : stage === 2 ? <span className="l4-attr l4-attr-tpl kz-a-stamp"><span className="l4-an">{pick(UI.name)}</span><span className="l4-eq">=</span><span className="l4-av">{'"' + pick(UI.value) + '"'}</span></span>
      : stage === 3 ? <Attr v="cats.html" cls={(solved ? '' : 'kz-a-stamp') + (speaker.text === c.sayHref ? ' is-hl' : '')} /> : null;
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' },
    { t: 'row', k: 'r', items: [stage === 3 ? { s: cats, href: 'cats.html', k: 'cats', cls: solved ? '' : 'kz-a-stamp' } : { s: cats, k: 'cats', hl: speaker.text === c.say }] }];
  const askText = explore ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l4-duo">
          <div className="kz-col l4-bench" ref={codeRef}>
            <KzCode lines={[{ k: 'a', d: 0, cls: 'l4-line-big' + (speaker.text === c.sayAttr || speaker.text === c.sayForm ? ' is-hl' : ''), parts: [<TagA key="o" attr={attr} />, W_(cats), T_('a', true)] }]} />
            {stage >= 1 ? (
              <div className={'l4-memo' + (solved ? '' : ' kz-a-drop') + (speaker.text === c.sayAttr ? ' is-hl' : '')}>
                <b>{pick(UI.attrWord)}</b><span>{pick(c.note)}</span>
              </div>
            ) : null}
          </div>
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short brRef={brRef} urlHl={nav.url !== 'index.html' && speaker.text === c.done}>
              <LinkDoc blocks={blocks} onGo={explore ? nav.go : null} />
            </LinkBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S7. ВПИШИ АДРЕС — <a ▢>Про собак</a>: ученик набирает href="dogs.html".
// Окно честно меняется по ходу набора: есть href — слова синеют (без кавычек
// браузер тоже понимает — проверка просит кавычки как правило записи);
// незакрытая кавычка «съедает» тег — ссылки на странице нет.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 26 });
  const nav = useNav();
  useEffect(() => { nav.reset(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const issue = attrIssue(ty.val, 'dogs.html', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's7', type: 'write-href', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const dogs = pageTitle('dogs.html', pick);
  const href = okNow ? 'dogs.html' : liveHref(ty.val);
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' },
    { t: 'row', k: 'r', items: href === null ? [] : [{ s: dogs, href: typeof href === 'string' ? href : undefined, k: 'd', cls: okNow ? 'kz-a-stamp is-led' : '' }] }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short pageHl={!okNow}>
              <LinkDoc blocks={blocks} onGo={canTap ? nav.go : null} />
            </LinkBrowser>
            <KzCode lines={[
              { k: 'h', d: 0, cls: 'l4-ctx', parts: [T_('h1'), W_(pageH1('index.html', pick)), T_('h1', true)] },
              { k: 'a', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? linkParts('dogs.html', dogs, 'kz-a-stamp') : [
                <OpenA key="oa" sp />,
                <span key="g" className={'kz-gap' + (led || speaker.text === c.say ? ' kz-gap-led' : '') + (ty.val ? '' : ' l4-q')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={26} cls="kz-tag-in" />
                </span>,
                <Gt key="gt" />, W_(dogs), T_('a', true)] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['href', '=', '"', 'dogs.html']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length >= 10} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S8. ГДЕ АТРИБУТ? — наклейка href="games.html" и три места: в открывающем теге
// (верно), между «>» и словами, в закрывающем теге. Не туда — браузер честно на
// миг показывает, что вышло (атрибут виден как текст / ссылки нет), Коди
// называет причину, наклейка возвращается. Промах — ещё одна ссылка в конце.
// =============================================================================
const S8_ROUNDS = [{ href: 'games.html', s: PAGES.games.title }, { href: 'cartoons.html', s: PAGES.cartoons.title }];
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(solved ? [] : [0]);
  const [doneN, setDoneN] = useState(0);
  const [fixed, setFixed] = useState(solved);
  const [sel, setSel] = useState(false);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(false);
  const [peek, setPeek] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const lad = useKzLadder(!!queue.length && !fixed);
  const st = useRef({ tries: 0, misses: 0, missed: false });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const led = useIdleLed(canTap && !!queue.length && !fixed, doneN * 10 + (sel ? 1 : 0));
  const lastIdx = useRef(0);
  if (queue.length) lastIdx.current = queue[0];
  const R = S8_ROUNDS[lastIdx.current];
  const stk = { n: 'href', v: R.href };
  const place = (spot) => {
    if (!canTap || !queue.length || fixed || !spot) return false;
    st.current.tries += 1;
    if (spot !== 'A') {
      st.current.misses += 1; st.current.missed = true;
      sfx('soft', true); setShake(true); setTimeout(() => setShake(false), 520);
      clearTimeout(peekT.current); setPeek(spot); peekT.current = setTimeout(() => setPeek(null), 1900);
      const m = spot === 'B' ? c.why.text : c.why.close;
      setMsg(m); setSel(false); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('win', true); setFixed(true); setSel(false); setMsg(null); setPeek(null);
    const rest = queue.slice(1);
    if (st.current.missed && queue[0] === 0) rest.push(1);
    if (!rest.length) {
      put({ done: true }); setQueue([]);
      log({ screenId: 's8', type: 'place-attr', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return true;
    }
    sayNow(c.ok, 'smile');
    setPending(rest);
    return true;
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setFixed(false); lad.reset(); sayNow(c.more, 'curious'); }, reduceMotion() ? 300 : 900);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const dnd = useKzDrag((x, where) => place(where));
  const tapSpot = (spot) => { if (!sel) { setMsg(c.pickFirst); return; } place(spot); };
  const lit = lad.lv >= 3;
  const s = pick(R.s);
  const label = stickerText(stk);
  const spotEl = (id) => (
    <button key={'s' + id} type="button" data-place={id} disabled={!canTap || fixed} onClick={() => tapSpot(id)}
      className={'l4-spot' + (dnd.hover === id ? ' is-hover' : '') + (dnd.active || sel ? ' is-call' : '') + (lit && id === 'A' ? ' is-led' : '')}>
      <Led on={lit && id === 'A'} />
    </button>
  );
  const peekEl = (id) => <span key={'p' + id} className="l4-attr l4-peek">{label}</span>;
  const at = (id) => (peek === id ? peekEl(id) : spotEl(id));
  const parts = fixed ? linkParts(R.href, s, solved ? '' : 'kz-a-stamp')
    : [<OpenA key="oa" />, at('A'), <Gt key="g1" />, at('B'), W_(s), <CloseA key="ca" />, at('C'), <Gt key="g2" />];
  const items = fixed ? [{ s, href: R.href, k: 'a', cls: solved ? '' : 'kz-a-stamp' }]
    : peek === 'B' ? [{ s: label + s, k: 't', hl: true }] : [{ s, k: 't', hl: !!peek }];
  const busy = !queue.length || fixed;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={busy ? c.ok : sel ? c.askPlace : c.ask} hint={busy ? null : (msg || hintAt(lad.lv, c.hints))} n={queue.length > 0 && doneN > 0 ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        <div className={'kz-scene kz-scene-col' + (dnd.active || sel ? ' is-dragging' : '')} key={'r' + doneN}>
          <div className="kz-col">
            <PaperBrowser title={pageTitle('index.html', pick)} short cls="l4-br" pageHl={!!peek}>
              <LinkDoc blocks={[{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'row', k: 'r', items }]} />
            </PaperBrowser>
            <KzCode lines={[{ k: 'a', d: 0, cls: 'l4-line-big' + (fixed ? ' is-new' : ' is-hl'), parts }]} />
          </div>
        </div>
        {!busy ? (
          <div className="kz-tray">
            <button type="button" disabled={!canTap} data-id="stk"
              className={'kz-scrap kz-scrap-tag l4-sticker' + (sel ? ' is-sel' : '') + (shake ? ' kz-a-shake' : '') + (lit ? ' is-led' : '')}
              onPointerDown={(e) => { if (canTap) dnd.start(e, 'stk', label); }}
              onClick={() => { setSel(!sel); setMsg(null); sfx('tap', true); }}>
              <span translate="no">{label}</span><Led on={led && !sel} />
            </button>
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// S9. РЕШАЕТ АДРЕС — показ: на главной две ссылки; значение первой загорается,
// ссылка сама открывает котов, потом вторая — собак. Потом адрес в первой сам
// меняется на dogs.html: слова те же, а открываются собаки.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [swapped, setSwapped] = useState(solved);
  const nav = useNav();
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const brRef = useRef(null);
  const q = (r, sel) => () => r.current && r.current.querySelector(sel);
  const W = reduceMotion() ? 150 : 800;
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q(codeRef, '.l4-l1 .l4-av') },
    { look: q(brRef, '[data-k="l1"]'), act: () => nav.go('cats.html') },
    { wait: W },
    { say: [{ text: c.sayCats, pose: 'point' }] },
    { act: () => nav.toHome() }, { wait: W / 2 },
    { look: q(codeRef, '.l4-l2 .l4-av') },
    { look: q(brRef, '[data-k="l2"]'), act: () => nav.go('dogs.html') },
    { wait: W },
    { say: [{ text: c.sayDogs, pose: 'point' }] },
    { act: () => nav.toHome() }, { wait: W / 2 },
    { say: [{ text: c.saySwap, pose: 'curious' }] },
    { look: q(codeRef, '.l4-l1 .l4-av'), act: () => { sfx('pop', true); setSwapped(true); } },
    { wait: W / 2 },
    { look: q(brRef, '[data-k="l1"]'), act: () => nav.go('dogs.html') },
    { wait: W },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const v1 = swapped ? 'dogs.html' : 'cats.html';
  const hl1 = speaker.text === c.sayCats || speaker.text === c.done || speaker.text === c.saySwap;
  const hl2 = speaker.text === c.sayDogs;
  const cats = pageTitle('cats.html', pick), dogs = pageTitle('dogs.html', pick);
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' },
    { t: 'row', k: 'r', items: [{ s: cats, href: v1, k: 'l1', hl: hl1 }, { s: dogs, href: 'dogs.html', k: 'l2', hl: hl2 }] }];
  const askText = explore ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l4-duo">
          <div className="kz-col" ref={codeRef}>
            <KzCode cls="kz-code-sm" lines={[
              { k: 'l1' + (swapped ? 's' : ''), d: 0, cls: 'l4-l1' + (hl1 ? ' is-say' : '') + (swapped && !solved ? ' is-new' : ''), parts: linkParts(v1, cats) },
              { k: 'l2', d: 0, cls: 'l4-l2' + (hl2 ? ' is-say' : ''), parts: linkParts('dogs.html', dogs) }
            ]} />
          </div>
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short brRef={brRef} urlHl={nav.url !== 'index.html'}>
              <LinkDoc blocks={blocks} onGo={explore ? nav.go : null} />
            </LinkBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S10. ПОЧИНИ ССЫЛКУ — «Игры» ведут к котам. На карте сайта под каждой страницей
// её файл. Ученик правит значение href и нажимает ссылку: браузер честно
// открывает то, что написано (другую страницу или «Файл не найден»).
// =============================================================================
const S10_MAP = ['index.html', 'cats.html', 'dogs.html', 'games.html'];
function S10({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s10;
  const [rec, put] = useRec('s10');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 20 });
  useEffect(() => { ty.setVal(solved ? 'games.html' : 'cats.html'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const nav = useNav();
  const lastTry = useRef(null);
  useEffect(() => { if (ty.val !== lastTry.current) nav.reset(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow, 0);
  const tryIt = () => {
    if (!canTap) return;
    const v = ty.val.trim();
    if (okNow) { nav.go(v); return; }
    if (!v) { setMsg(c.msgs.empty); sayNow(c.msgs.empty, 'think'); return; }
    st.current.tries += 1;
    lastTry.current = ty.val;
    nav.go(v);
    if (v === 'games.html') {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's10', type: 'fix-href', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    const m = SITE[v] ? fillL(c.msgs.page, { page: pageL(v) }) : fillL(c.msgs.none, { url: v });
    sfx('soft', true); setMsg(m); sayNow(m, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const games = pageTitle('games.html', pick);
  const v = ty.val.trim();
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'row', k: 'r', items: [{ s: games, href: v, k: 'g', cls: led ? 'is-led' : '' }] }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short pageHl={!okNow && nav.url === 'index.html'} urlHl={nav.url !== 'index.html'}>
              <LinkDoc blocks={blocks} onGo={canTap ? tryIt : null} />
            </LinkBrowser>
            <KzCode lines={[{ k: 'a', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? linkParts('games.html', games, 'kz-a-stamp') : [
              <OpenA key="oa" sp />, <span key="an" className="l4-attr"><span className="l4-an">href</span><span className="l4-eq">=</span><span className="l4-av">"</span></span>,
              <span key="g" className={'kz-gap l4-gap-v' + (lad.lv >= 2 ? ' kz-gap-led' : '')}>
                <InlineInput value={ty.val} onChange={(x) => { ty.setVal(x); setMsg(null); }} inputRef={ty.inputRef} onEnter={tryIt} placeholder={L3('…', '…', '…')} label={c.ask} max={20} cls="kz-tag-in" />
              </span>,
              <span key="q2" className="l4-attr"><span className="l4-av">"</span></span>, <Gt key="gt" />, W_(games), T_('a', true)] }]} />
          </div>
          <div className="l4-map l4-map-sm" aria-label={pick(UI.siteMap)}>
            {S10_MAP.map((u, i) => <SiteCard key={u} url={u} i={i} hl={lad.lv >= 3 && u === 'games.html'} noTitle={false} />)}
          </div>
        </div>
        {!okNow ? <KeyRow keys={['.', 'html']} ty={ty} canTap={canTap} onCheck={tryIt} ready={v.length > 5} label={UI.go} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S11. КУДА ПРИВЕДЁТ? — строка кода со ссылкой; ученик нажимает страницу на
// карте сайта, браузер честно открывает файл из href. Ловушка: слова «Про
// котов», а адрес dogs.html. Промах — в конце ещё раунд того же типа.
// =============================================================================
const S11_ROUNDS = [
  { href: 'games.html', s: C.s11.texts.play, on: 'index.html', type: 'plain' },
  { href: 'dogs.html', s: PAGES.cats.title, on: 'index.html', type: 'trap' },
  { href: 'index.html', s: UI.home, on: 'cats.html', type: 'home' }
];
const S11_EXTRA = [
  { href: 'cats.html', s: C.s11.texts.meow, on: 'index.html', type: 'plain' },
  { href: 'games.html', s: PAGES.dogs.title, on: 'index.html', type: 'trap' },
  { href: 'index.html', s: C.s11.texts.back, on: 'dogs.html', type: 'home' }
];
const S11_MAP = ['index.html', 'cats.html', 'dogs.html', 'games.html'];
// Окно раунда: своя история переходов; после ответа ссылка сама открывает файл из href.
function S11Board({ R, ans }) {
  const pick = usePick();
  const nav = useNav(R.on);
  useEffect(() => { if (ans) { const t = setTimeout(() => nav.go(R.href), reduceMotion() ? 0 : 350); return () => clearTimeout(t); } return undefined; }, [ans]); // eslint-disable-line react-hooks/exhaustive-deps
  const blocks = [{ t: 'h1', s: pageH1(R.on, pick), k: 'h' }, { t: 'row', k: 'r', items: [{ s: pick(R.s), href: R.href, k: 'a', hl: !!ans }] }];
  return (
    <LinkBrowser nav={nav} short urlHl={nav.url !== R.on}>
      <LinkDoc blocks={blocks} />
    </LinkBrowser>
  );
}
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [ans, setAns] = useState(null);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (ans ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S11_EXTRA : S11_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const answer = (url) => {
    if (!canTap || !round || ans) return;
    const right = url === R.href;
    setAns(url);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.push({ i: round.i, extra: true });
    const line = right ? c.ok : fillL(c.miss[R.type], { url: R.href });
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's11.r' + (ii + 1), type: 'predict-target', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col l4-s11" key={'r' + doneN}>
            <div className="kz-col">
              <KzCode lines={[{ k: 'a', d: 0, cls: 'kz-a-drop kz-slip', parts: linkParts(R.href, pick(R.s), ans ? 'is-hl' : '') }]} />
              <S11Board R={R} ans={ans} />
            </div>
            <div className="l4-map">
              {S11_MAP.map((u, i) => (
                <SiteCard key={u} url={u} i={i} onClick={() => answer(u)} disabled={!canTap || !!ans || !round}
                  state={ans ? (u === R.href ? 'ok' : u === ans ? 'off' : null) : null} led={led && !ans} />
              ))}
            </div>
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S12. ССЫЛКА ПО ЧАСТЯМ — показ: части ссылки появляются по очереди, потом Коди
// сам проходит по ним (тег a, имя атрибута, знак равно, значение-адрес, слова,
// закрывающий тег) — у каждой своя подсветка в коде и на странице. Потом по
// желанию ученик нажимает часть — Коди повторяет её объяснение.
// =============================================================================
const PARTS12 = ['open', 'name', 'eq', 'val', 'text', 'close'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? PARTS12.length : -1);
  const WALK = PARTS12.map((k, i) => ({ text: c.parts[k], pose: i === PARTS12.length - 1 ? 'smile' : 'point', k }));
  const ORDER = WALK.map((w) => ({ text: w.text, pose: w.pose })).concat([{ text: c.tapSay, pose: 'curious' }]);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 520;
  const run = () => { PARTS12.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run },
    { wait: STEP * PARTS12.length + 200 },
    { act: () => setRead(PARTS12.length) },
    { say: ORDER },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const [picked, setPicked] = useState(null);
  const pickPart = (k) => { if (!explore || !k) return; sfx('tap', true); setPicked(k); sayNow(c.parts[k], 'point'); };
  const walkNow = spoken || picked ? null : WALK.find((w) => w.text === speaker.text);
  const cur = picked || (walkNow ? walkNow.k : read >= 0 && read < PARTS12.length ? PARTS12[read] : null);
  const ledPart = useIdleLed(explore && !picked, 0);
  const games = pageTitle('games.html', pick);
  const shown = (k) => read >= PARTS12.indexOf(k);
  const part = (k, node, extra) => (shown(k) ? (
    <button key={k} type="button" className={'l4-part l4-part-' + k + (cur === k ? ' is-on' : '') + (read === PARTS12.indexOf(k) && !solved ? ' kz-a-stamp' : '') + (extra || '')}
      disabled={!explore} onClick={() => pickPart(k)} aria-label={pick(c.parts[k])}>{node}{k === 'open' ? <Led on={ledPart} /> : null}</button>
  ) : <span key={k} className="l4-part is-ghost">{node}</span>);
  const tk = (s, n) => <span className={n ? 'kz-tk-n' : 'kz-tk-b'}>{s}</span>;
  const line = (
    <div className="kz-code l4-walk" translate="no">
      <div className="kz-line l4-walk-line">
        <span className="kz-tag">
          {part('open', <>{tk('<')}{tk('a', true)}</>)}{' '}
          {part('name', <span className="l4-an">href</span>)}
          {part('eq', <span className="l4-eq">=</span>)}
          {part('val', <span className="l4-av">"games.html"</span>)}
          {part('open', tk('>'), ' l4-part-gt')}
        </span>
        {part('text', <span className="kz-txt">{games}</span>)}
        {part('close', <span className="kz-tag">{tk('<')}{tk('/')}{tk('a', true)}{tk('>')}</span>)}
      </div>
    </div>
  );
  const whole = cur === 'open' || cur === 'close';
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'row', k: 'r', items: [{ s: games, href: 'games.html', k: 'g', hl: cur === 'text' || whole }] }];
  const askText = read < 0 ? c.ask : explore ? c.askTap : c.askDone;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={askText} />
        <div className={'kz-scene kz-scene-col l4-s12' + (explore ? ' is-explore' : '')}>
          <div className="kz-col">
            {line}
            <div className="l4-s12-row">
              <PaperBrowser title={pageTitle('index.html', pick)} short cls="l4-br"><LinkDoc blocks={blocks} /></PaperBrowser>
              <div className={'l4-dest' + (cur === 'val' || cur === 'name' ? ' is-on' : '')}>
                <span className="l4-dest-arrow" aria-hidden="true" />
                <SiteCard url="games.html" i={3} hl={cur === 'val' || cur === 'name'} />
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S13. СВОЯ ССЫЛКА — ученик пишет ссылку на страницу мультиков целиком: тег a,
// href="cartoons.html" и свои слова. Окно меняется сразу при наборе (честно);
// проверка — по «Проверить»; строка «Игры» выше — образец. Свои слова уходят в
// итог урока и в артефакт.
// =============================================================================
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const mine = store.get('myLink') || '';
  const ty = useTagTyping({ max: 70 });
  useEffect(() => { if (solved && mine) ty.setVal('<a href="cartoons.html">' + mine + '</a>'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const nav = useNav();
  useEffect(() => { nav.reset(); }, [ty.val]); // eslint-disable-line react-hooks/exhaustive-deps
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [tried, setTried] = useState(false);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const r = linkIssue(ty.val, 'cartoons.html', c.msgs);
    if (!r.msg) {
      store.set('myLink', r.text);
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's13', type: 'write-link', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(r.msg); sayNow(r.msg, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const go = (href) => { if (okNow) setTried(true); nav.go(href); };
  const games = pageTitle('games.html', pick);
  const items = [{ s: games, href: 'games.html', k: 'g' }].concat(typedItems(ty.val).map((it) => (it.k === 'mine' && okNow && !tried ? Object.assign({}, it, { cls: 'is-led' }) : it)));
  const blocks = [{ t: 'h1', s: pageH1('index.html', pick), k: 'h' }, { t: 'row', k: 'r', items }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage kz-typed">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('index.html', pick)} short pageHl={!okNow} urlHl={nav.url !== 'index.html'}>
              <LinkDoc blocks={blocks} onGo={canTap ? go : null} />
            </LinkBrowser>
            <KzCode cls="kz-code-sm" lines={[
              { k: 'h', d: 0, cls: 'l4-ctx', parts: [T_('h1'), W_(pageH1('index.html', pick)), T_('h1', true)] },
              { k: 'g', d: 0, cls: 'l4-sample' + (lad.lv >= 3 ? ' is-say' : ''), parts: linkParts('games.html', games) },
              { k: 'm', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: [
                <span key="g" className={'kz-gap l4-gap-wide' + (led ? ' kz-gap-led' : '')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={70} cls="kz-tag-in" />
                </span>] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<a ', 'href', '=', '"', '>', '</a>', 'cartoons.html']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 20} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S14. ССЫЛКА СЪЕЛА СТРАНИЦУ — нет </a> после «Игры»: обе новости ниже честно
// синие и нажимаются. Перетащить </a> в одно из трёх мест: только сразу после
// «Игры» новости снова обычный текст; другие места браузер честно показывает.
// =============================================================================
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [okNow, setOkNow] = useState(solved);
  const [sel, setSel] = useState(false);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(false);
  const [peek, setPeek] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'embarrassed' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const led = useIdleLed(canTap && !okNow, sel ? 1 : 0);
  const place = (spot) => {
    if (!canTap || okNow || !spot) return false;
    st.current.tries += 1;
    if (spot !== 'A') {
      st.current.misses += 1;
      sfx('soft', true); setShake(true); setTimeout(() => setShake(false), 520);
      clearTimeout(peekT.current); setPeek(spot); peekT.current = setTimeout(() => setPeek(null), 1900);
      const m = c.why[spot === 'B' ? 'b' : 'c'];
      setMsg(m); setSel(false); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('win', true); setOkNow(true); setSel(false); setMsg(null); setPeek(null); put({ done: true });
    log({ screenId: 's14', type: 'place-closing-a', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
    sayNow(c.ok, 'smile');
    return true;
  };
  const dnd = useKzDrag((x, where) => place(where));
  const tapSpot = (spot) => { if (!sel) { setMsg(c.pickFirst); return; } place(spot); };
  const lit = lad.lv >= 3;
  const games = pageTitle('games.html', pick), n1 = pick(NEWS[0]), n2 = pick(NEWS[1]);
  const where = okNow ? 'A' : peek;
  const spotEl = (id) => (where === id ? <span key={'c' + id} className={okNow ? 'kz-a-stamp' : 'l4-peek-tag'}>{T_('a', true)}</span> : okNow ? null : (
    <button key={'s' + id} type="button" data-place={id} disabled={!canTap} onClick={() => tapSpot(id)}
      className={'l4-spot' + (dnd.hover === id ? ' is-hover' : '') + (dnd.active || sel ? ' is-call' : '') + (lit && id === 'A' ? ' is-led' : '')}>
      <Led on={lit && id === 'A'} />
    </button>
  ));
  const inA1 = where !== 'A', inA2 = where == null || where === 'C';
  const blocks = [{ t: 'row', k: 'r', items: [{ s: games, href: 'games.html', k: 'g' }] },
    { t: 'p', s: n1, k: 'n1', href: inA1 ? 'games.html' : undefined, cls: okNow && !solved ? 'kz-a-stamp' : '' },
    { t: 'p', s: n2, k: 'n2', href: inA2 ? 'games.html' : undefined, cls: okNow && !solved ? 'kz-a-stamp' : '' }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={okNow ? c.ok : sel ? c.askPlace : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className={'kz-scene kz-scene-col' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col">
            <PaperBrowser title={pageTitle('index.html', pick)} short cls={'l4-br' + (okNow ? '' : ' l4-broken')} pageHl={!okNow}>
              <LinkDoc blocks={blocks} />
            </PaperBrowser>
            <KzCode cls="kz-code-sm" lines={[
              { k: 'a', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: [<TagA key="o" attr={<Attr v="games.html" />} />, W_(games), spotEl('A')] },
              { k: 'n1', d: 0, parts: [T_('p'), W_(n1), T_('p', true), spotEl('B')] },
              { k: 'n2', d: 0, parts: [T_('p'), W_(n2), T_('p', true), spotEl('C')] }
            ]} />
          </div>
        </div>
        {!okNow ? (
          <div className="kz-tray">
            <button type="button" disabled={!canTap} data-id="close"
              className={'kz-scrap kz-scrap-tag' + (sel ? ' is-sel' : '') + (shake ? ' kz-a-shake' : '') + (lit ? ' is-led' : '')}
              onPointerDown={(e) => { if (canTap) dnd.start(e, 'close', '</a>'); }}
              onClick={() => { setSel(!sel); setMsg(null); sfx('tap', true); }}>
              <span translate="no">{'</a>'}</span><Led on={led && !sel} />
            </button>
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// Q1. ПРОВЕРЬ СЕБЯ — новая страница без образца: спортивные кружки, две ссылки
// без адреса. Три наклейки: href="chess.html", "football.html" (без имени —
// лишняя) и href="football.html". Ученик сам решает, какую куда. До первой
// попытки ответ не подсвечен. Не туда — браузер честно на миг показывает, что
// вышло (ведёт не туда / ссылки нет), Коди называет причину.
// =============================================================================
const Q1_STK = [{ id: 'chess', n: 'href', v: 'chess.html' }, { id: 'bare', n: null, v: 'football.html' }, { id: 'foot', n: 'href', v: 'football.html' }];
const Q1_WANT = { f: 'foot', c: 'chess' };
const Q1_TEXT = { f: PAGES.football.title, c: PAGES.chess.title };
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? Object.assign({}, Q1_WANT) : { f: null, c: null });
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [peek, setPeek] = useState(null);
  const nav = useNav('club.html');
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = !!(slots.f && slots.c);
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const nFull = (slots.f ? 1 : 0) + (slots.c ? 1 : 0);
  const led = useIdleLed(canTap && !done, nFull + (sel ? 10 : 0));
  const stkOf = (id) => Q1_STK.find((x) => x.id === id);
  const place = (id, where) => {
    if (!canTap || done || !id || !where || slots[where]) return false;
    st.current.tries += 1;
    if (Q1_WANT[where] !== id) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      clearTimeout(peekT.current); setPeek({ where, id }); peekT.current = setTimeout(() => setPeek(null), 1900);
      const m = id === 'bare' ? c.why.bare : c.why.swap;
      setMsg(m); setSel(null); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = Object.assign({}, slots, { [where]: id });
    setSlots(ns); setSel(null); setMsg(null); setPeek(null);
    if (ns.f && ns.c) {
      put({ done: true });
      log({ screenId: 'q1', type: 'give-href', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const pickSlot = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const lit = lad.lv >= 3;
  const nextWhere = !slots.f ? 'f' : 'c';
  const idAt = (where) => slots[where] || (peek && peek.where === where ? peek.id : null);
  const hrefAt = (where) => { const id = idAt(where); const s = id ? stkOf(id) : null; return s && s.n ? s.v : undefined; };
  const items = ['f', 'c'].map((w) => ({ s: pick(Q1_TEXT[w]), href: hrefAt(w), k: w, hl: !!(peek && peek.where === w) }));
  const blocks = [{ t: 'h1', s: pageH1('club.html', pick), k: 'h' }, { t: 'row', k: 'r', items }];
  const slot = (where) => (
    <button key={'s' + where} type="button" data-place={where} disabled={!canTap || done || !!slots[where]} onClick={() => pickSlot(where)}
      className={'l4-spot l4-spot-wide' + (dnd.hover === where ? ' is-hover' : '') + (dnd.active || sel ? ' is-call' : '')}>
      <Led on={(led && !!sel) || (lit && where === nextWhere)} />
    </button>
  );
  const dest = (where) => {
    const h = hrefAt(where);
    if (!idAt(where)) return null;
    return <span key="d" className={'l4-chip' + (slots[where] ? '' : ' is-peek')}>{h && SITE[h] ? <><PagePic pic={SITE[h].pic} />{pageTitle(h, pick)}</> : '—'}</span>;
  };
  const lineOf = (where) => {
    const id = idAt(where);
    const s = id ? stkOf(id) : null;
    const attr = s ? <span className={'l4-attr' + (slots[where] ? ' kz-a-stamp' : ' l4-peek')}>{s.n ? <><span className="l4-an">{s.n}</span><span className="l4-eq">=</span></> : null}<span className="l4-av">{'"' + s.v + '"'}</span></span> : slot(where);
    return { k: where, d: 0, cls: slots[where] ? 'is-new' : '', parts: [<OpenA key="oa" sp />, <React.Fragment key="at">{attr}</React.Fragment>, <Gt key="gt" />, W_(pick(Q1_TEXT[where])), T_('a', true), dest(where)] };
  };
  const hint = hintAt(lad.lv, c.hints);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hint)} n={done ? null : nFull + '/2'} />
        <div className={'kz-scene kz-scene-col l4-q1' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col">
            <LinkBrowser nav={nav} homeTitle={pageTitle('club.html', pick)} short pageHl={!!peek} urlHl={nav.url !== 'club.html'}>
              <LinkDoc blocks={blocks} onGo={done && canTap ? nav.go : null} />
            </LinkBrowser>
            <KzCode cls="kz-code-sm" lines={[{ k: 'h', d: 0, cls: 'l4-ctx', parts: [T_('h1'), W_(pageH1('club.html', pick)), T_('h1', true)] }, lineOf('f'), lineOf('c')]} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {Q1_STK.map((s, i) => ((slots.f === s.id || slots.c === s.id) ? null : (
              <button key={s.id} type="button" disabled={!canTap} data-id={s.id}
                className={'kz-scrap kz-scrap-tag l4-sticker' + (sel === s.id ? ' is-sel' : '') + (shake === s.id ? ' kz-a-shake' : '') + (lit && s.id === Q1_WANT[nextWhere] ? ' is-led' : '')}
                style={{ '--r': ((i % 2 ? 1 : -1) * 2) + 'deg' }}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, s.id, stickerText(s)); }}
                onClick={() => { setSel(sel === s.id ? null : s.id); setMsg(null); sfx('tap', true); }}>
                <span translate="no">{stickerText(s)}</span><Led on={led && !sel} />
              </button>
            )))}
          </div>
        ) : null}
      </Sheet>
      <KzGhost ghost={dnd.ghost} />
    </Stage>
  );
}

// =============================================================================
// Q2. ЧТО ТАКОЕ АТРИБУТ? — три варианта, верный не первый. До первой попытки
// ничего не подсвечено; неверный вариант гаснет, Коди называет причину.
// =============================================================================
function Q2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q2;
  const [rec, put] = useRec('q2');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o.id) >= 0) return;
    if (o.right) {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 'q2', type: 'what-attribute', correct: true, firstTry: off.length === 0 && lad.asked.current === 0, attempts: off.length + 1, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setOff(off.concat(o.id)); setMsg(o.why); sayNow(o.why, 'think');
    if (off.length + 1 >= 2) lad.bump();
  };
  const lit = lad.lv >= 3;
  const cats = pageTitle('cats.html', pick);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l4-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col kz-q2">
          <div className="kz-col">
            <KzCode lines={[{ k: 'l', d: 0, cls: 'kz-slip', parts: linkParts('cats.html', cats, 'is-hl') }]} />
            <div className="kz-quiz">
              {c.opts.map((o) => (
                <button key={o.id} type="button" disabled={!canTap || okNow || off.indexOf(o.id) >= 0} onClick={() => choose(o)}
                  className={'kz-btn ' + (okNow && o.right ? 'is-ok' : off.indexOf(o.id) >= 0 ? 'is-off' : 'is-ghost') + (lit && o.right && !okNow ? ' is-led' : '')}>
                  {pick(o.t)}<Led on={led && !okNow && off.indexOf(o.id) < 0} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S15. ВЫВОД — карта сайта: главная и четыре страницы соединены дорожками-
// ссылками (дорожки прорисовываются ступенчато); у дорожки к мультикам — слова
// ученика. Под картой — его ссылка; роли a, атрибут, href загораются, пока Коди
// их называет. Единственный праздник урока.
// =============================================================================
const MAP15 = ['cats.html', 'dogs.html', 'games.html', 'cartoons.html'];
function S15({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s15;
  const mine = store.get('myLink') || pageTitle('cartoons.html', pick);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const X = [12.5, 37.5, 62.5, 87.5];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="l4-sheetpage">
        <div className="kz-scene kz-s15 l4-s15">
          <div className="kz-col kz-s15-left">
            <div className={'l4-site' + (curK === 'a' ? ' is-hl' : '')}>
              <svg className="l4-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {X.map((x, i) => <path key={i} d={'M50 30 C 50 45, ' + x + ' 42, ' + x + ' 58'} style={{ '--dl': (0.5 + i * 0.25) + 's' }} />)}
              </svg>
              <div className="l4-site-top"><SiteCard url="index.html" i={0} /></div>
              <div className="l4-site-row">
                {MAP15.map((u, i) => (
                  <div key={u} className="l4-site-cell kz-a-drop" style={{ '--dl': (0.6 + i * 0.25) + 's' }}>
                    <SiteCard url={u} i={i + 1} hl={u === 'cartoons.html' && curK === null && speaker.text === c.say[0].text} />
                    {u === 'cartoons.html' ? <span className="l4-mine-tag">{mine}</span> : null}
                  </div>
                ))}
              </div>
            </div>
            <KzCode cls="kz-code-sm" lines={[{ k: 'm', d: 0, cls: 'kz-slip' + (curK ? ' l4-k-' + curK : ''), parts: linkParts('cartoons.html', mine, curK === 'attr' || curK === 'href' ? 'is-hl' : '') }]} />
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['a', 'attr', 'href'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'a' ? KZ.coral : k === 'attr' ? KZ.mustard : KZ.teal }}>
                  <i aria-hidden="true" />{pick(c.roles[k])}
                </span>
              ))}
            </div>
            <div className="kz-next"><Icon name="doc" size={18} /><span>{pick(UI.nextLesson)}: <b>{pick(UI.next)}</b></span></div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// РЕЕСТР И КОРЕНЬ
// =============================================================================
const SCREENS = [
  { id: 's1', code: 'HOOK', Comp: S1 }, { id: 's2', code: 'MISSION', Comp: S2 },
  { id: 's3', code: 'SHOW', Comp: S3 }, { id: 's4', code: 'LEVEL-1', Comp: S4 }, { id: 's5', code: 'PREDICT', Comp: S5 },
  { id: 's6', code: 'SHOW', Comp: S6 }, { id: 's7', code: 'LEVEL-2', Comp: S7 }, { id: 's8', code: 'CHECK-1', Comp: S8 },
  { id: 's9', code: 'SHOW', Comp: S9 }, { id: 's10', code: 'LEVEL-3', Comp: S10 }, { id: 's11', code: 'CHECK-2', Comp: S11 },
  { id: 's12', code: 'SHOW', Comp: S12 }, { id: 's13', code: 'LEVEL-4', Comp: S13 }, { id: 's14', code: 'CHECK-3', Comp: S14 },
  { id: 'q1', code: 'CHECK-4', Comp: Q1 }, { id: 'q2', code: 'QUIZ', Comp: Q2 },
  { id: 's15', code: 'ACHIEVEMENT', Comp: S15 }
];
// «Повторить» стирает только экран; своя ссылка ученика (myLink) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — главная страница со ссылкой ученика на страницу мультиков.
function lesson4Artifact(store) {
  const t = store.get('myLink');
  if (!t) return null;
  return { type: 'html-page', title: 'index.html', text: t, link: { href: 'cartoons.html', text: t },
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>index.html</title>', '  </head>', '  <body>',
      '    <a href="cats.html">cats</a>', '    <a href="dogs.html">dogs</a>', '    <a href="games.html">games</a>',
      '    <a href="cartoons.html">' + escHtml(t) + '</a>', '  </body>', '</html>'].join('\n') };
}

export default function HtmlSsylki({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson4Artifact(store) })
  });
  useParallax();
  usePaperSound();
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
  const p = { screen: R.i, total: SCREENS.length, next: go(R.next), prev: R.i > 0 ? go(R.prev) : null, finish: R.finish, name: R.displayName };
  return (
    <R.Shell css={LESSON_CSS + CANON_UI_CSS}>
      <SpokenTags>
        {!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}
      </SpokenTags>
    </R.Shell>
  );
}
