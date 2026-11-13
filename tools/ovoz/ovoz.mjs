// «Подготовленная озвучка JSX» для уроков и практик курсов HTML, CSS и «ИИ» (заказчик, 13.11.2026: «во всех уроках
// (html, css, ai) сделай так, на трёх языках»). Пишет в конец урока:
//   export const LESSON_AUDIO = { schema: 1, speeches: [{ id, lang, voiceId, text, required }] } — статический литерал;
//   const SPEECH_INDEX = { uz: { 'чистый текст': 'id' }, ru: {…}, en: {…} } — по нему движок канона находит запись.
// Реплики — tools/ovoz/collect.mjs (данные экранов, похвала, разборы) + найденные прогоном (tools/ovoz/extra/<урок>.json).
// Ограничений на число и длину реплик нет (заказчик, 13.11.2026). Голос — один на все языки (VOICE_ID).
//   node tools/ovoz/ovoz.mjs <файл.jsx>…  |  node tools/ovoz/ovoz.mjs all
// Сборщик уроков (sobrat.mjs) зовёт applyOvoz сам — после пересборки урока записи обновляются.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLesson, LANGS } from './collect.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
export const VOICE_ID = 'agoC45V78njTIxYzwmSb';   // заказчик, 13.11.2026: этот голос на все три языка
const START = '\n// ── ПОДГОТОВЛЕННАЯ ОЗВУЧКА (tools/ovoz/ovoz.mjs, не править вручную) ──';
const END = '// ── КОНЕЦ ПОДГОТОВЛЕННОЙ ОЗВУЧКИ ──\n';
export const COURSES = ['html', 'css', 'ai'];

const extraPath = (file) => join(here, 'extra', basename(dirname(file)) + '-' + basename(file, '.jsx') + '.json');
export function readExtra(file) {
  const p = extraPath(file);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
}
export function writeExtra(file, data) { writeFileSync(extraPath(file), JSON.stringify(data, null, 1) + '\n'); }

export function stripBlock(s) {
  const a = s.indexOf(START);
  if (a < 0) return s;
  const b = s.indexOf(END, a);
  if (b < 0) throw new Error('ovoz: начало блока есть, конца нет');
  return s.slice(0, a) + s.slice(b + END.length);
}

export async function applyOvoz(file, opts = {}) {
  const path = resolve(file);
  const src0 = readFileSync(path, 'utf8');
  if (src0.indexOf("from '@lesson/runtime'") < 0 || src0.indexOf('function speechIdsOf(') < 0) {
    throw new Error(file + ': в уроке старый канон (нет движка подготовленной озвучки) — сначала npm run canon');
  }
  let src = stripBlock(src0);
  // Подмена голоса браузера из облика «Редактор» (в исходнике убрана 13.11.2026) — в уже собранных уроках.
  const ua = src.indexOf("if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance === 'function' && !window.__b16Utt) {");
  if (ua >= 0) {
    const ub = src.indexOf('  };\n}\n', ua);
    const head = src.lastIndexOf('// Голос браузера (когда сервиса озвучки нет)', ua);
    src = src.slice(0, head >= 0 && ua - head < 300 ? head : ua) + "// Голоса браузера в уроке нет (подготовленная озвучка платформы, 13.11.2026).\n" + src.slice(ub + 6);
  }
  const got = await collectLesson(src, basename(file, '.jsx'));
  const extra = readExtra(path);
  const lit = (x) => JSON.stringify(x);
  const speeches = [];
  const index = {};
  for (const L of LANGS) {
    const rows = got[L].slice();
    const have = new Set(rows.map((r) => r.clean));
    (extra[L] || []).forEach((clean) => { if (!have.has(clean)) { have.add(clean); rows.push({ clean, text: got.mark(clean, L) }); } });
    index[L] = {};
    rows.forEach((r, i) => {
      const id = L + String(i + 1).padStart(3, '0');
      index[L][r.clean] = id;
      speeches.push({ id, lang: L, text: r.text });
    });
  }
  const counts = LANGS.map((L) => L + ' ' + Object.keys(index[L]).length).join(', ');
  const chars = speeches.reduce((n, x) => n + x.text.normalize('NFC').length, 0);
  const block = START + '\n' +
    '// Реплик: ' + counts + '; всего знаков ' + chars + '. Голос — ' + VOICE_ID + ' (один на все языки).\n' +
    'export const LESSON_AUDIO = {\n  schema: 1,\n  speeches: [\n' +
    speeches.map((x) => '    { id: ' + lit(x.id) + ', lang: ' + lit(x.lang) + ', voiceId: ' + lit(VOICE_ID) + ', text: ' + lit(x.text) + ', required: true },').join('\n') +
    '\n  ]\n};\n' +
    '// Чистый текст реплики (как его отдаёт урок) → id записи, по языкам.\n' +
    'const SPEECH_INDEX = {\n' + LANGS.map((L) => '  ' + L + ': {\n' + Object.keys(index[L]).map((c) => '    ' + lit(c) + ': ' + lit(index[L][c]) + ',').join('\n') + '\n  }').join(',\n') + '\n};\n' +
    END;
  const out = src.replace(/\n*$/, '\n') + block;
  const bad = out.match(/speechSynthesis|SpeechSynthesis|new Audio\b|[^\w.]fetch\(|\bimport\(|XMLHttpRequest|api\/tts/g);
  if (bad) throw new Error(file + ': остались запрещённые вызовы: ' + [...new Set(bad)].join(', '));
  if (!opts.dry) writeFileSync(path, out);
  return { file, counts, chars, total: speeches.length };
}

export function lessonFiles() {
  const out = [];
  for (const c of COURSES) {
    const dir = join(root, 'lessons', c);
    readdirSync(dir).filter((f) => /^\d\d(p)?-.+\.jsx$/.test(f)).sort().forEach((f) => out.push(join(dir, f)));
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('ovoz.mjs')) {
  const args = process.argv.slice(2);
  const files = args[0] === 'all' ? lessonFiles() : args.map((a) => resolve(a));
  let fail = 0;
  for (const f of files) {
    try { const r = await applyOvoz(f); console.log('✓ ' + f.replace(root + '/', '') + ': ' + r.counts + ' · ' + r.chars + ' знаков'); }
    catch (e) { fail += 1; console.log('✗ ' + f.replace(root + '/', '') + ': ' + e.message); }
  }
  process.exit(fail ? 1 : 0);
}
