import React, { useLayoutEffect, useRef, useState } from 'react';

// Размеры экранов в CSS-пикселях. Урок внутри iframe видит ровно этот вьюпорт,
// поэтому его 100dvh, медиазапросы и «телефон лёжа» срабатывают как на устройстве.
export const DEVICE_SIZES = {
  phone: { w: 390, h: 844, label: 'Телефон' },
  tablet: { w: 820, h: 1180, label: 'Планшет' },
  laptop: { w: 1366, h: 800, label: 'Ноутбук' },
};

export default function DeviceStage({ src, device, rotated, title, frameRef }) {
  const wrapRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

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

  return (
    <div className={'stage' + (fill ? ' is-fill' : '')} ref={wrapRef}>
      {fill ? (
        <iframe ref={frameRef} key={src} className="frame-fill" src={src} title={title} allow="autoplay; clipboard-write" />
      ) : (
        <>
          <div className="device" style={{ width: w * scale, height: h * scale }}>
            <iframe
              ref={frameRef}
              key={src}
              src={src}
              title={title}
              allow="autoplay; clipboard-write"
              style={{ width: w, height: h, transform: `scale(${scale})` }}
            />
          </div>
          <div className="device-meta">
            {d.label}{rotated ? ' · лёжа' : ''} · {w}×{h} · {Math.round(scale * 100)}%
          </div>
        </>
      )}
    </div>
  );
}
