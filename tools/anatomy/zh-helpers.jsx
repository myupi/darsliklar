// ─────────────────────────────────────────────────────────────────────────────
// ТЕГИ ВСЛУХ — SpokenTags
// На экране тег пишется точно (title, </body>), а сервис озвучки прочёл бы
// латиницу посреди узбекской или русской фразы как попало. Поэтому перед
// отправкой в озвучку теги и знаки разметки заменяются понятными словами.
// Обёртка ставится вокруг экрана внутри Shell и подменяет только speak():
// пауза, повтор и флаги идут из канона как есть.
// ─────────────────────────────────────────────────────────────────────────────
// Названия тегов вслух — по-английски во всех языках (заказчик, 17.10.2026:
// «body, а не бади»): сервис читает их как английские слова. Остальные слова
// (закрывающий тег, уголок, косая черта) — на языке урока.
const TAG_SAY = {
  ru: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    close: 'закрывающий тег', lt: 'уголок', gt: 'закрывающий уголок', slash: 'косая черта' },
  uz: { html: 'HTML', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    close: 'yopuvchi teg', lt: 'ochuvchi burchak', gt: 'yopuvchi burchak', slash: 'qiya chiziq' },
  en: { html: 'H T M L', head: 'head', title: 'title', body: 'body', doctype: 'doctype',
    close: 'closing tag', lt: 'less-than sign', gt: 'greater-than sign', slash: 'slash' }
};
function spokenHtml(text, lang) {
  const m = TAG_SAY[lang] || TAG_SAY.ru;
  const word = (t) => m[String(t).toLowerCase()] || t;
  let s = String(text || '');
  s = s.replace(/<!DOCTYPE\s+html>/gi, m.doctype + ' ' + m.html);
  s = s.replace(/<\s*\/\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => m.close + ' ' + word(t));
  s = s.replace(/<\s*([a-z][a-z0-9]*)\s*>/gi, (all, t) => word(t));
  s = s.replace(/\b(html|HTML|head|title|body|DOCTYPE)\b/g, (w) => word(w));
  s = s.replace(/</g, ' ' + m.lt + ' ').replace(/>/g, ' ' + m.gt + ' ').replace(/\s\/\s/g, ' ' + m.slash + ' ');
  return s.replace(/\s+/g, ' ').trim();
}
// Реплики героя в данных экрана — для прогрева озвучки. spokenOf канона знает
// только ключи Курса 0 (say, why, hints …), а у реплик урока ключи свои
// (cast, praise, wrong, typeMsg …). Поэтому берём всё, кроме подписей,
// которые только печатаются, и шаблонов с подстановкой {tag}.
const PRINTED = { eyebrow: 1, ask: 1, ask2: 1, ask3: 1, askDone: 1, askFill: 1, opts: 1, words: 1,
  rounds: 1, rules: 1, skills: 1, next: 1, btn: 1, exTitle: 1, exText: 1, demo: 1, practice: 1,
  title: 1, sel: 1, icon: 1, id: 1, pose: 1, show: 1, step: 1 };
function heroLines(node, lang, out, parent) {
  const acc = out || [];
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((x) => heroLines(x, lang, acc, parent)); return acc; }
  if (node.uz !== undefined || node.ru !== undefined) {
    const s = node[lang] !== undefined ? node[lang] : node.ru;
    if (typeof s === 'string' && s.indexOf('{') < 0) acc.push(s);
    return acc;
  }
  Object.keys(node).forEach((k) => {
    if (PRINTED[k] || (k === 'text' && parent === 'steps')) return;
    heroLines(node[k], lang, acc, k);
  });
  return acc;
}

function SpokenTags({ children }) {
  const audio = useAudio();
  const lang = useLang();
  const value = useMemo(() => (audio ? Object.assign({}, audio, {
    speak: (text, gender, onStart, fon) => audio.speak(spokenHtml(text, lang), gender, onStart, fon)
  }) : audio), [audio, lang]);
  return <AudioProvider value={value}>{children}</AudioProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ЦВЕТА ТЕГОВ. Один тег — один цвет во всём уроке: в коде, на контейнерах, на
// вкладке и странице мини-браузера. Красного нет: он в курсе читается ошибкой.
// Тона тёмные: текст тега читается на белом с контрастом от 4.9:1.
// ─────────────────────────────────────────────────────────────────────────────
// Палитра тегов разведена с цветами-сигналами урока: оранжевый — интерфейс,
// жёлтый — подсказка, зелёный — «верно». Поэтому теги — графит, фиолетовый,
// ягодный и стальной голубой: ни один не читается как кнопка или как оценка.
// Все четыре — одной светлоты и насыщенности (OKLCH L≈0.52): ни один тег не
// темнее и не ярче соседних, контраст каждого на белом — от 5.4:1.
const TAGC = { html: '#586A83', head: '#6F57AB', title: '#9F4471', body: '#1171A0' };
const DEPTH = { html: 0, head: 1, body: 1, title: 2 };

// ─────────────────────────────────────────────────────────────────────────────
// МОДЕЛЬ ДОКУМЕНТА. Документ — список строк по id. Вложенность (отступ и
// цветные скобки слева) считается по фактическому порядку строк, а не задаётся
// руками: если строка стоит не на месте, отступ это честно показывает.
// ─────────────────────────────────────────────────────────────────────────────
const FULL_DOC = ['doctype', 'html-o', 'head-o', 'title', 'head-c', 'body-o', 'text', 'body-c', 'html-c'];
const OPENS = { 'html-o': 'html', 'head-o': 'head', 'body-o': 'body' };
const CLOSES = { 'html-c': 'html', 'head-c': 'head', 'body-c': 'body' };
const LINE_TOKS = {
  doctype: () => [{ k: 'doctype', z: 'doctype' }],
  'html-o': () => [{ k: 'open', tag: 'html', z: 'html-o' }],
  'head-o': () => [{ k: 'open', tag: 'head', z: 'head-o' }],
  title: (v) => [{ k: 'open', tag: 'title', z: 'title-o' }, { k: 'text', v: v.title, z: 'title-text', slot: 'title' },
    { k: 'close', tag: 'title', z: 'title-c' }],
  'head-c': () => [{ k: 'close', tag: 'head', z: 'head-c' }],
  'body-o': () => [{ k: 'open', tag: 'body', z: 'body-o' }],
  text: (v) => [{ k: 'text', v: v.text, z: 'body-text', slot: 'text' }],
  'body-c': () => [{ k: 'close', tag: 'body', z: 'body-c' }],
  'html-c': () => [{ k: 'close', tag: 'html', z: 'html-c' }]
};

function buildLines(order, v) {
  const stack = [];
  return order.map((id, n) => {
    if (!id || !LINE_TOKS[id]) return { id: 'gap' + n, key: 'gap' + n, d: stack.length, reg: stack.slice(), toks: [], empty: true };
    let d = stack.length;
    let reg;
    if (OPENS[id]) { reg = stack.concat([OPENS[id]]); stack.push(OPENS[id]); }
    else if (CLOSES[id]) {
      const k = stack.lastIndexOf(CLOSES[id]);
      if (k >= 0) { reg = stack.slice(0, k + 1); d = k; stack.splice(k); } else reg = stack.slice();
    } else if (id === 'title') reg = stack.concat(['title']);
    else reg = stack.slice();
    if (id === 'doctype') { d = 0; reg = []; }
    return { id, key: id, d, reg, toks: LINE_TOKS[id](v || {}) };
  });
}

// Готовая разметка — для артефакта и экрана «Мой первый сайт».
const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const buildHtml = (title, text) => [
  '<!DOCTYPE html>', '<html>', '  <head>', '    <title>' + escHtml(title) + '</title>', '  </head>',
  '  <body>', '    ' + escHtml(text), '  </body>', '</html>'
].join('\n');

// Осмысленный текст: хотя бы две буквы и без разметки.
const hasLetters = (s) => (String(s || '').match(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ‘’]/g) || []).length >= 2;
const hasTags = (s) => /[<>]/.test(String(s || ''));

const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────────────────────────────────────
// ТЕГ И СТРОКИ КОДА
// ─────────────────────────────────────────────────────────────────────────────
function Tag({ tag, close, doctype, big }) {
  if (doctype) return <span className="tk-doc">{'<!DOCTYPE html>'}</span>;
  return (
    <span className={'tk-tag' + (big ? ' is-big' : '')} style={{ '--c': TAGC[tag] || T.ink2 }}>
      <span className="tk-br">{'<'}</span>
      {close ? <span className="tk-sl">/</span> : null}
      <span className="tk-nm">{tag}</span>
      <span className="tk-br">{'>'}</span>
    </span>
  );
}

// Один токен строки. zone(z, tok) → { tap, cls, disabled, led } решает экран.
function Token({ t, zone, onZone, regZone, renderText }) {
  const st = zone ? zone(t.z, t) : null;
  const inner = t.k === 'text'
    ? (renderText ? renderText(t) : <span className="tk-text">{t.v ? t.v : ' '}</span>)
    : <Tag tag={t.tag} close={t.k === 'close'} doctype={t.k === 'doctype'} />;
  const ref = regZone && t.z ? (el) => regZone(t.z, el) : undefined;
  if (st && st.tap) {
    return (
      <button type="button" ref={ref} className={'tk tk-btn' + (st.cls ? ' ' + st.cls : '')} style={st.style}
        disabled={!!st.disabled} onClick={(e) => { if (onZone) onZone(t.z, e.currentTarget, t); }}>
        {inner}
        <Led on={!!st.led} />
      </button>
    );
  }
  return <span ref={ref} className={'tk' + (st && st.cls ? ' ' + st.cls : '')} style={st ? st.style : undefined}>{inner}</span>;
}

// Строки кода. Цветные скобки слева — контейнеры, в которые строка вложена;
// barsFor ограничивает, какие из них рисовать (на «Найди пару» скобка
// появляется только у найденной пары). hl — контейнер, который подсвечен.
function CodeLines({ lines, hl, barsFor, zone, onZone, regZone, renderText, lineProps, className, numbers = true }) {
  return (
    <div className={'cv' + (className ? ' ' + className : '')} translate="no">
      {lines.map((ln, i) => {
        const inHl = !hl || ln.reg.indexOf(hl) >= 0;
        const conts = ln.reg.filter((r) => r !== 'title' && (!barsFor || barsFor.indexOf(r) >= 0));
        const extra = lineProps ? (lineProps(ln, i) || {}) : {};
        const body = (
          <>
            {numbers ? <span className="cv-n mono" aria-hidden="true">{i + 1}</span> : null}
            {conts.map((r) => (
              <span key={r} aria-hidden="true"
                className={'cv-bar' + (ln.id === r + '-o' ? ' is-first' : '') + (ln.id === r + '-c' ? ' is-last' : '')}
                style={{ '--c': TAGC[r], '--lv': DEPTH[r] }} />
            ))}
            <span className="cv-code">
              {ln.empty ? (extra.empty || <span className="cv-empty" />) : ln.toks.map((t, j) => (
                <Token key={j} t={t} zone={zone} onZone={onZone} regZone={regZone} renderText={renderText} />
              ))}
            </span>
            {extra.after || null}
          </>
        );
        const cls = 'cv-line' + (hl ? (inHl ? ' is-in' : ' is-out') : '') + (extra.cls ? ' ' + extra.cls : '')
          + (ln.reg.indexOf('title') >= 0 && barsFor && barsFor.indexOf('title') >= 0 ? ' is-title-pair' : '');
        const style = { '--d': ln.d, '--hc': hl ? TAGC[hl] : 'transparent' };
        if (extra.onTap) {
          return (
            <button type="button" key={ln.key} className={cls + ' cv-tap'} style={style} disabled={!!extra.disabled}
              onClick={(e) => extra.onTap(e.currentTarget)}>
              {body}
              <Led on={!!extra.led} />
            </button>
          );
        }
        return <div key={ln.key} className={cls} style={style}>{body}</div>;
      })}
    </div>
  );
}

// Текст, который «печатается» по буквам. При «меньше движения» — сразу целиком.
function TypeText({ text, speed = 42 }) {
  const s = String(text || '');
  const [n, setN] = useState(() => (reduceMotion() ? s.length : 0));
  useEffect(() => {
    if (reduceMotion()) { setN(s.length); return undefined; }
    setN(0);
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= s.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [s, speed]);
  return <>{s.slice(0, n)}{n < s.length ? <span className="tt-caret" aria-hidden="true" /> : null}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// МИНИ-БРАУЗЕР — главный инструмент урока. Вкладка и страница; страница
// показывает HTML без оформления — так, как его рисует браузер по умолчанию.
// hl подсвечивает часть цветом тега: html — всё окно, head — полоску вкладки и
// «сведения о странице», title — вкладку, body — страницу.
// ─────────────────────────────────────────────────────────────────────────────
function MiniBrowser({ title, page, hl, tabRef, pageRef, flashTab, flashPage, pins, info, compact, typed }) {
  const pick = usePick();
  const t = title != null && String(title).trim() !== '' ? String(title) : '';
  return (
    <div className={'mb' + (hl ? ' mb-hl-' + hl : '') + (compact ? ' mb-compact' : '')}>
      <div className="mb-top">
        <span ref={tabRef} key={'tab' + (flashTab || 0)} className={'mb-tab' + (flashTab ? ' is-flash' : '')}>
          <span className="mb-fav" aria-hidden="true" />
          <span className={'mb-tab-t' + (t ? '' : ' is-file')}>{t ? (typed ? <TypeText text={t} /> : t) : 'index.html'}</span>
          <span className="mb-x" aria-hidden="true" />
          {pins && pins.tab ? <span className="mb-pin mb-pin-tab">{pick(pins.tab)}</span> : null}
        </span>
        {/* Окно как Chrome в Windows: «+» новой вкладки и кнопки окна справа. */}
        <span className="mb-new" aria-hidden="true" />
        <span className="mb-win" aria-hidden="true"><i className="mb-w-min" /><i className="mb-w-max" /><i className="mb-w-x" /></span>
      </div>
      <div ref={pageRef} key={'pg' + (flashPage || 0)} className={'mb-page' + (flashPage ? ' is-flash' : '')}>
        <div className="mb-doc">{page}</div>
        {pins && pins.page ? <span className="mb-pin mb-pin-page">{pick(pins.page)}</span> : null}
      </div>
      {hl === 'head' && info ? <div className="mb-info"><Icon name="doc" size={15} />{pick(info)}</div> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОВОД — линия от места в коде к тому, что оно меняет в браузере. Рисуется
// поверх рабочей области; точки берутся из настоящих элементов, поэтому провод
// верен и в колонку (телефон), и в ряд (компьютер).
// ─────────────────────────────────────────────────────────────────────────────
function Wire({ wrapRef, from, to, color, on, nonce }) {
  const [g, setG] = useState(null);
  useLayoutEffect(() => {
    if (!on) { setG(null); return undefined; }
    let dead = false;
    const calc = () => {
      if (dead) return;
      const w = wrapRef.current, a = from(), b = to();
      if (!w || !a || !b) return;
      const W = w.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
      const ax = A.left + A.width / 2 - W.left, ay = A.top + A.height / 2 - W.top;
      const bx = B.left + B.width / 2 - W.left, by = B.top + B.height / 2 - W.top;
      const horiz = Math.abs(bx - ax) > Math.abs(by - ay) * 1.2;
      let p1, p2, c1, c2;
      if (horiz) {
        p1 = [ax < bx ? A.right - W.left : A.left - W.left, ay];
        p2 = [ax < bx ? B.left - W.left : B.right - W.left, by];
        const mx = (p1[0] + p2[0]) / 2;
        c1 = [mx, p1[1]]; c2 = [mx, p2[1]];
      } else {
        p1 = [ax, ay > by ? A.top - W.top : A.bottom - W.top];
        p2 = [bx, ay > by ? B.bottom - W.top : B.top - W.top];
        const my = (p1[1] + p2[1]) / 2;
        c1 = [p1[0], my]; c2 = [p2[0], my];
      }
      const r = (n) => Math.round(n * 10) / 10;
      setG({ d: `M${r(p1[0])} ${r(p1[1])} C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`,
        s: p1, e: p2, w: W.width, h: W.height });
    };
    calc();
    const timers = [80, 300, 700].map((ms) => setTimeout(calc, ms));
    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && wrapRef.current) { ro = new ResizeObserver(calc); ro.observe(wrapRef.current); }
    window.addEventListener('resize', calc);
    return () => { dead = true; timers.forEach(clearTimeout); if (ro) ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [on, nonce]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!g) return null;
  return (
    <svg className="wire" width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true" style={{ '--c': color }}>
      <path key={'p' + nonce} className="wire-path" d={g.d} pathLength="100" />
      <circle key={'s' + nonce} className="wire-dot" cx={g.s[0]} cy={g.s[1]} r="4" />
      <circle key={'e' + nonce} className="wire-dot wire-end" cx={g.e[0]} cy={g.e[1]} r="5.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// РУКА-ПОДСКАЗКА. Новая механика сначала показывается движением: рука дважды
// проходит путь «нажми сюда → потом сюда» и уходит. Исчезает от первого касания
// ребёнка. На паузе стоит на месте.
// ─────────────────────────────────────────────────────────────────────────────

// Ширина поля — по тексту (или подсказке-примеру), высота — по переносам.
// Ширину меряем холстом тем же шрифтом, что у поля; дальше её ограничивает
// строка (max-width: 100%, flex-shrink), и тогда текст переносится.
let _growCtx = null;
function fitGrow(el) {
  if (!el) return;
  const cs = getComputedStyle(el);
  if (!_growCtx) _growCtx = document.createElement('canvas').getContext('2d');
  if (_growCtx) {
    _growCtx.font = cs.font || (cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily);
    const txt = el.value || el.placeholder || '';
    const w = Math.ceil(_growCtx.measureText(txt).width) + parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0) + 8;
    el.style.width = w + 'px';
  }
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
function InlineInput({ value, onChange, placeholder, label, max = 40, inputRef, onEnter, cls, onFocus }) {
  // РАСТЁТ ПО ТЕКСТУ (заказчик, 17.10.2026): сначала в ширину — поле ровно по
  // тексту и расширяется по мере набора; упёрлось в край строки — текст
  // переносится внутри поля, и тогда оно растёт в высоту. Видно всё написанное.
  // Поле — textarea; Enter строку не переносит, а работает, как раньше.
  const pick = usePick();
  const ref = useRef(null);
  const setRef = (el) => { ref.current = el; if (inputRef) inputRef.current = el; };
  const fit = () => fitGrow(ref.current);
  useLayoutEffect(fit, [value]);
  useEffect(() => {
    const host = ref.current && ref.current.parentElement;
    if (typeof ResizeObserver === 'undefined' || !host) {
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }
    const ro = new ResizeObserver(() => fit());
    ro.observe(host);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <textarea ref={setRef} rows={1} className={'tk-input tk-grow' + (cls ? ' ' + cls : '')} value={value} maxLength={max}
      placeholder={placeholder ? pick(placeholder) : ''} aria-label={label ? pick(label) : undefined}
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="done"
      onFocus={onFocus} onChange={(e) => onChange(e.target.value.replace(/\r?\n/g, ' '))}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (onEnter) onEnter(); else e.currentTarget.blur(); } }} />
  );
}
