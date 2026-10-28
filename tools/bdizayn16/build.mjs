// Сборка тестового урока 16 «B · O'yin» (28.10.2026): урок 1 «Бумажная страница»
// как есть (исходники tools/kollazh/ — каждый раз свежие, правки урока 1 доезжают
// сами) + рамка B · O'yin (b16-chrome.jsx, b16.css).
//   node tools/bdizayn16/build.mjs
// Что меняется при сборке (в копиях в tools/bdizayn16/gen/, исходники урока 1 не
// трогаются):
//   · META — свой id и название;
//   · экраны рисуют StageB вместо Stage канона;
//   · KzAsk сообщает рамке текст задания и подсказку и показывает на листе только
//     задание (подсказка и причина ошибки — в панели «Maslahat» снизу);
//   · к CSS урока добавляется b16.css.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const L1 = join(root, 'tools/kollazh');
const gen = join(here, 'gen');
mkdirSync(gen, { recursive: true });

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('build.mjs: не найдено ровно одно место — ' + what);
  return s.replace(from, to);
};

// Файлы урока 1 → gen/ (с правками рамки)
for (const f of readdirSync(L1)) {
  if (!/^kollazh.*\.(jsx|css)$/.test(f) || f === 'kollazh.src.jsx') continue;
  let s = readFileSync(join(L1, f), 'utf8');
  if (f === 'kollazh-screens.jsx') {
    s = s.replace(/<Stage(\s)/g, '<StageB$1').replace(/<\/Stage>/g, '</StageB>');
  }
  if (f === 'kollazh-kit.jsx') {
    s = must(s,
      "function KzAsk({ text, hint, n }) {\n  const pick = usePick();\n  return (\n    <div className=\"kz-ask-wrap\">\n      <p className={'kz-ask' + (hint ? ' is-hint' : '')} aria-live=\"polite\">\n        {n ? <span className=\"kz-ask-n\">{n}</span> : null}{pick(hint || text)}",
      "function KzAsk({ text, hint, n }) {\n  const pick = usePick();\n  // Рамка B · O'yin: подсказка — в панели «Maslahat», на листе — задание.\n  const ts = text ? pick(text) : '', hs = hint ? pick(hint) : '';\n  useEffect(() => { if (_bAskSet) _bAskSet({ text: ts, hint: hs }); }, [ts, hs]);\n  return (\n    <div className=\"kz-ask-wrap\">\n      <p className=\"kz-ask\" aria-live=\"polite\">\n        {n ? <span className=\"kz-ask-n\">{n}</span> : null}{ts}",
      'KzAsk');
  }
  writeFileSync(join(gen, f), s);
}

// Исходник урока
let src = readFileSync(join(L1, 'kollazh.src.jsx'), 'utf8');
src = must(src, "lessonId: 'html-01-struktura-dokumenta'", "lessonId: 'test-16-b-oyin'", 'lessonId');
src = must(src, "uz: '1-dars. HTML hujjatining tuzilishi',\n    ru: 'Урок 1. Структура HTML-документа',\n    en: 'Lesson 1. HTML document structure'",
  "uz: '16. B · O‘yin dizayni (1-dars)',\n    ru: '16. Дизайн «B · O‘yin» (урок 1)',\n    en: '16. “B · O‘yin” design (lesson 1)'", 'lessonTitle');
src = must(src, '/*@FILE:kollazh-paper-data.jsx@*/', '/*@FILE:../b16-chrome.jsx@*/\n\n/*@FILE:kollazh-paper-data.jsx@*/', 'chrome');
src = must(src, '/*@FILE:kollazh.css@*/', '/*@FILE:kollazh.css@*/\n/*@FILE:../b16.css@*/', 'css');
src = '// СГЕНЕРИРОВАНО tools/bdizayn16/build.mjs из tools/kollazh/ — не править руками.\n' + src;
const srcOut = join(gen, 'b16.src.jsx');
writeFileSync(srcOut, src);

execFileSync('node', [join(root, '.claude/skills/novyy-urok/scripts/sobrat.mjs'), srcOut, join(root, 'lessons/test/16-b-oyin.jsx')], { stdio: 'inherit' });
