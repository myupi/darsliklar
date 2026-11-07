// Сценарий проверки урока 15 курса CSS lessons/css/15-animacii.jsx («CSS-анимации», 07.11.2026).
// Основной путь: все 17 экранов действиями ученика; честная страница (анимация кубика — по getComputedStyle:
// animation-name с приставкой страницы, длительность, повторы, скорость, направление; кадры — в <style> страницы);
// своя анимация (s14), onFinished один раз, артефакт. Ветки ошибок — во flows. Шаги выполняются в странице.

const STEPS = [
  { name: 's1: кубик прыгает сам', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    const k = () => getComputedStyle(qa.q('.kz-br-page .kub'));
    qa.expect(k().animationName === 'none', 'до превращения: анимации нет');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.sleep(600);
    qa.expect(/-sakra$/.test(k().animationName) && k().animationDuration === '0.8s' && k().animationIterationCount === 'infinite', 'честно: sakra 0.8s infinite', { n: k().animationName });
    qa.expect(!!qa.q('.c15-doc style') && /@keyframes \S+-sakra/.test(qa.q('.c15-doc style').textContent), 'кадры — настоящий <style> на странице');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: @keyframes и animation (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const k = getComputedStyle(qa.q('.kz-br-page .kub'));
    qa.expect(/-sakra$/.test(k.animationName) && k.animationIterationCount === 'infinite', 'в конце: sakra 1s infinite');
    qa.expect(!!qa.q('.c15-tl-row'), 'полоса анимаций на месте');
  } },
  { name: 's3: вписать имя aylan', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(getComputedStyle(qa.q('.kz-br-page .kub')).animationName === 'none', 'пустое поле — правила нет');
    qa.type('.c15-slot textarea', 'aylan', 'имя');
    await qa.sleep(300);
    qa.expect(/-aylan$/.test(getComputedStyle(qa.q('.kz-br-page .kub')).animationName), 'честно: крутится сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's4: transition или animation', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['animation', 'transition', 'animation', 'transition']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c15-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c15-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c15-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: кадры в процентах (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    qa.expect(getComputedStyle(qa.q('.kz-br-page .kub')).animationIterationCount === '3', 'в конце: 3 раза');
    qa.expect(/50% \{/.test(qa.q('.c15-doc style').textContent), 'кадр 50% на странице');
  } },
  { name: 's6: вписать 50%', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c15-slot textarea', '50%', 'процент');
    await qa.sleep(300);
    qa.expect(/50% \{ transform: translate\(0px, -20px\)/.test(qa.q('.c15-doc style').textContent), 'честно: кадр 50% в плане');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's7: сколько раз', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['two', 'inf', 'one']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c15-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c15-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c15-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's8: скорость и направление (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    const k = getComputedStyle(qa.q('.kz-br-page .kub'));
    qa.expect(/-yur$/.test(k.animationName) && k.animationDirection === 'alternate', 'в конце: yur alternate');
  } },
  { name: 's9: вписать linear', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c15-slot textarea', 'linear', 'скорость');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .kub')).animationTimingFunction === 'linear', 'честно: linear');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: что дописать', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (const v of ['infinite', '3', 'alternate', 'linear']) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c15-where:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.click('.c15-where[data-v="' + v + '"]', v);
      await qa.waitFor(() => qa.q('.c15-where.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's11: когда не работает (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 120000, 'показ закончен');
    qa.expect(!/-20px/.test(qa.q('.c15-doc style').textContent), 'кадр «50» без % браузер выбросил');
  } },
  { name: 's12: исправить «sakra infinite»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.c15-slot textarea') && qa.q('.c15-slot textarea').value === 'sakra infinite', 3000, 'в поле «sakra infinite»');
    qa.type('.c15-slot textarea', 'sakra 1s infinite', 'animation');
    await qa.sleep(300);
    qa.expect(getComputedStyle(qa.q('.kz-br-page .kub')).animationDuration === '1s', 'честно: 1s');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's13: найти правило, которое не работает', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    await qa.clickNth('.kz-code .kz-line.kz-tap', 4, 'aylna');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    await qa.clickNth('.kz-code .kz-line.kz-tap', 5, 'нет времени');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'w1: правило целиком', shot: 'w1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.c15-slot-rule textarea', '.kub { animation: aylan 2s linear infinite; }', 'правило');
    await qa.sleep(300);
    const k = getComputedStyle(qa.q('.kz-br-page .kub'));
    qa.expect(/-aylan$/.test(k.animationName) && k.animationTimingFunction === 'linear', 'честно: крутится ровно сразу');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's14: своя анимация', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const f = qa.qa('.c15-slot textarea');
    qa.type(f[0], 'rotate(45deg)', 'to'); qa.type(f[1], '1s', 'время'); qa.type(f[2], 'infinite', 'повторы');
    await qa.sleep(300);
    const k = getComputedStyle(qa.q('.kz-br-page .kub'));
    qa.expect(/-mening$/.test(k.animationName) && k.animationIterationCount === 'infinite', 'честно: своя анимация сразу');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'q1: верно или нет', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.c15-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c15-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.c15-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить урок»');
    qa.expect(/-mening$/.test(getComputedStyle(qa.q('.kz-br-page .kub')).animationName), 'своя анимация — mening');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('to { transform: rotate(45deg); }') >= 0 && html.indexOf('.kub { animation: mening 1s infinite; }') >= 0, 'артефакт — своя анимация', { html });
  } }
];

export default {
  title: 'Урок 15 курса CSS «CSS-анимации» (облик «Редактор»)',
  file: 'css/15-animacii',
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
    { name: 's3: Aylan → регистр', start: 2, langs: ['ru'], steps: [{ name: 'Aylan', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot textarea', 'Aylan', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /маленькие буквы/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
      qa.expect(getComputedStyle(qa.q('.kz-br-page .kub')).animationName === 'Aylan', 'честно: имя с большой буквы — плана нет, браузер оставил имя как есть');
    } }] },
    { name: 's3: rotate → не имя', start: 2, langs: ['ru'], steps: [{ name: 'rotate', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot textarea', 'rotate', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не имя/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: 50 → нет %', start: 5, langs: ['ru'], steps: [{ name: '50', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot textarea', '50', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /процента нет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's6: 25% → другое место', start: 5, langs: ['ru'], steps: [{ name: '25%', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot textarea', '25%', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /другое место/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's9: ease → причина', start: 8, langs: ['ru'], steps: [{ name: 'ease', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot textarea', 'ease', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /замедляется/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's12: «sakra infinite» → нет времени', start: 11, langs: ['ru'], steps: [{ name: 'без времени', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c15-slot textarea') && qa.q('.c15-slot textarea').value === 'sakra infinite', 3000, 'в поле «sakra infinite»');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /Времени всё ещё нет/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 'w1: Aylan → регистр', start: 13, langs: ['ru'], steps: [{ name: 'Aylan', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot-rule textarea', '.kub { animation: Aylan 2s linear infinite; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /маленькими буквами/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'w1: без linear → причина', start: 13, langs: ['ru'], steps: [{ name: 'ease', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.c15-slot-rule textarea', '.kub { animation: aylan 2s infinite; }', 'ввод'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /linear/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
    } }] },
    { name: 's13: верная строка → «работает»', start: 12, langs: ['ru'], steps: [{ name: 'первое правило', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верное правило');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length >= 1 && !qa.platform.nextEnabled(), 'правило погасло');
    } }] },
    { name: 's14: неверные повторы → причина', start: 14, langs: ['ru'], steps: [{ name: 'abc', run: async (qa) => {
      await qa.platform.ready();
      const f = qa.qa('.c15-slot textarea');
      qa.type(f[0], 'scale(1.3)', 'to'); qa.type(f[1], '1s', 'время'); qa.type(f[2], 'abc', 'повторы');
      await qa.click('.kz-ready', 'Готово');
      await qa.waitFor(() => !!qa.q('.b-sheet.is-hint') && /не повторы/.test(qa.text('.b-sheet.is-hint')), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 'q1: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про keyframes', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.c15-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.c15-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.c15-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла');
    } }] }
  ]
};
