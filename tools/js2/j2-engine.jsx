// =============================================================================
// ДВИЖОК УРОКА 2 КУРСА JAVASCRIPT «Переменные» — движок урока 1 (tools/js1/j1-engine.jsx) + переменные.
//   jsTrace(lines) → { items, mem, n }: строки выполняются сверху вниз, как в браузере.
//     items — вывод консоли [{ type: 'log' | 'err', text, line, num }];
//     mem[i] — «Память» после строки i+1: [{ name, kind: 'let' | 'const' | 'var' | 'global', val, ch, nw }];
//     n — сколько строк выполнено (на ошибке — номер строки с ошибкой; синтаксическая ошибка — 0).
//   Понимает: console.log(…) со строками, числами, + - * /, скобками и переменными; let x = …; const x = …; let x;
//   x = …; x += …; x -= …; x *= …; x /= …; x++; x--.
//   Ошибки — как в Chrome:
//     нет такой переменной (опечатка, другая буква) → «ReferenceError: coin is not defined»;
//     переменная до своей строки let → «ReferenceError: Cannot access 'x' before initialization»;
//     новое значение в const → «TypeError: Assignment to constant variable.»;
//     второй let с тем же именем → «SyntaxError: Identifier 'x' has already been declared» (не выполняется ни одна строка);
//     const без значения → «SyntaxError: Missing initializer in const declaration»;
//     пробел в имени → «SyntaxError: Unexpected identifier 'name'»; имя с цифры (1x) → «Invalid or unexpected token»;
//     "score" = 5 → «SyntaxError: Invalid left-hand side in assignment»; прочее — как в уроке 1.
//   Присваивание без let (score = 5 без объявления) в обычном скрипте Chrome работает: создаётся глобальная
//   переменная — так и здесь (kind 'global'); задания отдельно просят let.
//   jsRun(lines) — только вывод консоли (как в уроке 1).
//   useTraceAnim(tr) — строки загораются по очереди; { cur, shown, errLine, mem } — что видно сейчас.
//   JsMem — панель «Память»: коробки переменных (имя на ярлыке, значение внутри, у const — замок).
// =============================================================================
const JS_Q = (s) => String(s == null ? '' : s).replace(/[“”„«»]/g, '"').replace(/[‘’]/g, "'");
const ID_RE = /^[\p{L}_$][\p{L}\p{N}_$]*/u;
const JS_KW = { let: 1, const: 1, var: 1 };
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
    if (num) {
      // 1x, 2score — имя не может начинаться с цифры: Chrome — «Invalid or unexpected token».
      if (!tolerant && ID_RE.test(s.slice(i + num[0].length))) throw { syn: 'Invalid or unexpected token' };
      out.push({ t: 'num', v: num[0], val: Number(num[0]) }); i += num[0].length; continue;
    }
    const id = ID_RE.exec(s.slice(i));
    if (id) { out.push({ t: JS_KW[id[0]] ? 'kw' : 'id', v: id[0] }); i += id[0].length; continue; }
    if ('.(),;+-*/='.indexOf(ch) >= 0) { out.push({ t: 'p', v: ch }); i += 1; continue; }
    if (tolerant) { out.push({ t: 'bad', v: ch }); i += 1; continue; }
    throw { syn: 'Invalid or unexpected token' };
  }
  return out;
}
const tokDesc = (k) => (!k ? null : k.t === 'id' ? "Unexpected identifier '" + k.v + "'" : k.t === 'str' ? 'Unexpected string' : k.t === 'num' ? 'Unexpected number' : "Unexpected token '" + k.v + "'");
// Разбор строки в список операторов. Бросает { syn } при синтаксической ошибке.
function jsParseLine(src) {
  const ts = jsLex(src).filter((k) => k.t !== 'cm');
  let i = 0;
  const peek = (d) => ts[i + (d || 0)], next = () => ts[i++];
  const isP = (k, v) => !!k && k.t === 'p' && k.v === v;
  // порядок действий как в JavaScript: * и / раньше + и - (26.11.2026)
  const mul = () => {
    let left = term();
    while (peek() && peek().t === 'p' && (peek().v === '*' || peek().v === '/') && !isP(peek(1), '=')) { const op = next().v; left = { k: 'bin', op, a: left, b: term() }; }
    return left;
  };
  const expr = () => {
    let left = mul();
    while (peek() && peek().t === 'p' && (peek().v === '+' || peek().v === '-') && !isP(peek(1), '=')) { const op = next().v; left = { k: 'bin', op, a: left, b: mul() }; }
    return left;
  };
  const term = () => {
    const k = next();
    if (!k) throw { syn: 'Unexpected end of input' };
    if (k.t === 'num') return { k: 'num', v: k.val };
    if (k.t === 'str') return { k: 'str', v: k.val };
    if (k.t === 'p' && k.v === '-') return { k: 'neg', a: term() };
    if (k.t === 'p' && k.v === '(') { const e = expr(); const c = next(); if (!c || c.v !== ')') throw { syn: c ? tokDesc(c) : 'missing ) in parenthetical' }; return e; }
    if (k.t === 'kw') throw { syn: "Unexpected token '" + k.v + "'" };
    if (k.t === 'id') {
      let node = { k: 'ref', path: [k.v] };
      while (peek() && isP(peek(), '.')) { next(); const m = next(); if (!m || (m.t !== 'id' && m.t !== 'kw')) throw { syn: m ? tokDesc(m) : 'Unexpected end of input' }; node.path.push(m.v); }
      if (peek() && isP(peek(), '(')) {
        next();
        const args = [];
        if (peek() && isP(peek(), ')')) next();
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
  const stmt = () => {
    const k = peek();
    // let x = …; const x = …; let x;
    if (k.t === 'kw') {
      next();
      const nm = next();
      if (!nm) throw { syn: 'Unexpected end of input' };
      if (nm.t === 'kw') throw { syn: (nm.v === 'let' ? 'let is disallowed as a lexically bound name' : "Unexpected token '" + nm.v + "'") };
      if (nm.t !== 'id') throw { syn: nm.t === 'str' ? 'Unexpected string' : tokDesc(nm) };
      const c = peek();
      if (!c || isP(c, ';')) { if (k.v === 'const') throw { syn: 'Missing initializer in const declaration' }; return { k: 'decl', kind: k.v, name: nm.v, init: null }; }
      if (isP(c, '=')) { next(); return { k: 'decl', kind: k.v, name: nm.v, init: expr() }; }
      throw { syn: tokDesc(c) };
    }
    // x = …; x += …; x++;
    if (k.t === 'id' && isP(peek(1), '=')) { next(); next(); return { k: 'set', name: k.v, val: expr() }; }
    if (k.t === 'id' && peek(1) && peek(1).t === 'p' && '+-*/'.indexOf(peek(1).v) >= 0 && isP(peek(2), '=')) { next(); const op = next().v; next(); return { k: 'set', name: k.v, op, val: expr() }; }
    if (k.t === 'id' && isP(peek(1), '+') && isP(peek(2), '+')) { next(); next(); next(); return { k: 'set', name: k.v, op: '+', val: { k: 'num', v: 1 } }; }
    if (k.t === 'id' && isP(peek(1), '-') && isP(peek(2), '-')) { next(); next(); next(); return { k: 'set', name: k.v, op: '-', val: { k: 'num', v: 1 } }; }
    const e = expr();
    if (isP(peek(), '=')) throw { syn: 'Invalid left-hand side in assignment' };
    return e;
  };
  const stmts = [];
  while (i < ts.length) {
    if (isP(peek(), ';')) { next(); continue; }
    stmts.push(stmt());
    const c = peek();
    if (c && !isP(c, ';')) throw { syn: tokDesc(c) };
  }
  return stmts;
}
// Значение для вывода: строка — как есть, число — по-JS.
const jsShow = (v) => (typeof v === 'number' ? String(v) : v === undefined ? 'undefined' : String(v));
const jsOp = (op, a, b) => {
  if (op === '+') return typeof a === 'string' || typeof b === 'string' ? jsShow(a) + jsShow(b) : a + b;
  const x = Number(a), y = Number(b);
  return op === '-' ? x - y : op === '*' ? x * y : x / y;
};
function jsEval(n, ctx, line) {
  if (n.k === 'num' || n.k === 'str') return n.v;
  if (n.k === 'neg') return -jsEval(n.a, ctx, line);
  if (n.k === 'bin') return jsOp(n.op, jsEval(n.a, ctx, line), jsEval(n.b, ctx, line));
  if (n.k === 'ref') {
    const p = n.path;
    const v = ctx.env[p[0]];
    if (v) {
      if (!v.init) throw { rt: "ReferenceError: Cannot access '" + p[0] + "' before initialization" };
      return p.length === 1 ? v.val : undefined;
    }
    if (p[0] === 'console') { if (p.length === 1) return { $console: 1 }; return p[1] === 'log' ? { $fn: 'log' } : undefined; }
    if (p[0] === 'alert' && p.length === 1) return { $fn: 'alert' };
    throw { rt: 'ReferenceError: ' + p[0] + ' is not defined' };
  }
  if (n.k === 'call') {
    const f = jsEval(n.fn, ctx, line);
    if (!f || !f.$fn) throw { rt: 'TypeError: ' + n.fn.path.join('.') + ' is not a function' };
    const vals = n.args.map((a) => jsEval(a, ctx, line));
    if (f.$fn === 'log') ctx.out.push({ type: 'log', text: vals.map(jsShow).join(' '), num: vals.length === 1 && typeof vals[0] === 'number', line });
    else ctx.out.push({ type: 'alert', text: jsShow(vals[0]), line });
    return undefined;
  }
  if (n.k === 'decl') {
    const v = ctx.env[n.name];
    v.val = n.init ? jsEval(n.init, ctx, line) : undefined;
    v.init = true; ctx.ch[n.name] = 'nw';
    return undefined;
  }
  if (n.k === 'set') {
    const v = ctx.env[n.name];
    if (v && !v.init) throw { rt: "ReferenceError: Cannot access '" + n.name + "' before initialization" };
    if (!v && n.op) throw { rt: 'ReferenceError: ' + n.name + ' is not defined' };
    const nv = n.op ? jsOp(n.op, v.val, jsEval(n.val, ctx, line)) : jsEval(n.val, ctx, line);
    if (v && v.kind === 'const') throw { rt: 'TypeError: Assignment to constant variable.' };
    if (v) { v.val = nv; ctx.ch[n.name] = ctx.ch[n.name] || 'ch'; }
    else { ctx.env[n.name] = { kind: 'global', val: nv, init: true }; ctx.order.push(n.name); ctx.ch[n.name] = 'nw'; }
    return undefined;
  }
  return undefined;
}
const memSnap = (ctx) => ctx.order.filter((k) => ctx.env[k].init).map((k) => ({ name: k, kind: ctx.env[k].kind, val: ctx.env[k].val, ch: ctx.ch[k] === 'ch', nw: ctx.ch[k] === 'nw' }));
// Выполнить строки скрипта (массив строк). Номер строки — с 1.
function jsTrace(lines, file) {
  const f = file || 'script.js';
  const parsed = [];
  for (let i = 0; i < lines.length; i += 1) {
    try { parsed.push(jsParseLine(lines[i])); } catch (e) {
      if (e && e.syn) return { items: [{ type: 'err', text: 'Uncaught SyntaxError: ' + e.syn, line: i + 1, file: f }], mem: [], n: 0, syn: true };
      throw e;
    }
  }
  // Объявления let / const видны сразу во всём скрипте; повтор имени — синтаксическая ошибка (скрипт не запускается).
  const ctx = { env: {}, order: [], out: [], ch: {} };
  for (let i = 0; i < parsed.length; i += 1) {
    for (const s of parsed[i]) {
      if (s.k !== 'decl') continue;
      if (ctx.env[s.name]) return { items: [{ type: 'err', text: "Uncaught SyntaxError: Identifier '" + s.name + "' has already been declared", line: i + 1, file: f }], mem: [], n: 0, syn: true };
      ctx.env[s.name] = { kind: s.kind, val: undefined, init: false };
      ctx.order.push(s.name);
    }
  }
  const mem = [];
  for (let i = 0; i < parsed.length; i += 1) {
    ctx.ch = {};
    try { parsed[i].forEach((n) => jsEval(n, ctx, i + 1)); } catch (e) {
      if (e && e.rt) { ctx.out.push({ type: 'err', text: 'Uncaught ' + e.rt, line: i + 1, file: f }); mem.push(memSnap(ctx)); return { items: ctx.out, mem, n: i + 1 }; }
      throw e;
    }
    mem.push(memSnap(ctx));
  }
  return { items: ctx.out, mem, n: parsed.length };
}
const jsRun = (lines, file) => jsTrace(lines, file).items;
const jsErr = (items) => (items || []).find((x) => x.type === 'err') || null;
const jsLogs = (items) => (items || []).filter((x) => x.type === 'log').map((x) => x.text);
const memVal = (tr, name) => { const m = tr && tr.mem && tr.mem[tr.mem.length - 1]; const b = m && m.find((x) => x.name === name); return b ? b : null; };

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
    else if (k.t === 'kw') c = 'j2-kw';
    else if (k.t === 'p') c = 'j1-punc';
    else if (k.t === 'bad') c = 'j1-bad';
    else if (k.t === 'id' && prev && prev.v === '.') c = 'j1-fn';
    else if (k.t === 'id' && (k.v === 'console' || k.v === 'alert')) c = 'j1-obj';
    else if (k.t === 'id') c = 'j2-var';
    const on = lit && (lit === k.v || (lit === 'str' && k.t === 'str') || (lit === 'val' && (k.t === 'str' || k.t === 'num')));
    out.push(<span key={'t' + j} className={c + (on ? ' is-cur' : '')}>{k.v}</span>);
    if (k.sp) out.push(' ');
  });
  return out;
}
const jsL = (k, d, text, extra, lit) => codeLine(k, jsParts(text, lit), Object.assign({ d, cls: 'j1-line' }, extra || {}));

// Консоль Chrome (DevTools → Console): сообщения, ошибки красным с ⊗ и «script.js:N» справа.
const J1W = { elements: 'Elements', console: 'Console', sources: 'Sources', filter: 'Filter', top: 'top' };
function JsConsole({ items, hl, empty, cls }) {
  const pick = usePick();
  const list = items || [];
  const ref = useRef(null);
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

// ── ВЫПОЛНЕНИЕ ПО СТРОКАМ: строки загораются по очереди сверху вниз; вывод строки и её коробки в «Памяти» меняются
// в тот же миг. Синтаксическая ошибка — не выполняется ни одна строка, сразу красное сообщение.
// tr — результат jsTrace; key — что-то, что меняется при новом запуске (иначе — по содержимому).
function useTraceAnim(tr, key) {
  const T = tr || { items: [], mem: [], n: 0 };
  const sig = (key != null ? key + '#' : '') + T.n + '|' + T.items.map((x) => x.type + ':' + x.line + ':' + x.text).join('|') + '|' + JSON.stringify(T.mem[T.mem.length - 1] || []);
  const last = T.n;
  const [cur, setCur] = useState(99);
  useEffect(() => {
    if (!last || T.syn || reduceMotion()) { setCur(99); return undefined; }
    setCur(0);
    let k = 0;
    const t = setInterval(() => { k += 1; setCur(k); if (k > last) clearInterval(t); }, 520);
    return () => clearInterval(t);
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const err = T.items.find((x) => x.type === 'err');
  const c = Math.min(cur, last);
  return {
    cur: cur > last ? null : cur,
    shown: T.items.filter((x) => x.line <= cur),
    errLine: err && err.line <= cur ? err.line : null,
    mem: c > 0 ? T.mem[c - 1] || [] : [],
    fresh: cur <= last
  };
}
// Класс строки кода по ходу выполнения (n — номер строки с 1).
const execCls = (A, n) => (!A ? '' : A.errLine === n ? ' is-err-line' : A.cur === n ? ' is-exec' : A.cur != null && A.cur > n ? ' is-past' : '');
// Консоль отдельно от страницы (DevTools → Console).
function JsOut({ anim, items, empty }) {
  const shown = anim ? anim.shown : items;
  return <div className="j1-concard"><JsConsole items={shown} empty={empty} /></div>;
}

// ── «ПАМЯТЬ»: коробки переменных. Имя — на ярлыке, значение — внутри (строка в кавычках, число — как есть), у const —
// замок. Новая коробка выезжает, новое значение падает в коробку, старое — гаснет.
const J2_LOCK = <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" /><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
const memShow = (v) => (typeof v === 'string' ? '"' + v + '"' : v === undefined ? 'undefined' : String(v));
function JsMem({ mem, lit, title, empty, cls }) {
  const pick = usePick();
  const list = mem || [];
  return (
    <div className={'j2-mem' + (cls ? ' ' + cls : '')} translate="no">
      <div className="j2-mem-h"><i aria-hidden="true" />{pick(title || UI.mem)}</div>
      <div className="j2-mem-row">
        {list.map((b) => (
          <div key={b.name} className={'j2-box is-' + b.kind + (b.nw ? ' is-new' : '') + (b.ch ? ' is-ch' : '') + (lit === b.name ? ' is-lit' : '')}>
            <span className="j2-box-n">{b.kind === 'const' ? J2_LOCK : null}{b.name}</span>
            {b.emp ? <b className="j2-box-v is-emp" aria-hidden="true" /> : <b key={memShow(b.val)} className={'j2-box-v' + (typeof b.val === 'string' ? ' is-str' : typeof b.val === 'number' ? ' is-num' : ' is-und')}>{memShow(b.val)}</b>}
            {b.kind !== 'global' ? <em>{b.kind}</em> : null}
          </div>
        ))}
        {!list.length ? <span className="j2-mem-empty">{pick(empty || UI.memEmpty)}</span> : null}
      </div>
    </div>
  );
}
// Правая колонка: «Память» сверху, консоль снизу.
function JsSide({ anim, items, mem, empty, lit }) {
  return (
    <div className="j2-side">
      <JsMem mem={anim ? anim.mem : mem} lit={lit} />
      <JsOut anim={anim} items={items} empty={empty || UI.conEmpty} />
    </div>
  );
}
