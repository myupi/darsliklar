// =============================================================================
// ЭКРАНЫ УРОКА 5 «Изображения» (облик «Редактор»). Сделаны с нуля; основа кода — экраны уроков 2–4.
// Типы заданий — по разделу 3а навыка: s3 вписать — s4 строка кода ↔ картинка; s6 собрать код — s7 найти пару;
// s9 вписать — s10 до и после; s12, s13 живое превью — s14 починить; q1 найти ошибку — q2 верно или нет.
// Честный браузер: img без src — ничего (есть alt — только текст alt); есть файл — картинка; нет такого
// файла — значок сломанной картинки и текст alt (без alt — один значок); img без закрывающего тега.
// Бумаги нет нигде.
// =============================================================================
const normT = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

// РИСУНКИ-«ФОТО» — файлы картинок на «диске» сайта. Плоские, в цветах облика.
const PicOsh = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FDE8C8" />
    <ellipse cx="80" cy="74" rx="62" ry="22" fill="#fff" /><ellipse cx="80" cy="70" rx="48" ry="16" fill="#F6E7B9" />
    <path d="M40 70 Q80 30 120 70 Z" fill="#F3DB9A" />
    {[[60, 58], [72, 50], [86, 52], [98, 60], [78, 62], [66, 66], [92, 66]].map(([x, y], i) => <rect key={i} x={x} y={y} width="9" height="3.5" rx="1.7" fill="#F28C28" transform={'rotate(' + (i * 25) + ' ' + x + ' ' + y + ')'} />)}
    {[[70, 56], [88, 58], [80, 48]].map(([x, y], i) => <circle key={'m' + i} cx={x} cy={y} r="4.5" fill="#8B5A3C" />)}
  </svg>
);
const PicMushuk = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#DCEFF5" />
    <path d="M52 44 L58 18 L74 36 Z M108 44 L102 18 L86 36 Z" fill="#F29A4A" /><circle cx="80" cy="60" r="34" fill="#F29A4A" />
    <circle cx="68" cy="56" r="5" fill="#1F2937" /><circle cx="92" cy="56" r="5" fill="#1F2937" /><path d="M76 68 L84 68 L80 73 Z" fill="#E86A86" />
    <path d="M58 70 H40 M58 75 H42 M102 70 H120 M102 75 H118" stroke="#7C4A1E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const PicTop = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#D8F0DC" /><rect y="80" width="160" height="30" rx="0" fill="#9ED7A6" />
    <circle cx="80" cy="58" r="30" fill="#fff" stroke="#1F2937" strokeWidth="2" />
    <path d="M80 44 L92 53 L87 67 L73 67 L68 53 Z" fill="#1F2937" />
    <path d="M80 44 V30 M92 53 L106 48 M87 67 L95 80 M73 67 L65 80 M68 53 L54 48" stroke="#1F2937" strokeWidth="2" />
  </svg>
);
const PicGul = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FCE4EC" />
    <path d="M80 62 V100" stroke="#3F9A58" strokeWidth="4" strokeLinecap="round" /><path d="M80 86 Q96 76 104 84 Q92 92 80 86 Z" fill="#5BB46F" />
    {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx="80" cy="34" rx="10" ry="18" fill="#F06292" transform={'rotate(' + a + ' 80 52)'} />)}
    <circle cx="80" cy="52" r="10" fill="#FDD835" />
  </svg>
);
// Картинки, которых нет среди наших файлов: лежат только на сайте в интернете (w1–w3).
const PicQuyosh = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#DCEFF5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="78" y="12" width="4" height="12" rx="2" fill="#F5B400" transform={'rotate(' + a + ' 80 44)'} />)}
    <circle cx="80" cy="44" r="16" fill="#FDD835" />
    <path d="M0 92 Q40 70 80 88 Q120 104 160 82 V110 H0 Z" fill="#9ED7A6" /><path d="M0 100 Q50 86 100 98 Q130 104 160 96 V110 H0 Z" fill="#6CC27A" />
  </svg>
);
const PicOlma = () => (
  <svg viewBox="0 0 160 110" aria-hidden="true"><rect width="160" height="110" rx="6" fill="#FFF4D6" />
    <path d="M80 36 C60 24 40 40 44 64 C48 88 66 98 80 92 C94 98 112 88 116 64 C120 40 100 24 80 36 Z" fill="#E53935" />
    <path d="M80 36 V22" stroke="#7C4A1E" strokeWidth="3" strokeLinecap="round" /><path d="M82 26 Q96 16 104 24 Q92 32 82 26 Z" fill="#5BB46F" />
    <ellipse cx="64" cy="54" rx="5" ry="9" fill="#fff" opacity=".35" />
  </svg>
);
const PICS = { 'osh.jpg': PicOsh, 'mushuk.jpg': PicMushuk, 'top.jpg': PicTop, 'gul.jpg': PicGul };
const WEB_HOST = 'kodi.uz';
const WEB_PICS = { 'quyosh.jpg': PicQuyosh, 'olma.jpg': PicOlma };
// Честно, как браузер: имя файла — ищем среди своих; https:// (и http://) с именем сайта — берём с сайта.
const picOf = (src) => {
  const k = String(src || '').trim().toLowerCase();
  const m = /^https?:\/\/([^/]+)\/([^/]+)$/.exec(k);
  if (m) return m[1] === WEB_HOST ? WEB_PICS[m[2]] || null : null;
  return PICS[k] || null;
};
const IMG_FILES = ['osh.jpg', 'mushuk.jpg', 'top.jpg'];
const OWN_FILES = ['mushuk.jpg', 'top.jpg', 'gul.jpg'];

// Картинка честно, как в браузере. src: имя файла или null (атрибута нет).
function ImgEl({ src, alt, hl, tap, led, cls }) {
  const P = src ? picOf(src) : null;
  const body = P ? <span className="z5-pic"><P /></span>
    : src ? <span className="z5-broken"><i className="z5-broken-ic" aria-hidden="true" />{alt ? <span className="z5-alt">{alt}</span> : null}</span>
      : alt ? <span className="z5-alt z5-alt-only">{alt}</span> : <span className="z5-none" aria-hidden="true" />;
  const c = 'z5-imgbox' + (hl ? ' is-hl' : '') + (cls ? ' ' + cls : '');
  if (tap !== undefined) return <button type="button" className={c + ' z5-map'} disabled={!tap} onClick={tap || undefined}>{body}<Led on={!!led} /></button>;
  return <span className={c}>{body}</span>;
}

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
// Страница: блоки { t: 'h1' | 'p' | 'img' | 'imgs', parts | src/alt | items, hl, k, cls }.
// 'imgs' — несколько картинок в строку (img — строчный элемент: картинки встают рядом).
function PageDoc({ blocks, cls }) {
  const ref = useFitPage(JSON.stringify(blocks.map((b) => [b.t, b.k, b.cls, b.hl, b.src, b.alt, b.parts, (b.items || []).map((x) => [x.src, x.alt, x.hl, !!x.tap])])));
  return (
    <div ref={ref} className={'z5-doc' + (cls ? ' ' + cls : '')}>
      {blocks.map((bk, i) => {
        const c = 'z5-blk z5-' + bk.t + (bk.hl && bk.t !== 'img' ? ' is-hl' : '') + (bk.cls ? ' ' + bk.cls : '');
        if (bk.t === 'img') return <div key={bk.k || i} className={c}><ImgEl src={bk.src} alt={bk.alt} hl={bk.hl} /></div>;
        if (bk.t === 'imgs') return <div key={bk.k || i} className={c}>{bk.items.map((it, j) => <ImgEl key={j} {...it} />)}</div>;
        return <div key={bk.k || i} className={c}>{bk.parts}</div>;
      })}
    </div>
  );
}
const Br = ({ title, short, cls, children, url }) => <PaperBrowser title={title} url={url} short={short} cls={'z5-br' + (cls ? ' ' + cls : '')}>{children}</PaperBrowser>;
// Строка кода <img …>. attrs — [{ n: 'src' | 'alt' | 'href' | '', v }].
// Каждый атрибут — свой кусок (класс z5-att даёт отступ-пробел): длинная строка переносится между
// атрибутами, а не обрезается на телефоне.
// Значение: у полного адреса части отдельно — https://, имя сайта, /файл (lit — какая горит).
const srcVal = (v, lit) => {
  const m = /^(https?:\/\/)([^/]*)(\/.*)?$/.exec(v);
  if (!m) return <span className="z5-val">{'"' + v + '"'}</span>;
  const u = (t, k) => <span className={'z5-u' + (lit === k ? ' is-cur' : '')}>{t}</span>;
  return <span className="z5-val">"{u(m[1], 'proto')}{u(m[2], 'host')}{m[3] ? u(m[3], 'file') : null}"</span>;
};
const attrSpan = (n, v, k, last, lit) => <span key={k} className="kz-tag z5-att" translate="no"><span className="z5-attr">{n}</span><span className="kz-tk-b">=</span>{srcVal(v, lit)}{last ? <span className="kz-tk-b">{'>'}</span> : null}</span>;
const imgCode = (attrs) => [<span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">img</span>{attrs.length ? null : <span className="kz-tk-b">{'>'}</span>}</span>]
  .concat(attrs.map((a, j) => attrSpan(a.n, a.v, 'a' + j, j === attrs.length - 1, a.lit)));
const tagOpen = () => <span key="o" className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span><span className="kz-tk-n">img</span></span>;
const tagClose = (k) => <span key={k || 'c'} className="kz-tag" translate="no"><span className="kz-tk-b">{'>'}</span></span>;
const attrOpen = (n, k) => <span key={k || 'ao'} className="kz-tag z5-att" translate="no"><span className="z5-attr">{n}</span><span className="kz-tk-b">=</span><span className="z5-val">"</span></span>;
const attrClose = (k) => <span key={k || 'ac'} className="kz-tag" translate="no"><span className="z5-val">"</span></span>;
const codeLine = (k, parts, extra) => Object.assign({ k, d: 0, place: k, parts }, extra || {});
const textLine = (k, t, w, extra) => codeLine(k, [T_(t), W_(w), T_(t, true)], extra);
const FilesPanel = ({ files, hl }) => {
  const pick = usePick();
  return (
    <div className="z5-files" aria-label={pick(C.site.filesH)}>
      <span className="z5-files-h">{pick(C.site.filesH)}</span>
      {files.map((f) => { const P = PICS[f]; return <span key={f} className={'z5-file' + (hl === f ? ' is-hl' : '')} translate="no">{P ? <span className="z5-thumb"><P /></span> : null}{f}</span>; })}
    </div>
  );
};
const TagChip = ({ t, cls, on }) => <span className={'z5-chip' + (on ? ' is-on' : '') + (cls ? ' ' + cls : '')} translate="no">{t}</span>;
function fileIssue(v, ok, msgs) {
  const n = normT(v).replace(/^["'«“]+|["'»”]+$/g, '');
  if (ok.indexOf(n) >= 0) return null;
  if (!n) return msgs.empty;
  if (n.indexOf('.') < 0) return msgs.noExt;
  if (PICS[n]) return msgs.other;
  return msgs.typo;
}
const cleanV = (v) => String(v || '').trim().replace(/^["']+|["']+$/g, '');

// =============================================================================
// S1. КРЮЧОК — страница рецепта плова: один текст, без фото. «Превратить»: на странице появляется
// фотография плова. Загадка: Коди написал картинке href, как у ссылки.
// =============================================================================
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
  const blocks = [{ t: 'h1', parts: pick(C.site.osh), k: 'h' }].concat(on ? [{ t: 'img', src: 'osh.jpg', k: 'i', cls: 'z5-a-in', hl: speaker.text === c.magic }] : [], [{ t: 'p', parts: pick(C.site.oshText), k: 'p' }]);
  return (
    <StageB eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={on ? c.askDone : c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={on ? c.askDone : c.ask} />
        <div className="kz-scene z5-s1">
          <div className="kz-stagebox z5-s1-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim={!solved} wave={on} /></div></div>
          <div className="kz-col z5-s1-page"><Br title={pick(C.site.osh)} url="osh.html"><PageDoc blocks={blocks} /></Br></div>
        </div>
        {!on ? <div className="kz-row"><button type="button" className="kz-btn is-coral" disabled={!canTap} onClick={turn}>{pick(UI.turn)}<Led on={led} /></button></div> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S2. ТЕГ img И АТРИБУТ src (показ) — в коде появляется <img> — в окне пусто; добавляется src="osh.jpg" —
// появляется фото; закрывающего тега у img нет.
// =============================================================================
function S2({ p }) {
  const pick = usePick();
  const c = C.s2;
  const [rec, put] = useRec('s2');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 2 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const codeRef = useRef(null);
  const line = () => codeRef.current && codeRef.current.querySelector('[data-place="i"]');
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('pop', true); setN(1); } },
    { say: [{ text: c.sayImg, pose: 'think' }] },
    { look: line, act: () => { sfx('ok', true); setN(2); } },
    { say: [{ text: c.sayRest, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const lines = [textLine('h', 'h1', pick(C.site.osh), { cls: 'z5-edge' })].concat(n >= 1 ? [codeLine('i', n >= 2 ? imgCode([{ n: 'src', v: 'osh.jpg' }]) : imgCode([]), { cls: 'is-new' + (speaker.text === c.sayRest ? ' is-read' : '') })] : [],
    [textLine('p', 'p', pick(C.site.oshText), { cls: 'z5-ctx' })]);
  const blocks = [{ t: 'h1', parts: pick(C.site.osh), k: 'h' }].concat(n >= 1 ? [{ t: 'img', src: n >= 2 ? 'osh.jpg' : null, k: 'i', hl: true, cls: n >= 2 ? 'z5-a-in' : '' }] : [], [{ t: 'p', parts: pick(C.site.oshText), k: 'p' }]);
  const askText = solved || demo.done ? c.askDone : n >= 2 ? c.askSrc : c.askImg;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z5-s5">
          <div className="kz-col" ref={codeRef}><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.osh)} url="osh.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S3. ВПИШИ ФАЙЛ (Fill in the Blanks) — на странице игр нужна картинка мяча. Ученик пишет имя файла из
// панели «Файлы»; браузер сразу показывает, что написано (нет такого файла — сломанная картинка).
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
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const val = okNow ? 'top.jpg' : cleanV(ty.val);
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = fileIssue(ty.val, ['top.jpg'], c.msgs);
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's3', type: 'write-src', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'h1', parts: pick(C.site.games), k: 'h' }, { t: 'img', src: val || null, k: 'i', hl: !okNow }, { t: 'p', parts: pick(C.site.gamesText), k: 'p' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.games)} url="oyinlar.html" short><PageDoc blocks={blocks} /></Br>
            <div className="z5-codecol">
              <KzCode lines={[textLine('h', 'h1', pick(C.site.games), { cls: 'z5-ctx' }),
                okNow ? codeLine('i', imgCode([{ n: 'src', v: 'top.jpg' }]), { cls: 'is-new' }) : codeLine('i', [tagOpen(), attrOpen('src'),
                  <span key="g" className={'kz-gap z5-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={20} /></span>,
                  attrClose(), tagClose()], { cls: 'is-hl' })]} cls="kz-code-sm" />
              <FilesPanel files={IMG_FILES} hl={lad.lv >= 3 ? 'top.jpg' : null} />
            </div>
          </div>
        </div>
        {!okNow ? <KeyRow keys={['.jpg']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S4. КОД ↔ КАРТИНКА (Visual Code Mapping) — галерея из трёх картинок в строку; в коде загорается строка —
// ученик нажимает картинку, которую она рисует. Раунд 2: Коди поменял строки местами — картинки тоже
// переставились. Раунд 3: в строке опечатка — нужно нажать сломанную картинку.
// =============================================================================
const S4_ROUNDS = [
  { files: ['mushuk.jpg', 'top.jpg', 'osh.jpg'], hl: 1 },
  { files: ['osh.jpg', 'mushuk.jpg', 'top.jpg'], hl: 2 },
  { files: ['mushk.jpg', 'top.jpg', 'osh.jpg'], hl: 0 }
];
function S4({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s4;
  const [rec, put] = useRec('s4');
  const solved = !!(rec && rec.done);
  const [ri, setRi] = useState(solved ? 2 : 0);
  const [ans, setAns] = useState(solved ? 2 : null);
  const [misses, setMisses] = useState(0);
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }, { text: c.askQ, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ri === 2 && ans === S4_ROUNDS[2].hl;
  const canGo = useAdvanceGate(solved || done, spoken);
  const [next, setNext] = useState(false);
  const led = useIdleLed(canTap && ans === null, ri);
  const R = S4_ROUNDS[ri];
  const [msg, setMsg] = useState(null);
  const tap = (j) => {
    if (!canTap || ans === R.hl) return;
    if (j !== R.hl) {
      sfx('soft', true); setMisses((m) => m + 1); setAns(j);
      const m = ri === 2 ? c.miss.broken : c.miss.order;
      setMsg(m); sayNow(m, 'rule');
      return;
    }
    sfx('ok', true); setAns(j); setMsg(null);
    if (ri === 2) {
      put({ done: true });
      log({ screenId: 's4', type: 'map-img', correct: true, firstTry: misses === 0, attempts: misses + 3 });
      sayNow(joinL(c.ok[ri], c.done), 'smile');
    } else { sayNow(c.ok[ri], 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setRi((x) => x + 1); setAns(null); setMsg(null); sayNow(c.rounds[ri + 1], 'curious'); }, reduceMotion() ? 300 : 1100);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  const live = ans !== R.hl;
  const items = R.files.map((f, j) => ({ src: f, alt: '', hl: ans !== null && j === R.hl, cls: ans === j && j !== R.hl ? 'is-off' : '', tap: live && canTap ? () => tap(j) : null, led: live && led }));
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={done ? c.done : c.askQ} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={done ? c.done : c.askQ} hint={done ? null : msg} err={!!msg} n={done ? null : (ri + 1) + '/3'} />
        <div className="kz-scene kz-scene-col" key={'r' + ri}>
          <div className="kz-col">
            <KzCode lines={R.files.map((f, j) => codeLine('l' + j, imgCode([{ n: 'src', v: f }]), { cls: j === R.hl ? 'is-read' : '' }))} cls="kz-code-sm" />
            <Br title={pick(C.site.gallery)} url="galereya.html" short><PageDoc blocks={[{ t: 'h1', parts: pick(C.site.gallery), k: 'h' }, { t: 'imgs', items, k: 'g' }]} /></Br>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S5. АТРИБУТ alt И img БЕЗ ЗАКРЫВАЮЩЕГО ТЕГА (показ) — у картинки есть alt; Коди «портит» имя файла —
// вместо фото значок и текст alt; потом alt убирают — остаётся один значок; в конце — у img нет </img>.
// =============================================================================
function S5({ p }) {
  const pick = usePick();
  const c = C.s5;
  const [rec, put] = useRec('s5');
  const solved = !!(rec && rec.done);
  const [st5, setSt5] = useState(solved ? 3 : 0);   // 0 фото и alt; 1 опечатка — alt виден; 2 без alt — значок; 3 снова верно
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('soft', true); setSt5(1); } },
    { say: [{ text: c.sayBroken, pose: 'wonder' }] },
    { act: () => { sfx('tap', true); setSt5(2); } },
    { say: [{ text: c.sayNoAlt, pose: 'think' }] },
    { act: () => { sfx('ok', true); setSt5(3); } },
    { say: [{ text: c.sayVoid, pose: 'point' }, { text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const alt = pick(c.alt);
  const src = st5 === 1 || st5 === 2 ? 'osh.jgp' : 'osh.jpg';
  const attrs = [{ n: 'src', v: src }].concat(st5 === 2 ? [] : [{ n: 'alt', v: alt }]);
  const blocks = [{ t: 'h1', parts: pick(C.site.osh), k: 'h' }, { t: 'img', src, alt: st5 === 2 ? '' : alt, k: 'i', hl: st5 === 1 || st5 === 2 }];
  const askText = solved || demo.done ? c.askDone : st5 >= 3 ? c.askVoid : st5 >= 1 ? c.askBroken : c.askAlt;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z5-s5">
          <div className="kz-col"><KzCode lines={[textLine('h', 'h1', pick(C.site.osh), { cls: 'z5-edge' }),
            codeLine('i', imgCode(attrs), { cls: st5 >= 1 ? 'is-read' : '' })]} cls="kz-code-sm" />
            {st5 >= 3 ? <div className="z5-void z5-a-in"><TagChip t="</img>" cls="z5-void-x" /><span>{pick(c.noClose)}</span></div> : null}
          </div>
          <div className="kz-col"><Br title={pick(C.site.osh)} url="osh.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S6. СОБЕРИ КАРТИНКУ (Code Builder) — четыре места; в лотке <img, src="top.jpg", alt="To'p", > и лишний </img>.
// Первым — <img, последним — >, атрибуты между ними в любом порядке (так и в HTML). </img> не нужен.
// =============================================================================
const S6_TRAY = ['alt', 'gt', 'close', 'open', 'src'];
function S6({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s6;
  const [rec, put] = useRec('s6');
  const solved = !!(rec && rec.done);
  const [got, setGot] = useState(solved ? ['open', 'src', 'alt', 'gt'] : []);
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const done = got.length === 4;
  const canGo = useAdvanceGate(solved || done, spoken);
  const lad = useKzLadder(!done);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !done, got.length);
  const altV = pick(c.altV);
  const TXT = { open: '<img', src: 'src="top.jpg"', alt: 'alt="' + altV + '"', gt: '>', close: '</img>' };
  const wantNow = (id) => {
    const k = got.length;
    if (id === 'close') return c.why.close;
    if (k === 0) return id === 'open' ? null : c.why.openFirst;
    if (id === 'open') return c.why.openOnce;
    if (k === 3) return id === 'gt' ? null : c.why.gtLast;
    if (id === 'gt') return c.why.gtEarly;
    return null;
  };
  const place = (id) => {
    if (!canTap || done || got.indexOf(id) >= 0) return false;
    st.current.tries += 1;
    const m = wantNow(id);
    if (m) {
      st.current.misses += 1;
      sfx('soft', true); setShake(id); setTimeout(() => setShake(null), 520);
      setMsg(m); sayNow(m, 'think');
      if (st.current.misses >= 2) lad.bump();
      return false;
    }
    sfx('pop', true); setMsg(null);
    const nx = got.concat(id);
    setGot(nx);
    if (nx.length === 4) {
      put({ done: true });
      log({ screenId: 's6', type: 'build-img', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    }
    return true;
  };
  const dnd = useKzDrag((id) => place(id));
  const lit = lad.lv >= 3;
  const nextOk = got.length === 0 ? 'open' : got.length === 3 ? 'gt' : ['src', 'alt'].find((x) => got.indexOf(x) < 0);
  const slot = (i) => (got[i] ? <span key={'s' + i} className={'z5-built z5-a-in' + (i > 0 && i < 3 ? ' z5-att' : '') + (got[i] === 'src' || got[i] === 'alt' ? ' z5-attr' : ' kz-tk-n')}>{TXT[got[i]]}</span>
    : <span key={'s' + i} data-place="code" className={'kz-dash kz-dash-sm z5-bslot' + (i === got.length ? ' is-next' : '') + (dnd.hover === 'code' && i === got.length ? ' is-hover' : '')} />);
  const blocks = [{ t: 'h1', parts: pick(C.site.games), k: 'h' }, { t: 'img', src: done ? 'top.jpg' : null, alt: '', k: 'i', hl: done, cls: done ? 'z5-a-in' : '' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : got.length + '/4'} />
        <div className={'kz-scene kz-scene-col z5-s6' + (dnd.active ? ' is-dragging' : '')}>
          <div className="kz-col">
            <Br title={pick(C.site.games)} url="oyinlar.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('h', 'h1', pick(C.site.games), { cls: 'z5-ctx' }), codeLine('code', [slot(0), slot(1), slot(2), slot(3)], { cls: done ? 'is-new' : 'is-hl' })]} />
          </div>
        </div>
        {!done ? (
          <div className="kz-tray">
            {S6_TRAY.map((id) => (got.indexOf(id) >= 0 ? null : (
              <button key={id} type="button" disabled={!canTap} data-id={id}
                className={'kz-scrap kz-scrap-code z5-piece' + (shake === id ? ' kz-a-shake' : '') + (lit && id === nextOk ? ' is-led' : '')}
                onPointerDown={(e) => { if (canTap && !done) dnd.start(e, id, TXT[id]); }}
                onClick={() => place(id)}>
                <span translate="no">{TXT[id]}</span><Led on={led} />
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
// S7. НАЙДИ ПАРУ (Matching Pairs) — img, src, alt ↔ что они делают.
// =============================================================================
const S7_TAGS = ['img', 'src', 'alt'];
const S7_CARDS = ['alt', 'img', 'src'];
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
      log({ screenId: 's7', type: 'match-img', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
    } else sayNow(c.pairOk[card], 'smile');
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={done ? c.ok : sel ? c.askPlace : c.ask} hint={done ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} n={done ? null : paired.length + '/3'} />
        <div className="kz-scene z5-match">
          <div className="z5-match-col">
            {S7_TAGS.map((t) => {
              const ok = paired.indexOf(t) >= 0;
              return (
                <button key={t} type="button" disabled={!canTap || ok || done} data-t={t} onClick={() => { setSel(sel === t ? null : t); setMsg(null); sfx('tap', true); }}
                  className={'kz-scrap kz-scrap-code z5-mtag z5-mtag-' + t + (ok ? ' is-ok' : '') + (sel === t ? ' is-sel' : '') + (lit && t === nextT && !sel ? ' is-led' : '')}>
                  <span translate="no">{t}</span><Led on={led && !sel && !ok} />
                </button>
              );
            })}
          </div>
          <div className="z5-match-col">
            {S7_CARDS.map((k) => {
              const ok = paired.indexOf(k) >= 0;
              return (
                <button key={k} type="button" disabled={!canTap || ok || done} data-card={k} onClick={() => pickCard(k)}
                  className={'z5-mcard' + (ok ? ' is-ok' : '') + (shake === k ? ' kz-a-shake' : '') + (sel && !ok ? ' is-call' : '') + (lit && sel === k ? ' is-led' : '')}>
                  <span className="z5-mcard-t">{pick(c.cards[k])}</span>
                  {ok ? <span className="z5-mcard-tag" translate="no">{k}</span> : null}
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
// S8. ЧТО ЛОМАЕТ КАРТИНКУ (показ) — 1) img без src: в окне пусто; 2) src есть, файла нет: сломанная картинка
// и alt; 3) исправили — фото.
// =============================================================================
function S8({ p }) {
  const pick = usePick();
  const c = C.s8;
  const [rec, put] = useRec('s8');
  const solved = !!(rec && rec.done);
  const [st8, setSt8] = useState(solved ? 3 : 0);   // 0 фото; 1 нет src; 2 опечатка; 3 исправлено
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: () => { sfx('tap', true); setSt8(1); } },
    { say: [{ text: c.sayNoSrc, pose: 'think' }] },
    { act: () => { sfx('soft', true); setSt8(2); } },
    { say: [{ text: c.sayTypo, pose: 'wonder' }] },
    { act: () => { sfx('ok', true); setSt8(3); } },
    { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const alt = pick(c.alt);
  const attrs = st8 === 1 ? [{ n: 'alt', v: alt }] : [{ n: 'src', v: st8 === 2 ? 'mushk.jpg' : 'mushuk.jpg' }, { n: 'alt', v: alt }];
  const blocks = [{ t: 'h1', parts: pick(C.site.cat), k: 'h' }, { t: 'img', src: st8 === 1 ? null : st8 === 2 ? 'mushk.jpg' : 'mushuk.jpg', alt, k: 'i', hl: st8 === 1 || st8 === 2 }];
  const askText = solved || demo.done ? c.askDone : st8 >= 2 ? c.askTypo : c.askNoSrc;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z5-s5">
          <div className="kz-col"><KzCode lines={[textLine('h', 'h1', pick(C.site.cat), { cls: 'z5-edge' }), codeLine('i', imgCode(attrs), { cls: st8 === 1 || st8 === 2 ? 'is-read' : st8 === 3 ? 'is-new' : '' })]} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.cat)} url="mushuk.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S9. НАПИШИ alt (Fill in the Blanks) — файла мяча на сайте ещё нет: в окне только значок. Ученик пишет
// в alt, что на картинке; текст сразу появляется рядом со значком. Засчёт — по «Проверить».
// =============================================================================
function S9({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s9;
  const [rec, put] = useRec('s9');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 30 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const val = cleanV(ty.val) || (okNow ? pick(c.sample) : '');
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = cleanV(ty.val);
    const issue = !v ? c.msgs.empty : /[<>]/.test(v) ? c.msgs.tags : /\.(jpe?g|png|gif)$/i.test(v) ? c.msgs.file : v.length < 3 ? c.msgs.short : null;
    if (!issue) {
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's9', type: 'write-alt', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'h1', parts: pick(C.site.games), k: 'h' }, { t: 'img', src: 'koptok.jpg', alt: val, k: 'i', hl: !okNow }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.games)} url="oyinlar.html" short><PageDoc blocks={blocks} /></Br>
            <KzCode lines={[textLine('h', 'h1', pick(C.site.games), { cls: 'z5-ctx' }),
              okNow ? codeLine('i', imgCode([{ n: 'src', v: 'koptok.jpg' }, { n: 'alt', v: val }]), { cls: 'is-new' }) : codeLine('i', [tagOpen(),
                attrSpan('src', 'koptok.jpg', 's'),
                attrOpen('alt'),
                <span key="g" className={'kz-gap z5-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder="…" label={c.ask} max={30} /></span>,
                attrClose(), tagClose()], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        {!okNow ? <KeyRow keys={[]} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 1} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S10. ДО И ПОСЛЕ (Before / After) — пусто → фото (добавили src), сломанная → фото (исправили имя файла),
// значок → значок с текстом (добавили alt). Ученик выбирает, что изменили. Промах — причина, раунд того же типа.
// =============================================================================
const S10_ROUNDS = [{ want: 'src', f: 'mushuk.jpg' }, { want: 'val', f: 'osh.jpg' }, { want: 'alt', f: 'top.jpg' }];
const S10_EXTRA = [{ want: 'src', f: 'gul.jpg' }, { want: 'val', f: 'top.jpg' }, { want: 'alt', f: 'mushuk.jpg' }];
const S10_BTN = { src: 'src="…"', val: '"….jpg"', alt: 'alt="…"' };
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
  const alts = pick(C.site.alts);
  const view = (after) => {
    if (!R) return null;
    const alt = alts[R.f];
    const typo = R.f.replace('.jpg', '.jgp');
    const img = R.want === 'src' ? (after ? { src: R.f, alt: '' } : { src: null, alt: '' })
      : R.want === 'val' ? (after ? { src: R.f, alt } : { src: typo, alt })
        : (after ? { src: typo, alt } : { src: typo, alt: '' });
    return <PageDoc blocks={[{ t: 'img', ...img, k: 'x' }]} />;
  };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={round ? c.askQ : c.done} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={round ? c.askQ : c.done} hint={round && ans && ans !== R.want ? c.miss[R.want] : null} err={!!(round && ans && ans !== R.want)} n={round ? (doneN + 1) + '/' + (doneN + queue.length) : null} />
        {R ? (
          <div className="kz-scene kz-scene-col" key={'r' + doneN}>
            <div className="kz-col">
              <div className="z5-ba kz-a-drop">
                <div className="z5-card"><span className="z5-card-h">{pick(c.before)}</span>{view(false)}</div>
                <span className="z5-ba-arrow" aria-hidden="true" />
                <div className="z5-card is-after"><span className="z5-card-h">{pick(c.after)}</span>{view(true)}</div>
              </div>
            </div>
          </div>
        ) : null}
        {round ? (
          <div className="kz-pick z5-pick3">
            {['src', 'val', 'alt'].map((k) => (
              <button key={k} type="button" disabled={!canTap || !!ans}
                className={'kz-btn z5-tagbtn ' + (ans === k ? (k === R.want ? 'is-ok' : 'is-off') : ans && k === R.want ? 'is-ok' : 'is-ghost')}
                onClick={() => answer(k)}><span translate="no">{S10_BTN[k]}</span><Led on={led && !ans} /></button>
            ))}
          </div>
        ) : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S11. СТРАНИЦА ЦЕЛИКОМ (показ) — браузер читает страницу сверху вниз: заголовок, фото, текст; строки
// кода загораются по очереди, фото «загружается» на своём месте.
// =============================================================================
const READ11 = ['h1', 'img', 'p'];
function S11({ p }) {
  const pick = usePick();
  const c = C.s11;
  const [rec, put] = useRec('s11');
  const solved = !!(rec && rec.done);
  const [read, setRead] = useState(solved ? READ11.length : -1);
  const ORDER = [{ text: c.order1, pose: 'point' }, { text: c.order2, pose: 'point' }, { text: c.order3, pose: 'smile' }];
  const [speaker, say, spoken, sayNow] = useVoice(solved ? ORDER : [{ text: c.say, pose: 'explain' }]);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const STEP = reduceMotion() ? 120 : 750;
  const run = () => { READ11.forEach((k, i) => timers.current.push(setTimeout(() => { setRead(i); sfx('tap', true); }, STEP * i))); };
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { act: run }, { wait: STEP * READ11.length + 200 }, { act: () => setRead(READ11.length) },
    { say: ORDER }, { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const sayK = spoken ? null : speaker.text === c.order1 ? 'h1' : speaker.text === c.order2 ? 'img' : speaker.text === c.order3 ? 'p' : null;
  const cur = read >= 0 && read < READ11.length ? READ11[read] : null;
  const on = (k) => (sayK ? sayK === k : cur === k);
  const alt = pick(C.s5.alt);
  const lines = [textLine('h1', 'h1', pick(C.site.osh), { cls: on('h1') ? 'is-read' : '' }),
    codeLine('img', imgCode([{ n: 'src', v: 'osh.jpg' }, { n: 'alt', v: alt }]), { cls: on('img') ? 'is-read' : '' }),
    textLine('p', 'p', pick(C.site.oshText), { cls: on('p') ? 'is-read' : '' })];
  const at = (k) => read >= READ11.indexOf(k);
  const blocks = [at('h1') ? { t: 'h1', parts: pick(C.site.osh), k: 'h1', hl: on('h1') } : null,
    at('img') ? { t: 'img', src: 'osh.jpg', alt, k: 'img', hl: on('img'), cls: solved ? '' : 'z5-a-in' } : null,
    at('p') ? { t: 'p', parts: pick(C.site.oshText), k: 'p', hl: on('p') } : null].filter(Boolean);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={read < 0 ? c.ask : c.askDone} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={read < 0 ? c.ask : c.askDone} />
        <div className="kz-scene z5-s5">
          <div className="kz-col"><KzCode lines={lines} cls="kz-code-sm" /></div>
          <div className="kz-col"><Br title={pick(C.site.osh)} url="osh.html">{blocks.length ? <PageDoc blocks={blocks} /> : null}</Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W1. КАРТИНКА ИЗ ИНТЕРНЕТА (показ; заказчик, 05.11.2026) — img с quyosh.jpg: среди наших файлов его нет —
// значок сломанной картинки. src становится полным адресом: загораются https://, имя сайта, /файл — картинка
// приходит с сайта. Потом https:// стирается — браузер ищет папку на нашем сайте: снова сломанная картинка.
// =============================================================================
function W1({ p }) {
  const pick = usePick();
  const c = C.w1;
  const [rec, put] = useRec('w1');
  const solved = !!(rec && rec.done);
  const [n, setN] = useState(solved ? 3 : 0);   // 0 — только имя файла; 1 — полный адрес; 2 — без https://; 3 — снова полный
  const [lit, setLit] = useState(null);
  const [seen, setSeen] = useState(solved ? 3 : 0);
  const [speaker, say, spoken, sayNow] = useVoice(solved ? [{ text: c.done, pose: 'smile' }] : [{ text: c.say, pose: 'explain' }]);
  const demo = useKzDemo({ run: !solved, spoken, sayNow, say, steps: [
    { say: [{ text: c.sayWeb, pose: 'point' }] },
    { act: () => { sfx('pop', true); setN(1); setLit('proto'); setSeen(1); } }, { say: [{ text: c.sayProto, pose: 'point' }] },
    { act: () => { sfx('tap', true); setLit('host'); setSeen(2); } }, { say: [{ text: c.sayHost, pose: 'point' }] },
    { act: () => { sfx('ok', true); setLit('file'); setSeen(3); } }, { say: [{ text: c.sayFile, pose: 'wonder' }] },
    { act: () => { setLit(null); sfx('soft', true); setN(2); } }, { say: [{ text: c.sayNoProto, pose: 'curious' }] },
    { wait: 300 }, { say: [{ text: c.sayNf, pose: 'think' }] },
    { act: () => { sfx('ok', true); setN(3); } }, { say: [{ text: c.done, pose: 'smile' }] },
    { act: () => put({ done: true }) }
  ] });
  const canGo = useAdvanceGate(solved || demo.done, spoken);
  const full = 'https://' + WEB_HOST + '/quyosh.jpg';
  const src = n === 0 ? 'quyosh.jpg' : n === 2 ? WEB_HOST + '/quyosh.jpg' : full;
  const alt = pick(C.site.webAlts)['quyosh.jpg'];
  const blocks = [{ t: 'h1', parts: pick(C.site.sun), k: 'h' }, { t: 'img', src, alt, k: 'i', hl: !solved && !demo.done }];
  const askText = solved || demo.done ? c.askDone : n === 2 ? c.askNf : lit ? c['ask' + lit[0].toUpperCase() + lit.slice(1)] : c.askStart;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={askText} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={askText} />
        <div className="kz-scene z5-s5 z5-w1">
          <div className="kz-col">
            <KzCode lines={[textLine('h', 'h1', pick(C.site.sun), { cls: 'z5-ctx' }),
              codeLine('i', imgCode([{ n: 'src', v: src, lit }, { n: 'alt', v: alt }]), { cls: n >= 1 ? 'is-new' + (lit || n === 2 ? ' is-read' : '') : 'is-read' })]} cls="kz-code-sm" />
            {seen ? (
              <div className="z5-url-lbls">
                <TagChip t={'https:// — ' + pick(C.site.proto)} cls="z5-a-in" on={lit === 'proto'} />
                {seen >= 2 ? <TagChip t={WEB_HOST + ' — ' + pick(C.site.hostL)} cls="z5-a-in" on={lit === 'host'} /> : null}
                {seen >= 3 ? <TagChip t={'/quyosh.jpg — ' + pick(C.site.fileL)} cls="z5-a-in" on={lit === 'file'} /> : null}
              </div>
            ) : <FilesPanel files={IMG_FILES} />}
          </div>
          <div className="kz-col"><Br title={pick(C.site.sun)} url="quyosh.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// Проверка полного адреса картинки (w2): null — верно; 'http' — работает, но без s; иначе — причина.
function srcUrlIssue(v, want, msgs) {
  const n = normT(v).replace(/^["'«“]+|["'»”]+$/g, '');
  if (n === 'https://' + want) return null;
  if (n === 'http://' + want) return 'http';
  if (!n) return msgs.empty;
  if (/^https?:\/\//.test(n)) {
    const rest = n.replace(/^https?:\/\//, '');
    if (rest.indexOf('/') < 0 && rest.replace(/\./g, '') === want.replace(/[./]/g, '')) return msgs.slash;
    if (rest.indexOf('/') < 0 && /\.jpg$/.test(rest)) return msgs.slash;
    return msgs.typo;
  }
  if (/^h?t?t?ps?(?=[:/]|$)/.test(n) || /^https?/.test(n)) return msgs.colon;
  return msgs.noProto;
}

// =============================================================================
// W2. АДРЕС КАРТИНКИ (Fill in the Blanks) — у img пустой src; внизу — имя сайта и файл картинки. Ученик
// пишет полный адрес (кнопки https:// и /). Окно браузера честно сразу показывает результат: без https:// —
// сломанная картинка и alt, с полным адресом — картинка с сайта.
// =============================================================================
function W2({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.w2;
  const [rec, put] = useRec('w2');
  const solved = !!(rec && rec.done);
  const want = WEB_HOST + '/olma.jpg';
  const ty = useTagTyping({ max: 40 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [okVal, setOkVal] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const typed = cleanV(ty.val);
  const val = okNow ? (okVal || 'https://' + want) : typed;
  const alt = pick(C.site.webAlts)['olma.jpg'];
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const issue = srcUrlIssue(ty.val, want, c.msgs);
    if (!issue || issue === 'http') {
      sfx('win', true); setMsg(null); setOkNow(true); setOkVal(typed); put({ done: true });
      log({ screenId: 'w2', type: 'write-src-url', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(issue === 'http' ? c.okHttp : c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'h1', parts: pick(C.site.fruit), k: 'h' }, { t: 'img', src: val || null, alt, k: 'i', hl: !okNow }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(C.site.fruit)} url="meva.html" short><PageDoc blocks={blocks} /></Br>
            <div className="z5-codecol">
              <KzCode lines={[textLine('h', 'h1', pick(C.site.fruit), { cls: 'z5-ctx' }),
                okNow ? codeLine('i', imgCode([{ n: 'src', v: val }, { n: 'alt', v: alt }]), { cls: 'is-new' }) : codeLine('i', [tagOpen(), attrOpen('src'),
                  <span key="g" className={'kz-gap z5-slot z5-slot-url' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={40} /></span>,
                  attrClose(), attrSpan('alt', alt, 'al', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
              <div className="z5-files z5-webinfo" aria-label={pick(C.site.hostH)}>
                <span className="z5-files-h">{pick(C.site.hostH)}</span>
                <span className={'z5-file z5-file-web' + (lad.lv >= 3 ? ' is-hl' : '')} translate="no"><i aria-hidden="true" />{WEB_HOST}</span>
                <span className="z5-files-h">{pick(C.site.fileH)}</span>
                <span className={'z5-file' + (lad.lv >= 3 ? ' is-hl' : '')} translate="no">olma.jpg</span>
              </div>
            </div>
          </div>
        </div>
        {!okNow ? <KeyRow keys={['https://', '/']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 8} /> : null}
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// W3. ОТКУДА БРАУЗЕР ВОЗЬМЁТ КАРТИНКУ (сортировка по одному) — src: «из файлов сайта» или «из интернета».
// Ловушка — имя сайта без https://: браузер ищет папку на нашем сайте, картинка ломается. После верного
// ответа окно честно показывает результат. Промах — причина, можно выбрать снова.
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
  const [speaker, , spoken, sayNow] = useVoice(solved ? [{ text: c.ok, pose: 'smile' }] : [{ text: c.say, pose: 'curious' }]);
  const canTap = useCanAnswer(spoken);
  const done = ok && ii === c.items.length - 1;
  const canGo = useAdvanceGate(solved || done, spoken);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !ok, ii * 10 + (off === null ? 0 : 1));
  const it = c.items[ii];
  const file = it.src.split('/').pop();
  const alt = (pick(C.site.alts)[file] || pick(C.site.webAlts)[file]);
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
      log({ screenId: 'w3', type: 'sort-src', correct: true, firstTry: st.current.misses === 0, attempts: st.current.tries, hints: 0, depth: 0 });
      sayNow(joinL(line, c.ok), 'cheer');
    } else { sayNow(line, 'smile'); setNext(true); }
  };
  useEffect(() => {
    if (!next || !spoken) return undefined;
    const t = setTimeout(() => { setNext(false); setIi((x) => x + 1); setOk(false); setOff(null); setMsg(null); }, reduceMotion() ? 300 : 1400);
    return () => clearTimeout(t);
  }, [next, spoken]); // eslint-disable-line react-hooks/exhaustive-deps
  // До ответа браузер «ещё не открыл» страницу: на месте картинки — пусто; после верного ответа — честный результат.
  const blocks = [{ t: 'h1', parts: pick(C.site.gallery), k: 'h' }, ok ? { t: 'img', src: it.src, alt, k: 'i' + ii } : { t: 'p', parts: '…', k: 'w', cls: 'z5-wait' }];
  const btn = (v) => (
    <button key={v} type="button" disabled={!canTap || ok || off === v} onClick={() => choose(v)} data-v={v}
      className={'kz-btn z5-tf z5-where ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(c[v])}<Led on={led && !ok && off === null} />
    </button>
  );
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene z5-s5 z5-w3" key={'i' + ii}>
          <div className="kz-col">
            <KzCode lines={[codeLine('i', imgCode([{ n: 'src', v: it.src }, { n: 'alt', v: alt }]), { cls: 'is-hl' })]} cls="kz-code-sm" />
            <div className="kz-pick z5-tf-pick">{btn('site')}{btn('web')}</div>
          </div>
          <div className="kz-col"><Br title={pick(C.site.gallery)} url="galereya.html" short><PageDoc blocks={blocks} /></Br></div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S12. СВОЯ КАРТИНКА и S13. СВОЙ alt (Live Code Preview) — своя страница: картинка на выбор (имя любого файла
// из панели, засчёт по «Проверить»), потом текст alt (засчёт по «Готово»).
// =============================================================================
const useMine5 = () => {
  const store = useStore();
  const pick = usePick();
  return { pic: store.get('myPic') || 'mushuk.jpg', alt: store.get('myAlt') || pick(C.s13.ph).replace(/^[^:]*:\s*/, '') };
};
function S12({ p }) {
  const pick = usePick();
  const log = useLog();
  const store = useStore();
  const c = C.s12;
  const [rec, put] = useRec('s12');
  const solved = !!(rec && rec.done);
  const ty = useTagTyping({ max: 20 });
  const [msg, setMsg] = useState(null);
  const [okNow, setOkNow] = useState(solved);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'explain' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const lad = useKzLadder(!okNow);
  const st = useRef({ tries: 0, misses: 0 });
  const led = useIdleLed(canTap && !okNow && !ty.val, 0);
  const saved = store.get('myPic');
  const val = okNow ? (saved || 'mushuk.jpg') : cleanV(ty.val).toLowerCase();
  const check = () => {
    if (!canTap || okNow) return;
    st.current.tries += 1;
    const v = cleanV(ty.val).toLowerCase();
    const issue = fileIssue(ty.val, OWN_FILES, c.msgs);
    if (!issue) {
      store.set('myPic', v);
      sfx('win', true); setMsg(null); setOkNow(true); put({ done: true });
      log({ screenId: 's12', type: 'own-img-src', correct: true, firstTry: st.current.misses === 0 && lad.asked.current === 0, attempts: st.current.tries, hints: lad.asked.current, depth: lad.lv });
      sayNow(c.ok, 'cheer');
      return;
    }
    st.current.misses += 1;
    sfx('soft', true); setMsg(issue); sayNow(issue, 'think');
    if (st.current.misses >= 2) lad.bump();
  };
  const blocks = [{ t: 'h1', parts: pick(UI.mySite), k: 'h' }, { t: 'img', src: val || null, k: 'i', hl: !okNow }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : (msg || hintAt(lad.lv, c.hints))} err={!!msg} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><PageDoc blocks={blocks} /></Br>
            <div className="z5-codecol">
              <KzCode lines={[textLine('h', 'h1', pick(UI.mySite), { cls: 'z5-ctx' }),
                okNow ? codeLine('i', imgCode([{ n: 'src', v: val }]), { cls: 'is-new' }) : codeLine('i', [tagOpen(), attrOpen('src'),
                  <span key="g" className={'kz-gap z5-slot' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={(v) => { ty.setVal(v); setMsg(null); }} inputRef={ty.inputRef} onEnter={check} placeholder={L3('…', '…', '…')} label={c.ask} max={20} /></span>,
                  attrClose(), tagClose()], { cls: 'is-hl' })]} cls="kz-code-sm" />
              <FilesPanel files={OWN_FILES} hl={lad.lv >= 3 ? 'mushuk.jpg' : null} />
            </div>
          </div>
        </div>
        {!okNow ? <KeyRow keys={['.jpg']} ty={ty} canTap={canTap} onCheck={check} ready={ty.val.trim().length > 3} /> : null}
      </Sheet>
    </StageB>
  );
}
function S13({ p }) {
  const pick = usePick();
  const c = C.s13;
  const mine = useMine5();
  const [rec] = useRec('s13');
  const lad = useKzLadder(!(rec && rec.done));
  const ty = useTypedDone({ storeKey: 'myAlt', screenId: 's13', type: 'own-img-alt', lad });
  const [speaker, , spoken, sayNow] = useVoice([{ text: ty.solved ? c.ok : c.say, pose: ty.solved ? 'smile' : 'point' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(ty.solved, spoken);
  const led = useIdleLed(canTap && !ty.solved && !ty.val.trim(), 0);
  const confirm = () => { if (canTap && ty.ready) ty.commit(() => sayNow(c.ok, 'smile')); };
  const hint = hasTags(ty.val) ? UI.noTags : hintAt(lad.lv, c.hints);
  // Своя картинка загрузилась — alt не виден; рядом — как alt прочтёт программа чтения с экрана.
  const blocks = [{ t: 'h1', parts: pick(UI.mySite), k: 'h' }, { t: 'img', src: mine.pic, alt: ty.shown, k: 'i' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet kz-typed">
        <KzAsk text={ty.solved ? c.ok : c.ask} hint={ty.solved && !hasTags(ty.val) ? null : hint} err={hasTags(ty.val)} />
        <div className="kz-scene kz-scene-col">
          <div className="kz-col">
            <Br title={pick(UI.mySite)} url="mening.html" short><PageDoc blocks={blocks} /></Br>
            <div className="z5-reader"><span className="z5-reader-ic" aria-hidden="true" /><span>{pick(c.reader)}: <b>{ty.shown || '…'}</b></span></div>
            <KzCode lines={[codeLine('i', [tagOpen(),
              attrSpan('src', mine.pic, 's'),
              attrOpen('alt'),
              <span key="g" className={'kz-gap' + (led ? ' kz-gap-led' : '')}><InlineInput value={ty.val} onChange={ty.setVal} onEnter={confirm} placeholder={c.ph} label={c.ask} max={30} /></span>,
              attrClose(), tagClose()], { cls: 'is-hl' })]} cls="kz-code-sm" />
          </div>
        </div>
        <ReadyBtn on={canTap && ty.ready} glow={canTap && ty.ready && !ty.solved} onClick={confirm} />
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S14. ПРОПАЛА КАРТИНКА (Debug & Fix) — у своей картинки стёрлось имя атрибута: браузер не знает, где
// файл, — видно только alt. Перетащить (или нажать) нужное слово: src, а не href и не alt.
// =============================================================================
const S14_OPTS = ['href', 'src', 'alt'];
function S14({ p }) {
  const pick = usePick();
  const log = useLog();
  const c = C.s14;
  const mine = useMine5();
  const [rec, put] = useRec('s14');
  const solved = !!(rec && rec.done);
  const [off, setOff] = useState([]);
  const [okNow, setOkNow] = useState(solved);
  const [msg, setMsg] = useState(null);
  const [speaker, , spoken, sayNow] = useVoice([{ text: solved ? c.ok : c.say, pose: solved ? 'smile' : 'wonder' }]);
  const canTap = useCanAnswer(spoken);
  const canGo = useAdvanceGate(solved || okNow, spoken);
  const led = useIdleLed(canTap && !okNow, off.length);
  const choose = (o) => {
    if (!canTap || okNow || off.indexOf(o) >= 0) return false;
    if (o === 'src') {
      sfx('win', true); setOkNow(true); setMsg(null); put({ done: true });
      log({ screenId: 's14', type: 'fix-src', correct: true, firstTry: off.length === 0, attempts: off.length + 1 });
      sayNow(c.ok, 'cheer');
      return true;
    }
    sfx('soft', true); setOff(off.concat(o)); setMsg(c.why[o]); sayNow(c.why[o], 'think');
    return false;
  };
  const dnd = useKzDrag((o, where) => (where === 'gap' ? choose(o) : false));
  const blocks = [{ t: 'h1', parts: pick(UI.mySite), k: 'h' }, { t: 'img', src: okNow ? mine.pic : null, alt: mine.alt, k: 'i', hl: !okNow, cls: okNow ? 'z5-a-in' : '' }];
  const glow = off.length >= 2 ? 'src' : null;
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={okNow ? c.ok : c.ask} hint={okNow ? null : msg} err={!!msg} />
        <div className="kz-scene z5-s5">
          <div className="kz-col"><Br title={pick(UI.mySite)} url="mening.html" cls={okNow ? '' : 'z5-broken-br'}><PageDoc blocks={blocks} /></Br></div>
          <div className="kz-col">
            <KzCode lines={[textLine('h', 'h1', pick(UI.mySite), { cls: 'z5-edge' }),
              okNow ? codeLine('i', imgCode([{ n: 'src', v: mine.pic }, { n: 'alt', v: mine.alt }]), { cls: 'is-new' }) : codeLine('i', [tagOpen(),
                <span key="g" data-place="gap" className={'kz-dash kz-dash-sm kz-drop z5-miss z5-att' + (dnd.hover === 'gap' ? ' is-hover' : '') + (dnd.active ? ' is-call' : '')} />,
                <span key="v" className="kz-tag" translate="no"><span className="kz-tk-b">=</span><span className="z5-val">{'"' + mine.pic + '"'}</span></span>,
                attrSpan('alt', mine.alt, 'al', true)], { cls: 'is-hl' })]} cls="kz-code-sm" />
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
// Q1. НАЙДИ ОШИБКУ (Error Detective) — галерея из трёх картинок, без образца. Раунд 1: опечатка в имени
// файла (сломанная картинка). Раунд 2: вместо src написан href (вместо фото — только alt). Ученик
// нажимает строку с ошибкой; найденная строка чинится сама.
// =============================================================================
const Q1_FILES = ['osh.jpg', 'mushuk.jpg', 'top.jpg'];
const Q1_ROUNDS = [{ bad: 1, kind: 'typo' }, { bad: 2, kind: 'href' }];
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
  const alts = pick(c.alts);
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
  const fileOf = (j) => (broken(j) && R.kind === 'typo' ? Q1_FILES[j].replace('mushuk', 'mushk') : Q1_FILES[j]);
  const attrsOf = (j) => [{ n: broken(j) && R.kind === 'href' ? 'href' : 'src', v: fileOf(j) }, { n: 'alt', v: alts[j] }];
  const items = Q1_FILES.map((f, j) => ({ src: broken(j) && R.kind === 'href' ? null : fileOf(j), alt: alts[j], cls: found && j === R.bad ? 'z5-a-in' : '' }));
  const lit = lad.lv >= 3;
  const hint = hintAt(lad.lv, c.hints[R.kind]);
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={hintAt(Math.min(3, lad.lv + 1), c.hints[R.kind]) || c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={found ? (done ? c.ok : c.found[R.kind]) : c.ask} hint={found ? null : (msg || hint)} err={!!msg} n={(ri + 1) + '/' + Q1_ROUNDS.length} />
        <div className="kz-scene kz-scene-col z5-q1" key={'q' + ri}>
          <div className="kz-col">
            <Br title={pick(C.site.gallery)} url="galereya.html" short cls={found ? '' : 'z5-broken-br'}><PageDoc blocks={[{ t: 'h1', parts: pick(C.site.gallery), k: 'h' }, { t: 'imgs', items, k: 'g' }]} /></Br>
            <KzCode lines={Q1_FILES.map((f, j) => ({
              k: 'l' + j + (found && j === R.bad ? 'f' : ''), d: 0, parts: imgCode(attrsOf(j)),
              cls: 'z5-hline' + (found && j === R.bad ? ' is-new' : '') + (off.indexOf(j) >= 0 ? ' is-off' : ''),
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
// Q2. ВЕРНО ИЛИ НЕТ (True / False).
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
      className={'kz-btn z5-tf ' + (ok && v === it.right ? 'is-ok' : off === v ? 'is-off' : 'is-ghost')}>
      {pick(v ? c.yes : c.no)}<Led on={led && !ok && off === null} />
    </button>
  );
  const codes = { host: imgCode([{ n: 'src', v: WEB_HOST + '/olma.jpg' }]), void: imgCode([{ n: 'src', v: 'osh.jpg' }]), alt: imgCode([{ n: 'src', v: 'osh.jgp' }, { n: 'alt', v: pick(C.s5.alt) }]), href: imgCode([{ n: 'href', v: 'osh.jpg' }]) };
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask} nav={navOf(p, canGo)}>
      <Sheet cls="z5-sheet">
        <KzAsk text={done ? c.ok : c.ask} hint={ok ? null : msg} err={!!msg} n={(ii + 1) + '/' + c.items.length} />
        <div className="kz-scene kz-scene-col kz-q2" key={'i' + ii}>
          <div className="kz-col">
            <div className="z5-card z5-tf-card kz-a-drop">
              <span className="z5-card-h">{pick(c.card)}</span>
              <p className="z5-tf-t">{pick(it.t)}</p>
            </div>
            {it.code ? <KzCode lines={[codeLine('c', codes[it.code])]} cls="kz-code-sm" /> : null}
            <div className="kz-pick z5-tf-pick">{btn(true)}{btn(false)}</div>
          </div>
        </div>
      </Sheet>
    </StageB>
  );
}

// =============================================================================
// S15. ВЫВОД — разгадка: у Коди href вместо src — в окне пусто; своя страница ученика с картинкой; роли
// img, src, alt загораются, пока Коди их называет.
// =============================================================================
function S15({ p }) {
  const pick = usePick();
  const c = C.s15;
  const mine = useMine5();
  const [speaker, , spoken] = useVoice(c.say.map((x, i) => ({ text: x.text, pose: i === c.say.length - 1 ? 'celebrate' : i === 0 ? 'embarrassed' : 'point' })));
  const canGo = useAdvanceGate(true, spoken);
  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);
  const curK = (c.say.find((x) => x.text === speaker.text) || {}).k || null;
  const riddle = curK === 'riddle';
  const blocks = riddle
    ? [{ t: 'h1', parts: pick(C.site.osh), k: 'h' }, { t: 'img', src: null, alt: '', k: 'r', hl: true }, { t: 'p', parts: pick(C.site.oshText), k: 'p' }]
    : [{ t: 'h1', parts: pick(UI.mySite), k: 'h' }, { t: 'img', src: mine.pic, alt: mine.alt, k: 'i', hl: curK === 'img' || curK === 'src' }];
  return (
    <StageB voiceTop eyebrow={c.eyebrow} screen={p.screen} total={p.total} speaker={speaker} done={canGo} hint={c.ask}
      nav={<><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.finish} label={UI.finish} /></>}>
      <Sheet cls="z5-sheet">
        <div className="kz-scene kz-s15">
          <div className="kz-col kz-s15-left">
            <Br title={riddle ? pick(C.site.osh) : pick(UI.mySite)} url={riddle ? 'osh.html' : 'mening.html'}><PageDoc blocks={blocks} key={riddle ? 'r' : 'm'} /></Br>
            <div className="kz-s15-man"><div className="kz-manbox kz-manbox-free"><PaperMan anim wave /></div></div>
          </div>
          <div className="kz-col kz-s15-side">
            <div className="kz-roles">
              {['img', 'src', 'alt', 'web'].map((k) => (
                <span key={k} className={'kz-role' + (curK === k || (riddle && k === 'src') ? ' is-on' : '')} style={{ '--c': k === 'img' ? '#FA4F28' : k === 'src' ? '#7C5CFA' : k === 'alt' ? '#0FA38E' : '#D97706' }}>
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
// «Повторить» стирает только экран; своя картинка ученика (myPic, myAlt) остаётся.
const SCREEN_RESET = { s1: ['s1'], s2: ['s2'], s3: ['s3'], s4: ['s4'], s5: ['s5'], s6: ['s6'], s7: ['s7'], s8: ['s8'], s9: ['s9'],
  s10: ['s10'], s11: ['s11'], w1: ['w1'], w2: ['w2'], w3: ['w3'], s12: ['s12'], s13: ['s13'], s14: ['s14'], q1: ['q1'], q2: ['q2'] };

// Артефакт урока — своя картинка ученика с alt.
function lesson5Artifact(store) {
  const pic = store.get('myPic'), alt = store.get('myAlt');
  if (!pic && !alt) return null;
  return { type: 'html-page', pic: pic || '', alt: alt || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>Mening saytim</title>', '  </head>', '  <body>',
      '    <img src="' + escHtml(pic || '') + '" alt="' + escHtml(alt || '') + '">', '  </body>', '</html>'].join('\n') };
}

export default function HtmlRasmlar({ studentName, lang, ttsApiBase, voiceGender, onFinished, startAt, onExit }) {
  setLmsVoice(voiceGender);
  const R = useLessonRoot({
    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase, onFinished, startAt, onExit,
    extraPayload: (store) => ({ artifact: lesson5Artifact(store) })
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
