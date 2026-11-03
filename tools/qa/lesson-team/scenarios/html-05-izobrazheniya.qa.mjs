// Сценарий проверки урока 5 курса HTML lessons/html/05-izobrazheniya.jsx («Изображения», облик «Редактор», 03.11.2026).
// Основной путь: все 17 экранов действиями ученика; честный браузер (нет src — ничего, нет файла — значок и alt,
// картинки в порядке строк кода); своя картинка (s12, s13), починка src (s14), onFinished один раз, артефакт.
// Ветки: не тот файл (s3); не та картинка (s4); лишний </img> (s6); не та пара (s7); имя файла вместо alt (s9);
// промах «до и после» (s10); href вместо src (s14); верная строка (q1); неверный ответ (q2).
// Функции шагов выполняются в странице: помощники — прямо в шаге.

const STEPS = [
  { name: 's1: страница без фото → с фото', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z5-pic'), 'сначала фото нет');
    await qa.click('.kz-btn.is-coral', 'Превратить');
    await qa.waitFor(() => qa.q('.kz-br-page .z5-pic'), 4000, 'появилось фото');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 's2: img и src (показ)', shot: 's2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready(30000);
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z5-pic'), 'с src — фото на странице');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS2).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's3: вписать имя файла', shot: 's3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z5-pic'), 'без файла фото нет');
    qa.type('.z5-slot textarea', 'top.jpg', 'имя файла');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z5-pic'), 'фото мяча на странице');
  } },
  { name: 's4: строка кода ↔ картинка', shot: 's4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const [r, j] of [[1, 1], [2, 2], [3, 0]]) {
      await qa.waitFor(() => new RegExp(r + '/3').test(qa.text('.kz-ask-n')) && qa.q('.kz-br-page button.z5-map:not(:disabled)'), 30000, 'раунд ' + r);
      qa.expect(qa.qa('.kz-br-page button.z5-map').length === 3, 'три картинки в строку');
      await qa.clickNth('.kz-br-page button.z5-map', j, 'картинка горящей строки');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 's5: alt и без </img> (показ)', shot: 's5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.brokenS5).test((e.data && e.data.text) || '')), 60000, 'честно: нет файла — значок и alt');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.z5-void') && !!qa.q('.kz-br-page .z5-pic'), 'фото снова на месте, «</img> не нужен»');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS5).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's6: собрать <img …>', shot: 's6-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const id of ['open', 'alt', 'src', 'gt']) { await qa.click('.kz-scrap[data-id="' + id + '"]', id); await qa.sleep(300); }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано (порядок атрибутов свободный)');
    qa.expect(!!qa.q('.kz-br-page .z5-pic'), 'фото мяча появилось');
  } },
  { name: 's7: img / src / alt ↔ дело', shot: 's7-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    for (const t of ['img', 'src', 'alt']) {
      await qa.waitFor(() => qa.q('.z5-mtag[data-t="' + t + '"]:not(:disabled)'), 20000, 'слово нажимается');
      await qa.click('.z5-mtag[data-t="' + t + '"]', t); await qa.click('.z5-mcard[data-card="' + t + '"]', 'дело ' + t); await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.z5-mcard.is-ok').length === 3, 'три пары');
  } },
  { name: 's8: что ломает картинку (показ)', shot: 's8-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.typoS8).test((e.data && e.data.text) || '')), 60000, 'опечатка в имени файла объяснена');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(!!qa.q('.kz-br-page .z5-pic'), 'в конце фото на месте');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS8).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's9: написать alt', shot: 's9-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.kz-br-page .z5-broken-ic') && !qa.q('.kz-br-page .z5-alt'), 'честно: файла нет — один значок');
    qa.type('.z5-slot textarea', qa.data.ball, 'alt');
    await qa.sleep(300);
    qa.expect(qa.text('.kz-br-page .z5-alt') === qa.data.ball, 'текст alt сразу рядом со значком');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 's10: до и после', shot: 's10-done', run: async (qa) => {
    await qa.platform.next();
    for (let r = 0; r < 6 && qa.q('.z5-tagbtn'); r += 1) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z5-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      const bf = qa.qa('.z5-ba .z5-card')[0];
      const want = !bf.querySelector('.z5-broken') ? 'src' : bf.querySelector('.z5-alt') ? 'val' : 'alt';
      await qa.clickNth('.z5-tagbtn', ['src', 'val', 'alt'].indexOf(want), want);
      await qa.waitFor(() => !qa.q('.z5-tagbtn') || qa.qa('.z5-tagbtn').every((b) => !b.disabled) || qa.platform.nextEnabled(), 30000, 'следующий раунд');
      await qa.sleep(400);
    }
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все раунды');
  } },
  { name: 's11: страница целиком (показ)', shot: 's11-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-sheet .kz-btn') && !qa.q('.kz-hand'), 'показ: ни кнопок, ни руки');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'показ закончен');
    qa.expect(qa.qa('.kz-br-page .z5-blk').length === 3 && !!qa.q('.kz-br-page .z5-pic'), 'заголовок, фото и текст');
    await qa.waitFor(() => qa.events('tts').some((e) => new RegExp(qa.data.endS11).test((e.data && e.data.text) || '')), 15000, 'последняя реплика показа прозвучала');
  } },
  { name: 's12: своя картинка', shot: 's12-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.z5-slot textarea', 'gul.jpg', 'файл картинки');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z5-pic'), 'своя картинка на странице');
  } },
  { name: 's13: свой alt по «Готово»', shot: 's13-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.kz-line textarea', qa.data.myAlt, 'alt');
    await qa.sleep(1600);
    qa.expect(qa.text('.z5-reader b') === qa.data.myAlt && !qa.platform.nextEnabled(), 'программа чтения показывает alt сразу, пауза не засчитывает');
    await qa.click('.kz-ready', 'Готово');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано по «Готово»');
  } },
  { name: 's14: вернуть src', shot: 's14-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-br-page .z5-pic') && qa.text('.kz-br-page .z5-alt-only') === qa.data.myAlt, 'честно: без src — только alt');
    await qa.clickText('.kz-scrap', 'src');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.kz-br-page .z5-pic'), 'картинка вернулась');
  } },
  { name: 'q1: найти строку с ошибкой', shot: 'q1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.kz-code .kz-line .led'), 'до первой попытки ответ не подсвечен');
    qa.expect(!!qa.q('.kz-br-page .z5-broken'), 'честно: опечатка — значок сломанной картинки');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 1, 'опечатка в имени файла');
    await qa.waitFor(() => /2\/2/.test(qa.text('.kz-ask-n')) && qa.q('.kz-code .kz-line.kz-tap:not(:disabled)'), 30000, 'второй раунд');
    await qa.platform.ready(30000);
    qa.expect(!!qa.q('.kz-br-page .z5-alt-only'), 'честно: href вместо src — только alt');
    await qa.clickNth('.kz-code .kz-line.kz-tap', 2, 'href вместо src');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
  } },
  { name: 'q2: верно или нет', shot: 'q2-done', run: async (qa) => {
    await qa.platform.next();
    for (const k of [1, 0, 1]) {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.q('.z5-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z5-tf', k, k ? 'Неверно' : 'Верно');
      await qa.waitFor(() => qa.q('.z5-tf.is-ok'), 5000, 'ответ принят');
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
    qa.expect(html.indexOf('<img src="gul.jpg" alt="' + qa.data.myAlt + '">') >= 0, 'артефакт — своя картинка с alt', { html });
  } }
];

export default {
  title: 'Урок 5 курса HTML «Изображения» (облик «Редактор»)',
  file: 'html/05-izobrazheniya',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 9, 12, 13],
  expectFinish: true,
  data: {
    ru: { ball: 'Футбольный мяч', myAlt: 'Мой цветок', endS2: 'какой файл показать', brokenS5: 'значок сломанной картинки и текст', endS5: 'Оба пишут внутри тега', typoS8: 'буква в букву', endS8: 'писать точно', endS11: 'там она и появится' },
    uz: { ball: "Futbol to'pi", myAlt: 'Mening gulim', endS2: "qaysi faylni ko'rsatishni aytadi", brokenS5: 'buzilgan rasm belgisini va', endS5: 'ichida yoziladi', typoS8: 'harfma-harf', endS8: 'aniq yozish kerak', endS11: "o'sha joyda chiqadi" },
    en: { ball: 'A football', myAlt: 'My flower', endS2: 'which file to show', brokenS5: 'broken picture icon and the', endS5: 'Both go inside the', typoS8: 'letter by letter', endS8: 'written exactly', endS11: 'shows up on the page' }
  },
  steps: STEPS,
  flows: [
    { name: 's3: не тот файл → причина', start: 2, langs: ['ru'], steps: [{ name: 'osh.jpg', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z5-slot textarea', 'osh.jpg', 'другая картинка');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's4: не та картинка → причина', start: 3, langs: ['ru'], steps: [{ name: 'первая картинка', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.kz-br-page button.z5-map:not(:disabled)'), 20000, 'картинки нажимаются');
      await qa.clickNth('.kz-br-page button.z5-map', 0, 'не та картинка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(/1\/3/.test(qa.text('.kz-ask-n')) && !qa.platform.nextEnabled(), 'раунд тот же');
    } }] },
    { name: 's6: лишний </img> → причина', start: 5, langs: ['ru'], steps: [{ name: '</img>', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.kz-scrap[data-id="close"]', '</img>');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-tray .kz-scrap').length === 5 && !qa.platform.nextEnabled(), 'кусок остался в лотке');
    } }] },
    { name: 's7: не та пара → причина', start: 6, langs: ['ru'], steps: [{ name: 'img ↔ alt', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z5-mtag[data-t="img"]:not(:disabled)'), 20000, 'слово нажимается');
      await qa.click('.z5-mtag[data-t="img"]', 'img'); await qa.click('.z5-mcard[data-card="alt"]', 'дело alt');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.z5-mcard.is-ok'), 'пара не закрепилась');
    } }] },
    { name: 's9: имя файла вместо alt → причина', start: 8, langs: ['ru'], steps: [{ name: 'koptok.jpg', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.z5-slot textarea', 'koptok.jpg', 'имя файла');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 's10: промах → дополнительный раунд', start: 9, langs: ['ru'], steps: [{ name: 'не то изменение', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z5-tagbtn:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z5-tagbtn', 2, 'alt вместо src');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      await qa.waitFor(() => /\/4/.test(qa.text('.kz-ask-n')), 30000, 'раундов стало четыре');
    } }] },
    { name: 's14: href вместо src → причина', start: 13, langs: ['ru'], steps: [{ name: 'href', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.kz-scrap', 'href');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(!qa.q('.kz-br-page .z5-pic') && !qa.platform.nextEnabled(), 'картинки нет, «Дальше» закрыта');
    } }] },
    { name: 'q1: верная строка → «в порядке»', start: 14, langs: ['ru'], steps: [{ name: 'первая строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.kz-code .kz-line.kz-tap', 0, 'верная строка');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'причина в панели');
      qa.expect(qa.qa('.kz-code .kz-line.is-off').length === 1 && !qa.platform.nextEnabled(), 'строка погасла, «Дальше» закрыта');
    } }] },
    { name: 'q2: неверный ответ → объяснение', start: 15, langs: ['ru'], steps: [{ name: '«Верно» про закрывающий тег', run: async (qa) => {
      await qa.platform.ready();
      await qa.waitFor(() => qa.q('.z5-tf:not(:disabled)'), 30000, 'кнопки нажимаются');
      await qa.clickNth('.z5-tf', 0, 'Верно');
      await qa.waitFor(() => qa.q('.b-sheet.is-hint'), 3000, 'объяснение в панели');
      qa.expect(qa.qa('.z5-tf.is-off').length === 1 && !qa.platform.nextEnabled(), 'кнопка погасла, можно выбрать снова');
    } }] }
  ]
};
