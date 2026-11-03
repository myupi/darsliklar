// Сценарий проверки урока 4 курса HTML lessons/html/04-ssylki-i-atributy.jsx («Ссылки и атрибуты», облик «Редактор», 03.11.2026).
// Основной путь: все 17 экранов действиями ученика, честные переходы по ссылкам (адрес, «назад», «Файл не найден»),
// своя ссылка (s12, s13), починка href (s14), onFinished один раз, артефакт со своей ссылкой.
// Ветки: не тот файл (s3); файл не к той ссылке (s4); значение первым (s6); не та пара (s7); промах «до и после» (s10);
// верная строка в «найди ошибку» (q1); неверный ответ (q2). Причины — в панели снизу (.b-sheet.is-hint).
// Функции шагов выполняются в странице: помощники — прямо в шаге.

const STEPS = [
  { name: 's1: текст → ссылки', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z4-a'), 'сначала ссылок нет — простой текст');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.qa('.kz-br-page .z4-a').length === 2, 4000, 'появились две ссылки');
    await qa.click('.kz-br-page .z4-a', 'первая ссылка');
    await qa.waitFor(() => /osh\.html/.test(qa.text('.kz-br-url')), 3000, 'адрес стал osh.html');
    await qa.click('.kz-ar-btn', 'назад');
    await qa.waitFor(() => /index\.html/.test(qa.text('.kz-br-url')), 3000, 'вернулись на главную');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: a и href (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z4-a') && /index\.html/.test(qa.text('.kz-br-url')), 'ссылка есть, браузер вернулся на главную');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать имя файла', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.z4-slot textarea', 'oyinlar.html', 'имя файла');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    const links = qa.qa('.kz-br-page .z4-a');
    links[links.length - 1].click();
    await qa.waitFor(() => /oyinlar\.html/.test(qa.text('.kz-br-url')), 3000, 'ссылка открыла игры');
  } },
  { name: 's4: файлы к ссылкам меню', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    const put = async (f, k) => { await qa.click('.kz-scrap[data-id="' + f + '"]', f); await qa.click('.kz-line[data-place="' + k + '"]', 'ссылка ' + k); await qa.sleep(300); };
    await put('index.html', 0); await put('osh.html', 1); await put('oyinlar.html', 2);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z4-a').length === 3, 'три ссылки меню');
  } },
  { name: 's5: из чего состоит атрибут (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(qa.qa('.z4-anat-lbl').length === 4, 'четыре подписи частей');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS5).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
  } },
  { name: 's6: собрать атрибут', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['href', 'eq', 'val']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z4-a'), 'текст стал ссылкой');
  } },
  { name: 's7: часть ↔ название', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['a', 'href', 'val']) {
      await qa.waitFor(() => qa.q('.z4-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'часть нажимается');
      await qa.click('.z4-mtag[data-t="' + t + '"]', t); await qa.click('.z4-mcard[data-card="' + t + '"]', 'название ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z4-mcard.is-ok').length === 3, 'три пары');
  } },
  { name: 's8: что ломает ссылку (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    // «Файл не найден» виден, пока Коди его объясняет; в быстром прогоне — мгновение, поэтому проверяем по речи.
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.nfS8).test((e.data && e.data.text) || '')), 60000, 'честно: опечатка — «Файл не найден»');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS8).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
  } },
  { name: 's9: вписать </a>', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.kz-br-page .z4-a')[0].textContent.length > 20, 'честно: без </a> ссылкой стал весь хвост');
    qa.type('.kz-line textarea', '</a>', 'закрывающий a');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.kz-br-page .z4-a')[0].textContent.length < 20, 'ссылкой осталось только название');
  } },
  { name: 's10: до и после', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z4-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z4-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      const [bf, af] = qa.qa('.z4-ba .z4-card');
      const want = bf.querySelector('.z4-mini') ? 'val' : !bf.querySelector('.z4-a') ? 'href' : 'close';
      await qa.clickNth('.z4-tagbtn', ['href', 'close', 'val'].indexOf(want), want);
      await qa.waitFor(() => !qa.q('.z4-tagbtn') || qa.qa('.z4-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's11: по сайту (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => /osh\.html/.test(qa.text('.kz-br-url')), 40000, 'браузер сам открыл рецепт');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.events('tts').some((e) => new RegExp(qa.data.endS11).test((e.data && e.data.text) || '')), 'последняя реплика показа прозвучала');
  } },
  { name: 's12: текст своей ссылки по «Готово»', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myLink, 'текст ссылки');
    await qa.sleep(1600);
    qa.expect(qa.qa('.kz-br-page .z4-a').some((a) => a.textContent === qa.data.myLink) && !qa.platform.nextEnabled(), 'окно показывает ссылку сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's13: адрес своей страницы', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.z4-slot textarea', 'mening.html', 'файл своей страницы');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    await qa.click('.kz-br-page .z4-a', 'своя ссылка');
    await qa.waitFor(() => /mening\.html/.test(qa.text('.kz-br-url')) && qa.text('.kz-br-page h1, .kz-br-page .z4-h1') === qa.data.myLink, 3000, 'открылась своя страница');
  } },
  { name: 's14: вернуть href', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z4-a'), 'честно: без href — простой текст');
    await qa.clickText('.kz-scrap', 'href="mening.html"');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z4-a'), 'снова ссылка');
  } },
  { name: 'q1: найти строку с ошибкой', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'ссылка без href');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(!!qa.q('.kz-br.is-nf'), 'честно: опечатка — «Файл не найден»');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'опечатка в имени');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'q2: верно или нет', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z4-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z4-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z4-tf.is-ok'), 5000, 'ответ принят');
      await qa.sleep(300);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's15: вывод', shot: 's15-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 70000, '«Завершить урок»');
    qa.expect(qa.qa('.kz-br-page').every((pg) => pg.scrollHeight <= pg.clientHeight + 1), 'страница в окне целиком, без прокрутки');
  } },
  { name: 's15: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<a href="mening.html">' + qa.data.myLink + '</a>') >= 0, 'артефакт — своя ссылка', { html });
  } }
];

export default {
  title: 'Урок 4 курса HTML «Ссылки и атрибуты» (облик «Редактор»)',
  file: 'html/04-ssylki-i-atributy',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { myLink: 'Моя страница', endS2: 'говорит, куда вести', endS5: 'значение в кавычках', endS8: 'всегда закрывай ссылку', nfS8: 'Файл не найден', endS11: 'стрелка вверху возвращает' },
    uz: { myLink: 'Mening sahifam', endS2: 'qayerga borishni aytadi', endS5: "qo'shtirnoq ichida qiymat", endS8: 'doim yopuvchi', nfS8: 'Fayl topilmadi', endS11: 'orqaga qaytaradi' },
    en: { myLink: 'My page', endS2: 'says where it goes', endS5: 'value in quotes', endS8: 'always close the link', nfS8: 'File not found', endS11: 'takes you back' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: не тот файл → причина', start: 2, langs: ['ru'], steps: [{ name: 'osh.html', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z4-slot textarea', 'osh.html', 'другой файл');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's4: файл не к той ссылке → причина', start: 3, langs: ['ru'], steps: [{ name: 'osh.html к главной', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="osh.html"]', 'osh.html'); await qa.click('.kz-line[data-place="0"]', 'главная');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'файл остался в лотке');
    } }] },
    { name: 's6: значение первым → причина', start: 5, langs: ['ru'], steps: [{ name: 'значение первым', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="val"]', 'значение');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 3 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'a ↔ значение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z4-mtag[data-t="a"]:not(:disabled)'), 20000, 'часть нажимается');
      await qa.click('.z4-mtag[data-t="a"]', 'a'); await qa.click('.z4-mcard[data-card="val"]', 'значение');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z4-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's10: промах → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'не то изменение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z4-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z4-tagbtn', 2, 'значение вместо href');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 'q1: верная строка → «в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про закрывающий тег', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z4-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z4-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z4-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }] }
  ]
};
