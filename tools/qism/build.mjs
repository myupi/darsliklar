// Уроки HTML 2–8 двумя частями (заказчик, 26.11.2026: «теперь делим html так как планировали»; урок 1 — так же,
// tools/redaktor28/build-qism.mjs, 25.11.2026). Номер урока не меняется: части — NNq1 и NNq2 под своим уроком.
//
//   node tools/qism/build.mjs <NN>[,<NN>…]|all
//     → lessons/html/<NN>q1-<slug>.jsx, <NN>q2-<slug>.jsx
//
// Части собираются из тех же экранов, что и целый урок (его build.mjs --gen-only кладёт общий набор в gen/), только
// со своим списком экранов, своим META и двумя новыми экранами:
//   часть 1 — экраны с начала урока + E1 (вывод части: разгадка загадки или итог, интрига — что дальше);
//   часть 2 — H2 (крючок: что было в части 1 и вопрос ученику) + остальные экраны урока.
// E1 и H2 строятся из S15 урока (страница, роли, подсветка за речью) — builder берёт код S15 и переименовывает;
// различия урока — в конфиге tools/qism/conf/<NN>.mjs (правки кода e1Edits/h2Edits, тексты e1/h2, s1Done).
// Загадка уроков: задаётся в S1 части 1; если её разгадка — на материале части 1, то решается в E1, а в S15 части 2
// первая реплика (разгадка) убирается (riddleInE1: true). Иначе (урок 6) загадка задаётся в H2, а S1 части 1 её не загадывает.
//
// Конфиг урока (default export):
//   { dir, src, screens, css?, slug, lessonTitleParts: [{uz,ru,en}, {uz,ru,en}],
//     parts: [{ screens: "…" }, { screens: "…" }],     // список экранов (код массива SCREENS) каждой части
//     riddleInE1: true|false,
//     s15Drop: ['k', …],   // ключи реплик итогового экрана, которые часть 2 не повторяет (CSS 8: 'riddle2' — круг из квадрата)
//     s1Done: { uz: [[from, to]], ru: [...], en: [...] } | null,   // правка S1.done части 1 («в этой части…»)
//     s1Riddle: null | { uz, ru, en },                              // (урок 6) убрать загадку из S1.done части 1 — новый текст
//     e1: { eyebrow, ask, next, say: [{ text: L3(…), k }] },        // тексты — строкой JS (код L3(…))
//     h2: { eyebrow, ask, say: [...] },
//     e1Edits: [[from, to]], h2Edits: [[from, to]],                 // правки кода, выведенного из S15 (ровно одно совпадение)
//     css?: string }
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('qism/build.mjs: не найдено ровно одно место — ' + what + ' («' + String(from).slice(0, 80) + '»)');
  return s.replace(from, () => to);
};

// node tools/qism/build.mjs <NN>[,<NN>]|all [css] — курс по умолчанию html (конфиги conf/), css — конфиги conf-css/ (27.11.2026).
const COURSE = process.argv[3] || 'html';
const confDir = join(here, COURSE === 'html' ? 'conf' : 'conf-' + COURSE);
const arg = process.argv[2];
if (!arg) { console.error('node tools/qism/build.mjs <NN>[,<NN>]|all'); process.exit(1); }
const nums = arg === 'all'
  ? readdirSync(confDir).filter((f) => /^\d\d\.mjs$/.test(f)).map((f) => f.slice(0, 2)).sort()
  : arg.split(',').map((x) => x.padStart(2, '0'));

// Код S15 урока (функция целиком) — основа E1 и H2.
function s15Source(scr, fn = 'S15') {
  const a = scr.indexOf('function ' + fn + '(');
  if (a < 0) throw new Error('qism/build.mjs: в экранах нет function ' + fn);
  const b = scr.indexOf('\n}\n', a);
  return scr.slice(a, b + 3);
}
const poseRe = /pose: i === c\.say\.length - 1 \? 'celebrate' : i === 0 \? '(\w+)' : 'point'/;
const nextRe = /<span>\{pick\(UI\.nextLesson\)\}: <b>\{pick\(UI\.next\)\}<\/b><\/span>/;
const navRe = /nav=\{<><BackBtn onPrev=\{p\.prev\} \/><NextBtn disabled=\{!canGo\} onClick=\{p\.finish\} label=\{UI\.finish\} \/><\/>\}/;

function deriveE1(s15, edits, fn = 'S15') {
  let s = must(s15, 'function ' + fn + '(', 'function E1(', 'E1: имя');
  s = must(s, 'const c = C.' + fn.toLowerCase() + ';', 'const c = C.e1;', 'E1: тексты');
  if (!poseRe.test(s)) throw new Error('qism: в S15 нет ожидаемой строки поз');
  s = s.replace(poseRe, (m, p0) => `pose: i === c.say.length - 1 ? 'curious' : i === 0 ? '${p0}' : 'point'`);
  if (!nextRe.test(s)) throw new Error('qism: в S15 нет строки «Следующий урок»');
  s = s.replace(nextRe, '<span><b>{pick(c.next)}</b></span>');
  for (const [from, to] of edits || []) s = must(s, from, to, 'E1-правка');
  return s;
}
function deriveH2(s15, edits, fn = 'S15') {
  let s = must(s15, 'function ' + fn + '(', 'function H2(', 'H2: имя');
  s = must(s, 'const c = C.' + fn.toLowerCase() + ';', 'const c = C.h2;', 'H2: тексты');
  if (!poseRe.test(s)) throw new Error('qism: в S15 нет ожидаемой строки поз');
  s = s.replace(poseRe, () => "pose: i === 0 ? 'hello' : i === c.say.length - 1 ? 'curious' : 'wonder'");
  s = must(s, "  useEffect(() => { const t = setTimeout(() => celebrate(), 900); return () => clearTimeout(t); }, []);\n", '', 'H2: без салюта');
  if (!navRe.test(s)) throw new Error('qism: в S15 нет ожидаемой навигации');
  s = s.replace(navRe, 'nav={navOf(p, canGo)}');
  s = s.replace(/\n\s*<div className="kz-next">.*<\/div>(?=\n)/, '');
  s = s.replace(/(<Sheet[^>]*>)\n/, '$1\n        <KzAsk text={c.ask} />\n');
  for (const [from, to] of edits || []) s = must(s, from, to, 'H2-правка');
  return s;
}

const q = (s) => JSON.stringify(s);
const L3js = (o) => `L3(${q(o.uz)}, ${q(o.ru)}, ${q(o.en)})`;

for (const NN of nums) {
  const conf = (await import(pathToFileURL(join(confDir, NN + '.mjs')).href)).default;
  const dir = join(root, conf.dir);
  const gen = join(dir, 'gen');
  // Свежий gen/ целого урока (без сборки самого урока).
  execFileSync('node', [join(dir, 'build.mjs'), '--gen-only'], { stdio: 'inherit' });

  const srcRaw = readFileSync(join(dir, conf.src), 'utf8');
  const scrRaw = readFileSync(join(dir, conf.screens), 'utf8');
  const cssRaw = conf.cssFile ? readFileSync(join(dir, conf.cssFile), 'utf8') : '';
  const course = conf.course || COURSE;          // курс: html (по умолчанию) или css
  const fn = conf.achievement || 'S15';          // функция итогового экрана (у урока 2 CSS — S12)
  const s15 = s15Source(scrRaw, fn);
  const E1 = deriveE1(s15, conf.e1Edits, fn);
  const H2 = deriveH2(s15, conf.h2Edits, fn);

  const textBlock = (name, o) => `  ${name}: {
    eyebrow: ${L3js(o.eyebrow)},
    ask: ${L3js(o.ask)},${o.next ? `\n    next: ${L3js(o.next)},` : ''}${o.roles ? '\n    roles: C.' + fn.toLowerCase() + '.roles,' : ''}
    say: [
${o.say.map((x) => `      { text: ${L3js(x.text)}, k: ${x.k ? q(x.k) : 'null'} }`).join(',\n')}
    ]
  }`;

  conf.parts.forEach((P, idx) => {
    const k = idx + 1;
    const out = `lessons/${course}/${NN}q${k}-${conf.slug}.jsx`;
    const lessonId = conf.lessonId.replace(/^((?:html|css)-\d\d)-/, `$1q${k}-`);
    const part1 = k === 1;

    // Тексты: новые экраны своей части + правки существующих.
    let texts = `\n// ── Урок ${Number(NN)} частями (tools/qism/build.mjs, 26.11.2026): ${part1 ? 'вывод части 1' : 'крючок части 2'}. ──\n`;
    texts += 'Object.assign(C, {\n' + (part1 ? textBlock('e1', conf.e1) : textBlock('h2', conf.h2)) + '\n});\n';
    if (part1 && conf.s1Done) {
      texts += '{\n  const d = C.s1.done;\n  const fix = (s, pairs) => pairs.reduce((a, [f, t]) => { if (!a.includes(f)) throw new Error("qism: нет фрагмента в s1.done: " + f); return a.split(f).join(t); }, s);\n';
      texts += `  C.s1.done = L3(fix(d.uz, ${q(conf.s1Done.uz || [])}), fix(d.ru, ${q(conf.s1Done.ru || [])}), fix(d.en, ${q(conf.s1Done.en || [])}));\n}\n`;
      for (const l of ['uz', 'ru', 'en']) for (const [f] of conf.s1Done[l] || []) if (!srcRaw.includes(f)) throw new Error(`qism ${NN}: в исходнике нет фрагмента s1.done (${l}): ${f}`);
    }
    if (part1 && conf.s1Riddle) {
      texts += `C.s1.done = ${L3js(conf.s1Riddle)};\n`;
    }
    if (!part1 && conf.riddleInE1) texts += 'C.' + fn.toLowerCase() + '.say = C.' + fn.toLowerCase() + '.say.slice(1);   // разгадка загадки — в выводе части 1\n';
    if (!part1 && conf.s15Drop) texts += `C.${fn.toLowerCase()}.say = C.${fn.toLowerCase()}.say.filter((x) => !${JSON.stringify(conf.s15Drop)}.includes(x.k));   // реплики итога, уже показанные в выводе части 1\n`;

    // Экраны: список своей части + E1 или H2 перед реестром.
    let scr = scrRaw;
    const a = scr.indexOf('const SCREENS = [');
    const b = scr.indexOf('];', a);
    if (a < 0 || b < 0) throw new Error('qism: нет const SCREENS в ' + conf.screens);
    scr = scr.slice(0, a) + 'const SCREENS = [\n  ' + conf.parts[idx].screens + '\n' + scr.slice(b);
    if (!part1 && conf.riddleInE1) {
      // Первая реплика S15 (разгадка) убрана — первая оставшаяся звучит не «смущённо».
      const a15 = scr.indexOf('function ' + fn + '(');
      const b15 = scr.indexOf('\n}\n', a15);
      let f15 = scr.slice(a15, b15 + 3);
      if (!/i === 0 \? '(?:embarrassed|wonder)' : 'point'/.test(f15)) throw new Error('qism: в S15 нет ожидаемой позы первой реплики');
      f15 = f15.replace(/i === 0 \? '(?:embarrassed|wonder)' : 'point'/, "i === 0 ? 'wonder' : 'point'");
      scr = scr.slice(0, a15) + f15 + scr.slice(b15 + 3);
    }
    const mark = '// =============================================================================\n// РЕЕСТР И КОРЕНЬ';
    scr = must(scr, mark, `${texts}\n// =============================================================================\n// ${part1 ? 'E1. ВЫВОД ЧАСТИ 1' : 'H2. КРЮЧОК ЧАСТИ 2'} (tools/qism/build.mjs; построен из S15 этого урока)\n// =============================================================================\n${part1 ? E1 : H2}\n${mark}`, 'реестр');
    // textFixes — замены в текстах урока для частей (ссылки на номера старых уроков: «девятого урока» и т. п.
    // после деления номера сквозные): [[from, to]] — применяются к экранам и исходнику; каждая должна найтись.
    let srcFixed = srcRaw;
    for (const [from, to] of conf.textFixes || []) {
      const inScr = scr.includes(from), inSrc = srcFixed.includes(from);
      if (!inScr && !inSrc) throw new Error('qism: textFixes — нет фрагмента: ' + from);
      scr = scr.split(from).join(to); srcFixed = srcFixed.split(from).join(to);
    }
    writeFileSync(join(gen, `q${k}-screens.jsx`), scr);

    // CSS: свой (при необходимости) — дописывается к CSS урока.
    const cssName = conf.cssFile ? `q${k}.css` : null;
    if (cssName) writeFileSync(join(gen, cssName), cssRaw + (conf.css ? '\n' + conf.css : ''));

    let src = srcFixed;
    src = must(src, /lessonId: '[^']+'/.exec(src)[0], `lessonId: '${lessonId}'`, 'lessonId');
    const tm = /lessonTitle: \{\s*uz: [^\n]*\n\s*ru: [^\n]*\n\s*en: [^\n]*\n\s*\}/.exec(src);
    if (!tm) throw new Error('qism: нет lessonTitle в META');
    const T = conf.lessonTitleParts[idx];
    src = src.replace(tm[0], () => `lessonTitle: {\n    uz: ${q(T.uz)},\n    ru: ${q(T.ru)},\n    en: ${q(T.en)}\n  }`);
    src = must(src, `/*@FILE:${conf.screens}@*/`, `/*@FILE:q${k}-screens.jsx@*/`, 'screens');
    if (cssName) src = must(src, `/*@FILE:${conf.cssFile}@*/`, `/*@FILE:${cssName}@*/`, 'css');
    // Исходник кладём в gen/ — пути включений считаются от его папки.
    src = src.replace(/\/\*@FILE:([^@]+)@\*\//g, (m, p) => {
      p = p.trim();
      if (p === `q${k}-screens.jsx` || p === cssName) return m;
      return '/*@FILE:' + (p.startsWith('gen/') ? p.slice(4) : '../' + p) + '@*/';
    });
    src = `// СГЕНЕРИРОВАНО tools/qism/build.mjs (урок ${Number(NN)} курса ${course.toUpperCase()}, часть ${k}) — не править руками.\n` + src;
    const srcOut = join(gen, `q${k}.src.jsx`);
    writeFileSync(srcOut, src);
    execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, out)].concat(course === 'html' ? [] : [course]), { stdio: 'inherit' });
  });
}
