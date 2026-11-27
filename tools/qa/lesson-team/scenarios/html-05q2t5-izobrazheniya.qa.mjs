// Сценарий проверки теста 5/5 к уроку 10 курса HTML lessons/html/05q2t5-izobrazheniya.jsx.
// Собрано: node tools/webtest/mkqa.mjs html 10 — вручную не править. Верный ответ.
const AF = Object.getPrototypeOf(async function () {}).constructor;
const step = (name, body, shot) => ({ name, shot: shot === undefined ? name.split(':')[0] + '-done' : shot, run: new AF('qa', body) });
const STEPS = [
  step('вопрос: выбор и «Tekshirish»', `
    await qa.waitFor(() => qa.q('.aq-opt[data-v="2"]'), 30000, 'варианты');
    qa.expect(!!qa.q('.quiz-shell-check:disabled'), '«Tekshirish» платформы закрыта до выбора');
    await qa.click('.aq-opt[data-v="2"]', 'вариант C');
    await qa.waitFor(() => qa.q('.quiz-shell-check:not(:disabled)'), 5000, '«Tekshirish» открылась (onReady)');
    qa.expect(!qa.qa('.aq button').some((b) => !b.matches('.aq-opt') && !b.closest('.aq-doc')), 'своей кнопки у теста нет');
    await qa.click('.quiz-shell-check', 'Tekshirish');
    await qa.waitFor(() => qa.q('.aq-fb'), 5000, 'ответ засчитан');
    qa.expect(!!qa.q('.aq-fb.is-ok') && !!qa.q('.aq-opt[data-v="2"].is-ok'), '«Barakalla!», вариант зелёный');
    qa.expect(qa.qa('.aq-opt:not(:disabled)').length === 0, 'вторая попытка невозможна');`),
  step('завершение один раз', `
    await qa.waitFor(() => qa.q('.quiz-shell-next'), 5000, '«Keyingisi» платформы'); await qa.click('.quiz-shell-next', 'Keyingisi');
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished'); await qa.sleep(800);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.meta && pl.meta.target === 'html-05q2' && pl.meta.ptype === 'HTML' && pl.correct === true && pl.test && pl.test.score === 1 && pl.test.max === 1, 'оценка в payload', { pl });`, null)
];
export default {
  title: 'Тест 5/5 к уроку 10 курса HTML', file: 'html/05q2t5-izobrazheniya', adapter: 'basic', langs: ['uz'],
  size: process.env.QA_SIZE || '375x740', voice: 'fast', expectFinish: true,
  data: { ru: {}, uz: {}, en: {} }, steps: STEPS, flows: []
};
