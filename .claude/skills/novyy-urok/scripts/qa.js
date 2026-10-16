// Помощник проверки урока в браузерной панели (javascript_tool), dev-сервер на 5173.
//
//   const { default: Q } = await import('/.claude/skills/novyy-urok/scripts/qa.js?' + Date.now());
//   await Q.ready();                 // дождаться, пока Коди договорит
//   Q.state()                        // экран, задание, превью, код, «Дальше» открыта?
//   Q.click(Q.btn('ul')); await Q.next();
//
// Работает и в player.html (урок прямо на странице), и в просмотрщике (урок в iframe).
// Не зависит от языка урока: «Дальше» ищется по классу, а не по тексту.
//
// ВАЖНО
//   · Переход по location.href стирает модуль — импортировать заново на новой странице.
//   · Не править файлы проекта, пока идёт долгий прогон: Vite перезагрузит страницу.
//   · Вызов javascript_tool ограничен ~45 с. Длинный проход запускать фоном
//     (Q.bg(async () => { … })) и опрашивать Q.bgState().
//   · Пока Коди говорит, касания заперты (так задумано). Между действиями — await Q.ready().
//   · Несколько синхронных кликов подряд по кнопкам-клавишам теряют символы
//     (состояние не успевает обновиться): Q.keys() ждёт между нажатиями.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Q = {
  sleep,
  doc() { const f = document.querySelector('iframe'); return f && f.contentDocument ? f.contentDocument : document; },
  win() { return Q.doc().defaultView; },
  q(s) { return Q.doc().querySelector(s); },
  qa(s) { return [...Q.doc().querySelectorAll(s)]; },

  // Коди договорил: у .stage нет is-speaking два замера подряд.
  async ready(timeout = 15000) {
    const t0 = Date.now();
    await sleep(300);
    while (Date.now() - t0 < timeout) {
      const s = Q.q('.stage');
      if (s && !/is-speaking/.test(s.className)) {
        await sleep(250);
        const s2 = Q.q('.stage');
        if (s2 && !/is-speaking/.test(s2.className)) return true;
      }
      await sleep(200);
    }
    return false;
  },

  // Кнопка с текстом (часть строки) или ровно с текстом.
  btn(txt) { return Q.qa('button').find((b) => b.textContent.trim().includes(txt) && !b.disabled); },
  btnEq(txt) { return Q.qa('button').find((b) => b.textContent.trim() === txt); },
  click(el) { if (!el) throw new Error('Нет элемента для нажатия на экране ' + Q.screen()); el.click(); return el; },

  // Ввод в поле React: нативный сеттер + событие input.
  type(input, v) {
    if (!input) throw new Error('Нет поля ввода на экране ' + Q.screen());
    const w = input.ownerDocument.defaultView;
    const proto = input.tagName === 'TEXTAREA' ? w.HTMLTextAreaElement.prototype : w.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, v);
    input.dispatchEvent(new w.Event('input', { bubbles: true }));
  },
  // Набор кнопками-клавишами (KeyRow): по символу с паузой.
  async keys(s, sel = '.key-b') {
    for (const ch of s) { Q.click(Q.qa(sel).find((b) => b.textContent === ch)); await sleep(150); }
  },
  check() { return Q.click(Q.q('.key-go') || Q.btn('Tekshirish') || Q.btn('Проверить') || Q.btn('Check')); },

  // Чтение экрана.
  screen() { return (Q.q('.stage') && (Q.q('.stage').textContent.match(/\d\d\/\d\d/) || [])[0]) || '?'; },
  ask() { return Q.qa('.ask').map((a) => a.textContent.trim()).join(' | '); },
  page() { return Q.qa('.mb-doc').map((d) => d.innerText.replace(/\n+/g, ' / ')).join(' ## '); },
  code() { return Q.qa('.src-line').map((l) => (l.querySelector('.src-code') || l).textContent).join(' ⏎ '); },
  lines() { return Q.qa('.src-line'); },
  nextBtn() { return Q.qa('button.btn-accent').pop(); },
  nextOn() { const b = Q.nextBtn(); return !!b && !b.disabled; },
  state() { return { screen: Q.screen(), ask: Q.ask(), page: Q.page(), code: Q.code(), next: Q.nextOn(), fit: Q.fit() }; },

  async waitNext(timeout = 15000) {
    const t0 = Date.now();
    while (!Q.nextOn() && Date.now() - t0 < timeout) await sleep(200);
    return Q.nextOn();
  },
  async next() {
    if (!(await Q.waitNext())) throw new Error('«Дальше» закрыта на экране ' + Q.screen() + ': ' + Q.ask());
    Q.nextBtn().click();
    await sleep(600);
  },
  async waitFor(fn, timeout = 20000) {
    const t0 = Date.now();
    while (!fn() && Date.now() - t0 < timeout) await sleep(200);
    return !!fn();
  },

  // Влезает ли экран: переполнение .stage-content, горизонтальная прокрутка,
  // элементы за краем окна (с открытой клавиатурой край — --vvh).
  fit() {
    const d = Q.doc(), w = d.defaultView, c = d.querySelector('.stage-content');
    const kbd = d.documentElement.classList.contains('is-kbd');
    const H = kbd ? parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--vvh')) || w.innerHeight : w.innerHeight;
    const W = w.innerWidth;
    const out = [...d.querySelectorAll('.stage-content *')].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (r.right > W + 1 || r.left < -1 || r.bottom > H + 1);
    }).slice(0, 4).map((e) => (typeof e.className === 'string' && e.className) || e.tagName);
    return { over: c ? c.scrollHeight - c.clientHeight : null, hscroll: d.documentElement.scrollWidth - W, out };
  },
  // Открытая клавиатура телефона: класс is-kbd и --vvh: 330px (как делает канон).
  async kbd(on = true, vvh = 330) {
    const de = Q.doc().documentElement;
    if (on) { de.classList.add('is-kbd'); de.style.setProperty('--vvh', vvh + 'px'); }
    else { de.classList.remove('is-kbd'); de.style.removeProperty('--vvh'); }
    await sleep(300);
    return Q.fit();
  },
  // Поле с фокусом видно над клавиатурой?
  inputVisible(vvh = 330) {
    const el = Q.doc().activeElement;
    if (!el || !/INPUT|TEXTAREA/.test(el.tagName)) return null;
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= vvh;
  },

  // Фоновый прогон длиннее 45 с.
  _bg: null,
  bg(fn) {
    Q._bg = { log: [], done: false, err: null };
    const log = (x) => Q._bg.log.push(x);
    (async () => { try { await fn(log); Q._bg.done = true; } catch (e) { Q._bg.err = String(e && e.message || e); } })();
    window.__qa = Q;
    return 'started';
  },
  bgState() { return Q._bg; }
};

window.__qa = Q;
export default Q;
