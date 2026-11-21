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
// Размеры окон на выбор (заказчик, 21.11.2026: «ноутбук 1366×800 и телефон 390×844… можем как-то оба настроить?»).
// «По месту» — окно во всё свободное место в масштабе 100% (у ноутбука — свой масштаб − / +).
export const PHONE_SIZES = ['390x844', '375x667', '360x640', '414x896', 'fit'];
export const LAPTOP_SIZES = ['1366x800', '1280x720', '1440x900', '1536x864', '1920x1080', 'fit'];
const sizeOf = (v) => { const m = /^(\d+)x(\d+)$/.exec(v || ''); return m ? { w: +m[1], h: +m[2] } : null; };
function layout(W, H, zoom, phone, laptop) {
  const h = Math.max(100, Math.floor(H - PAD * 2));
  const w = Math.max(200, Math.floor(W - PAD * 2));
  const P = sizeOf(phone), Lp = sizeOf(laptop);
  if (Lp) {
    // окна на экране всегда 100% своих размеров (390×844, 1366×800 — «в 100% это норма»); не влезают — сцена листается.
    // Масштаб − / + — зум браузера внутри ноутбука, как Ctrl + / − (заказчик, 21.11.2026: «масштаб ноутбука нам нужен, зачем
    // окна больше-меньше делаешь»): окно 1366×800 то же, вьюпорт урока = 1366 / масштаб × 800 / масштаб.
    const pw0 = P ? P.w : PHONE.w;
    const pvh = P ? P.h : h;
    const s = (zoom || 100) / 100;
    return { ps: 1, pw: pw0, ph: pvh, pvw: pw0, pvh, s, vw: Math.round(Lp.w / s), vh: Math.round(Lp.h / s), lw: Lp.w, lh: Lp.h, fit: false };
  }
  const ps = 1;
  const pvw = P ? P.w : PHONE.w, pvh = P ? P.h : h;
  const pw = pvw * ps;
  const aw = Math.max(100, Math.floor(w - GAP - pw));
  const s = (zoom || 100) / 100;
  return { ps, pw, ph: pvh * ps, pvw, pvh, s, vw: Math.round(aw / s), vh: Math.round(h / s), lw: aw, lh: h, fit: true };
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

export default function DualStage({ src, srcB, title, frameRef, zoom = 100, onZoom, phone = '390x844', laptop = '1366x800', onSize }) {
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
  const onLoadM = useMirror(frameRef, bRef);
  // Ctrl / Cmd + «+», «−», «0» — масштаб ноутбука в просмотрщике, а не зум всей страницы браузера (заказчик, 21.11.2026).
  // Слушаем и саму страницу, и оба окна урока: фокус бывает внутри них.
  const zoomRef = useRef({ zoom, onZoom });
  zoomRef.current = { zoom, onZoom };
  const onKey = useCallback((e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const k = e.key, c = e.code;
    const dir = k === '+' || k === '=' || c === 'Equal' || c === 'NumpadAdd' ? 1 : k === '-' || k === '_' || c === 'Minus' || c === 'NumpadSubtract' ? -1 : k === '0' || c === 'Digit0' || c === 'Numpad0' ? 0 : null;
    if (dir === null) return;
    const { zoom: z, onZoom: set } = zoomRef.current;
    if (!set) return;
    e.preventDefault();
    if (dir === 0) { set(100); return; }
    const to = dir > 0 ? ZOOMS.find((x) => x > z) : ZOOMS.filter((x) => x < z).pop();
    if (to) set(to);
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onKey]);
  const onLoad = (k) => (ev) => {
    onLoadM(k)(ev);
    try { ev.currentTarget.contentWindow.addEventListener('keydown', onKey, true); } catch (er) { /* окно с другого адреса */ }
  };
  const L = box.w ? layout(box.w, box.h, zoom, phone, laptop) : null;
  const zPrev = ZOOMS.filter((z) => z < zoom).pop(), zNext = ZOOMS.find((z) => z > zoom);   // «вписать» даёт своё число — шаги идут от него

  return (
    <div className="stage dual" ref={wrapRef}>
      {L ? (
        <div className="dual-row" style={{ gap: GAP }}>
          <div className="device" style={{ width: L.pw, height: L.ph }}>
            {armed ? <iframe ref={frameRef} key={'a' + src} src={src} title={title} allow="autoplay; clipboard-write" onLoad={onLoad(0)}
              style={{ width: L.pvw, height: L.pvh, transform: `scale(${L.ps})` }} /> : null}
            <span className="dual-meta">Телефон · {L.pvw}×{L.pvh} · {Math.round(L.ps * 100)}%</span>
          </div>
          <div className="device" style={{ width: L.lw, height: L.lh }}>
            {armed ? <iframe ref={bRef} key={'b' + srcB} src={srcB} title={title + ' (ноутбук)'} allow="autoplay; clipboard-write" onLoad={onLoad(1)}
              style={{ width: L.vw, height: L.vh, transform: `scale(${L.s})` }} /> : null}
            <span className="dual-meta">Ноутбук · {Math.round(L.lw)}×{Math.round(L.lh)} · масштаб {Math.round(L.s * 100)}%</span>
          </div>
        </div>
      ) : null}
      {onSize ? (
        <div className="dual-zoom" role="group" aria-label="Размеры окон">
          <span className="dual-zoom-l">Телефон</span>
          <select className="dual-size" value={phone} onChange={(e) => onSize({ dualPhone: e.target.value })} aria-label="Размер телефона">
            {PHONE_SIZES.map((v) => <option key={v} value={v}>{v === 'fit' ? 'по месту' : v.replace('x', '×')}</option>)}
          </select>
          <span className="dual-zoom-l">Ноутбук</span>
          <select className="dual-size" value={laptop} onChange={(e) => onSize({ dualLaptop: e.target.value })} aria-label="Размер ноутбука">
            {LAPTOP_SIZES.map((v) => <option key={v} value={v}>{v === 'fit' ? 'по месту' : v.replace('x', '×')}</option>)}
          </select>
          {onZoom && L ? (
            <>
              <span className="dual-zoom-l">Масштаб</span>
          <button type="button" className="icon-btn" disabled={!zPrev} onClick={() => onZoom(zPrev)} title="Мельче (Ctrl или Cmd и −)" aria-label="Мельче">−</button>
          <button type="button" className="dual-zoom-v" onClick={() => onZoom(100)} title="Сбросить на 100% (Ctrl или Cmd и 0)">{zoom}%</button>
          <button type="button" className="icon-btn" disabled={!zNext} onClick={() => onZoom(zNext)} title="Крупнее (Ctrl или Cmd и +)" aria-label="Крупнее">+</button>
            </>
          ) : null}
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
