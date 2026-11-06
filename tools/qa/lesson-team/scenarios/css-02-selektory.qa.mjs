// Сценарий проверки урока 2 курса CSS lessons/css/02-selektory.jsx («Как выбрать элемент для стилизации»,
// облик «Редактор», 05.11.2026). Основной путь: все 17 экранов действиями ученика; честная страница (цвета —
// по вычисленному стилю элементов); свой класс (s11), onFinished один раз, артефакт со своим классом.
// Ветки: другой класс (s3); не тот абзац (s4); точка вместо решётки (s6); не та пара (s7); «#» вместо точки (s9);
// верная строка в «найди ошибку» (s10); разные имена (s11); неверный ответ (q1). Функции шагов — в странице.

const col = (qa, sel, i) => { const e = qa.qa(sel)[i || 0]; return e ? e.ownerDocument.defaultView.getComputedStyle(e).color : ''; };
const STEPS = [
  { name: 's1: правило p красит все абзацы', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    await qa.click('.kz-btn.is-coral', 'Покрасить');
    await qa.sleep(700);
    const cs = (i) => { const e = qa.qa('.kz-br-page .c2-p')[i]; return e.ownerDocument.defaultView.getComputedStyle(e).color; };
    qa.expect([0, 1, 2].every((i) => cs(i) === 'rgb(255, 0, 0)'), 'честно: красные все три абзаца');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: атрибут class (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    await qa.sleep(500);
    const cs = (i) => { const e = qa.qa('.kz-br-page .c2-p')[i]; return e.ownerDocument.defaultView.getComputedStyle(e).color; };
    qa.expect(qa.text('.kz-code').indexOf('.muhim { color: red; }') >= 0 && cs(1) === 'rgb(255, 0, 0)' && cs(0) !== 'rgb(255, 0, 0)', 'красный только важный абзац');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать имя класса', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c2-slot textarea', 'yangi', 'имя класса');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.sleep(500);
    const e = qa.qa('.kz-br-page .c2-p')[2];
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(0, 128, 0)', 'честно: третий абзац зелёный');
  } },
  { name: 's4: какие абзацы покрасит', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const i of [0, 2]) {
      await qa.waitFor(() => qa.q('.c2-doc .c2-blk.is-tap'), 30000, 'абзацы нажимаются');
      qa.q('.c2-doc .c2-blk[data-i="' + i + '"]').click();
      await qa.sleep(500);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: атрибут id (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(500);
    const e = qa.q('.kz-br-page .c2-h1');
    qa.expect(qa.text('.kz-code').indexOf('#bosh { color: purple; }') >= 0 && e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(128, 0, 128)', 'заголовок фиолетовый по id');
  } },
  { name: 's6: собрать селектор id', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['hash', 'logo']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.sleep(500);
    const e = qa.q('.kz-br-page .c2-h1');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(255, 165, 0)', 'честно: заголовок оранжевый');
  } },
  { name: 's7: селектор ↔ что выбирает', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['tag', 'cls', 'id']) {
      await qa.waitFor(() => qa.q('.c2-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'часть нажимается');
      await qa.click('.c2-mtag[data-t="' + k + '"]', k); await qa.click('.c2-mcard[data-card="' + k + '"]', 'работа ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'k1: class или id (показ)', shot: 'k1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(500);
    const ps = qa.qa('.kz-br-page .c2-p'), cs = (e) => e.ownerDocument.defaultView.getComputedStyle(e).color;
    qa.expect(cs(ps[0]) === 'rgb(0, 0, 255)' && cs(ps[2]) !== 'rgb(0, 0, 255)' && cs(qa.q('.kz-br-page .c2-h1')) === 'rgb(255, 165, 0)', 'три sport — синие, заголовок по id — оранжевый');
  } },
  { name: 'k2: селектор целиком', shot: 'k2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c2-slot textarea', '.sport', 'селектор');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'k3: class или id', shot: 'k3-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['cls', 'id', 'cls', 'id']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c2-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c2-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c2-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: что ломает выбор (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
  } },
  { name: 's9: поставить точку', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c2-slot textarea', '.', 'точка');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.sleep(500);
    const e = qa.qa('.kz-br-page .c2-p')[1];
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(255, 0, 0)', 'честно: важный абзац красный');
  } },
  { name: 's10: найти сломанное правило', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, '.Sport');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, '#logo');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c2-slot-rule textarea', '#bosh { color: purple; }', 'правило');
    await qa.sleep(700);
    const e = qa.q('.kz-br-page .c2-h1');
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(128, 0, 128)', 'честно: заголовок фиолетовый сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's11: свой класс', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c2-slot textarea');
    qa.type(f[0], 'mening', 'класс в CSS'); qa.type(f[1], 'mening', 'класс в HTML');
    await qa.sleep(600);
    const e = qa.qa('.kz-br-page .c2-p')[0];
    qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(255, 20, 147)', 'честно: свой абзац покрасился');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c2-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c2-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c2-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's12: вывод', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, '«Завершить урок»');
  } },
  { name: 's12: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('.mening { color: deeppink; }') >= 0 && html.indexOf('class="mening"') >= 0, 'артефакт — свой класс в CSS и HTML', { html });
  } }
];

export default {
  title: 'Урок 2 курса CSS «Как выбрать элемент для стилизации» (облик «Редактор»)',
  file: 'css/02-selektory',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 14, 15],
  expectFinish: true,
  data: {
    ru: { endS2: 'буква в букву' },
    uz: { endS2: 'harfma-harf' },
    en: { endS2: 'letter by letter' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: другой класс → причина', start: 2, langs: ['ru'], steps: [{ name: 'muhim', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c2-slot textarea', 'muhim', 'другой класс');
      await qa.sleep(700);
      const e = qa.qa('.kz-br-page .c2-p')[1];
      qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color === 'rgb(0, 128, 0)', 'честно: позеленел второй абзац');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's4: не тот абзац → причина', start: 3, langs: ['ru'], steps: [{ name: 'maktab', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c2-doc .c2-blk.is-tap'), 30000, 'абзацы нажимаются');
      qa.q('.c2-doc .c2-blk[data-i="1"]').click();
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!!qa.q('.c2-blk.is-off') && !qa.platform.nextEnabled(), 'абзац погас');
    } }] },
    { name: 's6: точка вместо решётки → причина', start: 5, langs: ['ru'], steps: [{ name: '.', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="dot"]', '.');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 4 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'p ↔ id', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c2-mtag[data-t="tag"]:not(:disabled)'), 20000, 'часть нажимается');
      await qa.click('.c2-mtag[data-t="tag"]', 'p'); await qa.click('.c2-mcard[data-card="id"]', 'id');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.c2-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 'k2: без точки → причина', start: 8, langs: ['ru'], steps: [{ name: 'sport', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c2-slot textarea', 'sport', 'без точки');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint') && /точк/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про точку');
    } }] },
    { name: 'w1: точка для id → причина', start: 13, langs: ['ru'], steps: [{ name: '.bosh', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c2-slot-rule textarea', '.bosh { color: purple; }', 'точка');
      await qa.sleep(700);
      const e = qa.q('.kz-br-page .c2-h1');
      qa.expect(e.ownerDocument.defaultView.getComputedStyle(e).color !== 'rgb(128, 0, 128)', 'честно: с точкой не красится');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint') && /решётк/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про решётку');
    } }] },
    { name: 's9: решётка вместо точки → причина', start: 11, langs: ['ru'], steps: [{ name: '#', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c2-slot textarea', '#', 'решётка');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's10: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's11: разные имена → причина', start: 14, langs: ['ru'], steps: [{ name: 'mening + mendan', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c2-slot textarea');
      qa.type(f[0], 'mendan', 'CSS'); qa.type(f[1], 'mening', 'HTML');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про класс', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c2-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c2-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c2-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
