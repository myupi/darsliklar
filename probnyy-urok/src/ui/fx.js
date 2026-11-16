// Звуки-отклики (короткие тоны WebAudio, без голоса) и конфетти. Звук выключается кнопкой в шапке.

let ctx = null;
let enabled = true;
export const setSound = (on) => { enabled = on; };

const tone = (freq, t0, dur, type = 'sine', gain = 0.06) => {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime + t0);
  g.gain.setValueAtTime(0, ctx.currentTime + t0);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + t0);
  o.stop(ctx.currentTime + t0 + dur + 0.02);
};

const SFX = {
  click: () => tone(660, 0, 0.08, 'triangle', 0.04),
  pick: () => { tone(523, 0, 0.09, 'triangle'); tone(784, 0.06, 0.12, 'triangle'); },
  unpick: () => tone(392, 0, 0.1, 'triangle', 0.04),
  error: () => { tone(220, 0, 0.14, 'square', 0.03); tone(180, 0.1, 0.18, 'square', 0.03); },
  step: () => tone(880, 0, 0.05, 'sine', 0.03),
  coin: () => { tone(988, 0, 0.07, 'square', 0.03); tone(1319, 0.06, 0.14, 'square', 0.03); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.05)),
};

export function sfx(name) {
  if (!enabled) return;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    (SFX[name] || SFX.click)();
  } catch (e) { /* звук не обязателен */ }
}

// Конфетти: кусочки в цветах урока разлетаются из точки (x, y — доли окна) и гаснут.
const COLORS = ['#FA4F28', '#FFB020', '#0FA38E', '#7C5CFA', '#0CD678', '#FF6B9A'];
export function confetti(x = 0.5, y = 0.6, n = 70) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'fx-confetti';
  document.body.appendChild(layer);
  for (let i = 0; i < n; i += 1) {
    const p = document.createElement('i');
    const a = (Math.random() * Math.PI) + Math.PI;           // вверх веером
    const v = 220 + Math.random() * 320;
    p.style.left = (x * 100) + 'vw';
    p.style.top = (y * 100) + 'vh';
    p.style.background = COLORS[i % COLORS.length];
    p.style.setProperty('--dx', Math.cos(a) * v + 'px');
    p.style.setProperty('--dy', Math.sin(a) * v + 'px');
    p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    p.style.animationDelay = (Math.random() * 0.08) + 's';
    layer.appendChild(p);
  }
  setTimeout(() => layer.remove(), 1600);
}
