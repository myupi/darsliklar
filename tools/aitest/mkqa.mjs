// Автопроверки тестов модуля «ИИ» (13.11.2026): node tools/aitest/mkqa.mjs [NN|all]
// На каждый файл lessons/ai/NNtK-<slug>.jsx — сценарий tools/qa/lesson-team/scenarios/ai-NNtK-<slug>.qa.mjs (адаптер basic).
// Кнопки «Tekshirish» / «Keyingisi» — эмуляции платформы (src/player/QuizShell.jsx), своей у теста нет.
// Нечётный K — верный ответ: «Barakalla!», зелёный вариант, onFinished один раз со score 1.
// Чётный K — неверный ответ: красный только выбранный, верный не раскрыт, «Maslahat», вторая попытка невозможна, score 0.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const want = process.argv[2] || 'all';
const files = readdirSync(here).filter((f) => /^l\d\d\.jsx$/.test(f)).filter((f) => want === 'all' || f === 'l' + want.padStart(2, '0') + '.jsx');
for (const f of files) {
  const nn = f.slice(1, 3);
  const src = readFileSync(join(here, f), 'utf8');
  const slug = /const SLUG = '([^']+)'/.exec(src)[1];
  const qs = [...src.matchAll(/^\s*\{ id: '([^']+)'.*?correct: (\d)/gm)].map((m) => ({ id: m[1], correct: +m[2] }));
  qs.forEach((q, i) => {
    const k = i + 1, good = k % 2 === 1, pick = good ? q.correct : (q.correct + 1) % 4;
    const out = `// Сценарий проверки теста ${k}/${qs.length} к уроку ${+nn} модуля «ИИ» lessons/ai/${nn}t${k}-${slug}.jsx.
// Собрано: node tools/aitest/mkqa.mjs ${nn} — вручную не править. ${good ? 'Верный ответ.' : 'Неверный ответ (одна попытка).'}
const AF = Object.getPrototypeOf(async function () {}).constructor;
const step = (name, body, shot) => ({ name, shot: shot === undefined ? name.split(':')[0] + '-done' : shot, run: new AF('qa', body) });
const STEPS = [
  step('вопрос: выбор и «Tekshirish»', \`
    await qa.waitFor(() => qa.q('.aq-opt[data-v="${pick}"]'), 30000, 'варианты');
    qa.expect(!!qa.q('.quiz-shell-check:disabled'), '«Tekshirish» платформы закрыта до выбора');
    await qa.click('.aq-opt[data-v="${pick}"]', 'вариант ${'ABCD'[pick]}');
    await qa.waitFor(() => qa.q('.quiz-shell-check:not(:disabled)'), 5000, '«Tekshirish» открылась (onReady)');
    qa.expect(!qa.q('.aq button:not(.aq-opt)'), 'своей кнопки у теста нет');
    await qa.click('.quiz-shell-check', 'Tekshirish');
    await qa.waitFor(() => qa.q('.aq-fb'), 5000, 'ответ засчитан');
    ${good
      ? `qa.expect(!!qa.q('.aq-fb.is-ok') && !!qa.q('.aq-opt[data-v="${pick}"].is-ok'), '«Barakalla!», вариант зелёный');`
      : `qa.expect(!!qa.q('.aq-fb.is-bad') && !!qa.q('.aq-opt[data-v="${pick}"].is-bad'), '«Maslahat», выбранный — красный');
    qa.expect(!qa.q('.aq-opt.is-ok'), 'верный вариант не раскрыт');`}
    qa.expect(qa.qa('.aq-opt:not(:disabled)').length === 0, 'вторая попытка невозможна');\`),
  step('завершение один раз', \`
    await qa.waitFor(() => qa.q('.quiz-shell-next'), 5000, '«Keyingisi» платформы'); await qa.click('.quiz-shell-next', 'Keyingisi');
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished'); await qa.sleep(800);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.meta && pl.meta.target === 'ai-${nn}' && pl.correct === ${good} && pl.test && pl.test.score === ${good ? 1 : 0} && pl.test.max === 1, 'оценка в payload', { pl });\`, null)
];
export default {
  title: 'Тест ${k}/${qs.length} к уроку ${+nn} модуля «ИИ»', file: 'ai/${nn}t${k}-${slug}', adapter: 'basic', langs: ['uz'],
  size: process.env.QA_SIZE || '375x740', voice: 'fast', expectFinish: true,
  data: { ru: {}, uz: {}, en: {} }, steps: STEPS, flows: []
};
`;
    const path = join(root, 'tools/qa/lesson-team/scenarios', `ai-${nn}t${k}-${slug}.qa.mjs`);
    writeFileSync(path, out);
    console.log('Записан', path.replace(root + '/', ''));
  });
}
