// Выгрузка курса HTML с понятными именами (заказчик, 28.11.2026: «без q, а сразу название тем… собери в архив»).
// Файлы в проекте не переименовываются (по именам <NN>q<K>…, <NN>p<K>…, <NN>q<K>t<J>… их находят просмотрщик и сборщики);
// здесь они копируются в папки по 17 темам с именами «05 Списки, ul, ol и li / 1 Урок — Списки, ul, ol и li.jsx» и упаковываются в zip.
// Запуск: node tools/eksport-html.mjs → eksport/HTML — 17 тем/ и eksport/HTML — 17 тем.zip
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'lessons/html');
const OUT_DIR = join(ROOT, 'eksport');
const NAME = 'HTML — 17 тем';
const OUT = join(OUT_DIR, NAME);

const strAt = (s, i) => { const q = s[i]; let j = i + 1, out = ''; while (s[j] !== q) { if (s[j] === '\\') { out += s[j + 1]; j += 2; } else out += s[j++]; } return out; };
const field = (s, key, from = 0) => { const re = new RegExp('\\b' + key + ':\\s*([\'"`])', 'g'); re.lastIndex = from; const m = re.exec(s); return m ? strAt(s, m.index + m[0].length - 1) : null; };
const metaRu = (src) => { const i = src.indexOf('const META = {'); const j = src.indexOf('lessonTitle:', i); return field(src, 'ru', j); };
// имя файла без знаков, которые ломаются в Finder / Windows
const safe = (s) => s.replace(/[«»"]/g, '').replace(/\s*:\s*/g, ', ').replace(/[\\/?*<>|]/g, ' ').replace(/\s+/g, ' ').trim();
const pad = (n) => String(n).padStart(2, '0');

const all = readdirSync(SRC).filter((f) => f.endsWith('.jsx'));
const items = [];
for (const f of all) {
  let m;
  if ((m = /^(\d\d)q(\d)-/.exec(f))) items.push({ f, seq: 2 * (+m[1] - 1) + +m[2], kind: 0 });
  else if ((m = /^(\d\d)p(\d)-/.exec(f))) items.push({ f, seq: 2 * (+m[1] - 1) + +m[2], kind: 1 });
  else if ((m = /^(\d\d)q(\d)t(\d)-/.exec(f))) items.push({ f, seq: 2 * (+m[1] - 1) + +m[2], kind: 2, t: +m[3] });
  else if (f === '09-final-proekt.jsx') items.push({ f, seq: 17, kind: 0 });
  else if (f === '09p-final-proekt.jsx') items.push({ f, seq: 17, kind: 1 });
}
items.sort((a, b) => a.seq - b.seq || a.kind - b.kind || (a.t || 0) - (b.t || 0));

const topic = {};   // название темы по уроку
for (const it of items) if (it.kind === 0) topic[it.seq] = safe(metaRu(readFileSync(join(SRC, it.f), 'utf8')).replace(/^Урок \d+\.\s*/, ''));

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
const list = [`${NAME} — какой файл чем был в проекте`, ''];
let fontsFrom = null;
for (const it of items) {
  const src = readFileSync(join(SRC, it.f), 'utf8');
  const dir = join(OUT, `${pad(it.seq)} ${topic[it.seq]}`);
  mkdirSync(dir, { recursive: true });
  let name;
  if (it.kind === 0) name = `1 Урок — ${topic[it.seq]}.jsx`;
  else if (it.kind === 1) name = `2 Практика — ${safe(metaRu(src).replace(/^Практика \d+\.\s*/, ''))}.jsx`;
  else name = `3 Тест ${it.t} из 5.jsx`;
  copyFileSync(join(SRC, it.f), join(dir, name));
  list.push(`${pad(it.seq)} ${topic[it.seq]} / ${name}   ←   lessons/html/${it.f}`);
  const a = join(SRC, 'assets', it.f.replace(/\.jsx$/, ''));
  if (!fontsFrom && existsSync(a)) fontsFrom = a;
}
// шрифты Inter у всех уроков и практик одинаковые — одна папка на весь курс
const fdir = join(OUT, 'Шрифты Inter (WOFF2 для CRM)');
mkdirSync(fdir);
for (const w of readdirSync(fontsFrom)) copyFileSync(join(fontsFrom, w), join(fdir, w));
list.push('', 'Шрифты Inter (inter_latin_400/600, inter_cyrillic_400/600) у всех уроков и практик одинаковые — одна папка на весь курс.');
writeFileSync(join(OUT, 'Список файлов.txt'), list.join('\n') + '\n');

// zip с UTF-8 именами (Python zipfile ставит флаг UTF-8 — русские имена читаются и в Windows)
const zip = join(OUT_DIR, NAME + '.zip');
if (existsSync(zip)) rmSync(zip);
execFileSync('python3', ['-I', '-c', `
import os, sys, zipfile
root, base, out = sys.argv[1], sys.argv[2], sys.argv[3]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for d, ds, fs in os.walk(os.path.join(root, base)):
        ds.sort()
        for f in sorted(fs):
            p = os.path.join(d, f)
            z.write(p, os.path.relpath(p, root))
`, OUT_DIR, NAME, zip]);
console.log(items.length, 'файлов →', zip);
