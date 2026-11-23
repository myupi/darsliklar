// Прогон уроков Bootstrap по состояниям заданий на телефоне (23.11.2026, заказчик: «пройдись по всему бустстрапу на телефоне
// с открытой клавиатурой (если оно нужно) и с закрытой на 3 языках… пройди во всех возможных состояниях»).
//   node tools/bootstrap/states.mjs --lessons 01-vvedenie,02-cveta-i-knopki --langs uz,ru,en [--size 390x844] [--screens 0-17]
//        [--out папка] [--base URL] [--wait 3500]
// Каждый экран открывается заново (?start=N, голос «Быстро»). Вид экрана: поле ввода (fill), выбор вариантов (choice),
// кусочки по порядку (pieces), остальное (show). Состояния и снимки:
//   s0 — как открылся; hint — открыта лампочка (панель «Maslahat»); err — неверный ответ (панель ошибки);
//   ok — верный ответ (панель «Barakalla!»; ответ поля — из последней ступени подсказки «Yozing: …» / «Впиши: …» / «Type: …»;
//   варианты и кусочки — перебором); у поля ещё kbd / kbd-err / kbd-ok — открытая клавиатура (окно 390×844, видно 390×460,
//   is-kbd и --vvh, как просмотрщик), поле в фокусе.
// Замер каждого состояния: выход за край, прокрутка вбок, сцена на задании, кнопки на сцене, текст кнопки-варианта обрезан,
// поле / кнопка проверки / окно страницы закрыты панелью (панель встаёт на место нижней полосы) или клавиатурой.
// Итог — строки «урок экран вид состояние язык — что не так» и снимки <out>/<урок>/sNN-<язык>-<состояние>.jpg.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launchChrome, openPage } from '../qa/lesson-team/lib/chrome.mjs';

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const lessons = opt('--lessons', '').split(',').filter(Boolean);
const langs = opt('--langs', 'uz').split(',');
const [W, H] = opt('--size', '390x844').split('x').map(Number);
const scr = opt('--screens', '0-17');
const screens = scr.includes('-') ? (() => { const [x, y] = scr.split('-').map(Number); return Array.from({ length: y - x + 1 }, (_, i) => x + i); })() : scr.split(',').map(Number);
const out = opt('--out', 'scratch-states'), base = opt('--base', 'http://localhost:5173'), wait = +opt('--wait', '3500');
const VVH = 460;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = await launchChrome();
const page = await openPage(chrome.port);
await page.send('Page.enable');
await page.send('Runtime.enable');
let errs = [];
page.on('Runtime.exceptionThrown', (p) => { const d = p.exceptionDetails || {}; errs.push(((d.exception && d.exception.description) || d.text || 'error').split('\n')[0].slice(0, 160)); });
const ev = (js) => page.evaluate(js).catch(() => null);

const KBD_JS = `(() => { const r = document.documentElement; const fix = () => { if (!r.classList.contains('is-kbd')) r.classList.add('is-kbd'); if (r.style.getPropertyValue('--vvh') !== '${VVH}px') r.style.setProperty('--vvh', '${VVH}px'); };
  fix(); new MutationObserver(fix).observe(r, { attributes: true, attributeFilter: ['class', 'style'] }); return true; })()`;

// Помощники в странице: поиск полей, кнопок, вариантов; чтение панели.
const HELP = `window.__st = window.__st || {
  fields: () => [...document.querySelectorAll('.kz-gap textarea, .kz-gap input, .kz-sheet-body textarea.tk-input')].filter((e) => e.offsetHeight > 0 && !e.disabled),
  check: () => [...document.querySelectorAll('.kz-sheet-body button.kz-btn.is-coral, .kz-ready-row button, .kz-sheet-body .kz-row button')].find((b) => b.offsetHeight > 0),
  opts: () => [...document.querySelectorAll('.kz-sheet-body .kz-pick button, .kz-sheet-body .b1-why button, .kz-sheet-body .b2-codes button')].filter((b) => b.offsetHeight > 0),
  pieces: () => [...document.querySelectorAll('.kz-sheet-body .b4-piece, .kz-sheet-body .b5-piece')].filter((b) => b.offsetHeight > 0),
  // панель: ok — «Barakalla!» (is-sheet-ok у сцены); err — ошибка (is-err у панели); hint — подсказка лампочки или сама (is-hint)
  sheet: () => { const st = document.querySelector('.stage'), nav = document.querySelector('.stage-nav'); if (st && / is-sheet-ok/.test(st.className)) return 'ok'; if (nav && nav.classList.contains('is-err')) return 'err'; if (nav && nav.classList.contains('is-hint')) return 'hint'; return null; },
  // ход задания: счётчик раунда и открыта ли «Davom etish»
  prog: () => { const n = document.querySelector('.kz-ask-n'); const go = [...document.querySelectorAll('.stage-nav button.btn-accent')].find((b) => !b.disabled); return (n ? n.innerText : '') + '|' + (go ? 'go' : ''); },
  sheetBtn: () => document.querySelector('.stage-nav.b-sheet button:last-of-type'),
  sheetText: () => { const s = document.querySelector('.stage-nav.b-sheet'); return s ? s.innerText : ''; },
  set: (el, v) => { const d = Object.getOwnPropertyDescriptor(el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value'); d.set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); },
  kind: () => { const S = window.__st; if (S.fields().length) return 'fill'; if (S.pieces().length) return 'pieces'; if (S.opts().filter((b) => b.dataset.v != null).length >= 2) return 'choice'; return 'show'; },
  canTap: () => { const S = window.__st; const k = S.kind(); if (k === 'fill') return !!S.check(); if (k === 'choice') return S.opts().some((b) => !b.disabled); if (k === 'pieces') return S.pieces().some((b) => !b.disabled); return true; }
}; true`;

const MEASURE = (kb) => `(() => {
  const s = document.querySelector('.stage-content'); if (!s) return { miss: true };
  const out = [];
  const Hh = ${kb ? VVH : 'window.innerHeight'};
  const o = s.scrollHeight - s.clientHeight; if (o > 1 && !${kb}) out.push('выход за край ' + o + 'px');
  const hs = document.documentElement.scrollWidth - window.innerWidth; if (hs > 1) out.push('прокрутка вбок ' + hs + 'px');
  const ask = document.querySelector('.kz-ask-wrap'), sc = document.querySelector('.kz-scene');
  const kids = sc ? [...sc.querySelectorAll('.kz-col > *')].filter((e) => e.offsetHeight > 2 && getComputedStyle(e).position !== 'absolute') : [];
  const top = kids.length ? Math.min(...kids.map((e) => e.getBoundingClientRect().top)) : (sc ? sc.getBoundingClientRect().top : 0);
  const bot = kids.length ? Math.max(...kids.map((e) => e.getBoundingClientRect().bottom)) : (sc ? sc.getBoundingClientRect().bottom : 0);
  if (ask && sc && !${kb}) { const d = ask.getBoundingClientRect().bottom - top; if (d > 1) out.push('сцена на задании ' + Math.round(d) + 'px'); }
  const row = document.querySelector('.kz-sheet-body > .kz-row, .kz-sheet-body > .kz-pick, .kz-sheet-body > .keys, .kz-sheet-body > .kz-ready-row, .kz-sheet-body > button');
  if (row && row.offsetHeight > 0 && sc && !${kb}) { const d = bot - row.getBoundingClientRect().top; if (d > 1) out.push('кнопки на сцене ' + Math.round(d) + 'px'); }
  // нижняя граница видимого: панель (встаёт на место нижней полосы) или клавиатура
  const sh = document.querySelector('.stage-nav.b-sheet');
  const lim = Math.min(Hh, sh ? sh.getBoundingClientRect().top : Hh);
  const S = window.__st;
  const f = S && S.fields()[0];
  if (f) { const r = f.getBoundingClientRect(); if (r.bottom > lim + 1) out.push('поле закрыто ' + (${kb} ? 'клавиатурой/панелью' : 'панелью') + ' на ' + Math.round(r.bottom - lim) + 'px'); if (r.top < -1) out.push('поле выше экрана'); }
  const btn = S && S.check();
  if (btn && S.sheet() !== 'ok') { const r = btn.getBoundingClientRect(); if (r.bottom > lim + 1) out.push('кнопка проверки закрыта на ' + Math.round(r.bottom - lim) + 'px'); }
  // окно страницы (последнее окно браузера в сцене, не справка сайта): сколько его видно
  const brs = [...document.querySelectorAll('.kz-scene .kz-br:not(.b1-docs)')].filter((e) => e.offsetHeight > 0);
  const br = brs[brs.length - 1];
  if (br) { const r = br.getBoundingClientRect(); const vis = Math.min(r.bottom, lim) - Math.max(r.top, 0); if (vis < 70) out.push('окно страницы видно ' + Math.max(0, Math.round(vis)) + 'px'); }
  // текст на кнопках-вариантах и кусочках обрезан
  const cut = [...document.querySelectorAll('.kz-sheet-body .kz-pick button, .kz-sheet-body .b1-why button, .kz-sheet-body .b4-piece')].filter((b) => b.offsetHeight > 0 && b.scrollWidth > b.clientWidth + 2);
  if (cut.length) out.push('текст кнопки обрезан: ' + cut.map((b) => b.innerText.trim().slice(0, 24)).join(' / '));
  return { issues: out };
})()`;

async function open(file, lang, n, kb) {
  await page.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: true });
  errs = [];
  await page.send('Page.navigate', { url: `${base}/player.html?file=bootstrap/${file}&lang=${lang}&voice=fast&start=${n}` });
  await sleep(700);
  if (kb) await ev(KBD_JS);
  await sleep(wait);
  await ev(HELP);
  for (let i = 0; i < 24 && !(await ev('window.__st && window.__st.canTap()')); i += 1) await sleep(250);   // ждём, пока Коди договорит
}
const rows = [];
async function snap(dir, file, n, lang, kind, tag, kb) {
  await sleep(500);
  const m = await ev(MEASURE(kb)) || { issues: ['ошибка замера'] };
  const shot = await page.send('Page.captureScreenshot', kb ? { format: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: W, height: VVH, scale: 1 } } : { format: 'jpeg', quality: 70 });
  writeFileSync(join(dir, `s${String(n + 1).padStart(2, '0')}-${lang}-${tag}.jpg`), Buffer.from(shot.data, 'base64'));
  const issues = m.miss ? ['нет .stage-content'] : (m.issues || []);
  const e = [...new Set(errs)].filter((x) => !/ResizeObserver loop/.test(x));
  if (e.length) issues.push('ошибка JS: ' + e.join(' | '));
  const line = `${file} ${n + 1} ${kind} ${tag} ${lang}${issues.length ? ' — ' + issues.join('; ') : ''}`;
  rows.push(line); console.log(line);
}
const closeSheet = async () => { await ev('(window.__st.sheetBtn() || {}).click && window.__st.sheetBtn().click()'); await sleep(500); };
const sheet = () => ev('window.__st.sheet()');
// ответ поля — из последней ступени подсказки
async function answerFromHints() {
  for (let i = 0; i < 4; i += 1) {
    await ev("(document.querySelector('.ctl-hint') || {}).click && document.querySelector('.ctl-hint').click()"); await sleep(600);
    const t = await ev('window.__st.sheetText()') || '';
    const m = /(?:Yozing|Впиши|Type)\s*:\s*([^\n]+?)\.?(?:\s+(?:Keyin|Потом|Then)\b.*)?$/m.exec(t);
    await closeSheet();
    if (m) return m[1].trim().replace(/[«»“”]/g, '');
  }
  return null;
}
async function typeAndCheck(v, kb) {
  await ev(`(() => { const f = window.__st.fields()[0]; if (!f) return; f.focus(); window.__st.set(f, ${JSON.stringify(v)}); })()`);
  await sleep(200);
  if (kb) await ev(KBD_JS);
  await ev('(window.__st.check() || {}).click && window.__st.check().click()');
  await sleep(1200);
}
const prog = () => ev('window.__st.prog()');
const waitOn = async (list) => { for (let i = 0; i < 24; i += 1) { if (await ev(`window.__st.${list}().some((b) => !b.disabled)`)) return true; await sleep(250); } return false; };
const hitOk = () => ev(`!!document.querySelector('.kz-sheet-body .is-ok')`);
const solved = async (p0) => { for (let i = 0; i < 14; i += 1) { const s = await sheet(); const p = await prog(); if (s === 'ok' || p !== p0 || / ?go$/.test(p || '')) return true; if (s === 'err') return false; await sleep(250); } return false; };
async function firstErr(kind) {   // неверный ответ: поле — «qwe»; варианты и кусочки — первый, что даёт ошибку
  if (kind === 'fill') { await typeAndCheck('qwe', false); return (await sheet()) === 'err'; }
  const list = kind === 'choice' ? 'opts' : 'pieces';
  const n = await ev(`window.__st.${list}().length`) || 0;
  for (let j = 0; j < n; j += 1) {
    const i = kind === 'choice' ? n - 1 - j : j;   // варианты — с конца: первым часто стоит верный
    const p0 = await prog(), c0 = await ev(`window.__st.${list}().length`);
    await waitOn(list);
    const ok = await ev(`(() => { const b = window.__st.${list}()[${i}]; if (!b || b.disabled) return false; b.click(); return true; })()`);
    if (!ok) continue;
    await sleep(900);
    if ((await sheet()) === 'err') return true;
    if (kind === 'pieces') { if ((await ev(`window.__st.${list}().length`)) < c0) return false; continue; }
    if ((await hitOk()) || (await prog()) !== p0 || (await sheet()) === 'ok') return false;   // попали в верный — ошибку на этом экране ищем со следующим
  }
  return false;
}
async function solveRound(kind) {   // один раунд верно; возвращает ответ поля (для клавиатуры)
  const p0 = await prog();
  if (kind === 'fill') { const ans = await answerFromHints(); if (!ans) return { ok: false, ans }; await typeAndCheck(ans, false); return { ok: await solved(p0), ans }; }
  const list = kind === 'choice' ? 'opts' : 'pieces';
  for (let guard = 0; guard < 30; guard += 1) {
    const n = await ev(`window.__st.${list}().length`) || 0;
    if (!n) return { ok: true };
    let hit = false;
    for (let i = 0; i < n; i += 1) {
      await waitOn(list);
      const pb = await prog(), cnt = await ev(`window.__st.${list}().length`);
      const ok = await ev(`(() => { const b = window.__st.${list}()[${i}]; if (!b || b.disabled) return false; b.click(); return true; })()`);
      if (!ok) continue;
      await sleep(900);
      const s = await sheet();
      if (s === 'err') { await closeSheet(); continue; }
      if (kind === 'pieces') { if ((await ev(`window.__st.${list}().length`)) < cnt) { hit = true; break; } continue; }
      if (s === 'ok' || (await hitOk()) || (await prog()) !== pb) return { ok: true };
    }
    if (kind === 'choice') return { ok: false };
    if (!hit) return { ok: false };
    if ((await prog()) !== p0 && kind !== 'pieces') return { ok: true };
  }
  return { ok: false };
}

try {
  for (const file of lessons) {
    const dir = join(out, file);
    mkdirSync(dir, { recursive: true });
    for (const lang of langs) {
      for (const n of screens) {
        await open(file, lang, n, false);
        const ok0 = await ev('!!document.querySelector(".stage-content")');
        if (!ok0) { const line = `${file} ${n + 1} ? s0 ${lang} — нет .stage-content`; rows.push(line); console.log(line); continue; }
        const kind = await ev('window.__st.kind()') || 'show';
        await snap(dir, file, n, lang, kind, 's0', false);
        if (kind === 'show') continue;
        // подсказка
        await ev("(document.querySelector('.ctl-hint') || {}).click && document.querySelector('.ctl-hint').click()");
        if (await sheet()) { await snap(dir, file, n, lang, kind, 'hint', false); await closeSheet(); }
        // ошибка
        await open(file, lang, n, false);
        if (await firstErr(kind)) await snap(dir, file, n, lang, kind, 'err', false);
        // верный ответ — раунд за раундом до «Davom etish»; снимок после первого верного и в конце
        await open(file, lang, n, false);
        let ans = null, r1 = null;
        for (let round = 0; round < 6; round += 1) {
          const r = await solveRound(kind);
          if (round === 0) { r1 = r; ans = r.ans || null; }
          if (!r.ok) { const line = `${file} ${n + 1} ${kind} ok ${lang} — верный ответ не принят (раунд ${round + 1}${r.ans !== undefined ? ', ответ: ' + r.ans : ''})`; rows.push(line); console.log(line); break; }
          if (round === 0) await snap(dir, file, n, lang, kind, 'ok1', false);
          const pr = await prog(); let go = false;   // ждём следующий раунд или «Davom etish» (после реплики Коди)
          for (let t = 0; t < 32; t += 1) { const p = await prog() || ''; if (/ ?go$/.test(p)) { go = true; break; } if (p !== pr) break; await sleep(250); }
          if (go) { await snap(dir, file, n, lang, kind, 'done', false); break; }
        }
        // открытая клавиатура — только поле
        if (kind === 'fill') {
          await open(file, lang, n, true);
          await ev('(() => { const f = window.__st.fields()[0]; f && f.focus(); })()');
          await snap(dir, file, n, lang, kind, 'kbd', true);
          await typeAndCheck('qwe', true);
          await ev('(() => { const f = window.__st.fields()[0]; f && f.focus(); })()');
          if ((await sheet()) === 'err') await snap(dir, file, n, lang, kind, 'kbd-err', true);
          if (ans) { await open(file, lang, n, true); const p0 = await prog(); await typeAndCheck(ans, true); if (await solved(p0)) await snap(dir, file, n, lang, kind, 'kbd-ok', true); }
        }
      }
    }
  }
} finally {
  writeFileSync(join(out, 'states-' + lessons.join('+').slice(0, 60) + '.txt'), rows.join('\n') + '\n');
  chrome.close();
}
