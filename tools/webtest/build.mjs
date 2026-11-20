// Сборка тестов курсов HTML и CSS (16.11.2026): node tools/webtest/build.mjs <html|css|bootstrap|all> [NN|all]
// Вопросы урока — tools/webtest/<курс>/lNN.jsx (const SLUG, const QS = [5 вопросов]); набор — tools/aitest/kit.jsx
// (AqTest, окно Chrome, облик Quiz CoddyCamp) + tools/webtest/web-kit.jsx (редактор кода и честная страница WqVis).
// Каждый вопрос — свой файл lessons/<курс>/NNtK-<slug>.jsx (K = 1…5), как тесты модуля «ИИ».
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const kit = readFileSync(join(here, '../aitest/kit.jsx'), 'utf8');
const web = readFileSync(join(here, 'web-kit.jsx'), 'utf8');
// Модуль Bootstrap (20.11.2026): страница вопроса — с настоящим CSS Bootstrap 6.0.0-alpha.1 (как в уроках, tools/bs1/build.mjs);
// «//» в строке записан кодом — иначе валидатор принял бы его за комментарий.
const bsCss = () => '// Bootstrap v6.0.0-alpha.1 (MIT, getbootstrap.com) — bootstrap.min.css, встраивается сборкой.\nconst BS_CSS = '
  + JSON.stringify(readFileSync(join(root, 'tools/bootstrap/vendor/bootstrap-6.0.0-alpha.1.min.css'), 'utf8').replace(/\/\*# sourceMappingURL=[^*]*\*\/\s*$/, '')).split('http://').join('http:\\u002F\\u002F').split('https://').join('https:\\u002F\\u002F') + ';\n';
const NAME = { html: 'HTML', css: 'CSS', bootstrap: 'Bootstrap' };
const wantCourse = process.argv[2] || 'all';
const want = process.argv[3] || 'all';
for (const course of ['html', 'css', 'bootstrap'].filter((c) => wantCourse === 'all' || wantCourse === c)) {
  const dir = join(here, course);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => /^l\d\d\.jsx$/.test(f)).filter((f) => want === 'all' || f === 'l' + want.padStart(2, '0') + '.jsx');
  for (const f of files) {
    const nn = f.slice(1, 3);
    const src = readFileSync(join(dir, f), 'utf8');
    const slug = /const SLUG = '([^']+)'/.exec(src)[1];
    const n = (src.match(/^\s*\{ id: /gm) || []).length;
    for (let k = 1; k <= n; k += 1) {
      const out = `// Тест ${k}/${n} к уроку ${+nn} курса ${NAME[course]} — один вопрос в формате CRM «JSX savol / test» (16.11.2026).
// Собрано: node tools/webtest/build.mjs ${course} ${nn} — вручную не править; исходник — tools/webtest/${course}/${f},
// набор — tools/aitest/kit.jsx и tools/webtest/web-kit.jsx.
import React, { useEffect, useRef, useState } from 'react';
${kit}
${web}
${course === 'bootstrap' ? bsCss() : ''}${src}
export default function ${NAME[course]}Test${nn}q${k}(props) { return <><style>{WQ_CSS}</style><AqTest Q={QS[${k - 1}]} {...props} /></>; }
`;
      const path = join(root, 'lessons', course, `${nn}t${k}-${slug}.jsx`);
      writeFileSync(path, out);
      console.log('Собран', path.replace(root + '/', ''));
    }
  }
}
