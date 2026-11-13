// Прогон уроков автопроверкой и сбор реплик без записи в LESSON_AUDIO (13.11.2026).
// Канон пишет console.warn «[ovoz] LESSON_AUDIO da yozuv yo'q: <текст>», run.mjs кладёт их в report.ovozMiss.
// Язык реплики — по самому тексту (кириллица — ru; узбекские и английские служебные слова).
//   node tools/ovoz/capture.mjs [--base http://localhost:5174] [--par 3] [--langs uz,ru,en] [файл.jsx…|all]
// Итог: tools/ovoz/miss/<курс>-<урок>.json — { uz: [...], ru: [...], en: [...], status }.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lessonFiles } from './ovoz.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); if (i < 0) return d; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const base = opt('--base', 'http://localhost:5174');
const par = +opt('--par', '3');
const langs = opt('--langs', 'uz,ru,en');
const sizes = opt('--sizes', '1280x720');
const files = argv[0] === 'all' || !argv.length ? lessonFiles() : argv.map((a) => resolve(a));
mkdirSync(join(here, 'miss'), { recursive: true });

const UZ = /\b(va|bu|siz|sizning|bilan|uchun|ham|endi|qani|keling|nima|qaysi|yo'q|bor|emas|kerak|bo'ladi|qiling|bosing|yozing|mana|demak)\b/gi;
const EN = /\b(the|and|you|your|is|are|to|of|it|this|that|what|let's|now|with|for|here|we)\b/gi;
export const langOf = (t) => {
  if (/[А-Яа-яЁё]/.test(t)) return 'ru';
  const u = (t.match(UZ) || []).length, e = (t.match(EN) || []).length;
  return u >= e ? 'uz' : 'en';
};

const scenarioOf = (f) => join(root, 'tools/qa/lesson-team/scenarios', basename(dirname(f)) + '-' + basename(f, '.jsx') + '.qa.mjs');
const latestReport = (since, name) => {
  const dir = join(root, 'work/lesson-team');
  const cand = readdirSync(dir).filter((d) => d.endsWith('-' + name) && statSync(join(dir, d)).mtimeMs >= since).sort();
  return cand.length ? join(dir, cand[cand.length - 1], 'report.json') : null;
};

async function one(f) {
  const sc = scenarioOf(f);
  const name = basename(f, '.jsx');
  const key = basename(dirname(f)) + '-' + name;
  if (!existsSync(sc)) { writeFileSync(join(here, 'miss', key + '.json'), JSON.stringify({ status: 'no-scenario' }, null, 1)); return key + ': нет сценария'; }
  const t0 = Date.now() - 1000;
  const code = await new Promise((ok) => {
    const p = spawn('node', ['tools/qa/lesson-team/run.mjs', '--scenario', sc, '--base', base, '--checks', 'scenario', '--langs', langs, '--sizes', sizes, '--voice', 'fast'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; }); p.stderr.on('data', (d) => { out += d; });
    p.on('close', (c) => ok({ c, out }));
  });
  const rep = latestReport(t0, name);
  const r = rep && existsSync(rep) ? JSON.parse(readFileSync(rep, 'utf8')) : null;
  const res = { uz: [], ru: [], en: [], status: r ? r.overall : 'no-report' };
  ((r && r.ovozMiss) || []).forEach((t) => { const L = langOf(t); if (res[L].indexOf(t) < 0) res[L].push(t); });
  writeFileSync(join(here, 'miss', key + '.json'), JSON.stringify(res, null, 1) + '\n');
  return key + ': ' + res.status + ' · без записи uz ' + res.uz.length + ', ru ' + res.ru.length + ', en ' + res.en.length;
}

const queue = files.slice();
await Promise.all(Array.from({ length: par }, async () => {
  while (queue.length) { const f = queue.shift(); console.log(await one(f)); }
}));
