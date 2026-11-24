#!/usr/bin/env node
// Как прозвучит разбор ошибки без слова ученика (24.11.2026, заказчик: «Да, убери»).
// Слово ученика в шаблоне обёрнуто невидимыми метками ⁣ … ⁤ (или вставлено через sayHide(x)):
// на экране оно видно, а в озвучку не идёт — канон вырезает его (sayHideCut, swapSayHide в tools/build-canon.mjs).
// Скрипт находит в исходниках строки с метками и печатает: экран (подстановка — «X») и голос (то, что уйдёт в сервис).
// Читать голос глазами: на трёх языках должно выйти целое, грамотное предложение.
//
//   node tools/say-hide-check.mjs tools/cssp/cp-base.jsx [ещё файлы…]
import fs from 'fs';

const SAY_HIDE_RE = /[ \t]*[:—–]?[ \t]*[«"“]?⁣[^⁤]*⁤[»"”]?/g;
const cut = (s) => (s.indexOf('⁣') < 0 ? s : s.replace(SAY_HIDE_RE, '').replace(/[ \t]+([.,!?;:])/g, '$1').replace(/([.!?])[.,;:]+/g, '$1'));
const tts = (s) => cut(s).replace(/\*\*/g, '').replace(/[«»"“”]/g, '').replace(/\s*—\s*/g, ', ').replace(/\s+/g, ' ').trim();

let n = 0;
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const re = /(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g;
  let m;
  while ((m = re.exec(src))) {
    let raw = m[2];
    if (!/\\u2063|⁣/.test(raw)) continue;
    let s;
    try { s = JSON.parse('"' + raw.replace(/\\'/g, "'").replace(/\\`/g, '`').replace(/"/g, '\\"') + '"'); } catch (e) { s = raw.replace(/\\u2063/g, '⁣').replace(/\\u2064/g, '⁤'); }
    const line = src.slice(0, m.index).split('\n').length;
    const screen = s.replace(/⁣|⁤/g, '').replace(/\{(\w+)\}/g, (a, k) => 'X');
    const voice = tts(s.replace(/\{(\w+)\}/g, (a, k) => '{' + k + '}'));
    n += 1;
    console.log(`${file}:${line}\n  экран: ${screen}\n  голос: ${voice}${/^[,.;:]|^\s*$/.test(voice) || /\s[,.]/.test(voice) ? '   ← ПРОВЕРИТЬ' : ''}`);
  }
}
console.error(`строк с метками: ${n}`);
