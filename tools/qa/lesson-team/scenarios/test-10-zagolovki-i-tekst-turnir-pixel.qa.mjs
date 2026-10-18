// Сценарий проверки урока lessons/test/10-zagolovki-i-tekst-turnir-pixel.jsx (тестовый, курс HTML).
// Действия перенесены из временных скриптов прогона урока 10 (сессия 18.10.2026) и
// переписаны без зависимости от языка: кнопки — по классам и коду («<h2>»), слова — из data.
//
// Функции шагов выполняются в странице: пользоваться только аргументом qa
// (действия обвязки + qa.platform адаптера canon-html + qa.data языка).
// Никаких прямых вызовов завершения — только нажатия и ввод, как у ученика.
// Нажатия ждём (await qa.click…): React обновляет состояние после события, а следующее
// действие часто зависит от этого обновления (выбор слова → кнопка тега).

const STEPS = [
  {
    name: 'Экран 1: переключить «Как надо» и пройти пояснение',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.seg2-b', 1, 'переключатель «Как надо»');
      await qa.platform.ready(30000);
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 2: свой заголовок в <h1> засчитывается и виден на странице',
    shot: 's2',
    run: async (qa) => {
      await qa.platform.ready(30000);
      qa.type('.src textarea', qa.data.head, 'поле заголовка');
      await qa.waitFor(() => qa.platform.nextEnabled(), 6000, 'автозасчёт заголовка');
      qa.expect(qa.text('.mb-doc .pg-h1') === qa.data.head, 'заголовок на странице = введённый текст');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 3: два прогноза (title → вкладка, h1 → страница)',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.tr-opt', 0, 'вариант «вкладка»');
      await qa.platform.ready();
      await qa.click('.tr-verdict .tr-next-b', 'следующий вопрос');
      await qa.platform.ready();
      await qa.clickNth('.tr-opt', 1, 'вариант «страница»');
      await qa.platform.ready();
      await qa.click('.tr-verdict .tr-next-b', 'готово');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 4: абзацы — способ с </p><p> делит текст на два абзаца',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.tr-opt', 1, 'способ «закрыть и открыть абзац»');
      await qa.waitFor(() => qa.qa('.mb-doc .pg-p').length === 2, 3000, 'два абзаца на странице');
      qa.expect(true, 'на странице два абзаца');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 5: раздел — <h2>',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.clickText('.tr-tag', '<h2>');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 6: <h3> перед абзацем о раунде',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.clickNth('.tr-pickline', 3, 'строка «Тема раунда»');
      await qa.waitFor(() => qa.qa('.mb-doc .pg-h3').length === 1, 3000, 'подраздел на странице');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 7: шесть уровней и вопрос о следующем уровне',
    run: async (qa) => {
      for (let i = 0; i < 6; i += 1) {
        await qa.platform.ready();
        await qa.clickNth('.src-tap', i, 'строка уровня ' + (i + 1));
        await qa.sleep(250);
      }
      await qa.platform.ready(30000);
      if (qa.data.mistakes) {
        // Проход с ошибками: два неверных ответа, подсказка в шапке → третья ступень → верный ответ →
        // дополнительный пример: снова ошибка, потом верно.
        await qa.clickText('.tr-tag', '<h4>');
        await qa.platform.ready();
        qa.expect(!!qa.q('.ask.ask-hint'), 'после ошибки подсказка встала на место задания');
        await qa.clickText('.tr-tag', '<h3>');
        await qa.platform.ready();
        qa.expect(!!qa.q('.tr-tag.is-glow'), 'после двух промахов светится верный вариант');
        qa.platform.hint();
        await qa.platform.ready();
        await qa.clickText('.tr-tag', '<h5>');
        await qa.platform.ready();
        qa.expect(qa.qa('.tr-tag').some((b) => b.textContent.trim() === '<h6>'), 'после сильной помощи — дополнительный пример');
        await qa.clickText('.tr-tag', '<h5>');
        await qa.platform.ready();
        await qa.clickText('.tr-tag', '<h6>');
      } else {
        await qa.clickText('.tr-tag', '<h5>');
      }
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 8: уровни по ролям (h1, h2, h3)',
    run: async (qa) => {
      for (const t of ['<h1>', '<h2>', '<h3>']) { await qa.platform.ready(); await qa.clickText('.tr-tag', t); await qa.sleep(300); }
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 9: ключевое слово — <b>',
    run: async (qa) => {
      await qa.platform.ready(30000);
      await qa.clickText('.src-line.is-hl .wl-w', qa.data.win, 'слово-приз');
      await qa.clickText('.tr-tag', '<b>');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 10: мысль Пикселя — <i>',
    run: async (qa) => {
      await qa.platform.ready(30000);
      const words = qa.qa('.src-line.is-hl .wl-w');
      const colon = words.findIndex((w) => /:$/.test(w.textContent.trim()));
      qa.expect(colon >= 0 && colon < words.length - 1, 'в строке есть слова после двоеточия');
      await qa.click(words[colon + 1], 'первое слово мысли');
      await qa.sleep(150);
      await qa.click(words[words.length - 1], 'последнее слово мысли');
      await qa.clickText('.tr-tag', '<i>');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 11: три прогноза',
    run: async (qa) => {
      for (const k of [0, 0, 1]) {
        await qa.platform.ready();
        await qa.clickNth('.tr-opt', k, 'вариант прогноза');
        await qa.platform.ready();
        await qa.click('.tr-verdict .tr-next-b', 'дальше по прогнозам');
      }
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 12: починить три строки',
    run: async (qa) => {
      await qa.platform.ready();
      await qa.click(qa.q('.wl-w.is-b'), 'слово, после которого встаёт </b>');
      await qa.platform.ready(30000);
      await qa.sleep(1200);
      await qa.clickNth('.tr-ins', -2, 'место перед </p>');
      await qa.platform.ready(30000);
      await qa.sleep(1200);
      await qa.clickNth('.tr-tagbtn', 2, 'тег без пары');
      await qa.sleep(300);
      await qa.clickText('.tr-tag', '<b>');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 13: своя страница (7 шагов) и правка после «Готово»',
    shot: 's13',
    run: async (qa) => {
      const d = qa.data;
      const step = async (tag, text) => {
        await qa.platform.ready();
        await qa.clickText('.tr-tag', tag);
        await qa.sleep(300);
        qa.type('.src textarea', text, 'поле шага ' + tag);
        await qa.sleep(1600);
      };
      await step('<h1>', d.h1);
      await step('<h2>', d.h2);
      await step('<p>', d.p1);
      await step('<h3>', d.h3);
      await step('<p>', d.p2);
      await qa.platform.ready();
      await qa.clickText('.wl-w', d.bold, 'ключевое слово');
      await qa.clickText('.tr-tag', '<b>');
      await qa.sleep(400);
      qa.type('.src textarea', d.thought, 'поле мысли');
      await qa.sleep(1600);
      await qa.clickText('.tr-tag', '<i>');
      await qa.waitFor(() => qa.platform.nextEnabled(), 15000, 'страница засчитана');
      // Правка после «Готово»: раздел меняется, страница обновляется.
      await qa.platform.ready();
      await qa.clickNth('.tr-edit', 1, 'изменить раздел');
      await qa.sleep(300);
      qa.type('.src textarea', d.h2edit, 'поле раздела');
      await qa.sleep(1400);
      qa.expect(qa.text('.mb-doc .pg-h2') === d.h2edit, 'после правки на странице новый раздел');
      await qa.platform.next();
    },
  },
  {
    name: 'Экран 14: финал, onFinished и данные завершения',
    shot: 's14',
    run: async (qa) => {
      await qa.platform.ready(30000);
      qa.expect(qa.qa('.ach-i').length >= 1, 'показаны достижения');
      await qa.platform.next();
      await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
      await qa.sleep(1500);
      qa.expect(qa.finished().length === 1, 'onFinished вызван один раз');
      const p = qa.payload();
      const d = qa.data;
      qa.expect(p && p.artifact && /<!DOCTYPE html>/.test(p.artifact.html), 'артефакт — полный HTML-документ');
      qa.expect(p.artifact.html.includes('<h2>' + d.h2edit + '</h2>'), 'в HTML — правка после «Готово»', { html: p.artifact.html.slice(0, 400) });
      qa.expect(p.artifact.html.includes('<b>' + d.bold + '</b>') && p.artifact.html.includes('<i>' + d.thought + '</i>'), 'в HTML — выделения ученика');
      const rows = p.answers || [];
      qa.expect(rows.length === 13 && rows.every((r) => r.done === true), 'журнал: 13 выполненных экранов', { rows: rows.map((r) => r.screenId) });
      const s7 = rows.find((r) => r.screenId === 's7');
      if (d.mistakes) {
        qa.expect(s7 && s7.correct === false && s7.strongHelp === true && s7.firstTry === false, 's7 с ошибками и сильной помощью: correct=false, strongHelp=true', s7);
        qa.expect(p.achievements && p.achievements.levels === 'help', 'достижение «шесть уровней» — с подсказкой', p.achievements);
      } else {
        qa.expect(rows.every((r) => r.correct === true && r.helped === false), 'чистый проход: все экраны верно и без помощи');
        qa.expect(p.achievements && Object.keys(p.achievements).length === 7 && Object.values(p.achievements).every((v) => v === 'self'), 'все 7 достижений — без подсказок', p.achievements);
      }
    },
  },
];

export default {
  title: 'Урок 10 «Заголовки и текст: турнир Пикселя»',
  file: 'test/10-zagolovki-i-tekst-turnir-pixel',
  adapter: 'canon-html',
  langs: ['ru'],
  size: '375x740',
  voice: 'fast',
  screens: 14,
  inputScreens: [2, 13],
  expectFinish: true,
  data: {
    ru: { head: 'Мой турнир', win: 'кубок', h1: 'Осенняя битва', h2: 'Правила', p1: 'В каждой команде три игрока.', h3: 'Первый раунд',
      p2: 'Тема — спорт.', bold: 'три', thought: 'Кто же победит?', h2edit: 'Правила турнира' },
    uz: { head: 'Mening turnirim', win: 'kubok', h1: 'Kuzgi jang', h2: 'Qoidalar', p1: 'Har jamoada uch o‘yinchi.', h3: 'Birinchi raund',
      p2: 'Mavzu — sport.', bold: 'uch', thought: 'Kim yutarkin?', h2edit: 'Turnir qoidalari' },
    en: { head: 'My tournament', win: 'cup', h1: 'Autumn Battle', h2: 'Rules', p1: 'Each team has three players.', h3: 'Round one',
      p2: 'The topic is sports.', bold: 'three', thought: 'Who will win?', h2edit: 'Tournament rules' },
  },
  steps: STEPS,
  flows: [
    {
      name: 'проход с ошибками и подсказками', langs: ['ru'], expectFinish: true, steps: STEPS,
      data: { default: { mistakes: true } },
    },
    {
      name: 'экран 4: Enter не делает абзац', start: 3, langs: ['ru'],
      steps: [{
        name: 'Enter → страница не меняется, объяснение причины; затем верный способ',
        shot: 'enter',
        run: async (qa) => {
          await qa.platform.ready();
          await qa.clickNth('.tr-opt', 0, 'способ «Enter»');
          await qa.sleep(500);
          qa.expect(qa.qa('.mb-doc .pg-p').length === 1, 'на странице по-прежнему один абзац');
          qa.expect(!!qa.q('.ask.ask-hint'), 'причина показана на месте задания');
          qa.expect(qa.qa('.tr-opt')[0].disabled, 'неверный способ погас');
          await qa.platform.ready();
          await qa.clickNth('.tr-opt', 1, 'верный способ');
          await qa.waitFor(() => qa.qa('.mb-doc .pg-p').length === 2, 3000, 'два абзаца');
        },
      }],
    },
    {
      name: 'экран 5: «Назад» и «Повторить»', start: 4, langs: ['ru'],
      steps: [{
        name: 'решить → дальше → назад: решённое состояние; «Повторить» — заново',
        run: async (qa) => {
          await qa.platform.ready();
          await qa.clickText('.tr-tag', '<h2>');
          await qa.platform.next();
          await qa.platform.ready();
          qa.platform.back();
          await qa.sleep(800);
          await qa.platform.ready();
          qa.expect(qa.qa('.tr-tag').length === 0 && qa.qa('.mb-doc .pg-h2').length === 2, 'после «Назад» экран показан решённым');
          qa.platform.replay();
          await qa.sleep(800);
          await qa.platform.ready(30000);
          qa.expect(qa.qa('.tr-tag').length > 0, 'после «Повторить» задание снова доступно');
        },
      }],
    },
    {
      name: 'экран 2: ввод, исправление и удаление текста', start: 1, langs: ['ru'],
      steps: [{
        name: 'уголки → причина; верный текст → засчитан; правка и удаление после засчитывания',
        run: async (qa) => {
          await qa.platform.ready(30000);
          qa.type('.src textarea', '<b>', 'поле заголовка');
          await qa.sleep(500);
          qa.expect(!!qa.q('.ask.ask-hint'), 'для текста с уголками — объяснение');
          qa.type('.src textarea', qa.data.head, 'поле заголовка');
          await qa.waitFor(() => qa.platform.nextEnabled(), 6000, 'автозасчёт');
          qa.type('.src textarea', qa.data.head + ' 2', 'поле заголовка');
          await qa.sleep(300);
          qa.expect(qa.text('.mb-doc .pg-h1') === qa.data.head + ' 2', 'правка после засчитывания видна на странице');
          qa.type('.src textarea', '', 'поле заголовка');
          await qa.sleep(300);
          qa.expect(qa.text('.mb-doc .pg-h1') === '', 'после удаления заголовок на странице пуст, урок не упал');
        },
      }],
    },
  ],
};
