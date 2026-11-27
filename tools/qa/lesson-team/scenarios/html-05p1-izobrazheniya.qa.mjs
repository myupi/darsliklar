// Сценарий проверки практики к уроку 5, ЧАСТЬ 1 lessons/html/05p1-izobrazheniya.jsx («Зоопарк Коди»: img, src и alt;
// собрана tools/qism/build-prac.mjs, 27.11.2026). 6 слайдов действиями ученика: сохранение (src пропал — остался alt),
// четыре страницы (имя файла в src, строка img, опечатка в имени файла, href вместо src), вывод части 1; onFinished
// один раз, артефакт — починенная страница «Панда». Ветки: причина в панели, подсказка после второй неудачи подряд,
// лампочка до образца и дополнительная задача, нет alt, </img>, не тот файл, опечатка (значок сломанной картинки),
// не та строка, «Назад» сохраняет код и карту. Шаги — в странице.

const STEPS = [
  { name: 's1: сохранение — фото пропали', shot: 's1-done', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 3 && !!qa.q('.a5-imgbox'), 'до сохранения четыре вкладки горят, на странице фото');
    await qa.click('.a5-publish', 'Сохранить');
    await qa.waitFor(() => qa.qa('.a5-tab.is-off').length === 3, 5000, 'вкладки погасли');
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-alt'), 'честно: без src — только текст alt');
    qa.expect(!/пят/i.test(qa.text('.kz-ask')), 'в строке задания нет «пяти страниц»');
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
  { name: 't3: опечатка в имени файла', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 2, 'две вкладки горят');
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-broken'), 'честно: нет такого файла — значок сломанной картинки и alt');
    qa.expect(qa.q('.kz-gap textarea').value === 'toshbqa.jpg' && !!qa.q('.a5-files'), 'в src готовое неверное имя, рядом список файлов');
    qa.type('.kz-gap textarea', 'toshbaqa.jpg', 'исправленное имя');
    await qa.sleep(200);
    qa.expect(!!qa.q('.a5-imgbox') && !qa.q('.a5-broken'), 'картинка черепахи появилась сразу при правке');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: href вместо src', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.a5-tab.is-ok').length === 3, 'три вкладки горят, четвёртая открыта');
    qa.expect(!qa.q('.a5-imgbox') && !!qa.q('.a5-alt'), 'честно: с href картинки нет, только alt');
    await qa.clickNth('.a5-tap', 2, 'строка img');
    await qa.waitFor(() => qa.q('.a5-ta'), 3000, 'строка стала полем');
    qa.type('.a5-ta', qa.q('.a5-ta').value.replace('href=', 'src='), 'src вместо href');
    await qa.click('.key-go', 'Проверить');
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(!!qa.q('.a5-imgbox'), 'картинка появилась');
  } },
  { name: 'e1: вывод части 1', shot: 'e1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, '«Завершить практику»');
    qa.expect(qa.qa('.a5-tab.is-ok').length === 3 && !qa.q('.a5-fav.is-off'), 'все четыре вкладки горят');
    qa.expect(!!qa.q('.a5-imgbox') && qa.qa('.kz-role').length === 4, 'на открытой вкладке — страница панды с картинкой; четыре плашки');
    qa.expect(/картинка из интернета/.test(qa.text('.kz-next')), 'дальше — часть 2');
  } },
  { name: 'e1: завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const a = (qa.payload() || {}).artifact;
    qa.expect(!!a && a.type === 'html-page' && a.heading === 'Панда' && a.src === 'panda.jpg' && a.alt === 'Панда' && /<img src="panda.jpg" alt="Панда">/.test(a.html) && /<p>Панда целый день ест бамбук\.<\/p>/.test(a.html),
      'артефакт — починенная страница панды', { a });
  } }
];
export default {
  title: 'Практика 5, часть 1, курса HTML «Зоопарк Коди: img, src и alt» (облик «Редактор»)',
  file: 'html/05p1-izobrazheniya',
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
    { name: 't3: имя не исправлено / не тот файл → причина; лампочка → образец → дополнительная (панда)', start: 3, langs: ['ru'], steps: [{ name: 't3: ветки', run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в красной панели');
      const one = qa.text('.b-sheet p');
      qa.expect(/toshbqa\.jpg/.test(one) && /значок/.test(one) && !qa.platform.nextEnabled(), 'имя не исправлено: такого файла нет, вышел значок', { one });
      qa.type('.kz-gap textarea', 'sher.jpg', 'не тот файл'); await qa.sleep(200);
      qa.expect(!!qa.q('.a5-imgbox'), 'на странице чужое животное — честно');
      await qa.click('.key-go', 'Проверить'); await qa.sleep(400);
      qa.expect(/другого животного/.test(qa.text('.b-sheet p')) && /toshbaqa\.jpg/.test(qa.text('.b-sheet p')), 'не тот файл: картинка другого животного, нужен toshbaqa.jpg');
      for (let i = 0; i < 3; i += 1) { qa.platform.hint(); await qa.sleep(300); }
      await qa.waitFor(() => qa.q('.a5-sample'), 3000, 'образец третьей ступени');
      qa.type('.kz-gap textarea', 'toshbaqa.jpg', 'исправленное имя'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => /Ещё разок/.test(qa.text('.kz-ask')), 3000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.expect(qa.q('.kz-gap textarea').value === 'pnada.jpg' && !!qa.q('.a5-broken'), 'в дополнительной задаче — панда с перепутанными буквами');
      qa.type('.kz-gap textarea', 'panda.jpg', 'panda.jpg'); await qa.click('.key-go', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано после дополнительной');} }] },
    { name: 't4: не та строка → причина', start: 4, langs: ['ru'], steps: [{ name: 't4: не та строка', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.a5-tap', 3, 'абзац ниже'); await qa.waitFor(() => qa.q('.b-sheet.is-err'), 3000, 'причина в панели');
      qa.expect(!qa.q('.a5-ta') && /выше/.test(qa.text('.b-sheet p')), 'строка не раскрылась, подсказка — выше');} }] },
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
