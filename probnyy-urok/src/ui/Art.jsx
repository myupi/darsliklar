import React from 'react';
import { ART } from '../art.js';

// Слот иллюстрации. Картинка — файл src/img/<id>.webp (или .png / .jpg / .svg); сборка знает, какие файлы есть
// (import.meta.glob), поэтому лишних запросов нет. Нет файла — показывается fallback (прежний значок или ничего).
// Новый файл в src/img/ подхватывается сразу (в dev — без перезапуска).
// Список всех слотов, размеры и промпты — src/art.js; инструкция для агента — AGENTS.md.
const FILES = import.meta.glob('../img/*.{webp,png,jpg,jpeg,svg}', { eager: true, import: 'default' });
// Если у слота несколько файлов — берётся webp, потом png, jpg и последним svg (рисунок от руки).
const RANK = { webp: 0, png: 1, jpg: 2, jpeg: 2, svg: 3 };
const URL_OF = {}, RANK_OF = {};
Object.entries(FILES).forEach(([path, url]) => {
  const m = /\/([^/]+)\.(webp|png|jpe?g|svg)$/i.exec(path);
  if (!m) return;
  const r = RANK[m[2].toLowerCase()];
  if (!(m[1] in RANK_OF) || r < RANK_OF[m[1]]) { URL_OF[m[1]] = url; RANK_OF[m[1]] = r; }
});

export const hasArt = (id) => !!URL_OF[id];

export default function Art({ id, fallback = null, className = '', alt = '' }) {
  const meta = ART[id];
  if (!meta) { console.warn('[art] нет слота в src/art.js:', id); return fallback; }
  const url = URL_OF[id];
  if (!url) return fallback;
  return <img className={'art art-' + meta.kind + (className ? ' ' + className : '')} src={url} alt={alt} draggable={false} decoding="async" />;
}
