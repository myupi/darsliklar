// Корень проекта, хеши файлов и версия набора файлов (для привязки отчётов к версии).

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../../../../', import.meta.url)));

// Каталог отчётов /lesson-team. Свой .gitignore (игнорирует и сам себя): отчёты не попадают в git,
// корневой .gitignore не меняется. Вызывают все скрипты, которые пишут в этот каталог.
export const WORK = join(ROOT, 'work', 'lesson-team');
export function ensureWork() {
  mkdirSync(WORK, { recursive: true });
  const ignore = join(WORK, '.gitignore');
  if (!existsSync(ignore)) writeFileSync(ignore, '# Отчёты запусков /lesson-team — временные, не коммитятся.\n*\n');
  return WORK;
}

export const rel = (p) => relative(ROOT, isAbsolute(p) ? p : resolve(ROOT, p)).split('\\').join('/');

export function fileHash(p) {
  const abs = isAbsolute(p) ? p : resolve(ROOT, p);
  const path = rel(abs);
  if (!existsSync(abs) || !statSync(abs).isFile()) return { path, missing: true };
  const buf = readFileSync(abs);
  return { path, sha256: createHash('sha256').update(buf).digest('hex'), bytes: buf.length };
}

// Версия — короткий хеш от путей и хешей всех файлов: любая правка любого файла даёт новую версию.
export function versionOf(paths) {
  const files = [...new Set(paths.map((p) => rel(p)))].sort().map((p) => fileHash(p));
  const h = createHash('sha256');
  files.forEach((f) => h.update(f.path + ':' + (f.sha256 || 'missing') + '\n'));
  return { version: 'v-' + h.digest('hex').slice(0, 12), files };
}

export function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
