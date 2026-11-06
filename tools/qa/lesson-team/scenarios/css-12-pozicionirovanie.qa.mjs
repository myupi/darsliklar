// Сценарий проверки урока 12 курса CSS lessons/css/12-pozicionirovanie.jsx («Позиционирование», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (положение метки, коробок и кнопки — по
// getBoundingClientRect); своя метка (s14), onFinished один раз, артефакт. Ветки ошибок — во flows. Шаги — в странице.

const STEPS = [
  { name: 's1: метка в угол карточки', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const b = () => qa.q('.kz-br-page .belgi').getBoundingClientRect(), k = () => qa.q('.kz-br-page .karta').getBoundingClientRect();
    qa.expect(b().left > k().left + 4, 'до превращения: метка в строке текста');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(Math.abs(b().top - k().top) < 2 && Math.abs(b().right - k().right) < 2, 'честно: метка в правом верхнем углу карточки', { b: b(), k: k() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: relative (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const r = (c) => qa.q('.kz-br-page .' + c).getBoundingClientRect();
    qa.expect(Math.round(r('ikki').top - r('bir').bottom) === 20 && Math.round(r('ikki').left - r('bir').left) === 40 && Math.round(r('uch').top - r('bir').bottom) === Math.round(r('ikki').height), 'сдвиг 20 вниз и 40 вправо, место осталось');
  } },
  { name: 's3: вписать relative', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c12-slot textarea', 'relative', 'position');
    await qa.sleep(300);
    const r = (c) => qa.q('.kz-br-page .' + c).getBoundingClientRect();
    qa.expect(Math.round(r('ikki').left - r('bir').left) === 40, 'честно: сдвинулась сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: сдвиг ↔ куда поехал', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['top', 'left', 'bottom']) {
      await qa.waitFor(() => qa.q('.c12-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'сдвиг нажимается');
      await qa.click('.c12-mtag[data-t="' + k + '"]', k); await qa.click('.c12-mcard[data-card="' + k + '"]', 'картинка ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: absolute (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const b = qa.q('.kz-br-page .belgi').getBoundingClientRect(), k = qa.q('.kz-br-page .karta').getBoundingClientRect();
    qa.expect(Math.abs(b.top - k.top) < 2 && Math.abs(b.right - k.right) < 2, 'с якорем — в углу карточки');
  } },
  { name: 's6: вписать relative карточке', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const b = () => qa.q('.kz-br-page .belgi').getBoundingClientRect(), k = () => qa.q('.kz-br-page .karta').getBoundingClientRect(), pg = () => qa.q('.kz-br-page').getBoundingClientRect();
    qa.expect(Math.abs(b().top - pg().top) < 2 && Math.abs(b().right - pg().right) < 3, 'до: без якоря — в углу страницы', { b: b(), pg: pg() });
    qa.type('.c12-slot textarea', 'relative', 'position');
    await qa.sleep(300);
    qa.expect(Math.abs(b().top - k().top) < 2 && Math.abs(b().right - k().right) < 2, 'честно: в углу карточки сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: где метка', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['top: 0px; right: 0px;', 'bottom: 0px; left: 0px;', 'bottom: 0px; right: 0px;']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c12-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c12-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c12-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: fixed (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    await qa.sleep(800);
    const t = qa.q('.kz-br-page .tugma').getBoundingClientRect(), pg = qa.q('.kz-br-page').getBoundingClientRect();
    qa.expect(Math.abs(pg.bottom - t.bottom - 10) < 3 && Math.abs(pg.right - t.right - 10) < 4, 'fixed: в углу окна', { t, pg });
  } },
  { name: 's9: вписать fixed', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c12-slot textarea', 'fixed', 'position');
    await qa.sleep(900);
    const page = qa.q('.kz-br-page'), t = qa.q('.kz-br-page .tugma').getBoundingClientRect(), pg = page.getBoundingClientRect();
    qa.expect(page.scrollTop > 0 && Math.abs(pg.bottom - t.bottom - 10) < 3, 'честно: страница прокручена, кнопка в углу окна', { st: page.scrollTop });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: какое значение нужно', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['absolute', 'fixed', 'relative', 'static']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c12-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c12-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c12-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const r = (c) => qa.q('.kz-br-page .' + c).getBoundingClientRect();
    qa.expect(Math.abs(r('ikki').top - r('bir').bottom) < 1, 'top: 20 без px — сдвига нет');
  } },
  { name: 's12: исправить «relativ»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c12-slot textarea') && qa.q('.c12-slot textarea').value === 'relativ', 3000, 'в поле «relativ»');
    qa.type('.c12-slot textarea', 'relative', 'relative');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'top без position');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'absolut');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c12-slot-rule textarea', '.belgi { position: absolute; bottom: 0px; left: 0px; }', 'правило');
    await qa.sleep(300);
    const b = qa.q('.kz-br-page .belgi').getBoundingClientRect(), k = qa.q('.kz-br-page .karta').getBoundingClientRect();
    qa.expect(Math.abs(b.bottom - k.bottom) < 2 && Math.abs(b.left - k.left) < 2, 'честно: метка в левом нижнем углу сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя метка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c12-slot textarea');
    qa.type(f[0], '8px', 'top'); qa.type(f[1], '8px', 'right'); qa.type(f[2], 'gold', 'цвет');
    await qa.sleep(300);
    const b = qa.q('.kz-br-page .belgi').getBoundingClientRect(), k = qa.q('.kz-br-page .karta').getBoundingClientRect();
    qa.expect(Math.round(b.top - k.top) === 8 && Math.round(k.right - b.right) === 8, 'честно: 8 сверху и справа');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c12-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c12-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c12-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('.belgi { top: 8px; }') >= 0 && html.indexOf('.belgi { right: 8px; }') >= 0 && html.indexOf('.belgi { background-color: gold; }') >= 0, 'артефакт — своя метка', { html });
  } }
];

export default {
  title: 'Урок 12 курса CSS «Позиционирование» (облик «Редактор»)',
  file: 'css/12-pozicionirovanie',
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
    { name: 's3: absolute → причина', start: 2, langs: ['ru'], steps: [{ name: 'absolute', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c12-slot textarea', 'absolute', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /бросила/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's6: absolute → причина', start: 5, langs: ['ru'], steps: [{ name: 'absolute', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c12-slot textarea', 'absolute', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /сама карточка/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: absolute → причина', start: 8, langs: ['ru'], steps: [{ name: 'absolute', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c12-slot textarea', 'absolute', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /уедет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: «relativ» → причина', start: 11, langs: ['ru'], steps: [{ name: 'relativ', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c12-slot textarea') && qa.q('.c12-slot textarea').value === 'relativ', 3000, 'в поле «relativ»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не хватает/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: без сдвигов → причина', start: 13, langs: ['ru'], steps: [{ name: 'только absolute', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c12-slot-rule textarea', '.belgi { position: absolute; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /два сдвига/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: неверный сдвиг → причина', start: 14, langs: ['ru'], steps: [{ name: 'abc', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c12-slot textarea');
      qa.type(f[0], 'abc', 'top'); qa.type(f[1], '8px', 'right'); qa.type(f[2], 'gold', 'цвет');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не узнал/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про relative', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c12-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c12-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c12-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
