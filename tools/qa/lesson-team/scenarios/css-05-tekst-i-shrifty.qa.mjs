// Сценарий проверки урока 5 курса CSS lessons/css/05-tekst-i-shrifty.jsx («Текст и шрифты», облик «Редактор»,
// 06.11.2026). Основной путь: все 17 экранов действиями ученика; честная страница (размер, шрифт, жирность, черта и
// выравнивание — по вычисленному стилю элементов); свой блог (s14), onFinished один раз, артефакт.
// Ветки: число без px (s3); px в шрифте (s6); underline вместо none (s9); middle вместо center (s12); верная строка в
// «найди ошибку» (s13); normal вместо bold (w1); размер без px (s14); неверный ответ (q1). Шаги — в странице.

const STEPS = [
  { name: 's1: заголовок крупный и по центру, ссылка без черты', shot: 's1-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(500);
    qa.expect(cs('.c5-h1', 'fontSize') === '40px' && cs('.c5-h1', 'textAlign') === 'center' && cs('.c5-a', 'textDecorationLine') === 'none', 'честно: 40px, по центру, без черты');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: размер (показ)', shot: 's2-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(cs('.c5-p', 'fontSize') === '24px' && cs('.c5-h1', 'fontSize') === '40px', 'в конце абзац 24px, заголовок 40px');
  } },
  { name: 's3: вписать 40px', shot: 's3-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c5-slot textarea', '40px', 'размер');
    await qa.sleep(300);
    qa.expect(cs('.c5-h1', 'fontSize') === '40px', 'честно: заголовок 40px сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: размер ↔ надпись', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['s12', 's24', 's48']) {
      await qa.waitFor(() => qa.q('.c5-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'размер нажимается');
      await qa.click('.c5-mtag[data-t="' + k + '"]', k); await qa.click('.c5-mcard[data-card="' + k + '"]', 'надпись ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: шрифт (показ)', shot: 's5-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(/Georgia/.test(cs('.c5-p', 'fontFamily')), 'в конце Georgia, serif', { f: cs('.c5-p', 'fontFamily') });
  } },
  { name: 's6: собрать шрифт', shot: 's6-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['name', 'comma', 'gen']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(/Courier New/.test(cs('.c5-p', 'fontFamily')), 'честно: шрифт Courier New');
  } },
  { name: 's7: какой шрифт', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['font-family: monospace;', 'font-family: sans-serif;', 'font-family: serif;']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c5-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c5-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c5-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: жирность и черта (показ)', shot: 's8-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(cs('.c5-p', 'fontWeight') === '700' && cs('.c5-a', 'textDecorationLine') === 'none' && cs('.c5-h1', 'fontWeight') === '400', 'абзац жирный, ссылка без черты, заголовок обычный');
  } },
  { name: 's9: вписать none', shot: 's9-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c5-slot textarea', 'none', 'none');
    await qa.sleep(300);
    qa.expect(cs('.c5-a', 'textDecorationLine') === 'none', 'честно: черта пропала сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: какое свойство', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['weight', 'deco', 'deco', 'weight']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c5-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c5-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c5-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: выравнивание (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
  } },
  { name: 's12: вписать center', shot: 's12-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c5-slot textarea', 'center', 'center');
    await qa.sleep(300);
    qa.expect(cs('.c5-h1', 'textAlign') === 'center', 'честно: заголовок по центру сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'font-size: 32');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'text-align: middle');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c5-slot-rule textarea', 'p { font-weight: bold; }', 'правило');
    await qa.sleep(300);
    qa.expect(cs('.c5-p', 'fontWeight') === '700', 'честно: абзац жирный сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: свой блог', shot: 's14-done', run: async (qa) => {
    const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c5-slot textarea');
    qa.type(f[0], '36px', 'размер'); qa.type(f[1], 'monospace', 'шрифт');
    await qa.sleep(300);
    qa.expect(cs('.c5-h1', 'fontSize') === '36px' && /monospace/.test(cs('.c5-p', 'fontFamily')), 'честно: страница в своём размере и шрифте');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c5-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c5-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c5-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('h1 { font-size: 36px; }') >= 0 && html.indexOf('body { font-family: monospace; }') >= 0, 'артефакт — свой блог', { html });
  } }
];

export default {
  title: 'Урок 5 курса CSS «Текст и шрифты» (облик «Редактор»)',
  file: 'css/05-tekst-i-shrifty',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 's3: число без px → причина', start: 2, langs: ['ru'], steps: [{ name: '40', run: async (qa) => {
      const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
      await qa.platform.ready();
      qa.type('.c5-slot textarea', '40', 'без px'); await qa.sleep(300);
      qa.expect(cs('.c5-h1', 'fontSize') !== '40px', 'честно: без px размер не меняется');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про px');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's6: px в шрифте → причина', start: 5, langs: ['ru'], steps: [{ name: '16px', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="px"]', '16px');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /размера/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина: px для размера');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4, 'кусок остался в лотке');
    } }] },
    { name: 's9: underline → причина', start: 8, langs: ['ru'], steps: [{ name: 'underline', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c5-slot textarea', 'underline', 'underline'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /черт/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про черту');
    } }] },
    { name: 's12: middle → причина', start: 11, langs: ['ru'], steps: [{ name: 'middle', run: async (qa) => {
      const cs = (sel, p) => { const e = qa.q('.kz-br-page ' + sel); return e ? e.ownerDocument.defaultView.getComputedStyle(e)[p] : ''; };
      await qa.platform.ready();
      qa.type('.c5-slot textarea', 'middle', 'middle'); await qa.sleep(300);
      qa.expect(cs('.c5-h1', 'textAlign') !== 'center', 'честно: middle не центрирует');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /center/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина: нужен center');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 'w1: normal → причина', start: 13, langs: ['ru'], steps: [{ name: 'normal', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c5-slot-rule textarea', 'p { font-weight: normal; }', 'normal'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /bold/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина: нужен bold');
    } }] },
    { name: 's14: размер без px → причина', start: 14, langs: ['ru'], steps: [{ name: '30', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c5-slot textarea');
      qa.type(f[0], '30', 'без px'); qa.type(f[1], 'serif', 'шрифт');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /число и px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про px');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про px', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c5-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c5-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c5-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
