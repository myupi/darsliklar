// Сценарий проверки урока 14 курса CSS lessons/css/14-transition.jsx («Плавные эффекты», 07.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (transition кнопки — по getComputedStyle:
// transition-property, transition-duration, transition-timing-function); своя кнопка (s14), onFinished один раз,
// артефакт. Ветки ошибок — во flows. Шаги выполняются в странице — помощники пишутся прямо в шаге.

const STEPS = [
  { name: 's1: кнопка становится плавной', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const t = () => getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t().transitionDuration === '0s', 'до превращения: transition нет — кнопка прыгает');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(t().transitionProperty === 'all' && t().transitionDuration === '0.4s', 'честно: transition: all 0.4s', { p: t().transitionProperty, d: t().transitionDuration });
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: transition (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.transitionProperty === 'transform' && t.transitionDuration === '0.3s', 'в конце: transform 0.3s');
    qa.expect(!!qa.q('.c14-tl-row'), 'полоса времени на месте');
  } },
  { name: 's3: вписать 0.5s', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).transitionDuration === '0s', 'пустое поле — правила нет');
    qa.type('.c14-slot textarea', '0.5s', 'время');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).transitionDuration === '0.5s', 'честно: 0.5s сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: сразу, быстро или медленно', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['slow', 'fast', 'jump', 'slow']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c14-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c14-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c14-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: какое свойство (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.transitionProperty === 'all' && t.transitionDuration === '1s', 'в конце: all 1s');
  } },
  { name: 's6: вписать background-color', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c14-slot textarea', 'background-color', 'свойство');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).transitionProperty === 'background-color', 'честно: плавный цвет фона');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: какой transition', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['transform 0.5s', 'color 1s', 'background-color 1s']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.qa('.c14-opt').some((b) => b.getAttribute('data-v') === v && !b.disabled), 30000, 'кнопки нажимаются');
      qa.qa('.c14-opt').find((b) => b.getAttribute('data-v') === v).click();
      await qa.waitFor(() => qa.q('.c14-opt.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: время и скорость (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.transitionDuration === '2s' && t.transitionTimingFunction === 'ease', 'в конце: 2s ease');
  } },
  { name: 's9: 1000ms', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c14-slot textarea', '1000ms', 'время');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).transitionDuration === '1s', 'честно: браузер считает 1000ms одной секундой');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: что поменять', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['0.2s', 'background-color', 'linear', 'all']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c14-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c14-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c14-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.transitionProperty === 'transfrom', 'опечатка: браузер принял transfrom, но такого свойства нет', { p: t.transitionProperty });
  } },
  { name: 's12: исправить «transform 0,5s»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c14-slot textarea') && qa.q('.c14-slot textarea').value === 'transform 0,5s', 3000, 'в поле «transform 0,5s»');
    qa.type('.c14-slot textarea', 'transform 0.5s', 'transition');
    await qa.sleep(300);
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'время без s');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'transfrom');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c14-slot-rule textarea', '.tugma { transition: transform 0.3s; }', 'правило');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page button.tugma')).transitionDuration === '0.3s', 'честно: 0.3s сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя кнопка', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c14-slot textarea');
    qa.type(f[0], 'rotate(-5deg)', 'transform'); qa.type(f[1], '0.4s', 'время'); qa.type(f[2], 'linear', 'скорость');
    await qa.sleep(300);
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.transitionDuration === '0.4s' && t.transitionTimingFunction === 'linear', 'честно: 0.4s linear сразу');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [0, 0, 1, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c14-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c14-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c14-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
    const t = getComputedStyle(qa.q('.kz-br-page button.tugma'));
    qa.expect(t.transitionDuration === '0.4s' && t.transitionTimingFunction === 'linear', 'своя кнопка — 0.4s linear', { d: t.transitionDuration });
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('.tugma:hover { transform: rotate(-5deg); }') >= 0 && html.indexOf('.tugma { transition: transform 0.4s linear; }') >= 0, 'артефакт — своя кнопка', { html });
  } }
];

export default {
  title: 'Урок 14 курса CSS «Плавные эффекты» (облик «Редактор»)',
  file: 'css/14-transition',
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
    { name: 's3: 0,5s → запятая', start: 2, langs: ['ru'], steps: [{ name: '0,5s', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c14-slot textarea', '0,5s', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /запятая/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's3: 0.5 → нет единицы', start: 2, langs: ['ru'], steps: [{ name: '0.5', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c14-slot textarea', '0.5', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /единицы нет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: color → причина', start: 5, langs: ['ru'], steps: [{ name: 'color', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c14-slot textarea', 'color', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /цвет текста/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: orange → значение', start: 5, langs: ['ru'], steps: [{ name: 'orange', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c14-slot textarea', 'orange', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /значение/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: 1s → в миллисекундах', start: 8, langs: ['ru'], steps: [{ name: '1s', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c14-slot textarea', '1s', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /миллисекундах/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: «transform 0,5s» → запятая', start: 11, langs: ['ru'], steps: [{ name: '0,5s', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c14-slot textarea') && qa.q('.c14-slot textarea').value === 'transform 0,5s', 3000, 'в поле «transform 0,5s»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /запятая/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: transition в :hover → причина', start: 13, langs: ['ru'], steps: [{ name: '.tugma:hover', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c14-slot-rule textarea', '.tugma:hover { transition: transform 0.3s; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /без hover/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла');
    } }] },
    { name: 's14: неизвестная скорость → причина', start: 14, langs: ['ru'], steps: [{ name: 'fast', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c14-slot textarea');
      qa.type(f[0], 'scale(1.3)', 'transform'); qa.type(f[1], '0.4s', 'время'); qa.type(f[2], 'fast', 'скорость');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /скорость/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Неверно» про transition', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c14-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c14-tf', 1, 'Неверно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c14-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
