#!/usr/bin/env node
// QA урока через существующий плеер проекта — команда уроков (/lesson-team).
// Подробности и формат сценариев: tools/qa/lesson-team/README.md.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchChrome, openPage } from './lib/chrome.mjs';
import { ROOT, WORK, ensureWork, rel, versionOf, stamp, fileHash } from './lib/files.mjs';
import { check, overall, EXIT, writeReport } from './lib/report.mjs';

const HELP = `QA урока через плеер (нужен dev-сервер: npm run dev).

  node tools/qa/lesson-team/run.mjs --file <курс/файл-без-.jsx> [параметры]
  node tools/qa/lesson-team/run.mjs --page </путь/страница.html?…> [параметры]   (произвольная страница, например самопроверка)

Параметры:
  --scenario <файл.qa.mjs>   сценарий действий урока (без него проверка сценария — not-run)
  --checks <список>          load,screens,scenario,keyboard,voice (по умолчанию все)
  --langs uz,ru,en           языки (по умолчанию из сценария или ru)
  --sizes 360x640,…          размеры для проверки экранов (по умолчанию 360x640,375x740,1280x720,1440x900)
  --voice fast|simulate|off|browser   режим голоса плеера (по умолчанию fast)
  --adapter auto|canon-html|basic     адаптер платформы (по умолчанию из сценария или auto)
  --screens N                число экранов (иначе из сценария или по счётчику урока)
  --kbd-screens 2,13         экраны с вводом для эмуляции клавиатуры (иначе из сценария)
  --kbd-size 360x640         размер для эмуляции клавиатуры
  --out <каталог>            куда писать отчёт (по умолчанию work/lesson-team/qa-<время>-<урок>)
  --run-id <id>              писать в work/lesson-team/<id>/qa/<урок>
  --hash <файл,…>            дополнительные файлы версии (исходники урока)
  --base <url>               адрес dev-сервера (по умолчанию http://localhost:5173)
  --serve                    поднять свой dev-сервер этой рабочей копии на свободном порту, без HMR
                             (запись других уроков не перезагружает плеер; так проверяют урок в своей рабочей копии)
  --flows main,f2,…          прогнать только эти ветки сценария (тег main/fN или часть имени ветки)
  --step-timeout <мс>        предел одного шага сценария (по умолчанию 120000)
  --ready-timeout <мс>       предел загрузки урока (по умолчанию 30000)
  --reduced                  prefers-reduced-motion: reduce
  --no-autoplay              не разрешать звук без касания (по умолчанию разрешён, звук выключен)

Код выхода: 0 passed · 1 failed · 2 blocked · 3 not-run.`;

const ALL_CHECKS = ['load', 'screens', 'scenario', 'keyboard', 'voice'];
const DEFAULT_SIZES = ['360x640', '375x740', '1280x720', '1440x900'];

function parseArgs(argv) {
  const o = { file: null, page: null, scenario: null, checks: null, langs: null, sizes: null, voice: null, adapter: null,
    screens: null, kbdScreens: null, kbdSize: '360x640', base: 'http://localhost:5173', out: null, runId: null, hash: [],
    stepTimeout: 120000, readyTimeout: 30000, reduced: false, autoplay: true, name: '', serve: false, flows: null };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const v = () => { const x = argv[++i]; if (x === undefined) throw new Error('Нет значения для ' + a); return x; };
    if (a === '--file') o.file = v().replace(/\.jsx$/, '').replace(/^lessons\//, '');
    else if (a === '--page') o.page = v();
    else if (a === '--scenario') o.scenario = v();
    else if (a === '--checks') o.checks = v().split(',').filter(Boolean);
    else if (a === '--langs') o.langs = v().split(',').filter(Boolean);
    else if (a === '--sizes') o.sizes = v().split(',').filter(Boolean);
    else if (a === '--voice') o.voice = v();
    else if (a === '--adapter') o.adapter = v();
    else if (a === '--screens') o.screens = Number(v());
    else if (a === '--kbd-screens') o.kbdScreens = v().split(',').map(Number).filter(Boolean);
    else if (a === '--kbd-size') o.kbdSize = v();
    else if (a === '--out') o.out = v();
    else if (a === '--run-id') o.runId = v();
    else if (a === '--hash') o.hash.push(...v().split(',').filter(Boolean));
    else if (a === '--base') o.base = v().replace(/\/$/, '');
    else if (a === '--step-timeout') o.stepTimeout = Number(v());
    else if (a === '--ready-timeout') o.readyTimeout = Number(v());
    else if (a === '--reduced') o.reduced = true;
    else if (a === '--serve') o.serve = true;
    else if (a === '--flows') o.flows = v().split(',').map((x) => x.trim()).filter(Boolean);
    else if (a === '--no-autoplay') o.autoplay = false;
    else if (a === '--name') o.name = v();
    else if (a === '-h' || a === '--help') o.help = true;
    else throw new Error('Неизвестный параметр: ' + a);
  }
  return o;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sizeOf = (s) => { const m = /^(\d+)x(\d+)$/.exec(String(s)); if (!m) throw new Error('Размер в виде 375x740: ' + s); return [Number(m[1]), Number(m[2])]; };

// Исходник функции шага → выражение. Разрешены стрелки, function и метод run(qa) {…}.
function fnSource(fn) {
  let s = fn.toString().trim();
  if (!/^(async\s*)?(\(|function\b|[A-Za-z_$][\w$]*\s*=>)/.test(s)) s = s.replace(/^(async\s+)?([A-Za-z_$][\w$]*)\s*\(/, (m, a) => (a || '') + 'function (');
  return s;
}

// Сценарий не должен создавать успех в обход заданий.
const BYPASS = /\bonFinished\s*\(|\.finish\s*\(|\bstore\.set\s*\(|postMessage\s*\(|__lessonRoot|setSolved|forceDone/;

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.help || (!o.file && !o.page && !o.scenario)) { console.log(HELP); process.exit(o.help ? 0 : EXIT['not-run']); }

  // ── Сценарий
  let scenario = null, scenarioInfo = null, scenarioProblem = null;
  if (o.scenario) {
    const abs = resolve(process.cwd(), o.scenario);
    if (!existsSync(abs)) scenarioProblem = 'Файл сценария не найден: ' + o.scenario;
    else {
      const text = readFileSync(abs, 'utf8');
      scenarioInfo = { path: rel(abs), sha256: fileHash(abs).sha256 };
      if (BYPASS.test(text)) scenarioProblem = 'Сценарий содержит обход заданий (прямое завершение, запись в store или postMessage) — такой прогон не доказывает прохождение';
      else {
        try {
          scenario = (await import(pathToFileURL(abs).href + '?t=' + Date.now())).default;
          if (!scenario || !Array.isArray(scenario.steps)) throw new Error('нужен export default { steps: [...] }');
          scenarioInfo.title = scenario.title || '';
        } catch (e) { scenarioProblem = 'Сценарий не загрузился: ' + e.message; scenario = null; }
      }
    }
  }
  const S = scenario || {};
  const file = o.file || S.file || null;
  const page = o.page || S.page || null;
  const langs = o.langs || S.langs || ['ru'];
  const sizes = o.sizes || DEFAULT_SIZES;
  const scenarioSize = S.size || (o.sizes && o.sizes[0]) || '375x740';
  const voice = o.voice || S.voice || 'fast';
  let adapter = o.adapter || S.adapter || 'auto';
  const checks = o.checks || ALL_CHECKS;
  const kbdScreens = o.kbdScreens || S.inputScreens || [];
  const label = file ? basename(file) : 'page';
  const outDir = resolve(ROOT, o.out || (o.runId ? `work/lesson-team/${o.runId}/qa/${label}` : `work/lesson-team/qa-${stamp()}-${label}`));
  if (outDir === WORK || outDir.startsWith(WORK + '/')) ensureWork();
  mkdirSync(join(outDir, 'shots'), { recursive: true });
  const eventsFile = join(outDir, 'events.jsonl');
  writeFileSync(eventsFile, '');

  // ── Версия: урок, сценарий, дополнительные файлы (или страница самопроверки).
  const versionFiles = [];
  if (file) versionFiles.push(`lessons/${file}.jsx`);
  if (page && page.startsWith('/')) versionFiles.push(page.split('?')[0].replace(/^\//, ''));
  if (scenarioInfo) versionFiles.push(scenarioInfo.path);
  versionFiles.push(...o.hash);
  const vStart = versionOf(versionFiles);

  const report = {
    tool: 'lesson-team-qa', format: 1,
    startedAt: new Date().toISOString(), finishedAt: null,
    target: { file, page, label: file ? `lessons/${file}.jsx` : page },
    options: { adapter, voice, langs, sizes, scenarioSize, checks, kbdScreens, kbdSize: o.kbdSize, base: o.base, reduced: o.reduced, autoplay: o.autoplay, serve: o.serve, flows: o.flows },
    scenario: scenarioInfo,
    versions: { start: vStart, end: null, changed: false },
    environment: { node: process.version, base: o.base, chrome: null },
    overall: null, checks: [], notes: [],
  };
  const add = (c) => { report.checks.push(c); return c; };
  const finish = () => {
    const vEnd = versionOf(versionFiles);
    report.versions.end = vEnd;
    report.versions.changed = vEnd.version !== vStart.version;
    if (report.versions.changed) {
      add(check('version', { title: 'Версия файлов', status: 'blocked', condition: 'файлы урока не меняются во время прогона',
        reason: `версия изменилась: ${vStart.version} → ${vEnd.version}; результаты недействительны, повторить на зафиксированной версии` }));
    } else {
      add(check('version', { title: 'Версия файлов', status: 'passed', condition: 'файлы урока не менялись во время прогона', evidence: [vStart.version] }));
    }
    report.finishedAt = new Date().toISOString();
    report.overall = overall(report.checks);
    writeReport(outDir, report);
    console.log(`QA: ${report.overall} — ${rel(join(outDir, 'report.md'))}`);
    for (const c of report.checks) console.log(`  ${c.status.padEnd(8)} ${c.title || c.id}${c.lang ? ' · ' + c.lang : ''}${c.size ? ' · ' + c.size : ''}${c.flow ? ' · ' + c.flow : ''}${c.status !== 'passed' && c.reason ? ' — ' + c.reason : ''}`);
    process.exit(EXIT[report.overall]);
  };
  const blockAll = (reason) => {
    for (const id of checks) add(check(id, { title: id, status: 'blocked', reason }));
    finish();
  };

  if (!file && !page) { add(check('target', { title: 'Цель проверки', status: 'blocked', reason: 'не указан --file или --page (и в сценарии нет file)' })); finish(); }
  if (file && !existsSync(resolve(ROOT, `lessons/${file}.jsx`))) report.notes.push(`Файла lessons/${file}.jsx нет — плеер сообщит «Файл урока не найден»`);

  // ── Свой dev-сервер (--serve): рабочая копия этого раннера, свободный порт, без HMR.
  // Процесс сервера живёт, пока идёт прогон, и завершается вместе с ним.
  if (o.serve) {
    try {
      const { createServer } = await import(pathToFileURL(join(ROOT, 'node_modules/vite/dist/node/index.js')).href);
      const srv = await createServer({ root: ROOT, configFile: join(ROOT, 'vite.config.js'), logLevel: 'error', clearScreen: false,
        server: { port: 0, strictPort: false, hmr: false, open: false } });
      await srv.listen();
      const url = (srv.resolvedUrls && srv.resolvedUrls.local && srv.resolvedUrls.local[0]) || `http://localhost:${srv.httpServer.address().port}/`;
      o.base = url.replace(/\/$/, '');
      report.options.base = o.base;
      report.environment.base = o.base;
      report.notes.push(`свой dev-сервер ${o.base} (рабочая копия ${ROOT}, без HMR)`);
    } catch (e) {
      return blockAll('свой dev-сервер не запустился: ' + e.message);
    }
  }

  // ── Окружение: dev-сервер и Chrome.
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 5000);
    const r = await fetch(o.base + '/tools/qa/lesson-team/harness.html', { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error('HTTP ' + r.status);
  } catch (e) {
    return blockAll(`dev-сервер ${o.base} недоступен (${e.message}); запусти npm run dev`);
  }
  let chrome;
  try { chrome = await launchChrome({ autoplay: o.autoplay }); } catch (e) { return blockAll('браузер недоступен: ' + e.message); }
  report.environment.chrome = chrome.version;
  const pg = await openPage(chrome.port);
  const errors = [];
  const warnings = [];
  pg.on('Runtime.exceptionThrown', (p) => {
    const d = p.exceptionDetails || {};
    errors.push({ t: Date.now(), kind: 'exception', text: String((d.exception && d.exception.description) || d.text || '').slice(0, 800) });
  });
  pg.on('Runtime.consoleAPICalled', (p) => {
    if (p.type !== 'error' && p.type !== 'assert') return;
    const text = (p.args || []).map((a) => (a.value !== undefined ? a.value : a.description || '')).join(' ').slice(0, 800);
    if (/^\[vite\]/.test(text)) { warnings.push('окружение: ' + text); return; }
    if (/^Warning:/.test(text)) { warnings.push('React: ' + text.slice(0, 300)); return; }
    errors.push({ t: Date.now(), kind: 'console.error', text });
  });
  await pg.send('Runtime.enable');
  await pg.send('Page.enable');
  if (o.reduced) await pg.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

  const lessonUrl = ({ lang, start }) => {
    const extra = `lang=${encodeURIComponent(lang)}&voice=${encodeURIComponent(voice)}` + (o.name ? `&name=${encodeURIComponent(o.name)}` : '')
      + (start !== null && start !== undefined ? `&start=${start}` : '');
    if (file) return `/player.html?file=${encodeURIComponent(file)}&${extra}`;
    return page + (page.includes('?') ? '&' : '?') + extra;
  };
  const saveShot = async (name) => {
    const safe = String(name).replace(/[^\w.-]+/g, '_');
    const path = join(outDir, 'shots', safe + '.png');
    try { writeFileSync(path, Buffer.from(await pg.screenshot(), 'base64')); return rel(path); } catch (e) { return null; }
  };
  const dumpEvents = async (ctx) => {
    let list = [];
    try { list = JSON.parse(await pg.evaluate('JSON.stringify(window.__ltqa ? window.__ltqa.state.events : [])', 10000)); } catch { /* no-op */ }
    for (const e of list) appendFileSync(eventsFile, JSON.stringify(Object.assign({}, ctx, e)) + '\n');
    return list;
  };
  const errorsSince = (t0) => errors.filter((e) => e.t >= t0);

  async function installAdapter(name) {
    return pg.evaluate(`import('/tools/qa/lesson-team/adapters/${name}.js?t=${Date.now()}').then((m) => m.install(window.__ltqa)).then((r) => r.name)`, 20000);
  }

  // Открыть урок в обвязке; ready=false — не отрисовался за отведённое время.
  async function open({ lang, size, start = null }) {
    const [w, h] = sizeOf(size);
    await pg.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
    const url = `${o.base}/tools/qa/lesson-team/harness.html?lang=${encodeURIComponent(lang)}&src=${encodeURIComponent(lessonUrl({ lang, start }))}`;
    const t0 = Date.now();
    const loaded = pg.once('Page.loadEventFired', 30000);
    await pg.send('Page.navigate', { url });
    await loaded;
    await pg.evaluate('new Promise((r) => { const t = setInterval(() => { if (window.__ltqa) { clearInterval(t); r(true); } }, 50); })', 10000);
    let name = adapter === 'auto' ? 'basic' : adapter;
    await installAdapter(name);
    const waitReady = (ms) => pg.evaluate(`(async () => { const qa = window.__ltqa; const t0 = Date.now();
      while (Date.now() - t0 < ${ms}) { try { if (qa.platform.isReady()) return true; } catch (e) {} if (qa.events('error').length) return false; await qa.sleep(200); }
      return false; })()`, ms + 5000);
    let ready = await waitReady(o.readyTimeout);
    if (ready && adapter === 'auto') {
      const canon = await pg.evaluate('!!(window.__ltqa.q(".stage") || window.__ltqa.q(".stage-content"))', 5000).catch(() => false);
      if (canon) { name = 'canon-html'; await installAdapter(name); ready = await waitReady(o.readyTimeout); }
      adapter = name;
      report.options.adapter = 'auto → ' + name;
    }
    const bridgeErrors = await pg.evaluate('JSON.stringify(window.__ltqa.events("error").map((e) => e.data))', 5000).then(JSON.parse).catch(() => []);
    return { ready, t0, ms: Date.now() - t0, adapter: name, bridgeErrors };
  }

  const ctxOf = (x) => ({ check: x.check, lang: x.lang, size: x.size, flow: x.flow || null });
  const ttsByLang = {};
  const collectTts = (lang, events) => { (ttsByLang[lang] = ttsByLang[lang] || []).push(...events.filter((e) => e.type === 'tts').map((e) => e.data)); };
  let detectedTotal = null;

  try {
    // ── load: урок загрузился и отрисовался без ошибок.
    if (checks.includes('load')) {
      for (const lang of langs) {
        const size = scenarioSize;
        let r;
        try { r = await open({ lang, size }); } catch (e) {
          add(check('load', { title: 'Загрузка урока', lang, size, status: 'blocked', reason: 'обвязка не открылась: ' + e.message }));
          continue;
        }
        const errs = errorsSince(r.t0);
        const shot = await saveShot(`load-${lang}-${size}`);
        const ev = await dumpEvents({ check: 'load', lang, size });
        collectTts(lang, ev);
        if (r.ready && detectedTotal === null) {
          detectedTotal = await pg.evaluate('(window.__ltqa.platform.total && window.__ltqa.platform.total()) || null', 5000).catch(() => null);
        }
        const repro = `node tools/qa/lesson-team/run.mjs ${file ? '--file ' + file : '--page "' + page + '"'} --checks load --langs ${lang}`;
        if (!r.ready || r.bridgeErrors.length || errs.length) {
          add(check('load', { title: 'Загрузка урока', lang, size, status: 'failed', condition: 'урок отрисован, ошибок нет',
            reason: r.bridgeErrors.length ? 'плеер: ' + r.bridgeErrors.map((x) => x && x.message).join('; ')
              : errs.length ? errs.map((x) => x.kind + ': ' + x.text).join(' | ') : `урок не отрисовался за ${Math.round(o.readyTimeout / 1000)} с`,
            evidence: [shot].filter(Boolean), repro }));
        } else {
          add(check('load', { title: 'Загрузка урока', lang, size, status: 'passed', condition: 'урок отрисован, ошибок нет',
            evidence: [`отрисован за ${r.ms} мс`, `адаптер ${r.adapter}`, detectedTotal ? `экранов: ${detectedTotal}` : null, shot].filter(Boolean) }));
        }
      }
    }

    // ── screens: каждый экран × размер × язык через tools/layout-sweep.js (начальные состояния).
    if (checks.includes('screens')) {
      const screens = o.screens || S.screens || detectedTotal;
      if (!file) add(check('screens', { title: 'Экраны и раскладка', status: 'not-run', reason: 'проверка экранов работает только с файлом урока (--file)' }));
      else if (!screens) add(check('screens', { title: 'Экраны и раскладка', status: 'not-run', reason: 'неизвестно число экранов: укажи --screens или screens в сценарии' }));
      else {
        const r = await open({ lang: langs[0], size: '1500x1000' }).catch((e) => ({ error: e }));
        const can = !r.error && await pg.evaluate('!!(window.__ltqa.platform && window.__ltqa.platform.supportsLayoutSweep)', 5000).catch(() => false);
        if (!can) add(check('screens', { title: 'Экраны и раскладка', status: 'not-run', reason: `адаптер ${adapter} не поддерживает прогон экранов (tools/layout-sweep.js рассчитан на каркас канона HTML)` }));
        else {
          const sz = sizes.map(sizeOf);
          const opts = { lessons: [{ file, screens }], langs, sizes: sz, wait: 900, slack: true };
          await pg.evaluate(`window.__ltqa.platform.layoutStart(${JSON.stringify(opts)})`, 30000);
          const runs = screens * sz.length * langs.length;
          const limit = Date.now() + runs * 6000 + 60000;
          let res = null;
          while (Date.now() < limit) {
            await sleep(3000);
            res = await pg.evaluate('JSON.stringify(window.__ltqa.platform.layoutResult())', 10000).then(JSON.parse).catch(() => null);
            if (res && res.done) break;
          }
          if (!res || !res.done) add(check('screens', { title: 'Экраны и раскладка', status: 'blocked', reason: 'прогон tools/layout-sweep.js не закончился за отведённое время' }));
          else {
            writeFileSync(join(outDir, 'screens.json'), JSON.stringify(res, null, 2));
            for (const lang of langs) {
              for (const [w, h] of sz) {
                const size = `${w}x${h}`;
                const rows = res.rows.filter((x) => x.lang === lang && x.size === `${w}×${h}`);
                const bad = rows.filter((x) => !x.stage || x.over > 0 || x.hscroll > 0 || (x.errors && x.errors.length));
                const repro = `node tools/qa/lesson-team/run.mjs --file ${file} --checks screens --langs ${lang} --sizes ${size} --screens ${screens}`;
                if (bad.length) {
                  add(check('screens', { title: 'Экраны и раскладка', lang, size, status: 'failed', condition: 'каждый экран отрисован, без переполнения, горизонтальной прокрутки и ошибок',
                    reason: bad.map((x) => `экран ${x.screen}: ${!x.stage ? 'не отрисован' : x.errors && x.errors.length ? 'ошибка ' + x.errors[0] : x.over > 0 ? 'переполнение ' + x.over + ' px' : 'горизонтальная прокрутка ' + x.hscroll + ' px'}`).join('; '),
                    evidence: [rel(join(outDir, 'screens.json'))], repro }));
                } else {
                  const low = rows.filter((x) => typeof x.slack === 'number' && x.slack < 60).map((x) => x.screen);
                  add(check('screens', { title: 'Экраны и раскладка', lang, size, status: 'passed', condition: 'каждый экран отрисован, без переполнения, горизонтальной прокрутки и ошибок',
                    evidence: [`экраны 1–${screens}: проблем нет`, low.length && size === '360x640' ? `запас высоты меньше 60 px: экраны ${low.join(', ')}` : null, rel(join(outDir, 'screens.json'))].filter(Boolean) }));
                }
              }
            }
          }
        }
      }
    }

    // ── scenario: действия конкретного урока (основной проход и отдельные ветки).
    if (checks.includes('scenario')) {
      if (scenarioProblem) add(check('scenario', { title: 'Сценарий урока', status: 'blocked', reason: scenarioProblem }));
      else if (!scenario) add(check('scenario', { title: 'Сценарий урока', status: 'not-run', reason: 'нет сценария действий: универсальные нажатия не доказывают прохождение (--scenario)' }));
      else {
        const flows = [{ name: 'main', start: S.start ?? null, steps: S.steps, expectFinish: S.expectFinish === true }].concat(S.flows || []);
        for (const lang of langs) {
          for (let fi = 0; fi < flows.length; fi += 1) {
            const flow = flows[fi];
            if (flow.langs && !flow.langs.includes(lang)) continue;
            const tag = fi === 0 ? 'main' : 'f' + fi;   // латиницей: для имён файлов
            if (o.flows && !o.flows.some((f) => f === tag || (flow.name && flow.name.includes(f)))) continue;
            const ctx = { check: 'scenario', lang, size: scenarioSize, flow: flow.name };
            const title = flow.name === 'main' ? 'Сценарий: основной проход' : 'Сценарий: ' + flow.name;
            const repro = `node tools/qa/lesson-team/run.mjs ${file ? '--file ' + file : '--page "' + page + '"'} --scenario ${scenarioInfo.path} --checks scenario --langs ${lang}`;
            let r;
            try { r = await open({ lang, size: scenarioSize, start: flow.start ?? null }); } catch (e) {
              add(check('scenario', Object.assign({ title, status: 'blocked', reason: 'обвязка не открылась: ' + e.message }, ctx))); continue;
            }
            if (!r.ready) {
              const shot = await saveShot(`fail-${lang}-${tag}-load`);
              add(check('scenario', Object.assign({ title, status: 'failed', condition: 'урок открылся', reason: 'урок не отрисовался', evidence: [shot].filter(Boolean), repro }, ctx)));
              await dumpEvents(ctx);
              continue;
            }
            const data = Object.assign({}, S.data ? (S.data[lang] || S.data.default || {}) : {},
              flow.data ? (flow.data[lang] || flow.data.default || {}) : {});
            const steps = [];
            let stopped = null;
            for (let i = 0; i < flow.steps.length; i += 1) {
              const st = flow.steps[i];
              const name = st.name || `шаг ${i + 1}`;
              if (stopped) { steps.push({ name, status: 'not-run', notes: [], shots: [] }); continue; }
              if (typeof st.run !== 'function') { steps.push({ name, status: 'failed', error: 'у шага нет функции run(qa)', notes: [], shots: [] }); stopped = name; continue; }
              const expr = `(async () => { const qa = window.__ltqa; qa.notes = []; qa.shots = []; qa.data = ${JSON.stringify(data)}; qa.lang = ${JSON.stringify(lang)};
                try { await (${fnSource(st.run)})(qa); return { ok: true, notes: qa.notes, shots: qa.shots }; }
                catch (e) { return { ok: false, error: String((e && e.message) || e), expectation: !!(e && e.expectation), details: (e && e.details) || null, notes: qa.notes, shots: qa.shots }; } })()`;
              const t0 = Date.now();
              let res;
              try { res = await pg.evaluate(expr, st.timeout || o.stepTimeout); } catch (e) {
                res = { ok: false, timeout: !!e.timeout, error: e.timeout ? `тайм-аут шага (${Math.round((st.timeout || o.stepTimeout) / 1000)} с)` : e.message, notes: [], shots: [] };
              }
              const shots = [];
              for (const sname of (res.shots || []).concat(st.shot ? [st.shot] : [])) {
                const p = await saveShot(`${lang}-${tag}-${sname}`);
                if (p) shots.push(p);
              }
              if (!res.ok) {
                const p = await saveShot(`fail-${lang}-${tag}-${i + 1}`);
                if (p) shots.push(p);
              }
              steps.push({ name, status: res.ok ? 'passed' : res.timeout ? 'blocked' : 'failed', ms: Date.now() - t0, error: res.error || null,
                details: res.details || null, notes: res.notes || [], shots });
              if (!res.ok) stopped = name;
            }
            const ev = await dumpEvents(ctx);
            collectTts(lang, ev);
            const errs = errorsSince(r.t0);
            const bridgeErr = ev.filter((e) => e.type === 'error').map((e) => e.data && e.data.message);
            const fin = ev.filter((e) => e.type === 'finished');
            let payloadPath = null;
            if (fin.length) {
              payloadPath = join(outDir, `payload-${lang}-${tag}.json`);
              writeFileSync(payloadPath, JSON.stringify(fin.map((f) => f.data), null, 2));
            }
            const failedStep = steps.find((s) => s.status === 'failed');
            const blockedStep = steps.find((s) => s.status === 'blocked');
            const evidence = steps.flatMap((s) => [`${s.status === 'passed' ? '✓' : s.status === 'not-run' ? '·' : '✗'} ${s.name}${s.status === 'not-run' ? ' (не выполнялся)' : ''}`].concat((s.notes || []).slice(0, 14).map((n) => '  ' + n), s.shots || []));
            let status = 'passed', reason = null;
            if (failedStep) { status = 'failed'; reason = `${failedStep.name}: ${failedStep.error}` + (failedStep.details ? ' · ' + JSON.stringify(failedStep.details).slice(0, 300) : ''); }
            else if (blockedStep) { status = 'blocked'; reason = `${blockedStep.name}: ${blockedStep.error}`; }
            if (status !== 'failed' && (errs.length || bridgeErr.length)) {
              status = 'failed';
              reason = 'ошибки во время прохода: ' + errs.map((x) => x.kind + ': ' + x.text).concat(bridgeErr.map((m) => 'плеер: ' + m)).join(' | ');
            }
            add(check('scenario', Object.assign({ title, status, condition: `все шаги (${flow.steps.length}) выполнены, ошибок нет`, reason, evidence, repro, details: { steps } }, ctx)));
            // Контракт завершения: ровно один onFinished там, где проход доходит до конца.
            if (flow.expectFinish || fin.length > 1) {
              const ok = fin.length === 1 && (!flow.expectFinish || status !== 'failed');
              add(check('finish', Object.assign({ title: 'Завершение (onFinished)', condition: flow.expectFinish ? 'onFinished вызван ровно один раз' : 'onFinished не вызывается больше одного раза',
                status: fin.length > 1 ? 'failed' : fin.length === 1 ? 'passed' : (stopped ? 'not-run' : 'failed'),
                reason: fin.length > 1 ? `onFinished вызван ${fin.length} раз` : fin.length === 0 ? (stopped ? 'проход остановлен раньше завершения' : 'onFinished не вызван') : null,
                evidence: [payloadPath ? rel(payloadPath) : null, ok && fin[0] && fin[0].data && fin[0].data.payload ? `lessonId: ${fin[0].data.payload.lessonId}` : null].filter(Boolean), repro }, ctx)));
            }
          }
        }
      }
    }

    // ── keyboard: ЭМУЛЯЦИЯ открытой клавиатуры на экранах с вводом.
    if (checks.includes('keyboard')) {
      if (!kbdScreens.length) add(check('keyboard', { title: 'Клавиатура (эмуляция)', status: 'not-run', reason: 'не указаны экраны с вводом (--kbd-screens или inputScreens в сценарии)' }));
      else {
        for (const lang of langs) {
          for (const n of kbdScreens) {
            const size = o.kbdSize;
            let r;
            try { r = await open({ lang, size, start: n - 1 }); } catch (e) {
              add(check('keyboard', { title: 'Клавиатура (эмуляция)', lang, size, status: 'blocked', reason: `экран ${n}: обвязка не открылась` })); continue;
            }
            if (!r.ready) { add(check('keyboard', { title: 'Клавиатура (эмуляция)', lang, size, status: 'failed', reason: `экран ${n}: урок не отрисовался` })); continue; }
            const fit = await pg.evaluate(`(async () => { const p = window.__ltqa.platform; if (p.ready) await p.ready(20000);
              if (!p.kbd) return null; const f = await p.kbd(true, 330); return f; })()`, 40000).catch((e) => ({ error: e.message }));
            const shot = await saveShot(`kbd-${lang}-s${n}`);
            await pg.evaluate('window.__ltqa.platform.kbd && window.__ltqa.platform.kbd(false)', 10000).catch(() => {});
            await dumpEvents({ check: 'keyboard', lang, size, flow: 's' + n });
            if (!fit) add(check('keyboard', { title: 'Клавиатура (эмуляция)', lang, size, status: 'not-run', reason: `адаптер ${adapter} не умеет эмулировать клавиатуру` }));
            else if (fit.error) add(check('keyboard', { title: 'Клавиатура (эмуляция)', lang, size, status: 'blocked', reason: `экран ${n}: ${fit.error}` }));
            else {
              const bad = fit.over > 0 || fit.hscroll > 0 || (fit.out && fit.out.length);
              add(check('keyboard', { title: `Клавиатура (эмуляция), экран ${n}`, lang, size, status: bad ? 'failed' : 'passed',
                condition: 'при видимой высоте 330 px нет переполнения и элементов за краем (начальное состояние экрана)',
                reason: bad ? `переполнение ${fit.over} px, гориз. прокрутка ${fit.hscroll} px, за краем: ${(fit.out || []).join(', ')}` : null,
                evidence: [JSON.stringify(fit), shot].filter(Boolean),
                repro: `node tools/qa/lesson-team/run.mjs --file ${file} --checks keyboard --kbd-screens ${n} --langs ${lang}` }));
            }
          }
        }
      }
    }

    // ── voice: у реплик сервиса озвучки есть маркер языка урока.
    if (checks.includes('voice')) {
      const expects = await pg.evaluate('!!(window.__ltqa && window.__ltqa.platform && window.__ltqa.platform.expectsServiceVoice)', 5000).catch(() => false);
      for (const lang of langs) {
        const list = ttsByLang[lang] || [];
        if (!['fast', 'simulate'].includes(voice)) add(check('voice', { title: 'Озвучка: маркер языка', lang, status: 'not-run', reason: `режим голоса ${voice}: сервис озвучки не используется` }));
        else if (!expects) add(check('voice', { title: 'Озвучка: маркер языка', lang, status: 'not-run', reason: `адаптер ${adapter} не ждёт озвучки по ttsApiBase` }));
        else if (!list.length) add(check('voice', { title: 'Озвучка: маркер языка', lang, status: 'not-run', reason: 'за время прогона реплики не запрашивались у сервиса озвучки' }));
        else {
          const bad = list.filter((x) => !x.marker || x.lang !== lang);
          add(check('voice', { title: 'Озвучка: маркер языка', lang, status: bad.length ? 'failed' : 'passed',
            condition: 'каждая реплика начинается с маркера языка урока',
            reason: bad.length ? `${bad.length} из ${list.length} без маркера или с чужим: «${String(bad[0].text).slice(0, 80)}»` : null,
            evidence: [`реплик: ${list.length}`, `пример: «${String(list[0].text).slice(0, 90)}»`] }));
        }
      }
    }
  } catch (e) {
    add(check('runner', { title: 'Работа раннера', status: 'blocked', reason: 'сбой прогона: ' + e.message }));
  } finally {
    if (warnings.length) report.notes.push(...[...new Set(warnings)].slice(0, 20));
    try { pg.close(); } catch { /* no-op */ }
    chrome.close();
  }
  finish();
}

main().catch((e) => { console.error('QA-раннер:', e.message); process.exit(EXIT.blocked); });
