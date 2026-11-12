// Сценарий проверки урока 8 модуля «ИИ» lessons/ai/08-final-proekt.jsx («Финальный ИИ-проект», 12.11.2026).
// Основной путь: все 17 экранов действиями ученика (станции формулы, второй промпт, свой сайт); onFinished один раз,
// артефакт — свой промпт и правка. Шаги выполняются в странице (как в уроках 6–7).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .title, .kz-br-page .bh, .kz-br-page .gh, .kz-br-page .gh2').map((e) => e.textContent).join(' | ');
const title = () => { const e = qa.q('.kz-br-page .title'); return e ? e.textContent : ''; };
const bh = () => qa.qa('.kz-br-page .bh').map((e) => e.textContent).join(',');
const pinTxt = () => qa.qa('.a1-pin').map((e) => e.textContent).join(',');
const has8 = (sel) => !!qa.q('.kz-br-page ' + sel);
const info = () => { const e = qa.q('.kz-br-page .info'); return e ? e.textContent : ''; };
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
  step('s1: одна строка → чужой фестиваль', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => title(), 10000, 'сайт готов');
    await qa.sleep(1200);
    qa.expect(/Taxmin/.test(pinTxt()), 'метки «Taxmin»', { pins: pinTxt() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('map: показ формулы'),
  task('st1: Nima', ['Robotlar festivali sayti'], "qa.expect(/Robot/.test(title()), 'фестиваль роботов', { t: title() });"),
  rounds('st2: Nega', ['b']),
  task('st3: Kim uchun', ["10–14 yoshli o'quvchilar va ularning ota-onalari"], "qa.expect(has8('.par'), 'раздел для родителей');"),
  task('st4: Ichida nima', ['jadval, rasmlar, aloqa'], "qa.expect(/Jadval/.test(bh()) && /Rasm/.test(bh()) && /Aloqa/.test(bh()), 'три блока', { bh: bh() });"),
  rounds('st5: как выглядит', ['c']),
  task('st6: Qanday ishlaydi', ['tugma ustiga kelganda kattalashsin']),
  task('st7: Qoidalar', ["majburiy: telefon +998 90 250 25 25, reklama oynasi va chegirma bo'lmasin"], "qa.expect(/250 25 25/.test(info()) && !has8('.promo') && !has8('.sale'), 'номер, без окна и скидки', { info: info() });"),
  show('big: показ одна строка → семь', "qa.expect(/250 25 25/.test(info()) && has8('.par'), 'полный сайт');"),
  task('st8: второй промпт', ["savol-javob blokini qo'sh, qolganini o'zgartirma"], "qa.expect(/Savol/.test(bh()) && /^Jadval/.test(bh()), 'блок вопросов, порядок прежний', { bh: bh() });"),
  rounds('which: какой вопрос', ['5', '2', '6', '3', '1']),
  rounds('det: какой строки нет', ['6', '1', '4']),
  task('own: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin", "12–14 yoshli o'quvchilar", 'rasmlar, qoidalar, aloqa', "qorong'i, neon, binafsha", 'tugma ustiga kelganda kattalashsin', "majburiy: telefon +998 90 123 00 11, chegirma va chat bo'lmasin"]),
  task('ownfix: улучши свой сайт', ["reklama oynasini olib tashla, sarlavhani kattaroq qil, qolganini o'zgartirma"], "qa.expect(!has8('.promo'), 'окна нет');"),
  rounds('q1: верно или нет', ['false', 'true', 'false', 'true', 'true']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить модуль»');
    qa.expect(qa.qa('.a1-pin').length >= 1, 'метки на своём сайте');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what) && /reklama/.test(pl.artifact.fix), 'артефакт — свой промпт и правка', { pl });`, null)
];

export default {
  title: 'Урок 8 модуля «ИИ» «Финальный ИИ-проект»',
  file: 'ai/08-final-proekt',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 17,
  inputScreens: [3, 5, 6, 8, 9, 11, 14, 15],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
