// Сценарий проверки урока 13 курса CSS lessons/css/13-hover-transform.jsx («Hover и transform», 07.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (цвет, transform и cursor кнопки — по
// getComputedStyle; «мышка над кнопкой» на показах и после верного ответа включается сама); своя кнопка (s14),
// onFinished один раз, артефакт. Ветки ошибок — во flows. Шаги выполняются в странице — помощники пишутся в шаге.

const STEPS = [
  { name: 's1: кнопка оживает', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const t = () => getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t().transform === 'none' && t().backgroundColor !== 'rgb(255, 165, 0)', 'до превращения: кнопка как картинка');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(t().backgroundColor === 'rgb(255, 165, 0)' && /^matrix\(1\.1, 0, 0, 1\.1/.test(t().transform) && t().cursor === 'pointer', 'честно: под мышкой оранжевая, scale 1.1, рука', { bg: t().backgroundColor, tf: t().transform });
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: :hover (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.backgroundColor === 'rgb(255, 165, 0)' && t.color === 'rgb(255, 255, 255)', 'под мышкой: фон оранжевый, текст белый');
    qa.expect(!!qa.q('.c13-hovtag'), 'Инспектор: метка :hover');
  } },
  { name: 's3: вписать gold', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c13-slot textarea', 'gold', 'цвет');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).backgroundColor !== 'rgb(255, 215, 0)', 'честно: без мышки кнопка не золотая');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).backgroundColor === 'rgb(255, 215, 0)', 'под мышкой — золотая');
  } },
  { name: 's4: всегда или под мышкой', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['always', 'hover', 'hover', 'always']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c13-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c13-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c13-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: transform (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const b = qa.q('.kz-br-page button.tugma'), p2 = b.nextElementSibling;
    qa.expect(getComputedStyle(b).transform === 'matrix(1, 0, 0, 1, 40, 10)', 'translate 40 и 10', { tf: getComputedStyle(b).transform });
    qa.expect(Math.abs(p2.getBoundingClientRect().top - b.getBoundingClientRect().bottom) > 0, 'соседний абзац на своём месте');
  } },
  { name: 's6: scale(2)', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c13-slot textarea', '2', 'scale');
    await qa.sleep(300);
    qa.expect(/^matrix\(2, 0, 0, 2/.test(getComputedStyle(qa.q('.kz-br-page button.tugma')).transform), 'честно: вдвое сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какой transform', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['rotate(20deg)', 'scale(1.5)', 'translate(60px, 0px)']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c13-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c13-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c13-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: hover и transform, cursor (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(/^matrix\(1\.2, 0, 0, 1\.2/.test(t.transform) && t.cursor === 'pointer', 'под мышкой: scale 1.2 и рука');
  } },
  { name: 's9: cursor pointer', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c13-slot textarea', 'pointer', 'cursor');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).cursor === 'pointer', 'честно: рука сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: что нужно', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['scale', 'rotate', 'translate', 'cursor']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c13-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c13-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c13-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const m = getComputedStyle(qa.q('.kz-br-page button.tugma')).transform.match(/matrix\(([^)]+)\)/);
    const a = m ? m[1].split(',').map(Number) : [];
    qa.expect(a.length === 6 && Math.abs(Math.hypot(a[0], a[1]) - 1) < 0.01 && a[1] > 0.2, 'два transform: побеждает второй — только поворот', { tf: m && m[0] });
  } },
  { name: 's12: исправить «rotate(15)»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c13-slot textarea') && qa.q('.c13-slot textarea').value === 'rotate(15)', 3000, 'в поле «rotate(15)»');
    qa.type('.c13-slot textarea', 'rotate(15deg)', 'transform');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'scale(2px)');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'translate без запятой');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c13-slot-rule textarea', '.tugma:hover { transform: rotate(10deg); }', 'правило');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    const m = getComputedStyle(qa.q('.kz-br-page button.tugma')).transform;
    qa.expect(/^matrix\(0\.98/.test(m), 'под мышкой: поворот на 10 градусов', { tf: m });
  } },
  { name: 's14: своя кнопка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c13-slot textarea');
    qa.type(f[0], 'tomato', 'цвет'); qa.type(f[1], 'rotate(-5deg)', 'transform'); qa.type(f[2], 'pointer', 'cursor');
    await qa.sleep(300);
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c13-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c13-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c13-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.backgroundColor === 'rgb(255, 99, 71)', 'своя кнопка под мышкой — tomato', { bg: t.backgroundColor });
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('.tugma:hover { background-color: tomato; }') >= 0 && html.indexOf('.tugma:hover { transform: rotate(-5deg); }') >= 0 && html.indexOf('.tugma { cursor: pointer; }') >= 0, 'артефакт — своя кнопка', { html });
  } }
];


export default {
  title: 'Урок 13 курса CSS «Hover и transform» (облик «Редактор»)',
  file: 'css/13-hover-transform',
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
    { name: 's3: red → причина', start: 2, langs: ['ru'], steps: [{ name: 'red', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c13-slot textarea', 'red', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /другой цвет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's6: 2px → причина', start: 5, langs: ['ru'], steps: [{ name: '2px', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c13-slot textarea', '2px', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px не нужен/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: 1 → причина', start: 5, langs: ['ru'], steps: [{ name: '1', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c13-slot textarea', '1', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не изменилась/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: hand → причина', start: 8, langs: ['ru'], steps: [{ name: 'hand', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c13-slot textarea', 'hand', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не hand/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: «rotate(15)» → причина', start: 11, langs: ['ru'], steps: [{ name: 'rotate(15)', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c13-slot textarea') && qa.q('.c13-slot textarea').value === 'rotate(15)', 3000, 'в поле «rotate(15)»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /нет deg/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: пробел перед :hover → причина', start: 13, langs: ['ru'], steps: [{ name: '.tugma :hover', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c13-slot-rule textarea', '.tugma :hover { transform: rotate(10deg); }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /пробел/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'w1: без :hover → причина', start: 13, langs: ['ru'], steps: [{ name: '.tugma', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c13-slot-rule textarea', '.tugma { transform: rotate(10deg); }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /Нет hover/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: rotate без deg → причина', start: 14, langs: ['ru'], steps: [{ name: 'rotate(10)', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c13-slot textarea');
      qa.type(f[0], 'gold', 'цвет'); qa.type(f[1], 'rotate(10)', 'transform'); qa.type(f[2], 'pointer', 'cursor');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /нет deg/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про hover', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c13-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c13-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c13-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
