// Сценарий проверки урока 16 курса CSS lessons/css/16-adaptivnost.jsx («Адаптивность», 07.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница своей ширины (800 — компьютер, 360 — телефон):
// ширина баннера — offsetWidth, ряд карточек — flex-direction, баннер — display; переключатель ширины окна;
// своя страница (s14), onFinished один раз, артефакт. Ветки ошибок — во flows. Шаги выполняются в странице.

const STEPS = [
  { name: 's1: сайт ломается на телефоне → адаптивный', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c16-vw.is-over'), 15000, 'на телефоне страница шире окна (метка красная)');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(1500);
    const b = qa.q('.kz-br-page .banner'), d = qa.q('.c16-doc');
    qa.expect(Math.abs(b.offsetWidth - d.clientWidth + 16) <= 1 && !qa.q('.c16-vw.is-over'), 'честно: баннер по окну, прокрутки вбок нет', { b: b.offsetWidth, d: d.clientWidth });
    qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'column', 'на телефоне карточки столбиком');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: % (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    await qa.sleep(1200);
    qa.expect(/^800px/.test(qa.text('.c16-vw')) && qa.q('.kz-br-page .banner').offsetWidth === 784, 'в конце: компьютер, баннер во всю ширину', { w: qa.q('.kz-br-page .banner').offsetWidth });
  } },
  { name: 's3: вписать 100%', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c16-slot textarea', '100%', 'ширина');
    await qa.sleep(400);
    qa.expect(qa.q('.kz-br-page .banner').offsetWidth === 344, 'честно: на телефоне 344 (окно 360 минус поля)');
    await qa.click('.c16-wt-b[data-w="800"]', 'Компьютер');
    await qa.sleep(1300);
    qa.expect(qa.q('.kz-br-page .banner').offsetWidth === 784, 'на компьютере 784');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: px или %', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['px', '%', '%', 'px']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c16-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c16-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c16-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: @media (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    await qa.sleep(1200);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'row', 'в конце: на компьютере правило спит — ряд');
  } },
  { name: 's6: вписать 600px', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c16-slot textarea', '600px', 'граница');
    await qa.sleep(400);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'column', 'честно: на телефоне столбиком');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: сработает ли', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['yes', 'no', 'yes']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c16-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c16-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c16-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: спрятать на телефоне (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    await qa.sleep(1200);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .banner')).display === 'block', 'в конце: на компьютере баннер на месте');
  } },
  { name: 's9: вписать none', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c16-slot textarea', 'none', 'display');
    await qa.sleep(400);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .banner')).display === 'none', 'честно: на телефоне баннера нет');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: в @media или всегда', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['media', 'always', 'media', 'always']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c16-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c16-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c16-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'row', 'min-width на телефоне спит — ряд');
  } },
  { name: 's12: исправить условие без скобок', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c16-slot textarea') && qa.q('.c16-slot textarea').value === 'max-width: 600px', 3000, 'в поле условие без скобок');
    qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'row', 'честно: без скобок браузер выбросил правило');
    qa.type('.c16-slot textarea', '(max-width: 600px)', 'условие');
    await qa.sleep(400);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'column', 'со скобками — столбиком');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, '600 без px');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'min-width');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило @media целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c16-slot-rule textarea', '@media (max-width: 600px) { .banner { display: none; } }', 'правило');
    await qa.sleep(400);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .banner')).display === 'none', 'честно: на телефоне баннера нет');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: свой сайт', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c16-slot textarea');
    qa.type(f[0], '500px', 'граница'); qa.type(f[1], 'gold', 'баннер'); qa.type(f[2], 'white', 'карточки');
    await qa.sleep(400);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .banner')).backgroundColor === 'rgb(255, 215, 0)', 'честно: на телефоне баннер золотой');
    await qa.click('.c16-wt-b[data-w="800"]', 'Компьютер');
    await qa.sleep(1300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .banner')).backgroundColor === 'rgb(255, 165, 0)', 'на компьютере оранжевый');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 0, 1, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c16-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c16-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c16-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
    qa.expect(getComputedStyle(qa.q('.kz-br-page .banner')).backgroundColor === 'rgb(255, 215, 0)', 'своя страница на телефоне — баннер золотой');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('@media (max-width: 500px) { .banner { background-color: gold; } .karta { background-color: white; } }') >= 0 && html.indexOf('name="viewport"') >= 0, 'артефакт — свой адаптивный сайт', { html });
  } }
];

export default {
  title: 'Урок 16 курса CSS «Адаптивность» (облик «Редактор»)',
  file: 'css/16-adaptivnost',
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
    { name: 's3: 700px → нужны проценты', start: 2, langs: ['ru'], steps: [{ name: '700px', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c16-slot textarea', '700px', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /Пиксели всегда/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's3: 50% → часть ширины', start: 2, langs: ['ru'], steps: [{ name: '50%', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c16-slot textarea', '50%', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /часть ширины/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: 600 → нет px', start: 5, langs: ['ru'], steps: [{ name: '600', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c16-slot textarea', '600', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /px нет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(getComputedStyle(qa.q('.kz-br-page .qator')).flexDirection === 'row', 'честно: без px браузер выбросил правило');
    } }] },
    { name: 's9: block → баннер виден', start: 8, langs: ['ru'], steps: [{ name: 'block', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c16-slot textarea', 'block', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /баннер виден/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: без скобок → причина', start: 11, langs: ['ru'], steps: [{ name: 'без скобок', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c16-slot textarea') && qa.q('.c16-slot textarea').value === 'max-width: 600px', 3000, 'в поле условие без скобок');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /без скобок/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: без @ → причина', start: 13, langs: ['ru'], steps: [{ name: 'media', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c16-slot-rule textarea', 'media (max-width: 600px) { .banner { display: none; } }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /собачки/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'w1: min-width → причина', start: 13, langs: ['ru'], steps: [{ name: 'min-width', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c16-slot-rule textarea', '@media (min-width: 600px) { .banner { display: none; } }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /max-width/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первое правило', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верное правило');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length >= 1 && !qa.platform.nextEnabled(), 'правило погасло');
    } }] },
    { name: 's14: граница без px → причина', start: 14, langs: ['ru'], steps: [{ name: '600', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c16-slot textarea');
      qa.type(f[0], '600', 'граница'); qa.type(f[1], 'gold', 'баннер'); qa.type(f[2], 'white', 'карточки');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /нет px/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про проценты', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c16-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c16-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c16-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
