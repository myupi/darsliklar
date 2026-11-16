import React, { useEffect, useRef } from 'react';
import Art from './Art.jsx';

// «Живость» урока (16.11.2026, заказчик: «сделай его более интересным… как у них»): плавающие значки по краям
// стола с параллаксом от мышки, полёт монеты в счётчик шапки и объём карточек под мышкой (.tilt).
// Робот-помощник в нижней панели был, убран по просьбе заказчика (16.11.2026).

// ── Плавающие значки по краям (только на широком экране — по бокам есть место) ──
const AMB = [
  ['app-roblox', 'l', 14, 74, 0.6, -8], ['app-football', 'l', 34, 60, 1.0, 6], ['maze-robot', 'l', 58, 80, 0.5, -4],
  ['app-youtube', 'l', 80, 62, 0.9, 10], ['app-minecraft', 'r', 12, 70, 0.8, 8], ['app-tiktok', 'r', 36, 60, 0.5, -6],
  ['app-instagram', 'r', 60, 66, 1.0, 5], ['maze-portal', 'r', 82, 58, 0.7, -10],
];
export function Ambient() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current; if (!el) return;
        el.style.setProperty('--mx', ((e.clientX / window.innerWidth) - 0.5).toFixed(3));
        el.style.setProperty('--my', ((e.clientY / window.innerHeight) - 0.5).toFixed(3));
      });
    };
    window.addEventListener('pointermove', move);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="amb" aria-hidden="true">
      {AMB.map(([id, side, top, size, depth, rot], i) => (
        <span key={id} className={'amb-i amb-' + side} style={{ top: top + '%', width: size, height: size, '--d': depth, '--r': rot + 'deg', animationDelay: (i * -1.3) + 's' }}>
          <Art id={id} fallback={null} />
        </span>
      ))}
    </div>
  );
}

// ── Монета летит от места действия в счётчик шапки ──
export function flyCoin(fromEl, n) {
  const to = document.querySelector('.hud-coins');
  if (!to) return;
  const a = fromEl && fromEl.getBoundingClientRect ? fromEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const b = to.getBoundingClientRect();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = Math.min(5, Math.max(1, Math.round(n / 2)));
  for (let i = 0; i < count; i += 1) {
    const c = document.createElement('span');
    c.className = 'coin fly-coin';
    document.body.appendChild(c);
    const x0 = a.left + a.width / 2 + (i - count / 2) * 10, y0 = a.top + a.height / 2;
    const x1 = b.left + 12, y1 = b.top + b.height / 2;
    if (reduce) { c.remove(); continue; }
    c.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(.6)`, opacity: 0 },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 80}px) scale(1.2)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${x1}px, ${y1}px) scale(.7)`, opacity: 1 },
    ], { duration: 750, delay: i * 70, easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'both' }).onfinish = () => c.remove();
  }
  setTimeout(() => {
    to.classList.remove('is-bump'); void to.offsetWidth; to.classList.add('is-bump');
    const plus = document.createElement('span');
    plus.className = 'coin-plus'; plus.textContent = '+' + n;
    plus.style.left = (b.left + b.width / 2) + 'px'; plus.style.top = (b.bottom + 4) + 'px';
    document.body.appendChild(plus);
    setTimeout(() => plus.remove(), 1300);
  }, 700);
}

// ── Объём карточек: .tilt наклоняется за мышкой ──
export function useTilt() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let cur = null;
    const reset = (el) => { if (el) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.classList.remove('is-tilt'); } };
    const move = (e) => {
      const el = e.target.closest && e.target.closest('.tilt');
      if (el !== cur) { reset(cur); cur = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('is-tilt');
      el.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
    };
    const leave = () => { reset(cur); cur = null; };
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);
}
