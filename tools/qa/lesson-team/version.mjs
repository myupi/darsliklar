#!/usr/bin/env node
// Версия набора файлов для привязки отчётов команды уроков.
//
//   node tools/qa/lesson-team/version.mjs <файлы…>                       → JSON { version, files }
//   node tools/qa/lesson-team/version.mjs <файлы…> --save <путь.json>     → то же и запись в файл
//   node tools/qa/lesson-team/version.mjs --check <путь.json> [<файлы…>]  → сверка: 0 — без изменений, 1 — изменились
//
// Версия — «v-» и 12 знаков sha256 от путей и содержимого файлов.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ROOT, versionOf } from './lib/files.mjs';

const args = process.argv.slice(2);
let save = null, against = null;
const files = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--save') save = args[++i];
  else if (args[i] === '--check') against = args[++i];
  else files.push(args[i]);
}

if (against) {
  const path = resolve(process.cwd(), against);
  if (!existsSync(path)) { console.error('Нет файла версии: ' + against); process.exit(2); }
  const old = JSON.parse(readFileSync(path, 'utf8'));
  const now = versionOf(files.length ? files : old.files.map((f) => f.path));
  const changed = now.files.filter((f) => {
    const was = old.files.find((x) => x.path === f.path);
    return !was || was.sha256 !== f.sha256 || !!was.missing !== !!f.missing;
  });
  if (!changed.length && now.version === old.version) {
    console.log(`без изменений: ${now.version}`);
    process.exit(0);
  }
  console.log(`изменились (${old.version} → ${now.version}):`);
  changed.forEach((f) => console.log('  ' + f.path + (f.missing ? ' (нет файла)' : '')));
  process.exit(1);
}

if (!files.length) {
  console.error('Укажи файлы: node tools/qa/lesson-team/version.mjs <файлы…> [--save путь.json]');
  process.exit(2);
}
const v = versionOf(files);
const out = JSON.stringify(Object.assign({ createdAt: new Date().toISOString(), root: ROOT }, v), null, 2);
if (save) {
  const path = resolve(process.cwd(), save);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, out + '\n');
}
console.log(out);
