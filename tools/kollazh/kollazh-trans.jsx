// ПЕРЕХОД МЕЖДУ ЭКРАНАМИ «РАЗБОР И СБОРКА». По «Дальше» / «Назад» снимается
// неподвижная копия вырезок текущего листа; вырезки копии ступенчато (stop-motion)
// разлетаются от центра листа наружу с поворотом. Новый экран уже на месте
// (голос, кнопки, проверки работают как обычно), но ждёт, пока старое разлетится;
// потом его вырезки слетаются на свои места. Вырезки, у которых есть свой влёт
// (kz-a-drop и т. п.), влетают своим движением. При «меньше движения» — смена без
// анимации. Шорох бумаги включается сам (kzScatter, kzAsmIn — в PAPER_ANIMS).
const KZ_PIECES = '.kz-ask-wrap, .kz-br, .kz-line, .kz-scrap, .kz-btn, .kz-card, .kz-zone, .kz-label, .kz-slot, '
  + '.kz-stagebox > .kz-cut, .kz-manbox .kz-cut, .kz-collage, .kz-role, .kz-next, .kz-msg, .keys, .kz-tray > *, '
  + '.kz-piece';   // любая своя вырезка урока на этом наборе (практика: редактор, заметки, улица)
const KZ_OUT_MS = 520;     // разлёт
const KZ_WAIT_MS = 300;    // новый экран ждёт, пока старое разлетается
const _kzT = { busy: 0, pending: false };

// Только верхние вырезки: деталь внутри другой детали летит вместе с ней.
const kzTop = (nodes) => {
  const all = Array.prototype.slice.call(nodes);
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
};
const kzRand = (a, b) => a + Math.random() * (b - a);

function kzSnapshotOut() {
  const sheet = kzLiveSheet();
  const stage = document.querySelector('.stage');
  if (!sheet || !stage) return false;
  const r = sheet.getBoundingClientRect();
  const clone = sheet.cloneNode(true);
  // Лист, скотч и вырезки по углам одинаковы на всех экранах — разлетается только содержимое.
  clone.querySelectorAll('.kz-sheet-wrap, .kz-deco').forEach((e) => e.remove());
  // Набранный текст в полях копии (значение textarea не копируется само).
  const src = sheet.querySelectorAll('textarea'), dst = clone.querySelectorAll('textarea');
  dst.forEach((t, i) => { if (src[i]) t.value = src[i].value; });
  const layer = document.createElement('div');
  layer.className = 'kz-snap';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  clone.style.width = '100%';
  clone.style.height = '100%';
  layer.appendChild(clone);
  // Не в саму панель экрана: она пересоздаётся при смене экрана и унесла бы снимок.
  (stage.parentNode || document.body).appendChild(layer);
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const reach = Math.max(window.innerWidth, window.innerHeight) * 0.75;
  kzTop(clone.querySelectorAll(KZ_PIECES)).forEach((el, i) => {
    const b = el.getBoundingClientRect();
    let dx = b.left + b.width / 2 - cx, dy = b.top + b.height / 2 - cy;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    // Наружу от центра, чуть вверх (как вырезки, сметённые со стола), со своим разбросом.
    el.style.setProperty('--ox', ((dx + kzRand(-0.25, 0.25)) * reach).toFixed(0) + 'px');
    el.style.setProperty('--oy', ((dy - 0.35 + kzRand(-0.2, 0.2)) * reach).toFixed(0) + 'px');
    el.style.setProperty('--or', kzRand(-38, 38).toFixed(0) + 'deg');
    el.style.setProperty('--od', ((i % 7) * 0.025).toFixed(3) + 's');
    el.classList.add('kz-out-go');
  });
  setTimeout(() => { if (layer.parentNode) layer.parentNode.removeChild(layer); }, KZ_OUT_MS + 260);
  return true;
}

// Настоящий лист экрана — не копия в снимке (React ставит новый экран после слоя снимка).
const kzLiveSheet = () => Array.prototype.slice.call(document.querySelectorAll('.kz-sheet')).find((x) => !x.closest('.kz-snap')) || null;

function kzAssembleIn() {
  const sheet = kzLiveSheet();
  if (!sheet) return;
  // Лист не проявляется заново: бумага остаётся на столе, меняются только вырезки.
  // Встроенным стилем и навсегда: снятый позже запрет перезапустил бы проявление (вспышка).
  sheet.style.animation = 'none';
  sheet.classList.add('kz-asm-wait');   // скрыт, свои влёты на паузе
  setTimeout(() => {
    const H = window.innerHeight, W = window.innerWidth;
    let n = 0;
    kzTop(sheet.querySelectorAll(KZ_PIECES)).forEach((el) => {
      const cs = getComputedStyle(el);
      // Свой влёт есть — пусть летит им (снимается с паузы вместе со всеми).
      if (cs.animationName !== 'none' && cs.animationIterationCount.indexOf('infinite') < 0) return;
      const fromLeft = n % 2 === 0;
      el.style.setProperty('--ix', ((fromLeft ? -1 : 1) * kzRand(0.25, 0.55) * W).toFixed(0) + 'px');
      el.style.setProperty('--iy', (kzRand(-0.55, -0.2) * H).toFixed(0) + 'px');
      el.style.setProperty('--ir', kzRand(-30, 30).toFixed(0) + 'deg');
      const dl = Math.min(0.3, n * 0.035);
      n += 1;
      el.style.animation = 'kzAsmIn .56s steps(1, end) ' + dl.toFixed(3) + 's both';
      // Снять, когда сел: иначе встроенная анимация перебьёт будущие (тряску, огонёк).
      setTimeout(() => { el.style.animation = ''; }, (0.56 + dl) * 1000 + 80);
    });
    sheet.classList.remove('kz-asm-wait');
  }, KZ_WAIT_MS);
}

// Обёртка навигации: снимок старого листа → смена экрана → сборка нового.
function useKzTransition(screenKey) {
  const go = useCallback((fn) => {
    if (!fn) return fn;
    return () => {
      const now = Date.now();
      if (now - _kzT.busy < KZ_WAIT_MS + 120) return;   // двойное нажатие не пролистывает экран
      _kzT.busy = now;
      if (!reduceMotion() && kzSnapshotOut()) _kzT.pending = true;
      fn();
    };
  }, []);
  useLayoutEffect(() => {
    if (!_kzT.pending) return;
    _kzT.pending = false;
    kzAssembleIn();
  }, [screenKey]);
  return go;
}
