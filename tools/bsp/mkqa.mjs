// Автопроверки практик модуля Bootstrap (21.11.2026; та же форма, что у каркаса cssp — tools/cssp/mkqa.mjs).
//   node tools/bsp/mkqa.mjs 01 | all   → tools/qa/lesson-team/scenarios/bootstrap-NNp-<slug>.qa.mjs
// Ответы заданий страница отдаёт в data-qa у .cp-work (a — ответ, d — ответ дополнительной задачи), поэтому
// основной путь одинаков на трёх языках. Шаги выполняются в странице (помощники — внутри шага).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const course = readFileSync(join(root, 'lessons/bootstrap/_course.js'), 'utf8');
const slugOf = (n) => { const m = new RegExp('n:\\s*' + n + ',\\s*slug:\\s*\'([^\']+)\'').exec(course); return m ? m[1] : null; };
const arg = process.argv[2] || 'all';
const list = arg === 'all' ? readdirSync(here).filter((f) => /^p\d\d\.jsx$/.test(f)).map((f) => f.slice(1, 3)) : [String(arg).padStart(2, '0')];

// Задания 1–2 (и их дополнительные) — с рамкой в строке (.cp-gap textarea): ответ рамки — d.s / d.ds.
const H = `const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');`;

for (const nn of list) {
  const n = Number(nn);
  const slug = slugOf(n);
  const file = 'bootstrap/' + nn + 'p-' + slug;
  const task = (k) => `  { name: 't${k}: задание ${k}', shot: 't${k}-done', run: async (qa) => {
    ${H}
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
    qa.expect(qa.qa('.cp-tab.is-ok').length === ${k - 1}, 'горят вкладки решённых заданий');
    const d = qd(qa);
    ${k <= 2 ? `qa.expect(!!d.s && !!qa.q('.cp-gap textarea'), 'рамка в строке на месте');` : ''}
    qa.type(ED(), d.s || d.a, 'ответ');
    await qa.sleep(400);
    ${k === 5 ? `qa.expect(!qa.q('.cp-li') || qa.qa('.cp-li.is-ok').length === qa.qa('.cp-li').length, 'условия «готово» загорелись');` : ''}
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },`;
  const flow = (k) => `    { name: 't${k}: русские буквы, пусто, три ступени, образец${k < 5 ? ', дополнительная задача' : ''}', start: ${k}, langs: ['ru'], steps: [{ name: 't${k}: ветки', run: async (qa) => {
      ${H}
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
      const d = qd(qa);
      const A = d.s || d.a;
      qa.type(ED(), cyr(A), 'русские буквы'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err') && /EN/.test(qa.text('.b-sheet')), 3000, 'причина: русские буквы');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
      qa.type(ED(), '', 'пусто'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /пусто/i.test(qa.text('.b-sheet')), 3000, 'причина: пусто (вторая неудача — со ступенью подсказки)');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(350); }
      await qa.waitFor(() => qa.q('.cp-sample'), 3000, 'образец третьей ступени');
      qa.type(ED(), A, 'ответ'); await qa.click('.key-go', 'Проверить');
      ${k < 5 ? `if (d.d) {
        await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 4000, 'дополнительная задача');
        qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
        await qa.sleep(300);
        qa.type(ED(), d.ds || d.d, 'ответ дополнительной'); await qa.click('.key-go', 'Проверить');
      }` : ''}
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] },`;
  const src = `// Автопроверка практики к уроку ${n} модуля Bootstrap lessons/${file}.jsx (каркас bsp, 21.11.2026; собрано tools/bsp/mkqa.mjs).
// Основной путь: 7 слайдов действиями ученика — сбой, пять заданий (ответы — из data-qa страницы; в заданиях 1–2 —
// в рамку строки), вывод; onFinished
// один раз, артефакт — своя страница. Ветки на каждом задании: русские буквы → причина, пусто → причина и ступень
// подсказки, лампочка до образца, дополнительная задача; «Назад» хранит код.

const STEPS = [
  { name: 's1: сбой — строка link пропала, вкладки гаснут', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.cp-tab.is-ok').length === 4, 'до сбоя вкладки горят');
    await qa.click('.cp-refresh', 'Обновить');
    await qa.waitFor(() => qa.qa('.cp-tab.is-off').length === 4, 5000, 'вкладки погасли');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
${[1, 2, 3, 4, 5].map(task).join('\n')}
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.cp-tab.is-ok').length === 4 && !qa.q('.cp-fav.is-off'), 'все пять вкладок горят');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'bootstrap-page' && /bootstrap\.min\.css/.test(a.html) && /<body>[\\s\\S]*class="/.test(a.html), 'артефакт — своя страница ученика на Bootstrap', { a });
  } }
];
export default {
  title: 'Практика к уроку ${n} модуля Bootstrap (каркас bsp)',
  file: '${file}',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 5, 6],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
${[1, 2, 3, 4, 5].map(flow).join('\n')}
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад', run: async (qa) => {
      ${H}
      await qa.platform.ready();
      const d1 = qd(qa);
      qa.type(ED(), d1.s || d1.a, 'ответ т1'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор т2');
      qa.type(ED(), 'alert the', 'начало записи'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор т2 снова');
      qa.expect(/alert the/.test(qa.q(ED()).value), 'запись на месте после «Назад»');
      qa.expect(qa.qa('.cp-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');
    } }] }
  ]
};
`;
  writeFileSync(join(root, 'tools/qa/lesson-team/scenarios/bootstrap-' + nn + 'p-' + slug + '.qa.mjs'), src);
  console.log('bootstrap-' + nn + 'p-' + slug + '.qa.mjs');
}
