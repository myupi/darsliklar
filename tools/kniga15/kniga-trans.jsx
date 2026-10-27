// ПЕРЕХОД МЕЖДУ ЭКРАНАМИ (тестовый урок 15, 27.10.2026). Два варианта, выбран
// KB_TRANS (для сравнения в плеере — ?trans=wash или ?trans=pan):
//   pan  — ПРОЕЗД КАМЕРЫ ПО МИРУ: старая сцена уезжает, новая приезжает («Дальше» —
//          справа налево, «Назад» — наоборот); слои мира едут с разной скоростью
//          (параллакс): небо и солнце стоят, облака плывут медленно, дальние холмы
//          и крона — быстрее, ближние холмы и листья — быстрее всех, содержимое
//          страницы — вместе с камерой. Узор холмов и кроны бесконечный, поэтому
//          мир выглядит одним длинным разворотом-путешествием.
//   wash — АКВАРЕЛЬНАЯ ЗАЛИВКА: кисть смывает старую страницу мазками с мягким
//          краем, по фронту — цветной след краски, вещи новой страницы проступают
//          из размытия. Маска и след рисуются на маленьком холсте и растягиваются.
// Новый экран живёт как обычно: голос, кнопки, свои влёты. При «меньше движения» —
// смена без анимации.
const KB_TRANS = (() => {
  try { const q = new URLSearchParams(window.location.search).get('trans'); if (q === 'wash' || q === 'pan') return q; } catch (e) { /* no-op */ }
  return 'pan';
})();
const KB_PAN_MS = 1000;    // проезд камеры
const KB_WASH_MS = 820;    // проход кисти (для покадровой проверки: window.__kbWashMs)
const kbWashMs = () => (typeof window !== 'undefined' && window.__kbWashMs) || KB_WASH_MS;
const KZ_WAIT_MS = 300;    // двойное нажатие не пролистывает два экрана
const _kzT = { busy: 0, pending: false, dir: 1, w: 0 };
const KB_PAINT = ['rgba(246, 214, 112, A)', 'rgba(141, 204, 184, A)', 'rgba(244, 160, 148, A)', 'rgba(196, 224, 140, A)', 'rgba(255, 238, 190, A)'];

// Настоящий лист экрана — не копия в снимке (React ставит новый экран после слоя снимка).
const kzLiveSheet = () => Array.prototype.slice.call(document.querySelectorAll('.kz-sheet')).find((x) => !x.closest('.kz-snap')) || null;

// Мазок с неровным краем: многоугольник по эллипсу, радиус дрожит.
function kbBlob(ctx, x, y, rx, ry, rot) {
  const n = 14;
  ctx.beginPath();
  for (let i = 0; i <= n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const k = 0.72 + Math.random() * 0.5;
    const px = Math.cos(a) * rx * k, py = Math.sin(a) * ry * k;
    const qx = x + px * Math.cos(rot) - py * Math.sin(rot), qy = y + px * Math.sin(rot) + py * Math.cos(rot);
    if (i === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
  }
  ctx.closePath();
  ctx.fill();
}

function kbWash(dir) {
  const sheet = kzLiveSheet();
  const stage = document.querySelector('.stage');
  if (!sheet || !stage) return false;
  const r = sheet.getBoundingClientRect();
  const clone = sheet.cloneNode(true);
  clone.querySelectorAll('.kz-hand-layer').forEach((e) => e.remove());
  // Набранный текст в полях копии (значение textarea не копируется само).
  const src = sheet.querySelectorAll('textarea'), dst = clone.querySelectorAll('textarea');
  dst.forEach((t, i) => { if (src[i]) t.value = src[i].value; });
  clone.style.width = '100%';
  clone.style.height = '100%';
  const layer = document.createElement('div');
  layer.className = 'kz-snap kb-wash';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  const old = document.createElement('div');
  old.className = 'kb-wash-old';
  old.appendChild(clone);
  const paint = document.createElement('canvas');
  paint.className = 'kb-wash-paint';
  layer.appendChild(old);
  layer.appendChild(paint);
  (stage.parentNode || document.body).appendChild(layer);

  // Маленькие холсты: маска старой страницы и цветной след.
  const W = 200, H = Math.max(60, Math.round(W * r.height / Math.max(1, r.width)));
  const mask = document.createElement('canvas');
  mask.width = W; mask.height = H; paint.width = W; paint.height = H;
  const m = mask.getContext('2d'), p = paint.getContext('2d');
  m.fillStyle = '#000';
  m.fillRect(0, 0, W, H);
  const fwd = dir >= 0;
  const X = (x) => (fwd ? x : W - x);   // направление кисти
  const t0 = performance.now();
  const dur = kbWashMs();
  let raf = 0;
  const frame = (now) => {
    const t = Math.min(1, (now - t0) / dur);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const front = -W * 0.18 + e * W * 1.45;
    // Маска: мазки стирают старую страницу у фронта, позади фронта — всё.
    m.globalCompositeOperation = 'destination-out';
    m.fillStyle = '#000';
    // Позади фронта стирается всё — по волнистой границе, без ровного края.
    const back = front - W * 0.3;
    if (back > -W * 0.1) {
      m.beginPath();
      m.moveTo(X(-2), -2);
      for (let k = 0; k <= 12; k += 1) {
        const y = (k / 12) * H;
        m.lineTo(X(back + Math.sin(k * 1.9 + t * 7) * W * 0.05 + Math.random() * W * 0.03), y);
      }
      m.lineTo(X(-2), H + 2);
      m.closePath();
      m.fill();
    }
    m.filter = 'blur(1.4px)';
    for (let i = 0; i < 9; i += 1) {
      const y = Math.random() * H;
      const x = front - Math.random() * W * 0.26 + Math.sin(y / H * 6.3 + t * 5) * W * 0.03;
      const rx = H * (0.12 + Math.random() * 0.2), ry = rx * (0.45 + Math.random() * 0.35);
      kbBlob(m, X(x), y, rx, ry, (Math.random() - 0.5) * 0.7);
    }
    // Зернистость края: мелкие брызги впереди фронта.
    for (let i = 0; i < 6; i += 1) {
      const y = Math.random() * H, x = front + Math.random() * W * 0.05;
      kbBlob(m, X(x), y, 1.2 + Math.random() * 2.4, 1 + Math.random() * 2, 0);
    }
    m.filter = 'none';
    old.style.webkitMaskImage = old.style.maskImage = 'url(' + mask.toDataURL() + ')';
    // След краски: свежие цветные мазки у фронта, старые тают.
    p.globalCompositeOperation = 'destination-out';
    p.fillStyle = 'rgba(0, 0, 0, .14)';
    p.fillRect(0, 0, W, H);
    p.globalCompositeOperation = 'source-over';
    if (t < 0.97) {
      for (let i = 0; i < 5; i += 1) {
        const y = Math.random() * H;
        const x = front - Math.random() * W * 0.12;
        p.fillStyle = KB_PAINT[(Math.random() * KB_PAINT.length) | 0].replace('A', (0.1 + Math.random() * 0.14).toFixed(2));
        const rx = H * (0.1 + Math.random() * 0.18);
        kbBlob(p, X(x), y, rx, rx * (0.5 + Math.random() * 0.4), (Math.random() - 0.5) * 0.8);
      }
    }
    if (t < 1) raf = requestAnimationFrame(frame);
    else {
      layer.classList.add('is-done');
      setTimeout(() => { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 260);
      if (typeof paperOff === 'function') paperOff();
    }
  };
  raf = requestAnimationFrame(frame);
  if (typeof paperOn === 'function') paperOn();
  layer._stop = () => cancelAnimationFrame(raf);
  return true;
}

// ПРОЕЗД: копия старой сцены (без неба и узоров — их даёт новая страница) уезжает
// слоями; на новой странице слои и содержимое приезжают с другой стороны.
function kbPanOut(dir) {
  const sheet = kzLiveSheet();
  const stage = document.querySelector('.stage');
  if (!sheet || !stage) return false;
  const r = sheet.getBoundingClientRect();
  const clone = sheet.cloneNode(true);
  clone.querySelectorAll('.kz-hand-layer').forEach((e) => e.remove());
  const src = sheet.querySelectorAll('textarea'), dst = clone.querySelectorAll('textarea');
  dst.forEach((t, i) => { if (src[i]) t.value = src[i].value; });
  clone.style.width = '100%';
  clone.style.height = '100%';
  const layer = document.createElement('div');
  layer.className = 'kz-snap kb-pan-old';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  layer.style.setProperty('--pw', r.width + 'px');
  layer.style.setProperty('--dir', String(dir >= 0 ? 1 : -1));
  layer.style.setProperty('--pd', KB_PAN_MS + 'ms');
  layer.appendChild(clone);
  (stage.parentNode || document.body).appendChild(layer);
  setTimeout(() => { if (layer.parentNode) layer.parentNode.removeChild(layer); }, KB_PAN_MS + 60);
  _kzT.w = r.width;
  return true;
}
function kbPanIn(dir) {
  const sheet = kzLiveSheet();
  if (!sheet) return;
  sheet.style.animation = 'none';
  sheet.style.setProperty('--pw', (_kzT.w || sheet.getBoundingClientRect().width) + 'px');
  sheet.style.setProperty('--dir', String(dir >= 0 ? 1 : -1));
  sheet.style.setProperty('--pd', KB_PAN_MS + 'ms');
  sheet.classList.add('kb-pan-in');
  setTimeout(() => sheet.classList.remove('kb-pan-in'), KB_PAN_MS + 40);
}

// Новая страница: фон виден сразу (его открывает кисть), вещи проступают из
// размытия, когда кисть прошла большую часть пути.
function kbInkIn() {
  const sheet = kzLiveSheet();
  if (!sheet) return;
  sheet.style.animation = 'none';
  sheet.classList.add('kb-ink-wait');
  setTimeout(() => {
    sheet.classList.remove('kb-ink-wait');
    sheet.classList.add('kb-ink-in');
    setTimeout(() => sheet.classList.remove('kb-ink-in'), 700);
  }, Math.round(kbWashMs() * 0.45));
}

// Обёртка навигации: снимок разворота → смена экрана → проезд камеры или кисть.
// dir: 1 — «Дальше», -1 — «Назад».
function useKzTransition(screenKey) {
  const go = useCallback((fn, dir) => {
    if (!fn) return fn;
    return () => {
      const now = Date.now();
      if (now - _kzT.busy < KZ_WAIT_MS + 120) return;
      _kzT.busy = now;
      // Прошлая заливка ещё идёт — убрать её сразу.
      document.querySelectorAll('.kz-snap.kb-wash, .kz-snap.kb-pan-old').forEach((l) => { if (l._stop) l._stop(); l.remove(); });
      _kzT.dir = dir || 1;
      if (!reduceMotion() && (KB_TRANS === 'pan' ? kbPanOut(_kzT.dir) : kbWash(_kzT.dir))) _kzT.pending = true;
      fn();
    };
  }, []);
  useLayoutEffect(() => {
    if (!_kzT.pending) return;
    _kzT.pending = false;
    if (KB_TRANS === 'pan') kbPanIn(_kzT.dir); else kbInkIn();
  }, [screenKey]);
  return go;
}
