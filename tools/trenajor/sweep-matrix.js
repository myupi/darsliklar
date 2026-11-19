// Матрица замера тренажёра (19.11.2026): все вопросы × экраны × языки × состояния, плюс вводный экран и итог попытки.
// Каждое задание — своё окно iframe нужного размера (/trainer.html?t=…&qa=1); результаты — в localStorage[key] по заданиям,
// поэтому после перезагрузки страницы (dev-сервер перезапустили) прогон продолжается с места: просто запустить снова.
//   const s = await (await fetch('/tools/trenajor/sweep-matrix.js')).text(); eval(s);
//   __matrix({ t: 'css', key: 'mx-css', plan: [ { name: 'phone', sizes: [[360, 640], [375, 740]], langs: ['uz', 'ru', 'en'], states: ['none', 'wrong', 'right'] },
//                                               { name: 'kbd', sizes: [[360, 640, 330]], langs: ['ru'], states: ['none'], only: 'text_input' },
//                                               { name: 'screens', sizes: [[360, 640]], langs: ['ru'], screens: true } ] });
//   __matrixReport('mx-css') — сводка: серьёзное (прокрутка, вылезло, под клавиатурой, обрезан текст) и мелочи (ужатие, «Kod / Natija»).
// Размер [w, h, vvh]: vvh — видимая высота над открытой клавиатурой (is-kbd + --vvh, как в просмотрщике).
// Масштаб браузера Z на окне W×H — это окно W/Z × H/Z: 1366×768 при 150% — [911, 512].
window.__matrix = async ({ t = 'css', key, plan, chunk = 80, par = 6, w0 = 140, w1 = 320 }) => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  const sweepSrc = await (await fetch('/tools/trenajor/sweep.js')).text();
  const bank = await (await fetch(`/trenajor/${t}/savollar_banki_${t}_v1.json`)).json();
  const get = () => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; } };
  const save = (k, v) => { const o = get(); o[k] = v; localStorage.setItem(key, JSON.stringify(o)); };
  const jobs = [];
  for (const p of plan) {
    const ids = bank.filter((q) => !p.only || q.question_type === p.only).map((q) => q.question_id);
    for (const [W, H, V] of p.sizes) for (const lang of p.langs) {
      const sz = `${W}x${H}${V ? 'k' + V : ''}`;
      if (p.screens) { for (const sc of ['intro', 'result']) jobs.push({ k: `${p.name}|${sz}|${lang}|${sc}`, W, H, V, lang, screen: sc }); continue; }
      for (const st of p.states) for (let c = 0; c < ids.length; c += chunk) jobs.push({ k: `${p.name}|${sz}|${lang}|${st}|${c}`, W, H, V, lang, st, ids: ids.slice(c, c + chunk) });
    }
  }
  const done0 = get();
  const todo = jobs.filter((j) => !done0[j.k]);
  window.__mx = { total: jobs.length, left: todo.length, running: true };
  const host = document.body;
  const run = (j) => new Promise((resolve) => {
    const f = document.createElement('iframe');
    f.style.cssText = `position:fixed;left:0;top:0;width:${j.W}px;height:${j.H}px;border:0;opacity:.08;z-index:99999;background:#fff;pointer-events:none`;
    f.src = `/trainer.html?t=${t}&lang=${j.lang}&qa=1`;
    f.onload = async () => {
      const win = f.contentWindow; const d = win.document;
      for (let k = 0; k < 100 && !win.__trenajor; k++) await w(100);
      if (j.V) {
        const r = d.documentElement;
        const fix = () => { if (!r.classList.contains('is-kbd')) r.classList.add('is-kbd'); if (r.style.getPropertyValue('--vvh') !== j.V + 'px') r.style.setProperty('--vvh', j.V + 'px'); };
        fix(); new win.MutationObserver(fix).observe(r, { attributes: true, attributeFilter: ['class', 'style'] });
      }
      let out;
      if (j.screen) out = await screenCheck(win, j);
      else {
        win.__sweepW0 = w0; win.__sweepW1 = w1; win.__sweepIds = j.ids; win.eval(sweepSrc);
        const opt = j.st === 'none' ? null : j.st === 'wrong' ? 'x' : undefined;
        const r = await win.__sweep(opt);
        out = { st: r.st, out: r.out };
      }
      f.remove(); resolve(out);
    };
    host.appendChild(f);
  });
  // Вводный экран и итог (15 вопросов из разных уроков, каждый третий неверный; затем открыть дыру сайта).
  async function screenCheck(win, j) {
    const d = win.document;
    const still = d.createElement('style'); still.textContent = '.ht *, .ht *::before, .ht *::after { animation: none !important; transition: none !important; }'; d.head.appendChild(still);
    win.__trenajor.screen(j.screen, 15, 3); await w(700);
    const pr = [];
    const check = (tag) => {
      const root = d.querySelector('.ht'); if (!root) { pr.push(tag + 'no-root'); return; }
      const rb = root.getBoundingClientRect();
      if (d.documentElement.scrollHeight > win.innerHeight + 1) pr.push(tag + 'page-scroll');
      if (d.documentElement.scrollWidth > win.innerWidth + 1) pr.push(tag + 'page-hscroll');
      const vvh = j.V || win.innerHeight;
      const out = [];
      root.querySelectorAll('button, h1, h2, p, li, .ht-site, .ht-reward, .ht-chip').forEach((el) => {
        if (!el.offsetParent) return; const r = el.getBoundingClientRect(); if (r.height < 1) return;
        for (let a = el.parentElement; a && a !== root; a = a.parentElement) if (/auto|scroll/.test(win.getComputedStyle(a).overflowY)) return;   // внутри листаемой середины (крайний случай)
        if (r.bottom > Math.min(rb.bottom, vvh) + 1 || r.right > rb.right + 1 || r.left < rb.left - 1) out.push((el.className && String(el.className).split(' ')[0]) || el.tagName);
      });
      if (out.length) pr.push(tag + 'out:' + [...new Set(out)].slice(0, 4).join('/'));
      root.querySelectorAll('*').forEach((el) => {
        const cs = win.getComputedStyle(el);
        if (!el.offsetParent || !/hidden|clip/.test(cs.overflowY) || el.tagName === 'svg' || el.closest('.ht-ed, .ht-br, .ht-site')) return;
        if (el.scrollHeight > el.clientHeight + 2) pr.push(tag + 'cut:' + String(el.className).split(' ')[0] + ' ' + (el.scrollHeight - el.clientHeight));
        if (cs.textOverflow !== 'ellipsis' && /hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2) pr.push(tag + 'cut:' + String(el.className).split(' ')[0] + ' w' + (el.scrollWidth - el.clientWidth));
      });
    };
    check('');
    if (j.screen === 'result') {
      const hole = d.querySelector('.ht-res-site .ht-sp.is-click');
      if (!hole) pr.push('no-hole'); else { hole.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); await w(400); check('hole:'); }
    }
    return { st: {}, out: pr.length ? [j.screen + ': ' + [...new Set(pr)].join(', ')] : [] };
  }
  const queue = todo.slice();
  const worker = async () => { while (queue.length) { const j = queue.shift(); const r = await run(j); save(j.k, r); window.__mx.left--; window.__mx.last = j.k; } };
  await Promise.all(Array.from({ length: par }, worker));
  window.__mx.running = false;
  return __matrixReport(key);
};
// Сводка: серьёзное — то, что ученик заметит; мелочи — штатное ужатие маленького экрана.
window.__matrixReport = (key) => {
  const o = JSON.parse(localStorage.getItem(key) || '{}');
  const HARD = /page-scroll|page-hscroll|card-overflow|foot-out|asm-overflow|opt-wide|no card|page-cut|under-kbd|out:|cut:|no-root|no-hole/;
  const hard = []; const soft = {}; let n = 0;
  for (const [k, v] of Object.entries(o)) {
    n++;
    (v.out || []).forEach((line) => {
      const parts = (line.split(': ').slice(1).join(': ') || '').split(', ');
      if (parts.some((p) => HARD.test(p))) hard.push(k.replace(/\|\d+$/, '') + ' — ' + line);
      parts.filter((p) => !HARD.test(p)).forEach((p) => { const t = p.replace(/[\d.]+/g, '').trim(); if (t) soft[t] = (soft[t] || 0) + 1; });
    });
  }
  return { jobs: n, hard, soft };
};
