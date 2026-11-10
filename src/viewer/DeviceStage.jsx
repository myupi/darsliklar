import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

// Размеры экранов в CSS-пикселях. Урок внутри iframe видит ровно этот вьюпорт,
// поэтому его 100dvh, медиазапросы и «телефон лёжа» срабатывают как на устройстве.
export const DEVICE_SIZES = {
  phone: { w: 390, h: 844, label: 'Телефон' },
  // Телефон с открытой клавиатурой (заказчик, 10.11.2026): видно только то, что над клавиатурой. Урок узнаёт
  // об этом, как на настоящем телефоне: класс is-kbd и --vvh (видимая высота) на <html> — так их ставит канон
  // по visualViewport. Клавиатура: стоя — полоса «Готово» 44 px и клавиши 340 px, лёжа — 200 px.
  phoneKbd: { w: 390, h: 844, label: 'Телефон с клавиатурой', kbd: 384, kbdLand: 200 },
  tablet: { w: 820, h: 1180, label: 'Планшет' },
  laptop: { w: 1366, h: 800, label: 'Ноутбук' },
};

// Браузер даёт окну урока звук только после нажатия на странице (заказчик, 28.10.2026:
// «Коди должен говорить сразу, без нажатий»). Урок, открытый кликом по списку, уже
// говорит сам. После обновления страницы или открытия по ссылке нажатия ещё не было —
// тогда вместо урока кнопка «Начать урок», как на платформе: нажал — урок открылся
// и Коди заговорил.
const hasClicked = () => typeof navigator === 'undefined' || !navigator.userActivation || navigator.userActivation.hasBeenActive;

// Открытая клавиатура в окне урока: класс и видимая высота держатся наблюдателем — канон снимает их при
// событиях visualViewport (в окне просмотрщика клавиатуры нет, и он считает, что её нет).
function holdKbd(frame, vvh) {
  try {
    const doc = frame && frame.contentDocument;
    const r = doc && doc.documentElement;
    if (!r) return;
    const fix = () => {
      if (!r.classList.contains('is-kbd')) r.classList.add('is-kbd');
      if (r.style.getPropertyValue('--vvh') !== vvh + 'px') r.style.setProperty('--vvh', vvh + 'px');
    };
    fix();
    new doc.defaultView.MutationObserver(fix).observe(r, { attributes: true, attributeFilter: ['class', 'style'] });
  } catch (e) { /* окно с другого адреса — без эмуляции */ }
}

// Рисунок клавиатуры (как в телефоне): полоса «Готово» и четыре ряда клавиш.
const KB_ROWS = ['qwertyuiop', 'asdfghjkl', '⇧zxcvbnm⌫', ['123', '🌐', 'пробел', '↵']];
function FakeKeyboard({ height, scale }) {
  return (
    <div className="fake-kbd" style={{ height: height * scale }} aria-hidden="true">
      <div className="fake-kbd-bar"><span>⌃ ⌄</span><b>Готово</b></div>
      <div className="fake-kbd-keys">
        {KB_ROWS.map((row, i) => (
          <div key={i} className="fake-kbd-row">
            {(Array.isArray(row) ? row : row.split('')).map((k, j) => (
              <span key={j} className={'fake-kbd-k' + (k.length > 1 || /[⇧⌫↵🌐]/u.test(k) ? ' is-fn' : '') + (k === 'пробел' ? ' is-space' : '')}>{k}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeviceStage({ src, device, rotated, title, frameRef }) {
  const wrapRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [armed, setArmed] = useState(hasClicked);
  const startBtn = (
    <button type="button" className="start-lesson" onClick={() => setArmed(true)}>
      <span className="start-lesson-ic" aria-hidden="true">▶</span>Начать урок
    </button>
  );

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = DEVICE_SIZES[device];
  const fill = !d;
  const w = d ? (rotated ? d.h : d.w) : 0;
  const h = d ? (rotated ? d.w : d.h) : 0;
  const scale = d && box.w ? Math.min(1, (box.w - 40) / w, (box.h - 56) / h) : 1;
  const kbd = d && d.kbd ? (rotated ? d.kbdLand : d.kbd) : 0;
  const onLoad = useCallback((e) => { if (kbd) holdKbd(e.currentTarget, h - kbd); }, [kbd, h]);

  return (
    <div className={'stage' + (fill ? ' is-fill' : '')} ref={wrapRef}>
      {fill ? (
        armed ? <iframe ref={frameRef} key={src} className="frame-fill" src={src} title={title} allow="autoplay; clipboard-write" /> : startBtn
      ) : (
        <>
          <div className="device" style={{ width: w * scale, height: h * scale }}>
            {armed ? (
              <iframe
                ref={frameRef}
                key={src + ':' + kbd}
                src={src}
                title={title}
                allow="autoplay; clipboard-write"
                onLoad={onLoad}
                style={{ width: w, height: h, transform: `scale(${scale})` }}
              />
            ) : null}
            {kbd ? <FakeKeyboard height={kbd} scale={scale} /> : null}
          </div>
          {/* Кнопка — поверх сцены, а не внутри уменьшенного телефона: там её обрезал край. */}
          {armed ? null : startBtn}
          <div className="device-meta">
            {d.label}{rotated ? ' · лёжа' : ''} · {w}×{h}{kbd ? ' · видно ' + w + '×' + (h - kbd) : ''} · {Math.round(scale * 100)}%
          </div>
        </>
      )}
    </div>
  );
}
