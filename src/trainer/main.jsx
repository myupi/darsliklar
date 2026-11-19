// Эмуляция LMS Junior для тренажёра (18.11.2026). Открывается просмотрщиком в iframe (раздел «Тренажёр»):
//   /trainer.html?t=html&lang=uz&rejim=reward&gacha=4&n=15&saqlash=ok
// Тренажёр получает те же пропсы, что в LMS: { attempt, lang, busy, onAnswer, onFinished, onRestart, onExit }.
// LMS здесь — этот файл: выбирает вопросы, открывает их по одному, «сохраняет» ответ (busy), считает итог и награду.
//   t        — тренажёр (src/shared/trainers.js): html, g01 …
//   rejim    — reward (с наградой) | practice (без награды)
//   gacha    — пройдено уроков: вопросы только из уроков 1…gacha (пусто — весь модуль); blok — блок образца (b01…)
//   n        — вопросов в попытке (15)
//   saqlash  — ok (0,3 с) | slow (1,5 с) | fail (первое сохранение ответа и первое завершение падают)
//   exit=0, restart=0 — LMS не передаёт onExit / onRestart (кнопок нет)
//   savol    — один вопрос банка без вводного экрана (просмотр вопроса), javob — уже отвеченный этим вариантом (или текстом)
// «Впиши ответ» (text_input): onAnswer(questionId, текст) — LMS сравнивает текст с accepted_answers мягко (normAnswer).
//   qa=1     — window.__trenajor.show(id, opt) для замера всех вопросов (tools/trenajor/sweep.js)
// Всё, что тренажёр делает с LMS, уходит в журнал просмотрщика (src/runtime/bridge.js).
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from '../player/ErrorBoundary.jsx';
import { reportError } from '../player/report.js';
import { emit } from '../runtime/bridge.js';
import { trainerById, loadTrainer, loadBank, checkAnswer } from '../shared/trainers.js';

const q = new URLSearchParams(window.location.search);
const P = {
  t: q.get('t') || 'html',
  lang: q.get('lang') || 'uz',
  kind: q.get('rejim') === 'practice' ? 'practice' : 'reward',
  upto: Number(q.get('gacha')) || 0,
  block: q.get('blok') || '',
  n: Number(q.get('n')) || 15,
  save: q.get('saqlash') || 'ok',
  exit: q.get('exit') !== '0',
  restart: q.get('restart') !== '0',
  one: q.get('savol') || '',
  oneOpt: q.has('javob') ? q.get('javob') : null,
  qa: q.get('qa') === '1',
};
const COINS = 1; const POINTS = 10;   // как на экранах LMS: 1 coin + 10 point за верный ответ
const now = () => {
  const d = new Date(Date.now() + 5 * 3600e3);   // время LMS — Ташкент
  return d.toISOString().slice(0, 19).replace('T', ' ');
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

window.addEventListener('error', (e) => reportError(e.message, { stack: e.error && e.error.stack }));
window.addEventListener('unhandledrejection', (e) => reportError(String((e.reason && e.reason.message) || e.reason), { stack: e.reason && e.reason.stack }));

// Ответ, как его хранит LMS: у «впиши ответ» option_id — вписанный текст (и answer_text), correct — по мягкому сравнению.
// «Собери», «найди ошибку», «нажми на странице» — тоже строка: id кусочков через запятую, номер строки, место на странице.
const answerOf = (x, value) => (x.question_type === 'text_input'
  ? { question_id: x.question_id, option_id: value, answer_text: value, correct: checkAnswer(x, value) }
  : { question_id: x.question_id, option_id: value, correct: checkAnswer(x, value) });

function poolOf(tr, bank) {
  if (tr.pick === 'block') return bank.filter((x) => x.block_id === (P.block || tr.blocks[0]));
  return bank.filter((x) => !P.upto || (x.lesson != null && x.lesson <= P.upto));
}

function Message({ title, text }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#F4F5F7', fontFamily: 'Inter, system-ui, sans-serif', color: '#1E1B39', textAlign: 'center' }}>
      <div style={{ maxWidth: 360, padding: '22px 24px', borderRadius: 18, background: '#fff', boxShadow: '0 0 0 1px #ECEAF1, 0 10px 30px rgba(30,27,57,.06)' }}>
        <b style={{ display: 'block', fontSize: 17, marginBottom: 8 }}>{title}</b>
        <span style={{ fontSize: 14, color: '#6E6A85', lineHeight: 1.45 }}>{text}</span>
      </div>
    </div>
  );
}

function Lms({ tr, Trainer, bank }) {
  const size = tr.fixedSize ? tr.size : P.n;
  const [seed, setSeed] = useState(0);
  const pool = useMemo(() => poolOf(tr, bank), [tr, bank]);
  const picked = useMemo(() => {
    if (P.one) { const x = bank.find((z) => z.question_id === P.one); return x ? [x] : []; }
    return shuffle(pool).slice(0, size);
  }, [pool, seed]);
  const N = P.one ? 1 : size;
  const [answers, setAnswers] = useState(() => {
    if (!P.one || P.oneOpt === null || !picked[0]) return [];
    return [answerOf(picked[0], P.oneOpt)];
  });
  const [status, setStatus] = useState('in_progress');
  const [busy, setBusy] = useState(false);
  const [startedAt, setStartedAt] = useState(now);
  const [finishedAt, setFinishedAt] = useState(null);
  const fails = useRef({ answer: P.save === 'fail', finish: P.save === 'fail' });
  const finishes = useRef(0);
  const [qa, setQa] = useState(null);

  useEffect(() => {
    if (P.one || !picked.length) return;
    emit('trainer', { kind: 'attempt', mode: P.kind, size: N, pool: pool.length,
      from: tr.pick === 'block' ? 'блок ' + (P.block || tr.blocks[0]) : P.upto ? 'уроки 1–' + P.upto : 'весь модуль',
      ids: picked.map((x) => x.question_id) });
  }, [picked]);

  // qa: show(id, opt) — один вопрос; screen('intro' | 'result', n, wrong) — вводный экран или итог попытки из n вопросов
  // (по одному из разных уроков — самый длинный список «По урокам»; wrong — каждый какой ответ неверный: 3 — каждый третий, 1 — все).
  if (P.qa) window.__trenajor = { ids: bank.map((x) => x.question_id), show: (id, opt) => setQa({ id, opt, t: Date.now() }),
    screen: (kind, n = 15, wrong = 3) => setQa({ screen: kind, n, wrong, t: Date.now() }) };
  if (qa && qa.screen) {
    const byL = {}; bank.forEach((x) => { (byL[x.lesson] = byL[x.lesson] || []).push(x); });
    const ls = Object.keys(byL); const qs = [];
    for (let i = 0; qs.length < qa.n && i < 50; i++) ls.forEach((l) => { if (qs.length < qa.n && byL[l][i]) qs.push(byL[l][i]); });
    const res = qa.screen === 'result';
    const ans = res ? qs.map((x, i) => ({ ...answerOf(x, x.correct_answer), correct: (i + 1) % qa.wrong !== 0 })) : [];
    const c = ans.filter((a) => a.correct).length;
    const a = { kind: P.kind, status: res ? 'finished' : 'in_progress', question_count: qa.n, started_at: 'qa' + qa.t, finished_at: res ? 'qa' : null,
      coins_per_correct: COINS, points_per_correct: POINTS, correct_count: c, answers: ans,
      questions: res ? qs : qs.map((x) => ({ ...x, correct_answer: null })),
      reward: res && P.kind === 'reward' ? { coins: c * COINS, points: c * POINTS } : null, reward_date: res && P.kind === 'reward' ? now().slice(0, 10) : null };
    return <Trainer key={qa.t} attempt={a} lang={P.lang} busy={false} onAnswer={() => {}} onFinished={() => {}} onRestart={() => {}} onExit={() => {}} />;
  }
  if (qa) {
    const x = bank.find((z) => z.question_id === qa.id);
    const opt = qa.opt === undefined ? x.correct_answer : qa.opt;   // null — без ответа
    const a = { kind: P.kind, status: 'in_progress', question_count: 1, started_at: 'qa' + qa.t, coins_per_correct: COINS, points_per_correct: POINTS,
      questions: [opt === null ? { ...x, correct_answer: null } : x], answers: opt === null ? [] : [answerOf(x, opt)] };
    return <Trainer key={qa.t} attempt={a} lang={P.lang} busy={false} intro={false} onAnswer={() => {}} onFinished={() => {}} />;
  }

  if (!picked.length) return <Message title="Вопрос не найден" text={P.one || ''} />;
  if (!P.one && picked.length < N) {
    return <Message title="LMS не запустит тренажёр" text={`В выборке ${pool.length} вопросов, а для попытки нужно ${N}. Отметь больше пройденных уроков.`} />;
  }

  const done = status === 'finished';
  const correct = answers.filter((a) => a.correct).length;
  const attempt = {
    kind: P.kind, status, question_count: N, started_at: startedAt, finished_at: finishedAt,
    coins_per_correct: COINS, points_per_correct: POINTS, correct_count: correct, answers,
    questions: picked.slice(0, done ? N : Math.min(N, answers.length + 1)).map((x, i) => (i < answers.length ? x : { ...x, correct_answer: null })),
    reward: done && P.kind === 'reward' ? { coins: correct * COINS, points: correct * POINTS } : null,
    reward_date: done && P.kind === 'reward' ? now().slice(0, 10) : null,
  };
  const delay = P.save === 'slow' ? 1500 : 300;

  const onAnswer = async (id, opt) => {
    const i = answers.length + 1;
    setBusy(true); await wait(delay);
    if (fails.current.answer) {
      fails.current.answer = false; setBusy(false);
      emit('trainer', { kind: 'answer-fail', n: i, id, option: opt });
      throw new Error('save failed');
    }
    const x = picked.find((z) => z.question_id === id);
    const a = answerOf(x, opt);
    setAnswers((arr) => [...arr, a]);
    setBusy(false);
    emit('trainer', { kind: 'answer', n: i, of: N, id, option: opt, qtype: x.question_type, typed: x.question_type === 'text_input', correct: a.correct, right: x.correct_answer });
  };
  const onFinished = async () => {
    setBusy(true); await wait(delay + 100);
    if (fails.current.finish) {
      fails.current.finish = false; setBusy(false);
      emit('trainer', { kind: 'finish-fail' });
      throw new Error('finish failed');
    }
    finishes.current += 1;
    const fin = now();
    setStatus('finished'); setFinishedAt(fin); setBusy(false);
    emit('finished', { count: finishes.current, payload: {
      kind: P.kind, question_count: N, correct_count: correct, wrong_count: N - correct,
      reward: P.kind === 'reward' ? { coins: correct * COINS, points: correct * POINTS } : null,
      started_at: startedAt, finished_at: fin,
      answers: answers.map((a) => Object.assign({ question_id: a.question_id, option_id: a.option_id, correct: a.correct }, a.answer_text != null ? { answer_text: a.answer_text } : {})),
    } });
  };
  const onRestart = () => {
    emit('trainer', { kind: 'restart' });
    setAnswers([]); setStatus('in_progress'); setFinishedAt(null); setStartedAt(now()); setSeed((s) => s + 1);
    fails.current = { answer: P.save === 'fail', finish: P.save === 'fail' };
  };
  const onExit = () => emit('trainer', { kind: 'exit' });

  return <Trainer attempt={attempt} lang={P.lang} busy={busy} onAnswer={onAnswer} onFinished={onFinished}
    onRestart={P.restart && !P.one ? onRestart : undefined} onExit={P.exit ? onExit : undefined}
    {...(P.one ? { intro: false } : {})} />;
}

function Boot() {
  const tr = trainerById(P.t);
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!tr || tr.status !== 'ready') return;
    const t0 = performance.now();
    Promise.all([loadTrainer(tr), loadBank(tr)]).then(([Trainer, bank]) => {
      setState({ Trainer, bank });
      emit('loaded', { ms: Math.round(performance.now() - t0), component: Trainer.name || 'Trainer', props: ['attempt', 'lang', 'busy', 'onAnswer', 'onFinished', 'onRestart', 'onExit'] });
    }).catch((e) => reportError(e.message, { stack: e.stack }));
  }, []);
  if (!tr) return <Message title="Тренажёр не найден" text={P.t} />;
  if (tr.status !== 'ready') return <Message title={`Тренажёр ${tr.title} ещё не собран`} text={`Нужны файлы в trenajor/${tr.dir}/`} />;
  if (!state) return null;
  return <Lms tr={tr} Trainer={state.Trainer} bank={state.bank} />;
}

createRoot(document.getElementById('root')).render(<ErrorBoundary><Boot /></ErrorBoundary>);
