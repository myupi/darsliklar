// Урок 1 курса HTML, часть 1 «тег, head и title» (lessons/html/01q1-struktura-dokumenta.jsx; сборка
// tools/redaktor28/build-qism.mjs): экраны s1…s7 целого урока + e1 (вывод части, окно пустое, body — «?»).
import { BASE, flowsOf } from './html-01q-parts.lib.mjs';

const STEPS = BASE.steps.slice(0, 7).concat([
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.q('.kz-qism .kz-role.is-q'), 10000, 'роль body — вопрос');
    qa.expect(!qa.q('.kz-qism .kz-col-text'), 'окно пустое: текста в body нет');
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить урок»');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<title>' + qa.data.myTitle + '</title>') >= 0, 'артефакт — своё название страницы', { html });
    const ans = (pl && pl.answers) || [];
    qa.expect(ans.filter((e) => e.screenId === 's7').length === 1, 'засчёт s7 — один раз');
  } }
]);

export default {
  ...BASE,
  title: 'Урок 1 курса HTML, часть 1 «тег, head и title»',
  file: 'html/01q1-struktura-dokumenta',
  screens: 8,
  inputScreens: [4, 7],
  steps: STEPS,
  flows: flowsOf(1)
};
