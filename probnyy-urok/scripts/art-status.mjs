// Какие иллюстрации уже есть и каких нет: node scripts/art-status.mjs  (из папки probnyy-urok)
// Слоты и промпты — src/art.js; файлы — src/img/<id>.webp|png|jpg.
import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const IMG = join(here, '../src/img');
const { ART, PRIORITY } = await import(new URL('../src/art.js', import.meta.url).href);
const files = readdirSync(IMG).filter((f) => /\.(webp|png|jpe?g|svg)$/i.test(f));
const byId = {};
files.forEach((f) => { byId[f.replace(/\.(webp|png|jpe?g|svg)$/i, '')] = f; });

let have = 0;
for (const [title, ids] of PRIORITY) {
  console.log('\nПриоритет ' + title);
  for (const id of ids) {
    const a = ART[id];
    const f = byId[id];
    const kb = f ? Math.round(statSync(join(IMG, f)).size / 1024) : 0;
    if (f) have += 1;
    console.log((f ? '  ✓ ' : '  · ') + id.padEnd(16) + (f ? f + ' ' + kb + ' КБ' + (kb > 300 ? '  ← больше 300 КБ, уменьшить' : '') : 'нет — ' + a.size.join('×') + ', ' + a.kind + ', слайд ' + a.slide + ': ' + a.where));
  }
}
const extra = Object.keys(byId).filter((id) => !ART[id]);
if (extra.length) console.log('\nФайлы без слота в src/art.js (не показываются): ' + extra.join(', '));
console.log('\nГотово ' + have + ' из ' + Object.keys(ART).length + '.');
