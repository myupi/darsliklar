// Практики HTML двумя частями (заказчик, 27.11.2026: «практика к каждому из уроков 2–8 тоже делится на две части —
// по 4 задания в каждой»; уроки 2–8 уже разделены — tools/qism/build.mjs). Номер практики не меняется: части —
// NNp1 и NNp2 рядом с целой практикой NNp (она остаётся как есть и в списке просмотрщика её заменяют части).
//
//   node tools/qism/build-prac.mjs <NN>[,<NN>…]|all [--no-rebuild]
//     → lessons/html/<NN>p1-<slug>.jsx, <NN>p2-<slug>.jsx
//
// Части собираются из тех же исходников, что и целая практика (tools/amaliyotN/: aN.src.jsx, aN-screens.jsx, aN.css),
// без их изменения. Сначала запускается собственный build.mjs практики — он кладёт в gen/ облик «Редактор» со всеми
// правками речи этой практики (и пересобирает целый файл идентично; builder возвращает его байт в байт, если он
// вдруг изменился). Дальше для каждой части builder:
//   · подменяет реестр SCREENS и SCREEN_RESET (список экранов части: хук, 4 задания, вывод);
//   · вставляет перед реестром код части — файл pconf/<NN>-pK.part.jsx: новые задания, хук, вывод, тексты
//     (Object.assign(C, {…}), TABS.splice(…) — данные меняются мутацией, как в qism/build.mjs);
//   · применяет правки кода (edits: точная замена, ровно одно совпадение; третьим элементом 'all' — все);
//   · ставит свой lessonId (html-<NN>pK-<slug>) и META.lessonTitle на трёх языках;
//   · дописывает свой CSS (pconf/<NN>.part.css) к CSS практики;
//   · собирает файл через .claude/skills/novyy-urok/scripts/sobrat.mjs (канон дословно + защита от ввода ученика).
// Перед сборкой builder сам прогоняет защиту say-hide-guard по файлам pconf (плейсхолдеры без меток — ошибка).
//
// Конфиг практики (tools/qism/pconf/<NN>.mjs, default export):
//   {
//     dir:    'tools/amaliyot3',            // папка исходников целой практики
//     src:    'a3.src.jsx',                 // исходник (META, UI, TABS, C, пометки /*@FILE@*/)
//     screens:'a3-screens.jsx',             // экраны и движок
//     css:    'a3.css',                     // CSS практики (подставляется как /*@FILE:a3.css@*/)
//     slug:   'spiski',                     // как у целой практики: lessons/html/<NN>p-<slug>.jsx
//     cssExtra: '03.part.css',              // необязательно: файл в pconf, дописывается к CSS обеих частей
//     edits: [[from, to, 'all'?]],          // необязательно: правки кода экранов для обеих частей
//     srcEdits: [[from, to, 'all'?]],       // необязательно: правки исходника (a3.src.jsx) для обеих частей
//     parts: [ {                            // две части: индекс 0 → NNp1, 1 → NNp2
//       title:  { uz, ru, en },             // META.lessonTitle («3-amaliyot. 1-qism: …»)
//       part:   '03-p1.part.jsx',           // код части (в папке pconf, без вложенных папок)
//       screens: "{ id: 's1', code: 'HOOK', Comp: S1 }, …",   // тело массива SCREENS
//       reset:  "s1: ['s1'], t1: ['t1'], …",                  // тело объекта SCREEN_RESET
//       edits:  [[from, to, 'all'?]],       // правки кода экранов только для этой части
//       srcEdits: […],                      // правки исходника только для этой части
//       artifact: 'function practiceArtifact(store) {…}'      // необязательно: своя функция артефакта целиком
//     }, {…} ]
//   }
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const confDir = join(here, 'pconf');

// Замена с проверкой числа совпадений: по умолчанию ровно одно; 'all' — одно и больше.
const must = (s, from, to, what, count) => {
  const n = s.split(from).length - 1;
  if (count === 'all' ? n < 1 : n !== 1) {
    throw new Error('qism/build-prac.mjs: ' + (count === 'all' ? 'не найдено ни одного места' : 'не найдено ровно одно место (найдено ' + n + ')')
      + ' — ' + what + ' («' + String(from).slice(0, 80) + '»)');
  }
  return s.split(from).join(to);
};
const applyEdits = (s, edits, what) => (edits || []).reduce((a, [from, to, count], i) => must(a, from, to, what + ' #' + (i + 1), count), s);

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const arg = args.find((a) => !a.startsWith('--'));
if (!arg) { console.error('node tools/qism/build-prac.mjs <NN>[,<NN>]|all [--no-rebuild]'); process.exit(1); }
const nums = arg === 'all'
  ? readdirSync(confDir).filter((f) => /^\d\d\.mjs$/.test(f)).map((f) => f.slice(0, 2)).sort()
  : arg.split(',').map((x) => x.padStart(2, '0'));

const q = JSON.stringify;
const { checkSources } = await import(pathToFileURL(join(root, 'tools/say-hide-guard.mjs')).href);

for (const NN of nums) {
  const confFile = join(confDir, NN + '.mjs');
  const conf = (await import(pathToFileURL(confFile).href + '?t=' + Date.now())).default;
  const dir = join(root, conf.dir);
  const gen = join(dir, 'gen');

  // Защита «ввод ученика не в озвучку» по файлам частей — до сборки.
  const partFiles = conf.parts.map((P) => join(confDir, P.part));
  const bad = checkSources([confFile, ...partFiles]);
  if (bad.length) { console.error(bad.join('\n')); throw new Error('qism/build-prac.mjs: say-hide-guard — нарушений ' + bad.length); }

  // Свежий gen/ целой практики: её собственный build.mjs (облик «Редактор» и правки речи практики).
  const whole = join(root, `lessons/html/${NN}p-${conf.slug}.jsx`);
  if (!flags.includes('--no-rebuild') || !existsSync(gen)) {
    const snap = existsSync(whole) ? readFileSync(whole) : null;
    execFileSync('node', [join(dir, 'build.mjs')], { stdio: 'inherit' });
    if (snap && !readFileSync(whole).equals(snap)) writeFileSync(whole, snap);   // целая практика остаётся как есть
  }

  const srcRaw = readFileSync(join(dir, conf.src), 'utf8');
  const scrRaw = readFileSync(join(dir, conf.screens), 'utf8');
  const cssRaw = readFileSync(join(dir, conf.css), 'utf8');
  const cssExtra = conf.cssExtra ? readFileSync(join(confDir, conf.cssExtra), 'utf8') : '';
  const metaId = /lessonId: '([^']+)'/.exec(srcRaw);
  if (!metaId) throw new Error('qism/build-prac.mjs: нет lessonId в META исходника');

  conf.parts.forEach((P, idx) => {
    const k = idx + 1;
    const out = `lessons/html/${NN}p${k}-${conf.slug}.jsx`;
    const lessonId = metaId[1].replace(/^(html-\d\d)p-/, `$1p${k}-`);
    if (lessonId === metaId[1]) throw new Error('qism/build-prac.mjs: lessonId не вида html-NNp-slug: ' + metaId[1]);

    // Экраны: общие правки, потом правки части, реестр, код части перед реестром.
    let scr = applyEdits(applyEdits(scrRaw, conf.edits, 'edits'), P.edits, `часть ${k}: edits`);
    const a = scr.indexOf('const SCREENS = [');
    const b = scr.indexOf('];', a);
    if (a < 0 || b < 0) throw new Error('qism/build-prac.mjs: нет const SCREENS в ' + conf.screens);
    scr = scr.slice(0, a) + 'const SCREENS = [\n  ' + P.screens + '\n' + scr.slice(b);
    scr = must(scr, /const SCREEN_RESET = \{[^\n]*\};/.exec(scr)[0], `const SCREEN_RESET = { ${P.reset} };`, 'SCREEN_RESET');
    if (P.artifact) {
      const m = /\nfunction practiceArtifact\(store\) \{[\s\S]*?\n\}\n/.exec(scr);
      if (!m) throw new Error('qism/build-prac.mjs: нет function practiceArtifact');
      scr = scr.replace(m[0], () => '\n' + P.artifact.trim() + '\n');
    }
    const code = readFileSync(join(confDir, P.part), 'utf8');
    const mark = '// =============================================================================\n// РЕЕСТР И КОРЕНЬ';
    scr = must(scr, mark, `// ── Практика ${Number(NN)} частями (tools/qism/build-prac.mjs, 27.11.2026): часть ${k}. ──\n${code.trim()}\n\n${mark}`, 'реестр');
    writeFileSync(join(gen, `p${k}-screens.jsx`), scr);
    writeFileSync(join(gen, `p${k}.css`), cssRaw + (cssExtra ? '\n' + cssExtra : ''));

    // Исходник: свой lessonId и название, пути включений от папки gen/.
    let src = applyEdits(applyEdits(srcRaw, conf.srcEdits, 'srcEdits'), P.srcEdits, `часть ${k}: srcEdits`);
    src = must(src, `lessonId: '${metaId[1]}'`, `lessonId: '${lessonId}'`, 'lessonId');
    const tm = /lessonTitle: \{\s*uz: [^\n]*\n\s*ru: [^\n]*\n\s*en: [^\n]*\n\s*\}/.exec(src);
    if (!tm) throw new Error('qism/build-prac.mjs: нет lessonTitle в META');
    src = src.replace(tm[0], () => `lessonTitle: {\n    uz: ${q(P.title.uz)},\n    ru: ${q(P.title.ru)},\n    en: ${q(P.title.en)}\n  }`);
    src = src.replace(/\/\*@FILE:([^@]+)@\*\//g, (m, p) => {
      p = p.trim();
      if (p === conf.screens) return `/*@FILE:p${k}-screens.jsx@*/`;
      if (p === conf.css) return `/*@FILE:p${k}.css@*/`;
      return '/*@FILE:' + (p.startsWith('gen/') ? p.slice(4) : '../' + p) + '@*/';
    });
    src = `// СГЕНЕРИРОВАНО tools/qism/build-prac.mjs (практика ${Number(NN)} курса HTML, часть ${k}) — не править руками.\n` + src;
    const srcOut = join(gen, `p${k}.src.jsx`);
    writeFileSync(srcOut, src);
    execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, out)], { stdio: 'inherit' });
    console.log('  → ' + relative(root, join(root, out)));
  });
}
