// Сборка тестов модуля «ИИ» (13.11.2026): node tools/aitest/build.mjs [NN|all]
// Вопросы урока — tools/aitest/lNN.jsx (const QS = [5 вопросов], SLUG); набор — kit.jsx. Каждый вопрос — свой файл
// lessons/ai/NNtK-<slug>.jsx (K = 1…5): импорт react, набор, вопросы урока и export default с вопросом K.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const kit = readFileSync(join(here, 'kit.jsx'), 'utf8');
const want = process.argv[2] || 'all';
const files = readdirSync(here).filter((f) => /^l\d\d\.jsx$/.test(f)).filter((f) => want === 'all' || f === 'l' + want.padStart(2, '0') + '.jsx');
for (const f of files) {
  const nn = f.slice(1, 3);
  const src = readFileSync(join(here, f), 'utf8');
  const slug = /const SLUG = '([^']+)'/.exec(src)[1];
  const n = (src.match(/^\s*\{ id: /gm) || []).length;
  for (let k = 1; k <= n; k += 1) {
    const out = `// Тест ${k}/${n} к уроку ${+nn} модуля «ИИ» — один вопрос в формате CRM «JSX savol / test» (13.11.2026).
// Собрано: node tools/aitest/build.mjs ${nn} — вручную не править; исходник — tools/aitest/${f}, набор — tools/aitest/kit.jsx.
import React, { useEffect, useRef, useState } from 'react';
${kit}
${src}
export default function AiTest${nn}q${k}(props) { return <AqTest Q={QS[${k - 1}]} {...props} />; }
`;
    const path = join(root, 'lessons/ai', `${nn}t${k}-${slug}.jsx`);
    writeFileSync(path, out);
    console.log('Собран', path.replace(root + '/', ''));
  }
}
