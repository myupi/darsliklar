// Сценарий проверки практики к уроку 5, ЧАСТЬ 2 lessons/html/05p2-izobrazheniya.jsx («Зоопарк Коди»: картинка из
// интернета и своя страница; собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: «Открыть папку»
// (картинки пингвина нет в нашей папке — она на kodi.uz), четыре страницы (полный адрес картинки в src, адрес без https,
// картинка и абзац, своя страница: h1, img и p), вывод; onFinished один раз, артефакт — своя страница. Ветки: причина в
// панели, подсказка после второй неудачи подряд, лампочка до образца и дополнительная задача, адрес без https, http,
// другая картинка, нет такой картинки на сайте, алт, не та строка, страница без картинки, «Назад» сохраняет код и карту.
// Шаги — в странице.

const STEPS = [
  { name: 'h2: «Открыть папку»', shot: 'h2-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 3 && !qa.q('.a5-imgbox') && !!qa.q('.a5-broken'), 'четыре вкладки горят, на странице значок сломанной картинки и alt');
    qa.expect(!qa.q('.w5-where'), 'пока папка закрыта — подсказки «где лежит файл» нет');
    await qa.click('.a5-publish', 'Открыть папку');
    await qa.waitFor(() => qa.q('.w5-where'), 5000, 'папка открыта');
    qa.expect(qa.qa('.w5-wr').length === 2 && qa.q('.w5-wr.is-no') && qa.q('.w5-wr.is-yes'), 'две строки: в нашей папке нет, на kodi.uz есть');
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');
  } },
  { name: 't1: полный адрес картинки', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-alt'), 'пока src пустой — только alt');
    qa.expect(qa.qa('.a5-slot').length === 4 && !!qa.q('.w5-addr'), 'видны четыре части адреса, имя сайта и файла');
    qa.type('.kz-gap textarea', 'https://kodi.uz/pingvin.jpg', 'полный адрес');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-imgbox'), 'пингвин появился сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: адрес без https', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 1, 'первая вкладка горит');
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-broken'), 'честно: адрес без https — браузер ищет в своей папке, значок сломанной картинки');
    await qa.clickNth('.a5-tap', 2, 'строка img');
    await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
    const v = qa.q('.a5-ta').value;
    qa.expect(/src="kodi\.uz\/flamingo\.jpg"/.test(v), 'в строке адрес без https');
    qa.type('.a5-ta', v.replace('src="kodi.uz', 'src="https://kodi.uz'), 'https в начало');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-imgbox'), 'фламинго появился сразу при правке');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't3: картинка и абзац', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a5-ta', '  <img src="jirafa.jpg" alt="Жираф">\n  <p>У жирафа длинная шея.</p>', 'блок');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-imgbox') && !!qa.q('.a5-p'), 'картинка и абзац на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: своя страница', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
    qa.expect(!!qa.q('.w5-files') && qa.qa('.w5-files code.is-web').length === 3, 'список: файлы нашей папки и три картинки с kodi.uz');
    qa.type('.a5-ta', '<h1>Моя обезьяна & я</h1>\n<img src="kodi.uz/maymun.jpg" alt="Обезьяна">\n<p>Она ловкая.</p>', 'без https');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-broken'), 'честно: без https — значок сломанной картинки');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: нет https');
    qa.expect(/https/.test(qa.text('.b-sheet p')), 'в причине — про https');
    qa.type('.a5-ta', '<h1>Моя обезьяна & я</h1>\n<img src="https://kodi.uz/maymun.jpg" alt="Обезьяна">\n<p>Она ловкая.</p>', 'страница');
    await qa.sleep(200);
    qa.expect(qa.qa('.a5-tree-r.is-ok').length === 4, 'схема отмечает body, h1, img и p');
    qa.expect(!!qa.q('.a5-imgbox'), 'обезьяна с сайта на странице');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 100000, '«Завершить практику»');
    qa.expect(qa.qa('.a5-tab.is-ok').length === 3 && !qa.q('.a5-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(!!qa.q('.a5-imgbox') && /Моя обезьяна & я/.test(qa.text('.a5-h1')), 'на открытой вкладке — своя страница с картинкой');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Моя обезьяна & я' && a.src === 'https://kodi.uz/maymun.jpg' && /<h1>Моя обезьяна &amp; я<\/h1>/.test(a.html) && a.html.indexOf('<img src="https://kodi.uz/maymun.jpg" alt="Обезьяна">') >= 0,
      'артефакт — своя страница, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 5, часть 2, курса HTML «Зоопарк Коди: картинка из интернета и своя страница» (облик «Редактор»)',
  file: 'html/05p2-izobrazheniya',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 6,
  inputScreens: [2, 3, 4, 5],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: другая картинка и без https → причины; вторая неудача → подсказка; http; нет такой картинки', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'https://kodi.uz/maymun.jpg', 'другая картинка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'kodi.uz/pingvin.jpg', 'без https'); await qa.sleep(200);
      qa.expect(!!qa.q('.a5-broken'), 'браузер честно: без https — значок сломанной картинки');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/другого животного/.test(one) && /pingvin\.jpg/.test(one) && /нет https/.test(two) && /лежит не в нашей папке/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });
      qa.type('.kz-gap textarea', 'http://kodi.uz/pingvin.jpg', 'http'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/без буквы s/.test(qa.text('.b-sheet p')), 'http без s: нужен https');
      qa.type('.kz-gap textarea', 'https://kodi.uz/slon.jpg', 'нет такой картинки'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/нет такой картинки/.test(qa.text('.b-sheet p')), 'на сайте нет такой картинки');
      qa.type('.kz-gap textarea', 'https:/kodi.uz/pingvin.jpg', 'одна косая'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/двоеточие и две косые/.test(qa.text('.b-sheet p')), 'после https — двоеточие и две косые черты');} }] },
    { name: 't1: лампочка до образца → дополнительная задача (обезьяна)', start: 1, langs: ['ru'], steps: [{ name: 't1: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a5-sample'), 3000, 'образец третьей ступени');
      qa.type('.kz-gap textarea', 'https://kodi.uz/pingvin.jpg', 'адрес'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.kz-gap textarea', 'https://kodi.uz/maymun.jpg', 'обезьяна'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't2: не та строка → причина; нет https / http / alt', start: 2, langs: ['ru'], steps: [{ name: 't2: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a5-tap', 3, 'абзац ниже'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a5-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');
      await qa.clickNth('.a5-tap', 2, 'строка img'); await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нет https/.test(qa.text('.b-sheet p')), 3000, 'причина: в адресе нет https');
      const v = qa.q('.a5-ta').value;
      qa.type('.a5-ta', v.replace('src="kodi.uz', 'src="http://kodi.uz'), 'http'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/без буквы s/.test(qa.text('.b-sheet p')), 'http без s: нужен https');
      qa.type('.a5-ta', v.replace('src="kodi.uz', 'src="https://kodi.uz').replace(/alt="[^"]*"/, 'alt="Птица"'), 'alt другой'); await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/alt не трогай/.test(qa.text('.b-sheet p')), 'alt менять не нужно');} }] },
    { name: 't2: лампочка до образца → дополнительная задача (обезьяна)', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a5-sample'), 3000, 'образец третьей ступени');
      await qa.clickNth('.a5-tap', 2, 'строка img'); await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
      qa.type('.a5-ta', qa.q('.a5-ta').value.replace('src="kodi.uz', 'src="https://kodi.uz'), 'https'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.expect(/maymun\.jpg/.test(qa.text('.a5-tap:nth-child(3)')) && !!qa.q('.a5-broken'), 'в дополнительной задаче — страница обезьяны, адрес без https');
      await qa.clickNth('.a5-tap', 2, 'строка img'); await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
      qa.type('.a5-ta', qa.q('.a5-ta').value.replace('src="kodi.uz', 'src="https://kodi.uz'), 'https'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: без абзаца, абзац раньше картинки', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a5-ta', '<img src="jirafa.jpg" alt="Жираф">', 'без p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /под ней напиши абзац/.test(qa.text('.b-sheet p')), 3000, 'нужен абзац');
      qa.type('.a5-ta', '<p>Шея</p><img src="jirafa.jpg" alt="Жираф">', 'p раньше'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Сначала картинка/.test(qa.text('.b-sheet p')), 3000, 'сначала картинка');} }] },
    { name: 't4: страница без картинки → нужна картинка; нет такой картинки на сайте; своя из папки', start: 4, langs: ['ru'], steps: [{ name: 't4: порядок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a5-ta', '<h1>Моя</h1><p>Текст</p>', 'без img'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /поставь картинку/.test(qa.text('.b-sheet p')), 3000, 'нужна картинка');
      qa.type('.a5-ta', '<h1>Моя</h1><img src="https://kodi.uz/slon.jpg" alt="Слон"><p>Текст</p>', 'нет такой на сайте'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /нет такой картинки/.test(qa.text('.b-sheet p')), 3000, 'на kodi.uz нет такой картинки');
      qa.type('.a5-ta', '<h1>Моя</h1><img src="toshbaqa.jpg" alt="Черепаха"><p>Текст</p>', 'файл из своей папки'); await qa.sleep(200);
      qa.expect(qa.qa('.a5-tree-r.is-ok').length === 4 && !!qa.q('.a5-imgbox'), 'своя картинка из папки тоже подходит');
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'https://kodi.uz/pingvin.jpg', 'адрес'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      await qa.clickNth('.a5-tap', 2, 'строка img'); await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
      qa.type('.a5-ta', '  <img src="http', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(!!qa.q('.a5-ta') && /<img src="http/.test(qa.q('.a5-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a5-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
