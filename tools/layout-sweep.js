// Проверка раскладки уроков в браузере (dev-сервер, порт 5173).
// Открывает каждый экран урока в невидимом iframe нужного размера и ищет:
//   · переполнение .stage-content (контент не влез и обрезан);
//   · горизонтальную прокрутку страницы;
//   · экраны, которые не отрисовались (нет .stage — урок упал);
//   · ошибки JavaScript.
// С slack: true ещё и считает запас высоты: сколько пикселей свободно, когда
// контент стоит в естественном размере. Запас меньше ~60 px на 360×640 —
// повод поставить экрану Stage voiceTop (голос в шапке вместо героя).
//
// Запуск — в браузерной панели (javascript_tool) на любой странице dev-сервера:
//   const m = await import('/tools/layout-sweep.js');
//   await m.sweep({ lessons: [{ file: 'html/02-zagolovki-i-tekst', screens: 19 }] });
// Долгий прогон (больше ~40 запусков) — фоном, чтобы не упереться в таймаут:
//   m.sweepBg({ ... }); затем m.result() через полминуты-минуту.
// Проверяется НАЧАЛЬНОЕ состояние экранов; состояния по ходу задания
// (подсказка, шаги, готовая страница, клавиатура) проверяются отдельно.

const SIZES = [[360, 640], [375, 740], [1440, 900]];
const LANGS = ['uz', 'ru', 'en'];

async function probe(file, lang, w, h, s, wait, slack) {
  const f = document.createElement('iframe');
  f.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px;opacity:0;pointer-events:none`;
  f.src = `/player.html?file=${file}&lang=${lang}&voice=off&start=${s}`;
  document.body.appendChild(f);
  await new Promise((r) => { f.onload = r; });
  const errs = [];
  f.contentWindow.addEventListener('error', (e) => errs.push(e.message));
  await new Promise((r) => setTimeout(r, wait));
  const d = f.contentDocument;
  const c = d.querySelector('.stage-content');
  const row = { file, lang, size: `${w}×${h}`, screen: s + 1 };
  row.stage = !!d.querySelector('.stage');
  row.over = c ? c.scrollHeight - c.clientHeight : null;
  row.hscroll = d.documentElement.scrollWidth - w;
  row.errors = errs;
  if (slack && c) {
    const st = c.querySelector('.stack');
    if (st) {
      const kids = [...st.children];
      const gap = parseFloat(getComputedStyle(st).rowGap) || 0;
      const nat = kids.reduce((a, k) => a + Math.max(k.scrollHeight, k.getBoundingClientRect().height), 0)
        + gap * Math.max(0, kids.length - 1);
      row.slack = Math.round(c.clientHeight - nat);
      row.voiceTop = d.querySelector('.stage').classList.contains('stage-bare');
    }
  }
  f.remove();
  return row;
}

// lessons: [{ file: 'html/02-zagolovki-i-tekst', screens: 19 }]
export async function sweep({ lessons, langs = LANGS, sizes = SIZES, wait = 600, slack = false, all = false } = {}) {
  const rows = [];
  for (const L of lessons) {
    for (const lang of langs) {
      for (const [w, h] of sizes) {
        for (let s = 0; s < L.screens; s += 1) rows.push(await probe(L.file, lang, w, h, s, wait, slack));
      }
    }
  }
  const problems = rows.filter((r) => !r.stage || r.over > 0 || r.hscroll > 0 || r.errors.length);
  if (all || slack) return { runs: rows.length, problems, rows };
  return { runs: rows.length, problems };
}

let _bg = null;
export function sweepBg(opts) { _bg = { done: false }; sweep(opts).then((r) => { _bg = Object.assign({ done: true }, r); }); return 'started'; }
export function result() { return _bg; }
