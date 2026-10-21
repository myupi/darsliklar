// Сценарий проверки практики к уроку 1 курса HTML lessons/html/01p-struktura-dokumenta.jsx («Бумажная улица», 7 слайдов).
// Основной путь: хук (касание «Ветер!»), пять заданий от лёгкого к сложному действиями ученика (снимок каждого экрана —
// в решённом виде), вывод, onFinished один раз, артефакт — своя страница из t5.
// Ветки: теги в поле названия; открывающий вместо закрывающего, вторая неудача → подсказка; неверное место в школе;
// три лампочки → образец → дополнительная задача.
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 'хук: ветер разметал улицу', shot: 'intro', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-street .pp-house').length === 5, 'на улице пять домов');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 4, 'до ветра четыре дома целые');
    await qa.waitFor(() => { const b = qa.q('.pp-wind'); return b && !b.disabled; }, 30000, 'кнопка «Ветер» включилась');
    await qa.click('.pp-wind', 'Ветер');
    await qa.sleep(600);
    qa.expect(qa.qa('.pp-street .pp-house.is-wait').length === 4, 'после ветра дома выцвели');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'задача рассказана');
  } },
  { name: 't1: своё название пекарни в title', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-tab-t') === 'index.html', 'на вкладке index.html');
    qa.type('.cv textarea', qa.data.bakery, 'название');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-tab-t') === qa.data.bakery, 'вкладка = своё название');
  } },
  { name: 't2: дописать </title>', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.text('.kz-br-tab-t').indexOf('</head>') > 0, 'вкладка съела страницу');
    qa.type('.ed-ta', '<title>' + qa.data.post + '</title>', 'строка title');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-tab-t') === qa.data.post, 'вкладка = название почты');
  } },
  { name: 't3: блок body', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.ed-ta', '<body>\n  ' + qa.data.film + '\n</body>', 'блок body');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pp-page') === qa.data.film, 'окно = свой текст');
  } },
  { name: 't4: место конца head → </head>', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.ed-bar.is-open').length > 0, 'head не закрыт — полоска пунктиром');
    await qa.clickNth('.pp-gap', 2, 'место после title');
    await qa.waitFor(() => qa.q('.ed-ta'), 3000, 'строка ввода');
    qa.type('.ed-ta', '</head>', 'закрывающий head');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.ed-bar.is-open').length === 0, 'все полоски сплошные');
  } },
  { name: 't5: свой дом — head с title и body', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.type('.ed-ta', '<!DOCTYPE html>\n<html>\n  <head>\n    <title>' + qa.data.home + '</title>\n  </head>\n  <body>\n    ' + qa.data.homeText + '\n  </body>\n</html>', 'свой документ');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.kz-br-tab-t') === qa.data.home, 'вкладка = название дома');
  } },
  { name: 'вывод: улица горит, своя страница', shot: 'fin', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить»');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 5, 'все пять домов горят');
    qa.expect(qa.text('.pp-fin .kz-br-tab-t') === qa.data.home, 'в выводе — своя страница');
  } },
  { name: 'завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<title>' + qa.data.home + '</title>') >= 0 && html.indexOf(qa.data.homeText) >= 0, 'артефакт — своя страница', { html });
  } }
];

export default {
  title: 'Практика к уроку 1 курса HTML «Бумажная улица» (7 слайдов)',
  file: 'html/01p-struktura-dokumenta',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 5, 6],
  expectFinish: true,
  data: {
    ru: { bakery: 'Тёплый хлеб', post: 'Почта', film: 'Сегодня фильм про космос.', home: 'Домик у реки', homeText: 'Здесь живут кот и пёс.' },
    uz: { bakery: 'Issiq non', post: 'Pochta', film: 'Bugun koinot haqida film.', home: 'Daryo bo‘yidagi uy', homeText: 'Bu yerda mushuk va it yashaydi.' },
    en: { bakery: 'Warm Bread', post: 'Post office', film: 'A space film today.', home: 'River House', homeText: 'A cat and a dog live here.' }
  },
  steps: STEPS,
  flows: [
    { name: 't1: теги в поле названия', start: 1, langs: ['ru'], steps: [{ name: '<b> → причина, без засчёта', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.cv textarea', '<b>Хлеб</b>', 'теги');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/уголков/i.test(qa.text('.pp-note')), 'причина: без уголков', { note: qa.text('.pp-note') });
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 't2: открывающий вместо закрывающего, вторая неудача → подсказка', start: 2, langs: ['ru'], steps: [{ name: '<title> дважды', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<title>Почта<title>', 'открывающий');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-fb') && /косая черта/.test(qa.text('.pp-note')), 'причина: нужна косая черта', { note: qa.text('.pp-note') });
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'со второй неудачи — ступень подсказки');
    } }] },
    { name: 't4: неверное место', start: 4, langs: ['ru'], steps: [{ name: 'место внутри body', run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.pp-gap', 4, 'место внутри body');
      await qa.sleep(300);
      qa.expect(/body/.test(qa.text('.pp-note')) && !qa.q('.ed-ta'), 'причина и строка ввода не открылась', { note: qa.text('.pp-note') });
    } }] },
    { name: 't3: три лампочки → образец → дополнительная задача', start: 3, langs: ['ru'], steps: [{ name: 'подсказки до образца, решение, ещё одна', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 3; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/3\/3/.test(qa.text('.pp-note')) && !!qa.q('.pp-note .sample'), 'третья ступень с образцом', { note: qa.text('.pp-note') });
      qa.type('.ed-ta', '<body>\n  Сегодня мультфильм.\n</body>', 'блок');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.q('.pp-drill-tag'), 4000, 'дополнительная задача');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.ed-ta', '<body>\n  Здесь можно плавать.\n</body>', 'блок для бассейна');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
