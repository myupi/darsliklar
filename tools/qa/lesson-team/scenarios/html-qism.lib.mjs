// Общее для сценариев уроков HTML 2–8 частями (NNq1, NNq2; tools/qism/build.mjs, 26.11.2026): шаги и ветки целого
// урока (html-NN-<slug>.qa.mjs), разделённые по частям, с пересчётом номеров экранов.
//
//   qismPair(BASE, { k, split, file, title })
//     BASE  — сценарий целого урока (default export html-NN-<slug>.qa.mjs);
//     k     — часть (1 или 2);
//     split — сколько экранов целого урока (с нуля) в части 1: экраны 0…split-1 — часть 1, дальше — часть 2;
//     file  — файл части для плеера (например, 'html/03q1-spiski').
// Часть 1 = шаги экранов 0…split-1 + E1 (вывод части: ждём «Завершить» и один onFinished);
// часть 2 = H2 (крючок: ждём «Дальше») + шаги экранов split… (включая «завершение один раз» с артефактом).
const e1Steps = [
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.q('.kz-s15'), 10000, 'экран вывода части');
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, '«Завершить»: Коди договорил');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
  } }
];
const h2Step = {
  name: 'h2: крючок части 2', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.kz-s15'), 10000, 'экран-крючок части');
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, '«Дальше»: Коди договорил');
  }
};

// patch — правки шагов целого урока для части (когда разгадка загадки перенесена в вывод части 1, шаг s15 части 2
// не должен её ждать): [{ step: 'имя шага', from: 'фрагмент кода', to: '' }] — замена в тексте функции шага.
const patchStep = (st, patches) => {
  const ps = (patches || []).filter((x) => st.name === x.step);
  if (!ps.length) return st;
  let src = String(st.run);
  for (const x of ps) {
    if (!src.includes(x.from)) throw new Error('qismPair: в шаге «' + st.name + '» нет фрагмента: ' + x.from);
    src = src.replace(x.from, x.to || '');
  }
  return { ...st, run: (0, eval)('(' + src + ')') };
};

export function qismPair(BASE, { k, split, file, title, patch }) {
  const total = BASE.screens;
  const inPart = (s) => (k === 1 ? s < split : s >= split);
  const shift = (s) => (k === 1 ? s : s - split + 1);
  const steps = k === 1
    ? BASE.steps.slice(0, split).concat(e1Steps)
    : [h2Step].concat(BASE.steps.slice(split).map((st) => patchStep(st, patch)));
  const flows = (BASE.flows || []).filter((f) => inPart(f.start)).map((f) => ({ ...f, start: shift(f.start) }));
  const inputScreens = (BASE.inputScreens || []).filter(inPart).map(shift);
  return {
    ...BASE,
    title,
    file,
    screens: k === 1 ? split + 1 : total - split + 1,
    inputScreens,
    steps,
    flows
  };
}
