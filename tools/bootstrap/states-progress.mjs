// Ход прогона tools/bootstrap/states.mjs (23.11.2026): node tools/bootstrap/states-progress.mjs <папка прогона> [--watch]
// Считает, сколько экранов (экран × язык) прошёл каждый урок, и общий процент; ещё — практики (run.mjs) и тесты (webtest sweep).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2];
const watch = process.argv.includes('--watch');
const LESSONS = ['01-vvedenie', '02-cveta-i-knopki', '03-zagruzka-i-izobrazheniya', '04-flex', '05-kartochki', '06-kontejner-i-setka',
  '07-navbar-i-pagination', '08-formy', '09-karusel', '10-menu-i-dialog', '11-final-proekt'];
const PER = 18 * 3;   // экраны 1–18 × 3 языка
const bar = (p, w = 24) => '█'.repeat(Math.round(p * w)) + '░'.repeat(w - Math.round(p * w));
function show() {
  const logs = existsSync(dir) ? readdirSync(dir).filter((f) => /^log-\d+\.txt$/.test(f)) : [];
  const lines = logs.flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n'));
  let done = 0; const out = [];
  out.push('Прогон уроков Bootstrap по состояниям — ' + new Date().toLocaleTimeString('ru-RU'));
  out.push('');
  let found = 0;
  for (const L of LESSONS) {
    const seen = new Set(lines.filter((l) => l.startsWith(L + ' ') && / s0 /.test(l)).map((l) => l.split(' ')[1] + l.split(' ')[4]));
    const iss = lines.filter((l) => l.startsWith(L + ' ') && l.includes(' — ')).length;
    found += iss;
    done += seen.size;
    const p = Math.min(1, seen.size / PER);
    out.push(`${L.padEnd(28)} ${bar(p)} ${String(Math.round(p * 100)).padStart(3)}%   замечаний: ${iss}`);
  }
  const all = done / (PER * LESSONS.length);
  out.push('');
  out.push(`ВСЕГО уроки                  ${bar(all)} ${String(Math.round(all * 100)).padStart(3)}%   замечаний: ${found}`);
  const pr = existsSync(join(dir, 'practices.txt')) ? readFileSync(join(dir, 'practices.txt'), 'utf8') : '';
  const pn = (pr.match(/^== /gm) || []).length, pdone = pr.includes('PDONE');
  const pp = pdone ? 1 : Math.max(0, pn - 1) / 10;
  out.push(`Практики 01p–10p             ${bar(pp)} ${String(Math.round(pp * 100)).padStart(3)}%   ${pdone ? 'готово' : 'идёт ' + pn + '-я из 10'}`);
  const te = existsSync(join(dir, 'tests.txt')) ? readFileSync(join(dir, 'tests.txt'), 'utf8') : '';
  out.push(`Тесты (50 файлов)            ${te.includes('TDONE') ? 'готово' : 'идёт…'}`);
  return out.join('\n');
}
if (!watch) console.log(show());
else { const tick = () => { process.stdout.write('\x1b[2J\x1b[H' + show() + '\n\n(обновляется каждые 10 с; Ctrl+C — выйти)\n'); }; tick(); setInterval(tick, 10000); }
