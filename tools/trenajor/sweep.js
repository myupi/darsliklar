// Замер раскладки тренажёра без прокрутки (вставлять в окно /trainer.html?t=html&lang=uz&qa=1 — эмуляция LMS src/trainer/main.jsx):
//   const s = await (await fetch('/tools/trenajor/sweep.js')).text(); eval(s);
//   window.__res = null; __sweep(null).then((r) => (window.__res = r));   // null — до ответа, 'x' — после неверного ответа
// Для каждого вопроса банка: прокрутка страницы, переполнение карточки, низ за краем, код обрезан / мельче 11.5 px,
// страница обрезана / мельче 0.62, переключатель «Kod / Natija», ступень ужатия t0…t3.
window.__sweep = async (opt) => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  if (!document.getElementById('ht-qa-still')) {
    const st = document.createElement('style'); st.id = 'ht-qa-still';
    st.textContent = '.ht *, .ht *::before, .ht *::after { animation: none !important; transition: none !important; }';
    document.head.appendChild(st);
  }
  const out = []; const st = { t0: 0, t1: 0, t2: 0, t3: 0, tog: 0 };
  // window.__sweepIds — только эти вопросы; opt может быть функцией (id → ответ)
  for (const id of window.__sweepIds || window.__trenajor.ids) {
    window.__trenajor.show(id, typeof opt === 'function' ? opt(id) : opt); await w(window.__sweepW0 || 200);   // __sweepW0 / __sweepW1 — паузы (быстрый прогон)
    // ждать именно этот вопрос (data-qid), иначе в фоновой вкладке можно померить предыдущий
    for (let k = 0; k < 40 && !document.querySelector('.ht-card[data-qid="' + id + '"]'); k++) { const sb = document.querySelector('.ht-start'); if (sb) sb.click(); await w(120); }
    await w(window.__sweepW1 || 450);
    const root = document.querySelector('.ht'); const card = document.querySelector('.ht-card[data-qid="' + id + '"]');
    if (!card) { out.push(id + ': no card'); continue; }
    const foot = document.querySelector('.ht-foot'); const ed = document.querySelector('.ht-ed');
    const pg = document.querySelector('.ht-br:not(.is-off) .ht-br-page'); const fr = pg && pg.querySelector('iframe');
    const r = root.getBoundingClientRect();
    const t = (card.className.match(/is-t(\d)/g) || []).map((x) => +x.slice(4)); const tl = t.length ? Math.max(...t) : 0;
    st['t' + tl]++; if (document.querySelector('.ht-seg')) st.tog++;
    const pr = [];
    if (document.documentElement.scrollHeight > innerHeight + 1) pr.push('page-scroll');
    if (document.documentElement.scrollWidth > innerWidth + 1) pr.push('page-hscroll');
    // открытая клавиатура (is-kbd + --vvh, как в просмотрщике): поле, кнопка и отклик — над ней
    const de = document.documentElement; const vvh = de.classList.contains('is-kbd') ? parseFloat(de.style.getPropertyValue('--vvh')) : 0;
    if (vvh) {
      const inp = document.querySelector('.ht-inp'); if (inp && inp.getBoundingClientRect().bottom > vvh + 1) pr.push('input-under-kbd');
      if (foot.getBoundingClientRect().bottom > vvh + 1) pr.push('foot-under-kbd');
    }
    if (card.scrollHeight > card.clientHeight + 1) pr.push('card-overflow ' + (card.scrollHeight - card.clientHeight));
    if (foot.getBoundingClientRect().bottom > r.bottom + 1) pr.push('foot-out');
    const vis = document.querySelector('.ht-vis'); const visOn = vis && vis.offsetHeight > 0;
    if (ed && visOn) { const fs = parseFloat(ed.style.fontSize); if (ed.style.maxHeight) pr.push('code-cut fs' + fs); else if (fs < 11.5) pr.push('code-fs' + fs); }
    const aib = document.querySelector('.ht-aib');   // «ИИ» (21.11.2026): поле промпта и сообщение клиента
    if (aib && visOn) { const fs = parseFloat(aib.style.fontSize); if (aib.style.maxHeight) pr.push('prompt-cut fs' + fs); else if (fs < 11.5) pr.push('prompt-fs' + fs); }
    if (fr && visOn) {
      const sc = +(fr.style.transform.match(/scale\(([\d.]+)/) || [0, 1])[1]; const fh = fr.offsetHeight * sc;
      if (pg.offsetHeight < fh - 2) pr.push('page-cut sc' + sc.toFixed(2)); else if (sc < 0.62) pr.push('page-sc' + sc.toFixed(2));
    }
    if (document.querySelector('.ht-seg')) pr.push('toggle');
    if (opt !== null && !visOn && vis) pr.push('vis-hidden');
    const pcs = document.querySelector('.ht-asm'); if (pcs && pcs.scrollHeight > pcs.clientHeight + 1) pr.push('asm-overflow');
    document.querySelectorAll('.ht-opt-t').forEach((o) => { if (o.scrollWidth > o.clientWidth + 1) pr.push('opt-wide'); });
    if (pr.length) out.push(id + ' t' + tl + ': ' + pr.join(', '));
  }
  return { n: window.__trenajor.ids.length, w: innerWidth, h: innerHeight, opt, st, out };
};
