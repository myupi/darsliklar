// Сценарий проверки урока 1 курса CSS lessons/css/01-chto-takoe-css.jsx («Что такое CSS и как он меняет сайт»,
// облик «Редактор», 05.11.2026). Основной путь: все 17 экранов действиями ученика; честная страница (цвета
// проверяются по вычисленному стилю элементов), своя страница (s14), onFinished один раз, артефакт со style.
// Ветки: другой цвет (s3); не тот ответ HTML/CSS (s4); кусок не по порядку (s6); не та пара (s7); h1 вместо p (s9);
// не то место (s10); «;» вместо «:» (s12); верная строка в «найди ошибку» (s13); одинаковые цвета (s14); неверный
// ответ (q1). Причины — в панели снизу (.b-sheet.is-hint). Функции шагов выполняются в странице.

const STEPS = [
  { name: 's1: чёрно-белый сайт → цвета', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const col = (s) => { const e = qa.q(s); return e ? e.ownerDocument.defaultView.getComputedStyle(e).color : ''; };
    qa.expect(col('.kz-br-page .c1-h1') !== 'rgb(255, 165, 0)', 'сначала заголовок не оранжевый');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => col('.kz-br-page .c1-h1') === 'rgb(255, 165, 0)', 4000, 'заголовок стал оранжевым');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: где живёт CSS (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(/style/.test(qa.text('.kz-code')) && qa.text('.kz-code').indexOf('h1 { color: orange; }') >= 0, 'в head — style с правилом');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать цвет', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c1-slot textarea', 'blue', 'цвет');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    const e = qa.q('.kz-br-page .c1-h1');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(0, 0, 255)', 'честно: заголовок синий');
  } },
  { name: 's4: HTML или CSS', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['html', 'css', 'html', 'css']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c1-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c1-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c1-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: из чего правило (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.c1-anat-lbl').length === 5, 'пять подписей частей');
  } },
  { name: 's6: собрать правило', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['prop', 'colon', 'val', 'semi']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    const e = qa.q('.kz-br-page .c1-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(0, 128, 0)', 'честно: абзацы зелёные');
  } },
  { name: 's7: часть ↔ название', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['sel', 'prop', 'val']) {
      await qa.waitFor(() => qa.q('.c1-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'часть нажимается');
      await qa.click('.c1-mtag[data-t="' + k + '"]', k); await qa.click('.c1-mcard[data-card="' + k + '"]', 'название ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's8: что красит правило (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.text('.kz-code').indexOf('body { background-color: lightblue; }') >= 0, 'второе правило — для body');
  } },
  { name: 's9: вписать селектор', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c1-slot textarea', 'p', 'селектор');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    const e = qa.q('.kz-br-page .c1-p'), h = qa.q('.kz-br-page .c1-h1'), cs = (x) => x.ownerDocument.defaultView.getComputedStyle(x).color;
    qa.expect(cs(e) === 'rgb(128, 0, 128)' && cs(h) !== 'rgb(128, 0, 128)', 'честно: фиолетовые только абзацы');
  } },
  { name: 's10: правило ↔ место', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of ['p', 'body', 'h1']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c1-doc.is-tap'), 30000, 'страница нажимается');
      if (k === 'body') qa.q('.c1-doc.is-tap').click(); else qa.q('.c1-doc.is-tap [data-k="' + k + '"]').click();
      await qa.waitFor(() => !qa.q('.c1-doc.is-tap'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: что ломает правило (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .c1-raw'), 'честно: CSS без style — текст на странице');
  } },
  { name: 's12: исправить знак', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c1-slot textarea') && qa.q('.c1-slot textarea').value === '=', 5000, 'в поле знак «равно»');
    qa.type('.c1-slot textarea', ':', 'двоеточие');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'colr');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'нет двоеточия');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: написать правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c1-slot-rule textarea', 'p { color: red; }', 'правило');
    await qa.sleep(700);
    const e = qa.q('.kz-br-page .c1-p');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(255, 0, 0)', 'честно: абзацы красные сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: свои цвета', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c1-slot textarea');
    qa.type(f[0], 'purple', 'цвет заголовка'); qa.type(f[1], 'lavender', 'цвет фона');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c1-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c1-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c1-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, '«Завершить урок»');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('h1 { color: purple; }') >= 0 && html.indexOf('body { background-color: lavender; }') >= 0 && html.indexOf('<style>') >= 0, 'артефакт — своя страница со style', { html });
  } }
];

export default {
  title: 'Урок 1 курса CSS «Что такое CSS и как он меняет сайт» (облик «Редактор»)',
  file: 'css/01-chto-takoe-css',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 14, 15],
  expectFinish: true,
  data: {
    ru: { endS2: 'Запомни' },
    uz: { endS2: 'Eslab qoling' },
    en: { endS2: 'Remember:' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: другой цвет → причина', start: 2, langs: ['ru'], steps: [{ name: 'red', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c1-slot textarea', 'red', 'красный');
      await qa.sleep(700);
      const e = qa.q('.kz-br-page .c1-h1');
      qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(255, 0, 0)', 'честно: браузер красит и красным');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's3: выдуманный цвет → браузер не красит', start: 2, langs: ['ru'], steps: [{ name: 'sinij', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c1-slot textarea', 'sinij', 'не цвет');
      await qa.sleep(700);
      const e = qa.q('.kz-br-page .c1-h1');
      qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color !== 'rgb(0, 0, 255)', 'честно: неизвестный цвет пропущен');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
    } }] },
    { name: 's4: не тот ответ → причина', start: 3, langs: ['ru'], steps: [{ name: 'CSS вместо HTML', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c1-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c1-where[data-v="css"]', 'CSS');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.c1-where.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] },
    { name: 's6: кусок не по порядку → причина', start: 5, langs: ['ru'], steps: [{ name: 'значение первым', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="val"]', 'green');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'p ↔ значение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c1-mtag[data-t="sel"]:not(:disabled)'), 20000, 'часть нажимается');
      await qa.click('.c1-mtag[data-t="sel"]', 'p'); await qa.click('.c1-mcard[data-card="val"]', 'значение');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.c1-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's9: h1 вместо p → причина', start: 8, langs: ['ru'], steps: [{ name: 'h1', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c1-slot textarea', 'h1', 'h1');
      await qa.sleep(700);
      const h = qa.q('.kz-br-page .c1-h1');
      qa.expect(h.ownerDocument.defaultView.getComputedStyle(h).color === 'rgb(128, 0, 128)', 'честно: покрасился заголовок');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
    } }] },
    { name: 's10: не то место → причина', start: 9, langs: ['ru'], steps: [{ name: 'заголовок вместо абзаца', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c1-doc.is-tap'), 30000, 'страница нажимается');
      qa.q('.c1-doc.is-tap [data-k="h1"]').click();
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's12: «;» вместо «:» → причина', start: 11, langs: ['ru'], steps: [{ name: ';', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c1-slot textarea', ';', 'точка с запятой');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 'w1: «=» вместо «:» → причина', start: 13, langs: ['ru'], steps: [{ name: '=', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c1-slot-rule textarea', 'p { color = red; }', 'с равно');
      await qa.sleep(700);
      const e = qa.q('.kz-br-page .c1-p');
      qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color !== 'rgb(255, 0, 0)', 'честно: с «=» не красится');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint') && /двоеточ/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про двоеточие');
    } }] },
    { name: 's14: одинаковые цвета → причина', start: 14, langs: ['ru'], steps: [{ name: 'blue + blue', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c1-slot textarea');
      qa.type(f[0], 'blue', 'цвет'); qa.type(f[1], 'blue', 'фон');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про новый текст', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c1-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c1-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c1-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
