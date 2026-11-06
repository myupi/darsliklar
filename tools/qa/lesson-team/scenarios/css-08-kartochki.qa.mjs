// Сценарий проверки урока 8 курса CSS lessons/css/08-kartochki.jsx («Красивые карточки», облик «Редактор», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (border-radius, box-shadow, border-* — по
// getComputedStyle самих элементов); своя карточка (s14), onFinished один раз, артефакт.
// Ветки: число без px (s3); ноль вместо сдвига (s6); border вместо border-left (s9, w1); запятые в тени (s12, s14);
// верная строка в «найди ошибку» (s13); неверный ответ (q1). Шаги — в странице, помощники — внутри шагов.

const STEPS = [
  { name: 's1: радиус, тень, полоса слева', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const cs = () => { const e = qa.q('.kz-br-page .c8-p'); return e.ownerDocument.defaultView.getComputedStyle(e); };
    qa.expect(cs().borderTopLeftRadius === '0px' && cs().boxShadow === 'none', 'до превращения: углы острые, тени нет');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    const s = cs();
    qa.expect(s.borderTopLeftRadius === '12px' && s.boxShadow !== 'none' && s.borderLeftWidth === '6px' && s.borderTopWidth === '0px', 'честно: радиус 12, тень, полоса только слева', { r: s.borderTopLeftRadius, sh: s.boxShadow });
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: скругление (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const e = qa.q('.kz-br-page .c8-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).borderTopLeftRadius === '50px', 'радиус 50px');
  } },
  { name: 's3: вписать 16px', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c8-slot textarea', '16px', 'радиус');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c8-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).borderTopLeftRadius === '16px', 'честно: радиус 16 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: радиус ↔ фигура', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['r4', 'r16', 'r40']) {
      await qa.waitFor(() => qa.q('.c8-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'значение нажимается');
      await qa.click('.c8-mtag[data-t="' + k + '"]', k); await qa.click('.c8-mcard[data-card="' + k + '"]', 'фигура ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: тень (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const e = qa.q('.kz-br-page .c8-p');
    qa.expect(/rgb\(255, 165, 0\) 0px 6px 16px/.test(e.ownerDocument.defaultView.getComputedStyle(e).boxShadow), 'оранжевая мягкая тень');
  } },
  { name: 's6: вписать сдвиг вправо', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c8-slot textarea', '6px', 'сдвиг');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c8-p');
    qa.expect(/6px 6px 0px/.test(e.ownerDocument.defaultView.getComputedStyle(e).boxShadow), 'честно: тень вправо и вниз сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какой код у тени', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['box-shadow: 8px 8px 0px gray;', 'box-shadow: 0px 10px 20px gray;', 'box-shadow: 0px 0px 16px orange;']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c8-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      const r = qa.q('.c8-bbox');
      const sh = r.ownerDocument.defaultView.getComputedStyle(r).boxShadow;
      qa.expect(sh.indexOf(v.replace('box-shadow: ', '').replace(/ (gray|orange);$/, '')) >= 0, 'коробка честно ' + v, { sh });
      qa.qa('.c8-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c8-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: полоса одной стороны (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const e = qa.q('.kz-br-page .c8-p');
    const s = e.ownerDocument.defaultView.getComputedStyle(e);
    qa.expect(s.borderTopStyle === 'dashed' && s.borderLeftWidth === '6px' && s.borderRightWidth === '0px', 'сверху, слева и снизу — справа нет');
  } },
  { name: 's9: вписать border-left', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c8-slot textarea', 'border-left', 'свойство');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c8-p');
    const s = e.ownerDocument.defaultView.getComputedStyle(e);
    qa.expect(s.borderLeftWidth === '6px' && s.borderTopWidth === '0px', 'честно: полоса только слева сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: какая сторона', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['border-left', 'border-bottom', 'border-top', 'border-right']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c8-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c8-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c8-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда ломается (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const e = qa.q('.kz-br-page .c8-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).boxShadow !== 'none', 'без запятых тень есть');
  } },
  { name: 's12: исправить тень', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c8-slot textarea') && /,/.test(qa.q('.c8-slot textarea').value), 3000, 'в поле тень с запятыми');
    const e = () => qa.q('.kz-br-page .c8-p');
    qa.expect(e().ownerDocument.defaultView.getComputedStyle(e()).boxShadow === 'none', 'честно: с запятыми тени нет');
    qa.type('.c8-slot textarea', '0px 6px 12px gray', 'без запятых');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(e().ownerDocument.defaultView.getComputedStyle(e()).boxShadow !== 'none', 'тень есть');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'border-radius: 20');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'тень с запятыми');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c8-slot-rule textarea', 'h1 { border-bottom: 3px solid orange; }', 'правило');
    await qa.sleep(300);
    const e = qa.q('.kz-br-page .c8-h1');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).borderBottomWidth === '3px', 'честно: линия под заголовком сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя карточка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c8-slot textarea');
    qa.type(f[0], '16px', 'радиус'); qa.type(f[1], '0px 6px 16px silver', 'тень'); qa.type(f[2], '6px solid purple', 'полоса');
    await qa.sleep(300);
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c8-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c8-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c8-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('p { border-radius: 16px; }') >= 0 && html.indexOf('p { box-shadow: 0px 6px 16px silver; }') >= 0 && html.indexOf('p { border-left: 6px solid purple; }') >= 0, 'артефакт — своя карточка', { html });
  } }
];

export default {
  title: 'Урок 8 курса CSS «Красивые карточки» (облик «Редактор»)',
  file: 'css/08-kartochki',
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
    { name: 's3: число без px → причина', start: 2, langs: ['ru'], steps: [{ name: '16', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c8-slot textarea', '16', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's6: ноль → причина', start: 5, langs: ['ru'], steps: [{ name: '0px', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c8-slot textarea', '0px', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /нуле/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: border → причина', start: 8, langs: ['ru'], steps: [{ name: 'border', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c8-slot textarea', 'border', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /со всех сторон/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: запятые остались → причина', start: 11, langs: ['ru'], steps: [{ name: 'с запятыми', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c8-slot textarea') && /,/.test(qa.q('.c8-slot textarea').value), 3000, 'в поле тень с запятыми');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /запят/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про запятые');
    } }] },
    { name: 'w1: border вместо border-bottom → причина', start: 13, langs: ['ru'], steps: [{ name: 'border', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c8-slot-rule textarea', 'h1 { border: 3px solid orange; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /со всех сторон/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'третья строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: тень с запятыми → причина', start: 14, langs: ['ru'], steps: [{ name: 'запятые', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c8-slot textarea');
      qa.type(f[0], '10px', 'радиус'); qa.type(f[1], '0px, 4px, 8px, gray', 'тень'); qa.type(f[2], '4px solid red', 'полоса');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /запят/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про запятые');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про border-radius', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c8-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c8-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c8-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
