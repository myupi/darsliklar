#!/usr/bin/env node
// Отдельная рабочая копия (git worktree) для урока — команда уроков (/lesson-team).
// Один исполнитель на урок, у каждого урока своя копия и свой dev-сервер (run.mjs --serve),
// поэтому сборка одного урока не мешает ни исполнителю, ни QA другого.
//
//   node tools/qa/lesson-team/wt.mjs create --run <run-id>
//       .claude/worktrees/lt-<run-id>/ от HEAD + все незакоммиченные и новые файлы основной копии
//       (кроме игнорируемых), node_modules — ссылкой. Снимок хешей — work/lesson-team/<run-id>/worktree.json.
//   node tools/qa/lesson-team/wt.mjs status --run <run-id>
//       какие файлы в копии изменены или созданы после create.
//   node tools/qa/lesson-team/wt.mjs sync --run <run-id> --files a,b,…   (или --changed)
//       перенести файлы из копии в основную. Отказ, если файл в основной копии изменился после create
//       (чужая правка) — ничего не перезаписывается молча.
//   node tools/qa/lesson-team/wt.mjs remove --run <run-id> [--discard]
//       удалить копию. Без --discard — только если все изменения перенесены.
//
// Коммитов не делает: копия detached, перенос — копированием файлов.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { ROOT, WORK, ensureWork, fileHash } from './lib/files.mjs';

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const has = (name) => args.includes(name);
const runId = opt('--run');
const fail = (m) => { console.error('wt: ' + m); process.exit(1); };
if (!cmd || !runId) fail('нужно: create|status|sync|remove --run <run-id>');
if (!/^[\w.-]+$/.test(runId)) fail('run-id: латиница, цифры, точка, дефис');

const wtPath = join(ROOT, '.claude', 'worktrees', 'lt-' + runId);
const manifestPath = join(WORK, runId, 'worktree.json');
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8', maxBuffer: 64 << 20 });
const listFiles = (cwd) => git(cwd, 'ls-files', '-co', '--exclude-standard', '-z').split('\0').filter(Boolean)
  .filter((f) => !f.startsWith('.claude/worktrees/'));
const hashOf = (base, f) => { const h = fileHash(join(base, f)); return h.missing ? null : h.sha256; };
const readManifest = () => { if (!existsSync(manifestPath)) fail('нет ' + relative(ROOT, manifestPath) + ' — сначала create'); return JSON.parse(readFileSync(manifestPath, 'utf8')); };

function changedInCopy(m) {
  const now = listFiles(wtPath);
  const out = [];
  for (const f of new Set([...now, ...Object.keys(m.copy)])) {
    const h = hashOf(wtPath, f);
    if (h !== (m.copy[f] ?? null)) out.push({ file: f, state: m.copy[f] == null ? 'новый' : h == null ? 'удалён' : 'изменён' });
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

if (cmd === 'create') {
  if (existsSync(wtPath)) fail('копия уже есть: ' + relative(ROOT, wtPath));
  ensureWork();
  mkdirSync(dirname(wtPath), { recursive: true });
  git(ROOT, 'worktree', 'add', '--detach', wtPath, 'HEAD');
  // Перенести текущее состояние основной копии: изменённые, новые и удалённые файлы (кроме игнорируемых).
  const dirty = git(ROOT, 'ls-files', '-m', '-o', '--exclude-standard', '-z').split('\0').filter(Boolean)
    .filter((f) => !f.startsWith('.claude/worktrees/'));
  let copied = 0, removed = 0;
  for (const f of dirty) {
    const src = join(ROOT, f), dst = join(wtPath, f);
    if (existsSync(src)) { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); copied += 1; }
    else if (existsSync(dst)) { rmSync(dst); removed += 1; }
  }
  if (existsSync(join(ROOT, 'node_modules')) && !existsSync(join(wtPath, 'node_modules'))) symlinkSync(join(ROOT, 'node_modules'), join(wtPath, 'node_modules'), 'dir');
  const files = listFiles(ROOT);
  const main = {}, copy = {};
  for (const f of files) { main[f] = hashOf(ROOT, f); copy[f] = hashOf(wtPath, f); }
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify({ runId, path: relative(ROOT, wtPath), createdAt: new Date().toISOString(), main, copy }, null, 1) + '\n');
  console.log(JSON.stringify({ path: relative(ROOT, wtPath), copiedDirty: copied, removed, files: files.length,
    hint: 'работать в этой папке; QA: cd <путь> && node tools/qa/lesson-team/run.mjs --serve … --out ' + relative(wtPath, join(WORK, runId)) + '/qa/<метка>' }, null, 2));
} else if (cmd === 'status') {
  const m = readManifest();
  const ch = changedInCopy(m);
  if (!ch.length) console.log('изменений в копии нет');
  for (const c of ch) console.log(c.state.padEnd(8) + ' ' + c.file);
} else if (cmd === 'sync') {
  const m = readManifest();
  const want = has('--changed') ? changedInCopy(m).map((c) => c.file) : String(opt('--files') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!want.length) fail('нечего переносить: --files a,b или --changed');
  const conflicts = [];
  for (const f of want) {
    if (f.startsWith('work/') || f.includes('..')) fail('недопустимый путь: ' + f);
    const cur = hashOf(ROOT, f);
    if (cur !== (m.main[f] ?? null)) conflicts.push(f);
  }
  if (conflicts.length) fail('в основной копии эти файлы изменились после create — перенос остановлен, разберитесь вручную:\n  ' + conflicts.join('\n  '));
  for (const f of want) {
    const src = join(wtPath, f), dst = join(ROOT, f);
    if (existsSync(src)) { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); console.log('перенесён  ' + f); }
    else if (existsSync(dst)) { rmSync(dst); console.log('удалён     ' + f); }
    m.main[f] = hashOf(ROOT, f); m.copy[f] = hashOf(wtPath, f);
  }
  writeFileSync(manifestPath, JSON.stringify(m, null, 1) + '\n');
} else if (cmd === 'remove') {
  const m = existsSync(manifestPath) ? readManifest() : null;
  if (m && !has('--discard')) {
    const left = changedInCopy(m).filter((c) => hashOf(ROOT, c.file) !== hashOf(wtPath, c.file));
    if (left.length) fail('в копии есть неперенесённые изменения (sync или --discard):\n  ' + left.map((c) => c.file).join('\n  '));
  }
  git(ROOT, 'worktree', 'remove', '--force', wtPath);
  console.log('копия удалена: ' + relative(ROOT, wtPath));
} else fail('неизвестная команда: ' + cmd);
