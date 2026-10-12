// Эмуляция сервиса озвучки для уроков, которые говорят сами по адресу
// ttsApiBase (Курс 0, 1-класс, курс HTML). Контракт сервиса тот же, что у
// платформы:
//   GET  {ttsApiBase}/api/tts?text=<маркер языка + реплика>&g=f|m → звук
//   HEAD {ttsApiBase}/api/tts?…   → прогрев: сервис синтезирует фразу заранее
//
// Плеер передаёт уроку ttsApiBase = /__tts/<сеанс>/<режим голоса>:
//   simulate — тишина длиной в реплику;
//   fast     — та же тишина, вшестеро короче;
//   browser  — сервис «недоступен» (503): урок сам переходит на голос браузера.
// Режим «нет» сюда не приходит: плеер не передаёт ttsApiBase вовсе.
//
// Каждый GET сообщается плееру своего сеанса через HMR-канал Vite — так
// реплика с маркером языка попадает в журнал просмотрщика.

const ROUTE = /^\/__tts\/([\w-]+)\/(simulate|fast|browser)\/api\/tts(?:\?|$)/;

// Та же оценка длины, что у эмуляции @lesson/runtime (src/runtime/speech.js).
const estimateMs = (s) => Math.max(900, Math.min(20000, String(s || '').length * 62));

// WAV: 8 кГц, моно, 8 бит, тишина (значение 128).
function silentWav(ms) {
  const n = Math.round(8 * ms);
  const b = Buffer.alloc(44 + n, 128);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n, 4); b.write('WAVE', 8);
  b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(8000, 24); b.writeUInt32LE(8000, 28); b.writeUInt16LE(1, 32); b.writeUInt16LE(8, 34);
  b.write('data', 36); b.writeUInt32LE(n, 40);
  return b;
}

export default function ttsService() {
  return {
    name: 'darsliklar-tts-service',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = ROUTE.exec(req.url || '');
        if (!m) return next();
        const [, sid, mode] = m;
        const q = new URL(req.url, 'http://x').searchParams;
        const text = q.get('text') || '';
        const spoken = text.replace(/^\s*\[[^\]]*\]\s*/, '');
        const head = req.method === 'HEAD';

        // Звук отдаётся и целиком, и кусками (Range), как настоящим сервером:
        // Safari без этого аудио не играет. Перед загрузкой он присылает пробу
        // «bytes=0-1», а за ней — запрос всего файла; Chrome, бывает, дочитывает
        // хвост отдельным запросом. Реплика при этом одна.
        const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || '').trim());
        const from = range && range[1] !== '' ? Number(range[1]) : 0;
        const probe = !!range && range[2] !== '' && Number(range[2]) - from < 16;

        // В журнал — одна строка на реплику: только запрос, с которого звук
        // начинается. Не пишем пробу и дочитку (Range), повторы (&r=2, &r=3) —
        // их урок делает сам, когда сервис не ответил, — и прогрев (HEAD).
        if (!head && !q.get('r') && from === 0 && !probe) {
          server.ws.send({ type: 'custom', event: 'darsliklar:tts', data: { sid, mode, text, g: q.get('g') || null } });
        }

        if (mode === 'browser') {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end('Сервис озвучки в режиме «Браузер» недоступен — урок переходит на голос браузера.');
          return;
        }
        const ms = mode === 'fast' ? Math.max(350, estimateMs(spoken) / 6) : estimateMs(spoken);
        const wav = silentWav(ms);
        const total = wav.length;
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'no-store');
        if (range) {
          const end = Math.min(total - 1, range[2] !== '' ? Number(range[2]) : total - 1);
          if (from > end) {
            res.statusCode = 416;
            res.setHeader('Content-Range', `bytes */${total}`);
            res.end();
            return;
          }
          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${from}-${end}/${total}`);
          res.setHeader('Content-Length', String(end - from + 1));
          res.end(head ? undefined : wav.subarray(from, end + 1));
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Length', String(total));
        res.end(head ? undefined : wav);
      });
    },
  };
}
