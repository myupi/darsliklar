// Снимки экранов урока в фоновом Chrome (19.11.2026): node tools/bs1/shots.mjs <курс/файл> <папка> [--sizes 375x740,1280x720] [--screens 0-17] [--lang uz] [--base URL] [--wait 3500]
// Экран открывается сразу (?start=N), голос «Быстро»; после ожидания — снимок и замер: выходит ли .stage-content за край.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launchChrome, openPage } from '../qa/lesson-team/lib/chrome.mjs';
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const file = a[0], out = a[1];
const sizes = opt('--sizes', '375x740,1280x720').split(',').map((s) => s.split('x').map(Number));
// --screens: диапазон «3-9» или список «3,5,9» (20.11.2026: список раньше молча ничего не снимал).
const scr = opt('--screens', '0-17');
const LIST = scr.includes(',') ? scr.split(',').map(Number) : null;
const [s0, s1] = LIST ? [0, -1] : scr.split('-').map(Number);
const lang = opt('--lang', 'uz'), base = opt('--base', 'http://localhost:5173'), wait = +opt('--wait', '3500');
mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = await launchChrome();
const page = await openPage(chrome.port);
await page.send('Page.enable');
try {
  for (const [w, h] of sizes) {
    await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
    for (const n of LIST || Array.from({ length: (isNaN(s1) ? s0 : s1) - s0 + 1 }, (_, i) => s0 + i)) {
      await page.send('Page.navigate', { url: `${base}/player.html?file=${encodeURIComponent(file)}&lang=${lang}&voice=fast&start=${n}` });
      await sleep(wait);
      const m = await page.evaluate(`(() => { const s = document.querySelector('.stage-content'); if (!s) return 'нет .stage-content'; const out = []; const o = s.scrollHeight - s.clientHeight; if (o > 1) out.push('выход за край ' + o + 'px');
        const ask = document.querySelector('.kz-ask-wrap'), sc = document.querySelector('.kz-scene');
        // реальные окна сцены (код, браузер, карточки) — содержимое может вылезать из рамки сцены
        const kids = sc ? [...sc.querySelectorAll('.kz-col > *')].filter((e) => e.offsetHeight > 2 && getComputedStyle(e).position !== 'absolute') : [];
        const top = kids.length ? Math.min(...kids.map((e) => e.getBoundingClientRect().top)) : (sc ? sc.getBoundingClientRect().top : 0);
        const bot = kids.length ? Math.max(...kids.map((e) => e.getBoundingClientRect().bottom)) : (sc ? sc.getBoundingClientRect().bottom : 0);
        if (ask && sc) { const d = ask.getBoundingClientRect().bottom - top; if (d > 1) out.push('сцена на задании ' + Math.round(d) + 'px'); }
        const row = document.querySelector('.kz-sheet-body > .kz-row, .kz-sheet-body > .kz-pick, .kz-sheet-body > .keys, .kz-sheet-body > .kz-ready-row, .kz-sheet-body > button'); if (row && sc) { const d = bot - row.getBoundingClientRect().top; if (d > 1) out.push('кнопки на сцене ' + Math.round(d) + 'px'); }
        return out.join('; '); })()`).catch((e) => 'ошибка ' + e.message);
      const shot = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
      writeFileSync(join(out, `s${String(n + 1).padStart(2, '0')}-${w}x${h}-${lang}.jpg`), Buffer.from(shot.data, 'base64'));
      console.log(`${n + 1} ${w}x${h} ${lang}${m ? ' — ' + m : ''}`);
    }
  }
} finally { chrome.close(); }
