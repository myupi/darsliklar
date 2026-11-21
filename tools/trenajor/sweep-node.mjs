// Замер тренажёра в фоновом Chrome (21.11.2026): node tools/trenajor/sweep-node.mjs <модуль> [--sizes 1280x720,390x844] [--lang uz]
// [--base url]. Для каждого размера — до ответа и после неверного ответа (sweep.js в окне /trainer.html?t=…&qa=1).
// Печатает только вопросы с замечаниями и сводку. Нужен dev-сервер.
import { launchChrome, openPage } from '../qa/lesson-team/lib/chrome.mjs';
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const t = a[0] || 'html';
const sizes = opt('--sizes', '1280x720,390x844').split(',').map((s) => s.split('x').map(Number));
const lang = opt('--lang', 'uz'), base = opt('--base', 'http://localhost:5173');
const ids = opt('--ids', '');   // только эти вопросы (через запятую)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = await launchChrome();
try {
  for (const [w, h] of sizes) {
    for (const ans of [null, 'x']) {
      const page = await openPage(chrome.port);
      await page.send('Page.enable');
      await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
      await page.send('Page.navigate', { url: `${base}/trainer.html?t=${t}&lang=${lang}&qa=1` });
      for (let k = 0; k < 100; k++) { await sleep(150); if (await page.evaluate('!!window.__trenajor').catch(() => false)) break; }
      let res = null;
      for (let tr = 0; tr < 2 && !res; tr++) {   // пересборка тренажёра перезагружает страницу (Vite) — тогда ещё раз
        try { res = await page.evaluate(`(async () => { const s = await (await fetch('/tools/trenajor/sweep.js')).text(); eval(s); ${ids ? 'window.__sweepIds = ' + JSON.stringify(ids.split(',')) + ';' : ''} window.__sweepW0 = 120; window.__sweepW1 = 320; return await window.__sweep(${ans ? "'x'" : 'null'}); })()`, 900000); } catch (e) { console.log('  повтор: ' + e.message); await page.send('Page.navigate', { url: `${base}/trainer.html?t=${t}&lang=${lang}&qa=1` }); await sleep(3000); }
      }
      const list = Array.isArray(res) ? res : (res && (res.out || res.problems)) || [];
      const bad = list.filter((x) => typeof x === 'string' ? !/: ok$|^\s*$/.test(x) : true);
      console.log(`${w}x${h} ${ans ? 'после ответа' : 'до ответа'}: ${JSON.stringify(res && res.st)} · вопросов ${res && res.n} · замечаний ${bad.length}`);
      bad.slice(0, 60).forEach((x) => console.log('  ' + (typeof x === 'string' ? x : JSON.stringify(x))));
      page.close();
    }
  }
  console.log('sweep-node done');
} finally { chrome.close(); }
