// Сценарий проверки практики к уроку 5 курса HTML lessons/html/05p-izobrazheniya.jsx («Выставка», 7 слайдов).
// Основной путь: хук (касание «Открыть выставку»), пять заданий действиями ученика (снимок каждого экрана — в решённом
// виде), честные картинки в бумажном браузере, вывод, onFinished один раз, артефакт — своя галерея из t5.
// Ветки: href вместо src, вторая неудача → подсказка; alt = имя файла; alt «картинка»; подсказка 2 в «витрине»
// указывает строку; </img> в своей галерее; три лампочки → образец → дополнительная задача.
// Функции шагов выполняются в странице: только аргумент qa (помощники — прямо в шаге).

const STEPS = [
  { name: 'хук: картинки выпали из рам', shot: 'intro', run: async (qa) => {
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-street .pp-house').length === 5, 'на стене пять рам');
    qa.expect(qa.qa('.pp-street .pg-photo').length === 4, 'до открытия в четырёх рамах картинки');
    await qa.waitFor(() => { const b = qa.q('.pp-wind'); return b && !b.disabled; }, 30000, 'кнопка включилась');
    await qa.click('.pp-wind', 'Открыть выставку');
    await qa.sleep(700);
    qa.expect(qa.qa('.pp-street .pp-house.is-wait').length === 4, 'рамы опустели');
    await qa.waitFor(() => qa.platform.nextEnabled(), 40000, 'задача рассказана');
  } },
  { name: 't1: дописать src', shot: 't1-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(!!qa.q('.pg-doc .pg-alt') && !qa.q('.pg-doc .pg-photo'), 'без src — только текст alt');
    qa.type('.ed-ta', qa.data.t1, 'картинка с файлом');
    await qa.sleep(200);
    qa.expect(!!qa.q('.pg-doc .pg-photo[data-file="cat.jpg"]'), 'с src — фото кота сразу');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't2: имена файлов', shot: 't2-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pg-doc .pg-broken').length === 2, 'две сломанные картинки');
    qa.type('.ed-ta', qa.data.t2, 'верные имена');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-photo').length === 2 && !qa.q('.pg-doc .pg-broken'), 'обе картинки видны');
  } },
  { name: 't3: подписи alt', shot: 't3-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-reader-l').length === 2 && !qa.q('.pp-reader-l.is-ok'), 'программе чтения нечего сказать');
    qa.type('.ed-ta', qa.data.t3, 'описания');
    await qa.sleep(200);
    qa.expect(qa.qa('.pp-reader-l.is-ok').length === 2, 'программа чтения «читает» оба описания');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
  } },
  { name: 't4: починить два тега', shot: 't4-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(/2/.test(qa.text('.pp-left')), 'счётчик: осталось 2', { left: qa.text('.pp-left') });
    qa.expect(qa.qa('.pg-doc .pg-alt').length === 2 && !qa.q('.pg-doc .pg-photo'), 'честно: вместо картинок тексты alt');
    qa.type('.ed-ta', qa.data.t4, 'починенные теги');
    await qa.sleep(200);
    qa.expect(!!qa.q('.pp-left.is-ok'), 'счётчик: всё исправлено');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.qa('.pg-doc .pg-photo').length === 2, 'обе картинки видны');
  } },
  { name: 't5: своя галерея', shot: 't5-done', run: async (qa) => {
    await qa.platform.next();
    await qa.platform.ready();
    qa.expect(qa.qa('.pp-check-i').length === 5 && !qa.q('.pp-check-i.is-ok'), 'список условий пуст');
    qa.type('.ed-ta', qa.data.t5, 'своя галерея');
    await qa.sleep(200);
    qa.expect(qa.qa('.pp-check-i.is-ok').length === 5, 'все пять условий загорелись');
    await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
    await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    qa.expect(qa.text('.pg-doc .pg-h1') === qa.data.title, 'в окне своё название');
  } },
  { name: 'вывод: рамы горят, своя галерея', shot: 'fin', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 45000, '«Завершить»');
    qa.expect(qa.qa('.pp-street .pp-house.is-lit').length === 5, 'все пять рам горят');
    qa.expect(qa.text('.pp-fin .pg-h1') === qa.data.title && qa.qa('.pp-fin .pg-doc .pg-photo').length === 2, 'в выводе — своя галерея');
  } },
  { name: 'завершение один раз', run: async (qa) => {
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    const html = pl && pl.artifact ? pl.artifact.html : '';
    qa.expect(html.indexOf('<h1>' + qa.data.title + '</h1>') >= 0 && html.indexOf('src="sun.png"') >= 0 && pl.artifact.images.length === 2, 'артефакт — своя галерея', { html });
  } }
];

const I = (s, a) => '<img src="' + s + '" alt="' + a + '">';

export default {
  title: 'Практика к уроку 5 курса HTML «Выставка» (7 слайдов)',
  file: 'html/05p-izobrazheniya',
  adapter: 'canon-html',
  langs: ['ru'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 7,
  inputScreens: [2, 3, 4, 5, 6],
  expectFinish: true,
  data: {
    ru: { t1: I('cat.jpg', 'Рыжий кот'), t2: I('parrot.png', 'Попугай') + '\n' + I('fish.jpg', 'Рыбка'),
      t3: I('parrot.png', 'Красный попугай на ветке') + '\n' + I('sun.png', 'Солнце за облаком'),
      t4: I('fish.jpg', 'Рыбка') + '\n' + I('dog.jpg', 'Весёлая собака'),
      title: 'Моя галерея', t5: '<h1>Моя галерея</h1>\n<p>Мои любимые картинки.</p>\n' + I('sun.png', 'Солнце') + '\n' + I('flower.jpg', 'Красный цветок') },
    uz: { t1: I('cat.jpg', 'Sariq mushuk'), t2: I('parrot.png', 'To‘tiqush') + '\n' + I('fish.jpg', 'Baliq'),
      t3: I('parrot.png', 'Shoxdagi qizil to‘tiqush') + '\n' + I('sun.png', 'Bulut ortidagi quyosh'),
      t4: I('fish.jpg', 'Baliq') + '\n' + I('dog.jpg', 'Quvnoq it'),
      title: 'Galereyam', t5: '<h1>Galereyam</h1>\n<p>Sevimli rasmlarim.</p>\n' + I('sun.png', 'Quyosh') + '\n' + I('flower.jpg', 'Qizil gul') },
    en: { t1: I('cat.jpg', 'A ginger cat'), t2: I('parrot.png', 'A parrot') + '\n' + I('fish.jpg', 'A fish'),
      t3: I('parrot.png', 'A red parrot on a branch') + '\n' + I('sun.png', 'The sun behind a cloud'),
      t4: I('fish.jpg', 'A fish') + '\n' + I('dog.jpg', 'A happy dog'),
      title: 'My gallery', t5: '<h1>My gallery</h1>\n<p>My favorite pictures.</p>\n' + I('sun.png', 'The sun') + '\n' + I('flower.jpg', 'A red flower') }
  },
  steps: STEPS,
  flows: [
    { name: 't1: href вместо src, вторая неудача → подсказка', start: 1, langs: ['ru'], steps: [{ name: 'href дважды', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<img href="cat.jpg" alt="Рыжий кот">', 'href');
      await qa.sleep(200);
      qa.expect(!qa.q('.pg-doc .pg-photo'), 'честно: у img href ничего не делает');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-fb') && /src/.test(qa.text('.pp-note')), 'причина: нужен src', { note: qa.text('.pp-note') });
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'со второй неудачи — ступень подсказки');
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
    } }] },
    { name: 't3: alt = имя файла, потом «картинка»', start: 3, langs: ['ru'], steps: [{ name: 'плохие описания', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<img src="parrot.png" alt="parrot.png">\n<img src="sun.png" alt="Солнце">', 'alt = файл');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/имя файла/.test(qa.text('.pp-note')), 'причина: в alt имя файла', { note: qa.text('.pp-note') });
      qa.type('.ed-ta', '<img src="parrot.png" alt="картинка">\n<img src="sun.png" alt="Солнце">', 'alt = картинка');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/ничего не говорит/.test(qa.text('.pp-note')), 'причина: слово ничего не говорит', { note: qa.text('.pp-note') });
    } }] },
    { name: 't4: подсказка 2 указывает строку', start: 4, langs: ['ru'], steps: [{ name: 'две лампочки', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 2; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/строку 8/.test(qa.text('.pp-note')) && !!qa.q('.ed-line.is-mark'), 'строка 8 названа и подсвечена', { note: qa.text('.pp-note') });
    } }] },
    { name: 't5: </img> в своей галерее', start: 5, langs: ['ru'], steps: [{ name: 'с закрывающим', run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-ta', '<h1>Моя галерея</h1>\n<p>Мои картинки.</p>\n<img src="sun.png" alt="Солнце"></img>\n<img src="cat.jpg" alt="Кот">', 'с </img>');
      await qa.sleep(200);
      qa.expect(qa.qa('.pg-doc .pg-photo').length === 2, 'честно: браузер </img> не заметил');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      qa.expect(/закрывающего тега/.test(qa.text('.pp-note')), 'причина: у img нет закрывающего тега', { note: qa.text('.pp-note') });
    } }] },
    { name: 't5: три лампочки → образец → дополнительная задача', start: 5, langs: ['ru'], steps: [{ name: 'подсказки до образца, решение, ещё одна', run: async (qa) => {
      await qa.platform.ready();
      for (let k = 0; k < 3; k += 1) { qa.platform.hint(); await qa.sleep(500); }
      qa.expect(/3\/3/.test(qa.text('.pp-note')) && !!qa.q('.pp-note .sample'), 'третья ступень с образцом', { note: qa.text('.pp-note') });
      qa.type('.ed-ta', qa.data.t5, 'своя галерея');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.q('.pp-drill-tag'), 4000, 'дополнительная задача');
      qa.platform.hint(); await qa.sleep(500);
      qa.expect(!!qa.q('.pp-note.is-hint'), 'в дополнительной задаче лампочка даёт правило (2-я ступень)', { note: qa.text('.pp-note') });
      qa.expect(!qa.platform.nextEnabled(), '«Дальше» ждёт дополнительную задачу');
      qa.type('.ed-ta', '<img src="flower.jpg" alt="Красный цветок">', 'цветок');
      await qa.click('.pp-go', 'Проверить'); await qa.sleep(350);
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
    } }] }
  ]
};
