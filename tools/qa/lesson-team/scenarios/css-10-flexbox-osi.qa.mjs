// Сценарий проверки урока 10 курса CSS lessons/css/10-flexbox-osi.jsx («Flexbox: расположение элементов», 06.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (порядок и положение карточек — по
// getBoundingClientRect; стрелки осей — по flex-direction браузера); своя полка (s14), onFinished один раз, артефакт.
// Ветки: flexbox и block (s3); строка ребёнка (s4); row и опечатка (s6); column вместо row-reverse (s9); правило без
// направления (w1); верная строка (s13); неверное направление в своей полке (s14); неверный ответ (q1).

const STEPS = [
  { name: 's1: полка в ряд', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const tops = () => qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().top));
    qa.expect(tops()[1] > tops()[0], 'до превращения: карточки друг под другом');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(new Set(tops()).size === 1, 'честно: карточки в одном ряду', { t: tops() });
    qa.expect(!!qa.q('.c10-arr.is-main.c10-arr-h') && !!qa.q('.c10-arr.is-cross.c10-arr-v'), 'стрелки: главная — горизонтальная');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: родитель и дети (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const t = qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().top));
    qa.expect(new Set(t).size === 1, 'в ряд');
  } },
  { name: 's3: вписать flex', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c10-slot textarea', 'flex', 'display');
    await qa.sleep(300);
    const t = qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().top));
    qa.expect(new Set(t).size === 1, 'честно: в ряд сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: какому тегу flex', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 1; r <= 3; r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => new RegExp(r + '/3').test(qa.text('.kz-ask-n')) && qa.q('.c10-html .kz-line.kz-tap:not(:disabled)'), 30000, 'раунд ' + r);
      // В третьем раунде полка лежит в main: родитель карточек — вторая строка (09.11.2026).
      await qa.clickNth('.c10-html .kz-line.kz-tap', r === 3 ? 1 : 0, 'строка родителя');
      await qa.waitFor(() => !qa.q('.c10-html .kz-line.kz-tap:not(:disabled)'), 5000, 'ответ принят');
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: направление (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().top));
    qa.expect(t[0] > t[1] && t[1] > t[2], 'column-reverse: первая внизу', { t });
    qa.expect(!!qa.q('.c10-arr.is-main.c10-arr-v.is-back'), 'главная ось — вверх');
  } },
  { name: 's6: вписать column', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c10-slot textarea', 'column', 'flex-direction');
    await qa.sleep(300);
    const t = qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().top));
    qa.expect(t[0] < t[1] && t[1] < t[2], 'честно: столбиком сверху вниз сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какое направление', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['row-reverse', 'column', 'column-reverse']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c10-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c10-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c10-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: две оси (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    const j = qa.q('.kz-br-page .c10-div.javon'), k = qa.q('.kz-br-page .c10-div.karta');
    qa.expect(j.offsetHeight === 120 && Math.abs(k.offsetWidth - (j.clientWidth - 8)) <= 1, 'column: дети тянутся по ширине (поперечная ось)', { j: j.clientWidth, k: k.offsetWidth });
  } },
  { name: 's9: вписать row-reverse', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c10-slot textarea', 'row-reverse', 'flex-direction');
    await qa.sleep(300);
    const l = qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().left));
    qa.expect(l[0] > l[1] && l[1] > l[2], 'честно: первая справа', { l });
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: куда идёт главная ось', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['d', 'r', 'l', 'u']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c10-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c10-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c10-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = qa.qa('.kz-br-page .c10-div.karta').map((e) => Math.round(e.getBoundingClientRect().top));
    qa.expect(t[0] < t[1] && t[1] < t[2] && !qa.q('.c10-arr'), 'без flex направление не работает: обычные блоки, стрелок нет');
  } },
  { name: 's12: исправить «flexbox»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c10-slot textarea') && qa.q('.c10-slot textarea').value === 'flexbox', 3000, 'в поле «flexbox»');
    qa.type('.c10-slot textarea', 'flex', 'flex');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'colum');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'направление без flex');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c10-slot-rule textarea', 'nav { display: flex; flex-direction: column; }', 'правило');
    await qa.sleep(300);
    const a = qa.qa('.kz-br-page a.c10-a');
    qa.expect(a[1].getBoundingClientRect().top > a[0].getBoundingClientRect().bottom - 1, 'честно: ссылки столбиком сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя полка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c10-slot textarea');
    qa.type(f[0], 'column', 'направление'); qa.type(f[1], 'gold', 'фон'); qa.type(f[2], '12px', 'отступ');
    await qa.sleep(300);
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c10-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c10-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c10-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('.javon { flex-direction: column; }') >= 0 && html.indexOf('.karta { background-color: gold; }') >= 0 && html.indexOf('.karta { padding: 12px; }') >= 0, 'артефакт — своя полка', { html });
  } }
];

export default {
  title: 'Урок 10 курса CSS «Flexbox: расположение элементов» (облик «Редактор»)',
  file: 'css/10-flexbox-osi',
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
    { name: 's3: flexbox → причина', start: 2, langs: ['ru'], steps: [{ name: 'flexbox', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c10-slot textarea', 'flexbox', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /название способа/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's3: block → причина', start: 2, langs: ['ru'], steps: [{ name: 'block', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c10-slot textarea', 'block', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /друг под другом/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's4: строка ребёнка → причина', start: 3, langs: ['ru'], steps: [{ name: 'a', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c10-html .kz-line.kz-tap:not(:disabled)'), 30000, 'строки нажимаются');
      await qa.clickNth('.c10-html .kz-line.kz-tap', 1, 'ребёнок');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.c10-html .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's6: row → причина', start: 5, langs: ['ru'], steps: [{ name: 'row', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c10-slot textarea', 'row', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /в ряд/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: colum → причина', start: 5, langs: ['ru'], steps: [{ name: 'colum', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c10-slot textarea', 'colum', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не узнал/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: column → причина', start: 8, langs: ['ru'], steps: [{ name: 'column', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c10-slot textarea', 'column', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /сверху вниз/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: без направления → причина', start: 13, langs: ['ru'], steps: [{ name: 'только flex', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c10-slot-rule textarea', 'nav { display: flex; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /направление/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: неверное направление → причина', start: 14, langs: ['ru'], steps: [{ name: 'colum', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c10-slot textarea');
      qa.type(f[0], 'colum', 'направление'); qa.type(f[1], 'gold', 'фон'); qa.type(f[2], '12px', 'отступ');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /направление/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про родителя', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c10-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c10-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c10-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
