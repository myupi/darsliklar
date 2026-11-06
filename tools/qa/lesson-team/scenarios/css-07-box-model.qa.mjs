// Сценарий проверки урока 7 курса CSS lessons/css/07-box-model.jsx («Box Model», облик «Редактор», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (padding, border, margin, box-sizing — по
// getComputedStyle и offsetWidth самих элементов); своя заметка (s14), onFinished один раз, артефакт.
// Ветки: число без px (s3, s9); solid вместо dashed (s6); content-box (s12); верная строка в «найди ошибку» (s13);
// рамка без вида (w1, s14); неверный ответ (q1). Шаги — в странице.

const STEPS = [
  { name: 's1: padding, border, margin', shot: 's1-done', run: async (qa) => {
    const cs = (sel) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e) : null; };
    await qa.platform.ready();
    qa.expect(cs('.c7-p').paddingTop === '0px' && cs('.c7-p').borderTopStyle === 'none', 'до превращения: без padding и рамки');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    const s = cs('.c7-p');
    qa.expect(s.paddingTop === '12px' && s.borderTopWidth === '2px' && s.borderTopStyle === 'solid' && s.marginLeft === '20px', 'честно: padding 12, рамка 2 solid, margin 20', { p: s.paddingTop, b: s.borderTopWidth, m: s.marginLeft });
    qa.expect(!!qa.q('.c7-tint.c7-tp') && !!qa.q('.c7-tint.c7-tm'), 'Инспектор красит отступы');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: padding (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const e = qa.q('.kz-br-page .c7-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).paddingTop === '24px', 'padding 24px');
  } },
  { name: 's3: вписать 20px', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c7-slot textarea', '20px', 'padding');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c7-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).paddingLeft === '20px', 'честно: padding 20 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: padding ↔ заметка', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['p4', 'p16', 'p32']) {
      await qa.waitFor(() => qa.q('.c7-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'значение нажимается');
      await qa.click('.c7-mtag[data-t="' + k + '"]', k); await qa.click('.c7-mcard[data-card="' + k + '"]', 'заметка ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: рамка (показ) — без вида рамки нет', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const e = qa.q('.kz-br-page .c7-p');
    const s = e.ownerDocument.defaultView.getComputedStyle(e);
    qa.expect(s.borderTopStyle === 'none' && s.borderTopWidth === '0px', 'border: 3px red — рамки нет', { st: s.borderTopStyle });
  } },
  { name: 's6: вписать dashed', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c7-slot textarea', 'dashed', 'вид линии');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c7-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).borderTopStyle === 'dashed', 'честно: рамка чёрточками сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какой код у рамки', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['border: 4px solid black;', 'border: 2px dashed orange;', 'border: 6px dotted purple;']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c7-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      const r = qa.q('.c7-bbox');
      const s = r.ownerDocument.defaultView.getComputedStyle(r);
      qa.expect(v.indexOf(s.borderTopWidth) >= 0 && v.indexOf(s.borderTopStyle) >= 0, 'коробка честно ' + v);
      qa.qa('.c7-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c7-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: margin (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const ps = qa.qa('.kz-br-page .c7-p');
    const gap = ps[1].offsetTop - (ps[0].offsetTop + ps[0].offsetHeight);
    qa.expect(gap === 30, 'между заметками 30 (margin схлопывается, как в браузере)', { gap });
  } },
  { name: 's9: вписать 30px', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c7-slot textarea', '30px', 'margin');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: padding или margin', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['pad', 'mar', 'pad', 'mar']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c7-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c7-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c7-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: настоящая ширина (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    // Промежуточные 240 и 250 проверены вручную в браузере (06.11.2026); честный рост коробки — в шаге s12 (240 → 200).
    qa.expect(qa.q('.kz-br-page .c7-p').offsetWidth === 200, 'с border-box снова 200');
  } },
  { name: 's12: вписать border-box', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.q('.kz-br-page .c7-p').offsetWidth === 240, 'до: 240');
    qa.type('.c7-slot textarea', 'border-box', 'box-sizing');
    await qa.sleep(300);
    qa.expect(qa.q('.kz-br-page .c7-p').offsetWidth === 200, 'честно: 200 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'padding: 20');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'border: 3px red');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c7-slot-rule textarea', 'h1 { border: 2px solid black; }', 'правило');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c7-h1');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).borderTopWidth === '2px', 'честно: рамка у заголовка сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя заметка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c7-slot textarea');
    qa.type(f[0], '16px', 'padding'); qa.type(f[1], '3px dashed purple', 'border'); qa.type(f[2], '20px', 'margin');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c7-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).borderTopStyle === 'dashed', 'честно: рамка сразу');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 1, 0]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c7-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c7-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c7-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('p { padding: 16px; }') >= 0 && html.indexOf('p { border: 3px dashed purple; }') >= 0 && html.indexOf('p { margin: 20px; }') >= 0, 'артефакт — своя заметка', { html });
  } }
];

export default {
  title: 'Урок 7 курса CSS «Box Model» (облик «Редактор»)',
  file: 'css/07-box-model',
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
    { name: 's3: число без px → причина', start: 2, langs: ['ru'], steps: [{ name: '20', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c7-slot textarea', '20', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's6: solid → причина', start: 5, langs: ['ru'], steps: [{ name: 'solid', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c7-slot textarea', 'solid', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /сплошная/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's9: число без px → причина', start: 8, langs: ['ru'], steps: [{ name: '30', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c7-slot textarea', '30', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's12: content-box → причина', start: 11, langs: ['ru'], steps: [{ name: 'content-box', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c7-slot textarea', 'content-box', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /обычный/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'w1: рамка без вида → причина', start: 13, langs: ['ru'], steps: [{ name: 'h1 { border: 2px black; }', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c7-slot-rule textarea', 'h1 { border: 2px black; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /вида линии/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: рамка без вида → причина', start: 14, langs: ['ru'], steps: [{ name: '3px red', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c7-slot textarea');
      qa.type(f[0], '10px', 'padding'); qa.type(f[1], '3px red', 'border'); qa.type(f[2], '10px', 'margin');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /вида линии/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про вид линии');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про padding', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c7-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c7-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c7-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
