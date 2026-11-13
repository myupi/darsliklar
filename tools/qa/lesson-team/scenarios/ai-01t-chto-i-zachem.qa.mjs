// Сценарий проверки теста к уроку 1 модуля «ИИ» lessons/ai/01t-chto-i-zachem.jsx (13.11.2026).
// 5 вопросов подряд (один нарочно неверный), без итога: после пятого — «Testni tugatish»; onFinished один раз,
// payload.test — оценка 4 из 5 и разбор по вопросам.
const AF = Object.getPrototypeOf(async function () {}).constructor;
const H = `
const opt = async (v) => { await qa.waitFor(() => qa.q('.tq-opt[data-v="' + v + '"]:not(:disabled), .tq-line[data-v="' + v + '"]:not(:disabled)'), 60000, 'вариант ' + v); await qa.click('.tq-opt[data-v="' + v + '"], .tq-line[data-v="' + v + '"]', v); await qa.waitFor(() => qa.q('.tq-verdict'), 5000, 'ответ засчитан'); };
const verdict = () => { const e = qa.q('.tq-verdict'); return e ? e.className : ''; };
`;
const step = (name, body, shot) => ({ name, shot: shot === undefined ? name.split(':')[0] + '-done' : shot, run: new AF('qa', H + body) });
const STEPS = [
  step('q1: верно', `await qa.platform.ready(); await opt('b'); qa.expect(/is-ok/.test(verdict()), 'верно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'дальше');`),
  step('q2: нарочно неверно', `await qa.platform.next(); await qa.platform.ready(); await opt('a');
    qa.expect(/is-bad/.test(verdict()) && !!qa.q('.tq-opt[data-v="b"].is-ok'), 'не так, верный подсвечен');
    qa.expect(qa.qa('.tq-opt:not(:disabled)').length === 0, 'вторая попытка невозможна');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'дальше');`),
  step('q3: строка промпта', `await qa.platform.next(); await qa.platform.ready(); await opt('1'); qa.expect(/is-ok/.test(verdict()), 'верно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'дальше');`),
  step('q4: две строки', `await qa.platform.next(); await qa.platform.ready();
    await qa.waitFor(() => qa.q('.tq-mrow[data-v="a"]:not(:disabled)'), 60000, 'строки нажимаются');
    await qa.click('.tq-mrow[data-v="a"]', 'a'); await qa.click('.tq-mrow[data-v="d"]', 'd'); await qa.click('.tq-go', 'Tekshirish');
    await qa.waitFor(() => qa.q('.tq-verdict'), 5000, 'засчитано'); qa.expect(/is-ok/.test(verdict()), 'верно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, 'дальше');`),
  step('q5: написать «Nega?»', `await qa.platform.next(); await qa.platform.ready();
    await qa.waitFor(() => qa.q('.a1-slot textarea'), 30000, 'поле'); qa.type('.a1-slot textarea', 'odamlar tort buyurtma qilsin', 'Nega?');
    await qa.waitFor(() => qa.q('.a1-send:not(:disabled)'), 30000, 'Yuborish'); await qa.click('.a1-send', 'Yuborish');
    await qa.waitFor(() => qa.q('.tq-verdict'), 10000, 'засчитано'); qa.expect(/is-ok/.test(verdict()), 'верно');
    await qa.waitFor(() => qa.platform.nextEnabled(), 30000, '«Testni tugatish»');`),
  step('завершение один раз', `await qa.platform.next();
    await qa.waitFor(() => qa.finished().length >= 1, 10000, 'onFinished'); await qa.sleep(1200);
    qa.expect(qa.finished().length === 1, 'onFinished ровно один раз');
    const pl = qa.payload(); qa.expect(pl && pl.test && pl.test.score === 4 && pl.test.max === 5 && pl.test.answers.length === 5, 'оценка в payload', { pl });`, null)
];
export default {
  title: 'Тест к уроку 1 модуля «ИИ»', file: 'ai/01t-chto-i-zachem', adapter: 'canon-html', langs: ['uz'],
  size: process.env.QA_SIZE || '1280x720', voice: 'fast', screens: 5, inputScreens: [5], expectFinish: true,
  data: { ru: {}, uz: {}, en: {} }, steps: STEPS, flows: []
};
