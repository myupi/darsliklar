// Урок 1 курса HTML, часть 2 «body и порядок документа» (lessons/html/01q2-struktura-dokumenta.jsx; сборка
// tools/redaktor28/build-qism.mjs): h2 (крючок: окно пустое) + экраны s9…s15 целого урока.
import { BASE, flowsOf } from './html-01q-parts.lib.mjs';

const STEPS = [
  { name: 'h2: крючок части 2 — окно пустое', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-qism .kz-role.is-q') && !qa.q('.kz-qism .kz-col-text'), 'body — вопрос, окно пустое');
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, 'Коди договорил, «Дальше» включилась');
  } }
].concat(BASE.steps.slice(7, 17), [
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf(qa.data.myText) >= 0 && html.indexOf(qa.data.draft) < 0, 'артефакт — своё приветствие', { html });
    const ans = (pl && pl.answers) || [];
    const n = (id) => ans.filter((e) => e.screenId === id).length;
    qa.expect(n('s10') === 1 && n('q1') === 1 && n('q2') === 1, 'события засчёта s10, q1, q2 — по одному', { s10: n('s10'), q1: n('q1'), q2: n('q2') });
  } }
]);

export default {
  ...BASE,
  title: 'Урок 1 курса HTML, часть 2 «body и порядок документа»',
  file: 'html/01q2-struktura-dokumenta',
  screens: 11,
  inputScreens: [3],
  // Своего названия из части 1 здесь нет: в title — «Мой сайт» (myTitle = site).
  data: Object.fromEntries(Object.entries(BASE.data).map(([l, d]) => [l, { ...d, myTitle: d.site }])),
  steps: STEPS,
  flows: flowsOf(2)
};
