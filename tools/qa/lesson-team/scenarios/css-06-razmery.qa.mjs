// Сценарий проверки урока 6 курса CSS lessons/css/06-razmery.jsx («Размеры элементов», облик «Редактор», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (размеры — offsetWidth / offsetHeight самих
// элементов, проценты — от ширины страницы); своя открытка (s14), onFinished один раз, артефакт.
// Ветки: число без px (s3); px вместо процента (s6); «160 px» с пробелом (s12); верная строка в «найди ошибку»
// (s13); «100 %» (w1); ширина без единицы (s14); неверный ответ (q1). Шаги — в странице.

const STEPS = [
  { name: 's1: фото 180px, абзац 60% окна', shot: 's1-done', run: async (qa) => {
    const W = (t) => { const e = qa.q('.kz-br-page .c6-' + t); return e ? e.offsetWidth : -1; };
    const inner = () => { const d = qa.q('.kz-br-page .c6-doc'); const st = d.ownerDocument.defaultView.getComputedStyle(d); return d.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight); };
    await qa.platform.ready();
    qa.expect(W('img') === 360, 'до превращения фото своего размера 360', { w: W('img') });
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(W('img') === 180 && Math.abs(W('p') - inner() * 0.6) <= 2, 'честно: фото 180, абзац 60% страницы', { img: W('img'), p: W('p'), inner: inner() });
    qa.expect(/img 180×/.test(qa.text('.c6-doc')), 'Инспектор показывает 180');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: ширина (показ)', shot: 's2-done', run: async (qa) => {
    const W = (t) => { const e = qa.q('.kz-br-page .c6-' + t); return e ? e.offsetWidth : -1; };
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(W('h1') === 200 && W('img') === 150, 'заголовок 200, фото 150');
  } },
  { name: 's3: вписать 200px', shot: 's3-done', run: async (qa) => {
    const W = (t) => { const e = qa.q('.kz-br-page .c6-' + t); return e ? e.offsetWidth : -1; };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c6-slot textarea', '200px', 'ширина');
    await qa.sleep(300);
    qa.expect(W('img') === 200, 'честно: фото 200 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: ширина ↔ полоска', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const k of ['w60', 'w120', 'w180']) {
      await qa.waitFor(() => qa.q('.c6-mtag[data-t="' + k + '"]:not(:disabled)'), 20000, 'ширина нажимается');
      await qa.click('.c6-mtag[data-t="' + k + '"]', k); await qa.click('.c6-mcard[data-card="' + k + '"]', 'полоска ' + k);
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's5: проценты (показ) — окно сужается', shot: 's5-done', run: async (qa) => {
    const W = (t) => { const e = qa.q('.kz-br-page .c6-' + t); return e ? e.offsetWidth : -1; };
    const inner = () => { const d = qa.q('.kz-br-page .c6-doc'); const st = d.ownerDocument.defaultView.getComputedStyle(d); return d.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight); };
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    await qa.sleep(1000);
    qa.expect(!!qa.q('.c6-br.c6-narrow') && W('h1') === 200 && Math.abs(W('p') - inner() / 2) <= 2, 'окно уже: заголовок 200, абзац — половина', { h1: W('h1'), p: W('p'), inner: inner() });
  } },
  { name: 's6: вписать 50%', shot: 's6-done', run: async (qa) => {
    const W = (t) => { const e = qa.q('.kz-br-page .c6-' + t); return e ? e.offsetWidth : -1; };
    const inner = () => { const d = qa.q('.kz-br-page .c6-doc'); const st = d.ownerDocument.defaultView.getComputedStyle(d); return d.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight); };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c6-slot textarea', '50%', 'половина');
    await qa.sleep(300);
    qa.expect(Math.abs(W('p') - inner() / 2) <= 2, 'честно: абзац на половину');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: меняется ли с окном', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['fixed', 'flex', 'flex', 'fixed']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c6-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c6-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c6-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: высота (показ)', shot: 's8-done', run: async (qa) => {
    const E = (t) => qa.q('.kz-br-page .c6-' + t);
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(E('h1').offsetHeight === 80 && E('img').offsetWidth === 200 && E('img').offsetHeight === 60, 'заголовок 80 высотой, фото 200×60 (растянуто)');
  } },
  { name: 's9: вписать 80px', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c6-slot textarea', '80px', 'высота');
    await qa.sleep(300);
    qa.expect(qa.q('.kz-br-page .c6-h1').offsetHeight === 80, 'честно: заголовок 80 сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: какой код у прямоугольника', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['width: 160px; height: 40px;', 'width: 60px; height: 120px;', 'width: 100px; height: 100px;']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c6-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      const r = qa.q('.c6-rect');
      qa.expect(r.offsetWidth + ' ' + r.offsetHeight === v.match(/\d+/g).join(' '), 'прямоугольник честно ' + v);
      qa.qa('.c6-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c6-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда размер ломается (показ)', shot: 's11-done', run: async (qa) => {
    const E = (t) => qa.q('.kz-br-page .c6-' + t);
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(E('img').offsetWidth === 200 && E('img').offsetHeight === 200, 'фото 200×200 — растянуто');
  } },
  { name: 's12: исправить «160 px»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c6-slot textarea') && qa.q('.c6-slot textarea').value === '160 px', 3000, 'в поле «160 px»');
    qa.expect(qa.q('.kz-br-page .c6-img').offsetWidth === 360, 'честно: с пробелом фото своего размера');
    qa.type('.c6-slot textarea', '160px', 'без пробела');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.q('.kz-br-page .c6-img').offsetWidth === 160, 'фото 160');
  } },
  { name: 's13: найти сломанное правило', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'width: 150');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'width: 40 %');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    const inner = () => { const d = qa.q('.kz-br-page .c6-doc'); const st = d.ownerDocument.defaultView.getComputedStyle(d); return d.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight); };
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c6-slot-rule textarea', 'img { width: 100%; }', 'правило');
    await qa.sleep(300);
    qa.expect(Math.abs(qa.q('.kz-br-page .c6-img').offsetWidth - inner()) <= 2, 'честно: фото во всю ширину сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя открытка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c6-slot textarea');
    qa.type(f[0], '120px', 'фото'); qa.type(f[1], '70%', 'абзац');
    await qa.sleep(300);
    qa.expect(qa.q('.kz-br-page .c6-img').offsetWidth === 120, 'честно: фото 120');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c6-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c6-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c6-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('img { width: 120px; }') >= 0 && html.indexOf('p { width: 70%; }') >= 0, 'артефакт — своя открытка', { html });
  } }
];

export default {
  title: 'Урок 6 курса CSS «Размеры элементов» (облик «Редактор»)',
  file: 'css/06-razmery',
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
    { name: 's3: число без px → причина', start: 2, langs: ['ru'], steps: [{ name: '200', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c6-slot textarea', '200', 'без px'); await qa.sleep(300);
      qa.expect(qa.q('.kz-br-page .c6-img').offsetWidth === 360, 'честно: без px фото своего размера');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про px');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's6: px вместо процента → причина', start: 5, langs: ['ru'], steps: [{ name: '50px', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c6-slot textarea', '50px', 'пиксели'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /пиксел/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина: нужны проценты');
    } }] },
    { name: 's12: пробел остался → причина', start: 11, langs: ['ru'], steps: [{ name: '160 px', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c6-slot textarea') && qa.q('.c6-slot textarea').value === '160 px', 3000, 'в поле «160 px»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /пробел/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про пробел');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'вторая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 'w1: «100 %» → причина', start: 13, langs: ['ru'], steps: [{ name: '100 %', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c6-slot-rule textarea', 'img { width: 100 %; }', 'с пробелом'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /пробел/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина про пробел');
    } }] },
    { name: 's14: ширина без единицы → причина', start: 14, langs: ['ru'], steps: [{ name: '120', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c6-slot textarea');
      qa.type(f[0], '120', 'без px'); qa.type(f[1], '70%', 'абзац');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /120/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина называет значение');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про 50%', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c6-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c6-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c6-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
