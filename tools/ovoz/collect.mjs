// Сбор реплик урока для «Подготовленной озвучки» (LESSON_AUDIO), 13.11.2026.
// Урок собирается esbuild-ом в модуль для node и опрашивается: всё, что герой произносит по данным экранов
// (heroLines по C), похвала и подбадривание канона, разборы (FB, WRAP_MSGS), а также каждый L3(…) и каждая
// тройка { uz, ru, en } из констант уровня модуля, если её текст похож на речь (законченное предложение).
// Текст реплики — ровно тот, что ушёл бы в сервис: markLang(sanitizeForTts(spokenHtml(s, L), L), L).
//   collectLesson(src) → { uz: [{ clean, text }], ru: [...], en: [...] }
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
export const LANGS = ['uz', 'ru', 'en'];

// Перехват L3 до объявления урока: каждый вызов на уровне модуля попадает в общий список.
const PRELUDE = `globalThis.__L3_ALL = [];\n`;
const PROBE = `
export const __collect = (L) => {
  const out = new Set();
  const add = (s) => { if (typeof s === 'string' && s.trim() && s.indexOf('{') < 0) out.add(s); };
  const all = (node, depth) => {
    if (!node || typeof node !== 'object' || depth > 6) return;
    if (typeof node[L] === 'string') { add(node[L]); return; }
    Object.values(node).forEach((x) => all(x, (depth || 0) + 1));
  };
  if (typeof C !== 'undefined') Object.keys(C).forEach((k) => heroLines(C[k], L).forEach(add));
  if (typeof WRAP_MSGS !== 'undefined') all(WRAP_MSGS);
  if (typeof FB !== 'undefined') all(FB);
  if (typeof PRAISE !== 'undefined') PRAISE[L].forEach(add);
  if (typeof ENCOURAGE !== 'undefined') ENCOURAGE[L].forEach(add);
  // Куски склеек (похвала + разбор раунда + итог): предложения из любых троек данных экранов и из L3 уровня модуля.
  // Подписи кнопок и код без знака конца предложения сюда не попадают.
  const sentence = (t) => typeof t === 'string' && /[.!?…]["»”)]*\s*$/.test(t.trim()) && /[A-Za-zА-Яа-яЁё]{2,}/.test(t) && t.trim().length >= 6;
  const any = (node, depth) => {
    if (!node || typeof node !== 'object' || depth > 8) return;
    if (typeof node[L] === 'string' && (node.uz !== undefined || node.ru !== undefined)) { if (sentence(node[L])) add(node[L]); return; }
    Object.values(node).forEach((x) => any(x, depth + 1));
  };
  if (typeof C !== 'undefined') any(C, 0);
  (globalThis.__L3_ALL || []).forEach((x) => { if (x && sentence(x[L])) add(x[L]); });
  return [...out];
};
export const __clean = (s, L) => sanitizeForTts(spokenHtml(s, L), L);
export const __mark = (clean, L) => markLang(clean, L);
export const __C = typeof C !== 'undefined' ? C : null;
export const __fillL = typeof fillL !== 'undefined' ? fillL : null;
`;

export async function collectLesson(src, tag) {
  // Каждый L3(…) урока записывается (константы уровня модуля — при загрузке).
  src = src.replace('const L3 = (uz, ru, en) => ({ uz: uz, ru: ru, en: en });',
    'const L3 = (uz, ru, en) => { const o = { uz: uz, ru: ru, en: en }; globalThis.__L3_ALL.push(o); return o; };');
  const tmp = join(here, '.tmp-' + (tag || 'x') + '-' + process.pid);
  mkdirSync(tmp, { recursive: true });
  const file = join(tmp, 'probe.jsx');
  writeFileSync(file, PRELUDE + src + PROBE);
  const outFile = join(tmp, 'probe.mjs');
  buildSync({
    entryPoints: [file], bundle: true, format: 'esm', platform: 'node', outfile: outFile, jsx: 'transform',
    external: ['react', 'react-dom'], alias: { '@lesson/runtime': join(root, 'src/runtime/index.js') }, logLevel: 'error',
    nodePaths: [join(root, 'node_modules')]
  });
  globalThis.window = undefined;
  const mod = await import(pathToFileURL(outFile).href + '?t=' + Date.now());
  // Постоянные тексты внутри функций (разборы ошибок, подсказки): L3('…', '…', '…') из одних строк, без «{…}».
  const lits = [];
  const STR = String.raw`('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")`;
  const re = new RegExp('\\bL3\\(\\s*' + STR + '\\s*,\\s*' + STR + '\\s*,\\s*' + STR + '\\s*\\)', 'g');
  for (const m of src.matchAll(re)) {
    try { const v = [m[1], m[2], m[3]].map((x) => new Function('return ' + x)()); lits.push({ uz: v[0], ru: v[1], en: v[2] }); } catch (e) { /* не литерал */ }
  }
  const sentence = (t) => typeof t === 'string' && t.indexOf('{') < 0 && /[.!?…]["»”)]*\s*$/.test(t.trim()) && /[A-Za-zА-Яа-яЁё]{2,}/.test(t) && t.trim().length >= 6;
  const res = {};
  for (const L of LANGS) {
    const seen = new Set();
    res[L] = [];
    for (const s of mod.__collect(L).concat(lits.map((x) => x[L]).filter(sentence))) {
      const clean = mod.__clean(s, L);
      if (!clean || seen.has(clean)) continue;
      seen.add(clean);
      res[L].push({ clean, text: mod.__mark(clean, L) });
    }
  }
  res.clean = (s, L) => mod.__clean(s, L);
  res.mark = (c, L) => mod.__mark(c, L);
  res.mod = mod;
  rmSync(tmp, { recursive: true, force: true });
  return res;
}

if (process.argv[1] && process.argv[1].endsWith('collect.mjs') && process.argv[2]) {
  const { readFileSync } = await import('node:fs');
  const r = await collectLesson(readFileSync(resolve(process.argv[2]), 'utf8'), 'cli');
  for (const L of LANGS) console.log(L, r[L].length);
  if (process.argv[3]) for (const x of r[process.argv[3]]) console.log('  ' + x.clean);
}
