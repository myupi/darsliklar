// =============================================================================
// ДВИЖОК УРОКА 1 КУРСА JAVASCRIPT: маленький честный JavaScript для console.log, раскраска кода, консоль Chrome.
//   jsRun(lines)  → [{ type: 'log' | 'err' | 'alert', text, line }]: строки выполняются сверху вниз, как в браузере.
//     Понимает: console.log(…) — строки в "…", '…', `…`, числа, + - * / и скобки, несколько значений через запятую;
//     alert(…). Ошибки — как в Chrome: слово без кавычек → «ReferenceError: Salom is not defined»; Console с большой
//     буквы → «ReferenceError: Console is not defined»; console.lg → «TypeError: console.lg is not a function»;
//     нет «)» → «SyntaxError: missing ) after argument list»; незакрытая кавычка → «SyntaxError: Invalid or unexpected
//     token». Синтаксическая ошибка в любой строке — не выполняется ни одна (браузер не запускает скрипт); ошибка во
//     время работы останавливает скрипт на своей строке. «Умные» кавычки “ ” « » — как обычные (набор на телефоне).
//   jsParts(text, lit) — раскраска строки JS для KzCode (console, log, строка, число, знаки).
//   JsConsole — панель DevTools → Console.
// =============================================================================
const JS_Q = (s) => String(s == null ? '' : s).replace(/[“”„«»]/g, '"').replace(/[‘’]/g, "'");
const ID_RE = /^[\p{L}_$][\p{L}\p{N}_$]*/u;
// Лексер строки. tolerant — для раскраски: незакрытая строка не ошибка.
function jsLex(src, tolerant) {
  const s = JS_Q(src);
  const out = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i += 1; if (out.length) out[out.length - 1].sp = true; continue; }
    if (ch === '/' && s[i + 1] === '/') { out.push({ t: 'cm', v: s.slice(i) }); break; }
    if (ch === '"' || ch === "'" || ch === '`') {
      const j = s.indexOf(ch, i + 1);
      if (j < 0) { if (tolerant) { out.push({ t: 'str', v: s.slice(i), open: true }); break; } throw { syn: 'Invalid or unexpected token' }; }
      out.push({ t: 'str', v: s.slice(i, j + 1), val: s.slice(i + 1, j) });
      i = j + 1; continue;
    }
    const num = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (num) { out.push({ t: 'num', v: num[0], val: Number(num[0]) }); i += num[0].length; continue; }
    const id = ID_RE.exec(s.slice(i));
    if (id) { out.push({ t: 'id', v: id[0] }); i += id[0].length; continue; }
    if ('.(),;+-*/'.indexOf(ch) >= 0) { out.push({ t: 'p', v: ch }); i += 1; continue; }
    if (tolerant) { out.push({ t: 'bad', v: ch }); i += 1; continue; }
    throw { syn: 'Invalid or unexpected token' };
  }
  return out;
}
const tokDesc = (k) => (!k ? null : k.t === 'id' ? "Unexpected identifier '" + k.v + "'" : k.t === 'str' ? 'Unexpected string' : k.t === 'num' ? 'Unexpected number' : "Unexpected token '" + k.v + "'");
// Разбор строки в список выражений-операторов. Бросает { syn } при синтаксической ошибке.
function jsParseLine(src) {
  const ts = jsLex(src).filter((k) => k.t !== 'cm');
  let i = 0;
  const peek = () => ts[i], next = () => ts[i++];
  // порядок действий как в JavaScript: * и / раньше + и - (26.11.2026)
  const mul = () => {
    let left = term();
    while (peek() && peek().t === 'p' && (peek().v === '*' || peek().v === '/')) { const op = next().v; left = { k: 'bin', op, a: left, b: term() }; }
    return left;
  };
  const expr = () => {
    let left = mul();
    while (peek() && peek().t === 'p' && (peek().v === '+' || peek().v === '-')) { const op = next().v; left = { k: 'bin', op, a: left, b: mul() }; }
    return left;
  };
  const term = () => {
    const k = next();
    if (!k) throw { syn: 'Unexpected end of input' };
    if (k.t === 'num') return { k: 'num', v: k.val };
    if (k.t === 'str') return { k: 'str', v: k.val };
    if (k.t === 'p' && k.v === '-') return { k: 'neg', a: term() };
    if (k.t === 'p' && k.v === '(') { const e = expr(); const c = next(); if (!c || c.v !== ')') throw { syn: c ? tokDesc(c) : 'missing ) in parenthetical' }; return e; }
    if (k.t === 'id') {
      let node = { k: 'ref', path: [k.v] };
      while (peek() && peek().t === 'p' && peek().v === '.') { next(); const m = next(); if (!m || m.t !== 'id') throw { syn: m ? tokDesc(m) : 'Unexpected end of input' }; node.path.push(m.v); }
      if (peek() && peek().t === 'p' && peek().v === '(') {
        next();
        const args = [];
        if (peek() && peek().v === ')') next();
        else {
          for (;;) {
            args.push(expr());
            const c = peek();
            if (!c) throw { syn: 'missing ) after argument list' };
            if (c.v === ',') { next(); continue; }
            if (c.v === ')') { next(); break; }
            throw { syn: c.v === ';' ? 'missing ) after argument list' : tokDesc(c) };
          }
        }
        node = { k: 'call', fn: node, args };
      }
      return node;
    }
    throw { syn: tokDesc(k) };
  };
  const stmts = [];
  while (i < ts.length) {
    if (peek().t === 'p' && peek().v === ';') { next(); continue; }
    stmts.push(expr());
    const c = peek();
    if (c && !(c.t === 'p' && c.v === ';')) throw { syn: tokDesc(c) };
  }
  return stmts;
}
// Значение для вывода: строка — как есть, число — по-JS.
const jsShow = (v) => (typeof v === 'number' ? String(v) : v === undefined ? 'undefined' : String(v));
function jsEval(n, out, line) {
  if (n.k === 'num' || n.k === 'str') return n.v;
  if (n.k === 'neg') return -jsEval(n.a, out, line);
  if (n.k === 'bin') {
    const a = jsEval(n.a, out, line), b = jsEval(n.b, out, line);
    if (n.op === '+') return typeof a === 'string' || typeof b === 'string' ? jsShow(a) + jsShow(b) : a + b;
    const x = Number(a), y = Number(b);
    return n.op === '-' ? x - y : n.op === '*' ? x * y : x / y;
  }
  if (n.k === 'ref') {
    const p = n.path;
    if (p[0] === 'console') { if (p.length === 1) return { $console: 1 }; return p[1] === 'log' ? { $fn: 'log' } : undefined; }
    if (p[0] === 'alert' && p.length === 1) return { $fn: 'alert' };
    throw { rt: 'ReferenceError: ' + p[0] + ' is not defined' };
  }
  if (n.k === 'call') {
    const f = jsEval(n.fn, out, line);
    if (!f || !f.$fn) throw { rt: 'TypeError: ' + n.fn.path.join('.') + ' is not a function' };
    const vals = n.args.map((a) => jsEval(a, out, line));
    if (f.$fn === 'log') out.push({ type: 'log', text: vals.map(jsShow).join(' '), num: vals.length === 1 && typeof vals[0] === 'number', line });
    else out.push({ type: 'alert', text: jsShow(vals[0]), line });
    return undefined;
  }
  return undefined;
}
// Выполнить строки скрипта (массив строк). Номер строки — с 1.
function jsRun(lines, file) {
  const f = file || 'script.js';
  const out = [];
  const parsed = [];
  for (let i = 0; i < lines.length; i += 1) {
    try { parsed.push(jsParseLine(lines[i])); } catch (e) {
      if (e && e.syn) return [{ type: 'err', text: 'Uncaught SyntaxError: ' + e.syn, line: i + 1, file: f }];
      throw e;
    }
  }
  for (let i = 0; i < parsed.length; i += 1) {
    try { parsed[i].forEach((n) => jsEval(n, out, i + 1)); } catch (e) {
      if (e && e.rt) { out.push({ type: 'err', text: 'Uncaught ' + e.rt, line: i + 1, file: f }); return out; }
      throw e;
    }
  }
  return out;
}
const jsErr = (items) => (items || []).find((x) => x.type === 'err') || null;
const jsLogs = (items) => (items || []).filter((x) => x.type === 'log').map((x) => x.text);

// Раскраска строки JS: куски для KzCode (пробел — отдельный кусок ' ').
function jsParts(text, lit) {
  const ts = jsLex(text, true);
  const out = [];
  ts.forEach((k, j) => {
    const prev = ts[j - 1];
    let c = 'j1-id';
    if (k.t === 'str') c = 'j1-str';
    else if (k.t === 'num') c = 'j1-num';
    else if (k.t === 'cm') c = 'j1-cm';
    else if (k.t === 'p') c = 'j1-punc';
    else if (k.t === 'bad') c = 'j1-bad';
    else if (k.t === 'id' && prev && prev.v === '.') c = 'j1-fn';
    else if (k.t === 'id' && (k.v === 'console' || k.v === 'alert')) c = 'j1-obj';
    const on = lit && (lit === k.v || (lit === 'str' && k.t === 'str') || (lit === 'log' && k.v === 'log') || (lit === 'console' && k.v === 'console'));
    out.push(<span key={'t' + j} className={c + (on ? ' is-cur' : '')}>{k.v}</span>);
    if (k.sp) out.push(' ');
  });
  return out;
}
const jsL = (k, d, text, extra, lit) => codeLine(k, jsParts(text, lit), Object.assign({ d, cls: 'j1-line' }, extra || {}));

// Тег HTML с атрибутом: <script src="script.js"></script> — куски для KzCode.
function htmlTag(t, attrs, close, inner) {
  const out = [<span key="lt" className="j1-tb">{'<'}</span>, <span key="n" className="j1-tn">{t}</span>];
  (attrs || []).forEach(([a, v], i) => {
    out.push(' ', <span key={'a' + i} className="j1-an">{a}</span>, <span key={'e' + i} className="j1-tb">=</span>, <span key={'v' + i} className="j1-av">{v}</span>);
  });
  out.push(<span key="gt" className="j1-tb">{'>'}</span>);
  if (inner != null) out.push(inner);
  if (close) out.push(<span key="c" className="j1-tb">{'</'}</span>, <span key="cn" className="j1-tn">{t}</span>, <span key="cg" className="j1-tb">{'>'}</span>);
  return out;
}

// Консоль Chrome (DevTools → Console): сообщения, ошибки красным с ⊗ и «script.js:N» справа.
const J1W = { elements: 'Elements', console: 'Console', sources: 'Sources', filter: 'Filter', top: 'top' };
function JsConsole({ items, hl, empty, cls }) {
  const pick = usePick();
  const list = items || [];
  const ref = useRef(null);
  // Как в Chrome: новое сообщение — внизу, консоль сама докручивается до него.
  useEffect(() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; }, [list.length, list.map((x) => x.text).join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={'j1-con' + (cls ? ' ' + cls : '')} translate="no" aria-live="polite">
      <div className="j1-con-tabs"><span>{J1W.elements}</span><b>{J1W.console}</b><span>{J1W.sources}</span><i aria-hidden="true">⋮</i></div>
      <div className="j1-con-bar"><i aria-hidden="true">⊘</i><span>{J1W.top} ▾</span><em>{J1W.filter}</em></div>
      <div className="j1-con-list" ref={ref}>
        {list.map((x, i) => (
          <div key={i} className={'j1-con-row is-' + x.type + (hl === i ? ' is-hl' : '') + ' kz-a-drop'} style={{ '--dl': (i * 0.12) + 's' }}>
            {x.type === 'err' ? <i className="j1-con-x" aria-hidden="true">×</i> : null}
            <span className={'j1-con-t' + (x.num ? ' is-num' : '')}>{x.type === 'alert' ? 'alert: ' + x.text : x.text}</span>
            <em>{(x.file || 'script.js') + ':' + x.line}</em>
          </div>
        ))}
        {!list.length && empty ? <div className="j1-con-empty">{pick(empty)}</div> : null}
        <div className="j1-con-prompt" aria-hidden="true">›</div>
      </div>
    </div>
  );
}

// ── ВЫПОЛНЕНИЕ ПО СТРОКАМ (заказчик, 26.11.2026: «не нужно в браузере показывать результаты, пока ученик не дошёл до DOM…
// нужно придумать именно для JS»). Своя картинка JavaScript: редактор и консоль; по запуску строки загораются по очереди
// сверху вниз, вывод строки появляется в консоли в тот же миг; ошибка во время работы — на своей строке, ниже ничего не
// выполняется; синтаксическая ошибка — не выполняется ни одна строка, сразу красное сообщение.
function useRunAnim(items) {
  const list = items || [];
  const sig = list.map((x) => x.type + ':' + x.line + ':' + x.text).join('|');
  const syn = list.length === 1 && /SyntaxError/.test(list[0].text || '');
  const last = list.length ? Math.max.apply(null, list.map((x) => x.line)) : 0;
  const [cur, setCur] = useState(99);
  useEffect(() => {
    if (!list.length || syn || reduceMotion()) { setCur(99); return undefined; }
    setCur(0);
    let k = 0;
    const t = setInterval(() => { k += 1; setCur(k); if (k > last) clearInterval(t); }, 450);
    return () => clearInterval(t);
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const err = list.find((x) => x.type === 'err');
  return { cur: cur > last ? null : cur, shown: list.filter((x) => x.line <= cur), errLine: err && err.line <= cur ? err.line : null };
}
// Класс строки кода по ходу выполнения (n — номер строки с 1).
const execCls = (A, n) => (!A ? '' : A.errLine === n ? ' is-err-line' : A.cur === n ? ' is-exec' : A.cur != null && A.cur > n ? ' is-past' : '');
// Консоль отдельно от страницы (DevTools → Console).
function JsOut({ items, anim, empty }) {
  const own = useRunAnim(items);
  const A = anim || own;
  return <div className="j1-concard"><JsConsole items={A.shown} empty={empty} /></div>;
}
