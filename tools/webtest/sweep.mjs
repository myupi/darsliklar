// Замер тестов HTML / CSS / «ИИ» без прокрутки (16.11.2026): node tools/webtest/sweep.mjs <курс> [NN|NN,NN…|all] [--base URL] [--langs uz,ru] [--shots DIR]
// Нужен dev-сервер (npm run dev). Каждый файл lessons/<курс>/NNtK-*.jsx открывается в плеере на 375×740, 360×640, 1280×720,
// 1440×900 до ответа и после ответа (выбран вариант A, «Tekshirish»). Ошибки: экран прокручивается; код в редакторе обрезан;
// окно браузера обрезано или спрятано; картинка вопроса спрятана (is-tight). Код выхода 1, если есть ошибки.
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, openPage } from '../qa/lesson-team/lib/chrome.mjs';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const course = args[0] || 'html';
const nn = args[1] && !args[1].startsWith('--') ? args[1] : 'all';
const base = opt('--base', 'http://localhost:5173');
const langs = opt('--langs', 'uz').split(',');
const shots = opt('--shots', null);
const SIZES = (opt('--sizes', '375x740,360x640,1280x720,1440x900')).split(',').map((s) => s.split('x').map(Number));
const files = readdirSync(join(root, 'lessons', course)).filter((f) => /^\d\d(?:q\d)?t\d-.+\.jsx$/.test(f)).filter((f) => nn === 'all' || nn.split(',').some((x) => f.startsWith(x.padStart(2, '0') + 't') || f.startsWith(x.padStart(2, '0') + 'q'))).sort();
if (shots) mkdirSync(shots, { recursive: true });
const MEASURE = (after) => `(() => {
  const m = document.querySelector('.aq-main'); if (!m) return { err: 'нет .aq-main' };
  const out = [];
  if (m.scrollHeight > m.clientHeight + 1) out.push('прокрутка ' + (m.scrollHeight - m.clientHeight) + 'px');
  if (document.querySelector('.aq.is-tight')) out.push('картинка спрятана (is-tight)');
  const vis = document.querySelector('.aq-vis');
  if (vis) {
    const vb = vis.getBoundingClientRect();
    document.querySelectorAll('.wq-ed, .aq-br, .aq-prompt, .aq-msg').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.height < 2 || getComputedStyle(el).visibility === 'hidden') { if (${after} || !el.closest('.aq-vis')) return; out.push(el.className.split(' ')[0] + ' спрятан'); return; }   // после ответа окно может спрятаться
      if (b.bottom > vb.bottom + 1.5) out.push(el.className.split(' ')[0] + ' обрезан на ' + Math.round(b.bottom - vb.bottom) + 'px');
      if (b.right > vb.right + 1.5) out.push(el.className.split(' ')[0] + ' шире на ' + Math.round(b.right - vb.right) + 'px');
    });
    const ed = document.querySelector('.wq-ed'); if (ed && parseFloat(ed.style.fontSize) < 10.5 && !${after}) out.push('~ код 10px (мелко, но допустимо)');
  }
  return { out };
})()`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = await launchChrome();
const page = await openPage(chrome.port);
let bad = 0;
try {
  await page.send('Page.enable');
  for (const f of files) {
    const file = course + '/' + f.replace(/\.jsx$/, '');
    for (const L of langs) {
      for (const [w, h] of SIZES) {
       for (let attempt = 1; attempt <= 2; attempt += 1) {   // страница перезагрузилась на ходу (пересборка, HMR) — ещё раз
       try {
        await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
        await page.send('Page.navigate', { url: `${base}/player.html?file=${encodeURIComponent(file)}&lang=${L}&voice=fast` });
        let ok = false;
        for (let i = 0; i < 60 && !ok; i += 1) { await sleep(150); ok = await page.evaluate("!!document.querySelector('.aq-opt')").catch(() => false); }
        if (!ok) { console.log(`✗ ${file} ${L} ${w}x${h}: тест не загрузился`); bad += 1; continue; }
        await sleep(900);
        const a = await page.evaluate(MEASURE(false));
        await page.evaluate("document.querySelector('.aq-opt[data-v=\"0\"]').click()");   // нет варианта — исключение, повтор
        await sleep(150);
        await page.evaluate("(document.querySelector('.quiz-shell-check') || {}).click && document.querySelector('.quiz-shell-check').click()");
        await sleep(1400);
        const b = await page.evaluate(MEASURE(true));
        const probs = [...(a.out || [a.err]).map((x) => 'до: ' + x), ...(b.out || [b.err]).map((x) => 'после: ' + x)];
        if (shots) { const s = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 }); writeFileSync(join(shots, `${f.replace(/\.jsx$/, '')}-${L}-${w}x${h}.jpg`), Buffer.from(s.data, 'base64')); }
        const hard = probs.filter((x) => !x.includes('~ '));
        if (probs.length) console.log(`${hard.length ? '✗' : '~'} ${file} ${L} ${w}x${h}: ${probs.join('; ')}`);
        if (hard.length) bad += 1;
        break;
       } catch (e) { if (attempt === 2) { bad += 1; console.log(`✗ ${file} ${L} ${w}x${h}: сбой замера — ${e.message}`); } }
       }
      }
    }
    console.log(`· ${file}`);
  }
} finally { chrome.close(); }
console.log(bad ? `Проблем: ${bad}` : 'Без прокрутки и обрезки — все.');
process.exit(bad ? 1 : 0);
