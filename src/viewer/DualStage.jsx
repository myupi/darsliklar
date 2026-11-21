import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Два окна сразу (заказчик, 21.11.2026: «когда все сайдбары закрыты — и мобильная, и десктопная версия, слева мобильная,
// справа десктопная, как можно больше места; действие в мобилке — и в десктопе, и наоборот»).
// Масштаб всегда 100% (заказчик, 21.11.2026): один пиксель урока — один пиксель экрана. Телефон — ширина 390 px, высота —
// во всё место; ноутбук — всё остальное место. У ноутбука свой масштаб, как Ctrl + / − в браузере (zoom): вьюпорт = место / масштаб.
// Синхронно: настоящие (isTrusted) нажатия, ввод и клавиши в одном окне повторяются в другом на той же вещи —
// по пути в дереве DOM, а если раскладка другая — по тегу, классу и тексту. Перетаскивание (pointermove) не повторяется.
const PHONE = { w: 390, h: 844 };
const GAP = 12;
const PAD = 0;   // поля даёт .stage.dual
const hasClicked = () => typeof navigator === 'undefined' || !navigator.userActivation || navigator.userActivation.hasBeenActive;

export const ZOOMS = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];
function layout(W, H, zoom) {
  const h = Math.max(100, Math.floor(H - PAD * 2));
  const pw = PHONE.w;
  const aw = Math.max(100, Math.floor(W - PAD * 2 - GAP - pw));
  const s = (zoom || 100) / 100;
  return { ps: 1, pw, ph: h, pvh: h, s, vw: Math.round(aw / s), vh: Math.round(h / s), lw: aw, lh: h };
}

// ── Путь к вещи и поиск её в другом окне ──
const sig = (el) => el.tagName + '|' + (typeof el.className === 'string' ? el.className : '') + '|' + (el.textContent || '').trim().slice(0, 60);
function pathOf(el) {
  const out = [];
  let x = el;
  while (x && x.parentElement && x.tagName !== 'BODY') {
    out.unshift(Array.prototype.indexOf.call(x.parentElement.children, x));
    x = x.parentElement;
  }
  return out;
}
function resolve(doc, rec) {
  let x = doc.body;
  for (const i of rec.path) { x = x && x.children[i]; if (!x) break; }
  if (x && x.tagName === rec.tag && sig(x) === rec.sig) return x;
  // другая раскладка: тот же тег, класс и текст — по номеру среди таких же
  const same = Array.prototype.filter.call(doc.body.getElementsByTagName(rec.tag), (e) => sig(e) === rec.sig);
  if (same.length) return same[Math.min(rec.nth, same.length - 1)];
  return x && x.tagName === rec.tag ? x : null;
}
const recOf = (doc, el) => {
  const s = sig(el);
  const same = Array.prototype.filter.call(doc.body.getElementsByTagName(el.tagName), (e) => sig(e) === s);
  return { path: pathOf(el), tag: el.tagName, sig: s, nth: Math.max(0, same.indexOf(el)) };
};

const PTR = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click'];
function replay(doc, rec, e) {
  const el = resolve(doc, rec);
  if (!el) return;
  const win = doc.defaultView;
  const r = el.getBoundingClientRect();
  const xy = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
  if (PTR.indexOf(e.type) >= 0) {
    const init = Object.assign({ bubbles: true, cancelable: true, composed: true, view: win, button: e.button || 0, buttons: e.type.endsWith('down') ? 1 : 0, detail: e.detail || 1 }, xy);
    const ev = e.type.startsWith('pointer') ? new win.PointerEvent(e.type, Object.assign({ pointerId: 1, pointerType: 'mouse', isPrimary: true }, init)) : new win.MouseEvent(e.type, init);
    el.dispatchEvent(ev);
    return;
  }
  if (e.type === 'input' || e.type === 'change') {
    if ('value' in el && e.target && 'value' in e.target && el.type !== 'checkbox' && el.type !== 'radio') {
      const proto = Object.getPrototypeOf(el);
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (el.value !== e.target.value) { if (desc && desc.set) desc.set.call(el, e.target.value); else el.value = e.target.value; }
      try { if (typeof e.target.selectionStart === 'number' && el.setSelectionRange) el.setSelectionRange(e.target.selectionStart, e.target.selectionEnd); } catch (er) { /* поле без выделения */ }
    }
    el.dispatchEvent(new win.Event(e.type, { bubbles: true }));
    return;
  }
  if (e.type === 'keydown' || e.type === 'keyup') {
    el.dispatchEvent(new win.KeyboardEvent(e.type, { bubbles: true, cancelable: true, key: e.key, code: e.code, keyCode: e.keyCode, which: e.which, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey }));
  }
}
const TYPES = PTR.concat(['input', 'change', 'keydown', 'keyup']);

function useMirror(aRef, bRef) {
  const docs = useRef([null, null]);
  return useCallback((k) => (ev) => {
    const frame = ev.currentTarget;
    let doc = null;
    try { doc = frame.contentDocument; } catch (er) { doc = null; }
    if (!doc) return;
    docs.current[k] = doc;
    const other = () => { const o = (k ? aRef : bRef).current; try { return o && o.contentDocument; } catch (er) { return null; } };
    TYPES.forEach((t) => doc.addEventListener(t, (e) => {
      if (!e.isTrusted || !e.target || e.target.nodeType !== 1 || !doc.body || !doc.body.contains(e.target)) return;
      // клавиши — только из полей; ввод в поле повторяется событием input
      if ((t === 'keydown' || t === 'keyup') && !/^(Enter|Escape|Tab|Backspace|Delete|Arrow\w+)$/.test(e.key)) return;
      const od = other();
      if (!od || !od.body) return;
      const rec = recOf(doc, e.target);
      try { replay(od, rec, e); } catch (er) { /* вещи нет в другом окне — пропускаем */ }
    }, true));
  }, [aRef, bRef]);
}

export default function DualStage({ src, srcB, title, frameRef, zoom = 100, onZoom }) {
  const wrapRef = useRef(null);
  const bRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [armed, setArmed] = useState(hasClicked);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const onLoad = useMirror(frameRef, bRef);
  const L = box.w ? layout(box.w, box.h, zoom) : null;
  const zi = ZOOMS.indexOf(zoom) >= 0 ? ZOOMS.indexOf(zoom) : ZOOMS.indexOf(100);

  return (
    <div className="stage dual" ref={wrapRef}>
      {L ? (
        <div className="dual-row" style={{ gap: GAP }}>
          <div className="device" style={{ width: L.pw, height: L.ph }}>
            {armed ? <iframe ref={frameRef} key={'a' + src} src={src} title={title} allow="autoplay; clipboard-write" onLoad={onLoad(0)}
              style={{ width: PHONE.w, height: L.pvh }} /> : null}
            <span className="dual-meta">Телефон · {PHONE.w}×{L.pvh} · 100%</span>
          </div>
          <div className="device" style={{ width: L.lw, height: L.lh }}>
            {armed ? <iframe ref={bRef} key={'b' + srcB} src={srcB} title={title + ' (ноутбук)'} allow="autoplay; clipboard-write" onLoad={onLoad(1)}
              style={{ width: L.vw, height: L.vh, transform: `scale(${L.s})` }} /> : null}
            <span className="dual-meta">Ноутбук · {L.vw}×{L.vh} · {Math.round(L.s * 100)}%</span>
          </div>
        </div>
      ) : null}
      {onZoom ? (
        <div className="dual-zoom" role="group" aria-label="Масштаб ноутбука">
          <span className="dual-zoom-l">Ноутбук</span>
          <button type="button" className="icon-btn" disabled={zi <= 0} onClick={() => onZoom(ZOOMS[zi - 1])} title="Мельче" aria-label="Мельче">−</button>
          <button type="button" className="dual-zoom-v" onClick={() => onZoom(100)} title="Сбросить на 100%">{zoom}%</button>
          <button type="button" className="icon-btn" disabled={zi >= ZOOMS.length - 1} onClick={() => onZoom(ZOOMS[zi + 1])} title="Крупнее" aria-label="Крупнее">+</button>
        </div>
      ) : null}
      {armed ? null : (
        <button type="button" className="start-lesson" onClick={() => setArmed(true)}>
          <span className="start-lesson-ic" aria-hidden="true">▶</span>Начать урок
        </button>
      )}
    </div>
  );
}

// Переключатель слайдов над двумя окнами (заказчик, 21.11.2026): текущий слайд — из счётчика урока «2/7» в шапке
// (.b-count / .counter), переход — оба окна заново открываются на этом слайде (start, с нуля).
function readCounter(frame) {
  try {
    const doc = frame && frame.contentDocument;
    const el = doc && doc.querySelector('.b-count, .counter');
    const m = el && /(\d+)\s*\/\s*(\d+)/.exec(el.textContent || '');
    return m ? { cur: +m[1], total: +m[2] } : null;
  } catch (e) { return null; }
}
export function SlideNav({ frameRef, onGo }) {
  const [c, setC] = useState(null);
  const [v, setV] = useState('');
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      const x = readCounter(frameRef.current);
      setC((p) => (p && x && p.cur === x.cur && p.total === x.total) || (!p && !x) ? p : x);
    }, 400);
    return () => clearInterval(t);
  }, [frameRef]);
  useEffect(() => { if (!edit) setV(c ? String(c.cur) : ''); }, [c, edit]);
  const total = c ? c.total : null;
  const go = (n) => {
    const k = Math.round(Number(n));
    if (!Number.isFinite(k)) return;
    const t = total ? Math.min(total, Math.max(1, k)) : Math.max(1, k);
    onGo(t - 1);
  };
  return (
    <div className="dual-nav" role="toolbar" aria-label="Слайды">
      <button type="button" className="icon-btn" disabled={!c || c.cur <= 1} onClick={() => go(c.cur - 1)} title="Предыдущий слайд" aria-label="Предыдущий слайд"><ChevronLeft size={17} /></button>
      <input className="dual-nav-in" inputMode="numeric" value={v} aria-label="Номер слайда" title="Номер слайда — Enter"
        onFocus={(e) => { setEdit(true); e.target.select(); }} onBlur={() => setEdit(false)}
        onChange={(e) => setV(e.target.value.replace(/[^0-9]/g, ''))}
        onKeyDown={(e) => { if (e.key === 'Enter') { go(v); e.currentTarget.blur(); } if (e.key === 'Escape') e.currentTarget.blur(); }} />
      <span className="dual-nav-t">/ {total || '–'}</span>
      <button type="button" className="icon-btn" disabled={!c || c.cur >= c.total} onClick={() => go(c.cur + 1)} title="Следующий слайд" aria-label="Следующий слайд"><ChevronRight size={17} /></button>
    </div>
  );
}
