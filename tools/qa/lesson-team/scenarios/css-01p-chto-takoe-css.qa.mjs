// Автопроверка практики к уроку 1 курса CSS lessons/css/01p-chto-takoe-css.jsx (каркас cssp, 09.11.2026; собрано tools/cssp/mkqa.mjs).
// Основной путь: 7 слайдов действиями ученика — сбой, пять заданий (ответы — из data-qa страницы; в заданиях 1–2 —
// в рамку строки), вывод; onFinished
// один раз, артефакт — своя страница. Ветки на каждом задании: русские буквы → причина, пусто → причина и ступень
// подсказки, лампочка до образца, дополнительная задача; «Назад» хранит код.

const STEPS = [
  { name: 's1: сбой — стили пропали, вкладки гаснут', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.cp-tab.is-ok').length === 4, 'до сбоя вкладки горят');
    await qa.click('.cp-refresh', 'Обновить');
    await qa.waitFor(() => qa.qa('.cp-tab.is-off').length === 4, 5000, 'вкладки погасли');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: задание 1', shot: 't1-done', run: async (qa) => {
    const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
    qa.expect(qa.qa('.cp-tab.is-ok').length === 0, 'горят вкладки решённых заданий');
    const d = qd(qa);
    qa.expect(!!d.s && !!qa.q('.cp-gap textarea'), 'рамка в строке на месте');
    qa.type(ED(), d.s || d.a, 'ответ');
    await qa.sleep(400);
    
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: задание 2', shot: 't2-done', run: async (qa) => {
    const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
    qa.expect(qa.qa('.cp-tab.is-ok').length === 1, 'горят вкладки решённых заданий');
    const d = qd(qa);
    qa.expect(!!d.s && !!qa.q('.cp-gap textarea'), 'рамка в строке на месте');
    qa.type(ED(), d.s || d.a, 'ответ');
    await qa.sleep(400);
    
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't3: задание 3', shot: 't3-done', run: async (qa) => {
    const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
    qa.expect(qa.qa('.cp-tab.is-ok').length === 2, 'горят вкладки решённых заданий');
    const d = qd(qa);
    
    qa.type(ED(), d.s || d.a, 'ответ');
    await qa.sleep(400);
    
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't4: задание 4', shot: 't4-done', run: async (qa) => {
    const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
    qa.expect(qa.qa('.cp-tab.is-ok').length === 3, 'горят вкладки решённых заданий');
    const d = qd(qa);
    
    qa.type(ED(), d.s || d.a, 'ответ');
    await qa.sleep(400);
    
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't5: задание 5', shot: 't5-done', run: async (qa) => {
    const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор');
    qa.expect(qa.qa('.cp-tab.is-ok').length === 4, 'горят вкладки решённых заданий');
    const d = qd(qa);
    
    qa.type(ED(), d.s || d.a, 'ответ');
    await qa.sleep(400);
    qa.expect(!qa.q('.cp-li') || qa.qa('.cp-li.is-ok').length === qa.qa('.cp-li').length, 'условия «готово» загорелись');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
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
    qa.expect(!!a && a.type === 'css-page' && !!a.css && /<style>/.test(a.html), 'артефакт — своя страница со стилями ученика', { a });
  } }
];
export default {
  title: 'Практика к уроку 1 курса CSS (каркас cssp)',
  file: 'css/01p-chto-takoe-css',
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
    { name: 't1: русские буквы, пусто, три ступени, образец, дополнительная задача', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
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
      if (d.d) {
        await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 4000, 'дополнительная задача');
        qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
        await qa.sleep(300);
        qa.type(ED(), d.ds || d.d, 'ответ дополнительной'); await qa.click('.key-go', 'Проверить');
      }
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] },
    { name: 't2: русские буквы, пусто, три ступени, образец, дополнительная задача', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
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
      if (d.d) {
        await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 4000, 'дополнительная задача');
        qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
        await qa.sleep(300);
        qa.type(ED(), d.ds || d.d, 'ответ дополнительной'); await qa.click('.key-go', 'Проверить');
      }
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] },
    { name: 't3: русские буквы, пусто, три ступени, образец, дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 't3: ветки', run: async (qa) => {
      const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
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
      if (d.d) {
        await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 4000, 'дополнительная задача');
        qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
        await qa.sleep(300);
        qa.type(ED(), d.ds || d.d, 'ответ дополнительной'); await qa.click('.key-go', 'Проверить');
      }
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] },
    { name: 't4: русские буквы, пусто, три ступени, образец, дополнительная задача', start: 4, langs: ['ru'], steps: [{ name: 't4: ветки', run: async (qa) => {
      const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
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
      if (d.d) {
        await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 4000, 'дополнительная задача');
        qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
        await qa.sleep(300);
        qa.type(ED(), d.ds || d.d, 'ответ дополнительной'); await qa.click('.key-go', 'Проверить');
      }
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] },
    { name: 't5: русские буквы, пусто, три ступени, образец', start: 5, langs: ['ru'], steps: [{ name: 't5: ветки', run: async (qa) => {
      const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
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
      
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад', run: async (qa) => {
      const qd = (qa) => JSON.parse((qa.q('.cp-work') || {}).dataset ? qa.q('.cp-work').dataset.qa : '{}'); const cyr = (s) => { const t = s.replace(/[pxceaoy]/g, (m) => ({ p: 'р', x: 'х', c: 'с', e: 'е', a: 'а', o: 'о', y: 'у' })[m]); return t === s ? s + 'а' : t; }; const ED = () => (qa.q('.cp-gap textarea') ? '.cp-gap textarea' : '.cp-ta');
      await qa.platform.ready();
      const d1 = qd(qa);
      qa.type(ED(), d1.s || d1.a, 'ответ т1'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор т2');
      qa.type(ED(), 'color: gr', 'начало записи'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      await qa.waitFor(() => qa.q('.cp-ta') || qa.q('.cp-gap textarea'), 5000, 'редактор т2 снова');
      qa.expect(/color: gr/.test(qa.q(ED()).value), 'запись на месте после «Назад»');
      qa.expect(qa.qa('.cp-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');
    } }] }
  ]
};
