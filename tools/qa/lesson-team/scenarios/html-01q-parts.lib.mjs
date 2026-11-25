// Общее для сценариев урока 1 HTML частями (01q1, 01q2; tools/redaktor28/build-qism.mjs, 25.11.2026): шаги и ветки
// целого урока (html-01-struktura-dokumenta.qa.mjs), разделённые по частям, с пересчётом номеров экранов.
import BASE from './html-01-struktura-dokumenta.qa.mjs';

// Экран целого урока (с нуля) → экран части. Часть 1: s1…s7 (0–6) как есть; часть 2: h2 + s9… (7–16 → 1–10).
export const toPart = (start) => (start <= 6 ? { k: 1, start } : { k: 2, start: start - 6 });
export const flowsOf = (k) => BASE.flows.filter((f) => toPart(f.start).k === k).map((f) => ({ ...f, start: toPart(f.start).start }));
export { BASE };
