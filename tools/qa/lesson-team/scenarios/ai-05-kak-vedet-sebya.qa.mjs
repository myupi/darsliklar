// Сценарий проверки урока 5 модуля «ИИ» lessons/ai/05-kak-vedet-sebya.jsx («Как сайт должен вести себя?», 12.11.2026).
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
  step('s1: «jonli va qiziqarli» → всё прыгает', `
    await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 60000, '«Yuborish» нажимается');
    await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => /kafe/i.test(site()), 10000, 'сайт готов');
    await qa.sleep(1500);
    qa.expect(/Taxmin/.test(pinTxt()), 'метки «Taxmin»', { pins: pinTxt() });
    qa.expect(/ai5run/.test(anim('.cta')) && /ai5wob/.test(anim('.title')), 'кнопка убегает, заголовок качается', { cta: anim('.cta'), t: anim('.title') });
    await qa.waitFor(() => qa.platform.nextEnabled(), 90000, 'рассказано');`),
  show('s2: показ наведения', "qa.expect(/Qanday ishlaydi/.test(pinTxt()), 'метки «Qanday ishlaydi?»', { pins: pinTxt() }); await qa.waitFor(() => qa.q('.kz-br-page [data-hover=\"1\"]'), 15000, 'курсор навёлся');"),
  task('s3: карточки пиццерии растут', ['menyu kartochkasi ustiga sichqoncha kelganda kattalashsin'], "await qa.waitFor(() => qa.q('.kz-br-page .h0[data-hover=\"1\"]') && /matrix/.test(tf('.h0')), 15000, 'карточка выросла под мышью');"),
  rounds('s4: что точнее', ['b', 'a', 'b']),
  show('s5: показ нажатия', "await qa.waitFor(() => qa.q('.kz-br-page .ans') || /Rahmat/.test(toast()), 20000, 'ответ после нажатия');"),
  task('s6: «Savatga qo\'shildi»', ["tugma bosilganda «Savatga qo'shildi» xabari chiqsin"], "await qa.waitFor(() => /Savatga/.test(toast()), 15000, 'сообщение после нажатия');"),
  rounds('s7: когда сработало', ['hover', 'click', 'load', 'phone', 'click']),
  show('s8: показ открытия страницы', "qa.expect(/ai5pulse/.test(anim('.cta')), 'кнопка мигает', { a: anim('.cta') });"),
  task('s9: выставка', ["saytga kirganda rasmlar birin-ketin silliq paydo bo'lsin"], "qa.expect(/ai5up/.test(anim('.title')), 'появление по очереди', { a: anim('.title') });"),
  show('s10: показ телефона', "await qa.waitFor(() => qa.q('.kz-br-page .mnav') || qa.q('.kz-br-page .callbar'), 20000, 'телефонная версия');"),
  task('s11: лагерь на телефоне', ["telefonda menyu ☰ tugmasiga yig'ilsin"], "await qa.waitFor(() => qa.q('.kz-br-page .mnav'), 20000, 'меню открылось по ☰');"),
  task('g1: «когда?»', ['tugma ustiga sichqoncha kelganda kattalashsin'], "await qa.waitFor(() => qa.q('.kz-br-page .cta[data-hover=\"1\"]') && /matrix/.test(tf('.cta')), 15000, 'кнопка растёт под мышью');"),
  rounds('det: детектив', ['b', 'a', 'c', 'b']),
  task('s12: почини кафе', ["tugma ustiga kelganda rangi o'zgarsin, bosilganda «Rahmat!» xabari chiqsin"], "qa.expect(!/ai5run|ai5wob/.test(anim('.cta') + anim('.title')), 'ничего не прыгает'); await qa.waitFor(() => /Rahmat/.test(toast()), 20000, '«Rahmat!» после нажатия');"),
  task('s13: три поведения', ["tugma ustiga kelganda kattalashsin, savol bosilganda javob ochilsin, telefonda menyu ☰ tugmasiga yig'ilsin"], "await qa.waitFor(() => qa.q('.kz-br-page .ans'), 25000, 'ответ на вопрос открылся');"),
  task('s14: свой сайт', ['Roblox klubimiz sayti', "o'yinchilar klubga yozilsin", "12–14 yoshli o'quvchilar", 'rasmlar, qoidalar, aloqa', "qorong'i, neon, binafsha", "tugma ustiga kelganda kattalashsin, bosilganda «Rahmat!» xabari chiqsin"]),
  rounds('q1: верно или нет', ['false', 'true', 'false', 'true', 'false']),
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
    qa.expect(pl && pl.artifact && /Roblox/.test(pl.artifact.what) && /kattalash/.test(pl.artifact.beh), 'артефакт — свой промпт из шести строк', { pl });`, null)
];

export default {
  title: 'Урок 5 модуля «ИИ» «Как сайт должен вести себя?»',
  file: 'ai/05-kak-vedet-sebya',
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
