// Правка жизненного цикла завершения v1 в тестовых копиях 30 и 31 (05.11.2026, по проверке контракта
// «JSX-contract-review-2026-11-05»):
//   1. Состояние отправки (фаза, снимок результата, повтор) — своё у каждого открытия урока (makeV1 в useLessonRoot),
//      а не на уровне модуля: платформа кеширует скомпилированный урок, и повторное открытие в той же вкладке
//      видело «saqlandi» прошлого раза и не отправляло заново.
//   Время и журнал заданий при перезагрузке не трогаем: прогресс этих уроков живёт только в памяти
//   (safeStorage = null, бриф), перезагрузка начинает урок и счёт времени заново — расхождения нет.
// Используется сборщиком build.mjs (fixLifecycle(s, 'src')); готовые копии правятся без пересборки озвучки:
//   node tools/managed-test/v1-fix.mjs --apply
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const V1 = String.raw`
// ── ЗАВЕРШЕНИЕ: КОНТРАКТ v1 (тестовая копия, 04.11.2026; жизненный цикл — 05.11.2026) ──────────
// await onFinished({ contractVersion: 1, passed, results, analytics, meta }). Монеты считает сервер.
// passed: true — урок пройден до вывода (оценки в курсе HTML нет). Пока ответа нет — «Saqlanmoqda…»,
// сбой — понятная ошибка и «Qayta yuborish» с тем же результатом; успех показываем только после ответа.
// Состояние отправки — своё у каждого открытия урока (makeV1 в useLessonRoot), глобального состояния нет.
const V1_UI = {
  saving: "Natija saqlanmoqda…",
  saved: "Natija saqlandi. Barakalla!",
  failed: "Natijani saqlab bo'lmadi. Internetni tekshirib, qayta yuboring.",
  retry: "Qayta yuborish"
};
const jsonSafe = (v) => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'number' && !isFinite(x) ? null : x)));
function toContractV1(old) {
  const o = old || {};
  const answers = Array.isArray(o.answers) ? o.answers : [];
  const custom = {};
  Object.keys(o).forEach((k) => {
    if (['lessonId', 'lessonTitle', 'module', 'student', 'lang', 'durationSec', 'answers', 'totalQuestions', 'correctAnswers', 'scorePercent', 'finalScore', 'finalTotal', 'passed'].indexOf(k) < 0 && o[k] != null) custom[k] = o[k];
  });
  return jsonSafe({
    contractVersion: 1,
    passed: true,
    results: { custom: Object.assign({ screensDone: true }, custom) },
    analytics: { durationSec: Math.max(0, Math.round(o.durationSec || 0)), finishedAt: new Date().toISOString(), custom: { tasks: answers } },
    meta: { lessonId: o.lessonId || null, lang: o.lang || null }
  });
}
// Отправка одного открытия урока: один снимок результата; повтор шлёт его же; второй клик во время
// отправки и после успеха ничего не делает.
function makeV1() {
  let st = { phase: 'idle' };
  let payload = null, send = null;
  const subs = new Set();
  const set = (patch) => { st = Object.assign({}, st, patch); subs.forEach((f) => f(st)); };
  return {
    get: () => st,
    sub: (f) => { subs.add(f); return () => { subs.delete(f); }; },
    retry: () => { if (send) send(); },
    submit(onFinished, old) {
      if (payload) return;
      payload = toContractV1(old);
      send = () => {
        if (st.phase === 'saving' || st.phase === 'saved') return;
        set({ phase: 'saving' });
        let res;
        try { res = typeof onFinished === 'function' ? onFinished(payload) : null; } catch (e) { set({ phase: 'failed' }); return; }
        Promise.resolve(res).then(() => set({ phase: 'saved' }), () => set({ phase: 'failed' }));
      };
      send();
    }
  };
}
function V1Status({ v1 }) {
  const [s, setS] = useState(() => v1.get());
  useEffect(() => { const off = v1.sub(setS); setS(v1.get()); return off; }, [v1]);
  if (s.phase === 'idle') return null;
  const box = { position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', padding: 24, zIndex: 50, fontFamily: 'Inter, system-ui, sans-serif' };
  const card = { maxWidth: 420, padding: '22px 24px', borderRadius: 16, background: '#fff', boxShadow: '0 10px 30px rgba(15,23,42,.12)', textAlign: 'center', color: '#0F172A', fontSize: 17, lineHeight: 1.4 };
  const btn = { marginTop: 14, padding: '12px 20px', border: 0, borderRadius: 12, background: '#FA4F28', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 0 #C93A19' };
  return (
    <div style={box} role="status" aria-live="polite">
      <div style={card}>
        <div>{V1_UI[s.phase]}</div>
        {s.phase === 'failed' ? <button type="button" style={btn} onClick={() => v1.retry()}>{V1_UI.retry}</button> : null}
      </div>
    </div>
  );
}

`;

const must = (s, from, to, what) => {
  if (s.split(from).length !== 2) throw new Error('v1-fix: не найдено ровно одно место — ' + what);
  return s.replace(from, () => to);
};

// mode 'src' — исходник урока курса (до замены onFinished); 'built' — уже собранная копия со старым v1.
export function fixLifecycle(s, mode) {
  s = must(s, '  const finished = useRef(false);\n',
    '  const finished = useRef(false);\n  const v1 = useMemo(() => makeV1(), []);   // состояние отправки — своё у каждого открытия урока\n', 'finished');
  const call = mode === 'built' ? '    v1Submit(onFinished, payload);' : "    if (typeof onFinished === 'function') onFinished(payload);";
  s = must(s, '\n' + call + '\n', '\n    v1.submit(onFinished, payload);\n', 'finish');
  s = must(s, '  }, [audio, meta, studentName, lang, rows, store, onFinished, extraPayload, progress]);',
    '  }, [audio, meta, studentName, lang, rows, store, onFinished, extraPayload, progress, v1]);', 'deps finish');
  s = must(s, '  return { i, lang, setLang, audio, store, log, next, prev, go, finish, done, displayName, Shell, runN };',
    '  return { i, lang, setLang, audio, store, log, next, prev, go, finish, done, displayName, Shell, runN, v1 };', 'return R');
  if (mode === 'built') {
    const x = s.indexOf('\n// ── ЗАВЕРШЕНИЕ: КОНТРАКТ v1');
    const y = s.indexOf('// Реплики экрана для прогрева');
    if (x < 0 || y < x) throw new Error('v1-fix: блок v1 не найден');
    s = s.slice(0, x) + V1 + s.slice(y);
    s = must(s, ': <V1Status />}', ': <V1Status v1={R.v1} />}', 'корень');
  }
  if (/\b_v1\b|v1Submit|_v1Subs/.test(s)) throw new Error('v1-fix: осталось глобальное состояние отправки');
  return s;
}

if (process.argv.includes('--apply')) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  for (const f of ['lessons/test/30-urok1-yangi-ovoz.jsx', 'lessons/test/31-urok2-yangi-ovoz.jsx']) {
    const p = join(root, f);
    writeFileSync(p, fixLifecycle(readFileSync(p, 'utf8'), 'built'));
    console.log('Поправлен ' + f);
  }
}
