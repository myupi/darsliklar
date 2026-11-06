// ТЕСТОВЫЕ копии уроков 1 и 2 курса HTML под два новых режима платформы (заказчик, 04.11.2026):
//   · «Подготовленная озвучка JSX» (JSX_AUDIO_WORKFLOW_RU.md): реплики объявлены заранее в
//     export const LESSON_AUDIO, урок говорит только через useAudio из '@lesson/runtime' — без
//     fetch, Audio и speechSynthesis;
//   · «Контракт завершения v1» (jsx_finished_author_guide_ru.md): await onFinished({ contractVersion: 1,
//     passed, results, analytics, meta }), на время сохранения — «Saqlanmoqda…», при сбое — повтор.
// Только узбекский (выбор заказчика: лимит 300 реплик на урок на все языки). Тексты и экраны — те же:
// копия собирается из готового урока lessons/html/<NN>-<slug>.jsx, сам урок не меняется.
//   node tools/managed-test/build.mjs   → lessons/test/30-urok1-yangi-ovoz.jsx, 31-urok2-yangi-ovoz.jsx
// Voice ID — из примера платформы (managed-audio.lesson.jsx), заглушка: в студии поставить нужный мужской.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSync } from 'esbuild';
import { V1, fixLifecycle } from './v1-fix.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const VOICE_ID = 'cgSgspJ2msm6clMCkdW9';   // ЗАГЛУШКА из примера платформы — заменить в студии
const LANG = 'uz';
const JOBS = [
  { src: 'lessons/html/01-struktura-dokumenta.jsx', out: 'lessons/test/30-urok1-yangi-ovoz.jsx', id: 'test-html-01-yangi-ovoz', n: 1,
    title: "1-dars. HTML hujjatining tuzilishi (sinov: yangi ovoz)" },
  { src: 'lessons/html/02-zagolovki-i-tekst.jsx', out: 'lessons/test/31-urok2-yangi-ovoz.jsx', id: 'test-html-02-yangi-ovoz', n: 2,
    title: "2-dars. Sarlavhalar va matn (sinov: yangi ovoz)" }
];

const must = (s, find, repl, what) => {
  if (s.indexOf(find) < 0) throw new Error('Не нашёл место: ' + what);
  return s.split(find).join(repl);
};
const cut = (s, from, to, repl, what) => {
  const a = s.indexOf(from);
  const b = s.indexOf(to, a + 1);
  if (a < 0 || b < 0) throw new Error('Не нашёл участок: ' + what);
  return s.slice(0, a) + repl + s.slice(b);
};

// 1. Реплики урока: всё, что герой произносит (heroLines по данным экранов), фразы разбора, похвала и
//    подбадривание канона. Текст — ровно тот, что ушёл бы в сервис озвучки: markLang(sanitizeForTts(spokenHtml(s))).
async function collect(src, extra) {
  globalThis.__EXTRA = extra || [];
  const tmp = join(here, '.tmp');
  mkdirSync(tmp, { recursive: true });
  const probe = src + `
export const __collect = (L) => {
  const out = new Set();
  const add = (s) => { if (typeof s === 'string' && s.trim() && s.indexOf('{') < 0) out.add(s); };
  const all = (node) => { if (!node || typeof node !== 'object') return; if (typeof node[L] === 'string') { add(node[L]); return; } Object.values(node).forEach(all); };
  Object.keys(C).forEach((k) => heroLines(C[k], L).forEach(add));
  if (typeof WRAP_MSGS !== 'undefined') all(WRAP_MSGS);
  if (typeof FB !== 'undefined') all(FB);
  PRAISE[L].forEach(add); ENCOURAGE[L].forEach(add);
  const rows = [];
  // Реплики с подстановкой готовых слов урока (не слов ученика), найденные прогоном: уже «чистый» текст.
  (globalThis.__EXTRA || []).forEach((clean) => { if (!rows.some((r) => r.clean === clean)) rows.push({ clean, text: markLang(clean, L) }); });
  const seen = new Set();
  [...out].forEach((s) => {
    const clean = sanitizeForTts(spokenHtml(s, L), L);
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    rows.push({ clean, text: markLang(clean, L) });
  });
  return rows;
};`;
  const file = join(tmp, 'probe.jsx');
  writeFileSync(file, probe);
  const outFile = join(tmp, 'probe.mjs');
  buildSync({ entryPoints: [file], bundle: true, format: 'esm', platform: 'node', outfile: outFile, jsx: 'transform',
    external: ['react', 'react-dom'], alias: { '@lesson/runtime': join(root, 'src/runtime/index.js') }, logLevel: 'error',
    nodePaths: [join(root, 'node_modules')] });
  globalThis.window = undefined;
  const mod = await import(pathToFileURL(outFile).href + '?t=' + Date.now());
  const rows = mod.__collect(LANG);
  rmSync(tmp, { recursive: true, force: true });
  return rows;
}

// 2. Движок озвучки на новом SDK. Тот же набор, что у useAudioEngine канона
//    ({ speak, stop, abort, unlock, toggle, toggleMute, replay, warm, paused, replayNonce, on, muted, gestured,
//    playing, failed }), — остальной урок не меняется. speak(text) находит реплику по тексту (склеенную
//    похвалу и разбор — по кускам), ставит очередь [{ speechId }] в useAudio и ждёт конца (isPlaying).
//    Реплики нет в объявлении (подстановка слов ученика) — тишина по времени, текст остаётся на экране.
const ENGINE = String.raw`
// ── ОЗВУЧКА: ПОДГОТОВЛЕННЫЕ ЗАПИСИ ПЛАТФОРМЫ (тестовая копия, 04.11.2026) ─────────────────────
// Урок не обращается к сервису и не говорит голосом браузера: реплики объявлены в LESSON_AUDIO
// (внизу файла), звук даёт платформа через useAudio из '@lesson/runtime'. Движок отдаёт тот же
// набор, что прежний useAudioEngine, поэтому экраны урока не менялись.
const AudioCtx = createContext(null);
const useAudio = () => useContext(AudioCtx);
const AudioProvider = AudioCtx.Provider;
let _speechSeq = 0;
function speechIdsOf(clean) {
  const exact = SPEECH_BY_CLEAN[clean];
  if (exact) return [exact];
  // Склейка двух реплик (joinL: похвала + разбор, причина + подсказка) — по кускам, слева направо.
  const ids = [];
  let rest = clean;
  while (rest) {
    let best = null;
    SPEECH_CLEANS.forEach((c) => {
      if (rest.indexOf(c) === 0 && (rest.length === c.length || rest.charAt(c.length) === ' ') && (!best || c.length > best.length)) best = c;
    });
    if (!best) return null;
    ids.push(SPEECH_BY_CLEAN[best]);
    rest = rest.slice(best.length).trim();
  }
  return ids.length ? ids : null;
}
function useAudioEngine(ttsApiBase, lang) {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  mutedRef.current = muted;
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [gestured, setGestured] = useState(false);
  const [replayNonce, setReplayNonce] = useState(0);
  const [queue, setQueue] = useState([]);
  const pending = useRef(null);
  const lessonAudio = useLessonAudio(queue);
  const audioRef = useRef(lessonAudio);
  audioRef.current = lessonAudio;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const h = () => setGestured(true);
    window.addEventListener('pointerdown', h, { once: true, capture: true });
    window.addEventListener('keydown', h, { once: true, capture: true });
    return () => { window.removeEventListener('pointerdown', h, { capture: true }); window.removeEventListener('keydown', h, { capture: true }); };
  }, []);

  const settle = useCallback(() => {
    const p = pending.current;
    if (!p) return;
    if (pausedRef.current) { p.timer = setTimeout(settle, 300); return; }
    clearTimeout(p.timer);
    pending.current = null;
    setPlaying(false);
    p.resolve();
  }, []);

  // Конец реплики — когда платформа перестала играть (с запасом: между кусками очереди бывает пауза).
  const isPlaying = !!(lessonAudio && (lessonAudio.isPlaying || lessonAudio.playing));
  useEffect(() => {
    const p = pending.current;
    if (!p) return undefined;
    if (isPlaying) { p.started = true; setPlaying(true); return undefined; }
    if (!p.started) return undefined;
    const t = setTimeout(() => { if (pending.current === p && !(audioRef.current.isPlaying || audioRef.current.playing)) settle(); }, 350);
    return () => clearTimeout(t);
  }, [isPlaying, settle]);

  const speak = useCallback((text) => {
    const clean = sanitizeForTts(text, lang);
    if (!clean) return Promise.resolve();
    if (pending.current) settle();
    const ids = speechIdsOf(clean);
    if (!ids) { try { console.__MISS__('[ovoz] LESSON_AUDIO da yozuv yo\'q: ' + clean); } catch (e) { /* no-op */ } }
    const est = estimateMs(clean);
    return new Promise((resolve) => {
      const p = { resolve, started: false, timer: null, ids };
      pending.current = p;
      // Записи нет, звук выключен или платформа не начала играть — реплика «проживается» по времени.
      p.timer = setTimeout(() => { if (pending.current === p && !p.started) settle(); }, ids && !mutedRef.current ? est + 4000 : est);
      if (ids) { _speechSeq += 1; const n = _speechSeq; setQueue(ids.map((id) => ({ speechId: id, n }))); }
    });
  }, [lang, settle]);

  const stop = useCallback(() => {
    try { if (audioRef.current && audioRef.current.stop) audioRef.current.stop(); } catch (e) { /* no-op */ }
    setQueue([]);
    settle();
  }, [settle]);
  const abort = useCallback(() => {
    try { if (audioRef.current && audioRef.current.stop) audioRef.current.stop(); } catch (e) { /* no-op */ }
    const p = pending.current;
    if (p) clearTimeout(p.timer);
    pending.current = null;
    setQueue([]);
    pausedRef.current = false; setPaused(false); setPlaying(false);
  }, []);
  const toggle = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const p = pending.current;
    if (next) { try { if (audioRef.current && audioRef.current.stop) audioRef.current.stop(); } catch (e) { /* no-op */ } setPlaying(false); if (p) p.started = false; }
    else if (p && p.ids) { _speechSeq += 1; const n = _speechSeq; setQueue(p.ids.map((id) => ({ speechId: id, n }))); }
  }, []);
  const toggleMute = useCallback(() => {
    setMuted((m) => { setSoundOff(!m); return !m; });
    try { if (audioRef.current && audioRef.current.toggleMute) audioRef.current.toggleMute(); } catch (e) { /* no-op */ }
  }, []);
  const replay = useCallback(() => setReplayNonce((n) => n + 1), []);
  const unlock = useCallback(() => { resumeSfx(); }, []);
  const warm = useCallback(() => {}, []);   // записи заранее грузит платформа
  return { speak, stop, abort, unlock, toggle, toggleMute, replay, warm, paused, replayNonce, on: !muted, muted, gestured, playing, failed: false };
}

`;

// 3. Завершение по контракту v1 и его жизненный цикл — tools/managed-test/v1-fix.mjs (V1, fixLifecycle).

for (const job of JOBS) {
  let s = readFileSync(join(root, job.src), 'utf8');
  const extraFile = join(here, 'extra-' + job.n + '.json');
  const extra = existsSync(extraFile) ? JSON.parse(readFileSync(extraFile, 'utf8')) : [];
  const rows = await collect(s, extra);
  if (rows.length > 300) throw new Error(job.out + ': реплик ' + rows.length + ' — больше лимита 300');
  const long = rows.filter((r) => r.text.length > 1000);
  if (long.length) throw new Error(job.out + ': реплики длиннее 1000 знаков: ' + long.length);
  const pad = String(rows.length).length;
  rows.forEach((r, i) => { r.id = 's' + String(i + 1).padStart(Math.max(3, pad), '0'); });

  // Шапка файла — что это за копия.
  s = must(s, "import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useLayoutEffect } from 'react';",
    "// ТЕСТОВАЯ КОПИЯ (04.11.2026): " + job.src + " под «Подготовленную озвучку JSX» и «Контракт завершения v1» платформы.\n" +
    "// Собрана tools/managed-test/build.mjs из готового урока — не править вручную. Только узбекский.\n" +
    "import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext, useLayoutEffect } from 'react';\n" +
    "import { useAudio as useLessonAudio } from '@lesson/runtime';", 'import React');

  // Прежний движок (сервис по ttsApiBase, <audio>, голос браузера) — убран целиком.
  s = cut(s, '// ── РЕЗЕРВНЫЙ ГОЛОС БРАУЗЕРА', '// Реплики экрана для прогрева', ENGINE, 'движок озвучки канона');
  // Адрес прежнего сервиса озвучки (buildTtsUrl) и его описание в шапке — тоже убраны.
  s = cut(s, '// КУРС HTML: адрес — ровно как у эталона математики', '// ── ОЗВУЧКА: ПОДГОТОВЛЕННЫЕ ЗАПИСИ', '', 'адрес сервиса озвучки');
  s = s.replace(/\/\/     GET \{ttsApiBase\}\/api\/tts[^\n]*\n/, '//     (в этой копии не используется: реплики — подготовленные записи платформы, LESSON_AUDIO)\n');
  s = s.replace("let _ttsFirstLogged = false;   // диагностика: первый запрос к сервису — в консоль\n", '');
  // Подмена SpeechSynthesisUtterance (облик «Редактор») — голоса браузера в копии нет.
  s = cut(s, "if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance === 'function' && !window.__b16Utt) {",
    '// ─────────────────────────────────────────────────────────────────────────────\n// ОБЛИК «РЕДАКТОР»', '', 'подмена голоса браузера');
  s = must(s, '// Голос браузера (когда сервиса озвучки нет) пометки в скобках не понимает и прочёл\n// бы их вслух — для него они убираются.\n', '', 'комментарий голоса браузера');

  // Завершение v1.
  s = fixLifecycle(s, 'src');
  s = must(s, "// Реплики экрана для прогрева", V1 + '// Реплики экрана для прогрева', 'место для v1');
  s = must(s, "{!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : null}", "{!R.done ? <Comp key={cur.id + ':' + R.runN} p={p} /> : <V1Status v1={R.v1} />}", 'корень урока');

  // Только узбекский: язык урока — uz при любом пропсе lang; свой lessonId и название.
  s = must(s, '    meta: META, total: SCREENS.length, studentName, lang, ttsApiBase,', "    meta: META, total: SCREENS.length, studentName, lang: '" + LANG + "', ttsApiBase,", 'язык урока');
  s = s.replace(/const META = \{\n  lessonId: '[^']+',/, "const META = {\n  lessonId: '" + job.id + "',");
  s = s.replace(/(const META = \{[\s\S]*?lessonTitle: \{\n    uz: )'[^']*'/, "$1" + JSON.stringify(job.title).replace(/^"|"$/g, "'"));

  // Объявление записей — статический литерал (без вызовов и подстановок) и таблица «текст → id».
  const lit = (x) => JSON.stringify(x);
  const decl = '\n// ── ПОДГОТОВЛЕННАЯ ОЗВУЧКА ─────────────────────────────────────────────────────────────────\n' +
    '// ' + rows.length + ' реплик, язык ' + LANG + '. voiceId — ЗАГЛУШКА из примера платформы: поставить нужный голос в студии.\n' +
    'export const LESSON_AUDIO = {\n  schema: 1,\n  speeches: [\n' +
    rows.map((r) => '    { id: ' + lit(r.id) + ', lang: ' + lit(LANG) + ', voiceId: ' + lit(VOICE_ID) + ', text: ' + lit(r.text) + ', required: true },').join('\n') +
    '\n  ]\n};\n' +
    '// Чистый текст реплики (как его отдаёт урок) → id записи.\n' +
    'const SPEECH_BY_CLEAN = {\n' + rows.map((r) => '  ' + lit(r.clean) + ': ' + lit(r.id) + ',').join('\n') + '\n};\n' +
    'const SPEECH_CLEANS = Object.keys(SPEECH_BY_CLEAN);\n';
  s = s.replace(/\n*$/, '\n') + decl;

  // Отладка покрытия: OVOZ_MISS_ERROR=1 — нехватка записи пишется как console.error (её видит автопроверка).
  s = s.split('console.__MISS__(').join(process.env.OVOZ_MISS_ERROR ? 'console.error(' : 'console.warn(');
  // В копии не должно остаться запрещённого: сервис, <audio>, голос браузера, динамический импорт.
  const bad = s.match(/speechSynthesis|SpeechSynthesis|new Audio\b|[^\w.]fetch\(|\bimport\(|XMLHttpRequest|api\/tts/g);
  if (bad) throw new Error(job.out + ': остались запрещённые вызовы: ' + [...new Set(bad)].join(', '));
  writeFileSync(join(root, job.out), s);
  console.log('Собран ' + job.out + ': ' + rows.length + ' реплик в LESSON_AUDIO.');
}
