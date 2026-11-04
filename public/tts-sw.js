// Сервис озвучки просмотрщика в СОБРАННОЙ версии (Vercel, npm run build) — service worker.
// Делает в браузере то же, что на localhost делает tools/vite-tts-service.mjs (сервер разработки):
//   GET  {ttsApiBase}/api/tts?text=<маркер языка + реплика>&g=…
//     browser  — «сервис недоступен» (503): урок сам переходит на голос браузера;
//     simulate — тишина длиной в реплику;  fast — та же тишина, вшестеро короче;
//   HEAD — прогрев: пустой ответ.
// Текст каждой реплики отдаётся плееру (postMessage) — так она попадает в журнал просмотрщика.
// Ловит только адреса /__tts/<сеанс>/<режим>/api/tts; всё остальное идёт в сеть как обычно.
// Уроки (.jsx) не меняются: они, как на платформе, просто шлют запрос на ttsApiBase.

const ROUTE = /\/__tts\/([\w-]+)\/(simulate|fast|browser)\/api\/tts$/;

// Та же оценка длины, что у эмуляции (src/runtime/speech.js, tools/vite-tts-service.mjs).
const estimateMs = (s) => Math.max(900, Math.min(20000, String(s || '').length * 62));

// WAV: 8 кГц, моно, 8 бит, тишина (значение 128).
function silentWav(ms) {
  const n = Math.round(8 * ms);
  const b = new Uint8Array(44 + n).fill(128);
  const v = new DataView(b.buffer);
  const str = (o, s) => { for (let i = 0; i < s.length; i += 1) b[o + i] = s.charCodeAt(i); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVE');
  str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  str(36, 'data'); v.setUint32(40, n, true);
  return b;
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

async function notify(data) {
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  all.forEach((c) => c.postMessage({ type: 'darsliklar:tts', data }));
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  const m = ROUTE.exec(url.pathname);
  if (!m) return;
  const [, sid, mode] = m;
  const q = url.searchParams;
  const text = q.get('text') || '';
  const spoken = text.replace(/^\s*\[[^\]]*\]\s*/, '');
  const head = e.request.method === 'HEAD';

  // Звук отдаётся и целиком, и кусками (Range), как настоящим сервером: Safari без этого
  // аудио не играет. Проба «bytes=0-1», дочитка хвоста, повторы (&r=2) и прогрев (HEAD)
  // в журнал не идут — одна строка на реплику.
  const range = /^bytes=(\d*)-(\d*)$/.exec(String(e.request.headers.get('range') || '').trim());
  const from = range && range[1] !== '' ? Number(range[1]) : 0;
  const probe = !!range && range[2] !== '' && Number(range[2]) - from < 16;
  if (!head && !q.get('r') && from === 0 && !probe) e.waitUntil(notify({ sid, mode, text, g: q.get('g') || null }));

  if (mode === 'browser') {
    e.respondWith(new Response('Сервис озвучки в режиме «Браузер» недоступен — урок переходит на голос браузера.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
    return;
  }
  const ms = mode === 'fast' ? Math.max(350, estimateMs(spoken) / 6) : estimateMs(spoken);
  const wav = silentWav(ms);
  const total = wav.length;
  const base = { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
  if (range) {
    const end = Math.min(total - 1, range[2] !== '' ? Number(range[2]) : total - 1);
    if (from > end) { e.respondWith(new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } })); return; }
    e.respondWith(new Response(head ? null : wav.slice(from, end + 1), { status: 206,
      headers: Object.assign({}, base, { 'Content-Range': `bytes ${from}-${end}/${total}`, 'Content-Length': String(end - from + 1) }) }));
    return;
  }
  e.respondWith(new Response(head ? null : wav, { status: 200, headers: Object.assign({}, base, { 'Content-Length': String(total) }) }));
});
