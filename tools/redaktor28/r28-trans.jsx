// ПЕРЕХОД МЕЖДУ ЭКРАНАМИ «ГЛИТЧ» (тестовый урок 28, 02.11.2026; заказчик выбрал из демо «Всё вместе,
// коротко» вместе со «сменой вкладки», затем: «не надо сдвигать в сторону — хочу глитч при переходах»;
// полосу вкладок сверху убрали: «смотрится очень глупо»).
// Сборка кладёт этот файл на место kollazh-trans.jsx. Ничего не уезжает — экран сбоит на месте:
//   · старый экран (неподвижная копия поверх урока) четыре кадра «ломается»: красно-голубая кайма
//     дрожит, полосы экрана прыгают вбок, — и исчезает;
//   · новый экран появляется тоже со сбоем: кайма и сдвинутые полосы, за три кадра успокаивается;
// Кадры сбоя — ступенями, без плавности (так выглядит настоящий сбой сигнала). Около 0,4 с.
// Новые вещи — настоящие: голос, кнопки и проверки работают как обычно. «Меньше движения» — без анимации.
const R28_WAIT = 450;
const _r28T = { busy: 0, pending: false, dir: 1 };
const kzLiveSheet = () => Array.prototype.slice.call(document.querySelectorAll('.kz-sheet')).find((x) => !x.closest('.kz-snap')) || null;
const r28Rnd = (a, b) => a + Math.random() * (b - a);
const r28Fringe = (d) => 'drop-shadow(' + (-d) + 'px 0 0 rgba(255, 0, 72, .55)) drop-shadow(' + d + 'px 0 0 rgba(0, 196, 255, .55))';
const R28_OUT = 170;   // сколько длится сбой старого экрана, мс

// Копия листа поверх урока (класс p17 r28 — чтобы у копии был облик урока).
function r28Layer(sheet) {
  const stage = document.querySelector('.stage');
  if (!sheet || !stage) return null;
  const r = sheet.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.className = 'kz-snap r28-snap p17 r28';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', overflow: 'hidden' });
  (stage.parentNode || document.body).appendChild(layer);
  return layer;
}
function r28Clone(sheet, layer) {
  const c = sheet.cloneNode(true);
  c.querySelectorAll('.kz-hand-layer').forEach((e) => e.remove());
  const src = sheet.querySelectorAll('textarea'), dst = c.querySelectorAll('textarea');
  dst.forEach((t, i) => { if (src[i]) t.value = src[i].value; });
  Object.assign(c.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });
  layer.appendChild(c);
  return c;
}
// Кадр сбоя для полос: случайная полоса экрана и её сдвиг.
function r28Band(el, amp, d) {
  const t = r28Rnd(4, 82), h = r28Rnd(4, 15);
  el.style.clipPath = 'polygon(0 ' + t + '%, 100% ' + t + '%, 100% ' + (t + h) + '%, 0 ' + (t + h) + '%)';
  el.style.transform = 'translateX(' + r28Rnd(-amp, amp).toFixed(1) + 'px)';
  el.style.filter = r28Fringe(d);
}

// Старый экран: копия сбоит четыре кадра по ~40 мс и исчезает.
function r28GlitchOut() {
  const sheet = kzLiveSheet();
  const layer = r28Layer(sheet);
  if (!layer) return false;
  const base = r28Clone(sheet, layer), b1 = r28Clone(sheet, layer), b2 = r28Clone(sheet, layer);
  for (let f = 0; f < 4; f += 1) {
    setTimeout(() => {
      const d = r28Rnd(4, 10);
      base.style.filter = r28Fringe(d);
      base.style.transform = 'translateX(' + r28Rnd(-4, 4).toFixed(1) + 'px)';
      r28Band(b1, 28, d * 1.3);
      r28Band(b2, 18, d);
    }, f * 42);
  }
  setTimeout(() => layer.remove(), R28_OUT);
  return true;
}

// Новый экран: пока старый сбоит — скрыт; потом появляется со сбоем и за три кадра успокаивается.
function r28GlitchIn() {
  const sheet = kzLiveSheet();
  if (!sheet) return;
  const body = sheet.querySelector('.kz-sheet-body') || sheet;
  const T = R28_OUT + 150;
  const k = (ms) => ms / T;
  body.animate([
    { opacity: 0, filter: 'none', transform: 'none' },
    { opacity: 1, filter: r28Fringe(9), transform: 'translateX(-6px)', offset: k(R28_OUT) },
    { opacity: 1, filter: r28Fringe(5), transform: 'translateX(5px)', offset: k(R28_OUT + 45) },
    { opacity: 1, filter: r28Fringe(2), transform: 'translateX(-2px)', offset: k(R28_OUT + 95) },
    { opacity: 1, filter: 'none', transform: 'none', offset: k(R28_OUT + 140) },
    { opacity: 1, filter: 'none', transform: 'none' }
  ], { duration: T, easing: 'steps(1, end)' });
  // Две полосы нового экрана прыгают вбок в первые кадры его появления.
  setTimeout(() => {
    const live = kzLiveSheet();
    const layer = live && r28Layer(live);
    if (!layer) return;
    const b1 = r28Clone(live, layer), b2 = r28Clone(live, layer);
    [0, 1].forEach((f) => setTimeout(() => { r28Band(b1, 22, 7 - f * 3); r28Band(b2, 14, 6 - f * 3); }, f * 45));
    setTimeout(() => layer.remove(), 95);
  }, R28_OUT);
}

function useKzTransition(screenKey) {
  const go = useCallback((fn, dir) => {
    if (!fn) return fn;
    return () => {
      const now = Date.now();
      if (now - _r28T.busy < R28_WAIT) return;   // двойное нажатие не пролистывает экран
      _r28T.busy = now;
      _r28T.dir = dir || 1;
      _r28T.pending = false;
      if (!reduceMotion()) {
        _r28T.pending = r28GlitchOut();
      }
      fn();
    };
  }, []);
  useLayoutEffect(() => {
    if (!_r28T.pending) return;
    _r28T.pending = false;
    r28GlitchIn();
  }, [screenKey]);
  return go;
}
