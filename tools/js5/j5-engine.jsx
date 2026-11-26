// =============================================================================
// ДВИЖОК УРОКА 5 КУРСА JAVASCRIPT «Условия — 1 часть» — движок урока 4 (tools/js4/j4-engine.jsx) + if, else и блоки.
//   Новое: скрипт разбирается целиком, а не по строкам: if (условие) { … } else { … }, блоки в фигурных скобках через
//   несколько строк. Условие — любое значение: true / false, сравнение, имя коробки (по правилам JS: 0, "" — «ложь»).
//   Выполняется только одна ветка; строки другой ветки пропускаются. После блока скрипт идёт дальше.
//   jsTrace(lines) → { items, steps, mem, n, syn }:
//     steps — шаги выполнения: [{ line, mem, cond?, skip? }] — строка, «Память» после шага; у строки if — cond (true /
//       false) и skip — строки пропущенной ветки; items — вывод консоли (st — номер шага);
//     n — число шагов; mem[i] — «Память» после шага i.
//   Ошибки — как в Chrome: if без скобок (if coins > 100 {) — «Unexpected identifier 'coins'»; нет ) — «Unexpected token
//   '{'»; нет закрывающей } — «Unexpected end of input»; лишняя } или else без if — «Unexpected token '}'» / «'else'»;
//   If с большой буквы — «Unexpected token '{'». if (lives = 0) ошибки не даёт (как в Chrome): кладёт 0 в коробку.
//   useTraceAnim — шаги загораются по очереди: { cur (строка), past, skip, cond, shown, errLine, mem }.
//   jsCalc понимает строку if (…) { — «Расчёт» условия: coins > 100 → 120 > 100 → true.
// Прежнее (урок 4): порядок действий (* / % раньше + -, скобки первыми), сравнения > < >= <=, === !== == !=;
//   урок 3: true / false, typeof, склейка строки и числа; урок 2: let, const, «Память»; урок 1: console.log, консоль.
// =============================================================================
const JS_Q = (s) => String(s == null ? '' : s).replace(/[“”„«»]/g, '"').replace(/[‘’]/g, "'");
const ID_RE = /^[\p{L}_$][\p{L}\p{N}_$]*/u;
const JS_KW = { let: 1, const: 1, var: 1 };
const JS_CTL = { if: 1, else: 1 };
const JS_LIT = { true: 1, false: 1, typeof: 1 };
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
      if (!tolerant && ID_RE.test(s.slice(i + num[0].length))) throw { syn: 'Invalid or unexpected token' };
      out.push({ t: 'num', v: num[0], val: Number(num[0]) }); i += num[0].length; continue;
    }
    const id = ID_RE.exec(s.slice(i));
    if (id) { const w = id[0]; out.push({ t: JS_KW[w] ? 'kw' : JS_CTL[w] ? 'ctl' : JS_LIT[w] ? (w === 'typeof' ? 'tof' : 'bool') : 'id', v: w }); i += w.length; continue; }
    const op = /^(===|!==|==|!=|>=|<=|[.(),;+\-*\/%=<>!{}])/.exec(s.slice(i));
    if (op) { out.push({ t: 'p', v: op[1] }); i += op[1].length; continue; }
    if (tolerant) { out.push({ t: 'bad', v: ch }); i += 1; continue; }
    throw { syn: 'Invalid or unexpected token' };
  }
  return out;
}
const tokDesc = (k) => (!k ? null : k.t === 'id' ? "Unexpected identifier '" + k.v + "'" : k.t === 'str' ? 'Unexpected string' : k.t === 'num' ? 'Unexpected number' : "Unexpected token '" + k.v + "'");
// Разбор списка лексем (у каждой — номер строки ln). Бросает { syn, ln } при синтаксической ошибке.
function jsParse(ts, lastLn) {
  let i = 0;
  const peek = (d) => ts[i + (d || 0)], next = () => ts[i++];
  const isP = (k, v) => !!k && k.t === 'p' && k.v === v;
  const fail = (msg, k) => { throw { syn: msg, ln: k ? k.ln : lastLn }; };
  const want = (v) => { const c = next(); if (!c) fail('Unexpected end of input'); if (!isP(c, v)) fail(tokDesc(c), c); return c; };
  // Уровни, как в JS: присваивание → равенство → сравнение → + - → * / % → унарные.
  const expr = () => {
    const k = peek();
    if (k && k.t === 'id' && isP(peek(1), '=')) { next(); next(); return { k: 'set', name: k.v, val: expr(), ret: true }; }
    return eq();
  };
  const binLevel = (ops, sub) => () => {
    let left = sub();
    while (peek() && peek().t === 'p' && ops.indexOf(peek().v) >= 0 && !isP(peek(1), '=')) { const op = next().v; left = { k: 'bin', op, a: left, b: sub() }; }
    return left;
  };
  const term = () => {
    const k = next();
    if (!k) fail('Unexpected end of input');
    if (k.t === 'num') return { k: 'num', v: k.val };
    if (k.t === 'str') return { k: 'str', v: k.val };
    if (k.t === 'bool') return { k: 'bool', v: k.v === 'true' };
    if (k.t === 'tof') return { k: 'typeof', a: term() };
    if (k.t === 'p' && k.v === '-') return { k: 'neg', a: term() };
    if (k.t === 'p' && k.v === '!') return { k: 'not', a: term() };
    if (k.t === 'p' && k.v === '(') { const e = expr(); const c = next(); if (!c) fail('Unexpected end of input'); if (!isP(c, ')')) fail(tokDesc(c), c); return Object.assign({}, e, { p: true }); }
    if (k.t === 'kw' || k.t === 'ctl') fail("Unexpected token '" + k.v + "'", k);
    if (k.t === 'id') {
      let node = { k: 'ref', path: [k.v] };
      while (peek() && isP(peek(), '.')) { next(); const m = next(); if (!m || (m.t !== 'id' && m.t !== 'kw' && m.t !== 'ctl')) fail(m ? tokDesc(m) : 'Unexpected end of input', m); node.path.push(m.v); }
      if (peek() && isP(peek(), '(')) {
        next();
        const args = [];
        if (peek() && isP(peek(), ')')) next();
        else {
          for (;;) {
            args.push(expr());
            const c = peek();
            if (!c) fail('missing ) after argument list');
            if (isP(c, ',')) { next(); continue; }
            if (isP(c, ')')) { next(); break; }
            fail('missing ) after argument list', c);
          }
        }
        node = { k: 'call', fn: node, args };
      }
      return node;
    }
    fail(tokDesc(k), k);
    return null;
  };
  const mul = binLevel(['*', '/', '%'], term);
  const add = binLevel(['+', '-'], mul);
  const rel = binLevel(['>', '<', '>=', '<='], add);
  const eq = binLevel(['===', '!==', '==', '!='], rel);
  // Конец простого оператора: «;», «}», конец скрипта или новая строка (как автоматическая «;» в JS).
  const endStmt = () => {
    const c = peek();
    if (!c) return;
    if (isP(c, ';')) { next(); return; }
    if (isP(c, '}')) return;
    const prev = ts[i - 1];
    if (prev && c.ln !== prev.ln) return;
    fail(tokDesc(c), c);
  };
  const block = () => {
    const open = want('{');
    const body = [];
    for (;;) {
      const c = peek();
      if (!c) fail('Unexpected end of input');
      if (isP(c, '}')) { next(); return { body, from: open.ln, to: c.ln }; }
      if (isP(c, ';')) { next(); continue; }
      stmt().forEach((x) => body.push(x));
    }
  };
  const branch = () => (isP(peek(), '{') ? block() : (() => { const s = stmt(); return { body: s, from: s[0] ? s[0].ln : null, to: s[0] ? s[0].ln : null }; })());
  // Возвращает список операторов (let a = 1, b = 2 — два).
  const stmt = () => {
    const k = peek();
    const ln = k.ln;
    if (k.t === 'ctl') {
      next();
      if (k.v === 'else') fail("Unexpected token 'else'", k);
      want('(');
      if (peek() && isP(peek(), ')')) fail("Unexpected token ')'", peek());
      const cond = expr();
      const c = next();
      if (!c) fail('Unexpected end of input');
      if (!isP(c, ')')) fail(tokDesc(c), c);
      if (!peek()) fail('Unexpected end of input');
      const body = branch();
      let alt = null, elseLn = null;
      if (peek() && peek().t === 'ctl' && peek().v === 'else') { elseLn = next().ln; if (!peek()) fail('Unexpected end of input'); alt = branch(); }
      return [{ k: 'if', ln, cond, body, alt, elseLn }];
    }
    if (isP(k, '{')) { const b = block(); return [{ k: 'block', ln, body: b }]; }
    if (isP(k, '}')) fail("Unexpected token '}'", k);
    let out;
    if (k.t === 'kw') {
      next();
      const nm = next();
      if (!nm) fail('Unexpected end of input');
      if (nm.t === 'kw') fail(nm.v === 'let' ? 'let is disallowed as a lexically bound name' : "Unexpected token '" + nm.v + "'", nm);
      if (nm.t !== 'id') fail(nm.t === 'str' ? 'Unexpected string' : tokDesc(nm), nm);
      out = [];
      let name = nm;
      for (;;) {
        const c = peek();
        if (!c || isP(c, ';') || isP(c, '}') || c.ln !== name.ln) {
          if (k.v === 'const') fail('Missing initializer in const declaration', c && c.ln === name.ln ? c : name);
          out.push({ k: 'decl', kind: k.v, name: name.v, init: null, ln }); break;
        }
        if (!isP(c, '=')) fail(tokDesc(c), c);
        next();
        out.push({ k: 'decl', kind: k.v, name: name.v, init: expr(), ln });
        if (isP(peek(), ',')) { next(); const t = peek(); if (!t || t.t !== 'id') fail(t ? tokDesc(t) : 'Unexpected end of input', t); name = next(); continue; }
        break;
      }
    } else if (k.t === 'id' && isP(peek(1), '=')) { next(); next(); out = [{ k: 'set', name: k.v, val: expr(), ln }]; }
    else if (k.t === 'id' && peek(1) && peek(1).t === 'p' && ['+', '-', '*', '/', '%'].indexOf(peek(1).v) >= 0 && isP(peek(2), '=')) { next(); const op = next().v; next(); out = [{ k: 'set', name: k.v, op, val: expr(), ln }]; }
    else if (k.t === 'id' && isP(peek(1), '+') && isP(peek(2), '+')) { next(); next(); next(); out = [{ k: 'set', name: k.v, op: '+', val: { k: 'num', v: 1 }, ln }]; }
    else if (k.t === 'id' && isP(peek(1), '-') && isP(peek(2), '-')) { next(); next(); next(); out = [{ k: 'set', name: k.v, op: '-', val: { k: 'num', v: 1 }, ln }]; }
    else {
      const e = expr();
      if (isP(peek(), '=')) fail('Invalid left-hand side in assignment', peek());
      out = [Object.assign(e, { ln })];
    }
    endStmt();
    return out;
  };
  const prog = [];
  while (i < ts.length) {
    if (isP(peek(), ';')) { next(); continue; }
    stmt().forEach((x) => prog.push(x));
  }
  return prog;
}
// Лексемы всех строк с номерами строк.
function jsTokens(lines) {
  const ts = [];
  lines.forEach((src, j) => {
    let lx;
    try { lx = jsLex(src); } catch (e) { throw { syn: e.syn, ln: j + 1 }; }
    lx.filter((k) => k.t !== 'cm').forEach((k) => { k.ln = j + 1; ts.push(k); });
  });
  return ts;
}
// Одна строка — список операторов (для «Расчёта»).
function jsParseLine(src) { return jsParse(jsTokens([src]), 1); }
// Значение для вывода: строка — как есть, число — по-JS.
const jsShow = (v) => (typeof v === 'number' ? String(v) : v === undefined ? 'undefined' : String(v));
const jsOp = (op, a, b) => {
  if (op === '+') return typeof a === 'string' || typeof b === 'string' ? jsShow(a) + jsShow(b) : a + b;
  if (op === '===') return a === b;
  if (op === '!==') return a !== b;
  if (op === '==') return a == b; // eslint-disable-line eqeqeq
  if (op === '!=') return a != b; // eslint-disable-line eqeqeq
  if (op === '>') return a > b;
  if (op === '<') return a < b;
  if (op === '>=') return a >= b;
  if (op === '<=') return a <= b;
  const x = Number(a), y = Number(b);
  return op === '-' ? x - y : op === '*' ? x * y : op === '%' ? x % y : x / y;
};
function jsEval(n, ctx, line) {
  if (n.k === 'num' || n.k === 'str' || n.k === 'bool') return n.v;
  if (n.k === 'typeof') {
    if (n.a.k === 'ref' && n.a.path.length === 1 && !ctx.env[n.a.path[0]] && n.a.path[0] !== 'console' && n.a.path[0] !== 'alert') return 'undefined';
    const v = jsEval(n.a, ctx, line);
    return v && typeof v === 'object' ? (v.$fn ? 'function' : 'object') : typeof v;
  }
  if (n.k === 'neg') return -jsEval(n.a, ctx, line);
  if (n.k === 'not') return !jsEval(n.a, ctx, line);
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
    if (f.$fn === 'log') ctx.out.push({ type: 'log', text: vals.map(jsShow).join(' '), num: vals.length === 1 && (typeof vals[0] === 'number' || typeof vals[0] === 'boolean'), line, st: ctx.steps.length });
    else ctx.out.push({ type: 'alert', text: jsShow(vals[0]), line, st: ctx.steps.length });
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
    return n.ret ? nv : undefined;
  }
  return undefined;
}
const memSnap = (ctx) => ctx.order.filter((k) => ctx.env[k].init).map((k) => ({ name: k, kind: ctx.env[k].kind, val: ctx.env[k].val, ch: ctx.ch[k] === 'ch', nw: ctx.ch[k] === 'nw' }));
// Номера строк всех операторов ветки (и вложенных).
function stLines(list, acc) {
  const out = acc || [];
  (list || []).forEach((s) => {
    if (out.indexOf(s.ln) < 0) out.push(s.ln);
    if (s.k === 'if') { stLines(s.body.body, out); if (s.alt) stLines(s.alt.body, out); if (s.elseLn && out.indexOf(s.elseLn) < 0) out.push(s.elseLn); }
    if (s.k === 'block') stLines(s.body.body, out);
  });
  return out;
}
// Выполнить скрипт (массив строк). Номер строки — с 1.
function jsTrace(lines, file) {
  const f = file || 'script.js';
  let prog;
  try { prog = jsParse(jsTokens(lines), Math.max(1, lines.length)); } catch (e) {
    if (e && e.syn) return { items: [{ type: 'err', text: 'Uncaught SyntaxError: ' + e.syn, line: e.ln || 1, file: f, st: 0 }], steps: [], mem: [], n: 0, syn: true };
    throw e;
  }
  // Объявления let / const видны сразу во всём скрипте; повтор имени — синтаксическая ошибка (скрипт не запускается).
  const ctx = { env: {}, order: [], out: [], ch: {}, steps: [] };
  const decls = [];
  const walk = (list) => (list || []).forEach((s) => { if (s.k === 'decl') decls.push(s); if (s.k === 'if') { walk(s.body.body); if (s.alt) walk(s.alt.body); } if (s.k === 'block') walk(s.body.body); });
  walk(prog);
  for (const s of decls) {
    if (ctx.env[s.name]) return { items: [{ type: 'err', text: "Uncaught SyntaxError: Identifier '" + s.name + "' has already been declared", line: s.ln, file: f, st: 0 }], steps: [], mem: [], n: 0, syn: true };
    ctx.env[s.name] = { kind: s.kind, val: undefined, init: false };
    ctx.order.push(s.name);
  }
  // Шаг: строка, «Память» после неё. Несколько операторов одной строки — один шаг.
  const step = (ln, extra) => {
    const last = ctx.steps[ctx.steps.length - 1];
    if (!extra && last && last.line === ln && last.cond == null) { last.mem = memSnap(ctx); return; }
    ctx.steps.push(Object.assign({ line: ln, mem: memSnap(ctx) }, extra || {}));
  };
  const run = (list) => {
    for (const s of list) {
      if (s.k === 'if') {
        ctx.ch = {}; ctx.cur = s.ln;
        const v = !!jsEval(s.cond, ctx, s.ln);
        const skip = v ? (s.alt ? stLines(s.alt.body) : []) : stLines(s.body.body);
        step(s.ln, { cond: v, skip });
        if (v) run(s.body.body); else if (s.alt) run(s.alt.body);
        continue;
      }
      if (s.k === 'block') { run(s.body.body); continue; }
      const last = ctx.steps[ctx.steps.length - 1];
      if (!(last && last.line === s.ln && last.cond == null)) ctx.ch = {};
      ctx.cur = s.ln;
      jsEval(s, ctx, s.ln);
      step(s.ln);
    }
  };
  try { run(prog); } catch (e) {
    if (e && e.rt) {
      const ln = e.ln || (ctx.cur || 0);
      ctx.out.push({ type: 'err', text: 'Uncaught ' + e.rt, line: ln, file: f, st: ctx.steps.length });
      ctx.steps.push({ line: ln, mem: memSnap(ctx), err: true });
      return { items: ctx.out, steps: ctx.steps, mem: ctx.steps.map((x) => x.mem), n: ctx.steps.length };
    }
    throw e;
  }
  return { items: ctx.out, steps: ctx.steps, mem: ctx.steps.map((x) => x.mem), n: ctx.steps.length };
}
const jsRun = (lines, file) => jsTrace(lines, file).items;
const jsErr = (items) => (items || []).find((x) => x.type === 'err') || null;
const jsLogs = (items) => (items || []).filter((x) => x.type === 'log').map((x) => x.text);
const memVal = (tr, name) => { const m = tr && tr.mem && tr.mem[tr.mem.length - 1]; const b = m && m.find((x) => x.name === name); return b ? b : null; };
// Строки, которые выполнились (по шагам).
const ranLines = (tr) => (tr && tr.steps ? tr.steps.map((s) => s.line).filter((x, i, a) => a.indexOf(x) === i) : []);
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
    else if (k.t === 'kw' || k.t === 'ctl' || k.t === 'bool' || k.t === 'tof') c = 'j2-kw';
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
// Отступ строки (по 2 пробела) — сдвиг в редакторе; сам текст — без пробелов слева.
const indOf = (text) => Math.floor((/^ */.exec(text)[0].length) / 2);
const jsL = (k, d, text, extra, lit) => codeLine(k, jsParts(String(text).trim(), lit), Object.assign({ d: d || indOf(text), cls: 'j1-line' }, extra || {}));

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

// ── ВЫПОЛНЕНИЕ ПО ШАГАМ: шаги загораются по очереди; строка if показывает ответ условия (true / false), строки
// пропущенной ветки гаснут, вывод и «Память» меняются в тот же миг. Синтаксическая ошибка — не выполняется ничего.
// tr — результат jsTrace; key — что-то, что меняется при новом запуске (иначе — по содержимому).
function traceView(T, k) {
  const steps = T.steps || [];
  const n = steps.length;
  const c = Math.min(k, n);
  const past = {}, skip = {}, cond = {};
  for (let j = 0; j < c; j += 1) {
    const s = steps[j];
    if (j < c - 1 || k > n) past[s.line] = 1;
    if (s.cond != null) { cond[s.line] = s.cond; (s.skip || []).forEach((x) => { skip[x] = 1; }); }
  }
  const err = T.items.find((x) => x.type === 'err');
  const errIn = err && (T.syn || err.st < c);
  return {
    cur: k > n || !c ? null : steps[c - 1].line,
    k: c,
    past, skip, cond,
    shown: T.syn ? T.items : T.items.filter((x) => x.st < c),
    errLine: errIn ? err.line : null,
    mem: c > 0 ? steps[c - 1].mem || [] : [],
    fresh: k <= n
  };
}
function useTraceAnim(tr, key) {
  const T = tr || { items: [], steps: [], n: 0 };
  const sig = (key != null ? key + '#' : '') + T.n + '|' + T.items.map((x) => x.type + ':' + x.line + ':' + x.text).join('|') + '|' + (T.steps || []).map((x) => x.line + (x.cond != null ? String(x.cond) : '')).join(',');
  const last = T.n;
  const [cur, setCur] = useState(99);
  useEffect(() => {
    if (!last || T.syn || reduceMotion()) { setCur(99); return undefined; }
    setCur(0);
    let k = 0;
    const t = setInterval(() => { k += 1; setCur(k); if (k > last) clearInterval(t); }, 560);
    return () => clearInterval(t);
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  return traceView(T, cur > last ? 99 : cur);
}
// Класс строки кода по ходу выполнения (n — номер строки с 1).
const execCls = (A, n) => (!A ? '' : (A.errLine === n ? ' is-err-line' : A.cur === n ? ' is-exec' : A.skip && A.skip[n] ? ' j5-skip' : A.past && A.past[n] ? ' is-past' : '')
  + (A.cond && A.cond[n] === true ? ' j5-ct' : A.cond && A.cond[n] === false ? ' j5-cf' : ''));
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
          <div key={b.name} className={'j2-box j3-box is-' + b.kind + ' is-t-' + (b.emp ? 'emp' : typeof b.val) + (b.nw ? ' is-new' : '') + (b.ch ? ' is-ch' : '') + (lit === b.name ? ' is-lit' : '')}>
            <span className="j2-box-n">{b.kind === 'const' ? J2_LOCK : null}{b.name}</span>
            {b.emp ? <b className="j2-box-v is-emp" aria-hidden="true" /> : <b key={memShow(b.val)} className={'j2-box-v' + (typeof b.val === 'string' ? ' is-str' : typeof b.val === 'number' ? ' is-num' : typeof b.val === 'boolean' ? ' is-bool' : ' is-und')}>{memShow(b.val)}</b>}
            {!b.emp ? <span className="j3-type">{typeof b.val}</span> : null}
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

// ── РАСЧЁТ ПО ШАГАМ (урок 4): главное выражение строки — шаг за шагом, в порядке JavaScript.
// «score + 5 * 2» → «10 + 5 * 2» (имена — значениями из «Памяти») → «10 + 10» (сначала умножение) → «20».
const isLitN = (n) => n && (n.k === 'num' || n.k === 'str' || n.k === 'bool' || n.k === 'und');
const litOf = (v) => (typeof v === 'number' ? { k: 'num', v } : typeof v === 'string' ? { k: 'str', v } : typeof v === 'boolean' ? { k: 'bool', v } : { k: 'und' });
function calcPrint(n) {
  if (!n) return '';
  let t;
  if (n.k === 'num') t = n.v < 0 ? '-' + String(-n.v) : String(n.v);
  else if (n.k === 'str') t = '"' + n.v + '"';
  else if (n.k === 'bool') t = String(n.v);
  else if (n.k === 'und') t = 'undefined';
  else if (n.k === 'ref') t = n.path.join('.');
  else if (n.k === 'bin') t = calcPrint(n.a) + ' ' + n.op + ' ' + calcPrint(n.b);
  else if (n.k === 'neg') t = '-' + calcPrint(n.a);
  else if (n.k === 'not') t = '!' + calcPrint(n.a);
  else if (n.k === 'typeof') t = 'typeof ' + calcPrint(n.a);
  else t = '…';
  return n.p && !isLitN(n) ? '(' + t + ')' : t;
}
function calcSubst(n, env) {
  if (!n) return n;
  if (n.k === 'ref') return n.path.length === 1 && Object.prototype.hasOwnProperty.call(env, n.path[0]) ? litOf(env[n.path[0]]) : n;
  if (n.k === 'bin') return Object.assign({}, n, { a: calcSubst(n.a, env), b: calcSubst(n.b, env) });
  if (n.k === 'neg' || n.k === 'not' || n.k === 'typeof') return Object.assign({}, n, { a: calcSubst(n.a, env) });
  return n;
}
// Один шаг: первое вычислимое место в порядке JavaScript (слева направо, глубже — раньше).
function calcStep(n) {
  if (!n || isLitN(n)) return null;
  if (n.k === 'bin') {
    if (!isLitN(n.a)) { const a = calcStep(n.a); return a ? Object.assign({}, n, { a }) : null; }
    if (!isLitN(n.b)) { const b = calcStep(n.b); return b ? Object.assign({}, n, { b }) : null; }
    return litOf(jsOp(n.op, n.a.k === 'und' ? undefined : n.a.v, n.b.k === 'und' ? undefined : n.b.v));
  }
  if (n.k === 'neg' || n.k === 'not' || n.k === 'typeof') {
    if (!isLitN(n.a)) { const a = calcStep(n.a); return a ? Object.assign({}, n, { a }) : null; }
    const v = n.a.k === 'und' ? undefined : n.a.v;
    return litOf(n.k === 'neg' ? -v : n.k === 'not' ? !v : typeof v);
  }
  return null;
}
// Шаги главного выражения строки; mem — «Память» до этой строки. Нет действий — пустой список.
const IF_RE = /^\s*(?:\}\s*)?(?:else\s+)?if\s*\((.*)\)\s*\{?\s*$/;
function jsCalc(line, mem) {
  let st;
  const m = IF_RE.exec(JS_Q(line));
  try { st = jsParseLine(m ? m[1] : line); } catch (e) { return []; }
  const s0 = st && st[0];
  if (!s0) return [];
  let node = null;
  if (m) node = s0; // условие if (…)
  else if (s0.k === 'call' && s0.args.length === 1) node = s0.args[0];
  else if (s0.k === 'decl') node = s0.init;
  else if (s0.k === 'set') node = s0.op ? { k: 'bin', op: s0.op, a: { k: 'ref', path: [s0.name] }, b: s0.val } : s0.val;
  if (!node || isLitN(node) || node.k === 'ref' && !(mem || []).some((b) => b.name === node.path[0])) return [];
  const env = {};
  (mem || []).forEach((b) => { env[b.name] = b.val; });
  const steps = [calcPrint(node)];
  let cur = calcSubst(node, env);
  if (calcPrint(cur) !== steps[0]) steps.push(calcPrint(cur));
  for (let g = 0; g < 12; g += 1) {
    const nx = calcStep(cur);
    if (!nx) break;
    cur = nx; steps.push(calcPrint(cur));
  }
  return steps.length > 1 ? steps : [];
}
// Шаги «Расчёта» для шага k (с 1) по результату jsTrace: строка шага и «Память» до него.
const calcAt = (code, tr, k) => {
  const st = tr && tr.steps && tr.steps[k - 1];
  if (!st || st.err) return [];
  return jsCalc(code[st.line - 1] || '', k > 1 ? tr.steps[k - 2].mem || [] : []);
};
// Шаги «Расчёта» шага upto или ближайшего раньше, где есть действие.
function lastCalc(code, tr, upto) {
  for (let k = Math.min(upto, tr && tr.n ? tr.n : 0); k >= 1; k -= 1) { const st = calcAt(code, tr, k); if (st.length) return st; }
  return [];
}
const J4_CALC = L3('Hisob', 'Расчёт', 'Calculation');
function JsCalc({ steps, cls, still }) {
  const pick = usePick();
  const list = steps || [];
  const sig = list.join('|');
  const [k, setK] = useState(still ? list.length : 1);
  useEffect(() => {
    if (still || reduceMotion()) { setK(list.length); return undefined; }
    setK(1);
    let i = 1;
    const t = setInterval(() => { i += 1; setK(i); if (i >= list.length) clearInterval(t); }, 700);
    return () => clearInterval(t);
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={'j4-calc' + (list.length ? '' : ' is-empty') + (cls ? ' ' + cls : '')} translate="no" aria-live="polite">
      <span className="j4-calc-h">{pick(J4_CALC)}</span>
      <div className="j4-calc-row">
        {list.slice(0, k).map((t, i) => (
          <React.Fragment key={i + ':' + t}>
            {i > 0 ? <i className="j4-calc-arr" aria-hidden="true">→</i> : null}
            <code className={'j4-calc-st kz-a-drop' + (i === list.length - 1 ? ' is-res' : '') + (i === k - 1 ? ' is-cur' : '')}>{jsParts(t)}</code>
          </React.Fragment>
        ))}
        {!list.length ? <span className="j4-calc-empty">…</span> : null}
      </div>
    </div>
  );
}
