// Сценарий проверки урока 6 модуля «ИИ» lessons/ai/06-tochnye-trebovaniya.jsx («Как дать ИИ точные требования?», 12.11.2026).
// Основной путь: все 18 экранов действиями ученика (промпт в строках редактора → «Yuborish» → сайт от ИИ-симулятора),
// снимок готового состояния каждого экрана; onFinished один раз, артефакт — свой промпт. Шаги выполняются в странице:
// общие помощники — строкой H, шаги собираются через AsyncFunction (исходник «async function anonymous(qa) {…}»).
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const site = () => qa.qa('.kz-br-page .title, .kz-br-page .ch, .kz-br-page .bh, .kz-br-page .pr, .kz-br-page .gp').map((e) => e.textContent).join(' | ');
const bh = () => qa.qa('.kz-br-page .bh').map((e) => e.textContent).join(',');
const heroBg = () => { const h = qa.q('.kz-br-page .hero'); return h ? getComputedStyle(h).backgroundColor + ' ' + getComputedStyle(h).backgroundImage : ''; };
const pinTxt = () => qa.qa('.a1-pin').map((e) => e.textContent).join(',');
const anim = (sel) => { const e = qa.q('.kz-br-page ' + sel); return e ? getComputedStyle(e).animationName : ''; };
const tf = (sel) => { const e = qa.q('.kz-br-page ' + sel); return e ? getComputedStyle(e).transform : ''; };
const has6 = (sel) => !!qa.q('.kz-br-page ' + sel);
const info = () => { const e = qa.q('.kz-br-page .info'); return e ? e.textContent : ''; };
const toast = () => { const e = qa.q('.kz-br-page .toast'); return e ? e.textContent : ''; };
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
  step('s1: «hammasi tushunarli» → окно, скидка, чат', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => /Gul/i.test(site()), 10000, 'сайт готов');
    await qa.sleep(1200);
    qa.expect(has6('.promo') && has6('.sale') && has6('.chatb'), 'ИИ добавил окно, скидку и чат');
    qa.expect(/Taxmin/.test(pinTxt()), 'метки «Taxmin»', { pins: pinTxt() });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ «нельзя»', "qa.expect(!has6('.promo') && !has6('.sale') && !has6('.chatb'), 'лишнего нет');"),
  task('s3: клуб плавания', ["reklama oynasi va chegirma bo'lmasin"], "qa.expect(!has6('.promo') && !has6('.sale'), 'ни окна, ни скидки');"),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ «обязательно»', "qa.expect(/555 44 33/.test(info()) && /Chilonzor/.test(info()), 'номер и адрес под баннером', { info: info() });"),
  task('s6: курс роботов', ['majburiy: telefon +998 90 777 88 99, manzil: Yunusobod 12'], "qa.expect(/777 88 99/.test(info()), 'настоящий номер', { info: info() });"),
  rounds('s7: обязательно или нельзя', ['must', 'no', 'must', 'no', 'no']),
  show('s8: показ ограничений', "qa.expect(qa.qa('.kz-br-page .blk').length === 3, 'три блока', { n: qa.qa('.kz-br-page .blk').length });"),
  task('s9: выставка', ["ko'pi bilan 2 ta blok, faqat bitta tugma"], "qa.expect(qa.qa('.kz-br-page .blk').length === 2, 'два блока');"),
  show('s10: показ заказа клиента', "qa.expect(/111 22 33/.test(info()) && !has6('.sale'), 'правила из сообщения', { info: info() });"),
  task('s11: директор лагеря', ["majburiy: telefon +998 95 200 30 40, chegirma va chat bo'lmasin, faqat bitta tugma"]),
  task('g1: выдуманный номер', ['majburiy: telefon +998 93 777 12 12'], "qa.expect(/777 12 12/.test(info()), 'номер тренера', { info: info() });"),
  rounds('det: детектив', ['b', 'c', 'a']),
  task('s12: почини цветы', ["chegirma va obuna oynasi bo'lmasin, majburiy: telefon +998 97 300 40 50"], "qa.expect(!has6('.sale') && !has6('.promo'), 'ни скидки, ни окна');"),
  task('s13: все правила', ["majburiy: telefon +998 91 600 70 80, Telegram tugmasi, chat va chegirma bo'lmasin, ko'pi bilan 3 ta blok"], "qa.expect(has6('.tg') && qa.qa('.kz-br-page .blk').length <= 3, 'Telegram и три блока');"),
  task('s14: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin", "12–14 yoshli o'quvchilar", 'rasmlar, qoidalar, aloqa', "qorong'i, neon, binafsha", 'tugma ustiga kelganda kattalashsin', "majburiy: telefon +998 90 123 00 11, chegirma va chat bo'lmasin"]),
  rounds('q1: верно или нет', ['false', 'true', 'true', 'false', 'true']),
  step('fin: вывод', `
    await qa.platform.next();
    await qa.waitFor(() => qa.platform.nextEnabled(), 180000, '«Завершить урок»');
    qa.expect(qa.qa('.a1-pin').length >= 1, 'метки на своём сайте');`),
  step('fin: завершение один раз', `
    await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished');
    await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload();
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what) && /123 00 11/.test(pl.artifact.rules), 'артефакт — свой промпт из семи строк', { pl });`, null)
];

export default {
  title: 'Урок 6 модуля «ИИ» «Как дать ИИ точные требования?»',
  file: 'ai/06-tochnye-trebovaniya',
  adapter: 'canon-html',
  langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720',
  voice: 'fast',
  screens: 18,
  inputScreens: [3, 6, 9, 11, 12, 14, 15, 16],
  expectFinish: true,
  data: { ru: {}, uz: {}, en: {} },
  steps: STEPS,
  flows: []
};
