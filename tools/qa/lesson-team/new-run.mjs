#!/usr/bin/env node
// Каталог запуска команды уроков: work/lesson-team/<run-id>/ с постановкой по шаблону.
//
//   node tools/qa/lesson-team/new-run.mjs --slug <кратко-латиницей> [--files a.jsx,b.mjs]
//
// Печатает путь каталога. С --files сразу фиксирует версию в versions/start.json.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT, ensureWork, rel, stamp, versionOf } from './lib/files.mjs';

const args = process.argv.slice(2);
let slug = 'run', files = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--slug') slug = String(args[++i] || 'run');
  else if (args[i] === '--files') files = String(args[++i] || '').split(',').filter(Boolean);
}
slug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'run';

// Отчёты запусков не попадают в git: у каталога свой .gitignore (lib/files.mjs → ensureWork).
const base = ensureWork();

let runId = `${stamp()}-${slug}`;
let n = 2;
while (existsSync(join(base, runId))) runId = `${stamp()}-${slug}-${n++}`;
const dir = join(base, runId);
mkdirSync(join(dir, 'versions'), { recursive: true });
const tpl = readFileSync(resolve(ROOT, 'docs/lesson-team/shablon-postanovki.md'), 'utf8').replace('<run-id>', runId);
writeFileSync(join(dir, 'brief.md'), tpl);
if (files.length) writeFileSync(join(dir, 'versions', 'start.json'), JSON.stringify(versionOf(files), null, 2) + '\n');
console.log(JSON.stringify({ runId, dir: rel(dir), brief: rel(join(dir, 'brief.md')) }, null, 2));
