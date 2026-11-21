// Замер ровности окон на экранах уроков (21.11.2026, замечание заказчика: «окна не вровень, пустоты»):
// node tools/bootstrap/align.mjs --lessons 02-cveta-i-knopki,03-… [--sizes 1366x800] [--screens 0-20] [--lang uz] [--base url]
// Колонки сцены, стоящие рядом: верх и низ отличаются больше 12 px — «не вровень»; внутри колонки пустота между окнами > 30 px.
import { launchChrome, openPage } from '../qa/lesson-team/lib/chrome.mjs';
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const lessons = opt('--lessons', '').split(',').filter(Boolean);
const sizes = opt('--sizes', '1366x800').split(',').map((s) => s.split('x').map(Number));
const [s0, s1] = opt('--screens', '0-20').split('-').map(Number);
const lang = opt('--lang', 'uz'), base = opt('--base', 'http://localhost:5173'), wait = +opt('--wait', '3500');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = await launchChrome();
const page = await openPage(chrome.port);
await page.send('Page.enable');
const PROBE = `(() => {
  const s = document.querySelector('.stage-content'); if (!s) return 'END';
  const sc = document.querySelector('.kz-scene'); if (!sc) return '';
  const vis = (e) => e.offsetHeight > 2 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).position !== 'absolute';
  const cols = [...sc.children].filter((c) => c.classList.contains('kz-col') && vis(c));
  const groups = [];
  cols.forEach((c) => { const l = Math.round(c.getBoundingClientRect().left); let g = groups.find((x) => Math.abs(x.l - l) < 6); if (!g) { g = { l, items: [] }; groups.push(g); }
    [...c.children].filter(vis).forEach((e) => g.items.push(e.getBoundingClientRect())); });
  const gs = groups.filter((g) => g.items.length);
  if (gs.length < 2) return '';
  const out = [];
  const tops = gs.map((g) => Math.min(...g.items.map((r) => r.top))), bots = gs.map((g) => Math.max(...g.items.map((r) => r.bottom)));
  const dt = Math.max(...tops) - Math.min(...tops), db = Math.max(...bots) - Math.min(...bots);
  if (dt > 12) out.push('верх не вровень ' + Math.round(dt));
  if (db > 12) out.push('низ не вровень ' + Math.round(db));
  gs.forEach((g, i) => { const rs = g.items.slice().sort((x, y) => x.top - y.top); for (let k = 1; k < rs.length; k++) { const gap = rs[k].top - rs[k - 1].bottom; if (gap > 30) out.push('пустота в колонке ' + (i + 1) + ': ' + Math.round(gap)); } });
  return out.join('; ');
})()`;
try {
  for (const les of lessons) {
    for (const [w, h] of sizes) {
      await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
      for (let n = s0; n <= s1; n++) {
        await page.send('Page.navigate', { url: `${base}/player.html?file=bootstrap/${les}&lang=${lang}&voice=fast&start=${n}` });
        await sleep(wait);
        const m = await page.evaluate(PROBE).catch((e) => 'ошибка ' + e.message);
        if (m === 'END') break;
        if (m) console.log(`${les} ${n + 1} ${w}x${h} — ${m}`);
      }
    }
  }
  console.log('align done');
} finally { chrome.close(); }
