// Сценарий проверки практики к уроку 5 курса HTML lessons/html/05p-izobrazheniya.jsx («Зоопарк Коди»,
// облик «Редактор», 04.11.2026, на основе 04p).
// Основной путь: 7 слайдов действиями ученика — сохранение (фото пропали, остался alt), пять страниц зоопарка
// (имя файла в src, строка img с src и alt, картинка и абзац, найти href вместо src, своя страница: h1, img, p),
// вывод; onFinished один раз, артефакт — своя страница. Ветки: причина в панели, подсказка после второй неудачи
// подряд, лампочка до образца и дополнительная задача, нет alt, </img>, нет файла (значок сломанной картинки),
// не та строка, страница без картинки, «Назад» хранит код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — фото пропали', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 4 && !!qa.q('.a5-imgbox'), 'до сохранения вкладки горят, на странице фото');
    await qa.click('.a5-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a5-tab.is-off').length === 4, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-alt'), 'честно: без src — только текст alt');
    await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'рассказано');
  } },
  { name: 't1: имя файла в src', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-alt'), 'пока src пустой — только alt');
    qa.type('.kz-gap textarea', 'sher.jpg', 'имя файла');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-imgbox'), 'картинка появилась сразу при наборе');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.b-sheet.is-ok'), 'панель «Молодец!»');
  } },
  { name: 't2: строка img', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 1, 'первая вкладка горит');
    const ws = (qa.text('.kz-ask').match(/[«“]([^»”]+)[»”]/g) || []).map((x) => x.slice(1, -1));
    qa.type('.a5-ta', '  <img src="' + ws[0] + '" alt="' + ws[1] + '">', 'строка');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-imgbox'), 'картинка на странице сразу');
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
  { name: 't4: href вместо src', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-alt'), 'честно: с href картинки нет, только alt');
    await qa.clickNth('.a5-tap', 2, 'строка img');
    await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
    qa.type('.a5-ta', qa.q('.a5-ta').value.replace('href=', 'src='), 'src вместо href');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.a5-imgbox'), 'картинка появилась');
  } },
  { name: 't5: своя страница', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.a5-ta', '<h1>Моя бабочка & я</h1>\n<img src="babochka.jpg" alt="Бабочка">\n<p>Она красивая.</p>', 'нет файла');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-broken'), 'честно: нет файла — значок сломанной картинки');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина: нет файла');
    qa.expect(/babochka\.jpg/.test(qa.text('.b-sheet p')), 'в причине — имя файла');
    qa.type('.a5-ta', '<h1>Моя бабочка & я</h1>\n<img src="kapalak.jpg" alt="Бабочка">\n<p>Она красивая.</p>', 'страница');
    await qa.sleep(200);
    qa.expect(qa.qa('.a5-tree-r.is-ok').length === 4, 'схема отмечает body, h1, img и p');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 'fin: вывод', shot: 'fin-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 80000, '«Завершить практику»');
    qa.expect(qa.qa('.a5-tab.is-ok').length === 4 && !qa.q('.a5-fav.is-off'), 'все пять вкладок горят');
    qa.expect(!!qa.q('.a5-imgbox') && /Моя бабочка & я/.test(qa.text('.a5-h1')), 'на открытой вкладке — своя страница с картинкой');
  } },
  { name: 'fin: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Моя бабочка & я' && a.src === 'kapalak.jpg' && /<h1>Моя бабочка &amp; я<\/h1>/.test(a.html) && /<img src="kapalak.jpg" alt="Бабочка">/.test(a.html),
      'артефакт — своя страница, текст экранирован', { a });
  } }
];
export default {
  title: 'Практика 5 курса HTML «Зоопарк Коди» (облик «Редактор»)',
  file: 'html/05p-izobrazheniya',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 6],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: [
    { name: 't1: другой файл → причина, вторая неудача → подсказка; нет файла', start: 1, langs: ['ru'], steps: [{ name: 't1: ветки', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'fil.jpg', 'другой файл'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.type('.kz-gap textarea', 'Sher.jpg', 'с большой буквы'); await qa.sleep(200);
      qa.expect(!!qa.q('.a5-broken'), 'браузер честно: значок сломанной картинки');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      const two = qa.text('.b-sheet p');
      qa.expect(/fil\.jpg/.test(one) && /Sher\.jpg/.test(two) && /src/.test(two) && !qa.platform.nextEnabled(), 'вторая неудача — причина и ступень подсказки', { one, two });} }] },
    { name: 't2: лампочка до образца → дополнительная задача; нет alt; </img>', start: 2, langs: ['ru'], steps: [{ name: 't2: образец и ещё разок', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a5-ta', '  <img src="fil.jpg">', 'без alt'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Нет alt/.test(qa.text('.b-sheet p')), 3000, 'причина: нет alt');
      qa.type('.a5-ta', '  <img src="fil.jpg" alt="Слон"></img>', 'с </img>'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /не закрывается/.test(qa.text('.b-sheet p')), 3000, 'причина: img не закрывается');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a5-sample'), 3000, 'образец третьей ступени');
      qa.type('.a5-ta', '  <img src="fil.jpg" alt="Слон">', 'строка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.a5-ta', '  <img src="kapalak.jpg" alt="Бабочка">', 'бабочка'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't3: без абзаца, абзац раньше картинки', start: 3, langs: ['ru'], steps: [{ name: 't3: правила', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a5-ta', '<img src="jirafa.jpg" alt="Жираф">', 'без p'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /под ней напиши абзац/.test(qa.text('.b-sheet p')), 3000, 'нужен абзац');
      qa.type('.a5-ta', '<p>Шея</p><img src="jirafa.jpg" alt="Жираф">', 'p раньше'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Сначала картинка/.test(qa.text('.b-sheet p')), 3000, 'сначала картинка');} }] },
    { name: 't4: не та строка → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a5-tap', 3, 'абзац ниже'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a5-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');} }] },
    { name: 't5: страница без картинки → нужна картинка', start: 5, langs: ['ru'], steps: [{ name: 't5: картинка', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.a5-ta', '<h1>Моя</h1><p>Текст</p>', 'без img'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /поставь картинку/.test(qa.text('.b-sheet p')), 3000, 'нужна картинка');} }] },
    { name: '«Назад» хранит код и карту', start: 1, langs: ['ru'], steps: [{ name: 'назад и повтор', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.kz-gap textarea', 'sher.jpg', 'файл'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'т1 засчитано');
      await qa.platform.next(); await qa.platform.ready();
      qa.type('.a5-ta', '  <img src="fi', 'начало строки'); await qa.sleep(300);
      qa.platform.back(); await qa.sleep(1500); await qa.platform.ready();
      await qa.platform.next(); await qa.platform.ready();
      qa.expect(/<img src="fi/.test(qa.q('.a5-ta').value), 'код на месте после «Назад»');
      qa.expect(qa.qa('.a5-tab.is-ok').length === 1, 'первая вкладка по-прежнему горит');} }] }
  ]
};
