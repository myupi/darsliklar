#!/usr/bin/env node
// Защита: ввод ученика не должен попадать в озвучку (заказчик, 26.11.2026: «впредь не хочу, чтобы такое было»).
//
// Причина. Озвучка идёт у платформы по тексту реплики. Реплика с вводом ученика («Siz «biged» deb yozdingiz…») —
// новая генерация голоса на КАЖДОГО ученика, это деньги. Правило курса (24.11.2026): слово ученика стоит в невидимых
// метках U+2063 … U+2064 — на экране видно, канон вырезает его перед озвучкой (sayHideCut, swapSayHide в
// tools/build-canon.mjs; в коде — sayHide(x)).
//
// Что проверяет скрипт. В исходниках уроков и практик курса HTML он находит все озвучиваемые строки (L3(uz, ru, en) и
// свойства uz:/ru:/en:), вырезает размеченные куски и смотрит на плейсхолдеры {имя}, которые остались без меток.
// Каждый такой плейсхолдер обязан быть записан в реестр безопасных — tools/say-hide-safe/*.json:
//   { "tools/amaliyot8/a8.src.jsx": { "want": "правильный ответ из задания", "tag": "ожидаемый тег из условия" } }
// Безопасно только то, что не набирает ученик: правильный ответ из задания, ожидаемое значение, выбор из фиксированного
// набора. Всё, что ученик может набрать сам (имя тега, адрес, слово, значение поля), в реестр не попадает и обязано
// стоять в метках — во всех трёх языках и во всех строках файла. Новый плейсхолдер без записи — ОШИБКА (код выхода 1).
//
//   node tools/say-hide-guard.mjs                 — все файлы курса HTML (по шаблонам ниже)
//   node tools/say-hide-guard.mjs <файл> [<файл>] — только указанные (ниже по шаблонам; прочие молча пропускаются)
//   import { checkSources } from './say-hide-guard.mjs' — для сборщика (.claude/skills/novyy-urok/scripts/sobrat.mjs)
//
// Сейчас под защитой курс HTML (шаблон SCOPE). Другие курсы подключаются добавлением шаблона и записей в реестр.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SAFE_DIR = join(ROOT, 'tools/say-hide-safe');
// Файлы, на которые распространяется защита: уроки, практики и общие наборы курса HTML.
const SCOPE = /^tools\/(amaliyot[1-9]|zagolovki2|royxat3|havola4|rasm5|forma6|forma7|sayt8|final9|redaktor28|bdizayn16|kollazh|l2-helpers|qism\/conf)\/[^/]+\.(jsx|mjs)$/;
const SKIP = /(^|\/)(build[^/]*\.mjs|nabor\.mjs)$/;

// ── Разбор строк исходника ──────────────────────────────────────────────────
function readStr(src, i) {
  const q = src[i];
  let j = i + 1;
  let out = '';
  while (j < src.length && src[j] !== q) {
    if (src[j] === '\\') {
      const c = src[j + 1];
      if (c === 'u' && /^[0-9a-fA-F]{4}$/.test(src.slice(j + 2, j + 6))) { out += String.fromCharCode(parseInt(src.slice(j + 2, j + 6), 16)); j += 6; continue; }
      out += { n: '\n', t: '\t', r: '\r' }[c] ?? c; j += 2; continue;
    }
    if (q === '`' && src[j] === '$' && src[j + 1] === '{') {
      let d = 1; j += 2;
      while (j < src.length && d) { if (src[j] === '{') d += 1; else if (src[j] === '}') d -= 1; j += 1; }
      out += '\u0000'; continue; // ${…} — не плейсхолдер языка
    }
    out += src[j]; j += 1;
  }
  return { text: out, end: j + 1 };
}
const isQuote = (c) => c === '"' || c === "'" || c === '`';
const skipWs = (s, i) => { while (i < s.length && /\s/.test(s[i])) i += 1; return i; };
// Строковый аргумент (с «+» между кусками); null — если аргумент не литерал.
function readArg(src, i) {
  i = skipWs(src, i);
  if (!isQuote(src[i])) return null;
  let text = '';
  for (;;) {
    const r = readStr(src, i);
    text += r.text; i = skipWs(src, r.end);
    if (src[i] === '+') { i = skipWs(src, i + 1); if (!isQuote(src[i])) return null; continue; }
    return { text, end: i };
  }
}
export function voiceStrings(src) {
  const res = [];
  const lineOf = (at) => src.slice(0, at).split('\n').length;
  const re = /\bL3\(|\b(?:uz|ru|en)\s*:\s*(?=['"`])/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[0] === 'L3(') {
      let i = m.index + 3;
      for (let k = 0; k < 3; k += 1) {
        const a = readArg(src, i);
        if (!a) break;
        res.push({ text: a.text, line: lineOf(m.index) });
        i = skipWs(src, a.end);
        if (src[i] !== ',') break;
        i += 1;
      }
    } else {
      const a = readArg(src, m.index + m[0].length);
      if (a) res.push({ text: a.text, line: lineOf(m.index) });
    }
  }
  return res;
}
// Размеченные куски вырезаем, остаются плейсхолдеры, которые голос произнесёт.
const cutMarked = (s) => s.replace(/\u2063[^\u2064]*\u2064/g, '');
export function loadSafe() {
  const safe = {};
  if (!existsSync(SAFE_DIR)) return safe;
  for (const f of readdirSync(SAFE_DIR).filter((n) => n.endsWith('.json'))) {
    const j = JSON.parse(readFileSync(join(SAFE_DIR, f), 'utf8'));
    for (const [file, ph] of Object.entries(j)) safe[file] = { ...(safe[file] || {}), ...ph };
  }
  return safe;
}
export const inScope = (rel) => SCOPE.test(rel) && !SKIP.test(rel);

// Проверка набора файлов. files — пути (абсолютные или от корня проекта); возвращает список нарушений.
export function checkSources(files, safe = loadSafe()) {
  const bad = [];
  for (const f of files) {
    const abs = resolve(ROOT, f);
    const rel = relative(ROOT, abs).split('\\').join('/');
    if (!inScope(rel) || !existsSync(abs)) continue;
    const ok = safe[rel] || {};
    const seen = new Map();
    let text = readFileSync(abs, 'utf8');
    if (rel === 'tools/l2-helpers/urok2-robofutbol.jsx') {
      // В уроки попадает только часть файла (sobrat.mjs: от «ТЕГИ ВСЛУХ» до «Артефакт урока для payload»).
      const a = text.indexOf('// ТЕГИ ВСЛУХ');
      const b = text.indexOf('// Артефакт урока для payload');
      if (a >= 0 && b > a) text = text.slice(a, b);
    }
    for (const s of voiceStrings(text)) {
      for (const m of cutMarked(s.text).matchAll(/\{(\w+)\}/g)) {
        if (Object.prototype.hasOwnProperty.call(ok, m[1])) continue;
        if (!seen.has(m[1])) seen.set(m[1], s.line);
      }
    }
    for (const [name, line] of seen) {
      bad.push(`${rel}:${line}: плейсхолдер {${name}} без меток и не записан в tools/say-hide-safe/*.json — `
        + 'если его набирает ученик, оберни в метки U+2063…U+2064 (sayHide) во всех трёх языках; если это правильный ответ или выбор из набора, впиши в реестр с причиной');
    }
  }
  return bad;
}

// CLI
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let files = args;
  if (!files.length) {
    files = [];
    const walk = (d) => {
      for (const e of readdirSync(join(ROOT, d), { withFileTypes: true })) {
        const rel = d + '/' + e.name;
        if (e.isDirectory()) { if (e.name !== 'gen' && e.name !== 'node_modules') walk(rel); }
        else if (inScope(rel)) files.push(rel);
      }
    };
    walk('tools');
  }
  const bad = checkSources(files);
  if (bad.length) { console.error(bad.join('\n') + `\n\nНарушений: ${bad.length}`); process.exit(1); }
  console.log(`say-hide-guard: ввод ученика в голос не попадает (${files.length} файлов проверено)`);
}
