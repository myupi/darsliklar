// =============================================================================
// ЧАСТИ УРОКА 5 — страница питомцев в бумажном браузере, честные картинки, код img
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// Озвучка урока поверх озвучки бумажного набора. Файл cat.jpg — «cat точка
// J P G»; знаки «=» и кавычки в речь не идут (рядом всегда слова «знак равно»,
// «кавычки»); голые img, src и href — словами (TAG_SAY), alt читается как есть.
const DOT_SAY = { uz: 'nuqta', ru: 'точка', en: 'dot' };
const EXT_SAY = { jpg: 'J P G', png: 'P N G', html: 'html' };
const spokenKit5 = spokenHtml;
// eslint-disable-next-line no-func-assign
spokenHtml = (text, lang) => {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  let s = String(text || '').replace(/[«“"]\s*=\s*[»”"]/g, ' ').replace(/"/g, ' ');
  s = s.replace(/\b([A-Za-z_0-9]+)\.(jpg|png|html)\b/g, (all, n, e) => n + ' ' + (DOT_SAY[lang] || DOT_SAY.ru) + ' ' + EXT_SAY[e]);
  return spokenKit5(s, lang).replace(/(^|[^A-Za-z‘’'ʻʼ])(img|src|href)(?=[^A-Za-z‘’'ʻʼ]|$)/g, (all, pre, t) => pre + m[t]);
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
    // Подгонка — в следующем кадре: иначе смена шрифта внутри наблюдателя даёт «ResizeObserver loop».
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });
    ro.observe(page);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); ro.disconnect(); };
  }, [dep]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// ФОТО-ФАЙЛЫ: файл → рисунок и фон бумажного фото.
// ─────────────────────────────────────────────────────────────────────────────
const PHOTOS = {
  'cat.jpg': { pic: 'cat', bg: KZ.mustard, seed: 501 },
  'dog.jpg': { pic: 'dog', bg: '#8FCFC3', seed: 502 },
  'parrot.png': { pic: 'parrot', bg: '#F6DFAE', seed: 503 },
  'fish.jpg': { pic: 'fish', bg: '#9EC9E0', seed: 504 }
};
const ALT_SHORT = {
  cat: L3('Mushuk', 'Кот', 'A cat'), dog: L3('It', 'Собака', 'A dog'),
  fish: L3('Baliq', 'Рыбка', 'A fish'), parrot: L3('To‘tiqush', 'Попугай', 'A parrot')
};
const fileOf = (src) => (typeof src === 'string' ? PHOTOS[src.trim()] : null);

// Бумажное фото: рваная вырезка с фоном и рисунком питомца.
function Photo({ file, cls, hl }) {
  const ph = PHOTOS[file];
  if (!ph) return null;
  return (
    <span className={'l5-photo' + (hl ? ' is-hl' : '') + (cls ? ' ' + cls : '')} data-file={file}>
      <Cut c={ph.bg} seed={ph.seed} n={9} amp={3} asp={1.35} cls="l5-photo-cut" />
      <span className={'l5-pic l5-pic-' + ph.pic} aria-hidden="true"><i /><i /><i /></span>
    </span>
  );
}
// Карточка файла (как в ролике cat.jpg): фото и имя файла.
function FileCard({ file, onClick, state, hl, led, disabled, i = 0, broken, label }) {
  const pick = usePick();
  const inner = (
    <>
      <Cut c="var(--kz-piece)" seed={520 + i * 7} n={8} amp={3} asp={0.85} cls="l5-card-cut" r={i % 2 ? 1.2 : -1.2} />
      <span className="l5-card-in">
        {broken ? <span className="l5-broken-ic l5-broken-big" aria-hidden="true" /> : <Photo file={file} />}
        <code translate="no">{broken ? pick(UI.broken) : (label || file)}</code>
      </span>
      <Led on={!!led} />
    </>
  );
  const c = 'l5-card' + (hl ? ' is-hl' : '') + (state ? ' is-' + state : '');
  if (onClick) return <button type="button" className={c} onClick={onClick} disabled={disabled} data-file={broken ? 'broken' : file}>{inner}</button>;
  return <div className={c} data-file={file}>{inner}</div>;
}

// КАРТИНКА В БРАУЗЕРЕ — как её рисует настоящий браузер: файл есть — фото;
// src нет — пусто (с alt — только текст alt); файла нет — значок сломанной
// картинки и текст alt. fall — фото рвётся и падает (показ «не загрузилась»).
function ImgEl({ src, alt, hl, fall, failed, k }) {
  const has = typeof src === 'string' && src.trim() !== '';
  const ph = has && !failed ? fileOf(src) : null;
  if (ph) return <Photo file={src.trim()} hl={hl} cls={fall ? 'l5-fall' : ''} />;
  if (!has) return alt ? <span className={'l5-alt' + (hl ? ' is-hl' : '')} data-k={k}>{alt}</span> : <span className="l5-none" data-k={k} />;
  return <span className={'l5-broken' + (hl ? ' is-hl' : '')} data-k={k}><i className="l5-broken-ic" aria-hidden="true" />{alt ? <span>{alt}</span> : null}</span>;
}
// СТРАНИЦА: { t: 'h1' | 'p' | 'txt', s } и { t: 'img', src, alt, fall, failed };
// картинки подряд стоят в одной строке (img — строчный тег).
function ImgDoc({ blocks, anim }) {
  const ref = useFitPage(JSON.stringify(blocks));
  const out = [];
  blocks.forEach((bk, i) => {
    const k = bk.k || i;
    const st = anim ? { '--dl': (0.08 * i) + 's' } : null;
    const ac = anim ? ' kz-a-drop' : '';
    if (bk.t === 'img') {
      const el = <ImgEl key={k} k={k} src={bk.src} alt={bk.alt} hl={bk.hl} fall={bk.fall} failed={bk.failed} />;
      const last = out[out.length - 1];
      if (last && last.row) last.items.push(el); else out.push({ row: true, k, items: [el], cls: ac, st });
      return;
    }
    out.push({ k, el: <div key={k} className={'l5-blk l5-' + bk.t + (bk.hl ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '') + ac} style={st}>{bk.s}</div> });
  });
  return (
    <div ref={ref} className="l5-doc">
      {out.map((o) => (o.row ? <div key={'r' + o.k} className={'l5-row' + o.cls} style={o.st}>{o.items}</div> : o.el))}
    </div>
  );
}
// Бумажный браузер страницы питомцев.
function PetBrowser({ children, cls, short, pageHl, title, url, brRef }) {
  const pick = usePick();
  return (
    <div className="l5-brwrap" ref={brRef}>
      <PaperBrowser title={title || pick(PAGES.pets.title)} url={url || 'pets.html'} short={short} cls={'l5-br' + (cls ? ' ' + cls : '')} pageHl={pageHl}>
        {children}
      </PaperBrowser>
    </div>
  );
}
// Программа чтения экрана: динамик и что она произносит (текст alt).
function Reader({ text, on, cls }) {
  const pick = usePick();
  return (
    <div className={'l5-reader' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} aria-label={pick(UI.reader)}>
      <i className="l5-spk" aria-hidden="true" /><span className="l5-reader-t">{text ? '«' + text + '»' : '…'}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// КОД: тег img с атрибутами, атрибут имя="значение".
// ─────────────────────────────────────────────────────────────────────────────
function TagImg({ attrs, cls }) {
  const list = (attrs || []).filter(Boolean);
  return (
    <span className={'kz-tag l5-tagimg' + (cls ? ' ' + cls : '')} translate="no">
      <span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">img</span>
      {list.map((a, i) => <React.Fragment key={i}>{' '}{a}</React.Fragment>)}
      <span className="kz-tk-b">{'>'}</span>
    </span>
  );
}
const Attr = ({ n, v, cls }) => (
  <span className={'l5-attr' + (cls ? ' ' + cls : '')}><span className="l5-an">{n}</span><span className="l5-eq">=</span><span className="l5-av">{'"' + v + '"'}</span></span>
);
const imgParts = (src, alt, opt) => {
  const o = opt || {};
  return [<TagImg key="i" cls={o.cls} attrs={[src != null ? <Attr n="src" v={src} cls={o.srcCls} /> : null, alt != null ? <Attr n="alt" v={alt} cls={o.altCls} /> : null]} />];
};
const OpenImg = ({ sp }) => <span key="oi" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">img</span>{sp ? '\u00A0' : null}</span>;
const Gt = ({ k }) => <span key={k || 'gt'} className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>;
const stickerText = (st) => st.n + '="' + st.v + '"';

// ─────────────────────────────────────────────────────────────────────────────
// РАЗБОР НАБРАННОГО — как его читает браузер.
// ─────────────────────────────────────────────────────────────────────────────
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
const oddQuotes = (s) => (String(s).match(/"/g) || []).length % 2 === 1 || (String(s).match(/'/g) || []).length % 2 === 1;
// Атрибут name="want", набранный в поле (s7). null — всё верно.
function attrIssue(val, name, want, msgs) {
  const s = String(val || '').trim();
  if (!s) return msgs.needName;
  const m = /^([^=\s"']*)\s*(=?)\s*([\s\S]*)$/.exec(s);
  const nm = m[1].toLowerCase(), eq = m[2], rest = m[3].trim();
  if (!nm) return msgs.needName;
  if (nm === 'href' && name !== 'href') return msgs.href;
  if (nm !== name) return msgs.wrongName;
  if (!eq) return msgs.needEq;
  const isQ = (ch) => ch === '"' || ch === "'";
  const q = rest.charAt(0), z = rest.charAt(rest.length - 1);
  if (!isQ(q) && !isQ(z)) return rest === want ? msgs.needQuotes : msgs.wrongVal;
  if (!isQ(q) || !isQ(z) || rest.length < 2 || q !== z) return msgs.needQuote2;
  if (rest.slice(1, -1).trim() !== want) return msgs.wrongVal;
  return null;
}
// Открывающий тег img в начале строки: атрибуты до «>» (с учётом кавычек).
function scanImg(s) {
  const mo = /^<\s*(img|image)(?=[\s>/]|$)/i.exec(s);
  if (!mo) return null;
  let q = null;
  for (let i = mo[0].length; i < s.length; i += 1) {
    const ch = s.charAt(i);
    if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if (ch === '>') return { name: mo[1].toLowerCase(), attr: s.slice(mo[0].length, i), end: i };
  }
  return { name: mo[1].toLowerCase(), attr: s.slice(mo[0].length), end: -1 };
}
const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/<[^>]*$/, '');
// Значение атрибута в набранном теге: { v, quoted } или null.
function attrVal(attr, name) {
  const re = new RegExp('(?:^|\\s)' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s"\'>]+))', 'i');
  const m = re.exec(attr);
  if (!m) return null;
  return { v: m[1] != null ? m[1] : m[2] != null ? m[2] : m[3], quoted: m[3] == null };
}
// Тег картинки, набранный целиком (s13): что не так; при успехе — { alt }.
function imgIssue(val, file, msgs) {
  const s = String(val || '').trim();
  if (/^<\s*img(src|alt)/i.test(s)) return { msg: msgs.needSpace };
  const op = scanImg(s);
  if (!op) return { msg: msgs.needOpen };
  if (op.name === 'image') return { msg: msgs.image };
  if (oddQuotes(op.attr)) return { msg: msgs.needQuote2 };
  const a = attrsOf(op.attr);
  if (!('src' in a)) return { msg: 'href' in a ? msgs.href : msgs.needSrc };
  const sv = attrVal(op.attr, 'src');
  if (!sv) return { msg: msgs.needEq };
  if (sv.v.trim() !== file) return { msg: msgs.wrongSrc };
  if (!sv.quoted) return { msg: msgs.needQuotes };
  if (!('alt' in a)) return { msg: msgs.needAlt };
  const av = attrVal(op.attr, 'alt');
  if (!av) return { msg: msgs.needEq };
  if (!hasLetters(av.v)) return { msg: msgs.needAltText };
  if (!av.quoted) return { msg: msgs.needQuotes };
  if (op.end < 0) return { msg: msgs.needGt };
  if (/<\s*\/\s*img\s*>/i.test(s.slice(op.end + 1))) return { msg: msgs.noClose };
  return { msg: null, alt: av.v.trim() };
}
// Живая страница набранной строки: текст до тега, картинка (когда тег дописан
// до «>»), текст после; </img> браузер не замечает.
function typedImgBlocks(val) {
  const s = String(val || '');
  const at = s.search(/<\s*(img|image)(?=[\s>/]|$)/i);
  if (at < 0) return stripTags(s).trim() ? [{ t: 'txt', s: stripTags(s), k: 'x0' }] : [];
  const out = [];
  const before = stripTags(s.slice(0, at));
  if (before.trim()) out.push({ t: 'txt', s: before, k: 'x0' });
  const op = scanImg(s.slice(at));
  if (!op || op.end < 0 || oddQuotes(op.attr)) return out;
  const a = attrsOf(op.attr);
  out.push({ t: 'img', src: 'src' in a ? a.src : undefined, alt: a.alt, k: 'mine' });
  const after = stripTags(s.slice(at + op.end + 1));
  if (after.trim()) out.push({ t: 'txt', s: after, k: 'x2' });
  return out;
}

// =============================================================================
// S1. КРЮЧОК — страница питомцев: одни слова. Нажать фото кота — карточка
// файла ступенчато перелетает в окно, на странице появляется картинка.
// =============================================================================
function S1({ p }) {
  const pick = usePick();
  const c = C.s1;
  const [rec, put] = useRec('s1');
  const solved = !!(rec && rec.done);
  const [shown, setShown] = useState(solved);
  const [speaker, say, spoken, sayNow] = useVoice([{ text: solved ? c.done : c.say, pose: solved ? 'smile' : 'hello' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved, spoken);
  const led = useIdleLed(canTap && !shown, 0);
  const brRef = useRef(null);
  const cardRef = useRef(null);
  const tm = useRef(0);
  useEffect(() => () => clearTimeout(tm.current), []);
  const land = () => { setShown(true); put({ done: true }); sfx('win', true); sayNow(c.magic, 'wonder'); say(c.done, 'smile'); };
  const tap = () => {
    if (!canTap || shown) return;
    sfx('pop', true);
    const to = brRef.current && brRef.current.querySelector('.kz-br-page');
    const el = cardRef.current && cardRef.current.querySelector('.l5-photo');
    if (reduceMotion() || !kzFly(el, to, 700)) { land(); return; }
    tm.current = setTimeout(land, 720);
  };
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'p', s: pick(PAGES.pets.text), k: 'p' }]
    .concat(shown ? [{ t: 'img', src: 'cat.jpg', k: 'cat' }] : [], [{ t: 'p', s: pick(PETS.cat.p1), k: 'p1' }]);
  const askText = shown ? c.askDone : c.ask;
  return (
    <Stage eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l5-s1">
          <PetBrowser brRef={brRef} pageHl={speaker.text === c.magic}><ImgDoc blocks={blocks} anim={shown && !solved} /></PetBrowser>
          {!shown ? (
            <div className="l5-s1-card" ref={cardRef}>
              <FileCard file="cat.jpg" onClick={tap} disabled={!canTap} led={led} />
            </div>
          ) : null}
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
      <Sheet cls="l5-sheetpage">
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
// S3. ТЕГ img — показ: загорается тег img; потом строка с p («оборачивает текст,
// у него есть пара»); рядом с img сам появляется </img>, зачёркивается и падает
// («img ничего не оборачивает — пары нет»); потом src — «о нём позже».
// =============================================================================
function S3({ p }) {
  const pick = usePick();
  const c = C.s3;
  const [rec, put] = useRec('s3');
  const solved = !!(rec && rec.done);
  const [close, setClose] = useState(solved ? 'gone' : 'none');   // none · on · fall · gone
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const brRef = useRef(null);
  const q = (r, sel) => () => r.current && r.current.querySelector(sel);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q(codeRef, '.l5-line-img .l5-tagimg') },
    { say: [{ text: c.sayImg, pose: 'point' }] },
    { look: q(codeRef, '.l5-line-p') },
    { say: [{ text: c.sayP, pose: 'point' }] },
    { act: () => { sfx('pop', true); setClose('on'); } },
    { look: q(codeRef, '.l5-ghostclose') },
    { act: () => { sfx('soft', true); setClose('fall'); } },
    { wait: reduceMotion() ? 100 : 650 },
    { act: () => setClose('gone') },
    { say: [{ text: c.sayNoClose, pose: 'explain' }] },
    { look: q(codeRef, '.l5-attr') },
    { say: [{ text: c.sayAttr, pose: 'explain' }] },
    { look: q(brRef, '.l5-photo') },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const hlImg = speaker.text === c.sayImg || speaker.text === c.sayNoClose;
  const hlP = speaker.text === c.sayP;
  const p1 = pick(PETS.cat.p1);
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'p', s: p1, k: 'p1', hl: hlP }, { t: 'img', src: 'cat.jpg', k: 'cat', hl: speaker.text === c.done }];
  const askText = explore ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l5-duo">
          <div className="kz-col" ref={codeRef}>
            <KzCode lines={[
              { k: 'p', d: 0, cls: 'l5-line-p' + (hlP ? ' is-say' : ''), parts: [T_('p'), W_(p1), T_('p', true)] },
              { k: 'i', d: 0, cls: 'l5-line-img' + (hlImg ? ' l5-hl-img' : ''), parts: imgParts('cat.jpg', null, { srcCls: 'l5-later' + (speaker.text === c.sayAttr ? ' is-hl' : '') }).concat(
                close === 'on' || close === 'fall' ? [<span key="gc" className={'l5-ghostclose' + (close === 'fall' ? ' is-fall' : ' kz-a-stamp')}>{T_('img', true)}</span>] : []) }
            ]} />
          </div>
          <div className="kz-col">
            <PetBrowser short brRef={brRef}><ImgDoc blocks={blocks} /></PetBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S4. ВСТАВЬ КАРТИНКУ — у строки нет начала: «▢ src="dog.jpg">». Ученик
// набирает «<img». Окно честное: без «<» на странице виден сам текст строки;
// с <img — фото; лишний «>» оставляет текст src="dog.jpg"> на странице.
// =============================================================================
function s4Blocks(val) {
  const n = normT(val);
  const tail = ' src="dog.jpg">';
  if (!n) return [{ t: 'txt', s: tail, k: 't' }];
  if (n === '<img' || n === '<image') return [{ t: 'img', src: 'dog.jpg', k: 'dog' }];
  if (n.charAt(0) !== '<') return [{ t: 'txt', s: val + tail, k: 't' }];
  if (n === '<img>' || n === '<image>') return [{ t: 'img', k: 'dog' }, { t: 'txt', s: tail, k: 't' }];
  return [];
}
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 10 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const issueOf = (v) => {
    const n = normT(v);
    if (n === '<img') return null;
    if (n === '<image') return c.msgs.image;
    if (n.indexOf('</') === 0) return c.msgs.noSlash;
    if (n.charAt(0) !== '<') return c.msgs.needLt;
    if (n.charAt(n.length - 1) === '>') return c.msgs.extraGt;
    return c.msgs.wrongName;
  };
  const check = () => {
    if (!canTap || okNow || !ty.val.trim()) return;
    st.current.tries += 1;
    const issue = issueOf(ty.val);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's4', type: 'write-img', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'p', s: pick(PETS.dog.p1), k: 'p1' }].concat(okNow ? [{ t: 'img', src: 'dog.jpg', k: 'dog' }] : s4Blocks(ty.val));
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PetBrowser short pageHl={!okNow}><ImgDoc blocks={blocks} /></PetBrowser>
            <KzCode lines={[
              { k: 'p', d: 0, cls: 'l5-ctx', parts: [T_('p'), W_(pick(PETS.dog.p1)), T_('p', true)] },
              { k: 'i', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? imgParts('dog.jpg', null, { cls: 'kz-a-stamp' }) : [
                <span key="g" className={'kz-gap' + (led || speaker.text === c.say ? ' kz-gap-led' : '') + (ty.val ? '' : ' l5-q')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={10} cls="kz-tag-in" />
                </span>, '\u00A0', <Attr key="a" n="src" v="dog.jpg" />, <Gt key="gt" />] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<', 'img']} ty={ty} canTap={canTap} onCheck={check} ready={normT(ty.val).length >= 4} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S5. ГДЕ БУДЕТ КАРТИНКА? — код: заголовок, два абзаца и img в одном из трёх
// мест. На странице три пунктирных места; ученик нажимает, браузер показывает
// правду. Промах — в конце ещё раунд того же типа (с собакой).
// =============================================================================
const S5_ROUNDS = [{ pet: 'cat', pos: 1 }, { pet: 'cat', pos: 0 }, { pet: 'cat', pos: 2 }];
const S5_EXTRA = [{ pet: 'dog', pos: 1 }, { pet: 'dog', pos: 0 }, { pet: 'dog', pos: 2 }];
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
  const shownRd = round || (ans != null ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S5_EXTRA : S5_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && ans == null, doneN);
  const answer = (pos) => {
    if (!canTap || !round || ans != null) return;
    const right = pos === R.pos;
    setAns(pos);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.push({ i: round.i, extra: true });
    const line = right ? c.ok : c.miss;
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's5.r' + (ii + 1), type: 'predict-place', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
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
  const file = R ? R.pet + '.jpg' : 'cat.jpg';
  const P = R ? PETS[R.pet] : PETS.cat;
  const p1 = pick(P.p1), p2 = pick(P.p2);
  const lines = R ? [{ k: 'h', d: 0, parts: [T_('h1'), W_(pick(PAGES.pets.title)), T_('h1', true)] }] : [];
  const blocks = R ? [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }] : [];
  const imgLine = { k: 'img', d: 0, cls: ans != null ? 'is-say' : 'is-hl', parts: imgParts(file, null) };
  const slot = (i) => (
    <button key={'s' + i} type="button" className={'l5-slot' + (led ? ' is-call' : '')} data-slot={i} disabled={!canTap || ans != null} onClick={() => answer(i)}>
      <Led on={led && i === 0} />
    </button>
  );
  if (R) {
    [0, 1, 2].forEach((i) => {
      if (R.pos === i) lines.push(imgLine);
      if (i < 2) lines.push({ k: 'p' + i, d: 0, parts: [T_('p'), W_(i === 0 ? p1 : p2), T_('p', true)] });
    });
    [0, 1, 2].forEach((i) => {
      if (ans != null && R.pos === i) blocks.push({ t: 'img', src: file, k: 'img', hl: true });
      if (i < 2) blocks.push({ t: 'p', s: i === 0 ? p1 : p2, k: 'p' + i });
    });
  }
  const wrong = ans != null && ans !== (R && R.pos);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene l5-duo" key={'r' + doneN}>
            <div className="kz-col"><KzCode cls="kz-code-sm" lines={lines.map((ln) => Object.assign({}, ln, { cls: (ln.cls || '') + ' kz-a-drop' }))} /></div>
            <div className="kz-col">
              <PetBrowser short pageHl={ans != null}>
                {ans == null ? (
                  <div className="l5-doc l5-slots">
                    <div className="l5-blk l5-h1">{pick(PAGES.pets.title)}</div>
                    {slot(0)}<div className="l5-blk l5-p">{p1}</div>{slot(1)}<div className="l5-blk l5-p">{p2}</div>{slot(2)}
                  </div>
                ) : <ImgDoc blocks={blocks} anim />}
              </PetBrowser>
              {wrong ? <span className="l5-oops kz-a-stamp" aria-hidden="true">?!</span> : null}
            </div>
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S6. АТРИБУТ src — показ: <img> без src — на странице пусто. В тег вклеивается
// наклейка src, потом значение "cat.jpg"; карточка файла cat.jpg ступенчато
// перелетает в окно — на странице фото кота.
// =============================================================================
function S6({ p }) {
  const pick = usePick();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [stage, setStage] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const brRef = useRef(null);
  const cardRef = useRef(null);
  const q = (r, sel) => () => r.current && r.current.querySelector(sel);
  const fly = () => { const el = cardRef.current && cardRef.current.querySelector('.l5-photo'); const to = brRef.current && brRef.current.querySelector('.kz-br-page'); if (!reduceMotion()) kzFly(el, to, 700); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q(codeRef, '.l5-tagimg'), act: () => { sfx('pop', true); setStage(1); } },
    { say: [{ text: c.saySrc, pose: 'explain' }] },
    { look: q(cardRef, '.l5-card'), act: fly },
    { wait: reduceMotion() ? 100 : 720 },
    { act: () => { sfx('win', true); setStage(2); } },
    { say: [{ text: c.sayFile, pose: 'point' }] },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const attr = stage === 1 ? <span className="l5-note kz-a-stamp">src</span>
    : stage === 2 ? <Attr n="src" v="cat.jpg" cls={(solved ? '' : 'kz-a-stamp') + (speaker.text === c.sayFile ? ' is-hl' : '')} /> : null;
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'p', s: pick(PETS.cat.p1), k: 'p1' }, { t: 'img', src: stage === 2 ? 'cat.jpg' : undefined, k: 'cat', hl: speaker.text === c.done }];
  const askText = explore ? c.askDone : c.ask;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l5-duo">
          <div className="kz-col l5-bench" ref={codeRef}>
            <KzCode lines={[{ k: 'i', d: 0, cls: 'l5-line-big' + (speaker.text === c.saySrc ? ' is-hl' : ''), parts: [<TagImg key="t" attrs={[attr]} />] }]} />
            {stage < 2 ? <div className="l5-filebox" ref={cardRef}><FileCard file="cat.jpg" hl={speaker.text === c.saySrc} /></div> : null}
          </div>
          <div className="kz-col">
            <PetBrowser short brRef={brRef} pageHl={speaker.text === c.say}><ImgDoc blocks={blocks} /></PetBrowser>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S7. АДРЕС ФАЙЛА — <img ▢>: ученик набирает src="dog.jpg". Под окном карточки
// файлов с именами. Окно честно меняется по ходу набора: есть файл — фото;
// нет такого файла — значок сломанной картинки; незакрытая кавычка — пусто.
// =============================================================================
function S7({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s7;
  const [rec, put] = useRec('s7');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 26 });
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
    const issue = attrIssue(ty.val, 'src', 'dog.jpg', c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's7', type: 'write-src', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const src = okNow ? 'dog.jpg' : oddQuotes(ty.val) ? null : attrsOf(ty.val).src;
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'p', s: pick(PETS.dog.p1), k: 'p1' }].concat(src === null ? [] : [{ t: 'img', src, k: 'dog' }]);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PetBrowser short pageHl={!okNow}><ImgDoc blocks={blocks} /></PetBrowser>
            <KzCode lines={[
              { k: 'i', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: okNow ? imgParts('dog.jpg', null, { srcCls: 'kz-a-stamp' }) : [
                <OpenImg key="oi" sp />,
                <span key="g" className={'kz-gap' + (led || speaker.text === c.say ? ' kz-gap-led' : '') + (ty.val ? '' : ' l5-q')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={26} cls="kz-tag-in" />
                </span>, <Gt key="gt" />] }
            ]} />
          </div>
          <div className="l5-files" aria-label={pick(UI.files)}>
            {['cat.jpg', 'dog.jpg'].map((f, i) => <FileCard key={f} file={f} i={i} hl={lad.lv >= 3 && f === 'dog.jpg'} />)}
          </div>
        </div>
        {!okNow ? <KeyRow keys={['src', '=', '"', 'dog.jpg']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length >= 10} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S8. КАКАЯ КАРТИНКА? — строка <img src="…">; ученик нажимает файл (или
// «сломанную картинку»), браузер показывает правду. Ловушка: cat.png — такого
// файла нет. Промах — в конце ещё раунд того же типа.
// =============================================================================
const S8_ROUNDS = [{ src: 'parrot.png' }, { src: 'cat.png' }, { src: 'fish.jpg' }];
const S8_EXTRA = [{ src: 'dog.jpg' }, { src: 'fish.png' }, { src: 'cat.jpg' }];
const S8_FILES = ['cat.jpg', 'dog.jpg', 'parrot.png', 'fish.jpg'];
function S8({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s8;
  const [rec, put] = useRec('s8');
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
  const R = shownRd ? (shownRd.extra ? S8_EXTRA : S8_ROUNDS)[shownRd.i] : null;
  const want = R ? (PHOTOS[R.src] ? R.src : 'broken') : null;
  const led = useIdleLed(canTap && !!round && !ans, doneN);
  const answer = (f) => {
    if (!canTap || !round || ans) return;
    const right = f === want;
    setAns(f);
    stats.current.push({ i: round.i, extra: !!round.extra, right });
    sfx(right ? 'ok' : 'soft', true);
    const rest = queue.slice(1);
    if (!right && !round.extra) rest.push({ i: round.i, extra: true });
    const line = right ? c.ok : fillL(want === 'broken' ? c.miss.broken : c.miss.plain, { file: R.src });
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const fr = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's8.r' + (ii + 1), type: 'predict-src', correct: true, firstTry: !!(fr && fr.right), attempts: e ? 2 : 1, helped: !!(fr && !fr.right), followUp: e ? e.right : null });
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
  const stateOf = (f) => (ans ? (f === want ? 'ok' : f === ans ? 'off' : null) : null);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col l5-s8" key={'r' + doneN}>
            <div className="kz-col">
              <KzCode lines={[{ k: 'i', d: 0, cls: 'kz-a-drop kz-slip', parts: imgParts(R.src, null, { srcCls: ans ? 'is-hl' : '' }) }]} />
              <PetBrowser short pageHl={!!ans}>
                {ans ? <ImgDoc blocks={[{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'img', src: R.src, k: 'i' }]} anim /> : <div className="l5-qmark" aria-hidden="true">?</div>}
              </PetBrowser>
            </div>
            <div className="l5-files l5-files-5">
              {S8_FILES.map((f, i) => <FileCard key={f} file={f} i={i} onClick={() => answer(f)} disabled={!canTap || !!ans || !round} state={stateOf(f)} led={led && !ans} />)}
              <FileCard broken i={4} onClick={() => answer('broken')} disabled={!canTap || !!ans || !round} state={stateOf('broken')} led={led && !ans} />
            </div>
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S9. АТРИБУТ alt — показ: у фото кота есть alt. Фото само рвётся и падает
// («не загрузилось») — браузер показывает значок и текст alt; потом
// появляется программа чтения экрана и «читает» alt; фото возвращается.
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const [phase, setPhase] = useState(solved ? 'back' : 'ok');   // ok · fall · broken · reader · back
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const brRef = useRef(null);
  const rdRef = useRef(null);
  const q = (r, sel) => () => r.current && r.current.querySelector(sel);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { look: q(codeRef, '.l5-attr-alt') },
    { say: [{ text: c.sayAlt, pose: 'point' }] },
    { act: () => { sfx('soft', true); setPhase('fall'); } },
    { wait: reduceMotion() ? 100 : 700 },
    { act: () => setPhase('broken') },
    { say: [{ text: c.sayFail, pose: 'explain' }] },
    { act: () => { sfx('pop', true); setPhase('reader'); } },
    { look: () => rdRef.current },
    { say: [{ text: c.sayReader, pose: 'point' }] },
    { act: () => { sfx('pop', true); setPhase('back'); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const alt = pick(PETS.cat.alt);
  const hlAlt = speaker.text === c.say || speaker.text === c.sayAlt;
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'img', src: 'cat.jpg', alt, k: 'cat', fall: phase === 'fall', failed: phase === 'broken', hl: phase === 'broken' }];
  const askText = explore ? c.askDone : c.ask;
  const readerOn = phase === 'reader' || phase === 'back';
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={askText} />
        <div className="kz-scene l5-duo">
          <div className="kz-col" ref={codeRef}>
            <KzCode cls="kz-code-sm" lines={[{ k: 'i', d: 0, cls: 'l5-line-big', parts: imgParts('cat.jpg', alt, { altCls: 'l5-attr-alt' + (hlAlt ? ' is-hl' : ''), srcCls: phase === 'broken' ? 'is-off' : '' }) }]} />
          </div>
          <div className="kz-col">
            <PetBrowser short brRef={brRef} cls={phase === 'broken' ? 'l5-broken-br' : ''}><ImgDoc blocks={blocks} /></PetBrowser>
            <div ref={rdRef} className="l5-reader-wrap">{readerOn ? <Reader text={alt} on={speaker.text === c.sayReader} cls={solved ? '' : 'kz-a-drop'} /> : null}</div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S10. ОПИШИ КАРТИНКУ — <img src="dog.jpg" alt="▢">: ученик пишет своё
// описание; программа чтения под окном сразу «читает» его. Засчитывается по
// «Готово» (свой текст, как в уроках 1–4).
// =============================================================================
const okAlt = (s) => okText(s) && !/["']/.test(String(s || ''));
function S10({ p }) {
  const pick = usePick();
  const c = C.s10;
  const [rec] = useRec('s10');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myAlt', screenId: 's10', type: 'own-alt', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const ready = ty.ready && okAlt(ty.val);
  const confirm = () => { if (canTap && ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const bad = hasTags(ty.val) || /["']/.test(ty.val);
  const hint = bad ? UI.noTags : hintAt(lad.lv, c.hints);
  const shown = okAlt(ty.val) ? ty.val : (okAlt(ty.saved) ? ty.saved : '');
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !bad ? null : hint} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PetBrowser short><ImgDoc blocks={[{ t: 'img', src: 'dog.jpg', alt: shown, k: 'dog' }]} /></PetBrowser>
            <Reader text={shown} on={!!shown} />
            <KzCode cls="kz-code-sm" lines={[{ k: 'i', d: 0, cls: 'is-hl', parts: [
              <OpenImg key="oi" sp />, <Attr key="s" n="src" v="dog.jpg" />, '\u00A0',
              <span key="an" className="l5-attr"><span className="l5-an">alt</span><span className="l5-eq">=</span><span className="l5-av">"</span></span>,
              <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={40} /></span>,
              <span key="q" className="l5-attr"><span className="l5-av">"</span></span>, <Gt key="gt" />] }]} />
          </div>
        </div>
        <ReadyBtn on={canTap && ready} glow={canTap && ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S11. ХОРОШИЙ alt — для фото попугая (потом рыбки) три описания; ученик
// выбирает, программа чтения «читает» выбранное. Неверное гаснет с причиной.
// =============================================================================
function S11({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? c.rounds.length - 1 : 0);
  const [off, setOff] = useState([]);
  const [got, setGot] = useState(solved);
  const [read, setRead] = useState(null);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const doneAll = solved || (got && ri === c.rounds.length - 1);
  const canGo = useAdvanceGate(doneAll, spoken);
  const stats = useRef([]);
  const led = useIdleLed(canTap && !got, ri * 10 + off.length);
  const R = c.rounds[ri];
  const choose = (o) => {
    if (!canTap || got || off.indexOf(o.id) >= 0) return;
    setRead(pick(o.t));
    if (!o.right) { sfx('soft', true); setOff(off.concat(o.id)); setMsg(o.why); sayNow(o.why, 'think'); return; }
    sfx('win', true); setGot(true); setMsg(null);
    stats.current.push({ ri, firstTry: off.length === 0, attempts: off.length + 1 });
    if (ri === c.rounds.length - 1) {
      put({ done: true });
      stats.current.forEach((s) => log({ screenId: 's11.r' + (s.ri + 1), type: 'good-alt', correct: true, firstTry: s.firstTry, attempts: s.attempts }));
      sayNow(joinL(c.ok, c.done), 'smile');
      return;
    }
    sayNow(c.ok, 'smile');
  };
  useEffect(() => {
    if (!got || ri >= c.rounds.length - 1 || !spoken) return undefined;
    const t = setTimeout(() => { setRi(ri + 1); setGot(false); setOff([]); setRead(null); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1000);
    return () => clearTimeout(t);
  }, [got, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const right = R.opts.find((o) => o.right);
  const altNow = got ? pick(right.t) : null;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.askQ} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={doneAll ? c.done : c.askQ} hint={doneAll ? null : msg} n={doneAll ? null : (ri + 1) + '/' + c.rounds.length} />
        <div className="kz-scene kz-scene-col l5-s11" key={'r' + ri}>
          <div className="kz-col">
            <div className="l5-s11-top">
              <PetBrowser short><ImgDoc blocks={[{ t: 'img', src: R.file, alt: altNow || undefined, k: 'i' }]} /></PetBrowser>
              <Reader text={read} on={!!read} />
            </div>
            <KzCode cls="kz-code-sm" lines={[{ k: 'i', d: 0, cls: got ? 'is-new' : 'is-hl', parts: imgParts(R.file, altNow || '…', { altCls: 'is-hl' }) }]} />
            <div className="kz-quiz l5-quiz">
              {R.opts.map((o) => (
                <button key={o.id} type="button" disabled={!canTap || got || off.indexOf(o.id) >= 0} onClick={() => choose(o)}
                  className={'kz-btn ' + (got && o.right ? 'is-ok' : off.indexOf(o.id) >= 0 ? 'is-off' : 'is-ghost')}>
                  <span translate={o.id === 'num' || o.id === 'file' ? 'no' : undefined}>{pick(o.t)}</span><Led on={led && !got && off.indexOf(o.id) < 0} />
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
// S12. КАРТИНКА ПО ЧАСТЯМ — показ: части тега <img src="parrot.png" alt="…">
// появляются по очереди, Коди проходит по ним (img, src, alt, «>» — без пары);
// потом атрибуты сами меняются местами: картинка та же. После показа можно
// нажать часть — Коди повторит её объяснение.
// =============================================================================
const PARTS12 = ['open', 'src', 'alt', 'gt'];
function S12({ p }) {
  const pick = usePick();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? PARTS12.length : -1);
  const [swapped, setSwapped] = useState(solved);
  const WALK = PARTS12.map((k) => ({ text: c.parts[k], pose: 'point', k }));
  const ORDER = WALK.map((w) => ({ text: w.text, pose: w.pose })).concat([{ text: c.sayOrder, pose: 'wonder' }, { text: c.tapSay, pose: 'curious' }]);
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
  useEffect(() => { if (speaker.text === c.sayOrder && !swapped) { sfx('pop', true); setSwapped(true); } }, [speaker.text]); // eslint-disable-line react-hooks/exhaustive-deps
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const explore = solved || demo.done;
  const [picked, setPicked] = useState(null);
  const pickPart = (k) => { if (!explore || !k) return; sfx('tap', true); setPicked(k); sayNow(c.parts[k], 'point'); };
  const walkNow = spoken || picked ? null : WALK.find((w) => w.text === speaker.text);
  const cur = picked || (walkNow ? walkNow.k : read >= 0 && read < PARTS12.length ? PARTS12[read] : null);
  const ledPart = useIdleLed(explore && !picked, 0);
  const alt = pick(PETS.parrot.short);
  const shown = (k) => read >= PARTS12.indexOf(k);
  const part = (k, node) => (shown(k) ? (
    <button key={k} type="button" className={'l5-part l5-part-' + k + (cur === k ? ' is-on' : '') + (read === PARTS12.indexOf(k) && !solved ? ' kz-a-stamp' : '')}
      disabled={!explore} onClick={() => pickPart(k)} aria-label={pick(c.parts[k])}>{node}{k === 'open' ? <Led on={ledPart} /> : null}</button>
  ) : <span key={k} className="l5-part is-ghost">{node}</span>);
  const tk = (s, n) => <span className={n ? 'kz-tk-n' : 'kz-tk-b'}>{s}</span>;
  const aSrc = part('src', <span className="l5-attr"><span className="l5-an">src</span><span className="l5-eq">=</span><span className="l5-av">"parrot.png"</span></span>);
  const aAlt = part('alt', <span className="l5-attr"><span className="l5-an">alt</span><span className="l5-eq">=</span><span className="l5-av">{'"' + alt + '"'}</span></span>);
  const line = (
    <div className="kz-code l5-walk" translate="no">
      <div className={'kz-line l5-walk-line' + (swapped && speaker.text === c.sayOrder ? ' is-new' : '')}>
        <span className="kz-tag">
          {part('open', <>{tk('<')}{tk('img', true)}</>)}{' '}
          {swapped ? aAlt : aSrc}{' '}{swapped ? aSrc : aAlt}
          {part('gt', tk('>'))}
        </span>
      </div>
    </div>
  );
  const askText = read < 0 ? c.ask : explore ? c.askTap : c.askDone;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={askText} />
        <div className={'kz-scene kz-scene-col l5-s12' + (explore ? ' is-explore' : '')}>
          <div className="kz-col">
            {line}
            <div className="l5-s12-row">
              <PetBrowser short><ImgDoc blocks={[{ t: 'img', src: 'parrot.png', alt, k: 'i', hl: cur === 'open' || cur === 'gt' }]} /></PetBrowser>
              <div className="l5-s12-side">
                <FileCard file="parrot.png" i={2} hl={cur === 'src'} />
                <Reader text={alt} on={cur === 'alt'} />
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S13. СВОЯ КАРТИНКА — ученик пишет тег целиком: <img src="fish.jpg" alt="…">.
// Строка с попугаем выше — образец. Окно меняется сразу; проверка — по
// «Проверить»; своё описание уходит в итог урока и в артефакт.
// =============================================================================
function S13({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s13;
  const [rec, put] = useRec('s13');
  const solved = !!(rec && rec.done);
  const mine = store.get('myFishAlt') || '';
  const ty = useTagTyping({ max: 80 });
  useEffect(() => { if (solved && mine) ty.setVal('<img src="fish.jpg" alt="' + mine + '">'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
    const r = imgIssue(ty.val, 'fish.jpg', c.msgs);
    if (!r.msg) {
      store.set('myFishAlt', r.alt);
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's13', type: 'write-img-tag', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(r.msg); sayNow(r.msg, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const sampleAlt = pick(PETS.parrot.short);
  const typed = typedImgBlocks(ty.val);
  const altNow = (typed.find((b) => b.t === 'img') || {}).alt;
  const blocks = [{ t: 'img', src: 'parrot.png', k: 'pa' }].concat(typed);
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage kz-typed">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <PetBrowser short pageHl={!okNow}><ImgDoc blocks={blocks} /></PetBrowser>
            <Reader text={altNow || (okNow ? mine : '')} on={!!altNow} />
            <KzCode cls="kz-code-sm" lines={[
              { k: 's', d: 0, cls: 'l5-sample' + (lad.lv >= 3 ? ' is-say' : ''), parts: imgParts('parrot.png', sampleAlt) },
              { k: 'm', d: 0, cls: okNow ? 'is-new' : 'is-hl', parts: [
                <span key="g" className={'kz-gap l5-gap-wide' + (led ? ' kz-gap-led' : '')}>
                  <InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={80} cls="kz-tag-in" />
                </span>] }
            ]} />
          </div>
        </div>
        {!okNow ? <KeyRow keys={['<img ', 'src', 'alt', '=', '"', '>', 'fish.jpg']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 22} /> : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// S14. ПОЧЕМУ НЕТ КАРТИНКИ? — тег с одной ошибкой; браузер честно её
// показывает (нет src — только текст alt; нет файла — сломанная картинка).
// Нажать ошибочную часть тега: верно — часть чинится, фото появляется. Не та
// часть — вздрагивает, Коди подсказывает смотреть в окно; промах — ещё раунд.
// =============================================================================
const S14_ROUNDS = [
  { type: 'name', n: 'scr', v: 'cat.jpg', pet: 'cat' },
  { type: 'val', n: 'src', v: 'dgo.jpg', fix: 'dog.jpg', pet: 'dog' },
  { type: 'href', n: 'href', v: 'fish.jpg', pet: 'fish' }
];
const S14_EXTRA = [
  { type: 'name', n: 'sr', v: 'parrot.png', pet: 'parrot' },
  { type: 'val', n: 'src', v: 'cat.png', fix: 'cat.jpg', pet: 'cat' },
  { type: 'href', n: 'href', v: 'dog.jpg', pet: 'dog' }
];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [queue, setQueue] = useState(() => (solved ? [] : [0, 1, 2].map((i) => ({ i }))));
  const [doneN, setDoneN] = useState(0);
  const [fixed, setFixed] = useState(false);
  const [shake, setShake] = useState(null);
  const [missed, setMissed] = useState(false);
  const [pending, setPending] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }]
    : [{ text: c.say, pose: 'embarrassed' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || !queue.length, spoken);
  const stats = useRef([]);
  const round = queue[0] || null;
  const lastRef = useRef(null);
  if (round) lastRef.current = round;
  const shownRd = round || (fixed ? lastRef.current : null);
  const R = shownRd ? (shownRd.extra ? S14_EXTRA : S14_ROUNDS)[shownRd.i] : null;
  const led = useIdleLed(canTap && !!round && !fixed, doneN * 10 + (missed ? 1 : 0));
  const bad = R ? (R.type === 'val' ? 'v' : 'n') : null;
  const tap = (k) => {
    if (!canTap || !round || fixed) return;
    if (k !== bad) {
      sfx('soft', true); setShake(k); setTimeout(() => setShake(null), 520);
      setMissed(true); sayNow(c.fine, 'think');
      return;
    }
    sfx('ok', true); setFixed(true);
    stats.current.push({ i: round.i, extra: !!round.extra, right: !missed });
    const rest = queue.slice(1);
    if (missed && !round.extra) rest.push({ i: round.i, extra: true });
    const line = c.ok[R.type];
    if (!rest.length) {
      [0, 1, 2].forEach((ii) => {
        const f = stats.current.find((x) => x.i === ii && !x.extra);
        const e = stats.current.find((x) => x.i === ii && x.extra);
        log({ screenId: 's14.r' + (ii + 1), type: 'find-img-bug', correct: true, firstTry: !!(f && f.right), attempts: e ? 2 : 1, helped: !!(f && !f.right), followUp: e ? e.right : null });
      });
      put({ done: true }); setQueue([]);
      sayNow(joinL(line, c.done), 'smile');
      return;
    }
    sayNow(line, 'smile');
    setPending(rest);
  };
  useEffect(() => {
    if (!pending || !spoken) return undefined;
    const t = setTimeout(() => { setQueue(pending); setPending(null); setDoneN((d) => d + 1); setFixed(false); setMissed(false); sayNow(c.askQ, 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [pending, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const n = R ? (fixed ? 'src' : R.n) : 'src';
  const v = R ? (fixed && R.fix ? R.fix : R.v) : '';
  const alt = R ? pick(ALT_SHORT[R.pet]) : '';
  const tp = (k, node) => (
    <button key={k} type="button" className={'l5-part l5-bug-' + k + (shake === k ? ' kz-a-shake' : '') + (fixed && k === bad ? ' is-fixed kz-a-stamp' : '')}
      disabled={!canTap || fixed || !round} onClick={() => tap(k)}>{node}</button>
  );
  const tk = (s, nn) => <span className={nn ? 'kz-tk-n' : 'kz-tk-b'}>{s}</span>;
  const src = n === 'src' ? v : undefined;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={round ? c.askQ : c.done} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col l5-s14" key={'r' + doneN}>
            <div className="kz-col">
              <PetBrowser short cls={fixed ? '' : 'l5-broken-br'}><ImgDoc blocks={[{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' }, { t: 'img', src, alt, k: 'i' }]} /></PetBrowser>
              <div className="kz-code l5-walk l5-bugline" translate="no">
                <div className="kz-line is-hl kz-a-drop">
                  <span className="kz-tag">
                    {tp('o', <>{tk('<')}{tk('img', true)}</>)}{' '}
                    <span className="l5-attr">{tp('n', <span className="l5-an">{n}</span>)}<span className="l5-eq">=</span>{tp('v', <span className="l5-av">{'"' + v + '"'}</span>)}</span>{' '}
                    {tp('a', <span className="l5-attr"><span className="l5-an">alt</span><span className="l5-eq">=</span><span className="l5-av">{'"' + alt + '"'}</span></span>)}
                    {tp('g', tk('>'))}
                  </span>
                  <Led on={led} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Sheet>
    </Stage>
  );
}

// =============================================================================
// Q1. ПРОВЕРЬ СЕБЯ — новая страница «Живой уголок» без образца: две картинки
// с alt, но без src. Наклейки src="fish.jpg", href="parrot.png" (лишняя) и
// src="parrot.png". Ученик сам решает, какую куда. Не туда — браузер честно на
// миг показывает, что вышло (не то фото / только текст alt).
// =============================================================================
const Q1_STK = [{ id: 'sf', n: 'src', v: 'fish.jpg' }, { id: 'hp', n: 'href', v: 'parrot.png' }, { id: 'sp', n: 'src', v: 'parrot.png' }];
const Q1_WANT = { p: 'sp', f: 'sf' };
const Q1_ALT = { p: PETS.parrot.short, f: PETS.fish.short };
function Q1({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.q1;
  const [rec, put] = useRec('q1');
  const solved = !!(rec && rec.done);
  const [slots, setSlots] = useState(solved ? Object.assign({}, Q1_WANT) : { p: null, f: null });
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [peek, setPeek] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = !!(slots.p && slots.f);
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const peekT = useRef(0);
  useEffect(() => () => clearTimeout(peekT.current), []);
  const nFull = (slots.p ? 1 : 0) + (slots.f ? 1 : 0);
  const led = useIdleLed(canTap && !done, nFull + (sel ? 10 : 0));
  const stkOf = (id) => Q1_STK.find((x) => x.id === id);
  const place = (id, where) => {
    if (!canTap || done || !id || !where || slots[where]) return false;
    st.current.tries += 1;
    if (Q1_WANT[where] !== id) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      clearTimeout(peekT.current); setPeek({ where, id }); peekT.current = setTimeout(() => setPeek(null), 1900);
      const m = stkOf(id).n === 'href' ? c.why.href : c.why.swap;
      setMsg(m); setSel(null); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true);
    const ns = Object.assign({}, slots, { [where]: id });
    setSlots(ns); setSel(null); setMsg(null); setPeek(null);
    if (ns.p && ns.f) {
      put({ done: true });
      log({ screenId: 'q1', type: 'give-src', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
    }
    return true;
  };
  const dnd = useKzDrag((id, where) => place(id, where));
  const pickSlot = (where) => { if (!sel) { setMsg(c.pickFirst); return; } place(sel, where); };
  const lit = lad.lv >= 3;
  const nextWhere = !slots.p ? 'p' : 'f';
  const idAt = (where) => slots[where] || (peek && peek.where === where ? peek.id : null);
  const srcAt = (where) => { const id = idAt(where); const s = id ? stkOf(id) : null; return s && s.n === 'src' ? s.v : undefined; };
  const blocks = [{ t: 'h1', s: pick(PAGES.corner.title), k: 'h' }].concat(['p', 'f'].map((w) => ({ t: 'img', src: srcAt(w), alt: pick(Q1_ALT[w]), k: w, hl: !!(peek && peek.where === w) })));
  const slot = (where) => (
    <button key={'s' + where} type="button" data-place={where} disabled={!canTap || done || !!slots[where]} onClick={() => pickSlot(where)}
      className={'l5-spot' + (dnd.hover === where ? ' is-hover' : '') + (dnd.active || sel ? ' is-call' : '')}>
      <Led on={(led && !!sel) || (lit && where === nextWhere)} />
    </button>
  );
  const lineOf = (where) => {
    const id = idAt(where);
    const s = id ? stkOf(id) : null;
    const attr = s ? <Attr n={s.n} v={s.v} cls={slots[where] ? 'kz-a-stamp' : 'l5-peek'} /> : slot(where);
    return { k: where, d: 0, cls: slots[where] ? 'is-new' : '', parts: [<OpenImg key="oi" sp />, <React.Fragment key="at">{attr}</React.Fragment>, '\u00A0', <Attr key="alt" n="alt" v={pick(Q1_ALT[where])} />, <Gt key="gt" />] };
  };
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} n={done ? null : nFull + '/2'} />
        <div className={'kz-scene kz-scene-col l5-q1' + (dnd.active || sel ? ' is-dragging' : '')}>
          <div className="kz-col">
            <PetBrowser short title={pick(PAGES.corner.title)} url="corner.html" pageHl={!!peek}><ImgDoc blocks={blocks} /></PetBrowser>
            <KzCode cls="kz-code-sm" lines={[lineOf('p'), lineOf('f')]} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {Q1_STK.map((s, i) => ((slots.p === s.id || slots.f === s.id) ? null : (
              <button key={s.id} type="button" disabled={!canTap} data-id={s.id}
                className={'kz-scrap kz-scrap-tag l5-sticker' + (sel === s.id ? ' is-sel' : '') + (shake === s.id ? ' kz-a-shake' : '') + (lit && s.id === Q1_WANT[nextWhere] ? ' is-led' : '')}
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
// Q2. ЧТО ДЕЛАЕТ alt? — три варианта, верный не первый. До первой попытки
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
      log({ screenId: 'q2', type: 'what-alt', correct: true, firstTry: off.length === 0 && lad.asked.current === 0, attempts: off.length + 1, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'smile');
      return;
    }
    sfx('soft', true); setOff(off.concat(o.id)); setMsg(o.why); sayNow(o.why, 'think');
    if (off.length + 1 >= 2) lad.bump();
  };
  const lit = lad.lv >= 3;
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="l5-sheetpage">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} />
        <div className="kz-scene kz-scene-col kz-q2">
          <div className="kz-col">
            <KzCode cls="kz-code-sm" lines={[{ k: 'l', d: 0, cls: 'kz-slip', parts: imgParts('cat.jpg', pick(PETS.cat.alt), { altCls: 'is-hl' }) }]} />
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
// S15. ВЫВОД — страница питомцев с фото (кот, собака, рыбка ученика); под ней —
// его тег картинки, программа чтения произносит его описание. Роли img, src,
// alt загораются, пока Коди их называет. Единственный праздник урока.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const store = useStore();
  const c = C.s15;
  const fishAlt = store.get('myFishAlt') || pick(PETS.fish.short);
  const dogAlt = store.get('myAlt') || pick(PETS.dog.alt);
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'wonder' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const blocks = [{ t: 'h1', s: pick(PAGES.pets.title), k: 'h' },
    { t: 'img', src: 'cat.jpg', alt: pick(PETS.cat.alt), k: 'c', hl: curK === 'img' }, { t: 'img', src: 'dog.jpg', alt: dogAlt, k: 'd', hl: curK === 'img' },
    { t: 'img', src: 'fish.jpg', alt: fishAlt, k: 'f', hl: curK === 'img' }];
  return (
    <Stage voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="l5-sheetpage">
        <div className="kz-scene kz-s15 l5-s15">
          <div className="kz-col kz-s15-left">
            <PetBrowser><ImgDoc blocks={blocks} anim /></PetBrowser>
            <KzCode cls="kz-code-sm" lines={[{ k: 'm', d: 0, cls: 'kz-slip' + (curK === 'img' ? ' l5-hl-img' : ''), parts: imgParts('fish.jpg', fishAlt, { srcCls: curK === 'src' ? 'is-hl' : '', altCls: curK === 'alt' ? 'is-hl' : '' }) }]} />
            <Reader text={fishAlt} on={curK === 'alt'} />
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['img', 'src', 'alt'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k ? ' is-on' : '')} style={{ '--c': k === 'img' ? KZ.coral : k === 'src' ? KZ.teal : KZ.mustard }}>
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
// «Повторить» стирает только экран; описания ученика (myAlt, myFishAlt) остаются.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — страница питомцев с картинками и описаниями ученика.
function lesson5Artifact(store) {
  const d = store.get('myAlt'), f = store.get('myFishAlt');
  if (!d && !f) return null;
  const tag = (src, alt) => '    <img src="' + src + '" alt="' + escHtml(alt || '') + '">';
  return { type: 'html-page', title: 'pets.html', text: [d, f].filter(Boolean).join(' · '), images: [{ src: 'dog.jpg', alt: d || '' }, { src: 'fish.jpg', alt: f || '' }],
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>pets.html</title>', '  </head>', '  <body>',
      tag('dog.jpg', d), tag('fish.jpg', f), '  </body>', '</html>'].join('\n') };
}

export default function HtmlIzobrazheniya({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson5Artifact(store) })
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
