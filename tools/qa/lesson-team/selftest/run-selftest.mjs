#!/usr/bin/env node
// Самопроверка QA-инструментов на изолированной странице (не уроке):
// раннер должен различать passed, failed, not-run и blocked.
//
//   node tools/qa/lesson-team/selftest/run-selftest.mjs [--base http://localhost:5173]
//
// Отчёты — work/lesson-team/selftest-<время>/<случай>/, сводка — summary.md рядом.

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT, ensureWork, rel, stamp } from '../lib/files.mjs';

const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:5173';
const out = resolve(ensureWork(), `selftest-${stamp()}`);
mkdirSync(out, { recursive: true });
const RUN = resolve(ROOT, 'tools/qa/lesson-team/run.mjs');
const FIX = '/tools/qa/lesson-team/selftest/fixture.html';
const SC = (n) => `tools/qa/lesson-team/selftest/${n}.qa.mjs`;

const CASES = [
  { id: 'pass', what: 'исправная страница + верный сценарий', args: ['--page', FIX + '?mode=ok', '--scenario', SC('fixture-pass'), '--checks', 'load,scenario'],
    expect: { overall: 'passed', code: 0, statuses: { load: 'passed', scenario: 'passed', finish: 'passed' } } },
  { id: 'wrong-expectation', what: 'ожидание, которое не выполняется', args: ['--page', FIX + '?mode=ok', '--scenario', SC('fixture-fail'), '--checks', 'load,scenario'],
    expect: { overall: 'failed', code: 1, statuses: { scenario: 'failed' }, reason: /Верно/ } },
  { id: 'double-finish', what: 'onFinished дважды', args: ['--page', FIX + '?mode=double', '--scenario', SC('fixture-pass'), '--checks', 'load,scenario'],
    expect: { overall: 'failed', code: 1, statuses: { finish: 'failed' } } },
  { id: 'js-error', what: 'исключение на странице', args: ['--page', FIX + '?mode=error', '--scenario', SC('fixture-pass'), '--checks', 'load,scenario'],
    expect: { overall: 'failed', code: 1, statuses: { scenario: 'failed' } } },
  { id: 'no-scenario', what: 'сценария нет', args: ['--page', FIX + '?mode=ok', '--checks', 'load,scenario'],
    expect: { overall: 'not-run', code: 3, statuses: { load: 'passed', scenario: 'not-run' } } },
  { id: 'not-ready', what: 'страница не отрисовалась', args: ['--page', FIX + '?mode=noready', '--checks', 'load', '--ready-timeout', '4000'],
    expect: { overall: 'failed', code: 1, statuses: { load: 'failed' } } },
  { id: 'bypass', what: 'сценарий с обходом заданий', args: ['--page', FIX + '?mode=ok', '--scenario', SC('fixture-bypass'), '--checks', 'scenario'],
    expect: { overall: 'blocked', code: 2, statuses: { scenario: 'blocked' } } },
  { id: 'no-server', what: 'dev-сервер недоступен', args: ['--page', FIX + '?mode=ok', '--scenario', SC('fixture-pass'), '--checks', 'load,scenario', '--base', 'http://127.0.0.1:5999'],
    expect: { overall: 'blocked', code: 2, statuses: { load: 'blocked', scenario: 'blocked' } }, noBase: true },
];

const results = [];
for (const c of CASES) {
  const dir = join(out, c.id);
  const argv = [RUN, ...c.args, '--out', dir, ...(c.noBase ? [] : ['--base', base])];
  const t0 = Date.now();
  const p = spawnSync(process.execPath, argv, { cwd: ROOT, encoding: 'utf8', timeout: 180000 });
  const ms = Date.now() - t0;
  let rep = null;
  try { rep = JSON.parse(readFileSync(join(dir, 'report.json'), 'utf8')); } catch { /* нет отчёта */ }
  const problems = [];
  if (!rep) problems.push('нет report.json');
  if (rep && rep.overall !== c.expect.overall) problems.push(`итог ${rep.overall}, ожидался ${c.expect.overall}`);
  if (p.status !== c.expect.code) problems.push(`код выхода ${p.status}, ожидался ${c.expect.code}`);
  for (const [id, st] of Object.entries(c.expect.statuses || {})) {
    const got = rep ? rep.checks.filter((x) => x.id === id).map((x) => x.status) : [];
    if (!got.length) problems.push(`нет проверки ${id}`);
    else if (!got.every((g) => g === st)) problems.push(`${id}: ${got.join(',')}, ожидалось ${st}`);
  }
  if (c.expect.reason && rep) {
    const txt = rep.checks.map((x) => (x.reason || '') + ' ' + (x.evidence || []).join(' ')).join(' ');
    if (!c.expect.reason.test(txt)) problems.push('в причине нет ожидаемого текста ' + c.expect.reason);
    const f = rep.checks.find((x) => x.status === 'failed');
    if (f && !f.repro) problems.push('у проваленной проверки нет команды воспроизведения');
  }
  results.push({ id: c.id, what: c.what, ok: problems.length === 0, problems, overall: rep && rep.overall, code: p.status, ms, report: rep ? rel(join(dir, 'report.md')) : null });
  console.log(`${problems.length ? 'НЕ ТАК' : 'ок    '} ${c.id.padEnd(18)} → ${rep ? rep.overall : '—'} (код ${p.status})${problems.length ? ' · ' + problems.join('; ') : ''}`);
}

const allOk = results.every((r) => r.ok);
const md = ['# Самопроверка QA-инструментов', '', `Итог: **${allOk ? 'все случаи различены верно' : 'есть расхождения'}** · ${new Date().toISOString()} · ${base}`, '',
  '| Случай | Что проверяется | Итог раннера | Код | Совпало с ожиданием | Отчёт |', '|---|---|---|---|---|---|',
  ...results.map((r) => `| ${r.id} | ${r.what} | ${r.overall || '—'} | ${r.code} | ${r.ok ? 'да' : 'нет: ' + r.problems.join('; ')} | ${r.report || '—'} |`)].join('\n') + '\n';
writeFileSync(join(out, 'summary.md'), md);
writeFileSync(join(out, 'summary.json'), JSON.stringify({ ok: allOk, base, results }, null, 2));
console.log(`\nСводка: ${rel(join(out, 'summary.md'))}`);
process.exit(allOk ? 0 : 1);
