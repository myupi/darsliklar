// Сценарий проверки урока 4 модуля «ИИ» lessons/ai/04-kak-vyglyadit.jsx («Как должен выглядеть сайт?», 12.11.2026).
// Основной путь: все 17 экранов действиями ученика (промпт в строках редактора → «Yuborish» → сайт от ИИ-симулятора),
// снимок готового состояния каждого экрана; onFinished один раз, артефакт — свой промпт. Шаги выполняются в странице:
// общие помощники — строкой H, шаги собираются через AsyncFunction (исходник «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .title, .kz-br-page .ch, .kz-br-page .bh, .kz-br-page .pr, .kz-br-page .gp').map((e) => e.textContent).join(' | ');
const bh = () => qa.qa('.kz-br-page .bh').map((e) => e.textContent).join(',');
const heroBg = () => { const h = qa.q('.kz-br-page .hero'); return h ? getComputedStyle(h).backgroundColor + ' ' + getComputedStyle(h).backgroundImage : ''; };
const pinTxt = () => qa.qa('.a1-pin').map((e) => e.textContent).join(',');
const fill = async (i, v) => { await qa.waitFor(() => qa.qa('.a1-slot textarea')[i], 30000, 'поле ' + i); qa.type(qa.qa('.a1-slot textarea')[i], v, 'строка промпта'); };
const send = async () => { await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается'); await qa.click('.a1-send', 'Yuborish'); await qa.sleep(1800); };
const opt = async (v) => { await qa.waitFor(() => qa.q('.a1-opt[data-v="' + v + '"]:not(:disabled)'), 60000, 'вариант ' + v); await qa.click('.a1-opt[data-v="' + v + '"]', v); await qa.waitFor(() => qa.q('.a1-opt.is-ok'), 5000, 'ответ принят'); await qa.sleep(400); };
`;
const step = (name, body, shot) => ({ name, shot: shot === undefined ? name.split(':')[0] + '-done' : shot, run: new AF('qa', H + body) });
const task = (name, lines, check) => step(name, `
  await qa.platform.next(); await qa.platform.ready(30000);
  ${lines.map((v, i) => `await fill(${i}, ${JSON.stringify(v)});`).join(' ')}
  await send();
  await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');
  ${check || ''}`);
const show = (name, check) => step(name, `
  await qa.platform.next(); await qa.platform.ready(30000);
  await qa.waitFor(() => qa.platform.nextEnabled(), 180000, 'показ закончен');
  await qa.sleep(1500);
  ${check || ''}`);
const rounds = (name, vals) => step(name, `
  await qa.platform.next(); await qa.platform.ready(30000);
  for (const v of ${JSON.stringify(vals)}) { await opt(v); await qa.sleep(900); }
  await qa.waitFor(() => qa.platform.nextEnabled(), 60000, 'засчитано');`);

const STEPS = [
  step('s1: «chiroyli bo\'lsin» → розовый сайт', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => /Kibersport/.test(site()), 10000, 'сайт готов');
    await qa.sleep(1200);
    qa.expect(/Taxmin/.test(pinTxt()), 'метки «Taxmin»', { pins: pinTxt() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ настроения', "qa.expect(/Ko'rinishi/.test(pinTxt()), 'метки «Ko\\'rinishi?»', { pins: pinTxt() });"),
  task('s3: весёлый праздник', ['quvnoq va yorqin']),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ цветов', "qa.expect(/17, 24, 39|3, 7, 18/.test(heroBg()), 'в конце — чёрный', { bg: heroBg() });"),
  task('s6: цвета пиццерии', ['zamonaviy, qizil va yashil'], "qa.expect(/220, 38, 38/.test(heroBg()), 'красный сайт', { bg: heroBg() });"),
  rounds('s7: какой стиль подходит', ['fun', 'serious', 'neon', 'calm', 'retro']),
  show('s8: показ формы и шрифта'),
  task('s9: бабушкины сладости', ["iliq, qo'lyozma shrift, jigarrang va oltin"]),
  task('s10: киберспорт', ["qorong'i, neon, yashil, kod shrifti"], "qa.expect(/5, 6, 15/.test(heroBg()), 'тёмный неон', { bg: heroBg() });"),
  task('g1: главный цвет', ['zamonaviy, qizil, sariq va oq'], "qa.expect(/220, 38, 38/.test(heroBg()), 'главный — красный', { bg: heroBg() });"),
  rounds('det: детектив', ['b', 'neon', 'a', 'fun']),
  task('s12: почини «chiroyli va zo\'r»', ["jiddiy, to'q ko'k va oq, klassik shrift"], "qa.expect(/30, 58, 138/.test(heroBg()), 'строгий синий', { bg: heroBg() });"),
  task('s13: полное описание', ['zamonaviy, binafsha va pushti, yumaloq burchaklar, katta soyalar']),
  task('s14: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin", "12–14 yoshli o'quvchilar", 'rasmlar, qoidalar, aloqa', "qorong'i, neon, binafsha"]),
  rounds('q1: верно или нет', ['false', 'true', 'true', 'false', 'true']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить урок»');
    qa.expect(qa.qa('.a1-pin').length >= 3, 'метки «откуда что» на своём сайте');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what) && /neon/.test(pl.artifact.look), 'артефакт — свой промпт из пяти строк', { pl });`, null)
];

export default {
  title: 'Урок 4 модуля «ИИ» «Как должен выглядеть сайт?»',
  file: 'ai/04-kak-vyglyadit',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 6, 9, 10, 11, 13, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
