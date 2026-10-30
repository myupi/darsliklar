// ПЕРЕХОД МЕЖДУ ЭКРАНАМИ «КЛУБКИ ШЕРСТИ» (тестовый урок 17, 30.10.2026; заказчик выбрал
// из демо: «Клубки шерсти — вот этот больше всего нравится»). Вместо бумажного «разбора
// и сборки» урока 1. Сборка кладёт этот файл на место kollazh-trans.jsx.
//   · каждая вещь старого экрана сматывается в пушистый клубок (круг с полосками пряжи
//     её цвета) и, крутясь, укатывается за край: по «Дальше» — вправо, по «Назад» — влево;
//   · новые клубки прикатываются с другой стороны и разматываются в вещи с пружинкой.
// Старый экран — неподвижная копия поверх урока (с обликом урока — классом p17), новые
// вещи — настоящие: голос, кнопки и проверки работают как обычно. «Меньше движения» — смена без анимации.
const P17_PIECES = '.kz-ask-wrap, .kz-scene > *, .kz-sheet-body > .kz-row, .kz-sheet-body > .kz-keys-wrap > *, .kz-sheet-body > .keys, '
  + '.kz-sheet-body > .kz-pick, .kz-sheet-body > .kz-tray, .kz-sheet-body > .kz-build, .kz-sheet-body > .kz-msg, .kz-sheet-body > .kz-zones';
const P17_WAIT = 300;
const P17_YARN = ['#FFD563', '#77DCB8', '#FF8D7D', '#8CCBF5', '#F4A6CB'];
const _p17T = { busy: 0, pending: false, dir: 1 };

const p17Top = (nodes) => {
  const all = Array.prototype.slice.call(nodes);
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
};
const kzLiveSheet = () => Array.prototype.slice.call(document.querySelectorAll('.kz-sheet')).find((x) => !x.closest('.kz-snap')) || null;

// Цвет пряжи — цвет самой вещи (если он есть), иначе — из палитры урока по порядку.
function p17YarnColor(el, i) {
  const bg = getComputedStyle(el).backgroundColor;
  const m = bg && bg.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    const a = p[3] == null ? 1 : p[3];
    const light = (p[0] + p[1] + p[2]) / 3 > 238;
    if (a > 0.6 && !light) return bg;
  }
  return P17_YARN[i % P17_YARN.length];
}
// Клубок: размер — по вещи (не больше 56 px), масштаб по осям — чтобы из прямоугольника вышел круг.
function p17Ball(el) {
  const r = el.getBoundingClientRect();
  const w = Math.max(1, r.width), h = Math.max(1, r.height);
  const s = Math.max(26, Math.min(56, Math.min(w, h) * 0.55));
  return { r, sx: s / w, sy: s / h };
}
// Пряжа поверх вещи: витки-полоски и блик; видна, пока вещь — клубок.
function p17Yarn(el, color) {
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const y = document.createElement('span');
  y.setAttribute('aria-hidden', 'true');
  Object.assign(y.style, {
    position: 'absolute', inset: '0', zIndex: '50', pointerEvents: 'none', borderRadius: 'inherit', opacity: '0',
    backgroundColor: color,
    backgroundImage: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,.55), rgba(255,255,255,0) 46%), '
      + 'repeating-linear-gradient(32deg, rgba(255,255,255,.4) 0 3px, rgba(0,0,0,0) 3px 8px), '
      + 'repeating-linear-gradient(-58deg, rgba(0,0,0,.09) 0 2px, rgba(0,0,0,0) 2px 9px), '
      + 'radial-gradient(circle at 70% 80%, rgba(0,0,0,.18), rgba(0,0,0,0) 60%)'
  });
  el.appendChild(y);
  return y;
}

// Старый экран: неподвижная копия; её вещи сматываются в клубки и укатываются.
function p17RollOut(dir) {
  const sheet = kzLiveSheet();
  const stage = document.querySelector('.stage');
  if (!sheet || !stage) return false;
  const r = sheet.getBoundingClientRect();
  const clone = sheet.cloneNode(true);
  clone.querySelectorAll('.kz-hand-layer').forEach((e) => e.remove());
  const src = sheet.querySelectorAll('textarea'), dst = clone.querySelectorAll('textarea');
  dst.forEach((t, i) => { if (src[i]) t.value = src[i].value; });
  // Копия лежит вне урока — ей нужен облик урока (класс p17), иначе проступал бумажный лист урока 1.
  const layer = document.createElement('div');
  layer.className = 'kz-snap p17-snap p17';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  clone.style.width = '100%';
  clone.style.height = '100%';
  layer.appendChild(clone);
  (stage.parentNode || document.body).appendChild(layer);
  const W = window.innerWidth;
  const body = clone.querySelector('.kz-sheet-body') || clone;
  let last = 0;
  p17Top(body.querySelectorAll(P17_PIECES)).forEach((el, i) => {
    const b = p17Ball(el);
    const cx = b.r.left + b.r.width / 2;
    const tx = dir > 0 ? W - cx + 80 : -cx - 80;
    const dl = i * 45;
    const br = getComputedStyle(el).borderRadius || '0px';
    el.style.overflow = 'hidden';
    const y = p17Yarn(el, p17YarnColor(el, i));
    // Скорость — у каждого этапа своя: сматывание плавное, качение — с разгоном.
    const opt = { duration: 760, delay: dl, easing: 'linear', fill: 'forwards' };
    el.animate([
      { transform: 'none', borderRadius: br, easing: 'cubic-bezier(.3, 0, .25, 1)' },
      { transform: 'scale(' + b.sx + ', ' + b.sy + ')', borderRadius: '50%', offset: 0.4, easing: 'cubic-bezier(.55, 0, .85, .45)' },
      { transform: 'translateX(' + tx + 'px) rotate(' + (dir * 540) + 'deg) scale(' + b.sx + ', ' + b.sy + ')', borderRadius: '50%' }
    ], opt);
    y.animate([{ opacity: 0 }, { opacity: 1, offset: 0.32 }, { opacity: 1 }], opt);
    last = Math.max(last, dl + 760);
  });
  setTimeout(() => { if (layer.parentNode) layer.parentNode.removeChild(layer); }, last + 80);
  return true;
}

// Новый экран: клубки прикатываются с другой стороны и разматываются (у кого свой влёт — летят им).
function p17RollIn(dir) {
  const sheet = kzLiveSheet();
  if (!sheet) return;
  sheet.style.animation = 'none';
  const body = sheet.querySelector('.kz-sheet-body') || sheet;
  const own = (el) => { const cs = getComputedStyle(el); return cs.animationName !== 'none' && cs.animationIterationCount.indexOf('infinite') < 0; };
  const W = window.innerWidth;
  let n = 0;
  p17Top(body.querySelectorAll(P17_PIECES)).forEach((el) => {
    for (let e = el; e && e !== body; e = e.parentElement) if (own(e)) return;
    const b = p17Ball(el);
    const cx = b.r.left + b.r.width / 2;
    const fx = dir > 0 ? -cx - 80 : W - cx + 80;
    const dl = 330 + n * 60;
    const br = getComputedStyle(el).borderRadius || '0px';
    const keep = { overflow: el.style.overflow, position: el.style.position };
    el.style.overflow = 'hidden';
    const y = p17Yarn(el, p17YarnColor(el, n));
    n += 1;
    // Прикатывается с торможением, разматывается с пружинкой.
    const opt = { duration: 820, delay: dl, easing: 'linear', fill: 'backwards' };
    const a = el.animate([
      { transform: 'translateX(' + fx + 'px) rotate(' + (-dir * 540) + 'deg) scale(' + b.sx + ', ' + b.sy + ')', borderRadius: '50%', easing: 'cubic-bezier(.15, .55, .35, 1)' },
      { transform: 'scale(' + b.sx + ', ' + b.sy + ')', borderRadius: '50%', offset: 0.55, easing: 'cubic-bezier(.3, 0, .3, 1)' },
      { transform: 'scale(1.05, .95)', borderRadius: '18px', offset: 0.84, easing: 'ease-out' },
      { transform: 'none', borderRadius: br }
    ], opt);
    y.animate([{ opacity: 1 }, { opacity: 1, offset: 0.58 }, { opacity: 0, offset: 0.8 }, { opacity: 0 }], opt);
    a.onfinish = a.oncancel = () => { y.remove(); el.style.overflow = keep.overflow; el.style.position = keep.position; };
  });
}

function useKzTransition(screenKey) {
  const go = useCallback((fn, dir) => {
    if (!fn) return fn;
    return () => {
      const now = Date.now();
      if (now - _p17T.busy < P17_WAIT + 120) return;   // двойное нажатие не пролистывает экран
      _p17T.busy = now;
      _p17T.dir = dir || 1;
      if (!reduceMotion() && p17RollOut(_p17T.dir)) _p17T.pending = true;
      fn();
    };
  }, []);
  useLayoutEffect(() => {
    if (!_p17T.pending) return;
    _p17T.pending = false;
    p17RollIn(_p17T.dir);
  }, [screenKey]);
  return go;
}
