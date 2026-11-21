// Полный замер уроков модуля Bootstrap в фоновом Chrome (20.11.2026, заказчик: «прогоним все уроки бутстрапа, на компе,
// на телефоне, на планшете и на телефоне с открытой клавиатурой там, где это нужно»).
//   node tools/bootstrap/sweep.mjs --lessons 01-vvedenie,02-cveta-i-knopki --sizes 360x640,768x1024,1280x720 --langs uz
//        [--kbd] [--screens 0-16 | 3,5,9] [--out папка] [--base URL] [--wait 3500]
// Каждый экран открывается сразу (?start=N, голос «Быстро»). Замер:
//   · нет .stage-content (урок упал), ошибки JavaScript (Runtime.exceptionThrown);
//   · выход за край .stage-content, горизонтальная прокрутка страницы;
//   · сцена наезжает на задание, кнопки ниже сцены наезжают на сцену (как tools/bs1/shots.mjs).
// --kbd — «телефон с открытой клавиатурой», как в просмотрщике (src/viewer/DeviceStage.jsx): окно 390×844, видно 390×460,
//   урок получает is-kbd и --vvh: 460px. Снимаются только экраны с полем ввода (в коде урока или на странице в окне);
//   замер: поле и кнопка проверки видны над клавиатурой (нижний край ≤ 460).
// Снимки — <out>/<урок>/sNN-<размер>-<язык>[-kbd].jpg; итог — строки «урок экран размер язык — что не так».
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launchChrome, openPage } from '../qa/lesson-team/lib/chrome.mjs';

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const lessons = opt('--lessons', '').split(',').filter(Boolean);
const kbd = a.includes('--kbd');
const sizes = (kbd ? '390x844' : opt('--sizes', '360x640,768x1024,1280x720')).split(',').map((s) => s.split('x').map(Number));
const langs = opt('--langs', 'uz').split(',');
const scr = opt('--screens', '0-16');
const screens = scr.includes('-') ? (() => { const [x, y] = scr.split('-').map(Number); return Array.from({ length: y - x + 1 }, (_, i) => x + i); })() : scr.split(',').map(Number);
const out = opt('--out', 'scratch-sweep'), base = opt('--base', 'http://localhost:5173'), wait = +opt('--wait', '3500');
const VVH = 460;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = await launchChrome();
const page = await openPage(chrome.port);
await page.send('Page.enable');
await page.send('Runtime.enable');
let errs = [];
page.on('Runtime.exceptionThrown', (p) => { const d = p.exceptionDetails || {}; errs.push(((d.exception && d.exception.description) || d.text || 'error').split('\n')[0].slice(0, 160)); });

// Клавиатура: класс is-kbd и --vvh на <html>, держатся наблюдателем (канон снимает их по событиям visualViewport).
const KBD_JS = `(() => { const r = document.documentElement; const fix = () => { if (!r.classList.contains('is-kbd')) r.classList.add('is-kbd'); if (r.style.getPropertyValue('--vvh') !== '${VVH}px') r.style.setProperty('--vvh', '${VVH}px'); };
  fix(); new MutationObserver(fix).observe(r, { attributes: true, attributeFilter: ['class', 'style'] }); return true; })()`;
const MEASURE = (kb) => `(() => {
  const s = document.querySelector('.stage-content'); if (!s) return { miss: true };
  const out = [];
  const W = window.innerWidth, H = ${kb ? VVH : 'window.innerHeight'};
  const o = s.scrollHeight - s.clientHeight; if (o > 1 && !${kb}) out.push('выход за край ' + o + 'px');
  const hs = document.documentElement.scrollWidth - W; if (hs > 1) out.push('прокрутка вбок ' + hs + 'px');
  const ask = document.querySelector('.kz-ask-wrap'), sc = document.querySelector('.kz-scene');
  const kids = sc ? [...sc.querySelectorAll('.kz-col > *')].filter((e) => e.offsetHeight > 2 && getComputedStyle(e).position !== 'absolute') : [];
  const top = kids.length ? Math.min(...kids.map((e) => e.getBoundingClientRect().top)) : (sc ? sc.getBoundingClientRect().top : 0);
  const bot = kids.length ? Math.max(...kids.map((e) => e.getBoundingClientRect().bottom)) : (sc ? sc.getBoundingClientRect().bottom : 0);
  if (ask && sc && !${kb}) { const d = ask.getBoundingClientRect().bottom - top; if (d > 1) out.push('сцена на задании ' + Math.round(d) + 'px'); }
  const row = document.querySelector('.kz-sheet-body > .kz-row, .kz-sheet-body > .kz-pick, .kz-sheet-body > .keys, .kz-sheet-body > .kz-ready-row, .kz-sheet-body > button');
  if (row && sc && !${kb}) { const d = bot - row.getBoundingClientRect().top; if (d > 1) out.push('кнопки на сцене ' + Math.round(d) + 'px'); }
  // поле ввода: в коде урока или на странице в окне (форма урока 7)
  let field = document.querySelector('.kz-gap textarea, .kz-gap input, .cp-gap textarea, .cp-ed:not(.cp-static)');   // уроки и практики (tools/bsp)
  let fr = field ? field.getBoundingClientRect() : null;
  if (!field) {
    for (const f of document.querySelectorAll('.kz-br:not(.b1-docs) iframe')) {
      const d = f.contentDocument; const el = d && d.querySelector('input[type="text"], input[type="email"], input:not([type]), textarea');
      if (el) { const b = f.getBoundingClientRect(), k = b.width / (f.offsetWidth || 1), r = el.getBoundingClientRect(); fr = { top: b.top + r.top * k, bottom: b.top + r.bottom * k }; field = el; break; }
    }
  }
  const res = { issues: out, hasField: !!field };
  if (${kb} && field) {
    if (fr.bottom > H + 1) out.push('поле под клавиатурой ' + Math.round(fr.bottom - H) + 'px');
    if (fr.top < -1) out.push('поле выше экрана');
    const btn = [...document.querySelectorAll('.kz-row .kz-btn.is-coral, .kz-ready-row button, .kz-sheet-body > .kz-row button, .cp-keys .key-go')].find((x) => x.offsetHeight > 0);
    if (btn) { const r = btn.getBoundingClientRect(); if (r.bottom > H + 1) out.push('кнопка проверки под клавиатурой ' + Math.round(r.bottom - H) + 'px'); }
  }
  return res;
})()`;

const rows = [];
try {
  for (const file of lessons) {
    const dir = join(out, file);
    mkdirSync(dir, { recursive: true });
    for (const lang of langs) {
      for (const [w, h] of sizes) {
        await page.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 720 });
        for (const n of screens) {
          errs = [];
          await page.send('Page.navigate', { url: `${base}/player.html?file=bootstrap/${file}&lang=${lang}&voice=fast&start=${n}` });
          if (kbd) await sleep(600);
          if (kbd) await page.evaluate(KBD_JS).catch(() => null);
          await sleep(wait);
          const m = await page.evaluate(MEASURE(kbd)).catch((e) => ({ issues: ['ошибка замера ' + e.message] }));
          if (kbd && m && !m.miss && !m.hasField) continue;   // клавиатура — только экраны с полем
          const shot = await page.send('Page.captureScreenshot', kbd ? { format: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: w, height: VVH, scale: 1 } } : { format: 'jpeg', quality: 70 });
          writeFileSync(join(dir, `s${String(n + 1).padStart(2, '0')}-${w}x${h}-${lang}${kbd ? '-kbd' : ''}.jpg`), Buffer.from(shot.data, 'base64'));
          const issues = m.miss ? ['нет .stage-content'] : (m.issues || []);
          const e = [...new Set(errs)].filter((x) => !/ResizeObserver loop/.test(x));
          if (e.length) issues.push('ошибка JS: ' + e.join(' | '));
          const line = `${file} ${n + 1} ${w}x${h}${kbd ? '-kbd' : ''} ${lang}${issues.length ? ' — ' + issues.join('; ') : ''}`;
          rows.push(line);
          console.log(line);
        }
      }
    }
  }
} finally { chrome.close(); }
