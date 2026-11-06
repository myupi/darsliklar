// Сценарий проверки урока 11 курса CSS lessons/css/11-flexbox-vyravnivanie.jsx («Flexbox: выравнивание», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (положение карточек относительно полки — по
// getBoundingClientRect); своя полка (s14), onFinished один раз, артефакт. Ветки ошибок — во flows. Шаги — в странице.

const STEPS = [
  { name: 's1: центр по двум осям и gap', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const box = () => { const j = qa.q('.kz-br-page .c11-div.javon').getBoundingClientRect(); const k = qa.qa('.kz-br-page .c11-div.karta').map((e) => e.getBoundingClientRect()); return { j, k }; };
    let b = box();
    qa.expect(Math.abs(b.k[0].left - b.j.left) < 2 && Math.abs(b.k[1].left - b.k[0].right) < 1, 'до превращения: у левого края и слиплись');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    b = box();
    const cx = (b.k[0].left + b.k[2].right) / 2, cy = (b.k[0].top + b.k[0].bottom) / 2;
    qa.expect(Math.abs(cx - (b.j.left + b.j.right) / 2) < 2 && Math.abs(cy - (b.j.top + b.j.bottom) / 2) < 2 && Math.round(b.k[1].left - b.k[0].right) === 12, 'честно: по центру обеих осей, промежутки 12');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: justify-content (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const j = qa.q('.kz-br-page .c11-div.javon').getBoundingClientRect(), k = qa.qa('.kz-br-page .c11-div.karta').map((e) => e.getBoundingClientRect());
    qa.expect(Math.abs(k[0].left - j.left) < 2 && Math.abs(k[2].right - j.right) < 2, 'space-between: по краям');
  } },
  { name: 's3: вписать center', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c11-slot textarea', 'center', 'justify-content');
    await qa.sleep(300);
    const j = qa.q('.kz-br-page .c11-div.javon').getBoundingClientRect(), k = qa.qa('.kz-br-page .c11-div.karta').map((e) => e.getBoundingClientRect());
    qa.expect(Math.abs((k[0].left + k[2].right) / 2 - (j.left + j.right) / 2) < 2, 'честно: по центру сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: значение ↔ полка', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['flex-start', 'center', 'space-between']) {
      await qa.waitFor(() => qa.q('.c11-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'значение нажимается');
      await qa.click('.c11-mtag[data-t="' + k + '"]', k); await qa.click('.c11-mcard[data-card="' + k + '"]', 'полка ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: align-items (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const j = qa.q('.kz-br-page .c11-div.javon').getBoundingClientRect(), k = qa.q('.kz-br-page .c11-div.karta').getBoundingClientRect();
    qa.expect(Math.abs(k.bottom - j.bottom) < 2 && k.top > j.top + 10, 'flex-end: внизу и не растянуты');
  } },
  { name: 's6: вписать flex-end', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c11-slot textarea', 'flex-end', 'align-items');
    await qa.sleep(300);
    const j = qa.q('.kz-br-page .c11-div.javon').getBoundingClientRect(), k = qa.q('.kz-br-page .c11-div.karta').getBoundingClientRect();
    qa.expect(Math.abs(k.bottom - j.bottom) < 2 && k.top > j.top + 10, 'честно: внизу сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какой код у полки', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['justify-content: center;', 'align-items: center;', 'align-items: flex-start;']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c11-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c11-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c11-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: gap и перенос (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const k = qa.qa('.kz-br-page .c11-div.karta').map((e) => e.getBoundingClientRect());
    qa.expect(k.length === 6 && k[5].top > k[0].bottom - 1 && Math.round(k[0].width) === 102, 'перенос на новую строку, карточки полной ширины (90 и padding)', { w: k[0].width });
  } },
  { name: 's9: вписать 20px', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c11-slot textarea', '20px', 'gap');
    await qa.sleep(300);
    const k = qa.qa('.kz-br-page .c11-div.karta').map((e) => e.getBoundingClientRect());
    qa.expect(Math.round(k[1].left - k[0].right) === 20, 'честно: промежуток 20 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: какое свойство нужно', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['gap', 'flex-wrap', 'align-items', 'justify-content']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c11-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c11-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c11-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const j = qa.q('.kz-br-page .c11-div.javon').getBoundingClientRect(), k = qa.qa('.kz-br-page .c11-div.karta').map((e) => e.getBoundingClientRect());
    qa.expect(Math.abs((k[0].top + k[2].bottom) / 2 - (j.top + j.bottom) / 2) < 2 && k[1].top > k[0].top, 'column: justify центрует сверху вниз');
  } },
  { name: 's12: исправить «middle»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c11-slot textarea') && qa.q('.c11-slot textarea').value === 'middle', 3000, 'в поле «middle»');
    qa.type('.c11-slot textarea', 'center', 'center');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'centre');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'gap без px');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c11-slot-rule textarea', 'nav { display: flex; justify-content: space-between; }', 'правило');
    await qa.sleep(300);
    const n = qa.q('.kz-br-page nav').getBoundingClientRect(), a = qa.qa('.kz-br-page a.c11-a').map((e) => e.getBoundingClientRect());
    qa.expect(Math.abs(a[2].right - n.right) < 2 && Math.abs(a[0].left - n.left) < 2, 'честно: ссылки по краям сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя полка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c11-slot textarea');
    qa.type(f[0], 'space-between', 'justify'); qa.type(f[1], 'center', 'align'); qa.type(f[2], '12px', 'gap');
    await qa.sleep(300);
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c11-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c11-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c11-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('.javon { justify-content: space-between; }') >= 0 && html.indexOf('.javon { align-items: center; }') >= 0 && html.indexOf('.javon { gap: 12px; }') >= 0, 'артефакт — своя полка', { html });
  } }
];

export default {
  title: 'Урок 11 курса CSS «Flexbox: выравнивание» (облик «Редактор»)',
  file: 'css/11-flexbox-vyravnivanie',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 9, 12, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 's3: centre → причина', start: 2, langs: ['ru'], steps: [{ name: 'centre', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c11-slot textarea', 'centre', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /американ/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's3: flex-end → причина', start: 2, langs: ['ru'], steps: [{ name: 'flex-end', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c11-slot textarea', 'flex-end', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /конец/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: bottom → причина', start: 5, langs: ['ru'], steps: [{ name: 'bottom', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c11-slot textarea', 'bottom', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не bottom/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: end → причина', start: 5, langs: ['ru'], steps: [{ name: 'end', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c11-slot textarea', 'end', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /Почти/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: число без px → причина', start: 8, langs: ['ru'], steps: [{ name: '20', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c11-slot textarea', '20', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: middle → причина', start: 11, langs: ['ru'], steps: [{ name: 'middle', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c11-slot textarea') && qa.q('.c11-slot textarea').value === 'middle', 3000, 'в поле «middle»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /middle в CSS нет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: без выравнивания → причина', start: 13, langs: ['ru'], steps: [{ name: 'только flex', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c11-slot-rule textarea', 'nav { display: flex; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /выравнивание/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: неверное слово → причина', start: 14, langs: ['ru'], steps: [{ name: 'middle', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c11-slot textarea');
      qa.type(f[0], 'middle', 'justify'); qa.type(f[1], 'center', 'align'); qa.type(f[2], '12px', 'gap');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /justify-content/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про justify', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c11-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c11-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c11-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
