// Шорох бумаги (в книжке — шорох страницы): звучит, пока вырезка движется или лист переворачивается (ступенчатые анимации
// kz… и полёт частей), и стихает, как только движение кончилось. Бесконечные
// движения (дрожь, взмах руки, огонёк) не шуршат. Выключенный звук урока
// (_soundOff канона) и «меньше движения» — тишина.
// Книжка: шуршит кисть при смене страницы (paperOn в kniga-trans.jsx) и полоска при перестановке; мягкие влёты
// вещей на страницу идут без шороха (в бумажном наборе шуршала каждая вырезка).
const PAPER_ANIMS = { kzSlideUp: 1, kzSlideUnder: 1 };
// Громкость шороха: фон, тише голоса и звуков ответа (заказчик: 0.11; было 0.55, потом 0.22).
const PAPER_VOL = 0.11;
const PAPER_PROPS = { translate: 1, scale: 1, rotate: 1, transform: 1 };
const _pp = { ctx: null, buf: null, src: null, gain: null, live: new Map(), stopT: 0, pruneT: 0 };

function paperCtx() {
  if (_pp.ctx) return _pp.ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  _pp.ctx = new AC();
  _pp.ctx.onstatechange = () => { if (_pp.ctx.state === 'running' && _pp.live.size) paperOn(); };
  try {
    const bin = atob(PAPER_MP3);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    _pp.ctx.decodeAudioData(bytes.buffer, (b) => { _pp.buf = b; if (_pp.live.size) paperOn(); }, () => {});
  } catch (e) { /* без звука */ }
  return _pp.ctx;
}

function paperOn() {
  clearTimeout(_pp.stopT);
  if (_soundOff || _pp.src) return;
  const ctx = paperCtx();
  if (!ctx || !_pp.buf) return;
  // Звук ещё не разрешён (урок открыт без касания) — шорох начнётся, как только
  // браузер его пустит (onstatechange), если движение ещё идёт.
  if (ctx.state !== 'running') { ctx.resume().catch(() => {}); return; }
  const src = ctx.createBufferSource(), g = ctx.createGain(), t = ctx.currentTime;
  src.buffer = _pp.buf;
  src.loop = true;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(PAPER_VOL, t + 0.03);
  src.connect(g); g.connect(ctx.destination);
  src.start(t, Math.random() * Math.max(0, _pp.buf.duration - 1));   // каждый раз — другой кусок шороха
  _pp.src = src; _pp.gain = g;
}

function paperOff() {
  const src = _pp.src, g = _pp.gain;
  _pp.src = null; _pp.gain = null;
  if (!src) return;
  const t = _pp.ctx.currentTime;
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  src.stop(t + 0.1);
}

// Движение кончилось: короткая выдержка, чтобы соседние вырезки с задержкой
// (лесенка влёта) шуршали одним звуком, а не щёлкали.
function paperCheck() {
  const now = Date.now();
  _pp.live.forEach((t0, k) => { if (!k.el.isConnected || now - t0 > 2500) _pp.live.delete(k); });
  clearTimeout(_pp.stopT);
  if (!_pp.live.size) _pp.stopT = setTimeout(() => { if (!_pp.live.size) paperOff(); }, 160);
}

function usePaperSound() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    paperCtx();   // сразу: пока собирается первая сцена, звук успеет раскодироваться
    const wake = () => { if (_pp.ctx && _pp.ctx.state !== 'running') _pp.ctx.resume().catch(() => {}); };
    const keys = new Map();   // элемент + имя движения → ключ в _pp.live
    const keyOf = (el, name) => {
      let m = keys.get(el);
      if (!m) { m = {}; keys.set(el, m); }
      return m[name] || (m[name] = { el, name });
    };
    const start = (el, name) => { _pp.live.set(keyOf(el, name), Date.now()); paperOn(); };
    const end = (el, name) => { _pp.live.delete(keyOf(el, name)); paperCheck(); };
    const onAnimStart = (e) => {
      if (!PAPER_ANIMS[e.animationName]) return;
      if (getComputedStyle(e.target).animationIterationCount.indexOf('infinite') >= 0) return;
      start(e.target, e.animationName);
    };
    const onAnimEnd = (e) => { if (PAPER_ANIMS[e.animationName]) end(e.target, e.animationName); };
    const isCut = (e) => PAPER_PROPS[e.propertyName] && e.target.classList && e.target.classList.contains('kz-cut');
    const onTrStart = (e) => { if (isCut(e)) start(e.target, 'tr:' + e.propertyName); };
    const onTrEnd = (e) => { if (isCut(e)) end(e.target, 'tr:' + e.propertyName); };
    // Вырезка исчезла посреди движения (смена экрана) — событий конца не будет.
    _pp.pruneT = setInterval(() => { if (_pp.live.size) paperCheck(); }, 300);
    const ev = [['animationstart', onAnimStart], ['animationend', onAnimEnd], ['animationcancel', onAnimEnd],
      ['transitionrun', onTrStart], ['transitionend', onTrEnd], ['transitioncancel', onTrEnd], ['pointerdown', wake], ['keydown', wake]];
    ev.forEach(([n, f]) => document.addEventListener(n, f, true));
    return () => {
      ev.forEach(([n, f]) => document.removeEventListener(n, f, true));
      clearInterval(_pp.pruneT); clearTimeout(_pp.stopT);
      _pp.live.clear(); paperOff();
    };
  }, []);
}
