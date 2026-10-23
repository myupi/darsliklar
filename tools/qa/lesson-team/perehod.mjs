// Проверка перехода «разбор и сборка» в бумажных уроках и практиках.
// Запуск (нужен дев-сервер на 5173, npm run dev): node tools/qa/lesson-team/perehod.mjs html/03-spiski 15 360x640 [lang]
// Аргументы: файл урока, число экранов, размер. На каждом экране i нажимается «Назад» и ловится:
// в снимке старого листа — видимое, что не разлетается; в новом листе — видимое без влёта. ✗ — переход сломан.
import { launchChrome, openPage } from '/Users/mac/Documents/darsliklar/tools/qa/lesson-team/lib/chrome.mjs';
const [file, n, size = '360x640', lang = 'ru'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const ch = await launchChrome(); const pg = await openPage(ch.port);
await pg.send('Page.enable');
await pg.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PROBE = `(() => {
  const vis = (el) => { const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const leafy = (el) => { if (/^(svg|img|canvas|textarea|input)$/i.test(el.tagName)) return true; for (const c of el.childNodes) if (c.nodeType === 3 && c.textContent.trim()) return true; const cs = getComputedStyle(el); return cs.backgroundImage !== 'none' || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent'); };
  const name = (el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : (el.className && el.className.baseVal ? '.' + el.className.baseVal.split(' ')[0] : ''));
  window.__probeOut = () => {
    const snap = document.querySelector('.kz-snap'); if (!snap) return { err: 'нет снимка' };
    const body = snap.querySelector('.kz-sheet-body'); if (!body) return { err: 'в снимке нет листа' };
    const go = snap.querySelectorAll('.kz-out-go').length;
    const left = new Set();
    body.querySelectorAll('*').forEach((el) => { if (el.closest('.kz-out-go') || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return; if (!vis(el) || !leafy(el)) return; let top = el; while (top.parentElement && top.parentElement !== body && !top.parentElement.classList.contains('kz-out-go')) top = top.parentElement; left.add(name(top) + ' > ' + name(el)); });
    return { go, left: [...left].slice(0, 8) };
  };
  window.__probeIn = () => {
    const sheet = [...document.querySelectorAll('.kz-sheet')].find((x) => !x.closest('.kz-snap')); if (!sheet) return { err: 'нет листа' };
    const body = sheet.querySelector('.kz-sheet-body');
    const anim = (el) => { for (let e = el; e && e !== body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.animationName && cs.animationName !== 'none') return true; } return false; };
    const pop = new Set();
    body.querySelectorAll('*').forEach((el) => { if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return; if (!vis(el) || !leafy(el) || anim(el)) return; let top = el; while (top.parentElement && top.parentElement !== body) top = top.parentElement; pop.add(name(top) + ' > ' + name(el)); });
    return { pop: [...pop].slice(0, 8) };
  };
  return true; })()`;
const res = [];
for (let i = 1; i < +n; i++) {
  await pg.send('Page.navigate', { url: `http://localhost:5173/player.html?file=${file}&lang=${lang}&voice=fast&start=${i}` });
  await sleep(2600);
  await pg.evaluate(PROBE);
  const ok = await pg.evaluate(`(() => { const b = document.querySelector('.stage-nav button.btn-ghost'); if (!b || b.disabled) return false; b.click(); return true; })()`);
  if (!ok) { res.push(`${i}: нет «Назад»`); continue; }
  await sleep(40);
  const out = JSON.parse(await pg.evaluate(`JSON.stringify(window.__probeOut())`));
  await sleep(340);
  const inn = JSON.parse(await pg.evaluate(`JSON.stringify(window.__probeIn())`));
  const bad = (out.err || out.left.length || inn.err || inn.pop.length);
  res.push(`${bad ? '✗' : '✓'} ${i}→${i - 1}: разлёт ${out.err || out.go + ' вырезок' + (out.left.length ? '; НЕ разлетелось: ' + out.left.join(' | ') : '')}; сборка ${inn.err || (inn.pop.length ? 'БЕЗ ВЛЁТА: ' + inn.pop.join(' | ') : 'ок')}`);
}
console.log(file, size, '\n' + res.join('\n'));
ch.close(); process.exit(0);
