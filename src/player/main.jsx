// Плеер одного урока. Открывается просмотрщиком в iframe:
//   /player.html?file=html/01-struktura-dokumenta&lang=uz&name=Ali&voice=browser&start=3
// Урок получает те же пропсы, что и на платформе: { studentName, lang, ttsApiBase, onFinished }.
// ttsApiBase ведёт на эмуляцию сервиса озвучки (tools/vite-tts-service.mjs);
// уроки на @lesson/runtime его просто не читают.
// Если задан start — дополнительно дев-пропсы startAt / startScreen (на проде их нет).

import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary.jsx';
import { reportError } from './report.js';
import { configureRuntime, emit } from '../runtime/bridge.js';
import { parseLine } from '../runtime/speech.js';
import { LESSON_LOADERS, buildCatalog, findByFile, lessonFilePath } from '../shared/catalog.js';

const q = new URLSearchParams(window.location.search);
const file = q.get('file') || '';
const lang = q.get('lang') || 'ru';
const name = q.get('name') || '';
const voice = q.get('voice') || 'browser';
const startRaw = q.get('start');
const start = startRaw !== null && startRaw !== '' && Number.isFinite(Number(startRaw)) ? Number(startRaw) : null;

const found = findByFile(buildCatalog(), file);
configureRuntime({ voice, lang, assets: (found && found.lesson.assets) || {} });

// СЕРВИС ОЗВУЧКИ. Адрес свой у каждого запуска плеера: реплики в журнал
// приходят только этому плееру, даже если открыто несколько уроков.
// «Нет» — сервиса нет и голоса браузера тоже: урок обязан печатать реплики.
// В собранном просмотрщике (npm run build) сервиса нет — урок говорит сам.
const sid = Math.random().toString(36).slice(2, 10);
const ttsApiBase = import.meta.env.DEV && voice !== 'off'
  ? window.location.origin + '/__tts/' + sid + '/' + (voice === 'fast' || voice === 'browser' ? voice : 'simulate')
  : '';
if (voice === 'off') {
  try {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: undefined, configurable: true });
  } catch (e) { /* no-op */ }
}
if (import.meta.hot) {
  import.meta.hot.on('darsliklar:tts', (d) => {
    if (!d || d.sid !== sid) return;
    const line = parseLine(d.text);
    emit('tts', {
      text: d.text, spoken: line.spoken, lang: line.lang, marker: line.marker,
      voice: d.g ? 'g=' + d.g : null, kind: 'service', id: null, muted: false, mode: d.mode,
    });
  });
}

// Модуль может выполниться повторно (горячая перезагрузка, когда файлы уроков
// добавили или удалили) — слушатели и корень React создаём один раз.
if (!window.__lessonPlayerInit) {
  window.__lessonPlayerInit = true;
  window.addEventListener('error', (e) => {
    reportError(e.message || e.error, { stack: String((e.error && e.error.stack) || '') });
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    reportError('Unhandled promise: ' + String((r && r.message) || r), { stack: String((r && r.stack) || '') });
  });
}

let finishedCount = 0;
function onFinished(payload) {
  finishedCount += 1;
  let data = payload;
  try { data = JSON.parse(JSON.stringify(payload === undefined ? null : payload)); } catch (e) { data = String(payload); }
  emit('finished', { payload: data, count: finishedCount });
}

const container = document.getElementById('root');
const root = container.__lessonRoot || (container.__lessonRoot = createRoot(container));

function Message({ title, text }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#475467', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#101828', marginBottom: 6 }}>{title}</div>
        {text ? <div style={{ fontSize: 14 }}>{text}</div> : null}
      </div>
    </div>
  );
}

async function boot() {
  const loader = LESSON_LOADERS[lessonFilePath(file)];
  if (!loader) {
    root.render(<Message title="Файл урока не найден" text={`lessons/${file}.jsx`} />);
    emit('error', { message: `Файл урока не найден: lessons/${file}.jsx` });
    return;
  }
  root.render(<Message title="Загружаю урок…" />);
  const t0 = performance.now();
  let mod;
  try {
    mod = await loader();
  } catch (e) {
    root.render(<Message title="Урок не собрался" text={String(e && e.message)} />);
    emit('error', { message: 'Урок не собрался: ' + String(e && e.message), stack: String((e && e.stack) || '') });
    return;
  }
  const Lesson = mod && mod.default;
  if (typeof Lesson !== 'function') {
    root.render(<Message title="В файле нет export default" text="Урок должен экспортировать корневой компонент по умолчанию." />);
    emit('error', { message: 'В файле урока нет export default-компонента' });
    return;
  }
  const props = { studentName: name, lang, ttsApiBase, onFinished };
  if (start !== null) { props.startAt = start; props.startScreen = start; }
  emit('loaded', { file, ms: Math.round(performance.now() - t0), component: Lesson.name || 'Lesson', props: Object.keys(props) });
  root.render(
    <ErrorBoundary>
      <Lesson {...props} />
    </ErrorBoundary>
  );
}

boot();
