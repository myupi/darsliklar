// Сценарий проверки урока lessons/test/11-struktura-dokumenta-2.jsx (урок 1, вариант 2).
// Основной путь: все 14 экранов действиями ученика, свои название и текст (s4, s5),
// своя страница из 8 тегов (s10), onFinished один раз, артефакт со своим названием.
// Ветки: прогноз с промахом → дополнительный раунд; неверный закрывающий тег → разбор
// и подсказка без засчёта; лишняя строка в каркасе → правило, «Дальше» закрыта.
//
// Функции шагов выполняются в странице: только аргумент qa (действия обвязки,
// qa.platform адаптера canon-html, qa.data языка). Никаких внешних помощников.

const STEPS = [
  {
    name: 'r1: три слоя робота по очереди',
    run: async (qa) => {
      await qa.platform.ready();
      for (let i = 0; i < 3; i += 1) { await qa.clickNth('.rb-layer', i, 'слой ' + (i + 1)); await qa.platform.ready(30000); }
      await qa.platform.next();
    },
  },
  {
    name: 'r2: «Опубликовать» — сломанная страница: index.html на вкладке, название в окне, чат игрока',
    shot: 'r2',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.rb-open-b', 'Опубликовать');
      await qa.waitFor(() => qa.q('.mb-tab-t.is-file'), 4000, 'вкладка index.html');
      qa.expect(qa.text('.mb-doc').indexOf(qa.data.title) === 0, 'название игры — в окне, в начале текста');
      await qa.waitFor(() => qa.q('.v2-chat'), 5000, 'сообщение игрока');
      await qa.platform.ready(30000);
      await qa.platform.next();
    },
  },
  {
    name: 's1: нажать название в коде — ярлыки title, имя на вкладке; три части строки',
    shot: 's1',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.click('.cv-tap.v2-tapline', 'строка с названием');
      await qa.waitFor(() => qa.text('.mb-tab-t').indexOf(qa.data.title) >= 0, 5000, 'имя на вкладке');
      qa.expect(qa.text('.mb-doc') === qa.data.text, 'в окне только приветствие');
      await qa.platform.ready(30000);
      for (const i of [0, 2, 1]) { await qa.clickNth('.pv-bl .bl-part', i, 'часть ' + i); await qa.platform.ready(30000); }
      await qa.platform.next();
    },
  },
  {
    name: 's2: надписи перепутаны — поменять местами',
    shot: 's2',
    run: async (qa) => {
      await qa.platform.ready();
      qa.expect(qa.text('.mb-doc') === qa.data.title, 'сначала в окне — название (перепутано)');
      await qa.clickNth('.tk-btn.v2-swap', 0, 'надпись в title');
      await qa.clickNth('.tk-btn.v2-swap', 1, 'надпись в body');
      await qa.waitFor(() => qa.text('.mb-tab-t') === qa.data.title && qa.text('.mb-doc') === qa.data.text, 4000, 'надписи на местах');
      await qa.platform.next();
    },
  },
  {
    name: 's3: шкаф — html, head, body, title',
    run: async (qa) => {
      await qa.platform.ready();
      for (const k of ['html', 'head', 'body', 'title']) { await qa.clickText('.chips .chip', k); await qa.platform.ready(40000); }
      await qa.platform.next();
    },
  },
  {
    name: 's4: своё имя игры в title — меняется вкладка',
    run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-box textarea', qa.data.myTitle, 'поле title');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
      qa.expect(qa.text('.mb-tab-t') === qa.data.myTitle, 'вкладка = своё название');
      await qa.platform.next();
    },
  },
  {
    name: 's5: свой текст в body — меняется окно',
    run: async (qa) => {
      await qa.platform.ready();
      qa.type('.ed-box textarea', qa.data.myText, 'поле body');
      await qa.waitFor(() => qa.platform.nextEnabled(), 25000, 'засчитано');
      qa.expect(qa.text('.mb-doc') === qa.data.myText, 'окно = свой текст');
      await qa.platform.next();
    },
  },
  {
    name: 's6: прогноз по макетам, три раунда',
    shot: 's6',
    run: async (qa) => {
      for (let r = 0; r < 6 && qa.q('.v2-run'); r += 1) {
        await qa.platform.ready(30000);
        const first = qa.qa('.v2-predcode .cv-line')[0];
        const m = first ? first.textContent.match(/<title>(.*)<\/title>/) : null;
        const want = m ? m[1].trim() : 'index.html';
        const mock = qa.qa('.v2-mock').find((b) => b.querySelector('.v2-mock-tab').textContent.trim() === want);
        await qa.click(mock, 'макет «' + want + '»');
        await qa.click('.v2-run', 'Открыть в браузере');
        await qa.waitFor(() => qa.q('.v2-mock.is-ok'), 8000, 'верный макет');
        qa.expect(qa.text('.mb-tab-t') === want, 'браузер показал вкладку «' + want + '»');
        await qa.waitFor(() => !qa.q('.v2-run') || !qa.q('.v2-mock.is-ok'), 30000, 'следующий раунд или конец');
      }
      await qa.platform.next();
    },
  },
  {
    name: 's7: конструктор — head, body, title на свои места',
    run: async (qa) => {
      await qa.platform.ready();
      const put = async (piece, place) => {
        await qa.platform.ready(20000);
        await qa.click(qa.qa('.pieces .piece').find((b) => b.textContent.indexOf('<' + piece + '>') === 0), 'деталь ' + piece);
        await qa.click('.drop-zone[data-place="' + place + '"]', 'место ' + place);
        await qa.sleep(400);
      };
      await put('head', 'html'); await put('body', 'html'); await put('title', 'head');
      await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'собрано');
      await qa.platform.next();
    },
  },
  {
    name: 's8: </title> — вкладка отпускает страницу',
    shot: 's8',
    run: async (qa) => {
      await qa.platform.ready();
      qa.expect(qa.text('.mb-tab-t').indexOf('</head>') > 0, 'вкладка съела страницу');
      qa.type('.gap-in textarea', '</title>', 'закрывающий тег');
      await qa.click('.key-check', 'Проверить');
      await qa.waitFor(() => qa.text('.mb-tab-t') === qa.data.myTitle, 4000, 'вкладка = название');
      qa.expect(qa.text('.mb-doc') === qa.data.myText, 'текст снова в окне');
      await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'засчитано');
      await qa.platform.next();
    },
  },
  {
    name: 's9: каркас по контурам, лишняя строка остаётся в лотке',
    run: async (qa) => {
      await qa.platform.ready();
      const order = ['<html>', '<head>', '<title>…</title>', '</head>', '<body>', qa.data.pageText, '</body>', '</html>'];
      for (const t of order) {
        const chip = qa.qa('.pool .pool-chip').find((b) => b.textContent.replace(/\s+/g, '') === t.replace(/\s+/g, ''));
        await qa.click(chip, 'строка ' + t);
        await qa.sleep(150);
      }
      qa.expect(qa.qa('.pool .pool-chip').length === 1, 'в лотке осталась одна строка');
      await qa.click('.bigbtn', 'Проверить');
      await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'каркас верный');
      await qa.platform.next();
    },
  },
  {
    name: 's10: своя страница — 8 тегов своими руками',
    shot: 's10',
    run: async (qa) => {
      await qa.platform.ready();
      const wants = ['<html>', '<head>', '<title>', '</title>', '</head>', '<body>', '</body>', '</html>'];
      for (const w of wants) {
        qa.type(qa.qa('.v2-own textarea')[0], w, 'тег ' + w);
        await qa.sleep(250);
      }
      await qa.waitFor(() => qa.qa('.v2-own textarea').length === 0, 4000, 'все поля стали тегами');
      qa.expect(qa.text('.mb-tab-t') === qa.data.myTitle, 'вкладка = своё название');
      await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'страница готова');
      await qa.platform.next();
    },
  },
  {
    name: 's11: вопросы Пикселя',
    run: async (qa) => {
      await qa.platform.ready(30000);
      for (const a of [qa.data.a1, qa.data.a2, 'head']) {
        await qa.waitFor(() => qa.qa('.v2-qopt').some((b) => b.textContent.trim() === a && !b.disabled), 30000, 'вариант «' + a + '»');
        await qa.click(qa.qa('.v2-qopt').find((b) => b.textContent.trim() === a), 'ответ ' + a);
        await qa.sleep(300);
      }
      await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'все ответы');
      await qa.platform.next();
    },
  },
  {
    name: 's12: финал — страница ученика, завершение один раз',
    shot: 's12',
    run: async (qa) => {
      await qa.platform.ready(30000);
      await qa.waitFor(() => qa.platform.nextEnabled(), 30000, '«Завершить урок»');
      await qa.platform.next();
      await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
      await qa.sleep(1200);
      qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
      const p = qa.payload();
      const html = p && p.artifact ? p.artifact.html : '';
      qa.expect(html.indexOf('<title>' + qa.data.myTitle + '</title>') >= 0, 'артефакт — своё название', { html });
      const ach = (p && p.achievements) || {};
      qa.expect(['place', 'build', 'close', 'page'].every((k) => ach[k]), 'все четыре достижения', { ach });
    },
  },
];

export default {
  title: 'Урок 1, вариант 2 «Страница Пикселя сломалась»',
  file: 'test/11-struktura-dokumenta-2',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '1280x720',
  voice: 'fast',
  screens: 14,
  inputScreens: [6, 7, 10, 12],
  expectFinish: true,
  data: {
    ru: { title: 'Битва знаний', text: 'Привет! Добро пожаловать в игру!', myTitle: 'Космический квиз', myText: 'Ответь на пять вопросов!',
      pageText: 'текст страницы', a1: 'Даёт имя вкладке', a2: 'В окно' },
    uz: { title: 'Bilimlar jangi', text: 'Salom! O‘yinga xush kelibsiz!', myTitle: 'Kosmik viktorina', myText: 'Beshta savolga javob bering!',
      pageText: 'sahifadagi matn', a1: 'Yorliqqa nom beradi', a2: 'Oynaga' },
    en: { title: 'Battle of Knowledge', text: 'Hi! Welcome to the game!', myTitle: 'Space quiz', myText: 'Answer five questions!',
      pageText: 'page text', a1: 'Gives the tab its name', a2: 'In the window' },
  },
  steps: STEPS,
  flows: [
    {
      name: 's6: промах в прогнозе — дополнительный раунд', start: 7, langs: ['ru'],
      steps: [{
        name: 'Неверный макет → верный обведён, раундов становится больше',
        shot: 's6-miss',
        run: async (qa) => {
          await qa.platform.ready();
          const first = qa.qa('.v2-predcode .cv-line')[0];
          const m = first ? first.textContent.match(/<title>(.*)<\/title>/) : null;
          const want = m ? m[1].trim() : 'index.html';
          const wrong = qa.qa('.v2-mock').find((b) => b.querySelector('.v2-mock-tab').textContent.trim() !== want);
          await qa.click(wrong, 'неверный макет');
          await qa.click('.v2-run', 'Открыть в браузере');
          await qa.waitFor(() => qa.q('.v2-mock.is-real'), 8000, 'верный макет обведён');
          qa.expect(!!qa.q('.v2-mock.is-miss'), 'выбранный макет приглушён');
          await qa.waitFor(() => /\/4/.test(qa.text('.ask-n')), 30000, 'счётчик раундов стал из четырёх');
        },
      }],
    },
    {
      name: 's8: неверный тег — разбор, без засчёта', start: 9, langs: ['ru'],
      steps: [{
        name: '<title> вместо </title> → причина на месте задания, «Дальше» закрыта',
        run: async (qa) => {
          await qa.platform.ready();
          qa.type('.gap-in textarea', '<title>', 'открывающий вместо закрывающего');
          await qa.click('.key-check', 'Проверить');
          await qa.waitFor(() => qa.q('.ask.ask-hint'), 3000, 'причина на месте задания');
          qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
          qa.expect(qa.text('.mb-tab-t').indexOf('</head>') > 0, 'вкладка по-прежнему съела страницу');
        },
      }],
    },
    {
      name: 's9: лишняя строка в каркасе — правило', start: 10, langs: ['ru'],
      steps: [{
        name: 'Строка без ярлыков вместо текста страницы → правило, «Дальше» закрыта',
        run: async (qa) => {
          await qa.platform.ready();
          const order = ['<html>', '<head>', '<title>…</title>', '</head>', '<body>', qa.data.title, '</body>', '</html>'];
          for (const t of order) {
            const chip = qa.qa('.pool .pool-chip').find((b) => b.textContent.replace(/\s+/g, '') === t.replace(/\s+/g, ''));
            await qa.click(chip, 'строка ' + t);
            await qa.sleep(150);
          }
          await qa.click('.bigbtn', 'Проверить');
          await qa.waitFor(() => qa.q('.ask.ask-hint'), 3000, 'правило на месте задания');
          qa.expect(!!qa.q('.cv-flat .is-mark'), 'лишняя строка отмечена');
          qa.expect(!qa.platform.nextEnabled(), '«Дальше» закрыта');
        },
      }],
    },
  ],
};
