// Адаптер QA для уроков на каркасе канона курса HTML (canon/html/canon-v1.jsx: Stage,
// .stage-content, .stage-nav, кнопки шапки). Загружается раннером в страницу-обвязку.
//
// Без изменений использует существующие инструменты проекта:
//   · .claude/skills/novyy-urok/scripts/qa.js — ожидание конца реплики, «Дальше», fit();
//   · tools/layout-sweep.js — переполнение и ошибки на каждом экране по размерам и языкам.
// Эмуляция клавиатуры с удержанием класса is-kbd перенесена из временных скриптов
// проверки уроков 09 и 10 (сессия 18.10.2026): канон снимает класс при событиях
// visualViewport, поэтому класс и --vvh удерживаются наблюдателем.
//
// Адаптер ничего не знает о языке, теме, персонажах и числе экранов урока.

export async function install(QA) {
  const { default: Q } = await import('/.claude/skills/novyy-urok/scripts/qa.js');
  const nav = () => QA.q('.stage-nav button.btn-accent');
  const platform = {
    name: 'canon-html',
    Q,
    contentSelector: '.stage-content',
    expectsServiceVoice: true,     // уроки канона говорят движком по ttsApiBase
    supportsLayoutSweep: true,
    isReady: () => !!QA.q('.stage'),
    // Ведущий договорил: два замера подряд без .stage.is-speaking.
    ready: (timeout = 20000) => Q.ready(timeout),
    screen: () => Q.screen(),
    index() { const m = String(Q.screen()).match(/(\d+)\/\d+/); return m ? Number(m[1]) : null; },
    total() { const m = String(Q.screen()).match(/\d+\/(\d+)/); return m ? Number(m[1]) : null; },
    ask: () => Q.ask(),
    nextEnabled: () => { const b = nav(); return !!b && !b.disabled; },
    async next(timeout = 20000) {
      const from = platform.screen();
      await QA.waitFor(() => platform.nextEnabled(), timeout, '«Дальше» включится на экране ' + from);
      nav().click();
      await QA.waitFor(() => platform.screen() !== from || !QA.q('.stage-nav'), 8000, 'переход с экрана ' + from).catch(() => {});
      await QA.sleep(600);
    },
    back() { QA.click('.stage-nav button.btn-ghost', 'кнопка «Назад»'); },
    replay() { QA.click('.ctl-btn.is-replay', 'кнопка «Повторить»'); },
    hint() { QA.click('.ctl-hint', 'кнопка «Подсказка»'); },
    fit: () => Q.fit(),
    // ЭМУЛЯЦИЯ открытой клавиатуры: is-kbd и --vvh, как делает канон по visualViewport.
    async kbd(on = true, vvh = 330) {
      const d = QA.doc();
      const r = d.documentElement;
      QA._kbd = on;
      if (on) {
        const fix = () => {
          if (!QA._kbd) return;
          if (!r.classList.contains('is-kbd')) r.classList.add('is-kbd');
          if (r.style.getPropertyValue('--vvh') !== vvh + 'px') r.style.setProperty('--vvh', vvh + 'px');
        };
        fix();
        if (!QA._kbdMo) {
          QA._kbdMo = new (QA.win().MutationObserver)(fix);
          QA._kbdMo.observe(r, { attributes: true, attributeFilter: ['class', 'style'] });
        }
      } else {
        if (QA._kbdMo) { QA._kbdMo.disconnect(); QA._kbdMo = null; }
        r.classList.remove('is-kbd');
        r.style.removeProperty('--vvh');
      }
      await QA.sleep(400);
      return Q.fit();
    },
    inputVisible: (vvh = 330) => Q.inputVisible(vvh),
    // Прогон tools/layout-sweep.js фоном: start → poll.
    async layoutStart(opts) {
      const m = await import('/tools/layout-sweep.js?lt=' + Date.now());
      window.__ltSweep = m;
      return m.sweepBg(opts);
    },
    layoutResult: () => (window.__ltSweep ? window.__ltSweep.result() : null),
  };
  QA.platform = platform;
  return { name: platform.name };
}
