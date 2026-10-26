// =============================================================================
// БУМАЖНЫЙ НАБОР. Вырезка (Cut): внешний слой — движение и тень, внутренний —
// бумага с рваным краем (clip-path) и фактурой. Рваный край считается один раз
// по зерну (seed): одна и та же вырезка всегда одинаковая.
// =============================================================================
// ОЗВУЧКА ЗНАКОВ И ТЕГОВ (общая для уроков на бумажном наборе). Знак в кавычках
// («<», «/», “>”) нужен глазам: в реплике он назван словами рядом («chap «<» qavsdan»,
// «уголка «<»»). В речь знак не идёт — иначе сервис читает сырой символ; знак без
// названия читается словами. Узбекский закрывающий тег — «yopuvchi title tegi»
// (порядок слов узбекского), а не «yopuvchi teg title».
const KZ_SIGN_WORD = '(?:qavs|chiziq|скобк|уголк|уголо|черт|bracket|slash)[^\\s,.!?:;]*';   // «уголок» — тоже (иначе «уголок «>»» звучало «уголок правый уголок»)
const KZ_SIGN_NAME = { uz: { '<': 'chap burchakli qavs', '>': 'o‘ng burchakli qavs', '/': 'qiya chiziq' },
  ru: { '<': 'левый уголок', '>': 'правый уголок', '/': 'косая черта' }, en: { '<': 'less-than sign', '>': 'greater-than sign', '/': 'slash' } };
const spokenHtmlL2 = spokenHtml;
// eslint-disable-next-line no-func-assign
spokenHtml = (text, lang) => {
  let s = String(text || '');
  s = s.replace(new RegExp('(' + KZ_SIGN_WORD + ')[\\s:—–-]*[«“"]\\s*[<>/\\\\]\\s*[»”"]', 'gi'), '$1');
  s = s.replace(new RegExp('[«“"]\\s*[<>/\\\\]\\s*[»”"]\\s*(' + KZ_SIGN_WORD + ')', 'gi'), '$1');
  const nm = KZ_SIGN_NAME[lang] || KZ_SIGN_NAME.ru;
  s = s.replace(/[«“"]\s*([<>/\\])\s*[»”"]/g, (all, c) => ' ' + (nm[c] || nm['/']) + ' ');
  if (lang === 'uz') s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => 'yopuvchi ' + t + ' tegi');
  const out = spokenHtmlL2(s, lang);
  return lang === 'uz' ? kzTagWord(out) : out;
};
// Слово «teg» в узбекской речи — по-английски, как названия тегов html, head, title,
// body (заказчик, 23.10.2026): корень уходит в сервис английским «tag», узбекское
// окончание — через дефис («tag-i», «tag-lar»), чтобы «tagi» не прочлось узбекским
// словом. Только формы слова «teg»: «tegishli» и другие слова не трогаем.
const KZ_TEG_SUF = /^(i|ni|ga|da|dan|ning|siz|ini|iga|ida|idan|idagi|ining|lar|lari|larni|larga|larda|lardan|larning|larini|lariga)?$/i;
function kzTagWord(s) {
  return String(s).replace(/(^|[^A-Za-z‘’'ʻʼ])(teg)([A-Za-z‘’ʻʼ]*)/gi,
    (all, pre, root, suf) => (KZ_TEG_SUF.test(suf) ? pre + 'tag' + (suf ? '-' + suf.toLowerCase() : '') : all));
}

// Параллакс слоёв: палец или мышь сдвигают вырезки по углам листа на разную
// глубину. Значения — ступеньками (как кадры stop-motion), без лишних перерисовок.
function useParallax() {
  useEffect(() => {
    if (typeof window === 'undefined' || reduceMotion()) return undefined;
    const root = document.documentElement;
    let last = '';
    const onMove = (e) => {
      const x = Math.round(((e.clientX / window.innerWidth) * 2 - 1) * 4) / 4;
      const y = Math.round(((e.clientY / window.innerHeight) * 2 - 1) * 4) / 4;
      const k = x + ',' + y;
      if (k === last) return;
      last = k;
      root.style.setProperty('--kzx', String(x));
      root.style.setProperty('--kzy', String(y));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}

const KZ = { kraft: '#D8C4A1', paper: '#EFE7D6', face: '#F2D7BC', cream: '#FBF6EA', coral: '#E0643F', mustard: '#F0B13F', teal: '#2A8C7E', ink: '#1F2A44' };
const kzRnd = (seed) => { let s = (Math.abs(seed) * 7919 + 104729) % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };
const TORN = {};
// Рваный прямоугольник: зубцы по четырём сторонам; amp — глубина зубца в % по
// короткой стороне, asp — ширина/высота вырезки (чтобы зубцы были одинаковыми).
function torn(seed, n, amp, asp) {
  const k = seed + ':' + n + ':' + amp + ':' + asp;
  if (TORN[k]) return TORN[k];
  const r = kzRnd(seed);
  const a = asp || 1;
  const ay = a >= 1 ? amp : amp * a, ax = a >= 1 ? amp / a : amp;
  const f = (v) => v.toFixed(2) + '%';
  const nx = Math.max(4, Math.round(n * Math.max(1, a))), ny = Math.max(4, Math.round(n / Math.min(1, a)));
  const p = [];
  for (let i = 0; i < nx; i += 1) p.push(f((i / nx) * 100) + ' ' + f(r() * ay));
  for (let i = 0; i < ny; i += 1) p.push(f(100 - r() * ax) + ' ' + f((i / ny) * 100));
  for (let i = 0; i < nx; i += 1) p.push(f(100 - (i / nx) * 100) + ' ' + f(100 - r() * ay));
  for (let i = 0; i < ny; i += 1) p.push(f(r() * ax) + ' ' + f(100 - (i / ny) * 100));
  TORN[k] = 'polygon(' + p.join(', ') + ')';
  return TORN[k];
}
// Рваный круг (голова, круг в углу листа).
function tornRound(seed, n, amp) {
  const k = 'o' + seed + ':' + n + ':' + amp;
  if (TORN[k]) return TORN[k];
  const r = kzRnd(seed);
  const p = [];
  for (let i = 0; i < n; i += 1) {
    const t = (i / n) * Math.PI * 2;
    const rad = 50 - r() * amp;
    p.push((50 + Math.cos(t) * rad).toFixed(2) + '% ' + (50 + Math.sin(t) * rad).toFixed(2) + '%');
  }
  TORN[k] = 'polygon(' + p.join(', ') + ')';
  return TORN[k];
}

function Cut({ c, seed = 1, n = 10, amp = 3, asp = 1, round, clip, x, y, w, h, r = 0, anim, dl, cls, hl, hlc, boil, onClick, label, children, style, dp }) {
  const st = Object.assign({}, x !== undefined ? { left: x + '%', top: y + '%', width: w + '%', height: h + '%' } : {},
    { '--r': r + 'deg', '--dl': (dl || 0) + 's', '--bd': ((seed % 7) * 0.17).toFixed(2) + 's' }, hlc ? { '--hl': hlc } : {}, dp ? { '--dp': dp } : {}, style || {});
  const cp = clip || (round ? tornRound(seed, n * 3, amp) : torn(seed, n, amp, asp));
  const tap = !!onClick;
  return (
    <span className={'kz-cut' + (anim ? ' kz-a-' + anim : '') + (hl ? ' is-hl' : '') + (boil ? ' kz-boil' : '') + (tap ? ' is-tap' : '') + (cls ? ' ' + cls : '')}
      style={st} onClick={onClick} role={tap ? 'button' : undefined} tabIndex={tap ? 0 : undefined} aria-label={label}
      onKeyDown={tap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}>
      <span className="kz-cut-in" style={{ background: c, clipPath: cp, WebkitClipPath: cp }}>{children}</span>
    </span>
  );
}

// Лист на крафтовом столе + вырезки по углам (скотч, коралловый клочок, круг) —
// они сдвигаются за пальцем на разную глубину (параллакс).
function Sheet({ children, cls }) {
  const cp = torn(5, 30, 1.1, 1.6);
  return (
    <div className={'kz-sheet' + (cls ? ' ' + cls : '')}>
      <div className="kz-sheet-wrap"><div className="kz-sheet-in" style={{ clipPath: cp, WebkitClipPath: cp }} /></div>
      <Cut c={KZ.mustard} seed={11} n={8} amp={10} asp={5} r={-32} cls="kz-deco kz-deco-tape" dp={9} />
      {/* Коралловый клочок вместо треугольника (заказчик, 23.10.2026: треугольник был похож на кнопку «Дальше»). */}
      <Cut c={KZ.coral} seed={12} n={6} amp={9} asp={1.15} r={16} cls="kz-deco kz-deco-scrap" dp={12} />
      <Cut c={KZ.teal} round seed={13} n={8} amp={5} cls="kz-deco kz-deco-dot" dp={7} />
      <div className="kz-sheet-body">{children}</div>
    </div>
  );
}

// Строка задания — бумажная полоска; ступень подсказки встаёт на её место.
function KzAsk({ text, hint, n }) {
  const pick = usePick();
  return (
    <div className="kz-ask-wrap">
      <p className={'kz-ask' + (hint ? ' is-hint' : '')} aria-live="polite">
        {n ? <span className="kz-ask-n">{n}</span> : null}{pick(hint || text)}
      </p>
    </div>
  );
}

// Тег: коралловые уголки и черта, имя чернилами.
function TagK({ t, close }) {
  return <span className="kz-tag" translate="no"><span className="kz-tk-b">{'<'}</span>{close ? <span className="kz-tk-b">/</span> : null}<span className="kz-tk-n">{t}</span><span className="kz-tk-b">{'>'}</span></span>;
}
const tagText = (t, close) => '<' + (close ? '/' : '') + t + '>';

// Бирка на скотче.
function KzLabel({ t, close, raw, cls, style, onClick, led, on, hl, flow, anim, dl, disabled }) {
  const inner = (
    <>
      <span className="kz-label-tape" aria-hidden="true" />
      <span className="kz-label-paper">{raw ? <span translate="no">{raw}</span> : <TagK t={t} close={close} />}</span>
      <Led on={!!led} />
    </>
  );
  const c = 'kz-label' + (flow ? ' kz-flow' : '') + (onClick ? ' is-tap' : '') + (led ? ' is-led' : '') + (on ? ' is-on' : '') + (hl ? ' is-hl' : '') + (anim ? ' kz-a-' + anim : '') + (cls ? ' ' + cls : '');
  const st = Object.assign({ '--dl': (dl || 0) + 's' }, style || {});
  if (onClick) return <button type="button" className={c} style={Object.assign({ border: 'none', background: 'none', padding: 0 }, st)} onClick={onClick} disabled={disabled}>{inner}</button>;
  return <span className={c} style={st}>{inner}</span>;
}

// Код — бумажные полоски. Строка: { k, d, parts: [узлы], cls, onTap, led, disabled }.
// Строка: { k, d, parts, cls, onTap, led, disabled, place, move }.
// move — бумажные кнопки ▲ ▼ справа от строки: { up, down, hl } (обработчики или null;
// hl — стрелки мигают, пока Коди о них говорит), { hide: true } — пустое место
// той же ширины, чтобы строки не прыгали.
function KzCode({ lines, cls }) {
  const pick = usePick();
  return (
    <div className={'kz-code' + (cls ? ' ' + cls : '')} translate="no">
      {lines.map((ln, i) => {
        const st = Object.assign({ '--d': ln.d || 0, '--r': ((i % 2 ? 1 : -1) * (0.25 + (i % 3) * 0.12)).toFixed(2) + 'deg' }, ln.style || {});
        const c = 'kz-line' + (ln.cls ? ' ' + ln.cls : '');
        const body = ln.onTap ? (
          <button key={ln.move ? 'b' : (ln.k || i)} type="button" className={c + ' kz-tap'} style={st} disabled={!!ln.disabled} onClick={ln.onTap} data-place={ln.place}>
            {React.Children.toArray(ln.parts)}<Led on={!!ln.led} />
          </button>
        ) : <div key={ln.move ? 'b' : (ln.k || i)} className={c} style={st} data-place={ln.place}>{React.Children.toArray(ln.parts)}<Led on={!!ln.led} /></div>;
        if (!ln.move) return body;
        const mv = ln.move;
        return (
          <div key={ln.k || i} className="kz-line-row">
            {body}
            <span className={'kz-move' + (mv.hide ? ' is-hide' : '') + (mv.hl ? ' is-hl' : '')}>
              {['up', 'down'].map((d) => (
                <button key={d} type="button" className={'kz-move-b is-' + d} disabled={mv.hide || !mv[d] || !!ln.disabled}
                  onClick={mv[d] || undefined} aria-label={pick(d === 'up' ? UI.up : UI.down)} tabIndex={mv.hide ? -1 : undefined}>
                  <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1.2 6.8 6 2 10.8 6.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
const T_ = (t, close) => <TagK t={t} close={close} />;
const W_ = (s) => <span className="kz-txt">{s}</span>;

// БУМАЖНЫЙ ЧЕЛОВЕЧЕК. Части по порядку сборки: тело, голова, руки, ноги, лицо.
// build — сколько частей уже на листе (каждая влетает своим движением).
// out — части разлетаются (превращение в страницу).
const MAN_PARTS = ['body', 'head', 'armL', 'armR', 'legL', 'legR', 'face'];
// spot — «прожектор» (заказчик, 26.10.2026: подсветку было плохо видно): пока Коди
// говорит о части (hl), она крупнее, остальные части притухают.
// bits — на теле видно, из чего оно собрано: строки текста, картинка и кнопка
// страницы (хук урока 1: «тело собралось из того, что видно на странице»).
// nameIn — внутри головы видна бумажка с названием страницы (хук: «название спряталось в голове»).
function PaperMan({ build = 7, out, headOpen, hl, spot, bits, nameIn, onHead, onBody, onTitle, titleText, titleGone, anim = true, wave }) {
  const has = (k) => MAN_PARTS.indexOf(k) < build;
  const A = (a, d) => (out ? { anim: 'out', dl: d * 0.07 } : anim ? { anim: a, dl: d } : {});
  return (
    <div className={'kz-man' + (spot && hl ? ' is-spot' : '')}>
      {has('legL') ? <Cut c={KZ.ink} seed={41} n={4} amp={9} asp={0.3} x={38} y={64} w={7.5} h={27} r={-2} {...A('rise', 0.1)} /> : null}
      {has('legR') ? <Cut c={KZ.ink} seed={42} n={4} amp={9} asp={0.3} x={54.5} y={64} w={7.5} h={27} r={2} {...A('rise', 0.2)} /> : null}
      {has('armL') ? <Cut c={KZ.ink} seed={43} n={5} amp={12} asp={5} x={4} y={37} w={26} h={5.5} r={22} cls={wave ? 'kz-wave-l' : ''} {...A('left', 0)} /> : null}
      {has('armR') ? <Cut c={KZ.ink} seed={44} n={5} amp={12} asp={5} x={70} y={37} w={26} h={5.5} r={-22} cls={wave ? 'kz-wave-r' : ''} {...A('right', 0.08)} /> : null}
      {has('body') ? (
        <Cut c={KZ.teal} seed={45} n={9} amp={3} asp={1.15} x={27} y={29} w={46} h={38} r={-1} {...A('drop', 0)} boil hl={hl === 'body'} hlc={KZ.teal}
          onClick={onBody} label="body">
          {bits ? <span className="kz-man-bits" aria-hidden="true"><i /><i /><i /><b><s /></b><em /></span> : null}
        </Cut>
      ) : null}
      {titleText && !titleGone ? (
        <Cut c="var(--kz-piece)" seed={46} n={6} amp={8} asp={3} x={24} y={10} w={52} h={12} r={-3} cls="kz-man-title" anim="pop" onClick={onTitle} label="title">
          <span className="kz-man-title-t">{titleText}</span>
        </Cut>
      ) : null}
      {has('head') ? (
        <Cut c={KZ.face} round seed={47} n={9} amp={4} x={31} y={0} w={38} h={33} {...A('drop', 0.18)} boil hl={hl === 'head'} hlc={KZ.mustard}
          onClick={onHead} label="head" style={{ translate: headOpen ? '0 -38%' : '0 0', transition: 'translate .42s steps(5, end)' }}>
          {nameIn ? <span className="kz-man-name kz-a-stamp"><span>{nameIn}</span></span> : null}
          {has('face') ? (
            <span className={'kz-face' + (out ? '' : anim ? ' kz-a-pop' : '')} style={{ '--dl': '0.55s' }} aria-hidden="true">
              <i className="kz-eye" style={{ left: '33%' }} /><i className="kz-eye" style={{ left: '60%' }} /><i className="kz-smile" />
            </span>
          ) : null}
        </Cut>
      ) : null}
    </div>
  );
}

// Рамка html — четыре коралловые полоски; любую можно убрать (s4).
function Frame({ sides, anim, hl }) {
  const S = sides || { top: 1, right: 1, bottom: 1, left: 1 };
  return (
    <>
      {S.top ? <Cut c={KZ.coral} seed={51} n={12} amp={22} asp={22} x={0} y={0} w={100} h={4.2} r={-0.4} anim={anim ? 'drop' : null} hl={hl} /> : null}
      {S.right ? <Cut c={KZ.coral} seed={52} n={12} amp={22} asp={0.045} x={95.6} y={0} w={4.4} h={100} r={0.3} anim={anim ? 'right' : null} dl={0.1} hl={hl} /> : null}
      {S.bottom ? <Cut c={KZ.coral} seed={53} n={12} amp={22} asp={22} x={0} y={95.8} w={100} h={4.2} r={0.4} anim={anim === 'all' ? 'rise' : S.bottom === 'new' ? 'left' : null} dl={0.2} hl={hl} /> : null}
      {S.left ? <Cut c={KZ.coral} seed={54} n={12} amp={22} asp={0.045} x={0} y={0} w={4.4} h={100} r={-0.3} anim={anim ? 'left' : null} dl={0.15} hl={hl} /> : null}
    </>
  );
}

// Сцена «человечек в рамке»: рамка по краю, человечек внутри. br — вместо
// человечка бумажный браузер (экраны 3–5 урока 1: рамка html обнимает весь
// браузер — и вкладку, и окно; заказчик, 26.10.2026: «как раньше, вместе с
// вкладками»); сцена тогда шире.
function ManBox({ frame, frameSides, frameAnim, frameHl, labels, man, br, cls, children }) {
  return (
    <div className={'kz-stagebox' + (br ? ' is-br' : '') + (cls ? ' ' + cls : '')}>
      {frame ? <Frame sides={frameSides} anim={frameAnim} hl={frameHl} /> : null}
      {br ? <div className="kz-brbox">{br}</div> : <div className="kz-manbox">{man}</div>}
      {labels}
      {children}
    </div>
  );
}

// БУМАЖНЫЙ БРАУЗЕР — узнаваемый Chrome в Windows, только из бумаги: тёмная
// полоса вкладок (вкладка с значком, именем и крестиком, «+»), кнопки окна
// «– □ ×», полоса со стрелками и адресной строкой, под ней страница.
// url — файл открытой страницы в адресной строке (урок 4: ссылка меняет адрес),
// urlHl — подсветить адрес, onBack — стрелка «назад» нажимается.
// spot — «прожектор» на вкладку ('tab') или окно ('page'), пока Коди о них говорит
// (заказчик, 26.10.2026: смены цвета вкладки было не видно): вкладка крупнее, вокруг —
// круг, обведённый «от руки» (KzRing); окно — лист приподнимается и светится бирюзой
// (круг на окне выглядел странно); остальной браузер притухает.
function PaperBrowser({ title, children, tabHl, pageHl, stamp, short, cls, tabRef, pageRef, url, urlHl, onBack, spot }) {
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  const rootRef = useRef(null);
  const [ring, setRing] = useState(null);
  useLayoutEffect(() => {
    // Круг «от руки» — только у вкладки; окно в прожекторе само приподнимается и светится.
    if (spot !== 'tab') { setRing(null); return; }
    const root = rootRef.current;
    const el = root && root.querySelector(spot === 'tab' ? '.kz-br-tab' : '.kz-br-body');
    if (!el) return;
    let x = 0, y = 0, n = el;
    while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    const w = el.offsetWidth, h = el.offsetHeight;
    // Вкладка в прожекторе растёт от левого нижнего угла (kzSpotTab в kollazh.css) — круг вокруг уже большой.
    const k = spot === 'tab' ? 1.3 : 1;
    const pad = spot === 'tab' ? 9 : 7;
    setRing({ x: x - pad, y: y + h - h * k - pad, w: w * k + pad * 2, h: h * k + pad * 2, c: spot === 'tab' ? '#E0643F' : '#2A8C7E' });
  }, [spot, t]);
  return (
    <div ref={rootRef} className={'kz-br' + (short ? ' is-short' : '') + (pageHl ? ' is-hl-page' : '') + (spot ? ' is-spot-' + spot : '') + (cls ? ' ' + cls : '')}>
      <Cut c={KZ.ink} seed={31} n={16} amp={1.4} asp={1.6} cls="kz-br-frame" />
      <div className="kz-br-bar">
        <span ref={tabRef} key={'tab' + (stamp || 0)} className={'kz-br-tab' + (tabHl ? ' is-hl' : '') + (stamp ? ' kz-a-stamp' : '')}>
          <i className="kz-br-fav" aria-hidden="true" />
          <span className={'kz-br-tab-t' + (t ? '' : ' is-file')}>{t || 'index.html'}</span>
          <i className="kz-br-x" aria-hidden="true" />
        </span>
        <span className="kz-br-plus" aria-hidden="true" />
        <span className="kz-br-win" aria-hidden="true"><i className="kz-w-min" /><i className="kz-w-max" /><i className="kz-w-close" /></span>
      </div>
      <div className="kz-br-tool">
        <Cut c="#E6DCC6" seed={33} n={12} amp={6} asp={12} cls="kz-br-tool-bg" />
        <span className="kz-br-arrows">{onBack ? <button type="button" className="kz-ar-l kz-ar-btn" onClick={onBack} aria-label="Back" /> : <i className="kz-ar-l" aria-hidden="true" />}<i className="kz-ar-r" aria-hidden="true" /></span>
        <span className={'kz-br-url' + (urlHl ? ' is-hl' : '')}><i className="kz-br-lock" aria-hidden="true" /><span key={'u' + (url || '')} className={'kz-br-url-t' + (stamp && url ? ' kz-a-stamp' : '')}>{url || 'index.html'}</span></span>
      </div>
      <div className="kz-br-body">
        <Cut c={KZ.cream} seed={32} n={16} amp={1.1} asp={1.6} cls="kz-br-paper" />
        <div ref={pageRef} className="kz-br-page">{children}</div>
      </div>
      {ring ? <KzRing key={spot} box={ring} /> : null}
    </div>
  );
}
// Круг «от руки»: овал с заходом конца за начало, рисуется ступеньками, как маркером.
function KzRing({ box }) {
  return (
    <svg className="kz-ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
      style={{ left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px', '--rc': box.c }}>
      <path pathLength="100" d="M9 60C4 30 30 6 58 7C86 9 99 30 95 55C91 82 62 96 36 93C12 90 1 72 6 46C9 31 21 18 40 13" />
    </svg>
  );
}
// Содержимое страницы — бумажные вырезки: строки текста, картинка, кнопка.
function PageBits({ text, bits, anim }) {
  const pick = usePick();
  return (
    <div className="kz-bits">
      {text ? <div className={'kz-br-text' + (anim ? ' kz-a-drop' : '')}>{text}</div> : null}
      {bits ? (
        <div className="kz-bits-row">
          <span className="kz-bit-lines">
            {[0, 1, 2].map((i) => <Cut key={i} c={KZ.ink} seed={60 + i} n={6} amp={14} asp={9} cls="kz-bit-line" anim={anim ? 'left' : null} dl={0.1 * i} style={{ width: (88 - i * 18) + '%' }} />)}
          </span>
          <Cut c={KZ.teal} seed={64} n={6} amp={5} cls="kz-bit-pic" anim={anim ? 'pop' : null} dl={0.35}>
            <span className="kz-pic-sun" /><span className="kz-pic-mnt" />
          </Cut>
          <Cut c={KZ.coral} seed={65} n={5} amp={8} asp={3} cls="kz-bit-btn" anim={anim ? 'rise' : null} dl={0.5}><span>{pick(UI.play)}</span></Cut>
        </div>
      ) : null}
    </div>
  );
}

// Мини-страница в разрезе (как финальный кадр ролика): рамка html, голова head
// с title, тело body с текстом — с бирками.
function PageCollage({ title, text, show, hl, anim }) {
  const S = show || { doc: 1, html: 1, head: 1, title: 1, body: 1, text: 1 };
  const pick = usePick();
  const H = (k) => (Array.isArray(hl) ? hl.indexOf(k) >= 0 : hl === k);   // подсветка: одна часть или несколько
  return (
    <div className="kz-collage">
      {S.doc ? <KzLabel raw="<!DOCTYPE html>" cls={'kz-col-doc' + (H('doc') ? ' is-on' : '')} anim={anim ? 'drop' : null} /> : null}
      {S.html ? (
        <Cut c={KZ.coral} seed={71} n={14} amp={1.8} asp={1.3} cls="kz-col-html" anim={anim ? 'drop' : null} hl={H('html')} hlc={KZ.coral}>
          <span className="kz-col-in">
            {S.head ? (
              <Cut c={KZ.mustard} seed={72} n={12} amp={4} asp={4} cls="kz-col-head" anim={anim ? 'left' : null} hl={H('head') || H('title')} hlc={KZ.mustard}>
                {S.title ? <span className={'kz-col-title' + (anim ? ' kz-a-pop' : '')}><TagK t="title" />{title || pick(UI.mySite)}<TagK t="title" close /></span> : null}
              </Cut>
            ) : null}
            {S.body ? (
              <Cut c={KZ.teal} seed={73} n={12} amp={3} asp={1.8} cls="kz-col-body" anim={anim ? 'rise' : null} hl={H('body')} hlc={KZ.teal}>
                {S.text ? <span className={'kz-col-text' + (anim ? ' kz-a-pop' : '')}>{text}</span> : null}
              </Cut>
            ) : null}
          </span>
        </Cut>
      ) : null}
      {S.html ? <KzLabel t="html" cls="kz-col-lbl kz-col-lbl-html" /> : null}
      {S.html && S.head ? <KzLabel t="head" cls="kz-col-lbl kz-col-lbl-head" /> : null}
      {S.html && S.body ? <KzLabel t="body" cls="kz-col-lbl kz-col-lbl-body" /> : null}
    </div>
  );
}

// ЛЕСЕНКА ПОДСКАЗОК: ступень поднимает лампочка в шапке или затруднение.
function useKzLadder(active) {
  const [lv, setLv] = useState(0);
  const asked = useRef(0);
  const pulse = useHintPulse();
  const p0 = useRef(pulse);
  const act = useRef(active);
  act.current = active;
  useEffect(() => {
    if (pulse === p0.current) return;
    p0.current = pulse;
    if (!act.current) return;
    asked.current += 1;
    setLv((l) => Math.min(3, l + 1));
  }, [pulse]);
  const bump = useCallback(() => setLv((l) => Math.min(3, l + 1)), []);
  const reset = useCallback(() => { setLv(0); asked.current = 0; }, []);
  return { lv, bump, reset, asked };
}
const hintAt = (lv, hints) => (lv > 0 && hints && hints[lv - 1] ? hints[lv - 1] : null);
const navOf = (p, canGo) => <><BackBtn onPrev={p.prev} /><NextBtn disabled={!canGo} onClick={p.next} /></>;

// ПЕРЕТАСКИВАНИЕ: деталь тянется за пальцем; место — [data-place] под пальцем
// при отпускании. Короткое касание остаётся нажатием («выбери, потом место»).
// ПЕРЕТАСКИВАНИЕ вырезок: взятая вырезка на столе становится пунктирным
// следом (is-lifted), за пальцем летит её бумажная копия — приподнятая (тень
// больше), чуть наклоняется по ходу движения; место под ней подсвечивается.
// Не туда или мимо (onDrop вернул false или места нет) — копия ступенчато
// возвращается на своё место. Нажатие без сдвига остаётся обычным касанием.
function useKzDrag(onDrop) {
  const drag = useRef(null);
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;
  const [ghost, setGhost] = useState(null);
  const [hover, setHover] = useState(null);
  const backT = useRef(0);
  const start = (e, payload, label) => {
    if (e.button > 0) return;
    const el = e.currentTarget;
    drag.current = { payload, label, x: e.clientX, y: e.clientY, lx: e.clientX, rot: 0, moved: false, el, touch: e.pointerType === 'touch' };
  };
  useEffect(() => {
    const placeAt1 = (x, y) => { const el = document.elementFromPoint(x, y); const z = el && el.closest && el.closest('[data-place]'); return z ? z.getAttribute('data-place') : null; };
    // Копия летит выше пальца (на телефоне — заметно выше), и ученик целится ею:
    // место ищется сначала под центром копии, потом под пальцем.
    const placeAt = (x, y, touch) => placeAt1(x, y - (touch ? 40 : 14)) || placeAt1(x, y);
    const lift = (d, on) => { if (d && d.el && d.el.classList) d.el.classList.toggle('is-lifted', on); };
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 7) { d.moved = true; lift(d, true); clearTimeout(backT.current); }
      if (!d.moved) return;
      // Наклон по ходу движения, ступеньками по 3° — как бумажка в пальцах.
      d.rot = Math.max(-14, Math.min(14, d.rot * 0.7 + (e.clientX - d.lx) * 0.9));
      d.lx = e.clientX;
      setGhost({ label: d.label, x: e.clientX, y: e.clientY, rot: Math.round(d.rot / 3) * 3, touch: d.touch });
      setHover(placeAt(e.clientX, e.clientY, d.touch));
    };
    const up = (e) => {
      const d = drag.current;
      drag.current = null;
      setHover(null);
      if (!d || !d.moved) { setGhost(null); return; }
      const where = placeAt(e.clientX, e.clientY, d.touch);
      const res = where ? dropRef.current(d.payload, where, document.elementFromPoint(e.clientX, e.clientY)) : false;
      if (res !== false || !d.el || !d.el.isConnected || reduceMotion()) { setGhost(null); lift(d, false); return; }
      const r = d.el.getBoundingClientRect();
      setGhost({ label: d.label, x: r.left + r.width / 2, y: r.top + r.height / 2, rot: 0, back: true, touch: false });
      clearTimeout(backT.current);
      backT.current = setTimeout(() => { setGhost(null); lift(d, false); }, 300);
    };
    const cancel = () => { lift(drag.current, false); drag.current = null; setGhost(null); setHover(null); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => { clearTimeout(backT.current); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
  }, []);
  return { start, ghost, hover, active: !!ghost && !ghost.back };
}
function KzGhost({ ghost }) {
  if (!ghost) return null;
  return (
    <div className={'kz-ghost' + (ghost.back ? ' is-back' : '') + (ghost.touch ? ' is-touch' : '')} aria-hidden="true"
      style={{ left: ghost.x, top: ghost.y, '--gr': (ghost.rot || 0) + 'deg' }}>
      <span className="kz-ghost-in" translate="no">{ghost.label}</span>
    </div>
  );
}

// ПЕРЕЛЁТ вырезки к месту (stop-motion): ступенчато, с уменьшением до размера
// цели; в конце гаснет. Возвращает false, если лететь нечему.
function kzFly(el, to, ms) {
  if (!el || !to) return false;
  const d = ((ms || 780) / 1000).toFixed(2);
  const a = el.getBoundingClientRect(), b = to.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const k = Math.max(0.15, Math.min(b.width / a.width, b.height / a.height, 1.2));
  el.style.animation = 'none';
  el.style.zIndex = '60';
  el.style.transition = 'translate ' + d + 's steps(9, end), scale ' + d + 's steps(9, end), opacity .16s linear ' + (d - 0.1).toFixed(2) + 's';
  el.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
  el.style.scale = k.toFixed(3);
  el.style.opacity = '0';
  return true;
}

// РУКА-ПОКАЗ (по образцу DemoHand эталона, только бумажная): рука нажимает
// первую цель и, не отпуская, ведёт её копию ко второй — так показывается
// перетаскивание. Повторяет дважды, исчезает от первого касания ученика, на
// паузе стоит. Позиции — внутри листа (.kz-sheet-body).
function KzHand({ targets, run, label }) {
  const audio = useAudio();
  const pausedRef = useRef(false);
  pausedRef.current = !!(audio && audio.paused);
  const [pos, setPos] = useState(null);
  const [tap, setTap] = useState(false);
  const [carry, setCarry] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!run || gone) return undefined;
    const off = () => setGone(true);
    window.addEventListener('pointerdown', off, true);
    return () => window.removeEventListener('pointerdown', off, true);
  }, [run, gone]);
  useEffect(() => {
    if (!run || gone) { setPos(null); return undefined; }
    let dead = false;
    const tm = [];
    const at = (i) => {
      const el = targets[i] && targets[i]();
      const w = el && el.closest('.kz-sheet-body');
      if (!w) return null;
      const W = w.getBoundingClientRect(), R = el.getBoundingClientRect();
      return { x: R.left + R.width / 2 - W.left, y: R.top + R.height / 2 - W.top };
    };
    const later = (ms, f) => { tm.push(setTimeout(() => { if (!dead) f(); }, ms)); };
    let loop = 0;
    const cycle = () => {
      if (dead) return;
      if (pausedRef.current) { later(400, cycle); return; }
      if (loop >= 2) { setPos(null); return; }
      loop += 1;
      const a = at(0);
      if (!a) { later(400, cycle); return; }
      setTap(false); setCarry(false); setPos(a);
      if (reduceMotion()) return;
      // Взятая вырезка на столе — пунктирный след, как при настоящем перетаскивании.
      const src = () => targets[0] && targets[0]();
      const lift = (on) => { const el = src(); if (el && el.classList) el.classList.toggle('is-lifted', on); };
      later(800, () => { setTap(true); setCarry(true); lift(true); });
      later(1150, () => { const b = at(1); if (b) setPos(b); });
      later(2500, () => { setTap(false); setCarry(false); lift(false); });
      later(3300, cycle);
    };
    later(500, cycle);
    return () => {
      dead = true; tm.forEach(clearTimeout);
      const el = targets[0] && targets[0]();
      if (el && el.classList) el.classList.remove('is-lifted');
    };
  }, [run, gone]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!pos || !run || gone) return null;
  return (
    <span className="kz-hand-layer" aria-hidden="true">
    <span className={'kz-hand' + (tap ? ' is-tap' : '') + (carry ? ' is-carry' : '')} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      {carry && label ? <span className="kz-hand-ghost" translate="no">{label}</span> : null}
      <span className="kz-hand-ring" />
      <svg viewBox="0 0 40 48" width="38" height="46">
        <path d="M14 6a4 4 0 0 1 8 0v15a4 4 0 0 1 7 1 4 4 0 0 1 7 2v10c0 7-5 12-13 12h-3c-5 0-8-2-11-6l-6-9a3.6 3.6 0 0 1 5.6-4.4L14 30z"
          fill="#FBF6EA" stroke={KZ.ink} strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
    </span>
    </span>
  );
}

// ПОКАЗ НА ЭКРАНАХ-ОБЪЯСНЕНИЯХ (заказчик, 23.10.2026): на объяснении ученик
// ничего не делает — всё показывает Коди, а вещи меняются сами, под речь.
// Руки и кнопок, которые «нажимаются», на объяснениях нет (заказчик, 23.10.2026:
// «показать, как рука нажимает, очень некрасиво»). Чтобы не было ощущения
// «смотрю и скучаю»: после каждой короткой фразы что-то происходит — вещь, о
// которой речь, коротко загорается и сама меняется (штамп, влёт, перелёт),
// со звуком; «Дальше» загорается по окончании показа, «Повторить» в шапке —
// посмотреть ещё раз.
//
// Сценарий — шаги по порядку:
//   { say: [{ text, pose }, …] } — Коди говорит; дальше — когда договорил;
//   { look: () => элемент, act } — элемент коротко загорается, потом act;
//   { act } — сразу; { wait: мс } — пауза (полёт, чтение браузера).
// Первые реплики экрана — как обычно, в useVoice; показ начинается, когда они
// сказаны. run = false (экран уже решён) — показа нет.
function useKzDemo({ steps, run: run0, spoken, sayNow, say }) {
  // Показ, раз начавшись, доигрывается до конца: экран мог отметиться пройденным
  // (run стал false) раньше последних реплик — тогда они не звучали.
  const runRef = useRef(run0);
  const run = runRef.current;
  const [idx, setIdx] = useState(-1);
  const ran = useRef(-1);
  const tm = useRef([]);
  const audio = useAudio();
  const pausedRef = useRef(false);
  pausedRef.current = !!(audio && audio.paused);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const later = (ms, f) => {
    const go = () => { if (pausedRef.current) { tm.current.push(setTimeout(go, 300)); return; } f(); };
    tm.current.push(setTimeout(go, ms));
  };
  const next = (i) => setIdx((v) => (v === i ? i + 1 : v));
  // Вещь загорается (мягкое свечение и лёгкий подъём ступеньками), потом меняется.
  const lookAt = (el, i, act) => {
    const done = () => { if (act) act(); next(i); };
    if (!el || !el.classList || reduceMotion()) { done(); return; }
    el.classList.add('kz-demo-on');
    later(560, done);
    later(900, () => el.classList.remove('kz-demo-on'));
  };
  useEffect(() => {
    if (!run) return;
    if (idx === -1) { if (spoken) setIdx(0); return; }
    const st = steps[idx];
    if (!st) return;
    if (ran.current !== idx) {
      ran.current = idx;
      const i = idx;
      if (st.say) { sayNow(st.say[0].text, st.say[0].pose); st.say.slice(1).forEach((l) => say(l.text, l.pose)); return; }
      if (st.look) { later(200, () => lookAt(st.look(), i, st.act)); return; }
      if (st.wait) { if (st.act) st.act(); later(st.wait, () => next(i)); return; }
      if (st.act) st.act();
      next(i);
      return;
    }
    if (st.say && spoken) next(idx);
  }, [idx, spoken, run]); // eslint-disable-line react-hooks/exhaustive-deps
  return { idx, done: !run || idx >= steps.length, step: Math.max(0, Math.min(idx, steps.length)) };
}

// Текст ученика (или образец) — сквозной для экранов 7–15.
const okText = (s) => hasLetters(s) && !hasTags(s);
const useMine = () => {
  const store = useStore();
  const pick = usePick();
  return { title: store.get('myTitle') || pick(UI.mySite), text: store.get('myText') || pick(UI.hello) };
};
// =============================================================================
// СВОЙ ТЕКСТ УЧЕНИКА (урок 1: s7 — название, s10 — приветствие; урок 2: свой заголовок
// и свой абзац). Общий для бумажных уроков. Предпросмотр — сразу
// при наборе; засчитывается только по кнопке «Готово» (заказчик, 23.10.2026:
// пауза в наборе не завершает задание — ребёнок мог остановиться после первой
// буквы). Пустое поле, одни пробелы и теги не принимаются. Похвала и событие в
// журнале — один раз. После засчёта правка сохраняется сама (страница и
// итоговый артефакт берут новый текст), «Готово» её отмечает, без новой похвалы.
// =============================================================================
function useTypedDone({ storeKey, screenId, type, lad }) {
  const log = useLog();
  const store = useStore();
  const [rec, put] = useRec(screenId);
  const solved = !!(rec && rec.done);
  const [val, setVal] = useState(store.get(storeKey) || '');
  const [saved, setSaved] = useState(store.get(storeKey) || '');
  const [stamp, setStamp] = useState(0);
  const doneRef = useRef(solved);
  useEffect(() => {
    if (!doneRef.current || !okText(val) || val.trim() === saved) return;
    store.set(storeKey, val.trim()); setSaved(val.trim());
  }, [val]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = okText(val);   // повторное «Готово» после засчёта только отмечает текст: похвала и журнал — один раз
  const commit = (first) => {
    if (!okText(val)) return false;
    const v = val.trim();
    store.set(storeKey, v); setSaved(v); setStamp((x) => x + 1); sfx('ok', true);
    if (!doneRef.current) {
      doneRef.current = true;
      put({ done: true });
      log({ screenId, type, correct: true, hints: lad.asked.current, depth: lad.lv });
      if (first) first();
    }
    return true;
  };
  return { solved, val, setVal, saved, stamp, ready, commit, shown: okText(val) ? val : saved };
}
// Кнопка «Готово» под кодом: горит, когда текст можно засчитать.
function ReadyBtn({ on, glow, onClick }) {
  const pick = usePick();
  return (
    <div className="kz-row">
      <button type="button" className="kz-btn is-coral kz-ready" disabled={!on} onClick={onClick}>{pick(UI.ready)}<Led on={glow} /></button>
    </div>
  );
}

function makeArtifact(store) {
  const t = store.get('myTitle'), x = store.get('myText');
  if (!t && !x) return null;
  return { type: 'html-page', title: t || '', text: x || '',
    html: ['<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(t || '') + '</title>', '  </head>', '  <body>', '    ' + escHtml(x || ''), '  </body>', '</html>'].join('\n') };
}
