// Статусы проверок, итог запуска и запись отчёта (report.json + report.md).
//
// Статусы: passed — условие проверено и выполнено (есть доказательство);
//          failed — условие проверено и нарушено (есть воспроизведение);
//          not-run — проверку не выполняли (причина);
//          blocked — хотели, но не смогли (причина и как разблокировать).
// Итог passed только если все проверки passed: not-run и blocked — не успех.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const STATUSES = ['passed', 'failed', 'not-run', 'blocked'];

export function overall(checks) {
  if (!checks.length) return 'not-run';
  if (checks.some((c) => c.status === 'failed')) return 'failed';
  if (checks.some((c) => c.status === 'blocked')) return 'blocked';
  if (checks.some((c) => c.status === 'not-run')) return 'not-run';
  return 'passed';
}

export const EXIT = { passed: 0, failed: 1, blocked: 2, 'not-run': 3 };

export function check(id, fields) {
  const c = Object.assign({ id, status: 'not-run', condition: '', evidence: [], repro: null, reason: null }, fields);
  if (!STATUSES.includes(c.status)) throw new Error('Неизвестный статус ' + c.status);
  return c;
}

const cell = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');

export function toMarkdown(r) {
  const L = [];
  L.push(`# Отчёт QA — ${r.target.label}`);
  L.push('');
  L.push(`- Итог: **${r.overall}**`);
  L.push(`- Запуск: ${r.startedAt} → ${r.finishedAt}`);
  L.push(`- Версия: ${r.versions.start ? r.versions.start.version : '—'}${r.versions.changed ? ' → **изменилась во время прогона: ' + r.versions.end.version + '**' : ''}`);
  L.push(`- Файлы версии: ${r.versions.start ? r.versions.start.files.map((f) => f.path).join(', ') : '—'}`);
  L.push(`- Адаптер: ${r.options.adapter} · голос: ${r.options.voice} · языки: ${r.options.langs.join(', ')} · размеры: ${r.options.sizes.join(', ')}`);
  if (r.scenario) L.push(`- Сценарий: ${r.scenario.path} (${r.scenario.title || ''})`);
  L.push(`- Окружение: ${r.environment.chrome || 'Chrome ?'} · Node ${r.environment.node} · ${r.environment.base}`);
  L.push('');
  L.push('| Проверка | Язык / размер | Статус | Условие | Доказательство / причина |');
  L.push('|---|---|---|---|---|');
  for (const c of r.checks) {
    const where = [c.lang, c.size, c.flow].filter(Boolean).join(' · ');
    const ev = c.status === 'passed' ? (c.evidence || []).slice(0, 3).join('; ') : (c.reason || (c.evidence || []).slice(0, 2).join('; '));
    L.push(`| ${cell(c.title || c.id)} | ${cell(where)} | ${c.status} | ${cell(c.condition)} | ${cell(ev)} |`);
  }
  const bad = r.checks.filter((c) => c.status === 'failed');
  if (bad.length) {
    L.push('');
    L.push('## Воспроизведение проваленных проверок');
    for (const c of bad) {
      L.push('');
      L.push(`### ${c.title || c.id}${c.lang ? ' · ' + c.lang : ''}${c.size ? ' · ' + c.size : ''}`);
      if (c.reason) L.push(`- Факт: ${c.reason}`);
      if (c.condition) L.push(`- Ожидалось: ${c.condition}`);
      if (c.repro) L.push(`- Повторить: \`${c.repro}\``);
      (c.evidence || []).forEach((e) => L.push(`- ${e}`));
    }
  }
  L.push('');
  L.push('## Ограничения');
  L.push('- Прогон в headless Chrome. Эмуляция клавиатуры (`is-kbd`, уменьшенная видимая высота) не доказывает удобство настоящей клавиатуры телефона.');
  L.push('- Режимы озвучки `fast` / `simulate` дают тишину нужной длины: качество живого голоса здесь не проверяется.');
  if (r.notes && r.notes.length) {
    L.push('');
    L.push('## Заметки');
    r.notes.forEach((n) => L.push(`- ${n}`));
  }
  return L.join('\n') + '\n';
}

export function writeReport(dir, r) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'report.json'), JSON.stringify(r, null, 2));
  writeFileSync(join(dir, 'report.md'), toMarkdown(r));
}
