// Прогон замера тренажёра сразу в нескольких окнах (19.11.2026). Вставить на любой странице dev-сервера:
//   const s = await (await fetch('/tools/trenajor/sweep-all.js')).text(); eval(s);
//   window.__all = null; __sweepAll({ lang: 'uz', opt: null }).then((r) => (window.__all = r));
// t — тренажёр (html, css); sizes — окна [ширина, высота, видимая высота при клавиатуре?]; ids — только эти вопросы; opt — как в sweep.js.
// Клавиатура: класс is-kbd и --vvh на <html> окна (как DeviceStage), плюс проверка, что поле и кнопка над ней.
window.__sweepAll = async ({ t = 'html', lang = 'uz', opt = null, sizes = [[360, 640], [375, 740], [1280, 720], [1440, 900]], ids = null } = {}) => {
  const src = await (await fetch('/tools/trenajor/sweep.js')).text();
  document.querySelectorAll('iframe.sw-f').forEach((f) => f.remove());
  const res = await Promise.all(sizes.map(([w, h, vvh]) => new Promise((done) => {
    const f = document.createElement('iframe'); f.className = 'sw-f';
    f.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px;border:0;opacity:.15;z-index:99999;background:#fff`;
    f.src = `/trainer.html?t=${t}&lang=${lang}&qa=1`;
    f.onload = async () => {
      const win = f.contentWindow;
      for (let k = 0; k < 100 && !win.__trenajor; k++) await new Promise((r) => setTimeout(r, 100));
      if (vvh) {
        const r = win.document.documentElement;
        const fix = () => { if (!r.classList.contains('is-kbd')) r.classList.add('is-kbd'); if (r.style.getPropertyValue('--vvh') !== vvh + 'px') r.style.setProperty('--vvh', vvh + 'px'); };
        fix(); new win.MutationObserver(fix).observe(r, { attributes: true, attributeFilter: ['class', 'style'] });
      }
      if (ids) win.__sweepIds = ids;
      win.eval(src);
      const out = await win.__sweep(opt);
      if (vvh) {   // поле и кнопка «Tekshirish» над клавиатурой, ответ не за её краем
        const kb = [];
        for (const id of ids || win.__trenajor.ids) {
          win.__trenajor.show(id, opt); await new Promise((r) => setTimeout(r, 650));
          const inp = win.document.querySelector('.ht-inp'); const foot = win.document.querySelector('.ht-foot');
          const q = win.document.querySelector('.ht-q');
          const pr = [];
          if (inp && inp.getBoundingClientRect().bottom > vvh + 1) pr.push('input-under-kbd ' + Math.round(inp.getBoundingClientRect().bottom - vvh));
          if (foot && foot.getBoundingClientRect().bottom > vvh + 1) pr.push('foot-under-kbd ' + Math.round(foot.getBoundingClientRect().bottom - vvh));
          if (q && q.getBoundingClientRect().top < -1) pr.push('question-above');
          if (pr.length) kb.push(id + ': ' + pr.join(', '));
        }
        out.kbd = kb;
      }
      out.size = w + 'x' + h + (vvh ? ' kbd' + vvh : ''); out.lang = lang;
      f.remove(); done(out);
    };
    document.body.appendChild(f);
  })));
  return res;
};
